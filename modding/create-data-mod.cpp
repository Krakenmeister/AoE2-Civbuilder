#include <string>
#include <iostream>
#include <fstream>
#include "genie/dat/DatFile.h"
#include "json/json.h"
#include "configure_civilizations.h"

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
    ifstream cfgfile(argv[1]);
    cfgfile >> cfg;
    configureCivs(df, cfg);

    df->saveAs(argv[3]);

    return 0;
}
