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
        if (queryString["edate"] != null && queryString["id"] != null && queryString["endbailance"] != null && queryString["stdate"] != null && queryString["accountname"] != null && queryString["acountID"] != null) {
            $("#hfstatus").val(queryString["edate"]);
            $("#hfqueryids").val(queryString["id"]);
            $("#hfendbail").val(queryString["endbailance"]);
            $("#hfenddate").val(queryString["stdate"]);
            // console.log($("#hfstatus").val(), $("#hfqueryids").val(), $("#hfendbail").val(), $("#hfenddate").val());
            // getPurchaseOrderInfo(queryString["status"], queryString["id"]);  accountname
            $('#lblendingdata').text(queryString["stdate"]);
            $('#lblstatementendingbal').text(queryString["endbailance"]);
            $('#lblaccountname').text(queryString["accountname"]);
            /// $('#lblbeginningbalance').text("0");
            //$('#lblbeginningbalance').text("0");
            $("#hfaccid").val(queryString["acountID"]);
            $('#lbldateending').text(queryString["edate"]);
            getbankreconcilationInfo();
        }
    });

    /*filldropdown();*/
    $('.billinfo').prop("disabled", true);
    //isEdit(true);
    $(document).on("click", "#btnfinal", function (t) { t.preventDefault(); reconciling(); });
    $(document).on("click", "#btnUpdate", function (t) { t.preventDefault(); updatetransaction(); });
})

function isEdit(val) { localStorage.setItem('isEdit', val ? 'yes' : 'no'); }

function getbankreconcilationInfo() {
    let status = $("#hfstatus").val(), id = $("#hfqueryids").val(), hfendbail = $("#hfendbail").val(), stdate = $("#hfenddate").val(), accid = $("#hfaccid").val();
    $('.page-heading').append('<a title="Back to list" data-toggle="tooltip" data-placement="top" class="btn btn-danger back_to_list" href="/Accounting/BankReconciliation">Back to List</a>');
    //$('.footer-finalbutton').empty().append('<a title="Back to list" data-toggle="tooltip" data-placement="top"  class="btn btn-danger back_to_list" href="/PaymentInvoice/PayBillsMisc">Back to List</a>');

    $('#line_items').empty();
    var option = { strValue1: stdate, strValue2: id, strValue3: hfendbail, strValue4: status, strValue5: accid };
    $.ajax({
        url: "/Accounting/GetBankReconciliationprocess", type: "Get", beforeSend: function () { $("#loader").show(); }, data: option,
        success: function (result) {
            try {
                let data = JSON.parse(result);
                let diffrent = 0;
                $.each(data['po'], function (key, row) {
                    let clerdamt = row.bank_ending_balance - row.credit + row.debit;
                    $('#lblBeginnigbal').text(row.bank_ending_balance);
                    $('#lblpaymnet').text(row.credit);
                    $('#lbldeposit').text(row.debit);
                    $('#lblclearedbal').text(clerdamt.toFixed(2));
                    let endbal = parseFloat($('#lblstatementendingbal').text()) || 0.00;
                    diffrent = (endbal - clerdamt);
                    $('#lbldiffrence').text(diffrent.toFixed(2));
                    if (diffrent == 0) { $('.final-action').empty().append('<input type="submit" value="Finish Now" id="btnfinal" class="btn btn-danger"/>'); }
                    else { $('.final-action').empty().append('<input type="submit" value="Update transaction" id="btnUpdate" class="btn btn-primary"/>'); }

                    //if (diffrent.toFixed(2) == 0.00) { $('#btnfinal').show(); }
                    //else { $('#btnfinal').hide(); }
                });

                $.each(data['pod'], function (key, row) {
                    let itemHtml = '';
                    itemHtml = '<tr id="tritemid_' + row.rowid + '" class="paid_item" data-pid="' + row.rowid + '" data-supplier="' + row.label_complete + '" data-rowid="' + row.PO_SO_ref + '">';
                    itemHtml += '   <td><input type="checkbox" name="CheckSingle" id="CheckSingle" onclick="Singlecheck(this);" value="' + row.rowid + '" ' + (row.is_cleared ? 'checked' : '') + '></td>';
                    itemHtml += '   <td>' + row.doc_date + '</td>';
                    itemHtml += '   <td class="text-left">' + row.doc_type + '</td>';
                    itemHtml += '   <td>' + row.PO_SO_ref + '</td>';
                    itemHtml += '   <td>' + row.label_complete + '</td>';
                    itemHtml += '   <td>' + row.payee + '</td>';
                    itemHtml += '   <td>' + row.memo + '</td>';

                    itemHtml += '   <td class="text-right ship-amount">$' + row.credit.toFixed(2) + '</td>';
                    itemHtml += '   <td class="text-right row-total">$' + row.debit.toFixed(2) + '</td>';
                    if (row.statusmatch == 'Match') {
                        itemHtml += '   <td class="text-center"><span class="badge bg-success">' + row.statusmatch + '</span></td>';
                    }
                    else if (row.statusmatch == 'Not Found') {
                        itemHtml += '   <td class="text-center"><span class="badge bg-danger">' + row.statusmatch + '</span></td>';
                    }
                    else {
                        itemHtml += '   <td class="text-center"><span class="badge bg-warning">' + row.statusmatch + '</span></td>';
                    }

                    //itemHtml += '<td class="text-right price-remaining" data-tax1="' + data['pod'][i].remaining + '">$' + data['pod'][i].remaining.toFixed(2) + '</td>';
                    //itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + data['pod'][i].rowid + '" value="' + data['pod'][i].remaining.toFixed(2) + '" name="txt_itemprice" placeholder="Payment"></td>';
                    itemHtml += '</tr>';
                    $('#line_items').append(itemHtml);
                });
            }
            catch (error) { $("#loader").hide(); swal('Error', "something went wrong.", "error"); }
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); swal('Error', "something went wrong.", "error"); }, async: false
    });

    //$("#divAddItemFinal").find(".rowCalulate").change(function () { calculateFinal(); }); calculateFinal();
    // $('.footer-finalbutton').empty().append('<a title="Back to list" data-toggle="tooltip" data-placement="top"  class="btn btn-danger back_to_list" href="/PaymentInvoice/PayBillsMisc">Back to List</a><button type="button" title="Click for edit" data-toggle="tooltip" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
    // $(".top-action").empty().append('<button type="button" class="btn btn-danger btnEdit" data-toggle="tooltip" title="Edit"><i class="far fa-edit"></i> Edit</button>');
    // $(".top-action").empty().append('<button type="button" title="Click for edit" data-toggle="tooltip" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
    $('.billinfo').prop("disabled", true);
}

function CheckAll() {
    var isChecked = $('#checkall').prop("checked");
    $('#tblAddItemFinal tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
}
function Singlecheck(chk) {
    var isChecked = $(chk).prop("checked"), isHeaderChecked = $("#checkall").prop("checked");
    if (isChecked == false && isHeaderChecked) $("#checkall").prop('checked', isChecked);
    else {
        $('#tblAddItemFinal tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false) isChecked = false;
        });
        $("#checkall").prop('checked', isChecked);
    }
}

function reconciling() {
    let status = $("#hfstatus").val(), id = $("#hfqueryids").val(), hfendbail = $("#hfendbail").val(), stdate = $("#hfenddate").val(), accid = $("#hfaccid").val();
    // let id = parseInt($('#lblbillNo').data('id')) || 0; 

    //if (date == "") { swal('alert', 'Please enter create bill date ', 'error').then(function () { swal.close(); $('#txtcreateDate').focus(); }) }
    //else if (transactiontype == 0) { swal('alert', 'Please select transaction  type', 'error').then(function () { swal.close(); $('#ddltransactiontype').focus(); }) }
    //else if (Coustomertype == 0) { swal('alert', 'Please select coustomer type', 'error').then(function () { swal.close(); $('#ddlCoustomertype').focus(); }) }
    //else if (paymenttype == 0) { swal('alert', 'Please select bill type.', 'error').then(function () { swal.close(); $('#ddlPaymentType').focus(); }) }
    //else if (payaccounttype == 0) { swal('alert', 'Please select pay account.', 'error').then(function () { swal.close(); $('#ddlpayaccounttype').focus(); }) }
    //else if (duedate == "") { swal('alert', 'Please enter due date ', 'error').then(function () { swal.close(); $('#txtdueDate').focus(); }) }
    //else if (date >= duedate) { swal('alert', 'Please enter a due date greater than create date', 'error').then(function () { swal.close(); $('#txtdueDate').focus(); }) }
    //else if (_list.length == 0) { swal('Alert!', 'Please add product.', "error") }
    //else {
    //if (date_livraison.length > 0) date_livraison = date_livraison[2] + '/' + date_livraison[0] + '/' + date_livraison[1];
    let _reconciling = {
        rowid: id, bank_code: accid, bank_opening_balance: $('#lblBeginnigbal').text(), opening_date: stdate, bank_ending_balance: hfendbail, ending_date: $('#lbldateending').text()
    }
    let option = { strValue1: id, strValue2: JSON.stringify(_reconciling) }
    //console.log(option, _order, _list); return;
    swal.queue([{
        title: '', confirmButtonText: 'Yes, update it!', text: "Do you want final?",
        showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                $.post('/Accounting/Reconciliationprocess', option).done(function (result) {
                    result = JSON.parse(result);
                    if (result[0].Response == "success") {

                        swal('Success', 'Final reconcile has been taken successfully!!', 'success').then((result) => { location.href = 'BankReconciliation'; });

                        //swal('Success', 'Misc Bills saved successfully.', "success").then(function () { getInvoicePrintDetails(result[0].id); $('#line_items').empty(); calculateFinal(); $("#thQuantity").text('0'); $("#SubTotal").text('0.00'); $("#salesTaxTotal").text('0.00'); $("#shippingTotal").text('0.00'); $("#otherTotal").text('0.00'); $("#orderTotal").text('0.00'); $("#txtshippingfee").val('0'); $("#txtotherfee").val('0'); } );
                        // swal('Success', 'Misc Bills saved successfully.', "success").then(function () { getInvoicePrintDetails(result[0].id); });

                        //then(function () { window.location.href = window.location.origin + "/PurchaseOrder/NewPurchaseOrder/" + result[0].id; ActivityLog('create new purchase order for vendor id (' + vendorid + ')', '/PurchaseOrder/NewPurchaseOrder'); });
                    }
                    else { swal('Error', 'Something went wrong, please try again.', "error"); }
                }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
            });
        }
    }]);
    //}
}

function updatetransaction() {
    let _list = [];
    $('#line_items :checkbox').each(function () { _list.push({ id: parseInt($(this).val()) || 0, is_cleared: this.checked }); });
    let option = { strValue1: 'TC', strValue3: 0, strValue3: JSON.stringify(_list) }

    console.log(option); //return;

    swal.queue([{
        title: '', text: "Do you want update transaction status?", confirmButtonText: 'Yes, update it!',
        showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                $.post('/Accounting/BankReconciliationUpdate', option).done(function (result) {
                    result = JSON.parse(result);
                    if (result[0].response == "success") {
                        getbankreconcilationInfo();
                        swal('Success', 'Transaction status has been updated successfully!!', 'success');
                    }
                    else { swal('Error', 'Something went wrong, please try again.', "error"); }
                }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
            });
        }
    }]);
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
        let rPrice = 0.00, rQty = 0.00
        remaing = parseFloat($(row).find("[name=txt_itemprice]").val().trim()) || 0.00;
        payment = parseFloat($(row).find(".price-remaining").data('tax1')) || 0.00;
        //console.log(payment.toFixed(2), remaing.toFixed(2));
        if (remaing > payment) {
            swal('Alert!', "you can't receive greater payment form  remaining payment", "error");
            parseFloat($(row).find("[name=txt_itemprice]").val(0.00));
            $(row).find("[name=txt_itemprice]").focus();

        }
        //console.log(remaing);
        tGrossAmt += remaing;
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
    //console.log(_list);
    if (PaymentTypeid <= 0) { swal('Error', 'Please Select Payment Type', 'error').then(function () { swal.close(); $('#ddlPaymentType').focus(); }) }
    else if (accountid <= 0) { swal('Error', 'Please Select Account', 'error').then(function () { swal.close(); $('#ddlaccount').focus(); }) }
    else if (_list.length <= 0) { swal('Error', 'Receive payment should not be zero', 'error').then(function () { swal.close(); }) }
    else {
        let _order = {
            fk_payment: PaymentTypeid, fk_bank: accountid, num_payment: Numbertransfer, note: Transmitter, bankcheck: BankCheck, comments: Comments,
            amount: parseFloat($("#Total").text()), fk_status: 0
        }
        let option = { strValue1: 0, strValue2: JSON.stringify(_order), strValue3: JSON.stringify(_list) }
        //console.log(option);
        swal.queue([{
            title: 'Are you sure?', confirmButtonText: 'Yes', text: 'Would you like to pay for the $' + parseFloat($("#Total").text()) + ' amount?',
            showLoaderOnConfirm: true, showCancelButton: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    $.post('/PaymentInvoice/TakePaymentMisc', option).done(function (result) {
                        result = JSON.parse(result);
                        if (result[0].Response == "Success") {
                            swal('Success', 'Payment has been taken successfully!!', 'success').then((result) => { location.href = 'PayBillsMisc'; });
                        }
                        else { swal('Error', 'Something went wrong, please try again.', "error"); }
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
    $('#line_items > tr').each(function (index, row) {
        let payment = 0.00, remaing = 0.00, bailance = 0.00;
        payment = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        remaing = parseFloat($(row).find(".price-remaining").data('tax1')) || 0.00;
        bailance = remaing - payment;
        if (bailance > 0) {
            status = "UN";
        }
        if (payment != 0) {
            _list.push({ fk_payment: $(row).data('pid'), fk_invoice: $(row).data('rowid'), amount: payment, type: status, thirdparty_code: $(row).data('supplier') });
        }
    });
    return _list;
}

