const hostname = "https://krakenmeister.com";
const route = "/civbuilder";

const num_cards = [334, 83, 54, 54, 76];
const max_sizes = [334, 1, 1, 1, 76];

const numCivs = 45;

const card_descriptions = [
	[
		"Town Centers cost -50% wood starting in the Castle Age",
		"Foot archers (except skirmishers) +1 range in Castle and Imperial Age (+2 total)",
		"Shepherds work 25% faster",
		"Castles cost -15% in Castle, -25% in Imperial Age",
		"Mounted units +20% hit points starting in Feudal Age",
		"Foragers work 10% faster",
		"Loom can be researched instantly",
		"Villagers +5 attack vs. wild boar; hunters carry +15 meat; hunt contains +20% meat",
		"+10 population in Imperial Age",
		"Infantry +1 attack vs. buildings per age (starting from Feudal Age)",
		"Infantry cost -20% in Dark, -25% in Feudal, -30% in Castle, -35% in Imperial Age",
		"Monks healing range 2x",
		"Towers garrison 2x units; Town Centers garrison +10",
		"Farms cost -40%",
		"Barracks and Stable units +1 armor in Castle and Imperial Age (+2 total)",
		"Economic drop-off buildings cost -50%",
		"Fishing Ships 2x hit points; +2P armor; work rate +5% Dark, +10% Feudal, +15% Castle, +20% Imperial Age",
		"Infantry attack 33% faster starting in Feudal Age",
		"Start with +3 villagers, -50 wood, -200 food; Town Centers support 15 population and +7 LOS",
		"Demolition ships +50% hit points",
		"Technologies cost -5% Feudal, -10% Castle, -15% Imperial Age",
		"Buildings +10% HP Dark, +20% Feudal, +30% Castle, +40% Imperial Age",
		"Fire ships attack 25% faster",
		"Camel Riders, Skirmishers, Pikemen, Halberdiers cost -25%",
		"Start with +50 wood, food",
		"Town Center, Dock 2x hit points",
		"Town Center, Dock work rate +5% Dark, +10% Feudal, +15% Castle, +20% Imperial Age",
		"Market costs -100 wood; market trade cost only 5%",
		"Transport Ships 2x hit points, 2x carry capacity",
		"Galleys attack 25% faster",
		"Camel units +25% hit points",
		"Gunpowder units +25% hit points",
		"Gold miners work 20% faster",
		"Scout Cavalry, Light Cavalry, Hussar +1 pierce armor",
		"Warships cost -15% Feudal Age, -15% Castle Age, -20% Imperial Age",
		"Infantry +20% hit points starting in Feudal Age",
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
		"Archers and Infantry cost -50% wood, Warships cost -20% wood",
		"Archer armor upgrades free",
		"Can train Turtle Ships in docks",
		"Can recruit Longboats from docks",
		"Gunpowder units cost -20%",
		"Can upgrade Heavy Camel Riders to Imperial Camel Riders",
		"Fishermen work 10% faster",
		"Stable units +1P armor in Castle and Imperial Age (+2 total)",
		"Villagers cost -8% Dark, -13% Feudal, -18% Castle, -23% Imperial Age",
		"Military units cost -10/15/20/25% food in Dark/Feudal/Castle/Imperial",
		"Buildings cost -15% stone",
		"Houses support 10 population",
		"Villagers affected by Blacksmith upgrades",
		"Can recruit slingers from Archery Ranges",
		"Villagers kill wolves with 1 strike",
		"Scout Cavalry, Light Cavalry, Hussar cost -15%",
		"Siege Workshop units 15% cheaper",
		"All units cost -20% gold",
		"Foragers generate a trickle of wood (33%)",
		"Ships +10% HP",
		"Can build Feitoria in Imperial Age",
		"Can build Caravels in docks",
		"Foot archers and skirmishers fire 18% faster",
		"Receive +100 gold, +100 food when advancing to the next age",
		"Pikeman upgrade free",
		"Buildings cost -15% wood",
		"Barracks units +1 pierce armor per age (starting from Feudal Age)",
		"Villagers drop off 10% more gold",
		"Villagers move 5% faster in Dark Age, 10% faster in Feudal Age",
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
		"Receive +100 food per Town Center",
		"Spearman-line and Skirmishers move 10% faster",
		"Each garrisoned relic gives +1 attack to Knights and Unique Unit (maximum +4)",
		"Cavalier upgrade available in Castle Age",
		"Gunpowder units +25% attack",
		"Economic upgrades cost -33% food and available one age earlier",
		"Castles built 50%, Town Centers built 100% faster",
		"Land military units (except siege weapons) receive 33% less bonus damage",
		"Farm upgrades provide +125% additional food",
		"Can build Donjon",
		"Farm upgrades free (require Mill)",
		"Forging, Iron Casting, Blast Furnace free",
		"Supplies and Gambesons free",
		"Town Watch, Town Patrol free",
		"Murder Holes, Herbal Medicine free",
		"Chemistry free",
		"Light Cavalry and Hussar upgrades free",
		"Wheelbarrow, Hand Cart free",
		"Tower upgrades free (Bombard Tower requires Chemistry)",
		"Conscription free",
		"Farmers work 15% faster",
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
		"Villagers regenerate 10 HP/min in Feudal, 15 in Castle, 20 in Imperial Age",
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
		"Town Centers spawn 2 villagers when the next Age is reached",
		"All economic upgrades researched +100% faster",
		"Castles and Kreposts +2000 HP",
		"Blacksmith upgrades are free an age after they become available",
		"Barracks cost -75 wood",
		"Stables cost -75 wood",
		"Archery Ranges cost -75 wood",
		"Monasteries cost -100 wood",
		"Siege Workshops cost -100 wood",
		"Military Buildings cost -50 wood",
		"Blacksmiths and Universities cost -100 wood",
		"Infantry +1 attack vs. villagers per age (starting in Dark Age)",
		"Fishermen and Fishing Ships carry +15",
		"Galleys +1 attack",
		"Steppe Lancers +10 attack vs. villagers",
		"Steppe Lancers attack 33% faster",
		"Elephant units attack 25% faster",
		"Stone Walls available in Dark Age",
		"Receive +50 food, +50 wood, +50 stone, +50 gold when advancing to the next age",
		"Villagers return 25 food on death",
		"Camel units attack 20% faster",
		"Mangonels can cut trees",
		"Can train a free Siege Tower in Feudal Age; Siege Towers cost -50%",
		"Rams, Siege Towers x2 garrison space",
		"Towers support 15 population",
		"Gunpowder units move 20% faster",
		"Completed castles provide 400 gold as long as they stay standing",
		"Monk units move 20% faster",
		"Melee Cavalry gain +2 bonus damage vs Skirmishers",
		"Non-unique Barracks units (except Men-at-Arms) available one age earlier",
		"Can buy cows in mills",
		"Start with an extra horse",
		"Siege Towers 2x HP",
		"Siege Towers train 100% faster",
		"Siege units cost -33% wood",
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
		"Gold resources last 30% longer",
		"Berries contain +35% more food",
		"Can upgrade Fortified Walls to City Walls in Imperial Age",
		"Fish contain +35% more food",
		"Units garrisoned in buildings heal 2x faster",
		"Repairers work 100% faster",
		"Skirmishers +1 attack vs. infantry",
		"Archery Range units +1 attack",
		"Archery range units +1 melee armor per age (starting in Feudal)",
		"Siege units +1 pierce armor in Castle and Imperial (+2 total)",
		"Parthian Tactics available in Castle Age",
		"Castle Age costs -25%",
		"Cavalry +1 attack",
		"Forging, Iron Casting, Blast Furnace add +1 damage vs. buildings",
		"All buildings +3 pierce armor",
		"Foot archers +5% speed per age (starting in Feudal)",
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
		"Castles and Kreposts deal large damage against buildings",
		"All villagers work 10% faster in Imperial Age",
		"Outposts +5 garrison capacity",
		"Villagers +10 pierce armor while building or repairing",
		"Castles and Kreposts support 50 population",
		"Bombard towers deal extra damage to rams",
		"Towers deal extra damage to cavalry",
		"Can build Monastery in Feudal Age; Monks recruited in Feudal Age have longer conversions and cannot pickup relics",
		"Scorpions, Ballista Elephants, and War Wagons train 50% faster",
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
		"Can upgrade Bombard Cannons to Houfnice",
		"Can build Caravanseri in Imperial Age",
		"Gunpowder units +1/+1P armor",
		"Receive +200 wood when advancing to the next age",
		"Barracks technologies cost -50%",
		"Skirmishers and Elephant Archers attack 25% faster",
		"Elephant units receive 25% less bonus damage and are more resistant to conversion",
		"Ships regenerate 15 HP per minute",
		"Start with 2 Forage Bushes",
		"Can garrison Mills with livestock to produce food",
		"Mounted units deal +20% bonus damage Feudal, +30% Castle, +40% Imperial Age",
		"Can garrison Docks with Fishing Ships",
		"Can train Thirisadai in docks",
		"Can recruit Shrivamsha Riders",
		"Can recruit Camel Scouts in Feudal Age",
		"Gain 20 gold for each technology researched",
		"Galley-line and Dromons +1/+1 armor",
		"Battle Elephants +1/+1P armor",
		"Monks +3/+3P armor",
		"Infantry receives double effect from Blacksmith armor upgrades",
		"Scorpions cost -60% gold and benefit from Ballistics research",
		"Legionary replaces Two-Handed Swordsman/Champion",
		"Can upgrade Heavy Scorpions to Imperial Scorpions",
		"Can upgrade Elite Battle Elephants to Royal Battle Elephants",
		"Can upgrade Elite Steppe Lancers to Royal Lancers",
		"Cavalry Archers +2 attack vs. Archers (except skirmishers)",
		"Wood and mining upgrades are 40% more effective, economic drop-off buildings cost -25%",
		"First religious building receives a free relic",
		"Savar replaces Paladin",
		"Galley-line and Dromons fire an additional projectile",
		"Fortified church replaces monastery, can recruit Warrior Priests",
		"Mule Carts replace Lumber Camps and Mining Camps",
		"Start with a Mule Cart",
		"Religious buildings provide Villagers in an 8 tile radius with +10% work rate",
		"Units and buildings receive -15% damage when fighting from higher elevation",
		"Cavalry regenerates 15% HP per minute, starting in Feudal Age",
		"Flaming Camels available in Siege Workshops in Imperial Age",
		"All buildings refund +1 stone per tile of foundation",
		"Villagers work faster when nearby other villagers",
		"Husbandry affects attack speed",
		"Trade yields 10% stone in addition to gold",
		"Blacksmith upgrades affect bonus damage",
		"Cavalry archers can dodge one projectile",
		"Farmers don't require Mills/Town Centers to drop off food",
		"Farms are smaller",
		"Archery range techs cost -50%",
		"Knights available in Feudal Age with 30HP",
		"Siege Towers can fire arrows",
	],

	[
		"Longbowmen (long-range foot archers)",
		"Throwing Axemen (ranged infantry)",
		"Huskarls (raiding infantry)",
		"Teutonic Knights (heavily armoured infantry)",
		"Samurai (anti-unique-unit infantry)",
		"Chu Ko Nu (quick-reloading foot archers)",
		"Cataphracts (anti-infantry cavalry)",
		"Mamelukes (anti-cavalry ranged camels)",
		"War Elephants (melee elephants)",
		"Janissaries (gunpowder)",
		"Berserks (regenerating infantry)",
		"Mangudai (anti-siege cavalry archers)",
		"Woad Raiders (light infantry)",
		"Conquistadors (mounted gunpowder)",
		"Jaguar Warriors (anti-infantry infantry)",
		"Plumed Archers (mobile foot archers)",
		"Tarkans (anti-building cavalry)",
		"War Wagons (mobile ballista)",
		"Genoese Crossbowmen (anti-cavalry foot archer)s",
		"Ghulam (infantry)",
		"Kamayuks (anti-cavalry infantry)",
		"Magyar Huszars (anti-siege cavalry)",
		"Boyars (heavily armoured cavalry)",
		"Organ Guns (anti-infantry siege)",
		"Shotel Warriors (flexible infantry)",
		"Gbetos (ranged infantry)",
		"Camel Archers (anti-cavalry ranged camels)",
		"Ballista Elephants (mobile ballista)",
		"Karambit Warriors (cheap infantry)",
		"Arambai (anti-building ranged cavalry)",
		"Rattan Archers (anti-archer foot archer)",
		"Konniks (cavalry and infantry)",
		"Keshiks (heavy cavalry)",
		"Kipchaks (quick-reloading cavalry archers)",
		"Leitis (offensive cavalry)",
		"Coustilliers (shock cavalry)",
		"Serjeants (heavy infantry)",
		"Obuch (anti-armour infantry)",
		"Hussite Wagons (anti-archer siege)",
		"Crusader Knights (unconvertible heavy cavalry)",
		"Xolotl Warriors (fast attacking cavalry)",
		"Saboteurs (anti-building explosive units)",
		"Ninjas (anti-armour infantry)",
		"Flamethrowers (flexible siege)",
		"Photonmen (anti-armour futuristic)",
		"Centurions (anti-infantry cavalry)",
		"Apukispay (flexible infantry)",
		"Monkey Boys (anti-melee animals)",
		"Amazon Warriors (anti-villager infantry)",
		"Amazon Archers (anti-villager foot archers)",
		"Iroquois Warriors (anti-building infantry)",
		"Varangian Guards (anti-ranged cavalry)",
		"Gendarmes (heavily armoured cavalry)",
		"Cuahchiqueh (anti-infantry infantry)",
		"Ritterbruder (heavily armoured cavalry)",
		"Kazaks (heavy cavalry archers)",
		"Szlachcic (heavy cavalry)",
		"Cuirassiers (raiding cavalry)",
		"Rajputs (anti-archer cavalry)",
		"Seljuk Archers (long-range cavalry archers)",
		"Numidian Javelinmen (anti-archer cavalry skirmishers)",
		"Sosso Guards (anti-elephant infantry)",
		"Swiss Pikemen (anti-cavalry infantry)",
		"Headhunters (anti-villager cavalry)",
		"Teulu (flexible infantry)",
		"Maillotins (anti-armour infantry)",
		"Hashashin (anti-unique-unit cavalry)",
		"Zweihander (anti-infantry infantry)",
		"Stradiot (anti-cavalry cavalry)",
		"Ahosi (piercing melee infantry)",
		"Spadoni (anti-gunpowder infantry)",
		"Clibinarii (anti-archer cavalry)",
		"Silahtar (heavy cavalry archers)",
		"Jaridah (anti-villager cavalry)",
		"Wolf Warriors (offensive cavalry)",
		"Warrior Monks (infantry monk hybrid)",
		"Castellan (light cavalry)",
		"Lightning Warriors (anti-archer infantry)",
		"Chakram Throwers (infantry)",
		"Urumi Swordsmen (infantry)",
		"Rathas (cavalry archer/cavalry)",
		"Composite Bowmen (anti-armor archer)",
		"Monaspa (synergistic cavalry)",
	],

	[
		"Atlatl (Skirmishers +1 attack, +1 range) [400F 350G]",
		"Kasbah (team Castles work 25% faster) [250F 250G]",
		"Yeomen (+1 foot archer and skirmisher range, +2 tower attack) [750W 450G]",
		"Stirrups (Cavalry attack 33% faster) [400F 200G]",
		"Burgundian Vineyards (Farmers slowly generate gold in addition to food) [400F 300G]",
		"Manipur Cavalry (Cavalry +4 attack vs. archers) [300F 300G]",
		"Greek Fire (Fire ships +1 range, Bombard Towers and Dromons increased blast radius) [250F 300G]",
		"Stronghold (Castles, Kreposts and Towers fire 33% faster, Castles and Kreposts heal allied infantry in a 7 tile radius) [250F 200G]",
		"Great Wall (Walls and towers +30% HP) [400W 200S]",
		"Steppe Husbandry (Light Cavalry, Steppe Lancers and Cavalry Archers trained 100% faster) [200F 300W]",
		"Royal Heirs (Unique Unit and Camels receive -3 damage from Mounted Units) [300F 300G]",
		"Bearded Axe (Unique Unit +2 attack) [300F 300G]",
		"Anarchy (create Unique Unit at barracks) [450F 250G]",
		"Marauders (create Unique Unit at stables) [300W 200G]",
		"Andean Sling (Skirmishers and Slingers no minimum range, Slingers +1 attack) [200F 300G]",
		"Grand Trunk Road (All gold income 10% faster) [250F 200W]",
		"Pavise (Archer-line, Condottiero, and Unique Unit +1/+1 armor) [200W 150G]",
		"Yasama (Towers shoot extra arrows) [300F 300W]",
		"Tusk Swords (Elephant units +3 attack) [300W 450G]",
		"Eupseong (Watch Towers, Guard Towers, and Keeps +2 range) [300F 300W]",
		"Hill Forts (Town Centers +3 range) [250F 250G]",
		"Corvinian Army (Unique Unit gold cost converted to additional food/wood cost) [200F 300G]",
		"Thalassocracy (upgrades Docks to Harbors, which fire arrows) [300F 300G]",
		"Tigui (Town Centers fire arrows when ungarrisoned) [200F 300W]",
		"Hul'che Javelineers (Skirmishers throw a second projectile) [300F 300G]",
		"Nomads (lost houses do not decrease population headroom) [300W 150G]",
		"Kamandaran (Archer-line gold cost is replaced by additional wood cost) [400F 300G]",
		"Carrack (Ships +1/+1 armor) [200W 300G]",
		"Madrasah (Monks return 50 gold when killed) [200F 100G]",
		"First Crusade (Each Town Center (maxiumum 5) spawns a one-time batch of 5 of your Unique Unit; units are more resistant to conversion) [400F 300G]",
		"Orthodoxy (Monk units +3/+3P armor) [200F 300G]",
		"Inquisition (Monk convert faster) [100F 300G]",
		"Silk Armor (Light Cavalry, Steppe Lancers and Cavalry Archers receive +1/+1P armor) [400W 300G]",
		"Ironclad (Siege units extra melee armor) [400W 350G]",
		"Sipahi (Cavalry Archers +20 HP) [350F 150G]",
		"Chatras (Elephant units +100 HP) [250F 250G]",
		"Chieftains (Infantry deal bonus damage to cavalry, generate gold when killing villagers, trade units, and monks) [600F 450G]",
		"Szlachta Privileges (Knights cost -60% gold) [500F 300G]",
		"Wagenburg Tactics (Gunpowder units move 15% faster) [300F 300G]",
		"Deconstruction (Siege units fire 33% faster) [400W 400G]",
		"Obsidian Arrows (Archer-line +6 attack vs. buildings) [300F 300G]",
		"Tortoise Engineers (Rams train 100% faster) [100W 200G]",
		"Panoply (Infantry +1/+1P armor, +1 attack) [300F 200G]",
		"Clout Archery (Archery Ranges work 50% faster) [150W 250G]",
		"Medical Corps (Elephant units regenerate 30 HP per minute) [300F 200G]",
		"Paiks (Unique Unit and elephant units attack 20% faster) [375W 275G]",
		"Kshatriyas (Military units cost -25% food) [500F 450G]",
		"Detinets (40% of Castle, Tower, Krepost, and Donjon stone cost replaced with wood) [400W 200G]",
		"Zealotry (Camel units +20 hit points) [400F 400G]",
		"Ballistas (Scorpions and Ballista Elephants fire 33% faster, Galleys +2 attack) [400W 300G]",
		"Bimaristan (Monk units automatically heal multiple nearby units) [300W 200G]",
		"Cilician Fleet (Demolition Ships +20% blast radius; Galley-line and Dromons +1 range) [350W 300G]",
		"Svan Towers (Defensive buildings +2 attack; towers fire arrows that pierce multiple units) [300F 200G]",
		"Replaceable Parts (Siege units +1/+1P armor, repairing siege is free) [400W 250G]",
	],

	[
		"Garland Wars (Infantry +4 attack) [450F 750G]",
		"Maghrebi Camels (Camel units regenerate) [700F 300G]",
		"Warwolf (Trebuchets do blast damage) [800W 400G]",
		"Bagains (Militia-line gains +5 armor) [900F 450G]",
		"Flemish Revolution (Upgrades all existing Villagers to Flemish Militia; create Flemish Militia at Town Centers) [200F 150G + 10F 5G per villager]",
		"Howdah (Elephant units +1/+1P armor) [400F 300W]",
		"Logistica (Unique Unit causes trample damage) [800F 600G]",
		"Furor Celtica (Siege Workshop units +40% HP) [750F 450G]",
		"Rocketry (Unique Unit +2, Scorpions +4 attack) [750W 750G]",
		"Elite Mercenaries (team members can train 5 free elite versions of your Unique Unit per castle) [650F 400G]",
		"Torsion Engines (increases blast radius of Siege Workshop units) [1000F 600G]",
		"Chivalry (Stables work 40% faster) [600W 500G]",
		"Perfusion (Barracks work 100% faster) [400W 600G]",
		"Atheism (+100 years for Relic, Wonder victories; enemy relics generate -50% resources) [500F 3OOW]",
		"Fabric Shields (Eagles, Slingers, Unique Unit +1/+2 armor) [600F 600G]",
		"Shatagni (Hand Cannoneers +2 range) [500F 300G]",
		"Silk Road (Trade units cost -50%) [500F 250G]",
		"Kataparuto (Trebuchets fire, pack faster) [550W 300G]",
		"Double Crossbow (Scorpion and Ballista units fire two projectiles) [700F 400G]",
		"Shinkichon (Mangonel-line +1 range) [800W 500G]",
		"Tower Shields (Spearman-line and Skirmishers +2P armor) [500F 200G]",
		"Recurve Bow (Cavalry archers +1 range, +1 attack) [600W 400G]",
		"Forced Levy (Militia-line gold cost is replaced by additional food cost) [850F 500G]",
		"Farimba (Cavalry +5 attack) [650F 400G]",
		"El Dorado (Eagle Warriors have +40 hit points) [750F 450G]",
		"Drill (Siege units move 50% faster) [500W 450G]",
		"Citadels (Castles and Kreposts fire Bullets [+4 attack, +3 vs Rams, +3 vs Infantry], receive -25% bonus damage) [600W 300G]",
		"Arquebus (gunpowder units more accurate) [700F 400G]",
		"Counterweights (Trebuchets and Mangonel-line +15% attack) [650F 500G]",
		"Hauberk (Knights +1/+2P armor) [700F 600G]",
		"Druzhina (Infantry damage adjacent units) [900F 500G]",
		"Supremacy (Villagers stronger in combat) [400F 250G]",
		"Timurid Siegecraft (Trebuchets +2 range, enables Flaming Camels) [500W 400G]",
		"Crenellations (+3 range Castles garrisoned infantry fire arrows) [600F 400S]",
		"Artillery (+2 range Bombard Towers, Bombard Cannons, Cannon Galleons) [600F 650G]",
		"Paper Money (Lumberjacks slowly generate gold in addition to wood) [550F 200W]",
		"Bogsveigar (Foot Archers and Unique ships +1 attack) [650F 500G]",
		"Lechitic Legacy (Light Cavalry deals trample damage) [750F 550G]",
		"Hussite Reforms (Monks and Monastery upgrades have their gold cost replaced by food) [500F 450G]",
		"Lamellar Armor (Camels and Cavalry Archers +2/+1P armor) [500W 500G]",
		"Field Repairmen (Rams regain HP) [350W 650G]",
		"Golden Age (All buildings work 10% faster) [300S 600G]",
		"Villager's Revenge (Dead villagers become Halberdiers) [500F 250G]",
		"Gate Crashing (Ram gold cost is replaced by additional wood cost) [600W 700G]",
		"Wootz Steel (Infantry and cavalry attacks ignore armor) [750F 600G]",
		"Mahayana (Villagers and monk units take 10% less population space) [800W 650G]",
		"Frontier Guards (Camel units and Elephant Archers +4 melee armor) [800F 700G]",
		"Comitatenses (Militia-line, Knight-line, and Unique Unit train 50% faster and receive a 5 damage charge attack) [700F 800G]",
		"Fereters (Infantry (except Spearman-line) +30 HP, Warrior Priests +100% heal speed) [550F 400G]",
		"Aznauri Cavalry (Cavalry units take 15% less population space) [750F 250G]",
		"Pila (Skirmisher attacks strip armour) [700F 600G]",
		"Enlistment (Infantry take 15% less population space) [700F 300G]",
		"Marshalled Hunters (Foot archers and skirmishers take 15% less population space) [750W 250G]",
		"Shigetō Yumi (Unique Unit, Mounted Archers, and Towers attack 15% faster and deal +6 anti-unique unit damage) [750F 350G]",
	],

	[
		"Relics generate +33% gold",
		"Genitour available in the Archery Range starting in the Castle Age",
		"Archery Ranges work 10% faster",
		"Blacksmiths work 80% faster",
		"Relics generate both Gold and Food",
		"Relics visible on the map at the start of the game",
		"Monks +100% heal speed",
		"Siege Workshops work 20% faster",
		"Farms +10% food",
		"Palisade Walls +33% HP",
		"Outposts +3 LOS and cost no stone",
		"Knights +2 LOS",
		"Barracks work 20% faster",
		"Stables work 20% faster",
		"Start with a free Llama",
		"Camel and light cavalry units +2 attack vs. buildings",
		"Condottiero available in the Barracks in Imperial Age",
		"Galleys +50% LOS",
		"Scorpion and Ballista units +1 range",
		"Mangonel-line minimum range reduced",
		"Monasteries work 20% faster",
		"Cavalry Archers trained 25% faster",
		"Docks +100% LOS",
		"Universities work 80% faster",
		"Walls cost -50%",
		"Scout Cavalry, Light Cavalry, Hussar +2 LOS",
		"Knights +2 attack vs. Archers",
		"Technologies research 25% faster (excluding Age Up)",
		"Foot archers +2 attack vs. buildings",
		"Transport Ships +5 LOS and cost -50%",
		"Military buildings provide +5 population room",
		"Trade units generate +25% gold",
		"Cavalry Archers +2 LOS",
		"Units resist conversion",
		"Gunpowder units created 25% faster",
		"Imperial Skirmisher upgrade available in the Imperial Age",
		"Docks cost -15%",
		"Scout Cavalry, Light Cavalry, Hussar +1 attack vs. Archers",
		"Scorpion-line minimum range reduced",
		"Trade units +50 HP",
		"Houses built 100% faster",
		"Monks +2 LOS",
		"Herdables +2 LOS",
		"Mills, Lumber Camps, Mining Camps built 100% faster",
		"Unique Units +5% HP",
		"Skirmishers, Spearmen, and Scout-lines train 20% faster",
		"Fishing ships +2 LOS",
		"Scout-line +2 attack vs. gunpowder units",
		"Infantry +5 attack vs. Elephant units",
		"Explosive units +20% speed",
		"All resources last 5% longer",
		"Castles, Kreposts, Donjons work 10% faster",
		"Markets work 80% faster",
		"Steppe Lancers +3 LOS",
		"Spearmen +3 attack vs. cavalry",
		"Elephant units +4 attack vs. buildings",
		"Eagles +2 LOS",
		"Docks work 20% faster",
		"Monasteries 3x HP",
		"Markets 3x HP",
		"Explosive units +6 LOS",
		"Outposts and towers constructed faster",
		"Siege towers +50% garrison capacity",
		"Docks built 100% faster",
		"Infantry +2 LOS",
		"Trade carts 20% faster when empty",
		"All explosive units +40% HP",
		"Town Centers +4 LOS",
		"Upgrading Unique Units to Elite costs -20%",
		"Docks provide +5 population room",
		"Trade units yield 10% food in addition to gold",
		"Camel and elephant units created 25% faster",
		"Can train spearmen from Town Centers",
		"Can train Canoes from docks",
		"Buildings cost 25% fewer resources to repair",
		"Mounted archers -50% frame delay",
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
