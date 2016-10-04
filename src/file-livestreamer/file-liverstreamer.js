var spawn = require('child_process').spawn,
    fs = require('fs');

function fileLivestreamer(fileName) {
    var self = this;
    self.fileName = fileName;

    function subscribe(promise) {
        self.promise = promise;
        return public;
    }

    function pushFileContent() {
        fs.readFile(self.fileName, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            if (self.promise !== undefined) {
                self.promise(data);
            }
        });
    }

    function watch() {
        pushFileContent();
        self.watcher = fs.watch(self.fileName, function (curr, prev) {
            pushFileContent();
        });
        return public;
    }

    function run() {
        return public;
    }

    function stop() {
        if (self.watcher) {
            self.watcher.close();
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


module.exports = fileLivestreamer;