const fs = require("fs");

function printStrings(strings_path) {
	console.log("Strings path = " + strings_path);

	const allFileContents = fs.readFileSync(strings_path, "utf-8");
	allFileContents.split(/\r?\n/).forEach((line) => {
		if (line.trim() == "") {
			console.log("\n");
		}

		let strings = line.split(`"`);
		if (strings.length > 1) {
			let string = line.split(`"`)[1];
			if (string.includes("[")) {
				console.log(`"${string.substring(0, string.indexOf(")") + 1)}",`);
			} else {
				console.log(`"${string}",`);
			}
		}
	});
}

let args = process.argv.slice(2);
printStrings(args[0], args[1]);
