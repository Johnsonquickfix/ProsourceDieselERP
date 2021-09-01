$(document).ready(function () {
    getProducts();
    ProductStockGrid();
    $(".select2").select2();
    $("#ddlProduct,#ddlCategory").change(function () {
        ProductStockGrid();
    });
    $("#txtsku").change(function () {
        ProductStockGrid();
    });

    // Add event listener for opening and closing details
    $('#dtdata tbody').on('click', '.details-control', function () {
        var tr = $(this).closest('tr');
        var row = $('#dtdata').DataTable().row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            tr.find('.details-control').empty().append('<i class="glyphicon glyphicon-plus-sign"></i>');
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            tr.find('.details-control').empty().append('<i class="glyphicon glyphicon-minus-sign"></i>');
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });
})

function getProducts() {
    $.ajax({
        url: "/Inventory/GetProductList",
        type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            //Product
            $("#ddlProduct").html('<option value="0">Select Product</option>');
            for (i = 0; i < dt['Table'].length; i++) { $("#ddlProduct").append('<option value="' + dt['Table'][i].id + '">' + dt['Table'][i].text + '</option>'); }

            //Category
            $("#ddlCategory").html('<option value="0">Select Category</option>');
            for (i = 0; i < dt['Table1'].length; i++) { $("#ddlCategory").append('<option value="' + dt['Table1'][i].id + '">' + dt['Table1'][i].text + '</option>'); }
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }
    });
}

function ProductStockGrid() {
    let _items = [];
    let pid = parseInt($("#ddlProduct").val()) || 0, ctid = parseInt($("#ddlCategory").val()) || 0;
    let obj = { strValue1: $("#txtsku").val().trim(), strValue2: (ctid > 0 ? ctid : ''), strValue3: (pid > 0 ? pid : '') }; console.log(obj);
    $('#dtdata').DataTable({
        oSearch: { "sSearch": '' }, order: [[0, "asc"]],
        dom: 'lBftip', buttons: [{ extend: 'excelHtml5', title: 'Product Inhand Inventory Report' }, { extend: 'csvHtml5', title: 'Product Inhand Inventory Report' }],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        destroy: true, bAutoWidth: false, ajax: {
            url: '/Inventory/GetProductStock', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
        columns: [
            { data: 'p_id', title: 'Parent ID', sWidth: "10%" },
            {
                data: 'id', title: 'ID', sWidth: "10%", render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> -  #' + row.id; else return ' <b>#' + row.id + '</b>';
                }
            },
            {
                data: 'post_type', title: 'Product Type', sWidth: "10%", render: function (data, type, row) {
                    if (data == 'product') return 'Product';
                    else if (data == 'product_variation') return 'Variable Product';
                    else return '-';
                }
            },
            { data: 'sku', title: 'SKU', sWidth: "10%" },
            { data: 'post_title', title: 'Product Name', sWidth: "20%" },
            { data: 'stock', title: 'Units In Stock', sWidth: "10%", className: "text-right", render: $.fn.dataTable.render.number('', '.', 0, '') },
            { data: 'UnitsinPO', title: 'Units in POs', sWidth: "10%", className: "text-right", render: $.fn.dataTable.render.number('', '.', 0, '') },
            { data: 'SaleUnits', title: 'Sale Units', sWidth: "10%", className: "text-right", render: $.fn.dataTable.render.number('', '.', 0, '') },
            { data: 'Damage', title: 'Damage Units', sWidth: "10%", className: "text-right", render: $.fn.dataTable.render.number('', '.', 0, '') },
            { data: 'available', title: 'Available Units', sWidth: "10%", className: "text-right", render: $.fn.dataTable.render.number('', '.', 0, '') },
        ],
        columnDefs: [{ targets: [0], visible: false, searchable: false }]
    });
}
/* Formatting function for row details - modify as you need */
function format(d) {
    console.log(d);
    let option = { strValue1: d.id }, wrHTML = '<table class="inventory-table table-blue table check-table table-bordered table-striped dataTable no-footer"><tr><th>Warehouse</th><th>Stock</th></tr>';
    $.ajax({
        url: '/Inventory/GetStockByWarehouse', type: 'post', dataType: 'json', contentType: "application/json; charset=utf-8", data: JSON.stringify(option),
        success: function (result) {
            result = JSON.parse(result); console.log(result);
            for (var i = 0; i < result.length; i++) {
                wrHTML += '<tr><td>' + result[i].ref + '</td><td>' + result[i].stock + '</td></tr>';
            }
        },
        error: function (xhr, status, err) { alert(err); },
        complete: function () { }, async: false
    });
    wrHTML += '</table>';
    return wrHTML;
}