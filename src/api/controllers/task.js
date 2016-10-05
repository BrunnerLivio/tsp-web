"use strict";

var tsp = require('../../core/tsp');

module.exports = function (app) {
    app.delete('/task/:id', function (request, response) {
        tsp.task.remove(request.params.id);
        response.status(200).end();
    });

    app.delete('/kill-all-tasks', function (request, response) {
        tsp.task.killAll();
        response.status(200).end();
    });
};