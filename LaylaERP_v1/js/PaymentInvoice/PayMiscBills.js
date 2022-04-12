$(document).ready(function () {
    $('#divvendo').hide();
    $('#divcus').hide();
    $('#divaddress').hide();
   // gettransactiontype();
   // getpaymenttype();
   // getVendor(); 
    $.when(getVendor(), gettransactiontype()).done(function () { getpaymenttype(); });

    $('#txtcreateDate').datepicker({ format: 'mm/dd/yyyy', autoclose: true, todayHighlight: true });
    let today = new Date();  
    $('#txtcreateDate').val(today.toLocaleDateString("en-US"));

    $(".select2").select2();
    var itxtCnt = 0;
    var i = 1;
    $(document).on("click", ".ddladdproduct", function (t) {
        bindItems();
    });

    $("#ddlcoustomer").select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Search Customer",
        ajax: {
            url: '/Orders/GetCustomerList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.displayname, name: item.displayname, id: item.id } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }

    });
    $('#ddlCoustomertype').change(function (t) {
        let Coustomertype = $("#ddlCoustomertype").val();
        if (Coustomertype == "C") {
            console.log(Coustomertype);
            $('#divcus').show();
            $('#divaddress').show();
            $('#divvendo').hide();
            $('#divinstaion').hide();
        }
        if (Coustomertype == 'V') {
            $('#divvendo').show();
            $('#divcus').hide();
            $('#divinstaion').hide();
            $('#divaddress').hide();
        }
        if (Coustomertype == 'I') {
            $('#divinstaion').show();
            $('#divvendo').hide();
            $('#divcus').hide();
            $('#divaddress').hide();
        }

    });

    $(document).on("click", "#btnSave", function (t) { t.preventDefault(); savemiscbill(); });
    $("#ddlcoustomer").change(function () { setTimeout(function () { CustomerAddress($("#ddlcoustomer").val()); }, 50); return false; });
});
var itxtCnt = 0;
var i = 1;
function bindItems() {
 
    i++;
    itxtCnt = itxtCnt + 1;
    console.log('sd');
    let itemHtml = ''; 
    itemHtml += '<tr id="tritemid_' + i + '" class="paid_item" >';
   /* itemHtml += '<td><button type="button" class="btn no-btn btn_remove" id="' + i + '" name="remove">X</button></td>';*/
    itemHtml += '<td class="text-center"><button class="btn p-0 text-red btnDeleteItem billinfo" onclick="removeItems(\'' + i + '\');" data-toggle="tooltip" title="Delete product"> <i class="glyphicon glyphicon-trash"></i> </button></td>';
                   // itemHtml += '<td>' + data[i].description + '</td><td>' + data[i].product_sku + '</td>';
    itemHtml += '<td><input autocomplete="off" class="form-control billinfo" type="text" id="txt_Service_' + itxtCnt + '"  name="txt_Service" placeholder="Product/Service"></td>';
    itemHtml += '<td><input autocomplete="off" class="form-control billinfo" type="text" id="txt_Description_' + itxtCnt + '"  name="txt_Description" placeholder="Description."></td>';
    itemHtml += '<td><input autocomplete="off" class="form-control billinfo" type="text" id="txt_sku_' + itxtCnt + '"  name="txt_sku" placeholder="Vendor SKU"></td>';
    itemHtml += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Quantity_' + itxtCnt + '"  name="txt_Quantitye" placeholder="Quantity"></td>';
    itemHtml += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Price_' + itxtCnt + '"  name="txt_Price" placeholder="Price."></td>';
    itemHtml += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Tax_' + itxtCnt + '"  name="txt_Tax" placeholder="Tax"></td>';
    //itemHtml += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Total_' + itxtCnt + '"  name="txt_Total" placeholder="Total"></td>';
    itemHtml += '<td class="text-right row-total">' + formatCurrency(0) + '</td>';
    itemHtml += '</tr>';
    $('#line_items').append(itemHtml);
    $("#divAddItemFinal").find(".rowCalulate").change(function () { calculateFinal(); });
   
    calculateFinal();


    //i++;
    //itxtCnt = itxtCnt + 1;
    //e.preventDefault();
    ///*$("#tbhold").append('<tr id="row' + i + '"><td><div class="col-md-12"> <label>Name:</label><br /><input type="text" class="input" id=tb' + itxtCnt + ' value="" /><br /><input type="checkbox" class="inputchk" id=tb' + itxtCnt + ' value=""/><label>Visible on the product page</label><br /> <input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + ' value=""/><label>Used for variations</label></div></td><td><br /><br /><div class="col-md-12"><label>Value(s):</label><input type="text" placeholder="Enter some text, or some attributes by "|" separating values." style="width: 100%; height: 110px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;" class="inputdes" id=tb' + itxtCnt + ' value="" /></div></td><td><button type="button" class="btn btn-danger btn_remove" id="' + i + '" name="remove">X</button></td></tr>');*/
    //// $("#tbhold").append('<tr id="row' + i + '"><td><div class="col-md-12"> <label>Name:</label><br /><input type="text" class="input" id=tb' + itxtCnt + ' value="" /><br /><input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + ' value=""/><label>Used for variations</label></div></td><td><br /><br /><div class="col-md-12"><label>Value(s):</label><input type="text" placeholder="Enter some text, or some attributes by "|" separating values." style="width: 100%; height: 110px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;" class="inputdes" id=tb' + itxtCnt + ' value="" /></div></td><td><button type="button" class="btn btn-danger btn_remove" id="' + i + '" name="remove">X</button></td></tr>');
    //$("#line_items").append('<tr id="row' + i + '"><td><div class="form-group"><label class="control-label">Name:</label><input type="text" class="input form-control" id=tb' + itxtCnt + ' value="" /><span><input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + ' value=""/><label for=tb' + itxtCnt + '>Used for variations</label></div></td><td><div class="form-group"><label class="control-balel">Value(s):</label><textarea placeholder="Enter some text, or some attributes by | separating values." class="inputdes form-control" id=tb' + itxtCnt + '></textarea></div></td><td><button type="button" class="btn no-btn btn_remove" id="' + i + '" name="remove">X</button></td></tr>');

}
//$(document).on('click', '.btn_remove', function () {
//    var button_id = $(this).attr("id");
//    $("#tritemid_" + button_id + '').remove();
//});
function removeItems(id) {
    //------------- Remove data in Temp AddItemList-----
    swal({ title: "Are you sure?", text: 'Would you like to Remove this Item?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) {
                $('#tritemid_' + id).remove(); 
            }
        });
}
function gettransactiontype() {
    $.ajax({
        url: "/PaymentInvoice/gettransactiontype",
        type: "Get",
        success: function (data) {
            $('#ddltransactiontype').append('<option value="0">Select Transaction Type</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddltransactiontype').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}
function getpaymenttype() {
    $.ajax({
        url: "/PaymentInvoice/getpaymenttypefill",
        type: "Get",
        success: function (data) {
            $('#ddlPaymentType').append('<option value="0">Select Payment Type</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddlPaymentType').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}
function getVendor() {
    $.ajax({
        url: "/PurchaseOrder/GetVendor",
        type: "Get",
        success: function (data) {
            console.log(data);
            $('#ddlvendordata').append('<option value="-1">Please Select Vendor</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddlvendordata').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}

var ajaxFunc = function (url, data, beforeSendFun, successFun, completeFun, errorFun) {
    $.ajax({
        type: "POST", url: url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(data),
        beforeSend: beforeSendFun, success: successFun, complete: completeFun, error: errorFun, async: false
    });
}
function CustomerAddress(id) {
    //$("#ddlUser").val()
    let option = { strValue1: parseInt(id) || 0 };
    if (option.strValue1 > 0) {
        ajaxFunc('/Orders/GetCustomerAddress', option, function () { }, function (result) {
            var data = JSON.parse(result);
            let add = "";
            for (var i = 0; i < data.length; i++) {
                ///billing_Details 
                if (data[i].meta_key == 'billing_address_1') { add = data[i].meta_value + ' '; }
                else if (data[i].meta_key == 'billing_address_2') { add = data[i].meta_value + ' '; }
                else if (data[i].meta_key == 'billing_postcode') { add += data[i].meta_value + ' ';  }
                else if (data[i].meta_key == 'billing_city') { add += data[i].meta_value + ' '; }
                else if (data[i].meta_key == 'billing_country') { add += data[i].meta_value + ' ';}
                else if (data[i].meta_key == 'billing_state') { add += data[i].meta_value + ' ';}
                 
                $('#txtcustmeraddress').text(add);
            }
        })
    }
     
}

function calculateFinal() {
    let tGrossAmt = 0.00, tQty = 0.00, tDisAmt = 0.00, tTax_Amt1 = 0.00, tTax_Amt2 = 0.00, tOther_Amt = 0.00, tNetAmt = 0.00;
    //main item
    $("#line_items > tr.paid_item").each(function (index, row) {
        let rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rGrossAmt = 0.00, rDisAmt = 0.00, rTax1 = 0.00, rTax_Amt1 = 0.00, rTax2 = 0.00, rTax_Amt2 = 0.00, rNetAmt = 0.00;
        rPrice = parseFloat($(row).find("[name=txt_Price]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_Quantitye]").val()) || 0.00;
        rDisPer =  0.00;
        rTax1 = parseFloat($(row).find("[name=txt_Tax]").val()) || 0.00;
        rTax2 =   0.00;
        tQty += rQty; rGrossAmt = rPrice * rQty; //rDisAmt = rGrossAmt * (rDisPer / 100);
        rTax_Amt1 = rTax1; //rTax_Amt2 = rTax2 * rQty;
        rNetAmt = rGrossAmt  + rTax_Amt1 ;
       // $(row).find(".tax-amount").text(rTax_Amt1.toFixed(2)); $(row).find(".ship-amount").text(rTax_Amt2.toFixed(2));
       tGrossAmt += rGrossAmt, tDisAmt += rDisAmt, tTax_Amt1 += rTax_Amt1, tTax_Amt2 += rTax_Amt2, tNetAmt += rNetAmt;
        $(row).find(".row-total").text(formatCurrency(rNetAmt));
    });
    

  //  $(".thQuantity").text(tQty.toFixed(0));

    $("#thQuantity").text(tQty.toFixed(0)); $("#thQuantity").data('total', tQty.toFixed(0));

    $("#SubTotal").text(formatCurrency(tGrossAmt)); $("#SubTotal").data('total', tGrossAmt.toFixed(2));
    //$("#discountTotal").text(formatCurrency(tDisAmt)); $("#discountTotal").data('total', tDisAmt.toFixed(2));
    $("#salesTaxTotal").text(formatCurrency(tTax_Amt1)); $("#salesTaxTotal").data('total', tTax_Amt1.toFixed(2));
    //$("#shippingTotal").text(formatCurrency(tTax_Amt2)); $("#shippingTotal").data('total', tTax_Amt2.toFixed(2));
    //$("#otherTotal").text(formatCurrency(tOther_Amt)); $("#otherTotal").data('total', tOther_Amt.toFixed(2));
    $("#orderTotal").html(formatCurrency(tNetAmt)); $("#orderTotal").data('total', tNetAmt.toFixed(2));
    //let paid_amt = parseFloat($('#paidTotal').data('paid')) || 0.00;
    //$('#unpaidTotal').text(formatCurrency(tNetAmt - paid_amt))
    //$('[data-toggle="tooltip"]').tooltip();
}
function formatCurrency(total) {
    var neg = false;
    if (total < 0) {
        neg = true;
        total = Math.abs(total);
    }
    return (neg ? "-$" : '$') + parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
}
function createItemsList() {
    let _list = []; let _rang = 0;
    $('#line_items > tr').each(function (index, row) {
        let rproduct = '', rdiscription = '';
        let rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rGrossAmt = 0.00, rDisAmt = 0.00, rTax1 = 0.00, rTax_Amt1 = 0.00, rTax2 = 0.00, rTax_Amt2 = 0.00, rNetAmt = 0.00;
        rproduct = $(row).find("[name=txt_Service]").val();
        rdiscription = $(row).find("[name=txt_Description]").val();
        rPrice = parseFloat($(row).find("[name=txt_Price]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_Quantitye]").val()) || 0.00;        
        rTax1 = parseFloat($(row).find("[name=txt_Tax]").val()) || 0.00;
        rGrossAmt = rPrice * rQty;
       // rTax_Amt1 = rTax1 * rQty; rTax_Amt2 = rTax2 * rQty;
       // rNetAmt = (rGrossAmt - rDisAmt) + rTax_Amt1 + rTax_Amt2;
        _rang += 1;
        _list.push({
            product: rproduct, discription: rdiscription,
            qty: rQty, rate: rPrice, total_ttc: rGrossAmt, tax: rTax1
             
        });
    });
 
    //console.log(_list)
    return _list;
}
function savemiscbill() {
    //let id = parseInt($('#lblPoNo').data('id')) || 0;
   
    
    let transactiontype = parseInt($("#ddltransactiontype").val()) || 0;
    let payaccounttype = $("#ddlpayaccounttype").val();
    let Coustomertype = $("#ddlCoustomertype").val();
     
    let coustomerid = parseInt($("#ddlcoustomer").val()) || 0;
    let vendorid = parseInt($("#ddlvendordata").val()) || 0;
    let instaintionval = $("#txtinstaintion").val();
    let date = $("#txtcreateDate").val();

    let paymenttype = parseInt($("#ddlPaymentType").val()) || 0;

    if (Coustomertype == 'C') {
        vendorid = 0;
        instaintionval = '';
    }
    else if (Coustomertype == 'V') {
        coustomerid = 0;
        instaintionval = '';
    }
    else {
        coustomerid = 0;
        vendorid = 0;
    }
    let _list = createItemsList();

    if (date == "") { swal('alert', 'Please select create bill date ', 'error').then(function () { swal.close(); $('#txtcreateDate').focus(); }) }
    else if (transactiontype == 0) { swal('alert', 'Please select transaction  type', 'error').then(function () { swal.close(); $('#ddltransactiontype').focus(); }) }
    else if (Coustomertype == 0) { swal('alert', 'Please select coustomer type', 'error').then(function () { swal.close(); $('#ddlCoustomertype').focus(); }) }
    else if (paymenttype == 0) { swal('alert', 'Please select bill type.', 'error').then(function () { swal.close(); $('#ddlPaymentType').focus(); }) }
    else if (payaccounttype == 0) { swal('alert', 'Please select pay account.', 'error').then(function () { swal.close(); $('#ddlpayaccounttype').focus(); }) }
    else if (_list.length <= 0) { swal('Alert!', 'Please add product.', "error") }
    else {
        //if (date_livraison.length > 0) date_livraison = date_livraison[2] + '/' + date_livraison[0] + '/' + date_livraison[1];
        let _order = {
            fk_transactiontype: transactiontype, customertype: Coustomertype, fk_customer: coustomerid, fk_vendor: vendorid, instation: instaintionval, date_creation: date, fk_paymenttype: paymenttype,
            payaccount: payaccounttype,
            totqty: parseInt($("#thQuantity").data('total')), total_rate: parseFloat($("#SubTotal").data('total')),
            total_tax: parseFloat($("#salesTaxTotal").data('total')), total_ttc: parseFloat($("#orderTotal").data('total'))
        }
        let option = { strValue1: 0, strValue2: JSON.stringify(_order), strValue3: JSON.stringify(_list) }
        //console.log(option, _order, _list); return;
        swal.queue([{
            title: '', confirmButtonText: 'Yes, update it!', text: "Do you want to pay your bill?",
            showLoaderOnConfirm: true, showCancelButton: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    $.post('/PaymentInvoice/NewMiscBill', option).done(function (result) {
                        result = JSON.parse(result);
                        if (result[0].Response == "success") {
                             
                            swal('Success', 'Misc Bills saved successfully.', "success");
                            //then(function () { window.location.href = window.location.origin + "/PurchaseOrder/NewPurchaseOrder/" + result[0].id; ActivityLog('create new purchase order for vendor id (' + vendorid + ')', '/PurchaseOrder/NewPurchaseOrder'); });
                        }
                        else { swal('Error', 'Something went wrong, please try again.', "error"); }
                    }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
                });
            }
        }]);
    }
}