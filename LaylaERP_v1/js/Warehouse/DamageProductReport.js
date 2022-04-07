$(document).ready(function () {
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
        DamageProductGrid(true);
    });
    DamageProductGrid(true);
})
function DamageProductGrid(is_date) {
    var urid = $("#ddlSearchStatus").val();
    ID = $("#hfid").val();
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';
    let obj = { strValue1: ID, sMonth: dfa };// console.log(obj);
    var numberRenderer = $.fn.dataTable.render.number(',', '.', 2,).display;
    var table_EL = $('#DamageProductData').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }, { 'visible': false, 'targets': [0] }], order: [[0, "asc"]],
        destroy: true, bProcessing: true, bAutoWidth: false, searching: true,
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
            $('#DamageProductData_filter input').unbind();
            $('#DamageProductData_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        ajax: {
            url: '/Warehouse/DamageProductReport', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { console.log(JSON.parse(data)); return JSON.parse(data); }
        },
        columns: [
            { data: 'id', title: 'Ref', sWidth: "5%" },
            { data: 'order_id', title: 'Order/Purchase/Return ID', sWidth: "15%" },
            { data: 'product', title: 'Product', sWidth: "20%" },
            { data: 'vendor', title: 'Vendor', sWidth: "10%" },
            { data: 'warehouse', title: 'Warehouse', sWidth: "15%" },
            { data: 'label', title: 'Return reason', sWidth: "15%" },
            { data: 'date', title: 'Date', sWidth: "10%", },
            { data: 'quantity', title: 'Qty', sWidth: "10%" },
        ],
        "dom": 'lBftipr',
        "buttons": [
            {
                extend: 'csv',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> CSV',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5],
                },
                filename: function () {
                    var d = new Date();
                    var e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Damage stock' + e;
                },
            },
            {
                extend: 'print',
                //title: '<h3 style="text-align:center">Layla Sleep Inc.</h3><br /><h3 style="text-align:left">Chart of accounts</h3>',
                title: '',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> Print',
                footer: false,
                exportOptions: {
                    columns: [1, 2, 3, 4, 5],
                },
                filename: function () {
                    var d = new Date();
                    var e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Damage stock' + e;
                },
                messageTop: function () {
                    return '<h3 style = "text-align:center"> Layla Sleep Inc.</h3 ><br /><h3 style="text-align:left">Damage stock</h3>';
                },
            }
        ],
    });
}
