$(document).ready(function () {
    $('#txtOrderDate').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        startDate: moment().subtract(1, 'month'), autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto"
    }, function (start, end, label) {
        $("#txtdebit").text(''); $("#txtcredit").text(''); $("#txtbalance").text('');
        AccountBalanceList(true);
        GrandToatl(true);
    });
    getChartofaccount();
    $(".select2").select2();
    AccountBalanceList(true);
    GrandToatl(true);
    $("#ddlVendor").change(function () { $("#txtdebit").text(''); $("#txtcredit").text(''); $("#txtbalance").text(''); AccountBalanceList(true); GrandToatl(true); });
    $("#ddlAccount").change(function () { $("#txtdebit").text(''); $("#txtcredit").text(''); $("#txtbalance").text(''); AccountBalanceList(true); GrandToatl(true); });
    //$("#btnSearch").click(function () {
    //    $("#ddlAccount").val("").trigger('change');
    //    AccountBalanceList(true);
    //});
})


function AccountBalanceList(is_date) {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';
    var vendor = $("#ddlVendor").val();
    let account_num = $("#ddlAccount").val();
    var myvar = []; var print = [];
    if (account_num == "") { print = [3,4,5,6]; myvar = [{ "orderable": true, "targets": 1 }, { 'visible': false, 'targets': [0, 1, 2, 3] }] }
    else { print = [1,2,4,5]; myvar = [{ "orderable": true, "targets": 1 }, { 'visible': false, 'targets': [0, 4, 7] }] }

    var obj = { strValue1: vendor, strValue2: dfa, strValue3: account_num };
    var numberRenderer = $.fn.dataTable.render.number(',', '.', 2,).display;
    var table_EL = $('#EmployeeListdata').DataTable({
        //columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': false, 'targets': [0] }], order: [[0, "desc"]],
        columnDefs: myvar, order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: false, bAutoWidth: false, searching: true,
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
            { data: 'datesort', title: 'Date', sWidth: "5%", class: "text-left", render: function (inv_num, type, full, meta) { return full.docdate; } },
            { data: 'subledger_label', title: 'Label', sWidth: "15%", class: "text-left" },
            { data: 'label_operation', title: 'Label Operation', sWidth: "15%", class: "text-left" },
            { data: 'account', title: 'Accounting Account', sWidth: "5%", class: "text-left text-bold" },
            { data: 'debit', title: 'Debit ($)', sWidth: "10%", render: $.fn.dataTable.render.number(',', '.', 2, ''), class: "text-right" },
            { data: 'credit', title: 'Credit ($)', sWidth: "10%", render: $.fn.dataTable.render.number(',', '.', 2, ''), class: "text-right" },
            { data: 'balance', title: 'Balance ($)', sWidth: "10%", render: $.fn.dataTable.render.number(',', '.', 2, ''), class: "text-right" },
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
                    columns: print,
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

function GrandToatl(is_date) {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';
    let account_num = $("#ddlAccount").val();
    let obj = { strValue1: dfa, strValue2: account_num };
    $.ajax({
        url: "/Accounting/AccountBalanceGrandTotal",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: obj,
        success: function (data) {
            var d = JSON.parse(data);
            if (account_num != "") { /*$("#txtbalance").hide();*/ }
            else { $("#txtbalance").show(); }
            if (d.length > 0) {
                $("#txtdebit").text('$' + (d[0].debit));
                $("#txtcredit").text('$' + (d[0].credit));
                $("#txtbalance").text('$' + (d[0].balance));
            }
        },
        error: function (msg) {

        }
    });
}

function getChartofaccount() {
    $.ajax({
        url: "/Accounting/ChartofAccountsdropdown",
        type: "Get",
        success: function (data) {
            $('#ddlAccount').append('<option value="">Please select account</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddlAccount').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}
