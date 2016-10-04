var tspReader = require('./src/tsp-reader/tsp-reader'),
    fileLivestreamer = require('./src/file-livestreamer/file-liverstreamer');
express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require("socket.io").listen(http);

app.set("ipaddr", "127.0.0.1");

app.set("port", 3000);

app.get("/", function (request, response) {
    response.sendFile(__dirname + "/public/index.html");
});

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/app', express.static(__dirname + '/public/app'));
app.use('/assets', express.static(__dirname + '/public/assets'));

http.listen(app.get("port"), app.get("ipaddr"), function () {
    console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});


var fileStreamer,
    tspreader;

io.on('connection', function (socket) {
    var clientId = socket.id;
    socket.on('startFilestream', function (fileName) {
        fileStreamer = fileLivestreamer(fileName)
            .subscribe(function (data) {
                io.to(clientId).emit('fileChanged', data);
            })
            .watch();
    });

    tspreader = tspReader()
        .subscribe(function (data) {
            io.sockets.emit("newTspData", data);
        })
        .watch();
    socket.on('disconnect', function () {
        if (fileStreamer) {
            fileStreamer.stop();
        }
        if (tspreader) {
            tspreader.stop();
        }
    });
});