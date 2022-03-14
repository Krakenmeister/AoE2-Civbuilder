const hometext = `<div style='font-size:2rem'>Showmatch I</div><br>
<div>&emsp;&emsp;I'm excited to announce and present the official Civbuilder showmatch! Have you ever wondered what top players could do with overpowered civilizations?
Well now's your chance to find out! Hallis and Modri will be playing 5 games at 18:00 GMT on Saturday, January 8th with their own civilizations.</div>`

const formattext = `<div style='font-size:2rem'>Format</div><br>
<div>&emsp;&emsp;The series will be played as a best of 5 games, all 5 games played. Each game earns the winner $25.
The winner of the overall series will receive all donations made to the showmatch.
<br><br>
&emsp;&emsp;Victory conditions will be set to Standard for all games. All other settings are typical Random Map settings (2 player map, 200 pop, no treaty, etc).
Each game will be played on the designated maps in the following order: Arena, Gold Rush, Islands, Nomad, Black Forest.
For Game 1, each player will play with the civilization they submitted. The loser of Game 1 will receive first pick of their opponents’ Game 2 civilizations.
The loser of Game 2 gets first pick for Game 3, and so on. This will continue until all 5 games have been played.</div>`

const coveragetext = `<div style='font-size:2rem'>Coverage</div><br>
<div>&emsp;&emsp;Main coverage for the tournament will be provided by LordYorric on <a href='https://twitch.tv/lordyorric'>Twitch</a> with Krakenmeister co-casting.
<a href='https://www.twitch.tv/twestaoe'>T-West</a> and <a href='https://www.twitch.tv/ornlu_aoe'>Ornlu the Wolf</a> will also be casting together, each streaming individually.
All of the matches were uploaded by T-West to <a href='https://www.youtube.com/watch?v=3oiXPoS8Zpc'>YouTube</a> as well.</div>`

const showmatchresultstext = `<div style='font-size:2rem'>Results</div><br>
<div>&emsp;&emsp;The final score was Modri 3 - 2 Hallis, with Hallis winning games 2 and 3 and Modri winning games 1, 4, and 5.
Here you can download the <a href='https://www.ageofempires.com/mods/details/49049/'>data mod</a> and <a href='https://www.ageofempires.com/mods/details/49050/'>UI mod</a> to play with the civilizations they created for the games.</div>`

window.onload = function () {
	let eventhomecontent = document.createElement('div')
	eventhomecontent.setAttribute('class', 'eventcontentbox')
	eventhomecontent.innerHTML = hometext
	document.getElementById('contentwrapper').appendChild(eventhomecontent)
}

document.getElementById('showmatchresults').addEventListener('click', function () {
	let contentwrapper = document.getElementById('contentwrapper')
	while (contentwrapper.lastElementChild) {
		contentwrapper.removeChild(contentwrapper.lastElementChild)
	}

	let showmatchresultscontent = document.createElement('div')
	showmatchresultscontent.setAttribute('class', 'eventcontentbox')
	showmatchresultscontent.innerHTML = showmatchresultstext
	contentwrapper.appendChild(showmatchresultscontent)
})
