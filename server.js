const http = require('http');
const express = require('express');
const fs = require('fs');
const parser = require('body-parser');
const app = require('express')();
const exec = require('child_process').exec;
const { execSync } = require('child_process');
const path = require('path');
const icons = require("./random_icon.js");
const zip = require('express-easy-zip');
const cookieParser = require('cookie-parser');

const makejson = require("./random_json.js");
const modStrings = require("./mod_strings.js");
const modTreeJson = require("./mod_civTechTree.js");

const hostname = 'localhost';
const port = 3000;

const server = require('http').Server(app);
const io = require('socket.io')(server);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(
  parser.urlencoded({
    extended: false,
    limit: '20mb',
  })
);
app.use(parser.json({limit: '20mb'}));

app.use(zip());
app.use(cookieParser());

app.use(express.static('public'));
app.use(express.static('public/aoe2techtree'));

//0 = vanilla, 1 = allow generated bonuses
const num_bonuses = [
	[140, 287],	//Civ bonuses
	[39, 79],	//Unique units
	[39, 44],	//Castle techs
	[39, 44],	//Imp techs
	[37, 75]	//Team bonuses
];

//Names and colours for flags
const nameArr = ['britons', 'franks', 'goths', 'teutons', 'japanese', 'chinese', 'byzantines', 'persians', 'saracens', 'turks', 'vikings', 'mongols', 'celts', 'spanish', 'aztecs', 'mayans',
		'huns', 'koreans', 'italians', 'indians', 'inca', 'magyars', 'slavs', 'portuguese', 'ethiopians', 'malians', 'berber', 'khmer', 'malay', 'burmese', 'vietnamese', 'bulgarians',
		'tatars', 'cumans', 'lithuanians', 'burgundians', 'sicilians', 'poles', 'bohemians']
const colours = [[0, 0, 0], [255, 255, 255], [217, 0, 0], [0, 173, 54], [249, 233, 13], [0, 0, 128], [255, 153, 51], [0, 162, 221], [84, 14, 125], [224, 58, 213],[73, 235, 173], [66, 30, 1],
		[92, 92, 92], [255, 171, 202], [171, 207, 255]]

//Maps path files for unique unit icon images to their unique units
//Swap 043 and 037? all the mapping back and forth is quite confusing and requires more testing
const iconids = ['041', '046', '050', '045', '044', '036', '035', '043', '037', '039', '038', '042', '047', '106', '110', '108', '105', '117', '133', '093', '097', '099', '114', '190', '195', '197', '191', '231', '233', '230', '232', '249', '251', '252', '253', '355', '356', '369', '370', '377', '351', '058', '299', '144', '300', '138', '139', '132', '166', '165', '297', '357', '260', '146', '379', '256', '376', '325', '236', '053', '207', '350', '136', '359', '368', '366', '206', '163', '361', '216', '162', '181', '259', '119', '081', '243', '375', '327', '319']
const blanks = ['040', '079', '107', '116', '134', '143', '185', '198', '201', '229', '270', '354', '371', '372']

//Maps website techtree indices to data.json techtree indices
const indexDictionary = [
{
	'4': 18,
	'5': 25,
	'6': 22,
	'7': 21,
	'13': 130,
	'17': 131,
	'21': 73,
	'24': 19,
	'36': 53,
	'38': 32,
	'39': 23,
	'74': 4,
	'75': 5,
	'77': 6,
	'93': 9,
	'125': 134,
	'128': 135,
	'279': 50,
	'280': 47,
	'283': 33,
	'329': 35,
	'330': 36,
	'331': 133,
	'358': 10,
	'359': 11,
	'420': 75,
	'422': 45,
	'440': 136,
	'441': 31,
	'442': 74,
	'448': 29,
	'473': 7,
	'474': 24,
	'492': 20,
	'527': 70,
	'528': 71,
	'529': 67,
	'532': 68,
	'539': 72,
	'542': 51,
	'546': 30,
	'545': 132,
	'548': 46,
	'550': 48,
	'567': 8,
	'569': 34,
	'588': 49,
	'691': 76,
	'751': 12,
	'752': 125,
	'753': 13,
	'1103': 66,
	'1104': 69,
	'1105': 52,
	'1132': 37,
	'1134': 38,
	'1258': 44,
	'1370': 39,
	'1372': 40
},
{
	'12': 137,
	'45': 138,
	'49': 43,
	'50': 139,
	'70': 140,
	'72': 141,
	'79': 142,
	'82': 143,
	'84': 144,
	'87': 17,
	'101': 28,
	'103': 145,
	'104': 146,
	'117': 126,
	'155': 83,
	'199': 147,
	'209': 148,
	'234': 85,
	'235': 86,
	'236': 91,
	'276': 149,
	'598': 150,
	'487': 126
},
{
	'8': 107,
	'12': 124,
	'13': 123,
	'14': 122,
	'15': 121,
	'17': 120,
	'22': 151,
	'23': 119,
	'39': 42,
	'45': 103,
	'47': 90,
	'48': 118,
	'50': 81,
	'51': 82,
	'54': 89,
	'55': 111,
	'65': 77,
	'67': 60,
	'68': 127,
	'74': 63,
	'75': 128,
	'76': 64,
	'77': 65,
	'80': 62,
	'81': 129,
	'82': 61,
	'93': 84,
	'101': 152,
	'102': 153,
	'103': 154,
	'182': 112,
	'199': 57,
	'200': 58,
	'201': 59,
	'202': 115,
	'203': 116,
	'211': 54,
	'212': 55,
	'213': 109,
	'215': 15,
	'219': 56,
	'221': 117,
	'230': 105,
	'231': 101,
	'233': 104,
	'249': 110,
	'252': 102,
	'278': 113,
	'279': 114,
	'280': 108,
	'315': 96,
	'316': 97,
	'319': 98,
	'321': 95,
	'322': 88,
	'373': 80,
	'374': 78,
	'375': 79,
	'377': 92,
	'379': 94,
	'380': 87,
	'435': 41,
	'436': 27,
	'437': 26,
	'438': 106,
	'439': 100,
	'441': 99,
	'602': 16,
	'608': 93,
	'716': 14
}
]


function os_func() {
	this.execCommand = function(cmd, callback) {
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.log(`stdout: ${stdout}`);
				console.error(`exec error: ${error}`);
				return;
			}
//			console.log(stdout);
			callback();
		});
	}
}

var os = new os_func();

const createDraft = (req, res, next) => {
	var raw_data = fs.readFileSync('./database.json');
	var data = JSON.parse(raw_data);
	var drafts = data['drafts'];
	var uniqueID = false;
	var id;
	while (uniqueID == false) {
		id = '';
		for (var i=0; i < 15; i++) {
			var rand = Math.floor(Math.random() * 10);
			id += rand;
		}
		uniqueID = true;
		for (var i=0; i<drafts.length; i++) {
			if (drafts[i]['id'] == id) {
				uniqueID = false;
			}
		}
	}

	var draft = {};
	draft['id'] = id;
	draft['timestamp'] = Date.now();

	var preset = {};
	preset['slots'] = parseInt(req.body.num_players, 10);
	preset['modded'] = req.body.new_bonuses;
	preset['points'] = parseInt(req.body.techtree_currency, 10);
	preset['rounds'] = parseInt(req.body.rounds, 10);
	draft['preset'] = preset;

	var players = [];
	for (var i=0; i<parseInt(req.body.num_players, 10); i++) {
		var player = {};
		player['ready'] = 0;
		player['name'] = '';
		player['alias'] = '';
		//Palette (color1, color2, color3, color4, color5), division, overlay, symbol
		player['flag_palette'] = [3, 4, 5, 6, 7, 3, 3, 3];
		//Units, buildings, techs
		player['tree'] = [
		        [13, 17, 21, 74, 545, 539, 331, 125, 83, 128, 440],
		        [12, 45, 49, 50, 68, 70, 72, 79, 82, 84, 87, 101, 103, 104, 109, 199, 209, 276, 562, 584, 598, 621, 792],
		        [22, 101, 102, 103, 408]
		];
		player['architecture'] = 1;
		player['language'] = 0;
		player['priority'] = -1;
		player['bonuses'] = [[], [], [], [], []];
		players.push(player);
	}
	draft['players'] = players;

	var gamestate = {};
	gamestate['phase'] = 0;
	gamestate['turn'] = 0;
	gamestate['available_cards'] = [];
	for (var i=0; i<5; i++) {
		var available_bonuses = [];
		var numBonus;
		if (req.body.new_bonuses === 'on') {
			numBonus = num_bonuses[i][1];
		} else {
			numBonus = num_bonuses[i][0];
		}
		for (var j=0; j<numBonus; j++) {
			available_bonuses.push(j);
		}
		gamestate['available_cards'].push(available_bonuses);
	}
	gamestate['cards'] = [];
	gamestate['order'] = [];
	gamestate['highlighted'] = [];
	draft['gamestate'] = gamestate;
	drafts.push(draft);
        fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));
	req.playerlink = 'https://krakenmeister.com/draft/player/' + id;
	req.hostlink = 'https://krakenmeister.com/draft/host/' + id;
	req.spectatorlink = 'https://krakenmeister.com/draft/' + id;
	next();
}

const checkCookies = (req, res, next) => {
	if ((req.cookies['draftID']) && (req.cookies['draftID'] == parseInt(req.params.id, 10)) && (req.cookies['playerNumber']) && (req.cookies['playerNumber'] >= 0)) {
		req.authenticated = -1;
	}
	next();
}

const authenticateDraft = (req, res, next) => {
	if (req.authenticated == -1) {
		return next();
	}
	var raw_data = fs.readFileSync('./database.json');
	var data = JSON.parse(raw_data);
	var drafts = data['drafts'];
	req.authenticated = 0;
	for (var i=0; i<drafts.length; i++) {
		if (drafts[i]['id'] == req.params.id) {
			req.authenticated = 1;
		}
	}
	next();
}

function getDraft (id) {
	var raw_data = fs.readFileSync('./database.json');
	var data = JSON.parse(raw_data);
	var drafts = data['drafts'];
	var index = -1;
	for (var i=0; i<drafts.length; i++) {
		if (drafts[i]['id'] == id) {
			index = i;
		}
	}
	if (index == -1) {
		console.log('draft doesn\'t exist');
		return -1;
	}
	return [data, index];
}

const setID = (req, res, next) => {
	req.params.id = req.body.draftID;
	next();
}

//Check if there's room in the lobby for another player
const checkSpace = (req, res, next) => {
	if (req.authenticated == -1) {
		return next();
	}
	var raw_data = fs.readFileSync('./database.json');
	var data = JSON.parse(raw_data);
	var drafts = data['drafts'];
	var index = -1;
	for (var i=0; i<drafts.length; i++) {
		if (drafts[i]['id'] == req.body.draftID) {
			index = i;
		}
	}
	if (index == -1) {
		console.log('Draft authentication failed');
		return next();
	}
	if (req.body.joinType == 0) {
		if (drafts[index]['players'][0]['name'] == '') {
			drafts[index]['players'][0]['name'] = req.body.civ_name;
		        fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));
			req.playerNumber = 0;
		} else {
			req.authenticated = 2;
		}
		next();
	} else {
		for (var i=1; i<drafts[index]['preset']['slots']; i++) {
			if (drafts[index]['players'][i]['name'] == '') {
				drafts[index]['players'][i]['name'] = req.body.civ_name;
				req.playerNumber = i;
			        fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));
				return next();
			}
		}
		req.authenticated = 3;
		next();
	}
}

//Refill available cards with any and all cards that players don't own and aren't currently on the board
function reshuffleCards (draft) {
	var numPlayers = draft['preset']['slots'];
	var roundType = Math.max((Math.floor(draft['gamestate']['turn']/numPlayers) - (draft['preset']['rounds'] - 1)), 0);

	var available_bonuses = [];
	var numBonus;

	if (draft['preset']['modded'] === 'on') {
		numBonus = num_bonuses[roundType][1];
	} else {
		numBonus = num_bonuses[roundType][0];
	}
	for (var i=0; i<numBonus; i++) {
		var discarded = 1;
		for (var j=0; j<numPlayers; j++) {
			if (draft['players'][j]['bonuses'][roundType].includes(i)) {
				discarded = 0;
			}
		}
		if (draft['gamestate']['cards'].includes(i)) {
			discarded = 0;
		}
		if (discarded == 1) {
			available_bonuses.push(i);
		}
	}
	return available_bonuses;
}

const createModFolder = (req, res, next) => {
	os.execCommand(`sh createModFolder.sh ./modding/requested_mods ${req.body.seed}`, function() {
		next();
	});
}

const createCivIcons = (req, res, next) => {
	icons.generateFlags(`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/menu/civs`, `./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons`, `./public/symbols`);
	next();
}

const copyCivIcons = (req, res, next) => {
	os.execCommand(`cp -r ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/. ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/resources/_common/wpfg/resources/civ_techtree`, function() {
		next();
	});
}

const generateJson = (req, res, next) => {
	makejson.createJson(`./modding/requested_mods/${req.body.seed}/data.json`, `${req.body.costs}`);
	next();
}

const writeNames = (req, res, next) => {
	modStrings.interperateLanguage(`./modding/requested_mods/${req.body.seed}/data.json`, `./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/resources/en/strings/key-value/key-value-modded-strings-utf8.txt`);
	next();
}

const copyNames = (req, res, next) => {
	os.execCommand(`sh copyLanguages.sh ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/resources`, function () {
		next();
	});
}

const addVoiceFiles = (req, res, next) => {
	let command = `./copyVoices.sh /var/www/krakenmeister.com/civbuilder/modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/resources/_common/drs/sounds`;
	let data = fs.readFileSync(`./modding/requested_mods/${req.body.seed}/data.json`);
	let info = JSON.parse(data);

	for (var i=0; i<info.language.length; i++) {
		command += ` ${info.language[i]}`;
	}

	os.execCommand(command, function () {
		next();
	});
}

const writeUUIcons = (req, res, next) => {
	for (var i=0; i<blanks.length; i++) {
		os.execCommand(`cp ./public/uniticons/blank.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/resources/_common/wpfg/resources/uniticons/${blanks[i]}_50730.png`, function () {});
	}
	var data = fs.readFileSync(`./modding/requested_mods/${req.body.seed}/data.json`);
	var civ = JSON.parse(data);
	for (var i=0; i<civ.techtree.length; i++) {
		//Persians and Saracens are index 7 & 8 but War Elephants and Mamelukes are index 8 & 7
		var iconsrc = iconids[civ.techtree[i][0]];
		if (civ.techtree[i][0] == 7) {
			iconsrc = iconids[8];
		} else if (civ.techtree[i][0] == 8) {
			iconsrc = iconids[7];
		}
		if (i == (civ.techtree.length - 1)) {
			os.execCommand(`cp ./public/uniticons/${iconsrc}_50730.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/resources/_common/wpfg/resources/uniticons/${iconids[i]}_50730.png`, function () {
				next();
			});
		} else {
			os.execCommand(`cp ./public/uniticons/${iconsrc}_50730.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/resources/_common/wpfg/resources/uniticons/${iconids[i]}_50730.png`, function () {});
		}
	}
}

const writeTechTree = (req, res, next) => {
	modTreeJson.arrangeTechTree(`./modding/requested_mods/${req.body.seed}/data.json`, `./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/civTechTrees.json`);
	next();
}

const writeDatFile = (req, res, next) => {
	os.execCommand(`./modding/build/create-data-mod ./modding/requested_mods/${req.body.seed}/data.json ./public/empires2_x2_p1.dat ./modding/requested_mods/${req.body.seed}/${req.body.seed}-data/resources/_common/dat/empires2_x2_p1.dat`, function () {
		next();
	});
}

const zipModFolder = (req, res, next) => {
	os.execCommand(`sh zipModFolder.sh ${req.body.seed}`, function () {
		next();
	});
}

const writeIconsJson = (req, res, next) => {
	//Parse multiple Json civ presets
	var raw_presets = JSON.parse(req.body.presets)
	var civs = raw_presets['presets']
	//Create Civ Icons
	var blankOthers = false;
	for (var i=0; i<civs.length; i++) {
		var civName = nameArr[i]
		if (civs[i]['flag_palette'][0] == -1) {
			//Secret password unlocked a vanilla flag
			if (civName == 'berber' || civName == 'inca') {
				execSync(`cp ./public/VanillaCivs/flag_${civs[i]['flag_palette'][1]}.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/menu/civs/${civName}s.png`);
			} else {
				execSync(`cp ./public/VanillaCivs/flag_${civs[i]['flag_palette'][1]}.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/menu/civs/${civName}.png`);
			}
			execSync(`cp ./public/VanillaCivs/flag_${civs[i]['flag_palette'][1]}.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}.png`);
			execSync(`cp ./public/VanillaCivs/flag_${civs[i]['flag_palette'][1]}.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_hover.png`);
			execSync(`cp ./public/VanillaCivs/flag_${civs[i]['flag_palette'][1]}.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_pressed.png`);
			blankOthers = true;
		} else {
			//Draw the customized flag
			var seed = [[colours[civs[i]['flag_palette'][0]],
					colours[civs[i]['flag_palette'][1]],
					colours[civs[i]['flag_palette'][2]],
					colours[civs[i]['flag_palette'][3]],
					colours[civs[i]['flag_palette'][4]]],
					civs[i]['flag_palette'][5],
					civs[i]['flag_palette'][6]];
			var symbol = civs[i]['flag_palette'][7] - 1;

			if (civName == 'berber' || civName == 'inca') {
				icons.drawFlag(seed, symbol, `./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/menu/civs/${civName}s.png`,
					`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}.png`,
					`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_hover.png`,
					`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_pressed.png`,
					`./public/symbols`);
			} else {
				icons.drawFlag(seed, symbol, `./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/menu/civs/${civName}.png`,
					`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}.png`,
					`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_hover.png`,
					`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_pressed.png`,
					`./public/symbols`);
			}
		}
	}
	if (blankOthers) {
		//If there was a vanilla civ amongst the bunch, blank out all others to make it clearer
		for (var i=civs.length; i<39; i++) {
			if (nameArr[i] == 'berber' || nameArr[i] == 'inca') {
				execSync(`cp ./public/VanillaCivs/blank.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/menu/civs/${nameArr[i]}s.png`);
			} else {
				execSync(`cp ./public/VanillaCivs/blank.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/menu/civs/${nameArr[i]}.png`);
			}
			execSync(`cp ./public/VanillaCivs/blank.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${nameArr[i]}.png`);
			execSync(`cp ./public/VanillaCivs/blank.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${nameArr[i]}_hover.png`);
			execSync(`cp ./public/VanillaCivs/blank.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${nameArr[i]}_pressed.png`);
		}
	}
	//Copy Civ Icons
	os.execCommand(`cp -r ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/. ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/resources/_common/wpfg/resources/civ_techtree`, function() {
		//Generate Json
		var mod_data = {};
		mod_data.name = [];
		mod_data.techtree = [];
		mod_data.castletech = [];
		mod_data.imptech = [];
		mod_data.civ_bonus = [];
		mod_data.team_bonus = [];
		mod_data.architecture = [];
		mod_data.language = [];
		mod_data.random_costs = 0;
		for (var i=0; i<civs.length; i++) {
			mod_data.name.push(civs[i]['alias']);
			var player_techtree = [];
			for (var j=0; j<155; j++) {
				player_techtree.push(0);
			}
			//Unique Unit
			if (civs[i]['bonuses'][1].length != 0) {
				player_techtree[0] = civs[i]['bonuses'][1][0];
			} else {
				player_techtree[0] = 0;
			}
			//Castle Tech
			if (civs[i]['bonuses'][2].length != 0) {
				var castletechs = [];
				for (var j=0; j<civs[i]['bonuses'][2].length; j++) {
					castletechs.push(civs[i]['bonuses'][2][j]);
				}
				mod_data.castletech.push(castletechs);
			} else {
				mod_data.castletech.push([0]);
			}
			//Imp Tech
			if (civs[i]['bonuses'][3].length != 0) {
				var imptechs = [];
				for (var j=0; j<civs[i]['bonuses'][3].length; j++) {
					imptechs.push(civs[i]['bonuses'][3][j]);
				}
				mod_data.imptech.push(imptechs);
			} else {
				mod_data.imptech.push([0]);
			}
			//Tech Tree
			for (var j=0; j<civs[i]['tree'].length; j++) {
				for (var k=0; k<civs[i]['tree'][j].length; k++) {
					player_techtree[indexDictionary[j][civs[i]['tree'][j][k].toString()]] = 1
				}
			}
			mod_data.techtree.push(player_techtree);

			mod_data.civ_bonus.push(civs[i]['bonuses'][0]);
			if (civs[i]['bonuses'][4].length != 0) {
				var team_bonuses = [];
				for (var j=0; j<civs[i]['bonuses'][4].length; j++) {
					team_bonuses.push(civs[i]['bonuses'][4][j]);
				}
				mod_data.team_bonus.push(team_bonuses);
			} else {
				mod_data.team_bonus.push([0]);
			}
			if (civs[i]['architecture'] === undefined) {
				mod_data.architecture.push(1)
			} else {
				mod_data.architecture.push(civs[i]['architecture'])
			}
			if (civs[i]['language'] === undefined) {
				mod_data.language.push(0)
			} else {
				mod_data.language.push(civs[i]['language'])
			}
		}
		fs.writeFileSync(`./modding/requested_mods/${req.body.seed}/data.json`, JSON.stringify(mod_data, null, 2));
		next();
	})
}

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/homepage/home.html');
});

/*app.get('/civbuilder', function (req, res) {
	res.sendFile(__dirname + '/public/updating.html');
});*/

app.get('/civbuilder', function (req, res) {
	res.sendFile(__dirname + '/public/civbuilder_home.html');
});

app.get('/build', function (req, res) {
	res.sendFile(__dirname + '/public/civbuilder.html');
});

app.post('/file', createModFolder, createCivIcons, copyCivIcons, generateJson, writeNames, copyNames, addVoiceFiles, writeUUIcons, writeTechTree, writeDatFile, zipModFolder, (req, res) => {
	res.download(__dirname + '/modding/requested_mods/' + (req.body.seed) + '.zip');
});

app.post('/create', createModFolder, writeIconsJson, writeNames, copyNames, addVoiceFiles, writeUUIcons, writeTechTree, writeDatFile, zipModFolder, (req, res) => {
	res.download(__dirname + '/modding/requested_mods/' + (req.body.seed) + '.zip');
});

app.post('/draft', createDraft, (req, res) => {
	res.render(__dirname + '/public/draft_links', {playerlink: req.playerlink, hostlink: req.hostlink, spectatorlink: req.spectatorlink});
});

app.post('/vanilla', (req, res) => {
	res.download(__dirname + '/public/VanillaCivs/VanillaJson.zip');
});

app.get('/view/:json', function (req, res) {
	res.sendFile(__dirname + '/public/view.html');
});

app.get('/edit/:json', function (req, res) {
	res.sendFile(__dirname + '/public/edit.html');
});

app.get('/events', function (req, res) {
	res.sendFile(__dirname + '/public/events/event.html');
});

app.get('/turbos', function (req, res) {
	res.sendFile(__dirname + '/public/events/turbos.html');
});

app.get('/showmatch1', function (req, res) {
	res.sendFile(__dirname + '/public/events/showmatch1.html');
});

app.get('/showmatch2', function (req, res) {
	res.sendFile(__dirname + '/public/events/showmatch2.html');
});

app.get('/draft/host/:id', checkCookies, authenticateDraft, function (req, res) {
	if (req.authenticated == -1) {
		res.redirect('/draft/' + req.params.id);
	} else if (req.authenticated == 0) {
		res.render(__dirname + '/public/error', {error: 'Draft does not exist'});
	} else if (req.authenticated == 1) {
		res.sendFile(__dirname + '/public/join.html');
	}
});

app.get('/draft/player/:id', checkCookies, authenticateDraft, function (req, res) {
	if (req.authenticated == -1) {
		res.redirect('/draft/' + req.params.id);
	} else if (req.authenticated == 0) {
		res.render(__dirname + '/public/error', {error: 'Draft does not exist'});
	} else if (req.authenticated == 1) {
		res.sendFile(__dirname + '/public/join.html');
	}
});

app.post('/join', setID, checkCookies, authenticateDraft, checkSpace, (req, res) => {
	if (req.authenticated == -1) {
		res.redirect('/draft/' + req.body.draftID);
	} else if (req.authenticated == 0) {
		res.render(__dirname + '/public/error', {error: 'Draft does not exist'});
	} else if (req.authenticated == 1) {
		res.cookie('playerNumber', req.playerNumber);
		res.cookie('draftID', req.body.draftID);
		res.redirect('/draft/' + req.body.draftID);
	} else if (req.authenticated == 2) {
		res.render(__dirname + '/public/error', {error: 'Host already joined'});
	} else if (req.authenticated == 3) {
		res.render(__dirname + '/public/error', {error: 'Lobby full'});
	}
});

app.get('/draft/:id', checkCookies, authenticateDraft, function (req, res) {
	if (req.authenticated == -1) {
		res.sendFile(__dirname + '/public/draft.html');
	} else if (req.authenticated == 0) {
		res.render(__dirname + '/public/error', {error: 'Draft does not exist'});
	} else if (req.authenticated == 1) {
		res.cookie('playerNumber', -1);
		res.cookie('draftID', req.params.id);
		res.sendFile(__dirname + '/public/draft.html');
	}
});

app.post('/download', (req, res) => {
	res.download(__dirname + '/modding/requested_mods/' + req.body.draftID + '.zip');
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

io.on('connection', function(socket) {
	socket.on('join room', (roomID) => {
		socket.join(roomID);
	});
	socket.on('get gamestate', (roomID, playerNumber) => {
		var datadraft = getDraft(roomID);
		var draft = datadraft[0]['drafts'][datadraft[1]];

		if (playerNumber >= 0) {
			io.in(roomID).emit('set gamestate', draft);
		} else {
			io.to(socket.id).emit('set gamestate', draft);
		}
	});
	socket.on('get private gamestate', (roomID) => {
		var datadraft = getDraft(roomID);
		var draft = datadraft[0]['drafts'][datadraft[1]];
		io.to(socket.id).emit('set gamestate', draft);
	});
	socket.on('toggle ready', (roomID, playerNumber) => {
		var datadraft = getDraft(roomID);
		var data = datadraft[0];
		var draft = datadraft[0]['drafts'][datadraft[1]];

		if (playerNumber < 0) {
			console.log('spectator can\'t be ready');
		}
		draft['players'][playerNumber]['ready'] = (draft['players'][playerNumber]['ready'] + 1) % 2;
	        fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));
		io.in(roomID).emit('set gamestate', draft);
	});
	socket.on('start draft', (roomID) => {
		var datadraft = getDraft(roomID);
		var data = datadraft[0];
		var draft = datadraft[0]['drafts'][datadraft[1]];

		draft['gamestate']['phase'] = 1;
		for (var i=0; i<draft['preset']['slots']; i++) {
			draft['players'][i]['ready'] = 0;
		}
		fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));
		io.in(roomID).emit('set gamestate', draft);
	});
	socket.on('update tree', (roomID, playerNumber, tree, techtree_points, civ_name, flag_palette, architecture, language) => {
		var datadraft = getDraft(roomID);
		var data = datadraft[0];
		var draft = datadraft[0]['drafts'][datadraft[1]];
		var numPlayers = draft['preset']['slots'];

		draft['players'][playerNumber]['tree'] = tree;
		draft['players'][playerNumber]['ready'] = 1;
		draft['players'][playerNumber]['alias'] = civ_name;
		draft['players'][playerNumber]['flag_palette'] = flag_palette;
		draft['players'][playerNumber]['priority'] = techtree_points;
		draft['players'][playerNumber]['architecture'] = architecture;
		draft['players'][playerNumber]['language'] = language;
		var nextPhase = 1;
		for (var i=0; i<numPlayers; i++) {
			if (draft['players'][i]['ready'] != 1) {
				nextPhase = 0;
			}
		}

		if (nextPhase == 1) {
			draft['gamestate']['phase'] = 2;
			for (var i=0; i<numPlayers; i++) {
				draft['players'][i]['ready'] = 0;
			}

			//Distribute the first set of civ bonus cards
			for (var i=0; i<((draft['preset']['rounds']-1)*numPlayers+20); i++) {
				var rand = Math.floor(Math.random() * draft['gamestate']['available_cards'][0].length);
				draft['gamestate']['cards'].push(draft['gamestate']['available_cards'][0][rand]);
				draft['gamestate']['available_cards'][0].splice(rand, 1)
			}

			//Give each player a ranking based off how many techtree points they spent
			var priorities = [];
			for (var i=0; i<numPlayers; i++) {
				priorities.push(draft['players'][i]['priority'])
			}
			for (var i=0; i<numPlayers; i++) {
				var maxIndex = 0;
				for (var j=0; j<numPlayers; j++) {
					if (priorities[j] > priorities[maxIndex]) {
						maxIndex = j;
					} else if (priorities[j] == priorities[maxIndex]) {
						//50/50 switching in ties is good enough *cries in perfectionist*
						//In the long run it advantages players that join the later
						var rand = Math.floor(Math.random() * 2);
						if (rand == 0) {
							maxIndex = j;
						}
					}
				}
				draft['gamestate']['order'].push(maxIndex);
				priorities[maxIndex] = -1;
			}
			fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));
			io.in(roomID).emit('set gamestate', draft);
		} else {
			fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));
		}
	});
	socket.on('end turn', (roomID, pick, client_turn) => {
		var datadraft = getDraft(roomID);
		var data = datadraft[0];
		var draft = datadraft[0]['drafts'][datadraft[1]];
		var numPlayers = draft['preset']['slots'];

		//Determine which round we're in and who's turn it is
		draft['gamestate']['highlighted'] = [];
		var roundType = Math.max((Math.floor(draft['gamestate']['turn']/numPlayers) - (draft['preset']['rounds'] - 1)), 0);
		var player = draft['gamestate']['order'][draft['gamestate']['turn'] % numPlayers];
		if ((roundType == 2) || (roundType == 4)) {
			player = draft['gamestate']['order'][(numPlayers - 1) - (draft['gamestate']['turn'] % numPlayers)]
		}

		var bug = 0
		if (client_turn == draft['gamestate']['turn']) {
			//Give the player the card they chose
			draft['players'][player]['bonuses'][roundType].push(pick);

			//If it's the last turn of a round, distribute new cards, otherwise make the card unavailable to others
			if (((roundType > 0) || (Math.floor(draft['gamestate']['turn']/numPlayers) == (draft['preset']['rounds'] - 1))) && (draft['gamestate']['turn'] % numPlayers == (numPlayers - 1))) {
				if (roundType == 4) {
					//Last turn of the game
					draft['gamestate']['phase'] = 3;
				} else {
					draft['gamestate']['cards'] = [];
					for (var i=0; i<(2*numPlayers+20); i++) {
						var rand = Math.floor(Math.random() * draft['gamestate']['available_cards'][roundType+1].length);
						draft['gamestate']['cards'].push(draft['gamestate']['available_cards'][roundType+1][rand]);
						draft['gamestate']['available_cards'][roundType+1].splice(rand, 1);
					}
				}
			} else {
				var pickIndex = draft['gamestate']['cards'].indexOf(pick);
				if (pickIndex != -1) {
					draft['gamestate']['cards'][pickIndex] = -1;
				} else {
					bug = 1
					console.log('THE BUG HAPPENED')
					console.log('RoomID: ' + roomID)
					console.log('Pick: ' + pick)
					console.log('Draft State: ', draft['gamestate'])
				}
			}

			//Increment the turn and save the gamestate
			draft['gamestate']['turn']++;
			fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));
			io.in(roomID).emit('set gamestate', draft);
		} else {
			console.log('Duplicate socket messages, THE BUG avoided')
		}

		if (bug == 1) {
			io.in(roomID).emit('bug');
		}

		//Create the mod
		//Welcome to callback hell because I wasted $1800 on a web-dev class where the professor was seemingly incapable of answering a single question
		if (draft['gamestate']['phase'] == 3) {
			//Create Mod Folder
			os.execCommand(`sh createModFolder.sh ./modding/requested_mods ${draft['id']}`, function() {
				//Create Civ Icons
				for (var i=0; i<numPlayers; i++) {
					var civName = nameArr[i]
					var seed = [[colours[draft['players'][i]['flag_palette'][0]],
							colours[draft['players'][i]['flag_palette'][1]],
							colours[draft['players'][i]['flag_palette'][2]],
							colours[draft['players'][i]['flag_palette'][3]],
							colours[draft['players'][i]['flag_palette'][4]]],
							draft['players'][i]['flag_palette'][5],
							draft['players'][i]['flag_palette'][6]];
					var symbol = draft['players'][i]['flag_palette'][7] - 1;

					if (civName == 'berber' || civName == 'inca') {
						icons.drawFlag(seed, symbol, `./modding/requested_mods/${draft['id']}/${draft['id']}-ui/widgetui/textures/menu/civs/${civName}s.png`,
							`./modding/requested_mods/${draft['id']}/${draft['id']}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}.png`,
							`./modding/requested_mods/${draft['id']}/${draft['id']}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_hover.png`,
							`./modding/requested_mods/${draft['id']}/${draft['id']}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_pressed.png`,
							`./public/symbols`);
					} else {
						icons.drawFlag(seed, symbol, `./modding/requested_mods/${draft['id']}/${draft['id']}-ui/widgetui/textures/menu/civs/${civName}.png`,
							`./modding/requested_mods/${draft['id']}/${draft['id']}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}.png`,
							`./modding/requested_mods/${draft['id']}/${draft['id']}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_hover.png`,
							`./modding/requested_mods/${draft['id']}/${draft['id']}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_pressed.png`,
							`./public/symbols`);
					}
				}
				//Copy Civ Icons
				os.execCommand(`cp -r ./modding/requested_mods/${draft['id']}/${draft['id']}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/. ./modding/requested_mods/${draft['id']}/${draft['id']}-ui/resources/_common/wpfg/resources/civ_techtree`, function() {
					//Generate Json
					var mod_data = {};
					mod_data.name = [];
					mod_data.techtree = [];
					mod_data.castletech = [];
					mod_data.imptech = [];
					mod_data.civ_bonus = [];
					mod_data.team_bonus = [];
					mod_data.architecture = [];
					mod_data.language = [];
					mod_data.random_costs = 0;
					for (var i=0; i<numPlayers; i++) {
						mod_data.name.push(draft['players'][i]['alias']);
						var player_techtree = [];
						for (var j=0; j<130; j++) {
							player_techtree.push(0);
						}
						//Unique Unit
						player_techtree[0] = draft['players'][i]['bonuses'][1][0];
						//Castle Tech
						var castletechs = [];
						castletechs.push(draft['players'][i]['bonuses'][2][0]);
						mod_data.castletech.push(castletechs);
						//Imp Tech
						var imptechs = [];
						imptechs.push(draft['players'][i]['bonuses'][3][0]);
						mod_data.imptech.push(imptechs);
						//Tech Tree
						for (var j=0; j<draft['players'][i]['tree'].length; j++) {
							for (var k=0; k<draft['players'][i]['tree'][j].length; k++) {
								player_techtree[indexDictionary[j][draft['players'][i]['tree'][j][k].toString()]] = 1
							}
						}
						mod_data.techtree.push(player_techtree);

						mod_data.civ_bonus.push(draft['players'][i]['bonuses'][0]);
						mod_data.architecture.push(draft['players'][i]['architecture']);
						mod_data.language.push(draft['players'][i]['language']);

						var team_bonuses = []
						team_bonuses.push(draft['players'][i]['bonuses'][4][0]);
						mod_data.team_bonus.push(team_bonuses);
					}
					fs.writeFileSync(`./modding/requested_mods/${draft['id']}/data.json`, JSON.stringify(mod_data, null, 2))
					//Write Names
					modStrings.interperateLanguage(`./modding/requested_mods/${draft['id']}/data.json`, `./modding/requested_mods/${draft['id']}/${draft['id']}-ui/resources/en/strings/key-value/key-value-modded-strings-utf8.txt`);
					//Copy Names
					os.execCommand(`sh copyLanguages.sh ./modding/requested_mods/${draft['id']}/${draft['id']}-ui/resources`, function () {
						//Write UUIcons
						for (var i=0; i<blanks.length; i++) {
							os.execCommand(`cp ./public/uniticons/blank.png ./modding/requested_mods/${draft['id']}/${draft['id']}-ui/resources/_common/wpfg/resources/uniticons/${blanks[i]}_50730.png`, function () {});
						}
						for (var i=0; i<mod_data.techtree.length; i++) {
							var iconsrc = iconids[mod_data.techtree[i][0]];
							if (mod_data.techtree[i][0] == 7) {
								iconsrc = iconids[8];
							} else if (mod_data.techtree[i][0] == 8) {
								iconsrc = iconids[7];
							}
							if (i == (mod_data.techtree.length - 1)) {
								os.execCommand(`cp ./public/uniticons/${iconsrc}_50730.png ./modding/requested_mods/${draft['id']}/${draft['id']}-ui/resources/_common/wpfg/resources/uniticons/${iconids[i]}_50730.png`, function () {
									//Write Tech Tree
									modTreeJson.arrangeTechTree(`./modding/requested_mods/${draft['id']}/data.json`, `./modding/requested_mods/${draft['id']}/${draft['id']}-ui/widgetui/civTechTrees.json`);
									//Write Dat File
									os.execCommand(`./modding/build/create-data-mod ./modding/requested_mods/${draft['id']}/data.json ./public/empires2_x2_p1.dat ./modding/requested_mods/${draft['id']}/${draft['id']}-data/resources/_common/dat/empires2_x2_p1.dat`, function () {
										//Zip Files
										os.execCommand(`sh zipModFolder.sh ${draft['id']}`, function () {
											draft['gamestate']['phase'] = 4;
											fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));
											io.in(roomID).emit('set gamestate', draft);
										});
									});
								});
							} else {
								os.execCommand(`cp ./public/uniticons/${iconsrc}_50730.png ./modding/requested_mods/${draft['id']}/${draft['id']}-ui/resources/_common/wpfg/resources/uniticons/${iconids[i]}_50730.png`, function () {});
							}
						}
					});
				});
			});
		}
	});
	socket.on('refill', (roomID) => {
		var datadraft = getDraft(roomID);
		var data = datadraft[0];
		var draft = datadraft[0]['drafts'][datadraft[1]];
		var numPlayers = draft['preset']['slots'];

		//Repopulate empty card slots and keep track of the indices of refilled cards in highlighted array
		draft['gamestate']['highlighted'] = [];
		var roundType = Math.max((Math.floor(draft['gamestate']['turn']/numPlayers) - (draft['preset']['rounds'] - 1)), 0);
		for (var i=0; i<draft['gamestate']['cards'].length; i++) {
			if (draft['gamestate']['cards'][i] == -1) {
				if (draft['gamestate']['available_cards'][roundType].length <= 0) {
					draft['gamestate']['available_cards'][roundType] = reshuffleCards(draft);
				}
				var rand = Math.floor(Math.random() * draft['gamestate']['available_cards'][roundType].length);
				draft['gamestate']['cards'][i] = draft['gamestate']['available_cards'][roundType][rand];
				draft['gamestate']['available_cards'][roundType].splice(rand, 1);
				draft['gamestate']['highlighted'].push(i);
			}
		}
		fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));
		io.in(roomID).emit('set gamestate', draft);
	});
	socket.on('clear', (roomID) => {
		var datadraft = getDraft(roomID);
		var data = datadraft[0];
		var draft = datadraft[0]['drafts'][datadraft[1]];
		var numPlayers = draft['preset']['slots'];

		//Clear out cards and highlight the first three
		draft['gamestate']['highlighted'] = [0, 1, 2];
		var roundType = Math.max((Math.floor(draft['gamestate']['turn']/numPlayers) - (draft['preset']['rounds'] - 1)), 0);
		for (var i=0; i<draft['gamestate']['cards'].length; i++) {
			if (draft['gamestate']['available_cards'][roundType].length <= 0) {
				draft['gamestate']['available_cards'][roundType] = reshuffleCards(draft);
			}
			var rand = Math.floor(Math.random() * draft['gamestate']['available_cards'][roundType].length);
			draft['gamestate']['cards'][i] = draft['gamestate']['available_cards'][roundType][rand];
			draft['gamestate']['available_cards'][roundType].splice(rand, 1);
		}
		fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));
		io.in(roomID).emit('set gamestate', draft);
	});
});
