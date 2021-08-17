ProductWarehouseGrid();
WarehouseGrid();
function WarehouseGrid() {
    var obj = { strValue1: $("#ddlSearchStatus").val() }
        $.ajax({
            url: '/Warehouse/GetWarehouse',
            method: 'post',
            datatype: 'json',
            contentType: "application/json; charset=utf-8",
            processing: true,
            data: JSON.stringify(obj),
            success: function (data) {
                $('#dtdatawarehouse').dataTable({
                    destroy: true,
                    scrollX: true,
                    data: JSON.parse(data),
                    "columns": [
                        { data: 'rowid', title: 'ID', sWidth: "5%" },
                        { data: 'ref', title: 'Ref', sWidth: "10%" },
                        //{ data: 'description', title: 'Description', sWidth: "15%" },
                        { data: 'lieu', title: 'Short Name Location', sWidth: "20%" },
                        { data: 'address', title: 'Address', sWidth: "15%" },
                        { data: 'phone', title: 'Phone', sWidth: "15%" },
                        { data: 'status', title: 'Status', sWidth: "10%" },
                        { data:'warehouse_type', title:'Type', sWidth:"10%"},
                        {
                            'data': 'rowid', sWidth: "10%",
                            'render': function (rowid, type, full, meta) {
                                return '<a href="javascript:void(0);" onClick="EditUser(' + rowid + ')"><i class="glyphicon glyphicon-pencil"></i></a>'
                            }
                        }
                    ],

                   
                    "order": [[0, 'desc']],
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.responseText);
            }
        });

    }


    function EditUser(rowid) {
        window.location.href = 'UpdateWarehouse?rowid=' + rowid;
    }

$('#btnSearch').click(function () {
    WarehouseGrid();
})


function ProductWarehouseGrid() {
    $.ajax({
        url: '/Warehouse/GetProductWarehouse',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        
        success: function (data) {
            $('#product').dataTable({
                destroy: true,
                //scrollX: true,
                data: JSON.parse(data),
                "columns": [
                    { data: 'warehouse', title: 'Warehouse Name', sWidth: "25%" },
                    { data: 'product', title: 'Product Name', sWidth: "25%" },
                    { data: 'address', title: 'Warehouse Address', sWidth: "25%" },
                    //{ data: 'phone', title: 'Vendor Phone', sWidth: "25%" }
                ],


                "order": [[0, 'desc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });
}