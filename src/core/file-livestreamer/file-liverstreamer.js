"use strict";

var spawn = require('child_process').spawn,
    fs = require('fs'),
    chalk = require('chalk');
/**
 * @module FileLivestreamer
 * @description
 * Module for livestreaming a file async.
 * 
 * @param {string} fileName Path of the file it should stream. E.g. /tmp/myfile.txt
 * @returns {Object} A collection of public possible methods
 */
function FileLivestreamer(fileName) {
    var self = this || {};
    self.fileName = fileName;

    /**
     * @name subscribe
     * @description
     * Subscribe to events, whenever the given file gets updated.
     * 
     * @memberOf fileLivestreamer
     * 
     * @param {requestCallback} promise The promise which gets called, whenever an update occurs
     * @param {requestCallback} errorPromise The promise which gets called, whenever an error occurs
     * 
     * @returns {Object} A collection of public possible methods
     */
    function subscribe(promise) {
        self.promise = promise;
        return methods;
    }

    /**
     * @name subscribe
     * @description
     * Subscribe to errors
     * 
     * @memberOf fileLivestreamer
     * 
     * @param {requestCallback} errorPromise The promise which gets called, whenever an error occurs
     * 
     * @returns {Object} A collection of public possible methods
     */
    function onError(errorPromise) {
        self.errorPromise = errorPromise;
        return methods;
    }

    /**
     * @name pushFileContent
     * @description
     * Reads the given file and pushes the content of it
     * to the subscribers
     * 
     * @memberOf fileLivestreamer
     */
    function pushFileContent() {
        fs.readFile(self.fileName, 'utf8', function (err, data) {
            if (err) {
                console.log(chalk.cyan('[Core] '), chalk.red(err));
                if (self.errorPromise) {
                    self.errorPromise(err);
                }
            }
            if (self.promise !== undefined) {
                self.promise(data);
            }
        });
    }
    /**
     * @name watch
     * 
     * @description
     * Starts watch on file changes of the given file.
     * When a file change occurs, you'll get automaticly notified,
     * when you're subscribed to events, using .subscribe().
     * Note: Automaticly pushes the whole content of the file, immediatly
     * after you called this method
     * 
     * @memberOf fileLivestreamer
     * 
     * @returns {Object} A collection of public possible methods
     */
    function watch() {
        pushFileContent();
        self.watcher = fs.watch(self.fileName, function (curr, prev) {
            pushFileContent();
        });
        return methods;
    }

    /**
     * @name stop
     * @description
     * Stop watch file changes. You won't get notified anymore
     * 
     * @memberOf fileLivestreamer
     * 
     * @returns {Object} A collection of public possible methods
     */
    function stop() {
        if (self.watcher) {
            self.watcher.close();
        }
        return methods;
    }

    var methods = {
        subscribe: subscribe,
        watch: watch,
        stop: stop,
        onError: onError
    };

    return methods;
}


module.exports = FileLivestreamer;