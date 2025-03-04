//Initiliaze civ preset
const urlParams = new URLSearchParams(window.location.search);

let linkEdit = false;
let civ;
if (urlParams.get("civ")) {
	let json = urlParams.get("civ").replaceAll("%7D", "}").replaceAll("%7C", "|").replaceAll("%7B", "{").replaceAll("%5E", "^").replaceAll("%60", "`");
	civ = JSON.parse(decryptPath(json));
	linkEdit = true;
} else if (document.getElementById("civ")) {
	civ = JSON.parse(document.getElementById("civ").textContent);
} else {
	location.href = `${hostname}${route}`;
}

var roundType = 0;
var cardSize = 6;
var marginSize = 0.6;
var clientCustomFlag;
var clientCustomFlagURL;

if (civ["customFlagData"]) {
	clientCustomFlag = document.createElement("img");
	clientCustomFlag.src = civ["customFlagData"];
}

function includesCard(card) {
	let includesCard = false;
	for (let i = 0; i < civ["bonuses"][roundType].length; i++) {
		if (civ["bonuses"][roundType][i].length != 2) {
			if (civ["bonuses"][roundType][i] == card) {
				includesCard = true;
			}
		} else {
			if (civ["bonuses"][roundType][i][0] == card) {
				includesCard = true;
			}
		}
	}
	return includesCard;
}

renderPhase1();

//Display Flag Creator
function renderPhase1() {
	$("body").contents().not("script").remove();

	document.body.style.backgroundImage = "url('./img/aoe2background.jpg')";

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

	var customImageWrapper = document.createElement("div");
	customImageWrapper.id = "customImageWrapper";

	var customImageCheckboxWrapper = document.createElement("div");
	customImageCheckboxWrapper.id = "customImageCheckboxWrapper";

	var customImageCheckboxLabel = document.createElement("div");
	customImageCheckboxLabel.id = "customImageCheckboxLabel";
	customImageCheckboxLabel.textContent = "Use Custom Flag";

	var customImageCheckbox = document.createElement("input");
	customImageCheckbox.id = "customImageCheckbox";
	customImageCheckbox.type = "checkbox";

	customImageCheckbox.addEventListener("change", () => {
		if (document.getElementById("customImageCheckbox").checked) {
			civ["customFlag"] = true;
			document.getElementById("customImageInputLabel").style.visibility = "visible";
			var c = document.getElementById("flag");
			var ctx = c.getContext("2d");
			if (clientCustomFlag) {
				ctx.drawImage(clientCustomFlag, 0, 0, 256, 256);
			} else {
				ctx.fillStyle = "black";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			}
		} else {
			civ["customFlag"] = false;
			document.getElementById("customImageInputLabel").style.visibility = "hidden";
			clientFlag(civ["flag_palette"], "flag", 1);
		}
	});

	customImageCheckboxWrapper.appendChild(customImageCheckboxLabel);
	customImageCheckboxWrapper.appendChild(customImageCheckbox);

	var customImageInput = document.createElement("input");
	customImageInput.id = "customImageInput";
	customImageInput.className = "upload";
	customImageInput.name = "upload";
	customImageInput.type = "file";
	customImageInput.accept = "image/*";

	var customImageInputLabel = document.createElement("label");
	customImageInputLabel.innerHTML = "Choose image";
	customImageInputLabel.className = "upload";
	customImageInputLabel.id = "customImageInputLabel";
	customImageInputLabel.style.visibility = "hidden";

	customImageInputLabel.appendChild(customImageInput);

	customImageWrapper.appendChild(customImageCheckboxWrapper);
	customImageWrapper.appendChild(customImageInputLabel);

	flagDiv.appendChild(canvas);
	if (linkEdit) {
		customImageWrapper.innerHTML = `
      <div style="font-size:1.2rem;width:80%">Custom Flags not supported for editing via links (full .json files must be supplied)</div>
    `;
	}
	flagDiv.appendChild(customImageWrapper);

	(function () {
		function onChange(event) {
			var reader = new FileReader();
			reader.onload = onReaderLoad;
			reader.readAsDataURL(event.target.files[0]);
			if (event.target.files[0].size > 800000) {
				alert(
					"This is a large image file. This could slow mod creation speed or prohibit it altogether. A smaller or more compressed image is suggested."
				);
			}
		}

		$("#customImageInput").on("click touchstart", function () {
			$(this).val("");
		});

		function onReaderLoad(event) {
			civ["customFlagData"] = event.target.result;
			var c = document.getElementById("flag");
			var ctx = c.getContext("2d");
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			clientCustomFlag = document.createElement("img");
			clientCustomFlag.src = `${event.target.result}`;
			clientCustomFlag.addEventListener("load", () => {
				ctx.drawImage(clientCustomFlag, 0, 0, 256, 256);
			});
			fetch(event.target.result)
				.then((res) => res.blob())
				.then((blob) => {
					clientCustomFlagURL = URL.createObjectURL(blob);
				});
		}

		customImageInput.addEventListener("change", onChange);
	})();

	var label = document.createElement("label");
	label.id = "civlabel";
	label.setAttribute("for", "alias");
	label.innerHTML = "Civilization Name";

	var input = document.createElement("input");
	input.type = "text";
	input.id = "alias";
	input.name = "civname";
	if (civ["alias"]) {
		input.setAttribute("value", civ["alias"]);
	}

	var next = document.createElement("button");
	next.className = "readybutton";
	next.innerHTML = "Next";
	next.onclick = function () {
		var inputbox = document.getElementById("alias");
		if (validate(inputbox.value)) {
			civ["alias"] = inputbox.value;
			document.title = "Civilization Builder - " + civ["alias"];
			renderPhase2();
			if (
				civ["bonuses"][0].length == 0 &&
				civ["bonuses"][1].length == 0 &&
				civ["bonuses"][2].length == 0 &&
				civ["bonuses"][3].length == 0 &&
				civ["bonuses"][4].length == 0
			) {
				showTechtree(civ["tree"], -1, 3, 0, "");
			} else {
				var description = `<span><b>${civ["alias"]}</b></span><br><br>`;
				for (var a = 0; a < civ["bonuses"][0].length; a++) {
					description += "• ";
					if (civ["bonuses"][0][a].length != 2) {
						description += card_descriptions[0][civ["bonuses"][0][a]][0];
					} else {
						description += card_descriptions[0][civ["bonuses"][0][a][0]][0];
						if (civ["bonuses"][0][a][1] > 1) {
							description += ` [x${civ["bonuses"][0][a][1]}]`;
						}
					}
					description += "<br>";
				}
				description += "<br><span><b>Unique Unit:</b></span><br>";
				if (civ["bonuses"][1].length != 0) {
					description += card_descriptions[1][civ["bonuses"][1][0]][0];
					description += "<br>";
				}
				description += "<br><span><b>Unique Techs:</b></span><br>";
				if (civ["bonuses"][2].length != 0) {
					for (var a = 0; a < civ["bonuses"][2].length; a++) {
						description += "• ";
						if (civ["bonuses"][2][a].length != 2) {
							description += card_descriptions[2][civ["bonuses"][2][a]][0];
						} else {
							description += card_descriptions[2][civ["bonuses"][2][a][0]][0];
							if (civ["bonuses"][2][a][1] > 1) {
								description += ` [x${civ["bonuses"][2][a][1]}]`;
							}
						}
						description += "<br>";
					}
				}
				if (civ["bonuses"][3].length != 0) {
					for (var a = 0; a < civ["bonuses"][3].length; a++) {
						description += "• ";
						if (civ["bonuses"][3][a].length != 2) {
							description += card_descriptions[3][civ["bonuses"][3][a]][0];
						} else {
							description += card_descriptions[3][civ["bonuses"][3][a][0]][0];
							if (civ["bonuses"][3][a][1] > 1) {
								description += ` [x${civ["bonuses"][3][a][1]}]`;
							}
						}
						description += "<br>";
					}
				}
				description += "<br><span><b>Team Bonus:</b></span><br>";
				if (civ["bonuses"][4].length != 0) {
					for (var j = 0; j < civ["bonuses"][4].length; j++) {
						description += "• ";
						if (civ["bonuses"][4][j].length != 2) {
							description += card_descriptions[4][civ["bonuses"][4][j]][0];
						} else {
							description += card_descriptions[4][civ["bonuses"][4][j][0]][0];
							if (civ["bonuses"][4][j][1] > 1) {
								description += ` [x${civ["bonuses"][4][j][1]}]`;
							}
						}
						description += "<br>";
					}
				}
				showTechtree(civ["tree"], -1, 3, 0, description);
			}
		}
	};

	function getFun1(val) {
		return function () {
			civ["flag_palette"][val] = (civ["flag_palette"][val] - 1 + palette_sizes[val]) % palette_sizes[val];
			if (!civ["customFlag"]) {
				clientFlag(civ["flag_palette"], "flag", 1);
			}
		};
	}

	function getFun2(val) {
		return function () {
			civ["flag_palette"][val] = (civ["flag_palette"][val] + 1 + palette_sizes[val]) % palette_sizes[val];
			if (!civ["customFlag"]) {
				clientFlag(civ["flag_palette"], "flag", 1);
			}
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
	architectureIcon.src = `./img/architectures/tc_${civ["architecture"]}.png`;

	var architectureText = document.createElement("div");
	architectureText.id = "architecturetext";
	architectureText.style.fontSize = "20px";
	architectureText.style.width = "200px";
	architectureText.style.textAlign = "center";
	architectureText.innerHTML = `${architectures[civ["architecture"] - 1]}`;

	architectureIconBox.appendChild(architectureIcon);
	architectureIconBox.appendChild(architectureText);

	var iconback = document.createElement("button");
	iconback.className = "backbutton";
	iconback.innerHTML = "<";
	iconback.onclick = function () {
		civ["architecture"] = ((civ["architecture"] - 1 + 10) % 11) + 1;
		document.getElementById("architectureicon").src = `./img/architectures/tc_${civ["architecture"]}.png`;
		document.getElementById("architecturetext").innerHTML = `${architectures[civ["architecture"] - 1]}`;
	};

	var iconforward = document.createElement("button");
	iconforward.className = "forwardbutton";
	iconforward.innerHTML = ">";
	iconforward.onclick = function () {
		civ["architecture"] = ((civ["architecture"] - 1 + 1) % 11) + 1;
		document.getElementById("architectureicon").src = `./img/architectures/tc_${civ["architecture"]}.png`;
		document.getElementById("architecturetext").innerHTML = `${architectures[civ["architecture"] - 1]}`;
	};

	archbox.appendChild(iconback);
	archbox.appendChild(architectureIconBox);
	archbox.appendChild(iconforward);

	var langbox = document.createElement("div");
	langbox.id = "langbox";

	var languagetext = document.createElement("div");
	languagetext.id = "languagetext";
	languagetext.innerHTML = languages[civ["language"]];

	var langiconback = document.createElement("button");
	langiconback.className = "backbutton";
	langiconback.innerHTML = "<";
	langiconback.onclick = function () {
		civ["language"] = (civ["language"] + (languages.length - 1)) % languages.length;
		document.getElementById("languagetext").innerHTML = languages[civ["language"]];
	};

	var langiconforward = document.createElement("button");
	langiconforward.className = "forwardbutton";
	langiconforward.innerHTML = ">";
	langiconforward.onclick = function () {
		civ["language"] = (civ["language"] + 1) % languages.length;
		document.getElementById("languagetext").innerHTML = languages[civ["language"]];
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
	if (!civ["customFlag"]) {
		clientFlag(civ["flag_palette"], "flag", 1);
	}

	document.getElementsByClassName("flagbox")[0].style.transform = `scale(${(0.9 * window.innerHeight) / flagbox.getBoundingClientRect().height})`;

	if (civ["customFlag"]) {
		customImageCheckbox.checked = true;
		var c = document.getElementById("flag");
		var ctx = c.getContext("2d");
		if (clientCustomFlag) {
			ctx.drawImage(clientCustomFlag, 0, 0, 256, 256);
		} else {
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
	} else {
		customImageCheckbox.checked = false;
	}
}

function setTechTree(tree) {
	civ["tree"] = tree;
}

//Display bonus selection
function renderPhase2() {
	$("body").contents().not("script").remove();

	var techtreestyles = document.getElementById("tech_styles");
	if (typeof techtreestyles != "undefined" && techtreestyles != null) {
		techtreestyles.remove();
	}

	document.body.style.backgroundImage = "url('./img/draftbackground.jpg')";

	var sideheader = document.createElement("div");
	sideheader.id = "sideheader";

	var phase = document.createElement("h1");
	phase.id = "sidephase";

	var buttonleft = document.createElement("div");
	buttonleft.id = "buttonleft";
	buttonleft.innerHTML = "<";
	buttonleft.onclick = function () {
		roundType = (roundType + 4) % 5;
		renderPhase2();
	};

	var buttonright = document.createElement("div");
	buttonright.id = "buttonright";
	buttonright.innerHTML = ">";
	buttonright.onclick = function () {
		roundType = (roundType + 1) % 5;
		renderPhase2();
	};

	//Display which round the drafting is in
	if (roundType == 0) {
		phase.innerHTML = "Civilization Bonuses";
	} else if (roundType == 1) {
		phase.innerHTML = "Unique Units";
	} else if (roundType == 2) {
		phase.innerHTML = "Castle Unique Tech";
	} else if (roundType == 3) {
		phase.innerHTML = "Imperial Unique Tech";
	} else if (roundType == 4) {
		phase.innerHTML = "Team Bonuses";
	}
	sideheader.appendChild(buttonleft);
	sideheader.appendChild(phase);
	sideheader.appendChild(buttonright);

	var game = document.createElement("div");
	game.id = "game";
	game.style.height = "auto";

	var players = document.createElement("div");
	players.id = "players";

	//Size cards depending on slider
	var sliderbox = document.createElement("div");
	sliderbox.id = "sliderbox";
	sliderbox.style.top = "300px";

	var slidertext = document.createElement("div");
	slidertext.id = "slidertext";
	slidertext.innerHTML = "Card Size:";

	var sliderslider = document.createElement("input");
	sliderslider.id = "sliderslider";
	sliderslider.type = "range";
	sliderslider.min = "3";
	sliderslider.max = "16";
	sliderslider.step = "0.1";
	sliderslider.value = "6";
	sliderslider.oninput = function () {
		cardSize = parseInt(sliderslider.value, 10);
		marginSize = parseInt(sliderslider.value, 10) / 10;
		for (var i = 0; i < num_cards[roundType]; i++) {
			var resized_card = document.getElementById("card" + i);
			resized_card.style.width = cardSize + "rem";
			resized_card.style.height = cardSize + "rem";
			resized_card.style.margin = marginSize + "rem";
			if (includesCard(i)) {
				resized_card.style.marginRight = cardSize * 0.6 + "rem";
			}
			let old_resized_card = document.getElementById("card" + i);
			let new_resized_card = old_resized_card.cloneNode(true);
			old_resized_card.parentNode.replaceChild(new_resized_card, old_resized_card);
			new_resized_card.onmouseover = getFun3(
				card_descriptions[roundType][i][0],
				i,
				cardSize,
				[0, 255, 0, 0.7],
				card_descriptions[roundType][i][1],
				roundType
			);
			new_resized_card.onmouseout = getFun4(i);
			new_resized_card.addEventListener("click", getFun5(i, cardSize));
		}
		let selectedCardBackgrounds = document.getElementsByClassName("selectedCardBackground");
		for (let selectedCardBackground of selectedCardBackgrounds) {
			selectedCardBackground.style.width = cardSize + "rem";
			selectedCardBackground.style.height = cardSize + "rem";
		}
		let selectedCardWrappers = document.getElementsByClassName("selectedCardWrapper");
		for (let selectedCardWrapper of selectedCardWrappers) {
			selectedCardWrapper.style.right = `-${cardSize / 2}rem`;
		}
		let selectedCardMenus = document.getElementsByClassName("selectedCardMenu");
		for (let selectedCardMenu of selectedCardMenus) {
			selectedCardMenu.style.top = `${cardSize / 6}rem`;
			selectedCardMenu.style.right = `${cardSize / 24}rem`;
			selectedCardMenu.style.width = `${cardSize / 2}rem`;
			selectedCardMenu.style.height = `${(3 * cardSize) / 4}rem`;
		}
		let selectedCardValues = document.getElementsByClassName("selectedCardValue");
		for (let selectedCardValue of selectedCardValues) {
			selectedCardValue.style.fontSize = `${cardSize / 5}rem`;
		}
		displayEdition();
	};

	//Add filtering to cards
	var filterbox = document.createElement("div");
	filterbox.id = "filterbox";
	filterbox.style.top = "395px";
	filterbox.style.left = "2vw";
	filterbox.style.width = "100%";
	filterbox.style.padding = "0";
	filterbox.style.flexDirection = "row";

	var filtertext = document.createElement("div");
	filtertext.id = "filtertext";
	filtertext.innerHTML = "Filter:";

	var filterinput = document.createElement("input");
	filterinput.id = "filterinput";
	filterinput.type = "text";
	filterinput.onkeyup = function () {
		filterCards(document.getElementById("filterinput").value.toLowerCase());
	};

	filterbox.appendChild(filtertext);
	filterbox.appendChild(filterinput);
	players.appendChild(filterbox);

	// Allow players to filter by rarity
	var raritybox = document.createElement("div");
	raritybox.className = "multiselect";
	raritybox.id = "raritybox";
	raritybox.innerHTML = `
		<div class="selectBox" onclick="showCheckboxes()">
			<select>
	  			<option>Ranks</option>
			</select>
			<div class="overSelect"></div>
  		</div>
  		<div id="checkboxes">
			<label id="rarityLabel0" for="raritySelect0">
	  			<input type="checkbox" id="raritySelect0" class="rarityInput" checked />${rarityTexts[0]}</label>
			<label id="rarityLabel1" for="raritySelect1">
	  			<input type="checkbox" id="raritySelect1" class="rarityInput" checked />${rarityTexts[1]}</label>
			<label id="rarityLabel2" for="raritySelect2">
	  			<input type="checkbox" id="raritySelect2" class="rarityInput" checked />${rarityTexts[2]}</label>
			<label id="rarityLabel3" for="raritySelect3">
	  			<input type="checkbox" id="raritySelect3" class="rarityInput" checked />${rarityTexts[3]}</label>
			<label id="rarityLabel4" for="raritySelect4">
	  			<input type="checkbox" id="raritySelect4" class="rarityInput" checked />${rarityTexts[4]}</label>
  		</div>
	`;
	players.appendChild(raritybox);

	var editionbox = document.createElement("div");
	editionbox.className = "multiselect";
	editionbox.id = "editionbox";
	editionbox.innerHTML = `
		<div class="editionWrapper">
			<div class="selectBox" onclick="showCheckboxes2()" style="width: 12vw">
				<select>
					<option>Editions</option>
				</select>
				<div class="overSelect"></div>
			</div>
			<div style="width: 4vw;display: flex;justify-content: center; align-items: center">
				<input type="checkbox" id="editionDisplay" class="editionInput" style="filter: none" checked />
			</div>
		</div>
		
		<div id="checkboxes2" style="width: 12vw">
			<label id="editionLabel0" for="editionSelect0">
				<input type="checkbox" id="editionSelect0" class="editionInput" checked />Base Edition</label>
			<label id="editionLabel1" for="editionSelect1">
				<input type="checkbox" id="editionSelect1" class="editionInput" checked />First Edition</label>
		</div>
	`;
	players.appendChild(editionbox);

	//Show player information to the left of the board
	var player = document.createElement("div");
	player.className = "playercard";
	player.id = "player";
	player.style.cursor = "pointer";
	player.style.position = "fixed";
	player.style.left = "0";
	player.style.top = "200px";
	player.style.width = "18vw";
	player.style.marginLeft = "2vw";
	player.style.paddingRight = "25px";
	player.onclick = function () {
		renderPhase1();
	};

	var image = document.createElement("div");
	image.className = "image";

	var text = document.createElement("div");
	text.className = "text";

	var canvas = document.createElement("canvas");
	canvas.id = "flag";
	canvas.width = "85";
	canvas.height = "85";
	canvas.className = "flag";

	var edit = document.createElement("div");
	edit.id = "editIcon";
	edit.style.position = "absolute";
	edit.style.top = "30px";
	edit.style.right = "20px";

	var editImg = document.createElement("img");
	editImg.src = "./img/edit.png";
	editImg.style.width = "35px";
	editImg.style.height = "35px";

	edit.appendChild(editImg);

	var alias = document.createElement("div");
	alias.className = "alias";
	if (civ["alias"].length > 10) {
		alias.style.fontSize = 3.3 * Math.exp(-1 * (civ["alias"].length / 25)) + "vw";
		alias.style.lineHeight = 2.6 * Math.exp(-1 * (civ["alias"].length / 25)) + "vw";
	}
	alias.innerHTML = civ["alias"];
	player.style.height = "95px";

	image.appendChild(canvas);
	text.appendChild(alias);

	player.appendChild(image);
	player.appendChild(text);
	player.appendChild(edit);

	sliderbox.appendChild(slidertext);
	sliderbox.appendChild(sliderslider);

	players.appendChild(player);
	players.appendChild(sliderbox);

	var board = document.createElement("div");
	board.id = "board";

	var selected = document.createElement("div");
	selected.id = "selected";
	var unselected = document.createElement("div");
	unselected.id = "unselected";

	board.appendChild(selected);
	board.appendChild(unselected);

	//Outline hovered card and display help text
	function getFun3(text, cardId, size, colour, rarity, roundType) {
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
					if (unitStats[cardId].cost[i] != 0) {
						costsElement += `<img src="./img/staticons/${costIcons[i]}" class="staticon">
							<div class="stattext" style="margin-right:0.75vw">${unitStats[cardId].cost[i]}</div>
						`;
					}
				}
				costsElement += `</div>`;

				let detailsElement = `<div id="detailedstats" style="display:flex;margin-bottom:50px;">`;
				for (let i = 0; i < unitStats[cardId].attacks.elite.length; i++) {
					if (unitStats[cardId].attacks.elite[i][0] == 3 || unitStats[cardId].attacks.elite[i][0] == 4) {
						continue;
					}

					let eliteBonusAmount = unitStats[cardId].attacks.elite[i][1];
					let basicBonusAmount = 0;
					for (let j = 0; j < unitStats[cardId].attacks.basic.length; j++) {
						if (unitStats[cardId].attacks.basic[j][0] == unitStats[cardId].attacks.elite[i][0]) {
							basicBonusAmount = unitStats[cardId].attacks.basic[j][1];
						}
					}
					detailsElement += `<div>+ ${
						basicBonusAmount == eliteBonusAmount ? basicBonusAmount : basicBonusAmount + " (" + eliteBonusAmount + ")"
					} vs. ${classToName[unitStats[cardId].attacks.elite[i][0]]}</div>`;
				}
				if (unitStats[cardId].special) {
					detailsElement += `<div style="font-size:1.1vw"><u>Special Rule</u>: ${unitStats[cardId].special}</div>`;
				}
				detailsElement += `</div>`;

				let attackType = -1;
				let attackAmounts = [-1, -1];
				for (let i = 0; i < unitStats[cardId].attacks.basic.length; i++) {
					if (unitStats[cardId].attacks.basic[i][0] == 4) {
						attackType = 4;
						attackAmounts[0] = unitStats[cardId].attacks.basic[i][1];
					} else if (unitStats[cardId].attacks.basic[i][0] == 3) {
						attackType = 3;
						attackAmounts[0] = unitStats[cardId].attacks.basic[i][1];
					}
				}
				for (let i = 0; i < unitStats[cardId].attacks.elite.length; i++) {
					if (unitStats[cardId].attacks.elite[i][0] == attackType) {
						attackAmounts[1] = unitStats[cardId].attacks.elite[i][1];
					}
				}

				let rangeElement = `<div class="statwrapper">
					<img src="./img/staticons/range.png" class="staticon">
					<div class="stattext">${
						unitStats[cardId].range.length == 1 ? unitStats[cardId].range : unitStats[cardId].range[0] + " (" + unitStats[cardId].range[1] + ")"
					}</div>
				</div>`;

				helptext.innerHTML = `
					<div id="unitprofile">
						<div class="rarityText${rarity}" style="font-size:2vw">${rarityTexts[rarity]}</div>
						<img src="./img/unitgraphics/uu_${cardId}.jpg" class="unitgraphic">
						<div id="unitstatswrapper">
							<div>${card_descriptions[1][cardId][0]}</div>
							${costsElement}
							<div class="statwrapper">
								<img src="./img/staticons/hp.png" class="staticon">
								<div class="stattext">${unitStats[cardId].hp.length == 1 ? unitStats[cardId].hp : unitStats[cardId].hp[0] + " (" + unitStats[cardId].hp[1] + ")"}</div>
							</div>
							<div class="statwrapper">
								<img src="./img/staticons/${attackType == 3 ? "pierceAttack.png" : "damage.png"}" class="staticon">
								<div class="stattext">${attackAmounts[0] == attackAmounts[1] ? attackAmounts[0] : attackAmounts[0] + " (" + attackAmounts[1] + ")"}</div>
							</div>
							${unitStats[cardId].range[0] > 0 ? rangeElement : ""}
							<div class="statwrapper">
								<img src="./img/staticons/reloadTime.png" class="staticon">
								<div class="stattext">${
									unitStats[cardId].reload.length == 1
										? unitStats[cardId].reload + " seconds"
										: unitStats[cardId].reload[0] + " seconds (" + unitStats[cardId].reload[1] + ")"
								}</div>
							</div>
							<div class="statwrapper">
								<img src="./img/staticons/movementSpeed.png" class="staticon">
								<div class="stattext">${
									unitStats[cardId].speed.length == 1
										? unitStats[cardId].speed
										: unitStats[cardId].speed[0] + " (" + unitStats[cardId].speed[1] + ")"
								}</div>
							</div>
							<div class="statwrapper">
								<img src="./img/staticons/armor.png" class="staticon">
								<div class="stattext" style="margin-right:0.75vw">${
									unitStats[cardId].armors.basic[0] == unitStats[cardId].armors.elite[0]
										? unitStats[cardId].armors.basic[0]
										: unitStats[cardId].armors.basic[0] + " (" + unitStats[cardId].armors.elite[0] + ")"
								}</div>
								<img src="./img/staticons/range-armor.png" class="staticon">
								<div class="stattext">${
									unitStats[cardId].armors.basic[1] == unitStats[cardId].armors.elite[1]
										? unitStats[cardId].armors.basic[1]
										: unitStats[cardId].armors.basic[1] + " (" + unitStats[cardId].armors.elite[1] + ")"
								}</div>
							</div>
							${detailsElement}
						</div>
					</div>
				`;
				document.getElementById("detailedstats").style.display = "flex";
				document.getElementById("helpboximage").src = "./img/helpbackgroundextended.png";
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
			if (!includesCard(cardId)) {
				document.getElementById("cardimage" + cardId).style.filter = "";
				document.getElementById("cardborder" + cardId).style.filter = "";
			}
			var help = document.getElementById("helpboxcontainer");
			help.style.visibility = "hidden";
			var finish_button = document.getElementById("finish");
			finish_button.style.visibility = "visible";
			var share_button = document.getElementById("clear");
			share_button.style.visibility = "visible";
			var home_button = document.getElementById("homeBtn");
			home_button.style.visibility = "visible";
		};
	}

	//Select card
	function getFun5(cardId, size) {
		return function () {
			activated_card = document.getElementById("card" + cardId);
			if (includesCard(cardId)) {
				let index;
				for (let j = 0; j < civ["bonuses"][roundType].length; j++) {
					if (civ["bonuses"][roundType][j].length != 2) {
						if (civ["bonuses"][roundType][j] == cardId) {
							index = j;
						}
					} else {
						if (civ["bonuses"][roundType][j][0] == cardId) {
							index = j;
						}
					}
				}
				civ["bonuses"][roundType].splice(index, 1);
				activated_card.style.outline = "none";
				activated_card.style.marginRight = marginSize + "rem";
				if (document.getElementById("selectedCardWrapper" + cardId)) {
					document.getElementById("selectedCardWrapper" + cardId).remove();
				}
				selected.removeChild(activated_card);
				unselected.insertBefore(activated_card, unselected.children[0]);
			} else {
				if (civ["bonuses"][roundType].length >= max_sizes[roundType]) {
					let cleared_card;
					if (civ["bonuses"][roundType][0].length != 2) {
						cleared_card = document.getElementById("card" + civ["bonuses"][roundType][0]);
						console.log("card" + civ["bonuses"][roundType][0]);
						if (document.getElementById("selectedCardWrapper" + civ["bonuses"][roundType][0])) {
							document.getElementById("selectedCardWrapper" + civ["bonuses"][roundType][0]).remove();
						}
					} else {
						cleared_card = document.getElementById("card" + civ["bonuses"][roundType][0][0]);
						console.log("card" + civ["bonuses"][roundType][0][0]);
						if (document.getElementById("selectedCardWrapper" + civ["bonuses"][roundType][0][0])) {
							document.getElementById("selectedCardWrapper" + civ["bonuses"][roundType][0][0]).remove();
						}
					}
					cleared_card.style.outline = "none";
					cleared_card.style.marginRight = marginSize + "rem";
					civ["bonuses"][roundType].shift();
					selected.removeChild(cleared_card);
					unselected.insertBefore(cleared_card, unselected.children[0]);
				}

				if (roundType != 1) {
					let selected_card_wrapper = document.createElement("div");
					selected_card_wrapper.className = "selectedCardWrapper";
					selected_card_wrapper.id = "selectedCardWrapper" + cardId;
					selected_card_wrapper.style.right = `-${cardSize / 2}rem`;
					selected_card_wrapper.addEventListener("click", (e) => {
						e.stopPropagation();
					});

					let selected_card_background = document.createElement("img");
					selected_card_background.className = "selectedCardBackground";
					selected_card_background.src = "./img/compressedcards/card_background.jpg";
					selected_card_background.style.width = cardSize + "rem";
					selected_card_background.style.height = cardSize + "rem";

					let selected_card_menu = document.createElement("div");
					selected_card_menu.className = "selectedCardMenu";
					selected_card_menu.style.top = `${cardSize / 6}rem`;
					selected_card_menu.style.right = `${cardSize / 24}rem`;
					selected_card_menu.style.width = `${cardSize / 2}rem`;
					selected_card_menu.style.height = `${(3 * cardSize) / 4}rem`;

					let selected_card_plus = document.createElement("img");
					selected_card_plus.className = "selectedCardPlus";
					selected_card_plus.src = "./img/plus.png";
					selected_card_plus.addEventListener("click", (e) => {
						for (let i = 0; i < civ["bonuses"][roundType].length; i++) {
							if (civ["bonuses"][roundType][i][0] == cardId && civ["bonuses"][roundType][i][1] < 50) {
								civ["bonuses"][roundType][i][1]++;
								document.getElementById("selectedCard" + cardId).textContent = `x${civ["bonuses"][roundType][i][1]}`;
							}
						}
						e.stopPropagation();
					});

					let selected_card_minus = document.createElement("img");
					selected_card_minus.className = "selectedCardMinus";
					selected_card_minus.src = "./img/minus.png";
					selected_card_minus.addEventListener("click", (e) => {
						for (let i = 0; i < civ["bonuses"][roundType].length; i++) {
							if (civ["bonuses"][roundType][i][0] == cardId && civ["bonuses"][roundType][i][1] > 1) {
								civ["bonuses"][roundType][i][1]--;
								document.getElementById("selectedCard" + cardId).textContent = `x${civ["bonuses"][roundType][i][1]}`;
							}
						}
						e.stopPropagation();
					});

					let selected_card_value = document.createElement("div");
					selected_card_value.className = "selectedCardValue";
					selected_card_value.id = "selectedCard" + cardId;
					selected_card_value.textContent = "x1";
					selected_card_value.style.fontSize = `${cardSize / 5}rem`;

					selected_card_menu.appendChild(selected_card_plus);
					selected_card_menu.appendChild(selected_card_minus);
					selected_card_menu.appendChild(selected_card_value);

					selected_card_wrapper.appendChild(selected_card_background);
					selected_card_wrapper.appendChild(selected_card_menu);

					activated_card.appendChild(selected_card_wrapper);
				}

				activated_card.style.marginRight = cardSize * 0.6 + "rem";
				if (roundType != 1) {
					civ["bonuses"][roundType].push([cardId, 1]);
				} else {
					civ["bonuses"][roundType].push(cardId);
				}
				unselected.removeChild(activated_card);
				selected.appendChild(activated_card);
			}
		};
	}

	function getFun6(cardId) {
		return function (event) {
			event.preventDefault();
			if (document.getElementById("detailedstats")) {
				if (document.getElementById("detailedstats").style.display == "flex") {
					document.getElementById("detailedstats").style.display = "none";
					document.getElementById("helpboximage").src = "./img/helpbackground.png";
					document.getElementById("helpboxcontainer").style.height = "20vw";
				} else {
					document.getElementById("detailedstats").style.display = "flex";
					document.getElementById("helpboximage").src = "./img/helpbackgroundextended.png";
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

	//Add all cards stored in gamestate to the board
	for (var i = 0; i < num_cards[roundType]; i++) {
		var card = document.createElement("div");
		card.className = "card";
		card.id = "card" + i;
		card.style.width = cardSize + "rem";
		card.style.height = cardSize + "rem";
		card.style.margin = marginSize + "rem";

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
		var path = `${prefix}_${i}.jpg`;

		var image = document.createElement("img");
		image.className = `cardimage ${rarities[card_descriptions[roundType][i][1]]}`;
		image.id = "cardimage" + i;
		image.src = "./img/compressedcards/" + path;
		card.appendChild(image);

		var border = document.createElement("img");
		border.id = "cardborder" + i;
		border.className = `cardborder ${rarities[card_descriptions[roundType][i][1]]}`;
		border.src = "./img/cards/card_border.png";
		card.appendChild(border);

		var frame = document.createElement("img");
		frame.className = "cardframe";
		frame.src = `./img/frames/frame_${rarities[card_descriptions[roundType][i][1]]}.png`;
		card.appendChild(frame);

		var edition = document.createElement("img");
		edition.className = "cardedition";
		edition.src = `./img/editions/edition_${card_descriptions[roundType][i][2]}.png`;
		card.appendChild(edition);

		//Let player pick a card
		card.style.cursor = "pointer";
		if (includesCard(i)) {
			if (roundType != 1) {
				let dummyIndex = i;

				let selected_card_wrapper = document.createElement("div");
				selected_card_wrapper.className = "selectedCardWrapper";
				selected_card_wrapper.id = "selectedCardWrapper" + i;
				selected_card_wrapper.style.right = `-${cardSize / 2}rem`;
				selected_card_wrapper.addEventListener("click", (e) => {
					e.stopPropagation();
				});

				let selected_card_background = document.createElement("img");
				selected_card_background.className = "selectedCardBackground";
				selected_card_background.src = "./img/compressedcards/card_background.jpg";
				selected_card_background.style.width = cardSize + "rem";
				selected_card_background.style.height = cardSize + "rem";

				let selected_card_menu = document.createElement("div");
				selected_card_menu.className = "selectedCardMenu";

				let selected_card_plus = document.createElement("img");
				selected_card_plus.className = "selectedCardPlus";
				selected_card_plus.src = "./img/plus.png";
				selected_card_plus.addEventListener("click", (e) => {
					for (let j = 0; j < civ["bonuses"][roundType].length; j++) {
						if (civ["bonuses"][roundType][j][0] == dummyIndex && civ["bonuses"][roundType][j][1] < 16) {
							civ["bonuses"][roundType][j][1]++;
							document.getElementById("selectedCard" + dummyIndex).textContent = `x${civ["bonuses"][roundType][j][1]}`;
						}
					}
					e.stopPropagation();
				});

				let selected_card_minus = document.createElement("img");
				selected_card_minus.className = "selectedCardMinus";
				selected_card_minus.src = "./img/minus.png";
				selected_card_minus.addEventListener("click", (e) => {
					for (let j = 0; j < civ["bonuses"][roundType].length; j++) {
						if (civ["bonuses"][roundType][j][0] == dummyIndex && civ["bonuses"][roundType][j][1] > 1) {
							civ["bonuses"][roundType][j][1]--;
							document.getElementById("selectedCard" + dummyIndex).textContent = `x${civ["bonuses"][roundType][j][1]}`;
						}
					}
					e.stopPropagation();
				});

				let selected_card_value = document.createElement("div");
				selected_card_value.id = "selectedCard" + dummyIndex;
				for (let j = 0; j < civ["bonuses"][roundType].length; j++) {
					if (civ["bonuses"][roundType][j][0] == dummyIndex) {
						selected_card_value.textContent = `x${civ["bonuses"][roundType][j][1]}`;
					}
				}

				selected_card_menu.appendChild(selected_card_plus);
				selected_card_menu.appendChild(selected_card_minus);
				selected_card_menu.appendChild(selected_card_value);

				selected_card_wrapper.appendChild(selected_card_background);
				selected_card_wrapper.appendChild(selected_card_menu);

				card.appendChild(selected_card_wrapper);
				card.style.marginRight = cardSize * 0.6 + "rem";
			}
		}
		card.onmouseover = getFun3(card_descriptions[roundType][i][0], i, cardSize, [0, 255, 0, 0.7], card_descriptions[roundType][i][1], roundType);
		card.onmouseout = getFun4(i);
		card.addEventListener("click", getFun5(i, cardSize));
		card.addEventListener("contextmenu", getFun6(i), false);
		if (includesCard(i)) {
			selected.appendChild(card);
		} else {
			unselected.appendChild(card);
		}
	}
	//Add finish button
	var boardtoolbar = document.createElement("div");
	boardtoolbar.id = "boardtoolbar";
	boardtoolbar.style.top = "450px";
	boardtoolbar.style.left = "6.5vw";
	boardtoolbar.style.width = "13.5vw";
	boardtoolbar.style.padding = "0";
	boardtoolbar.style.flexDirection = "column";
	boardtoolbar.style.alignItems = "flex-start";

	var finish = document.createElement("div");
	finish.id = "finish";
	finish.innerHTML = "Download";
	finish.style.margin = "0";
	finish.onclick = function () {
		downloadTextFile(JSON.stringify(civ), civ["alias"] + ".json");
	};

	var share = document.createElement("div");
	share.id = "clear";
	share.innerHTML = "Share";
	share.style.margin = "0";
	share.onclick = function () {
		console.log(encryptJson(civ));
		var sharebox = document.createElement("div");
		sharebox.id = "sharebox";
		var view_text = document.createElement("div");
		view_text.innerHTML = "View";
		view_text.setAttribute("class", "sharetext");
		var linkwrapper1 = document.createElement("div");
		linkwrapper1.setAttribute("class", "sharelink");
		var view_link = document.createElement("div");
		view_link.innerHTML = `${hostname}${route}/view?civ=${encryptJson(civ)}`;
		view_link.setAttribute("class", "linktext");
		view_link.setAttribute("id", "view_link");
		var copy_view = document.createElement("div");
		copy_view.innerHTML = "Copy";
		copy_view.setAttribute("id", "copy_view");
		copy_view.style.cursor = "pointer";
		copy_view.onclick = function () {
			const copyText = document.createElement("textarea");
			copyText.value = document.getElementById("view_link").innerHTML;
			document.body.appendChild(copyText);
			copyText.select();
			document.execCommand("copy");
			document.body.removeChild(copyText);
			document.getElementById("copy_view").innerHTML = "Copied!";
			document.getElementById("copy_edit").innerHTML = "Copy";
		};
		var edit_text = document.createElement("div");
		edit_text.innerHTML = "Edit";
		edit_text.setAttribute("class", "sharetext");
		var linkwrapper2 = document.createElement("div");
		linkwrapper2.setAttribute("class", "sharelink");
		var edit_link = document.createElement("div");
		edit_link.innerHTML = `${hostname}${route}/edit?civ=${encryptJson(civ)}`;
		edit_link.setAttribute("class", "linktext");
		edit_link.setAttribute("id", "edit_link");
		var copy_edit = document.createElement("div");
		copy_edit.innerHTML = "Copy";
		copy_edit.setAttribute("id", "copy_edit");
		copy_edit.style.cursor = "pointer";
		copy_edit.onclick = function () {
			const copyText = document.createElement("textarea");
			copyText.value = document.getElementById("edit_link").innerHTML;
			document.body.appendChild(copyText);
			copyText.select();
			document.execCommand("copy");
			document.body.removeChild(copyText);
			document.getElementById("copy_edit").innerHTML = "Copied!";
			document.getElementById("copy_view").innerHTML = "Copy";
		};
		var done_sharing = document.createElement("div");
		done_sharing.innerHTML = "Done";
		done_sharing.id = "done_sharing";
		done_sharing.onclick = function () {
			document.getElementById("sharebox").remove();
		};
		linkwrapper1.appendChild(view_link);
		linkwrapper1.appendChild(copy_view);
		linkwrapper2.appendChild(edit_link);
		linkwrapper2.appendChild(copy_edit);

		let isValid = true;
		let reason = "";

		if (techtree_points > 275) {
			isValid = false;
			reason = `Maximum 275 techtree points, but this civ has spent ${techtree_points} points`;
		}
		if (civ["bonuses"][0].length > 6) {
			isValid = false;
			reason = `Maximum 6 civilization bonuses, but this civ has ${civ["bonuses"][0].length} bonuses`;
		}
		if (civ["bonuses"][4].length > 1) {
			isValid = false;
			reason = `Maximum 1 team bonus, but this civ has ${civ["bonuses"][4].length} bonuses`;
		}
		let superiorCount = 0;
		for (let i = 0; i < civ["bonuses"].length; i++) {
			for (let j = 0; j < civ["bonuses"][i].length; j++) {
				if (i == 1) {
					if (civ["bonuses"][i][j] > 38 && civ["bonuses"][i][j] < 78 && civ["bonuses"][i][j] != 45) {
						isValid = false;
						reason = `This civ has a custom unique unit, but only unique units that are in the base game are allowed`;
					}
				} else {
					if (civ["bonuses"][i][j][1] > 1) {
						isValid = false;
						reason = `This civ has stacked bonuses which is not allowed`;
					}
					if (card_descriptions[i][civ["bonuses"][i][j][0]][1] > 2) {
						isValid = false;
						reason = `This civ has an epic or legendary bonus which is not allowed`;
					}
					if (card_descriptions[i][civ["bonuses"][i][j][0]][1] == 2) {
						superiorCount++;
					}
					if (i == 3 && civ["bonuses"][i][j][0] == 9) {
						isValid = false;
						reason = `This civ has Elite Mercenaries which is banned`;
					}
					if (i == 0 && civ["bonuses"][i][j][0] == 102) {
						isValid = false;
						reason = `This civ has the Lithuanian relic bonus which is banned`;
					}
					if (i == 0 && civ["bonuses"][i][j][0] == 313) {
						isValid = false;
						reason = `This civ has the free relic bonus which is banned`;
					}
				}
			}
		}
		if (superiorCount > 1) {
			isValid = false;
			reason = `This civ has ${superiorCount} non-UU superior bonuses, but only 1 is allowed`;
		}

		var validityWrapper = document.createElement("div");
		validityWrapper.style.display = "flex";
		validityWrapper.style.flexDirection = "column";
		validityWrapper.style.justifyContent = "center";
		validityWrapper.style.alignItems = "center";
		validityWrapper.style.width = "80%";
		validityWrapper.style.marginLeft = "10%";
		validityWrapper.style.textAlign = "center";
		validityWrapper.innerHTML = `
			<div>Is a FFA 2 valid civ: ${isValid ? "YES" : "NO"}</div>
			${isValid ? "" : "<div>" + reason + "</div>"}
		`;

		sharebox.appendChild(view_text);
		sharebox.appendChild(linkwrapper1);
		sharebox.appendChild(edit_text);
		sharebox.appendChild(linkwrapper2);
		sharebox.appendChild(validityWrapper);
		sharebox.appendChild(done_sharing);
		document.body.appendChild(sharebox);
	};

	var home = document.createElement("div");
	home.id = "homeBtn";
	home.innerHTML = "Home";
	home.style.margin = "0";
	home.onclick = function () {
		if (confirm("Return home? Changes will not be saved.")) {
			window.location.href = `${hostname}${route}`;
		}
	};

	boardtoolbar.appendChild(finish);
	boardtoolbar.appendChild(share);
	boardtoolbar.appendChild(home);
	players.appendChild(boardtoolbar);

	//Add card description box
	var helpboxcontainer = document.createElement("div");
	helpboxcontainer.id = "helpboxcontainer";
	helpboxcontainer.style.visibility = "hidden";

	var helpbox = document.createElement("div");
	helpbox.id = "helpbox";

	var helpboximage = document.createElement("img");
	helpboximage.id = "helpboximage";
	helpboximage.src = "./img/helpbackground.png";

	var helpboxtext = document.createElement("div");
	helpboxtext.id = "helpboxtext";

	helpbox.appendChild(helpboximage);
	helpbox.appendChild(helpboxtext);
	helpboxcontainer.appendChild(helpbox);
	document.getElementsByTagName("body")[0].appendChild(helpboxcontainer);

	game.appendChild(players);
	game.appendChild(board);

	game.style.position = "relative";

	sideheader.style.position = "absolute";
	player.style.position = "absolute";
	sliderbox.style.position = "absolute";
	filterbox.style.position = "absolute";
	raritybox.style.position = "absolute";
	editionbox.style.position = "absolute";
	boardtoolbar.style.position = "absolute";

	document.getElementsByTagName("body")[0].appendChild(game);
	document.getElementsByTagName("body")[0].appendChild(sideheader);

	document.getElementsByTagName("body")[0].style.overflowX = "hidden";

	for (let i = 0; i < 5; i++) {
		if (document.getElementById(`raritySelect${i}`)) {
			document.getElementById(`raritySelect${i}`).checked = filterRarities[i];
			filterCards(document.getElementById("filterinput").value.toLowerCase());
			document.getElementById(`raritySelect${i}`).addEventListener("change", () => {
				filterRarities[i] = document.getElementById(`raritySelect${i}`).checked;
				filterCards(document.getElementById("filterinput").value.toLowerCase());
			});
		}
	}

	for (let i = 0; i < 2; i++) {
		if (document.getElementById(`editionSelect${i}`)) {
			document.getElementById(`editionSelect${i}`).checked = filterEditions[i];
			filterCards(document.getElementById("filterinput").value.toLowerCase());
			document.getElementById(`editionSelect${i}`).addEventListener("change", () => {
				filterEditions[i] = document.getElementById(`editionSelect${i}`).checked;
				filterCards(document.getElementById("filterinput").value.toLowerCase());
			});
		}
	}

	if (document.getElementById("editionDisplay")) {
		document.getElementById("editionDisplay").checked = editionDisplay;
		displayEdition();
		document.getElementById("editionDisplay").addEventListener("change", () => {
			editionDisplay = document.getElementById("editionDisplay").checked;
			displayEdition();
		});
	}

	resize();

	//Render flag
	if (civ["customFlag"]) {
		var c = document.getElementById("flag");
		var ctx = c.getContext("2d");
		if (clientCustomFlag) {
			ctx.drawImage(clientCustomFlag, 0, 0, canvas.width, canvas.height);
		} else {
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
	} else {
		clientFlag(civ["flag_palette"], "flag", 85 / 256);
	}
}

window.addEventListener("resize", resize);
