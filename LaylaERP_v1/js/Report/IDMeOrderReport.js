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


    $('#ddlcouponcode').select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Search Coupon",
        ajax: {
            url: '/Reports/GetCouponList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.post_title, name: item.post_title, id: item.post_title } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }

    });

});



function Search() {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    var account = $('#ddlcouponcode').val();
    // var type = $('#ddltype').val();
    if (account == "0") { swal('alert', 'Please enter coupon code', 'error'); }
    //else if (type == "0") { swal('alert', 'Please select Type', 'error'); }
    else {
        $('#dtdata').DataTable({
            destroy: true,
            "scrollX": true,
            searching: false,
            "ajax": {
                "url": '/Reports/GetIDMeOrderReport',
                "type": 'POST',
                "dataType": 'json',
                "data": { Month: sd, Year: ed, Type: account }
                //"data": JSON.stringify(obj)
            },
            "columns": [
                { 'data': 'order_id', 'sWidth': "5%" },
                { 'data': 'first_name', 'sWidth': "15%" },
                { data: 'address', title: 'Coupon amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'subtotal', title: 'Sub-Total', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'billing_postcode', title: 'Shipping', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'tax', title: 'Sale Tax', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'fee', title: 'State Recycling Fee', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                //{ data: 'Discount', title: 'Fee', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                //{ data: 'first_name', title: 'Gift Card', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
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
                        var from = "IDMe"
                        return from;
                    },
                },

            ],

        });

    }
}


