/*This code is really really really bad. But it was literally my first website page so I'm keeping it out of charm (definitely not laziness!)*/

//alert('If you are attempting to make mods right now, something is going horribly wrong. Please message me on discord at Krakenmeister#1672 thank you')

var dataSeed = -1;

function copyToClipboard(textid, buttonid){
	const buttons = ["button1", "button2", "button3"]
	var copyText = document.getElementById(textid)
	copyText.select()
	copyText.setSelectionRange(0, 99999)
	document.execCommand("copy")
	copyText.selectionEnd = copyText.selectionStart
	copyText.blur()
	for (var i=0; i<buttons.length; i++) {
		var button = document.getElementById(buttons[i])
		if (buttonid == buttons[i]) {
			button.textContent = 'Copied!'
		} else {
			button.textContent = 'Copy'
		}
	}
}

function generateRandom () {
	document.getElementById('generateButton').remove()
	document.getElementById('startBuild').remove()
	document.getElementById('startDraft').remove()
	document.querySelector('#spacer').remove()
	document.querySelector('#spacer').remove()

	var randomForm = document.createElement('div')
	randomForm.id = 'buildForm'

	var randomCivs = document.createElement('button')
	randomCivs.id = 'randomCivs'
	randomCivs.innerHTML = 'Generate Randomized Civilizations'
	randomCivs.onclick = function () {
		dataSeed = getSeed()
		post('/file', {seed: dataSeed, costs: 'normal'})
	}

	var randomCosts = document.createElement('button')
	randomCosts.id = 'randomCosts'
	randomCosts.innerHTML = 'Generate Random Civs and Costs'
	randomCosts.onclick = function () {
		dataSeed = getSeed()
		post('/file', {seed: dataSeed, costs: 'random'})
	}

	randomForm.appendChild(randomCivs)
	randomForm.appendChild(randomCosts)

	document.getElementsByTagName('body')[0].appendChild(randomForm)
}

function startaDraft() {
	document.getElementById('generateButton').remove()
	document.getElementById('startBuild').remove()
	document.getElementById('startDraft').remove()
	document.querySelector('#spacer').remove()
	document.querySelector('#spacer').remove()

	let draftForm = document.createElement('form');
	draftForm.className = 'draft_form'
	draftForm.method = 'post'
	draftForm.action = '/draft'

	let input1 = document.createElement('input')
	input1.type = 'number'
	input1.name = 'num_players'
	input1.value = 2
	input1.min = 2
	input1.max = 8
	let label1 = document.createElement('label')
	label1.setAttribute('for', 'num_players')
	label1.innerHTML = 'Number of Players: '

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

	let input2 = document.createElement('input')
	input2.type = 'number'
	input2.name = 'rounds'
	input2.value = 4
	input2.min = 2
	input2.max = 6
	let label2 = document.createElement('label')
	label2.setAttribute('for', 'rounds')
	label2.innerHTML = 'Bonuses per Player: '

	let input3 = document.createElement('input')
	input3.type = 'checkbox'
	input3.name = 'new_bonuses'
	input3.checked = true
	let label3 = document.createElement('label')
	label3.setAttribute('for', 'new_bonuses')
	label3.innerHTML = 'Allow New Bonuses: '

	let input4 = document.createElement('input')
	input4.type = 'number'
	input4.name = 'techtree_currency'
	input4.value = 250
	input4.min = 25
	input4.max = 500
	let label4 = document.createElement('label')
	label4.setAttribute('for', 'techtree_currency')
	label4.innerHTML = 'Starting Tech Tree Points: '

	let input5 = document.createElement('input')
	input5.type = 'submit'
	input5.value = 'Start Draft'

	let div1 = document.createElement('div')
	let div2 = document.createElement('div')
	let div3 = document.createElement('div')
	let div4 = document.createElement('div')
	div1.className = 'input_field'
	div2.className = 'input_field'
	div3.className = 'input_field'
	div4.className = 'input_field'
	div1.appendChild(label1)
	div1.appendChild(input1)
	div2.appendChild(label2)
	div2.appendChild(input2)
	div3.appendChild(label3)
	div3.appendChild(input3)
	div4.appendChild(label4)
	div4.appendChild(input4)
	draftForm.appendChild(div1)
	draftForm.appendChild(div2)
	draftForm.appendChild(div3)
	draftForm.appendChild(div4)
	draftForm.appendChild(input5)

	document.getElementsByTagName('body')[0].appendChild(draftForm)
}

function startaBuild() {
	document.getElementById('generateButton').remove()
	document.getElementById('startBuild').remove()
	document.getElementById('startDraft').remove()
	document.querySelector('#spacer').remove()
	document.querySelector('#spacer').remove()

	var buildForm = document.createElement('div')
	buildForm.id = 'buildForm'

	var viewButton = document.createElement('button')
	viewButton.id = 'viewButton'
	viewButton.innerHTML = 'View Civilization'
	viewButton.onclick = function () {
		document.getElementById('viewButton').remove()
		document.getElementById('editButton').remove()
		document.getElementById('buildButton').remove()
		document.getElementById('combineButton').remove()

		var viewFile = document.createElement('input')
		viewFile.id = 'viewCiv'
		viewFile.className = 'upload'
		viewFile.name = 'upload'
		viewFile.type = 'file'

		var inputLabel = document.createElement('label')
		inputLabel.innerHTML = ('Choose .json file')
		inputLabel.className = 'upload'

		inputLabel.appendChild(viewFile)
		document.getElementById('buildForm').appendChild(inputLabel)

		;(function(){
			function onChange (event) {
				var reader = new FileReader()
				reader.onload = onReaderLoad
				reader.readAsText(event.target.files[0])
			}

			$('#viewCiv').on('click touchstart', function() {
				$(this).val('')
			})

			function onReaderLoad (event){
				console.log(event.target.result)
				var civ = JSON.parse(event.target.result)
				var description = `<span><b>${civ['alias']}</b></span><br><br>`
				for (var a=0; a<civ['bonuses'][0].length; a++) {
					description += '•'
					description += card_descriptions[0][civ['bonuses'][0][a]]
					description += '<br>'
				}
				description += '<br><span><b>Unique Unit:</b></span><br>'
				if (civ['bonuses'][1].length != 0) {
					description += card_descriptions[1][civ['bonuses'][1][0]]
					description += '<br>'
				}
				description += '<br><span><b>Unique Techs:</b></span><br>'
				if (civ['bonuses'][2].length != 0) {
					for (var j=0; j<civ['bonuses'][2].length; j++) {
						description += '•'
						description += card_descriptions[2][civ['bonuses'][2][j]]
						description += '<br>'
					}
				}
				if (civ['bonuses'][3].length != 0) {
					for (var j=0; j<civ['bonuses'][3].length; j++) {
						description += '•'
						description += card_descriptions[3][civ['bonuses'][3][j]]
						description += '<br>'
					}
				}
				description += '<br><span><b>Team Bonus:</b></span><br>'
				if (civ['bonuses'][4].length != 0) {
					for (var j=0; j<civ['bonuses'][4].length; j++) {
						if (civ['bonuses'][4].length > 1) {
							description += '•'
						}
						description += card_descriptions[4][civ['bonuses'][4][j]]
						description += '<br>'
					}
				}

				showTechtree(civ['tree'], -1, 2, 0, description)
			}

			document.getElementById('viewCiv').addEventListener('change', onChange)
		}());
	}

	var editButton = document.createElement('button')
	editButton.id = 'editButton'
	editButton.innerHTML = 'Edit Civilization'
	editButton.onclick = function () {
		document.getElementById('viewButton').remove()
		document.getElementById('editButton').remove()
		document.getElementById('buildButton').remove()
		document.getElementById('combineButton').remove()

		var editFile = document.createElement('input')
		editFile.id = 'editCiv'
		editFile.className = 'upload'
		editFile.name = 'upload'
		editFile.type = 'file'

		var inputLabel = document.createElement('label')
		inputLabel.innerHTML = ('Choose .json file')
		inputLabel.className = 'upload'

		inputLabel.appendChild(editFile)
		document.getElementById('buildForm').appendChild(inputLabel)

		;(function(){
			function onChange (event) {
				var reader = new FileReader()
				reader.onload = onReaderLoad
				reader.readAsText(event.target.files[0])
			}

			$('#editCiv').on('click touchstart', function() {
				$(this).val('')
			})

			function onReaderLoad (event){
				var civ = JSON.parse(event.target.result)
				location.href = 'https://krakenmeister.com/edit/' + encryptJson(civ)
			}

			document.getElementById('editCiv').addEventListener('change', onChange)
		}());
	}


	var buildButton = document.createElement('button')
	buildButton.id = 'buildButton'
	buildButton.innerHTML = 'Build Civilization'
	buildButton.onclick = function () {
		window.location.assign('/build')
	}

	var combineButton = document.createElement('button')
	combineButton.id = 'combineButton'
	combineButton.innerHTML = 'Combine Civilizations'
	combineButton.onclick = function () {
		document.getElementById('viewButton').remove()
		document.getElementById('editButton').remove()
		document.getElementById('buildButton').remove()
		document.getElementById('combineButton').remove()

		var viewFile = document.createElement('input')
		viewFile.id = 'viewCiv'
		viewFile.className = 'upload'
		viewFile.name = 'upload'
		viewFile.type = 'file'
		viewFile.setAttribute('multiple', '')

		var inputLabel = document.createElement('label')
		inputLabel.innerHTML = 'Create Mod'
		inputLabel.className = 'upload'

		var vanillaDownload = document.createElement('button')
		vanillaDownload.id = 'vanillaDownload'
		vanillaDownload.innerHTML = 'Get Vanilla Civs'
		vanillaDownload.onclick = function () {
			post('/vanilla', {})
		}

		var vanillaText = document.createElement('p')
		vanillaText.id = 'vanillaText'
		vanillaText.innerHTML = '&emsp;1) &nbsp;Select civilization .json files to combine into a mod.zip file. Note that all other civilizations\' bonuses will be overwritten in this mod.<br>' +
			'&emsp;2) &nbsp;To include vanilla civilizations in your mods, click to download the .json files for all the civilizations in the base game.'

		inputLabel.appendChild(viewFile)
		document.getElementById('buildForm').appendChild(inputLabel)
		document.getElementById('buildForm').appendChild(vanillaDownload)
		document.getElementById('buildForm').appendChild(vanillaText)

		;(function(){
			function checkCompatibility (presets) {
				if (presets.length > 39) {
					alert('Too many civilizations (max 39). Aborting creation.')
					return -1
				}
				//Krepost, Donjon, Anarchy, Marauder, First Crusade, Elite Mercenaries,
				//Relic bonus, Royal Heirs, Bearded Axe, Pavise, Corvinian Army, Manipur, Logistica, Rocketry, Fabric Shields, Berserkergang
				var numDuplicates = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				for (var i=0; i<presets.length; i++) {
					var preset = JSON.parse(presets[i])
					for (var j=0; j<preset['bonuses'][0].length; j++) {
						switch (preset['bonuses'][0][j]) {
							case 93:
								numDuplicates[0]++
								break
							case 102:
								numDuplicates[6]++
								break
							case 109:
								numDuplicates[1]++
								break
						}
					}
					for (var j=0; j<preset['bonuses'][2].length; j++) {
						switch (preset['bonuses'][2][j]) {
							case 10:
								numDuplicates[7]++
								break
							case 11:
								numDuplicates[8]++
								break
							case 12:
								numDuplicates[2]++
								break
							case 13:
								numDuplicates[3]++
								break
							case 16:
								numDuplicates[9]++
								break
							case 21:
								numDuplicates[10]++
								break
							case 29:
								numDuplicates[4]++
								break
						}
					}
					for (var j=0; j<preset['bonuses'][3].length; j++) {
						switch (preset['bonuses'][3][j]) {
							case 5:
								numDuplicates[11]++
								break
							case 6:
								numDuplicates[12]++
								break
							case 8:
								numDuplicates[13]++
								break
							case 14:
								numDuplicates[14]++
								break
							case 36:
								numDuplicates[15]++
								break
						}
					}
				}
				var errorMessage
				const errorMessages = ['Duplicate Krepost civs!', 'Duplicate Donjon civs!', 'Duplicate Anarchy civs!', 'Duplicate Marauder civs!', 'Duplicate First Crusade civs!', 'Duplicate Elite Mercenaries civs!',
					'Duplicate relic bonus civs!', 'Duplicate Royal Heirs civs!', 'Duplicate Bearded Axe civs!', 'Duplicate Pavise civs!', 'Duplicate Corvinian Army civs!', 'Duplicate Manipur Cavalry civs!',
					'Duplicate Logistica civs!', 'Duplicate Rocketry civs!', 'Duplicate Fabric Shields civs!', 'Duplicate Berserkergang civs!']
				const compatibilityMessage = '\r\n\r\nMultiple civs having the following will result in UI incompatibilities:\r\n' +
					'Relic bonus, Royal Heirs, Bearded Axe, Pavise, Corvinian Army, Manipur Cavalry, Logistica, Rocketry, Fabric Shields, Berserkergang' +
					'\r\n\r\nMultiple civs having the following will result in Data Mod incompatibilities:\r\n' +
					'Krepost, Donjon, Anarchy, Marauders, First Crusade, Elite Mercenaries'
				for (var i=0; i<numDuplicates.length; i++) {
					if (numDuplicates[i] > 1) {
						errorMessage = errorMessages[i]
						if (i < 6) {
							errorMessage += ' Data Mod incompatibility. Aborting creation.'
							errorMessage += compatibilityMessage
							alert(errorMessage)
							return -1
						} else {
							errorMessage += ' UI Mod incompatibility. No affect on gameplay. Continuing creation.'
							errorMessage += compatibilityMessage
							alert(errorMessage)
							return 0
						}
					}
				}
				return 0
			}

			function readFileAsText (file) {
				return new Promise(function(resolve, reject) {
					let fr = new FileReader()
					fr.onload = function () {
						resolve(fr.result)
					}
					fr.onerror = function () {
						reject(fr)
					}
					fr.readAsText(file)
				})
			}

			function onChange (event) {
				let files = event.currentTarget.files
				let readers = []
				//Abort if no files selected
				if (!files.length) {
					return
				}
				//Store promises in array
				for (var i=0; i<files.length; i++) {
					readers.push(readFileAsText(files[i]))
				}
				//Trigger promises
				Promise.all(readers).then((values) => {
					if(checkCompatibility(values) === 0) {
						dataSeed = getSeed()
						console.log(values)
						var raw_presets = '{"presets":['
						for (var i=0; i<values.length; i++) {
							raw_presets += values[i]
							if (i != (values.length - 1)) {
								raw_presets += ','
							}
						}
						raw_presets += ']}'
						console.log(raw_presets)
						post('/create', {presets: raw_presets, seed: dataSeed})
					}
				})
			}

			$('#viewCiv').on('click touchstart', function() {
				$(this).val('')
			})

			document.getElementById('viewCiv').addEventListener('change', onChange)
		}());
	}

	buildForm.appendChild(buildButton)
	buildForm.appendChild(viewButton)
	buildForm.appendChild(editButton)
	buildForm.appendChild(combineButton)

	document.getElementsByTagName('body')[0].appendChild(buildForm)
}

var btn1 = document.getElementById('generateButton')
if (btn1) {
	document.getElementById('generateButton').addEventListener('click', generateRandom)
}


var btn2 = document.getElementById('startDraft')
if (btn2) {
	document.getElementById('startDraft').addEventListener('click', startaDraft)
}

var btn6 = document.getElementById('startBuild')
if (btn6) {
	document.getElementById('startBuild').addEventListener('click', startaBuild)
}

var btn3 = document.getElementById('home')
if (btn3) {
	btn3.addEventListener('click', function() {
		if (document.getElementsByClassName('draft_form').length != 0) {
			document.getElementsByClassName('draft_form')[0].remove()
		}
		if (document.getElementById('generateButton')) {
			document.getElementById('generateButton').remove()
		}
		if (document.getElementById('startBuild')) {
			document.getElementById('startBuild').remove()
		}
		if (document.getElementById('startDraft')) {
			document.getElementById('startDraft').remove()
		}
		if (document.querySelector('#spacer')) {
			document.querySelector('#spacer').remove()
		}
		if (document.querySelector('#spacer')) {
			document.querySelector('#spacer').remove()
		}
		if (document.getElementById('instructionsbox')) {
			document.getElementById('instructionsbox').remove()
		}
		if (document.getElementById('buildForm')) {
			document.getElementById('buildForm').remove()
		}

		var page = document.getElementById('page')

		var generateButton = document.createElement('button')
		generateButton.id = 'generateButton'
		generateButton.innerHTML = 'Random Civilizations'

		var spacer1 = document.createElement('div')
		spacer1.id = 'spacer'
		var spacer2 = document.createElement('div')
		spacer2.id = 'spacer'

		var or = document.createElement('button')
		or.id = 'startBuild'
		or.innerHTML = 'Build Civilization'

		var startDraft = document.createElement('button')
		startDraft.id = 'startDraft'
		startDraft.innerHTML = 'Create Draft'

		page.appendChild(generateButton)
		page.appendChild(spacer1)
		page.appendChild(or)
		page.appendChild(spacer2)
		page.appendChild(startDraft)

		document.getElementById('generateButton').addEventListener('click', generateRandom)
		document.getElementById('startDraft').addEventListener('click', startaDraft)
		document.getElementById('startBuild').addEventListener('click', startaBuild)
	})
}

var btn4 = document.getElementById('help')
if (btn4) {
	btn4.addEventListener('click', function() {
		if (document.getElementsByClassName('draft_form').length != 0) {
			document.getElementsByClassName('draft_form')[0].remove()
		}
		if (document.getElementById('generateButton')) {
			document.getElementById('generateButton').remove()
		}
		if (document.getElementById('startBuild')) {
			document.getElementById('startBuild').remove()
		}
		if (document.getElementById('startDraft')) {
			document.getElementById('startDraft').remove()
		}
		if (document.querySelector('#spacer')) {
			document.querySelector('#spacer').remove()
		}
		if (document.querySelector('#spacer')) {
			document.querySelector('#spacer').remove()
		}
		if (document.getElementById('instructionsbox')) {
			document.getElementById('instructionsbox').remove()
		}
		if (document.getElementById('buildForm')) {
			document.getElementById('buildForm').remove()
		}

		var page = document.getElementById('page')

		var instructionsbox = document.createElement('div')
		instructionsbox.id = 'instructionsbox'

		var instructionstitle = document.createElement('p')
		instructionstitle.id = 'instructionstitle'
		instructionstitle.innerHTML = '<iframe allow="fullscreen;" width="800" height="450" src="https://www.youtube.com/embed/JNQdYs9Tl5w"></iframe><br><iframe allow="fullscreen;" width="800" height="450" src="https://youtube.com/embed/2eVGyL93Wmk"</iframe><br><br><b>Publication Instructions:</b><br>'

		var instructionstext = document.createElement('p')
		instructionstext.id = 'instructionstext'
		instructionstext.innerHTML = '1. Click the Download Button (\"Random Civilizations\" on homepage, or \"Download Mod\" after completing a draft) and extract the .zip file<br><br>' +
			'2. Log-in to ageofempires.com<br><br>' +
			'3. Go to Mods → Submit a Mod<br><br>' +
			'4. Fill out the form as you wish with the following specifications:<br>&emsp;&emsp;A) Game = Age of Empires II DE,<br>&emsp;&emsp;B) Type = Data Mod,<br>&emsp;&emsp;C) Tags = Data Mod,<br>' +
				'&emsp;&emsp;D) Images = thumbnail.jpg found in extracted folder,<br>&emsp;&emsp;E) Zip File Upload = [id]-data.zip found in extracted folder,<br>&emsp;&emsp;F) Please credit me or the website!<br><br>' +
			'5. Submit the data mod, and go to Mods → Submit a Mod again to publish the UI Mod<br><br>' +
			'6. Fill out the form as you wish with the following specifications:<br>&emsp;&emsp;A) Game = Age of Empires II DE,<br>&emsp;&emsp;B) Type = User Interface,<br>&emsp;&emsp;C) Tags = User Interface,<br>' +
				'&emsp;&emsp;D) Images = thumbnail.jpg,<br>&emsp;&emsp;E) Zip File Upload = [id]-ui.zip found in extracted folder,<br>&emsp;&emsp;F) Please credit me or the website!<br><br>' +
			'7. Submit the UI mod, go to Mods → My Mods, and share the links with the other players!'

		instructionsbox.appendChild(instructionstitle)
		instructionsbox.appendChild(instructionstext)

		page.appendChild(instructionsbox)
	})
}

var btn5 = document.getElementById('about')
if (btn5) {
	btn5.addEventListener('click', function() {
		if (document.getElementsByClassName('draft_form').length != 0) {
			document.getElementsByClassName('draft_form')[0].remove()
		}
		if (document.getElementById('generateButton')) {
			document.getElementById('generateButton').remove()
		}
		if (document.getElementById('startBuild')) {
			document.getElementById('startBuild').remove()
		}
		if (document.getElementById('startDraft')) {
			document.getElementById('startDraft').remove()
		}
		if (document.querySelector('#spacer')) {
			document.querySelector('#spacer').remove()
		}
		if (document.querySelector('#spacer')) {
			document.querySelector('#spacer').remove()
		}
		if (document.getElementById('instructionsbox')) {
			document.getElementById('instructionsbox').remove()
		}
		if (document.getElementById('buildForm')) {
			document.getElementById('buildForm').remove()
		}

		var page = document.getElementById('page')

		var instructionsbox = document.createElement('div')
		instructionsbox.id = 'instructionsbox'

		var instructionstext = document.createElement('p')
		instructionstext.id = 'instructionstext'
		instructionstext.innerHTML = '&emsp;&emsp;&emsp;&emsp;This is an easy-to-use tool for creating civilizations for Age of Empires II DE. Although more complex mods can be made with the Advanced Genie Editor, ' +
			'it takes time to learn and does not have any multiplayer capabilities!<br><br>' +
			'&emsp;&emsp;&emsp;&emsp;There are three options on this website -- Randomized Civilizations, Civilization Building, and Civilization Drafting. Randomized Civilizations will scramble the bonuses, tech trees, ' +
			'unique units, and much more for all factions at the click of the button. Each click will download a .zip file which contains two mod .zip files inside -- one for the data mod and one for the UI mod. You ' +
			'can extract these and put them in your local mods folder, or publish them on the Mod Workshop by following the instructions given in the \"Help\" page. Please credit this website in the description ' +
			'of your mod so that others can enjoy this site too!<br><br>' +
			'&emsp;&emsp;&emsp;&emsp;For a singleplayer experience (or maximum combo-power), you can create your own civilizations with any of the bonuses/techs/etc. in the base-game or created by me. If you want to ' +
			'create your own bonuses, you\'ll have to learn how to use the Advanced Genie Editor (or send me a suggestion on discord at Krakenmeister#1672, and I might add it!). Once you build a civilization, you can ' +
			'download the preset as a .json file. You can view civilizations from their .json preset file, as well as combine multiple presets into a single mod containing those civilizations. After combining, the mod ' +
			'can be downloaded and published just like the randomized civilizations. Note that there are a few techs and bonuses, that if shared among multiple civilizations while combining, cause compatibility issues. ' +
			'UI mod issues are extremely minor and have no affect on gameplay, but data mod issues are critical and are not available to download.<br><br>' +
			'&emsp;&emsp;&emsp;&emsp;If you want to play a game with friends, one player has to create the draft. 250 tech tree points is recommended to force players to choose somewhat between strategies, but most ' +
			'vanilla tech trees are more diverse and would require 300-350 tech tree points to create. If you plan on playing in teams, I recommend all players use their team name when joining the lobby (not as their ' +
			'civilization name). When picking your tech trees, note that the player that spends the least points gets first pick in the drafting phases (and most points gets last pick). However, castle techs and team ' +
			'bonuses are picked in reverse order. If you choose to \"refill\" on your turn, the board will draw new cards into empty slots, but you will only be able to pick from the newly drawn cards. If you chosse ' +
			'to \"clear\" on your turn, all cards will be refreshed, but you will receive three random choices. In-game, you can view other players\' civilizations by clicking on their name or flag. Once ' +
			'everyone has finished picking team bonuses, the data and UI mods can be downloaded and published just like the randomized civilizations.<br><br>' +
			'&emsp;&emsp;&emsp;&emsp;This website was created under Microsoft\'s \"Game Content Usage Rules\" using assets from Age of Empires II, and is not endorsed by or affiliated with Microsoft. Age of Empires II ' +
			'© Microsoft Corporation. I would also like to give a huge thank you to HSZemi for his work with aoe2techtree.net which was used to create the in-game display of civilization tech trees. In addition, the ' +
			'auto-mods and captains mode projects were the launching point for this project. Spirit of the Law\'s videos on creating OP Civs were genius and the main source of inspiration for the website. Many thanks to ' +
			'Garrus Valkyrin for his contributions on the thumbnail, his time playtesting, and his faith in the project at its earliest stages!<br><br>' +
			'Project is <a href="https://github.com/Krakenmeister/AoE2-Civbuilder">open source</a>. Also, please consider <a href="https://www.buymeacoffee.com/krakenmeister">supporting</a> the website, thank you!'

		instructionsbox.appendChild(instructionstext)

		page.appendChild(instructionsbox)
	})
}

var btn7 = document.getElementById('updates')
if (btn7) {
	btn7.addEventListener('click', function() {
		if (document.getElementsByClassName('draft_form').length != 0) {
			document.getElementsByClassName('draft_form')[0].remove()
		}
		if (document.getElementById('generateButton')) {
			document.getElementById('generateButton').remove()
		}
		if (document.getElementById('startBuild')) {
			document.getElementById('startBuild').remove()
		}
		if (document.getElementById('startDraft')) {
			document.getElementById('startDraft').remove()
		}
		if (document.querySelector('#spacer')) {
			document.querySelector('#spacer').remove()
		}
		if (document.querySelector('#spacer')) {
			document.querySelector('#spacer').remove()
		}
		if (document.getElementById('instructionsbox')) {
			document.getElementById('instructionsbox').remove()
		}
		if (document.getElementById('buildForm')) {
			document.getElementById('buildForm').remove()
		}

		var page = document.getElementById('page')

		var instructionsbox = document.createElement('div')
		instructionsbox.id = 'instructionsbox'

		var instructionstitle = document.createElement('p')
		instructionstitle.id = 'instructionstitle'
		instructionstitle.innerHTML = '<b>Update Log:</b><br>'

		var instructionstext = document.createElement('p')
		instructionstext.id = 'instructionstext'
		instructionstext.innerHTML = '' +
			'<b>01-16-2022</b><br>' +
			'&emsp;&emsp;• Warrior monks now also benefit from monk bonuses unique to civbuilder, Inquisition increases their attack rate<br><br>' +
			'<b>01-15-2022</b><br>' +
			'&emsp;&emsp;• Fixed the filter input location while editing civilizations<br><br>' +
			'<b>01-13-2022</b><br>' +
			'&emsp;&emsp;• Bonuses, units, and techs can be filtered/searched for<br><br>' +
			'<b>01-12-2022</b><br>' +
			'&emsp;&emsp;• Fixed a bug causing some civilization links to become corrupted<br>' +
			'&emsp;&emsp;• Allowed civilization viewer and editor to read in .json files with empty values<br><br>' +
			'<b>01-11-2022</b><br>' +
			'&emsp;&emsp;• Civilizations can now be shared and viewed with direct links rather than .json files<br>' +
			'&emsp;&emsp;• Added the ability to edit civilization .json files<br><br>' +
			'<b>01-10-2022</b><br>' +
			'&emsp;&emsp;• Allowed most 0-cost techs to affect mod generation (techs that cannot affect generation are now untoggleable)<br><br>' +
			'<b>01-08-2022</b><br>' +
			'&emsp;&emsp;• Adjusted galley attack bonus to begin in Castle Age<br><br>' +
			'<b>01-07-2022</b><br>' +
			'&emsp;&emsp;• Fixed a bug causing the game to crash if the UI mod is enabled while playing with the 15th modded civilization<br><br>' +
			'<b>01-05-2022</b><br>' +
			'&emsp;&emsp;• Updated base data file to reflect changes in Update 56005<br>' +
			'&emsp;&emsp;• Fixed the cost of Varangian Guard<br>' +
			'&emsp;&emsp;• Updated Vanilla .json files to correspond to patch notes<br>' +
			'&emsp;&emsp;• Matched regional trade carts to civilization architecture set<br><br>' +
			'<b>11-14-2021</b><br>' +
			'&emsp;&emsp;• Added 35 new unique units<br><br>' +
			'<b>10-18-2021</b><br>' +
			'&emsp;&emsp;• Adjusted statistics of various custom unique units<br>' +
			'&emsp;&emsp;• Changed Flamethrower costs to require the gold payment shown in the description<br><br>' +
			'<b>10-17-2021</b><br>' +
			'&emsp;&emsp;• Fixed various typos<br>' +
			'&emsp;&emsp;• Fixed Serjeants getting auto-upgraded doubly upon hitting Castle Age<br>' +
			'&emsp;&emsp;• Fixed villagers being unable to garrison in houses despite having the bonus<br>' +
			'&emsp;&emsp;• Connected empty trade cart graphics to civilization architecture<br>' +
			'&emsp;&emsp;• Fixed a bug allowing players to recruit dismounted Konniks for free when researching Anarchy or Marauders<br><br>' +
			'<b>10-16-2021</b><br>' +
			'&emsp;&emsp;• Updated base data file to reflect changes in Update 54480<br><br>' +
			'<b>09-10-2021</b><br>' +
			'&emsp;&emsp;• Added Xolotl Warriors, Saboteurs, Ninjas, and Flamethrowers as unique units<br><br>' +
			'<b>09-09-2021</b><br>' +
			'&emsp;&emsp;• Added Crusader Knights as a unique unit<br>' +
			'&emsp;&emsp;• Adjusted Farimba to give only +3 attack<br>' +
			'&emsp;&emsp;• Fixed free archer-line upgrades bonus so that it works on crossbows<br><br>' +
			'<b>09-05-2021</b><br>' +
			'&emsp;&emsp;• Made Korean stone mining civ bonus affect Polish stone mining gold generation<br><br>' +
			'<b>09-03-2021</b><br>' +
			'&emsp;&emsp;• Added more symbols to the flag creator<br><br>' +
			'<b>08-22-2021</b><br>' +
			'&emsp;&emsp;• Increased trade units\' work rates along with their speed<br><br>' +
			'<b>08-14-2021</b><br>' +
			'&emsp;&emsp;• Fixed a bug causing units in a couple of bonuses to not get the bonus damage they deserved<br><br>' +
			'<b>08-12-2021</b><br>' +
			'&emsp;&emsp;• Updated to include and integrate Dawn of the Dukes update<br>' +
			'&emsp;&emsp;• Reverted ballista elephants back to cavalry class so that cavalry blacksmith upgrades affect them<br>' +
			'&emsp;&emsp;• Fixed an issue causing unique units recruited from Donjons to get extra stats in Castle Age<br>' +
			'&emsp;&emsp;• Increased the upper range of how many resources stone and gold piles can generate with (in random costs)<br><br>' +
			'<b>07-01-2021</b><br>' +
			'&emsp;&emsp;• Architecture choice now affects king and monk graphics, as well as garrison building flag positioning<br><br>' +
			'<b>06-30-2021</b><br>' +
			'&emsp;&emsp;• Added an option to give civilizations multiple unique techs for manually customized .json files (multiple entries in 3rd and 4th \"bonuses\" array)<br><br>' +
			'<b>06-29-2021</b><br>' +
			'&emsp;&emsp;• Added an option to give civilizations multiple team bonuses for manually customized .json files (multiple entries in the final \"bonuses\" array)<br><br>' +
			'<b>06-27-2021</b><br>' +
			'&emsp;&emsp;• Starting with an Eagle scout can be enabled by fully disabling the Stable in the tech tree (otherwise civs will start with a normal scout)<br>' +
			'&emsp;&emsp;• Fixed Imperial Scorpions so that they can be affected by Rocketry<br>' +
			'&emsp;&emsp;• Fixed a bug causing unique units not to get Logistica\'s bonus vs. infantry in some cases<br>' +
			'&emsp;&emsp;• Fixed a bug causing Royal Lancers, Royal Battle Elephants, and Imperial Skirmishers to enable in some cases despite the team bonus not being active<br><br>' +
			'<b>06-25-2021</b><br>' +
			'&emsp;&emsp;• Resolved an issue causing civs with War Elephants to get a Mameluke icon in the selection screen and vice versa<br>' +
			'&emsp;&emsp;• Fixed a bug causing Forced Levy and Kamandaran to give players gold if those units were also discounted<br><br>' +
			'<b>06-24-2021</b><br>' +
			'&emsp;&emsp;• Decreased mod ID collisions by a factor of 300,000,000<br>' +
			'&emsp;&emsp;• Added support for games running in different languages (only English descriptions available still but now they will always be displayed)<br>' +
			'&emsp;&emsp;• Shatagni can apply to Janissaries now<br>' +
			'&emsp;&emsp;• Fixed a bug that gave Royal Lancers 13 bonus damage vs. siege instead of 13 attack<br><br>' +
			'<b>06-23-2021</b><br>' +
			'&emsp;&emsp;• Changed mod ID generation to avoid collisions<br><br>' +
			'<b>06-22-2021</b><br>' +
			'&emsp;&emsp;• Thanks to this wonderful community\'s generosity, the server is greatly improved!<br>' +
			'&emsp;&emsp;• Added better maintenance to avoid killing ongoing drafts<br>' +
			'&emsp;&emsp;• Fixed a fatal bug when new bonuses were disabled during drafting<br><br>' +
			'<b>06-21-2021</b><br>' +
			'&emsp;&emsp;• Added very rare Easter eggs to random cost generation<br><br>' +
			'<b>06-17-2021</b><br>' +
			'&emsp;&emsp;• Randomizing unit costs will now also randomize how much resources trees, stones, boars, etc. hold (stones and golds abundance usually increased)<br><br>' +
			'<b>06-13-2021</b><br>' +
			'&emsp;&emsp;• Added 40 new team bonuses<br>' +
			'&emsp;&emsp;• Reworked tech discount bonuses so that they depend on the techs\' costs rather than fixed values (only matters in random cost generation)<br><br>' +
			'<b>06-10-2021</b><br>' +
			'&emsp;&emsp;• Added an option to randomize both civilizations and costs (generation is less varied than [SE] Random Costs mod i.e. nothing costs 1 wood; ' +
			'costs of the same unit/building do not change between ages and upgrades)<br><br>' +
			'<b>06-08-2021</b><br>' +
			'&emsp;&emsp;• Fixed a bug causing Elite Steppe Lancers not to be considered "mounted units"<br>' +
			'&emsp;&emsp;• Fixed a bug that caused Eagle Scouts to be enabled for all civs<br><br>' +
			'<b>06-07-2021</b><br>' +
			'&emsp;&emsp;• Added 50 new civilization bonuses<br>' +
			'&emsp;&emsp;• Added option to include vanilla civilizations in created mods (thank you to TheRevanReborn for recreating every civ in the builder!)<br><br>' +
			'<b>06-06-2021</b><br>' +
			'&emsp;&emsp;• Fixed a bug in Ironclad tech allocation<br>' +
			'&emsp;&emsp;• Fixed an issue that was causing the 8th and 9th combined civilizations to swap tech trees and unique unit icons<br><br>' +
			'<b>06-05-2021</b><br>' +
			'&emsp;&emsp;• Architecture selection now actually affects in-game graphics<br><br>' +
			'<b>06-03-2021</b><br>' +
			'&emsp;&emsp;• Added architecture selection<br>' +
			'&emsp;&emsp;• Fixed a bug in reshuffling cards during drafting<br>' +
			'&emsp;&emsp;• Fixed a bug in Teuton armor bonus<br>' +
			'&emsp;&emsp;• Reverted bonus changes to keep everything except blacksmith vils in-line with DE<br>' +
			'&emsp;&emsp;• Added name checking to civilization names<br>'

		instructionsbox.appendChild(instructionstitle)
		instructionsbox.appendChild(instructionstext)

		page.appendChild(instructionsbox)
	})
}

var invitebutton = document.getElementById('discordinvite')

invitebutton.onclick = function () {
	location.href = "https://discord.gg/vQxck6JDwf"
}
