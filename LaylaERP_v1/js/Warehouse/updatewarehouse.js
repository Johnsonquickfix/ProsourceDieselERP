//productbywarehouse();
ProductWarehouseGrid();
BankLinkedFiles();
//targetwarehouse();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Correct stock
/*
function Addcurrentstock() {
    debugger
    var fk_entrepot = $("#hfid").val();
    var fk_product = $("#ddlProduct").val();
    var serial = $("#txtserial").val();
    var eatby = $("#txteatbydate").val();
    var price = $("#txtprice").val();
    var unit = $("#txtunit").val();
    var label = $("#txtlabel").val();
    //var sellby = $("#txtsalebydate").val();

    var formattedDate = new Date(eatby);
    var d = formattedDate.getDate();
    //var m = formattedDate.getMonth();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    //m += 1;  // JavaScript months are 0-11
    var y = formattedDate.getFullYear();
    var stockdate = y + "-" + m + "-" + d;
   
    if (fk_product == null || fk_product == 0) {
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
            //sellby: sellby,
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
    //$("#ddlProduct").val("");
    $('#ddlProduct').val(null).trigger('change');
}
//~~~~~~~~~~~~~~~~~~~End correct stock
*/

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
        swal('Alert', 'Please enter reference name', 'error').then(function () { swal.close(); $('#txtref').focus(); });
    }
    else if (lieu == "") {
        swal('Alert', 'Please enter short name location', 'error').then(function () { swal.close(); $('#txtShortNameLocation').focus(); });
    }
    else if (phone == "") {
        swal('Alert', 'Please enter contact number', 'error').then(function () { swal.close(); $('#txtPhone').focus(); });
    }
    else if (address == "") {
        swal('Alert', 'Please enter address', 'error').then(function () { swal.close(); $('#txtAddress').focus(); });
    }
    else if (city == "") {
        swal('Alert', 'Please enter city', 'error').then(function () { swal.close(); $('#txtCity').focus(); });
    }
    else if (town == "" || town == null) {
        swal('Alert', 'Please enter city', 'error').then(function () { swal.close(); $('#txtState').focus(); });
    }
    else if (zip == "") {
        swal('Alert', 'Please enter zip Code', 'error').then(function () { swal.close(); $('#txtZipCode').focus(); });
    }

    else {
        $("#txtZipCode").change();
        if ($("#hfzipstatus").val() == "true") {
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
                        swal('Success', data.message, 'success').then((result) => { location.href = 'Warehouse'; });
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

}

/*
function targetwarehouse() {
    $.get('/Warehouse/Gettargetwarehouse', function (data) {
        var items = "";
        $.each(data, function (index, value) {
            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddltargetwarehouse");
        })
    });
}
//    $.get('/Warehouse/GetProductForWarehouse', function (data) {
//        var items = "";
//        alert('hello');
//        $.each(data, function (index, value) {
//            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddltransferProduct");
//      })
//});

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

$('#ddlProduct').change(function () {
    debugger
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
});  */

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
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~STOCK~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/*
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
                //sDom: 'rtip',
                destroy: true,
                data: JSON.parse(data),
                "columns": [
                    { data: 'ref', title: 'Ref', sWidth: "5%" },
                    { data: 'date', title: 'Date', sWidth: "15%", },
                    { data: 'product', title: 'Product', sWidth: "20%" },
                    //{ data: 'warehouse', title: 'Warehouse', sWidth: "15%" },

                    { data: 'label', title: 'Label of movement', sWidth: "15%" },
                    { data: 'value', title: 'Qty', sWidth: "10%" },
                    //{ data: 'price', title: 'Unit Price', sWidth: "10%", },
                    {
                        'data': 'ref',
                        sWidth:"10%",
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
            //$('#ddlProduct').val(jobj[0].fk_product);
            $('#ddlProduct').val(jobj[0].fk_product).trigger('change');
            //$("#ddlProduct").append('<option value="' + jobj[0].fk_product + '" selected>' + jobj[0].post_title + '</option>');
            //$("#hfid").val();
            $("#txtserial").val(jobj[0].serial);
            $("#txteatbydate").val(jobj[0].eatby);
            $("#txtprice").val(jobj[0].price);
            $("#txtunit").val(jobj[0].value);
            $("#txtsalebydate").val(jobj[0].sellby);
            $("#txtTransid").val(jobj[0].tran_id);

            $("#btnStock").hide();
            $("#btnStockUpdate").show();
            $("#btnStockCancel").show();

            getstock();
            
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    });
}

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
                        sWidth:'10%',
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
        id : fk_entrepot,
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


function Updatecorrectstock() {
    debugger
   
    var fk_entrepot = $("#hfid").val();
    var stock = $("#txtstock").val();
    var tranid = $("#txtTransid").val();
    var rowid = $("#hfstockid").val();
    var fk_product = $("#ddlProduct").val();
    var serial = $("#txtserial").val();
    var eatby = $("#txteatbydate").val();
    var price = $("#txtprice").val();
    var unit = $("#txtunit").val();
    var label = $("#txtlabel").val();
    //var sellby = $("#txtsalebydate").val();
    //var z = $("#txteatbydate").val();
    //var dout = Date.parse(d);
    //$("#date").text(dout.toString('M-d-yyyy')); 
    //Addcurrentstock();

    var formattedDate = new Date(eatby);
    var d = formattedDate.getDate();
    //var m = formattedDate.getMonth();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    //m += 1;  // JavaScript months are 0-11
    var y = formattedDate.getFullYear();
    var z = y + "-" + m + "-" + d;
    //var eat =$("#txtDate").val(d + "." + m + "." + y);
    //alert(z);


    if (fk_product == null || fk_product == 0) {
        swal('Alert', 'Please select product', 'error').then(function () { swal.close(); $('#ddlProduct').focus(); });
    }
    else if (price == "") {
        swal('Alert', 'Please Enter Price', 'error').then(function () { swal.close(); $('#txtprice').focus(); });
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
            //sellby: sellby,
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

*/

//~~~~~~~~~~~~~~~~~~~~~~~End Stock~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~warehouse product~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/*
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
                items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlDamageProduct");
            })
           
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })

} */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~End product~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
                    //{ data: 'warehouse', title: 'Warehouse Name', sWidth: "25%" },
                    { data: 'post_title', title: 'Product Name', sWidth: "25%", class: 'text-left' },
                    {
                        data: 'reg_price', title: 'Regular Price', sWidth: "25%",
                        render: $.fn.dataTable.render.number('', '.', 2, '$')
                    },
                    {
                        data: 'sale_price', title: 'Sale Price', sWidth: "25%",
                        render: $.fn.dataTable.render.number('', '.', 2, '$')
                    },
                    {
                        data: 'buy_price', title: 'Buying price', sWidth: "25%",
                        render: $.fn.dataTable.render.number('', '.', 2, '$')
                    },

                    {
                        data: 'stock', title: 'Units in Stock', sWidth: "25%",
                       
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




// Linked Files program start

$("#btnupload").click(function () {
    WarehouseID = $("#hfid").val();
    var file = document.getElementById("ImageFile").files[0];
    var formData = new FormData();
    formData.append("ImageFile", file);
    formData.append("WarehouseID", WarehouseID);

    if (WarehouseID == 0) {
        swal('Alert', 'Warehouse not found', 'error').then(function () { swal.close(); });
    }
    else {
        $.ajax({
            type: "POST",
            url: '/Warehouse/FileUpload/',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    BankLinkedFiles();
                    swal('Success', data.message, 'success');
                }
                else { swal('Alert!', data.message, 'error'); }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
        })
    }
})



function BankLinkedFiles() {
    var urid = "";
    ID = $("#hfid").val();
    var sid = "";
    var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 50, sEcho: 1, SortCol: 'id', SortDir: 'desc', rowid: ID };
    $('#VendorLinkedFiles').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        sPaginationType: "full_numbers", searching: false, ordering: true, lengthChange: true, "paging": true,
        bAutoWidth: false, scrollX: false,
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        sAjaxSource: "/Warehouse/GetBankLinkedFiles",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "FileName" : oSettings.aaSorting[0][0] == 1 ? "FileSize" : oSettings.aaSorting[0][0] == 2 ? "Date" : "id";
                obj.SortCol = col; obj.SortDir = oSettings.aaSorting.length >= 0 ? oSettings.aaSorting[0][1] : "desc";
            }
            obj.sEcho = aoData[0].value; obj.PageSize = oSettings._iDisplayLength; obj.PageNo = oSettings._iDisplayStart;
            $.ajax({
                type: "POST", url: sSource, async: true, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
                success: function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, iTotalRecords: data.iTotalRecords, iTotalDisplayRecords: data.iTotalDisplayRecords, aaData: JSON.parse(data.aaData) };
                    $('#lblAttachedFiles').text(data.iTotalRecords);
                    return fnCallback(dtOption);

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
                async: false
            });
        },
        aoColumns: [
            {
                'data': 'FileName', sWidth: "25%",
                'render': function (FileName, type, full, meta) {
                    return '<a target="popup" href="../../Content/WarehouseLinkedFiles/' + FileName + '">' + FileName + ' <i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'FileSize', title: 'FileSize', sWidth: "25%" },
            { data: 'Date', title: 'Date', sWidth: "25%" },
            {
                'data': 'ID',
                'render': function (id, type, full, meta) {
                    return '<a href="#" onclick="DeleteBankLinkedFiles(' + id + ');"><i class="fas fa-trash-alt"></i></a>';
                }
            }
        ]
    });
}


function DeleteBankLinkedFiles(id) {
    RowID = $("#hfid").val();
    var result = confirm("Are you sure to delete this Linked File?");
    if (result) {
        var obj = { rowid: RowID, WarehouseID: id, }
        $.ajax({
            url: '/Warehouse/DeleteBankLinkedFiles/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8", data: JSON.stringify(obj), dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success');
                    BankLinkedFiles();
                }
                else { swal('Alert!', data.message, 'error') }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })
    }
}



//----------------Damage Stock Portion------------------

/*
function AddDamagestock() {
    debugger
    var fk_entrepot = $("#hfid").val();
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

    if (fk_product == null || fk_product == 0) {
        swal('Alert', 'Please select product', 'error').then(function () { swal.close(); $('#ddlDamageProduct').focus(); });
    }
    else if (price == "") {
        swal('Alert', 'Please Enter Price', 'error').then(function () { swal.close(); $('#txtdamageprice').focus(); });
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



$('#ddlDamageProduct').change(function () {
    debugger
    if ($('#ddlDamageProduct').val() == null) return false;
    var fk_product = $('#ddlDamageProduct').val();
    var fk_entrepot = $("#hfid").val();
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
            $('#txtdamageprice').val(data[0].buy_price);
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });
});

StockDamageGrid();
function StockDamageGrid() {
    var fk_entrepot = $("#hfid").val();
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
                    { data: 'label', title: 'Label of movement', sWidth: "15%" },
                    { data: 'product', title: 'Product', sWidth: "20%" },
                    { data: 'value', title: 'Qty', sWidth: "10%" },
                    {
                        'data': 'ref',
                        'sortable': false,
                        'searchable': false,
                        sWidth:"10%",
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
            $('#ddlDamageProduct').val(jobj[0].fk_product).trigger('change');
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
   
    var fk_entrepot = $("#hfid").val();
    var tranid = $("#hfdamagetransid").val();
    var rowid = $("#hfdamagestockid").val();
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
    var z = y + "-" + m + "-" + d;
    //var eat =$("#txtDate").val(d + "." + m + "." + y);
    //alert(z);


    if (fk_product == null || fk_product == 0) {
        swal('Alert', 'Please select product', 'error').then(function () { swal.close(); $('#ddlDamageProduct').focus(); });
    }
    else if (price == "") {
        swal('Alert', 'Please Enter Price', 'error').then(function () { swal.close(); $('#txtdamageprice').focus(); });
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

*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~End Damgage~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


WarehouseAddressInfoList();
function WarehouseAddressInfoList() {
    var ID = $("#hfid").val();
    var table_EL = $('#additionalinfo').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': true, 'targets': [0] }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#additionalinfo_filter input').unbind();
            $('#additionalinfo_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },

        sAjaxSource: "/Warehouse/WarehouseAddressInfoList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue2", value: ID });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "phone" : oSettings.aaSorting[0][0] == 1 ? "Address" : "id";
                aoData.push({ name: "sSortColName", value: col });
            }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            { data: 'address', title: 'Address', sWidth: "25%" },
            {
                data: 'phone', title: 'Phone', sWidth: "15%", render: function (toFormat) {
                    var tPhone = '';
                    if (toFormat != null) {
                        tPhone = toFormat.toString();
                        tPhone = '(' + tPhone.substring(0, 3) + ') ' + tPhone.substring(3, 6) + ' ' + tPhone.substring(6, 10);
                    }
                    return tPhone
                }
            },
            {
                'data': 'id',
                'sortable': false,
                'searchable': false,
                sWidth: "10%",
                'render': function (id, type, full, meta) {
                    return '<span title="Click Here To Edit Address Details" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="EditSelectAddress(' + id + ');"><i class="glyphicon glyphicon-pencil"></i></a></span>';
                }
            },
        ],
    });
}

function EditSelectAddress(id) {
    var obj = { strValue1: id }
    $.ajax({
        url: '/Warehouse/SelectAddressByID/',
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            console.log(jobj[0].rowid);
            $("#hfaddressid").val(jobj[0].rowid);
            $('#txtCorContact').val(jobj[0].phone);
            $('#txtCorAddress').val(jobj[0].address);
            $("#txtCorAddress1").val(jobj[0].address1);
            $("#txtCorCity").val(jobj[0].city);
            $("#txtCorState").val(jobj[0].state);
            $("#txtCorZipCode").val(jobj[0].zip);
            $("#txtCorCountry").val(jobj[0].country).trigger('change');
            $("#txtpublic").val(jobj[0].note);

            $("#btnSaveinfo").hide();
            $("#btnUpdateinfo").show();
            $("#btnResetinfo").show();
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}

function resetaddressinfo() {
    $("#hfaddressid").val('');
    $('#txtCorContact').val('');
    $('#txtCorAddress').val('');
    $("#txtCorAddress1").val('');
    $("#txtCorCity").val('');
    $("#txtCorState").val('');
    $("#txtCorZipCode").val('');
    $("#txtpublic").val('');
    $("#btnSaveinfo").show();
    $("#btnUpdateinfo").hide();
    $("#btnResetinfo").show();
}


function EditWarehouseinfo() {
    //Additional info
    rowid = $("#hfaddressid").val();
    corphone = $("#txtCorContact").val();
    coraddress = $("#txtCorAddress").val();
    coraddress1 = $("#txtCorAddress1").val();
    corcity = $("#txtCorCity").val();
    corstate = $("#txtCorState").val();
    corzip = $("#txtCorZipCode").val();
    corcountry = $("#txtCorCountry").val();
    publicnote = $("#txtpublic").val();

    if (coraddress == "") {
        swal('Alert', 'Please enter address', 'error').then(function () { swal.close(); $('#txtCorAddress').focus(); });
    }
    else if (corcity == "") {
        swal('Alert', 'Please enter city', 'error').then(function () { swal.close(); $('#txtCorCity').focus(); });
    }
    else if (corstate == "") {
        swal('Alert', 'Please enter state', 'error').then(function () { swal.close(); $('#txtCorState').focus(); });
    }
    else if (corzip == "") {
        swal('Alert', 'Please enter zip Code', 'error').then(function () { swal.close(); $('#txtCorZipCode').focus(); });
    }

    else {

        var obj = {
            address_id: rowid,
            cor_phone: corphone,
            cor_address: coraddress,
            cor_address1: coraddress1,
            cor_city: corcity,
            cor_state: corstate,
            cor_zip: corzip,
            cor_country: corcountry,
            note_public: publicnote,
        }
        $.ajax({
            url: '/Warehouse/Editwarehousesinfo/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success');
                    resetaddressinfo();
                    WarehouseAddressInfoList();
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