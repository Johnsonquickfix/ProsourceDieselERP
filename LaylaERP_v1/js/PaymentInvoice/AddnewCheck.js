$(document).ready(function () {
    $('.page-heading').text('New Check Deposit (To Bank)').append('<a title="Back to list" data-toggle="tooltip" data-placement="right"  class="btn btn-danger back_to_list" href="/CheckDeposit/CheckDepositList">Back to List</a>');
    $('.footer-finalbutton').empty().append(' <button type="button" title="Click for send to bank" data-toggle="tooltip" class="btn btn-danger" id="btnSave"><i class="far fa-save"></i> Send to Bank</button>');
    filldropdown();
    filltype();
   // $('.billinfo').prop("disabled", true);
    //isEdit(true);
})

//function isEdit(val) {
//    localStorage.setItem('isEdit', val ? 'yes' : 'no');
//}
function filldropdown() {
    $.ajax({
        url: "/PaymentInvoice/GetPaymentType",
        type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            //Product 
            $("#ddlaccount").html('<option value="0">Select Payment Type</option>');
            for (i = 0; i < dt['Table1'].length; i++) { $("#ddlaccount").append('<option value="' + dt['Table1'][i].id + '">' + dt['Table1'][i].text + '</option>'); }

        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }
    });


}
function filltype() {
    $.ajax({
        url: "/PaymentInvoice/GetTypePayment",
        type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            //Product 
            $("#ddltypepayment").html('<option value="0">Select Account</option>');
            for (i = 0; i < dt['Table1'].length; i++) { $("#ddltypepayment").append('<option value="' + dt['Table1'][i].id + '">' + dt['Table1'][i].text + '</option>'); }

        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }
    });


}
 

$(document).on("click", "#btnSave", function (t) { t.preventDefault(); newcheckdeposit(); });
//$(document).on("click", "#btnSave", function (t) { t.preventDefault();  });

function newcheckdeposit() {
    // let id = parseInt($('#lblPoNo').data('id')) || 0;
    let payment = 0.00
    payment = $("#txtChkAmount").val() || 0.00;
    let PaymentTypeid = parseInt($("#ddlPaymentType").val()) || 0;
    let accountid = parseInt($("#ddlaccount").val()) || 0;
    let Numbertransfer = $("#txtNumbertransfer").val();
    let Transmitter = $("#txtTransmitter").val();
    let BankCheck = $("#txtBankCheck").val();
    let Comments = $("#txtComments").val();
    let paidtoname = $("#txtpaidtoname").val();
    let typepaymentacc = parseInt($("#ddltypepayment").val()) || 0;
    let _list = createItemsList();
    let status = $("#hfstatus").val();
    //console.log(_list);
    if (PaymentTypeid <= 0) { swal('Error', 'Please select transaction type', 'error').then(function () { swal.close(); $('#ddlPaymentType').focus(); }) }
    else if (Numbertransfer == "") { swal('Error', 'Please enter number Check/Transaction number', 'error').then(function () { swal.close(); $('#txtNumbertransfer').focus(); }) }
    else if (paidtoname == "") { swal('Error', 'Please enter paid to name ', 'error').then(function () { swal.close(); $('#txtpaidtoname').focus(); }) }
    else if (typepaymentacc <= 0) { swal('Error', 'Please select payment type', 'error').then(function () { swal.close(); $('#ddltypepayment').focus(); }) }
    else if (accountid <= 0) { swal('Error', 'Please select account', 'error').then(function () { swal.close(); $('#ddlaccount').focus(); }) }    
    else if (payment <= 00) { swal('Error', 'Please enter amount ', 'error').then(function () { swal.close(); $('#txtChkAmount').focus(); }) }   
    else if (_list.length <= 0) { swal('Error', 'Receive payment should not be zero', 'error').then(function () { swal.close(); }) }
    else {
        let _order = {
            fk_payment: PaymentTypeid, fk_bank: accountid, num_payment: Numbertransfer, note: Transmitter, bankcheck: BankCheck, comments: Comments,
            amount: parseFloat(payment), fk_status: 0, accountancy_code: typepaymentacc, note: paidtoname
        }
        let option = { strValue1: 0, strValue2: JSON.stringify(_order), strValue3: JSON.stringify(_list) }
        //console.log(option);
        swal.queue([{
            title: 'Are you sure?', confirmButtonText: 'Yes', text: 'Would you like to pay for the $' + parseFloat($("#txtChkAmount").val()) + ' amount?',
            showLoaderOnConfirm: true, showCancelButton: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    $.post('/PaymentInvoice/Newcheckdeposit', option).done(function (result) {
                        result = JSON.parse(result);
                        if (result[0].Response == "Success") {                            
                            swal('Success', 'Check deposit successfully!!', 'success').then((result) => { location.href = 'CheckDepositList'; });  
                            //swal('Success', 'Check deposit successfully!!', 'success') ;
                        }
                        else { swal('Error', 'Something went wrong, please try again.', "error"); }
                    }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
                });
            }
        }]);
    }

    //isEdit(false);
}

function createItemsList() {
    let _list = [];   
        let payment = 0.00  
        payment = $("#txtChkAmount").val() || 0.00;
        if (payment != 0) {
            _list.push({ fk_payment: 0, fk_invoice: 0 , amount: payment, type: 'CD', thirdparty_code: '' });
        }
   
    return _list;
}