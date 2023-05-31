const urlParams = new URLSearchParams(window.location.search);
let json = urlParams.get("civ").replaceAll("%7D", "}").replaceAll("%7C", "|").replaceAll("%7B", "{").replaceAll("%5E", "^").replaceAll("%60", "`");
let civ = JSON.parse(decryptPath(json));

document.title = "Civilization Builder - " + civ["alias"];
var description = `<span><b>${civ["alias"]}</b></span><br><br>`;
for (var a = 0; a < civ["bonuses"][0].length; a++) {
  description += "•";
  description += card_descriptions[0][civ["bonuses"][0][a]];
  description += "<br>";
}
description += "<br><span><b>Unique Unit:</b></span><br>";
if (civ["bonuses"][1].length != 0) {
  description += card_descriptions[1][civ["bonuses"][1][0]];
  description += "<br>";
}
description += "<br><span><b>Unique Techs:</b></span><br>";
if (civ["bonuses"][2].length != 0) {
  for (var j = 0; j < civ["bonuses"][2].length; j++) {
    description += "•";
    description += card_descriptions[2][civ["bonuses"][2][j]];
    description += "<br>";
  }
}
if (civ["bonuses"][3].length != 0) {
  for (var j = 0; j < civ["bonuses"][3].length; j++) {
    description += "•";
    description += card_descriptions[3][civ["bonuses"][3][j]];
    description += "<br>";
  }
}
description += "<br><span><b>Team Bonus:</b></span><br>";
if (civ["bonuses"][4].length != 0) {
  for (var j = 0; j < civ["bonuses"][4].length; j++) {
    if (civ["bonuses"][4].length > 1) {
      description += "•";
    }
    description += card_descriptions[4][civ["bonuses"][4][j]];
    description += "<br>";
  }
}

showTechtree(civ["tree"], -1, 4, 0, description);
