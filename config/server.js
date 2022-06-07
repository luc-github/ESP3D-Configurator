const express = require("express");
const chalk = require("chalk");
let path = require("path");
const fs = require("fs");
const port = 8080;
/*
 * Web Server for development
 */
const wscolor = chalk.cyan;
const expresscolor = chalk.green;
const commandcolor = chalk.white;
const app = express();

let serverpath = path.normalize(__dirname + "/../server/public/");

app.listen(port, () =>
  console.log(expresscolor(`[express] Listening on port ${port}!`))
);






















