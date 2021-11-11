$(document).ready(function () {
    $("#loader").hide();
    $(".select2").select2();
    getVendorList();
})
$('#ddlVendorList').change(function () {
    getWareHouseList();
})
$('#ddlWareHouseList').change(function () {
    ProductWarehouseGrid();
})
function getVendorList() {
    $.ajax({
        url: "/Inventory/GetVendorList",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please Select Vendor</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlVendorList').html(opt);
        }

    });
}
function getWareHouseList() {
    let vendorID = $('#ddlVendorList').val();
    console.log(vendorID);
    var obj = { strValue1: vendorID }
    $.ajax({
        url: "/Inventory/GetWareHouseList",
        method: 'post', contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var opt = '<option value="0">Please Select WareHouse</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlWareHouseList').html(opt);
        }

    });
}
function ProductWarehouseGrid() {
    var id = $('#ddlWareHouseList').val();
    var obj = { getwarehouseid: id }
    $.ajax({
        url: '/Warehouse/GetProductWarehouse',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        data: JSON.stringify(obj),
        success: function (data) {
            $('#product').dataTable({
                destroy: true,
                //scrollX: true,
                data: JSON.parse(data),
                "columns": [
                    //{ data: 'warehouse', title: 'Warehouse Name', sWidth: "25%" },
                    { data: 'post_title', title: 'Product Name', sWidth: "25%", class: 'text-left' },
                    {
                        data: 'reg_price', title: 'Regular Price', sWidth: "25%",
                        render: $.fn.dataTable.render.number('', '.', 2, '$')
                    },
                    {
                        data: 'sale_price', title: 'Sale Price', sWidth: "25%",
                        render: $.fn.dataTable.render.number('', '.', 2, '$')
                    },
                    {
                        data: 'buy_price', title: 'Buying price', sWidth: "25%",
                        render: $.fn.dataTable.render.number('', '.', 2, '$')
                    },

                    {
                        data: 'stock', title: 'Stock', sWidth: "25%",

                    },

                ],


                "order": [[0, 'desc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });
}