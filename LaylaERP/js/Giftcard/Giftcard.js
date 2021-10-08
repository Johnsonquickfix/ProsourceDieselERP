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
    console.log($('.checked_amount').val());
})