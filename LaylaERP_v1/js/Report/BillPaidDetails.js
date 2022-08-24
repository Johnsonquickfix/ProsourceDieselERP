$(document).ready(function () {
    getbill();
 
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
        //function (start, end, label) {
        //    $.when(MiscBillGrid()).done(function () { MiscBillFullyGrid(); });

        //}
    );

  //  $.when(MiscBillGrid()).done(function () { MiscBillFullyGrid(); });
    MiscBillGrid();
  
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

    // Add event listener for opening and closing details
    $('#dtfullypaid tbody').on('click', '.pdetailbill-control', function () {
        // console.log('svvvd');
        var tr = $(this).closest('tr');
        var row = $('#dtfullypaid').DataTable().row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            tr.find('.pdetailbill-control').empty().append('<i class="glyphicon glyphicon-plus-sign"></i>');
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            tr.find('.pdetailbill-control').empty().append('<i class="glyphicon glyphicon-minus-sign"></i>');
            //row.child(formatPartially(row.data())).show();
            row.child(formatPO(row.data())).show();
            tr.addClass('shown');
        }
    });

    $('#btnsearchdetails').click(function () {
        bill = $("#ddlbill").val();
        if (bill == "0") {
            swal('Alert', 'Please select billno', 'error').then(function () { swal.close(); $('#ddlbill').focus(); });
        }
        else {
            console.log('hh');
            MiscBillGrid();
        }
    });

  
});

function MiscBillGrid() { 
    let paymentmethod = $("#ddlstatus").val();
    //if (paymentmethod == 'PN')
    //    paymentmethod = 'SERPB';
    //else
    //    paymentmethod = 'SFRPB';
    paymentmethod = 'SFRCH';
    
    let billno = $("#ddlbill").val();
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    var obj = { strValue1: sd, strValue2: ed, strValue3: paymentmethod, strValue4: billno}
    if ($('#txtOrderDate').val() == '') { sd = ''; ed = '' };
    let table = $('#dtdata').DataTable({
        //columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': false, 'targets': [9] }], order: [[9, "desc"]],
        order: [[0, "desc"]], destroy: true, bProcessing: true, bServerSide: false, bAutoWidth: false, searching: true, responsive: true, lengthMenu: [[20, 50, 100, 200], [20, 50, 100, 200]],
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('.dataTables_filter input').unbind();
            $('.dataTables_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table.search(this.value).draw(); }
            });
        },
        ajax: {
            url: '/Reports/GetBillDetailslist', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        aoColumns: [
          /*  { data: 'date_creation', title: 'Bill Date', sWidth: "10%" },*/
            {
                data: 'ref', title: 'Bill No.', class: 'text-left', sWidth: "10%", render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    return '<a href="javascript:void(0);"  data-toggle="tooltip" title="Click here to view order preview."></a> ' + row.ref + ' <a href="#" title="Click here to print" data-toggle="tooltip" onclick="getBillPrintDetails(' + row.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                    // return '<a  title="Click here to view order preview" data-toggle="tooltip"> #' + row.ref + '</a> <a href="javascript:void(0);" title="Click here to print" data-toggle="tooltip" onclick="PrintProposals(' + row.id + ');"><i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'payref', title: 'Invoice No.', sWidth: "10%" },
            { data: 'payment_date', title: 'Payment Date', sWidth: "15%" },
            { data: 'customertype', title: 'Bill Type', sWidth: "10%" },
            { data: 'displayname', title: 'Name', sWidth: "10%" },
           /* { data: 'ext_payment_site', title: 'Transaction Id', sWidth: "15%" },*/
            { data: 'PaymentType', title: 'Payment Type', sWidth: "10%" },
            { data: 'total_ttc', title: 'Total Amt.', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'discount', title: 'Discount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'sub_total', title: 'Paid Amt.', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
         //   { data: 'sub_total', title: 'Paid Amt.', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
          
           // { data: 'amount', title: 'Total Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },

            
           // { data: 'recieved', title: 'Total Paid Amt.', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'remaining', title: 'Balance Amt.', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },


            //{
            //    data: 'remaining', title: 'Balance Amt.', class: 'text-right', sWidth: "10%", render: function (data, type, row) {

            //        return (row.total_ttc - row.sub_total).toFixed(2);
            //    }
            //},



            //{
            //    data: 'due_date_s', title: 'Due date', sWidth: "10%", render: function (id, type, full, meta) {
            //        if (full.past_due == "Past Due") return full.due_date + ' <i class="fas fa-exclamation pastdue" title="Past Due" aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>';
            //        else return '<span style="display: none;">' + full.due_date_s + '</span>' + full.due_date;
            //    }
            //},
        ],
        "dom": 'lBftip',
        "buttons": [
            {
                extend: 'csv',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> Export',
                filename: function () {
                    // var d = new Date();
                    return 'Misc_Bill_Report_' + $("#txtOrderDate").val().replaceAll('/', '.');
                },

            },
            {
                extend: 'print',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> Print',
                title: function () {
                    return "Layla Sleep Inc - Misc Bill Report";
                },
                footer: true,
                exportOptions: {
                    columns: [0, 1, 2, 3, 4,5, 7, 8],
                },
                filename: function () {
                    //var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
                    return 'Misc_Bill_Report_' + $("#txtOrderDate").val().replaceAll('/', '.');
                },
            },

            {
                extend: 'pdfHtml5',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> PDF',
                footer: true,
                exportOptions: {
                    columns: [0, 1, 2, 3,4,5,  7, 8],

                }, 
                filename: function () {
                    // var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
                    return 'Misc_Bill_Report_' + $("#txtOrderDate").val().replaceAll('/', '.');
                },
            },


        ],

       

    });

}
 
function getbill() {
    $.ajax({
        url: "/Reports/getbill",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please Select Sales</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlbill').html(opt);
        }

    });
}

 
