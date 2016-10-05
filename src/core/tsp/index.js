"use strict";

var tspReader = require('./tsp-reader'),
    tspTask = require('./tsp-task');

/**
 * @module tsp
 * @description
 * Module for tsp operations
 * 
 * @returns {Object} A collection of tsp operation option
 */
function tsp() {
    return {
        reader: tspReader,
        task: tspTask
    };
}


module.exports = tsp();