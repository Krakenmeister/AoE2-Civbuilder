const fs = require('fs')

function deleteStaleDrafts() {
	var raw_data = fs.readFileSync('./database.json')
	var data = JSON.parse(raw_data)
	var drafts = data['drafts']
	var currentTime = Date.now()
	for (var i=0; i<drafts.length; i++) {
		if ((currentTime - drafts[i]['timestamp']) >= 7200000) {
			drafts.splice(i, 1)
			i--
		}
	}
	fs.writeFileSync('./database.json', JSON.stringify(data, null, 2))
}

deleteStaleDrafts()
