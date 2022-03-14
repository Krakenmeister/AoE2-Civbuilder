function removeChildren (elem) {
	while (elem.lastElementChild) {
		elem.removeChild(elem.lastElementChild)
	}
}

if (document.getElementById('eventhome')) {
	document.getElementById('eventhome').onclick = () => {
		removeChildren(document.getElementById('contentwrapper'))

		let eventhomecontent = document.createElement('div')
		eventhomecontent.setAttribute('class', 'eventcontentbox')
		eventhomecontent.innerHTML = hometext
		document.getElementById('contentwrapper').appendChild(eventhomecontent)
	}
}

if (document.getElementById('eventformat')) {
	document.getElementById('eventformat').onclick = () => {
		removeChildren(document.getElementById('contentwrapper'))

		let eventformatcontent = document.createElement('div')
		eventformatcontent.setAttribute('class', 'eventcontentbox')
		eventformatcontent.innerHTML = formattext
		document.getElementById('contentwrapper').appendChild(eventformatcontent)
	}
}

if (document.getElementById('eventsignup')) {
	document.getElementById('eventsignup').onclick = () => {
		removeChildren(document.getElementById('contentwrapper'))

		let eventsignupcontent = document.createElement('div')
		eventsignupcontent.setAttribute('class', 'eventcontentbox')
		eventsignupcontent.innerHTML = signuptext
		document.getElementById('contentwrapper').appendChild(eventsignupcontent)
	}
}

if (document.getElementById('eventcoverage')) {
	document.getElementById('eventcoverage').onclick = () => {
		removeChildren(document.getElementById('contentwrapper'))

		let eventcoveragecontent = document.createElement('div')
		eventcoveragecontent.setAttribute('class', 'eventcontentbox')
		eventcoveragecontent.innerHTML = coveragetext
		document.getElementById('contentwrapper').appendChild(eventcoveragecontent)
	}
}

if (document.getElementById('events')) {
	document.getElementById('events').addEventListener('click', function () {
		window.location.href = 'https://krakenmeister.com/events'
	})
}

if (document.getElementById('cardshowmatch1')) {
	document.getElementById('cardshowmatch1').addEventListener('click', function () {
		window.location.href = 'https://krakenmeister.com/showmatch1'
	})
}

if (document.getElementById('cardshowmatch2')) {
	document.getElementById('cardshowmatch2').addEventListener('click', function () {
		window.location.href = 'https://krakenmeister.com/showmatch2'
	})
}

if (document.getElementById('cardturbos')) {
	document.getElementById('cardturbos').addEventListener('click', function () {
		window.location.href = 'https://krakenmeister.com/turbos'
	})
}

if (document.getElementById('discordinvite')) {
	document.getElementById('discordinvite').addEventListener('click', function () {
		window.location.href = 'https://discord.gg/vQxck6JDwf'
	})
}

if (document.getElementById('home')) {
	document.getElementById('home').addEventListener('click', function () {
		window.location.href = 'https://krakenmeister.com/civbuilder'
	})
}
