$(document).ready(function () {
    $('.billinfo,.billnote').prop("disabled", true);
    $("#txtbillphone").mask("(999) 999-9999");
    CategoryWiseProducts();
    $(".addnvar,.addnvar-qty").change(function (t) {
        t.preventDefault(); let $row = $(this).parent(); let vr = $row.find('.addnvar').val().split('-');
        let regular_price = parseFloat(vr[1]) || 0.00, price = parseFloat(vr[2]) || 0.00, qty = parseFloat($row.find('.addnvar-qty').val()) || 0.00;
        $row.find('.hub-pro-price').html('<span>$' + (price * qty).toFixed(2) + '<span>$' + (regular_price * qty).toFixed(2) + '</span></span>')
    });
    $(".agentaddtocart").click(function (t) {
        t.preventDefault(); let $row = $(this).parent(); let vr = $row.find('.addnvar').val().split('-');
        let pid = parseInt($row.data('proid')) || 0, vid = parseInt(vr[0]) || 0, cid = parseInt($('#ddlUser').val()) || 0, qty = parseFloat($row.find('.addnvar-qty').val()) || 0.00;
        if (cid <= 0) { swal('Alert!', 'Please Select Customer.', "error").then((result) => { $('#ddlUser').select2('open'); return false; }); return false; }
        getItemList(pid, vid, qty);
    });
    $('#txtLogDate').daterangepicker({ singleDatePicker: true, autoUpdateInput: true, locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' } });
    $(".select2").select2(); BindStateCounty("ddlbillstate", { id: 'US' }); BindStateCounty("ddlshipstate", { id: 'US' });
    $("#ddlUser").select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Search Customer",
        ajax: {
            url: '/Orders/GetCustomerList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.displayname + ' [' + item.billing_phone + ']', name: item.displayname + ' [' + item.billing_phone + ']', id: item.id } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
    $("#ddlUser").change(function () { setTimeout(function () { NewOrderNo(); CustomerAddress($("#ddlUser").val()); }, 50); return false; });
    $("#ddlbillcountry").change(function () { var obj = { id: $("#ddlbillcountry").val() }; BindStateCounty("ddlbillstate", obj); });
    $("#ddlshipcountry").change(function () { var obj = { id: $("#ddlshipcountry").val() }; BindStateCounty("ddlshipstate", obj); });
    $("#ddlshipstate").change(function (t) {
        t.preventDefault(); $.when(GetTaxRate()).done(function () { getItemShippingCharge(true); });
    });
    $("#ddlStatus").change(function (t) {
        t.preventDefault();
        if ($(this).val() == 'wc-on-hold') {
            $('.releasedate').empty().append('<label data-toggle="tooltip" title="Order release date">What day would you like your order to ship?*</label><div class= "input-group"><span class="input-group-addon"><i class="fa fa-calendar"></i></span><input id="txtReleaseDate" class="form-control"></div>');
            $('#txtReleaseDate').daterangepicker({ singleDatePicker: true, minDate: moment($('#txtLogDate').val(), "MM/DD/YYYY").add(7, 'd'), autoUpdateInput: true, locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' } });
        }
        else { $('.releasedate').empty(); }
    });
    $(document).on("click", "#btnApplyCoupon", function (t) { t.preventDefault(); CouponModal(); });
    //$("#billModal").on("keypress", function (e) { if (e.which == 13 && e.target.type != "textarea") { $("#btnCouponAdd").click(); } });
    $("#billModal").on("click", "#btnCouponAdd", function (t) { t.preventDefault(); ApplyCoupon(); });
    $(document).on("blur", "#txtbillzipcode", function (t) { t.preventDefault(); GetCityByZip($(this).val(), $("#txtbillcity"), $("#ddlbillstate"), $("#ddlbillcountry")); });
    $(document).on("blur", "#txtshipzipcode", function (t) { t.preventDefault(); $("#loader").show(); GetCityByZip($(this).val(), $("#txtshipcity"), $("#ddlshipstate"), $("#ddlshipcountry")); });
    $(document).on("click", "#btnCheckout", function (t) { t.preventDefault(); saveCO(); });
    $(document).on("click", "#btnpay", function (t) { t.preventDefault(); PaymentModal(); });
    $("#billModal").on("click", "#btnPlaceOrder", function (t) { t.preventDefault(); AcceptPayment(); });
    $("#billModal").on("click", "#btnNewOrder", function (t) { t.preventDefault(); window.location.href = window.location.origin + "/Orders/OrdersHistory"; });
    /*Start New order Popup function*/
    $(document).on("click", "#btnSearch", function (t) {
        t.preventDefault(); $("#loader").show();
        $('.page-heading').text('Add New Order'); searchOrderModal();
        let cus_id = parseInt($("#ddlUser").val()) || 0, cus_text = $("#ddlUser option:selected").text();
        if (cus_id > 0) {
            $("#ddlCustomerSearch").empty().append('<option value="' + cus_id + '" selected>' + cus_text + '</option>');
            bindCustomerOrders(cus_id);
        }
        $("#loader").hide();
    });
    $(document).on("click", ".btnEditOrder", function (t) {
        t.preventDefault(); $("#loader").show(); //$('#ddlStatus').prop("disabled", true); 
        $('#ddlStatus,.billinfo').prop("disabled", false); $('#txtbillfirstname').focus(); $('.agentaddtocart').removeClass('hidden');
        $('.box-tools-header').empty().append('<button type="button" class="btn btn-danger btnOrderUndo" data-toggle="tooltip" title="Reset Order"><i class="fa fa-undo"></i> Cancel</button> <button type="button" id="btnOrderUpdate" class="btn btn-danger" data-toggle="tooltip" title="Update Order"><i class="far fa-save"></i> Update</button>');
        $('.footer-finalbutton').empty().append('<button type="button" class="btn btn-danger pull-left btnOrderUndo"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" id="btnCheckout" class="btn btn-danger billinfo" data-toggle="tooltip" title="Save and Checkout Order"> Checkout</button>');
        $('.view-addmeta').empty().append('<button class="btn btn-danger btn-xs billinfo add_order_item_meta">Add&nbsp;meta</button>');
        $("#loader").hide(); isEdit(true);
    });
    $(document).on("click", ".btnOrderUndo", function (t) { t.preventDefault(); $("#loader").show(); getOrderInfo(); isEdit(false); });
    $(document).on("click", "#btnOrderUpdate", function (t) { t.preventDefault(); updateCO(); });
    $('#billModal').on('shown.bs.modal', function () {
        $('#ddlCustomerSearch').select2({
            dropdownParent: $("#billModal"), allowClear: true, minimumInputLength: 3, placeholder: "Search Customer",
            language: { noResults: function () { return $("<a id='btnaddcustomer' href='javascript:;'>Add Customer</a>"); } },
            ajax: {
                url: '/Orders/GetCustomerList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
                data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
                processResults: function (data, page) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.displayname + ' [' + item.billing_phone + ']', id: item.id } }) }; },
                error: function (xhr, status, err) { }, cache: true
            }
        });
    });
    getOrderInfo();
    $("#billModal").on("click", "#btnSelectDefaltAddress", function (t) {
        t.preventDefault();
        let cus_id = parseInt($("#ddlCustomerSearch").val()) || 0, cus_text = $("#ddlCustomerSearch option:selected").text();
        var oid = parseInt($('#hfOrderNo').val()) || 0;
        if (cus_id > 0) {
            $("#ddlUser").empty().append('<option value="' + cus_id + '" selected>' + cus_text + '</option>');
            if (oid == 0) {
                setTimeout(function () { NewOrderNo(); }, 50);
            }
            $("#billModal").modal('hide'); CustomerAddress(cus_id); return false;
        }
        else {
            swal('Alert!', 'Please Search Customer.', "info").then((result) => { $('#ddlCustomerSearch').select2('open'); return false; }); return false;
        }
    });
    $("#billModal").on("change", "#ddlCustomerSearch", function (t) {
        t.preventDefault();
        let cus_id = parseInt($("#ddlCustomerSearch").val()) || 0;
        if (cus_id > 0)
            bindCustomerOrders(cus_id);
        else
            $('#tblCusOrders').dataTable().fnClearTable();
    });
    $("#billModal").on("click", "#btnaddcustomer", function (t) {
        t.preventDefault();
        let cus_text = $("#ddlCustomerSearch").data("select2").dropdown.$search.val();
        $("#billModal").modal('hide'); addCustomerModal(cus_text);
    });
    $("#billModal").on("change", "#txtBillingCountry", function (t) { t.preventDefault(); var obj = { id: $(this).val() }; BindStateCounty("txtBillingState", obj); });
    $("#billModal").on("click", "#btnBackSearchCusrtomer", function (t) {
        t.preventDefault(); $("#billModal").modal('hide'); searchOrderModal();
    });
    $("#billModal").on("blur", "#ddlCusBillingCountry,#ddlCusBillingState", function (t) { t.preventDefault(); $("#txtCusBillingPostCode").val(''); });
    $("#billModal").on("click", "#btnSaveCustomer", function (t) {
        t.preventDefault(); saveCustomer();
    });
    $("#billModal").on("change", "#ddlPaymentMethod", function (t) {
        t.preventDefault();
        if ($("#ddlPaymentMethod").val() == "podium") { $('.podiumchannel').removeClass('hidden'); }
        else { $('.podiumchannel').addClass('hidden'); }
    });
    /*end New order Popup function*/
    /*Start Return Items*/
    $(document).on("click", "#btnAddFee", function (t) { t.preventDefault(); AddFeeModal(0, ''); });
    $(document).on("click", "#btnApplyFee", function (t) { t.preventDefault(); $("#loader").show(); ApplyFee($(this).data('orderitemid'), $('#txt_FeeAmt').val()); });
    /*End Return Items*/
    $(document).on("click", "#btnAddnote", function (t) { t.preventDefault(); AddNotes(); });
    $(document).on("click", "#btnPrintPdf", function (t) {
        t.preventDefault();
        let pay_mode = $('#lblOrderNo').data('pay_by'), pay_id = $('#lblOrderNo').data('pay_id');
        pay_mode = pay_mode.includes("ppec_paypal") ? "PayPal" : pay_mode.includes("podium") ? "Podium" : pay_mode;
        successModal(pay_mode, pay_id, false);
    });
    /*start add order item meta*/
    $(document).on("click", ".add_order_item_meta", function (t) {
        t.preventDefault(); let $item = $(this).closest('tr');
        let meta_list = $item.data('meta_data');
        AddItemMetaModal($item.data('id'), $item.data('orderitemid'), meta_list);
    });
    $("#billModal").on("click", ".btnmeta_delete", function (t) { t.preventDefault(); $(this).closest('tr').addClass('hidden'); });
    $("#billModal").on("click", ".btnmeta_add", function (t) {
        t.preventDefault();
        let trHtml = '<tr><td style="width:45%"><input class="form-control" id="txt_key" value="" name="txt_key" placeholder="Name"></td>';
        trHtml += '<td style = "width:45%"><input class="form-control" id="txt_value" value="" name="txt_value" placeholder="Value"></td>';
        trHtml += '<td style="width:10%"><button class="btn menu-icon-gr text-red btnmeta_delete"> <i class="glyphicon glyphicon-trash"></i></button></td></tr > ';
        $('#order_items_meta').append(trHtml);
    });
    $("#billModal").on("click", "#btnmeta_ok", function (t) {
        t.preventDefault(); let row_id = $(this).data('id'), _item_id = parseInt($(this).data('itemid')) || 0, meta_list = [], dis_list = [];
        let _status = false;
        $('#order_items_meta > tr').each(function (index, tr) {
            let _id = parseInt($(tr).data('id')) || 0, _key = $(tr).find("[name=txt_key]").val().replace(/\s+/g, "_"), _value = $(tr).find("[name=txt_value]").val();
            if (!$(tr).is(":hidden")) {
                if (_key == '') { swal('Alert!', 'Please enter meta name.', "info").then((result) => { $(tr).find("[name=txt_key]").focus(); return false; }); _status = false; return false; }
                else if (_value == '') { swal('Alert!', 'Please enter meta value.', "info").then((result) => { $(tr).find("[name=txt_value]").focus(); return false; }); _status = false; return false; }
                meta_list.push({ id: _id, item_id: _item_id, key: '_system_' + _key, value: _value });
                dis_list.push({ id: _id, item_id: _item_id, key: _key, value: _value });
            }
            else { meta_list.push({ id: _id, item_id: _item_id, key: '', value: '' }); }
            _status = true;
        });
        if (_status) {
            let _data = { _list: meta_list }; $(this).html("Please Wait"); $(this).attr('disabled', 'disabled');
            $.ajax({ method: 'post', url: '/Orders/SaveOrderProductMeta', data: _data }).done(function (result, textStatus, jqXHR) {
                if (result) { $('#tritemId_' + row_id).data('meta_data', dis_list); $("#billModal").modal('hide'); }
            }).fail(function (jqXHR, textStatus, errorThrown) { swal('Alert!', 'Something went wrong, please try again.', "error"); })
                .always(function () { $(this).html("Add"); $(this).removeAttr('disabled'); });
        }
    });
    /*start add order item meta*/
});
function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Get New Order No ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function NewOrderNo() {
    let cus_id = parseInt($("#ddlUser").val()) || 0, oid = 0, postMetaxml = [];
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
        { post_id: oid, meta_key: 'employee_id', meta_value: '0' }, { post_id: oid, meta_key: 'employee_name', meta_value: '' }
    );
    let option = { postsXML: JSON.stringify([]), order_statsXML: JSON.stringify([]), postmetaXML: JSON.stringify(postMetaxml) }; console.log(option);
    if (cus_id > 0) {
        ajaxFunction('/Orders/GetNewOrderNo', option, beforeSendFun, function (result) {
            result = JSON.parse(result);
            if (result[0].Response == "Success") { $('#hfOrderNo').val(result[0].id); $('#lblOrderNo').text('Order #' + result[0].id + ' detail '); }
            else { swal('Error', data[0].Response, "error"); }
        }, completeFun, errorFun, false);
        isEdit(true); $('.billnote').prop("disabled", false);
    }
}
///Find Address of Customer
function CustomerAddress(id) {
    //$("#ddlUser").val()
    let option = { strValue1: parseInt(id) || 0 };
    if (option.strValue1 > 0) {
        ajaxFunction('/Orders/GetCustomerAddress', option, function () { }, function (result) {
            var data = JSON.parse(result);
            for (var i = 0; i < data.length; i++) {
                ///billing_Details
                if (data[i].meta_key == 'billing_first_name') { $('#txtbillfirstname').val(data[i].meta_value); }
                else if (data[i].meta_key == 'billing_last_name') { $('#txtbilllastname').val(data[i].meta_value); }
                else if (data[i].meta_key == 'billing_company') { $('#txtbillcompany').val(data[i].meta_value); }
                else if (data[i].meta_key == 'billing_address_1') { $('#txtbilladdress1').val(data[i].meta_value); }
                else if (data[i].meta_key == 'billing_address_2') { $('#txtbilladdress2').val(data[i].meta_value); }
                else if (data[i].meta_key == 'billing_postcode') { $('#txtbillzipcode').val(data[i].meta_value); }
                else if (data[i].meta_key == 'billing_city') { $('#txtbillcity').val(data[i].meta_value); }
                else if (data[i].meta_key == 'billing_country') { $('#ddlbillcountry').val(data[i].meta_value.trim()).trigger('change'); }
                else if (data[i].meta_key == 'billing_state') { $('#ddlbillstate').val(data[i].meta_value).trigger('change'); }
                else if (data[i].meta_key == 'billing_email') { $('#txtbillemail').val(data[i].meta_value); }
                else if (data[i].meta_key == 'billing_phone') { $('#txtbillphone').val(data[i].meta_value.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3")); }
                ///shipping_Details
                else if (data[i].meta_key == 'shipping_first_name') { $('#txtshipfirstname').val(data[i].meta_value); }
                else if (data[i].meta_key == 'shipping_last_name') { $('#txtshiplastname').val(data[i].meta_value); }
                else if (data[i].meta_key == 'shipping_company') { $('#txtshipcompany').val(data[i].meta_value); }
                else if (data[i].meta_key == 'shipping_address_1') { $('#txtshipaddress1').val(data[i].meta_value); }
                else if (data[i].meta_key == 'shipping_address_2') { $('#txtshipaddress2').val(data[i].meta_value); }
                else if (data[i].meta_key == 'shipping_postcode') { $('#txtshipzipcode').val(data[i].meta_value); }
                else if (data[i].meta_key == 'shipping_city') { $('#txtshipcity').val(data[i].meta_value); }
                else if (data[i].meta_key == 'shipping_country') { $('#ddlshipcountry').val(data[i].meta_value.trim()).trigger('change'); }
                else if (data[i].meta_key == 'shipping_state') { $('#ddlshipstate').val(data[i].meta_value.trim()).trigger('change'); }
            }
        }, function () { $('.billinfo').prop("disabled", false); }, function (XMLHttpRequest, textStatus, errorThrown) { $('.billinfo').prop("disabled", true); alert(errorThrown); }, false);
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
function GetTaxRate() {
    ///Tax Calculate for state
    let tax_states = ["NY", "CA", "CO", "CT", "IL", "IN", "MI", "MS", "NC", "NE", "NJ", "NM", "PA", "TN", "TX", "WA", "AR", "FL", "GA", "IA", "MO", "OH", "SC", "WI"];
    let s_state = $("#ddlshipstate").val(), sub_total = parseFloat($("#ddlshipstate").val()) || 100, ship_total = parseFloat($("#shippingTotal").val()) || 0.00;
    if (tax_states.includes(s_state)) {
        var opt = {
            to_zip: $("#txtshipzipcode").val(), to_street: $("#txtshipaddress1").val(), to_city: $("#txtshipcity").val(), to_state: s_state, to_country: $("#ddlshipcountry").val(), amount: sub_total, shipping: ship_total
        };
        if (opt.to_zip.length <= 0 || opt.to_city.length <= 0 || opt.to_country.length <= 0) { $('#hfTaxRate').val(0); $('#hfFreighttaxable').val(false); }
        else { ajaxFunction('/Orders/GetTaxAmounts', opt, function () { }, function (res) { $('#hfTaxRate').val(res.rate); $('#hfFreighttaxable').val(res.freight_taxable); }, function () { }, function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); }, false); }
    }
    else { $('#hfTaxRate').val(0.00); $('#hfFreighttaxable').val(false); }
    //calculateDiscountAcount();
}
function GetSRTaxRate() {
    let tax_states = ["CT", "RI"], s_state = $("#ddlshipstate").val();
    if (tax_states.includes(s_state)) {
        var opt = {
            strValue1: $("#txtshipzipcode").val(), strValue2: $("#txtshipaddress1").val(), strValue3: $("#txtshipcity").val(), strValue4: s_state, strValue5: $("#ddlshipcountry").val()
        };
        $.post('/Orders/GetTaxRate', opt).then(response => { console.log(response); $('#hfTaxRate').data('srfee', response.rate); });
    }
    else { $('#hfTaxRate').data('srfee', 0.00); }
    //calculateDiscountAcount();
}
function CategoryWiseProducts() {
    let option = { strValue1: 'category' }, strHTML = ''; $("#category_items").empty();
    $.ajax({
        type: "get", url: '/Orders/GetCategoryWiseProducts', contentType: "application/json; charset=utf-8", dataType: "json", data: option,
        beforeSend: function () { $("#loader").show(); },
        success: function (result) {
            try {
                result = JSON.parse(result);
                result = groupArrayOfObjects(result, 'term_order');
                $.each(result, function (key, pr) {
                    strHTML = '<div class="hub-accord col-sm-12 wow animate__slideInLeft" data-wow-duration="1s" data-wow-delay=".5s">';
                    strHTML += '<h5><span>' + pr[0].name.toUpperCase() + '</span><i aria-hidden="true" class="fa fa-plus"></i></h5>';
                    strHTML += '<div class="hub-box-open">';
                    $.each(pr, function (index, data) {
                        try {
                            let variation_details = JSON.parse(data.variation_details);
                            let regular_price = 0.00, price = 0.00;
                            strHTML += '<div class="hub-pro-box"><h2>' + data.post_title.toUpperCase() + '</h2>';
                            strHTML += '<div data-proid="' + data.pr_id + '" class="hub-pro-shop">';
                            strHTML += '<select class="form-control addnvar">';
                            $(variation_details).each(function (pvIndex, pvRow) {
                                if (pvIndex == 0) regular_price = parseFloat(pvRow._regular_price) || 0.00, price = parseFloat(pvRow._price) || 0.00;
                                if (isNullAndUndef(pvRow.vr_id)) {
                                    //if (pr[0].name.toUpperCase() == 'MATTRESS' && pvRow.vr_title.includes('Queen'))
                                    if (pvRow.vr_title.includes('Queen')) {
                                        strHTML += '<option value="' + pvRow.vr_id + '-' + pvRow._regular_price + '-' + pvRow._price + '" selected>' + pvRow.vr_title + '</option>';
                                        regular_price = parseFloat(pvRow._regular_price) || 0.00, price = parseFloat(pvRow._price) || 0.00;
                                    }
                                    else strHTML += '<option value="' + pvRow.vr_id + '-' + pvRow._regular_price + '-' + pvRow._price + '">' + pvRow.vr_title + '</option>';
                                }
                                else strHTML += '<option value="0-0-0">No Variations</option>';
                            });
                            strHTML += '</select>';
                            strHTML += '<input min="1" class="form-control addnvar-qty" type="number" value="1" name="txt_ItemQty" placeholder="Qty">';
                            if (price < regular_price && regular_price > 0) strHTML += '<div class="hub-pro-price"><span>$' + price.toFixed(2) + '<span>$' + regular_price.toFixed(2) + '</span></span></div>';
                            else strHTML += '<div class="hub-pro-price"><span>$' + price.toFixed(2) + '</span></div>';
                            strHTML += '<a href="javascript://" class="agentaddtocart btn btn-danger hidden">Add to Cart</a>';
                            strHTML += '</div>';
                            strHTML += '</div>';
                        }
                        catch (error) { }
                    });
                    strHTML += '</div>';
                    strHTML += '</div>';
                    $("#category_items").append(strHTML);
                });
            }
            catch (error) { $("#loader").hide(); }
        },
        complete: function () { $("#loader").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); }, async: false
    });
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Search Customer Popup ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function searchOrderModal() {
    let modalHtml = '<div class="modal-dialog">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    modalHtml += '<h4 class="modal-title" id="myModalLabel">Search Customer</h4>';
    modalHtml += '</div>';
    modalHtml += '<div class="modal-body"></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#billModal").empty().html(modalHtml);

    modalHtml = '<div class="row nowrap-row">';
    modalHtml += '<div class="col-md-8">';
    modalHtml += '<div class="form-group"><select class="form-control select2" id="ddlCustomerSearch" placeholder="Select Customer Email" style="width: 100%;"></select></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    modalHtml += '<div class="row mt-1">';
    modalHtml += '<div class="col-md-12">';
    modalHtml += '<div class="table-responsive">';
    modalHtml += '<table id="tblCusOrders" class="table table-blue check-table table-bordered table-striped dataTable tablelist">';
    modalHtml += '<thead><tr><th style="width: 30%">No</th><th style="width: 35%">Billing Address</th><th style="width: 35%">Shipping Address</th></tr></thead>';
    modalHtml += '<tbody></tbody>';
    modalHtml += '</table>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    modalHtml += '</div>';

    $('#billModal .modal-body').append(modalHtml);
    $("#billModal").modal({ backdrop: 'static', keyboard: false });
}
function bindCustomerOrders(id) {
    let opt = { strValue1: parseInt(id) || 0 };
    let _address = [];
    $.post('/Orders/GetCustomersAddresssList', opt).then(response => {
        $('#tblCusOrders').dataTable({
            destroy: true, data: JSON.parse(response), order: [[0, "desc"]],
            columns: [
                {
                    data: 'customer_id', title: 'NO', sWidth: "30%",
                    render: function (data, type, dtrow, meta) {
                        //return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="ShowUseAddress(this);" value="' + $('<div/>').text(data).html() + '"><label></label>';
                        let row = JSON.parse(dtrow.meta_data);
                        let defval = '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="ShowUseAddress(this);" value="' + $('<div/>').text(data).html() + '"><label></label>';
                        let val = ' data-bfn="' + row._billing_first_name + '" data-bln="' + row._billing_last_name + '" data-bcom="' + (isNullAndUndef(row._billing_company) ? row._billing_company : '') + '" data-ba1="' + (isNullAndUndef(row._billing_address_1) ? row._billing_address_1 : '') + '" data-ba2="' + (isNullAndUndef(row._billing_address_2) ? row._billing_address_2 : '') + '" data-bc="' + row._billing_city + '" data-bs="' + row._billing_state + '" data-bct="' + row._billing_country + '" data-bpc="' + row._billing_postcode + '" data-bp="' + row._billing_phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '" data-bem="' + row._billing_email + '"';
                        val += ' data-sfn="' + row._shipping_first_name + '" data-sln="' + row._shipping_last_name + '" data-scom="' + (isNullAndUndef(row._shipping_company) ? row._shipping_company : '') + '" data-sa1="' + (isNullAndUndef(row._shipping_address_1) ? row._shipping_address_1 : '') + '" data-sa2="' + (isNullAndUndef(row._shipping_address_2) ? row._shipping_address_2 : '') + '" data-sc="' + row._shipping_city + '" data-ss="' + row._shipping_state + '" data-sct="' + row._billing_country + '" data-spc="' + row._shipping_postcode + '"';
                        return defval + ' <button type="button" id="btnUseAddress" class="btn btn-danger hidden" onclick="selectOrderAddress(this);" ' + val + '>Use This Address for Order</button>'
                    }
                },
                {
                    data: 'meta_data', title: 'BILLING ADDRESS', sWidth: "35%", render: function (data, type, dtrow) {
                        let row = JSON.parse(dtrow.meta_data);
                        let val = '<address class="no-margin">' + row._billing_first_name + ' ' + row._billing_last_name + (!isNullAndUndef(row.IsDefault) ? ' <span class="label label-success">' + dtrow.IsDefault + '</span>' : '') + (isNullUndefAndSpace(row._billing_company) ? '<br>' + row._billing_company : '') + (isNullUndefAndSpace(row._billing_address_1) ? '<br>' + row._billing_address_1 : '') + (isNullUndefAndSpace(row._billing_address_2) ? '<br>' + row._billing_address_2 : '') + '<br>' + row._billing_city + ', ' + row._billing_state + ' ' + row._billing_postcode + '<br>Phone: ' + row._billing_phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '<br>Email: ' + row._billing_email + '</address>';
                        return val;
                    }
                },
                {
                    data: 'shipping_first_name', title: 'SHIPPING ADDRESS', sWidth: "35%", render: function (data, type, dtrow) {
                        let row = JSON.parse(dtrow.meta_data);
                        let val = '<address class="no-margin">' + row._shipping_first_name + ' ' + row._shipping_last_name + (isNullUndefAndSpace(row._shipping_company) ? '<br>' + row._shipping_company : '') + (isNullUndefAndSpace(row._shipping_address_1) ? '<br>' + row._shipping_address_1 : '') + (isNullUndefAndSpace(row._shipping_address_2) ? '<br>' + row._shipping_address_2 : '') + '<br>' + row._shipping_city + ', ' + row._shipping_state + ' ' + row._shipping_postcode + '</address>';
                        return val;
                    }
                }
            ]
        });
    }).catch(err => { swal('Error!', err, 'error'); });

}
function ShowUseAddress(chk) {
    var isChecked = $(chk).prop("checked");
    $("[name='CheckSingle']").prop("checked", false);
    $("[name='CheckSingle']").parent().parent().find('#btnUseAddress').addClass('hidden');
    $(chk).prop("checked", isChecked);
    if (isChecked == false) $(chk).parent().parent().find('#btnUseAddress').addClass('hidden');
    else $(chk).parent().parent().find('#btnUseAddress').removeClass('hidden');
}
function selectOrderAddress(ele) {
    let cus_id = parseInt($("#ddlCustomerSearch").val()) || 0, cus_text = $("#ddlCustomerSearch option:selected").text();
    var oid = parseInt($('#hfOrderNo').val()) || 0;
    if (cus_id > 0) {
        $("#ddlUser").empty().append('<option value="' + cus_id + '" selected>' + cus_text + '</option>');
        if (oid == 0) { setTimeout(function () { NewOrderNo(); }, 50); }
        $("#billModal").modal('hide'); $('.billinfo').prop("disabled", false);
        ///billing_Details
        if ($(ele).data('bfn') != undefined) $('#txtbillfirstname').val($(ele).data('bfn'));
        if ($(ele).data('bln') != undefined) $('#txtbilllastname').val($(ele).data('bln'));
        if ($(ele).data('bcom') != undefined) $('#txtbillcompany').val($(ele).data('bcom'));
        if ($(ele).data('ba1') != undefined) $('#txtbilladdress1').val($(ele).data('ba1'));
        if ($(ele).data('ba2') != undefined) $('#txtbilladdress2').val($(ele).data('ba2'));
        if ($(ele).data('bpc') != undefined) $('#txtbillzipcode').val($(ele).data('bpc'));
        if ($(ele).data('bc') != undefined) $('#txtbillcity').val($(ele).data('bc'));
        if ($(ele).data('bct') != undefined) $('#ddlbillcountry').val($(ele).data('bct')).trigger('change');
        if ($(ele).data('bs') != undefined) $('#ddlbillstate').val($(ele).data('bs')).trigger('change');
        if ($(ele).data('bem') != undefined) $('#txtbillemail').val($(ele).data('bem'));
        if ($(ele).data('bp') != undefined) $('#txtbillphone').val($(ele).data('bp')); //$('#txtbillphone').val($('#txtbillphone').val().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3"));
        ///shipping_Details
        if ($(ele).data('sfn') != undefined) $('#txtshipfirstname').val($(ele).data('sfn'));
        if ($(ele).data('sln') != undefined) $('#txtshiplastname').val($(ele).data('sln'));
        if ($(ele).data('scom') != undefined) $('#txtshipcompany').val($(ele).data('scom'));
        if ($(ele).data('sa1') != undefined) $('#txtshipaddress1').val($(ele).data('sa1'));
        if ($(ele).data('sa2') != undefined) $('#txtshipaddress2').val($(ele).data('sa2'));
        if ($(ele).data('spc') != undefined) $('#txtshipzipcode').val($(ele).data('spc'));
        if ($(ele).data('sc') != undefined) $('#txtshipcity').val($(ele).data('sc'));
        if ($(ele).data('sct') != undefined) $('#ddlshipcountry').val($(ele).data('sct').trim()).trigger('change');
        if ($(ele).data('ss') != undefined) $('#ddlshipstate').val($(ele).data('ss').trim()).trigger('change');
    }
}
function addCustomerModal(cus_name) {
    let modalHtml = '';
    modalHtml += '<div class="modal-dialog modal-lg">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<div class="modal-header">';
    modalHtml += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    modalHtml += '<h4 class="modal-title" id="myModalLabel">Add Customer</h4>';
    modalHtml += '</div>';
    modalHtml += '<div class="modal-body" ></div>';
    modalHtml += '<div class="modal-footer">';
    modalHtml += '<button type="button" class="btn btn-primary" id="btnBackSearchCusrtomer"><i class="glyphicon glyphicon-arrow-left"></i> Back Search Customer</button>';
    modalHtml += '<button type="button" class="btn btn-danger" id="btnSaveCustomer"><i class="glyphicon glyphicon-floppy-saved"></i> Save Customer</button>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#billModal").empty().html(modalHtml);

    let myHtml = '';
    myHtml += '<div class="row">';
    myHtml += '<div class="col-md-4" >';

    myHtml += '<div class="form-group">';
    myHtml += '<label class="control-label " for="User Name">User Name/Email<span class="text-red">*</span></label>';
    myHtml += '<div class=""><input type="text" id="txtCusNickName" class="form-control" placeholder="User Name" value="' + cus_name + '"/></div>';
    myHtml += '</div>';

    //myHtml += '<div class="form-group">';
    //myHtml += '<label class="control-label " for="Email">Email<span class="text-red">*</span></label>';
    //myHtml += '<div class=""><input type="email" id="txtCusEmail" class="form-control" placeholder="Email" value="' + cus_name + '"/></div>';
    //myHtml += '</div>';

    myHtml += '<div class="form-group">';
    myHtml += '<label class="control-label " for="First Name">First Name<span class="text-red">*</span></label>';
    myHtml += '<div class=""><input type="text" id="txtCusFirstName" class="form-control" placeholder="First Name" /></div>';
    myHtml += '</div>';

    myHtml += '<div class="form-group">';
    myHtml += '<label class="control-label " for="Last Name">Last Name<span class="text-red">*</span></label>';
    myHtml += '<div class=""><input type="text" id="txtCusLastName" class="form-control" placeholder="Last Name" /></div>';
    myHtml += '</div>';

    myHtml += '<div class="form-group">';
    myHtml += '<label class="control-label " for="Contact No.">Contact No.<span class="text-red">*</span></label>';
    myHtml += '<div class=""><input type="tel" id="txtCusBillingMobile" class="form-control" placeholder="Contact No."  maxlength="11"/></div>';
    myHtml += '</div>';
    myHtml += '</div >';

    myHtml += '<div class="col-md-4">';

    myHtml += '<div class="form-group">';
    myHtml += '<label class="control-label " for="Address"><i class="glyphicon glyphicon-map-marker" aria-hidden="true"></i> Address<span class="text-red">*</span></label>';
    myHtml += '<div class=""><input type="text" id="txtCusBillingAddress1" class="form-control searchAddress" data-addresstype="cus-bill" placeholder="Address" /></div>';
    myHtml += '</div>';

    myHtml += '<div class="form-group">';
    myHtml += '<label class="control-label " for="Address 1">Address Line 2</label>';
    myHtml += '<div class=""><input type="text" id="txtCusBillingAddress2" class="form-control" placeholder="Address Line 2" /></div>';
    myHtml += '</div>';

    myHtml += '<div class="form-group">';
    myHtml += '<label class="control-label " for="City">City<span class="text-red">*</span></label>';
    myHtml += '<div class=""><input type="tel" id="txtCusBillingCity" class="form-control" placeholder="City"/></div>';
    myHtml += '</div>';
    myHtml += '</div>';

    myHtml += '<div class="col-md-4">';
    myHtml += '<div class="form-group">';
    myHtml += '<label class="control-label " for="State">State<span class="text-red">*</span></label>';
    myHtml += '<div class=""><select class="form-control" id="ddlCusBillingState"></select></div>';
    myHtml += '</div>';

    myHtml += '<div class="form-group">';
    myHtml += '<label class="control-label " for="Zip Code">Zip Code<span class="text-red">*</span></label>';
    myHtml += '<div class=""><input type="text" id="txtCusBillingPostCode" class="form-control" placeholder="Zip Code" /></div>';
    myHtml += '</div>';

    myHtml += '<div class="form-group">';
    myHtml += '<label class="control-label " for="Country">Country<span class="text-red">*</span></label>';
    myHtml += '<div class=""><select class="form-control" id="ddlCusBillingCountry"><option value="US">US - United States</option><option value="CA">CA - Canada</option></select></div>';
    myHtml += '</div>';

    myHtml += '</div>';
    myHtml += '</div >';

    $('#billModal .modal-body').append(myHtml); $("#ddlCusBillingState,#ddlCusBillingCountry").select2(); BindStateCounty("ddlCusBillingState", { id: 'US' });
    $("#billModal").modal({ backdrop: 'static', keyboard: false }); $("#txtCusNickName").focus(); $("#txtCusBillingMobile").mask("(999) 999-9999");
    let newEl = document.getElementById('txtCusBillingAddress1');
    setupAutocomplete(newEl);
}
function saveCustomer() {
    var oid = parseInt($('#hfOrderNo').val()) || 0;
    let Email = $("#txtCusNickName").val()//$("#txtCusEmail").val();
    let NickName = $("#txtCusNickName").val();
    let FirstName = $("#txtCusFirstName").val();
    let LastName = $("#txtCusLastName").val();
    let BillingAddress1 = $("#txtCusBillingAddress1").val();
    let BillingAddress2 = $("#txtCusBillingAddress2").val();
    let BillingPostcode = $("#txtCusBillingPostCode").val();
    let BillingCountry = $("#ddlCusBillingCountry").val();
    let BillingState = $("#ddlCusBillingState").val();
    let BillingCity = $("#txtCusBillingCity").val();
    let BillingPhone = $("#txtCusBillingMobile").val();

    let rex_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

    if (Email == "") { swal('alert', 'Please Enter Email', 'error').then(function () { swal.close(); $('#txtCusNickName').focus(); }) }
    else if (Email != "" && !rex_email.test(Email)) { swal('alert', 'Please enter valid email.', 'error').then(function () { swal.close(); $('#txtCusNickName').focus(); }) }
    //else if (NickName == "") { swal('alert', 'Please Enter User Name', 'error').then(function () { swal.close(); $('#txtUserNickName').focus(); }) }
    else if (FirstName == "") { swal('alert', 'Please Enter First Name', 'error').then(function () { swal.close(); $('#txtFirstName').focus(); }) }
    else if (LastName == "") { swal('alert', 'Please Enter Last Name', 'error').then(function () { swal.close(); $('#txtLastName').focus(); }) }
    else if (BillingAddress1 == "") { swal('alert', 'Please Enter Address 1', 'error').then(function () { swal.close(); $('#txtBillingAddress1').focus(); }) }
    else if (BillingPostcode == "") { swal('alert', 'Please Enter Zip Code', 'error').then(function () { swal.close(); $('#txtBillingPostCode').focus(); }) }
    else if (BillingCountry == "") { swal('alert', 'Please Enter Country', 'error').then(function () { swal.close(); $('#txtBillingCountry').focus(); }) }
    else if (BillingState == "") { swal('alert', 'Please Enter State', 'error').then(function () { swal.close(); $('#txtBillingState').focus(); }) }
    else if (BillingCity == "") { swal('alert', 'Please Enter City', 'error').then(function () { swal.close(); $('#txtBillingCity').focus(); }) }
    else if (BillingPhone == "") { swal('alert', 'Please Enter Contact No.', 'error').then(function () { swal.close(); $('#txtBillingMobile').focus(); }) }
    else {
        var obj = {
            ID: 0, user_email: Email, user_nicename: NickName, first_name: FirstName, last_name: LastName, billing_address_1: BillingAddress1,
            billing_address_2: BillingAddress2, billing_postcode: BillingPostcode, billing_country: BillingCountry,
            billing_state: BillingState, billing_city: BillingCity, billing_phone: BillingPhone
        }
        ajaxFunction('/Customer/NewUser/', obj, beforeSendFun, function (data) {
            if (data.status == true) {
                swal('Alert!', data.message, 'success');
                $("#ddlUser").empty().append('<option value="' + data.id + '" selected>' + Email + '</option>');
                if (oid == 0) { setTimeout(function () { NewOrderNo(); }, 50); }
                $("#billModal").modal('hide'); $('.billinfo').prop("disabled", false);
                ///billing_Details
                $('#txtbillfirstname,#txtshipfirstname').val(FirstName);
                $('#txtbilllastname,#txtshiplastname').val(LastName);
                $('#txtbillcompany,#txtshipcompany').val('');
                $('#txtbilladdress1,#txtshipaddress1').val(BillingAddress1);
                $('#txtbilladdress2,#txtshipaddress2').val(BillingAddress2);
                $('#txtbillzipcode,#txtshipzipcode').val(BillingPostcode);
                $('#txtbillcity,#txtshipcity').val(BillingCity);
                $('#ddlbillcountry,#ddlshipcountry').val(BillingCountry).trigger('change');
                $('#ddlbillstate,#ddlshipstate').val(BillingState).trigger('change');
                $('#txtbillemail').val(Email);
                $('#txtbillphone').val(BillingPhone);
            }
            else {
                swal('Alert!', data.message, 'error')
            }
        }, completeFun, errorFun, false);
    }
}
function copyBillingAddress() {
    $("#loader").show();
    $('#txtshipfirstname').val($("#txtbillfirstname").val());
    $('#txtshiplastname').val($("#txtbilllastname").val());
    $('#txtshipcompany').val($("#txtbillcompany").val());
    $('#txtshipaddress1').val($("#txtbilladdress1").val());
    $('#txtshipaddress2').val($("#txtbilladdress2").val());
    $('#txtshipzipcode').val($("#txtbillzipcode").val());
    $('#txtshipcity').val($("#txtbillcity").val());
    $('#ddlshipcountry').val($("#ddlbillcountry").val()).trigger('change');
    $('#ddlshipstate').val($("#ddlbillstate").val()).trigger('change');
    $("#loader").hide();
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Search Google Place API ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var autocompleteOptions = { componentRestrictions: { country: ["us", "ca"] }, fields: ["address_components", "geometry"], types: ["address"] };
function setupAutocomplete(inputs) {
    //console.log('setupAutocomplete...', $(inputs));
    autocomplete = new google.maps.places.Autocomplete(inputs, autocompleteOptions);
    autocomplete.addListener("place_changed", fillInAddress);
    function fillInAddress() {
        let place = autocomplete.getPlace();
        let address = '';
        let cAdd1 = 'txtCusBillingAddress1', cZipCode = 'txtCusBillingPostCode', cCity = 'txtCusBillingCity', cCountry = 'ddlCusBillingCountry', cState = 'ddlCusBillingState';
        if ($(inputs).data('addresstype') == 'bill')
            cAdd1 = 'txtbilladdress1', cZipCode = 'txtbillzipcode', cCity = 'txtbillcity', cCountry = 'ddlbillcountry', cState = 'ddlbillstate';
        else if ($(inputs).data('addresstype') == 'ship')
            cAdd1 = 'txtshipaddress1', cZipCode = 'txtshipzipcode', cCity = 'txtshipcity', cCountry = 'ddlshipcountry', cState = 'ddlshipstate';
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
            $("#" + cState).val(obj[0].short_name).trigger('change');//.append('<option value="' + obj[0].short_name + '" selected>' + obj[0].long_name + '</option>');
        else
            $("#" + cState).val('').trigger('change');;
    }
}
function initMap() {
    var inputs = document.getElementById("txtshipaddress1"); setupAutocomplete(inputs);
    //inputs = document.getElementById("txtshipaddress1"); setupAutocomplete(inputs);
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Edit Order ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getOrderInfo() {
    $('.view-addmeta').empty();
    let oid = parseInt($('#hfOrderNo').val()) || 0;
    if (oid > 0) {
        $('.billnote').prop("disabled", false); $('.agentaddtocart').addClass('hidden');
        $('#ddlStatus,#btnSearch').prop("disabled", true);
        $('.page-heading').text('Edit Order ').append('<a class="btn btn-danger" href="/Orders/OrdersHistory" data-toggle="tooltip" title="Go to Order List">Back to List</a>');
        $('#lblOrderNo').text('Order #' + oid + ' detail '); $('#hfOrderNo').val(oid);
        $('#order_line_items,#order_state_recycling_fee_line_items,#order_fee_line_items,#order_shipping_line_items,#order_refunds,#billCoupon,.refund-action').empty();
        $('#btnCheckout').remove();
        var opt = { strValue1: oid };
        ajaxFunction('/Orders/GetOrderInfo', opt, beforeSendFun, function (result) {
            try {
                var data = JSON.parse(result); //console.log(data);
                if (data.length > 0) {
                    $('#lblOrderNo').data('pay_by', data[0].payment_method);
                    if (data[0].payment_method == 'ppec_paypal') $('#lblOrderNo').data('pay_id', data[0].paypal_id);
                    else if (data[0].payment_method == 'podium') $('#lblOrderNo').data('pay_id', data[0].podium_id);
                    else $('#lblOrderNo').data('pay_id', '');

                    if (data[0].payment_method.trim().length > 0)
                        $('.payment-history').text('Payment via ' + data[0].payment_method_title + ' ' + data[0].created_via + '. Customer IP: ' + data[0].ip_address);
                    else
                        $('.payment-history').text('Customer IP: ' + data[0].ip_address);
                    $('#txtLogDate').val(data[0].date_created);
                    $('#ddlStatus').val(data[0].status.trim()).trigger('change'); $('#ddlUser').prop("disabled", true);
                    $("#ddlUser").empty().append('<option value="' + data[0].customer_id + '" selected>' + data[0].customer_name + '</option>');
                    ///billing_Details
                    var tPhone = data[0].b_phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3");
                    $('#txtbillfirstname').val(data[0].b_first_name); $('#txtbilllastname').val(data[0].b_last_name); $('#txtbilladdress1').val(data[0].b_address_1); $('#txtbilladdress2').val(data[0].b_address_2);
                    $('#txtbillzipcode').val(data[0].b_postcode); $('#txtbillcity').val(data[0].b_city); $('#txtbillemail').val(data[0].b_email); $('#txtbillphone').val(tPhone);
                    $('#txtbillcompany').val(data[0].b_company); $('#ddlbillcountry').val(data[0].b_country.trim()).trigger('change'); $('#ddlbillstate').val(data[0].b_state.trim()).trigger('change');

                    ///shipping_Details
                    $('#txtshipfirstname').val(data[0].s_first_name); $('#txtshiplastname').val(data[0].s_last_name); $('#txtshipaddress1').val(data[0].s_address_1); $('#txtshipaddress2').val(data[0].s_address_2);
                    $('#txtshipcompany').val(data[0].s_company); $('#txtshipzipcode').val(data[0].s_postcode); $('#txtshipcity').val(data[0].s_city);
                    $('#ddlshipcountry').val(data[0].s_country.trim()).trigger('change'); $('#ddlshipstate').val(data[0].s_state.trim()).trigger('change');
                    $('#txtCustomerNotes').val(data[0].post_excerpt);

                    if (data[0].is_edit == '1') {
                        if (data[0].is_shiped > 0) {
                            $('.box-tools-header').empty().append('<button type="button" class="btn btn-danger" id="btnPrintPdf" data-toggle="tooltip" title="Print Order invoice"><i class="fas fa-print"></i> Print</button> <button type="button" class="btn btn-danger btnOrderUndo" data-toggle="tooltip" title="Refresh Order"><i class="fa fa-undo"></i> Refresh</button>');
                            $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Orders/OrdersHistory" data-toggle="tooltip" title="Go to Order List">Back to List</a>');
                        }
                        else {
                            $('.box-tools-header').empty().append('<button type="button" class="btn btn-danger" id="btnPrintPdf" data-toggle="tooltip" title="Print Order invoice"><i class="fas fa-print"></i> Print</button> <button type="button" class="btn btn-danger btnOrderUndo" data-toggle="tooltip" title="Refresh Order"><i class="fa fa-undo"></i> Refresh</button> <button type="button" class="btn btn-danger btnEditOrder" data-toggle="tooltip" title="Edit Order"><i class="far fa-edit"></i> Edit</button>');
                            $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Orders/OrdersHistory" data-toggle="tooltip" title="Go to Order List">Back to List</a> <button type="button" class="btn btn-danger btnEditOrder" data-toggle="tooltip" title="Edit Order"><i class="far fa-edit"></i> Edit</button>');
                        }
                    }
                    else {
                        $('.box-tools-header').empty().append('<button type="button" class="btn btn-danger" id="btnPrintPdf" data-toggle="tooltip" title="Print Order invoice"><i class="fas fa-print"></i> Print</button>');
                        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Orders/OrdersHistory" data-toggle="tooltip" title="Go to Order List">Back to List</a>');
                    }
                    //bind Product
                    getOrderItemList(oid);
                    getOrderNotesList(oid);
                }
            }
            catch (error) {
                $("#loader").hide(); swal('Alert!', "something went wrong.", "error");
            }
        }, function () { $("#loader").hide(); $('.billinfo').prop("disabled", true); }, function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); }, false);
        getItemShippingCharge(false);
    }
    else {
        $('.billnote').prop("disabled", true); $('.agentaddtocart').removeClass('hidden');
        $("#loader").hide(); $('#lblOrderNo').data('pay_by', ''); $('#lblOrderNo').data('pay_id', '');
        $('.refund-action').append('<button type="button" id="btnAddFee" class="btn btn-danger billinfo" disabled data-toggle="tooltip" title="Add Other Fee">Add Fee</button> ');
        $('.page-heading').text('Quick Order'); $('#btnSearch').prop("disabled", false); searchOrderModal();
    }
}
function getOrderItemList(oid) {
    var option = { strValue1: oid };
    //let coupon_list = [];
    ajaxFunction('/Orders/GetOrderProductList', option, beforeSendFun, function (data) {
        let itemHtml = '', recyclingfeeHtml = '', feeHtml = '', shippingHtml = '', refundHtml = '', couponHtml = '';
        let zQty = 0.00, zGAmt = 0.00, zTDiscount = 0.00, zTotalTax = 0.00, zShippingAmt = 0.00, zStateRecyclingAmt = 0.00, zFeeAmt = 0.00, zRefundAmt = 0.00;
        //for (var i = 0; i < data.length; i++) {
        $.each(data, function (i, row) {
            let orderitemid = parseInt(row.order_item_id) || 0;
            if (row.product_type == 'line_item') {
                let PKey = row.product_id + '_' + row.variation_id;
                itemHtml += '<tr id="tritemId_' + PKey + '" data-id="' + PKey + '" class="' + (row.is_free ? 'free_item' : 'paid_item') + '" data-pid="' + row.product_id + '" data-vid="' + row.variation_id + '" data-pname="' + row.product_name + '" data-gid="' + row.group_id + '" data-freeitem="' + row.is_free + '" data-freeitems=\'' + row.free_itmes + '\' data-orderitemid="' + orderitemid + '" data-img="' + row.product_img + '" data-srfee="0" data-sristaxable="' + false + '" data-meta_data=\'' + row.meta_data + '\'>';
                if (row.is_free)
                    itemHtml += '<td class="text-center item-action"></td>';
                else
                    itemHtml += '<td class="text-center item-action"><button class="btn menu-icon-gr text-red btnDeleteItem billinfo" tabitem_itemid="' + PKey + '" onclick="removeItemsInTable(\'' + PKey + '\');"> <i class="glyphicon glyphicon-trash"></i></button></td>';

                itemHtml += '<td>' + row.product_name + '<div class="view-addmeta"></div></td>';
                itemHtml += '<td class="text-right">' + row.reg_price.toFixed(2) + '</td>';
                if (row.is_free) {
                    itemHtml += '<td><input min="1" autocomplete="off" disabled class="form-control number rowCalulate" type="number" id="txt_ItemQty_' + PKey + '" value="' + row.quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
                }
                else {
                    itemHtml += '<td><input min="1" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_ItemQty_' + PKey + '" value="' + row.quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
                }
                itemHtml += '<td class="TotalAmount text-right" data-regprice="' + row.reg_price + '"data-salerate="' + row.sale_price + '" data-discount="' + row.discount.toFixed(2) + '" data-amount="' + row.total + '" data-taxamount="' + row.tax_amount + '" data-shippingamt="' + row.shipping_amount + '">' + row.total.toFixed(2) + '</td>';
                itemHtml += '<td class="text-right RowDiscount" data-disctype="' + row.discount_type + '" data-couponamt="0">' + row.discount.toFixed(2) + '</td>';
                itemHtml += '<td class="text-right RowTax">' + row.tax_amount.toFixed(2) + '</td>';
                itemHtml += '</tr>';
                zQty = zQty + (parseFloat(row.quantity) || 0.00);
                zGAmt = zGAmt + (parseFloat(row.total) || 0.00);
                zTotalTax = zTotalTax + (parseFloat(row.tax_amount) || 0.00);
            }
            else if (row.product_type == 'coupon') {
                let cou_amt = parseFloat(row.discount) || 0.00;
                let coupon_list = auto_coupon.filter(element => element.post_title == row.product_name);
                for (var j = 0; j < coupon_list.length; j++) {
                    couponHtml += '<li id="li_' + coupon_list[j].post_title.toString().toLowerCase().replaceAll(' ', '_') + '" class="' + (coupon_list[j].discount_type == 'fixed_cart' ? 'cart' : 'items') + '" data-coupon= "' + coupon_list[j].post_title.toString().toLowerCase() + '" data-couponamt= "' + coupon_list[j].coupon_amount + '" data-disctype= "' + coupon_list[j].discount_type + '" data-rqprdids= "' + coupon_list[j].product_ids + '" data-excludeids= "' + coupon_list[j].exclude_product_ids + '" data-type= "' + coupon_list[j].type + '" data-orderitemid="' + orderitemid + '">';
                    couponHtml += '<a href="javascript:void(0);">';
                    couponHtml += '<i class="fa fa-gift"></i>';
                    couponHtml += '<span>' + coupon_list[j].title + '</span>';
                    couponHtml += '<div class="pull-right">';

                    if (coupon_list[j].type == 'add_coupon') {
                        couponHtml += '$<span id="cou_discamt">' + cou_amt.toFixed(2) + '</span>';
                        couponHtml += '<button type="button" class="btn btn-box-tool pull-right billinfo" onclick="deleteAllCoupons(\'' + coupon_list[j].post_title.toString().toLowerCase() + '\');"> <i class="fa fa-times"></i>';
                        couponHtml += '</button>';
                    }
                    else {
                        couponHtml += '$<span id="cou_discamt" style ="margin-right: 20px;">' + cou_amt.toFixed(2) + '</span>';
                    }
                    couponHtml += '</div>';
                    couponHtml += '</a>';
                    couponHtml += '</li>';
                }
                if (coupon_list.length == 0) {
                    let cpn_info = JSON.parse(row.meta_data);
                    let cpn_name = row.product_name;
                    couponHtml += '<li id="li_' + row.product_name.toString().toLowerCase().replaceAll(' ', '_') + '" class="' + (cpn_info.discount_type == 'fixed_cart' ? 'cart' : 'items') + '" data-coupon= "' + row.product_name + '" data-couponamt= "' + (cpn_info.coupon_amount != '' && cpn_info.coupon_amount != undefined ? cpn_info.coupon_amount : cou_amt) + '" data-disctype= "' + (cpn_info.discount_type != '' && cpn_info.discount_type != undefined ? cpn_info.discount_type : '') + '" data-rqprdids="' + (cpn_info.product_ids != '' && cpn_info.product_ids != undefined ? cpn_info.product_ids : '') + '" data-excludeids="' + (cpn_info.exclude_product_ids != '' && cpn_info.exclude_product_ids != undefined ? cpn_info.exclude_product_ids : '') + '" data-type= "add_coupon" data-orderitemid="' + orderitemid + '">';
                    couponHtml += '<a href="javascript:void(0);">';
                    couponHtml += '<i class="fa fa-gift"></i>';
                    couponHtml += '<span>' + cpn_name.toString().toLowerCase() + '</span>';
                    couponHtml += '<div class="pull-right">';
                    couponHtml += '$<span id="cou_discamt">' + cou_amt.toFixed(2) + '</span>';
                    couponHtml += '<button type="button" class="btn btn-box-tool pull-right billinfo" onclick="deleteAllCoupons(\'' + row.product_name.toString().toLowerCase() + '\');"><i class="fa fa-times"></i></button>'
                    couponHtml += '</div>';
                    couponHtml += '</a>';
                    couponHtml += '</li>';
                }
                zTDiscount = zTDiscount + cou_amt;
            }
            else if (row.product_type == 'fee' && row.product_name == 'State Recycling Fee') {
                recyclingfeeHtml += '<tr id="trfeeid_' + orderitemid + '" data-orderitemid="' + orderitemid + '" data-pname="' + row.product_name + '">';
                recyclingfeeHtml += '<td class="text-center item-action"><i class="fa fa-plus-circle"></i></td>';
                recyclingfeeHtml += '<td>' + row.product_name + '</td><td></td><td></td><td class="TotalAmount text-right">' + row.total.toFixed(2) + '</td><td></td><td></td>';
                recyclingfeeHtml += '</tr>';
                zStateRecyclingAmt = zStateRecyclingAmt + (parseFloat(row.total) || 0.00);
                $("#stateRecyclingFeeTotal").data("orderitemid", orderitemid);
            }
            else if (row.product_type == 'fee' && row.product_name != 'State Recycling Fee') {
                let startingNumber = (row.product_name.match(/^-?\d+\.\d+|^-?\d+\b|^\d+(?=\w)/g) || []);
                let feetype = row.product_name.match(/%/g) != null ? '%' : '';
                let sd = feetype == '%' ? (parseFloat(startingNumber) || 0.00) : parseFloat(row.total);
                feeHtml += '<tr id="trfeeid_' + orderitemid + '" data-orderitemid="' + orderitemid + '" data-pname="' + row.product_name + '" data-feeamt="' + sd + '" data-feetype="' + feetype + '"> ';
                feeHtml += '<td class="text-center item-action"><button class="btn menu-icon-gr text-success  billinfo" onclick="AddFeeModal(\'' + orderitemid + '\',\'' + row.product_name + '\');"> <i class="glyphicon glyphicon-edit"></i></button>';
                feeHtml += '<button class="btn menu-icon-gr text-red billinfo" onclick="RemoveFee(\'' + orderitemid + '\');"> <i class="glyphicon glyphicon-trash"></i></button></td>';
                feeHtml += '<td>' + row.product_name + '</td><td></td><td></td><td class="TotalAmount text-right">' + row.total.toFixed(2) + '</td><td></td><td></td>';
                feeHtml += '</tr>';
                zFeeAmt = zFeeAmt + (parseFloat(row.total) || 0.00);
            }
            else if (row.product_type == 'shipping') {
                shippingHtml += '<tr id="tritemId_' + orderitemid + '" data-orderitemid="' + orderitemid + '" data-pname="' + row.product_name + '">';
                shippingHtml += '<td class="text-center item-action"><i class="fa fa-shipping-fast"></i></td>';
                shippingHtml += '<td>Shipping</td><td></td><td></td><td class="TotalAmount text-right">' + row.total.toFixed(2) + '</td><td></td><td></td>';
                shippingHtml += '</tr>';
                zShippingAmt = zShippingAmt + (parseFloat(row.total) || 0.00);
                $("#shippingTotal").data("orderitemid", orderitemid);
            }
            else if (row.product_type == 'refund') {
                refundHtml += '<tr id="tritemId_' + orderitemid + '" data-orderitemid="' + orderitemid + '" data-pname="' + row.product_name + '">';
                //refundHtml += '<td class="text-center item-action"><button class="btn menu-icon-gr text-red btnDeleteItem billinfo" tabitem_itemid="' + orderitemid + '" onclick="removeItemsInTable(\'' + orderitemid + '\');"> <i class="glyphicon glyphicon-trash"></i></button></td>';
                refundHtml += '<td></td>';
                refundHtml += '<td>' + row.product_name + '</td><td></td><td></td><td class="TotalAmount text-right">' + row.total.toFixed(2) + '</td><td></td><td></td>';
                refundHtml += '</tr>';
                zRefundAmt = zRefundAmt + (parseFloat(row.total) || 0.00);
            }
            else if (row.product_type == 'tax') {
                $("#salesTaxTotal").data("orderitemid", orderitemid);
            }
        });
        $('#order_line_items').append(itemHtml); $('#order_state_recycling_fee_line_items').append(recyclingfeeHtml); $('#order_fee_line_items').append(feeHtml); $('#order_shipping_line_items').append(shippingHtml); $('#order_refunds').append(refundHtml);
        $('.refund-action').append('<button type="button" id="btnAddFee" class="btn btn-danger billinfo">Add Fee</button> ');
        $('#billCoupon').append(couponHtml);
        //Calculate Final
        $("#totalQty").text(zQty.toFixed(0)); $("#totalQty").data('qty', zQty.toFixed(0));
        $("#SubTotal").text(zGAmt.toFixed(2));
        $("#discountTotal").text(zTDiscount.toFixed(2));
        $("#salesTaxTotal").text(zTotalTax.toFixed(2));
        $("#shippingTotal").text(zShippingAmt.toFixed(2));
        $("#stateRecyclingFeeTotal").text(zStateRecyclingAmt.toFixed(2));
        $("#feeTotal").text(zFeeAmt.toFixed(2));
        $("#orderTotal").html((zGAmt - zTDiscount + zShippingAmt + zTotalTax + zStateRecyclingAmt + zFeeAmt).toFixed(2));
        $("#refundedTotal").text(zRefundAmt.toFixed(2));
        $("#netPaymentTotal").text(((zGAmt - zTDiscount + zShippingAmt + zTotalTax + zStateRecyclingAmt + zFeeAmt) + zRefundAmt).toFixed(2));
        if (zRefundAmt != 0) $(".refund-total").removeClass('hidden'); else $(".refund-total").addClass('hidden');
        $("#divAddItemFinal").find(".rowCalulate").change(function () { calculateDiscountAcount(); });
    }, completeFun, errorFun, false);
}
function getOrderNotesList(oid) {
    var option = { strValue1: oid };
    ajaxFunction('/Orders/GetOrderNotesList', option, beforeSendFun, function (result) {
        let data = JSON.parse(result);
        let noteHtml = '';
        for (var i = 0; i < data.length; i++) {
            let is_customer_note = parseInt(data[i].is_customer_note) || 0;
            noteHtml += '<li id="linoteid_' + data[i].comment_ID + '" class="note system-note ' + (is_customer_note == 0 ? '' : 'customer-note') + '">';
            noteHtml += '<div class="note_content"><p>' + data[i].comment_content + '</p></div>';
            noteHtml += '<p class="meta"><abbr class="exact-date" title="' + data[i].comment_date + '">' + data[i].comment_date + '</abbr> ';
            noteHtml += '<a href="javascript:void(0)" onclick="DeleteNotes(' + data[i].comment_ID + ');" class="delete_note billinfo" role="button">Delete note</a>';
            noteHtml += '</p>';
            noteHtml += '</li>';
        }
        $(".order_notes").empty().html(noteHtml);
    }, completeFun, errorFun, false);
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Add/Edit Order Item Tab Section ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getItemList(pid, vid, Qty) {
    if ($('#tritemId_' + pid + '_' + vid).length > 0) { swal('Alert!', 'Product already added to list.', "error"); return false; }
    $("#loader").show();
    let option = { strValue1: pid, strValue2: vid, strValue3: $('#ddlshipcountry').val(), strValue4: $('#ddlshipstate').val() };
    let tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00;
    let monthlySaleCoupon = ["sales20off"];
    ajaxFunction('/Orders/GetProductInfo', option, beforeSendFun, function (result) {
        let itemsDetailsxml = [], auto_code = [];
        $.each(result, function (key, pr) {
            pr.quantity = pr.quantity * Qty;
            let coupon_amt = 0.00, coupon_type = 'fixed_product', row_key = pr.product_id + '_' + pr.variation_id;
            if (!pr.is_free) {
                if (pr.reg_price > pr.sale_price) {
                    coupon_amt = (pr.reg_price - pr.sale_price) * pr.quantity;
                    let pro_ids = pr.variation_id + " ";
                    let coupon_list = auto_coupon.filter(element => element.post_title == pr.product_id);
                    if (coupon_list.length > 0) {
                        coupon_list[0].coupon_amount = coupon_amt; coupon_list[0].product_ids = pro_ids;
                        if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
                    }
                }
            }
            itemsDetailsxml.push({
                PKey: row_key, product_id: pr.product_id, variation_id: pr.variation_id, product_name: pr.product_name, product_img: '', quantity: pr.quantity, reg_price: pr.reg_price, sale_rate: pr.sale_price, total: (pr.reg_price * pr.quantity), discount_type: coupon_type, discount: coupon_amt, tax_amount: ((pr.reg_price * pr.quantity) * tax_rate).toFixed(2),
                shipping_amount: pr.shipping_amount, is_free: pr.is_free, free_itmes: pr.free_itmes, order_item_id: 0, sr_fee: pr.staterecycle_fee, sr_fee_istaxable: pr.staterecycle_istaxable, order_id: parseInt($('#hfOrderNo').val()) || 0, meta_data: pr.meta_data
            });
        });
        //console.log(auto_code,itemsDetailsxml);
        //Bind diff Coupon
        if (auto_code.length > 0) bindCouponList(auto_code);
        if (itemsDetailsxml.length > 0) bindItemListDataTable(itemsDetailsxml);
    }, function () { $("#loader").hide(); }, function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); }, true);
}
function bindItemListDataTable(data) {
    var layoutHtml = '';
    if (data.length > 0) {
        $.each(data, function (i, pr) {
            if (pr.product_id > 0) {
                if ($('#tritemId_' + pr.PKey).length <= 0) {
                    layoutHtml += '<tr id="tritemId_' + pr.PKey + '" data-id="' + pr.PKey + '" class="' + (pr.is_free ? 'free_item' : 'paid_item') + '" data-pid="' + pr.product_id + '" data-vid="' + pr.variation_id + '" data-pname="' + pr.product_name + '" data-freeitem="' + pr.is_free + '" data-freeitems=\'' + pr.free_itmes + '\' data-orderitemid="' + pr.order_item_id + '" data-img="' + pr.product_img + '" data-srfee="' + pr.sr_fee + '" data-sristaxable="' + pr.sr_fee_istaxable + '" data-meta_data=\'' + pr.meta_data + '\'>';
                    if (pr.is_free) layoutHtml += '<td class="text-center"></td>';
                    else layoutHtml += '<td class="text-center"><button class="btn menu-icon-gr text-red btnDeleteItem billinfo" tabitem_itemid="' + pr.PKey + '" onclick="removeItemsInTable(\'' + pr.PKey + '\');"> <i class="glyphicon glyphicon-trash"></i> </button></td>';
                    layoutHtml += '<td>' + pr.product_name + '</td>';
                    layoutHtml += '<td class="text-right">' + pr.reg_price.toFixed(2) + '</td>';
                    if (pr.is_free) layoutHtml += '<td><input min="1" autocomplete="off" disabled class="form-control billinfo number rowCalulate" type="number" id="txt_ItemQty_' + pr.PKey + '" value="' + pr.quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
                    else layoutHtml += '<td><input min="1" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_ItemQty_' + pr.PKey + '" value="' + pr.quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
                    layoutHtml += '<td class="TotalAmount text-right" data-regprice="' + pr.reg_price + '"data-salerate="' + pr.sale_rate + '" data-discount="' + pr.discount + '" data-amount="' + pr.total + '" data-taxamount="' + pr.tax_amount + '" data-shippingamt="' + pr.shipping_amount + '">' + pr.total.toFixed(2) + '</td>';
                    layoutHtml += '<td class="text-right RowDiscount" data-disctype="' + pr.discount_type + '" data-couponamt="0">' + pr.discount.toFixed(2) + '</td>';
                    layoutHtml += '<td class="text-right RowTax">' + pr.tax_amount + '</td>';
                    layoutHtml += '</tr>';
                    //AddOrderProduct(pr);
                }
                else {
                    var zQty = parseFloat($('#txt_ItemQty_' + pr.rd_id).val()) || 0.00;
                    $('#txt_ItemQty_' + pr.rd_id).val((parseFloat($('#txt_ItemQty_' + pr.PKey).val()) + pr.quantity).toFixed(2));
                }
            }
        });
        $('#order_line_items').append(layoutHtml);
        $("#divAddItemFinal").find(".rowCalulate").change(function () { calculateDiscountAcount(); });
    }
    else {
        layoutHtml += '<table id="tblAddItemFinal" class="table-blue table table-bordered table-striped dataTable">';
        layoutHtml += '<thead>';
        layoutHtml += '<tr>';
        layoutHtml += '<th class="text-center" style="width: 5%">Actions</th>';
        layoutHtml += '<th style="width: 55%">Item</th>';
        layoutHtml += '<th class="text-right" style="width: 8%">Sale Price</th>';
        layoutHtml += '<th class="text-right" style="width: 8%">Quantity</th>';
        layoutHtml += '<th class="text-right" style="width: 8%">Sub-Total</th>';
        layoutHtml += '<th class="text-right" style="width: 8%">Discount</th>';
        layoutHtml += '<th class="text-right" style="width: 8%">Tax</th>';
        layoutHtml += '</tr>';
        layoutHtml += '</thead>';
        layoutHtml += '<tbody id="order_line_items"></tbody><tbody id="order_state_recycling_fee_line_items"></tbody><tbody id="order_fee_line_items"></tbody><tbody id="order_refunds"></tbody>';
        layoutHtml += '</table>';
        $('#divAddItemFinal').empty().html(layoutHtml);
    }
    calculateDiscountAcount();
    //auto Coupon add
    ApplyAutoCoupon();
    //calcFinalTotals();
}
function AddOrderProduct(product_info) {
    product_info.order_id = parseInt($('#hfOrderNo').val()) || 0;
    $.ajax({ method: 'post', url: '/Orders/AddOrderProduct', data: product_info }).done(function (result, textStatus, jqXHR) {
        if (result.status) $('#tritemId_' + pr.PKey).data('orderitemid', result.id)
    }).fail(function (jqXHR, textStatus, errorThrown) {
        swal('Alert!', 'Something went wrong, please try again.', "error");
    });
}
function removeItemsInTable(id) {
    //------------- Remove data in Temp AddItemList-----
    swal({ title: "Are you sure?", text: 'Would you like to Remove this Item?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) {
                $('#tritemId_' + id).remove();
                // no cart item
                if ($("#order_line_items > tr.paid_item").length == 0) {
                    $('#billCoupon').empty();
                }
                else {
                    //remove sales coupons
                    deleteSaleCoupon();
                    //auto Coupon add
                    ApplyAutoCoupon();
                }
                calculateDiscountAcount();
            }
        });
}
function calcFinalTotals() {
    //calculateStateRecyclingFee();
    let tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00, is_freighttax = $('#hfFreighttaxable').val();
    let zQty = 0.00, zDiscQty = 0.00, zGAmt = 0.00, zTDiscount = 0.00, zTotalTax = 0.00, zShippingAmt = 0.00, zStateRecyclingAmt = 0.00, zFeeAmt = 0.00;
    $("#order_line_items > tr").each(function (index, tr) {
        let rQty = (parseFloat($(tr).find("[name=txt_ItemQty]").val()) || 0.00);
        zQty += rQty;
        zGAmt = zGAmt + parseFloat($(tr).find(".TotalAmount").data("amount"));
        if (parseFloat($(tr).find(".TotalAmount").data("amount")) > 0)
            zDiscQty = zDiscQty + (parseFloat($(tr).find("[name=txt_ItemQty]").val()) || 0.00);
        zTDiscount = zTDiscount + parseFloat($(tr).find(".RowDiscount").text());
        //zTotalTax = zTotalTax + parseFloat($(tr).find(".TotalAmount").data("taxamount"));
        zShippingAmt = zShippingAmt + (parseFloat($(tr).find(".TotalAmount").data("shippingamt")) * rQty);
        //console.log(zShippingAmt, rQty, $(tr).find(".TotalAmount").data("shippingamt"));        
    });
    if (is_freighttax) zTotalTax = zTotalTax + (zShippingAmt * tax_rate);
    zTotalTax = zTotalTax + ((zGAmt - zTDiscount) * tax_rate);
    zStateRecyclingAmt = parseFloat($("#stateRecyclingFeeTotal").text()) || 0.00;
    $("#totalQty").text(zQty.toFixed(0)); $("#totalQty").data('qty', zDiscQty.toFixed(0));
    $("#SubTotal").text(zGAmt.toFixed(2));
    $("#discountTotal").text(zTDiscount.toFixed(2));
    $("#salesTaxTotal").text(zTotalTax.toFixed(2));
    $("#shippingTotal").text(zShippingAmt.toFixed(2)); $('#order_shipping_line_items').find(".TotalAmount").text(zShippingAmt.toFixed(2));
    CalculateFee();
    zFeeAmt = parseFloat($("#feeTotal").text()) || 0.00;
    $("#orderTotal").html((zGAmt - zTDiscount + zShippingAmt + zTotalTax + zStateRecyclingAmt + zFeeAmt).toFixed(2));
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Add Item Meta ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function AddItemMetaModal(id, itemid, meta_list) {
    let metaHtml = '<div class="modal-dialog">';
    metaHtml += '<div class="modal-content">';
    metaHtml += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button><h4 class="modal-title">Add Meta</h4></div>';
    metaHtml += '<div class="modal-body p-0"><table class="table"><tbody id="order_items_meta">';
    $.each(meta_list, function (index, row) {
        metaHtml += '<tr data-id="' + row.id + '"><td style="width:45%"><input class="form-control" id="txt_key' + index + '" value="' + row.key.replace('_system_', '') + '" name="txt_key" placeholder="Name"></td>';
        metaHtml += '<td style = "width:45%"><input class="form-control" id="txt_value' + index + '" value="' + row.value + '" name="txt_value" placeholder="Value"></td>';
        metaHtml += '<td style="width:10%"><button class="btn menu-icon-gr text-red btnmeta_delete"> <i class="glyphicon glyphicon-trash"></i></button></td></tr > ';
    });
    metaHtml += '</tbody>';
    metaHtml += '<tbody><tr><td style="width:45%"></td><td style="width:45%"></td><td style="width:10%"><button class="btn menu-icon-gr text-red btnmeta_add"> <i class="glyphicon glyphicon-plus"></i></button></td></tr></tbody>';
    metaHtml += '</table></div>';
    metaHtml += '<div class="modal-footer"><button type="button" class="btn btn-danger" id="btnmeta_ok" data-id="' + id + '" data-itemid="' + itemid + '">Add</button></div>';
    metaHtml += '</div>';
    metaHtml += '</div>';
    $("#billModal").empty().html(metaHtml);
    $("#billModal").modal({ backdrop: 'static', keyboard: false });
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Order Notes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function AddNotes() {
    let oid = parseInt($('#hfOrderNo').val()) || 0;
    let option = { post_ID: oid, comment_content: $('#add_order_note').val(), is_customer_note: $('#order_note_type').val() };
    ajaxFunction('/Orders/OrderNoteAdd', option, beforeSendFun, function (result) {
        if (result.status) { getOrderNotesList(oid); $('#add_order_note').val(''); }
        else swal('Alert!', result.message, "error");
    }, completeFun, errorFun, false);
}
function DeleteNotes(id) {
    let option = { comment_ID: id }; let oid = parseInt($('#hfOrderNo').val()) || 0;
    swal({ title: "Are you sure?", text: 'Would you like to Remove this note?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) {
                ajaxFunction('/Orders/OrderNoteDelete', option, beforeSendFun, function (result) {
                    if (result.status) getOrderNotesList(oid);
                    else swal('Alert!', result.message, "error");
                }, completeFun, errorFun, false);
            }
        });
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Add Fee ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function AddFeeModal(orderitemid, feevalue) {
    var feeHtml = '<div class="modal-dialog">';
    feeHtml += '<div class="modal-content">';
    feeHtml += '<div class="modal-header">';
    feeHtml += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    feeHtml += '<h4 class="modal-title" id="myModalLabel">Add Fee</h4>';
    feeHtml += '</div>';
    feeHtml += '<div class="modal-body">Enter a fixed amount or percentage to apply as a fee.';
    feeHtml += '<input class="form-control" type="input" id="txt_FeeAmt" name="txt_FeeAmt" placeholder="Fee" maxlength="75" autocomplete="true" value="' + feevalue + '">';
    feeHtml += '</div > ';
    feeHtml += '<div class="modal-footer">';
    feeHtml += '<button type="button" class="btn btn-danger" id="btnApplyFee" data-orderitemid="' + orderitemid + '">Add</button>';
    feeHtml += '</div>';
    feeHtml += '</div>';
    feeHtml += '</div>';
    $("#billModal").empty().html(feeHtml);
    $("#billModal").modal({ backdrop: 'static', keyboard: false }); $("#txt_FeeAmt").focus();
}
function ApplyFee(orderitemid, feevalue) {
    let feetype = feevalue.match(/%/g) != null ? '%' : '';
    let startingNumber = parseFloat(feevalue.match(/^-?\d+\.\d+|^-?\d+\b|^\d+(?=\w)/g)) || 0.00;
    let product_name = feetype == '%' ? feevalue + ' fee' : startingNumber + ' fee';
    let oid = parseInt($('#hfOrderNo').val()) || 0, line_total = 0, zGAmt = parseFloat($("#SubTotal").text()) || 0.00;
    line_total = (feetype == '%' && startingNumber != 0) ? (zGAmt * startingNumber / 100) : startingNumber;
    let option = { order_item_id: orderitemid, order_id: oid, item_name: product_name, item_type: 'fee', amount: line_total };
    ajaxFunction('/Orders/AddFee', option, beforeSendFun, function (result) {
        let feeHtml = '';
        if (orderitemid > 0) {
            $('#trfeeid_' + orderitemid).data('pname', product_name); $('#trfeeid_' + orderitemid).data('feeamt', startingNumber); $('#trfeeid_' + orderitemid).data('feetype', feetype);
            feeHtml += '<td class="text-center item-action"><button class="btn menu-icon-gr text-success  billinfo" onclick="AddFeeModal(\'' + result.order_item_id + '\',\'' + product_name + '\');"> <i class="glyphicon glyphicon-edit"></i></button>';
            feeHtml += '<button class="btn menu-icon-gr text-red billinfo" onclick="RemoveFee(\'' + orderitemid + '\');"> <i class="glyphicon glyphicon-trash"></i></button></td>';
            feeHtml += '<td>' + product_name + '</td><td></td><td></td><td class="TotalAmount text-right">' + line_total + '</td><td></td><td></td>';
            $('#trfeeid_' + orderitemid).empty().append(feeHtml);
        }
        else {
            let feeHtml = '';
            feeHtml += '<tr id="trfeeid_' + result.order_item_id + '" data-orderitemid="' + result.order_item_id + '" data-pname="' + product_name + '" data-feeamt="' + startingNumber + '" data-feetype="' + feetype + '">';
            feeHtml += '<td class="text-center item-action"><button class="btn menu-icon-gr text-success  billinfo" onclick="AddFeeModal(\'' + result.order_item_id + '\',\'' + product_name + '\');"> <i class="glyphicon glyphicon-edit"></i></button>';
            feeHtml += '<button class="btn menu-icon-gr text-red billinfo" onclick="RemoveFee(\'' + result.order_item_id + '\');"> <i class="glyphicon glyphicon-trash"></i></button></td>';
            feeHtml += '<td>' + product_name + '</td><td></td><td></td><td class="TotalAmount text-right">' + line_total + '</td><td></td><td></td>';
            feeHtml += '</tr>';
            $('#order_fee_line_items').append(feeHtml);
        }
        $("#billModal").modal('hide'); calcFinalTotals();
    }, completeFun, errorFun, false);
}
function RemoveFee(orderitemid) {
    swal({ title: "Are you sure?", text: 'Would you like to Remove this fee?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) {
                let option = { order_item_id: orderitemid, order_id: 0, item_name: '', item_type: 'fee', amount: 0 };
                ajaxFunction('/Orders/RemoveFee', option, beforeSendFun, function (result) {
                    if (result.status) { $('#trfeeid_' + orderitemid).remove(); calcFinalTotals(); }
                    else { swal('Alert!', result.message, "error"); }
                }, completeFun, errorFun, false);
            }
        });
    return false;
}
function CalculateFee() {
    let zFeeAmt = 0.00, zGmtAmt = parseFloat($("#SubTotal").text());
    $("#order_fee_line_items > tr").each(function (index, tr) {
        let zAmt = 0.00;
        if ($(tr).data('feetype') == '%') zAmt = (zGmtAmt * (parseFloat($(tr).data('feeamt')) / 100));
        else zAmt = parseFloat($(tr).data('feeamt'));
        $(tr).find(".TotalAmount").text(zAmt.toFixed(2));
        zFeeAmt += zAmt;
    });
    $("#feeTotal").text(zFeeAmt.toFixed(2));
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Coupon and Product Modal ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function CouponModal() {
    var myHtml = '';
    //header
    myHtml += '<div class="modal-dialog">';
    myHtml += '<div class="modal-content">';
    myHtml += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    myHtml += '<h4 class="modal-title" id="myModalLabel">Apply Coupon</h4>';
    myHtml += '</div>';
    myHtml += '<div class="modal-body">Enter a coupon code to apply. Discounts are applied to line totals, before taxes.';
    myHtml += '<input class="form-control" type="text" id="txt_Coupon" name="txt_Coupon" placeholder="Coupon Code" maxlength="25">';
    myHtml += '<div class="font-weight-bold text-danger alert-coupon"></div>';
    myHtml += '</div>';
    myHtml += '<div class="modal-footer"><button type="button" class="btn btn-danger" id="btnCouponAdd">Add</button></div>';
    myHtml += '</div>';
    myHtml += '</div>';
    $("#billModal").empty().html(myHtml);
    $("#billModal").modal({ backdrop: 'static', keyboard: false }); $("#txt_Coupon").focus();
}
function Coupon_get_discount_amount(id, parent_id, coupon_code, coupon_amt, item_qty, reg_price, sale_price) {
    coupon_code = coupon_code.toString().toLowerCase();
    let coupon_isedu = ["mhsu15", "pu15", "utep74", "msu15", "cabarrus15", "crusader15", "ucsd15", "vt15", "kent15", "fcs15", "sisd15", "isu15", "uh15", "teacher15", "csusm15", "abbey15"];
    let coupon_isgrin = ["erin10off", "venezia10off", "jasmine10off", "liz10off", "jamie10off", "nicole10off", "faye10off", "vinny10off", "ava10off", "kelsey10off", "aimy10off", "grace10off", "ramya10off", "georgia10off", "slayer10off", "victoria10off", "nickayla10off", "saraida10off", "garnerfamily5", "gina10off", "brooke10off", "lolo10off", "melissa10off", "claudia10off"];
    let isedu = 0;
    if (coupon_isedu.includes(coupon_isedu)) { isedu = 1; }
    let isgrin = 0;
    if (coupon_isgrin.includes(coupon_isedu)) { isgrin = 1; }

    if (coupon_code.includes("friend") && coupon_code.substr(6) > 8500) {
        if (id != 632713 && id != 78676) {
            if (parent_id == 118) {
                if (coupon_amt == 130) coupon_amt = 130;
                else if (coupon_amt == 150) coupon_amt = 150;
            }
            else if (parent_id == 611172) {
                if (coupon_amt == 130) coupon_amt = 130;
                else if (coupon_amt == 150) coupon_amt = 200;
            }
            else {
                coupon_amt = 10; reg_price = sale_price;
            }
        }
        else
            return 0.00;
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code.includes("vip")) {
        return { price: sale_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (isedu == 1) {
        let matt_arr = [118, 611172, 611252, 612995, 611286, 31729, 20861];
        if (id != 632713 && id != 78676) {
            if (matt_arr.includes(parent_id)) coupon_amt = (reg_price * item_qty * 0.10);
            else coupon_amt = (reg_price * item_qty * 0.15);
        }
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (isgrin == 1) {
        if (id != 632713 && id != 78676) { coupon_amt = 10; }
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code == "pmac" || coupon_code == "pennymac") {
        if (id != 632713 && id != 78676) {
            if (parent_id == 118) coupon_amt = 150;
            else coupon_amt = 10;
        }
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code == "sleepopolis") {
        if (id != 632713 && id != 78676) { coupon_amt = 10; }
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code == "sleepfoundation") {
        if (id != 632713 && id != 78676) {
            if (parent_id == 118) coupon_amt = 10;
            else if (parent_id == 611172) coupon_amt = 20;
        }
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code == "sleepy10") {
        if (parent_id != 611172) { coupon_amt = 10; }
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code == "sleepy20") {
        if (parent_id == 611172) { coupon_amt = 20; }
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code == "redd" || coupon_code == "sleepstandards") {
        if (id != 632713 && id != 78676) {
            if (parent_id == 118) coupon_amt = 10;
            else if (parent_id == 611172) coupon_amt = 10;
        }
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code == 'yuliya100') {
        let var_arr = [1399, 611239, 128250];
        if (var_arr.includes(parent_id)) coupon_amt = sale_price;
        return { price: sale_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code == 'ascend100') {
        let var_arr = [31735, 723, 733504, 613011];
        if (var_arr.includes(parent_id)) coupon_amt = sale_price;
        return { price: sale_price, disc_amt: coupon_amt, qty: item_qty };;
    }
    else if (coupon_code == "idmecoupon" || coupon_code == "mil20off072021") {
        coupon_amt = (reg_price * item_qty * 0.20);
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code == "5wprkapok40") {
        if (parent_id == 14023) coupon_amt = (reg_price * item_qty * 0.40);
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code == "freeprotector" && parent_id == 611268) {
        let matt_qnty = 0, prot_qnty = 0;
        $("#order_line_items > tr.paid_item").each(function (tr_index, tr_row) {
            if ($(tr_row).data("pid") == 118 || $(tr_row).data("pid") == 611172) {
                matt_qnty += parseFloat($(tr_row).find("[name=txt_ItemQty]").val());
            }
        });
        if (item_qty > matt_qnty) { prot_qnty = matt_qnty; }
        else if (item_qty == matt_qnty) { prot_qnty = item_qty; }
        else if (item_qty < matt_qnty) { prot_qnty = item_qty; }
        else { prot_qnty = 0.00; }
        return { price: sale_price, disc_amt: 1.00, qty: prot_qnty };
    }
    else if (coupon_code == "kapok second pillow") {
        let kap_qnty = 0;
        $("#order_line_items > tr.paid_item").each(function (tr_index, tr_row) {
            if ($(tr_row).data("pid") == 14023) { kap_qnty += parseFloat($(tr_row).find("[name=txt_ItemQty]").val()); }
        });
        coupon_amt = (kap_qnty == 1) ? coupon_amt : 0;
        return { price: reg_price, disc_amt: coupon_amt, qty: 1 };
    }
    else if (coupon_code == "tsjpillow") {
        let kap_qnty = 0;
        $("#order_line_items > tr.paid_item").each(function (tr_index, tr_row) {
            if ($(tr_row).data("pid") == 14023) { kap_qnty += parseFloat($(tr_row).find("[name=txt_ItemQty]").val()); }
        });
        if (kap_qnty % 2 == 0) { $('#li_' + coupon_code).remove(); coupon_amt = 0; }
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code.includes("sales10off")) {
        return { price: reg_price, disc_amt: coupon_amt, qty: 1 };
    }
    else {
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
}
function check_applied_coupon(coupon_code, product_ids, exclude_product_ids) {
    let check = false, rq_prd_ids = [], exclude_ids = [], cart_matt_ids = [], cart_prnt_ids = [];
    $('#order_line_items > tr').each(function (index, row) {
        if ($(row).data('pid') == "118" || $(row).data('pid') == "611172") cart_matt_ids.push($(row).data('pid'));
        else cart_prnt_ids.push($(row).data('pid'));
        cart_prnt_ids.push($(row).data('vid'));
    });
    //console.log(cart_matt_ids, cart_prnt_ids);
    if (coupon_code.includes("sales10off")) { if (!cart_prnt_ids.includes(118) && !cart_prnt_ids.includes(611172)) return true; }
    else if (coupon_code.includes("sales25off")) { if (cart_matt_ids.includes(118)) return true; }
    else if (coupon_code.includes("sales50off")) { if (cart_matt_ids.includes(611172)) return true; }
    else if (coupon_code.includes("sales75off")) {
        if (cart_matt_ids.includes(611172) && (cart_prnt_ids.includes(20861) || cart_prnt_ids.includes(611252) || cart_prnt_ids.includes(733500))) return true;
    }
    else if (coupon_code.includes("sales100off")) {
        if (cart_prnt_ids.includes(611286) && (cart_matt_ids.includes(611172) || cart_matt_ids.includes(118))) return true;
    }
    else if (coupon_code.includes("sales125off")) { if (cart_matt_ids.includes(118) && cart_prnt_ids.includes(612995)) return true; }
    else if (coupon_code.includes("sales150off")) { if (cart_matt_ids.includes(611172) && cart_prnt_ids.includes(612995)) return true; }
    else if (coupon_code.includes("sales175off")) {
        if (cart_matt_ids.includes(118) && cart_prnt_ids.includes(612995) && (
            cart_prnt_ids.includes(56774) || cart_prnt_ids.includes(611268) ||
            cart_prnt_ids.includes(612947) || cart_prnt_ids.includes(612955) ||
            cart_prnt_ids.includes(611220)
        ))
            return true;
    }
    else if (coupon_code.includes("sales200off")) {
        if (cart_matt_ids.includes(611172) && cart_prnt_ids.includes(612995) && (
            cart_prnt_ids.includes(56774) || cart_prnt_ids.includes(611268) ||
            cart_prnt_ids.includes(612947) || cart_prnt_ids.includes(612955) ||
            cart_prnt_ids.includes(611220)
        ))
            return true;
    }
    else {
        if (product_ids != "" && product_ids != null) {
            rq_prd_ids = product_ids.split(",").map((el) => parseInt(el));
        }
        if (exclude_product_ids != "" && exclude_product_ids != null) {
            exclude_ids = exclude_product_ids.split(",").map((el) => parseInt(el));
        }
        $("#order_line_items > tr.paid_item").each(function (index, row) {
            let pid = $(row).data('pid'), vid = $(row).data('vid');
            if (!exclude_ids.includes(pid) && !exclude_ids.includes(vid) && ((rq_prd_ids.includes(pid) || rq_prd_ids.includes(vid)) || rq_prd_ids == 0)) {
                check = true;
            }
        });
        return check;
    }
    return check;
}
function getAllCoupons() {
    var coupons = [];
    $('#billCoupon li').each(function (index) { coupons.push($(this).data('coupon')); });
    return coupons;
}
function deleteSaleCoupon() {
    let cart_other_mrt_ids = [], cart_prnt_ids = [];
    $('#order_line_items > tr.paid_item').each(function (index, row) {
        if ($(row).data('pid') != "118" && $(row).data('pid') != "611172") { cart_other_mrt_ids.push($(row).data('pid')); cart_other_mrt_ids.push($(row).data('vid')); }
        cart_prnt_ids.push($(row).data('pid')); cart_prnt_ids.push($(row).data('vid'));
    });
    if (cart_prnt_ids.includes(118) && cart_prnt_ids.includes(611172) && cart_other_mrt_ids.length == 0) { $('[id*="li_sales10off"]').remove() };
    if (cart_prnt_ids.includes(118)) { } else { $('[id*="li_sales25off"]').remove(); }
    if (cart_prnt_ids.includes(611172)) { } else { $('[id*="li_sales50off"]').remove(); }
    if (cart_prnt_ids.includes(611172) && (cart_prnt_ids.includes(20861) || cart_prnt_ids.includes(611252) || cart_prnt_ids.includes(733500))) { } else $('[id*="li_sales75off"]').remove();
    if (cart_prnt_ids.includes(611286) && (cart_prnt_ids.includes(611172) || cart_prnt_ids.includes(118))) { } else $('[id*="li_sales100off"]').remove();
    if (cart_prnt_ids.includes(118) && cart_prnt_ids.includes(612995)) { } else { $('[id*="li_sales125off"]').remove(); }
    if (cart_prnt_ids.includes(611172) && cart_prnt_ids.includes(612995)) { } else { $('[id*="li_sales125off"]').remove(); }
    if (cart_prnt_ids.includes(118) && cart_prnt_ids.includes(612995) && (cart_prnt_ids.includes(56774) || cart_prnt_ids.includes(611268) || cart_prnt_ids.includes(612947) || cart_prnt_ids.includes(612955) || cart_prnt_ids.includes(611220))) { }
    else { $('[id*="li_sales175off"]').remove(); }
    if (cart_prnt_ids.includes(611172) && cart_prnt_ids.includes(612995) && (cart_prnt_ids.includes(56774) || cart_prnt_ids.includes(611268) || cart_prnt_ids.includes(612947) || cart_prnt_ids.includes(612955) || cart_prnt_ids.includes(611220))) { }
    else { $('[id*="li_sales200off"]').remove(); }
}
function ApplyAutoCoupon() {
    var cart_prnt_ids = [];
    $("#order_line_items  > tr").each(function () { var pid = $(this).data('pid'); cart_prnt_ids.push(pid); });
    if (!cart_prnt_ids.includes(118) || !cart_prnt_ids.includes(20861)) { $('#li_matt-found').remove(); }
    if (!cart_prnt_ids.includes(118) || !cart_prnt_ids.includes(56774)) { $('#li_matt-topper').remove(); }
    if (!cart_prnt_ids.includes(118) || !cart_prnt_ids.includes(31729)) { $('#li_matt-bedframe').remove(); }
    if (!cart_prnt_ids.includes(118) || !cart_prnt_ids.includes(124524)) { $('#li_matt-sheet').remove(); }
    if (!cart_prnt_ids.includes(118) || !cart_prnt_ids.includes(128244)) { $('#li_matt-blanket').remove(); }
    if (!cart_prnt_ids.includes(118) || !cart_prnt_ids.includes(14023)) { $('#li_matt-pillow').remove(); }
    if (!cart_prnt_ids.includes(31729) || !cart_prnt_ids.includes(20861)) { $('#li_found-frame').remove(); }
    let auto_code = [];
    if (cart_prnt_ids.includes(118)) {
        if (cart_prnt_ids.includes(20861)) {
            let coupon_list = auto_coupon.filter(element => element.post_title == "matt-found");
            if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
        }
        if (cart_prnt_ids.includes(56774)) {
            let coupon_list = auto_coupon.filter(element => element.post_title == "matt-topper");
            if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
        }
        if (cart_prnt_ids.includes(31729)) {
            let coupon_list = auto_coupon.filter(element => element.post_title == "matt-bedframe");
            if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
        }
        if (cart_prnt_ids.includes(124524)) {
            let coupon_list = auto_coupon.filter(element => element.post_title == "matt-sheet");
            if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
        }
        if (cart_prnt_ids.includes(128244)) {
            let coupon_list = auto_coupon.filter(element => element.post_title == "matt-blanket");
            if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
        }
        if (cart_prnt_ids.includes(14023)) {
            let coupon_list = auto_coupon.filter(element => element.post_title == "matt-pillow");
            if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
        }
    }
    if (cart_prnt_ids.includes(31729) && cart_prnt_ids.includes(20861)) {
        let coupon_list = auto_coupon.filter(element => element.post_title == "found-frame");
        if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
    }
    var cart_coupons = getAllCoupons();
    //14023 - Layla Kapok Pillow
    if (cart_prnt_ids.includes(14023) && !cart_coupons.includes('melanieff35') && !cart_coupons.includes('idmecoupon') && !cart_coupons.includes('ffdbmatt01ck0621') && !cart_coupons.includes('ffrphybr01q0621')) {
        let coupon_list = auto_coupon.filter(element => element.post_title == "kapok-pillow");
        if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
    }
    if (auto_code.length > 0) { bindCouponList(auto_code); }
}
function ApplyCoupon() {
    let coupon_code = $("#txt_Coupon").val().toLowerCase().trim();
    if ($('#li_' + coupon_code).length > 0) { swal('Alert!', 'Coupon code already applied!', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; };

    let autocode = ["cbdistillery", "thesleepadvisor", "tuck", "rv10", "rizslumber", "bestsleep10", "get140", "calm", "relax", "cupid110", "sleepopolis", "tv140", "pennymac", "pnmac", "sleepfoundation", "matt-topper", "matt-sheet", "matt-blanket", "matt-pillow", "matt-bedframe", "matt-found", "found-frame", "sleepy10", "sleepy20"];
    let monthlySaleCoupon = ["sales10off", "sales25off", "sales50off", "sales75off", "sales100off", "sales125off", "sales150off", "sales175off", "sales200off", "cxstaff20off", "mgr20off", "mgr50off"];
    let is_monthly_sale_cpn = monthlySaleCoupon.some(el => coupon_code.includes(el));

    if (coupon_code == '') { swal('Alert!', 'Please Enter a Coupon Code.', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
    else if (autocode.includes(coupon_code)) { swal('Alert!', 'Cannot Add this Auto-Coupon.', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
    //else if (is_monthly_sale_cpn) { swal('Alert!', 'Can not add ' + coupon_code, "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
    else {
        if (coupon_code == 'forbes') { swal('Alert!', 'Can not add ' + coupon_code, "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
        else if (coupon_code == 'slumber') { swal('Alert!', 'Can not add ' + coupon_code, "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
    }
    let billing_email = $("#txtbillemail").val().toLowerCase();
    let add_coupon_count = 0;
    $('#billCoupon li').each(function (index, li) {
        if ($(li).data('type') == 'add_coupon') { add_coupon_count += 1; }
    });
    if (add_coupon_count > 0) { swal('Alert!', 'Cannot add any other Coupon.', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; };
    if (coupon_code.includes("tsjpillow")) {
        let cou_details = Coupon_get_discount_amount(0, 0, coupon_code, 25, 0, 0, 0); //console.log(cou_details);
        if (cou_details.disc_amt == 0) { swal('Alert!', 'Cannot add ' + coupon_code, "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; };
    }

    let obj = { strValue1: coupon_code };
    $.ajax({
        type: "POST", url: '/Orders/GetCouponAmount', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        success: function (result) {
            var data = JSON.parse(result);
            if (data.length == 0) { swal('Alert!', 'Invalid code entered. Please try again.', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
            if (data[0].use_it == false) { swal('Alert!', 'Invalid code entered. Please try again.', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
            //Check valid for email
            if (data[0].cus_email.length && data[0].cus_email != '') {
                var get_email_arr = res[0].cus_email;
                if (billing_email != '') {
                    if (get_email_arr.includes(billing_email)) {
                    } else {
                        swal('Alert!', 'Coupon cannot be added for this email.', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false;
                    }
                } else {
                    swal('Alert!', 'Please enter a billing email.', "info").then((result) => { $('#txtbillemail').focus(); return false; }); return false;
                }
            }
            //check expires date
            if (data[0].date_expires != "" && data[0].date_expires != null) {
                let exp_date = new Date(data[0].date_expires * 1000);
                let today = new Date();
                if (exp_date < today) {
                    swal('Alert!', 'Coupon code has been expired.', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false;
                }
            }
            data[0].coupon_amount = parseFloat(data[0].coupon_amount) || 0.00;
            data[0].limit_x_items = parseInt(data[0].limit_x_items) || 0;

            if (!check_applied_coupon(coupon_code, data[0].product_ids, data[0].exclude_product_ids)) {
                swal('Alert!', 'Can not add ' + coupon_code, "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false;
            }
            //console.log(data[0]);
            let cpns_with_other_cpns = ["freeprotector", "founder50", "kapok second pillow", "tsjpillow"];//not remove other coupon
            if (coupon_code.includes("friend") && coupon_code.substr(6) > 8500) { deleteAllCoupons('friend_diff'); }
            else if (coupon_code.includes("friend") && coupon_code.substr(6) <= 8500) { deleteAllCoupons('friend_auto'); }
            else if (coupon_code.includes("sales10off") || cpns_with_other_cpns.includes(coupon_code) || (coupon_code.includes("vip") && data[0].individual_use == "no")) { }
            else {
                if (data[0].individual_use == "yes") { deleteAllCoupons('all'); }
                if (data[0].discount_type != "fixed_cart") { deleteAllCoupons('diff'); }
            }
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

        //var zPCnt = 0, rq_prd_ids = [], zExcPCnt = 0, exclude_ids = [];
        //if (data[0].exclude_product_ids != "" && data[0].exclude_product_ids != null) {
        //    exclude_ids = data[0].exclude_product_ids.split(",").map((el) => parseInt(el));
        //}
        //if (data[0].product_ids != "" && data[0].product_ids != null) {
        //    rq_prd_ids = data[0].product_ids.split(",").map((el) => parseInt(el));
        //}
        //get pdorduct
        //$("#order_line_items > tr").each(function () {
        //    if (jQuery.inArray($(this).data("vid").toString(), zProductIDs) != -1) { zPCnt++; }
        //    if (jQuery.inArray($(this).data("vid").toString(), zExcludeProductIDs) == -1) { zExcPCnt++; }
        //});

        //if (zPCnt == 0 && zExcPCnt == 0) { swal('Alert!', 'Invalid code entered. Please try again.!', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
        for (var i = 0; i < data.length; i++) {
            if ($('#li_' + data[i].post_title).length <= 0) {
                let cou_amt = parseFloat(data[i].coupon_amount) || 0.00;
                layoutHtml = '<li id="li_' + data[i].post_title.toString().toLowerCase().replaceAll(' ', '_') + '" class="' + (data[i].discount_type == 'fixed_cart' ? 'cart' : 'items') + '" data-coupon= "' + data[i].post_title + '" data-couponamt= "' + data[i].coupon_amount + '" data-disctype= "' + data[i].discount_type + '" data-rqprdids= "' + data[i].product_ids + '" data-excludeids= "' + data[i].exclude_product_ids + '" data-type= "' + data[i].type + '" data-orderitemid="0">';
                layoutHtml += '<a href="javascript:void(0);">';
                layoutHtml += '<i class="fa fa-gift"></i>';
                layoutHtml += '<span>' + data[i].title.toString().toLowerCase() + '</span>';
                layoutHtml += '<div class="pull-right">';

                if (data[0].type == 'add_coupon') {
                    layoutHtml += '$<span id="cou_discamt">' + cou_amt.toFixed(2) + '</span>';
                    layoutHtml += '<button type="button" class="btn btn-box-tool pull-right" onclick="deleteAllCoupons(\'' + data[i].post_title.toString().toLowerCase() + '\');">';
                    layoutHtml += '<i class="fa fa-times"></i>';
                    layoutHtml += '</button>';
                }
                else {
                    layoutHtml += '$<span id="cou_discamt" style ="margin-right: 20px;">' + cou_amt.toFixed(2) + '</span>';
                }
                layoutHtml += '</div>';
                layoutHtml += '</a>';
                layoutHtml += '</li>';
                //console.log(data[i].post_title, data[i].coupon_amount);
                $('#billCoupon').append(layoutHtml);
            }
            else {
                if (data[0].type == 'add_coupon') {
                    swal('Alert!', 'Coupon code already applied!', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false;
                }
                else if (data[i].type == 'diff') {
                    let rq_prd_ids = [];
                    if ($('#li_' + data[i].post_title).data('rqprdids') != "" && $('#li_' + data[i].post_title).data('rqprdids') != null) {
                        rq_prd_ids = $('#li_' + data[i].post_title).data('rqprdids').split(",").map((el) => parseInt(el));
                    }
                    rq_prd_ids.push(data[i].product_ids);
                    $('#li_' + data[i].post_title).data('rqprdids', rq_prd_ids.join(','));
                    //swal('Alert!', 'Coupon code already applied!', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false;
                }
            }
        }
        calculateDiscountAcount();
        $("#billModal").modal('hide');
    }
    //else {
    //    var msg = 'Coupon "' + code + '" does not exist!';
    //    swal('Alert!', msg, "info");
    //}
}
function deleteAllCoupons(coupon_type) {
    if (coupon_type == 'all') {
        $('#billCoupon').empty();
        calculateDiscountAcount();
    }
    else if (coupon_type == 'diff') {
        let tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00;
        $('#billCoupon li').each(function (index) {
            if ($(this).data('type') == 'diff') {
                let id = $(this).data('coupon');
                let rq_prd_ids = [];
                if ($(this).data('rqprdids') != "" && $(this).data('rqprdids') != null) {
                    rq_prd_ids = $(this).data('rqprdids').split(",").map((el) => parseInt(el));
                }
                $('#li_' + id).remove();
                for (var i = 0; i < rq_prd_ids.length; i++) {
                    let row_id = '#tritemId_' + id + '_' + rq_prd_ids[i];
                    //Remove Discount to Items
                    let zQty = parseFloat($(row_id).find("[name=txt_ItemQty]").val()) || 0.00;
                    let zGrossAmount = parseFloat($(row_id).find(".TotalAmount").data("regprice")) || 0.00;
                    zGrossAmount = zGrossAmount * zQty;
                    $(row_id).find(".TotalAmount").data("amount", zGrossAmount.toFixed(2)); $(row_id).find(".TotalAmount").text(zGrossAmount.toFixed(2));

                    $(row_id).find(".RowDiscount").data("disctype", 'fixed');
                    $(row_id).find(".RowDiscount").data("couponamt", 0.00);
                    $(row_id).find(".RowDiscount").text(0.00); $(row_id).find(".TotalAmount").data("discount", 0.00);

                    //Taxation                     
                    zTotalTax = ((zGrossAmount * tax_rate) / 100);
                    $(row_id).find(".RowTax").text(zTotalTax.toFixed(2)); $(row_id).find(".TotalAmount").data("taxamount", zTotalTax.toFixed(2));
                }
            }
        });
    }
    else if (coupon_type == 'friend_diff') {
        let tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00;
        $('#li_118').remove(); $('#li_611172').remove();
        //$('#billCoupon li').each(function (index, li) {
        //    if ($(li).data('type') == 'diff' && ($(li).data('coupon') == '118' || $(li).data('coupon') == '611172')) {
        //        let id = $(li).data('coupon'), rq_prd_ids = [];
        //        if ($(li).data('rqprdids') != "" && $(li).data('rqprdids') != null) {
        //            rq_prd_ids = $(li).data('rqprdids').split(",").map((el) => parseInt(el));
        //        }
        //        $('#li_' + id).remove();
        //        for (let i = 0; i < rq_prd_ids.length; i++) {
        //            let row_id = '#tritemId_' + id + '_' + rq_prd_ids[i];
        //            //Remove Discount to Items
        //            let zQty = parseFloat($(row_id).find("[name=txt_ItemQty]").val()) || 0.00;
        //            let zGrossAmount = parseFloat($(row_id).find(".TotalAmount").data("regprice")) || 0.00;
        //            zGrossAmount = zGrossAmount * zQty;
        //            $(row_id).find(".TotalAmount").data("amount", zGrossAmount.toFixed(2)); $(row_id).find(".TotalAmount").text(zGrossAmount.toFixed(2));

        //            $(row_id).find(".RowDiscount").data("disctype", 'fixed');
        //            $(row_id).find(".RowDiscount").data("couponamt", 0.00);
        //            $(row_id).find(".RowDiscount").text(0.00); $(row_id).find(".TotalAmount").data("discount", 0.00);

        //            //Taxation                     
        //            zTotalTax = ((zGrossAmount * tax_rate) / 100);
        //            $(row_id).find(".RowTax").text(zTotalTax.toFixed(2)); $(row_id).find(".TotalAmount").data("taxamount", zTotalTax.toFixed(2));
        //        }
        //    }
        //});
    }
    else if (coupon_type == 'friend_auto') {
        $('#li_118').remove(); $('#li_611172').remove(); $("#billCoupon").find("[data-type='auto_coupon']").remove();
    }
    else if (coupon_type != '') {
        swal({ title: "Are you sure?", text: 'Would you like to Remove this Coupon?', type: "question", showCancelButton: true })
            .then((result) => {
                if (result.value) {
                    //Remove Coupon
                    $('#li_' + coupon_type.replaceAll(' ', '_')).remove();
                    let auto_code = [];
                    let tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00;
                    $("#order_line_items > tr.paid_item").each(function (index, tr) {
                        //Discout Not Apply in free items
                        if (!$(tr).data('freeitem')) {
                            let row_key = $(tr).data('id'), pid = $(tr).data('pid'), vid = $(tr).data('vid');
                            let zQty = parseFloat($(tr).find("[name=txt_ItemQty]").val()) || 0.00;
                            let reg_price = parseFloat($(tr).find(".TotalAmount").data("regprice")) || 0.00;
                            let sale_price = parseFloat($(tr).find(".TotalAmount").data("salerate")) || 0.00;
                            var coupon_amt = 0.00, disc_amt = 0.00;
                            //get diff Coupon
                            if (reg_price > sale_price) {
                                coupon_amt = (reg_price - sale_price);
                                let coupon_list = auto_coupon.filter(element => element.post_title == pid);
                                if (coupon_list.length > 0) {
                                    coupon_list[0].coupon_amount = coupon_amt;
                                    if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
                                }
                            }
                            //14023 - Layla Kapok Pillow
                            if (pid == 14023 && $('#li_melanieff35').length <= 0 && $('#li_idmecoupon').length <= 0 && $('#li_ffdbmatt01ck0621').length <= 0 && $('#li_ffrphybr01q0621').length <= 0) {
                                let coupon_list = auto_coupon.filter(element => element.post_title == "kapok-pillow");
                                if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
                            }

                            let zGrossAmount = reg_price * zQty;
                            disc_amt = coupon_amt * zQty;
                            $(tr).find(".TotalAmount").data("amount", zGrossAmount.toFixed(2)); $(tr).find(".TotalAmount").text(zGrossAmount.toFixed(2));

                            $(tr).find(".RowDiscount").data("disctype", 'fixed'); $(tr).find(".RowDiscount").data("couponamt", coupon_amt.toFixed(2));
                            $(tr).find(".RowDiscount").text(disc_amt.toFixed(2)); $(tr).find(".TotalAmount").data("discount", disc_amt.toFixed(2));
                            zTotalTax = (((zGrossAmount - disc_amt) * tax_rate) / 100);
                            $(tr).find(".RowTax").text(zTotalTax.toFixed(2)); $(tr).find(".TotalAmount").data("taxamount", zTotalTax.toFixed(2));
                        }
                    }); //console.log(auto_code);
                    $.when(bindCouponList(auto_code)).done(function () { ApplyAutoCoupon(); });
                }
            });
    }
}
function freeQtyUpdate() {
    $("#order_line_items > tr.free_item").each(function (index, row) {
        let zQty = 0.00, pid = parseInt($(this).data("pid")) || 0;
        $("#order_line_items  > tr.paid_item").each(function (pindex, prow) {
            if ($(prow).data('freeitems')[pid] != undefined) {
                zQty += parseFloat($(prow).find("[name=txt_ItemQty]").val()) * parseFloat($(prow).data('freeitems')[pid]);
            }
        });
        if (zQty <= 0)
            $('#tritemId_' + $(row).data('id')).remove();
        else
            $(row).find("[name=txt_ItemQty]").val(zQty.toFixed(0));
    });
}
function calculateDiscountAcount() {
    freeQtyUpdate();
    let tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00, tax_sr_rate = parseFloat($('#hfTaxRate').data('srfee')) || 0.00;
    let zCartDisAmt = 0.00, perqty_discamt = 0.00, paid_qty = 0.00, zStateRecyclingAmt = 0.00;
    $('#billCoupon li.cart').each(function (index, li) {
        let zCouponAmt = parseFloat($(li).data('couponamt')) || 0.00;
        if ($(li).data('coupon').toString().toLowerCase().includes("tsjpillow")) {
            let cou_details = Coupon_get_discount_amount(0, 0, $(li).data('coupon').toString().toLowerCase(), zCouponAmt, 0, 0, 0);
            zCouponAmt = cou_details.disc_amt;
        }
        zCartDisAmt = zCartDisAmt + zCouponAmt;
        $(li).find("#cou_discamt").text(zCouponAmt.toFixed(2));
    });
    $("#order_line_items > tr.paid_item").each(function (index, row) { paid_qty += parseFloat($(row).find("[name=txt_ItemQty]").val()) || 0.00; });
    perqty_discamt = (zCartDisAmt / paid_qty).toFixed(2); perqty_discamt = perqty_discamt > 0 ? perqty_discamt : 0;
    //Without Coupon calculate
    $("#order_line_items > tr.paid_item").each(function (index, row) {
        let zQty = 0.00, zRegPrice = 0.00, zDisAmt = 0.00, zGrossAmount = 0.00;
        zQty = parseFloat($(row).find("[name=txt_ItemQty]").val()) || 0.00;
        zRegPrice = parseFloat($(row).find(".TotalAmount").data("regprice")) || 0.00;
        zGrossAmount = zRegPrice * zQty;
        if (zGrossAmount > 0) { zDisAmt = perqty_discamt * zQty; }
        else { zDisAmt = 0 }
        $(row).find(".TotalAmount").data("amount", zGrossAmount.toFixed(2)); $(row).find(".TotalAmount").text(zGrossAmount.toFixed(2));
        $(row).find(".RowDiscount").data("disctype", 'fixed'); $(row).find(".RowDiscount").data("couponamt", perqty_discamt);
        $(row).find(".RowDiscount").text(zDisAmt); $(row).find(".TotalAmount").data("discount", zDisAmt);
        $(row).find(".RowDiscount").data("lastdiscount", 0.00);
        zTotalTax = (zGrossAmount - zDisAmt) * tax_rate;
        $(row).find(".RowTax").text(zTotalTax.toFixed(2)); $(row).find(".TotalAmount").data("taxamount", zTotalTax.toFixed(2));
        let sr_fee = parseFloat($(row).data("srfee")) || 0.00, sristaxable = $(row).data("sristaxable");
        if (sristaxable) zStateRecyclingAmt += (zQty * sr_fee) + (zQty * sr_fee * tax_sr_rate)
        else zStateRecyclingAmt += (zQty * sr_fee);
    });
    $("#stateRecyclingFeeTotal").text(zStateRecyclingAmt.toFixed(2));
    $('#order_state_recycling_fee_line_items').find(".TotalAmount").text(zStateRecyclingAmt.toFixed(2));
    let is_sales = $("#billCoupon").find("[data-coupon='sales20off']").length;
    //Calculate discount
    $('#billCoupon li.items').each(function (index, li) {
        let cou_amt = 0.00, cou = $(li).data('coupon').toString().toLowerCase();
        let zCouponAmt = parseFloat($(li).data('couponamt')) || 0.00, zDiscType = $(li).data('disctype'), zType = $(li).data('type'), zQty = 0.00, zRegPrice = 0.00, zSalePrice = 0.00, zGrossAmount = 0.00, zDisAmt = 0.00;

        let rq_prd_ids = [], exclude_ids = [];
        if ($(li).data('excludeids') != "" && $(li).data('excludeids') != null) {
            exclude_ids = $(li).data('excludeids').toString().split(",").map((el) => parseInt(el));
        }
        if ($(li).data('rqprdids') != "" && $(li).data('rqprdids') != null) {
            rq_prd_ids = $(li).data('rqprdids').toString().split(",").map((el) => parseInt(el));
        }
        $("#order_line_items > tr.paid_item").each(function (index, row) {
            let pid = $(row).data('pid'), vid = $(row).data('vid'), row_perqty_discamt = 0.00, row_disc = 0.00;
            if (!exclude_ids.includes(pid) && !exclude_ids.includes(vid) && ((rq_prd_ids.includes(pid) || rq_prd_ids.includes(vid)) || rq_prd_ids == 0)) {
                row_perqty_discamt = parseFloat($(row).find(".RowDiscount").data("couponamt")) || 0.00;
                row_disc = parseFloat($(row).find(".RowDiscount").data("lastdiscount")) || 0.00;
                zQty = parseFloat($(row).find("[name=txt_ItemQty]").val()) || 0.00;
                zRegPrice = parseFloat($(row).find(".TotalAmount").data("regprice")) || 0.00;
                zSalePrice = parseFloat($(row).find(".TotalAmount").data("salerate")) || 0.00;
                zGrossAmount = zRegPrice * zQty;
                $(row).find(".TotalAmount").data("amount", zGrossAmount.toFixed(2)); $(row).find(".TotalAmount").text(zGrossAmount.toFixed(2));
                ////Coupun Type 'diff' and DiscType not equal '2x_percent' (CouponAmt = RegPrice - SalePrice)
                if (zType == 'diff' && is_sales == 0) {
                    if (zDiscType != '2x_percent') zCouponAmt = (zRegPrice - zSalePrice) > 0 ? (zRegPrice - zSalePrice) : 0.00;
                }
                else if (zType == 'diff' && is_sales > 0) zCouponAmt = 0.00;

                //else { zCouponAmt = 0.00; }
                let cou_details = Coupon_get_discount_amount((vid > 0 ? vid : pid), pid, cou, zCouponAmt, zQty, zRegPrice, zSalePrice);

                if (zDiscType == 'fixed_product') { zDisAmt = cou_details.disc_amt * cou_details.qty; }
                else if (zDiscType == 'fixed_cart') { zDisAmt = cou_details.disc_amt * cou_details.qty; }
                else if (zDiscType == 'percent') {
                    if (pid == 14023) zDisAmt = ((cou_details.price * cou_details.qty) - row_disc) * (cou_details.disc_amt / 100);
                    else zDisAmt = (cou_details.price * cou_details.qty) * (cou_details.disc_amt / 100);
                }
                else if (zDiscType == '2x_percent') { zDisAmt = ((zRegPrice * zCouponAmt) / 100) * Math.floor(zQty / 2); }
                //console.log(cou, cou_details, zDisAmt);
                //if (zDiscType == 'fixed_product') { zDisAmt = zCouponAmt * zQty; }
                //else if (zDiscType == 'fixed_cart') { zDisAmt = zCouponAmt * zQty; }
                //else if (zDiscType == 'percent') { zDisAmt = (zGrossAmount * zCouponAmt) / 100; }
                //else if (zDiscType == '2x_percent') { zDisAmt = ((zRegPrice * zCouponAmt) / 100) * Math.floor(zQty / 2); }

                //Coupon Amount Total                        
                cou_amt += zDisAmt;
                $(row).find(".RowDiscount").data("lastdiscount", (row_disc + zDisAmt));
                $(row).find(".TotalAmount").data("discount", zDisAmt.toFixed(2)); $(row).find(".RowDiscount").data("disctype", 'fixed');
                zDisAmt = row_disc + zDisAmt + (row_perqty_discamt * zQty);
                //$(row).find(".RowDiscount").data("couponamt", zDisAmt);
                $(row).find(".RowDiscount").text(zDisAmt.toFixed(2));
                //Taxation                     
                zTotalTax = (zGrossAmount - zDisAmt) * tax_rate;
                $(row).find(".RowTax").text(zTotalTax.toFixed(2)); $(row).find(".TotalAmount").data("taxamount", zTotalTax.toFixed(2));
            }
        });
        //update Coupon Amount
        $(li).find("#cou_discamt").text(cou_amt.toFixed(2))
        if ($(li).data('type') == 'diff' && cou_amt > 0) $(li).removeClass('hidden');
        else if ($(li).data('type') == 'diff') $(li).addClass('hidden');
        //if (zDiscType == '2x_percent' && cou_amt > 0) $(li).removeClass('hidden');
        //else if (zDiscType == '2x_percent') $(li).addClass('hidden');
        //else if ($(li).data('type') == 'diff' && zDiscType != '2x_percent' && cou_amt <= 0) $(li).remove();
        //if (cou_amt == 0) $('#li_' + cou).remove();
        //if (cou_amt == 0) deleteAllCoupons(cou);
    });
    calcFinalTotals();
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Shipping Charges ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getItemShippingCharge(isFinalcal) {
    let p_ids = [], v_ids = [];
    $("#order_line_items  > tr.paid_item").each(function () { p_ids.push($(this).data('pid')); v_ids.push($(this).data('vid')); });
    if (p_ids.join(',').length > 0 || v_ids.join(',').length > 0) {
        $("#loader").show();
        let options = { strValue1: p_ids.join(','), strValue2: v_ids.join(','), strValue3: $("#ddlshipcountry").val(), strValue4: $("#ddlshipstate").val() };
        $(".TotalAmount").data("shippingamt", 0.00);

        $.when(GetSRTaxRate()).done(function () {
            $.post('/Orders/GetProductShipping', options).then(response => {
                response = JSON.parse(response);
                $("#order_line_items > tr.paid_item").each(function (index, tr) {
                    let proudct_item = response['Table'].find(el => el.vid === $(tr).data('vid'));
                    if (proudct_item != null) { $(tr).find(".TotalAmount").data("shippingamt", proudct_item.fee); }
                    else { $(tr).find(".TotalAmount").data("shippingamt", 0.00); }
                    let proudct_sr = response['Table1'].find(el => el.pid === $(tr).data('pid'));
                    if (proudct_sr != null) { $(tr).data("srfee", proudct_sr.fee); $(tr).data("sristaxable", !!parseInt(proudct_sr.is_taxable)); }
                    else { $(tr).data("srfee", 0.00); $(tr).data("sristaxable", false); }
                });
            }).then(response => { if (isFinalcal) calculateDiscountAcount(); }).catch(err => { $("#loader").hide(); swal('Error!', err, 'error'); }).always(function () { $("#loader").hide(); });
        });


    }
}
function calculateStateRecyclingFee() {
    let ship_state = $("#ddlshipstate").val(), tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00;
    let zStateRecyclingAmt = 0.00, matCount = 0;
    $("#order_line_items > tr").each(function () {
        if (recycling_item.includes($(this).data('pid'))) { matCount = matCount + (parseInt($(this).find("[name=txt_ItemQty]").val()) || 0.00); }
    });

    if (ship_state == "CA") { zStateRecyclingAmt = matCount * 10.5; }
    else if (ship_state == "CT") { zStateRecyclingAmt = (matCount * 11.75) + (matCount * 11.75 * tax_rate); }
    else if (ship_state == "RI") { zStateRecyclingAmt = (matCount * 16) + (matCount * 16 * tax_rate); }
    $("#stateRecyclingFeeTotal").text(zStateRecyclingAmt.toFixed(2));
    $('#order_state_recycling_fee_line_items').find(".TotalAmount").text(zStateRecyclingAmt.toFixed(2));
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Post and Post Meta (Save/Update) ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function createPostMeta() {
    var oid = $('#hfOrderNo').val();
    var postMetaxml = [];
    postMetaxml.push(
        { post_id: oid, meta_key: '_customer_user', meta_value: parseInt($('#ddlUser').val()) || 0 },
        { post_id: oid, meta_key: '_billing_company', meta_value: $('#txtbillcompany').val() }, { post_id: oid, meta_key: '_shipping_company', meta_value: $('#txtshipcompany').val() },
        { post_id: oid, meta_key: '_billing_first_name', meta_value: $('#txtbillfirstname').val() }, { post_id: oid, meta_key: '_billing_last_name', meta_value: $('#txtbilllastname').val() },
        { post_id: oid, meta_key: '_billing_address_1', meta_value: $('#txtbilladdress1').val() }, { post_id: oid, meta_key: '_billing_address_2', meta_value: $('#txtbilladdress2').val() },
        { post_id: oid, meta_key: '_billing_city', meta_value: $('#txtbillcity').val() }, { post_id: oid, meta_key: '_billing_state', meta_value: $('#ddlbillstate').val() },
        { post_id: oid, meta_key: '_billing_postcode', meta_value: $('#txtbillzipcode').val() }, { post_id: oid, meta_key: '_billing_country', meta_value: $('#ddlbillcountry').val() },
        { post_id: oid, meta_key: '_billing_email', meta_value: $('#txtbillemail').val() }, { post_id: oid, meta_key: '_billing_phone', meta_value: $('#txtbillphone').val().replace(/[^\d]/g, '') },
        { post_id: oid, meta_key: '_shipping_first_name', meta_value: $('#txtshipfirstname').val() }, { post_id: oid, meta_key: '_shipping_last_name', meta_value: $('#txtshiplastname').val() },
        { post_id: oid, meta_key: '_shipping_address_1', meta_value: $('#txtshipaddress1').val() }, { post_id: oid, meta_key: '_shipping_address_2', meta_value: $('#txtshipaddress2').val() },
        { post_id: oid, meta_key: '_shipping_city', meta_value: $('#txtshipcity').val() }, { post_id: oid, meta_key: '_shipping_state', meta_value: $('#ddlshipstate').val() },
        { post_id: oid, meta_key: '_shipping_postcode', meta_value: $('#txtshipzipcode').val() }, { post_id: oid, meta_key: '_shipping_country', meta_value: $('#ddlshipcountry').val() },
        { post_id: oid, meta_key: '_shipping_email', meta_value: '' }, { post_id: oid, meta_key: '_shipping_phone', meta_value: '' },
        { post_id: oid, meta_key: '_order_total', meta_value: parseFloat($('#orderTotal').text()) || 0.00 }, { post_id: oid, meta_key: '_cart_discount', meta_value: parseFloat($('#discountTotal').text()) || 0.00 },
        { post_id: oid, meta_key: '_cart_discount_tax', meta_value: '0' }, { post_id: oid, meta_key: '_order_shipping', meta_value: parseFloat($('#shippingTotal').text()) || 0.00 },
        { post_id: oid, meta_key: '_order_shipping_tax', meta_value: '0' }, { post_id: oid, meta_key: '_order_tax', meta_value: parseFloat($('#salesTaxTotal').text()) || 0.00 }
    );
    if ($('#ddlStatus').val() == 'wc-on-hold') { postMetaxml.push({ post_id: oid, meta_key: '_release_date', meta_value: $('#txtReleaseDate').val() }); }
    else { postMetaxml.push({ post_id: oid, meta_key: '_release_date', meta_value: '' }); }
    return postMetaxml;
}
function createPostStatus() {
    let postStatus = {
        order_id: parseInt($('#hfOrderNo').val()) || 0, parent_id: 0, returning_customer: 0,
        customer_id: parseInt($('#ddlUser').val()) || 0,
        num_items_sold: parseInt($('#totalQty').text()) || 0,
        total_sales: parseFloat($('#orderTotal').text()) || 0.00,
        tax_total: parseFloat($('#salesTaxTotal').text()) || 0.00,
        shipping_total: parseFloat($('#shippingTotal').text()) || 0.00,
        net_total: (parseFloat($('#orderTotal').text()) || 0.00) - (parseFloat($('#salesTaxTotal').text()) || 0.00),
        status: $('#ddlStatus').val(), Search: $('#txtCustomerNotes').val()
    };
    return postStatus;
}
function createOtherItemsList() {
    var oid = parseInt($('#hfOrderNo').val()) || 0;
    var otherItemsxml = [];
    $('#billCoupon li').each(function (index) {
        let cou_amt = parseFloat($(this).find("#cou_discamt").text()) || 0.00;
        if (cou_amt > 0) otherItemsxml.push({ order_item_id: parseInt($(this).data('orderitemid')), order_id: oid, item_name: $(this).data('coupon'), item_type: 'coupon', amount: parseFloat($(this).find("#cou_discamt").text()) || 0.00 });
    });
    //Add Fee
    $('#order_fee_line_items > tr').each(function (index, tr) {
        otherItemsxml.push({ order_item_id: parseInt($(this).data('orderitemid')), order_id: oid, item_name: $(this).data('pname'), item_type: 'fee', amount: parseFloat($(this).find(".TotalAmount").text()) || 0.00 });
    });
    //Add State Recycling Fee
    otherItemsxml.push({ order_item_id: parseInt($('#stateRecyclingFeeTotal').data('orderitemid')), order_id: oid, item_name: 'State Recycling Fee', item_type: 'fee', amount: parseFloat($('#stateRecyclingFeeTotal').text()) || 0.00 });
    //Add Shipping
    otherItemsxml.push({ order_item_id: parseInt($('#shippingTotal').data('orderitemid')), order_id: oid, item_name: '', item_type: 'shipping', amount: parseFloat($('#shippingTotal').text()) || 0.00 });
    return otherItemsxml;
}
function createTaxItemsList() {
    let oid = parseInt($('#hfOrderNo').val()) || 0, taxRate = parseInt($('#hfTaxRate').val()) || 0.00;
    let sCountry = $('#ddlshipcountry').val(), sState = $('#ddlshipstate').val();
    let taxItemsxml = [];
    taxItemsxml.push({ order_item_id: parseInt($('#salesTaxTotal').data('orderitemid')), order_id: oid, tax_rate_country: sCountry, tax_rate_state: sState, tax_rate: taxRate * 100, amount: parseFloat($('#salesTaxTotal').text()) || 0.00 });
    return taxItemsxml;
}
function createItemsList() {
    let oid = parseInt($('#hfOrderNo').val()) || 0, cid = parseInt($('#ddlUser').val()) || 0;
    let itemsDetails = [];
    $('#order_line_items > tr').each(function (index, tr) {
        var qty = parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00;
        var rate = parseFloat($(this).find(".TotalAmount").data('regprice')) || 0.00;
        var grossAmount = parseFloat($(this).find(".TotalAmount").data('amount')) || 0.00;
        var discountAmount = parseFloat($(this).find(".RowDiscount").text()) || 0.00;
        var taxAmount = parseFloat($(this).find(".TotalAmount").data('taxamount')) || 0.00;
        var shippinAmount = parseFloat($(this).find(".TotalAmount").data('shippingamt')) || 0.00;
        itemsDetails.push({
            order_item_id: $(this).data('orderitemid'), PKey: index, order_id: oid, customer_id: cid, product_type: 'line_item', product_id: $(this).data('pid'), variation_id: $(this).data('vid'), product_name: $(this).data('pname'), quantity: qty, sale_rate: rate, total: grossAmount, discount: discountAmount, tax_amount: taxAmount, shipping_amount: shippinAmount, shipping_tax_amount: 0
        });
    });
    return itemsDetails;
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Save Details ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function ValidateData() {
    if ($('#txtbillfirstname').val() == '') { swal('Alert!', 'Please Enter Billing First Name.', "info").then((result) => { $('#txtbillfirstname').focus(); return false; }); return false; }
    else if ($('#txtbilllastname').val() == '') { swal('Alert!', 'Please Enter Billing Last Name.', "info").then((result) => { $('#txtbilllastname').focus(); return false; }); return false; }
    else if ($('#txtbilladdress1').val() == '') { swal('Alert!', 'Please Enter Billing Address.', "info").then((result) => { $('#txtbilladdress1').focus(); return false; }); return false; }
    else if ($('#txtbillzipcode').val() == '') { swal('Alert!', 'Please Enter Billing Post Code.', "info").then((result) => { $('#txtbillzipcode').focus(); return false; }); return false; }
    else if ($('#txtbillcity').val() == '') { swal('Alert!', 'Please Enter Billing City.', "info").then((result) => { $('#txtbillcity').focus(); return false; }); return false; }
    else if ($('#ddlbillcountry').val() == '') { swal('Alert!', 'Please Select Billing Country.', "info").then((result) => { $('#ddlbillcountry').select2('open'); return false; }); return false; }
    else if ($('#ddlbillstate').val() == '' || $('#ddlbillstate').val() == '0') { swal('Alert!', 'Please Select Billing State.', "info").then((result) => { $('#ddlbillstate').select2('open'); return false; }); return false; }
    else if ($('#txtbillemail').val() == '') { swal('Alert!', 'Please Select Billing EMail Address.', "info").then((result) => { $('#txtbillemail').focus(); return false; }); return false; }
    else if ($('#txtshipfirstname').val() == '') { swal('Alert!', 'Please Enter Shipping First Name.', "info").then((result) => { $('#txtshipfirstname').focus(); return false; }); return false; }
    else if ($('#txtshiplastname').val() == '') { swal('Alert!', 'Please Enter Shipping Last Name.', "info").then((result) => { $('#txtshiplastname').focus(); return false; }); return false; }
    else if ($('#txtshipaddress1').val() == '') { swal('Alert!', 'Please Enter Shipping Address.', "info").then((result) => { $('#txtshipaddress1').focus(); return false; }); return false; }
    else if ($('#txtshipzipcode').val() == '') { swal('Alert!', 'Please Enter Shipping Post Code.', "info").then((result) => { $('#txtshipzipcode').focus(); return false; }); return false; }
    else if ($('#txtshipcity').val() == '') { swal('Alert!', 'Please Enter Shipping City.', "info").then((result) => { $('#txtshipcity').focus(); return false; }); return false; }
    else if ($('#ddlshipcountry').val() == '') { swal('Alert!', 'Please Select Shipping Country.', "info").then((result) => { $('#ddlshipcountry').select2('open'); return false; }); return false; }
    else if ($('#ddlshipstate').val() == '' || $('#ddlshipstate').val() == '0') { swal('Alert!', 'Please Select Shipping State.', "info").then((result) => { $('#ddlshipstate').select2('open'); return false; }); return false; }
    return true;
}
function saveCO() {
    let oid = parseInt($('#hfOrderNo').val()) || 0, cid = parseInt($('#ddlUser').val()) || 0;
    //if (oid <= 0) { swal('Alert!', 'Please Select Customer.', "info").then((result) => { return false; }); }
    if (cid <= 0) { swal('Alert!', 'Please Select Customer.', "error").then((result) => { $('#ddlUser').select2('focus'); return false; }); return false; }
    if (!ValidateData()) { $("#loader").hide(); return false };

    let postMeta = createPostMeta(), postStatus = createPostStatus(), otherItems = createOtherItemsList(), taxItems = createTaxItemsList(), itemsDetails = createItemsList();

    if (itemsDetails.length <= 0) { swal('Alert!', 'Please add product.', "error").then((result) => { $('#ddlProduct').select2('open'); return false; }); return false; }
    var obj = { OrderPostMeta: postMeta, OrderProducts: itemsDetails, OrderPostStatus: postStatus, OrderOtherItems: otherItems, OrderTaxItems: taxItems };

    $('#btnCheckout').prop("disabled", true); $('.billinfo').prop("disabled", true); $('#btnCheckout').text("Waiting...");
    //console.log(obj);
    $.ajax({
        type: "POST", contentType: "application/json; charset=utf-8",
        url: "/Orders/SaveCustomerOrder",
        data: JSON.stringify(obj), dataType: "json", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            if (data.status == true) {
                $('#order_line_items,#order_state_recycling_fee_line_items,#order_fee_line_items,#order_shipping_line_items,#order_refunds,#billCoupon,.refund-action').empty();
                getOrderItemList(oid);
                //swal('Alert!', data.message, "success");
                setTimeout(function () { PaymentModal(); }, 50);
            }
            else { swal('Alert!', data.message, "error").then((result) => { return false; }); }
        },
        error: function (xhr, status, err) { $("#loader").hide(); $('#btnCheckout').prop("disabled", false); $('.billinfo').prop("disabled", false); alert(err); },
        complete: function () { $("#loader").hide(); $('#btnCheckout').prop("disabled", false); $('.billinfo').prop("disabled", false); $('#btnCheckout').text("Checkout"); isEdit(false); },
    });
    $('#btnCheckout').text("Checkout");
    return false;
}
function updateCO() {
    if (!ValidateData()) { $("#loader").hide(); return false };
    let postMeta = createPostMeta(), postStatus = createPostStatus(), otherItems = createOtherItemsList(), taxItems = createTaxItemsList(), itemsDetails = createItemsList();

    if (itemsDetails.length <= 0) { swal('Alert!', 'Please add product.', "error").then((result) => { $('#ddlProduct').select2('open'); return false; }); return false; }
    var obj = { OrderPostMeta: postMeta, OrderProducts: itemsDetails, OrderPostStatus: postStatus, OrderOtherItems: otherItems, OrderTaxItems: taxItems };
    //console.log(obj);
    $.ajax({
        type: "POST", contentType: "application/json; charset=utf-8", url: "/Orders/SaveCustomerOrder", data: JSON.stringify(obj), dataType: "json", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            if (data.status == true) {
                $('#order_line_items,#order_state_recycling_fee_line_items,#order_fee_line_items,#order_shipping_line_items,#order_refunds,#billCoupon,.refund-action').empty();
                getOrderInfo();
            }
            else { swal('Alert!', data.message, "error").then((result) => { return false; }); }
        },
        error: function (xhr, status, err) { $("#loader").hide(); alert(err); },
        complete: function () { $("#loader").hide(); isEdit(false); },
    });
    return false;
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Payment Modal ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function PaymentModal() {
    let pay_by = $('#lblOrderNo').data('pay_by').trim();//$('#lblOrderNo').data('pay_by').trim() > 0 ? $('#lblOrderNo').data('pay_by').trim() : 'podium';
    let billing_first_name = $('#txtbillfirstname').val(), billing_last_name = $('#txtbilllastname').val();
    let billing_address_1 = $('#txtbilladdress1').val(), billing_address_2 = $('#txtbilladdress2').val();
    let billing_city = $('#txtbillcity').val(), billing_state = $('#ddlbillstate').val(), billing_postcode = $('#txtbillzipcode').val();
    let billing_phone = $('#txtbillphone').val(), billing_email = $('#txtbillemail').val();

    let shipping_first_name = $('#txtshipfirstname').val(), shipping_last_name = $('#txtshiplastname').val();
    let shipping_country = "";
    let shipping_address_1 = $('#txtshipaddress1').val(), shipping_address_2 = $('#txtshipaddress2').val();
    let shipping_city = $('#txtshipcity').val(), shipping_state = $('#ddlshipstate').val(), shipping_postcode = $('#txtshipzipcode').val();
    let pay_mathod = $('#lblOrderNo').data('pay_option');
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
    myHtml += 'Billing Address: <address class="no-margin"><strong>' + billing_first_name + ' ' + billing_last_name + '</strong > <br>' + billing_address_1 + (billing_address_2 > 0 ? '<br>' : '') + billing_address_2 + '<br>' + billing_city + ', ' + billing_state + ' ' + billing_postcode + '<br>Phone: ' + billing_phone + '<br>Email: ' + billing_email + '</address>';
    myHtml += '</div>';
    myHtml += '<div class="col-sm-6 invoice-col">';
    myHtml += 'Shipping Address: <address class="no-margin"><strong>' + shipping_first_name + ' ' + shipping_last_name + '</strong > <br>' + shipping_address_1 + (shipping_address_2 > 0 ? '<br>' : '') + shipping_address_2 + '<br>' + shipping_city + ', ' + shipping_state + ' ' + shipping_postcode + '</address>';
    myHtml += '</div>';
    myHtml += '</div>';
    /// row invoice-items
    myHtml += '<div class="row">';
    myHtml += '<div class="col-xs-12 table-responsive">';
    myHtml += '<table class="table table-striped" id="tblmodalitems">';
    myHtml += '<thead>';
    myHtml += '<tr>';
    myHtml += '<th style="width: 40%">Product</th>';
    myHtml += '<th style="width: 15%" class="text-right">Qty.</th>';
    myHtml += '<th style="width: 15%" class="text-right">Sub-Total</th>';
    myHtml += '<th style="width: 15%" class="text-right">Discount</th>';
    myHtml += '<th style="width: 15%" class="text-right">Tax</th>';
    myHtml += '</tr>';
    myHtml += '</thead>';
    myHtml += '<tbody></tbody>';
    myHtml += '</table>';
    myHtml += '</div>';
    myHtml += '<div class="col-xs-12 text-right" id="tblmodalTotal"></div>';
    myHtml += '</div>';

    myHtml += '</section>';
    myHtml += '</div>';

    myHtml += '<div class="modal-footer">';
    myHtml += '<div class="col-md-3">';
    myHtml += '<div class="input-group">';
    myHtml += '<span class="input-group-btn"  >';
    myHtml += '<select class="form-control select2" id="ddlPaymentMethod" style="width: auto;">';
    for (let i = 0; i < pay_mathod.length; i++) {
        myHtml += '<option value="' + pay_mathod[i].id + '">' + pay_mathod[i].text + '</option>';
    }
    myHtml += '</select>';
    myHtml += '</span>';
    myHtml += '</div>';
    myHtml += '</div>';

    myHtml += '<div class="col-md-6 podiumchannel">';
    myHtml += '<div class="form-check-inline"><input type="radio" name="podiumchannel" checked="" value="' + billing_email + '"><label class="form-check-label">Email Channel</label></div>';
    myHtml += '<div class="form-check-inline"><input type="radio" name="podiumchannel" value="' + billing_phone.replace(/[^0-9]/g, "") + '"><label class="form-check-label">SMS Channel</label></div>';
    myHtml += '</div>';
    //myHtml += '<input class="form-control" type="text" id="txtPPEmail" name="txtPPEmail" placeholder="PayPal Email" maxlength="60" disabled>';

    myHtml += '<button type="button" class="btn btn-primary" id="btnPlaceOrder">Place Order $' + $('#orderTotal').text() + '</button>';
    myHtml += '<button type="button" class="btn btn-primary hidden" id="btnResendInv">Resend Invoice $' + $('#orderTotal').text() + '</button>';
    myHtml += '</div>';

    myHtml += '</div>';
    myHtml += '</div>';
    $("#billModal").empty().html(myHtml);
    myHtml = '';
    //get items
    $('#order_line_items > tr').each(function (index, tr) {
        var qty = parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00;
        var grossAmount = parseFloat($(this).find(".TotalAmount").data('amount')) || 0.00;
        var discountAmount = parseFloat($(this).find(".TotalAmount").data('discount')) || 0.00;
        var taxAmount = parseFloat($(this).find(".TotalAmount").data('taxamount')) || 0.00;
        myHtml += '<tr>';
        myHtml += '<td>' + $(this).data('pname') + '</td>';
        myHtml += '<td class="text-right">' + qty + '</td>';
        myHtml += '<td class="text-right">' + grossAmount.toFixed(2) + '</td>';
        myHtml += '<td class="text-right">' + discountAmount.toFixed(2) + '</td>';
        myHtml += '<td class="text-right">' + taxAmount.toFixed(2) + '</td>';
        myHtml += '</tr>';
    });
    $('#tblmodalitems tbody').append(myHtml);
    $('#tblmodalTotal').append($('#order_final_total').html());
    $("#billModal").modal({ backdrop: 'static', keyboard: false }); $("#txt_Coupon").focus();
    //pay_by = pay_by.length > 0 ? pay_by : 'podium';
    pay_by = pay_by.length > 0 ? pay_by : 'ppec_paypal';
    $('#ddlPaymentMethod').val(pay_by).trigger('change'); //console.log(pay_by);
}
function AcceptPayment() {
    if ($("#ddlPaymentMethod").val() == "ppec_paypal") { PaypalPayment($("#txtbillemail").val()); }
    else if ($("#ddlPaymentMethod").val() == "podium") { PodiumPayment() }
    else { swal('Alert!', 'Please Select Payment Method.', "error"); }
}

///Accept Podium Payment
function PodiumPayment() {
    let oid = parseInt($('#hfOrderNo').val()) || 0;
    let bill_email = $("#txtbillemail").val();
    let bill_to = $('input[name="podiumchannel"]:checked').val();
    let bill_name = $('#txtbillfirstname').val() + ' ' + $('#txtbilllastname').val();

    let _lineItems = [];
    $('#order_line_items > tr').each(function (index, tr) {
        let qty = parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00;
        let grossAmount = parseFloat($(this).find(".TotalAmount").data('amount')) || 0.00;
        let discount = parseFloat($(this).find(".RowDiscount").text()) || 0.00;
        if ((grossAmount - discount) > 0)
            _lineItems.push({ description: $(this).data('pname').replace(/[^a-zA-Z0-9 ]/g, "").substring(0, 40) + ' X ' + qty.toFixed(0), amount: (grossAmount - discount) * 100 });
        //_lineItems.push({ description: 'Item - ' + index+ ' X ' + qty.toFixed(0), amount: (grossAmount - discount) * 100 });

    });
    let Shipping_total = parseFloat($('#shippingTotal').text()) || 0.00, st_total = parseFloat($('#salesTaxTotal').text()) || 0.00, srf_total = parseFloat($('#stateRecyclingFeeTotal').text()) || 0.00, fee_total = parseFloat($('#feeTotal').text()) || 0.00;
    if (Shipping_total > 0) _lineItems.push({ description: "Shipping", amount: Shipping_total * 100 });
    if (st_total > 0) _lineItems.push({ description: "Tax", amount: st_total * 100 });
    if (srf_total > 0) _lineItems.push({ description: "State Recycling Fee", amount: srf_total * 100 });
    if (fee_total > 0) _lineItems.push({ description: "Fee", amount: fee_total * 100 });

    let opt_inv = { lineItems: _lineItems, channelIdentifier: bill_to, customerName: bill_name, invoiceNumber: 'INV-' + oid, locationUid: "6c2ee0d4-0429-5eac-b27c-c3ef0c8f0bc7" };
    //console.log(opt_inv);
    console.log('Start Podium Payment Processing...');
    let option = { strValue1: 'getToken' };
    swal.queue([{
        title: 'Podium Payment Processing.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
        onOpen: () => {
            swal.showLoading();
            $.get('/Setting/GetPodiumToken', option).then(response => {
                let access_token = response.message;
                let inv_id = $('#lblOrderNo').data('pay_id').trim();
                if (inv_id.length > 0) {
                    let create_url = podium_baseurl + '/v4/invoices/' + inv_id + '/cancel';
                    let opt_cnl = { locationUid: "6c2ee0d4-0429-5eac-b27c-c3ef0c8f0bc7", note: 'Invoice has been canceled.' };
                    $.ajax({
                        type: 'post', url: create_url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt_cnl),
                        beforeSend: function (xhr) { xhr.setRequestHeader("Accept", "application/json"); xhr.setRequestHeader("Authorization", "Bearer " + access_token); }
                    }).then(response => { console.log('Invoice has been canceled.'); }).catch(err => { console.log(err); });
                }
                $.ajax({
                    type: 'post', url: podium_baseurl + '/v4/invoices', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt_inv),
                    beforeSend: function (xhr) { xhr.setRequestHeader("Accept", "application/json"); xhr.setRequestHeader("Authorization", "Bearer " + access_token); }
                }).then(response => {
                    updatePayment(oid, response.data.uid);
                }).catch(err => { console.log(err); swal.hideLoading(); swal('Error!', 'Something went wrong.', 'error'); });
            }).catch(err => { swal.hideLoading(); swal('Error!', err, 'error'); });//.always(function () { swal.hideLoading(); });
        }
    }]);
}
function updatePayment(oid, taskUid) {
    let _postMeta = [
        { post_id: oid, meta_key: '_payment_method', meta_value: 'podium' }, { post_id: oid, meta_key: '_payment_method_title', meta_value: 'Podium Order' },
        { post_id: oid, meta_key: '_podium_uid', meta_value: taskUid }, { post_id: oid, meta_key: 'taskuidforsms', meta_value: taskUid }, { post_id: oid, meta_key: '_podium_status', meta_value: 'SENT' }
    ];
    let opt = { OrderPostMeta: _postMeta };
    $.post('/Orders/UpdatePaymentInvoiceID', opt).then(response => {
        swal('Success!', response.message, 'success');
        if (response.status == true) { $("#billModal").modal('hide'); $('.billinfo').prop("disabled", true); successModal('podium', taskUid, true); }
    }).catch(err => { console.log(err); swal.hideLoading(); swal('Error!', err, 'error'); });
}

///Accept paypal Payment
function createPaypalXML(oid, pp_no, pp_email) {
    let taxPer = parseFloat($('#hfTaxRate').val()) || 0.00, dfa = $('#txtLogDate').val().split(/\//); df = [dfa[2], dfa[0], dfa[1]].join('-');
    let shipping_total = parseFloat($('#shippingTotal').text()) || 0.00, srf_total = parseFloat($('#stateRecyclingFeeTotal').text()) || 0.00, fee_total = parseFloat($('#feeTotal').text()) || 0.00;
    let custom_label = (srf_total > 0 ? 'State Recycling Fee' : '') + (srf_total > 0 && fee_total > 0 ? ' & ' : '') + (fee_total > 0 ? 'Fee' : ''); fee_total = fee_total + srf_total;
    custom_label = custom_label.length > 0 ? custom_label : 'Other Fee';
    let _items = [];
    //get items
    $('#order_line_items > tr').each(function (index, tr) {
        let qty = parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00;
        let rate = parseFloat($(this).find(".TotalAmount").data('regprice')) || 0.00;
        let taxAmount = parseFloat($(this).find(".TotalAmount").data('taxamount')) || 0.00;
        let discountAmount = parseFloat($(this).find(".TotalAmount").data('discount')) || 0.00;
        _items.push({ name: $(this).data('pname'), quantity: qty, unit_amount: { currency_code: "USD", value: rate }, tax: { name: "Sales Tax", value: taxAmount, percent: taxPer * 100 }, discount: { amount: { currency_code: "USD", value: discountAmount } }, unit_of_measure: "QUANTITY" });
    });
    let paupal_xml = {
        //id: inv_id, status: "DRAFT",
        detail: { invoice_number: pp_no, reference: oid, invoice_date: df, currency_code: "USD", note: "Layla Invoice.", payment_term: { term_type: "NET_10" } },
        invoicer: {
            name: { given_name: "", surname: "" },
            address: { address_line_1: "157 Church Street Suite 1956", address_line_2: "", admin_area_2: "New Haven", admin_area_1: "CT", postal_code: "06510", country_code: "US" },
            email_address: "sb-ywzys7367265@business.example.com",
            //email_address: "david.quick.fix1-facilitator@gmail.com",
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
        items: _items,
        configuration: { partial_payment: { allow_partial_payment: false }, allow_tip: false, tax_calculated_after_discount: true, tax_inclusive: false },
        amount: {
            breakdown: {
                discount: { invoice_discount: { percent: 0 } }, shipping: { amount: { currency_code: "USD", value: shipping_total } }, custom: { label: custom_label, amount: { currency_code: "USD", value: fee_total } }
            }
        }
    }
    return paupal_xml;
}
function PaypalPayment(ppemail) {
    let oid = parseInt($('#hfOrderNo').val()) || 0, pp_no = 'WC-' + new Date().getTime();
    let option_pp = createPaypalXML(oid, pp_no, ppemail)
    console.log('Start PayPal Payment Processing...');
    swal.queue([{
        title: 'PayPal Payment Processing.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
        onOpen: () => {
            swal.showLoading();
            $.get('/Setting/GetPayPalToken', { strValue1: 'getToken' }).then(response => {
                let access_token = response.message;
                let inv_id = $('#lblOrderNo').data('pay_id').trim();
                let create_url = paypal_baseurl + '/v2/invoicing/invoices' + (inv_id.length > 0 ? '/' + inv_id : ''), action_method = (inv_id.length > 0 ? 'PUT' : 'POST');
                //CreatePaypalInvoice(oid, pp_no, ppemail, response.message);
                $.ajax({
                    type: action_method, url: create_url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option_pp),
                    beforeSend: function (xhr) { xhr.setRequestHeader("Accept", "application/json"); xhr.setRequestHeader("Authorization", "Bearer " + access_token); }
                }).then(data => {
                    console.log('Invoice has been Created.');
                    let sendURL = data.href + '/send';
                    $("txtbillemail").data('surl', sendURL);
                    if (action_method == 'POST') {
                        SendPaypalInvoice(oid, pp_no, access_token, sendURL);
                    }
                    else {
                        swal('Success!', 'Order placed successfully.', 'success');
                        $("#billModal").modal('hide'); $('.billinfo').prop("disabled", true);
                        successModal('PayPal', inv_id, true);
                    }
                }).catch(err => { console.log(err); swal.hideLoading(); swal('Error!', 'Something went wrong.', 'error'); });
            }).catch(err => { swal.hideLoading(); swal('Error!', err, 'error'); });//.always(function () { swal.hideLoading(); });
        }
    }]);
}
function SendPaypalInvoice(oid, pp_no, access_token, sendURL) {
    let id = sendURL.split('/');
    let _postMeta = [
        { post_id: oid, meta_key: '_payment_method', meta_value: 'ppec_paypal' }, { post_id: oid, meta_key: '_payment_method_title', meta_value: 'PayPal' },
        { post_id: oid, meta_key: '_paypal_invoice_id', meta_value: pp_no }, { post_id: oid, meta_key: '_paypal_id', meta_value: id[id.length - 2] },
        { post_id: oid, meta_key: '_paypal_status', meta_value: 'SENT' }
    ];
    $.ajax({
        type: "POST", url: sendURL, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify({ send_to_recipient: true, send_to_invoicer: true }),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Authorization", "Bearer " + access_token);
        },
        success: function (senddata, textStatus, jqXHR) {
            console.log(senddata);
            let opt = { OrderPostMeta: _postMeta };
            $.post('/Orders/UpdatePaymentInvoiceID', opt).then(result => {
                swal('Success!', result.message, 'success'); $('#lblOrderNo').data('pay_id', id);
                $("#billModal").modal('hide'); $('.billinfo').prop("disabled", true);
                successModal('PayPal', id[id.length - 2], true);
            }).catch(err => { console.log(err); swal.hideLoading(); });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#ddlPaymentMethod').prop("disabled", true); $('#btnPlaceOrder').addClass('hidden'); $('#btnResendInv').removeClass('hidden');
            console.log(XMLHttpRequest); swal('Error!', 'Something went wrong.', 'error');
        },
        complete: function () { $('#btnPlaceOrder').prop("disabled", false); },
        async: false
    });
}
function CancelPaypalInvoice(access_token, pp_email, invoice_no) {
    var option = { subject: "Invoice Cancelled", note: "Cancelling the invoice", send_to_invoicer: true, send_to_recipient: true, additional_recipients: [pp_email] }
    let create_url = 'https://api-m.sandbox.paypal.com/v2/invoicing/invoices/' + invoice_no + '/cancel';
    console.log(create_url, option);
    $.ajax({
        type: "POST", url: create_url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Authorization", "Bearer " + access_token);
        },
        success: function (data) { console.log(data); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); console.log(XMLHttpRequest); swal('Alert!', errorThrown, "error"); },
        complete: function () { $("#loader").hide(); }, async: false
    });
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Success modal ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function successModal(paymode, id, is_mail) {
    //console.log(id, id.toString().substring(4).replace(/\-/g, ''));
    id = id.toString().substring(4).replace(/\-/g, '');
    var modalHtml = '';
    modalHtml += '<div class="modal-dialog modal-lg">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<div class="modal-body no-padding" ></div>';
    modalHtml += '<div class="modal-footer">';
    modalHtml += '<button type="button" class="btn btn-primary" id="btnNewOrder">OK</button>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#billModal").empty().html(modalHtml);

    var myHtml = '';
    myHtml += '<div style="margin:0;padding:0;color: #4f4f4f;font-family: Arial, sans-serif;">';
    myHtml += '<table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">';
    myHtml += '<tr>';
    myHtml += '<td align="center" style="padding:0;">';
    myHtml += '<table role="presentation" style="width:602px;border-collapse:collapse;border-spacing:0;text-align:left;">';
    myHtml += '<tr>';
    myHtml += '<td align="center" style="padding: 10px 15px; background-color: #f8f8f8;">';
    myHtml += '<table role="presentation" style="width:100%;">';
    myHtml += '<tr>';
    myHtml += '<td><img alt="Layla Logo" src="https://quickfix16.com/wp-content/themes/layla-white/images/logo.png"></td>';
    myHtml += '<td align="right">';
    myHtml += '<h1 style="font-size: 42px; margin:0px; font-style: italic; color: #4f4f4f">Thank you.</h1>';
    myHtml += '<h2 style="font-size: 20px; margin:0px; color: #4f4f4f">Your order has been received</h2>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '</table>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '<tr class="thankyou-for-your-order">';
    myHtml += '<td class="order-detail-box" style="padding: 15px 10px 10px; border-bottom: 1px solid #c8c8c8;">';
    myHtml += '<table class="order_details order-detail-ul" role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">';
    myHtml += '<tr>';
    myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top; border-right: 1px solid #c8c8c8; padding-right:30px;"> Order number:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">' + $('#hfOrderNo').val() + '</strong></td>';
    myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top; border-right: 1px solid #c8c8c8; padding-right:30px; padding-left:30px;"> Date:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">' + $('#txtLogDate').val() + '</strong></td>';
    myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top; border-right: 1px solid #c8c8c8; padding-right:30px; padding-left:30px;"> Total:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">$' + $('#orderTotal').text() + '</strong></td>';
    if (paymode == 'PayPal')
        myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top;  padding-left:30px;"> Payment Method: PayPal<br><a id="payInvoice" class="btn8 btn8-medium payInvoice" href="https://www.sandbox.paypal.com/invoice/p/#' + id + '" target="_blank" style="margin:12px;min-width:110px;background-color:#0070BA;color:#fff;font-size:12px;box-sizing:border-box!important;padding: 8px;border-radius:5px;font-weight:600;">Pay $' + $('#orderTotal').text() + '</a></td>';
    else if (paymode == 'authorize_net_cim_credit_card')
        myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top;  padding-left:30px;"> Payment Method:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">Credit Card</strong></td>';
    else
        myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top;  padding-left:30px;"> Payment Method:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">' + paymode + '</strong></td>';
    myHtml += '</tr>';
    myHtml += '</table>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '<tr><td ><h2 style="font-size:20px; margin:25px 0px 10px 0px;">Order details</h2></td></tr>';
    myHtml += '<tr>';
    myHtml += '<td >';

    myHtml += '<table id="tblorder_details" class="shop_table order_details" style="border: 1px solid rgba(0, 0, 0, 0.1);margin: 0 -1px 24px 0;text-align: left;width: 100%; border-collapse: separate; border-radius: 5px;">';
    myHtml += '<thead><tr><th class=" product-name" style="font-weight: 700;padding: 9px 12px;">Product</th><th class="product-total" style="font-weight: 700;padding: 9px 12px;">Total</th></tr></thead>';
    myHtml += '<tbody></tbody>';
    myHtml += '<tfoot>';
    myHtml += '<tr><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Subtotal:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;"><span>$' + $('#SubTotal').text() + '</span></td></tr>';
    myHtml += '<tr><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Discount:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">-<span>$' + $('#discountTotal').text() + '</span></td></tr>';
    myHtml += '<tr><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Shipping:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">' + $('#shippingTotal').text() + '</td></tr>';
    myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Tax:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">$' + $('#salesTaxTotal').text() + '</td></tr>';
    myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">State Recycling Fee:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">$' + $('#stateRecyclingFeeTotal').text() + '</td></tr>';
    myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Fee:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">$' + $('#feeTotal').text() + '</td></tr>';
    myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Total:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;"><span>$' + $('#orderTotal').text() + '</span></td></tr>';
    myHtml += '</tfoot>';
    myHtml += '</table>';

    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += ' <tr>';
    myHtml += '<td class="checkout-call" style="background: #41414b; padding: 30px 15px; font-size: 20px; color: #fff; font-weight: 600; text-align: center;">';
    myHtml += 'Give us a call <a style="color:#fff;text-decoration: none;" href="tel:855-358-1676">855-358-1676</a>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '</table>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '</table>';
    myHtml += '</div>';

    $('#billModal .modal-body').append(myHtml);

    myHtml = '';
    $('#order_line_items > tr').each(function (index, tr) {
        var qty = parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00;
        var grossAmount = parseFloat($(this).find(".TotalAmount").data('amount')) || 0.00;
        myHtml += '<tr><td style="border-top: 1px solid rgba(0, 0, 0, 0.1);  padding: 9px 12px; vertical-align: middle;"><span>' + $(this).data('pname') + '</span><strong class="product-quantity">× ' + qty + '</strong></td><td style="border-top: 1px solid rgba(0, 0, 0, 0.1);  padding: 9px 12px; vertical-align: middle;"><span>$' + grossAmount + '</span></td></tr>';
    });
    $('#tblorder_details tbody').append(myHtml);

    $("#billModal").modal({ backdrop: 'static', keyboard: false });
    //var opt = { strValue1: $('#txtbillemail').val(), strValue2: 'Your order #' + $('#hfOrderNo').val() + ' has been received', strValue3: $('#billModal .modal-body').html() }
    if ($('#txtbillemail').val().length > 5 && is_mail == true) {
        sendInvoice(paymode, id)
    }
}

function sendInvoice(paymode, id) {
    let order_id = parseInt($('#hfOrderNo').val()) || 0;
    let order_date = $('#txtLogDate').val();
    let payment_method = paymode;
    let b_first_name = $('#txtbillfirstname').val();
    let b_last_name = $('#txtbilllastname').val();
    let b_company = $('#txtbillcompany').val();
    let b_address_1 = $('#txtbilladdress1').val();
    let b_address_2 = $('#txtbilladdress2').val();
    let b_postcode = $('#txtbillzipcode').val();
    let b_city = $('#txtbillcity').val();
    let b_country = $('#ddlbillcountry').val();
    let b_state = $('#ddlbillstate').val();
    let b_email = $('#txtbillemail').val();
    let b_phone = $('#txtbillphone').val();
    let s_first_name = $('#txtshipfirstname').val();
    let s_last_name = $('#txtshiplastname').val();
    let s_company = $('#txtshipcompany').val();
    let s_address_1 = $('#txtshipaddress1').val();
    let s_address_2 = $('#txtshipaddress2').val();
    let s_postcode = $('#txtLogDate').val();
    let s_city = $('#txtshipcity').val();
    let s_country = $('#ddlshipcountry').val();
    let s_state = $('#ddlshipstate').val();
    let GrassAmount = parseFloat($('#SubTotal').text()) || 0;
    let TotalDiscount = parseFloat($('#discountTotal').text()) || 0;
    let TotalTax = parseFloat($('#salesTaxTotal').text()) || 0;
    let TotalShipping = parseFloat($('#shippingTotal').text()) || 0;
    let TotalStateRecycling = parseFloat($('#stateRecyclingFeeTotal').text()) || 0;
    let TotalFee = parseFloat($('#feeTotal').text()) || 0;
    let NetTotal = parseFloat($('#orderTotal').text()) || 0;
    let _item = [];
    $('#order_line_items > tr').each(function (index, tr) {
        var qty = parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00;
        var rate = parseFloat($(this).find(".TotalAmount").data('regprice')) || 0.00;
        var grossAmount = parseFloat($(this).find(".TotalAmount").data('amount')) || 0.00;
        _item.push({
            order_item_id: 0, PKey: 0, order_id: order_id, product_type: 'line_item', product_id: $(tr).data('pid'), variation_id: $(tr).data('vid'), product_name: $(tr).data('pname'), quantity: qty, sale_rate: rate, total: grossAmount, product_img: $(tr).data('img')
        });
    });

    var opt_mail = {
        order_id: order_id, order_date: order_date, payment_method: payment_method, b_first_name: b_first_name, b_last_name: b_last_name, b_company: b_company,
        b_address_1: b_address_1, b_address_2: b_address_2, b_postcode: b_postcode, b_city: b_city, b_country: b_country, b_state: b_state, b_email: b_email, b_phone: b_phone,
        s_first_name: s_first_name, s_last_name: s_last_name, s_company: s_company, s_address_1: s_address_1, s_address_2: s_address_2, s_postcode: s_postcode, s_city: s_city, s_country: s_country, s_state: s_state,
        paypal_id: id, GrassAmount: GrassAmount, TotalDiscount: TotalDiscount, TotalTax: TotalTax, TotalShipping: TotalShipping, TotalStateRecycling: TotalStateRecycling,
        TotalFee: TotalFee, NetTotal: NetTotal, OrderProducts: _item
    }
    $.ajax({
        type: "POST", url: '/Orders/SendMailInvoice', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt_mail),
        success: function (result) { console.log(result); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
        complete: function () { }, async: false
    });
}