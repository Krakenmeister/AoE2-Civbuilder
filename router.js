const express = require("express");
const path = require("path");

function createCivbuilderRouter() {
	const router = express.Router();

	router.use(express.static(path.join(__dirname, "public")));

	router.get("/", function (req, res) {
		// res.sendFile(__dirname + "/public/html/civbuilder_home.html");
		res.sendFile(__dirname + "/public/html/updating.html");
		// res.sendFile(__dirname + "/public/html/donation.html");
	});

	return router;
}

module.exports = { createCivbuilderRouter };
