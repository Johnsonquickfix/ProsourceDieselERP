$(document).ready(function () {
    var queryString = new Array();
    $(function () {
        if (queryString.length == 0) {
            if (window.location.search.split('?').length > 1) {
                var params = window.location.search.split('?')[1].split('&');
                for (var i = 0; i < params.length; i++) {
                    var key = params[i].split('=')[0];
                    var value = decodeURIComponent(params[i].split('=')[1]);
                    queryString[key] = value;
                }
            }
        }
        if (queryString["status"] != null && queryString["id"] != null) {
            $("#hfstatus").val(queryString["status"]);
            $("#hfqueryids").val(queryString["id"]);
            // getPurchaseOrderInfo(queryString["status"], queryString["id"]);
            getPurchaseOrderInfo();
        }
    });
    $('#divcred').hide();
    $('#divpaypal').hide();
  //  filldropdown();
    $('.billinfo').prop("disabled", true);
    //isEdit(true);
    $('#ddlPaymentType').change(function (t) {
        let Paymentype = $("#ddlPaymentType").val();
        if (Paymentype == "1") {
            // console.log(Coustomertype);
            $('#divcred').hide();
            $('#divpaypal').hide();
 

        }
        else if (Paymentype == '8') {
            $('#divcred').show();
            $('#divpaypal').hide();
 

        }
        else if (Paymentype == '10') {
            $('#divcred').hide();
            $('#divpaypal').show();

        }
        else {
            $('#divcred').hide();
            $('#divpaypal').hide();
        }
    });
    $('#txtpaymentdate').daterangepicker({ singleDatePicker: true, autoUpdateInput: true, locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' } });
})

function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}
function filldropdown() {
    $.ajax({
        url: "/PaymentInvoice/GetPaymentType",
        type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            //Product
            $("#ddlPaymentType").html('<option value="">Select Payment Type</option>');
            for (i = 0; i < dt['Table'].length; i++) { $("#ddlPaymentType").append('<option value="' + dt['Table'][i].id + '">' + dt['Table'][i].text + '</option>'); }

            $("#ddlaccount").html('<option value="0">Select Account</option>');
            for (i = 0; i < dt['Table1'].length; i++) { $("#ddlaccount").append('<option value="' + dt['Table1'][i].id + '">' + dt['Table1'][i].text + '</option>'); }

        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }
    });


}

function getPurchaseOrderInfo() {
    let payterm = 0;
    let status = $("#hfstatus").val(), id = $("#hfqueryids").val();
    console.log(status, id); 
    $('.page-heading').text('Payment Process').append('<a title="Back to list" data-toggle="tooltip" data-placement="top" class="btn btn-danger back_to_list" href="/PaymentInvoice/PaymentSOInvoiceList">Back to List</a>');
    $('.footer-finalbutton').empty().append('<a title="Back to list" data-toggle="tooltip" data-placement="top"  class="btn btn-danger back_to_list" href="/PaymentInvoice/PaymentSOInvoiceList">Back to List</a>');
    
    $('#line_items').empty();
    var option = { strValue1: status, strValue2: id }; 
        $.ajax({
            url: "/PaymentInvoice/GetPaymentInvoiceSOByID", type: "Get", beforeSend: function () { $("#loader").show(); }, data: option,
            success: function (result) {
                try {
                    let data = JSON.parse(result);
                    for (let i = 0; i < data['pod'].length; i++) {
                        let itemHtml = '';
                        if (data['pod'][i].rowid > 0) {
                            itemHtml = '<tr id="tritemid_' + data['pod'][i].rowid + '" class="paid_item" data-pid="' + data['pod'][i].rowid + '" data-supplier="' + data['pod'][i].ref_supplier + '" data-billno="' + data['pod'][i].ref_ext   + '" data-rowid="' + data['pod'][i].ref_ext + '">';
                            itemHtml += '<td>' + data['pod'][i].ref_ext + '</td>';
                            //itemHtml += '<td>' + data['pod'][i].vendor_name + '</td>';
                            itemHtml += '<td class="vendor-name" data-vendorname="' + data['pod'][i].vendor_name + '">' + data['pod'][i].vendor_name + '</td>';
                            itemHtml += '<td class="text-left">' + data['pod'][i].date_modified + '</td>';
                       
                            itemHtml += '<td class="text-right ship-amount">$' + data['pod'][i].total_ttc.toFixed(2) + '</td>';
                            itemHtml += '<td class="text-right row-total">$' + data['pod'][i].recieved.toFixed(2) + '</td>';
                            itemHtml += '<td class="text-right price-remaining" data-tax1="' + data['pod'][i].remaining.toFixed(2) + '">$' + data['pod'][i].remaining.toFixed(2) + '</td>';
                            if (data['pod'][i].recieved.toFixed(2) == 0.00) {
                                payterm = data['pod'][i].total_ttc.toFixed(2) * (data['pod'][i].Term / 100);
                                itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + data['pod'][i].rowid + '" value="' + payterm.toFixed(2) + '" name="txt_itemprice" placeholder="Payment" data-paypal_type="' + data['pod'][i].paypal_id_type + '" data-paypal_id="' + data['pod'][i].paypal_id + '"></td>';
                              //  itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + data['pod'][i].rowid + '" value="' + data['pod'][i].remaining.toFixed(2) + '" name="txt_itemprice" placeholder="Payment"></td>';

                            }
                            else {
                                itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + data['pod'][i].rowid + '" value="' + data['pod'][i].remaining.toFixed(2) + '" name="txt_itemprice" placeholder="Payment" data-paypal_type="' + data['pod'][i].paypal_id_type + '" data-paypal_id="' + data['pod'][i].paypal_id + '"></td>';
                            }

                            itemHtml += '</tr>';
                            $('#line_items').append(itemHtml);
                        }
                    }
                }
                catch (error) { $("#loader").hide(); swal('Error', "something went wrong.", "error"); }
            },
            complete: function () { $("#loader").hide(); },
            error: function (xhr, status, err) { $("#loader").hide(); swal('Error', "something went wrong.", "error"); }, async: false
        });
   
    $("#divAddItemFinal").find(".rowCalulate").change(function () { calculateFinal(); }); calculateFinal();
    if ($('#hfvendor').val() == '1') {

        $.ajax({
            url: "/PaymentInvoice/GetPaymentwithoutcheckType",
            type: "Get", beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                let dt = JSON.parse(data);
                //Product
                $("#ddlPaymentType").html('<option value="">Select Payment Type</option>');
                for (i = 0; i < dt['Table'].length; i++) { $("#ddlPaymentType").append('<option value="' + dt['Table'][i].id + '">' + dt['Table'][i].text + '</option>'); }

                $("#ddlaccount").html('<option value="0">Select Account</option>');
                for (i = 0; i < dt['Table1'].length; i++) { $("#ddlaccount").append('<option value="' + dt['Table1'][i].id + '">' + dt['Table1'][i].text + '</option>'); }

            },
            complete: function () { $("#loader").hide(); },
            error: function (xhr, status, err) { $("#loader").hide(); }
        });
    }
    else {
        $.ajax({
            url: "/PaymentInvoice/GetPaymentType",
            type: "Get", beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                let dt = JSON.parse(data);
                //Product
                $("#ddlPaymentType").html('<option value="">Select Payment Type</option>');
                for (i = 0; i < dt['Table'].length; i++) { $("#ddlPaymentType").append('<option value="' + dt['Table'][i].id + '">' + dt['Table'][i].text + '</option>'); }

                $("#ddlaccount").html('<option value="0">Select Account</option>');
                for (i = 0; i < dt['Table1'].length; i++) { $("#ddlaccount").append('<option value="' + dt['Table1'][i].id + '">' + dt['Table1'][i].text + '</option>'); }

            },
            complete: function () { $("#loader").hide(); },
            error: function (xhr, status, err) { $("#loader").hide(); }
        });

    }
        $('.footer-finalbutton').empty().append('<a title="Back to list" data-toggle="tooltip" data-placement="top"  class="btn btn-danger back_to_list" href="/PaymentInvoice/PaymentSOInvoiceList">Back to List</a><button type="button" title="Click for edit" data-toggle="tooltip" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
    // $(".top-action").empty().append('<button type="button" class="btn btn-danger btnEdit" data-toggle="tooltip" title="Edit"><i class="far fa-edit"></i> Edit</button>');
    $(".top-action").empty().append('<button type="button" title="Click for edit" data-toggle="tooltip" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
    $('.billinfo').prop("disabled", true);
}
$(document).on("click", ".btnEdit", function (t) {
    t.preventDefault(); $("#loader").show();
    $('.billinfo').prop("disabled", false); //$('#txtbillfirstname').focus();
    let status = $("#hfstatus").val();
    $('.footer-finalbutton').empty().append('<a title="Back to list"  data-toggle="tooltip" data-placement="top"  class="btn btn-danger back_to_list" href="/PaymentInvoice/PaymentSOInvoiceList">Back to List</a><button title="Click for cancel" data-toggle="tooltip" type="button" class="btn btn-danger btnUndoRecord"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" title="Click for pay" data-toggle="tooltip" class="btn btn-danger" id="btnSave"><i class="far fa-save"></i> Pay</button>');
    $(".top-action").empty().append('<button type="button" title="Click for cancel" data-toggle="tooltip" class="btn btn-danger btnUndoRecord" data-toggle="tooltip" title="Cancel"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" class="btn btn-danger" id="btnSave" data-toggle="tooltip" title="Click for pay"><i class="far fa-save"></i> Pay</button>');
    $("#loader").hide();
    isEdit(true);
});
$(document).on("click", ".btnUndoRecord", function (t) { t.preventDefault(); $("#loader").show(); getPurchaseOrderInfo(); isEdit(false); });
function calculateFinal() {
    let tGrossAmt = 0.00;
    let vname = '';
    //main item
    $("#line_items > tr.paid_item").each(function (index, row) {
        let rPrice = 0.00, rQty = 0.00
        remaing = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        payment = parseFloat($(row).find(".price-remaining").data('tax1')) || 0.00;
        //console.log(remaing.toFixed(2), payment.toFixed(2));
        vname += $(row).find(".vendor-name").data('vendorname') + ",";
        console.log(remaing, payment);
        if (remaing > payment) {
            swal('Alert!', "you can't receive greater payment form remaining payment", "error");
            parseFloat($(row).find("[name=txt_itemprice]").val(0.00));
            $(row).find("[name=txt_itemprice]").focus();

        }
        //console.log(remaing);
        tGrossAmt += remaing;
    });
    var s = vname.replace(/,(?=\s*$)/, '');
    var match = s.split(',');
    console.log(allAreEqual(match));
    if (allAreEqual(match) == false) {
        // swal('Alert!', "You can't payment with different vendors", "error");
        // $(".btnEdit").show = false;
        //$('.btnEdit').hide();
        //  $('.btnEdit').css('display', 'none');
        $('#hfvendor').val('1');
    }
    else {
        $('#hfvendor').val('2');
    }
    $("#Total").html(tGrossAmt.toFixed(2));
}

//$(document).on("click", "#btnSave", function (t) { t.preventDefault(); saveVendorPO(); });
//$(document).on("click", "#btnSave", function (t) { t.preventDefault();  });
$(document).on("click", "#btnSave", function (t) { t.preventDefault(); savePayment(); });

function saveVendorPO() {
    // let id = parseInt($('#lblPoNo').data('id')) || 0;
    let PaymentTypeid = parseInt($("#ddlPaymentType").val()) || 0;
    let accountid = parseInt($("#ddlaccount").val()) || 0;
    let Numbertransfer = $("#txtNumbertransfer").val();
    let Transmitter = $("#txtTransmitter").val();
    let BankCheck = $("#txtBankCheck").val();
    let Comments = $("#txtComments").val();
    let _list = createItemsList();
    let status = $("#hfstatus").val();
    let paydate = $("#txtpaymentdate").val();
    //console.log(_list);
    if (PaymentTypeid <= 0) { swal('Error', 'Please Select Payment Type', 'error').then(function () { swal.close(); $('#ddlPaymentType').focus(); }) }
    else if (accountid <= 0) { swal('Error', 'Please Select Account', 'error').then(function () { swal.close(); $('#ddlaccount').focus(); }) }
    else if (_list.length <= 0) { swal('Error', 'Receive payment should not be zero', 'error').then(function () { swal.close(); }) }
    else {
        let _order = {
            fk_payment: PaymentTypeid, fk_bank: accountid, num_payment: Numbertransfer, note: Transmitter, bankcheck: BankCheck, comments: Comments,
            amount: parseFloat($("#Total").text()), fk_status: 0, datec: paydate
        }
        let option = { strValue1: 0, strValue2: JSON.stringify(_order), strValue3: JSON.stringify(_list) }
        //console.log(option);
        swal.queue([{
            title: 'Are you sure?', confirmButtonText: 'Yes', text: 'Would you like to pay for the $' + parseFloat($("#Total").text()) + ' amount?',
            showLoaderOnConfirm: true, showCancelButton: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    $.post('/PaymentInvoice/TakePaymentSO', option).done(function (result) {
                        result = JSON.parse(result);
                        if (result[0].Response == "Success") {
                            swal('Success', 'Payment has been taken successfully!!', 'success').then((result) => { location.href = 'PaymentSOInvoiceList'; });
                        }
                        else { swal('Error', 'Something went wrong, please try again.', "error"); }
                    }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
                });
            }
        }]);
    }

    isEdit(false);
}
function savePayment() {
    let PaymentTypeid = parseInt($("#ddlPaymentType").val()) || 0, accountid = parseInt($("#ddlaccount").val()) || 0;
    let paydate = $("#txtpaymentdate").val();
    let Numbertransfer = $("#txtNumbertransfer").val(), Comments = $("#txtComments").val();
    let Transmitter = $("#txtTransmitter").val(), BankCheck = $("#txtBankCheck").val();
    let accountno = $("#txt_cardNumber").val();
    let expimmyy = $("#expires_mmyy").val();
    let expimmyyval = expimmyy.replace('/', '');
    let cardcode = $("#txtcardcode").val();
    let status = $("#hfstatus").val();
    let _list = createItemsList(), _payment_list = createPaymentItems();
    if (PaymentTypeid <= 0) { swal('Error', 'Please Select Payment Type', 'error').then(function () { swal.close(); $('#ddlPaymentType').focus(); }) }
    else if (PaymentTypeid != 10 && accountid <= 0) { swal('Error', 'Please Select Account', 'error').then(function () { swal.close(); $('#ddlaccount').focus(); }) }
    else if (_list.length <= 0) { swal('Error', 'Receive payment should not be zero', 'error').then(function () { swal.close(); }) }
    else {
        let _order = {
            id: 0, fk_payment: PaymentTypeid, fk_bank: accountid, num_payment: Numbertransfer, note: Transmitter, bankcheck: BankCheck, comments: Comments,
            amount: parseFloat($("#Total").text()), fk_status: 0, datec: paydate,
            items: _list
        }
        let option = { strValue1: 0, strValue2: JSON.stringify(_order), strValue3: parseInt(PaymentTypeid) || 0, strValue4: JSON.stringify(_payment_list), strValue5: JSON.stringify(_list), SortDir: PaymentTypeid, SortCol: accountno, PageNo: expimmyyval, PageSize: cardcode }
        //console.log(option); return;
        swal.queue([{
            title: 'Are you sure?', confirmButtonText: 'Yes', text: 'Would you like to pay for the $' + parseFloat($("#Total").text()) + ' amount?',
            showLoaderOnConfirm: true, showCancelButton: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    $.post('/PaymentInvoice/TakePaymentSalesPO', option).done(function (result) {
                        result = JSON.parse(result);
                        if (result[0].Response == "Success") {
                            if (status == 'PO') {
                                swal('Success', 'Payment has been taken successfully!!', 'success').then((result) => { location.href = 'PaymentInvoiceList'; });
                            }
                            else {
                                swal('Success', 'Payment has been taken successfully!!', 'success').then((result) => { location.href = 'PaymentSOInvoiceList'; });
                            }

                        }
                        else { swal('Error', 'Payment gateway not configured. Or invalid credentials', "error"); }
                    }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
                });
            }
        }]);
    }

    isEdit(false);
}
function createItemsList_Old() {
    let _list = [];
    //let status = $("#hfstatus").val();
    let status = "PD";
    let checkstatus = 0;
    let PaymentTypeid = parseInt($("#ddlPaymentType").val()) || 0;
    if (PaymentTypeid == 3) {
        checkstatus = 0;
    }
    else {
        checkstatus = 2;
    }
    $('#line_items > tr').each(function (index, row) {
        let payment = 0.00, remaing = 0.00, bailance = 0.00;
        let payeeval = '';
        payment = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        remaing = parseFloat($(row).find(".price-remaining").data('tax1')) || 0.00;
        bailance = remaing - payment;
        payeeval = $(row).find(".vendor-name").data('vendorname');
        if (bailance > 0) {
            status = "UN";
        }
        if (payment != 0) {
            _list.push({ fk_payment: 0, fk_invoice: $(row).data('rowid'), amount: payment, type: status, thirdparty_code: $(row).data('supplier'), checkstatus: checkstatus, payee: payeeval });
        }
    });
    return _list;
}

function createItemsList() {
    let _list = [];
    //let status = $("#hfstatus").val();
    let status = "PD";
    let checkstatus = 0;
    let PaymentTypeid = parseInt($("#ddlPaymentType").val()) || 0;
    if (PaymentTypeid == 3) { checkstatus = 0; }
    else { checkstatus = 2; }
    $('#line_items > tr').each(function (index, row) {
        let payment = 0.00, remaing = 0.00, bailance = 0.00;
        payment = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        remaing = parseFloat($(row).find(".price-remaining").data('tax1')) || 0.00;
        //discount = parseFloat($(row).find(".row-discountval").text()) || 0.00;
        //subtotal = parseFloat($(row).find(".row-total").text()) || 0.00;
        payeeval = $(row).find(".vendor-name").data('vendorname');
        bailance = remaing - payment;
        if (bailance > 0) {
            status = "UN";
        }

        if (payment > 0) {
            _list.push({ fk_payment: 0, fk_invoice: $(row).data('pid'), fk_invoceso: $(row).data('billno'), amount: payment, type: status, thirdparty_code: $(row).data('supplier'), checkstatus: checkstatus, payee: payeeval });
            // _list.push({ fk_invoice: $(row).data('id'), fk_invoceso: $(row).data('billno'), amount: payment, type: status, thirdparty_code: $(row).data('supplier'), discount: discount, sub_total: subtotal, checkstatus: checkstatus, payee: payeeval });
        }
    });
    return _list;
}

function createPaymentItems() {
    let _list = [], PaymentTypeid = parseInt($("#ddlPaymentType").val()) || 0;
    $('#line_items > tr').each(function (index, row) {
        let payment = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        let _paypal_type = $(row).find("[name=txt_itemprice]").data('paypal_type');
        let _paypal_id = $(row).find("[name=txt_itemprice]").data('paypal_id');
        let _name = $(row).find(".vendor-name").data('vendorname');
        if (PaymentTypeid == 10 && payment > 0 && _paypal_id != '') {
            //Paypal 
            _list.push({ recipient_type: _paypal_type, receiver: _paypal_id, note: "Payment transfer.", sender_item_id: parseInt($(row).data('pod')) || 0, amount: { currency: "USD", value: payment } });
        }
        else if ((PaymentTypeid == 7 || PaymentTypeid == 8) && payment > 0) {
            //Credit Card
            let _cardNumber = $("#txt_cardNumber").val(), _expirationDate = $("#expires_mmyy").val().replace(/[^0-9]/gi, ''), _cardCode = parseInt($("#txtcardcode").val()) || 0;
            _list.push({ bill_id: parseInt($(row).data('pod')) || 0, invoice_Number: $(row).data('billno'), coustomer: _name, amount: payment, cardNumber: _cardNumber, expirationDate: _expirationDate, cardCode: _cardCode });
        }
        else if ((PaymentTypeid == 1 || PaymentTypeid == 4) && payment > 0) {
            //Bank transfer
            _list.push({ bill_id: parseInt($(row).data('pod')) || 0, invoice_Number: $(row).data('billno'), coustomer: _name, amount: payment });
        }
    });
    return _list;
}

function allAreEqual(array) {
    if (array.length > 0) {
        const result = array.every(element => {
            if (element === array[0]) {
                return true;
            }
        });

        return result;
    }

    return false;
}