﻿$(document).ready(function () {
    EventGrid();
    $('#btnSearch').click(function () {
        EventGrid();
    });
})

function EventGrid() {
    var urid = $("#ddlSearchStatus").val();
    ID = $("#hfid").val();
    var table_EL = $('#EmployeeListdata').DataTable({
        //columnDefs: [{ "orderable": true, "targets": 0 }, { "orderable": false, "targets": [0] }, { 'visible': false, 'targets': [0] }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#EmployeeListdata_filter input').unbind();
            $('#EmployeeListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Events/GetEventsList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "id" : oSettings.aaSorting[0][0] == 1 ? "event_label" : oSettings.aaSorting[0][0] == 2 ? "startdate" : oSettings.aaSorting[0][0] == 3 ? "enddate" : oSettings.aaSorting[0][0] == 4 ? "task" : oSettings.aaSorting[0][0] == 5 ? "assigned_user" : oSettings.aaSorting[0][0] == 6 ? "name" :"id";
                aoData.push({ name: "sSortColName", value: col });
            }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            //{ data: 'id', title: 'ID', sWidth: "5%" },
            { data: 'startdate', title: 'Start Date', sWidth: "10%" },
            { data: 'enddate', title: 'End Date', sWidth: "10%" },
            { data: 'assigned_user', title: 'Assigned To', sWidth: "10%" },
            { data: 'task', title: 'Task', sWidth: "15%" },            
            { data: 'description', title: 'Description', sWidth: "20%" },
            { data: 'status', title: 'Status', sWidth: "7%" },
            {
                'data': 'id', sWidth: "7%",
                'render': function (id, type, full, meta) {
                    return '<span title="Click here to edit details" data-placement="bottom" data-toggle="tooltip"><a href="../Events/AddNewEvents/' + id + '" onclick="ActivityLog();"><i class="glyphicon glyphicon-pencil"></i></a></span>';
                   
                }
            }

        ]
    });
}
