#!/usr/bin/env node

var program = require('commander');
var pjson = require('./package.json');
program
    .version(pjson.version)
    .usage('<command>')
    .command('start', 'Start the tsp web')
    .command('stop', 'Stop the tsp web')
    .parse(process.argv);

if (!program.args.length) {
    program.help();
} 