
$(document).ready(function () { 
    GetAccount();
    $('#ddlAccount').change(function () {
        gettotal();
    });

    $(document).on("click", "#btntransfer", function (t) { t.preventDefault(); NewBankEntry(); });

})
function GetAccount() {
    $.get('GetAccount', function (data) {
        var items = "";
        $('#ddlAccount').empty();
        items += $("<option value=''>Please select</option>").appendTo("#ddlAccount");
        $.each(data, function (index, value) {
            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlAccount");
        })
        $('#ddlAccount').bind(items);
    })
};

function gettotal() { 
    var ID = $('#ddlAccount').val();
    var obj = { strVal: ID }
    $.ajax({
        url: '/Accounting/GetTotalAmountByID/' + ID,
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var i = JSON.parse(data);
            console.log(i[0].total);
            $("#txttotalamt").val(i[0].total);
        },
        error: function (msg) { alert(msg); }
    });
}
function NewBankEntry() {
    let totalamt = $("#txttotalamt").val() || 0;
    let bankfee = $("#txtbankfee").val() || 0;
    let Account = parseInt($("#ddlAccount").val()) || 0;
    let merchantfee = $("#txtmerchantfee").val() || 0;
    let transferAccount = parseInt($("#ddltransferAccount").val()) || 0;     
    if (totalamt <= 0) { swal('alert', 'Please enter total amount', 'error').then(function () { swal.close(); $('#txttotalamt').focus(); }) }
    else if (bankfee <= 0) { swal('alert', 'Please enter bank transfer fee', 'error').then(function () { swal.close(); $('#txtbankfee').focus(); }) }
    else if (Account <= 0) { swal('alert', 'Please select account.', 'error').then(function () { swal.close(); $('#ddlAccount').focus(); }) }
    else if (merchantfee < 0) { swal('alert', 'Please enter merchant fee', 'error').then(function () { swal.close(); $('#txtmerchantfee').focus(); }) }
    else {
        let option = { strValue1: Account, strValue2: transferAccount, strValue3: '0', strValue4: totalamt, strValue5: bankfee, strValue6: merchantfee}
        //console.log(option, _order, _list); return;
        swal.queue([{
            title: '', confirmButtonText: 'Yes, update it!', text: "Do you want to funds deposited from merchant to bank?",
            showLoaderOnConfirm: true, showCancelButton: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    $.post('/Accounting/NewBankEntry', option).done(function (result) {
                        result = JSON.parse(result);
                        if (result[0].Response == "Success") {                       
                            swal('Success', 'Funds deposited from merchant to bank successfully.', "success").then(function () { $("#txttotalamt").val(''); $("#txtbankfee").val(''); $("#txtmerchantfee").val(''); $("#ddlAccount").val('') } );
                        }
                        else { swal('Error', 'Something went wrong, please try again.', "error"); }
                    }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
                });
            }
        }]);
    }
}
