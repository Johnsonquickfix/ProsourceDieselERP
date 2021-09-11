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
                getWarehouse();
                $('#txtcountry').val(data[0].country);
                $('#txtstate').val(data[0].state);
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

function getID() {
    jQuery.ajax({
        url: "/Setup/GetIdProductWarehouserule/", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            $('#hfwarehouserule').val(data[0].id);
            
        },
        
    });
}


function addProductWarehouseRule() {
    prefixcode = $("#txtprefixcode").val();
    product = $("#ddlProduct").val();

    if (prefixcode == "") {
        swal('Alert', 'Please Enter Prefix Code', 'error').then(function () { swal.close(); $('#txtprefixcode').focus(); });
    }
    else if (product == 0) {
        swal('Alert', 'Please Select Product', 'error').then(function () { swal.close(); $('#ddlProduct').focus(); });
    }
   
    
    else {

        var obj = {
            prefix_code: prefixcode,
            product_id: product,
        }
        $.ajax({
            url: '/Setup/AddProductWarehouseRule/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success');
                    getID();
                    disable1stCol();
                    $("#details").show(1000);
                    $('#btnAddProduct').hide();
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

function addProductWarehouseRuleDetails() {
    fkproductrule = $("#hfwarehouserule").val();
    vendor = $("#ddlvendor").val();
    country = $("#txtcountry").val();
    state = $("#txtstate").val();
    warehouse = $("#ddlwarehouse").val();

    if (vendor == 0) {
        swal('Alert', 'Please select vendor', 'error').then(function () { swal.close(); $('#ddlvendor').focus(); });
    }
    else if (warehouse == 0) {
        swal('Alert', 'Please select warehouse', 'error').then(function () { swal.close(); $('#ddlwarehouse').focus(); });
    }

    else {

        var obj = {
            fk_product_rule: fkproductrule,
            fk_vendor: vendor,
            country: country,
            state: state,
            fk_warehouse: warehouse,

        }
        $.ajax({
            url: '/Setup/AddProductWarehouseRuleDetails/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    //$('#parent > input:text').val('');
                    swal('Alert!', data.message, 'success');
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

function reset() {
    $("#txtcountry").val('');
    $("#txtstate").val('');
    $("#ddlwarehouse").val("0").trigger('change');
    $("#ddlvendor").val("0").trigger('change');
    $("#hfid").val("");
}



function resetbtn() {
    $("#txtprefixcode").val('');
    $("#ddlProduct").val("0").trigger('change');
    $("#txtcountry").val('');
    $("#txtstate").val('');
    $("#ddlwarehouse").val("0").trigger('change');
    $("#ddlvendor").val("0").trigger('change');
    $("#hfid").val("");
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
                    { data: 'id', title: 'Id', sWidth: "5%" },
                    { data: 'product', title: 'Product', sWidth: "25%" },
                    { data: 'code', title: 'Prefix', sWidth: "15%" },
                    { data: 'vendor', title: 'Vendor', sWidth: "20%" },
                    { data: 'warehouse', title: 'Warehouse', sWidth: "10%" },
                    {
                        'data': 'id',
                        'sortable': true,
                        'searchable': false,
                        sWidth: "10%",
                        'render': function (id, type, full, meta) {
                            //return '<a href="#" onclick="EditSelect(' + id + ');"><i class="glyphicon glyphicon-pencil"></i></a>';
                            return '<a href="../Setup/Editproductrule/' + id + '"><i class="glyphicon glyphicon-pencil"></i></a>';
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

/*
function EditSelect(id) {
    var obj = { strValue1: id }
    $.ajax({
        url: '/Setup/SelectTableWarehouseRule/',
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            $("#ddlwarehouse").val(jobj[0].warehouseid).trigger('change');
            $("#ddlvendor").val(jobj[0].vendorid).trigger('change');
            $("#txtcountry").val(jobj[0].country);
            $("#txtstate").val(jobj[0].state);
            $("#hfid").val(jobj[0].id);
            $("#hfproductid").val(jobj[0].pid);
            $("#ddlProduct").val(jobj[0].pid).trigger('change');
            $("#txtprefixcode").val(jobj[0].code);
           
            enable2ndCol();
            
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}

function updateProductWarehouseRule() {
    rowid = $("#hfid").val();
    prefixcode = $("#txtprefixcode").val();
    product = $("#ddlProduct").val();
    vendor = $("#ddlvendor").val();
    warehouse = $("#ddlwarehouse").val();
    productid = $("#hfproductid").val();
    
    if (vendor == 0) {
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
                    swal('Alert!', data.message, 'success');
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
*/
function enable1stCol() {
    $("#txtprefixcode").removeAttr('disabled');
    $("#ddlProduct").removeAttr('disabled');
   
}

function disable1stCol() {
    $("#txtprefixcode").attr('disabled', 'disabled');
    $("#ddlProduct").attr('disabled', 'disabled');
}

function enable2ndCol() {
    $("#ddlvendor").removeAttr('disabled');
    $("#txtcountry").removeAttr('disabled');
    $("#txtstate").removeAttr('disabled');
    $("#ddlwarehouse").removeAttr('disabled');
}

function disable2ndCol()
    {
    $("#ddlvendor").attr('disabled', 'disabled');
    $("#txtcountry").attr('disabled', 'disabled');
    $("#txtstate").attr('disabled', 'disabled');
    $("#ddlwarehouse").attr('disabled', 'disabled');
}


$('#ddlProduct').change(function () {
    product = $("#ddlProduct").val();
    var obj = {
        product_id: product,
    }
    $.ajax({
        url: '/Setup/GetProductCount/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == false) {

            }
            else {
                $("#ddlProduct").val("0").trigger('change');
                swal('Alert', 'Product already exists in table', 'error').then(function () { swal.close(); $('#ddlProduct').focus(); });
            }
        },

        error: function (error) {
            swal('Error!', 'something went wrong', 'error');
        },
    })
});


$('#txtprefixcode').change(function () {
    prefix = $("#txtprefixcode").val();
    var obj = {
        prefix_code: prefix,
    }
    $.ajax({
        url: '/Setup/GetPrefixCount/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == false) {

            }
            else {
                $("#txtprefixcode").val("");
                swal('Alert', 'Prefix already exists in table', 'error').then(function () { swal.close(); $('#txtprefixcode').focus(); });
            }
        },

        error: function (error) {
            swal('Error!', 'something went wrong', 'error');
        },
    })
});

