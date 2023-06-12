#include "helpers.h"

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

//Set the costs of particular unit for a particular civ to the specified costs vector
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

//Set the unit costs for all units given to be the same for all civs
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

//Random costs stuff
vector<vector<int>> unitSets = {
/*0 - Houses*/		        {15, 50, 6, 3, 70, 191, 192, 463, 464, 465},
/*1 - Mills*/		        {50, 200, 0, 3, 68, 129, 130, 131},
/*2 - Lumber Camps*/	    {50, 200, 0, 3, 562, 563, 564, 565},
/*3 - Mining Camps*/	    {50, 200, 0, 3, 584, 585, 586, 587},
/*4 - Farms*/		        {30, 70, 0, 3, 50, 1187},
/*5 - Docks*/		        {50, 200, 0, 3, 45, 47, 51, 133, 805, 806, 808},
/*6 - Town Centers*/	    {75, 500, 0, 2, 71, 109, 141, 142, 444, 481, 482, 483, 484, 597, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621},
/*7 - Barracks*/		    {100, 250, 7, 3, 12, 20, 132, 498},
/*8 - Archery Ranges*/	    {100, 250, 7, 3, 10, 14, 87},
/*9 - Stables*/		        {100, 250, 7, 3, 86, 101, 153},
/*10 - Siege Workshops*/	{100, 250, 7, 3, 49, 150},
/*11 - Outposts*/		    {10, 50, 7, 3, 598},
/*12 - Blacksmiths*/		{100, 250, 5, 3, 18, 19, 103, 105},
/*13 - Markets*/		    {100, 250, 5, 3, 84, 116, 137},
/*14 - Monasteries*/		{100, 250, 7, 3, 30, 31, 32, 104},
/*15 - Universities*/	    {100, 250, 5, 3, 209, 210},
/*16 - Castles*/		    {300, 1000, 0, 3, 82},
/*17 - Towers*/		        {100, 250, 7, 3, 79, 190, 234, 235},
/*18 - Bombard Towers*/	    {200, 500, 7, 3, 236},
/*19 - Fish Traps*/		    {30, 120, 7, 3, 199},
/*20 - Palisade Walls*/	    {1, 5, 7, 1, 72},
/*21 - Palisade Gates*/	    {20, 40, 7, 3, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804},
/*22 - Stone Walls*/		{1, 10, 7, 1, 117, 155, 370},
/*23 - Stone Gates*/		{25, 50, 7, 3, 63, 64, 67, 78, 80, 81, 85, 88, 90, 91, 92, 95, 487, 488, 490, 491, 659, 660, 661, 662, 663, 664, 665, 666, 667, 668, 669, 670, 671, 672, 673, 674, 1579, 1580, 1581, 1582, 1583, 1584, 1585, 1586, 1587, 1588, 1589, 1590, 1591, 1592, 1593, 1594},
/*24 - Donjons*/		    {100, 250, 0, 3, 1665},
/*25 - Kreposts*/		    {200, 500, 0, 3, 1251},
/*26 - Feitorias*/		    {250, 750, 0, 2, 1021},
/*27 - Wonders*/		    {1000, 5000, 0, 2, 276},
/*28 - Villagers*/		    {25, 100, 10, 2, 56, 57, 83, 118, 120, 122, 123, 124, 156, 206, 212, 214, 216, 218, 220, 222, 259, 293, 354, 579, 581, 590, 592},
/*29 - Fishing Ships*/	    {50, 100, 0, 2, 13},
/*30 - Archers*/		    {40, 100, 0, 2, 4, 24, 492},
/*31 - Skirmishers*/		{30, 80, 0, 2, 6, 7, 1155},
/*32 - Cav Archers*/		{60, 160, 0, 2, 39, 474},
/*33 - Hand Cannons*/	    {40, 140, 0, 2, 5},
/*34 - Militias*/		    {35, 100, 0, 2, 74, 75, 77, 473, 567, 1793},
/*35 - Pointy Bois*/		{30, 80, 0, 2, 93, 358, 359, 1786, 1787, 1788},
/*36 - Eagles*/		        {50, 100, 0, 2, 751, 752, 753},
/*37 - Scouts*/		        {40, 90, 0, 2, 448, 546, 441, 1707},
/*38 - Knights*/		    {85, 185, 0, 2, 38, 283, 569},
/*39 - Camels*/		        {65, 140, 0, 2, 329, 330, 207, 1755},
/*40 - Battle Elephants*/	{110, 225, 0, 2, 1132, 1134},
/*41 - Steppe Lancers*/	    {65, 120, 0, 2, 1370, 1372},
/*42 - Rams*/		        {100, 275, 0, 2, 35, 422, 548, 1258},
/*43 - Mangonels*/		    {120, 350, 0, 2, 280, 550, 588},
/*44 - Scorpions*/		    {80, 180, 0, 2, 279, 542},
/*45 - Siege Towers*/	    {50, 200, 0, 2, 1105},
/*46 - Bombard Cannons*/	{150, 600, 0, 2, 36, 1709},
/*47 - Transports*/		    {50, 200, 0, 2, 545},
/*48 - Fire Ships*/		    {60, 160, 0, 2, 1103, 529, 532},
/*49 - Demo Ships*/		    {60, 160, 0, 2, 1104, 527, 528},
/*50 - Galleys*/		    {80, 180, 0, 2, 539, 21, 442},
/*51 - Cannon Galleons*/	{150, 450, 0, 2, 420, 691},
/*52 - Trade Cogs*/		    {50, 175, 0, 2, 17},
/*53 - Trade Carts*/		{50, 175, 0, 2, 128, 204},
/*54 - Petards*/		    {40, 85, 5, 2, 440},
/*55 - Trebuchets*/		    {200, 800, 0, 2, 42, 331},
/*56 - Monks*/		        {35, 120, 0, 2, 125},
/*57 - Missionaries*/	    {35, 120, 0, 2, 775},
/*58 - Slingers*/		    {40, 100, 0, 2, 185},
/*59 - Genitours*/		    {60, 160, 0, 2, 1010, 1012},
/*60 - Condottiero*/		{50, 110, 0, 2, 882},
/*61 - Turtle Ships*/	    {150, 450, 0, 2, 831, 832},
/*62 - Longboats*/		    {100, 200, 0, 2, 250, 533},
/*63 - Caravels*/		    {100, 200, 0, 2, 1004, 1006},
/*64 - Flaming Camels*/	    {40, 100, 0, 2, 1263},
/*65 - Flemish Militia*/	{40, 100, 0, 2, 1663, 1697, 1699},
/*66 - Folwarks*/		    {50, 200, 0, 2, 1711, 1720, 1734},
/*67 - Elephant Archers*/   {100, 200, 0, 2, 873, 875},
/*68 - Shrivamshas*/        {50, 150, 0, 2, 1751, 1753},
/*69 - Thirisadai*/         {150, 300, 0, 2, 1750},
/*70 - Caravanserai*/       {130, 280, 8, 3, 1754},
/*71 - Dromon*/             {200, 400, 0, 2, 1795}
};
vector<int> uniqueUnits = {8, 530, 281, 531, 41, 555, 25, 554, 291, 560, 73, 559, 40, 553, 282, 556, 239, 558, 46, 557, 692, 694, 11, 561, 232, 534, 771, 773, 725, 726, 763, 765, 755, 757, 827, 829, 866, 868, 1747, 1749, 879, 881, 869, 871, 876, 878,
	1001, 1003, 1016, 1018, 1013, 1015, 1007, 1009, 1120, 1122, 1123, 1125, 1126, 1128, 1129, 1131, 1225, 1227, 1252, 1253, 1228, 1230, 1231, 1233, 1234, 1236, 1655, 1657, 1658, 1659, 1701, 1702, 1704, 1706,
	1735, 1737, 1738, 1740, 1741, 1743, 1759, 1761};

//Return a random cost vector {food amount, wood amount, stone amount, gold amount}
//such that the total resources is in the interval [min, max] with a probability 1/p of being way above the max
vector<int> getRandomCosts (int min, int max, int p, int maxTypes) {
	vector<int> costs = {-1, -1, -1, -1};
	//Determine which resource types to include
	int numTypes;
	int randTypes = rand() % 4;
	if (randTypes < 2) {
		numTypes = 1;
	} else if (randTypes < 3) {
		numTypes = 2;
	} else {
		numTypes = 3;
	}
	if (numTypes > maxTypes) {
		numTypes = maxTypes;
	}
	vector<int> unpickedIndices = {0, 1, 2, 3};
	vector<int> pickedIndices = {};
	for (int i=0; i<numTypes; i++) {
		int randIndex = rand() % unpickedIndices.size();
		costs[unpickedIndices[randIndex]] = 0;
		pickedIndices.push_back(unpickedIndices[randIndex]);
		unpickedIndices.erase(unpickedIndices.begin() + randIndex);
	}
	//Determine total resources
	if (p != 0) {
		int excess = rand() % p;
		if (excess == 0) {
			min = max;
			max *= 2;
		}
	}
	int totalResources = (rand() % (max - min + 1)) + min;
	//Determine amounts of each resource
	for (int i=0; i<pickedIndices.size(); i++) {
		int currentAmount;
		if (i == (numTypes - 1)) {
			currentAmount = totalResources;
		} else {
			int amountMin = (totalResources / (numTypes + 1)) + 1;
			int amountMax = totalResources - ((totalResources / (numTypes + 1)) + 1);
			if ((amountMax - amountMin + 1) <= 0) {
				//Fancy calculation was too fancy, just pick a random number
				if (totalResources <= 0) {
					//Randomness went really really wrong
					currentAmount = 0;
				} else {
					currentAmount = rand() % totalResources + 1;
				}
			} else {
				currentAmount = rand() % (amountMax - amountMin + 1) + amountMin;
			}
		}
		costs[pickedIndices[i]] = currentAmount;
		totalResources -= currentAmount;
	}
	return costs;
}

//Set the tech costs of the given ID to the supplied costs vector
void setTechCosts (DatFile *df, vector<int> costs, int techID) {
    //Check that the technology actually costs resources
	int normalResources = 0;
	Tech &tech = df->Techs[techID];
	for (int i=0; i<3; i++) {
		if ((tech.ResourceCosts[i].Type >= 0) && (tech.ResourceCosts[i].Type <= 3) && (tech.ResourceCosts[i].Amount > 0) && (tech.ResourceCosts[i].Flag != 0)) {
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

//Randomize costs
void randomizeCosts (DatFile *df) {
	//Set the costs to be the same for all unit sets for all civs
	for (int i=0; i<unitSets.size(); i++) {
		vector<int> costs = getRandomCosts(unitSets[i][0], unitSets[i][1], unitSets[i][2], unitSets[i][3]);
		for (int j=0; j<df->Civs.size(); j++) {
			for (int k=4; k<unitSets[i].size(); k++) {
				setUnitCosts(df, costs, j, unitSets[i][k]);
			}
		}
	}
	//Randomize costs of unique units
	for (int i=0; i<uniqueUnits.size(); i+=2) {
		vector<int> costs = getRandomCosts(65, 150, 0, 2);
		for (int j=0; j<df->Civs.size(); j++) {
			setUnitCosts(df, costs, j, uniqueUnits[i]);
			setUnitCosts(df, costs, j, uniqueUnits[i+1]);
		}
	}
	//Randomize costs of all techs
	for (int i=0; i<df->Techs.size(); i++) {
		vector<int> costs = {0, 0, 0, 0};
		//Scale the costs by age
		if (df->Techs[i].RequiredTechs.size() > 0 && df->Techs[i].EffectID != 420) {
			if (df->Techs[i].RequiredTechs[0] == 101) {
				costs = getRandomCosts(25, 400, 0, 3);
				setTechCosts(df, costs, i);
			} else if (df->Techs[i].RequiredTechs[0] == 102) {
				costs = getRandomCosts(50, 800, 10, 3);
				setTechCosts(df, costs, i);
			} else if (df->Techs[i].RequiredTechs[0] == 103 || df->Techs[i].RequiredTechs[0] == 115) {
				costs = getRandomCosts(100, 1600, 10, 3);
				setTechCosts(df, costs, i);
			}
		}
	}
	//Other techs
	setTechCosts(df, getRandomCosts(30, 60, 0, 3), 22);
	setTechCosts(df, getRandomCosts(400, 800, 0, 3), 101);
	setTechCosts(df, getRandomCosts(800, 1300, 0, 3), 102);
	setTechCosts(df, getRandomCosts(1500, 2100, 0, 3), 103);
	setTechCosts(df, getRandomCosts(750, 1500, 10, 3), 439);
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
		for (int i=0; i<unitSets[28].size(); i++) {
			for (int j=0; j<df->Civs.size(); j++) {
				setUnitCosts(df, {0, 0, 0, 0}, j, unitSets[28][i]);
			}
		}
		//Free TCs or inhibitively expensive TCs
		int triflip = rand() % 3;
		for (int i=0; i<unitSets[6].size(); i++) {
			for (int j=0; j<df->Civs.size(); j++) {
				if (triflip == 0) {
					setUnitCosts(df, {0, 0, 0, 0}, j, unitSets[6][i]);
				} else if (triflip == 1) {
					setUnitCosts(df, {0, 0, 9999, 9999}, j, unitSets[6][i]);
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
		for (int i=0; i<unitSets[28].size(); i++) {
			for (Civ &civ : df->Civs) {
				if (civ.Units[unitSets[28][i]].ResourceStorages[0].Type == 4) {
					civ.Units[unitSets[28][i]].ResourceStorages[0].Amount = 0;
				} else {
					civ.Units[unitSets[28][i]].ResourceStorages[2].Amount = 0;
				}
				civ.Units[unitSets[28][i]].ResourceStorages[1].Amount = 0;
				civ.Units[unitSets[28][i]].Creatable.ResourceCosts[2].Amount = 0;
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
			setUnitCosts(df, {0, 0, 0, 0}, i, 775);
		}
	}
}