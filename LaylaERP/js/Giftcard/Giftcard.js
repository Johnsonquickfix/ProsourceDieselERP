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

$(".radio_amt").click(function () {
    let amount = $(this).text().replace('$', '');
    let amo = $('#hfAmount').val(amount);
})
$("#btnCheckout").click(function () {
    let SenderEmail = $('#txtSenderEmail').val().trim();
    let FirstName = $('#txtFirstName').val();
    let LastName = $('#txtLastName').val();
    let Phone = $('#txtPhone').val();
    let Company = $('#txtCompany').val();
    let Address1 = $('#txtAddress1').val();
    let Address2 = $('#txtAddress2').val();
    let City = $('#txtCity').val();
    let State = $('#ddlState').val();
    let PostCode = $('#txtPostCode').val();
    let Country = $('#ddlCountry').val();
    let OrderNotes = $('#txtOrderNotes').val();
    var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (SenderEmail == "") { swal('Alert', 'Please enter e-mail', 'error'); }
    else if (FirstName == "") { swal('Alert', 'Please Enter First Name', 'error').then(function () { swal.close(); $('#txtFirstName').focus(); }); }
    else if (LastName == "") { swal('Alert', 'Please enter Last Name', 'error').then(function () { swal.close(); $('#txtLastName').focus(); }); }
    else if (Phone == "") { swal('Alert', 'Please enter phone Number', 'error').then(function () { swal.close(); $('#txtPhone').focus(); }); }
    else if (Address1 == "") { swal('Alert', 'Please enter Address1', 'error').then(function () { swal.close(); $('#txtAddress1').focus(); }); }
    else if (City == "") { swal('Alert', 'Please enter City', 'error').then(function () { swal.close(); $('#txtCity').focus(); }); }
    else if (State == "") { swal('Alert', 'Please enter State', 'error').then(function () { swal.close(); $('#txtState').focus(); }); }
    else if (PostCode == "") { swal('Alert', 'Please enter Zip Code', 'error').then(function () { swal.close(); $('#txtState').focus(); }); }
    else if (Country == "") { swal('Alert', 'Please select Country', 'error').then(function () { swal.close(); $('#ddlCountry').focus(); }); }
    else {
        console.log('done');
    }
})


//$("#btnAdd").click(function () {
//    let amount = $('.checked_amount').text().replace('$','');
//    if (amount == 'Other') {
//        amount = $('#txtAmount').val();
//    }
//    let giftTo = $('#txtGiftTo').val().trim();
//    let giftFrom = $('#txtGiftFrom').val();
//    let SenderName = $('#txtSenderName').val();
//    let giftMessage = $('#txtGiftMessage').val();
//    let giftdate = $('#gift_date').val();
//    let recipient = [];
//    recipient = giftTo.split(",");
//    let qty = recipient.length;

//    var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
//    if (amount == "") { swal('Alert', 'Please select amount', 'error'); }
//    else if (giftTo == "") { swal('Alert', 'Please Enter email to', 'error').then(function () { swal.close(); $('#txtGiftTo').focus(); }); }
//    else if (giftFrom == "") { swal('Alert', 'Please enter email from', 'error').then(function () { swal.close(); $('#txtGiftFrom').focus(); }); }
//    else if (SenderName == "") { swal('Alert', 'Please enter Sender Name', 'error').then(function () { swal.close(); $('#txtSenderName').focus(); }); }
//    else {
//        var obj = {
//           /* id: ID,*/
//            amount: amount, recipient: recipient, sender_email: giftFrom, sender: SenderName, message: giftMessage, date: giftdate,
//            qty: qty,
//        }
       
//        $.ajax({
//            url: '/GiftCard/AddGiftCard/', dataType: 'json', type: 'Post',
//            contentType: "application/json; charset=utf-8",
//            data: JSON.stringify(obj),
//            dataType: "json",
//            beforeSend: function () { $("#loader").show(); },
//            success: function (data) {
//                $("#hfid").val(data.id);
//                if (data.status == true) {
//                    window.location.href = '../../Giftcard/ordermeta/'
//                }
//                else {
//                    swal('Alert!', data.message, 'error');
//                }
//            },
//            complete: function () { $("#loader").hide(); },
//            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
//        })

//    }
    
//}) 


///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Search Google Place API ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var autocompleteOptions = { componentRestrictions: { country: ["us", "ca"] }, fields: ["address_components", "geometry"], types: ["address"] };
function setupAutocomplete(inputs) {
    autocomplete = new google.maps.places.Autocomplete(inputs, autocompleteOptions);
    autocomplete.addListener("place_changed", fillInAddress);
    function fillInAddress() {
        let place = autocomplete.getPlace();
        let address = '';
        let cAdd1 = '', cZipCode = '', cCity = '', cCountry = '', cState = '';

        
        cAdd1 = 'txtAddress1', cZipCode = 'txtPostCode', cCity = 'txtCity', cCountry = 'ddlCountry', cState = 'ddlState';
       
        let obj = place.address_components.filter(element => element.types[0] == 'street_number');
        if (obj.length > 0)
            address = obj[0].long_name;
        obj = place.address_components.filter(element => element.types[0] == 'route');
        if (obj.length > 0)
            address = address + ' ' + obj[0].long_name;
        $("#" + cAdd1).val(address);
        obj = place.address_components.filter(element => element.types[0] == 'postal_code');
        if (obj.length > 0)
            $("#" + cZipCode).val(obj[0].long_name);
        else
            $("#" + cZipCode).val('');
        obj = place.address_components.filter(element => element.types[0] == 'locality');
        if (obj.length > 0)
            $("#" + cCity).val(obj[0].long_name);
        else
            $("#" + cCity).val('');
        obj = place.address_components.filter(element => element.types[0] == 'country');
        if (obj.length > 0)
            $("#" + cCountry).val(obj[0].short_name).trigger('change');
        else
            $("#" + cCountry).val('US').trigger('change');
        obj = place.address_components.filter(element => element.types[0] == 'administrative_area_level_1');
        if (obj.length > 0)
            $("#" + cState).empty().append('<option value="' + obj[0].short_name + '" selected>' + obj[0].long_name + '</option>');
        //$("#" + cState).val(obj[0].short_name).trigger('change');//.append('<option value="' + obj[0].short_name + '" selected>' + obj[0].long_name + '</option>');
        else
            $("#" + cState).val('').trigger('change');;
    }
}
function initMap() {
    var inputs = document.getElementById("txtAddress1");
    setupAutocomplete(inputs);
}