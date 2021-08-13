
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
    else if (serial == "") {
        swal('Alert', 'Please Enter Lot/Serial Number', 'error').then(function () { swal.close(); $('#txtserial').focus(); });
    }
    else if (eatby == "") {
        swal('Alert', 'Please Enter Eat By date', 'error').then(function () { swal.close(); $('#txteatbydate').focus(); });
    }
    else if (price == "") {
        swal('Alert', 'Please Enter Price', 'error').then(function () { swal.close(); $('#txtprice').focus(); });
    }
    else if (label == "") {
        swal('Alert', 'Please Enter Label of Movement', 'error').then(function () { swal.close(); $('#txtlabel').focus(); });
    }
    else if (unit == "") {
        swal('Alert', 'Please Enter Number of Unit', 'error').then(function () { swal.close(); $('#txtunit').focus(); });
    }
    else if (sellby == "") {
        swal('Alert', 'Please Enter Sale By Date', 'error').then(function () { swal.close(); $('#txtsalebydate').focus(); });
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
                    StockTransferGrid();
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

$.get('/Warehouse/GetProduct', function (data) {
    var items = "";
    $.each(data, function (index, value) {
        items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddltransferProduct");
    })
});

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
        swal('Alert', 'Please select product', 'error').then(function () { swal.close(); $('#ddlProduct').focus(); });
    }
    else if (fk_entrepot == fk_entrepottarget) { swal('Alert', 'Please select other warehouse', 'error');}
    else if (fk_entrepottarget == 0) {
        swal('Alert', 'Please select target warehouse', 'error').then(function () { swal.close(); $('#ddltargetwarehouse').focus(); });
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