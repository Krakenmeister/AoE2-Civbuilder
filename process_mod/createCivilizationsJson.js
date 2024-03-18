const fs = require("fs");
const { iconids, techtreeNames } = require("./constants.js");

module.exports = {
  createCivilizationsJson,
};

const internal_names = [
  "Britons",
  "Franks",
  "Goths",
  "Teutons",
  "Japanese",
  "Chinese",
  "Byzantines",
  "Persians",
  "Saracens",
  "Turks",
  "Vikings",
  "Mongols",
  "Celts",
  "Spanish",
  "Aztecs",
  "Mayans",
  "Huns",
  "Koreans",
  "Italians",
  "Indians",
  "Incas",
  "Magyars",
  "Slavs",
  "Portuguese",
  "Ethiopians",
  "Malians",
  "Berbers",
  "Khmer",
  "Malay",
  "Burmese",
  "Vietnamese",
  "Bulgarians",
  "Tatars",
  "Cumans",
  "Lithuanians",
  "Burgundians",
  "Sicilians",
  "Poles",
  "Bohemians",
  "Dravidians",
  "Bengalis",
  "Gurjaras",
  "Romans",
  "Armenians",
  "Georgians",
];
const data_names = [
  "BRITON-CIV",
  "FRANKISH-CIV",
  "GOTHIC-CIV",
  "TEUTONIC-CIV",
  "JAPANESE-CIV",
  "CHINESE-CIV",
  "BYZANTINE-CIV",
  "PERSIAN-CIV",
  "SARACEN-CIV",
  "TURKISH-CIV",
  "VIKING-CIV",
  "MONGOL-CIV",
  "CELTIC-CIV",
  "SPANISH-CIV",
  "AZTEC-CIV",
  "MAYAN-CIV",
  "HUN-CIV",
  "KOREAN-CIV",
  "ITALIAN-CIV",
  "INDIAN-CIV",
  "INCAN-CIV",
  "MAGYAR-CIV",
  "SLAVIC-CIV",
  "PORTUGUESE-CIV",
  "ETHIOPIAN-CIV",
  "MALIAN-CIV",
  "BERBERS-CIV",
  "KHMER-CIV",
  "MALAY-CIV",
  "BURMESE-CIV",
  "VIETNAMESE-CIV",
  "BULGARIANS-CIV",
  "TATARS-CIV",
  "CUMANS-CIV",
  "LITHUANIANS-CIV",
  "BURGUNDIANS-CIV",
  "SICILIANS-CIV",
  "POLES-CIV",
  "BOHEMIANS-CIV",
  "DRAVIDIANS-CIV",
  "BENGALIS-CIV",
  "GURJARAS-CIV",
  "ROMANS-CIV",
  "ARMENIANS-CIV",
  "GEORGIANS-CIV",
];
const hud_styles = ["CivWest", "CivWest", "CivAsia", "CivOrie", "CivMeso", "CivMedi", "CivOrie", "CivSlav", "CivAfri", "CivSeas", "CivNomad"];
const computer_name_string_table_offsets = [
  4400, 4420, 4440, 4460, 4480, 4500, 4520, 4540, 4560, 4580, 4600, 4620, 4640, 5800, 5820, 5840, 5860, 5880, 5900, 5920, 5940, 5960, 5980, 106000, 106020, 106040, 106060, 106080, 106100, 106120,
  106140, 106160, 106180, 106200, 106220, 106240, 106260, 106280, 106300, 106320, 106340, 106360, 106380, 106400, 106420,
];

function createCivilizationsJson(data_json, civilizations_json) {
  let raw_data = fs.readFileSync(data_json);
  let civ = JSON.parse(raw_data);

  let civilizations = {
    civilization_list: [
      {
        internal_name: "Gaia",
        tech_tree_name: "GAIA",
        data_name: "GAIA",
        hud_style: "CivWest",
        name_string_id: 10102,
      },
    ],
  };

  for (let i = 0; i < civ.techtree.length; i++) {
    let civilization = {};

    civilization.internal_name = internal_names[i];
    //civilization.tech_tree_name = civ.name[i];
    civilization.tech_tree_name = techtreeNames[i];
    civilization.data_name = data_names[i];
    civilization.hud_style = hud_styles[civ.architecture[i]];
    civilization.name_string_id = 10271 + i;
    civilization.computer_name_string_table_offset = computer_name_string_table_offsets[i];
    civilization.tech_tree_image_path = `/resources/civ_techtree/menu_techtree_${civ.name[i]}.png`;

    civilization.unique_unit_image_paths = [];
    civilization.unique_unit_image_paths.push(`/resources/uniticons/${iconids[i]}_50730.png`);

    civilizations["civilization_list"].push(civilization);
  }

  fs.writeFileSync(civilizations_json, JSON.stringify(civilizations, null, 2));
}
