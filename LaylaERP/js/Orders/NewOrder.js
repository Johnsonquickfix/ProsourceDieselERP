var wc_users_params = [{ "name": "United States", "abbreviation": "US", "states": [{ "name": "Alabama", "abbreviation": "AL" }, { "name": "Alaska", "abbreviation": "AK" }, { "name": "American Samoa", "abbreviation": "AS" }, { "name": "Arizona", "abbreviation": "AZ" }, { "name": "Arkansas", "abbreviation": "AR" }, { "name": "California", "abbreviation": "CA" }, { "name": "Colorado", "abbreviation": "CO" }, { "name": "Connecticut", "abbreviation": "CT" }, { "name": "Delaware", "abbreviation": "DE" }, { "name": "District Of Columbia", "abbreviation": "DC" }, { "name": "Federated States Of Micronesia", "abbreviation": "FM" }, { "name": "Florida", "abbreviation": "FL" }, { "name": "Georgia", "abbreviation": "GA" }, { "name": "Guam", "abbreviation": "GU" }, { "name": "Hawaii", "abbreviation": "HI" }, { "name": "Idaho", "abbreviation": "ID" }, { "name": "Illinois", "abbreviation": "IL" }, { "name": "Indiana", "abbreviation": "IN" }, { "name": "Iowa", "abbreviation": "IA" }, { "name": "Kansas", "abbreviation": "KS" }, { "name": "Kentucky", "abbreviation": "KY" }, { "name": "Louisiana", "abbreviation": "LA" }, { "name": "Maine", "abbreviation": "ME" }, { "name": "Marshall Islands", "abbreviation": "MH" }, { "name": "Maryland", "abbreviation": "MD" }, { "name": "Massachusetts", "abbreviation": "MA" }, { "name": "Michigan", "abbreviation": "MI" }, { "name": "Minnesota", "abbreviation": "MN" }, { "name": "Mississippi", "abbreviation": "MS" }, { "name": "Missouri", "abbreviation": "MO" }, { "name": "Montana", "abbreviation": "MT" }, { "name": "Nebraska", "abbreviation": "NE" }, { "name": "Nevada", "abbreviation": "NV" }, { "name": "New Hampshire", "abbreviation": "NH" }, { "name": "New Jersey", "abbreviation": "NJ" }, { "name": "New Mexico", "abbreviation": "NM" }, { "name": "New York", "abbreviation": "NY" }, { "name": "North Carolina", "abbreviation": "NC" }, { "name": "North Dakota", "abbreviation": "ND" }, { "name": "Northern Mariana Islands", "abbreviation": "MP" }, { "name": "Ohio", "abbreviation": "OH" }, { "name": "Oklahoma", "abbreviation": "OK" }, { "name": "Oregon", "abbreviation": "OR" }, { "name": "Palau", "abbreviation": "PW" }, { "name": "Pennsylvania", "abbreviation": "PA" }, { "name": "Puerto Rico", "abbreviation": "PR" }, { "name": "Rhode Island", "abbreviation": "RI" }, { "name": "South Carolina", "abbreviation": "SC" }, { "name": "South Dakota", "abbreviation": "SD" }, { "name": "Tennessee", "abbreviation": "TN" }, { "name": "Texas", "abbreviation": "TX" }, { "name": "Utah", "abbreviation": "UT" }, { "name": "Vermont", "abbreviation": "VT" }, { "name": "Virgin Islands", "abbreviation": "VI" }, { "name": "Virginia", "abbreviation": "VA" }, { "name": "Washington", "abbreviation": "WA" }, { "name": "West Virginia", "abbreviation": "WV" }, { "name": "Wisconsin", "abbreviation": "WI" }, { "name": "Wyoming", "abbreviation": "WY" }] }, { "name": "Canada", "abbreviation": "CA", "states": [{ "name": "Alberta", "abbreviation": "AB" }, { "name": "British Columbia", "abbreviation": "BC" }, { "name": "Manitoba", "abbreviation": "MB" }, { "name": "New Brunswick", "abbreviation": "NB" }, { "name": "Newfoundland and Labrador", "abbreviation": "NL" }, { "name": "Northwest Territories", "abbreviation": "NT" }, { "name": "Nova Scotia", "abbreviation": "NS" }, { "name": "Nunavut", "abbreviation": "NU" }, { "name": "Ontario", "abbreviation": "ON" }, { "name": "Prince Edward Island", "abbreviation": "PE" }, { "name": "Quebec", "abbreviation": "QC" }, { "name": "Saskatchewan", "abbreviation": "SK" }, { "name": "Yukon Territory", "abbreviation": "YT" }] }]

$(document).ready(function () {
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
    $("#billModal").on("keypress", function (e) { if (e.which == 13 && e.target.type != "textarea") { $("#btnCouponAdd").click(); } });
    $("#billModal").on("click", "#btnCouponAdd", function (t) { t.preventDefault(); ApplyCoupon(); });
    //$(document).on("click", "#btnAddItem", function (t) { t.preventDefault(); ProductModal(); });
    //$("#billModal").on("change", ".ddlTempProductFooter", function (t) { t.preventDefault(); ProductModalItemRow(); });
    $(document).on("blur", "#txtshipzipcode", function (t) { t.preventDefault(); GetTaxRate(); });
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
    //$.ajax({
    //    type: "POST", url: '/Orders/GetNewOrderNo', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
    //    success: function (result) {
    //        $('#hfOrderNo').val(result.message); $('#lblOrderNo').text('Order #' + result.message + ' detail ');
    //    },
    //    error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
    //    async: false
    //});
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
            error: function (XMLHttpRequest, textStatus, errorThrown) { $('.billinfo').prop("disabled", true); swal('Alert!', errorThrown, "error"); },
            complete: function () { $('.billinfo').prop("disabled", false); },
            async: false
        });
        GetTaxRate();
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
    var opt = { strValue1: $("#txtshipzipcode").val(), strValue2: $("#txtshipcity").val(), strValue3: $("#ddlshipcountry").val() };
    $.ajax({
        type: "POST", url: '/Orders/GetTaxRate', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
        success: function (result) { $('#hfTaxRate').val(result.message); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Post and Post Meta ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getPostMeta() {
    var oid = $('#hfOrderNo').val();
    var postMetaxml = [];
    postMetaxml.push(
        { post_id: oid, meta_key: '_order_key', meta_value: 'wc_order_' }, { post_id: oid, meta_key: '_customer_user', meta_value: '1' },
        { post_id: oid, meta_key: '_payment_method', meta_value: 'cod' }, { post_id: oid, meta_key: '_payment_method_title', meta_value: 'cash on delivery' },
        { post_id: oid, meta_key: '_customer_ip_address', meta_value: '::1' }, { post_id: oid, meta_key: '_customer_user_agent', meta_value: '0' },
        { post_id: oid, meta_key: '_created_via', meta_value: 'checkout' }, { post_id: oid, meta_key: '_cart_hash', meta_value: '0' },
        { post_id: oid, meta_key: '_billing_first_name', meta_value: $('#txtbillfirstname').val() }, { post_id: oid, meta_key: '_billing_last_name', meta_value: $('#txtbilllastname').val() },
        { post_id: oid, meta_key: '_billing_address_1', meta_value: $('#txtbilladdress1').val() }, { post_id: oid, meta_key: '_billing_address_2', meta_value: $('#txtbilladdress2').val() },
        { post_id: oid, meta_key: '_billing_city', meta_value: $('#txtbillcity').val() }, { post_id: oid, meta_key: '_billing_state', meta_value: $('#ddlbillstate').val() },
        { post_id: oid, meta_key: '_billing_postcode', meta_value: $('#txtbillzipcode').val() }, { post_id: oid, meta_key: '_billing_country', meta_value: $('#ddlbillcountry').val() },
        { post_id: oid, meta_key: '_billing_email', meta_value: $('#txtbillemail').val() }, { post_id: oid, meta_key: '_billing_phone', meta_value: $('#txtbillphone').val() },
        { post_id: oid, meta_key: '_order_currency', meta_value: 'USD' }, { post_id: oid, meta_key: '_cart_discount', meta_value: '0' },
        { post_id: oid, meta_key: '_cart_discount_tax', meta_value: '0' }, { post_id: oid, meta_key: '_order_shipping', meta_value: '0' },
        { post_id: oid, meta_key: '_order_shipping_tax', meta_value: '0' }, { post_id: oid, meta_key: '_order_tax', meta_value: '0' },
        { post_id: oid, meta_key: '_order_version', meta_value: '0' }, { post_id: oid, meta_key: '_prices_include_tax', meta_value: 'no' },
        { post_id: oid, meta_key: '_shipping_address_index', meta_value: '' }, { post_id: oid, meta_key: 'is_vat_exempt', meta_value: 'no' },
        { post_id: oid, meta_key: '_download_permissions_granted', meta_value: 'yes' }, { post_id: oid, meta_key: '_recorded_sales', meta_value: 'yes' },
        { post_id: oid, meta_key: '_recorded_coupon_usage_counts', meta_value: 'yes' }, { post_id: oid, meta_key: '_order_stock_reduced', meta_value: 'yes' },
        { post_id: oid, meta_key: '_edit_lock', meta_value: '1' }, { post_id: oid, meta_key: '_shipping_first_name', meta_value: $('#txtshipfirstname').val() },
        { post_id: oid, meta_key: '_shipping_last_name', meta_value: $('#txtshiplastname').val() }, { post_id: oid, meta_key: '_shipping_address_1', meta_value: $('#txtshipaddress1').val() },
        { post_id: oid, meta_key: '_shipping_address_2', meta_value: $('#txtshipaddress2').val() }, { post_id: oid, meta_key: '_shipping_city', meta_value: $('#txtshipcity').val() },
        { post_id: oid, meta_key: '_shipping_state', meta_value: $('#ddlshipstate').val() }, { post_id: oid, meta_key: '_shipping_postcode', meta_value: $('#txtshipzipcode').val() },
        { post_id: oid, meta_key: '_shipping_country', meta_value: $('#ddlshipcountry').val() }, { post_id: oid, meta_key: '_shipping_email', meta_value: '' },
        { post_id: oid, meta_key: '_shipping_phone', meta_value: '' }, { post_id: oid, meta_key: '_order_tax', meta_value: $('salesTaxTotal').html() }, { post_id: oid, meta_key: '_order_total', meta_value: $('orderTotal').html() }
    );
    return postMetaxml;
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
    myHtml += '<input class="form-control number" type="text" id="txt_Coupon" name="txt_Coupon" placeholder="Coupon Code" maxlength="25">';
    myHtml += '</div > ';
    myHtml += '<div class="modal-footer">';
    myHtml += '<button type="button" class="btn btn-primary" id="btnCouponAdd">Add</button>';
    myHtml += '</div>';
    myHtml += '</div>';
    myHtml += '</div>';
    $("#billModal").empty().html(myHtml);
    $("#billModal").modal({ backdrop: 'static' }); $("#txt_Coupon").focus();
}
function ApplyCoupon() {
    if ($('#txt_Coupon').val() == '') { swal('Alert!', 'Please enter Coupon Code!', "info").then((result) => { return false; });}
    var obj = { strValue1: $('#txt_Coupon').val() };
    $.ajax({
        type: "POST", url: '/Orders/GetCouponAmount', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        success: function (result) {
            var data = JSON.parse(result); console.log(data);
            bindCouponList(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });
    //$("#billModal").modal({ backdrop: 'static' }); $("#txt_Coupon").focus();
}
function bindCouponList(data) {
    var layoutHtml = '';
    if (data.length > 0) {
        if ($('#li_' + data[0].post_title).length <= 0) {
            layoutHtml += '<li id="li_' + data[0].post_title + '" data-couponamt= "' + data[0].coupon_amount + '" data-disctype= "' + data[0].discount_type + '">';
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
            swal('Alert!', 'Coupon code already applied!', "info").then((result) => { return false; });
        }
        $('#billCoupon').append(layoutHtml);

        var tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00;
        var zCouponAmt = parseFloat(data[0].coupon_amount) || 0.00, zDiscType = data[0].discount_type, zTotalQty = 1, zQty = 0.00, zGrossAmount = 0.00, zDisAmt = 0.00, zProductIDs = data[0].product_ids.split(',');
        var isUsedAll = data[0].product_ids.length > 0 ? 0 : 1; zTotalQty = parseFloat($('#totalQty').text()) || 0.00;
        if (zDiscType == 'fixed_cart') { zCouponAmt = (zCouponAmt / zTotalQty); }
        $("#tblAddItemFinal > tbody  > tr").each(function () {
            if (jQuery.inArray($(this).data("vid").toString(), zProductIDs) == -1 && isUsedAll == 0) {
                swal('Alert!', 'Sorry, this coupon is not applicable to selected products.', "info").then((result) => { return false; });
            }
            else {
                zQty = parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00;
                zGrossAmount = parseFloat($(this).find(".TotalAmount").data("amount")) || 0.00;
                $(this).find(".RowDiscount").data("disctype", zDiscType);
                $(this).find(".RowDiscount").data("couponamt", zCouponAmt);
                if (zDiscType == 'fixed_product') { zDisAmt = zCouponAmt * zQty; }
                else if (zDiscType == 'fixed_cart') { zDisAmt = zCouponAmt * zQty; }
                else if (zDiscType == 'percent') { zDisAmt = (zGrossAmount * zCouponAmt) / 100; }
                $(this).find(".RowDiscount").text(zDisAmt.toFixed(2)); $(this).find(".TotalAmount").data("discount", zDisAmt.toFixed(2));

                //Taxation                     
                zTotalTax = (((zGrossAmount - zDisAmt) * tax_rate) / 100);
                $(this).find(".RowTax").text(zTotalTax.toFixed(2)); $(this).find(".TotalAmount").data("taxamount", zTotalTax.toFixed(2));
                calcFinalTotals();
            }
        });
        $("#billModal").modal('hide');
    }
    else {
        var msg = 'Coupon "' + obj.strValue1 + '" does not exist!';
        swal('Alert!', msg, "info");
    }
}
function removeCouponInList(id) {
    //------------- Remove data in Temp AddItemList-----
    swal({ title: "Are you sure?", text: 'Would you like to Remove this Coupon?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) {
                var tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00;
                var zCouponAmt = 0.00, zDiscType = 'fixed_product', zGrossAmount = 0.00, zDisAmt = 0.00;
                $("#tblAddItemFinal > tbody  > tr").each(function () {
                    zQty = parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00;
                    zGrossAmount = parseFloat($(this).find(".TotalAmount").data("amount")) || 0.00;
                    $(this).find(".RowDiscount").data("disctype", zDiscType);
                    $(this).find(".RowDiscount").data("couponamt", zCouponAmt);
                    $(this).find(".RowDiscount").text(zDisAmt.toFixed(2)); $(this).find(".TotalAmount").data("discount", zDisAmt.toFixed(2));

                    //Taxation                     
                    zTotalTax = (((zGrossAmount - zDisAmt) * tax_rate) / 100);
                    $(this).find(".RowTax").text(zTotalTax.toFixed(2)); $(this).find(".TotalAmount").data("taxamount", zTotalTax.toFixed(2));
                    calcFinalTotals();
                });
                $('#li_' + id).remove();
            }
        });
}

///Add Modal Product
function ProductModal() {
    var myHtml = '';
    //header
    myHtml += '<div class="modal-dialog">';
    myHtml += '<div class="modal-content">';
    myHtml += '<div class="modal-header">';
    myHtml += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    myHtml += '<h4 class="modal-title" id="myModalLabel">Add products</h4>';
    myHtml += '</div>';
    myHtml += '<div class="modal-body">';
    myHtml += '<table class="stable" width="100%"><thead><tr><th>Product</th><th>Quantity</th></tr >';
    myHtml += '<tbody></tbody><tfoot>';
    myHtml += '<tr>';
    myHtml += '<td style="border-bottom: 1px solid #EEE;width: 80%;">';
    myHtml += '<select class="form-control select2 ddlTempProductFooter" id="ddlTempProduct" placeholder="Select Products" style="width: 95%;"></select>';
    myHtml += '</td> ';
    myHtml += '<td style="text-align:right; border-bottom: 1px solid #EEE;width: 20%;">';
    myHtml += '<input class="number" type="number" id="txt_TempQty_1" value="1" name="txt_TempQty" placeholder="Qty">';
    myHtml += '</td>';
    myHtml += '</tr></tfoot></table>';
    myHtml += '</div > ';
    myHtml += '<div class="modal-footer">';
    myHtml += '<button type="button" class="btn btn-primary" id="btnAddItemFinal">Add</button>';
    myHtml += '</div>';
    myHtml += '</div>';
    myHtml += '</div>';
    $("#billModal").empty().html(myHtml);

    $('.ddlTempProductFooter').select2({
        allowClear: true, minimumInputLength: 1, placeholder: "Search Product",
        ajax: {
            url: '/Orders/GetProductList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.post_title, name: item.post_title, id: item.r_id } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
    $("#billModal").modal({ backdrop: 'static' });
}
///Add Modal Product selected add row
function ProductModalItemRow() {
    var myHtml = '';
    //console.log($('.ddlTempProductFooter').select2('data'));
    var id = $('.ddlTempProductFooter').val(), text = $(".ddlTempProductFooter option:selected").text();
    if (id == null) return false;
    myHtml += '<tr>';
    myHtml += '<td style="border-bottom: 1px solid #EEE;width: 80%;">';
    myHtml += '<select class="form-control select2 ddlTempProduct" id="ddlTempProduct_2" placeholder="Select Products" style="width: 95%;">';
    myHtml += '<option value="' + id + '">' + text + '</option>';
    myHtml += '</select > ';
    myHtml += '</td> ';
    myHtml += '<td style="text-align:right; border-bottom: 1px solid #EEE;width: 20%;">';
    myHtml += '<input class="form-control number" type="number" id="txt_TempQty_1" value="1" name="txt_TempQty" placeholder="Qty">';
    myHtml += '</td>';
    myHtml += '</tr>';
    $('.ddlTempProductFooter').val('').trigger('change');
    $('#billModal tbody').append(myHtml);

    $('.ddlTempProduct').select2({
        allowClear: true, minimumInputLength: 1, placeholder: "Search Product",
        ajax: {
            url: '/Orders/GetProductList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.post_title, name: item.post_title, id: item.r_id } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
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
            itemsDetailsxml.push({
                "PKey": data.product_id + '_' + data.variation_id, "product_id": data.product_id, "variation_id": data.variation_id, "product_name": data.product_name, "quantity": 1, "sale_rate": data.sale_price, "total": (data.sale_price * 1.0), "discount": 0, "tax_amount": (((data.sale_price * 1.0) * tax_rate) / 100).toFixed(2)
            });
            bindItemListDataTable(itemsDetailsxml);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });

}
//-----bind Item Table ---------------------------
function bindItemListDataTable(data) {
    var layoutHtml = '';
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].product_id > 0) {
                if ($('#tritemId_' + data[i].PKey).length <= 0) {
                    layoutHtml += '<tr id="tritemId_' + data[i].PKey + '" data-id="' + data[i].PKey + '" data-pid="' + data[i].product_id + '" data-vid="' + data[i].variation_id + '">';
                    layoutHtml += '<td class="text-center"><a class="btn menu-icon-gr vd_red btnDeleteItem billinfo" tabitem_itemid="' + data[i].PKey + '" onclick="removeItemsInTable(\'' + data[i].PKey + '\');"> <i class="glyphicon glyphicon-trash"></i> </a></td>';
                    layoutHtml += '<td>' + data[i].product_name + '</td>';
                    layoutHtml += '<td class="text-right">' + data[i].sale_rate + '</td>';
                    layoutHtml += '<td><input class="form-control billinfo number rowCalulate" type="number" id="txt_ItemQty_' + data[i].PKey + '" value="' + data[i].quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
                    layoutHtml += '<td class="TotalAmount text-right" data-salerate="' + data[i].sale_rate + '" data-discount="' + data[i].discount + '" data-amount="' + data[i].total + '" data-taxamount="' + data[i].tax_amount + '">' + data[i].total + '</td>';
                    layoutHtml += '<td class="text-right RowDiscount" data-disctype="-" data-couponamt="0">' + data[i].discount + '</td>';
                    layoutHtml += '<td class="text-right RowTax">' + data[i].tax_amount + '</td>';
                    layoutHtml += '</tr>';
                }
                else {
                    $('#txt_ItemQty_' + data[i].rd_id).val(roundToTwo(parseFloat($('#txt_ItemQty_' + data[i].PKey).val()) + 1).toFixed(2));
                    calcRowAmount($('#txt_ItemQty_' + data[i].rd_id), $($('#txt_ItemQty_' + data[i].PKey)).parents('tr')[0]);
                }
            }
        }
        $('#tblAddItemFinal tbody').append(layoutHtml);
        //$("#txt_ItemSearch").val('');
        //$('.number').numeric({ allowThouSep: false, maxDecimalPlaces: 2 });
        // Bind calcLineAmount function to each textbox and send parent TR
        //$("#divAddItemFinal").find(".rowCalulate").blur(function () { calcRowAmount(this, $(this).parents('tr')[0]); });
        $("#divAddItemFinal").find(".rowCalulate").change(function () { calcRowAmount(this, $(this).parents('tr')[0]); });
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
    calcFinalTotals();
}

//-----Remove row in Itemtable Table--------------
function removeItemsInTable(id) {
    //------------- Remove data in Temp AddItemList-----
    swal({ title: "Are you sure?", text: 'Would you like to Remove this Item?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) { $('#tritemId_' + id).remove(); }
        });
}

//------ Calculate Rows Amount --------------------------------
function calcRowAmount(objControl, objRow) // objRow is row object
{
    var zMRP = 0.00, zQty = 0.00, zDiscType = 'fixed_product', zCouponAmt = 0.00, zDisAmt = 0.00, tax_rate = 0.00, zTotalTax = 0.00;

    zMRP = parseFloat($(objRow).find(".TotalAmount").data("salerate")) || 0.00;
    zQty = parseFloat($(objRow).find("[name=txt_ItemQty]").val());
    /// Gross Amount
    var zGrossAmount = zMRP * zQty;
    // Discount
    zDiscType = $(objRow).find(".RowDiscount").data("disctype");
    zCouponAmt = parseFloat($(objRow).find(".RowDiscount").data("couponamt")) || 0;
    if (zDiscType == 'fixed_product') { zDisAmt = zCouponAmt * zQty; }
    else if (zDiscType == 'fixed_cart') { zDisAmt = zCouponAmt * zQty; }
    else if (zDiscType == 'percent') { zDisAmt = (zGrossAmount * zCouponAmt) / 100; }
    $(objRow).find(".RowDiscount").text(zDisAmt.toFixed(2)); $(objRow).find(".TotalAmount").data("discount", zDisAmt.toFixed(2));

    $(objRow).find(".TotalAmount").text((zGrossAmount).toFixed(2)); $(objRow).find(".TotalAmount").data("amount", zGrossAmount.toFixed(2));
    zGrossAmount = zGrossAmount - zDisAmt;

    //Taxation 
    tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00
    zTotalTax = ((zGrossAmount * tax_rate) / 100);

    $(objRow).find(".RowTax").text(zTotalTax.toFixed(2)); $(objRow).find(".TotalAmount").data("taxamount", zTotalTax.toFixed(2));
    calcFinalTotals();
}
function calcFinalTotals() {
    //TTotal
    var zQty = 0.00, zGAmt = 0.00, zTDiscount = 0.00, zTotalTax = 0.00;
    var rowCount = $('#tblAddItemFinal >tbody >tr').length;
    $("#tblAddItemFinal > tbody  > tr").each(function () {
        zQty = zQty + (parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00);
        zGAmt = zGAmt + parseFloat($(this).find(".TotalAmount").data("amount"));
        zTDiscount = zTDiscount + parseFloat($(this).find(".TotalAmount").data("discount"));
        zTotalTax = zTotalTax + parseFloat($(this).find(".TotalAmount").data("taxamount"));
    });
    $("#totalQty").text(zQty.toFixed(2));
    $("#SubTotal").text(zGAmt.toFixed(2));
    $("#discountTotal").text(zTDiscount.toFixed(2));
    $("#salesTaxTotal").text(zTotalTax.toFixed(2));
    //$("#ts_con").text(zTotalTax.toFixed(2));
    //$("#total-payable").text((zGAmt - zTDiscount + zTotalTax).toFixed(2));
    $("#orderTotal").html((zGAmt - zTDiscount + zTotalTax).toFixed(2));
}