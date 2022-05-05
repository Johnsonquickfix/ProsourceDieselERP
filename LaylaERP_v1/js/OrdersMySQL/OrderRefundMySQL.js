$(document).ready(function () {
    $.when(getOrderInfo()).done(function () { $('.billinfo').prop("disabled", true); });
    $(document).on("click", ".btnRefundOrder", function (t) {
        t.preventDefault(); $('.billinfo').prop("disabled", false); isEdit(true);
        $('.box-tools,.footer-finalbutton').empty().append('<button type="button" class="btn btn-danger btnRefundCancel">Cancel</button> <button type="button" class="btn btn-danger btnRefundOk">Refund $0.00</button>');
    });
    $(document).on("click", ".btnRefundCancel", function (t) {
        t.preventDefault(); $('.billinfo').prop("disabled", true); getOrderInfo(); isEdit(false);
    });
    $(document).on("click", ".btnRefundOk", function (t) { t.preventDefault(); saveCO(); });
    //$(document).on("click", ".btntest", function (t) { t.preventDefault(); AuthorizeNetPaymentRefunds(); });
});
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Common ajax function ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var ajaxFunc = function (url, data, beforeSendFun, successFun, completeFun, errorFun) {
    $.ajax({ type: "POST", url: url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(data), beforeSend: beforeSendFun, success: successFun, complete: completeFun, error: errorFun, async: false, global: false });
}
function beforeSendFun() { $("#loader").css("display", ""); $("#loader").show(); }
function completeFun() { $("#loader").css("display", "none"); $("#loader").hide(); }
function errorFun(XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); }

function ValidateMaxValue(value, min, max) {
    if (parseInt(value) < min || isNaN(value)) return 0;
    else if (parseInt(value) > max) return max;
    else return value;
}
function isEdit(val) { localStorage.setItem('isEdit', val ? 'yes' : 'no'); }
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Edit Order ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getOrderInfo() {
    let oid = parseInt($('#hfOrderNo').val()) || 0;
    if (oid > 0) {
        $('#ddlStatus').prop("disabled", true);
        $('#lblOrderNo').text('Order #' + oid + ' detail '); $('#hfOrderNo').val(oid);
        $('#order_line_items,#order_state_recycling_fee_line_items,#order_fee_line_items,#order_shipping_line_items,#gift_card_line_items,#order_refunds,#billCoupon,#billGiftCard,.refund-action').empty();
        $('#btnCheckout').remove(); $('.box-tools,.footer-finalbutton').empty().append('<button type="button" class="btn btn-danger btnRefundOrder"><i class="far fa-edit"></i> Refund</button>');
        var opt = { strValue1: oid };
        ajaxFunc('/Orders/GetOrderInfo', opt, beforeSendFun, function (result) {
            var data = JSON.parse(result);
            if (data.length > 0) {
                if (data[0].is_edit == '1') {
                    if (data[0].status == 'wc-processing' || data[0].status == 'wc-completed')
                        $('.box-tools,.footer-finalbutton').empty().append('<button type="button" class="btn btn-danger btnRefundOrder"><i class="far fa-edit"></i> Refund</button>');
                    else
                        $('.box-tools,.footer-finalbutton').empty().append('<a class="btn btn-danger" href="/OrdersMySQL/OrdersHistory" data-toggle="tooltip" data-placement="left" title="" data-original-title="Go to Order List">Back to List</a>');
                }
                else {
                    $('.box-tools,.footer-finalbutton').empty().append('<a class="btn btn-danger" href="/OrdersMySQL/OrdersHistory" data-toggle="tooltip" data-placement="left" title="" data-original-title="Go to Order List">Back to List</a>');
                }
                $('#lblOrderNo').data('pay_by', data[0].payment_method);
                $('#lblOrderNo').data('pay_gift', data[0].IsGift);
                $('#lblOrderNo').data('pay_giftCardAmount', data[0].giftCardAmount);
                $('#lblOrderNo').data('pay_giftCardRefundedAmount', data[0].GiftCardRefundedAmount);
                $('#lblOrderNo').data('order_from', data[0].post_mime_type);
                if (data[0].payment_method == 'ppec_paypal' && data[0].post_mime_type == 'shop_order_erp') $('#lblOrderNo').data('pay_id', data[0].paypal_id);
                else if (data[0].payment_method == 'ppec_paypal' && data[0].post_mime_type != 'shop_order_erp') $('#lblOrderNo').data('pay_id', data[0].transaction_id);
                else if (data[0].payment_method == 'podium') { $('#lblOrderNo').data('pay_id', data[0].podium_id); $('#lblOrderNo').data('payment_uid', data[0].podium_payment_uid); }
                else $('#lblOrderNo').data('pay_id', data[0].transaction_id);

                if (data[0].payment_method.trim().length > 0)
                    $('.payment-history').text('Payment via ' + data[0].payment_method + ' ' + data[0].created_via + '. Customer IP: ' + data[0].ip_address);
                else
                    $('.payment-history').text('Customer IP: ' + data[0].ip_address);
                $('#txtLogDate').val(data[0].date_created);
                $('#ddlStatus').val(data[0].status.trim()).trigger('change'); $('#ddlUser').prop("disabled", true);
                $("#ddlUser").empty().append('<option value="' + data[0].customer_id + '" selected>' + (isNullUndefAndSpace(data[0].customer_name) ? data[0].customer_name : data[0].b_first_name + ' ' + data[0].b_last_name) + '</option>');
                ///billing_Details
                var tPhone = data[0].b_phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3");
                let billing_Details = '<strong>' + data[0].b_first_name + ' ' + data[0].b_last_name + '</strong><br>';
                billing_Details += (data[0].b_company.length > 0 ? data[0].b_company + '<br>' : '') + (data[0].b_address_1.length > 0 ? data[0].b_address_1 + '<br>' : '')
                    + (data[0].b_address_2.length > 0 ? data[0].b_address_2 + '<br>' : '') + (data[0].b_city.length > 0 ? data[0].b_city + ', ' : '') + (data[0].b_state.length > 0 ? data[0].b_state + ' ' : '')
                    + (data[0].b_postcode.length > 0 ? data[0].b_postcode + ' ' : '') + (data[0].b_country.length > 0 ? data[0].b_country : '');
                billing_Details += '<br><strong>Email address:</strong><br>' + data[0].b_email + '<br><strong>Phone:</strong><br>' + tPhone;
                $('.billing-address').empty().append(billing_Details);

                ///shipping_Details
                let shipping_Details = '<strong>' + data[0].s_first_name + ' ' + data[0].s_last_name + '</strong><br>';
                shipping_Details += (data[0].s_company.length > 0 ? data[0].s_company + '<br>' : '') + (data[0].s_address_1.length > 0 ? data[0].s_address_1.trim() + '<br>' : '')
                    + (data[0].s_address_2.length > 0 ? data[0].s_address_2 + '<br>' : '') + (data[0].s_city.length > 0 ? data[0].s_city + ', ' : '') + (data[0].s_state.length > 0 ? data[0].s_state + ' ' : '')
                    + (data[0].s_postcode.length > 0 ? data[0].s_postcode + ' ' : '') + (data[0].s_country.length > 0 ? data[0].s_country : '')
                    + (data[0].post_excerpt.length > 0 ? '<br><strong>Note:</strong><br>' + data[0].post_excerpt : '');
                $('.shipping-address').empty().append(shipping_Details);
                $('.shipping-address').data('shipcountry', data[0].s_country.trim());
                $('.shipping-address').data('shipstate', data[0].s_state.trim());
                //bind Product
                getOrderItemList(oid); getOrderNotesList(oid);
            }
        }, function () { $("#loader").hide(); $('.billinfo').prop("disabled", true); }, function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); });
    }
    else {
        $("#loader").hide(); $('#lblOrderNo').data('pay_by', ''); $('#lblOrderNo').data('pay_id', '');
        $('.page-heading').text('Edit Order'); $('#btnSearch').prop("disabled", false);
    }
}
function getOrderItemList(oid) {
    let option = { strValue1: oid }, _tax = [];
    ajaxFunc('/Orders/GetOrderProductList', option, beforeSendFun, function (data) {
        let itemHtml = '', recyclingfeeHtml = '', feeHtml = '', shippingHtml = '', giftcardHtml = '', refundHtml = '', couponHtml = '';
        let zQty = 0.00, zGAmt = 0.00, zTDiscount = 0.00, zTotalTax = 0.00, zShippingAmt = 0.00, zGiftCardAmt = 0.00, zGiftCardrefundAmt = 0.00, zStateRecyclingAmt = 0.00, zFeeAmt = 0.00, zRefundAmt = 0.00;
        let tax_rate = 0.00;
        $.each(data, function (i, row) {
            let orderitemid = parseInt(row.order_item_id) || 0;
            if (row.product_type == 'line_item') {
                let max_amt = row.total - row.discount + row.tax_amount;
                itemHtml = '<tr id="tritemId_' + orderitemid + '" data-id="' + orderitemid + '" class="' + (row.is_free ? 'free_item' : 'paid_item') + '" data-pid="' + row.product_id + '" data-vid="' + row.variation_id + '" data-pname="' + row.product_name + '" data-gid="' + row.group_id + '" data-freeitem="' + row.is_free + '" data-freeitems=\'' + row.free_itmes + '\' data-orderitemid="' + orderitemid + '" data-qty="' + row.quantity + '" data-returnqty="0">';
                itemHtml += '<td class="text-center"><i class="far fa-images"></i></td>';
                itemHtml += '<td>' + row.product_name + '</td>';
                itemHtml += '<td class="text-right">' + row.reg_price.toFixed(2) + '</td>';
                itemHtml += '<td class="text-right row-qty">' + row.quantity + '</td>';
                if (row.is_free) {
                    itemHtml += '<td><input min="0" max="' + row.quantity + '" autocomplete="off" disabled class="form-control number rowCalulate" type="number" id="txt_RefundQty_' + orderitemid + '" value="0" name="txt_RefundQty" placeholder="Qty"></td>';
                    itemHtml += '<td class="TotalAmount text-right" data-regprice="' + row.reg_price + '"data-salerate="' + row.sale_price + '" data-discount="' + row.discount.toFixed(2) + '" data-amount="' + row.total + '" data-taxamount="' + row.tax_amount + '" data-shippingamt="' + row.shipping_amount + '">' + row.total.toFixed(2) + '</td>';
                    itemHtml += '<td class="text-right RowDiscount" data-disctype="' + row.discount_type + '" data-couponamt="0">' + row.discount.toFixed(2) + '</td>';
                    itemHtml += '<td class="text-right linetotal">' + (row.total - row.discount).toFixed(2) + '</td>';
                    itemHtml += '<td><input min="0" max="0" autocomplete="off" disabled class="form-control number rowAmountCalulate" type="number" id="txt_RefundAmt_' + orderitemid + '" value="0" name="txt_RefundAmt" placeholder="Amount"></td>';
                }
                else {
                    itemHtml += '<td><input min="0" max="' + row.quantity + '" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_RefundQty_' + orderitemid + '" value="0" name="txt_RefundQty" placeholder="Qty" onkeyup="this.value = ValidateMaxValue(this.value, 0, ' + row.quantity + ')"></td>';
                    itemHtml += '<td class="TotalAmount text-right" data-regprice="' + row.reg_price + '"data-salerate="' + row.sale_price + '" data-discount="' + row.discount.toFixed(2) + '" data-amount="' + row.total + '" data-taxamount="' + row.tax_amount + '" data-shippingamt="' + row.shipping_amount + '">' + row.total.toFixed(2) + '</td>';
                    itemHtml += '<td class="text-right RowDiscount" data-disctype="' + row.discount_type + '" data-couponamt="0">' + row.discount.toFixed(2) + '</td>';
                    itemHtml += '<td class="text-right linetotal">' + (row.total - row.discount).toFixed(2) + '</td>';
                    itemHtml += '<td><input min="0" max="' + max_amt + '" autocomplete="off" class="form-control billinfo number rowAmountCalulate" type="number" id="txt_RefundAmt_' + orderitemid + '" value="0" name="txt_RefundAmt" placeholder="Amount" onkeyup="this.value = ValidateMaxValue(this.value, 0, ' + max_amt + ');" data-maxamt="' + max_amt + '"></td>';
                }

                itemHtml += '<td class="text-right RowTax">' + row.tax_amount.toFixed(4) + '</td>';
                itemHtml += '</tr>';
                zQty = zQty + (parseFloat(row.quantity) || 0.00);
                zGAmt = zGAmt + (parseFloat(row.total) || 0.00);
                zTotalTax = zTotalTax + (parseFloat(row.tax_amount) || 0.00);
                zTDiscount = zTDiscount + row.discount;
                if (row.tax_amount > 0) tax_rate = parseFloat(((row.tax_amount / ((row.total - row.discount) * 0.01)) / 100).toFixed(4))
                $('#order_line_items').append(itemHtml);
            }
            else if (row.product_type == 'coupon') {
                let cou_amt = parseFloat(row.discount) || 0.00;
                let coupon_list = auto_coupon.filter(element => element.post_title == row.product_name);
                for (var j = 0; j < coupon_list.length; j++) {
                    couponHtml += '<li id="li_' + coupon_list[j].post_title + '" data-coupon= "' + coupon_list[j].post_title + '" data-couponamt= "' + coupon_list[j].coupon_amount + '" data-disctype= "' + coupon_list[j].discount_type + '" data-rqprdids= "' + coupon_list[j].product_ids + '" data-excludeids= "' + coupon_list[j].exclude_product_ids + '" data-type= "' + coupon_list[j].type + '" data-orderitemid="' + orderitemid + '">';
                    couponHtml += '<a href="javascript:void(0);">';
                    couponHtml += '<i class="fa fa-gift"></i>';
                    couponHtml += '<span>' + coupon_list[j].title + '</span>';
                    couponHtml += '<div class="pull-right">';
                    couponHtml += '$<span id="cou_discamt">' + cou_amt.toFixed(2) + '</span>';
                    couponHtml += '</div>';
                    couponHtml += '</a>';
                    couponHtml += '</li>';
                }
                if (coupon_list.length == 0) {
                    let cpn_name = row.product_name;

                    couponHtml += '<li id="li_' + row.product_name + '" data-coupon= "' + row.product_name + '" data-couponamt= "' + row.discount.toFixed(2) + '" data-disctype= "" data-orderitemid="' + orderitemid + '">';
                    couponHtml += '<a href="javascript:void(0);">';
                    couponHtml += '<i class="fa fa-gift"></i>';
                    couponHtml += '<span>' + cpn_name + '</span>';
                    couponHtml += '<div class="pull-right">';
                    couponHtml += '$<span id="cou_discamt">' + cou_amt.toFixed(2) + '</span>';
                    couponHtml += '</div>';
                    couponHtml += '</a>';
                    couponHtml += '</li>';
                }
                //zTDiscount = zTDiscount + cou_amt;
            }
            else if (row.product_type == 'fee' && row.product_name == 'State Recycling Fee') {
                recyclingfeeHtml = '<tr id="trfeeid_' + orderitemid + '" data-orderitemid="' + orderitemid + '" data-pname="' + row.product_name + '">';
                recyclingfeeHtml += '<td class="text-center item-action"><i class="fa fa-plus-circle"></i></td>';
                recyclingfeeHtml += '<td>' + row.product_name + '</td><td></td><td class="text-right row-refuntamt"></td><td></td><td></td><td></td><td class="TotalAmount text-right">' + row.total.toFixed(2) + '</td><td class="RefundAmount text-right"></td><td></td>';
                recyclingfeeHtml += '</tr>';
                zStateRecyclingAmt = zStateRecyclingAmt + (parseFloat(row.total) || 0.00);
                $("#stateRecyclingFeeTotal").data("orderitemid", orderitemid);
                $('#order_state_recycling_fee_line_items').append(recyclingfeeHtml);
            }
            else if (row.product_type == 'fee' && row.product_name != 'State Recycling Fee') {
                let startingNumber = (row.product_name.match(/^-?\d+\.\d+|^-?\d+\b|^\d+(?=\w)/g) || []);
                let feetype = row.product_name.match(/%/g) != null ? '%' : '';
                let sd = feetype == '%' ? (parseFloat(startingNumber) || 0.00) : parseFloat(row.total);
                feeHtml = '<tr id="trfeeid_' + orderitemid + '" data-orderitemid="' + orderitemid + '" class="' + (feetype == '%' ? 'percent_fee' : 'fixed_fee') + '" data-pname="' + row.product_name + '" data-feeamt="' + sd + '" data-feetype="' + feetype + '" data-totalamt="' + row.total + '"> ';
                feeHtml += '<td class="text-center item-action"><i class="fas fa-plus-circle"></i></td>';
                feeHtml += '<td>' + row.product_name + '</td><td></td><td></td><td class="text-right row-refuntamt"></td>';
                feeHtml += '<td></td><td></td><td class="TotalAmount text-right">' + row.total.toFixed(2) + '</td>';
                if (row.total <= 0) {
                    feeHtml += '<td><input min="0" autocomplete="off" disabled class="form-control number" type="number" id="txt_FeeAmt_' + orderitemid + '" value="0" name="txt_FeeAmt" placeholder="Amount"></td>';
                }
                else {
                    feeHtml += '<td><input min="0" max="' + row.total + '" autocomplete="off" class="form-control billinfo number rowAmountCalulate" type="number" id="txt_FeeAmt_' + orderitemid + '" value="0" name="txt_FeeAmt" placeholder="Amount" onkeyup="this.value = ValidateMaxValue(this.value, 0, ' + row.total + ')"></td>';
                }
                feeHtml += '<td></td></tr>';
                zFeeAmt = zFeeAmt + (parseFloat(row.total) || 0.00);
                $('#order_fee_line_items').append(feeHtml);
            }
            else if (row.product_type == 'shipping') {
                shippingHtml = '<tr id="tritemId_' + orderitemid + '" data-orderitemid="' + orderitemid + '" data-pname="' + row.product_name + '">';
                shippingHtml += '<td class="text-center item-action"><i class="fa fa-shipping-fast"></i></td>';
                shippingHtml += '<td>Shipping</td><td></td><td></td><td class="text-right row-refuntamt"></td></td><td></td><td></td><td class="TotalAmount text-right">' + row.total.toFixed(2) + '</td><td class="RefundAmount text-right"><td></td>';
                shippingHtml += '</tr>';
                zShippingAmt = zShippingAmt + (parseFloat(row.total) || 0.00);
                $("#shippingTotal").data("orderitemid", orderitemid);
                $('#order_shipping_line_items').append(shippingHtml);
            }
            else if (row.product_type == 'gift_card') {
                let _meta = JSON.parse(row.meta_data);
                giftcardHtml += '<li id="li_' + row.product_name.toString().toLowerCase().replaceAll(' ', '_') + '" data-pn="' + row.product_name.toString() + '" data-id="' + (_meta != null ? parseInt(_meta.giftcard_id) : '0') + '" data-orderitemid="' + orderitemid + '" data-amount="' + row.total.toFixed(2) + '">';
                giftcardHtml += '<a href="javascript:;"><i class="glyphicon glyphicon-gift"></i><span>' + row.product_name + '</span><div class="pull-right">$<span id="gift_amt">' + row.total.toFixed(2) + '</span></div></a>';
                giftcardHtml += '</li>';
                zGiftCardAmt = zGiftCardAmt + (parseFloat(row.total) || 0.00);
            }
            else if (row.product_type == 'refund') {
                refundHtml = '<tr id="tritemId_' + orderitemid + '" data-orderitemid="' + orderitemid + '" data-pname="' + row.product_name + '">';
                refundHtml += '<td class="text-center item-action"><i class="fas fa-retweet"></i></td>';
                refundHtml += '<td>' + row.product_name + '</td><td></td><td></td><td></td><td></td><td></td><td class="TotalAmount text-right">' + row.total.toFixed(2) + '</td><td></td><td></td>';
                refundHtml += '</tr>';
                zRefundAmt = zRefundAmt + (parseFloat(row.total) || 0.00);
                $('#order_refunds').append(refundHtml);
            }
            else if (row.product_type == 'tax') {
                //let tax = parseFloat(row.tax_amount) || 0.00; tax_rate = tax > 0 ? tax : tax_rate;
                //$("#salesTaxTotal").data("orderitemid", orderitemid);
                //$("#hfTaxRate").data('freighttax', row.shipping_tax_amount);
                _tax.push({ order_item_id: row.order_item_id, name: row.product_name, label: row.meta_data, rate: row.tax_amount, amount: row.total });
            }
            else if (row.product_type == 'refund_items') {
                if (row.product_name == "line_item") {
                    //let _total = (row.total - row.tax_amount), _totaltax = row.tax_amount;
                    let max_return = parseInt($("#tritemId_" + orderitemid).data("qty")) + parseInt(row.quantity);
                    $("#tritemId_" + orderitemid).find('[name=txt_RefundQty]').attr({ "max": max_return, "min": 0, "onkeyup": 'this.value = ValidateMaxValue(this.value, 0, ' + max_return + ')' });
                    $("#tritemId_" + orderitemid).data("returnqty", row.quantity); $("#tritemId_" + orderitemid).data("returnamt", row.total.toFixed(2));
                    if (row.quantity != 0) $("#tritemId_" + orderitemid).find('.row-qty').append('<span class="text-danger" style="display: block;"><i class="fa fa-fw fa-undo"></i>' + row.quantity + '</span>');
                    $("#tritemId_" + orderitemid).find('.linetotal').append('<span class="text-danger" style="display: block;"><i class="fa fa-fw fa-undo"></i>' + row.total.toFixed(2) + '</span>');
                    $("#tritemId_" + orderitemid).find('.RowTax').append('<span class="text-danger" style="display: block;"><i class="fa fa-fw fa-undo"></i>' + row.tax_amount.toFixed(2) + '</span>');

                    let max_amt = parseFloat($("#txt_RefundAmt_" + orderitemid).data("maxamt")) + row.total;
                    $("#txt_RefundAmt_" + orderitemid).attr({ "max": max_amt, "min": 0, "onkeyup": 'this.value = ValidateMaxValue(this.value, 0, ' + max_amt + ')' });
                }
                else if (row.product_name == "fee") {
                    let max_amt = parseInt($("#trfeeid_" + orderitemid).data("totalamt")) + parseInt(row.total);
                    $("#trfeeid_" + orderitemid).find('[name=txt_FeeAmt]').attr({ "max": max_amt, "min": 0, "onkeyup": 'this.value = ValidateMaxValue(this.value, 0, ' + max_amt + ')' });
                    $("#trfeeid_" + orderitemid).find('.row-refuntamt').append('<span class="text-danger"><i class="fa fa-fw fa-undo"></i>' + row.total + '</span>');
                }
                else if (row.product_name == "shipping") {
                    $("#tritemId_" + orderitemid).find('.row-refuntamt').append('<span class="text-danger"><i class="fa fa-fw fa-undo"></i>' + row.shipping_amount + '</span>');
                }
                else if (row.product_name == "gift_card") {
                    let ref_amt = parseInt($("#trfeeid_" + orderitemid).data("ref_amt")) + parseInt(row.total);
                    $("#billGiftCard").find('[data-orderitemid=' + orderitemid + ']').data('ref_amt', ref_amt);
                    zGiftCardrefundAmt += row.total;
                }
            }
        });

        $("#hfTaxRate").val(tax_rate); $(".lbl-saletax").text(tax_rate > 0 ? 'Sale Tax (' + (tax_rate * 100).toFixed(2) + '%)' : 'Sale Tax');
        $('.refund-action').append('<button type="button" id="btnAddFee" class="btn btn-danger billinfo">Add Fee</button> ');
        //$('.refund-action').append('<button type="button" id="btnRefundItem" class="btn btn-danger billinfo">Refund</button>');
        $('#billCoupon').append(couponHtml); $('#billGiftCard').append(giftcardHtml);
        //Calculate Final
        FinalTotalControl(_tax);
        $("#totalQty").text(zQty.toFixed(0)); $("#totalQty").data('qty', zQty.toFixed(0));
        $("#SubTotal").text(zGAmt.toFixed(2));
        $("#discountTotal").text(zTDiscount.toFixed(2));
        $("#orderTotal").data('tax', zTotalTax.toFixed(2));//$("#salesTaxTotal").text(zTotalTax.toFixed(2));
        $("#giftCardTotal").text(zGiftCardAmt.toFixed(2)); $("#giftCardTotal").data('gf_amt', zGiftCardAmt.toFixed(2)); $("#giftCardTotal").data('gf_rf_amt', zGiftCardrefundAmt.toFixed(2));
        $("#shippingTotal").text(zShippingAmt.toFixed(2));
        $("#stateRecyclingFeeTotal").text(zStateRecyclingAmt.toFixed(2));
        $("#feeTotal").text(zFeeAmt.toFixed(2));
        $("#orderTotal").html((zGAmt - zTDiscount - zGiftCardAmt + zShippingAmt + zTotalTax + zStateRecyclingAmt + zFeeAmt).toFixed(2));
        $("#refundedTotal").text(zRefundAmt.toFixed(2)); $("#refundedByGiftCard").text(zGiftCardrefundAmt.toFixed(2));
        let netpay = (zGAmt - zTDiscount - zGiftCardAmt + zShippingAmt + zTotalTax + zStateRecyclingAmt + zFeeAmt) + zRefundAmt;
        $("#netPaymentTotal").text(netpay.toFixed(2));
        if (netpay <= 0 && zGiftCardAmt <= zGiftCardrefundAmt)
            $('.box-tools,.footer-finalbutton').empty().append('<a class="btn btn-danger" href="/OrdersMySQL/OrdersHistory" data-toggle="tooltip" data-placement="left" title="" data-original-title="Go to Order List">Back to List</a>');
        //if (zRefundAmt != 0) $(".refund-total").removeClass('hidden'); else $(".refund-total").addClass('hidden');
        $("#order_line_items,#order_fee_line_items").find(".rowCalulate").change(function () { calculateRefunOnQty(); });
        $("#order_line_items,#order_fee_line_items").find(".rowAmountCalulate").change(function () { calculateRefunOnAmount(); });
    }, completeFun, errorFun);

    setTimeout(function () { getShippingCharge(); }, 50);
}
function getOrderNotesList(oid) {
    var option = { strValue1: oid };
    ajaxFunc('/Orders/GetOrderNotesList', option, beforeSendFun, function (result) {
        var data = JSON.parse(result);
        let noteHtml = '';
        $.each(data, function (i, row) {
            noteHtml += '<li id="linoteid_' + row.comment_ID + '" class="note system-note ' + (row.is_customer_note == '1' ? 'customer-note' : '') + '">';
            noteHtml += '<div class="note_content"><p>' + row.comment_content + '</p></div>';
            noteHtml += '<p class="meta"><abbr class="exact-date" title="' + row.comment_date + '">' + row.comment_date + '</abbr></p>';
            noteHtml += '</li>';
        });
        $(".order_notes").empty().html(noteHtml);
    }, completeFun, errorFun);
}
function getTaxRate() {
    let tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00, tax_amt = $("#salesTaxTotal").text(zTotalTax.toFixed(2));
    if (tax_rate == 0 && tax_amt > 0) {

        if (parseFloat(row.tax_amount) > 0) {
            console.log((parseFloat(row.tax_amount) / ((parseFloat(row.total) - parseFloat(row.discount)) * 0.01)) / 100);
        }
    }
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Shipping Charges ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getShippingCharge() {
    //let v_ids = []; let zShippingAmt = 0.00;
    //$("#order_line_items  > tr.paid_item").each(function () { v_ids.push($(this).data('vid')); });
    //if (v_ids.join(',').length > 0) {
    //    let options = { strValue1: v_ids.join(','), strValue2: $("#ddlshipcountry").val(), strValue3: $("#ddlshipstate").val() };
    //    $(".TotalAmount").data("shippingamt", 0.00);
    //    $.post('/Orders/GetProductShipping', options).then(response => {
    //        $("#order_line_items > tr.paid_item").each(function (index, tr) {
    //            let proudct_item = response.find(el => el.product_id === $(tr).data('vid'));
    //            if (proudct_item != null) { $(tr).find(".TotalAmount").data("shippingamt", proudct_item.AK); zShippingAmt += proudct_item.AK; }
    //        });
    //    }).catch(err => { $("#loader").hide(); swal('Error!', err, 'error'); }).always(function () { $("#loader").hide(); });
    //    $('#order_shipping_line_items').find(".RefundAmount").text(zShippingAmt.toFixed(2));
    //}

    let p_ids = [], v_ids = [];
    $("#order_line_items  > tr.paid_item").each(function () { p_ids.push($(this).data('pid')); v_ids.push($(this).data('vid')); });
    if (p_ids.join(',').length > 0 || v_ids.join(',').length > 0) {
        let options = { strValue1: p_ids.join(','), strValue2: v_ids.join(','), strValue3: $('.shipping-address').data('shipcountry'), strValue4: $('.shipping-address').data('shipstate') };
        $(".TotalAmount").data("shippingamt", 0.00);
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
        }).catch(err => { $("#loader").hide(); swal('Error!', err, 'error'); }).always(function () { $("#loader").hide(); });
    }
}
function getStateRecyclingCharge() {
    let ship_state = $('.shipping-address').data('shipstate');
    let zStateRecyclingAmt = 0.00, matCount = 0;
    $("#order_line_items > tr.paid_item").each(function () {
        if (parseInt($(this).find("[name=txt_RefundAmt]").val()) == 0) {
            if (recycling_item.includes($(this).data('pid'))) { matCount = matCount + (parseInt($(this).find("[name=txt_RefundQty]").val()) || 0.00); }
        }
    });
    if (ship_state == "CA") { zStateRecyclingAmt = matCount * 10.5; }
    else if (ship_state == "CT") { zStateRecyclingAmt = matCount * 11.75; }
    else if (ship_state == "RI") { zStateRecyclingAmt = matCount * 16; }
    $('#order_state_recycling_fee_line_items').find(".RefundAmount").text(zStateRecyclingAmt.toFixed(2));
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Current Refund Calculate ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function freeQtyUpdate() {
    $("#order_line_items > tr.free_item").each(function (index, row) {
        let zQty = 0.00, pid = parseInt($(this).data("pid")) || 0, vid = parseInt($(this).data("vid")) || 0;
        $("#order_line_items  > tr.paid_item").each(function (pindex, prow) {
            if ($(prow).data('freeitems')[pid] != undefined) {
                zQty += parseFloat($(prow).find("[name=txt_RefundQty]").val()) * parseFloat($(prow).data('freeitems')[pid]);
            }
            else if ($(prow).data('freeitems')[vid] != undefined) {
                zQty += parseFloat($(prow).find("[name=txt_RefundQty]").val()) * parseFloat($(prow).data('freeitems')[vid]);
            }
        });
        $(row).find("[name=txt_RefundQty]").val(zQty.toFixed(0));
    });
}
function calculateRefunOnAmount() {
    let qty = 0.00, refund_amt = 0.00, taxtotal = 0.00, shippingtotal = 0.00, staterecyclingtotal = 0.00, feetotal = 0.00, total = 0.00;
    let tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00;
    $('#order_line_items > tr').each(function (index, tr) {
        $(tr).find("[name=txt_RefundQty]").val(0);
        refund_amt = parseFloat($(tr).find("[name=txt_RefundAmt]").val()) || 0

        let grossAmount = 0.00; taxAmount = parseFloat($(tr).find(".TotalAmount").data('taxamount')) || 0.00;
        if (taxAmount > 0 && tax_rate > 0) {
            //grossAmount = parseFloat(((refund_amt * 100) / ((tax_rate * 100) + 100)).toFixed(2));
            grossAmount = refund_amt;
        }
        else if (taxAmount > 0 && tax_rate == 0) {
            tax_rate = parseFloat(((taxAmount / ((refund_amt - discountAmount) * 0.01)) / 100).toFixed(4));
            //grossAmount = ((refund_amt * 100) / ((tax_rate * 100) + 100)).toFixed(2);
            grossAmount = refund_amt;
        }
        else if (taxAmount == 0 && tax_rate == 0) { tax_rate = 0.00; grossAmount = refund_amt; }
        total += grossAmount;
        taxtotal += (grossAmount * tax_rate); //taxtotal += (refund_amt - grossAmount);
    });
    $('#order_fee_line_items > tr').each(function (index, tr) {
        feetotal += parseFloat($(tr).find("[name=txt_FeeAmt]").val()) || 0;
    });
    total = total + feetotal + taxtotal + staterecyclingtotal;
    $('#order_shipping_line_items').find(".RefundAmount").text(shippingtotal.toFixed(2)); $('.btnRefundOk').data('tax', taxtotal.toFixed(2));
    $('.btnRefundOk').data('qty', qty); $('.btnRefundOk').data('total', total.toFixed(2)); $('.btnRefundOk').data('nettotal', total.toFixed(2));
    $('.btnRefundOk').text('Refund $' + total.toFixed(2));
}
function calculateRefunOnQty() {
    let qty = 0.00, subtotal = 0.00, taxtotal = 0.00, shippingtotal = 0.00, staterecyclingtotal = 0.00, feetotal = 0.00, total = 0.00;
    $('#order_line_items > tr').each(function (index, tr) { $(tr).find("[name=txt_RefundAmt]").val(0); });
    freeQtyUpdate();
    let _items = createItemsList(); //console.log(_items);
    //getStateRecyclingCharge();
    $.each(_items, function (key, item) {
        if (item.product_type == 'line_item') {
            qty += item.refundqty; subtotal += item.total; shippingtotal += item.shipping_amount;
            taxtotal += item.tax_amount; total += (item.total - item.discount + item.tax_amount + item.shipping_amount);
        }
    });
    // Fee
    $('#order_fee_line_items > tr').each(function (index, tr) {
        let zAmt = 0.00;
        if ($(tr).data('feetype') == '%') {
            zAmt = (subtotal * (parseFloat($(this).data('feeamt')) / 100));
            $(tr).find("[name=txt_FeeAmt]").val(zAmt.toFixed(2));
        }
        else { zAmt = parseFloat($(tr).find('[name=txt_FeeAmt]').val()); }
        feetotal += zAmt;
    });

    staterecyclingtotal = parseFloat($('#order_state_recycling_fee_line_items').find(".RefundAmount").text()) || 0.00;
    total = total + feetotal + staterecyclingtotal;
    $('#order_shipping_line_items').find(".RefundAmount").text(shippingtotal.toFixed(2));
    $('.btnRefundOk').data('qty', qty); $('.btnRefundOk').data('total', total.toFixed(2)); $('.btnRefundOk').data('tax', taxtotal.toFixed(2)); $('.btnRefundOk').data('nettotal', total.toFixed(2));
    $('.btnRefundOk').text('Refund $' + total.toFixed(2));
}
function FinalTotalControl(tax_list) {
    let _html = '<div class="form-group"><label class="col-sm-10 control-label">Sub-Total(<span id="totalQty">0</span>)</label><div class="col-sm-2 controls text-right">$<span id="SubTotal">0.00</span></div></div>';
    _html += '<div class="form-group"><label class="col-sm-10 control-label">Total Savings</label><div class="col-sm-2 controls text-right">$<span id="discountTotal">0.00</span></div></div>';
    _html += '<div class="form-group"><label class="col-sm-10 control-label">Fee</label><div class="col-sm-2 controls text-right">$<span id="feeTotal">0.00</span></div></div>';
    _html += '<div class="form-group"><label class="col-sm-10 control-label">State Recycling Fee</label><div class="col-sm-2 controls text-right">$<span id="stateRecyclingFeeTotal" data-orderitemid="0">0.00</span></div></div>';
    _html += '<div class="form-group"><label class="col-sm-10 control-label">Shipping</label><div class="col-sm-2 controls text-right">$<span id="shippingTotal" data-orderitemid="0">0.00</span></div></div>';
    //_html += '<div class="form-group"><label class="col-sm-10 control-label">Shipping Tax</label<div class="col-sm-2 controls text-right">$<span id="shippingTaxTotal">0.00</span></div></div>';
    // Add Tax
    if (tax_list.length > 0) {
        $.each(tax_list, function (index, value) {
            _html += '<div class="form-group"><label class="col-sm-10 control-label">' + value.label + ' - ' + (value.rate * 100).toFixed(2) + '%</label><div class="col-sm-2 controls text-right">$<span class="tax-total" data-order_item_id="' + value.order_item_id + '" data-name="' + value.name + '" data-label="' + value.label + '" data-percent="' + value.rate + '" data-amount="' + value.amount.toFixed(4) + '">' + value.amount.toFixed(4) + '</span></div></div>';
        });
    }
    else {
        $.each($('#hfTaxRate').data('meta_data'), function (name, value) {
            _html += '<div class="form-group"><label class="col-sm-10 control-label">' + value.type + ' - ' + (value.rate * 100).toFixed(2) + '%</label><div class="col-sm-2 controls text-right">$<span class="tax-total" data-order_item_id="' + value.order_item_id + '" data-name="' + value.name.replaceAll(' ', '-') + '-' + (value.rate * 100).toFixed(2) + '" data-label="' + value.type + '" data-percent="' + value.rate + '" data-amount="0">0.00</span></div></div>';
        });
    }
    _html += '<div class="form-group"><label class="col-sm-10 control-label">Gift Card</label><div class="col-sm-2 controls text-right">$<span id="giftCardTotal">0.00</span></div></div>';
    _html += '<div class="form-group"><label class="col-sm-10 control-label">Order Total</label><div class="col-sm-2 controls text-right"><strong>$<span id="orderTotal">0.00</span></strong></div></div>';
    // Refund 
    _html += '<div class="form-group refund-total"><label class="col-sm-10 control-label">Refunded</label><div class="col-sm-2 controls text-right text-red text-weight-bold"><strong>$<span id="refundedTotal">0.00</span></strong></div></div>';
    _html += '<div class="form-group refund-total"><label class="col-sm-10 control-label">Refunded By Gift Card</label><div class="col-sm-2 controls text-right text-red text-weight-bold"><strong>$<span id="refundedByGiftCard" data-orderitemid="0">0.00</span></strong></div></div>';
    _html += '<div class="form-group refund-total"><label class="col-sm-10 control-label">Net Payment</label><div class="col-sm-2 controls text-right text-weight-bold"><strong>$<span id="netPaymentTotal">0.00</span></strong></div></div>';
    $('#order_final_total').empty().append(_html);
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Save Details ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function createPostMeta() {
    let oid = 0, postMetaxml = [];
    let pay_giftCardAmount = ($('#giftCardTotal').data('gf_amt') || 0.00), net_total = parseFloat($('.btnRefundOk').data('nettotal')) || 0.00,
        GiftCardRefundedAmount = ($('#giftCardTotal').data('gf_rf_amt') || 0.00),
        AvailableGiftCardAmount = pay_giftCardAmount - GiftCardRefundedAmount;
    let total = 0.00;
    if (AvailableGiftCardAmount >= net_total) { total = 0.00; }
    else if (AvailableGiftCardAmount < net_total && AvailableGiftCardAmount > 0) { total = net_total - AvailableGiftCardAmount; }
    else { total = parseFloat($('.btnRefundOk').data('total')) || 0.00; }
    let tax = parseFloat($('.btnRefundOk').data('tax')) || 0.00;
    postMetaxml.push(
        { post_id: oid, meta_key: '_order_currency', meta_value: 'USD' }, { post_id: oid, meta_key: '_refund_reason', meta_value: '' },//Customer Cancelled
        { post_id: oid, meta_key: '_cart_discount', meta_value: 0 }, { post_id: oid, meta_key: '_cart_discount_tax', meta_value: 0 },
        { post_id: oid, meta_key: '_order_shipping', meta_value: 0 }, { post_id: oid, meta_key: '_order_shipping_tax', meta_value: 0 },
        { post_id: oid, meta_key: '_order_tax', meta_value: '-' + tax }, { post_id: oid, meta_key: '_order_total', meta_value: '-' + total },
        { post_id: oid, meta_key: '_order_version', meta_value: '4.8.0' }, { post_id: oid, meta_key: '_prices_include_tax', meta_value: 'no' },
        { post_id: oid, meta_key: '_refund_amount', meta_value: total }, { post_id: oid, meta_key: '_refunded_payment', meta_value: '1' },
        { post_id: oid, meta_key: '_refund_giftcard_amount', meta_value: 0 }
    );
    return postMetaxml;
}
function createPostStatus() {
    let oid = parseInt($('#hfOrderNo').val()) || 0;
    let gc_amt = parseFloat($('#giftCardTotal').text()) || 0.00, gc_rt_amt = parseFloat($('#refundedByGiftCard').text()) || 0.00;
    let o_amt = parseFloat($('#orderTotal').text()) || 0.00, o_rt_amt = parseFloat($('#refundedTotal').text()) || 0.00;
    let rt_amt = (parseFloat($('.btnRefundOk').data('nettotal')) || 0.00)
    o_amt = gc_amt + o_amt; o_rt_amt = Math.abs(o_rt_amt) + gc_rt_amt + rt_amt;
    var postStatus = {
        order_id: oid,
        parent_id: 0,
        returning_customer: 0,
        customer_id: parseInt($('#ddlUser').val()) || 0,
        num_items_sold: '-' + (parseInt($('.btnRefundOk').data('qty')) || 0),
        total_sales: '-' + (parseFloat($('.btnRefundOk').data('total')) || 0.00),
        tax_total: '-' + (parseFloat($('.btnRefundOk').data('tax')) || 0.00),
        shipping_total: 0,
        net_total: '-' + (parseFloat($('.btnRefundOk').data('nettotal')) || 0.00),
        status: (o_rt_amt >= o_amt ? 'wc-refunded' : ''), pay_by: $('#lblOrderNo').data('pay_by').trim()
    };
    return postStatus;
}
function createItemsList() {
    let oid = parseInt($('#hfOrderNo').val()) || 0, cid = parseInt($('#ddlUser').val()) || 0;
    let tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00, mattotalCount = 0, matreturnCount = 0, total_tax = 0.00;
    let _itmes = [], _taxes = [], _taxdata = { total: {}, subtotal: {} };
    //get all tax type
    $('#order_final_total .tax-total').each(function (index, li) { _taxes.push({ label: $(li).data('name'), percent: parseFloat($(li).data('percent')) || 0 }); });
    //get all products
    $('#order_line_items > tr').each(function (index, tr) {
        let oi_id = parseInt($(this).data('orderitemid')) || 0, qty = parseFloat($(tr).data('qty')) || 0.00;
        let refundqty = parseFloat($(tr).find("[name=txt_RefundQty]").val()) || 0.00;
        let lastrefundqty = parseFloat($(tr).data('returnqty')) || 0.00;
        let rate = parseFloat($(tr).find(".TotalAmount").data('regprice')) || 0.00;
        let grossAmount = parseFloat($(tr).find(".TotalAmount").data('amount')) || 0.00;
        let lastrefundamt = parseFloat($(tr).data('returnamt')) || 0.00;
        let refundamt = parseFloat($(tr).find("[name=txt_RefundAmt]").val()) || 0.00;
        let discountAmount = parseFloat($(tr).find(".TotalAmount").data('discount')) || 0.00;
        let taxAmount = parseFloat($(tr).find(".TotalAmount").data('taxamount')) || 0.00;
        let shippinAmount = parseFloat($(tr).find(".TotalAmount").data('shippingamt')) || 0.00;
        let srfee = parseFloat($(tr).data("srfee")) || 0.00; mattotalCount += srfee > 0 ? qty : 0;
        _taxdata = { total: {}, subtotal: {} };
        if (refundqty > 0 && refundamt == 0) {
            matreturnCount += srfee > 0 ? refundqty : 0;
            /// calculate tax Rate
            if (taxAmount > 0 && tax_rate == 0) { tax_rate = parseFloat(((taxAmount / ((grossAmount - discountAmount) * 0.01)) / 100).toFixed(4)); }
            grossAmount = grossAmount - discountAmount + lastrefundamt;/// balance gross amount
            //grossAmount = grossAmount - discountAmount;/// balance gross amount
            qty = qty + lastrefundqty;/// balance Quantity 
            grossAmount = grossAmount > 0 ? (grossAmount / qty) * refundqty : 0;
            discountAmount = 0;
            if ($(tr).data('pid') == '888864') taxAmount = 0;
            else {
                taxAmount = grossAmount * tax_rate;
                $.each(_taxes, function (i, r) {
                    _taxdata.total[r.label] = ((grossAmount - discountAmount) * r.percent).toFixed(4); _taxdata.subtotal[r.label] = ((grossAmount - discountAmount) * r.percent).toFixed(4);
                });
            }
            shippinAmount = shippinAmount > 0 ? shippinAmount * refundqty : 0;

            _itmes.push({
                order_item_id: oi_id, product_type: 'line_item', PKey: index, order_id: oid, customer_id: cid, product_id: $(tr).data('pid'), variation_id: $(tr).data('vid'), product_name: $(tr).data('pname'),
                quantity: refundqty, sale_rate: rate, total: grossAmount, discount: discountAmount, tax_amount: taxAmount, shipping_amount: shippinAmount, shipping_tax_amount: 0,
                meta_data: serialize(_taxdata)
            });
        }
        else if (refundamt > 0) {
            if (taxAmount > 0 && tax_rate > 0) {
                //grossAmount = ((refundamt * 100) / ((tax_rate * 100) + 100)).toFixed(2);
                grossAmount = refundamt;
            }
            else if (taxAmount > 0 && tax_rate == 0) {
                tax_rate = parseFloat(((taxAmount / ((grossAmount - discountAmount) * 0.01)) / 100).toFixed(4));
                //grossAmount = ((refundamt * 100) / ((tax_rate * 100) + 100)).toFixed(2);
                grossAmount = refundamt;
            }
            else if (taxAmount == 0 && tax_rate == 0) { tax_rate = 0.00; grossAmount = refundamt; }
            //discountAmount = 0, taxAmount = (refundamt - grossAmount).toFixed(2), shippinAmount = 0;
            discountAmount = 0, taxAmount = grossAmount * tax_rate, shippinAmount = 0;
            if ($(tr).data('pid') == '888864') { taxAmount = 0, grossAmount = refundamt; }
            else {
                $.each(_taxes, function (i, r) {
                    _taxdata.total[r.label] = ((grossAmount - discountAmount) * r.percent).toFixed(4); _taxdata.subtotal[r.label] = ((grossAmount - discountAmount) * r.percent).toFixed(4);
                });
            }

            _itmes.push({
                order_item_id: oi_id, product_type: 'line_item', PKey: index, order_id: oid, customer_id: cid, product_id: $(tr).data('pid'), variation_id: $(tr).data('vid'), product_name: $(tr).data('pname'),
                quantity: refundqty, sale_rate: rate, total: grossAmount, discount: discountAmount, tax_amount: taxAmount, shipping_amount: shippinAmount, shipping_tax_amount: 0,
                meta_data: serialize(_taxdata)
            });
        }

    });
    let _amt = 0.00;
    //Add Gift Card
    let pay_giftCardAmount = ($('#giftCardTotal').data('gf_amt') || 0.00), net_total = parseFloat($('.btnRefundOk').data('nettotal')) || 0.00,
        GiftCardRefundedAmount = ($('#giftCardTotal').data('gf_rf_amt') || 0.00), pay_gift = ($('#lblOrderNo').data('pay_gift') || ''),
        AvailableGiftCardAmount = pay_giftCardAmount - GiftCardRefundedAmount, giftcardtotal = 0.00;

    if (AvailableGiftCardAmount > 0 && pay_gift == 'gift_card') {
        if (AvailableGiftCardAmount == 0) { giftcardtotal = 0; }
        else if (AvailableGiftCardAmount >= net_total) { giftcardtotal = net_total; }
        else if (AvailableGiftCardAmount > 0 && AvailableGiftCardAmount < net_total) {
            let total = net_total - AvailableGiftCardAmount; $('.btnRefundOk').data('nettotal', total);
            giftcardtotal = AvailableGiftCardAmount;
        }
        let _orderTotal = giftcardtotal;
        //Calculate gift card discount
        $('#billGiftCard li').each(function (index, li) {
            let gc_amt = parseFloat($(li).data('amount')) || 0.00, gc_ref_amt = parseFloat($(li).data('ref_amt')) || 0.00; gc_amt = gc_amt - gc_ref_amt;
            if (_orderTotal >= gc_amt) {
                _itmes.push({ order_item_id: parseInt($(li).data('orderitemid')), order_id: oid, product_id: $(li).data('id'), product_name: $(li).data('pn'), product_type: 'gift_card', total: gc_amt });
                _orderTotal = _orderTotal - gc_amt;
            }
            else if (gc_amt >= _orderTotal) {
                _itmes.push({ order_item_id: parseInt($(li).data('orderitemid')), order_id: oid, product_id: $(li).data('id'), product_name: $(li).data('pn'), product_type: 'gift_card', total: _orderTotal });
                _orderTotal = _orderTotal - _orderTotal;
            }
        });
    }
    //$('#gift_card_line_items li').each(function (index, li) {
    //    let gift_amt = parseFloat($(this).find("#gift_amt").text()) || 0.00;
    //    if (gift_amt > 0) itemsDetails.push({ order_item_id: parseInt($(li).data('orderitemid')), order_id: oid, product_name: $(li).data('pn'), product_type: 'gift_card', total: gift_amt });
    //});
    //State Recycling Fee
    $('#order_state_recycling_fee_line_items > tr').each(function (index, tr) {
        _amt = parseFloat($(tr).find(".TotalAmount").text()) || 0.00; _amt = mattotalCount > 0 ? (_amt / mattotalCount) : 0.00;
        _amt = _amt * matreturnCount; $('#order_state_recycling_fee_line_items').find(".RefundAmount").text(_amt.toFixed(2));
        if (_amt != 0) _itmes.push({ order_item_id: parseInt($(tr).data('orderitemid')), order_id: oid, product_name: $(tr).data('pname'), product_type: 'fee', total: -_amt });
    });
    //other fee
    $('#order_fee_line_items > tr').each(function (index, tr) {
        _amt = parseFloat($(tr).find("[name=txt_FeeAmt]").val()) || 0.00;
        if (_amt != 0) _itmes.push({ order_item_id: parseInt($(tr).data('orderitemid')), order_id: oid, product_name: $(tr).data('pname'), product_type: 'fee', total: -_amt });
    });
    //Add Shipping
    $('#order_shipping_line_items > tr').each(function (index, tr) {
        _amt = parseFloat($(tr).find(".RefundAmount").text()) || 0.00;
        if (_amt != 0) _itmes.push({ order_item_id: parseInt($(tr).data('orderitemid')), order_id: oid, product_name: '', product_type: 'shipping', total: -_amt });
    });
    //Add Tax
    _amt = parseFloat($('.btnRefundOk').data('tax')) || 0.00;
    //if (_amt != 0) _itmes.push({ order_item_id: parseInt($('#salesTaxTotal').data('orderitemid')) || 0, order_id: 0, product_name: '', product_type: 'tax', tax_amount: 0, total: -_amt });
    $('#order_final_total .tax-total').each(function (index, li) {
        _itmes.push({
            order_item_id: parseInt($(li).data('orderitemid')) || 0.00, order_id: 0, product_name: $(li).data('name'), meta_data: $(li).data('label'), product_type: 'tax', tax_amount: parseFloat($(li).data('percent')) || 0, total: 0
        });
    });
    return _itmes;
}
function saveCO() {
    let _items = createItemsList(), postMeta = createPostMeta(), postStatus = createPostStatus();
    let oid = parseInt($('#hfOrderNo').val()) || 0, pay_by = $('#lblOrderNo').data('pay_by').trim(), pay_gift = ($('#lblOrderNo').data('pay_gift') || ''),
        pay_giftCardAmount = ($('#giftCardTotal').data('gf_amt') || 0.00), net_total = (parseFloat($('.btnRefundOk').data('nettotal')) || 0.00), GiftCardRefundedAmount = ($('#giftCardTotal').data('gf_rf_amt') || 0.00),
        AvailableGiftCardAmount = pay_giftCardAmount - GiftCardRefundedAmount, orderTotal = $("#orderTotal").text().replace('$', '');
    if (_items.length <= 0) { swal('Alert!', 'Please enter refund amount / quantity.', "error"); return false; }
    //let obj = { order_id: oid, order_statsXML: JSON.stringify(postStatus), postmetaXML: JSON.stringify(postMeta), order_itemsXML: JSON.stringify(itemsDetails) };
    let obj = { order_id: oid, OrderPostMeta: postMeta, OrderProducts: _items, OrderPostStatus: postStatus };
    let gc_amt = _items.filter(item => item.product_type == 'gift_card').reduce(function (result, i) { return result + i.total; }, 0);
    postMeta.filter(item => item.meta_key == '_refund_giftcard_amount').forEach(function (i) { i.meta_value = gc_amt });
    //console.log(obj, gc_amt); return false;
    let totalPay = parseFloat(parseFloat(AvailableGiftCardAmount) + parseFloat(orderTotal)).toFixed(2);
    let bal = parseFloat($('#netPaymentTotal').text()) || 0.00;
    //console.log(totalPay, net_total, bal, AvailableGiftCardAmount);
    if (net_total > bal && AvailableGiftCardAmount == 0) { swal('Alert!', 'Order amount cannot refund more than ' + bal + '.', "error"); return false; }

    if (totalPay >= net_total) {
        $.ajax({
            type: "POST", contentType: "application/json; charset=utf-8",
            url: "/OrdersMySQL/SaveCustomerOrderRefund",
            data: JSON.stringify(obj), dataType: "json", beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                //data = JSON.parse(data); //
                console.log(data);
                if (data.status == true) {
                    if (pay_gift == '') {
                        if (pay_by == 'ppec_paypal') PaypalRefunds();
                        else if (pay_by == 'podium') PodiumPaymentRefunds();
                        else if (pay_by == 'authorize_net_cim_credit_card') AuthorizeNetPaymentRefunds();
                        else if (pay_by == 'affirm') AffirmPaymentRefunds();
                        else if (pay_by == 'amazon_payments_advanced') AmazonPayPaymentRefunds();
                        else '';
                    }
                    else if (AvailableGiftCardAmount >= 0 && pay_gift == 'gift_card') {
                        if (AvailableGiftCardAmount == 0) {
                            let total = net_total - AvailableGiftCardAmount;
                            $('.btnRefundOk').data('nettotal', total);
                            if (pay_by == 'ppec_paypal') PaypalRefunds();
                            else if (pay_by == 'podium') PodiumPaymentRefunds();
                            else if (pay_by == 'authorize_net_cim_credit_card') AuthorizeNetPaymentRefunds();
                            else if (pay_by == 'affirm') AffirmPaymentRefunds();
                            else if (pay_by == 'amazon_payments_advanced') AmazonPayPaymentRefunds();
                            else '';
                        }
                        else if (AvailableGiftCardAmount >= net_total) {

                            $('#lblOrderNo').data('giftCardAmount', net_total);
                            //GiftCardPaymentRefunds();
                        }
                        else if (AvailableGiftCardAmount > 0 && AvailableGiftCardAmount < net_total) {
                            let total = net_total - AvailableGiftCardAmount;
                            $('#lblOrderNo').data('giftCardAmount', AvailableGiftCardAmount);
                            //GiftCardPaymentRefunds();
                            //partial refund by gift card and gateway

                            $('.btnRefundOk').data('nettotal', total);
                            if (pay_by == 'ppec_paypal') PaypalRefunds();
                            else if (pay_by == 'podium') PodiumPaymentRefunds();
                            else if (pay_by == 'authorize_net_cim_credit_card') AuthorizeNetPaymentRefunds();
                            else if (pay_by == 'affirm') AffirmPaymentRefunds();
                            else if (pay_by == 'amazon_payments_advanced') AmazonPayPaymentRefunds();
                            else '';

                        }
                        else '';
                    }

                    $('.box-tools,.footer-finalbutton').empty().append('<button type="button" class="btn btn-danger btnRefundOrder"><i class="far fa-edit"></i> Refund</button>');
                    $('#order_line_items,#order_state_recycling_fee_line_items,#order_fee_line_items,#gift_card_line_items,#order_shipping_line_items,#order_refunds,#billCoupon,#billGiftCard,.refund-action').empty();
                    $('.billinfo').prop("disabled", true);
                    //swal('Success!', 'Order refunded successfully.', "success").then(function () { getOrderItemList(oid); getOrderNotesList(oid); $('.billinfo').prop("disabled", true); }, 50);
                    swal('Success!', 'Refunded order placed successfully.', "success").then(function () { window.location.href = window.location.origin + "/OrdersMySQL/OrdersHistory"; }, 50);
                }
                else { swal('Error', data.message, "error").then((result) => { return false; }); }
            },
            error: function (xhr, status, err) { $("#loader").hide(); alert(err); },
            complete: function () { $("#loader").hide(); isEdit(false); },
        });
    }
    else { swal('Error!', 'Refund amount can not be greater than total order amount', "error"); return false; }
    return false;
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Podium Payment Return ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function PodiumPaymentRefunds() {
    let oid = parseInt($('#hfOrderNo').val()) || 0;
    let invoice_no = $('#lblOrderNo').data('pay_id').trim(), payment_uid = $('#lblOrderNo').data('payment_uid').trim(), invoice_amt = (parseFloat($('.btnRefundOk').data('nettotal')) || 0.00);

    let opt_refund = { invoiceNumber: invoice_no, reason: 'requested_by_customer', locationUid: _locationUid, amount: invoice_amt * 100, uid: payment_uid, note: '' };
    //console.log(opt_inv);
    console.log('Start Podium Payment Processing...');
    let option = { strValue1: 'getToken' };
    swal.queue([{
        title: 'Podium Payment Processing.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
        onOpen: () => {
            swal.showLoading();
            $.get('/Setting/PodiumInvoiceRefund', opt_refund).then(response => {
                let option = { post_ID: oid, comment_content: 'Refund Issued for $' + invoice_amt.toFixed(2) + '. The refund should appear on your statement in 5 to 10 days.', is_customer_note: '' };
                $.post('/Orders/OrderNoteAdd', option).then(response => {
                    if (response.status) { $("#billModal").modal('hide'); $('.billinfo').prop("disabled", true); }
                }).catch(err => { console.log(err); swal.hideLoading(); swal('Error!', err, 'error'); });
            }).catch(err => { swal.hideLoading(); swal('Error!', err, 'error'); }).always(function () { swal.hideLoading(); });
        }
    }]);
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ PayPal Payment Return ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function PaypalRefunds() {
    if ($('#lblOrderNo').data('order_from') == 'shop_order_erp') PaypalInvoiceRefunds(); else PaypalPaymentRefunds();
}
function PaypalInvoiceRefunds() {
    let oid = parseInt($('#hfOrderNo').val()) || 0;
    let invoice_no = $('#lblOrderNo').data('pay_id').trim(), invoice_amt = (parseFloat($('.btnRefundOk').data('nettotal')) || 0.00);
    let date = new Date();
    let invoice_date = [date.getFullYear(), ('0' + (date.getMonth() + 1)).slice(-2), ('0' + date.getDate()).slice(-2)].join('-');
    let opt_refund = { method: "BANK_TRANSFER", refund_date: invoice_date, amount: { currency_code: "USD", value: invoice_amt } }

    let option = { strValue1: 'getToken' };
    swal.queue([{
        title: 'PayPal Payment Processing.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
        onOpen: () => {
            swal.showLoading();
            $.get('/Setting/GetPayPalToken', option).then(response => {
                let access_token = response.message;
                let create_url = paypal_baseurl + '/v2/invoicing/invoices/' + invoice_no + '/refunds';
                console.log(create_url, opt_refund);
                $.ajax({
                    type: 'post', url: create_url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt_refund),
                    beforeSend: function (xhr) { xhr.setRequestHeader("Accept", "application/json"); xhr.setRequestHeader("Authorization", "Bearer " + access_token); }
                }).then(response => {
                    console.log(response);
                    let option = { post_ID: oid, comment_content: 'PayPal Refund Issued for $' + invoice_amt + '. transaction ID = ' + response.refund_id, is_customer_note: '' };
                    $.post('/Orders/OrderNoteAdd', option).then(response => {
                        if (response.status) { $("#billModal").modal('hide'); $('.billinfo').prop("disabled", true); }
                    }).catch(err => { console.log(err); swal.hideLoading(); swal('Error!', err, 'error'); });
                }).catch(err => { console.log(err); swal.hideLoading(); swal('Error!', 'Something went wrong.', 'error'); }).always(function () { swal.hideLoading(); });
            });
        }
    }]);
}
function PaypalPaymentRefunds() {
    let oid = parseInt($('#hfOrderNo').val()) || 0;
    let invoice_no = $('#lblOrderNo').data('pay_id').trim(), invoice_amt = (parseFloat($('.btnRefundOk').data('nettotal')) || 0.00);
    let date = new Date();
    let invoice_date = [date.getFullYear(), ('0' + (date.getMonth() + 1)).slice(-2), ('0' + date.getDate()).slice(-2)].join('-');
    let opt_refund = { note_to_payer: "Defective product", invoice_id: 'INVOICE - ' + oid + '-' + Date.now(), amount: { currency_code: "USD", value: invoice_amt } }

    let option = { strValue1: 'getToken' };
    swal.queue([{
        title: 'PayPal Payment Processing.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
        onOpen: () => {
            swal.showLoading();
            $.get('/Setting/GetPayPalToken', option).then(response => {
                let access_token = response.message;
                let create_url = paypal_baseurl + '/v2/payments/captures/' + invoice_no + '/refund';
                console.log(create_url, opt_refund, access_token);
                $.ajax({
                    type: 'post', url: create_url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt_refund),
                    beforeSend: function (xhr) { xhr.setRequestHeader("Accept", "application/json"); xhr.setRequestHeader("Authorization", "Bearer " + access_token); }
                }).then(response => {
                    console.log(response);
                    let option = { post_ID: oid, comment_content: 'PayPal Refund Issued for $' + invoice_amt + '. transaction ID = ' + response.refund_id, is_customer_note: '' };
                    $.post('/Orders/OrderNoteAdd', option).then(response => {
                        if (response.status) { $("#billModal").modal('hide'); $('.billinfo').prop("disabled", true); }
                    }).catch(err => { console.log(err); swal.hideLoading(); swal('Error!', err, 'error'); });
                }).catch(err => { console.log(err); swal.hideLoading(); swal('Error!', 'Something went wrong.', 'error'); }).always(function () { swal.hideLoading(); });
            });
        }
    }]);
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Authorize.Net Payment Return ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function AuthorizeNetPaymentRefunds() {
    let order_total = parseFloat($('#orderTotal').text()) || 0.00, rfund_total = parseFloat($('.btnRefundOk').data('nettotal')) || 0.00;
    let oid = parseInt($('#hfOrderNo').val()) || 0, invoice_amt = rfund_total;
    let option = { order_id: oid, NetTotal: invoice_amt };
    swal.queue([{
        title: 'Authorize.Net Payment Processing.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
        onOpen: () => {
            swal.showLoading();
            $.post('/Orders/UpdateAuthorizeNetPaymentRefund', option).then(response => {
                console.log('Authorize.Net ', response);
                if (response.status) {
                    swal('Success!', 'Refunded order placed successfully.', "success").then(function () { window.location.href = window.location.origin + "/OrdersMySQL/OrdersHistory"; }, 50);
                }
            }).catch(err => { console.log(err); swal.hideLoading(); swal('Error!', err, 'error'); }).always(function () { swal.hideLoading(); });
        }
    }]);
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Affirm Payment Return ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function AffirmPaymentRefunds() {
    let oid = parseInt($('#hfOrderNo').val()) || 0;
    let invoice_amt = (parseFloat($('.btnRefundOk').data('nettotal')) || 0.00);
    let option = { order_id: oid, paypal_id: $('#lblOrderNo').data('pay_id').trim(), NetTotal: invoice_amt };
    swal.queue([{
        title: 'Monthly Payments (affirm) Payment Processing.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
        onOpen: () => {
            swal.showLoading();
            $.post('/Orders/UpdateAffirmPaymentRefund', option).then(response => {
                console.log('Monthly Payments (affirm) : ', response);
                if (response.status) {
                    swal('Success!', 'Refunded order placed successfully.', "success").then(function () { window.location.href = window.location.origin + "/OrdersMySQL/OrdersHistory"; }, 50);
                }
            }).catch(err => { console.log(err); swal.hideLoading(); swal('Error!', err, 'error'); }).always(function () { swal.hideLoading(); });
        }
    }]);
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Amazon Pay Payment Return ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function AmazonPayPaymentRefunds() {
    let oid = parseInt($('#hfOrderNo').val()) || 0, invoice_amt = (parseFloat($('.btnRefundOk').data('nettotal')) || 0.00);
    let option = { order_id: oid, NetTotal: invoice_amt };
    swal.queue([{
        title: 'Amazon Payment Processing.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
        onOpen: () => {
            swal.showLoading();
            $.post('/Orders/UpdateAmazonPaymentRefund', option).then(response => {
                console.log('Amazon Pay ', response);
                if (response.status) {
                    swal('Alert!', 'Order placed successfully.', "success"); getOrderNotesList(oid);
                }
            }).catch(err => { console.log(err); swal.hideLoading(); swal('Error!', err, 'error'); }).always(function () { swal.hideLoading(); });
        }
    }]);
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Gift Card Payment Return ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function GiftCardPaymentRefunds() {
    let oid = parseInt($('#hfOrderNo').val()) || 0, invoice_amt = (parseFloat($('#lblOrderNo').data('giftCardAmount')) || 0.00);
    let option = { order_id: oid, NetTotal: invoice_amt };
    swal.queue([{
        title: 'Gift Card Payment Processing.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
        onOpen: () => {
            swal.showLoading();
            $.post('/Orders/UpdateGitCardPaymentRefund', option).then(response => {
                console.log('Gift Card ', response);
                if (response.status) {
                    //swal('Success!', 'Refund amount added in gift card successfully.', "success"); getOrderNotesList(oid); getOrderInfo();
                    swal('Success!', 'Refunded order placed successfully.', "success").then(function () { window.location.href = window.location.origin + "/OrdersMySQL/OrdersHistory"; }, 50);
                }
            }).catch(err => { console.log(err); swal.hideLoading(); swal('Error!', err, 'error'); }).always(function () { swal.hideLoading(); });
        }
    }]);
}