$(document).ready(function () {
    $("#txtbillphone").mask("(999) 999-9999");
    $('#txtDate').daterangepicker({ singleDatePicker: true, autoUpdateInput: true, locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' } });
    $(".select2").select2(); BindStateCounty("ddlbillstate", { id: 'US' }); BindStateCounty("ddlshipstate", { id: 'US' });
    $("#ddlUser").select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Search Customer",
        ajax: {
            url: '/Orders/GetCustomerList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', //delay: 250,
            data: function (params) { return JSON.stringify({ strValue1: params.term }); },
            processResults: function (data) { let _list = JSON.parse(data); return { results: $.map(_list, function (item) { return { text: item.displayname + ' [' + item.billing_phone + ']', name: item.displayname + ' [' + item.billing_phone + ']', id: item.id } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
    $("#ddlUser").change(function () {
        $.when(CustomerAddress($("#ddlUser").val())).done(function () { }).fail(function (error) { console.log(error); }); return false;
        //$.when(NewOrderNo()).done(function () { CustomerAddress($("#ddlUser").val()); }).fail(function (error) { console.log(error); }); return false;
    });

    /*Start load function*/
    $("#ddlbillcountry").change(function () { var obj = { id: $("#ddlbillcountry").val() }; BindStateCounty("ddlbillstate", obj); });
    $("#ddlshipcountry").change(function () { var obj = { id: $("#ddlshipcountry").val() }; BindStateCounty("ddlshipstate", obj); });
    $("#ddlshipstate").change(function (t) { t.preventDefault(); $.when(GetTaxRate()).done(function () { getItemShippingCharge(true); }); });
    $("#ddlStatus").change(function (t) {
        t.preventDefault();
        if ($(this).val() == 'wc-on-hold') {
            $('.releasedate').empty().append('<label data-toggle="tooltip" title="Order release date">What day would you like your order to ship?*</label><div class= "input-group"><span class="input-group-addon"><i class="fa fa-calendar"></i></span><input id="txtReleaseDate" class="form-control"></div>');
            $('#txtReleaseDate').daterangepicker({ singleDatePicker: true, minDate: moment($('#txtLogDate').val(), "MM/DD/YYYY").add(7, 'd'), autoUpdateInput: true, locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' } });
        }
        else { $('.releasedate').empty(); }
    });
    $(document).on("blur", "#txtbillzipcode", function (t) {
        t.preventDefault();
        if ($("#ddlbillcountry").val() == 'US') { GetCityByZip($(this).val(), $("#txtbillcity"), $("#ddlbillstate"), $("#ddlbillcountry"), $("#txtbillzipcode")); }
    });
    $(document).on("blur", "#txtshipzipcode", function (t) {
        t.preventDefault();
        if ($("#ddlshipcountry").val() == 'US') { $("#loader").show(); GetCityByZip($(this).val(), $("#txtshipcity"), $("#ddlshipstate"), $("#ddlshipcountry"), $("#txtshipzipcode")); }
    });
    $('#myModal').on('shown.bs.modal', function () {
        $('#ddlCustomerSearch').select2({
            dropdownParent: $("#myModal"), allowClear: true, minimumInputLength: 3, placeholder: "Search Customer",
            language: { noResults: function () { return $("<a id='btnaddcustomer' href='javascript:;'>Add Customer</a>"); } },
            ajax: {
                url: '/Orders/GetCustomerList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
                data: function (params) { return JSON.stringify({ strValue1: params.term }); },
                processResults: function (data, page) { let _list = JSON.parse(data); return { results: $.map(_list, function (item) { return { text: item.displayname + ' [' + item.billing_phone + ']', id: item.id } }) }; },
                error: function (xhr, status, err) { }, cache: true
            }
        });
    });
    $("#myModal").on("change", "#ddlCustomerSearch", function (t) {
        t.preventDefault(); let cus_id = parseInt($("#ddlCustomerSearch").val()) || 0;
        if (cus_id > 0) bindCustomerOrders(cus_id);
        else $('#tblCusOrders').dataTable().fnClearTable();
    });
    $("#myModal").on("click", "#btnaddcustomer", function (t) {
        t.preventDefault(); let cus_text = $("#ddlCustomerSearch").data("select2").dropdown.$search.val();
        $("#myModal").modal('hide'); addCustomerModal(cus_text);
    });
    $(document).on("click", "#btnSearchCusAdd", function (t) {
        t.preventDefault(); let cus_id = parseInt($("#ddlUser").val()) || 0, cus_text = $("#ddlUser option:selected").text();
        if (cus_id == 0) { searchCustomerModal(); return false; }
        $.when(searchCustomerModal()).done(function () { $("#ddlCustomerSearch").empty().append('<option value="' + cus_id + '" selected>' + cus_text + '</option>'); bindCustomerOrders(cus_id); });
    });
    $(document).on("click", ".hub-accord h5", function (t) {
        $(this).find('i').toggleClass('fa-plus fa-minus').parent().next('.hub-box-open').slideToggle(250).parent('.hub-accord').siblings().find('.fa').removeClass('fa-minus').addClass('fa-plus').parent().next('.hub-box-open').slideUp(250);
    });
    $.when(getQuoteInfo()).done(function () { CategoryWiseProducts(); });
    $(document).on("click", ".full-dropy", function (t) { $(this).find('.fa').toggleClass('fa-minus fa-plus'); });
    $(document).on("click", "#btnCheckout", function (t) { t.preventDefault(); SaveData(); ActivityLog('Quote No (' + $('#hfOrderNo').val() + ') proceed for customer approval.', '/OrderQuote/Index/' + $('#hfOrderNo').val() + ''); });
    $(document).on("click", ".btnEditOrder", function (t) {
        t.preventDefault(); $("#loader").show(); //$('#ddlStatus').prop("disabled", true); 
        $('#ddlStatus,.billinfo').prop("disabled", false); $('#txtbillfirstname').focus(); $('.agentaddtocart').removeClass('hidden');
        $('.box-tools-header').empty().append('<button type="button" class="btn btn-danger btnOrderUndo" data-toggle="tooltip" title="Reset Order"><i class="fa fa-undo"></i> Cancel</button> <button type="button" id="btnOrderUpdate" class="btn btn-danger" data-toggle="tooltip" title="Update Order"><i class="far fa-save"></i> Update</button>');
        $('.footer-finalbutton').empty().append('<button type="button" class="btn btn-danger pull-left btnOrderUndo"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" id="btnCheckout" class="btn btn-danger billinfo" data-toggle="tooltip" title="Save and Checkout Order"> Checkout</button>');
        $('.view-addmeta').empty().append('<button class="btn btn-danger btn-xs billinfo add_order_item_meta" data-placement="right" data-toggle="tooltip" title="Add item meta">Add&nbsp;meta</button>');
        $('[data-toggle="tooltip"]').tooltip(); $("#loader").hide(); isEdit(true);
        ActivityLog('Edit Quote id (' + $('#hfOrderNo').val() + ') in Order Quote.', '/OrderQuote/Index/' + $('#hfOrderNo').val());
    });
    $(document).on("click", ".btnOrderUndo", function (t) { t.preventDefault(); $("#loader").show(); getQuoteInfo(); isEdit(false); });
    $(document).on("click", "#btnOrderUpdate", function (t) { t.preventDefault(); SaveData(); ActivityLog('Edit Quote No (' + $('#hfOrderNo').val() + ') in order history', '/OrderQuote/Index'); });
    $(document).on("click", "#btnPrintPdf", function (t) { t.preventDefault(); PrintQuote(); });
    /*end load function*/
    /*Start product*/
    $(document).on("change", ".addnvar,.addnvar-qty", function (t) {
        t.preventDefault(); let $row = $(this).parent(); let vr = $row.find('.addnvar').val().split('-');
        let regular_price = parseFloat(vr[1]) || 0.00, price = parseFloat(vr[2]) || 0.00, qty = parseFloat($row.find('.addnvar-qty').val()) || 0.00;
        if (price < regular_price && regular_price > 0) $row.find('.hub-pro-price').html('<span>$' + (price * qty).toFixed(2) + '<span>$' + (regular_price * qty).toFixed(2) + '</span></span>')
        else if (price >= regular_price && regular_price > 0) $row.find('.hub-pro-price').html('<span>$' + (price * qty).toFixed(2) + '<span></span>')
    });
    $(document).on("click", ".agentaddtocart", function (t) {
        t.preventDefault(); let $row = $(this).parent();
        if ($(this).data('producttype') == 'product') {
            let vr = $row.find('.addnvar').val().split('-');
            let pid = parseInt($row.data('proid')) || 0, vid = parseInt(vr[0]) || 0, cid = parseInt($('#ddlUser').val()) || 0, qty = parseFloat($row.find('.addnvar-qty').val()) || 0.00;
            if (cid <= 0) { swal('Alert!', 'Please Select Customer.', "error").then((result) => { $('#ddlUser').select2('open'); return false; }); return false; }
            getItemList(pid, vid, qty);
        }
        else if ($(this).data('producttype') == 'gift_card') {
            let pid = parseInt($row.data('proid')) || 0, p_name = $row.data('name');
            AddGiftCardProductModal(p_name, pid)
        }
    });
    $(document).on("click", "#btnAddGiftCardProduct", function (t) {
        t.preventDefault(); let pid = $(this).data('pid'), vid = $(this).data('vid'), p_name = $(this).data('name'); bindGiftCardProduct(p_name, pid, vid);
    });
    /*End product*/
    /*Start add new customer*/
    $("#myModal").on("click", "#btnBackSearchCusrtomer", function (t) { t.preventDefault(); $("#myModal").modal('hide'); searchCustomerModal(); });
    $("#myModal").on("change", "#ddlCusBillingCountry", function (t) { t.preventDefault(); $("#txtCusBillingPostCode").val(''); BindStateCounty("ddlCusBillingState", { id: $("#ddlCusBillingCountry").val() }); });
    $("#myModal").on("change", "#ddlCusBillingState", function (t) { t.preventDefault(); $("#txtCusBillingPostCode").val(''); });
    $("#myModal").on("change", "#txtCusBillingPostCode", function (t) {
        t.preventDefault(); let _zip = $(this).val();
        if ($("#ddlCusBillingCountry").val() == 'CA') return false;
        $.when($("#loader").show()).then(function () { GetCityByZip(_zip, $("#txtCusBillingCity"), $("#ddlCusBillingState"), $("#ddlCusBillingCountry"), $("#txtCusBillingPostCode")); $("#txtCusBillingPostCode").val(_zip); }).always(function () { $("#loader").hide(); });
    });
    $("#myModal").on("click", "#btnSaveCustomer", function (t) { t.preventDefault(); saveCustomer(); });
    /*End add new customer*/
    /*Start fee*/
    $(document).on("click", "#btnAddFee", function (t) { t.preventDefault(); let i = Math.random().toString(36).substr(2, 9); AddFeeModal(i, 0, '', '', '0'); });
    $(document).on("click", "#btnApplyFee", function (t) {
        t.preventDefault(); let rowid = $(this).data('rowid'), orderitemid = parseInt($(this).data('orderitemid')) || 0, feeamt = parseFloat($('#txt_FeeAmt').val()) || 0.00;
        if ($('#txt_FeeTitle').val() == '') { swal('Error!', 'Please enter fee title.', "error").then((result) => { $('#txt_FeeTitle').focus(); return false; }); return false; }
        else if ($('#ddlFeeType').val() == '0') { swal('Error!', 'Please select fee type.', "error").then((result) => { $('#ddlFeeType').focus(); return false; }); return false; }
        else if (feeamt == 0) { swal('Error!', 'Please enter fee amount.', "error").then((result) => { $('#txt_FeeAmt').focus(); return false; }); return false; }
        else { ApplyFee(rowid, orderitemid, $('#txt_FeeTitle').val(), $('#ddlFeeType').val(), feeamt); }
    });
    /*End fee*/
    /*Start Gift Card*/
    $(document).on("click", "#btnApplyGiftCard", function (t) { t.preventDefault(); if ($("#order_line_items > tr.gift_item").length > 0) return false; else GiftCardModal(); });
    $("#myModal").on("click", "#btnGiftCardAdd", function (t) { t.preventDefault(); ApplyGiftCard(); });
    /*End Gift Card*/
    /*Start Coupon*/
    $(document).on("click", "#btnApplyCoupon", function (t) { t.preventDefault(); if ($("#order_line_items > tr.gift_item").length > 0) return false; else CouponModal(); });
    $("#myModal").on("click", "#btnCouponAdd", function (t) { t.preventDefault(); ApplyCoupon(); });
    /*End Coupon*/
});
function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ load data bind Category Wise Products and saved Quote ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function GetTaxRate() {
    ///Tax Calculate for state
    let tax_states = ["NY", "CA", "CO", "CT", "IL", "IN", "MI", "MS", "NC", "NE", "NJ", "NM", "PA", "TN", "TX", "WA", "AR", "FL", "GA", "IA", "MO", "OH", "SC", "WI"];
    let s_state = $("#ddlshipstate").val(), sub_total = parseFloat($("#ddlshipstate").val()) || 100, ship_total = parseFloat($("#shippingTotal").val()) || 0.00;
    if (tax_states.includes(s_state)) {
        var opt = { to_zip: $("#txtshipzipcode").val(), to_street: $("#txtshipaddress1").val(), to_city: $("#txtshipcity").val(), to_state: s_state, to_country: $("#ddlshipcountry").val(), amount: sub_total, shipping: ship_total };
        if (opt.to_zip.length <= 0 || opt.to_city.length <= 0 || opt.to_country.length <= 0) { $('#hfTaxRate').val(0); $('#hfFreighttaxable').val(false); }
        else {
            ajaxFunction('/Orders/GetTaxAmounts', opt, function () { }, function (res) {
                let tax_meta = (res.tax_meta != '' && res.tax_meta != null) ? JSON.parse(res.tax_meta) : [];
                $('#hfTaxRate').data('meta_data', tax_meta); $('#hfTaxRate').val(res.rate); $('#hfFreighttaxable').val(res.freight_taxable);
            }, function () { }, function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); }, false);
        }
    }
    else { $('#hfTaxRate').val(0.00); $('#hfFreighttaxable').val(false); }
    //calculateDiscountAcount();
}
function GetSRTaxRate() {
    let tax_states = ["CT", "RI"], s_state = $("#ddlshipstate").val();
    if (tax_states.includes(s_state)) {
        var opt = { strValue1: $("#txtshipzipcode").val(), strValue2: $("#txtshipaddress1").val(), strValue3: $("#txtshipcity").val(), strValue4: s_state, strValue5: $("#ddlshipcountry").val() };
        $.post('/Orders/GetTaxRate', opt).then(response => { $('#hfTaxRate').data('srfee', response.rate); });
    }
    else { $('#hfTaxRate').data('srfee', 0.00); }
    //calculateDiscountAcount();
}
function CategoryWiseProducts() {
    let strHTML = ''; $("#category_items").empty();
    $.get('/Orders/GetCategoryWiseProducts', { strValue1: 'category' }).done(function (result) {
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
                        if (data.gift_card == 'yes') {
                            strHTML += '<div data-proid="' + data.pr_id + '" data-name="' + data.post_title + '" class="hub-pro-shop"><a href="javascript:;" data-producttype="gift_card" class="agentaddtocart btn btn-danger hidden" data-toggle="tooltip" data-original-title="Add to Cart" style="max-width:90px;">Add to Cart</a></div>';
                        }
                        else {
                            strHTML += '<div data-proid="' + data.pr_id + '" class="hub-pro-shop">';
                            strHTML += '<select class="form-control addnvar" style="min-width: 335px; max-width:335px;">';
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
                            strHTML += '<input min="1" class="form-control addnvar-qty billinfo" type="number" value="1" name="txt_ItemQty" placeholder="Qty" style="max-width: 80px;">';
                            if (price < regular_price && regular_price > 0) strHTML += '<div class="hub-pro-price" style="min-width: 130px;"><span>$' + price.toFixed(2) + '<span>$' + regular_price.toFixed(2) + '</span></span></div>';
                            else strHTML += '<div class="hub-pro-price" style="min-width: 130px;"><span>$' + price.toFixed(2) + '</span></div>';
                            strHTML += '<a href="javascript:;" data-producttype="product" class="agentaddtocart btn btn-danger hidden" data-toggle="tooltip" data-original-title="Add to Cart" style="max-width:90px;">Add to Cart</a>';
                            strHTML += '</div>';
                        }
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
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) { console.log(XMLHttpRequest, textStatus, errorThrown); $("#loader").hide(); swal('Alert!', errorThrown, "error"); }).always(function () { $("#loader").hide(); });
}
function getQuoteInfo() {
    $('.view-addmeta,#divAlert').empty(); $('.billinfo').prop("disabled", true);
    let oid = parseInt($('#hfOrderNo').val()) || 0;
    if (oid > 0) {
        $('#btnSearch').prop("disabled", true); $('.agentaddtocart').addClass('hidden'); $('.page-heading').text('Edit Quote');
        $('.page-heading-action').empty().append('<a class="btn btn-danger" href="/OrderQuote/History" data-toggle="tooltip" data-placement="left" title="Back to List">Back to List</a>');
        $('#lblOrderNo').text('Quote Code #' + oid + ' detail '); $('#hfOrderNo').val(oid);
        $('#order_line_items,#order_state_recycling_fee_line_items,#order_fee_line_items,#order_shipping_line_items,#order_refunds,#billCoupon,#billGiftCard,.refund-action').empty();
        $('#btnCheckout').remove();
        $.get('/OrderQuote/GetQuoteDetails', { id: oid }).done(function (result) {
            //try {
            let data = JSON.parse(result);
            $.each(data['Table'], function (i, row) {
                $('#lblOrderNo').data('pay_by', row.payment_method); $('#lblOrderNo').data('pay_id', row.transaction_id); $('#lblOrderNo').data('tax_api', row.tax_api);
                $('#txtLogDate').val(row.date_created);
                $('#ddlStatus').val(row.quote_status.trim()).trigger('change');
                //if (data[0].payment_method.trim().length > 0)
                //    $('.payment-history').text('Payment via ' + data[0].payment_method_title + ' ' + data[0].created_via + '. Customer IP: ' + data[0].ip_address);
                //else
                //    $('.payment-history').text('Customer IP: ' + data[0].ip_address);
                $("#ddlUser").empty().append('<option value="' + row.customer_id + '" selected>' + row.customer_name + '</option>');
                ///billing_Details
                let tPhone = row.billing_phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3");
                $('#txtbillfirstname').val(row.billing_first_name); $('#txtbilllastname').val(row.billing_last_name); $('#txtbilladdress1').val(row.billing_address_1); $('#txtbilladdress2').val(row.billing_address_2);
                $('#txtbillzipcode').val(row.billing_postcode); $('#txtbillcity').val(row.billing_city); $('#txtbillemail').val(row.billing_email); $('#txtbillphone').val(tPhone);
                $('#txtbillcompany').val(row.billing_company); $('#ddlbillcountry').val(row.billing_country.trim()).trigger('change'); $('#ddlbillstate').val(row.billing_state.trim()).trigger('change');

                ///shipping_Details
                $('#txtshipfirstname').val(row.shipping_first_name); $('#txtshiplastname').val(row.shipping_last_name); $('#txtshipaddress1').val(row.shipping_address_1); $('#txtshipaddress2').val(row.shipping_address_2);
                $('#txtshipcompany').val(row.shipping_company); $('#txtshipzipcode').val(row.shipping_postcode); $('#txtshipcity').val(row.shipping_city);
                $('#ddlshipcountry').val(row.shipping_country.trim()).trigger('change'); $('#ddlshipstate').val(row.shipping_state.trim()).trigger('change');
                $('#txtCustomerNotes').val(row.remark);

                if (row.quote_status.trim() == 'wc-draft') {
                    $('.box-tools-header').empty().append('<button type="button" class="btn btn-danger" id="btnPrintPdf" data-toggle="tooltip" title="Print Order invoice"><i class="fas fa-print"></i> Print</button> <button type="button" class="btn btn-danger btnOrderUndo" data-toggle="tooltip" title="Refresh Order"><i class="fa fa-undo"></i> Refresh</button> <button type="button" class="btn btn-danger btnEditOrder" data-toggle="tooltip" title="Edit Order"><i class="far fa-edit"></i> Edit</button>');
                    $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/OrdersMySQL/OrdersHistory" data-toggle="tooltip" data-placement="right" title="Go to Order List">Back to List</a> <button type="button" class="btn btn-danger btnEditOrder" data-toggle="tooltip" title="Edit Order"><i class="far fa-edit"></i> Edit</button>');
                }
                else {
                    $('.box-tools-header').empty().append('<button type="button" class="btn btn-danger" id="btnPrintPdf" data-toggle="tooltip" title="Print Order invoice"><i class="fas fa-print"></i> Print</button> <button type="button" class="btn btn-danger btnOrderUndo" data-toggle="tooltip" title="Refresh Order"><i class="fa fa-undo"></i> Refresh</button>');
                    $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/OrdersMySQL/OrdersHistory" data-toggle="tooltip" data-placement="right" title="Go to Order List">Back to List</a>');
                    if (row.quote_status.trim() == 'wc-approved') { $('#divAlert').empty().append('<div class="alert alert-info alert-dismissible"><h4><i class="icon fa fa-info"></i> Alert!</h4>Order quote is not editable. Because quote approved by customer.</div>'); }
                    else if (row.quote_status.trim() == 'wc-pendingpodiuminv') { $('#divAlert').empty().append('<div class="alert alert-success alert-dismissible"><h4><i class="icon fa fa-info"></i> Alert!</h4>Order quote is not editable. Because quote approved by customer and created payment invoice.</div>'); }
                    else if (row.quote_status.trim() == 'wc-podium') { $('#divAlert').empty().append('<div class="alert alert-success alert-dismissible"><h4><i class="icon fa fa-info"></i> Alert!</h4>Order quote is not editable. Because payment has been done.</div>'); }
                    else if (row.quote_status.trim() == 'wc-rejected') { $('#divAlert').empty().append('<div class="alert alert-danger alert-dismissible"><h4><i class="icon fa fa-info"></i> Alert!</h4>Order quote is not editable. Because quote rejected by customer.</div>'); }
                }
                getQuoteItemList(data['Table1'])
            });
            //}
            //catch (error) { $("#loader").hide(); swal('Alert!', "Something went wrong on loading quote.", "error"); }
        }).catch(err => { $("#loader").hide(); swal('Alert!', errorThrown, "error"); }).always(function () { $("#loader").hide(); $('.billinfo').prop("disabled", true); getItemShippingCharge(false); });

    }
    else {
        $("#loader").hide(); $('#lblOrderNo').data('pay_by', ''); $('#lblOrderNo').data('pay_id', '');
        $('.refund-action').append('<button type="button" id="btnAddFee" class="btn btn-danger billinfo" disabled data-toggle="tooltip" title="Add Other Fee">Fees</button> ');
        $('.page-heading').text('Quote Order'); $('#btnSearch').prop("disabled", false); searchCustomerModal();
        //CheckPermissions("#btnCheckout", "", "", window.location.pathname);
    }
}
function getQuoteItemList(_list) {
    let itemHtml = '', recyclingfeeHtml = '', feeHtml = '', shippingHtml = '', refundHtml = '', couponHtml = '', giftcardHtml = '';
    let zQty = 0.00, zGAmt = 0.00, zTDiscount = 0.00, zTotalTax = 0.00, zShippingAmt = 0.00, zStateRecyclingAmt = 0.00, zFeeAmt = 0.00, zRefundAmt = 0.00, zGiftCardAmt = 0.00, zGiftCardRefundAmt = 0.00;
    let _tax = [];
    $.each(_list, function (i, row) {
        if (row.item_type == 'line_item') {
            let PKey = row.product_id + '_' + row.variation_id; _meta = JSON.parse(row.item_meta); //console.log(row, _meta, _meta.length);
            let giftcard_amount = parseFloat(_meta.wc_gc_giftcard_amount) || 0.00;
            if (giftcard_amount > 0) itemHtml += '<tr id="tritemId_' + PKey + '" data-id="' + PKey + '" class="gift_item" data-pid="' + row.product_id + '" data-vid="' + row.variation_id + '" data-pname="' + row.item_name + '" data-freeitem="' + row.is_free + '" data-freeitems=\'' + row.free_itmes + '\' data-img="' + row.product_img + '" data-srfee="0" data-sristaxable="' + false + '" data-meta_data=\'' + row.item_meta + '\'>';
            else itemHtml += '<tr id="tritemId_' + PKey + '" data-id="' + PKey + '" class="' + (row.is_free ? 'free_item' : 'paid_item') + '" data-pid="' + row.product_id + '" data-vid="' + row.variation_id + '" data-pname="' + row.item_name + '" data-freeitem="' + row.is_free + '" data-freeitems=\'' + row.free_itmes + '\' data-img="' + row.product_img + '" data-srfee="0" data-sristaxable="' + false + '" data-meta_data=\'' + row.item_meta + '\'>';

            if (row.is_free) {
                itemHtml += '<td class="text-center item-action"></td><td>' + row.item_name + '</td><td class="text-right">' + row.product_rate.toFixed(2) + '</td>';
                itemHtml += '<td><input min="1" autocomplete="off" disabled class="form-control number rowCalulate" type="number" id="txt_ItemQty_' + PKey + '" value="' + row.product_qty + '" name="txt_ItemQty" placeholder="Qty"></td>';
            }
            else if (giftcard_amount > 0) {
                itemHtml += '<td class="text-center item-action"><button class="btn menu-icon-gr p-0 text-red btnDeleteItem billinfo" tabitem_itemid="' + PKey + '" onclick="removeItemsInTable(\'' + PKey + '\');" data-toggle="tooltip" title="Delete product"> <i class="glyphicon glyphicon-trash"></i></button></td>';
                itemHtml += '<td>' + row.item_name + '<div class="view-giftmeta" style="word-wrap: break-word;"> <b>To:</b> ' + _meta.wc_gc_giftcard_to_multiple + '<br><b>From:</b> ' + _meta.wc_gc_giftcard_from + '<br><b>Amount:</b> $' + giftcard_amount + '</div></td>';
                itemHtml += '<td class="text-right">' + row.product_rate.toFixed(2) + '</td><td><input min="1" autocomplete="off" disabled class="form-control number rowCalulate" type="number" id="txt_ItemQty_' + PKey + '" value="' + row.product_qty + '" name="txt_ItemQty" placeholder="Qty"></td>';
            }
            else {
                itemHtml += '<td class="text-center item-action"><button class="btn menu-icon-gr p-0 text-red btnDeleteItem billinfo" tabitem_itemid="' + PKey + '" onclick="removeItemsInTable(\'' + PKey + '\');" data-toggle="tooltip" title="Delete product"> <i class="glyphicon glyphicon-trash"></i></button></td>';
                itemHtml += '<td>' + row.item_name + '<div class="view-addmeta" style="word-wrap: break-word;">';
                //$.each(_meta, function (name, value) { itemHtml += '<b>' + name.replace('_system_', '') + '</b> : ' + value + '<br>'; });
                itemHtml += '</div></td>';
                itemHtml += '<td class="text-right">' + row.product_rate.toFixed(2) + '</td><td><input min="1" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_ItemQty_' + PKey + '" value="' + row.product_qty + '" name="txt_ItemQty" placeholder="Qty"></td>';
            }
            itemHtml += '<td class="TotalAmount text-right" data-regprice="' + row.product_rate + '"data-salerate="' + row.sale_price + '" data-discount="' + row.discount.toFixed(2) + '" data-amount="' + row.gross_total + '" data-taxamount="' + row.tax_total + '" data-shippingamt="' + row.shipping_total + '">' + row.gross_total.toFixed(2) + '</td>';
            itemHtml += '<td class="text-right RowDiscount" data-disctype="" data-couponamt="0">' + row.discount.toFixed(2) + '</td>';
            itemHtml += '<td class="text-right linetotal">' + (row.gross_total - row.discount).toFixed(2) + '</td>';
            itemHtml += '<td class="text-right RowTax">' + row.tax_total.toFixed(2) + '</td>';
            itemHtml += '</tr>';
            zQty = zQty + (parseFloat(row.product_qty) || 0.00);
            zGAmt = zGAmt + (parseFloat(row.gross_total) || 0.00);
            zTotalTax = zTotalTax + (parseFloat(row.tax_total) || 0.00);
            zTDiscount = zTDiscount + row.discount;
        }
        else if (row.item_type == 'coupon') {
            let cou_amt = parseFloat(row.net_total) || 0.00;
            let coupon_list = auto_coupon.filter(element => element.post_title.toLowerCase() == row.item_name.toLowerCase());
            $.each(coupon_list, function (j, rCou) {
                couponHtml += '<li id="li_' + rCou.post_title.toString().toLowerCase().replaceAll(' ', '_') + '" class="' + (rCou.discount_type == 'fixed_cart' ? 'cart' : 'items') + '" data-coupon= "' + rCou.post_title.toString().toLowerCase() + '" data-couponamt= "' + rCou.coupon_amount + '" data-disctype= "' + rCou.discount_type + '" data-rqprdids= "' + rCou.product_ids + '" data-excludeids= "' + rCou.exclude_product_ids + '" data-type= "' + rCou.type + '">';
                couponHtml += '<a href="javascript:void(0);">';
                couponHtml += '<i class="fa fa-gift"></i><span>' + rCou.title + '</span>';
                couponHtml += '<div class="pull-right">';
                if (rCou.type == 'add_coupon') { couponHtml += '$<span id="cou_discamt">' + cou_amt.toFixed(2) + '</span><button type="button" class="btn btn-box-tool pull-right billinfo" onclick="deleteAllCoupons(\'' + rCou.post_title.toString().toLowerCase() + '\');" data-toggle="tooltip" title="Delete coupon"> <i class="fa fa-times"></i></button>'; }
                else { couponHtml += '$<span id="cou_discamt" style ="margin-right: 20px;">' + cou_amt.toFixed(2) + '</span>'; }
                couponHtml += '</div>';
                couponHtml += '</a>';
                couponHtml += '</li>';
            });
            if (coupon_list.length == 0) {
                let cpn_name = row.item_name, cpn_info = row.item_meta.length > 0 ? JSON.parse(row.item_meta) : '{}';
                couponHtml += '<li id="li_' + cpn_name.toString().toLowerCase().replaceAll(' ', '_') + '" class="' + (cpn_info.discount_type == 'fixed_cart' ? 'cart' : 'items') + '" data-coupon= "' + row.item_name + '" data-couponamt= "' + (cpn_info.coupon_amount != '' && cpn_info.coupon_amount != undefined ? cpn_info.coupon_amount : cou_amt) + '" data-disctype= "' + (cpn_info.discount_type != '' && cpn_info.discount_type != undefined ? cpn_info.discount_type : '') + '" data-rqprdids="' + (cpn_info.product_ids != '' && cpn_info.product_ids != undefined ? cpn_info.product_ids : '') + '" data-excludeids="' + (cpn_info.exclude_product_ids != '' && cpn_info.exclude_product_ids != undefined ? cpn_info.exclude_product_ids : '') + '" data-type= "add_coupon">';
                couponHtml += '<a href="javascript:void(0);">';
                couponHtml += '<i class="fa fa-gift"></i><span>' + cpn_name.toString().toLowerCase() + '</span>';
                couponHtml += '<div class="pull-right">$<span id="cou_discamt">' + cou_amt.toFixed(2) + '</span><button type="button" class="btn btn-box-tool pull-right billinfo" onclick="deleteAllCoupons(\'' + cpn_name.toString().toLowerCase().replaceAll(' ', '_') + '\');" data-toggle="tooltip" title="Delete coupon"><i class="fa fa-times"></i></button></div>';
                couponHtml += '</a>';
                couponHtml += '</li>';
            }
        }
        else if (row.item_type == 'fee' && row.item_name == 'State Recycling Fee') {
            recyclingfeeHtml += '<tr id="trfeeid_' + row.item_name.toString().toLowerCase().replaceAll(' ', '_') + '" data-pname="' + row.item_name + '">';
            recyclingfeeHtml += '<td class="text-center item-action"><i class="fa fa-plus-circle"></i></td>';
            recyclingfeeHtml += '<td>' + row.item_name + '</td><td></td><td></td><td></td><td></td><td class="TotalAmount text-right">' + row.net_total.toFixed(2) + '</td><td></td>';
            recyclingfeeHtml += '</tr>';
            zStateRecyclingAmt = zStateRecyclingAmt + (parseFloat(row.net_total) || 0.00);
        }
        else if (row.item_type == 'fee' && row.item_name != 'State Recycling Fee') {
            let startingNumber = (row.item_name.match(/^-?\d+\.\d+|^-?\d+\b|^\d+(?=\w)/g) || []);
            let feetype = row.item_name.match(/%/g) != null ? '%' : '';
            let sd = feetype == '%' ? (parseFloat(startingNumber) || 0.00) : parseFloat(row.net_total);
            feeHtml += '<tr id="trfeeid_' + row.item_sequence + '" data-pname="' + row.item_name + '" data-feeamt="' + sd + '" data-feetype="' + feetype + '"> ';
            feeHtml += '<td class="text-center item-action"><button class="btn menu-icon-gr p-0 text-success  billinfo" onclick="AddFeeModal(' + row.item_sequence + ',\'' + 0 + '\',\'' + row.item_name + '\',' + sd + ',\'' + feetype + '\');" data-toggle="tooltip" title="Edit fee"> <i class="glyphicon glyphicon-edit"></i></button>';
            feeHtml += '<button class="btn menu-icon-gr p-0 text-red billinfo" onclick="RemoveFee(\'' + row.item_sequence + '\');" data-toggle="tooltip" title="Delete fee"> <i class="glyphicon glyphicon-trash"></i></button></td>';
            feeHtml += '<td>' + row.item_name + '</td><td></td><td></td><td></td><td></td><td class="TotalAmount text-right">' + row.net_total.toFixed(2) + '</td><td></td>';
            feeHtml += '</tr>';
            zFeeAmt = zFeeAmt + (parseFloat(row.net_total) || 0.00);
        }
        else if (row.item_type == 'shipping') {
            shippingHtml += '<tr id="tritemId_' + row.item_sequence + ' data-pname="' + row.item_name + '">';
            shippingHtml += '<td class="text-center item-action"><i class="fa fa-shipping-fast"></i></td>';
            shippingHtml += '<td>Shipping</td><td></td><td></td><td></td><td></td><td class="TotalAmount text-right">' + row.net_total.toFixed(2) + '</td><td></td>';
            shippingHtml += '</tr>';
            zShippingAmt = zShippingAmt + (parseFloat(row.net_total) || 0.00);
        }
        else if (row.item_type == 'gift_card') {
            //_meta = JSON.parse(row.item_meta);
            giftcardHtml += '<li id="li_' + row.item_name.toString().toLowerCase().replaceAll(' ', '_') + '" data-pn="' + row.item_name.toString() + '" data-id="' + row.product_id + '" data-amount="' + row.net_total.toFixed(2) + '">';
            giftcardHtml += '<a href="javascript:void(0);">';
            giftcardHtml += '<i class="glyphicon glyphicon-gift"></i><span>' + row.item_name + '</span>';
            giftcardHtml += '<div class="pull-right">$<span id="gift_amt">' + row.net_total.toFixed(2) + '</span><button type="button" class="btn btn-box-tool pull-right billinfo" onclick="deleteAllGiftCard(\'' + row.item_name.toString().toLowerCase() + '\');" data-toggle="tooltip" title="Delete gift card"><i class="fa fa-times"></i></button></div>';
            giftcardHtml += '</a>';
            giftcardHtml += '</li>';
            zGiftCardAmt = zGiftCardAmt + (parseFloat(row.net_total) || 0.00);
        }
        else if (row.item_type == 'tax') {
            _tax.push({ quote_no: row.quote_no, name: row.item_name, label: row.item_meta, rate: row.tax_total, amount: row.net_total });
        }
    });
    $('#order_line_items').append(itemHtml); $('#order_state_recycling_fee_line_items').append(recyclingfeeHtml); $('#order_fee_line_items').append(feeHtml); $('#order_shipping_line_items').append(shippingHtml); $('#billGiftCard').append(giftcardHtml); $('#order_refunds').append(refundHtml);
    $('.refund-action').append('<button type="button" id="btnAddFee" class="btn btn-danger billinfo" data-toggle="tooltip" title="Add Other Fee">Fees</button> ');
    $('#billCoupon').append(couponHtml);
    //Calculate Final
    FinalTotalControl(_tax);
    $("#totalQty").text(zQty.toFixed(0)); $("#totalQty").data('qty', zQty.toFixed(0));
    $("#SubTotal").text(zGAmt.toFixed(2));
    $("#discountTotal").text(zTDiscount.toFixed(2));
    $("#shippingTotal").text(zShippingAmt.toFixed(2));
    //$("#salesTaxTotal").text(zTotalTax.toFixed(2));
    $("#stateRecyclingFeeTotal").text(zStateRecyclingAmt.toFixed(2));
    $("#feeTotal").text(zFeeAmt.toFixed(2)); $("#giftCardTotal").text(zGiftCardAmt.toFixed(2));
    $("#orderTotal").html((zGAmt - zTDiscount + zShippingAmt + zTotalTax + zStateRecyclingAmt + zFeeAmt - zGiftCardAmt).toFixed(2));
    $("#refundedTotal").text(zRefundAmt.toFixed(2)); $("#refundedByGiftCard").text(zGiftCardRefundAmt.toFixed(2));
    $("#netPaymentTotal").text(((zGAmt - zTDiscount + zShippingAmt + zTotalTax + zStateRecyclingAmt + zFeeAmt - zGiftCardAmt) + zRefundAmt).toFixed(2));
    if (zRefundAmt != 0 || zGiftCardRefundAmt != 0) $(".refund-total").removeClass('hidden'); else $(".refund-total").addClass('hidden');
    $("#divAddItemFinal").find(".rowCalulate").change(function () { calculateDiscountAcount(); });
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
            if (options.strValue4 == '') return false;
            $.post('/Orders/GetProductShipping', options).then(response => {
                if (response != '') {
                    response = JSON.parse(response);
                    $("#order_line_items > tr.paid_item").each(function (index, tr) {
                        let proudct_item = response['Table'].find(el => el.vid === $(tr).data('vid'));
                        if (proudct_item != null) { $(tr).find(".TotalAmount").data("shippingamt", proudct_item.fee); }
                        else { $(tr).find(".TotalAmount").data("shippingamt", 0.00); }
                        let proudct_sr = response['Table1'].find(el => el.pid === $(tr).data('pid'));
                        if (proudct_sr != null) { $(tr).data("srfee", proudct_sr.fee); $(tr).data("sristaxable", !!parseInt(proudct_sr.is_taxable)); }
                        else { $(tr).data("srfee", 0.00); $(tr).data("sristaxable", false); }
                    });
                }
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

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Search Customer Popup ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function searchCustomerModal() {
    let modalHtml = '<div class="modal-dialog">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    modalHtml += '<h4 class="modal-title" id="myModalLabel">Search Customer</h4>';
    modalHtml += '</div>';
    modalHtml += '<div class="modal-body"></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#myModal").empty().html(modalHtml);

    modalHtml = '<div class="row nowrap-row">';
    modalHtml += '<div class="col-md-12">';
    modalHtml += '<div class="form-group"><select class="form-control select2" id="ddlCustomerSearch" placeholder="Select Customer Email" style="width: 100%;"></select></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    modalHtml += '<div class="row mt-1">';
    modalHtml += '<div class="col-md-12">';
    modalHtml += '<div class="table-responsive">';
    modalHtml += '<table id="tblCusOrders" class="table table-blue check-table table-bordered table-striped dataTable tablelist">';
    modalHtml += '<thead><tr><th style="width: 30%">Select Address</th><th style="width: 35%">Billing Address</th><th style="width: 35%">Shipping Address</th></tr></thead>';
    modalHtml += '<tbody></tbody>';
    modalHtml += '</table>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    modalHtml += '</div>';

    $('#myModal .modal-body').append(modalHtml);
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
}
function bindCustomerOrders(id) {
    $.post('/Orders/GetCustomersAddresssList', { strValue1: parseInt(id) || 0 }).then(response => {
        $('#tblCusOrders').dataTable({
            destroy: true, data: JSON.parse(response), order: [[0, "desc"]],
            columns: [
                {
                    data: 'customer_id', title: 'Select Address', sWidth: "30%",
                    render: function (data, type, dtrow, meta) {
                        let row = JSON.parse(dtrow.meta_data);
                        let defval = '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="ShowUseAddress(this);" value="' + $('<div/>').text(data).html() + '"><label></label>';
                        let val = ' data-bfn="' + row._billing_first_name + '" data-bln="' + row._billing_last_name + '" data-bcom="' + (isNullAndUndef(row._billing_company) ? row._billing_company : '') + '" data-ba1="' + (isNullAndUndef(row._billing_address_1) ? row._billing_address_1 : '') + '" data-ba2="' + (isNullAndUndef(row._billing_address_2) ? row._billing_address_2 : '') + '" data-bc="' + row._billing_city + '" data-bs="' + row._billing_state + '" data-bct="' + row._billing_country + '" data-bpc="' + row._billing_postcode + '" data-bp="' + row._billing_phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '" data-bem="' + row._billing_email + '"';
                        val += ' data-sfn="' + row._shipping_first_name + '" data-sln="' + row._shipping_last_name + '" data-scom="' + (isNullAndUndef(row._shipping_company) ? row._shipping_company : '') + '" data-sa1="' + (isNullAndUndef(row._shipping_address_1) ? row._shipping_address_1 : '') + '" data-sa2="' + (isNullAndUndef(row._shipping_address_2) ? row._shipping_address_2 : '') + '" data-sc="' + row._shipping_city + '" data-ss="' + row._shipping_state + '" data-sct="' + row._shipping_country + '" data-spc="' + row._shipping_postcode + '"';
                        return defval + ' <button type="button" id="btnUseAddress" class="btn btn-danger hidden" onclick="selectCustomerAddress(this);" ' + val + '>Use this address for order</button>'
                    }
                },
                {
                    data: 'meta_data', title: 'Billing Address', sWidth: "35%", render: function (data, type, dtrow) {
                        let row = JSON.parse(dtrow.meta_data);
                        let val = '<address class="no-margin">' + row._billing_first_name + ' ' + row._billing_last_name + (dtrow.IsDefault == 1 ? ' <span class="label label-success">Default</span>' : '') + (isNullUndefAndSpace(row._billing_company) ? '<br>' + row._billing_company : '') + (isNullUndefAndSpace(row._billing_address_1) ? '<br>' + row._billing_address_1 : '') + (isNullUndefAndSpace(row._billing_address_2) ? '<br>' + row._billing_address_2 : '') + '<br>' + row._billing_city + ', ' + row._billing_state + ' ' + row._billing_postcode + ' ' + row._billing_country + '<br>Phone: ' + row._billing_phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '<br>Email: ' + row._billing_email + '</address>';
                        return val;
                    }
                },
                {
                    data: 'shipping_first_name', title: 'Shipping Address', sWidth: "35%", render: function (data, type, dtrow) {
                        let row = JSON.parse(dtrow.meta_data);
                        let val = '<address class="no-margin">' + row._shipping_first_name + ' ' + row._shipping_last_name + (isNullUndefAndSpace(row._shipping_company) ? '<br>' + row._shipping_company : '') + (isNullUndefAndSpace(row._shipping_address_1) ? '<br>' + row._shipping_address_1 : '') + (isNullUndefAndSpace(row._shipping_address_2) ? '<br>' + row._shipping_address_2 : '') + '<br>' + row._shipping_city + ', ' + row._shipping_state + ' ' + row._shipping_postcode + ' ' + row._shipping_country + '</address>';
                        return val;
                    }
                }
            ]
        });
    }).catch(err => { swal('Error!', err, 'error'); });
}
function ShowUseAddress(chk) {
    let isChecked = $(chk).prop("checked");
    $("[name='CheckSingle']").prop("checked", false); $("[name='CheckSingle']").parent().parent().find('#btnUseAddress').addClass('hidden');
    $(chk).prop("checked", isChecked);
    if (isChecked == false) $(chk).parent().parent().find('#btnUseAddress').addClass('hidden');
    else $(chk).parent().parent().find('#btnUseAddress').removeClass('hidden');
}
function selectCustomerAddress(ele) {
    let cus_id = parseInt($("#ddlCustomerSearch").val()) || 0, cus_text = $("#ddlCustomerSearch option:selected").text();
    if (cus_id > 0) {
        $("#ddlUser").empty().append('<option value="' + cus_id + '" selected>' + cus_text + '</option>');
        $("#myModal").modal('hide'); $('.billinfo').prop("disabled", false); $('.agentaddtocart').removeClass('hidden');

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
    $("#myModal").empty().html(modalHtml);

    let myHtml = '';
    myHtml += '<div class="row">';
    myHtml += '<div class="col-md-6">';
    myHtml += '<div class="form-group">First Name<span class="text-red">*</span><input type="text" id="txtCusFirstName" class="form-control" placeholder="First Name"/></div>';
    myHtml += '</div >';

    myHtml += '<div class="col-md-6">';
    myHtml += '<div class="form-group">Last Name<span class="text-red">*</span><input type="text" id="txtCusLastName" class="form-control" placeholder="Last Name"/></div>';
    myHtml += '</div >';
    myHtml += '</div >';

    myHtml += '<div class="row">';
    myHtml += '<div class="col-md-6">';
    myHtml += '<div class="form-group">User Name/Email<span class="text-red">*</span><input type="text" id="txtCusNickName" class="form-control" placeholder="User Name" value="' + cus_name + '"/></div>';
    myHtml += '</div >';

    myHtml += '<div class="col-md-6">';
    myHtml += '<div class="form-group">Contact No.<span class="text-red">*</span><input type="tel" id="txtCusBillingMobile" class="form-control" placeholder="Contact No." maxlength="11"/></div>';
    myHtml += '</div >';
    myHtml += '</div >';

    myHtml += '<div class="row">';
    myHtml += '<div class="col-md-4">';
    myHtml += '<div class="form-group">Country<span class="text-red">*</span><select class="form-control select2" id="ddlCusBillingCountry"><option value="US">US - United States</option><option value="CA">CA - Canada</option></select></div>';
    myHtml += '</div >';

    myHtml += '<div class="col-md-4">';
    myHtml += '<div class="form-group"><i class="glyphicon glyphicon-map-marker" aria-hidden="true"></i> Address<span class="text-red">*</span><input type="text" id="txtCusBillingAddress1" class="form-control searchAddress" data-addresstype="cus-bill" placeholder="Address"/></div>';
    myHtml += '</div >';

    myHtml += '<div class="col-md-4">';
    myHtml += '<div class="form-group">Address Line 2<input type="text" id="txtCusBillingAddress2" class="form-control" placeholder="Address Line 2"/></div>';
    myHtml += '</div >';
    myHtml += '</div >';

    myHtml += '<div class="row">';
    myHtml += '<div class="col-md-4">';
    myHtml += '<div class="form-group">Zip Code<span class="text-red">*</span><input type="text" id="txtCusBillingPostCode" class="form-control" placeholder="Zip Code"/></div>';
    myHtml += '</div >';

    myHtml += '<div class="col-md-4">';
    myHtml += '<div class="form-group">City<span class="text-red">*</span><input type="tel" id="txtCusBillingCity" class="form-control" placeholder="City"/></div>';
    myHtml += '</div >';

    myHtml += '<div class="col-md-4">';
    myHtml += '<div class="form-group">State<span class="text-red">*</span><select class="form-control select2" id="ddlCusBillingState"></select></div>';
    myHtml += '</div>';
    myHtml += '</div>';

    $('#myModal .modal-body').append(myHtml); BindStateCounty("ddlCusBillingState", { id: 'US' });
    $("#ddlCusBillingCountry,#ddlCusBillingState").select2({ dropdownParent: "#myModal" });
    $("#myModal").modal({ backdrop: 'static', keyboard: false }); $("#txtCusFirstName").focus(); $("#txtCusBillingMobile").mask("(999) 999-9999"); //$("#ddlCusBillingState,#ddlCusBillingCountry").select2();
    //let newEl = document.getElementById('txtCusBillingAddress1');
    //setupAutocomplete(newEl);
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

    if (FirstName == "") { swal('alert', 'Please Enter First Name', 'error').then(function () { swal.close(); $('#txtCusFirstName').focus(); }) }
    else if (LastName == "") { swal('alert', 'Please Enter Last Name', 'error').then(function () { swal.close(); $('#txtCusLastName').focus(); }) }
    else if (Email == "") { swal('alert', 'Please Enter Email', 'error').then(function () { swal.close(); $('#txtCusNickName').focus(); }) }
    else if (Email != "" && !rex_email.test(Email)) { swal('alert', 'Please enter valid email.', 'error').then(function () { swal.close(); $('#txtCusNickName').focus(); }) }
    //else if (NickName == "") { swal('alert', 'Please Enter User Name', 'error').then(function () { swal.close(); $('#txtUserNickName').focus(); }) }
    else if (BillingPhone == "") { swal('alert', 'Please Enter Contact No.', 'error').then(function () { swal.close(); $('#txtCusBillingMobile').focus(); }) }
    else if (BillingCountry == "") { swal('alert', 'Please Enter Country', 'error').then(function () { swal.close(); $('#ddlCusBillingCountry').focus(); }) }
    else if (BillingAddress1 == "") { swal('alert', 'Please Enter Address 1', 'error').then(function () { swal.close(); $('#txtCusBillingAddress1').focus(); }) }
    else if (BillingPostcode == "") { swal('alert', 'Please Enter Zip Code', 'error').then(function () { swal.close(); $('#txtCusBillingPostCode').focus(); }) }
    else if (BillingCity == "") { swal('alert', 'Please Enter City', 'error').then(function () { swal.close(); $('#txtCusBillingCity').focus(); }) }
    else if (BillingState == "") { swal('alert', 'Please Enter State', 'error').then(function () { swal.close(); $('#ddlCusBillingState').select(); }) }
    else if (BillingState == "0") { swal('alert', 'Please Enter State', 'error').then(function () { swal.close(); $('#ddlCusBillingState').focus(); }) }
    else {
        var obj = {
            ID: 0, user_email: Email, user_nicename: NickName, first_name: FirstName, last_name: LastName, billing_address_1: BillingAddress1,
            billing_address_2: BillingAddress2, billing_postcode: BillingPostcode, billing_country: BillingCountry,
            billing_state: BillingState, billing_city: BillingCity, billing_phone: BillingPhone
        }
        ajaxFunction('/Customer/NewUser/', obj, beforeSendFun, function (data) {
            if (data.status == true) {
                swal('Success', data.message, 'success');
                $("#ddlUser").empty().append('<option value="' + data.id + '" selected>' + Email + '</option>');
                $("#myModal").modal('hide'); $('.billinfo').prop("disabled", false);
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
                $('#txtbillphone').val(BillingPhone); $('.agentaddtocart').removeClass('hidden');
            }
            else {
                swal('Error', data.message, 'error')
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
///Find Address of Customer
function CustomerAddress(id) {
    //$("#ddlUser").val()
    let option = { strValue1: parseInt(id) || 0 };
    if (option.strValue1 > 0) {
        $.post('/Orders/GetCustomerAddress', option).then(response => {
            let data = JSON.parse(response);
            //for (var i = 0; i < data.length; i++) {
            $.each(data, function (i, row) {
                ///billing_Details
                if (row.meta_key == 'billing_first_name') { $('#txtbillfirstname').val(row.meta_value); }
                else if (row.meta_key == 'billing_last_name') { $('#txtbilllastname').val(row.meta_value); }
                else if (row.meta_key == 'billing_company') { $('#txtbillcompany').val(row.meta_value); }
                else if (row.meta_key == 'billing_address_1') { $('#txtbilladdress1').val(row.meta_value); }
                else if (row.meta_key == 'billing_address_2') { $('#txtbilladdress2').val(row.meta_value); }
                else if (row.meta_key == 'billing_postcode') { $('#txtbillzipcode').val(row.meta_value); }
                else if (row.meta_key == 'billing_city') { $('#txtbillcity').val(row.meta_value); }
                else if (row.meta_key == 'billing_country') { $('#ddlbillcountry').val(row.meta_value.trim()).trigger('change'); }
                else if (row.meta_key == 'billing_state') { $('#ddlbillstate').val(row.meta_value).trigger('change'); }
                else if (row.meta_key == 'billing_email') { $('#txtbillemail').val(row.meta_value); }
                else if (row.meta_key == 'billing_phone') { $('#txtbillphone').val(row.meta_value.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3")); }
                ///shipping_Details
                else if (row.meta_key == 'shipping_first_name') { $('#txtshipfirstname').val(row.meta_value); }
                else if (row.meta_key == 'shipping_last_name') { $('#txtshiplastname').val(row.meta_value); }
                else if (row.meta_key == 'shipping_company') { $('#txtshipcompany').val(row.meta_value); }
                else if (row.meta_key == 'shipping_address_1') { $('#txtshipaddress1').val(row.meta_value); }
                else if (row.meta_key == 'shipping_address_2') { $('#txtshipaddress2').val(row.meta_value); }
                else if (row.meta_key == 'shipping_postcode') { $('#txtshipzipcode').val(row.meta_value); }
                else if (row.meta_key == 'shipping_city') { $('#txtshipcity').val(row.meta_value); }
                else if (row.meta_key == 'shipping_country') { $('#ddlshipcountry').val(row.meta_value.trim()).trigger('change'); }
                else if (row.meta_key == 'shipping_state') { $('#ddlshipstate').val(row.meta_value.trim()).trigger('change'); }
                $('.agentaddtocart').removeClass('hidden');
            });
        }).catch(err => { $('.billinfo').prop("disabled", true); swal('Error!', err, 'error'); }).always(function () { $('.billinfo').prop("disabled", false); });

        //setTimeout(function () { GetTaxRate(); }, 100);
    }
    else {
        $('.billinfo').prop("disabled", true);
        $('#txtbillfirstname,#txtbilllastname,#txtbillcompany,#txtbilladdress1,#txtbilladdress2,#txtbillzipcode,#txtbillcity,#txtbillemail,#txtbillphone').val('');
        $('#ddlbillcountry').val('US').trigger('change');
        $('#txtshipfirstname,#txtshiplastname,#txtshipcompany,#txtshipaddress1,#txtshipaddress2,#txtshipzipcode,#txtshipcity').val('');
        $('#ddlshipcountry').val('US').trigger('change'); $('#hfTaxRate').val('0');
    }
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Add/Edit Order Item Tab Section ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getItemList(pid, vid, Qty) {
    if ($('#tritemId_' + pid + '_' + vid).length > 0) { swal('Alert!', 'Product already added to list.', "error"); return false; }
    $("#loader").show();
    let option = { strValue1: pid, strValue2: vid, strValue3: $('#ddlshipcountry').val(), strValue4: $('#ddlshipstate').val() };
    let tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00;
    let monthlySaleCoupon = ["sales20off"];
    ajaxFunction('/Orders/GetProductInfo', option, beforeSendFun, function (result) {
        let _list = [], auto_code = [];
        $.each(result, function (key, pr) {
            pr.quantity = pr.quantity * Qty;
            let coupon_amt = 0.00, coupon_type = 'fixed_product', row_key = pr.product_id + '_' + pr.variation_id;
            if (!pr.is_free) {
                if (pr.reg_price > pr.sale_price) {
                    coupon_amt = (pr.reg_price - pr.sale_price) * pr.quantity;
                    //let pro_ids = [pr.variation_id, -1];
                    let coupon_list = auto_coupon.filter(element => element.post_title_id == pr.product_id);
                    if (coupon_list.length > 0) {
                        coupon_list[0].coupon_amount = coupon_amt; //coupon_list[0].product_ids = pro_ids;
                        if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
                    }
                }
            }
            _list.push({
                PKey: row_key, product_id: pr.product_id, variation_id: pr.variation_id, product_name: pr.product_name, product_img: '', quantity: pr.quantity, reg_price: pr.reg_price, sale_rate: pr.sale_price, total: (pr.reg_price * pr.quantity), discount_type: coupon_type, discount: coupon_amt, tax_amount: ((pr.reg_price * pr.quantity) * tax_rate),
                shipping_amount: pr.shipping_amount, is_free: pr.is_free, free_itmes: pr.free_itmes, order_item_id: 0, sr_fee: pr.staterecycle_fee, sr_fee_istaxable: pr.staterecycle_istaxable, order_id: parseInt($('#hfOrderNo').val()) || 0, meta_data: pr.meta_data
            });
        });
        //console.log(auto_code,_list);
        //Bind diff Coupon
        if (auto_code.length > 0) bindCouponList(auto_code);
        if (_list.length > 0) bindItemListDataTable(_list);
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
                    else layoutHtml += '<td class="text-center"><button class="btn menu-icon-gr p-0 text-red btnDeleteItem billinfo" tabitem_itemid="' + pr.PKey + '" onclick="removeItemsInTable(\'' + pr.PKey + '\');" data-toggle="tooltip" data-original-title="Delete product"> <i class="glyphicon glyphicon-trash" data-toggle="tooltip" title="Delete product"></i> </button></td>';
                    layoutHtml += '<td>' + pr.product_name + '</td>';
                    layoutHtml += '<td class="text-right">' + pr.reg_price.toFixed(2) + '</td>';
                    if (pr.is_free) layoutHtml += '<td><input min="1" autocomplete="off" disabled class="form-control billinfo number rowCalulate" type="number" id="txt_ItemQty_' + pr.PKey + '" value="' + pr.quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
                    else layoutHtml += '<td><input min="1" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_ItemQty_' + pr.PKey + '" value="' + pr.quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
                    layoutHtml += '<td class="TotalAmount text-right" data-regprice="' + pr.reg_price + '"data-salerate="' + pr.sale_rate + '" data-discount="' + pr.discount + '" data-amount="' + pr.total + '" data-taxamount="' + pr.tax_amount + '" data-shippingamt="' + pr.shipping_amount + '">' + pr.total.toFixed(2) + '</td>';
                    layoutHtml += '<td class="text-right RowDiscount" data-disctype="' + pr.discount_type + '" data-couponamt="0">' + pr.discount.toFixed(2) + '</td>';
                    layoutHtml += '<td class="text-right linetotal">' + (pr.total - pr.discount).toFixed(2) + '</td>';
                    layoutHtml += '<td class="text-right RowTax">' + pr.tax_amount.toFixed(4) + '</td>';
                    layoutHtml += '</tr>';
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
        layoutHtml += '<th class="text-center" style="width: 8%">Actions</th>';
        layoutHtml += '<th style="width: 32%">Item</th>';
        layoutHtml += '<th class="text-right" style="width: 10%">Sale Price</th>';
        layoutHtml += '<th class="text-right" style="width: 10%">Quantity</th>';
        layoutHtml += '<th class="text-right" style="width: 10%">Sub-Total</th>';
        layoutHtml += '<th class="text-right" style="width: 10%">Discount</th>';
        layoutHtml += '<th class="text-right" style="width: 10%">Total</th>';
        layoutHtml += '<th class="text-right" style="width: 10%">Tax</th>';
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
function removeItemsInTable(id) {
    //------------- Remove data in Temp AddItemList-----
    swal({ text: 'Would you like to remove this item?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) {
                $('#tritemId_' + id).remove();
                // no cart item
                if ($("#order_line_items > tr.paid_item").length == 0) { $('#billCoupon,#billGiftCard').empty(); }
                else if ($("#order_line_items > tr.gift_item").length == 0) { $('#btnApplyCoupon,#btnApplyGiftCard').prop("disabled", false); }
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
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Add Gift Card Product ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function AddGiftCardProductModal(p_name, pid) {
    //ActivityLog('Edit fee (' + feevalue + ') in order id (' + $('#hfOrderNo').val() + ')', '/Product/AddNewProduct/');
    var feeHtml = '<div class="modal-dialog">';
    feeHtml += '<div class="modal-content">';
    feeHtml += '<div class="modal-header">';
    feeHtml += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    feeHtml += '<h4 class="modal-title" id="myModalLabel">Add Gift Card Product</h4>';
    feeHtml += '</div>';
    feeHtml += '<div class="modal-body">';

    feeHtml += '<div class="row">';
    feeHtml += '<div class="col-md-6">Amount<span class="text-red">*</span><input class="form-control" type="number" id="txtGiftAmt" placeholder="Amount" maxlength="15" autocomplete="true" value=""></div>';
    feeHtml += '<div class="col-md-6">Delivery Date<span class="text-red">*</span><input type="text" id="txtGiftDate" placeholder="Now" class="form-control" readonly=""></div>';
    feeHtml += '</div>';
    feeHtml += '<div class="row"><div class="col-md-12">To<span class="text-red">*</span><input type="text" id="txtGiftTo" class="form-control" placeholder="Enter an e-mail for each recipient, separating e-mails by comma (,)" value=""></div></div>';
    feeHtml += '<div class="row"><div class="col-md-12">From (Your Name)<span class="text-red">*</span><input class="form-control" type="input" id="txtGiftFrom" placeholder="Enter your name" maxlength="150" autocomplete="true" value=""></div></div>';
    feeHtml += '<div class="row"><div class="col-md-12">Message<textarea class="form-control" id="txtGiftMessage" rows="3" maxlength="500" placeholder="Add your message (optional)"></textarea></div></div>';

    feeHtml += '</div>';
    feeHtml += '<div class="modal-footer"><button type="button" class="btn btn-danger pull-right" id="btnAddGiftCardProduct" data-pid="' + pid + '" data-vid="0" data-name="' + p_name + '">Add</button></div>';
    feeHtml += '</div>';
    feeHtml += '</div>';
    $("#myModal").empty().html(feeHtml); $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $('#txtGiftDate').daterangepicker({ parentEl: "#myModal", minDate: moment(), singleDatePicker: true, autoUpdateInput: true, locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' } });
    $("#txtGiftAmt").focus();
}
function bindGiftCardProduct(p_name, pid, vid) {
    let _rate = parseFloat($('#txtGiftAmt').val()) || 0.00;
    let email = $('#txtGiftTo').val(); let emailsCollection = email.split(",");
    let _qty = emailsCollection.length;
    let _meta = { wc_gc_giftcard_amount: _rate, wc_gc_giftcard_from: $('#txtGiftFrom').val(), wc_gc_giftcard_message: $('#txtGiftMessage').val(), wc_gc_giftcard_to_multiple: email, wc_gc_giftcards: '' }
    let option = {
        PKey: pid + '_' + vid, product_id: pid, variation_id: vid, product_name: p_name, product_img: '', quantity: _qty, reg_price: _rate, sale_rate: _rate, total: _rate * _qty, discount_type: '', discount: 0, tax_amount: 0,
        shipping_amount: 0, is_free: false, free_itmes: '{}', order_item_id: 0, sr_fee: 0, sr_fee_istaxable: 0, order_id: parseInt($('#hfOrderNo').val()) || 0,
        meta_data: JSON.stringify(_meta)
    };
    let layoutHtml = '';
    if (option.product_id > 0) {
        if ($('#tritemId_' + option.PKey).length <= 0) {
            layoutHtml += '<tr id="tritemId_' + option.PKey + '" data-id="' + option.PKey + '" class="gift_item" data-pid="' + option.product_id + '" data-vid="' + option.variation_id + '" data-pname="' + option.product_name + '" data-freeitem="false" data-freeitems=\'{}\' data-orderitemid="' + option.order_item_id + '" data-img="' + option.product_img + '" data-srfee="' + option.sr_fee + '" data-sristaxable="' + option.sr_fee_istaxable + '" data-meta_data=\'' + option.meta_data + '\'>';
            layoutHtml += '<td class="text-center"><button class="btn menu-icon-gr p-0 text-red btnDeleteItem billinfo" tabitem_itemid="' + option.PKey + '" onclick="removeItemsInTable(\'' + option.PKey + '\');" data-toggle="tooltip" data-original-title="Delete product"> <i class="glyphicon glyphicon-trash" data-toggle="tooltip" title="Delete product"></i> </button></td>';
            layoutHtml += '<td>' + option.product_name + '<div class="view-giftmeta" style="word-wrap: break-word;"> <b>To:</b> ' + _meta.wc_gc_giftcard_to_multiple + '<br><b>From:</b> ' + _meta.wc_gc_giftcard_from + '<br><b>Amount:</b> $' + option.total + '</div></td>';
            layoutHtml += '<td class="text-right">' + option.reg_price.toFixed(2) + '</td>';
            layoutHtml += '<td><input min="1" autocomplete="off" disabled class="form-control number rowCalulate" type="number" id="txt_ItemQty_' + option.PKey + '" value="' + option.quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
            layoutHtml += '<td class="TotalAmount text-right" data-regprice="' + option.reg_price + '"data-salerate="' + option.sale_rate + '" data-discount="' + option.discount + '" data-amount="' + option.total + '" data-taxamount="' + option.tax_amount + '" data-shippingamt="' + option.shipping_amount + '">' + option.total.toFixed(2) + '</td>';
            layoutHtml += '<td class="text-right RowDiscount" data-disctype="' + option.discount_type + '" data-couponamt="0">' + option.discount.toFixed(2) + '</td>';
            layoutHtml += '<td class="text-right linetotal">' + (option.total - option.discount).toFixed(2) + '</td>';
            layoutHtml += '<td class="text-right RowTax">' + option.tax_amount + '</td>';
            layoutHtml += '</tr>';
            $('#order_line_items').append(layoutHtml);
        }
        else {
            layoutHtml += '<td class="text-center"><button class="btn menu-icon-gr p-0 text-red btnDeleteItem billinfo" tabitem_itemid="' + option.PKey + '" onclick="removeItemsInTable(\'' + option.PKey + '\');" data-toggle="tooltip" data-original-title="Delete product"> <i class="glyphicon glyphicon-trash" data-toggle="tooltip" title="Delete product"></i> </button></td>';
            layoutHtml += '<td>' + option.product_name + '<div class="view-giftmeta"> <b>To:</b> ' + _meta.wc_gc_giftcard_to_multiple + '<br><b>From:</b> ' + _meta.wc_gc_giftcard_from + '<br><b>Amount:</b> $' + option.total + '</div></td>';
            layoutHtml += '<td class="text-right">' + option.reg_price.toFixed(2) + '</td>';
            layoutHtml += '<td><input min="1" autocomplete="off" disabled class="form-control number rowCalulate" type="number" id="txt_ItemQty_' + option.PKey + '" value="' + option.quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
            layoutHtml += '<td class="TotalAmount text-right" data-regprice="' + option.reg_price + '"data-salerate="' + option.sale_rate + '" data-discount="' + option.discount + '" data-amount="' + option.total + '" data-taxamount="' + option.tax_amount + '" data-shippingamt="' + option.shipping_amount + '">' + option.total.toFixed(2) + '</td>';
            layoutHtml += '<td class="text-right RowDiscount" data-disctype="' + option.discount_type + '" data-couponamt="0">' + option.discount.toFixed(2) + '</td>';
            layoutHtml += '<td class="text-right linetotal">' + (option.total - option.discount).toFixed(2) + '</td>';
            layoutHtml += '<td class="text-right RowTax">' + option.tax_amount + '</td>';
            $('#tritemId_' + option.PKey).empty().append(layoutHtml); $('#tritemId_' + option.PKey).data('meta_data', option.meta_data)
        }
    }
    $("#myModal").modal('hide');
    $.when(RemoveCouponAndGiftCard()).done(function () { calculateDiscountAcount(); });
}
function RemoveCouponAndGiftCard() {
    if ($("#order_line_items > tr.gift_item").length > 0) {
        $("#billGiftCard,#billCoupon").empty(); $('#btnApplyCoupon,#btnApplyGiftCard').prop("disabled", true);
        let auto_code = [], tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00;
        $("#order_line_items > tr.paid_item").each(function (index, tr) {
            let pid = $(tr).data('pid'), coupon_amt = 0.00, disc_amt = 0.00, zGrossAmount = 0.00;
            let zQty = parseFloat($(tr).find("[name=txt_ItemQty]").val()) || 0.00;
            let reg_price = parseFloat($(tr).find(".TotalAmount").data("regprice")) || 0.00, sale_price = parseFloat($(tr).find(".TotalAmount").data("salerate")) || 0.00;
            //get diff Coupon
            if (reg_price > sale_price) {
                coupon_amt = (reg_price - sale_price);
                let coupon_list = auto_coupon.filter(element => element.post_title_id == pid);
                if (coupon_list.length > 0) {
                    coupon_list[0].coupon_amount = coupon_amt;
                    if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
                }
            }
            //14023 - Layla Kapok Pillow
            if (pid == 14023) {
                let coupon_list = auto_coupon.filter(element => element.post_title == "kapok-pillow");
                if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
            }
            zGrossAmount = reg_price * zQty, disc_amt = coupon_amt * zQty;
            $(tr).find(".TotalAmount").data("amount", zGrossAmount.toFixed(2)); $(tr).find(".TotalAmount").text(zGrossAmount.toFixed(2));

            $(tr).find(".RowDiscount").data("disctype", 'fixed'); $(tr).find(".RowDiscount").data("couponamt", coupon_amt.toFixed(2));
            $(tr).find(".RowDiscount").text(disc_amt.toFixed(2)); $(tr).find(".TotalAmount").data("discount", disc_amt.toFixed(2));
            zTotalTax = (((zGrossAmount - disc_amt) * tax_rate) / 100);
            $(tr).find(".RowTax").text(zTotalTax.toFixed(2)); $(tr).find(".TotalAmount").data("taxamount", zTotalTax.toFixed(2));
        });
        bindCouponList(auto_code);
    }
    else { $('#btnApplyCoupon,#btnApplyGiftCard').prop("disabled", false); }
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
    $("#myModal").empty().html(myHtml);
    $("#myModal").modal({ backdrop: 'static', keyboard: false }); $("#txt_Coupon").focus();
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
    let coupons = [];
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
    // If Gift Card purchase not apply any auto coupon
    if ($("#order_line_items > tr.gift_item").length > 0) return false;
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
        complete: function () {
            ActivityLog('Coupon applied (' + $("#txt_Coupon").val().toLowerCase().trim() + ') in order id (' + $('#hfOrderNo').val() + ') ', '/Orders/minesofmoria/' + $('#hfOrderNo').val() + '');
        },
        async: false
    });
    //$("#myModal").modal({ backdrop: 'static' }); $("#txt_Coupon").focus();
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
        $.each(data, function (key, li) {
            if ($('#li_' + li.post_title).length <= 0) {
                let cou_amt = parseFloat(li.coupon_amount) || 0.00;
                layoutHtml = '<li id="li_' + li.post_title.toString().toLowerCase().replaceAll(' ', '_') + '" class="' + (li.discount_type == 'fixed_cart' ? 'cart' : 'items') + '" data-coupon= "' + li.post_title + '" data-couponamt= "' + li.coupon_amount + '" data-disctype= "' + li.discount_type + '" data-rqprdids= "' + li.product_ids + '" data-excludeids= "' + li.exclude_product_ids + '" data-type= "' + li.type + '" data-orderitemid="0">';
                layoutHtml += '<a href="javascript:void(0);">';
                layoutHtml += '<i class="fa fa-gift"></i><span>' + li.title.toString().toLowerCase() + '</span>';
                layoutHtml += '<div class="pull-right">';
                if (data[0].type == 'add_coupon') {
                    layoutHtml += '$<span id="cou_discamt">' + cou_amt.toFixed(2) + '</span><button type="button" class="btn btn-box-tool pull-right" onclick="deleteAllCoupons(\'' + li.post_title.toString().toLowerCase() + '\');"><i class="fa fa-times"></i></button>';
                }
                else { layoutHtml += '$<span id="cou_discamt" style ="margin-right: 20px;">' + cou_amt.toFixed(2) + '</span>'; }
                layoutHtml += '</div>';
                layoutHtml += '</a>';
                layoutHtml += '</li>';
                //console.log(li.post_title, li.coupon_amount);
                $('#billCoupon').append(layoutHtml);
            }
            else {
                if (data[0].type == 'add_coupon') {
                    swal('Alert!', 'Coupon code already applied!', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false;
                }
                else if (li.type == 'diff') {
                    let rq_prd_ids = [];
                    if ($('#li_' + li.post_title).data('rqprdids') != "" && $('#li_' + li.post_title).data('rqprdids') != null) {
                        rq_prd_ids = $('#li_' + li.post_title).data('rqprdids').split(",").map((el) => parseInt(el));
                    }
                    rq_prd_ids.push(li.product_ids);
                    $('#li_' + li.post_title).data('rqprdids', rq_prd_ids.join(','));
                    //swal('Alert!', 'Coupon code already applied!', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false;
                }
            }
        });
        calculateDiscountAcount();
        $("#myModal").modal('hide');
    }
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
    else if (coupon_type == 'friend_diff') { $('#li_memory_foam_mattress,#li_hybrid_mattress').remove(); }
    else if (coupon_type == 'friend_auto') {
        $('#li_memory_foam_mattress,#li_hybrid_mattress').remove(); $("#billCoupon").find("[data-type='auto_coupon']").remove();
    }
    else if (coupon_type != '') {
        swal({ title: '', text: 'Would you like to remove this coupon?', type: "question", showCancelButton: true })
            .then((result) => {
                if (result.value) {
                    //Remove Coupon
                    $('#li_' + coupon_type.replaceAll(' ', '_')).remove(); $('#billCoupon').empty();
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
                                let coupon_list = auto_coupon.filter(element => element.post_title_id == pid);
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
                    });
                    $.when(bindCouponList(auto_code)).done(function () { ApplyAutoCoupon(); });
                }
            });
    }
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ row and final calculate ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function freeQtyUpdate() {
    $("#order_line_items > tr.free_item").each(function (index, row) {
        let zQty = 0.00, pid = parseInt($(this).data("pid")) || 0, vid = parseInt($(this).data("vid")) || 0;
        $("#order_line_items  > tr.paid_item").each(function (i, prow) {
            if ($(prow).data('freeitems')[pid] != undefined) { zQty += parseFloat($(prow).find("[name=txt_ItemQty]").val()) * parseFloat($(prow).data('freeitems')[pid]); }
            else if ($(prow).data('freeitems')[vid] != undefined) { zQty += parseFloat($(prow).find("[name=txt_ItemQty]").val()) * parseFloat($(prow).data('freeitems')[vid]); }
        });
        if (zQty <= 0) $('#tritemId_' + $(row).data('id')).remove();
        else $(row).find("[name=txt_ItemQty]").val(zQty.toFixed(0));
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
        $(row).find(".RowDiscount").text(zDisAmt); $(row).find(".TotalAmount").data("discount", zDisAmt); $(row).find(".RowDiscount").data("lastdiscount", 0.00);
        zTotalTax = (zGrossAmount - zDisAmt) * tax_rate;
        $(row).find(".linetotal").text((zGrossAmount - zDisAmt).toFixed(2));
        $(row).find(".RowTax").text(zTotalTax.toFixed(4)); $(row).find(".TotalAmount").data("taxamount", zTotalTax.toFixed(2));
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
                $(row).find(".RowDiscount").text(zDisAmt.toFixed(2)); $(row).find(".linetotal").text((zGrossAmount - zDisAmt).toFixed(2));
                //Taxation                     
                zTotalTax = (zGrossAmount - zDisAmt) * tax_rate;
                $(row).find(".RowTax").text(zTotalTax.toFixed(4)); $(row).find(".TotalAmount").data("taxamount", zTotalTax.toFixed(4));
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
function calcFinalTotals() {
    //calculateStateRecyclingFee();
    FinalTotalControl([]);
    let tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00, is_freighttax = $('#hfFreighttaxable').val();
    let zQty = 0.00, zDiscQty = 0.00, zGAmt = 0.00, zGiftCardAmt = 0.00, zTDiscount = 0.00, zTotalTax = 0.00, zShippingAmt = 0.00, zStateRecyclingAmt = 0.00, zFeeAmt = 0.00, zGiftAmt = 0.00, zTotal = 0.00;
    $("#order_line_items > tr").each(function (index, tr) {
        let rQty = (parseFloat($(tr).find("[name=txt_ItemQty]").val()) || 0.00), rGAmt = (parseFloat($(tr).find(".TotalAmount").data("amount")) || 0.00), rTDiscount = (parseFloat($(tr).find(".RowDiscount").text()) || 0.00);
        zQty += rQty; zGAmt = zGAmt + rGAmt; zTDiscount = zTDiscount + rTDiscount;
        if ($(this).data('pid') != "888864") zTotalTax = zTotalTax + ((rGAmt - rTDiscount) * tax_rate);
        if (parseFloat($(tr).find(".TotalAmount").data("amount")) > 0) zDiscQty = zDiscQty + (parseFloat($(tr).find("[name=txt_ItemQty]").val()) || 0.00);
        zShippingAmt = zShippingAmt + (parseFloat($(tr).find(".TotalAmount").data("shippingamt")) * rQty);
    });
    if (is_freighttax) zTotalTax = zTotalTax + (zShippingAmt * tax_rate);
    zStateRecyclingAmt = parseFloat($("#stateRecyclingFeeTotal").text()) || 0.00;
    $("#totalQty").text(zQty.toFixed(0)); $("#totalQty").data('qty', zDiscQty.toFixed(0));
    $("#SubTotal").text(zGAmt.toFixed(2)); $("#discountTotal").text(zTDiscount.toFixed(2));
    //$("#salesTaxTotal").text(zTotalTax.toFixed(2));
    //Tax Calculate
    $('#order_final_total .tax-total').each(function (index, li) {
        let _taxpercent = parseFloat($(li).data('percent')) || 0;
        let _Tax = ((zGAmt - zTDiscount) * _taxpercent);
        if (is_freighttax) _Tax = _Tax + (zShippingAmt * _taxpercent);
        $(li).text(_Tax.toFixed(4)); $(li).data('amount', _Tax.toFixed(4));
    });
    $("#shippingTotal").text(zShippingAmt.toFixed(2)); $('#order_shipping_line_items').find(".TotalAmount").text(zShippingAmt.toFixed(2));
    CalculateFee();
    zFeeAmt = parseFloat($("#feeTotal").text()) || 0.00; zTotal = (zGAmt - zTDiscount + zShippingAmt + zTotalTax + zStateRecyclingAmt + zFeeAmt);
    //$("#billGiftCard > li").each(function (_i, _li) { zGiftAmt += (parseFloat($(_li).find("[id=gift_amt]").text()) || 0.00); });
    let _orderTotal = zTotal;
    //Calculate gift card discount
    $('#billGiftCard li').each(function (index, li) {
        let gc_amt = parseFloat($(li).data('amount')) || 0.00;
        if (_orderTotal >= gc_amt) { $(li).find('#gift_amt').text(gc_amt.toFixed(2)); zGiftAmt += gc_amt; _orderTotal = _orderTotal - gc_amt; }
        else if (gc_amt >= _orderTotal) { $(li).find('#gift_amt').text(_orderTotal.toFixed(2)); zGiftAmt += _orderTotal; _orderTotal = _orderTotal - _orderTotal; }
        else { $(li).find('#gift_amt').text(_orderTotal); zGiftAmt += 0; }
    });

    $("#giftCardTotal").html(zGiftAmt.toFixed(2)); $("#orderTotal").html((zTotal - zGiftAmt).toFixed(2));
    let zRefundAmt = parseFloat($("#refundedTotal").text()) || 0.00; $("#netPaymentTotal").html((zTotal - zGiftAmt + zRefundAmt).toFixed(2));
    $('[data-toggle="tooltip"]').tooltip();
}
function FinalTotalControl(tax_list) {
    let _html = '<div class="form-group"><label class="col-sm-10 control-label">Sub-Total(<span id="totalQty">0</span>)</label><div class="col-sm-2 controls text-right">$<span id="SubTotal">0.00</span></div></div>';
    _html += '<div class="form-group"><label class="col-sm-10 control-label">Total Savings</label><div class="col-sm-2 controls text-right">$<span id="discountTotal">0.00</span></div></div>';
    _html += '<div class="form-group"><label class="col-sm-10 control-label">Shipping</label><div class="col-sm-2 controls text-right">$<span id="shippingTotal" data-orderitemid="0">0.00</span></div></div>';
    //_html += '<div class="form-group"><label class="col-sm-10 control-label">Shipping Tax</label<div class="col-sm-2 controls text-right">$<span id="shippingTaxTotal">0.00</span></div></div>';
    _html += '<div class="form-group"><label class="col-sm-10 control-label">State Recycling Fee</label><div class="col-sm-2 controls text-right">$<span id="stateRecyclingFeeTotal" data-orderitemid="0">0.00</span></div></div>';
    _html += '<div class="form-group"><label class="col-sm-10 control-label">Fee</label><div class="col-sm-2 controls text-right">$<span id="feeTotal">0.00</span></div></div>';
    // Add Tax
    if (tax_list.length > 0) {
        $.each(tax_list, function (index, value) {
            _html += '<div class="form-group"><label class="col-sm-10 control-label">' + value.label + ' - ' + (value.rate * 100).toFixed(2) + '%</label><div class="col-sm-2 controls text-right">$<span class="tax-total" data-name="' + value.name + '" data-label="' + value.label + '" data-percent="' + value.rate + '" data-amount="' + value.amount.toFixed(4) + '">' + value.amount.toFixed(4) + '</span></div></div>';
        });
    }
    else {
        $.each($('#hfTaxRate').data('meta_data'), function (name, value) {
            _html += '<div class="form-group"><label class="col-sm-10 control-label">' + value.type + ' - ' + (value.rate * 100).toFixed(2) + '%</label><div class="col-sm-2 controls text-right">$<span class="tax-total" data-name="' + value.name + '" data-label="' + value.type + '" data-percent="' + value.rate + '" data-amount="0">0.00</span></div></div>';
        });
    }
    _html += '<div class="form-group"><label class="col-sm-10 control-label">Gift Card</label><div class="col-sm-2 controls text-right">$<span id="giftCardTotal">0.00</span></div></div>';
    _html += '<div class="form-group"><label class="col-sm-10 control-label">Order Total</label><div class="col-sm-2 controls text-right"><strong>$<span id="orderTotal">0.00</span></strong></div></div>';
    // Refund 
    _html += '<div class="form-group refund-total hidden"><label class="col-sm-10 control-label">Refunded</label><div class="col-sm-2 controls text-right text-red text-weight-bold"><strong>$<span id="refundedTotal">0.00</span></strong></div></div>';
    _html += '<div class="form-group refund-total hidden"><label class="col-sm-10 control-label">Refunded By Gift Card</label><div class="col-sm-2 controls text-right text-red text-weight-bold"><strong>$<span id="refundedByGiftCard" data-orderitemid="0">0.00</span></strong></div></div>';
    _html += '<div class="form-group refund-total hidden"><label class="col-sm-10 control-label">Net Payment</label><div class="col-sm-2 controls text-right text-weight-bold"><strong>$<span id="netPaymentTotal">0.00</span></strong></div></div>';
    $('#order_final_total').empty().append(_html);
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Add Fee ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function AddFeeModal(rowid, orderitemid, feetitle, feeamt, feetype) {
    var feeHtml = '<div class="modal-dialog">';
    feeHtml += '<div class="modal-content">';
    feeHtml += '<div class="modal-header">';
    feeHtml += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    feeHtml += '<h4 class="modal-title" id="myModalLabel">Add Fees</h4>';
    feeHtml += '</div>';
    feeHtml += '<div class="modal-body">';

    feeHtml += '<div class="row"><div class="col-md-12">Fee Title (Name)<span class="text-red">*</span><input class="form-control" type="input" id="txt_FeeTitle" placeholder="Fee Title" maxlength="100" autocomplete="true" value="' + feetitle.replace(/^-?\d+\.\d+|^-?\d+\b|^\d+(?=\w)|^\d+(?=\%)/g, '').replace(/^[`~!@#$%^&]/gi, '').trim() + '"></div></div>';
    feeHtml += '<div class="row">';
    feeHtml += '<div class="col-md-6">Fee Type<span class="text-red">*</span><select class="form-control select2" id="ddlFeeType" placeholder="Select Fee Type" style="width: 100%;"><option value="0" selected="selected">Select</option><option value="$">Dollar ($)</option><option value="%">Percent (%)</option></select></div>';
    feeHtml += '<div class="col-md-6">Amount/Percent<span class="text-red">*</span><input class="form-control" type="number" id="txt_FeeAmt" name="txt_FeeAmt" placeholder="Amount" maxlength="15" autocomplete="true" value="' + feeamt + '"></div>';
    feeHtml += '</div>';

    feeHtml += '</div>';
    feeHtml += '<div class="modal-footer">';
    feeHtml += '<button type="button" class="btn btn-danger pull-right" id="btnApplyFee" data-rowid="' + rowid + '" data-orderitemid="' + orderitemid + '">Add</button>';
    feeHtml += '</div>';
    feeHtml += '</div>';
    feeHtml += '</div>';
    $("#myModal").empty().html(feeHtml);
    $("#myModal").modal({ backdrop: 'static', keyboard: false }); $("#ddlFeeType").val(feetype); $("#txt_FeeTitle").focus();
}
function ApplyFee(rowid, orderitemid, feetitle, feetype, feeamt) {
    //let feetype = feetitle.match(/%/g) != null ? '%' : '';
    //let startingNumber = parseFloat(feetitle.match(/^-?\d+\.\d+|^-?\d+\b|^\d+(?=\w)/g)) || 0.00;
    //let product_name = feetype == '%' ? feetitle.replace(/fee$/, "fee") : startingNumber + ' fee';
    let startingNumber = feeamt, product_name = feeamt + feetype + ' ' + feetitle;
    let line_total = 0, zGAmt = (parseFloat($("#SubTotal").text()) || 0.00) - (parseFloat($("#discountTotal").text()) || 0.00);
    line_total = (feetype == '%' && startingNumber != 0) ? (zGAmt * startingNumber / 100) : startingNumber;

    let feeHtml = '';
    if ($('#trfeeid_' + rowid).length <= 0) {
        feeHtml += '<tr id="trfeeid_' + rowid + '" data-orderitemid="' + orderitemid + '" data-pname="' + product_name + '" data-feeamt="' + startingNumber + '" data-feetype="' + feetype + '">';
        feeHtml += '<td class="text-center item-action"><button class="btn menu-icon-gr text-success  billinfo" onclick="AddFeeModal(\'' + rowid + '\',' + orderitemid + ',\'' + product_name + '\',' + startingNumber + ',\'' + feetype + '\');" data-toggle="tooltip" title="Edit fee"> <i class="glyphicon glyphicon-edit"></i></button>';
        feeHtml += '<button class="btn menu-icon-gr text-red billinfo" onclick="RemoveFee(\'' + rowid + '\');" data-toggle="tooltip" title="Delete fee"> <i class="glyphicon glyphicon-trash"></i></button></td>';
        feeHtml += '<td>' + product_name + '</td><td></td><td></td><td></td><td></td><td class="TotalAmount text-right">' + line_total.toFixed(2) + '</td><td></td>';
        feeHtml += '</tr>';
        $('#order_fee_line_items').append(feeHtml);
    }
    else {
        $('#trfeeid_' + rowid).data('pname', product_name); $('#trfeeid_' + rowid).data('feeamt', startingNumber); $('#trfeeid_' + rowid).data('feetype', feetype);
        feeHtml += '<td class="text-center item-action"><button class="btn menu-icon-gr text-success  billinfo" onclick="AddFeeModal(\'' + rowid + '\',' + orderitemid + ',\'' + product_name + '\',' + startingNumber + ',\'' + feetype + '\');" data-toggle="tooltip" title="Edit fee"> <i class="glyphicon glyphicon-edit"></i></button>';
        feeHtml += '<button class="btn menu-icon-gr text-red billinfo" onclick="RemoveFee(\'' + rowid + '\');" data-toggle="tooltip" title="Delete fee"> <i class="glyphicon glyphicon-trash"></i></button></td>';
        feeHtml += '<td>' + product_name + '</td><td></td><td></td><td></td><td></td><td class="TotalAmount text-right">' + line_total.toFixed(2) + '</td><td></td>';
        $('#trfeeid_' + rowid).empty().append(feeHtml);
    }
    $("#myModal").modal('hide'); calcFinalTotals();
}
function RemoveFee(rowid) {
    swal({ title: '', text: 'Would you like to Remove this fee?', type: "question", showCancelButton: true }).then((result) => { if (result.value) { $('#trfeeid_' + rowid).remove(); calcFinalTotals(); } });
    return false;
}
function CalculateFee() {
    let zFeeAmt = 0.00, zGmtAmt = (parseFloat($("#SubTotal").text()) || 0.00) - (parseFloat($("#discountTotal").text()) || 0.00);
    $("#order_fee_line_items > tr").each(function (index, tr) {
        zFeeAmt += ($(tr).data('feetype') == '%') ? (zGmtAmt * (parseFloat($(tr).data('feeamt')) / 100)) : parseFloat($(tr).data('feeamt'));
    });
    $("#feeTotal").text(zFeeAmt.toFixed(2));
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Gift Card Modal ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function GiftCardModal() {
    let myHtml = '<div class="modal-dialog">';
    myHtml += '<div class="modal-content">';
    myHtml += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    myHtml += '<h4 class="modal-title" id="myModalLabel">Apply Gift Card</h4>';
    myHtml += '</div>';
    myHtml += '<div class="modal-body">Enter a Gift Card code to apply.';
    myHtml += '<input class="form-control" type="text" id="txt_GiftCard" name="txt_GiftCard" placeholder="Gift Card Code" maxlength="25">';
    myHtml += '<div class="font-weight-bold text-danger alert-coupon"></div>';
    myHtml += '</div>';
    myHtml += '<div class="modal-footer"><button type="button" class="btn btn-danger" id="btnGiftCardAdd">Add</button></div>';
    myHtml += '</div>';
    myHtml += '</div>';
    $("#myModal").empty().html(myHtml);
    $("#myModal").modal({ backdrop: 'static', keyboard: false }); $("#txt_GiftCard").focus();
}
function ApplyGiftCard() {
    let giftcard_code = $("#txt_GiftCard").val().toLowerCase().trim();
    if ($('#li_' + giftcard_code).length > 0) { swal('Alert!', 'Gift Card Code already applied!', "error").then((result) => { $('#txt_GiftCard').focus(); return false; }); return false; };
    if (giftcard_code == '') { swal('Alert!', 'Please Enter a Gift Card Code.', "error").then((result) => { $('#txt_GiftCard').focus(); return false; }); return false; }
    let _total = parseFloat($("#orderTotal").text()) || 0.00;
    $.post('/Orders/GetGiftCardAmount', { strValue1: giftcard_code }).then(response => {
        let data = JSON.parse(response);
        if (data.length == 0) { swal('Alert!', 'Invalid code entered. Please try again.', "error").then((result) => { $('#txt_GiftCard').focus(); return false; }); return false; }
        if (data[0].giftcard_amount > 0) {
            if (_total <= 0) { swal('Error!', 'Please add product in your cart', "error").then((result) => { $('#txt_GiftCard').focus(); return false; }); return false; }
            else if (_total > 0 && _total >= data[0].giftcard_amount) {
                let _Html = '<li id="li_' + data[0].code.toString().toLowerCase().replaceAll(' ', '_') + '" data-pn="' + data[0].code.toString().toUpperCase() + '" data-id="' + data[0].id + '" data-orderitemid="0" data-amount="' + data[0].giftcard_amount.toFixed(2) + '">';
                _Html += '<a href="javascript:void(0);">';
                _Html += '<i class="glyphicon glyphicon-gift"></i><span>' + data[0].code + '</span>';
                _Html += '<div class="pull-right">$<span id="gift_amt">' + data[0].giftcard_amount.toFixed(2) + '</span><button type="button" class="btn btn-box-tool pull-right billinfo" onclick="deleteAllGiftCard(\'' + data[0].code.toString().toLowerCase() + '\');"><i class="fa fa-times"></i></button></div>';
                _Html += '</a>';
                _Html += '</li>';
                $('#billGiftCard').append(_Html);
            }
            else if (_total > 0 && data[0].giftcard_amount >= _total) {
                data[0].giftcard_amount = _total;
                let _Html = '<li id="li_' + data[0].code.toString().toLowerCase().replaceAll(' ', '_') + '" data-pn="' + data[0].code.toString().toUpperCase() + '" data-id="' + data[0].id + '" data-orderitemid="0" data-amount="' + data[0].giftcard_amount.toFixed(2) + '">';
                _Html += '<a href="javascript:void(0);">';
                _Html += '<i class="glyphicon glyphicon-gift"></i><span>' + data[0].code + '</span>';
                _Html += '<div class="pull-right">$<span id="gift_amt">' + _total.toFixed(2) + '</span><button type="button" class="btn btn-box-tool pull-right billinfo" onclick="deleteAllGiftCard(\'' + data[0].code.toString().toLowerCase() + '\');"><i class="fa fa-times"></i></button></div>';
                _Html += '</a>';
                _Html += '</li>';
                $('#billGiftCard').append(_Html);
            }
            $("#myModal").modal('hide');
        }
        else { swal('Invalid!', 'This gift card code is not valid.', "error").then((result) => { $('#txt_GiftCard').focus(); return false; }); return false; }
    }).catch(err => { swal('Error!', err, 'error'); }).always(function () { calcFinalTotals(); });
}
function deleteAllGiftCard(GiftCode) {
    swal({ title: '', text: 'Would you like to remove this Gift Card?', type: "question", showCancelButton: true }).then((result) => { if (result.value) { $('#li_' + GiftCode.replaceAll(' ', '_')).remove(); calcFinalTotals(); } });
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Save Details ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function ValidateData() {
    if ($('#txtbillfirstname').val() == '') { swal('Error!', 'Please Enter Billing First Name.', "error").then((result) => { $('#txtbillfirstname').focus(); return false; }); return false; }
    else if ($('#txtbilllastname').val() == '') { swal('Error!', 'Please Enter Billing Last Name.', "error").then((result) => { $('#txtbilllastname').focus(); return false; }); return false; }
    else if ($('#txtbilladdress1').val() == '') { swal('Error!', 'Please Enter Billing Address.', "error").then((result) => { $('#txtbilladdress1').focus(); return false; }); return false; }
    else if ($('#txtbillzipcode').val() == '') { swal('Error!', 'Please Enter Billing Post Code.', "error").then((result) => { $('#txtbillzipcode').focus(); return false; }); return false; }
    else if ($('#txtbillcity').val() == '') { swal('Error!', 'Please Enter Billing City.', "error").then((result) => { $('#txtbillcity').focus(); return false; }); return false; }
    else if ($('#ddlbillcountry').val() == '') { swal('Error!', 'Please Select Billing Country.', "error").then((result) => { $('#ddlbillcountry').select2('open'); return false; }); return false; }
    else if ($('#ddlbillstate').val() == '' || $('#ddlbillstate').val() == '0') { swal('Error!', 'Please Select Billing State.', "error").then((result) => { $('#ddlbillstate').select2('open'); return false; }); return false; }
    else if ($('#txtbillemail').val() == '') { swal('Error!', 'Please Select Billing EMail Address.', "error").then((result) => { $('#txtbillemail').focus(); return false; }); return false; }
    else if ($('#txtshipfirstname').val() == '') { swal('Error!', 'Please Enter Shipping First Name.', "error").then((result) => { $('#txtshipfirstname').focus(); return false; }); return false; }
    else if ($('#txtshiplastname').val() == '') { swal('Error!', 'Please Enter Shipping Last Name.', "error").then((result) => { $('#txtshiplastname').focus(); return false; }); return false; }
    else if ($('#txtshipaddress1').val() == '') { swal('Error!', 'Please Enter Shipping Address.', "error").then((result) => { $('#txtshipaddress1').focus(); return false; }); return false; }
    else if ($('#txtshipzipcode').val() == '') { swal('Error!', 'Please Enter Shipping Post Code.', "error").then((result) => { $('#txtshipzipcode').focus(); return false; }); return false; }
    else if ($('#txtshipcity').val() == '') { swal('Error!', 'Please Enter Shipping City.', "error").then((result) => { $('#txtshipcity').focus(); return false; }); return false; }
    else if ($('#ddlshipcountry').val() == '') { swal('Error!', 'Please Select Shipping Country.', "error").then((result) => { $('#ddlshipcountry').select2('open'); return false; }); return false; }
    else if ($('#ddlshipstate').val() == '' || $('#ddlshipstate').val() == '0') { swal('Error!', 'Please Select Shipping State.', "error").then((result) => { $('#ddlshipstate').select2('open'); return false; }); return false; }
    return true;
}
function QuoteHeader(id) {
    let obj = {
        quote_no: id, customer_id: parseInt($('#ddlUser').val()) || 0, billing_email: $('#txtbillemail').val(), billing_phone: $('#txtbillphone').val().replace(/[^\d]/g, ''),
        billing_first_name: $('#txtbillfirstname').val(), billing_last_name: $('#txtbilllastname').val(), billing_company: $('#txtbillcompany').val(), billing_address_1: $('#txtbilladdress1').val(),
        billing_address_2: $('#txtbilladdress2').val(), billing_city: $('#txtbillcity').val(), billing_state: $('#ddlbillstate').val(), billing_country: $('#ddlbillcountry').val(), billing_postcode: $('#txtbillzipcode').val(),
        shipping_first_name: $('#txtshipfirstname').val(), shipping_last_name: $('#txtshiplastname').val(), shipping_company: $('#txtshipcompany').val(), shipping_address_1: $('#txtshipaddress1').val(),
        shipping_address_2: $('#txtshipaddress2').val(), shipping_city: $('#txtshipcity').val(), shipping_state: $('#ddlshipstate').val(), shipping_country: $('#ddlshipcountry').val(), shipping_postcode: $('#txtshipzipcode').val(),
        remark: $('#txtCustomerNotes').val(), gross_total: parseFloat($('#SubTotal').text()) || 0.00, discount: parseFloat($('#discountTotal').text()) || 0.00, shipping_total: parseFloat($('#shippingTotal').text()) || 0.00,
        fee_total: (parseFloat($('#stateRecyclingFeeTotal').text()) || 0.00) + (parseFloat($('#feeTotal').text()) || 0.00), tax_total: parseFloat($('#salesTaxTotal').text()) || 0.00,
        giftcard_total: parseFloat($('#giftCardTotal').text()) || 0.00, net_total: parseFloat($('#orderTotal').text()) || 0.00, payment_method: '', tax_api: 'avatax'
    };
    return obj;
}
function QuoteProducts(id) {
    let _list = [], _itemmeta = [];
    //Add Product /Gift Card Product
    $('#order_line_items > tr').each(function (index, tr) {
        let qty = parseFloat($(tr).find("[name=txt_ItemQty]").val()) || 0.00, rate = parseFloat($(tr).find(".TotalAmount").data('regprice')) || 0.00;
        //let grossAmount = parseFloat($(tr).find(".TotalAmount").data('amount')) || 0.00;
        let grossAmount = (qty * rate), discountAmount = parseFloat($(tr).find(".RowDiscount").text()) || 0.00;
        let taxAmount = parseFloat($(tr).find(".TotalAmount").data('taxamount')) || 0.00, shippinAmount = parseFloat($(tr).find(".TotalAmount").data('shippingamt')) || 0.00;
        let rNetAmt = grossAmount - discountAmount + taxAmount;
        //_itemmeta = [];
        //if ($(tr).hasClass("gift_item")) { $.each($(tr).data('meta_data'), function (name, value) { _itemmeta.push({ key: name, value: value }); }); }
        _list.push({
            quote_no: id, item_sequence: index, item_type: 'line_item', product_id: $(tr).data('pid'), variation_id: $(tr).data('vid'), item_name: $(tr).data('pname'), product_qty: qty, product_rate: rate, gross_total: grossAmount, discount: discountAmount, shipping_total: shippinAmount * qty, fee_total: 0, tax_total: taxAmount, net_total: rNetAmt, item_meta: JSON.stringify($(tr).data('meta_data'))
        });
    });
    //Add State Recycling Fee
    _list.push({
        quote_no: id, item_sequence: _list.length + 1, item_type: 'fee', product_id: 0, variation_id: 0, item_name: 'State Recycling Fee', product_qty: 0, product_rate: 0, gross_total: 0, discount: 0, shipping_total: 0, fee_total: 0, tax_total: 0, net_total: (parseFloat($('#stateRecyclingFeeTotal').text()) || 0), item_meta: ''
    });
    //Add Fee
    $('#order_fee_line_items > tr').each(function (index, tr) {
        _list.push({
            quote_no: id, item_sequence: _list.length + 1, item_type: 'fee', product_id: 0, variation_id: 0, item_name: $(tr).data('pname'), product_qty: 0, product_rate: 0, gross_total: 0, discount: 0, shipping_total: 0, fee_total: 0, tax_total: 0, net_total: (parseFloat($(tr).find(".TotalAmount").text()) || 0), item_meta: ''
        });
    });
    //Add Shipping
    _list.push({
        quote_no: id, item_sequence: _list.length + 1, item_type: 'shipping', product_id: 0, variation_id: 0, item_name: '', product_qty: 0, product_rate: 0, gross_total: 0, discount: 0, shipping_total: 0, fee_total: 0, tax_total: 0, net_total: (parseFloat($('#shippingTotal').text()) || 0), item_meta: ''
    });
    //Add Tax
    let is_freighttax = $('#hfFreighttaxable').val(); 
    $('#order_final_total .tax-total').each(function (index, li) {
        let shipping_tax_amount = (is_freighttax === 'true') ? parseFloat($(li).data('percent')) || 0 : 0.0;
        _list.push({
            quote_no: id, item_sequence: _list.length + 1, item_type: 'tax', product_id: 0, variation_id: 0, item_name: $(li).data('name'), product_qty: 0, product_rate: 0, gross_total: 0, discount: 0, shipping_total: shipping_tax_amount, fee_total: 0, tax_total: parseFloat($(li).data('percent')) || 0, net_total: parseFloat($(li).data('amount')) || 0, item_meta: $(li).data('label')
        });
    });
    //let _taxRate = parseFloat($('#hfTaxRate').val()) || 0.00, sCountry = $('#ddlshipcountry').val(), sState = $('#ddlshipstate').val();
    //let is_freighttax = $('#hfFreighttaxable').val(); let shipping_tax_amount = (is_freighttax === 'true') ? _taxRate : 0.0;
    //_list.push({
    //    quote_no: id, item_sequence: _list.length + 1, item_type: 'tax', product_id: 0, variation_id: 0, item_name: sCountry + '-' + sState + '-' + sState + ' TAX-1', product_qty: 0, product_rate: 0, gross_total: 0, discount: 0, shipping_total: shipping_tax_amount, fee_total: 0, tax_total: _taxRate, net_total: (parseFloat($('#salesTaxTotal').text()) || 0), item_meta: sState + ' Tax'
    //});
    //Add Coupon
    $('#billCoupon li').each(function (index, li) {
        let cou_amt = parseFloat($(this).find("#cou_discamt").text()) || 0.00;
        if (cou_amt > 0) {
            _list.push({
                quote_no: id, item_sequence: _list.length + 1, item_type: 'coupon', product_id: 0, variation_id: 0, item_name: $(li).data('coupon'), product_qty: 1, product_rate: cou_amt, gross_total: cou_amt, discount: 0, shipping_total: 0, fee_total: 0, tax_total: 0, net_total: cou_amt, item_meta: ''
            });
        }
    });
    //Add Gift Card
    $('#billGiftCard li').each(function (index, li) {
        let gift_amt = parseFloat($(this).find("#gift_amt").text()) || 0.00;
        if (gift_amt > 0) {
            _list.push({
                quote_no: id, item_sequence: _list.length + 1, item_type: 'gift_card', product_id: parseInt($(li).data('id')) || 0, variation_id: 0, item_name: $(li).data('pn'), product_qty: 1, product_rate: gift_amt, gross_total: gift_amt, discount: 0, shipping_total: 0, fee_total: 0, tax_total: 0, net_total: gift_amt, item_meta: ''
            });
        }
    });
    return _list;
}
function SaveData() {
    let oid = parseInt($('#hfOrderNo').val()) || 0;
    if (!ValidateData()) { $("#loader").hide(); return false };
    let quote = QuoteHeader(oid), _list = QuoteProducts(oid);
    if (_list.length <= 0) { swal('Error!', 'Please add product.', "error").then((result) => { $('#ddlProduct').select2('open'); return false; }); return false; }
    let obj = { id: oid, quote_header: JSON.stringify(quote), quote_product: JSON.stringify(_list) };
    //console.log(obj); return false;
    swal.queue([{
        title: '', confirmButtonText: 'Yes, Update it!', text: "Do you want to save your Quote Order?", showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                $.post('/OrderQuote/CreateQuote', obj).done(function (result) {
                    result = JSON.parse(result);
                    if (result[0].response == "Success") {
                        $('#order_line_items,#order_state_recycling_fee_line_items,#order_fee_line_items,#order_shipping_line_items,#order_refunds,#billCoupon,.refund-action').empty();
                        $('#hfOrderNo').val(result[0].id);;
                        $.when(getQuoteInfo()).done(function () {
                            $('[data-toggle="tooltip"]').tooltip();
                            $.post("/OrderQuote/SendApprovalMail", { id: result[0].id, quote_header: $('#txtbillemail').val() }).then(response => { swal('Success', 'Quote Order saved successfully.', "success"); }).catch(err => { swal('Error!', err, "error"); });
                        });
                    }
                    else { swal('Error', result[0].response, "error"); }
                }).catch(err => { swal.hideLoading(); swal('Error!', 'Something went wrong, please try again.', 'error'); });
            });
        }
    }]);
    return false;
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Save Details ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function PrintQuote() {
    let modalHtml = '';
    modalHtml += '<div class="modal-dialog modal-lg">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<div class="modal-body no-padding" ></div>';
    modalHtml += '<div class="modal-footer">';
    modalHtml += '<button type="button" class="btn btn-primary" data-dismiss="modal" aria-label="Close">OK</button>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#myModal").empty().html(modalHtml);

    let myHtml = '';
    myHtml += '<div style="margin:0;padding:0;color: #4f4f4f;font-family: Arial, sans-serif;">';
    myHtml += '<table id="tbprint" role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">';
    myHtml += '<tr>';
    myHtml += '<td align="center" style="padding:0;">';
    myHtml += '<table role="presentation" style="width:602px;border-collapse:collapse;border-spacing:0;text-align:left;">';
    myHtml += '<tr>';
    myHtml += '<td align="center" style="padding: 10px 15px; background-color: #f8f8f8;">';
    myHtml += '<table role="presentation" style="width:100%;">';
    myHtml += '<tr>';
    myHtml += '<td><img alt="Layla Logo" src="#" id="imgLogoprint"></td>';
    myHtml += '<td align="right">';
    myHtml += '<h1 style="font-size: 42px; margin:0px; font-style: italic; color: #4f4f4f">Thank you.</h1>';
    myHtml += '<h2 style="font-size: 20px; margin:0px; color: #4f4f4f">Your quote has been received</h2>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '</table>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '<tr class="thankyou-for-your-order">';
    myHtml += '<td class="order-detail-box" style="padding: 15px 10px 10px; border-bottom: 1px solid #c8c8c8;">';
    myHtml += '<table class="order_details order-detail-ul" role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">';
    myHtml += '<tr>';
    myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top; border-right: 1px solid #c8c8c8; padding-right:30px;"> quote code:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">' + $('#hfOrderNo').val() + '</strong></td>';
    myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top; border-right: 1px solid #c8c8c8; padding-right:30px; padding-left:30px;"> Date:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">' + $('#txtDate').val() + '</strong></td>';
    myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top; border-right: 1px solid #c8c8c8; padding-right:30px; padding-left:30px;"> Total:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">$' + $('#orderTotal').text() + '</strong></td>';
    myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top;  padding-left:30px;"> Status:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">' + $("#ddlStatus option:selected").text() + '</strong></td>';
    myHtml += '</tr>';
    myHtml += '</table>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '<tr><td ><h2 style="font-size:20px; margin:25px 0px 10px 0px;">Quote details</h2></td></tr>';
    myHtml += '<tr>';
    myHtml += '<td >';

    myHtml += '<table id="tblorder_details" class="shop_table order_details" style="border: 1px solid rgba(0, 0, 0, 0.1);margin: 0 -1px 24px 0;text-align: left;width: 100%; border-collapse: separate; border-radius: 5px;">';
    myHtml += '<thead><tr><th class=" product-name" style="font-weight: 700;padding: 9px 12px;">Product</th><th class="product-total" style="font-weight: 700;padding: 9px 12px;">Total</th></tr></thead>';
    myHtml += '<tbody></tbody>';
    myHtml += '<tfoot>';
    myHtml += '<tr><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Subtotal:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;"><span>$' + $('#SubTotal').text() + '</span></td></tr>';
    myHtml += '<tr><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Discount:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">-<span>$' + $('#discountTotal').text() + '</span></td></tr>';
    myHtml += '<tr><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Shipping:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">$' + $('#shippingTotal').text() + '</td></tr>';
    myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Tax:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">$' + $('#salesTaxTotal').text() + '</td></tr>';
    myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">State Recycling Fee:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">$' + $('#stateRecyclingFeeTotal').text() + '</td></tr>';
    myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Fee:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">$' + $('#feeTotal').text() + '</td></tr>';
    if (parseFloat($('#giftCardTotal').text()) > 0)
        myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Gift Card:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">$' + $('#giftCardTotal').text() + '</td></tr>';
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

    $('#myModal .modal-body').append(myHtml);

    myHtml = '';
    $('#order_line_items > tr').each(function (index, tr) {
        var qty = parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00;
        var grossAmount = parseFloat($(this).find(".TotalAmount").data('amount')) || 0.00;
        myHtml += '<tr><td style="border-top: 1px solid rgba(0, 0, 0, 0.1);  padding: 9px 12px; vertical-align: middle;"><span>' + $(this).data('pname') + '</span><strong class="product-quantity">× ' + qty + '</strong></td><td style="border-top: 1px solid rgba(0, 0, 0, 0.1);  padding: 9px 12px; vertical-align: middle;"><span>$' + grossAmount.toFixed(2) + '</span></td></tr>';
    });
    $('#tblorder_details tbody').append(myHtml);

    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    toDataURL('https://quickfix16.com/wp-content/themes/layla-white/images/logo.png', function (dataUrl) { $('#imgLogoprint').attr("src", dataUrl); });
}