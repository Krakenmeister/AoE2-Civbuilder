const hostname = "https://krakenmeister.com";
const route = "/civbuilder";

const num_cards = [334, 83, 54, 54, 76];
const max_sizes = [334, 1, 1, 1, 76];

const numCivs = 45;

const rarities = ["common", "uncommon", "rare", "epic", "legendary"];
const rarityTexts = ["Ordinary", "Distinguished", "Superior", "Epic", "Legendary"];

const costIcons = ["food.png", "wood.png", "stone.png", "gold.png"];

const classToName = {
	11: "buildings",
	13: "stone defenses",
	20: "siege weapons",
	26: "castles",
	1: "infantry",
	19: "unique units",
	32: "condottiero",
	10: "villagers",
	8: "cavalry",
	27: "spearmen",
	36: "heroes/kings",
	21: "buildings",
	29: "eagles",
	15: "archers",
	35: "mamelukes",
	17: "rams/trebuchet",
	22: "walls/gates",
	14: "animals",
	16: "ships/saboteurs",
	5: "elephants",
	30: "camels",
	38: "skirmishers",
	28: "cavalry archers",
	23: "gunpowder",
	25: "monks",
};

const card_descriptions = [
	[
		["Town Centers cost -50% wood starting in the Castle Age", 1, 0],
		["Foot archers (except skirmishers) +1 range in Castle and Imperial Age (+2 total)", 3, 0],
		["Shepherds work 25% faster", 1, 0],
		["Castles cost -15% in Castle, -25% in Imperial Age", 2, 0],
		["Mounted units +20% hit points starting in Feudal Age", 3, 0],
		["Foragers work 10% faster", 1, 0],
		["Loom can be researched instantly", 0, 0],
		["Villagers +5 attack vs. wild boar; hunters carry +15 meat; hunt contains +20% meat", 1, 0],
		["+10 population in Imperial Age", 0, 0],
		["Infantry +1 attack vs. buildings per age (starting from Feudal Age)", 0, 0],
		["Infantry cost -20% in Dark, -25% in Feudal, -30% in Castle, -35% in Imperial Age", 4, 0],
		["Monks double healing range", 0, 0],
		["Towers garrison 2x units; Town Centers garrison +10", 0, 0],
		["Farms cost -40%", 2, 0],
		["Barracks and Stable units +1 armor in Castle and Imperial Age (+2 total)", 1, 0],
		["Economic drop-off buildings cost -50%", 1, 0],
		["Fishing Ships 2x hit points; +2P armor; work rate +5% Dark, +10% Feudal, +15% Castle, +20% Imperial Age", 2, 0],
		["Infantry attack 33% faster starting in Feudal Age", 1, 0],
		["Start with +3 villagers, -50 wood, -200 food; Town Centers support 15 population and +7 LOS", 2, 0],
		["Demolition ships +50% hit points", 0, 0],
		["Technologies cost -5% Feudal, -10% Castle, -15% Imperial Age", 2, 0],
		["Buildings +10% HP Dark, +20% Feudal, +30% Castle, +40% Imperial Age", 1, 0],
		["Fire ships attack 25% faster", 0, 0],
		["Camel Riders, Skirmishers, Pikemen, Halberdiers cost -25%", 2, 0],
		["Start with +50 wood, food", 0, 0],
		["Town Center, Dock 2x hit points", 0, 0],
		["Town Center, Dock work rate +5% Dark, +10% Feudal, +15% Castle, +20% Imperial Age", 2, 0],
		["Market costs -100 wood; market trade cost only 5%", 1, 0],
		["Transport Ships 2x hit points, 2x carry capacity", 0, 0],
		["Galleys attack 25% faster", 1, 0],
		["Camel units +25% hit points", 2, 0],
		["Gunpowder units +25% hit points", 2, 0],
		["Gold miners work 20% faster", 1, 0],
		["Scout Cavalry, Light Cavalry, Hussar +1 pierce armor", 1, 0],
		["Warships cost -15% Feudal Age, -15% Castle Age, -20% Imperial Age", 2, 0],
		["Infantry +20% hit points starting in Feudal Age", 1, 0],
		["Cavalry archers fire 25% faster", 2, 0],
		["Hunters work 40% faster", 3, 0],
		["Light Cavalry, Hussars, Steppe Lancers +20/30% hit points in Castle/Imperial Age", 1, 0],
		["Infantry move 15% faster (starting in the Feudal Age)", 1, 0],
		["Lumberjacks work 15% faster", 2, 0],
		["Siege units fire 25% faster", 2, 0],
		["Can steal sheep, and sheep within one unit's LoS cannot be stolen", 0, 0],
		["Missionaries can be trained in monasteries", 0, 0],
		["Start with +50 gold", 0, 0],
		["+5 Monk hit points for each Monastery technology", 3, 0],
		["Start with +1 villager, but -50 food", 1, 0],
		["Cavalry Archers cost -10% Castle, -20% Imperial Age", 2, 0],
		["Archers and Infantry cost -50% wood, Warships cost -20% wood", 2, 0],
		["Archer armor upgrades free", 1, 0],
		["Can train Turtle Ships in docks", 0, 0],
		["Can recruit Longboats from docks", 2, 0],
		["Gunpowder units cost -20%", 2, 0],
		["Can upgrade Heavy Camel Riders to Imperial Camel Riders", 2, 0],
		["Fishermen work 10% faster", 0, 0],
		["Stable units +1P armor in Castle and Imperial Age (+2 total)", 2, 1],
		["Villagers cost -8% Dark, -13% Feudal, -18% Castle, -23% Imperial Age", 2, 0],
		["Military units cost -10, 15, 20, 25% food in Dark, Feudal, Castle, Imperial", 4, 0],
		["Buildings cost -15% stone", 1, 0],
		["Houses support 10 population", 0, 0],
		["Villagers affected by Blacksmith upgrades starting in the Castle Age", 0, 0],
		["Can recruit slingers from Archery Ranges", 1, 0],
		["Villagers kill wolves with 1 strike", 0, 0],
		["Scout Cavalry, Light Cavalry, Hussar cost -15%", 1, 0],
		["Siege Workshop units 15% cheaper", 1, 0],
		["All units cost -20% gold", 4, 0],
		["Foragers generate a trickle of wood (33%)", 1, 0],
		["Ships +10% HP", 1, 0],
		["Can build Feitoria in Imperial Age", 3, 0],
		["Can build Caravels in docks", 1, 0],
		["Foot archers fire 18% faster", 2, 0],
		["Receive +100 gold, +100 food when advancing to the next age", 2, 0],
		["Pikeman upgrade free", 0, 0],
		["Buildings cost -15% wood", 1, 0],
		["Barracks units +1 pierce armor per age (starting from Feudal Age)", 2, 0],
		["Villagers drop off 10% more gold", 1, 0],
		["Villagers move 5% faster in Dark Age, 10% faster in Feudal Age", 1, 0],
		["Ships move 10% faster", 0, 0],
		["Stable units cost -15% in Castle, -20% in Imperial Age", 3, 0],
		["Melee elephant units move 10% faster", 1, 0],
		["Villagers can garrison in Houses", 0, 0],
		["No buildings required to advance to the next age or to unlock other buildings", 2, 0],
		["Advance to the next age 66% faster", 3, 0],
		["Elephant units cost -25% Castle, -35% in Imperial Age", 4, 0],
		["Fish Traps cost -33%", 0, 0],
		["Fish Traps provide +300% food", 0, 0],
		["Lumber Camp upgrades free", 2, 0],
		["Infantry +1 attack per age (starting in the Feudal Age)", 1, 0],
		["Monastery technologies cost -50%", 1, 0],
		["Enemy positions are revealed at the start of the game", 0, 0],
		["Archery Range units +20% HP", 2, 0],
		["Militia-line upgrades free", 3, 0],
		["Town Centers cost -50% stone starting in the Castle Age", 0, 0],
		["Can build Krepost", 2, 0],
		["Villagers gather +50% food from herdables", 0, 0],
		["Units deal +25% damage when fighting from higher elevation", 0, 0],
		["Thumb Ring, Parthian Tactics free", 1, 0],
		["Mounted units 5% faster each age (starting in Feudal Age)", 2, 0],
		["Additional Town Center can be built in the Feudal Age", 1, 0],
		["Siege Workshop and Battering Ram available in the Feudal Age; Capped Ram upgrade available in Castle Age", 1, 0],
		["Receive +100 food per Town Center", 1, 0],
		["Spearmen and Skirmishers move 10% faster", 1, 0],
		["Each garrisoned relic gives +1 attack to Knights and Unique Unit (maximum +4)", 2, 0],
		["Cavalier upgrade available in Castle Age", 2, 0],
		["Gunpowder units +25% attack", 2, 0],
		["Economic upgrades cost -33% food and available one age earlier", 2, 0],
		["Fortifications built 50%, Town Centers built 100% faster", 1, 0],
		["Land military units (except siege weapons) receive 33% less bonus damage", 4, 0],
		["Farm upgrades provide +125% additional food", 0, 0],
		["Can build Donjon", 2, 0],
		["Farm upgrades free (require Mill)", 1, 0],
		["Forging, Iron Casting, Blast Furnace free", 1, 0],
		["Supplies and Gambesons free", 1, 0],
		["Town Watch, Town Patrol free", 0, 0],
		["Murder Holes, Herbal Medicine free", 0, 0],
		["Chemistry free", 2, 0],
		["Light Cavalry and Hussar upgrades free", 1, 0],
		["Wheelbarrow, Hand Cart free", 3, 0],
		["Tower upgrades free (Bombard Tower requires Chemistry)", 2, 0],
		["Conscription free", 0, 0],
		["Farmers work 15% faster", 2, 0],
		["Advancing to the next age costs -15%", 1, 0],
		["Fishing Ships cost -15%", 1, 0],
		["Dock and University technologies cost -33%", 0, 0],
		["Advancing to Imperial Age costs -33%", 0, 0],
		["Blacksmith upgrades don't cost gold", 1, 0],
		["Gunpowder units fire 18% faster", 1, 0],
		["Builders work 30% faster", 1, 0],
		["Military units created 11% faster", 1, 0],
		["Villagers carry +3", 1, 0],
		["Trebuchets +30% accuracy", 0, 0],
		["Do not need houses, -100 wood", 1, 0],
		["Resources last 15% longer", 1, 0],
		["Foot archers and skirmishers cost -10% Feudal, -20% Castle, -30% Imperial Age", 3, 0],
		["Villagers +3 line of sight", 0, 0],
		["Stone miners work 20% faster", 1, 0],
		["Economic upgrades cost no wood", 0, 0],
		["Blacksmith and Siege Workshop technologies cost -50% food", 1, 0],
		["Stable technologies cost -50%", 1, 0],
		["New Town Centers spawn 2 sheep starting in the Castle Age", 0, 0],
		["Wonders don't cost wood and provide +50 to population limit (max 1)", 2, 1],
		["Villagers +3 HP per economic tech researched", 1, 1],
		["Villagers regenerate 10 HP/min in Feudal, 15 in Castle, 20 in Imperial Age", 1, 0],
		["Military buildings built 100% faster", 0, 1],
		["Resource drop-off buildings provide +5 population space", 0, 1],
		["Ballistics researched instantly and costs no wood", 1, 1],
		["Archer-line upgrades free", 2, 1],
		["Skirmisher-line upgrades free", 1, 1],
		["Camel-line upgrades free", 2, 1],
		["Infantry Armor upgrades free", 1, 0],
		["Cavalry Armor upgrades free", 3, 1],
		["Fletching, Bodkin Arrow, Bracer free", 4, 1],
		["Redemption free", 2, 1],
		["Squires, Arson free", 1, 1],
		["Eagle-line upgrades free", 3, 1],
		["Battle Elephant upgrades free", 3, 1],
		["Sanctity, Fervor free", 2, 1],
		["Atonement, Illumination free", 1, 1],
		["Theocracy, Block Printing free", 2, 1],
		["Hoardings, Fortified Wall free", 0, 1],
		["Masonry, Architecture free", 0, 1],
		["Mining Camp technologies free", 2, 0],
		["Sappers, Treadmill Crane free", 0, 1],
		["Galleon free", 1, 1],
		["Careening, Dry Dock free", 0, 1],
		["Fast Fire Ship free", 1, 1],
		["Heavy Demolition Ship free", 1, 1],
		["Gillnets free", 1, 1],
		["War Galley free", 1, 1],
		["Heavy Cavalry Archer free", 2, 1],
		["Ram-line upgrades free", 3, 1],
		["Trade units 20% faster", 2, 1],
		["Squires affects foot archers and skirmishers", 1, 1],
		["Eagles +5% speed per age (starting in Feudal Age)", 2, 1],
		["Start with +150 wood", 1, 1],
		["Start with +100 stone", 1, 1],
		["Start with +50 wood, +50 stone", 0, 1],
		["Start with +70 food, +30 gold", 1, 1],
		["Monk units train 66% faster", 1, 1],
		["Trebuchets train 50% faster", 0, 1],
		["Cavalry Archers train 33% faster", 0, 1],
		["Land explosive units train 200% faster", 0, 1],
		["Land explosive units +8 pierce armor", 0, 1],
		["Bloodlines free in Castle Age", 0, 1],
		["Galleys +1 range", 1, 1],
		["Receive +100 wood, +100 stone when advancing to the next age", 2, 1],
		["Receive +400 food upon advancing to Castle Age", 2, 1],
		["Receive +350 stone upon advancing to Castle Age", 2, 1],
		["Receive +250 wood upon reaching Feudal Age", 2, 1],
		["Receive +500 gold upon reaching Imperial Age", 2, 1],
		["+100 HP and pierce armor for monks with relics", 0, 1],
		["Land explosive units 2x HP", 0, 1],
		["Town Centers spawn 2 villagers when the next Age is reached", 3, 0],
		["All economic upgrades researched +100% faster", 0, 1],
		["Castles and Kreposts +2000 HP", 1, 1],
		["Blacksmith upgrades are free an age after they become available", 1, 1],
		["Barracks cost -75 wood", 1, 1],
		["Stables cost -75 wood", 1, 0],
		["Archery Ranges cost -75 wood", 1, 0],
		["Monasteries cost -100 wood", 1, 1],
		["Siege Workshops cost -100 wood", 1, 1],
		["Military Buildings cost -50 wood", 1, 1],
		["Blacksmiths and Universities cost -100 wood", 0, 0],
		["Infantry +1 attack vs. villagers per age (starting in Dark Age)", 0, 1],
		["Fishermen and Fishing Ships carry +15", 1, 0],
		["Galleys +1 attack", 1, 1],
		["Steppe Lancers +10 attack vs. villagers", 2, 1],
		["Steppe Lancers attack 33% faster", 1, 1],
		["Elephant units attack 25% faster", 1, 1],
		["Stone Walls available in Dark Age", 0, 1],
		["Receive +50 food, +50 wood, +50 stone, +50 gold when advancing to the next age", 2, 1],
		["Villagers return 25 food on death", 0, 1],
		["Camel units attack 20% faster", 1, 1],
		["Mangonels can cut trees", 1, 1],
		["Can train a free Siege Tower in Feudal Age; Siege Towers cost -50%", 2, 1],
		["Rams, Siege Towers x2 garrison space", 2, 1],
		["Towers support 15 population", 0, 1],
		["Gunpowder units move 20% faster", 2, 1],
		["Completed castles provide 400 gold as long as they stay standing", 1, 1],
		["Monk units move 20% faster", 2, 1],
		["Melee Cavalry gain +2 bonus damage vs Skirmishers", 0, 1],
		["Non-unique Barracks units (except Men-at-Arms) available one age earlier", 1, 0],
		["Can buy cows in mills", 1, 1],
		["Start with an extra horse", 1, 0],
		["Siege Towers 2x HP", 1, 1],
		["Siege Towers train 100% faster", 0, 1],
		["Siege units cost -33% wood", 1, 0],
		["Cannon Galleons benefit from Ballistics (fire faster, more accurately)", 1, 0],
		["Warships +10 attack vs. villagers", 0, 1],
		["Rams generate stone by ramming", 3, 1],
		["Town Centers +50% work rate in Imperial Age", 2, 1],
		["Feudal Age costs -25%", 1, 1],
		["Spearmen and Skirmishers train 50% faster", 1, 1],
		["Spearmen +25% HP", 1, 1],
		["Market techs cost no gold", 0, 1],
		["Trees contain double the amount of wood", 1, 1],
		["Stone resources last 30% longer", 1, 1],
		["Gold resources last 30% longer", 1, 1],
		["Berries contain +35% more food", 1, 1],
		["Can upgrade Fortified Walls to City Walls in Imperial Age", 2, 1],
		["Fish contain +35% more food", 1, 1],
		["Units garrisoned in buildings heal 2x faster", 0, 1],
		["Repairers work 100% faster", 1, 1],
		["Skirmishers +1 attack vs. infantry", 0, 1],
		["Archery Range units +1 attack", 3, 1],
		["Archery range units +1 melee armor per age (starting in Feudal)", 2, 1],
		["Siege units +1 pierce armor in Castle and Imperial (+2 total)", 1, 1],
		["Parthian Tactics available in Castle Age", 1, 1],
		["Castle Age costs -25%", 1, 1],
		["Cavalry +1 attack", 1, 1],
		["Forging, Iron Casting, Blast Furnace add +1 damage vs. buildings", 1, 1],
		["All buildings +3 pierce armor", 0, 1],
		["Foot archers +5% speed per age (starting in Feudal)", 2, 1],
		["Foot archers and skirmishers +1 attack vs. villagers", 1, 1],
		["Gunpowder +10 attack vs. camels", 0, 1],
		["Eagles +6 attack vs. stone defenses", 0, 1],
		["Scouts, Light Cavalry, Hussar +4 attack vs. stone defenses", 0, 1],
		["All villagers work 5% faster", 2, 0],
		["Villagers +1 carry capacity per Town Center technology researched", 1, 1],
		["Farms 10x HP", 0, 1],
		["Militia-line +2 attack vs. cavalry", 1, 1],
		["Steppe Lancer upgrades free", 1, 1],
		["Steppe Lancers +2 pierce armor", 1, 1],
		["Castles and Kreposts deal large damage against buildings", 2, 1],
		["All villagers work 10% faster in Imperial Age", 2, 1],
		["Outposts +5 garrison capacity", 0, 1],
		["Villagers +10 pierce armor while building or repairing", 0, 1],
		["Castles and Kreposts support 50 population", 0, 1],
		["Bombard towers deal extra damage to rams", 1, 1],
		["Towers deal extra damage to cavalry", 2, 1],
		["Can build Monastery in Feudal Age; Monks recruited in Feudal Age have longer conversions and cannot pickup relics", 1, 1],
		["Scorpions, Ballista Elephants, and War Wagons train 50% faster", 0, 1],
		["Town Centers fire 25% faster", 0, 1],
		["Trebuchets cost -75 gold", 0, 1],
		["All explosive units 2x blast radius", 0, 1],
		["Gunpowder units +8 attack vs. buildings", 0, 1],
		["Eagles +1 pierce armor", 0, 1],
		["Gunpowder units +1 attack per university technology researched", 3, 1],
		["Buildings +3% HP per university technology researched (cumulative)", 1, 1],
		["Each monastery technology researched brings a monk to your cause", 3, 1],
		["Folwark replaces Mill", 1, 0],
		["Stone Miners generate gold in addition to stone", 2, 1],
		["Winged Hussar replaces Hussar", 1, 0],
		["Chemistry and Hand Cannoneer available in Castle Age", 1, 0],
		["Spearmen deals +25% bonus damage", 1, 0],
		["Fervor and Sanctity affects villagers", 0, 0],
		["Can upgrade Bombard Cannons to Houfnice", 3, 0],
		["Can build Caravanseri in Imperial Age", 1, 0],
		["Gunpowder units +1/+1P armor", 1, 0],
		["Receive +200 wood when advancing to the next age", 2, 0],
		["Barracks technologies cost -50%", 1, 0],
		["Skirmishers and Elephant Archers attack 25% faster", 1, 0],
		["Elephant units receive 25% less bonus damage and are more resistant to conversion", 1, 0],
		["Ships regenerate 15 HP per minute", 0, 0],
		["Start with 2 Forage Bushes", 1, 0],
		["Can garrison Mills with livestock to produce food", 1, 0],
		["Mounted units deal +20% bonus damage Feudal, +30% Castle, +40% Imperial Age", 1, 0],
		["Can garrison Docks with Fishing Ships", 1, 0],
		["Can train Thirisadai in docks", 1, 0],
		["Can recruit Shrivamsha Riders", 2, 0],
		["Can recruit Camel Scouts in Feudal Age", 1, 0],
		["Gain 20 gold for each technology researched", 1, 0],
		["Galley-line and Dromons +1/+1 armor", 1, 0],
		["Battle Elephants +1/+1P armor", 2, 0],
		["Monk units +3/+3P armor", 2, 0],
		["Infantry receives double effect from Blacksmith armor upgrades", 3, 0],
		["Scorpions cost -60% gold and benefit from Ballistics research", 2, 0],
		["Legionary replaces Two-Handed Swordsman / Champion", 0, 0],
		["Can upgrade Heavy Scorpions to Imperial Scorpions", 3, 1],
		["Can upgrade Elite Battle Elephants to Royal Battle Elephants", 4, 1],
		["Can upgrade Elite Steppe Lancers to Royal Lancers", 3, 1],
		["Cavalry Archers +2 attack vs. Archers (except skirmishers)", 1, 1],
		["Wood and mining upgrades are 40% more effective, economic drop-off buildings cost -25%", 4, 0],
		["First religious building receives a free relic", 1, 0],
		["Savar replaces Paladin", 2, 0],
		["Galley-line and Dromons fire an additional projectile", 1, 0],
		["Fortified church replaces monastery, can recruit Warrior Priests", 2, 0],
		["Mule Carts replace Lumber Camps and Mining Camps", 1, 0],
		["Start with a Mule Cart", 2, 0],
		["Religious buildings provide Villagers in an 8 tile radius with +10% work rate", 1, 0],
		["Units and buildings receive -15% damage when fighting from higher elevation", 1, 0],
		["Mounted units regenerate 5/10/15 HP per minute, in the Feudal, Castle, Imperial Age", 3, 0],
		["Flaming Camels available in Siege Workshops in Imperial Age", 0, 0],
		["All buildings refund +1 stone per tile of foundation", 3, 1],
		["Villagers work faster when nearby other villagers", 2, 1],
		["Husbandry affects attack speed", 1, 1],
		["Trade yields 10% stone in addition to gold", 1, 1],
		["Blacksmith upgrades affect bonus damage", 3, 1],
		["Cavalry archers can dodge one projectile", 1, 1],
		["Farmers don't require Mills/Town Centers to drop off food", 1, 0],
		["Farms are smaller", 1, 1],
		["Archery range techs cost -50%", 0, 1],
		["Knights available in Feudal Age with 30HP", 2, 1],
		["Siege Towers can fire arrows", 2, 1],
	],

	[
		["Longbowmen", 2, 0],
		["Throwing Axemen", 0, 0],
		["Huskarls", 1, 0],
		["Teutonic Knights", 2, 0],
		["Samurai", 1, 0],
		["Chu Ko Nu", 1, 0],
		["Cataphracts", 1, 0],
		["Mamelukes", 1, 0],
		["War Elephants", 3, 0],
		["Janissaries", 2, 0],
		["Berserks", 1, 0],
		["Mangudai", 4, 0],
		["Woad Raiders", 0, 0],
		["Conquistadors", 2, 0],
		["Jaguar Warriors", 0, 0],
		["Plumed Archers", 1, 0],
		["Tarkans", 0, 0],
		["War Wagons", 0, 0],
		["Genoese Crossbowmen", 1, 0],
		["Ghulam", 0, 0],
		["Kamayuks", 0, 0],
		["Magyar Huszars", 0, 0],
		["Boyars", 2, 0],
		["Organ Guns", 3, 0],
		["Shotel Warriors", 0, 0],
		["Gbetos", 0, 0],
		["Camel Archers", 3, 0],
		["Ballista Elephants", 4, 0],
		["Karambit Warriors", 0, 0],
		["Arambai", 1, 0],
		["Rattan Archers", 1, 0],
		["Konniks", 1, 0],
		["Keshiks", 0, 0],
		["Kipchaks", 1, 0],
		["Leitis", 4, 0],
		["Coustilliers", 1, 0],
		["Serjeants", 0, 0],
		["Obuch", 2, 0],
		["Hussite Wagons", 2, 0],
		["Crusader Knights", 2, 1],
		["Xolotl Warriors", 1, 1],
		["Saboteurs", 3, 1],
		["Ninjas", 0, 1],
		["Flamethrowers", 3, 1],
		["Photonmen", 4, 1],
		["Centurions", 1, 0],
		["Apukispay", 0, 1],
		["Monkey Boys", 4, 1],
		["Amazon Warriors", 0, 1],
		["Amazon Archers", 1, 1],
		["Iroquois Warriors", 1, 1],
		["Varangian Guards", 0, 1],
		["Gendarmes", 1, 1],
		["Cuahchiqueh", 0, 1],
		["Ritterbruder", 1, 1],
		["Kazaks", 0, 1],
		["Szlachcic", 0, 1],
		["Cuirassiers", 1, 1],
		["Rajputs", 0, 1],
		["Seljuk Archers", 2, 1],
		["Numidian Javelinmen", 0, 1],
		["Sosso Guards", 0, 1],
		["Swiss Pikemen", 1, 1],
		["Headhunters", 3, 1],
		["Teulu", 0, 1],
		["Maillotins", 1, 1],
		["Hashashin", 1, 1],
		["Highlander", 0, 1],
		["Stradiot", 1, 1],
		["Ahosi", 1, 1],
		["Landsknecht", 0, 1],
		["Clibinarii", 0, 1],
		["Silahtar", 0, 1],
		["Jaridah", 2, 1],
		["Wolf Warriors", 1, 1],
		["Warrior Monks", 2, 1],
		["Castellan", 1, 1],
		["Wind Warriors", 1, 1],
		["Chakram Throwers", 4, 0],
		["Urumi Swordsmen", 1, 0],
		["Rathas", 1, 0],
		["Composite Bowmen", 3, 0],
		["Monaspa", 2, 0],
	],

	[
		["Atlatl (Skirmishers +1 attack, +1 range) [400F 350G]", 0, 0],
		["Kasbah (team Castles work 25% faster) [250F 250G]", 0, 0],
		["Yeomen (+1 foot archer and skirmisher range, +2 tower attack) [750W 450G]", 2, 0],
		["Stirrups (Cavalry attack 33% faster) [400F 200G]", 3, 0],
		["Burgundian Vineyards (Farmers slowly generate gold in addition to food) [400F 300G]", 2, 0],
		["Manipur Cavalry (Cavalry +4 attack vs. archers) [300F 300G]", 0, 0],
		["Greek Fire (Fire ships +1 range, Bombard Towers and Dromons increased blast radius) [250F 300G]", 0, 0],
		["Stronghold (Castles, Kreposts and Towers fire 33% faster, Castles and Kreposts heal allied infantry in a 7 tile radius) [250F 200G]", 1, 0],
		["Great Wall (Walls and towers +30% HP) [400W 200S]", 0, 0],
		["Steppe Husbandry (Light Cavalry, Steppe Lancers and Cavalry Archers trained 100% faster) [200F 300W]", 1, 0],
		["Royal Heirs (Unique Unit and Camels receive -3 damage from Mounted Units) [300F 300G]", 1, 0],
		["Bearded Axe (Unique Unit +1 range) [300F 300G]", 4, 0],
		["Anarchy (create Unique Unit at barracks) [450F 250G]", 2, 0],
		["Marauders (create Unique Unit at stables) [300W 200G]", 2, 0],
		["Andean Sling (Skirmishers and Slingers no minimum range, Slingers +1 attack) [200F 300G]", 0, 0],
		["Grand Trunk Road (All gold income 10% faster) [250F 200W]", 1, 0],
		["Pavise (Archer-line, Condottiero, and Unique Unit +1/+1 armor) [200W 150G]", 1, 0],
		["Yasama (Towers shoot extra arrows) [300F 300W]", 2, 0],
		["Tusk Swords (Melee elephant units +3 attack) [300W 450G]", 3, 0],
		["Eupseong (Watch Towers, Guard Towers, and Keeps +2 range) [300F 300W]", 1, 0],
		["Hill Forts (Town Centers +3 range) [250F 250G]", 0, 0],
		["Corvinian Army (Unique Unit gold cost converted to additional food/wood cost) [200F 300G]", 4, 0],
		["Thalassocracy (upgrades Docks to Harbors, which fire arrows) [300F 300G]", 1, 0],
		["Tigui (Town Centers fire arrows when ungarrisoned) [200F 300W]", 0, 0],
		["Hul'che Javelineers (Skirmishers throw a second projectile) [300F 300G]", 1, 0],
		["Nomads (lost houses do not decrease population headroom) [300W 150G]", 0, 0],
		["Kamandaran (Archer-line gold cost is replaced by additional wood cost) [400F 300G]", 3, 0],
		["Carrack (Ships +1/+1 armor) [200W 300G]", 1, 0],
		["Madrasah (Monks return 50 gold when killed) [200F 100G]", 0, 1],
		[
			"First Crusade (Each Town Center (maxiumum 5) spawns a one-time batch of 5 of your Unique Unit; units are more resistant to conversion) [400F 300G]",
			3,
			0,
		],
		["Orthodoxy (Monk units +3/+3P armor) [200F 300G]", 1, 1],
		["Inquisition (Monk convert faster) [100F 300G]", 1, 0],
		["Silk Armor (Light Cavalry, Steppe Lancers and Cavalry Archers receive +1/+1P armor) [400W 300G]", 1, 0],
		["Ironclad (Siege units extra melee armor) [400W 350G]", 1, 0],
		["Sipahi (Cavalry Archers +20 HP) [350F 150G]", 2, 0],
		["Chatras (Elephant units +100 HP) [250F 250G]", 2, 0],
		["Chieftains (Infantry deal bonus damage to cavalry, generate gold when killing villagers, trade units, and monks) [600F 450G]", 1, 0],
		["Szlachta Privileges (Knights cost -60% gold) [500F 300G]", 3, 0],
		["Wagenburg Tactics (Gunpowder units move 15% faster) [300F 300G]", 1, 0],
		["Deconstruction (Siege units fire 33% faster) [400W 400G]", 2, 1],
		["Obsidian Arrows (Archer-line +6 attack vs. buildings) [300F 300G]", 3, 1],
		["Tortoise Engineers (Rams train 100% faster) [100W 200G]", 0, 1],
		["Panoply (Infantry +1/+1P armor, +1 attack) [300F 200G]", 2, 1],
		["Clout Archery (Archery Ranges work 50% faster) [150W 250G]", 1, 1],
		["Medical Corps (Elephant units regenerate 30 HP per minute) [300F 200G]", 1, 0],
		["Paiks (Unique Unit and elephant units attack 20% faster) [375W 275G]", 3, 0],
		["Kshatriyas (Military units cost -25% food) [500F 450G]", 3, 0],
		["Detinets (40% of Castle, Tower, Krepost, and Donjon stone cost replaced with wood) [400W 200G]", 2, 0],
		["Zealotry (Camel units +20 hit points) [400F 400G]", 1, 0],
		["Ballistas (Scorpions and Ballista Elephants fire 33% faster, Galleys +2 attack) [400W 300G]", 1, 0],
		["Bimaristan (Monk units automatically heal multiple nearby units) [300W 200G]", 0, 0],
		["Cilician Fleet (Demolition Ships +20% blast radius; Galley-line and Dromons +1 range) [350W 300G]", 0, 0],
		["Svan Towers (Defensive buildings +2 attack; towers fire arrows that pierce multiple units) [300F 200G]", 2, 0],
		["Replaceable Parts (Siege units +1/+1P armor, repairing siege is free) [400W 250G]", 2, 1],
	],

	[
		["Garland Wars (Infantry +4 attack) [450F 750G]", 2, 0],
		["Maghrebi Camels (Camel units regenerate) [700F 300G]", 1, 0],
		["Warwolf (Trebuchets do blast damage) [800W 400G]", 1, 0],
		["Bagains (Militia-line gains +5 armor) [900F 450G]", 2, 0],
		[
			"Flemish Revolution (Upgrades all existing Villagers to Flemish Militia; create Flemish Militia at Town Centers) [200F 150G + 10F 5G per villager]",
			0,
			0,
		],
		["Howdah (Elephant units +1/+1P armor) [400F 300W]", 1, 0],
		["Logistica (Unique Unit causes trample damage) [800F 600G]", 4, 0],
		["Furor Celtica (Siege Workshop units +40% HP) [750F 450G]", 1, 0],
		["Rocketry (Unique Unit +2, Scorpions +4 attack) [750W 750G]", 2, 0],
		["Elite Mercenaries (team members can train 5 free elite versions of your Unique Unit per castle) [650F 400G]", 0, 0],
		["Torsion Engines (increases blast radius of Siege Workshop units) [1000F 600G]", 3, 0],
		["Chivalry (Stables work 40% faster) [600W 500G]", 0, 0],
		["Perfusion (Barracks work 100% faster) [400W 600G]", 1, 0],
		["Atheism (+100 years for Relic, Wonder victories; enemy relics generate -50% resources) [500F 3OOW]", 0, 0],
		["Fabric Shields (Eagles, Slingers, Unique Unit +1/+2 armor) [600F 600G]", 1, 0],
		["Shatagni (Hand Cannoneers +2 range) [500F 300G]", 0, 0],
		["Silk Road (Trade units cost -50%) [500F 250G]", 0, 0],
		["Kataparuto (Trebuchets fire, pack faster) [550W 300G]", 1, 0],
		["Double Crossbow (Scorpion and Ballista units fire two projectiles) [700F 400G]", 1, 0],
		["Shinkichon (Mangonel-line +1 range) [800W 500G]", 0, 0],
		["Tower Shields (Spearmen and Skirmishers +2P armor) [500F 200G]", 1, 0],
		["Recurve Bow (Cavalry archers +1 range, +1 attack) [600W 400G]", 1, 0],
		["Forced Levy (Militia-line gold cost is replaced by additional food cost) [850F 500G]", 3, 0],
		["Farimba (Cavalry +5 attack) [650F 400G]", 4, 0],
		["El Dorado (Eagle Warriors have +40 hit points) [750F 450G]", 2, 0],
		["Drill (Siege workshop units move 50% faster) [500W 450G]", 2, 0],
		["Citadels (Castles and Kreposts fire Bullets [+4 attack, +3 vs Rams, +3 vs Infantry], receive -25% bonus damage) [600W 300G]", 3, 0],
		["Arquebus (gunpowder units more accurate) [700F 400G]", 0, 0],
		["Counterweights (Trebuchets and Mangonel-line +15% attack) [650F 500G]", 0, 0],
		["Hauberk (Knights +1/+2P armor) [700F 600G]", 1, 0],
		["Druzhina (Infantry damage adjacent units) [900F 500G]", 2, 0],
		["Supremacy (Villagers stronger in combat) [400F 250G]", 0, 0],
		["Timurid Siegecraft (Trebuchets +2 range, enables Flaming Camels) [500W 400G]", 1, 0],
		["Crenellations (+3 range Castles garrisoned infantry fire arrows) [600F 400S]", 1, 0],
		["Artillery (+2 range Bombard Towers, Bombard Cannons, Cannon Galleons) [600F 650G]", 2, 0],
		["Paper Money (Lumberjacks slowly generate gold in addition to wood) [550F 200W]", 2, 0],
		["Bogsveigar (Foot Archers and Unique ships +1 attack) [650F 500G]", 0, 0],
		["Lechitic Legacy (Light Cavalry deals trample damage) [750F 550G]", 3, 0],
		["Hussite Reforms (Monks and Monastery upgrades have their gold cost replaced by food) [500F 450G]", 1, 0],
		["Lamellar Armor (Camels and Cavalry Archers +2/+1P armor) [500W 500G]", 1, 1],
		["Field Repairmen (Rams regain HP) [350W 650G]", 0, 1],
		["Golden Age (All buildings work 10% faster) [300S 600G]", 1, 1],
		["Villager's Revenge (Dead villagers become Halberdiers) [500F 250G]", 1, 1],
		["Gate Crashing (Ram gold cost is replaced by additional wood cost) [600W 700G]", 2, 1],
		["Wootz Steel (Infantry and cavalry attacks ignore armor) [650F 550G]", 4, 0],
		["Mahayana (Villagers and monk units take 10% less population space) [800W 650G]", 2, 0],
		["Frontier Guards (Camel units and Elephant Archers +4 melee armor) [800F 700G]", 1, 0],
		["Comitatenses (Militia-line, Knight-line, and Unique Unit train 50% faster and receive a 5 damage charge attack) [700F 800G]", 1, 0],
		["Fereters (Infantry except Spearmen +30 HP, Warrior Priests +100% heal speed) [550F 400G]", 2, 0],
		["Aznauri Cavalry (Cavalry units take 15% less population space) [750F 250G]", 1, 0],
		["Pila (Skirmisher attacks strip armour) [700F 600G]", 3, 1],
		["Enlistment (Infantry take 15% less population space) [700F 300G]", 1, 1],
		["Marshalled Hunters (Foot archers and skirmishers take 15% less population space) [750W 250G]", 1, 1],
		["Shigetō Yumi (Unique Unit, Mounted Archers, and Towers attack 15% faster and deal +2 anti-unique unit damage) [750F 350G]", 1, 1],
	],

	[
		["Relics generate +33% gold", 2, 0],
		["Genitour available in the Archery Range starting in the Castle Age", 2, 0],
		["Archery Ranges work 10% faster", 3, 0],
		["Blacksmiths work 80% faster", 1, 0],
		["Relics generate both Gold and Food", 1, 0],
		["Relics visible on the map at the start of the game", 1, 0],
		["Monks +100% heal speed", 0, 0],
		["Siege Workshops work 20% faster", 1, 0],
		["Farms +10% food", 1, 0],
		["Palisade Walls +33% HP", 0, 0],
		["Outposts +3 LOS and cost no stone", 3, 0],
		["Knights +2 LOS", 0, 0],
		["Barracks work 20% faster", 3, 0],
		["Stables work 20% faster", 3, 0],
		["Start with a free Llama", 2, 0],
		["Camel and light cavalry units +2 attack vs. buildings", 1, 0],
		["Condottiero available in the Barracks in Imperial Age", 2, 0],
		["Galleys +50% LOS", 0, 0],
		["Scorpion and Ballista units +1 range", 3, 0],
		["Mangonel-line minimum range reduced", 0, 0],
		["Monasteries work 20% faster", 1, 0],
		["Cavalry Archers trained 25% faster", 1, 0],
		["Docks +100% LOS", 1, 0],
		["Universities work 80% faster", 1, 0],
		["Walls cost -50%", 2, 0],
		["Scout Cavalry, Light Cavalry, Hussar +2 LOS", 3, 0],
		["Knights +2 attack vs. Archers", 1, 0],
		["Technologies research 25% faster (excluding Age Up)", 0, 0],
		["Foot archers +2 attack vs. buildings", 2, 0],
		["Transport Ships +5 LOS and cost -50%", 0, 0],
		["Military buildings provide +5 population room", 0, 0],
		["Trade units generate +25% gold", 4, 0],
		["Cavalry Archers +2 LOS", 0, 0],
		["Units resist conversion", 4, 0],
		["Gunpowder units created 25% faster", 0, 0],
		["Imperial Skirmisher upgrade available in the Imperial Age", 3, 0],
		["Docks cost -15%", 0, 0],
		["Scout Cavalry, Light Cavalry, Hussar +1 attack vs. Archers", 0, 0],
		["Scorpion-line minimum range reduced", 0, 0],
		["Trade units +50 HP", 0, 1],
		["Houses built 100% faster", 0, 1],
		["Monks +2 LOS", 0, 1],
		["Herdables +2 LOS", 1, 1],
		["Mills, Lumber Camps, Mining Camps built 100% faster", 0, 1],
		["Unique Units +5% HP", 2, 1],
		["Skirmishers, Spearmen, and Scout-lines train 20% faster", 1, 1],
		["Fishing ships +2 LOS", 0, 1],
		["Scout-line +2 attack vs. gunpowder units", 0, 1],
		["Infantry +5 attack vs. Elephant units", 0, 1],
		["Explosive units +20% speed", 0, 1],
		["All resources last 5% longer", 2, 1],
		["Castles, Kreposts, Donjons work 10% faster", 2, 1],
		["Markets work 80% faster", 2, 0],
		["Steppe Lancers +3 LOS", 0, 1],
		["Spearmen +3 attack vs. cavalry", 1, 1],
		["Elephant units +4 attack vs. buildings", 1, 1],
		["Eagles +2 LOS", 1, 1],
		["Docks work 20% faster", 1, 1],
		["Monasteries 3x HP", 0, 1],
		["Markets 3x HP", 0, 1],
		["Explosive units +6 LOS", 0, 1],
		["Outposts and towers constructed faster", 0, 1],
		["Siege towers +50% garrison capacity", 0, 1],
		["Docks built 100% faster", 0, 1],
		["Infantry +2 LOS", 2, 0],
		["Trade carts 20% faster when empty", 2, 1],
		["All explosive units +40% HP", 0, 1],
		["Town Centers +4 LOS", 0, 1],
		["Upgrading Unique Units to Elite costs -20%", 1, 1],
		["Docks provide +5 population room", 0, 0],
		["Trade units yield 10% food in addition to gold", 1, 0],
		["Camel and elephant units created 25% faster", 1, 0],
		["Can train spearmen from Town Centers", 2, 1],
		["Can train Canoes from docks", 2, 1],
		["Buildings cost 25% fewer resources to repair", 2, 0],
		["Mounted archers -50% frame delay", 1, 1],
	],
];

//Turn site path into array of strings that are unbroken by /
function pathToArr(pathname) {
	var parts = [];
	var index = -1;
	for (var i = 0; i < pathname.length; i++) {
		if (pathname[i] == "/") {
			index++;
		} else {
			if (pathname[i - 1] == "/") {
				parts.push(pathname[i]);
			} else {
				parts[index] += pathname[i];
			}
		}
	}
	return parts;
}

//Name checker
function validate(value) {
	var nameRGEX = /^[a-zA-Z0-9][a-zA-Z0-9 ]*$/;
	var nameResult = nameRGEX.test(value);
	if (nameResult == false) {
		alert("Please enter a valid name");
		return false;
	}
	if (value.length > 30) {
		alert("Please enter a shorter name");
		return false;
	}
	return true;
}

//Random seed that has a 1 in 300,000,000 chance of colliding with requests of the same millisecond
function getSeed() {
	var seed = Date.now().toString();
	for (var i = 0; i < 5; i++) {
		seed = seed.split("");
		seed[i] = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
		seed = seed.join("");
	}
	return seed;
}

//Create a hidden form and submit it
function post(path, params, method = "post") {
	const form = document.createElement("form");
	form.method = method;
	form.action = path;

	for (const key in params) {
		if (params.hasOwnProperty(key)) {
			const hiddenField = document.createElement("input");
			hiddenField.type = "hidden";
			hiddenField.name = key;
			hiddenField.value = params[key];
			form.appendChild(hiddenField);
		}
	}

	document.body.appendChild(form);
	form.submit();
}

//Create and download file completely client side
function downloadTextFile(text, name) {
	const a = document.createElement("a");
	const type = name.split(".").pop();
	a.href = URL.createObjectURL(new Blob([text], { type: `text/${type === "txt" ? "plain" : type}` }));
	a.download = name;
	a.click();
}

//Fit content inside of element
function fitText(outputSelector) {
	//Get the DOM output element by its selector
	let outputDiv = document.getElementById(outputSelector);
	//Get element's size
	let width = outputDiv.clientWidth;
	let height = outputDiv.clientHeight;
	//Get content's size
	let contentWidth = outputDiv.scrollWidth;
	let contentHeight = outputDiv.scrollHeight;
	//Get fontSize
	let fontSize = parseInt(window.getComputedStyle(outputDiv, null).getPropertyValue("font-size"), 10);
	//Scale down font one pixel at a time until it fits inside element
	while (contentWidth > width || contentHeight > height) {
		fontSize--;
		outputDiv.style.fontSize = fontSize + "px";
		width = outputDiv.clientWidth;
		height = outputDiv.clientHeight;
		contentWidth = outputDiv.scrollWidth;
		contentHeight = outputDiv.scrollHeight;
	}
}

function fitHeight(outputSelector) {
	//Get the DOM output element by its selector
	let outputDiv = document.getElementById(outputSelector);
	//Get element's size
	let height = outputDiv.clientHeight;
	//Get content's size
	let contentHeight = outputDiv.scrollHeight;
	//Get fontSize
	let elementHeight = parseInt(outputDiv.style.height, 10);
	//Scale down font one pixel at a time until it fits inside element
	while (contentHeight > height) {
		elementHeight++;
		outputDiv.style.height = elementHeight + "vw";
		height = outputDiv.clientHeight;
		contentHeight = outputDiv.scrollHeight;
	}
	elementHeight++;
	outputDiv.style.height = elementHeight + "vw";
}

const colours = [
	[0, 0, 0],
	[255, 255, 255],
	[217, 0, 0],
	[0, 173, 54],
	[249, 233, 13],
	[0, 0, 128],
	[255, 153, 51],
	[0, 162, 221],
	[84, 14, 125],
	[224, 58, 213],
	[73, 235, 173],
	[66, 30, 1],
	[92, 92, 92],
	[255, 171, 202],
	[171, 207, 255],
];
const categories = ["Color 1", "Color 2", "Color 3", "Color 4", "Color 5", "Division", "Overlay", "Symbol"];
const palette_sizes = [15, 15, 15, 15, 15, 12, 12, 84];

const architectures = [
	"Central European",
	"Western European",
	"East Asian",
	"Middle Eastern",
	"Mesoamerican",
	"Mediterranean",
	"Indian",
	"Eastern European",
	"African",
	"Southeast Asian",
	"Central Asian",
];
const languages = [
	"British Language",
	"French Language",
	"Gothic Language",
	"Teuton Language",
	"Japanese Language",
	"Chinese Language",
	"Byzantine Language",
	"Persian Language",
	"Saracen Language",
	"Turk Language",
	"Viking Language",
	"Mongol Language",
	"Celtic Language",
	"Spanish Language",
	"Aztec Language",
	"Mayan Language",
	"Hunnic Language",
	"Korean Language",
	"Italian Language",
	"Indian Language",
	"Incan Language",
	"Magyar Language",
	"Slavic Language",
	"Portuguese Language",
	"Ethiopian Language",
	"Malian Language",
	"Berber Language",
	"Khmer Language",
	"Malay Language",
	"Burmese Language",
	"Vietnamese Language",
	"Bulgarian Language",
	"Tatar Language",
	"Cuman Language",
	"Lithuanian Language",
	"Burgundian Language",
	"Sicilian Language",
	"Polish Language",
	"Bohemian Language",
	"Dravidian Language",
	"Bengali Language",
	"Gurjaran Language",
	"Roman Language",
];

function getCookie(name) {
	let nameEQ = name + "=";
	let ca = document.cookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == " ") {
			c = c.substring(1, c.length);
		}
		if (c.indexOf(nameEQ) == 0) {
			return c.substring(nameEQ.length, c.length);
		}
	}
	return null;
}

async function setCookie(cookie, value) {
	await axios.post(`${hostname}${route}/setCookie`, { cookie: cookie, value: value });
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

//Draw flag to canvas given a seed
function clientFlag(flag_palette, flag_id, scale, relative_path = ".") {
	var colour_palette = [[], [], []];
	var c = document.getElementById(flag_id);
	var ctx = c.getContext("2d");
	ctx.scale(scale, scale);
	if (flag_palette[0] == -1) {
		const img = document.createElement("img");
		img.src = `${relative_path}/vanillaFiles/vanillaCivs/flag_${flag_palette[7]}.png`;
		const s = scale * 256 * (256 / 104);
		ctx.drawImage(img, 0, 0, s, s);
		return;
	}
	colour_palette[0] = colours[flag_palette[0]];
	colour_palette[1] = colours[flag_palette[1]];
	colour_palette[2] = colours[flag_palette[2]];
	colour_palette[3] = colours[flag_palette[3]];
	colour_palette[4] = colours[flag_palette[4]];
	division = flag_palette[5];
	overlay = flag_palette[6];
	symbol = flag_palette[7];

	var primary_division_colour = "rgb(" + colour_palette[0][0] + ", " + colour_palette[0][1] + ", " + colour_palette[0][2] + ")";
	var secondary_division_colour = "rgb(" + colour_palette[1][0] + ", " + colour_palette[1][1] + ", " + colour_palette[1][2] + ")";
	var tertiary_division_colour = "rgb(" + colour_palette[2][0] + ", " + colour_palette[2][1] + ", " + colour_palette[2][2] + ")";
	var overlay_colour = "rgb(" + colour_palette[3][0] + ", " + colour_palette[3][1] + ", " + colour_palette[3][2] + ")";
	var image_path = `${relative_path}/img/symbols/symbol_${symbol - 1}.png`;

	//Draw background
	//0 = solid color background
	//1 = halves split vertically
	//2 = halves split horizontally
	//3 = thirds split vertically
	//4 = thirds split horizontally
	//5 = quarters split orthogonally, opposite corners same color
	//6 = quarters split diagonally, opposite corners same color
	//7 = halves split diagonally, top-left to bottom-right
	//8 = halves split diagonally, bottom-left to top-right
	//9 = stripes vertically
	//10 = stripes horizontally
	//11 = checkered
	switch (division) {
		case 0:
			ctx.fillStyle = primary_division_colour;
			ctx.fillRect(0, 0, 256, 256);
			break;
		case 1:
			ctx.fillStyle = primary_division_colour;
			ctx.fillRect(0, 0, 128, 256);
			ctx.fillStyle = secondary_division_colour;
			ctx.fillRect(128, 0, 128, 256);
			break;
		case 2:
			ctx.fillStyle = primary_division_colour;
			ctx.fillRect(0, 0, 256, 128);
			ctx.fillStyle = secondary_division_colour;
			ctx.fillRect(0, 128, 256, 128);
			break;
		case 3:
			ctx.fillStyle = primary_division_colour;
			ctx.fillRect(0, 0, 85, 256);
			ctx.fillStyle = secondary_division_colour;
			ctx.fillRect(85, 0, 86, 256);
			ctx.fillStyle = tertiary_division_colour;
			ctx.fillRect(171, 0, 85, 256);
			break;
		case 4:
			ctx.fillStyle = primary_division_colour;
			ctx.fillRect(0, 0, 256, 85);
			ctx.fillStyle = secondary_division_colour;
			ctx.fillRect(0, 85, 256, 86);
			ctx.fillStyle = tertiary_division_colour;
			ctx.fillRect(0, 171, 256, 85);
			break;
		case 5:
			ctx.fillStyle = primary_division_colour;
			ctx.fillRect(0, 0, 128, 128);
			ctx.fillRect(128, 128, 128, 128);
			ctx.fillStyle = secondary_division_colour;
			ctx.fillRect(0, 128, 128, 128);
			ctx.fillRect(128, 0, 128, 128);
			break;
		case 6:
			ctx.fillStyle = primary_division_colour;
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(128, 128);
			ctx.lineTo(0, 256);
			ctx.closePath();
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(256, 0);
			ctx.lineTo(128, 128);
			ctx.lineTo(256, 256);
			ctx.closePath();
			ctx.fill();
			ctx.fillStyle = secondary_division_colour;
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(128, 128);
			ctx.lineTo(256, 0);
			ctx.closePath();
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(0, 256);
			ctx.lineTo(128, 128);
			ctx.lineTo(256, 256);
			ctx.closePath();
			ctx.fill();
			break;
		case 7:
			ctx.fillStyle = primary_division_colour;
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(256, 256);
			ctx.lineTo(256, 0);
			ctx.closePath();
			ctx.fill();
			ctx.fillStyle = secondary_division_colour;
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(256, 256);
			ctx.lineTo(0, 256);
			ctx.closePath();
			ctx.fill();
			break;
		case 8:
			ctx.fillStyle = primary_division_colour;
			ctx.beginPath();
			ctx.moveTo(256, 0);
			ctx.lineTo(0, 256);
			ctx.lineTo(0, 0);
			ctx.closePath();
			ctx.fill();
			ctx.fillStyle = secondary_division_colour;
			ctx.beginPath();
			ctx.moveTo(256, 0);
			ctx.lineTo(0, 256);
			ctx.lineTo(256, 256);
			ctx.closePath();
			ctx.fill();
			break;
		case 9:
			ctx.fillStyle = primary_division_colour;
			ctx.fillRect(0, 0, 28, 256);
			ctx.fillRect(57, 0, 28, 256);
			ctx.fillRect(114, 0, 28, 256);
			ctx.fillRect(171, 0, 28, 256);
			ctx.fillRect(228, 0, 28, 256);
			ctx.fillStyle = secondary_division_colour;
			ctx.fillRect(28, 0, 29, 256);
			ctx.fillRect(85, 0, 29, 256);
			ctx.fillRect(142, 0, 29, 256);
			ctx.fillRect(199, 0, 29, 256);
			break;
		case 10:
			ctx.fillStyle = primary_division_colour;
			ctx.fillRect(0, 0, 256, 28);
			ctx.fillRect(0, 57, 256, 28);
			ctx.fillRect(0, 114, 256, 28);
			ctx.fillRect(0, 171, 256, 28);
			ctx.fillRect(0, 228, 256, 28);
			ctx.fillStyle = secondary_division_colour;
			ctx.fillRect(0, 28, 256, 29);
			ctx.fillRect(0, 85, 256, 29);
			ctx.fillRect(0, 142, 256, 29);
			ctx.fillRect(0, 199, 256, 29);
			break;
		case 11:
			for (var i = 0; i < 7; i++) {
				for (var j = 0; j < 7; j++) {
					if ((i + j) % 2 == 0) {
						ctx.fillStyle = primary_division_colour;
					} else {
						ctx.fillStyle = secondary_division_colour;
					}
					ctx.fillRect(
						37 * (((i + 1) / 2) | 0) + 36 * ((i / 2) | 0),
						37 * (((j + 1) / 2) | 0) + 36 * ((j / 2) | 0),
						36 + ((i + 1) % 2),
						36 + ((j + 1) % 2)
					);
				}
			}
			break;
	}

	//Draw foreground and determine symbol position & size
	//0 = no overlay
	//1 = central cross
	//2 = off-center cross
	//3 = X
	//4 = diagonal band, top-left to bottom-right
	//5 = diagonal band, bottom-left to top-right
	//6 = central circle
	//7 = semicircle on left-edge
	//8 = triangle on left-edge
	//9 = central diamond
	//10 = top-left quarter
	//11 = central square
	var symbol_position_x = 0;
	var symbol_position_y = 0;
	var symbol_size = 256;
	ctx.fillStyle = overlay_colour;
	switch (overlay) {
		case 0:
			symbol_position_x = 24;
			symbol_position_y = 24;
			symbol_size = 208;
			break;
		case 1:
			ctx.fillRect(104, 0, 48, 256);
			ctx.fillRect(0, 104, 256, 48);
			symbol_position_x = 24;
			symbol_position_y = 24;
			symbol_size = 208;
			break;
		case 2:
			ctx.fillRect(71, 0, 48, 256);
			ctx.fillRect(0, 104, 256, 48);
			symbol_position_x = 0;
			symbol_position_y = 33;
			symbol_size = 190;
			break;
		case 3:
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(34, 0);
			ctx.lineTo(256, 222);
			ctx.lineTo(256, 256);
			ctx.lineTo(222, 256);
			ctx.lineTo(0, 34);
			ctx.closePath();
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(256, 0);
			ctx.lineTo(256, 34);
			ctx.lineTo(34, 256);
			ctx.lineTo(0, 256);
			ctx.lineTo(0, 222);
			ctx.lineTo(222, 0);
			ctx.closePath();
			ctx.fill();
			symbol_position_x = 24;
			symbol_position_y = 24;
			symbol_size = 208;
			break;
		case 4:
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(34, 0);
			ctx.lineTo(256, 222);
			ctx.lineTo(256, 256);
			ctx.lineTo(222, 256);
			ctx.lineTo(0, 34);
			ctx.closePath();
			ctx.fill();
			symbol_position_x = 24;
			symbol_position_y = 24;
			symbol_size = 208;
			break;
		case 5:
			ctx.beginPath();
			ctx.moveTo(256, 0);
			ctx.lineTo(256, 34);
			ctx.lineTo(34, 256);
			ctx.lineTo(0, 256);
			ctx.lineTo(0, 222);
			ctx.lineTo(222, 0);
			ctx.closePath();
			ctx.fill();
			symbol_position_x = 24;
			symbol_position_y = 24;
			symbol_size = 208;
			break;
		case 6:
			ctx.beginPath();
			ctx.arc(128, 128, 100, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.fill();
			symbol_position_x = 48;
			symbol_position_y = 48;
			symbol_size = 160;
			break;
		case 7:
			ctx.beginPath();
			ctx.arc(0, 128, 128, -Math.PI / 2, Math.PI / 2);
			ctx.closePath();
			ctx.fill();
			symbol_position_x = 3;
			symbol_position_y = 73;
			symbol_size = 110;
			break;
		case 8:
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(196, 128);
			ctx.lineTo(0, 256);
			ctx.closePath();
			ctx.fill();
			symbol_position_x = 8;
			symbol_position_y = 78;
			symbol_size = 100;
			break;
		case 9:
			ctx.beginPath();
			ctx.moveTo(128, 0);
			ctx.lineTo(256, 128);
			ctx.lineTo(128, 256);
			ctx.lineTo(0, 128);
			ctx.closePath();
			ctx.fill();
			symbol_position_x = 64;
			symbol_position_y = 64;
			symbol_size = 128;
			break;
		case 10:
			ctx.fillRect(0, 0, 128, 128);
			symbol_position_x = 2;
			symbol_position_y = 2;
			symbol_size = 124;
			break;
		case 11:
			ctx.fillRect(32, 32, 192, 192);
			symbol_position_x = 36;
			symbol_position_y = 36;
			symbol_size = 184;
			break;
	}

	//Draw symbol
	if (symbol != 0) {
		var size = 256;
		size *= scale;
		var canvas2 = document.createElement("canvas");
		canvas2.id = "symbol";
		canvas2.width = size;
		canvas2.height = size;

		var ctx2 = canvas2.getContext("2d");
		ctx2.scale(scale, scale);

		//Load symbol onto separate canvas
		const img = document.createElement("img");
		img.src = image_path;

		function mergeFun() {
			return function () {
				ctx2.drawImage(img, symbol_position_x, symbol_position_y, symbol_size, symbol_size);

				//Merge the two canvases together
				const imageData1 = ctx.getImageData(0, 0, size, size);
				const imageData2 = ctx2.getImageData(0, 0, size, size);
				const data1 = imageData1.data;
				const data2 = imageData2.data;
				for (var i = 0; i < data1.length; i += 4) {
					if (data2[i + 3] != 0) {
						data1[i] = colour_palette[4][0];
						data1[i + 1] = colour_palette[4][1];
						data1[i + 2] = colour_palette[4][2];
						data1[i + 3] = 255;
					}
				}

				//Write canvas
				ctx.putImageData(imageData1, 0, 0);
			};
		}

		if (!img.complete) {
			img.onload = mergeFun();
		} else {
			mergeFun()();
		}
	}
}

//0 -> unit
//1 -> building
//2 -> technology
const treeMap = [
	[1, 87],
	[0, 4],
	[0, 7],
	[0, 24],
	[0, 6],
	[0, 39],
	[2, 437],
	[0, 492],
	[0, 5],
	[0, 474],
	[2, 436],
	[1, 12],
	[0, 74],
	[0, 75],
	[0, 93],
	[0, 751],
	[2, 716],
	[0, 77],
	[0, 358],
	[0, 753],
	[2, 215],
	[2, 602],
	[0, 473],
	[0, 359],
	[0, 752],
	[0, 567],
	[1, 101],
	[0, 448],
	[2, 435],
	[0, 546],
	[0, 38],
	[0, 329],
	[0, 1132],
	[0, 1370],
	[2, 39],
	[0, 441],
	[0, 283],
	[0, 330],
	[0, 1134],
	[0, 1372],
	[0, 569],
	[1, 49],
	[0, 1258],
	[0, 280],
	[0, 279],
	[0, 1105],
	[0, 422],
	[0, 550],
	[0, 542],
	[0, 36],
	[0, 548],
	[0, 588],
	[1, 103],
	[2, 211],
	[2, 199],
	[2, 67],
	[2, 81],
	[2, 74],
	[2, 212],
	[2, 200],
	[2, 68],
	[2, 82],
	[2, 76],
	[2, 219],
	[2, 201],
	[2, 75],
	[2, 80],
	[2, 77],
	[1, 45],
	[0, 13],
	[0, 545],
	[0, 1103],
	[0, 17],
	[0, 1104],
	[0, 539],
	[0, 529],
	[2, 65],
	[0, 527],
	[0, 21],
	[2, 374],
	[0, 532],
	[0, 420],
	[0, 528],
	[0, 442],
	[2, 375],
	[2, 373],
	[0, 691],
	[1, 199],
	[1, 209],
	[2, 50],
	[2, 194],
	[2, 93],
	[2, 140],
	[2, 380],
	[2, 322],
	[2, 54],
	[2, 51],
	[2, 47],
	[2, 377],
	[2, 63],
	[2, 608],
	[2, 64],
	[1, 598],
	[1, 79],
	[1, 234],
	[1, 235],
	[1, 236],
	[1, 72],
	[1, 792],
	[1, 487],
	[1, 117],
	[1, 155],
	[1, 82],
	[0, 440],
	[0, 331],
	[2, 379],
	[2, 321],
	[2, 315],
	[2, 408],
	[1, 104],
	[0, 125],
	[2, 316],
	[2, 319],
	[2, 441],
	[2, 439],
	[2, 231],
	[2, 252],
	[2, 45],
	[2, 233],
	[2, 230],
	[2, 438],
	[1, 70],
	[1, 109],
	[0, 83],
	[2, 101],
	[2, 22],
	[2, 8],
	[2, 102],
	[2, 213],
	[2, 280],
	[2, 103],
	[2, 249],
	[1, 621],
	[1, 276],
	[1, 584],
	[2, 55],
	[2, 278],
	[2, 182],
	[2, 279],
	[1, 562],
	[2, 202],
	[2, 203],
	[2, 221],
	[1, 84],
	[0, 128],
	[2, 23],
	[2, 48],
	[2, 17],
	[2, 15],
	[1, 50],
	[1, 68],
	[2, 14],
	[2, 13],
	[2, 12],
	[2, 875],
	[0, 873],
	[0, 875],
	[0, 1744],
	[0, 1746],
	[0, 1795],
	[2, 46],
];

function zeroFill(string, size) {
	let num = string;
	while (num.length < size) {
		num = "0" + num;
	}
	return num;
}

function binaryToAscii(string) {
	let ascii = "";
	for (let i = 0; i < string.length; i += 6) {
		ascii += String.fromCharCode(parseInt(string.substring(i, Math.min(i + 6, string.length)), 2) + 63);
	}
	return ascii;
}

function asciiToBinary(string) {
	let binaryString = "";
	for (let i = 0; i < string.length; i++) {
		let num = zeroFill((string.charCodeAt(i) - 63).toString(2), 6);
		binaryString += num;
	}
	return binaryString;
}

function reverseTreeMap(node) {
	for (let i = 0; i < treeMap.length; i++) {
		if (treeMap[i][0] == node[0] && treeMap[i][1] == node[1]) {
			return i;
		}
	}
	return -1;
}

function encryptJson(civ) {
	let path = "";

	path += civ.alias.replaceAll(" ", ":");
	path += "!";

	let binaryString = "";
	for (let i = 0; i < civ.flag_palette.length; i++) {
		if (i == 0) {
			binaryString += zeroFill((civ.flag_palette[i] + 1).toString(2), 4);
		} else if (i < 7) {
			binaryString += zeroFill(civ.flag_palette[i].toString(2), 4);
		} else {
			binaryString += zeroFill(civ.flag_palette[i].toString(2), 8);
		}
	}
	path += binaryToAscii(binaryString);

	binaryString = "";
	for (let i = 0; i < treeMap.length; i++) {
		if (civ.tree[treeMap[i][0]].includes(treeMap[i][1])) {
			binaryString += "1";
		} else {
			binaryString += "0";
		}
	}
	while (binaryString.length < Math.ceil(treeMap.length / 6) * 6) {
		binaryString += "0";
	}
	path += binaryToAscii(binaryString);

	binaryString = zeroFill(civ.architecture.toString(2), 6);
	path += binaryToAscii(binaryString);

	if (civ.language) {
		binaryString = zeroFill(civ.language.toString(2), 6);
		path += binaryToAscii(binaryString);
	} else {
		path += binaryToAscii("000000");
	}
	path += "!";

	for (let i = 0; i < civ.bonuses.length; i++) {
		for (let j = 0; j < civ.bonuses[i].length; j++) {
			if (civ.bonuses[i][j] || civ.bonuses[i][j] === 0) {
				path += civ.bonuses[i][j].toString();
				if (j != civ.bonuses[i].length - 1) {
					path += ":";
				}
			}
		}
		if (i != civ.bonuses.length - 1) {
			path += ";";
		}
	}
	path = path.replaceAll(String.fromCharCode(92), "-");

	return path;
}

function decryptPath(path) {
	const separatorLength = 1;
	const flagPaletteLength = 6;
	const techtreeLength = Math.ceil(treeMap.length / 6);
	const architectureLength = 1;
	const languageLength = 1;

	path = path.replaceAll("-", String.fromCharCode(92));
	let civ = {};

	const aliasLength = path.indexOf("!");
	civ.alias = path.substring(0, aliasLength).replaceAll(":", " ");

	civ.flag_palette = [];
	const encryptedPalette = asciiToBinary(path.substring(aliasLength + 1, aliasLength + 1 + 6));
	for (let i = 0; i < 8; i++) {
		if (i == 0) {
			civ.flag_palette.push(parseInt(encryptedPalette.substring(4 * i, 4 * (i + 1)), 2) - 1);
		} else if (i < 7) {
			civ.flag_palette.push(parseInt(encryptedPalette.substring(4 * i, 4 * (i + 1)), 2));
		} else {
			civ.flag_palette.push(parseInt(encryptedPalette.substring(4 * i, 4 * (i + 2)), 2));
		}
	}

	civ.tree = [[], [], []];
	const encryptedTree = asciiToBinary(
		path.substring(aliasLength + separatorLength + flagPaletteLength, aliasLength + separatorLength + flagPaletteLength + techtreeLength)
	);
	for (let i = 0; i < treeMap.length; i++) {
		if (encryptedTree[i] == "1") {
			civ.tree[treeMap[i][0]].push(treeMap[i][1]);
		}
	}

	civ.architecture = parseInt(
		asciiToBinary(
			path.substring(
				aliasLength + separatorLength + flagPaletteLength + techtreeLength,
				aliasLength + separatorLength + flagPaletteLength + techtreeLength + architectureLength
			)
		),
		2
	);

	civ.language = parseInt(
		asciiToBinary(
			path.substring(
				aliasLength + separatorLength + flagPaletteLength + techtreeLength + architectureLength,
				aliasLength + separatorLength + flagPaletteLength + techtreeLength + architectureLength + languageLength
			)
		),
		2
	);

	civ.bonuses = [[], [], [], [], []];
	let cardType = 0;
	path += ":;";
	let left = aliasLength + separatorLength + flagPaletteLength + techtreeLength + architectureLength + languageLength + 1;
	let right = Math.min(path.indexOf(":", left), path.indexOf(";", left));
	while (true) {
		if (path.substring(left, right) != "") {
			let bonusInfo = path.substring(left, right).split(",");
			if (bonusInfo.length != 2) {
				civ.bonuses[cardType].push(parseInt(bonusInfo));
			} else {
				civ.bonuses[cardType].push([parseInt(bonusInfo[0]), parseInt(bonusInfo[1])]);
			}
		}
		if (path.indexOf(";", left) < path.indexOf(":", left)) {
			cardType++;
		}
		left = right + 1;
		right = Math.min(path.indexOf(":", left), path.indexOf(";", left));
		if (right == -1) {
			break;
		}
	}

	return JSON.stringify(civ);
}

const resize = () => {
	if (document.getElementById("player")) {
		document.getElementById("player").style.top = `${
			document.getElementById("sideheader").getBoundingClientRect().height + document.getElementById("sideheader").getBoundingClientRect().top
		}px`;
		document.getElementById("sliderbox").style.top = `${
			document.getElementById("player").getBoundingClientRect().height + parseInt(document.getElementById("player").style.top) + 20
		}px`;
		document.getElementById("filterbox").style.top = `${
			document.getElementById("sliderbox").getBoundingClientRect().height + parseInt(document.getElementById("sliderbox").style.top) + 20
		}px`;
		document.getElementById("raritybox").style.top = `${
			document.getElementById("filterbox").getBoundingClientRect().height + parseInt(document.getElementById("filterbox").style.top) + 20
		}px`;
		document.getElementById("editionbox").style.top = `${
			document.getElementById("raritybox").getBoundingClientRect().height + parseInt(document.getElementById("raritybox").style.top) + 20
		}px`;
		document.getElementById("boardtoolbar").style.top = `${
			document.getElementById("editionbox").getBoundingClientRect().height + parseInt(document.getElementById("editionbox").style.top) + 20
		}px`;
	}
};

let filterRarities = [true, true, true, true, true];
let filterEditions = [true, true];
let editionDisplay = true;

function filterCards(filterText) {
	for (let i = 0; i < num_cards[roundType]; i++) {
		let card = document.getElementById("card" + i);
		let cardVisible = true;

		if (filterRarities[card_descriptions[roundType][i][1]] == false || filterEditions[card_descriptions[roundType][i][2]] == false) {
			cardVisible = false;
		}
		if (filterText != "") {
			if (!card_descriptions[roundType][i][0].toLowerCase().includes(filterText)) {
				cardVisible = false;
			}
		}

		if (cardVisible) {
			card.style.display = "block";
		} else {
			card.style.display = "none";
		}
	}
}

function displayEdition() {
	document.querySelectorAll(".card").forEach((cardElement) => {
		if (editionDisplay) {
			cardElement.style.marginBottom = `${cardSize / 3}rem`;
		} else {
			cardElement.style.marginBottom = `${cardSize / 10}rem`;
		}
	});
	document.querySelectorAll(".cardedition").forEach((editionElement) => {
		if (editionDisplay) {
			editionElement.style.display = "block";
		} else {
			editionElement.style.display = "none";
		}
	});
}

let expanded = false;

function showCheckboxes() {
	let checkboxes = document.getElementById("checkboxes");
	if (!checkboxes) {
		return;
	}

	if (!expanded) {
		checkboxes.style.display = "block";
		expanded = true;
	} else {
		checkboxes.style.display = "none";
		expanded = false;
	}
}

function showCheckboxes2() {
	let checkboxes = document.getElementById("checkboxes2");
	if (!checkboxes) {
		return;
	}

	if (!expanded) {
		checkboxes.style.display = "block";
		expanded = true;
	} else {
		checkboxes.style.display = "none";
		expanded = false;
	}
}

const unitStats = [
	{
		armors: {
			basic: [0, 0],
			elite: [0, 1],
		},
		attacks: {
			basic: [
				[27, 2],
				[3, 6],
			],
			elite: [
				[27, 2],
				[3, 7],
			],
		},
		cost: [0, 35, 0, 40],
		hp: [35, 40],
		range: [5, 6],
		reload: [2],
		speed: [0.96],
	},
	{
		armors: {
			basic: [0, 0],
			elite: [1, 0],
		},
		attacks: {
			basic: [
				[29, 1],
				[21, 1],
				[4, 7],
			],
			elite: [
				[29, 2],
				[21, 2],
				[4, 8],
			],
		},
		cost: [55, 0, 0, 25],
		hp: [60, 70],
		range: [3, 4],
		reload: [2],
		speed: [1],
	},
	{
		armors: {
			basic: [0, 6],
			elite: [0, 8],
		},
		attacks: {
			basic: [
				[29, 2],
				[21, 2],
				[4, 10],
				[15, 6],
			],
			elite: [
				[29, 3],
				[21, 3],
				[4, 12],
				[15, 10],
			],
		},
		cost: [80, 0, 0, 40],
		hp: [60, 70],
		range: [0],
		reload: [2],
		speed: [1.05],
	},
	{
		armors: {
			basic: [7, 2],
			elite: [10, 2],
		},
		attacks: {
			basic: [
				[29, 4],
				[21, 4],
				[4, 14],
			],
			elite: [
				[29, 4],
				[21, 4],
				[4, 17],
			],
		},
		cost: [85, 0, 0, 30],
		hp: [80, 100],
		range: [0],
		reload: [2],
		speed: [0.8],
	},
	{
		armors: {
			basic: [1, 1],
			elite: [1, 1],
		},
		attacks: {
			basic: [
				[29, 2],
				[21, 2],
				[4, 10],
				[19, 10],
			],
			elite: [
				[29, 3],
				[21, 3],
				[4, 12],
				[19, 12],
			],
		},
		cost: [50, 0, 0, 30],
		hp: [70, 80],
		range: [0],
		reload: [1.9],
		speed: [1],
	},
	{
		armors: {
			basic: [0, 0],
			elite: [0, 0],
		},
		attacks: {
			basic: [
				[27, 2],
				[3, 8],
			],
			elite: [
				[27, 2],
				[3, 8],
			],
		},
		cost: [0, 40, 0, 35],
		hp: [45, 50],
		range: [4],
		reload: [3],
		speed: [0.96],
	},
	{
		armors: {
			basic: [2, 1],
			elite: [2, 1],
		},
		attacks: {
			basic: [
				[1, 9],
				[4, 9],
				[32, 9],
			],
			elite: [
				[1, 12],
				[4, 12],
				[32, 10],
			],
		},
		cost: [70, 0, 0, 75],
		hp: [110, 150],
		range: [0],
		reload: [1.8, 1.7],
		speed: [1.35],
	},
	{
		armors: {
			basic: [0, 0],
			elite: [1, 0],
		},
		attacks: {
			basic: [
				[4, 8],
				[8, 9],
			],
			elite: [
				[4, 10],
				[8, 12],
				[35, 1],
			],
		},
		cost: [55, 0, 0, 85],
		hp: [80, 90],
		range: [3],
		reload: [2],
		speed: [1.4],
	},
	{
		armors: {
			basic: [1, 2],
			elite: [1, 3],
		},
		attacks: {
			basic: [
				[11, 30],
				[4, 15],
				[13, 30],
			],
			elite: [
				[11, 30],
				[4, 20],
				[13, 30],
			],
		},
		cost: [170, 0, 0, 85],
		hp: [450, 600],
		range: [0],
		reload: [2],
		speed: [0.8],
	},
	{
		armors: {
			basic: [1, 0],
			elite: [2, 0],
		},
		attacks: {
			basic: [
				[3, 17],
				[17, 2],
			],
			elite: [
				[3, 22],
				[17, 3],
			],
		},
		cost: [60, 0, 0, 55],
		hp: [35, 40],
		range: [7, 8],
		reload: [3.45],
		speed: [0.96],
	},
	{
		armors: {
			basic: [1, 1],
			elite: [2, 1],
		},
		attacks: {
			basic: [
				[29, 2],
				[21, 2],
				[4, 12],
			],
			elite: [
				[29, 3],
				[21, 3],
				[4, 14],
			],
		},
		cost: [65, 0, 0, 25],
		hp: [54, 62],
		range: [0],
		reload: [2],
		speed: [1.05],
		special: "Regenerates HP",
	},
	{
		armors: {
			basic: [0, 0],
			elite: [1, 0],
		},
		attacks: {
			basic: [
				[27, 1],
				[3, 6],
				[20, 3],
			],
			elite: [
				[27, 1],
				[3, 8],
				[20, 5],
			],
		},
		cost: [0, 55, 0, 65],
		hp: [60],
		range: [4],
		reload: [2.1],
		speed: [1.4],
	},
	{
		armors: {
			basic: [0, 1],
			elite: [0, 1],
		},
		attacks: {
			basic: [
				[29, 2],
				[21, 2],
				[4, 11],
			],
			elite: [
				[29, 3],
				[21, 3],
				[4, 14],
			],
		},
		cost: [65, 0, 0, 25],
		hp: [70, 85],
		range: [0],
		reload: [2],
		speed: [1.2],
	},
	{
		armors: {
			basic: [2, 1],
			elite: [2, 2],
		},
		attacks: {
			basic: [
				[3, 16],
				[17, 4],
			],
			elite: [
				[11, 2],
				[3, 18],
				[17, 6],
			],
		},
		cost: [60, 0, 0, 70],
		hp: [55, 70],
		range: [6],
		reload: [2.9],
		speed: [1.3],
	},
	{
		armors: {
			basic: [1, 2],
			elite: [2, 2],
		},
		attacks: {
			basic: [
				[29, 2],
				[21, 2],
				[1, 10],
				[4, 10],
				[32, 10],
			],
			elite: [
				[29, 2],
				[21, 2],
				[1, 11],
				[4, 12],
				[32, 10],
			],
		},
		cost: [60, 0, 0, 30],
		hp: [65, 75],
		range: [0],
		reload: [2],
		speed: [1],
	},
	{
		armors: {
			basic: [0, 1],
			elite: [0, 2],
		},
		attacks: {
			basic: [
				[27, 2],
				[1, 1],
				[3, 5],
				[32, 1],
			],
			elite: [
				[27, 2],
				[1, 2],
				[3, 5],
				[32, 2],
			],
		},
		cost: [0, 55, 0, 55],
		hp: [50, 65],
		range: [4, 5],
		reload: [1.9],
		speed: [1.2],
	},
	{
		armors: {
			basic: [1, 3],
			elite: [1, 4],
		},
		attacks: {
			basic: [
				[26, 10],
				[11, 8],
				[4, 8],
				[13, 12],
				[22, 8],
			],
			elite: [
				[26, 10],
				[11, 10],
				[4, 11],
				[13, 12],
				[22, 10],
			],
		},
		cost: [60, 0, 0, 60],
		hp: [100, 150],
		range: [0],
		reload: [2.1],
		speed: [1.4],
	},
	{
		armors: {
			basic: [0, 3],
			elite: [0, 4],
		},
		attacks: {
			basic: [
				[21, 5],
				[3, 9],
			],
			elite: [
				[21, 5],
				[3, 9],
			],
		},
		cost: [0, 200, 0, 60],
		hp: [150, 200],
		range: [4, 5],
		reload: [2.5],
		speed: [1.2],
	},
	{
		armors: {
			basic: [1, 0],
			elite: [1, 0],
		},
		attacks: {
			basic: [
				[3, 6],
				[8, 5],
				[16, 4],
				[5, 5],
				[30, 4],
			],
			elite: [
				[3, 6],
				[8, 7],
				[16, 5],
				[5, 7],
				[30, 6],
			],
		},
		cost: [0, 45, 0, 40],
		hp: [45, 50],
		range: [4],
		reload: [2],
		speed: [0.96],
	},
	{
		armors: {
			basic: [0, 3],
			elite: [0, 6],
		},
		attacks: {
			basic: [
				[4, 9],
				[15, 5],
				[21, 2],
				[29, 2],
			],
			elite: [
				[4, 11],
				[15, 6],
				[21, 2],
				[29, 2],
			],
		},
		cost: [30, 0, 0, 45],
		hp: [60, 70],
		range: [0],
		reload: [2],
		speed: [1.15, 1.2],
		special: "Attacks can pierce multiple enemies",
	},
	{
		armors: {
			basic: [1, 0],
			elite: [1, 0],
		},
		attacks: {
			basic: [
				[4, 7],
				[8, 8],
				[30, 6],
				[5, 20],
			],
			elite: [
				[4, 8],
				[8, 12],
				[30, 10],
				[5, 20],
				[35, 1],
			],
		},
		cost: [60, 0, 0, 30],
		hp: [70, 80],
		range: [1],
		reload: [2],
		speed: [1],
	},
	{
		armors: {
			basic: [0, 2],
			elite: [0, 2],
		},
		attacks: {
			basic: [
				[4, 9],
				[17, 1],
				[20, 5],
			],
			elite: [
				[4, 10],
				[17, 2],
				[20, 8],
			],
		},
		cost: [35, 0, 0, 45],
		hp: [75, 85],
		range: [0],
		reload: [1.8],
		speed: [1.5],
	},
	{
		armors: {
			basic: [4, 2],
			elite: [8, 3],
		},
		attacks: {
			basic: [[4, 12]],
			elite: [[4, 14]],
		},
		cost: [60, 0, 0, 70],
		hp: [100, 130],
		range: [0],
		reload: [1.9],
		speed: [1.3],
	},
	{
		armors: {
			basic: [2, 4],
			elite: [2, 6],
		},
		attacks: {
			basic: [
				[1, 2],
				[3, 6],
				[17, 1],
				[38, 2],
			],
			elite: [
				[1, 2],
				[11, 1],
				[3, 8],
				[17, 1],
				[38, 2],
			],
		},
		cost: [0, 80, 0, 70],
		hp: [60, 70],
		range: [7],
		reload: [3.45],
		speed: [0.85],
	},
	{
		armors: {
			basic: [0, 0],
			elite: [0, 1],
		},
		attacks: {
			basic: [
				[29, 2],
				[4, 16],
			],
			elite: [
				[29, 2],
				[21, 1],
				[4, 18],
			],
		},
		cost: [50, 0, 0, 30],
		hp: [45, 50],
		range: [0],
		reload: [2],
		speed: [1.2],
	},
	{
		armors: {
			basic: [0, 0],
			elite: [0, 0],
		},
		attacks: {
			basic: [
				[29, 1],
				[4, 10],
			],
			elite: [
				[29, 1],
				[4, 13],
			],
		},
		cost: [50, 0, 0, 40],
		hp: [40, 50],
		range: [5, 6],
		reload: [2],
		speed: [1.25],
	},
	{
		armors: {
			basic: [0, 1],
			elite: [1, 1],
		},
		attacks: {
			basic: [
				[3, 7],
				[28, 4],
			],
			elite: [
				[3, 8],
				[28, 6],
			],
		},
		cost: [0, 50, 0, 60],
		hp: [55, 60],
		range: [4],
		reload: [2],
		speed: [1.4],
	},
	{
		armors: {
			basic: [0, 3],
			elite: [0, 3],
		},
		attacks: {
			basic: [
				[21, 3],
				[3, 10],
				[13, 3],
				[11, 2],
				[16, 8],
			],
			elite: [
				[21, 4],
				[3, 11],
				[13, 4],
				[11, 4],
				[16, 8],
			],
		},
		cost: [100, 0, 0, 80],
		hp: [250, 290],
		range: [5],
		reload: [2.5],
		speed: [0.8],
		special: "Projectiles can cut trees",
	},
	{
		armors: {
			basic: [0, 1],
			elite: [1, 1],
		},
		attacks: {
			basic: [
				[29, 2],
				[4, 7],
			],
			elite: [
				[29, 2],
				[21, 1],
				[4, 8],
			],
		},
		cost: [25, 0, 0, 15],
		hp: [30, 40],
		range: [0],
		reload: [2],
		speed: [1.2],
		special: "Units cost half population space",
	},
	{
		armors: {
			basic: [0, 1],
			elite: [0, 2],
		},
		attacks: {
			basic: [
				[3, 12],
				[17, 2],
			],
			elite: [
				[3, 14],
				[17, 2],
			],
		},
		cost: [0, 75, 0, 60],
		hp: [60, 65],
		range: [5],
		reload: [2],
		speed: [1.3],
	},
	{
		armors: {
			basic: [0, 4],
			elite: [0, 6],
		},
		attacks: {
			basic: [
				[27, 2],
				[3, 6],
			],
			elite: [
				[27, 2],
				[3, 7],
			],
		},
		cost: [0, 50, 0, 45],
		hp: [40, 45],
		range: [4, 5],
		reload: [2],
		speed: [1.1],
	},
	{
		armors: {
			basic: [2, 1],
			elite: [2, 2],
		},
		attacks: {
			basic: [[4, 12]],
			elite: [[4, 14]],
		},
		cost: [60, 0, 0, 70],
		hp: [100, 120],
		range: [0],
		reload: [2.4],
		speed: [1.35],
		special: "Upon death, continues fighting as dismounted unit",
	},
	{
		armors: {
			basic: [1, 2],
			elite: [1, 3],
		},
		attacks: {
			basic: [[4, 9]],
			elite: [[4, 11]],
		},
		cost: [60, 0, 0, 40],
		hp: [110, 140],
		range: [0],
		reload: [1.9],
		speed: [1.4],
		special: "Fighting generates gold",
	},
	{
		armors: {
			basic: [0, 0],
			elite: [0, 0],
		},
		attacks: {
			basic: [
				[27, 1],
				[3, 4],
			],
			elite: [
				[27, 1],
				[3, 5],
			],
		},
		cost: [0, 60, 0, 35],
		hp: [40, 45],
		range: [4],
		reload: [2.2],
		speed: [1.4],
	},
	{
		armors: {
			basic: [1, 1],
			elite: [2, 1],
		},
		attacks: {
			basic: [[4, 13]],
			elite: [[4, 16]],
		},
		cost: [70, 0, 0, 50],
		hp: [100, 130],
		range: [0],
		reload: [1.9],
		speed: [1.4],
		special: "Attacks ignore armor",
	},
	{
		armors: {
			basic: [2, 2],
			elite: [2, 2],
		},
		attacks: {
			basic: [[4, 8]],
			elite: [[4, 11]],
		},
		cost: [55, 0, 0, 55],
		hp: [115, 145],
		range: [0],
		reload: [1.9],
		speed: [1.35],
		special: "Rechargeable attack causes extra damage",
	},
	{
		armors: {
			basic: [2, 2],
			elite: [4, 4],
		},
		attacks: {
			basic: [
				[29, 2],
				[21, 2],
				[4, 5],
			],
			elite: [
				[29, 3],
				[21, 3],
				[4, 11],
			],
		},
		cost: [50, 0, 0, 35],
		hp: [50, 85],
		range: [0],
		reload: [2],
		speed: [0.9],
	},
	{
		armors: {
			basic: [2, 2],
			elite: [2, 2],
		},
		attacks: {
			basic: [
				[29, 2],
				[21, 4],
				[4, 8],
			],
			elite: [
				[29, 3],
				[21, 6],
				[4, 10],
			],
		},
		cost: [55, 0, 0, 20],
		hp: [80, 95],
		range: [0],
		reload: [2],
		speed: [0.9],
		special: "Attacks strip armor",
	},
	{
		armors: {
			basic: [0, 7],
			elite: [1, 10],
		},
		attacks: {
			basic: [
				[11, 1],
				[3, 10],
				[17, 3],
			],
			elite: [
				[11, 2],
				[3, 13],
				[17, 3],
			],
		},
		cost: [0, 110, 0, 70],
		hp: [160, 230],
		range: [6],
		reload: [3.45],
		speed: [0.8],
		special: "Mitigate damage of flyover projectiles",
	},
	{
		armors: {
			basic: [3, 3],
			elite: [4, 4],
		},
		attacks: {
			basic: [[4, 16]],
			elite: [[4, 18]],
		},
		cost: [80, 0, 0, 50],
		hp: [90, 100],
		range: [0],
		reload: [2],
		speed: [1.2],
		special: "Cannot be converted",
	},
	{
		armors: {
			basic: [2, 0],
			elite: [3, 2],
		},
		attacks: {
			basic: [[4, 5]],
			elite: [[4, 6]],
		},
		cost: [30, 0, 0, 60],
		hp: [95, 115],
		range: [0],
		reload: [0.9, 0.8],
		speed: [1.35],
	},
	{
		armors: {
			basic: [1, 3],
			elite: [1, 5],
		},
		attacks: {
			basic: [
				[11, 500],
				[4, 40],
				[13, 500],
				[20, 60],
				[26, 600],
			],
			elite: [
				[11, 500],
				[4, 55],
				[13, 500],
				[20, 120],
				[26, 1200],
			],
		},
		cost: [0, 0, 50, 50],
		hp: [45, 70],
		range: [0],
		reload: [0],
		speed: [1.35],
	},
	{
		armors: {
			basic: [1, 1],
			elite: [1, 2],
		},
		attacks: {
			basic: [
				[29, 2],
				[21, 2],
				[4, 11],
				[36, 9],
				[19, 5],
			],
			elite: [
				[29, 2],
				[21, 2],
				[4, 14],
				[36, 9],
				[19, 7],
			],
		},
		cost: [60, 0, 0, 30],
		hp: [50, 60],
		range: [0],
		reload: [1.8],
		speed: [1.15, 1.3],
		special: "Attacks ignore armor",
	},
	{
		armors: {
			basic: [2, 2],
			elite: [4, 2],
		},
		attacks: {
			basic: [
				[11, 8],
				[4, 7],
				[17, 8],
			],
			elite: [
				[11, 12],
				[4, 9],
				[17, 12],
			],
		},
		cost: [0, 125, 0, 50],
		hp: [160],
		range: [5],
		reload: [0.25],
		speed: [0.6],
	},
	{
		armors: {
			basic: [-3, -3],
			elite: [-3, -3],
		},
		attacks: {
			basic: [
				[21, 5],
				[3, 30],
				[17, 10],
			],
			elite: [
				[21, 5],
				[3, 30],
				[17, 10],
			],
		},
		cost: [60, 0, 0, 140],
		hp: [30],
		range: [8, 10],
		reload: [5.5],
		speed: [0.9],
	},
	{
		armors: {
			basic: [2, 3],
			elite: [3, 3],
		},
		attacks: {
			basic: [[4, 13]],
			elite: [[4, 15]],
		},
		cost: [75, 0, 0, 85],
		hp: [110, 155],
		range: [0],
		reload: [1.9],
		speed: [1.35],
		special: "Increases movement and attack speed of nearby militia-line units",
	},
	{
		armors: {
			basic: [1, 0],
			elite: [2, 0],
		},
		attacks: {
			basic: [[4, 9]],
			elite: [[4, 11]],
		},
		cost: [50, 0, 0, 85],
		hp: [70, 90],
		range: [0],
		reload: [2],
		speed: [1.15, 1.3],
		special: "Increases regeneration rate of nearby eagle units",
	},
	{
		armors: {
			basic: [99, 99],
			elite: [99, 99],
		},
		attacks: {
			basic: [
				[4, 99],
				[11, -99],
			],
			elite: [
				[4, 99],
				[11, -99],
			],
		},
		cost: [90, 0, 0, 20],
		hp: [9, 16],
		range: [0],
		reload: [0.9],
		speed: [0.99],
	},
	{
		armors: {
			basic: [0, 0],
			elite: [0, 0],
		},
		attacks: {
			basic: [
				[29, 2],
				[21, 2],
				[4, 13],
				[10, 10],
				[14, 30],
			],
			elite: [
				[29, 2],
				[21, 2],
				[4, 15],
				[10, 20],
				[14, 30],
			],
		},
		cost: [50, 0, 0, 15],
		hp: [45, 60],
		range: [0],
		reload: [2],
		speed: [1.1, 1.2],
	},
	{
		armors: {
			basic: [0, 0],
			elite: [0, 0],
		},
		attacks: {
			basic: [
				[27, 2],
				[10, 5],
				[3, 4],
				[14, 5],
			],
			elite: [
				[27, 2],
				[10, 10],
				[3, 5],
				[14, 5],
			],
		},
		cost: [0, 25, 0, 35],
		hp: [35],
		range: [4],
		reload: [1.9],
		speed: [1.1, 1.2],
	},
	{
		armors: {
			basic: [0, 1],
			elite: [0, 1],
		},
		attacks: {
			basic: [
				[29, 2],
				[21, 5],
				[4, 7],
				[26, 10],
				[22, 6],
				[13, 12],
			],
			elite: [
				[29, 2],
				[21, 10],
				[4, 11],
				[26, 10],
				[22, 12],
				[13, 12],
			],
		},
		cost: [65, 0, 0, 25],
		hp: [65, 80],
		range: [0],
		reload: [2],
		speed: [1.2],
	},
	{
		armors: {
			basic: [0, 5],
			elite: [0, 7],
		},
		attacks: {
			basic: [
				[4, 9],
				[15, 6],
			],
			elite: [
				[4, 11],
				[15, 10],
			],
		},
		cost: [70, 0, 0, 45],
		hp: [80, 100],
		range: [0],
		reload: [2],
		speed: [1.4],
	},
	{
		armors: {
			basic: [5, 5],
			elite: [7, 7],
		},
		attacks: {
			basic: [[4, 10]],
			elite: [[4, 13]],
		},
		cost: [95, 0, 0, 85],
		hp: [75, 100],
		range: [0],
		reload: [2],
		speed: [1.3],
	},
	{
		armors: {
			basic: [1, -1],
			elite: [1, -1],
		},
		attacks: {
			basic: [
				[29, 5],
				[21, 1],
				[1, 5],
				[4, 6],
				[32, 5],
			],
			elite: [
				[29, 7],
				[21, 1],
				[1, 5],
				[4, 8],
				[32, 5],
			],
		},
		cost: [40, 0, 0, 30],
		hp: [80, 105],
		range: [0],
		reload: [0.9, 0.8],
		speed: [1.1],
	},
	{
		armors: {
			basic: [6, 1],
			elite: [11, 2],
		},
		attacks: {
			basic: [[4, 11]],
			elite: [[4, 13]],
		},
		cost: [80, 0, 0, 75],
		hp: [125, 150],
		range: [0],
		reload: [2],
		speed: [1.3],
	},
	{
		armors: {
			basic: [1, 0],
			elite: [2, 0],
		},
		attacks: {
			basic: [
				[27, 2],
				[3, 5],
				[21, 3],
			],
			elite: [
				[27, 2],
				[3, 7],
				[21, 5],
			],
		},
		cost: [0, 65, 0, 55],
		hp: [80, 100],
		range: [5, 6],
		reload: [2],
		speed: [1.35],
	},
	{
		armors: {
			basic: [4, 1],
			elite: [5, 2],
		},
		attacks: {
			basic: [[4, 10]],
			elite: [[4, 12]],
		},
		cost: [75, 0, 0, 60],
		hp: [115, 145],
		range: [0],
		reload: [2],
		speed: [1.3],
		special: "Increased attack when nearby friendly monk units",
	},
	{
		armors: {
			basic: [-2, 2],
			elite: [-2, 4],
		},
		attacks: {
			basic: [
				[4, 16],
				[10, 10],
				[23, 6],
				[32, 6],
				[25, 5],
			],
			elite: [
				[4, 19],
				[10, 10],
				[23, 9],
				[32, 9],
				[25, 7],
			],
		},
		cost: [70, 0, 0, 35],
		hp: [50, 65],
		range: [0],
		reload: [2],
		speed: [1.55],
	},
	{
		armors: {
			basic: [0, 1],
			elite: [0, 2],
		},
		attacks: {
			basic: [[4, 9]],
			elite: [[4, 11]],
		},
		cost: [70, 0, 0, 70],
		hp: [95, 125],
		range: [0],
		reload: [2],
		speed: [1.52],
		special: "Speeds up nearby camel units",
	},
	{
		armors: {
			basic: [-2, 0],
			elite: [-2, 1],
		},
		attacks: {
			basic: [[3, 7]],
			elite: [[3, 9]],
		},
		cost: [0, 50, 0, 70],
		hp: [50, 65],
		range: [4],
		reload: [2],
		speed: [1.4],
	},
	{
		armors: {
			basic: [0, 3],
			elite: [0, 4],
		},
		attacks: {
			basic: [
				[3, 5],
				[28, 2],
				[15, 3],
				[27, 1],
			],
			elite: [
				[3, 6],
				[28, 3],
				[15, 5],
				[27, 1],
			],
		},
		cost: [0, 80, 0, 30],
		hp: [65, 80],
		range: [4],
		reload: [3],
		speed: [1.35],
		special: "Elite unit costs half as much gold",
	},
	{
		armors: {
			basic: [0, 1],
			elite: [0, 2],
		},
		attacks: {
			basic: [
				[4, 6],
				[8, 22],
				[5, 25],
				[30, 16],
			],
			elite: [
				[4, 7],
				[8, 44],
				[5, 50],
				[30, 32],
			],
		},
		cost: [55, 0, 0, 5],
		hp: [60, 75],
		range: [0],
		reload: [2],
		speed: [1.1],
	},
	{
		armors: {
			basic: [1, 1],
			elite: [1, 1],
		},
		attacks: {
			basic: [
				[4, 5],
				[8, 5],
				[5, 15],
				[30, 3],
			],
			elite: [
				[4, 6],
				[8, 10],
				[5, 20],
				[30, 6],
			],
		},
		cost: [40, 0, 0, 50],
		hp: [80, 95],
		range: [2],
		reload: [3],
		speed: [0.9],
	},
	{
		armors: {
			basic: [1, 0],
			elite: [1, 0],
		},
		attacks: {
			basic: [[4, 7]],
			elite: [[4, 8]],
		},
		cost: [0, 0, 0, 75],
		hp: [60, 65],
		range: [0],
		reload: [2],
		speed: [1.33],
		special: "Can kidnap villagers",
	},
	{
		armors: {
			basic: [0, 1],
			elite: [0, 1],
		},
		attacks: {
			basic: [[4, 10]],
			elite: [[4, 12]],
		},
		cost: [65, 0, 0, 40],
		hp: [70, 85],
		range: [0],
		reload: [2],
		speed: [0.95],
		special: "Deals splash damage to nearby units",
	},
	{
		armors: {
			basic: [0, 3],
			elite: [0, 5],
		},
		attacks: {
			basic: [[4, 20]],
			elite: [[4, 27]],
		},
		cost: [90, 0, 0, 10],
		hp: [40],
		range: [0],
		reload: [2],
		speed: [0.9],
	},
	{
		armors: {
			basic: [1, 1],
			elite: [1, 1],
		},
		attacks: {
			basic: [
				[4, 12],
				[19, 8],
				[36, 25],
			],
			elite: [
				[4, 14],
				[19, 12],
				[36, 50],
			],
		},
		cost: [25, 0, 0, 85],
		hp: [85, 105],
		range: [0],
		reload: [2],
		speed: [1.45],
	},
	{
		armors: {
			basic: [1, 1],
			elite: [1, 1],
		},
		attacks: {
			basic: [
				[4, 9],
				[1, 5],
				[8, 5],
				[32, 5],
			],
			elite: [
				[4, 12],
				[1, 6],
				[8, 6],
				[32, 6],
			],
		},
		cost: [75, 0, 0, 35],
		hp: [60, 75],
		range: [0],
		reload: [2],
		speed: [0.95],
	},
	{
		armors: {
			basic: [0, 0],
			elite: [1, 1],
		},
		attacks: {
			basic: [
				[4, 9],
				[8, 4],
			],
			elite: [
				[4, 12],
				[8, 6],
			],
		},
		cost: [75, 0, 0, 55],
		hp: [80, 100],
		range: [1],
		reload: [2],
		speed: [1.4],
	},
	{
		armors: {
			basic: [0, 0],
			elite: [0, 0],
		},
		attacks: {
			basic: [[3, 15]],
			elite: [[3, 19]],
		},
		cost: [45, 0, 0, 15],
		hp: [45, 55],
		range: [0],
		reload: [2],
		speed: [1.25],
	},
	{
		armors: {
			basic: [1, 0],
			elite: [1, 0],
		},
		attacks: {
			basic: [
				[4, 12],
				[21, 2],
			],
			elite: [
				[4, 14],
				[21, 2],
			],
		},
		cost: [50, 0, 0, 35],
		hp: [45, 55],
		range: [0],
		reload: [1.9],
		speed: [1.02],
		special: "Nearby friendly gunpowder, spear, and condottiero units attack faster",
	},
	{
		armors: {
			basic: [2, 2],
			elite: [3, 3],
		},
		attacks: {
			basic: [[4, 12]],
			elite: [[4, 14]],
		},
		cost: [95, 0, 0, 75],
		hp: [140, 180],
		range: [0],
		reload: [2],
		speed: [1.25],
	},
	{
		armors: {
			basic: [1, 0],
			elite: [2, 1],
		},
		attacks: {
			basic: [
				[3, 6],
				[1, 3],
				[32, 3],
			],
			elite: [
				[3, 8],
				[1, 6],
				[32, 6],
			],
		},
		cost: [0, 40, 0, 70],
		hp: [60, 80],
		range: [4],
		reload: [2],
		speed: [1.25],
		special: "Receives 50% less bonus damage",
	},
	{
		armors: {
			basic: [1, 0],
			elite: [1, 0],
		},
		attacks: {
			basic: [
				[4, 11],
				[30, 8],
				[5, 25],
			],
			elite: [
				[4, 13],
				[30, 14],
				[5, 45],
			],
		},
		cost: [50, 0, 0, 35],
		hp: [60, 90],
		range: [0],
		reload: [2],
		speed: [1.48],
	},
	{
		armors: {
			basic: [3, 0],
			elite: [5, 0],
		},
		attacks: {
			basic: [[4, 13]],
			elite: [[4, 15]],
		},
		cost: [85, 0, 0, 50],
		hp: [125, 150],
		range: [0],
		reload: [2],
		speed: [1.3],
	},
	{
		armors: {
			basic: [0, 0],
			elite: [0, 0],
		},
		attacks: {
			basic: [[4, 11]],
			elite: [[4, 14]],
		},
		cost: [0, 0, 0, 100],
		hp: [30, 40],
		range: [0],
		reload: [2],
		speed: [0.9],
		special: "Can dodge projectiles, benefits from monk upgrades",
	},
	{
		armors: {
			basic: [0, 0],
			elite: [0, 0],
		},
		attacks: {
			basic: [[4, 13]],
			elite: [[4, 16]],
		},
		cost: [65, 0, 0, 90],
		hp: [55, 65],
		range: [0],
		reload: [2],
		speed: [1.4],
		special: "Gains attack speed when in proximity with friendly villagers",
	},
	{
		armors: {
			basic: [0, 1],
			elite: [0, 2],
		},
		attacks: {
			basic: [
				[4, 8],
				[20, 8],
				[11, 1],
			],
			elite: [
				[4, 10],
				[20, 12],
				[11, 2],
			],
		},
		cost: [55, 0, 0, 35],
		hp: [55, 65],
		range: [0],
		reload: [2],
		speed: [1.15],
	},
	{
		armors: {
			basic: [1, 0],
			elite: [1, 0],
		},
		attacks: {
			basic: [
				[29, 1],
				[21, 1],
				[4, 3],
			],
			elite: [
				[29, 2],
				[21, 2],
				[4, 4],
				[1, 1],
				[32, 1],
			],
		},
		cost: [65, 0, 0, 30],
		hp: [40, 50],
		range: [5, 6],
		reload: [2],
		speed: [1.15],
		special: "Attacks deal pass-through damage",
	},
	{
		armors: {
			basic: [1, 0],
			elite: [1, 0],
		},
		attacks: {
			basic: [
				[4, 8],
				[29, 2],
				[21, 1],
			],
			elite: [
				[4, 10],
				[29, 3],
				[21, 2],
			],
		},
		cost: [65, 0, 0, 20],
		hp: [55, 65],
		range: [0],
		reload: [2],
		speed: [1.05],
		special: "Rechargeable attack causes extra area damage",
	},
	{
		armors: {
			basic: [3, 2],
			elite: [3, 3],
		},
		attacks: {
			basic: [
				[3, 5],
				[27, 1],
			],
			elite: [
				[3, 6],
				[27, 2],
			],
		},
		cost: [0, 60, 0, 60],
		hp: [105, 115],
		range: [4],
		reload: [2],
		speed: [1.3],
		special: "Can switch weapons to engage in melee combat",
	},
	{
		armors: {
			basic: [1, 0],
			elite: [2, 0],
		},
		attacks: {
			basic: [
				[27, 2],
				[3, 4],
			],
			elite: [
				[27, 2],
				[3, 4],
			],
		},
		cost: [0, 35, 0, 45],
		hp: [40, 45],
		range: [4],
		reload: [2],
		speed: [0.96],
		special: "Attacks ignore armor",
	},
	{
		armors: {
			basic: [3, 2],
			elite: [5, 2],
		},
		attacks: {
			basic: [[4, 12]],
			elite: [[4, 14]],
		},
		cost: [60, 0, 0, 45],
		hp: [75, 90],
		range: [0],
		reload: [1.8],
		speed: [1.4],
		special: "Gains attack when near other Monaspa or Knights",
	},
];

// for (let i = 0; i < unitStats.length; i++) {
// 	unitStats[i].reload[0] = Math.round(unitStats[i].reload[0] * 100) / 100;
// 	if (unitStats[i].speed.length == 2) {
// 		unitStats[i].reload[1] = Math.round(unitStats[i].reload[1] * 100) / 100;
// 	}

// 	unitStats[i].speed[0] = Math.round(unitStats[i].speed[0] * 100) / 100;
// 	if (unitStats[i].speed.length == 2) {
// 		unitStats[i].speed[1] = Math.round(unitStats[i].speed[1] * 100) / 100;
// 	}
// }
// console.log(JSON.stringify(unitStats, null, 2));

try {
	module.exports = {
		card_descriptions,
	};
} catch (err) {}
