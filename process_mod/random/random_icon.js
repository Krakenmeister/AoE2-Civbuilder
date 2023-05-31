//Create canvas with black background
const fs = require("fs-js");
const { createCanvas, loadImage, Image } = require("canvas");
const width = 256;
const height = 256;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");
ctx.fillStyle = "rgba(0,0,0,255)";
ctx.fillRect(0, 0, width, height);

//Create separate canvas for symbol
const canvas2 = createCanvas(width, height);
const ctx2 = canvas2.getContext("2d");

var buffer;

module.exports = {
  getRandomInt,
  generateSeed,
  drawFlag,
  generateFlags,
};

//Generate a random integer from 0 to n-1 (inclusive)
function getRandomInt(n) {
  return Math.floor(Math.random() * Math.floor(n));
}

//Generate random colour palette, division, overlay, and symbol
function generateSeed() {
  //Division is an integer representing the background pattern
  var division = getRandomInt(12);

  //Overlay is an integer representing the foreground pattern
  var overlay = getRandomInt(12);

  //Colour palette is a 2D array -- 5 colors each with an length-3 array holding RGB values
  var colour_palette = [];

  //Database of colours
  const white = [255, 255, 255];
  const yellow = [242, 245, 86];
  const light_blue = [153, 255, 238];
  const pink = [240, 185, 185];
  const light_green = [191, 255, 128];
  const orange = [230, 134, 9];

  const black = [0, 0, 0];
  const dark_blue = [1, 5, 128];
  const dark_green = [21, 128, 0];
  const purple = [51, 0, 77];
  const scarlet = [102, 0, 34];
  const red = [201, 34, 22];
  const brown = [51, 8, 0];

  var light_colours = [white, yellow, light_blue, pink, light_green, orange];
  var dark_colours = [black, dark_blue, dark_green, purple, scarlet, red, brown];

  //Create a colour palette with good contrast
  var randInt = getRandomInt(2);
  if (overlay < 6) {
    if (randInt == 0) {
      for (var i = 0; i < 4; i++) {
        colour_palette.push(light_colours[getRandomInt(light_colours.length)]);
      }
      colour_palette.push(dark_colours[getRandomInt(dark_colours.length)]);
    } else {
      for (var i = 0; i < 4; i++) {
        colour_palette.push(dark_colours[getRandomInt(dark_colours.length)]);
      }
      colour_palette.push(light_colours[getRandomInt(light_colours.length)]);
    }
  } else {
    for (var i = 0; i < 3; i++) {
      var j = getRandomInt(light_colours.length + dark_colours.length);
      if (j >= light_colours.length) {
        colour_palette.push(dark_colours[j - light_colours.length]);
      } else {
        colour_palette.push(light_colours[j]);
      }
    }
    if (randInt == 0) {
      colour_palette.push(light_colours[getRandomInt(light_colours.length)]);
      if (dark_colours.includes(colour_palette[0])) {
        colour_palette.push(colour_palette[0]);
      } else {
        colour_palette.push(dark_colours[getRandomInt(dark_colours.length)]);
      }
    } else {
      colour_palette.push(dark_colours[getRandomInt(dark_colours.length)]);
      if (light_colours.includes(colour_palette[0])) {
        colour_palette.push(colour_palette[0]);
      } else {
        colour_palette.push(light_colours[getRandomInt(light_colours.length)]);
      }
    }
  }

  var seed = [colour_palette, division, overlay];
  return seed;
}

//Draw flag to canvas given a seed
async function drawFlag(seed, symbol, output_paths, input_path) {
  var colour_palette = seed[0];
  var division = seed[1];
  var overlay = seed[2];

  var primary_division_colour = "rgb(" + colour_palette[0][0] + ", " + colour_palette[0][1] + ", " + colour_palette[0][2] + ")";
  var secondary_division_colour = "rgb(" + colour_palette[1][0] + ", " + colour_palette[1][1] + ", " + colour_palette[1][2] + ")";
  var tertiary_division_colour = "rgb(" + colour_palette[2][0] + ", " + colour_palette[2][1] + ", " + colour_palette[2][2] + ")";
  var overlay_colour = "rgb(" + colour_palette[3][0] + ", " + colour_palette[3][1] + ", " + colour_palette[3][2] + ")";
  var image_path = input_path + "/symbol_" + symbol + ".png";

  //Draw background
  //0 = solid color background
  //1 = halves split vertically
  //2 = halves split horizontally
  //3 = thirds split vertically
  //4 = thirds split horizontally
  //5 = quarters split orthogonally, opposite corners same color
  //6 = quarters split diagonally, opposite corners same color
  //7 = halves split diagonally, top-left to bottom-right
  //8 = halves split diagonally, bottom-left to top-right
  //9 = stripes vertically
  //10 = stripes horizontally
  //11 = checkered
  switch (division) {
    case 0:
      ctx.fillStyle = primary_division_colour;
      ctx.fillRect(0, 0, 256, 256);
      break;
    case 1:
      ctx.fillStyle = primary_division_colour;
      ctx.fillRect(0, 0, 128, 256);
      ctx.fillStyle = secondary_division_colour;
      ctx.fillRect(128, 0, 128, 256);
      break;
    case 2:
      ctx.fillStyle = primary_division_colour;
      ctx.fillRect(0, 0, 256, 128);
      ctx.fillStyle = secondary_division_colour;
      ctx.fillRect(0, 128, 256, 128);
      break;
    case 3:
      ctx.fillStyle = primary_division_colour;
      ctx.fillRect(0, 0, 85, 256);
      ctx.fillStyle = secondary_division_colour;
      ctx.fillRect(85, 0, 86, 256);
      ctx.fillStyle = tertiary_division_colour;
      ctx.fillRect(171, 0, 85, 256);
      break;
    case 4:
      ctx.fillStyle = primary_division_colour;
      ctx.fillRect(0, 0, 256, 85);
      ctx.fillStyle = secondary_division_colour;
      ctx.fillRect(0, 85, 256, 86);
      ctx.fillStyle = tertiary_division_colour;
      ctx.fillRect(0, 171, 256, 85);
      break;
    case 5:
      ctx.fillStyle = primary_division_colour;
      ctx.fillRect(0, 0, 128, 128);
      ctx.fillRect(128, 128, 128, 128);
      ctx.fillStyle = secondary_division_colour;
      ctx.fillRect(0, 128, 128, 128);
      ctx.fillRect(128, 0, 128, 128);
      break;
    case 6:
      ctx.fillStyle = primary_division_colour;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(128, 128);
      ctx.lineTo(0, 256);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(256, 0);
      ctx.lineTo(128, 128);
      ctx.lineTo(256, 256);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = secondary_division_colour;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(128, 128);
      ctx.lineTo(256, 0);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 256);
      ctx.lineTo(128, 128);
      ctx.lineTo(256, 256);
      ctx.closePath();
      ctx.fill();
      break;
    case 7:
      ctx.fillStyle = primary_division_colour;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(256, 256);
      ctx.lineTo(256, 0);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = secondary_division_colour;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(256, 256);
      ctx.lineTo(0, 256);
      ctx.closePath();
      ctx.fill();
      break;
    case 8:
      ctx.fillStyle = primary_division_colour;
      ctx.beginPath();
      ctx.moveTo(256, 0);
      ctx.lineTo(0, 256);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = secondary_division_colour;
      ctx.beginPath();
      ctx.moveTo(256, 0);
      ctx.lineTo(0, 256);
      ctx.lineTo(256, 256);
      ctx.closePath();
      ctx.fill();
      break;
    case 9:
      ctx.fillStyle = primary_division_colour;
      ctx.fillRect(0, 0, 28, 256);
      ctx.fillRect(57, 0, 28, 256);
      ctx.fillRect(114, 0, 28, 256);
      ctx.fillRect(171, 0, 28, 256);
      ctx.fillRect(228, 0, 28, 256);
      ctx.fillStyle = secondary_division_colour;
      ctx.fillRect(28, 0, 29, 256);
      ctx.fillRect(85, 0, 29, 256);
      ctx.fillRect(142, 0, 29, 256);
      ctx.fillRect(199, 0, 29, 256);
      break;
    case 10:
      ctx.fillStyle = primary_division_colour;
      ctx.fillRect(0, 0, 256, 28);
      ctx.fillRect(0, 57, 256, 28);
      ctx.fillRect(0, 114, 256, 28);
      ctx.fillRect(0, 171, 256, 28);
      ctx.fillRect(0, 228, 256, 28);
      ctx.fillStyle = secondary_division_colour;
      ctx.fillRect(0, 28, 256, 29);
      ctx.fillRect(0, 85, 256, 29);
      ctx.fillRect(0, 142, 256, 29);
      ctx.fillRect(0, 199, 256, 29);
      break;
    case 11:
      for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 7; j++) {
          if ((i + j) % 2 == 0) {
            ctx.fillStyle = primary_division_colour;
          } else {
            ctx.fillStyle = secondary_division_colour;
          }
          ctx.fillRect(37 * (((i + 1) / 2) | 0) + 36 * ((i / 2) | 0), 37 * (((j + 1) / 2) | 0) + 36 * ((j / 2) | 0), 36 + ((i + 1) % 2), 36 + ((j + 1) % 2));
        }
      }
      break;
  }

  //Draw foreground and determine symbol position & size
  //0 = no overlay
  //1 = central cross
  //2 = off-center cross
  //3 = X
  //4 = diagonal band, top-left to bottom-right
  //5 = diagonal band, bottom-left to top-right
  //6 = central circle
  //7 = semicircle on left-edge
  //8 = triangle on left-edge
  //9 = central diamond
  //10 = top-left quarter
  //11 = central square
  var symbol_position_x = 0;
  var symbol_position_y = 0;
  var symbol_size = 256;
  ctx.fillStyle = overlay_colour;
  switch (overlay) {
    case 0:
      symbol_position_x = 24;
      symbol_position_y = 24;
      symbol_size = 208;
      break;
    case 1:
      ctx.fillRect(104, 0, 48, 256);
      ctx.fillRect(0, 104, 256, 48);
      symbol_position_x = 24;
      symbol_position_y = 24;
      symbol_size = 208;
      break;
    case 2:
      ctx.fillRect(71, 0, 48, 256);
      ctx.fillRect(0, 104, 256, 48);
      symbol_position_x = 0;
      symbol_position_y = 33;
      symbol_size = 190;
      break;
    case 3:
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(34, 0);
      ctx.lineTo(256, 222);
      ctx.lineTo(256, 256);
      ctx.lineTo(222, 256);
      ctx.lineTo(0, 34);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(256, 0);
      ctx.lineTo(256, 34);
      ctx.lineTo(34, 256);
      ctx.lineTo(0, 256);
      ctx.lineTo(0, 222);
      ctx.lineTo(222, 0);
      ctx.closePath();
      ctx.fill();
      symbol_position_x = 24;
      symbol_position_y = 24;
      symbol_size = 208;
      break;
    case 4:
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(34, 0);
      ctx.lineTo(256, 222);
      ctx.lineTo(256, 256);
      ctx.lineTo(222, 256);
      ctx.lineTo(0, 34);
      ctx.closePath();
      ctx.fill();
      symbol_position_x = 24;
      symbol_position_y = 24;
      symbol_size = 208;
      break;
    case 5:
      ctx.beginPath();
      ctx.moveTo(256, 0);
      ctx.lineTo(256, 34);
      ctx.lineTo(34, 256);
      ctx.lineTo(0, 256);
      ctx.lineTo(0, 222);
      ctx.lineTo(222, 0);
      ctx.closePath();
      ctx.fill();
      symbol_position_x = 24;
      symbol_position_y = 24;
      symbol_size = 208;
      break;
    case 6:
      ctx.beginPath();
      ctx.arc(128, 128, 100, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
      symbol_position_x = 48;
      symbol_position_y = 48;
      symbol_size = 160;
      break;
    case 7:
      ctx.beginPath();
      ctx.arc(0, 128, 128, -Math.PI / 2, Math.PI / 2);
      ctx.closePath();
      ctx.fill();
      symbol_position_x = 3;
      symbol_position_y = 73;
      symbol_size = 110;
      break;
    case 8:
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(196, 128);
      ctx.lineTo(0, 256);
      ctx.closePath();
      ctx.fill();
      symbol_position_x = 8;
      symbol_position_y = 78;
      symbol_size = 100;
      break;
    case 9:
      ctx.beginPath();
      ctx.moveTo(128, 0);
      ctx.lineTo(256, 128);
      ctx.lineTo(128, 256);
      ctx.lineTo(0, 128);
      ctx.closePath();
      ctx.fill();
      symbol_position_x = 64;
      symbol_position_y = 64;
      symbol_size = 128;
      break;
    case 10:
      ctx.fillRect(0, 0, 128, 128);
      symbol_position_x = 2;
      symbol_position_y = 2;
      symbol_size = 124;
      break;
    case 11:
      ctx.fillRect(32, 32, 192, 192);
      symbol_position_x = 36;
      symbol_position_y = 36;
      symbol_size = 184;
      break;
  }

  //Draw symbol
  if (symbol != -1) {
    //Load symbol onto separate canvas
    const img = await loadImage(image_path);
    img.onerror = (err) => {
      throw err;
    };
    img.src = image_path;
    ctx2.drawImage(img, symbol_position_x, symbol_position_y, symbol_size, symbol_size);
    //Merge the two canvases together
    const imageData1 = ctx.getImageData(0, 0, 256, 256);
    const imageData2 = ctx2.getImageData(0, 0, 256, 256);
    const data1 = imageData1.data;
    const data2 = imageData2.data;
    for (var i = 0; i < data1.length; i += 4) {
      if (data2[i + 3] != 0) {
        data1[i] = colour_palette[4][0];
        data1[i + 1] = colour_palette[4][1];
        data1[i + 2] = colour_palette[4][2];
        data1[i + 3] = 255;
      }
    }

    //Write canvas to png file
    ctx.putImageData(imageData1, 0, 0);
    buffer = canvas.toBuffer("image/png");

    for (let output_path of output_paths) {
      fs.writeFileSync(output_path, buffer);
    }

    //Clear symbol canvas for use later
    ctx2.clearRect(0, 0, width, height);
  } else {
    //Don't bother with symbol and draw what we have to png file
    buffer = canvas.toBuffer("image/png");

    for (let output_path of output_paths) {
      fs.writeFileSync(output_path, buffer);
    }
  }
}

function generateFlags(output_path1, output_path2, input_path) {
  //Array of symbols that haven't been used yet
  var symbols = [];
  for (var i = 0; i < 39; i++) {
    symbols.push(i);
  }

  for (var i = 0; i < 39; i++) {
    var civName;
    //Symbol is an integer representing the flag symbol
    var symbol = symbols[getRandomInt(symbols.length)];
    var randInt = getRandomInt(4);
    if (randInt == 0 || symbols.length == 0) {
      //Chance of no symbol
      symbol = -1;
    } else {
      //Don't repeat symbols
      symbols.splice(symbols.indexOf(symbol), 1);
    }

    const nameArr = [
      "aztecs",
      "berber",
      "britons",
      "bulgarians",
      "burgundians",
      "burmese",
      "byzantines",
      "celts",
      "chinese",
      "cumans",
      "ethiopians",
      "franks",
      "goths",
      "huns",
      "inca",
      "indians",
      "italians",
      "japanese",
      "khmer",
      "koreans",
      "lithuanians",
      "magyars",
      "malay",
      "malians",
      "mayans",
      "mongols",
      "persians",
      "portuguese",
      "saracens",
      "sicilians",
      "slavs",
      "spanish",
      "tatars",
      "teutons",
      "turks",
      "vietnamese",
      "vikings",
      "poles",
      "bohemians",
    ];

    civName = nameArr[i];

    var seed = generateSeed();

    if (civName == "berber" || civName == "inca") {
      drawFlag(
        seed,
        symbol,
        output_path1 + "/" + civName + "s.png",
        output_path2 + "/menu_techtree_" + civName + ".png",
        output_path2 + "/menu_techtree_" + civName + "_hover.png",
        output_path2 + "/menu_techtree_" + civName + "_pressed.png",
        input_path
      );
    } else {
      drawFlag(
        seed,
        symbol,
        output_path1 + "/" + civName + ".png",
        output_path2 + "/menu_techtree_" + civName + ".png",
        output_path2 + "/menu_techtree_" + civName + "_hover.png",
        output_path2 + "/menu_techtree_" + civName + "_pressed.png",
        input_path
      );
    }
  }
}
