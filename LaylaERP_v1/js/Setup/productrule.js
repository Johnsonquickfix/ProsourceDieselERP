﻿getProduct();
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

/*
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
*/

$('#ddlvendor').change(function () {
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
});

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

    if (product == 0) {
        swal('Alert', 'Please select product', 'error').then(function () { swal.close(); $('#ddlProduct').focus(); });
    }
    else if (prefixcode == "") {
        swal('Alert', 'Please enter suffix code', 'error').then(function () { swal.close(); $('#txtprefixcode').focus(); });
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
                    swal('Success', data.message, 'success');
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
    var statearray = $('#txtstate option:selected')
        .toArray().map(item => item.value).join();
    state = statearray;
    //state = $("#txtstate").val();
    warehouse = $("#ddlwarehouse").val();

    if (vendor == 0) {
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
                    swal('Success', data.message, 'success');
                    reset();
                    ProductWarehouseRuleGrid();
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () { $("#loader").hide();},
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
                bAutoWidth: true,
                responsive: true,
                data: JSON.parse(data),
                "columns": [
                    { data: 'id', title: 'Id', sWidth: "10%" },
                    { data: 'product', title: 'Product', sWidth: "20%" },
                    { data: 'code', title: 'Suffix', sWidth: "10%" },
                    { data: 'vendor', title: 'Vendor', sWidth: "10%" },
                    { data: 'warehouse', title: 'Warehouse', sWidth: "10%" },
                    { data: 'state', title: 'State', sWidth: "30%"},
                    { data: 'country', title: 'Country', sWidth: "10%" },
                    {
                        'data': 'id',
                        'sortable': true,
                        'searchable': false,
                        sWidth: "10%",
                        'render': function (id, type, full, meta) {
                            if ($("#hfEdit").val() == "1") {
                                //return '<a href="#" onclick="EditSelect(' + id + ');"><i class="glyphicon glyphicon-pencil"></i></a>';
                                return '<a href="../Setup/Editproductrule/' + id + '" data-toggle="tooltip" title="View/Edit suffix rule" onclick="ActivityLog(\'Edit Suffix Split Logic\',\'/Setup/productrule/' + id +'\');"><i class="glyphicon glyphicon-pencil"></i></a>';
                            }
                            else {
                                return "No permission";
                            }
                        }
                    },
                ],
                "order": [[0, 'desc']],
                columnDefs: [
                    {
                        render: function (data, type, full, meta) {
                            return "<div class='text-wrap'>" + data + "</div>";
                        },
                        targets:5
                    }
                ]
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
                //$("#ddlProduct").val("0").trigger('change');
                //swal('Alert', 'Product already exists in table', 'error').then(function () { swal.close(); $('#ddlProduct').focus(); });
                swal({ title: 'Product already exists?', text: "Want to add this product for more vendors ?", type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#3085d6', confirmButtonText: 'Yes' }).
                    then((result) => {
                        if (result.value) {
                            ReUseProduct(product);
                            $("#details").show(1000);
                            disable1stCol();
                            $('#btnAddProduct').hide();
                        }
                        else {
                            $("#details").hide(1000);
                        }
                    })
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
                swal('Alert', 'Suffix already exists in table', 'error').then(function () { swal.close(); $('#txtprefixcode').focus(); });
            }
        },

        error: function (error) {
            swal('Error!', 'something went wrong', 'error');
        },
    })
});

function ReUseProduct(product) {
    product_id = product;
    var obj = {
        id: product_id,
    }
    jQuery.ajax({
        url: "/Setup/SelectProductToReUse/", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            $('#txtprefixcode').val(data[0].prefix_code);
            $('#hfwarehouserule').val(data[0].rowid);
        },

    });
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