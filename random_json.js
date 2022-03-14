const fs = require('fs')
const names = require("./random_name.js")
const techtrees = require("./random_techtree.js")

//const writeFile = (filename, content) => {fs.writeFile(filename, content, () => {})}

module.exports = {
	createJson
}

const num_civs = 39
const num_unique_units = 79
const num_castle_techs = 44
const num_imp_techs = 44
const num_civ_bonuses = 287
const num_team_bonuses = 75

function createJson(output_path, costs) {
	//Each array will contain 37 elements corresponding to which vanilla civ it will overwrite
	var random_data = {}

	//Name elements contain a single string
	random_data.name = []

	//Each techtree element is an array with 125 entries
	//Each entry is an index (0 or 1) representing if that technology is available or not
	//Index 0 is special and represents the unique unit
	random_data.techtree = []

	//Each castletech element is an array of numbers, each representing a unique castle age technology
	random_data.castletech = []

	//Each imptech element is an array of numbers, each representing a unique imperial age technology
	random_data.imptech = []

	//Civ bonus elements are each an array of num_bonus numbers, mapping to specific civ bonuses in an atlas
	random_data.civ_bonus = []

	//Team bonuses are a single number
	random_data.team_bonus = []

	//Icon set 1-11
	random_data.architecture = []

	//Villager sfx file set
	random_data.language = []

	//0 = don't give random costs, 1 = do give random costs
	if (costs == 'random') {
		random_data.random_costs = 1
	} else {
		random_data.random_costs = 0
	}

	random_data.name = (names.generateNames(num_civs)).sort()
	for (var i=0; i<num_civs; i++) {
		random_data.techtree.push(techtrees.generateTechTree())
	}

	var uniqueUnits = []
	for (var i=0; i<num_unique_units; i++) {
		uniqueUnits.push(i)
	}
	for (var i=0; i<random_data.techtree.length; i++) {
		var rand_unit = Math.floor(Math.random() * uniqueUnits.length)
		random_data.techtree[i][0] = uniqueUnits[rand_unit]
		uniqueUnits.splice(rand_unit, 1)
	}

	var uniqueCastleTechs = []
        for (var i=0; i<num_castle_techs; i++) {
                uniqueCastleTechs.push(i)
        }
        for (var i=0; i<random_data.techtree.length; i++) {
                var rand_castle_tech = Math.floor(Math.random() * uniqueCastleTechs.length)
		var castle_techs = []
		castle_techs.push(uniqueCastleTechs[rand_castle_tech])
		random_data.castletech.push(castle_techs)
                uniqueCastleTechs.splice(rand_castle_tech, 1)
        }

        var uniqueImpTechs = []
        for (var i=0; i<num_imp_techs; i++) {
                uniqueImpTechs.push(i)
        }
        for (var i=0; i<random_data.techtree.length; i++) {
                var rand_imp_tech = Math.floor(Math.random() * uniqueImpTechs.length)
		var imp_techs = []
		imp_techs.push(uniqueImpTechs[rand_imp_tech])
		random_data.imptech.push(imp_techs)
                uniqueImpTechs.splice(rand_imp_tech, 1)
	}

	var civBonuses = []
	for (var i=/*(num_civ_bonuses - (5*37))*/0; i<num_civ_bonuses; i++) {
		civBonuses.push(i)
	}
	for (var i=0; i<random_data.techtree.length; i++) {
		var bonus_arr = []
		var num_bonuses = 5
		for (var j=0; j<num_bonuses; j++) {
			var rand_civ_bonus = Math.floor(Math.random() * civBonuses.length)
			bonus_arr.push(civBonuses[rand_civ_bonus])
			civBonuses.splice(rand_civ_bonus, 1)
		}
		random_data.civ_bonus.push(bonus_arr)
	}

	var teamBonuses = []
	for (var i=/*(num_team_bonuses - 37)*/0; i<num_team_bonuses; i++) {
		teamBonuses.push(i)
	}
	for (var i=0; i<random_data.techtree.length; i++) {
		var rand_team_bonus = Math.floor(Math.random() * teamBonuses.length)
		var team_bonuses = []
		team_bonuses.push(teamBonuses[rand_team_bonus])
		random_data.team_bonus.push(team_bonuses)
		teamBonuses.splice(rand_team_bonus, 1)
	}

	for (var i=0; i<random_data.techtree.length; i++) {
		var rand_architecture = Math.floor(Math.random() * 11) + 1
		random_data.architecture.push(rand_architecture)
	}

	for (var i=0; i<random_data.techtree.length; i++) {
		var rand_language = Math.floor(Math.random() * num_civs)
		random_data.language.push(rand_language)
	}

	fs.writeFileSync(output_path, JSON.stringify(random_data, null, 2))
}
