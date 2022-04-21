$(document).ready(function () {
    $("#loader").hide(); $("#mydate").hide();
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
    getEmployee();
    $(".select2").select2();
    Search();
});

function getEmployee() {
    $.ajax({
        url: "/Reports/GetEmployee",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please Select Sales</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddltype').html(opt);
        }

    });
}
function Search() {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    var empid = $('#ddltype').val();
    $('#dtdata').DataTable({
        destroy: true, bProcessing: false, bServerSide: false, bAutoWidth: false, searching: true,
            responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
            "ajax": {
                "url": '/Reports/GetQuoteDetails',
                "type": 'POST',
                "dataType": 'json',
                "data": { Month: sd, Year: ed, Empid: empid }
            },
            "columns": [
                { data: 'first_name', title: 'Agent', class: 'text-left', sWidth: "10%", },
                { data: 'display_name', title: 'Quote No.', class: 'text-left', sWidth: "10%",},
                { data: 'billing_city', title: 'Date', class: 'text-right', sWidth: "10%", },
                { data: 'subtotal', title: 'Sub-Total', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'Discount', title: 'Total Savings', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'tax', title: 'Sale Tax', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'fee', title: 'Fee', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'total', title: 'Quote Total', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            ],
            "order": [0, 'desc'],
        });
}