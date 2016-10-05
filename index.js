var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require("socket.io").listen(http);

app.set("ipaddr", "127.0.0.1");

app.set("port", 3000);

// === Public Static Routes ===

app.get("/", function (request, response) {
    response.sendFile(__dirname + "/public/index.html");
});

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/app', express.static(__dirname + '/public/app'));
app.use('/assets', express.static(__dirname + '/public/assets'));

// === HTTP Controllers ===
require('./src/api/controllers/task')(app);


http.listen(app.get("port"), app.get("ipaddr"), function () {
    console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});

io.on('connection', function (socket) {
    // === Websocket Controllers ===
    require('./src/api/controllers/filestream')(socket, io);
    require('./src/api/controllers/tsp')(socket, io);
});