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
$("#btnPlaceOrder").click(function () {
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
    else if (Phone == "" || Phone=="() -") { swal('Alert', 'Please enter phone Number', 'error').then(function () { swal.close(); $('#txtPhone').focus(); }); }
    else if (Address1 == "") { swal('Alert', 'Please enter Address1', 'error').then(function () { swal.close(); $('#txtAddress1').focus(); }); }
    else if (City == "") { swal('Alert', 'Please enter City', 'error').then(function () { swal.close(); $('#txtCity').focus(); }); }
    else if (State == "") { swal('Alert', 'Please enter State', 'error').then(function () { swal.close(); $('#txtState').focus(); }); }
    else if (PostCode == "") { swal('Alert', 'Please enter Zip Code', 'error').then(function () { swal.close(); $('#txtState').focus(); }); }
    else if (Country == "") { swal('Alert', 'Please select Country', 'error').then(function () { swal.close(); $('#ddlCountry').focus(); }); }
    else {
        let oid = 0, postMetaxml = [];
        postMetaxml.push(
            { post_id: oid, meta_key: '_order_key', meta_value: 'wc_order_' }, { post_id: oid, meta_key: '_customer_user', meta_value: cus_id },
            { post_id: oid, meta_key: '_payment_method', meta_value: '' }, { post_id: oid, meta_key: '_payment_method_title', meta_value: '' },
            { post_id: oid, meta_key: '_customer_ip_address', meta_value: '::1' }, { post_id: oid, meta_key: '_customer_user_agent', meta_value: '0' },
            { post_id: oid, meta_key: '_created_via', meta_value: 'checkout' }, { post_id: oid, meta_key: '_cart_hash', meta_value: '0' },
            { post_id: oid, meta_key: '_billing_company', meta_value: '' }, { post_id: oid, meta_key: '_shipping_company', meta_value: '' },
            { post_id: oid, meta_key: '_billing_first_name', meta_value: '' }, { post_id: oid, meta_key: '_billing_last_name', meta_value: '' },
            { post_id: oid, meta_key: '_billing_address_1', meta_value: '' }, { post_id: oid, meta_key: '_billing_address_2', meta_value: '' },
            { post_id: oid, meta_key: '_billing_city', meta_value: '' }, { post_id: oid, meta_key: '_billing_state', meta_value: '' },
            { post_id: oid, meta_key: '_billing_postcode', meta_value: '' }, { post_id: oid, meta_key: '_billing_country', meta_value: '' },
            { post_id: oid, meta_key: '_billing_email', meta_value: '' }, { post_id: oid, meta_key: '_billing_phone', meta_value: '' },
            { post_id: oid, meta_key: '_order_version', meta_value: '4.8.0' }, { post_id: oid, meta_key: '_prices_include_tax', meta_value: 'no' },
            { post_id: oid, meta_key: '_shipping_address_index', meta_value: '' }, { post_id: oid, meta_key: 'is_vat_exempt', meta_value: 'no' },
            { post_id: oid, meta_key: '_download_permissions_granted', meta_value: 'yes' }, { post_id: oid, meta_key: '_recorded_sales', meta_value: 'yes' },
            { post_id: oid, meta_key: '_recorded_coupon_usage_counts', meta_value: 'yes' }, { post_id: oid, meta_key: '_order_stock_reduced', meta_value: 'yes' },
            { post_id: oid, meta_key: '_edit_lock', meta_value: '1' }, { post_id: oid, meta_key: '_shipping_first_name', meta_value: '' },
            { post_id: oid, meta_key: '_shipping_last_name', meta_value: '' }, { post_id: oid, meta_key: '_shipping_address_1', meta_value: '' },
            { post_id: oid, meta_key: '_shipping_address_2', meta_value: '' }, { post_id: oid, meta_key: '_shipping_city', meta_value: '' },
            { post_id: oid, meta_key: '_shipping_state', meta_value: '' }, { post_id: oid, meta_key: '_shipping_postcode', meta_value: '' },
            { post_id: oid, meta_key: '_shipping_country', meta_value: '' }, { post_id: oid, meta_key: '_shipping_email', meta_value: '' },
            { post_id: oid, meta_key: '_shipping_phone', meta_value: '' }, { post_id: oid, meta_key: '_order_currency', meta_value: 'USD' },
            { post_id: oid, meta_key: '_order_total', meta_value: 0.00 }, { post_id: oid, meta_key: '_cart_discount', meta_value: 0.00 },
            { post_id: oid, meta_key: '_cart_discount_tax', meta_value: '0' }, { post_id: oid, meta_key: '_order_shipping', meta_value: 0.00 },
            { post_id: oid, meta_key: '_order_shipping_tax', meta_value: 0.00 }, { post_id: oid, meta_key: '_order_tax', meta_value: 0.00 },
            //{ post_id: oid, meta_key: 'employee_id', meta_value: '0' }, { post_id: oid, meta_key: 'employee_name', meta_value: '' }
        );
        let option = { OrderPostMeta: postMetaxml };

        ajaxFunc('/GiftCard/GetNewOrderNo', option, beforeSendFun, function (result) { $('#hfOrderNo').val(result.message); $('#lblOrderNo').text('Order #' + result.message + ' detail '); }, completeFun, errorFun);

    }
})


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
        swal('Alert', 'Please select amount', 'error');  return false; }
    else if (giftTo == "") { swal('Alert', 'Please Enter email to', 'error').then(function () { swal.close(); $('#txtGiftTo').focus(); }); return false;}
    else if (giftFrom == "") { swal('Alert', 'Please enter email from', 'error').then(function () { swal.close(); $('#txtGiftFrom').focus(); }); return false; }
    else { }
}


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

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Common ajax function ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var ajaxFunc = function (url, data, beforeSendFun, successFun, completeFun, errorFun) {
    $.ajax({
        type: "POST", url: url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(data),
        beforeSend: beforeSendFun, success: successFun, complete: completeFun, error: errorFun, async: false
    });
}
function beforeSendFun() { $("#loader").show(); }
function completeFun() { $("#loader").hide(); }
function errorFun(XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); }

function NewOrderNo() {

   }