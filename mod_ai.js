const fs = require('fs');

module.exports = {createAI};

function createAI (json_path, ai_folder) {
        var data = fs.readFileSync(json_path)
        var civs = JSON.parse(data)

	for (var i=0; i<civs.name.length; i++) {
		fs.closeSync(fs.openSync(`${ai_folder}/${civs.name[i]} AI (pre-alpha).ai`, 'w'));
		var aiStream = fs.createWriteStream(`${ai_folder}/${civs.name[i]} AI (pre-alpha).per`, {flags: 'a'});
		aiStream.write(`; Civbuilder generated AI File\n`);
		aiStream.write(`; Feel free to edit as you please\n`);
		aiStream.end();
	}
}
