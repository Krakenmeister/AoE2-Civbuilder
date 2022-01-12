const fs = require('fs')

module.exports = {
        interperateLanguage
}

const uniqueNames = ["Longbowmen", "Throwing Axemen", "Huskarls", "Teutonic Knights", "Samurai", "Chu Ko Nu", "Cataphracts", "Mamelukes", "War Elephants", "Janissaries", "Berserks", "Mangudai", "Woad Raiders",
	"Conquistadors", "Jaguar Warriors", "Plumed Archers", "Tarkans", "War Wagons", "Genoese Crossbowmen", "Elephant Archers", "Kamayuks", "Magyar Huszars", "Boyars", "Organ Guns", "Shotel Warriors", "Gbetos",
	"Camel Archers", "Ballista Elephants", "Karambit Warriors", "Arambai", "Rattan Archers", "Konniks", "Keshiks", "Kipchaks", "Leitis", "Coustilliers", "Serjeants", "Obuch", "Hussite Wagons", "Crusader Knights",
	"Xolotl Warriors", "Saboteurs", "Ninjas", "Flamethrowers", "Photonmen", "Centurions", "Legionaries", "Monkey Boys", "Amazon Warriors", "Amazon Archers", "Iroquois Warriors", "Varangian Guards", "Gendarme",
	"Cuahchiqueh", "Ritterbruder", "Kazaks", "Szlachcic", "Cuirassiers", "Rajput", "Seljuk Archers", "Numidian Javelinmen", "Sosso Guards", "Swiss Pikemen", "Headhunters", "Teulu", "Maillotins", "Hashashin",
	"Zweihander", "Stradiot", "Ahosi", "Spadoni", "Clibinarii", "Silahtar", "Jaridah", "Wolf Warriors", "Warrior Monks", "Castellan", "Lightning Warriors", "Apukispay"]
const civBonusStrings = [
	"Town Centers cost -50% wood starting in the Castle Age",
	"Foot archers (except skirmishers) +1 range in Castle and Imperial Age (+2 total)",
	"Shepherds work 25% faster",
	"Castles cost -25%",
	"Mounted units +20% hit points starting in Feudal Age",
	"Foragers work 15% faster",
	"Loom can be researched instantly",
	"Villagers +5 attack vs. wild boar; hunters carry +15 meat",
	"+10 population in Imperial Age",
	"Infantry +1 attack vs. buildings per age (starting from Feudal Age)",
	"Infantry cost -20% in Dark, -25% in Feudal, -30% in Castle, -35% in Imperial Age",
	"Monks healing range 2x",
	"Towers garrison 2x units; Town Centers garrison +10",
	"Farms cost -40%",
	"Barracks and Stable units +1 armor in Castle and Imperial Age (+2 total)",
	"Mill, Lumber, Mining Camps cost -50%",
	"Fishing Ships 2x hit points; +2P armor; work rate +5% Dark, +10% Feudal, +15% Castle, +20% Imperial Age",
	"Infantry attack 33% faster starting in Feudal Age",
	"Start with +3 villagers, -50 wood, -200 food; Town Centers support 10 population and +5 LOS",
	"Demolition ships +50% hit points",
	"Technologies cost -10% Feudal, -15% Castle, -20% Imperial Age",
	"Buildings +10% HP Dark, +20% Feudal, +30% Castle, +40% Imperial Age",
	"Fire ships attack 25% faster",
	"Camel Riders, Skirmishers, Pikemen, Halberdiers cost -25%",
	"Start with +50 wood, food",
	"Town Center, Dock 2x hit points",
	"Town Center, Dock work rate +10% Feudal, +15% Castle, +20% Imperial Age",
	"Market costs -100 wood; market trade cost only 5%",
	"Transport Ships 2x hit points, 2x carry capacity",
	"Galleys attack 25% faster",
	"Camel units +10 hit points",
	"Gunpowder units +25% hit points",
	"Gold miners work 20% faster",
	"Scout Cavalry, Light Cavalry, Hussar +1P armor",
	"Warships cost -15% Feudal Age, -15% Castle Age, -20% Imperial Age",
	"Infantry +10% hit points Feudal, +15% Castle, +20% Imperial Age",
	"Cavalry archers fire 25% faster",
	"Hunters work 40% faster",
	"Light Cavalry, Hussars, Steppe Lancers +30% hit points",
	"Infantry move 15% faster (starting in the Feudal Age)",
	"Lumberjacks work 15% faster",
	"Siege units fire 25% faster",
	"Can steal sheep, and sheep within one unit's LoS cannot be stolen",
	"Missionaries can be trained in monasteries",
	"Start with +50 gold",
	"+5 Monk hit points for each Monastery technology",
	"Start with +1 villager, but -50 food",
	"Cavalry Archers cost -10% Castle, -20% Imperial Age",
	"Miltary units (except siege weapons) cost -20% wood",
	"Archer armor upgrades free",
	"Can train Turtle Ships in docks",
	"Can recruit Longboats from docks",
	"Gunpowder units cost -20%",
	"Can upgrade Heavy Camel Riders to Imperial Camel Riders",
	"Fishermen work 10% faster",
	"Stable units +1P armor in Castle and Imperial Age (+2 total)",
	"Villagers cost -10% Dark, -15% Feudal, -20% Castle, -25% Imperial Age",
	"Start with a free Llama",
	"Buildings cost -15% stone",
	"Houses support 10 population",
	"Villagers affected by Blacksmith upgrades (starting in Feudal Age)",
	"Can recruit slingers from Archery Ranges",
	"Villagers kill wolves with 1 strike",
	"Scout Cavalry, Light Cavalry, Hussar cost -15%",
	"Siege Workshop units 15% cheaper",
	"All units cost -20% gold",
	"Technologies researched 30% faster",
	"Ships +10% HP",
	"Can build Feitoria in Imperial Age",
	"Can build Caravels in docks",
	"Foot archers and skirmishers fire 18% faster",
	"Receive +100 gold, +100 food when advancing to the next age",
	"Pikeman upgrade free",
	"Buildings cost -15% wood",
	"Barracks units +1P armor per age (starting from Feudal Age)",
	"Gold resources last 30% longer",
	"Villagers move 10% faster",
	"Ships move 10% faster",
	"Stable units cost -15% in Castle, -20% in Imperial Age",
	"Elephant units move 10% faster",
	"Villagers can garrison in Houses",
	"No buildings required to advance to the next age or to unlock other buildings",
	"Advance to the next age 66% faster",
	"Elephant units cost -30% Castle, -40% in Imperial Age",
	"Fish Traps cost -33%",
	"Fish Traps provide +300% food",
	"Lumber Camp upgrades free",
	"Infantry +1 attack per age (starting in the Feudal Age)",
	"Monastery technologies cost -50%",
	"Enemy positions are revealed at the start of the game",
	"Archery Range units +20% HP",
	"Militia-line upgrades free",
	"Town Centers cost -50% stone starting in the Castle Age",
	"Can build Krepost",
	"Villagers gather +50% food from herdables",
	"Units deal +25% damage when fighting from higher elevation",
	"Thumb Ring, Parthian Tactics free",
	"Mounted units 5% faster each age (starting in Feudal Age)",
	"Additional Town Center can be built in the Feudal Age",
	"Siege Workshop and Battering Ram available in the Feudal Age; Capped Ram upgrade available in Castle Age",
	"Start with +150 food",
	"Spearman-line and Skirmishers move 10% faster",
	"Each garrisoned relic gives +1 attack to Knights and Unique Unit (maximum +4)",
	"Cavalier upgrade available in Castle Age",
	"Gunpowder units +25% attack",
	"Economic upgrades available one age earlier",
	"Castles and Town Centers built 100% faster",
	"Land military units (except siege weapons) receive 50% less bonus damage",
	"Farm upgrades provide +100% additional food",
	"Can build Donjon",
	"Farm upgrades free (require Mill)",
	"Forging, Iron Casting, Blast Furnace free",
	"Supplies free",
	"Town Watch, Town Patrol free",
	"Murder Holes, Herbal Medicine free",
	"Chemistry free",
	"Light Cavalry and Hussar upgrades free",
	"Wheelbarrow, Hand Cart free",
	"Tower upgrades free (Bombard Tower requires Chemistry)",
	"Conscription free",
	"Farmers work 10% faster",
	"Advancing to the next age costs -15%",
	"Fishing Ships cost -15%",
	"Dock and University technologies cost -33%",
	"Advancing to Imperial Age costs -33%",
	"Blacksmith upgrades don't cost gold",
	"Gunpowder units fire 18% faster",
	"Builders work 30% faster",
	"Military units created 11% faster",
	"Villagers carry +3",
	"Trebuchets +30% accuracy",
	"Do not need houses, -100 wood",
	"Resources last 15% longer",
	"Foot archers and skirmishers cost -10% Feudal, -20% Castle, -30% Imperial Age",
	"Villagers +3 line of sight",
	"Stone miners work 20% faster",
	"Economic upgrades cost no wood",
	"Blacksmith and Siege Workshop technologies cost -50% food",
	"Stable technologies cost -50%",
	"New Town Centers spawn 2 sheep starting in the Castle Age",
	"Wonders don't cost wood and provide +50 to population limit (max 1)",
	"Villagers +3 HP per economic tech researched",
	"Villagers regenerate 5 HPs per minute in Dark, 10 in Feudal, 15 in Castle, 20 in Imperial Age",
	"Military buildings built 100% faster",
	"Resource drop-off buildings provide +5 population space",
	"Ballistics researched instantly and costs no wood",
	"Archer-line upgrades free",
	"Skirmisher-line upgrades free",
	"Camel-line upgrades free",
	"Infantry Armor upgrades free",
	"Cavalry Armor upgrades free",
	"Fletching, Bodkin Arrow, Bracer free",
	"Redemption free",
	"Squires, Arson free",
	"Eagle-line upgrades free",
	"Battle Elephant upgrades free",
	"Sanctity, Fervor free",
	"Atonement, Illumination free",
	"Theocracy, Block Printing free",
	"Hoardings, Fortified Wall free",
	"Masonry, Architecture free",
	"Mining Camp technologies free",
	"Sappers, Treadmill Crane free",
	"Galleon free",
	"Careening, Dry Dock free",
	"Fast Fire Ship free",
	"Heavy Demolition Ship free",
	"Gillnets free",
	"War Galley free",
	"Heavy Cavalry Archer free",
	"Ram-line upgrades free",
	"Trade units 20% faster",
	"Squires affects foot archers and skirmishers",
	"Eagles +5% speed per age (starting in Feudal Age)",
	"Start with +150 wood",
	"Start with +100 stone",
	"Start with +50 wood, +50 stone",
	"Start with +70 food, +30 gold",
	"Monk units train 66% faster",
	"Trebuchets train 50% faster",
	"Cavalry Archers train 33% faster",
	"Land explosive units train 200% faster",
	"Land explosive units +8 pierce armor",
	"Bloodlines free in Castle Age",
	"Galleys +1 range",
	"Receive +100 wood, +100 stone when advancing to the next age",
	"Receive +400 food upon advancing to Castle Age",
	"Receive +350 stone upon advancing to Castle Age",
	"Receive +250 wood upon reaching Feudal Age",
	"Receive +500 gold upon reaching Imperial Age",
	"+100 HP and pierce armor for monks with relics",
	"Land explosive units 2x HP",
	"Receive 2 free villagers upon advancing to Feudal Age",
	"All economic upgrades researched +100% faster",
	"Castles +1500 HP",
	"Blacksmith upgrades are free an age after they become available",
	"Barracks cost -75 wood",
	"Stables cost -75 wood",
	"Archery Ranges cost -75 wood",
	"Monasteries cost -100 wood",
	"Siege Workshops cost -100 wood",
	"Military Buildings cost -50 wood",
	"Blacksmiths and Universities cost -100 wood",
	"Infantry +1 attack vs. villagers per age (starting in Dark Age)",
	"Fishing ships carry +10 food",
	"Galleys +1 attack each age (starting in Castle Age)",
	"Steppe Lancers +10 attack vs. villagers",
	"Steppe Lancers attack 33% faster",
	"Elephant units attack 25% faster",
	"Stone Walls available in Dark Age",
	"Receive +50 food, +50 wood, +50 stone, +50 gold when advancing to the next age",
	"Villagers return 25 food on death",
	"Camel units attack 25% faster",
	"Mangonels can cut trees",
	"Can train a free Siege Tower in Feudal Age; Siege Towers cost -50%",
	"Rams, Siege Towers x2 garrison space",
	"Towers (of all kinds) support 5 population",
	"Gunpowder units move 20% faster",
	"Completed castles refund 350 stone upon destruction",
	"Monk units move 20% faster",
	"Farms immediately provide 10 food upon seeding",
	"Long Swordsman, Two-Handed Swordsman upgrades available one age earlier",
	"Can buy cows in mills",
	"Start with an extra horse",
	"Siege Towers 2x HP",
	"Siege Towers train 100% faster",
	"Eco upgrades cost -50% food",
	"Cannon Galleons benefit from Ballistics (fire faster, more accurately)",
	"Warships +10 attack vs. villagers",
	"Rams generate stone by ramming",
	"Town Centers +50% work rate in Imperial Age",
	"Feudal Age costs -25%",
	"Spearmen and Skirmishers train 50% faster",
	"Spearman-line +25% HP",
	"Market techs cost no gold",
	"Trees contain double the amount of wood",
	"Stone resources last 30% longer",
	"Gold resources last 25% longer",
	"Berries contain +35% more food",
	"Wild animals contain +50% more food",
	"Fish contain +35% more food",
	"Units garrisoned in buildings heal 2x faster",
	"Repairers work 50% faster",
	"Skirmishers +1 attack vs. infantry",
	"Archery Range units +1 attack",
	"Archery range units +1 melee armor per age (starting in Feudal)",
	"Siege units +1 pierce armor in Castle and Imperial (+2 total)",
	"Parthian Tactics available in Castle Age",
	"Castle Age costs -25%",
	"Cavalry +1 attack",
	"Forging, Iron Casting, Blast Furnace add +1 damage vs. buildings",
	"All buildings +3 pierce armor",
	"Archer-line +5% speed per age (starting in Feudal)",
	"Foot archers and skirmishers +1 attack vs. villagers",
	"Gunpowder +10 attack vs. camels",
	"Eagles +6 attack vs. stone defenses",
	"Scouts, Light Cavalry, Hussar +4 attack vs. stone defenses",
	"All villagers work 5% faster",
	"Villagers +1 carry capacity per Town Center technology researched",
	"Farms 10x HP",
	"Militia-line +2 attack vs. cavalry",
	"Steppe Lancer upgrades free",
	"Steppe Lancers +2 pierce armor",
	"Castles deal large damage against buildings",
	"All villagers work 10% faster in Imperial Age",
	"Outposts +5 garrison capacity",
	"Villagers +2 pierce armor while building or repairing",
	"Castles support 40 population",
	"Bombard towers deal extra damage to rams",
	"Towers deal extra damage to cavalry",
	"Can build Monastery in Feudal Age; Monks recruited in Feudal Age have longer conversions and cannot pickup relics",
	"Scorpion and ballista units train 50% faster",
	"Town Centers fire 25% faster",
	"Trebuchets cost -75 gold",
	"All explosive units 2x blast radius",
	"Gunpowder units +12 attack vs. buildings",
	"Eagles +1 pierce armor",
	"Gunpowder units +1 attack per university technology researched",
	"Buildings +3% HP per university technology researched (cumulative)",
	"Each monastery technology researched brings a monk to your cause",
	"Folwark replaces Mill",
	"Stone Miners generate gold in addition to stone",
	"Winged Hussar replaces Hussar",
	"Chemistry and Hand Cannoneer available in Castle Age",
	"Spearman-line deals +25% bonus damage",
	"Fervor and Sanctity affects villagers",
	"Can upgrade Bombard Cannons to Houfnice"
]

var uniqueCastleStrings = ["Atlatl (Skirmishers +1 attack, +1 range)", "Kasbah (team castles work 25% faster)", "Yeomen (+1 foot archer and skirmisher range, +2 tower attack)", "Stirrups (Cavalry attack 33% faster)",
	"Burgundian Vineyards (Farmers slowly generate gold in addition to food)", "Howdah (Elephant units +1/+2P armor)", "Greek Fire (Fire ships +1 range)",
	"Stronghold (Castles and towers fire 25% faster)", "Great Wall (Walls and towers +30% HP)", "Steppe Husbandry (Light Cavalry, Steppe Lancers and Cavalry Archers trained 100% faster)",
	"this text will change", "this text will change", "this text will change", "this text will change", "Andean Sling (Skirmishers and Slingers no minimum range)", "Sultans (All gold income 10% faster)",
	"this text will change", "Yasama (Towers shoot extra arrows)", "Tusk Swords (Elephant units +3 attack)", "Eupseong (Watch Towers, Guard Towers, and Keeps +2 range)", "Hill Forts (Town Centers +3 range)",
	"this text will change", "Thalassocracy (upgrades Docks to Harbors, which fire arrows)", "Tigui (Town Centers fire arrows when ungarrisoned)", "Hul'che Javelineers (Skirmishers throw a second projectile)",
	"Nomads (lost houses do not decrease population headroom)", "Kamandaran (Archer-line gold cost is replaced by additional wood cost)", "Carrack (Ships +1/+1 armor)", "Madrasah (Monks return 33% of their cost when killed)",
	"this text will change", "Orthodoxy (Monk units +3/+3P armor)", "Inquisition (Monks convert faster)", "Silk Armor (Light Cavalry, Steppe Lancers and Cavalry Archers receive +1/+1P armor)",
	"Ironclad (Siege units extra melee armor)", "Sipahi (Cavalry Archers +20 HP)", "Chatras (Elephant units +100 HP)", "Chieftans (Infantry deal bonus damage to cavalry)", "Szlachta Privileges (Knights cost -60% gold)",
	"Wagenburg Tactics (Gunpowder units move 15% faster)"]

var uniqueImpStrings = ["Garland Wars (Infantry +4 attack)", "Maghrebi Camels (Camel units regenerate)", "Warwolf (Trebuchets do blast damage)", "Bagains (Militia-line gains +5 armor)",
	"Flemish Revolution (Upgrades all existing Villagers to Flemish Militia; create Flemish Militia at Town Centers)", "Manipur Cavalry (Cavalry +5 attack vs. archers)", "this text will change", "Furor Celtica (Siege workshop units +40% HP)",
	"this text will change", "this text will change", "Torsion Engines (increases blast radius of Siege Workshop units)", "Chivalry (Stables work 40% faster)", "Perfusion (Barracks work 100% faster)",
	"Atheism (+100 years for Relic, Wonder victories; enemy relics generate -50% resources)", "this text will change", "Shatagni (Hand Cannoneers +1 range)", "Silk Road (Trade units cost -50%)",
	"Kataparuto (Trebuchets fire, pack faster)", "Double Crossbow (Scorpion and Ballista units fire two projectiles)", "Shinkichon (Mangonel-line +1 range)", "Tower Shields (Spearman-line and Skirmishers +2P armor)",
	"Recurve Bow (Cavalry archers +1 range, +1 attack)", "Forced Levy (Militia-line gold cost is replaced by additional food cost)", "Farimba (Cavalry +3 attack)", "El Dorado (Eagle Warriors have +40 hit points)",
	"Drill (Siege units move 50% faster)", "Mahouts (Elephants move 30% faster)", "Arquebus (gunpowder units more accurate)", "Zealotry (Camel units +20 hit points)",
	"Hauberk (Knights +1/+2P armor)", "Druzhina (Infantry damage adjacent units)", "Supremacy (Villagers stronger in combat)", "Timurid Siegecraft (Trebuchets +2 range, enables Flaming Camels)",
	"Crenellations (+3 range Castles garrisoned infantry fire arrows)", "Artillery (+2 range Bombard Towers, Bombard Cannons, Cannon Galleons)", "Paper Money (Each team member receives 500 gold)", "this text will change",
	"Lechitic Legacy (Light Cavalry deals trample damage)", "Hussite Reforms (Monks and Monastery upgrades have their gold cost replaced by food)"]

const teamBonusStrings = ["Relics generate +33% gold", "Genitour available in the Archery Range starting in the Castle Age", "Archery Ranges work 20% faster", "Blacksmiths work 80% faster", "Relics generate both Gold and Food",
	"Relics visible on the map at the start of the game", "Monks +100% heal speed", "Siege Workshops work 20% faster", "Farms +10% food", "Palisade Walls +33% HP", "Towers and Outposts +3 LOS", "Knights +2 LOS",
	"Barracks work 20% faster", "Stables work 20% faster", "Farms built 100% faster", "Camel units +4 attack vs. buildings", "Condottiero available in the Barracks in Imperial Age", "Galleys +50% LOS",
	"Scorpion and Ballista units +1 range", "Mangonel-line minimum range reduced", "Monasteries work 20% faster", "Foot archers +2 LOS", "Docks +100% LOS", "Universities work 80% faster", "Walls cost -50%",
	"Scout Cavalry, Light Cavalry, Hussar +2 LOS", "Knights +2 attack vs. Archers", "Line of sight is shared with the team starting in the Dark Age", "Foot archers +2 attack vs. buildings",
	"Transport Ships +5 LOS and cost -50%", "Military buildings provide +5 population room", "Trade units generate +25% gold", "Cavalry Archers +2 LOS", "Units resist conversion",
	"Gunpowder units created 25% faster", "Imperial Skirmisher upgrade available in the Imperial Age", "Docks cost -15%", "Can upgrade Fortified Walls to City Walls in Imperial Age", "Outposts cost no stone", "Trade units +50 HP",
	"Houses built 100% faster", "Monks +2 LOS", "Herdables +2 LOS", "Mills, Lumber Camps, Mining Camps built 100% faster", "Unique Units +5% HP", "Skirmishers, Spearmen, and Scout-lines train 20% faster", "Fishing ships +2 LOS",
	"Scout-line +2 attack vs. gunpowder units", "Infantry +5 attack vs. Elephant units", "Explosive units +20% speed", "All resources last 5% longer", "Castles, Kreposts, Donjons work 10% faster", "Markets work 80% faster",
	"Steppe Lancers +3 LOS", "Spearmen +3 attack vs. cavalry", "Elephant units +4 attack vs. buildings", "Eagles +2 LOS", "Docks work 20% faster", "Monasteries 3x HP", "Markets 3x HP", "Explosive units +6 LOS",
	"Outposts constructed nearly instantly", "Siege towers don't cost gold", "Docks built 100% faster", "Infantry +2 LOS", "Trade carts 20% faster when empty", "All explosive units +40% HP", "Town Centers +4 LOS",
	"Upgrading Unique Units to Elite costs -20%", "Can upgrade Heavy Scorpions to Imperial Scorpions", "Can upgrade Elite Battle Elephants to Royal Battle Elephants", "Can upgrade Elite Steppe Lancers to Royal Lancers",
	"Can train spearmen from Town Centers", "Can train Canoes from docks", "Scout Cavalry, Light Cavalry, Hussar +1 attack vs. Archers"]

function getIndexOf(arr, tech) {
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < arr[i].length; j++) {
			if (arr[i][j] == tech) {
				return i;
			}
		}
	}
	//No one has that tech, language doesn't matter
	return 0;
}

function getCivType(techtree) {
	var civTypes = ["Infantry", "Archer", "Cavalry", "Siege", "Naval", "Monk", "Cavalry Archer", "Defensive", "Gunpowder", "Economic"]
	var missingArray = [0, 0, 0, 0, 0, 0, 1, 0, 1, 1]
	for (var i=0; i<techtree.length; i++) {
		if (techtree[i] == 0) {
			if (((i > 4) && (i < 17)) || ((i > 62) && (i < 66)) || (i == 60) || (i == 125) || (i == 127) || (i == 128)) {
				missingArray[0]++
			}
			if (((i > 16) && (i < 23)) || ((i > 53) && (i < 60)) || (i == 26) || (i == 84) || (i == 90)) {
				missingArray[1]++
			}
			if (((i > 27) && (i < 43)) || ((i > 59) && (i < 63)) || ((i > 126) && (i < 130))) {
				missingArray[2]++
			}
			if (((i > 42) && (i < 54)) || (i == 90) || (i == 92)) {
				missingArray[3]++
			}
			if (((i > 65) && (i < 81)) || ((i > 53) && (i < 60)) || (i == 87) || (i == 90)) {
				missingArray[4]++
			}
			if (((i > 96) && (i < 107)) || (i == 111) || (i == 112) || ((i > 117) && (i < 122))) {
				missingArray[5]++
			}
			if ((i == 23) || (i == 24) || (i == 26) || (i == 27) || (i == 41) || (i == 42) || ((i > 53) && (i < 60)) || (i == 84) || (i == 90)) {
				missingArray[6] += 2
			}
			if (((i > 56) && (i < 60)) || ((i > 80) && (i < 95)) || (i == 107) || (i == 108) || (i == 126)) {
				missingArray[7]++
			}
			if ((i == 25) || (i == 53) || (i == 74) || (i == 75) || (i == 91) || (i == 92)) {
				missingArray[8] += 3
			}
			if (i == 90) {
				missingArray[8] = 999
			}
			if ((i > 108) && (i < 125)) {
				missingArray[9]++
			}
		}
	}
	var min, secondMin
	if (missingArray[1] < missingArray[0]) {
		min = 1
		secondMin = 0
	} else {
		min = 0
		secondMin = 1
	}
	for (var i=2; i<missingArray.length; i++) {
		if (missingArray[i] < missingArray[min]) {
			secondMin = min
			min = i
		} else if (missingArray[i] < missingArray[secondMin]) {
			secondMin = i
		}
	}
	if ((missingArray[secondMin] - missingArray[min]) == 0) {
		return (civTypes[min] + " and " + civTypes[secondMin])
	} else {
		return civTypes[min]
	}
}

function interperateLanguage(json_path, txt_path) {
        var data = fs.readFileSync(json_path)
	var civs = JSON.parse(data)
	var stringStream = fs.createWriteStream(txt_path, {flags: 'a'})
	for (var i = 0; i < civs.name.length; i++) {
		stringStream.write((i + 10271) + " \"" + civs.name[i] + "\"\n")
	}
	for (var i = 0; i < civs.name.length; i++) {
		stringStream.write((i + 90271) + " \"Click to play as " + civs.name[i] + ".\"\n")
	}
//	stringStream.write("8296 \"Research Manipur Cavalry (Cavalry and " + uniqueNames[civs.techtree[getIndexOf(civs.imptech, 5)][0]] + " +6 attack vs buildings)\"\n")
//	stringStream.write("28296 \"Research <b>Manipur Cavalry<b> (<cost>) \\nCavalry and " + uniqueNames[civs.techtree[getIndexOf(civs.imptech, 5)][0]] + " +6 bonus attack vs buildings.\"\n")
	stringStream.write("8318 \"Research Logistica (" + uniqueNames[civs.techtree[getIndexOf(civs.imptech, 6)][0]] + " cause trample damage)\"\n")
	stringStream.write("28318 \"Research <b>Logistica<b> (<cost>) \\n " + uniqueNames[civs.techtree[getIndexOf(civs.imptech, 6)][0]] + " cause trample damage.\"\n")
	stringStream.write("8432 \"Research Rocketry (+2 " + uniqueNames[civs.techtree[getIndexOf(civs.imptech, 8)][0]] + " attack, +4P scorpion attack)\"\n")
	stringStream.write("28432 \"Research <b>Rocketry<b> (<cost>) \\n " + uniqueNames[civs.techtree[getIndexOf(civs.imptech, 8)][0]] + " have +2 attack; scorpion units have +4 piercing attack.\"\n")
	stringStream.write("7398 \"Elite Mercenaries\"\n")
	stringStream.write("3132 \"%s has offered the services of elite mercenaries to their allies!\"\n")
	stringStream.write("8398 \"Research Elite Mercenaries (Team receives 10 free Elite " + uniqueNames[civs.techtree[getIndexOf(civs.imptech, 9)][0]] + " in Castle)\"\n")
	stringStream.write("28398 \"Research <b>Elite Mercenaries<b> (<cost>) \\nTeam receives 10 free Elite " + uniqueNames[civs.techtree[getIndexOf(civs.imptech, 9)][0]] + " in Castle.\"\n")
	stringStream.write("8324 \"Research Bearded Axe (+2 attack for " + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 11)][0]] + ")\"\n")
	stringStream.write("28324 \"Research <b>Bearded Axe<b> (<cost>) \\n +2 attack for " + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 11)][0]] + ".\"\n")
	stringStream.write("8267 \"Research Fabric Shields (" + uniqueNames[civs.techtree[getIndexOf(civs.imptech, 14)][0]] + ", Slingers, Eagles +1 armor/+2 pierce armor.)\"\n")
	stringStream.write("28267 \"Research <b>Fabric Shields<b> (<cost>) \\n" + uniqueNames[civs.techtree[getIndexOf(civs.imptech, 14)][0]] + ", Slingers, Eagles have +1 armor/+2 pierce armor.\"\n")
	stringStream.write("8431 \"Research Berserkergang (" + uniqueNames[civs.techtree[getIndexOf(civs.imptech, 36)][0]] + " can regenerate)\"\n")
	stringStream.write("28431 \"Research <b>Berserkergang<b> (<cost>) \\n " + uniqueNames[civs.techtree[getIndexOf(civs.imptech, 36)][0]] + " can regenerate.\"\n")
	stringStream.write("8252 \"Research Royal Heirs (" + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 10)][0]] + " train twice as fast)\"\n")
	stringStream.write("28252 \"Research <b>Royal Heirs<b> (<cost>) \\n" + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 10)][0]] + " train twice as fast.\"\n")
	stringStream.write("8427 \"Research Anarchy (create " + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 12)][0]] + " at Barracks)\"\n")
	stringStream.write("28427 \"Research <b>Anarchy<b> (<cost>) \\n Allows " + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 12)][0]] + " to be created at the Barracks.\"\n")
	stringStream.write("8370 \"Research Marauders (create " + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 13)][0]] + " at Stables)\"\n")
	stringStream.write("28370 \"Research <b>Marauders<b> (<cost>) \\nEnables you to create " + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 13)][0]] + " at Stables.\"\n")
	stringStream.write("8272 \"Research Pavise (Archer-line, Condottiero, and " + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 16)][0]] + " +1 armor/+1 pierce armor)\"\n")
	stringStream.write("28272 \"Research <b>Pavise<b> (<cost>) \\nArcher-line, Condottiero, and " + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 16)][0]] + " have +1 armor/+1 pierce armor.\"\n")
	stringStream.write("8275 \"Research Corvinian Army (" + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 21)][0]] + " gold cost converted to additional food/wood cost)\"\n")
	stringStream.write("28275 \"Research <b>Corvinian Army<b> (<cost>) \\n" + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 21)][0]] + " gold cost converted to additional food/wood cost.\"\n")
	stringStream.write("8344 \"Research First Crusade (Each Town Center (maximum 5) spawns a one-time batch of 7 " + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 29)][0]] + "; units more resistant to conversion)\"\n")
	stringStream.write("28344 \"Research <b>First Crusade<b> (<cost>) \\nEach Town Center (maximum 5) spawns a one-time batch of 7 " + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 29)][0]] + "; units more resistant to conversion.\"\n")
	uniqueCastleStrings[10] = "Royal Heirs (" + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 10)][0]] + " train twice as fast)"
	uniqueCastleStrings[11] = "Bearded Axe (+2 attack for " + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 11)][0]] + ")"
	uniqueCastleStrings[12] = "Anarchy (create " + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 12)][0]] + " at Barracks)"
	uniqueCastleStrings[13] = "Marauders (create " + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 13)][0]] + " at Stables)"
	uniqueCastleStrings[16] = "Pavise (Archer-line, Condottieri, and " + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 16)][0]] + " +1 armor/+1 pierce armor)"
	uniqueCastleStrings[21] = "Corvinian Army (" + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 21)][0]] + " gold cost converted to additional food/wood cost)"
	uniqueCastleStrings[29] = "First Crusade (Each Town Center (maximum 5) spawns a one-time batch of 7 " + uniqueNames[civs.techtree[getIndexOf(civs.castletech, 29)][0]] + "; units more resistant to conversion)"
//	uniqueImpStrings[5] = "Manipur Cavalry (Cavalry and " + uniqueNames[civs.techtree[getIndexOf(civs.imptech, 5)][0]] + " +6 attack vs. buildings)"
	uniqueImpStrings[6] = "Logistica (" + uniqueNames[civs.techtree[getIndexOf(civs.imptech, 6)][0]] + " cause trample damage)"
	uniqueImpStrings[8] = "Rocketry (" + uniqueNames[civs.techtree[getIndexOf(civs.imptech, 8)][0]] + " +2, scorpion units +4 attack)"
	uniqueImpStrings[9] = "Elite Mercenaries (team members can create 10 free Elite " + uniqueNames[civs.techtree[getIndexOf(civs.imptech, 9)][0]] + " in the Castle)"
	uniqueImpStrings[14] = "Fabric Shields (" + uniqueNames[civs.techtree[getIndexOf(civs.imptech, 14)][0]] + ", Slingers, Eagles +1/+2P armor)"
	uniqueImpStrings[36] = "Berserkergang (" + uniqueNames[civs.techtree[getIndexOf(civs.imptech, 36)][0]] + " can regenerate)"
	for (var i = 0; i < civs.techtree.length; i++) {
		stringStream.write((i + 120150) + " \"" + getCivType(civs.techtree[i]) + " civilization \\n\\n")
		for (var j = 0; j < civs.civ_bonus[i].length; j++) {
			stringStream.write("• " + civBonusStrings[civs.civ_bonus[i][j]] + " \\n")
		}
		stringStream.write("\\n<b>Unique Unit:<b> \\n" + uniqueNames[civs.techtree[i][0]] + "\\n\\n")
		stringStream.write("<b>Unique Techs:<b> \\n")
		for (var j = 0; j < civs.castletech[i].length; j++) {
			stringStream.write("• " + uniqueCastleStrings[civs.castletech[i][j]] + "\\n")
		}
		for (var j = 0; j < civs.imptech[i].length; j++) {
			stringStream.write("• " + uniqueImpStrings[civs.imptech[i][j]] + "\\n")
		}
		stringStream.write("\\n")
		stringStream.write("<b>Team Bonus:<b> \\n")
		for (var j = 0; j < civs.team_bonus[i].length; j++) {
			stringStream.write(teamBonusStrings[civs.team_bonus[i][j]] + "\\n")
		}
		stringStream.write("\"\n")
	}
	stringStream.write("21048 \"Cow\"\n")
	stringStream.write("26498 \"Create <b>Cow<b> (<cost>) \\nHerdable animal that can be harvested by villagers for food.\"\n")
	stringStream.write("5240 \"Imperial Scorpion\"\n")
	stringStream.write("6240 \"Build Imperial Scorpion\"\n")
	stringStream.write("26240 \"Build <b>Imperial Scorpion<b> (<cost>) \\nAnti-unit siege weapon. Fires bolts that pierce multiple units. Strong vs. large groups of units. Weak vs. cavalry and siege weapons.<i> Upgrades: attack, range (University); more resistant to Monks (Monastery).<i> \\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7600 \"Imperial Scorpion\"\n")
	stringStream.write("8600 \"Upgrade to Imperial Scorpion\"\n")
	stringStream.write("28600 \"Upgrade to <b>Imperial Scorpion<b> (<cost>) \\nUpgrades your Heavy Scorpions and lets you build Imperial Scorpions, which are stronger and deal greatly increased collateral damage\"\n")
	stringStream.write("17600 \"Imperial\\nScorpion\"\n")
	stringStream.write("5241 \"Royal Battle Elephant\"\n")
	stringStream.write("6241 \"Create Royal Battle Elephant\"\n")
	stringStream.write("26241 \"Create <b>Royal Battle Elephant<b> (<cost>) \\nSlow and heavy cavalry. Strong vs. cavalry, infantry, and archers. Weak vs. Monks and Pikemen.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i> \\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7601 \"Royal Battle Elephant\"\n")
	stringStream.write("8601 \"Upgrade to Royal Battle Elephant\"\n")
	stringStream.write("28601 \"Upgrade to <b>Royal Battle Elephant<b> (<cost>) \\nUpgrades your Elite Battle Elephants and lets you create Royal Battle Elephants, which are stronger.\"\n")
	stringStream.write("5242 \"Royal Lancer\"\n")
	stringStream.write("6242 \"Create Royal Lancer\"\n")
	stringStream.write("26242 \"Create <b>Royal Lancer<b> (<cost>) \\nLight cavalry unit with increased attack range. Strong in groups. Weak vs. Camel Riders and archers.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i> \\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7602 \"Royal Lancer\"\n")
	stringStream.write("8602 \"Upgrade to Royal Lancer\"\n")
	stringStream.write("28602 \"Upgrade to <b>Royal Lancer<b> (<cost>) \\nUpgrades your Elite Steppe Lancers and lets you create Royal Lancers, which are stronger.\"\n")
	stringStream.write("6201 \"Build City Wall\"\n")
	stringStream.write("26201 \"Build <b>City Wall<b> (<cost>) \\nStone wall that is difficult to breach without siege weapons. Slows down your enemies and warns you of their approach. Cannot be converted by enemy Monks.<i> Upgrades: line of sight (Town Center); hit points, armor (University).<i> \\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("6044 \"Build City Gate\"\n")
	stringStream.write("26044 \"Build <b>City Gate<b> (<cost>) \\nCan be built into existing walls to allow movement of friendly units. Can be locked and unlocked. Cannot be converted by enemy Monks.<i> Upgrades: line of sight (Town Center); hit points, armor.<i>\\n<hp>\"\n")
	stringStream.write("7603 \"City Wall\"\n")
	stringStream.write("8603 \"Upgrade to City Wall\"\n")
	stringStream.write("28603 \"Upgrade to <b>City Wall<b> (<cost>) \\nUpgrades your Fortified Walls and lets you build City Walls, which are stronger and harder to breach. Also increases the hit points of your Gates, which makes them harder to destroy.\"\n")
	stringStream.write("17603 \"City\\nWall\"\n")
	stringStream.write("5243 \"Elite Crusader Knight\"\n")
	stringStream.write("6243 \"Create Elite Crusader Knight\"\n")
	stringStream.write("26243 \"Create <b>Elite Crusader Knight<b> (<cost>) \\nPowerful all-purpose cavalry. Strong vs. melee and slow ranged units. Weak vs. Halberdiers. Cannot be converted by enemy Monks.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable).<i> \\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7604 \"Elite Crusader Knight\"\n")
	stringStream.write("8604 \"Upgrade to Elite Crusader Knight\"\n")
	stringStream.write("28604 \"Upgrade to <b>Elite Crusader Knight<b> (<cost>) \\nUpgrades your Crusader Knights and lets you train Elite Crusader Knights, which are more durable.\"\n")
	stringStream.write("5244 \"Elite Xolotl Warrior\"\n")
	stringStream.write("6244 \"Create Elite Xolotl Warrior\"\n")
	stringStream.write("26244 \"Create <b>Elite Xolotl Warrior<b> (<cost>) \\nMesoamerican cavalry unit. Strong vs. infantry and siege. Weak vs. Pikemen and Camel Riders. <i> Upgrades: attack (Blacksmith); creation speed (Castle); more resistant to Monks (Monastery). <i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7605 \"Elite Xolotl Warrior\"\n")
	stringStream.write("8605 \"Upgrade to Elite Xolotl Warrior\"\n")
	stringStream.write("28605 \"Upgrade to <b>Elite Xolotl Warrior<b> (<cost>) \\nUpgrades your Xolotl Warriors to Elite Xolotl Warriors, equipping them with the bare minimum of armor.\"\n")
	stringStream.write("6588 \"Create Saboteur\"\n")
	stringStream.write("26588 \"Create <b>Saboteur<b> (<cost>) \\nDemolition unit armed with explosives. Strong vs. buildings and siege. Weak vs. other units. Self-destructs when used.<i> Upgrades: attack (University); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5245 \"Elite Saboteur\"\n")
	stringStream.write("6245 \"Create Elite Saboteur\"\n")
	stringStream.write("26245 \"Create <b>Elite Saboteur<b> (<cost>) \\nDemolition unit armed with explosives. Strong vs. buildings and siege. Weak vs. ranged units. Self-destructs when used.<i> Upgrades: attack (University); creation speed (Castle); more resitant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7606 \"Elite Saboteur\"\n")
	stringStream.write("8606 \"Upgrade to Elite Saboteur\"\n")
	stringStream.write("28606 \"Upgrade to <b>Elite Saboteur<b> (<cost>) \\nUpgrades your Saboteurs to Elite Saboteurs, making them Castle demolition specialists.\"\n")
	stringStream.write("5286 \"Elite Ninja\"\n")
	stringStream.write("6286 \"Create Elite Ninja\"\n")
	stringStream.write("26286 \"Create <b>Elite Ninja<b> (<cost>) \\nLight and quick infantry. Attacks ignore armor. Strong vs. unique units and heroes.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7607 \"Elite Ninja\"\n")
	stringStream.write("8607 \"Upgrade to Elite Ninja\"\n")
	stringStream.write("28607 \"Upgrade to <b>Elite Ninja<b> (<cost>) \\nUpgrades your Ninjas to Elite Ninjas, who are deadly units in offense.\"\n")
	stringStream.write("5801 \"Elite Flamethrower\"\n")
	stringStream.write("6801 \"Create Elite Flamethrower\"\n")
	stringStream.write("26801 \"Create <b>Elite Flamethrower<b> (<cost>) \\nSiege weapon that spews fire at close range. Strong vs. buildings, rams, and melee units. Weak vs. archers at long range.<i> Upgrades: attack, range (University); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7608 \"Elite Flamethrower\"\n")
	stringStream.write("8608 \"Upgrade to Elite Flamethrower\"\n")
	stringStream.write("28608 \"Upgrade to <b>Elite Flamethrower<b> (<cost>) \\nUpgrades your Flamethrowers to Elite Flamethrowers, which are more durable in close-quarters combat.\"\n")
	stringStream.write("26016 \"Create <b>Ninja<b> (<cost>) \\nLight and quick infantry. Attacks ignore armor. Strong vs. unique units and heroes.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("26043 \"Create <b>Photonman<b> (<cost>) \\nSlow-moving astronaut equipped with a ray gun. High attack but long reload time. Strong vs. high armor.<i> Upgrades: attack (University); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5802 \"Elite Photonman\"\n")
	stringStream.write("6802 \"Create Elite Photonman\"\n")
	stringStream.write("26802 \"Create <b>Elite Photonman<b> (<cost>) \\nSlow-moving astronaut equipped with a ray gun. High attack but long reload time. Strong vs. high armor<i> Upgrades: attack (University); creation speed (Castle); more resistant to Monks (Monastery)<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7609 \"Elite Photonman\"\n")
	stringStream.write("8609 \"Upgrade to Elite Photonman\"\n")
	stringStream.write("28609 \"Upgrade to <b>Elite Photonman<b> (<cost>) \\nIncreases the laser focus of your ray guns, giving them much greater range.\"\n")
	stringStream.write("5803 \"Elite Centurion\"\n")
	stringStream.write("6803 \"Create Elite Centurion\"\n")
	stringStream.write("26803 \"Create <b>Elite Centurion<b> (<cost>) \\nHeavy cavalry unit. Strong vs. infantry. Weak vs. archers.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7610 \"Elite Centurion\"\n")
	stringStream.write("8610 \"Upgrade to Elite Centurion\"\n")
	stringStream.write("28610 \"Upgrade to <b>Elite Centurion<b> (<cost>) \\nSteels the resolve of your Centurions, making them more durable in combat.\"\n")
	stringStream.write("26670 \"Create <b>Legionary<b> (<cost>) \\nHeavy infantry unit. Very versatile, and particularly trained against ranged attacks.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5804 \"Elite Legionary\"\n")
	stringStream.write("6804 \"Create Elite Legionary\"\n")
	stringStream.write("26804 \"Create <b>Elite Legionary<b> (<cost>) \\nHeavy infantry unit. Very versatile, and particularly trained against ranged attacks.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7611 \"Elite Legionary\"\n")
	stringStream.write("8611 \"Upgrade to Elite Legionary\"\n")
	stringStream.write("28611 \"Upgrade to <b>Elite Legionary<b> (<cost>) \\nUpgrade your Legionaries to Elite Legionaries, improving them to powerhouses in almost every aspect of combat.\"\n")
	stringStream.write("5763 \"Monkey Boy\"\n")
	stringStream.write("6763 \"Create Monkey Boy\"\n")
	stringStream.write("26763 \"Create <b>Monkey Boy<b> \\nWild and erratic carnivorous monkey. Strong vs. melee and siege. Weak vs. ranged and hunting units.<i> Upgrades: more resistant to Monks (Monastery)<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5805 \"Elite Monkey Boy\"\n")
	stringStream.write("6805 \"Create Elite Monkey Boy\"\n")
	stringStream.write("26805 \"Create <b>Elite Monkey Boy<b> (<cost>) \\nWild and erratic carnivorous monkey. Strong vs. melee and siege. Weak vs. ranged and hunting units.<i> Upgrades: more resistant to Monks (Monastery)<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7612 \"Elite Monkey Boy\"\n")
	stringStream.write("8612 \"Upgrade to Elite Monkey Boy\"\n")
	stringStream.write("28612 \"Upgrade to <b>Elite Monkey Boy<b> (<cost>) \\nUpgrades your Monkey Boys to Elite Monkey Boys, which are full of bloodlust and are capable of shrugging off more attacks.\"\n")
	stringStream.write("26303 \"Create <b>Amazon Warrior<b> (<cost>) \\nFast-moving infantry unit. High attack, low defense, specializing in guerilla tactics.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5806 \"Elite Amazon Warrior\"\n")
	stringStream.write("6806 \"Create Elite Amazon Warrior\"\n")
	stringStream.write("26806 \"Create <b>Elite Amazon Warrior<b> (<cost>) \\nFast-moving infantry unit. High attack, low defense, specializing in guerilla tactics.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7613 \"Elite Amazon Warrior\"\n")
	stringStream.write("8613 \"Upgrade to Elite Amazon Warrior\"\n")
	stringStream.write("28613 \"Upgrade to <b>Elite Amazon Warrior<b> (<cost>) \\nUpgrades your Amazon Warriors to Elite Amazon Warriors, increasing their agility and offensive prowess.\"\n")
	stringStream.write("26304 \"Create <b>Amazon Archer<b> (<cost>) \\nFast-moving archer. Strong vs. infantry, villagers, and animals. Weak vs. cavalry.<i> Upgrades: attack, range, armor (Blacksmith); accuracy (Archery Range); attack, accuracy (University); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5807 \"Elite Amazon Archer\"\n")
	stringStream.write("6807 \"Create Elite Amazon Archer\"\n")
	stringStream.write("26807 \"Create <b>Elite Amazon Archer<b> (<cost>) \\nFast-moving archer. Strong vs. infantry, villagers, and animals. Weak vs. cavalry.<i> Upgrades: attack, range, armor (Blacksmith); accuracy (Archery Range); attack, accuracy (University); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7614 \"Elite Amazon Archer\"\n")
	stringStream.write("8614 \"Upgrade to Elite Amazon Archer\"\n")
	stringStream.write("28614 \"Upgrade to <b>Elite <b> (<cost>) \\nUpgrade your Amazon Archers to Elite Amazon Archers, increasing their agility and offensive prowess.\"\n")
	stringStream.write("5808 \"Elite Iroquois Warrior\"\n")
	stringStream.write("6808 \"Create Elite Iroquois Warrior\"\n")
	stringStream.write("26808 \"Create <b>Elite Iroquois Warrior<b> (<cost>) \\nExceptionally quick infantry. Strong vs. buildings. <i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7615 \"Elite Iroquois Warrior\"\n")
	stringStream.write("8615 \"Upgrade to Elite Iroquois Warrior\"\n")
	stringStream.write("28615 \"Upgrade to <b>Elite Iroquois Warrior<b> (<cost>) \\nUpgrades your Iroquois Warriors to Iroquois Warriors, significantly increasing their offensive prowess.\"\n")
	stringStream.write("5548 \"Varangian Guard\"\n")
	stringStream.write("64548 \"Create Varangian Guard\"\n")
	stringStream.write("26548 \"Create <b>Varangian Guard<b> (<cost>) \\nHighly armored cavalry unit. Strong vs. archers. Weak vs. infantry and monks. <i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5809 \"Elite Varangian Guard\"\n")
	stringStream.write("6809 \"Create Elite Varangian Guard\"\n")
	stringStream.write("26809 \"Create <b>Elite Varangian Guard<b> (<cost>) \\nHighly armored cavalry unit. Strong vs. archers. Weak vs. infantry and monks. <i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7616 \"Elite Varangian Guard\"\n")
	stringStream.write("8616 \"Upgrade to Elite Varangian Guard\"\n")
	stringStream.write("28616 \"Upgrade to <b>Elite Varangian Guard<b> (<cost>) \\nUpgrades your Varangian Guard to Elite Varangian Guard, equipping them with armor capable of withstanding a hail of fire.\"\n")
	stringStream.write("5405 \"Gendarme\"\n")
	stringStream.write("6405 \"Create Gendarme\"\n")
	stringStream.write("26405 \"Create <b>Gendarme<b> (<cost>) \\nHighly armored cavalry unit. Strong vs. infantry and archers. Weak vs. siege and monks. <i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5810 \"Elite Gendarme\"\n")
	stringStream.write("6810 \"Create Elite Gendarme\"\n")
	stringStream.write("26810 \"Create <b>Elite Gendarme<b> (<cost>) \\nHighly armored cavalry unit. Strong vs. infantry and archers. Weak vs. siege and monks. <i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7617 \"Elite Gendarme\"\n")
	stringStream.write("8617 \"Upgrade to Elite Gendarme\"\n")
	stringStream.write("28617 \"Upgrade to <b>Elite Gendarme<b> (<cost>) \\nUpgrades your Gendarmes to Elite Gendarmes, equipping them with full plate body armor capable of deflecting almost any attack.\"\n")
	stringStream.write("5206 \"Cuahchiqueh\"\n")
	stringStream.write("6206 \"Create Cuahchiqueh\"\n")
	stringStream.write("26206 \"Create <b>Cuahchiqueh<b> (<cost>) \\nBlunt melee infantry unit. Strong vs. lightly armored enemies. Weak vs. archers. <i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5811 \"Elite Cuahchiqueh\"\n")
	stringStream.write("6811 \"Create Elite Cuahchiqueh\"\n")
	stringStream.write("26811 \"Create <b>Elite Cuahchiqueh<b> (<cost>) \\nBlunt melee infantry unit. Strong vs. lightly armored enemies. Weak vs. archers. <i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7618 \"Elite Cuahchiqueh\"\n")
	stringStream.write("8618 \"Upgrade to Elite Cuahchiqueh\"\n")
	stringStream.write("28618 \"Upgrade to <b>Elite Cuahchiqueh<b> (<cost>) \\nUpgrades your Cuahchiqueh to Elite Cuahchiqueh, increasing their stamina, durability in combat, and brutality in melee.\"\n")
	stringStream.write("5659 \"Ritterbruder\"\n")
	stringStream.write("6659 \"Create Ritterbruder\"\n")
	stringStream.write("26659 \"Create <b>Ritterbruder<b> (<cost>) \\nTeutonic unique cavalry unit. Slow and powerful. Strong vs. melee units. Weak vs. archers and Scorpions. <i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5812 \"Elite Ritterbruder\"\n")
	stringStream.write("6812 \"Create Elite Ritterbruder\"\n")
	stringStream.write("26812 \"Create <b>Elite Ritterbruder<b> (<cost>) \\nTeutonic unique cavalry unit. Slow and powerful. Strong vs. melee units. Weak vs. archers and Scorpions. <i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7619 \"Elite Ritterbruder\"\n")
	stringStream.write("8619 \"Upgrade to Elite Ritterbruder\"\n")
	stringStream.write("28619 \"Upgrade to <b>Elite Ritterbruder<b> (<cost>) \\nUpgrades your Ritterbruder to Elite Ritterbruder, increasing their righteous valour and experience in dispatching heretics.\"\n")
	stringStream.write("5391 \"Kazak\"\n")
	stringStream.write("6391 \"Create Kazak\"\n")
	stringStream.write("26391 \"Create <b>Kazak<b> (<cost>) \\nCavalry archer with excellent health. Strong vs. infantry and buildings. Weak vs. camels. <i> Upgrades: attack, range, armor (Blacksmith); speed, hit points (Stable); accuracy, armor (Archery Range); attack, accuracy (University); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5813 \"Elite Kazak\"\n")
	stringStream.write("6813 \"Create Elite Kazak\"\n")
	stringStream.write("26813 \"Create <b>Elite Kazak<b> (<cost>) \\nCavalry archer with excellent health. Strong vs. infantry and buildings. Weak vs. camels. <i> Upgrades: attack, range, armor (Blacksmith); speed, hit points (Stable); accuracy, armor (Archery Range); attack, accuracy (University); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7620 \"Elite Kazak\"\n")
	stringStream.write("8620 \"Upgrade to Elite Kazak\"\n")
	stringStream.write("28620 \"Upgrade to <b>Elite Kazak<b> (<cost>) \\nUpgrades your Kazaks to Elite Kazaks, making them hardened warriors of the steppe and increasing their vigour in battle.\"\n")
	stringStream.write("5609 \"Szlachcic\"\n")
	stringStream.write("6609 \"Create Szlachcic\"\n")
	stringStream.write("975609 \"Create <b>Szlachcic<b> (<cost>) \\nHeavy cavalry with durable armor. Strong vs. archers and cavalry. Weak vs. monks, camels, and infantry. <i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5814 \"Elite Szlachcic\"\n")
	stringStream.write("6814 \"Create Elite Szlachcic\"\n")
	stringStream.write("26814 \"Create <b>Elite Szlachcic<b> (<cost>) \\nHeavy cavalry with durable armor. Strong vs. archers and cavalry. Weak vs. monks, camels, and infantry. <i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7621 \"Elite Szlachcic\"\n")
	stringStream.write("8621 \"Upgrade to Elite Szlachcic\"\n")
	stringStream.write("28621 \"Upgrade to <b>Elite Szlachcic<b> (<cost>) \\nUpgrades your Szlachcic to Elite Szlachcic, supplying them with superior armor.\"\n")
	stringStream.write("5246 \"Cuirassier\"\n")
	stringStream.write("6246 \"Create Cuirassier\"\n")
	stringStream.write("26246 \"Create <b>Cuirassier<b> (<cost>) \\nLight cavalry with lightning-quick attacks. Strong vs. villagers and cavalry archers. Weak vs. infantry.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5815 \"Elite Cuirassier\"\n")
	stringStream.write("6815 \"Create Elite Cuirassier\"\n")
	stringStream.write("26815 \"Create <b>Elite Cuirassier<b> (<cost>) \\nLight cavalry with lightning-quick attacks. Strong vs. villagers and cavalry archers. Weak vs. infantry.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7622 \"Elite Cuirassier\"\n")
	stringStream.write("8622 \"Upgrade to Elite Cuirassier\"\n")
	stringStream.write("28622 \"Upgrade to <b>Elite Cuirassier<b> (<cost>) \\nUpgrades your Cuirassiers to Elite Cuirassiers, granting them extra damage against gunpowder units.\"\n")
	stringStream.write("5244 \"Rajput\"\n")
	stringStream.write("6244 \"Create Rajput\"\n")
	stringStream.write("26244 \"Create <b>Rajput<b> (<cost>) \\nFlexible cavalry unit. Strong vs. archers and cavalry archers. Weak vs. cavalry and infantry.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5816 \"Elite Rajput\"\n")
	stringStream.write("6816 \"Create Elite Rajput\"\n")
	stringStream.write("26816 \"Create <b>Elite Rajput<b> (<cost>) \\nFlexible cavalry unit. Strong vs. archers and cavalry archers. Weak vs. cavalry and infantry.<i> Upgrades: attack, armor (<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7623 \"Elite Rajput\"\n")
	stringStream.write("8623 \"Upgrade to Elite Rajput\"\n")
	stringStream.write("28623 \"Upgrade to <b>Elite Rajput<b> (<cost>) \\nUpgrades your Rajputs to Elite Rajputs, giving them the ability to melt any archers that dare to stand their ground\"\n")
	stringStream.write("5312 \"Seljuk Archer\"\n")
	stringStream.write("6412 \"Create Seljuk Archer\"\n")
	stringStream.write("26412 \"Create <b>Seljuk Archer<b> (<cost>) \\nMounted archer. Strong vs. slow units at long range. Weak vs. Elite Skirmishers and units at close range.<i> Upgrades: attack, range, armor (Blacksmith); accuracy, armor (Archery Range); attack, accuracy (University); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5817 \"Elite Seljuk Archer\"\n")
	stringStream.write("6817 \"Create Elite Seljuk Archer\"\n")
	stringStream.write("26817 \"Create <b>Elite Seljuk Archer<b> (<cost>) \\nMounted archer. Strong vs. slow units at long range. Weak vs. Elite Skirmishers and units at close range.<i> Upgrades: attack, range, armor (Blacksmith); accuracy, armor (Archery Range); attack, accuracy (University); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7624 \"Elite Seljuk Archer\"\n")
	stringStream.write("8624 \"Upgrade to Elite Seljuk Archer\"\n")
	stringStream.write("28624 \"Upgrade to <b>Elite Seljuk Archer<b> (<cost>) \\nUpgrades your Seljuk Archers to Elite Seljuk Archers, masters of the bow and particularly adept at riding.\"\n")
	stringStream.write("5775 \"Numidian Javelinman\"\n")
	stringStream.write("6775 \"Create Numidian Javelinman\"\n")
	stringStream.write("26775 \"Create <b>Numidian Javelinman<b> (<cost>) \\nMounted skirmisher. Strong vs. archers and cavalry archers. Weak vs. units at close range.<i> Upgrades: speed, hit points (Stable); attack, range, armor (Blacksmith); attack, accuracy (University); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5818 \"Elite Numidian Javelinman\"\n")
	stringStream.write("6818 \"Create Elite Numidian Javelinman\"\n")
	stringStream.write("26818 \"Create <b>Elite Numidian Javelinman<b> (<cost>) \\nMounted skirmisher. Strong vs. archers and cavalry archers. Weak vs. units at close range.<i> Upgrades: speed, hit points (Stable); attack, range, armor (Blacksmith); attack, accuracy (University); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7625 \"Elite Numidian Javelinman\"\n")
	stringStream.write("8625 \"Upgrade to Elite Numidian Javelinman\"\n")
	stringStream.write("28625 \"Upgrade to <b>Elite Numidian Javelinman<b> (<cost>) \\nUpgrades your Numidian Javelinmen to Elite Numidian Javelinmen, the ultimate bane of cavalry archers.\"\n")
	stringStream.write("6042 \"Create Sosso Guard\"\n")
	stringStream.write("26042 \"Create <b>Sosso Guard<b> (<cost>) \\nAgile infantry unit. Effective against cavalry and deadly to elephants.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5819 \"Elite Sosso Guard\"\n")
	stringStream.write("6819 \"Create Elite Sosso Guard\"\n")
	stringStream.write("26819 \"Create <b>Elite Sosso Guard<b> (<cost>) \\nAgile infantry unit. Effective against cavalry and deadly to elephants.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7626 \"Elite Sosso Guard\"\n")
	stringStream.write("8626 \"Upgrade to Elite Sosso Guard\"\n")
	stringStream.write("28626 \"Upgrade to <b>Elite Sosso Guard<b> (<cost>) \\nUpgrades your Sosso Guard to Elite Sosso Guard, causing their lightning quick attacks to hit even harder.\"\n")
	stringStream.write("5410 \"Swiss Pikeman\"\n")
	stringStream.write("6410 \"Create Swiss Pikeman\"\n")
	stringStream.write("26410 \"Create <b>Swiss Pikeman<b> (<cost>) \\nAnti-cavalry infantry unit. Strong vs. all mounted units. Weak vs. archers and infantry.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5856 \"Elite Swiss Pikeman\"\n")
	stringStream.write("6856 \"Create Elite Swiss Pikeman\"\n")
	stringStream.write("26856 \"Create <b>Elite Swiss Pikeman<b> (<cost>) \\nAnti-cavalry infantry unit. Strong vs. all mounted units. Weak vs. archers and infantry.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7627 \"Elite Swiss Pikeman\"\n")
	stringStream.write("8627 \"Upgrade to Elite Swiss Pikeman\"\n")
	stringStream.write("28627 \"Upgrade to <b>Elite Swiss Pikeman<b> (<cost>) \\nUpgrades your Swiss PIkemen to Elite Swiss Pikemen, the trusted defenders of the Pope himself.\"\n")
	stringStream.write("5478 \"Headhunter\"\n")
	stringStream.write("6478 \"Create Headhunter\"\n")
	stringStream.write("26478 \"Create <b>Headhunter<b> (<cost>) \\nLight cavalry unit. Can kidnap enemy villagers. Weak vs. most units except Monks.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5821 \"Elite Headhunter\"\n")
	stringStream.write("6821 \"Create Elite Headhunter\"\n")
	stringStream.write("26821 \"Create <b>Elite Headhunter<b> (<cost>) \\nLight cavalry unit. Can kidnap enemy villagers. Weak vs. most units except Monks.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7628 \"Elite Headhunter\"\n")
	stringStream.write("8628 \"Upgrade to Elite Headhunter\"\n")
	stringStream.write("28628 \"Upgrade to <b>Elite Headhunter<b> (<cost>) \\nUpgrades your Headhunters to Elite Headhunters who will stop at nothing to complete their mission.\"\n")
	stringStream.write("5550 \"Teulu\"\n")
	stringStream.write("6550 \"Create Teulu\"\n")
	stringStream.write("26550 \"Create <b>Teulu<b> (<cost>) \\nSturdy infantry unit. Strong vs. melee units. Weak vs. archers.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5822 \"Elite Teulu\"\n")
	stringStream.write("6822 \"Create Elite Teulu\"\n")
	stringStream.write("26822 \"Create <b>Elite Teulu<b> (<cost>) \\nSturdy infantry unit. Strong vs. melee units. Weak vs. archers.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7629 \"Elite Teulu\"\n")
	stringStream.write("8629 \"Upgrade to Elite Teulu\"\n")
	stringStream.write("28629 \"Upgrade to <b>Elite Teulu<b> (<cost>) \\nUpgrades your Teulu to Elite Teulu, hardening their resolve to withstand the most brutal of onslaughts.\"\n")
	stringStream.write("5551 \"Maillotin\"\n")
	stringStream.write("6551 \"Create Maillotin\"\n")
	stringStream.write("26551 \"Create <b>Maillotin<b> (<cost>) \\nLight infantry equipped with a hammer. High attack, strong vs. heavily armored units. Weak vs. cavalry archers.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5823 \"Elite Maillotin\"\n")
	stringStream.write("6823 \"Create Elite Maillotin\"\n")
	stringStream.write("26823 \"Create <b>Elite Maillotin<b> (<cost>) \\nLight infantry equipped with a hammer. High attack, strong vs. heavily armored units. Weak vs. cavalry archers.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7630 \"Elite Maillotin\"\n")
	stringStream.write("8630 \"Upgrade to Elite Maillotin\"\n")
	stringStream.write("28630 \"Upgrade to <b>Elite Maillotin<b> (<cost>) \\nUpgrades your Maillotin to Elite Maillotin, increasing their control over their unwieldy weapons.\"\n")
	stringStream.write("5777 \"Hashashin\"\n")
	stringStream.write("6777 \"Create Hashashin\"\n")
	stringStream.write("26777 \"Create <b>Hashashin<b> (<cost>) \\nMercernary guardsmen with a reputation for assassination. Strong vs. unique units and kings. Weak vs. archers and spearmen.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5824 \"Elite Hashashin\"\n")
	stringStream.write("6824 \"Create Elite Hashashin\"\n")
	stringStream.write("26824 \"Create <b>Elite Hashashin<b> (<cost>) \\nMercernary guardsmen with a reputation for assassination. Strong vs. unique units and kings. Weak vs. archers and spearmen.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7631 \"Elite Hashashin\"\n")
	stringStream.write("8631 \"Upgrade to Elite Hashashin\"\n")
	stringStream.write("28631 \"Upgrade to <b>Elite Hashashin<b> (<cost>) \\nUpgrades your Hashashin to Elite Hashashin, organizing their murderous intentions to frightening efficiency.\"\n")
	stringStream.write("5020 \"Zweihander\"\n")
	stringStream.write("6020 \"Create Zweihander\"\n")
	stringStream.write("26020 \"Create <b>Zweihander<b> (<cost>) \\nInfantry unit enormously skilled with a two-handed sword. Strong vs. infantry. Weak vs. archers.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5825 \"Elite Zweihander\"\n")
	stringStream.write("6825 \"Create Elite Zweihander\"\n")
	stringStream.write("26825 \"Create <b>Elite Zweihander<b> (<cost>) \\nInfantry unit enormously skilled with a two-handed sword. Strong vs. infantry. Weak vs. archers.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7632 \"Elite Zweihander\"\n")
	stringStream.write("8632 \"Upgrade to Elite Zweihander\"\n")
	stringStream.write("28632 \"Upgrade to <b>Elite Zweihander<b> (<cost>) \\nUpgrades your Zweihander to Elite Zweihander, giving nearly unstoppable power behind each swing of their massive sword.\"\n")
	stringStream.write("5480 \"Stradiot\"\n")
	stringStream.write("6480 \"Create Stradiot\"\n")
	stringStream.write("26480 \"Create <b>Stradiot<b> (<cost>) \\nMercernary light cavalry. Strong vs. cavalry and cavalry archers. Weak vs. infantry.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5826 \"Elite Stradiot\"\n")
	stringStream.write("6826 \"Create Elite Stradiot\"\n")
	stringStream.write("26826 \"Create <b>Elite Stradiot<b> (<cost>) \\nMercernary light cavalry. Strong vs. cavalry and cavalry archers. Weak vs. infantry.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7633 \"Elite Stradiot\"\n")
	stringStream.write("8633 \"Upgrade to Elite Stradiot\"\n")
	stringStream.write("28633 \"Upgrade to <b>Elite Stradiot<b> (<cost>) \\nUpgrades your Stradiot to Elite Stradiot, increasing their flexibility, coordination, and ability to pick apart even the most defensive formations through hit-and-run tactics.\"\n")
	stringStream.write("5220 \"Ahosi\"\n")
	stringStream.write("6220 \"Create Ahosi\"\n")
	stringStream.write("26220 \"Create <b>Ahosi<b> (<cost>) \\nLight infantry that deals pierce damage from close range. Strong vs. infantry and archers. Weak vs. siege and cavalry archers.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range\"\n")
	stringStream.write("5827 \"Elite Ahosi\"\n")
	stringStream.write("6827 \"Create Elite Ahosi\"\n")
	stringStream.write("26827 \"Create <b>Elite Ahosi<b> (<cost>) \\nLight infantry that deals pierce damage from close range. Strong vs. infantry and archers. Weak vs. siege and cavalry archers.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7634 \"Elite Ahosi\"\n")
	stringStream.write("8634 \"Upgrade to Elite Ahosi\"\n")
	stringStream.write("28634 \"Upgrade to <b>Elite Ahosi<b> (<cost>) \\nUpgrades your Ahosi to Elite Ahosi, deadly female warriors often compared to the mythical Amazons, but intimidatingly real.\"\n")
	stringStream.write("5300 \"Spadoni\"\n")
	stringStream.write("6780 \"Create Spadoni\"\n")
	stringStream.write("26780 \"Create <b>Spadoni<b> (<cost>) \\nLight infantry, surprisingly deft with a two-handed sword. Strong vs. gunpowder and siege. Weak vs. archers.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range\"\n")
	stringStream.write("5828 \"Elite Spadoni\"\n")
	stringStream.write("6828 \"Create Elite Spadoni\"\n")
	stringStream.write("26828 \"Create <b>Elite Spadoni<b> (<cost>) \\nLight infantry, surprisingly deft with a two-handed sword. Strong vs. gunpowder and siege. Weak vs. archers.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7635 \"Elite Spadoni\"\n")
	stringStream.write("8635 \"Upgrade to Elite Spadoni\"\n")
	stringStream.write("28635 \"Upgrade to <b>Elite Spadoni<b> (<cost>) \\nUpgrades your Spadoni to Elite Spadoni, artists of the two-handed sword fighting style.\"\n")
	stringStream.write("5703 \"Clibinarii\"\n")
	stringStream.write("5781 \"Create Clibinarii\"\n")
	stringStream.write("26781 \"Create <b>Clibinarii<b> (<cost>) \\nHeavy cavalry unit. Strong vs. archers. Weak vs. camels pikemen.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5829 \"Elite Clibinarii\"\n")
	stringStream.write("6829 \"Create Elite Clibinarii\"\n")
	stringStream.write("26829 \"Create <b>Elite Clibinarii<b> (<cost>) \\nHeavy cavalry unit. Strong vs. archers. Weak vs. camels and pikemen.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7636 \"Elite Clibinarii\"\n")
	stringStream.write("8636 \"Upgrade to Elite Clibinarii\"\n")
	stringStream.write("28636 \"Upgrade to <b>Elite Clibinarii<b> (<cost>) \\nUpgrades your Clibinarii to Elite Clibinarii, equipping their horses with near impenetrable armor.\"\n")
	stringStream.write("5379 \"Silahtar Guard\"\n")
	stringStream.write("6379 \"Create Silahtar Guard\"\n")
	stringStream.write("26379 \"Create <b>Silahtar Guard<b> (<cost>) \\nHonored personal guard of the Sultan. Strong vs. infantry and cavalry archers. Weak vs. camels and siege.<i> Upgrades: attack, range, armor (Blacksmith); speed, hit points (Stable); accuracy, armor (Archery Range); attack, accuracy (University); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5830 \"Elite Silahtar\"\n")
	stringStream.write("6830 \"Create Elite Silahtar\"\n")
	stringStream.write("26830 \"Create <b>Elite Silahtar<b> (<cost>) \\n<i> Upgrades: <i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7637 \"Elite Silahtar\"\n")
	stringStream.write("8637 \"Upgrade to Elite Silahtar\"\n")
	stringStream.write("28637 \"Upgrade to <b>Elite Silahtar<b> (<cost>) \\nUpgrades your Silahtar Guard to Elite Silahtar Guard, greatly improving their combat prowess in every aspect.\"\n")
	stringStream.write("5695 \"Jaridah\"\n")
	stringStream.write("6695 \"Create Jaridah\"\n")
	stringStream.write("26695 \"Create <b>Jaridah<b> (<cost>) \\nLight cavalry unit. Excellent at taking out villagers. Weak vs. heavy cavalry and heavy infantry.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5831 \"Elite Jaridah\"\n")
	stringStream.write("6831 \"Create Elite Jaridah\"\n")
	stringStream.write("26831 \"Create <b>Elite Jaridah<b> (<cost>) \\nLight cavalry unit. Excellent at taking out villagers. Weak vs. heavy cavalry and heavy infantry.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7638 \"Elite Jaridah\"\n")
	stringStream.write("8638 \"Upgrade to Elite Jaridah\"\n")
	stringStream.write("28638 \"Upgrade to <b>Elite Jaridah<b> (<cost>) \\nUpgrades your Jaridah to Elite Jaridah, letting them ignore even more damage from anti-cavalry attacks.\"\n")
	stringStream.write("5584 \"Wolf Warrior\"\n")
	stringStream.write("6584 \"Create Wolf Warrior\"\n")
	stringStream.write("26584 \"Create <b>Wolf Warrior<b> (<cost>) \\nOffensive cavalry unit. Strong vs. melee. Weak vs. camels and cavalry archers.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5832 \"Elite Wolf Warrior\"\n")
	stringStream.write("6832 \"Create Elite Wolf Warrior\"\n")
	stringStream.write("26832 \"Create <b>Elite Wolf Warrior<b> (<cost>) \\nOffensive cavalry unit. Strong vs. melee. Weak vs. camels and cavalry archers.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7639 \"Elite Wolf Warrior\"\n")
	stringStream.write("8639 \"Upgrade to Elite Wolf Warrior\"\n")
	stringStream.write("28639 \"Upgrade to <b>Elite Wolf Warrior<b> (<cost>) \\nUpgrades your Wolf Warriors to Elite Wolf Warriors, vile brutes with no regard for their own safety.\"\n")
	stringStream.write("5239 \"Warrior Monk\"\n")
	stringStream.write("6239 \"Create Warrior Monk\"\n")
	stringStream.write("26239 \"Create <b>Warrior Monk<b> (<cost>) \\nInfantry unit that benefits from Monk upgrades and bonuses. Highly resistant to ranged attacks.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); speed, hit points, bonus vs. monks, bonus vs. siege, regeneration, range, more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5833 \"Elite Warrior Monk\"\n")
	stringStream.write("68033 \"Create Elite Warrior Monk\"\n")
	stringStream.write("26833 \"Create <b>Elite Warrior Monk<b> (<cost>) \\nInfantry unit that benefits from Monk upgrades and bonuses. Highly resistant to ranged attacks.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); speed, hit points, bonus vs. monks, bonus vs. siege, regeneration, range, more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7640 \"Elite Warrior Monk\"\n")
	stringStream.write("8640 \"Upgrade to Elite Warrior Monk\"\n")
	stringStream.write("28640 \"Upgrade to <b>Elite Warrior Monk<b> (<cost>) \\nUpgrades your Warrior Monks to Elite Warrior Monks, truly enlightened and spiritually inspired men.\"\n")
	stringStream.write("5608 \"Castellan\"\n")
	stringStream.write("6608 \"Create Castellan\"\n")
	stringStream.write("26608 \"Create <b>Castellan<b> (<cost>) \\nLight cavalry unit. High attack, strong vs. defensive units. Weak vs. archers.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5834 \"Elite Castellan\"\n")
	stringStream.write("6834 \"Create Elite Castellan\"\n")
	stringStream.write("26834 \"Create <b>Elite Castellan<b> (<cost>) \\nLight cavalry unit. High attack, strong vs. defensive units. Weak vs. archers.<i> Upgrades: attack, armor (Blacksmith); speed, hit points (Stable); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7641 \"Elite Castellan\"\n")
	stringStream.write("8641 \"Upgrade to Elite Castellan\"\n")
	stringStream.write("28641 \"Upgrade to <b>Elite Castellan<b> (<cost>) \\nUpgrades your Castellan to Elite Castellan, increasing their inspiring presence on the battlefield.\"\n")
	stringStream.write("5017 \"Lightning Warrior\"\n")
	stringStream.write("6017 \"Create Lightning Warrior\"\n")
	stringStream.write("26017 \"Create <b>Lightning Warrior<b> (<cost>) \\nMesoamerican infantry unit. Strong vs. archers. Weak vs. heavy cavalry and elephants.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n <hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5835 \"Elite Lightning Warrior\"\n")
	stringStream.write("6835 \"Create Elite Warrior\"\n")
	stringStream.write("26835 \"Create <b>Elite Lightning Warrior<b> (<cost>) \\nMesoamerican infantry unit. Strong vs. archers. Weak vs. heavy cavalry and elephants.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7642 \"Elite Lightning Warrior\"\n")
	stringStream.write("8642 \"Upgrade to Elite Lightning Warrior\"\n")
	stringStream.write("28642 \"Upgrade to <b>Elite Lightning Warrior<b> (<cost>) \\nUpgrades your Lightning Warriors to Elite Lightning Warriors, increasing their religious resolve and hatred of cowardly ranged combat.\"\n")
	stringStream.write("5213 \"Apukispay\"\n")
	stringStream.write("6213 \"Create Apukispay\"\n")
	stringStream.write("26213 \"Create <b>Apukispay<b> (<cost>) \\nMesoamerican noble unit. Generalist infantry that receives no bonus damage. Strong vs. melee. Weak vs. ranged.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("5836 \"Elite Apukispay\"\n")
	stringStream.write("6836 \"Create Elite Apukispay\"\n")
	stringStream.write("26836 \"Create <b>Elite Apukispay<b> (<cost>) \\nMesoamerican noble unit. Generalist infantry that receives no bonus damage. Strong vs. melee. Weak vs. ranged.<i> Upgrades: attack, armor (Blacksmith); speed (Barracks); creation speed (Castle); more resistant to Monks (Monastery).<i>\\n<hp> <attack> <armor> <piercearmor> <range>\"\n")
	stringStream.write("7643 \"Elite Apukispay\"\n")
	stringStream.write("8643 \"Upgrade to Elite Apukispay\"\n")
	stringStream.write("28643 \"Upgrade to <b>Elite Apukispay<b> (<cost>) \\nUpgrades your Apukispay to Elite Apukispay, increasing their vitality and lengthening their presence on the battlefield.\"\n")

	stringStream.end()
}
