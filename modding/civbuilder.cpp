#include "civbuilder.h"

Civbuilder::Civbuilder(DatFile *df, Value config, string logpath, string aipath) {
	this->df = df;
	this->config = config;
	this->logfile.open(logpath);
	this->aipath = aipath;
	this->initialize();
}

Civbuilder::~Civbuilder() {
	this->logfile.close();
	ofstream aifile;
	aifile.open(this->aipath);
	aifile << this->ai << endl;
	aifile.close();
}

void
Civbuilder::initialize() {
	this->numCivs = 45;

	this->duplicationUnits = {};

	this->unitClasses["barracks"] = {74, 75, 77, 473, 567, 93, 358, 359, 751, 753, 752, 882};
	this->unitClasses["stable"] = {448, 546, 441, 1707, 38, 283, 569, 329, 330, 207, 1132, 1134, 1370, 1372, 1181, 1755, 1751, 1753};
	this->unitClasses["archery"] = {4, 24, 492, 5, 7, 6, 1155, 39, 474, 185, 1010, 1012, 1800, 1802};
	this->unitClasses["workshop"] = {35, 1258, 422, 548, 280, 550, 588, 885, 1105, 36, 279, 542, 1709, 1744, 1746};
	this->unitClasses["elephant"] = {239, 558, 873, 875, 1120, 1122, 1132, 1134, 1744, 1746};
	this->unitClasses["gunpowder"] = {5, 36, 420, 691, 46, 557, 1001, 1003, 771, 773, 1709, 1704, 1706};
	this->unitClasses["camel"] = {329, 330, 207, 1007, 1009, 1263, 282, 556, 1755};
	this->unitClasses["explosive"] = {527, 528, 1104, 440, 1263, 706};
	this->unitClasses["scorpion"] = {279, 541};
	this->unitClasses["unique"] = {8,	 530,  281,	 531,  41,	 555,  25,	 554,  291,	 560,  73,	 559,  40,	 553,  282,	 556,  239,	 558,  46,
								   557,	 692,  694,	 11,   561,	 232,  534,	 771,  773,	 725,  726,	 763,  765,	 755,  757,	 827,  829,	 866,  868,
								   1747, 1749, 879,	 881,  869,	 871,  876,	 878,  1001, 1003, 1016, 1018, 1013, 1015, 1007, 1009, 1120, 1122, 1123,
								   1125, 1126, 1128, 1129, 1131, 1225, 1227, 1252, 1253, 1228, 1230, 1231, 1233, 1234, 1236, 1655, 1657, 1658, 1659,
								   1701, 1702, 1704, 1706, 1735, 1737, 1738, 1740, 1741, 1743, 1759, 1761, 1790, 1792, 1800, 1802, 1803, 1805};
	this->unitClasses["steppe"] = {1370, 1372};
	this->unitClasses["eagle"] = {751, 752, 753};
	this->unitClasses["ram"] = {35, 1258, 422, 548};
	this->unitClasses["footArcher"] = {4, 8, 24, 73, 185, 492, 530, 559, 763, 765, 866, 868, 1129, 1131, 1800, 1802};
	this->unitClasses["spear"] = {93, 358, 359, 1786, 1787, 1788};
	this->unitClasses["skirmisher"] = {6, 7, 1155, 583, 596, 1010, 1012};
	this->unitClasses["lightCav"] = {448, 546, 441, 1707};
	this->unitClasses["uniqueShip"] = {250, 533, 1004, 1006, 1750, 831, 832, 778};

	this->civBonuses[0] = {381};
	this->civBonuses[1] = {382, 403};
	this->civBonuses[2] = {383};
	this->civBonuses[3] = {325};
	this->civBonuses[4] = {290};
	this->civBonuses[5] = {524};
	this->civBonuses[6] = {343};
	this->civBonuses[7] = {402};
	this->civBonuses[8] = {406};
	this->civBonuses[9] = {327, 328, 329};
	this->civBonuses[10] = {344, 731, 732, 733};
	this->civBonuses[11] = {347};
	this->civBonuses[12] = {336, 353};
	this->civBonuses[13] = {314};
	this->civBonuses[14] = {334, 335};
	this->civBonuses[15] = {340};
	this->civBonuses[16] = {306, 422, 423, 424};
	this->civBonuses[17] = {341};
	this->civBonuses[18] = {302, 226, 425};
	this->civBonuses[19] = {396};
	this->civBonuses[20] = {304, 350, 351, 352};
	this->civBonuses[21] = {283, 417, 418, 419};
	this->civBonuses[22] = {397};
	this->civBonuses[23] = {284};
	this->civBonuses[24] = {223};
	this->civBonuses[25] = {342};
	this->civBonuses[26] = {409, 412};
	this->civBonuses[27] = {355};
	this->civBonuses[28] = {337};
	this->civBonuses[29] = {404};
	this->civBonuses[30] = {312};
	this->civBonuses[31] = {301};
	this->civBonuses[32] = {300};
	this->civBonuses[33] = {452};
	this->civBonuses[34] = {395, 501, 502};
	this->civBonuses[35] = {416, 415, 391};
	this->civBonuses[36] = {394};
	this->civBonuses[37] = {389};
	this->civBonuses[38] = {388};
	this->civBonuses[39] = {393};
	this->civBonuses[40] = {385};
	this->civBonuses[41] = {386};
	this->civBonuses[42] = {405};
	this->civBonuses[43] = {84};
	this->civBonuses[44] = {224};
	this->civBonuses[45] = {29, 30, 31, 32, 33, 36, 38, 40, 41, 66, 456};
	this->civBonuses[46] = {554, 227};
	this->civBonuses[47] = {458, 459};
	this->civBonuses[48] = {390};
	this->civBonuses[49] = {451};
	this->civBonuses[50] = {447, 448};
	this->civBonuses[51] = {272, 372};
	this->civBonuses[52] = {500};
	this->civBonuses[53] = {521};
	this->civBonuses[54] = {469};
	this->civBonuses[55] = {338, 552};
	this->civBonuses[56] = {496, 497, 498, 553};
	this->civBonuses[57] = {152, 153, 154, 155};
	this->civBonuses[58] = {519};
	this->civBonuses[59] = {495};
	this->civBonuses[60] = {474, 475, 476, 477, 478, 479};
	this->civBonuses[61] = {528};
	this->civBonuses[62] = {69};
	this->civBonuses[63] = {473};
	this->civBonuses[64] = {511};
	this->civBonuses[65] = {559};
	this->civBonuses[66] = {453};
	this->civBonuses[67] = {560};
	this->civBonuses[68] = {570};
	this->civBonuses[69] = {596, 597};
	this->civBonuses[70] = {607};
	this->civBonuses[71] = {587, 588, 589};
	this->civBonuses[72] = {590};
	this->civBonuses[73] = {595};
	this->civBonuses[74] = {591, 592, 593};
	this->civBonuses[75] = {594};
	this->civBonuses[76] = {584};
	this->civBonuses[77] = {585};
	this->civBonuses[78] = {586, 613};
	this->civBonuses[79] = {672};
	this->civBonuses[80] = {657};
	this->civBonuses[81] = {638};
	this->civBonuses[82] = {634};
	this->civBonuses[83] = {662, 663};
	this->civBonuses[84] = {635};
	this->civBonuses[85] = {637};
	this->civBonuses[86] = {645};
	this->civBonuses[87] = {646, 647, 648};
	this->civBonuses[88] = {649};
	this->civBonuses[89] = {665};
	this->civBonuses[90] = {632};
	this->civBonuses[91] = {693};
	this->civBonuses[92] = {694};
	this->civBonuses[93] = {695};
	this->civBonuses[94] = {704};
	this->civBonuses[95] = {696};
	this->civBonuses[96] = {698};
	this->civBonuses[97] = {711, 727, 728};
	this->civBonuses[98] = {709, 723, 724};
	this->civBonuses[99] = {295, 705, 706};
	this->civBonuses[100] = {697};
	this->civBonuses[101] = {710};
	this->civBonuses[102] = {699, 700, 701, 702};
	this->civBonuses[103] = {768};
	this->civBonuses[104] = {769};
	this->civBonuses[105] = {758, 759, 760, 761, 762, 763, 764, 765, 766, 767};
	this->civBonuses[106] = {770};
	this->civBonuses[107] = {771};
	this->civBonuses[108] = {772, 773, 774};
	this->civBonuses[109] = {775};

	this->teamBonuses[0] = 488;
	this->teamBonuses[1] = 38;
	this->teamBonuses[2] = 399;
	this->teamBonuses[3] = 707;
	this->teamBonuses[4] = 783;
	this->teamBonuses[5] = 651;
	this->teamBonuses[6] = 400;
	this->teamBonuses[7] = 401;
	this->teamBonuses[8] = 402;
	this->teamBonuses[9] = 711;
	this->teamBonuses[10] = 49;
	this->teamBonuses[11] = 403;
	this->teamBonuses[12] = 405;
	this->teamBonuses[13] = 484;
	this->teamBonuses[14] = 4;
	this->teamBonuses[15] = 2;
	this->teamBonuses[16] = 11;
	this->teamBonuses[17] = 406;
	this->teamBonuses[18] = 647;
	this->teamBonuses[19] = 505;
	this->teamBonuses[20] = 713;
	this->teamBonuses[21] = 6;
	this->teamBonuses[22] = 649;
	this->teamBonuses[23] = 43;
	this->teamBonuses[24] = 489;
	this->teamBonuses[25] = 407;
	this->teamBonuses[26] = 408;
	this->teamBonuses[27] = 32;
	this->teamBonuses[28] = 409;
	this->teamBonuses[29] = 785;
	this->teamBonuses[30] = 9;
	this->teamBonuses[31] = 490;
	this->teamBonuses[32] = 709;
	this->teamBonuses[33] = 404;
	this->teamBonuses[34] = 410;
	this->teamBonuses[35] = 653;
	this->teamBonuses[36] = 411;

	this->castleUniqueTechIDs[0] = 460;
	this->castleUniqueTechIDs[1] = 578;
	this->castleUniqueTechIDs[2] = 3;
	this->castleUniqueTechIDs[3] = 685;
	this->castleUniqueTechIDs[4] = 754;
	this->castleUniqueTechIDs[5] = 626;
	this->castleUniqueTechIDs[6] = 464;
	this->castleUniqueTechIDs[7] = 482;
	this->castleUniqueTechIDs[8] = 462;
	this->castleUniqueTechIDs[9] = 689;
	this->castleUniqueTechIDs[10] = 574;
	this->castleUniqueTechIDs[11] = 83;
	this->castleUniqueTechIDs[12] = 16;
	this->castleUniqueTechIDs[13] = 483;
	this->castleUniqueTechIDs[14] = 516;
	this->castleUniqueTechIDs[15] = 506;
	this->castleUniqueTechIDs[16] = 494;
	this->castleUniqueTechIDs[17] = 484;
	this->castleUniqueTechIDs[18] = 622;
	this->castleUniqueTechIDs[19] = 486;
	this->castleUniqueTechIDs[20] = 691;
	this->castleUniqueTechIDs[21] = 514;
	this->castleUniqueTechIDs[22] = 624;
	this->castleUniqueTechIDs[23] = 576;
	this->castleUniqueTechIDs[24] = 485;
	this->castleUniqueTechIDs[25] = 487;
	this->castleUniqueTechIDs[26] = 488;
	this->castleUniqueTechIDs[27] = 572;
	this->castleUniqueTechIDs[28] = 490;
	this->castleUniqueTechIDs[29] = 756;
	this->castleUniqueTechIDs[30] = 512;
	this->castleUniqueTechIDs[31] = 492;
	this->castleUniqueTechIDs[32] = 687;
	this->castleUniqueTechIDs[33] = 489;
	this->castleUniqueTechIDs[34] = 491;
	this->castleUniqueTechIDs[35] = 628;
	this->castleUniqueTechIDs[36] = 463;
	this->castleUniqueTechIDs[37] = 782;
	this->castleUniqueTechIDs[38] = 784;
	this->castleUniqueTechIDs[44] = 831;
	this->castleUniqueTechIDs[45] = 833;
	this->castleUniqueTechIDs[46] = 835;
	this->castleUniqueTechIDs[47] = 455;
	this->castleUniqueTechIDs[48] = 9;
	this->castleUniqueTechIDs[49] = 883;
	this->castleUniqueTechIDs[50] = 28;
	this->castleUniqueTechIDs[51] = 922;
	this->castleUniqueTechIDs[52] = 923;

	this->impUniqueTechIDs[0] = 24;
	this->impUniqueTechIDs[1] = 579;
	this->impUniqueTechIDs[2] = 461;
	this->impUniqueTechIDs[3] = 686;
	this->impUniqueTechIDs[4] = 755;
	this->impUniqueTechIDs[5] = 627;
	this->impUniqueTechIDs[6] = 61;
	this->impUniqueTechIDs[7] = 5;
	this->impUniqueTechIDs[8] = 52;
	this->impUniqueTechIDs[9] = 690;
	this->impUniqueTechIDs[10] = 575;
	this->impUniqueTechIDs[11] = 493;
	this->impUniqueTechIDs[12] = 457;
	this->impUniqueTechIDs[13] = 21;
	this->impUniqueTechIDs[14] = 517;
	this->impUniqueTechIDs[15] = 507;
	this->impUniqueTechIDs[16] = 499;
	this->impUniqueTechIDs[17] = 59;
	this->impUniqueTechIDs[18] = 623;
	this->impUniqueTechIDs[19] = 445;
	this->impUniqueTechIDs[20] = 692;
	this->impUniqueTechIDs[21] = 515;
	this->impUniqueTechIDs[22] = 625;
	this->impUniqueTechIDs[23] = 577;
	this->impUniqueTechIDs[24] = 4;
	this->impUniqueTechIDs[25] = 6;
	this->impUniqueTechIDs[26] = 7;
	this->impUniqueTechIDs[27] = 573;
	this->impUniqueTechIDs[28] = 454;
	this->impUniqueTechIDs[29] = 757;
	this->impUniqueTechIDs[30] = 513;
	this->impUniqueTechIDs[31] = 440;
	this->impUniqueTechIDs[32] = 688;
	this->impUniqueTechIDs[33] = 11;
	this->impUniqueTechIDs[34] = 10;
	this->impUniqueTechIDs[35] = 629;
	this->impUniqueTechIDs[36] = 49;
	this->impUniqueTechIDs[37] = 783;
	this->impUniqueTechIDs[38] = 785;
	this->impUniqueTechIDs[44] = 832;
	this->impUniqueTechIDs[45] = 834;
	this->impUniqueTechIDs[46] = 836;
	this->impUniqueTechIDs[47] = 884;
	this->impUniqueTechIDs[48] = 921;
	this->impUniqueTechIDs[49] = 924;

	this->uuTechIDs[0] = {263, 360};
	this->uuTechIDs[1] = {275, 363};
	this->uuTechIDs[2] = {446, 365};
	this->uuTechIDs[3] = {276, 364};
	this->uuTechIDs[4] = {262, 366};
	this->uuTechIDs[5] = {268, 362};
	this->uuTechIDs[6] = {267, 361};
	this->uuTechIDs[7] = {269, 368};
	this->uuTechIDs[8] = {274, 367};
	this->uuTechIDs[9] = {271, 369};
	this->uuTechIDs[10] = {399, 398};
	this->uuTechIDs[11] = {273, 371};
	this->uuTechIDs[12] = {277, 370};
	this->uuTechIDs[13] = {58, 60};
	this->uuTechIDs[14] = {431, 432};
	this->uuTechIDs[15] = {26, 27};
	this->uuTechIDs[16] = {1, 2};
	this->uuTechIDs[17] = {449, 450};
	this->uuTechIDs[18] = {467, 468};
	this->uuTechIDs[19] = {839, 840};
	this->uuTechIDs[20] = {508, 509};
	this->uuTechIDs[21] = {471, 472};
	this->uuTechIDs[22] = {503, 504};
	this->uuTechIDs[23] = {562, 563};
	this->uuTechIDs[24] = {568, 569};
	this->uuTechIDs[25] = {566, 567};
	this->uuTechIDs[26] = {564, 565};
	this->uuTechIDs[27] = {614, 615};
	this->uuTechIDs[28] = {616, 617};
	this->uuTechIDs[29] = {618, 619};
	this->uuTechIDs[30] = {620, 621};
	this->uuTechIDs[31] = {677, 678};
	this->uuTechIDs[32] = {679, 680};
	this->uuTechIDs[33] = {681, 682};
	this->uuTechIDs[34] = {683, 684};
	this->uuTechIDs[35] = {750, 751};
	this->uuTechIDs[36] = {752, 753};
	this->uuTechIDs[37] = {778, 779};
	this->uuTechIDs[38] = {780, 781};
	this->uuTechIDs[78] = {829, 830};
	this->uuTechIDs[79] = {825, 826};
	this->uuTechIDs[80] = {827, 828};
	this->uuTechIDs[81] = {917, 918};
	this->uuTechIDs[82] = {919, 920};
}

void
Civbuilder::configure() {
	cout << "[C++]: Setting up data" << endl;
	this->setupData();
	cout << "[C++]: Creating new data" << endl;
	this->createData();
	cout << "[C++]: Assigning data" << endl;
	this->assignData();
	cout << "[C++]: Reconfiguring" << endl;
	this->reconfigureEffects();
	cout << "[C++]: Cleaning up" << endl;
	this->cleanup();
}

void
Civbuilder::createData() {
	this->createNewUnits();
	this->createUniqueTechs();
	this->createCivBonuses();
	this->createTeamBonuses();
}

void
Civbuilder::assignData() {
	this->assignArchitectures();
	this->assignLanguages();
	this->assignUniqueUnits();
	this->assignBasicTechs();
	this->assignUniqueTechs();
	this->assignCivBonuses();
}

// Give civilizations the appropriate sfx files
void
Civbuilder::assignLanguages() {
	int civOffset = 100;

	// Copy language sound items of the civilization we want
	for (int i = 0; i < this->config["language"].size(); i++) {
		for (int j = 0; j < this->df->Sounds.size(); j++) {
			int soundSize = this->df->Sounds[j].Items.size();
			for (int k = 0; k < soundSize; k++) {
				if (this->df->Sounds[j].Items[k].Civilization == (this->config["language"][i].asInt() + 1)) {
					// Make a copy, but change its civilization so that it doesn't get re-copied
					SoundItem copySound = this->df->Sounds[j].Items[k];
					copySound.Civilization = i + 1 + civOffset;
					this->df->Sounds[j].Items.push_back(copySound);
				}
			}
		}
	}

	// Remove all the old sound items
	for (int i = 0; i < this->df->Sounds.size(); i++) {
		for (int j = 0; j < this->df->Sounds[i].Items.size(); j++) {
			if (this->df->Sounds[i].Items[j].Civilization<civOffset &&this->df->Sounds[i].Items[j].Civilization> 0) {
				this->df->Sounds[i].Items.erase(this->df->Sounds[i].Items.begin() + j);
				j--;
			}
		}
	}

	// Change all new sound items so that they are readable
	for (int i = 0; i < this->df->Sounds.size(); i++) {
		for (int j = 0; j < this->df->Sounds[i].Items.size(); j++) {
			if (this->df->Sounds[i].Items[j].Civilization >= civOffset) {
				this->df->Sounds[i].Items[j].Civilization -= civOffset;
			}
		}
	}
}

// Algorithm for transforming one array to another when we can only copy from one index to another and have only one temp slot (gaia civ stores architectures)
// Abstracted version in javascript: https://github.com/Krakenmeister/CopyTransform
void
Civbuilder::assignArchitectures() {
	vector<int> dest = {};
	for (int i = 0; i < this->config["architecture"].size(); i++) {
		dest.push_back(this->config["architecture"][i].asInt());
	}
	while (dest.size() < this->numCivs) {
		dest.push_back(1);
	}
	// Save the architecture of one of each type for copying
	vector<int> repArch = {3, 1, 5, 8, 15, 7, 20, 22, 25, 28, 33};
	for (int i = 0; i < dest.size(); i++) {
		if (find(repArch.begin(), repArch.end(), (i + 1)) == repArch.end()) {
			copyArchitecture(df, repArch[dest[i] - 1], (i + 1));
		}
	}
	// Count how many other civs want to copy your architecture
	vector<int> dependencies = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
	for (int i = 0; i < repArch.size(); i++) {
		for (int j = 0; j < repArch.size(); j++) {
			if ((i != j) && (dest[repArch[j] - 1] == (i + 1))) {
				dependencies[i]++;
			}
		}
	}

	int cycleStart = -1;
	this->df->Civs[0].IconSet = -1;

	while (vectorSum(dependencies) > 0) {
		// Find the least dependent architecture that has yet to be copied to
		int minIndex = -1;
		for (int i = 0; i < dependencies.size(); i++) {
			if (dest[repArch[i] - 1] != this->df->Civs[repArch[i]].IconSet) {
				if (minIndex == -1) {
					minIndex = i;
				} else if (dependencies[i] < dependencies[minIndex]) {
					minIndex = i;
				}
			}
		}
		if (dependencies[minIndex] == 0) {
			if (this->df->Civs[0].IconSet == dest[repArch[minIndex] - 1]) {
				// If this is the last in a cycle, copy from the temp slot
				copyArchitecture(df, 0, repArch[minIndex]);
				dependencies[cycleStart]--;
				cycleStart = -1;
				this->df->Civs[0].IconSet = -1;
			} else {
				// Copy without worries since there are no dependencies
				copyArchitecture(df, repArch[dest[repArch[minIndex] - 1] - 1], repArch[minIndex]);
				dependencies[dest[repArch[minIndex] - 1] - 1]--;
			}
		} else {
			// Only dependency-cycles remain, so copy info from first in cycle to temp slot
			copyArchitecture(df, repArch[minIndex], 0);
			copyArchitecture(df, repArch[dest[repArch[minIndex] - 1] - 1], repArch[minIndex]);
			dependencies[dest[repArch[minIndex] - 1] - 1]--;
			cycleStart = minIndex;
		}
	}

	this->df->Civs[0].IconSet = 2;
}

// Create a unique tech given parameters and an effect
// type 0 = castle age, type 1 = imperial age UT
void
Civbuilder::createUT(int civbuilderID, int type, Effect utEffect, string name, vector<int> techCosts, int techTime, int techDLL) {
	this->df->Effects.push_back(utEffect);
	Tech ut = Tech();
	ut.Name = name;
	ut.ResearchLocation = 82;
	ut.ResearchTime = techTime;
	ut.RequiredTechs.push_back(102 + type);
	ut.RequiredTechCount = 1;
	ut.Civ = 99;

	if (type == 0) {
		ut.IconID = 33;
		ut.ButtonID = 7;
	} else if (type == 1) {
		ut.IconID = 107;
		ut.ButtonID = 8;
	}

	int writeIndex = 0;
	for (int i = 0; i < techCosts.size(); i++) {
		if (techCosts[i] != 0) {
			ut.ResourceCosts[writeIndex].Type = i;
			ut.ResourceCosts[writeIndex].Amount = techCosts[i];
			ut.ResourceCosts[writeIndex].Flag = 1;
			writeIndex++;
		}
	}

	ut.LanguageDLLName = techDLL;
	ut.LanguageDLLDescription = techDLL + 1000;
	ut.LanguageDLLHelp = techDLL + 100000;

	ut.EffectID = (int) (this->df->Effects.size() - 1);
	this->df->Techs.push_back(ut);

	if (type == 0) {
		this->castleUniqueTechIDs[civbuilderID] = ((int) (this->df->Techs.size() - 1));
	} else if (type == 1) {
		this->impUniqueTechIDs[civbuilderID] = ((int) (this->df->Techs.size() - 1));
	}
}

void
Civbuilder::createCivBonus(int civbuilderID, Effect e, string name, vector<int> requirements = {}) {
	e.Name = name;
	this->df->Effects.push_back(e);
	Tech t = Tech();
	t.Name = name;
	for (int i = 0; i < requirements.size(); i++) {
		t.RequiredTechs.push_back(requirements[i]);
	}
	t.RequiredTechCount = requirements.size();
	t.Civ = 99;
	t.EffectID = (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);
	if (this->civBonuses.find(civbuilderID) == this->civBonuses.end()) {
		this->civBonuses[civbuilderID] = {(int) (this->df->Techs.size() - 1)};
	} else {
		this->civBonuses[civbuilderID].push_back((int) (this->df->Techs.size() - 1));
	}
}

void
Civbuilder::createTeamBonus(int civbuilderID, Effect e, string name) {
	e.Name = name;
	this->df->Effects.push_back(e);
	this->teamBonuses[civbuilderID] = (this->df->Effects.size() - 1);
}

// Create a unique unit and an elite version
void
Civbuilder::createUU(int civbuilderID, int baseID, string name, vector<int> techCosts, int techTime, int techDLL) {
	int uuTechID;
	int eliteTechID;

	for (Civ &civ : this->df->Civs) {
		civ.Units.push_back(civ.Units[baseID]);
		civ.UnitPointers.push_back(1);
		civ.Units[(int) (civ.Units.size() - 1)].Creatable.TrainLocationID = 82;
		civ.Units[(int) (civ.Units.size() - 1)].Creatable.ButtonID = 1;
		civ.Units[(int) (civ.Units.size() - 1)].Creatable.HeroMode = 0;
		civ.Units.push_back(civ.Units[baseID]);
		civ.UnitPointers.push_back(1);
		civ.Units[(int) (civ.Units.size() - 1)].Creatable.TrainLocationID = 82;
		civ.Units[(int) (civ.Units.size() - 1)].Creatable.ButtonID = 1;
		civ.Units[(int) (civ.Units.size() - 1)].Creatable.HeroMode = 0;
	}
	int uuID = ((int) (this->df->Civs[0].Units.size())) - 2;
	int eID = ((int) (this->df->Civs[0].Units.size())) - 1;

	// Tech to make unique unit available
	Effect uuAvailable = Effect();
	uuAvailable.Name = name + " (make avail)";
	uuAvailable.EffectCommands.push_back(createEC(2, uuID, 1, -1, 0));
	this->df->Effects.push_back(uuAvailable);

	Tech uuTech = Tech();
	uuTech.Name = name + " (make avail)";
	uuTech.RequiredTechs.push_back(102);
	uuTech.RequiredTechCount = 1;
	uuTech.FullTechMode = 1;
	uuTech.Repeatable = true;
	uuTech.Civ = 99;
	uuTech.EffectID = (int) (this->df->Effects.size() - 1);
	this->df->Techs.push_back(uuTech);
	uuTechID = (int) (this->df->Techs.size() - 1);

	// Tech to upgrade to elite version
	Effect eliteUpgrade = Effect();
	eliteUpgrade.Name = "Elite " + name;
	eliteUpgrade.EffectCommands.push_back(createEC(3, uuID, eID, -1, 0));
	this->df->Effects.push_back(eliteUpgrade);

	Tech eliteTech = Tech();
	eliteTech.Name = "Elite " + name;
	eliteTech.FullTechMode = 1;
	eliteTech.IconID = 105;
	eliteTech.ButtonID = 6;
	eliteTech.Repeatable = true;
	eliteTech.ResearchLocation = 82;

	int writeIndex = 0;
	for (int i = 0; i < techCosts.size(); i++) {
		if (techCosts[i] != 0) {
			eliteTech.ResourceCosts[writeIndex].Type = i;
			eliteTech.ResourceCosts[writeIndex].Amount = techCosts[i];
			eliteTech.ResourceCosts[writeIndex].Flag = 1;
			writeIndex++;
		}
	}
	eliteTech.ResearchTime = techTime;

	eliteTech.LanguageDLLName = techDLL;
	eliteTech.LanguageDLLDescription = techDLL + 1000;
	eliteTech.LanguageDLLHelp = techDLL + 100000;
	eliteTech.RequiredTechs.push_back(103);
	eliteTech.RequiredTechs.push_back((int) (this->df->Techs.size() - 1));
	eliteTech.RequiredTechCount = 2;
	eliteTech.Civ = 99;
	eliteTech.EffectID = (int) (this->df->Effects.size() - 1);
	this->df->Techs.push_back(eliteTech);
	eliteTechID = (int) (this->df->Techs.size() - 1);

	// Make the new units data.json interpretable
	this->uuTechIDs[civbuilderID] = {uuTechID, eliteTechID};

	// Add the new units to custom website classes
	this->unitClasses["unique"].push_back(uuID);
	this->unitClasses["unique"].push_back(eID);
}

void
Civbuilder::setupData() {
	// Deactivate all civ bonuses tied to techs
	for (Tech &tech : this->df->Techs) {
		if (tech.Civ != -1) {
			tech.Civ = 99;	 // Setting civ = 99 is equivalent to making so that no civ gets it
		}
	}

	// Clear the vanilla tech trees of all effect commands
	for (int i = 0; i < techTreeIDs.size(); i++) {
		this->df->Effects[techTreeIDs[i]].EffectCommands.clear();
	}

	// Reorder Elite Konnik EffectCommands to not create weird bug
	EffectCommand etemp = this->df->Effects[715].EffectCommands[0];
	this->df->Effects[715].EffectCommands[0] = this->df->Effects[715].EffectCommands[1];
	this->df->Effects[715].EffectCommands[1] = etemp;

	// Delete the auto-upgrade in Castle Age effect (duplicateUUEffects will add this back if it is needed)
	for (int i = 0; i < this->df->Effects[102].EffectCommands.size(); i++) {
		if (this->df->Effects[102].EffectCommands[i].A == 1660) {
			this->df->Effects[102].EffectCommands.erase(this->df->Effects[102].EffectCommands.begin() + i);
			i--;
		}
	}

	// Move shrivamsha train location
	for (Civ &civ : this->df->Civs) {
		civ.Units[1751].Creatable.ButtonID = 10;
		civ.Units[1753].Creatable.ButtonID = 10;
	}
	this->df->Techs[843].ButtonID = 15;
	this->df->Techs[865].EffectID = -1;
	this->df->Techs[866].EffectID = -1;
	// Move missionary train location
	for (Civ &civ : this->df->Civs) {
		civ.Units[775].Creatable.ButtonID = 15;
		civ.Units[775].Creatable.ButtonID = 15;
	}

	// Give missionaries a 0 food cost so that it can be added with Hussite Reforms
	for (Civ &civ : this->df->Civs) {
		civ.Units[775].Creatable.ResourceCosts[1].Type = 0;
		civ.Units[775].Creatable.ResourceCosts[1].Amount = 0;
		civ.Units[775].Creatable.ResourceCosts[1].Flag = 1;
	}

	// Make battering ram requirement the right one
	this->df->Techs[162].RequiredTechs[1] = 705;

	// Make chemistry + torsion available to anyone so that it can be allocated
	this->df->Techs[609].Civ = -1;

	// Set up AI config file
	for (int i = 0; i < this->config["name"].size(); i++) {
		this->ai["civs"][i]["nm"] = this->config["name"][i];
		this->ai["civs"][i]["id"] = (i + 1);
		Value emptyArray;
		emptyArray.append(Value::null);
		emptyArray.clear();
		this->ai["civs"][i]["tt"] = emptyArray;
		this->ai["civs"][i]["bn"] = emptyArray;
		this->ai["civs"][i]["tb"] = emptyArray;
	}

	// Basic units/buildings are disableable
	for (Civ &civ : df->Civs) {
		for (int i = 0; i < disableIDs.size(); i++) {
			civ.Units[disableIDs[i]].Enabled = 0;
		}
		for (int i = 0; i < palisadeGates.size(); i++) {
			civ.Units[palisadeGates[i]].Enabled = 0;
		}
	}
	for (int i = 0; i < enablingTechs.size(); i++) {
		Effect enableUnit = Effect();
		enableUnit.Name = to_string(i) + " (make avail)";
		enableUnit.EffectCommands.push_back(createEC(2, disableIDs[i], 1, -1, 0));
		if (i == enablingTechs.size() - 1) {
			for (int j = 0; j < palisadeGates.size(); j++) {
				enableUnit.EffectCommands.push_back(createEC(2, palisadeGates[j], 1, -1, 0));
			}
		}
		df->Effects.push_back(enableUnit);
		df->Techs[enablingTechs[i]].Name = to_string(i) + " (make avail)";
		df->Techs[enablingTechs[i]].EffectID = (df->Effects.size() - 1);
		df->Techs[enablingTechs[i]].Civ = -1;
		df->Techs[enablingTechs[i]].RequiredTechCount = 0;
	}

	// Burgundian bonus also get discount
	Effect e = Effect();
	this->createCivBonus(105, e, "C-Bonus, Eco upgrades cost -33% food");

	// Krepost heal task incase stronghold
	for (Civ &civ : df->Civs) {
		Task healTask = Task();
		healTask.ActionType = 155;
		healTask.TaskType = 1;
		healTask.ClassID = 6;
		healTask.WorkValue1 = 30;
		healTask.WorkValue2 = 1;
		healTask.WorkRange = 7;
		healTask.SearchWaitTime = 109;
		healTask.CombatLevelFlag = 4;
		healTask.TargetDiplomacy = 4;
		civ.Units[1251].Bird.TaskList.push_back(healTask);
	}

	// Add berry, hunter, fish productivity resources
	// Villager unit, task action type, productivity resource
	const vector<vector<int>> villagerTasks = {{120, 5, 198}, {354, 5, 198}, {122, 110, 199}, {216, 110, 199}, {56, 5, 200}, {57, 5, 200}, {13, 5, 200}};
	for (Civ &civ : df->Civs) {
		civ.Resources[198] = 1;
		civ.Resources[199] = 1;
		civ.Resources[200] = 1;
		for (int i = 0; i < villagerTasks.size(); i++) {
			for (int j = 0; j < civ.Units[villagerTasks[i][0]].Bird.TaskList.size(); j++) {
				if (civ.Units[villagerTasks[i][0]].Bird.TaskList[j].ActionType == villagerTasks[i][1]) {
					civ.Units[villagerTasks[i][0]].Bird.TaskList[j].ResourceMultiplier = villagerTasks[i][2];
				}
			}
		}
	}

	// Give eco buildings and towers 0 population headroom so it can be increased with bonus
	for (Civ &civ : df->Civs) {
		for (int i = 0; i < ecoBuildings.size(); i++) {
			civ.Units[ecoBuildings[i]].ResourceStorages[0].Type = 4;
			civ.Units[ecoBuildings[i]].ResourceStorages[0].Amount = 0;
			civ.Units[ecoBuildings[i]].ResourceStorages[0].Flag = 4;
		}
		for (Unit &unit : civ.Units) {
			if (unit.Class == 52) {
				unit.ResourceStorages[0].Type = 4;
				unit.ResourceStorages[0].Amount = 0;
				unit.ResourceStorages[0].Flag = 4;
			}
		}
	}

	// Copy the attack tree task from onager
	for (int k = 0; k < df->Civs.size(); k++) {
		this->df->Civs[k].Units[280].Bird.TaskList.push_back(this->df->Civs[k].Units[550].Bird.TaskList[4]);
		// Disable attacking trees unless it's the civ with the bonus
		this->df->Civs[k].Units[280].Bird.TaskList[5].ClassID = -1;
	}

	// Give villagers their own armor class
	for (Civ &civ : df->Civs) {
		for (Unit &unit : civ.Units) {
			if (unit.Class == 4) {
				unit::AttackOrArmor civilian_armor = unit::AttackOrArmor();
				civilian_armor.Class = 10;
				civilian_armor.Amount = 0;
				unit.Type50.Armours.push_back(civilian_armor);
			}
		}
	}

	// Create generate stone task (copied from keshiks)
	for (Civ &civ : this->df->Civs) {
		for (int i = 0; i < this->unitClasses["ram"].size(); i++) {
			civ.Units[this->unitClasses["ram"][i]].Bird.TaskList.push_back(civ.Units[1228].Bird.TaskList[5]);
			int taskListSize = civ.Units[this->unitClasses["ram"][i]].Bird.TaskList.size();
			civ.Units[this->unitClasses["ram"][i]].Bird.TaskList[taskListSize - 1].ClassID = -1;
			civ.Units[this->unitClasses["ram"][i]].Bird.TaskList[taskListSize - 1].ResourceOut = 2;
			civ.Units[this->unitClasses["ram"][i]].Bird.TaskList[taskListSize - 1].WorkValue1 = 0.01;
		}
	}

	// Genericize unique units outside of castle
	df->Effects[714].EffectCommands.pop_back();
	df->Effects[715].EffectCommands.pop_back();
	df->Effects[788].EffectCommands.pop_back();
	df->Effects[789].EffectCommands.pop_back();
	df->Effects[363].EffectCommands.pop_back();
	df->Effects[454].EffectCommands.pop_back();
	EffectCommand uniqueAvailable = createEC(2, 1254, 1, -1, 0);
	df->Effects[732].EffectCommands.push_back(uniqueAvailable);

	// Donjons add the ability to recruit from them
	Effect donjonUnitEffect = Effect();
	donjonUnitEffect.Name = "Enable Donjon Unit";
	uniqueAvailable = createEC(2, 1660, 1, -1, 0);
	donjonUnitEffect.EffectCommands.push_back(uniqueAvailable);
	df->Effects.push_back(donjonUnitEffect);
	Tech donjonUnitTech = Tech();
	donjonUnitTech.Name = "Enable Donjon Unit";
	donjonUnitTech.RequiredTechs.push_back(101);
	donjonUnitTech.RequiredTechCount = 1;
	donjonUnitTech.Civ = 99;
	donjonUnitTech.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(donjonUnitTech);
	this->civBonuses[109].push_back((int) (df->Techs.size() - 1));

	// Recreate old Indian bonus
	Tech stable_armor_castle = Tech();
	stable_armor_castle.Name = "Stable Units +1P armor";
	stable_armor_castle.RequiredTechs.push_back(102);
	stable_armor_castle.RequiredTechCount = 1;
	stable_armor_castle.Civ = 99;
	stable_armor_castle.EffectID = 640;
	df->Techs[338] = stable_armor_castle;

	Tech stable_armor_imp = Tech();
	stable_armor_imp.Name = "Stable Units +2P armor";
	stable_armor_imp.RequiredTechs.push_back(103);
	stable_armor_imp.RequiredTechCount = 1;
	stable_armor_imp.Civ = 99;
	stable_armor_imp.EffectID = 584;
	df->Techs[552] = stable_armor_imp;

	Tech fishermen = Tech();
	fishermen.Name = "Fishermen work 10% faster";
	fishermen.Civ = 99;
	fishermen.EffectID = 641;
	df->Techs[469] = fishermen;
	df->Effects[641].EffectCommands.push_back(createEC(5, 56, -1, 13, 1.1));
	df->Effects[641].EffectCommands.push_back(createEC(5, 57, -1, 13, 1.1));

	// Make all buildings have stone storage
	for (Civ &civ : this->df->Civs) {
		for (Unit &unit : civ.Units) {
			unit.ResourceStorages[2].Type = 2;
			unit.ResourceStorages[2].Amount = 0;
			unit.ResourceStorages[2].Flag = 8;
		}
	}

	// Make all villagers have power-up effect
	for (Civ &civ : this->df->Civs) {
		for (int i = 4; i < unitSets[28].size(); i++) {
			civ.Units[unitSets[28][i]].Bird.TaskList.push_back(civ.Units[1803].Bird.TaskList[5]);
			int taskListSize = civ.Units[unitSets[28][i]].Bird.TaskList.size();
			civ.Units[unitSets[28][i]].Bird.TaskList[taskListSize - 1].ClassID = 4;
			civ.Units[unitSets[28][i]].Bird.TaskList[taskListSize - 1].UnitID = -1;
			civ.Units[unitSets[28][i]].Bird.TaskList[taskListSize - 1].WorkValue2 = 20;
			civ.Units[unitSets[28][i]].Bird.TaskList[taskListSize - 1].WorkRange = 2;
			civ.Units[unitSets[28][i]].Bird.TaskList[taskListSize - 1].CombatLevelFlag = 6;
			civ.Units[unitSets[28][i]].Bird.TaskList[taskListSize - 1].TargetDiplomacy = 1;
			civ.Units[unitSets[28][i]].Bird.TaskList[taskListSize - 1].SearchWaitTime = 13;
			if (unitSets[28][i] == 214 || unitSets[28][i] == 259) {
				civ.Units[unitSets[28][i]].Bird.TaskList[taskListSize - 1].WorkValue1 = 0.36;
			} else {
				civ.Units[unitSets[28][i]].Bird.TaskList[taskListSize - 1].WorkValue1 = 0.2;
			}
		}
	}

	// Make sure all techs have a unique name
	for (int i = 0; i < this->df->Techs.size(); i++) {
		this->df->Techs[i].Name = to_string(i) + " " + this->df->Techs[i].Name;
	}
}

void
Civbuilder::createNewUnits() {
	// Crusader Knights
	this->createUU(39, 1723, "Crusader Knight", {600, 0, 0, 1200}, 45, 7604);
	int uuID = (int) (this->df->Civs[0].Units.size() - 2);
	int eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Type50.Attacks[0].Amount = 16;
		civ.Units[uuID].Type50.DisplayedAttack = 16;
		civ.Units[uuID].Type50.Armours[0].Amount = 3;
		civ.Units[uuID].Type50.Armours[2].Amount = 3;
		civ.Units[uuID].Type50.DisplayedMeleeArmour = 2;
		civ.Units[uuID].Creatable.DisplayedPierceArmour = 2;
		civ.Units[uuID].HitPoints = 90;
		civ.Units[eID].Name = "ECRUSADERKNIGHT";
		civ.Units[eID].LanguageDLLName = 5243;
		civ.Units[eID].LanguageDLLCreation = 6243;
		civ.Units[eID].LanguageDLLHelp = 105243;
		civ.Units[uuID].Creatable.HeroMode = 2;
		civ.Units[eID].Creatable.HeroMode = 2;
	}
	// Xolotl Warriors
	createUU(40, 1570, "Xolotl Warrior", {800, 0, 0, 800}, 60, 7605);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[eID].Name = "EAZTRAIDER";
		civ.Units[eID].LanguageDLLName = 5244;
		civ.Units[eID].LanguageDLLCreation = 6244;
		civ.Units[eID].LanguageDLLHelp = 105244;
		civ.Units[uuID].Type50.ReloadTime = 0.9;
		civ.Units[uuID].Type50.DisplayedReloadTime = 0.9;
		civ.Units[uuID].Type50.Attacks[0].Amount = 5;
		civ.Units[uuID].Type50.DisplayedAttack = 5;
		civ.Units[uuID].Type50.Armours[2].Amount = 0;
		civ.Units[uuID].Creatable.DisplayedPierceArmour = 0;
		civ.Units[uuID].HitPoints = 95;
		civ.Units[eID].Type50.ReloadTime = 0.8;
		civ.Units[eID].Type50.DisplayedReloadTime = 0.8;
		civ.Units[eID].Type50.Attacks[0].Amount = 6;
		civ.Units[eID].Type50.DisplayedAttack = 6;
		civ.Units[eID].Type50.Armours[0].Amount = 3;
		civ.Units[eID].Type50.DisplayedMeleeArmour = 3;
		civ.Units[eID].HitPoints = 115;
		civ.Units[uuID].Creatable.ResourceCosts[0].Amount = 50;
		civ.Units[uuID].Creatable.ResourceCosts[1].Amount = 100;
		civ.Units[eID].Creatable.ResourceCosts[0].Amount = 50;
		civ.Units[eID].Creatable.ResourceCosts[1].Amount = 100;
	}
	// Saboteur
	createUU(41, 706, "Saboteur", {0, 600, 600, 0}, 40, 7606);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	this->unitClasses["explosive"].push_back(uuID);
	this->unitClasses["explosive"].push_back(eID);
	for (Civ &civ : this->df->Civs) {
		civ.Units[eID].Name = "EHDSQD";
		civ.Units[eID].LanguageDLLName = 5245;
		civ.Units[eID].LanguageDLLCreation = 6245;
		civ.Units[eID].LanguageDLLHelp = 105245;
		civ.Units[eID].Type50.Armours[2].Amount = 5;
		civ.Units[eID].Creatable.DisplayedPierceArmour = 5;
		civ.Units[eID].HitPoints = 70;
		civ.Units[uuID].Creatable.TrainTime = 10;
		civ.Units[eID].Creatable.TrainTime = 10;
		civ.Units[uuID].Type50.Attacks[1].Amount = 40;
		civ.Units[eID].Type50.Attacks[1].Amount = 55;
		civ.Units[uuID].Type50.DisplayedAttack = 40;
		civ.Units[eID].Type50.DisplayedAttack = 55;
		unit::AttackOrArmor siege_bonus = unit::AttackOrArmor();
		siege_bonus.Class = 20;
		siege_bonus.Amount = 60;
		civ.Units[uuID].Type50.Attacks.push_back(siege_bonus);
		siege_bonus.Amount = 120;
		civ.Units[eID].Type50.Attacks.push_back(siege_bonus);
		unit::AttackOrArmor castle_bonus = unit::AttackOrArmor();
		castle_bonus.Class = 26;
		castle_bonus.Amount = 400;
		civ.Units[uuID].Type50.Attacks.push_back(castle_bonus);
		castle_bonus.Amount = 800;
		civ.Units[eID].Type50.Attacks.push_back(castle_bonus);
		civ.Units[uuID].Type50.BlastAttackLevel = 1;
		civ.Units[uuID].Bird.TaskList.push_back(civ.Units[1120].Bird.TaskList[5]);
		civ.Units[eID].Type50.BlastAttackLevel = 1;
		civ.Units[eID].Bird.TaskList.push_back(civ.Units[1120].Bird.TaskList[5]);
		civ.Units[uuID].Type50.BlastWidth = 1;
		civ.Units[eID].Type50.BlastWidth = 2.5;
	}
	// Ninja
	createUU(42, 1145, "Ninja", {0, 500, 0, 600}, 100, 7607);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	int ninjaID = uuID;
	for (Civ &civ : this->df->Civs) {
		civ.Units[eID].Name = "ENINJA";
		civ.Units[eID].LanguageDLLName = 5286;
		civ.Units[eID].LanguageDLLCreation = 6286;
		civ.Units[eID].LanguageDLLHelp = 105286;
		unit::AttackOrArmor uu_bonus = unit::AttackOrArmor();
		uu_bonus.Class = 19;
		uu_bonus.Amount = 5;
		civ.Units[uuID].Type50.Attacks.push_back(uu_bonus);
		uu_bonus.Amount = 7;
		civ.Units[eID].Type50.Attacks.push_back(uu_bonus);
		civ.Units[uuID].Type50.Attacks[2].Class = 31;
		civ.Units[uuID].Type50.Attacks[2].Amount = 11;
		civ.Units[uuID].Type50.DisplayedAttack = 11;
		civ.Units[eID].Type50.Attacks[2].Class = 31;
		civ.Units[eID].Type50.Attacks[2].Amount = 14;
		civ.Units[eID].Type50.DisplayedAttack = 14;
		civ.Units[uuID].Speed = 1.15;
		civ.Units[eID].Speed = 1.3;
		civ.Units[eID].HitPoints = 60;
		civ.Units[eID].Type50.Armours[2].Amount = 2;
		civ.Units[eID].Creatable.DisplayedPierceArmour = 2;
	}
	// Flamethrower
	createUU(43, 188, "Flamethrower", {0, 1000, 0, 1000}, 75, 7608);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[eID].Name = "EMPCAV";
		civ.Units[eID].LanguageDLLName = 5801;
		civ.Units[eID].LanguageDLLCreation = 6801;
		civ.Units[eID].LanguageDLLHelp = 105801;
		unit::AttackOrArmor ram_bonus = unit::AttackOrArmor();
		ram_bonus.Class = 17;
		ram_bonus.Amount = 8;
		civ.Units[uuID].Type50.Attacks.push_back(ram_bonus);
		ram_bonus.Amount = 12;
		civ.Units[eID].Type50.Attacks.push_back(ram_bonus);
		civ.Units[eID].HitPoints = 220;
		civ.Units[eID].Type50.Armours[0].Amount = 5;
		civ.Units[eID].Type50.DisplayedMeleeArmour = 5;
		civ.Units[uuID].Type50.Attacks[1].Amount = 7;
		civ.Units[uuID].Type50.DisplayedAttack = 7;
		civ.Units[uuID].Type50.Attacks[0].Amount = 8;
		civ.Units[uuID].Type50.Attacks[2].Amount = 0;
		civ.Units[eID].Type50.Attacks[1].Amount = 9;
		civ.Units[eID].Type50.DisplayedAttack = 9;
		civ.Units[eID].Type50.Attacks[0].Amount = 12;
		civ.Units[eID].Type50.Attacks[2].Amount = 0;
		civ.Units[eID].Type50.MaxRange = 6;
		civ.Units[eID].Type50.DisplayedRange = 6;
	}
	setUnitCosts(this->df, {uuID, eID}, {0, 150, 0, 25});
	// Photonman
	createUU(44, 1577, "Photonman", {1000, 0, 0, 1000}, 120, 7609);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[eID].Name = "EPHOTON";
		civ.Units[eID].LanguageDLLName = 5802;
		civ.Units[eID].LanguageDLLCreation = 6802;
		civ.Units[eID].LanguageDLLHelp = 105802;
		civ.Units[uuID].Type50.ReloadTime = 5.5;
		civ.Units[uuID].Type50.DisplayedReloadTime = 5.5;
		civ.Units[eID].Type50.ReloadTime = 5.5;
		civ.Units[eID].Type50.DisplayedReloadTime = 5.5;
		civ.Units[uuID].Creatable.ResourceCosts[1].Amount = 90;
		civ.Units[eID].Creatable.ResourceCosts[1].Amount = 90;
		civ.Units[uuID].Creatable.TrainTime = 35;
		civ.Units[eID].Creatable.TrainTime = 35;
		civ.Units[uuID].Type50.MaxRange = 8;
		civ.Units[uuID].Type50.DisplayedRange = 8;
		civ.Units[uuID].Speed = 0.9;
		civ.Units[eID].Speed = 0.9;
		civ.Units[uuID].Type50.Armours[0].Amount = 0;
		civ.Units[uuID].Type50.DisplayedMeleeArmour = 0;
		civ.Units[uuID].Type50.Armours[2].Amount = 0;
		civ.Units[uuID].Creatable.DisplayedPierceArmour = 0;
		civ.Units[eID].Type50.Armours[0].Amount = 0;
		civ.Units[eID].Type50.DisplayedMeleeArmour = 0;
		civ.Units[eID].Type50.Armours[2].Amount = 0;
		civ.Units[eID].Creatable.DisplayedPierceArmour = 0;
		civ.Units[uuID].HitPoints = 60;
	}
	this->unitClasses["gunpowder"].push_back(uuID);
	this->unitClasses["gunpowder"].push_back(eID);
	// copyEffectstoUnits(this->df, {{563, 0, 1, 2}}, {uuID, eID});
	// Centurion
	this->uuTechIDs[45] = {881, 882};
	// Apukispay
	createUU(46, 1074, "Apukispay", {800, 0, 0, 900}, 70, 7643);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "APU";
		civ.Units[eID].Name = "EAPU";
		civ.Units[eID].LanguageDLLName = 5836;
		civ.Units[eID].LanguageDLLCreation = 6836;
		civ.Units[eID].LanguageDLLHelp = 105836;
		civ.Units[uuID].Speed = 1;
		civ.Units[eID].Speed = 1;
		civ.Units[uuID].HitPoints = 70;
		civ.Units[eID].HitPoints = 90;
		civ.Units[uuID].Creatable.TrainTime = 20;
		civ.Units[eID].Creatable.TrainTime = 20;
	}
	setUnitCosts(this->df, {uuID, eID}, {50, 0, 0, 85});
	setCombatStats(this->df, uuID, {{4, 10}}, {{4, 1}, {3, 0}, {19, 0}});
	setCombatStats(this->df, eID, {{4, 14}}, {{4, 2}, {3, 0}, {19, 0}});
	// Monkey Boy
	createUU(47, 860, "Monkey Boy", {2000, 0, 0, 0}, 60, 7612);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[eID].Name = "emkyby";
		civ.Units[eID].LanguageDLLName = 5805;
		civ.Units[eID].LanguageDLLCreation = 6805;
		civ.Units[eID].LanguageDLLHelp = 105805;
		civ.Units[uuID].Creatable.ResourceCosts[0].Amount = 90;
		civ.Units[uuID].Creatable.ResourceCosts[1].Amount = 20;
		civ.Units[uuID].Creatable.ResourceCosts[1].Type = 3;
		civ.Units[uuID].Creatable.ResourceCosts[1].Flag = 1;
		civ.Units[eID].ResourceStorages = civ.Units[1].ResourceStorages;
		civ.Units[eID].Creatable.ResourceCosts[0].Amount = 105;
		civ.Units[eID].Creatable.ResourceCosts[1].Amount = 25;
		civ.Units[eID].Creatable.ResourceCosts[1].Type = 3;
		civ.Units[eID].Creatable.ResourceCosts[1].Flag = 1;
		civ.Units[eID].ResourceStorages = civ.Units[1].ResourceStorages;
		unit::AttackOrArmor animal_armor = unit::AttackOrArmor();
		animal_armor.Class = 14;
		animal_armor.Amount = 0;
		civ.Units[uuID].Type50.Armours.push_back(animal_armor);
		civ.Units[eID].Type50.Armours.push_back(animal_armor);
		civ.Units[eID].HitPoints = 16;
	}
	// Amazon Warrior
	createUU(48, 825, "Amazon Warrior", {600, 0, 0, 1000}, 70, 7613);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[eID].Name = "Elite Amazon Warrior";
		civ.Units[eID].LanguageDLLName = 5806;
		civ.Units[eID].LanguageDLLCreation = 6806;
		civ.Units[eID].LanguageDLLHelp = 106806;
		civ.Units[uuID].Creatable.ResourceCosts[0].Amount = 70;
		civ.Units[uuID].Creatable.ResourceCosts[1].Amount = 15;
		civ.Units[eID].Creatable.ResourceCosts[0].Amount = 70;
		civ.Units[eID].Creatable.ResourceCosts[1].Amount = 15;
		civ.Units[uuID].Type50.Attacks[2].Amount = 13;
		civ.Units[uuID].Type50.DisplayedAttack = 13;
		civ.Units[eID].Type50.Attacks[2].Amount = 15;
		civ.Units[eID].Type50.DisplayedAttack = 15;
		civ.Units[eID].HitPoints = 60;
		unit::AttackOrArmor vil_bonus = unit::AttackOrArmor();
		vil_bonus.Class = 10;
		vil_bonus.Amount = 10;
		civ.Units[uuID].Type50.Attacks.push_back(vil_bonus);
		vil_bonus.Amount = 20;
		civ.Units[eID].Type50.Attacks.push_back(vil_bonus);
		unit::AttackOrArmor animal_bonus = unit::AttackOrArmor();
		animal_bonus.Class = 14;
		animal_bonus.Amount = 30;
		civ.Units[uuID].Type50.Attacks.push_back(animal_bonus);
		civ.Units[eID].Type50.Attacks.push_back(animal_bonus);
		civ.Units[eID].Speed = 1.2;
	}
	// Amazon Archer
	createUU(49, 850, "Amazon Archer", {600, 0, 0, 400}, 60, 7614);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	this->unitClasses["footArcher"].push_back(uuID);
	this->unitClasses["footArcher"].push_back(eID);
	for (Civ &civ : this->df->Civs) {
		civ.Units[eID].Name = "Elite Amazon Archer";
		civ.Units[eID].LanguageDLLName = 5807;
		civ.Units[eID].LanguageDLLCreation = 6807;
		civ.Units[eID].LanguageDLLHelp = 105807;
		civ.Units[uuID].Type50.Armours[2].Amount = 0;
		civ.Units[eID].Type50.Armours[2].Amount = 0;
		civ.Units[uuID].Creatable.DisplayedPierceArmour = 0;
		civ.Units[uuID].Type50.Attacks[2].Class = 10;
		civ.Units[uuID].Type50.Attacks[2].Amount = 5;
		civ.Units[uuID].Type50.Attacks[5].Class = 14;
		civ.Units[uuID].Type50.Attacks[5].Amount = 5;
		civ.Units[uuID].Type50.Attacks[3].Amount = 8;
		civ.Units[uuID].Type50.DisplayedAttack = 7;
		civ.Units[eID].Type50.Attacks[2].Class = 10;
		civ.Units[eID].Type50.Attacks[2].Amount = 10;
		civ.Units[eID].Type50.Attacks[5].Class = 14;
		civ.Units[eID].Type50.Attacks[5].Amount = 5;
		civ.Units[eID].Type50.Attacks[3].Amount = 10;
		civ.Units[eID].Type50.DisplayedAttack = 10;
		civ.Units[uuID].HitPoints = 30;
		civ.Units[eID].HitPoints = 30;
		civ.Units[uuID].Speed = 1.1;
		civ.Units[eID].Speed = 1.2;
	}
	// Iroquois Warrior
	createUU(50, 1374, "Iroquois Warrior", {800, 0, 0, 700}, 70, 7615);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[eID].Name = "EIRWAR";
		civ.Units[eID].LanguageDLLName = 5808;
		civ.Units[eID].LanguageDLLCreation = 6808;
		civ.Units[eID].LanguageDLLHelp = 105808;
		civ.Units[uuID].Type50.Attacks[1].Amount = 5;
		civ.Units[eID].Type50.Attacks[1].Amount = 10;
		unit::AttackOrArmor castle_bonus = unit::AttackOrArmor();
		castle_bonus.Class = 26;
		castle_bonus.Amount = 10;
		civ.Units[uuID].Type50.Attacks.push_back(castle_bonus);
		civ.Units[eID].Type50.Attacks.push_back(castle_bonus);
		unit::AttackOrArmor wall_bonus = unit::AttackOrArmor();
		wall_bonus.Class = 22;
		wall_bonus.Amount = 6;
		civ.Units[uuID].Type50.Attacks.push_back(wall_bonus);
		wall_bonus.Amount = 12;
		civ.Units[eID].Type50.Attacks.push_back(wall_bonus);
		unit::AttackOrArmor stone_bonus = unit::AttackOrArmor();
		stone_bonus.Class = 13;
		stone_bonus.Amount = 12;
		civ.Units[uuID].Type50.Attacks.push_back(stone_bonus);
		civ.Units[eID].Type50.Attacks.push_back(stone_bonus);
		civ.Units[uuID].Type50.Attacks[2].Amount = 7;
		civ.Units[uuID].Type50.DisplayedAttack = 7;
		civ.Units[eID].Type50.Attacks[2].Amount = 11;
		civ.Units[eID].Type50.DisplayedAttack = 11;
		civ.Units[eID].HitPoints = 80;
	}
	// Varangian Guard
	createUU(51, 1681, "Varangian Guard", {900, 0, 0, 900}, 90, 7616);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "VARANG";
		civ.Units[eID].Name = "EVARANG";
		civ.Units[eID].LanguageDLLName = 5809;
		civ.Units[eID].LanguageDLLCreation = 6809;
		civ.Units[eID].LanguageDLLHelp = 105809;
		civ.Units[uuID].Creatable.HeroMode = 0;
		civ.Units[eID].Creatable.HeroMode = 0;
		civ.Units[uuID].HitPoints = 105;
		civ.Units[eID].HitPoints = 140;
		civ.Units[uuID].Speed = 1.4;
		civ.Units[eID].Speed = 1.4;
		civ.Units[uuID].Type50.Armours.pop_back();
		civ.Units[eID].Type50.Armours.pop_back();
		civ.Units[uuID].Type50.Armours[0].Amount = 1;
		civ.Units[uuID].Type50.DisplayedMeleeArmour = 1;
		civ.Units[uuID].Type50.Armours[2].Amount = 5;
		civ.Units[uuID].Creatable.DisplayedPierceArmour = 5;
		civ.Units[eID].Type50.Armours[0].Amount = 1;
		civ.Units[eID].Type50.DisplayedMeleeArmour = 1;
		civ.Units[eID].Type50.Armours[2].Amount = 7;
		civ.Units[eID].Creatable.DisplayedPierceArmour = 7;
		civ.Units[uuID].Type50.Attacks[0].Amount = 10;
		civ.Units[uuID].Type50.DisplayedAttack = 10;
		civ.Units[eID].Type50.Attacks[0].Amount = 12;
		civ.Units[eID].Type50.DisplayedAttack = 12;
		unit::AttackOrArmor archer_bonus = unit::AttackOrArmor();
		archer_bonus.Class = 15;
		archer_bonus.Amount = 6;
		civ.Units[uuID].Type50.Attacks.push_back(archer_bonus);
		archer_bonus.Amount = 10;
		civ.Units[eID].Type50.Attacks.push_back(archer_bonus);
	}
	setUnitCosts(this->df, {uuID, eID}, {95, 0, 0, 55});
	// Gendarme
	createUU(52, 1281, "Gendarme", {1000, 0, 0, 850}, 110, 7617);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "GENDARME";
		civ.Units[eID].Name = "EGENDARME";
		civ.Units[eID].LanguageDLLName = 5810;
		civ.Units[eID].LanguageDLLCreation = 6810;
		civ.Units[eID].LanguageDLLHelp = 105810;
		civ.Units[uuID].HitPoints = 75;
		civ.Units[eID].HitPoints = 100;
		civ.Units[uuID].Speed = 1.3;
		civ.Units[eID].Speed = 1.3;
		civ.Units[uuID].Creatable.TrainTime = 20;
		civ.Units[eID].Creatable.TrainTime = 20;
	}
	setUnitCosts(this->df, {uuID, eID}, {95, 0, 0, 85});
	setCombatStats(this->df, uuID, {{4, 10}}, {{3, 5}, {4, 5}, {8, 0}, {19, 0}});
	setCombatStats(this->df, eID, {{4, 13}}, {{3, 7}, {4, 7}, {8, 0}, {19, 0}});
	// Cuahchiqueh
	createUU(53, 1067, "Cuahchiqueh", {600, 0, 0, 900}, 60, 7618);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "CCQ";
		civ.Units[eID].Name = "ECCQ";
		civ.Units[eID].LanguageDLLName = 5811;
		civ.Units[eID].LanguageDLLCreation = 6811;
		civ.Units[eID].LanguageDLLHelp = 105811;
		civ.Units[uuID].HitPoints = 80;
		civ.Units[eID].HitPoints = 105;
		civ.Units[uuID].Type50.ReloadTime = 0.9;
		civ.Units[uuID].Type50.DisplayedReloadTime = 0.9;
		civ.Units[eID].Type50.ReloadTime = 0.8;
		civ.Units[eID].Type50.DisplayedReloadTime = 0.8;
		civ.Units[uuID].Creatable.TrainTime = 11;
		civ.Units[eID].Creatable.TrainTime = 11;
	}
	setUnitCosts(this->df, {uuID, eID}, {40, 0, 0, 80});
	setCombatStats(this->df, uuID, {{29, 5}, {21, 1}, {1, 5}, {4, 6}, {8, 0}}, {{4, 2}, {3, -1}, {19, 0}});
	setCombatStats(this->df, eID, {{29, 7}, {21, 1}, {1, 5}, {4, 8}, {8, 0}}, {{4, 3}, {3, -1}, {19, 0}});
	// Ritterbruder
	createUU(54, 1727, "Ritterbruder", {850, 0, 0, 850}, 60, 7619);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "SUPERTEUTONIC";
		civ.Units[eID].Name = "ESUPERTEUTONIC";
		civ.Units[eID].LanguageDLLName = 5812;
		civ.Units[eID].LanguageDLLCreation = 6812;
		civ.Units[eID].LanguageDLLHelp = 105812;
		civ.Units[uuID].HitPoints = 125;
		civ.Units[eID].HitPoints = 150;
		civ.Units[uuID].Speed = 1.2;
		civ.Units[eID].Speed = 1.2;
		civ.Units[uuID].Creatable.TrainTime = 22;
		civ.Units[eID].Creatable.TrainTime = 22;
	}
	setUnitCosts(this->df, {uuID, eID}, {80, 0, 0, 75});
	setCombatStats(this->df, uuID, {{4, 11}}, {{3, 1}, {4, 6}, {8, 0}, {19, 0}});
	setCombatStats(this->df, eID, {{4, 13}}, {{3, 2}, {4, 11}, {8, 0}, {19, 0}});
	// Kazak
	createUU(55, 1269, "Kazak", {0, 1100, 0, 500}, 70, 7620);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "KAZAK";
		civ.Units[eID].Name = "EKAZAK";
		civ.Units[eID].LanguageDLLName = 5813;
		civ.Units[eID].LanguageDLLCreation = 6813;
		civ.Units[eID].LanguageDLLHelp = 105813;
		civ.Units[uuID].HitPoints = 80;
		civ.Units[eID].HitPoints = 100;
		civ.Units[uuID].Speed = 1.35;
		civ.Units[eID].Speed = 1.35;
		civ.Units[uuID].Creatable.TrainTime = 25;
		civ.Units[eID].Creatable.TrainTime = 25;
	}
	setUnitCosts(this->df, {uuID, eID}, {0, 90, 0, 40});
	setCombatStats(this->df, uuID, {{27, 2}, {3, 6}, {21, 3}}, {{28, 0}, {4, 1}, {3, 0}, {15, 0}, {8, 0}, {19, 0}});
	setCombatStats(this->df, eID, {{27, 2}, {3, 8}, {21, 5}}, {{28, 0}, {4, 2}, {3, 0}, {15, 0}, {8, 0}, {19, 0}});
	// Szlachcic
	createUU(56, 1721, "Szlachcic", {750, 0, 0, 650}, 60, 7621);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "SZLACH";
		civ.Units[eID].Name = "ESZLACH";
		civ.Units[eID].LanguageDLLName = 5814;
		civ.Units[eID].LanguageDLLCreation = 6814;
		civ.Units[eID].LanguageDLLHelp = 105814;
		civ.Units[uuID].HitPoints = 115;
		civ.Units[eID].HitPoints = 145;
		civ.Units[uuID].Creatable.TrainTime = 18;
		civ.Units[eID].Creatable.TrainTime = 18;
	}
	setUnitCosts(this->df, {uuID, eID}, {80, 0, 0, 50});
	setCombatStats(this->df, uuID, {{4, 10}}, {{4, 4}, {3, 3}, {8, 0}, {19, 0}});
	setCombatStats(this->df, eID, {{4, 12}}, {{4, 5}, {3, 4}, {8, 0}, {19, 0}});
	// Cuirassier
	createUU(57, 1186, "Cuirassier", {650, 0, 0, 800}, 60, 7622);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "CHEVAL";
		civ.Units[eID].Name = "ECHEVAL";
		civ.Units[eID].LanguageDLLName = 5815;
		civ.Units[eID].LanguageDLLCreation = 6815;
		civ.Units[eID].LanguageDLLHelp = 105815;
		civ.Units[uuID].Speed = 1.55;
		civ.Units[eID].Speed = 1.55;
		civ.Units[uuID].HitPoints = 50;
		civ.Units[eID].HitPoints = 65;
		civ.Units[uuID].Creatable.TrainTime = 11;
		civ.Units[eID].Creatable.TrainTime = 9;
	}
	setUnitCosts(this->df, {uuID, eID}, {70, 0, 0, 25});
	setCombatStats(this->df, uuID, {{4, 14}, {10, 14}}, {{4, -2}, {3, 2}, {8, 0}, {19, 0}});
	setCombatStats(this->df, eID, {{4, 16}, {10, 16}, {23, 12}}, {{4, -2}, {3, 4}, {8, 0}, {19, 0}});
	// Rajput
	createUU(58, 1184, "Rajput", {750, 0, 0, 750}, 55, 7623);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "RAJPUT";
		civ.Units[eID].Name = "ERAJPUT";
		civ.Units[eID].LanguageDLLName = 5816;
		civ.Units[eID].LanguageDLLCreation = 6816;
		civ.Units[eID].LanguageDLLHelp = 105816;
		civ.Units[uuID].Speed = 1.35;
		civ.Units[eID].Speed = 1.35;
		civ.Units[uuID].HitPoints = 95;
		civ.Units[eID].HitPoints = 125;
		civ.Units[uuID].Creatable.TrainTime = 16;
		civ.Units[eID].Creatable.TrainTime = 16;
	}
	setUnitCosts(this->df, {uuID, eID}, {70, 0, 0, 70});
	setCombatStats(this->df, uuID, {{4, 9}, {15, 9}, {28, 5}}, {{4, 0}, {3, 1}, {8, 0}, {19, 0}});
	setCombatStats(this->df, eID, {{4, 12}, {15, 18}, {28, 5}}, {{4, 0}, {3, 2}, {8, 0}, {19, 0}});
	// Seljuk Archer
	createUU(59, 943, "Seljuk Archer", {0, 800, 0, 700}, 65, 7624);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "SELJUK";
		civ.Units[eID].Name = "ESELJUK";
		civ.Units[eID].LanguageDLLName = 5817;
		civ.Units[eID].LanguageDLLCreation = 6817;
		civ.Units[eID].LanguageDLLHelp = 105817;
		civ.Units[uuID].Speed = 1.4;
		civ.Units[eID].Speed = 1.4;
		civ.Units[uuID].HitPoints = 50;
		civ.Units[eID].HitPoints = 65;
		civ.Units[uuID].Creatable.TrainTime = 16;
		civ.Units[eID].Creatable.TrainTime = 13;
	}
	setUnitCosts(this->df, {uuID, eID}, {0, 60, 0, 55});
	setCombatStats(this->df, uuID, {{3, 7}}, {{28, 0}, {4, -2}, {3, 0}, {15, 0}, {8, 0}, {19, 0}});
	setCombatStats(this->df, eID, {{3, 9}}, {{28, 0}, {4, -2}, {3, 1}, {15, 0}, {8, 0}, {19, 0}});
	// Numidian Javelinman
	createUU(60, 1036, "Numidian Javelinman", {0, 600, 0, 400}, 45, 7625);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "NUMIDIAN";
		civ.Units[eID].Name = "ENUMIDIAN";
		civ.Units[eID].LanguageDLLName = 5818;
		civ.Units[eID].LanguageDLLCreation = 6818;
		civ.Units[eID].LanguageDLLHelp = 105818;
		civ.Units[uuID].HitPoints = 65;
		civ.Units[eID].HitPoints = 80;
		civ.Units[uuID].Creatable.TrainTime = 17;
		civ.Units[eID].Creatable.TrainTime = 17;
	}
	setUnitCosts(this->df, {uuID, eID}, {0, 80, 0, 30});
	setCombatStats(this->df, uuID, {{3, 5}, {28, 5}, {15, 3}}, {{4, 0}, {15, 1}, {8, -1}, {3, 1}, {19, 0}});
	setCombatStats(this->df, eID, {{3, 6}, {28, 8}, {15, 5}}, {{4, 0}, {15, 1}, {8, -1}, {3, 1}, {19, 0}});
	// Sosso Guard
	createUU(61, 1574, "Sosso Guard", {1000, 0, 0, 700}, 65, 7626);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "SOSSOG";
		civ.Units[eID].Name = "ESOSSOG";
		civ.Units[eID].LanguageDLLName = 5819;
		civ.Units[eID].LanguageDLLCreation = 6819;
		civ.Units[eID].LanguageDLLHelp = 105819;
		civ.Units[uuID].HitPoints = 45;
		civ.Units[eID].HitPoints = 55;
		civ.Units[uuID].Creatable.TrainTime = 12;
		civ.Units[eID].Creatable.TrainTime = 14;
		civ.Units[uuID].Speed = 1.1;
		civ.Units[eID].Speed = 1.1;
	}
	setUnitCosts(this->df, {uuID, eID}, {55, 0, 0, 45});
	setCombatStats(this->df, uuID, {{4, 6}, {8, 7}, {5, 25}, {30, 2}}, {{1, 0}, {4, 0}, {3, 1}, {19, 0}});
	setCombatStats(this->df, eID, {{4, 7}, {8, 11}, {5, 50}, {30, 4}}, {{1, 0}, {4, 0}, {3, 2}, {19, 0}});
	// Swiss Pikeman
	createUU(62, 892, "Swiss Pikeman", {600, 0, 0, 1200}, 45, 7627);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "SWISSPIKE";
		civ.Units[eID].Name = "ESWISSPIKE";
		civ.Units[eID].LanguageDLLName = 5856;
		civ.Units[eID].LanguageDLLCreation = 6856;
		civ.Units[eID].LanguageDLLHelp = 106856;
		civ.Units[uuID].HitPoints = 80;
		civ.Units[eID].HitPoints = 95;
		civ.Units[uuID].Speed = 0.9;
		civ.Units[eID].Speed = 0.9;
		civ.Units[uuID].Creatable.TrainTime = 19;
		civ.Units[eID].Creatable.TrainTime = 19;
		civ.Units[uuID].Type50.MaxRange = 2;
		civ.Units[eID].Type50.MaxRange = 2;
		civ.Units[uuID].Type50.DisplayedRange = 2;
		civ.Units[eID].Type50.DisplayedRange = 2;
	}
	setUnitCosts(this->df, {uuID, eID}, {40, 0, 0, 50});
	setCombatStats(this->df, uuID, {{4, 5}, {8, 25}, {5, 20}}, {{1, 0}, {3, 0}, {4, 0}, {27, 0}, {19, 0}});
	setCombatStats(this->df, eID, {{4, 6}, {8, 60}, {5, 25}}, {{1, 0}, {3, 0}, {4, 0}, {27, 0}, {19, 0}});
	// Headhunter
	createUU(63, 1673, "Headhunter", {400, 0, 0, 300}, 50, 7628);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	Task kidnapTask = Task();
	kidnapTask.ActionType = 135;
	kidnapTask.ClassID = 4;
	kidnapTask.WorkRange = 0.25;
	kidnapTask.TargetDiplomacy = 2;
	kidnapTask.GatherType = 2;
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "BOUNTY";
		civ.Units[eID].Name = "EBOUNTY";
		civ.Units[uuID].LanguageDLLHelp = 105478;
		civ.Units[eID].LanguageDLLName = 5821;
		civ.Units[eID].LanguageDLLCreation = 6821;
		civ.Units[eID].LanguageDLLHelp = 105821;
		civ.Units[uuID].HitPoints = 60;
		civ.Units[eID].HitPoints = 65;
		civ.Units[uuID].Speed = 1.4;
		civ.Units[eID].Speed = 1.4;
		civ.Units[uuID].Creatable.TrainTime = 15;
		civ.Units[eID].Creatable.TrainTime = 15;
		civ.Units[uuID].GarrisonCapacity = 1;
		civ.Units[eID].GarrisonCapacity = 1;
		civ.Units[uuID].Bird.TaskList.push_back(kidnapTask);
		civ.Units[eID].Bird.TaskList.push_back(kidnapTask);
	}
	setUnitCosts(this->df, {uuID, eID}, {0, 0, 0, 75});
	setCombatStats(this->df, uuID, {{4, 7}, {10, 30}}, {{4, 1}, {3, 0}, {8, 0}, {19, 0}});
	setCombatStats(this->df, eID, {{4, 8}, {10, 40}}, {{4, 1}, {3, 0}, {8, 0}, {19, 0}});
	// Give it a 0 food cost so that it can be added with corvinian army
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Creatable.ResourceCosts[1].Type = 0;
		civ.Units[uuID].Creatable.ResourceCosts[1].Amount = 0;
		civ.Units[uuID].Creatable.ResourceCosts[1].Flag = 1;
		civ.Units[eID].Creatable.ResourceCosts[1].Type = 0;
		civ.Units[eID].Creatable.ResourceCosts[1].Amount = 0;
		civ.Units[eID].Creatable.ResourceCosts[1].Flag = 1;
	}
	// Teulu
	createUU(64, 1683, "Teulu", {600, 0, 0, 550}, 45, 7629);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "TEULU";
		civ.Units[eID].Name = "ETEULU";
		civ.Units[eID].LanguageDLLName = 5822;
		civ.Units[eID].LanguageDLLCreation = 6822;
		civ.Units[eID].LanguageDLLHelp = 105822;
		civ.Units[uuID].HitPoints = 70;
		civ.Units[eID].HitPoints = 85;
		civ.Units[uuID].Creatable.TrainTime = 10;
		civ.Units[eID].Creatable.TrainTime = 10;
		civ.Units[uuID].Speed = 0.95;
		civ.Units[eID].Speed = 0.95;
	}
	setUnitCosts(this->df, {uuID, eID}, {65, 0, 0, 40});
	setCombatStats(this->df, uuID, {{4, 10}}, {{1, 0}, {4, 0}, {3, 1}, {19, 0}});
	setCombatStats(this->df, eID, {{4, 12}}, {{1, 0}, {4, 0}, {3, 1}, {19, 0}});
	// Maillotins
	createUU(65, 1685, "Maillotins", {950, 0, 0, 250}, 35, 7630);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "GHALMARAZ";
		civ.Units[eID].Name = "EGHALMARAZ";
		civ.Units[eID].LanguageDLLName = 5823;
		civ.Units[eID].LanguageDLLCreation = 6823;
		civ.Units[eID].LanguageDLLHelp = 105823;
		civ.Units[uuID].HitPoints = 40;
		civ.Units[eID].HitPoints = 40;
		civ.Units[uuID].Creatable.TrainTime = 8;
		civ.Units[eID].Creatable.TrainTime = 8;
		civ.Units[uuID].Speed = 1.1;
		civ.Units[eID].Speed = 1.1;
		civ.Units[uuID].Type50.ReloadTime = 4;
		civ.Units[eID].Type50.ReloadTime = 4;
		civ.Units[uuID].Type50.DisplayedReloadTime = 4;
		civ.Units[eID].Type50.DisplayedReloadTime = 4;
	}
	setUnitCosts(this->df, {uuID, eID}, {90, 0, 0, 10});
	setCombatStats(this->df, uuID, {{4, 20}}, {{1, 0}, {4, 3}, {3, 0}, {19, 0}});
	setCombatStats(this->df, eID, {{4, 27}}, {{1, 0}, {4, 3}, {3, 0}, {19, 0}});
	// Hashashin
	createUU(66, 1035, "Hashashin", {500, 0, 0, 1250}, 60, 7631);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "STONERS";
		civ.Units[eID].Name = "ESTONERS";
		civ.Units[eID].LanguageDLLName = 5824;
		civ.Units[eID].LanguageDLLCreation = 6824;
		civ.Units[eID].LanguageDLLHelp = 105824;
		civ.Units[uuID].HitPoints = 85;
		civ.Units[eID].HitPoints = 105;
		civ.Units[uuID].Creatable.TrainTime = 14;
		civ.Units[eID].Creatable.TrainTime = 14;
		civ.Units[uuID].Speed = 1.45;
		civ.Units[eID].Speed = 1.45;
	}
	setUnitCosts(this->df, {uuID, eID}, {30, 0, 0, 85});
	setCombatStats(this->df, uuID, {{4, 12}, {19, 8}, {36, 25}}, {{4, 0}, {3, 0}, {8, 0}, {19, 0}});
	setCombatStats(this->df, eID, {{4, 14}, {19, 12}, {36, 50}}, {{4, 0}, {3, 1}, {8, 0}, {19, 0}});
	// Zweihander
	createUU(67, 453, "Zweihander", {850, 0, 0, 700}, 65, 7632);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "CHAD";
		civ.Units[eID].Name = "ECHAD";
		civ.Units[eID].LanguageDLLName = 5825;
		civ.Units[eID].LanguageDLLCreation = 6825;
		civ.Units[eID].LanguageDLLHelp = 105825;
		civ.Units[uuID].HitPoints = 60;
		civ.Units[eID].HitPoints = 75;
		civ.Units[uuID].Creatable.TrainTime = 13;
		civ.Units[eID].Creatable.TrainTime = 13;
		civ.Units[uuID].Speed = 0.95;
		civ.Units[eID].Speed = 0.95;
	}
	setCombatStats(this->df, uuID, {{4, 9}, {1, 4}, {29, 10}}, {{4, 1}, {3, 1}, {1, 0}, {19, 0}});
	setCombatStats(this->df, eID, {{4, 12}, {1, 10}, {29, 10}}, {{4, 1}, {3, 1}, {1, 0}, {19, 0}});
	// Stradiot
	createUU(68, 1677, "Stradiot", {800, 0, 0, 850}, 65, 7633);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "STRADIOT";
		civ.Units[eID].Name = "ESTRADIOT";
		civ.Units[eID].LanguageDLLName = 5826;
		civ.Units[eID].LanguageDLLCreation = 6826;
		civ.Units[eID].LanguageDLLHelp = 105826;
		civ.Units[uuID].Type50.MaxRange = 1;
		civ.Units[eID].Type50.MaxRange = 1;
		civ.Units[uuID].Type50.DisplayedRange = 1;
		civ.Units[eID].Type50.DisplayedRange = 1;
		civ.Units[uuID].HitPoints = 80;
		civ.Units[eID].HitPoints = 100;
		civ.Units[uuID].Creatable.TrainTime = 20;
		civ.Units[eID].Creatable.TrainTime = 20;
		civ.Units[uuID].Speed = 1.4;
		civ.Units[eID].Speed = 1.4;
	}
	setUnitCosts(this->df, {uuID, eID}, {75, 0, 0, 30});
	setCombatStats(this->df, uuID, {{4, 9}, {8, 4}}, {{8, 0}, {4, 0}, {3, 1}, {19, 0}});
	setCombatStats(this->df, eID, {{4, 12}, {8, 8}}, {{8, 0}, {4, 1}, {3, 2}, {19, 0}});
	// Ahosi
	createUU(69, 1066, "Ahosi", {750, 0, 0, 650}, 60, 7634);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "AHOSI";
		civ.Units[eID].Name = "EAHOSI";
		civ.Units[eID].LanguageDLLName = 5827;
		civ.Units[eID].LanguageDLLCreation = 6827;
		civ.Units[eID].LanguageDLLHelp = 105827;
		civ.Units[uuID].HitPoints = 35;
		civ.Units[eID].HitPoints = 40;
		civ.Units[uuID].Creatable.TrainTime = 9;
		civ.Units[eID].Creatable.TrainTime = 9;
		civ.Units[uuID].Speed = 1.25;
		civ.Units[eID].Speed = 1.25;
		civ.Units[uuID].Type50.MaxRange = 0;
		civ.Units[eID].Type50.MaxRange = 0;
		civ.Units[uuID].Type50.DisplayedRange = 0;
		civ.Units[eID].Type50.DisplayedRange = 0;
	}
	setCombatStats(this->df, uuID, {{3, 12}}, {{1, 0}, {4, 0}, {3, 0}, {19, 0}});
	setCombatStats(this->df, eID, {{3, 15}}, {{1, 0}, {4, 0}, {3, 0}, {19, 0}});
	this->ahosiID = uuID;
	this->ehosiID = eID;
	// Spadoni
	createUU(70, 439, "Spadoni", {850, 0, 0, 650}, 60, 7635);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "GOALS";
		civ.Units[eID].Name = "EGOALS";
		civ.Units[uuID].LanguageDLLCreation = 6780;
		civ.Units[uuID].LanguageDLLHelp = 105780;
		civ.Units[eID].LanguageDLLName = 5828;
		civ.Units[eID].LanguageDLLCreation = 6828;
		civ.Units[eID].LanguageDLLHelp = 105828;
		civ.Units[uuID].HitPoints = 45;
		civ.Units[eID].HitPoints = 55;
		civ.Units[uuID].Creatable.TrainTime = 11;
		civ.Units[eID].Creatable.TrainTime = 11;
		civ.Units[uuID].Speed = 1.1;
		civ.Units[eID].Speed = 1.1;
	}
	setCombatStats(this->df, uuID, {{4, 12}, {23, 12}, {21, 2}}, {{1, 3}, {4, 1}, {3, 0}, {19, 0}});
	setCombatStats(this->df, eID, {{4, 14}, {23, 14}, {21, 2}}, {{1, 3}, {4, 1}, {3, 0}, {19, 0}});
	// Clibinarii
	createUU(71, 932, "Clibinarii", {950, 0, 0, 850}, 65, 7636);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "CLIBS";
		civ.Units[eID].Name = "ECLIBS";
		civ.Units[uuID].LanguageDLLCreation = 6781;
		civ.Units[eID].LanguageDLLHelp = 105781;
		civ.Units[eID].LanguageDLLName = 5829;
		civ.Units[eID].LanguageDLLCreation = 6829;
		civ.Units[eID].LanguageDLLHelp = 105829;
		civ.Units[uuID].HitPoints = 140;
		civ.Units[eID].HitPoints = 180;
		civ.Units[uuID].Creatable.TrainTime = 30;
		civ.Units[eID].Creatable.TrainTime = 28;
		civ.Units[uuID].Speed = 1.25;
		civ.Units[eID].Speed = 1.25;
	}
	setUnitCosts(this->df, {uuID, eID}, {90, 0, 0, 70});
	setCombatStats(this->df, uuID, {{4, 12}, {15, 12}}, {{8, 0}, {3, 3}, {4, 1}, {19, 0}});
	setCombatStats(this->df, eID, {{4, 14}, {15, 14}}, {{8, 0}, {3, 5}, {4, 1}, {19, 0}});
	// Silahtar
	createUU(72, 1267, "Silahtar", {0, 1100, 0, 650}, 75, 7637);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "NTWFTW";
		civ.Units[eID].Name = "ENTWFTW";
		civ.Units[eID].LanguageDLLName = 5830;
		civ.Units[eID].LanguageDLLCreation = 6830;
		civ.Units[eID].LanguageDLLHelp = 105830;
		civ.Units[uuID].HitPoints = 60;
		civ.Units[eID].HitPoints = 80;
		civ.Units[uuID].Creatable.TrainTime = 34;
		civ.Units[eID].Creatable.TrainTime = 29;
		civ.Units[uuID].Speed = 1.25;
		civ.Units[eID].Speed = 1.25;
	}
	setUnitCosts(this->df, {uuID, eID}, {0, 40, 0, 70});
	setCombatStats(this->df, uuID, {{3, 6}, {1, 3}}, {{28, 1}, {15, 1}, {8, 0}, {19, 0}, {4, 1}, {3, 1}});
	setCombatStats(this->df, eID, {{3, 8}, {1, 8}}, {{28, 2}, {15, 2}, {8, 0}, {19, 0}, {4, 2}, {3, 4}});
	// Jaridah
	createUU(73, 777, "Jaridah", {900, 0, 0, 450}, 60, 7638);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "JARIDAH";
		civ.Units[eID].Name = "EJARIDAH";
		civ.Units[eID].LanguageDLLName = 5831;
		civ.Units[eID].LanguageDLLCreation = 6831;
		civ.Units[eID].LanguageDLLHelp = 105831;
		civ.Units[uuID].HitPoints = 60;
		civ.Units[eID].HitPoints = 90;
		civ.Units[uuID].Speed = 1.45;
		civ.Units[eID].Speed = 1.45;
		civ.Units[uuID].Creatable.TrainTime = 14;
		civ.Units[eID].Creatable.TrainTime = 14;
	}
	setCombatStats(this->df, uuID, {{4, 11}, {10, 10}}, {{4, 1}, {3, 0}, {8, 12}, {19, 0}});
	setCombatStats(this->df, eID, {{4, 13}, {10, 20}}, {{4, 1}, {3, 0}, {8, 16}, {19, 0}});
	// Wolf Warrior
	createUU(74, 702, "Wolf Warrior", {800, 0, 0, 700}, 65, 7639);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "WHERE";
		civ.Units[eID].Name = "EWHERE";
		civ.Units[eID].LanguageDLLName = 5832;
		civ.Units[eID].LanguageDLLCreation = 6832;
		civ.Units[eID].LanguageDLLHelp = 105832;
		civ.Units[uuID].HitPoints = 125;
		civ.Units[eID].HitPoints = 150;
		civ.Units[uuID].Speed = 1.3;
		civ.Units[eID].Speed = 1.3;
		civ.Units[uuID].Creatable.TrainTime = 21;
		civ.Units[eID].Creatable.TrainTime = 21;
	}
	setUnitCosts(this->df, {uuID, eID}, {85, 0, 0, 50});
	setCombatStats(this->df, uuID, {{4, 13}}, {{4, 3}, {3, 0}, {8, 0}, {19, 0}});
	setCombatStats(this->df, eID, {{4, 13}}, {{4, 3}, {3, 0}, {8, 0}, {19, 0}});
	// Warrior Monk
	createUU(75, 1178, "Warrior Monk", {800, 0, 0, 750}, 80, 7640);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "NAGINATA";
		civ.Units[eID].Name = "ENAGINATA";
		civ.Units[eID].LanguageDLLName = 5833;
		civ.Units[eID].LanguageDLLCreation = 6833;
		civ.Units[eID].LanguageDLLHelp = 105833;
		civ.Units[uuID].HitPoints = 30;
		civ.Units[eID].HitPoints = 40;
		civ.Units[uuID].Speed = 0.9;
		civ.Units[eID].Speed = 0.9;
		civ.Units[uuID].Creatable.TrainTime = 45;
		civ.Units[eID].Creatable.TrainTime = 45;
	}
	setUnitCosts(this->df, {uuID, eID}, {0, 0, 0, 100});
	setCombatStats(this->df, uuID, {{4, 11}, {25, 0}, {20, 0}}, {{4, 0}, {3, 999}, {25, 0}, {19, 0}});
	setCombatStats(this->df, eID, {{4, 14}, {25, 0}, {20, 0}}, {{4, 0}, {3, 999}, {25, 0}, {19, 0}});
	int warmonkID = uuID;
	// Give it a 0 food cost so that it can be added with corvinian army
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Creatable.ResourceCosts[1].Type = 0;
		civ.Units[uuID].Creatable.ResourceCosts[1].Amount = 0;
		civ.Units[uuID].Creatable.ResourceCosts[1].Flag = 1;
		civ.Units[eID].Creatable.ResourceCosts[1].Type = 0;
		civ.Units[eID].Creatable.ResourceCosts[1].Amount = 0;
		civ.Units[eID].Creatable.ResourceCosts[1].Flag = 1;
	}
	// Castellan
	createUU(76, 1718, "Castellan", {700, 0, 0, 900}, 75, 7641);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	setUnitCosts(this->df, {uuID, eID}, {65, 0, 0, 90});
	setCombatStats(this->df, uuID, {{4, 13}}, {{4, 0}, {3, 0}, {8, 0}, {19, 0}, {36, 0}});
	setCombatStats(this->df, eID, {{4, 16}}, {{4, 0}, {3, 0}, {8, 0}, {19, 0}, {36, 0}});
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "YATHQUEEN";
		civ.Units[eID].Name = "EYATHQUEEN";
		civ.Units[uuID].LanguageDLLHelp = 105608;
		civ.Units[eID].LanguageDLLName = 5834;
		civ.Units[eID].LanguageDLLCreation = 6834;
		civ.Units[eID].LanguageDLLHelp = 105834;
		civ.Units[uuID].HitPoints = 55;
		civ.Units[eID].HitPoints = 65;
		civ.Units[uuID].Creatable.TrainTime = 35;
		civ.Units[eID].Creatable.TrainTime = 35;
		civ.Units[uuID].Creatable.HeroMode = 70;
		civ.Units[eID].Creatable.HeroMode = 70;
		civ.Units[uuID].LineOfSight = 9;
		civ.Units[eID].LineOfSight = 15;
	}
	// Lightning Warrior
	createUU(77, 749, "Lightning Warrior", {600, 0, 0, 900}, 65, 7642);
	uuID = (int) (this->df->Civs[0].Units.size() - 2);
	eID = (int) (this->df->Civs[0].Units.size() - 1);
	for (Civ &civ : this->df->Civs) {
		civ.Units[uuID].Name = "LIGHTNINGMCQUEEN";
		civ.Units[eID].Name = "ELIGHTNINGMCQUEEN";
		civ.Units[uuID].LanguageDLLHelp = 105017;
		civ.Units[eID].LanguageDLLName = 5835;
		civ.Units[eID].LanguageDLLCreation = 6835;
		civ.Units[eID].LanguageDLLHelp = 105835;
		civ.Units[uuID].Speed = 1.15;
		civ.Units[eID].Speed = 1.15;
		civ.Units[uuID].HitPoints = 55;
		civ.Units[eID].HitPoints = 65;
		civ.Units[uuID].Creatable.TrainTime = 12;
		civ.Units[eID].Creatable.TrainTime = 12;
	}
	setUnitCosts(this->df, {uuID, eID}, {55, 0, 0, 35});
	setCombatStats(this->df, uuID, {{4, 8}, {15, 8}}, {{1, 0}, {4, 0}, {3, 1}, {19, 0}});
	setCombatStats(this->df, eID, {{4, 10}, {15, 10}}, {{1, 0}, {4, 0}, {3, 2}, {19, 0}});

	// Create TC spearmen
	for (Civ &civ : this->df->Civs) {
		civ.Units[tcSpearman] = civ.Units[93];
		civ.Units[tcPikeman] = civ.Units[358];
		civ.Units[tcHalberdier] = civ.Units[359];
		civ.Units[tcSpearman].Name = "TCPKEMN";
		civ.Units[tcPikeman].Name = "TCPKM";
		civ.Units[tcHalberdier].Name = "TCHLBDM";
		civ.Units[tcSpearman].Creatable.TrainLocationID = 109;
		civ.Units[tcPikeman].Creatable.TrainLocationID = 109;
		civ.Units[tcHalberdier].Creatable.TrainLocationID = 109;
	}
	this->df->Effects[189].EffectCommands.push_back(createEC(3, tcSpearman, tcHalberdier, -1, 0));
	this->duplicationUnits.push_back({93, tcSpearman, tcPikeman});
	this->duplicationUnits.push_back({358, tcPikeman, tcHalberdier});
	this->duplicationUnits.push_back({359, tcHalberdier, -1});

	// Create the TC siege tower
	for (Civ &civ : this->df->Civs) {
		civ.Resources[29] = 1;
		civ.Units[tcSiegeTower] = civ.Units[1105];
		civ.Units[tcSiegeTower].Name = "SIEGTWR_F";
		civ.Units[tcSiegeTower].Creatable.TrainLocationID = 109;
		civ.Units[tcSiegeTower].Creatable.ButtonID = 9;
		civ.Units[tcSiegeTower].Creatable.ResourceCosts[0].Type = 29;
		civ.Units[tcSiegeTower].Creatable.ResourceCosts[0].Amount = 1;
		civ.Units[tcSiegeTower].Creatable.ResourceCosts[0].Flag = 1;
		civ.Units[tcSiegeTower].Creatable.ResourceCosts[1] = civ.Units[tcSiegeTower].Creatable.ResourceCosts[2];
		civ.Units[tcSiegeTower].Creatable.ResourceCosts[2].Type = -1;
		civ.Units[tcSiegeTower].Creatable.ResourceCosts[2].Amount = 0;
		civ.Units[tcSiegeTower].Creatable.ResourceCosts[2].Flag = 0;
	}
	this->duplicationUnits.push_back({1105, tcSiegeTower, -1});

	// Create small farms
	for (Civ &civ : this->df->Civs) {
		civ.Units[smallFarm] = civ.Units[50];
		civ.Units[smallDeadFarm] = civ.Units[357];
		civ.Units[smallRiceFarm] = civ.Units[1187];
		civ.Units[smallDeadRiceFarm] = civ.Units[1188];
		civ.Units[smallFarmDrop] = civ.Units[1193];
		civ.Units[smallFarmStack] = civ.Units[1194];
		civ.Units[smallRiceFarmDrop] = civ.Units[1195];

		vector<int> newFarms = {smallFarm, smallDeadFarm, smallRiceFarm, smallDeadRiceFarm, smallFarmDrop, smallFarmStack, smallRiceFarmDrop};
		for (int i = 0; i < newFarms.size(); i++) {
			if (civ.Units[newFarms[i]].CollisionSize.x == 1.5) {
				civ.Units[newFarms[i]].CollisionSize.x = 1;
				civ.Units[newFarms[i]].CollisionSize.y = 1;
			}
			if (civ.Units[newFarms[i]].ClearanceSize.first == 1.5) {
				civ.Units[newFarms[i]].ClearanceSize.first = 1.0f;
				civ.Units[newFarms[i]].ClearanceSize.second = 1.0f;
			}
			if (civ.Units[newFarms[i]].OutlineSize.x == 1.5) {
				civ.Units[newFarms[i]].OutlineSize.x = 1;
				civ.Units[newFarms[i]].OutlineSize.y = 1;
			}
		}
	}
	this->duplicationUnits.push_back({50, smallFarm, -1});
	this->duplicationUnits.push_back({357, smallDeadFarm, -1});
	this->duplicationUnits.push_back({1187, smallRiceFarm, -1});
	this->duplicationUnits.push_back({1188, smallDeadRiceFarm, -1});
	this->duplicationUnits.push_back({1193, smallFarmDrop, -1});
	this->duplicationUnits.push_back({1194, smallFarmStack, -1});
	this->duplicationUnits.push_back({1195, smallRiceFarmDrop, -1});

	// Create Royal Lancer Cavalry
	for (Civ &civ : this->df->Civs) {
		civ.Units[royalLancer] = civ.Units[1372];
		civ.Units[royalLancer].Name = "RSLANCER";
		civ.Units[royalLancer].LanguageDLLName = 5242;
		civ.Units[royalLancer].LanguageDLLCreation = 6242;
		civ.Units[royalLancer].LanguageDLLHelp = 105242;
		civ.Units[royalLancer].StandingGraphic = {10510, 10511};
		civ.Units[royalLancer].Type50.AttackGraphic = 10508;
		civ.Units[royalLancer].DyingGraphic = 10509;
		civ.Units[royalLancer].DeadFish.WalkingGraphic = 10513;
		civ.Units[royalLancer].HitPoints = 100;
		civ.Units[royalLancer].Type50.DisplayedAttack = 13;
		civ.Units[royalLancer].Type50.Attacks[0].Amount = 13;
	}
	this->unitClasses["steppe"].push_back(royalLancer);

	// Create Royal Battle Elephant
	for (Civ &civ : this->df->Civs) {
		civ.Units[royalElephant] = civ.Units[1134];
		civ.Units[royalElephant].Name = "RBATELE";
		civ.Units[royalElephant].LanguageDLLName = 5241;
		civ.Units[royalElephant].LanguageDLLCreation = 6241;
		civ.Units[royalElephant].LanguageDLLHelp = 105241;
		civ.Units[royalElephant].StandingGraphic = {2926, -1};
		civ.Units[royalElephant].Type50.AttackGraphic = 2924;
		civ.Units[royalElephant].DyingGraphic = 2925;
		civ.Units[royalElephant].DeadFish.WalkingGraphic = 2927;
		civ.Units[royalElephant].HitPoints = 330;
		civ.Units[royalElephant].Type50.DisplayedAttack = 15;
		civ.Units[royalElephant].Type50.Attacks[1].Amount = 15;
		civ.Units[royalElephant].Creatable.DisplayedPierceArmour = 4;
		civ.Units[royalElephant].Type50.Armours[3].Amount = 4;
	}
	this->unitClasses["elephant"].push_back(royalElephant);
	this->unitClasses["stable"].push_back(royalElephant);

	// Create Imperial Scorpion
	for (Civ &civ : this->df->Civs) {
		civ.Units[impScorpion] = civ.Units[542];
		civ.Units[impScorpion].Name = "IMPBAL";
		civ.Units[impScorpion].LanguageDLLName = 5240;
		civ.Units[impScorpion].LanguageDLLCreation = 6240;
		civ.Units[impScorpion].LanguageDLLHelp = 105240;
		civ.Units[impScorpion].HitPoints = 60;
		civ.Units[impScorpion].Type50.DisplayedAttack = 18;
		civ.Units[impScorpion].Type50.Attacks[3].Amount = 18;
		civ.Units[impScorpion].Type50.ProjectileUnitID = impScorpionProjectile;
		civ.Units[impScorpion].Creatable.SecondaryProjectileUnit = impScorpionProjectile;
		civ.Units[impScorpionProjectile].Name = "Projectile Imperial Scorpion";
		civ.Units[impScorpionProjectileFire].Name = "Projectile Imperial Scorpion (Fire)";
		civ.Units[impScorpionProjectile].Type50.DisplayedAttack = 14;
		civ.Units[impScorpionProjectile].Type50.Attacks[2].Amount = 14;
		civ.Units[impScorpionProjectileFire].Type50.DisplayedAttack = 14;
		civ.Units[impScorpionProjectileFire].Type50.Attacks[2].Amount = 14;
	}
	df->Effects[47].EffectCommands.push_back(createEC(3, impScorpionProjectile, impScorpionProjectileFire, -1, 0));
	df->Effects[47].EffectCommands.push_back(createEC(4, impScorpion, -1, 9, amountTypetoD(1, 3)));
	this->unitClasses["scorpion"].push_back(impScorpion);
	this->unitClasses["workshop"].push_back(impScorpion);

	// Create the mill cow
	for (Civ &civ : this->df->Civs) {
		civ.Units[millCow] = civ.Units[705];
		civ.Units[millCow].Name = "BABY";
		civ.Units[millCow].Creatable.TrainLocationID = 68;
		civ.Units[millCow].Creatable.ButtonID = 2;
		civ.Units[millCow].Creatable.ResourceCosts[0].Type = 3;
		civ.Units[millCow].Creatable.ResourceCosts[0].Amount = 40;
	}

	// Create feudal monk
	for (Civ &civ : this->df->Civs) {
		civ.Units[feudalMonk] = civ.Units[125];
		civ.Units[feudalMonk].Name = "MONK_F";
		for (int i = 0; i < civ.Units[feudalMonk].Bird.TaskList.size(); i++) {
			if (civ.Units[feudalMonk].Bird.TaskList[i].ActionType == 132) {
				// Remove the ability to pick up relics
				civ.Units[feudalMonk].Bird.TaskList.erase(civ.Units[feudalMonk].Bird.TaskList.begin() + i);
				i--;
			} else if (civ.Units[feudalMonk].Bird.TaskList[i].ActionType == 104) {
				// Increase conversion times
				if (civ.Units[feudalMonk].Bird.TaskList[i].WorkValue1 == 4 && civ.Units[feudalMonk].Bird.TaskList[i].WorkValue2 == 10) {
					civ.Units[feudalMonk].Bird.TaskList[i].WorkValue1 = 5;
					civ.Units[feudalMonk].Bird.TaskList[i].WorkValue2 = 12;
				} else if (civ.Units[feudalMonk].Bird.TaskList[i].WorkValue1 == 15 && civ.Units[feudalMonk].Bird.TaskList[i].WorkValue2 == 25) {
					civ.Units[feudalMonk].Bird.TaskList[i].WorkValue1 = 20;
					civ.Units[feudalMonk].Bird.TaskList[i].WorkValue2 = 30;
				}
			}
		}
	}

	// Create feudal knight
	for (Civ &civ : this->df->Civs) {
		civ.Units[feudalKnight] = civ.Units[38];
		civ.Units[feudalKnight].Name = "KNIGHT_F";
		civ.Units[feudalKnight].HitPoints = 30;
		civ.Units[feudalKnight].Speed = 1.25;
		civ.Units[feudalKnight].LineOfSight = 3;
		civ.Units[feudalKnight].Bird.SearchRadius = 3;
	}
	// this->df->Effects[175].EffectCommands.push_back(createEC(3, feudalKnight, 283, -1, 0));
	// this->df->Effects[253].EffectCommands.push_back(createEC(3, feudalKnight, 569, -1, 0));
	this->duplicationUnits.push_back({38, feudalKnight, 38});

	// Create City Walls
	for (Civ &civ : this->df->Civs) {
		civ.Units[370].Creatable.TrainLocationID = 118;
		civ.Units[370].Creatable.ButtonID = 8;
		civ.Units[370].HitPoints = 4800;
		civ.Units[370].Creatable.DisplayedPierceArmour = 16;
		civ.Units[370].Type50.DisplayedMeleeArmour = 16;
		civ.Units[370].Type50.Armours = civ.Units[155].Type50.Armours;
		civ.Units[370].Type50.Armours[2].Amount = 16;
		civ.Units[370].Type50.Armours[3].Amount = 16;
		civ.Units[370].Type50.Armours[6].Amount = 16;
		civ.Units[370].Creatable.ResourceCosts[0].Amount = 5;
		civ.Units[370].BlastDefenseLevel = 2;
		for (int i = 0; i < 16; i++) {
			civ.Units[i + 1579].Type50.Armours[1].Amount = 30;
			civ.Units[i + 1579].Creatable.ResourceCosts[0].Amount = 30;
		}
		civ.Units[1582].Creatable.ButtonID = 11;
	}

	// Allow siege towers to shoot
	unit::AttackOrArmor attack0 = unit::AttackOrArmor();
	attack0.Amount = 0;
	attack0.Class = 3;
	unit::AttackOrArmor attack1 = unit::AttackOrArmor();
	attack0.Amount = 0;
	attack0.Class = 11;
	for (Civ &civ : this->df->Civs) {
		for (int i = 0; i < siegeTowers.size(); i++) {
			civ.Units[siegeTowers[i]].Type50.MaxRange = 8;
			civ.Units[siegeTowers[i]].Type50.MinRange = 1;
			civ.Units[siegeTowers[i]].Type50.DisplayedRange = 8;
			civ.Units[siegeTowers[i]].Type50.DisplayedAttack = 0;
			civ.Units[siegeTowers[i]].Type50.AccuracyPercent = 90;
			civ.Units[siegeTowers[i]].Type50.AccuracyDispersion = 0;
			civ.Units[siegeTowers[i]].Type50.ReloadTime = 4;
			civ.Units[siegeTowers[i]].Type50.DisplayedReloadTime = 4;
			civ.Units[siegeTowers[i]].Type50.BlastAttackLevel = 3;
			civ.Units[siegeTowers[i]].Type50.Attacks.push_back(attack0);
			civ.Units[siegeTowers[i]].Type50.Attacks.push_back(attack1);
			civ.Units[siegeTowers[i]].Bird.TaskList.push_back(civ.Units[79].Bird.TaskList[0]);
			civ.Units[siegeTowers[i]].Type50.ProjectileUnitID = 504;
			civ.Units[siegeTowers[i]].Creatable.SecondaryProjectileUnit = 505;
			civ.Units[siegeTowers[i]].Creatable.TotalProjectiles = 1;
			civ.Units[siegeTowers[i]].Creatable.MaxTotalProjectiles = 5;
			civ.Units[siegeTowers[i]].Type50.GraphicDisplacement = {0, 1, 5};
			civ.Units[siegeTowers[i]].Creatable.ProjectileSpawningArea = {1, 0.5, 2};
		}
	}
}

void
Civbuilder::createUniqueTechs() {
	// Deconstruction
	Effect e = Effect();
	e.Name = "Deconstruction";
	e.EffectCommands.push_back(createEC(5, -1, 13, 10, 0.75));
	e.EffectCommands.push_back(createEC(5, -1, 55, 10, 0.75));
	e.EffectCommands.push_back(createEC(5, -1, 54, 10, 0.75));
	createUT(39, 0, e, "Deconstruction", {0, 500, 0, 500}, 60, 7500);

	// Obsidian Arrows
	e.EffectCommands.clear();
	e.Name = "Obsidian Arrows";
	e.EffectCommands.push_back(createEC(4, -1, 0, 9, amountTypetoD(6, 21)));
	createUT(40, 0, e, "Obsidian Arrows", {300, 0, 0, 300}, 40, 7501);

	// Tortoise Engineers
	e.EffectCommands.clear();
	e.Name = "Tortoise Engineers";
	for (int i = 0; i < this->unitClasses["ram"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["ram"][i], -1, 101, 0.5));
	}
	createUT(41, 0, e, "Tortoise Engineers", {0, 100, 0, 200}, 30, 7502);

	// Panoply
	e.EffectCommands.clear();
	e.Name = "Panoply";
	e.EffectCommands.push_back(createEC(4, -1, 6, 8, amountTypetoD(1, 3)));
	e.EffectCommands.push_back(createEC(4, -1, 6, 8, amountTypetoD(1, 4)));
	e.EffectCommands.push_back(createEC(4, -1, 6, 9, amountTypetoD(1, 4)));
	createUT(42, 0, e, "Panoply", {300, 0, 0, 200}, 50, 7507);

	// Clout Archery
	e.EffectCommands.clear();
	e.Name = "Clout Archery";
	e.EffectCommands.push_back(createEC(5, 87, -1, 13, 1.5));
	e.EffectCommands.push_back(createEC(5, 10, -1, 13, 1.5));
	e.EffectCommands.push_back(createEC(5, 14, -1, 13, 1.5));
	createUT(43, 0, e, "Clout Archery", {0, 150, 0, 250}, 40, 7508);

	// Lamellar Armour
	e.EffectCommands.clear();
	e.Name = "Lamellar Armour";
	e.EffectCommands.push_back(createEC(4, -1, 36, 8, amountTypetoD(2, 4)));
	e.EffectCommands.push_back(createEC(4, -1, 36, 8, amountTypetoD(1, 3)));
	for (int i = 0; i < this->unitClasses["camel"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["camel"][i], -1, 8, amountTypetoD(2, 4)));
		e.EffectCommands.push_back(createEC(4, this->unitClasses["camel"][i], -1, 8, amountTypetoD(1, 3)));
	}
	createUT(39, 1, e, "Lamellar Armour", {0, 500, 0, 500}, 40, 7503);

	// Field Repairmen
	e.EffectCommands.clear();
	e.Name = "Field Repairmen";
	for (int i = 0; i < this->unitClasses["ram"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["ram"][i], -1, 109, 20));
	}
	createUT(40, 1, e, "Field Repairmen", {0, 350, 0, 650}, 80, 7504);

	// Golden Age
	e.EffectCommands.clear();
	e.Name = "Golden Age";
	e.EffectCommands.push_back(createEC(5, -1, 3, 13, 1.1));
	createUT(41, 1, e, "Golden Age", {0, 0, 300, 600}, 90, 7505);

	// Villager's Revenge
	e.EffectCommands.clear();
	e.Name = "Villager's Revenge";
	// Create villager spear units
	for (Civ &civ : this->df->Civs) {
		civ.Units.push_back(civ.Units[93]);
		civ.UnitPointers.push_back(1);
		this->vilspear = (int) (civ.Units.size() - 1);

		civ.Units.push_back(civ.Units[358]);
		civ.UnitPointers.push_back(1);
		this->vilpike = (int) (civ.Units.size() - 1);

		civ.Units.push_back(civ.Units[359]);
		civ.UnitPointers.push_back(1);
		this->vilhalb = (int) (civ.Units.size() - 1);

		civ.Units[this->vilspear].Name = "VILPKEMN";
		civ.Units[this->vilpike].Name = "VILPKM";
		civ.Units[this->vilhalb].Name = "VILHLBDM";
	}
	// e.EffectCommands.push_back(createEC(0, -1, 4, 57, vilspear));
	e.EffectCommands.push_back(createEC(0, -1, 4, 66, vilspear));
	createUT(42, 1, e, "Villager's Revenge", {500, 0, 0, 250}, 40, 7506);
	this->duplicationUnits.push_back({93, this->vilspear, this->vilpike});
	this->duplicationUnits.push_back({358, this->vilpike, this->vilhalb});
	this->duplicationUnits.push_back({359, this->vilhalb, -1});
	this->df->Effects[189].EffectCommands.push_back(createEC(3, this->vilspear, this->vilhalb, -1, 0));

	// Gate Crashing
	e.EffectCommands.clear();
	e.Name = "Gate Crashing";
	for (int i = 0; i < this->unitClasses["ram"].size(); i++) {
		e.EffectCommands.push_back(createEC(0, this->unitClasses["ram"][i], -1, 105, 0));
		e.EffectCommands.push_back(createEC(4, this->unitClasses["ram"][i], -1, 104, 75));
	}
	createUT(43, 1, e, "Gate Crashing", {0, 600, 0, 700}, 60, 7509);

	// Replaceable Parts
	e.EffectCommands.clear();
	e.Name = "Replaceable Parts";
	for (int i = 0; i < siegeClasses.size(); i++) {
		e.EffectCommands.push_back(createEC(4, -1, siegeClasses[i], 8, amountTypetoD(1, 3)));
		e.EffectCommands.push_back(createEC(4, -1, siegeClasses[i], 8, amountTypetoD(1, 4)));
	}
	e.EffectCommands.push_back(createEC(6, 270, -1, -1, 0));
	createUT(53, 0, e, "Replaceable Parts", {0, 400, 0, 250}, 35, 7510);

	// Pila
	e.EffectCommands.clear();
	e.Name = "Pila";
	for (int i = 0; i < this->unitClasses["skirmisher"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["skirmisher"][i], -1, 63, 4));
	}
	createUT(50, 1, e, "Pila", {700, 0, 0, 600}, 75, 7511);

	// Enlistment
	e.EffectCommands.clear();
	e.Name = "Enlistment";
	e.EffectCommands.push_back(createEC(0, -1, 6, 110, -0.85));
	createUT(51, 1, e, "Enlistment", {700, 0, 0, 300}, 55, 7512);

	// Marshalled Hunters
	e.EffectCommands.clear();
	e.Name = "Marshalled Hunters";
	e.EffectCommands.push_back(createEC(0, -1, 0, 110, -0.85));
	createUT(52, 1, e, "Marshalled Hunters", {750, 0, 0, 250}, 50, 7513);

	// Shigeto Yumi
	e.EffectCommands.clear();
	e.Name = "Shigeto Yumi";
	e.EffectCommands.push_back(createEC(5, -1, 52, 10, 0.869565));
	e.EffectCommands.push_back(createEC(5, -1, 36, 10, 0.869565));
	e.EffectCommands.push_back(createEC(4, -1, 52, 9, amountTypetoD(6, 19)));
	e.EffectCommands.push_back(createEC(4, -1, 36, 9, amountTypetoD(6, 19)));
	for (int i = 0; i < this->unitClasses["unique"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["unique"][i], -1, 10, 0.869565));
		e.EffectCommands.push_back(createEC(4, this->unitClasses["unique"][i], -1, 9, amountTypetoD(6, 19)));
	}
	createUT(53, 1, e, "Shigeto Yumi", {750, 0, 0, 350}, 75, 7514);
}

void
Civbuilder::createCivBonuses() {
	Effect e = Effect();

	// Imperial Scorpion
	e.EffectCommands.clear();
	e.Name = "Imperial Scorpion";
	e.EffectCommands.push_back(createEC(3, 279, impScorpion, -1, 0));
	e.EffectCommands.push_back(createEC(3, 542, impScorpion, -1, 0));
	this->df->Effects.push_back(e);

	Tech t = Tech();
	t.Name = "Imperial Scorpion";
	t.LanguageDLLName = 7600;
	t.LanguageDLLDescription = 8600;
	t.LanguageDLLHelp = 107600;
	t.LanguageDLLTechTree = 157600;
	t.RequiredTechs.push_back(239);
	t.RequiredTechCount = 1;
	t.ResourceCosts[0].Type = 0;
	t.ResourceCosts[0].Amount = 1200;
	t.ResourceCosts[0].Flag = 1;
	t.ResourceCosts[1].Type = 1;
	t.ResourceCosts[1].Amount = 1000;
	t.ResourceCosts[1].Flag = 1;
	t.ResearchTime = 150;
	t.ResearchLocation = 49;
	t.IconID = 38;
	t.ButtonID = 8;
	t.Civ = 99;
	t.EffectID = (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);
	this->civBonuses[308] = {(int) (this->df->Techs.size() - 1)};

	// Royal Battle Elephant
	e.EffectCommands.clear();
	e.Name = "Royal Battle Elephant";
	e.EffectCommands.push_back(createEC(3, 1132, royalElephant, -1, 0));
	e.EffectCommands.push_back(createEC(3, 1134, royalElephant, -1, 0));
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Royal Battle Elephant";
	t.LanguageDLLName = 7601;
	t.LanguageDLLDescription = 8601;
	t.LanguageDLLHelp = 107601;
	t.LanguageDLLTechTree = 157601;
	t.RequiredTechCount = 1;
	t.RequiredTechs.push_back(631);
	t.ResourceCosts[0].Type = 0;
	t.ResourceCosts[0].Amount = 1200;
	t.ResourceCosts[0].Flag = 1;
	t.ResourceCosts[1].Type = 3;
	t.ResourceCosts[1].Amount = 1000;
	t.ResourceCosts[1].Flag = 1;
	t.ResearchTime = 200;
	t.Civ = 99;
	t.IconID = 121;
	t.ButtonID = 9;
	t.ResearchLocation = 101;
	t.EffectID = (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);
	this->civBonuses[309] = {(int) (this->df->Techs.size() - 1)};
	int royalElephantTech = (int) (this->df->Techs.size() - 1);

	// Royal Lancer
	e.EffectCommands.clear();
	e.Name = "Royal Lancer";
	e.EffectCommands.push_back(createEC(3, 1370, royalLancer, -1, 0));
	e.EffectCommands.push_back(createEC(3, 1372, royalLancer, -1, 0));
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Royal Lancer";
	t.LanguageDLLName = 7602;
	t.LanguageDLLDescription = 8602;
	t.LanguageDLLHelp = 107602;
	t.LanguageDLLTechTree = 157602;
	t.RequiredTechs.push_back(715);
	t.RequiredTechCount = 1;
	t.ResourceCosts[0].Type = 0;
	t.ResourceCosts[0].Amount = 1200;
	t.ResourceCosts[0].Flag = 1;
	t.ResourceCosts[1].Type = 3;
	t.ResourceCosts[1].Amount = 900;
	t.ResourceCosts[1].Flag = 1;
	t.ResearchTime = 100;
	t.ResearchLocation = 101;
	t.ButtonID = 9;
	t.IconID = 123;
	t.Civ = 99;
	t.EffectID = (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);
	this->civBonuses[310] = {(int) (this->df->Techs.size() - 1)};
	int royalLancerTech = (int) (this->df->Techs.size() - 1);

	// Create civ bonuses that are just a list of free techs
	const vector<vector<int>> freeTechs = {{12, 13, 14}, {67, 68, 75},	  {716, 875}, {8, 280},		 {322, 441},
										   {47},		 {254, 428, 786}, {213, 249}, {140, 63, 64}, {315}};
	for (int i = 0; i < freeTechs.size(); i++) {
		e.EffectCommands.clear();
		for (int j = 0; j < freeTechs[i].size(); j++) {
			for (int k = 0; k < 4; k++) {
				e.EffectCommands.push_back(createEC(101, freeTechs[i][j], k, 0, 0));
			}
			if (i == 7) {
				// Exception for wheelbarrow/hand cart for compatibility with other civ bonuses
				e.EffectCommands.push_back(createEC(103, freeTechs[i][j], -1, 0, 1));
			} else {
				e.EffectCommands.push_back(createEC(103, freeTechs[i][j], -1, 0, 0));
			}
		}
		this->createCivBonus(110 + i, e, "C-Bonus, Free techs (set 1)" + to_string(i));
	}

	// Farmers work 15% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 214, -1, 13, 1.23));
	e.EffectCommands.push_back(createEC(5, 259, -1, 13, 1.23));
	e.EffectCommands.push_back(createEC(5, 50, -1, 13, 1.15));
	e.EffectCommands.push_back(createEC(5, 1187, -1, 13, 1.15));
	this->createCivBonus(120, e, "C-Bonus, farmers work 15% faster");

	//-15% age up cost
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(101, 101, 0, 1, -75));
	e.EffectCommands.push_back(createEC(101, 102, 0, 1, -120));
	e.EffectCommands.push_back(createEC(101, 102, 3, 1, -30));
	e.EffectCommands.push_back(createEC(101, 103, 0, 1, -150));
	e.EffectCommands.push_back(createEC(101, 103, 3, 1, -120));
	this->createCivBonus(121, e, "C-Bonus, -15% age up cost");

	//-15% fishing ship cost
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 13, -1, 104, 0.85));
	this->createCivBonus(122, e, "C-Bonus, -15% fishing ship cost");

	// Dock and university techs cost -33%
	e.EffectCommands.clear();
	this->createCivBonus(123, e, "C-Bonus, Dock and university techs cost -33%");

	// Advancing to Imp cost -33%
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(101, 103, 0, 1, -333));
	e.EffectCommands.push_back(createEC(101, 103, 3, 1, -264));
	this->createCivBonus(124, e, "C-Bonus, Imperial cost -33%");

	// Blacksmith upgrades don't cost gold
	e.EffectCommands.clear();
	for (int i = 0; i < this->df->Techs.size(); i++) {
		if (this->df->Techs[i].ResearchLocation == 103) {
			e.EffectCommands.push_back(createEC(101, i, 3, 0, 0));
		}
	}
	this->createCivBonus(125, e, "C-Bonus, Blacksmith upgrades cost no gold");

	// Gunpowder units fire faster
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["gunpowder"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["gunpowder"][i], -1, 10, 0.85));
	}
	this->createCivBonus(126, e, "C-Bonus, Gunpowder fire 18% faster");

	// Builders work 30% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 195, 0, -1, 1.3));
	this->createCivBonus(127, e, "C-Bonus, Builders 30% faster");

	// Military units created 11% faster
	e.EffectCommands.clear();
	for (int i = 0; i < militaryClasses.size(); i++) {
		e.EffectCommands.push_back(createEC(5, -1, militaryClasses[i], 101, 0.9));
	}
	this->createCivBonus(128, e, "C-Bonus, Military units created 11% faster");

	// Villagers carry +3
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 4, 14, 3));
	this->createCivBonus(129, e, "C-Bonus, Villagers carry +3");

	// Trebuchets +30% accuracy
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, 42, -1, 11, 35));
	this->createCivBonus(130, e, "C-Bonus, Trebuchets +30% accuracy");

	// No houses, -100 wood
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 4, 1, -1, 2000));
	e.EffectCommands.push_back(createEC(2, 70, 0, -1, 0));
	e.EffectCommands.push_back(createEC(1, 92, 1, -1, -100));
	this->createCivBonus(131, e, "C-Bonus, No houses, -100 wood");

	// Resources last 15% longer
	e.EffectCommands.clear();
	for (int i = 0; i < productivityRates.size(); i++) {
		e.EffectCommands.push_back(createEC(6, productivityRates[i], -1, -1, 1.15));
	}
	for (int i = 0; i < gatherRates.size(); i++) {
		e.EffectCommands.push_back(createEC(5, gatherRates[i], -1, 13, 0.87));
	}
	this->createCivBonus(132, e, "C-Bonus, Resources last 15% longer");

	// Archers cost -10% Feudal, -20% Castle, -30% Imperial Age
	e.EffectCommands.clear();
	this->df->Effects[485].EffectCommands.clear();
	this->df->Effects[486].EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["footArcher"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["footArcher"][i], -1, 100, 0.9));
		this->df->Effects[485].EffectCommands.push_back(createEC(5, this->unitClasses["footArcher"][i], -1, 100, 0.889));
		this->df->Effects[486].EffectCommands.push_back(createEC(5, this->unitClasses["footArcher"][i], -1, 100, 0.875));
	}
	e.Name = "C-Bonus, Archers cost -10%";
	this->df->Effects.push_back(e);
	t = Tech();
	t.Name = "C-Bonus, Archers cost -10%";
	t.Civ = 99;
	t.EffectID = (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);
	this->civBonuses[133] = {(int) (this->df->Techs.size() - 1), 53, 56};

	// Villagers +3 LOS
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 4, 1, 3));
	this->createCivBonus(134, e, "C-Bonus, Villagers +3 LOS");

	// Fast stoners
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 220, -1, 13, 1.2));
	e.EffectCommands.push_back(createEC(5, 124, -1, 13, 1.2));
	this->createCivBonus(135, e, "C-Bonus, Stone Miners 20% faster");

	// No wood eco upgrades
	e.EffectCommands.clear();
	for (int i = 0; i < ecoUpgrades.size(); i++) {
		e.EffectCommands.push_back(createEC(101, ecoUpgrades[i], 1, 0, 0));
	}
	this->createCivBonus(136, e, "C-Bonus, Eco upgrades no wood");

	//-50% food for blacksmith and siege techs
	e.EffectCommands.clear();
	this->createCivBonus(137, e, "C-Bonus, -50% food blacksmith+siege techs");

	//-50% cost for stable techs
	e.EffectCommands.clear();
	this->createCivBonus(138, e, "C-Bonus, -50% cost stable techs");

	// Spawn sheep from TCs
	this->civBonuses[139] = {299, 303, 305, 310};

	// Wonders provide +50 bonus pop space
	this->civBonuses[140] = {};

	//+3 HP on villagers per economic tech
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 4, 0, 3));
	for (int i = 0; i < ecoUpgrades.size(); i++) {
		this->createCivBonus(141, e, "Villagers +3 HP for eco tech " + to_string(ecoUpgrades[i]), {ecoUpgrades[i]});
	}

	// Villagers regenerate slowly
	this->civBonuses[142] = {792, 809, 810, 811};

	// Military buildings build 100% faster
	e.EffectCommands.clear();
	for (int i = 0; i < militaryBuildings.size(); i++) {
		e.EffectCommands.push_back(createEC(5, militaryBuildings[i], -1, 101, 0.5));
	}
	this->createCivBonus(143, e, "C-Bonus, Military buildings built 100% faster");

	// Resource drop-off buildings provide +5 population
	e.EffectCommands.clear();
	for (int i = 0; i < ecoBuildings.size(); i++) {
		e.EffectCommands.push_back(createEC(0, ecoBuildings[i], -1, 21, 5));
	}
	this->createCivBonus(144, e, "C-Bonus, Drop site buildings provide +5 population");

	// Ballistics researched instantly
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(103, 93, -1, 0, 1));
	e.EffectCommands.push_back(createEC(101, 93, 1, 0, 0));
	this->createCivBonus(145, e, "C-Bonus, Ballistics researched instantly");

	// More free techs
	const vector<vector<int>> freeTechs2 = {
		{100, 237}, {98, 655, 599}, {236, 521}, {74, 76, 77}, {80, 81, 82}, {199, 200, 201},	 {316},		{215, 602}, {384, 434}, {631, royalElephantTech},
		{231, 252}, {319, 233},		{438, 230}, {379, 194},	  {50, 51},		{55, 182, 278, 279}, {321, 54}, {35},		{374, 375}, {246},
		{244},		{65},			{34},		{218},		  {96, 255}};
	for (int i = 0; i < freeTechs2.size(); i++) {
		e.EffectCommands.clear();
		for (int j = 0; j < freeTechs2[i].size(); j++) {
			for (int k = 0; k < 4; k++) {
				e.EffectCommands.push_back(createEC(101, freeTechs2[i][j], k, 0, 0));
			}
			if ((i == 1) && (j == 1)) {
				// Imp Skirm takes 1 second to research
				e.EffectCommands.push_back(createEC(103, freeTechs2[i][j], -1, 0, 1));
			} else {
				e.EffectCommands.push_back(createEC(103, freeTechs2[i][j], -1, 0, 0));
			}
		}
		if (i == 8) {
			// Eagle line upgrade disables auto upgrade
			e.EffectCommands.push_back(createEC(102, -1, -1, -1, 387));
		}
		this->createCivBonus(146 + i, e, "C-Bonus, Free techs (set 2) " + to_string(i));
	}

	// Trade units 20% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, -1, 2, 5, 1.2));
	e.EffectCommands.push_back(createEC(5, -1, 2, 13, 1.2));
	e.EffectCommands.push_back(createEC(5, -1, 19, 5, 1.2));
	e.EffectCommands.push_back(createEC(5, -1, 19, 13, 1.2));
	this->createCivBonus(171, e, "C-Bonus, Trade 20% faster");

	// Squires affects archers
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["footArcher"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["footArcher"][i], -1, 5, 1.1));
	}
	this->createCivBonus(172, e, "C-Bonus, Squires affects archers", {215});

	// Eagles 5/10/15% speed
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["eagle"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["eagle"][i], -1, 5, 1.05));
	}
	this->createCivBonus(173, e, "C-Bonus, Eagles +5% speed", {101});
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["eagle"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["eagle"][i], -1, 5, 1.0476));
	}
	this->createCivBonus(173, e, "C-Bonus, Eagles +10% speed", {102});
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["eagle"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["eagle"][i], -1, 5, 1.0455));
	}
	this->createCivBonus(173, e, "C-Bonus, Eagles +15% speed", {103});

	// Start with +150 wood
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 1, 1, -1, 150));
	e.EffectCommands.push_back(createEC(1, 92, 1, -1, 150));
	this->createCivBonus(174, e, "C-Bonus, +150 wood", {639, 307});

	// Start with +100 stone
	this->civBonuses[175] = {228};

	// Start with +50 wood, +50 stone
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 1, 1, -1, 50));
	e.EffectCommands.push_back(createEC(1, 2, 1, -1, 50));
	e.EffectCommands.push_back(createEC(1, 92, 1, -1, 50));
	e.EffectCommands.push_back(createEC(1, 93, 1, -1, 50));
	this->createCivBonus(176, e, "C-Bonus, +50 wood, +50 stone", {639, 307});

	// Start with +30 gold, +70 food
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 0, 1, -1, 70));
	e.EffectCommands.push_back(createEC(1, 3, 1, -1, 30));
	e.EffectCommands.push_back(createEC(1, 91, 1, -1, 70));
	e.EffectCommands.push_back(createEC(1, 94, 1, -1, 30));
	this->createCivBonus(177, e, "C-Bonus, +70 food, +30 gold", {639, 307});

	// Monk units train 66% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, -1, 18, 101, 0.6));
	e.EffectCommands.push_back(createEC(5, 1811, -1, 101, 0.6));
	this->createCivBonus(178, e, "C-Bonus, Monks train 66% faster");

	// Trebuchets train 50% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, -1, 54, 101, 0.66));
	e.EffectCommands.push_back(createEC(5, -1, 51, 101, 0.66));
	this->createCivBonus(179, e, "C-Bonus, Trebuchets train 50% faster");

	// Cavalry archers train 33% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, -1, 36, 101, 0.8));
	this->createCivBonus(180, e, "C-Bonus, Cav archers train 33% faster");

	// Land explosive units train 200% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, -1, 35, 101, 0.33));
	this->createCivBonus(181, e, "C-Bonus, Petards train 200% faster");

	// Land explosive units +8 pierce armor
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 35, 8, amountTypetoD(8, 3)));
	this->createCivBonus(182, e, "C-Bonus, Petards +8 pierce armor");

	// Bloodlines free in Castle Age
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(101, 435, 0, 0, 0));
	e.EffectCommands.push_back(createEC(101, 435, 3, 0, 0));
	e.EffectCommands.push_back(createEC(103, 435, -1, 0, 0));
	this->createCivBonus(183, e, "C-Bonus, Bloodlines free in Castle Age", {102});

	// Galleys +1 range
	e.EffectCommands.clear();
	for (int i = 0; i < galleys.size(); i++) {
		e.EffectCommands.push_back(createEC(4, galleys[i], -1, 12, 1));
		e.EffectCommands.push_back(createEC(4, galleys[i], -1, 1, 1));
		e.EffectCommands.push_back(createEC(4, galleys[i], -1, 23, 1));
	}
	this->createCivBonus(184, e, "C-Bonus, Galleys +1 range");

	//+100 wood, +100 stone every age up
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 1, 1, -1, 100));
	e.EffectCommands.push_back(createEC(1, 2, 1, -1, 100));
	for (int i = 0; i < 3; i++) {
		this->createCivBonus(185, e, "C-Bonus, +100 wood, +100 stone in age " + to_string(i), {i + 101});
	}

	//+400 food upon reaching Castle Age
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 0, 1, -1, 400));
	this->createCivBonus(186, e, "C-Bonus, +400 food in Castle Age", {102});

	//+350 stone upon reaching Castle Age
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 2, 1, -1, 350));
	this->createCivBonus(187, e, "C-Bonus, +350 stone in Castle Age", {102});

	//+250 wood upon reaching Feudal Age
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 1, 1, -1, 250));
	this->createCivBonus(188, e, "C-Bonus, +250 wood in Feudal Age", {101});

	//+500 gold upon reaching Imperial Age
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 3, 1, -1, 500));
	this->createCivBonus(189, e, "C-Bonus, +500 gold in Imperial Age", {103});

	//+100 HP, 100 pierce armor for monks with relics
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 43, 0, 100));
	e.EffectCommands.push_back(createEC(4, -1, 43, 8, amountTypetoD(100, 3)));
	this->createCivBonus(190, e, "C-Bonus, Monks with relics tank");

	// Land explosive units 2x HP
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, -1, 35, 0, 2));
	this->createCivBonus(191, e, "C-Bonus, Explosive units 2x HP");

	// Town Center spawns a married couple every age
	this->civBonuses[192] = {847, 848, 849};

	// All economic techs researched +100% faster
	e.EffectCommands.clear();
	for (int i = 0; i < ecoUpgrades.size(); i++) {
		e.EffectCommands.push_back(createEC(103, ecoUpgrades[i], -1, 1, (int) (-0.5 * this->df->Techs[ecoUpgrades[i]].ResearchTime)));
	}
	this->createCivBonus(193, e, "C-Bonus, Eco Upgrades research faster");

	// Castles and Kreposts +2000 HP
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, 82, -1, 0, 2000));
	e.EffectCommands.push_back(createEC(4, 1251, -1, 0, 2000));
	this->createCivBonus(194, e, "C-Bonus, Castles and Kreposts +2000 HP");

	// Blacksmith upgrades are free an age after they become available
	const vector<int> blacksmith_2_3 = {199, 200, 211, 212, 67, 68, 81, 82, 74, 76};
	for (int i = 0; i < this->df->Techs.size(); i++) {
		if (this->df->Techs[i].ResearchLocation == 103) {
			int ageRequirement = -1;
			for (int j = 0; j < this->df->Techs[i].getRequiredTechsSize(); j++) {
				if (this->df->Techs[i].RequiredTechs[j] == 101 || this->df->Techs[i].RequiredTechs[j] == 102) {
					ageRequirement = this->df->Techs[i].RequiredTechs[j];
				}
			}
			if (ageRequirement != -1) {
				e.EffectCommands.clear();
				for (int j = 0; j < 4; j++) {
					e.EffectCommands.push_back(createEC(101, i, j, 0, 0));
				}
				e.EffectCommands.push_back(createEC(103, i, -1, 0, 0));
				this->createCivBonus(195, e, "C-Bonus, Blacksmith upgrade " + to_string(i) + " free in " + to_string(ageRequirement), {ageRequirement + 1});
			}
		}
	}

	// Barracks -75 wood
	e.EffectCommands.clear();
	for (int i = 0; i < barracks.size(); i++) {
		e.EffectCommands.push_back(createEC(4, barracks[i], -1, 104, -75));
	}
	this->createCivBonus(196, e, "C-Bonus, Barracks -75 wood");

	// Stable -75 wood
	e.EffectCommands.clear();
	const vector<int> stables = {86, 101, 153};
	for (int i = 0; i < stables.size(); i++) {
		e.EffectCommands.push_back(createEC(4, stables[i], -1, 104, -75));
	}
	this->createCivBonus(197, e, "C-Bonus, Stables -75 wood");

	// Archery Range -75 wood
	e.EffectCommands.clear();
	for (int i = 0; i < stables.size(); i++) {
		e.EffectCommands.push_back(createEC(4, ranges[i], -1, 104, -75));
	}
	this->createCivBonus(198, e, "C-Bonus, Arrg -75 wood");

	// Monastery -100 wood
	for (int i = 0; i < monasteries.size(); i++) {
		e.EffectCommands.push_back(createEC(4, monasteries[i], -1, 104, -100));
	}
	this->createCivBonus(199, e, "C-Bonus, Monastery -100 wood");

	// Siege Workshops -100 wood
	e.EffectCommands.clear();
	for (int i = 0; i < workshops.size(); i++) {
		e.EffectCommands.push_back(createEC(4, workshops[i], -1, 104, -100));
	}
	this->createCivBonus(200, e, "C-Bonus, Siege workshop -100 wood");

	// Military Buildings -50 wood
	e.EffectCommands.clear();
	for (int i = 0; i < militaryBuildings.size(); i++) {
		e.EffectCommands.push_back(createEC(4, militaryBuildings[i], -1, 104, -50));
	}
	this->createCivBonus(201, e, "C-Bonus, Military buildings -50 wood");

	// Blacksmith, University cost -100 wood
	e.EffectCommands.clear();
	for (int i = 0; i < blacksmiths.size(); i++) {
		e.EffectCommands.push_back(createEC(4, blacksmiths[i], -1, 104, -100));
	}
	for (int i = 0; i < universities.size(); i++) {
		e.EffectCommands.push_back(createEC(4, universities[i], -1, 104, -100));
	}
	this->createCivBonus(202, e, "C-Bonus, Blacksmith, University cost -100 wood");

	// Infantry +1/2/3/4 attack vs villagers
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 6, 9, amountTypetoD(1, 10)));
	this->createCivBonus(203, e, "C-Bonus, Infantry +attack vs vils in Age -1");
	for (int i = 0; i < 3; i++) {
		this->createCivBonus(203, e, "C-Bonus, Infantry +attack vs vils in Age " + to_string(101 + i), {101 + i});
	}

	// Fishermen and fishing ships carry +15 food
	this->civBonuses[204] = {844};

	// Galleys +1 attack
	e.EffectCommands.clear();
	for (int i = 0; i < galleys.size(); i++) {
		e.EffectCommands.push_back(createEC(4, galleys[i], -1, 9, amountTypetoD(1, 3)));
	}
	this->createCivBonus(205, e, "C-Bonus, Galleys +1 attack");

	// Steppe Lancers +10 attack vs. villagers
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["steppe"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["steppe"][i], -1, 9, amountTypetoD(10, 10)));
	}
	this->createCivBonus(206, e, "C-Bonus, Steppe Lancers +attack vs vils");

	// Steppe lancers attack 33% faster
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["steppe"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["steppe"][i], -1, 10, 0.75));
	}
	this->createCivBonus(207, e, "C-Bonus, Steppe Lancers attack +33%");

	// Elephant units attack 25% faster
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["elephant"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["elephant"][i], -1, 10, 0.8));
	}
	this->createCivBonus(208, e, "C-Bonus, Elephants +25% attack");

	// Stone walls in dark age
	t = Tech();
	t.Name = "C-Bonus, Stone walls in Dark Age";
	t.Civ = 99;
	df->Techs.push_back(t);
	df->Techs[189].RequiredTechs[1] = (int) (df->Techs.size() - 1);
	this->civBonuses[209] = {(int) (df->Techs.size() - 1)};

	//+50 every resource per advance
	e.EffectCommands.clear();
	for (int i = 0; i < 4; i++) {
		e.EffectCommands.push_back(createEC(1, i, 1, -1, 50));
	}
	for (int i = 0; i < 3; i++) {
		this->createCivBonus(210, e, "C-Bonus, +50 each res in age " + to_string(101 + i), {101 + i});
	}

	// Villagers return 25 food upon death
	this->civBonuses[211] = {};

	// Camel units attack 20% faster
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["camel"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["camel"][i], -1, 10, 0.83333));
	}
	this->createCivBonus(212, e, "C-Bonus, Camels +20% attack speed");

	// Mangonels can cut trees
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, 280, -1, 9, amountTypetoD(100, 18)));
	this->createCivBonus(213, e, "C-Bonus, Mangonels cut trees");

	// Free siege tower in Feudal Age, cost 50%
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 1105, -1, 100, 0.5));
	e.EffectCommands.push_back(createEC(2, 885, 1, -1, 0));
	this->createCivBonus(214, e, "C-Bonus, Free siege tower", {101});

	// Rams, Siege Towers x2 garrison space
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["ram"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["ram"][i], -1, 2, 2));
	}
	e.EffectCommands.push_back(createEC(5, 1105, -1, 2, 2));
	this->createCivBonus(215, e, "C-Bonus, Rams, Siege Towers +garrison");

	// Towers support 15 population
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(0, -1, 52, 21, 15));
	this->createCivBonus(216, e, "C-Bonus, Towers provide +15 population");

	// Gunpowder units move 20% faster
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["gunpowder"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["gunpowder"][i], -1, 5, 1.2));
	}
	this->createCivBonus(217, e, "C-Bonus, Gunpowder +20% speed");

	// Castles refund 350 stone
	this->civBonuses[218] = {};

	// Monk units 20% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, -1, 18, 5, 1.2));
	e.EffectCommands.push_back(createEC(5, -1, 43, 5, 1.2));
	e.EffectCommands.push_back(createEC(5, 1811, -1, 5, 1.2));
	this->createCivBonus(219, e, "C-Bonus, Monks +20% speed");

	// Melee cavalry +2 vs skirmishers
	this->civBonuses[220] = {877};

	// Barracks upgrades earlier
	vector<int> techIDs = {950, 951, 952, 953, 954, 955, 956};

	t = Tech();
	t.Name = "C-Bonus, Eagle Warriors in Feudal";
	t.Civ = 99;
	t.RequiredTechs.push_back(101);
	t.RequiredTechs.push_back(433);
	t.RequiredTechCount = 2;
	this->df->Techs.push_back(t);
	this->df->Techs[384].RequiredTechs[2] = (int) (this->df->Techs.size() - 1);
	techIDs.push_back((int) (this->df->Techs.size() - 1));

	t = Tech();
	t.Name = "C-Bonus, Elite Eagles in Castle";
	t.Civ = 99;
	t.RequiredTechs.push_back(102);
	t.RequiredTechs.push_back(384);
	t.RequiredTechCount = 2;
	this->df->Techs.push_back(t);
	this->df->Techs[434].RequiredTechs[2] = (int) (this->df->Techs.size() - 1);
	techIDs.push_back((int) (this->df->Techs.size() - 1));

	this->civBonuses[221] = techIDs;

	// Cows from mills
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(2, millCow, 1, -1, 0));
	this->createCivBonus(222, e, "C-Bonus, Cows from mills");

	// Start with a horse
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 234, 0, -1, 1));
	e.EffectCommands.push_back(createEC(7, 814, 619, 1, 0));
	this->createCivBonus(223, e, "C-Bonus, start with horse", {639, 307});

	// Siege Towers 2x HP
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 1105, -1, 0, 2));
	this->createCivBonus(224, e, "C-Bonus, Siege Towers x2 HP");

	// Siege Towers train 100% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 1105, -1, 101, 0.5));
	this->createCivBonus(225, e, "C-Bonus, Siege Towers train 100% faster");

	// Siege units cost -33% wood
	this->civBonuses[226] = {876};

	// Cannon galleons get ballistics
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(0, 374, -1, 19, 1));
	e.EffectCommands.push_back(createEC(0, 374, -1, 5, 7));
	this->createCivBonus(227, e, "C-Bonus, Cannon galleons w/ ballistics");

	// Warships +10 attack vs villagers
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 22, 9, amountTypetoD(10, 10)));
	this->createCivBonus(228, e, "C-Bonus, Warships +attack vs vils");

	// Rams generate stone when fighting
	this->civBonuses[229] = {};

	// TCs +50% work rate in Imperial
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 142, -1, 13, 1.5));
	this->createCivBonus(230, e, "C-Bonus, Town Center +50% Productivity", {103});

	// Feudal Age cost -25%
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(101, 101, 0, 1, -125));
	this->createCivBonus(231, e, "C-Bonus, Feudal cost -25%");

	// Spearmen and skirmishers train 50% faster
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["spear"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["spear"][i], -1, 101, 0.66));
	}
	for (int i = 0; i < this->unitClasses["skirmisher"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["skirmisher"][i], -1, 101, 0.66));
	}
	this->createCivBonus(232, e, "C-Bonus, Spearmen and Skirms train 50% faster");

	// Spearman-line +25% HP
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["spear"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["spear"][i], -1, 0, 1.25));
	}
	this->createCivBonus(233, e, "C-Bonus, Spearmen +25% HP");

	// Market techs cost no gold
	e.EffectCommands.clear();
	for (int i = 0; i < this->df->Techs.size(); i++) {
		if (this->df->Techs[i].ResearchLocation == 84) {
			e.EffectCommands.push_back(createEC(101, i, 3, 0, 0));
		}
	}
	this->createCivBonus(234, e, "C-Bonus, Market techs cost no gold");

	// Trees last 100% longer
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(6, 189, -1, -1, 2));
	e.EffectCommands.push_back(createEC(5, 123, -1, 13, 0.5));
	e.EffectCommands.push_back(createEC(5, 218, -1, 13, 0.5));
	this->createCivBonus(235, e, "C-Bonus, Trees last 100% longer");

	// Stone resources last 30% longer
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(6, 79, -1, -1, 1.3));
	e.EffectCommands.push_back(createEC(5, 124, -1, 13, 0.769231));
	e.EffectCommands.push_back(createEC(5, 220, -1, 13, 0.769231));
	this->createCivBonus(236, e, "C-Bonus, Stone resources last 30% longer");

	// Gold resources last 30% longer
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(6, 47, -1, -1, 1.3));
	e.EffectCommands.push_back(createEC(5, 579, -1, 13, 0.769231));
	e.EffectCommands.push_back(createEC(5, 581, -1, 13, 0.769231));
	this->createCivBonus(237, e, "C-Bonus, Gold resources last 30% longer");

	// Berries +35% more food -- have to give foragers a different productivity resource (use with mayans too)
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(6, 198, -1, -1, 1.35));
	e.EffectCommands.push_back(createEC(5, 120, -1, 13, 0.741));
	e.EffectCommands.push_back(createEC(5, 354, -1, 13, 0.741));
	this->createCivBonus(238, e, "C-Bonus, Berries contain +35% food");

	// City Walls
	e.EffectCommands.clear();
	e.Name = "City Walls";
	const vector<vector<int>> wallUpgrades = {{117, 155, 370},	{64, 63, 1579},	  {78, 67, 1580},	{81, 80, 1581},	  {487, 488, 1582}, {88, 85, 1583},
											  {91, 90, 1584},	{95, 92, 1585},	  {490, 491, 1586}, {659, 660, 1587}, {661, 662, 1588}, {663, 664, 1589},
											  {665, 666, 1590}, {667, 668, 1591}, {669, 670, 1592}, {671, 672, 1593}, {673, 674, 1594}};
	for (int i = 0; i < wallUpgrades.size(); i++) {
		e.EffectCommands.push_back(createEC(3, wallUpgrades[i][0], wallUpgrades[i][2], -1, 0));
		e.EffectCommands.push_back(createEC(3, wallUpgrades[i][1], wallUpgrades[i][2], -1, 0));
	}
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "City Walls Requirement";
	t.Civ = 99;
	this->df->Techs.push_back(t);
	this->civBonuses[239] = {(int) (df->Techs.size() - 1)};

	t = Tech();
	t.Name = "City Walls";
	t.LanguageDLLName = 7603;
	t.LanguageDLLDescription = 8603;
	t.LanguageDLLHelp = 107603;
	t.LanguageDLLTechTree = 157603;
	t.RequiredTechs.push_back(103);
	t.RequiredTechs.push_back(194);
	t.RequiredTechs.push_back((int) (df->Techs.size() - 1));
	t.RequiredTechCount = 3;
	t.ResourceCosts[0].Type = 0;
	t.ResourceCosts[0].Amount = 400;
	t.ResourceCosts[0].Flag = 1;
	t.ResourceCosts[1].Type = 1;
	t.ResourceCosts[1].Amount = 400;
	t.ResourceCosts[1].Flag = 1;
	t.ResearchTime = 200;
	t.ResearchLocation = 209;
	t.IconID = 46;
	t.ButtonID = 8;
	t.Civ = -1;
	t.EffectID = (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);

	// Fish +35% more food
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(6, 200, -1, -1, 1.35));
	e.EffectCommands.push_back(createEC(5, 13, -1, 13, 0.741));
	e.EffectCommands.push_back(createEC(5, 56, -1, 13, 0.741));
	e.EffectCommands.push_back(createEC(5, 57, -1, 13, 0.741));
	this->createCivBonus(240, e, "C-Bonus, Fish contain +35% food");

	// Units garrisoned in buildings heal 2x faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, -1, 52, 108, 2));
	e.EffectCommands.push_back(createEC(5, -1, 3, 108, 2));
	this->createCivBonus(241, e, "C-Bonus, units heal faster");

	// Repairers work 100% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 156, -1, 13, 2));
	e.EffectCommands.push_back(createEC(5, 222, -1, 13, 2));
	this->createCivBonus(242, e, "C-Bonus, repair 100% faster");

	// Skirmishers +1 attack vs infantry
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["skirmisher"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["skirmisher"][i], -1, 9, amountTypetoD(1, 1)));
	}
	this->createCivBonus(243, e, "C-Bonus, Skirmishers +1 vs infantry");

	// Archery range units +1 pierce attack
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["archery"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["archery"][i], -1, 9, amountTypetoD(1, 3)));
	}
	this->createCivBonus(244, e, "C-Bonus, ARRG units +1 attack");

	// Archery range units +1 melee armor per age (starting in Feudal)
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["archery"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["archery"][i], -1, 8, amountTypetoD(1, 4)));
	}
	for (int i = 0; i < 3; i++) {
		this->createCivBonus(245, e, "C-Bonus, +1 armor in age " + to_string(101 + i), {101 + i});
	}

	// Siege units +1 pierce armor in Castle and Imperial (+2 total)
	e.EffectCommands.clear();
	for (int i = 0; i < siegeClasses.size(); i++) {
		e.EffectCommands.push_back(createEC(4, -1, siegeClasses[i], 8, amountTypetoD(1, 3)));
	}
	this->createCivBonus(246, e, "C-Bonus, +1P armor age 102", {102});
	this->createCivBonus(246, e, "C-Bonus, +1P armor age 103", {103});

	// Parthian tactics in Castle Age
	t = Tech();
	t.Name = "C-Bonus, Parthian tactics in Castle";
	t.Civ = 99;
	t.RequiredTechs.push_back(102);
	t.RequiredTechCount = 1;
	df->Techs.push_back(t);
	df->Techs[436].RequiredTechs[1] = (int) (df->Techs.size() - 1);
	this->civBonuses[247] = {(int) (df->Techs.size() - 1)};

	// Castle Age cost -25%
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(101, 102, 0, 1, -200));
	e.EffectCommands.push_back(createEC(101, 102, 3, 1, -50));
	this->createCivBonus(248, e, "C-Bonus, Castle Age cost -25%");

	// Cavalry +1 attack
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 12, 9, amountTypetoD(1, 4)));
	e.EffectCommands.push_back(createEC(4, -1, 47, 9, amountTypetoD(1, 4)));
	this->createCivBonus(249, e, "C-Bonus, Cavalry +1 attack");

	// Forging, iron casting, blast furnace add +1 damage vs buildings
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 6, 9, amountTypetoD(1, 21)));
	e.EffectCommands.push_back(createEC(4, -1, 12, 9, amountTypetoD(1, 21)));
	e.EffectCommands.push_back(createEC(4, -1, 47, 9, amountTypetoD(1, 21)));
	this->createCivBonus(250, e, "C-Bonus, +1 building attack age 101", {101});
	this->createCivBonus(250, e, "C-Bonus, +1 building attack age 102", {102});
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 6, 9, amountTypetoD(2, 21)));
	e.EffectCommands.push_back(createEC(4, -1, 12, 9, amountTypetoD(2, 21)));
	e.EffectCommands.push_back(createEC(4, -1, 47, 9, amountTypetoD(2, 21)));
	this->createCivBonus(250, e, "C-Bonus, +2 building attack age 103", {103});

	// All buildings +3 pierce armor
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 3, 8, amountTypetoD(3, 3)));
	e.EffectCommands.push_back(createEC(4, -1, 52, 8, amountTypetoD(3, 3)));
	this->createCivBonus(251, e, "C-Bonus, buildings +3 pierce armor");

	// Foot archers +5% speed per age (starting in Feudal)
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["footArcher"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["footArcher"][i], -1, 5, 1.05));
	}
	this->createCivBonus(252, e, "C-Bonus, Archers +5% speed", {101});
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["footArcher"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["footArcher"][i], -1, 5, 1.0476));
	}
	this->createCivBonus(252, e, "C-Bonus, Archers +10% speed", {102});
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["footArcher"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["footArcher"][i], -1, 5, 1.0455));
	}
	this->createCivBonus(252, e, "C-Bonus, Archers +15% speed", {103});

	// Foot archers and skirms +1 vs villagers
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["footArcher"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["footArcher"][i], -1, 9, amountTypetoD(1, 10)));
	}
	for (int i = 0; i < this->unitClasses["skirmisher"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["skirmisher"][i], -1, 9, amountTypetoD(1, 10)));
	}
	this->createCivBonus(253, e, "C-Bonus, foot archers +1 vs vils");

	// Gunpowder +10 bonus vs camels
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["gunpowder"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["gunpowder"][i], -1, 9, amountTypetoD(10, 30)));
	}
	this->createCivBonus(254, e, "C-Bonus, gunpowder bonus vs camels");

	// Eagles +6 vs stone defenses
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["eagle"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["eagle"][i], -1, 9, amountTypetoD(6, 13)));
		e.EffectCommands.push_back(createEC(4, this->unitClasses["eagle"][i], -1, 9, amountTypetoD(3, 22)));
		e.EffectCommands.push_back(createEC(4, this->unitClasses["eagle"][i], -1, 9, amountTypetoD(6, 26)));
	}
	this->createCivBonus(255, e, "C-Bonus, eagles bonus vs stone");

	// Scouts, Light Cavalry, Hussar +4 vs stone defenses
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["lightCav"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["lightCav"][i], -1, 9, amountTypetoD(4, 13)));
		e.EffectCommands.push_back(createEC(4, this->unitClasses["lightCav"][i], -1, 9, amountTypetoD(2, 22)));
		e.EffectCommands.push_back(createEC(4, this->unitClasses["lightCav"][i], -1, 9, amountTypetoD(4, 26)));
	}
	this->createCivBonus(256, e, "C-Bonus, scouts bonus vs stone");

	// Villagers work 5% faster
	this->civBonuses[257] = {887};

	// Villagers +1 carry capacity per TC tech
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 4, 14, 1));
	for (int i = 0; i < this->df->Techs.size(); i++) {
		if (this->df->Techs[i].ResearchLocation == 109) {
			this->createCivBonus(258, e, "C-Bonus, +1 capacity TC tech " + to_string(i), {i});
		}
	}

	// Farms 10x HP
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 50, -1, 0, 10));
	e.EffectCommands.push_back(createEC(5, 1187, -1, 0, 10));
	this->createCivBonus(259, e, "C-Bonus, Farms 10x HP");

	// Militia-line +2 vs cavalry
	e.EffectCommands.clear();
	for (int i = 0; i < militias.size(); i++) {
		e.EffectCommands.push_back(createEC(4, militias[i], -1, 9, amountTypetoD(2, 8)));
		e.EffectCommands.push_back(createEC(4, militias[i], -1, 9, amountTypetoD(1, 30)));
	}
	this->createCivBonus(260, e, "C-Bonus, Militia-line +2 vs cav");

	// Elite steppe lancer free
	e.EffectCommands.clear();
	for (int i = 0; i < 4; i++) {
		e.EffectCommands.push_back(createEC(101, 715, i, 0, 0));
		e.EffectCommands.push_back(createEC(101, royalLancerTech, i, 0, 0));
	}
	e.EffectCommands.push_back(createEC(103, 715, -1, 0, 0));
	e.EffectCommands.push_back(createEC(103, royalLancerTech, -1, 0, 0));
	this->createCivBonus(261, e, "C-Bonus, Elite steppe lancer free");

	// Steppe lancers +2 pierce armor
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["steppe"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["steppe"][i], -1, 8, amountTypetoD(2, 3)));
	}
	this->createCivBonus(262, e, "C-Bonus, Steppe Lancers +2P armor");

	// Castles and kreposts bonus vs buildings
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, 82, -1, 9, amountTypetoD(100, 11)));
	e.EffectCommands.push_back(createEC(4, 1251, -1, 9, amountTypetoD(50, 11)));
	this->createCivBonus(263, e, "C-Bonus, Castles bonus vs buildings");

	// All villagers work 10% faster in Imperial Age
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, -1, 4, 13, 1.1));
	this->createCivBonus(264, e, "C-Bonus, vils work 10% faster in Imp", {103});

	// Outposts +5 garrison space
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, 598, -1, 2, 5));
	e.EffectCommands.push_back(createEC(0, 598, -1, 30, 15));
	this->createCivBonus(265, e, "C-Bonus, Outposts garrison");

	// Builders/repairers +10 pierce armor
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, 118, -1, 8, amountTypetoD(10, 3)));
	e.EffectCommands.push_back(createEC(4, 212, -1, 8, amountTypetoD(10, 3)));
	e.EffectCommands.push_back(createEC(4, 156, -1, 8, amountTypetoD(10, 3)));
	e.EffectCommands.push_back(createEC(4, 222, -1, 8, amountTypetoD(10, 3)));
	this->createCivBonus(266, e, "C-Bonus, Builders/Repairers +10P armor");

	// Castles and Kreposts support 50 population
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, 82, -1, 21, 30));
	e.EffectCommands.push_back(createEC(4, 1251, -1, 21, 30));
	this->createCivBonus(267, e, "C-Bonus, Castles and Kreposts 50 pop");

	// Bombard towers bonus vs rams
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, 236, -1, 9, amountTypetoD(30, 17)));
	this->createCivBonus(268, e, "C-Bonus, Bombard towers bonus vs rams");

	// Towers bonus vs cavalry
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 52, 9, amountTypetoD(6, 8)));
	this->createCivBonus(269, e, "C-Bonus, Towers bonus vs cavalry");

	// Feudal monks
	techIDs.clear();
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(2, feudalMonk, 1, -1, 0));
	e.Name = "Feudal Monk (make avail)";
	df->Effects.push_back(e);
	t = Tech();
	t.Name = "Feudal Monk (make avail)";
	t.RequiredTechs.push_back(101);
	t.RequiredTechCount = 1;
	t.Civ = 99;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);
	techIDs.push_back((int) (df->Techs.size() - 1));
	t = Tech();
	t.Name = "C-Bonus, Feudal Monastery";
	t.RequiredTechs.push_back(101);
	t.RequiredTechCount = 1;
	t.Civ = 99;
	t.EffectID = 199;
	df->Techs.push_back(t);
	techIDs.push_back((int) (df->Techs.size() - 1));
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(3, feudalMonk, 125, -1, 0));
	e.Name = "Upgrade monks Castle";
	df->Effects.push_back(e);
	t = Tech();
	t.Name = "Upgrade monks Castle";
	t.RequiredTechs.push_back(102);
	t.RequiredTechs.push_back(techIDs[0]);
	t.RequiredTechs.push_back(157);
	t.RequiredTechCount = 3;
	t.Civ = 99;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);
	techIDs.push_back((int) (df->Techs.size() - 1));
	t = Tech();
	t.Name = "Feudal Monastery built";
	t.RequiredTechs.push_back(107);
	t.RequiredTechCount = 1;
	t.Civ = 99;
	df->Techs.push_back(t);
	df->Techs[135].RequiredTechs[5] = (int) (df->Techs.size() - 1);
	techIDs.push_back((int) (df->Techs.size() - 1));
	this->civBonuses[270] = techIDs;

	// Scorpions and ballistas produced 50% faster
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["scorpion"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["scorpion"][i], -1, 101, 0.66));
	}
	e.EffectCommands.push_back(createEC(5, 1120, -1, 101, 0.66));
	e.EffectCommands.push_back(createEC(5, 1122, -1, 101, 0.66));
	e.EffectCommands.push_back(createEC(5, 827, -1, 101, 0.66));
	e.EffectCommands.push_back(createEC(5, 829, -1, 101, 0.66));
	this->createCivBonus(271, e, "C-Bonus, Scorpions produced 50% faster");

	// Town Centers fire faster
	e.EffectCommands.clear();
	for (int i = 0; i < townCenters.size(); i++) {
		e.EffectCommands.push_back(createEC(5, townCenters[i], -1, 10, 0.8));
	}
	this->createCivBonus(272, e, "C-Bonus, TCs fire 25% faster");

	// Trebuchets -75 gold
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 51, 105, -75));
	e.EffectCommands.push_back(createEC(4, -1, 54, 105, -75));
	this->createCivBonus(273, e, "C-Bonus, Trebuchets -75 gold");

	// All explosive units +blast radius
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["explosive"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["explosive"][i], -1, 22, 2));
	}
	this->createCivBonus(274, e, "C-Bonus, Explosive units +blast radius");

	// Gunpowder bonus vs buildings
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["gunpowder"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["gunpowder"][i], -1, 9, amountTypetoD(12, 11)));
	}
	this->createCivBonus(275, e, "C-Bonus, Gunpowder bonus vs buildings");

	// Eagles +1 pierce armor
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["eagle"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["eagle"][i], -1, 8, amountTypetoD(1, 3)));
	}
	this->createCivBonus(276, e, "C-Bonus, Eagles +1P armor");

	// Gunpowder units +1 attack per university tech
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["gunpowder"].size(); i++) {
		int attackType = -1;
		for (int j = 0; j < this->df->Civs[0].Units[this->unitClasses["gunpowder"][i]].Type50.Attacks.size(); j++) {
			unit::AttackOrArmor attack = df->Civs[0].Units[this->unitClasses["gunpowder"][i]].Type50.Attacks[j];
			if (((attack.Class == 4) || (attack.Class == 3)) && (attack.Amount != 0)) {
				attackType = attack.Class;
			}
		}
		if (attackType != -1) {
			e.EffectCommands.push_back(createEC(4, this->unitClasses["gunpowder"][i], -1, 9, amountTypetoD(1, attackType)));
		}
	}
	for (int i = 0; i < this->df->Techs.size(); i++) {
		if (this->df->Techs[i].ResearchLocation == 209) {
			this->createCivBonus(277, e, "Gunpowder +1 attack for uni tech " + to_string(i), {i});
		}
	}

	// Buildings +3% HP per university tech (cumulative)
	e.EffectCommands.clear();
	for (int i = 0; i < buildingClasses.size(); i++) {
		e.EffectCommands.push_back(createEC(5, -1, buildingClasses[i], 0, 1.03));
	}
	for (int i = 0; i < this->df->Techs.size(); i++) {
		if (this->df->Techs[i].ResearchLocation == 209) {
			this->createCivBonus(278, e, "Building +3% armor for uni tech" + to_string(i), {i});
		}
	}

	// Each monastery tech spawns a monk
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 234, 0, -1, 1));
	e.EffectCommands.push_back(createEC(7, 125, 104, 1, 0));
	e.EffectCommands.push_back(createEC(7, 125, 1806, 1, 0));
	for (int i = 0; i < this->df->Techs.size(); i++) {
		if (this->df->Techs[i].ResearchLocation == 104) {
			this->createCivBonus(279, e, "Monk for church tech " + to_string(i), {i});
		}
	}

	// Folwark replaces Mill
	// Note: Sicilian farm bonus doesn't compound with Folwark
	this->civBonuses[280] = {793, 794, 795, 796, 797, 798, 799, 818, 819, 820, 821};

	// Stone miners generate gold
	this->civBonuses[281] = {805, 806, 807};

	// Winged Hussar replaces Hussar
	this->civBonuses[282] = {789, 791};

	// Chemistry in Castle Age
	this->civBonuses[283] = {800, 801};

	// Spearman-line deals +25% bonus damage
	this->civBonuses[284] = {802};

	// Fervor and Sanctity affects villagers
	this->civBonuses[285] = {803, 804};

	// Houfnice
	this->civBonuses[286] = {787};

	// Caravanseri
	this->civBonuses[287] = {518};

	// Gunpowder units +1/+1P
	this->civBonuses[288] = {520};

	//+200w per age
	this->civBonuses[289] = {851, 852, 853};

	// Barracks techs cost -50%
	e.EffectCommands.clear();
	e.Name = "C-Bonus, Barracks techs cost -50%";
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "C-Bonus, Barracks techs cost -50%";
	t.EffectID = (this->df->Effects.size() - 1);
	t.Civ = 99;
	this->df->Techs.push_back(t);
	this->civBonuses[290] = {(int) (this->df->Techs.size() - 1)};

	// Skirmishers and elephant archers attack 25% faster
	this->civBonuses[291] = {845};

	// Elephant units -25% bonus damage and conversion resist
	this->civBonuses[292] = {846};

	// Ships regenerate
	this->civBonuses[293] = {850};

	// Start with 2 forage bushes
	this->civBonuses[294] = {857};

	// Livestock garrison mills
	this->civBonuses[295] = {856};

	// Mounted units +20/30/40% damage
	this->civBonuses[296] = {854, 859, 874};

	// Garrison fishing ships
	this->civBonuses[297] = {855};

	// Thirisadai
	this->civBonuses[298] = {841};

	// Shrivamsha
	this->civBonuses[299] = {842, 843};

	// Camel Scouts
	this->civBonuses[300] = {235, 860, 858};

	//+20g per tech
	this->civBonuses[301] = {186, 323, 324, 326};

	// Galleys and Dromons armor
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, 21, -1, 8, amountTypetoD(1, 3)));
	e.EffectCommands.push_back(createEC(4, 21, -1, 8, amountTypetoD(1, 4)));
	e.EffectCommands.push_back(createEC(4, 442, -1, 8, amountTypetoD(2, 3)));
	e.EffectCommands.push_back(createEC(4, 442, -1, 8, amountTypetoD(2, 4)));
	e.EffectCommands.push_back(createEC(4, 1795, -1, 8, amountTypetoD(2, 3)));
	e.EffectCommands.push_back(createEC(4, 1795, -1, 8, amountTypetoD(2, 4)));
	this->createCivBonus(302, e, "C-Bonus, Navy armor");

	// Battle Elephants +1/+1P armor
	this->civBonuses[303] = {640};

	// Monks +3/+3P armor
	this->civBonuses[304] = {870};

	// Blacksmith double effect
	this->civBonuses[305] = {889, 890, 891};

	// Scorpions cheap and ballistics
	this->civBonuses[306] = {892, 893};

	// Legionary
	this->civBonuses[307] = {885, 895};

	// Cavalry Archers +2 attack vs archers
	this->civBonuses[311] = {190};

	// Eco buildings cheaper + effectiveness
	this->civBonuses[312] = {958, 960, 961, 962, 963, 964, 965, 966};
	this->df->Effects[953].EffectCommands.clear();
	for (int i = 0; i < ecoBuildings.size(); i++) {
		this->df->Effects[953].EffectCommands.push_back(createEC(5, ecoBuildings[i], -1, 100, 0.75));
	}

	// Free relic
	this->civBonuses[313] = {949, 957};

	// Savar
	this->civBonuses[314] = {526, 527};

	// Extra warship missile
	this->civBonuses[315] = {959};

	// Fortified church
	this->civBonuses[316] = {930, 948};

	// Mule carts
	this->civBonuses[317] = {932};

	// Start with mule cart
	this->civBonuses[318] = {229, 925};

	// Church work bonus area
	this->civBonuses[319] = {934};

	// Less bonus damage from higher elevation
	this->civBonuses[320] = {926};

	// Cavalry regen
	this->civBonuses[321] = {937, 938};

	// Flaming camel bonus
	this->civBonuses[322] = {703};

	// Refund stone
	e.EffectCommands.clear();
	for (int i = 0; i < this->df->Civs[0].Units.size(); i++) {
		bool isBuilding = false;
		for (int j = 0; j < buildingClasses.size(); j++) {
			if (buildingClasses[j] == this->df->Civs[0].Units[i].Class) {
				isBuilding = true;
			}
		}
		if (isBuilding) {
			int buildingWidth = (int) (this->df->Civs[0].Units[i].CollisionSize.x / 0.5);
			int buildingLength = (int) (this->df->Civs[0].Units[i].CollisionSize.y / 0.5);
			int buildingArea = buildingWidth * buildingLength;
			e.EffectCommands.push_back(createEC(0, i, -1, 27, buildingArea));
		}
	}
	this->createCivBonus(323, e, "C-Bonus, Buildings rebate stone");

	// Villagers cooperate
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(0, -1, 4, 63, 96));
	this->createCivBonus(324, e, "C-Bonus, Villagers cooperate");

	// Husbandry affects attack speed
	e.EffectCommands.clear();
	e.Name = "Husbandry affects attack speed";
	for (int i = 0; i < this->df->Effects[39].EffectCommands.size(); i++) {
		EffectCommand ec = this->df->Effects[39].EffectCommands[i];
		ec.C = 10;
		ec.D = 0.9090909;
		e.EffectCommands.push_back(ec);
	}
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "C-Bonus, Husbandry affects attack speed";
	t.Civ = 99;
	t.RequiredTechCount = 1;
	t.RequiredTechs.push_back(39);
	t.EffectID = (int) (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);
	this->civBonuses[325] = {(int) (this->df->Techs.size() - 1)};

	// Trade yields stone
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 253, -1, -1, 10));
	this->createCivBonus(326, e, "C-Bonus, Trade yields stone");

	// Blacksmith upgrades affect bonus damage
	techIDs = {};
	// Infantry/cavalry attack
	const vector<int> melee_attack_classes = {6, 12, 47};

	e.EffectCommands.clear();
	e.Name = "+1 bonus attack for melee units";
	for (int i = 0; i < 40; i++) {
		if (i != 4 && i != 3) {
			for (int j = 0; j < melee_attack_classes.size(); j++) {
				e.EffectCommands.push_back(createEC(4, -1, melee_attack_classes[j], 9, amountTypetoD(1, i)));
			}
		}
	}
	this->df->Effects.push_back(e);
	int meleeAttack1 = (int) (this->df->Effects.size() - 1);

	e.EffectCommands.clear();
	e.Name = "+2 bonus attack for melee units";
	for (int i = 0; i < 40; i++) {
		if (i != 4 && i != 3) {
			for (int j = 0; j < melee_attack_classes.size(); j++) {
				e.EffectCommands.push_back(createEC(4, -1, melee_attack_classes[j], 9, amountTypetoD(2, i)));
			}
		}
	}
	this->df->Effects.push_back(e);
	int meleeAttack2 = (int) (this->df->Effects.size() - 1);

	t = Tech();
	t.Name = "Forging gives bonus damage";
	t.RequiredTechCount = 1;
	t.RequiredTechs.push_back(67);
	t.Civ = 99;
	t.EffectID = meleeAttack1;
	this->df->Techs.push_back(t);
	techIDs.push_back((int) (this->df->Techs.size() - 1));

	t = Tech();
	t.Name = "Iron Casting gives bonus damage";
	t.RequiredTechCount = 1;
	t.RequiredTechs.push_back(68);
	t.Civ = 99;
	t.EffectID = meleeAttack1;
	this->df->Techs.push_back(t);
	techIDs.push_back((int) (this->df->Techs.size() - 1));

	t = Tech();
	t.Name = "Blast Furnace gives bonus damage";
	t.RequiredTechCount = 1;
	t.RequiredTechs.push_back(75);
	t.Civ = 99;
	t.EffectID = meleeAttack2;
	this->df->Techs.push_back(t);
	techIDs.push_back((int) (this->df->Techs.size() - 1));

	// Ranged attack
	e.EffectCommands.clear();
	e.Name = "+1 bonus attack for ranged units";
	for (int i = 0; i < 40; i++) {
		if (i != 4 && i != 3) {
			for (int j = 0; j < this->df->Effects[192].EffectCommands.size(); j++) {
				if (this->df->Effects[192].EffectCommands[j].C == 9) {
					EffectCommand ec = this->df->Effects[192].EffectCommands[j];
					ec.D = amountTypetoD(1, i);
					e.EffectCommands.push_back(ec);
				}
			}
		}
	}
	this->df->Effects.push_back(e);
	int rangedAttack1 = (int) (this->df->Effects.size() - 1);

	t = Tech();
	t.Name = "Fletching gives bonus damage";
	t.RequiredTechCount = 1;
	t.RequiredTechs.push_back(199);
	t.Civ = 99;
	t.EffectID = rangedAttack1;
	this->df->Techs.push_back(t);
	techIDs.push_back((int) (this->df->Techs.size() - 1));

	t = Tech();
	t.Name = "Bodkin Arrow gives bonus damage";
	t.RequiredTechCount = 1;
	t.RequiredTechs.push_back(200);
	t.Civ = 99;
	t.EffectID = rangedAttack1;
	this->df->Techs.push_back(t);
	techIDs.push_back((int) (this->df->Techs.size() - 1));

	t = Tech();
	t.Name = "Bracer gives bonus damage";
	t.RequiredTechCount = 1;
	t.RequiredTechs.push_back(201);
	t.Civ = 99;
	t.EffectID = rangedAttack1;
	this->df->Techs.push_back(t);
	techIDs.push_back((int) (this->df->Techs.size() - 1));

	// Infantry armor
	e.EffectCommands.clear();
	e.Name = "+1 bonus armor for infantry units";
	for (int i = 0; i < 40; i++) {
		if (i != 4 && i != 3) {
			e.EffectCommands.push_back(createEC(4, -1, 6, 8, amountTypetoD(1, i)));
			e.EffectCommands.push_back(createEC(4, 1831, -1, 8, amountTypetoD(1, i)));
		}
	}
	this->df->Effects.push_back(e);
	int infantryArmor1 = (int) (this->df->Effects.size() - 1);

	t = Tech();
	t.Name = "Scale Mail Armor gives bonus resistance";
	t.RequiredTechCount = 1;
	t.RequiredTechs.push_back(74);
	t.Civ = 99;
	t.EffectID = infantryArmor1;
	this->df->Techs.push_back(t);
	techIDs.push_back((int) (this->df->Techs.size() - 1));

	t = Tech();
	t.Name = "Chain Mail Armor gives bonus resistance";
	t.RequiredTechCount = 1;
	t.RequiredTechs.push_back(76);
	t.Civ = 99;
	t.EffectID = infantryArmor1;
	this->df->Techs.push_back(t);
	techIDs.push_back((int) (this->df->Techs.size() - 1));

	t = Tech();
	t.Name = "Plate Mail Armor gives bonus resistance";
	t.RequiredTechCount = 1;
	t.RequiredTechs.push_back(77);
	t.Civ = 99;
	t.EffectID = infantryArmor1;
	this->df->Techs.push_back(t);
	techIDs.push_back((int) (this->df->Techs.size() - 1));

	// Cavalry armor
	e.EffectCommands.clear();
	e.Name = "+1 bonus armor for cavalry units";
	for (int i = 0; i < 40; i++) {
		if (i != 4 && i != 3) {
			e.EffectCommands.push_back(createEC(4, -1, 12, 8, amountTypetoD(1, i)));
			e.EffectCommands.push_back(createEC(4, -1, 47, 8, amountTypetoD(1, i)));
			e.EffectCommands.push_back(createEC(4, 1738, -1, 8, amountTypetoD(1, i)));
			e.EffectCommands.push_back(createEC(4, 1740, -1, 8, amountTypetoD(1, i)));
		}
	}
	this->df->Effects.push_back(e);
	int cavalryArmor1 = (int) (this->df->Effects.size() - 1);

	t = Tech();
	t.Name = "Scale Barding Armor gives bonus resistance";
	t.RequiredTechCount = 1;
	t.RequiredTechs.push_back(81);
	t.Civ = 99;
	t.EffectID = cavalryArmor1;
	this->df->Techs.push_back(t);
	techIDs.push_back((int) (this->df->Techs.size() - 1));

	t = Tech();
	t.Name = "Chain Barding Armor gives bonus resistance";
	t.RequiredTechCount = 1;
	t.RequiredTechs.push_back(82);
	t.Civ = 99;
	t.EffectID = cavalryArmor1;
	this->df->Techs.push_back(t);
	techIDs.push_back((int) (this->df->Techs.size() - 1));

	t = Tech();
	t.Name = "Plate Barding Armor gives bonus resistance";
	t.RequiredTechCount = 1;
	t.RequiredTechs.push_back(80);
	t.Civ = 99;
	t.EffectID = cavalryArmor1;
	this->df->Techs.push_back(t);
	techIDs.push_back((int) (this->df->Techs.size() - 1));

	// Archer armor
	e.EffectCommands.clear();
	e.Name = "+1 bonus armor for archer units";
	for (int i = 0; i < 40; i++) {
		if (i != 4 && i != 3) {
			e.EffectCommands.push_back(createEC(4, -1, 0, 8, amountTypetoD(1, i)));
			e.EffectCommands.push_back(createEC(4, -1, 36, 8, amountTypetoD(1, i)));
			e.EffectCommands.push_back(createEC(4, -1, 44, 8, amountTypetoD(1, i)));
			e.EffectCommands.push_back(createEC(4, -1, 23, 8, amountTypetoD(1, i)));
			e.EffectCommands.push_back(createEC(4, 1738, -1, 8, amountTypetoD(1, i)));
			e.EffectCommands.push_back(createEC(4, 1740, -1, 8, amountTypetoD(1, i)));
		}
	}
	this->df->Effects.push_back(e);
	int archerArmor1 = (int) (this->df->Effects.size() - 1);

	t = Tech();
	t.Name = "Padded Archer Armor gives bonus resistance";
	t.RequiredTechCount = 1;
	t.RequiredTechs.push_back(211);
	t.Civ = 99;
	t.EffectID = archerArmor1;
	this->df->Techs.push_back(t);
	techIDs.push_back((int) (this->df->Techs.size() - 1));

	t = Tech();
	t.Name = "Leather Archer Armor gives bonus resistance";
	t.RequiredTechCount = 1;
	t.RequiredTechs.push_back(212);
	t.Civ = 99;
	t.EffectID = archerArmor1;
	this->df->Techs.push_back(t);
	techIDs.push_back((int) (this->df->Techs.size() - 1));

	t = Tech();
	t.Name = "Ring Archer Armor gives bonus resistance";
	t.RequiredTechCount = 1;
	t.RequiredTechs.push_back(219);
	t.Civ = 99;
	t.EffectID = archerArmor1;
	this->df->Techs.push_back(t);
	techIDs.push_back((int) (this->df->Techs.size() - 1));

	this->civBonuses[327] = techIDs;

	// Cav archers dodge
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(0, -1, 36, 59, 1));
	e.EffectCommands.push_back(createEC(0, -1, 36, 60, 0.05));
	e.EffectCommands.push_back(createEC(0, -1, 36, 61, 0));
	e.EffectCommands.push_back(createEC(0, -1, 36, 62, 4));
	this->createCivBonus(328, e, "C-Bonus, cav archers dodge");

	// Khmer farms
	techIDs = {654};

	t = Tech();
	t.Name = "Mill requirement";
	t.Civ = 99;
	this->df->Techs.push_back(t);
	this->df->Techs[216].RequiredTechs[2] = (int) (this->df->Techs.size() - 1);
	techIDs.push_back((int) (this->df->Techs.size() - 1));

	this->civBonuses[329] = techIDs;

	// 2x2 farms
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(3, 50, smallFarm, -1, 0));
	e.EffectCommands.push_back(createEC(3, 357, smallDeadFarm, -1, 0));
	e.EffectCommands.push_back(createEC(3, 1187, smallRiceFarm, -1, 0));
	e.EffectCommands.push_back(createEC(3, 1188, smallDeadRiceFarm, -1, 0));
	e.EffectCommands.push_back(createEC(3, 1193, smallFarmDrop, -1, 0));
	e.EffectCommands.push_back(createEC(3, 1194, smallFarmStack, -1, 0));
	e.EffectCommands.push_back(createEC(3, 1195, smallRiceFarmDrop, -1, 0));
	this->createCivBonus(330, e, "C-Bonus, 2x2 farms");

	// Archery range techs cost -50%
	e.EffectCommands.clear();
	e.Name = "C-Bonus, Archery techs cost -50%";
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "C-Bonus, Archery techs cost -50%";
	t.EffectID = (this->df->Effects.size() - 1);
	t.Civ = 99;
	this->df->Techs.push_back(t);
	this->civBonuses[290] = {(int) (this->df->Techs.size() - 1)};

	// Feudal Knights
	techIDs.clear();
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(2, feudalKnight, 1, -1, 0));
	e.Name = "Feudal Knight (make avail)";
	df->Effects.push_back(e);

	t = Tech();
	t.Name = "Feudal Knight (make avail)";
	t.RequiredTechs.push_back(101);
	t.RequiredTechCount = 1;
	t.Civ = 99;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);
	techIDs.push_back((int) (df->Techs.size() - 1));

	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(3, feudalKnight, 38, -1, 0));
	e.Name = "Upgrade knights Feudal";
	df->Effects.push_back(e);

	t = Tech();
	t.Name = "Upgrade knights Castle";
	t.RequiredTechs.push_back(102);
	t.RequiredTechs.push_back(techIDs[0]);
	t.RequiredTechs.push_back(166);
	t.RequiredTechCount = 3;
	t.Civ = 99;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);
	techIDs.push_back((int) (df->Techs.size() - 1));

	this->civBonuses[332] = techIDs;

	// Siege Towers shoot bullets
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, 1105, -1, 9, amountTypetoD(6, 3)));
	e.EffectCommands.push_back(createEC(4, 1105, -1, 9, amountTypetoD(6, 11)));
	e.EffectCommands.push_back(createEC(4, tcSiegeTower, -1, 9, amountTypetoD(6, 3)));
	e.EffectCommands.push_back(createEC(4, tcSiegeTower, -1, 9, amountTypetoD(6, 11)));
	this->createCivBonus(333, e, "C-Bonus, siege towers fire arrows");

	// Make the regen bonus work with other HP increases
	// Cav 20%
	e.EffectCommands.clear();
	e.Name = "Cavalry +20% HP + regen";
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Cavalry +20% HP + regen";
	t.RequiredTechs.push_back(290);
	t.RequiredTechs.push_back(937);
	t.RequiredTechCount = 2;
	t.EffectID = (this->df->Effects.size() - 1);
	t.Civ = -1;
	this->df->Techs.push_back(t);

	// Camel 25%
	e.EffectCommands.clear();
	e.Name = "Camels +25% HP + regen";
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Camels +25% HP + regen";
	t.RequiredTechs.push_back(312);
	t.RequiredTechs.push_back(937);
	t.RequiredTechCount = 2;
	t.EffectID = (this->df->Effects.size() - 1);
	t.Civ = -1;
	this->df->Techs.push_back(t);

	// Zealotry
	e.EffectCommands.clear();
	e.Name = "Zealotry + regen";
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Zealotry + regen";
	t.RequiredTechs.push_back(9);
	t.RequiredTechs.push_back(937);
	t.RequiredTechCount = 2;
	t.EffectID = (this->df->Effects.size() - 1);
	t.Civ = -1;
	this->df->Techs.push_back(t);

	// Make all the trickle bonuses work with each other
	// Stone to gold + roman villagers
	e.EffectCommands.clear();
	e.Name = "Roman workers stone to gold trickle";
	e.EffectCommands.push_back(createEC(6, 241, -1, -1, 1.05));
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Roman workers stone to gold trickle";
	t.RequiredTechs.push_back(887);
	t.RequiredTechs.push_back(805);
	t.RequiredTechCount = 2;
	t.EffectID = (this->df->Effects.size() - 1);
	t.Civ = -1;
	this->df->Techs.push_back(t);

	// Stone to gold + stone mining bonus
	e.EffectCommands.clear();
	e.Name = "Stone mining C-Bonus gold generation increase";
	e.EffectCommands.push_back(createEC(6, 241, -1, -1, 1.2));
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Stone mining C-Bonus gold generation increase";
	t.RequiredTechs.push_back(805);
	t.RequiredTechs.push_back(this->civBonuses[135][0]);
	t.RequiredTechCount = 2;
	t.EffectID = (this->df->Effects.size() - 1);
	t.Civ = -1;
	this->df->Techs.push_back(t);

	// Stone to gold + mule cart effectiveness
	e.EffectCommands.clear();
	e.Name = "Mule cart effectiveness gold generation increase (stone to gold)";
	e.EffectCommands.push_back(createEC(6, 241, -1, -1, 1.05217));
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Mule cart effectiveness gold generation increase (stone mining)";
	t.RequiredTechs.push_back(805);
	t.RequiredTechs.push_back(965);
	t.RequiredTechCount = 2;
	t.EffectID = (this->df->Effects.size() - 1);
	t.Civ = -1;
	this->df->Techs.push_back(t);

	t = Tech();
	t.Name = "Mule cart effectiveness gold generation increase (stone shaft mining)";
	t.RequiredTechs.push_back(805);
	t.RequiredTechs.push_back(966);
	t.RequiredTechCount = 2;
	t.EffectID = (this->df->Effects.size() - 1);
	t.Civ = -1;
	this->df->Techs.push_back(t);

	// Wood to gold + Roman workers
	e.EffectCommands.clear();
	e.Name = "Roman workers wood to gold trickle";
	e.EffectCommands.push_back(createEC(6, 266, -1, -1, 1.05));
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Roman workers wood to gold trickle";
	t.RequiredTechs.push_back(887);
	t.RequiredTechs.push_back(629);
	t.RequiredTechCount = 2;
	t.EffectID = (this->df->Effects.size() - 1);
	t.Civ = -1;
	this->df->Techs.push_back(t);

	// Wood to gold + mule cart effectiveness
	e.EffectCommands.clear();
	e.Name = "Mule cart effectiveness gold generation increase (wood to gold 1)";
	e.EffectCommands.push_back(createEC(6, 266, -1, -1, 1.06667));
	this->df->Effects.push_back(e);

	e.EffectCommands.clear();
	e.Name = "Mule cart effectiveness gold generation increase (wood to gold 2)";
	e.EffectCommands.push_back(createEC(6, 266, -1, -1, 1.03636));
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Mule cart effectiveness gold generation increase (double-bit axe)";
	t.RequiredTechs.push_back(629);
	t.RequiredTechs.push_back(960);
	t.RequiredTechCount = 2;
	t.EffectID = (this->df->Effects.size() - 2);
	t.Civ = -1;
	this->df->Techs.push_back(t);

	t = Tech();
	t.Name = "Mule cart effectiveness gold generation increase (bow saw)";
	t.RequiredTechs.push_back(629);
	t.RequiredTechs.push_back(961);
	t.RequiredTechCount = 2;
	t.EffectID = (this->df->Effects.size() - 2);
	t.Civ = -1;
	this->df->Techs.push_back(t);

	t = Tech();
	t.Name = "Mule cart effectiveness gold generation increase (two-man saw)";
	t.RequiredTechs.push_back(629);
	t.RequiredTechs.push_back(962);
	t.RequiredTechCount = 2;
	t.EffectID = (this->df->Effects.size() - 1);
	t.Civ = -1;
	this->df->Techs.push_back(t);

	// Wood to gold + wood chopping bonus
	e.EffectCommands.clear();
	e.Name = "Wood chopping bonus gold generation increase";
	e.EffectCommands.push_back(createEC(6, 266, -1, -1, 1.15));
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Wood chopping bonus gold generation increase";
	t.RequiredTechs.push_back(629);
	t.RequiredTechs.push_back(385);
	t.RequiredTechCount = 2;
	t.EffectID = (this->df->Effects.size() - 1);
	t.Civ = -1;
	this->df->Techs.push_back(t);

	// Berries to wood + Roman workers
	e.EffectCommands.clear();
	e.Name = "Roman workers berries to wood trickle";
	e.EffectCommands.push_back(createEC(6, 267, -1, -1, 1.05));
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Roman workers berries to wood trickle";
	t.RequiredTechs.push_back(887);
	t.RequiredTechs.push_back(453);
	t.RequiredTechCount = 2;
	t.EffectID = (this->df->Effects.size() - 1);
	t.Civ = -1;
	this->df->Techs.push_back(t);

	// Berries to gold + foraging bonus
	e.EffectCommands.clear();
	e.Name = "Foraging bonus wood generation increase";
	e.EffectCommands.push_back(createEC(6, 267, -1, -1, 1.1));
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Foraging bonus wood generation increase";
	t.RequiredTechs.push_back(453);
	t.RequiredTechs.push_back(524);
	t.RequiredTechCount = 2;
	t.EffectID = (this->df->Effects.size() - 1);
	t.Civ = -1;
	this->df->Techs.push_back(t);

	// Farms to gold + Roman workers
	e.EffectCommands.clear();
	e.Name = "Roman workers farms to gold trickle";
	e.EffectCommands.push_back(createEC(6, 236, -1, -1, 1.05));
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Roman workers farms to gold trickle";
	t.RequiredTechs.push_back(887);
	t.RequiredTechs.push_back(754);
	t.RequiredTechCount = 2;
	t.EffectID = (this->df->Effects.size() - 1);
	t.Civ = -1;
	this->df->Techs.push_back(t);

	// Farms to gold + farming bonus
	e.EffectCommands.clear();
	e.Name = "Farming bonus gold generation increase";
	e.EffectCommands.push_back(createEC(6, 236, -1, -1, 1.15));
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Farming bonus gold generation increase";
	t.RequiredTechs.push_back(754);
	t.RequiredTechs.push_back(this->civBonuses[120][0]);
	t.RequiredTechCount = 2;
	t.EffectID = (this->df->Effects.size() - 1);
	t.Civ = -1;
	this->df->Techs.push_back(t);

	// Make siege towers that have attack affected by other attacks
	e.EffectCommands.clear();
	e.Name = "Siege tower attack + blacksmith attack";
	for (int i = 0; i < siegeTowers.size(); i++) {
		e.EffectCommands.push_back(createEC(4, siegeTowers[i], -1, 9, amountTypetoD(1, 3)));
		e.EffectCommands.push_back(createEC(4, siegeTowers[i], -1, 9, amountTypetoD(1, 11)));
		e.EffectCommands.push_back(createEC(4, siegeTowers[i], -1, 1, 1));
		e.EffectCommands.push_back(createEC(4, siegeTowers[i], -1, 12, 1));
		e.EffectCommands.push_back(createEC(4, siegeTowers[i], -1, 23, 1));
	}
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Siege tower attack + fletching";
	t.Civ = -1;
	t.RequiredTechCount = 2;
	t.RequiredTechs.push_back(this->civBonuses[333][0]);
	t.RequiredTechs.push_back(199);
	t.EffectID = (int) (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);

	t = Tech();
	t.Name = "Siege tower attack + bodkin arrow";
	t.Civ = -1;
	t.RequiredTechCount = 2;
	t.RequiredTechs.push_back(this->civBonuses[333][0]);
	t.RequiredTechs.push_back(200);
	t.EffectID = (int) (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);

	t = Tech();
	t.Name = "Siege tower attack + bracer";
	t.Civ = -1;
	t.RequiredTechCount = 2;
	t.RequiredTechs.push_back(this->civBonuses[333][0]);
	t.RequiredTechs.push_back(201);
	t.EffectID = (int) (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);

	e.EffectCommands.clear();
	e.Name = "Siege tower attack + chemistry";
	for (int i = 0; i < siegeTowers.size(); i++) {
		e.EffectCommands.push_back(createEC(4, siegeTowers[i], -1, 9, amountTypetoD(1, 3)));
		e.EffectCommands.push_back(createEC(4, siegeTowers[i], -1, 9, amountTypetoD(1, 11)));
	}
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Siege tower attack + chemistry";
	t.Civ = -1;
	t.RequiredTechCount = 2;
	t.RequiredTechs.push_back(this->civBonuses[333][0]);
	t.RequiredTechs.push_back(47);
	t.EffectID = (int) (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);

	e.EffectCommands.clear();
	e.Name = "Siege tower attack + bonus damage vs cav";
	for (int i = 0; i < siegeTowers.size(); i++) {
		e.EffectCommands.push_back(createEC(4, siegeTowers[i], -1, 9, amountTypetoD(6, 8)));
	}
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Siege tower attack + bonus damage vs cav";
	t.Civ = -1;
	t.RequiredTechCount = 2;
	t.RequiredTechs.push_back(this->civBonuses[333][0]);
	t.RequiredTechs.push_back(this->civBonuses[269][0]);
	t.EffectID = (int) (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);

	e.EffectCommands.clear();
	e.Name = "Siege tower attack + yasama";
	for (int i = 0; i < siegeTowers.size(); i++) {
		e.EffectCommands.push_back(createEC(4, siegeTowers[i], -1, 102, 2));
		e.EffectCommands.push_back(createEC(4, siegeTowers[i], -1, 107, 2));
	}
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Siege tower attack + yasama";
	t.Civ = -1;
	t.RequiredTechCount = 2;
	t.RequiredTechs.push_back(this->civBonuses[333][0]);
	t.RequiredTechs.push_back(484);
	t.EffectID = (int) (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);

	e.EffectCommands.clear();
	e.Name = "Siege tower attack + yeomen";
	for (int i = 0; i < siegeTowers.size(); i++) {
		e.EffectCommands.push_back(createEC(4, siegeTowers[i], -1, 9, amountTypetoD(2, 3)));
		e.EffectCommands.push_back(createEC(4, siegeTowers[i], -1, 9, amountTypetoD(2, 11)));
	}
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Siege tower attack + yeomen";
	t.Civ = -1;
	t.RequiredTechCount = 2;
	t.RequiredTechs.push_back(this->civBonuses[333][0]);
	t.RequiredTechs.push_back(3);
	t.EffectID = (int) (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);

	t = Tech();
	t.Name = "Siege tower attack + svan towers";
	t.Civ = -1;
	t.RequiredTechCount = 2;
	t.RequiredTechs.push_back(this->civBonuses[333][0]);
	t.RequiredTechs.push_back(923);
	t.EffectID = (int) (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);

	e.EffectCommands.clear();
	e.Name = "Siege tower attack + stronghold";
	for (int i = 0; i < siegeTowers.size(); i++) {
		e.EffectCommands.push_back(createEC(5, siegeTowers[i], -1, 10, 0.75));
	}
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Siege tower attack + stronghold";
	t.Civ = -1;
	t.RequiredTechCount = 2;
	t.RequiredTechs.push_back(this->civBonuses[333][0]);
	t.RequiredTechs.push_back(482);
	t.EffectID = (int) (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);

	// Hussite Reforms affects all monk units and works with discounts
	this->df->Effects[812].EffectCommands.push_back(createEC(0, 1811, -1, 105, 0));
	this->df->Effects[812].EffectCommands.push_back(createEC(0, 1811, -1, 103, 90));
	this->df->Effects[812].EffectCommands.push_back(createEC(0, 775, -1, 105, 0));
	this->df->Effects[812].EffectCommands.push_back(createEC(0, 775, -1, 103, 100));

	e.EffectCommands.clear();
	e.Name = "Hussite Reforms + Portuguese discount";
	e.EffectCommands.push_back(createEC(5, -1, 18, 103, 0.8));
	e.EffectCommands.push_back(createEC(5, 1811, -1, 103, 0.8));
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Hussite Reforms + Portuguese discount";
	t.Civ = -1;
	t.RequiredTechCount = 2;
	t.RequiredTechs.push_back(559);
	t.RequiredTechs.push_back(785);
	t.EffectID = (int) (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);

	e.EffectCommands.clear();
	e.Name = "Hussite Reforms + Kshatriyas";
	e.EffectCommands.push_back(createEC(5, -1, 18, 103, 0.75));
	e.EffectCommands.push_back(createEC(5, 1811, -1, 103, 0.75));
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Hussite Reforms + Kshatriyas";
	t.Civ = -1;
	t.RequiredTechCount = 2;
	t.RequiredTechs.push_back(835);
	t.RequiredTechs.push_back(785);
	t.EffectID = (int) (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);

	e.EffectCommands.clear();
	e.Name = "Hussite Reforms + Food Discount 0";
	e.EffectCommands.push_back(createEC(5, -1, 18, 103, 0.9));
	e.EffectCommands.push_back(createEC(5, 1811, -1, 103, 0.9));
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Hussite Reforms + Food Discount 0";
	t.Civ = -1;
	t.RequiredTechCount = 2;
	t.RequiredTechs.push_back(152);
	t.RequiredTechs.push_back(785);
	t.EffectID = (int) (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);

	e.EffectCommands.clear();
	e.Name = "Hussite Reforms + Food Discount 1";
	e.EffectCommands.push_back(createEC(5, -1, 18, 103, 0.944));
	e.EffectCommands.push_back(createEC(5, 1811, -1, 103, 0.944));
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Hussite Reforms + Food Discount 1";
	t.Civ = -1;
	t.RequiredTechCount = 2;
	t.RequiredTechs.push_back(153);
	t.RequiredTechs.push_back(785);
	t.EffectID = (int) (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);

	e.EffectCommands.clear();
	e.Name = "Hussite Reforms + Food Discount 2";
	e.EffectCommands.push_back(createEC(5, -1, 18, 103, 0.941));
	e.EffectCommands.push_back(createEC(5, 1811, -1, 103, 0.941));
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Hussite Reforms + Food Discount 2";
	t.Civ = -1;
	t.RequiredTechCount = 2;
	t.RequiredTechs.push_back(154);
	t.RequiredTechs.push_back(785);
	t.EffectID = (int) (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);

	e.EffectCommands.clear();
	e.Name = "Hussite Reforms + Food Discount 3";
	e.EffectCommands.push_back(createEC(5, -1, 18, 103, 0.9375));
	e.EffectCommands.push_back(createEC(5, 1811, -1, 103, 0.9375));
	this->df->Effects.push_back(e);

	t = Tech();
	t.Name = "Hussite Reforms + Food Discount 3";
	t.Civ = -1;
	t.RequiredTechCount = 2;
	t.RequiredTechs.push_back(155);
	t.RequiredTechs.push_back(785);
	t.EffectID = (int) (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);
}

void
Civbuilder::createTeamBonuses() {
	Effect e = Effect();

	// Scorpions minimum range reduced
	this->teamBonuses[38] = 891;

	// Trade +50 HP
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 2, 0, 50));
	e.EffectCommands.push_back(createEC(4, -1, 19, 0, 50));
	this->createTeamBonus(39, e, "Trade +50 HP");

	// Houses built +100% faster
	e.EffectCommands.clear();
	for (int i = 0; i < houses.size(); i++) {
		e.EffectCommands.push_back(createEC(5, houses[i], -1, 101, 0.5));
	}
	this->createTeamBonus(40, e, "Houses built +100% faster");

	// Monks +2 LOS
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 18, 1, 2));
	e.EffectCommands.push_back(createEC(4, -1, 43, 1, 2));
	e.EffectCommands.push_back(createEC(4, 1811, -1, 1, 2));
	this->createTeamBonus(41, e, "Monks +2 LOS");

	// Herdables +2 LOS
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 58, 1, 2));
	this->createTeamBonus(42, e, "Herdables +2 LOS");

	// Economic buildings built +100% faster
	e.EffectCommands.clear();
	for (int i = 0; i < ecoBuildings.size(); i++) {
		e.EffectCommands.push_back(createEC(5, ecoBuildings[i], -1, 101, 0.5));
	}
	this->createTeamBonus(43, e, "Drop-off buildings built +100% faster");

	// Unique units +5% HP
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["unique"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["unique"][i], -1, 0, 1.05));
	}
	this->createTeamBonus(44, e, "Unique units +5% HP");

	// Trash units train 20% faster
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["spear"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["spear"][i], -1, 101, 0.833));
	}
	for (int i = 0; i < this->unitClasses["skirmisher"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["skirmisher"][i], -1, 101, 0.833));
	}
	for (int i = 0; i < this->unitClasses["lightCav"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["lightCav"][i], -1, 101, 0.833));
	}
	this->createTeamBonus(45, e, "Trash units train 20% faster");

	// Fishing ships +2 LOS
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 21, 1, 2));
	this->createTeamBonus(46, e, "Fishing ships +2 LOS");

	// Scout-line +2 vs gunpowder
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["lightCav"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["lightCav"][i], -1, 9, amountTypetoD(2, 23)));
	}
	this->createTeamBonus(47, e, "Scout-line +2 vs. gunpowder");

	// Infantry +10 vs elephants
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 6, 9, amountTypetoD(10, 5)));
	this->createTeamBonus(48, e, "Infantry +5 vs. elephants");

	// All explosive units +20% speed
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["explosive"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["explosive"][i], -1, 5, 1.2));
	}
	this->createTeamBonus(49, e, "Explosive units +20% speed");

	// All resources last 5% longer
	e.EffectCommands.clear();
	for (int i = 0; i < productivityRates.size(); i++) {
		e.EffectCommands.push_back(createEC(6, productivityRates[i], -1, -1, 1.05));
	}
	for (int i = 0; i < gatherRates.size(); i++) {
		e.EffectCommands.push_back(createEC(5, gatherRates[i], -1, 13, 0.95238));
	}
	this->createTeamBonus(50, e, "Resources last 5% longer");

	// Castles, Kreposts, Donjons work 10% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 82, -1, 13, 1.1));
	e.EffectCommands.push_back(createEC(5, 1251, -1, 13, 1.1));
	e.EffectCommands.push_back(createEC(5, -1, 52, 13, 1.1));
	this->createTeamBonus(51, e, "Stone production buildings work 10% faster");

	// Markets +80% work rate
	this->teamBonuses[52] = 804;

	// Steppe Lancers +3 LOS
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["steppe"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["steppe"][i], -1, 1, 3));
	}
	this->createTeamBonus(53, e, "Steppe Lancers +3 LOS");

	// Spearmen +3 vs cavalry
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["spear"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["spear"][i], -1, 9, amountTypetoD(3, 8)));
	}
	this->createTeamBonus(54, e, "Spearmen +3 vs. cavalry");

	// Elephants +4 vs buildings
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["elephant"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["elephant"][i], -1, 9, amountTypetoD(4, 21)));
	}
	this->createTeamBonus(55, e, "Elephants +4 vs. buildings");

	// Eagles +2 LOS
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["eagle"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["eagle"][i], -1, 1, 2));
	}
	this->createTeamBonus(56, e, "Eagles +2 LOS");

	// Docks +20% work rate
	e.EffectCommands.clear();
	for (int i = 0; i < docks.size(); i++) {
		e.EffectCommands.push_back(createEC(5, docks[i], -1, 13, 1.2));
	}
	this->createTeamBonus(57, e, "Docks +20% work rate");

	// Monasteries 3x HP
	e.EffectCommands.clear();
	for (int i = 0; i < monasteries.size(); i++) {
		e.EffectCommands.push_back(createEC(5, monasteries[i], -1, 0, 3));
	}
	this->createTeamBonus(58, e, "Monasteries 3x HP");

	// Markets 3x HP
	e.EffectCommands.clear();
	for (int i = 0; i < markets.size(); i++) {
		e.EffectCommands.push_back(createEC(5, markets[i], -1, 0, 3));
	}
	this->createTeamBonus(59, e, "Markets 3x HP");

	// Explosive units +6 LOS
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["explosive"].size(); i++) {
		e.EffectCommands.push_back(createEC(4, this->unitClasses["explosive"][i], -1, 1, 6));
	}
	this->createTeamBonus(60, e, "Explosive units +6 LOS");

	// Outposts and towers built quickly
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 598, -1, 101, 0.1));
	e.EffectCommands.push_back(createEC(5, -1, 52, 101, 0.66));
	this->createTeamBonus(61, e, "Outposts and towers built quickly");

	// Siege Towers +50% garrison capacity
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 1105, -1, 2, 1.5));
	this->createTeamBonus(62, e, "Siege towers +50% garrison capacity");

	// Docks built 100% faster
	e.EffectCommands.clear();
	for (int i = 0; i < docks.size(); i++) {
		e.EffectCommands.push_back(createEC(5, docks[i], -1, 101, 0.5));
	}
	this->createTeamBonus(63, e, "Docks built 100% faster");

	// Infantry +2 LOS
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 6, 1, 2));
	this->createTeamBonus(64, e, "Infantry +2 LOS");

	// Trade carts 20% faster when empty
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 128, -1, 5, 1.2));
	e.EffectCommands.push_back(createEC(5, 128, -1, 13, 1.2));
	this->createTeamBonus(65, e, "Trade 20% faster when empty");

	// Explosive units +40% HP
	e.EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["explosive"].size(); i++) {
		e.EffectCommands.push_back(createEC(5, this->unitClasses["explosive"][i], -1, 0, 1.4));
	}
	this->createTeamBonus(66, e, "Explosive units +40% HP");

	// Town Centers +4 LOS
	e.EffectCommands.clear();
	for (int i = 0; i < townCenters.size(); i++) {
		e.EffectCommands.push_back(createEC(4, townCenters[i], -1, 1, 4));
	}
	this->createTeamBonus(67, e, "Town Centers +4 LOS");

	// Unique Unit Elite Upgrade costs -20%
	e.EffectCommands.clear();
	this->createTeamBonus(68, e, "Elite costs -20%");

	// TC spearmen
	e.EffectCommands.clear();
	e.Name = "TC Spearman (make available)";
	e.EffectCommands.push_back(createEC(2, tcSpearman, 1, -1, 0));
	this->df->Effects.push_back(e);
	Tech t = this->df->Techs[113];
	t.Name = "Dupl. Feudal Age";
	t.RequiredTechs[0] = 101;
	this->df->Techs.push_back(t);

	t = this->df->Techs[522];
	t.Name = "TC Spearman (make available)";
	t.RequiredTechs[0] = (int) (df->Techs.size() - 1);
	t.RequiredTechs[1] = 87;
	t.RequiredTechCount = 2;
	t.EffectID = (df->Effects.size() - 1);
	this->df->Techs.push_back(t);

	e.EffectCommands.clear();
	e.Name = "Team Bonus, TC Spearman";
	e.EffectCommands.push_back(createEC(101, (int) (this->df->Techs.size() - 1), 0, 0, 0));
	e.EffectCommands.push_back(createEC(103, (int) (this->df->Techs.size() - 1), -1, 0, 0));
	this->df->Effects.push_back(e);
	this->teamBonuses[72] = (int) (this->df->Effects.size() - 1);

	// Canoes (stats need adjustment -- make it a trash boat)
	for (Civ &civ : this->df->Civs) {
		civ.Units[778].Creatable.ButtonID = 14;
		civ.Units[778].Creatable.TrainLocationID = 45;
	}

	e.EffectCommands.clear();
	e.Name = "Canoe (make available)";
	e.EffectCommands.push_back(createEC(2, 778, 1, -1, 0));
	this->df->Effects.push_back(e);
	t = this->df->Techs[113];
	t.Name = "Dupl.2 Feudal Age";
	t.RequiredTechs[0] = 101;
	this->df->Techs.push_back(t);

	t = this->df->Techs[522];
	t.Name = "Canoe (make available)";
	t.RequiredTechs[0] = (int) (this->df->Techs.size() - 1);
	t.EffectID = (this->df->Effects.size() - 1);
	this->df->Techs.push_back(t);

	e.EffectCommands.clear();
	e.Name = "Team Bonus, Canoe";
	e.EffectCommands.push_back(createEC(101, (int) (this->df->Techs.size() - 1), 0, 0, 0));
	e.EffectCommands.push_back(createEC(103, (int) (this->df->Techs.size() - 1), -1, 0, 0));
	this->df->Effects.push_back(e);
	this->teamBonuses[73] = (int) (this->df->Effects.size() - 1);

	// Scouts +1 attack vs. archers
	this->teamBonuses[37] = 802;

	// Dravidians TB
	this->teamBonuses[69] = 839;

	// Bengalis TB
	this->teamBonuses[70] = 841;

	// Gurjaras TB
	this->teamBonuses[71] = 843;

	// Georgians TB
	this->teamBonuses[74] = 928;

	// Mounted archers -50% frame delay
	e.EffectCommands.clear();
	e.Name = "Team Bonus, mounted archers -50% frame delay";
	e.EffectCommands.push_back(createEC(5, -1, 36, 41, 0.5));
	e.EffectCommands.push_back(createEC(5, -1, 23, 41, 0.5));
	this->df->Effects.push_back(e);
	this->teamBonuses[75] = (int) (this->df->Effects.size() - 1);
}

void
Civbuilder::reconfigureEffects() {
	// Give classes these bonuses so that they can be modified with effects
	giveClassNewBonus(this->df, 6, 10);
	giveUnitsNewBonus(this->df, this->unitClasses["steppe"], 10);
	giveClassNewBonus(this->df, 22, 10);
	giveUnitsNewBonus(this->df, this->unitClasses["skirmisher"], 1);
	giveUnitsNewBonus(this->df, this->unitClasses["footArcher"], 10);
	giveUnitsNewBonus(this->df, this->unitClasses["skirmisher"], 10);
	giveUnitsNewBonus(this->df, this->unitClasses["gunpowder"], 30);
	giveUnitsNewBonus(this->df, this->unitClasses["eagle"], 13);
	giveUnitsNewBonus(this->df, this->unitClasses["eagle"], 22);
	giveUnitsNewBonus(this->df, this->unitClasses["eagle"], 26);
	giveUnitsNewBonus(this->df, this->unitClasses["lightCav"], 13);
	giveUnitsNewBonus(this->df, this->unitClasses["lightCav"], 22);
	giveUnitsNewBonus(this->df, this->unitClasses["lightCav"], 26);
	giveUnitsNewBonus(this->df, {82, 1251}, 11);
	giveUnitsNewBonus(this->df, {236}, 17);
	giveClassNewBonus(this->df, 52, 8);
	giveUnitsNewBonus(this->df, this->unitClasses["lightCav"], 23);
	giveClassNewBonus(this->df, 6, 5);
	giveUnitsNewBonus(this->df, this->unitClasses["unique"], 32);
	giveUnitsNewBonus(this->df, this->unitClasses["unique"], 1);
	giveUnitsNewBonus(this->df, siegeTowers, 8);
	giveUnitsNewBonus(this->df, this->unitClasses["unique"], 19);
	giveClassNewBonus(this->df, 52, 19);
	giveClassNewBonus(this->df, 36, 19);

	// Recompile units list
	vector<int> barracksUnits = {};
	for (int i = 0; i < this->df->Civs[0].Units.size(); i++) {
		if (this->df->Civs[0].Units[i].Creatable.TrainLocationID == 12) {
			barracksUnits.push_back(i);
		}
	}

	vector<int> stableUnits = {};
	for (int i = 0; i < this->df->Civs[0].Units.size(); i++) {
		if (this->df->Civs[0].Units[i].Creatable.TrainLocationID == 101) {
			stableUnits.push_back(i);
		}
	}

	vector<int> rangeUnits = {};
	for (int i = 0; i < this->df->Civs[0].Units.size(); i++) {
		if (this->df->Civs[0].Units[i].Creatable.TrainLocationID == 87) {
			rangeUnits.push_back(i);
		}
	}

	vector<int> workshopUnits = {};
	for (int i = 0; i < this->df->Civs[0].Units.size(); i++) {
		if (this->df->Civs[0].Units[i].Creatable.TrainLocationID == 49) {
			workshopUnits.push_back(i);
		}
	}

	// Recreate barracks bonuses
	this->df->Effects[333].EffectCommands.clear();
	this->df->Effects[334].EffectCommands.clear();
	this->df->Effects[618].EffectCommands.clear();
	this->df->Effects[619].EffectCommands.clear();
	this->df->Effects[620].EffectCommands.clear();
	for (int i = 0; i < barracksUnits.size(); i++) {
		// Teuton armor bonus (barracks)
		this->df->Effects[333].EffectCommands.push_back(createEC(4, barracksUnits[i], -1, 8, amountTypetoD(1, 4)));
		this->df->Effects[334].EffectCommands.push_back(createEC(4, barracksUnits[i], -1, 8, amountTypetoD(1, 4)));
		// Malian pierce armor
		this->df->Effects[618].EffectCommands.push_back(createEC(4, barracksUnits[i], -1, 8, amountTypetoD(1, 3)));
		this->df->Effects[619].EffectCommands.push_back(createEC(4, barracksUnits[i], -1, 8, amountTypetoD(1, 3)));
		this->df->Effects[620].EffectCommands.push_back(createEC(4, barracksUnits[i], -1, 8, amountTypetoD(1, 3)));
	}

	// Recreate stable bonuses
	this->df->Effects[610].EffectCommands.clear();
	this->df->Effects[638].EffectCommands.clear();
	for (int i = 0; i < stableUnits.size(); i++) {
		// Teuton armor bonus (stable)
		this->df->Effects[333].EffectCommands.push_back(createEC(4, stableUnits[i], -1, 8, amountTypetoD(1, 4)));
		this->df->Effects[334].EffectCommands.push_back(createEC(4, stableUnits[i], -1, 8, amountTypetoD(1, 4)));
		// Old Indian pierce armor
		this->df->Effects[640].EffectCommands.push_back(createEC(4, stableUnits[i], -1, 8, amountTypetoD(1, 3)));
		this->df->Effects[584].EffectCommands.push_back(createEC(4, stableUnits[i], -1, 8, amountTypetoD(1, 3)));
		// Berber discount
		this->df->Effects[610].EffectCommands.push_back(createEC(5, stableUnits[i], -1, 100, 0.85));
		this->df->Effects[638].EffectCommands.push_back(createEC(5, stableUnits[i], -1, 100, 0.941176));
	}

	// Recreate archery range bonuses
	this->df->Effects[672].EffectCommands.clear();
	for (int i = 0; i < rangeUnits.size(); i++) {
		// Vietnamese HP
		this->df->Effects[672].EffectCommands.push_back(createEC(5, rangeUnits[i], -1, 0, 1.2));
	}

	// Recreate siege workshop bonuses
	this->df->Effects[567].EffectCommands.clear();
	for (int i = 0; i < workshopUnits.size(); i++) {
		// Slav discount
		this->df->Effects[567].EffectCommands.push_back(createEC(5, workshopUnits[i], -1, 100, 0.85));
		// Furor celtica
		this->df->Effects[239].EffectCommands.push_back(createEC(5, workshopUnits[i], -1, 0, 1.4));
		// Drill
		this->df->Effects[457].EffectCommands.push_back(createEC(5, workshopUnits[i], -1, 5, 1.5));
	}

	// Ahosi attack
	this->df->Effects[67].EffectCommands.push_back(createEC(4, this->ahosiID, -1, 9, amountTypetoD(1, 3)));
	this->df->Effects[68].EffectCommands.push_back(createEC(4, this->ahosiID, -1, 9, amountTypetoD(1, 3)));
	this->df->Effects[75].EffectCommands.push_back(createEC(4, this->ahosiID, -1, 9, amountTypetoD(1, 3)));
	this->df->Effects[67].EffectCommands.push_back(createEC(4, this->ehosiID, -1, 9, amountTypetoD(1, 3)));
	this->df->Effects[68].EffectCommands.push_back(createEC(4, this->ehosiID, -1, 9, amountTypetoD(1, 3)));
	this->df->Effects[75].EffectCommands.push_back(createEC(4, this->ehosiID, -1, 9, amountTypetoD(1, 3)));

	// Cavalry regen
	int hpID = -1;
	int camelID = -1;
	int zealotryID = -1;
	for (int i = 0; i < this->df->Effects.size(); i++) {
		if (this->df->Effects[i].Name == "Cavalry +20% HP + regen") {
			hpID = i;
		} else if (this->df->Effects[i].Name == "Camels +25% HP + regen") {
			camelID = i;
		} else if (this->df->Effects[i].Name == "Zealotry + regen") {
			zealotryID = i;
		}
	}
	this->df->Effects[954].EffectCommands.clear();
	this->df->Effects[961].EffectCommands.clear();
	this->df->Effects[hpID].EffectCommands.clear();
	this->df->Effects[camelID].EffectCommands.clear();
	for (int i = 0; i < this->df->Civs[0].Units.size(); i++) {
		if (this->df->Civs[0].Units[i].Class == 12 || this->df->Civs[0].Units[i].Class == 47) {
			this->df->Effects[954].EffectCommands.push_back(createEC(4, i, -1, 109, this->df->Civs[0].Units[i].HitPoints * 0.15));
			this->df->Effects[961].EffectCommands.push_back(createEC(4, i, -1, 109, 3));
			this->df->Effects[hpID].EffectCommands.push_back(createEC(4, i, -1, 109, this->df->Civs[0].Units[i].HitPoints * 0.15 * 0.2));
		}
	}
	for (int i = 0; i < this->unitClasses["camel"].size(); i++) {
		this->df->Effects[camelID].EffectCommands.push_back(
			createEC(4, this->unitClasses["camel"][i], -1, 109, this->df->Civs[0].Units[this->unitClasses["camel"][i]].HitPoints * 0.15 * 0.25));
		this->df->Effects[zealotryID].EffectCommands.push_back(createEC(4, this->unitClasses["camel"][i], -1, 109, 3));
	}

	// Byz trash affect imp camel
	this->df->Effects[283].EffectCommands.push_back(createEC(5, 207, -1, 100, 0.75));

	// Camel bonuses to all camels
	this->df->Effects[312].EffectCommands.clear();
	this->df->Effects[459].EffectCommands.clear();
	this->df->Effects[608].EffectCommands.clear();
	this->df->Effects[843].EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["camel"].size(); i++) {
		// Saracen HP
		this->df->Effects[312].EffectCommands.push_back(createEC(5, this->unitClasses["camel"][i], -1, 0, 1.25));
		// Zealotry
		this->df->Effects[459].EffectCommands.push_back(createEC(4, this->unitClasses["camel"][i], -1, 0, 20));
		// Maghrabi
		this->df->Effects[608].EffectCommands.push_back(createEC(4, this->unitClasses["camel"][i], -1, 109, 15));
		// Gurjaras team bonus (camels)
		this->df->Effects[843].EffectCommands.push_back(createEC(5, this->unitClasses["camel"][i], -1, 101, 0.8));
	}

	// Make zealotry work again
	this->df->Techs[9].RequiredTechs[0] = 102;

	// Gunpowder bonuses to all gunpowder
	this->df->Effects[296].EffectCommands.clear();
	this->df->Effects[555].EffectCommands.clear();
	this->df->Effects[794].EffectCommands.clear();
	this->df->Effects[576].EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["gunpowder"].size(); i++) {
		// Turk HP
		this->df->Effects[296].EffectCommands.push_back(createEC(5, this->unitClasses["gunpowder"][i], -1, 0, 1.25));
		// Italians discount
		this->df->Effects[555].EffectCommands.push_back(createEC(5, this->unitClasses["gunpowder"][i], -1, 100, 0.8));
		// Burgundian +attack
		for (int j = 0; j < 50; j++) {
			this->df->Effects[794].EffectCommands.push_back(createEC(5, this->unitClasses["gunpowder"][i], -1, 9, amountTypetoD(125, j)));
		}
		// Hindustani armor
		this->df->Effects[576].EffectCommands.push_back(createEC(4, this->unitClasses["gunpowder"][i], -1, 8, amountTypetoD(1, 3)));
		this->df->Effects[576].EffectCommands.push_back(createEC(4, this->unitClasses["gunpowder"][i], -1, 8, amountTypetoD(1, 4)));
	}

	// Shatagni affects all hand cannons
	this->df->Effects[563].EffectCommands.clear();
	this->df->Effects[563].EffectCommands.push_back(createEC(4, -1, 44, 1, 2));
	this->df->Effects[563].EffectCommands.push_back(createEC(4, -1, 44, 23, 2));
	this->df->Effects[563].EffectCommands.push_back(createEC(4, -1, 44, 12, 2));

	// Japanese discount affects mule carts and folwarks
	this->df->Effects[338].EffectCommands.push_back(createEC(5, 1711, -1, 100, 0.5));
	this->df->Effects[338].EffectCommands.push_back(createEC(5, 1720, -1, 100, 0.5));
	this->df->Effects[338].EffectCommands.push_back(createEC(5, 1734, -1, 100, 0.5));
	this->df->Effects[338].EffectCommands.push_back(createEC(5, 1808, -1, 100, 0.5));

	// Elephant bonuses to all elephants
	this->df->Effects[668].EffectCommands.clear();
	this->df->Effects[666].EffectCommands.clear();
	this->df->Effects[703].EffectCommands.clear();
	this->df->Effects[662].EffectCommands.clear();
	this->df->Effects[695].EffectCommands.clear();
	this->df->Effects[696].EffectCommands.clear();
	this->df->Effects[865].EffectCommands.clear();
	this->df->Effects[850].EffectCommands.clear();
	this->df->Effects[852].EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["elephant"].size(); i++) {
		// Chatras
		this->df->Effects[668].EffectCommands.push_back(createEC(4, this->unitClasses["elephant"][i], -1, 0, 100));
		// Howdah
		this->df->Effects[666].EffectCommands.push_back(createEC(4, this->unitClasses["elephant"][i], -1, 8, amountTypetoD(1, 3)));
		this->df->Effects[666].EffectCommands.push_back(createEC(4, this->unitClasses["elephant"][i], -1, 8, amountTypetoD(1, 4)));
		if (this->df->Civs[0].Units[this->unitClasses["elephant"][i]].Type50.MaxRange > 0) {
			// Khmer speed
			this->df->Effects[703].EffectCommands.push_back(createEC(5, this->unitClasses["elephant"][i], -1, 5, 1.1));
			// Tusk swords
			this->df->Effects[662].EffectCommands.push_back(createEC(4, this->unitClasses["elephant"][i], -1, 9, amountTypetoD(3, 4)));
		}
		// Malay discount
		this->df->Effects[695].EffectCommands.push_back(createEC(5, this->unitClasses["elephant"][i], -1, 100, 0.7));
		this->df->Effects[696].EffectCommands.push_back(createEC(5, this->unitClasses["elephant"][i], -1, 100, 0.85714));
		// Bengali resistance
		this->df->Effects[865].EffectCommands.push_back(createEC(0, this->unitClasses["elephant"][i], -1, 24, 0.25));
		this->df->Effects[865].EffectCommands.push_back(createEC(4, this->unitClasses["elephant"][i], -1, 111, 1));
		this->df->Effects[865].EffectCommands.push_back(createEC(4, this->unitClasses["elephant"][i], -1, 112, 2));
		// Medical Corps
		this->df->Effects[850].EffectCommands.push_back(createEC(4, this->unitClasses["elephant"][i], -1, 109, 30));
		// Gurjaras team bonus (elephants)
		this->df->Effects[843].EffectCommands.push_back(createEC(5, this->unitClasses["elephant"][i], -1, 101, 0.8));
		// Paiks
		this->df->Effects[852].EffectCommands.push_back(createEC(5, this->unitClasses["elephant"][i], -1, 10, 0.8333333));
	}

	// Battle elephants +1/+1p affects royal
	this->df->Effects[679].EffectCommands.push_back(createEC(4, royalElephant, -1, 8, amountTypetoD(1, 3)));
	this->df->Effects[679].EffectCommands.push_back(createEC(4, royalElephant, -1, 8, amountTypetoD(1, 4)));

	// Foot archer bonuses
	this->df->Effects[612].EffectCommands.clear();
	this->df->Effects[380].EffectCommands.clear();
	this->df->Effects[415].EffectCommands.clear();
	this->df->Effects[455].EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["footArcher"].size(); i++) {
		// Ethiopian reload
		this->df->Effects[612].EffectCommands.push_back(createEC(5, this->unitClasses["footArcher"][i], -1, 10, 0.85));
		// British range
		this->df->Effects[380].EffectCommands.push_back(createEC(4, this->unitClasses["footArcher"][i], -1, 12, 1));
		this->df->Effects[380].EffectCommands.push_back(createEC(4, this->unitClasses["footArcher"][i], -1, 1, 1));
		this->df->Effects[380].EffectCommands.push_back(createEC(4, this->unitClasses["footArcher"][i], -1, 23, 1));
		this->df->Effects[415].EffectCommands.push_back(createEC(4, this->unitClasses["footArcher"][i], -1, 12, 1));
		this->df->Effects[415].EffectCommands.push_back(createEC(4, this->unitClasses["footArcher"][i], -1, 1, 1));
		this->df->Effects[415].EffectCommands.push_back(createEC(4, this->unitClasses["footArcher"][i], -1, 23, 1));
		// Yeomen (foot archers)
		this->df->Effects[455].EffectCommands.push_back(createEC(4, this->unitClasses["footArcher"][i], -1, 12, 1));
		this->df->Effects[455].EffectCommands.push_back(createEC(4, this->unitClasses["footArcher"][i], -1, 1, 1));
		this->df->Effects[455].EffectCommands.push_back(createEC(4, this->unitClasses["footArcher"][i], -1, 23, 1));
	}

	// Yeomen (towers)
	this->df->Effects[455].EffectCommands.push_back(createEC(4, 505, -1, 9, amountTypetoD(2, 3)));
	this->df->Effects[455].EffectCommands.push_back(createEC(4, 518, -1, 9, amountTypetoD(2, 3)));
	this->df->Effects[455].EffectCommands.push_back(createEC(4, -1, 52, 9, amountTypetoD(2, 3)));

	// Yeomen (skirmishers)
	for (int i = 0; i < this->unitClasses["skirmisher"].size(); i++) {
		this->df->Effects[455].EffectCommands.push_back(createEC(4, this->unitClasses["skirmisher"][i], -1, 12, 1));
		this->df->Effects[455].EffectCommands.push_back(createEC(4, this->unitClasses["skirmisher"][i], -1, 1, 1));
		this->df->Effects[455].EffectCommands.push_back(createEC(4, this->unitClasses["skirmisher"][i], -1, 23, 1));
	}

	// Steppe lancer effects
	this->df->Effects[387].EffectCommands.push_back(createEC(5, royalLancer, -1, 0, 1.3));
	this->df->Effects[724].EffectCommands.push_back(createEC(4, royalLancer, -1, 8, amountTypetoD(1, 3)));
	this->df->Effects[724].EffectCommands.push_back(createEC(4, royalLancer, -1, 8, amountTypetoD(1, 4)));
	this->df->Effects[726].EffectCommands.push_back(createEC(5, royalLancer, -1, 101, 0.5));

	// Make scorpion effects apply to imp scorp
	this->df->Effects[647].EffectCommands.push_back(createEC(4, impScorpion, -1, 1, 1));
	this->df->Effects[647].EffectCommands.push_back(createEC(4, impScorpion, -1, 12, 1));
	this->df->Effects[647].EffectCommands.push_back(createEC(4, impScorpion, -1, 23, 1));
	this->df->Effects[663].EffectCommands.push_back(createEC(4, impScorpion, -1, 102, 1));
	this->df->Effects[663].EffectCommands.push_back(createEC(4, impScorpion, -1, 107, 1));
	this->df->Effects[900].EffectCommands.push_back(createEC(5, impScorpion, -1, 105, 0.4));
	this->df->Effects[901].EffectCommands.push_back(createEC(0, impScorpionProjectile, -1, 19, 1));
	this->df->Effects[901].EffectCommands.push_back(createEC(0, impScorpionProjectileFire, -1, 19, 1));
	this->df->Effects[483].EffectCommands.clear();
	this->df->Effects[483].EffectCommands.push_back(createEC(4, 279, -1, 9, amountTypetoD(4, 3)));
	this->df->Effects[483].EffectCommands.push_back(createEC(4, 542, -1, 9, amountTypetoD(4, 3)));
	this->df->Effects[483].EffectCommands.push_back(createEC(4, impScorpion, -1, 9, amountTypetoD(4, 3)));
	this->df->Effects[483].EffectCommands.push_back(createEC(4, 1120, -1, 9, amountTypetoD(2, 3)));
	this->df->Effects[483].EffectCommands.push_back(createEC(4, 1122, -1, 9, amountTypetoD(2, 3)));
	this->df->Effects[894].EffectCommands.push_back(createEC(5, impScorpion, -1, 10, 0.75));
	this->df->Effects[891].EffectCommands.push_back(createEC(0, impScorpion, -1, 20, 1));

	// Make monk techs affect monk units
	this->df->Techs[490].RequiredTechs[0] = 102;
	for (Civ &civ : this->df->Civs) {
		civ.Units[134].ResourceStorages[1].Type = 3;
		civ.Units[134].ResourceStorages[1].Amount = 0;
		civ.Units[134].ResourceStorages[1].Flag = 1;
		civ.Units[776].ResourceStorages[1].Type = 3;
		civ.Units[776].ResourceStorages[1].Amount = 0;
		civ.Units[776].ResourceStorages[1].Flag = 1;
	}
	this->df->Effects[545].EffectCommands.clear();
	this->df->Effects[545].EffectCommands.push_back(createEC(4, 134, -1, 26, 50));
	this->df->Effects[545].EffectCommands.push_back(createEC(4, 776, -1, 26, 50));
	this->df->Effects[28].EffectCommands.clear();
	this->df->Effects[28].EffectCommands.push_back(createEC(0, 125, -1, 63, 32));
	this->df->Effects[28].EffectCommands.push_back(createEC(0, 286, -1, 63, 32));
	this->df->Effects[28].EffectCommands.push_back(createEC(0, 1811, -1, 63, 32));
	this->df->Effects[28].EffectCommands.push_back(createEC(0, 1831, -1, 63, 32));
	this->df->Effects[28].EffectCommands.push_back(createEC(0, 775, -1, 63, 32));
	for (Civ &civ : this->df->Civs) {
		for (int i = 0; i < civ.Units[125].Bird.TaskList.size(); i++) {
			if (civ.Units[125].Bird.TaskList[i].ActionType == 155) {
				civ.Units[1811].Bird.TaskList.push_back(civ.Units[125].Bird.TaskList[i]);
				civ.Units[1831].Bird.TaskList.push_back(civ.Units[125].Bird.TaskList[i]);
				civ.Units[775].Bird.TaskList.push_back(civ.Units[125].Bird.TaskList[i]);
			}
		}
	}
	this->df->Effects[853].EffectCommands.push_back(createEC(0, 1811, -1, 110, -0.9));

	// Orthodoxy requires Castle Age
	this->df->Techs[512].RequiredTechs[0] = 102;

	// Pavise apply to archer-line and condottiero
	this->df->Effects[549].EffectCommands.clear();
	vector<int> customUnitClass = {4, 24, 492, 882};
	for (int i = 0; i < customUnitClass.size(); i++) {
		this->df->Effects[549].EffectCommands.push_back(createEC(4, customUnitClass[i], -1, 8, amountTypetoD(1, 3)));
		this->df->Effects[549].EffectCommands.push_back(createEC(4, customUnitClass[i], -1, 8, amountTypetoD(1, 4)));
	}

	// Fabric shields applies to eagles and slingers
	this->df->Effects[573].EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["eagle"].size(); i++) {
		this->df->Effects[573].EffectCommands.push_back(createEC(4, this->unitClasses["eagle"][i], -1, 8, amountTypetoD(2, 3)));
		this->df->Effects[573].EffectCommands.push_back(createEC(4, this->unitClasses["eagle"][i], -1, 8, amountTypetoD(1, 4)));
	}
	this->df->Effects[573].EffectCommands.push_back(createEC(4, 185, -1, 8, amountTypetoD(2, 3)));
	this->df->Effects[573].EffectCommands.push_back(createEC(4, 185, -1, 8, amountTypetoD(1, 4)));

	// Make effects that apply to one unique unit apply to all unique units
	this->df->Effects[493].EffectCommands.clear();
	this->df->Effects[571].EffectCommands.clear();
	for (int i = 0; i < this->unitClasses["unique"].size(); i++) {
		// Pavise
		this->df->Effects[549].EffectCommands.push_back(createEC(4, this->unitClasses["unique"][i], -1, 8, amountTypetoD(1, 3)));
		this->df->Effects[549].EffectCommands.push_back(createEC(4, this->unitClasses["unique"][i], -1, 8, amountTypetoD(1, 4)));
		// Logistica
		this->df->Effects[493].EffectCommands.push_back(createEC(4, this->unitClasses["unique"][i], -1, 9, amountTypetoD(6, 1)));
		this->df->Effects[493].EffectCommands.push_back(createEC(4, this->unitClasses["unique"][i], -1, 22, 0.5));
		this->df->Effects[493].EffectCommands.push_back(createEC(0, this->unitClasses["unique"][i], -1, 9, amountTypetoD(10, 32)));
		this->df->Effects[493].EffectCommands.push_back(createEC(0, this->unitClasses["unique"][i], -1, 44, 2));
		this->df->Effects[493].EffectCommands.push_back(createEC(0, this->unitClasses["unique"][i], -1, 115, -5));
		// Fabric Shields
		this->df->Effects[573].EffectCommands.push_back(createEC(4, this->unitClasses["unique"][i], -1, 8, amountTypetoD(2, 3)));
		this->df->Effects[573].EffectCommands.push_back(createEC(4, this->unitClasses["unique"][i], -1, 8, amountTypetoD(1, 4)));
		// Corvinian Army
		int goldCost = 0;
		int trashType = -1;
		for (int j = 0; j < this->df->Civs[0].Units[this->unitClasses["unique"][i]].Creatable.ResourceCosts.size(); j++) {
			auto &uniqueUnit = this->df->Civs[0].Units[this->unitClasses["unique"][i]].Creatable;
			if (uniqueUnit.ResourceCosts[j].Type == 3) {
				// Find out how much gold this unit costs
				goldCost = uniqueUnit.ResourceCosts[j].Amount;
			} else if (uniqueUnit.ResourceCosts[j].Type == 0) {
				// This unit costs food
				trashType = 103;
			} else if (uniqueUnit.ResourceCosts[j].Type == 1) {
				// This unit costs wood
				trashType = 104;
			}
		}
		if (trashType == -1) {
			// If only cost gold (i.e. warrior monk or headhunter), convert to food cost
			trashType = 103;
		}
		// Make it cost no gold
		this->df->Effects[571].EffectCommands.push_back(createEC(0, this->unitClasses["unique"][i], -1, 105, 0));
		// Add the previous gold cost to whatever trash costs it has
		this->df->Effects[571].EffectCommands.push_back(createEC(4, this->unitClasses["unique"][i], -1, trashType, goldCost));

		// Paiks
		this->df->Effects[852].EffectCommands.push_back(createEC(5, this->unitClasses["unique"][i], -1, 10, 0.833333));
	}
	// Rocketry
	addAttacktoUnits(this->df, 483, 2, this->unitClasses["unique"]);
	// Royal Heirs
	customUnitClass = this->unitClasses["camel"];
	for (int i = 0; i < this->unitClasses["unique"].size(); i++) {
		if (find(this->unitClasses["camel"].begin(), this->unitClasses["camel"].end(), this->unitClasses["unique"][i]) == this->unitClasses["camel"].end()) {
			customUnitClass.push_back(this->unitClasses["unique"][i]);
		}
	}
	giveClassNewArmor(this->df, customUnitClass, 39, -3);
	this->df->Effects[603].EffectCommands.clear();
	for (int i = 0; i < customUnitClass.size(); i++) {
		this->df->Effects[603].EffectCommands.push_back(createEC(4, customUnitClass[i], -1, 8, amountTypetoD(3, 39)));
	}
	// Bearded Axe
	this->df->Effects[291].EffectCommands.clear();
	addAttacktoUnits(this->df, 291, 2, this->unitClasses["unique"]);
	// Relic Bonus
	customUnitClass = {38, 283, 569};
	customUnitClass.insert(customUnitClass.begin(), this->unitClasses["unique"].begin(), this->unitClasses["unique"].end());
	this->df->Effects[736].EffectCommands.clear();
	this->df->Effects[737].EffectCommands.clear();
	this->df->Effects[738].EffectCommands.clear();
	this->df->Effects[739].EffectCommands.clear();
	addAttacktoUnits(this->df, 736, 1, customUnitClass);
	addAttacktoUnits(this->df, 737, 1, customUnitClass);
	addAttacktoUnits(this->df, 738, 1, customUnitClass);
	addAttacktoUnits(this->df, 739, 1, customUnitClass);
	// Comitatenses
	customUnitClass = {38, 283, 569, 74, 75, 77, 473, 567, 1793};
	customUnitClass.insert(customUnitClass.begin(), this->unitClasses["unique"].begin(), this->unitClasses["unique"].end());
	this->df->Effects[895].EffectCommands.clear();
	for (int i = 0; i < customUnitClass.size(); i++) {
		this->df->Effects[895].EffectCommands.push_back(createEC(5, customUnitClass[i], -1, 101, 0.666666667));
		this->df->Effects[895].EffectCommands.push_back(createEC(4, customUnitClass[i], -1, 59, 5));
		this->df->Effects[895].EffectCommands.push_back(createEC(4, customUnitClass[i], -1, 60, 0.25));
		if (this->df->Civs[0].Units[customUnitClass[i]].Creatable.ChargeType == 0) {
			// If they don't already have a charge attack, create one
			this->df->Effects[895].EffectCommands.push_back(createEC(0, customUnitClass[i], -1, 61, 1));
			this->df->Effects[895].EffectCommands.push_back(createEC(0, customUnitClass[i], -1, 62, 1));
		}
	}

	// Bogsveigar applies to all unique ships
	customUnitClass = this->unitClasses["footArcher"];
	customUnitClass.insert(customUnitClass.begin(), this->unitClasses["uniqueShip"].begin(), this->unitClasses["uniqueShip"].end());
	this->df->Effects[467].EffectCommands.clear();
	addAttacktoUnits(this->df, 467, 1, customUnitClass);

	// Detinets affects Kreposts and Donjons
	this->df->Effects[481].EffectCommands.push_back(createEC(4, 1251, -1, 104, 140));
	this->df->Effects[481].EffectCommands.push_back(createEC(4, 1251, -1, 106, -140));
	this->df->Effects[481].EffectCommands.push_back(createEC(4, 1665, -1, 104, 70));
	this->df->Effects[481].EffectCommands.push_back(createEC(4, 1665, -1, 106, -70));

	// Great Wall affects Donjons
	this->df->Effects[516].EffectCommands.push_back(createEC(5, 1665, -1, 0, 1.3));

	// Svan Towers and Citadels affects Kreposts
	this->df->Effects[935].EffectCommands.push_back(createEC(4, 1251, -1, 9, amountTypetoD(2, 3)));
	this->df->Effects[935].EffectCommands.push_back(createEC(4, 786, -1, 9, amountTypetoD(2, 3)));
	this->df->Effects[935].EffectCommands.push_back(createEC(4, 787, -1, 9, amountTypetoD(2, 3)));
	this->df->Effects[458].EffectCommands.push_back(createEC(4, 1251, -1, 9, amountTypetoD(4, 3)));
	this->df->Effects[458].EffectCommands.push_back(createEC(4, 1251, -1, 9, amountTypetoD(3, 1)));
	this->df->Effects[458].EffectCommands.push_back(createEC(4, 1251, -1, 9, amountTypetoD(3, 17)));
	this->df->Effects[458].EffectCommands.push_back(createEC(4, 786, -1, 9, amountTypetoD(4, 3)));
	this->df->Effects[458].EffectCommands.push_back(createEC(4, 787, -1, 9, amountTypetoD(4, 3)));
	this->df->Effects[458].EffectCommands.push_back(createEC(0, 1251, -1, 24, 0.25));
	this->df->Effects[458].EffectCommands.push_back(createEC(3, 786, 1830, -1, 0));
	this->df->Effects[593].EffectCommands.push_back(createEC(3, 786, 1830, -1, 0));
	this->df->Effects[593].EffectCommands.push_back(createEC(3, 787, 1830, -1, 0));

	// Eupsong affects donjons
	this->df->Effects[541].EffectCommands.push_back(createEC(4, 1665, -1, 12, 2));
	this->df->Effects[541].EffectCommands.push_back(createEC(4, 1665, -1, 1, 2));
	this->df->Effects[541].EffectCommands.push_back(createEC(4, 1665, -1, 23, 2));

	// Mounted affects missionaries
	this->df->Effects[285].EffectCommands.push_back(createEC(5, 775, -1, 0, 1.2));
	this->df->Effects[748].EffectCommands.push_back(createEC(5, 775, -1, 5, 1.05));
	this->df->Effects[762].EffectCommands.push_back(createEC(5, 775, -1, 5, 1.05));
	this->df->Effects[763].EffectCommands.push_back(createEC(5, 775, -1, 5, 1.05));
	this->df->Effects[936].EffectCommands.push_back(createEC(0, 775, -1, 110, -0.85));

	// Make Kamandaran and Forced Levy not give gold
	this->df->Effects[543].EffectCommands[0].Type = 0;
	this->df->Effects[543].EffectCommands[0].D = 0;
	this->df->Effects[543].EffectCommands[1].Type = 0;
	this->df->Effects[543].EffectCommands[1].D = 0;
	this->df->Effects[543].EffectCommands[2].Type = 0;
	this->df->Effects[543].EffectCommands[2].D = 0;
	this->df->Effects[665].EffectCommands[0].Type = 0;
	this->df->Effects[665].EffectCommands[0].D = 0;
	this->df->Effects[665].EffectCommands[1].Type = 0;
	this->df->Effects[665].EffectCommands[1].D = 0;
	this->df->Effects[665].EffectCommands[2].Type = 0;
	this->df->Effects[665].EffectCommands[2].D = 0;
	this->df->Effects[665].EffectCommands[3].Type = 0;
	this->df->Effects[665].EffectCommands[3].D = 0;
	this->df->Effects[665].EffectCommands[4].Type = 0;
	this->df->Effects[665].EffectCommands[4].D = 0;

	// Grand Trunk Road applies to ALL gold generation techniques
	this->df->Effects[562].EffectCommands.push_back(createEC(6, 241, -1, -1, 1.1));
	this->df->Effects[562].EffectCommands.push_back(createEC(6, 266, -1, -1, 1.1));
	this->df->Effects[562].EffectCommands.push_back(createEC(6, 236, -1, -1, 1.1));
	this->df->Effects[562].EffectCommands.push_back(createEC(6, 213, -1, -1, 1.1));
	this->df->Effects[562].EffectCommands.push_back(createEC(6, 274, -1, -1, 1.1));

	// Stronghold applies to Donjons & Kreposts
	this->df->Effects[537].EffectCommands.clear();
	this->df->Effects[537].EffectCommands.push_back(createEC(5, -1, 52, 10, 0.75));
	this->df->Effects[537].EffectCommands.push_back(createEC(5, 82, -1, 10, 0.75));
	this->df->Effects[537].EffectCommands.push_back(createEC(5, 1251, -1, 10, 0.75));
	this->df->Effects[537].EffectCommands.push_back(createEC(0, 82, -1, 63, 34));
	this->df->Effects[537].EffectCommands.push_back(createEC(0, 1251, -1, 63, 34));

	// Siege tower attack + chemistry
	// Siege tower attack + murder holes
	// Siege tower attack + svan towers
	// Siege tower attack + bonus damage vs cav
	// Siege tower attack + stronghold

	// This has to happen after effects are reconfigured because it uses effects directly
	this->assignTeamBonuses();
}

void
Civbuilder::cleanup() {
	applyModifiers(this->df, this->config["modifiers"]["blind"].asBool(), this->config["modifiers"]["building"].asDouble(),
				   this->config["modifiers"]["speed"].asDouble(), this->config["modifiers"]["hp"].asDouble());

	// Apply random costs modifier
	bool randomCosts = this->config["modifiers"]["randomCosts"].asBool();
	if (randomCosts) {
		unitSets[40].push_back(royalElephant);
		unitSets[41].push_back(royalLancer);
		unitSets[44].push_back(impScorpion);
		uniqueUnits = this->unitClasses["unique"];
		randomizeCosts(this->df);
	}

	// Give effects that apply to a unique unit to their copies
	this->duplicateUnitEffects();

	// Recalculate tech discounts
	recalculateTechDiscounts(this->df);

	// Multiply effects for repeated bonuses
	multiplyAllEffects(this->df, this->multipliedEffects);

	// Gives all units their original ID (which were changed from copying between entries)
	for (Civ &civ : this->df->Civs) {
		for (int i = 0; i < civ.Units.size(); i++) {
			civ.Units[i].ID = i;
			civ.Units[i].CopyID = i;
			civ.Units[i].BaseID = i;
			civ.Units[i].TelemetryID = i;
		}
	}
}

void
Civbuilder::assignUniqueUnits() {
	for (int i = 0; i < this->config["techtree"].size(); i++) {
		int uniqueUnit = this->config["techtree"][i][0].asInt();
		// Make unique unit available
		allocateTech(this->df, this->uuTechIDs[uniqueUnit].first, i + 1);
		// Give them elite upgrade
		allocateTech(this->df, this->uuTechIDs[uniqueUnit].second, i + 1);
	}
}

void
Civbuilder::assignBasicTechs() {
	for (int i = 0; i < this->config["techtree"].size(); i++) {
		for (int j = 0; j < this->config["techtree"][i].size(); j++) {
			if (this->config["techtree"][i][j] == 0) {
				// Disable tech
				if (basicTechs[j] != -1) {
					ai["civs"][i]["tt"].append(basicTechs[j]);
					this->df->Effects[techTreeIDs[i]].EffectCommands.push_back(createEC(102, -1, -1, -1, basicTechs[j]));
				}
			}
		}

		// Default: scout start
		this->df->Civs[i + 1].Resources[263] = 448;
		// Eagle start
		for (int j = 0; j < this->config["techtree"][i].size(); j++) {
			if (this->config["techtree"][i][j] == 1 && j == 12) {
				this->df->Civs[i + 1].Resources[263] = 751;
				j = this->config["techtree"][i].size();
			}
		}
		// Camel start
		for (int j = 0; j < this->config["civ_bonus"][i].size(); j++) {
			if (this->config["civ_bonus"][i][j] == 300) {
				this->df->Civs[i + 1].Resources[263] = 1755;
				j = this->config["civ_bonus"][i].size();
			}
		}
	}
}

void
Civbuilder::assignUniqueTechs() {
	// Castle age unique techs
	for (int i = 0; i < this->config["castletech"].size(); i++) {
		int uniqueIndex = this->config["techtree"][i][0].asInt();
		int uniqueUnit = this->df->Effects[this->df->Techs[this->uuTechIDs[uniqueIndex].first].EffectID].EffectCommands[0].A;
		int uniqueElite = this->df->Effects[this->df->Techs[this->uuTechIDs[uniqueIndex].second].EffectID].EffectCommands[0].B;

		for (int j = 0; j < this->config["castletech"][i].size(); j++) {
			int castleIndex = -1;
			int castleCopies = -1;
			try {
				castleIndex = this->config["castletech"][i][j].asInt();
				castleCopies = 1;
			} catch (...) {
				castleIndex = this->config["castletech"][i][j][0].asInt();
				castleCopies = this->config["castletech"][i][j][1].asInt();
			}

			Tech &castleTech = this->df->Techs[this->castleUniqueTechIDs[castleIndex]];

			// Actually give the unique tech
			int allocatedTech = allocateTech(this->df, this->castleUniqueTechIDs[castleIndex], i + 1);

			if (castleCopies > 1) {
				this->multipliedEffects.push_back({allocatedTech, castleCopies});
			}

			// Readjust some of the effects to appropriate the new civ culture
			switch (castleIndex) {
			// Create and give barracks-uniqueunit
			case 12: {
				for (Civ &civ : this->df->Civs) {
					civ.Units.push_back(civ.Units[uniqueUnit]);
					civ.UnitPointers.push_back(1);
					int duplicateUU = (int) (civ.Units.size() - 1);
					civ.Units[duplicateUU].Name = "BARRACKSUU" + to_string(i);
					civ.Units[duplicateUU].Creatable.TrainLocationID = 12;
					civ.Units[duplicateUU].Creatable.ButtonID = 14;

					civ.Units.push_back(civ.Units[uniqueElite]);
					civ.UnitPointers.push_back(1);
					int duplicateUUelite = (int) (civ.Units.size() - 1);
					civ.Units[duplicateUUelite].Name = "BARRACKSUUE" + to_string(i);
					civ.Units[duplicateUUelite].Creatable.TrainLocationID = 12;
					civ.Units[duplicateUUelite].Creatable.ButtonID = 14;
				}
				int dupUU = (int) (df->Civs[0].Units.size() - 2);
				int dupUUe = (int) (df->Civs[0].Units.size() - 1);

				for (Tech &tech : this->df->Techs) {
					if (tech.Name == "Gothic Anarchy" && tech.Civ == (i + 1)) {
						Effect enableUnit = Effect();
						enableUnit.Name = "Enable barracks unit";
						enableUnit.EffectCommands.push_back(createEC(2, dupUU, 1, -1, 0));
						this->df->Effects.push_back(enableUnit);
						tech.EffectID = (int) (this->df->Effects.size() - 1);
					}
				}

				// df->Effects[333].EffectCommands.push_back(createEC(4, dupUU, -1, 8, amountTypetoD(1, 4)));
				// df->Effects[334].EffectCommands.push_back(createEC(4, dupUU, -1, 8, amountTypetoD(1, 4)));
				// df->Effects[618].EffectCommands.push_back(createEC(4, dupUU, -1, 8, amountTypetoD(1, 3)));
				// df->Effects[619].EffectCommands.push_back(createEC(4, dupUU, -1, 8, amountTypetoD(1, 3)));
				// df->Effects[620].EffectCommands.push_back(createEC(4, dupUU, -1, 8, amountTypetoD(1, 3)));
				// df->Effects[333].EffectCommands.push_back(createEC(4, dupUUe, -1, 8, amountTypetoD(1, 4)));
				// df->Effects[334].EffectCommands.push_back(createEC(4, dupUUe, -1, 8, amountTypetoD(1, 4)));
				// df->Effects[618].EffectCommands.push_back(createEC(4, dupUUe, -1, 8, amountTypetoD(1, 3)));
				// df->Effects[619].EffectCommands.push_back(createEC(4, dupUUe, -1, 8, amountTypetoD(1, 3)));
				// df->Effects[620].EffectCommands.push_back(createEC(4, dupUUe, -1, 8, amountTypetoD(1, 3)));

				this->duplicationUnits.push_back({uniqueUnit, dupUU, dupUUe});
				this->duplicationUnits.push_back({uniqueElite, dupUUe, -1});
				break;
			}
			// Turn stable-Tarkan into stable-uniqueunit
			case 13: {
				for (Civ &civ : this->df->Civs) {
					civ.Units.push_back(civ.Units[uniqueUnit]);
					civ.UnitPointers.push_back(1);
					int duplicateUU = (int) (civ.Units.size() - 1);
					civ.Units[duplicateUU].Name = "STABLEUU";
					civ.Units[duplicateUU].Creatable.TrainLocationID = 101;
					civ.Units[duplicateUU].Creatable.ButtonID = 13;

					civ.Units.push_back(civ.Units[uniqueElite]);
					civ.UnitPointers.push_back(1);
					int duplicateUUelite = (int) (civ.Units.size() - 1);
					civ.Units[duplicateUUelite].Name = "STABLEUUE";
					civ.Units[duplicateUUelite].Creatable.TrainLocationID = 101;
					civ.Units[duplicateUUelite].Creatable.ButtonID = 13;
				}
				int dupUU = (int) (this->df->Civs[0].Units.size() - 2);
				int dupUUe = (int) (this->df->Civs[0].Units.size() - 1);

				for (Tech &tech : this->df->Techs) {
					if (tech.Name == "Huns UT" && tech.Civ == (i + 1)) {
						Effect enableUnit = Effect();
						enableUnit.Name = "Enable stable unit";
						enableUnit.EffectCommands.push_back(createEC(2, dupUU, 1, -1, 0));
						this->df->Effects.push_back(enableUnit);
						tech.EffectID = (int) (this->df->Effects.size() - 1);
					}
				}

				// df->Effects[333].EffectCommands.push_back(createEC(4, dupUU, -1, 8, amountTypetoD(1, 4)));
				// df->Effects[334].EffectCommands.push_back(createEC(4, dupUU, -1, 8, amountTypetoD(1, 4)));
				// df->Effects[640].EffectCommands.push_back(createEC(4, dupUU, -1, 8, amountTypetoD(1, 3)));
				// df->Effects[584].EffectCommands.push_back(createEC(4, dupUU, -1, 8, amountTypetoD(1, 3)));
				// df->Effects[610].EffectCommands.push_back(createEC(5, dupUU, -1, 100, 0.85));
				// df->Effects[638].EffectCommands.push_back(createEC(5, dupUU, -1, 100, 0.941176));
				// df->Effects[333].EffectCommands.push_back(createEC(4, dupUUe, -1, 8, amountTypetoD(1, 4)));
				// df->Effects[334].EffectCommands.push_back(createEC(4, dupUUe, -1, 8, amountTypetoD(1, 4)));
				// df->Effects[640].EffectCommands.push_back(createEC(4, dupUUe, -1, 8, amountTypetoD(1, 3)));
				// df->Effects[584].EffectCommands.push_back(createEC(4, dupUUe, -1, 8, amountTypetoD(1, 3)));
				// df->Effects[610].EffectCommands.push_back(createEC(5, dupUUe, -1, 100, 0.85));
				// df->Effects[638].EffectCommands.push_back(createEC(5, dupUUe, -1, 100, 0.941176));

				this->duplicationUnits.push_back({uniqueUnit, dupUU, dupUUe});
				this->duplicationUnits.push_back({uniqueElite, dupUUe, -1});

				break;
			}
			// First Crusade
			case 29: {
				for (Tech &tech : this->df->Techs) {
					if (tech.Name == "First Crusade" && tech.Civ == (i + 1)) {
						Effect crusadeUnit = Effect();
						crusadeUnit.Name = "Enable crusade unit";
						crusadeUnit.EffectCommands.push_back(createEC(1, 234, 0, -1, 5));
						crusadeUnit.EffectCommands.push_back(createEC(7, uniqueUnit, 109, 5, 0));
						crusadeUnit.EffectCommands.push_back(createEC(1, 77, 1, -1, 3));
						crusadeUnit.EffectCommands.push_back(createEC(1, 178, 1, -1, 2));
						crusadeUnit.EffectCommands.push_back(createEC(1, 179, 1, -1, 4));
						this->df->Effects.push_back(crusadeUnit);
						tech.EffectID = (int) (this->df->Effects.size() - 1);
					}
				}
				break;
			}
			}
		}
	}

	// Imperial age unique techs
	for (int i = 0; i < this->config["imptech"].size(); i++) {
		int uniqueIndex = this->config["techtree"][i][0].asInt();
		int uniqueUnit = this->df->Effects[this->df->Techs[this->uuTechIDs[uniqueIndex].first].EffectID].EffectCommands[0].A;
		int uniqueElite = this->df->Effects[this->df->Techs[this->uuTechIDs[uniqueIndex].second].EffectID].EffectCommands[0].B;

		for (int j = 0; j < this->config["imptech"][i].size(); j++) {
			int impIndex = -1;
			int impCopies = -1;
			try {
				impIndex = this->config["imptech"][i][j].asInt();
				impCopies = 1;
			} catch (...) {
				impIndex = this->config["imptech"][i][j][0].asInt();
				impCopies = this->config["imptech"][i][j][1].asInt();
			}

			Tech &impTech = this->df->Techs[this->impUniqueTechIDs[impIndex]];

			// Actually give the unique tech
			int allocatedTech = allocateTech(this->df, this->impUniqueTechIDs[impIndex], i + 1);

			if (impCopies > 1) {
				this->multipliedEffects.push_back({allocatedTech, impCopies});
			}

			switch (impIndex) {
			// Allow teammates to train ten of your unique unit for free
			// Turn the free-kipchak into free-uniqueunit
			case 9: {
				for (Civ &civ : df->Civs) {
					civ.Units[1260] = civ.Units[uniqueElite];
					civ.Units[1260].Name = "MKIPCHAK";
					// civ.Units[1260].Creatable.TrainLocationID = -1;
					civ.Units[1260].Creatable.TrainLocationID = 82;
					civ.Units[1260].Creatable.ButtonID = 4;
					civ.Units[1260].Creatable.ResourceCosts[0].Type = 214;
					civ.Units[1260].Creatable.ResourceCosts[0].Amount = 1;
					// civ.Units[1260].Creatable.ResourceCosts[1].Type = 215;
					// civ.Units[1260].Creatable.ResourceCosts[1].Amount = -1;
				}
				this->duplicationUnits.push_back({uniqueElite, 1260, -1});
				break;
			}
			}
		}
	}
}

void
Civbuilder::assignCivBonuses() {
	for (int i = 0; i < this->config["civ_bonus"].size(); i++) {
		for (int j = 0; j < this->config["civ_bonus"][i].size(); j++) {
			int civBonusIndex = -1;
			int civBonusCopies = -1;
			try {
				civBonusIndex = this->config["civ_bonus"][i][j].asInt();
				civBonusCopies = 1;
			} catch (...) {
				civBonusIndex = this->config["civ_bonus"][i][j][0].asInt();
				civBonusCopies = this->config["civ_bonus"][i][j][1].asInt();
			}
			ai["civs"][i]["bn"].append(civBonusIndex);

			// Actually give the techs associated with that bonus
			for (int k = 0; k < this->civBonuses[civBonusIndex].size(); k++) {
				int allocatedTech = allocateTech(df, this->civBonuses[civBonusIndex][k], i + 1);
				// Store information so that we can multiply all effects after the effectcommands have been configured correctly
				if (civBonusCopies > 1) {
					this->multipliedEffects.push_back({allocatedTech, civBonusCopies});
				}
			}

			// Apply extra necessary effects
			int uniqueIndex = this->config["techtree"][i][0].asInt();
			int uniqueUnit = this->df->Effects[this->df->Techs[this->uuTechIDs[uniqueIndex].first].EffectID].EffectCommands[0].A;
			int uniqueElite = this->df->Effects[this->df->Techs[this->uuTechIDs[uniqueIndex].second].EffectID].EffectCommands[0].B;
			switch (civBonusIndex) {
			// If they have Kreposts, let them train their unique unit in them!
			case 93: {
				for (Civ &civ : this->df->Civs) {
					civ.Units.push_back(civ.Units[uniqueUnit]);
					civ.UnitPointers.push_back(1);
					int duplicateUU = (int) (civ.Units.size() - 1);
					civ.Units[duplicateUU].Name = "KREPOSTUNIT" + to_string(i);
					civ.Units[duplicateUU].Creatable.TrainLocationID = 1251;
					civ.Units[duplicateUU].Creatable.ButtonID = 1;

					civ.Units.push_back(civ.Units[uniqueElite]);
					civ.UnitPointers.push_back(1);
					int duplicateUUelite = (int) (civ.Units.size() - 1);
					civ.Units[duplicateUUelite].Name = "EKREPOSTUNIT" + to_string(i);
					civ.Units[duplicateUUelite].Creatable.TrainLocationID = 1251;
					civ.Units[duplicateUUelite].Creatable.ButtonID = 1;
				}
				int dupUU = (int) (this->df->Civs[0].Units.size() - 2);
				int dupUUe = (int) (this->df->Civs[0].Units.size() - 1);

				for (Tech &tech : this->df->Techs) {
					if (tech.Name == "C-Bonus, Enable Krepost" && tech.Civ == (i + 1)) {
						Effect enableUnit = Effect();
						enableUnit.Name = "Enable Krepost & Unit";
						enableUnit.EffectCommands.push_back(createEC(2, 1251, 1, -1, 0));
						enableUnit.EffectCommands.push_back(createEC(2, dupUU, 1, -1, 0));
						this->df->Effects.push_back(enableUnit);
						tech.EffectID = (int) (this->df->Effects.size() - 1);
					}
				}

				duplicationUnits.push_back({uniqueUnit, dupUU, dupUUe});
				duplicationUnits.push_back({uniqueElite, dupUUe, -1});
				break;
			}
			// If they have Donjons, let them train their unique unit in them!
			case 109: {
				for (Civ &civ : this->df->Civs) {
					civ.Units.push_back(civ.Units[uniqueUnit]);
					civ.UnitPointers.push_back(1);
					int duplicateUU = (int) (civ.Units.size() - 1);
					civ.Units[duplicateUU].Name = "DONJONUNIT" + to_string(i);
					civ.Units[duplicateUU].Creatable.TrainLocationID = 1665;
					civ.Units[duplicateUU].Creatable.ButtonID = 1;

					civ.Units.push_back(civ.Units[uniqueElite]);
					civ.UnitPointers.push_back(1);
					int duplicateUUelite = (int) (civ.Units.size() - 1);
					civ.Units[duplicateUUelite].Name = "EDONJONUNIT" + to_string(i);
					civ.Units[duplicateUUelite].Creatable.TrainLocationID = 1665;
					civ.Units[duplicateUUelite].Creatable.ButtonID = 1;
				}
				int dupUU = (int) (this->df->Civs[0].Units.size() - 2);
				int dupUUe = (int) (this->df->Civs[0].Units.size() - 1);

				for (Tech &tech : this->df->Techs) {
					if (tech.Name == "Enable Donjon Unit" && tech.Civ == (i + 1)) {
						Effect enableUnit = Effect();
						enableUnit.Name = "Enable Donjon Unit";
						enableUnit.EffectCommands.push_back(createEC(2, dupUU, 1, -1, 0));
						this->df->Effects.push_back(enableUnit);
						tech.EffectID = (int) (this->df->Effects.size() - 1);
						if (uniqueUnit == 1658) {
							tech.RequiredTechs[0] = 101;
						} else {
							tech.RequiredTechs[0] = 102;
						}
					}
				}

				duplicationUnits.push_back({uniqueUnit, dupUU, dupUUe});
				duplicationUnits.push_back({uniqueElite, dupUUe, -1});

				break;
			}
			// Wonder provides +50 bonus pop
			case 140: {
				// Use the "ore storage" resource to cap at 1 wonder
				Civ &civ = this->df->Civs[i + 1];
				civ.Resources[56] = 1.1;
				civ.Units[276].ResourceStorages[0].Type = 32;
				civ.Units[276].ResourceStorages[0].Amount = 50;
				civ.Units[276].ResourceStorages[0].Flag = 4;
				civ.Units[276].ResourceStorages[1].Type = 56;
				civ.Units[276].ResourceStorages[1].Amount = -1;
				civ.Units[276].ResourceStorages[1].Flag = 2;
				civ.Units[276].Creatable.ResourceCosts[0] = civ.Units[276].Creatable.ResourceCosts[2];
				civ.Units[276].Creatable.ResourceCosts[2].Type = 56;
				civ.Units[276].Creatable.ResourceCosts[2].Amount = 1;
				civ.Units[276].Creatable.ResourceCosts[2].Flag = 0;
				break;
			}
			// Villagers give 25 food on death
			case 211: {
				Civ &civ = this->df->Civs[i + 1];
				const vector<int> vil_d = {58, 60, 224, 225, 353, 227, 228, 229, 215, 217, 219, 221, 213, 226, 211, 355, 229, 591, 593};
				for (int k = 0; k < vil_d.size(); k++) {
					civ.Units[vil_d[k]].ResourceStorages[1].Type = 0;
					civ.Units[vil_d[k]].ResourceStorages[1].Amount = 25;
					civ.Units[vil_d[k]].ResourceStorages[1].Flag = 1;
				}
				break;
			}
			// Mangonels can cut trees
			case 213: {
				Civ &civ = this->df->Civs[i + 1];
				civ.Units[280].Bird.TaskList[5].ClassID = 15;
				civ.Units[280].Type50.BlastAttackLevel = 1;
				break;
			}
			// Refund castle stone
			case 218: {
				Civ &civ = this->df->Civs[i + 1];
				//					civ.Units[1430].ResourceStorages[1].Type = 2;
				//					civ.Units[1430].ResourceStorages[1].Amount = 350;
				//					civ.Units[1430].ResourceStorages[1].Flag = 1;
				civ.Units[82].ResourceStorages[1].Type = 3;
				civ.Units[82].ResourceStorages[1].Amount = 400;
				civ.Units[82].ResourceStorages[1].Flag = 4;
				break;
			}
			// Rams generate stone
			case 229: {
				Civ &civ = this->df->Civs[i + 1];
				for (int k = 0; k < this->unitClasses["ram"].size(); k++) {
					civ.Units[this->unitClasses["ram"][k]].Bird.TaskList[civ.Units[this->unitClasses["ram"][k]].Bird.TaskList.size() - 1].ClassID = 3;
				}
				break;
			}
			}
		}
	}
}

void
Civbuilder::assignTeamBonuses() {
	for (int i = 0; i < this->config["team_bonus"].size(); i++) {
		// Create a new effect with multiple team bonuses
		Effect tbEffect = Effect();
		tbEffect.Name = "Team Bonus, " + to_string(i) + " set";
		for (int j = 0; j < this->config["team_bonus"][i].size(); j++) {
			int teamBonusIndex = -1;
			int teamBonusCopies = -1;
			try {
				teamBonusIndex = this->config["team_bonus"][i][j].asInt();
				teamBonusCopies = 1;
			} catch (...) {
				teamBonusIndex = this->config["team_bonus"][i][j][0].asInt();
				teamBonusCopies = this->config["team_bonus"][i][j][1].asInt();
			}
			for (int k = 0; k < this->df->Effects[this->teamBonuses[teamBonusIndex]].EffectCommands.size(); k++) {
				for (int l = 0; l < teamBonusCopies; l++) {
					tbEffect.EffectCommands.push_back(this->df->Effects[this->teamBonuses[teamBonusIndex]].EffectCommands[k]);
				}
			}
			switch (teamBonusIndex) {
			case 30: {
				allocateTech(this->df, 721, i + 1);
				break;
			}
			}
			ai["civs"][i]["tb"].append(this->config["team_bonus"][i][j]);
		}
		this->df->Effects.push_back(tbEffect);
		this->df->Civs[i + 1].TeamBonusID = (this->df->Effects.size() - 1);
	}
}

// Any and all effects that apply to units should apply to their barracks/stable/krepost/donjon/copy equivalent
void
Civbuilder::duplicateUnitEffects() {
	const vector<int> copyEffectTypes = {0, 3, 4, 5, 10, 13, 14, 15, 20, 23, 24, 25, 30, 33, 34, 35, 40, 43, 44, 45};
	for (int i = 0; i < this->duplicationUnits.size(); i++) {
		// Re-copy the unit stats (if we added any new attack classes or armor classes)
		for (Civ &civ : this->df->Civs) {
			civ.Units[this->duplicationUnits[i][1]].Type50.Attacks = civ.Units[this->duplicationUnits[i][0]].Type50.Attacks;
			civ.Units[this->duplicationUnits[i][1]].Type50.Armours = civ.Units[this->duplicationUnits[i][0]].Type50.Armours;
		}

		for (Effect &effect : df->Effects) {
			int numEffectCommands = effect.EffectCommands.size();
			for (int j = 0; j < numEffectCommands; j++) {
				// Check if this effect command applies to the unit who's effects we're duplicating, and that it's an attribute effect command
				if ((effect.EffectCommands[j].A == this->duplicationUnits[i][0]) &&
					(find(copyEffectTypes.begin(), copyEffectTypes.end(), effect.EffectCommands[j].Type) != copyEffectTypes.end())) {
					if (effect.EffectCommands[j].Type % 10 != 3) {
						// Not an upgrade, so copy the effect fully
						EffectCommand copyEC = effect.EffectCommands[j];
						copyEC.A = this->duplicationUnits[i][1];
						bool alreadyHasEC = false;
						for (int k = 0; k < numEffectCommands; k++) {
							if (copyEC.Type == effect.EffectCommands[k].Type && copyEC.A == effect.EffectCommands[k].A &&
								copyEC.B == effect.EffectCommands[k].B && copyEC.C == effect.EffectCommands[k].C && copyEC.D == effect.EffectCommands[k].D) {
								alreadyHasEC = true;
								k = numEffectCommands;
							}
						}
						if (!alreadyHasEC) {
							effect.EffectCommands.push_back(copyEC);
						}
					} else if (this->duplicationUnits[i][2] != -1) {
						// This is an upgrade, so copy the effect so that the duplicate unit gets upgraded to the duplicate's upgrade, not the original unit's
						// upgrade
						EffectCommand copyEC = effect.EffectCommands[j];
						copyEC.A = this->duplicationUnits[i][1];
						copyEC.B = this->duplicationUnits[i][2];
						bool alreadyHasEC = false;
						for (int k = 0; k < numEffectCommands; k++) {
							if (copyEC.Type == effect.EffectCommands[k].Type && copyEC.A == effect.EffectCommands[k].A &&
								/*copyEC.B == effect.EffectCommands[k].B && */ copyEC.C == effect.EffectCommands[k].C &&
								copyEC.D == effect.EffectCommands[k].D) {
								alreadyHasEC = true;
								k = numEffectCommands;
							}
						}
						if (!alreadyHasEC) {
							effect.EffectCommands.push_back(copyEC);
						}
					}
				}
			}
		}
	}
}
