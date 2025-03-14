const dir = "/home/kraken/website/civbuilder";

const hostname = "https://krakenmeister.com/civbuilder";
const port = 4000;

const http = require("http");
const express = require("express");
const fs = require("fs");
const parser = require("body-parser");
const app = (module.exports = require("express")());
const exec = require("child_process").exec;
const { execSync } = require("child_process");
const path = require("path");
const icons = require("./process_mod/random/random_icon.js");
const zip = require("express-easy-zip");
const cookieParser = require("cookie-parser");
const process = require("process");

const makejson = require("./process_mod/random/random_json.js");
const modStrings = require("./process_mod/modStrings.js");
const createTechtreeJson = require("./process_mod/createTechtreeJson.js");
const makeai = require("./process_mod/modAI.js");
const { numBonuses, numBasicTechs, nameArr, colours, iconids, blanks, indexDictionary } = require("./process_mod/constants.js");
const { createCivilizationsJson } = require("./process_mod/createCivilizationsJson.js");
const commonJs = require("./public/js/common.js");

const server = require("http").Server(app);
const io = require("socket.io")(server);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

const router = express.Router();
app.use(
	parser.urlencoded({
		extended: false,
		limit: "20mb",
	})
);
app.use(parser.json({ limit: "20mb" }));
app.use(
	"/civbuilder",
	express.static(path.join(__dirname, "/public"), {
		maxAge: "1y",
		immutable: true,
	})
);
app.use("/civbuilder", router);

app.use(zip());
app.use(cookieParser());

function os_func() {
	this.execCommand = function (cmd, callback, failure) {
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.log(`stdout: ${stdout}`);
				console.error(`exec error: ${error}`);
				failure();
			}
			if (stdout) {
				console.log(stdout);
			}
			callback();
		});
	};
}

var os = new os_func();

function retrieveCookies(header) {
	let pairs = header.split(";");
	let cookies = {};
	for (let i = 0; i < pairs.length; i++) {
		let nameValue = pairs[i].split("=");
		cookies[nameValue[0].trim()] = nameValue[1];
	}
	return cookies;
}

const createDraft = (req, res, next) => {
	let uniqueID = false;
	let id;
	while (uniqueID == false) {
		id = "";
		for (let i = 0; i < 15; i++) {
			let rand = Math.floor(Math.random() * 10);
			id += rand;
		}
		uniqueID = true;
		uniqueID = !fs.existsSync(`${dir}/drafts/${id}.json`);
	}

	let draft = {};
	draft["id"] = id;
	draft["timestamp"] = Date.now();

	let available_rarities = req.body.allowed_rarities.split(",");
	for (let i = 0; i < available_rarities.length; i++) {
		available_rarities[i] = available_rarities[i] == "true";
	}

	let preset = {};
	preset["slots"] = parseInt(req.body.num_players, 10);
	preset["points"] = parseInt(req.body.techtree_currency, 10);
	preset["rounds"] = parseInt(req.body.rounds, 10);
	preset["rarities"] = available_rarities;
	draft["preset"] = preset;

	let players = [];
	for (let i = 0; i < parseInt(req.body.num_players, 10); i++) {
		let player = {};
		player["ready"] = 0;
		player["name"] = "";
		player["alias"] = "";
		//Palette (color1, color2, color3, color4, color5), division, overlay, symbol
		player["flag_palette"] = [3, 4, 5, 6, 7, 3, 3, 3];
		//Units, buildings, techs
		player["tree"] = [
			[13, 17, 21, 74, 545, 539, 331, 125, 83, 128, 440],
			[12, 45, 49, 50, 68, 70, 72, 79, 82, 84, 87, 101, 103, 104, 109, 199, 209, 276, 562, 584, 598, 621, 792],
			[22, 101, 102, 103, 408],
		];
		player["architecture"] = 1;
		player["language"] = 0;
		player["priority"] = -1;
		player["bonuses"] = [[], [], [], [], []];
		players.push(player);
	}
	draft["players"] = players;

	var gamestate = {};
	gamestate["phase"] = 0;
	gamestate["turn"] = 0;
	gamestate["available_cards"] = [];
	for (var i = 0; i < 5; i++) {
		var available_bonuses = [];
		var numBonus;
		if (req.body.new_bonuses === "on") {
			numBonus = numBonuses[i][1];
		} else {
			numBonus = numBonuses[i][0];
		}
		for (var j = 0; j < numBonus; j++) {
			if (draft["preset"]["rarities"][commonJs.card_descriptions[i][j][1]]) {
				available_bonuses.push(j);
			}
		}
		gamestate["available_cards"].push(available_bonuses);
	}
	gamestate["cards"] = [];
	gamestate["order"] = [];
	gamestate["highlighted"] = [];
	draft["gamestate"] = gamestate;
	fs.writeFileSync(`${dir}/drafts/${id}.json`, JSON.stringify(draft, null, 2));
	req.playerlink = `${hostname}/draft/player/${id}`;
	req.hostlink = `${hostname}/draft/host/${id}`;
	req.spectatorlink = `${hostname}/draft/${id}`;
	next();
};

const checkCookies = (req, res, next) => {
	if (req.headers.cookie) {
		let cookies = retrieveCookies(req.headers.cookie);
		if (cookies["draftID"] && cookies["draftID"] == parseInt(req.params.id, 10) && cookies["playerNumber"] && cookies["playerNumber"] >= 0) {
			req.authenticated = -1;
		}
	}
	next();
};

const authenticateDraft = (req, res, next) => {
	if (req.authenticated == -1) {
		return next();
	}
	req.authenticated = 0;
	if (fs.existsSync(`${dir}/drafts/${req.params.id}.json`)) {
		req.authenticated = 1;
	}
	next();
};

function getDraft(id) {
	if (!fs.existsSync(`${dir}/drafts/${id}.json`)) {
		return -1;
	}
	let data = fs.readFileSync(`${dir}/drafts/${id}.json`);
	let draft = JSON.parse(data);
	return draft;
}

const setID = (req, res, next) => {
	req.params.id = req.body.draftID;
	next();
};

//Check if there's room in the lobby for another player
const checkSpace = (req, res, next) => {
	if (req.authenticated == -1) {
		return next();
	}
	if (!fs.existsSync(`${dir}/drafts/${req.body.draftID}.json`)) {
		console.log("Draft authentication failed");
		return next();
	}

	let data = fs.readFileSync(`${dir}/drafts/${req.body.draftID}.json`);
	let draft = JSON.parse(data);
	if (req.body.joinType == 0) {
		//Joining as a host
		if (draft["players"][0]["name"] == "") {
			draft["players"][0]["name"] = req.body.civ_name;
			fs.writeFileSync(`${dir}/drafts/${req.body.draftID}.json`, JSON.stringify(draft, null, 2));
			req.playerNumber = 0;
		} else {
			req.authenticated = 2;
		}
		next();
	} else {
		//Joining as a player
		for (var i = 1; i < draft["preset"]["slots"]; i++) {
			if (draft["players"][i]["name"] == "") {
				draft["players"][i]["name"] = req.body.civ_name;
				req.playerNumber = i;
				fs.writeFileSync(`${dir}/drafts/${req.body.draftID}.json`, JSON.stringify(draft, null, 2));
				return next();
			}
		}
		req.authenticated = 3;
		next();
	}
};

//Refill available cards with any and all cards that players don't own and aren't currently on the board
function reshuffleCards(draft) {
	console.log("Reshuffling cards");
	var numPlayers = draft["preset"]["slots"];
	var roundType = Math.max(Math.floor(draft["gamestate"]["turn"] / numPlayers) - (draft["preset"]["rounds"] - 1), 0);

	var available_bonuses = [];
	var numBonus;

	numBonus = numBonuses[roundType][0];
	for (var i = 0; i < numBonus; i++) {
		var discarded = 1;
		for (var j = 0; j < numPlayers; j++) {
			if (draft["players"][j]["bonuses"][roundType].includes(i)) {
				discarded = 0;
			}
		}
		if (draft["gamestate"]["cards"].includes(i)) {
			discarded = 0;
		}
		if (discarded == 1) {
			if (draft["preset"]["rarities"][commonJs.card_descriptions[roundType][i][1]]) {
				available_bonuses.push(i);
			}
			//			available_bonuses.push(i);
		}
	}
	return available_bonuses;
}

const chDir = (req, res, next) => {
	process.chdir(dir);
	next();
};

const createModFolder = (req, res, next) => {
	if (req.body.civs === "false") {
		execSync(`bash ./process_mod/createModFolder.sh ./modding/requested_mods ${req.body.seed} ${dir} 0`);
	} else {
		execSync(`bash ./process_mod/createModFolder.sh ./modding/requested_mods ${req.body.seed} ${dir} 1`);
	}
	next();
};

const createCivIcons = (req, res, next) => {
	if (req.body.civs === "false") {
		next();
		return;
	}

	console.log(`[${req.body.seed}]: Creating civ icons...`);
	icons.generateFlags(
		`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/menu/civs`,
		`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons`,
		`./public/img/symbols`
	);
	next();
};

const copyCivIcons = (req, res, next) => {
	if (req.body.civs === "false") {
		next();
		return;
	}

	console.log(`[${req.body.seed}]: Copying civ icons...`);
	os.execCommand(
		`cp -r ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/. ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/resources/_common/wpfg/resources/civ_techtree`,
		function () {
			next();
		}
	);
};

const generateJson = (req, res, next) => {
	console.log(`[${req.body.seed}]: Generating data json...`);
	makejson.createJson(`./modding/requested_mods/${req.body.seed}/data.json`, req.body.civs, req.body.modifiers);
	next();
};

const writeNames = (req, res, next) => {
	if (req.body.civs === "false") {
		next();
		return;
	}

	console.log(`[${req.body.seed}]: Writing strings...`);
	modStrings.interperateLanguage(
		`./modding/requested_mods/${req.body.seed}/data.json`,
		`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/resources/en/strings/key-value/key-value-modded-strings-utf8.txt`
	);
	next();
};

const copyNames = (req, res, next) => {
	if (req.body.civs === "false") {
		next();
		return;
	}

	console.log(`[${req.body.seed}]: Copying strings...`);
	os.execCommand(`sh ./process_mod/copyLanguages.sh ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/resources`, function () {
		next();
	});
};

const addVoiceFiles = (req, res, next) => {
	if (req.body.civs === "false") {
		next();
		return;
	}

	console.log(`[${req.body.seed}]: Adding voice files...`);
	let command = `sh ./process_mod/copyVoices.sh ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/resources/_common/drs/sounds ${dir}/public/vanillaFiles/voiceFiles`;
	let data = fs.readFileSync(path.join(__dirname, `/modding/requested_mods/${req.body.seed}/data.json`));
	let info = JSON.parse(data);

	let uniqueLanguages = [];

	for (var i = 0; i < info.language.length; i++) {
		if (uniqueLanguages.indexOf(info.language[i]) == -1) {
			uniqueLanguages.push(info.language[i]);
			command += ` ${info.language[i]}`;
		}
	}

	os.execCommand(command, function () {
		next();
	});
};

const writeUUIcons = (req, res, next) => {
	if (req.body.civs === "false") {
		next();
		return;
	}

	console.log(`[${req.body.seed}]: Writing UU icons...`);
	for (var i = 0; i < blanks.length; i++) {
		os.execCommand(
			`cp ./public/img/uniticons/blank.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/resources/_common/wpfg/resources/uniticons/${blanks[i]}_50730.png`,
			function () {}
		);
	}
	var data = fs.readFileSync(`./modding/requested_mods/${req.body.seed}/data.json`);
	var civ = JSON.parse(data);
	for (var i = 0; i < civ.techtree.length; i++) {
		//Persians and Saracens are index 7 & 8 but War Elephants and Mamelukes are index 8 & 7
		var iconsrc = iconids[civ.techtree[i][0]];
		if (i == civ.techtree.length - 1) {
			os.execCommand(
				`cp ./public/img/uniticons/${iconsrc}_50730.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/resources/_common/wpfg/resources/uniticons/${iconsrc}_50730.png`,
				function () {
					next();
				}
			);
		} else {
			os.execCommand(
				`cp ./public/img/uniticons/${iconsrc}_50730.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/resources/_common/wpfg/resources/uniticons/${iconsrc}_50730.png`,
				function () {}
			);
		}
	}
};

const writeCivilizations = (req, res, next) => {
	if (req.body.civs === "false") {
		next();
		return;
	}

	console.log(`[${req.body.seed}]: Writing civilizations json...`);
	createCivilizationsJson(
		`./modding/requested_mods/${req.body.seed}/data.json`,
		`./modding/requested_mods/${req.body.seed}/${req.body.seed}-data/resources/_common/dat/civilizations.json`
	);
	next();
};

const writeTechTree = (req, res, next) => {
	if (req.body.civs === "false") {
		next();
		return;
	}

	console.log(`[${req.body.seed}]: Writing tech tree...`);
	createTechtreeJson.createTechtreeJson(
		`./modding/requested_mods/${req.body.seed}/data.json`,
		`./modding/requested_mods/${req.body.seed}/${req.body.seed}-data/resources/_common/dat/civTechTrees.json`
	);
	next();
};

const writeDatFile = async (req, res, next) => {
	console.log(`[${req.body.seed}]: Writing dat file...`);
	os.execCommand(
		`./modding/build/create-data-mod ./modding/requested_mods/${req.body.seed}/data.json ./public/vanillaFiles/empires2_x2_p1.dat ./modding/requested_mods/${req.body.seed}/${req.body.seed}-data/resources/_common/dat/empires2_x2_p1.dat ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/resources/_common/ai/aiconfig.json`,
		() => {
			next();
		},
		() => {
			res.render("failure", { error: "Mod creation failed" });
		}
	);
};

const writeAIFiles = (req, res, next) => {
	if (req.body.civs === "false") {
		next();
		return;
	}

	console.log(`[${req.body.seed}]: Writing AI files...`);
	makeai.createAI(
		`./modding/requested_mods/${req.body.seed}/data.json`,
		`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/resources/_common/ai`
	);
	next();
};

const zipModFolder = (req, res, next) => {
	console.log(`[${req.body.seed}]: Zipping folder...`);
	if (req.body.civs === "false") {
		os.execCommand(`bash ./process_mod/zipModFolder.sh ${req.body.seed} 0`, function () {
			next();
		});
	} else {
		os.execCommand(`bash ./process_mod/zipModFolder.sh ${req.body.seed} 1`, function () {
			next();
		});
	}
};

const writeIconsJson = async (req, res, next) => {
	console.log(`[${req.body.seed}]: Writing icons and json...`);
	console.log(JSON.parse(req.body.modifiers));
	//Parse multiple Json civ presets
	var raw_presets = JSON.parse(req.body.presets);
	var civs = raw_presets["presets"];
	//Create Civ Icons
	var blankOthers = false;
	for (var i = 0; i < civs.length; i++) {
		var civName = nameArr[i];
		if (civs[i]["flag_palette"][0] == -1) {
			//Secret password unlocked a vanilla flag
			if (civName == "berber" || civName == "inca") {
				execSync(
					`cp ./public/vanillaFiles/vanillaCivs/flag_${civs[i]["flag_palette"][1]}.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/menu/civs/${civName}s.png`
				);
			} else {
				execSync(
					`cp ./public/vanillaFiles/vanillaCivs/flag_${civs[i]["flag_palette"][1]}.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/menu/civs/${civName}.png`
				);
			}
			execSync(
				`cp ./public/vanillaFiles/vanillaCivs/flag_${civs[i]["flag_palette"][1]}.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}.png`
			);
			execSync(
				`cp ./public/vanillaFiles/vanillaCivs/flag_${civs[i]["flag_palette"][1]}.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_hover.png`
			);
			execSync(
				`cp ./public/vanillaFiles/vanillaCivs/flag_${civs[i]["flag_palette"][1]}.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_pressed.png`
			);
			execSync(
				`cp ./public/vanillaFiles/vanillaCivs/flag_${civs[i]["flag_palette"][1]}.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-data/resources/_common/wpfg/resources/civ_techtree/menu_techtree_${civName}.png`
			);
			execSync(
				`cp ./public/vanillaFiles/vanillaCivs/flag_${civs[i]["flag_palette"][1]}.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-data/resources/_common/wpfg/resources/civ_techtree/menu_techtree_${civName}_hover.png`
			);
			execSync(
				`cp ./public/vanillaFiles/vanillaCivs/flag_${civs[i]["flag_palette"][1]}.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-data/resources/_common/wpfg/resources/civ_techtree/menu_techtree_${civName}_pressed.png`
			);
			blankOthers = true;
		} else if (civs[i]["customFlag"] && civs[i]["customFlagData"]) {
			// Load in custom image for flag

			//let regex = /^data:.+\/(.+);base64,(.*)$/;

			//let matches = civs[i]["customFlagData"].match(regex);
			//let ext = matches[1];
			let data = civs[i]["customFlagData"].split(",")[1];
			let buffer = Buffer.from(data, "base64");

			let writePromises = [];
			if (civName == "berber" || civName == "inca") {
				writePromises.push(
					new Promise(function (resolve, reject) {
						fs.writeFile(
							`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/menu/civs/${civName}s.png`,
							buffer,
							(err) => {
								if (err) reject(err);
								else resolve(buffer);
							}
						);
					})
				);
			} else {
				writePromises.push(
					new Promise(function (resolve, reject) {
						fs.writeFile(
							`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/menu/civs/${civName}.png`,
							buffer,
							(err) => {
								if (err) reject(err);
								else resolve(buffer);
							}
						);
					})
				);
			}
			writePromises.push(
				new Promise(function (resolve, reject) {
					fs.writeFile(
						`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}.png`,
						buffer,
						(err) => {
							if (err) reject(err);
							else resolve(buffer);
						}
					);
				})
			);
			writePromises.push(
				new Promise(function (resolve, reject) {
					fs.writeFile(
						`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_hover.png`,
						buffer,
						(err) => {
							if (err) reject(err);
							else resolve(buffer);
						}
					);
				})
			);
			writePromises.push(
				new Promise(function (resolve, reject) {
					fs.writeFile(
						`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_pressed.png`,
						buffer,
						(err) => {
							if (err) reject(err);
							else resolve(buffer);
						}
					);
				})
			);
			writePromises.push(
				new Promise(function (resolve, reject) {
					fs.writeFile(
						`./modding/requested_mods/${req.body.seed}/${req.body.seed}-data/resources/_common/wpfg/resources/civ_techtree/menu_techtree_${civName}.png`,
						buffer,
						(err) => {
							if (err) reject(err);
							else resolve(buffer);
						}
					);
				})
			);
			writePromises.push(
				new Promise(function (resolve, reject) {
					fs.writeFile(
						`./modding/requested_mods/${req.body.seed}/${req.body.seed}-data/resources/_common/wpfg/resources/civ_techtree/menu_techtree_${civName}_hover.png`,
						buffer,
						(err) => {
							if (err) reject(err);
							else resolve(buffer);
						}
					);
				})
			);
			writePromises.push(
				new Promise(function (resolve, reject) {
					fs.writeFile(
						`./modding/requested_mods/${req.body.seed}/${req.body.seed}-data/resources/_common/wpfg/resources/civ_techtree/menu_techtree_${civName}_pressed.png`,
						buffer,
						(err) => {
							if (err) reject(err);
							else resolve(buffer);
						}
					);
				})
			);

			await Promise.all(writePromises);
		} else {
			//Draw the customized flag
			var seed = [
				[
					colours[civs[i]["flag_palette"][0]],
					colours[civs[i]["flag_palette"][1]],
					colours[civs[i]["flag_palette"][2]],
					colours[civs[i]["flag_palette"][3]],
					colours[civs[i]["flag_palette"][4]],
				],
				civs[i]["flag_palette"][5],
				civs[i]["flag_palette"][6],
			];
			var symbol = civs[i]["flag_palette"][7] - 1;

			if (civName == "berber" || civName == "inca") {
				icons.drawFlag(
					seed,
					symbol,
					[
						`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/menu/civs/${civName}s.png`,
						`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}.png`,
						`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_hover.png`,
						`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_pressed.png`,
						`./modding/requested_mods/${req.body.seed}/${req.body.seed}-data/resources/_common/wpfg/resources/civ_techtree/menu_techtree_${civName}.png`,
						`./modding/requested_mods/${req.body.seed}/${req.body.seed}-data/resources/_common/wpfg/resources/civ_techtree/menu_techtree_${civName}_hover.png`,
						`./modding/requested_mods/${req.body.seed}/${req.body.seed}-data/resources/_common/wpfg/resources/civ_techtree/menu_techtree_${civName}_pressed.png`,
					],
					`./public/img/symbols`
				);
			} else {
				icons.drawFlag(
					seed,
					symbol,
					[
						`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/menu/civs/${civName}.png`,
						`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}.png`,
						`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_hover.png`,
						`./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_pressed.png`,
						`./modding/requested_mods/${req.body.seed}/${req.body.seed}-data/resources/_common/wpfg/resources/civ_techtree/menu_techtree_${civName}.png`,
						`./modding/requested_mods/${req.body.seed}/${req.body.seed}-data/resources/_common/wpfg/resources/civ_techtree/menu_techtree_${civName}_hover.png`,
						`./modding/requested_mods/${req.body.seed}/${req.body.seed}-data/resources/_common/wpfg/resources/civ_techtree/menu_techtree_${civName}_pressed.png`,
					],
					`./public/img/symbols`
				);
			}
		}
	}
	// if (blankOthers) {
	//   //If there was a vanilla civ amongst the bunch, blank out all others to make it clearer
	//   for (var i = civs.length; i < 39; i++) {
	//     if (nameArr[i] == "berber" || nameArr[i] == "inca") {
	//       execSync(`cp ./public/vanillaFiles/vanillaCivs/blank.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/menu/civs/${nameArr[i]}s.png`);
	//     } else {
	//       execSync(`cp ./public/vanillaFiles/vanillaCivs/blank.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/menu/civs/${nameArr[i]}.png`);
	//     }
	//     execSync(
	//       `cp ./public/vanillaFiles/vanillaCivs/blank.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${nameArr[i]}.png`
	//     );
	//     execSync(
	//       `cp ./public/vanillaFiles/vanillaCivs/blank.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${nameArr[i]}_hover.png`
	//     );
	//     execSync(
	//       `cp ./public/vanillaFiles/vanillaCivs/blank.png ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${nameArr[i]}_pressed.png`
	//     );
	//   }
	// }
	//Copy Civ Icons
	os.execCommand(
		`cp -r ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/. ./modding/requested_mods/${req.body.seed}/${req.body.seed}-ui/resources/_common/wpfg/resources/civ_techtree`,
		function () {
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
			mod_data.modifiers = JSON.parse(req.body.modifiers);
			mod_data.modifyDat = true;
			for (var i = 0; i < civs.length; i++) {
				mod_data.name.push(civs[i]["alias"]);
				var player_techtree = [];
				for (var j = 0; j < numBasicTechs; j++) {
					player_techtree.push(0);
				}
				//Unique Unit
				if (civs[i]["bonuses"][1].length != 0) {
					player_techtree[0] = civs[i]["bonuses"][1][0];
				} else {
					player_techtree[0] = 0;
				}
				//Castle Tech
				if (civs[i]["bonuses"][2].length != 0) {
					var castletechs = [];
					for (var j = 0; j < civs[i]["bonuses"][2].length; j++) {
						castletechs.push(civs[i]["bonuses"][2][j]);
					}
					mod_data.castletech.push(castletechs);
				} else {
					mod_data.castletech.push([0]);
				}
				//Imp Tech
				if (civs[i]["bonuses"][3].length != 0) {
					var imptechs = [];
					for (var j = 0; j < civs[i]["bonuses"][3].length; j++) {
						imptechs.push(civs[i]["bonuses"][3][j]);
					}
					mod_data.imptech.push(imptechs);
				} else {
					mod_data.imptech.push([0]);
				}
				//Tech Tree
				for (var j = 0; j < civs[i]["tree"].length; j++) {
					for (var k = 0; k < civs[i]["tree"][j].length; k++) {
						player_techtree[indexDictionary[j][civs[i]["tree"][j][k].toString()]] = 1;
					}
				}
				mod_data.techtree.push(player_techtree);

				mod_data.civ_bonus.push(civs[i]["bonuses"][0]);
				if (civs[i]["bonuses"][4].length != 0) {
					var team_bonuses = [];
					for (var j = 0; j < civs[i]["bonuses"][4].length; j++) {
						team_bonuses.push(civs[i]["bonuses"][4][j]);
					}
					mod_data.team_bonus.push(team_bonuses);
				} else {
					mod_data.team_bonus.push([0]);
				}
				if (civs[i]["architecture"] === undefined) {
					mod_data.architecture.push(1);
				} else {
					mod_data.architecture.push(civs[i]["architecture"]);
				}
				if (civs[i]["language"] === undefined) {
					mod_data.language.push(0);
				} else {
					mod_data.language.push(civs[i]["language"]);
				}
			}
			fs.writeFileSync(`./modding/requested_mods/${req.body.seed}/data.json`, JSON.stringify(mod_data, null, 2));
			next();
		}
	);
};

router.get("/", function (req, res) {
	res.sendFile(__dirname + "/public/html/civbuilder_home.html");
	// res.sendFile(__dirname + "/public/html/updating.html");
});

router.get("/build", function (req, res) {
	// res.sendFile(__dirname + "/public/html/updating.html");
	res.sendFile(__dirname + "/public/html/civbuilder.html");
});

router.post(
	"/random",
	chDir,
	createModFolder,
	createCivIcons,
	copyCivIcons,
	generateJson,
	writeNames,
	copyNames,
	addVoiceFiles,
	writeUUIcons,
	writeCivilizations,
	writeTechTree,
	writeDatFile,
	writeAIFiles,
	zipModFolder,
	(req, res) => {
		console.log(`[${req.body.seed}]: Completed generation!`);
		res.download(__dirname + "/modding/requested_mods/" + req.body.seed + ".zip");
	}
);

router.post(
	"/create",
	chDir,
	createModFolder,
	writeIconsJson,
	writeNames,
	copyNames,
	addVoiceFiles,
	writeUUIcons,
	writeCivilizations,
	writeTechTree,
	writeDatFile,
	writeAIFiles,
	zipModFolder,
	(req, res) => {
		console.log(`[${req.body.seed}]: Completed generation!`);
		res.download(__dirname + "/modding/requested_mods/" + req.body.seed + ".zip");
	}
);

router.post("/setCookie", (req, res) => {
	res.cookie(req.body.cookie, req.body.value);
	res.send("Cookie set");
});

router.post("/draft", createDraft, (req, res) => {
	res.render(__dirname + "/public/pug/draft_links", { playerlink: req.playerlink, hostlink: req.hostlink, spectatorlink: req.spectatorlink });
});

router.post("/vanilla", (req, res) => {
	res.download(__dirname + "/public/vanillaFiles/vanillaCivs/VanillaJson.zip");
});

router.get("/view", function (req, res) {
	res.sendFile(__dirname + "/public/html/view.html");
});

router.post("/view", (req, res) => {
	res.sendFile(__dirname + "/public/html/view.html", req.body.civ);
});

router.get("/edit", function (req, res) {
	res.sendFile(__dirname + "/public/html/edit.html");
});

router.post("/edit", (req, res) => {
	res.sendFile(__dirname + "/public/html/edit.html", req.body.civ);
});

router.get("/draft/host/:id", checkCookies, authenticateDraft, function (req, res) {
	if (req.authenticated == -1) {
		res.redirect("/civbuilder/draft/" + req.params.id);
	} else if (req.authenticated == 0) {
		res.render(__dirname + "/public/pug/error", { error: "Draft does not exist" });
	} else if (req.authenticated == 1) {
		res.sendFile(__dirname + "/public/html/join.html");
	}
});

router.get("/draft/player/:id", checkCookies, authenticateDraft, function (req, res) {
	if (req.authenticated == -1) {
		res.redirect("/civbuilder/draft/" + req.params.id);
	} else if (req.authenticated == 0) {
		res.render(__dirname + "/public/pug/error", { error: "Draft does not exist" });
	} else if (req.authenticated == 1) {
		res.sendFile(__dirname + "/public/html/join.html");
	}
});

router.post("/join", setID, checkCookies, authenticateDraft, checkSpace, (req, res) => {
	if (req.authenticated == -1) {
		res.redirect("/civbuilder/draft/" + req.body.draftID);
	} else if (req.authenticated == 0) {
		res.render(__dirname + "/public/pug/error", { error: "Draft does not exist" });
	} else if (req.authenticated == 1) {
		res.cookie("playerNumber", req.playerNumber);
		res.cookie("draftID", req.body.draftID);
		res.redirect("/civbuilder/draft/" + req.body.draftID);
	} else if (req.authenticated == 2) {
		res.render(__dirname + "/public/pug/error", { error: "Host already joined" });
	} else if (req.authenticated == 3) {
		res.render(__dirname + "/public/pug/error", { error: "Lobby full" });
	}
});

router.get("/draft/:id", checkCookies, authenticateDraft, function (req, res) {
	if (req.authenticated == -1) {
		res.sendFile(__dirname + "/public/html/draft.html");
	} else if (req.authenticated == 0) {
		res.render(__dirname + "/public/pug/error", { error: "Draft does not exist" });
	} else if (req.authenticated == 1) {
		res.cookie("playerNumber", -1);
		res.cookie("draftID", req.params.id);
		res.sendFile(__dirname + "/public/html/draft.html");
	}
});

router.post("/download", (req, res) => {
	res.download(__dirname + "/modding/requested_mods/" + req.body.draftID + ".zip");
});

function draftIO(io) {
	io.on("connection", function (socket) {
		socket.on("join room", (roomID) => {
			socket.join(roomID);
		});
		socket.on("get gamestate", (roomID, playerNumber) => {
			let draft = getDraft(roomID);

			if (playerNumber >= 0) {
				io.in(roomID).emit("set gamestate", draft);
			} else {
				io.to(socket.id).emit("set gamestate", draft);
			}
		});
		socket.on("get private gamestate", (roomID) => {
			var draft = getDraft(roomID);
			io.to(socket.id).emit("set gamestate", draft);
		});
		socket.on("toggle ready", (roomID, playerNumber) => {
			let draft = getDraft(roomID);

			if (playerNumber < 0) {
				console.log("spectator can't be ready");
			}
			draft["players"][playerNumber]["ready"] = (draft["players"][playerNumber]["ready"] + 1) % 2;
			fs.writeFileSync(`${dir}/drafts/${roomID}.json`, JSON.stringify(draft, null, 2));
			io.in(roomID).emit("set gamestate", draft);
		});
		socket.on("start draft", (roomID) => {
			let draft = getDraft(roomID);

			draft["gamestate"]["phase"] = 1;
			for (var i = 0; i < draft["preset"]["slots"]; i++) {
				draft["players"][i]["ready"] = 0;
			}
			fs.writeFileSync(`${dir}/drafts/${roomID}.json`, JSON.stringify(draft, null, 2));
			io.in(roomID).emit("set gamestate", draft);
		});
		socket.on("update civ info", (roomID, playerNumber, civ_name, flag_palette, architecture, language) => {
			let draft = getDraft(roomID);
			var numPlayers = draft["preset"]["slots"];

			draft["players"][playerNumber]["ready"] = 1;
			draft["players"][playerNumber]["alias"] = civ_name;
			draft["players"][playerNumber]["flag_palette"] = flag_palette;
			draft["players"][playerNumber]["architecture"] = architecture;
			draft["players"][playerNumber]["language"] = language;

			var nextPhase = 1;
			for (var i = 0; i < numPlayers; i++) {
				if (draft["players"][i]["ready"] != 1) {
					nextPhase = 0;
				}
			}

			if (nextPhase == 1) {
				draft["gamestate"]["phase"] = 2;
				for (var i = 0; i < numPlayers; i++) {
					draft["players"][i]["ready"] = 0;
				}

				//Distribute the first set of civ bonus cards
				for (var i = 0; i < (draft["preset"]["rounds"] - 1) * numPlayers + 30; i++) {
					var rand = Math.floor(Math.random() * draft["gamestate"]["available_cards"][0].length);
					draft["gamestate"]["cards"].push(draft["gamestate"]["available_cards"][0][rand]);
					draft["gamestate"]["available_cards"][0].splice(rand, 1);
				}

				//Give each player a ranking based off how many techtree points they spent
				//Edit: we do this randomly now because techtrees are made afterwards
				var priorities = [];
				for (var i = 0; i < numPlayers; i++) {
					priorities.push(Math.random());
				}
				for (var i = 0; i < numPlayers; i++) {
					var maxIndex = 0;
					for (var j = 0; j < numPlayers; j++) {
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
					draft["gamestate"]["order"].push(maxIndex);
					priorities[maxIndex] = -1;
				}
				fs.writeFileSync(`${dir}/drafts/${roomID}.json`, JSON.stringify(draft, null, 2));
				io.in(roomID).emit("set gamestate", draft);
			} else {
				fs.writeFileSync(`${dir}/drafts/${roomID}.json`, JSON.stringify(draft, null, 2));
			}
		});
		socket.on("update tree", (roomID, playerNumber, tree) => {
			let draft = getDraft(roomID);
			var numPlayers = draft["preset"]["slots"];

			draft["players"][playerNumber]["tree"] = tree;
			draft["players"][playerNumber]["ready"] = 1;

			var nextPhase = 1;
			for (var i = 0; i < numPlayers; i++) {
				if (draft["players"][i]["ready"] != 1) {
					nextPhase = 0;
				}
			}

			if (nextPhase == 1) {
				draft["gamestate"]["phase"] = 5;
				fs.writeFileSync(`${dir}/drafts/${draft["id"]}.json`, JSON.stringify(draft, null, 2));
				io.in(roomID).emit("set gamestate", draft);

				//Create the mod
				//Welcome to callback hell because I wasted $1800 on a web-dev class where the professor was seemingly incapable of answering a single question
				process.chdir(dir);
				//Create Mod Folder
				os.execCommand(`bash ${dir}/process_mod/createModFolder.sh ./modding/requested_mods ${draft["id"]} ${dir} 1`, function () {
					//Create Civ Icons
					for (var i = 0; i < numPlayers; i++) {
						var civName = nameArr[i];
						var seed = [
							[
								colours[draft["players"][i]["flag_palette"][0]],
								colours[draft["players"][i]["flag_palette"][1]],
								colours[draft["players"][i]["flag_palette"][2]],
								colours[draft["players"][i]["flag_palette"][3]],
								colours[draft["players"][i]["flag_palette"][4]],
							],
							draft["players"][i]["flag_palette"][5],
							draft["players"][i]["flag_palette"][6],
						];
						var symbol = draft["players"][i]["flag_palette"][7] - 1;
						if (civName == "berber" || civName == "inca") {
							icons.drawFlag(
								seed,
								symbol,
								[
									`./modding/requested_mods/${draft["id"]}/${draft["id"]}-ui/widgetui/textures/menu/civs/${civName}s.png`,
									`./modding/requested_mods/${draft["id"]}/${draft["id"]}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}.png`,
									`./modding/requested_mods/${draft["id"]}/${draft["id"]}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_hover.png`,
									`./modding/requested_mods/${draft["id"]}/${draft["id"]}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_pressed.png`,
									`./modding/requested_mods/${draft["id"]}/${draft["id"]}-data/resources/_common/wpfg/resources/civ_techtree/menu_techtree_${civName}.png`,
									`./modding/requested_mods/${draft["id"]}/${draft["id"]}-data/resources/_common/wpfg/resources/civ_techtree/menu_techtree_${civName}_hover.png`,
									`./modding/requested_mods/${draft["id"]}/${draft["id"]}-data/resources/_common/wpfg/resources/civ_techtree/menu_techtree_${civName}_pressed.png`,
								],
								`./public/img/symbols`
							);
						} else {
							icons.drawFlag(
								seed,
								symbol,
								[
									`./modding/requested_mods/${draft["id"]}/${draft["id"]}-ui/widgetui/textures/menu/civs/${civName}s.png`,
									`./modding/requested_mods/${draft["id"]}/${draft["id"]}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}.png`,
									`./modding/requested_mods/${draft["id"]}/${draft["id"]}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_hover.png`,
									`./modding/requested_mods/${draft["id"]}/${draft["id"]}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/menu_techtree_${civName}_pressed.png`,
									`./modding/requested_mods/${draft["id"]}/${draft["id"]}-data/resources/_common/wpfg/resources/civ_techtree/menu_techtree_${civName}.png`,
									`./modding/requested_mods/${draft["id"]}/${draft["id"]}-data/resources/_common/wpfg/resources/civ_techtree/menu_techtree_${civName}_hover.png`,
									`./modding/requested_mods/${draft["id"]}/${draft["id"]}-data/resources/_common/wpfg/resources/civ_techtree/menu_techtree_${civName}_pressed.png`,
								],
								`./public/img/symbols`
							);
						}
					}
					//Copy Civ Icons
					os.execCommand(
						`cp -r ./modding/requested_mods/${draft["id"]}/${draft["id"]}-ui/widgetui/textures/ingame/icons/civ_techtree_buttons/. ./modding/requested_mods/${draft["id"]}/${draft["id"]}-ui/resources/_common/wpfg/resources/civ_techtree`,
						function () {
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
							mod_data.modifiers = {
								randomCosts: false,
								hp: 1,
								speed: 1,
								blind: false,
								infinity: false,
								building: 1,
							};
							mod_data.modifyDat = true;
							for (var i = 0; i < numPlayers; i++) {
								mod_data.name.push(draft["players"][i]["alias"]);
								var player_techtree = [];
								for (var j = 0; j < numBasicTechs; j++) {
									player_techtree.push(0);
								}
								//Unique Unit
								player_techtree[0] = draft["players"][i]["bonuses"][1][0];
								//Castle Tech
								var castletechs = [];
								castletechs.push(draft["players"][i]["bonuses"][2][0]);
								mod_data.castletech.push(castletechs);
								//Imp Tech
								var imptechs = [];
								imptechs.push(draft["players"][i]["bonuses"][3][0]);
								mod_data.imptech.push(imptechs);
								//Tech Tree
								for (var j = 0; j < draft["players"][i]["tree"].length; j++) {
									for (var k = 0; k < draft["players"][i]["tree"][j].length; k++) {
										player_techtree[indexDictionary[j][draft["players"][i]["tree"][j][k].toString()]] = 1;
									}
								}
								mod_data.techtree.push(player_techtree);
								mod_data.civ_bonus.push(draft["players"][i]["bonuses"][0]);
								mod_data.architecture.push(draft["players"][i]["architecture"]);
								mod_data.language.push(draft["players"][i]["language"]);
								var team_bonuses = [];
								team_bonuses.push(draft["players"][i]["bonuses"][4][0]);
								mod_data.team_bonus.push(team_bonuses);
							}
							console.log(JSON.stringify(mod_data, null, 2));
							fs.writeFileSync(`./modding/requested_mods/${draft["id"]}/data.json`, JSON.stringify(mod_data, null, 2));
							//Write Names
							modStrings.interperateLanguage(
								`./modding/requested_mods/${draft["id"]}/data.json`,
								`./modding/requested_mods/${draft["id"]}/${draft["id"]}-ui/resources/en/strings/key-value/key-value-modded-strings-utf8.txt`
							);
							//Copy Names
							os.execCommand(
								`sh ./process_mod/copyLanguages.sh ./modding/requested_mods/${draft["id"]}/${draft["id"]}-ui/resources`,
								function () {
									//Write UUIcons
									for (var i = 0; i < blanks.length; i++) {
										os.execCommand(
											`cp ./public/img/uniticons/blank.png ./modding/requested_mods/${draft["id"]}/${draft["id"]}-ui/resources/_common/wpfg/resources/uniticons/${blanks[i]}_50730.png`,
											function () {}
										);
									}
									for (var i = 0; i < mod_data.techtree.length; i++) {
										var iconsrc = iconids[mod_data.techtree[i][0]];
										if (i == mod_data.techtree.length - 1) {
											os.execCommand(
												`cp ./public/img/uniticons/${iconsrc}_50730.png ./modding/requested_mods/${draft["id"]}/${draft["id"]}-ui/resources/_common/wpfg/resources/uniticons/${iconsrc}_50730.png`,
												function () {
													//Write Tech Tree
													createTechtreeJson.createTechtreeJson(
														`./modding/requested_mods/${draft["id"]}/data.json`,
														`./modding/requested_mods/${draft["id"]}/${draft["id"]}-data/resources/_common/dat/civTechTrees.json`
													);
													createCivilizationsJson(
														`./modding/requested_mods/${draft["id"]}/data.json`,
														`./modding/requested_mods/${draft["id"]}/${draft["id"]}-data/resources/_common/dat/civilizations.json`
													);
													//Add voices
													let command = `sh ./process_mod/copyVoices.sh ./modding/requested_mods/${draft["id"]}/${draft["id"]}-ui/resources/_common/drs/sounds ${dir}/public/vanillaFiles/voiceFiles`;
													let uniqueLanguages = [];
													for (var i = 0; i < mod_data.language.length; i++) {
														if (uniqueLanguages.indexOf(mod_data.language[i]) == -1) {
															uniqueLanguages.push(mod_data.language[i]);
															command += ` ${mod_data.language[i]}`;
														}
													}
													os.execCommand(command, function () {
														//Write Dat File
														os.execCommand(
															`./modding/build/create-data-mod ./modding/requested_mods/${draft["id"]}/data.json ./public/vanillaFiles/empires2_x2_p1.dat ./modding/requested_mods/${draft["id"]}/${draft["id"]}-data/resources/_common/dat/empires2_x2_p1.dat ./modding/requested_mods/${draft["id"]}/${draft["id"]}-ui/resources/_common/ai/aiconfig.json`,
															function () {
																//Zip Files
																os.execCommand(`bash ./process_mod/zipModFolder.sh ${draft["id"]} 1`, function () {
																	draft["gamestate"]["phase"] = 6;
																	fs.writeFileSync(`${dir}/drafts/${draft["id"]}.json`, JSON.stringify(draft, null, 2));
																	io.in(roomID).emit("set gamestate", draft);
																});
															}
														);
													});
												}
											);
										} else {
											os.execCommand(
												`cp ./public/img/uniticons/${iconsrc}_50730.png ./modding/requested_mods/${draft["id"]}/${draft["id"]}-ui/resources/_common/wpfg/resources/uniticons/${iconsrc}_50730.png`,
												function () {}
											);
										}
									}
								}
							);
						}
					);
				});
				// fs.writeFileSync(`${dir}/drafts/${roomID}.json`, JSON.stringify(draft, null, 2));
				// io.in(roomID).emit("set gamestate", draft);
			} else {
				fs.writeFileSync(`${dir}/drafts/${roomID}.json`, JSON.stringify(draft, null, 2));
			}
		});
		socket.on("end turn", (roomID, pick, client_turn) => {
			let draft = getDraft(roomID);
			var numPlayers = draft["preset"]["slots"];

			//Determine which round we're in and who's turn it is
			draft["gamestate"]["highlighted"] = [];
			var roundType = Math.max(Math.floor(draft["gamestate"]["turn"] / numPlayers) - (draft["preset"]["rounds"] - 1), 0);
			var player = draft["gamestate"]["order"][draft["gamestate"]["turn"] % numPlayers];
			if (roundType == 2 || roundType == 4) {
				player = draft["gamestate"]["order"][numPlayers - 1 - (draft["gamestate"]["turn"] % numPlayers)];
			}

			var bug = 0;
			if (client_turn == draft["gamestate"]["turn"]) {
				//Give the player the card they chose
				draft["players"][player]["bonuses"][roundType].push(pick);

				//If it's the last turn of a round, distribute new cards, otherwise make the card unavailable to others
				if (
					(roundType > 0 || Math.floor(draft["gamestate"]["turn"] / numPlayers) == draft["preset"]["rounds"] - 1) &&
					draft["gamestate"]["turn"] % numPlayers == numPlayers - 1
				) {
					if (roundType == 4) {
						//Last turn of the game
						draft["gamestate"]["phase"] = 3;
					} else {
						draft["gamestate"]["cards"] = [];
						for (var i = 0; i < 2 * numPlayers + 20; i++) {
							var rand = Math.floor(Math.random() * draft["gamestate"]["available_cards"][roundType + 1].length);
							draft["gamestate"]["cards"].push(draft["gamestate"]["available_cards"][roundType + 1][rand]);
							draft["gamestate"]["available_cards"][roundType + 1].splice(rand, 1);
						}
					}
				} else {
					var pickIndex = draft["gamestate"]["cards"].indexOf(pick);
					if (pickIndex != -1) {
						draft["gamestate"]["cards"][pickIndex] = -1;
					} else {
						bug = 1;
						console.log("THE BUG HAPPENED");
						console.log("RoomID: " + roomID);
						console.log("Pick: " + pick);
						console.log("Draft State: ", draft["gamestate"]);
					}
				}

				//Increment the turn and save the gamestate
				draft["gamestate"]["turn"]++;
				if (draft["gamestate"]["phase"] == 3) {
					for (var i = 0; i < numPlayers; i++) {
						draft["players"][i]["ready"] = 0;
					}
				}
				fs.writeFileSync(`${dir}/drafts/${roomID}.json`, JSON.stringify(draft, null, 2));
				io.in(roomID).emit("set gamestate", draft);
			} else {
				console.log("Duplicate socket messages, THE BUG avoided");
			}

			if (bug == 1) {
				io.in(roomID).emit("bug");
			}
		});
		socket.on("refill", (roomID) => {
			let draft = getDraft(roomID);
			var numPlayers = draft["preset"]["slots"];

			//Repopulate empty card slots and keep track of the indices of refilled cards in highlighted array
			draft["gamestate"]["highlighted"] = [];
			var roundType = Math.max(Math.floor(draft["gamestate"]["turn"] / numPlayers) - (draft["preset"]["rounds"] - 1), 0);
			for (var i = 0; i < draft["gamestate"]["cards"].length; i++) {
				if (draft["gamestate"]["cards"][i] == -1) {
					if (draft["gamestate"]["available_cards"][roundType].length <= 0) {
						draft["gamestate"]["available_cards"][roundType] = reshuffleCards(draft);
					}
					var rand = Math.floor(Math.random() * draft["gamestate"]["available_cards"][roundType].length);
					draft["gamestate"]["cards"][i] = draft["gamestate"]["available_cards"][roundType][rand];
					draft["gamestate"]["available_cards"][roundType].splice(rand, 1);
					draft["gamestate"]["highlighted"].push(i);
				}
			}
			fs.writeFileSync(`${dir}/drafts/${roomID}.json`, JSON.stringify(draft, null, 2));
			io.in(roomID).emit("set gamestate", draft);
		});
		socket.on("clear", (roomID) => {
			let draft = getDraft(roomID);
			var numPlayers = draft["preset"]["slots"];

			//Clear out cards and highlight the first three
			draft["gamestate"]["highlighted"] = [0, 1, 2];
			var roundType = Math.max(Math.floor(draft["gamestate"]["turn"] / numPlayers) - (draft["preset"]["rounds"] - 1), 0);
			for (var i = 0; i < draft["gamestate"]["cards"].length; i++) {
				if (draft["gamestate"]["available_cards"][roundType].length <= 0) {
					draft["gamestate"]["available_cards"][roundType] = reshuffleCards(draft);
				}
				var rand = Math.floor(Math.random() * draft["gamestate"]["available_cards"][roundType].length);
				draft["gamestate"]["cards"][i] = draft["gamestate"]["available_cards"][roundType][rand];
				draft["gamestate"]["available_cards"][roundType].splice(rand, 1);
			}
			fs.writeFileSync(`${dir}/drafts/${roomID}.json`, JSON.stringify(draft, null, 2));
			io.in(roomID).emit("set gamestate", draft);
		});
	});
}
draftIO(io);

module.exports = {
	io: draftIO,
	router: router,
};

// server.listen(port);
