const fs = require("fs");

function applyTechCosts(costs_path, data_path, output_path) {
  let raw_costs = fs.readFileSync(costs_path);
  costs = JSON.parse(raw_costs);

  let raw_data = fs.readFileSync(data_path);
  data = JSON.parse(raw_data);

  for (let nodeType in costs) {
    for (let costPair of costs[nodeType]) {
      data["data"][nodeType][costPair["id"].toString()]["tech_cost"] = costPair["tech_cost"];
    }
  }

  fs.writeFileSync(output_path, JSON.stringify(data, null, 2));
}

let args = process.argv.slice(2);
applyTechCosts(args[0], args[1], args[2]);
