#!/usr/bin/env node

var program = require('commander');
var startup = require('user-startup');
var os = require('os');
var path = require('path');
var chalk = require('chalk');
var got = require('got');

program
    .usage('[options]')
    .option('-s, --startup', 'Remove tsp-web from startup')
    .parse(process.argv);

var keywords = program.args;
var log = path.join(os.tmpdir(), 'tsp-web');


if (program.startup) {
    startup.remove('tsp-web');
    console.log('Removed from startup');
}

console.log('Stop Server');

var hostname =  process.env.TSP_WEB_HOSTNAME || '0.0.0.0'
got.delete('http://'+ hostname + ':' + process.env.TSP_WEB_PORT || 3000);