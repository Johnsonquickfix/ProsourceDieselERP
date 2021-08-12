$(document).ready(function () {
    $("#loader").hide(); $('.billinfo').prop("disabled", true);
    $('#txtPODate,#txtPlanneddateofdelivery').datepicker({ format: 'mm/dd/yyyy', autoclose: true, todayHighlight: true });
    $(".select2").select2();
    getVendor();
    getMasters();
    $("#ddlVendor").change(function () {
        let today = new Date();
        $('#txtPODate').val(today.toLocaleDateString("en-US"));
        $('.entry-mode-action').empty().append('<button type="button" id="btnOtherProduct" class="btn btn-danger billinfo"><i class="fas fa-cube"></i> Add Other Product</button> ');
        $('.entry-mode-action').append('<button type="button" id="btnService" class="btn btn-danger billinfo"><i class="fas fa-concierge-bell"></i> Add Service</button>');
        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/PurchaseOrder/PurchaseOrderList">Back to List</a><input type="submit" value="Create Order" id="btnSave" class="btn btn-danger billinfo" />');
        $('.billinfo').prop("disabled", false);
        //setTimeout(function () { NewOrderNo(); }, 50); CustomerAddress($("#ddlUser").val()); return false;
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
        getItemList(product_id, vender_id);
    });
    $('#ddlVendor').change(function () {
        var VendorID = $('#ddlVendor').val();
        var obj = { VendorID: VendorID };
        jQuery.ajax({
            url: "/PurchaseOrder/GetVendorByID", dataType: 'json', type: "Post",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            success: function (data) {
                data = JSON.parse(data);
                $('#txtRefvendor').val(data[0].vendor);
            },
            error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
        });
    });
    $('#ddlIncoTerms').change(function () {
        var IncotermsTypeID = $('#ddlIncoTerms').val();
        var obj = { IncotermsTypeID: IncotermsTypeID };
        jQuery.ajax({
            url: "/PurchaseOrder/GetIncotermByID", dataType: 'json', type: "Post",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            success: function (data) {
                data = JSON.parse(data);
                $('#txtIncoTerms').val(data[0].short_description);
            },
            error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
        });
    });
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
    $("#btnSave").click(function () {
        //saveVendor();
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

            //Balance
            $("#ddlIncoTerms").html('<option value="0">Select Incoterms</option>');
            for (i = 0; i < dt['Table3'].length; i++) { $("#ddlIncoTerms").append('<option value="' + dt['Table3'][i].id + '">' + dt['Table3'][i].text + '</option>'); }
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }
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
        }

    });
}

function NewOrderNo() {
    let oid = 0, postMetaxml = [];
    let option = { OrderPostMeta: postMetaxml };
    ajaxFunc('/Orders/GetNewOrderNo', option, beforeSendFun, function (result) { $('#hfOrderNo').val(result.message); $('#lblOrderNo').text('Order #' + result.message + ' detail '); }, completeFun, errorFun);
}

function saveVendor() {
    ID = $("#hfid").val();
    VendorID = $("#ddlVendor").val();
    Vendor = $("#ddlVendor").find('option:selected').text();;

    VendorCode = $("#txtRefvendor").val();
    PaymentTerms = $("#ddlPaymentTerms").val();
    Balancedays = $("#ddlBalancedays").val();
    PaymentType = $("#ddlPaymentType").val();
    Planneddateofdelivery = $("#txtPlanneddateofdelivery").val();
    IncoTermType = $("#ddlIncoTerms").val();
    IncoTerm = $("#txtIncoTerms").val();
    NotePublic = $("#txtNotePublic").val();
    NotePrivate = $("#txtNotePrivate").val();



    if (VendorID == "-1") { swal('alert', 'Please Select Vendor', 'error').then(function () { swal.close(); $('#ddlVendor').focus(); }) }
    else if (VendorCode == "") { swal('alert', 'Please Enter Refvendor', 'error').then(function () { swal.close(); $('#txtRefvendor').focus(); }) }
    else if (PaymentTerms == "-1") { swal('alert', 'Please Select Payment Terms', 'error').then(function () { swal.close(); $('#ddlPaymentTerms').focus(); }) }
    else if (Balancedays == "-1") { swal('alert', 'Please Select Balance days', 'error').then(function () { swal.close(); $('#ddlBalancedays').focus(); }) }
    else if (PaymentType == "-1") { swal('alert', 'Please Select Payment Type', 'error').then(function () { swal.close(); $('#ddlPaymentType').focus(); }) }
    else if (Planneddateofdelivery == "") { swal('alert', 'Please Select Planned date of delivery', 'error').then(function () { swal.close(); $('#txtPlanneddateofdelivery').focus(); }) }
    else if (IncoTermType == "-1") { swal('alert', 'Please Select IncoTerm', 'error').then(function () { swal.close(); $('#ddlIncoTerms').focus(); }) }
    else if (IncoTerm == "") { swal('alert', 'Please Enter IncoTerm', 'error').then(function () { swal.close(); $('#txtIncoTerms').focus(); }) }
    else if (NotePublic == "") { swal('alert', 'Please Enter Note Public', 'error').then(function () { swal.close(); $('#txtNotePublic').focus(); }) }
    else if (NotePrivate == "") { swal('alert', 'Please Enter Note Private', 'error').then(function () { swal.close(); $('#txtNotePrivate').focus(); }) }
    else {
        var obj = {
            rowid: ID, VendorID: VendorID, Vendor: Vendor, VendorCode: VendorCode, PaymentTerms: PaymentTerms, Balancedays: Balancedays,
            PaymentType: PaymentType, Planneddateofdelivery: Planneddateofdelivery,
            IncotermType: IncoTermType, Incoterms: IncoTerm, note_public: NotePublic, note_private: NotePrivate,
        }
        $.ajax({
            url: '/PurchaseOrder/NewPurchase/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success');
                    $("#parent").find(":input").each(function () {
                        switch (this.type) { case "text": case "email": case "tel": $(this).val(''); break; }
                    });
                    //window.location = "../../PurchaseOrder/PurchaseList";
                }
                else {
                    //swal('Alert!', data.message, 'error')
                }
            },
            complete: function () {
                $("#loader").hide();
            },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
        })
    }

}
function GetPurchaseOrderByID(id) {
    var rowid = id;
    /* if (rowid == "NewVendor") { $('#lbltitle').text("Add New Vendor"); } else { $('#lbltitle').text("Update Vendor"); }*/
    var obj =
        $.ajax({
            url: "/PurchaseOrder/GetPurchaseOrderByID/" + rowid,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            success: function (data) {
                var d = JSON.parse(data);
                if (d.length > 0) {
                    $('#lblRequestAuthor').text(d[0].RequestAuthor);
                    $('#lblVendor').text(d[0].VendorName);
                    $('#lblRefvendor').text(d[0].RefOrderVendor);
                    $('#lblPaymentTerms').text(d[0].PaymentTerm);
                    $('#lblBalance').text(d[0].Balance);
                    $('#lblPaymentType').text(d[0].PaymentType);
                    $('#lblPlanneddateofdelivery').text(d[0].PlannedDateofDelivery);
                    $('#lblIncoterms').text(d[0].incoterms);
                    $('#lblNotePublic').text(d[0].note_public);
                    $('#lblNotePrivate').text(d[0].note_private);

                }
            },
            error: function (msg) {

            }
        });

}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Item Tab Section ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getItemList(product_id, vender_id) {
    let option = { strValue1: product_id, strValue2: vender_id };
    let tax_rate = 0.00;
    $.ajax({
        type: "get", url: '/PurchaseOrder/SearchProductDetails', contentType: "application/json; charset=utf-8", dataType: "json", data: option,
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let _items = [];
            for (var i = 0; i < data.length; i++) {
                _items.push({
                    rowid: 0, rang: 0, fk_product: data[i].fk_product, description: data[i].description, product_sku: data[i].product_sku, qty: data[i].qty, subprice: data[i].subprice, discount_percent: 0, total_ht: (data[i].subprice * data[i].qty), tax_amount: 0, total_ttc: (data[i].subprice * data[i].qty)
                });
            }
            //Bind Items
            bindItems(_items);
        },
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
                    itemHtml += '<tr id="tritemid_' + data[i].fk_product + '" class="paid_item" data-pid="' + data[i].fk_product + '" data-pname="' + data[i].description + '" data-rowid="' + data[i].rowid + '">';
                    itemHtml += '<td class="text-center"><button class="btn menu-icon-gr text-red btnDeleteItem billinfo" onclick="removeItems(\'' + data[i].fk_product + '\');"> <i class="glyphicon glyphicon-trash"></i> </button></td>';
                    itemHtml += '<td>' + data[i].description + '</td><td>' + data[i].product_sku + '</td>';
                    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + data[i].fk_product + '" value="' + data[i].subprice + '" name="txt_itemprice" placeholder="Price"></td>';
                    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemqty_' + data[i].fk_product + '" value="' + data[i].qty + '" name="txt_itemqty" placeholder="Qty."></td>';
                    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemdisc_' + data[i].fk_product + '" value="' + data[i].discount_percent + '" name="txt_itemdisc" placeholder="Discount"></td>';
                    itemHtml += '<td class="text-right tax-amount">' + data[i].tax_amount + '</td>';
                    itemHtml += '<td class="text-right row-total">' + data[i].total_ttc.toFixed(2) + '</td>';
                    itemHtml += '</tr>';
                }
                else {
                    $('#txt_itemqty_' + data[i].rowid).val((parseFloat($('#txt_itemqty_' + data[i].rowid).val()) + data[i].qty).toFixed(2));
                }
            }
        }
        $('#line_items').append(itemHtml);
        $("#divAddItemFinal").find(".rowCalulate").change(function () { calculateFinal(); });
    }
    else {
        layoutHtml += '<table id="tblAddItemFinal" class="table-blue table table-bordered table-striped dataTable">';
        layoutHtml += '<thead>';
        layoutHtml += '<tr>';
        layoutHtml += '<th class="text-center" style="width: 8%">Actions</th>';
        layoutHtml += '<th style = "width: 32%" > Description</th >';
        layoutHtml += '<th style="width: 10%">Vendor SKU</th>';
        layoutHtml += '<th class="text-right" style="width: 10%">Price</th>';
        layoutHtml += '<th class="text-right" style="width: 10%">Quantity</th>';
        layoutHtml += '<th class="text-right" style="width: 10%">Discount(%)</th>';
        layoutHtml += '<th class="text-right" style="width: 10%">Tax</th>';
        layoutHtml += '<th class="text-right" style="width: 10%">Total</th>';
        layoutHtml += '</tr>';
        layoutHtml += '</thead>';
        layoutHtml += '<tbody id="line_items"></tbody><tbody id="fee_line_items"></tbody>';
        layoutHtml += '</table>';
        $('#divAddItemFinal').empty().html(layoutHtml);
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
    let tGrossAmount = 0.00, tDisAmt = 0.00, tTotalTax = 0.00, tTotal = 0.00;
    //main item
    $("#line_items > tr.paid_item").each(function (index, row) {
        let rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rDisAmt = 0.00, rTaxAmt = 0.00, rGrossAmount = 0.00, rTotalAmount = 0.00;
        rPrice = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_itemqty]").val()) || 0.00;
        rDisPer = parseFloat($(row).find("[name=txt_itemdisc]").val()) || 0.00;
        rGrossAmount = rPrice * rQty; rDisAmt = rGrossAmount * (rDisPer / 100);
        rTaxAmt = (rGrossAmount - rDisAmt) * 0;
        rTotalAmount = (rGrossAmount - rDisAmt) + rTaxAmt;
        $(row).find(".tax-amount").text(rTaxAmt.toFixed(2)); $(row).find(".row-total").text(rTotalAmount.toFixed(2));
        tGrossAmount += rGrossAmount, tDisAmt += rDisAmt, tTotalTax += rTaxAmt, tTotal += rTotalAmount;
    });
    //other item
    $("#product_line_items > tr.other_item").each(function (index, row) {
        let rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rDisAmt = 0.00, rTaxAmt = 0.00, rGrossAmount = 0.00, rTotalAmount = 0.00;
        rPrice = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_itemqty]").val()) || 0.00;
        rDisPer = parseFloat($(row).find("[name=txt_itemdisc]").val()) || 0.00;
        rGrossAmount = rPrice * rQty; rDisAmt = rGrossAmount * (rDisPer / 100);
        rTaxAmt = (rGrossAmount - rDisAmt) * 0;
        rTotalAmount = (rGrossAmount - rDisAmt) + rTaxAmt;
        $(row).find(".tax-amount").text(rTaxAmt.toFixed(2)); $(row).find(".row-total").text(rTotalAmount.toFixed(2));
        tGrossAmount += rGrossAmount, tDisAmt += rDisAmt, tTotalTax += rTaxAmt, tTotal += rTotalAmount;
    });
    $("#SubTotal").text(tGrossAmount.toFixed(2));
    $("#discountTotal").text(tDisAmt.toFixed(2));
    $("#salesTaxTotal").text(tTotalTax.toFixed(2));
    $("#orderTotal").html(tTotal.toFixed(2));
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
        itemHtml += '<button class="btn billinfo" onclick="AddProductModal(\'' + proc_type + '\',\'' + row_num + '\');"><i class="glyphicon glyphicon-edit"></i></button>';
        itemHtml += '<button class="btn text-red billinfo" onclick="removeItems(\'' + row_num + '\');"><i class="glyphicon glyphicon-trash"></i></button>';
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

//function getItemList() {
//    var res = $('#ddlProduct').val().split('$');
//    var pid = parseInt(res[0]) || 0, vid = parseInt(res[1]) || 0;
//    var obj = { strValue1: pid, strValue2: vid };
//    var tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00;
//    $.ajax({
//        type: "POST", url: '/PurchaseOrder/GetProductInfo', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
//        beforeSend: function () { $("#loader").show(); },
//        success: function (data) {
//            var itemsDetailsxml = [], auto_code = [];
//            for (var i = 0; i < data.length; i++) {
//                let coupon_amt = 0.00, coupon_type = 'fixed_product', row_key = data[i].product_id + '_' + data[i].variation_id;

//                itemsDetailsxml.push({
//                    PKey: row_key, product_id: data[i].product_id, variation_id: data[i].variation_id, product_name: data[i].product_name, quantity: data[i].quantity, reg_price: data[i].reg_price, sale_rate: data[i].sale_price, total: (data[i].reg_price * data[i].quantity), discount_type: coupon_type, discount: coupon_amt, tax_amount: (((data[i].reg_price * data[i].quantity) * tax_rate) / 100).toFixed(2), shipping_amount: 0, is_free: data[i].is_free, group_id: data[i].group_id, order_item_id: 0
//                });
//            }
//        },
//        complete: function () { $("#loader").hide(); },
//        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
//        async: false
//    });
//}