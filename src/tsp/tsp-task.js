var spawn = require('child_process').spawn;

function tspTask() {
    function remove(id) {
        tsp = spawn('tsp', ['-r', id]);
    }

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