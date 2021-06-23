var wc_users_params = [{ "name": "United States", "abbreviation": "US", "states": [{ "name": "Alabama", "abbreviation": "AL" }, { "name": "Alaska", "abbreviation": "AK" }, { "name": "American Samoa", "abbreviation": "AS" }, { "name": "Arizona", "abbreviation": "AZ" }, { "name": "Arkansas", "abbreviation": "AR" }, { "name": "California", "abbreviation": "CA" }, { "name": "Colorado", "abbreviation": "CO" }, { "name": "Connecticut", "abbreviation": "CT" }, { "name": "Delaware", "abbreviation": "DE" }, { "name": "District Of Columbia", "abbreviation": "DC" }, { "name": "Federated States Of Micronesia", "abbreviation": "FM" }, { "name": "Florida", "abbreviation": "FL" }, { "name": "Georgia", "abbreviation": "GA" }, { "name": "Guam", "abbreviation": "GU" }, { "name": "Hawaii", "abbreviation": "HI" }, { "name": "Idaho", "abbreviation": "ID" }, { "name": "Illinois", "abbreviation": "IL" }, { "name": "Indiana", "abbreviation": "IN" }, { "name": "Iowa", "abbreviation": "IA" }, { "name": "Kansas", "abbreviation": "KS" }, { "name": "Kentucky", "abbreviation": "KY" }, { "name": "Louisiana", "abbreviation": "LA" }, { "name": "Maine", "abbreviation": "ME" }, { "name": "Marshall Islands", "abbreviation": "MH" }, { "name": "Maryland", "abbreviation": "MD" }, { "name": "Massachusetts", "abbreviation": "MA" }, { "name": "Michigan", "abbreviation": "MI" }, { "name": "Minnesota", "abbreviation": "MN" }, { "name": "Mississippi", "abbreviation": "MS" }, { "name": "Missouri", "abbreviation": "MO" }, { "name": "Montana", "abbreviation": "MT" }, { "name": "Nebraska", "abbreviation": "NE" }, { "name": "Nevada", "abbreviation": "NV" }, { "name": "New Hampshire", "abbreviation": "NH" }, { "name": "New Jersey", "abbreviation": "NJ" }, { "name": "New Mexico", "abbreviation": "NM" }, { "name": "New York", "abbreviation": "NY" }, { "name": "North Carolina", "abbreviation": "NC" }, { "name": "North Dakota", "abbreviation": "ND" }, { "name": "Northern Mariana Islands", "abbreviation": "MP" }, { "name": "Ohio", "abbreviation": "OH" }, { "name": "Oklahoma", "abbreviation": "OK" }, { "name": "Oregon", "abbreviation": "OR" }, { "name": "Palau", "abbreviation": "PW" }, { "name": "Pennsylvania", "abbreviation": "PA" }, { "name": "Puerto Rico", "abbreviation": "PR" }, { "name": "Rhode Island", "abbreviation": "RI" }, { "name": "South Carolina", "abbreviation": "SC" }, { "name": "South Dakota", "abbreviation": "SD" }, { "name": "Tennessee", "abbreviation": "TN" }, { "name": "Texas", "abbreviation": "TX" }, { "name": "Utah", "abbreviation": "UT" }, { "name": "Vermont", "abbreviation": "VT" }, { "name": "Virgin Islands", "abbreviation": "VI" }, { "name": "Virginia", "abbreviation": "VA" }, { "name": "Washington", "abbreviation": "WA" }, { "name": "West Virginia", "abbreviation": "WV" }, { "name": "Wisconsin", "abbreviation": "WI" }, { "name": "Wyoming", "abbreviation": "WY" }] }, { "name": "Canada", "abbreviation": "CA", "states": [{ "name": "Alberta", "abbreviation": "AB" }, { "name": "British Columbia", "abbreviation": "BC" }, { "name": "Manitoba", "abbreviation": "MB" }, { "name": "New Brunswick", "abbreviation": "NB" }, { "name": "Newfoundland and Labrador", "abbreviation": "NL" }, { "name": "Northwest Territories", "abbreviation": "NT" }, { "name": "Nova Scotia", "abbreviation": "NS" }, { "name": "Nunavut", "abbreviation": "NU" }, { "name": "Ontario", "abbreviation": "ON" }, { "name": "Prince Edward Island", "abbreviation": "PE" }, { "name": "Quebec", "abbreviation": "QC" }, { "name": "Saskatchewan", "abbreviation": "SK" }, { "name": "Yukon Territory", "abbreviation": "YT" }] }]

$(document).ready(function () {
    setTimeout(function () { getOrderInfo(); }, 50);
    $('.billinfo').prop("disabled", true);
    $('#txtLogDate').daterangepicker({ singleDatePicker: true, autoUpdateInput: true, locale: { format: 'DD/MM/YYYY', cancelLabel: 'Clear' } });
    $(".select2").select2(); BindStateCounty("ddlbillstate", { id: 'US' }); BindStateCounty("ddlshipstate", { id: 'US' });
    $("#ddlUser").select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Search Customer",
        ajax: {
            url: '/Orders/GetCustomerList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.displayname, name: item.displayname, id: item.id } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
    $("#ddlUser").change(function () { setTimeout(function () { NewOrderNo(); }, 50); CustomerAddress(); return false; });
    $("#ddlbillcountry").change(function () { var obj = { id: $("#ddlbillcountry").val() }; BindStateCounty("ddlbillstate", obj); });
    $("#ddlshipcountry").change(function () { var obj = { id: $("#ddlshipcountry").val() }; BindStateCounty("ddlshipstate", obj); });
    $('#ddlProduct').select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Search Product",
        ajax: {
            url: '/Orders/GetProductList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.post_title, name: item.post_title, id: item.r_id } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
    $("#ddlProduct").change(function () { if ($('#ddlProduct').val() == null) return false; getItemList(); $('#ddlProduct').val('').trigger('change'); });
    $(document).on("click", "#btnApplyCoupon", function (t) { t.preventDefault(); CouponModal(); });
    //$("#billModal").on("keypress", function (e) { if (e.which == 13 && e.target.type != "textarea") { $("#btnCouponAdd").click(); } });
    $("#billModal").on("click", "#btnCouponAdd", function (t) { t.preventDefault(); ApplyCoupon(); });
    $(document).on("blur", "#txtshipzipcode", function (t) { t.preventDefault(); GetCityByZip($(this).val()); });
    $(document).on("click", "#btnCheckout", function (t) { t.preventDefault(); saveCO(); });
    $(document).on("click", "#btnpay", function (t) { t.preventDefault(); PaymentModal(); });
    $("#billModal").on("click", "#btnPlaceOrder", function (t) { t.preventDefault(); AcceptPayment(); });
    $("#billModal").on("change", "#ddlPaymentMethod", function (t) {
        t.preventDefault(); if ($("#ddlPaymentMethod").val() == "paypal") { $("#txtPPEmail").removeClass('hidden'); $("#txtPPEmail").focus(); $("#txtPPEmail").val($("#txtbillemail").val()); }
        else if ($("#ddlPaymentMethod").val() == "podium") { $("#txtPPEmail").addClass('hidden'); }
        else { $("#txtPPEmail").addClass('hidden'); }
    });
    $("#billModal").on("click", "#btnNewOrder", function (t) { t.preventDefault(); window.location.href = window.location.href; });
});
///Bind States of Country
function BindStateCounty(ctr, obj) {
    var res = wc_users_params.filter(element => element.abbreviation == obj.id);
    $("#" + ctr + "").html('<option value="0">Select</option>');
    for (i = 0; i < res[0].states.length; i++) {
        $("#" + ctr + "").append('<option value="' + res[0].states[i].abbreviation + '">' + res[0].states[i].name + '</option>');
    }
}

///Get New Order No
function NewOrderNo() {
    var opt = { strValue1: '' };
    $.ajax({
        type: "POST", url: '/Orders/GetNewOrderNo', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
        success: function (result) {
            $('#hfOrderNo').val(result.message); $('#lblOrderNo').text('Order #' + result.message + ' detail ');
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });
}
///Find Address of Customer
function CustomerAddress() {
    var opt = { strValue1: parseInt($("#ddlUser").val()) || 0 };
    if (opt.strValue1 > 0) {
        $.ajax({
            type: "POST", url: '/Orders/GetCustomerAddress', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
            success: function (result) {
                var data = JSON.parse(result);
                for (var i = 0; i < data.length; i++) {
                    ///billing_Details
                    if (data[i].meta_key == 'billing_first_name') { $('#txtbillfirstname').val(data[i].meta_value); }
                    else if (data[i].meta_key == 'billing_last_name') { $('#txtbilllastname').val(data[i].meta_value); }
                    else if (data[i].meta_key == 'billing_company_name') { $('#txtbillcompany').val(data[i].meta_value); }
                    else if (data[i].meta_key == 'billing_address_1') { $('#txtbilladdress1').val(data[i].meta_value); }
                    else if (data[i].meta_key == 'billing_address_2') { $('#txtbilladdress2').val(data[i].meta_value); }
                    else if (data[i].meta_key == 'billing_postcode') { $('#txtbillzipcode').val(data[i].meta_value); }
                    else if (data[i].meta_key == 'billing_city') { $('#txtbillcity').val(data[i].meta_value); }
                    else if (data[i].meta_key == 'billing_country') { $('#ddlbillcountry').val(data[i].meta_value.trim()).trigger('change'); }
                    else if (data[i].meta_key == 'billing_state') { $('#ddlbillstate').val(data[i].meta_value).trigger('change'); }
                    else if (data[i].meta_key == 'billing_email') { $('#txtbillemail').val(data[i].meta_value); }
                    else if (data[i].meta_key == 'billing_phone') { $('#txtbillphone').val(data[i].meta_value); }
                    ///shipping_Details
                    else if (data[i].meta_key == 'shipping_first_name') { $('#txtshipfirstname').val(data[i].meta_value); }
                    else if (data[i].meta_key == 'shipping_last_name') { $('#txtshiplastname').val(data[i].meta_value); }
                    else if (data[i].meta_key == 'shipping_company_name') { $('#txtshipcompany').val(data[i].meta_value); }
                    else if (data[i].meta_key == 'shipping_address_1') { $('#txtshipaddress1').val(data[i].meta_value); }
                    else if (data[i].meta_key == 'shipping_address_2') { $('#txtshipaddress2').val(data[i].meta_value); }
                    else if (data[i].meta_key == 'shipping_postcode') { $('#txtshipzipcode').val(data[i].meta_value); }
                    else if (data[i].meta_key == 'shipping_city') { $('#txtshipcity').val(data[i].meta_value); }
                    else if (data[i].meta_key == 'shipping_country') { $('#ddlshipcountry').val(data[i].meta_value.trim()).trigger('change'); }
                    else if (data[i].meta_key == 'shipping_state') { $('#ddlshipstate').val(data[i].meta_value.trim()).trigger('change'); }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { $('.billinfo').prop("disabled", true); alert(errorThrown); },
            complete: function () { $('.billinfo').prop("disabled", false); },
            async: false
        });
        setTimeout(function () { GetTaxRate(); }, 100);
    }
    else {
        $('.billinfo').prop("disabled", true);
        $('#txtbillfirstname,#txtbilllastname,#txtbillcompany,#txtbilladdress1,#txtbilladdress2,#txtbillzipcode,#txtbillcity,#txtbillemail,#txtbillphone').val('');
        $('#ddlbillcountry').val('US').trigger('change');
        $('#txtshipfirstname,#txtshiplastname,#txtshipcompany,#txtshipaddress1,#txtshipaddress2,#txtshipzipcode,#txtshipcity').val('');
        $('#ddlshipcountry').val('US').trigger('change'); $('#hfTaxRate').val('0');
    }
}
///Get New Order No
function GetTaxRate() {
    ///Tax Calculate for state
    var tax_states = ["CA", "CO", "CT", "IL", "IN", "MI", "MS", "NC", "NE", "NJ", "NM", "PA", "TN", "TX", "WA", "AR", "FL", "GA", "IA", "MO", "OH", "SC", "WI"];
    var s_state = $("#ddlshipstate").val();
    if (tax_states.indexOf(s_state) > 0) {
        var opt = { strValue1: $("#txtshipzipcode").val(), strValue2: $("#txtshipcity").val(), strValue3: $("#ddlshipcountry").val() };
        if (opt.strValue1.length <= 0 || opt.strValue2.length <= 0 || opt.strValue3.length <= 0) { $('#hfTaxRate').val(0); return false; }
        $.ajax({
            type: "POST", url: '/Orders/GetTaxRate', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
            success: function (result) { $('#hfTaxRate').val(result.message); },
            error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
            async: false
        });
    }
    else {
        $('#hfTaxRate').val(0.00);
    }
    calculateDiscountAcount();
}
/// Get City By Pin code
function GetCityByZip(zipcode) {
    $.ajax({
        url: "https://ziptasticapi.com/" + zipcode,
        type: "GET",
        dataType: 'JSON',
        data: [],
        success: function (data) {
            $("#txtshipcity").val(data.city); $("#ddlshipcountry").val(data.country).trigger('change'); $("#ddlshipstate").val(data.state).trigger('change');
            GetTaxRate();
        },
        error: function (msg) { alert(msg); }
    });
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Edit Order ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getOrderInfo() {
    var oid = parseInt($('#hfOrderNo').val()) || 0;
    if (oid > 0) {
        $('.page-heading').text('Edit order ').append('<a class="btn btn-danger" href="/Orders/OrdersHistory">Back to List</a>'); $('#lblOrderNo').text('Order #' + oid + ' detail '); $('#hfOrderNo').val(oid);
        $('#btnCheckout').remove(); $('.footer-finalbutton').append('<a class="btn btn-danger" href="/Orders/OrdersHistory">Back to List</a>');
        var opt = { strValue1: oid };
        $.ajax({
            type: "POST", url: '/Orders/GetOrderInfo', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
            success: function (result) {
                var data = JSON.parse(result);
                if (data.length > 0) {
                    $('.payment-history').text('Payment via ' + data[0].payment_method + ' ' + data[0].created_via + '. Customer IP: ' + data[0].ip_address);
                    $('#txtLogDate').val(data[0].date_created);
                    $('#ddlStatus').val(data[0].status.trim()).trigger('change'); $('#ddlUser').prop("disabled", true);
                    $("#ddlUser").empty().append('<option value="' + data[0].customer_id + '" selected>' + data[0].customer_name + '</option>');
                    ///billing_Details
                    $('#txtbillfirstname').val(data[0].b_first_name); $('#txtbilllastname').val(data[0].b_last_name); $('#txtbilladdress1').val(data[0].b_address_1); $('#txtbilladdress2').val(data[0].b_address_2);
                    $('#txtbillzipcode').val(data[0].b_postcode); $('#txtbillcity').val(data[0].b_city); $('#txtbillemail').val(data[0].b_email); $('#txtbillphone').val(data[0].b_phone);
                    $('#ddlbillcountry').val(data[0].b_country.trim()).trigger('change'); $('#ddlbillstate').val(data[0].b_state).trigger('change');
                    ///shipping_Details
                    $('#txtshipfirstname').val(data[0].s_first_name); $('#txtshiplastname').val(data[0].s_last_name); $('#txtshipaddress1').val(data[0].s_address_1); $('#txtshipaddress2').val(data[0].s_address_2);
                    $('#txtshipzipcode').val(data[0].s_postcode); $('#txtshipcity').val(data[0].s_city);
                    $('#ddlshipcountry').val(data[0].s_country.trim()).trigger('change'); $('#ddlshipstate').val(data[0].s_state.trim()).trigger('change');

                    //bind Product
                    getOrderItemList(oid);
                    $('.billinfo').prop("disabled", true);

                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
            async: false
        });
    }
    else {
        $('.page-heading').text('Add New Order');
    }
}
function getOrderItemList(oid) {
    var obj = { strValue1: oid };
    $.ajax({
        type: "POST", url: '/Orders/GetOrderProductList', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        success: function (data) {
            var itemsDetailsxml = []; var layoutHtml = '';
            for (var i = 0; i < data.length; i++) {
                if (data[i].product_type == 'line_item') {
                    itemsDetailsxml.push({
                        "PKey": data[i].product_id + '_' + data[i].variation_id, "product_id": data[i].product_id, "variation_id": data[i].variation_id, "product_name": data[i].product_name, "quantity": data[i].quantity, "sale_rate": data[i].sale_price, "total": data[i].total, "discount": data[i].discount, "tax_amount": data[i].tax_amount, "shipping_amount": 0, "is_free": data[i].is_free, "group_id": data[i].group_id
                    });
                }
                else if (data[i].product_type == 'coupon') {
                    layoutHtml += '<li id="li_' + data[i].product_name + '" data-coupon= "' + data[i].product_name + '" data-couponamt= "0" data-disctype= "">';
                    layoutHtml += '<a href="javascript:void(0);">';
                    layoutHtml += '<i class="fa fa-gift"></i>';
                    layoutHtml += '<span>' + data[i].product_name + '</span>';
                    layoutHtml += '<button type="button" class="btn btn-box-tool pull-right billinfo" onclick="removeCouponInList(\'' + data[i].product_name + '\');">';
                    layoutHtml += '<i class="fa fa-times"></i>';
                    layoutHtml += '</button>';
                    layoutHtml += '</a>';
                    layoutHtml += '</li>';
                }
            }
            bindItemListDataTable(itemsDetailsxml);
            $('#billCoupon').append(layoutHtml);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Coupon and Product Modal ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
///Add Modal Coupon
function CouponModal() {
    var myHtml = '';
    //header
    myHtml += '<div class="modal-dialog">';
    myHtml += '<div class="modal-content">';
    myHtml += '<div class="modal-header">';
    myHtml += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    myHtml += '<h4 class="modal-title" id="myModalLabel">Apply Coupon</h4>';
    myHtml += '</div>';
    myHtml += '<div class="modal-body">Enter a coupon code to apply. Discounts are applied to line totals, before taxes.';
    myHtml += '<input class="form-control" type="text" id="txt_Coupon" name="txt_Coupon" placeholder="Coupon Code" maxlength="25">';
    myHtml += '</div > ';
    myHtml += '<div class="modal-footer">';
    myHtml += '<button type="button" class="btn btn-primary" id="btnCouponAdd">Add</button>';
    myHtml += '</div>';
    myHtml += '</div>';
    myHtml += '</div>';
    $("#billModal").empty().html(myHtml);
    $("#billModal").modal({ backdrop: 'static' }); $("#txt_Coupon").focus();
}
function getAllCoupons() {
    var coupons = [];
    $('#billCoupon li').each(function (index) { coupons.push($(this).data('coupon')); });
    return coupons;
}
function ApplyCoupon() {
    let code = jQuery("#txt_Coupon").val().toLowerCase();
    let autocode = ["cbdistillery", "thesleepadvisor", "tuck", "rv10", "rizslumber", "bestsleep10", "get140", "calm", "relax", "cupid110", "sleepopolis", "tv140", "pennymac", "pnmac", "sleepfoundation", "matt-topper", "matt-sheet", "matt-blanket", "matt-pillow", "matt-bedframe", "matt-found", "found-frame", "sleepy10", "sleepy20"];
    let monthlySaleCoupon = ["sales10off", "sales25off", "sales50off", "sales75off", "sales100off", "sales125off", "sales150off", "sales175off", "sales200off", "cxstaff20off", "mgr20off", "mgr50off"];
    let is_monthly_sale_cpn = monthlySaleCoupon.some(el => code.includes(el));

    if (code == '') { swal('Alert!', 'Please Enter a Coupon Code.', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
    else if (autocode.includes(code)) { swal('Alert!', 'Cannot Add this Auto-Coupon.', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
    else if (is_monthly_sale_cpn) { swal('Alert!', 'Can not add ' + code, "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
    else {
        if (code == 'forbes') { swal('Alert!', 'Can not add ' + code, "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
        else if (code == 'slumber') { swal('Alert!', 'Can not add ' + code, "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
    }

    var obj = { strValue1: code };
    $.ajax({
        type: "POST", url: '/Orders/GetCouponAmount', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        success: function (result) {
            var data = JSON.parse(result);
            bindCouponList(code, data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });
    //$("#billModal").modal({ backdrop: 'static' }); $("#txt_Coupon").focus();
}
function bindCouponList(code, data) {
    var layoutHtml = '';
    if (data.length > 0) {
        //check expires date
        if (data[0].date_expires != "" && data[0].date_expires != null) {
            let exp_date = new Date(parseInt(data[0].date_expires) * 1000);
            let today = new Date();
            if (exp_date < today) { swal('Alert!', 'Coupon code has been expired.', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
        }

        var zPCnt = 0, rq_prd_ids = [], zExcPCnt = 0, exclude_ids = [];
        if (data[0].exclude_product_ids != "" && data[0].exclude_product_ids != null) {
            exclude_ids = data[0].exclude_product_ids.split(",").map((el) => parseInt(el));
        }
        if (data[0].product_ids != "" && data[0].product_ids != null) {
            rq_prd_ids = data[0].product_ids.split(",").map((el) => parseInt(el));
        }
        //get pdorduct
        //$("#tblAddItemFinal > tbody  > tr").each(function () {
        //    if (jQuery.inArray($(this).data("vid").toString(), zProductIDs) != -1) { zPCnt++; }
        //    if (jQuery.inArray($(this).data("vid").toString(), zExcludeProductIDs) == -1) { zExcPCnt++; }
        //});

        //if (zPCnt == 0 && zExcPCnt == 0) { swal('Alert!', 'Invalid code entered. Please try again.!', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }

        if ($('#li_' + data[0].post_title).length <= 0) {
            layoutHtml += '<li id="li_' + data[0].post_title + '" data-coupon= "' + data[0].post_title + '" data-couponamt= "' + data[0].coupon_amount + '" data-disctype= "' + data[0].discount_type + '" data-rqprdids= "' + data[0].product_ids + '" data-excludeids= "' + data[0].exclude_product_ids + '">';
            layoutHtml += '<a href="javascript:void(0);">';
            layoutHtml += '<i class="fa fa-gift"></i>';
            layoutHtml += '<span>' + data[0].post_title + '</span>';
            layoutHtml += '<button type="button" class="btn btn-box-tool pull-right" onclick="removeCouponInList(\'' + data[0].post_title + '\');">';
            layoutHtml += '<i class="fa fa-times"></i>';
            layoutHtml += '</button>';
            layoutHtml += '</a>';
            layoutHtml += '</li>';
        }
        else {
            swal('Alert!', 'Coupon code already applied!', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false;
        }
        $('#billCoupon').append(layoutHtml);
        calculateDiscountAcount();
        $("#billModal").modal('hide');
    }
    else {
        var msg = 'Coupon "' + code + '" does not exist!';
        swal('Alert!', msg, "info");
    }
}
function removeCouponInList(code) {
    //------------- Remove data in Temp AddItemList-----
    swal({ title: "Are you sure?", text: 'Would you like to Remove this Coupon?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) {
                //Remove Coupon
                $('#li_' + code).remove();
                //calculate Coupon
                calculateDiscountAcount();
            }
        });
}
function calculateDiscountAcount() {
    var tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00;
    var countCoupon = $('#billCoupon li').length;
    if (countCoupon > 0) {
        $('#billCoupon li').each(function (index) {
            var zCouponAmt = parseFloat($(this).data('couponamt')) || 0.00, zDiscType = $(this).data('disctype'), zQty = 0.00, zGrossAmount = 0.00, zDisAmt = 0.00;
            var rq_prd_ids = [], exclude_ids = [];

            if ($(this).data('excludeids') != "" && $(this).data('excludeids') != null) {
                exclude_ids = $(this).data('excludeids').split(",").map((el) => parseInt(el));
            }
            if ($(this).data('rqprdids') != "" && $(this).data('rqprdids') != null) {
                rq_prd_ids = $(this).data('rqprdids').split(",").map((el) => parseInt(el));
            }

            var discounted_prc = parseFloat($('#totalQty').data('qty')) || 0.00;
            if (zDiscType == 'fixed_cart') { zCouponAmt = (zCouponAmt / discounted_prc); }
            var zLastCouponAmt = 0.00, zLastDisAmt = 0.00;

            $("#tblAddItemFinal > tbody  > tr").each(function () {
                //Discout Not Apply in free items
                if (!$(this).data('freeitem')) {
                    var pid = $(this).data('pid'), vid = $(this).data('vid');
                    if (!exclude_ids.includes(pid) && !exclude_ids.includes(vid) && ((rq_prd_ids.includes(pid) || rq_prd_ids.includes(vid)) || rq_prd_ids == 0)) {
                        zQty = parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00;
                        zGrossAmount = parseFloat($(this).find(".TotalAmount").data("salerate")) || 0.00;
                        zGrossAmount = zGrossAmount * zQty;
                        $(this).find(".TotalAmount").data("amount", zGrossAmount.toFixed(2)); $(this).find(".TotalAmount").text(zGrossAmount.toFixed(2));

                        if (zDiscType == 'fixed_product') { zDisAmt = zCouponAmt * zQty; }
                        else if (zDiscType == 'fixed_cart') { zDisAmt = zCouponAmt * zQty; }
                        else if (zDiscType == 'percent') { zDisAmt = (zGrossAmount * zCouponAmt) / 100; }

                        if (index == 0) {
                            zLastCouponAmt = zLastDisAmt = 0.00;
                        }
                        else {
                            zLastCouponAmt = parseFloat($(this).find(".RowDiscount").data("couponamt")) || 0;
                            zLastDisAmt = parseFloat($(this).find(".TotalAmount").data("discount")) || 0;
                        }
                        zLastCouponAmt = zLastCouponAmt + zCouponAmt;
                        zLastDisAmt = zLastDisAmt + zDisAmt;

                        $(this).find(".RowDiscount").data("disctype", 'fixed');
                        $(this).find(".RowDiscount").data("couponamt", zLastCouponAmt);
                        $(this).find(".RowDiscount").text(zLastDisAmt.toFixed(2)); $(this).find(".TotalAmount").data("discount", zLastDisAmt.toFixed(2));

                        //Taxation                     
                        zTotalTax = (((zGrossAmount - zLastDisAmt) * tax_rate) / 100);
                        $(this).find(".RowTax").text(zTotalTax.toFixed(2)); $(this).find(".TotalAmount").data("taxamount", zTotalTax.toFixed(2));

                    }
                }
            });
        });
    }
    else {
        var zCouponAmt = 0.00, zDiscType = 'fixed', zQty = 0.00, zGrossAmount = 0.00, zDisAmt = 0.00;
        $("#tblAddItemFinal > tbody  > tr").each(function () {
            zQty = parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00;
            zGrossAmount = parseFloat($(this).find(".TotalAmount").data("salerate")) || 0.00;
            zGrossAmount = zGrossAmount * zQty;
            $(this).find(".TotalAmount").data("amount", zGrossAmount.toFixed(2)); $(this).find(".TotalAmount").text(zGrossAmount.toFixed(2));

            $(this).find(".RowDiscount").data("disctype", zDiscType);
            $(this).find(".RowDiscount").data("couponamt", zCouponAmt);
            $(this).find(".RowDiscount").text(zDisAmt); $(this).find(".TotalAmount").data("discount", zDisAmt);
            zTotalTax = (((zGrossAmount - zDisAmt) * tax_rate) / 100);
            $(this).find(".RowTax").text(zTotalTax.toFixed(2)); $(this).find(".TotalAmount").data("taxamount", zTotalTax.toFixed(2));
        });
    }
    calcFinalTotals();
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Shipping Charges ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getItemShippingCharge(options) {
    var defaultTabOptions = { strValue1: 0, strValue2: 0 };

    options = $.extend(true, defaultTabOptions, options);

    $.ajax({
        type: "POST", url: '/Orders/GetProductShipping', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(options),
        success: function (data) {
            $('#tritemId_' + options.strValue1 + "_" + options.strValue2).find(".TotalAmount").data("shippingamt", data.amount);
            calcFinalTotals();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });

}
function calculateStateRecyclingFee() {
    var ship_state = $("#ddlshipstate").val();
    var stateRecyclingFee = 0.00, matCount = 0;
    var item = [118, 20861, 611172];
    $("#tblAddItemFinal > tbody  > tr").each(function () {
        if (item.includes($(this).data('pid'))) { matCount = matCount + (parseInt($(this).find("[name=txt_ItemQty]").val()) || 0.00); }
    });

    if (ship_state == "CA") { stateRecyclingFee = matCount * 10.5; }
    else if (ship_state == "CT") { stateRecyclingFee = matCount * 11.75; }
    else if (ship_state == "RI") { stateRecyclingFee = matCount * 16; }
    $("#stateRecyclingFeeTotal").text(stateRecyclingFee.toFixed(2));
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Item Tab Section ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getItemList() {
    var res = $('#ddlProduct').val().split('$');
    var pid = parseInt(res[0]) || 0, vid = parseInt(res[1]) || 0;
    var obj = { strValue1: pid, strValue2: vid };
    var tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00;
    $.ajax({
        type: "POST", url: '/Orders/GetProductInfo', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        success: function (data) {
            var itemsDetailsxml = [];
            for (var i = 0; i < data.length; i++) {
                itemsDetailsxml.push({
                    "PKey": data[i].product_id + '_' + data[i].variation_id, "product_id": data[i].product_id, "variation_id": data[i].variation_id, "product_name": data[i].product_name, "quantity": data[i].quantity, "sale_rate": data[i].sale_price, "total": (data[i].sale_price * data[i].quantity), "discount": 0, "tax_amount": (((data[i].sale_price * data[i].quantity) * tax_rate) / 100).toFixed(2), "shipping_amount": 0, "is_free": data[i].is_free, "group_id": data[i].group_id
                });
            }
            bindItemListDataTable(itemsDetailsxml);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });
    setTimeout(function () { getItemShippingCharge({ strValue1: pid, strValue2: vid, strValue3: $("#ddlshipcountry").val() }); }, 100);
}
//-----bind Item Table ---------------------------
function bindItemListDataTable(data) {
    var layoutHtml = '';
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].product_id > 0) {
                if ($('#tritemId_' + data[i].PKey).length <= 0) {
                    layoutHtml += '<tr id="tritemId_' + data[i].PKey + '" data-id="' + data[i].PKey + '" data-pid="' + data[i].product_id + '" data-vid="' + data[i].variation_id + '" data-pname="' + data[i].product_name + '" data-gid="' + data[i].group_id + '" data-freeitem="' + data[i].is_free + '">';
                    layoutHtml += '<td class="text-center"><a class="btn menu-icon-gr vd_red btnDeleteItem billinfo" tabitem_itemid="' + data[i].PKey + '" onclick="removeItemsInTable(\'' + data[i].PKey + '\');"> <i class="glyphicon glyphicon-trash"></i> </a></td>';
                    layoutHtml += '<td>' + data[i].product_name + '</td>';
                    layoutHtml += '<td class="text-right">' + data[i].sale_rate + '</td>';
                    if (data[i].is_free)
                        layoutHtml += '<td><input min="1" autocomplete="off" disabled class="form-control billinfo number rowCalulate" type="number" id="txt_ItemQty_' + data[i].PKey + '" value="' + data[i].quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
                    else
                        layoutHtml += '<td><input min="1" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_ItemQty_' + data[i].PKey + '" value="' + data[i].quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
                    layoutHtml += '<td class="TotalAmount text-right" data-salerate="' + data[i].sale_rate + '" data-discount="' + data[i].discount + '" data-amount="' + data[i].total + '" data-taxamount="' + data[i].tax_amount + '" data-shippingamt="' + data[i].shipping_amount + '">' + data[i].total + '</td>';
                    layoutHtml += '<td class="text-right RowDiscount" data-disctype="-" data-couponamt="0">' + data[i].discount + '</td>';
                    layoutHtml += '<td class="text-right RowTax">' + data[i].tax_amount + '</td>';
                    layoutHtml += '</tr>';
                }
                else {
                    var zQty = parseFloat($('#txt_ItemQty_' + data[i].rd_id).val()) || 0.00;
                    $('#txt_ItemQty_' + data[i].rd_id).val((parseFloat($('#txt_ItemQty_' + data[i].PKey).val()) + data[i].quantity).toFixed(2));
                    //calcRowAmount($('#txt_ItemQty_' + data[i].rd_id), $($('#txt_ItemQty_' + data[i].PKey)).parents('tr')[0]);
                }
            }
        }
        $('#tblAddItemFinal tbody').append(layoutHtml);
        //$("#txt_ItemSearch").val('');
        //$('.number').numeric({ min: 2, allowMinus: false, allowThouSep: false, maxDecimalPlaces: 2 });
        // Bind calcLineAmount function to each textbox and send parent TR
        //$("#divAddItemFinal").find(".rowCalulate").blur(function () { calcRowAmount(this, $(this).parents('tr')[0]); });
        $("#divAddItemFinal").find(".rowCalulate").change(function () { calculateDiscountAcount(); });
    }
    else {
        layoutHtml += '<table id="tblAddItemFinal" class="table table-striped table-bordered table-condensed table-hover total_data imagetable table-margin-bottom">';
        layoutHtml += '<thead>';
        layoutHtml += '<tr>';
        layoutHtml += '<th class="text-center" style="width: 5%">Actions</th>';
        layoutHtml += '< th style = "width: 55%" > Item</th >';
        layoutHtml += '<th class="text-right" style="width: 8%">Sale Price</th>';
        layoutHtml += '<th class="text-right" style="width: 8%">Quantity</th>';
        layoutHtml += '<th class="text-right" style="width: 8%">Total</th>';
        layoutHtml += '<th class="text-right" style="width: 8%">Discount</th>';
        layoutHtml += '<th class="text-right" style="width: 8%">Tax</th>';
        layoutHtml += '</tr>';
        layoutHtml += '</thead>';
        layoutHtml += '<tbody></tbody>';
        layoutHtml += '</table>';
        $('#divAddItemFinal').empty().html(layoutHtml);
    }
    calculateDiscountAcount()
    //calcFinalTotals();
}
//-----Remove row in Itemtable Table--------------
function removeItemsInTable(id) {
    //------------- Remove data in Temp AddItemList-----
    swal({ title: "Are you sure?", text: 'Would you like to Remove this Item?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) { $('#tritemId_' + id).remove(); calcFinalTotals(); }
        });
}
//------ Calculate Rows Amount --------------------------------
function calcRowAmount(objControl, objRow) // objRow is row object
{
    calculateDiscountAcount();
}
function calcFinalTotals() {
    calculateStateRecyclingFee();
    //TTotal
    var zQty = 0.00, zDiscQty = 0.00, zGAmt = 0.00, zTDiscount = 0.00, zTotalTax = 0.00, zShippingAmt = 0.00, stateRecyclingFee = 0.00;
    var rowCount = $('#tblAddItemFinal >tbody >tr').length;
    $("#tblAddItemFinal > tbody  > tr").each(function () {
        zQty = zQty + (parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00);
        zGAmt = zGAmt + parseFloat($(this).find(".TotalAmount").data("amount"));
        if (parseFloat($(this).find(".TotalAmount").data("amount")) > 0)
            zDiscQty = zDiscQty + (parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00);
        zTDiscount = zTDiscount + parseFloat($(this).find(".TotalAmount").data("discount"));
        zTotalTax = zTotalTax + parseFloat($(this).find(".TotalAmount").data("taxamount"));
        zShippingAmt = zShippingAmt + parseFloat($(this).find(".TotalAmount").data("shippingamt"));
    });
    stateRecyclingFee = parseFloat($("#stateRecyclingFeeTotal").text()) || 0.00;
    $("#totalQty").text(zQty.toFixed(0)); $("#totalQty").data('qty', zDiscQty.toFixed(0));
    $("#SubTotal").text(zGAmt.toFixed(2));
    $("#discountTotal").text(zTDiscount.toFixed(2));
    $("#salesTaxTotal").text(zTotalTax.toFixed(2));
    $("#shippingTotal").text(zShippingAmt.toFixed(2));
    $("#orderTotal").html((zGAmt - zTDiscount + zShippingAmt + zTotalTax + stateRecyclingFee).toFixed(2));
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Post and Post Meta ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function createPostMeta() {
    var oid = $('#hfOrderNo').val();
    var postMetaxml = [];
    postMetaxml.push(
        { post_id: oid, meta_key: '_order_key', meta_value: 'wc_order_' }, { post_id: oid, meta_key: '_customer_user', meta_value: parseInt($('#ddlUser').val()) || 0 },
        { post_id: oid, meta_key: '_payment_method', meta_value: 'podium' }, { post_id: oid, meta_key: '_payment_method_title', meta_value: 'Podium Order' },
        { post_id: oid, meta_key: '_customer_ip_address', meta_value: '::1' }, { post_id: oid, meta_key: '_customer_user_agent', meta_value: '0' },
        { post_id: oid, meta_key: '_created_via', meta_value: 'checkout' }, { post_id: oid, meta_key: '_cart_hash', meta_value: '0' },
        { post_id: oid, meta_key: '_billing_first_name', meta_value: $('#txtbillfirstname').val() }, { post_id: oid, meta_key: '_billing_last_name', meta_value: $('#txtbilllastname').val() },
        { post_id: oid, meta_key: '_billing_address_1', meta_value: $('#txtbilladdress1').val() }, { post_id: oid, meta_key: '_billing_address_2', meta_value: $('#txtbilladdress2').val() },
        { post_id: oid, meta_key: '_billing_city', meta_value: $('#txtbillcity').val() }, { post_id: oid, meta_key: '_billing_state', meta_value: $('#ddlbillstate').val() },
        { post_id: oid, meta_key: '_billing_postcode', meta_value: $('#txtbillzipcode').val() }, { post_id: oid, meta_key: '_billing_country', meta_value: $('#ddlbillcountry').val() },
        { post_id: oid, meta_key: '_billing_email', meta_value: $('#txtbillemail').val() }, { post_id: oid, meta_key: '_billing_phone', meta_value: $('#txtbillphone').val() },
        { post_id: oid, meta_key: '_order_version', meta_value: '4.8.0' }, { post_id: oid, meta_key: '_prices_include_tax', meta_value: 'no' },
        { post_id: oid, meta_key: '_shipping_address_index', meta_value: '' }, { post_id: oid, meta_key: 'is_vat_exempt', meta_value: 'no' },
        { post_id: oid, meta_key: '_download_permissions_granted', meta_value: 'yes' }, { post_id: oid, meta_key: '_recorded_sales', meta_value: 'yes' },
        { post_id: oid, meta_key: '_recorded_coupon_usage_counts', meta_value: 'yes' }, { post_id: oid, meta_key: '_order_stock_reduced', meta_value: 'yes' },
        { post_id: oid, meta_key: '_edit_lock', meta_value: '1' }, { post_id: oid, meta_key: '_shipping_first_name', meta_value: $('#txtshipfirstname').val() },
        { post_id: oid, meta_key: '_shipping_last_name', meta_value: $('#txtshiplastname').val() }, { post_id: oid, meta_key: '_shipping_address_1', meta_value: $('#txtshipaddress1').val() },
        { post_id: oid, meta_key: '_shipping_address_2', meta_value: $('#txtshipaddress2').val() }, { post_id: oid, meta_key: '_shipping_city', meta_value: $('#txtshipcity').val() },
        { post_id: oid, meta_key: '_shipping_state', meta_value: $('#ddlshipstate').val() }, { post_id: oid, meta_key: '_shipping_postcode', meta_value: $('#txtshipzipcode').val() },
        { post_id: oid, meta_key: '_shipping_country', meta_value: $('#ddlshipcountry').val() }, { post_id: oid, meta_key: '_shipping_email', meta_value: '' },
        { post_id: oid, meta_key: '_shipping_phone', meta_value: '' }, { post_id: oid, meta_key: '_order_currency', meta_value: 'USD' },
        { post_id: oid, meta_key: '_order_total', meta_value: parseFloat($('#orderTotal').text()) || 0.00 }, { post_id: oid, meta_key: '_cart_discount', meta_value: parseFloat($('#discountTotal').text()) || 0.00 },
        { post_id: oid, meta_key: '_cart_discount_tax', meta_value: '0' }, { post_id: oid, meta_key: '_order_shipping', meta_value: parseFloat($('#shippingTotal').text()) || 0.00 },
        { post_id: oid, meta_key: '_order_shipping_tax', meta_value: parseFloat($('#shippingTaxTotal').text()) || 0.00 }, { post_id: oid, meta_key: '_order_tax', meta_value: parseFloat($('#salesTaxTotal').text()) || 0.00 }
    );
    return postMetaxml;
}
function createPostStatus() {
    var oid = $('#hfOrderNo').val();
    var postStatus = {
        order_id: oid,
        parent_id: 0,
        returning_customer: 0,
        customer_id: parseInt($('#ddlUser').val()) || 0,
        num_items_sold: parseInt($('#totalQty').text()) || 0,
        total_sales: parseFloat($('#orderTotal').text()) || 0,
        tax_total: parseFloat($('#salesTaxTotal').text()) || 0,
        shipping_total: parseFloat($('#shippingTotal').text()) || 0,
        net_total: (parseFloat($('#orderTotal').text()) || 0) - (parseFloat($('#salesTaxTotal').text()) || 0),
        status: $('#ddlStatus').val()
    };
    return postStatus;
}
function createOtherItemsList() {
    var oid = parseInt($('#hfOrderNo').val()) || 0;
    var otherItemsxml = [];
    $('#billCoupon li').each(function (index) {
        otherItemsxml.push({ order_id: oid, item_name: $(this).data('coupon'), item_type: 'coupon', amount: parseFloat($(this).data('couponamt')) || 0.00 });
    });
    //Add State Recycling Fee
    otherItemsxml.push({ order_id: oid, item_name: 'State Recycling Fee', item_type: 'fee', amount: parseFloat($('#stateRecyclingFeeTotal').text()) || 0.00 });
    //Add Shipping
    otherItemsxml.push({ order_id: oid, item_name: '', item_type: 'shipping', amount: parseFloat($('#shippingTotal').text()) || 0.00 });
    return otherItemsxml;
}
function createTaxItemsList() {
    var oid = parseInt($('#hfOrderNo').val()) || 0;
    var sCountry = $('#ddlshipcountry').val(), sState = $('#ddlshipstate').val();
    var taxRate = parseInt($('#hfTaxRate').val()) || 0.00;
    var taxItemsxml = [];
    //Add tax
    taxItemsxml.push({ order_id: oid, tax_rate_country: sCountry, tax_rate_state: sState, tax_rate: taxRate, amount: parseFloat($('#salesTaxTotal').text()) || 0.00 });

    return taxItemsxml;
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Save Details ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function saveCO() {

    var oid = parseInt($('#hfOrderNo').val()) || 0;
    var cid = parseInt($('#ddlUser').val()) || 0;
    //if (oid <= 0) { swal('Alert!', 'Please Select Customer.', "info").then((result) => { return false; }); }
    if (cid <= 0) { swal('Alert!', 'Please Select Customer.', "error").then((result) => { $('#ddlUser').select2('focus'); return false; }); return false; }
    var postMeta = createPostMeta(); var postStatus = createPostStatus(); var otherItems = createOtherItemsList(); var taxItems = createTaxItemsList();
    var itemsDetails = [];
    $('#tblAddItemFinal > tbody  > tr').each(function (index, tr) {
        var pKey = parseInt(index);
        var qty = parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00;
        var rate = parseFloat($(this).find(".TotalAmount").data('salerate')) || 0.00;
        var grossAmount = parseFloat($(this).find(".TotalAmount").data('amount')) || 0.00;
        var discountAmount = parseFloat($(this).find(".TotalAmount").data('discount')) || 0.00;
        var taxAmount = parseFloat($(this).find(".TotalAmount").data('taxamount')) || 0.00;
        var shippinAmount = parseFloat($(this).find(".TotalAmount").data('shippingamt')) || 0.00;

        itemsDetails.push({
            "PKey": pKey, "order_id": oid, "customer_id": cid, "product_id": $(this).data('pid'), "variation_id": $(this).data('vid'), "product_name": $(this).data('pname'), "quantity": qty, "sale_rate": rate, "total": grossAmount, "discount": discountAmount, "tax_amount": taxAmount, "shipping_amount": shippinAmount, "shipping_tax_amount": 0
        });
    });
    if (itemsDetails.length <= 0) { swal('Alert!', 'Please add product.', "error").then((result) => { $('#ddlProduct').select2('open'); return false; }); return false; }
    var obj = { OrderPostMeta: postMeta, OrderProducts: itemsDetails, OrderPostStatus: postStatus, OrderOtherItems: otherItems, OrderTaxItems: taxItems };

    $('#btnCheckout').prop("disabled", true); $('.billinfo').prop("disabled", true); $('#btnCheckout').text("Waiting...");
    //console.log(obj);
    //$('#btnPlaceOrder').prop("disabled", false); return false;
    $.ajax({
        type: "POST", contentType: "application/json; charset=utf-8",
        url: "/Orders/SaveCustomerOrder", // Controller/View
        data: JSON.stringify(obj), dataType: "json", beforeSend: function (xhr) { },
        success: function (data) {
            if (data.status == true) {
                //swal('Alert!', data.message, "success");
                setTimeout(function () { PaymentModal(); }, 50);
            }
            else { swal('Alert!', data.message, "error").then((result) => { return false; }); }
        },
        error: function (xhr, status, err) { $('#btnCheckout').prop("disabled", false); $('.billinfo').prop("disabled", false); alert(err); },
        complete: function () { $('#btnCheckout').prop("disabled", false); $('.billinfo').prop("disabled", false); $('#btnCheckout').text("Checkout"); },
    });
    $('#btnCheckout').text("Checkout");
    return false;
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Payment Modal ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function PaymentModal() {
    var myHtml = '';
    //header
    myHtml += '<div class="modal-dialog modal-lg">';
    myHtml += '<div class="modal-content">';
    myHtml += '<div class="modal-header">';
    myHtml += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    myHtml += '<h4 class="modal-title" id="myModalLabel">Order #' + $('#hfOrderNo').val() + '</h4>';
    myHtml += '</div>';
    myHtml += '<div class="modal-body no-padding" >';
    myHtml += '<section class="invoice no-margin">';
    /// row invoice-info
    myHtml += '<div class="row invoice-info">';
    myHtml += '<div class="col-sm-6 invoice-col">';
    myHtml += 'Billing Address: <address class="no-margin"><strong>' + $('#txtbillfirstname').val() + ' ' + $('#txtbilllastname').val() + '</strong > <br>' + $('#txtbilladdress1').val() + '<br>' + $('#txtbilladdress1').val() + '<br>' + $('#txtbillcity').val() + ' ,' + $('#ddlbillstate').val() + ' ' + $('#txtbillzipcode').val() + '<br>Phone: ' + $('#txtbillphone').val() + '<br>Email: ' + $('#txtbillemail').val() + '</address>';
    myHtml += '</div>';
    myHtml += '<div class="col-sm-6 invoice-col">';
    myHtml += 'Shipping Address: <address class="no-margin"><strong>' + $('#txtshipfirstname').val() + ' ' + $('#txtshiplastname').val() + '</strong > <br>' + $('#txtshipaddress1').val() + '<br>' + $('#txtshipaddress2').val() + '<br>' + $('#txtshipcity').val() + ' ,' + $('#ddlshipstate').val() + ' ' + $('#txtshipcity').val() + '</address>';
    myHtml += '</div>';
    myHtml += '</div>';
    /// row invoice-items
    myHtml += '<div class="row">';
    myHtml += '<div class="col-xs-12 table-responsive">';
    myHtml += '<table class="table table-striped" id="tblmodalitems">';
    myHtml += '<thead>';
    myHtml += '<tr>';
    myHtml += '<th style="width: 60%">Product</th>';
    myHtml += '<th style="width: 20%" class="text-right">Qty.</th>';
    myHtml += '<th style="width: 20%" class="text-right">Amount</th>';
    myHtml += '</tr>';
    myHtml += '</thead>';
    myHtml += '<tbody></tbody>';
    myHtml += '</table>';
    myHtml += '</div>';
    myHtml += '</div>';

    myHtml += '</section>';
    myHtml += '</div>';

    myHtml += '<div class="modal-footer">';
    myHtml += '<div class="col-md-7 ">';
    myHtml += '<div class="input-group">';
    myHtml += '<span class="input-group-btn"  >';
    myHtml += '<select class="form-control select2" id="ddlPaymentMethod" style="width: auto;">';
    myHtml += '<option value="podium" selected="selected">Podium</option>';
    myHtml += '<option value="paypal">PayPal</option>';
    myHtml += '</select>';
    myHtml += '</span>';
    myHtml += '<input class="form-control hidden" type="text" id="txtPPEmail" name="txtPPEmail" placeholder="PayPal Email" maxlength="60">';
    myHtml += '</div>';
    myHtml += '</div>';
    myHtml += '<button type="button" class="btn btn-primary" id="btnPlaceOrder">Place Order $' + $('#orderTotal').text() + '</button>';
    myHtml += '<button type="button" class="btn btn-primary hidden" id="btnResendInv">Resend Invoice $' + $('#orderTotal').text() + '</button>';
    myHtml += '</div>';

    myHtml += '</div>';
    myHtml += '</div>';
    $("#billModal").empty().html(myHtml);
    myHtml = '';
    //get items
    $('#tblAddItemFinal > tbody  > tr').each(function (index, tr) {
        var qty = parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00;
        var grossAmount = parseFloat($(this).find(".TotalAmount").data('amount')) || 0.00;
        var discountAmount = parseFloat($(this).find(".TotalAmount").data('discount')) || 0.00;
        var taxAmount = parseFloat($(this).find(".TotalAmount").data('taxamount')) || 0.00;
        myHtml += '<tr>';
        myHtml += '<td>' + $(this).data('pname') + '</td>';
        myHtml += '<td class="text-right">' + qty + '</td>';
        myHtml += '<td class="text-right">' + (grossAmount - discountAmount + taxAmount) + '</td>';
        myHtml += '</tr>';
    });
    $('#tblmodalitems tbody').append(myHtml);

    $("#billModal").modal({ backdrop: 'static' }); $("#txt_Coupon").focus();
}

///Accept Payment
function AcceptPayment() {
    if ($("#ddlPaymentMethod").val() == "paypal") {
        if ($("#txtPPEmail").val().length <= 5) {
            swal('Alert!', 'Please enter PayPal Email.', "info").then((result) => { return false; });
        }
        else {
            PaypalPayment($("#txtPPEmail").val());
        }
    }
    else if ($("#ddlPaymentMethod").val() == "podium") { PodiumPayment() }
    else { swal('Alert!', 'Please Select Payment Method.', "error"); }
}

///Accept Podium Payment
function PodiumPayment() {
    var oid = parseInt($('#hfOrderNo').val()) || 0;
    var order_total = parseFloat($('#orderTotal').text()) || 0.00;
    var order_phone = $('#txtbillphone').val();
    var opt = { clientId: '51eed2ee1dbdced0d6e17548dde7e8a8', clientSecret: '80b1f585430df45f5a71e7a1a866c54dd2329856ced8503f55deee5313a20caf' };
    $.ajax({
        type: "POST", url: 'https://api.podium.com/api/session', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
        success: function (result) {
            var optinv = { employeeName: 'Layla', firstName: $('#txtbillfirstname').val(), lastName: $('#txtbilllastname').val(), invoiceAmount: order_total, invoiceDescription: 'Layla #' + oid, invoiceId: oid, locationId: '155425', customer_email: 'noreply@podium.com', phone: order_phone };
            console.log(optinv);
            $.ajax({
                type: "POST", url: 'https://api.podium.com/api/v1/webhook/3e23125f-cf42-4348-ace4-f38f759de0c2', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(optinv),
                beforeSend: function (xhr) { xhr.setRequestHeader("Authorization", result.token); },
                success: function (data) {
                    console.log(data);
                    setTimeout(function () { updatePayment(data.taskUid); }, 50);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
                async: false
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });
}
function updatePayment(taskUid) {
    var opt = { post_id: parseInt($('#hfOrderNo').val()) || 0, meta_value: taskUid };
    $.ajax({
        type: "POST", url: '/Orders/UpdatePaymentDetail', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
        success: function (result) {
            if (result.status == true) {
                $("#billModal").modal('hide'); $('.billinfo').prop("disabled", true);
                //setTimeout(function () { swal('Alert!', result.message, "success"); }, 50);
                setTimeout(function () { successModal('podium'); }, 50);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });
}

///Accept paypal Payment
function PaypalPayment(ppemail) {
    //swal('Alert!', 'Working....', "success").then((result) => { return false; });
    var dfa = $('#txtLogDate').val().split(/\//); df = [dfa[2], dfa[1], dfa[0]].join('-');
    var oid = parseInt($('#hfOrderNo').val()) || 0;
    var cid = parseInt($('#ddlUser').val()) || 0;
    //var ppemail = $("txtPPEmail").val();
    console.log(ppemail);
    if (cid <= 0) { swal('Alert!', 'Please Select Customer.', "info").then((result) => { return false; }); }
    if (oid <= 0) { swal('Alert!', 'Please create new order.', "info").then((result) => { return false; }); }

    $('#btnPlaceOrder').prop("disabled", true);
    var opt = { strValue1: oid }
    $.ajax({
        type: "POST", url: '/Orders/GetPayPalToken', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
        success: function (result) {
            //console.log(result);
            /// Create Invoice
            CreatePaypalInvoice(oid, ppemail, result.message);
            //CreatePaypalInvoice(oid, 'david.quick.fix1-buyer@gmail.com', result.message);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
        complete: function () { $('#btnPlaceOrder').prop("disabled", false); },
        async: false

    });

}
function CreatePaypalInvoice(oid, pp_email, access_token) {
    var taxPer = parseFloat($('#hfTaxRate').val()) || 0.00;
    var shipping_total = parseFloat($('#shippingTotal').text()) || 0.00;
    var itemsList = [];
    //get items
    $('#tblAddItemFinal > tbody  > tr').each(function (index, tr) {
        var qty = parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00;
        var rate = parseFloat($(this).find(".TotalAmount").data('salerate')) || 0.00;
        var taxAmount = parseFloat($(this).find(".TotalAmount").data('taxamount')) || 0.00;
        var discountAmount = parseFloat($(this).find(".TotalAmount").data('discount')) || 0.00;
        itemsList.push({
            name: $(this).data('pname'),
            quantity: qty,
            unit_amount: { currency_code: "USD", value: rate },
            tax: { name: "Sales Tax", value: taxAmount, percent: taxPer },
            discount: { amount: { currency_code: "USD", value: discountAmount } },
            unit_of_measure: "QUANTITY"
        });
    });
    var option = {
        detail: {
            invoice_number: oid,
            reference: "",
            invoice_date: df,
            currency_code: "USD",
            note: "Layla Invoice.",
            payment_term: { term_type: "NET_10" }
        },
        invoicer: {
            name: { given_name: "", surname: "" },
            address: { address_line_1: "157 Church Street Suite 1956", address_line_2: "", admin_area_2: "New Haven", admin_area_1: "CT", postal_code: "06510", country_code: "US" },
            email_address: "david.quick.fix1-facilitator@gmail.com",
            phones: [{ country_code: "001", national_number: "8553581676", phone_type: "MOBILE" }],
            website: "www.laylasleep.com",
            logo_url: "https://laylasleep-quickfix1.netdna-ssl.com/wp-content/themes/layla-white/images/logo.png",
            additional_notes: ""
        },
        primary_recipients: [
            {
                billing_info: {
                    name: { given_name: $('#txtbillfirstname').val(), surname: $('#txtbilllastname').val() },
                    address: { address_line_1: $('#txtbilladdress1').val() + ' ' + $('#txtbilladdress2').val(), admin_area_2: $('#txtbillcity').val(), admin_area_1: $('#ddlbillstate').val(), postal_code: $('#txtbillzipcode').val(), country_code: $('#ddlbillcountry').val() },
                    email_address: pp_email,
                    //phones: [{ country_code: "001", national_number: $('#txtbillphone').val(), phone_type: "HOME" }]
                },
                shipping_info: {
                    name: { given_name: $('#txtshipfirstname').val(), surname: $('#txtshiplastname').val() },
                    address: { address_line_1: $('#txtshipaddress1').val() + ' ' + $('#txtshipaddress2').val(), admin_area_2: $('#txtshipcity').val(), admin_area_1: $('#ddlshipstate').val(), postal_code: $('#txtshipzipcode').val(), country_code: $('#ddlshipcountry').val() }
                }
            }
        ],
        items: itemsList,
        configuration: { allow_tip: false, tax_calculated_after_discount: true, tax_inclusive: false, },
        amount: {
            breakdown: {
                //custom: { label: "Packing Charges", amount: { currency_code: "USD", value: "10.00" } },
                shipping: { amount: { currency_code: "USD", value: shipping_total }, tax: { name: "Sales Tax", percent: taxPer } },
                //discount: { invoice_discount: { percent: "5" } }
            }
        }
    }
    console.log(option);
    $.ajax({
        type: "POST", url: 'https://api-m.sandbox.paypal.com/v2/invoicing/invoices', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Accept-Language", "en_US");
            xhr.setRequestHeader("Authorization", "Bearer " + access_token);
        },
        success: function (data) {
            console.log(data);
            var sendURL = data.href + '/send';
            $("txtPPEmail").data('surl', sendURL);
            ///send Invoice
            SendPaypalInvoice(access_token, sendURL)
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { console.log(XMLHttpRequest); swal('Alert!', errorThrown, "error"); },
        async: false
    });
}
function SendPaypalInvoice(access_token, sendURL) {
    $.ajax({
        type: "POST", url: sendURL, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify({ send_to_invoicer: true }),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Accept-Language", "en_US");
            xhr.setRequestHeader("Authorization", "Bearer " + access_token);
        },
        success: function (senddata) {
            console.log(senddata);
            $("#billModal").modal('hide'); $('.billinfo').prop("disabled", true);
            //setTimeout(function () { swal('Order received!', 'Thank you. Your invoice has been send on your email for payment.', "success").then((result) => { window.location.href = window.location.href; }); }, 50);
            setTimeout(function () { successModal('PayPal'); }, 50);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#ddlPaymentMethod').prop("disabled", true); $('#btnPlaceOrder').addClass('hidden'); $('#btnResendInv').removeClass('hidden');
            console.log(XMLHttpRequest); swal('Alert!', 'PayPal Invoice successfully created but not send. please Resend it.', "error");
        },
        complete: function () { $('#btnPlaceOrder').prop("disabled", false); },
        async: false
    });
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Success modal ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function successModal(paymode) {
    var myHtml = '';
    //header
    myHtml += '<div class="modal-dialog modal-lg">';
    myHtml += '<div class="modal-content">';
    myHtml += '<div class="modal-body no-padding" >';

    myHtml += '<div  class="order-detail-page">';
    myHtml += '<h1  class="thankyou-order-received">';
    myHtml += '<strong  class="thankpage-logo"><a  href="/"><img alt="Layla Logo" src="https://quickfix16.com/wp-content/themes/layla-white/images/logo.png"></a></strong>';
    myHtml += '<span >Thank you.</span> Your order has been received.';
    myHtml += '</h1>';
    myHtml += '<div  class="thankyou-for-your-order">';

    myHtml += '<div  class="order-detail-box">';
    myHtml += '<ul  class=" order_details order-detail-ul">';
    myHtml += '<li> Order number: <strong >' + $('#hfOrderNo').val() + '</strong></li><li> Date: <strong >' + $('#txtLogDate').val() + '</strong></li><li> Total:<strong>$' + $('#orderTotal').text() + '</strong></li><li> Payment Method: <strong >' + paymode + '</strong></li>';
    myHtml += '</ul>';
    myHtml += '</div>';

    myHtml += '<div  class="container">';
    myHtml += '<section  class="order-details">';
    myHtml += '<h2>Order details</h2>';
    myHtml += '<table id="tblorder_details" class="shop_table order_details">';
    myHtml += '<thead><tr><th class=" product-name">Product</th><th class="product-total">Total</th></tr></thead>';
    myHtml += '<tbody></tbody>';
    myHtml += '<tfoot>';
    myHtml += '<tr><th  scope="row">Subtotal:</th><td ><span  class=" amount">$' + $('#SubTotal').text() + '</span></td></tr>';
    myHtml += '<tr><th  scope="row">Discount:</th><td >-<span  class=" amount">$' + $('#discountTotal').text() + '</span></td></tr>';
    myHtml += '<tr><th  scope="row">Shipping:</th><td >' + $('#shippingTotal').text() + '</td></tr>';
    myHtml += '<tr ><th  scope="row">Tax:</th><td >$' + $('#salesTaxTotal').text() + '</td></tr>';
    myHtml += '<tr ><th  scope="row">State Recycling Fee:</th><td >$' + $('#stateRecyclingFeeTotal').text() + '</td></tr>';
    myHtml += '<tr ><th  scope="row">Total:</th><td ><span  class=" amount">$' + $('#orderTotal').text() + '</span></td></tr>';
    myHtml += '</tfoot>';

    myHtml += '</table>';
    myHtml += '</section>';
    myHtml += '</div>';

    myHtml += '</div>';
    myHtml += '</div >';

    myHtml += '</div>';

    myHtml += '<div class="modal-footer">';
    myHtml += '<button type="button" class="btn btn-primary" id="btnNewOrder">OK</button>';
    myHtml += '</div>';

    myHtml += '</div>';
    myHtml += '</div>';

    $("#billModal").empty().html(myHtml);
    myHtml = '';
    $('#tblAddItemFinal > tbody  > tr').each(function (index, tr) {
        var qty = parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00;
        var grossAmount = parseFloat($(this).find(".TotalAmount").data('amount')) || 0.00;
        myHtml += '<tr class="order_item"><td class="product-name"><span>' + $(this).data('pname') + '</span><strong class="product-quantity">× ' + qty + '</strong></td><td class="product-total"><span class="amount">$' + grossAmount + '</span></td></tr>';
    });
    $('#tblorder_details tbody').append(myHtml);

    $("#billModal").modal({ backdrop: 'static' });
}