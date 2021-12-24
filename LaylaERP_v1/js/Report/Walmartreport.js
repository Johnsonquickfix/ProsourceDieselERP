$(document).ready(function () {
    $("#loader").hide(); //$('.select2').select2();
    $('#txtDate').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'This Year': [moment().startOf('year'), moment().endOf('year')]
        },
        startDate: moment().subtract(1, 'month'), autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'left', orientation: "left auto"
    }, function (start, end, label) {
        $('#txtDate').val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY')); 
        PoPartiallyColleps();
    });
    $('#txtDate').val('');
    $('#txtDate').on('cancel.daterangepicker', function (ev, picker) { $(this).val(''); PoPartiallyColleps(); });
    PoPartiallyColleps();    
    // Add event listener for opening and closing details
    $('#dtdataPartially tbody').on('click', '.pdetails-control', function () {
        var tr = $(this).closest('tr');
        var row = $('#dtdataPartially').DataTable().row(tr);
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

}); 
function PoPartiallyColleps() {
    let urid = parseInt($("#ddlSearchStatus").val());
    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };
    let obj = { strValue1: sd, strValue2: ed, strValue3: $("#ddlSearchStatus").val() };// console.log(obj);
    console.log(obj);
 
    let tablepar = $('#dtdataPartially').DataTable({
        oSearch: { "sSearch": '' }, bAutoWidth: false, searching: false, scrollX: false,
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        destroy: true, ajax: {
            url: '/Reports/GetWalmartDetailsList', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
        columns: [
            { data: 'id', title: 'Parent ID', sWidth: "8%" },         
            {
                data: 'CustomerOrderID', title: 'Customer Order ID', sWidth: "15%", render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    return '<a href="javascript:void(0);" class="pdetails-control" data-toggle="tooltip" title="Click here to show details."><i class="glyphicon glyphicon-plus-sign"></i></a>' + row.CustomerOrderID + '';

                }
            },
            { data: 'OrderID', title: 'Purchase Order ID', sWidth: "10%" },
            { data: 'CustomerEmail', title: 'Customer Email', sWidth: "15%" },
            { data: 'OrderDate', title: 'Order Date', sWidth: "10%" },
            { data: 'CustomerName', title: 'Customer Name', sWidth: "15%" },
            { data: 'CustomerAddress', title: 'Customer Address', sWidth: "15%" },
            { data: 'CustomerPhone', title: 'Customer Phone', sWidth: "15%" },
            { data: 'EstimatedDeliveryDate', title: 'Estimated Delivery Date', sWidth: "15%" },

            //{
            //    data: 'date_livraison_s', title: 'Planned date of delivery', sWidth: "10%", render: function (id, type, full, meta) {
            //        if (full.past_due == "Past Due") return '<span style="display: none;">' + full.date_livraison_s + '</span>' + full.date_livraison + ' <i class="fas fa-exclamation pastdue" title="Past Due" aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>';
            //        else return '<span style="display: none;">' + full.date_livraison_s + '</span>' + full.date_livraison;
            //    }
            //},
            { data: 'EstimatedShipDate', title: 'Estimated Ship Date', sWidth: "10%" },
       
        ],
        //  columnDefs: [{ targets: [0], visible: false,"orderable": false }], order: [[0, "desc"]],
        columnDefs: [{ targets: [0], visible: false, searchable: false }], order: [[0, "desc"]],
        //"dom": 'Bfrtip',
        //"buttons": [

        //    {
        //        extend: 'csv',
        //        className: 'button',
        //        text: '<i class="fas fa-file-csv"></i> CSV',
        //        filename: function () {
        //            var from = $("#txtDate").val().replaceAll('/', '.');
        //            //var to = $("#end_date").val().replaceAll('/', '.');
        //            return from;
        //        },
        //    },

        //],
    });
}

/* Formatting function for row details - modify as you need */
function formatPartially(d) {
    console.log(d.OrderID);
    let option = { strValue1: d.OrderID }, wrHTML = '<table class="inventory-table table-blue table check-table table-bordered table-striped dataTable no-footer"><thead><tr><th style="width:80%; text-align:left;">Product Name</th><th style="width:5%; text-align:left;">Quantity</th><th style="width:5%; text-align:left;">SKU</th><th style="width:5%; text-align:left;">Price</th><th style="width:5%; text-align:right;">Tax</th></tr></thead>';
    $.ajax({
        url: '/Reports/GetWalmartdetailsdata', type: 'post', dataType: 'json', contentType: "application/json; charset=utf-8", data: JSON.stringify(option),
        success: function (result) {
            result = JSON.parse(result);
            if (result.length == 0) { wrHTML += '<tbody><tr><td valign="top" colspan="6" class="no-data-available">Sorry no matching records found.</td></tr></tbody>'; }
            $(result).each(function (index, row) {

                wrHTML += '<tr><td style="width:80%; text-align:left;">' + row.Product + '</a></td><td style="width:5%; text-align:left;">' + row.Quantity + '</td>';
                wrHTML += '<td style="width:5%; text-align:left;">' + row.SKU + '</td>'
                wrHTML += '<td style="width:5%; text-align:left;">' + '$' + row.Price.toFixed(2) + '</td>'
                wrHTML += '<td style="width:5%; text-align:right;">' + '$' + row.Tax.toFixed(2) + '</td></tr > ';
            });
        },
        error: function (xhr, status, err) { alert(err); },
        complete: function () { }, async: false
    });
    wrHTML += '</table>';
    return wrHTML;
}
 