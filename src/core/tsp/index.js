var tspReader = require('./tsp-reader'),
    tspTask = require('./tsp-task');

function tsp() {
    return {
        reader: tspReader,
        task: tspTask
    };
}


module.exports = tsp();