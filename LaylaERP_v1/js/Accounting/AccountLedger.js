$(document).ready(function () {
    $("#loader").hide();
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
        $("#totaldebit").text(''); $("#totalcredival").text(''); $("#totalbalval").text('')
        AccountDataList(true);
        getGrandTotal(true);
    });
    getVendor();
    $(".select2").select2();
    AccountDataList(true);
    getGrandTotal(true);
    // Add event listener for opening and closing details 
    $('#dtdataList tbody').on('click', '.pdetails-control', function () {
        // console.log('svvvd');
        var tr = $(this).closest('tr');
        var row = $('#dtdataList').DataTable().row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            tr.find('.pdetails-control').empty().append('<i class="glyphicon glyphicon-plus-sign"></i>');
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            tr.find('.pdetails-control').empty().append('<i class="glyphicon glyphicon-minus-sign"></i>');
            row.child(formatPartially(row.data())).show();
            tr.addClass('shown');

        }
    });
    $('#ddlVendor').change(function () {
        $("#totaldebit").text(''); $("#totalcredival").text(''); $("#totalbalval").text('')
        $("#loader").show();
        AccountDataList(true);
        getGrandTotal(true);
        $("#loader").hide();
    });
});
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
function AccountDataList(is_date) {
    // console.log(obj);
    let urid = $("#ddlVendor").val();
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';

    let obj = { strValue1: dfa, strValue2: urid };
    // console.log(obj);
    $('#dtdataList').DataTable({
        oSearch: { "sSearch": '' }, bAutoWidth: false, scrollX: false,
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        destroy: true, ajax: {
            url: '/Accounting/GetAccountLedgerDetailsList', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
        columns: [
            { data: 'row_num', title: '#', sWidth: "0.1%" },
            {
                data: 'rowid', title: 'Account Name', sWidth: "88%", render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    return '<a href="javascript:void(0);" class="pdetails-control" data-toggle="tooltip" title="Click here to show details."><i class="glyphicon glyphicon-plus-sign"></i></a> -  #<b>' + row.Acctext + '</b>';

                }
            },
            {
                data: 'debit', title: 'Debit', sWidth: "8%", class: 'text-bold', render: function (data, type, row) {
                    var tprice = 'toFormat';
                    if (data.toString() == "0.00")
                        tprice = "";
                    else
                        tprice = '$' + data;
                    return tprice
                }
            },
            {
                data: 'credit', title: 'Credit', sWidth: "5%", class: 'text-bold', render: function (data, type, row) {
                    var tprice = 'toFormat';
                    if (data.toString() == "0.00")
                        tprice = "";
                    else
                        tprice = '$' + data;
                    return tprice
                }
            }
        ],
        columnDefs: [{ targets: [0], searchable: false }]
    });
}
/* Formatting function for row details - modify as you need */
function formatPartially(d) {
    // console.log(d);
    let is_date = true;
    let urid = $("#ddlVendor").val();
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';

    let option = { strValue1: d.rowid, strValue2: urid, strValue3: dfa }, wrHTML = '<table id="table1_' + d.rowid + '" class="inventory-table table-blue table check-table table-bordered table-striped dataTable no-footer"><thead><tr><th style="width:10%; text-align:left;">Transaction ID</th><th style="width:5%; text-align:left;">Journal</th><th style="width:10%; text-align:left;">Date</th><th style="width:10%; text-align:left;">Accounting Doc</th><th style="width:46%; text-align:left;">Label</th><th style="width:10%; text-align:right;"></th><th style="width:10%; text-align:right;"></th></tr></thead>';
    $.ajax({
        url: '/Accounting/GetDetailsLedger', type: 'post', dataType: 'json', contentType: "application/json; charset=utf-8", data: JSON.stringify(option),
        success: function (result) {
            result = JSON.parse(result);
            let Totaldebit = 0;
            let Totalcredit = '';
            let Totalbaolance = '';
            let account = 0;
            let datect = '';
            if (result.length == 0) { wrHTML += '<tbody class="line_items_' + d.rowid + '"><tr><td valign="top" colspan="6" class="no-data-available">Sorry no matching records found.</td></tr></tbody>'; }
            $(result).each(function (index, row) {
                Totaldebit = row.totalDebit; Totalcredit = row.totalcredit; Totalbaolance = row.totalbal; account = row.inv_complete;
                datect = row.datecrt;
                wrHTML += '<tr class="paid_item"><td style="width:10%; text-align:left;">' + row.inv_num + '</td>';
                wrHTML += '<td style="width:5%; text-align:left;">' + row.code_journal + '</td>';
                wrHTML += '<td style="width:10%; text-align:left;">' + row.doc_date + '</td>';
                if (row.code_journal == "AC")
                    wrHTML += '<td style="width:10%; text-align:left;"><span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getPurchaseOrderPrint(' + row.inv_num + ', false);"><i class="fas fa - search - plus"></i>' + row.PO_SO_ref + '</a></span></td>';
                else
                    wrHTML += '<td style="width:10%; text-align:left;"> <a href="#"  onclick="PurchaseSalesPrint(' + row.inv_num + ',\'' + datect + '\');"><i class="fas fa - search - plus"></i>' + row.PO_SO_ref + '</a></td>';
                //console.log(row.datecrt);
                wrHTML += '<td style="width:46%; text-align:left;">' + row.label_operation + '</td>';
                if (row.debit != '')
                    wrHTML += '<td id="artist_' + row.inv_num + '" style="width:5%; text-align:right;" class="text-right debit-amount">' + '$' + row.debit + '</td>';
                else
                    wrHTML += '<td style="width:10%; text-align:right;">' + '' + '</td>';
                if (row.credit != '')
                    wrHTML += '<td id="artist_' + row.inv_num + '" style="width:5%; text-align:right;" class="text-right credit-amount">' + '$' + row.credit + '</td></tr > ';
                else
                    wrHTML += '<td style="width:10%; text-align:right;">' + '' + '</td></tr > ';
            });
            wrHTML += '<tfoot><tr><td colspan="5" style="width:10%; text-align:right;"><b> Total accounting account ' + account + ' : </<b></td>';
            wrHTML += '<td style="width:5%; text-align:right;"><strong><span id="Totaldebit">$' + Totaldebit + '</span></strong></td>';
            wrHTML += '<td style="width:5%; text-align:right;"><strong><span id="Totalcredit">$' + Totalcredit + '</span></strong></td></tr>';
            wrHTML += '<tr><td colspan="5" style="width:10%; text-align:right;"><b> Balance : </<b></td>';
            wrHTML += '<td style="width:5%; text-align:right;"><strong><span id="Totalbailance">$' + Totalbaolance + '</span></strong></td>';
            wrHTML += '<td style="width:5%; text-align:right;"></td></tr></tfoot>';
        },
        error: function (xhr, status, err) { alert(err); },
        complete: function () { }, async: false
    });
    wrHTML += '</table>';
    return wrHTML;
}
function getGrandTotal(is_date) {
    let urid = $("#ddlVendor").val();
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';
    let obj = { strValue1: dfa, strValue2: urid };
    $.ajax({
        url: "/Accounting/DatewithVendoreTotal",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: obj,
        success: function (data) {
            var d = JSON.parse(data);
            if (d.length > 0) {
                if (parseInt(d[0].debit).toFixed(2) > 0) {
                    $("#totaldebit").text('$' + d[0].debit); $("#totalcredival").text('$' + d[0].credit); $("#totalbalval").text('$' + d[0].balance)
                }
            }
        },
        error: function (msg) {

        }
    });
}