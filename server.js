const express = require("express");
const http = require("http");
const { createCivbuilderRouter } = require("./router");

const app = express();
const server = http.Server(app);

const PORT = process.env.PORT || 3000;

app.use("/", createCivbuilderRouter());

server.listen(PORT, () => {
	console.log(`Civbuilder listening on http://localhost:${PORT}`);
});
