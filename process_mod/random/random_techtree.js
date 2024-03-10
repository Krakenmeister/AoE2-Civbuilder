module.exports = {
  generateTechTree,
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function populateTech(techtree, index) {
  if (techtree[index][0] != 0) {
    //We can't populate something that's already populated!
    console.log("Overpopulation");
    return -1;
  } else {
    if (techtree[index][1] == -1) {
      //Root tech, we can populate it
      techtree[index][0] = 1;
    } else {
      if (techtree[techtree[index][1]][0] == 1) {
        //Parent tech is populated, we can populate current tech
        techtree[index][0] = 1;
      } else {
        //Populate parent tech
        techtree = populateTech(techtree, techtree[index][1]);
      }
    }
  }
  return techtree;
}

function getUnpopulatedIndices(techtree) {
  var unpopulatedIndices = [];
  for (var i = 4; i < techtree.length; i++) {
    if (techtree[i][0] == 0) {
      unpopulatedIndices.push(i);
    }
  }
  return unpopulatedIndices;
}

//A techtree is invalid if any available tech doesn't have it's required tech also available
function validateTechTree(techtree) {
  for (var i = 4; i < techtree.length; i++) {
    if (techtree[i][0] != 0 && techtree[i][1] != -1) {
      if (techtree[techtree[i][1]][0] == 0) {
        return false;
      }
    }
  }
  return true;
}

/*0	Unique Unit (index)
1	--Obsolete--
2	Unique Castle Age Tech (index)
3	Unique Imp Tech (index)
4	Militia    -- AUTO-FILLED --
5	Man-at-Arms
6	Long Swordsman
7	Two-Handed Swordsman
8	Champion
9	Spearman
10	Pikeman
11	Halberdier
12	Eagle Scout
13	Eagle Warrior
14	Supplies
15	Squires
16	Arson
17	Archery Range
18	Archer
19	Crossbowman
20	Arbalester
21	Skirmisher
22	Elite Skirmisher
23	Cavalry Archer
24	Heavy Cavalry Archer
25	Hand Cannoneer
26	Thumb Ring
27	Parthian Tactics
28	Stable
29	Scout Cavalry
30	Light Cavalry
31	Hussar
32	Knight
33	Cavalier
34	Paladin
35	Camel Rider
36	Heavy Camel Rider
37	Battle Elephant
38	Elite Battle Elephant
39	Steppe Lancer
40	Elite Steppe Lancer
41	Bloodlines
42	Husbandry
43	Siege Workshop
44	Battering Ram
45	Capped Ram
46	Siege Ram
47	Mangonel
48	Onager
49	Siege Onager
50	Scorpion
51	Heavy Scorpion
52	Siege Tower
53	Bombard Cannon
54	Padded Archer Armor
55	Leather Archer Armor
56	Ring Archer Armor
57	Fletching
58	Bodkin Arrow
59	Bracer
60	Forging
61	Chain Barding Armor
62	Plate Barding Armor
63	Scale Mail Armor
64	Chain Mail Armor
65	Plate Mail Armor
66	Fire Galley
67	Fire Ship
68	Fast Fire Ship
69	Demolition Raft
70	Demolition Ship
71	Heavy Demo Ship
72	Galley     -- AUTO-FILLED --
73	War Galley     -- AUTO-FILLED --
74	Galleon
75	Cannon Galleon
76	Elite Cannon Galleon
77	Gillnets
78	Careening
79	Dry Dock
80	Shipwright
81	Masonry
82	Architecture
83	Fortified Wall (research & building)
84	Ballistics
85	Guard Tower (research & unit)
86	Keep (research & unit)
87	Heated Shot
88	Murder Holes
89	Treadmill Crane
90	Chemistry
91	Bombard Tower (research & unit)
92	Siege Engineers
93	Arrowslits
94	Hoardings
95	Sappers
96	Conscription
97	Redemption
98	Atonement
99	Herbal Medicine
100	Heresy
101	Sanctity
102	Fervor
103	Faith
104	Illumination
105	Block Printing
106	Theocracy
107	Town Watch
108	Town Patrol
109	Wheelbarrow
110	Hand Cart
111	Gold Mining
112	Gold Shaft Mining
113	Stone Mining
114	Stone Shaft Mining
115	Double-Bit Axe
116	Bow Saw
117	Two-Man Saw
118	Caravan
119	Coinage
120	Banking
121	Guilds
122	Horse Collar
123	Heavy Plow
124	Crop Rotation
125	Elite Eagle Warrior
126	Stone Wall & Gate
127	Iron Casting
128	Blast Furnace
129	Scale Barding Armor*/

function generateTechTree() {
  var treeStructure = [
    [-1, -1],
    [-1, -1],
    [-1, -1],
    [-1, -1],
    [1, -1],
    [0, 4],
    [0, 5],
    [0, 6],
    [0, 7],
    [0, -1],
    [0, 9],
    [0, 10],
    [0, -1],
    [0, 12],
    [0, -1],
    [0, -1],
    [0, -1],
    [0, -1],
    [0, 17],
    [0, 18],
    [0, 19],
    [0, 17],
    [0, 21],
    [0, 17],
    [0, 23],
    [0, 17],
    [0, 17],
    [0, 17],
    [0, -1],
    [0, 28],
    [0, 29],
    [0, 30],
    [0, 28],
    [0, 32],
    [0, 33],
    [0, 28],
    [0, 35],
    [0, 28],
    [0, 37],
    [0, 28],
    [0, 39],
    [0, 28],
    [0, 28],
    [0, -1],
    [0, 43],
    [0, 44],
    [0, 45],
    [0, 43],
    [0, 47],
    [0, 48],
    [0, 43],
    [0, 50],
    [0, 43],
    [0, 43],
    [0, -1],
    [0, 54],
    [0, 55],
    [0, -1],
    [0, 57],
    [0, 58],
    [0, -1],
    [0, 129],
    [0, 61],
    [0, -1],
    [0, 63],
    [0, 64],
    [0, -1],
    [0, 66],
    [0, 67],
    [0, -1],
    [0, 69],
    [0, 70],
    [1, -1],
    [1, 72],
    [0, 73],
    [0, 90],
    [0, 75],
    [0, -1],
    [0, -1],
    [0, 78],
    [0, -1],
    [0, -1],
    [0, 81],
    [0, 126],
    [0, -1],
    [0, -1],
    [0, 85],
    [0, -1],
    [0, -1],
    [0, -1],
    [0, -1],
    [0, 90],
    [0, -1],
    [0, -1],
    [0, -1],
    [0, -1],
    [0, -1],
    [0, -1],
    [0, -1],
    [0, -1],
    [0, -1],
    [0, -1],
    [0, -1],
    [0, 161],
    [0, -1],
    [0, -1],
    [0, -1],
    [0, -1],
    [0, 107],
    [0, -1],
    [0, 109],
    [0, -1],
    [0, 111],
    [0, -1],
    [0, 113],
    [0, -1],
    [0, 115],
    [0, 116],
    [0, -1],
    [0, -1],
    [0, 119],
    [0, -1],
    [0, -1],
    [0, 122],
    [0, 123],
    [0, 13],
    [0, -1],
    [0, 60],
    [0, 127],
    [0, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
    [0, 14],
    [0, 17],
    [0, 156],
    [0, 43],
    [0, 158],
    [0, -1],
    [0, 146],
  ];

  var numTechs = getRandomInt(88, 102);
  for (var i = 0; i < numTechs; i++) {
    var unpopulatedIndices = getUnpopulatedIndices(treeStructure);
    var randIndex = getRandomInt(0, unpopulatedIndices.length);
    treeStructure = populateTech(treeStructure, unpopulatedIndices[randIndex]);
  }
  if (!validateTechTree(treeStructure)) {
    console.log("Invalid tree");
    return -1;
  } else {
    var techtree = [];
    for (var i = 0; i < treeStructure.length; i++) {
      techtree.push(treeStructure[i][0]);
    }
    return techtree;
  }
}
