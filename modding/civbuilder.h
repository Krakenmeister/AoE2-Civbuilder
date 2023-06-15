#ifndef CIVBUILDER_H
#define CIVBUILDER_H

#include <iostream>
#include <string>
#include <fstream>
#include <algorithm>
#include <cmath>
#include <map>
#include <time.h>
#include <math.h>
#include "genie/dat/DatFile.h"
#include <jsoncpp/json/json.h>
#include "helpers.h"

using namespace std;
using namespace genie;
using namespace Json;

class Civbuilder {
    private:
        map<int, vector<int>> civBonuses;
        map<int, pair<int, int>> uuTechIDs;
        map<int, int> castleUniqueTechIDs;
        map<int, int> impUniqueTechIDs;
        map<int, int> teamBonuses;
        map<string, vector<int>> unitClasses;

        int numCivs;

        vector<vector<int>> duplicationUnits;

        Value config;
        DatFile* df;
        ofstream logfile;
        Value ai;
        string aipath;
    public:
        Civbuilder(DatFile* df, Value config, string logpath, string aipath);
        ~Civbuilder();
        void initialize();
        void configure();
        void createUT(int civbuilderID, int type, Effect utEffect, string name, vector<int> techCosts, int techTime, int techDLL);
        void createCivBonus(int civbuilderID, Effect e, string name, vector<int> requirements);
        void createTeamBonus(int civbuilderID, Effect e, string name);
        void createUU (int civbuilderID, int baseID, string name, vector <int> techCosts, int techTime, int techDLL);
        void setupData();
        void createData();
        void assignData();
        void createNewUnits();
        void createUniqueTechs();
        void createCivBonuses();
        void createTeamBonuses();
        void reconfigureEffects();
        void assignArchitectures();
        void assignLanguages();
        void assignUniqueUnits();
        void assignBasicTechs();
        void assignUniqueTechs();
        void assignCivBonuses();
        void assignTeamBonuses();
        void duplicateUnitEffects();
        void cleanup();
};

#endif