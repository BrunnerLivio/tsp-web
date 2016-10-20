"use strict";

var ErrorHandlerModule = (function (socket) {
    var self = {};

    $(document).ready(init);

    /**
     * @name init
     * @description
     * Initializes variables values. Gets called when the document ist ready.
     *  
     */
    function init() {
        socket.on('error', errorHandler);
    }

    function errorHandler(data) {
        console.log(data);
        toastr.error(data.message, '', {
            closeButton: true,
            timeOut: 10000
        });

    }

})(Socket);