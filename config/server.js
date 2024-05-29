const express = require("express")
const expressStaticGzip = require("express-static-gzip")
const chalk = require("chalk")
let path = require("path")
const fs = require("fs")
const port = 8080
const expresscolor = chalk.green
const commandcolor = chalk.white
const WebSocket = require("ws")
let currentID = 0
const app = express()
const serverpath = path.normalize(__dirname + "/../server/")

app.listen(port, () => console.log("Devt server"))
app.timeout = 2000
