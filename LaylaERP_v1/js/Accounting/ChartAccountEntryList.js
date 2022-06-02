$(document).ready(function () {
    ChartofaccountGrid();
    getGrandTotal();
})

function ChartofaccountGrid() {
    var urid = $("#ddlSearchStatus").val();
    ID = $("#hfid").val();
    let obj = { strValue1: ID };// console.log(obj);
    var numberRenderer = $.fn.dataTable.render.number(',', '.', 2,).display;
    var table_EL = $('#EmployeeListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }, { 'visible': false, 'targets': [0] }], order: [[0, "asc"]],
        destroy: true, bProcessing: true, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[20, 50], [20, 50]],
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
            var balance = api.column(4, { page: 'current' } ).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);

            var bankbalance = api.column(5, { page: 'current' } ).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);
            $(api.column(3).footer()).html('Page total');
            $(api.column(4).footer()).html('$' + numberRenderer(balance));
            $(api.column(5).footer()).html('$' + numberRenderer(bankbalance));
        },
        ajax: {
            url: '/Accounting/GetChartAccountEntryList', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { console.log(JSON.parse(data)); return JSON.parse(data); }
        },
        columns: [
            { data: 'id', title: 'ID', sWidth: "5%", render: function (id, type, full, meta) { return full.account_number; } },
            { data: 'name', title: 'Name', sWidth: "15%", class: 'text-left' },
            { data: 'type', title: 'Type', sWidth: "10%" },
            { data: 'detailtype', title: 'Detail Type', sWidth: "10%" },
            { data: 'debit', title: 'Debit ($)', sWidth: "10%", class: 'text-right', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'credit', title: 'Credit ($)', sWidth: "10%", class: 'text-right', render: $.fn.dataTable.render.number(',', '.', 2, '') },
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
                    columns: [1, 2, 3, 4, 5],
                },
                filename: function () {
                    var d = new Date();
                    var e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Chart_of_account_entry' + e;
                },
            },
            {
                extend: 'print',
                //title: '<h3 style="text-align:center">Layla Sleep Inc.</h3><br /><h3 style="text-align:left">Chart of accounts</h3>',
                title:'',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> Print',
                footer: false,
                exportOptions: {
                    columns: [1, 2, 3, 4, 5],                    
                },
                filename: function () {
                    var d = new Date();
                    var e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Chart_of_account_entry' + e;
                },
                messageTop: function () {
                    return '<h3 style = "text-align:center"> Layla Sleep Inc.</h3 ><br /><h3 style="text-align:left">Chart of accounts</h3>'; 
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
                $("#txtbalance").text('$' + d[0].debit)
                $("#txtbankbalance").text('$' + d[0].credit)
            }
        },
        error: function (msg) {

        }
    });
}
