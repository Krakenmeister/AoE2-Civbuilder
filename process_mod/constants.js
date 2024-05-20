//0 = vanilla, 1 = allow generated bonuses
const numBonuses = [
  [334, 334], //Civ bonuses
  [83, 83], //Unique units
  [54, 54], //Castle techs
  [54, 54], //Imp techs
  [76, 76], //Team bonuses
];

const numCivs = 45;

const numBasicTechs = 162;

const techtreeNames = [
  "BRITONS",
  "FRANKS",
  "GOTHS",
  "TEUTONS",
  "JAPANESE",
  "CHINESE",
  "BYZANTINES",
  "PERSIANS",
  "SARACENS",
  "TURKS",
  "VIKINGS",
  "MONGOLS",
  "CELTS",
  "SPANISH",
  "AZTECS",
  "MAYANS",
  "HUNS",
  "KOREANS",
  "ITALIANS",
  "INDIANS",
  "INCAS",
  "MAGYAR",
  "SLAVS",
  "PORTUGUESE",
  "ETHIOPIANS",
  "MALIANS",
  "BERBERS",
  "KHMER",
  "MALAY",
  "BURMESE",
  "VIETNAMESE",
  "BULGARIANS",
  "TATARS",
  "CUMANS",
  "LITHUANIANS",
  "BURGUNDIANS",
  "SICILIANS",
  "POLES",
  "BOHEMIANS",
  "DRAVIDIANS",
  "BENGALIS",
  "GURJARAS",
  "ROMANS",
  "ARMENIANS",
  "GEORGIANS",
];

//Names and colours for flags
const nameArr = [
  "britons",
  "franks",
  "goths",
  "teutons",
  "japanese",
  "chinese",
  "byzantines",
  "persians",
  "saracens",
  "turks",
  "vikings",
  "mongols",
  "celts",
  "spanish",
  "aztecs",
  "mayans",
  "huns",
  "koreans",
  "italians",
  "indians",
  "inca",
  "magyars",
  "slavs",
  "portuguese",
  "ethiopians",
  "malians",
  "berber",
  "khmer",
  "malay",
  "burmese",
  "vietnamese",
  "bulgarians",
  "tatars",
  "cumans",
  "lithuanians",
  "burgundians",
  "sicilians",
  "poles",
  "bohemians",
  "dravidians",
  "bengalis",
  "gurjaras",
  "armenians",
  "georgians",
];
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

//Maps path files for unique unit icon images to their unique units
//Swap 043 and 037? all the mapping back and forth is quite confusing and requires more testing
const iconids = [
  "041", // Longbowman
  "046", // Throwing Axeman
  "050", // Huskarl
  "045", // Teutonic Knight
  "044", // Samurai
  "036", // Chu Ko Nu
  "035", // Cataphract
  "037", // Mameluke
  "043", // War Elephant
  "039", // Janissary
  "038", // Berserk
  "042", // Mangudai
  "047", // Woad Raider
  "106", // Conquistador
  "110", // Jaguar Warrior
  "108", // Plumed Archer
  "105", // Tarkan
  "117", // War Wagon
  "133", // Genoese Crossbow
  "093", // Ghulam
  "097", // Kamayuk
  "099", // Magyar Huszar
  "114", // Boyar
  "190", // Organ Gun
  "195", // Shotel Warrior
  "197", // Gbeto
  "191", // Camel Archer
  "231", // Ballista Elephant
  "233", // Karambit Warrior
  "230", // Arambai
  "232", // Rattan Archer
  "249", // Konnik
  "251", // Keshik
  "252", // Kipchak
  "253", // Leitis
  "355", // Coustillier
  "356", // Serjeant
  "369", // Obuch
  "370", // Hussite Wagon
  "377", // Crusader Knight
  "351", // Xolotl Warrior
  "058", // Saboteur
  "299", // Ninja
  "144", // Flamethrower
  "300", // Photonman
  "405", // Centurion
  "319", // Apukispay
  "132", // Monkey Boy
  "166", // Amazon Warrior
  "165", // Amazon Archer
  "297", // Iroquois Warrior
  "357", // Varangian Guard
  "260", // Gendarme
  "146", // Cuahchiqueh
  "379", // Ritterbruder
  "256", // Kazak
  "376", // Szlachcic
  "325", // Cuirassier
  "236", // Rajput
  "053", // Seljuk Archer
  "207", // Numidian Javelinman
  "350", // Sosso Guard
  "136", // Swiss Pikeman
  "359", // Headhunter
  "368", // Teulu
  "366", // Maillotins
  "206", // Hashashin
  "163", // Zweihander
  "361", // Stradiot
  "216", // Ahosi
  "162", // Spadoni
  "181", // Clibinarii
  "259", // Silahtar
  "119", // Jaridah
  "081", // Wolf Warrior
  "243", // Warrior Monk
  "375", // Castellan
  "327", // Lightning Warrior
  "390", // Chakram Thrower
  "386", // Urumi Swordsman
  "389", // Ratha
  "407", // Composite Bowman
  "408", // Monaspa
];
const blanks = ["040", "079", "107", "116", "134", "143", "185", "198", "201", "229", "270", "354", "371", "372", "387", "385", "391", "392", "409", "410"];

//Maps website techtree indices to data.json techtree indices
const indexDictionary = [
  {
    4: 18,
    5: 25,
    6: 22,
    7: 21,
    13: 130,
    17: 131,
    21: 73,
    24: 19,
    36: 53,
    38: 32,
    39: 23,
    74: 4,
    75: 5,
    77: 6,
    93: 9,
    125: 134,
    128: 135,
    279: 50,
    280: 47,
    283: 33,
    329: 35,
    330: 36,
    331: 133,
    358: 10,
    359: 11,
    420: 75,
    422: 45,
    440: 136,
    441: 31,
    442: 74,
    448: 29,
    473: 7,
    474: 24,
    492: 20,
    527: 70,
    528: 71,
    529: 67,
    532: 68,
    539: 72,
    542: 51,
    546: 30,
    545: 132,
    548: 46,
    550: 48,
    567: 8,
    569: 34,
    588: 49,
    691: 76,
    751: 12,
    752: 125,
    753: 13,
    873: 156,
    875: 157,
    1103: 66,
    1104: 69,
    1105: 52,
    1132: 37,
    1134: 38,
    1258: 44,
    1370: 39,
    1372: 40,
    1744: 158,
    1746: 159,
    1795: 160,
  },
  {
    12: 137,
    45: 138,
    49: 43,
    50: 139,
    70: 140,
    72: 141,
    79: 142,
    82: 143,
    84: 144,
    87: 17,
    101: 28,
    103: 145,
    104: 146,
    117: 126,
    155: 83,
    199: 147,
    209: 148,
    234: 85,
    235: 86,
    236: 91,
    276: 149,
    598: 150,
    487: 126,
  },
  {
    8: 107,
    12: 124,
    13: 123,
    14: 122,
    15: 121,
    17: 120,
    22: 151,
    23: 119,
    39: 42,
    45: 103,
    47: 90,
    48: 118,
    50: 81,
    51: 82,
    54: 89,
    55: 111,
    65: 77,
    67: 60,
    68: 127,
    74: 63,
    75: 128,
    76: 64,
    77: 65,
    80: 62,
    81: 129,
    82: 61,
    93: 84,
    101: 152,
    102: 153,
    103: 154,
    182: 112,
    199: 57,
    200: 58,
    201: 59,
    202: 115,
    203: 116,
    211: 54,
    212: 55,
    213: 109,
    215: 15,
    219: 56,
    221: 117,
    230: 105,
    231: 101,
    233: 104,
    249: 110,
    252: 102,
    278: 113,
    279: 114,
    280: 108,
    315: 96,
    316: 97,
    319: 98,
    321: 95,
    322: 88,
    373: 80,
    374: 78,
    375: 79,
    377: 92,
    379: 94,
    380: 87,
    435: 41,
    436: 27,
    437: 26,
    438: 106,
    439: 100,
    441: 99,
    602: 16,
    608: 93,
    716: 14,
    875: 155,
    46: 161,
  },
];

module.exports = {
  numBonuses,
  numBasicTechs,
  nameArr,
  colours,
  iconids,
  blanks,
  indexDictionary,
  numCivs,
  techtreeNames,
};
