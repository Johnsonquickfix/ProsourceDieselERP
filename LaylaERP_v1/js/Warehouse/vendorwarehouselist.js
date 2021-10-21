VendorWarehouseGrid();
//getWarehouse();
function VendorWarehouseGrid() {
    var obj = { strValue1: $("#hfid").val() }
    $.ajax({
        url: '/Warehouse/Getvendorwarehouse',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        data: JSON.stringify(obj),
        success: function (data) {
            $('#vendor').dataTable({
                destroy: true,
                //scrollX: true,
                data: JSON.parse(data),
                "columns": [
                    //{ data: 'wname', title: 'Warehouse Name', sWidth: "25%" },
                    { data: 'vname', title: 'Vendor Name', sWidth: "25%" },
                    { data: 'Vaddress', title: 'Vendor Address', sWidth: "25%" },
                    {
                        data: 'phone', title: 'Vendor Phone', sWidth: "25%", render: function (toFormat) {
                            var tPhone = '';
                            if (toFormat != null) {
                                tPhone = toFormat.toString();
                                tPhone = '(' + tPhone.substring(0, 3) + ') ' + tPhone.substring(3, 6) + ' ' + tPhone.substring(6, 10);
                            }
                            return tPhone
                        }
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


function getWarehouse() {

    $.ajax({
        url: "/Warehouse/GetWarehousename",
        type: "Get",
        success: function (data) {
            var opt = '<option value="">Please Select Warehouse</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlWarehouse').html(opt);
        }

    });
}

$('#btnSearchVendor').click(function () {
    VendorWarehouseGrid();
})