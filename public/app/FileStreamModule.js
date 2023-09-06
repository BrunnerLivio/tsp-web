"use strict";

var FileStreamModule = (function (socket) {
    var self = {},
        $fileStreamDialog,
        $fileStreamDialogShadow,
        $content,
        $close;

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
        $close = $fileStreamDialog.find('.dialog-close');

        $fileStreamDialogShadow.click(() => closeDialog());
        $close.click(() => closeDialog());
        $(document).keydown((e) => {
            const code = e.keyCode || e.which;
            // Press escape
            if (code === 27) {
                closeDialog();
            }
        });
    }

    /**
     * @name closeDialog
     * @description
     * Closes the dialog and clears its content
     */
    function closeDialog() {
        $fileStreamDialog.fadeOut();
        $fileStreamDialogShadow.fadeOut(function () {
            $content.html('');
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
        const scrollPosition = $content.scrollTop() + $content.innerHeight();
        if (scrollPosition >= $content.get(0).scrollHeight - 100) {
            scrollToBottom();
        }
    }

    function scrollToBottom() {
        $content.animate({
            scrollTop: $content.get(0).scrollHeight
        }, 1500);
    }

    return {
        openDialog: openDialog
    };
})(Socket);