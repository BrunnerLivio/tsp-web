"use strict";

var tsp = require('../../core/tsp');

module.exports = function (socket, io) {
    var tspreader;

    tspreader = tsp.reader()
        .subscribe(function (data) {
            io.sockets.emit('newTspData', data);
        })
        .watch();

    socket.on('disconnect', function () {
        if (tspreader) {
            tspreader.stop();
        }
    });
};