const hometext = `<div style='font-size:2rem'>Showmatch II</div><br>
<div>&emsp;&emsp;The second Civbuilder Showmatch takes place on March 5th, at 20:00 GMT. Ganji and D3rp will be playing 5 games with their own civilizations.</div>`

const formattext = `<div style='font-size:2rem'>Format</div><br>
<div>&emsp;&emsp;The series will be played as a best of 5 games, all 5 games played. Each game earns the winner $25.
The winner of the overall series will receive all donations made to the showmatch.
<br><br>
&emsp;&emsp;All settings are the same as Random Map 1v1: Conquest, 2 player map, 200 population, no treaty, etc. Laming is allowed in all cases.
Games will be restarted only if there is a technical difficulty.
<br><br>
&emsp;&emsp;The following maps are included in the map pool for players to pick from: Acropolis, <a href='https://aoe2map.net/map/0b047e/marsh-madness'>Marsh Madness</a>,
<a href='https://aoe2map.net/map/30a4d7/zetnuss-hyperrandom'>HyperRandom</a>, Land Nomad, Golden Pit, Black Forest. Game 1 will take place on Hideout.
For each following game, the loser of the previous game gets to pick the map from the remaining unplayed maps in the map pool.
<br><br>
&emsp;&emsp;Each participant will submit a total of eight civilizations to the tournament host at least 24 hours before the showmatch begins (March 4th, 18:00 GMT).
All eight civilizations submitted cannot have any bonuses, unique units, unique techs, or team bonuses in common.
Before game 1, each player gets to ban one of their opponents’ civilizations (this occurs simultaneously). Civilizations from then on are hidden-pick with no repetitions allowed.</div>`

const coveragetext = `<div style='font-size:2rem'>Coverage</div><br>
<div>&emsp;&emsp;Main coverage for the tournament will be provided by Krakenmeister (host/sponsor) on <a href='https://twitch.tv/zkrakenmeister'>Twitch</a>. LordYorric will be
<a href='https://www.twitch.tv/lordyorric'>co-casting</a> with them as well. Other streamers' coverage is still to be determined.</div>`

const showmatchresultstext = `<div style='font-size:2rem'>Results</div><br>
<div>The games have yet to be played.</div>`

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
