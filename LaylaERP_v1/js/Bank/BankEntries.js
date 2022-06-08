$(document).ready(function () {
    EntriesBalanceForSpecificBank();
    $('#txtOrderDate, #txtOrderDate1').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        startDate: moment().startOf('year'), autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto"
    }, function (start, end, label) {
        BankEntriesList();
        FundTransferList(true);
    });
    BankEntriesList();
    setTimeout(function () { FundTransferList(true) }, 2000);//product dropdown

});
function BankEntriesList() {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let id = $("#hfid").val();
    var table_EL = $('#tbBankEntry').DataTable({
        //columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': true, 'targets': [0] }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries", infoFiltered: "",
            infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#tbBankEntry_filter input').unbind();
            $('#tbBankEntry_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        footerCallback: function (row, data, start, end, display) {
            var api = this.api(), data;
            var intVal = function (i) { return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0; };

            let DebitTotal = api.column(4).data().reduce(function (a, b) { return intVal(a) + intVal(b); }, 0);
            let CreditTotal = api.column(5).data().reduce(function (a, b) { return intVal(a) + intVal(b); }, 0);

            var footer = $(this).append('<tfoot><tr></tr></tfoot>');
            $(footer).append('<td>Page Total</th><th></th><th></th><th></th><th class=" text-right">' + CurrencyFormat(DebitTotal) + '</th><th class=" text-right">' + CurrencyFormat(CreditTotal)+ '</th><th></th>');
        },

        sAjaxSource: "/bank/bank-transactions",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: id });
            aoData.push({ name: "strValue2", value: sd });
            aoData.push({ name: "strValue3", value: ed });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                success: function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    $("#txtinitialamount").text(CurrencyFormat(data.opening_balance)); $("#txtbalance").text(CurrencyFormat(data.closing_balance)); $("#txtunclearbalance").text(CurrencyFormat(data.uncleared_balance));
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            {
                data: 'date', title: 'Date', sWidth: "15%", render: function (id, type, full, meta) {
                    return moment(id).format('MM/DD/YYYY');
                }
            },
            { data: 'doc_type', title: 'Transaction Type', sWidth: "15%" },
            { data: 'subledger_label', title: 'Name', sWidth: "15%" },
            { data: 'label_operation', title: 'Memo/Description', sWidth: "20%" },
            { data: 'debit', title: 'Debit', sWidth: "15%", class: 'text-right', render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            { data: 'credit', title: 'Credit', sWidth: "15%", class: 'text-right', render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            { data: 'balance', title: 'Balance', sWidth: "15%", class: 'text-right', render: $.fn.dataTable.render.number(',', '.', 2, '$') }
        ],
        //"dom": 'lBftipr',
        //"buttons": [
        //    {
        //        extend: 'csv',
        //        className: 'button',
        //        text: '<i class="fas fa-file-csv"></i> CSV',
        //        filename: function () {
        //            var d = new Date();
        //            var e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
        //            return 'Bank_Entries' + e;
        //        },
        //    },
        //],
    });
}


function EntriesBalanceForSpecificBank() {
    var ID = $("#hfid").val();
    var obj = { id: ID }
    $.ajax({
        url: "/Bank/BankEntriesBalanceForSpecific",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var d = JSON.parse(data);
            if (d.length > 0) {
                $("#txtentriesdebit").text('$' + parseFloat(d[0].debit).toFixed(2));
                $("#txtentriescredit").text('$' + parseFloat(d[0].credit).toFixed(2));
                //$("#txtbalance").text('$' + (d[0].balance));
            }
        },
        error: function (msg) {

        }
    });
}

PendingEntriesList();
function PendingEntriesList() {
    //var urid = $("#ddlVendor").val(); 
    var ID = $("#hfid").val();
    var table_EL = $('#PendingBankEntriesdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': true, 'targets': [0] }], order: [[0, "desc"]],
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
            $('#PendingBankEntriesdata_filter input').unbind();
            $('#PendingBankEntriesdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        footerCallback: function (row, data, start, end, display) {
            var api = this.api(), data;
            var intVal = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            var DebitTotal = api.column(7).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);

            var CreditTotal = api.column(8).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);

            $(api.column(0).footer()).html('Page Total');
            $(api.column(7).footer()).html('$' + parseFloat(DebitTotal).toFixed(2));
            $(api.column(8).footer()).html('$' + parseFloat(CreditTotal).toFixed(2));
            var footer = $(this).append('<tfoot><tr></tr></tfoot>');
            $(footer).append('<th class="text-right">Total</th>');
        },

        sAjaxSource: "/Bank/PendingBankEntriesList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            //aoData.push({ name: "strValue1", value: urid });
            aoData.push({ name: "strValue2", value: ID });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "id" : oSettings.aaSorting[0][0] == 1 ? "operation_date" : oSettings.aaSorting[0][0] == 2 ? "value_date" : oSettings.aaSorting[0][0] == 3 ? "paymenttype" : oSettings.aaSorting[0][0] == 4 ? "num_payment" : oSettings.aaSorting[0][0] == 5 ? "vendor" : oSettings.aaSorting[0][0] == 6 ? "bankaccount" : oSettings.aaSorting[0][0] == 7 ? "debit" : oSettings.aaSorting[0][0] == 8 ? "credit" : "id";
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
            { data: 'id', title: 'Ref', sWidth: "10%" },
            { data: 'operation_date', title: 'Operation Date', sWidth: "10%" },
            { data: 'value_date', title: 'Value Date', sWidth: "10%" },
            { data: 'paymenttype', title: 'Payment Type', sWidth: "10%" },
            { data: 'num_payment', title: 'Number', sWidth: "10%" },
            { data: 'vendor', title: 'Vendor Name', sWidth: "10%" },
            { data: 'bankaccount', title: 'Bank Account', sWidth: "10%" },
            { data: 'debit', title: 'Debit', sWidth: "10%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            { data: 'credit', title: 'Credit', sWidth: "10%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },

        ],
    });
}

function PendingEntriesBalance() {
    var ID = $("#hfid").val();
    var obj = { id: ID }
    $.ajax({
        url: "/Bank/PendingBankEntriesBalance",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var d = JSON.parse(data);
            if (d.length > 0) {
                $("#txtpendingentriesdebit").text('$' + (d[0].debit));
                $("#txtpendingentriescredit").text('$' + (d[0].credit));
                $("#txtpendingbalance").text('$' + (d[0].balance));
                $("#txtunclearbalance").text('$' + (d[0].balance));
            }
        },
        error: function (msg) {

        }
    });
}

function FundTransferList(is_date) {
    let sd = $('#txtOrderDate1').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate1').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';

    var ID = $("#accounting_account").val();
    var bank_id = $("#hfid").val();
    var obj = { strValue1: ID, strValue2: bank_id, strValue3: dfa };
    var table_EL = $('#FundTransferdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }, { 'visible': true, 'targets': [0] }], order: [[0, "desc"]],
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
            $('#FundTransferdata_filter input').unbind();
            $('#FundTransferdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        /*footerCallback: function (row, data, start, end, display) {
            var api = this.api(), data;
            console.log(data);
            var intVal = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            var DebitTotal = api.column(7).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);

            var CreditTotal = api.column(8).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);

            $(api.column(0).footer()).html('Page Total');
            $(api.column(7).footer()).html('$' + parseFloat(DebitTotal).toFixed(2));
            $(api.column(8).footer()).html('$' + parseFloat(CreditTotal).toFixed(2));
            console.log(DebitTotal);
            console.log(CreditTotal);
        }, */

        ajax: {
            url: '/Bank/FundTransferlist', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        aoColumns: [
            {
                'data': 'inv_num', sWidth: "10%",
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '"><label></label>';
                }
            },
            { data: 'doc_date', title: 'Date', sWidth: "10%", render: function (data, type, full) { if (type === "sort" || type === 'type') { return data; } else return full.datecreation; } },
            { data: 'inv_num', title: 'Transcation Id', sWidth: "10%" },
            { data: 'label_operation', title: 'Operation Level', sWidth: "10%" },
            { data: 'debit', title: 'Debit($)', sWidth: "10%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            { data: 'credit', title: 'Credit($)', sWidth: "10%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },

        ],
    });
}
/*
function getGrandTotalFull() {
    $.ajax({
        url: "/Accounting/GrandTotal",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        success: function (data) {

            var d = JSON.parse(data);
            if (d.length > 0) {
                $("#txtdebit").text('$' + d[0].debit);
                $("#txtcredit").text('$' + d[0].credit);
                $("#txtbalance").text('$' + d[0].balance)
            }
        },
        error: function (msg) {

        }
    });
}

function getVendor() {
    $.ajax({
        url: "/Accounting/GetVendor",
        type: "Get",
        success: function (data) {
            $('#ddlVendor').append('<option value="">Please Select Vendor</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddlVendor').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}


function getGrandTotal(is_date) {
    let urid = $("#ddlVendor").val();
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';
    let obj = { strValue1: dfa, strValue2: urid };
    $.ajax({
        url: "/Accounting/JournalDatewithVendoreTotal",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: obj,
        success: function (data) {
            var d = JSON.parse(data);
            if (d.length > 0) {
                if (parseInt(d[0].debit).toFixed(2) > 0) {
                    $("#txtdebit").text('$' + parseFloat(d[0].debit).toFixed(2)); $("#txtcredit").text('$' + parseFloat(d[0].credit).toFixed(2)); $("#txtbalance").text('$' + parseFloat(d[0].balance).toFixed(2))
                }
            }
        },
        error: function (msg) {

        }
    });
}*/

function Bankfundtransfer() {
    var id = "";
    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        id += $(this).val() + ",";
    });
    id = id.replace(/,(?=\s*$)/, '');
    var ID = $("#hfid").val();
    var invcomplete = $("#ddlaccounting").val();
    var obj = { bank: ID, inv_complete: invcomplete, inv_num: id }
    if (id == "") { swal('Alert', 'Please select fund from list', 'error'); }
    else {
        $.ajax({
            url: "/Bank/BankFundTransfer",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            success: function (data) {
                swal('Success!', data.message, 'success');
                FundTransferList(true);
                BankEntriesList();
            },
            error: function (msg) {

            }
        });
    }
}

$('#checkAll').click(function () {
    var isChecked = $(this).prop("checked");
    $('#FundTransferdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
});

function Singlecheck() {
    var isChecked = $('#CheckSingle').prop("checked");
    var isHeaderChecked = $("#checkAll").prop("checked");
    if (isChecked == false && isHeaderChecked)
        $("#checkAll").prop('checked', isChecked);
    else {
        $('#FundTransferdata tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkAll").prop('checked', isChecked);
    }
}
