let numGlobalMessages = -1;

async function retrieveGlobalChat (numMessages) {
	let messages = await axios.post("https://krakenmeister.com/michigaigo/globalchat", {get: numMessages});
	if (messages.data.numMessages != numGlobalMessages) {
		removeAllChildNodes(document.getElementById("globalMessagesWrapper"));
		for (let i=0; i<messages.data.messages.length; i++) {
			let e = document.createElement("div");
			e.classList.add("globalMessage");
			e.textContent = `${messages.data.messages[i].author}: ${messages.data.messages[i].message}`;
			document.getElementById("globalMessagesWrapper").appendChild(e);
			document.getElementById("globalMessagesWrapper").scrollTop = document.getElementById("globalMessagesWrapper").scrollHeight;
		}
		numGlobalMessages = messages.data.numMessages;
	}
}

async function sendGlobalChat (message) {
	let username = await getUsername();
	let messageobj;
	if (!username) {
		messageobj = {
			"author": "Anonymous",
			"message": message
		};
	} else {
		messageobj = {
			"author": username,
			"message": message
		};
	}
	let success = await axios.post("https://krakenmeister.com/michigaigo/globalchat", {chat: messageobj});
	if (success.data.success) {
		console.log("success");
	}
}

function renderGlobalChat (globalChatOpen) {
	if (globalChatOpen) {
		document.getElementById("wrapper").style.backgroundImage = "url('/michigaigo/img/play_background2.png')";
		document.getElementById("globalChatWrapper").style.display = "block";
		if (document.getElementById("expandBtn")) {
			document.getElementById("expandBtn").remove();
		}
		if (document.getElementById("collapseBtn")) {
			document.getElementById("collapseBtn").remove();
		}

		let collapseBtn = document.createElement("img");
		collapseBtn.id = "collapseBtn";
		collapseBtn.src = "/michigaigo/img/collapse.png";
		collapseBtn.addEventListener("click", () => {
			renderGlobalChat(!globalChatOpen);
		});
		document.getElementById("wrapper").appendChild(collapseBtn);
	} else {
		document.getElementById("wrapper").style.backgroundImage = "url('/michigaigo/img/play_background.png')";
		document.getElementById("globalChatWrapper").style.display = "none";
		if (document.getElementById("expandBtn")) {
			document.getElementById("expandBtn").remove();
		}
		if (document.getElementById("collapseBtn")) {
			document.getElementById("collapseBtn").remove();
		}

		let expandBtn = document.createElement("img");
		expandBtn.id = "expandBtn";
		expandBtn.src = "/michigaigo/img/expand.png";
		expandBtn.addEventListener("click", () => {
			renderGlobalChat(!globalChatOpen);
		});
		document.getElementById("wrapper").appendChild(expandBtn);
	}
}

document.getElementById("globalSend").addEventListener("click", () => {
	if (document.getElementById("globalMessage").value != "") {
		sendGlobalChat(document.getElementById("globalMessage").value);
		document.getElementById("globalMessage").value = "";
		renderGlobalChat(true);
	}
});

renderGlobalChat(true);

let retrieveLoop = window.setInterval(() => {
	if (document.getElementById("globalChatWrapper").style.display != "none") {
		retrieveGlobalChat(20);
	}
}, 500);
