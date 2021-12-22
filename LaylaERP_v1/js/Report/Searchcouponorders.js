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
    },

    );
});

function Search() {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    var account = $('#txtcouponcode').val();
    // var type = $('#ddltype').val();
    if (account == "0") { swal('alert', 'Please enter coupon code', 'error'); }
    //else if (type == "0") { swal('alert', 'Please select Type', 'error'); }
    else {
        $('#dtdata').DataTable({
            destroy: true,
            "scrollX": true,
            searching: false,
            "ajax": {
                "url": '/Reports/Getcouponcodesearch',
                "type": 'POST',
                "dataType": 'json',
                "data": { Month: sd, Year: ed, Type: account }
                //"data": JSON.stringify(obj)
            },
            "columns": [


                { 'data': 'order_id', 'sWidth': "5%" },
                { 'data': 'billing_city', 'sWidth': "15%" },

                {
                    data: 'orderstatus', title: 'Status', sWidth: "10%", render: function (data, type, row) {
                        if (data == 'wc-pending') return 'Pending payment';
                        else if (data == 'wc-processing') return 'Processing';
                        else if (data == 'wc-on-hold') return 'On hold';
                        else if (data == 'wc-completed') return 'Completed';
                        else if (data == 'wc-cancelled') return 'Cancelled';
                        else if (data == 'wc-refunded') return 'Refunded';
                        else if (data == 'wc-failed') return 'Failed';
                        else if (data == 'wc-cancelnopay') return 'Cancelled - No Payment';
                        else if (data == 'wc-pendingpodiuminv') return 'Pending Podium Invoice';
                        else if (data == 'wc-podium') return 'Order via Podium';
                        else if (data == 'wc-podiumrefund') return 'Podium Refunded';
                        else if (data == 'draft') return 'draft';
                        else return '-';
                    }
                },
                { data: 'subtotal', title: 'Sub-Total', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'address', title: 'Total Savings', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'billing_postcode', title: 'Shipping', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'tax', title: 'Sale Tax', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'fee', title: 'State Recycling Fee', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'Discount', title: 'Fee', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'first_name', title: 'Gift Card', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'total', title: 'Order Total', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            ],
            columnDefs: [{
                orderable: false,
                data: null,
                defaultContent: '',
            }],

            "order": [0, 'desc'],

            "dom": 'Bfrtip',
            "buttons": [

                {
                    extend: 'csv',
                    className: 'button',
                    text: '<i class="fas fa-file-csv"></i> CSV',
                    filename: function () {
                        var from = $("#txtOrderDate").val().replaceAll('/', '.');
                        //var to = $("#end_date").val().replaceAll('/', '.');
                        return from;
                    },
                },

            ],

        });

    }
}
 

