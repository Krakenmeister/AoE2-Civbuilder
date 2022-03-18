const hometext = `<div style='font-size:2rem'>TURBOS</div><br>
<div>&emsp;&emsp;The Ultimate Random Build Order Showdown, also known as TURBOS, is a 2v2 Age of Empires II DE tournament.
Every game of the tournament will be played with a data mod that randomizes costs.
However, these mods will be made public one week before the tournament begins, allowing teams to prepare their own build orders and strategies.
<br><br>
&emsp;&emsp;Registration is open to everyone, and teams will be seeded into a single-elimination bracket based on average ranked 1v1 RM rating. Registration closes at midnight PST on March 11th.
<br><br>
&emsp;&emsp;In addition to the tournament, there is a $100 competition to speedrun completing a wonder with random costs.
Anyone can enter by simply submitting a replay of their game or recording of their gameplay.</div>`

const formattext = `<div style='font-size:2rem'>Format</div><br>
<div>&emsp;&emsp;Matches will be played in a single-elimination bracket.  The semi-finals and finals will be played as a best of 5 games, with all other matches being a best of 3 games.
The prize pool is split $150 awarded to the first place team and $50 to the second place team.
<br><br>
&emsp;&emsp;At midnight PST on March 12th, 5 data mods will be made public each with their own randomization of game costs. The 5 maps in the map pool will also be made public at that time.
Note that each map will always pair with a randomization, meaning playing on map #2 also means playing with randomization #2.
Game 1 of each set will always be played with map and randomization #1.
This pattern will continue until the match concludes, i.e. game 2 will be played with map and randomization #2, game 3 with randomization #3, etc.
Civilizations are hidden-pick with no repetitions allowed per player within a match.
Settings for all games will be identical to Ranked RM 2v2 – Conquest, 200 population, no treaty or time limit, etc.
<br><br>
&emsp;&emsp;For information about how the randomization/mod generation will be decided, refer to the <a href='https://docs.google.com/document/d/1IzZa9A3sz0CDcJdH_su0LUKIPMs9rVha9EjYuxsRFI4/edit?usp=sharing'>outline document</a></div>`

const signuptext = `<div style='font-size:2rem'>Registration</div><br>
<div>&emsp;&emsp;Organization for the tournament will be conducted through <a href='https://challonge.com/tournaments/signup/SEdWV0A5Ci#/signup/bexs8m583bv'>Challonge</a>.
Sign up is free and available to everyone, but make sure to link your AoE2 insights profile, as well as register under the same team name as your teammate.
Registration after March 11th (when mods are released) is discouraged, but allowed.
<b>You must check-in before the tournament starts</b> (check-in opens 1 hour before the tournament begins).</div>`

const coveragetext = `<div style='font-size:2rem'>Coverage</div><br>
<div>&emsp;&emsp;Main coverage for the tournament will be provided by Krakenmeister (host/sponsor) on <a href='https://twitch.tv/zkrakenmeister'>Twitch</a>. LordYorric will be
<a href='https://www.twitch.tv/lordyorric'>co-casting</a> with them as well. Other streamers' coverage is still to be determined.</div>`

const modstext = `<div style='font-size:2rem'>Costs and Maps</div><br>
<div style='text-align:center'>Game 1: Arabia, <a href='https://www.ageofempires.com/mods/details/53581/'>download</a><br>
Game 2: Arena, <a href='https://www.ageofempires.com/mods/details/53582/'>download</a><br>
Game 3: Megarandom, <a href='https://www.ageofempires.com/mods/details/53584/'>download</a><br>
Game 4: Hideout, <a href='https://www.ageofempires.com/mods/details/53585/'>download</a><br>
Game 5: Hyperrandom, <a href='https://www.ageofempires.com/mods/details/53586/'>download</a><br><br>
Any of these can be used for speedrun competition.</div>`

const leaderboardtext = `<div style='font-size:2rem'>Wonder Speedrun Competition</div><br>
<div>&emsp;&emsp;In addition to the tournament, there will be a $20 prize awarded to each player that can complete a wonder the fastest with randomized costs (so $100 total awarded to 5 winners).
In order to participate in the competition, submit a replay of your game to the tournament host at kraken@krakenmeister.com or on discord at Krakenmeister#1672.
You must use one of the 5 randomizations released on March 12th and can choose any civilization. You must play on Arena and start in the Dark Age with standard starting resources.
No cheat codes, outside data mods, or other game modifications can be made to gain an advantage. The use of UI mods is allowed.
<br><br>
&emsp;&emsp;Submissions to the competition open on March 12th and close at midnight PST on March 18th. Players may send in as many entries as they want.
The winner will be announced after the finals of the tournament conclude.</div>
<br><br>
<div style = 'font-size:1.8rem'>Current Standings:</div><br>
<div style='display:flex;width:100%;justify-content:space-between;font-size:1.2rem;'>
<div style='text-align:center'>
	<div>Mod 1</div><br>
	<div>1. 26:11 | dianteforlife</div>
</div>
<div style='text-align:center'>
	<div>Mod 2</div><br>
	<div>1. 23:34 | DancePartyGirl</div><br>
	<div>2. 24:34 | dianteforlife</div>
</div>
<div style='text-align:center'>
	<div>Mod 3</div><br>
	<div>1. 32:11 | DancePartyGirl</div><br>
	<div>2. 32:23 | dianteforlife</div>
</div>
<div style='text-align:center'>
	<div>Mod 4</div><br>
	<div>1. 26:23 | dianteforlife</div>
</div>
<div style='text-align:center'>
	<div>Mod 5</div><br>
	<div>1. 27:11 | DancePartyGirl</div><br>
	<div>2. 27:19 | dianteforlife</div><br>
	<div>3. 43:26 | JustPureLuck</div>
</div>
</div>`

window.onload = function () {
	let eventhomecontent = document.createElement('div')
	eventhomecontent.setAttribute('class', 'eventcontentbox')
	eventhomecontent.innerHTML = hometext
	document.getElementById('contentwrapper').appendChild(eventhomecontent)
}

document.getElementById('turbosmods').addEventListener('click', function () {
	let contentwrapper = document.getElementById('contentwrapper')
	while (contentwrapper.lastElementChild) {
		contentwrapper.removeChild(contentwrapper.lastElementChild)
	}

	let turbosmodscontent = document.createElement('div')
	turbosmodscontent.setAttribute('class', 'eventcontentbox')
	turbosmodscontent.innerHTML = modstext
	contentwrapper.appendChild(turbosmodscontent)
})

document.getElementById('turbosleaderboard').addEventListener('click', function () {
	let contentwrapper = document.getElementById('contentwrapper')
	while (contentwrapper.lastElementChild) {
		contentwrapper.removeChild(contentwrapper.lastElementChild)
	}

	let turbosleaderboardcontent = document.createElement('div')
	turbosleaderboardcontent.setAttribute('class', 'eventcontentbox')
	turbosleaderboardcontent.innerHTML = leaderboardtext
	contentwrapper.appendChild(turbosleaderboardcontent)
})
