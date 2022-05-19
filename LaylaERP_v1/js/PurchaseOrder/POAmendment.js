$(document).ready(function () {
    $("#loader").hide(); $('.billinfo').prop("disabled", true);
    $('#txtPODate,#txtPlanneddateofdelivery').datepicker({ format: 'mm/dd/yyyy', autoclose: true, todayHighlight: true });
    $(".select2").select2();
    $.when(getVendor(), getMasters()).done(function () { getPurchaseOrderInfo(); });
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
    $('#txtPlanneddateofdelivery').change(function () {
        let date1 = new Date($('#txtPODate').val()), date2 = new Date($('#txtPlanneddateofdelivery').val());
        var Difference_In_Time = date2.getTime() - date1.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        $('#lblPlannedDays').text("(Planned Days : " + parseInt(Difference_In_Days) + ")");
    });
    $('#ddlWarehouse').change(function (t) {
        t.preventDefault(); $('#txtWarehouseAddress').val($(this).find(':selected').data('ad'))
    });
    $(document).on("click", ".btnEdit", function (t) {
        t.preventDefault(); $("#loader").show(); isEdit(true);
        ActivityLog('PO Amendment Edit', '/PurchaseOrder/po-amendment?id=' + $('#lblPoNo').data('id') + '');
        $('#ddlVendor').prop("disabled", true); $('.billinfo,.orderfiles').prop("disabled", false); //$('#txtbillfirstname').focus();
        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/PurchaseOrder/PurchaseOrderList">Back to List</a><button type="button" class="btn btn-danger btnUndoRecord" data-toggle="tooltip" title="Cancel"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" class="btn btn-danger" id="btnSave" data-toggle="tooltip" title="Update"><i class="far fa-save"></i> Update</button>');
        $('.entry-mode-action').append('<button type="button" id="btnService" class="btn btn-danger billinfo"><i class="fas fa-concierge-bell"></i> Add Service</button>');
        $(".top-action").empty().append('<button type="button" class="btn btn-danger btnUndoRecord" data-toggle="tooltip" title="Cancel" data-placement="left"><i class="fa fa-undo"></i> Cancel</button> <button type="button" class="btn btn-danger" id="btnSave" data-toggle="tooltip" title="Update" data-placement="bottom"><i class="far fa-save"></i> Update</button>');
        $('[data-toggle="tooltip"]').tooltip(); $("#loader").hide();
    });
    $(document).on("click", ".btnUndoRecord", function (t) {
        t.preventDefault(); let _text = 'Are you sure you want to undo changes this PO ' + $('#lblPoNo').text() + '?';
        swal({ title: '', text: _text, type: "question", showCancelButton: true }).then((result) => { if (result.value) { window.location.href = window.location.origin + "/PurchaseOrder/po-amendment?id=" + $('#lblPoNo').data('id'); } });
    });
    $(document).on("click", "#btnSave", function (t) { t.preventDefault(); saveVendorPO(); });
    $(document).on("click", "#btnPrintPdf", function (t) {
        t.preventDefault();
        let id = parseInt($('#lblPoNo').data('id')) || 0;
        getPurchaseOrderPrint(id, false);
    });
    $(document).on("click", ".btnApproved", function (t) {
        t.preventDefault(); let id = parseInt($('#lblPoNo').data('id')) || 0; orderApprove(id, 'approve', 3);
    });
    $(document).on("click", ".btnReject", function (t) {
        t.preventDefault(); let id = parseInt($('#lblPoNo').data('id')) || 0; orderApprove(id, 'disapprove', 8);
    });
    $(document).on('click', "#btnuploade", function (t) {
        t.preventDefault(); Adduploade();
    });
    $(document).on("click", "#btnService", function (t) { t.preventDefault(); AddProductModal(1, 0); });
    $("#POModal").on("click", "#btnAddProc", function (t) {
        t.preventDefault();
        let rang = parseInt($(this).data('rang')) || 0, proc_type = parseInt($('#ddl_service_type').val()) || 0;
        bindOtherItems(proc_type, rang);
    });
});
function isNullAndUndef(variable) { return (variable !== null && variable !== undefined && variable !== 'undefined' && variable !== 'null' && variable.length !== 0); }
function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}
function getMasters() {
    let option = { strValue1: 'GETMD', strValue2: 0 };
    $.ajax({
        url: "/PurchaseOrder/GetAllMaster", data: option, type: "Get", beforeSend: function () { $("#loader").show(); },
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
            //for (i = 0; i < dt['Table4'].length; i++) { $("#ddlWarehouse").append('<option value="' + dt['Table4'][i].id + '" data-ad="' + dt['Table4'][i].address + '">' + dt['Table4'][i].text + '</option>'); }
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }, async: false
    });
}
function getVendorWarehouse(VendorID) {
    let option = { strValue1: 'GEVWH', strValue2: VendorID };
    $.ajax({
        url: "/PurchaseOrder/GetAllMaster", data: option, type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            $("#ddlWarehouse").html('<option value="0">Select Warehouse</option>');
            for (i = 0; i < dt['Table'].length; i++) { $("#ddlWarehouse").append('<option value="' + dt['Table'][i].id + '" data-ad="' + dt['Table'][i].address + '">' + dt['Table'][i].text + '</option>'); }
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
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Add Other Product and Services ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function AddProductModal(proc_type, row_num) {
    let row = $('#tritemid_' + row_num);
    let rDesc = row.find('.item-desc').text(), rSku = row.find('.item-sku').text(), rSDate = '', rEDate = '', rQty = 0.00, rPrice = 0.00, rDescPer = 0.00, rTotal = 0.00;
    rQty = parseInt(row.find("[name=txt_itemqty]").val()) || 1;
    rPrice = parseFloat(row.find("[name=txt_itemprice]").val()) || 0;
    rDescPer = parseFloat(row.find("[name=txt_itemdisc]").val()) || 0;
    rTotal = parseFloat(row.find(".row-total").text()) || 0;
    rSDate = isNullAndUndef(row.data('proc_fromdate')) ? row.data('proc_fromdate') : $('#txtPODate').val();
    rEDate = isNullAndUndef(row.data('proc_todate')) ? row.data('proc_todate') : $('#txtPODate').val();

    var prodHtml = '<div class="modal-dialog">';
    prodHtml += '<div class="modal-content">';
    prodHtml += '<div class="modal-header">';
    prodHtml += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    prodHtml += '<h4 class="modal-title" id="myModalLabel">Add ' + (proc_type == 0 ? 'Other Product' : 'Service') + '</h4>';
    prodHtml += '</div>';
    prodHtml += '<div class="modal-body">';

    if (proc_type == 0) {
        prodHtml += '<div class="row">';
        prodHtml += '<div class="col-md-12">Description<span class="text-red">*</span>';
        prodHtml += '<input class="form-control" type="input" id="txt_proc_desc" placeholder="Description" maxlength="250" autocomplete="off" value="' + rDesc + '">';
        prodHtml += '</div>';
        prodHtml += '<div class="col-md-12">Vender SKU';
        prodHtml += '<input class="form-control" type="input" id="txt_proc_sku" placeholder="Vender SKU" maxlength="150" autocomplete="off" value="' + rSku + '">';
        prodHtml += '</div>';
    }
    else {
        prodHtml += '<div class="row">';
        prodHtml += '<div class="col-md-6">Service Type<span class="text-red">*</span>';
        prodHtml += '<select class="form-control" id="ddl_service_type" placeholder="Select Service Type"><option value="1">Shipping</option><option value="2">Tax</option><option value="3">Other Fee</option></select>';
        prodHtml += '</div>';
        prodHtml += '<div class="col-md-6">Description<span class="text-red">*</span>';
        prodHtml += '<input class="form-control" type="input" id="txt_proc_desc" placeholder="Description" maxlength="250" autocomplete="off" value="' + rDesc + '">';
        prodHtml += '</div>';
    }
    prodHtml += '<div class="col-md-6">Amount<span class="text-red">*</span>';
    prodHtml += '<input class="form-control addCalulate" type="number" id="txt_proc_price" placeholder="Price" maxlength="20" autocomplete="off" value="' + rPrice.toFixed(2) + '">';
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
    $("#ddl_service_type").val(proc_type);
    $('.date-picker').datepicker({ format: 'mm/dd/yyyy', autoclose: true, todayHighlight: true });
}
function bindOtherItems(proc_type, row_num) {
    let rDesc = '', rSku = '', rSDate = '00/00/0000', rEDate = '00/00/0000', rQty = 0.00, rPrice = 0.00, rDescPer = 0.00, rTotal = 0.00;
    if (row_num == 0) row_num = (parseInt($('#product_line_items tr:last').data("rang")) || 0) + 1;
    rDesc = $("#txt_proc_desc").val();
    if (rDesc == "") { swal('alert', 'Please Enter Description.', 'error').then(function () { swal.close(); $('#txt_proc_desc').focus(); }); return false; }
    if ($('#txt_proc_qty').val() == "") { swal('alert', 'Please Enter Quantity.', 'error').then(function () { swal.close(); $('#txt_proc_qty').focus(); }); return false; }
    if ($('#txt_proc_price').val() == "") { swal('alert', 'Please Enter Price.', 'error').then(function () { swal.close(); $('#txt_proc_price').focus(); }); return false; }
    if (proc_type == 0) { rSku = $("#txt_proc_sku").val(), rSDate = rEDate = $("#txtPODate").val(); }
    else { rSDate = $("#txtPODate").val(), rEDate = $("#txtPODate").val(); }
    rQty = 1.00, rPrice = parseFloat($("#txt_proc_price").val()) || 0.00, rDescPer = 0.00;
    rTotal = rPrice * rQty;
    let itemHtml = '';
    if ($('#tritemid_' + row_num).length <= 0) {
        itemHtml += '<tr id="tritemid_' + row_num + '" class="other_item" data-rowid="0" data-rang="' + row_num + '" data-proc_type="' + proc_type + '" data-proc_fromdate="' + rSDate + '" data-proc_todate="' + rEDate + '">';
        itemHtml += '<td><span class="item-desc">' + rDesc + '</span> ';
        itemHtml += '<button class="btn p-0 billinfo" onclick="AddProductModal(\'' + proc_type + '\',\'' + row_num + '\');" data-toggle="tooltip" title="Edit other product and services"><i class="glyphicon glyphicon-edit"></i></button>';
        itemHtml += '<button class="btn p-0 text-red billinfo" onclick="removeItems(\'' + row_num + '\');" data-toggle="tooltip" title="Delete other product and services"><i class="glyphicon glyphicon-trash"></i></button>';
        itemHtml += '</td > ';
        itemHtml += '<td class="item-sku">' + rSku + '</td>';
        //itemHtml += '<td class="item-desc">' + rDesc + '</td><td class="item-sku">' + rSku + '</td>';
        itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + row_num + '" value="' + rPrice.toFixed(2) + '" name="txt_itemprice" placeholder="Price"></td>';
        itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number ' + (proc_type > 0 ? '' : 'rowCalulate') + '" type="number" id="txt_itemqty_' + row_num + '" value="' + rQty.toFixed(0) + '" name="txt_itemqty" placeholder="Qty." ' + (proc_type > 0 ? 'disabled' : '') + '></td>';
        itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number ' + (proc_type > 0 ? '' : 'rowCalulate') + '" type="number" id="txt_itemdisc_' + row_num + '" value="' + rDescPer.toFixed(2) + '" name="txt_itemdisc" placeholder="Discount" ' + (proc_type > 0 ? 'disabled' : '') + '></td>';
        itemHtml += '<td class="text-right tax-amount">0.00</td><td class="text-right ship-amount">0.00</td>';
        itemHtml += '<td class="text-right row-total">' + rTotal.toFixed(2) + '</td>';
        itemHtml += '</tr>';
        $('#product_line_items').append(itemHtml);
    }
    else {
        $('#tritemid_' + row_num).data('proc_type', proc_type);
        $('#tritemid_' + row_num).data('proc_fromdate', rSDate); $('#tritemid_' + row_num).data('proc_todate', rEDate);
        $('#tritemid_' + row_num).find('.item-desc').text(rDesc); $('#tritemid_' + row_num).find('.item-sku').text(rSku);
        $('#tritemid_' + row_num).find("[name=txt_itemprice]").val(rPrice.toFixed(2));
        $('#tritemid_' + row_num).find("[name=txt_itemqty]").val(rQty);
        $('#tritemid_' + row_num).find("[name=txt_itemdisc]").val(rDescPer);
        $('#tritemid_' + row_num).find(".tax-amount").text(0.00); $('#tritemid_' + row_num).find('.row-total').text(rTotal);
    }
    $("#POModal").modal('hide');
    $("#product_line_items").find(".rowCalulate").change(function () { calculateFinal(); });
    calculateFinal();
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Item Tab Section ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function calculateFinal() {
    let tGrossAmt = 0.00, tQty = 0.00, tDisAmt = 0.00, tTax_Amt1 = 0.00, tTax_Amt2 = 0.00, tOther_Amt = 0.00, tNetAmt = 0.00;
    //main item
    $("#line_items > tr.paid_item").each(function (index, row) {
        let rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rGrossAmt = 0.00, rDisAmt = 0.00, rTax1 = 0.00, rTax_Amt1 = 0.00, rTax2 = 0.00, rTax_Amt2 = 0.00, rNetAmt = 0.00;
        rPrice = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_itemqty]").val()) || 0.00;
        rDisPer = parseFloat($(row).find("[name=txt_itemdisc]").val()) || 0.00;
        rTax1 = parseFloat($(row).find(".tax-amount").data('tax1')) || 0.00; rTax2 = parseFloat($(row).find(".tax-amount").data('tax2')) || 0.00;
        tQty += rQty; rGrossAmt = rPrice * rQty; rDisAmt = rGrossAmt * (rDisPer / 100);
        rTax_Amt1 = rTax1 * rQty; rTax_Amt2 = rTax2 * rQty;
        rNetAmt = (rGrossAmt - rDisAmt) + rTax_Amt1 + rTax_Amt2;
        $(row).find(".tax-amount").text(rTax_Amt1.toFixed(2)); $(row).find(".ship-amount").text(rTax_Amt2.toFixed(2)); $(row).find(".row-total").text(rNetAmt.toFixed(2));
        tGrossAmt += rGrossAmt, tDisAmt += rDisAmt, tTax_Amt1 += rTax_Amt1, tTax_Amt2 += rTax_Amt2, tNetAmt += rNetAmt;
    });
    //other item
    $("#product_line_items > tr.other_item").each(function (index, row) {
        let proc_type = 0, rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rDisAmt = 0.00, rTax_Amt1 = 0.00, rGrossAmt = 0.00, rNetAmt = 0.00;
        proc_type = parseInt($(row).data("proc_type")) || 0;
        rPrice = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_itemqty]").val()) || 0.00;
        rDisPer = parseFloat($(row).find("[name=txt_itemdisc]").val()) || 0.00;
        rGrossAmt = rPrice * rQty; rDisAmt = rGrossAmt * (rDisPer / 100);
        rNetAmt = (rGrossAmt - rDisAmt) + rTax_Amt1;
        $(row).find(".tax-amount").text(rTax_Amt1.toFixed(2)); $(row).find(".row-total").text(rNetAmt.toFixed(2));
        tGrossAmt += 0;
        tDisAmt += rDisAmt, tTax_Amt1 += rTax_Amt1, tNetAmt += rNetAmt;
        if (proc_type == 1) tTax_Amt2 += rNetAmt;
        else if (proc_type == 2) tTax_Amt1 += rNetAmt;
        else if (proc_type == 3) tOther_Amt += rNetAmt;
        else {
            tQty += rQty, tGrossAmt += rGrossAmt;
        }
    });

    $(".thQuantity").text(tQty.toFixed(0));
    $("#SubTotal").text(tGrossAmt.toFixed(2));
    $("#discountTotal").text(tDisAmt.toFixed(2));
    $("#salesTaxTotal").text(tTax_Amt1.toFixed(2));
    $("#shippingTotal").text(tTax_Amt2.toFixed(2));
    $("#otherTotal").text(tOther_Amt.toFixed(2));
    $("#orderTotal").html(tNetAmt.toFixed(2));
    let paid_amt = parseFloat($('#paidTotal').text()) || 0.00;
    $('#unpaidTotal').text((tNetAmt - paid_amt).toFixed(2))
    $('[data-toggle="tooltip"]').tooltip();
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Edit Purchase Order ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getPurchaseOrderInfo() {
    $('#divAlert').empty();
    let oid = parseInt($('#lblPoNo').data('id')) || 0;
    if (oid > 0) {
        $('#ddlVendor,.billinfo').prop("disabled", true); $(".order-files").removeClass('hidden'); $('.orderfiles').prop("disabled", false)
        $('.page-heading').text('PO Amendment');
        $('#line_items,#product_line_items').empty();
        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/PurchaseOrder/PurchaseOrderList" data-toggle="tooltip" title="Back to List" data-placement="right">Back to List</a>');
        var option = { strValue1: oid };
        $.ajax({
            url: "/PurchaseOrder/GetPurchaseOrderByID", type: "Get", beforeSend: function () { $("#loader").show(); }, data: option,
            success: function (result) {
                //try {
                let data = JSON.parse(result); let VendorID = 0, status_id = 0, fk_projet = 0, fk_user_approve = 0;
                $.each(data['po'], function (key, row) {
                    VendorID = parseInt(row.fk_supplier) || 0; status_id = parseInt(row.fk_status) || 0; fk_projet = parseInt(row.fk_projet) || 0;
                    $('#lblPoNo').text(row.ref); $('#txtRefvendor').val(row.ref_supplier); $('#txtPODate').val(row.date_creation);
                    $('#ddlVendor').val(row.fk_supplier).trigger('change');
                    $('#ddlPaymentTerms').val(row.fk_payment_term).trigger('change');
                    $('#ddlBalancedays').val(row.fk_balance_days).trigger('change');
                    $('#ddlIncoTerms').val(row.fk_incoterms).trigger('change');
                    $('#ddlPaymentType').val(row.fk_payment_type).trigger('change');
                    $('#txtNotePublic').val(row.note_public); $('#txtNotePrivate').val(row.note_private);
                    $('#txtIncoTerms').val(row.location_incoterms); getVendorWarehouse(VendorID);
                    $('#ddlWarehouse').val(row.fk_warehouse).trigger('change');
                    $('#txtWarehouseAddress').val($('#ddlWarehouse').find(':selected').data('ad'))
                    if (!row.date_livraison.includes('00/00/0000')) $('#txtPlanneddateofdelivery').val(row.date_livraison);
                    let date1 = new Date(row.date_creation), date2 = new Date(row.date_livraison);
                    var Difference_In_Time = date2.getTime() - date1.getTime();
                    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
                    $('#lblPlannedDays').text("(Planned Days : " + parseInt(Difference_In_Days) + ")");

                    if (fk_projet > 0) {
                        $(".top-action").append('<button type="button" class="btn btn-danger" id="btnPrintPdf" data-toggle="tooltip" title="Print Purchase Order" data-placement="left"><i class="fas fa-print"></i> Print</button>');
                        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/PurchaseOrder/PurchaseOrderList" data-toggle="tooltip" title="Back to List" data-placement="right">Back to List</a>');
                        $('#divAlert').empty().append('<div class="alert alert-info alert-dismissible"><h4><i class="icon fa fa-info"></i> Alert!</h4>Purchase Order (Sales) is not editable.</div>');
                    }
                    else {
                        if (status_id == 5 || status_id == 6) {
                            $('.page-heading').empty().append('PO Amendment <span class="text-aqua">(' + row.po_status + ')</span> ');
                            $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/PurchaseOrder/PurchaseOrderList" data-toggle="tooltip" title="Back to List" data-placement="right">Back to List</a><button type="button" class="btn btn-danger btnEdit" data-toggle="tooltip" title="Edit" data-placement="left"><i class="far fa-edit"></i> Edit</button>');
                            $(".top-action").append('<button type="button" class="btn btn-danger" id="btnPrintPdf" data-toggle="tooltip" title="Print Purchase Order" data-placement="left"><i class="fas fa-print"></i> Print</button> <button type="button" class="btn btn-danger btnEdit" data-toggle="tooltip" title="Edit" data-placement="bottom"><i class="far fa-edit"></i> Edit</button>');
                        }
                        else {
                            fk_user_approve = parseInt(row.fk_user_approve) || 0;
                            if (status_id == 3) {
                                if (fk_user_approve > 0) $('.page-heading').empty().append('PO Amendment <span class="text-green">(Approved by ' + row.user_approve + ')</span> ');
                                else $('.page-heading').empty().append('PO Amendment <span class="text-green">(Approved)</span> ');
                            }
                            else if (status_id == 8) {
                                if (fk_user_approve > 0) $('.page-heading').empty().append('PO Amendment <span class="text-red">(Rejected by ' + row.user_approve + ')</span> ');
                                else $('.page-heading').empty().append('PO Amendment <span class="text-red">(Reject)</span> ');
                            }
                            else {
                                $('.page-heading').empty().append('PO Amendment <span class="text-aqua">(' + row.po_status + ')</span> ');
                            }
                            $(".top-action").append('<button type="button" class="btn btn-danger" id="btnPrintPdf" data-toggle="tooltip" title="Print Purchase Order" data-placement="left"><i class="fas fa-print"></i> Print</button>');
                            $('#divAlert').empty().append('<div class="alert alert-warning alert-dismissible"><h4><i class="icon fa fa-info"></i> Alert!</h4>This Purchase Order is not editable because no any quantity received.</div>');
                        }
                    }
                });
                $.each(data['pod'], function (index, row) {
                    let itemHtml = '';
                    if (row.fk_product > 0) {
                        itemHtml = '<tr id="tritemid_' + row.fk_product + '" class="paid_item" data-pid="' + row.fk_product + '" data-pname="' + row.description + '" data-psku="' + row.product_sku + '" data-rowid="' + row.rowid + '">';
                        //itemHtml += '<td class="text-center"><button class="btn p-0 text-red btnDeleteItem billinfo" onclick="removeItems(\'' + row.fk_product + '\');" data-toggle="tooltip" title="Delete product"> <i class="glyphicon glyphicon-trash"></i> </button></td>';
                        itemHtml += '<td>' + row.description + '<br>Tag/Lot/Serial No. :- ' + row.product_serialno + '</td><td>' + row.product_sku + '</td>';
                        itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + row.fk_product + '" value="' + row.subprice.toFixed(2) + '" name="txt_itemprice" placeholder="Price"></td>';
                        itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemqty_' + row.fk_product + '" value="' + row.qty.toFixed(0) + '" name="txt_itemqty" placeholder="Qty."></td>';
                        itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemdisc_' + row.fk_product + '" value="' + row.discount_percent.toFixed(2) + '" name="txt_itemdisc" placeholder="Discount"></td>';
                        itemHtml += '<td class="text-right tax-amount" data-tax1="' + row.localtax1_tx + '" data-tax2="' + row.localtax2_tx + '">' + row.total_localtax1.toFixed(2) + '</td>';
                        itemHtml += '<td class="text-right ship-amount">' + row.total_localtax2.toFixed(2) + '</td>';
                        itemHtml += '<td class="text-right row-total">' + row.total_ttc.toFixed(2) + '</td>';
                        itemHtml += '</tr>';
                        $('#line_items').append(itemHtml);
                    }
                    else {
                        let rSDate = !row.date_start.includes('00/00/0000') ? row.date_start : '', rEDate = !row.date_end.includes('00/00/0000') ? row.date_end : '';
                        itemHtml = '<tr id="tritemid_' + row.rowid + '" class="other_item" data-rowid="' + row.rowid + '" data-rang="' + row.rowid + '" data-proc_type="' + row.product_type + '"  data-proc_fromdate="' + rSDate + '" data-proc_todate="' + rEDate + '">';
                        itemHtml += '<td><span class="item-desc">' + row.description + '</span> ';
                        itemHtml += '<button class="btn p-0 billinfo" onclick="AddProductModal(\'' + 1 + '\',\'' + row.rowid + '\');" data-toggle="tooltip" title="Edit other product and services"><i class="glyphicon glyphicon-edit"></i></button>';
                        itemHtml += '<button class="btn p-0 text-red billinfo" onclick="removeItems(\'' + row.rowid + '\');" data-toggle="tooltip" title="Delete other product and services"><i class="glyphicon glyphicon-trash"></i></button>';
                        itemHtml += '</td > ';
                        itemHtml += '<td class="item-sku">' + row.product_sku + '</td>';
                        //itemHtml += '<td class="item-desc">' + row.description + '</td><td class="item-sku">' + row.product_sku + '</td>';
                        itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + row.rowid + '" value="' + row.subprice.toFixed(2) + '" name="txt_itemprice" placeholder="Price"></td>';
                        itemHtml += '<td><input min="0" autocomplete="off" class="form-control ' + (row.product_type > 0 ? '' : 'billinfo rowCalulate') + ' number" type="number" id="txt_itemqty_' + row.rowid + '" value="' + row.qty.toFixed(0) + '" name="txt_itemqty" placeholder="Qty." ' + (row.product_type > 0 ? 'disabled' : '') + '></td>';
                        itemHtml += '<td><input min="0" autocomplete="off" class="form-control ' + (row.product_type > 0 ? '' : 'billinfo rowCalulate') + ' number" type="number" id="txt_itemdisc_' + row.rowid + '" value="' + row.discount_percent.toFixed(2) + '" name="txt_itemdisc" placeholder="Discount" ' + (row.product_type > 0 ? 'disabled' : '') + '></td>';
                        itemHtml += '<td class="text-right tax-amount">' + row.total_localtax1.toFixed(2) + '</td>';
                        itemHtml += '<td class="text-right ship-amount">' + row.total_localtax2.toFixed(2) + '</td>';
                        itemHtml += '<td class="text-right row-total">' + row.total_ttc.toFixed(2) + '</td>';
                        itemHtml += '</tr>';
                        $('#product_line_items').append(itemHtml);
                    }
                });
                getPurchaseOrderPayments(oid);
                //}
                //catch (error) {
                //    $("#loader").hide(); swal('Alert!', "something went wrong.", "error");
                //}
            },
            complete: function () { $("#loader").hide(); isEdit(false); },
            error: function (xhr, status, err) { $("#loader").hide(); swal('Alert!', "something went wrong.", "error"); }, async: false
        });
        $("#divAddItemFinal").find(".rowCalulate").change(function () { calculateFinal(); })
        $('#ddlVendor,.billinfo').prop("disabled", true); calculateFinal(); $('.entry-mode-action').empty();
    }
    else {
        $('.billinfo,.orderfiles').prop("disabled", true); $('#lblPoNo').text('Draft');
        $("#loader").hide(); $('.page-heading').text('PO Amendment');
        $(".top-action").empty(); $(".order-files").addClass('hidden');
    }
}
function getPurchaseOrderPayments(oid) {
    $('.paymentlist').empty();
    if (oid > 0) {
        let option = { strValue1: oid };
        $.ajax({
            url: "/PurchaseOrder/GetPurchaseOrderPayments", type: "Get", beforeSend: function () { $("#loader").show(); }, data: option,
            success: function (result) {
                try {
                    let data = JSON.parse(result); let paid_amt = 0.00; let itemHtml = '';
                    $.each(data, function (key, row) {
                        paid_amt = paid_amt + parseFloat(row.amount);
                        itemHtml += '<tr>';
                        itemHtml += '<td>' + row.datec + '</td>';
                        itemHtml += '<td class="text-right" data-amount="' + row.amount.toFixed(2) + '">$' + row.amount.toFixed(2) + '</td>';
                        itemHtml += '<td>' + row.paymenttype + '</td>';
                        itemHtml += '<td>' + row.num_payment + '</td>';
                        itemHtml += '</tr>';
                    });
                    $('.paymentlist').append(itemHtml);
                    $('#paidTotal').text(paid_amt.toFixed(2));
                }
                catch (error) { $("#loader").hide(); swal('Alert!', "something went wrong.", "error"); }
            },
            complete: function () { $("#loader").hide(); isEdit(false); },
            error: function (xhr, status, err) { $("#loader").hide(); swal('Alert!', "something went wrong.", "error"); }, async: false
        });
        bindfileuploade();
    }
    else {
        $('.billinfo').prop("disabled", true); $('#lblPoNo').text('Draft');
        $("#loader").hide(); $('.page-heading').text('New Purchase Order');
        $(".top-action").empty();
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
            total_ht: rGrossAmt, total_tva: 0, total_localtax1: rTax_Amt1, total_localtax2: rTax_Amt2, total_ttc: rNetAmt, date_start: '1900-01-01', date_end: '1900-01-01'
        });
    });
    //other item
    $("#product_line_items > tr.other_item").each(function (index, row) {
        let rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rGrossAmt = 0.00, rDisAmt = 0.00, rTax1 = 0.00, rTax_Amt1 = 0.00, rTax2 = 0.00, rTax_Amt2 = 0.00, rNetAmt = 0.00;
        rPrice = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_itemqty]").val()) || 0.00;
        rDisPer = parseFloat($(row).find("[name=txt_itemdisc]").val()) || 0.00;
        let proc_type = parseInt($(row).data('proc_type')) || 0;
        rGrossAmt = rPrice * rQty; rDisAmt = proc_type > 0 ? (rGrossAmt * (rDisPer / 100)) : 0.00;
        rNetAmt = (rGrossAmt - rDisAmt) + rTax1;
        let rSDate = isNullAndUndef($(row).data('proc_fromdate')) ? moment($(row).data('proc_fromdate'), 'MM/DD/YYYY').format('YYYY-MM-DD') : '1900-01-01', rEDate = isNullAndUndef($(row).data('proc_todate')) ? moment($(row).data('proc_todate'), 'MM/DD/YYYY').format('YYYY-MM-DD') : '1900-01-01';
        //console.log(rSDate, rEDate);
        _rang += 1;
        _list.push({
            rowid: $(row).data('rowid'), rang: _rang, product_type: proc_type, fk_product: 0, description: $(row).find('.item-desc').text(), product_sku: $(row).find('.item-sku').text(),
            qty: rQty, subprice: rPrice, discount_percent: rDisPer, discount: rDisAmt, tva_tx: 0, localtax1_tx: rTax1, localtax1_type: 'F', localtax2_tx: rTax2, localtax2_type: 'F',
            total_ht: rGrossAmt, total_tva: 0, total_localtax1: rTax_Amt1, total_localtax2: rTax_Amt2, total_ttc: rNetAmt, date_start: rSDate, date_end: rEDate
        });

    });
    //console.log(_list)
    return _list;
}
function saveVendorPO() {
    let id = parseInt($('#lblPoNo').data('id')) || 0;
    let vendorid = parseInt($("#ddlVendor").val()) || 0;
    let ref_vendor = $("#txtRefvendor").val();
    let payment_term = parseInt($("#ddlPaymentTerms").val()) || 0;
    let balance_days = parseInt($("#ddlBalancedays").val()) || 0;
    let payment_type = parseInt($("#ddlPaymentType").val()) || 0;
    let date_livraison = $("#txtPlanneddateofdelivery").val();
    let wh_id = parseInt($("#ddlWarehouse").val()) || 0;
    let incoterms = parseInt($("#ddlIncoTerms").val()) || 0;
    let location_incoterms = $("#txtIncoTerms").val();
    let note_public = $("#txtNotePublic").val();
    let note_private = $("#txtNotePrivate").val();
    let _list = createItemsList();
    if (vendorid <= 0) { swal('alert', 'Please select vendor', 'error').then(function () { swal.close(); $('#ddlVendor').focus(); }) }
    else if (payment_type <= 0) { swal('alert', 'Please select payment type', 'error').then(function () { swal.close(); $('#ddlPaymentType').focus(); }) }
    else if (wh_id <= 0) { swal('alert', 'Please select warehouse.', 'error').then(function () { swal.close(); $('#ddlWarehouse').focus(); }) }
    else if (date_livraison == "") { swal('alert', 'Please select planned date of delivery', 'error').then(function () { swal.close(); $('#txtPlanneddateofdelivery').focus(); }) }
    //else if (_list.length <= 0) { swal('Alert!', 'Please add product.', "error").then((result) => { $('#ddlProduct').select2('open'); return false; }); return false; }
    else {
        ActivityLog('PO Amendment Update for vendor id (' + vendorid + ')', '/PurchaseOrder/po-amendment?id=' + id + '');

        //if (date_livraison.length > 0) date_livraison = date_livraison[2] + '/' + date_livraison[0] + '/' + date_livraison[1];
        let _order = {
            RowID: id, VendorID: vendorid, PONo: '', VendorBillNo: ref_vendor, fk_warehouse: wh_id, PaymentTerms: payment_term, Balancedays: balance_days, PaymentType: payment_type,
            Planneddateofdelivery: date_livraison, IncotermType: incoterms, Incoterms: location_incoterms, NotePublic: note_public, NotePrivate: note_private,
            total_tva: 0, localtax1: parseFloat($("#salesTaxTotal").text()), localtax2: parseFloat($("#shippingTotal").text()), total_ht: parseFloat($("#SubTotal").text()),
            discount: parseFloat($("#discountTotal").text()), total_ttc: parseFloat($("#orderTotal").text())
        }
        let option = { strValue1: id, strValue2: JSON.stringify(_order), strValue3: JSON.stringify(_list) }
        //console.log(option, _order, _list); return;
        swal.queue([{
            title: '', confirmButtonText: 'Yes, update it!', text: "Do you want to update this PO?",
            showLoaderOnConfirm: true, showCancelButton: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    $.post('/PurchaseOrder/POAmendment', option).done(function (result) {
                        result = JSON.parse(result);
                        if (result[0].Response == "Success") {
                            $('#lblPoNo').data('id', result[0].id);
                            swal('Success', 'Purchase order updated successfully.', "success").then(function () {
                                window.location.href = window.location.origin + "/PurchaseOrder/po-amendment?id=" + result[0].id;
                                //ActivityLog('create new purchase order for vendor id (' + vendorid + ')', '/PurchaseOrder/po-amendment');
                            });
                        }
                        else { swal('Error', 'Something went wrong, please try again.', "error"); }
                    }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
                });
            }
        }]);
    }
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Purchase Order File Upload ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function Adduploade() {
    var formData = new FormData();
    var file = document.getElementById("ImageFile").files[0];
    formData.append("ImageFile", file);

    var Name = parseInt($('#lblPoNo').data('id')) || 0;
    formData.append("Name", Name);
    if (file == "") { swal('Alert', 'Please upload files', 'error').then(function () { swal.close(); }); }
    else {

        $.ajax({
            type: 'post', url: '/Reception/FileUploade', processData: false, contentType: false, data: formData,
            beforeSend: function (xhr) { $("#loader").show(); }
        }).then(response => {
            if (response.status == true) {
                if (response.url == "Manage") {
                    swal('Success', response.message, 'success');
                    bindfileuploade();
                }
                else swal('Success', response.message, 'success');
            }
            else swal('Alert!', response.message, 'error')
        }).catch(err => { swal.hideLoading(); swal('Error!', 'something went wrong', 'error'); }).always(function () { $("#loader").hide(); });
    }
}
function bindfileuploade() {
    let id = parseInt($('#lblPoNo').data('id')) || 0;
    var obj = { strValue1: id };
    $.ajax({
        type: "POST", url: '/Reception/GetfileuploadData', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let itemHtml = '';
            $.each(data, function (key, row) {
                itemHtml += '<tr id="tritemId_' + row.ID + '" data-id="' + row.ID + '">';
                itemHtml += '<td><a target="popup" href="../../Content/PurchaseFiles/' + row.product_name + '">' + row.product_name + '</i></a ></td>';
                itemHtml += '<td>' + row.product_label + 'KB' + '</td>';
                itemHtml += '<td>' + row.sellingpric + '</td>';
                itemHtml += '<td class="text-right"><button class="btn menu-icon-gr text-red btnDeleteItem editbutton orderfiles" disabled onClick="Deletefileupload(' + row.ID + ')" data-toggle="tooltip" title="Delete Document" data-placement="right"><i class="glyphicon glyphicon-trash"></i></button></td>';
                itemHtml += '</tr>';
            });
            $('#divfileupload_services').empty().append(itemHtml);
            $('[data-toggle="tooltip"]').tooltip();
        },
        complete: function () { $("#loader").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
        async: false
    });
}
function Deletefileupload(id) {
    var ids = id;
    var obj = { ID: ids }
    $("#loader").show();
    $.post('/Reception/Deletefileuploade', obj).then(response => {
        if (response.status == true) {
            if (response.url == "Manage") {
                swal('Success', response.message, 'success'); bindfileuploade();
            }
            else swal('Success', response.message, 'success');
        }
        else swal('Alert!', response.message, 'error')
    }).catch(err => { swal.hideLoading(); swal('Error!', 'something went wrong', 'error'); }).always(function () { $("#loader").hide(); });
}
