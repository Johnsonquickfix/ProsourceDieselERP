﻿function AccountBalanceList() {
    var urid = $("#ddlSearchStatus").val();
    var ID = $("#hfid").val();
    var obj = { id: ID };
    var table_EL = $('#EmployeeListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': false, 'targets': [0] }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: false, bAutoWidth: false, searching: true,
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
        /*sAjaxSource: "/Accounting/GetBalanceList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "id" : oSettings.aaSorting[0][0] == 1 ? "account" : oSettings.aaSorting[0][0] == 2 ? "debit" : oSettings.aaSorting[0][0] == 3 ? "credit" : oSettings.aaSorting[0][0] == 4 ? "balance" : "id";
                aoData.push({ name: "sSortColName", value: col });
            }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },*/
        ajax: {
            url: '/Accounting/AccountBalanceList', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { console.log(JSON.parse(data)); return JSON.parse(data); }
        },
        aoColumns: [
            { data: 'id', title: 'ID', sWidth: "5%" },
            { data: 'account', title: 'Accounting Account', sWidth: "5%", class:"text-left" },
            { data: 'debit', title: 'Debit ($)', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, ''), class: "text-right" },
            { data: 'credit', title: 'Credit ($)', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, ''), class: "text-right" },
            { data: 'balance', title: 'Balance ($)', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, ''), class: "text-right" },
        ],

        "dom": 'lBftipr',
        "buttons": [
            {
                extend: 'csv',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> CSV',
                filename: function () {
                    var d = new Date();
                    var e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Account_Balance_List' + e;
                },
            },
            {
                extend: 'print',
                //title: '<h3 style="text-align:center">Layla Sleep Inc.</h3><br /><h3 style="text-align:left">Chart of accounts</h3>',
                title: '',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> Print',
                footer: false,
                exportOptions: {
                    columns: [1, 2, 3, 4, 5],
                },
                filename: function () {
                    var d = new Date();
                    var e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Account_balance' + e;
                },
                messageTop: function () {
                    return '<h3 style = "text-align:center"> Layla Sleep Inc.</h3 ><br /><h3 style="text-align:left">Account Balance</h3>';
                },
            }
        ],
    });
}

GrandToatl();
function GrandToatl(){
    $.ajax({
        url: "/Accounting/AccountBalanceGrandTotal",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        success: function (data) {
            var d = JSON.parse(data);
            if (d.length > 0) {
                $("#txtdebit").text('$' + parseFloat(d[0].debit).toFixed(2));
                $("#txtcredit").text('$' + parseFloat(d[0].credit).toFixed(2));
                $("#txtbalance").text('$' + parseFloat(d[0].balance).toFixed(2));
            }
        },
        error: function (msg) {

        }
    });
}
