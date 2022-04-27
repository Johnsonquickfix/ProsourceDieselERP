$(document).ready(function () {
    var loc = window.location.pathname;
    CheckPermissions("#btnChange", "#hfEdit", "", loc);
    // CheckPermissions("#btnAddUser", "#hfEdit", "", loc); 
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
    },
        function (start, end, label) {
            FillGrid();
        }
    );
    FillGrid();
    filldropdown();
    // Add event listener for opening and closing details
    $('#dtdata tbody').on('click', '.pdetailspo-control', function () {
        // console.log('svvvd');
        var tr = $(this).closest('tr');
        var row = $('#dtdata').DataTable().row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            tr.find('.pdetailspo-control').empty().append('<i class="glyphicon glyphicon-plus-sign"></i>');
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            tr.find('.pdetailspo-control').empty().append('<i class="glyphicon glyphicon-minus-sign"></i>');
            row.child(formatPO(row.data())).show();
            tr.addClass('shown');
        }
    }); 
});

function filldropdown() {
    $.ajax({
        url: "/PaymentInvoice/GetPaymentType",
        type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data); 

            $("#ddlaccount").html('<option value="0">Select Account</option>');
            for (i = 0; i < dt['Table1'].length; i++) { $("#ddlaccount").append('<option value="' + dt['Table1'][i].id + '">' + dt['Table1'][i].text + '</option>'); }

        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }
    });


}
function Search() {
    FillGrid();
}

function FillGrid() {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    var account = $('#ddlaccount').val();
    var status = $('#ddlstatus').val();
    $('#dtdata').DataTable({
        destroy: true, bProcessing: true, bServerSide: true,
        bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        sAjaxSource: "/PaymentInvoice/GetcheckList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: 'SERPB' }, { name: "strValue2", value: sd }, { name: "strValue3", value: ed }, { name: "strValue4", value: account }, { name: "strValue5", value: status });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [

            { data: 'id', title: '#', sWidth: "8%" },
            { data: 'rowid', title: '#', sWidth: "8%" },
           
            {
                data: 'ref', title: 'Bill No', sWidth: "12%", render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    return '<a href="javascript:void(0);" class="pdetailspo-control" data-toggle="tooltip" title="Click here to view order preview."><i class="glyphicon glyphicon-plus-sign"></i></a> #' + row.ref + '';
                    // return '<a  title="Click here to view order preview" data-toggle="tooltip"> #' + row.ref + '</a> <a href="javascript:void(0);" title="Click here to print" data-toggle="tooltip" onclick="PrintProposals(' + row.id + ');"><i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'num_payment', title: 'Check No.', sWidth: "10%" },
            { data: 'label', title: 'Account Name', sWidth: "10%" },
            { data: 'amount', title: 'Total Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            //{ data: 'ref', title: 'Bill No', sWidth: "10%" },
            { data: 'date_creation', title: 'Bill Date', sWidth: "10%" },
            
            { data: 'comments', title: 'Comments', sWidth: "10%" },
            { data: 'checkstatus', title: 'Status', sWidth: "10%" },
           
             
 
        ],
       
        columnDefs: [{ visible: false, targets: [0], searchable: false, orderable: false }], order: [[0, "desc"]],
        dom: 'lBftipr',
        buttons: [
            {
                extend: 'csv', className: 'button', text: '<i class="fas fa-file-csv"></i> CSV',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7, 8],
             
                },
                filename: function () {
                    let d = new Date(); let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Check_Register_' + e;
                },
            },
             
            {
                extend: 'print',
                //title: '<h3 style="text-align:center">Layla Sleep Inc.</h3><br /><h3 style="text-align:left">Chart of accounts</h3>',
                title: '', className: 'button', text: '<i class="fas fa-file-csv"></i> Print', footer: false,
                exportOptions: { columns: [1, 2, 3, 4, 5, 6, 7, 8], },
                filename: function () {
                    let d = new Date(); let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Check_Register' + e;
                },
                messageTop: function () { return '<h3 style = "text-align:center"> Layla Sleep Inc.</h3 ><br /><h3 style="text-align:left">Check Register</h3>'; },
            }
        ],
    });
}
function formatPO(d) {
    let option = { strValue1: d.id }, wrHTML = '<table class="inventory-table1 table-blue table check-table table-bordered table-striped dataTable no-footer"><thead><tr><th style="width:20%; text-align:left; visibility:inherit; opacity:1;">Invoice No</th><th style="width:35%; text-align:left; visibility:inherit; opacity:1;">Receive Date</th><th style="width:30%; text-align:left; visibility:inherit; opacity:1;">Paid Amount</th></tr></thead>';
    $.ajax({
        url: '/PaymentInvoice/GetPaymentcheckdetails', type: 'post', dataType: 'json', contentType: "application/json; charset=utf-8", data: JSON.stringify(option),
        success: function (result) {
            result = JSON.parse(result);
            if (result.length == 0) { wrHTML += '<tbody><tr><td valign="top" colspan="3" class="no-data-available">Sorry no matching records found.</td></tr></tbody>'; }
            $(result).each(function (index, row) {
                wrHTML += '<tr><td style="width:20%; text-align:left;"> ' + row.ref + ' </td><td style="width:35%; text-align:left;">' + row.date_creation + '</td>';
                wrHTML += '<td style="width:30%; text-align:left;">' + '$' + row.amount + '</td></tr > ';
            });
        },
        error: function (xhr, status, err) { alert(err); },
        complete: function () { }, async: false
    });
    wrHTML += '</table>';
    return wrHTML;
}

 

 

 
