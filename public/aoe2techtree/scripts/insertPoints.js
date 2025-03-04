const fs = require("fs");

let data = JSON.parse(fs.readFileSync(`../data/data.json`, "utf8"));
let points = JSON.parse(fs.readFileSync(`./tree_points.json`, "utf8"));

for (let i = 0; i < points[0].length; i++) {
	if (data.data.unit_upgrades[points[0][i]["id"]]) {
		data.data.unit_upgrades[points[0][i]["id"]].tech_cost = points[0][i]["cost"];
		console.log(`${points[0][i]["name"]}: ${points[0][i]["cost"]}`);
	}
	if (data.data.units[points[0][i]["id"]]) {
		data.data.units[points[0][i]["id"]].tech_cost = points[0][i]["cost"];
		console.log(`${points[0][i]["name"]}: ${points[0][i]["cost"]}`);
	}
}

for (let i = 0; i < points[1].length; i++) {
	if (data.data.buildings[points[1][i]["id"]]) {
		data.data.buildings[points[1][i]["id"]].tech_cost = points[1][i]["cost"];
		console.log(`${points[1][i]["name"]}: ${points[1][i]["cost"]}`);
	}
}

for (let i = 0; i < points[2].length; i++) {
	if (data.data.techs[points[2][i]["id"]]) {
		data.data.techs[points[2][i]["id"]].tech_cost = points[2][i]["cost"];
		console.log(`${points[2][i]["name"]}: ${points[2][i]["cost"]}`);
	}
}

fs.writeFileSync("../data/data.json", JSON.stringify(data, null, 2));
