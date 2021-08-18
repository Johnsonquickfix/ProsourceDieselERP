productbywarehouse();
ProductWarehouseGrid();

function Addcurrentstock() {
    debugger
    var fk_entrepot = $("#hfid").val();
    var fk_product = $("#ddlProduct").val();
    var serial = $("#txtserial").val();
    var eatby = $("#txteatbydate").val();
    var price = $("#txtprice").val();
    var unit = $("#txtunit").val();
    var label = $("#txtlabel").val();
    var sellby = $("#txtsalebydate").val();

    if (fk_product == 0) {
        swal('Alert', 'Please select product', 'error').then(function () { swal.close(); $('#ddlProduct').focus(); });
    }
    else if (price == "") {
        swal('Alert', 'Please Enter Price', 'error').then(function () { swal.close(); $('#txtprice').focus(); });
    }
    else if (unit == "") {
        swal('Alert', 'Please Enter Number of Unit', 'error').then(function () { swal.close(); $('#txtunit').focus(); });
    }
    else if (serial == "") {
        swal('Alert', 'Please Enter Lot/Serial Number', 'error').then(function () { swal.close(); $('#txtserial').focus(); });
    }
    else if (eatby == "") {
        swal('Alert', 'Please Enter Eat By date', 'error').then(function () { swal.close(); $('#txteatbydate').focus(); });
    }
    else if (sellby == "") {
        swal('Alert', 'Please Enter Sale By Date', 'error').then(function () { swal.close(); $('#txtsalebydate').focus(); });
    }

    else if (label == "") {
        swal('Alert', 'Please Enter Label of Movement', 'error').then(function () { swal.close(); $('#txtlabel').focus(); });
    }
   
   
    else {

        var obj = {

            fk_entrepot: fk_entrepot,
            fk_product: fk_product,
            serial: serial,
            eatby: eatby,
            value: unit,
            label: label,
            price: price,
            sellby: sellby,
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
                    reset();
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
    $("#ddlProduct").val("0");
}



function AddWarehouseinfo() {
    debugger
    //Additional info
    rowid = $("#hfid").val();
    corphone = $("#txtCorContact").val();
    coraddress = $("#txtCorAddress").val();
    coraddress1 = $("#txtCorAddress1").val();
    corcity = $("#txtCorCity").val();
    corstate = $("#txtCorState").val();
    corzip = $("#txtCorZipCode").val();
    corcountry = $("#txtCorCountry").val();
    publicnote = $("#txtpublic").val();
    privatenote = $("#txtprivate").val();

    var obj = {
        rowid: rowid,
        cor_phone: corphone,
        cor_address: coraddress,
        cor_address1: coraddress1,
        cor_city: corcity,
        cor_state: corstate,
        cor_zip: corzip,
        cor_country: corcountry,
        note_public: publicnote,
        note_private: privatenote,

    }
    $.ajax({
        url: '/Warehouse/Updatewarehousesinfo/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            if (data.status == true) {
                //$('#parent > input:text').val('');
                swal('Alert!', data.message, 'success');
            }
            else {
                swal('Alert!', data.message, 'error');
            }
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })

}

function AddWarehouse() {
    debugger
    rowid = $("#hfid").val();
    ref = $("#txtref").val();
    lieu = $("#txtShortNameLocation").val();
    description = $("#txtDescription").val();
    address = $("#txtAddress").val();
    zip = $("#txtZipCode").val();
    town = $("#txtState").val();
    country = $("#txtCountry").val();
    phone = $("#txtPhone").val();
    fax = $("#txtFax").val();
    //statut = $("#status").val();
    address1 = $("#txtAddress1").val();
    city = $("#txtCity").val();
    warehousetype = $("#warehousetype").val();
    status = $("#chkwarehousestatus").prop("checked") ? 1 : 0;
    //Additional info
    //corphone = $("#txtCorContact").val();
    //coraddress = $("#txtCorAddress").val();
    //coraddress1 = $("#txtCorAddress1").val();
    //corcity = $("#txtCorCity").val();
    //corstate = $("#txtCorState").val();
    //corzip = $("#txtCorZipCode").val();
    //corcountry = $("#txtCorCountry").val();
    //publicnote = $("#txtpublic").val();
    //privatenote = $("#txtprivate").val();

    email = $("#txtEmail").val();

    if (ref == "") {
        swal('Alert', 'Please Enter Reference Name', 'error').then(function () { swal.close(); $('#txtref').focus(); });
    }
    else if (lieu == "") {
        swal('Alert', 'Please Enter Short Name Location', 'error').then(function () { swal.close(); $('#txtShortNameLocation').focus(); });
    }
    else if (phone == "") {
        swal('Alert', 'Please Enter Contact Number', 'error').then(function () { swal.close(); $('#txtPhone').focus(); });
    }
    else if (address == "") {
        swal('Alert', 'Please Enter Address', 'error').then(function () { swal.close(); $('#txtAddress').focus(); });
    }
    else if (city == "") {
        swal('Alert', 'Please Enter City', 'error').then(function () { swal.close(); $('#txtCity').focus(); });
    }
    else if (zip == "") {
        swal('Alert', 'Please Enter Zip Code', 'error').then(function () { swal.close(); $('#txtZipCode').focus(); });
    }

    else {

        var obj = {
            rowid: rowid,
            reff: ref,
            lieu: lieu,
            description: description,
            address: address,
            zip: zip,
            town: town,
            country: country,
            phone: phone,
            fax: fax,
            //statut: statut,
            address1: address1,
            city: city,
            status: status,
            warehouse_type: warehousetype,
            //cor_phone: corphone,
            //cor_address: coraddress,
            //cor_address1: coraddress1,
            //cor_city: corcity,
            //cor_state: corstate,
            //cor_zip: corzip,
            //cor_country: corcountry,
            //note_public: publicnote,
            //note_private: privatenote,
            email: email,
        }
        $.ajax({
            url: '/Warehouse/Updatewarehouses/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    //$('#parent > input:text').val('');
                    swal('Alert!', data.message, 'success').then((result) => { location.href = 'Warehouse'; });
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



$.get('/Warehouse/Gettargetwarehouse', function (data) {
    var items = "";
    $.each(data, function (index, value) {
        items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddltargetwarehouse");
    })
});

//    $.get('/Warehouse/GetProductForWarehouse', function (data) {
//        var items = "";
//        alert('hello');
//        $.each(data, function (index, value) {
//            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddltransferProduct");
//      })
//});

$('#ddltransferProduct').change(function () {
    var fk_product = $("#ddltransferProduct").val();
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
            $('#hfprice').val(data[0].sale_price);
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });
});

$('#ddlProduct').change(function () {
    var fk_product = $("#ddlProduct").val();
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
            $('#txtprice').val(data[0].sale_price);
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });
});

//function productbywarehouse() {
//    var fk_product = $("#hfid").val();
//    var obj = {
//        warehouseid: fk_product
//    }
//    $.ajax({
//        url: '/Warehouse/GetProduct/', dataType: 'json', type: 'Post',
//        contentType: "application/json; charset=utf-8",
//        data: JSON.stringify(obj),
//        dataType: "json",
//        beforeSend: function () { $("#loader").show(); },
//        success: function (data) {
//            var jobj = JSON.parse(data);
//            console.log(jobj[0].sale_price);
//            $('#hfprice').val(jobj[0].sale_price);
//        },
//        complete: function () { $("#loader").hide(); },
//        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
//    })

//}

/*
function productbywarehouse() {
    var warehouseid = $("#hfid").val();
    var obj = { warehouseid: warehouseid }
    jQuery.ajax({
        url: "/Warehouse/GetProductForWarehouse/", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            $('#txtprice').val(data[0].sale_price);
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });
}
*/
function AddTransferStock() {
    debugger
    var fk_entrepot = $("#hfid").val();
    var fk_entrepottarget = $("#ddltargetwarehouse").val();
    var fk_product = $("#ddltransferProduct").val();
    var price = $("#hfprice").val();
    var value = $("#txttransferunit").val();
    var lotserial = $("#txttransferserial").val();
    var eatbydate = $("#txttransfereatbydate").val();
    var salebydate = $("#txttransfersalebydate").val();
    var inventorycode = $("#txttransferinvtcode").val();
    var label = $("#txttransferlabel").val();

    if (fk_product == 0) {
        swal('Alert', 'Please select product', 'error').then(function () { swal.close(); $('#ddltransferProduct').focus(); });
    }
    else if (fk_entrepottarget == 0) {
        swal('Alert', 'Please select target warehouse', 'error').then(function () { swal.close(); $('#ddltargetwarehouse').focus(); });
    }
    else if (fk_entrepot == fk_entrepottarget) { swal('Alert', 'Please select other warehouse', 'error'); }

    else if (value == "") {
        swal('Alert', 'Please enter number of units', 'error').then(function () { swal.close(); $('#txttransferunit').focus(); });
    }

    else if (lotserial == "") {
        swal('Alert', 'Please enter Lot/serial number ', 'error').then(function () { swal.close(); $('#txttransferserial').focus(); });
    }
    else if (eatbydate == "") {
        swal('Alert', 'Please enter eat by date ', 'error').then(function () { swal.close(); $('#txttransfereatbydate').focus(); });
    }
    else if (salebydate == "") {
        swal('Alert', 'Please enter sale by date ', 'error').then(function () { swal.close(); $('#txttransfersalebydate').focus(); });
    }
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
            eatby: eatbydate,
            sellby: salebydate,
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
    var fk_entrepot = $("#hfid").val();
    var obj = { fk_entrepot: fk_entrepot };
    $.ajax({
        url: '/Warehouse/GetCurrentStock',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        data: JSON.stringify(obj),
        success: function (data) {
            $('#dtdata').dataTable({
                sDom: 'rtip',
                destroy: true,
                data: JSON.parse(data),
                "columns": [
                    { data: 'ref', title: 'Ref', sWidth: "5%" },
                    { data: 'date', title: 'Date', sWidth: "15%", },
                    { data: 'product', title: 'Product', sWidth: "20%" },
                    { data: 'warehouse', title: 'Warehouse', sWidth: "15%" },

                    { data: 'label', title: 'Label of movement', sWidth: "15%" },
                    { data: 'value', title: 'Qty', sWidth: "10%" },
                    { data: 'price', title: 'Unit Price', sWidth: "10%", },
                    {
                        'data': 'ref',
                        'sortable': false,
                        'searchable': false,
                        'render': function (ref) {
                            //return '<input type="button" onclick="chk_status(this)" data-id="' + ref + '"  id="chk_sts_str" />'
                            //return '< a href = "#" onclick = "chk_status(this)" data-id="' + ref + '" id="chk_sts_str"> <i class="glyphicon glyphicon-pencil"></i></a >'
                            return '<a href="#" onclick = "chk_status(this)" data-id="' + ref + '" ;"><i class="glyphicon glyphicon-pencil"></i></a>';
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
            $('#ddlProduct').val(jobj[0].fk_product);
            //$("#hfid").val();
            $("#txtserial").val(jobj[0].serial);
            $("#txteatbydate").val(jobj[0].eatby);
            $("#txtprice").val(jobj[0].price);
            $("#txtunit").val(jobj[0].value);
            $("#txtsalebydate").val(jobj[0].sellby);

            $("#btnStock").hide();
            $("#btnStockUpdate").show();
            $("#btnStockCancel").show();

        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}



function StockTransferGrid() {
    var fk_entrepot = $("#hfid").val();
    var obj = { fk_entrepot: fk_entrepot };
    $.ajax({
        url: '/Warehouse/GetCurrentStock',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        data: JSON.stringify(obj),
        success: function (data) {
            $('#dttransferstock').dataTable({
                sDom: 'rtip',
                destroy: true,
                data: JSON.parse(data),
                "columns": [
                    { data: 'ref', title: 'Ref', sWidth: "5%" },
                    { data: 'date', title: 'Date', sWidth: "15%", },
                    { data: 'product', title: 'Product', sWidth: "20%" },
                    { data: 'warehouse', title: 'Warehouse', sWidth: "15%" },
                    { data: 'label', title: 'Label of movement', sWidth: "15%" },
                    { data: 'value', title: 'Qty', sWidth: "10%" },
                    { data: 'price', title: 'Unit Price', sWidth: "10%", },
                    //{
                    //    'data': 'ref',
                    //    'sortable': false,
                    //    'searchable': false,
                    //    'render': function (ref) {
                    //        //return '<input type="button" onclick="chk_status(this)" data-id="' + ref + '"  id="chk_sts_str" />'
                    //        //return '< a href = "#" onclick = "chk_status(this)" data-id="' + ref + '" id="chk_sts_str"> <i class="glyphicon glyphicon-pencil"></i></a >'
                    //        return '<a href="#" onclick = "transferstockstatus(this)" data-id="' + ref + '" ;"><i class="glyphicon glyphicon-pencil"></i></a>';
                    //    }
                    //},
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
            $("#ddltargetwarehouse").val(jobj[0].fk_entrepot);
            $("#ddltransferProduct").val(jobj[0].fk_product);
            $("#hfprice").val(jobj[0].price);
            $("#txttransferunit").val(jobj[0].value);
            $("#txttransferserial").val(jobj[0].serial);
            $("#txttransfereatbydate").val(jobj[0].eatby);
            $("#txttransfersalebydate").val(jobj[0].sellby);
            $("#txttransferinvtcode").val(jobj[0].inventorycode);
            $("#txttransferlabel").val(jobj[0].label);
            $("#hftransferstockid").val(jobj[0].rowid);

            $("#btnTranferStock").hide();
            $("#btnTransferStockUpdate").show();
            //$("#btnStockCancel").show();

        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}



function Updatecorrectstock() {
    debugger
    //var fk_entrepot = $("#hfid").val();
    var rowid = $("#hfstockid").val();
    var fk_product = $("#ddlProduct").val();
    var serial = $("#txtserial").val();
    var eatby = $("#txteatbydate").val();
    var price = $("#txtprice").val();
    var unit = $("#txtunit").val();
    var label = $("#txtlabel").val();
    var sellby = $("#txtsalebydate").val();

    if (fk_product == 0) {
        swal('Alert', 'Please select product', 'error').then(function () { swal.close(); $('#ddlProduct').focus(); });
    }
    else if (price == "") {
        swal('Alert', 'Please Enter Price', 'error').then(function () { swal.close(); $('#txtprice').focus(); });
    }
    else if (unit == "") {
        swal('Alert', 'Please Enter Number of Unit', 'error').then(function () { swal.close(); $('#txtunit').focus(); });
    }
    else if (serial == "") {
        swal('Alert', 'Please Enter Lot/Serial Number', 'error').then(function () { swal.close(); $('#txtserial').focus(); });
    }
    else if (eatby == "") {
        swal('Alert', 'Please Enter Eat By date', 'error').then(function () { swal.close(); $('#txteatbydate').focus(); });
    }
    else if (sellby == "") {
        swal('Alert', 'Please Enter Sale By Date', 'error').then(function () { swal.close(); $('#txtsalebydate').focus(); });
    }
    else if (label == "") {
        swal('Alert', 'Please Enter Label of Movement', 'error').then(function () { swal.close(); $('#txtlabel').focus(); });
    }

    else {

        var obj = {
            //fk_entrepot: fk_entrepot,
            searchid: rowid,
            fk_product: fk_product,
            serial: serial,
            eatby: eatby,
            value: unit,
            label: label,
            price: price,
            sellby: sellby,
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


function UpdateTransferStock() {
    debugger
    //var fk_entrepot = $("#hfid").val();
    var rowid = $("#hftransferstockid").val();
    var fk_entrepottarget = $("#ddltargetwarehouse").val();
    var fk_product = $("#ddltransferProduct").val();
    var price = $("#hfprice").val();
    var value = $("#txttransferunit").val();
    var lotserial = $("#txttransferserial").val();
    var eatbydate = $("#txttransfereatbydate").val();
    var salebydate = $("#txttransfersalebydate").val();
    var inventorycode = $("#txttransferinvtcode").val();
    var label = $("#txttransferlabel").val();

    if (fk_product == 0) {
        swal('Alert', 'Please select product', 'error').then(function () { swal.close(); $('#ddltransferProduct').focus(); });
    }
    else if (fk_entrepottarget == 0) {
        swal('Alert', 'Please select target warehouse', 'error').then(function () { swal.close(); $('#ddltargetwarehouse').focus(); });
    }
    //else if (fk_entrepot == fk_entrepottarget) { swal('Alert', 'Please select other warehouse', 'error'); }

    else if (value == "") {
        swal('Alert', 'Please enter number of units', 'error').then(function () { swal.close(); $('#txttransferunit').focus(); });
    }

    else if (lotserial == "") {
        swal('Alert', 'Please enter Lot/serial number ', 'error').then(function () { swal.close(); $('#txttransferserial').focus(); });
    }
    else if (eatbydate == "") {
        swal('Alert', 'Please enter eat by date ', 'error').then(function () { swal.close(); $('#txttransfereatbydate').focus(); });
    }
    else if (salebydate == "") {
        swal('Alert', 'Please enter sale by date ', 'error').then(function () { swal.close(); $('#txttransfersalebydate').focus(); });
    }
    else if (label == "") {
        swal('Alert', 'Please enter label of movement ', 'error').then(function () { swal.close(); $('#txttransferlabel').focus(); });
    }
    else if (inventorycode == "") {
        swal('Alert', 'Please enter movement or inventory code', 'error').then(function () { swal.close(); $('#txttransferinvtcode').focus(); });
    }
    else {
        var obj = {
            searchtransferid: rowid,
            fk_entrepottarget: fk_entrepottarget,
            fk_product: fk_product,
            value: value,
            inventorycode: inventorycode,
            label: label,
            price: price,
            eatby: eatbydate,
            sellby: salebydate,
            serial: lotserial,
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
                    //resettransferstock();
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
    $("#ddltransferProduct").val("0");
    $("#txttransferunit").val("");
    $("#txttransferserial").val("");
    $("#txttransfereatbydate").val("");
    $("#txttransfersalebydate").val("");
    $("#txttransferinvtcode").val("");
    $("#txttransferlabel").val("");
}






    /*rowid = $("#hfstockid").val();
    corphone = $("#txtprice").val();
    //coraddress = $("#txtCorAddress").val();
    //coraddress1 = $("#txtCorAddress1").val();
    //corcity = $("#txtCorCity").val();
    //corstate = $("#txtCorState").val();
    //corzip = $("#txtCorZipCode").val();
    //corcountry = $("#txtCorCountry").val();
    //publicnote = $("#txtpublic").val();
    //privatenote = $("#txtprivate").val();

    var obj = {
        myid: rowid,
        price: corphone,
        //cor_address: coraddress,
        //cor_address1: coraddress1,
        //cor_city: corcity,
        //cor_state: corstate,
        //cor_zip: corzip,
        //cor_country: corcountry,
        //note_public: publicnote,
        //note_private: privatenote,

    }
    $.ajax({
        url: '/Warehouse/UpdateCorrectstock/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            if (data.status == true) {
                //$('#parent > input:text').val('');
                swal('Alert!', data.message, 'success');
            }
            else {
                swal('Alert!', data.message, 'error');
            }
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    }) */


function productbywarehouse() {
    var warehouseid = $("#hfid").val();
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
            })
           
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })

}

function ProductWarehouseGrid() {
    var id = $("#hfid").val();
    var obj = { getwarehouseid:id}
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
                    { data: 'warehouse', title: 'Warehouse Name', sWidth: "25%" },
                    { data: 'product', title: 'Product Name', sWidth: "25%" },
                    { data: 'address', title: 'Warehouse Address', sWidth: "25%" },
                    
                ],


                "order": [[0, 'desc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });
}