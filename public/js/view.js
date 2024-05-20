const urlParams = new URLSearchParams(window.location.search);
let json = urlParams.get("civ").replaceAll("%7D", "}").replaceAll("%7C", "|").replaceAll("%7B", "{").replaceAll("%5E", "^").replaceAll("%60", "`");
let civ = JSON.parse(decryptPath(json));

document.title = "Civilization Builder - " + civ["alias"];
var description = `<span><b>${civ["alias"]}</b></span><br><br>`;
for (var a = 0; a < civ["bonuses"][0].length; a++) {
  description += "•";
  if (civ["bonuses"][0][a].length != 2) {
    description += card_descriptions[0][civ["bonuses"][0][a]];
  } else {
    description += card_descriptions[0][civ["bonuses"][0][a][0]];
    if (civ["bonuses"][0][a][1] > 1) {
      description += ` [x${civ["bonuses"][0][a][1]}]`;
    }
  }
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
    description += "• ";
    if (civ["bonuses"][2][j].length != 2) {
      description += card_descriptions[2][civ["bonuses"][2][j]];
    } else {
      description += card_descriptions[2][civ["bonuses"][2][j][0]];
      if (civ["bonuses"][2][j][1] > 1) {
        description += ` [x${civ["bonuses"][2][j][1]}]`;
      }
    }
    description += "<br>";
  }
}
if (civ["bonuses"][3].length != 0) {
  for (var j = 0; j < civ["bonuses"][3].length; j++) {
    description += "• ";
    if (civ["bonuses"][3][j].length != 2) {
      description += card_descriptions[3][civ["bonuses"][3][j]];
    } else {
      description += card_descriptions[3][civ["bonuses"][3][j][0]];
      if (civ["bonuses"][3][j][1] > 1) {
        description += ` [x${civ["bonuses"][3][j][1]}]`;
      }
    }
    description += "<br>";
  }
}
description += "<br><span><b>Team Bonus:</b></span><br>";
if (civ["bonuses"][4].length != 0) {
  for (var j = 0; j < civ["bonuses"][4].length; j++) {
    if (civ["bonuses"][4].length > 1) {
      description += "• ";
    }
    if (civ["bonuses"][4][j].length != 2) {
      description += card_descriptions[4][civ["bonuses"][4][j]];
    } else {
      description += card_descriptions[4][civ["bonuses"][4][j][0]];
      if (civ["bonuses"][4][j][1] > 1) {
        description += ` [x${civ["bonuses"][4][j][1]}]`;
      }
    }
    description += "<br>";
  }
}

showTechtree(civ["tree"], -1, 4, 0, description);
