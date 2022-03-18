#include "configure_civilizations.h"
#include <iostream>
#include <string>
#include <fstream>
#include <algorithm>
#include <cmath>
#include <time.h>
#include <math.h>
#include "genie/dat/DatFile.h"
#include "json/json.h"

#define SLOBYTE(x) (*((int8_t*)&(x)))
#define HIBYTE(x) (*((uint8_t*)&(x)+1))

using namespace Json;
using namespace std;
using namespace genie;

typedef ResourceUsage<int16_t, int16_t, int16_t> ResourceCost;
typedef ResourceUsage<int16_t, int16_t, uint8_t> ResearchResourceCost;

const int num_civs = 39;
//Unit Classes:
//Barracks Units, Stable Units, Archery Range Units, Siege Workshop Units, Elephant Units, Gunpowder Units, Foot Archers, Mounted Units, Camel Units, Siege Units,
//Military Buildings, Drop-Off Buildings, All Explosive Units, Scorpion Units, Unique Units, Steppe Lancer Units, Eagle Units
vector<vector<int>> unit_class = {
	{74, 75, 77, 473, 567, 93, 358, 359, 751, 753, 752, 759, 761, 882},
	{448, 546, 441, 1707, 38, 283, 569, 329, 330, 207, 1132, 1134, 1180, 1370, 1372, 1181, 886, 887},
	{4, 24, 492, 5, 7, 6, 1155, 39, 474, 185, 1010, 1012},
	{35, 1258, 422, 548, 280, 550, 588, 885, 1105, 36, 279, 542, 1179, 1709},
	{239, 558, 873, 875, 1120, 1122, 1132, 1134, 1180},
	{5, 36, 420, 691, 46, 557, 1001, 1003, 771, 773, 1709, 1704, 1706},
	{4, 24, 492, 8, 73, 185, 530, 559, 763, 765, 866, 868, 1129, 1131, 6, 7, 1155},
	{448, 546, 441, 1707, 38, 283, 569, 329, 330, 207, 1132, 1134, 1180, 1370, 1372, 1181, 39, 474, 40, 553, 282, 556, 11, 561, 771, 773, 755, 757, 873, 875, 869, 871, 876, 878, 1007, 1009, 1126, 1128, 1225, 1227, 1228, 1230, 1231, 1233, 1234,
		1236, 1655, 1657, 775, 1010, 1012},
	{329, 330, 207, 1007, 1009, 1263, 282, 556},
	{35, 1258, 422, 548, 280, 550, 588, 885, 1105, 36, 279, 542, 1179, 1001, 1003, 42, 331, 1690, 1691, 1709, 1704, 1706},
	{12, 20, 132, 498, 10, 14, 87, 86, 101, 153, 49, 150},
	{68, 129, 130, 131, 562, 563, 564, 565, 584, 585, 586, 587},
	{527, 528, 1104, 440, 1263, 706},
	{279, 542, 1179, 827, 829, 1120, 1122},
	{8, 530, 281, 531, 41, 555, 25, 554, 291, 560, 73, 559, 40, 553, 282, 556, 239, 558, 46, 557, 692, 694, 11, 561, 232, 534, 771, 773, 725, 726, 763, 765, 755, 757, 827, 829, 866, 868, 873, 875, 879, 881, 869, 871, 876, 878,
		1001, 1003, 1016, 1018, 1013, 1015, 1007, 1009, 1120, 1122, 1123, 1125, 1126, 1128, 1129, 1131, 1225, 1227, 1252, 1253, 1228, 1230, 1231, 1233, 1234, 1236, 1655, 1657, 1658, 1659, 1701, 1702, 1704, 1706},
	{1370, 1372, 1181},
	{751, 752, 753}
};
const vector<vector<int>> unit_sets = {
/*Houses*/		{15, 50, 6, 3, 70, 191, 192, 463, 464, 465},
/*Mills*/		{50, 200, 0, 3, 68, 129, 130, 131},
/*Lumber Camps*/	{50, 200, 0, 3, 562, 563, 564, 565},
/*Mining Camps*/	{50, 200, 0, 3, 584, 585, 586, 587},
/*Farms*/		{30, 70, 0, 3, 50, 1187},
/*Docks*/		{50, 200, 0, 3, 45, 47, 51, 133, 805, 806, 808},
/*Town Centers*/	{75, 500, 0, 2, 71, 109, 141, 142, 444, 481, 482, 483, 484, 597, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621},
/*Barracks*/		{100, 250, 7, 3, 12, 20, 132, 498},
/*Archery Ranges*/	{100, 250, 7, 3, 10, 14, 87},
/*Stables*/		{100, 250, 7, 3, 86, 101, 153},
/*Siege Workshops*/	{100, 250, 7, 3, 49, 150},
/*Outposts*/		{10, 50, 7, 3, 598},
/*Blacksmiths*/		{100, 250, 5, 3, 18, 19, 103, 105},
/*Markets*/		{100, 250, 5, 3, 84, 116, 137},
/*Monasteries*/		{100, 250, 7, 3, 30, 31, 32, 104},
/*Universities*/	{100, 250, 5, 3, 209, 210},
/*Castles*/		{300, 1000, 0, 3, 82},
/*Towers*/		{100, 250, 7, 3, 79, 190, 234, 235},
/*Bombard Towers*/	{200, 500, 7, 3, 236},
/*Fish Traps*/		{30, 120, 7, 3, 199},
/*Palisade Walls*/	{1, 5, 7, 1, 72},
/*Palisade Gates*/	{20, 40, 7, 3, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804},
/*Stone Walls*/		{1, 10, 7, 1, 117, 155, 370},
/*Stone Gates*/		{25, 50, 7, 3, 63, 64, 67, 78, 80, 81, 85, 88, 90, 91, 92, 95, 487, 488, 490, 491, 659, 660, 661, 662, 663, 664, 665, 666, 667, 668, 669, 670, 671, 672, 673, 674, 1579, 1580, 1581, 1582, 1583, 1584, 1585, 1586, 1587, 1588, 1589, 1590, 1591, 1592, 1593, 1594},
/*Donjons*/		{100, 250, 0, 3, 1665},
/*Kreposts*/		{200, 500, 0, 3, 1251},
/*Feitorias*/		{250, 750, 0, 2, 1021},
/*Wonders*/		{1000, 5000, 0, 2, 276},
/*Villagers*/		{25, 100, 0, 2, 56, 57, 83, 118, 120, 122, 123, 124, 156, 206, 212, 214, 216, 218, 220, 222, 259, 293, 354, 579, 581, 590, 592},
/*Fishing Ships*/	{50, 100, 0, 2, 13},
/*Archers*/		{40, 100, 0, 2, 4, 24, 492},
/*Skirmishers*/		{30, 80, 0, 2, 6, 7, 1155},
/*Cav Archers*/		{60, 160, 0, 2, 39, 474},
/*Hand Cannons*/	{40, 140, 0, 2, 5},
/*Militias*/		{35, 100, 0, 2, 74, 75, 77, 473, 567},
/*Pointy Bois*/		{30, 80, 0, 2, 93, 358, 359, 1182, 1183, 1184},
/*Eagles*/		{50, 100, 0, 2, 751, 752, 753},
/*Scouts*/		{40, 90, 0, 2, 448, 546, 441, 1707},
/*Knights*/		{85, 185, 0, 2, 38, 283, 569},
/*Camels*/		{65, 140, 0, 2, 329, 330, 207},
/*Battle Elephants*/	{110, 225, 0, 2, 1132, 1134, 1180},
/*Steppe Lancers*/	{65, 120, 0, 2, 1370, 1372, 1181},
/*Rams*/		{100, 275, 0, 2, 35, 422, 548, 1258},
/*Mangonels*/		{120, 350, 0, 2, 280, 550, 588},
/*Scorpions*/		{80, 180, 0, 2, 279, 542, 1179},
/*Siege Towers*/	{50, 200, 0, 2, 885, 1105},
/*Bombard Cannons*/	{150, 600, 0, 2, 36, 1709},
/*Transports*/		{50, 200, 0, 2, 545},
/*Fire Ships*/		{60, 160, 0, 2, 1103, 529, 532},
/*Demo Ships*/		{60, 160, 0, 2, 1104, 527, 528},
/*Galleys*/		{80, 180, 0, 2, 539, 21, 442},
/*Cannon Galleons*/	{150, 450, 0, 2, 420, 691},
/*Trade Cogs*/		{50, 175, 0, 2, 17},
/*Trade Carts*/		{50, 175, 0, 2, 128, 204},
/*Petards*/		{40, 85, 5, 2, 440},
/*Trebuchets*/		{200, 800, 0, 2, 42, 331},
/*Monks*/		{35, 120, 0, 2, 125, 648},
/*Missionaries*/	{35, 120, 0, 2, 775},
/*Slingers*/		{40, 100, 0, 2, 185},
/*Genitours*/		{60, 160, 0, 2, 1010, 1012},
/*Condottiero*/		{50, 110, 0, 2, 882},
/*Turtle Ships*/	{150, 450, 0, 2, 831, 832},
/*Longboats*/		{100, 200, 0, 2, 250, 533},
/*Caravels*/		{100, 200, 0, 2, 1004, 1006},
/*Flaming Camels*/	{40, 100, 0, 2, 1263},
/*Flemish Militia*/	{40, 100, 0, 2, 1663, 1697, 1699},
/*Folwarks*/		{50, 200, 0, 2, 1711, 1720, 1734}
};
int vilspear = -1;
int vilpike = -1;
int vilhalb = -1;
const vector<int> houses = {70, 191, 192, 463, 464, 465};
const vector<int> rams = {35, 1258, 422, 548};
const vector<int> enablingTechs = {16, 483, 695, 775, 690};
const vector<vector<int>> duplicateUUs = {{759, 761}, {886, 887}, {1254, 1255}, {1660, 1661}, {-1, 1260}};
//Most of these vectors are used as index maps from the config file to in-game IDs
//It serves as a function x |-> f(x) where x is the index in the vector as well as the ID in the config file, and f(x) is the in-game ID
const vector<int> tech_tree_ids = {254,258,259,262,255,257,256,260,261,263,276,277,275,446,447,449,448,504,10,1,3,5,7,31,48,42,37,646,648,650,652,706,708,710,712,782,784,801,803};
const vector<int> basic_techs = {-1,-1,-1,-1,414,222,207,217,264,87,197,429,433,384,716,215,602,147,151,100,237,99,98,192,218,85,437,436,25,204,254,428,166,209,265,235,236,630,631,714,715,435,39,149,162,96,255,358,257,320,94,239,603,
	188,211,212,219,199,200,201,67,82,80,74,76,77,604,243,246,605,242,244,-1,-1,35,37,376,65,374,375,373,50,51,194,93,140,63,380,322,54,47,64,377,608,379,321,315,316,319,441,439,231,252,45,233,230,438,8,280,213,249,55,182,278,279,
	202,203,221,48,23,17,15,14,13,12,434,189,68,75,81,339,180,391,256,157,161,426,220,410,216,411,413,127,137,148,281,210,357,150,144,332,22,101,102,103};
vector<vector<int>> uu_tech_ids = {{263, 360}, {275, 363}, {446, 365}, {276, 364}, {262, 366}, {268, 362}, {267, 361}, {269, 368}, {274, 367}, {271, 369}, {399, 398},
	{273, 371}, {277, 370}, {58, 60}, {431, 432}, {26, 27}, {1, 2}, {449, 450}, {467, 468}, {480, 481}, {508, 509}, {471, 472}, {503, 504}, {562, 563}, {568, 569}, {566, 567},
	{564, 565}, {614, 615}, {616, 617}, {618, 619}, {620, 621}, {677, 678}, {679, 680}, {681, 682}, {683, 684}, {750, 751}, {752, 753}, {778, 779}, {780, 781}};
vector<int> castle_ut_ids = {460, 578, 3, 685, 754, 626, 464, 482, 462, 689, 574, 83, 16, 483, 516, 506, 494, 484, 622, 486, 691, 514, 624, 576, 485, 487, 488, 572, 490, 756, 512, 492, 687, 489, 491, 628, 463, 782, 784};
vector<int> imp_ut_ids = {24, 579, 461, 686, 755, 627, 61, 5, 52, 690, 575, 493, 457, 21, 517, 507, 499, 59, 623, 445, 692, 515, 625, 577, 4, 6, 7, 573, 9, 757, 513, 440, 688, 11, 10, 629, 49, 783, 785};
vector<vector<int>> civ_bonuses = {
{381},
{382, 403},
{383},
{325},
{290},
{524},
{343},
{402},
{406},
{327, 328, 329},
{344, 731, 732, 733},
{347},
{336, 353},
{314},
{334, 335},
{340},
{306, 422, 423, 424},
{341},
{302, 226, 425},
{396},
{304, 350, 351, 352},
{283, 417, 418, 419},
{397},
{284},
{223},
{342, 349},
{409, 412},
{355},
{337},
{404},
{312},
{301},
{300},
{452},
{395, 501, 502},
{416, 415, 391},
{394},
{389},
{388},
{393},
{385},
{386},
{405},
{84},
{224},
{29, 30, 31, 32, 33, 36, 38, 40, 41},
{554, 227},
{458, 459},
{390},
{451},
{447, 448},
{272, 372},
{500},
{521},
{518},
{505, 552},
{496, 497, 498, 553},
{730},
{519},
{495},
{474, 475, 476, 477, 478, 479},
{528},
{69},
{473},
{511},
{559},
{453},
{560},
{570},
{596, 597},
{607},
{587, 588, 589},
{590},
{595},
{591, 592, 593},
{594},
{584},
{585},
{586, 613},
{672},
{657},
{638},
{634},
{662, 663},
{635},
{637},
{645},
{646, 647, 648},
{649},
{665},
{632},
{693},
{694},
{695},
{704},
{696},
{698},
{711, 727, 728},
{709, 723, 724},
{295, 705, 706, 675},
{697},
{710},
{699, 700, 701, 702},
{768},
{769},
{758, 759, 760, 761, 762, 763, 764, 765, 766, 767},
{770},
{771},
{772, 773, 774},
{775}
};
vector<int> team_bonuses = {488,38,399,707,783,651,400,401,402,711,49,403,405,484,4,2,11,406,647,505,713,6,649,43,489,407,408,32,409,785,9,490,709,404,410,653,411};
vector<int> university_techs = {50, 51, 194, 93, 47, 64, 140, 63, 377, 380, 54, 608, 322};

void clearCivs(DatFile *df, Value cfg);
void createNewTechsBonuses(DatFile *df, Value cfg);
void assignArchitectures(DatFile *df, Value cfg);
void assignLanguages(DatFile *df, Value cfg, ofstream& logfile);
void assignUniqueUnits(DatFile *df, Value cfg, ofstream& logfile);
void assignTechs(DatFile *df, Value cfg, ofstream& logfile);
void assignCivBonuses(DatFile *df, Value cfg);
void assignTeamBonuses(DatFile *df, Value cfg);
void duplicateUUEffects(DatFile *df, Value cfg);
void randomizeCosts(DatFile *df, Value cfg, ofstream& logfile);
void calculateTechDiscounts(DatFile *df);

void setUnitCosts(DatFile *df, vector<int> costs, int civID, int unitID);
void setUnitCosts (DatFile *df, vector<int> unitIDs, vector<int> costs);

float amountTypetoD (int32_t value, int32_t type) {
        int32_t NewD = 0;

        SLOBYTE(NewD) = (int8_t)value;
        HIBYTE(NewD) = (uint8_t)type;

	return ((float)NewD);
}

int vectorSum (vector<int> v) {
	int sum = 0;
	for (int i=0; i<v.size(); i++) {
		sum += v[i];
	}
	return sum;
}

EffectCommand createEC (int type, int A, int B, int C, float D) {
	EffectCommand effect_command = EffectCommand();
	effect_command.Type = type;
	effect_command.A = A;
	effect_command.B = B;
	effect_command.C = C;
	effect_command.D = D;
	return effect_command;
}

//Each Effect ID element:	0th entry		= effectID
//				1st - (n-1)th entry	= indices of the effectCommands to copy of that effectID
void copyEffectstoUnits (DatFile *df, vector<vector<int>> effect_ids, vector<int> unit_ids) {
	for (int i=0; i<effect_ids.size(); i++) {
		for (int j=0; j<(effect_ids[i].size()-1); j++) {
			for (int k=0; k<unit_ids.size(); k++) {
				EffectCommand copy_effect = df->Effects[effect_ids[i][0]].EffectCommands[effect_ids[i][j+1]];
				copy_effect.A = unit_ids[k];
				df->Effects[effect_ids[i][0]].EffectCommands.push_back(copy_effect);
			}
		}
	}
}

void giveEffectstoClass (DatFile *df, int effectID, vector<EffectCommand> effects, vector<int> units) {
	df->Effects[effectID].EffectCommands.clear();
	for (int i=0; i<units.size(); i++) {
		for (int j=0; j<effects.size(); j++) {
			effects[j].A = units[i];
			df->Effects[effectID].EffectCommands.push_back(effects[j]);
		}
	}
}

void addAttacktoUnits (DatFile *df, int effectID, int attack_amount, vector<int> units) {
	for (int i=0; i<units.size(); i++) {
		//Find if unit base attack is melee, pierce, or leitis
		int attack_type = -1;
		for (int j=0; j<df->Civs[0].Units[units[i]].Type50.Attacks.size(); j++) {
			unit::AttackOrArmor attack = df->Civs[0].Units[units[i]].Type50.Attacks[j];
			if (((attack.Class == 4) || (attack.Class == 3) || (attack.Class == 31)) && (attack.Amount != 0)) {
				attack_type = attack.Class;
			}
		}
		if (attack_type != -1) {
			df->Effects[effectID].EffectCommands.push_back(createEC(4, units[i], -1, 9, amountTypetoD(attack_amount, attack_type)));
		}
	}
}

void addEffectandTech(DatFile *df, Effect e, string name) {
	e.Name = name;
	df->Effects.push_back(e);
	Tech t = Tech();
	t.Name = name;
	t.Civ = 99;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);
	civ_bonuses.push_back({(int) (df->Techs.size() - 1)});
}

int addEffectandTech(DatFile *df, Effect e, string name, vector<int> requirements) {
	e.Name = name;
	df->Effects.push_back(e);
	Tech t = Tech();
	t.Name = name;
	for (int i=0; i<requirements.size(); i++) {
		t.RequiredTechs.push_back(requirements[i]);
	}
	t.RequiredTechCount = requirements.size();
	t.Civ = 99;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);
	return (int) (df->Techs.size() - 1);
}

void addEffectandTB(DatFile *df, Effect e, string name) {
	e.Name = name;
	df->Effects.push_back(e);
	team_bonuses.push_back(df->Effects.size() - 1);
}

//In order to add to a bonus damage, it has to exist first
void giveClassNewBonus (DatFile *df, int classID, int bonusID) {
	for (Civ &civ : df->Civs) {
		for (Unit &unit : civ.Units) {
			if (unit.Class == classID) {
				bool hasBonus = false;
				for (int i=0; i<unit.Type50.Attacks.size(); i++) {
					if (unit.Type50.Attacks[i].Class == bonusID) {
						hasBonus = true;
					}
				}
				if (!hasBonus) {
					unit::AttackOrArmor bonus_0 = unit::AttackOrArmor();
					bonus_0.Class = bonusID;
					bonus_0.Amount = 0;
					unit.Type50.Attacks.push_back(bonus_0);
				}
			}
		}
	}
}

void giveClassNewBonus (DatFile *df, vector<int> unit_ids, int bonusID) {
	for (Civ &civ : df->Civs) {
		for (int i=0; i<unit_ids.size(); i++) {
			bool hasBonus = false;
			for (int j=0; j<civ.Units[unit_ids[i]].Type50.Attacks.size(); j++) {
				if (civ.Units[unit_ids[i]].Type50.Attacks[j].Class == bonusID) {
					hasBonus = true;
				}
			}
			if (!hasBonus) {
				unit::AttackOrArmor bonus_0 = unit::AttackOrArmor();
				bonus_0.Class = bonusID;
				bonus_0.Amount = 0;
				civ.Units[unit_ids[i]].Type50.Attacks.push_back(bonus_0);
			}
		}
	}
}

//If this tech has any requirements that require civ ownership, use an existing duplicate or make a duplicate
void allocateRequirements (DatFile *df, int techID, int civID) {
	int numRequiredTechs = 0;
	Tech &newtech = df->Techs[techID];
	for (int i=0; i<newtech.RequiredTechs.size(); i++) {
		if (newtech.RequiredTechs[i] >= 0) {
			numRequiredTechs++;
		}
	}
	for (int i=0; i<numRequiredTechs; i++) {
		Tech &reqtech = df->Techs[newtech.RequiredTechs[i]];
		if (reqtech.Civ >= 0) {
			if (reqtech.Civ == 99) {
				reqtech.Civ = civID;
			} else {
				bool existingDuplicate = false;
				for (int j=0; j<df->Techs.size(); j++) {
					if ((df->Techs[j].Name == reqtech.Name) && (df->Techs[j].EffectID == reqtech.EffectID) && (df->Techs[j].Civ == civID)) {
						newtech.RequiredTechs[i] = j;
						existingDuplicate = true;
					}
				}
				if (!existingDuplicate) {
					Tech s = df->Techs[df->Techs[techID].RequiredTechs[i]];
					s.Civ = civID;
					df->Techs.push_back(s);
					newtech.RequiredTechs[i] = (int) (df->Techs.size() - 1);
				}
			}
		}
	}
}

//If the tech is already owned by a different civ, duplicate it and give the copy to new civ
void allocateTech (DatFile *df, int techID, int civID/*, ofstream &logfile*/) {
	//If techID would cause error, abort!
	if (techID <= 0) {
		return;
	}
	//If no one owns it yet, just hand it over
	if (df->Techs[techID].Civ == 99) {
		df->Techs[techID].Civ = civID;
		allocateRequirements(df, techID, civID);
	} else {
		//Check for a duplicate that we already own
		//This will only exist if you previously allocated a tech that created a duplicate of the same tech you are trying to allocate now (because it needed to fulfill its required techs)
		bool existingDuplicate = false;
		int newTechID;
		for (int i=0; i<df->Techs.size(); i++) {
			Tech &tech = df->Techs[i];
			if ((tech.Name == df->Techs[techID].Name) && (tech.EffectID == df->Techs[techID].EffectID) && (tech.Civ == civID)) {
				existingDuplicate = true;
				newTechID = i;
			}
		}
		if (!existingDuplicate) {
			Tech t = df->Techs[techID];
			t.Civ = civID;
			df->Techs.push_back(t);
			newTechID = (int) (df->Techs.size() - 1);
			//If any techs available to us require the old tech, give them the option to be fulfilled by having this tech
			for (Tech &tech : df->Techs) {
				if ((tech.Civ == -1) || (tech.Civ == civID)) {
					for (int i=0; i<tech.RequiredTechs.size(); i++) {
						if (tech.RequiredTechs[i] == techID) {
							//For some reason all techs in base-game start with size 6 which makes the hasRequired variable necessary (and numRequiredTechs variable later)
							//Fortunately, the Tech default constructor gives it size 0 which is why this is only necessary here
							bool hasRequired = false;
							for (int j=0; j<tech.RequiredTechs.size(); j++) {
								if ((tech.RequiredTechs[j] == -1) && (!hasRequired)) {
									hasRequired = true;
									tech.RequiredTechs[j] = (int) (df->Techs.size() - 1);
								}
							}
							if (!hasRequired) {
								tech.RequiredTechs.push_back((int) (df->Techs.size() - 1));
							}
						}
					}
				}
			}
		}
		allocateRequirements(df, newTechID, civID);
	}
}

//Create a unique unit and an elite version
void createUU (DatFile *df, int baseID, string name, vector <int> tech_costs, int techtime, int techDLL) {
	for (Civ &civ : df->Civs) {
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
	int uuID = ((int) (df->Civs[0].Units.size())) - 2;
	int eID = ((int) (df->Civs[0].Units.size())) - 1;
	vector <int> new_tech_ids = {};

	//Tech to make unique unit available
	Effect uuavail = Effect();
	uuavail.Name = name + " (make avail)";
	uuavail.EffectCommands.push_back(createEC(2, uuID, 1, -1, 0));
	df->Effects.push_back(uuavail);

	Tech uutech = Tech();
	uutech.Name = name + " (make avail)";
	uutech.RequiredTechs.push_back(102);
	uutech.RequiredTechCount = 1;
	uutech.FullTechMode = 1;
	uutech.Repeatable = true;
	uutech.Civ = 99;
	uutech.EffectID = (int) (df->Effects.size() - 1);
	df->Techs.push_back(uutech);
	new_tech_ids.push_back((int) (df->Techs.size() - 1));

	//Tech to upgrade to elite version
	Effect eupgrade = Effect();
	eupgrade.Name = "Elite " + name;
	eupgrade.EffectCommands.push_back(createEC(3, uuID, eID, -1, 0));
	df->Effects.push_back(eupgrade);

	Tech etech = Tech();
	etech.Name = "Elite " + name;
	etech.FullTechMode = 1;
	etech.IconID = 105;
	etech.ButtonID = 6;
	etech.Repeatable = true;
	etech.ResearchLocation = 82;

	int writeIndex = 0;
	for (int i=0; i<tech_costs.size(); i++) {
		if (tech_costs[i] != 0) {
			etech.ResourceCosts[writeIndex].Type = i;
			etech.ResourceCosts[writeIndex].Amount = tech_costs[i];
			etech.ResourceCosts[writeIndex].Flag = 1;
			writeIndex++;
		}
	}
	etech.ResearchTime = techtime;

	etech.LanguageDLLName = techDLL;
	etech.LanguageDLLDescription = techDLL + 1000;
	etech.LanguageDLLHelp = techDLL + 100000;
	etech.RequiredTechs.push_back(103);
	etech.RequiredTechs.push_back((int) (df->Techs.size() - 1));
	etech.RequiredTechCount = 2;
	etech.Civ = 99;
	etech.EffectID = (int) (df->Effects.size() - 1);
	df->Techs.push_back(etech);
	new_tech_ids.push_back((int) (df->Techs.size() - 1));

	//Make the new units data.json interpretable
	uu_tech_ids.push_back(new_tech_ids);

	//Add the new units to custom website classes
	unit_class[14].push_back(uuID);
	unit_class[14].push_back(eID);
}

//Set the attack and armor stats of a given unit
void setCombatStats (DatFile *df, int unitID, vector<vector<int>> attacks, vector<vector<int>> armors) {
	for (Civ &civ : df->Civs) {
		civ.Units[unitID].Type50.Attacks.clear();
		civ.Units[unitID].Type50.Armours.clear();

		bool hasArcherBonus = false;
		bool hasBuildingBonus1 = false;
		bool hasBuildingBonus2 = false;
		for (int i=0; i<attacks.size(); i++) {
			unit::AttackOrArmor attack = unit::AttackOrArmor();
			attack.Class = attacks[i][0];
			attack.Amount = attacks[i][1];
			civ.Units[unitID].Type50.Attacks.push_back(attack);
			if (attacks[i][0] == 3 || attacks[i][0] == 4 || attacks[i][0] == 31) {
				civ.Units[unitID].Type50.DisplayedAttack = attacks[i][1];
			}
			if (attacks[i][0] == 15) {
				hasArcherBonus = true;
			}
			if (attacks[i][0] == 11) {
				hasBuildingBonus1 = true;
			}
			if (attacks[i][0] == 21) {
				hasBuildingBonus2 = true;
			}
		}
		if (!hasArcherBonus) {
			unit::AttackOrArmor archerbonus = unit::AttackOrArmor();
			archerbonus.Class = 15;
			archerbonus.Amount = 0;
			civ.Units[unitID].Type50.Attacks.push_back(archerbonus);
		}
		if (!hasBuildingBonus1) {
			unit::AttackOrArmor buildingbonus1 = unit::AttackOrArmor();
			buildingbonus1.Class = 11;
			buildingbonus1.Amount = 0;
			civ.Units[unitID].Type50.Attacks.push_back(buildingbonus1);
		}
		if (!hasBuildingBonus2) {
			unit::AttackOrArmor buildingbonus2 = unit::AttackOrArmor();
			buildingbonus2.Class = 21;
			buildingbonus2.Amount = 0;
			civ.Units[unitID].Type50.Attacks.push_back(buildingbonus2);
		}

		bool hasLeitisArmor = false;
		for (int i=0; i<armors.size(); i++) {
			unit::AttackOrArmor armor = unit::AttackOrArmor();
			armor.Class = armors[i][0];
			armor.Amount = armors[i][1];
			civ.Units[unitID].Type50.Armours.push_back(armor);
			if (armors[i][0] == 3) {
				civ.Units[unitID].Creatable.DisplayedPierceArmour = armors[i][1];
			} else if (armors[i][0] == 4) {
				civ.Units[unitID].Type50.DisplayedMeleeArmour = armors[i][1];
			}
			if (armors[i][0] == 31) {
				hasLeitisArmor = true;
			}
		}
		if (!hasLeitisArmor) {
			unit::AttackOrArmor leitisarmor = unit::AttackOrArmor();
			leitisarmor.Class = 31;
			leitisarmor.Amount = 0;
			civ.Units[unitID].Type50.Armours.push_back(leitisarmor);
		}
	}
}

//Create a unique tech given parameters and an effect
//type 0 = castle age, type 1 = imperial age UT
void createUT (DatFile *df, Effect uteffect, int type, string name, vector<int> tech_costs, int techtime, int techDLL) {
	df->Effects.push_back(uteffect);
	Tech ut = Tech();
	ut.Name = name;
	ut.ResearchLocation = 82;
	ut.ResearchTime = techtime;
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
	for (int i=0; i<tech_costs.size(); i++) {
		if (tech_costs[i] != 0) {
			ut.ResourceCosts[writeIndex].Type = i;
			ut.ResourceCosts[writeIndex].Amount = tech_costs[i];
			ut.ResourceCosts[writeIndex].Flag = 1;
			writeIndex++;
		}
	}

	ut.LanguageDLLName = techDLL;
	ut.LanguageDLLDescription = techDLL + 1000;
	ut.LanguageDLLHelp = techDLL + 100000;

	ut.EffectID = (int) (df->Effects.size() - 1);
	df->Techs.push_back(ut);

	if (type == 0) {
		castle_ut_ids.push_back((int) (df->Techs.size() - 1));
	} else if (type == 1) {
		imp_ut_ids.push_back((int) (df->Techs.size() - 1));
	}
}

//Copy all building graphics from one civilization onto another
void copyArchitecture (DatFile *df, int copyFrom, int copyTo) {
	for (int i=0; i<df->Civs[copyFrom].Units.size(); i++) {
		if ((df->Civs[copyFrom].Units[i].Class == 3) || (df->Civs[copyFrom].Units[i].Class == 52) || (df->Civs[copyFrom].Units[i].Class == 27) || (df->Civs[copyFrom].Units[i].Class == 39)) {
			df->Civs[copyTo].Units[i].StandingGraphic = df->Civs[copyFrom].Units[i].StandingGraphic;
			df->Civs[copyTo].Units[i].DyingGraphic = df->Civs[copyFrom].Units[i].DyingGraphic;
			df->Civs[copyTo].Units[i].UndeadGraphic = df->Civs[copyFrom].Units[i].UndeadGraphic;
			df->Civs[copyTo].Units[i].DamageGraphics = df->Civs[copyFrom].Units[i].DamageGraphics;
			df->Civs[copyTo].Units[i].Building = df->Civs[copyFrom].Units[i].Building;
			df->Civs[copyTo].Units[i].Creatable.GarrisonGraphic = df->Civs[copyFrom].Units[i].Creatable.GarrisonGraphic;
		} else if ((df->Civs[copyFrom].Units[i].Class == 59) || (df->Civs[copyFrom].Units[i].Class == 18) || (df->Civs[copyFrom].Units[i].Class == 43) || (df->Civs[copyFrom].Units[i].Class == 19) || (df->Civs[copyFrom].Units[i].Class == 22)) {
			df->Civs[copyTo].Units[i].StandingGraphic = df->Civs[copyFrom].Units[i].StandingGraphic;
			df->Civs[copyTo].Units[i].DyingGraphic = df->Civs[copyFrom].Units[i].DyingGraphic;
			df->Civs[copyTo].Units[i].UndeadGraphic = df->Civs[copyFrom].Units[i].UndeadGraphic;
			df->Civs[copyTo].Units[i].DeadFish.WalkingGraphic = df->Civs[copyFrom].Units[i].DeadFish.WalkingGraphic;
			df->Civs[copyTo].Units[i].Type50.AttackGraphic = df->Civs[copyFrom].Units[i].Type50.AttackGraphic;
			if (df->Civs[copyFrom].Units[i].Class == 19) {
				for (int j=0; j<df->Civs[copyTo].Units[i].Bird.TaskList.size(); j++) {
					df->Civs[copyTo].Units[i].Bird.TaskList[j].CarryingGraphicID = df->Civs[copyFrom].Units[i].Bird.TaskList[j].CarryingGraphicID;
				}
			} else if (df->Civs[copyFrom].Units[i].Class == 18) {
				for (int j=0; j<df->Civs[copyTo].Units[i].Bird.TaskList.size(); j++) {
					df->Civs[copyTo].Units[i].Bird.TaskList[j].ProceedingGraphicID = df->Civs[copyFrom].Units[i].Bird.TaskList[j].ProceedingGraphicID;
				}
			}
		}
	}
	df->Civs[copyTo].IconSet = df->Civs[copyFrom].IconSet;
}

//Gives all units their original ID (which were changed from copying between entries)
void reassignIDs (DatFile *df) {
	for (Civ &civ : df->Civs) {
		for (int i=0; i<civ.Units.size(); i++) {
			civ.Units[i].ID = i;
			civ.Units[i].CopyID = i;
			civ.Units[i].BaseID = i;
			civ.Units[i].TelemetryID = i;
		}
	}
}

void createExplodingNothing (DatFile *df) {
	int originalUnitSize = df->Civs[0].Units.size();
	for (int i=0; i<originalUnitSize; i++) {
		if (df->Civs[0].Units[i].HitPoints == 0 || df->Civs[0].Units[i].DeadUnitID <= 0 || df->Civs[0].Units[i].Class == 3) {
			continue;
		}
		int rangeroll = rand() % 100;
		float maxrange = 0.5;
		if (rangeroll < 20) {
			maxrange = 1;
		} else if (rangeroll < 35) {
			maxrange = 2;
		} else if (rangeroll < 50) {
			maxrange = 3;
		} else if (rangeroll < 65) {
			maxrange = 4;
		} else if (rangeroll < 80) {
			maxrange = 5;
		} else if (rangeroll < 85) {
			maxrange = 6;
		} else if (rangeroll < 90) {
			maxrange = 7;
		} else if (rangeroll < 93) {
			maxrange = 8;
		} else if (rangeroll < 97) {
			maxrange = 9;
		} else if (rangeroll < 98) {
			maxrange = 12;
		} else {
			maxrange = 15;
		}
		int damageroll = rand() % 100;
		int damage = 25;
		if (damageroll < 10) {
			damage = 20;
		} else if (damageroll < 20) {
			damage = 25;
		} else if (damageroll < 30) {
			damage = 30;
		} else if (damageroll < 40) {
			damage = 40;
		} else if (damageroll < 60) {
			damage = 50;
		} else if (damageroll < 80) {
			damage = 75;
		} else if (damageroll < 90) {
			damage = 100;
		} else if (damageroll < 94) {
			damage = 150;
		} else if (damageroll < 95) {
			damage = 200;
		} else if (damageroll < 97) {
			damage = 500;
		} else {
			damage = 1500;
		}
		for (Civ &civ : df->Civs) {
			civ.Units.push_back(civ.Units[706]);
			civ.UnitPointers.push_back(1);
			civ.Units[(int) (civ.Units.size() - 1)].HitPoints = 0;
			civ.Units[(int) (civ.Units.size() - 1)].TrainSound = -1;
			civ.Units[(int) (civ.Units.size() - 1)].WwiseTrainSoundID = 0;
			civ.Units[(int) (civ.Units.size() - 1)].Type50.BlastAttackLevel = 2;
			civ.Units[(int) (civ.Units.size() - 1)].Type50.MaxRange = maxrange;
			civ.Units[(int) (civ.Units.size() - 1)].Type50.BlastWidth = maxrange;
			civ.Units[(int) (civ.Units.size() - 1)].Type50.Attacks[0].Amount = damage;
			civ.Units[(int) (civ.Units.size() - 1)].Type50.Attacks[1].Amount = damage * 2;
			civ.Units[(int) (civ.Units.size() - 1)].Type50.Attacks[2].Amount = 0;
			civ.Units[i].DeadUnitID = (int) (civ.Units.size() - 1);
		}
	}
}

void createBlindNothing (DatFile *df) {
	for (Civ &civ : df->Civs) {
		for (Unit &unit : civ.Units) {
			if (unit.LineOfSight > 1) {
				unit.LineOfSight = floor(unit.CollisionSize.x + 1);
			}
			if (unit.Bird.SearchRadius > 1) {
				unit.Bird.SearchRadius = floor(unit.CollisionSize.x + 1);
			}
		}
	}
	for (Effect &effect : df->Effects) {
		for (EffectCommand &ec : effect.EffectCommands) {
			if (ec.C == 1 || ec.C == 23) {
				if (ec.Type == 4) {
					ec.D = 0;
				} else if (ec.Type == 0 || ec.Type == 5) {
					ec.D = 1;
				}
			}
		}
	}
}

void configureCivs (DatFile *df, Value cfg) {
	if (cfg["random_costs"].asInt() == 69) {
		createExplodingNothing(df);
		return;
	}
	if (cfg["random_costs"].asInt() == 70) {
		createBlindNothing(df);
		return;
	}
	ofstream logfile;
	logfile.open("logs.txt");
	if (cfg["random_costs"].asInt() == 71) {
		srand(time(NULL));
		randomizeCosts(df, cfg, logfile);
		calculateTechDiscounts(df);
		df->Techs[148].EffectID = -1;
		df->Techs[180].EffectID = -1;
		return;
	}
	/*logfile << to_string(df->Effects[549].EffectCommands[5].D);
	logfile << "\n";*/
//	logfile << to_string(df->Civs[1].TeamBonusID);
//	logfile << "\n";
	clearCivs(df, cfg);
	createNewTechsBonuses(df, cfg);
	assignArchitectures(df, cfg);
//	assignLanguages(df, cfg, logfile);
	assignUniqueUnits(df, cfg, logfile);
	assignTechs(df, cfg, logfile);
	assignCivBonuses(df, cfg);
	assignTeamBonuses(df, cfg);
	duplicateUUEffects(df, cfg);
	reassignIDs(df);
	if (cfg["random_costs"].asInt() == 1) {
		srand(time(NULL));
		randomizeCosts(df, cfg, logfile);
	}
	calculateTechDiscounts(df);
	logfile.close();
}

//Algorithm for transforming one array to another when we can only copy from one index to another and have only one temp slot (gaia civ stores architectures)
//Abstracted version in javascript: https://github.com/Krakenmeister/CopyTransform
void assignArchitectures (DatFile *df, Value cfg) {
	vector<int> dest = {};
	for (int i=0; i<cfg["architecture"].size(); i++) {
		dest.push_back(cfg["architecture"][i].asInt());
	}
	while (dest.size() < 39) {
		dest.push_back(1);
	}
	//Save the architecture of one of each type for copying
	vector<int> rep_arch = {3, 1, 5, 8, 15, 7, 20, 22, 25, 28, 33};
	for (int i=0; i<dest.size(); i++) {
		if(find(rep_arch.begin(), rep_arch.end(), (i+1)) == rep_arch.end()) {
			copyArchitecture(df, rep_arch[dest[i]-1], (i+1));
		}
	}
	//Count how many other civs want to copy your architecture
	vector<int> dependencies = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
	for (int i=0; i<rep_arch.size(); i++) {
		for (int j=0; j<rep_arch.size(); j++) {
			if ((i != j) && (dest[rep_arch[j]-1] == (i+1))) {
				dependencies[i]++;
			}
		}
	}

	int cycleStart = -1;
	df->Civs[0].IconSet = -1;

	while (vectorSum(dependencies) > 0) {
		//Find the least dependent architecture that has yet to be copied to
		int minIndex = -1;
		for (int i=0; i<dependencies.size(); i++) {
			if (dest[rep_arch[i]-1] != df->Civs[rep_arch[i]].IconSet) {
				if (minIndex == -1) {
					minIndex = i;
				} else if (dependencies[i] < dependencies[minIndex]) {
					minIndex = i;
				}
			}
		}
		if (dependencies[minIndex] == 0) {
			if (df->Civs[0].IconSet == dest[rep_arch[minIndex]-1]) {
				//If this is the last in a cycle, copy from the temp slot
				copyArchitecture(df, 0, rep_arch[minIndex]);
				dependencies[cycleStart]--;
				cycleStart = -1;
				df->Civs[0].IconSet = -1;
			} else {
				//Copy without worries since there are no dependencies
				copyArchitecture(df, rep_arch[dest[rep_arch[minIndex]-1]-1], rep_arch[minIndex]);
				dependencies[dest[rep_arch[minIndex]-1]-1]--;
			}
		} else {
			//Only dependency-cycles remain, so copy info from first in cycle to temp slot
			copyArchitecture(df, rep_arch[minIndex], 0);
			copyArchitecture(df, rep_arch[dest[rep_arch[minIndex]-1]-1], rep_arch[minIndex]);
			dependencies[dest[rep_arch[minIndex]-1]-1]--;
			cycleStart = minIndex;
		}

	}

	df->Civs[0].IconSet = 2;
}

//Give civilizations the appropriate villager sfx files
//Obsolete (didn't work)
void assignLanguages (DatFile *df, Value cfg, ofstream& logfile) {
	//On the mmm, mayans don't have a v at all
	//On the 425 sound ID, celts prefix is at the end, and some don't have any at all
	//On 436, some don't have
	//On 487, some don't have
	//Some have 3 with probability 33, some have 4 with probability 25, some have 2 with probability 50
	//const vector<string> prefixes = {"b", "ff", "g", "te", "j", "c", "l", "f", "a", "t", "v", "m", "ga", "s", "z", "my", "hu", "kv", "it", "id", "in", "ma", "sla", "po", "et", "ml",
	//	"rb", "kh", "mly", "bu", "vn", "bg", "ta", "cu", "li", "brg", "si", "pl", "bo"};
	const vector<int> soundIDs = {295, 297, 298, 299, 300, 301, 302, 303, 420, 421, 422, 423, 424, 425, 434, 435, 436, 437, 438, 440, 441, 442, 443, 444, 448, 455, 487};
	//Copy language sound items of the civilization we want
	for (int i=0; i<cfg["language"].size(); i++) {
		for (int j=0; j<soundIDs.size(); j++) {
			int soundSize = df->Sounds[soundIDs[j]].Items.size();
			for (int k=0; k<soundSize; k++) {
				if ((df->Sounds[soundIDs[j]].Items[k].Civilization == (cfg["language"][i].asInt() + 1)) && (df->Sounds[soundIDs[j]].Items[k].Probability != 1)) {
					SoundItem copyItem = df->Sounds[soundIDs[j]].Items[k];
					copyItem.Probability = 1;
					copyItem.Civilization = i+1;
					df->Sounds[soundIDs[j]].Items.push_back(copyItem);
				}
			}
		}
	}
	logfile << "Checkpoint 2" << endl;
	//Delete the original sound items
	for (int i=0; i<soundIDs.size(); i++) {
		vector<int> itemCounts = {};
		vector<int> hasSeenCivBefore = {};
		for (int j=0; j<num_civs; j++) {
			itemCounts.push_back(0);
			hasSeenCivBefore.push_back(0);
		}
		for (int j=0; j<df->Sounds[soundIDs[i]].Items.size(); j++) {
			if ((df->Sounds[soundIDs[i]].Items[j].Probability != 1) && (df->Sounds[soundIDs[i]].Items[j].Civilization != 0)) {
//				df->Sounds[soundIDs[i]].Items[j].Probability = 0;
				df->Sounds[soundIDs[i]].Items.erase(df->Sounds[soundIDs[i]].Items.begin() + j);
				j--;
			} else if ((df->Sounds[soundIDs[i]].Items[j].Probability == 1) && (df->Sounds[soundIDs[i]].Items[j].Civilization != 0)) {
				itemCounts[df->Sounds[soundIDs[i]].Items[j].Civilization - 1]++;
			}
		}
		logfile << "Checkpoint 2.5" << endl;
		//Adjust copied sound items to their correct probabilities
		for (int j=0; j<df->Sounds[soundIDs[i]].Items.size(); j++) {
			if (df->Sounds[soundIDs[i]].Items[j].Probability != 0 && df->Sounds[soundIDs[i]].Items[j].Civilization != 0) {
				if (hasSeenCivBefore[df->Sounds[soundIDs[i]].Items[j].Civilization - 1] == 0) {
					df->Sounds[soundIDs[i]].Items[j].Probability = (int) ceil(100 / itemCounts[df->Sounds[soundIDs[i]].Items[j].Civilization - 1]);
					hasSeenCivBefore[df->Sounds[soundIDs[i]].Items[j].Civilization - 1] = 1;
				} else {
					df->Sounds[soundIDs[i]].Items[j].Probability = (int) floor(100 / itemCounts[df->Sounds[soundIDs[i]].Items[j].Civilization - 1]);
				}
			}
		}
		logfile << "Checkpoint 2.9999" << endl;
	}
	logfile << "Checkpoint 3" << endl;
}

void assignUniqueUnits (DatFile *df, Value cfg, ofstream &logfile) {
	for (int i=0; i<cfg["techtree"].size(); i++) {
		int unique_unit = cfg["techtree"][i][0].asInt();
		//Make unique unit available
		allocateTech(df, uu_tech_ids[unique_unit][0], i+1);
		//Give them elite upgrade
		allocateTech(df, uu_tech_ids[unique_unit][1], i+1);
	}
}

void clearCivs (DatFile *df, Value cfg) {
	//Deactivate all civ bonuses tied to techs
	for (Tech &tech : df->Techs) {
		if (tech.Civ != -1) {
			tech.Civ = 99;	//Setting civ = 99 is equivalent to making so that no civ gets it
		}
	}

	//Clear the vanilla tech trees of all effect commands
	for (int i=0; i<tech_tree_ids.size(); i++) {
		df->Effects[tech_tree_ids[i]].EffectCommands.clear();
	}
	//Khmer can't garrison in houses
	for (Civ &civ : df->Civs) {
		for (int k=0; k<houses.size(); k++) {
			civ.Units[k].Building.GarrisonType = 0;
		}
	}
	//Reorder Elite Konnik EffectCommands to not create weird bug
	EffectCommand etemp = df->Effects[715].EffectCommands[0];
	df->Effects[715].EffectCommands[0] = df->Effects[715].EffectCommands[1];
	df->Effects[715].EffectCommands[1] = etemp;
	//Delete the auto-upgrade in Castle Age effect (duplicateUUEffects will add this back if it is needed)
	for (int i=0; i<df->Effects[102].EffectCommands.size(); i++) {
		if (df->Effects[102].EffectCommands[i].A == 1660) {
			df->Effects[102].EffectCommands.erase(df->Effects[102].EffectCommands.begin() + i);
			i--;
		}
	}
}

void createNewTechsBonuses (DatFile *df, Value cfg) {
		//New Unique Units
	//Crusader Knights
	createUU(df, 1723, "Crusader Knight", {600, 0, 0, 1200}, 45, 7604);
	int uuID = (int) (df->Civs[0].Units.size() - 2);
	int eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[7].push_back(uuID);
	unit_class[7].push_back(eID);
	for (Civ &civ : df->Civs) {
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
	}
	//Xolotl Warriors
	createUU(df, 1570, "Xolotl Warrior", {800, 0, 0, 800}, 60, 7605);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[7].push_back(uuID);
	unit_class[7].push_back(eID);
	for (Civ &civ : df->Civs) {
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
	//Saboteur
	createUU(df, 706, "Saboteur", {0, 600, 600, 0}, 40, 7606);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[12].push_back(uuID);
	unit_class[12].push_back(eID);
	for (Civ &civ : df->Civs) {
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
	//Ninja
	createUU(df, 1145, "Ninja", {0, 500, 0, 600}, 100, 7607);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	int ninjaID = uuID;
	for (Civ &civ : df->Civs) {
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
	//Flamethrower
	createUU(df, 188, "Flamethrower", {0, 1000, 0, 1000}, 75, 7608);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[9].push_back(uuID);
	unit_class[9].push_back(eID);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {0, 150, 0, 25});
	//Photonman
	createUU(df, 1577, "Photonman", {1000, 0, 0, 1000}, 120, 7609);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	for (Civ &civ : df->Civs) {
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
	copyEffectstoUnits(df, {{563, 0, 1, 2}}, {uuID, eID});
	//Centurion
	createUU(df, 275, "Centurion", {900, 0, 0, 800}, 50, 7610);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[7].push_back(uuID);
	unit_class[7].push_back(eID);
	for (Civ &civ : df->Civs) {
		civ.Units[eID].Name = "ECENTU";
		civ.Units[eID].LanguageDLLName = 5803;
		civ.Units[eID].LanguageDLLCreation = 6803;
		civ.Units[eID].LanguageDLLHelp = 105803;
		civ.Units[uuID].Type50.Armours[0].Amount = 3;
		civ.Units[uuID].Type50.Armours[2].Amount = 3;
		civ.Units[uuID].Type50.DisplayedMeleeArmour = 3;
		civ.Units[uuID].Creatable.DisplayedPierceArmour = 3;
		civ.Units[uuID].Type50.Armours[1].Amount = 4;
		civ.Units[uuID].Type50.Armours[1].Amount = 4;
		civ.Units[uuID].Type50.Attacks[0].Amount = 4;
		civ.Units[uuID].Type50.Attacks[1].Amount = 10;
		civ.Units[uuID].Type50.Attacks[4].Amount = 4;
		civ.Units[uuID].Type50.DisplayedAttack = 10;
		civ.Units[eID].Type50.Armours[0].Amount = 4;
		civ.Units[eID].Type50.Armours[2].Amount = 6;
		civ.Units[eID].Type50.DisplayedMeleeArmour = 4;
		civ.Units[eID].Creatable.DisplayedPierceArmour = 6;
		civ.Units[eID].Type50.Armours[1].Amount = 4;
		civ.Units[eID].Type50.Armours[1].Amount = 4;
		civ.Units[eID].Type50.Attacks[0].Amount = 4;
		civ.Units[eID].Type50.Attacks[1].Amount = 12;
		civ.Units[eID].Type50.Attacks[4].Amount = 4;
		civ.Units[eID].Type50.DisplayedAttack = 12;
		civ.Units[uuID].HitPoints = 100;
		civ.Units[eID].HitPoints = 140;
		civ.Units[uuID].Speed = 1.25;
		civ.Units[eID].Speed = 1.25;
	}
	//Legionary
	createUU(df, 1, "Legionary", {600, 0, 0, 500}, 45, 7611);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	for (Civ &civ : df->Civs) {
		civ.Units[eID].Name = "ELEGION";
		civ.Units[eID].LanguageDLLName = 5804;
		civ.Units[eID].LanguageDLLCreation = 6804;
		civ.Units[eID].LanguageDLLHelp = 105804;
		civ.Units[uuID].Creatable.ResourceCosts[0].Amount = 80;
		civ.Units[eID].Creatable.ResourceCosts[0].Amount = 80;
		civ.Units[uuID].Type50.Armours[2].Amount = 4;
		civ.Units[uuID].Creatable.DisplayedPierceArmour = 4;
		civ.Units[eID].Type50.Armours[2].Amount = 5;
		civ.Units[eID].Type50.Armours[1].Amount = 4;
		civ.Units[eID].Creatable.DisplayedPierceArmour = 5;
		civ.Units[eID].Type50.DisplayedMeleeArmour = 4;
		civ.Units[uuID].HitPoints = 70;
		civ.Units[eID].HitPoints = 80;
		civ.Units[uuID].Speed = 0.9;
		civ.Units[eID].Speed = 0.9;
		civ.Units[uuID].Type50.Attacks[3].Amount = 9;
		civ.Units[uuID].Type50.DisplayedAttack = 9;
		civ.Units[eID].Type50.Attacks[3].Amount = 13;
		civ.Units[eID].Type50.DisplayedAttack = 13;
		civ.Units[eID].Type50.Attacks[1].Amount = 4;
	}
	//Monkey Boy
	createUU(df, 860, "Monkey Boy", {2000, 0, 0, 0}, 60, 7612);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	for (Civ &civ : df->Civs) {
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
	//Amazon Warrior
	createUU(df, 825, "Amazon Warrior", {600, 0, 0, 1000}, 70, 7613);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	for (Civ &civ : df->Civs) {
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
	//Amazon Archer
	createUU(df, 850, "Amazon Archer", {600, 0, 0, 400}, 60, 7614);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[6].push_back(uuID);
	unit_class[6].push_back(eID);
	for (Civ &civ : df->Civs) {
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
	//Iroquois Warrior
	createUU(df, 1374, "Iroquois Warrior", {800, 0, 0, 700}, 70, 7615);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	for (Civ &civ : df->Civs) {
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
	//Varangian Guard
	createUU(df, 1681, "Varangian Guard", {900, 0, 0, 900}, 90, 7616);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[7].push_back(uuID);
	unit_class[7].push_back(eID);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {95, 0, 0, 55});
	//Gendarme
	createUU(df, 1281, "Gendarme", {1000, 0, 0, 850}, 110, 7617);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[7].push_back(uuID);
	unit_class[7].push_back(eID);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {95, 0, 0, 85});
	setCombatStats(df, uuID, {{4, 10}}, {{3, 5}, {4, 5}, {8, 0}, {19, 0}});
	setCombatStats(df, eID, {{4, 13}}, {{3, 7}, {4, 7}, {8, 0}, {19, 0}});
	//Cuahchiqueh
	createUU(df, 1067, "Cuahchiqueh", {600, 0, 0, 900}, 60, 7618);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {40, 0, 0, 80});
	setCombatStats(df, uuID, {{29, 5}, {21, 1}, {1, 5}, {4, 6}, {8, 0}}, {{4, 2}, {3, -1}, {19, 0}});
	setCombatStats(df, eID, {{29, 7}, {21, 1}, {1, 5}, {4, 8}, {8, 0}}, {{4, 3}, {3, -1}, {19, 0}});
	//Ritterbruder
	createUU(df, 1727, "Ritterbruder", {850, 0, 0, 850}, 60, 7619);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[7].push_back(uuID);
	unit_class[7].push_back(eID);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {80, 0, 0, 75});
	setCombatStats(df, uuID, {{4, 11}}, {{3, 1}, {4, 6}, {8, 0}, {19, 0}});
	setCombatStats(df, eID, {{4, 13}}, {{3, 2}, {4, 11}, {8, 0}, {19, 0}});
	//Kazak
	createUU(df, 1269, "Kazak", {0, 1100, 0, 500}, 70, 7620);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[7].push_back(uuID);
	unit_class[7].push_back(eID);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {0, 90, 0, 40});
	setCombatStats(df, uuID, {{27, 2}, {3, 6}, {21, 3}}, {{28, 0}, {4, 1}, {3, 0}, {15, 0}, {8, 0}, {19, 0}});
	setCombatStats(df, eID, {{27, 2}, {3, 8}, {21, 5}}, {{28, 0}, {4, 2}, {3, 0}, {15, 0}, {8, 0}, {19, 0}});
	//Szlachcic
	createUU(df, 1721, "Szlachcic", {750, 0, 0, 650}, 60, 7621);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[7].push_back(uuID);
	unit_class[7].push_back(eID);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {80, 0, 0, 50});
	setCombatStats(df, uuID, {{4, 10}}, {{4, 4}, {3, 3}, {8, 0}, {19, 0}});
	setCombatStats(df, eID, {{4, 12}}, {{4, 5}, {3, 4}, {8, 0}, {19, 0}});
	//Cuirassier
	createUU(df, 1186, "Cuirassier", {650, 0, 0, 800}, 60, 7622);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[7].push_back(uuID);
	unit_class[7].push_back(eID);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {70, 0, 0, 25});
	setCombatStats(df, uuID, {{4, 14}, {10, 14}}, {{4, -2}, {3, 2}, {8, 0}, {19, 0}});
	setCombatStats(df, eID, {{4, 16}, {10, 16}, {23, 12}}, {{4, -2}, {3, 4}, {8, 0}, {19, 0}});
	//Rajput
	createUU(df, 1184, "Rajput", {750, 0, 0, 750}, 55, 7623);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[7].push_back(uuID);
	unit_class[7].push_back(eID);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {70, 0, 0, 70});
	setCombatStats(df, uuID, {{4, 9}, {15, 9}, {28, 5}}, {{4, 0}, {3, 1}, {8, 0}, {19, 0}});
	setCombatStats(df, eID, {{4, 12}, {15, 18}, {28, 5}}, {{4, 0}, {3, 2}, {8, 0}, {19, 0}});
	//Seljuk Archer
	createUU(df, 943, "Seljuk Archer", {0, 800, 0, 700}, 65, 7624);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[7].push_back(uuID);
	unit_class[7].push_back(eID);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {0, 60, 0, 55});
	setCombatStats(df, uuID, {{3, 7}}, {{28, 0}, {4, -2}, {3, 0}, {15, 0}, {8, 0}, {19, 0}});
	setCombatStats(df, eID, {{3, 9}}, {{28, 0}, {4, -2}, {3, 1}, {15, 0}, {8, 0}, {19, 0}});
	//Numidian Javelinman
	createUU(df, 1036, "Numidian Javelinman", {0, 600, 0, 400}, 45, 7625);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[7].push_back(uuID);
	unit_class[7].push_back(eID);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {0, 80, 0, 30});
	setCombatStats(df, uuID, {{3, 5}, {28, 5}, {15, 3}}, {{4, 0}, {15, 1}, {8, -1}, {3, 1}, {19, 0}});
	setCombatStats(df, eID, {{3, 6}, {28, 8}, {15, 5}}, {{4, 0}, {15, 1}, {8, -1}, {3, 1}, {19, 0}});
	//Sosso Guard
	createUU(df, 1574, "Sosso Guard", {1000, 0, 0, 700}, 65, 7626);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {55, 0, 0, 45});
	setCombatStats(df, uuID, {{4, 6}, {8, 7}, {5, 25}, {30, 2}}, {{1, 0}, {4, 0}, {3, 1}, {19, 0}});
	setCombatStats(df, eID, {{4, 7}, {8, 11}, {5, 50}, {30, 4}}, {{1, 0}, {4, 0}, {3, 2}, {19, 0}});
	//Swiss Pikeman
	createUU(df, 892, "Swiss Pikeman", {600, 0, 0, 1200}, 45, 7627);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {40, 0, 0, 50});
	setCombatStats(df, uuID, {{4, 5}, {8, 25}, {5, 20}}, {{1, 0}, {3, 0}, {4, 0}, {27, 0}, {19, 0}});
	setCombatStats(df, eID, {{4, 6}, {8, 60}, {5, 25}}, {{1, 0}, {3, 0}, {4, 0}, {27, 0}, {19, 0}});
	//Headhunter
	createUU(df, 1673, "Headhunter", {400, 0, 0, 300}, 50, 7628);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[7].push_back(uuID);
	unit_class[7].push_back(eID);
	Task kidnapTask = Task();
	kidnapTask.ActionType = 135;
	kidnapTask.ClassID = 4;
	kidnapTask.WorkRange = 0.25;
	kidnapTask.TargetDiplomacy = 2;
	kidnapTask.GatherType = 2;
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {0, 0, 0, 75});
	setCombatStats(df, uuID, {{4, 7}, {10, 30}}, {{4, 1}, {3, 0}, {8, 0}, {19, 0}});
	setCombatStats(df, eID, {{4, 8}, {10, 40}}, {{4, 1}, {3, 0}, {8, 0}, {19, 0}});
	//Teulu
	createUU(df, 1683, "Teulu", {600, 0, 0, 550}, 45, 7629);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {65, 0, 0, 40});
	setCombatStats(df, uuID, {{4, 10}}, {{1, 0}, {4, 0}, {3, 1}, {19, 0}});
	setCombatStats(df, eID, {{4, 12}}, {{1, 0}, {4, 0}, {3, 1}, {19, 0}});
	//Maillotins
	createUU(df, 1685, "Maillotins", {950, 0, 0, 250}, 35, 7630);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {90, 0, 0, 10});
	setCombatStats(df, uuID, {{4, 20}}, {{1, 0}, {4, 3}, {3, 0}, {19, 0}});
	setCombatStats(df, eID, {{4, 27}}, {{1, 0}, {4, 3}, {3, 0}, {19, 0}});
	//Hashashin
	createUU(df, 1035, "Hashashin", {500, 0, 0, 1250}, 60, 7631);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[7].push_back(uuID);
	unit_class[7].push_back(eID);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {30, 0, 0, 85});
	setCombatStats(df, uuID, {{4, 12}, {19, 8}, {36, 25}}, {{4, 0}, {3, 0}, {8, 0}, {19, 0}});
	setCombatStats(df, eID, {{4, 14}, {19, 12}, {36, 50}}, {{4, 0}, {3, 1}, {8, 0}, {19, 0}});
	//Zweihander
	createUU(df, 453, "Zweihander", {850, 0, 0, 700}, 65, 7632);
 	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	for (Civ &civ : df->Civs) {
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
	setCombatStats(df, uuID, {{4, 9}, {1, 4}, {29, 10}}, {{4, 1}, {3, 1}, {1, 0}, {19, 0}});
	setCombatStats(df, eID, {{4, 12}, {1, 10}, {29, 10}}, {{4, 1}, {3, 1}, {1, 0}, {19, 0}});
	//Stradiot
	createUU(df, 1677, "Stradiot", {800, 0, 0, 850}, 65, 7633);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[7].push_back(uuID);
	unit_class[7].push_back(eID);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {75, 0, 0, 30});
	setCombatStats(df, uuID, {{4, 9}, {8, 4}}, {{8, 0}, {4, 0}, {3, 1}, {19, 0}});
	setCombatStats(df, eID, {{4, 12}, {8, 8}}, {{8, 0}, {4, 1}, {3, 2}, {19, 0}});
	//Ahosi
	createUU(df, 1066, "Ahosi", {750, 0, 0, 650}, 60, 7634);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	for (Civ &civ : df->Civs) {
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
	setCombatStats(df, uuID, {{3, 12}}, {{1, 0}, {4, 0}, {3, 0}, {19, 0}});
	setCombatStats(df, eID, {{3, 15}}, {{1, 0}, {4, 0}, {3, 0}, {19, 0}});
	int ahosiID = uuID;
	//Spadoni
	createUU(df, 439, "Spadoni", {850, 0, 0, 650}, 60, 7635);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	for (Civ &civ : df->Civs) {
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
	setCombatStats(df, uuID, {{4, 12}, {23, 12}, {21, 2}}, {{1, 3}, {4, 1}, {3, 0}, {19, 0}});
	setCombatStats(df, eID, {{4, 14}, {23, 14}, {21, 2}}, {{1, 3}, {4, 1}, {3, 0}, {19, 0}});
	//Clibinarii
	createUU(df, 932, "Clibinarii", {950, 0, 0, 850}, 65, 7636);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[7].push_back(uuID);
	unit_class[7].push_back(eID);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {90, 0, 0, 70});
	setCombatStats(df, uuID, {{4, 12}, {15, 12}}, {{8, 0}, {3, 3}, {4, 1}, {19, 0}});
	setCombatStats(df, eID, {{4, 14}, {15, 14}}, {{8, 0}, {3, 5}, {4, 1}, {19, 0}});
	//Silahtar
	createUU(df, 1267, "Silahtar", {0, 1100, 0, 650}, 75, 7637);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[7].push_back(uuID);
	unit_class[7].push_back(eID);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {0, 40, 0, 70});
	setCombatStats(df, uuID, {{3, 6}, {1, 3}}, {{28, 1}, {15, 1}, {8, 0}, {19, 0}, {4, 1}, {3, 1}});
	setCombatStats(df, eID, {{3, 8}, {1, 8}}, {{28, 2}, {15, 2}, {8, 0}, {19, 0}, {4, 2}, {3, 4}});
	//Jaridah
	createUU(df, 777, "Jaridah", {900, 0, 0, 450}, 60, 7638);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[7].push_back(uuID);
	unit_class[7].push_back(eID);
	for (Civ &civ : df->Civs) {
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
	setCombatStats(df, uuID, {{4, 11}, {10, 10}}, {{4, 1}, {3, 0}, {8, 12}, {19, 0}});
	setCombatStats(df, eID, {{4, 13}, {10, 20}}, {{4, 1}, {3, 0}, {8, 16}, {19, 0}});
	//Wolf Warrior
	createUU(df, 702, "Wolf Warrior", {800, 0, 0, 700}, 65, 7639);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[7].push_back(uuID);
	unit_class[7].push_back(eID);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {85, 0, 0, 50});
	setCombatStats(df, uuID, {{4, 13}}, {{4, 3}, {3, 0}, {8, 0}, {19, 0}});
	setCombatStats(df, eID, {{4, 13}}, {{4, 3}, {3, 0}, {8, 0}, {19, 0}});
	//Warrior Monk
	createUU(df, 1178, "Warrior Monk", {800, 0, 0, 750}, 80, 7640);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {0, 0, 0, 100});
	setCombatStats(df, uuID, {{4, 11}, {25, 0}, {20, 0}}, {{4, 0}, {3, 999}, {25, 0}, {19, 0}});
	setCombatStats(df, eID, {{4, 14}, {25, 0}, {20, 0}}, {{4, 0}, {3, 999}, {25, 0}, {19, 0}});
	int warmonkID = uuID;
	//Castellan
	createUU(df, 1718, "Castellan", {700, 0, 0, 900}, 75, 7641);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	unit_class[7].push_back(uuID);
	unit_class[7].push_back(eID);
	setUnitCosts(df, {uuID, eID}, {65, 0, 0, 90});
	setCombatStats(df, uuID, {{4, 13}}, {{4, 0}, {3, 0}, {8, 0}, {19, 0}, {36, 0}});
	setCombatStats(df, eID, {{4, 16}}, {{4, 0}, {3, 0}, {8, 0}, {19, 0}, {36, 0}});
	for (Civ &civ : df->Civs) {
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
	//Lightning Warrior
	createUU(df, 749, "Lightning Warrior", {600, 0, 0, 900}, 65, 7642);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {55, 0, 0, 35});
	setCombatStats(df, uuID, {{4, 8}, {15, 8}}, {{1, 0}, {4, 0}, {3, 1}, {19, 0}});
	setCombatStats(df, eID, {{4, 10}, {15, 10}}, {{1, 0}, {4, 0}, {3, 2}, {19, 0}});
	//Apukispay
	createUU(df, 1074, "Apukispay", {800, 0, 0, 900}, 70, 7643);
	uuID = (int) (df->Civs[0].Units.size() - 2);
	eID = (int) (df->Civs[0].Units.size() - 1);
	for (Civ &civ : df->Civs) {
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
	setUnitCosts(df, {uuID, eID}, {50, 0, 0, 85});
	setCombatStats(df, uuID, {{4, 10}}, {{4, 1}, {3, 0}, {19, 0}});
	setCombatStats(df, eID, {{4, 14}}, {{4, 2}, {3, 0}, {19, 0}});

		//Create new unique techs
	//Deconstruction
	Effect e = Effect();
	e.Name = "Deconstruction";
	for (int i=0; i<unit_class[9].size(); i++) {
		e.EffectCommands.push_back(createEC(4, unit_class[9][i], -1, 9, amountTypetoD(30, 11)));
	}
	createUT(df, e, 0, "Deconstruction", {0, 300, 0, 200}, 40, 7500);
	//Obsidian Arrows
	e.EffectCommands.clear();
	e.Name = "Obsidian Arrows";
	e.EffectCommands.push_back(createEC(4, -1, 0, 9, amountTypetoD(6, 21)));
	createUT(df, e, 0, "Obsidian Arrows", {300, 0, 0, 300}, 40, 7501);
	//Tortoise Engineers
	e.EffectCommands.clear();
	e.Name = "Tortoise Engineers";
	for (int i=0; i<rams.size(); i++) {
		e.EffectCommands.push_back(createEC(5, rams[i], -1, 101, 0.5));
	}
	createUT(df, e, 0, "Tortoise Engineers", {0, 100, 0, 200}, 30, 7502);
	//Lamellar Armour
	e.EffectCommands.clear();
	e.Name = "Lamellar Armour";
	e.EffectCommands.push_back(createEC(4, -1, 36, 8, amountTypetoD(2, 4)));
	e.EffectCommands.push_back(createEC(4, -1, 36, 8, amountTypetoD(1, 3)));
	for (int i=0; i<unit_class[8].size(); i++) {
		e.EffectCommands.push_back(createEC(4, unit_class[8][i], -1, 8, amountTypetoD(2, 4)));
		e.EffectCommands.push_back(createEC(4, unit_class[8][i], -1, 8, amountTypetoD(1, 3)));
	}
	createUT(df, e, 1, "Lamellar Armour", {0, 500, 0, 500}, 40, 7503);
	//Field Repairmen
	e.EffectCommands.clear();
	e.Name = "Field Repairmen";
	for (int i=0; i<rams.size(); i++) {
		e.EffectCommands.push_back(createEC(4, rams[i], -1, 109, 20));
	}
	createUT(df, e, 1, "Field Repairmen", {0, 350, 0, 650}, 80, 7504);
	//Golden Age
	e.EffectCommands.clear();
	e.Name = "Golden Age";
	e.EffectCommands.push_back(createEC(5, -1, 3, 13, 1.1));
	createUT(df, e, 1, "Golden Age", {0, 0, 300, 600}, 90, 7505);

	//Villager's Revenge
	e.EffectCommands.clear();
	e.Name = "Villager's Revenge";
	//Create villager spear units
	for (Civ &civ : df->Civs) {
		civ.Units.push_back(civ.Units[93]);
		civ.UnitPointers.push_back(1);
		vilspear = (int) (civ.Units.size() - 1);

		civ.Units.push_back(civ.Units[358]);
		civ.UnitPointers.push_back(1);
		vilpike = (int) (civ.Units.size() - 1);

		civ.Units.push_back(civ.Units[359]);
		civ.UnitPointers.push_back(1);
		vilhalb = (int) (civ.Units.size() - 1);

		civ.Units[vilspear].Name = "VILPKEMN";
		civ.Units[vilpike].Name = "VILPKM";
		civ.Units[vilhalb].Name = "VILHLBDM";

		civ.Units[vilspear].HitPoints = -1;
		civ.Units[vilpike].HitPoints = -1;
		civ.Units[vilhalb].HitPoints = -1;

		civ.Units[vilspear].DeadUnitID = -1;
		civ.Units[vilpike].DeadUnitID = -1;
		civ.Units[vilhalb].DeadUnitID = -1;
	}
	df->Effects[190].EffectCommands.push_back(createEC(3, vilspear, vilpike, -1, 0));
	df->Effects[189].EffectCommands.push_back(createEC(3, vilspear, vilhalb, -1, 0));
	df->Effects[189].EffectCommands.push_back(createEC(3, vilpike, vilhalb, -1, 0));

	e.EffectCommands.push_back(createEC(0, vilspear, -1, 0, 45));
	e.EffectCommands.push_back(createEC(0, vilpike, -1, 0, 55));
	e.EffectCommands.push_back(createEC(0, vilhalb, -1, 0, 60));
	createUT(df, e, 1, "Villager's Revenge", {500, 0, 0, 250}, 40, 7506);
	//Panoply
	e.EffectCommands.clear();
	e.Name = "Panoply";
	e.EffectCommands.push_back(createEC(4, -1, 6, 8, amountTypetoD(1, 3)));
	e.EffectCommands.push_back(createEC(4, -1, 6, 8, amountTypetoD(1, 4)));
	e.EffectCommands.push_back(createEC(4, -1, 6, 9, amountTypetoD(1, 4)));
	createUT(df, e, 0, "Panoply", {300, 0, 0, 200}, 50, 7507);
	//Clout Archery
	e.EffectCommands.clear();
	e.Name = "Clout Archery";
	e.EffectCommands.push_back(createEC(5, 87, -1, 13, 1.5));
	e.EffectCommands.push_back(createEC(5, 10, -1, 13, 1.5));
	e.EffectCommands.push_back(createEC(5, 14, -1, 13, 1.5));
	createUT(df, e, 0, "Clout Archery", {0, 150, 0, 250}, 40, 7508);
	//Gate Crashing
	e.EffectCommands.clear();
	e.Name = "Gate Crashing";
	for (int i=0; i<rams.size(); i++) {
		e.EffectCommands.push_back(createEC(0, rams[i], -1, 105, 0));
		e.EffectCommands.push_back(createEC(4, rams[i], -1, 104, 75));
	}
	createUT(df, e, 1, "Gate Crashing", {0, 600, 0, 700}, 60, 7509);

		//Modify existing effects
	//Give special barracks, archery range, stable, and siege workshop units the effects they deserve
	EffectCommand melee_armor_1 = createEC(4, -1, -1, 8, amountTypetoD(1, 4));
	EffectCommand pierce_armor_1 = createEC(4, -1, -1, 8, amountTypetoD(1, 3));
	EffectCommand pierce_armor_2 = createEC(4, -1, -1, 8, amountTypetoD(2, 3));
	EffectCommand hp_120 = createEC(5, -1, -1, 0, 1.2);
	EffectCommand cost_85 = createEC(5, -1, -1, 100, 0.85);
	EffectCommand cost_80_compound = createEC(5, -1, -1, 100, 0.941176);
	EffectCommand hp_140 = createEC(5, -1, -1, 0, 1.4);
	vector<int> custom_unit_class = unit_class[0];
	custom_unit_class.insert(custom_unit_class.end(), unit_class[1].begin(), unit_class[1].end());	//Barracks + Stable units
	giveEffectstoClass(df, 333, {melee_armor_1}, custom_unit_class);
	giveEffectstoClass(df, 334, {melee_armor_1}, custom_unit_class);
	giveEffectstoClass(df, 618, {pierce_armor_1}, unit_class[0]);
	giveEffectstoClass(df, 619, {pierce_armor_1}, unit_class[0]);
	giveEffectstoClass(df, 620, {pierce_armor_1}, unit_class[0]);
	giveEffectstoClass(df, 560, {pierce_armor_1}, unit_class[1]);
	giveEffectstoClass(df, 584, {pierce_armor_1}, unit_class[1]);
	giveEffectstoClass(df, 610, {cost_85}, unit_class[1]);
	giveEffectstoClass(df, 638, {cost_80_compound}, unit_class[1]);
	giveEffectstoClass(df, 672, {hp_120}, unit_class[2]);
	giveEffectstoClass(df, 567, {cost_85}, unit_class[3]);
	giveEffectstoClass(df, 239, {hp_140}, unit_class[3]);
	//Make champion upgrade free with the civ bonus
	copyEffectstoUnits(df, {{730, 0, 1, 6}}, {264});
	//Make Byz trash effect apply to imp camel
	copyEffectstoUnits(df, {{283, 0}}, {207});
	//Give all gunpowder the gunpowder bonuses
	EffectCommand hp_25 = createEC(5, -1, -1, 0, 1.25);
	EffectCommand cost_80 = createEC(5, -1, -1, 100, 0.8);
	vector<EffectCommand> attack_25 = {createEC(5, -1, -1, 9, amountTypetoD(125, 1)), createEC(5, -1, -1, 9, amountTypetoD(125, 3)), createEC(5, -1, -1, 9, amountTypetoD(125, 11)), createEC(5, -1, -1, 9, amountTypetoD(125, 4))};
	giveEffectstoClass(df, 296, {hp_25}, unit_class[5]);
	giveEffectstoClass(df, 555, {cost_80}, unit_class[5]);
	giveEffectstoClass(df, 794, attack_25, unit_class[5]);
	//Make drill affect all siege units
	EffectCommand speed_50 = createEC(5, -1, -1, 5, 1.5);
	giveEffectstoClass(df, 457, {speed_50}, unit_class[9]);
	//Make celt bonus affect all siege units
	EffectCommand reload_80 = createEC(5, -1, -1, 10, 0.8);
	giveEffectstoClass(df, 385, {reload_80}, unit_class[9]);
	//Make ironclad affect all siege units
	EffectCommand melee_armor_4 = createEC(4, -1, -1, 8, amountTypetoD(4, 4));
	giveEffectstoClass(df, 544, {melee_armor_4}, unit_class[9]);
	//Make frank and cuman bonuses affect mounted units
	EffectCommand speed_5 = createEC(5, -1, -1, 5, 1.05);
	EffectCommand hp_115 = createEC(5, -1, -1, 0, 1.2);
	giveEffectstoClass(df, 285, {hp_115}, unit_class[7]);
	giveEffectstoClass(df, 748, {speed_5}, unit_class[7]);
	giveEffectstoClass(df, 762, {speed_5}, unit_class[7]);
	giveEffectstoClass(df, 763, {speed_5}, unit_class[7]);
	//Give camel effects to camel class
	EffectCommand hp_10 = createEC(4, -1, -1, 0, 10);
	EffectCommand hp_20 = createEC(4, -1, -1, 0, 20);
	EffectCommand regen = createEC(4, -1, -1, 109, 15);
	giveEffectstoClass(df, 312, {hp_10}, unit_class[8]);
	giveEffectstoClass(df, 459, {hp_20}, unit_class[8]);
	giveEffectstoClass(df, 608, {regen}, unit_class[8]);
	//Give elephant bonuses to all elephants
	EffectCommand hp_50 = createEC(4, -1, -1, 0, 50);
	EffectCommand speed_30 = createEC(5, -1, -1, 5, 1.3);
	EffectCommand speed_10 = createEC(5, -1, -1, 5, 1.1);
	EffectCommand cost_70 = createEC(5, -1, -1, 100, 0.7);
	EffectCommand cost_60_compound = createEC(5, -1, -1, 100, 0.85714);
	giveEffectstoClass(df, 668, {hp_50}, unit_class[4]);
	giveEffectstoClass(df, 666, {melee_armor_1}, unit_class[4]);
	giveEffectstoClass(df, 666, {pierce_armor_2}, unit_class[4]);
	giveEffectstoClass(df, 458, {speed_30}, unit_class[4]);
	giveEffectstoClass(df, 703, {speed_10}, unit_class[4]);
	giveEffectstoClass(df, 695, {cost_70}, unit_class[4]);
	giveEffectstoClass(df, 696, {cost_60_compound}, unit_class[4]);
	df->Effects[662].EffectCommands.clear();
	addAttacktoUnits(df, 662, 3, unit_class[4]);
	//Do stuff with foot archers
	EffectCommand reload_85 = createEC(5, -1, -1, 10, 0.85);
	EffectCommand range_1 = createEC(4, -1, -1, 12, 1);
	EffectCommand los_1 = createEC(4, -1, -1, 1, 1);
	EffectCommand search_1 = createEC(4, -1, -1, 23, 1);
	custom_unit_class = unit_class[6];
	custom_unit_class.erase(remove(custom_unit_class.begin(), custom_unit_class.end(), 6), custom_unit_class.end());
	custom_unit_class.erase(remove(custom_unit_class.begin(), custom_unit_class.end(), 7), custom_unit_class.end());
	custom_unit_class.erase(remove(custom_unit_class.begin(), custom_unit_class.end(), 1155), custom_unit_class.end());
	giveEffectstoClass(df, 612, {reload_85}, unit_class[6]);
	giveEffectstoClass(df, 380, {range_1, los_1, search_1}, custom_unit_class);
	giveEffectstoClass(df, 415, {range_1, los_1, search_1}, custom_unit_class);
	//Yeomen is annoying
	EffectCommand command1 = df->Effects[455].EffectCommands[3];
	EffectCommand command2 = df->Effects[455].EffectCommands[4];
	EffectCommand command3 = df->Effects[455].EffectCommands[5];
	giveEffectstoClass(df, 455, {range_1, los_1, search_1}, unit_class[6]);
	df->Effects[455].EffectCommands.push_back(command1);
	df->Effects[455].EffectCommands.push_back(command2);
	df->Effects[455].EffectCommands.push_back(command3);
	//Make vanilla steppe effects affect royal lancer
	df->Effects[387].EffectCommands.push_back(createEC(5, 1181, -1, 0, 1.3));
	df->Effects[724].EffectCommands.push_back(createEC(4, 1181, -1, 8, amountTypetoD(1, 3)));
	df->Effects[724].EffectCommands.push_back(createEC(4, 1181, -1, 8, amountTypetoD(1, 4)));
	df->Effects[726].EffectCommands.push_back(createEC(5, 1181, -1, 101, 0.5));
	//Make vanilla spear effects affect TC spearmen
	custom_unit_class = {1182, 1183, 1184, vilspear, vilpike, vilhalb};
	for (int i=0; i<custom_unit_class.size(); i++) {
		df->Effects[745].EffectCommands.push_back(createEC(5, custom_unit_class[i], -1, 5, 1.1));
		df->Effects[283].EffectCommands.push_back(createEC(5, custom_unit_class[i], -1, 100, 0.75));
		df->Effects[729].EffectCommands.push_back(createEC(4, custom_unit_class[i], -1, 8, amountTypetoD(2, 3)));
		df->Effects[824].EffectCommands.push_back(createEC(5, custom_unit_class[i], -1, 9, amountTypetoD(125, 5)));
		df->Effects[824].EffectCommands.push_back(createEC(5, custom_unit_class[i], -1, 9, amountTypetoD(125, 8)));
		df->Effects[824].EffectCommands.push_back(createEC(5, custom_unit_class[i], -1, 9, amountTypetoD(125, 16)));
		df->Effects[824].EffectCommands.push_back(createEC(5, custom_unit_class[i], -1, 9, amountTypetoD(125, 21)));
		df->Effects[824].EffectCommands.push_back(createEC(5, custom_unit_class[i], -1, 9, amountTypetoD(125, 29)));
		df->Effects[824].EffectCommands.push_back(createEC(5, custom_unit_class[i], -1, 9, amountTypetoD(125, 30)));
		df->Effects[824].EffectCommands.push_back(createEC(5, custom_unit_class[i], -1, 9, amountTypetoD(125, 34)));
		df->Effects[824].EffectCommands.push_back(createEC(5, custom_unit_class[i], -1, 9, amountTypetoD(125, 35)));
	}
	//Make ninjas get proper attack upgrades
	df->Effects[67].EffectCommands.push_back(createEC(4, ninjaID, -1, 9, amountTypetoD(1, 31)));
	df->Effects[68].EffectCommands.push_back(createEC(4, ninjaID, -1, 9, amountTypetoD(1, 31)));
	df->Effects[75].EffectCommands.push_back(createEC(4, ninjaID, -1, 9, amountTypetoD(2, 31)));
	df->Effects[465].EffectCommands.push_back(createEC(4, ninjaID, -1, 9, amountTypetoD(4, 31)));
	df->Effects[686].EffectCommands.push_back(createEC(4, ninjaID, -1, 9, amountTypetoD(1, 31)));
	df->Effects[687].EffectCommands.push_back(createEC(4, ninjaID, -1, 9, amountTypetoD(1, 31)));
	df->Effects[688].EffectCommands.push_back(createEC(4, ninjaID, -1, 9, amountTypetoD(1, 31)));
	df->Effects[67].EffectCommands.push_back(createEC(4, (ninjaID + 1), -1, 9, amountTypetoD(1, 31)));
	df->Effects[68].EffectCommands.push_back(createEC(4, (ninjaID + 1), -1, 9, amountTypetoD(1, 31)));
	df->Effects[75].EffectCommands.push_back(createEC(4, (ninjaID + 1), -1, 9, amountTypetoD(2, 31)));
	df->Effects[465].EffectCommands.push_back(createEC(4, (ninjaID + 1), -1, 9, amountTypetoD(4, 31)));
	df->Effects[686].EffectCommands.push_back(createEC(4, (ninjaID + 1), -1, 9, amountTypetoD(1, 31)));
	df->Effects[687].EffectCommands.push_back(createEC(4, (ninjaID + 1), -1, 9, amountTypetoD(1, 31)));
	df->Effects[688].EffectCommands.push_back(createEC(4, (ninjaID + 1), -1, 9, amountTypetoD(1, 31)));
	//Make Ahosi get proper attack upgrades
	df->Effects[67].EffectCommands.push_back(createEC(4, ahosiID, -1, 9, amountTypetoD(1, 3)));
	df->Effects[68].EffectCommands.push_back(createEC(4, ahosiID, -1, 9, amountTypetoD(1, 3)));
	df->Effects[75].EffectCommands.push_back(createEC(4, ahosiID, -1, 9, amountTypetoD(2, 3)));
	df->Effects[465].EffectCommands.push_back(createEC(4, ahosiID, -1, 9, amountTypetoD(4, 3)));
	df->Effects[686].EffectCommands.push_back(createEC(4, ahosiID, -1, 9, amountTypetoD(1, 3)));
	df->Effects[687].EffectCommands.push_back(createEC(4, ahosiID, -1, 9, amountTypetoD(1, 3)));
	df->Effects[688].EffectCommands.push_back(createEC(4, ahosiID, -1, 9, amountTypetoD(1, 3)));
	df->Effects[67].EffectCommands.push_back(createEC(4, (ahosiID + 1), -1, 9, amountTypetoD(1, 3)));
	df->Effects[68].EffectCommands.push_back(createEC(4, (ahosiID + 1), -1, 9, amountTypetoD(1, 3)));
	df->Effects[75].EffectCommands.push_back(createEC(4, (ahosiID + 1), -1, 9, amountTypetoD(2, 3)));
	df->Effects[465].EffectCommands.push_back(createEC(4, (ahosiID + 1), -1, 9, amountTypetoD(4, 3)));
	df->Effects[686].EffectCommands.push_back(createEC(4, (ahosiID + 1), -1, 9, amountTypetoD(1, 3)));
	df->Effects[687].EffectCommands.push_back(createEC(4, (ahosiID + 1), -1, 9, amountTypetoD(1, 3)));
	df->Effects[688].EffectCommands.push_back(createEC(4, (ninjaID + 1), -1, 9, amountTypetoD(1, 3)));
	//Make warrior monks get monk upgrades
	for (Effect &effect : df->Effects) {
		int initSize = effect.EffectCommands.size();
		bool alreadyApplies = false;
		for (int i=0; i<initSize; i++) {
			if (effect.EffectCommands[i].A == warmonkID || effect.EffectCommands[i].B == 6) {
				alreadyApplies = true;
			}
		}
		for (int i=0; i<initSize; i++) {
			if (effect.EffectCommands[i].A == -1 && effect.EffectCommands[i].B == 18 && effect.EffectCommands[i].C != 12 && !alreadyApplies) {
				EffectCommand copyEffect1 = effect.EffectCommands[i];
				EffectCommand copyEffect2 = effect.EffectCommands[i];
				copyEffect1.A = warmonkID;
				copyEffect1.B = -1;
				copyEffect2.A = (warmonkID + 1);
				copyEffect2.B = -1;
				effect.EffectCommands.push_back(copyEffect1);
				effect.EffectCommands.push_back(copyEffect2);
			}
		}
	}
	df->Effects[316].EffectCommands.push_back(createEC(4, warmonkID, -1, 9, amountTypetoD(10, 20)));
	df->Effects[316].EffectCommands.push_back(createEC(4, (warmonkID + 1), -1, 9, amountTypetoD(10, 20)));
	df->Effects[319].EffectCommands.push_back(createEC(4, warmonkID, -1, 9, amountTypetoD(20, 25)));
	df->Effects[319].EffectCommands.push_back(createEC(4, (warmonkID + 1), -1, 9, amountTypetoD(20, 25)));
	df->Effects[41].EffectCommands.push_back(createEC(4, warmonkID, -1, 109, 20));
	df->Effects[41].EffectCommands.push_back(createEC(4, (warmonkID + 1), -1, 109, 20));
	df->Effects[220].EffectCommands.push_back(createEC(4, warmonkID, -1, 12, 1));
	df->Effects[220].EffectCommands.push_back(createEC(4, (warmonkID + 1), -1, 12, 1));
	df->Effects[547].EffectCommands.push_back(createEC(5, warmonkID, -1, 10, 0.75));
	df->Effects[547].EffectCommands.push_back(createEC(5, (warmonkID + 1), -1, 10, 0.75));
	//Make madrasah affect missionaries
	copyEffectstoUnits(df, {{545, 0}}, {776});
	//Make Shatagni affect Jannissaries
	copyEffectstoUnits(df, {{563, 0, 1, 2}}, {46, 557});
	//Make Kamandaran and Forced Levy not give gold
	df->Effects[543].EffectCommands[0].Type = 0;
	df->Effects[543].EffectCommands[0].D = 0;
	df->Effects[543].EffectCommands[1].Type = 0;
	df->Effects[543].EffectCommands[1].D = 0;
	df->Effects[543].EffectCommands[2].Type = 0;
	df->Effects[543].EffectCommands[2].D = 0;
	df->Effects[665].EffectCommands[0].Type = 0;
	df->Effects[665].EffectCommands[0].D = 0;
	df->Effects[665].EffectCommands[1].Type = 0;
	df->Effects[665].EffectCommands[1].D = 0;
	df->Effects[665].EffectCommands[2].Type = 0;
	df->Effects[665].EffectCommands[2].D = 0;
	df->Effects[665].EffectCommands[3].Type = 0;
	df->Effects[665].EffectCommands[3].D = 0;
	df->Effects[665].EffectCommands[4].Type = 0;
	df->Effects[665].EffectCommands[4].D = 0;
	//Make blacksmith upgrades affect villagers in Feudal cause screw patch notes
	df->Techs[474].RequiredTechs[1] = 101;
	df->Techs[477].RequiredTechs[1] = 101;
	//Make sicilian bonus apply to conquistadors
	df->Effects[796].EffectCommands.push_back(createEC(0, -1, 23, 24, 0.5));
	//Make unique units available immediately from castle
	for (int i=0; i<uu_tech_ids.size(); i++) {
		df->Techs[uu_tech_ids[i][0]].RequiredTechCount = 1;
	}
	//Make ballista elephant a cav archer
	/*for (Civ &civ : df->Civs) {
		civ.Units[1120].Class = 36;
		civ.Units[1122].Class = 36;
	}*/
	//Make scorpion stuff affect all scorpion units
	EffectCommand double_missile1 = createEC(4, -1, -1, 107, 1);
	EffectCommand double_missile2 = createEC(4, -1, -1, 102, 1);
	giveEffectstoClass(df, 647, {range_1, los_1, search_1}, unit_class[13]);
	giveEffectstoClass(df, 663, {double_missile1, double_missile2}, unit_class[13]);
	//Rearrange buttons
	for (Civ &civ : df->Civs) {
		civ.Units[1370].Creatable.ButtonID = 14;
		civ.Units[1372].Creatable.ButtonID = 14;
	}
	df->Techs[715].ButtonID = 13;
	//Nerf Farimba
	df->Effects[606].EffectCommands[0].D = amountTypetoD(3, 4);
	df->Effects[606].EffectCommands[1].D = amountTypetoD(3, 4);
	df->Effects[606].EffectCommands[2].D = amountTypetoD(3, 31);
	df->Effects[606].EffectCommands[3].D = amountTypetoD(3, 31);
	//Make effects that apply to one unique unit apply to all unique units
	//Relic bonus
	custom_unit_class = {38, 283, 569};
	custom_unit_class.insert(custom_unit_class.end(), unit_class[14].begin(), unit_class[14].end());
	df->Effects[736].EffectCommands.clear();
	df->Effects[737].EffectCommands.clear();
	df->Effects[738].EffectCommands.clear();
	df->Effects[739].EffectCommands.clear();
	addAttacktoUnits(df, 736, 1, custom_unit_class);
	addAttacktoUnits(df, 737, 1, custom_unit_class);
	addAttacktoUnits(df, 738, 1, custom_unit_class);
	addAttacktoUnits(df, 739, 1, custom_unit_class);
	//Royal Heirs
	giveEffectstoClass(df, 603, {createEC(5, -1, -1, 101, 0.5)}, unit_class[14]);
	//Bearded Axe
	df->Effects[291].EffectCommands.clear();
	addAttacktoUnits(df, 291, 2, unit_class[14]);
	//Pavise
	custom_unit_class = {4, 24, 492, 882};
	custom_unit_class.insert(custom_unit_class.end(), unit_class[14].begin(), unit_class[14].end());
	giveEffectstoClass(df, 549, {createEC(4, -1, -1, 8, amountTypetoD(1, 3)), createEC(4, -1, -1, 8, amountTypetoD(1, 4))}, custom_unit_class);
	//Manipur Cavalry
//	giveEffectstoClass(df, 667, {createEC(4, -1, -1, 9, amountTypetoD(6, 21))}, unit_class[14]);
//	df->Effects[667].EffectCommands.push_back(createEC(4, -1, 12, 9, amountTypetoD(6, 21)));
//	df->Effects[667].EffectCommands.push_back(createEC(4, -1, 47, 9, amountTypetoD(6, 21)));
	//Logistica
	giveClassNewBonus(df, unit_class[14], 1);
	giveEffectstoClass(df, 493, {createEC(4, -1, -1, 22, 0.5), createEC(4, -1, -1, 9, amountTypetoD(6, 1))}, unit_class[14]);
	//Rocketry
	custom_unit_class = {279, 542, 1179};
	custom_unit_class.insert(custom_unit_class.end(), unit_class[14].begin(), unit_class[14].end());
	df->Effects[483].EffectCommands.clear();
	addAttacktoUnits(df, 483, 2, custom_unit_class);
	for (int i=0; i<df->Effects[483].EffectCommands.size(); i++) {
		//Note that if you recruit a unique unit that is also a scorpion unit outside of a castle, it will only receive +2 attack (tough luck this system is better than nothing)
		if(find(unit_class[13].begin(), unit_class[13].end(), (int) (df->Effects[483].EffectCommands[i].A)) != unit_class[13].end()) {
			df->Effects[483].EffectCommands[i] = createEC(4, df->Effects[483].EffectCommands[i].A, -1, 9, amountTypetoD(4, 3));
		}
	}
	//Fabric Shields
	custom_unit_class = {751, 752, 753, 185};
	custom_unit_class.insert(custom_unit_class.end(), unit_class[14].begin(), unit_class[14].end());
	giveEffectstoClass(df, 573, {createEC(4, -1, -1, 8, amountTypetoD(2, 3)), createEC(4, -1, -1, 8, amountTypetoD(1, 4))}, custom_unit_class);
	//Berserkergang
	giveEffectstoClass(df, 467, {createEC(4, -1, -1, 109, 20)}, unit_class[14]);
	//Corvinian Army
	df->Effects[571].EffectCommands.clear();
	for (int i=0; i<unit_class[14].size(); i+=2) {
		int uu = unit_class[14][i];
		int ue = unit_class[14][i+1];
		for (int j=0; j<df->Civs[0].Units[uu].Creatable.ResourceCosts.size(); j++) {
			if (df->Civs[0].Units[uu].Creatable.ResourceCosts[j].Type == 3) {
				//Cost no gold
				EffectCommand no_gold1 = createEC(0, uu, -1, 105, 0);
				EffectCommand no_gold2 = createEC(0, ue, -1, 105, 0);
				df->Effects[571].EffectCommands.push_back(no_gold1);
				df->Effects[571].EffectCommands.push_back(no_gold2);
				//Add previous gold amount to trash resource
				auto gold_cost = df->Civs[0].Units[uu].Creatable.ResourceCosts[j].Amount;
				EffectCommand add_trash1 = EffectCommand();
				add_trash1.Type = 4;
				add_trash1.A = uu;
				if (df->Civs[0].Units[uu].Creatable.ResourceCosts[0].Type == 0) {
					add_trash1.C = 103;
				} else if (df->Civs[0].Units[uu].Creatable.ResourceCosts[0].Type == 1) {
					add_trash1.C = 104;
				}
				add_trash1.D = gold_cost;
				EffectCommand add_trash2 = add_trash1;
				add_trash2.A = ue;
				df->Effects[571].EffectCommands.push_back(add_trash1);
				df->Effects[571].EffectCommands.push_back(add_trash2);
			}
		}
	}

	//Copy the attack tree task from onager
	for (int k=0; k<df->Civs.size(); k++) {
		df->Civs[k].Units[280].Bird.TaskList.push_back(df->Civs[k].Units[550].Bird.TaskList[4]);
		//Disable attacking trees unless it's the civ with the bonus
		df->Civs[k].Units[280].Bird.TaskList[5].ClassID = -1;
	}
	//Create the TC siege tower
	for (Civ &civ : df->Civs) {
		civ.Resources[29] = 1;
		civ.Units[885] = civ.Units[1105];
		civ.Units[885].Name = "SIEGTWR_F";
		civ.Units[885].Creatable.TrainLocationID = 109;
		civ.Units[885].Creatable.ButtonID = 9;
		civ.Units[885].Creatable.ResourceCosts[0].Type = 29;
		civ.Units[885].Creatable.ResourceCosts[0].Amount = 1;
		civ.Units[885].Creatable.ResourceCosts[0].Flag = 1;
		civ.Units[885].Creatable.ResourceCosts[1] = civ.Units[885].Creatable.ResourceCosts[2];
		civ.Units[885].Creatable.ResourceCosts[2].Type = -1;
		civ.Units[885].Creatable.ResourceCosts[2].Amount = 0;
		civ.Units[885].Creatable.ResourceCosts[2].Flag = 0;
	}
	//Create the mill cow
	for (Civ &civ : df->Civs) {
		civ.Units[646] = civ.Units[705];
		civ.Units[646].Name = "BABY";
		civ.Units[646].Creatable.TrainLocationID = 68;
		civ.Units[646].Creatable.ButtonID = 2;
		civ.Units[646].Creatable.ResourceCosts[0].Type = 3;
		civ.Units[646].Creatable.ResourceCosts[0].Amount = 40;
	}
	//Create feudal monk
	for (Civ &civ : df->Civs) {
		civ.Units[648] = civ.Units[125];
		civ.Units[648].Name = "MONK_F";
		//Cannot pickup relics and longer conversion times
		civ.Units[648].Bird.TaskList.erase(civ.Units[648].Bird.TaskList.begin() + 4);
		civ.Units[648].Bird.TaskList[1].WorkValue1 = 5;
		civ.Units[648].Bird.TaskList[1].WorkValue2 = 12;
	}
	//Create generate stone task (copied from keshiks)
	for (Civ &civ : df->Civs) {
		for (int i=0; i<rams.size(); i++) {
			civ.Units[rams[i]].Bird.TaskList.push_back(civ.Units[1228].Bird.TaskList[5]);
			civ.Units[rams[i]].Bird.TaskList[5].ClassID = -1;
			civ.Units[rams[i]].Bird.TaskList[5].ResourceOut = 2;
			civ.Units[rams[i]].Bird.TaskList[5].WorkValue1 = 0.02;
		}
	}
	//Genericize unique units outside of castle
	df->Effects[714].EffectCommands.pop_back();
	df->Effects[715].EffectCommands.pop_back();
	df->Effects[788].EffectCommands.pop_back();
	df->Effects[789].EffectCommands.pop_back();
	df->Effects[363].EffectCommands.pop_back();
	df->Effects[454].EffectCommands.pop_back();
	EffectCommand unique_available = createEC(2, 1254, 1, -1, 0);
	df->Effects[732].EffectCommands.push_back(unique_available);

	Effect donjon_unit_effect = Effect();
	donjon_unit_effect.Name = "Enable Donjon Unit";
	unique_available = createEC(2, 1660, 1, -1, 0);
	donjon_unit_effect.EffectCommands.push_back(unique_available);
	df->Effects.push_back(donjon_unit_effect);
	Tech donjon_unit_tech = Tech();
	donjon_unit_tech.Name = "Enable Donjon Unit";
	donjon_unit_tech.RequiredTechs.push_back(101);
	donjon_unit_tech.RequiredTechCount = 1;
	donjon_unit_tech.Civ = 99;
	donjon_unit_tech.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(donjon_unit_tech);
	civ_bonuses[109].push_back((int) (df->Techs.size() - 1));

	//Add berry, hunter, fish productivity resources
	//Villager unit, task action type, productivity resource
	const vector<vector<int>> villager_tasks = {{120, 5, 198}, {354, 5, 198}, {122, 110, 199}, {216, 110, 199}, {56, 5, 200}, {57, 5, 200}, {13, 5, 200}};
	for (Civ &civ : df->Civs) {
		civ.Resources[198] = 1;
		civ.Resources[199] = 1;
		civ.Resources[200] = 1;
		for (int i=0; i<villager_tasks.size(); i++) {
			for (int j=0; j<civ.Units[villager_tasks[i][0]].Bird.TaskList.size(); j++) {
				if (civ.Units[villager_tasks[i][0]].Bird.TaskList[j].ActionType == villager_tasks[i][1]) {
					civ.Units[villager_tasks[i][0]].Bird.TaskList[j].ResourceMultiplier = villager_tasks[i][2];
				}
			}
		}
	}

		//Create new effects for new techs that simply recreate the effects that already existed in game, but were tied to tech trees rather than techs
	//Create all the civ bonuses that are just a list of free techs
	const vector<vector<int>> free_techs = {{12, 13, 14}, {67, 68, 75}, {716}, {8, 280}, {322, 441}, {47}, {254, 428, 786}, {213, 249}, {140, 63, 64}, {315}};
	for (int i=0; i<free_techs.size(); i++) {
		Effect ef = Effect();
		for (int j=0; j<free_techs[i].size(); j++) {
			for (int k=0; k<4; k++) {
				ef.EffectCommands.push_back(createEC(101, free_techs[i][j], k, 0, 0));
			}
			if (i == 7) {
				//Exception for wheelbarrow/hand cart for compatibility with other civ bonuses
				ef.EffectCommands.push_back(createEC(103, free_techs[i][j], -1, 0, 1));
			} else {
				ef.EffectCommands.push_back(createEC(103, free_techs[i][j], -1, 0, 0));
			}
		}
		addEffectandTech(df, ef, "C-Bonus, Free techs (set 1) " + to_string(i));
	}
	//Farmers work 10% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 214, -1, 13, 1.18));
	e.EffectCommands.push_back(createEC(5, 259, -1, 13, 1.18));
	e.EffectCommands.push_back(createEC(5, 50, -1, 13, 1.1));
	e.EffectCommands.push_back(createEC(5, 1187, -1, 13, 1.1));
	addEffectandTech(df, e, "C-Bonus, farmers work 10% faster");
	//-15% age up cost
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(101, 101, 0, 1, -75));
	e.EffectCommands.push_back(createEC(101, 102, 0, 1, -120));
	e.EffectCommands.push_back(createEC(101, 102, 3, 1, -30));
	e.EffectCommands.push_back(createEC(101, 103, 0, 1, -150));
	e.EffectCommands.push_back(createEC(101, 103, 3, 1, -120));
	addEffectandTech(df, e, "C-Bonus, -15% age up cost");
	//-15% fishing ship cost
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 13, -1, 104, 0.85));
	addEffectandTech(df, e, "C-Bonus, -15% fishing ship cost");
	//Dock and university techs cost -33%
	e.EffectCommands.clear();
	addEffectandTech(df, e, "C-Bonus, Dock and university techs cost -33%");
	//Advancing to Imp cost -33%
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(101, 103, 0, 1, -333));
	e.EffectCommands.push_back(createEC(101, 103, 3, 1, -264));
	addEffectandTech(df, e, "C-Bonus, Imperial cost -33%");
	//Blacksmith upgrades don't cost gold
	const vector<int> blacksmith_techs = {201, 75, 212, 219, 200, 76, 82, 199, 68, 80, 77};
	e.EffectCommands.clear();
	for (int i=0; i<blacksmith_techs.size(); i++) {
		e.EffectCommands.push_back(createEC(101, blacksmith_techs[i], 3, 0, 0));
	}
	addEffectandTech(df, e, "C-Bonus, Blacksmith upgrades no gold");
	//Gunpowder units fire faster
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[5].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_class[5][i], -1, 10, 0.85));
	}
	addEffectandTech(df, e, "C-Bonus, Gunpowder fire 18% faster");
	//Builders work 30% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 195, 0, -1, 1.3));
	addEffectandTech(df, e, "C-Bonus, Builders 30% faster");
	//Military units created 11% faster
	const vector<int> classes = {0, 55, 22, 35, 6, 54, 13, 51, 36, 12, 44, 43, 23, 47};
	e.EffectCommands.clear();
	for (int i=0; i<classes.size(); i++) {
		e.EffectCommands.push_back(createEC(5, -1, classes[i], 101, 0.9));
	}
	addEffectandTech(df, e, "C-Bonus, Military units created 11% faster");
	//Villagers carry +3
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 4, 14, 3));
	addEffectandTech(df, e, "C-Bonus, Villagers carry +3");
	//Trebuchets +30% accuracy
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, 42, -1, 11, 35));
	addEffectandTech(df, e, "C-Bonus, Trebuchets +30% accuracy");
	//No houses, -100 wood
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 4, 1, -1, 2000));
	e.EffectCommands.push_back(createEC(2, 70, 0, -1, 0));
	e.EffectCommands.push_back(createEC(1, 92, 1, -1, -100));
	addEffectandTech(df, e, "C-Bonus, No houses, -100 wood");
	//Resources last 15% longer
	const vector<int> productivity_rates = {47, 190, 79, 189, 216, 198, 199, 200};
	const vector<int> gather_rates = {214, 57, 354, 581, 216, 218, 220, 590, 259, 56, 120, 579, 122, 123, 124, 592, 13};
	e.EffectCommands.clear();
	for (int i=0; i<productivity_rates.size(); i++) {
		e.EffectCommands.push_back(createEC(6, productivity_rates[i], -1, -1, 1.15));
	}
	for (int i=0; i<gather_rates.size(); i++) {
		e.EffectCommands.push_back(createEC(5, gather_rates[i], -1, 13, 0.87));
	}
	addEffectandTech(df, e, "C-Bonus, Resources last 15% longer");
	//Archers cost -10% Feudal, -20% Castle, -30% Imperial Age
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[6].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_class[6][i], -1, 100, 0.9));
	}
	e.Name = "C-Bonus, Archers cost -10%";
	df->Effects.push_back(e);
	Tech t = Tech();
	t.Name = "C-Bonus, Archers cost -10%";
	t.Civ = 99;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);
	EffectCommand cost_80_cumulative = createEC(5, -1, -1, 100, 0.889);
	EffectCommand cost_70_cumulative = createEC(5, -1, -1, 100, 0.875);
	giveEffectstoClass(df, 485, {cost_80_cumulative}, unit_class[6]);
	giveEffectstoClass(df, 486, {cost_70_cumulative}, unit_class[6]);
	civ_bonuses.push_back({(int) (df->Techs.size() - 1), 53, 56});
	//Villagers +3 LOS
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 4, 1, 3));
	addEffectandTech(df, e, "C-Bonus, Villagers +3 LOS");
	//Fast stoners
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 220, -1, 13, 1.2));
	e.EffectCommands.push_back(createEC(5, 124, -1, 13, 1.2));
	addEffectandTech(df, e, "C-Bonus, Stone Miners 20% faster");
	//No wood eco upgrades
	const vector<int> eco_upgrades = {213, 249, 202, 203, 221, 14, 13, 12, 55, 182, 278, 279, 65};
	e.EffectCommands.clear();
	for (int i=0; i<eco_upgrades.size(); i++) {
		e.EffectCommands.push_back(createEC(101, eco_upgrades[i], 1, 0, 0));
	}
	addEffectandTech(df, e, "C-Bonus, Eco upgrades no wood");
	//-50% food for blacksmith and siege techs
	e.EffectCommands.clear();
	addEffectandTech(df, e, "C-Bonus, -50% food blacksmith+siege techs");
	//-50% cost for stable techs
	e.EffectCommands.clear();
	addEffectandTech(df, e, "C-Bonus, -50% cost stable techs");
	//Spawn sheep from TCs
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(0, 890, -1, 0, 1));
	e.Name = "Sheep from TCs";
	df->Effects.push_back(e);
	t = Tech();
	t.Name = "Sheep from TCs";
	t.Civ = 99;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);
	civ_bonuses.push_back({(int) (df->Techs.size() - 1), 303, 305});

		//Create bonuses that don't exist yet
	//Wonders provide +50 bonus pop space
	civ_bonuses.push_back({});
	//+3 HP on villagers per economic tech
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 4, 0, 3));
	const vector<int> eco_techs = {202, 14, 55, 278, 182, 279, 203, 13, 221, 12, 65};
	vector<int> tech_ids = {};
	for (int i=0; i<eco_techs.size(); i++) {
		e.Name = "Villagers +3 HP for eco tech " + to_string(i);
		df->Effects.push_back(e);
		Tech hp_tech = Tech();
		hp_tech.Name = "Villagers +3 HP for eco tech " + to_string(i);
		hp_tech.RequiredTechs.push_back(eco_techs[i]);
		hp_tech.RequiredTechCount = 1;
		hp_tech.Civ = 99;
		hp_tech.EffectID = (df->Effects.size() - 1);
		df->Techs.push_back(hp_tech);
		tech_ids.push_back((int) (df->Techs.size() - 1));
	}
	civ_bonuses.push_back(tech_ids);
	//Villagers regenerate slowly
		//e.EffectCommands.clear();
		//e.EffectCommands.push_back(createEC(4, -1, 4, 109, 0.5));
		//addEffectandTech(df, e, "C-Bonus, Villagers regenerate");
	civ_bonuses.push_back({792, 809, 810, 811});
	//Military buildings build 100% faster
	e.EffectCommands.clear();
	EffectCommand building_time = createEC(5, -1, -1, 101, 0.5);
	e.Name = "C-Bonus, Military buildings built 100% faster";
	df->Effects.push_back(e);
	giveEffectstoClass(df, (int) (df->Effects.size() - 1), {building_time}, unit_class[10]);
	t = Tech();
	t.Name = "C-Bonus, Military buildings built 100% faster";
	t.Civ = 99;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);
	civ_bonuses.push_back({(int) (df->Techs.size() - 1)});
	//Resource drop-off buildings provide +5 population
	civ_bonuses.push_back({});
	//Ballistics researched instantly
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(103, 93, -1, 0, 1));
	e.EffectCommands.push_back(createEC(101, 93, 1, 0, 0));
	addEffectandTech(df, e, "C-Bonus, Ballistics researched instantly");
	//More free techs
	const vector<vector<int>> free_techs_2 = {{100, 237}, {98, 655, 599}, {236, 521}, {74, 76, 77}, {80, 81, 82}, {199, 200, 201}, {316}, {215, 602}, {384, 434}, {631}, {231, 252}, {319, 233}, {438, 230},
		{379, 194}, {50, 51}, {55, 182, 278, 279}, {321, 54}, {35}, {374, 375}, {246}, {244}, {65}, {34}, {218}, {96, 255}};
	for (int i=0; i<free_techs_2.size(); i++) {
		e.EffectCommands.clear();
		for (int j=0; j<free_techs_2[i].size(); j++) {
			for (int k=0; k<4; k++) {
				e.EffectCommands.push_back(createEC(101, free_techs_2[i][j], k, 0, 0));
			}
			if ((i == 1) && (j == 1)) {
				//Imp Skirm takes 1 second to research
				e.EffectCommands.push_back(createEC(103, free_techs_2[i][j], -1, 0, 1));
			} else {
				e.EffectCommands.push_back(createEC(103, free_techs_2[i][j], -1, 0, 0));
			}
		}
		addEffectandTech(df, e, "C-Bonus, Free techs (set 2) " + to_string(i));
	}
	//Trade units 20% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, -1, 2, 5, 1.2));
	e.EffectCommands.push_back(createEC(5, -1, 2, 13, 1.2));
	e.EffectCommands.push_back(createEC(5, -1, 19, 5, 1.2));
	e.EffectCommands.push_back(createEC(5, -1, 19, 13, 1.2));
	addEffectandTech(df, e, "C-Bonus, Trade 20% faster");
	//Squires affects archers
	e.EffectCommands.clear();
	EffectCommand archer_speed = createEC(5, -1, -1, 5, 1.1);
	e.Name = "C-Bonus, Squires affects archers";
	df->Effects.push_back(e);
	giveEffectstoClass(df, (int) (df->Effects.size() - 1), {archer_speed}, unit_class[6]);
	t = Tech();
	t.Name = "C-Bonus, Squires affects archers";
	t.RequiredTechs.push_back(215);
	t.RequiredTechCount = 1;
	t.Civ = 99;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);
	civ_bonuses.push_back({(int) (df->Techs.size() - 1)});
	//Eagles 5/10/15% speed
	tech_ids.clear();
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[16].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_class[16][i], -1, 5, 1.05));
	}
	tech_ids.push_back(addEffectandTech(df, e, "C-Bonus, Eagles +5% speed", {101}));
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[16].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_class[16][i], -1, 5, 1.0476));
	}
	tech_ids.push_back(addEffectandTech(df, e, "C-Bonus, Eagles +10% speed", {102}));
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[16].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_class[16][i], -1, 5, 1.0455));
	}
	tech_ids.push_back(addEffectandTech(df, e, "C-Bonus, Eagles +15% speed", {103}));
	civ_bonuses.push_back(tech_ids);
	//Start with +150 wood
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 92, 1, -1, 150));
	addEffectandTech(df, e, "C-Bonus, +150 wood");
	//Start with +100 stone
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 93, 1, -1, 100));
	addEffectandTech(df, e, "C-Bonus, +100 stone");
	//Start with +50 wood, +50 stone
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 92, 1, -1, 50));
	e.EffectCommands.push_back(createEC(1, 93, 1, -1, 50));
	addEffectandTech(df, e, "C-Bonus, +50 wood, +50 stone");
	//Start with +30 gold, +70 food
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 91, 1, -1, 70));
	e.EffectCommands.push_back(createEC(1, 94, 1, -1, 30));
	addEffectandTech(df, e, "C-Bonus, +70 food, +30 gold");
	//Monk units train 66% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, -1, 18, 101, 0.6));
	e.EffectCommands.push_back(createEC(5, warmonkID, -1, 101, 0.6));
	e.EffectCommands.push_back(createEC(5, warmonkID + 1, -1, 101, 0.6));
	addEffectandTech(df, e, "C-Bonus, Monks train 66% faster");
	//Trebuchets train 50% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 331, -1, 101, 0.66));
	e.EffectCommands.push_back(createEC(5, 42, -1, 101, 0.66));
	e.EffectCommands.push_back(createEC(5, 1690, -1, 101, 0.66));
	e.EffectCommands.push_back(createEC(5, 1691, -1, 101, 0.66));
	addEffectandTech(df, e, "C-Bonus, Trebuchets train 50% faster");
	//Cavalry archers train 33% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, -1, 36, 101, 0.8));
	addEffectandTech(df, e, "C-Bonus, Cav archers train 33% faster");
	//Land explosive units train 200% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, -1, 35, 101, 0.33));
	addEffectandTech(df, e, "C-Bonus, Petards train 200% faster");
	//Land explosive units +8 pierce armor
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 35, 8, amountTypetoD(8, 3)));
	addEffectandTech(df, e, "C-Bonus, Petards +8 pierce armor");
	//Bloodlines free in Castle Age
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(101, 435, 0, 0, 0));
	e.EffectCommands.push_back(createEC(101, 435, 3, 0, 0));
	e.EffectCommands.push_back(createEC(103, 435, -1, 0, 0));
	civ_bonuses.push_back({addEffectandTech(df, e, "C-Bonus, Bloodlines free in Castle Age", {102})});
	//Galleys +1 range
	e.EffectCommands.clear();
	const vector<int> loop1 = {539, 21, 442};
	const vector<int> loop2 = {12, 1, 23};
	for (int i=0; i<loop1.size(); i++) {
		for (int j=0; j<loop2.size(); j++) {
			e.EffectCommands.push_back(createEC(4, loop1[i], -1, loop2[j], 1));
		}
	}
	addEffectandTech(df, e, "C-Bonus, Galleys +1 range");
	//+100 wood, +100 stone every age up
	e.EffectCommands.clear();
	tech_ids.clear();
	e.EffectCommands.push_back(createEC(1, 1, 1, -1, 100));
	e.EffectCommands.push_back(createEC(1, 2, 1, -1, 100));
	for (int i=0; i<3; i++) {
		tech_ids.push_back(addEffectandTech(df, e, "C-Bonus, +100 wood, +100 stone in age " + to_string(i), {i+101}));
	}
	civ_bonuses.push_back(tech_ids);
	//+400 food upon reaching Castle Age
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 0, 1, -1, 400));
	civ_bonuses.push_back({addEffectandTech(df, e, "C-Bonus, +400 food in Castle Age", {102})});
	//+350 stone upon reaching Castle Age
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 2, 1, -1, 350));
	civ_bonuses.push_back({addEffectandTech(df, e, "C-Bonus, +350 stone in Castle Age", {102})});
	//+250 wood upon reaching Feudal Age
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 1, 1, -1, 250));
	civ_bonuses.push_back({addEffectandTech(df, e, "C-Bonus, +250 wood in Feudal Age", {101})});
	//+500 gold upon reaching Imperial Age
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 3, 1, -1, 500));
	civ_bonuses.push_back({addEffectandTech(df, e, "C-Bonus, +500 gold in Imperial Age", {103})});
	//+100 HP, 100 pierce armor for monks with relics
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 43, 0, 100));
	e.EffectCommands.push_back(createEC(4, -1, 43, 8, amountTypetoD(100, 3)));
	addEffectandTech(df, e, "C-Bonus, Monks with relics tank");
	//Land explosive units 2x HP
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, -1, 35, 0, 2));
	addEffectandTech(df, e, "C-Bonus, Explosive units 2x HP");
	//Town Center spawns a married couple upon reaching Feudal Age
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(7, 83, 109, 1, 0));
	e.EffectCommands.push_back(createEC(7, 293, 109, 1, 0));
	civ_bonuses.push_back({addEffectandTech(df, e, "C-Bonus, +2 Villagers in Feudal Age", {101})});
	//All economic techs researched +100% faster
	e.EffectCommands.clear();
	const vector<vector<int>> tech_times = {{65, -23}, {213, -38}, {249, -28}, {202, -13}, {203, -25}, {221, -50}, {278, -15}, {279, -38}, {55, -15}, {182, -38},
		{14, -10}, {13, -20}, {12, -35}, {48, -20}, {23, -35}, {17, -35}, {15, -25}};
	for (int i=0; i<tech_times.size(); i++) {
		e.EffectCommands.push_back(createEC(103, tech_times[i][0], -1, 1, tech_times[i][1]));
	}
	addEffectandTech(df, e, "C-Bonus, Eco Upgrades research faster");
	//Castles +2000 HP
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, 82, -1, 0, 2000));
	addEffectandTech(df, e, "C-Bonus, Castles +2000 HP");
	//Blacksmith upgrades are free an age after they become available
	const vector<int> blacksmith_2_3 = {199, 200, 211, 212, 67, 68, 81, 82, 74, 76};
	vector<int> blacksmith_requirements = {};
	for (int i=0; i<blacksmith_2_3.size(); i++) {
		e.EffectCommands.clear();
		e.EffectCommands.push_back(createEC(101, blacksmith_2_3[i], 0, 0, 0));
		e.EffectCommands.push_back(createEC(101, blacksmith_2_3[i], 3, 0, 0));
		e.EffectCommands.push_back(createEC(103, blacksmith_2_3[i], -1, 0, 0));
		e.Name = "C-Bonus, Blacksmith upgrade " + to_string(i) + " free";
		df->Effects.push_back(e);
		t = Tech();
		t.Name = "C-Bonus, Blacksmith upgrade " + to_string(i) + " free";
		t.Civ = 99;
		t.RequiredTechs.push_back((i % 2) + 102);
		if ((i % 2) != 0) {
			t.RequiredTechs.push_back(blacksmith_2_3[i-1]);
		}
		t.RequiredTechCount = t.RequiredTechs.size();
		t.EffectID = (int) (df->Effects.size() - 1);
		df->Techs.push_back(t);
		blacksmith_requirements.push_back((int) (df->Techs.size() - 1));
	}
	civ_bonuses.push_back(blacksmith_requirements);
	//Barracks -75 wood
	e.EffectCommands.clear();
	const vector<int> barracks = {12, 20, 132, 498};
	for (int i=0; i<barracks.size(); i++) {
		e.EffectCommands.push_back(createEC(4, barracks[i], -1, 104, -75));
	}
	addEffectandTech(df, e, "C-Bonus, Barracks -75 wood");
	//Stable -75 wood
	e.EffectCommands.clear();
	const vector<int> stables = {86, 101, 153};
	for (int i=0; i<stables.size(); i++) {
		e.EffectCommands.push_back(createEC(4, stables[i], -1, 104, -75));
	}
	addEffectandTech(df, e, "C-Bonus, Stables -75 wood");
	//Archery Range -75 wood
	e.EffectCommands.clear();
	const vector<int> ranges = {10, 14, 87};
	for (int i=0; i<stables.size(); i++) {
		e.EffectCommands.push_back(createEC(4, ranges[i], -1, 104, -75));
	}
	addEffectandTech(df, e, "C-Bonus, Arrg -75 wood");
	//Monastery -100 wood
	const vector<int> monasteries = {30, 31, 32, 104};
	for (int i=0; i<monasteries.size(); i++) {
		e.EffectCommands.push_back(createEC(4, monasteries[i], -1, 104, -100));
	}
	addEffectandTech(df, e, "C-Bonus, Monastery -100 wood");
	//Siege Workshops -100 wood
	e.EffectCommands.clear();
	const vector<int> workshops = {49, 150};
	for (int i=0; i<workshops.size(); i++) {
		e.EffectCommands.push_back(createEC(4, workshops[i], -1, 104, -100));
	}
	addEffectandTech(df, e, "C-Bonus, Siege workshop -100 wood");
	//Military Buildings -50 wood
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[10].size(); i++) {
		e.EffectCommands.push_back(createEC(4, unit_class[10][i], -1, 104, -50));
	}
	addEffectandTech(df, e, "C-Bonus, Military buildings -50 wood");
	//Blacksmith, University cost -100 wood
	e.EffectCommands.clear();
	const vector<int> blacksmiths = {18, 19, 103, 105};
	const vector<int> universities = {209, 210};
	for (int i=0; i<blacksmiths.size(); i++) {
		e.EffectCommands.push_back(createEC(4, blacksmiths[i], -1, 104, -100));
	}
	for (int i=0; i<universities.size(); i++) {
		e.EffectCommands.push_back(createEC(4, universities[i], -1, 104, -100));
	}
	addEffectandTech(df, e, "Blacksmith, University cost -100 wood");
	//Infantry +1/2/3/4 attack vs villagers
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
	giveClassNewBonus(df, 6, 10);
	e.EffectCommands.clear();
	tech_ids.clear();
	e.EffectCommands.push_back(createEC(4, -1, 6, 9, amountTypetoD(1, 10)));
	tech_ids.push_back(addEffectandTech(df, e, "Infantry +attack vs vils in Age -1", {}));
	for (int i=0; i<3; i++) {
		tech_ids.push_back(addEffectandTech(df, e, "Infantry +attack vs vils in Age " + to_string(i), {i+101}));
	}
	civ_bonuses.push_back(tech_ids);
	//Fishing ships carry +10 food
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 21, 14, 10));
	addEffectandTech(df, e, "C-Bonus, Fishing ships carry +10");
	//Galleys +1/2 attack
	e.EffectCommands.clear();
	tech_ids.clear();
	e.EffectCommands.push_back(createEC(4, 539, -1, 9, amountTypetoD(1, 3)));
	e.EffectCommands.push_back(createEC(4, 21, -1, 9, amountTypetoD(1, 3)));
	e.EffectCommands.push_back(createEC(4, 442, -1, 9, amountTypetoD(1, 3)));
	tech_ids.push_back(addEffectandTech(df, e, "Galleys +attack in Castle Age", {102}));
	tech_ids.push_back(addEffectandTech(df, e, "Galleys +attack in Imperial Age", {103}));
	civ_bonuses.push_back(tech_ids);
	//Steppe Lancers +10 attack vs. villagers
	giveClassNewBonus(df, unit_class[15], 10);
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[15].size(); i++) {
		e.EffectCommands.push_back(createEC(4, unit_class[15][i], -1, 9, amountTypetoD(10, 10)));
	}
	addEffectandTech(df, e, "C-Bonus, Steppe Lancers +attack vs vils");
	//Steppe lancers attack 33% faster
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[15].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_class[15][i], -1, 10, 0.75));
	}
	addEffectandTech(df, e, "C-Bonus, Steppe Lancers attack +33%");
	//Elephant units attack 25% faster
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[4].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_class[4][i], -1, 10, 0.8));
	}
	addEffectandTech(df, e, "C-Bonus, Elephants +25% attack");
	//Stone walls in dark age
	t = Tech();
	t.Name = "C-Bonus, Stone walls in Dark Age";
	t.Civ = 99;
	df->Techs.push_back(t);
	df->Techs[189].RequiredTechs[1] = (int) (df->Techs.size() - 1);
	civ_bonuses.push_back({(int) (df->Techs.size() - 1)});
	//+50 every resource per advance
	e.EffectCommands.clear();
	tech_ids.clear();
	for (int i=0; i<4; i++) {
		e.EffectCommands.push_back(createEC(1, i, 1, -1, 50));
	}
	for (int i=0; i<3; i++) {
		tech_ids.push_back(addEffectandTech(df, e, "C-Bonus, +50 each res in age " + to_string(i), {i+101}));
	}
	civ_bonuses.push_back(tech_ids);
	//Villagers return 25 food upon death
	civ_bonuses.push_back({});
	//Camel units attack 25% faster
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[8].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_class[8][i], -1, 10, 0.8));
	}
	addEffectandTech(df, e, "C-Bonus, Camels +25% attack");
	//Mangonels can cut trees
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, 280, -1, 9, amountTypetoD(100, 18)));
	addEffectandTech(df, e, "C-Bonus, Mangonels cut trees");
	//Free siege tower in Feudal Age, cost 50%
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 1105, -1, 100, 0.5));
	e.EffectCommands.push_back(createEC(2, 885, 1, -1, 0));
	civ_bonuses.push_back({addEffectandTech(df, e, "C-Bonus, Free siege tower", {101})});
	//Rams, Siege Towers x2 garrison space
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, 35, -1, 2, 4));
	e.EffectCommands.push_back(createEC(4, 1258, -1, 2, 4));
	e.EffectCommands.push_back(createEC(4, 422, -1, 2, 5));
	e.EffectCommands.push_back(createEC(4, 548, -1, 2, 6));
	e.EffectCommands.push_back(createEC(4, 885, -1, 2, 10));
	e.EffectCommands.push_back(createEC(4, 1105, -1, 2, 10));
	addEffectandTech(df, e, "C-Bonus, Rams, Siege Towers +garrison");
	//Towers (of all kinds) support 5 population
	civ_bonuses.push_back({});
	//Gunpowder units move 20% faster
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[5].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_class[5][i], -1, 5, 1.2));
	}
	addEffectandTech(df, e, "C-Bonus, Gunpowder +20% speed");
	//Castles refund 350 stone
	civ_bonuses.push_back({});
	//Monk units 20% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, -1, 18, 5, 1.2));
	e.EffectCommands.push_back(createEC(5, -1, 43, 5, 1.2));
	e.EffectCommands.push_back(createEC(5, warmonkID, -1, 5, 1.2));
	e.EffectCommands.push_back(createEC(5, warmonkID + 1, -1, 5, 1.2));
	addEffectandTech(df, e, "C-Bonus, Monks +20% speed");
	//Farms immediately provide 10 food after seeding
	civ_bonuses.push_back({});
	//Long Swordsman, Two-Handed Swordsman upgrades available one age earlier
	tech_ids.clear();
	t = Tech();
	t.Name = "C-Bonus, Long Swords in Feudal";
	t.Civ = 99;
	t.RequiredTechs.push_back(101);
	t.RequiredTechs.push_back(222);
	t.RequiredTechCount = 2;
	df->Techs.push_back(t);
	df->Techs[207].RequiredTechs[2] = (int) (df->Techs.size() - 1);
	tech_ids.push_back((int) (df->Techs.size() - 1));
	t = Tech();
	t.Name = "C-Bonus, 2HS in Castle";
	t.Civ = 99;
	t.RequiredTechs.push_back(102);
	t.RequiredTechs.push_back(207);
	t.RequiredTechCount = 2;
	df->Techs.push_back(t);
	df->Techs[217].RequiredTechs[2] = (int) (df->Techs.size() - 1);
	tech_ids.push_back((int) (df->Techs.size() - 1));
	civ_bonuses.push_back(tech_ids);
	//Cows from mills
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(2, 646, 1, -1, 0));
	addEffectandTech(df, e, "C-Bonus, Cows from mills");
	//Start with a horse
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 234, 0, -1, 1));
	e.EffectCommands.push_back(createEC(7, 814, 109, 1, 0));
	civ_bonuses.push_back({addEffectandTech(df, e, "C-Bonus, start with horse", {639, 722})});
	//Siege Towers 2x HP
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 885, -1, 0, 2));
	e.EffectCommands.push_back(createEC(5, 1105, -1, 0, 2));
	addEffectandTech(df, e, "C-Bonus, Siege Towers x2 HP");
	//Siege Towers train 100% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 885, -1, 101, 0.5));
	e.EffectCommands.push_back(createEC(5, 1105, -1, 101, 0.5));
	addEffectandTech(df, e, "C-Bonus, Siege Towers train 100% faster");
	//Eco upgrades cost -50% food
	e.EffectCommands.clear();
	addEffectandTech(df, e, "C-Bonus, Eco upgrades cost -50% food");
	//Cannon galleons get ballistics
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(0, 374, -1, 19, 1));
	e.EffectCommands.push_back(createEC(0, 374, -1, 5, 7));
	addEffectandTech(df, e, "C-Bonus, Cannon galleons w/ ballistics");
	//Warships +10 attack vs villagers
	giveClassNewBonus(df, 22, 10);
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 22, 9, amountTypetoD(10, 10)));
	addEffectandTech(df, e, "C-Bonus, Warships +attack vs vils");
	//Rams generate stone when fighting
	civ_bonuses.push_back({});
	//TCs +50% work rate in Imperial
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 142, -1, 13, 1.5));
	civ_bonuses.push_back({addEffectandTech(df, e, "C-Bonus, Town Center +50% Productivity", {103})});
	//Feudal Age cost -25%
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(101, 101, 0, 1, -125));
	addEffectandTech(df, e, "C-Bonus, Feudal cost -25%");
	//Spearmen and skirmishers train 50% faster
	e.EffectCommands.clear();
	custom_unit_class = {93, 358, 359, 1182, 1183, 1184, vilspear, vilpike, vilhalb, 6, 7, 1155};
	for (int i=0; i<custom_unit_class.size(); i++) {
		e.EffectCommands.push_back(createEC(5, custom_unit_class[i], -1, 101, 0.66));
	}
	addEffectandTech(df, e, "C-Bonus, Spearmen and Skirms train 50% faster");
	//Spearman-line +25% HP
	e.EffectCommands.clear();
	custom_unit_class = {93, 358, 359, 1182, 1183, 1184, vilspear, vilpike, vilhalb};
	for (int i=0; i<custom_unit_class.size(); i++) {
		e.EffectCommands.push_back(createEC(5, custom_unit_class[i], -1, 0, 1.25));
	}
	addEffectandTech(df, e, "C-Bonus, Spearmen +25% HP");
	//Market techs cost no gold
	e.EffectCommands.clear();
	const vector<int> market_techs = {15, 17, 23, 48};
	for (int i=0; i<market_techs.size(); i++) {
		e.EffectCommands.push_back(createEC(101, market_techs[i], 3, 0, 0));
	}
	addEffectandTech(df, e, "C-Bonus, Market techs cost no gold");
	//Trees last 100% longer
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(6, 189, -1, -1, 2));
	e.EffectCommands.push_back(createEC(5, 123, -1, 13, 0.5));
	e.EffectCommands.push_back(createEC(5, 218, -1, 13, 0.5));
	addEffectandTech(df, e, "C-Bonus, Trees last 100% longer");
	//Stone resources last 30% longer
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(6, 79, -1, -1, 1.3));
	e.EffectCommands.push_back(createEC(5, 124, -1, 13, 0.769));
	e.EffectCommands.push_back(createEC(5, 220, -1, 13, 0.769));
	addEffectandTech(df, e, "C-Bonus, Stone resources last 30% longer");
	//Gold resources last 25% longer
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(6, 47, -1, -1, 1.25));
	e.EffectCommands.push_back(createEC(5, 579, -1, 13, 0.8));
	e.EffectCommands.push_back(createEC(5, 581, -1, 13, 0.8));
	addEffectandTech(df, e, "C-Bonus, Gold resources last 25% longer");
	//Berries +35% more food -- have to give foragers a different productivity resource (use with mayans too)
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(6, 198, -1, -1, 1.35));
	e.EffectCommands.push_back(createEC(5, 120, -1, 13, 0.741));
	e.EffectCommands.push_back(createEC(5, 354, -1, 13, 0.741));
	addEffectandTech(df, e, "C-Bonus, Berries contain +35% food");
	//Wild animals +50% more food
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(6, 199, -1, -1, 1.5));
	e.EffectCommands.push_back(createEC(5, 122, -1, 13, 0.66));
	e.EffectCommands.push_back(createEC(5, 216, -1, 13, 0.66));
	addEffectandTech(df, e, "C-Bonus, Wild animals contain +35% food");
	//Fish +35% more food
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(6, 200, -1, -1, 1.35));
	e.EffectCommands.push_back(createEC(5, 13, -1, 13, 0.741));
	e.EffectCommands.push_back(createEC(5, 56, -1, 13, 0.741));
	e.EffectCommands.push_back(createEC(5, 57, -1, 13, 0.741));
	addEffectandTech(df, e, "C-Bonus, Fish contain +35% food");
	//Units garrisoned in buildings heal 2x faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, -1, 52, 108, 2));
	e.EffectCommands.push_back(createEC(5, -1, 3, 108, 2));
	addEffectandTech(df, e, "C-Bonus, units heal faster");
	//Repairers work 50% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 156, -1, 13, 1.5));
	e.EffectCommands.push_back(createEC(5, 222, -1, 13, 1.5));
	addEffectandTech(df, e, "C-Bonus, repair 50% faster");
	//Skirmishers +1 attack vs infantry
	giveClassNewBonus(df, {6, 7, 1155}, 1);
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, 6, -1, 9, amountTypetoD(1, 1)));
	e.EffectCommands.push_back(createEC(4, 7, -1, 9, amountTypetoD(1, 1)));
	e.EffectCommands.push_back(createEC(4, 1155, -1, 9, amountTypetoD(1, 1)));
	addEffectandTech(df, e, "C-Bonus, Skirmishers +1 vs infantry");
	//Archery range units +1 pierce attack
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[2].size(); i++) {
		e.EffectCommands.push_back(createEC(4, unit_class[2][i], -1, 9, amountTypetoD(1, 3)));
	}
	addEffectandTech(df, e, "C-Bonus, ARRG units +1 attack");
	//Archery range units +1 melee armor per age (starting in Feudal)
	tech_ids.clear();
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[2].size(); i++) {
		e.EffectCommands.push_back(createEC(4, unit_class[2][i], -1, 8, amountTypetoD(1, 4)));
	}
	for (int i=0; i<3; i++) {
		tech_ids.push_back(addEffectandTech(df, e, "C-Bonus, +1 armor age " + to_string(i), {i+101}));
	}
	civ_bonuses.push_back(tech_ids);
	//Siege units +1 pierce armor in Castle and Imperial (+2 total)
	tech_ids.clear();
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[9].size(); i++) {
		e.EffectCommands.push_back(createEC(4, unit_class[9][i], -1, 8, amountTypetoD(1, 3)));
	}
	tech_ids.push_back(addEffectandTech(df, e, "C-Bonus, +1P armor age 3", {102}));
	tech_ids.push_back(addEffectandTech(df, e, "C-Bonus, +1P armor age 4", {103}));
	civ_bonuses.push_back(tech_ids);
	//Parthian tactics in Castle Age
	t = Tech();
	t.Name = "C-Bonus, Parthian tactics in Castle";
	t.Civ = 99;
	t.RequiredTechs.push_back(102);
	t.RequiredTechCount = 1;
	df->Techs.push_back(t);
	df->Techs[436].RequiredTechs[1] = (int) (df->Techs.size() - 1);
	civ_bonuses.push_back({(int) (df->Techs.size() - 1)});
	//Castle Age cost -25%
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(101, 102, 0, 1, -200));
	e.EffectCommands.push_back(createEC(101, 102, 3, 1, -50));
	addEffectandTech(df, e, "C-Bonus, Castle Age cost -25%");
	//Cavalry +1 attack
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 12, 9, amountTypetoD(1, 4)));
	e.EffectCommands.push_back(createEC(4, -1, 47, 9, amountTypetoD(1, 4)));
	e.EffectCommands.push_back(createEC(4, 1234, -1, 9, amountTypetoD(1, 31)));
	e.EffectCommands.push_back(createEC(4, 1236, -1, 9, amountTypetoD(1, 31)));
	addEffectandTech(df, e, "C-Bonus, Cavalry +1 attack");
	//Forging, iron casting, blast furnace add +1 damage vs buildings
	e.EffectCommands.clear();
	tech_ids.clear();
	e.EffectCommands.push_back(createEC(4, -1, 6, 9, amountTypetoD(1, 21)));
	e.EffectCommands.push_back(createEC(4, -1, 12, 9, amountTypetoD(1, 21)));
	e.EffectCommands.push_back(createEC(4, -1, 47, 9, amountTypetoD(1, 21)));
	tech_ids.push_back(addEffectandTech(df, e, "C-Bonus, +2 building attack age 2", {67}));
	tech_ids.push_back(addEffectandTech(df, e, "C-Bonus, +2 building attack age 3", {68}));
	tech_ids.push_back(addEffectandTech(df, e, "C-Bonus, +2 building attack age 4", {75}));
	civ_bonuses.push_back(tech_ids);
	//All buildings +3 pierce armor
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 3, 8, amountTypetoD(3, 3)));
	e.EffectCommands.push_back(createEC(4, -1, 52, 8, amountTypetoD(3, 3)));
	addEffectandTech(df, e, "C-Bonus, buildings +3 pierce armor");
	//Archer-line +5% speed per age (starting in Feudal)
	tech_ids.clear();
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 4, -1, 5, 1.05));
	e.EffectCommands.push_back(createEC(5, 24, -1, 5, 1.05));
	e.EffectCommands.push_back(createEC(5, 492, -1, 5, 1.05));
	tech_ids.push_back(addEffectandTech(df, e, "C-Bonus, Archers +5% speed", {101}));
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 4, -1, 5, 1.0476));
	e.EffectCommands.push_back(createEC(5, 24, -1, 5, 1.0476));
	e.EffectCommands.push_back(createEC(5, 492, -1, 5, 1.0476));
	tech_ids.push_back(addEffectandTech(df, e, "C-Bonus, Archers +10% speed", {102}));
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 4, -1, 5, 1.0455));
	e.EffectCommands.push_back(createEC(5, 24, -1, 5, 1.0455));
	e.EffectCommands.push_back(createEC(5, 492, -1, 5, 1.0455));
	tech_ids.push_back(addEffectandTech(df, e, "C-Bonus, Archers +15% speed", {103}));
	civ_bonuses.push_back(tech_ids);
	//Foot archers and skirms +1 vs villagers
	giveClassNewBonus(df, unit_class[6], 10);
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[6].size(); i++) {
		e.EffectCommands.push_back(createEC(4, unit_class[6][i], -1, 9, amountTypetoD(1, 10)));
	}
	addEffectandTech(df, e, "C-Bonus, foot archers +1 vs vils");
	//Gunpowder +10 bonus vs camels
	giveClassNewBonus(df, unit_class[5], 30);
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[5].size(); i++) {
		e.EffectCommands.push_back(createEC(4, unit_class[5][i], -1, 9, amountTypetoD(10, 30)));
	}
	addEffectandTech(df, e, "C-Bonus, gunpowder bonus vs camels");
	//Eagles +6 vs stone defenses
	giveClassNewBonus(df, unit_class[16], 13);
	giveClassNewBonus(df, unit_class[16], 22);
	giveClassNewBonus(df, unit_class[16], 26);
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[16].size(); i++) {
		e.EffectCommands.push_back(createEC(4, unit_class[16][i], -1, 9, amountTypetoD(6, 13)));
		e.EffectCommands.push_back(createEC(4, unit_class[16][i], -1, 9, amountTypetoD(3, 22)));
		e.EffectCommands.push_back(createEC(4, unit_class[16][i], -1, 9, amountTypetoD(6, 26)));
	}
	addEffectandTech(df, e, "C-Bonus, eagles bonus vs stone");
	//Scouts, Light Cavalry, Hussar +4 vs stone defenses
	custom_unit_class = {448, 546, 441, 1707};
	giveClassNewBonus(df, custom_unit_class, 13);
	giveClassNewBonus(df, custom_unit_class, 22);
	giveClassNewBonus(df, custom_unit_class, 26);
	e.EffectCommands.clear();
	for (int i=0; i<custom_unit_class.size(); i++) {
		e.EffectCommands.push_back(createEC(4, custom_unit_class[i], -1, 9, amountTypetoD(4, 13)));
		e.EffectCommands.push_back(createEC(4, custom_unit_class[i], -1, 9, amountTypetoD(2, 22)));
		e.EffectCommands.push_back(createEC(4, custom_unit_class[i], -1, 9, amountTypetoD(4, 26)));
	}
	addEffectandTech(df, e, "C-Bonus, scouts bonus vs stone");
	//Villagers work 5% faster
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, -1, 4, 13, 1.05));
	addEffectandTech(df, e, "C-Bonus, Vils work 5% faster");
	//Villagers +1 carry capacity per TC tech
	e.EffectCommands.clear();
	tech_ids.clear();
	e.EffectCommands.push_back(createEC(4, -1, 4, 14, 1));
	const vector<int> tctechs = {101, 102, 103, 22, 8, 280, 213, 249};
	for (int i=0; i<tctechs.size(); i++) {
		tech_ids.push_back(addEffectandTech(df, e, "C-Bonus, +1 capacity tctech " + to_string(i), {tctechs[i]}));
	}
	civ_bonuses.push_back(tech_ids);
	//Farms 10x HP
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 50, -1, 0, 10));
	e.EffectCommands.push_back(createEC(5, 1187, -1, 0, 10));
	addEffectandTech(df, e, "C-Bonus, Farms 10x HP");
	//Militia-line +2 vs cavalry
	e.EffectCommands.clear();
	custom_unit_class = {74, 75, 77, 473, 567};
	for (int i=0; i<custom_unit_class.size(); i++) {
		e.EffectCommands.push_back(createEC(4, custom_unit_class[i], -1, 9, amountTypetoD(2, 8)));
		e.EffectCommands.push_back(createEC(4, custom_unit_class[i], -1, 9, amountTypetoD(1, 30)));
	}
	addEffectandTech(df, e, "C-Bonus, Militia-line +2 vs cav");
	//Elite steppe lancer free
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(101, 715, 0, 0, 0));
	e.EffectCommands.push_back(createEC(101, 715, 3, 0, 0));
	e.EffectCommands.push_back(createEC(103, 715, -1, 0, 0));
	addEffectandTech(df, e, "C-Bonus, Elite steppe lancer free");
	//Steppe lancers +2 pierce armor
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[15].size(); i++) {
		e.EffectCommands.push_back(createEC(4, unit_class[15][i], -1, 8, amountTypetoD(2, 3)));
	}
	addEffectandTech(df, e, "C-Bonus, Steppe Lancers +2P armor");
	//Castles bonus vs buildings
	e.EffectCommands.clear();
	custom_unit_class = {82};
	giveClassNewBonus(df, custom_unit_class, 11);
	e.EffectCommands.push_back(createEC(4, 82, -1, 9, amountTypetoD(100, 11)));
	addEffectandTech(df, e, "C-Bonus, Castles bonus vs buildings");
	//All villagers work 10% faster in Imperial Age
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, -1, 4, 13, 1.1));
	civ_bonuses.push_back({addEffectandTech(df, e, "C-Bonus, vils work 10% faster in Imp", {103})});
	//Outposts +5 garrison space
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, 598, -1, 2, 5));
	addEffectandTech(df, e, "C-Bonus, Outposts garrison");
	//Builders/repairers +2 pierce armor
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, 118, -1, 8, amountTypetoD(2, 3)));
	e.EffectCommands.push_back(createEC(4, 212, -1, 8, amountTypetoD(2, 3)));
	e.EffectCommands.push_back(createEC(4, 156, -1, 8, amountTypetoD(2, 3)));
	e.EffectCommands.push_back(createEC(4, 222, -1, 8, amountTypetoD(2, 3)));
	addEffectandTech(df, e, "C-Bonus, Builders/Repairers +2P armor");
	//Castles support 40 population
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, 82, -1, 21, 20));
	addEffectandTech(df, e, "C-Bonus, Castles 40 pop");
	//Bombard towers bonus vs rams
	custom_unit_class = {236};
	giveClassNewBonus(df, custom_unit_class, 17);
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, 236, -1, 9, amountTypetoD(30, 17)));
	addEffectandTech(df, e, "C-Bonus, Bombard towers bonus vs rams");
	//Towers bonus vs cavalry
	giveClassNewBonus(df, 52, 8);
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 52, 9, amountTypetoD(8, 8)));
	addEffectandTech(df, e, "C-Bonus, Towers bonus vs cavalry");
	//Feudal monks
	tech_ids.clear();
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(2, 648, 1, -1, 0));
	e.Name = "Feudal Monk (make avail)";
	df->Effects.push_back(e);
	t = Tech();
	t.Name = "Feudal Monk (make avail)";
	t.RequiredTechs.push_back(101);
	t.RequiredTechCount = 1;
	t.Civ = 99;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);
	tech_ids.push_back((int) (df->Techs.size() - 1));
	t = Tech();
	t.Name = "C-Bonus, Feudal Monastery";
	t.RequiredTechs.push_back(101);
	t.RequiredTechCount = 1;
	t.Civ = 99;
	t.EffectID = 199;
	df->Techs.push_back(t);
	tech_ids.push_back((int) (df->Techs.size() - 1));
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(3, 648, 125, -1, 0));
	e.Name = "Upgrade monks Castle";
	df->Effects.push_back(e);
	t = Tech();
	t.Name = "Upgrade monks Castle";
	t.RequiredTechs.push_back(102);
	t.RequiredTechs.push_back(tech_ids[0]);
	t.RequiredTechCount = 2;
	t.Civ = 99;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);
	tech_ids.push_back((int) (df->Techs.size() - 1));
	t = Tech();
	t.Name = "Feudal Monastery built";
	t.RequiredTechs.push_back(107);
	t.RequiredTechCount = 1;
	t.Civ = 99;
	df->Techs.push_back(t);
	df->Techs[135].RequiredTechs[5] = (int) (df->Techs.size() - 1);
	tech_ids.push_back((int) (df->Techs.size() - 1));
	civ_bonuses.push_back(tech_ids);
	//Scorpions and ballistas produced 50% faster
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[13].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_class[13][i], -1, 101, 0.66));
	}
	addEffectandTech(df, e, "C-Bonus, Scorpions produced 50% faster");
	//Town Centers fire faster
	custom_unit_class = {71, 109, 141, 142};
	e.EffectCommands.clear();
	for (int i=0; i<custom_unit_class.size(); i++) {
		e.EffectCommands.push_back(createEC(5, custom_unit_class[i], -1, 10, 0.8));
	}
	addEffectandTech(df, e, "C-Bonus, TCs fire 25% faster");
	//Trebuchets -75 gold
	e.EffectCommands.clear();
	custom_unit_class = {42, 331, 1690, 1691};
	for (int i=0; i<custom_unit_class.size(); i++) {
		e.EffectCommands.push_back(createEC(4, custom_unit_class[i], -1, 105, -75));
	}
	addEffectandTech(df, e, "C-Bonus, Trebuchets -75 gold");
	//All explosive units +blast radius
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[12].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_class[12][i], -1, 22, 2));
	}
	addEffectandTech(df, e, "C-Bonus, Explosive units +blast radius");
	//Gunpowder bonus vs buildings
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[5].size(); i++) {
		e.EffectCommands.push_back(createEC(4, unit_class[5][i], -1, 9, amountTypetoD(12, 11)));
	}
	addEffectandTech(df, e, "C-Bonus, Gunpowder bonus vs buildings");
	//Eagles +1 pierce armor
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[16].size(); i++) {
		e.EffectCommands.push_back(createEC(4, unit_class[16][i], -1, 8, amountTypetoD(1, 3)));
	}
	addEffectandTech(df, e, "C-Bonus, Eagles +1P armor");

		//City Walls (Team Bonus, putting this before university tech bonuses)
	for (Civ &civ : df->Civs) {
		civ.Units[370].Creatable.TrainLocationID = 118;
		civ.Units[370].Creatable.ButtonID = 8;
		civ.Units[370].HitPoints = 4200;
		civ.Units[370].Creatable.DisplayedPierceArmour = 16;
		civ.Units[370].Type50.DisplayedMeleeArmour = 16;
		civ.Units[370].Type50.Armours = civ.Units[155].Type50.Armours;
		civ.Units[370].Type50.Armours[2].Amount = 16;
		civ.Units[370].Type50.Armours[3].Amount = 16;
		civ.Units[370].Type50.Armours[6].Amount = 16;
		civ.Units[370].Creatable.ResourceCosts[0].Amount = 5;
		for (int i=0; i<16; i++) {
			civ.Units[i+1579].Type50.Armours[1].Amount = 30;
			civ.Units[i+1579].Creatable.ResourceCosts[0].Amount = 30;
		}
		civ.Units[1582].Creatable.ButtonID = 11;
	}

	e.EffectCommands.clear();
	e.Name = "City Wall";
	const vector<vector<int>> wall_upgrades = {{117, 155, 370}, {64, 63, 1579}, {78, 67, 1580}, {81, 80, 1581}, {487, 488, 1582}, {88, 85, 1583}, {91, 90, 1584}, {95, 92, 1585}, {490, 491, 1586}, {659, 660, 1587},
		{661, 662, 1588}, {663, 664, 1589}, {665, 666, 1590}, {667, 668, 1591}, {669, 670, 1592}, {671, 672, 1593}, {673, 674, 1594}};
	for (int i=0; i<wall_upgrades.size(); i++) {
		e.EffectCommands.push_back(createEC(3, wall_upgrades[i][0], wall_upgrades[i][2], -1, 0));
		e.EffectCommands.push_back(createEC(3, wall_upgrades[i][1], wall_upgrades[i][2], -1, 0));
	}
	df->Effects.push_back(e);
	t = df->Techs[194];
	t.Name = "City Wall";
	t.LanguageDLLName = 7603;
	t.LanguageDLLDescription = 8603;
	t.LanguageDLLHelp = 107603;
	t.LanguageDLLTechTree = 157603;
	t.RequiredTechs[0] = 103;
	t.RequiredTechs[1] = 194;
	t.RequiredTechCount = 2;
	t.ResourceCosts[0].Amount = 400;
	t.ResourceCosts[1].Amount = 400;
	t.ResearchTime = 200;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);
	university_techs.push_back((int) (df->Techs.size() - 1));

	e.EffectCommands.clear();
	e.Name = "City Wall (disable)";
	e.EffectCommands.push_back(createEC(102, -1, -1, -1, ((int) (df->Techs.size() - 1))));
	df->Effects.push_back(e);
	t = df->Techs[656];
	t.Name = "City Wall (disable)";
	t.RequiredTechs[0] = 194;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);

	e.EffectCommands.clear();
	e.Name = "Team Bonus, City Wall";
	e.EffectCommands.push_back(createEC(102, -1, -1, -1, ((int) (df->Techs.size() - 1))));
	df->Effects.push_back(e);
	team_bonuses.push_back(df->Effects.size() - 1);

	//Gunpowder units +1 attack per university tech
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[5].size(); i++) {
		int attack_type = -1;
		for (int j=0; j<df->Civs[0].Units[unit_class[5][i]].Type50.Attacks.size(); j++) {
			unit::AttackOrArmor attack = df->Civs[0].Units[unit_class[5][i]].Type50.Attacks[j];
			if (((attack.Class == 4) || (attack.Class == 3) || (attack.Class == 31)) && (attack.Amount != 0)) {
				attack_type = attack.Class;
			}
		}
		if (attack_type != -1) {
			e.EffectCommands.push_back(createEC(4, unit_class[5][i], -1, 9, amountTypetoD(1, attack_type)));
		}
	}
	tech_ids.clear();
	for (int i=0; i<university_techs.size(); i++) {
		e.Name = "Gunpowder +1 attack for uni tech " + to_string(i);
		df->Effects.push_back(e);
		Tech attack_tech = Tech();
		attack_tech.Name = "Gunpowder +1 attack for uni tech " + to_string(i);
		attack_tech.RequiredTechs.push_back(university_techs[i]);
		attack_tech.RequiredTechCount = 1;
		attack_tech.Civ = 99;
		attack_tech.EffectID = (df->Effects.size() - 1);
		df->Techs.push_back(attack_tech);
		tech_ids.push_back((int) (df->Techs.size() - 1));
	}
	civ_bonuses.push_back(tech_ids);
	//Buildings +3% HP per university tech (cumulative)
	e.EffectCommands.clear();
	custom_unit_class = {3, 27, 39, 49, 52};
	for (int i=0; i<custom_unit_class.size(); i++) {
		e.EffectCommands.push_back(createEC(5, -1, custom_unit_class[i], 0, 1.03));
	}
	tech_ids.clear();
	for (int i=0; i<university_techs.size(); i++) {
		e.Name = "Building +3% armor for uni tech " + to_string(i);
		df->Effects.push_back(e);
		Tech hp_tech = Tech();
		hp_tech.Name = "Building +3% armor for uni tech " + to_string(i);
		hp_tech.RequiredTechs.push_back(university_techs[i]);
		hp_tech.RequiredTechCount = 1;
		hp_tech.Civ = 99;
		hp_tech.EffectID = (df->Effects.size() - 1);
		df->Techs.push_back(hp_tech);
		tech_ids.push_back((int) (df->Techs.size() - 1));
	}
	civ_bonuses.push_back(tech_ids);
	//Each monastery tech spawns a monk
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(1, 234, 0, -1, 1));
	e.EffectCommands.push_back(createEC(7, 125, 104, 1, 0));
	const vector<int> monastery_techs = {316, 319, 441, 439, 231, 252, 45, 233, 230, 438};
	tech_ids.clear();
	for (int i=0; i<monastery_techs.size(); i++) {
		e.Name = "Monk for church tech " + to_string(i);
		df->Effects.push_back(e);
		Tech monk_tech = Tech();
		monk_tech.Name = "Monk for church tech " + to_string(i);
		monk_tech.RequiredTechs.push_back(monastery_techs[i]);
		monk_tech.RequiredTechCount = 1;
		monk_tech.Civ = 99;
		monk_tech.EffectID = (df->Effects.size() - 1);
		df->Techs.push_back(monk_tech);
		tech_ids.push_back((int) (df->Techs.size() - 1));
	}
	civ_bonuses.push_back(tech_ids);

		//New Team Bonuses
	//Outposts don't cost stone
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, 598, -1, 106, -5));
	addEffectandTB(df, e, "Outposts don't cost stone");
	//Trade +50 HP
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 2, 0, 50));
	e.EffectCommands.push_back(createEC(4, -1, 19, 0, 50));
	addEffectandTB(df, e, "Trade +50 HP");
	//Houses built +100% faster
	e.EffectCommands.clear();
	for (int i=4; i<unit_sets[0].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_sets[0][i], -1, 101, 0.5));
	}
	addEffectandTB(df, e, "Houses built +100% faster");
	//Monks +2 LOS
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 18, 1, 2));
	e.EffectCommands.push_back(createEC(4, -1, 43, 1, 2));
	e.EffectCommands.push_back(createEC(4, warmonkID, -1, 1, 2));
	e.EffectCommands.push_back(createEC(4, warmonkID + 1, -1, 1, 2));
	addEffectandTB(df, e, "Monks +2 LOS");
	//Herdables +2 LOS
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 58, 1, 2));
	addEffectandTB(df, e, "Herdables +2 LOS");
	//Economic buildings built +100% faster
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[11].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_class[11][i], -1, 101, 0.5));
	}
	addEffectandTB(df, e, "Drop-off buildings built +100% faster");
	//Unique units +5% HP
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[14].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_class[14][i], -1, 0, 1.05));
	}
	addEffectandTB(df, e, "Unique units +5% HP");
	//Trash units train 20% faster
	e.EffectCommands.clear();
	custom_unit_class = {448, 546, 441, 1707, 93, 358, 359, 1182, 1183, 1184, vilspear, vilpike, vilhalb, 6, 7, 1155};
	for (int i=0; i<custom_unit_class.size(); i++) {
		e.EffectCommands.push_back(createEC(5, custom_unit_class[i], -1, 101, 0.833));
	}
	addEffectandTB(df, e, "Trash units train 20% faster");
	//Fishing ships +2 LOS
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 21, 1, 2));
	addEffectandTB(df, e, "Fishing ships +2 LOS");
	//Scout-line +2 vs gunpowder
	custom_unit_class = {448, 546, 441, 1707};
	giveClassNewBonus(df, custom_unit_class, 23);
	e.EffectCommands.clear();
	for (int i=0; i<custom_unit_class.size(); i++) {
		e.EffectCommands.push_back(createEC(4, custom_unit_class[i], -1, 9, amountTypetoD(2, 23)));
	}
	addEffectandTB(df, e, "Scout-line +2 vs. gunpowder");
	//Infantry +5 vs elephants
	giveClassNewBonus(df, 6, 5);
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 6, 9, amountTypetoD(5, 5)));
	addEffectandTB(df, e, "Infantry +5 vs. elephants");
	//All explosive units +20% speed
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[12].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_class[12][i], -1, 5, 1.2));
	}
	addEffectandTB(df, e, "Explosive units +20% speed");
	//All resources last 5% longer
	e.EffectCommands.clear();
	for (int i=0; i<productivity_rates.size(); i++) {
		e.EffectCommands.push_back(createEC(6, productivity_rates[i], -1, -1, 1.05));
	}
	for (int i=0; i<gather_rates.size(); i++) {
		e.EffectCommands.push_back(createEC(5, gather_rates[i], -1, 13, 0.95238));
	}
	addEffectandTB(df, e, "Resources last 5% longer");
	//Castles, Kreposts, Donjons work 10% faster
	e.EffectCommands.clear();
	custom_unit_class = {82, 1251, 1665};
	for (int i=0; i<custom_unit_class.size(); i++) {
		e.EffectCommands.push_back(createEC(5, custom_unit_class[i], -1, 13, 1.1));
	}
	addEffectandTB(df, e, "Stone production buildings work 10% faster");
	//Markets +80% work rate
	e.EffectCommands.clear();
	for (int i=4; i<unit_sets[13].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_sets[13][i], -1, 13, 1.8));
	}
	addEffectandTB(df, e, "Markets +80% work rate");
	//Steppe Lancers +3 LOS
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[15].size(); i++) {
		e.EffectCommands.push_back(createEC(4, unit_class[15][i], -1, 1, 3));
	}
	addEffectandTB(df, e, "Steppe Lancers +3 LOS");
	//Spearmen +3 vs cavalry
	e.EffectCommands.clear();
	custom_unit_class = {93, 358, 359, 1182, 1183, 1184, vilspear, vilpike, vilhalb};
	for (int i=0; i<custom_unit_class.size(); i++) {
		e.EffectCommands.push_back(createEC(4, custom_unit_class[i], -1, 9, amountTypetoD(3, 8)));
	}
	addEffectandTB(df, e, "Spearmen +3 vs. cavalry");
	//Elephants +4 vs buildings
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[4].size(); i++) {
		e.EffectCommands.push_back(createEC(4, unit_class[4][i], -1, 9, amountTypetoD(4, 21)));
	}
	addEffectandTB(df, e, "Elephants +4 vs. buildings");
	//Eagles +2 LOS
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[16].size(); i++) {
		e.EffectCommands.push_back(createEC(4, unit_class[16][i], -1, 1, 2));
	}
	addEffectandTB(df, e, "Eagles +2 LOS");
	//Docks +20% work rate
	e.EffectCommands.clear();
	for (int i=4; i<unit_sets[5].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_sets[5][i], -1, 13, 1.2));
	}
	addEffectandTB(df, e, "Docks +20% work rate");
	//Monasteries 3x HP
	e.EffectCommands.clear();
	for (int i=4; i<unit_sets[14].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_sets[14][i], -1, 0, 3));
	}
	addEffectandTB(df, e, "Monasteries 3x HP");
	//Markets 3x HP
	e.EffectCommands.clear();
	for (int i=4; i<unit_sets[13].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_sets[13][i], -1, 0, 3));
	}
	addEffectandTB(df, e, "Markets 3x HP");
	//Explosive units +6 LOS
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[12].size(); i++) {
		e.EffectCommands.push_back(createEC(4, unit_class[12][i], -1, 1, 6));
	}
	addEffectandTB(df, e, "Explosive units +6 LOS");
	//Outposts constructed almost instantly
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 598, -1, 101, 0.1));
	addEffectandTB(df, e, "Outposts built quickly");
	//Siege Towers cost no gold
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(0, 1105, -1, 105, 0));
	addEffectandTB(df, e, "Siege towers cost no gold");
	//Docks built 100% faster
	e.EffectCommands.clear();
	for (int i=4; i<unit_sets[5].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_sets[5][i], -1, 101, 0.5));
	}
	addEffectandTB(df, e, "Docks built 100% faster");
	//Infantry +2 LOS
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(4, -1, 6, 1, 2));
	addEffectandTB(df, e, "Infantry +2 LOS");
	//Trade carts 20% faster when empty
	e.EffectCommands.clear();
	e.EffectCommands.push_back(createEC(5, 128, -1, 5, 1.2));
	e.EffectCommands.push_back(createEC(5, 128, -1, 13, 1.2));
	addEffectandTB(df, e, "Trade 20% faster when empty");
	//Explosive units +40% HP
	e.EffectCommands.clear();
	for (int i=0; i<unit_class[12].size(); i++) {
		e.EffectCommands.push_back(createEC(5, unit_class[12][i], -1, 0, 1.4));
	}
	addEffectandTB(df, e, "Explosive units +40% HP");
	//Town Centers +4 LOS
	e.EffectCommands.clear();
	for (int i=4; i<unit_sets[6].size(); i++) {
		e.EffectCommands.push_back(createEC(4, unit_sets[6][i], -1, 1, 4));
	}
	addEffectandTB(df, e, "Town Centers +4 LOS");
	//Unique Unit Elite Upgrade costs -20%
	e.EffectCommands.clear();
	addEffectandTB(df, e, "Elite costs -20%");
	//Imperial Scorpion
	for (Civ &civ : df->Civs) {
		civ.Units[1179] = civ.Units[542];
		civ.Units[1179].Name = "IMPBAL";
		civ.Units[1179].LanguageDLLName = 5240;
		civ.Units[1179].LanguageDLLCreation = 6240;
		civ.Units[1179].LanguageDLLHelp = 105240;
		civ.Units[1179].HitPoints = 60;
		civ.Units[1179].Type50.DisplayedAttack = 18;
		civ.Units[1179].Type50.Attacks[3].Amount = 18;
		civ.Units[1179].Type50.ProjectileUnitID = 1113;
		civ.Units[1179].Creatable.SecondaryProjectileUnit = 1113;
		civ.Units[1113].Name = "Projectile Imperial Scorpion";
		civ.Units[1114].Name = "Projectile Imperial Scorpion (Fire)";
		civ.Units[1113].Type50.DisplayedAttack = 14;
		civ.Units[1113].Type50.Attacks[2].Amount = 14;
		civ.Units[1114].Type50.DisplayedAttack = 14;
		civ.Units[1114].Type50.Attacks[2].Amount = 14;
	}
	df->Effects[47].EffectCommands.push_back(createEC(3, 1113, 1114, -1, 0));
	df->Effects[47].EffectCommands.push_back(createEC(4, 1179, -1, 9, amountTypetoD(1, 3)));

	e.EffectCommands.clear();
	e.Name = "Imperial Scorpion";
	e.EffectCommands.push_back(createEC(3, 279, 1179, -1, 0));
	e.EffectCommands.push_back(createEC(3, 542, 1179, -1, 0));
	df->Effects.push_back(e);
	t = df->Techs[239];
	t.Name = "Imperial Scorpion";
	t.LanguageDLLName = 7600;
	t.LanguageDLLDescription = 8600;
	t.LanguageDLLHelp = 107600;
	t.LanguageDLLTechTree = 157600;
	t.RequiredTechs[1] = 239;
	t.ResourceCosts[0].Amount = 1500;
	t.ResourceCosts[1].Amount = 1600;
	t.ResearchTime = 150;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);

	e.EffectCommands.clear();
	e.Name = "Imperial Scorpion (disable)";
	e.EffectCommands.push_back(createEC(102, -1, -1, -1, ((int) (df->Techs.size() - 1))));
	df->Effects.push_back(e);
	t = df->Techs[656];
	t.Name = "Imperial Scorpion (disable)";
	t.RequiredTechs[0] = 239;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);

	e.EffectCommands.clear();
	e.Name = "Team Bonus, Imperial Scorpion";
	e.EffectCommands.push_back(createEC(102, -1, -1, -1, ((int) (df->Techs.size() - 1))));
	df->Effects.push_back(e);
	team_bonuses.push_back(df->Effects.size() - 1);

	//Royal Battle Elephant
	for (Civ &civ : df->Civs) {
		civ.Units[1180] = civ.Units[1134];
		civ.Units[1180].Name = "RBATELE";
		civ.Units[1180].LanguageDLLName = 5241;
		civ.Units[1180].LanguageDLLCreation = 6241;
		civ.Units[1180].LanguageDLLHelp = 105241;
		civ.Units[1180].StandingGraphic = {2926, -1};
		civ.Units[1180].Type50.AttackGraphic = 2924;
		civ.Units[1180].DyingGraphic = 2925;
		civ.Units[1180].DeadFish.WalkingGraphic = 2927;
		civ.Units[1180].HitPoints = 400;
		civ.Units[1180].Type50.DisplayedAttack = 16;
		civ.Units[1180].Type50.Attacks[1].Amount = 16;
		civ.Units[1180].Creatable.DisplayedPierceArmour = 4;
		civ.Units[1180].Type50.Armours[3].Amount = 4;
	}

	e.EffectCommands.clear();
	e.Name = "Royal Battle Elephant";
	e.EffectCommands.push_back(createEC(3, 1132, 1180, -1, 0));
	e.EffectCommands.push_back(createEC(3, 1134, 1180, -1, 0));
	df->Effects.push_back(e);
	t = df->Techs[631];
	t.Name = "Royal Battle Elephant";
	t.LanguageDLLName = 7601;
	t.LanguageDLLDescription = 8601;
	t.LanguageDLLHelp = 107601;
	t.LanguageDLLTechTree = 157601;
	t.RequiredTechs[1] = 631;
	t.ResourceCosts[0].Amount = 1500;
	t.ResourceCosts[1].Amount = 1200;
	t.ResearchTime = 200;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);

	for (Effect &effect : df->Effects) {
		if (effect.Name == "C-Bonus, Free techs (set 2) 9") {
			for (int i=0; i<4; i++) {
				effect.EffectCommands.push_back(createEC(101, (int) (df->Techs.size() - 1), i, 0, 0));
			}
			effect.EffectCommands.push_back(createEC(103, (int) (df->Techs.size() - 1), -1, 0, 1));
		}
	}

	e.EffectCommands.clear();
	e.Name = "Royal Battle Elephant (disable)";
	e.EffectCommands.push_back(createEC(102, -1, -1, -1, ((int) (df->Techs.size() - 1))));
	df->Effects.push_back(e);
	t = df->Techs[656];
	t.Name = "Royal Battle Elephant (disable)";
	t.RequiredTechs[0] = 631;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);

	e.EffectCommands.clear();
	e.Name = "Team Bonus, Royal Battle Elephant";
	e.EffectCommands.push_back(createEC(102, -1, -1, -1, ((int) (df->Techs.size() - 1))));
	df->Effects.push_back(e);
	team_bonuses.push_back(df->Effects.size() - 1);

	//Royal Lancer Cavalry
	for (Civ &civ : df->Civs) {
		civ.Units[1181] = civ.Units[1372];
		civ.Units[1181].Name = "RSLANCER";
		civ.Units[1181].LanguageDLLName = 5242;
		civ.Units[1181].LanguageDLLCreation = 6242;
		civ.Units[1181].LanguageDLLHelp = 105242;
		civ.Units[1181].StandingGraphic = {10510, 10511};
		civ.Units[1181].Type50.AttackGraphic = 10508;
		civ.Units[1181].DyingGraphic = 10509;
		civ.Units[1181].DeadFish.WalkingGraphic = 10513;
		civ.Units[1181].HitPoints = 100;
		civ.Units[1181].Type50.DisplayedAttack = 13;
		civ.Units[1181].Type50.Attacks[0].Amount = 13;
	}

	e.EffectCommands.clear();
	e.Name = "Royal Lancer";
	e.EffectCommands.push_back(createEC(3, 1370, 1181, -1, 0));
	e.EffectCommands.push_back(createEC(3, 1372, 1181, -1, 0));
	df->Effects.push_back(e);
	t = df->Techs[715];
	t.Name = "Royal Lancer";
	t.LanguageDLLName = 7602;
	t.LanguageDLLDescription = 8602;
	t.LanguageDLLHelp = 107602;
	t.LanguageDLLTechTree = 157602;
	t.RequiredTechs[1] = 715;
	t.ResourceCosts[0].Amount = 1200;
	t.ResourceCosts[1].Amount = 900;
	t.ResearchTime = 100;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);

	for (Effect &effect : df->Effects) {
		if (effect.Name == "C-Bonus, Elite steppe lancer free") {
			for (int i=0; i<4; i++) {
				effect.EffectCommands.push_back(createEC(101, (int) (df->Techs.size() - 1), i, 0, 0));
			}
			effect.EffectCommands.push_back(createEC(103, (int) (df->Techs.size() - 1), -1, 0, 1));
		}
	}

	e.EffectCommands.clear();
	e.Name = "Royal Lancer (disable)";
	e.EffectCommands.push_back(createEC(102, -1, -1, -1, ((int) (df->Techs.size() - 1))));
	df->Effects.push_back(e);
	t = df->Techs[656];
	t.Name = "Royal Lancer (disable)";
	t.RequiredTechs[0] = 715;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);

	e.EffectCommands.clear();
	e.Name = "Team Bonus, Royal Lancer";
	e.EffectCommands.push_back(createEC(102, -1, -1, -1, ((int) (df->Techs.size() - 1))));
	df->Effects.push_back(e);
	team_bonuses.push_back(df->Effects.size() - 1);

	//Can recruit spearmen in TCs
	for (Civ &civ : df->Civs) {
		civ.Units[1182] = civ.Units[93];
		civ.Units[1183] = civ.Units[358];
		civ.Units[1184] = civ.Units[359];
		civ.Units[1182].Name = "TCPKEMN";
		civ.Units[1183].Name = "TCPKM";
		civ.Units[1184].Name = "TCHLBDM";
		civ.Units[1182].Creatable.TrainLocationID = 109;
		civ.Units[1183].Creatable.TrainLocationID = 109;
		civ.Units[1184].Creatable.TrainLocationID = 109;
	}
	df->Effects[190].EffectCommands.push_back(createEC(3, 1182, 1183, -1, 0));
	df->Effects[189].EffectCommands.push_back(createEC(3, 1182, 1184, -1, 0));
	df->Effects[189].EffectCommands.push_back(createEC(3, 1183, 1184, -1, 0));

	e.EffectCommands.clear();
	e.Name = "TC Spearman (make available)";
	e.EffectCommands.push_back(createEC(2, 1182, 1, -1, 0));
	df->Effects.push_back(e);
	t = df->Techs[113];
	t.Name = "Dupl. Feudal Age";
	t.RequiredTechs[0] = 101;
	df->Techs.push_back(t);

	t = df->Techs[522];
	t.Name = "TC Spearman (make available)";
	t.RequiredTechs[0] = (int) (df->Techs.size() - 1);
	t.RequiredTechs[1] = 87;
	t.RequiredTechCount = 2;
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);

	e.EffectCommands.clear();
	e.Name = "Team Bonus, TC Spearman";
	e.EffectCommands.push_back(createEC(101, (int) (df->Techs.size() - 1), 0, 0, 0));
	e.EffectCommands.push_back(createEC(103, (int) (df->Techs.size() - 1), -1, 0, 0));
	df->Effects.push_back(e);
	team_bonuses.push_back(df->Effects.size() - 1);

	//Canoes (stats need adjustment -- make it a trash boat)
	for (Civ &civ : df->Civs) {
		civ.Units[778].Creatable.ButtonID = 14;
		civ.Units[778].Creatable.TrainLocationID = 45;
	}

	e.EffectCommands.clear();
	e.Name = "Canoe (make available)";
	e.EffectCommands.push_back(createEC(2, 778, 1, -1, 0));
	df->Effects.push_back(e);
	t = df->Techs[113];
	t.Name = "Dupl.2 Feudal Age";
	t.RequiredTechs[0] = 101;
	df->Techs.push_back(t);

	t = df->Techs[522];
	t.Name = "Canoe (make available)";
	t.RequiredTechs[0] = (int) (df->Techs.size() - 1);
	t.EffectID = (df->Effects.size() - 1);
	df->Techs.push_back(t);

	e.EffectCommands.clear();
	e.Name = "Team Bonus, Canoe";
	e.EffectCommands.push_back(createEC(101, (int) (df->Techs.size() - 1), 0, 0, 0));
	e.EffectCommands.push_back(createEC(103, (int) (df->Techs.size() - 1), -1, 0, 0));
	df->Effects.push_back(e);
	team_bonuses.push_back(df->Effects.size() - 1);

	//Scouts +1 attack vs. archers
	team_bonuses.push_back(802);

	//Folwark replaces Mill
	civ_bonuses.push_back({793, 794, 795, 796, 797, 798, 799, 818, 819, 820, 821});
	//Stone miners generate gold
	tech_ids = {805, 806, 807};

	e.EffectCommands.clear();
	e.Name = "Stone mining C-Bonus gold generation increase";
	e.EffectCommands.push_back(createEC(6, 241, -1, -1, 1.2));
	df->Effects.push_back(e);

	t = Tech();
	t.Name = "Stone mining C-Bonus gold generation increase";
	t.RequiredTechs.push_back(805);
	t.RequiredTechCount = 1;
	t.EffectID = (df->Effects.size() - 1);
	t.Civ = 99;
	df->Techs.push_back(t);
	tech_ids.push_back((int) (df->Techs.size() - 1));

	civ_bonuses.push_back(tech_ids);
	//Winged Hussar replaces Hussar
	civ_bonuses.push_back({789, 791});
	//Chemistry in Castle Age
	civ_bonuses.push_back({800, 801});
	//Spearman-line deals +25% bonus damage
	civ_bonuses.push_back({802});
	//Fervor and Sanctity affects villagers
	civ_bonuses.push_back({803, 804});
	//Houfnice
	civ_bonuses.push_back({787});

	//Explosive units can blast trees
	//Scorpions and ballistas get ballistics (?)
	//Can regarrison production buildings (?)
	//Fishing ships can garrison in docks (?)
	//Mills 2x HP, can garrison 10 villagers
	//Explosive units and non-garrisonable siege in can garrison in siege towers (?)


	//Basic units/buildings are disableable
	const vector<int> disableIDs = {74, 13, 545, 45, 70, 72};
	const vector<int> palisadeGates = {789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804};
	const vector<int> enablingTechs = {414, 339, 391, 410, 411, 413};

	for (Civ &civ : df->Civs) {
		for (int i=0; i<disableIDs.size(); i++) {
			civ.Units[disableIDs[i]].Enabled = 0;
		}
		for (int i=0; i<palisadeGates.size(); i++) {
			civ.Units[palisadeGates[i]].Enabled = 0;
		}
	}
	for (int i=0; i<enablingTechs.size(); i++) {
		Effect enableUnit = Effect();
		enableUnit.Name = to_string(i) + " (make avail)";
		enableUnit.EffectCommands.push_back(createEC(2, disableIDs[i], 1, -1, 0));
		if (i == enablingTechs.size() - 1) {
			for (int j=0; j<palisadeGates.size(); j++) {
				enableUnit.EffectCommands.push_back(createEC(2, palisadeGates[j], 1, -1, 0));
			}
		}
		df->Effects.push_back(enableUnit);
		df->Techs[enablingTechs[i]].Name = to_string(i) + " (make avail)";
		df->Techs[enablingTechs[i]].EffectID = (df->Effects.size() - 1);
		df->Techs[enablingTechs[i]].Civ = -1;
		df->Techs[enablingTechs[i]].RequiredTechCount = 0;
	}
}

void assignCivBonuses (DatFile *df, Value cfg) {
	for (int i=0; i<cfg["civ_bonus"].size(); i++) {
		for (int j=0; j<cfg["civ_bonus"][i].size(); j++) {

			//Actually give the techs associated with that bonus
			int civ_bonus_index = cfg["civ_bonus"][i][j].asInt();
			for (int k=0; k<civ_bonuses[civ_bonus_index].size(); k++) {
				allocateTech(df, civ_bonuses[civ_bonus_index][k], i+1);
			}

			//Apply extra necessary effects
			int unique_index = cfg["techtree"][i][0].asInt();
			int unique_unit = df->Effects[df->Techs[uu_tech_ids[unique_index][0]].EffectID].EffectCommands[0].A;
			int unique_elite = df->Effects[df->Techs[uu_tech_ids[unique_index][1]].EffectID].EffectCommands[0].B;
			switch (civ_bonus_index) {
				case 0: {
					Civ &civ = df->Civs[i+1];
					break;
				}
				//Add villagers to garrison class
				case 80: {
					Civ &civ = df->Civs[i+1];
					for (int k=0; k<houses.size(); k++) {
						civ.Units[houses[k]].Building.GarrisonType = 1;
					}
					break;
				}
				//If they have Kreposts, let them train their unique unit in them!
				case 93: {
					for (Civ &civ : df->Civs) {
						civ.Units[1254] = civ.Units[unique_unit];
						civ.Units[1254].Name = "KREPOSTUNIT";
						civ.Units[1254].Creatable.TrainLocationID = 1251;
						civ.Units[1254].Creatable.ButtonID = 1;
						civ.Units[1255] = civ.Units[unique_elite];
						civ.Units[1255].Name = "EKREPOSTUNIT";
						civ.Units[1255].Creatable.TrainLocationID = 1251;
						civ.Units[1255].Creatable.ButtonID = 1;
					}

					EffectCommand upgrade_unique = createEC(3, 1254, 1255, -1, 0);
					df->Effects[df->Techs[uu_tech_ids[unique_index][1]].EffectID].EffectCommands.push_back(upgrade_unique);
					break;
				}
				//If they have Donjons, let them train their unique unit in them!
				case 109: {
					for (Civ &civ : df->Civs) {
						civ.Units[1660] = civ.Units[unique_unit];
						civ.Units[1660].Name = "DONJONUNIT";
						civ.Units[1660].Creatable.TrainLocationID = 1665;
						civ.Units[1660].Creatable.ButtonID = 1;
						civ.Units[1661] = civ.Units[unique_elite];
						civ.Units[1661].Name = "EDONJONUNIT";
						civ.Units[1661].Creatable.TrainLocationID = 1665;
						civ.Units[1661].Creatable.ButtonID = 1;
					}

					EffectCommand upgrade_unique = createEC(3, 1660, 1661, -1, 0);
					df->Effects[df->Techs[uu_tech_ids[unique_index][1]].EffectID].EffectCommands.push_back(upgrade_unique);

					if (unique_unit != 1658) {
						//Only available in Castle Age
						df->Techs[civ_bonuses[109][1]].RequiredTechs[0] = 102;
					}
					break;
				}
				//Wonder provides +50 bonus pop
				case 140: {
					//Use the "ore storage" resource to cap at 1 wonder
					Civ &civ = df->Civs[i+1];
					civ.Resources[56] = 2.1;
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
				//Eco buildings provide +5 pop space
				case 144: {
					Civ &civ = df->Civs[i+1];
					for (int k=0; k<unit_class[11].size(); k++) {
						civ.Units[unit_class[11][k]].ResourceStorages[0].Type = 4;
						civ.Units[unit_class[11][k]].ResourceStorages[0].Amount = 5;
						civ.Units[unit_class[11][k]].ResourceStorages[0].Flag = 4;
					}
					const vector<int> docks = {45, 47, 51, 133, 805, 806, 807, 808};
					for (int k=0; k<docks.size(); k++) {
						civ.Units[docks[k]].ResourceStorages[1].Type = 4;
						civ.Units[docks[k]].ResourceStorages[1].Amount = 5;
						civ.Units[docks[k]].ResourceStorages[1].Flag = 4;
					}
					break;
				}
				//Villagers give 25 food on death
				case 211: {
					Civ &civ = df->Civs[i+1];
					const vector<int> vil_d = {58, 60, 224, 225, 353, 227, 228, 229, 215, 217, 219, 221, 213, 226, 211, 355, 229, 591, 593};
					for (int k=0; k<vil_d.size(); k++) {
						civ.Units[vil_d[k]].ResourceStorages[1].Type = 0;
						civ.Units[vil_d[k]].ResourceStorages[1].Amount = 25;
						civ.Units[vil_d[k]].ResourceStorages[1].Flag = 1;
					}
					break;
				}
				//Mangonels can cut trees
				case 213: {
					Civ &civ = df->Civs[i+1];
					civ.Units[280].Bird.TaskList[5].ClassID = 15;
					civ.Units[280].Type50.BlastAttackLevel = 1;
					break;
				}
				//Towers support population
				case 216: {
					Civ &civ = df->Civs[i+1];
					const vector<int> towers = {79, 190, 234, 236, 684, 685, 785, 885, 1102, 1105, 1368};
					for (int k=0; k<towers.size(); k++) {
						civ.Units[towers[k]].ResourceStorages[0].Type = 4;
						civ.Units[towers[k]].ResourceStorages[0].Amount = 5;
						civ.Units[towers[k]].ResourceStorages[0].Flag = 4;
					}
					break;
				}
				//Refund castle stone
				case 218: {
					Civ &civ = df->Civs[i+1];
					civ.Units[1430].ResourceStorages[1].Type = 2;
					civ.Units[1430].ResourceStorages[1].Amount = 350;
					civ.Units[1430].ResourceStorages[1].Flag = 1;
					break;
				}
				//10 food on farms
				case 220: {
					Civ &civ = df->Civs[i+1];
					civ.Units[50].ResourceStorages[1].Type = 0;
					civ.Units[50].ResourceStorages[1].Amount = 10;
					civ.Units[50].ResourceStorages[1].Flag = 8;
					break;
				}
				//Rams generate stone
				case 229: {
					Civ &civ = df->Civs[i+1];
					for (int k=0; k<rams.size(); k++) {
						civ.Units[rams[k]].Bird.TaskList[5].ClassID = 3;
					}
					break;
				}
				//Outposts garrison anything
				case 265: {
					Civ &civ = df->Civs[i+1];
					civ.Units[598].Building.GarrisonType = 15;
					break;
				}
			}
		}
	}
}

void assignTeamBonuses (DatFile *df, Value cfg) {
	for (int i=0; i<cfg["team_bonus"].size(); i++) {
		if (cfg["team_bonus"][i].size() == 1) {
			int team_bonus = cfg["team_bonus"][i][0].asInt();
			df->Civs[i+1].TeamBonusID = team_bonuses[team_bonus];
			//Apply extra effects
			switch (team_bonus) {
				case 27: {
					allocateTech(df, 600, i+1);
					break;
				}
				case 30: {
					allocateTech(df, 721, i+1);
					break;
				}
			}
		} else {
			//Create a new effect with multiple team bonuses
			Effect tb_e = Effect();
			tb_e.Name = "Team Bonus, " + to_string(i) + " set";
			for (int j=0; j<cfg["team_bonus"][i].size(); j++) {
				int team_bonus = cfg["team_bonus"][i][j].asInt();
				for (int k=0; k<df->Effects[team_bonuses[team_bonus]].EffectCommands.size(); k++) {
					tb_e.EffectCommands.push_back(df->Effects[team_bonuses[team_bonus]].EffectCommands[k]);
				}
				switch (team_bonus) {
					case 27: {
						allocateTech(df, 600, i+1);
						break;
					}
					case 30: {
						allocateTech(df, 721, i+1);
						break;
					}
				}
			}
			df->Effects.push_back(tb_e);
			df->Civs[i+1].TeamBonusID = (df->Effects.size() - 1);
		}
/*		int team_bonus = cfg["team_bonus"][i].asInt();
		df->Civs[i+1].TeamBonusID = team_bonuses[team_bonus];
		//Apply extra effects
		switch (team_bonus) {
			case 27: {
				allocateTech(df, 600, i+1);
				break;
			}
			case 30: {
				allocateTech(df, 721, i+1);
				break;
			}
		}*/
	}
}

//Any and all effects that apply to unique units should apply to their barracks/stable/krepost/donjon equivalent
void duplicateUUEffects (DatFile *df, Value cfg) {
	for (int i=0; i<enablingTechs.size(); i++) {
		int unique_unit = 0;
		int unique_elite = 0;
		//Identify the unique unit (and elite) that we're supposed to be copying the effects of
		if (df->Techs[enablingTechs[i]].Civ != 99) {
			int unique_index = cfg["techtree"][(df->Techs[enablingTechs[i]].Civ)-1][0].asInt();
			unique_unit = df->Effects[df->Techs[uu_tech_ids[unique_index][0]].EffectID].EffectCommands[0].A;
			unique_elite = df->Effects[df->Techs[uu_tech_ids[unique_index][1]].EffectID].EffectCommands[0].B;
		}
		if (unique_unit != 0) {
			for (Effect &effect : df->Effects) {
				int num_effect_commands = effect.EffectCommands.size();
				for (int j=0; j<num_effect_commands; j++) {
					//Don't duplicate effects that enable, upgrade since we make those when we give civ that unit
					//Also spawning both types at the same time would be broken as hell
					if ((effect.EffectCommands[j].A == unique_unit) && (effect.EffectCommands[j].Type != 2) && (effect.EffectCommands[j].Type != 3) && (effect.EffectCommands[j].Type != 7)) {
						//Give the same effect to special unique unit
						EffectCommand copy_effect = effect.EffectCommands[j];
						copy_effect.A = duplicateUUs[i][0];
						if (duplicateUUs[i][0] != -1) {
							effect.EffectCommands.push_back(copy_effect);
						}
					} else if (effect.EffectCommands[j].A == unique_elite) {
						//Give the same effect to special elite
						EffectCommand copy_effect = effect.EffectCommands[j];
						copy_effect.A = duplicateUUs[i][1];
						effect.EffectCommands.push_back(copy_effect);
					}
				}
			}
		}
	}
	//Make ninja's armor-piercing attacks upgrade like other units
/*	for (Effect &effect : df->Effects) {
		int num_effect_commands = effect.EffectCommands.size();
		for (int i=0; i<num_effect_commands; i++) {
			if ((effect.EffectCommands[i].Type == 4) && (effect.EffectCommands[i].B == 6)) {
				EffectCommand copy_effect1 = effect.EffectCommands[i];
				EffectCommand copy_effect2 = effect.EffectCommands[i];
				copy_effect1.A = 1807;	//Soft-coded unit ID
				copy_effect2.A = 1808;
				copy_effect1.B = -1;
				copy_effect2.B = -1;
				
			}
		}
	}*/
}

//There is no multiply tech costs so we have to calculate the flat discounts
void calculateTechDiscounts (DatFile *df) {
	for (Effect &effect : df->Effects) {
		if (effect.Name == "Elite costs -20%") {
			//Check for duplicated elite techs
			for (int i=0; i<df->Techs.size(); i++) {
				if (df->Techs[i].ResearchLocation == 82) {
					if (df->Techs[i].Name.substr(0, 5) == "Elite") {
						for (int j=0; j<3; j++) {
							if (j < df->Techs[i].ResourceCosts.size()) {
								if ((df->Techs[i].ResourceCosts[j].Type >= 0) && (df->Techs[i].ResourceCosts[j].Type <= 3)) {
									effect.EffectCommands.push_back(createEC(101, i, df->Techs[i].ResourceCosts[j].Type, -1, -1 * (df->Techs[i].ResourceCosts[j].Amount / 5)));
								}
							}
						}
					}
				}
			}
		} else if (effect.Name == "C-Bonus, -15% age up cost") {
			effect.EffectCommands.clear();
			for (int i=0; i<3; i++) {
				for (int j=0; j<3; j++) {
					if ((df->Techs[i+101].ResourceCosts[j].Type >= 0) && (df->Techs[i+101].ResourceCosts[j].Type <= 3)) {
						effect.EffectCommands.push_back(createEC(101, i+101, df->Techs[i+101].ResourceCosts[j].Type, -1, (int) round(-1 * (df->Techs[i+101].ResourceCosts[j].Amount * 0.15))));
					}
				}
			}
		} else if (effect.Name == "C-Bonus, Imperial cost -33%") {
			effect.EffectCommands.clear();
			for (int i=0; i<3; i++) {
				if ((df->Techs[103].ResourceCosts[i].Type >= 0) && (df->Techs[103].ResourceCosts[i].Type <= 3)) {
					effect.EffectCommands.push_back(createEC(101, 103, df->Techs[103].ResourceCosts[i].Type, -1, -1 * (df->Techs[103].ResourceCosts[i].Amount / 3)));
				}
			}
		} else if (effect.Name == "C-Bonus, Dock and university techs cost -33%") {
			effect.EffectCommands.clear();
			for (int i=0; i<df->Techs.size(); i++) {
				if ((df->Techs[i].ResearchLocation == 45) || (df->Techs[i].ResearchLocation == 209)) {
					for (int j=0; j<3; j++) {
						if ((df->Techs[i].ResourceCosts[j].Type >= 0) && (df->Techs[i].ResourceCosts[j].Type <= 3)) {
							effect.EffectCommands.push_back(createEC(101, i, df->Techs[i].ResourceCosts[j].Type, -1, -1 * (df->Techs[i].ResourceCosts[j].Amount / 3)));
						}
					}
				}
			}
		} else if (effect.Name == "C-Bonus, -50% food blacksmith+siege techs") {
			effect.EffectCommands.clear();
			for (int i=0; i<df->Techs.size(); i++) {
				if ((df->Techs[i].ResearchLocation == 49) || (df->Techs[i].ResearchLocation == 103)) {
					for (int j=0; j<3; j++) {
						if (df->Techs[i].ResourceCosts[j].Type == 0) {
							effect.EffectCommands.push_back(createEC(101, i, 0, -1, -1 * (df->Techs[i].ResourceCosts[j].Amount / 2)));
						}
					}
				}
			}
		} else if (effect.Name == "C-Bonus, -50% cost stable techs") {
			effect.EffectCommands.clear();
			for (int i=0; i<df->Techs.size(); i++) {
				if (df->Techs[i].ResearchLocation == 101) {
					for (int j=0; j<3; j++) {
						if ((df->Techs[i].ResourceCosts[j].Type >= 0) && (df->Techs[i].ResourceCosts[j].Type <= 3)) {
							effect.EffectCommands.push_back(createEC(101, i, df->Techs[i].ResourceCosts[j].Type, -1, -1 * (df->Techs[i].ResourceCosts[j].Amount / 2)));
						}
					}
				}
			}
		} else if (effect.Name == "C-Bonus, Eco upgrades cost -50% food") {
			effect.EffectCommands.clear();
			for (int i=0; i<df->Techs.size(); i++) {
				if ((df->Techs[i].ResearchLocation == 562) || (df->Techs[i].ResearchLocation == 68) || (df->Techs[i].ResearchLocation == 584) || (df->Techs[i].ResearchLocation == 84) || (i == 65)) {
					for (int j=0; j<3; j++) {
						if (df->Techs[i].ResourceCosts[j].Type == 0) {
							effect.EffectCommands.push_back(createEC(101, i, 0, -1, -1 * (df->Techs[i].ResourceCosts[j].Amount / 2)));
						}
					}
				}
			}
		} else if (effect.Name == "C-Bonus, Feudal cost -25%") {
			effect.EffectCommands.clear();
			for (int i=0; i<3; i++) {
				if ((df->Techs[101].ResourceCosts[i].Type >= 0) && (df->Techs[101].ResourceCosts[i].Type <= 3)) {
					effect.EffectCommands.push_back(createEC(101, 101, df->Techs[101].ResourceCosts[i].Type, -1, -1 * (df->Techs[101].ResourceCosts[i].Amount / 4)));
				}
			}
		} else if (effect.Name == "C-Bonus, Castle Age cost -25%") {
			effect.EffectCommands.clear();
			for (int i=0; i<3; i++) {
				if ((df->Techs[102].ResourceCosts[i].Type >= 0) && (df->Techs[102].ResourceCosts[i].Type <= 3)) {
					effect.EffectCommands.push_back(createEC(101, 102, df->Techs[102].ResourceCosts[i].Type, -1, -1 * (df->Techs[102].ResourceCosts[i].Amount / 4)));
				}
			}
		}
	}
}

void assignTechs (DatFile *df, Value cfg, ofstream &logfile) {
	//Assign unique techs
	for (int i=0; i<cfg["castletech"].size(); i++) {
		int unique_index = cfg["techtree"][i][0].asInt();
		int unique_unit = df->Effects[df->Techs[uu_tech_ids[unique_index][0]].EffectID].EffectCommands[0].A;
		int unique_elite = df->Effects[df->Techs[uu_tech_ids[unique_index][1]].EffectID].EffectCommands[0].B;

		for (int j=0; j<cfg["castletech"][i].size(); j++) {
			int castle_index = cfg["castletech"][i][j].asInt();
			Tech& castle_tech = df->Techs[castle_ut_ids[castle_index]];

			//Actually give the unique tech
			allocateTech(df, castle_ut_ids[castle_index], i+1);

			//Readjust some of the effects to appropriate the new civ culture
			switch (castle_index) {
				//Turn barracks-Huskarl into barracks-uniqueunit
				case 12: {
					for (Civ &civ : df->Civs) {
						civ.Units[759] = civ.Units[unique_unit];
						civ.Units[759].Name = "BARRACKSUU";
						civ.Units[759].Creatable.TrainLocationID = 12;
						civ.Units[759].Creatable.ButtonID = 14;
						civ.Units[761] = civ.Units[unique_elite];
						civ.Units[761].Name = "BARRACKSUUE";
						civ.Units[761].Creatable.TrainLocationID = 12;
						civ.Units[761].Creatable.ButtonID = 14;
					}

					allocateTech(df, 18, i+1);
					EffectCommand upgrade_unique = createEC(3, 759, 761, -1, 0);
					df->Effects[df->Techs[uu_tech_ids[unique_index][1]].EffectID].EffectCommands.push_back(upgrade_unique);
					break;
				}
				//Turn stable-Tarkan into stable-uniqueunit
				case 13: {
					for (Civ &civ : df->Civs) {
						civ.Units[886] = civ.Units[unique_unit];
						civ.Units[886].Name = "STABLEUU";
						civ.Units[886].Creatable.TrainLocationID = 101;
						civ.Units[886].Creatable.ButtonID = 13;
						civ.Units[887] = civ.Units[unique_elite];
						civ.Units[887].Name = "STABLEUUE";
						civ.Units[887].Creatable.TrainLocationID = 101;
						civ.Units[887].Creatable.ButtonID = 13;
					}

					EffectCommand upgrade_unique = createEC(3, 886, 887, -1, 0);
					df->Effects[df->Techs[uu_tech_ids[unique_index][1]].EffectID].EffectCommands.push_back(upgrade_unique);
					break;
				}
				//Give Thalassocracy + arrow upgrades
	/*			case 22: {
					allocateTech(df, 669, i+1);
					allocateTech(df, 670, i+1);
					allocateTech(df, 671, i+1);
					allocateTech(df, 734, i+1);
					allocateTech(df, 735, i+1);
					allocateTech(df, 736, i+1);
					break;
				}*/
				//First Crusade
				case 29: {
					df->Effects[792].EffectCommands[1].A = unique_unit;
					break;
				}
			}
		}
	}
	for (int i=0; i<cfg["imptech"].size(); i++) {
		int unique_index = cfg["techtree"][i][0].asInt();
		int unique_unit = df->Effects[df->Techs[uu_tech_ids[unique_index][0]].EffectID].EffectCommands[0].A;
		int unique_elite = df->Effects[df->Techs[uu_tech_ids[unique_index][1]].EffectID].EffectCommands[0].B;

		for (int j=0; j<cfg["imptech"][i].size(); j++) {
			int imp_index = cfg["imptech"][i][j].asInt();
			Tech& imp_tech = df->Techs[imp_ut_ids[imp_index]];

			allocateTech(df, imp_ut_ids[imp_index], i+1);

			switch (imp_index) {
				//Allow teammates to train ten of your unique unit for free
				//Turn the free-kipchak into free-uniqueunit
				case 9: {
					for (Civ &civ : df->Civs) {
						civ.Units[1260] = civ.Units[unique_elite];
						civ.Units[1260].Name = "MKIPCHAK";
						civ.Units[1260].Creatable.TrainLocationID = -1;
						civ.Units[1260].Creatable.ButtonID = 4;
						civ.Units[1260].Creatable.ResourceCosts[0].Type = 214;
						civ.Units[1260].Creatable.ResourceCosts[0].Amount = 1;
						civ.Units[1260].Creatable.ResourceCosts[1].Type = 215;
						civ.Units[1260].Creatable.ResourceCosts[1].Amount = -1;
					}
					break;
				}
				//Give torsion engines + chemistry
				case 10: {
					allocateTech(df, 609, i+1);
					break;
				}
				//Give villager's revenge blood units
				case 42: {
					Civ &civ = df->Civs[i+1];
					for (int k=0; k<civ.Units.size(); k++) {
						if (civ.Units[k].Class == 4) {
							civ.Units[k].BloodUnitID = vilspear;
						}
					}
					break;
				}
			}
		}
	}

	//Assign techtree
	for (int i=0; i<cfg["techtree"].size(); i++) {
		for (int j=0; j<cfg["techtree"][i].size(); j++) {
			if (cfg["techtree"][i][j] == 0) {
				//Disable tech
				if (basic_techs[j] != -1) {
					df->Effects[tech_tree_ids[i]].EffectCommands.push_back(createEC(102, -1, -1, -1, basic_techs[j]));
				}
			}
		}
		int eagleStart = 0;
		for (int j=0; j<df->Effects[tech_tree_ids[i]].EffectCommands.size(); j++) {
			if ((df->Effects[tech_tree_ids[i]].EffectCommands[j].Type == 102) && (df->Effects[tech_tree_ids[i]].EffectCommands[j].D == 25)) {
				df->Effects[tech_tree_ids[i]].EffectCommands.push_back(createEC(3, 448, 751, 1, 0));
				eagleStart = 1;
			}
		}
		if (eagleStart == 0) {
			df->Effects[tech_tree_ids[i]].EffectCommands.push_back(createEC(3, 751, 448, 1, 0));
		}
	}
}

//Return a random cost vector {food amount, wood amount, stone amount, gold amount}
//such that the total resources is in the interval [min, max] with a probability 1/p of being way above the max
vector<int> getRandomCosts (int min, int max, int p, int max_types, ofstream& logfile) {
	vector<int> costs = {-1, -1, -1, -1};
	//Determine which resource types to include
	int num_types;
	int rand_types = rand() % 4;
	if (rand_types < 2) {
		num_types = 1;
	} else if (rand_types < 3) {
		num_types = 2;
	} else {
		num_types = 3;
	}
	if (num_types > max_types) {
		num_types = max_types;
	}
	vector<int> unpicked_indices = {0, 1, 2, 3};
	vector<int> picked_indices = {};
	for (int i=0; i<num_types; i++) {
		int rand_index = rand() % unpicked_indices.size();
		costs[unpicked_indices[rand_index]] = 0;
		picked_indices.push_back(unpicked_indices[rand_index]);
		unpicked_indices.erase(unpicked_indices.begin() + rand_index);
	}
	//Determine total resources
	if (p != 0) {
		int excess = rand() % p;
		if (excess == 0) {
			min = max;
			max *= 2;
		}
	}
	int total_resources = (rand() % (max - min + 1)) + min;
//	logfile << "Total Resources: " << to_string(total_resources) << "\n" << "Types: " << to_string(num_types) << "\n";
//	for (int i=0; i<picked_indices.size(); i++) {
//		logfile << " -- " << to_string(picked_indices[i]);
//	}
//	logfile << " -- \n";
	//Determine amounts of each resource
	for (int i=0; i<picked_indices.size(); i++) {
		int current_amount;
		if (i == (num_types - 1)) {
			current_amount = total_resources;
		} else {
			int amount_min = (total_resources / (num_types + 1)) + 1;
			int amount_max = total_resources - ((total_resources / (num_types + 1)) + 1);
			if ((amount_max - amount_min + 1) <= 0) {
				//Fancy calculation was too fancy, just pick a random number
				if (total_resources <= 0) {
					//Randomness went really really wrong
					current_amount = 0;
				} else {
					current_amount = rand() % total_resources + 1;
				}
			} else {
				current_amount = rand() % (amount_max - amount_min + 1) + amount_min;
			}
		}
		costs[picked_indices[i]] = current_amount;
		total_resources -= current_amount;
	}
//	for (int i=0; i<4; i++) {
//		logfile << " -- Type " << to_string(i) << ": " << to_string(costs[i]) << "\n";
//	}
	return costs;
}

void setUnitCosts (DatFile *df, vector<int> costs, int civID, int unitID) {
	int normalResources = 0;
	Unit &unit = df->Civs[civID].Units[unitID];
	for (int i=0; i<3; i++) {
		if ((unit.Creatable.ResourceCosts[i].Type >= 0) && (unit.Creatable.ResourceCosts[i].Type <= 3) && (unit.Creatable.ResourceCosts[i].Amount > 0)) {
			normalResources = 1;
		}
	}
	if (normalResources == 1) {
		int writeIndex = 0;
		for (int i=0; i<4; i++) {
			if (costs[i] > 0) {
				ResourceCost cost = ResourceCost();
				cost.Type = i;
				cost.Amount = costs[i];
				cost.Flag = 1;
				unit.Creatable.ResourceCosts[writeIndex] = cost;
				writeIndex++;
			}
		}
		for (int i=writeIndex; i<3; i++) {
			if ((unit.Creatable.ResourceCosts[i].Type >= 0) && (unit.Creatable.ResourceCosts[i].Type <= 3)) {
				ResourceCost empty = ResourceCost();
				empty.Type = -1;
				empty.Amount = 0;
				empty.Flag = 0;
				unit.Creatable.ResourceCosts[i] = empty;
			}
		}
	}
}

void setUnitCosts (DatFile *df, vector<int> unitIDs, vector<int> costs) {
	for (int i=0; i<df->Civs.size(); i++) {
		for (int j=0; j<unitIDs.size(); j++) {
			setUnitCosts(df, costs, i, unitIDs[j]);
		}
	}
}

void setTechCosts (DatFile *df, vector<int> costs, int techID) {

	int normalResources = 0;
	Tech &tech = df->Techs[techID];
	for (int i=0; i<3; i++) {
		if ((tech.ResourceCosts[i].Type >= 0) && (tech.ResourceCosts[i].Type <= 3) && (tech.ResourceCosts[i].Amount > 0)) {
			normalResources = 1;
		}
	}
	if (normalResources == 1) {
		int writeIndex = 0;
		for (int i=0; i<4; i++) {
			if (costs[i] > 0) {
				ResearchResourceCost cost = ResearchResourceCost();
				cost.Type = i;
				cost.Amount = costs[i];
				cost.Flag = 1;
				if (writeIndex < tech.ResourceCosts.size()) {
					tech.ResourceCosts[writeIndex] = cost;
				} else {
					tech.ResourceCosts.push_back(cost);
				}
				writeIndex++;
			}
		}
		for (int i=writeIndex; i<3; i++) {
			ResearchResourceCost empty = ResearchResourceCost();
			empty.Type = -1;
			empty.Amount = 0;
			empty.Flag = 0;
			if (writeIndex < tech.ResourceCosts.size()) {
				tech.ResourceCosts[i] = empty;
			} else {
				tech.ResourceCosts.push_back(empty);
			}
		}
	}
}


void randomizeCosts (DatFile *df, Value cfg, ofstream& logfile) {
	//Set the costs to be the same for all unit sets for all civs
	for (int i=0; i<unit_sets.size(); i++) {
		vector<int> costs = getRandomCosts(unit_sets[i][0], unit_sets[i][1], unit_sets[i][2], unit_sets[i][3], logfile);
		for (int j=0; j<df->Civs.size(); j++) {
			for (int k=4; k<unit_sets[i].size(); k++) {
				setUnitCosts(df, costs, j, unit_sets[i][k]);
			}
		}
	}
	//Randomize costs of unique units
	for (int i=0; i<unit_class[14].size(); i+=2) {
		vector<int> costs = getRandomCosts(65, 150, 0, 2, logfile);
		for (int j=0; j<df->Civs.size(); j++) {
			setUnitCosts(df, costs, j, unit_class[14][i]);
			setUnitCosts(df, costs, j, unit_class[14][i+1]);
		}
	}
	//Copy costs to barracks/stable/krepost/donjon equivalent (but NOT elite mercernaries!)
	for (int i=0; i<(enablingTechs.size()-1); i++) {
		int unique_unit = 0;
		int unique_elite = 0;
		//Identify the unique unit (and elite) that we're supposed to be copying the costs of
		if (df->Techs[enablingTechs[i]].Civ != 99) {
			int unique_index = cfg["techtree"][(df->Techs[enablingTechs[i]].Civ)-1][0].asInt();
			unique_unit = df->Effects[df->Techs[uu_tech_ids[unique_index][0]].EffectID].EffectCommands[0].A;
			unique_elite = df->Effects[df->Techs[uu_tech_ids[unique_index][1]].EffectID].EffectCommands[0].B;
		}
                if (unique_unit != 0) {
			for (Civ &civ : df->Civs) {
				civ.Units[duplicateUUs[i][0]].Creatable.ResourceCosts = civ.Units[unique_unit].Creatable.ResourceCosts;
				civ.Units[duplicateUUs[i][1]].Creatable.ResourceCosts = civ.Units[unique_elite].Creatable.ResourceCosts;
			}
                }
        }
	//Randomize costs of all techs
	for (int i=0; i<df->Techs.size(); i++) {
		vector<int> costs = {0, 0, 0, 0};
		//Scale the costs by age
		if (df->Techs[i].RequiredTechs.size() > 0 && df->Techs[i].EffectID != 420) {
			if (df->Techs[i].RequiredTechs[0] == 101) {
				costs = getRandomCosts(25, 400, 0, 3, logfile);
				setTechCosts(df, costs, i);
			} else if (df->Techs[i].RequiredTechs[0] == 102) {
				costs = getRandomCosts(50, 800, 10, 3, logfile);
				setTechCosts(df, costs, i);
			} else if (df->Techs[i].RequiredTechs[0] == 103 || df->Techs[i].RequiredTechs[0] == 115) {
				costs = getRandomCosts(100, 1600, 10, 3, logfile);
				setTechCosts(df, costs, i);
			}
		}
	}
	//Other techs
	setTechCosts(df, getRandomCosts(30, 60, 0, 3, logfile), 22);
	setTechCosts(df, getRandomCosts(400, 800, 0, 3, logfile), 101);
	setTechCosts(df, getRandomCosts(800, 1300, 0, 3, logfile), 102);
	setTechCosts(df, getRandomCosts(1500, 2100, 0, 3, logfile), 103);
	setTechCosts(df, getRandomCosts(750, 1500, 10, 3, logfile), 439);
	//Randomize how much resources different sources provide
	const vector<int> stones = {102, 839, 248, 352};
	const vector<int> golds = {66, 841, 252, 249};
	int stonestorage = rand() % (2200 - 600 + 1) + 600;
	int goldstorage = rand() % (2000 - 600 + 1) + 600;
	int treestorage = rand() % (125 - 50 + 1) + 50;
	for (int i=0; i<stones.size(); i++) {
		for (Civ &civ : df->Civs) {
			civ.Units[stones[i]].ResourceStorages[0].Amount = stonestorage;
		}
	}
	for (int i=0; i<golds.size(); i++) {
		for (Civ &civ : df->Civs) {
			civ.Units[golds[i]].ResourceStorages[0].Amount = goldstorage;
		}
	}
	for (Civ &civ : df->Civs) {
		for (Unit &unit : civ.Units) {
			if (unit.Class == 15) {
				unit.ResourceStorages[0].Amount = treestorage;
			} else if ((unit.Class == 58) || (unit.Class == 9)) {
				int herdablestorage = rand() % (175 - 75 + 1) + 75;
				unit.ResourceStorages[0].Amount = herdablestorage;
			} else if (unit.Class == 10) {
				if (unit.ResourceStorages[0].Amount != 0) {
					int wildstorage = rand() % (450 - 300 + 1) + 300;
					unit.ResourceStorages[0].Amount = wildstorage;
				}
			}
		}
	}
	//Fun Easter eggs
/*	int event1 = rand() % 100;
	int event2 = rand() % 100;
	int event3 = rand() % 100;
	int event4 = rand() % 50;
	int event5 = rand() % 100;*/
	int event1 = -1;
	int event2 = -1;
	int event3 = -1;
	int event4 = -1;
	int event5 = -1;
	if (event1 == 69) {
		//Free villagers
		for (int i=0; i<unit_sets[28].size(); i++) {
			for (int j=0; j<df->Civs.size(); j++) {
				setUnitCosts(df, {0, 0, 0, 0}, j, unit_sets[28][i]);
			}
		}
		//Free TCs or inhibitively expensive TCs
		int triflip = rand() % 3;
		for (int i=0; i<unit_sets[6].size(); i++) {
			for (int j=0; j<df->Civs.size(); j++) {
				if (triflip == 0) {
					setUnitCosts(df, {0, 0, 0, 0}, j, unit_sets[6][i]);
				} else if (triflip == 1) {
					setUnitCosts(df, {0, 0, 9999, 9999}, j, unit_sets[6][i]);
				}
			}
		}
	}
	if (event2 == 42) {
		//Free aging up
		setTechCosts(df, {0, 0, 0, 0}, 101);
		setTechCosts(df, {0, 0, 0, 0}, 102);
		setTechCosts(df, {0, 0, 0, 0}, 103);
	}
	if (event3 == 27) {
		//Villagers don't take pop space
		for (int i=0; i<unit_sets[28].size(); i++) {
			for (Civ &civ : df->Civs) {
				if (civ.Units[unit_sets[28][i]].ResourceStorages[0].Type == 4) {
					civ.Units[unit_sets[28][i]].ResourceStorages[0].Amount = 0;
				} else {
					civ.Units[unit_sets[28][i]].ResourceStorages[2].Amount = 0;
				}
				civ.Units[unit_sets[28][i]].ResourceStorages[1].Amount = 0;
				civ.Units[unit_sets[28][i]].Creatable.ResourceCosts[2].Amount = 0;
			}
		}
	}
	if (event4 == 0) {
		//Infinite resources on map
		for (Civ &civ : df->Civs) {
			for (int i=0; i<stones.size(); i++) {
				civ.Units[stones[i]].ResourceStorages[0].Amount = 99999;
			}
			for (int i=0; i<golds.size(); i++) {
				civ.Units[golds[i]].ResourceStorages[0].Amount = 99999;
			}
			for (Unit &unit : civ.Units) {
				if (unit.Class == 15) {
					unit.ResourceStorages[0].Amount = 99999;
				} else if ((unit.Class == 58) || (unit.Class == 9)) {
					unit.ResourceStorages[0].Amount = 99999;
				} else if (unit.Class == 10) {
					if (unit.ResourceStorages[0].Amount != 0) {
						unit.ResourceStorages[0].Amount = 99999;
					}
				}
			}
			civ.Resources[36] = 99999;
		}

	}
	if (event5 == 30) {
		//Monks are free
		for (int i=0; i<df->Civs.size(); i++) {
			setUnitCosts(df, {0, 0, 0, 0}, i, 125);
			setUnitCosts(df, {0, 0, 0, 0}, i, 648);
		}
	}
}
