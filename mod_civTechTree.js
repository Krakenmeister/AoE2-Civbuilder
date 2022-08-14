const fs = require('fs')

module.exports = {
        arrangeTechTree
}

//Name, Name String ID, Picture Index, Name String ID (Elite), Elite Tech ID, Node ID, Node ID (Elite)
const UUArray = [
	["Longbowman", 5107, 41, 5456, 360, 8, 530],
	["Throwing Axeman", 5111, 46, 5461, 363, 281, 531],
	["Huskarl", 5104, 50, 5454, 365, 41, 555],
	["Teutonic Knight", 5112, 45, 5462, 364, 25, 554],
	["Samurai", 5110, 44, 5460, 366, 291, 560],
	["Chu Ko Nu", 5102, 36, 5452, 362, 73, 559],
	["Cataphract", 5101, 35, 5451, 361, 40, 553],
	["Mameluke", 5103, 37, 5453, 368, 282, 556],
	["War Elephant", 5109, 43, 5459, 367, 239, 558],
	["Janissary", 5105, 39, 5455, 369, 46, 557],
	["Berserk", 5574, 38, 5576, 398, 692, 694],
	["Mangudai", 5108, 42, 5458, 371, 11, 561],
	["Woad Raider", 5113, 47, 5463, 370, 232, 534],
	["Conquistador", 5687, 106, 5689, 60, 771, 773],
	["Jaguar Warrior", 5667, 110, 5669, 432, 725, 726],
	["Plumed Archer", 5683, 108, 5685, 27, 763, 765],
	["Tarkan", 5675, 105, 5677, 2, 755, 757],
	["War Wagon", 5727, 117, 5729, 450, 827, 829],
	["Genoese Crossbowman", 5723, 133, 5725, 468, 866, 868],
	["Ghulam", 14431, 385, 14432, 840, 1747, 1749],
	["Kamayuk", 5686, 97, 5688, 509, 879, 881],
	["Magyar Huszar", 5728, 99, 5730, 472, 869, 871],
	["Boyar", 5447, 114, 5449, 504, 876, 878],
	["Organ Gun", 5129, 190, 5130, 563, 1001, 1003],
	["Shotel Warrior", 5143, 195, 5145, 569, 1016, 1018],
	["Gbeto", 5140, 197, 5141, 567, 1013, 1015],
	["Camel Archer", 5134, 191, 5136, 565, 1007, 1009],
	["Ballista Elephant", 5146, 231, 5147, 615, 1120, 1122],
	["Karambit Warrior", 5148, 233, 5150, 617, 1123, 1125],
	["Arambai", 5151, 230, 5152, 610, 1126, 1128],
	["Rattan Archer", 5165, 232, 5166, 621, 1129, 1131],
	["Konnik", 5288, 249, 5290, 678, 1225, 1227],
	["Keshik", 5313, 251, 5314, 680, 1228, 1230],
	["Kipchak", 5315, 252, 5327, 682, 1231, 1233],
	["Leitis", 5328, 253, 5329, 684, 1234, 1236],
	["Coustillier", 5534, 355, 5536, 751, 1655, 1657],
	["Serjeant", 5538, 356, 5540, 753, 1658, 1659],
	["Obuch", 5558, 369, 5559, 779, 1701, 1703],
	["Hussite Wagon", 5561, 370, 5563, 781, 1704, 1706],
	["Crusader Knight", 5610, 377, 5243, 852, 1801, 1802],	//Hard coded values
	["Xolotl Warrior", 5040, 351, 5244, 854, 1803, 1804],
	["Saboteur", 5588, 58, 5245, 856, 1805, 1806],
	["Ninja", 5016, 299, 5286, 858, 1807, 1808],
	["Flamethrower", 5118, 144, 5801, 860, 1809, 1810],
	["Photonman", 5043, 300, 5802, 862, 1811, 1812],
	["Centurion", 5450, 138, 5803, 864, 1813, 1814],
	["Legionary", 5670, 139, 5804, 866, 1815, 1816],
	["Monkey Boy", 5763, 132, 5805, 868, 1817, 1818],
	["Amazon Warrior", 5303, 166, 5806, 870, 1819, 1820],
	["Amazon Archer", 5304, 165, 5807, 872, 1821, 1822],
	["Iroquois Warrior", 5011, 297, 5808, 874, 1823, 1824],
	["Varangian Guard", 5548, 357, 5809, 876, 1825, 1826],
	["Gendarme", 5405, 260, 5810, 878, 1827, 1828],
	["Cuahchiqueh", 5206, 146, 5811, 880, 1829, 1830],
	["Ritterbruder", 5659, 379, 5812, 882, 1831, 1832],
	["Kazak", 5391, 256, 5813, 884, 1833, 1834],
	["Szlachcic", 5609, 376, 5814, 886, 1835, 1836],
	["Cuirassier", 5246, 325, 5815, 888, 1837, 1838],
	["Rajput", 5244, 236, 5816, 890, 1839, 1840],
	["Seljuk Archer", 5312, 53, 5817, 892, 1841, 1842],
	["Numidian Javelinman", 5775, 207, 5818, 894, 1843, 1844],
	["Sosso Guard", 5042, 350, 5819, 896, 1845, 1846],
	["Swiss Pikeman", 5410, 136, 5820, 898, 1847, 1848],
	["Headhunter", 5478, 359, 5821, 900, 1849, 1850],
	["Teulu", 5550, 368, 5822, 902, 1851, 1852],
	["Maillotin", 5551, 366, 5823, 904, 1853, 1854],
	["Hashashin", 5777, 206, 5824, 906, 1855, 1856],
	["Zweihander", 5020, 163, 5825, 908, 1857, 1858],
	["Stradiot", 5480, 361, 5826, 910, 1859, 1860],
	["Ahosi", 5220, 216, 5827, 912, 1861, 1862],
	["Spadoni", 5300, 162, 5828, 914, 1863, 1864],
	["Clibinarii", 5703, 181, 5829, 916, 1865, 1866],
	["Silahtar", 5379, 259, 5830, 918, 1867, 1868],
	["Jaridah", 5695, 119, 5831, 920, 1869, 1870],
	["Wolf Warrior", 5584, 81, 5832, 922, 1871, 1872],
	["Warrior Monk", 5239, 243, 5833, 924, 1873, 1874],
	["Castellan", 5608, 375, 5834, 926, 1875, 1876],
	["Lightning Warrior", 5017, 327, 5835, 928, 1877, 1878],
	["Apukispay", 5213, 319, 5836, 930, 1879, 1880],
	["Urumi Swordsman", 14403, 386, 14413, 826, 1735, 1737],
	["Ratha", 14414, 389, 14420, 828, 1759, 1761],
	["Chakram Thrower", 14421, 390, 14427, 830, 1741, 1743]
]

//Castle Unique Techs
//Name, Name String ID, Node ID
const UTArray1 = [
	["Atlatl", 7326, 460],
	["Kasbah", 7256, 578],
	["Yeomen", 7419, 3],
	["Stirrups", 7307, 685],
	["Burgundian Vineyards", 7342, 754],
	["Howdah", 7295, 626],
	["Greek Fire", 7313, 464],
	["Stronghold", 7369, 482],
	["Great Wall", 7368, 462],
	["Steppe Husbandry", 7311, 689],
	["Royal Heirs", 7252, 574],
	["Bearded Axe", 7324, 83],
	["Anarchy", 7427, 16],
	["Marauders", 7370, 483],
	["Andean Sling", 7266, 516],
	["Sultans", 7270, 506],
	["Pavise", 7272, 494],
	["Yasama", 7371, 484],
	["Tusk Swords", 7291, 622],
	["Eupseong", 7380, 486],
	["Hill Forts", 7399, 691],
	["Corvinian Army", 7275, 514],
	["Thalassocracy", 7293, 624],
	["Tigui", 7254, 576],
	["Hul'che Javilneers", 7379, 485],
	["Nomads", 7280, 487],
	["Kamandaran", 7281, 488],
	["Carrack", 7250, 572],
	["Madrasah", 7284, 490],
	["First Crusade", 7344, 756],
	["Orthodoxy", 7268, 512],
	["Inquisition", 7286, 492],
	["Silk Armor", 7309, 687],
	["Ironclad", 7283, 489],
	["Sipahi", 7285, 491],
	["Chatras", 7297, 628],
	["Chieftans", 7312, 463],
	["Szlachta Privileges", 7348, 782],
	["Wagenburg Tactics", 7350, 784],
	["Deconstruction", 7500, 981],	//Hard coded values
	["Obsidian Arrows", 7501, 982],
	["Tortoise Engineers", 7502, 983],
	["Panoply", 7507, 988],
	["Clout Archery", 7508, 989],
	["Medical Corps", 17357, 831],
	["Paiks", 17359, 833],
	["Kshatriyas", 17361, 835],
	["Detinets", 7448, 455],
	["Zealotry", 7424, 9]
]

//Imperial Unique Techs
//Name, Name String ID, Node ID
const UTArray2 = [
	["Garland Wars", 7429, 24],
	["Maghrebi Camels", 7257, 579],
	["Warwolf", 7327, 461],
	["Bagains", 7308, 686],
	["Flemish Revolution", 7343, 755],
	["Manipur Cavalry", 7296, 627],
	["Logistica", 7318, 61],
	["Furor Celtica", 7421, 5],
	["Rocketry", 7432, 52],
	["Elite Mercenaries", 7398, 690],
	["Torsion Engines", 7253, 575],
	["Chivalry", 7287, 493],
	["Perfusion", 7439, 457],
	["Atheism", 7428, 21],
	["Fabric Shields", 7267, 517],
	["Shatagni", 7271, 507],
	["Silk Road", 7273, 499],
	["Kataparuto", 7059, 59],
	["Double Crossbow", 7292, 623],
	["Shinkichon", 7438, 445],
	["Tower Shields", 7400, 692],
	["Recurve Bow", 7274, 515],
	["Forced Levy", 7294, 625],
	["Farimba", 7255, 577],
	["El Dorado", 7420, 4],
	["Drill", 7422, 6],
	["Mahouts", 7423, 7],
	["Arquebus", 7251, 573],
	["Counterweights", 7447, 454],
	["Hauberk", 7345, 757],
	["Druzhina", 7269, 513],
	["Supremacy", 7325, 440],
	["Timurid Siegecraft", 7310, 688],
	["Crenellations", 7426, 11],
	["Artillery", 7425, 10],
	["Paper Money", 7298, 629],
	["Berserkergang", 7431, 49],
	["Lechitic Legacy", 7349, 783],
	["Hussite Reforms", 7351, 785],	//Hard coded values
	["Lamellar Armor", 7503, 934],
	["Field Repairmen", 7504, 935],
	["Golden Age", 7505, 936],
	["Villager's Revenge", 7506, 937],
	["Gate Crashing", 7509, 940],
	["Wootz Steel", 17358, 832],
	["Mahayana", 17360, 834],
	["Frontier Guards", 17362, 836]
]

const missionary_node = {
	"Age ID": 3,
	"Building ID": 104,
	"Draw Node Type": "UnitTech",
	"Help String ID": 105691,
	"Link ID": -1,
	"Link Node Type": "BuildingTech",
	"Name": "Missionary",
	"Name String ID": 5691,
	"Node ID": 775,
	"Node Status": "ResearchedCompleted",
	"Node Type": "UniqueUnit",
	"Picture Index": 107,
	"Prerequisite IDs": [0,0,0,0,0],
	"Prerequisite Types": ["None","None","None","None","None"],
	"Trigger Tech ID": -1,
	"Use Type": "Unit"
}

const turtle_node = {
	"Age ID": 3,
	"Building ID": 45,
	"Draw Node Type": "UnitTech",
	"Help String ID": 105731,
	"Link ID": -1,
	"Link Node Type": "BuildingTech",
	"Name": "Turtle Ship",
	"Name String ID": 5731,
	"Node ID": 831,
	"Node Status": "ResearchedCompleted",
	"Node Type": "UniqueUnit",
	"Picture Index": 116,
	"Prerequisite IDs": [0,0,0,0,0],
	"Prerequisite Types": ["None","None","None","None","None"],
	"Trigger Tech ID": -1,
	"Use Type": "Unit"
}

const elite_turtle_node = {
	"Age ID": 4,
	"Building ID": 45,
	"Draw Node Type": "UnitTech",
	"Help String ID": 105732,
	"Link ID": 831,
	"Link Node Type": "UniqueUnit",
	"Name": "Elite Turtle Ship",
	"Name String ID": 5732,
	"Node ID": 832,
	"Node Status": "ResearchedCompleted",
	"Node Type": "UniqueUnit",
	"Picture Index": 116,
	"Prerequisite IDs": [0,0,0,0,0],
	"Prerequisite Types": ["None","None","None","None","None"],
	"Trigger Tech ID": 448,
	"Use Type": "Unit"
}

const longboat_node = {
	"Age ID": 3,
	"Building ID": 45,
	"Draw Node Type": "UnitTech",
	"Help String ID": 105106,
	"Link ID": -1,
	"Link Node Type": "BuildingTech",
	"Name": "Longboat",
	"Name String ID": 5106,
	"Node ID": 250,
	"Node Status": "ResearchedCompleted",
	"Node Type": "UniqueUnit",
	"Picture Index": 40,
	"Prerequisite IDs": [0,0,0,0,0],
	"Prerequisite Types": ["None","None","None","None","None"],
	"Trigger Tech ID": -1,
	"Use Type": "Unit"
}

const elite_longboat_node = {
	"Age ID": 4,
	"Building ID": 45,
	"Draw Node Type": "UnitTech",
	"Help String ID": 105457,
	"Link ID": 250,
	"Link Node Type": "UniqueUnit",
	"Name": "Elite Longboat",
	"Name String ID": 5457,
	"Node ID": 533,
	"Node Status": "ResearchedCompleted",
	"Node Type": "UniqueUnit",
	"Picture Index": 40,
	"Prerequisite IDs": [0,0,0,0,0],
	"Prerequisite Types": ["None","None","None","None","None"],
	"Trigger Tech ID": 372,
	"Use Type": "Unit"
}

const camel_node = {
	"Age ID": 4,
	"Building ID": 101,
	"Draw Node Type": "UnitTech",
	"Help String ID": 105419,
	"Link ID": 330,
	"Link Node Type": "UnitUpgrade",
	"Name": "Imperial Camel Rider",
	"Name String ID": 5419,
	"Node ID": 207,
	"Node Status": "ResearchedCompleted",
	"Node Type": "UniqueUnit",
	"Picture Index": 185,
	"Prerequisite IDs": [0,0,0,0,0],
	"Prerequisite Types": ["None","None","None","None","None"],
	"Trigger Tech ID": 521,
	"Use Type": "Unit"
}

const slinger_node = {
	"Age ID": 3,
	"Building ID": 87,
	"Draw Node Type": "UnitTech",
	"Help String ID": 105690,
	"Link ID": -1,
	"Link Node Type": "BuildingTech",
	"Name": "Slinger",
	"Name String ID": 5690,
	"Node ID": 185,
	"Node Status": "ResearchedCompleted",
	"Node Type": "UniqueUnit",
	"Picture Index": 143,
	"Prerequisite IDs": [0,0,0,0,0],
	"Prerequisite Types": ["None","None","None","None","None"],
	"Trigger Tech ID": -1,
	"Use Type": "Unit"
}

const caravel_node = {
	"Age ID": 3,
	"Building ID": 45,
	"Draw Node Type": "UnitTech",
	"Help String ID": 105132,
	"Link ID": -1,
	"Link Node Type": "BuildingTech",
	"Name": "Caravel",
	"Name String ID": 5132,
	"Node ID": 1004,
	"Node Status": "ResearchedCompleted",
	"Node Type": "UniqueUnit",
	"Picture Index": 198,
	"Prerequisite IDs": [0,0,0,0,0],
	"Prerequisite Types": ["None","None","None","None","None"],
	"Trigger Tech ID": -1,
	"Use Type": "Unit"
}

const elite_caravel_node = {
	"Age ID": 4,
	"Building ID": 45,
	"Draw Node Type": "UnitTech",
	"Help String ID": 105133,
	"Link ID": 1004,
	"Link Node Type": "UniqueUnit",
	"Name": "Elite Caravel",
	"Name String ID": 5133,
	"Node ID": 1006,
	"Node Status": "ResearchedCompleted",
	"Node Type": "UniqueUnit",
	"Picture Index": 198,
	"Prerequisite IDs": [0,0,0,0,0],
	"Prerequisite Types": ["None","None","None","None","None"],
	"Trigger Tech ID": 597,
	"Use Type": "Unit"
}

const feitoria_node = {
	"Age ID": 4,
	"Building ID": 1021,
	"Building in new column": true,
	"Building upgraded from ID": -1,
	"Draw Node Type": "Building",
	"Help String ID": 105159,
	"Link ID": -1,
	"Link Node Type": "BuildingTech",
	"Name": "Feitoria",
	"Name String ID": 5159,
	"Node ID": 1021,
	"Node Status": "ResearchedCompleted",
	"Node Type": "BuildingNonTech",
	"Picture Index": 53,
	"Prerequisite IDs": [0,0,0,0,0],
	"Prerequisite Types": ["None","None","None","None","None"],
	"Trigger Tech ID": -1,
	"Use Type": "Building"
}

const krepost_node = {
	"Age ID": 3,
	"Building ID": 1251,
	"Building in new column": true,
	"Building upgraded from ID": -1,
	"Draw Node Type": "Building",
	"Help String ID": 105349,
	"Link ID": -1,
	"Link Node Type": "BuildingTech",
	"Name": "Krepost",
	"Name String ID": 5349,
	"Node ID": 1251,
	"Node Status": "ResearchedCompleted",
	"Node Type": "BuildingTech",
	"Picture Index": 55,
	"Prerequisite IDs": [0,0,0,0,0],
	"Prerequisite Types": ["None","None","None","None","None"],
	"Trigger Tech ID": -1,
	"Use Type": "Building"
}

const donjon_node = {
	"Age ID": 2,
	"Building ID": 1665,
	"Building in new column": true,
	"Building upgraded from ID": -1,
	"Draw Node Type": "Building",
	"Help String ID": 105544,
	"Link ID": -1,
	"Link Node Type": "BuildingTech",
	"Name": "Donjon",
	"Name String ID": 5544,
	"Node ID": 1665,
	"Node Status": "ResearchedCompleted",
	"Node Type": "BuildingTech",
	"Picture Index": 84,
	"Prerequisite IDs": [0,0,0,0,0],
	"Prerequisite Types": ["None","None","None","None","None"],
	"Trigger Tech ID": -1,
	"Use Type": "Building"
}

const genitour_node = {
	"Age ID": 3,
	"Building ID": 87,
	"Draw Node Type": "UnitTech",
	"Help String ID": 105137,
	"Link ID": -1,
	"Link Node Type": "BuildingTech",
	"Name": "Genitour",
	"Name String ID": 5137,
	"Node ID": 1010,
	"Node Status": "ResearchedCompleted",
	"Node Type": "UniqueUnit",
	"Picture Index": 201,
	"Prerequisite IDs": [0,0,0,0,0],
	"Prerequisite Types": ["None","None","None","None","None"],
	"Trigger Tech ID": -1,
	"Use Type": "Unit"
}

const elite_genitour_node = {
	"Age ID": 4,
	"Building ID": 87,
	"Draw Node Type": "UnitTech",
	"Help String ID": 105139,
	"Link ID": 1010,
	"Link Node Type": "UniqueUnit",
	"Name": "Elite Genitour",
	"Name String ID": 5139,
	"Node ID": 1012,
	"Node Status": "ResearchedCompleted",
	"Node Type": "UniqueUnit",
	"Picture Index": 201,
	"Prerequisite IDs": [0,0,0,0,0],
	"Prerequisite Types": ["None","None","None","None","None"],
	"Trigger Tech ID": 599,
	"Use Type": "Unit"
}

const condottiero_node = {
	"Age ID": 4,
	"Building ID": 12,
	"Draw Node Type": "UnitTech",
	"Help String ID": 105114,
	"Link ID": -1,
	"Link Node Type": "BuildingTech",
	"Name": "Condottiero",
	"Name String ID": 5114,
	"Node ID": 882,
	"Node Status": "ResearchedCompleted",
	"Node Type": "UniqueUnit",
	"Picture Index": 134,
	"Prerequisite IDs": [0,0,0,0,0],
	"Prerequisite Types": ["None","None","None","None","None"],
	"Trigger Tech ID": -1,
	"Use Type": "Unit"
}

const skirm_node = {
	"Age ID": 4,
	"Building ID": 87,
	"Draw Node Type": "UnitTech",
	"Help String ID": 105190,
	"Link ID": 6,
	"Link Node Type": "UnitUpgrade",
	"Name": "Imperial Skirmisher",
	"Name String ID": 5190,
	"Node ID": 1155,
	"Node Status": "ResearchedCompleted",
	"Node Type": "UniqueUnit",
	"Picture Index": 229,
	"Prerequisite IDs": [0,0,0,0,0],
	"Prerequisite Types": ["None","None","None","None","None"],
	"Trigger Tech ID": 655,
	"Use Type": "Unit"
}

function getWords (num) {
	if (num == 0) {
		return "NotAvailable"
	} else {
		return "ResearchedCompleted"
	}
}

function getWordsSpecial (num) {
	if (num == 0) {
		return "NotAvailable"
	} else {
		return "ResearchRequired"
	}
}

//Builds unique unit node and elite unique unit node objects
function getUUNodes (index) {
	let nodes = [{},{}]
	nodes[0]["Age ID"] = 3
	nodes[0]["Building ID"] = 82
	nodes[0]["Draw Node Type"] = "UnitTech"
	nodes[0]["Help String ID"] = UUArray[index][1] + 100000
	nodes[0]["Link ID"] = -1
	nodes[0]["Link Node Type"] = "BuildingTech"
	nodes[0]["Name"] = UUArray[index][0]
	nodes[0]["Name String ID"] = UUArray[index][1]
	nodes[0]["Node ID"] = UUArray[index][5]
	nodes[0]["Node Status"] = "ResearchedCompleted"
	nodes[0]["Node Type"] = "UniqueUnit"
	nodes[0]["Picture Index"] = UUArray[index][2]
	nodes[0]["Prerequisite IDs"] = [0,0,0,0,0]
	nodes[0]["Prerequisite Types"] = ["None","None","None","None","None"]
	nodes[0]["Trigger Tech ID"] = -1
	nodes[0]["Use Type"] = "Unit"
	nodes[1] = Object.assign({}, nodes[0])
	nodes[1]["Age ID"] = 4
	nodes[1]["Help String ID"] = UUArray[index][3] + 100000
	nodes[1]["Link ID"] = UUArray[index][5]
	nodes[1]["Link Node Type"] = "UniqueUnit"
	nodes[1]["Name"] = "Elite " + nodes[0]["Name"]
	nodes[1]["Name String ID"] = UUArray[index][3]
	nodes[1]["Node ID"] = UUArray[index][6]
	nodes[1]["Trigger Tech ID"] = UUArray[index][4]
	return nodes
}

//Builds unique castle age and imperial age node objects
function getUTNodes (index1, index2) {
	let nodes = [{},{}]
	nodes[0]["Age ID"] = 3
	nodes[0]["Building ID"] = 82
	nodes[0]["Draw Node Type"] = "UnitTech"
	nodes[0]["Help String ID"] = UTArray1[index1][1] + 100000
	nodes[0]["Link ID"] = -1
	nodes[0]["Link Node Type"] = "BuildingTech"
	nodes[0]["Name"] = UTArray1[index1][0]
	nodes[0]["Name String ID"] = UTArray1[index1][1]
	nodes[0]["Node ID"] = UTArray1[index1][2]
	nodes[0]["Node Status"] = "ResearchedCompleted"
	nodes[0]["Node Type"] = "Research"
	nodes[0]["Picture Index"] = 33
	nodes[0]["Prerequisite IDs"] = [0,0,0,0,0]
	nodes[0]["Prerequisite Types"] = ["None","None","None","None","None"]
	nodes[0]["Trigger Tech ID"] = -1
	nodes[0]["Use Type"] = "Tech"
	nodes[1] = Object.assign({}, nodes[0])
	nodes[1]["Age ID"] = 4
	nodes[1]["Help String ID"] = UTArray2[index2][1] + 100000
	nodes[1]["Name"] = UTArray2[index2][0]
	nodes[1]["Name String ID"] = UTArray2[index2][1]
	nodes[1]["Node ID"] = UTArray2[index2][2]
	nodes[1]["Picture Index"] = 107
	return nodes
}

function arrangeTechTree (data_json, techtree_json) {
	var data = fs.readFileSync(data_json)
	var civ = JSON.parse(data)
	var vanilla_data = fs.readFileSync(techtree_json)
	var tree = JSON.parse(vanilla_data)
	//Modify tech tree appearance for all civs
	for (var i=0; i<civ.techtree.length; i++) {
		var current_civ = tree.civs[i]
		//Put Burgundian eco techs back to normal
		if (current_civ["civ_id"] == "BURGUNDIANS") {
			for (var j=0; j<current_civ.civ_techs_units.length; j++) {
				switch (current_civ.civ_techs_units[j]["Name"]) {
					case "Wheelbarrow":
					case "Hand Cart":
					case "Gold Mining":
					case "Gold Shaft Mining":
					case "Stone Mining":
					case "Stone Shaft Mining":
					case "Double-Bit Axe":
					case "Bow Saw":
					case "Two-Man Saw":
					case "Caravan":
					case "Guilds":
					case "Horse Collar":
					case "Heavy Plow":
					case "Crop Rotation":
						current_civ.civ_techs_units[j]["Age ID"]++
						break
				}
			}
		}
		//Enable/disable building techs
		for (var j=0; j<current_civ.civ_techs_buildings.length; j++) {
			switch (current_civ.civ_techs_buildings[j]["Name"]) {
				case "Stone Wall":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWords(civ.techtree[i][126])
					break
				case "Gate":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWords(civ.techtree[i][126])
					break
				case "Archery Range":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWords(civ.techtree[i][17])
					break
				case "Stable":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWords(civ.techtree[i][28])
					break
				case "Siege Workshop":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWords(civ.techtree[i][43])
					break
				case "Fortified Wall":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWordsSpecial(civ.techtree[i][83])
					break
				case "Guard Tower":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWordsSpecial(civ.techtree[i][85])
					break
				case "Keep":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWordsSpecial(civ.techtree[i][86])
					break
				case "Bombard Tower":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWordsSpecial(civ.techtree[i][91])
					break
				case "Barracks":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWordsSpecial(civ.techtree[i][137])
					break
				case "Dock":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWordsSpecial(civ.techtree[i][138])
					break
				case "Farm":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWordsSpecial(civ.techtree[i][139])
					break
				case "House":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWordsSpecial(civ.techtree[i][149])
					break
				case "Palisade Wall":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWordsSpecial(civ.techtree[i][141])
					break
				case "Palisade Gate":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWordsSpecial(civ.techtree[i][141])
					break
				case "Watch Tower":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWordsSpecial(civ.techtree[i][142])
					break
				case "Castle":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWordsSpecial(civ.techtree[i][143])
					break
				case "Market":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWordsSpecial(civ.techtree[i][144])
					break
				case "Blacksmith":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWordsSpecial(civ.techtree[i][145])
					break
				case "Monastery":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWordsSpecial(civ.techtree[i][146])
					break
				case "Fish Trap":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWordsSpecial(civ.techtree[i][147])
					break
				case "University":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWordsSpecial(civ.techtree[i][148])
					break
				case "Wonder":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWordsSpecial(civ.techtree[i][149])
					break
				case "Outpost":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWordsSpecial(civ.techtree[i][150])
					break
			}
		}

		//Remove krepost, feitoria, and donjon; make sure sicilians have watch tower
		var current_length = current_civ.civ_techs_buildings.length
		for (var j=0; j<current_length; j++) {
			switch (current_civ.civ_techs_buildings[j]["Name"]) {
				case "Krepost":
				case "Feitoria":
				case "Donjon":
					current_civ.civ_techs_buildings.splice(j, 1)
					j--
					current_length--
					break
				case "Watch Tower":
					current_civ.civ_techs_buildings[j]["Node Status"] = getWords(1);
					break
			}
		}

		//Remove unique unit nodes
		current_length = current_civ.civ_techs_units.length
		for (var j=0; j<current_length; j++) {
			if (current_civ.civ_techs_units[j]["Node Type"] == "UniqueUnit") {
				current_civ.civ_techs_units.splice(j, 1)
				j--
				current_length--
			}
		}
		//Add the right ones in
		var uniqueNodes = getUUNodes(civ.techtree[i][0])
		current_civ.civ_techs_units.unshift(uniqueNodes[0], uniqueNodes[1])

		//Replace unique tech nodes
		current_length = current_civ.civ_techs_units.length
		for (var j=0; j<current_length; j++) {
			if (current_civ.civ_techs_units[j]["Building ID"] == 82) {
				var uniqueTechs = getUTNodes(civ.castletech[i][0], civ.imptech[i][0])
				if (current_civ.civ_techs_units[j]["Picture Index"] == 33) {
					current_civ.civ_techs_units[j] = Object.assign({}, uniqueTechs[0])
				} else if (current_civ.civ_techs_units[j]["Picture Index"] == 107) {
					current_civ.civ_techs_units[j] = Object.assign({}, uniqueTechs[1])
				}
			}
		}

		//Add special nodes
		for (var j=0; j<civ.civ_bonus.length; j++) {
			var castle_index = 0
			if ((civ.civ_bonus[i][j] == 68) || (civ.civ_bonus[i][j] == 93) || (civ.civ_bonus[i][j] == 109)) {
				for (var k=0; k<current_civ.civ_techs_buildings.length; k++) {
					if (current_civ.civ_techs_buildings[k]["Name"] == "Castle") {
						castle_index = k
					}
				}
			}
			switch (civ.civ_bonus[i][j]) {
				case 43:
					current_civ.civ_techs_units.unshift(missionary_node)
					break
				case 50:
					current_civ.civ_techs_units.push(turtle_node)
					current_civ.civ_techs_units.push(elite_turtle_node)
					break
				case 51:
					current_civ.civ_techs_units.push(longboat_node)
					current_civ.civ_techs_units.push(elite_longboat_node)
					break
				case 53:
					var node = Object.assign({}, camel_node)
					node["Node Status"] = getWords(civ.techtree[i][36])
					current_civ.civ_techs_units.push(node)
					break
				case 61:
					current_civ.civ_techs_units.push(slinger_node)
					break
				case 69:
					current_civ.civ_techs_units.push(caravel_node)
					current_civ.civ_techs_units.push(elite_caravel_node)
					break
				case 68:
					current_civ.civ_techs_buildings.splice((castle_index + 1), 0, feitoria_node)
					break
				case 93:
					current_civ.civ_techs_buildings.splice((castle_index + 1), 0, krepost_node)
					break
				case 109:
					current_civ.civ_techs_buildings.splice((castle_index + 1), 0, donjon_node)
					break
			}
		}
		switch (civ.team_bonus[i]) {
			case 1:
				current_civ.civ_techs_units.push(genitour_node)
				current_civ.civ_techs_units.push(elite_genitour_node)
				break
			case 16:
				current_civ.civ_techs_units.push(condottiero_node)
				break
			case 35:
				var node = Object.assign({}, skirm_node)
				node["Node Status"] = getWords(civ.techtree[i][22])
				current_civ.civ_techs_units.push(node)
				break
		}

		//Enable/disable unit techs
		for (var j=0; j<current_civ.civ_techs_units.length; j++) {
			switch (current_civ.civ_techs_units[j]["Name"]) {
				case "Archer":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][18])
					break
				case "Crossbowman":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][19])
					break
				case "Arbalester":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][20])
					break
				case "Skirmisher":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][21])
					break
				case "Elite Skirmisher":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][22])
					break
				case "Hand Cannoneer":
					current_civ.civ_techs_units[j]["Node Status"] = getWordsSpecial(civ.techtree[i][25])
					break
				case "Cavalry Archer":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][23])
					break
				case "Heavy Cavalry Archer":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][24])
					break
				case "Thumb Ring":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][26])
					break
				case "Parthian Tactics":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][27])
					break
				case "Militia":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][4])
					break
				case "Man-at-Arms":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][5])
					break
				case "Long Swordsman":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][6])
					break
				case "Two-Handed Swordsman":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][7])
					break
				case "Champion":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][8])
					break
				case "Spearman":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][9])
					break
				case "Pikeman":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][10])
					break
				case "Halberdier":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][11])
					break
				case "Eagle Scout":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][12])
					break
				case "Eagle Warrior":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][13])
					break
				case "Elite Eagle Warrior":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][125])
					break
				case "Supplies":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][14])
					break
				case "Squires":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][15])
					break
				case "Arson":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][16])
					break
				case "Scout Cavalry":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][29])
					break
				case "Light Cavalry":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][30])
					break
				case "Hussar":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][31])
					break
				case "Bloodlines":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][41])
					break
				case "Knight":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][32])
					break
				case "Cavalier":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][33])
					break
				case "Paladin":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][34])
					break
				case "Camel Rider":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][35])
					break
				case "Heavy Camel Rider":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][36])
					break
				case "Battle Elephant":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][37])
					break
				case "Elite Battle Elephant":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][38])
					break
				case "Steppe Lancer":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][39])
					break
				case "Elite Steppe Lancer":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][40])
					break
				case "Husbandry":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][42])
					break
				case "Battering Ram":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][44])
					break
				case "Capped Ram":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][45])
					break
				case "Siege Ram":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][46])
					break
				case "Mangonel":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][47])
					break
				case "Onager":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][48])
					break
				case "Siege Onager":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][49])
					break
				case "Scorpion":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][50])
					break
				case "Heavy Scorpion":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][51])
					break
				case "Siege Tower":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][52])
					break
				case "Bombard Cannon":
					current_civ.civ_techs_units[j]["Node Status"] = getWordsSpecial(civ.techtree[i][53])
					break
				case "Padded Archer Armor":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][54])
					break
				case "Leather Archer Armor":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][55])
					break
				case "Ring Archer Armor":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][56])
					break
				case "Fletching":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][57])
					break
				case "Bodkin Arrow":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][58])
					break
				case "Bracer":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][59])
					break
				case "Forging":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][60])
					break
				case "Iron Casting":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][127])
					break
				case "Blast Furnace":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][128])
					break
				case "Scale Barding Armor":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][129])
					break
				case "Chain Barding Armor":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][61])
					break
				case "Plate Barding Armor":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][62])
					break
				case "Scale Mail Armor":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][63])
					break
				case "Chain Mail Armor":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][64])
					break
				case "Plate Mail Armor":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][65])
					break
				case "Fire Galley":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][66])
					break
				case "Fire Ship":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][67])
					break
				case "Fast Fire Ship":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][68])
					break
				case "Gillnets":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][77])
					break
				case "Cannon Galleon":
					current_civ.civ_techs_units[j]["Node Status"] = getWordsSpecial(civ.techtree[i][75])
					break
				case "Elite Cannon Galleon":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][76])
					break
				case "Demolition Raft":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][69])
					break
				case "Demolition Ship":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][70])
					break
				case "Heavy Demolition Ship":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][71])
					break
				case "Galley":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][72])
					break
				case "War Galley":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][73])
					break
				case "Galleon":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][74])
					break
				case "Careening":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][78])
					break
				case "Dry Dock":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][79])
					break
				case "Shipwright":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][80])
					break
				case "Masonry":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][81])
					break
				case "Architecture":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][82])
					break
				case "Fortified Wall":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][83])
					break
				case "Chemistry":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][90])
					break
				case "Bombard Tower":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][91])
					break
				case "Ballistics":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][84])
					break
				case "Siege Engineers":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][92])
					break
				case "Guard Tower":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][85])
					break
				case "Keep":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][86])
					break
				case "Heated Shot":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][87])
					break
				case "Arrowslits":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][93])
					break
				case "Murder Holes":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][88])
					break
				case "Treadmill Crane":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][89])
					break
				case "Hoardings":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][94])
					break
				case "Sappers":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][95])
					break
				case "Conscription":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][96])
					break
				case "Faith":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][103])
					break
				case "Redemption":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][97])
					break
				case "Illumination":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][104])
					break
				case "Atonement":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][98])
					break
				case "Block Printing":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][105])
					break
				case "Herbal Medicine":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][99])
					break
				case "Theocracy":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][106])
					break
				case "Heresy":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][100])
					break
				case "Sanctity":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][101])
					break
				case "Fervor":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][102])
					break
				case "Town Watch":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][107])
					break
				case "Town Patrol":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][108])
					break
				case "Wheelbarrow":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][109])
					break
				case "Hand Cart":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][110])
					break
				case "Gold Mining":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][111])
					break
				case "Gold Shaft Mining":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][112])
					break
				case "Stone Mining":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][113])
					break
				case "Stone Shaft Mining":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][114])
					break
				case "Double-Bit Axe":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][115])
					break
				case "Bow Saw":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][116])
					break
				case "Two-Man Saw":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][117])
					break
				case "Coinage":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][119])
					break
				case "Banking":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][120])
					break
				case "Caravan":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][118])
					break
				case "Guilds":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][121])
					break
				case "Horse Collar":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][122])
					break
				case "Heavy Plow":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][123])
					break
				case "Crop Rotation":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][124])
					break
				case "Fishing Ship":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][130])
					break
				case "Trade Cog":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][131])
					break
				case "Transport Ship":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][132])
					break
				case "Trebuchet (Packed)":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][133])
					break
				case "Monk":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][134])
					break
				case "Trade Cart":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][135])
					break
				case "Petard":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][136])
					break
				case "Feudal Age":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][152])
					break
				case "Castle Age":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][153])
					break
				case "Imperial Age":
					current_civ.civ_techs_units[j]["Node Status"] = getWords(civ.techtree[i][154])
					break
			}
		}
	}

	fs.writeFileSync(techtree_json, JSON.stringify(tree, null, 2))

}
