getProduct();
getVendor();
ProductWarehouseRuleGrid();
function getProduct() {
    $.ajax({
        url: "/Setup/GetProduct",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please Select Product</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlProduct').html(opt);
        }

    });
}

function getVendor() {
    $.ajax({
        url: "/Setup/GetVendor",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please Select Vendor</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlvendor').html(opt);
        }

    });
}


$('#ddlvendor').change(function () {
    debugger
    var vendorid = $('#ddlvendor').val();
    var obj = {
        strValue1:vendorid,
    }
    jQuery.ajax({
        url: "/Setup/Getvendordetails/", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            getWarehouse();
            $('#txtcountry').val(data[0].country);
            $('#txtstate').val(data[0].state);
        },
        //error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });
});

function getWarehouse() {
    var vendorid = $('#ddlvendor').val();
    alert(vendorid);
    var obj = {
        strValue2: vendorid,
    }
    $.ajax({
        url: "/Setup/GetWarehouse",
        dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var opt = '<option value="0">Please Select Warehouse</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlwarehouse').html(opt);
        }

    });
}

function getID() {
    jQuery.ajax({
        url: "/Setup/GetIdProductWarehouserule/", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            $('#hfid').val(data[0].id);
            
        },
        
    });
}


function addProductWarehouseRule() {

    debugger
    prefixcode = $("#txtprefixcode").val();
    product = $("#ddlProduct").val();
    vendor = $("#ddlvendor").val();
    country = $("#txtcountry").val();
    state = $("#txtstate").val();
    warehouse = $("#ddlwarehouse").val();

    if (prefixcode == "") {
        swal('Alert', 'Please Enter Prefix Code', 'error').then(function () { swal.close(); $('#txtprefixcode').focus(); });
    }
    else if (product == 0) {
        swal('Alert', 'Please Select Product', 'error').then(function () { swal.close(); $('#ddlProduct').focus(); });
    }
    else if (vendor == 0) {
        swal('Alert', 'Please select vendor', 'error').then(function () { swal.close(); $('#ddlvendor').focus(); });
    }
    else if (warehouse == 0) {
        swal('Alert', 'Please select warehouse', 'error').then(function () { swal.close(); $('#ddlwarehouse').focus(); });
    }
    
    else {

        var obj = {
            prefix_code: prefixcode,
            product_id: product,
            fk_vendor: vendor,
            country: country,
            state: state,
            fk_warehouse: warehouse,
            
        }
        $.ajax({
            url: '/Setup/AddProductWarehouseRule/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    //$('#parent > input:text').val('');
                    swal('Alert!', data.message, 'success');
                    reset();
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })

    }

}

function reset() {
    $("#txtprefixcode").val('');
    $("#ddlProduct").val("0").trigger('change');
    $("#txtcountry").val('');
    $("#txtstate").val('');
    $("#ddlwarehouse").val("0").trigger('change');
}


function ProductWarehouseRuleGrid() {

    $.ajax({
        url: '/Setup/GetTableWarehouseRule',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,

        success: function (data) {
            $('#dtdata').dataTable({
                destroy: true,
                scrollX: false,
                data: JSON.parse(data),
                "columns": [
                    { data: 'product', title: 'Product', sWidth: "25%" },
                    { data: 'code', title: 'Prefix', sWidth: "15%" },
                    { data: 'warehouse', title: 'Warehouse', sWidth: "10%" },
                    { data: 'vendor', title: 'Vendor', sWidth: "20%" },

                ],
                "order": [[0, 'desc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });

}