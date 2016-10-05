var fileLivestreamer = require('../../core/file-livestreamer/file-liverstreamer');

module.exports = function (socket, io) {

    var clientId = socket.id,
        fileStreamer;
        
    socket.on('startFilestream', function (fileName) {
        fileStreamer = fileLivestreamer(fileName)
            .subscribe(function (data) {
                io.to(clientId).emit('fileChanged', data);
            })
            .watch();
    });

    socket.on('disconnect', function () {
        if (fileStreamer) {
            fileStreamer.stop();
        }
    });
};