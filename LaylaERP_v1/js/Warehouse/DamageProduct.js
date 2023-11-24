$(document).ready(function () {
    $("#loader").hide();
    $('.select2').select2();
    $("#btnReset").click(function () { resetdamagestock(); })
    GetDamageVendor();

    $("#txtdamageeatbydate").datepicker({
        format: 'mm-dd-yyyy',
    }).datepicker('setDate','now');
    $("#btnAdd").click(function () { AddDamagestock(); });
    $("#btnUpdate").click(function () { UpdateDamagestock(); })
    $("#btnupload").click(function () { fileupload(); })
    StockDamageGrid();

})

function AddDamagestock() {
    var vendorid = $("#ddlVendorDamage").val();
    var warehouseid = $("#ddlWarehouseDamage").val();
    var fk_product = $("#ddlDamageProduct").val();
    var serial = $("#txtdamageserial").val();
    var eatby = $("#txtdamageeatbydate").val();
    var price = $("#txtdamageprice").val();
    var unit = $("#txtdamageunit").val();
    var label = $("#txtdamagelabel").val();
    var orderid = $("#txtorderid").val();
    //var formattedDate = new Date(eatby);
    //var d = formattedDate.getDate();
    ////var m = formattedDate.getMonth();
    //var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    ////m += 1;  // JavaScript months are 0-11
    //var y = formattedDate.getFullYear();
    //var stockdate = y + "-" + m + "-" + d;
    if (orderid == "") {
        swal('Alert', 'Please enter  order/purchase/return id', 'error').then(function () { swal.close(); $('#txtorderid').focus(); });
    }
    else if (vendorid == 0 || vendorid == null) {
        swal('Alert', 'Please select vendor', 'error').then(function () { swal.close(); $('#ddlVendorDamage').focus(); });
    }
    else if (warehouseid == 0 || warehouseid == null) {
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
            fk_entrepot: warehouseid,
            fk_product: fk_product,
            serial: serial,
            eatby: eatby,
            value: unit,
            label: label,
            price: price,
            order_id: orderid,
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
                    swal('Success!', data.message, 'success').then((result) => { location.href = '../DamageProductList'; });
                    resetdamagestock();
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
                var opt = '<option value="0">Please Select Product </option>';
                for (var i = 0; i < data.length; i++) {
                    opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>'
                }
                $("#ddlDamageProduct").html(opt);
            },
            error: function (msg) {

            }
        });
    });
}

$('#ddlDamageProduct').change(function () {
    //debugger
    if ($('#ddlDamageProduct').val() == null) return false;
    var fk_product = $('#ddlDamageProduct').val();
    var obj = {
        productid: fk_product,
    }
    jQuery.ajax({
        url: "/Warehouse/GetProductPrice/", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            if (data.length > 0) { data = JSON.parse(data); $('#txtdamageprice').val(parseFloat(data[0].cost_price).toFixed(2)); }
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });
});

function resetdamagestock() {
    $("#hfdamagestockid").val('');
    $('#txtdamagelabel').val('');
    $('#ddlDamageProduct').val('0').trigger('change');
    $('#ddlWarehouseDamage').val('0').trigger('change');
    $('#ddlVendorDamage').val('0').trigger('change');
    $("#txtdamageserial").val('');
    $("#txtdamageeatbydate").val('');
    $("#txtdamageprice").val('');
    $("#txtdamageunit").val('');
    $("#hfdamagetransid").val('');
    $("#txtorderid").val('');
}

function StockDamageGrid() {
    var urid = parseInt($("#ddlSearchStatus").val());
    ID = $("#hfid").val();
    let table_JD = $('#DamageProductData').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }, { targets: [0], visible: false }], order: [[1, "desc"]],
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
            $('#DamageProductData_filter input').unbind();
            $('#DamageProductData_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_JD.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Warehouse/GetDamageStockList/",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: ID });
            aoData.push({ name: "strValue2", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }

            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            { data: 'id', title: 'Ref', sWidth: "5%" },
            { data: 'order_id', title: 'Order/Purchase/Return ID', sWidth: "15%" },
            { data: 'product', title: 'Product', sWidth: "20%" },
            { data: 'vendor', title: 'Vendor', sWidth: "10%" },
            { data: 'warehouse', title: 'Warehouse', sWidth: "15%" },
            { data: 'label', title: 'Return reason', sWidth: "15%" },
            { data: 'date', title: 'Date', sWidth: "10%", },
            { data: 'quantity', title: 'Qty', sWidth: "10%" },
            {
                'data': 'id', sWidth: "8%",
                'render': function (id, type, full, meta) {
                    //if ($("#hfEdit").val() == "1") {
                    //return '<span title="Click here to edit." data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="EditSelect(' + id + ');"><i class="glyphicon glyphicon-pencil"></i></a></span>';
                    return '<span title="Click here to edit bank details" data-placement="bottom" data-toggle="tooltip"><a href="../Warehouse/UpdateDamageProduct/' + id + '" onclick="ActivityLog(\'Edit bank account\',\'Bank/financialaccount/' + id + '\');"><i class="glyphicon glyphicon-pencil"></i></a></span>';
                    //}
                    //else { return "No permission" }
                }
            },
        ]
    });
}

function EditSelect(id) {
    var obj = { strValue1: id }
    $.ajax({
        url: '/Warehouse/GetDamageProductById/',
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            $("#hfid").val(jobj[0].tran_id);
            $("#txtorderid").val(jobj[0].order_id);
            $('#txtdamagelabel').val(jobj[0].label);
            $('#ddlVendorDamage').val(jobj[0].vendor_id).trigger('change');
            setTimeout(function () { $('#ddlWarehouseDamage').val(jobj[0].warehouse_id).trigger('change'); }, 3000);
            setTimeout(function () { $('#ddlDamageProduct').val(jobj[0].product_id).trigger('change'); }, 5000);
            $("#txtdamageserial").val(jobj[0].serial);
            $("#txtdamageeatbydate").val(jobj[0].date);
            $("#txtdamageprice").val(jobj[0].price);
            $("#txtdamageunit").val(jobj[0].quantity);
            $("#hfdamagetransid").val(jobj[0].tran_id);
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}

function UpdateDamagestock() {
    var vendorid = $("#ddlVendorDamage").val();
    var warehouseid = $("#ddlWarehouseDamage").val();
    var fk_product = $("#ddlDamageProduct").val();
    var serial = $("#txtdamageserial").val();
    var eatby = $("#txtdamageeatbydate").val();
    var price = $("#txtdamageprice").val();
    var unit = $("#txtdamageunit").val();
    var label = $("#txtdamagelabel").val();
    var tranid = $("#hfid").val();
    var orderid = $("#txtorderid").val();

    if (orderid == "") {
        swal('Alert', 'Please enter  order/purchase/return id', 'error').then(function () { swal.close(); $('#txtorderid').focus(); });
    }
    else if (vendorid == 0 || vendorid == null) {
        swal('Alert', 'Please select vendor', 'error').then(function () { swal.close(); $('#ddlVendorDamage').focus(); });
    }
    else if (warehouseid == 0 || warehouseid == null) {
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
            fk_entrepot: warehouseid,
            fk_product: fk_product,
            serial: serial,
            eatby: eatby,
            value: unit,
            label: label,
            price: price,
            tran_id: tranid,
            order_id: orderid,
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
                    swal('Success!', data.message, 'success').then((result) => { location.href = '../DamageProductList'; });
                    resetdamagestock();
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

function fileupload() {
    tranid = $("#hfid").val();
    var file = document.getElementById("ImageFile").files[0];
    var formData = new FormData();
    formData.append("ImageFile", file);
    formData.append("tran_id", tranid);

    if (tranid == 0) {
        swal('Alert', 'Transcation id not found', 'error').then(function () { swal.close(); });
    }
    else {
        $.ajax({
            type: "POST",
            url: '/Warehouse/DamageFileUpload/',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success');
                    FileUploadList();
                }
                else { swal('Alert!', data.message, 'error'); }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
        })
    }
}
function FileUploadList() {
    var ID = $("#hfid").val();
    var obj = { tran_id: ID };
    var table_EL = $('#AccountCategoryListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }, { 'visible': true, 'targets': [0] }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: false, bAutoWidth: false, searching: true,
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
            $('#AccountCategoryListdata_filter input').unbind();
            $('#AccountCategoryListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        ajax: {
            url: '/Warehouse/DamageFileList', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { console.log(JSON.parse(data)); return JSON.parse(data); }
        },
        aoColumns: [
            {
                'data': 'model_pdf', sWidth: "25%",
                'render': function (FileName, type, full, meta) {
                    return '<span title="Click here to download/view document" data-placement="bottom" data-toggle="tooltip"><a target="popup" href="../../Content/DamageProductFiles/' + FileName + '" onclick="ActivityLog(\'View/download bank linked file ' + FileName + '\',\'/Bank/financialaccount/' + ID + '\');">' + FileName + ' <i class="fas fa-search-plus"></i></a></span>';
                }
            },
        ],
        //"dom": 'lBftipr',
    });
}