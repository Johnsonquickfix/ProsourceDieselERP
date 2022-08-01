$(document).ready(function () {
    $('#txtpaymentdate').daterangepicker({ singleDatePicker: true, autoUpdateInput: true, locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' } });
    $('#divcred,#divpaypal').hide();
    $('.billinfo').prop("disabled", true);
    $.when(filldropdown(), setURLPara()).done(function () { getPurchaseOrderInfo(); setTimeout(function () { getpaymenttp($("#hfpaytype").val()) }, 1000);});

    //isEdit(true);
    $('#ddlPaymentType').change(function (t) {
        let Paymentype = $("#ddlPaymentType").val();
        if (Paymentype == "1") {
            $('#divcred').hide(); $('#ddlaccount,#txtNumbertransfer,#txtpaymentdate').prop('disabled', false);
            $('#divpaypal').hide();
            $('.footer-finalbutton').empty().append('<a title="Back to list"  data-toggle="tooltip" data-placement="top"  class="btn btn-danger back_to_list" href="/PaymentInvoice/PayBillsMisc">Back to List</a><button title="Click for cancel" data-toggle="tooltip" type="button" class="btn btn-danger btnUndoRecord"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" class="btn btn-danger" id="btnSave" data-toggle="tooltip" title="Click for pay"><i class="far fa-save"></i> Pay</button>');
            $('#btnSave').show();

        }
        else if (Paymentype == '8') {
            $('#divcred').show(); $('#ddlaccount,#txtNumbertransfer,#txtpaymentdate').prop('disabled', false);
            $('#divpaypal').hide();
            $('.footer-finalbutton').empty().append('<a title="Back to list"  data-toggle="tooltip" data-placement="top"  class="btn btn-danger back_to_list" href="/PaymentInvoice/PayBillsMisc">Back to List</a><button title="Click for cancel" data-toggle="tooltip" type="button" class="btn btn-danger btnUndoRecord"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" class="btn btn-danger" id="btnSave" data-toggle="tooltip" title="Click for pay"><i class="far fa-save"></i> Pay</button>');
            $('#btnSave').show();

        }
        else if (Paymentype == '10') {
            $('#divcred').hide(); $('#ddlaccount,#txtNumbertransfer,#txtpaymentdate').prop('disabled', true);
            $('#divpaypal').show(); $('#ddlaccount').val('0').trigger('change'); $('#txtNumbertransfer').val('');
            //$('#txtpaymentdate').daterangepicker({ startDate: moment(), endDate: moment() });
            $('#txtpaymentdate').data('daterangepicker').setStartDate(moment());
            $('#txtpaymentdate').data('daterangepicker').setEndDate(moment());

            if ($("#hfpaypal_id").val() == 'N') {
                swal('Alert!', "you can't payment without paypal_id please remove that bill", "error");
                $('#btnSave').hide();
                $('.btnUndoRecord').hide();
                $('.footer-finalbutton').empty().append('<a title="Back to list"  data-toggle="tooltip" data-placement="top"  class="btn btn-danger back_to_list" href="/PaymentInvoice/PayBillsMisc">Back to List</a>');
            }
            else {
                $('.footer-finalbutton').empty().append('<a title="Back to list"  data-toggle="tooltip" data-placement="top"  class="btn btn-danger back_to_list" href="/PaymentInvoice/PayBillsMisc">Back to List</a><button title="Click for cancel" data-toggle="tooltip" type="button" class="btn btn-danger btnUndoRecord"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" class="btn btn-danger" id="btnSave" data-toggle="tooltip" title="Click for pay"><i class="far fa-save"></i> Pay</button>');
                $('#btnSave').show();
            }
        }
        else {
            $('#divcred').hide(); $('#ddlaccount,#txtNumbertransfer,#txtpaymentdate').prop('disabled', false);
            $('#divpaypal').hide();
        }
    });

    $(document).on("click", ".btnEdit", function (t) {
        t.preventDefault(); $("#loader").show(); $('.billinfo').prop("disabled", false); //$('#txtbillfirstname').focus();
        $('.footer-finalbutton').empty().append('<a title="Back to list"  data-toggle="tooltip" data-placement="top"  class="btn btn-danger back_to_list" href="/PaymentInvoice/PayBillsMisc">Back to List</a><button title="Click for cancel" data-toggle="tooltip" type="button" class="btn btn-danger btnUndoRecord"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" title="Click for pay" data-toggle="tooltip" class="btn btn-danger" id="btnSave"><i class="far fa-save"></i> Pay</button>');
        $(".top-action").empty().append('<button type="button" title="Click for cancel" data-toggle="tooltip" class="btn btn-danger btnUndoRecord" data-toggle="tooltip" title="Cancel"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" class="btn btn-danger" id="btnSave" data-toggle="tooltip" title="Click for pay"><i class="far fa-save"></i> Pay</button>');
        $("#loader").hide(); isEdit(true);
    });
    $(document).on("click", ".btnUndoRecord", function (t) { t.preventDefault(); $("#loader").show(); getPurchaseOrderInfo(); isEdit(false); });
    //$(document).on("click", "#btnSave", function (t) { t.preventDefault(); saveVendorPO(); });
    $(document).on("click", "#btnSave", function (t) { t.preventDefault(); savePayment(); });
})
function setURLPara() {
    let queryString = new Array();
    if (queryString.length == 0) {
        if (window.location.search.split('?').length > 1) {
            var params = window.location.search.split('?')[1].split('&');
            for (let i = 0; i < params.length; i++) {
                let key = params[i].split('=')[0];
                let value = decodeURIComponent(params[i].split('=')[1]);
                queryString[key] = value;
            }
        }
    }
    if (queryString["status"] != null && queryString["id"] != null) {
        $("#hfstatus").val(queryString["status"]);
        $("#hfqueryids").val(queryString["id"]);
    }
};
function getpaymenttp(tpid) {
    $('#ddlPaymentType').val(tpid).trigger('change');
};
function isEdit(val) { localStorage.setItem('isEdit', val ? 'yes' : 'no'); }
function filldropdown() {
    $.ajax({
        url: "/PaymentInvoice/GetPaymentType", type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            //Product
            $("#ddlPaymentType").html('<option value="0">Select Payment Type</option>');
            $.each(dt['Table'], function (i, r) { $("#ddlPaymentType").append('<option value="' + r.id + '">' + r.text + '</option>'); });

            $("#ddlaccount").html('<option value="0">Select Account</option>');
            $.each(dt['Table1'], function (i, r) { $("#ddlaccount").append('<option value="' + r.id + '">' + r.text + '</option>'); });

        },
        complete: function () { $("#loader").hide(); }, error: function (xhr, status, err) { $("#loader").hide(); }, async: false
    });
}

function getPurchaseOrderInfo() {
    let payterm = 0;
    let status = $("#hfstatus").val(), id = $("#hfqueryids").val();
    $('.page-heading').text('Payment Process').append('<a title="Back to list" data-toggle="tooltip" data-placement="top" class="btn btn-danger back_to_list" href="/PaymentInvoice/PayBillsMisc">Back to List</a>');
    $('.footer-finalbutton').empty().append('<a title="Back to list" data-toggle="tooltip" data-placement="top"  class="btn btn-danger back_to_list" href="/PaymentInvoice/PayBillsMisc">Back to List</a>');

    $('#line_items').empty();
    var option = { strValue1: status, strValue2: id };
    $.ajax({
        url: "/PaymentInvoice/GetPaymentMiscByID", type: "Get", beforeSend: function () { $("#loader").show(); }, data: option,
        success: function (result) {
            try {
                let data = JSON.parse(result);
                $.each(data['po'], function (i, r) {
                    if (r.rowid > 0) {
                        $("#hfbilno").val(r.ref); $("#hfvname").val(r.displayname);
                        $("#hfpaytype").val(r.payaccount);
                       // $('#ddlPaymentType').val(r.payaccount).trigger('change');
                    }
                });
                $.each(data['pod'], function (i, r) {
                    let itemHtml = '';
                    if (r.rowid > 0) {

                        papalid = r.paypal_id.trim();
                        console.log(papalid);
                        if (r.paypal_id.trim() == '' || r.paypal_id.trim() == "" || r.paypal_id.trim() == null) {
                            $("#hfpaypal_id").val('N');
                        }

                        itemHtml = '<tr id="tritemid_' + r.rowid + '" class="paid_item" data-id="' + r.rowid + '" data-supplier="' + r.ref_supplier + '" data-billno="' + r.ref + '" data-discount2able="' + r.discount2able + '" data-dayapply="' + r.dayapply + '" data-Beforeday="' + r.Beforeday + '" data-discountType1="' + r.DiscountType1 + '" data-defaultdiscount="' + r.DefaultDiscount + '" data-discountminimumorderamount="' + r.DiscountMinimumOrderAmount + '" data-discounttype2="' + r.DiscountType2 + '" data-discount="' + r.Discount + '" data-subtotal="' + r.subtotal + '">';
                        itemHtml += '<td>' + r.ref + ' <a href="#" title="Click here to print" data-toggle="tooltip" onclick="getBillPrintDetails(' + r.rowid + ', false);"><i class="fas fa-search-plus"></i></a></td>';
                        /*      itemHtml += '<td>' + r.displayname + '</td>';*/
                        itemHtml += '<td class="vendor-name" data-vendorname="' + r.displayname + '">' + r.displayname + '</td>';
                        if (r.billtype.trim() == 'V') itemHtml += '<td class="bill-type">' + 'Vendor' + '</td>';
                        else if (r.billtype.trim() == 'C') itemHtml += '<td class="bill-type">' + 'Customer' + '</td>';
                        else itemHtml += '<td class="bill-type">' + 'Institution' + '</td>';
                        itemHtml += '<td class="text-left">' + r.date_modified + '</td>';

                        itemHtml += '<td class="text-right ship-amount">$' + r.total_ttc.toFixed(2) + '</td>';

                        itemHtml += '<td class="text-right">$' + r.recieved.toFixed(2) + '</td>';
                        itemHtml += '<td class="text-right price-remaining" data-tax1="' + r.remaining + '">$' + r.remaining.toFixed(2) + '</td>';
                        if (r.recieved.toFixed(2) == 0.00) {
                            payterm = r.total_ttc.toFixed(2) * (r.fk_paymentterm / 100);
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control text-right billinfo number rowCalulate" type="number" id="txt_itemprice_' + r.rowid + '" value="' + payterm.toFixed(2) + '" name="txt_itemprice" placeholder="Payment" data-paypal_type="' + r.paypal_id_type + '" data-paypal_id="' + r.paypal_id + '"></td>';
                        }
                        else {
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control text-right billinfo number rowCalulate" type="number" id="txt_itemprice_' + r.rowid + '" value="' + r.remaining.toFixed(2) + '" name="txt_itemprice" placeholder="Payment" data-paypal_type="' + r.paypal_id_type + '" data-paypal_id="' + r.paypal_id + '"></td>';
                        }

                        //if (r.recieved.toFixed(2) == 0.00) {

                        //    payterm = r.total_ttc.toFixed(2) * (r.fk_paymentterm / 100);
                        //    itemHtml += '<td class="text-right row-discountval">' + payterm.toFixed(2) + '</td>';
                        //}
                        //else {
                        //    //itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfodis number rowCalulate" type="number" id="txt_itempricedis_' + r.rowid + '" value="' + r.remaining.toFixed(2) + '" name="txt_itempricedis" placeholder="Discounted"></td>';
                        //    itemHtml += '<td class="text-right row-discountval">' + r.remaining.toFixed(2) + '</td>';
                        //}

                        itemHtml += '<td class="text-right row-discountval">' + 0 + '</td>';
                        itemHtml += '<td class="text-right row-total">' + 0 + '</td>';


                        itemHtml += '</tr>';
                        $('#line_items').append(itemHtml);
                    }
                });
            }
            catch (error) { $("#loader").hide(); console.log(error); swal('Error', "something went wrong.", "error"); }
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); swal('Error', "something went wrong.", "error"); }, async: false
    });

    $("#divAddItemFinal").find(".rowCalulate").change(function () { calculateFinal(); }); calculateFinal();
    $('.footer-finalbutton').empty().append('<a title="Back to list" data-toggle="tooltip" data-placement="top"  class="btn btn-danger back_to_list" href="/PaymentInvoice/PayBillsMisc">Back to List</a><button type="button" title="Click for edit" data-toggle="tooltip" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
    // $(".top-action").empty().append('<button type="button" class="btn btn-danger btnEdit" data-toggle="tooltip" title="Edit"><i class="far fa-edit"></i> Edit</button>');
    $(".top-action").empty().append('<button type="button" title="Click for edit" data-toggle="tooltip" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
    $('.billinfo').prop("disabled", true);
    $('.billinfodis').prop("disabled", true);
}

function calculateFinal() {
    let tGrossAmt = 0.00;
    //main item
    $("#line_items > tr.paid_item").each(function (index, row) {
        let rPrice = 0.00, rTotl = 0.00
        remaing = parseFloat($(row).find("[name=txt_itemprice]").val().trim()) || 0.00;
        payment = parseFloat($(row).find(".price-remaining").data('tax1')) || 0.00;
        billtype = $(row).find(".bill-type").text();
        Discount = parseFloat($(row).data('discount')) || 0.00;
        DiscountMinimumOrderAmount = parseFloat($(row).data('discountminimumorderamount')) || 0.00;
        dayapply = parseInt($(row).data('dayapply'));
        discount2able = parseInt($(row).data('discount2able'));
        DiscountType2 = parseInt($(row).data('discounttype2')) || 0;
        DefaultDiscount = parseFloat($(row).data('defaultdiscount')) || 0.00;
        DiscountType1 = $(row).data('discounttype1');
        subtotal = parseFloat($(row).data('subtotal')) || 0.00;

        //console.log(payment.toFixed(2), remaing.toFixed(2));
        if (remaing > payment) {
            swal('Alert!', "you can't receive greater payment form  remaining payment", "error");
            parseFloat($(row).find("[name=txt_itemprice]").val(0.00));
            $(row).find("[name=txt_itemprice]").focus();
            $(row).find(".row-discountval").text(0.00);
            $(row).find(".row-total").text(0.00);

        }
        //console.log(remaing);
        tGrossAmt += remaing;
        $(row).find(".row-discountval").text(0);
        $(row).find(".row-total").text(remaing);
        if (remaing == payment && billtype == 'Vendor') {
            if (DiscountType1 == 'Fixed') {
                if (subtotal >= DiscountMinimumOrderAmount)
                    rPrice = DefaultDiscount;
            }
            else if (DiscountType1 == 'Percentage') {
                if (subtotal >= DiscountMinimumOrderAmount)
                    rPrice = subtotal * DefaultDiscount / 100
            }
            else if (DiscountType2 > 0) {
                if (dayapply == 0 && discount2able == 1)
                    rPrice = subtotal * Discount / 100
            }
            
            if (payment < rPrice) {
                rPrice = 0;
            }
         
            $(row).find(".row-discountval").text(rPrice.toFixed(2));
            rTotl = remaing - rPrice;
            $(row).find(".row-total").text(rTotl.toFixed(2));
            $("#Discount").html(rPrice.toFixed(2));
            $("#SubTotal").html(rTotl.toFixed(2));
        }
        else {
            if (remaing > payment) {
                $("#SubTotal").html(0.00);
                $("#Discount").html(0.00);
                $(row).find(".row-total").text(0.00);
            }
            else {
                $(row).find(".row-total").text(remaing.toFixed(2));
                $("#Discount").html(rPrice.toFixed(2));
                $("#SubTotal").html(remaing.toFixed(2));
            }
        }
        // $("#Discount").html(rPrice.toFixed(2));
        //  $("#SubTotal").html(remaing.toFixed(2));

    });

    $("#Total").html(tGrossAmt.toFixed(2));

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

    let _list = createItemsList(), _payment_list = createPaymentItems();
    if (PaymentTypeid <= 0) { swal('Error', 'Please Select Payment Type', 'error').then(function () { swal.close(); $('#ddlPaymentType').focus(); }) }
    else if (PaymentTypeid != 10 && accountid <= 0) { swal('Error', 'Please Select Account', 'error').then(function () { swal.close(); $('#ddlaccount').focus(); }) }
    else if (_list.length <= 0) { swal('Error', 'Receive payment should not be zero', 'error').then(function () { swal.close(); }) }
    else {
        let _order = {
            id: 0, fk_payment: PaymentTypeid, fk_bank: accountid, num_payment: Numbertransfer, note: Transmitter, bankcheck: BankCheck, comments: Comments, datec: paydate, fk_status: 0,
            amount: parseFloat($("#Total").text()) || 0.00, discount: parseFloat($("#Discount").text()) || 0.00, sub_total: parseFloat($("#SubTotal").text()) || 0.00,
            items: _list
        }
       // let option = { strValue1: 0, strValue2: JSON.stringify(_order), strValue3: parseInt(PaymentTypeid) || 0, strValue4: JSON.stringify(_payment_list) }
          let option = { strValue1: 0, strValue2: JSON.stringify(_order), strValue3: parseInt(PaymentTypeid) || 0, strValue4: JSON.stringify(_payment_list), strValue5: JSON.stringify(_list), SortDir: PaymentTypeid, SortCol: accountno, PageNo: expimmyyval, PageSize: cardcode }
        //console.log(option); return;
        swal.queue([{
            title: 'Are you sure?', confirmButtonText: 'Yes', text: 'Would you like to pay for the $' + parseFloat($("#SubTotal").text()) + ' amount?',
            showLoaderOnConfirm: true, showCancelButton: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    $.post('/PaymentInvoice/SavePaymentMiscBill', option).done(function (result) {
                        if (result != '') {
                            result = JSON.parse(result);
                            if (result[0].Response == "Success") {
                                swal('Success', 'Payment has been taken successfully!!', 'success').then((result) => { location.href = 'PayBillsMisc'; });
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

//$(document).on("click", "#btnSave", function (t) { t.preventDefault();  });

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
    let accountno = $("#txt_cardNumber").val();
    let expimmyy = $("#expires_mmyy").val();
    let expimmyyval = expimmyy.replace('/', '');
    let cardcode = $("#txtcardcode").val();
    let vnname = $("#hfvname").val();
    let billno = $("#hfbilno").val();
    let paydate = $("#txtpaymentdate").val();
    if (PaymentTypeid <= 0) { swal('Error', 'Please Select Payment Type', 'error').then(function () { swal.close(); $('#ddlPaymentType').focus(); }) }
    else if (accountid <= 0) { swal('Error', 'Please Select Account', 'error').then(function () { swal.close(); $('#ddlaccount').focus(); }) }
    else if (_list.length <= 0) { swal('Error', 'Receive payment should not be zero', 'error').then(function () { swal.close(); }) }
    else {
        let _order = {
            fk_payment: PaymentTypeid, fk_bank: accountid, num_payment: Numbertransfer, note: Transmitter, bankcheck: BankCheck, comments: Comments,
            amount: parseFloat($("#Total").text()), fk_status: 0, discount: parseFloat($("#Discount").text()), sub_total: parseFloat($("#SubTotal").text()), datec: paydate
        }
        let option = { strValue1: 0, strValue2: JSON.stringify(_order), strValue3: JSON.stringify(_list), strValue4: vnname, strValue5: billno, strValue6: parseFloat($("#SubTotal").text()), SortDir: PaymentTypeid, SortCol: accountno, PageNo: expimmyyval, PageSize: cardcode }
        //console.log(option);
        swal.queue([{
            title: 'Are you sure?', confirmButtonText: 'Yes', text: 'Would you like to pay for the $' + parseFloat($("#SubTotal").text()) + ' amount?',
            showLoaderOnConfirm: true, showCancelButton: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    $.post('/PaymentInvoice/TakePaymentMisc', option).done(function (result) {
                        if (result != '') {
                            result = JSON.parse(result);
                            if (result[0].Response == "Success") {
                                swal('Success', 'Payment has been taken successfully!!', 'success').then((result) => { location.href = 'PayBillsMisc'; });
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
        discount = parseFloat($(row).find(".row-discountval").text()) || 0.00;
        subtotal = parseFloat($(row).find(".row-total").text()) || 0.00;
        payeeval = $(row).find(".vendor-name").data('vendorname');
        bailance = remaing - payment;
        if (bailance > 0) { status = "UN"; }
        if (payment > 0) {
            _list.push({ fk_invoice: $(row).data('id'), fk_invoceso: $(row).data('billno'), amount: payment, type: status, thirdparty_code: $(row).data('supplier'), discount: discount, sub_total: subtotal, checkstatus: checkstatus, payee: payeeval });
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
            _list.push({ recipient_type: _paypal_type, receiver: _paypal_id, note: "Payment transfer.", sender_item_id: parseInt($(row).data('id')) || 0, amount: { currency: "USD", value: payment } });
        }
        else if ((PaymentTypeid == 7 || PaymentTypeid == 8) && payment > 0) {
            //Credit Card
            let _cardNumber = $("#txt_cardNumber").val(), _expirationDate = $("#expires_mmyy").val().replace(/[^0-9]/gi, ''), _cardCode = parseInt($("#txtcardcode").val()) || 0;
            _list.push({ bill_id: parseInt($(row).data('id')) || 0, invoice_Number: $(row).data('billno'), coustomer: _name, amount: payment, cardNumber: _cardNumber, expirationDate: _expirationDate, cardCode: _cardCode });
        }
        else if ((PaymentTypeid == 1 || PaymentTypeid == 4) && payment > 0) {
            //Bank transfer
            _list.push({ bill_id: parseInt($(row).data('id')) || 0, invoice_Number: $(row).data('billno'), coustomer: _name, amount: payment });
        }
    });
    return _list;
}

function formatString(e) {
    var inputChar = String.fromCharCode(event.keyCode);
    var code = event.keyCode;
    var allowedKeys = [8];
    if (allowedKeys.indexOf(code) !== -1) {
        return;
    }

    event.target.value = event.target.value.replace(
        /^([1-9]\/|[2-9])$/g, '0$1/' // 3 > 03/
    ).replace(
        /^(0[1-9]|1[0-2])$/g, '$1/' // 11 > 11/
    ).replace(
        /^([0-1])([3-9])$/g, '0$1/$2' // 13 > 01/3
    ).replace(
        /^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2' // 141 > 01/41
    ).replace(
        /^([0]+)\/|[0]+$/g, '0' // 0/ > 0 and 00 > 0
    ).replace(
        /[^\d\/]|^[\/]*$/g, '' // To allow only digits and `/`
    ).replace(
        /\/\//g, '/' // Prevent entering more than 1 `/`
    );
}
function checkDigit(event) {
    var code = (event.which) ? event.which : event.keyCode;

    if ((code < 48 || code > 57) && (code > 31)) {
        return false;
    }

    return true;
}