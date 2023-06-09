﻿
GetVendor();
function Addcurrentstock() {
    debugger
    var fk_entrepot = $("#ddlWarehouse").val();
    var fk_product = $("#ddlProduct").val();
    var serial = $("#txtserial").val();
    var eatby = $("#txteatbydate").val();
    var price = $("#txtprice").val();
    var unit = $("#txtunit").val();
    var label = $("#txtlabel").val();
    var vendorid = $("#ddlVendor").val();

    var formattedDate = new Date(eatby);
    var d = formattedDate.getDate();
    //var m = formattedDate.getMonth();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    //m += 1;  // JavaScript months are 0-11
    var y = formattedDate.getFullYear();
    var stockdate = y + "-" + m + "-" + d;

    if (vendorid == 0 || vendorid == null) {
        swal('Alert', 'Please select vendor', 'error').then(function () { swal.close(); $('#ddlVendor').focus(); });
    }
    else if (fk_entrepot == 0 || fk_entrepot == null) {
        swal('Alert', 'Please select warehouse', 'error').then(function () { swal.close(); $('#ddlWarehouse').focus(); });
    }
    else if (fk_product == null || fk_product == 0) {
        swal('Alert', 'Please select product', 'error').then(function () { swal.close(); $('#ddlProduct').focus(); });
    }
    else if (price == "") {
        swal('Alert', 'Please wait until price filled', 'error').then(function () { swal.close(); $('#txtprice').focus(); });
    }
    else if (unit == "") {
        swal('Alert', 'Please Enter Number of Unit', 'error').then(function () { swal.close(); $('#txtunit').focus(); });
    }

    else if (serial == "") {
        swal('Alert', 'Please Enter Lot/Serial Number', 'error').then(function () { swal.close(); $('#txtserial').focus(); });
    }
    else if (eatby == "") {
        swal('Alert', 'Please Enter Stock Correction date', 'error').then(function () { swal.close(); $('#txteatbydate').focus(); });
    }
    //else if (sellby == "") {
    //    swal('Alert', 'Please Enter Sale By Date', 'error').then(function () { swal.close(); $('#txtsalebydate').focus(); });
    //}

    else if (label == "") {
        swal('Alert', 'Please Enter Label of Movement', 'error').then(function () { swal.close(); $('#txtlabel').focus(); });
    }


    else {

        var obj = {

            fk_entrepot: fk_entrepot,
            fk_product: fk_product,
            serial: serial,
            eatby: stockdate,
            value: unit,
            label: label,
            price: price,
            vendor_id: vendorid,
        }
        $.ajax({
            url: '/Warehouse/AddCurrentstock/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            searching: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    //$('#parent > input:text').val('');
                    swal('Alert!', data.message, 'success');
                    //reset();
                    CorrectStockGrid();
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
    $("#txtserial").val("");
    $("#txteatbydate").val("");
    $("#txtprice").val("");
    $("#txtunit").val("");
    $("#txtlabel").val("");
    $("#txtsalebydate").val("");
    //$("#ddlProduct").val("");
    //$('#ddlProduct').val(null).trigger('change');
}

$('#ddlProduct').on('select2:select', function (e) {
    var fk_product = $('#ddlProduct').val();
    var obj = {
        id: fk_product,
    }
    jQuery.ajax({
        url: "/Warehouse/GetProductInfo/", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            $('#txtprice').val(data[0].buy_price);
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });
});


function targetwarehouse() {
    $.get('/Warehouse/Gettargetwarehouse', function (data) {
        var items = "";
        $.each(data, function (index, value) {
            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddltargetwarehouse");
        })
    });
}

//~~~~~~~~~~~~~~~~~~For transfer product~~~~~~~~~~~~~~~~~~~~~~~~
$('#ddltransferProduct').change(function () {
    if ($('#ddltransferProduct').val() == null) return false;
    var fk_product = $("#ddltransferProduct").val();
    var fk_entrepot = $("#hfid").val();
    //var fk_entrepot = $("#hfid").val();
    //alert(fk_product);
    var obj = {
        id: fk_product,
        warehouseid: fk_entrepot,
        productid: fk_product,
    }
    jQuery.ajax({
        url: "/Warehouse/GetProductInfo/", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            $('#hfprice').val(data[0].buy_price);
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });

    jQuery.ajax({
        url: "/Warehouse/GetProductStock/", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            $('#txtstock1').val(data[0].quantity);
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });

    warehousebyproduct();

});


function AddTransferStock() {
    debugger
    var fk_entrepot = $("#hfid").val();
    var fk_entrepottarget = $("#ddltargetwarehouse").val();
    var fk_product = $("#ddltransferProduct").val();
    var price = $("#hfprice").val();
    var value = $("#txttransferunit").val();
    var lotserial = $("#txttransferserial").val();
    var eatbydate = $("#txttransfereatbydate").val();
    //var salebydate = $("#txttransfersalebydate").val();
    var inventorycode = $("#txttransferinvtcode").val();
    var label = $("#txttransferlabel").val();
    var stock1 = $("#txtstock1").val();

    var formattedDate = new Date(eatbydate);
    var d = formattedDate.getDate();
    //var m = formattedDate.getMonth();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    //m += 1;  // JavaScript months are 0-11
    var y = formattedDate.getFullYear();
    var stockdate = y + "-" + m + "-" + d;

    if (fk_product == null || fk_product == 0) {
        swal('Alert', 'Please select product', 'error').then(function () { swal.close(); $('#ddltransferProduct').focus(); });
    }
    else if (fk_entrepottarget == 0) {
        swal('Alert', 'Please select target warehouse', 'error').then(function () { swal.close(); $('#ddltargetwarehouse').focus(); });
    }
    else if (fk_entrepot == fk_entrepottarget) { swal('Alert', 'Please select other warehouse', 'error'); }

    else if (value == "") {
        swal('Alert', 'Please enter number of units', 'error').then(function () { swal.close(); $('#txttransferunit').focus(); });
    }
    else if (parseInt(value) > parseInt(stock1)) {
        swal('Alert', 'Not sufficent stock to transfer ', 'error').then(function () { swal.close(); $('#txttransferunit').focus(); });
    }
    else if (lotserial == "") {
        swal('Alert', 'Please enter Lot/serial number ', 'error').then(function () { swal.close(); $('#txttransferserial').focus(); });
    }
    else if (eatbydate == "") {
        swal('Alert', 'Please enter Stock Transfer date ', 'error').then(function () { swal.close(); $('#txttransfereatbydate').focus(); });
    }
    //else if (salebydate == "") {
    //    swal('Alert', 'Please enter sale by date ', 'error').then(function () { swal.close(); $('#txttransfersalebydate').focus(); });
    //}
    else if (label == "") {
        swal('Alert', 'Please enter label of movement ', 'error').then(function () { swal.close(); $('#txttransferlabel').focus(); });
    }
    else if (inventorycode == "") {
        swal('Alert', 'Please enter movement or inventory code', 'error').then(function () { swal.close(); $('#txttransferinvtcode').focus(); });
    }
    else {
        var obj = {
            fk_entrepot: fk_entrepot,
            fk_entrepottarget: fk_entrepottarget,
            fk_product: fk_product,
            value: value,
            inventorycode: inventorycode,
            label: label,
            price: price,
            eatby: stockdate,
            //sellby: salebydate,
            serial: lotserial,
        }
        $.ajax({
            url: '/Warehouse/AddTransferStock/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    //$('#parent > input:text').val('');
                    //swal('Alert!', data.message, 'success').then((result) => { location.href = 'StockMouvementList'; });
                    swal('Alert!', data.message, 'success');
                    StockTransferGrid();
                    resettransferstock();
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


function CorrectStockGrid() {
    var fk_entrepot = $("#ddlProduct").val();
    var obj = { fk_entrepot: fk_entrepot };
    $.ajax({
        url: '/Warehouse/CurrentStockList',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        data: JSON.stringify(obj),
        success: function (data) {
            $('#dtdata').dataTable({
                //sDom: 'rtip',
                destroy: true,
                data: JSON.parse(data),
                "columns": [
                    { data: 'ref', title: 'Ref', sWidth: "5%" },
                    { data: 'date', title: 'Date', sWidth: "15%", },
                    { data: 'product', title: 'Product', sWidth: "20%" },
                    { data: 'name', title: 'Vendor', sWidth: "15%" },
                    { data: 'warehouse', title: 'Warehouse', sWidth: "15%" },

                    { data: 'label', title: 'Label of movement', sWidth: "15%" },
                    { data: 'value', title: 'Qty', sWidth: "10%" },
                    //{ data: 'price', title: 'Unit Price', sWidth: "10%", },
                    {
                        'data': 'ref',
                        sWidth: "10%",
                        'sortable': false,
                        'searchable': false,
                        'render': function (ref) {
                            //return '<input type="button" onclick="chk_status(this)" data-id="' + ref + '"  id="chk_sts_str" />'
                            //return '< a href = "#" onclick = "chk_status(this)" data-id="' + ref + '" id="chk_sts_str"> <i class="glyphicon glyphicon-pencil"></i></a >'
                            return '<span title="Click Here To Edit Correct Stock Details" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick = "chk_status(this)" data-id="' + ref + '" ;"><i class="glyphicon glyphicon-pencil"></i></a></span>';
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

function chk_status(ele) {

    var row = $(ele).data('id');
    var obj = { strValue1: row }
    $.ajax({
        url: '/Warehouse/GetCurrentStock1/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        //beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            var jobj = JSON.parse(data);
            console.log(jobj[0].label);
            $("#hfstockid").val(jobj[0].rowid);
            $('#txtlabel').val(jobj[0].label);
            $('#ddlVendor').val(jobj[0].vendor_id).trigger('change');
            //$('#ddlProduct').val(jobj[0].fk_product).trigger('change');
            //$("#ddlProduct").append('<option value="' + jobj[0].fk_product + '" selected>' + jobj[0].post_title + '</option>');
            //$("#hfid").val();
            $("#txtserial").val(jobj[0].serial);
            $("#txteatbydate").val(jobj[0].eatby);
            $("#txtprice").val(jobj[0].price);
            $("#txtunit").val(jobj[0].value);
            $("#txtsalebydate").val(jobj[0].sellby);
            $("#txtTransid").val(jobj[0].tran_id);
            setTimeout(function () { $('#ddlWarehouse').val(jobj[0].fk_entrepot).trigger('change'); }, 10000);
            setTimeout(function () { $('#ddlProduct').val(jobj[0].fk_product).trigger('change'); }, 20000);
            $("#btnStock").hide();
            $("#btnStockUpdate").show();
            $("#btnStockCancel").show();

            //getstock();

        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    });
}

/*
function getstock() {
    if ($('#ddlProduct').val() == null) return false;
    var fk_product = $('#ddlProduct').val();
    var fk_entrepot = $("#hfid").val();
    //alert(fk_product);
    var obj = {
        id: fk_product,
        warehouseid: fk_entrepot,
        productid: fk_product,
    }
    jQuery.ajax({
        url: "/Warehouse/GetProductStock/", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            $('#txtstock').val(data[0].quantity);
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });

}

*/


function StockTransferGrid() {
    var fk_entrepot = $("#hfid").val();
    var obj = { fk_entrepot: fk_entrepot };
    $.ajax({
        url: '/Warehouse/GetTransferStock',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        data: JSON.stringify(obj),
        success: function (data) {
            $('#dttransferstock').dataTable({
                //sDom: 'rtip',
                destroy: true,
                data: JSON.parse(data),
                "columns": [
                    { data: 'ref', title: 'Ref', sWidth: "5%" },
                    { data: 'date', title: 'Date', sWidth: "15%", },
                    { data: 'label', title: 'Label of movement', sWidth: "15%" },
                    { data: 'product', title: 'Product', sWidth: "20%" },
                    { data: 'warehouse', title: 'Warehouse', sWidth: "15%" },
                    { data: 'value', title: 'Qty', sWidth: "10%" },
                    //{ data: 'price', title: 'Unit Price', sWidth: "10%", },

                    {
                        'data': 'ref',
                        sWidth: '10%',
                        'sortable': false,
                        'searchable': false,
                        'render': function (ref) {
                            //return '<input type="button" onclick="chk_status(this)" data-id="' + ref + '"  id="chk_sts_str" />'
                            //return '< a href = "#" onclick = "chk_status(this)" data-id="' + ref + '" id="chk_sts_str"> <i class="glyphicon glyphicon-pencil"></i></a >'
                            return '<span title="Click Here To Edit Transfer Stock Details" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick = "transferstockstatus(this)" data-id="' + ref + '" ;"><i class="glyphicon glyphicon-pencil"></i></a></span>';
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

function transferstockstatus(ele) {

    var row = $(ele).data('id');
    var obj = { strValue2: row }
    $.ajax({
        url: '/Warehouse/GetTransferStockDetails/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        //beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            var jobj = JSON.parse(data);
            console.log(jobj[0].label);
            $("#ddltargetwarehouse").val(jobj[0].fk_entrepot);
            //$("#ddltransferProduct").val(jobj[0].fk_product);
            $('#ddltransferProduct').val(jobj[0].fk_product).trigger('change');
            //$("#ddltransferProduct").append('<option value="' + jobj[0].fk_product + '" selected>' + jobj[0].post_title + '</option>');
            $("#hfprice").val(jobj[0].price);
            $("#txttransferunit").val(jobj[0].value);
            $("#txttransferserial").val(jobj[0].serial);
            $("#txttransfereatbydate").val(jobj[0].eatby);
            $("#txttransfersalebydate").val(jobj[0].sellby);
            $("#txttransferinvtcode").val(jobj[0].inventorycode);
            $("#txttransferlabel").val(jobj[0].label);
            $("#hftransferstockid").val(jobj[0].rowid);
            $("#txtTransid1").val(jobj[0].tran_id);
            $("#btnTranferStock").hide();
            $("#btnTransferStockUpdate").show();
            getstock1();
            //getsecondwarehouse();
            //alert(jobj[0].fk_product);
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}


function getstock1() {
    //if ($('#ddltransferProduct').val() == null) return false;
    var fk_product = $('#ddltransferProduct').val();
    var fk_entrepot = $("#hfid").val();
    //alert(fk_product);
    var obj = {
        id: fk_product,
        warehouseid: fk_entrepot,
        productid: fk_product,
    }
    jQuery.ajax({
        url: "/Warehouse/GetProductStock/", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            $('#txtstock1').val(data[0].quantity);


        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });

}

function warehousebyproduct() {
    var fk_product = $('#ddltransferProduct').val();
    var fk_entrepot = $("#hfid").val();
    var obj = {
        productid: fk_product,
        id: fk_entrepot,
    }
    $.ajax({
        url: '/Warehouse/GetWarehouseByProduct/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            $("#ddltargetwarehouse").empty();
            var items = "";
            $.each(data, function (index, value) {
                items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddltargetwarehouse");

            })

        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })

}


function getsecondwarehouse() {
    var tn = $("#txtTransid1").val();
    var objj = { strValue5: tn }
    $.ajax({
        url: '/Warehouse/Getwarehousesbytrans/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(objj),
        dataType: "json",
        //beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            console.log(data);
            var jobjj = JSON.parse(data);
            $('#txtdoc').val(jobjj[0].warehouse_id);

        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    });
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~Update Correct Stock~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function Updatecorrectstock() {
    var fk_entrepot = $("#ddlWarehouse").val();
    var vendorid = $("#ddlVendor").val();
    var tranid = $("#txtTransid").val();
    var rowid = $("#hfstockid").val();
    var fk_product = $("#ddlProduct").val();
    var serial = $("#txtserial").val();
    var eatby = $("#txteatbydate").val();
    var price = $("#txtprice").val();
    var unit = $("#txtunit").val();
    var label = $("#txtlabel").val();
   
    var formattedDate = new Date(eatby);
    var d = formattedDate.getDate();
    //var m = formattedDate.getMonth();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    //m += 1;  // JavaScript months are 0-11
    var y = formattedDate.getFullYear();
    var z = y + "-" + m + "-" + d;
    //var eat =$("#txtDate").val(d + "." + m + "." + y);
    //alert(z);

    if (vendorid == 0 || vendorid == null) {
        swal('Alert', 'Please select vendor', 'error').then(function () { swal.close(); $('#ddlVendor').focus(); });
    }
    else if (fk_entrepot == 0 || fk_entrepot == null) {
        swal('Alert', 'Please select warehouse', 'error').then(function () { swal.close(); $('#ddlWarehouse').focus(); });
    }
    else if (fk_product == null || fk_product == 0) {
        swal('Alert', 'Please select product', 'error').then(function () { swal.close(); $('#ddlProduct').focus(); });
    }
    else if (price == "") {
        swal('Alert', 'Please until price filled', 'error').then(function () { swal.close(); $('#txtprice').focus(); });
    }
    else if (unit == "") {
        swal('Alert', 'Please Enter Number of Unit', 'error').then(function () { swal.close(); $('#txtunit').focus(); });
    }

    //else if (parseInt(unit) > parseInt(stock)) {
    //    swal('Alert', 'Not sufficent stock ', 'error').then(function () { swal.close(); $('#txtunit').focus(); });
    //}

    else if (serial == "") {
        swal('Alert', 'Please Enter Lot/Serial Number', 'error').then(function () { swal.close(); $('#txtserial').focus(); });
    }
    else if (eatby == "") {
        swal('Alert', 'Please Enter stock correction date', 'error').then(function () { swal.close(); $('#txteatbydate').focus(); });
    }
    //else if (sellby == "") {
    //    swal('Alert', 'Please Enter Sale By Date', 'error').then(function () { swal.close(); $('#txtsalebydate').focus(); });
    //}
    else if (label == "") {
        swal('Alert', 'Please Enter Label of Movement', 'error').then(function () { swal.close(); $('#txtlabel').focus(); });
    }

    else {

        var obj = {

            fk_entrepot: fk_entrepot,
            searchtransid: tranid,
            searchid: rowid,
            fk_product: fk_product,
            serial: serial,
            eatby: z,
            value: unit,
            label: label,
            price: price,
            vendor_id: vendorid,
        }
        $.ajax({
            url: '/Warehouse/UpdateCorrectstock/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            searching: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    //$('#parent > input:text').val('');
                    swal('Alert!', data.message, 'success');
                    reset();
                    CorrectStockGrid();
                    $("#btnStock").show();
                    $("#btnStockUpdate").hide();
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
//~~~~~~~~~~~~~~~~~~~~~~~~~~End Update Correct Stock~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function UpdateTransferStock() {
    debugger
    var secondwarehouse = $('#txtsecondwarehouse').val();
    var fk_entrepot = $("#hfid").val();
    var rowid = $("#hftransferstockid").val();
    var fk_entrepottarget = $("#ddltargetwarehouse").val();
    var fk_product = $("#ddltransferProduct").val();
    var price = $("#hfprice").val();
    var value = $("#txttransferunit").val();
    var lotserial = $("#txttransferserial").val();
    var eatbydate = $("#txttransfereatbydate").val();
    //var salebydate = $("#txttransfersalebydate").val();
    var inventorycode = $("#txttransferinvtcode").val();
    var label = $("#txttransferlabel").val();
    var tn = $("#txtTransid1").val();
    var stock1 = $("#txtstock1").val();

    var formattedDate = new Date(eatbydate);
    var d = formattedDate.getDate();
    //var m = formattedDate.getMonth();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    //m += 1;  // JavaScript months are 0-11
    var y = formattedDate.getFullYear();
    var stockdate = y + "-" + m + "-" + d;


    if (fk_product == null || fk_product == 0) {
        swal('Alert', 'Please select product', 'error').then(function () { swal.close(); $('#ddltransferProduct').focus(); });
    }
    else if (fk_entrepottarget == 0) {
        swal('Alert', 'Please select target warehouse', 'error').then(function () { swal.close(); $('#ddltargetwarehouse').focus(); });
    }
    else if (fk_entrepot == fk_entrepottarget) { swal('Alert', 'Please select other warehouse', 'error'); }

    else if (value == "") {
        swal('Alert', 'Please enter number of units', 'error').then(function () { swal.close(); $('#txttransferunit').focus(); });
    }

    else if (parseInt(value) > parseInt(stock1)) {
        swal('Alert', 'Not sufficent stock to transfer ', 'error').then(function () { swal.close(); $('#txttransferunit').focus(); });
    }

    else if (lotserial == "") {
        swal('Alert', 'Please enter Lot/serial number ', 'error').then(function () { swal.close(); $('#txttransferserial').focus(); });
    }
    else if (eatbydate == "") {
        swal('Alert', 'Please enter stock transfer date ', 'error').then(function () { swal.close(); $('#txttransfereatbydate').focus(); });
    }
    //else if (salebydate == "") {
    //    swal('Alert', 'Please enter sale by date ', 'error').then(function () { swal.close(); $('#txttransfersalebydate').focus(); });
    //}
    else if (label == "") {
        swal('Alert', 'Please enter label of movement ', 'error').then(function () { swal.close(); $('#txttransferlabel').focus(); });
    }
    else if (inventorycode == "") {
        swal('Alert', 'Please enter movement or inventory code', 'error').then(function () { swal.close(); $('#txttransferinvtcode').focus(); });
    }
    else {
        var obj = {
            fk_entrepot: fk_entrepot,
            secondwarehouse: secondwarehouse,
            searchtransferid: rowid,
            fk_entrepottarget: fk_entrepottarget,
            fk_product: fk_product,
            value: value,
            inventorycode: inventorycode,
            label: label,
            price: price,
            eatby: stockdate,
            //sellby: salebydate,
            serial: lotserial,
            transfertranscationid: tn,
        }
        $.ajax({
            url: '/Warehouse/UpdateTranferstock/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    //$('#parent > input:text').val('');
                    //swal('Alert!', data.message, 'success').then((result) => { location.href = 'StockMouvementList'; });
                    swal('Alert!', data.message, 'success');
                    StockTransferGrid();
                    resettransferstock();
                    $("#btnTranferStock").show();
                    $("#btnTransferStockUpdate").hide();


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


function resettransferstock() {
    $("#ddltargetwarehouse").val("0");
    //$("#ddltransferProduct").val("0");
    $("#txttransferunit").val("");
    $("#txttransferserial").val("");
    $("#txttransfereatbydate").val("");
    $("#txttransfersalebydate").val("");
    $("#txttransferinvtcode").val("");
    $("#txttransferlabel").val("");
    $("#txtstock1").val("");
    $('#ddltransferProduct').val(null).trigger('change');

}

function productbywarehouse() {
    var warehouseid = $('#ddlVendor').val();
    var obj = {
        warehouseid: warehouseid,
    }
    $.ajax({
        url: '/Warehouse/GetProductForWarehouse/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            var items = "";
            $.each(data, function (index, value) {
                items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddltransferProduct");
                items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlProduct");
                items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlDamageProduct");
            })

        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })

}

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
                        'render': function (reg_price) {
                            return '$' + reg_price;
                        }
                    },
                    {
                        data: 'sale_price', title: 'Sale Price', sWidth: "25%",
                        'render': function (sale_price) {
                            return '$' + sale_price;
                        }
                    },
                    {
                        data: 'buy_price', title: 'Buying price', sWidth: "25%",
                        'render': function (buy_price) {
                            return '$' + buy_price;
                        }
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

//----------------Damage Stock Portion------------------
function AddDamagestock() {
    var vendorid = $("#ddlVendorDamage").val();
    var fk_entrepot = $("#ddlWarehouseDamage").val();
    var fk_product = $("#ddlDamageProduct").val();
    var serial = $("#txtdamageserial").val();
    var eatby = $("#txtdamageeatbydate").val();
    var price = $("#txtdamageprice").val();
    var unit = $("#txtdamageunit").val();
    var label = $("#txtdamagelabel").val();


    var formattedDate = new Date(eatby);
    var d = formattedDate.getDate();
    //var m = formattedDate.getMonth();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    //m += 1;  // JavaScript months are 0-11
    var y = formattedDate.getFullYear();
    var stockdate = y + "-" + m + "-" + d;

    if (vendorid == 0 || vendorid == null) {
        swal('Alert', 'Please select vendor', 'error').then(function () { swal.close(); $('#ddlVendorDamage').focus(); });
    }
    else if (fk_entrepot == 0 || fk_entrepot == null) {
        swal('Alert', 'Please select warehouse', 'error').then(function () { swal.close(); $('#ddlWarehouseDamage').focus(); });
    }
    else if (fk_product == null || fk_product == 0) {
        swal('Alert', 'Please select product', 'error').then(function () { swal.close(); $('#ddlDamageProduct').focus(); });
    }
    else if (price == "") {
        swal('Alert', 'Please wait until price filled', 'error').then(function () { swal.close(); $('#txtdamageprice').focus(); });
    }
    else if (unit == "") {
        swal('Alert', 'Please Enter Number of Unit', 'error').then(function () { swal.close(); $('#txtdamageunit').focus(); });
    }

    else if (serial == "") {
        swal('Alert', 'Please Enter Lot/Serial Number', 'error').then(function () { swal.close(); $('#txtdamageserial').focus(); });
    }
    else if (eatby == "") {
        swal('Alert', 'Please Enter date', 'error').then(function () { swal.close(); $('#txtdamageeatbydate').focus(); });
    }

    else if (label == "") {
        swal('Alert', 'Please Enter Label of Movement', 'error').then(function () { swal.close(); $('#txtdamagelabel').focus(); });
    }


    else {

        var obj = {
            vendor_id: vendorid,
            fk_entrepot: fk_entrepot,
            fk_product: fk_product,
            serial: serial,
            eatby: stockdate,
            value: unit,
            label: label,
            price: price,

        }
        $.ajax({
            url: '/Warehouse/AddDamagestock/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            searching: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    //$('#parent > input:text').val('');
                    swal('Alert!', data.message, 'success');
                    reset();
                    StockDamageGrid();
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

StockDamageGrid();
function StockDamageGrid() {
    var fk_entrepot = $("#ddlVendor").val();
    var obj = { fk_entrepot: fk_entrepot };
    $.ajax({
        url: '/Warehouse/GetDamageStock',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        data: JSON.stringify(obj),
        success: function (data) {
            $('#dtdamagestock').dataTable({
                //sDom: 'rtip',
                destroy: true,
                data: JSON.parse(data),
                "columns": [
                    { data: 'ref', title: 'Ref', sWidth: "5%" },
                    { data: 'date', title: 'Date', sWidth: "15%", },
                    { data: 'product', title: 'Product', sWidth: "20%" },
                    { data: 'name', title: 'Vendor', sWidth: "15%" },
                    { data: 'warehouse', title: 'Warehouse', sWidth: "15%" },
                    { data: 'label', title: 'Label of movement', sWidth: "15%" },
                    { data: 'value', title: 'Qty', sWidth: "10%" },
                    {
                        'data': 'ref',
                        'sortable': false,
                        'searchable': false,
                        sWidth: "10%",
                        'render': function (ref, type, full, meta) {
                            return '<span title="Click Here To Edit Damage Stock Details" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="EditSelect(' + ref + ');"><i class="glyphicon glyphicon-pencil"></i></a></span>';
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


function EditSelect(ref) {
    var obj = { strValue1: ref }
    $.ajax({
        url: '/Warehouse/SelectDamageStock/',
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            console.log(jobj[0].label);
            $("#hfdamagestockid").val(jobj[0].rowid);
            $('#txtdamagelabel').val(jobj[0].label);
            $('#ddlVendorDamage').val(jobj[0].vendor_id).trigger('change');
            setTimeout(function () { $('#ddlWarehouseDamage').val(jobj[0].fk_entrepot).trigger('change'); }, 7000);
            setTimeout(function () { $('#ddlDamageProduct').val(jobj[0].fk_product).trigger('change'); }, 15000);
            $("#txtdamageserial").val(jobj[0].serial);
            $("#txtdamageeatbydate").val(jobj[0].eatby);
            $("#txtdamageprice").val(jobj[0].price);
            $("#txtdamageunit").val(jobj[0].value);
            $("#hfdamagetransid").val(jobj[0].tran_id);
            $("#btnDamageStock").hide();
            $("#btnDamageStockUpdate").show();
            $("#btnDamageStockCancel").show();

        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}


function Updatedamagestock() {

    var fk_entrepot = $("#ddlWarehouseDamage").val();
    var tranid = $("#hfdamagetransid").val();
    var rowid = $("#hfdamagestockid").val();
    var fk_product = $("#ddlDamageProduct").val();
    var serial = $("#txtdamageserial").val();
    var eatby = $("#txtdamageeatbydate").val();
    var price = $("#txtdamageprice").val();
    var unit = $("#txtdamageunit").val();
    var label = $("#txtdamagelabel").val();
    var vendorid = $("#ddlVendorDamage").val();

    var formattedDate = new Date(eatby);
    var d = formattedDate.getDate();
    //var m = formattedDate.getMonth();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    //m += 1;  // JavaScript months are 0-11
    var y = formattedDate.getFullYear();
    var z = y + "-" + m + "-" + d;
    //var eat =$("#txtDate").val(d + "." + m + "." + y);
    //alert(z);


    if (vendorid == 0 || vendorid == null) {
        swal('Alert', 'Please select vendor', 'error').then(function () { swal.close(); $('#ddlVendorDamage').focus(); });
    }
    else if (fk_entrepot == 0 || fk_entrepot == null) {
        swal('Alert', 'Please select warehouse', 'error').then(function () { swal.close(); $('#ddlWarehouseDamage').focus(); });
    }
    else if (fk_product == null || fk_product == 0) {
        swal('Alert', 'Please select product', 'error').then(function () { swal.close(); $('#ddlDamageProduct').focus(); });
    }
    else if (price == "") {
        swal('Alert', 'Please wait to filled price', 'error').then(function () { swal.close(); $('#txtdamageprice').focus(); });
    }

    else if (unit == "") {
        swal('Alert', 'Please Enter Number of Unit', 'error').then(function () { swal.close(); $('#txtdamageunit').focus(); });
    }

    else if (serial == "") {
        swal('Alert', 'Please Enter Lot/Serial Number', 'error').then(function () { swal.close(); $('#txtdamageserial').focus(); });
    }
    else if (eatby == "") {
        swal('Alert', 'Please Enter stock correction date', 'error').then(function () { swal.close(); $('#txtdamageeatbydate').focus(); });
    }

    else if (label == "") {
        swal('Alert', 'Please Enter Label of Movement', 'error').then(function () { swal.close(); $('#txtdamagelabel').focus(); });
    }

    else {

        var obj = {

            fk_entrepot: fk_entrepot,
            searchtransid: tranid,
            searchid: rowid,
            fk_product: fk_product,
            serial: serial,
            eatby: z,
            value: unit,
            label: label,
            price: price,
            vendor_id: vendorid,
        }
        $.ajax({
            url: '/Warehouse/UpdateDamagestock/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            searching: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    //$('#parent > input:text').val('');
                    swal('Alert!', data.message, 'success');
                    StockDamageGrid();
                    resetdamagestock();
                    $("#btnDamageStock").show();
                    $("#btnDamageStockUpdate").hide();
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

function resetdamagestock() {
    $("#hfdamagestockid").val('');
    $('#txtdamagelabel').val('');
    $('#ddlDamageProduct').val(null).trigger('change');
    $("#txtdamageserial").val('');
    $("#txtdamageeatbydate").val('');
    $("#txtdamageprice").val('');
    $("#txtdamageunit").val('');
    $("#hfdamagetransid").val('');
}

$('#ddlDamageProduct').change(function () {
    debugger
    if ($('#ddlDamageProduct').val() == null) return false;
    var fk_product = $('#ddlDamageProduct').val();
    var obj = {
        id: fk_product,
    }
    jQuery.ajax({
        url: "/Warehouse/GetProductInfo/", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            $('#txtdamageprice').val(data[0].buy_price);
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });
});

GetDamageVendor();
function GetDamageVendor() {
    $.ajax({
        url: "/Warehouse/GetVendor",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please Select Vendor</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlVendorDamage').html(opt);
        }

    });
}

GetDamageWarehouseByVendor();
function GetDamageWarehouseByVendor() {
    $('#ddlVendorDamage').change(function () {
        var empcode = $('#ddlVendorDamage').val();
        var obj = {
            rowid: empcode,
        }
        jQuery.ajax({
            url: "/Warehouse/GetWarehouserByVendor/", dataType: 'json', type: "Post",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            success: function (data) {
                var opt = '<option value="0">Please Select Warehouse </option>';
                for (var i = 0; i < data.length; i++) {
                    opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>'
                }
                $("#ddlWarehouseDamage").html(opt);
            },
            error: function (msg) {

            }
        });
    });
}

GetDamageProductByWarehouse();
function GetDamageProductByWarehouse() {
    $('#ddlWarehouseDamage').change(function () {
        var warehouseid = $('#ddlWarehouseDamage').val();
        var obj = {
            warehouseid: warehouseid,
        }
        jQuery.ajax({
            url: "/Warehouse/GetProductForWarehouse/", dataType: 'json', type: "Post",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            success: function (data) {
                var items = '';
                $.each(data, function (index, value) {
                    //items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddltransferProduct");
                    items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlDamageProduct");
                    //items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlDamageProduct");
                })
            },
            error: function (msg) {

            }
        });
    });
}
//------------------------Damage End--------------------
function GetVendor() {
    $.ajax({
        url: "/Warehouse/GetVendor",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please Select Vendor</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlVendor').html(opt);
        }

    });
}

GetWarehouseByVendor();
function GetWarehouseByVendor() {
    $('#ddlVendor').change(function () {
        var empcode = $('#ddlVendor').val();
        var obj = {
            rowid: empcode,
        }
        jQuery.ajax({
            url: "/Warehouse/GetWarehouserByVendor/", dataType: 'json', type: "Post",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            success: function (data) {
                var opt = '<option value="0">Please Select Warehouse </option>';
                for (var i = 0; i < data.length; i++) {
                    opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>'
                }
                $("#ddlWarehouse").html(opt);
            },
            error: function (msg) {

            }
        });
    });
}

/*
function productbywarehouse() {
    var warehouseid = $('#ddlVendor').val();
    var obj = {
        warehouseid: warehouseid,
    }
    $.ajax({
        url: '/Warehouse/GetProductForWarehouse/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            var items = "";
            $.each(data, function (index, value) {
                items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddltransferProduct");
                items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlProduct");
                items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlDamageProduct");
            })

        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })

}*/

GetProductByWarehouse();
function GetProductByWarehouse() {
    $('#ddlWarehouse').change(function() {
        var warehouseid = $('#ddlWarehouse').val();
        var obj = {
            warehouseid: warehouseid,
        }
        jQuery.ajax({
            url: "/Warehouse/GetProductForWarehouse/", dataType: 'json', type: "Post",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            success: function (data) {
                var items = "";
                $.each(data, function (index, value) {
                    //items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddltransferProduct");
                    items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlProduct");
                    //items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlDamageProduct");
                })
            },
            error: function (msg) {

            }
        });
    });
}
