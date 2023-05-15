"use strict";

var spawn = require('child_process').spawn,
    chalk = require('chalk'),
    _ = require('lodash');

const { TSP_WEB_BIN } = require('./env');
var tspParser = require('./tsp-parser');
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
        intervalId,
        errorPromise,
        lastTasks;

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
        return methods;
    }

    /**
     * @name error
     * @description
     * Subscribe to errors
     * 
     * @memberOf tspReader
     * 
     * @param {requestCallback} _errorPromise The promise which gets called, whenever an error occurs
     * 
     * @returns {Object} A collection of public possible methods
     */
    function onError(_errorPromise) {
        errorPromise = _errorPromise;
        return methods;
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

        return methods;
    }

    function getTasks(_promise) {
        tsp = spawn(TSP_WEB_BIN);
        shellOutput = '';

        tsp.stdout.on('data', function (data) {
            data = data.toString();
            shellOutput += data;
        });


        tsp.stdout.on('end', function () {
            var output = tspParser.parse(shellOutput);
            if (_promise) {
                _promise(output);
            }
        });

        tsp.stderr.on('data', function (data) {
            console.log(chalk.cyan('[Core] '), chalk.red(data));
            if (errorPromise) {
                errorPromise(data);
            }
        });
    }

    /**
     * @name getTaskById
     * 
     * @description
     * Returns a tsp task object by id
     * 
     * @memberOf tspReader
     * 
     * @returns {Object} A collection of public possible methods
     */
    function getTaskById(id, _promise) {
        getTasks(function (tasks) {
            _promise(tasks.filter(function (task) {
                return parseInt(task.ID) === id;
            })[0]);
        });

        return methods;
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
        getTasks(function (tasks) {
            if (!_.isEqual(lastTasks, tasks)) {
                lastTasks = tasks;
                promise(tasks);
            }
        });

        return methods;
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
        return methods;
    }

    var methods = {
        subscribe: subscribe,
        watch: watch,
        run: run,
        stop: stop,
        onError: onError,
        getTaskById: getTaskById
    };

    return methods;
}


module.exports = tspReader;