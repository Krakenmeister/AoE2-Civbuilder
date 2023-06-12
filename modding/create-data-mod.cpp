#include <string>
#include <iostream>
#include <fstream>
#include "genie/dat/DatFile.h"
#include <jsoncpp/json/json.h>
#include "civbuilder.h"

#define SLOBYTE(x) (*((int8_t*)&(x)))
#define HIBYTE(x) (*((uint8_t*)&(x)+1))


using namespace std;
using namespace Json;
using namespace genie;

int main(int argc, char **argv) {
    auto *df = new DatFile();
    df->setGameVersion(GV_LatestDE2);

    df->load(argv[2]);

    Value cfg;
    //Reader reader;
    ifstream cfgfile(argv[1]);
    //reader.parse(cfgfile, cfg);
    cfgfile >> cfg;
    Civbuilder cb = Civbuilder(df, cfg, "logs.txt", argv[4]);
    
    cout << "Random costs: " << cfg["randomCosts"] << endl;
    cout << "Modify dat: " << cfg["modifyDat"] << endl;

    if (cfg["modifyDat"] == "true") {
        cb.configure();
    } else if (cfg["randomCosts"] == "true") {
        randomizeCosts(df);
    }

    df->saveAs(argv[3]);

    return 0;
}
