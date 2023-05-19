#!/usr/bin/env node

var program = require("commander");
var startup = require("user-startup");
var os = require("os");
var path = require("path");
var chalk = require("chalk");

program
  .usage("[options]")
  .option("-s, --startup", "Register as startup process")
  .parse(process.argv);

var keywords = program.args;
var log = path.join(os.tmpdir(), "tsp-web");

if (program.startup) {
  startup.create("tsp-web", process.execPath, [__dirname], log);
  console.log("Automaticly registered in startup");
} else {
  require("./index");
}

var hostname =  process.env.TSP_WEB_HOSTNAME || '0.0.0.0'
console.log(
  [
    "Started webserver",
    "Go to " + chalk.cyan("http://" + hostname + ":" + process.env.TSP_WEB_PORT || 3000),
  ].join("\n")
);
