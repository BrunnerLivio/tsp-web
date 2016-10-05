var spawn = require('child_process').spawn;

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
        tsp = spawn('tsp', ['-r', id]);
    }

    /**
     * @name killAll
     * @description
     * Kills all tsp tasks
     * 
     * @memberOf tspTask
     */
    function killAll() {
        tsp = spawn('tsp', ['-K']);
    }

    var public = {
        remove: remove,
        killAll: killAll
    };

    return public;
}


module.exports = tspTask();