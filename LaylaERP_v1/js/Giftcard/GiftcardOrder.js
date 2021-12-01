$(document).ready(function () {
    $("#loader").hide();
    $("#btnResendEmail").hide();
    $(".select2").select2();
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    if (id != "Giftcard") { disableall(); }
    else { $("#btnResendEmail").hide(); $("#btnResendEmail").prop("disabled", true); }
    $('#txtPostCode').change(function () {
        City = $("#ddlCity").val();
        State = $("#ddlState").val();
        PostalCode = $("#txtPostCode").val();
        var obj = {
            billing_state: State, billing_city: City, billing_postcode: PostalCode
        }
        $.ajax({
            url: '/Users/CityStateZip/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            success: function (data) {
                if (data.status == true) {
                    $('#hfzipstatus').val(data.status);
                } else {
                    if ($('#ddlCountry').val() == "US") {
                        $("#txtPostCode").val("");
                        $('#hfzipstatus').val(data.status);
                        swal('Alert', 'Zip code is not valid for the State', 'error').then(function () {
                            swal.close();
                            $('#txtZipCode').focus();
                        });
                    }
                }
            },

            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
        })
    });
    $("#txtPhone").mask("(999) 999-9999");
    $(document).on("click", "#btnOrderCheckout", function (t) { t.preventDefault(); saveGiftCard(); });
    $(document).on("click", "#btnResendEmail", function (t) { t.preventDefault(); ReSendGiftCard(); });
    $("#GiftModal").on("click", "#btnPlaceOrder", function (t) { t.preventDefault(); AcceptPayment(); });
    $("#GiftModal").on("click", "#btnNewOrder", function (t) { t.preventDefault(); window.location.href = window.location.origin + "/GiftCard/GiftCardList"; });
    $("#GiftModal").on("change", "#ddlPaymentMethod", function (t) {
        t.preventDefault();
        if ($("#ddlPaymentMethod").val() == "podium") { $('.podiumchannel').removeClass('hidden'); }
        else { $('.podiumchannel').addClass('hidden'); }
    });
});
function disableall() {
    $("#btnOrderCheckout").hide();
    $("#btnResendEmail").show();
    $("#btnOrderCheckout").prop("disabled", true);
    $("#txtFirstName").prop("disabled", true); 
    $("#txtLastName").prop("disabled", true);
    $("#txtPhone").prop("disabled", true);
    $("#txtLastName").prop("disabled", true);
    $("#txtPostCode").prop("disabled", true);
    $("#txtSenderEmail").prop("disabled", true);
    $("#txtOrderNotes").prop("disabled", true);
    $("#ddlCountry").prop("disabled", true);
    $("#ddlState").prop("disabled", true);
    $("#txtCity").prop("disabled", true);
    $("#txtAddress1").prop("disabled", true);
    $("#txtAddress2").prop("disabled", true);
    $("#txtCompany").prop("disabled", true);
 
}

$('#ddlCountry').change(function () {
    getState();
})
function getState() {
    var obj = { strValue2: $("#ddlCountry").val() };
    $.ajax({
        url: "/Users/GetCustStateByCountry",
        type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json',
        data: JSON.stringify(obj),
        success: function (data) {
            var data = JSON.parse(data);
            var opt = '<option value="0">Please Select state</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].State + '">' + data[i].StateFullName + '</option>';
            }
            $('#ddlState').html(opt);
        }
    });
}
$("#btnGiftBackOrder").click(function () {
    localStorage.setItem("Orderdeliverydate", $("#EmployeeListdata").data('deliverydate'));
});
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Save Gift Card ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var todaydate = new Date().toLocaleDateString();
function createPostMeta() {
    let oid = $('#hfOrderNo').val(), _total = parseFloat($('#orderTotal').text()) || 0.00;
    let postMetaxml = [];
    postMetaxml.push(
        { post_id: oid, meta_key: '_customer_user', meta_value: 0 },
        { post_id: oid, meta_key: '_billing_company', meta_value: $('#txtCompany').val() }, { post_id: oid, meta_key: '_shipping_company', meta_value: $('#txtCompany').val() },
        { post_id: oid, meta_key: '_billing_first_name', meta_value: $('#txtFirstName').val() }, { post_id: oid, meta_key: '_billing_last_name', meta_value: $('#txtLastName').val() },
        { post_id: oid, meta_key: '_billing_address_1', meta_value: $('#txtAddress1').val() }, { post_id: oid, meta_key: '_billing_address_2', meta_value: $('#txtAddress2').val() },
        { post_id: oid, meta_key: '_billing_city', meta_value: $('#txtCity').val() }, { post_id: oid, meta_key: '_billing_state', meta_value: $('#ddlState').val() },
        { post_id: oid, meta_key: '_billing_postcode', meta_value: $('#txtPostCode').val() }, { post_id: oid, meta_key: '_billing_country', meta_value: $('#ddlCountry').val() },
        { post_id: oid, meta_key: '_billing_email', meta_value: $('#txtSenderEmail').val().trim() }, { post_id: oid, meta_key: '_billing_phone', meta_value: $('#txtPhone').val().replace(/[^\d]/g, '') },
        { post_id: oid, meta_key: '_shipping_first_name', meta_value: $('#txtFirstName').val() }, { post_id: oid, meta_key: '_shipping_last_name', meta_value: $('#txtLastName').val() },
        { post_id: oid, meta_key: '_shipping_address_1', meta_value: $('#txtAddress1').val() }, { post_id: oid, meta_key: '_shipping_address_2', meta_value: $('#txtAddress2').val() },
        { post_id: oid, meta_key: '_shipping_city', meta_value: $('#txtCity').val() }, { post_id: oid, meta_key: '_shipping_state', meta_value: $('#ddlState').val() },
        { post_id: oid, meta_key: '_shipping_postcode', meta_value: $('#txtPostCode').val() }, { post_id: oid, meta_key: '_shipping_country', meta_value: $('#ddlCountry').val() },
        { post_id: oid, meta_key: '_shipping_email', meta_value: $('#txtSenderEmail').val().trim() }, { post_id: oid, meta_key: '_shipping_phone', meta_value: $('#txtPhone').val() },
        { post_id: oid, meta_key: '_order_total', meta_value: _total }, { post_id: oid, meta_key: '_cart_discount', meta_value: 0.00 },
        { post_id: oid, meta_key: '_cart_discount_tax', meta_value: '0' }, { post_id: oid, meta_key: '_order_shipping', meta_value: 0.00 },
        { post_id: oid, meta_key: '_order_shipping_tax', meta_value: '0' }, { post_id: oid, meta_key: '_order_tax', meta_value: 0.00 },
        { post_id: oid, meta_key: '_release_date', meta_value: todaydate }
    );
    return postMetaxml;
}
function createPostStatus() {
    let postStatus = {
        parent_id: 0, returning_customer: 0,
        customer_id: 0,
        num_items_sold: parseInt($('#totalQty').text()) || 0,
        total_sales: parseFloat($('#orderTotal').text()) || 0.00,
        tax_total: parseFloat($('#salesTaxTotal').text()) || 0.00,
        shipping_total: parseFloat($('#shippingTotal').text()) || 0.00,
        net_total: (parseFloat($('#orderTotal').text()) || 0.00),
        status: 'wc-pending', Search: $('#txtOrderNotes').val()
    };
    return postStatus;
}
function createItemsList() {
    let cid = 0;
    let itemsDetails = [];
    //Add Item Details
    let qty = parseInt($('#totalQty').text()) || 0;
    let product_id = parseInt($("#EmployeeListdata").data('productid')) || 853309;
    let recipientlist = $("#EmployeeListdata").data('recipientlist');
    let productName = $("#lblOrderNo").data("pname");
    let rate = parseFloat($("#SubTotal").data('amount')) || 0.00;
    let grossAmount = parseFloat($('#orderTotal').text()) || 0.00;
    let discountAmount = 0.00;
    let taxAmount = 0.00;
    let shippinAmount = 0.00;
    let customerNotes = $("#txtOrderNotes").text();
    let sender_email = $("#txtSenderEmail").val();
    let sender = $("#txtFirstName").val() + ' ' + $("#txtLastName").val();
    let deliver_date = $("#EmployeeListdata").data('deliverydate') || 0;

    itemsDetails.push({
        order_item_id: $("#EmployeeListdata").data('orderitemid'), PKey: 0, order_id: 0, customer_id: cid, product_type: 'line_item',
        product_id: product_id, variation_id: 0, product_name: productName,
        quantity: qty, sale_rate: rate, total: grossAmount, discount: discountAmount, tax_amount: taxAmount,
        shipping_amount: shippinAmount, shipping_tax_amount: 0, customerNotes: customerNotes, sender: sender, sender_email: sender_email,
        recipientlist: recipientlist
    });
    $('#GiftCard_List > tr').each(function (index, tr) {
        let gift_amt = parseFloat($(tr).find("#lst_amount").text().replace('$', '')) || 0.00;
        let gift_productName = parseFloat($(tr).find("#lst_productName").text()) || 0.00;
        let gift_recipient = $(tr).find("#lst_recipient").text() || '';
        let order_item_id = parseInt($(tr).data('orderitemid')) || 0;
        if (gift_amt > 0)
            itemsDetails.push({
                order_item_id: order_item_id, order_id: 0, product_name: gift_productName,
                product_type: 'gift_card', total: gift_amt, recipient: gift_recipient, sender: sender, sender_email: sender_email,
                customerNotes: customerNotes, delivery_date: deliver_date,
            });
    });
    return itemsDetails;
}

function saveGiftCard() {
    let oid = parseInt($('#hfOrderNo').val()), cid = 0;
    if (!ValidateData()) { $("#loader").hide(); return false };

    let postMeta = createPostMeta(), postStatus = createPostStatus(), itemsDetails = createItemsList();

    if (postStatus.num_items_sold <= 0) { swal('Error!', 'Please add recipient.', "error").then((result) => { return false; }); return false; }
    let obj = { order_id: oid, order_statsXML: JSON.stringify(postStatus), postmetaXML: JSON.stringify(postMeta), order_itemsXML: JSON.stringify(itemsDetails) };
   /* $('#btnOrderCheckout').prop("disabled", true);*/
    $('#btnOrderCheckout').text("Waiting...");
    $.ajax({
        type: "POST", contentType: "application/json; charset=utf-8",
        url: "/Giftcard/SaveGiftCardOrder",
        data: JSON.stringify(obj), dataType: "json", beforeSend: function () { $("#loader").show(); },
        success: function (result) {
            result = JSON.parse(result);
            if (result[0].Response == "Success") {
                if (postStatus.net_total > 0) {
                    $('#hfOrderNo').val(result[0].id);
                    GiftCardPaymentModal();
                }
            }
            else { swal('Error', 'Something went wrong, please try again.', "error").then((result) => { return false; }); }
        },
        error: function (xhr, status, err) { $("#loader").hide(); alert(err); },
        complete: function () { $("#loader").hide();  $('.billinfo').prop("disabled", false); $('#btnOrderCheckout').text("Place Order"); isEdit(false); },
    });
    $('#btnOrderCheckout').text("Checkout");
    return false;
}

function ValidateData() {
    if ($('#txtSenderEmail').val().trim() == "") { swal('Alert', 'Please enter e-mail', 'error'); }
    else if ($('#txtFirstName').val() == "") { swal('Alert', 'Please Enter First Name', 'error').then((result) => { $('#txtFirstName').focus(); return false; }); return false; }
    else if ($('#txtLastName').val() == "") { swal('Alert', 'Please enter Last Name', 'error').then((result) => { $('#txtLastName').focus(); return false; }); }
    else if ($('#txtPhone').val() == "" || $('#txtPhone').val() == "() -") { swal('Alert', 'Please enter phone Number', 'error').then((result) => { $('#txtPhone').focus(); return false; }); return false; }
    else if ($('#txtPhone').val().length != "14" || $('#txtPhone').val() == "() -") { swal('Alert', 'Please enter 10 digit phone Number', 'error').then((result) => { $('#txtPhone').focus(); return false; }); return false; }
    else if ($('#txtAddress1').val() == "") { swal('Alert', 'Please enter Address1', 'error').then((result) => { $('#txtAddress1').focus(); return false; }); return false; }
    else if ($('#txtCity').val() == "") { swal('Alert', 'Please enter City', 'error').then((result) => { $('#txtCity').focus(); return false; }); return false; }
    else if ($('#ddlState').val() == "") { swal('Alert', 'Please enter State', 'error').then((result) => { $('#txtState').focus(); return false; }); return false; }
    else if ($('#txtPostCode').val() == "") { swal('Alert', 'Please enter Zip Code', 'error').then((result) => { $('#txtPostCode').focus(); return false; }); return false; }
    else if ($('#ddlCountry').val() == "") { swal('Alert', 'Please select Country', 'error').then((result) => { $('#ddlCountry').focus(); return false; }); return false; }
    return true;
}
function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Payment Modal ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function GiftCardPaymentModal() {
    //let pay_by = $('#lblOrderNo').data('pay_by').trim();
    let billing_first_name = $('#txtFirstName').val(), billing_last_name = $('#txtLastName').val();
    let billing_company = $('#txtCompany').val();
    let billing_address_1 = $('#txtAddress1').val(), billing_address_2 = $('#txtAddress2').val();
    let billing_city = $('#txtCity').val(), billing_state = $('#ddlState').val(), billing_postcode = $('#txtPostCode').val();
    let billing_country = $('#ddlCountry').val();
    let billing_phone = $('#txtPhone').val(), billing_email = $('#txtSenderEmail').val();

    let shipping_first_name = $('#txtFirstName').val(), shipping_last_name = $('#txtLastName').val();
    
    let shipping_address_1 = $('#txtAddress1').val(), shipping_address_2 = $('#txtAddress2').val();
    let shipping_city = $('#txtCity').val(), shipping_state = $('#ddlState').val(), shipping_postcode = $('#txtPostCode').val();
    let shipping_country = $('#ddlCountry').val();
   // let pay_mathod = $('#lblOrderNo').data('pay_option');
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
    myHtml += 'Billing Address: <address class="no-margin"><strong>' + billing_first_name + ' ' + billing_last_name + '</strong ><br>';
    if (billing_company != '') {
        myHtml += '' + billing_company + '<br>';
    }
    myHtml += '' + billing_address_1 + (billing_address_2 > 0 ? ' <br> ' : '') + billing_address_2 + ' <br> ' + billing_city + ', ' + billing_state + ' ' + billing_postcode + ' ' + billing_country + ' <br> Phone: ' + billing_phone + ' <br> Email: ' + billing_email + '</address >';
    myHtml += '</div>';
    myHtml += '<div class="col-sm-6 invoice-col">';
    myHtml += 'Shipping Address: <address class="no-margin"><strong>' + shipping_first_name + ' ' + shipping_last_name + '</strong > <br>' + shipping_address_1 + (shipping_address_2 > 0 ? '<br>' : '') + shipping_address_2 + '<br>' + shipping_city + ', ' + shipping_state + ' ' + shipping_postcode + ' ' + shipping_country + '</address>';
    myHtml += '</div>';
    myHtml += '</div>';
    /// row invoice-items
    myHtml += '<div class="row">';
    myHtml += '<div class="col-xs-12 table-responsive">';
    myHtml += '<table class="table table-striped" id="tblmodalitems">';
    myHtml += '<thead>';
    myHtml += '<tr>';
    myHtml += '<th style="width: 40%">Product</th>';
    myHtml += '<th style="width: 30%" class="text-right">Qty.</th>';
    myHtml += '<th style="width: 30%" class="text-right">Sub-Total</th>';
    //myHtml += '<th style="width: 15%" class="text-right">Discount</th>';
    //myHtml += '<th style="width: 15%" class="text-right">Tax</th>';
    myHtml += '</tr>';
    myHtml += '</thead>';
    myHtml += '<tbody>';
    myHtml += '<tr>';
    myHtml += '<td>' + $("#lblOrderNo").data("pname") + '</td>';
    myHtml += '<td class="text-right">' + $('#totalQty').text() + '</td>';
    myHtml += '<td class="text-right">' + $('#orderTotal').text() + '</td>';
    //myHtml += '<td class="text-right">' + discountAmount.toFixed(2) + '</td>';
    //myHtml += '<td class="text-right">' + taxAmount.toFixed(2) + '</td>';
    myHtml += '</tr>';
    myHtml += '</tbody>';
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
    myHtml += '<option value="podium">Podium</opion><option value="ppec_paypal">Paypal</opion>';
    //for (let i = 0; i < pay_mathod.length; i++) {
    //    myHtml += '<option value="' + pay_mathod[i].id + '">' + pay_mathod[i].text + '</option>';
    //}
    myHtml += '</select>';
    myHtml += '</span>';
    myHtml += '</div>';
    myHtml += '</div>';
    
    myHtml += '<div class="col-md-6 podiumchannel">';
    myHtml += '<div class="form-check-inline"><input type="radio" name="podiumchannel" checked="" value="' + billing_email + '"><label class="form-check-label">Email Channel</label></div>';
    myHtml += '<div class="form-check-inline"><input type="radio" name="podiumchannel" value="' + billing_phone.replace(/[^0-9]/g, "") + '"><label class="form-check-label">SMS Channel</label></div>';
    myHtml += '</div>';

    myHtml += '<button type="button" class="btn btn-primary" id="btnPlaceOrder">Place Order $' + $('#orderTotal').text() + '</button>';
    myHtml += '<button type="button" class="btn btn-primary hidden" id="btnResendInv">Resend Invoice $' + $('#orderTotal').text() + '</button>';
    myHtml += '</div>';

    myHtml += '</div>';
    myHtml += '</div>';
    $("#GiftModal").empty().html(myHtml);
    myHtml = '';

    $('#tblmodalitems tbody').append(myHtml);
    $('#tblmodalTotal').append($('#order_final_total').html());
    $("#GiftModal").modal({ backdrop: 'static', keyboard: false });
}
function AcceptPayment() {
    if ($("#ddlPaymentMethod").val() == "ppec_paypal") { PaypalPayment($("#txtSenderEmail").val()); }
    else if ($("#ddlPaymentMethod").val() == "podium") { PodiumPayment() }
    else { swal('Alert!', 'Please Select Payment Method.', "error"); }
}

///Accept Podium Payment
function PodiumPayment() {
    var podium_baseurl = 'https://api.podium.com';
    let oid = parseInt($('#hfOrderNo').val()) || 0;
    let bill_email = $("#txtSenderEmail").val();
    let bill_to = $('input[name="podiumchannel"]:checked').val();
    let bill_name = $('#txtFirstName').val() + ' ' + $('#txtLastName').val();
    let _lineItems = [];
    let qty = parseFloat($('#totalQty').text()) || 0.00;
    let grossAmount = parseFloat($('#orderTotal').text().replace('$', '')) || 0.00;
    if (grossAmount > 0)
        _lineItems.push({ description: $("#lblOrderNo").data("pname"), amount: grossAmount * 100 });
    let opt_inv = { lineItems: _lineItems, channelIdentifier: bill_to, customerName: bill_name, invoiceNumber: 'INV-' + oid, locationUid: "6c2ee0d4-0429-5eac-b27c-c3ef0c8f0bc7" };
    let option = { strValue1: 'getToken' };
    swal.queue([{
        title: 'Podium Payment Processing.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
        onOpen: () => {
            swal.showLoading();
            $.get('/Setting/GetPodiumToken', option).then(response => {
                let access_token = response.message;
                //let pay_by = $('#lblOrderNo').data('pay_by').trim(), inv_id = $('#lblOrderNo').data('pay_id').trim();
                //if (inv_id.length > 0 && pay_by.includes('podium')) {
                //    let create_url = podium_baseurl + '/v4/invoices/' + inv_id + '/cancel';
                //    let opt_cnl = { locationUid: "6c2ee0d4-0429-5eac-b27c-c3ef0c8f0bc7", note: 'Invoice has been canceled.' };
                //    $.ajax({
                //        type: 'post', url: create_url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt_cnl),
                //        beforeSend: function (xhr) { xhr.setRequestHeader("Accept", "application/json"); xhr.setRequestHeader("Authorization", "Bearer " + access_token); }
                //    }).then(response => { console.log('Invoice has been canceled.'); }).catch(err => { console.log(err); });
                //}
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
    debugger
    let _postMeta = [
        { post_id: oid, meta_key: '_payment_method', meta_value: 'podium' }, { post_id: oid, meta_key: '_payment_method_title', meta_value: 'Podium Order' },
        { post_id: oid, meta_key: '_podium_uid', meta_value: taskUid }, { post_id: oid, meta_key: 'taskuidforsms', meta_value: taskUid }, { post_id: oid, meta_key: '_podium_status', meta_value: 'SENT' }
    ];
    let opt = { OrderPostMeta: _postMeta };
    $.post('/GiftCard/UpdatePaymentInvoiceID', opt).then(response => {
        swal('Success!', response.message, 'success');
        if (response.status == true) { $("#GiftModal").modal('hide'); $('.billinfo').prop("disabled", true); successModal('podium', taskUid, true); }
    }).catch(err => { console.log(err); swal.hideLoading(); swal('Error!', err, 'error'); });
}

///Accept paypal Payment
function createPaypalXML(oid, pp_no, pp_email) {
    let taxPer = 0.00; dfa = todaydate.split(/\//); df = [dfa[2], dfa[0], dfa[1]].join('-');
    let shipping_total = parseFloat($('#shippingTotal').text()) || 0.00;
    var qty = parseFloat($('#totalQty').text()) || 0.00;
    let _items = [];
    let rate = parseFloat($("#SubTotal").data('amount')) || 0.00;
    let discountAmount = 0.00;
    let taxAmount = 0.00;
    _items.push({
        name: $("#lblOrderNo").data("pname"), quantity: qty,unit_amount: { currency_code: "USD", value: rate },tax: { name: "Sales Tax", value: taxAmount, percent: taxPer * 100 },
        discount: { amount: { currency_code: "USD", value: discountAmount } }, unit_of_measure: "QUANTITY"
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
                    name: { given_name: $('#txtFirstName').val(), surname: $('#txtLastName').val() },
                    address: {
                        address_line_1: $('#txtAddress1').val() + ' ' + $('#txtAddress2').val(), admin_area_2: $('#txtCity').val(),
                        admin_area_1: $('#ddlState').val(), postal_code: $('#txtPostCode').val(), country_code: $('#ddlCountry').val()
                    },
                    email_address: pp_email,
                    //phones: [{ country_code: "001", national_number: $('#txtbillphone').val(), phone_type: "HOME" }]
                },
                shipping_info: {
                    name: { given_name: $('#txtFirstName').val(), surname: $('#txtLastName').val() },
                    address: { address_line_1: $('#txtAddress1').val() + ' ' + $('#txtAddress2').val(), admin_area_2: $('#txtCity').val(), admin_area_1: $('#ddlState').val(), postal_code: $('#txtPostCode').val(), country_code: $('#ddlCountry').val() }
                }
            }
        ],
        items: _items,
        configuration: { partial_payment: { allow_partial_payment: false }, allow_tip: false, tax_calculated_after_discount: true, tax_inclusive: false },
        amount: {
            breakdown: {
                discount: { invoice_discount: { percent: 0 } }, shipping: { amount: { currency_code: "USD", value: shipping_total } } 
            }
        }
    }
    return paupal_xml;
}
function PaypalPayment(ppemail) {
    paypal_baseurl = 'https://api-m.sandbox.paypal.com';
    let oid = parseInt($('#hfOrderNo').val()) || 0, pp_no = 'WC-' + new Date().getTime();
    let option_pp = createPaypalXML(oid, pp_no, ppemail)
    console.log('Start PayPal Payment Processing...');
    swal.queue([{
        title: 'PayPal Payment Processing.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
        onOpen: () => {
            swal.showLoading();
            $.get('/Setting/GetPayPalToken', { strValue1: 'getToken' }).then(response => {
                let access_token = response.message;
                let pay_by = 'paypal', inv_id = '';
                let create_url = paypal_baseurl + '/v2/invoicing/invoices' + (inv_id.length > 0 && pay_by.includes('paypal') ? '/' + inv_id : ''),
                    action_method = (inv_id.length > 0 && pay_by.includes('paypal') ? 'PUT' : 'POST');
                //CreatePaypalInvoice(oid, pp_no, ppemail, response.message);
                $.ajax({
                    type: action_method, url: create_url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option_pp),
                    beforeSend: function (xhr) { xhr.setRequestHeader("Accept", "application/json"); xhr.setRequestHeader("Authorization", "Bearer " + access_token); }
                }).then(data => {
                    console.log('Invoice has been Created.');
                    let sendURL = data.href + '/send'; console.log(sendURL, data, action_method);
                    $("txtSenderEmail").data('surl', sendURL);
                    if (action_method == 'POST') {
                        SendPaypalInvoice(oid, pp_no, access_token, sendURL);
                    }
                    else {
                        swal('Success!', 'Order placed successfully.', 'success');
                        $("#GiftModal").modal('hide'); $('.billinfo').prop("disabled", true);
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
            $.post('/GiftCard/UpdatePaymentInvoiceID', opt).then(result => {
                swal('Success!', result.message, 'success');
                $('#lblOrderNo').data('pay_id', id);

                $("#GiftModal").modal('hide'); $('.billinfo').prop("disabled", true);
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
    $("#GiftModal").empty().html(modalHtml);

    var myHtml = '';
    myHtml += '<div style="margin:0;padding:0;color: #4f4f4f;font-family: Arial, sans-serif;">';
    myHtml += '<table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">';
    myHtml += '<tr>';
    myHtml += '<td align="center" style="padding:0;">';
    myHtml += '<table role="presentation" style="width:100%;border-collapse:collapse;border-spacing:0;text-align:left;">';
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
    myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top; border-right: 1px solid #c8c8c8; padding-right:30px; padding-left:30px;"> Date:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">' + todaydate + '</strong></td>';
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
    myHtml += '<tr><td style="padding: 9px 12px;"><h2 style="font-size:20px; margin:25px 0px 10px 0px;">Order details</h2></td></tr>';
    myHtml += '<tr>';
    myHtml += '<td >';

    myHtml += '<table id="tblorder_details" class="shop_table order_details" style="border: 1px solid rgba(0, 0, 0, 0.1);margin: 0 -1px 24px 0;text-align: left;width: 100%; border-collapse: separate; border-radius: 5px;">';
    myHtml += '<thead><tr><th class=" product-name" style="font-weight: 700;padding: 9px 12px;">Product</th><th class="product-total" style="font-weight: 700;padding: 9px 12px;">' + $("#lblOrderNo").data("pname") + '</th></tr></thead>';
    myHtml += '<tbody></tbody>';
    myHtml += '<tfoot>';
    myHtml += '<tr><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Subtotal:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;"><span>$' + $('#SubTotal').text() + '</span></td></tr>';
    myHtml += '<tr><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Shipping:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">' + $('#shippingTotal').text() + '</td></tr>';
    myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Tax:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">$' + $('#salesTaxTotal').text() + '</td></tr>';
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

    $('#GiftModal .modal-body').append(myHtml);

    myHtml = '';
    $('#tblorder_details tbody').append(myHtml);

    $("#GiftModal").modal({ backdrop: 'static', keyboard: false });
    //var opt = { strValue1: $('#txtbillemail').val(), strValue2: 'Your order #' + $('#hfOrderNo').val() + ' has been received', strValue3: $('#GiftModal .modal-body').html() }
    if ($('#txtSenderEmail').val().length > 5 && is_mail == true) {
        sendInvoice(paymode, id)
    }
}
function sendInvoice(paymode, id) {
    
    let order_id = parseInt($('#hfOrderNo').val()) || 0;
    let order_date = todaydate; 
    let payment_method = paymode;
    let b_first_name = $('#txtFirstName').val(), b_last_name = $('#txtLastName').val();
    let b_company = $('#txtCompany').val();
    let b_address_1 = $('#txtAddress1').val(), b_address_2 = $('#txtAddress2').val();
    let b_postcode = $('#txtPostCode').val(), b_city = $('#txtCity').val();
    let b_country = $('#ddlCountry').val(), b_state = $('#ddlState').val();
    let b_email = $('#txtSenderEmail').val(), b_phone = $('#txtPhone').val();
    let s_first_name = $('#txtFirstName').val(), s_last_name = $('#txtLastName').val();
    let s_company = $('#txtCompany').val();
    let s_address_1 = $('#txtAddress1').val(), s_address_2 = $('#txtAddress2').val();
    let s_postcode = $('#txtPostCode').val();
    let s_city = $('#txtCity').val(), s_country = $('#ddlCountry').val(), s_state = $('#ddlState').val();
    let GrassAmount = parseFloat($('#SubTotal').text()) || 0;
    let TotalTax = parseFloat($('#salesTaxTotal').text()) || 0;
    let TotalShipping = parseFloat($('#shippingTotal').text()) || 0;
    let NetTotal = parseFloat($('#orderTotal').text()) || 0;
    let _item = [];
    var qty = parseFloat($('#totalQty').text()) || 0.00;
    var rate = parseFloat($("#SubTotal").data('amount')) || 0.00;
    var grossAmount = parseFloat($('#orderTotal').text()) || 0.00;
    var product_id = parseInt($("#EmployeeListdata").data('productid')) || 853309;
    _item.push({
        order_item_id: 0, PKey: 0, order_id: order_id, product_type: 'line_item', product_id: product_id,
        variation_id: 0, product_name: $("#lblOrderNo").data("pname"), quantity: qty, sale_rate: rate,
        total: grossAmount, product_img: ''
    });
    var opt_mail = {
        order_id: order_id, order_date: order_date, payment_method: payment_method, b_first_name: b_first_name, b_last_name: b_last_name, b_company: b_company,
        b_address_1: b_address_1, b_address_2: b_address_2, b_postcode: b_postcode, b_city: b_city, b_country: b_country, b_state: b_state, b_email: b_email, b_phone: b_phone,
        s_first_name: s_first_name, s_last_name: s_last_name, s_company: s_company, s_address_1: s_address_1, s_address_2: s_address_2, s_postcode: s_postcode, s_city: s_city, s_country: s_country, s_state: s_state,
        paypal_id: id, GrassAmount: GrassAmount, TotalTax: TotalTax, TotalShipping: TotalShipping, //TotalStateRecycling: TotalStateRecycling,
        // TotalFee: TotalFee, TotalGift: TotalGift,TotalDiscount: TotalDiscount,
        NetTotal: NetTotal,OrderProducts: _item
    }
    $.ajax({
        type: "POST", url: '/Giftcard/SendMailInvoice', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt_mail),
        success: function (result) { console.log(result); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
        complete: function () { }, async: false
    });
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

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ReSendGiftCard ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function ReSendGiftCard() {
    var obj = { order_id:parseInt($('#hfOrderNo').val()) }
    $.ajax({
        type: "POST", contentType: "application/json; charset=utf-8",
        url: "/Giftcard/ResendMailInvoice",
        data: JSON.stringify(obj), dataType: "json", beforeSend: function () { $("#loader").show(); },
        success: function (result) {
            if (result.status == true) {
                swal('Success', 'Email Send successfully.', "success");
            }
            else { swal('Error', 'Something went wrong, please try again.', "error").then((result) => { return false; }); }
        },
        error: function (xhr, status, err) { $("#loader").hide(); alert(err); },
        complete: function () { },
    });
}


