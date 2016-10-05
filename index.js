var tsp = require('./src/tsp'),
    fileLivestreamer = require('./src/file-livestreamer/file-liverstreamer'),
    express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require("socket.io").listen(http);

app.set("ipaddr", "127.0.0.1");

app.set("port", 3000);

app.get("/", function (request, response) {
    response.sendFile(__dirname + "/public/index.html");
});

app.delete('/task/:id', function (request, response) {
    tsp.task.remove(request.params.id);
    response.status(200).end();
});

app.delete('/kill-all-tasks', function(request, response){
    tsp.task.killAll();
    response.status(200).end();
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

    tspreader = tsp.reader()
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