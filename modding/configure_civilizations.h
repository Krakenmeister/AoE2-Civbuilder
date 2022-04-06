#ifndef CONFIGURE_CIVILIZATIONS_H
#define CONFIGURE_CIVILIZATIONS_H

#include "genie/dat/DatFile.h"
#include <jsoncpp/json/json.h>
#include <string>

using namespace Json;
using namespace std;

void configureCivs(genie::DatFile *df, Value cfg, string aipath);

#endif
