
$(document).ready(function () {



    $.ajax({
        url: "/Warehouse/GetVendor",
        type: "Get",
        success: function (data) {
            $('#ddlVendor').append('<option value="-1">Please Select Vendor</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddlVendor').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });

    $.ajax({
        url: "/Warehouse/GetWarehousename",
        type: "Get",
        success: function (data) {
            $('#ddlWarehouse').append('<option value="-1">Please Select Warehouse</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddlWarehouse').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
    $("#loader").hide();

    $.ajax({
        url: '/assignvendorandwarehouse/Getvendorwarehouse',
        method: 'GET',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        success: function (data) {
            //debugger;
            $("#dtgetdata").dataTable({
                destroy: true,
                //scrollX: true,
                data: JSON.parse(data.message),
                "columns": [

                    { data: 'vendor', title: 'Vendor ', sWidth: "25%", class: 'text-left' },
                    { data: 'warehouse', title: 'Warehouse ', sWidth: "25%" },
                    {
                        'data': 'ID', sWidth: "8%",
                        'render': function (id, type, full, meta) {
                            //console.log(full.vendor_id)
                            //console.log(full.warehouse_id)
                            return '<a href="#" data-toggle="tooltip" data-placement="left" title="View/Edit vendor and warehouse " onclick="Edit(' + full.vendor_id + ',' + full.warehouse_id + ',' + full.ID + ');"><i class="glyphicon glyphicon-pencil" onclick="Edit(' + full + ',' + full + ');"></i></a>';
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
});
function assignvendorandwarehouse()
{
      // debugger;
    var Vendor = $("#ddlVendor").val();
    var Warehouse = $("#ddlWarehouse").val();
    var Id = $("#vwid").val();
    var obj = { vendor_id: Vendor, WarehouseID: Warehouse }
    var obj1 = { vendor_id: Vendor, WarehouseID: Warehouse, rowid: Id }
    if (Vendor == '-1')
    {
        swal('Alert', 'Plese Select Vendor', 'warning').then(function () { swal.close();  });
    }
    else if (Warehouse == '-1')
    {
        swal('Alert', 'Plese Select Warehouse', 'warning').then(function () { swal.close(); });

    }
 
    else if (Id == '') {
        $.ajax({
            url: "/assignvendorandwarehouse/assign",
            type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            searching: false,
            success: function (data) {
                console.log(data);
                var Response = data.message;
                if (Response == 'Insert Successfully') {
                    swal('success', Response, 'success').then(function () { swal.close(); $("#ddlVendor").val(-1); $("#ddlWarehouse").val(-1); });
                }
                else {
                    swal('Alert', Response, 'warning').then(function () { swal.close(); $("#ddlVendor").val(-1); $("#ddlWarehouse").val(-1); });
                }
            }
        });
    }
    else {
        $.ajax({
            url: "/assignvendorandwarehouse/Update",
            type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj1),
            dataType: "json",
            searching: false,
            success: function (data) {
                console.log(data);
                var Response = data.message;
                if (Response == 'Update Successfully') {
                    swal('success', Response, 'success').then(function () { swal.close(); $("#ddlVendor").val(-1); $("#ddlWarehouse").val(-1); });
                }
                else {
                    swal('Alert', Response, 'warning').then(function () { swal.close(); $("#ddlVendor").val(-1); $("#ddlWarehouse").val(-1); });
                }
            }
        });
    }
}

//function VendorWarehouseGrid() {
//    var obj = { strValue1: $("#hfid").val() }


function Edit(vendor_id, warehouse_id, ID)
{
    $("#ddlVendor").val(vendor_id);
    $("#ddlWarehouse").val(warehouse_id);
    $("#vwid").val(ID);

}

//}