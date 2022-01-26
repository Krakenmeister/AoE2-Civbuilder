document.getElementById('personalemail').querySelector('.reveal').onclick = function () {
	document.getElementById('personalemail').querySelector('.reveal').innerHTML = 'johndmeo@gmail.com'
	document.getElementById('personalemail').querySelector('.reveal').style.cursor = 'text'
	document.getElementById('personalemail').querySelector('.reveal').onclick = () => {}
}

document.getElementById('krakenemail').querySelector('.reveal').onclick = function () {
	document.getElementById('krakenemail').querySelector('.reveal').innerHTML = 'kraken@krakenmeister.com'
	document.getElementById('krakenemail').querySelector('.reveal').style.cursor = 'text'
	document.getElementById('krakenemail').querySelector('.reveal').onclick = () => {}
}

document.getElementById('discord').querySelector('.reveal').onclick = function () {
	document.getElementById('discord').querySelector('.reveal').innerHTML = 'Krakenmeister#1672'
	document.getElementById('discord').querySelector('.reveal').style.cursor = 'text'
	document.getElementById('discord').querySelector('.reveal').onclick = () => {}
}

document.getElementById('discordserver').querySelector('.reveal').onclick = function () {
	window.location.href = 'https://discord.gg/vQxck6JDwf'
}

