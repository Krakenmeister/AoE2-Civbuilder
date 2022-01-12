/*
Credit to HSZemi's aoe2techtree.net project for 99% of this code
*/

let tree;
let data = {};
let civs = {};
let connections;
let parentConnections;
let connectionpoints;
let focusedNodeId = null;

var canEdit;
let localtree;
let techtree_points;
let player;

const unclickableCarets = [
	"unit_83",
	"building_109",
	"building_621",
	"building_584",
	"building_562",
	"building_68",
	"tech_408"
];

const unitClasses = {
    0: "Unused",
    1: "Infantry",
    2: "Turtle Ships",
    3: "Base Pierce",
    4: "Base Melee",
    5: "War Elephants",
    6: "Unused",
    7: "Unused",
    8: "Cavalry",
    9: "Unused",
    10: "Unused",
    11: "<abbr title='(except Port)'>All Buildings</abbr>",
    12: "Unused",
    13: "Stone Defense",
    14: "FE Predator Animals",
    15: "Archers",
    16: "Ships & Camels & Saboteurs",
    17: "Rams",
    18: "Trees",
    19: "<abbr title='(except Turtle Ship)'>Unique Units</abbr>",
    20: "Siege Weapons",
    21: "Standard Buildings",
    22: "Walls & Gates",
    23: "FE Gunpowder Units",
    24: "Boars",
    25: "Monks",
    26: "Castle",
    27: "Spearmen",
    28: "Cavalry Archers",
    29: "Eagle Warriors",
    30: "HD Camels",
    31: "Anti-Leitis",
    32: "Condottieros",
    33: "Organ Gun Damage",
    34: "Fishing Ships",
    35: "Mamelukes",
    36: "Heroes and Kings",
};

const locales = {
    en: "English",
    zh: "简体中文",
    tw: "繁體中文",
    fr: "Français",
    de: "Deutsch",
    hi: "हिंदी",
    it: "Italiano",
    jp: "日本語",
    ko: "한국어",
    ms: "Bahasa Melayu",
    ru: "Русский",
    es: "Español",
    mx: "Español (México)",
    tr: "Türkçe",
    vi: "Tiếng Việt",
    br: "Português (Brasil)",
};
const defaultLocale = "en";

function loadLocale(localeCode) {
    if (!Object.keys(locales).includes(localeCode)) {
        localeCode = defaultLocale;
    }
    loadJson("/aoe2techtree/data/locales/" + localeCode + "/strings.json", function (strings) {
        data.strings = strings;
        displayData();
        document.documentElement.setAttribute('lang', localeCode);
    });
	if ((canEdit == 2) || (canEdit == 3) || (canEdit == 4)) {
		const treetypes = ['units', 'buildings', 'techs'];
		for (var i=0; i<localtree.length; i++) {
			for (var j=0; j<localtree[i].length; j++) {
				techtree_points += data['data'][treetypes[i]][localtree[i][j].toString()]['tech_cost'];
			}
		}
	}

}

function displayData() {
    // Reset containers
    const root = document.getElementById('root');
    if (root) {
        document.getElementById('techtree').removeChild(root);
    }

    tree = getDefaultTree();
    connections = getConnections();
    parentConnections = new Map(connections.map(([parent, child]) => [child, parent]));
    connectionpoints = getConnectionPoints(tree);

    const draw = SVG('techtree').id('root').size(tree.width, tree.height)
        .mouseover((e) => {
            if (e.target.id === 'root') {
                hideHelp();
            }
        });

    document.getElementById('techtree').mouseover = (e) => {
        if (e.target.id === 'techtree') {
            hideHelp();
        }
    };

    // Draw Age Row Highlighters
    let row_height = tree.height / 4;
    draw.rect(tree.width, row_height).attr({fill: '#4d3617', opacity:0.3}).mouseover(hideHelp);
    draw.rect(tree.width, row_height).attr({fill: '#4d3617', opacity:0.3}).mouseover(hideHelp).y(row_height * 2);

    // Add Age Icons
    let icon_height = Math.min(row_height / 2, 112);
    let icon_width = 112;
    let vertical_spacing = (row_height - icon_height) / 2 - 10;
    let margin_left = 20;
    let image_urls = ['dark_age_de.png', 'feudal_age_de.png', 'castle_age_de.png', 'imperial_age_de.png'];
    let age_names = [
        data.strings[data.age_names["Dark Age"]],
        data.strings[data.age_names["Feudal Age"]],
        data.strings[data.age_names["Castle Age"]],
        data.strings[data.age_names["Imperial Age"]]
    ];
    for (let i = 0; i < image_urls.length; i++) {
        let age_image_group = draw.group().mouseover(hideHelp);
        let age_image = age_image_group.image('/aoe2techtree/img/Ages/' + image_urls[i], icon_width, icon_height).y(row_height * i + vertical_spacing).x(margin_left);
        age_image_group.text(age_names[i])
            .font({size: 16, weight: 'bold'})
            .attr({fill: '#000000', opacity: 0.8, 'text-anchor': 'middle'})
            .move(icon_width / 2 + margin_left, age_image.attr('y') + icon_height + 5);
    }

    const connectionGroup = draw.group().attr({id: 'connection_lines'});
    const danglingCarets = ['tech_436', 'unit_5', 'tech_215', 'unit_38', 'unit_17', 'tech_65', 'tech_47', 'tech_377', 'tech_608', 'unit_331', 'tech_45', 'tech_233', 'tech_230', 'tech_438', 'tech_8', 'tech_213', 'tech_23', 'tech_15', 'unit_36', 'unit_420'];
    for (let connection of connections) {
        let from = connectionpoints.get(connection[0]);
        let to = connectionpoints.get(connection[1]);
	if(!danglingCarets.includes(connection[1])) {
	        let intermediate_height = from.y + (tree.element_height * 2 / 3);
	        connectionGroup.polyline([from.x, from.y, from.x, intermediate_height, to.x, intermediate_height, to.x, to.y])
	            .attr({id: `connection_${connection[0]}_${connection[1]}`})
	            .addClass('connection')
	            .mouseover(hideHelp);
	}
    }

    for (let lane of tree.lanes) {
        draw.rect(lane.width + 10, tree.height)
            .attr({fill: '#ffeeaa', 'fill-opacity': 0, class: lane.caretIds().map((id) => `lane-with-${id}`)})
            .move(lane.x - 10, lane.y)
            .mouseover(hideHelp);
        for (let r of Object.keys(lane.rows)) {
            let row = lane.rows[r];
            for (let caret of row) {
                var item = draw.group().attr({id: caret.id}).addClass('node')
                var rect = item.rect(caret.width, caret.height).attr({
                    fill: caret.type.colour,
                    id: `${caret.id}_bg`
                }).move(caret.x, caret.y);
		let cost = data['data'][caretType(caret.id)][idID(caret.id).toString()]['tech_cost'];
                let name = formatName(caret.name);
                var text = item.text(name.toString())
                    .font({size: 9, weight: 'bold'})
                    .attr({fill: '#ffffff', opacity:0.95, 'text-anchor': 'middle', id: caret.id + '_text'})
                    .move(caret.x + caret.width / 2, caret.y + caret.height / 1.5);
		var price = item.text(cost.toString())
		    .font({size: 16, weight: 'bold'})
		    .attr({fill: '#ffdd00', opacity:0.95, 'text-anchor': 'middle', id: caret.id + '_price'})
		    .move(caret.x + caret.width / 1.1, caret.y);
                var image_placeholder = item.rect(caret.width * 0.6, caret.height * 0.6)
                    .attr({fill: '#000000', opacity:0.5, id: caret.id + '_imgph'})
                    .move(caret.x + caret.width * 0.2, caret.y);
                let prefix = '/aoe2techtree/img/';
                var image = item.image(prefix + imagePrefix(caret.id) + '.png', caret.width * 0.6, caret.height * 0.6)
                    .attr({id: caret.id + '_img'})
                    .move(caret.x + caret.width * 0.2, caret.y);

		var id = idID(caret.id);
		var cross_opacity = 0;
		if (!localtree[idType(caret.id)].includes(id)) {
			cross_opacity = 0.5;
		}

		polygon_array = [1, 0, 3, 2, 5, 0, 6, 1, 4, 3, 6, 5, 5, 6, 3, 4, 1, 6, 0, 5, 2, 3, 0, 1];
		for (var i=0; i<polygon_array.length; i++) {
			polygon_array[i] *= (caret.width / 10);
		}
                var cross = item.polygon(polygon_array)
                    .attr({fill: '#ff0000', opacity:cross_opacity, id: caret.id + '_x'})
                    .addClass('cross')
//                    .size(caret.width * 0.6, caret.height * 0.6)
                    .move(caret.x + caret.width * 0.2, caret.y);
                var overlaytrigger = item.rect(caret.width, caret.height)
                    .attr({id: caret.id + '_overlay'})
                    .addClass('node__overlay')
                    .move(caret.x, caret.y)
                    .data({'type': caret.type.type, 'caret': caret, 'name': caret.name, 'id': caret.id})
                    .mouseout(resetHighlightPath)
                    .mouseover(function () {
                        displayHelp(caret.id);
			highlightPath(caret.id);
                    })
		    .click(function () {
			if ((canEdit == 1) || (canEdit == 3)) {
				if (!unclickableCarets.includes(caret.id)) {
					console.log(caret.id);
					toggleCaret(caret.id);
				}
			}
		    });

            }
        }
    }


    let civWasLoaded = updateCivselectValue();
    if(!civWasLoaded){
        loadCiv();
    }

	if ((canEdit == 0) || (canEdit == 1)) {
		document.getElementById('points').innerHTML = 'Points Remaining: ' + techtree_points;
	} else {
		document.getElementById('points').innerHTML = 'Points Spent: ' + techtree_points;
	}
	if (canEdit == 1) {
		document.getElementById('reset').onclick = function() {
			localtree = [
		        	[13, 17, 21, 74, 545, 539, 331, 125, 83, 128, 440],
			        [12, 45, 49, 50, 68, 70, 72, 79, 82, 84, 87, 101, 103, 104, 109, 199, 209, 276, 562, 584, 598, 621, 792],
			        [22, 101, 102, 103, 408]
			];
			techtree_points = 100;
			displayData();
		}
	} else if (canEdit == 3) {
		document.getElementById('reset').onclick = function() {
			localtree = [
		        	[13, 17, 21, 74, 545, 539, 331, 125, 83, 128, 440],
			        [12, 45, 49, 50, 68, 70, 72, 79, 82, 84, 87, 101, 103, 104, 109, 199, 209, 276, 562, 584, 598, 621, 792],
			        [22, 101, 102, 103, 408]
			];
			techtree_points = 0;
			displayData();
		}
	}

	document.getElementById('done').onclick = function() {
		if (canEdit == 4) {
			downloadTextFile(JSON.stringify(civ), civ['alias'] + '.json');
			return;
		}
		if (techtree_points >= 0) {
			document.getElementById('container').remove();
			document.getElementById('toolbar').remove();
			document.getElementById('tech_styles').remove();

			var elements = document.querySelectorAll( 'body *' );
			for (const elem of elements) {
				elem.hidden = false;
			}

			if (canEdit == 1) {
				updateTree(player, localtree, techtree_points);
			} else if (canEdit == 0) {
				getPrivateGamestate();
			} else if (canEdit == 3) {
				setTechTree(localtree);
			}
		}
	}
}

function updateCivselectValue() {
    let hash = window.location.hash.substr(1);
    let capitalisedHash = hash.substring(0, 1).toUpperCase() + hash.substring(1).toLowerCase();
    if (capitalisedHash in data.civ_names) {
        const civSelect = document.getElementById('civselect');
        if (civSelect.value !== capitalisedHash) {
            civSelect.value = capitalisedHash;
            loadCiv();
            return true;
        }
    }
    return false;
}

function setAdvancedStatsState() {
    try {
        let showAdvancedStats = localStorage.getItem('showAdvancedStats');
        let advancedStats = document.getElementById('advanced-stats');
        if (showAdvancedStats === 'true') {
            advancedStats.open = true;
        }
        advancedStats.onclick = onAdvancedStatsStateUpdate;
    } catch (e) {
        // pass
    }
}

function onAdvancedStatsStateUpdate() {
    try {
        localStorage.setItem('showAdvancedStats', (!document.getElementById('advanced-stats').open).toString());
    } catch (e) {
        // pass
    }
}

function imagePrefix(name) {
    return name.replace('_copy', '')
        .replace("building_", "Buildings/")
        .replace("unit_", "Units/")
        .replace("tech_", "Techs/");
}

function loadCiv() {
    const selectedCiv = 'Aztecs' //document.getElementById('civselect').value;
    renderciv(selectedCiv, tree);
    hideHelp();
}

function loadJson(file, callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState === 4 && xobj.status === 200) {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(JSON.parse(xobj.responseText));
        }
    };
//	callback(JSON.parse(xobj.responseText));
    xobj.send(null);
}

function resetHighlightPath() {
    unhighlightPath();
    if (focusedNodeId) {
        highlightPath(focusedNodeId);
    }
}

function unhighlightPath() {
    SVG.select('.node.is-highlight, .connection.is-highlight')
        .removeClass('is-highlight');
}

function highlightPath(caretId) {
    recurse(caretId);

    function recurse(caretId) {
        SVG.get(caretId).addClass('is-highlight');

        const parentId = parentConnections.get(caretId);
        if (!parentId) return;

        const line = SVG.get(`connection_${parentId}_${caretId}`);
        if (line) {
            // Move to the end of the <g> element so that it is drawn on top.
            // Without this, the line would be highlighted, but other unhighlighted
            // connection lines could be drawn on top, undoing the highlighting.
            line.front().addClass('is-highlight');
        }
        recurse(parentId);
    }
}

function enableCaret(caretId) {
	var id = idID(caretId);
	var type = idType(caretId);
	if (!localtree[type].includes(id)) {
		localtree[type].push(id);
		if (canEdit != 3) {
			techtree_points -= data['data'][caretType(caretId)][idID(caretId).toString()]['tech_cost'];
		} else {
			techtree_points += data['data'][caretType(caretId)][idID(caretId).toString()]['tech_cost'];
		}
	} else {
		return;
	}
	if (caretId == 'building_234') {
		enableCaret('tech_140');
	} else if (caretId == 'tech_140') {
		enableCaret('building_234');
	} else if (caretId == 'tech_64') {
		enableCaret('building_236');
	} else if (caretId == 'building_236') {
		enableCaret('tech_64');
	} else if (caretId == 'tech_63') {
		enableCaret('building_235');
	} else if (caretId == 'building_235') {
		enableCaret('tech_63');
	} else if (caretId == 'tech_194') {
		enableCaret('building_155');
	} else if (caretId == 'building_155') {
		enableCaret('tech_194');
	} else if (caretId == 'unit_5' || caretId == 'unit_420' || caretId == 'unit_36') {
		enableCaret('tech_47');
	} else if (caretId == 'building_117') {
		enableCaret('building_487');
	} else if (caretId == 'building_487') {
		enableCaret('building_117');
	}
	const parentId = parentConnections.get(caretId);
	if (!parentId) {
		return;
	}
	enableCaret(parentId);
}

function disableCaret(caretId) {
	if (caretId == "tech_408") {
		return
	}
	var id = idID(caretId);
	var type = idType(caretId);
	if (localtree[type].includes(id)) {
		localtree[type].splice(localtree[type].indexOf(id), 1);
		if (canEdit != 3) {
			techtree_points += data['data'][caretType(caretId)][idID(caretId).toString()]['tech_cost'];
		} else {
			techtree_points -= data['data'][caretType(caretId)][idID(caretId).toString()]['tech_cost'];
		}
	} else {
		return;
	}
	let connections = getConnections();
	for (let connection of connections) {
	    if (connection[0] === caretId) {
		disableCaret(connection[1]);
	    }
        }
	if (caretId == 'building_234') {
		disableCaret('tech_140');
	} else if (caretId == 'tech_140') {
		disableCaret('building_234');
	} else if (caretId == 'building_236') {
		disableCaret('tech_64');
	} else if (caretId == 'tech_64') {
		disableCaret('building_236');
	} else if (caretId == 'tech_63') {
		disableCaret('building_235');
	} else if (caretId == 'building_235') {
		disableCaret('tech_63');
	} else if (caretId == 'tech_194') {
		disableCaret('building_155');
	} else if (caretId == 'building_155') {
		disableCaret('tech_194');
	} else if (caretId == 'tech_47') {
		disableCaret('unit_5');
		disableCaret('unit_420');
		disableCaret('unit_36');
	} else if (caretId == 'building_117') {
		disableCaret('building_487');
	} else if (caretId == 'building_487') {
		disableCaret('building_117');
	}
}

function toggleCaret(caretId) {
	var id = idID(caretId);
	var type = idType(caretId);
	if (localtree[type].includes(id)) {
		disableCaret(caretId);
	} else {
		enableCaret(caretId);
	}
	displayData();
}

function displayHelp(caretId) {
    focusedNodeId = caretId;
    let helptextContent = document.getElementById("helptext__content");
    let helptextAdvancedStats = document.getElementById("helptext__advanced_stats");
    let overlay = SVG.get(`${caretId}_overlay`);
    let name = overlay.data('name');
    let id = overlay.data('id').replace('_copy', '');
    let caret = overlay.data('caret');
    let type = overlay.data('type');
    helptextContent.innerHTML = getHelpText(name, id, type);
    positionHelptext(caret);
    resetHighlightPath();
}

function hideHelp() {
    focusedNodeId = null;
    const helptext = document.getElementById("helptext");
    helptext.style.display = "none";
    resetHighlightPath();
}

function positionHelptext(caret) {
    const helptext = document.getElementById("helptext");
    helptext.style.display = "block";
    positionHelptextBelow(caret, helptext)
    || positionHelptextAbove(caret, helptext)
    || positionHelptextToLeftOrRight(caret, helptext);
}

function positionHelptextBelow(caret, helptext) {
    let top = caret.y + caret.height + document.getElementById('root').getBoundingClientRect().top;
    let helpbox = helptext.getBoundingClientRect();
    if (top + helpbox.height > tree.height) {
        return false;
    }

    let destX = caret.x - helpbox.width;
    let techtree = document.getElementById('techtree');
    if (destX < 0 || destX - techtree.scrollLeft < 0) {
        destX = techtree.scrollLeft;
    }
    helptext.style.top = top + "px";
    helptext.style.left = destX + 'px';
    return true;
}

function positionHelptextAbove(caret, helptext) {
    let helpbox = helptext.getBoundingClientRect();
    let top = caret.y - helpbox.height + document.getElementById('root').getBoundingClientRect().top;
    if (top < 0) {
        return false;
    }

    let destX = caret.x - helpbox.width;
    let techtree = document.getElementById('techtree');
    if (destX < 0 || destX - techtree.scrollLeft < 0) {
        destX = techtree.scrollLeft;
    }
    helptext.style.top = top + "px";
    helptext.style.left = destX + 'px';
    return true;
}

function positionHelptextToLeftOrRight(caret, helptext) {
    let helpbox = helptext.getBoundingClientRect();
    let top = 0;
    let destX = caret.x - helpbox.width;
    let techtree = document.getElementById('techtree');
    if (destX < 0 || destX - techtree.scrollLeft < 0) {
        destX = caret.x + caret.width;
    }
    helptext.style.top = top + "px";
    helptext.style.left = destX + 'px';
}

function getHelpText(name, id, type) {
    let entitytype = getEntityType(type);
    const items = id.split('_', 1);
    id = id.substring(items[0].length + 1);
    let text = data.strings[data.data[entitytype][id]['LanguageHelpId']];
    if (text === undefined) {
        return "?";
    }
    text = text.replace(/\s<br>/g, '');
    text = text.replace(/\n/g, '');
    if (type === "TECHNOLOGY") {
        text = text.replace(/(.+?\(.+?\))(.*)/m,
            '<p class="helptext__heading">$1</p>' +
            '<p class="helptext__desc">$2</p>' +
            '<p class="helptext__stats">&nbsp;</p>');
    } else if (type === "UNIT" || type === "UNIQUEUNIT" ) {
        text = text.replace(/(.+?\(‹cost›\))(.+?)<i>\s*(.+?)<\/i>(.*)/m,
            '<p>$1</p>' +
            '<p>$2</p>' +
            '<p><em>$3</em></p>' +
            '<p class="helptext__stats">$4</p>');
    } else if (type === "BUILDING") {
        // convert the "Required for" text in <i> to <em> so that it doesn't break the next regex
        text = text.replace(/<b><i>(.+?)<\/b><\/i>/m, '<b><em>$1</em></b>');
        if (text.indexOf('<i>') >= 0) {
            text = text.replace(/(.+?\(‹cost›\))(.+?)<i>\s*(.+?)<\/i>(.*)/m,
                '<p>$1</p>' +
                '<p>$2</p>' +
                '<p><em>$3</em></p>' +
                '<p class="helptext__stats">$4</p>');
        } else {
            // Handle certain buildings like Wonders separately as the upgrades text is missing for them.
            text = text.replace(/(.+?\(‹cost›\))(.*)<br>(.*)/m,
                '<p>$1</p>' +
                '<p>$2</p>' +
                '<p class="helptext__stats">$3</p>');
        }
    }
    let meta = data.data[entitytype][id];
    if (meta !== undefined) {
        text = text.replace(/‹cost›/, "Cost: " + cost(meta.Cost));
        let stats = []
        if (text.match(/‹hp›/)) {
            stats.push("HP:&nbsp;" + meta.HP);
        }
        if (text.match(/‹attack›/)) {
            stats.push("Attack:&nbsp;" + meta.Attack);
        }
        if (text.match(/‹[Aa]rmor›/)) {
            stats.push("Armor:&nbsp;" + meta.MeleeArmor);
        }
        if (text.match(/‹[Pp]iercearmor›/)) {
            stats.push("Pierce armor:&nbsp;" + meta.PierceArmor);
        }
        if (text.match(/‹garrison›/)) {
            stats.push("Garrison:&nbsp;" + meta.GarrisonCapacity);
        }
        if (text.match(/‹range›/)) {
            stats.push("Range:&nbsp;" + meta.Range);
        }
        stats.push(ifDefinedAndGreaterZero(meta.MinRange, "Min Range:&nbsp;"));
        stats.push(ifDefined(meta.LineOfSight, "Line of Sight:&nbsp;"));
        stats.push(ifDefined(meta.Speed, "Speed:&nbsp;"));
        stats.push(secondsIfDefined(meta.TrainTime, "Build Time:&nbsp;"));
        stats.push(secondsIfDefined(meta.ResearchTime, "Research Time:&nbsp;"));
        stats.push(ifDefined(meta.FrameDelay, "Frame Delay:&nbsp;"));
        stats.push(ifDefinedAndGreaterZero(meta.MaxCharge, "Charge Attack:&nbsp;"));
        stats.push(ifDefinedAndGreaterZero(meta.RechargeRate, "Recharge Rate:&nbsp;"));
        stats.push(secondsIfDefined(meta.RechargeDuration, "Recharge Duration:&nbsp;"));
        stats.push(secondsIfDefined(meta.AttackDelaySeconds, "Attack Delay:&nbsp;"));
        stats.push(secondsIfDefined(meta.ReloadTime, "Reload Time:&nbsp;"));
        stats.push(accuracyIfDefined(meta.AccuracyPercent, "Accuracy:&nbsp;"));
        text = text.replace(/<p class="helptext__stats">(.+?)<\/p>/, "<h3>Stats</h3><p>" + stats.filter(Boolean).join(', ') + "<p>")
    } else {
        console.error("No metadata found for " + name);
    }
    return text;
}

function getEntityType(type) {
    let entitytype = 'buildings';
    if (type === "UNIT" || type === "UNIQUEUNIT") {
        entitytype = 'units';
    }
    if (type === "TECHNOLOGY") {
        entitytype = 'techs';
    }
    return entitytype;
}

function ifDefined(value, prefix) {
    if (value !== undefined) {
        return " " + prefix + value;
    } else {
        return "";
    }
}

function secondsIfDefined(value, prefix) {
    if (value !== undefined) {
        return " " + prefix + toMaxFixed2(value) + "s";
    } else {
        return "";
    }
}

function toMaxFixed2(value) {
    return Math.round(value * 100) / 100;
}

function accuracyIfDefined(value, prefix) {
    if (value !== undefined && value < 100) {
        return " " + prefix + value + "%";
    } else {
        return "";
    }
}

function ifDefinedAndGreaterZero(value, prefix) {
    if (value !== undefined && value > 0) {
        return " " + prefix + value;
    } else {
        return "";
    }
}

function arrayIfDefinedAndNonEmpty(attacks, prefix) {
    if (attacks === undefined || attacks.length < 1) {
        return "";
    } else {
        const strings = [];
        for (let attack of attacks) {
            const amount = attack['Amount'];
            const clazz = unitClasses[attack['Class']];
            strings.push(`${amount} (${clazz})`);
        }
        return prefix + '<p>' + strings.join(', ') + "</p>";
    }
}

function cost(cost_object) {
    let value = "";
    if ("Food" in cost_object) {
        value += " " + cost_object.Food + "F";
    }
    if ("Wood" in cost_object) {
        value += " " + cost_object.Wood + "W";
    }
    if ("Gold" in cost_object) {
        value += " " + cost_object.Gold + "G";
    }
    if ("Stone" in cost_object) {
        value += " " + cost_object.Stone + "S";
    }
    return value;
}

function renderciv(name) {
//    let selectedCiv = civs[name];
    let selectedCiv = localtree;

    SVG.select('.cross').each(function () {
        if (SVGObjectIsOpaque(this)) {
            return;
        }

        let {id, type} = parseSVGObjectId(this.id());
        if (id === undefined || type === undefined) {
		console.log('undefined')
            return;
        }

        if (type === 'unit') {
            if (selectedCiv.units.includes(id)) {
                return;
            }
        } else if (type === 'building') {
            if (selectedCiv.buildings.includes(id)) {
                return;
            }
        } else if (type === 'tech') {
            if (selectedCiv.techs.includes(id)) {
                return;
            }
        }
        makeSVGObjectOpaque(this);
    });

    enable(selectedCiv[1], selectedCiv[0], selectedCiv[2]);
}

function caretType (caretId) {
	var index = caretId.indexOf('_');
	var type = caretId.substr(0, index);
	return type + 's';
}

function idType (id) {
	var index = id.indexOf('_');
	var type = id.substr(0, index);
	if (type === 'unit') {
		return 0;
	}
	if (type === 'building') {
		return 1;
	}
	if (type === 'tech') {
		return 2;
	}
	return -1;
}

function idID (id) {
	var index = id.indexOf('_');
	return parseInt(id.substr(index+1, id.length-1), 10);
}

function SVGObjectIsOpaque(svgObj) {
    return svgObj.attr('fill-opacity') === 1
}

function makeSVGObjectOpaque(svgObj) {
    svgObj.attr({'fill-opacity': 1});
}

function parseSVGObjectId(svgObjId) {
    const id_regex = /(.+)_([\d]+)_(x|copy)/;

    const found = svgObjId.match(id_regex);
    if (!found) {
        return {id: undefined, type: undefined};
    }
    let id = parseInt(found[2]);
    let type = found[1];

    return {id, type}
}

function techtreeDoesNotHaveScrollbar() {
    const techtreeElement = document.getElementById('techtree');
    return techtreeElement.scrollHeight <= techtreeElement.clientHeight;
}

function shiftKeyIsNotPressed(e) {
    return !e.shiftKey;
}

function getLocaleFromUrlIfExists(defaultValue) {
    const urlParams = new URLSearchParams(window.location.search);
    const lng = urlParams.get('lng');
    if (Object.keys(locales).includes(lng)) {
        return lng;
    }
    return defaultValue;
}

function setLocaleInUrl(locale) {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set('lng', locale);
    history.pushState({}, null, `?${searchParams}${window.location.hash}`);
}

function setLocaleInLocalStorage(localeCode) {
    try {
        window.localStorage.setItem('locale', localeCode);
    } catch (e) {
        // pass
    }
}

function getInitialLocale() {
    let storedLocale = defaultLocale;
    try {
        storedLocale = window.localStorage.getItem('locale');
    } catch (e) {
        // pass
    }
    storedLocale = getLocaleFromUrlIfExists(storedLocale);
    return storedLocale;
}

//tree = initial tree to display on load
//playerNumber = player to send information to if editable == 1
//editable: 0 = view in draft, 1 = edit in draft, 2 = view in builder, 3 = edit in builder
//points: starting techtree points
//civdescription: html shown in left-hand side bar
function showTechtree(tree, playerNumber, editable, points, civdescription) {

	localtree = tree;
	player = playerNumber;

	canEdit = editable;
	techtree_points = points;

	var stylesheet = document.createElement('link');
	stylesheet.rel = 'stylesheet';
	stylesheet.href = '/aoe2techtree/style.css';
	stylesheet.id = 'tech_styles';

	document.head.appendChild(stylesheet);

	var elements = document.querySelectorAll( 'body *' );
	for (const elem of elements) {
		elem.hidden = true;
	}

	var container = document.createElement('div');
	container.id = 'container';

	var wrapper = document.createElement('div');
	wrapper.id = 'wrapper';

	var techtree = document.createElement('div');
	techtree.id = 'techtree';

	var helptext = document.createElement('div');
	helptext.id = 'helptext';

	var helptext_content = document.createElement('div');
	helptext_content.id = 'helptext__content';

	if (civdescription.length != 0) {
		var panel = document.createElement('div');
		panel.id = 'panel';

		var civtext = document.createElement('p');
		civtext.id = 'descriptiontext';
		civtext.innerHTML = civdescription;

		panel.appendChild(civtext)
		wrapper.appendChild(panel)
	}

	helptext.appendChild(helptext_content);
	techtree.appendChild(helptext);
	wrapper.appendChild(techtree);
	container.appendChild(wrapper);

	var toolbar = document.createElement('div');
	toolbar.id = 'toolbar';

	var points = document.createElement('div');
	points.id = 'points';

	var reset = document.createElement('div');
	reset.id = 'reset';
	reset.innerHTML = 'Reset';

	var done = document.createElement('div');
	done.id = 'done';
	if (canEdit == 4) {
		done.innerHTML = 'Download';
		done.style.flex = '40%';
	} else {
		done.innerHTML = 'Done';
	}

	if ((canEdit == 2) || (canEdit == 4)) {
		toolbar.appendChild(reset);
		toolbar.appendChild(points);
		toolbar.appendChild(done);
	} else {
		toolbar.appendChild(points);
		toolbar.appendChild(reset);
		toolbar.appendChild(done);
	}

	if (canEdit == 0) {
		points.style.visibility = 'hidden';
		reset.style.visibility = 'hidden';
	} else if ((canEdit == 2) || (canEdit == 4)) {
		reset.style.visibility = 'hidden';
		points.style.textAlign = 'right';
		points.style.marginRight = '20px';
	}

        document.getElementsByTagName('body')[0].appendChild(container)
	document.getElementsByTagName('body')[0].appendChild(toolbar)

    setAdvancedStatsState();

    let storedLocale = getInitialLocale();

    loadJson("/aoe2techtree/data/data.json", function (response) {
        data = response;
        civs = data.techtrees;
        loadLocale(storedLocale);
    });



    let doVerticalScroll = true;
    const techtreeElement = document.getElementById('techtree');
    techtreeElement.addEventListener('wheel', function (e) {
        if (e.deltaX !== 0) {
            doVerticalScroll = false;
        }
        if (doVerticalScroll && techtreeDoesNotHaveScrollbar() && shiftKeyIsNotPressed(e)) {
            if (e.deltaY > 0) {
                techtreeElement.scrollLeft += 150;
            } else if (e.deltaY < 0) {
                techtreeElement.scrollLeft -= 150;
            }
        }
    });
    const toolbarElement = document.getElementById('points');
    toolbarElement.addEventListener('wheel', function (e) {
        if (e.deltaX !== 0) {
            doVerticalScroll = false;
        }
        if (doVerticalScroll && techtreeDoesNotHaveScrollbar() && shiftKeyIsNotPressed(e)) {
            if (e.deltaY > 0) {
                techtreeElement.scrollLeft += 150;
            } else if (e.deltaY < 0) {
                techtreeElement.scrollLeft -= 150;
            }
        }
    });

}
