"use strict";

var spawn = require('child_process').spawn;
var tspReader = require('./tsp-reader');
var process = require('process');
/**
 * @module tspTask
 * @description 
 * Module for tsp task operations async.
 * 
 * @returns {Object} A collection of public possible methods
 */
function tspTask() {

    /**
     * @name remove
     * @description
     * Removes the tsp task with the given id
     * 
     * @param {Number} id The id of the task
     * 
     * @memberOf tspTask
     */
    function remove(id) {
        tspReader().getTaskById(parseInt(id), function (task) {
            if (task.State === 'finished') {
                spawn('tsp', ['-r', id]);
            } else {
                var tsp = spawn('tsp', ['-p', id]);
                tsp.stdout.on('data', function (data) {
                    // Uint8array to string
                    var pid = "";
                    for (var i = 0; i < data.byteLength; i++) {
                        pid += String.fromCharCode(data[i]);
                    }
                    pid = parseInt(pid.replace('\n', ''));

                    process.kill(pid);
                });
            }
        });
    }

    /**
     * @name killAll
     * @description
     * Kills all tsp tasks
     * 
     * @memberOf tspTask
     */
    function killAll() {
        spawn('tsp', ['-K']);
    }

    var methods = {
        remove: remove,
        killAll: killAll
    };

    return methods;
}


module.exports = tspTask();