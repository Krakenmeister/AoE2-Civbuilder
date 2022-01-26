//Initiliaze civ preset
var civ = {}
civ['alias'] = ''
//Palette (color1, color2, color3, color4, color5), division, overlay, symbol
civ['flag_palette'] = [3, 4, 5, 6, 7, 3, 3, 3]
//Units, buildings, techs
civ['tree'] = [
	[13, 17, 21, 74, 545, 539, 331, 125, 83, 128, 440],
	[12, 45, 49, 50, 68, 70, 72, 79, 82, 84, 87, 101, 103, 104, 109, 199, 209, 276, 562, 584, 598, 621, 792],
	[22, 101, 102, 103, 408]
]
civ['bonuses'] = [[], [], [], [], []]
civ['architecture'] = 1

var roundType = 0
var cardSize = 6
var marginSize = 0.6

const num_cards = [287, 79, 39, 39, 75]
const max_sizes = [6, 1, 1, 1, 1]

renderPhase1()

function setTechTree (tree) {
	civ['tree'] = tree
}

//Display Flag Creator
function renderPhase1 () {
	$('body').contents().not('script').remove()

	var wrapping = document.createElement('div')
	wrapping.id = 'wrapping'

	var flagbox = document.createElement('div')
	flagbox.className = 'flagbox'

	var header = document.createElement('div')
	header.id = 'header'
	header.innerHTML = 'Flag Creator'

	var contain = document.createElement('div')
	contain.id = 'contain'

	var pickGrid = document.createElement('div')
	pickGrid.id = 'pickGrid'

	var flagDiv = document.createElement('div')
	flagDiv.id = 'flagDiv'

	var canvas = document.createElement('canvas')
	canvas.id = 'flag'
	canvas.width = '256'
	canvas.height = '256'

	flagDiv.appendChild(canvas)

	var label = document.createElement('label')
	label.id = 'civlabel'
	label.setAttribute('for', 'alias')
	label.innerHTML = 'Civilization Name'

	var input = document.createElement('input')
	input.type = 'text'
	input.id = 'alias'
	input.name = 'civname'

	var next = document.createElement('button')
	next.className = 'readybutton'
	next.innerHTML = 'Next'
	next.onclick = function () {
		var inputbox = document.getElementById('alias')
		if (validate(inputbox.value)) {
			civ['alias'] = inputbox.value
			document.title = 'Civilization Builder - ' + civ['alias']
			renderPhase2()
			showTechtree(civ['tree'], -1, 3, 0, '')
		}
	}

	function getFun1(val) {
		return function() {
			civ['flag_palette'][val] = (civ['flag_palette'][val] - 1 + palette_sizes[val]) % palette_sizes[val]
			clientFlag(civ['flag_palette'], 'flag', 1)
		}
	}

	function getFun2(val) {
		return function() {
			civ['flag_palette'][val] = (civ['flag_palette'][val] + 1 + palette_sizes[val]) % palette_sizes[val]
			clientFlag(civ['flag_palette'], 'flag', 1)
		}
	}

	for (var i=0; i<8; i++) {
		var backbutton = document.createElement('button')
		backbutton.className = 'backbutton'
		backbutton.innerHTML = '<'
		backbutton.onclick = getFun1(i)

		var category = document.createElement('div')
		category.className = 'category'
		category.innerHTML = categories[i]

		var forwardbutton = document.createElement('button')
		forwardbutton.className = 'forwardbutton'
		forwardbutton.innerHTML = '>'
		forwardbutton.onclick = getFun2(i)

		pickGrid.appendChild(backbutton)
		pickGrid.appendChild(category)
		pickGrid.appendChild(forwardbutton)
	}

	var archbox = document.createElement('div')
	archbox.id = 'archbox'

	var architecturetext = document.createElement('div')
	architecturetext.id = 'architecturetext'
	architecturetext.innerHTML = architectures[civ['architecture']-1]

	var iconback = document.createElement('button')
	iconback.className = 'backbutton'
	iconback.innerHTML = '<'
	iconback.onclick = function () {
		civ['architecture'] = (((civ['architecture'] - 1) + 10) % 11) + 1
		document.getElementById('architecturetext').innerHTML = architectures[civ['architecture']-1]
	}

	var iconforward = document.createElement('button')
	iconforward.className = 'forwardbutton'
	iconforward.innerHTML = '>'
	iconforward.onclick = function () {
		civ['architecture'] = (((civ['architecture'] - 1) + 1) % 11) + 1
		document.getElementById('architecturetext').innerHTML = architectures[civ['architecture']-1]
	}

	archbox.appendChild(iconback)
	archbox.appendChild(architecturetext)
	archbox.appendChild(iconforward)

	contain.appendChild(pickGrid)
	contain.appendChild(flagDiv)

	flagbox.appendChild(header)
	flagbox.appendChild(contain)
	flagbox.appendChild(archbox)
	flagbox.appendChild(label)
	flagbox.appendChild(input)
	flagbox.appendChild(next)

	wrapping.appendChild(flagbox)

	document.getElementsByTagName('body')[0].appendChild(wrapping)
	clientFlag(civ['flag_palette'], 'flag', 1)
}

//Display bonus selection
function renderPhase2() {
	$('body').contents().not('script').remove()

	var techtreestyles = document.getElementById('tech_styles')
	if (typeof(techtreestyles) != 'undefined' && techtreestyles != null) {
		techtreestyles.remove()
	}

	document.body.style.backgroundImage = "url('/draftbackground.jpg')"

	var sideheader = document.createElement('div')
	sideheader.id = 'sideheader'

	var phase = document.createElement('h1')
	phase.id = 'sidephase'

	var buttonleft = document.createElement('div')
	buttonleft.id = 'buttonleft'
	buttonleft.innerHTML = '<'
	buttonleft.onclick = function () {
		roundType = (roundType + 4) % 5
		renderPhase2()
	}

	var buttonright = document.createElement('div')
	buttonright.id = 'buttonright'
	buttonright.innerHTML = '>'
	buttonright.onclick = function () {
		roundType = (roundType + 1) % 5
		renderPhase2()
	}

	//Display which round the drafting is in
	if (roundType == 0) {
		phase.innerHTML = 'Civilization Bonuses'
	} else if (roundType == 1) {
		phase.innerHTML = 'Unique Units'
	} else if (roundType == 2) {
		phase.innerHTML = 'Castle Unique Tech'
	} else if (roundType == 3) {
		phase.innerHTML = 'Imperial Unique Tech'
	} else if (roundType == 4) {
		phase.innerHTML = 'Team Bonuses'
	}
	sideheader.appendChild(buttonleft)
	sideheader.appendChild(phase)
	sideheader.appendChild(buttonright)

	var game = document.createElement('div')
	game.id = 'game'

	var players = document.createElement('div')
	players.id = 'players'

	//Size cards depending on slider
	var sliderbox = document.createElement('div')
	sliderbox.id = 'sliderbox'
	sliderbox.style.top = '300px'

	var slidertext = document.createElement('div')
	slidertext.id = 'slidertext'
	slidertext.innerHTML = 'Card Size:'

	var sliderslider = document.createElement('input')
	sliderslider.id = 'sliderslider'
	sliderslider.type = 'range'
	sliderslider.min = '3'
	sliderslider.max = '16'
	sliderslider.step = '0.1'
	sliderslider.value = '6'
	sliderslider.oninput = function () {
		cardSize = parseInt(sliderslider.value, 10)
		marginSize = parseInt(sliderslider.value, 10)/10
		for (var i=0; i<num_cards[roundType]; i++) {
			var resized_card = document.getElementById('card' + i)
			resized_card.style.width = cardSize + 'rem'
			resized_card.style.height = cardSize + 'rem'
			resized_card.style.margin = marginSize + 'rem'
			if (civ['bonuses'][roundType].includes(i)) {
				resized_card.style.outline = (cardSize * (22/256)) + 'rem solid rgba(0, 255, 0, 0.7)'
				resized_card.style.outlineOffset = '-' + (cardSize * (22/256)) + 'rem'
			}
			resized_card.onmouseover = getFun3(card_descriptions[roundType][i], i, cardSize, [0, 255, 0, 0.7])
			resized_card.onmouseout = getFun4(i)
			resized_card.onclick = getFun5(i, cardSize)
		}
	}

	//Add filtering to cards
	var filterbox = document.createElement('div')
	filterbox.id = 'filterbox'
	filterbox.style.top = '395px'
	filterbox.style.left = '2vw'
	filterbox.style.width = '100%'
	filterbox.style.padding = '0'
	filterbox.style.flexDirection = 'row'

	var filtertext = document.createElement('div')
	filtertext.id = 'filtertext'
	filtertext.innerHTML = 'Filter:'

	var filterinput = document.createElement('input')
	filterinput.id = 'filterinput'
	filterinput.type = 'text'
	filterinput.onkeyup = function () {
		var filter = document.getElementById('filterinput').value.toLowerCase()
		if (filter == '') {
			for (var i=0; i<num_cards[roundType]; i++) {
				document.getElementById('card' + i).style.display = 'block'
			}
		} else {
			for (var i=0; i<num_cards[roundType]; i++) {
				var card = document.getElementById('card' + i)
				if (card_descriptions[roundType][i].toLowerCase().includes(filter)) {
					card.style.display = 'block'
				} else {
					card.style.display = 'none'
				}
			}
		}
	}

	filterbox.appendChild(filtertext)
	filterbox.appendChild(filterinput)
	players.appendChild(filterbox)

	//Show player information to the left of the board
	var player = document.createElement('div')
	player.className = 'playercard'
	player.id = 'player'
	player.style.cursor = 'pointer'
	player.style.position = 'fixed'
	player.style.left = '0'
	player.style.top = '200px'
	player.style.width = '18vw'
	player.style.marginLeft = '2vw'
	player.onclick = function () {
		//Show tech tree
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
			description += '•'
			description += card_descriptions[2][civ['bonuses'][2][0]]
			description += '<br>'
		}
		if (civ['bonuses'][3].length != 0) {
			description += '•'
			description += card_descriptions[3][civ['bonuses'][3][0]]
			description += '<br>'
		}
		description += '<br><span><b>Team Bonus:</b></span><br>'
		if (civ['bonuses'][4].length != 0) {
			for (var j=0; j<civ['bonuses'][4].length; j++) {
				description += card_descriptions[4][civ['bonuses'][4][j]]
				description += '<br>'
			}
		}
		showTechtree(civ['tree'], -1, 3, 0, description)
	}

	var image = document.createElement('div')
	image.className = 'image'

	var text = document.createElement('div')
	text.className = 'text'

	var canvas = document.createElement('canvas')
	canvas.id = 'flag'
	canvas.width = '85'
	canvas.height = '85'
	canvas.className = 'flag'

	var alias = document.createElement('div')
	alias.className = 'alias'
	if (civ['alias'].length > 10) {
		alias.style.fontSize = 3.3 * Math.exp(-1 * (civ['alias'].length/25)) + 'vw'
		alias.style.lineHeight = 2.6 * Math.exp(-1 * (civ['alias'].length/25)) + 'vw'
	}
	alias.innerHTML = civ['alias']
	player.style.height = '95px'

	image.appendChild(canvas)
	text.appendChild(alias)

	player.appendChild(image)
	player.appendChild(text)

	sliderbox.appendChild(slidertext)
	sliderbox.appendChild(sliderslider)

	players.appendChild(player)
	players.appendChild(sliderbox)

	var board = document.createElement('div')
	board.id = 'board'

	//Outline hovered card and display help text
	function getFun3 (text, cardId, size, colour) {
		return function () {
			var hover_card = document.getElementById('card' + cardId)
			hover_card.style.outline = (size * (22/256)) + 'rem solid rgba(' + colour[0] + ', ' + colour[1] + ', ' + colour[2] + ', ' + colour[3] + ')'
			hover_card.style.outlineOffset = '-' + (size * (22/256)) + 'rem'
			var help = document.getElementById('helpboxcontainer')
			help.style.visibility = 'visible'
			var helptext = document.getElementById('helpboxtext')
			helptext.style.fontSize = '80px'
			helptext.innerHTML = text
			fitText('helpboxtext')
			var finish_button = document.getElementById('refill')
			finish_button.style.visibility = 'hidden'
			var share_button = document.getElementById('clear')
			share_button.style.visibility = 'hidden'
		}
	}

	//Hide outline and help text
	function getFun4 (cardId) {
		return function () {
			if (!civ['bonuses'][roundType].includes(cardId)) {
				var hover_card = document.getElementById('card' + cardId)
				hover_card.style.outline = 'none'
			}
			var help = document.getElementById('helpboxcontainer')
			help.style.visibility = 'hidden'
			var finish_button = document.getElementById('refill')
			finish_button.style.visibility = 'visible'
			var share_button = document.getElementById('clear')
			share_button.style.visibility = 'visible'
		}
	}

	//Select card
	function getFun5 (cardId, size) {
		return function () {
			activated_card = document.getElementById('card' + cardId)
			if (civ['bonuses'][roundType].includes(cardId)) {
				var index = civ['bonuses'][roundType].indexOf(cardId)
				civ['bonuses'][roundType].splice(index, 1)
				activated_card.style.outline = 'none'
			} else {
				if (civ['bonuses'][roundType].length >= max_sizes[roundType]) {
					cleared_card = document.getElementById('card' + civ['bonuses'][roundType][0])
					cleared_card.style.outline = 'none'
					civ['bonuses'][roundType].shift()
				}
				activated_card.style.outline = (size * (22/256)) + 'rem solid rgba(0, 255, 0, 0.7)'
				activated_card.style.outlineOffset = '-' + (size * (22/256)) + 'rem'
				civ['bonuses'][roundType].push(cardId)
			}
		}
	}

	function getNoFun () {
		return function () {}
	}

	//Add all cards stored in gamestate to the board
	for (var i=0; i<num_cards[roundType]; i++) {
		var card = document.createElement('div')
		card.className = 'card'
		card.id = 'card' + i
		card.style.width = cardSize + 'rem'
		card.style.height = cardSize + 'rem'
		card.style.margin = marginSize + 'rem'

		//Display graphics on the card
		var prefix
		if (roundType == 0) {
			prefix = 'bonus'
		} else if (roundType == 1) {
			prefix = 'uu'
		} else if (roundType == 2) {
			prefix = 'castle'
		} else if (roundType == 3) {
			prefix = 'imp'
		} else if (roundType == 4) {
			prefix = 'team'
		}
		var path = `${prefix}_${i}.png`
		var image = document.createElement('img')
		image.className = 'cardimage'
		image.src = '/cards/' + path
		card.appendChild(image)
		//Let player pick a card
		card.style.cursor = 'pointer'
		if (civ['bonuses'][roundType].includes(i)) {
			card.style.outline = (cardSize * (22/256)) + 'rem solid rgba(0, 255, 0, 0.7)'
			card.style.outlineOffset = '-' + (cardSize * (22/256)) + 'rem'
		}
		card.onmouseover = getFun3(card_descriptions[roundType][i], i, cardSize, [0, 255, 0, 0.7])
		card.onmouseout = getFun4(i)
		card.onclick = getFun5(i, cardSize)
		board.appendChild(card)
	}
	//Add finish button
	var boardtoolbar = document.createElement('div')
	boardtoolbar.id = 'boardtoolbar'
        boardtoolbar.style.top = '450px'
        boardtoolbar.style.left = '6.5vw'
        boardtoolbar.style.width = '13.5vw'
        boardtoolbar.style.padding = '0'
        boardtoolbar.style.flexDirection = 'column'
        boardtoolbar.style.alignItems = 'flex-start'

	var finish = document.createElement('div')
	finish.id = 'refill'
	finish.innerHTML = 'Finish'
	finish.style.margin = '0'
	finish.onclick = function () {downloadTextFile(JSON.stringify(civ), civ['alias'] + '.json')}

	var share = document.createElement('div')
	share.id = 'clear'
	share.innerHTML = 'Share'
	share.style.margin = '0'
	share.onclick = function () {
		console.log(encryptJson(civ))
		var sharebox = document.createElement('div')
		sharebox.id = 'sharebox'
		var view_text = document.createElement('div')
		view_text.innerHTML = 'View'
		view_text.setAttribute('class', 'sharetext')
		var linkwrapper1 = document.createElement('div')
		linkwrapper1.setAttribute('class', 'sharelink')
		var view_link = document.createElement('div')
		view_link.innerHTML = 'https://krakenmeister.com/view/' + encryptJson(civ)
		view_link.setAttribute('class', 'linktext')
		view_link.setAttribute('id', 'view_link')
		var copy_view = document.createElement('div')
		copy_view.innerHTML = 'Copy'
		copy_view.setAttribute('id', 'copy_view')
		copy_view.style.cursor = 'pointer'
		copy_view.onclick = function () {
			const copyText = document.createElement('textarea')
			copyText.value = document.getElementById('view_link').innerHTML
			document.body.appendChild(copyText)
			copyText.select();
			document.execCommand('copy')
			document.body.removeChild(copyText)
			document.getElementById('copy_view').innerHTML = 'Copied!'
			document.getElementById('copy_edit').innerHTML = 'Copy'
		}
		var edit_text = document.createElement('div')
		edit_text.innerHTML = 'Edit'
		edit_text.setAttribute('class', 'sharetext')
		var linkwrapper2 = document.createElement('div')
		linkwrapper2.setAttribute('class', 'sharelink')
		var edit_link = document.createElement('div')
		edit_link.innerHTML = 'https://krakenmeister.com/edit/' + encryptJson(civ)
		edit_link.setAttribute('class', 'linktext')
		edit_link.setAttribute('id', 'edit_link')
		var copy_edit = document.createElement('div')
		copy_edit.innerHTML = 'Copy'
		copy_edit.setAttribute('id', 'copy_edit')
		copy_edit.style.cursor = 'pointer'
		copy_edit.onclick = function () {
			const copyText = document.createElement('textarea')
			copyText.value = document.getElementById('edit_link').innerHTML
			document.body.appendChild(copyText)
			copyText.select();
			document.execCommand('copy')
			document.body.removeChild(copyText)
			document.getElementById('copy_edit').innerHTML = 'Copied!'
			document.getElementById('copy_view').innerHTML = 'Copy'
		}
		var done_sharing = document.createElement('div')
		done_sharing.innerHTML = 'Done'
		done_sharing.id = 'done_sharing'
		done_sharing.onclick = function () {
			document.getElementById('sharebox').remove()
		}
		linkwrapper1.appendChild(view_link)
		linkwrapper1.appendChild(copy_view)
		linkwrapper2.appendChild(edit_link)
		linkwrapper2.appendChild(copy_edit)

		sharebox.appendChild(view_text)
		sharebox.appendChild(linkwrapper1)
		sharebox.appendChild(edit_text)
		sharebox.appendChild(linkwrapper2)
		sharebox.appendChild(done_sharing)
		document.body.appendChild(sharebox)
	}

	boardtoolbar.appendChild(finish)
	boardtoolbar.appendChild(share)
	players.appendChild(boardtoolbar)

	//Add card description box
	var helpboxcontainer = document.createElement('div')
	helpboxcontainer.id = 'helpboxcontainer'
	helpboxcontainer.style.visibility = 'hidden'

	var helpbox = document.createElement('div')
	helpbox.id = 'helpbox'

	var helpboximage = document.createElement('img')
	helpboximage.id = 'helpboximage'
	helpboximage.src = '/helpbackground.png'

	var helpboxtext = document.createElement('div')
	helpboxtext.id = 'helpboxtext'

	helpbox.appendChild(helpboximage)
	helpbox.appendChild(helpboxtext)
	helpboxcontainer.appendChild(helpbox)
	document.getElementsByTagName('body')[0].appendChild(helpboxcontainer)

	game.appendChild(players)
	game.appendChild(board)

	document.getElementsByTagName('body')[0].appendChild(game)
	document.getElementsByTagName('body')[0].appendChild(sideheader)

	//Render flag
	clientFlag(civ['flag_palette'], 'flag', (85/256))
}
