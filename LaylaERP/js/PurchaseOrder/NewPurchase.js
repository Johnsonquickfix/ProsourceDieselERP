﻿$(document).ready(function () {
    $("#loader").hide(); $('.billinfo').prop("disabled", true);
    $('#txtPODate,#txtPlanneddateofdelivery').datepicker({ format: 'mm/dd/yyyy', autoclose: true, todayHighlight: true });
    $(".select2").select2();
    getVendor(); getMasters();
    getPurchaseOrderInfo()
    $("#ddlVendor").change(function () {
        let today = new Date();
        $('#txtPODate').val(today.toLocaleDateString("en-US"));
        $('.entry-mode-action').empty().append('<button type="button" id="btnOtherProduct" class="btn btn-danger billinfo"><i class="fas fa-cube"></i> Add Other Product</button> ');
        $('.entry-mode-action').append('<button type="button" id="btnService" class="btn btn-danger billinfo"><i class="fas fa-concierge-bell"></i> Add Service</button>');
        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/PurchaseOrder/PurchaseOrderList">Back to List</a><input type="submit" value="Create Order" id="btnSave" class="btn btn-danger billinfo" />');
        $('.billinfo').prop("disabled", false);

        setTimeout(function () {
            let _details = getVendorDetails();
            if (_details.length > 0) $('#txtRefvendor').val(_details[0].code_vendor);
        }, 50);
    });
    $('#ddlProduct').select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Search Product",
        ajax: {
            url: '/PurchaseOrder/SearchProducts', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: jobj }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
    $("#ddlProduct").change(function () {
        let product_id = parseInt($('#ddlProduct').val()) || 0, vender_id = parseInt($('#ddlVendor').val()) || 0;
        getItemList(product_id, vender_id); //$('#ddlProduct').val('').trigger('change');
    });
    $('#ddlIncoTerms').change(function () {
        var IncotermsTypeID = $('#ddlIncoTerms').val();
        var obj = { IncotermsTypeID: IncotermsTypeID };
        $.ajax({
            url: "/PurchaseOrder/GetIncotermByID", dataType: 'json', type: "Post", contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            success: function (data) {
                data = JSON.parse(data); $('#txtIncoTerms').val(data[0].short_description);
            },
            error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
        });
    });
    $(document).on("click", ".btnEdit", function (t) {
        t.preventDefault(); $("#loader").show();
        $('#ddlVendor').prop("disabled", true); $('.billinfo').prop("disabled", false); //$('#txtbillfirstname').focus();
        $('.entry-mode-action').empty().append('<button type="button" id="btnOtherProduct" class="btn btn-danger billinfo"><i class="fas fa-cube"></i> Add Other Product</button> ');
        $('.entry-mode-action').append('<button type="button" id="btnService" class="btn btn-danger billinfo"><i class="fas fa-concierge-bell"></i> Add Service</button>');
        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/PurchaseOrder/PurchaseOrderList">Back to List</a><button type="button" class="btn btn-danger btnUndoRecord"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" class="btn btn-danger" id="btnSave"><i class="far fa-save"></i> Update</button>');
        $("#loader").hide();
    });
    $(document).on("click", ".btnUndoRecord", function (t) { t.preventDefault(); $("#loader").show(); getPurchaseOrderInfo(); });
    $(document).on("click", "#btnOtherProduct", function (t) { t.preventDefault(); AddProductModal(0, 0); });
    $(document).on("click", "#btnService", function (t) { t.preventDefault(); AddProductModal(1, 0); });
    $("#POModal").on("click", "#btnAddProc", function (t) {
        t.preventDefault();
        let rang = parseInt($(this).data('rang')) || 0, proc_type = parseInt($(this).data('proc_type')) || 0;
        bindOtherItems(proc_type, rang);
    });
    $("#POModal").on("change", ".addCalulate", function (t) {
        t.preventDefault();
        let rQty = 0.00, rPrice = 0.00, rDescPer = 0.00, rTotal = 0.00;
        rQty = parseFloat($("#txt_proc_qty").val()) || 0.00;
        rPrice = parseFloat($("#txt_proc_price").val()) || 0.00;
        rDescPer = parseFloat($("#txt_proc_disc").val()) || 0.00;
        rTotal = ((rPrice * rQty) - (rPrice * rQty) * (rDescPer / 100));
        $("#txt_proc_total").val(rTotal.toFixed(2));
    });
    $(document).on("click", "#btnSave", function (t) { t.preventDefault(); saveVendorPO(); });
    $(document).on("click", "#btnPrintPdf", function (t) { t.preventDefault(); printinvoice(); });
});
function getMasters() {
    $.ajax({
        url: "/PurchaseOrder/GetAllMaster",
        type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            //Payment Terms
            $("#ddlPaymentTerms").html('<option value="0">Select Payment Term</option>');
            for (i = 0; i < dt['Table'].length; i++) { $("#ddlPaymentTerms").append('<option value="' + dt['Table'][i].id + '">' + dt['Table'][i].text + '</option>'); }

            //Payment Type
            $("#ddlPaymentType").html('<option value="0">Select Payment Type</option>');
            for (i = 0; i < dt['Table1'].length; i++) { $("#ddlPaymentType").append('<option value="' + dt['Table1'][i].id + '">' + dt['Table1'][i].text + '</option>'); }

            //Balance
            $("#ddlBalancedays").html('<option value="0">Select Balance days</option>');
            for (i = 0; i < dt['Table2'].length; i++) { $("#ddlBalancedays").append('<option value="' + dt['Table2'][i].id + '">' + dt['Table2'][i].text + '</option>'); }

            //Balance
            $("#ddlIncoTerms").html('<option value="0">Select Incoterms</option>');
            for (i = 0; i < dt['Table3'].length; i++) { $("#ddlIncoTerms").append('<option value="' + dt['Table3'][i].id + '">' + dt['Table3'][i].text + '</option>'); }
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }, async: false
    });
}
function getVendor() {
    $.ajax({
        url: "/PurchaseOrder/GetVendor",
        type: "Get",
        success: function (data) {
            $('#ddlVendor').append('<option value="-1">Please Select Vendor</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddlVendor').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}
function getVendorDetails() {
    let VendorID = parseInt($('#ddlVendor').val()) || 0;
    let _details = [];
    $.ajax({
        url: "/PurchaseOrder/GetVendorByID", dataType: 'json', type: "get", contentType: "application/json; charset=utf-8",
        data: { strValue1: VendorID },
        success: function (data) { _details = JSON.parse(data); },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }, async: false
    });
    return _details;
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Item Tab Section ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getItemList(product_id, vender_id) {
    let option = { strValue1: product_id, strValue2: vender_id };
    $.ajax({
        type: "get", url: '/PurchaseOrder/SearchProductDetails', contentType: "application/json; charset=utf-8", dataType: "json", data: option,
        beforeSend: function () { $("#loader").show(); },
        success: function (data) { bindItems(data); },
        complete: function () { $("#loader").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
        async: false
    });
}
function bindItems(data) {
    let itemHtml = '';
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].fk_product > 0) {
                if ($('#tritemid_' + data[i].fk_product).length <= 0) {
                    itemHtml += '<tr id="tritemid_' + data[i].fk_product + '" class="paid_item" data-pid="' + data[i].fk_product + '" data-pname="' + data[i].description + '" data-psku="' + data[i].product_sku + '" data-rowid="' + data[i].rowid + '">';
                    itemHtml += '<td class="text-center"><button class="btn p-0 text-red btnDeleteItem billinfo" onclick="removeItems(\'' + data[i].fk_product + '\');"> <i class="glyphicon glyphicon-trash"></i> </button></td>';
                    itemHtml += '<td>' + data[i].description + '</td><td>' + data[i].product_sku + '</td>';
                    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + data[i].fk_product + '" value="' + data[i].subprice + '" name="txt_itemprice" placeholder="Price"></td>';
                    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemqty_' + data[i].fk_product + '" value="' + data[i].qty + '" name="txt_itemqty" placeholder="Qty."></td>';
                    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemdisc_' + data[i].fk_product + '" value="' + data[i].discount_percent + '" name="txt_itemdisc" placeholder="Discount"></td>';
                    itemHtml += '<td class="text-right tax-amount" data-tax1="' + data[i].total_localtax1 + '" data-tax2="' + data[i].total_localtax2 + '">' + data[i].total_localtax1 + '</td>';
                    itemHtml += '<td class="text-right row-total">' + data[i].total_ttc.toFixed(2) + '</td>';
                    itemHtml += '</tr>';
                }
                else { $('#txt_itemqty_' + data[i].rowid).val((parseFloat($('#txt_itemqty_' + data[i].rowid).val()) + data[i].qty).toFixed(2)); }
            }
        }
        $('#line_items').append(itemHtml); $("#divAddItemFinal").find(".rowCalulate").change(function () { calculateFinal(); });
    }
    calculateFinal();
}
function removeItems(id) {
    //------------- Remove data in Temp AddItemList-----
    swal({ title: "Are you sure?", text: 'Would you like to Remove this Item?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) {
                $('#tritemid_' + id).remove();
                calculateFinal();
            }
        });
}
function calculateFinal() {
    let tGrossAmt = 0.00, tDisAmt = 0.00, tTax_Amt1 = 0.00, tTax_Amt2 = 0.00, tNetAmt = 0.00;
    //main item
    $("#line_items > tr.paid_item").each(function (index, row) {
        let rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rGrossAmt = 0.00, rDisAmt = 0.00, rTax1 = 0.00, rTax_Amt1 = 0.00, rTax2 = 0.00, rTax_Amt2 = 0.00, rNetAmt = 0.00;
        rPrice = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_itemqty]").val()) || 0.00;
        rDisPer = parseFloat($(row).find("[name=txt_itemdisc]").val()) || 0.00;
        rTax1 = parseFloat($(row).find(".tax-amount").data('tax1')) || 0.00; rTax2 = parseFloat($(row).find(".tax-amount").data('tax2')) || 0.00;
        rGrossAmt = rPrice * rQty; rDisAmt = rGrossAmt * (rDisPer / 100);
        rTax_Amt1 = rTax1 * rQty; rTax_Amt2 = rTax2 * rQty;
        rNetAmt = (rGrossAmt - rDisAmt) + rTax_Amt1 + rTax_Amt2;
        $(row).find(".tax-amount").text(rTax_Amt1.toFixed(2)); $(row).find(".row-total").text(rNetAmt.toFixed(2));
        tGrossAmt += rGrossAmt, tDisAmt += rDisAmt, tTax_Amt1 += rTax_Amt1, tTax_Amt2 += rTax_Amt2, tNetAmt += rNetAmt;
    });
    //other item
    $("#product_line_items > tr.other_item").each(function (index, row) {
        let rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rDisAmt = 0.00, rTax_Amt1 = 0.00, rGrossAmt = 0.00, rNetAmt = 0.00;
        rPrice = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_itemqty]").val()) || 0.00;
        rDisPer = parseFloat($(row).find("[name=txt_itemdisc]").val()) || 0.00;
        rGrossAmt = rPrice * rQty; rDisAmt = rGrossAmt * (rDisPer / 100);
        rNetAmt = (rGrossAmt - rDisAmt) + rTax_Amt1;
        $(row).find(".tax-amount").text(rTax_Amt1.toFixed(2)); $(row).find(".row-total").text(rNetAmt.toFixed(2));
        tGrossAmt += rGrossAmt, tDisAmt += rDisAmt, tTax_Amt1 += rTax_Amt1, tNetAmt += rNetAmt;
    });
    $("#SubTotal").text(tGrossAmt.toFixed(2));
    $("#discountTotal").text(tDisAmt.toFixed(2));
    $("#salesTaxTotal").text(tTax_Amt1.toFixed(2));
    $("#shippingTotal").text(tTax_Amt2.toFixed(2));
    $("#orderTotal").html(tNetAmt.toFixed(2));
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Add Other Product and Services ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function AddProductModal(proc_type, row_num) {
    let row = $('#tritemid_' + row_num);
    let rDesc = row.find('.item-desc').text(), rSku = row.find('.item-sku').text(), rSDate = '', rEDate = '', rQty = 0.00, rPrice = 0.00, rDescPer = 0.00, rTotal = 0.00;
    rQty = parseInt(row.find("[name=txt_itemqty]").val()) || 1;
    rPrice = parseFloat(row.find("[name=txt_itemprice]").val()) || 0;
    rDescPer = parseFloat(row.find("[name=txt_itemdisc]").val()) || 0;
    rTotal = parseFloat(row.find(".row-total").text()) || 0;

    var prodHtml = '<div class="modal-dialog">';
    prodHtml += '<div class="modal-content">';
    prodHtml += '<div class="modal-header">';
    prodHtml += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    prodHtml += '<h4 class="modal-title" id="myModalLabel">Add ' + (proc_type == 0 ? 'Other Product' : 'Service') + '</h4>';
    prodHtml += '</div>';
    prodHtml += '<div class="modal-body">';

    prodHtml += '<div class="row">';
    prodHtml += '<div class="col-md-12">Description<span class="text-red">*</span>';
    prodHtml += '<input class="form-control" type="input" id="txt_proc_desc" placeholder="Description" maxlength="250" autocomplete="off" value="' + rDesc + '">';
    prodHtml += '</div>';
    if (proc_type == 0) {
        prodHtml += '<div class="col-md-12">Vender SKU';
        prodHtml += '<input class="form-control" type="input" id="txt_proc_sku" placeholder="Vender SKU" maxlength="150" autocomplete="off" value="' + rSku + '">';
        prodHtml += '</div>';
    }
    else {
        prodHtml += '<div class="col-md-6">From Date';
        prodHtml += '<input class="form-control date-picker" type="input" id="txt_proc_fromdate" placeholder="MM/DD/YYYY" maxlength="150" autocomplete="off" value="">';
        prodHtml += '</div>';
        prodHtml += '<div class="col-md-6">To Date';
        prodHtml += '<input class="form-control date-picker" type="input" id="txt_proc_todate" placeholder="MM/DD/YYYY" maxlength="150" autocomplete="off" value="">';
        prodHtml += '</div>';
    }
    prodHtml += '<div class="col-md-6">Price<span class="text-red">*</span>';
    prodHtml += '<input class="form-control addCalulate" type="number" id="txt_proc_price" placeholder="Price" maxlength="20" autocomplete="off" value="' + rPrice.toFixed(2) + '">';
    prodHtml += '</div>';
    prodHtml += '<div class="col-md-6">Quantity<span class="text-red">*</span>';
    prodHtml += '<input class="form-control addCalulate" type="number" id="txt_proc_qty" placeholder="Quantity" maxlength="20" autocomplete="off" value="' + rQty + '">';
    prodHtml += '</div>';
    prodHtml += '<div class="col-md-6">Discount(%)';
    prodHtml += '<input class="form-control addCalulate" min="0" max="100" type="number" id="txt_proc_disc" placeholder="Discount" maxlength="20" autocomplete="off" value="' + rDescPer.toFixed(2) + '">';
    prodHtml += '</div>';
    prodHtml += '<div class="col-md-6">Total';
    prodHtml += '<input class="form-control" type="number" id="txt_proc_total" placeholder="Total" maxlength="20" autocomplete="off" value="' + rTotal.toFixed(2) + '" disabled>';
    prodHtml += '</div>';
    prodHtml += '</div>';

    prodHtml += '</div>';
    prodHtml += '<div class="modal-footer">';
    prodHtml += '<button type="button" class="btn btn-danger" id="btnAddProc" data-proc_type="' + proc_type + '" data-rang="' + row_num + '">Add</button>';
    prodHtml += '</div>';
    prodHtml += '</div>';
    prodHtml += '</div>';
    $("#POModal").empty().html(prodHtml);
    $("#POModal").modal({ backdrop: 'static', keyboard: false }); $("#txt_proc_desc").focus();
    $('.date-picker').datepicker({ format: 'mm/dd/yyyy', autoclose: true, todayHighlight: true });
}
function bindOtherItems(proc_type, row_num) {
    let rDesc = '', rSku = '', rSDate = '', rEDate = '', rQty = 0.00, rPrice = 0.00, rDescPer = 0.00, rTotal = 0.00;
    if (row_num == 0) row_num = (parseInt($('#product_line_items tr:last').data("rang")) || 0) + 1;
    rDesc = $("#txt_proc_desc").val();
    if (rDesc == "") { swal('alert', 'Please Enter Description.', 'error').then(function () { swal.close(); $('#txt_proc_desc').focus(); }); return false; }
    if ($('#txt_proc_qty').val() == "") { swal('alert', 'Please Enter Quantity.', 'error').then(function () { swal.close(); $('#txt_proc_qty').focus(); }); return false; }
    if ($('#txt_proc_price').val() == "") { swal('alert', 'Please Enter Price.', 'error').then(function () { swal.close(); $('#txt_proc_price').focus(); }); return false; }
    if (proc_type == 0) {
        rSku = $("#txt_proc_sku").val();
    }
    else {
        rSDate = $("#txt_proc_fromdate").val();
        rEDate = $("#txt_proc_todate").val();
    }
    rQty = parseFloat($("#txt_proc_qty").val()) || 0.00;
    rPrice = parseFloat($("#txt_proc_price").val()) || 0.00;
    rDescPer = parseFloat($("#txt_proc_disc").val()) || 0.00;
    rTotal = parseFloat($("#txt_proc_total").val()) || 0.00;
    let itemHtml = '';
    if ($('#tritemid_' + row_num).length <= 0) {
        itemHtml += '<tr id="tritemid_' + row_num + '" class="other_item" data-rowid="0" data-rang="' + row_num + '" data-proc_type="' + proc_type + '">';
        itemHtml += '<td class="text-center">';
        itemHtml += '<button class="btn p-0 billinfo" onclick="AddProductModal(\'' + proc_type + '\',\'' + row_num + '\');"><i class="glyphicon glyphicon-edit"></i></button>';
        itemHtml += '<button class="btn p-0 text-red billinfo" onclick="removeItems(\'' + row_num + '\');"><i class="glyphicon glyphicon-trash"></i></button>';
        itemHtml += '</td > ';
        itemHtml += '<td class="item-desc">' + rDesc + '</td><td class="item-sku">' + rSku + '</td>';
        itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + row_num + '" value="' + rPrice.toFixed(2) + '" name="txt_itemprice" placeholder="Price"></td>';
        itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemqty_' + row_num + '" value="' + rQty.toFixed(0) + '" name="txt_itemqty" placeholder="Qty."></td>';
        itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemdisc_' + row_num + '" value="' + rDescPer.toFixed(2) + '" name="txt_itemdisc" placeholder="Discount"></td>';
        itemHtml += '<td class="text-right tax-amount">0.00</td>';
        itemHtml += '<td class="text-right row-total">' + rTotal.toFixed(2) + '</td>';
        itemHtml += '</tr>';
        $('#product_line_items').append(itemHtml);
    }
    else {
        $('#tritemid_' + row_num).find('.item-desc').text(rDesc); $('#tritemid_' + row_num).find('.item-sku').text(rSku);
        $('#tritemid_' + row_num).find("[name=txt_itemprice]").val(rPrice);
        $('#tritemid_' + row_num).find("[name=txt_itemqty]").val(rQty);
        $('#tritemid_' + row_num).find("[name=txt_itemdisc]").val(rDescPer);
        $('#tritemid_' + row_num).find(".tax-amount").text(0.00); $('#tritemid_' + row_num).find('.row-total').text(rTotal);
    }
    $("#POModal").modal('hide');
    $("#product_line_items").find(".rowCalulate").change(function () { calculateFinal(); });
    calculateFinal();
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Edit Purchase Order ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getPurchaseOrderInfo() {
    let oid = parseInt($('#lblPoNo').data('id')) || 0;
    if (oid > 0) {
        $('#ddlVendor,.billinfo').prop("disabled", true);
        $('.page-heading').text('Edit Purchase Order ').append('<a class="btn btn-danger" href="/PurchaseOrder/PurchaseOrderList">Back to List</a>');
        $('#line_items,#product_line_items').empty();
        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/PurchaseOrder/PurchaseOrderList">Back to List</a>');
        var option = { strValue1: oid };
        $.ajax({
            url: "/PurchaseOrder/GetPurchaseOrderByID", type: "Get", beforeSend: function () { $("#loader").show(); }, data: option,
            success: function (result) {
                try {
                    let data = JSON.parse(result);
                    for (let i = 0; i < data['po'].length; i++) {
                        $('#lblPoNo').text(data['po'][i].ref); $('#txtRefvendor').val(data['po'][i].ref_supplier); $('#txtPODate').val(data['po'][i].date_creation);
                        $('#ddlVendor').val(data['po'][i].fk_supplier).trigger('change');
                        $('#ddlPaymentTerms').val(data['po'][i].fk_payment_term).trigger('change');
                        $('#ddlBalancedays').val(data['po'][i].fk_balance_days).trigger('change');
                        $('#ddlIncoTerms').val(data['po'][i].fk_incoterms).trigger('change');
                        $('#ddlPaymentType').val(data['po'][i].fk_payment_type).trigger('change');
                        $('#txtNotePublic').val(data['po'][i].note_public); $('#txtNotePrivate').val(data['po'][i].note_private);
                        $('#txtIncoTerms').val(data['po'][i].location_incoterms);
                        if (!data['po'][i].date_livraison.includes('00/00/0000')) $('#txtPlanneddateofdelivery').val(data['po'][i].date_livraison);

                    }
                    for (let i = 0; i < data['pod'].length; i++) {
                        let itemHtml = '';
                        if (data['pod'][i].fk_product > 0) {
                            itemHtml = '<tr id="tritemid_' + data['pod'][i].fk_product + '" class="paid_item" data-pid="' + data['pod'][i].fk_product + '" data-pname="' + data['pod'][i].description + '" data-psku="' + data['pod'][i].product_sku + '" data-rowid="' + data['pod'][i].rowid + '">';
                            itemHtml += '<td class="text-center"><button class="btn p-0 text-red btnDeleteItem billinfo" onclick="removeItems(\'' + data['pod'][i].fk_product + '\');"> <i class="glyphicon glyphicon-trash"></i> </button></td>';
                            itemHtml += '<td>' + data['pod'][i].description + '</td><td>' + data['pod'][i].product_sku + '</td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].subprice.toFixed(2) + '" name="txt_itemprice" placeholder="Price"></td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemqty_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].qty.toFixed(0) + '" name="txt_itemqty" placeholder="Qty."></td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemdisc_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].discount_percent.toFixed(2) + '" name="txt_itemdisc" placeholder="Discount"></td>';
                            itemHtml += '<td class="text-right tax-amount" data-tax1="' + data['pod'][i].total_localtax1 + '" data-tax2="' + data['pod'][i].total_localtax2 + '">' + data['pod'][i].total_localtax1.toFixed(2) + '</td>';
                            itemHtml += '<td class="text-right row-total">' + data['pod'][i].total_ttc.toFixed(2) + '</td>';
                            itemHtml += '</tr>';
                            $('#line_items').append(itemHtml);
                        }
                        else {
                            itemHtml = '<tr id="tritemid_' + data['pod'][i].rowid + '" class="other_item" data-rowid="' + data['pod'][i].rowid + '" data-rang="' + data['pod'][i].rowid + '" data-proc_type="' + data['pod'][i].product_type + '">';
                            itemHtml += '<td class="text-center">';
                            itemHtml += '<button class="btn p-0 billinfo" onclick="AddProductModal(\'' + data['pod'][i].product_type + '\',\'' + data['pod'][i].rowid + '\');"><i class="glyphicon glyphicon-edit"></i></button>';
                            itemHtml += '<button class="btn p-0 text-red billinfo" onclick="removeItems(\'' + data['pod'][i].rowid + '\');"><i class="glyphicon glyphicon-trash"></i></button>';
                            itemHtml += '</td > ';
                            itemHtml += '<td class="item-desc">' + data['pod'][i].description + '</td><td class="item-sku">' + data['pod'][i].product_sku + '</td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + data['pod'][i].rowid + '" value="' + data['pod'][i].subprice.toFixed(2) + '" name="txt_itemprice" placeholder="Price"></td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemqty_' + data['pod'][i].rowid + '" value="' + data['pod'][i].qty.toFixed(0) + '" name="txt_itemqty" placeholder="Qty."></td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemdisc_' + data['pod'][i].rowid + '" value="' + data['pod'][i].discount_percent.toFixed(2) + '" name="txt_itemdisc" placeholder="Discount"></td>';
                            itemHtml += '<td class="text-right tax-amount">' + data['pod'][i].total_localtax1.toFixed(2) + '</td>';
                            itemHtml += '<td class="text-right row-total">' + data['pod'][i].total_ttc.toFixed(2) + '</td>';
                            itemHtml += '</tr>';
                            $('#product_line_items').append(itemHtml);
                        }
                    }
                }
                catch (error) {
                    $("#loader").hide(); swal('Alert!', "something went wrong.", "error");
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (xhr, status, err) { $("#loader").hide(); swal('Alert!', "something went wrong.", "error"); }, async: false
        });
        $("#divAddItemFinal").find(".rowCalulate").change(function () { calculateFinal(); })
        $('#ddlVendor,.billinfo').prop("disabled", true); calculateFinal(); $('.entry-mode-action').empty();
        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/PurchaseOrder/PurchaseOrderList">Back to List</a><button type="button" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
        $("#btnPrintPdf").removeClass('hidden');
    }
    else {
        $('.billinfo').prop("disabled", true); $('#lblPoNo').text('Draft');
        $("#loader").hide(); $('.page-heading').text('Add New Order');
        $("#btnPrintPdf").addClass('hidden');
    }
}

function createItemsList() {
    let _list = []; let _rang = 0;
    $('#line_items > tr').each(function (index, row) {
        let rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rGrossAmt = 0.00, rDisAmt = 0.00, rTax1 = 0.00, rTax_Amt1 = 0.00, rTax2 = 0.00, rTax_Amt2 = 0.00, rNetAmt = 0.00;
        rPrice = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_itemqty]").val()) || 0.00;
        rDisPer = parseFloat($(row).find("[name=txt_itemdisc]").val()) || 0.00;
        rTax1 = parseFloat($(row).find(".tax-amount").data('tax1')) || 0.00; rTax2 = parseFloat($(row).find(".tax-amount").data('tax2')) || 0.00;
        rGrossAmt = rPrice * rQty; rDisAmt = rGrossAmt * (rDisPer / 100);
        rTax_Amt1 = rTax1 * rQty; rTax_Amt2 = rTax2 * rQty;
        rNetAmt = (rGrossAmt - rDisAmt) + rTax_Amt1 + rTax_Amt2;
        _rang += 1;
        _list.push({
            rowid: $(row).data('rowid'), rang: _rang, product_type: 0, fk_product: $(row).data('pid'), description: $(row).data('pname'), product_sku: $(row).data('psku'),
            qty: rQty, subprice: rPrice, discount_percent: rDisPer, discount: rDisAmt, tva_tx: 0, localtax1_tx: rTax1, localtax1_type: 'F', localtax2_tx: rTax2, localtax2_type: 'F',
            total_ht: rGrossAmt, total_tva: 0, total_localtax1: rTax_Amt1, total_localtax2: rTax_Amt2, total_ttc: rNetAmt, date_start: '0000/00/00', date_end: '0000/00/00'
        });
    });
    //other item
    $("#product_line_items > tr.other_item").each(function (index, row) {
        let rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rGrossAmt = 0.00, rDisAmt = 0.00, rTax1 = 0.00, rTax_Amt1 = 0.00, rTax2 = 0.00, rTax_Amt2 = 0.00, rNetAmt = 0.00;
        rPrice = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_itemqty]").val()) || 0.00;
        rDisPer = parseFloat($(row).find("[name=txt_itemdisc]").val()) || 0.00;
        rGrossAmt = rPrice * rQty; rDisAmt = rGrossAmt * (rDisPer / 100);
        rNetAmt = (rGrossAmt - rDisAmt) + rTax1;
        _rang += 1;
        _list.push({
            rowid: $(row).data('rowid'), rang: _rang, product_type: $(row).data('proc_type'), fk_product: 0, description: $(row).find('.item-desc').text(), product_sku: $(row).find('.item-sku').text(),
            qty: rQty, subprice: rPrice, discount_percent: rDisPer, discount: rDisAmt, tva_tx: 0, localtax1_tx: rTax1, localtax1_type: 'F', localtax2_tx: rTax2, localtax2_type: 'F',
            total_ht: rGrossAmt, total_tva: 0, total_localtax1: rTax_Amt1, total_localtax2: rTax_Amt2, total_ttc: rNetAmt, date_start: '0000/00/00', date_end: '0000/00/00'
        });
    });
    return _list;
}
function saveVendorPO() {
    let id = parseInt($('#lblPoNo').data('id')) || 0;
    let vendorid = parseInt($("#ddlVendor").val()) || 0;
    let ref_vendor = $("#txtRefvendor").val();
    let payment_term = parseInt($("#ddlPaymentTerms").val()) || 0;
    let balance_days = parseInt($("#ddlBalancedays").val()) || 0;
    let payment_type = parseInt($("#ddlPaymentType").val()) || 0;
    let date_livraison = $("#txtPlanneddateofdelivery").val().split('/');

    let incoterms = parseInt($("#ddlIncoTerms").val()) || 0;
    let location_incoterms = $("#txtIncoTerms").val();
    let note_public = $("#txtNotePublic").val();
    let note_private = $("#txtNotePrivate").val();
    let _list = createItemsList();
    if (vendorid <= 0) { swal('alert', 'Please Select Vendor', 'error').then(function () { swal.close(); $('#ddlVendor').focus(); }) }
    else if (payment_type <= 0) { swal('alert', 'Please Select Payment Type', 'error').then(function () { swal.close(); $('#ddlPaymentType').focus(); }) }
    else if (date_livraison == "") { swal('alert', 'Please Select Planned date of delivery', 'error').then(function () { swal.close(); $('#txtPlanneddateofdelivery').focus(); }) }
    else {
        if (date_livraison.length > 0) date_livraison = date_livraison[2] + '/' + date_livraison[0] + '/' + date_livraison[1];
        let option = {
            RowID: id, VendorID: vendorid, PONo: '', VendorBillNo: ref_vendor, PaymentTerms: payment_term, Balancedays: balance_days, PaymentType: payment_type,
            Planneddateofdelivery: date_livraison, IncotermType: incoterms, Incoterms: location_incoterms, NotePublic: note_public, NotePrivate: note_private,
            total_tva: 0, localtax1: parseFloat($("#salesTaxTotal").text()), localtax2: parseFloat($("#shippingTotal").text()), total_ht: parseFloat($("#SubTotal").text()),
            discount: parseFloat($("#discountTotal").text()), total_ttc: parseFloat($("#orderTotal").text()), PurchaseOrderProducts: _list
        }
        //console.log(option);
        $.ajax({
            url: '/PurchaseOrder/NewPurchase', dataType: 'json', type: 'post', contentType: "application/json; charset=utf-8",
            data: JSON.stringify(option),
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    $('#lblPoNo').data('id', data.id);
                    getPurchaseOrderInfo();
                    swal('Alert!', data.message, 'success').then(function () { swal.close(); printinvoice(); });
                }
                else {
                    swal('Alert!', data.message, 'error')
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        });
    }
}

function printinvoice() {
    let _details = getVendorDetails();
    let _items = createItemsList();
    let payment_term = (parseInt($("#ddlPaymentTerms").val()) || 0) > 0 ? $("#ddlPaymentTerms option:selected").text() : '';
    let balance_days = (parseInt($("#ddlBalancedays").val()) || 0) > 0 ? $("#ddlBalancedays option:selected").text() : '';
    let location_incoterms = $("#txtIncoTerms").val();
    let total_qty = 0, total_gm = 0.00, total_tax = 0.00, total_shamt = 0.00, total_discamt = 0.00, total_net = 0.00;
    let com_add = $('#parent').data('ad1') + ', ' + $('#parent').data('ad2') + ', ' + $('#parent').data('city') + ', ' + $('#parent').data('state') + ', ' + $('#parent').data('country') + ' ' + $('#parent').data('zip');

    var modalHtml = '';
    modalHtml += '<div class="modal-dialog modal-lg">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<div class="modal-body no-padding clearfix" ></div>';
    modalHtml += '<div class="modal-footer">';
    modalHtml += '<button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#POModal").empty().html(modalHtml);

    var myHtml = '';
    myHtml += '<table cellpadding="0" cellspacing="0" border="0" style="border:0px; width:100%;">';
    myHtml += '<tr>';
    myHtml += '<td align="center" style="padding:0;">';
    myHtml += '<table cellpadding="0" cellspacing="0" border="0" style="border:0px; size: 8.27in 11.69in;margin: .5in .5in .5in .5in;">';
    myHtml += '<tr>';
    myHtml += '<td style="padding:0;">';
    myHtml += '<h2 class="invoice-name" style="color:#4f4f4f;line-height:1.4;font-family: sans-serif;margin:0px;font-size:24px; text-transform: uppercase; text-align: center; font-weight:600;">' + $('#parent').data('com') + '</h2>';
    myHtml += '<h3 class="invoice-address" style="color:#4f4f4f;line-height:1.4;font-family: sans-serif;text-align:center;margin:0px 0px 20px 0px; font-size:14px; text-transform: capitalize; font-weight:400;">' + com_add + '</h3>';
    myHtml += '<h1 class="invoice-title" style="color:#4f4f4f;line-height:1.4;font-family: sans-serif;font-size:30px; text-transform: uppercase; text-align: center; font-weight:700;">Proforma Invoice</h1>';
    myHtml += '<table class="invoice-wrapper" cellpadding="0" cellspacing="0" border="0" style="border:0px; width:100%;">';
    myHtml += '<tr>';
    myHtml += '<td style="padding:0!important;">';
    myHtml += '<table cellpadding="0" cellspacing="0" border="0" style="border:0px; width:250px;">';
    myHtml += '    <tbody>';
    myHtml += '        <tr class="date_box">';
    myHtml += '            <th style="color:#4f4f4f;line-height:1.4;font-size:12px;font-family: sans-serif;text-transform:uppercase; text-align: left; padding:0px;">Date</th>';
    myHtml += '            <td style="color:#4f4f4f;font-size:12px;line-height:1.4;font-family: sans-serif;padding:0px;">' + $('#txtPODate').val() + '</td>';
    myHtml += '        </tr>';
    myHtml += '        <tr class="date_box">';
    myHtml += '            <th style="color:#4f4f4f;line-height:1.4;font-size:12px;font-family: sans-serif;text-transform:uppercase; text-align: left; padding:0px;">Po#</th>';
    myHtml += '            <td style="color:#4f4f4f;font-size:12px;line-height:1.4;font-family: sans-serif;padding:0px;">' + $('#lblPoNo').text() + '</td>';
    myHtml += '        </tr>';
    myHtml += '        <tr class="date_box">';
    myHtml += '            <th style="color:#4f4f4f;line-height:1.4;font-size:12px;font-family: sans-serif;text-transform:uppercase; text-align: left;padding:0px;">Pi#</th>';
    myHtml += '            <td style="color:#4f4f4f;font-size:12px;line-height:1.4;font-family: sans-serif;padding:0px;">' + $('#txtRefvendor').val() + '</td>';
    myHtml += '        </tr>';
    myHtml += '    </tbody>';
    myHtml += '</table>';
    myHtml += '<table cellpadding="0" cellspacing="0" border="0" style="border:0px;width:100%; background: #F3F3F3; margin:25px 0px 30px 0px;">';
    myHtml += '<tr>';
    myHtml += '<td style="width:50%; vertical-align: top;padding:15px;">';
    myHtml += '<h2 style="font-family: sans-serif;margin:0px 0px 10px 0px;text-transform: uppercase;font-size:15px; background: #F3F3F3;color: #ff4100; border-bottom: 1px solid #e2e2e2; padding:0px 0px 10px 0px;">To</h2>';
    if (_details.length > 0) {
        myHtml += '<h3 style="font-family: sans-serif;margin:0px 0px 10px 0px;font-size:15px; color:#4f4f4f; margin:0px;">' + _details[0].name + '</h3>';
        myHtml += '<h4 style="font-weight:400;font-family: sans-serif; font-size:12px; margin:0px;color:#4f4f4f;line-height:1.4;">' + _details[0].address + '</h4>';
        myHtml += '<h4 style="font-weight:400;font-family: sans-serif; font-size:12px; margin:0px;color:#4f4f4f;line-height:1.4;">' + _details[0].town + ',' + _details[0].fk_state + ', ' + _details[0].fk_country + ' ' + _details[0].zip + '</h4>';
        myHtml += '<h4 style="font-weight:400;font-family: sans-serif; font-size:12px; margin:0px;color:#4f4f4f;line-height:1.4;">Phone : ' + _details[0].phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '</h4>';
    }
    myHtml += '</td>';
    myHtml += '<td style="width:50%; vertical-align: top;padding: 15px;">';
    //myHtml += '<h2 style="font-family: sans-serif;margin:0px 0px 10px 0px;text-transform: uppercase;font-size:15px; background: #F3F3F3;color: #ff4100; border-bottom: 1px solid #e2e2e2; padding:0px 0px 10px 0px;">Ship To</h2>';
    //myHtml += '<h4 style="font-weight:400;font-family: sans-serif; font-size:12px; margin:0px;color:#4f4f4f;line-height:1.4;">Chicago</h4>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '<table cellpadding="0" cellspacing="0" border="0" class="tables" style="width:100%; border-collapse: collapse; border:1px solid #e2e2e2; text-align: left; margin:0px 0px 30px 0px;">';
    myHtml += '<thead>';
    myHtml += '    <tr>';
    myHtml += '        <th style="font-family: sans-serif; font-size:12px; line-height:1.4;background:#ff4100; color:#fff; text-transform: uppercase; padding:12px;">Item #</th>';
    myHtml += '        <th style="font-family: sans-serif; font-size:12px; line-height:1.4;background:#ff4100; color:#fff; text-transform: uppercase; padding:12px;">Description</th>';
    myHtml += '        <th style="font-family: sans-serif; font-size:12px; line-height:1.4;background:#ff4100; color:#fff; text-transform: uppercase; padding:12px;text-align: right;">Qty</th>';
    myHtml += '        <th style="font-family: sans-serif; font-size:12px; line-height:1.4;background:#ff4100; color:#fff; text-transform: uppercase; padding:12px;text-align: right;">Unit Price</th>';
    myHtml += '        <th style="font-family: sans-serif; font-size:12px; line-height:1.4;background:#ff4100; color:#fff; text-transform: uppercase; padding:12px;text-align: right;">Total</th>';
    myHtml += '        <th style="font-family: sans-serif; font-size:12px; line-height:1.4;background:#ff4100; color:#fff; text-transform: uppercase; padding:12px;">Etd</th>';
    myHtml += '    </tr>';
    myHtml += '</thead>';
    myHtml += '<tbody>';
    $(_items).each(function (index, tr) {
        myHtml += '<tr style="background-color: #f2f2f2;">';
        myHtml += '    <td style="padding:12px;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">' + tr.product_sku + '</td>';
        myHtml += '    <td style="padding:12px;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">' + tr.description + '</td>';
        myHtml += '    <td style="padding:12px;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;">' + tr.qty.toFixed(0) + '</td>';
        myHtml += '    <td style="padding:12px;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;">' + tr.subprice.toFixed(2) + '</td>';
        myHtml += '    <td style="padding:12px;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;">' + tr.total_ht.toFixed(2) + '</td>';
        myHtml += '    <td style="padding:12px;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">' + $('#txtPlanneddateofdelivery').val() + '</td>';
        myHtml += '</tr>';
        total_qty += tr.qty, total_gm += tr.total_ht, total_tax += tr.total_localtax1, total_shamt += tr.total_localtax2, total_discamt += tr.discount, total_net += tr.total_ttc;
    });
    myHtml += '</tbody>';
    myHtml += '<tfoot>';
    myHtml += '    <tr>';
    myHtml += '        <td colspan="2" style="padding:12px;color:#4f4f4f; background: #d0d0d0;font-weight: 600;font-family: sans-serif; font-size:12px; line-height:1.4;">Comments or Special Instructions</td>';
    myHtml += '        <td style="padding:12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;">' + total_qty.toFixed(0) + '</td>';
    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">SubTotal</td>';
    myHtml += '        <td style="padding:12px;background:#F2F2F2;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;">$' + total_gm.toFixed(2) + '</td>';
    myHtml += '        <td style="padding:12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"></td>';
    myHtml += '    </tr>';
    myHtml += '    <tr>';
    myHtml += '        <td colspan="3" style="padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"><b>1</b>,Payment term:' + payment_term + ', ' + balance_days + '</td>';
    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">Discount</td>';
    myHtml += '        <td style="background:#F2F2F2;text-align: right;">$' + total_discamt.toFixed(2) + '</td>';
    myHtml += '        <td></td>';
    myHtml += '    </tr>';
    myHtml += '    <tr>';
    myHtml += '        <td colspan="3" style="padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"><b>2</b>,' + location_incoterms + '</td>';
    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">Tax</td>';
    myHtml += '        <td style="background:#F2F2F2;text-align: right;">$' + total_tax.toFixed(2) + '</td>';
    myHtml += '        <td></td>';
    myHtml += '    </tr>';
    myHtml += '    <tr>';
    myHtml += '        <td colspan="3" style="padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"></td>';
    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">Shipping</td>';
    myHtml += '        <td style="background:#F2F2F2;text-align: right;">$' + total_shamt.toFixed(2) + '</td>';
    myHtml += '        <td></td>';
    myHtml += '    </tr>';
    myHtml += '    <tr>';
    myHtml += '        <td colspan="3" style="padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"></td>';
    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">Other</td>';
    myHtml += '        <td style="background:#F2F2F2;text-align: right;">-</td>';
    myHtml += '        <td></td>';
    myHtml += '    </tr>';
    myHtml += '    <tr>';
    myHtml += '        <td colspan="3" style="padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"></td>';
    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"><b>Total</b></td>';
    myHtml += '        <td style="background:#F2F2F2;padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;"><b>$' + total_net.toFixed(2) + '</b></td>';
    myHtml += '        <td></td>';
    myHtml += '    </tr>';
    myHtml += '    <tr>';
    myHtml += '        <td colspan="3"></td>';
    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:4px 12px 12px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">Deposit</td>';
    myHtml += '        <td style="background:#F2F2F2;padding:4px 12px 12px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;">$0.00</td>';
    myHtml += '        <td></td>';
    myHtml += '    </tr>';
    myHtml += '</tfoot>';
    myHtml += '</table>';

    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '</table>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '</table>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '</table >';

    $('#POModal .modal-body').append(myHtml);

    $("#POModal").modal({ backdrop: 'static', keyboard: false });
    var opt = { strValue1: 'johnson.quickfix@gmail.com', strValue2: $('#lblPoNo').text(), strValue3: $('#POModal .modal-body').html() }
    if (opt.strValue1.length > 5) {
        $.ajax({
            type: "POST", url: '/PurchaseOrder/SendMailInvoice', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
            success: function (result) { console.log(result); },
            error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
            complete: function () { }, async: false
        });
    }
}