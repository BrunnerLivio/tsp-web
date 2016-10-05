var TspTableModule = (function (socket, FileStreamModule) {
    var self = this,
        $tspTable,
        $tbody,
        $tr;

    $(document).ready(init);

    /**
     * @name init
     * @description
     * Binds the websocket methods and
     * set initial variable values.
     * Gets called when the document is ready
     * 
     */
    function init() {
        $tspTable = $('#tspTable');
        $tbody = $tspTable.find('tbody');
        $tr = $tbody.find('tr');

        self.sortType = true;
        self.currentProperty = 'ID';

        socket.on('newTspData', onNewTspData);
    }

    /**
     * @name onNewTspData
     * @description
     * Sets the given data as member variable and
     * sorts the data and renders it
     * 
     * @param {Object[]} data The data from the backend
     */
    function onNewTspData(data) {
        self.data = data;
        sort();
    }

    /**
     * @name sort
     * @description
     * Sorts the tsp data by the given property name 
     * and renders 
     * 
     * @param {String} property The name of the property to sort
     */
    function sort(property) {
        if (property === undefined) {
            property = self.currentProperty;
        } else {
            if (self.currentProperty === property) {
                self.sortType = !self.sortType;
            } else {
                self.currentProperty = property;
                self.sortType = true;
            }
        }

        self.data.sort(function (a, b) {
            var reA = /[^a-zA-Z]/g;
            var reN = /[^0-9]/g;
            var aA = a[property].replace(reA, '');
            var bA = b[property].replace(reA, '');
            var returnVal;
            if (aA === bA) {
                var aN = parseInt(a[property].replace(reN, ''), 10);
                var bN = parseInt(b[property].replace(reN, ''), 10);
                returnVal = aN === bN ? 0 : aN > bN ? 1 : -1;
            } else {
                returnVal = a[property] > b[property] ? 1 : -1;
            }

            if (self.sortType) {
                return returnVal === -1 ? 1 : -1;
            } else {
                return returnVal;
            }
        });
        render();
    }

    /**
     * @name getHTMLByRow
     * @description
     * Generates the html by the given row
     * 
     * @param {Object} row The row object from the backend
     * 
     * @returns {String} The generated html
     */
    function getHTMLByRow(row) {
        var html = '';
        html += '<tr>';
        html += '<td>' + row.ID + '</td>';
        html += '<td>' + row.Command + '</td>';
        html += '<td>' + row.ELevel + '</td>';
        if (row.Output !== "(file)") {
            html += '<td><a onclick="FileStreamModule.openDialog(\'' + row.Output + '\')" href="#">' + row.Output + '</a></td>';
        } else {
            html += '<td>' + row.Output + '</td>';
        }
        html += '<td class="state-' + row.State.toLowerCase() + '">' + row.State + '</td>';
        html += '<td>' + row.Times + '</td>';
        html += '<td><i class="material-icons md-36 remove-task hint--bottom" aria-label="Remove Task" onclick="TspTableModule.removeTask(' + row.ID + ', event)">delete</i></td>';
        return html;

    }

    /**
     * @name render
     * @description
     * Renders the tsp table rows.
     */
    function render() {
        $('#tspTable tbody tr').remove();
        self.data.forEach(function (row) {
            $tbody.append(getHTMLByRow(row));
        });
    }

    var isMakingRequest = false;

    /**
     * @name removeTask
     * @description
     * Removes the specific task with the given id and 
     * removes the parent <tr> Element of the given 
     * event argument target 
     * 
     * @param {Number} taskId The task to delete
     * @param {Evenet} event Event arguments
     */
    function removeTask(taskId, event) {
        if (!isMakingRequest && confirm("Do you really want to remove this task?")) {
            isMakingRequest = true;
            $.ajax({
                url: '/task/' + taskId,
                type: 'DELETE',
                success: function () {
                    $(event.target).parent('tr').remove();
                    isMakingRequest = false;
                }
            });
        }
    }

    /**
     * @name killAllTasks
     * @description
     * Kills all tasks by sending a DELETE-request to the backend api
     */
    function killAllTasks() {
        if (!isMakingRequest && confirm("Do you really want to kill all tasks?")) {
            isMakingRequest = true;
            $.ajax({
                url: '/kill-all-tasks',
                type: 'DELETE',
                success: function () {
                    isMakingRequest = false;
                }
            });
        }
    }

    return {
        sort: sort,
        render: render,
        removeTask: removeTask,
        killAllTasks: killAllTasks
    };
})(Socket, FileStreamModule);