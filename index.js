var tspReader = require('./tsp-reader/tsp-reader');

tspReader
    .subscribe(function(data){
        console.log(data);
    })
    .watch();