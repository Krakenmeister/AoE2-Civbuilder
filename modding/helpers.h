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

const vector<int> disableIDs = {74, 13, 545, 45, 70, 72};
const vector<int> palisadeGates = {789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804};
const vector<int> enablingTechs = {414, 339, 391, 410, 411, 413};

const vector<int> techTreeIDs = {254,258,259,262,255,257,256,260,261,263,276,277,275,446,447,449,448,504,10,1,3,5,7,31,48,42,37,646,648,650,652,706,708,710,712,782,784,801,803,838,840,842};
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

void recalculateTechDiscounts(DatFile *df) {
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
		} else if (effect.Name == "C-Bonus, Eco upgrades cost -33% food") {
			effect.EffectCommands.clear();
			for (int i=0; i<df->Techs.size(); i++) {
				if ((df->Techs[i].ResearchLocation == 562) || (df->Techs[i].ResearchLocation == 68) || (df->Techs[i].ResearchLocation == 584) || (df->Techs[i].ResearchLocation == 84) || (i == 65)) {
					for (int j=0; j<3; j++) {
						if (df->Techs[i].ResourceCosts[j].Type == 0) {
							effect.EffectCommands.push_back(createEC(101, i, 0, -1, -0.333 * (df->Techs[i].ResourceCosts[j].Amount)));
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
		} else if (effect.Name == "C-Bonus, Barracks techs cost -50%") {
			effect.EffectCommands.clear();
			for (int i=0; i<df->Techs.size(); i++) {
				if (df->Techs[i].ResearchLocation == 12) {
					for (int j=0; j<3; j++) {
						if ((df->Techs[i].ResourceCosts[j].Type >= 0) && (df->Techs[i].ResourceCosts[j].Type <= 3)) {
							effect.EffectCommands.push_back(createEC(101, i, df->Techs[i].ResourceCosts[j].Type, -1, -1 * (df->Techs[i].ResourceCosts[j].Amount / 2)));
						}
					}
				}
			}
		}
	}
}

//Copy all building and unit graphics from one civilization onto another
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

void giveClassNewBonus (DatFile *df, vector<int> unitIDs, int bonusID) {
	for (Civ &civ : df->Civs) {
		for (int i=0; i<unitIDs.size(); i++) {
			bool hasBonus = false;
			for (int j=0; j<civ.Units[unitIDs[i]].Type50.Attacks.size(); j++) {
				if (civ.Units[unitIDs[i]].Type50.Attacks[j].Class == bonusID) {
					hasBonus = true;
				}
			}
			if (!hasBonus) {
				unit::AttackOrArmor bonus_0 = unit::AttackOrArmor();
				bonus_0.Class = bonusID;
				bonus_0.Amount = 0;
				civ.Units[unitIDs[i]].Type50.Attacks.push_back(bonus_0);
			}
		}
	}
}

//Give the specified units armor of the specified id and type
void giveClassNewArmor (DatFile *df, vector<int> unitIDs, int armorID, int armorAmount) {
	for (Civ &civ : df->Civs) {
		for (int i=0; i<unitIDs.size(); i++) {
			int hasArmor = -1;
			for (int j=0; j<civ.Units[unitIDs[i]].Type50.Armours.size(); j++) {
				if (civ.Units[unitIDs[i]].Type50.Armours[j].Class == armorID) {
					hasArmor = j;
				}
			}
			if (hasArmor != -1) {
				civ.Units[unitIDs[i]].Type50.Armours[hasArmor].Amount = armorAmount;
			} else {
				unit::AttackOrArmor newArmor = unit::AttackOrArmor();
				newArmor.Class = armorID;
				newArmor.Amount = armorAmount;
				civ.Units[unitIDs[i]].Type50.Armours.push_back(newArmor);
			}
		}
	}
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

void addAttacktoUnits (DatFile *df, int effectID, int attackAmount, vector<int> units) {
	for (int i=0; i<units.size(); i++) {
		//Find if unit base attack is melee, pierce
		int attackType = -1;
		for (int j=0; j<df->Civs[0].Units[units[i]].Type50.Attacks.size(); j++) {
			unit::AttackOrArmor attack = df->Civs[0].Units[units[i]].Type50.Attacks[j];
			if (((attack.Class == 4) || (attack.Class == 3)) && (attack.Amount != 0)) {
				attackType = attack.Class;
			}
		}
		if (attackType != -1) {
			df->Effects[effectID].EffectCommands.push_back(createEC(4, units[i], -1, 9, amountTypetoD(attackAmount, attackType)));
		}
	}
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

#endif