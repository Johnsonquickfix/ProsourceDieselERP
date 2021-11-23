$(document).ready(function () {
    $(document).on("click", ".btnprintisalenvoice", function (t) {
        t.preventDefault();
        let divContents = $('#invoiceDetails').html();
        let a = window.open('', '', 'height=500, width=500');
        a.document.write('<html>');
        a.document.write('<body >');
        a.document.write(divContents);
        a.document.write('</body></html>');
        a.document.close();
        a.print();
        a.document.close();
    });
});
function PrintModalCheck(is_inv) {
    let inv_title = is_inv ? 'invoiceDetails' : 'Sale Purchase';
    let modalHtml = '<div class="modal-dialog modal-lg">';
    modalHtml += '<div class="modal-content">';
    //modalHtml += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button><h5 class="modal-title">' + inv_title + ' Preview</h5></div>';
    modalHtml += '<div class="modal-body no-padding modal-body-fixHeight"><div class="text-center"><h3>Loading...</h3></div></div>';
    modalHtml += '<div class="modal-footer"><button type="button" class="btn btn-success pull-left btnprintisalenvoice"><i class="fa fa-print"></i> Print</button ><button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button></div>';
    //modalHtml += '<div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $('<div class="modal in printable autoprint" id="PrintModalCheck" role="dialog" aria-hidden="true"></div>').html(modalHtml).modal({ backdrop: 'static', keyboard: false });
    //console.log('show');
}
function PurchaseSalesPrint(id, date) {
   // console.log(date);
    if (id > 0) {
        PrintModalCheck(false);
        var option = { strValue1: id };
        $.ajax({
            url: "/Orders/GetOrderProductList", type: "Post", data: option, beforeSend: function () { }, success: function (data) {
                // ajaxFunction('/Orders/GetOrderProductList', option, beforeSendFun, function (data) {
                let itemHtml = '', recyclingfeeHtml = '', feeHtml = '', shippingHtml = '', refundHtml = '', couponHtml = '', giftcardHtml = '';
                let Alltotal = 0.00, zQty = 0.00, zGAmt = 0.00, zTDiscount = 0.00, zTotalTax = 0.00, zShippingAmt = 0.00, zStateRecyclingAmt = 0.00, zFeeAmt = 0.00, zRefundAmt = 0.00, zGiftCardAmt = 0.00, zGiftCardRefundAmt = 0.00;
                $.each(data, function (i, row) {
                    let orderitemid = parseInt(row.order_item_id) || 0;
                    if (row.product_type == 'line_item') {
                        zQty = zQty + (parseFloat(row.quantity) || 0.00);
                        zGAmt = zGAmt + (parseFloat(row.total) || 0.00);
                        zTotalTax = zTotalTax + (parseFloat(row.tax_amount) || 0.00);
                    }
                    else if (row.product_type == 'coupon') {
                        let cou_amt = parseFloat(row.discount) || 0.00;
                        zTDiscount = zTDiscount + cou_amt;
                    }
                    else if (row.product_type == 'fee' && row.product_name == 'State Recycling Fee') {
                        zStateRecyclingAmt = zStateRecyclingAmt + (parseFloat(row.total) || 0.00);
                    }
                    else if (row.product_type == 'fee' && row.product_name != 'State Recycling Fee') {
                        zFeeAmt = zFeeAmt + (parseFloat(row.total) || 0.00);
                    }
                    else if (row.product_type == 'shipping') {
                        zShippingAmt = zShippingAmt + (parseFloat(row.total) || 0.00);
                    }
                    else if (row.product_type == 'gift_card') {
                        zGiftCardAmt = zGiftCardAmt + (parseFloat(row.total) || 0.00);
                    }
                });
                Alltotal = (zGAmt - zTDiscount + zShippingAmt + zTotalTax + zStateRecyclingAmt + zFeeAmt - zGiftCardAmt).toFixed(2);
               // console.log(data);
                try {
                    printcheck(id, Alltotal, data, zGAmt, zTDiscount, zTotalTax, zShippingAmt, zStateRecyclingAmt, zFeeAmt, zGiftCardAmt, date);
                }
                catch (error) { swal('Alert!', "something went wrong.", "error"); }
            },

            complete: function () { },
            error: function (xhr, status, err) { swal('Alert!', "something went wrong.", "error"); }, async: false
        });
    }
}
 
function printcheck(vid, Alltotal, result, zGAmt, zTDiscount, zTotalTax, zShippingAmt, zStateRecyclingAmt, zFeeAmt, zGiftCardAmt, date) {
    // let data = JSON.parse(result.data); //
   // console.log('hj');
    //console.log(id);
    //console.log(is_mail);

    var myHtml = '';
    myHtml += '<div class="invoiceDetails" style="margin:0;padding:0;color: #4f4f4f;font-family: Arial, sans-serif;">';
    myHtml += '<table id="invoiceDetails" role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">';
    myHtml += '<tr>';
    myHtml += '<td align="center" style="padding:0;">';
    myHtml += '<table role="presentation" style="width:602px;border-collapse:collapse;border-spacing:0;text-align:left;">';
    myHtml += '<tr>';
    myHtml += '<td align="center" style="padding: 10px 15px; background-color: #f8f8f8;">';
    myHtml += '<table role="presentation" style="width:100%;">';
    myHtml += '<tr>';
    myHtml += '<td><img alt="Layla Logo" src="https://quickfix16.com/wp-content/themes/layla-white/images/logo.png"></td>';
    myHtml += '<td align="right">';
    //myHtml += '<h1 style="font-size: 42px; margin:0px; font-style: italic; color: #4f4f4f">Thank you.</h1>';
    //myHtml += '<h2 style="font-size: 20px; margin:0px; color: #4f4f4f">Your order has been received</h2>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '</table>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '<tr class="thankyou-for-your-order">';
    myHtml += '<td class="order-detail-box" style="padding: 15px 10px 10px; border-bottom: 1px solid #c8c8c8;">';
    myHtml += '<table class="order_details order-detail-ul" role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">';
    myHtml += '<tr>';
    myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top; border-right: 1px solid #c8c8c8; padding-right:30px;"> Order number:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">' + vid + '</strong></td>';
    myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top; border-right: 1px solid #c8c8c8; padding-right:30px; padding-left:30px;"> Date:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">' + date +'</strong></td>';
    myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top; border-right: 1px solid #c8c8c8; padding-right:30px; padding-left:30px;"> Total:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">$' + Alltotal + '</strong></td>';
   
    myHtml += '</tr>';
    myHtml += '</table>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '<tr><td ><h2 style="font-size:20px; margin:25px 0px 10px 0px;">Order details</h2></td></tr>';
    myHtml += '<tr>';
    myHtml += '<td >';

    myHtml += '<table id="tblorder_details" class="shop_table order_details" style="border: 1px solid rgba(0, 0, 0, 0.1);margin: 0 -1px 24px 0;text-align: left;width: 100%; border-collapse: separate; border-radius: 5px;">';
    myHtml += '<thead><tr><th class=" product-name" style="font-weight: 700;padding: 9px 12px;">Product</th><th class="product-total" style="font-weight: 700;padding: 9px 12px;">Total</th></tr></thead>';
    myHtml += '<tbody>';

    $(result).each(function (index, tr) {
        if (tr.product_type == 'line_item') {

            myHtml += '<tr><td style="border-top: 1px solid rgba(0, 0, 0, 0.1);  padding: 9px 12px; vertical-align: middle;"><span>' + tr.product_name + '</span></td><td style="border-top: 1px solid rgba(0, 0, 0, 0.1);  padding: 9px 12px; vertical-align: middle;"><span>$' + tr.reg_price.toFixed(2)  + '</span></td></tr>';
        //myHtml += '<tr style="border-bottom: 1px solid #ddd;">';
        //    myHtml += '    <td style="border-top: 1px solid rgba(0, 0, 0, 0.1);  padding: 9px 12px; vertical-align: middle;">' + tr.product_name + '</td>';
        //myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">$' + tr.reg_price.toFixed(2) + '</td>';
        //myHtml += '</tr>';
        }
    });
    
    myHtml +='  </tbody > ';
    myHtml += '<tfoot>';
    myHtml += '<tr><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Subtotal:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;"><span>$' + zGAmt.toFixed(2) + '</span></td></tr>';
    myHtml += '<tr><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Discount:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">-<span>$' + zTDiscount.toFixed(2) + '</span></td></tr>';
    myHtml += '<tr><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Shipping:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">' + zShippingAmt.toFixed(2) + '</td></tr>';
    myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Tax:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">$' + zTotalTax.toFixed(2) + '</td></tr>';
    myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">State Recycling Fee:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">$' + zStateRecyclingAmt.toFixed(2) + '</td></tr>';
    myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Fee:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">$' + zFeeAmt.toFixed(2) + '</td></tr>';
    if (parseFloat(zGiftCardAmt > 0))
        myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Gift Card:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">$' + zGiftCardAmt.toFixed(2) + '</td></tr>';
    myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Total:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;"><span>$' + Alltotal + '</span></td></tr>';
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

    $('#PrintModalCheck .modal-body').empty().append(myHtml);
   
}

function number_format(number, decimals, decPoint, thousandsSep) { 
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
    const n = !isFinite(+number) ? 0 : +number
    const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    const sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
    const dec = (typeof decPoint === 'undefined') ? '.' : decPoint
    let s = ''
    const toFixedFix = function (n, prec) {
        if (('' + n).indexOf('e') === -1) {
            return +(Math.round(n + 'e+' + prec) + 'e-' + prec)
        } else {
            const arr = ('' + n).split('e')
            let sig = ''
            if (+arr[1] + prec > 0) {
                sig = '+'
            }
            return (+(Math.round(+arr[0] + 'e' + sig + (+arr[1] + prec)) + 'e-' + prec)).toFixed(prec)
        }
    }
    // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec).toString() : '' + Math.round(n)).split('.')
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
    }
    return s.join(dec)
}

