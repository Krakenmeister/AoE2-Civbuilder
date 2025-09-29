#include "civbuilder.h"
#include "genie/dat/DatFile.h"
#include <fstream>
#include <iostream>
#include <jsoncpp/json/json.h>
#include <string>

#define SLOBYTE(x) (*((int8_t *)&(x)))
#define HIBYTE(x) (*((uint8_t *)&(x) + 1))

using namespace std;
using namespace Json;
using namespace genie;

int main(int argc, char **argv) {
  auto *df = new DatFile();
  df->setGameVersion(GV_LatestDE2);

  df->load(argv[2]);

  Value cfg;
  // Reader reader;
  ifstream cfgfile(argv[1]);
  // reader.parse(cfgfile, cfg);
  cfgfile >> cfg;
  Civbuilder cb = Civbuilder(df, cfg, "logs.txt", argv[4]);

  cout << "[C++]: Modify dat = " << cfg["modifyDat"] << endl;

  if (cfg["modifyDat"].asBool()) {
    cb.configure();
  } else {
    applyModifiers(df, cfg["modifiers"]["blind"].asBool(),
                   cfg["modifiers"]["building"].asDouble(),
                   cfg["modifiers"]["speed"].asDouble(),
                   cfg["modifiers"]["hp"].asDouble());
    if (cfg["modifiers"]["randomCosts"].asBool()) {
      randomizeCosts(df);
    }
  }

  cout << "[C++]: Writing file to " << argv[3] << endl;
  df->saveAs(argv[3]);

  return 0;
}
