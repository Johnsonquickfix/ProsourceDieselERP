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
})

$("#btnAdd").click(function () {
    let amount = $('.checked_amount').text().replace('$','');
    if (amount == 'Other') {
        amount = $('#txtAmount').val();
    }
    let giftTo = $('#txtGiftTo').val().trim();
    let giftFrom = $('#txtGiftFrom').val();
    let SenderName = $('#txtSenderName').val();
    let giftMessage = $('#txtGiftMessage').val();
    let giftdate = $('#gift_date').val();
    let recipient = [];
    recipient = giftTo.split(",");
    let qty = recipient.length;
  

    var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (amount == "") { swal('Alert', 'Please select amount', 'error'); }
    else if (giftTo == "") { swal('Alert', 'Please Enter email to', 'error').then(function () { swal.close(); $('#txtGiftTo').focus(); }); }
    else if (giftFrom == "") { swal('Alert', 'Please enter email from', 'error').then(function () { swal.close(); $('#txtGiftFrom').focus(); }); }
    else if (SenderName == "") { swal('Alert', 'Please enter Sender Name', 'error').then(function () { swal.close(); $('#txtSenderName').focus(); }); }
    else {
        var obj = {
           /* id: ID,*/
            amount: amount, recipient: recipient, sender_email: giftFrom, sender: SenderName, message: giftMessage, date: giftdate,
            qty: qty,
        }
       
        $.ajax({
            url: '/GiftCard/AddGiftCard/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                $("#hfid").val(data.id);
                if (data.status == true) {
                    swal('Alert!', data.message, 'success');
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })

    }
    
})