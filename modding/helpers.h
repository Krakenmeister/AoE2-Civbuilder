#ifndef HELPERS_H
#define HELPERS_H

#include <iostream>
#include <string>
#include <fstream>
#include <algorithm>
#include <cmath>
#include <map>
#include <time.h>
#include <math.h>
#include "genie/dat/DatFile.h"

#define SLOBYTE(x) (*((int8_t*)&(x)))
#define HIBYTE(x) (*((uint8_t*)&(x)+1))

using namespace std;
using namespace genie;

typedef ResourceUsage<int16_t, int16_t, int16_t> ResourceCost;
typedef ResourceUsage<int16_t, int16_t, uint8_t> ResearchResourceCost;

const vector<int> disableIDs = {74, 13, 545, 45, 70, 72};
const vector<int> palisadeGates = {789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804};
const vector<int> enablingTechs = {414, 339, 391, 410, 411, 413};

const vector<int> techTreeIDs = {254,258,259,262,255,257,256,260,261,263,276,277,275,446,447,449,448,504,10,1,3,5,7,31,48,42,37,646,648,650,652,706,708,710,712,782,784,801,803,838,840,842,890};
const vector<int> basicTechs = {-1,-1,-1,-1,414,222,207,217,264,87,197,429,433,384,716,215,602,147,151,100,237,99,98,192,218,85,437,436,25,204,254,428,166,209,265,235,236,630,631,714,715,435,39,149,162,96,255,358,257,320,94,239,603,
	188,211,212,219,199,200,201,67,82,80,74,76,77,604,243,246,605,242,244,-1,-1,35,37,376,65,374,375,373,50,51,194,93,140,63,380,322,54,47,64,377,608,379,321,315,316,319,441,439,231,252,45,233,230,438,8,280,213,249,55,182,278,279,
	202,203,221,48,23,17,15,14,13,12,434,189,68,75,81,339,180,391,256,157,161,426,220,410,216,411,413,127,137,148,281,210,357,150,144,332,22,101,102,103,875,480,481,837,838,886};

const vector<int> productivityRates = {47, 190, 79, 189, 216, 198, 199, 200};
const vector<int> gatherRates = {214, 57, 354, 581, 216, 218, 220, 590, 259, 56, 120, 579, 122, 123, 124, 592, 13};

const vector<int> militaryClasses = {0, 55, 22, 35, 6, 54, 13, 51, 36, 12, 44, 23, 47};
const vector<int> siegeClasses = {13, 51, 54, 55};
const vector<int> buildingClasses = {3, 27, 39, 49, 52};
const vector<int> ecoUpgrades = {213, 249, 202, 203, 221, 14, 13, 12, 55, 182, 278, 279, 65};
const vector<int> ecoBuildings = {68, 129, 130, 131, 562, 563, 564, 565, 584, 585, 586, 587};
const vector<int> galleys = {539, 21, 442};
const vector<int> houses = {70, 191, 192, 463, 464, 465};
const vector<int> barracks = {12, 20, 132, 498};
const vector<int> ranges = {10, 14, 87};
const vector<int> monasteries = {30, 31, 32, 104};
const vector<int> workshops = {49, 150};
const vector<int> militaryBuildings = {12, 20, 132, 498, 10, 14, 87, 86, 101, 153, 49, 150};
const vector<int> blacksmiths = {18, 19, 103, 105};
const vector<int> universities = {209, 210};
const vector<int> militias = {74, 75, 77, 473, 567, 1793};
const vector<int> townCenters = {71, 109, 141, 142};
const vector<int> docks = {45, 47, 51, 133, 805, 806, 807, 808};
const vector<int> markets = {84, 116, 137, 1646};
const int tcSpearman = 1182;
const int tcPikeman = 1183;
const int tcHalberdier = 1184;
const int tcSiegeTower = 885;
const int royalLancer = 1181;
const int royalElephant = 1180;
const int impScorpion = 1179;
const int impScorpionProjectile = 1113;
const int impScorpionProjectileFire = 1114;
const int millCow = 646;
const int feudalMonk = 648;

const vector<int> relicBonuses = {736, 737, 738, 739};

extern vector<vector<int>> unitSets;
extern vector<int> uniqueUnits;

float amountTypetoD (int32_t value, int32_t type);
int vectorSum (vector<int> v);
EffectCommand createEC (int type, int A, int B, int C, float D);
void recalculateTechDiscounts(DatFile *df);
void copyArchitecture (DatFile *df, int copyFrom, int copyTo);
void giveClassNewBonus (DatFile *df, int classID, int bonusID);
void giveClassNewBonus (DatFile *df, vector<int> unitIDs, int bonusID);
void giveClassNewArmor (DatFile *df, vector<int> unitIDs, int armorID, int armorAmount);
void setCombatStats (DatFile *df, int unitID, vector<vector<int>> attacks, vector<vector<int>> armors);
void addAttacktoUnits (DatFile *df, int effectID, int attackAmount, vector<int> units);
void setUnitCosts (DatFile *df, vector<int> costs, int civID, int unitID);
void setUnitCosts (DatFile *df, vector<int> unitIDs, vector<int> costs);
void allocateRequirements (DatFile *df, int techID, int civID);
void allocateTech (DatFile *df, int techID, int civID);
vector<int> getRandomCosts (int min, int max, int p, int maxTypes);
void setTechCosts (DatFile *df, vector<int> costs, int techID);
void randomizeCosts (DatFile *df);

#endif