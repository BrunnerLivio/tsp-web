#!/usr/bin/env node

var program = require('commander');
var pjson = require('./package.json');
program
    .version(pjson.version)
    .usage('<command>')
    .command('start', 'Start the tsp monitor')
    .command('stop', 'Stop the tsp monitor')
    .parse(process.argv);

if (!program.args.length) {
    program.help();
} 