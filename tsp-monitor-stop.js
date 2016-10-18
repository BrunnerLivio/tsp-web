#!/usr/bin/env node

var program = require('commander');
var startup = require('user-startup');
var os = require('os');
var path = require('path');
var chalk = require('chalk');
var got = require('got');

program
    .usage('[options]')
    .option('-s, --startup', 'Remove tsp-monitor from startup')
    .parse(process.argv);

var keywords = program.args;
var log = path.join(os.tmpdir(), 'tsp-monitor');


if (program.startup) {
    startup.remove('tsp-monitor');
    console.log('Removed from startup');
}

console.log('Stop Server');
got.delete('http://localhost:' + 3000);