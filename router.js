const express = require("express");
const path = require("path");

function createCivbuilderRouter() {
	const router = express.Router();

	router.use(express.static(path.join(__dirname, "public")));

	router.get("/", function (req, res) {
		if (process.env.WEB_DISPLAY === "updating") {
			res.sendFile(__dirname + "/public/html/updating.html");
		} else if (process.env.WEB_DISPLAY === "donate") {
			res.sendFile(__dirname + "/public/html/donation.html");
		} else {
			res.sendFile(__dirname + "/public/html/civbuilder_home.html");
		}
	});

	router.get("/build", function (req, res) {
		if (process.env.WEB_DISPLAY === "updating") {
			res.sendFile(__dirname + "/public/html/updating.html");
		} else if (process.env.WEB_DISPLAY === "donate") {
			res.sendFile(__dirname + "/public/html/donation.html");
		} else {
			res.sendFile(__dirname + "/public/html/civbuilder.html");
		}
	});

	router.get("/config.js", (req, res) => {
		res.type("application/javascript");

		const config = {
			hostname: process.env.PUBLIC_HOSTNAME || "http://localhost:3000",
			route: process.env.PUBLIC_ROUTE || "",
		};

		res.send(`window.__APP_CONFIG__ = ${JSON.stringify(config)};`);
	});

	return router;
}

module.exports = { createCivbuilderRouter };
