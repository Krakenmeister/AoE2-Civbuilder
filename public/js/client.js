/*This code is really really really bad. But it was literally my first website page so I'm keeping it out of charm (definitely not laziness!)*/

let donateRoll = Math.floor(4 * Math.random());
if (donateRoll == 0) {
	playAd("donateAd", 5000);
}
playAd("eventAd", 2000);

async function playAd(adId, duration) {
	if (!document.getElementById(adId)) return;

	await sleep(500);
	document.getElementById(adId).style.visibility = "visible";
	await sleep(duration);
	document.getElementById(adId).style.visibility = "";
}

var dataSeed = -1;

function copyToClipboard(textid, buttonid) {
	const buttons = ["button1", "button2", "button3"];
	var copyText = document.getElementById(textid);
	copyText.select();
	copyText.setSelectionRange(0, 99999);
	document.execCommand("copy");
	copyText.selectionEnd = copyText.selectionStart;
	copyText.blur();
	for (var i = 0; i < buttons.length; i++) {
		var button = document.getElementById(buttons[i]);
		if (buttonid == buttons[i]) {
			button.textContent = "Copied!";
		} else {
			button.textContent = "Copy";
		}
	}
}

function generateRandom() {
	document.getElementById("startBuild").remove();
	document.getElementById("startDraft").remove();
	document.querySelector("#spacer").remove();
	document.querySelector("#spacer").remove();

	var randomForm = document.createElement("div");
	randomForm.id = "buildForm";

	let input1 = document.createElement("input");
	input1.type = "checkbox";
	input1.name = "randomCivs";
	input1.id = "randomCivs";
	input1.checked = true;
	let label1 = document.createElement("label");
	label1.setAttribute("for", "randomCivs");
	label1.innerHTML = "Random Civilizations: ";

	let input2 = document.createElement("input");
	input2.type = "checkbox";
	input2.name = "randomCosts";
	input2.id = "randomCosts";
	input2.checked = true;
	let label2 = document.createElement("label");
	label2.setAttribute("for", "randomCosts");
	label2.innerHTML = "Random Costs: ";

	var randomSubmit = document.createElement("button");
	randomSubmit.id = "randomSubmit";
	randomSubmit.innerHTML = "Generate Mod";
	randomSubmit.onclick = function () {
		dataSeed = getSeed();
		post(`${route}/random`, { seed: dataSeed, civs: document.getElementById("randomCivs").checked, costs: document.getElementById("randomCosts").checked });
	};

	let div1 = document.createElement("div");
	div1.className = "input_field";
	let div2 = document.createElement("div");
	div2.className = "input_field";

	div1.appendChild(label1);
	div1.appendChild(input1);
	div2.appendChild(label2);
	div2.appendChild(input2);

	randomForm.appendChild(div1);
	randomForm.appendChild(div2);
	randomForm.appendChild(randomSubmit);

	document.getElementsByTagName("body")[0].appendChild(randomForm);
}

function startaDraft() {
	document.getElementById("combineButton").remove();
	document.getElementById("startBuild").remove();
	document.getElementById("startDraft").remove();
	document.querySelector("#spacer").remove();
	document.querySelector("#spacer").remove();

	let draftForm = document.createElement("div");
	draftForm.className = "draft_form";
	draftForm.id = "draftForm";
	//	draftForm.method = "post";
	//	draftForm.action = `${route}/draft`;

	let input1 = document.createElement("input");
	input1.id = "numPlayersInput";
	input1.type = "number";
	input1.name = "num_players";
	input1.value = 2;
	input1.min = 2;
	input1.max = 8;
	let label1 = document.createElement("label");
	label1.setAttribute("for", "num_players");
	label1.innerHTML = "Number of Players: ";

	/*	const values = ['slow', 'normal', 'fast']
	let input2 = document.createElement('select')
	input2.name = 'draft_speed'
	input2.id = 'draft_speed'
	for (const val of values) {
		let option = document.createElement('option')
		option.value = val
		option.text = val.charAt(0).toUpperCase() + val.slice(1)
		input2.appendChild(option)
	}
	input2.value = values[1]
	let label2 = document.createElement('label')
	label2.setAttribute('for', 'draft_speed')
	label2.innerHTML = 'Draft Speed: '*/

	let input2 = document.createElement("input");
	input2.id = "roundsInput";
	input2.type = "number";
	input2.name = "rounds";
	input2.value = 4;
	input2.min = 2;
	input2.max = 6;
	let label2 = document.createElement("label");
	label2.setAttribute("for", "rounds");
	label2.innerHTML = "Bonuses per Player: ";

	let input4 = document.createElement("input");
	input4.id = "currencyInput";
	input4.type = "number";
	input4.name = "techtree_currency";
	input4.value = 200;
	input4.min = 25;
	input4.max = 500;
	let label4 = document.createElement("label");
	label4.setAttribute("for", "techtree_currency");
	label4.innerHTML = "Starting Tech Tree Points: ";

	let input6 = document.createElement("div");
	input6.className = "multiselect";
	input6.id = "raritybox";
	input6.innerHTML = `
		<div class="selectBox" onclick="showCheckboxes()">
			<select>
	  			<option>Ranks</option>
			</select>
			<div class="overSelect"></div>
  		</div>
  		<div id="checkboxes">
			<label id="rarityLabel0" for="raritySelect0">
	  			<input type="checkbox" id="raritySelect0" class="rarityInput" checked form="draftForm" />${rarityTexts[0]}</label>
			<label id="rarityLabel1" for="raritySelect1">
	  			<input type="checkbox" id="raritySelect1" class="rarityInput" checked form="draftForm" />${rarityTexts[1]}</label>
			<label id="rarityLabel2" for="raritySelect2">
	  			<input type="checkbox" id="raritySelect2" class="rarityInput" checked form="draftForm" />${rarityTexts[2]}</label>
			<label id="rarityLabel3" for="raritySelect3">
	  			<input type="checkbox" id="raritySelect3" class="rarityInput" checked form="draftForm" />${rarityTexts[3]}</label>
			<label id="rarityLabel4" for="raritySelect4">
	  			<input type="checkbox" id="raritySelect4" class="rarityInput" checked form="draftForm" />${rarityTexts[4]}</label>
  		</div>
	`;
	let label6 = document.createElement("label");
	label6.setAttribute("for", "raritybox");
	label6.innerHTML = "Allowed ranks: ";
	label6.style.marginTop = 0;
	label6.style.marginRight = "20px";

	let input5 = document.createElement("input");
	input5.type = "submit";
	input5.value = "Start Draft";
	input5.addEventListener("click", () => {
		post(`${route}/draft`, {
			num_players: document.getElementById("numPlayersInput").value,
			rounds: document.getElementById("roundsInput").value,
			techtree_currency: document.getElementById("currencyInput").value,
			allowed_rarities: [
				document.getElementById("raritySelect0").checked,
				document.getElementById("raritySelect1").checked,
				document.getElementById("raritySelect2").checked,
				document.getElementById("raritySelect3").checked,
				document.getElementById("raritySelect4").checked,
			],
		});
	});

	let div1 = document.createElement("div");
	let div2 = document.createElement("div");
	let div4 = document.createElement("div");
	let div5 = document.createElement("div");
	div1.className = "input_field";
	div2.className = "input_field";
	div4.className = "input_field";
	div5.className = "input_field";
	div5.style.display = "flex";
	div1.appendChild(label1);
	div1.appendChild(input1);
	div2.appendChild(label2);
	div2.appendChild(input2);
	div4.appendChild(label4);
	div4.appendChild(input4);
	div5.appendChild(label6);
	div5.appendChild(input6);
	draftForm.appendChild(div1);
	draftForm.appendChild(div2);
	draftForm.appendChild(div4);
	draftForm.appendChild(div5);
	draftForm.appendChild(input5);

	document.getElementsByTagName("body")[0].appendChild(draftForm);
}

function startaBuild() {
	document.getElementById("startBuild").remove();
	document.getElementById("startDraft").remove();
	document.getElementById("combineButton").remove();
	document.querySelector("#spacer").remove();
	document.querySelector("#spacer").remove();

	var buildForm = document.createElement("div");
	buildForm.id = "buildForm";

	var viewButton = document.createElement("button");
	viewButton.id = "viewButton";
	viewButton.innerHTML = "View Civilization";
	viewButton.onclick = function () {
		if (document.getElementById("viewButton")) {
			document.getElementById("viewButton").remove();
		}
		if (document.getElementById("editButton")) {
			document.getElementById("editButton").remove();
		}
		if (document.getElementById("buildButton")) {
			document.getElementById("buildButton").remove();
		}

		var viewFile = document.createElement("input");
		viewFile.id = "viewCiv";
		viewFile.className = "upload";
		viewFile.name = "upload";
		viewFile.type = "file";

		var inputLabel = document.createElement("label");
		inputLabel.innerHTML = "Choose .json file";
		inputLabel.className = "upload";

		inputLabel.appendChild(viewFile);
		document.getElementById("buildForm").appendChild(inputLabel);
		(function () {
			function onChange(event) {
				var reader = new FileReader();
				reader.onload = onReaderLoad;
				reader.readAsText(event.target.files[0]);
			}

			$("#viewCiv").on("click touchstart", function () {
				$(this).val("");
			});

			function onReaderLoad(event) {
				var civ = JSON.parse(event.target.result);
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
						if (civ["bonuses"][4].length > 1) {
							description += "• ";
						}
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

				showTechtree(civ["tree"], -1, 2, 0, description);
			}

			document.getElementById("viewCiv").addEventListener("change", onChange);
		})();
	};

	var editButton = document.createElement("button");
	editButton.id = "editButton";
	editButton.innerHTML = "Edit Civilization";
	editButton.onclick = function () {
		if (document.getElementById("viewButton")) {
			document.getElementById("viewButton").remove();
		}
		if (document.getElementById("editButton")) {
			document.getElementById("editButton").remove();
		}
		if (document.getElementById("buildButton")) {
			document.getElementById("buildButton").remove();
		}

		var editFile = document.createElement("input");
		editFile.id = "editCiv";
		editFile.className = "upload";
		editFile.name = "upload";
		editFile.type = "file";

		var inputLabel = document.createElement("label");
		inputLabel.innerHTML = "Choose .json file";
		inputLabel.className = "upload";

		inputLabel.appendChild(editFile);
		document.getElementById("buildForm").appendChild(inputLabel);
		(function () {
			function onChange(event) {
				var reader = new FileReader();
				reader.onload = onReaderLoad;
				reader.readAsText(event.target.files[0]);
			}

			$("#editCiv").on("click touchstart", function () {
				$(this).val("");
			});

			async function onReaderLoad(event) {
				var civ = JSON.parse(event.target.result);
				if (civ["customFlag"] && civ["customFlagData"]) {
					let res = await axios.post(`${hostname}${route}/edit`, { civ: civ });
					let html = res.data;
					let newhtml = "";
					for (let i = 0; i < html.length; i++) {
						newhtml += html[i];
						if (i >= 5) {
							if (html[i - 5] == "<" && html[i - 4] == "b" && html[i - 3] == "o" && html[i - 2] == "d" && html[i - 1] == "y" && html[i] == ">") {
								newhtml += `
                  <p id="civ">${JSON.stringify(civ)}</p>
                `;
							}
						}
					}
					history.pushState("Edit Civ", "Edit Civ", "edit");
					document.open("text/html");
					document.write(newhtml);
					document.close();
				} else {
					location.href = `${hostname}${route}/edit?civ=${encryptJson(civ)}`;
				}
			}

			document.getElementById("editCiv").addEventListener("change", onChange);
		})();
	};

	var buildButton = document.createElement("button");
	buildButton.id = "buildButton";
	buildButton.innerHTML = "New Civilization";
	buildButton.onclick = function () {
		location.href = `${hostname}${route}/build`;
	};

	buildForm.appendChild(buildButton);
	buildForm.appendChild(viewButton);
	buildForm.appendChild(editButton);

	// document.getElementById("page").appendChild(buildForm);
	document.getElementsByTagName("body")[0].appendChild(buildForm);

	buildForm.style.transform = `scale(${(0.5 * window.innerHeight) / buildForm.getBoundingClientRect().height})`;
}

function combineCivilizations() {
	if (document.getElementById("combineButton")) {
		document.getElementById("combineButton").remove();
	}
	if (document.getElementById("startBuild")) {
		document.getElementById("startBuild").remove();
	}
	if (document.getElementById("startDraft")) {
		document.getElementById("startDraft").remove();
	}
	if (document.querySelector("#spacer")) {
		document.querySelector("#spacer").remove();
	}
	if (document.querySelector("#spacer")) {
		document.querySelector("#spacer").remove();
	}
	if (document.getElementById("instructionsbox")) {
		document.getElementById("instructionsbox").remove();
	}
	if (document.getElementById("buildForm")) {
		document.getElementById("buildForm").remove();
	}
	if (document.getElementById("viewButton")) {
		document.getElementById("viewButton").remove();
	}
	if (document.getElementById("editButton")) {
		document.getElementById("editButton").remove();
	}
	if (document.getElementById("buildButton")) {
		document.getElementById("buildButton").remove();
	}

	var viewFile = document.createElement("input");
	viewFile.id = "viewCiv";
	viewFile.className = "upload";
	viewFile.name = "upload";
	viewFile.type = "file";
	viewFile.setAttribute("multiple", "");

	var inputLabel = document.createElement("label");
	inputLabel.innerHTML = "Create Mod";
	inputLabel.className = "upload tooltip";
	inputLabel.id = "createModButton";

	var vanillaDownload = document.createElement("button");
	vanillaDownload.id = "vanillaDownload";
	vanillaDownload.innerHTML = "Get Vanilla Civs";
	vanillaDownload.className = "tooltip";
	vanillaDownload.onclick = function () {
		post(`${route}/vanilla`, {});
	};

	var createHelp = document.createElement("span");
	createHelp.className = "tooltiptext";
	createHelp.id = "createHelp";
	createHelp.textContent =
		"Select civilization .json files to combine into a mod.zip file. Note that all other civilizations' bonuses will be overwritten in this mod";

	var vanillaHelp = document.createElement("span");
	vanillaHelp.className = "tooltiptext";
	vanillaHelp.id = "vanillaHelp";
	vanillaHelp.textContent = "To include vanilla civilizations in your mods, click to download the .json files for all the civilizations in the base game";

	let modifierHelp = document.createElement("span");
	modifierHelp.className = "tooltiptext";
	modifierHelp.id = "modifierHelp";
	modifierHelp.textContent = "Additional settings to apply to the generated mod";

	let modifierWrapper = document.createElement("div");
	modifierWrapper.id = "modifierWrapper";

	let modifierTitle = document.createElement("div");
	modifierTitle.id = "modifierTitle";
	modifierTitle.textContent = "Modifiers:";
	modifierTitle.className = "tooltip";

	let baseModifier = document.createElement("div");
	baseModifier.className = "modifierWrapper";

	let baseLabel = document.createElement("div");
	baseLabel.id = "baseLabel";
	baseLabel.textContent = "Civilizations:";
	baseLabel.className = "tooltip modifierLabel";

	let baseHelp = document.createElement("div");
	baseHelp.id = "baseHelp";
	baseHelp.className = "tooltiptextright";
	baseHelp.textContent =
		"Which set of civilizations to generate the mod with. Set to custom to use civilizations made using this website, random for randomly generated civilizations, or completely vanilla for usage of modifiers";

	baseLabel.appendChild(baseHelp);

	let baseInput = document.createElement("select");
	baseInput.id = "baseInput";
	baseInput.innerHTML = `
		<option value="custom">Custom</option>
		<option value="random">Random</option>
		<option value="vanilla">Vanilla</option>
	`;
	baseInput.name = "baseInput";

	baseModifier.appendChild(baseLabel);
	baseModifier.appendChild(baseInput);

	// baseInput.outerHTML = `
	// <select id="baseInput" name="baseInput" onfocus='this.size=3;' onblur='this.size=0;' onchange='this.size=1; this.blur();'>
	// 	<option value="custom">Custom</option>
	// 	<option value="random">Random</option>
	// 	<option value="vanilla">Vanilla</option>
	// </select>`;

	let randomCostModifier = document.createElement("div");
	randomCostModifier.className = "modifierWrapper";

	let randomCostLabel = document.createElement("div");
	randomCostLabel.id = "randomCostLabel";
	randomCostLabel.textContent = "Random Costs:";
	randomCostLabel.className = "tooltip modifierLabel";

	let randomCostHelp = document.createElement("div");
	randomCostHelp.id = "randomCostHelp";
	randomCostHelp.className = "tooltiptextright";
	randomCostHelp.textContent = "Randomize costs of all units and technologies";

	randomCostLabel.appendChild(randomCostHelp);

	let randomCostInput = document.createElement("input");
	randomCostInput.type = "checkbox";
	randomCostInput.name = "randomCostInput";
	randomCostInput.id = "randomCostInput";
	randomCostInput.checked = false;

	randomCostModifier.appendChild(randomCostLabel);
	randomCostModifier.appendChild(randomCostInput);

	let healthModifier = document.createElement("div");
	healthModifier.className = "modifierWrapper";

	let healthLabel = document.createElement("div");
	healthLabel.id = "healthLabel";
	healthLabel.textContent = "HP multiplier:";
	healthLabel.className = "tooltip modifierLabel";

	let healthHelp = document.createElement("div");
	healthHelp.id = "healthHelp";
	healthHelp.className = "tooltiptextright";
	healthHelp.textContent = "A multiplier to apply to all units' (not buildings) health. When set to 0, all units will permanently have 1 HP";

	healthLabel.appendChild(healthHelp);

	let healthValueWrapper = document.createElement("div");
	healthValueWrapper.innerHTML = `
			<div class="slidecontainer" id="healthInput">
				<input type="range" min="0" max="10" value="1" class="slider" id="healthRange" step="0.001">
			</div>
			<input type="number" id="healthValue" class="sliderValue"></div>
		`;
	healthValueWrapper.className = "sliderValueWrapper";
	healthValueWrapper.id = "healthValueWrapper";

	healthModifier.appendChild(healthLabel);
	healthModifier.appendChild(healthValueWrapper);

	let blindModifier = document.createElement("div");
	blindModifier.className = "modifierWrapper";

	let blindLabel = document.createElement("div");
	blindLabel.id = "blindLabel";
	blindLabel.textContent = "Blindness:";
	blindLabel.className = "tooltip modifierLabel";

	let blindHelp = document.createElement("div");
	blindHelp.id = "blindHelp";
	blindHelp.className = "tooltiptextright";
	blindHelp.textContent = "All units and buildings permanently have maximum 1 line of sight";

	blindLabel.appendChild(blindHelp);

	let blindInput = document.createElement("input");
	blindInput.type = "checkbox";
	blindInput.name = "blindInput";
	blindInput.id = "blindInput";
	blindInput.checked = false;

	blindModifier.appendChild(blindLabel);
	blindModifier.appendChild(blindInput);

	let speedModifier = document.createElement("div");
	speedModifier.className = "modifierWrapper";

	let speedLabel = document.createElement("div");
	speedLabel.id = "speedLabel";
	speedLabel.textContent = "Speed Multiplier:";
	speedLabel.className = "tooltip modifierLabel";

	let speedHelp = document.createElement("div");
	speedHelp.id = "speedHelp";
	speedHelp.className = "tooltiptextright";
	speedHelp.textContent = "A multiplier to apply to all units' (not buildings) movement speed";

	speedLabel.appendChild(speedHelp);

	let speedValueWrapper = document.createElement("div");
	speedValueWrapper.innerHTML = `
			<div class="slidecontainer" id="speedInput">
				<input type="range" min="0" max="10" value="1" class="slider" id="speedRange" step="0.001">
			</div>
			<input type="number" id="speedValue" class="sliderValue"></div>
		`;
	speedValueWrapper.className = "sliderValueWrapper";
	speedValueWrapper.id = "speedValueWrapper";

	speedModifier.appendChild(speedLabel);
	speedModifier.appendChild(speedValueWrapper);

	let buildingModifier = document.createElement("div");
	buildingModifier.className = "modifierWrapper";

	let buildingLabel = document.createElement("div");
	buildingLabel.id = "buildingLabel";
	buildingLabel.textContent = "Building Work Rate:";
	buildingLabel.className = "tooltip modifierLabel";

	let buildingHelp = document.createElement("div");
	buildingHelp.id = "buildingHelp";
	buildingHelp.className = "tooltiptextright";
	buildingHelp.textContent = "How quickly all buildings train units and research technologies";

	buildingLabel.appendChild(buildingHelp);

	let buildingValueWrapper = document.createElement("div");
	buildingValueWrapper.innerHTML = `
			<div class="slidecontainer" id="buildingInput">
				<input type="range" min="0.001" max="10" value="1" class="slider" id="buildingRange" step="0.001">
			</div>
			<input type="number" id="buildingValue" class="sliderValue"></div>
		`;
	buildingValueWrapper.className = "sliderValueWrapper";
	buildingValueWrapper.id = "buildingValueWrapper";

	buildingModifier.appendChild(buildingLabel);
	buildingModifier.appendChild(buildingValueWrapper);

	let infinityModifier = document.createElement("div");
	infinityModifier.className = "modifierWrapper";

	let infinityLabel = document.createElement("div");
	infinityLabel.id = "infinityLabel";
	infinityLabel.textContent = "x256 Ages:";
	infinityLabel.style.textDecoration = "line-through";
	infinityLabel.className = "tooltip modifierLabel";

	let infinityHelp = document.createElement("div");
	infinityHelp.id = "infinityHelp";
	infinityHelp.className = "tooltiptextright";
	infinityHelp.textContent = "Overhauls the technology tree to create indefinite scaling capability with 256 ages beyond the Imperial Age";

	infinityLabel.appendChild(infinityHelp);

	let infinityInput = document.createElement("input");
	infinityInput.type = "checkbox";
	infinityInput.name = "infinityInput";
	infinityInput.id = "infinityInput";
	infinityInput.checked = false;

	infinityModifier.appendChild(infinityLabel);
	infinityModifier.appendChild(infinityInput);

	inputLabel.appendChild(createHelp);
	vanillaDownload.appendChild(vanillaHelp);
	modifierTitle.appendChild(modifierHelp);

	modifierWrapper.appendChild(modifierTitle);
	modifierWrapper.appendChild(baseModifier);
	modifierWrapper.appendChild(healthModifier);
	modifierWrapper.appendChild(speedModifier);
	modifierWrapper.appendChild(buildingModifier);
	modifierWrapper.appendChild(randomCostModifier);
	modifierWrapper.appendChild(blindModifier);
	modifierWrapper.appendChild(infinityModifier);

	inputLabel.appendChild(viewFile);

	var buildForm = document.createElement("div");
	buildForm.id = "buildForm";
	document.getElementsByTagName("body")[0].appendChild(buildForm);

	document.getElementById("buildForm").appendChild(vanillaDownload);
	document.getElementById("buildForm").appendChild(modifierWrapper);
	document.getElementById("buildForm").appendChild(inputLabel);

	document.getElementById("speedValue").value = document.getElementById("speedRange").value;
	document.getElementById("speedRange").addEventListener("input", () => {
		document.getElementById("speedValue").value = document.getElementById("speedRange").value;
	});
	document.getElementById("speedValue").addEventListener("input", () => {
		if (document.getElementById("speedValue").value > 20) {
			document.getElementById("speedValue").value = 20;
		} else if (document.getElementById("speedValue").value < 0) {
			document.getElementById("speedValue").value = 0;
		}
		document.getElementById("speedRange").value = document.getElementById("speedValue").value;
	});

	document.getElementById("healthValue").value = document.getElementById("healthRange").value;
	document.getElementById("healthRange").addEventListener("input", () => {
		document.getElementById("healthValue").value = document.getElementById("healthRange").value;
	});
	document.getElementById("healthValue").addEventListener("change", () => {
		if (document.getElementById("healthValue").value > 100) {
			document.getElementById("healthValue").value = 100;
		} else if (document.getElementById("healthValue").value < 0) {
			document.getElementById("healthValue").value = 0;
		}
		document.getElementById("healthRange").value = document.getElementById("healthValue").value;
	});

	document.getElementById("buildingValue").value = document.getElementById("buildingRange").value;
	document.getElementById("buildingRange").addEventListener("input", () => {
		document.getElementById("buildingValue").value = document.getElementById("buildingRange").value;
	});
	document.getElementById("buildingValue").addEventListener("change", () => {
		if (document.getElementById("buildingValue").value > 100) {
			document.getElementById("buildingValue").value = 100;
		} else if (document.getElementById("buildingValue").value < 0.001) {
			document.getElementById("buildingValue").value = 0.001;
		}
		document.getElementById("buildingRange").value = document.getElementById("buildingValue").value;
	});

	buildForm.style.transform = `scale(${(0.6 * window.innerHeight) / buildForm.getBoundingClientRect().height})`;

	(function () {
		function checkCompatibility(presets) {
			if (presets.length > numCivs) {
				alert(`Too many civilizations (max ${numCivs}). Aborting creation.`);
				return -1;
			}
			//Free relic, Donjon, Anarchy, Marauder, First Crusade, Elite Mercenaries, free relic
			//Relic bonus, Royal Heirs, Bearded Axe, Pavise, Corvinian Army, Manipur, Logistica, Rocketry, Fabric Shields, Berserkergang
			var numDuplicates = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			for (var i = 0; i < presets.length; i++) {
				var preset = JSON.parse(presets[i]);
				for (var j = 0; j < preset["bonuses"][0].length; j++) {
					let bonus;
					if (preset["bonuses"][0][j].length == 2) {
						bonus = preset["bonuses"][0][j][0];
					} else {
						bonus = preset["bonuses"][0][j];
					}
					switch (bonus) {
						case 102:
							numDuplicates[6]++;
							break;
						case 313:
							numDuplicates[0]++;
							break;
					}
				}
				for (var j = 0; j < preset["bonuses"][3].length; j++) {
					let bonus;
					if (preset["bonuses"][3][j].length == 2) {
						bonus = preset["bonuses"][3][j][0];
					} else {
						bonus = preset["bonuses"][3][j];
					}
					switch (bonus) {
						case 9:
							numDuplicates[5]++;
							break;
					}
				}
			}
			var errorMessage;
			const errorMessages = [
				"Duplicate free relic civs!",
				"Duplicate Donjon civs!",
				"Duplicate Anarchy civs!",
				"Duplicate Marauder civs!",
				"Duplicate First Crusade civs!",
				"Duplicate Elite Mercenaries civs!",
				"Duplicate relic bonus civs!",
				"Duplicate Royal Heirs civs!",
				"Duplicate Bearded Axe civs!",
				"Duplicate Pavise civs!",
				"Duplicate Corvinian Army civs!",
				"Duplicate Manipur Cavalry civs!",
				"Duplicate Logistica civs!",
				"Duplicate Rocketry civs!",
				"Duplicate Fabric Shields civs!",
				"Duplicate Berserkergang civs!",
			];
			const compatibilityMessage =
				"\r\n\r\nMultiple civs having the following will result in Data Mod incompatibilities:\r\n" +
				"Relic bonus, Elite Mercenaries, Free relic bonus";
			for (var i = 0; i < numDuplicates.length; i++) {
				if (numDuplicates[i] > 1) {
					errorMessage = errorMessages[i];
					if (i < 7) {
						errorMessage += " Data Mod incompatibility. Aborting creation.";
						errorMessage += compatibilityMessage;
						alert(errorMessage);
						return -1;
					} else {
						errorMessage += " UI Mod incompatibility. No affect on gameplay. Continuing creation.";
						errorMessage += compatibilityMessage;
						alert(errorMessage);
						return 0;
					}
				}
			}
			return 0;
		}

		function readFileAsText(file) {
			return new Promise(function (resolve, reject) {
				let fr = new FileReader();
				fr.onload = function () {
					resolve(fr.result);
				};
				fr.onerror = function () {
					reject(fr);
				};
				fr.readAsText(file);
			});
		}

		function onChange(event) {
			let files = event.currentTarget.files;
			let readers = [];
			//Abort if no files selected
			if (!files.length) {
				return;
			}
			//Store promises in array
			let totalFileSize = 0;
			for (var i = 0; i < files.length; i++) {
				totalFileSize += files[i].size;
				readers.push(readFileAsText(files[i]));
			}
			if (totalFileSize > 5000000) {
				alert("Custom flags are too large. Please use smaller or more compressed images in your civilizations. Mod creation aborted.");
				return;
			} else if (totalFileSize > 1000000) {
				alert("Large files detected. Mod creation will continue, but due to large custom images the creation will take longer than normal.");
			}
			//Trigger promises
			Promise.all(readers).then(async (values) => {
				if (checkCompatibility(values) === 0) {
					dataSeed = getSeed();
					console.log(values);
					var raw_presets = '{"presets":[';
					for (var i = 0; i < values.length; i++) {
						raw_presets += values[i];
						if (i != values.length - 1) {
							raw_presets += ",";
						}
					}
					raw_presets += "]}";
					// console.log(raw_presets);
					// let modCreation = await axios.post(`${hostname}${route}/create`, { presets: raw_presets, seed: dataSeed }).catch((error) => {
					//   alert(error.response.data);
					// });
					// console.log(modCreation);
					// modCreation = modCreation.blob().then(() => {
					//   var a = document.createElement("a");
					//   a.href = window.URL.createObjectURL(modCreation.data);
					//   a.download = "FILENAME";
					//   a.click();
					// });
					let modifiers = {
						randomCosts: document.getElementById("randomCostInput").checked,
						hp: parseFloat(document.getElementById("healthValue").value),
						speed: parseFloat(document.getElementById("speedValue").value),
						blind: document.getElementById("blindInput").checked,
						infinity: document.getElementById("infinityInput").checked,
						building: parseFloat(document.getElementById("buildingValue").value),
					};
					post(`${route}/create`, { presets: raw_presets, seed: dataSeed, modifiers: JSON.stringify(modifiers) });
				}
			});
		}

		$("#viewCiv").on("click touchstart", function () {
			$(this).val("");
			if (document.getElementById("baseInput").value == "random" || document.getElementById("baseInput").value == "vanilla") {
				dataSeed = getSeed();
				let modifiers = {
					randomCosts: document.getElementById("randomCostInput").checked,
					hp: parseFloat(document.getElementById("healthValue").value),
					speed: parseFloat(document.getElementById("speedValue").value),
					blind: document.getElementById("blindInput").checked,
					infinity: document.getElementById("infinityInput").checked,
					building: parseFloat(document.getElementById("buildingValue").value),
				};
				post(`${route}/random`, {
					seed: dataSeed,
					civs: document.getElementById("baseInput").value == "random",
					modifiers: JSON.stringify(modifiers),
				});
				return false;
			}
		});

		document.getElementById("viewCiv").addEventListener("change", onChange);
	})();
}

var btn1 = document.getElementById("combineButton");
if (btn1) {
	document.getElementById("combineButton").addEventListener("click", combineCivilizations);
}

var btn2 = document.getElementById("startDraft");
if (btn2) {
	document.getElementById("startDraft").addEventListener("click", startaDraft);
}

var btn6 = document.getElementById("startBuild");
if (btn6) {
	document.getElementById("startBuild").addEventListener("click", startaBuild);
}

var btn3 = document.getElementById("home");
if (btn3) {
	btn3.addEventListener("click", function () {
		if (document.getElementsByClassName("draft_form").length != 0) {
			document.getElementsByClassName("draft_form")[0].remove();
		}
		if (document.getElementById("combineButton")) {
			document.getElementById("combineButton").remove();
		}
		if (document.getElementById("startBuild")) {
			document.getElementById("startBuild").remove();
		}
		if (document.getElementById("startDraft")) {
			document.getElementById("startDraft").remove();
		}
		if (document.querySelector("#spacer")) {
			document.querySelector("#spacer").remove();
		}
		if (document.querySelector("#spacer")) {
			document.querySelector("#spacer").remove();
		}
		if (document.getElementById("instructionsbox")) {
			document.getElementById("instructionsbox").remove();
		}
		if (document.getElementById("buildForm")) {
			document.getElementById("buildForm").remove();
		}
		if (document.getElementById("links")) {
			document.getElementById("links").style.display = "flex";
		}

		var page = document.getElementById("page");

		var combineButton = document.createElement("button");
		combineButton.id = "combineButton";
		combineButton.innerHTML = "Combine Civilizations";

		var spacer1 = document.createElement("div");
		spacer1.id = "spacer";
		var spacer2 = document.createElement("div");
		spacer2.id = "spacer";

		var or = document.createElement("button");
		or.id = "startBuild";
		or.innerHTML = "Build Civilization";

		var startDraft = document.createElement("button");
		startDraft.id = "startDraft";
		startDraft.innerHTML = "Create Draft";

		page.appendChild(or);
		page.appendChild(spacer1);
		page.appendChild(combineButton);
		page.appendChild(spacer2);
		page.appendChild(startDraft);

		document.getElementById("combineButton").addEventListener("click", combineCivilizations);
		document.getElementById("startDraft").addEventListener("click", startaDraft);
		document.getElementById("startBuild").addEventListener("click", startaBuild);
	});
}

var btn4 = document.getElementById("help");
if (btn4) {
	btn4.addEventListener("click", function () {
		if (document.getElementsByClassName("draft_form").length != 0) {
			document.getElementsByClassName("draft_form")[0].remove();
		}
		if (document.getElementById("combineButton")) {
			document.getElementById("combineButton").remove();
		}
		if (document.getElementById("startBuild")) {
			document.getElementById("startBuild").remove();
		}
		if (document.getElementById("startDraft")) {
			document.getElementById("startDraft").remove();
		}
		if (document.querySelector("#spacer")) {
			document.querySelector("#spacer").remove();
		}
		if (document.querySelector("#spacer")) {
			document.querySelector("#spacer").remove();
		}
		if (document.getElementById("instructionsbox")) {
			document.getElementById("instructionsbox").remove();
		}
		if (document.getElementById("buildForm")) {
			document.getElementById("buildForm").remove();
		}
		if (document.getElementById("links")) {
			document.getElementById("links").style.display = "none";
		}

		var page = document.getElementById("page");

		var instructionsbox = document.createElement("div");
		instructionsbox.id = "instructionsbox";

		var instructionstitle = document.createElement("p");
		instructionstitle.id = "instructionstitle";
		instructionstitle.innerHTML =
			'<iframe allow="fullscreen;" width="800" height="450" src="https://www.youtube.com/embed/JNQdYs9Tl5w"></iframe><br><iframe allow="fullscreen;" width="800" height="450" src="https://youtube.com/embed/2eVGyL93Wmk"</iframe><br><br><b>Publication Instructions:</b><br>';

		var instructionstext = document.createElement("p");
		instructionstext.id = "instructionstext";
		instructionstext.innerHTML =
			'1. Click the Download Button ("Random Civilizations" on homepage, or "Download Mod" after completing a draft) and extract the .zip file<br><br>' +
			"2. Log-in to ageofempires.com<br><br>" +
			"3. Go to Mods → Submit a Mod<br><br>" +
			"4. Fill out the form as you wish with the following specifications:<br>&emsp;&emsp;A) Game = Age of Empires II DE,<br>&emsp;&emsp;B) Type = Data Mod,<br>&emsp;&emsp;C) Tags = Data Mod,<br>" +
			"&emsp;&emsp;D) Images = thumbnail.jpg found in extracted folder,<br>&emsp;&emsp;E) Zip File Upload = [id]-data.zip found in extracted folder,<br>&emsp;&emsp;F) Please credit me or the website!<br><br>" +
			"5. Submit the data mod, and go to Mods → Submit a Mod again to publish the UI Mod<br><br>" +
			"6. Fill out the form as you wish with the following specifications:<br>&emsp;&emsp;A) Game = Age of Empires II DE,<br>&emsp;&emsp;B) Type = User Interface,<br>&emsp;&emsp;C) Tags = User Interface,<br>" +
			"&emsp;&emsp;D) Images = thumbnail.jpg,<br>&emsp;&emsp;E) Zip File Upload = [id]-ui.zip found in extracted folder,<br>&emsp;&emsp;F) Please credit me or the website!<br><br>" +
			"7. Submit the UI mod, go to Mods → My Mods, and share the links with the other players!";

		instructionsbox.appendChild(instructionstitle);
		instructionsbox.appendChild(instructionstext);

		page.appendChild(instructionsbox);
	});
}

var btn5 = document.getElementById("about");
if (btn5) {
	btn5.addEventListener("click", function () {
		if (document.getElementsByClassName("draft_form").length != 0) {
			document.getElementsByClassName("draft_form")[0].remove();
		}
		if (document.getElementById("combineButton")) {
			document.getElementById("combineButton").remove();
		}
		if (document.getElementById("startBuild")) {
			document.getElementById("startBuild").remove();
		}
		if (document.getElementById("startDraft")) {
			document.getElementById("startDraft").remove();
		}
		if (document.querySelector("#spacer")) {
			document.querySelector("#spacer").remove();
		}
		if (document.querySelector("#spacer")) {
			document.querySelector("#spacer").remove();
		}
		if (document.getElementById("instructionsbox")) {
			document.getElementById("instructionsbox").remove();
		}
		if (document.getElementById("buildForm")) {
			document.getElementById("buildForm").remove();
		}
		if (document.getElementById("links")) {
			document.getElementById("links").style.display = "none";
		}

		var page = document.getElementById("page");

		var instructionsbox = document.createElement("div");
		instructionsbox.id = "instructionsbox";

		var instructionstext = document.createElement("p");
		instructionstext.id = "instructionstext";
		instructionstext.innerHTML =
			"&emsp;&emsp;&emsp;&emsp;This is an easy-to-use tool for creating civilizations for Age of Empires II DE. Although more complex mods can be made with the Advanced Genie Editor, " +
			"it takes time to learn and does not have any multiplayer capabilities!<br><br>" +
			"&emsp;&emsp;&emsp;&emsp;There are three options on this website -- Randomized Civilizations, Civilization Building, and Civilization Drafting. Randomized Civilizations will scramble the bonuses, tech trees, " +
			"unique units, and much more for all factions at the click of the button. Each click will download a .zip file which contains two mod .zip files inside -- one for the data mod and one for the UI mod. You " +
			'can extract these and put them in your local mods folder, or publish them on the Mod Workshop by following the instructions given in the "Help" page. Please credit this website in the description ' +
			"of your mod so that others can enjoy this site too!<br><br>" +
			"&emsp;&emsp;&emsp;&emsp;For a singleplayer experience (or maximum combo-power), you can create your own civilizations with any of the bonuses/techs/etc. in the base-game or created by me. If you want to " +
			"create your own bonuses, you'll have to learn how to use the Advanced Genie Editor (or send me a suggestion on discord at Krakenmeister#1672, and I might add it!). Once you build a civilization, you can " +
			"download the preset as a .json file. You can view civilizations from their .json preset file, as well as combine multiple presets into a single mod containing those civilizations. After combining, the mod " +
			"can be downloaded and published just like the randomized civilizations. Note that there are a few techs and bonuses, that if shared among multiple civilizations while combining, cause compatibility issues. " +
			"UI mod issues are extremely minor and have no affect on gameplay, but data mod issues are critical and are not available to download.<br><br>" +
			"&emsp;&emsp;&emsp;&emsp;If you want to play a game with friends, one player has to create the draft. 250 tech tree points is recommended to force players to choose somewhat between strategies, but most " +
			"vanilla tech trees are more diverse and would require 300-350 tech tree points to create. If you plan on playing in teams, I recommend all players use their team name when joining the lobby (not as their " +
			"civilization name). When picking your tech trees, note that the player that spends the least points gets first pick in the drafting phases (and most points gets last pick). However, castle techs and team " +
			'bonuses are picked in reverse order. If you choose to "refill" on your turn, the board will draw new cards into empty slots, but you will only be able to pick from the newly drawn cards. If you choose ' +
			'to "clear" on your turn, all cards will be refreshed, but you will receive three random choices. In-game, you can view other players\' civilizations by clicking on their name or flag. Once ' +
			"everyone has finished picking team bonuses, the data and UI mods can be downloaded and published just like the randomized civilizations.<br><br>" +
			'&emsp;&emsp;&emsp;&emsp;This website was created under Microsoft\'s "Game Content Usage Rules" using assets from Age of Empires II, and is not endorsed by or affiliated with Microsoft. Age of Empires II ' +
			"© Microsoft Corporation. I would also like to give a huge thank you to HSZemi for his work with aoe2techtree.net which was used to create the in-game display of civilization tech trees. In addition, the " +
			"auto-mods and captains mode projects were the launching point for this project. Spirit of the Law's videos on creating OP Civs were genius and the main source of inspiration for the website. Many thanks to " +
			"Garrus Valkyrin for his contributions on the thumbnail, his time playtesting, and his faith in the project at its earliest stages!<br><br>" +
			'Project is <a href="https://github.com/Krakenmeister/AoE2-Civbuilder">open source</a>. Also, please consider <a href="https://www.buymeacoffee.com/krakenmeister">supporting</a> the website, thank you!';

		instructionsbox.appendChild(instructionstext);

		page.appendChild(instructionsbox);
	});
}

var btn7 = document.getElementById("updates");
if (btn7) {
	btn7.addEventListener("click", function () {
		if (document.getElementsByClassName("draft_form").length != 0) {
			document.getElementsByClassName("draft_form")[0].remove();
		}
		if (document.getElementById("combineButton")) {
			document.getElementById("combineButton").remove();
		}
		if (document.getElementById("startBuild")) {
			document.getElementById("startBuild").remove();
		}
		if (document.getElementById("startDraft")) {
			document.getElementById("startDraft").remove();
		}
		if (document.querySelector("#spacer")) {
			document.querySelector("#spacer").remove();
		}
		if (document.querySelector("#spacer")) {
			document.querySelector("#spacer").remove();
		}
		if (document.getElementById("instructionsbox")) {
			document.getElementById("instructionsbox").remove();
		}
		if (document.getElementById("buildForm")) {
			document.getElementById("buildForm").remove();
		}
		if (document.getElementById("links")) {
			document.getElementById("links").style.display = "none";
		}

		var page = document.getElementById("page");

		var instructionsbox = document.createElement("div");
		instructionsbox.id = "instructionsbox";

		var instructionstitle = document.createElement("p");
		instructionstitle.id = "instructionstitle";
		instructionstitle.innerHTML = "<b>Update Log:</b><br>";

		var instructionstext = document.createElement("p");
		instructionstext.id = "instructionstext";
		instructionstext.innerHTML = `
			<b>05-22-2024</b><br>
			&emsp;&emsp;• Added a rarity system to bonuses/cards to serve as a guideline in power level<br><br>
			<b>05-19-2024</b><br>
			&emsp;&emsp;• Added modifiers which can be applied on top of generated civilization mods<br><br>
			<b>05-18-2024</b><br>
			&emsp;&emsp;• Devotion now appropriately gives +5 HP with the Aztec bonus<br>
			&emsp;&emsp;• Husbandry gives attack speed gives the correct bonus now<br>
			&emsp;&emsp;• Added free relics to data mod incompatibilities<br>
			&emsp;&emsp;• Rewrote Inca villager bonus to reflect gameplay<br>
			&emsp;&emsp;• Moved missionary train location to not overlap with warrior priests<br>
			&emsp;&emsp;• Fixed missionaries being free with Hussite Reforms<br><br>
			<b>05-14-2024</b><br>
			&emsp;&emsp;• Draft mode works again<br>
			&emsp;&emsp;• Resolved a bug where spearmen from TCs or villagers wouldn't upgrade<br>
			&emsp;&emsp;• Photonmen are now classified as gunpowder units for the purposes of bonuses and technologies<br>
			&emsp;&emsp;• Corvinian Army now works on Warrior Monks and Headhunters<br>
			&emsp;&emsp;• Hussite Reforms now works on Warrior Priests and Missionaries<br>
			&emsp;&emsp;• Resolved a bug causing melee Rathas to have infinite armor<br>
			&emsp;&emsp;• Fixed Bloodlines not included in "fill" feature<br>
			&emsp;&emsp;• Fixed vanilla civilization icons showing up in selection menu<br>
			&emsp;&emsp;• Re-fixed civilization descriptions displaying the wrong unique unit<br>
			&emsp;&emsp;• Fixed blacksmith bonus damage not working on ranged units<br><br>
			<b>05-10-2024</b><br>
			&emsp;&emsp;• Added a button to enable all techs while editing tech trees<br><br>
			<b>05-03-2024</b><br>
			&emsp;&emsp;• Fixed Crusader Knights being convertible<br>
			&emsp;&emsp;• Allowed Eupsong to affect Donjons<br>
			&emsp;&emsp;• Fixed various civilization descriptions displaying the wrong unique unit image<br>
			&emsp;&emsp;• Allowed Ahosi to be affected by blacksmith attack upgrades<br>
			&emsp;&emsp;• Fixed side effect of gunpowder university attack bonus giving City Walls<br>
			&emsp;&emsp;• Moved Shrivamsha train location to not coincide with Knights<br><br>
			<b>04-26-2024</b><br>
			&emsp;&emsp;• Extended bonus stacking to unique technologies as well<br><br>
			<b>04-18-2024</b><br>
			&emsp;&emsp;• Added the ability to stack the same bonus multiple times<br><br>
			<b>04-17-2024</b><br>
			&emsp;&emsp;• Fixed a bug where feudal knights were un-upgradable<br><br>
			<b>04-14-2024</b><br>
			&emsp;&emsp;• Implemented more community suggested bonuses and techs<br><br>
			<b>04-13-2024</b><br>
			&emsp;&emsp;• Added Khmer farm bonus and 2x2 farms<br><br>
			<b>04-07-2024</b><br>
			&emsp;&emsp;• Added the ability to upload your own images as flags<br><br>
			<b>03-31-2024</b><br>
			&emsp;&emsp;• Implemented several community suggested bonuses and techs<br><br>
			<b>03-17-2024</b><br>
			&emsp;&emsp;• Updated website for compatibility with AoE2 Update 107882<br><br>
			<b>03-10-2024</b><br>
			&emsp;&emsp;• Updated website to work with The Mountain Royals<br><br>
			<b>05-31-2023</b><br>
			&emsp;&emsp;• Updated website to work with Return of Rome<br><br>
			<b>11-26-2022</b><br>
			&emsp;&emsp;• Fixed a bug where free eagle upgrades would give extra stats<br><br>
			<b>09-02-2022</b><br>
			&emsp;&emsp;• Updated website to conform to AoE2 Update 66694<br><br>
			<b>05-15-2022</b><br>
			&emsp;&emsp;• Fixed a few minor text and graphics inconsistencies<br>
			&emsp;&emsp;• Updated mod generation to be compatible with Dynasties of India update<br><br>
			<b>04-06-2022</b><br>
			&emsp;&emsp;• Currently selected bonuses display at the top of the page (credit to Steven Jackson for the code!)<br><br>
			<b>03-26-2022</b><br>
			&emsp;&emsp;• Added 3 new flag symbols<br><br>
			<b>03-22-2022</b><br>
			&emsp;&emsp;• Updated default mod thumbnail (thanks to TWest!)<br><br>
			<b>03-21-2022</b><br>
			&emsp;&emsp;• Fixed an issue causing vanilla civ files to become corrupted after editing them<br>
			&emsp;&emsp;• Updated vanilla civ files to include languages<br>
			&emsp;&emsp;• Corrected a few rare cases where villager sounds would be from their original civilizations<br><br>
			<b>03-18-2022</b><br>
			&emsp;&emsp;• Removed data incompatibility restriction for Kreposts, Donjons, Anarchy, Marauders, and First Crusade<br>
			&emsp;&emsp;• Removed all UI incompatibility restrictions<br>
			&emsp;&emsp;• Fixed some civilizations being able to recruit their unique unit from castles in Dark Age in Regicide<br><br>
			<b>03-17-2022</b><br>
			&emsp;&emsp;• Added functionality to language selection<br><br>
			<b>03-14-2022</b><br>
			&emsp;&emsp;• Villager's Revenge unique technology no longer crashes the game and works as intended<br><br>
			<b>03-12-2022</b><br>
			&emsp;&emsp;• Corrected a typo in Korean discount bonus<br>
			&emsp;&emsp;• Changed flamethrowers cost to 150w 25g instead of 150f 25g<br>
			&emsp;&emsp;• Fixed bug in university gunpowder attack bonus causing it to fail for units with melee attack<br>
			&emsp;&emsp;• Fixed that new unique techs didn't show up while editing civilizations<br>
			&emsp;&emsp;• Fixed bug where monks would change regional graphic while converting and galleon graphics didn't align<br>
			&emsp;&emsp;• Resolved an issue with integrating language selection into draft mode<br><br>
			<b>03-09-2022</b><br>
			&emsp;&emsp;• Fixed an issue with hovering over cards in parts of the screen<br><br>
			<b>03-08-2022</b><br>
			&emsp;&emsp;• Added 10 new unique technologies<br><br>
			<b>02-15-2022</b><br>
			&emsp;&emsp;• Added events page for all events related to civbuilder<br><br>
			<b>01-25-2022</b><br>
			&emsp;&emsp;• Added icon and reflective tab titles<br><br>
			<b>01-16-2022</b><br>
			&emsp;&emsp;• Warrior monks now also benefit from monk bonuses unique to civbuilder, Inquisition increases their attack rate<br><br>
			<b>01-15-2022</b><br>
			&emsp;&emsp;• Fixed the filter input location while editing civilizations<br><br>
			<b>01-13-2022</b><br>
			&emsp;&emsp;• Bonuses, units, and techs can be filtered/searched for<br><br>
			<b>01-12-2022</b><br>
			&emsp;&emsp;• Fixed a bug causing some civilization links to become corrupted<br>
			&emsp;&emsp;• Allowed civilization viewer and editor to read in .json files with empty values<br><br>
			<b>01-11-2022</b><br>
			&emsp;&emsp;• Civilizations can now be shared and viewed with direct links rather than .json files<br>
			&emsp;&emsp;• Added the ability to edit civilization .json files<br><br>
			<b>01-10-2022</b><br>
			&emsp;&emsp;• Allowed most 0-cost techs to affect mod generation (techs that cannot affect generation are now untoggleable)<br><br>
			<b>01-08-2022</b><br>
			&emsp;&emsp;• Adjusted galley attack bonus to begin in Castle Age<br><br>
			<b>01-07-2022</b><br>
			&emsp;&emsp;• Fixed a bug causing the game to crash if the UI mod is enabled while playing with the 15th modded civilization<br><br>
			<b>01-05-2022</b><br>
			&emsp;&emsp;• Updated base data file to reflect changes in Update 56005<br>
			&emsp;&emsp;• Fixed the cost of Varangian Guard<br>
			&emsp;&emsp;• Updated Vanilla .json files to correspond to patch notes<br>
			&emsp;&emsp;• Matched regional trade carts to civilization architecture set<br><br>
			<b>11-14-2021</b><br>
			&emsp;&emsp;• Added 35 new unique units<br><br>
			<b>10-18-2021</b><br>
			&emsp;&emsp;• Adjusted statistics of various custom unique units<br>
			&emsp;&emsp;• Changed Flamethrower costs to require the gold payment shown in the description<br><br>
			<b>10-17-2021</b><br>
			&emsp;&emsp;• Fixed various typos<br>
			&emsp;&emsp;• Fixed Serjeants getting auto-upgraded doubly upon hitting Castle Age<br>
			&emsp;&emsp;• Fixed villagers being unable to garrison in houses despite having the bonus<br>
			&emsp;&emsp;• Connected empty trade cart graphics to civilization architecture<br>
			&emsp;&emsp;• Fixed a bug allowing players to recruit dismounted Konniks for free when researching Anarchy or Marauders<br><br>
			<b>10-16-2021</b><br>
			&emsp;&emsp;• Updated base data file to reflect changes in Update 54480<br><br>
			<b>09-10-2021</b><br>
			&emsp;&emsp;• Added Xolotl Warriors, Saboteurs, Ninjas, and Flamethrowers as unique units<br><br>
			<b>09-09-2021</b><br>
			&emsp;&emsp;• Added Crusader Knights as a unique unit<br>
			&emsp;&emsp;• Adjusted Farimba to give only +3 attack<br>
			&emsp;&emsp;• Fixed free archer-line upgrades bonus so that it works on crossbows<br><br>
			<b>09-05-2021</b><br>
			&emsp;&emsp;• Made Korean stone mining civ bonus affect Polish stone mining gold generation<br><br>
			<b>09-03-2021</b><br>
			&emsp;&emsp;• Added more symbols to the flag creator<br><br>
			<b>08-22-2021</b><br>
			&emsp;&emsp;• Increased trade units' work rates along with their speed<br><br>
			<b>08-14-2021</b><br>
			&emsp;&emsp;• Fixed a bug causing units in a couple of bonuses to not get the bonus damage they deserved<br><br>
			<b>08-12-2021</b><br>
			&emsp;&emsp;• Updated to include and integrate Dawn of the Dukes update<br>
			&emsp;&emsp;• Reverted ballista elephants back to cavalry class so that cavalry blacksmith upgrades affect them<br>
			&emsp;&emsp;• Fixed an issue causing unique units recruited from Donjons to get extra stats in Castle Age<br>
			&emsp;&emsp;• Increased the upper range of how many resources stone and gold piles can generate with (in random costs)<br><br>
			<b>07-01-2021</b><br>
			&emsp;&emsp;• Architecture choice now affects king and monk graphics, as well as garrison building flag positioning<br><br>
			<b>06-30-2021</b><br>
			&emsp;&emsp;• Added an option to give civilizations multiple unique techs for manually customized .json files (multiple entries in 3rd and 4th "bonuses" array)<br><br>
			<b>06-29-2021</b><br>
			&emsp;&emsp;• Added an option to give civilizations multiple team bonuses for manually customized .json files (multiple entries in the final "bonuses" array)<br><br>
			<b>06-27-2021</b><br>
			&emsp;&emsp;• Starting with an Eagle scout can be enabled by fully disabling the Stable in the tech tree (otherwise civs will start with a normal scout)<br>
			&emsp;&emsp;• Fixed Imperial Scorpions so that they can be affected by Rocketry<br>
			&emsp;&emsp;• Fixed a bug causing unique units not to get Logistica's bonus vs. infantry in some cases<br>
			&emsp;&emsp;• Fixed a bug causing Royal Lancers, Royal Battle Elephants, and Imperial Skirmishers to enable in some cases despite the team bonus not being active<br><br>
			<b>06-25-2021</b><br>
			&emsp;&emsp;• Resolved an issue causing civs with War Elephants to get a Mameluke icon in the selection screen and vice versa<br>
			&emsp;&emsp;• Fixed a bug causing Forced Levy and Kamandaran to give players gold if those units were also discounted<br><br>
			<b>06-24-2021</b><br>
			&emsp;&emsp;• Decreased mod ID collisions by a factor of 300,000,000<br>
			&emsp;&emsp;• Added support for games running in different languages (only English descriptions available still but now they will always be displayed)<br>
			&emsp;&emsp;• Shatagni can apply to Janissaries now<br>
			&emsp;&emsp;• Fixed a bug that gave Royal Lancers 13 bonus damage vs. siege instead of 13 attack<br><br>
			<b>06-23-2021</b><br>
			&emsp;&emsp;• Changed mod ID generation to avoid collisions<br><br>
			<b>06-22-2021</b><br>
			&emsp;&emsp;• Thanks to this wonderful community's generosity, the server is greatly improved!<br>
			&emsp;&emsp;• Added better maintenance to avoid killing ongoing drafts<br>
			&emsp;&emsp;• Fixed a fatal bug when new bonuses were disabled during drafting<br><br>
			<b>06-21-2021</b><br>
			&emsp;&emsp;• Added very rare Easter eggs to random cost generation<br><br>
			<b>06-17-2021</b><br>
			&emsp;&emsp;• Randomizing unit costs will now also randomize how much resources trees, stones, boars, etc. hold (stones and golds abundance usually increased)<br><br>
			<b>06-13-2021</b><br>
			&emsp;&emsp;• Added 40 new team bonuses<br>
			&emsp;&emsp;• Reworked tech discount bonuses so that they depend on the techs' costs rather than fixed values (only matters in random cost generation)<br><br>
			<b>06-10-2021</b><br>
			&emsp;&emsp;• Added an option to randomize both civilizations and costs (generation is less varied than [SE] Random Costs mod i.e. nothing costs 1 wood; 
			costs of the same unit/building do not change between ages and upgrades)<br><br>
			<b>06-08-2021</b><br>
			&emsp;&emsp;• Fixed a bug causing Elite Steppe Lancers not to be considered "mounted units"<br>
			&emsp;&emsp;• Fixed a bug that caused Eagle Scouts to be enabled for all civs<br><br>
			<b>06-07-2021</b><br>
			&emsp;&emsp;• Added 50 new civilization bonuses<br>
			&emsp;&emsp;• Added option to include vanilla civilizations in created mods (thank you to TheRevanReborn for recreating every civ in the builder!)<br><br>
			<b>06-06-2021</b><br>
			&emsp;&emsp;• Fixed a bug in Ironclad tech allocation<br>
			&emsp;&emsp;• Fixed an issue that was causing the 8th and 9th combined civilizations to swap tech trees and unique unit icons<br><br>
			<b>06-05-2021</b><br>
			&emsp;&emsp;• Architecture selection now actually affects in-game graphics<br><br>
			<b>06-03-2021</b><br>
			&emsp;&emsp;• Added architecture selection<br>
			&emsp;&emsp;• Fixed a bug in reshuffling cards during drafting<br>
			&emsp;&emsp;• Fixed a bug in Teuton armor bonus<br>
			&emsp;&emsp;• Reverted bonus changes to keep everything except blacksmith vils in-line with DE<br>
			&emsp;&emsp;• Added name checking to civilization names<br>`;

		instructionsbox.appendChild(instructionstitle);
		instructionsbox.appendChild(instructionstext);

		page.appendChild(instructionsbox);
	});
}

var invitebutton = document.getElementById("discordinvite");
var donatebutton = document.getElementById("donate");

if (invitebutton) {
	invitebutton.onclick = function () {
		location.href = "https://discord.gg/vQxck6JDwf";
	};
}

if (donatebutton) {
	donatebutton.onclick = function () {
		location.href = "https://www.buymeacoffee.com/krakenmeister";
	};
}

var btn8 = document.getElementById("events");
if (btn8) {
	btn8.addEventListener("click", function () {
		window.location.href = "https://krakenmeister.com/events";
	});
}
