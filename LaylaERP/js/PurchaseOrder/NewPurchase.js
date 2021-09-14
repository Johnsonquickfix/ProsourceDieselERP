$(document).ready(function () {
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
        let VendorID = parseInt($('#ddlVendor').val()) || 0;
        getVendorProducts(VendorID);
        setTimeout(function () {
            let _details = getVendorDetails();
            if (_details.length > 0) {
                $('#txtRefvendor').val(_details[0].code_vendor);
                $('#ddlPaymentTerms').val((parseInt(_details[0].PaymentTermsID) || 0)).trigger('change');
                $('#ddlBalancedays').val((parseInt(_details[0].BalanceID) || 0)).trigger('change');
                $('#ddlIncoTerms').val((parseInt(_details[0].fk_incoterms) || 0)).trigger('change');
                $('#ddlPaymentType').val((parseInt(_details[0].Paymentmethod) || 0)).trigger('change');
                $('#txtIncoTerms').val(_details[0].location_incoterms);
            }
        }, 50);
    });
    //$('#ddlProduct').select2({
    //    allowClear: true, minimumInputLength: 3, placeholder: "Search Product",
    //    ajax: {
    //        url: '/PurchaseOrder/SearchProducts', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
    //        data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
    //        processResults: function (data) { var jobj = JSON.parse(data); return { results: jobj }; },
    //        error: function (xhr, status, err) { }, cache: true
    //    }
    //});
    $("#ddlProduct").change(function () {
        let product_id = parseInt($('#ddlProduct').val()) || 0, vender_id = parseInt($('#ddlVendor').val()) || 0;
        getItemList(product_id, vender_id); //$('#ddlProduct').val('').trigger('change');
    });
    $('#ddlIncoTerms').change(function () {
        let IncotermsTypeID = parseInt($('#ddlIncoTerms').val()) || 0;
        let obj = { IncotermsTypeID: IncotermsTypeID };
        if (IncotermsTypeID > 0) {
            $.ajax({
                url: "/PurchaseOrder/GetIncotermByID", dataType: 'json', type: "Post", contentType: "application/json; charset=utf-8",
                data: JSON.stringify(obj),
                success: function (data) {
                    data = JSON.parse(data); $('#txtIncoTerms').val(data[0].short_description);
                },
                error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
            });
        }
        else { $('#txtIncoTerms').val(''); }
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
    $(document).on("click", "#btnPrintPdf", function (t) {
        t.preventDefault();
        let id = parseInt($('#lblPoNo').data('id')) || 0;
        getPurchaseOrderPrint(id, false);
    });
    $(document).on("click", ".btnApproved", function (t) {
        t.preventDefault();
        let id = parseInt($('#lblPoNo').data('id')) || 0;
        orderStatusUpdate(id);
    });
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

            //Incoterms
            $("#ddlIncoTerms").html('<option value="0">Select Incoterms</option>');
            for (i = 0; i < dt['Table3'].length; i++) { $("#ddlIncoTerms").append('<option value="' + dt['Table3'][i].id + '">' + dt['Table3'][i].text + '</option>'); }

            //Warehouse
            $("#ddlWarehouse").html('<option value="0">Select Warehouse</option>');
            for (i = 0; i < dt['Table4'].length; i++) { $("#ddlWarehouse").append('<option value="' + dt['Table4'][i].id + '">' + dt['Table4'][i].text + '</option>'); }
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
function getVendorProducts(VendorID) {
    $('#line_items').empty(); calculateFinal();
    $.ajax({
        url: '/PurchaseOrder/GetVenderProducts', dataType: 'json', type: "get", contentType: "application/json; charset=utf-8",
        data: { strValue1: VendorID },
        success: function (data) {
            let dt = JSON.parse(data);
            //Payment Terms
            $("#ddlProduct").html('<option value="0">Select Product</option>');
            for (i = 0; i < dt.length; i++) { $("#ddlProduct").append('<option value="' + dt[i].id + '">' + dt[i].text + '</option>'); }

        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }, async: false
    });
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
                    itemHtml += '<td class="text-right tax-amount" data-tax1="' + data[i].localtax1_tx + '" data-tax2="' + data[i].localtax2_tx + '">' + data[i].total_localtax1 + '</td>';
                    itemHtml += '<td class="text-right ship-amount">' + data[i].total_localtax2 + '</td>';
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
        $(row).find(".tax-amount").text(rTax_Amt1.toFixed(2)); $(row).find(".ship-amount").text(rTax_Amt2.toFixed(2)); $(row).find(".row-total").text(rNetAmt.toFixed(2));
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
        itemHtml += '<td class="text-right tax-amount">0.00</td><td class="text-right ship-amount">0.00</td>';
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
                    let data = JSON.parse(result); let VendorID = 0; console.log(data);
                    for (let i = 0; i < data['po'].length; i++) {
                        VendorID = parseInt(data['po'][i].fk_supplier) || 0;
                        $('#lblPoNo').text(data['po'][i].ref); $('#txtRefvendor').val(data['po'][i].ref_supplier); $('#txtPODate').val(data['po'][i].date_creation);
                        $('#ddlVendor').val(data['po'][i].fk_supplier).trigger('change');
                        $('#ddlPaymentTerms').val(data['po'][i].fk_payment_term).trigger('change');
                        $('#ddlBalancedays').val(data['po'][i].fk_balance_days).trigger('change');
                        $('#ddlIncoTerms').val(data['po'][i].fk_incoterms).trigger('change');
                        $('#ddlPaymentType').val(data['po'][i].fk_payment_type).trigger('change');
                        $('#txtNotePublic').val(data['po'][i].note_public); $('#txtNotePrivate').val(data['po'][i].note_private);
                        $('#txtIncoTerms').val(data['po'][i].location_incoterms);
                        $('#ddlWarehouse').val(data['po'][i].fk_warehouse).trigger('change');
                        if (!data['po'][i].date_livraison.includes('00/00/0000')) $('#txtPlanneddateofdelivery').val(data['po'][i].date_livraison);

                        if (data['po'][i].fk_status == '1')
                            $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/PurchaseOrder/PurchaseOrderList">Back to List</a><button type="button" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button> <button type="button" class="btn btn-danger btnApproved"><i class="fas fa-check-double"></i> Approved</button>');
                        else
                            $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/PurchaseOrder/PurchaseOrderList">Back to List</a><button type="button" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
                    }
                    getVendorProducts(VendorID);
                    for (let i = 0; i < data['pod'].length; i++) {
                        let itemHtml = '';
                        if (data['pod'][i].fk_product > 0) {
                            itemHtml = '<tr id="tritemid_' + data['pod'][i].fk_product + '" class="paid_item" data-pid="' + data['pod'][i].fk_product + '" data-pname="' + data['pod'][i].description + '" data-psku="' + data['pod'][i].product_sku + '" data-rowid="' + data['pod'][i].rowid + '">';
                            itemHtml += '<td class="text-center"><button class="btn p-0 text-red btnDeleteItem billinfo" onclick="removeItems(\'' + data['pod'][i].fk_product + '\');"> <i class="glyphicon glyphicon-trash"></i> </button></td>';
                            itemHtml += '<td>' + data['pod'][i].description + '</td><td>' + data['pod'][i].product_sku + '</td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].subprice.toFixed(2) + '" name="txt_itemprice" placeholder="Price"></td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemqty_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].qty.toFixed(0) + '" name="txt_itemqty" placeholder="Qty."></td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemdisc_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].discount_percent.toFixed(2) + '" name="txt_itemdisc" placeholder="Discount"></td>';
                            itemHtml += '<td class="text-right tax-amount" data-tax1="' + data['pod'][i].localtax1_tx + '" data-tax2="' + data['pod'][i].localtax2_tx + '">' + data['pod'][i].total_localtax1.toFixed(2) + '</td>';
                            itemHtml += '<td class="text-right ship-amount">' + data['pod'][i].total_localtax2.toFixed(2) + '</td>';
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
                            itemHtml += '<td class="text-right ship-amount">' + data['pod'][i].total_localtax2.toFixed(2) + '</td>';
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
    let wh_id = parseInt($("#ddlWarehouse").val()) || 0;
    let incoterms = parseInt($("#ddlIncoTerms").val()) || 0;
    let location_incoterms = $("#txtIncoTerms").val();
    let note_public = $("#txtNotePublic").val();
    let note_private = $("#txtNotePrivate").val();
    let _list = createItemsList();
    if (vendorid <= 0) { swal('alert', 'Please Select Vendor', 'error').then(function () { swal.close(); $('#ddlVendor').focus(); }) }
    else if (payment_type <= 0) { swal('alert', 'Please Select Payment Type', 'error').then(function () { swal.close(); $('#ddlPaymentType').focus(); }) }
    else if (date_livraison == "") { swal('alert', 'Please Select Planned date of delivery', 'error').then(function () { swal.close(); $('#txtPlanneddateofdelivery').focus(); }) }
    else if (_list.length <= 0) { swal('Alert!', 'Please add product.', "error").then((result) => { $('#ddlProduct').select2('open'); return false; }); return false; }
    else {
        if (date_livraison.length > 0) date_livraison = date_livraison[2] + '/' + date_livraison[0] + '/' + date_livraison[1];
        let option = {
            RowID: id, VendorID: vendorid, PONo: '', VendorBillNo: ref_vendor, fk_warehouse: wh_id, PaymentTerms: payment_term, Balancedays: balance_days, PaymentType: payment_type,
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
                    swal('Alert!', data.message, 'success').then(function () { swal.close(); getPurchaseOrderPrint(id, true); });
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
function orderStatusUpdate(oid) {
    let obj = { Search: oid, Status: '3' }
    $.ajax({
        url: '/PurchaseOrder/UpdatePurchaseOrderStatus', dataType: 'JSON', type: 'get',
        contentType: "application/json; charset=utf-8",
        data: obj,
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            if (data.status == true) { swal('alert', data.message, 'success').then((result) => { window.location.href = window.location.origin + "/PurchaseOrder/PurchaseOrderList"; }); }
            else { swal('alert', 'something went wrong!', 'success'); }
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); }
    });
}