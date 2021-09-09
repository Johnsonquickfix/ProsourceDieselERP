getProduct();
getVendor();

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
    var vendorid = $('#ddlvendor').val();
    var obj = {
        strValue1: vendorid,
    }
    jQuery.ajax({
        url: "/Setup/Getvendordetails/", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            getWarehouse();
        },
        //error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });
});

function getWarehouse() {
    var vendorid = $('#ddlvendor').val();
    var obj = {
        strValue2: vendorid,
    }
    $.ajax({
        url: "/Setup/GetWarehouse",
        dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            //var opt;
            var opt = '<option value="0">Please Select Warehouse</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
                 //opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlwarehouse').html(opt);
        }

    });
}


function updateProductWarehouseRule() {
    rowid = $("#hfid").val();
    prefixcode = $("#txtprefixcode").val();
    product = $("#ddlProduct").val();
    vendor = $("#ddlvendor").val();
    warehouse = $("#ddlwarehouse").val();
    productid = $("#hfproductid").val();

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
            searchid: rowid,
            prefix_code: prefixcode,
            product_id: product,
            fk_vendor: vendor,
            fk_warehouse: warehouse,
            searchproductid: productid,
        }
        $.ajax({
            url: '/Setup/UpdateProductWarehouseRule/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success').then((result) => { location.href = '../productrule'; });
                    reset();
                    ProductWarehouseRuleGrid();
                    
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



