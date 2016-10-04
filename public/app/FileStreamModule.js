var FileStreamModule = (function (socket) {
    var self = this,
        $fileStreamDialog,
        $fileStreamDialogShadow,
        $content;

    $(document).ready(init);

    function init() {
        $fileStreamDialog = $('#fileStreamDialog');
        $fileStreamDialogShadow = $('#fileStreamDialogShadow');
        $content = $fileStreamDialog.find('.content');
        $fileStreamDialogShadow.click(function () {
            $fileStreamDialog.fadeOut();
            $fileStreamDialogShadow.fadeOut();
        });
    }

    function openDialog(fileName) {
        socket.emit('startFilestream', fileName);
        socket.on('fileChanged', onFileChanged);
        $fileStreamDialog.fadeIn();
        $fileStreamDialogShadow.fadeIn();

    }

    function onFileChanged(content) {
        $content.html(content.replace(/\n/g, '<br/>'));
    }

    return {
        openDialog: openDialog
    };
})(Socket);