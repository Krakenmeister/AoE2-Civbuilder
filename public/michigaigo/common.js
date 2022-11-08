function argMin (arr) {
	if (arr.length === 0) {
		return -1;
	}
	let min = arr[0];
	let minIndex = 0;
	for (let i = 1; i < arr.length; i++) {
		if (arr[i] < min) {
			minIndex = i;
			min = arr[i];
		}
	}
	return minIndex;
}

function post (path, params, method='post') {
	const form = document.createElement('form')
	form.method = method
	form.action = path
	for (const key in params) {
		if (params.hasOwnProperty(key)) {
			const hiddenField = document.createElement('input')
			hiddenField.type = 'hidden'
			hiddenField.name = key
			hiddenField.value = params[key]
			form.appendChild(hiddenField)
		}
	}
	document.body.appendChild(form)
	form.submit()
}

function removeAllChildNodes (parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

function getCookie (name) {
	let nameEQ = name + "=";
	let ca = document.cookie.split(';');
	for(let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0)==" ") {
			c = c.substring(1,c.length);
		}
		if (c.indexOf(nameEQ) == 0) {
			return c.substring(nameEQ.length,c.length);
		}
	}
	return null;
}

async function getUsername () {
	let loginToken = getCookie("loginToken");
	if (loginToken) {
		let username = await axios.post("https://krakenmeister.com/michigaigo/username", {token: loginToken});
		if (username.data.success) {
			return username.data.username;
		} else {
			return null;
		}
	}
}


getUsername().then(username => {
	if (document.getElementById("profileNav")) {
		if (!username) {
			document.getElementById("profileNav").textContent = "Guest";
		} else {
			document.getElementById("profileNav").textContent = username;
		}
	}
});

if (document.getElementById("playNav")) {
	document.getElementById("playNav").addEventListener("click", () => {
		location.href = "https://krakenmeister.com/michigaigo/play";
	});
}

if (document.getElementById("boardEditorNav")) {
	document.getElementById("boardEditorNav").addEventListener("click", () => {
		location.href = "https://krakenmeister.com/michigaigo/edit";
	});
}

/*let boardGraph = {};

let m = 19;
let n = 19;
boardGraph["nodesNum"] = m*n;
boardGraph["nodesPos"] = [];
boardGraph["nodesConnection"] = [];
let posDist = 90/Math.max(m-1, n-1);
for (let i=0; i<m; i++) {
	for (let j=0; j<n; j++) {
		let coordinate;
		if (m > n) {
			coordinate = [50 + posDist*(i - (m-1)/2), 50 + posDist*(j - (n-1)/2)];
		} else {
			coordinate = [50 + posDist*(j - (n-1)/2), 50 + posDist*(i - (m-1)/2)];
		}
		boardGraph["nodesPos"].push(coordinate);
	}
}

for (let i=0; i<m-1; i++) {
	for (let j=0; j<n; j++) {
		let connection = [n*i + j, n*(i+1) + j];
		boardGraph["nodesConnection"].push(connection);
	}
}
for (let i=0; i<m; i++) {
	for (let j=0; j<n-1; j++) {
		let connection = [n*i + j, n*i + (j+1)];
		boardGraph["nodesConnection"].push(connection);
	}
}


let canvas = document.getElementById("canvas");
let goban = canvas.getContext("2d");
for (let i=0; i<boardGraph["nodesConnection"].length; i++) {
	goban.moveTo(boardGraph["nodesPos"][boardGraph["nodesConnection"][i][0]][0], boardGraph["nodesPos"][boardGraph["nodesConnection"][i][0]][1]);
	goban.lineTo(boardGraph["nodesPos"][boardGraph["nodesConnection"][i][1]][0], boardGraph["nodesPos"][boardGraph["nodesConnection"][i][1]][1]);
	goban.stroke();
}

console.log(boardGraph);
*/
