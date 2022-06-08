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
            setTimeout(function () { getpaymenttp($("#hfpaytype").val()) }, 1000);
           // $('#ddlPaymentType').val('3').trigger('change');
        }
    });
    $('#divcred').hide();
    $('#divpaypal').hide();

    //$('#expires_mmyy').inputmask({
    //    alias: 'datetime',
    //    inputFormat: 'mm/yy',
    //    min: moment().add(1, 'M').format('MM/YY'),
    //    max: moment().add(10, 'Y').format('MM/YY')
    //})

    filldropdown();
    $('.billinfo').prop("disabled", true);
    //isEdit(true);
    $('#ddlPaymentType').change(function (t) {
        let Paymentype = $("#ddlPaymentType").val();         
        if (Paymentype == "7") {
            // console.log(Coustomertype);
            $('#divcred').show();
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
   //// console.log('dd', 2);
   // $('#ddlPaymentType').val(2).trigger('change');
})
function getpaymenttp(tpid) {
    $('#ddlPaymentType').val(tpid).trigger('change');
};
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
            $("#ddlPaymentType").html('<option value="0">Select Payment Type</option>');
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
    $('.page-heading').text('Payment Process').append('<a title="Back to list" data-toggle="tooltip" data-placement="top" class="btn btn-danger back_to_list" href="/PaymentInvoice/PayBillsMisc">Back to List</a>');
    $('.footer-finalbutton').empty().append('<a title="Back to list" data-toggle="tooltip" data-placement="top"  class="btn btn-danger back_to_list" href="/PaymentInvoice/PayBillsMisc">Back to List</a>');

    $('#line_items').empty();
    var option = { strValue1: status, strValue2: id };
    $.ajax({
        url: "/PaymentInvoice/GetPaymentMiscByID", type: "Get", beforeSend: function () { $("#loader").show(); }, data: option,
        success: function (result) {
            try {
                let data = JSON.parse(result);
                for (let i = 0; i < data['po'].length; i++) {
                    if (data['pod'][i].rowid > 0) {
                        $("#hfbilno").val(data['po'][i].ref);
                        $("#hfvname").val(data['po'][i].displayname);
                     //  console.log('dd',data['po'][i].payaccount);
                       // $('#ddlPaymentType').val(1).trigger('change');
                       // $('#ddlPaymentType').val(1).trigger('change');
                        $("#hfpaytype").val(data['po'][i].payaccount);
                    }
                }
                for (let i = 0; i < data['pod'].length; i++) {
                    let itemHtml = '';
                    if (data['pod'][i].rowid > 0) {
                       
                        itemHtml = '<tr id="tritemid_' + data['pod'][i].rowid + '" class="paid_item" data-pid="' + data['pod'][i].rowid + '" data-supplier="' + data['pod'][i].ref_supplier + '" data-rowid="' + data['pod'][i].ref + '" data-discount2able="' + data['pod'][i].discount2able + '" data-dayapply="' + data['pod'][i].dayapply + '" data-Beforeday="' + data['pod'][i].Beforeday + '" data-discountType1="' + data['pod'][i].DiscountType1 + '" data-defaultdiscount="' + data['pod'][i].DefaultDiscount + '" data-discountminimumorderamount="' + data['pod'][i].DiscountMinimumOrderAmount + '" data-discounttype2="' + data['pod'][i].DiscountType2 + '" data-discount="' + data['pod'][i].Discount + '" data-subtotal="' + data['pod'][i].subtotal +'">';
                        itemHtml += '<td>' + data['pod'][i].ref + ' <a href="#" title="Click here to print" data-toggle="tooltip" onclick="getBillPrintDetails(' + data['pod'][i].rowid  + ', false);"><i class="fas fa-search-plus"></i></a></td>';
                        itemHtml += '<td>' + data['pod'][i].displayname + '</td>';
                        if (data['pod'][i].billtype.trim() == 'V')
                            itemHtml += '<td class="bill-type">' + 'Vendor' + '</td>';
                        else if (data['pod'][i].billtype.trim() == 'C')
                            itemHtml += '<td class="bill-type">' + 'Customer' + '</td>';
                        else
                            itemHtml += '<td class="bill-type">' + 'Institution' + '</td>';
                        itemHtml += '<td class="text-left">' + data['pod'][i].date_modified + '</td>';

                        itemHtml += '<td class="text-right ship-amount">$' + data['pod'][i].total_ttc.toFixed(2) + '</td>';
                   
                        itemHtml += '<td class="text-right">$' + data['pod'][i].recieved.toFixed(2) + '</td>';
                        itemHtml += '<td class="text-right price-remaining" data-tax1="' + data['pod'][i].remaining + '">$' + data['pod'][i].remaining.toFixed(2) + '</td>';
                        if (data['pod'][i].recieved.toFixed(2) == 0.00) {
                           
                            payterm = data['pod'][i].total_ttc.toFixed(2) * (data['pod'][i].fk_paymentterm / 100);
                            //console.log(payterm);
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control text-right billinfo number rowCalulate" type="number" id="txt_itemprice_' + data['pod'][i].rowid + '" value="' + payterm.toFixed(2) + '" name="txt_itemprice" placeholder="Payment"></td>';

                        }
                        else {
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control text-right billinfo number rowCalulate" type="number" id="txt_itemprice_' + data['pod'][i].rowid + '" value="' + data['pod'][i].remaining.toFixed(2) + '" name="txt_itemprice" placeholder="Payment"></td>';
                            
                        }

                        //if (data['pod'][i].recieved.toFixed(2) == 0.00) {

                        //    payterm = data['pod'][i].total_ttc.toFixed(2) * (data['pod'][i].fk_paymentterm / 100);
                        //    itemHtml += '<td class="text-right row-discountval">' + payterm.toFixed(2) + '</td>';
                        //}
                        //else {
                        //    //itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfodis number rowCalulate" type="number" id="txt_itempricedis_' + data['pod'][i].rowid + '" value="' + data['pod'][i].remaining.toFixed(2) + '" name="txt_itempricedis" placeholder="Discounted"></td>';
                        //    itemHtml += '<td class="text-right row-discountval">' + data['pod'][i].remaining.toFixed(2) + '</td>';
                        //}

                        itemHtml += '<td class="text-right row-discountval">' + 0 + '</td>';
                        itemHtml += '<td class="text-right row-total">' + 0 + '</td>';
                       

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
    $('.footer-finalbutton').empty().append('<a title="Back to list" data-toggle="tooltip" data-placement="top"  class="btn btn-danger back_to_list" href="/PaymentInvoice/PayBillsMisc">Back to List</a><button type="button" title="Click for edit" data-toggle="tooltip" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
    // $(".top-action").empty().append('<button type="button" class="btn btn-danger btnEdit" data-toggle="tooltip" title="Edit"><i class="far fa-edit"></i> Edit</button>');
    $(".top-action").empty().append('<button type="button" title="Click for edit" data-toggle="tooltip" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
    $('.billinfo').prop("disabled", true);
    $('.billinfodis').prop("disabled", true);
}
$(document).on("click", ".btnEdit", function (t) {
    t.preventDefault(); $("#loader").show();
    $('.billinfo').prop("disabled", false); //$('#txtbillfirstname').focus();
    let status = $("#hfstatus").val();
    $('.footer-finalbutton').empty().append('<a title="Back to list"  data-toggle="tooltip" data-placement="top"  class="btn btn-danger back_to_list" href="/PaymentInvoice/PayBillsMisc">Back to List</a><button title="Click for cancel" data-toggle="tooltip" type="button" class="btn btn-danger btnUndoRecord"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" title="Click for pay" data-toggle="tooltip" class="btn btn-danger" id="btnSave"><i class="far fa-save"></i> Pay</button>');
    $(".top-action").empty().append('<button type="button" title="Click for cancel" data-toggle="tooltip" class="btn btn-danger btnUndoRecord" data-toggle="tooltip" title="Cancel"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" class="btn btn-danger" id="btnSave" data-toggle="tooltip" title="Click for pay"><i class="far fa-save"></i> Pay</button>');
    $("#loader").hide();
    isEdit(true);
});
$(document).on("click", ".btnUndoRecord", function (t) { t.preventDefault(); $("#loader").show(); getPurchaseOrderInfo(); isEdit(false); });
function calculateFinal() {
    let tGrossAmt = 0.00;
    //main item
    $("#line_items > tr.paid_item").each(function (index, row) {
        let rPrice = 0.00, rTotl = 0.00
        remaing  = parseFloat($(row).find("[name=txt_itemprice]").val().trim()) || 0.00;
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
        
        console.log(remaing, payment, DiscountType1, DiscountMinimumOrderAmount, DefaultDiscount, DiscountType2, dayapply, discount2able, Discount);
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
            console.log(rPrice);
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

$(document).on("click", "#btnSave", function (t) { t.preventDefault(); saveVendorPO(); });
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
    console.log(expimmyyval);
    let cardcode = $("#txtcardcode").val();
    let vnname = $("#hfvname").val();
    let billno = $("#hfbilno").val();
    let paydate = $("#txtpaymentdate").val();
    //console.log(_list);
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
                        console.log('sss', result);
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
    if (PaymentTypeid == 3) {
        checkstatus = 0;
    }
    else {
        checkstatus = 2;
    }
    $('#line_items > tr').each(function (index, row) {
        let payment = 0.00, remaing = 0.00, bailance = 0.00;
        payment = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        remaing = parseFloat($(row).find(".price-remaining").data('tax1')) || 0.00;
        discount = parseFloat($(row).find(".row-discountval").text()) || 0.00;
        subtotal = parseFloat($(row).find(".row-total").text()) || 0.00;
        bailance = remaing - payment;
        if (bailance > 0) {
            status = "UN";
        }
        if (payment != 0) {
            _list.push({ fk_payment: $(row).data('pid'), fk_invoice: $(row).data('rowid'), amount: payment, type: status, thirdparty_code: $(row).data('supplier'), discount: discount, sub_total: subtotal, checkstatus: checkstatus  });
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