$(document).ready(function () {
    $("#loader").hide();
    jQuery(function ($) {
        $('.main_radio_div a').click(function () {
            $(this).addClass('checked_amount').siblings().removeClass('checked_amount');
            if ($(this).hasClass('other')) {
                $('.customprice_div').toggleClass('open_custom')
            }
        });
        $('#gift_date').datepicker();
    });
    var date = new Date();
    date.setDate(date.getDate());
    $('#gift_date').datepicker({
        startDate: date
    });
})

$(".radio_amt").click(function () {
    let amount = $(this).text().replace('$', '');
    let amo = $('#hfAmount').val(amount);
})

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ validate Gift Card ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function validateForm() {
    let amount = $('.checked_amount').text().replace('$', '');
    if (amount == 'Other') {
        amount = $('#txtAmount').val();
    }
    let giftTo = $('#txtGiftTo').val().trim();
    let giftFrom = $('#txtGiftFrom').val();
    let giftMessage = $('#txtGiftMessage').val();
    let giftdate = $('#gift_date').val();
    let recipient = [];
    recipient = giftTo.split(",");
    let qty = recipient.length;

    var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (amount == "") {
        swal('Alert', 'Please select amount', 'error'); return false;
    }
    else if (giftTo == "") { swal('Alert', 'Please Enter email to', 'error').then(function () { swal.close(); $('#txtGiftTo').focus(); }); return false; }
    //else if (!pattern.test(giftTo)) { swal('Alert', 'Please Enter valid email', 'error').then(function () { swal.close(); $('#txtGiftTo').focus(); }); return false; }
    else if (giftFrom == "") { swal('Alert', 'Please enter email from', 'error').then(function () { swal.close(); $('#txtGiftFrom').focus(); }); return false; }
    else if (!pattern.test(giftFrom)) { swal('Alert', 'Please enter valid email ', 'error').then(function () { swal.close(); $('#txtGiftFrom').focus(); }); return false; }
    else { }
}

