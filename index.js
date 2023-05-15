"use strict";
// @ts-check

var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io').listen(http),
    chalk = require('chalk');

app.set('ipaddr', '0.0.0.0');

app.set('port', process.env.TSP_WEB_PORT || 3000);

// === Public Static Routes ===

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/public/index.html');
});

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/app', express.static(__dirname + '/public/app'));
app.use('/assets', express.static(__dirname + '/public/assets'));

// === HTTP Controllers ===
require('./src/api/controllers/task')(app);


var server = http.listen(app.get('port'), app.get('ipaddr'), function () {
    console.log(chalk.cyan('[Server] ') + 'Up and running. Go to ' + chalk.blue('http://' + app.get('ipaddr') + ':' + app.get('port')));
});

server.on('error', function (err) {
    console.log(chalk.cyan('[Server] ') + chalk.red(err));

});


io.on('connection', function (socket) {
    // === Websocket Controllers ===
    require('./src/api/controllers/filestream')(socket, io);
    require('./src/api/controllers/tsp')(socket, io);

    console.log(chalk.cyan('[Websocket] ') + 'New user connected (' + socket.handshake.address + ')');
    socket.on('error', function (err) {
        console.log(chalk.cyan('[Websocket]'), chalk.red(err));
    });
});