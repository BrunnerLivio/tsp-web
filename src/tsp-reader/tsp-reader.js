var spawn = require('child_process').spawn,
    shellParser = require('node-shell-parser');

function tspReader() {
    var promise,
        tsp,
        shellOutput = '',
        intervalId;

    function subscribe(_promise) {
        promise = _promise;
        return public;
    }

    function watch() {
        run();
        intervalId = setInterval(function () {
            run();
        }, 1000);

        return public;
    }

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