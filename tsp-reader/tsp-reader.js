var spawn = require('child_process').spawn,
    shellParser = require('node-shell-parser');

function tspReader() {
    var promise,
        tsp,
        shellOutput = '';

    function subscribe(_promise) {
        promise = _promise;
        return public;
    }

    function watch() {
        setInterval(function () {
            run();
        }, 1000);
    }

    function run() {
        tsp = spawn('tsp');
        shellOutput = '';

        tsp.stdout.on('data', function (data) {
            data = data.toString().replace(/\[run=[0-9]\/[0-9]\]/g, '');
            shellOutput += data;
        });


        tsp.stdout.on('end', function () {
            if (promise) {
                promise(shellParser(shellOutput));
            }
        });

        return public;
    }

    var public = {
        subscribe: subscribe,
        watch: watch,
        run: run
    };

    return public;
}


module.exports = tspReader();