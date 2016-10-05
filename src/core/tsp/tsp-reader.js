var spawn = require('child_process').spawn,
    shellParser = require('node-shell-parser');

/**
 * @module tspReader
 * @description
 * Module for reading tsp data async.
 * 
 * @returns {Object} A collection of public possible methods
 */
function tspReader() {
    var promise,
        tsp,
        shellOutput = '',
        intervalId;

    /**
     * @name subscribe
     * @description
     * Subscribe to events, whenever the tsp gets updated.
     * 
     * @memberOf tspReader
     * 
     * @param {requestCallback} _promise The promise which gets called, whenever an update occurs
     * 
     * @returns {Object} A collection of public possible methods
     */
    function subscribe(_promise) {
        promise = _promise;
        return public;
    }

    /**
     * @name watch
     * 
     * @description
     * Starts checking tsp every second.
     * Note: Automaticly pushes the whole tsp data, immediatly
     * after you called this method.
     * 
     * @memberOf tspReader
     * 
     * @returns {Object} A collection of public possible methods
     */
    function watch() {
        run();
        intervalId = setInterval(function () {
            run();
        }, 1000);

        return public;
    }

    /**
     * @name run
     * 
     * @description
     * Reads the tsp data, parses it and pushes it to
     * the subscribers
     * 
     * @memberOf tspReader
     * 
     * @returns {Object} A collection of public possible methods
     */
    function run() {
        tsp = spawn('tsp');
        shellOutput = '';

        tsp.stdout.on('data', function (data) {
            data = data.toString();
            data = data.replace(/\[run=[0-9]\/[0-9]\]/g, '');
            data = data.replace(/E-Level/g, 'ELevel ');
            data = data.replace(/Times\(r\/u\/s\)/g, 'Times       ');
            shellOutput += data;
        });


        tsp.stdout.on('end', function () {
            if (promise) {
                promise(shellParser(shellOutput));
            }
        });

        return public;
    }

    /**
     * @name stop
     * 
     * @description
     * Stops the interval, which pushes tsp data to its subscribers
     * 
     * @memberOf tspReader
     * 
     * @returns {Object} A collection of public possible methods
     */
    function stop() {
        if (intervalId) {
            clearInterval(intervalId);
        }
        return public;
    }

    var public = {
        subscribe: subscribe,
        watch: watch,
        run: run,
        stop: stop
    };

    return public;
}


module.exports = tspReader;