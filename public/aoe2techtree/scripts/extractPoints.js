const fs = require("fs");

let data = JSON.parse(fs.readFileSync(`../data/data.json`, "utf8"));

let buildings = [];
for (let building in data.data.buildings) {
	if (Object.hasOwn(data.data.buildings[building], "tech_cost")) {
		buildings.push({
			name: data.data.buildings[building].internal_name,
			id: building,
			cost: data.data.buildings[building].tech_cost,
		});
	}
}

let techs = [];
for (let tech in data.data.techs) {
	if (Object.hasOwn(data.data.techs[tech], "tech_cost")) {
		techs.push({
			name: data.data.techs[tech].internal_name,
			id: tech,
			cost: data.data.techs[tech].tech_cost,
		});
	}
}

let units = [];
for (let unit in data.data.unit_upgrades) {
	console.log(unit);
	if (Object.hasOwn(data.data.unit_upgrades[unit], "tech_cost")) {
		units.push({
			name: data.data.unit_upgrades[unit].internal_name,
			id: unit,
			cost: data.data.unit_upgrades[unit].tech_cost,
		});
	}
}

for (let unit in data.data.units) {
	if (Object.hasOwn(data.data.units[unit], "tech_cost")) {
		units.push({
			name: data.data.units[unit].internal_name,
			id: unit,
			cost: data.data.units[unit].tech_cost,
		});
	}
}

let tree_points = [units, buildings, techs];

console.log(tree_points);
fs.writeFileSync("./tree_points.json", JSON.stringify(tree_points, null, 2));
