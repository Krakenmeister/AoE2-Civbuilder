var socket = io();

var client_palette;
var client_alias;
var client_architecture;
var client_language;

function renderLobby(draft) {
	$("body").contents().not("script").remove();

	var playerNumber = getCookie("playerNumber");

	var title = document.createElement("h1");
	title.id = "title";
	title.innerHTML = "Civilization Drafter";

	var lobbybox = document.createElement("div");
	lobbybox.className = "bgbox";

	var playergrid = document.createElement("div");
	playergrid.className = "grid-container";
	playergrid.style.gridTemplateRows = "repeat(" + draft["preset"]["slots"] + ", 1fr)";
	for (var i = 0; i < draft["preset"]["slots"]; i++) {
		var tag = document.createElement("div");
		tag.className = "column1";
		if (i == 0) {
			tag.innerHTML = "Host:";
		} else {
			tag.innerHTML = "Player " + (i + 1) + ":";
		}

		var name = document.createElement("div");
		name.className = "column2";
		name.innerHTML = draft["players"][i]["name"];

		var ready = document.createElement("div");
		ready.className = "column3";
		if (i != 0) {
			if (draft["players"][i]["ready"] == 0) {
				ready.innerHTML = "x";
			} else if (draft["players"][i]["ready"] == 1) {
				ready.innerHTML = "✓";
			}
		}

		playergrid.appendChild(tag);
		playergrid.appendChild(name);
		playergrid.appendChild(ready);
	}
	lobbybox.appendChild(playergrid);

	var button = document.createElement("button");
	button.className = "readybutton";
	if (playerNumber == 0) {
		var allready = 1;
		for (var i = 1; i < draft["preset"]["slots"]; i++) {
			if (draft["players"][i]["ready"] == 0) {
				allready = 0;
			}
		}
		if (allready == 0) {
			button.innerHTML = "Lobby Not Ready";
		} else {
			button.innerHTML = "Start Draft";
			button.onclick = function () {
				readyLobby();
			};
		}
		lobbybox.appendChild(button);
	} else if (playerNumber > 0) {
		if (draft["players"][playerNumber]["ready"] == 0) {
			button.innerHTML = "Ready";
		} else {
			button.innerHTML = "Unready";
		}
		button.onclick = function () {
			readyPlayer(playerNumber);
		};
		lobbybox.appendChild(button);
	}

	document.getElementsByTagName("body")[0].appendChild(title);
	document.getElementsByTagName("body")[0].appendChild(lobbybox);
}

function renderSnipe(draft) {}

function renderTechtree(draft) {
	$("body").contents().not("script").remove();

	var playerNumber = getCookie("playerNumber");

	if (playerNumber >= 0 && draft["players"][playerNumber]["ready"] === 0) {
		var waiting = document.createElement("div");
		waiting.id = "wrapping";

		var title = document.createElement("h1");
		title.id = "title";
		title.innerHTML = "Waiting For Players";

		waiting.appendChild(title);
		document.getElementsByTagName("body")[0].appendChild(waiting);
		showTechtree(draft["players"][playerNumber]["tree"], playerNumber, 1, draft["preset"]["points"], "", "..");
	} else {
		var waiting = document.createElement("div");
		waiting.id = "wrapping";

		var title = document.createElement("h1");
		title.id = "title";
		title.innerHTML = "Waiting For Players";

		waiting.appendChild(title);
		document.getElementsByTagName("body")[0].appendChild(waiting);
	}
}

function renderFlagTech(draft) {
	$("body").contents().not("script").remove();

	var playerNumber = getCookie("playerNumber");

	if (playerNumber >= 0 && draft["players"][playerNumber]["ready"] === 0) {
		var flag_palette;
		var architecture;
		var language;

		var wrapping = document.createElement("div");
		wrapping.id = "wrapping";

		var flagbox = document.createElement("div");
		flagbox.className = "flagbox";

		var header = document.createElement("div");
		header.id = "header";
		header.innerHTML = "Flag Creator";

		var contain = document.createElement("div");
		contain.id = "contain";

		var pickGrid = document.createElement("div");
		pickGrid.id = "pickGrid";

		var flagDiv = document.createElement("div");
		flagDiv.id = "flagDiv";

		var canvas = document.createElement("canvas");
		canvas.id = "flag";
		canvas.width = "256";
		canvas.height = "256";

		flagDiv.appendChild(canvas);

		var label = document.createElement("label");
		label.id = "civlabel";
		label.setAttribute("for", "alias");
		label.innerHTML = "Civilization Name";

		var input = document.createElement("input");
		input.type = "text";
		input.id = "alias";
		input.name = "civname";

		var next = document.createElement("button");
		next.className = "readybutton";
		next.innerHTML = "Next";
		next.onclick = function () {
			var inputbox = document.getElementById("alias");

			if (validate(inputbox.value)) {
				$("body").contents().not("script").remove();

				var waiting = document.createElement("div");
				waiting.id = "wrapping";

				var title = document.createElement("h1");
				title.id = "title";
				title.innerHTML = "Waiting For Players";

				waiting.appendChild(title);
				document.getElementsByTagName("body")[0].appendChild(waiting);

				client_palette = flag_palette;
				client_alias = inputbox.value;
				client_architecture = architecture;
				client_language = language;

				updateCivInfo(playerNumber);
				//showTechtree(draft["players"][playerNumber]["tree"], playerNumber, 1, draft["preset"]["points"], "", "..");
			}
		};

		flag_palette = draft["players"][playerNumber]["flag_palette"];
		architecture = draft["players"][playerNumber]["architecture"];
		language = draft["players"][playerNumber]["language"];

		function getFun1(val) {
			return function () {
				flag_palette[val] = (flag_palette[val] - 1 + palette_sizes[val]) % palette_sizes[val];
				clientFlag(flag_palette, "flag", 1, "..");
			};
		}

		function getFun2(val) {
			return function () {
				flag_palette[val] = (flag_palette[val] + 1 + palette_sizes[val]) % palette_sizes[val];
				clientFlag(flag_palette, "flag", 1, "..");
			};
		}

		for (var i = 0; i < 8; i++) {
			var backbutton = document.createElement("button");
			backbutton.className = "backbutton";
			backbutton.innerHTML = "<";
			backbutton.onclick = getFun1(i);

			var category = document.createElement("div");
			category.className = "category";
			category.innerHTML = categories[i];

			var forwardbutton = document.createElement("button");
			forwardbutton.className = "forwardbutton";
			forwardbutton.innerHTML = ">";
			forwardbutton.onclick = getFun2(i);

			pickGrid.appendChild(backbutton);
			pickGrid.appendChild(category);
			pickGrid.appendChild(forwardbutton);
		}

		var archbox = document.createElement("div");
		archbox.id = "archbox";

		var architectureIconBox = document.createElement("div");
		architectureIconBox.style.display = "flex";
		architectureIconBox.style.flexDirection = "column";
		architectureIconBox.style.alignItems = "center";
		architectureIconBox.style.justifyContent = "center";

		var architectureIcon = document.createElement("img");
		architectureIcon.id = "architectureicon";
		architectureIcon.src = `../img/architectures/tc_${architecture}.png`;

		var architectureText = document.createElement("div");
		architectureText.id = "architecturetext";
		architectureText.style.fontSize = "20px";
		architectureText.style.width = "200px";
		architectureText.style.textAlign = "center";
		architectureText.innerHTML = `${architectures[architecture - 1]}`;

		architectureIconBox.appendChild(architectureIcon);
		architectureIconBox.appendChild(architectureText);

		var iconback = document.createElement("button");
		iconback.className = "backbutton";
		iconback.innerHTML = "<";
		iconback.onclick = function () {
			architecture = ((architecture - 1 + 10) % 11) + 1;
			document.getElementById("architectureicon").src = `../img/architectures/tc_${architecture}.png`;
			document.getElementById("architecturetext").innerHTML = `${architectures[architecture - 1]}`;
		};

		var iconforward = document.createElement("button");
		iconforward.className = "forwardbutton";
		iconforward.innerHTML = ">";
		iconforward.onclick = function () {
			architecture = ((architecture - 1 + 1) % 11) + 1;
			document.getElementById("architectureicon").src = `../img/architectures/tc_${architecture}.png`;
			document.getElementById("architecturetext").innerHTML = `${architectures[architecture - 1]}`;
		};

		archbox.appendChild(iconback);
		archbox.appendChild(architectureIconBox);
		archbox.appendChild(iconforward);

		var langbox = document.createElement("div");
		langbox.id = "langbox";

		var languagetext = document.createElement("div");
		languagetext.id = "languagetext";
		languagetext.innerHTML = languages[language];

		var langiconback = document.createElement("button");
		langiconback.className = "backbutton";
		langiconback.innerHTML = "<";
		langiconback.onclick = function () {
			language = (language + (languages.length - 1)) % languages.length;
			document.getElementById("languagetext").innerHTML = languages[language];
		};

		var langiconforward = document.createElement("button");
		langiconforward.className = "forwardbutton";
		langiconforward.innerHTML = ">";
		langiconforward.onclick = function () {
			language = (language + 1) % languages.length;
			document.getElementById("languagetext").innerHTML = languages[language];
		};

		langbox.appendChild(langiconback);
		langbox.appendChild(languagetext);
		langbox.appendChild(langiconforward);

		contain.appendChild(pickGrid);
		contain.appendChild(flagDiv);

		flagbox.appendChild(header);
		flagbox.appendChild(contain);
		flagbox.appendChild(archbox);
		flagbox.appendChild(langbox);
		flagbox.appendChild(label);
		flagbox.appendChild(input);
		flagbox.appendChild(next);

		wrapping.appendChild(flagbox);

		document.getElementsByTagName("body")[0].appendChild(wrapping);

		document.getElementsByClassName("flagbox")[0].style.transform = `scale(${(0.9 * window.innerHeight) / flagbox.getBoundingClientRect().height})`;
		clientFlag(flag_palette, "flag", 1, "..");
	} else {
		$("body").contents().not("script").remove();
		var waiting = document.createElement("div");
		waiting.id = "wrapping";

		var title = document.createElement("h1");
		title.id = "title";
		title.innerHTML = "Waiting For Players";

		waiting.appendChild(title);
		document.getElementsByTagName("body")[0].appendChild(waiting);
	}
}

function renderDraftTable(draft) {
	var numPlayers = draft["preset"]["slots"];
	var roundType = Math.max(Math.floor(draft["gamestate"]["turn"] / numPlayers) - (draft["preset"]["rounds"] - 1), 0);
	var playerNum = draft["gamestate"]["order"][draft["gamestate"]["turn"] % numPlayers];
	if (roundType == 2 || roundType == 4) {
		playerNum = draft["gamestate"]["order"][numPlayers - 1 - (draft["gamestate"]["turn"] % numPlayers)];
	}
	var playerNumber = getCookie("playerNumber");

	//If looking at tech tree, don't disturb the player until they exit the techtree, or it is their turn
	var techtreestyles = document.getElementById("tech_styles");
	if (!(typeof techtreestyles != "undefined" && techtreestyles != null) || playerNum == playerNumber) {
		$("body").contents().not("script").remove();
		if (typeof techtreestyles != "undefined" && techtreestyles != null) {
			techtreestyles.remove();
		}

		document.body.style.backgroundImage = "url('../img/draftbackground.jpg')";

		var header = document.createElement("div");
		header.id = "phaseheader";

		var phase = document.createElement("h1");
		phase.id = "phase";

		var round = document.createElement("div");
		round.id = "round";

		//Display which round the drafting is in
		if (roundType == 0) {
			phase.innerHTML = "Civilization Bonuses";
		} else if (roundType == 1) {
			phase.innerHTML = "Unique Units";
		} else if (roundType == 2) {
			phase.innerHTML = "Unique Techs: Castle";
		} else if (roundType == 3) {
			phase.innerHTML = "Unique Techs: Imperial";
		} else if (roundType == 4) {
			phase.innerHTML = "Team Bonuses";
		}
		round.innerHTML = "Round " + (roundType + 1);

		header.appendChild(phase);
		header.appendChild(round);

		var game = document.createElement("div");
		game.id = "game";
		game.style.height = "auto";

		var players = document.createElement("div");
		players.id = "players";

		//Show tech tree of a particular player
		function getFun1(val) {
			return function () {
				var description = `<span><b>${draft["players"][val]["alias"]}</b></span><br><br>`;
				for (var a = 0; a < draft["players"][val]["bonuses"][0].length; a++) {
					description += "•";
					description += card_descriptions[0][draft["players"][val]["bonuses"][0][a]][0];
					description += "<br>";
				}
				description += "<br><span><b>Unique Unit:</b></span><br>";
				if (draft["players"][val]["bonuses"][1].length != 0) {
					description += card_descriptions[1][draft["players"][val]["bonuses"][1][0]][0];
					description += "<br>";
				}
				description += "<br><span><b>Unique Techs:</b></span><br>";
				if (draft["players"][val]["bonuses"][2].length != 0) {
					description += "•";
					description += card_descriptions[2][draft["players"][val]["bonuses"][2][0]][0];
					description += "<br>";
				}
				if (draft["players"][val]["bonuses"][3].length != 0) {
					description += "•";
					description += card_descriptions[3][draft["players"][val]["bonuses"][3][0]][0];
					description += "<br>";
				}
				description += "<br><span><b>Team Bonus:</b></span><br>";
				if (draft["players"][val]["bonuses"][4].length != 0) {
					description += card_descriptions[4][draft["players"][val]["bonuses"][4][0]][0];
				}
				showTechtree(draft["players"][val]["tree"], val, 0, 1, description, "..");
			};
		}

		//Show player information to the left of the board
		for (var n = 0; n < numPlayers; n++) {
			var i = draft["gamestate"]["order"][n];

			var player = document.createElement("div");
			player.className = "playercard";
			player.id = "player" + i;
			player.style.cursor = "pointer";
			player.onclick = getFun1(i);

			var image = document.createElement("div");
			image.className = "image";

			if (i == playerNum) {
				image.style.border = "solid 8px rgba(0, 200, 0, 255)";
			} else {
				image.style.border = "solid 8px rgba(0, 0, 0, 0)";
			}

			var text = document.createElement("div");
			text.className = "text";

			var canvas = document.createElement("canvas");
			canvas.id = "flag" + i;
			canvas.width = "85";
			canvas.height = "85";
			canvas.className = "flag";

			var name = document.createElement("div");
			name.className = "playername";
			if (draft["players"][i]["name"].length > 12) {
				name.style.fontSize = 2 * Math.exp(-1 * (draft["players"][i]["name"].length / 28)) + "vw";
				name.style.lineHeight = 1.5 * Math.exp(-1 * (draft["players"][i]["name"].length / 28)) + "vw";
			}
			name.innerHTML = draft["players"][i]["name"];

			var alias = document.createElement("div");
			alias.className = "alias";
			if (draft["players"][i]["alias"].length > 10) {
				alias.style.fontSize = 3.3 * Math.exp(-1 * (draft["players"][i]["alias"].length / 25)) + "vw";
				alias.style.lineHeight = 2.6 * Math.exp(-1 * (draft["players"][i]["alias"].length / 25)) + "vw";
			}
			alias.innerHTML = draft["players"][i]["alias"];

			image.appendChild(canvas);
			text.appendChild(alias);
			text.appendChild(name);

			player.appendChild(image);
			player.appendChild(text);

			players.appendChild(player);
		}

		var board = document.createElement("div");
		board.id = "board";

		function getFun2(val) {
			return function () {
				endTurn(val, draft["gamestate"]["turn"]);
			};
		}

		//Outline hovered card and display help text
		function getFun3(text, cardId, size, colour, rarity, roundType, draftCard) {
			return function () {
				var hover_card = document.getElementById("card" + cardId);
				document.getElementById("cardimage" + cardId).style.filter = "brightness(150%)";
				document.getElementById("cardborder" + cardId).style.filter = "brightness(150%)";

				var help = document.getElementById("helpboxcontainer");
				help.style.visibility = "visible";
				if (roundType != 1) {
					var helptext = document.getElementById("helpboxtext");
					helptext.style.fontSize = "80px";
					helptext.innerHTML = `<span class="rarityText${rarity}">${rarityTexts[rarity]}</span><br>${text}`;
					fitText("helpboxtext");
				} else {
					var helptext = document.getElementById("helpboxtext");

					let costsElement = `<div class="statwrapper">`;
					for (let i = 0; i < 4; i++) {
						if (unitStats[draftCard].cost[i] != 0) {
							costsElement += `<img src="../img/staticons/${costIcons[i]}" class="staticon">
								<div class="stattext" style="margin-right:0.75vw">${unitStats[draftCard].cost[i]}</div>
							`;
						}
					}
					costsElement += `</div>`;

					let detailsElement = `<div id="detailedstats" style="display:flex;margin-bottom:50px;">`;
					for (let i = 0; i < unitStats[draftCard].attacks.elite.length; i++) {
						if (unitStats[draftCard].attacks.elite[i][0] == 3 || unitStats[draftCard].attacks.elite[i][0] == 4) {
							continue;
						}

						let eliteBonusAmount = unitStats[draftCard].attacks.elite[i][1];
						let basicBonusAmount = 0;
						for (let j = 0; j < unitStats[draftCard].attacks.basic.length; j++) {
							if (unitStats[draftCard].attacks.basic[j][0] == unitStats[draftCard].attacks.elite[i][0]) {
								basicBonusAmount = unitStats[draftCard].attacks.basic[j][1];
							}
						}
						detailsElement += `<div>+ ${
							basicBonusAmount == eliteBonusAmount ? basicBonusAmount : basicBonusAmount + " (" + eliteBonusAmount + ")"
						} vs. ${classToName[unitStats[draftCard].attacks.elite[i][0]]}</div>`;
					}
					if (unitStats[draftCard].special) {
						detailsElement += `<div style="font-size:1.1vw"><u>Special Rule</u>: ${unitStats[draftCard].special}</div>`;
					}
					detailsElement += `</div>`;

					let attackType = -1;
					let attackAmounts = [-1, -1];
					for (let i = 0; i < unitStats[draftCard].attacks.basic.length; i++) {
						if (unitStats[draftCard].attacks.basic[i][0] == 4) {
							attackType = 4;
							attackAmounts[0] = unitStats[draftCard].attacks.basic[i][1];
						} else if (unitStats[draftCard].attacks.basic[i][0] == 3) {
							attackType = 3;
							attackAmounts[0] = unitStats[draftCard].attacks.basic[i][1];
						}
					}
					for (let i = 0; i < unitStats[draftCard].attacks.elite.length; i++) {
						if (unitStats[draftCard].attacks.elite[i][0] == attackType) {
							attackAmounts[1] = unitStats[draftCard].attacks.elite[i][1];
						}
					}

					let rangeElement = `<div class="statwrapper">
						<img src="../img/staticons/range.png" class="staticon">
						<div class="stattext">${
							unitStats[draftCard].range.length == 1
								? unitStats[draftCard].range
								: unitStats[draftCard].range[0] + " (" + unitStats[draftCard].range[1] + ")"
						}</div>
					</div>`;

					helptext.innerHTML = `
						<div id="unitprofile">
							<div class="rarityText${rarity}" style="font-size:2vw">${rarityTexts[rarity]}</div>
							<img src="../img/unitgraphics/uu_${draftCard}.jpg" class="unitgraphic">
							<div id="unitstatswrapper">
								<div>${card_descriptions[1][draftCard][0]}</div>
								${costsElement}
								<div class="statwrapper">
									<img src="../img/staticons/hp.png" class="staticon">
									<div class="stattext">${
										unitStats[draftCard].hp.length == 1
											? unitStats[draftCard].hp
											: unitStats[draftCard].hp[0] + " (" + unitStats[draftCard].hp[1] + ")"
									}</div>
								</div>
								<div class="statwrapper">
									<img src="../img/staticons/${attackType == 3 ? "pierceAttack.png" : "damage.png"}" class="staticon">
									<div class="stattext">${attackAmounts[0] == attackAmounts[1] ? attackAmounts[0] : attackAmounts[0] + " (" + attackAmounts[1] + ")"}</div>
								</div>
								${unitStats[draftCard].range[0] > 0 ? rangeElement : ""}
								<div class="statwrapper">
									<img src="../img/staticons/reloadTime.png" class="staticon">
									<div class="stattext">${
										unitStats[draftCard].reload.length == 1
											? unitStats[draftCard].reload + " seconds"
											: unitStats[draftCard].reload[0] + " seconds (" + unitStats[draftCard].reload[1] + ")"
									}</div>
								</div>
								<div class="statwrapper">
									<img src="../img/staticons/movementSpeed.png" class="staticon">
									<div class="stattext">${
										unitStats[draftCard].speed.length == 1
											? unitStats[draftCard].speed
											: unitStats[draftCard].speed[0] + " (" + unitStats[draftCard].speed[1] + ")"
									}</div>
								</div>
								<div class="statwrapper">
									<img src="../img/staticons/armor.png" class="staticon">
									<div class="stattext" style="margin-right:0.75vw">${
										unitStats[draftCard].armors.basic[0] == unitStats[draftCard].armors.elite[0]
											? unitStats[draftCard].armors.basic[0]
											: unitStats[draftCard].armors.basic[0] + " (" + unitStats[draftCard].armors.elite[0] + ")"
									}</div>
									<img src="../img/staticons/range-armor.png" class="staticon">
									<div class="stattext">${
										unitStats[draftCard].armors.basic[1] == unitStats[draftCard].armors.elite[1]
											? unitStats[draftCard].armors.basic[1]
											: unitStats[draftCard].armors.basic[1] + " (" + unitStats[draftCard].armors.elite[1] + ")"
									}</div>
								</div>
								${detailsElement}
							</div>
						</div>
					`;
					document.getElementById("detailedstats").style.display = "flex";
					document.getElementById("helpboximage").src = "../img/helpbackgroundextended.png";
					document.getElementById("helpboxcontainer").style.height = "19vw";
					fitHeight("helpboxcontainer");
				}
				var finish_button = document.getElementById("finish");
				finish_button.style.visibility = "hidden";
				var share_button = document.getElementById("clear");
				share_button.style.visibility = "hidden";
				var home_button = document.getElementById("homeBtn");
				home_button.style.visibility = "hidden";
			};
		}

		//Hide outline and help text
		function getFun4(cardId) {
			return function () {
				document.getElementById("cardimage" + cardId).style.filter = "";
				document.getElementById("cardborder" + cardId).style.filter = "";
				var help = document.getElementById("helpboxcontainer");
				help.style.visibility = "hidden";
			};
		}

		function getFun6(cardId) {
			return function (event) {
				event.preventDefault();
				if (document.getElementById("detailedstats")) {
					if (document.getElementById("detailedstats").style.display == "flex") {
						document.getElementById("detailedstats").style.display = "none";
						document.getElementById("helpboximage").src = "../img/helpbackground.png";
						document.getElementById("helpboxcontainer").style.height = "20vw";
					} else {
						document.getElementById("detailedstats").style.display = "flex";
						document.getElementById("helpboximage").src = "../img/helpbackgroundextended.png";
						document.getElementById("helpboxcontainer").style.height = "19vw";
						fitHeight("helpboxcontainer");
					}
				}
				return false;
			};
		}

		function getNoFun() {
			return function () {};
		}

		var canRefill = 0;
		var cardSize;
		var marginSize;
		//Size cards appropriately so they all fit on-screen
		if (draft["gamestate"]["cards"].length < 9) {
			cardSize = 16;
		} else if (draft["gamestate"]["cards"].length < 13) {
			cardSize = 12;
		} else if (draft["gamestate"]["cards"].length < 15) {
			cardSize = 11;
		} else if (draft["gamestate"]["cards"].length < 19) {
			cardSize = 10;
		} else if (draft["gamestate"]["cards"].length < 25) {
			cardSize = 9;
		} else if (draft["gamestate"]["cards"].length < 33) {
			cardSize = 8;
		} else if (draft["gamestate"]["cards"].length < 45) {
			cardSize = 7;
		} else {
			cardSize = 6;
		}
		if (draft["gamestate"]["cards"].length < 19) {
			marginSize = 1;
		} else if (draft["gamestate"]["cards"].length < 33) {
			marginSize = 0.5;
		} else {
			marginSize = 0.3;
		}
		//Add all cards stored in gamestate to the board
		for (var i = 0; i < draft["gamestate"]["cards"].length; i++) {
			var card = document.createElement("div");
			card.className = "card";
			card.id = "card" + i;
			card.style.width = cardSize + "vw";
			card.style.height = cardSize + "vw";
			card.style.margin = marginSize + "vw";
			if (draft["gamestate"]["cards"][i] == -1) {
				card.style.visibility = "hidden";
				card.onmouseover = getNoFun();
				card.onmouseout = getNoFun();
				card.onclick = getNoFun();
				canRefill = 1;
			} else {
				//Display graphics on the card
				var prefix;
				if (roundType == 0) {
					prefix = "bonus";
				} else if (roundType == 1) {
					prefix = "uu";
				} else if (roundType == 2) {
					prefix = "castle";
				} else if (roundType == 3) {
					prefix = "imp";
				} else if (roundType == 4) {
					prefix = "team";
				}
				var path = `${prefix}_${draft["gamestate"]["cards"][i]}.jpg`;

				var image = document.createElement("img");
				image.className = `cardimage ${rarities[card_descriptions[roundType][draft["gamestate"]["cards"][i]][1]]}`;
				image.id = "cardimage" + i;
				image.src = "../img/compressedcards/" + path;
				card.appendChild(image);

				var border = document.createElement("img");
				border.id = "cardborder" + i;
				border.className = `cardborder ${rarities[card_descriptions[roundType][draft["gamestate"]["cards"][i]][1]]}`;
				border.src = "../img/cards/card_border.png";
				card.appendChild(border);

				var frame = document.createElement("img");
				frame.className = "cardframe";
				frame.src = `../img/frames/frame_${rarities[card_descriptions[roundType][draft["gamestate"]["cards"][i]][1]]}.png`;
				card.appendChild(frame);

				//Let the active player pick a card
				if (playerNum == playerNumber) {
					if (draft["gamestate"]["highlighted"].length == 0) {
						card.style.cursor = "pointer";
						card.onmouseover = getFun3(
							card_descriptions[roundType][draft["gamestate"]["cards"][i]][0],
							i,
							cardSize,
							[0, 255, 0, 0.7],
							card_descriptions[roundType][draft["gamestate"]["cards"][i]][1],
							roundType,
							draft["gamestate"]["cards"][i]
						);
						card.onmouseout = getFun4(i);
						card.onclick = getFun2(draft["gamestate"]["cards"][i]);
					} else if (draft["gamestate"]["highlighted"].includes(i)) {
						card.style.cursor = "pointer";
						card.onmouseover = getFun3(
							card_descriptions[roundType][draft["gamestate"]["cards"][i]][0],
							i,
							cardSize,
							[0, 255, 0, 0.7],
							card_descriptions[roundType][draft["gamestate"]["cards"][i]][1],
							roundType,
							draft["gamestate"]["cards"][i]
						);
						card.onmouseout = getFun4(i);
						card.onclick = getFun2(draft["gamestate"]["cards"][i]);
					} else {
						card.onmouseover = getNoFun(); //These lines are part of the fix as well
						card.onmouseout = getNoFun(); //
						card.onclick = getNoFun(); //
						card.style.filter = "brightness(25%)";
					}
				} else {
					card.style.filter = "brightness(25%)";
					card.onmouseover = getFun3(
						card_descriptions[roundType][draft["gamestate"]["cards"][i]][0],
						i,
						cardSize,
						[255, 255, 0, 0.7],
						card_descriptions[roundType][draft["gamestate"]["cards"][i]][1],
						roundType,
						draft["gamestate"]["cards"][i]
					);
					card.onmouseout = getFun4(i);
					card.onclick = getNoFun(); //I think this should fix the bug!
				}
			}
			board.appendChild(card);
		}

		//Add the refill and clear buttons
		if (playerNum == playerNumber && canRefill == 1) {
			var boardtoolbar = document.createElement("div");
			boardtoolbar.id = "boardtoolbar";
			boardtoolbar.style.zIndex = 12;

			var refill = document.createElement("div");
			refill.id = "refill";
			refill.innerHTML = "Refill";
			refill.onclick = function () {
				refillCards();
			};

			var clear = document.createElement("div");
			clear.id = "clear";
			clear.innerHTML = "Clear";
			clear.onclick = function () {
				clearCards();
			};

			boardtoolbar.appendChild(refill);
			boardtoolbar.appendChild(clear);

			document.getElementsByTagName("body")[0].appendChild(boardtoolbar);
		}

		//Add card description box
		var helpboxcontainer = document.createElement("div");
		helpboxcontainer.id = "helpboxcontainer";
		helpboxcontainer.style.visibility = "hidden";

		var helpbox = document.createElement("div");
		helpbox.id = "helpbox";

		var helpboximage = document.createElement("img");
		helpboximage.id = "helpboximage";
		helpboximage.src = "../img/helpbackground.png";

		var helpboxtext = document.createElement("div");
		helpboxtext.id = "helpboxtext";

		helpbox.appendChild(helpboximage);
		helpbox.appendChild(helpboxtext);
		helpboxcontainer.appendChild(helpbox);
		document.getElementsByTagName("body")[0].appendChild(helpboxcontainer);

		game.appendChild(players);
		game.appendChild(board);

		document.getElementsByTagName("body")[0].appendChild(header);
		document.getElementsByTagName("body")[0].appendChild(game);

		//Render flags
		for (var i = 0; i < draft["preset"]["slots"]; i++) {
			clientFlag(draft["players"][i]["flag_palette"], "flag" + i, 85 / 256, "..");
		}
	}
}

function renderHelp() {
	$("body").contents().not("script").remove();
	document.body.style.backgroundImage = "url('../img/aoe2background.jpg')";

	var title = document.createElement("h1");
	title.id = "title";
	title.innerHTML = "Creating Mod...";

	document.getElementsByTagName("body")[0].appendChild(title);
}

function renderDownload() {
	$("body").contents().not("script").remove();
	document.body.style.backgroundImage = "url('../img/aoe2background.jpg')";

	var title = document.createElement("h1");
	title.id = "title";
	title.innerHTML = "Mod Created!";

	function getFun(val) {
		return function () {
			post(`${route}/download`, { draftID: val });
		};
	}

	var download = document.createElement("button");
	download.id = "download";
	download.innerHTML = "Download Mod";
	download.onclick = getFun(getCookie("draftID"));

	var instructionsbox = document.createElement("div");
	instructionsbox.id = "instructionsbox";

	var instructionstitle = document.createElement("p");
	instructionstitle.id = "instructionstitle";
	instructionstitle.innerHTML = "<b>Publication Instructions:</b><br>";

	var instructionstext = document.createElement("p");
	instructionstext.id = "instructionstext";
	instructionstext.innerHTML =
		'1. Click "Download Mod" and extract the .zip file<br><br>' +
		"2. Log-in to ageofempires.com<br><br>" +
		"3. Go to Mods → Submit a Mod<br><br>" +
		"4. Fill out the form as you wish with the following specifications:<br>&emsp;&emsp;A) Game = Age of Empires II DE,<br>&emsp;&emsp;B) Type = Data Mod,<br>&emsp;&emsp;C) Tags = Data Mod,<br>" +
		"&emsp;&emsp;D) Images = thumbnail.jpg found in extracted folder,<br>&emsp;&emsp;E) Zip File Upload = [id]-data.zip found in extracted folder,<br>&emsp;&emsp;F) Please credit me or the website!<br><br>" +
		"5. Submit the data mod, and go to Mods → Submit a Mod again to publish the UI Mod<br><br>" +
		"6. Fill out the form as you wish with the following specifications:<br>&emsp;&emsp;A) Game = Age of Empires II DE,<br>&emsp;&emsp;B) Type = User Interface,<br>&emsp;&emsp;C) Tags = User Interface,<br>" +
		"&emsp;&emsp;D) Images = thumbnail.jpg,<br>&emsp;&emsp;E) Zip File Upload = [id]-ui.zip found in extracted folder,<br>&emsp;&emsp;F) Please credit me or the website!<br><br>" +
		"7. Submit the UI mod, go to Mods → My Mods, and share the links with the other players!<br><br>";
	instructionsbox.appendChild(instructionstitle);
	instructionsbox.appendChild(instructionstext);

	document.getElementsByTagName("body")[0].appendChild(title);
	document.getElementsByTagName("body")[0].appendChild(download);
	document.getElementsByTagName("body")[0].appendChild(instructionsbox);
}

function renderGame(draft) {
	switch (draft["gamestate"]["phase"]) {
		case 0:
			renderLobby(draft);
			break;
		case 1:
			renderFlagTech(draft);
			break;
		case 2:
			renderDraftTable(draft);
			break;
		case 3:
			renderTechtree(draft);
			break;
		case 4:
			renderSnipe(draft);
			break;
		case 5:
			renderHelp();
			break;
		case 6:
			renderDownload();
			break;
	}
}

function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(";");
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

const path = window.location.pathname;
var parts = pathToArr(path);
var roomID = parts[parts.length - 1];

if (roomID != getCookie("draftID")) {
	alert("Spectator Permission Error");
}

socket.emit("join room", roomID);
socket.emit("get gamestate", roomID, getCookie("playerNumber"));

socket.on("set gamestate", function (draft) {
	renderGame(draft);
});

socket.on("bug", function () {
	alert(
		"Congratulations! Your draft experienced a bug causing multiple players to have the same card. I have been hunting this bug forever and have yet to find the cause. PLEASE message me on discord, Krakenmeister#1672 and detail everything you just did so I can try to find a solution. Thank you so much! Your draft could be completely messed up or just have a minor issue, continue at your own risk."
	);
});

function readyPlayer(playerNumber) {
	socket.emit("toggle ready", roomID, playerNumber);
}

function readyLobby() {
	socket.emit("start draft", roomID);
}

function updateTree(playerNumber, tree, techtree_points) {
	socket.emit("update tree", roomID, playerNumber, tree);
}

function updateCivInfo(playerNumber) {
	socket.emit("update civ info", roomID, playerNumber, client_alias, client_palette, client_architecture, client_language);
}

function endTurn(pick, client_turn) {
	socket.emit("end turn", roomID, pick, client_turn);
}

function refillCards() {
	socket.emit("refill", roomID);
}

function clearCards() {
	socket.emit("clear", roomID);
}

function getPrivateGamestate() {
	socket.emit("get private gamestate", roomID);
}
