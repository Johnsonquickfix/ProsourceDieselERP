﻿$(document).ready(function () {
    ChartofaccountGrid();
    getGrandTotal();

    function newexportaction(e, dt, button, config) {
        var self = this;
        var oldStart = dt.settings()[0]._iDisplayStart;
        dt.one('preXhr', function (e, s, data) {
            // Just this once, load all data from the server...
            data.start = 0;
            data.length = 2147483647;
            dt.one('preDraw', function (e, settings) {
                // Call the original action function
                if (button[0].className.indexOf('buttons-copy') >= 0) {
                    $.fn.dataTable.ext.buttons.copyHtml5.action.call(self, e, dt, button, config);
                } else if (button[0].className.indexOf('buttons-excel') >= 0) {
                    $.fn.dataTable.ext.buttons.excelHtml5.available(dt, config) ?
                        $.fn.dataTable.ext.buttons.excelHtml5.action.call(self, e, dt, button, config) :
                        $.fn.dataTable.ext.buttons.excelFlash.action.call(self, e, dt, button, config);
                } else if (button[0].className.indexOf('buttons-csv') >= 0) {
                    $.fn.dataTable.ext.buttons.csvHtml5.available(dt, config) ?
                        $.fn.dataTable.ext.buttons.csvHtml5.action.call(self, e, dt, button, config) :
                        $.fn.dataTable.ext.buttons.csvFlash.action.call(self, e, dt, button, config);
                } else if (button[0].className.indexOf('buttons-pdf') >= 0) {
                    $.fn.dataTable.ext.buttons.pdfHtml5.available(dt, config) ?
                        $.fn.dataTable.ext.buttons.pdfHtml5.action.call(self, e, dt, button, config) :
                        $.fn.dataTable.ext.buttons.pdfFlash.action.call(self, e, dt, button, config);
                } else if (button[0].className.indexOf('buttons-print') >= 0) {
                    $.fn.dataTable.ext.buttons.print.action(e, dt, button, config);
                }
                dt.one('preXhr', function (e, s, data) {
                    // DataTables thinks the first item displayed is index 0, but we're not drawing that.
                    // Set the property to what it was before exporting.
                    settings._iDisplayStart = oldStart;
                    data.start = oldStart;
                });
                // Reload the grid with the original page. Otherwise, API functions like table.cell(this) don't work properly.
                setTimeout(dt.ajax.reload, 0);
                // Prevent rendering of the full data to the DOM
                return false;
            });
        });
        // Requery the server with the new one-time export settings
        dt.ajax.reload();
    }
})

function ChartofaccountGrid() {
    var urid = $("#ddlSearchStatus").val();
    ID = $("#hfid").val();
    var numberRenderer = $.fn.dataTable.render.number(',', '.', 2,).display;
    var table_EL = $('#EmployeeListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }, { 'visible': false, 'targets': [0] }], order: [[0, "desc"]],
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
        footerCallback: function (row, data, start, end, display) {
            var api = this.api(), data;
            console.log(data);
            var intVal = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };
            var balance = api.column(4).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);

            var bankbalance = api.column(5).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);
            $(api.column(3).footer()).html('Page total');
            $(api.column(4).footer()).html('$' + numberRenderer(balance));
            $(api.column(5).footer()).html('$' + numberRenderer(bankbalance));
        },
        sAjaxSource: "/Accounting/GetEventsList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            //var col = 'id';
            //if (oSettings.aaSorting.length >= 0) {
            //    var col = oSettings.aaSorting[0][0] == 0 ? "id" : oSettings.aaSorting[0][0] == 1 ? "event_label" : oSettings.aaSorting[0][0] == 2 ? "startdate" : oSettings.aaSorting[0][0] == 3 ? "enddate" : oSettings.aaSorting[0][0] == 4 ? "task" : oSettings.aaSorting[0][0] == 5 ? "assigned_user" : oSettings.aaSorting[0][0] == 6 ? "name" : "id";
            //    aoData.push({ name: "sSortColName", value: col });
            //}
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            { data: 'id', title: 'ID', sWidth: "5%" },
            { data: 'name', title: 'Name', sWidth: "10%", class: 'text-left' },
            { data: 'type', title: 'Type', sWidth: "10%" },
            { data: 'detailtype', title: 'Detail Type', sWidth: "10%" },
            { data: 'balance', title: 'Balance', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'bank_balance', title: 'Bank Balance', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            {
                data: 'datesort', title: 'Date', sWidth: "10%", render: function (id, type, full, meta) { return full.entrydate; }
            },
            {
                'data': 'id', sWidth: "10%",
                'render': function (id, type, full, meta) {
                    return '<span title="Click here to edit details" data-placement="bottom" data-toggle="tooltip"><a href="../Accounting/EditChartAccountEntry/' + id + '" onclick="ActivityLog();"><i class="glyphicon glyphicon-pencil"></i></a></span>';

                }
            }
        ],
        "dom": 'lBftipr',
        "buttons": [
            {
                extend: 'csv',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> CSV',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6],
                },
                filename: function () {
                    var d = new Date();
                    var e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Chart_of_account_entry' + e;
                },
            },
            {
                extend: 'print',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> Print',
                footer: true,
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6],                    
                },
                filename: function () {
                    var d = new Date();
                    var e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Chart_of_account_entry' + e;
                },
            }
        ],
    });
}

function getGrandTotal() {
    $.ajax({
        url: "/Accounting/GetCharofaccountentrygrandtotal",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        success: function (data) {
            var d = JSON.parse(data);
            if (d.length > 0) {
                $("#txtbalance").text('$' + d[0].balance)
                $("#txtbankbalance").text('$' + d[0].bank_balance)
            }
        },
        error: function (msg) {

        }
    });
}