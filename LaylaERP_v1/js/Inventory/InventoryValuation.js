$(document).ready(function () {
    $('#txtDate').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        startDate: moment(), autoUpdateInput: true, alwaysShowCalendars: true, singleDatePicker: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' },
        opens: 'left', orientation: "left auto",
    });
    $.when(getProducts()).done(function () { InventoryReport() });
    $(".select2").select2();
    $(document).on("click", "#btnSearch", function (t) { t.preventDefault(); InventoryReport(); });
    $("#ddlProduct,#ddlCategory").change(function () {
        //ProductStockGrid();
    });
    $("#txtsku").change(function () {
        //if ($("#txtsku").val().length < 3) return false;
        InventoryReport();
    });
});

function isNullAndUndef(variable) { return (variable !== null && variable !== undefined); }
function getProducts() {
    $.ajax({
        url: "/Inventory/GetProductList", type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            //Product
            $("#ddlProduct").html('<option value="0">Select Product</option>');
            $.each(dt['Table'], function (i, row) { $("#ddlProduct").append('<option value="' + row.id + '">' + row.text + '</option>'); });

            //Category
            $("#ddlCategory").html('<option value="0">Select Category</option>');
            $.each(dt['Table1'], function (i, row) { $("#ddlCategory").append('<option value="' + row.id + '">' + row.text + '</option>'); });
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }
    });
}

function InventoryReport() {
    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY'), ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    let pid = parseInt($("#ddlProduct").val()) || 0, ctid = parseInt($("#ddlCategory").val()) || 0;
    let obj = { strValue1: $("#txtsku").val().trim(), strValue2: (ctid > 0 ? ctid : ''), strValue3: (pid > 0 ? pid : ''), strValue4: sd, strValue5: ed };// console.log(obj);
    var table_EL = $('#dtdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': false, 'targets': [0] }], order: [[0, "asc"]],
        dom: 'lBftip', oSearch: { "sSearch": '' }, bProcessing: true, bAutoWidth: false, destroy: true, lengthMenu: [[50, 100, 150, 200], [50, 100, 150, 200]],
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#dtdata_filter input').unbind();
            $('#dtdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        ajax: {
            url: '/Inventory/InventoryValuationReport', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        aoColumns: [
            { data: 'p_id', title: 'Parent ID', sWidth: "8%" },
            {
                data: 'id', title: 'Id', sWidth: "5%", render: function (data, type, row) {
                    if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control" data-toggle="tooltip" title="Click here to show warehouse On-Hand Inventory."></a>' + row.id; else return ' <b>#' + row.id + '</b>';
                }
            },
            { data: 'category', title: 'Category', sWidth: "8%" },
            { data: 'sku', title: 'SKU', sWidth: "10%", class: "text-left" },
            { data: 'post_title', title: 'Product', sWidth: "20%", class: "text-left" },
            {
                data: 'qty', title: 'Qty', sWidth: "8%", className: "text-right", render: function (data, type, row) {
                    if (row.post_parent > 0) return $.fn.dataTable.render.number(',', '.', 0, '').display(data); else return '';
                }
            },
            {
                data: 'asset_value', title: 'Asset Value', sWidth: "10%", class: "text-right", render: function (data, type, row) {
                    if (row.post_parent > 0) return $.fn.dataTable.render.number(',', '.', 2, '$').display(data); else return '';
                }
            },
            {
                data: 'calc_avg', title: 'Calc. Avg', sWidth: "10%", class: "text-right", render: function (data, type, row) {
                    if (row.post_parent > 0) return $.fn.dataTable.render.number(',', '.', 2, '$').display(data); else return '';
                }
            },
        ],
        "dom": 'lBftipr',
        "buttons": [
            {
                extend: 'csv', className: 'button', text: '<i class="fas fa-file-csv"></i> CSV',
                filename: function () {
                    let d = new Date();
                    let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Inventory Valuation' + e;
                },
                exportOptions: { columns: [1, 2, 3, 4, 5, 6, 7], },
            },
            {
                extend: 'print', title: '', className: 'button', text: '<i class="fas fa-file-csv"></i> Print', footer: false,
                filename: function () {
                    let d = new Date();
                    let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Inventory valuation' + e;
                },
                exportOptions: { columns: [1, 2, 3, 4, 5, 6, 7], },
                messageTop: function () { return '<h3 style = "text-align:center"> Layla Sleep Inc.</h3 ><br /><h3 style="text-align:left">Inventory Valuation</h3>'; },
            }
        ],

    });
}