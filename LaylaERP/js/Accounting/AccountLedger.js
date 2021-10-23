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
        AccountDataList(true);
    });
    getVendor();
    $(".select2").select2();
    AccountDataList(true);
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
        $("#loader").show();
        AccountDataList(true);
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

    let obj = { strValue1: dfa, strValue2: urid};
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
                data: 'rowid', title: 'Account Name', sWidth: "10%", render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    return '<a href="javascript:void(0);" class="pdetails-control" data-toggle="tooltip" title="Click here to show details."><i class="glyphicon glyphicon-plus-sign"></i></a> -  #' + row.Acctext + '';

                }
            }   
        ],
        columnDefs: [{ targets: [0], searchable: false }]
    });
}

/* Formatting function for row details - modify as you need */
function formatPartially(d) {
   // console.log(d);
    let urid = $("#ddlVendor").val();
    let option = { strValue1: d.rowid, strValue2: urid}, wrHTML = '<table class="inventory-table table-blue table check-table table-bordered table-striped dataTable no-footer"><thead><tr><th style="width:10%; text-align:left;">Transaction ID</th><th style="width:5%; text-align:left;">Journal</th><th style="width:10%; text-align:left;">Date</th><th style="width:10%; text-align:left;">Accounting Doc</th><th style="width:55%; text-align:left;">Label</th><th style="width:10%; text-align:right;">Debit</th><th style="width:10%; text-align:right;">Credit</th></tr></thead>';
    $.ajax({
        url: '/Accounting/GetDetailsLedger', type: 'post', dataType: 'json', contentType: "application/json; charset=utf-8", data: JSON.stringify(option),
        success: function (result) {
            result = JSON.parse(result);
            if (result.length == 0) { wrHTML += '<tbody><tr><td valign="top" colspan="6" class="no-data-available">Sorry no matching records found.</td></tr></tbody>'; }
            $(result).each(function (index, row) {

                wrHTML += '<tr><td style="width:10%; text-align:left;">' + row.inv_num + '</td>';
                wrHTML += '<td style="width:5%; text-align:left;">' + row.code_journal + '</td>';
                wrHTML += '<td style="width:10%; text-align:left;">' + row.doc_date + '</td>';
                wrHTML += '<td style="width:10%; text-align:left;"> <a href="#" onclick="getPurchaseOrderPrint(' + row.inv_num + ', false);"><i class="fas fa - search - plus"></i>' + row.PO_SO_ref + '</a></td>';
                wrHTML += '<td style="width:55%; text-align:left;">' + row.label_operation + '</td>';
                if (row.debit != '')
                    wrHTML += '<td style="width:5%; text-align:right;">' + '$' + row.debit + '</td>';
                else
                    wrHTML += '<td style="width:5%; text-align:right;">' + '' + '</td>';
                if (row.credit != '')
                    wrHTML += '<td style="width:5%; text-align:right;">' + '$' + row.credit + '</td></tr > ';
                else
                    wrHTML += '<td style="width:5%; text-align:right;">' + '' + '</td></tr > ';
            });
        },
        error: function (xhr, status, err) { alert(err); },
        complete: function () { }, async: false
    });
    wrHTML += '</table>';
    return wrHTML;
}
