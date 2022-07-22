$(document).ready(function () {
    $(document).on("click", ".btnprintinvoice", function (t) {
        t.preventDefault();
        let divContents = $('#invoice').html();
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
function printmodal(is_inv) {
    let inv_title = is_inv ? 'Invoice' : 'Purchase Order';
    let modalHtml = '<div class="modal-dialog modal-lg">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button><h5 class="modal-title">' + inv_title + ' Preview</h5></div>';
    modalHtml += '<div class="modal-body no-padding modal-body-fixHeight"><div class="text-center"><h3>Loading...</h3></div></div>';
    modalHtml += '<div class="modal-footer"><button type="button" class="btn btn-success pull-left btnprintinvoice"><i class="fa fa-print"></i> Print</button ><button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button></div>';
    //modalHtml += '<div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $('<div class="modal in printable autoprint" id="PrintModal" role="dialog" aria-hidden="true"></div>').html(modalHtml).modal({ backdrop: 'static', keyboard: false });
    //console.log('show');
}
function printmodalBill(is_inv) {
    let inv_title = is_inv ? 'Bill' : 'Receive Order';
    let modalHtml = '<div class="modal-dialog modal-lg">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button><h5 class="modal-title">' + inv_title + ' Preview</h5></div>';
    modalHtml += '<div class="modal-body no-padding modal-body-fixHeight"><div class="text-center"><h3>Loading...</h3></div></div>';
    modalHtml += '<div class="modal-footer"><button type="button" class="btn btn-success pull-left btnprintinvoice"><i class="fa fa-print"></i> Print</button ><button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button></div>';
    //modalHtml += '<div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $('<div class="modal in printable autoprint" id="PrintModal" role="dialog" aria-hidden="true"></div>').html(modalHtml).modal({ backdrop: 'static', keyboard: false });
    //console.log('show');
}
function getPurchaseOrderPrint1(id, is_mail) {
    //if (id > 0) {
    //    var option = { strValue1: id };
    //    $.ajax({
    //        url: "/Reception/GetPurchaseOrder_Rec", type: "Get", beforeSend: function () { }, data: option,
    //        success: function (result) {
    //            try {
    //                printinvoice_Re(id, result, is_mail, false);
    //            }
    //            catch (error) { swal('Alert!', error, "error"); }
    //        },
    //        complete: function () { },
    //        error: function (xhr, status, err) { swal('Alert!', "something went wrong.", "error"); }, async: false
    //    });
    //}
    if (id > 0) {
        printmodal(false);
        var option = { strValue1: id };
        $.ajax({
            url: "/PurchaseOrder/GetPurchaseOrderPrint", type: "Get", beforeSend: function () { }, data: option,
            success: function (result) {
                try {
                    printinvoice_Receive(id, result, is_mail, false);
                }
                catch (error) { swal('Alert!', "something went wrong.", "error"); }
            },
            complete: function () { },
            error: function (xhr, status, err) { swal('Alert!', "something went wrong.", "error"); }, async: false
        });
    }
}

function printinvoice_Receive(id, result, is_mail, is_inv) {
    let data = JSON.parse(result.data); console.log(data['popd']);
    let inv_title = is_inv ? 'Invoice' : 'Purchase Order';

    let total_qty = 0, total_gm = 0.00, total_tax = 0.00, total_shamt = 0.00, total_discamt = 0.00, total_other = 0.00, paid_amt = 0.00; total_net = 0.00;

    let startingNumber = parseFloat(data['po'][0].PaymentTerm.match(/^-?\d+\.\d+|^-?\d+\b|^\d+(?=\w)/g)) || 0.00;

    let myHtml = '<table id="invoice" cellpadding="0" cellspacing="0" border="0" style="width:100%;">';
    myHtml += '<tr>';
    myHtml += '    <td align="center" style="padding:0;">';
    myHtml += '        <table class="container_table" cellpadding="0" cellspacing="0" border="0" style="border:2px solid #e6e6e6; width:995px">';
    myHtml += '            <tr>';
    myHtml += '                <td style="padding:15px;">';
    myHtml += '                    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-bottom: 1px solid #ddd;">';
    myHtml += '                        <tr>';
    myHtml += '                            <td style="padding:0; vertical-align: top;">';
    myHtml += '                                <img src="//laylaerp.com/Images/layla1-logo.png" alt="" width="95" height="41" class="logo-size"/>';
    myHtml += '                                <p style="margin:15px 0px;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">';
    myHtml += '                                    ' + result.add + ', <br>' + result.city + ', ' + result.state + ' ' + result.zip + ', <br>' + (result.country == "CA" ? "Canada" : result.country == "US" ? "United States" : result.country) + '.<br>';
    myHtml += '                                    Phone: ' + result.phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '<br />' + result.email + '<br />' + result.website;
    myHtml += '                                </p>';
    myHtml += '                            </td>';
    myHtml += '                            <td style="padding:0; vertical-align: top;" align="right">';
    myHtml += '                                <table cellpadding="0" cellspacing="0" border="0">';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td colspan="2" style="padding:0px 2.5px">';
    myHtml += '                                            <h2 class="pageCurl" style="color:#9da3a6;font-family: sans-serif;font-weight: 700;margin:0px 0px 8px 0px;font-size: 30px;">' + inv_title.toUpperCase() + '</h2>';
    myHtml += '                                        </td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">' + inv_title + ' No #:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + (is_inv ? data['po'][0].ref_ext : data['po'][0].ref) + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">' + inv_title + ' date:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].date_creation + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Reference:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].ref_supplier + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Expected Delivery Date:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].date_livraison + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                </table>';
    myHtml += '                            </td>';
    myHtml += '                        </tr >';
    myHtml += '                    </table >';
    myHtml += '                </td >';
    myHtml += '            </tr >';
    myHtml += '<tr>';
    myHtml += '<td style="padding:0px 15px 0px 15px;">';
    myHtml += '    <table cellpadding="0" cellspacing="0" border="0">';
    myHtml += '    <tr>';
    myHtml += '        <td style="padding:0;">';
    myHtml += '            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:0px 0px 5px 0px;;color:#2c2e2f;font-weight:200;">Vendor :</h3>';
    myHtml += '            <p class="recipientInfo" style="width: 225px;margin:0px 0px 15px 0px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">';
    myHtml += '               ' + data['po'][0].vendor_name + '<br>' + data['po'][0].address + '<br>' + data['po'][0].town + ', ' + data['po'][0].fk_state + ' ' + data['po'][0].zip + ', ' + (data['po'][0].fk_country == "CA" ? "Canada" : data['po'][0].fk_country == "US" ? "United States" : data['po'][0].fk_country) + '<br>' + data['po'][0].vendor_email;
    myHtml += '            </p>';
    myHtml += '        </td>';
    myHtml += '     </tr>';
    myHtml += '     </table>';
    myHtml += '</td >';
    myHtml += '</tr >';
    myHtml += '<tr>';
    myHtml += '<td style="padding:0px 15px 0px 15px;">';
    myHtml += '    <table class="product-tables" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">';
    myHtml += '        <thead class="itemdetailsheader" style="border: 1px solid #ddd;background-color: #f9f9f9;">';
    myHtml += '            <tr>';
    myHtml += '                <th style="width:12%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">Item#</th>';
    myHtml += '                <th style="width:48%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">Description</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">Quantity</th>';
    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">Price</th>';
    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Amount</th>';
    myHtml += '            </tr>';
    myHtml += '        </thead>';
    myHtml += '        <tbody class="itemdetailsbody">';
    $(data['pod']).each(function (index, tr) {
        if (tr.product_type == 0) {
            myHtml += '<tr style="border-bottom: 1px solid #ddd;">';
            myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">' + tr.product_sku + '</td>';
            myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">' + tr.description + '</td>';
            myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">' + number_format(tr.qty, 0, '.', ',') + '</td>';
            myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">$' + number_format(tr.subprice, 2, '.', ',') + '</td>';
            myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">$' + number_format(tr.total_ht, 2, '.', ',') + '</td>';
            myHtml += '</tr>';
            total_qty += tr.qty, total_gm += tr.total_ht, total_tax += tr.total_localtax1, total_shamt += tr.total_localtax2, total_discamt += tr.discount, total_net += tr.total_ttc;
        }
        else if (tr.product_type == 1) { total_shamt += tr.total_ttc, total_net += tr.total_ttc; }
        else if (tr.product_type == 2) { total_tax += tr.total_ttc, total_net += tr.total_ttc; }
        else if (tr.product_type == 3) { total_other += tr.total_ttc, total_net += tr.total_ttc; }
    });
    myHtml += '        </tbody>';
    myHtml += '    </table>';
    myHtml += '</td>';
    myHtml += '</tr >';
    myHtml += '<tr>';
    myHtml += '<td style="padding:0px 15px 15px 15px;">';
    myHtml += '    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">';
    myHtml += '        <tr>';
    myHtml += '            <td style="vertical-align: top; width:50%;padding:0px;">';
    myHtml += '                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">';
    myHtml += '                    <tr>';
    myHtml += '                        <td style="color:#4f4f4f;line-height:1.4;text-align:left;font-family:sans-serif;font-size:15px;padding:5px 12px;background:#f9f9f9;font-weight:600; border-bottom:1px solid #ddd;">Comments or Special Instructions</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:12px; color:#4f4f4f;line-height:1.4;">1.Payment term:' + data['po'][0].PaymentTerm + ', ' + data['po'][0].Balance + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:12px; color:#4f4f4f;line-height:1.4;">2.' + data['po'][0].location_incoterms + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td style="border-top: 1px solid #ddd;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">';
    myHtml += '                            <h4 class="headline" style="text-align:left;font-family:sans-serif;color: #555;font-size: 16px;line-height: 18px;margin-bottom: 5px;margin-top: 0px;vertical-align: middle;text-align: left;width: 100%;font-weight: 600;">Notes</h4>';
    myHtml += '                            <p class="notes" style="text-align:left;font-family:sans-serif;color: #4f4f4f;font-size: 12px;line-height: 18px;margin-bottom: 0px;margin-top: 0px;vertical-align: middle;text-align: left;width: 100%;font-weight: 400;">' + data['po'][0].note_public + '</p>';
    myHtml += '                        </td>';
    myHtml += '                    </tr>';

    myHtml += '                    <tr>';
    myHtml += '                        <td style="border-top: 1px solid #ddd;padding:0px;">';
    myHtml += '                        <table style="border-collapse: collapse;width: 100%; table-layout: fixed;font-family:sans-serif;font-size:12px;">';
    myHtml += '                            <thead style="border: 1px solid #ddd;background-color: #f9f9f9;">';
    myHtml += '                                <tr>';
    myHtml += '                                    <th style="text-align:left;width:20%;padding:2px 5px;">Payment</th>';
    myHtml += '                                    <th style="text-align:left;width:25%;padding:2px 5px;">Amount</th>';
    myHtml += '                                    <th style="text-align:left;width:30%;padding:2px 5px;">Type</th>';
    myHtml += '                                    <th style="text-align:left;width:25%;padding:2px 5px;">Num</th>';
    myHtml += '                                </tr>';
    myHtml += '                            </thead>';
    myHtml += '                            <tbody style="border:1px solid #ddd;">';
    //  console.log(data['popd'][0]);
    $(data['popd']).each(function (index, trpd) {
        myHtml += '<tr style="border-bottom: 1px solid #ddd;">';
        myHtml += '    <td style="width:20%;padding:2px 5px;">' + trpd.datec + '</td>';
        myHtml += '    <td style="text-align:right;width:20%;padding:2px 5px;">$' + number_format(trpd.amount, 2, '.', ',') + '</td>';
        myHtml += '    <td style="width:20%;padding:2px 5px;">' + trpd.paymenttype + '</td>';
        myHtml += '    <td style="width:20%;padding:2px 5px;">' + trpd.num_payment + '</td>';
        myHtml += '</tr>';
        paid_amt += trpd.amount
    });
    myHtml += '                            </tbody>';
    myHtml += '                        </table>';
    myHtml += '                        </td>';
    myHtml += '                    </tr>';

    myHtml += '                </table>';
    myHtml += '            </td>';
    myHtml += '            <td style="vertical-align: top; width:50%; padding:0px;">';
    myHtml += '                <table cellpadding="0" cellspacing="0" style="border:1px solid #ddd;border-top:0px;border-collapse: collapse;width: 100%; table-layout: fixed;">';
    myHtml += '                    <tr>';
    myHtml += '                        <td class="text-right" style="width:40       %;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">' + number_format(total_qty, 0, '.', ',') + '</td>';
    myHtml += '                        <td class="text-right" style="border-right: 1px solid #ddd; width: 30%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Subtotal</td>';
    myHtml += '                        <td class="text-right" style="width: 30%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_gm, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Item discounts</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">-$' + number_format(total_discamt, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Amount tax</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_tax, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Shipping</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_shamt, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Other Fee</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_other, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Total</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_net, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Payment Terms (' + startingNumber + '%)</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format((total_net * (startingNumber / 100)), 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Paid</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(paid_amt, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Remaining Unpaid</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format((total_net - paid_amt), 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                </table>';
    myHtml += '            </td>';
    myHtml += '        </tr>';
    myHtml += '    </table>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '</table > ';
    myHtml += '</td > ';
    myHtml += '</tr > ';
    myHtml += '</table >';

    $('#PrintModal .modal-body').empty().append(myHtml);
    //let opt = { strValue1: data['po'][0].vendor_email, strValue2: data['po'][0].ref, strValue3: myHtml }
    //if (opt.strValue1.length > 5 && is_mail) {
    //    $.ajax({
    //        type: "POST", url: '/PurchaseOrder/SendMailInvoice', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
    //        success: function (result) { console.log(result); },
    //        error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
    //        complete: function () { }, async: false
    //    });
    //}
}

function printinvoice_Re(id, result, is_mail, is_inv) {
    let data = JSON.parse(result.data); //console.log(data);
    let inv_title = is_inv ? 'Invoice' : 'Purchase Order';
    var modalHtml = '';
    modalHtml += '<div class="modal-dialog modal-lg">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button><h5 class="modal-title">' + inv_title + ' Preview</h5></div>';
    modalHtml += '<div class="modal-body no-padding"></div>';
    modalHtml += '<div class="modal-footer"><button type="button" class="btn btn-success pull-left btnprintinvoice"><i class="fa fa-print"></i> Print</button ><button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button></div>';
    //modalHtml += '<div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $('<div class="modal in printable autoprint" id="PrintModal" role="dialog" aria-hidden="true"></div>').html(modalHtml).modal({ backdrop: 'static', keyboard: false });
    let total_qty = 0, total_gm = 0.00, total_tax = 0.00, total_shamt = 0.00, total_discamt = 0.00, total_net = 0.00;

    let startingNumber = parseFloat(data['po'][0].PaymentTerm.match(/^-?\d+\.\d+|^-?\d+\b|^\d+(?=\w)/g)) || 0.00;
    var myHtml = '';
    myHtml += '<div class="invoice">';
    myHtml += '<div class="section invoiceDetails">';
    myHtml += '        <div class="row invoiceInfo" style="font-size: 14px;">';
    myHtml += '            <div class="col-xs-12">';
    myHtml += '                <div class="row" style="padding:0px 15px;margin-bottom:10px;display: flex;">';
    myHtml += '                    <div id="printPreview" style="width: 41.66666667%;">';
    myHtml += '                        <div class="businessLogo"><img src="//laylaerp.com/Images/layla1-logo.png" alt="" id="logoUrl" style="width: 90px;" /></div>';
    myHtml += '                        <div class="businfobox">' + result.add + '<br>' + result.city + ', ' + result.state + ' ' + result.zip + ', <br>' + (result.country == "CA" ? "Canada" : result.country == "US" ? "United States" : result.country) + '</div>';
    myHtml += '                        <div class="businfobox">Phone: ' + result.phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '<br/>' + result.email + '<br />' + result.website + '<br /></div>';
    myHtml += '                    </div>';
    myHtml += '                    <div style="width:58.33333333%; float:right;">';
    myHtml += '                        <table style="width: 100%;">';
    myHtml += '                            <tr>';
    myHtml += '                                <td colspan="2" style="padding-left:3px;text-align:center;"><div style="color:#9da3a6;font-weight:700;font-size:30px;width:100%;">' + inv_title.toUpperCase() + '</div></td>';
    myHtml += '                            </tr>';
    myHtml += '                            <tr>';
    myHtml += '                                <td style="text-align:right;padding-right:10px;width:58.33333333%;font-size:14px;">' + inv_title + ' No. #:</td>';
    myHtml += '                                <td style="padding-left:3px;font-size:14px;">' + (is_inv ? data['po'][0].ref_ext : data['po'][0].ref) + '</td>';
    myHtml += '                            </tr>';
    myHtml += '                            <tr>';
    myHtml += '                                <td style="text-align:right;padding-right:10px;width:58.33333333%;font-size:14px;">' + inv_title + ' date:</td>';
    myHtml += '                                <td style="padding-left:3px;font-size:14px;">' + data['po'][0].date_creation + '</td>';
    myHtml += '                            </tr>';
    myHtml += '                            <tr>';
    myHtml += '                                <td style="text-align:right;padding-right:10px;width:58.33333333%;font-size:14px;">Reference:</td>';
    myHtml += '                                <td style="padding-left:3px;font-size:14px;">' + data['po'][0].ref_supplier + '</td>';
    myHtml += '                            </tr>';
    myHtml += '                            <tr>';
    myHtml += '                                <td style="text-align:right;padding-right:10px;width:58.33333333%;font-size:14px;">Planned date of delivery:</td>';
    myHtml += '                                <td style="padding-left:3px;font-size:14px;">' + data['po'][0].date_livraison + '</td>';
    myHtml += '                            </tr>';
    myHtml += '                        </table>';
    myHtml += '                    </div>';
    myHtml += '                </div>';
    myHtml += '                <div style="border-bottom: 1px solid #ddd;"></div>';
    myHtml += '                <div class="row" style="padding:0px 15px;margin-bottom: 10px;">';
    myHtml += '                    <div class="headline"><h3>Bill To:</h3></div>';
    myHtml += '                    <div>' + data['po'][0].vendor_name + '<br/>' + data['po'][0].address + '<br/>' + data['po'][0].town + ', ' + data['po'][0].fk_state + ' ' + data['po'][0].zip + ' ' + (data['po'][0].fk_country == "CA" ? "Canada" : data['po'][0].fk_country == "US" ? "United States" : data['po'][0].fk_country);
    myHtml += '                    <div>' + data['po'][0].vendor_email + '</div>';
    myHtml += '                </div>';
    myHtml += '            </div>';
    myHtml += '            <div class="row" style="padding-right:15px;padding-left:15px;">';
    myHtml += '                <table style="width: 100%; table-layout: fixed;font-size: 14px;">';
    myHtml += '                    <thead style="border: 1px solid #ddd;background-color: #f9f9f9;font-weight: 700;">';
    myHtml += '                        <tr>';
    myHtml += '                            <th style="padding:5px 15px;">Item#</th>';
    myHtml += '                            <th style="padding:5px 15px;"><div class="wrap">Description</div></th>';
    myHtml += '                            <th style="padding:5px 15px;text-align:right;">Quantity</th>';
    myHtml += '                            <th style="padding:5px 15px;text-align:right;">Price</th>';
    myHtml += '                            <th style="padding:5px 15px;text-align:right;">Amount</th>';
    myHtml += '                        </tr>';
    myHtml += '                    </thead>';
    myHtml += '                    <tbody>';
    $(data['pod']).each(function (index, tr) {
        myHtml += '<tr style="border-bottom: 1px solid #ddd;">';
        myHtml += '    <td style="padding:5px 15px;">' + tr.product_sku + '</td>';
        myHtml += '    <td style="padding:5px 15px;"><div class="wrap">' + tr.description + '</div></td>';
        myHtml += '    <td style="padding:5px 15px;text-align:right;">' + tr.qty.toFixed(0) + '</td>';
        myHtml += '    <td style="padding:5px 15px;text-align:right;">' + tr.subprice.toFixed(2) + '</td>';
        myHtml += '    <td style="padding:5px 15px;text-align:right;">' + tr.total_ht.toFixed(2) + '</td>';
        myHtml += '</tr>';
        total_qty += tr.qty, total_gm += tr.total_ht, total_tax += tr.total_localtax1, total_shamt += tr.total_localtax2, total_discamt += tr.discount, total_net += tr.total_ttc;
    });
    myHtml += '                    </tbody>';
    myHtml += '                </table>';
    myHtml += '            </div>';
    myHtml += '            <div class="row" style="padding-right:15px;padding-left:15px;">';
    myHtml += '                <table style="width: 100%;">';
    myHtml += '                    <tbody>';
    myHtml += '                        <tr>';
    myHtml += '                            <td style="vertical-align: top; width:50%;font-size: 14px;">';
    myHtml += '                                <table style="width: 100%;">';
    myHtml += '                                    <thead style="border: 1px solid #ddd;background-color:#f9f9f9;font-weight:700;"><tr><th style="padding:5px 15px;">Comments or Special Instructions</th></tr></thead>';
    myHtml += '                                    <tr><td style="padding:5px 15px;">1. Payment terms: ' + data['po'][0].PaymentTerm + ', ' + data['po'][0].Balance + '</td></tr>';
    myHtml += '                                    <tr><td style="padding:5px 15px;">2. ' + data['po'][0].location_incoterms + '</td></tr>';
    myHtml += '                                </table>';
    myHtml += '                            </td>';
    myHtml += '                            <td style="vertical-align: top; width:50%;font-size: 14px;">';
    myHtml += '                                <table style="width: 100%;">';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="width: 60%;border-left: 1px solid #ddd;border-right: 1px solid #ddd;text-align:right;padding-right: 15px;font-size: 13px;">Subtotal (' + total_qty.toFixed(0) + ')</td>';
    myHtml += '                                        <td style="width: 40%;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:15px;text-align:right;border-right: 1px solid #ddd;font-size: 13px;">$' + total_gm.toFixed(2) + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="width: 60%;border-left: 1px solid #ddd;border-right: 1px solid #ddd;text-align:right;padding-right: 15px;font-size: 13px;">Item discounts</td>';
    myHtml += '                                        <td style="width: 40%;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:15px;text-align:right;border-right: 1px solid #ddd;font-size: 13px;">-$' + total_discamt.toFixed(2) + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="width: 60%;border-left: 1px solid #ddd;border-right: 1px solid #ddd;text-align:right;padding-right: 15px;font-size: 13px;">Tax</td>';
    myHtml += '                                        <td style="width: 40%;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:15px;text-align:right;border-right: 1px solid #ddd;font-size: 13px;">$' + total_tax.toFixed(2) + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="width: 60%;border-left: 1px solid #ddd;border-right: 1px solid #ddd;text-align:right;padding-right: 15px;font-size: 13px;">Shipping</td>';
    myHtml += '                                        <td style="width: 40%;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:15px;text-align:right;border-right: 1px solid #ddd;font-size: 13px;">$' + total_shamt.toFixed(2) + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr style="border-top: 1px solid #ddd;border-bottom:1px solid #ddd;background-color:#f9f9f9;font-weight:700;">';
    myHtml += '                                        <th style="width: 60%;border-left: 1px solid #ddd;border-right: 1px solid #ddd;text-align:right;padding-right: 15px;">Total</th>';
    myHtml += '                                        <th style="width: 40%;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:15px;text-align:right;border-right: 1px solid #ddd;">$' + total_net.toFixed(2) + '</th>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr style="border-top: 1px solid #ddd;border-bottom:1px solid #ddd;background-color:#f9f9f9;font-weight:700;">';
    myHtml += '                                        <th style="width: 60%;border-left: 1px solid #ddd;border-right: 1px solid #ddd;text-align:right;padding-right: 15px;">Deposit (' + startingNumber + '%)</th>';
    myHtml += '                                        <th style="width: 40%;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:15px;text-align:right;border-right: 1px solid #ddd;">$' + (total_net * (startingNumber / 100)).toFixed(2) + '</th>';
    myHtml += '                                    </tr>';
    myHtml += '                                </table>';
    myHtml += '                            </td>';
    myHtml += '                        </tr>';
    myHtml += '                    </tbody>';
    myHtml += '                </table>';
    myHtml += '             </div>';
    myHtml += '             <div style="margin-top: 15px;"></div>';
    myHtml += '         </div>';
    myHtml += '     </div>';
    myHtml += '</div>';
    myHtml += '</div>';
    $('#PrintModal .modal-body').append(myHtml);
    //let opt = { strValue1: data['po'][0].vendor_email, strValue2: data['po'][0].ref, strValue3: myHtml }
    //if (opt.strValue1.length > 5 && is_mail) {
    //    $.ajax({
    //        type: "POST", url: '/PurchaseOrder/SendMailInvoice', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
    //        success: function (result) { console.log(result); },
    //        error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
    //        complete: function () { }, async: false
    //    });
    //}
}


function number_format(number, decimals, decPoint, thousandsSep) {
    //   example 1: number_format(1234.56)
    //   returns 1: '1,235'
    //   example 2: number_format(1234.56, 2, ',', ' ')
    //   returns 2: '1 234,56'
    //   example 3: number_format(1234.5678, 2, '.', '')
    //   returns 3: '1234.57'
    //   example 4: number_format(67, 2, ',', '.')
    //   returns 4: '67,00'
    //   example 5: number_format(1000)
    //   returns 5: '1,000'
    //   example 6: number_format(67.311, 2)
    //   returns 6: '67.31'
    //   example 7: number_format(1000.55, 1)
    //   returns 7: '1,000.6'
    //   example 8: number_format(67000, 5, ',', '.')
    //   returns 8: '67.000,00000'
    //   example 9: number_format(0.9, 0)
    //   returns 9: '1'
    //  example 10: number_format('1.20', 2)
    //  returns 10: '1.20'
    //  example 11: number_format('1.20', 4)
    //  returns 11: '1.2000'
    //  example 12: number_format('1.2000', 3)
    //  returns 12: '1.200'
    //  example 13: number_format('1 000,50', 2, '.', ' ')
    //  returns 13: '100 050.00'
    //  example 14: number_format(1e-8, 8, '.', '')
    //  returns 14: '0.00000001'
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

//function printinvoice(id, result, is_mail, is_inv) {
//    let data = JSON.parse(result.data); //console.log(data);
//    let inv_title = is_inv ? 'Bill' : 'Purchase Order';
//    var modalHtml = '';
//    modalHtml += '<div class="modal-dialog modal-lg">';
//    modalHtml += '<div class="modal-content">';
//    modalHtml += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button><h5 class="modal-title">' + inv_title + ' Preview</h5></div>';
//    modalHtml += '<div class="modal-body no-padding"></div>';
//    modalHtml += '<div class="modal-footer"><button type="button" class="btn btn-success pull-left btnprintinvoice"><i class="fa fa-print"></i> Print</button ><button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button></div>';
//    //modalHtml += '<div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button></div>';
//    modalHtml += '</div>';
//    modalHtml += '</div>';
//    $('<div class="modal in printable autoprint" id="PrintModal" role="dialog" aria-hidden="true"></div>').html(modalHtml).modal({ backdrop: 'static', keyboard: false });
//    let total_qty = 0, total_gm = 0.00, total_tax = 0.00, total_shamt = 0.00, total_discamt = 0.00, total_net = 0.00;

//    let startingNumber = parseFloat(data['po'][0].PaymentTerm.match(/^-?\d+\.\d+|^-?\d+\b|^\d+(?=\w)/g)) || 0.00;
//    var myHtml = '';
//    myHtml += '<div class="invoice">';
//    myHtml += '<div class="section invoiceDetails">';
//    myHtml += '        <div class="row invoiceInfo" style="font-size: 14px;">';
//    myHtml += '            <div class="col-xs-12">';
//    myHtml += '                <div class="row" style="padding:0px 15px;margin-bottom:10px;display: flex;">';
//    myHtml += '                    <div id="printPreview" style="width: 41.66666667%;">';
//    myHtml += '                        <div class="businessLogo"><img src="//laylaerp.com/Images/layla1-logo.png" alt="" id="logoUrl" style="width: 90px;" /></div>';
//    myHtml += '                        <div class="businfobox">' + result.add + '<br>' + result.city + ', ' + result.state + ' ' + result.zip + ', <br>' + (result.country == "CA" ? "Canada" : result.country == "US" ? "United States" : result.country) + '</div>';
//    myHtml += '                        <div class="businfobox">Phone: 001 ' + result.phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '<br/>' + result.email + '<br />' + result.website + '<br /></div>';
//    myHtml += '                    </div>';
//    myHtml += '                    <div style="width:58.33333333%; float:right;">';
//    myHtml += '                        <table style="width: 100%;">';
//    myHtml += '                            <tr>';
//    myHtml += '                                <td colspan="2" style="padding-left:3px;text-align:center;"><div style="color:#9da3a6;font-weight:700;font-size:30px;width:100%;">' + inv_title.toUpperCase() + '</div></td>';
//    myHtml += '                            </tr>';
//    myHtml += '                            <tr>';
//    myHtml += '                                <td style="text-align:right;padding-right:10px;width:58.33333333%;font-size:14px;">' + inv_title + ' No. #:</td>';
//    myHtml += '                                <td style="padding-left:3px;font-size:14px;">' + (is_inv ? data['po'][0].ref_ext : data['po'][0].ref) + '</td>';
//    myHtml += '                            </tr>';
//    myHtml += '                            <tr>';
//    myHtml += '                                <td style="text-align:right;padding-right:10px;width:58.33333333%;font-size:14px;">' + inv_title + ' date:</td>';
//    myHtml += '                                <td style="padding-left:3px;font-size:14px;">' + data['po'][0].date_creation + '</td>';
//    myHtml += '                            </tr>';
//    myHtml += '                            <tr>';
//    myHtml += '                                <td style="text-align:right;padding-right:10px;width:58.33333333%;font-size:14px;">Reference:</td>';
//    myHtml += '                                <td style="padding-left:3px;font-size:14px;">' + data['po'][0].ref_supplier + '</td>';
//    myHtml += '                            </tr>';
//    myHtml += '                            <tr>';
//    myHtml += '                                <td style="text-align:right;padding-right:10px;width:58.33333333%;font-size:14px;">Planned date of delivery:</td>';
//    myHtml += '                                <td style="padding-left:3px;font-size:14px;">' + data['po'][0].date_livraison + '</td>';
//    myHtml += '                            </tr>';
//    myHtml += '                        </table>';
//    myHtml += '                    </div>';
//    myHtml += '                </div>';
//    myHtml += '                <div style="border-bottom: 1px solid #ddd;"></div>';
//    myHtml += '                <div class="row" style="padding:0px 15px;margin-bottom: 10px;">';
//    myHtml += '                    <div class="headline"><h3>Bill To:</h3></div>';
//    myHtml += '                    <div>' + data['po'][0].vendor_name + '<br/>' + data['po'][0].address + '<br/>' + data['po'][0].town + ', ' + data['po'][0].fk_state + ' ' + data['po'][0].zip + ' ' + (data['po'][0].fk_country == "CA" ? "Canada" : data['po'][0].fk_country == "US" ? "United States" : data['po'][0].fk_country);
//    myHtml += '                    <div>' + data['po'][0].vendor_email + '</div>';
//    myHtml += '                </div>';
//    myHtml += '            </div>';
//    myHtml += '            <div class="row" style="padding-right:15px;padding-left:15px;">';
//    myHtml += '                <table style="width: 100%; table-layout: fixed;font-size: 14px;">';
//    myHtml += '                    <thead style="border: 1px solid #ddd;background-color: #f9f9f9;font-weight: 700;">';
//    myHtml += '                        <tr>';
//    myHtml += '                            <th style="padding:5px 15px;">Item#</th>';
//    myHtml += '                            <th style="padding:5px 15px;"><div class="wrap">Description</div></th>';
//    myHtml += '                            <th style="padding:5px 15px;text-align:right;">Quantity</th>';
//    myHtml += '                            <th style="padding:5px 15px;text-align:right;">Price</th>';
//    myHtml += '                            <th style="padding:5px 15px;text-align:right;">Amount</th>';
//    myHtml += '                        </tr>';
//    myHtml += '                    </thead>';
//    myHtml += '                    <tbody>';
//    $(data['pod']).each(function (index, tr) {
//        myHtml += '<tr style="border-bottom: 1px solid #ddd;">';
//        myHtml += '    <td style="padding:5px 15px;">' + tr.product_sku + '</td>';
//        myHtml += '    <td style="padding:5px 15px;"><div class="wrap">' + tr.description + '</div></td>';
//        myHtml += '    <td style="padding:5px 15px;text-align:right;">' + tr.qty.toFixed(0) + '</td>';
//        myHtml += '    <td style="padding:5px 15px;text-align:right;">' + tr.subprice.toFixed(2) + '</td>';
//        myHtml += '    <td style="padding:5px 15px;text-align:right;">' + tr.total_ht.toFixed(2) + '</td>';
//        myHtml += '</tr>';
//        total_qty += tr.qty, total_gm += tr.total_ht, total_tax += tr.total_localtax1, total_shamt += tr.total_localtax2, total_discamt += tr.discount, total_net += tr.total_ttc;
//    });
//    myHtml += '                    </tbody>';
//    myHtml += '                </table>';
//    myHtml += '            </div>';
//    myHtml += '            <div class="row" style="padding-right:15px;padding-left:15px;">';
//    myHtml += '                <table style="width: 100%;">';
//    myHtml += '                    <tbody>';
//    myHtml += '                        <tr>';
//    myHtml += '                            <td style="vertical-align: top; width:50%;font-size: 14px;">';
//    myHtml += '                                <table style="width: 100%;">';
//    myHtml += '                                    <thead style="border: 1px solid #ddd;background-color:#f9f9f9;font-weight:700;"><tr><th style="padding:5px 15px;">Comments or Special Instructions</th></tr></thead>';
//    myHtml += '                                    <tr><td style="padding:5px 15px;">1. Payment terms: ' + data['po'][0].PaymentTerm + ', ' + data['po'][0].Balance + '</td></tr>';
//    myHtml += '                                    <tr><td style="padding:5px 15px;">2. ' + data['po'][0].location_incoterms + '</td></tr>';
//    myHtml += '                                </table>';
//    myHtml += '                            </td>';
//    myHtml += '                            <td style="vertical-align: top; width:50%;font-size: 14px;">';
//    myHtml += '                                <table style="width: 100%;">';
//    myHtml += '                                    <tr>';
//    myHtml += '                                        <td style="width: 60%;border-left: 1px solid #ddd;border-right: 1px solid #ddd;text-align:right;padding-right: 15px;font-size: 13px;">Subtotal (' + total_qty.toFixed(0) + ')</td>';
//    myHtml += '                                        <td style="width: 40%;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:15px;text-align:right;border-right: 1px solid #ddd;font-size: 13px;">$' + total_gm.toFixed(2) + '</td>';
//    myHtml += '                                    </tr>';
//    myHtml += '                                    <tr>';
//    myHtml += '                                        <td style="width: 60%;border-left: 1px solid #ddd;border-right: 1px solid #ddd;text-align:right;padding-right: 15px;font-size: 13px;">Item discounts</td>';
//    myHtml += '                                        <td style="width: 40%;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:15px;text-align:right;border-right: 1px solid #ddd;font-size: 13px;">-$' + total_discamt.toFixed(2) + '</td>';
//    myHtml += '                                    </tr>';
//    myHtml += '                                    <tr>';
//    myHtml += '                                        <td style="width: 60%;border-left: 1px solid #ddd;border-right: 1px solid #ddd;text-align:right;padding-right: 15px;font-size: 13px;">Tax</td>';
//    myHtml += '                                        <td style="width: 40%;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:15px;text-align:right;border-right: 1px solid #ddd;font-size: 13px;">$' + total_tax.toFixed(2) + '</td>';
//    myHtml += '                                    </tr>';
//    myHtml += '                                    <tr>';
//    myHtml += '                                        <td style="width: 60%;border-left: 1px solid #ddd;border-right: 1px solid #ddd;text-align:right;padding-right: 15px;font-size: 13px;">Shipping</td>';
//    myHtml += '                                        <td style="width: 40%;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:15px;text-align:right;border-right: 1px solid #ddd;font-size: 13px;">$' + total_shamt.toFixed(2) + '</td>';
//    myHtml += '                                    </tr>';
//    myHtml += '                                    <tr style="border-top: 1px solid #ddd;border-bottom:1px solid #ddd;background-color:#f9f9f9;font-weight:700;">';
//    myHtml += '                                        <th style="width: 60%;border-left: 1px solid #ddd;border-right: 1px solid #ddd;text-align:right;padding-right: 15px;">Total</th>';
//    myHtml += '                                        <th style="width: 40%;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:15px;text-align:right;border-right: 1px solid #ddd;">$' + total_net.toFixed(2) + '</th>';
//    myHtml += '                                    </tr>';
//    myHtml += '                                    <tr style="border-top: 1px solid #ddd;border-bottom:1px solid #ddd;background-color:#f9f9f9;font-weight:700;">';
//    myHtml += '                                        <th style="width: 60%;border-left: 1px solid #ddd;border-right: 1px solid #ddd;text-align:right;padding-right: 15px;">Deposit (' + startingNumber + '%)</th>';
//    myHtml += '                                        <th style="width: 40%;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:15px;text-align:right;border-right: 1px solid #ddd;">$' + (total_net * (startingNumber / 100)).toFixed(2) + '</th>';
//    myHtml += '                                    </tr>';
//    myHtml += '                                </table>';
//    myHtml += '                            </td>';
//    myHtml += '                        </tr>';
//    myHtml += '                    </tbody>';
//    myHtml += '                </table>';
//    myHtml += '             </div>';
//    myHtml += '             <div style="margin-top: 15px;"></div>';
//    myHtml += '         </div>';
//    myHtml += '     </div>';
//    myHtml += '</div>';
//    myHtml += '</div>';
//    $('#PrintModal .modal-body').append(myHtml);
//    //let opt = { strValue1: data['po'][0].vendor_email, strValue2: data['po'][0].ref, strValue3: myHtml }
//    //if (opt.strValue1.length > 5 && is_mail) {
//    //    $.ajax({
//    //        type: "POST", url: '/PurchaseOrder/SendMailInvoice', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
//    //        success: function (result) { console.log(result); },
//    //        error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
//    //        complete: function () { }, async: false
//    //    });
//    //}
//}

function getInvoicePrintnew(id) {
    //if (id > 0) {
    //    var option = { strValue1: id };
    //    $.ajax({
    //        url: "/Reception/GetPurchaseOrderPrint", type: "Get", beforeSend: function () { }, data: option,
    //        success: function (result) {
    //            try {
    //                printinvoice(id, result, false, true);
    //            }
    //            catch (error) { swal('Alert!', "something went wrong.", "error"); }
    //        },
    //        complete: function () { },
    //        error: function (xhr, status, err) { swal('Alert!', "something went wrong.", "error"); }, async: false
    //    });
    //}
    if (id > 0) {
        printmodalBill(true);
        var option = { strValue1: id };
        $.ajax({
            url: "/Reception/GetPurchaseOrderPrint", type: "Get", beforeSend: function () { }, data: option,
            success: function (result) {
                try {
                    printinvoice_Bill(id, result, false, true);
                }
                catch (error) { swal('Alert!', "something went wrong.", "error"); }
            },
            complete: function () { },
            error: function (xhr, status, err) { swal('Alert!', "something went wrong.", "error"); }, async: false
        });
    }
}

function printinvoice_Bill(id, result, is_mail, is_inv) {
    let data = JSON.parse(result.data);
    let pono = "";
    try {
        pono = data['podvadd'][0].pono;
    }
    catch (e) {
        pono = '';
    }
    console.log(pono);
    let inv_title = is_inv ? 'Bill' : 'Receive Order';
    let inv_titleNew = 'Commercial Invoice';
    let total_qty = 0, total_gm = 0.00, total_tax = 0.00, total_shamt = 0.00, total_discamt = 0.00, total_other = 0.00, paid_amt = 0.00; total_net = 0.00;

    let startingNumber = parseFloat(data['po'][0].PaymentTerm.match(/^-?\d+\.\d+|^-?\d+\b|^\d+(?=\w)/g)) || 0.00;

    let myHtml = '<table id="invoice" cellpadding="0" cellspacing="0" border="0" style="width:100%;">';
    myHtml += '<tr>';
    myHtml += '    <td align="center" style="padding:0;">';
    myHtml += '        <table class="container_table" cellpadding="0" cellspacing="0" border="0" style="border:2px solid #e6e6e6; width:995px">';
    myHtml += '            <tr>';
    myHtml += '                <td style="padding:15px;">';
    myHtml += '                    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-bottom: 1px solid #ddd;">';
    myHtml += '                        <tr>';
    myHtml += '                            <td style="padding:; vertical-align: top;">';

    myHtml += '            <p class="recipientInfo" style="width: 225px;margin:0px 0px 15px 0px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">';
    myHtml += '               ' + data['po'][0].vendor_name + '<br>' + data['po'][0].address + '<br>' + data['po'][0].town + ', ' + data['po'][0].fk_state + ' ' + data['po'][0].zip + ', ' + (data['po'][0].fk_country == "CA" ? "Canada" : data['po'][0].fk_country == "CN" ? "China" : data['po'][0].fk_country == "US" ? "United States" : data['po'][0].fk_country) + '<br>' + data['po'][0].vendor_email;
    myHtml += '            </p>';


    myHtml += '                            </td>';
    myHtml += '                            <td style="padding:0px 0px 15px 0px; vertical-align: top;" align="right">';
    myHtml += '                                <table cellpadding="0" cellspacing="0" border="0">';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td colspan="2" style="padding:0px 2.5px">';
    myHtml += '                                            <h2 class="pageCurl" style="color:#9da3a6;font-family: sans-serif;font-weight: 700;margin:0px 0px 8px 0px;font-size: 30px;">' + inv_titleNew + '</h2>';
    myHtml += '                                        </td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">' + inv_title + ' No #:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].ref + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">' + inv_title + ' date:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].date_creation + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Client PO#:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + pono + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Reference:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].ref_supplier + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Expected Delivery Date:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].date_livraison + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Country of Origin:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + (data['po'][0].fk_country == "CA" ? "Canada" : data['po'][0].fk_country == "CN" ? "China" : data['po'][0].fk_country == "US" ? "United States" : data['po'][0].fk_country) + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                </table>';
    myHtml += '                            </td>';
    myHtml += '                        </tr >';
    myHtml += '                    </table >';
    myHtml += '                </td >';
    myHtml += '            </tr >';
    myHtml += '<tr>';
    myHtml += '<td style="padding:0px 15px 0px 15px;">';
    myHtml += '    <table cellpadding="0" width="100%" cellspacing="0" border="0">';
    myHtml += '    <tr width="100%">';
    myHtml += '        <td  width="69.9%" style="padding:0;">';
    myHtml += '            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:0px 0px 15px 0px;;color:#2c2e2f;font-weight:200;">Sold to:</h3>';
    myHtml += '                                <img src="//laylaerp.com/Images/layla1-logo.png" alt="" width="95" height="41" class="logo-size"/>';
    // myHtml += '            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:5px 0px 5px 0px;;color:#2c2e2f;font-weight:200;">' '</h3>';
    myHtml += '                                <p style="margin:15px 0px;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">';
    myHtml += '                                    ' + result.name + ', <br>' + result.add + ', <br>' + result.city + ', ' + result.state + ' ' + result.zip + ', <br>' + (result.country == "CA" ? "Canada" : result.country == "CN" ? "China" : result.country == "US" ? "United States" : result.country) + '.<br>';
    myHtml += '                                    Phone: ' + result.phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '<br />' + result.email + '<br />' + result.website;
    myHtml += '                                </p>';
    myHtml += '        </td>';

    myHtml += '        <td width="30.1%" style="padding:0px 0px ; vertical-align: top;" align="left">';
    myHtml += '                                <table cellpadding="0" cellspacing="0" border="0">';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td colspan="2" style="padding:0px 2.5px">';
    myHtml += '            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:0px 0px 15px 0px;;color:#2c2e2f;font-weight:200;">Delivery Address:</h3>';
    //myHtml += '            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:0px 0px 5px 0px;;color:#2c2e2f;font-weight:200;">' + data['podvadd'][0].ref + '</h3> ';
    myHtml += '                                        </td>';
    myHtml += '                                    </tr>';
    if (pono == '') {

    }
    else {
        myHtml += '                                    <tr>';
        myHtml += '                               <td <p style="margin:15px 0px;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">';
        myHtml += '                                    ' + data['podvadd'][0].ref + ',<br>' + data['podvadd'][0].address + ',<br>' + data['podvadd'][0].address1 + data['podvadd'][0].City + ' ' + data['podvadd'][0].state + ', ' + data['podvadd'][0].zip + '<br>' + (data['podvadd'][0].Country == "CA" ? "Canada" : data['podvadd'][0].fk_country == "CN" ? "China" : data['podvadd'][0].Country == "US" ? "United States" : data['podvadd'][0].Country) + '.<br>';
        myHtml += '                                    Phone: ' + data['podvadd'][0].phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '<br />' + data['podvadd'][0].email + '<br />';
        myHtml += '                                </p> </td>';
        myHtml += '                                    </tr>';
    }
    myHtml += '                                </table>';
    myHtml += '        </td>';
    myHtml += '     </tr>';
    myHtml += '     </table>';
    myHtml += '</td >';
    myHtml += '</tr >';
    myHtml += '<tr>';
    myHtml += '<td style="padding:0px 15px 0px 15px;">';
    myHtml += '    <table class="product-tables" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">';
    myHtml += '        <thead class="itemdetailsheader" style="border: 1px solid #ddd;background-color: #f9f9f9;">';
    myHtml += '            <tr>';
    myHtml += '                <th style="width:12%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">Item#</th>';
    myHtml += '                <th style="width:48%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">Description</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">Quantity</th>';
    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">Price</th>';
    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Amount</th>';
    myHtml += '            </tr>';
    myHtml += '        </thead>';
    myHtml += '        <tbody class="itemdetailsbody">';
    $(data['pod']).each(function (index, tr) {
        if (tr.product_type == 0) {
            myHtml += '<tr style="border-bottom: 1px solid #ddd;">';
            myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">' + tr.product_sku + '</td>';
            myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">' + tr.description + '</td>';
            myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">' + number_format(tr.qty, 0, '.', ',') + '</td>';
            myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">$' + number_format(tr.subprice, 2, '.', ',') + '</td>';
            myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">$' + number_format(tr.total_ht, 2, '.', ',') + '</td>';
            myHtml += '</tr>';
            total_qty += tr.qty, total_gm += tr.total_ht, total_tax = tr.total_localtax2, total_shamt = tr.total_localtax1, total_discamt += tr.discount, total_net += tr.total_ttc;
        }
        else if (tr.product_type == 1) { total_shamt += tr.total_ttc, total_net += tr.total_ttc; }
        else if (tr.product_type == 2) { total_tax += tr.total_ttc, total_net += tr.total_ttc; }
        else if (tr.product_type == 3) { total_other += tr.total_ttc, total_net += tr.total_ttc; }
    });
    myHtml += '        </tbody>';
    myHtml += '    </table>';
    myHtml += '</td>';
    myHtml += '</tr >';
    myHtml += '<tr>';
    myHtml += '<td style="padding:0px 15px 15px 15px;">';
    myHtml += '    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">';
    myHtml += '        <tr>';
    myHtml += '            <td style="vertical-align: top; width:50%;padding:0px;">';
    myHtml += '                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">';
    myHtml += '                    <tr>';
    myHtml += '                        <td style="color:#4f4f4f;line-height:1.4;text-align:left;font-family:sans-serif;font-size:15px;padding:5px 12px;background:#f9f9f9;font-weight:600; border-bottom:1px solid #ddd;">Comments or Special Instructions</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:12px; color:#4f4f4f;line-height:1.4;">1.Payment term:' + data['po'][0].PaymentTerm + ', ' + data['po'][0].Balance + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:12px; color:#4f4f4f;line-height:1.4;">2.' + data['po'][0].location_incoterms + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td style="border-top: 1px solid #ddd;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">';
    myHtml += '                            <h4 class="headline" style="text-align:left;font-family:sans-serif;color: #555;font-size: 16px;line-height: 18px;margin-bottom: 5px;margin-top: 0px;vertical-align: middle;text-align: left;width: 100%;font-weight: 600;">Notes</h4>';
    myHtml += '                            <p class="notes" style="text-align:left;font-family:sans-serif;color: #4f4f4f;font-size: 12px;line-height: 18px;margin-bottom: 0px;margin-top: 0px;vertical-align: middle;text-align: left;width: 100%;font-weight: 400;">' + data['po'][0].note_public + '</p>';
    myHtml += '                        </td>';
    myHtml += '                    </tr>';

    //myHtml += '                    <tr>';
    //myHtml += '                        <td style="border-top: 1px solid #ddd;padding:0px;">';
    //myHtml += '                        <table style="border-collapse: collapse;width: 100%; table-layout: fixed;font-family:sans-serif;font-size:12px;">';
    //myHtml += '                            <thead style="border: 1px solid #ddd;background-color: #f9f9f9;">';
    //myHtml += '                                <tr>';
    //myHtml += '                                    <th style="text-align:left;width:20%;padding:2px 5px;">Payment</th>';
    //myHtml += '                                    <th style="text-align:right;width:25%;padding:2px 5px;">Amount</th>';
    //myHtml += '                                    <th style="text-align:left;width:30%;padding:2px 5px;">Type</th>';
    //myHtml += '                                    <th style="text-align:left;width:25%;padding:2px 5px;">Num</th>';
    //myHtml += '                                </tr>';
    //myHtml += '                            </thead>';
    //myHtml += '                            <tbody style="border:1px solid #ddd;">';
    //$(data['popd']).each(function (index, trpd) {
    //    myHtml += '<tr style="border-bottom: 1px solid #ddd;">';
    //    myHtml += '    <td style="width:20%;padding:2px 5px;">' + trpd.datec + '</td>';
    //    myHtml += '    <td style="text-align:right;width:20%;padding:2px 5px;">$' + number_format(trpd.amount, 2, '.', ',') + '</td>';
    //    myHtml += '    <td style="width:20%;padding:2px 5px;">' + trpd.paymenttype + '</td>';
    //    myHtml += '    <td style="width:20%;padding:2px 5px;">' + trpd.num_payment + '</td>';
    //    myHtml += '</tr>';
    //    paid_amt += trpd.amount
    //});
    //myHtml += '                            </tbody>';
    //myHtml += '                        </table>';
    //myHtml += '                        </td>';
    //myHtml += '                    </tr>';

    myHtml += '                </table>';
    myHtml += '            </td>';
    myHtml += '            <td style="vertical-align: top; width:50%; padding:0px;">';
    myHtml += '                <table cellpadding="0" cellspacing="0" style="border:1px solid #ddd;border-top:0px;border-collapse: collapse;width: 100%; table-layout: fixed;">';
    myHtml += '                    <tr>';
    myHtml += '                        <td class="text-right" style="width: 40%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">' + number_format(total_qty, 0, '.', ',') + '</td>';
    myHtml += '                        <td class="text-right" style="border-right: 1px solid #ddd; width: 30%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Subtotal</td>';
    myHtml += '                        <td class="text-right" style="width: 30%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_gm, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Item discounts</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">-$' + number_format(total_discamt, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Amount tax</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_tax, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Shipping</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_shamt, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Other Fee</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_other, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Total</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_net + total_tax + total_shamt, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    //myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
    //myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Payment Terms (' + startingNumber + '%)</td>';
    //myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format((total_net * (startingNumber / 100)), 2, '.', ',') + '</td>';
    //myHtml += '                    </tr>';
    //myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
    //myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Paid</td>';
    //myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(paid_amt, 2, '.', ',') + '</td>';
    //myHtml += '                    </tr>';
    //myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
    //myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Remaining Unpaid</td>';
    //myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format((total_net - paid_amt), 2, '.', ',') + '</td>';
    //myHtml += '                    </tr>';
    myHtml += '                </table>';
    myHtml += '            </td>';
    myHtml += '        </tr>';
    myHtml += '    </table>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '</table > ';
    myHtml += '</td > ';
    myHtml += '</tr > ';
    myHtml += '</table >';

    $('#PrintModal .modal-body').empty().append(myHtml);
    //let opt = { strValue1: data['po'][0].vendor_email, strValue2: data['po'][0].ref, strValue3: myHtml }
    //if (opt.strValue1.length > 5 && is_mail) {
    //    $.ajax({
    //        type: "POST", url: '/PurchaseOrder/SendMailInvoice', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
    //        success: function (result) { console.log(result); },
    //        error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
    //        complete: function () { }, async: false
    //    });
    //}
}



function printinvoice_1(id, result, is_mail, is_inv) {
    let data = JSON.parse(result.data); //console.log(data);
    let inv_title = is_inv ? 'Bill' : 'Receive Order';
    var modalHtml = '';
    modalHtml += '<div class="modal-dialog modal-lg">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button><h5 class="modal-title">' + inv_title + ' Preview</h5></div>';
    modalHtml += '<div class="modal-body no-padding"></div>';
    modalHtml += '<div class="modal-footer"><button type="button" class="btn btn-success pull-left btnprintinvoice"><i class="fa fa-print"></i> Print</button ><button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button></div>';
    //modalHtml += '<div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $('<div class="modal in printable autoprint" id="PrintModal" role="dialog" aria-hidden="true"></div>').html(modalHtml).modal({ backdrop: 'static', keyboard: false });
    let total_qty = 0, total_gm = 0.00, total_tax = 0.00, total_shamt = 0.00, total_discamt = 0.00, total_net = 0.00;

    let startingNumber = parseFloat(data['po'][0].PaymentTerm.match(/^-?\d+\.\d+|^-?\d+\b|^\d+(?=\w)/g)) || 0.00;
    var myHtml = '';
    myHtml += '<div class="invoice">';
    myHtml += '<div class="section invoiceDetails">';
    myHtml += '        <div class="row invoiceInfo" style="font-size: 14px;">';
    myHtml += '            <div class="col-xs-12">';
    myHtml += '                <div class="row" style="padding:0px 15px;margin-bottom:10px;display: flex;">';
    myHtml += '                    <div id="printPreview" style="width: 45.66666667%;">';
    myHtml += '                    <div class="businfobox">' + data['po'][0].vendor_name + '<br/>' + data['po'][0].address + '<br/>' + data['po'][0].town + ', ' + data['po'][0].fk_state + ' ' + data['po'][0].zip + ' ' + (data['po'][0].fk_country == "CA" ? "Canada" : data['po'][0].fk_country == "US" ? "United States" : data['po'][0].fk_country);
    myHtml += '                    </div><div class="businfobox">' + data['po'][0].vendor_email + '</div>';
    myHtml += '                    </div>';
    myHtml += '                    <div style="width:58.33333333%; float:right;">';
    myHtml += '                        <table style="width: 100%;">';
    myHtml += '                            <tr>';
    myHtml += '                                <td colspan="2" style="padding-left:3px;text-align:center;"><div style="color:#9da3a6;font-weight:700;font-size:30px;margin-top: -6px;width:100%;">' + inv_title.toUpperCase() + '</div></td>';
    myHtml += '                            </tr>';
    myHtml += '                            <tr>';
    myHtml += '                                <td style="text-align:right;padding-right:10px;width:58.33333333%;font-size:14px;">' + inv_title + ' No. #:</td>';
    myHtml += '                                <td style="padding-left:3px;font-size:14px;">' + data['po'][0].ref + '</td>';
    myHtml += '                            </tr>';
    myHtml += '                            <tr>';
    myHtml += '                                <td style="text-align:right;padding-right:10px;width:58.33333333%;font-size:14px;">' + inv_title + ' date:</td>';
    myHtml += '                                <td style="padding-left:3px;font-size:14px;">' + data['po'][0].date_creation + '</td>';
    myHtml += '                            </tr>';
    myHtml += '                            <tr>';
    myHtml += '                                <td style="text-align:right;padding-right:10px;width:58.33333333%;font-size:14px;">Reference:</td>';
    myHtml += '                                <td style="padding-left:3px;font-size:14px;">' + data['po'][0].ref_supplier + '</td>';
    myHtml += '                            </tr>';
    myHtml += '                            <tr>';
    myHtml += '                                <td style="text-align:right;padding-right:10px;width:58.33333333%;font-size:14px;">Planned date of delivery:</td>';
    myHtml += '                                <td style="padding-left:3px;font-size:14px;">' + data['po'][0].date_livraison + '</td>';
    myHtml += '                            </tr>';
    myHtml += '                        </table>';
    myHtml += '                    </div>';
    myHtml += '                </div>';
    myHtml += '                <div style="border-bottom: 1px solid #ddd;"></div>';
    myHtml += '                <div class="row" style="padding:0px 15px;margin-bottom: 10px;">';
    myHtml += '                    <div class="headline"><h3>Bill To:</h3></div>';

    myHtml += '                        <div><img src="//laylaerp.com/Images/layla1-logo.png" alt="" id="logoUrl" style="width: 60px;" /></div>';
    myHtml += '                        <div>' + result.add + '<br>' + result.city + ', ' + result.state + ' ' + result.zip + ', <br>' + (result.country == "CA" ? "Canada" : result.country == "US" ? "United States" : result.country) + '</div>';
    myHtml += '                        <div>Phone: ' + result.phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '<br/>' + result.email + '<br />' + result.website + '<br /></div>';

    myHtml += '                </div>';
    myHtml += '            </div>';
    myHtml += '            <div class="row" style="padding-right:15px;padding-left:15px;">';
    myHtml += '                <table style="width: 100%; table-layout: fixed;font-size: 14px;">';
    myHtml += '                    <thead style="border: 1px solid #ddd;background-color: #f9f9f9;font-weight: 700;">';
    myHtml += '                        <tr>';
    myHtml += '                            <th style="padding:5px 15px;">Item#</th>';
    myHtml += '                            <th style="padding:5px 15px;"><div class="wrap">Description</div></th>';
    myHtml += '                            <th style="padding:5px 15px;text-align:right;">Quantity</th>';
    myHtml += '                            <th style="padding:5px 15px;text-align:right;">Price</th>';
    myHtml += '                            <th style="padding:5px 15px;text-align:right;">Amount</th>';
    myHtml += '                        </tr>';
    myHtml += '                    </thead>';
    myHtml += '                    <tbody>';
    $(data['pod']).each(function (index, tr) {
        myHtml += '<tr style="border-bottom: 1px solid #ddd;">';
        myHtml += '    <td style="padding:5px 15px;">' + tr.product_sku + '</td>';
        myHtml += '    <td style="padding:5px 15px;"><div class="wrap">' + tr.description + '</div></td>';
        myHtml += '    <td style="padding:5px 15px;text-align:right;">' + tr.qty.toFixed(0) + '</td>';
        myHtml += '    <td style="padding:5px 15px;text-align:right;">' + tr.subprice.toFixed(2) + '</td>';
        myHtml += '    <td style="padding:5px 15px;text-align:right;">' + tr.total_ht.toFixed(2) + '</td>';
        myHtml += '</tr>';
        total_qty += tr.qty, total_gm += tr.total_ht, total_tax += tr.total_localtax1, total_shamt += tr.total_localtax2, total_discamt += tr.discount, total_net += tr.total_ttc;
    });
    myHtml += '                    </tbody>';
    myHtml += '                </table>';
    myHtml += '            </div>';
    myHtml += '            <div class="row" style="padding-right:15px;padding-left:15px;">';
    myHtml += '                <table style="width: 100%;">';
    myHtml += '                    <tbody>';
    myHtml += '                        <tr>';
    myHtml += '                            <td style="vertical-align: top; width:50%;font-size: 14px;">';

    myHtml += '                            </td>';
    myHtml += '                            <td style="vertical-align: top; width:50%;font-size: 14px;">';
    myHtml += '                                <table style="width: 100%;">';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="width: 60%;border-left: 1px solid #ddd;border-right: 1px solid #ddd;text-align:right;padding-right: 15px;font-size: 13px;">Subtotal (' + total_qty.toFixed(0) + ')</td>';
    myHtml += '                                        <td style="width: 40%;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:15px;text-align:right;border-right: 1px solid #ddd;font-size: 13px;">$' + total_gm.toFixed(2) + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="width: 60%;border-left: 1px solid #ddd;border-right: 1px solid #ddd;text-align:right;padding-right: 15px;font-size: 13px;">Item discounts</td>';
    myHtml += '                                        <td style="width: 40%;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:15px;text-align:right;border-right: 1px solid #ddd;font-size: 13px;">-$' + total_discamt.toFixed(2) + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="width: 60%;border-left: 1px solid #ddd;border-right: 1px solid #ddd;text-align:right;padding-right: 15px;font-size: 13px;">Tax</td>';
    myHtml += '                                        <td style="width: 40%;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:15px;text-align:right;border-right: 1px solid #ddd;font-size: 13px;">$' + total_tax.toFixed(2) + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="width: 60%;border-left: 1px solid #ddd;border-right: 1px solid #ddd;text-align:right;padding-right: 15px;font-size: 13px;">Shipping</td>';
    myHtml += '                                        <td style="width: 40%;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:15px;text-align:right;border-right: 1px solid #ddd;font-size: 13px;">$' + total_shamt.toFixed(2) + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr style="border-top: 1px solid #ddd;border-bottom:1px solid #ddd;background-color:#f9f9f9;font-weight:700;">';
    myHtml += '                                        <th style="width: 60%;border-left: 1px solid #ddd;border-right: 1px solid #ddd;text-align:right;padding-right: 15px;">Total</th>';
    myHtml += '                                        <th style="width: 40%;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:15px;text-align:right;border-right: 1px solid #ddd;">$' + total_net.toFixed(2) + '</th>';
    myHtml += '                                    </tr>';

    myHtml += '                                </table>';
    myHtml += '                            </td>';
    myHtml += '                        </tr>';
    myHtml += '                    </tbody>';
    myHtml += '                </table>';
    myHtml += '             </div>';
    myHtml += '             <div style="margin-top: 15px;"></div>';
    myHtml += '         </div>';
    myHtml += '     </div>';
    myHtml += '</div>';
    myHtml += '</div>';
    $('#PrintModal .modal-body').append(myHtml);
    //let opt = { strValue1: data['po'][0].vendor_email, strValue2: data['po'][0].ref, strValue3: myHtml }
    //if (opt.strValue1.length > 5 && is_mail) {
    //    $.ajax({
    //        type: "POST", url: '/PurchaseOrder/SendMailInvoice', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
    //        success: function (result) { console.log(result); },
    //        error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
    //        complete: function () { }, async: false
    //    });
    //}
}

//function printinvoice_old(is_mail) {
//    let _details = getVendorDetails(); console.log(_details);
//    let _items = createItemsList();
//    let payment_term = (parseInt($("#ddlPaymentTerms").val()) || 0) > 0 ? $("#ddlPaymentTerms option:selected").text() : '';
//    let balance_days = (parseInt($("#ddlBalancedays").val()) || 0) > 0 ? $("#ddlBalancedays option:selected").text() : '';
//    let location_incoterms = $("#txtIncoTerms").val();
//    let total_qty = 0, total_gm = 0.00, total_tax = 0.00, total_shamt = 0.00, total_discamt = 0.00, total_net = 0.00;
//    let com_add = $('#parent').data('ad1') + ', ' + $('#parent').data('ad2') + ', ' + $('#parent').data('city') + ', ' + $('#parent').data('state') + ', ' + $('#parent').data('country') + ' ' + $('#parent').data('zip');
//    let email = _details[0].email;
//    var modalHtml = '';
//    modalHtml += '<div class="modal-dialog modal-lg">';
//    modalHtml += '<div class="modal-content">';
//    modalHtml += '<div class="modal-body no-padding clearfix" ></div>';
//    modalHtml += '<div class="modal-footer">';
//    modalHtml += '<button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button>';
//    modalHtml += '</div>';
//    modalHtml += '</div>';
//    modalHtml += '</div>';
//    $("#POModal").empty().html(modalHtml);

//    var myHtml = '';
//    myHtml += '<table cellpadding="0" cellspacing="0" border="0" style="border:0px; width:100%;">';
//    myHtml += '<tr>';
//    myHtml += '<td align="center" style="padding:0;">';
//    myHtml += '<table cellpadding="0" cellspacing="0" border="0" style="border:0px; size: 8.27in 11.69in;margin: .5in .5in .5in .5in;">';
//    myHtml += '<tr>';
//    myHtml += '<td style="padding:0;">';
//    myHtml += '<h2 class="invoice-name" style="color:#4f4f4f;line-height:1.4;font-family: sans-serif;margin:0px;font-size:24px; text-transform: uppercase; text-align: center; font-weight:600;">' + $('#parent').data('com') + '</h2>';
//    myHtml += '<h3 class="invoice-address" style="color:#4f4f4f;line-height:1.4;font-family: sans-serif;text-align:center;margin:0px 0px 20px 0px; font-size:14px; text-transform: capitalize; font-weight:400;">' + com_add + '</h3>';
//    myHtml += '<h1 class="invoice-title" style="color:#4f4f4f;line-height:1.4;font-family: sans-serif;font-size:30px; text-transform: uppercase; text-align: center; font-weight:700;">Proforma Invoice</h1>';
//    myHtml += '<table class="invoice-wrapper" cellpadding="0" cellspacing="0" border="0" style="border:0px; width:100%;">';
//    myHtml += '<tr>';
//    myHtml += '<td style="padding:0!important;">';
//    myHtml += '<table cellpadding="0" cellspacing="0" border="0" style="border:0px; width:250px;">';
//    myHtml += '    <tbody>';
//    myHtml += '        <tr class="date_box">';
//    myHtml += '            <th style="color:#4f4f4f;line-height:1.4;font-size:12px;font-family: sans-serif;text-transform:uppercase; text-align: left; padding:0px;">Date</th>';
//    myHtml += '            <td style="color:#4f4f4f;font-size:12px;line-height:1.4;font-family: sans-serif;padding:0px;">' + $('#txtPODate').val() + '</td>';
//    myHtml += '        </tr>';
//    myHtml += '        <tr class="date_box">';
//    myHtml += '            <th style="color:#4f4f4f;line-height:1.4;font-size:12px;font-family: sans-serif;text-transform:uppercase; text-align: left; padding:0px;">Po#</th>';
//    myHtml += '            <td style="color:#4f4f4f;font-size:12px;line-height:1.4;font-family: sans-serif;padding:0px;">' + $('#lblPoNo').text() + '</td>';
//    myHtml += '        </tr>';
//    myHtml += '        <tr class="date_box">';
//    myHtml += '            <th style="color:#4f4f4f;line-height:1.4;font-size:12px;font-family: sans-serif;text-transform:uppercase; text-align: left;padding:0px;">Pi#</th>';
//    myHtml += '            <td style="color:#4f4f4f;font-size:12px;line-height:1.4;font-family: sans-serif;padding:0px;">' + $('#txtRefvendor').val() + '</td>';
//    myHtml += '        </tr>';
//    myHtml += '    </tbody>';
//    myHtml += '</table>';
//    myHtml += '<table cellpadding="0" cellspacing="0" border="0" style="border:0px;width:100%; background: #F3F3F3; margin:25px 0px 30px 0px;">';
//    myHtml += '<tr>';
//    myHtml += '<td style="width:50%; vertical-align: top;padding:15px;">';
//    myHtml += '<h2 style="font-family: sans-serif;margin:0px 0px 10px 0px;text-transform: uppercase;font-size:15px; background: #F3F3F3;color: #ff4100; border-bottom: 1px solid #e2e2e2; padding:0px 0px 10px 0px;">To</h2>';
//    if (_details.length > 0) {
//        myHtml += '<h3 style="font-family: sans-serif;margin:0px 0px 10px 0px;font-size:15px; color:#4f4f4f; margin:0px;">' + _details[0].name + '</h3>';
//        myHtml += '<h4 style="font-weight:400;font-family: sans-serif; font-size:12px; margin:0px;color:#4f4f4f;line-height:1.4;">' + _details[0].address + '</h4>';
//        myHtml += '<h4 style="font-weight:400;font-family: sans-serif; font-size:12px; margin:0px;color:#4f4f4f;line-height:1.4;">' + _details[0].town + ',' + _details[0].fk_state + ', ' + _details[0].fk_country + ' ' + _details[0].zip + '</h4>';
//        myHtml += '<h4 style="font-weight:400;font-family: sans-serif; font-size:12px; margin:0px;color:#4f4f4f;line-height:1.4;">Phone : ' + _details[0].phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '</h4>';
//    }
//    myHtml += '</td>';
//    myHtml += '<td style="width:50%; vertical-align: top;padding: 15px;">';
//    //myHtml += '<h2 style="font-family: sans-serif;margin:0px 0px 10px 0px;text-transform: uppercase;font-size:15px; background: #F3F3F3;color: #ff4100; border-bottom: 1px solid #e2e2e2; padding:0px 0px 10px 0px;">Ship To</h2>';
//    //myHtml += '<h4 style="font-weight:400;font-family: sans-serif; font-size:12px; margin:0px;color:#4f4f4f;line-height:1.4;">Chicago</h4>';
//    myHtml += '</td>';
//    myHtml += '</tr>';
//    myHtml += '<table cellpadding="0" cellspacing="0" border="0" class="tables" style="width:100%; border-collapse: collapse; border:1px solid #e2e2e2; text-align: left; margin:0px 0px 30px 0px;">';
//    myHtml += '<thead>';
//    myHtml += '    <tr>';
//    myHtml += '        <th style="font-family: sans-serif; font-size:12px; line-height:1.4;background:#ff4100; color:#fff; text-transform: uppercase; padding:12px;">Item #</th>';
//    myHtml += '        <th style="font-family: sans-serif; font-size:12px; line-height:1.4;background:#ff4100; color:#fff; text-transform: uppercase; padding:12px;">Description</th>';
//    myHtml += '        <th style="font-family: sans-serif; font-size:12px; line-height:1.4;background:#ff4100; color:#fff; text-transform: uppercase; padding:12px;text-align: right;">Qty</th>';
//    myHtml += '        <th style="font-family: sans-serif; font-size:12px; line-height:1.4;background:#ff4100; color:#fff; text-transform: uppercase; padding:12px;text-align: right;">Unit Price</th>';
//    myHtml += '        <th style="font-family: sans-serif; font-size:12px; line-height:1.4;background:#ff4100; color:#fff; text-transform: uppercase; padding:12px;text-align: right;">Total</th>';
//    myHtml += '        <th style="font-family: sans-serif; font-size:12px; line-height:1.4;background:#ff4100; color:#fff; text-transform: uppercase; padding:12px;">Etd</th>';
//    myHtml += '    </tr>';
//    myHtml += '</thead>';
//    myHtml += '<tbody>';
//    $(_items).each(function (index, tr) {
//        myHtml += '<tr style="background-color: #f2f2f2;">';
//        myHtml += '    <td style="padding:12px;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">' + tr.product_sku + '</td>';
//        myHtml += '    <td style="padding:12px;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">' + tr.description + '</td>';
//        myHtml += '    <td style="padding:12px;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;">' + tr.qty.toFixed(0) + '</td>';
//        myHtml += '    <td style="padding:12px;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;">' + tr.subprice.toFixed(2) + '</td>';
//        myHtml += '    <td style="padding:12px;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;">' + tr.total_ht.toFixed(2) + '</td>';
//        myHtml += '    <td style="padding:12px;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">' + $('#txtPlanneddateofdelivery').val() + '</td>';
//        myHtml += '</tr>';
//        total_qty += tr.qty, total_gm += tr.total_ht, total_tax += tr.total_localtax1, total_shamt += tr.total_localtax2, total_discamt += tr.discount, total_net += tr.total_ttc;
//    });
//    myHtml += '</tbody>';
//    myHtml += '<tfoot>';
//    myHtml += '    <tr>';
//    myHtml += '        <td colspan="2" style="padding:12px;color:#4f4f4f; background: #d0d0d0;font-weight: 600;font-family: sans-serif; font-size:12px; line-height:1.4;">Comments or Special Instructions</td>';
//    myHtml += '        <td style="padding:12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;">' + total_qty.toFixed(0) + '</td>';
//    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">SubTotal</td>';
//    myHtml += '        <td style="padding:12px;background:#F2F2F2;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;">$' + total_gm.toFixed(2) + '</td>';
//    myHtml += '        <td style="padding:12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"></td>';
//    myHtml += '    </tr>';
//    myHtml += '    <tr>';
//    myHtml += '        <td colspan="3" style="padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"><b>1</b>,Payment term:' + payment_term + ', ' + balance_days + '</td>';
//    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">Discount</td>';
//    myHtml += '        <td style="background:#F2F2F2;text-align: right;">$' + total_discamt.toFixed(2) + '</td>';
//    myHtml += '        <td></td>';
//    myHtml += '    </tr>';
//    myHtml += '    <tr>';
//    myHtml += '        <td colspan="3" style="padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"><b>2</b>,' + location_incoterms + '</td>';
//    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">Tax</td>';
//    myHtml += '        <td style="background:#F2F2F2;text-align: right;">$' + total_tax.toFixed(2) + '</td>';
//    myHtml += '        <td></td>';
//    myHtml += '    </tr>';
//    myHtml += '    <tr>';
//    myHtml += '        <td colspan="3" style="padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"></td>';
//    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">Shipping</td>';
//    myHtml += '        <td style="background:#F2F2F2;text-align: right;">$' + total_shamt.toFixed(2) + '</td>';
//    myHtml += '        <td></td>';
//    myHtml += '    </tr>';
//    myHtml += '    <tr>';
//    myHtml += '        <td colspan="3" style="padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"></td>';
//    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">Other</td>';
//    myHtml += '        <td style="background:#F2F2F2;text-align: right;">-</td>';
//    myHtml += '        <td></td>';
//    myHtml += '    </tr>';
//    myHtml += '    <tr>';
//    myHtml += '        <td colspan="3" style="padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"></td>';
//    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"><b>Total</b></td>';
//    myHtml += '        <td style="background:#F2F2F2;padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;"><b>$' + total_net.toFixed(2) + '</b></td>';
//    myHtml += '        <td></td>';
//    myHtml += '    </tr>';
//    myHtml += '    <tr>';
//    myHtml += '        <td colspan="3"></td>';
//    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:4px 12px 12px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">Deposit</td>';
//    myHtml += '        <td style="background:#F2F2F2;padding:4px 12px 12px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;">$0.00</td>';
//    myHtml += '        <td></td>';
//    myHtml += '    </tr>';
//    myHtml += '</tfoot>';
//    myHtml += '</table>';

//    myHtml += '</td>';
//    myHtml += '</tr>';
//    myHtml += '</table>';
//    myHtml += '</td>';
//    myHtml += '</tr>';
//    myHtml += '</table>';
//    myHtml += '</td>';
//    myHtml += '</tr>';
//    myHtml += '</table >';

//    $('#POModal .modal-body').append(myHtml);

//    $("#POModal").modal({ backdrop: 'static', keyboard: false });
//    //var opt = { strValue1: email, strValue2: $('#lblPoNo').text(), strValue3: $('#POModal .modal-body').html() }
//    //if (opt.strValue1.length > 5 && is_mail) {
//    //    $.ajax({
//    //        type: "POST", url: '/PurchaseOrder/SendMailInvoice', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
//    //        success: function (result) { console.log(result); },
//    //        error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
//    //        complete: function () { }, async: false
//    //    });
//    //}
//}