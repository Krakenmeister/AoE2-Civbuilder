document.getElementById('personalemail').querySelector('.reveal').addEventListener('click', () => {
	document.getElementById('personalemail').querySelector('.reveal').innerHTML = 'johndmeo@gmail.com'
	document.getElementById('personalemail').querySelector('.reveal').style.cursor = 'text'
	document.getElementById('personalemail').querySelector('.reveal').addEventListener('click', () => {})
});

document.getElementById('krakenemail').querySelector('.reveal').addEventListener('click', () => {
	document.getElementById('krakenemail').querySelector('.reveal').innerHTML = 'kraken@krakenmeister.com'
	document.getElementById('krakenemail').querySelector('.reveal').style.cursor = 'text'
	document.getElementById('krakenemail').querySelector('.reveal').addEventListener('click', () => {})
});

document.getElementById('discord').querySelector('.reveal').addEventListener('click', () => {
	document.getElementById('discord').querySelector('.reveal').innerHTML = 'Krakenmeister#1672'
	document.getElementById('discord').querySelector('.reveal').style.cursor = 'text'
	document.getElementById('discord').querySelector('.reveal').addEventListener('click', () => {})
});

document.getElementById('linkedin').querySelector('.reveal').addEventListener('click', () => {
	window.location.href = 'https://www.linkedin.com/in/john-meo-06a4a223a/'
});

document.getElementById('project1').addEventListener('click', () => {
	window.location.href = 'https://krakenmeister.com/civbuilder'
});

document.getElementById('project2').addEventListener('click', () => {
	window.location.href = 'https://krakenmeister.com/arithmio'
});

document.getElementById('project3').addEventListener('click', () => {
	window.location.href = 'https://krakenmeister.com/pointilism'
});
