//Initiliaze civ preset
const urlParams = new URLSearchParams(window.location.search);
let json = urlParams.get("civ").replaceAll("%7D", "}").replaceAll("%7C", "|").replaceAll("%7B", "{").replaceAll("%5E", "^").replaceAll("%60", "`");
let civ = JSON.parse(decryptPath(json));

var roundType = 0;
var cardSize = 6;
var marginSize = 0.6;

renderPhase1();

//Display Flag Creator
function renderPhase1() {
  $("body").contents().not("script").remove();

  document.body.style.backgroundImage = "url('./img/aoe2background.jpg')";

  var wrapping = document.createElement("div");
  wrapping.id = "wrapping";

  var flagbox = document.createElement("div");
  flagbox.className = "flagbox";

  var header = document.createElement("div");
  header.id = "header";
  header.innerHTML = "Flag Creator";

  var contain = document.createElement("div");
  contain.id = "contain";

  var pickGrid = document.createElement("div");
  pickGrid.id = "pickGrid";

  var flagDiv = document.createElement("div");
  flagDiv.id = "flagDiv";

  var canvas = document.createElement("canvas");
  canvas.id = "flag";
  canvas.width = "256";
  canvas.height = "256";

  flagDiv.appendChild(canvas);

  var label = document.createElement("label");
  label.id = "civlabel";
  label.setAttribute("for", "alias");
  label.innerHTML = "Civilization Name";

  var input = document.createElement("input");
  input.type = "text";
  input.id = "alias";
  input.name = "civname";
  if (civ["alias"]) {
    input.setAttribute("value", civ["alias"]);
  }

  var next = document.createElement("button");
  next.className = "readybutton";
  next.innerHTML = "Next";
  next.onclick = function () {
    var inputbox = document.getElementById("alias");
    if (validate(inputbox.value)) {
      civ["alias"] = inputbox.value;
      document.title = "Civilization Builder - " + civ["alias"];
      renderPhase2();
      if (civ["bonuses"][0].length == 0 && civ["bonuses"][1].length == 0 && civ["bonuses"][2].length == 0 && civ["bonuses"][3].length == 0 && civ["bonuses"][4].length == 0) {
        showTechtree(civ["tree"], -1, 3, 0, "");
      } else {
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
          description += "•";
          description += card_descriptions[2][civ["bonuses"][2][0]];
          description += "<br>";
        }
        if (civ["bonuses"][3].length != 0) {
          description += "•";
          description += card_descriptions[3][civ["bonuses"][3][0]];
          description += "<br>";
        }
        description += "<br><span><b>Team Bonus:</b></span><br>";
        if (civ["bonuses"][4].length != 0) {
          for (var j = 0; j < civ["bonuses"][4].length; j++) {
            description += card_descriptions[4][civ["bonuses"][4][j]];
            description += "<br>";
          }
        }
        showTechtree(civ["tree"], -1, 3, 0, description);
      }
    }
  };

  function getFun1(val) {
    return function () {
      civ["flag_palette"][val] = (civ["flag_palette"][val] - 1 + palette_sizes[val]) % palette_sizes[val];
      clientFlag(civ["flag_palette"], "flag", 1);
    };
  }

  function getFun2(val) {
    return function () {
      civ["flag_palette"][val] = (civ["flag_palette"][val] + 1 + palette_sizes[val]) % palette_sizes[val];
      clientFlag(civ["flag_palette"], "flag", 1);
    };
  }

  for (var i = 0; i < 8; i++) {
    var backbutton = document.createElement("button");
    backbutton.className = "backbutton";
    backbutton.innerHTML = "<";
    backbutton.onclick = getFun1(i);

    var category = document.createElement("div");
    category.className = "category";
    category.innerHTML = categories[i];

    var forwardbutton = document.createElement("button");
    forwardbutton.className = "forwardbutton";
    forwardbutton.innerHTML = ">";
    forwardbutton.onclick = getFun2(i);

    pickGrid.appendChild(backbutton);
    pickGrid.appendChild(category);
    pickGrid.appendChild(forwardbutton);
  }

  var archbox = document.createElement("div");
  archbox.id = "archbox";

  var architectureIconBox = document.createElement("div");
  architectureIconBox.style.display = "flex";
  architectureIconBox.style.flexDirection = "column";
  architectureIconBox.style.alignItems = "center";
  architectureIconBox.style.justifyContent = "center";

  var architectureIcon = document.createElement("img");
  architectureIcon.id = "architectureicon";
  architectureIcon.src = `./img/architectures/tc_${civ["architecture"]}.png`;

  var architectureText = document.createElement("div");
  architectureText.id = "architecturetext";
  architectureText.style.fontSize = "20px";
  architectureText.style.width = "200px";
  architectureText.style.textAlign = "center";
  architectureText.innerHTML = `${architectures[civ["architecture"] - 1]}`;

  architectureIconBox.appendChild(architectureIcon);
  architectureIconBox.appendChild(architectureText);

  var iconback = document.createElement("button");
  iconback.className = "backbutton";
  iconback.innerHTML = "<";
  iconback.onclick = function () {
    civ["architecture"] = ((civ["architecture"] - 1 + 10) % 11) + 1;
    document.getElementById("architectureicon").src = `./img/architectures/tc_${civ["architecture"]}.png`;
    document.getElementById("architecturetext").innerHTML = `${architectures[civ["architecture"] - 1]}`;
  };

  var iconforward = document.createElement("button");
  iconforward.className = "forwardbutton";
  iconforward.innerHTML = ">";
  iconforward.onclick = function () {
    civ["architecture"] = ((civ["architecture"] - 1 + 1) % 11) + 1;
    document.getElementById("architectureicon").src = `./img/architectures/tc_${civ["architecture"]}.png`;
    document.getElementById("architecturetext").innerHTML = `${architectures[civ["architecture"] - 1]}`;
  };

  archbox.appendChild(iconback);
  archbox.appendChild(architectureIconBox);
  archbox.appendChild(iconforward);

  var langbox = document.createElement("div");
  langbox.id = "langbox";

  var languagetext = document.createElement("div");
  languagetext.id = "languagetext";
  languagetext.innerHTML = languages[civ["language"]];

  var langiconback = document.createElement("button");
  langiconback.className = "backbutton";
  langiconback.innerHTML = "<";
  langiconback.onclick = function () {
    civ["language"] = (civ["language"] + (languages.length - 1)) % languages.length;
    document.getElementById("languagetext").innerHTML = languages[civ["language"]];
  };

  var langiconforward = document.createElement("button");
  langiconforward.className = "forwardbutton";
  langiconforward.innerHTML = ">";
  langiconforward.onclick = function () {
    civ["language"] = (civ["language"] + 1) % languages.length;
    document.getElementById("languagetext").innerHTML = languages[civ["language"]];
  };

  langbox.appendChild(langiconback);
  langbox.appendChild(languagetext);
  langbox.appendChild(langiconforward);

  contain.appendChild(pickGrid);
  contain.appendChild(flagDiv);

  flagbox.appendChild(header);
  flagbox.appendChild(contain);
  flagbox.appendChild(archbox);
  flagbox.appendChild(langbox);
  flagbox.appendChild(label);
  flagbox.appendChild(input);
  flagbox.appendChild(next);

  wrapping.appendChild(flagbox);

  document.getElementsByTagName("body")[0].appendChild(wrapping);
  clientFlag(civ["flag_palette"], "flag", 1);
}

function setTechTree(tree) {
  civ["tree"] = tree;
}

//Display bonus selection
function renderPhase2() {
  $("body").contents().not("script").remove();

  var techtreestyles = document.getElementById("tech_styles");
  if (typeof techtreestyles != "undefined" && techtreestyles != null) {
    techtreestyles.remove();
  }

  document.body.style.backgroundImage = "url('./img/draftbackground.jpg')";

  var sideheader = document.createElement("div");
  sideheader.id = "sideheader";

  var phase = document.createElement("h1");
  phase.id = "sidephase";

  var buttonleft = document.createElement("div");
  buttonleft.id = "buttonleft";
  buttonleft.innerHTML = "<";
  buttonleft.onclick = function () {
    roundType = (roundType + 4) % 5;
    renderPhase2();
  };

  var buttonright = document.createElement("div");
  buttonright.id = "buttonright";
  buttonright.innerHTML = ">";
  buttonright.onclick = function () {
    roundType = (roundType + 1) % 5;
    renderPhase2();
  };

  //Display which round the drafting is in
  if (roundType == 0) {
    phase.innerHTML = "Civilization Bonuses";
  } else if (roundType == 1) {
    phase.innerHTML = "Unique Units";
  } else if (roundType == 2) {
    phase.innerHTML = "Castle Unique Tech";
  } else if (roundType == 3) {
    phase.innerHTML = "Imperial Unique Tech";
  } else if (roundType == 4) {
    phase.innerHTML = "Team Bonuses";
  }
  sideheader.appendChild(buttonleft);
  sideheader.appendChild(phase);
  sideheader.appendChild(buttonright);

  var game = document.createElement("div");
  game.id = "game";

  var players = document.createElement("div");
  players.id = "players";

  //Size cards depending on slider
  var sliderbox = document.createElement("div");
  sliderbox.id = "sliderbox";
  sliderbox.style.top = "300px";

  var slidertext = document.createElement("div");
  slidertext.id = "slidertext";
  slidertext.innerHTML = "Card Size:";

  var sliderslider = document.createElement("input");
  sliderslider.id = "sliderslider";
  sliderslider.type = "range";
  sliderslider.min = "3";
  sliderslider.max = "16";
  sliderslider.step = "0.1";
  sliderslider.value = "6";
  sliderslider.oninput = function () {
    cardSize = parseInt(sliderslider.value, 10);
    marginSize = parseInt(sliderslider.value, 10) / 10;
    for (var i = 0; i < num_cards[roundType]; i++) {
      var resized_card = document.getElementById("card" + i);
      resized_card.style.width = cardSize + "rem";
      resized_card.style.height = cardSize + "rem";
      resized_card.style.margin = marginSize + "rem";
      if (civ["bonuses"][roundType].includes(i)) {
        resized_card.style.outline = cardSize * (22 / 256) + "rem solid rgba(0, 255, 0, 0.7)";
        resized_card.style.outlineOffset = "-" + cardSize * (22 / 256) + "rem";
      }
      resized_card.onmouseover = getFun3(card_descriptions[roundType][i], i, cardSize, [0, 255, 0, 0.7]);
      resized_card.onmouseout = getFun4(i);
      resized_card.onclick = getFun5(i, cardSize);
    }
  };

  //Add filtering to cards
  var filterbox = document.createElement("div");
  filterbox.id = "filterbox";
  filterbox.style.top = "395px";
  filterbox.style.left = "2vw";
  filterbox.style.width = "100%";
  filterbox.style.padding = "0";
  filterbox.style.flexDirection = "row";

  var filtertext = document.createElement("div");
  filtertext.id = "filtertext";
  filtertext.innerHTML = "Filter:";

  var filterinput = document.createElement("input");
  filterinput.id = "filterinput";
  filterinput.type = "text";
  filterinput.onkeyup = function () {
    var filter = document.getElementById("filterinput").value.toLowerCase();
    if (filter == "") {
      for (var i = 0; i < num_cards[roundType]; i++) {
        document.getElementById("card" + i).style.display = "block";
      }
    } else {
      for (var i = 0; i < num_cards[roundType]; i++) {
        var card = document.getElementById("card" + i);
        if (card_descriptions[roundType][i].toLowerCase().includes(filter)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      }
    }
  };

  filterbox.appendChild(filtertext);
  filterbox.appendChild(filterinput);
  players.appendChild(filterbox);

  //Show player information to the left of the board
  var player = document.createElement("div");
  player.className = "playercard";
  player.id = "player";
  player.style.cursor = "pointer";
  player.style.position = "fixed";
  player.style.left = "0";
  player.style.top = "200px";
  player.style.width = "18vw";
  player.style.marginLeft = "2vw";
  player.style.paddingRight = "25px";
  player.onclick = function () {
    renderPhase1();
  };

  var image = document.createElement("div");
  image.className = "image";

  var text = document.createElement("div");
  text.className = "text";

  var canvas = document.createElement("canvas");
  canvas.id = "flag";
  canvas.width = "85";
  canvas.height = "85";
  canvas.className = "flag";

  var edit = document.createElement("div");
  edit.id = "editIcon";
  edit.style.position = "absolute";
  edit.style.top = "30px";
  edit.style.right = "20px";

  var editImg = document.createElement("img");
  editImg.src = "./img/edit.png";
  editImg.style.width = "35px";
  editImg.style.height = "35px";

  edit.appendChild(editImg);

  var alias = document.createElement("div");
  alias.className = "alias";
  if (civ["alias"].length > 10) {
    alias.style.fontSize = 3.3 * Math.exp(-1 * (civ["alias"].length / 25)) + "vw";
    alias.style.lineHeight = 2.6 * Math.exp(-1 * (civ["alias"].length / 25)) + "vw";
  }
  alias.innerHTML = civ["alias"];
  player.style.height = "95px";

  image.appendChild(canvas);
  text.appendChild(alias);

  player.appendChild(image);
  player.appendChild(text);
  player.appendChild(edit);

  sliderbox.appendChild(slidertext);
  sliderbox.appendChild(sliderslider);

  players.appendChild(player);
  players.appendChild(sliderbox);

  var board = document.createElement("div");
  board.id = "board";

  var selected = document.createElement("div");
  selected.id = "selected";
  var unselected = document.createElement("div");
  unselected.id = "unselected";

  board.appendChild(selected);
  board.appendChild(unselected);

  //Outline hovered card and display help text
  function getFun3(text, cardId, size, colour) {
    return function () {
      var hover_card = document.getElementById("card" + cardId);
      hover_card.style.outline = size * (22 / 256) + "rem solid rgba(" + colour[0] + ", " + colour[1] + ", " + colour[2] + ", " + colour[3] + ")";
      hover_card.style.outlineOffset = "-" + size * (22 / 256) + "rem";
      var help = document.getElementById("helpboxcontainer");
      help.style.visibility = "visible";
      var helptext = document.getElementById("helpboxtext");
      helptext.style.fontSize = "80px";
      helptext.innerHTML = text;
      fitText("helpboxtext");
      var finish_button = document.getElementById("finish");
      finish_button.style.visibility = "hidden";
      var share_button = document.getElementById("clear");
      share_button.style.visibility = "hidden";
      var home_button = document.getElementById("homeBtn");
      home_button.style.visibility = "hidden";
    };
  }

  //Hide outline and help text
  function getFun4(cardId) {
    return function () {
      if (!civ["bonuses"][roundType].includes(cardId)) {
        var hover_card = document.getElementById("card" + cardId);
        hover_card.style.outline = "none";
      }
      var help = document.getElementById("helpboxcontainer");
      help.style.visibility = "hidden";
      var finish_button = document.getElementById("finish");
      finish_button.style.visibility = "visible";
      var share_button = document.getElementById("clear");
      share_button.style.visibility = "visible";
      var home_button = document.getElementById("homeBtn");
      home_button.style.visibility = "visible";
    };
  }

  //Select card
  function getFun5(cardId, size) {
    return function () {
      activated_card = document.getElementById("card" + cardId);
      if (civ["bonuses"][roundType].includes(cardId)) {
        var index = civ["bonuses"][roundType].indexOf(cardId);
        civ["bonuses"][roundType].splice(index, 1);
        activated_card.style.outline = "none";
        selected.removeChild(activated_card);
        unselected.insertBefore(activated_card, unselected.children[0]);
      } else {
        if (civ["bonuses"][roundType].length >= max_sizes[roundType]) {
          cleared_card = document.getElementById("card" + civ["bonuses"][roundType][0]);
          if (cleared_card) {
            cleared_card.style.outline = "none";
            civ["bonuses"][roundType].shift();
            selected.removeChild(cleared_card);
            unselected.insertBefore(cleared_card, unselected.children[0]);
          }
        }
        activated_card.style.outline = size * (22 / 256) + "rem solid rgba(0, 255, 0, 0.7)";
        activated_card.style.outlineOffset = "-" + size * (22 / 256) + "rem";
        civ["bonuses"][roundType].push(cardId);
        unselected.removeChild(activated_card);
        selected.appendChild(activated_card);
      }
    };
  }

  function getNoFun() {
    return function () {};
  }

  //Add all cards stored in gamestate to the board
  for (var i = 0; i < num_cards[roundType]; i++) {
    var card = document.createElement("div");
    card.className = "card";
    card.id = "card" + i;
    card.style.width = cardSize + "rem";
    card.style.height = cardSize + "rem";
    card.style.margin = marginSize + "rem";

    //Display graphics on the card
    var prefix;
    if (roundType == 0) {
      prefix = "bonus";
    } else if (roundType == 1) {
      prefix = "uu";
    } else if (roundType == 2) {
      prefix = "castle";
    } else if (roundType == 3) {
      prefix = "imp";
    } else if (roundType == 4) {
      prefix = "team";
    }
    var path = `${prefix}_${i}.png`;
    var image = document.createElement("img");
    image.className = "cardimage";
    image.src = "./img/cards/" + path;
    card.appendChild(image);
    //Let player pick a card
    card.style.cursor = "pointer";
    if (civ["bonuses"][roundType].includes(i)) {
      card.style.outline = cardSize * (22 / 256) + "rem solid rgba(0, 255, 0, 0.7)";
      card.style.outlineOffset = "-" + cardSize * (22 / 256) + "rem";
    }
    card.onmouseover = getFun3(card_descriptions[roundType][i], i, cardSize, [0, 255, 0, 0.7]);
    card.onmouseout = getFun4(i);
    card.onclick = getFun5(i, cardSize);
    if (civ["bonuses"][roundType].includes(i)) {
      selected.appendChild(card);
    } else {
      unselected.appendChild(card);
    }
  }
  //Add finish button
  var boardtoolbar = document.createElement("div");
  boardtoolbar.id = "boardtoolbar";
  boardtoolbar.style.top = "450px";
  boardtoolbar.style.left = "6.5vw";
  boardtoolbar.style.width = "13.5vw";
  boardtoolbar.style.padding = "0";
  boardtoolbar.style.flexDirection = "column";
  boardtoolbar.style.alignItems = "flex-start";

  var finish = document.createElement("div");
  finish.id = "finish";
  finish.innerHTML = "Download";
  finish.style.margin = "0";
  finish.onclick = function () {
    downloadTextFile(JSON.stringify(civ), civ["alias"] + ".json");
  };

  var share = document.createElement("div");
  share.id = "clear";
  share.innerHTML = "Share";
  share.style.margin = "0";
  share.onclick = function () {
    console.log(encryptJson(civ));
    var sharebox = document.createElement("div");
    sharebox.id = "sharebox";
    var view_text = document.createElement("div");
    view_text.innerHTML = "View";
    view_text.setAttribute("class", "sharetext");
    var linkwrapper1 = document.createElement("div");
    linkwrapper1.setAttribute("class", "sharelink");
    var view_link = document.createElement("div");
    view_link.innerHTML = `${hostname}${route}/view?civ=${encryptJson(civ)}`;
    view_link.setAttribute("class", "linktext");
    view_link.setAttribute("id", "view_link");
    var copy_view = document.createElement("div");
    copy_view.innerHTML = "Copy";
    copy_view.setAttribute("id", "copy_view");
    copy_view.style.cursor = "pointer";
    copy_view.onclick = function () {
      const copyText = document.createElement("textarea");
      copyText.value = document.getElementById("view_link").innerHTML;
      document.body.appendChild(copyText);
      copyText.select();
      document.execCommand("copy");
      document.body.removeChild(copyText);
      document.getElementById("copy_view").innerHTML = "Copied!";
      document.getElementById("copy_edit").innerHTML = "Copy";
    };
    var edit_text = document.createElement("div");
    edit_text.innerHTML = "Edit";
    edit_text.setAttribute("class", "sharetext");
    var linkwrapper2 = document.createElement("div");
    linkwrapper2.setAttribute("class", "sharelink");
    var edit_link = document.createElement("div");
    edit_link.innerHTML = `${hostname}${route}/edit?civ=${encryptJson(civ)}`;
    edit_link.setAttribute("class", "linktext");
    edit_link.setAttribute("id", "edit_link");
    var copy_edit = document.createElement("div");
    copy_edit.innerHTML = "Copy";
    copy_edit.setAttribute("id", "copy_edit");
    copy_edit.style.cursor = "pointer";
    copy_edit.onclick = function () {
      const copyText = document.createElement("textarea");
      copyText.value = document.getElementById("edit_link").innerHTML;
      document.body.appendChild(copyText);
      copyText.select();
      document.execCommand("copy");
      document.body.removeChild(copyText);
      document.getElementById("copy_edit").innerHTML = "Copied!";
      document.getElementById("copy_view").innerHTML = "Copy";
    };
    var done_sharing = document.createElement("div");
    done_sharing.innerHTML = "Done";
    done_sharing.id = "done_sharing";
    done_sharing.onclick = function () {
      document.getElementById("sharebox").remove();
    };
    linkwrapper1.appendChild(view_link);
    linkwrapper1.appendChild(copy_view);
    linkwrapper2.appendChild(edit_link);
    linkwrapper2.appendChild(copy_edit);

    sharebox.appendChild(view_text);
    sharebox.appendChild(linkwrapper1);
    sharebox.appendChild(edit_text);
    sharebox.appendChild(linkwrapper2);
    sharebox.appendChild(done_sharing);
    document.body.appendChild(sharebox);
  };

  var home = document.createElement("div");
  home.id = "homeBtn";
  home.innerHTML = "Home";
  home.style.margin = "0";
  home.onclick = function () {
    if (confirm("Return home? Changes will not be saved.")) {
      window.location.href = `${hostname}${route}`;
    }
  };

  boardtoolbar.appendChild(finish);
  boardtoolbar.appendChild(share);
  boardtoolbar.appendChild(home);
  players.appendChild(boardtoolbar);

  //Add card description box
  var helpboxcontainer = document.createElement("div");
  helpboxcontainer.id = "helpboxcontainer";
  helpboxcontainer.style.visibility = "hidden";

  var helpbox = document.createElement("div");
  helpbox.id = "helpbox";

  var helpboximage = document.createElement("img");
  helpboximage.id = "helpboximage";
  helpboximage.src = "./img/helpbackground.png";

  var helpboxtext = document.createElement("div");
  helpboxtext.id = "helpboxtext";

  helpbox.appendChild(helpboximage);
  helpbox.appendChild(helpboxtext);
  helpboxcontainer.appendChild(helpbox);
  document.getElementsByTagName("body")[0].appendChild(helpboxcontainer);

  game.appendChild(players);
  game.appendChild(board);

  document.getElementsByTagName("body")[0].appendChild(game);
  document.getElementsByTagName("body")[0].appendChild(sideheader);

  //Render flag
  clientFlag(civ["flag_palette"], "flag", 85 / 256);
}
