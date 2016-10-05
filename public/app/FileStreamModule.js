"use strict";

var FileStreamModule = (function (socket) {
    var self = {},
        $fileStreamDialog,
        $fileStreamDialogShadow,
        $content;

    $(document).ready(init);

    /**
     * @name init
     * @description
     * Initializes variables values. Gets called when the document ist ready.
     *  
     */
    function init() {
        $fileStreamDialog = $('#fileStreamDialog');
        $fileStreamDialogShadow = $('#fileStreamDialogShadow');
        $content = $fileStreamDialog.find('.content');
        $fileStreamDialogShadow.click(function () {
            $fileStreamDialog.fadeOut();
            $fileStreamDialogShadow.fadeOut();
        });
    }

    /**
     * @name openDialog
     * @description
     * Opens a dialog and starts listening to file change events
     * 
     * @param {String} fileName The name of the file to stream to-
     */
    function openDialog(fileName) {
        socket.emit('startFilestream', fileName);
        socket.on('fileChanged', onFileChanged);
        $fileStreamDialog.fadeIn();
        $fileStreamDialogShadow.fadeIn();

    }

    /**
     * @name onFileChanged
     * @description
     * Updates the html, when the file gets updated.
     * Gets called when the websocket server responds.
     * 
     * @param {String} content The content of the file
     */
    function onFileChanged(content) {
        $content.html(content.replace(/\n/g, '<br/>'));
    }

    return {
        openDialog: openDialog
    };
})(Socket);