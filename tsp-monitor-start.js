#!/usr/bin/env node

var program = require('commander');
var startup = require('user-startup');
var os = require('os');
var path = require('path');
var chalk = require('chalk');

program
    .usage('[options]')
    .option('-s, --startup', 'Register as startup process')
    .parse(process.argv);


var keywords = program.args;
var log = path.join(os.tmpdir(), 'tsp-monitor');

if (program.startup) {
    startup.create('tsp-monitor', process.execPath, [__dirname], log);
    console.log('Automaticly registered in startup');
}

console.log([
    'Started webserver',
    'Go to ' + chalk.cyan('http://localhost:3000')
].join('\n'));