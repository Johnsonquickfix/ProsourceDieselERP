$(document).ready(function () {
    $("#loader").hide();
    $('#lbldateending').daterangepicker({ singleDatePicker: true, autoUpdateInput: true, minDate: '01/01/2022', locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' } },
        function (start, end, label) {
            $('#lbldateending').text(start.format('MM/DD/YYYY'));
            getbankreconcilationInfo();
        });
    $.when(LoadDataBind()).done(function () { getbankreconcilationInfo(); });

    /*filldropdown();*/
    $('.billinfo').prop("disabled", true);
    //isEdit(true);
    $(document).on("click", "#btnfinal", function (t) { t.preventDefault(); reconciling(); });
    $(document).on("click", "#btnUpdate", function (t) { t.preventDefault(); updatetransaction(); });
    $(document).on("change", "#txt_statementendingbal", function (t) {
        t.preventDefault();
        let _end_bal = parseFloat($('#txt_statementendingbal').val()) || 0.00, _clear_bal = parseFloat($('#lblclearedbal').data('amt')) || 0.00;
        let diffrent = _end_bal - _clear_bal;
        $('#lbldiffrence').text(diffrent.toFixed(2));
        if (diffrent == 0) { $('.final-action').empty().append('<input type="submit" value="Finish Now" id="btnfinal" class="btn btn-danger"/>'); }
        else { $('.final-action').empty().append('<input type="submit" value="Update transaction" id="btnUpdate" class="btn btn-primary"/>'); }

    });
})

function isEdit(val) { localStorage.setItem('isEdit', val ? 'yes' : 'no'); }

function LoadDataBind() {
    $('.page-heading').append('<a title="Back to list" data-toggle="tooltip" data-placement="top" class="btn btn-danger back_to_list" href="/Accounting/BankReconciliation">Back to List</a>');
    //$('.footer-finalbutton').empty().append('<a title="Back to list" data-toggle="tooltip" data-placement="top"  class="btn btn-danger back_to_list" href="/PaymentInvoice/PayBillsMisc">Back to List</a>');

    var urlParams = new URLSearchParams(window.location.search);
    $('#lblendingdata').text((urlParams.get('stdate') ? urlParams.get('stdate') : ''));
    $('#lbldateending').text((urlParams.get('edate') ? urlParams.get('edate') : ''));
    $('#lblendingdata').data('id', (urlParams.get('id') ? urlParams.get('id') : ''));
    $('#lblendingdata').data('sdate', (urlParams.get('stdate') ? urlParams.get('stdate') : ''));
    $('#lblendingdata').data('edate', (urlParams.get('edate') ? urlParams.get('edate') : ''));

    $('#lblaccountname').text((urlParams.get('accountname') ? urlParams.get('accountname') : ''));
    $('#lblaccountname').data('id', (urlParams.get('accountid') ? urlParams.get('accountid') : ''));

    $('#txt_statementendingbal').val(parseFloat(urlParams.get('endbailance')) || 0.00);
};
function getbankreconcilationInfo() {
    let stdate = $('#lblendingdata').data('sdate'), edate = $('#lbldateending').text(), id = parseInt($("#lblendingdata").data('id')) || 0, accid = parseInt($("#lblaccountname").data('id')) || 0;
    let endbail = parseFloat($("#txt_statementendingbal").val()) || 0.00;

    $('#line_items').empty();
    var option = { strValue1: stdate, strValue2: edate, strValue3: id, strValue4: accid };

    $('#lbldateending').data('daterangepicker').setStartDate(moment(edate, 'MM/DD/YYYY'));
    $('#lbldateending').data('daterangepicker').setEndDate(moment(edate, 'MM/DD/YYYY'));
    $('#lbldateending').data('daterangepicker').minDate = moment(stdate, 'MM/DD/YYYY');
    let itemHtml = '', _cleared = 0.00, _uncleared = 0.00;
    $.ajax({
        url: "/Accounting/GetBankReconciliationprocess", type: "Get", beforeSend: function () { $("#loader").show(); }, data: option,
        success: function (result) {
            try {
                let data = JSON.parse(result);
                let diffrent = 0;
                $.each(data['po'], function (key, row) {
                    let clerdamt = row.bank_ending_balance - row.credit + row.debit;
                    $('#lblBeginnigbal').text(CurrencyFormat(row.bank_ending_balance)); $('#lblBeginnigbal').data('bob', row.bank_ending_balance);
                    $('#lblpaymnet').text(CurrencyFormat(row.credit));
                    $('#lbldeposit').text(CurrencyFormat(row.debit));
                    //$('#lblclearedbal').text(clerdamt.toFixed(2)); $('#lblclearedbal').data('amt', clerdamt.toFixed(2));
                    diffrent = (endbail - clerdamt);
                    $('#lbldiffrence').text(CurrencyFormat(diffrent));
                    if (diffrent == 0) { $('.final-action').empty().append('<input type="submit" value="Finish Now" id="btnfinal" class="btn btn-danger"/>'); }
                    else { $('.final-action').empty().append('<input type="submit" value="Update transaction" id="btnUpdate" class="btn btn-primary"/>'); }
                });

                $.each(data['pod'], function (key, row) {
                    if (row.is_cleared) _cleared += (row.debit - row.credit);
                    else _uncleared += (row.debit - row.credit);
                    itemHtml = '<tr id="tritemid_' + row.rowid + '" class="paid_item" data-pid="' + row.rowid + '" data-supplier="' + row.label_complete + '" data-rowid="' + row.PO_SO_ref + '" data-credit="' + row.credit.toFixed(2) + '" data-debit="' + row.debit.toFixed(2) + '">';
                    itemHtml += '   <td><input type="checkbox" name="CheckSingle" id="CheckSingle" onclick="Singlecheck(this);" value="' + row.rowid + '" ' + (row.is_cleared ? 'checked' : '') + '></td>';
                    itemHtml += '   <td>' + row.doc_date + '</td>';
                    itemHtml += '   <td class="text-left">' + row.doc_type + '</td>';
                    itemHtml += '   <td>' + row.PO_SO_ref + '</td>';
                    itemHtml += '   <td>' + row.label_complete + '</td>';
                    itemHtml += '   <td>' + row.payee + '</td>';
                    itemHtml += '   <td>' + row.memo + '</td>';
                    itemHtml += '   <td class="text-right ship-amount">$' + row.credit.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") + '</td>';
                    itemHtml += '   <td class="text-right row-total">$' + row.debit.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") + '</td>';
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
        complete: function () {
            $("#loader").hide();
            $('#lblcleared').text(CurrencyFormat(_cleared)); $('#lbluncleared').text(CurrencyFormat(_uncleared));
            $('#lblclearedbal').text(CurrencyFormat(_cleared + _uncleared)); $('#lblclearedbal').data('amt', (_cleared + _uncleared).toFixed(2));
        },
        error: function (xhr, status, err) { $("#loader").hide(); swal('Error', "something went wrong.", "error"); }, //async: false
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
    calculatetotal();
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
    calculatetotal();
}
function calculatetotal() {
    let _cleared = 0.00, _uncleared = 0.00;
    $('#line_items :checkbox').each(function (e, r) {
        let _debit = parseFloat($(this).closest('tr').data('debit')) || 0.00, _credit = parseFloat($(this).closest('tr').data('credit')) || 0.00;
        if (r.checked) _cleared += (_debit - _credit);
        else _uncleared += (_debit - _credit);
        $('#lblcleared').text(CurrencyFormat(_cleared)); $('#lbluncleared').text(CurrencyFormat(_uncleared));
        $('#lblclearedbal').text(CurrencyFormat(_cleared + _uncleared)); $('#lblclearedbal').data('amt', (_cleared + _uncleared).toFixed(2));
    });
}

function reconciling() {
    let stdate = $('#lblendingdata').data('sdate'), edate = $('#lbldateending').text(), id = parseInt($("#lblendingdata").data('id')) || 0, accid = parseInt($("#lblaccountname").data('id')) || 0;
    let _ob = parseFloat($('#lblBeginnigbal').data('bob')) || 0.00, _eb = parseFloat($('#txt_statementendingbal').val()) || 0.00;

    let _list = [];
    $('#line_items :checkbox').each(function () { _list.push({ id: parseInt($(this).val()) || 0, is_cleared: this.checked }); });
    //rowid: id,
    let _reconciling = {
        rowid: 0, bank_code: accid, bank_opening_balance: _ob, opening_date: stdate, bank_ending_balance: _eb, ending_date: edate, trans: _list
    }
    let option = { strValue1: 'BR', strValue2: id, strValue3: JSON.stringify(_reconciling) }
    //console.log(option, _list); return;
    swal.queue([{
        title: '', confirmButtonText: 'Yes, update it!', text: "Do you want final?", showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                $.post('/Accounting/BankReconciliationUpdate', option).done(function (result) {
                    result = JSON.parse(result); 
                    if (result[0].response == "success") {
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
}

function updatetransaction() {
    let _list = [];
    $('#line_items :checkbox').each(function () { _list.push({ id: parseInt($(this).val()) || 0, is_cleared: this.checked }); });
    let option = { strValue1: 'TC', strValue2: 0, strValue3: JSON.stringify(_list) }

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
