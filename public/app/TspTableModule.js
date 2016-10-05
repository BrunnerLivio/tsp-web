var TspTableModule = (function (socket) {
    var self = this,
        $tspTable,
        $tbody,
        $tr;

    $(document).ready(init);

    function init() {
        $tspTable = $('#tspTable');
        $tbody = $tspTable.find('tbody');
        $tr = $tbody.find('tr');

        self.sortType = true;
        self.currentProperty = 'ID';

        socket.on('newTspData', onNewTspData);
    }

    function onNewTspData(data) {
        self.data = data;
        sort();
    }

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

    function render() {
        $('#tspTable tbody tr').remove();
        self.data.forEach(function (row) {
            $tbody.append(getHTMLByRow(row));
        });
    }
    var isMakingRequest = false;

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


    return {
        sort: sort,
        render: render,
        removeTask: removeTask
    };
})(Socket, FileStreamModule);