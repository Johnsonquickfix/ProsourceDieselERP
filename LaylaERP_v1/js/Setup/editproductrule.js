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
            var opt = '<option value="0">Please Select Warehouse</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
                 
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
    country = $("#txtcountry").val();
    //state = $("#txtstate").val();
    var statearray = $('#txtstate option:selected')
        .toArray().map(item => item.value).join();
    state = statearray;
    
    if (product == 0) {
        swal('Alert', 'Please Select Product', 'error').then(function () { swal.close(); $('#ddlProduct').focus(); });
    }
    else if (prefixcode == "") {
        swal('Alert', 'Please Enter Prefix Code', 'error').then(function () { swal.close(); $('#txtprefixcode').focus(); });
    }
    else if (vendor == 0) {
        swal('Alert', 'Please select vendor', 'error').then(function () { swal.close(); $('#ddlvendor').focus(); });
    }
    else if (country == 0) {
        swal('Alert', 'Please select country', 'error').then(function () { swal.close(); $('#txtcountry').focus(); });
    }
    else if (state == 0 || state == null) {
        swal('Alert', 'Please enter state', 'error').then(function () { swal.close(); $('#txtstate').focus(); });
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
            country: country,
            state: state,
        }
        $.ajax({
            url: '/Setup/UpdateProductWarehouseRule/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success').then((result) => { location.href = '../productrule'; });
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

function SelectedStateCounty() {
    $("#txtstate").empty();
    var obj = { strValue1: $("#txtcountry").val() }
    $.ajax({
        url: '/Product/SelectedStateData/' + 1,
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var datalog = JSON.parse(data);
            for (var i = 0; i < datalog.length; i++) {
                $("#txtstate").append('<option value="' + datalog[i].State + '" selected>' + datalog[i].StateFullName + '</option>');
            }
        },
        error: function (msg) { alert(msg); },
        async: false
    });


}


$("#txtcountry").change(function () {
    SelectedStateCounty();
});


