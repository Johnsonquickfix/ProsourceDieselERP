$(document).ready(function () {
    $("#loader").hide();
    ProductWarehouseGrid();
})

function ProductWarehouseGrid() {
    var id = $("#hfid").val();
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