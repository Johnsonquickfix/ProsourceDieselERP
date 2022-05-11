$(document).ready(function () {
    $("#loader").hide();
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    $.when(getVendor(), gettransactiontype(), getpaymenttype()).done(function () { getbillInfodetails(id); });

    $(".select2").select2();
    $(document).on("click", ".ddladdproduct", function (t) { bindItems(); });

    $("#ddlcoustomer").select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Search Customer",
        ajax: {
            url: '/Orders/GetCustomerList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.displayname, name: item.displayname, id: item.id } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });

    $(document).on("click", ".btnSave", function (t) { t.preventDefault(); savemiscbill(); });
    $(document).on("click", ".btnEditBill", function (t) {
        t.preventDefault(); $('.billinfo').prop("disabled", false); isEdit(true);
        $('.top-action').empty().append('<a class="btn btn-danger btnUndo" data-toggle="tooltip" title="" data-original-title="Undo Bill"><i class="fa fa-undo"></i> Cancel</a> <a class="btn btn-danger btnSave" data-toggle="tooltip" title="Save bill details." data-placement="left"><i class="fa fa-save"></i> Update</a>');
        $('.footer-finalbutton').empty().append('<a class="btn btn-danger btnUndo pull-left" data-toggle="tooltip" title="" data-original-title="Undo Bill"><i class="fa fa-undo"></i> Cancel</a> <a class="btn btn-danger btnSave" data-toggle="tooltip" title="Save bill details." data-placement="left"><i class="fa fa-save"></i> Update</a>');
    });
    $(document).on("click", ".btnUndo", function (t) {
        t.preventDefault(); $('.billinfo').prop("disabled", true);
        let id = parseInt($('.page-heading').data('id')) || 0;
        $("#loader").show(); getbillInfodetails(id); isEdit(false);
    });
    $(document).on("click", ".bill-active", function (t) {
        t.preventDefault(); let id = parseInt($('.page-heading').data('id')) || 0;
        ChageStatus(id, true);
    });
    $("#ddlvendordata").change(function () { setTimeout(function () { vendorAddress($("#ddlvendordata").val()); }, 50); return false; });
    $("#txtshippingfee").change(function () { calculateFinal() });
    $("#txtotherfee").change(function () { calculateFinal() });
});
function isEdit(val) { localStorage.setItem('isEdit', val ? 'yes' : 'no'); }
function gettransactiontype() {
    $.ajax({
        url: "/PaymentInvoice/gettransactiontype", type: "Get",
        success: function (data) {
            $('#ddltransactiontype').append('<option value="0">Select Transaction Type</option>');
            $.each(data, function (i, row) { $('#ddltransactiontype').append('<option value="' + row.Value + '">' + row.Text + '</option>'); });
        }, async: false
    });
}
function getpaymenttype() {
    $.ajax({
        url: "/PaymentInvoice/getpaymenttypefill", type: "Get",
        success: function (data) {
            $('#ddlPaymentType').append('<option value="0">Select Bill Type</option>');
            $.each(data, function (i, row) { $('#ddlPaymentType').append('<option value="' + row.Value + '">' + row.Text + '</option>'); });
        }, async: false
    });
}
function getVendor() {
    $.ajax({
        url: "/PurchaseOrder/GetVendor", type: "Get",
        success: function (data) {
            $('#ddlvendordata').append('<option value="-1">Please Select Vendor</option>');
            $.each(data, function (i, row) { $('#ddlvendordata').append('<option value="' + row.Value + '">' + row.Text + '</option>'); });
        }, async: false
    });
}
function vendorAddress(id) {
    let _add = "", _id = parseInt(id) || 0;
    if (_id > 0) {
        $.post('/PaymentInvoice/GetvendorAddress', { strValue1: parseInt(id) || 0 }).done(function (result) {
            result = JSON.parse(result);
            $.each(result, function (i, row) { _add = row.addressvn; });
        }).catch(err => { swal('Error!', err, 'error'); }).always(function () { $('#txtcustmeraddress').text(_add); });
    }
}

function bindItems() {
    let i = $("#line_items tr").length;
    //  console.log('sd');
    let itemHtml = '<tr id="tritemid_' + i + '" class="paid_item" data-rowid="0">';
    itemHtml += '<td class="text-center"><button class="btn p-0 text-red btnDeleteItem billinfo" onclick="removeItems(\'' + i + '\');" data-toggle="tooltip" title="Delete product"> <i class="glyphicon glyphicon-trash"></i> </button></td>';
    itemHtml += '<td><input autocomplete="off" class="form-control billinfo" type="text" id="txt_Service_' + i + '"  name="txt_Service" placeholder="Product/Service"></td>';
    itemHtml += '<td><input autocomplete="off" class="form-control billinfo" type="text" id="txt_sku_' + i + '"  name="txt_sku" placeholder="SKU"></td>';
    itemHtml += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Quantity_' + i + '"  name="txt_Quantitye" placeholder="Quantity" value="1"></td>';
    itemHtml += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Price_' + i + '"  name="txt_Price" placeholder="Price." value="0"></td>';
    itemHtml += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Tax_' + i + '"  name="txt_Tax" placeholder="Tax" value="0"></td>';
    itemHtml += '<td class="text-right row-total">' + formatCurrency(0) + '</td>';
    itemHtml += '</tr>';
    $('#line_items').append(itemHtml); $('#txt_Service_' + i).focus();
    $("#line_items").find(".rowCalulate").change(function () { calculateFinal(); });
    //calculateFinal();
}
function getbillInfodetails(oid) {
    $('#divAlert').empty();
    if (oid > 0) {
        $('.billinfo').prop("disabled", true); $('#line_items').empty(); $('.page-heading').data('id', oid);
        $('.top-action').empty().append('<a class="btn btn-danger btnEditBill" data-toggle="tooltip" title="Edit Bill" data-placement="left"><i class="far fa-edit"></i> Edit</a>');
        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/MiscellaneousBill/AutoBillConfigList" data-toggle="tooltip" title="" data-placement="left" data-original-title="Back to list"><i class="fa fa-arrow-left"></i> Back to List</a> <a class="btn btn-danger btnEditBill" data-toggle="tooltip" title="Edit Bill" data-placement="left"><i class="far fa-edit"></i> Edit</a>');
        $.ajax({
            url: "/miscellaneousbill/get-autobill", type: "Get", beforeSend: function () { $("#loader").show(); }, data: { strValue1: oid },
            success: function (result) {
                //try {
                let data = JSON.parse(result.data);
                $.each(data['Table'], function (i, row) {
                    if (!row.is_active) {
                        $('#divAlert').empty().append('<div class="callout callout-warning"><h4>Reminder!</h4>This bill is inactive. <a href="javscript:void(0);" class="bill-active">click here to activate.</a></div >');
                    }

                    $('#ddlvendordata').val(row.fk_vendor).trigger('change');
                    $('#ddltransactiontype').val(row.fk_transactiontype).trigger('change');
                    $('#ddlPaymentType').val(row.fk_paymenttype).trigger('change');
                    $('#ddlpayaccounttype').val(row.payaccount.trim()).trigger('change');
                    $('#txtdueDay').val(row.due_day);
                    $('#txtshippingfee').val(row.shippingfee.toFixed(2));
                    $('#txtotherfee').val(row.otherfee.toFixed(2));
                    let _html = '';
                    $.each(data['Table1'], function (i, row) {
                        _html += '<tr id="tritemid_' + i + '" class="paid_item" data-rowid="' + row.rowid + '" data-pname="' + row.discription + '" data-psku="' + row.sku + '">';
                        _html += '<td class="text-center"><button class="btn p-0 text-red btnDeleteItem billinfo" onclick="removeItems(\'' + i + '\');" data-toggle="tooltip" title="Delete product"> <i class="glyphicon glyphicon-trash"></i> </button></td>';
                        _html += '<td><input autocomplete="off" class="form-control billinfo" type="text" id="txt_Service_' + i + '" value="' + row.product + '"  name="txt_Service" placeholder="Product/Service"></td>';
                        _html += '<td><input autocomplete="off" class="form-control billinfo" type="text" id="txt_sku_' + i + '"  name="txt_sku" value="' + row.sku + '" placeholder="Vendor SKU"></td>';
                        _html += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Quantity_' + i + '"  value="' + row.qty.toFixed(0) + '"  name="txt_Quantitye" placeholder="Quantity"></td>';
                        _html += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Price_' + i + '" value="' + row.rate.toFixed(2) + '" name="txt_Price" placeholder="Price."></td>';
                        _html += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Tax_' + i + '" value="' + row.tax.toFixed(2) + '" name="txt_Tax" placeholder="Tax"></td>';
                        _html += '<td class="text-right row-total">' + formatCurrency(row.net_amount) + '</td>';
                        _html += '</tr>';
                    });
                    $('#line_items').append(_html);
                    $("#line_items").find(".rowCalulate").change(function () { calculateFinal(); });
                    calculateFinal();
                });
                //}
                //catch (error) {
                //    $("#loader").hide(); swal('Alert!', "something went wrong.", "error");
                //}
            },
            complete: function () { $("#loader").hide(); $('.billinfo').prop("disabled", true); },
            error: function (xhr, status, err) { $("#loader").hide(); swal('Alert!', "something went wrong.", "error"); }, async: true
        });
    }
    else {
        $('.billinfo').prop("disabled", false); $('.page-heading').data('id', 0);
        $("#loader").hide();
        $('.top-action').empty().append('<a class="btn btn-danger btnSave" data-toggle="tooltip" title="Save bill details." data-placement="left"><i class="fa fa-save"></i> Save</a>');
        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/MiscellaneousBill/AutoBillConfigList" data-toggle="tooltip" title="" data-placement="left" data-original-title="Back to list"><i class="fa fa-arrow-left"></i> Back to List</a> <a class="btn btn-danger btnSave" data-toggle="tooltip" title="Save bill details." data-placement="left"><i class="fa fa-save"></i> Save</a>');
    }
}
function removeItems(id) {
    //------------- Remove data in Temp AddItemList-----
    swal({ title: "Are you sure?", text: 'Would you like to Remove this Item?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) { $('#tritemid_' + id).remove(); }
            calculateFinal();
        });
}

function calculateFinal() {
    let tGrossAmt = 0.00, tQty = 0.00, tDisAmt = 0.00, tTax_Amt1 = 0.00, tTax_Amt2 = 0.00, tOther_Amt = 0.00, tNetAmt = 0.00, rshipAmt = 0.00, rothrAmt = 0.00;
    //main item
    $("#line_items > tr.paid_item").each(function (index, row) {
        let rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rGrossAmt = 0.00, rDisAmt = 0.00, rTax1 = 0.00, rTax_Amt1 = 0.00, rTax2 = 0.00, rTax_Amt2 = 0.00, rNetAmt = 0.00;
        rPrice = parseFloat($(row).find("[name=txt_Price]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_Quantitye]").val()) || 0.00;

        rDisPer = 0.00;
        rTax1 = parseFloat($(row).find("[name=txt_Tax]").val()) || 0.00;
        rTax2 = 0.00;
        tQty += rQty; rGrossAmt = rPrice * rQty; //rDisAmt = rGrossAmt * (rDisPer / 100);
        rTax_Amt1 = rTax1; //rTax_Amt2 = rTax2 * rQty;
        rNetAmt = rGrossAmt + rTax_Amt1;
        // $(row).find(".tax-amount").text(rTax_Amt1.toFixed(2)); $(row).find(".ship-amount").text(rTax_Amt2.toFixed(2));
        tGrossAmt += rGrossAmt, tDisAmt += rDisAmt, tTax_Amt1 += rTax_Amt1, tTax_Amt2 += rTax_Amt2, tNetAmt += rNetAmt;
        $(row).find(".row-total").text(formatCurrency(rNetAmt));
    });
    rshipAmt = parseFloat($("#txtshippingfee").val()) || 0.00;
    //console.log(tNetAmt, rshipAmt, rothrAmt);
    rothrAmt = parseFloat($("#txtotherfee").val()) || 0.00;
    tNetAmt = tNetAmt + rshipAmt + rothrAmt;
    //  $(".thQuantity").text(tQty.toFixed(0));

    $("#thQuantity").text(tQty.toFixed(0)); $("#thQuantity").data('total', tQty.toFixed(0));

    $("#SubTotal").text(formatCurrency(tGrossAmt)); $("#SubTotal").data('total', tGrossAmt.toFixed(2));
    //$("#discountTotal").text(formatCurrency(tDisAmt)); $("#discountTotal").data('total', tDisAmt.toFixed(2));
    $("#salesTaxTotal").text(formatCurrency(tTax_Amt1)); $("#salesTaxTotal").data('total', tTax_Amt1.toFixed(2));
    $("#shippingTotal").text(formatCurrency(rshipAmt)); $("#shippingTotal").data('total', rshipAmt.toFixed(2));
    $("#otherTotal").text(formatCurrency(rothrAmt)); $("#otherTotal").data('total', rothrAmt.toFixed(2));
    $("#orderTotal").html(formatCurrency(tNetAmt)); $("#orderTotal").data('total', tNetAmt.toFixed(2));
    //let paid_amt = parseFloat($('#paidTotal').data('paid')) || 0.00;
    //$('#unpaidTotal').text(formatCurrency(tNetAmt - paid_amt))
    //$('[data-toggle="tooltip"]').tooltip();
}
function formatCurrency(total) {
    let neg = false;
    if (total < 0) { neg = true; total = Math.abs(total); }
    return (neg ? "-$" : '$') + parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
}
function createItemsList() {
    let _list = []; let _rang = 0;
    $('#line_items > tr').each(function (index, row) {
        let rproduct = '', rdiscription = '', rsku = '';
        let rPrice = 0.00, rQty = 0.00, rGrossAmt = 0.00, rTax = 0.00, rshipAmt = 0.00, rothrAmt = 0.00;
        rproduct = $(row).find("[name=txt_Service]").val();
        rsku = $(row).find("[name=txt_sku]").val();
        rPrice = parseFloat($(row).find("[name=txt_Price]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_Quantitye]").val()) || 0.00;
        rTax = parseFloat($(row).find("[name=txt_Tax]").val()) || 0.00;
        //rshipAmt = parseFloat($("#txtshippingfee").val()) || 0.00;
        //rothrAmt = parseFloat($("#txtotherfee").val()) || 0.00;
        rGrossAmt = rPrice * rQty;
        _rang += 1;
        _list.push({
            rowid: parseFloat($(row).data('id')) || 0, product: rproduct, discription: '', sku: rsku, qty: rQty, rate: rPrice, gross_amount: rGrossAmt, tax: rTax, shippingfee: rshipAmt, otherfee: rothrAmt, net_amount: (rGrossAmt + rTax + rshipAmt + rothrAmt)
        });
    });

    //console.log(_list)
    return _list;
}
function savemiscbill() {
    let id = parseInt($('.page-heading').data('id')) || 0;
    let vendorid = parseInt($("#ddlvendordata").val()) || 0;
    let transactiontype = parseInt($("#ddltransactiontype").val()) || 0;
    let paymenttype = parseInt($("#ddlPaymentType").val()) || 0;
    let payaccounttype = $("#ddlpayaccounttype").val();
    let _days = parseInt($("#txtdueDay").val()) || 0;
    let rshipAmt = parseFloat($("#txtshippingfee").val()) || 0.00;
    let rothrAmt = parseFloat($("#txtotherfee").val()) || 0.00;

    let _list = createItemsList();

    if (vendorid <= 0) { swal('alert', 'Please select Vender.', 'error').then(function () { swal.close(); $('#ddlvendordata').select2('open'); }) }
    else if (transactiontype <= 0) { swal('alert', 'Please select transaction type.', 'error').then(function () { swal.close(); $('#ddltransactiontype').select2('open'); }) }
    else if (paymenttype <= 0) { swal('alert', 'Please select bill type.', 'error').then(function () { swal.close(); $('#ddlPaymentType').select2('open'); }) }
    else if (payaccounttype == '0') { swal('alert', 'Please select pay account.', 'error').then(function () { swal.close(); $('#ddlpayaccounttype').select2('open'); }) }
    else if (_days <= 0) { swal('alert', 'Please enter Due Day of Month.', 'error').then(function () { swal.close(); $('#txtdueDay').focus(); }) }
    else if (_list.length == 0) { swal('Alert!', 'Please add product.', "error") }
    else {
        let _billinfo = {
            rowid: id, fk_transactiontype: transactiontype, fk_paymenttype: paymenttype, payaccount: payaccounttype, fk_vendor: vendorid, due_day: _days,
            gross_amount: parseFloat($("#SubTotal").data('total')) || 0.00, total_tax: parseFloat($("#salesTaxTotal").data('total')) || 0.00,
            shippingfee: rshipAmt, otherfee: rothrAmt, net_amount: parseFloat($("#orderTotal").data('total')) || 0.00,
        }
        let option = { strValue1: id, strValue2: JSON.stringify(_billinfo), strValue3: JSON.stringify(_list) }
        //console.log(option, _billinfo, _list); return;
        swal.queue([{
            title: '', confirmButtonText: 'Yes, save it!', text: "Do you want to save your bill details?", showLoaderOnConfirm: true, showCancelButton: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    $.post('/miscellaneousbill/autobillconfig-save', option).done(function (result) {
                        result = JSON.parse(result);
                        if (result[0].Response == "success") {
                            swal('Success', 'Misc bill details saved successfully.', "success").then(function () { getbillInfodetails(result[0].id); });
                        }
                        else { swal('Error', result[0].Response, "error"); }
                    }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
                });
            }
        }]);
    }
}

function ChageStatus(id, _status) {
    let msg = _status ? 'Do you want to Active this bill?' : 'Do you want to Inactive this bill?';
    swal.queue([{
        title: '', confirmButtonText: 'Yes, save it!', text: msg, showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                $.post('/miscellaneousbill/billstatus-update', { strValue1: id, strValue2: _status }).done(function (result) {
                    if (result.status) {
                        swal.insertQueueStep({ title: 'Success', text: result.message, type: 'success' });
                        getbillInfodetails(id);
                    }
                    else { swal.insertQueueStep({ title: 'Error', text: result.message, type: 'error' }); }
                    resolve();
                }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
            });
        }
    }]);
}