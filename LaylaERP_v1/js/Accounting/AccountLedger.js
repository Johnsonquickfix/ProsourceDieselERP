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
    var numberRenderer = $.fn.dataTable.render.number(',', '.', 2,).display;
    let obj = { strValue1: dfa, strValue2: urid };
    // console.log(obj);
    var table = $('#dtdataList').DataTable({
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
        lengthMenu: [[20, 50, 100], [20, 50, 100]],
        footerCallback: function (row, data, start, end, display) {
            var api = this.api(), data;

           // console.log(data);
            var intVal = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            var sales = api.column(2).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);

            var forecastales = api.column(3).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);
          //  bailance = forecastales - sales;
            $(api.column(1).footer()).html('Grand total');
            $(api.column(2).footer()).html(numberRenderer(sales));
            $(api.column(3).footer()).html(numberRenderer(forecastales));
            //  $(api.column(3).footer()).html('Balance $' + numberRenderer(bailance));
        },
        columns: [
            { data: 'row_num', title: '#', sWidth: "0.1%" },
            {
                data: 'rowid', title: 'Account Name', sWidth: "89.9%", className: 'text-left', render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    return '<a href="javascript:void(0);" class="pdetails-control" data-toggle="tooltip" title="Click here to show details."><i class="glyphicon glyphicon-plus-sign"></i></a> -  #<b>' + row.Acctext + '</b>';

                }
            },
            {
                data: 'debit', sWidth: "5%", class: 'text-right', render: function (data, type, row) {
                    var tprice = 'toFormat';
                    if (data.toString() == "0.00")
                        tprice = "";
                    else
                        tprice =   numberRenderer(data);
                    return tprice
                }
            },
           // { data: 'debit', sWidth: "8%", className: 'text-bold', render: $.fn.dataTable.render.number(',', '.', 2,).display },
            {
                data: 'credit', sWidth: "5%", class: 'text-right', render: function (data, type, row) {
                    var tprice = 'toFormat';
                    if (data.toString() == "0.00")
                        tprice = "";
                    else
                        tprice = numberRenderer(data);
                    return tprice
                }
            }
        ],
        columnDefs: [{ targets: [0], searchable: false }],
        dom: 'lBftipr',
        "buttons": [
            {
                extend: 'csv',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> CSV',
                exportOptions: {
                    columns: [1, 2, 3],
                },
                filename: function () {
                    var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
                    return 'Ledger for' + from;
                },
            },
            //{
            //    extend: 'excel',
            //    className: 'button',
            //    text: '<i class="fas fa-file-csv"></i> Excel',
            //    exportOptions: {
            //        columns: [1, 2, 3],
            //    },
            //    footer: true,
            //    filename: function () {
            //        var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
            //        return 'ProfitLoss for' + from;
            //    },
            //},
            {
                extend: 'print',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> Print',
                footer: true,
                exportOptions: {
                    columns: [0,1, 2, 3],
                },
                filename: function () {
                    var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
                    return 'Ledger for' + from;
                },
            },
            {
                extend: 'pdfHtml5',
                footer: true,
                exportOptions: {
                    columns: [1, 2, 3],
                    
                },
                customize: function (doc) {
                    //doc.defaultStyle.alignment = 'right';
                    doc.styles.tableHeader.alignment = 'right';
                    // doc.styles.tableHeader[2].alignment = 'right';
                    // doc.content[1].alignment = ['left', 'right', 'right'];

                    doc.content[0].text = "Layla Sleep Inc - Ledger";
                    doc.content[0].text.alignment = 'left';

                    var rowCountd = table.rows().count() + 1;
                    for (i = 0; i < rowCountd; i++) {
                        doc.content[1].table.body[i][0].alignment = 'left';
                    };

                    var rowCount = doc.content[1].table.body.length;
                    for (i = 1; i < rowCount; i++) {
                        doc.content[1].table.body[i][2].alignment = 'right';
                        doc.content[1].table.body[i][1].alignment = 'right';

                    }
                 

                   // doc.styles.tableHeader.alignment = ['left', 'right', 'right'];
                    doc.content[1].table.widths =
                        Array(doc.content[1].table.body[0].length + 1).join('*').split('');

                    doc.content[1].table.widths = ['50%', '25%', '25%'];
                  

                },

                filename: function () {
                    var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
                    return 'Ledger for' + from;
                },
            }
        ],
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
    var numberRenderer = $.fn.dataTable.render.number(',', '.', 2,).display;
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
                //console.log(row.PO_SO_ref.substring(0, 2));
                Totaldebit = row.totalDebit; Totalcredit = row.totalcredit; Totalbaolance = row.totalbal; account = row.inv_complete;
                datect = row.datecrt;
                wrHTML += '<tr class="paid_item"><td style="width:10%; text-align:left;">' + row.inv_num + '</td>';
                wrHTML += '<td style="width:5%; text-align:left;">' + row.code_journal + '</td>';
                wrHTML += '<td style="width:10%; text-align:left;">' + row.doc_date + '</td>';
                if (row.code_journal == "AC" || row.code_journal == "BQ") {                    
                    if (row.code_journal == "AC")
                        wrHTML += '<td style="width:10%; text-align:left;"><span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getPurchaseOrderPrint(' + row.inv_num + ', false);"><i class="fas fa - search - plus"></i>' + row.PO_SO_ref + '</a></span></td>';
                    else if (row.PO_SO_ref.substring(0, 2) == "PO")
                        wrHTML += '<td style="width:10%; text-align:left;"><span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getPurchaseOrderPrint(' + row.inv_num + ', false);"><i class="fas fa - search - plus"></i>' + row.PO_SO_ref + '</a></span></td>';
                    else
                        wrHTML += '<td style="width:10%; text-align:left;"><span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getaccountsoPrintDetails(\'' + row.PO_SO_ref.toString() + '\', false);"><i class="fas fa - search - plus"></i>' + row.PO_SO_ref + '</a></span></td>';
                }
                else if (row.code_journal == "OD") {
                    
                    wrHTML += '<td style="width:10%; text-align:left;"><span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getBillPrintDetails(' + row.inv_num + ', false);"><i class="fas fa - search - plus"></i>' + row.PO_SO_ref + '</a></span></td>';
                }
                else {
                    wrHTML += '<td style="width:10%; text-align:left;"><span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#"  onclick="PurchaseSalesPrint(' + row.inv_num + ',\'' + datect + '\');"><i class="fas fa - search - plus"></i>' + row.PO_SO_ref + '</a></td></span>';

                }
                //console.log(row.datecrt);
                wrHTML += '<td style="width:46%; text-align:left;">' + row.label_operation + '</td>';
                if (row.debit != '')
                    wrHTML += '<td id="artist_' + row.inv_num + '" style="width:5%; text-align:right;" class="text-right debit-amount">' +  numberRenderer( row.debit) + '</td>';
                else
                    wrHTML += '<td style="width:10%; text-align:right;">' + '' + '</td>';
                if (row.credit != '')
                    wrHTML += '<td id="artist_' + row.inv_num + '" style="width:5%; text-align:right;" class="text-right credit-amount">' + numberRenderer( row.credit) + '</td></tr > ';
                else
                    wrHTML += '<td style="width:10%; text-align:right;">' + '' + '</td></tr > ';
            });
            wrHTML += '<tfoot><tr><td colspan="5" style="width:10%; text-align:right;"><b> Total accounting account ' + account + ' : </<b></td>';
            wrHTML += '<td style="width:5%; text-align:right;"><strong><span id="Totaldebit">' + numberRenderer(Totaldebit) + '</span></strong></td>';
            wrHTML += '<td style="width:5%; text-align:right;"><strong><span id="Totalcredit">' + numberRenderer(Totalcredit) + '</span></strong></td></tr>';
            wrHTML += '<tr><td colspan="5" style="width:10%; text-align:right;"><b> Balance : </<b></td>';
            wrHTML += '<td style="width:5%; text-align:right;"><strong><span id="Totalbailance">' + numberRenderer(Totalbaolance) + '</span></strong></td>';
            wrHTML += '<td style="width:5%; text-align:right;"></td></tr></tfoot>';
        },
        error: function (xhr, status, err) { alert(err); },
        complete: function () { }, async: false
    });
    wrHTML += '</table>';
    return wrHTML;
}
function getGrandTotal(is_date) {
    var numberRenderer = $.fn.dataTable.render.number(',', '.', 2, '$').display;
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
                    $("#totaldebit").text('$' + d[0].debit); $("#totalcredival").text('$' + d[0].credit); $("#totalbalval").text( numberRenderer(d[0].balance))
                }
            }
        },
        error: function (msg) {

        }
    });
}