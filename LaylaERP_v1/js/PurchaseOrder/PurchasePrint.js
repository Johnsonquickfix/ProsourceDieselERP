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
function getPurchaseOrderPrint(id, is_mail) {
    if (id > 0) {
        printmodal(false);
        $.ajaxSetup({ async: false });
        $.get('/PurchaseOrder/GetPurchaseOrderPrint', { strValue1: id }).done(function (result) {
            printinvoice(id, result, is_mail, false);
        }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
    }
}
function printinvoice(id, result, is_mail, is_inv) {
    let data = JSON.parse(result.data); //console.log(data);
    let inv_title = is_inv ? 'Invoice' : 'Purchase Order';
    let so_no = parseInt(data['po'][0].fk_projet) || 0;
    let va_cp = so_no > 0 ? 33.3 : 66.3;
    let oth_email = data['po'][0].user_email, po_authmail = data['po'][0].po_authmail;
    if (po_authmail != '') {
        po_authmail = JSON.parse(po_authmail);
        $(po_authmail).each(function (index, tr) { oth_email += ',' + tr.user_email });
    }
    let total_qty = 0, total_gm = 0.00, total_tax = 0.00, total_shamt = 0.00, total_discamt = 0.00, total_other = 0.00, paid_amt = 0.00; total_net = 0.00;

    let startingNumber = parseFloat(data['po'][0].PaymentTerm.match(/^-?\d+\.\d+|^-?\d+\b|^\d+(?=\w)/g)) || 0.00;
    //let _com_add = result.com_name + ', <br>' + result.add + ', <br>' + result.city + ', ' + result.state + ' ' + result.zip + ', <br>' + (result.country == "CA" ? "Canada" : result.country == "US" ? "United States" : result.country) + '.<br>';
    //_com_add += 'Phone: ' + result.phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + ' <br> ' + result.email + ' <br> ' + result.website;
    let _com_add = data['Table4'][0].com_name + ', <br>' + data['Table4'][0].add + ', <br>' + data['Table4'][0].city + ', ' + data['Table4'][0].state + ' ' + data['Table4'][0].zip + ', <br>' + (data['Table4'][0].country == "CA" ? "Canada" : data['Table4'][0].country == "US" ? "United States" : data['Table4'][0].country) + '.<br>';
    _com_add += 'Phone: ' + data['Table4'][0].phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + ' <br> ' + data['Table4'][0].email + ' <br> ' + data['Table4'][0].website;

    let myHtml = '<table id="invoice" cellpadding="0" cellspacing="0" border="0" style="width:100%;">';
    myHtml += '<tr>';
    myHtml += '    <td align="center" style="padding:0;">';
    myHtml += '        <table class="container_table" cellpadding="0" cellspacing="0" border="0" style="border:2px solid #e6e6e6; width:995px">';
    myHtml += '            <tr>';
    myHtml += '                <td style="padding:15px;">';
    myHtml += '                    <table cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed;width:100%;border-bottom: 1px solid #ddd;">';
    myHtml += '                        <tr>';
    myHtml += '                            <td style="padding:0; vertical-align: top;width:66.9%">';
    myHtml += '                                <img src="../Images/prosourcediesel-logo.png" alt="" width="95" height="41" class="logo-size"/>';
    myHtml += '                                <p style="margin:15px 0px;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">' + _com_add + '</p>';
    myHtml += '                            </td>';
    myHtml += '                            <td style="padding:0; vertical-align: top; width:33.1%" align="left">';
    myHtml += '                                <table cellpadding="0" cellspacing="0" border="0">';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td colspan="2" style="padding:0px 2.5px 0px 0px">';
    myHtml += '                                            <h2 class="pageCurl" style="color:#9da3a6;font-family: sans-serif;font-weight: 700;margin:0px 0px 8px 0px;font-size: 30px;">' + inv_title.toUpperCase() + '</h2>';
    myHtml += '                                        </td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">' + inv_title + ' No #:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + (is_inv ? data['po'][0].ref_ext : data['po'][0].ref) + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">' + inv_title + ' Date:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].date_creation + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Reference:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].ref_supplier + '</td>';
    myHtml += '                                    </tr>';
    if (so_no > 0) {
        myHtml += '                                    <tr>';
        myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Sale Order Reference No:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].fk_projet + '</td>';
        myHtml += '                                    </tr>';
    }
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Expected Delivery Date:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].date_livraison + '</td>';
    myHtml += '                                    </tr>';
    if (!is_inv) {
        myHtml += '                                    <tr>';
        myHtml += '                                        <td style = "font-family:sans-serif;font-size:20px;color:#4f4f4f;line-height:1.4;padding:20px 2.5px;text-align: center;" colspan = "2">' + data['po'][0].po_status + '</td>';
        myHtml += '                                    </tr>';
    }
    myHtml += '                                </table>';
    myHtml += '                            </td>';
    myHtml += '                        </tr >';
    myHtml += '                    </table >';
    myHtml += '                </td >';
    myHtml += '            </tr >';
    myHtml += '<tr>';
    myHtml += '<td style="padding:0px 15px 0px 15px;">';
    myHtml += '    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">';
    myHtml += '    <tr>';
    myHtml += '        <td style="vertical-align: text-top;padding:0;width: ' + va_cp + '%">';
    myHtml += '            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:0px 0px 5px 0px;;color:#2c2e2f;font-weight:200;">Vendor:</h3>';
    myHtml += '            <p class="recipientInfo" style="width: 225px;margin:0px 0px 15px 0px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">';
    myHtml += '               ' + data['po'][0].vendor_name + '<br>' + data['po'][0].address + '<br>' + data['po'][0].town + ', ' + data['po'][0].fk_state + ' ' + data['po'][0].zip + ', ' + (data['po'][0].fk_country == "CA" ? "Canada" : data['po'][0].fk_country == "US" ? "United States" : data['po'][0].fk_country) + '<br>' + data['po'][0].vendor_email;
    myHtml += '            </p>';
    myHtml += '        </td>';
    myHtml += '        <td style="vertical-align: text-top;padding:0;width: 33.1" align="left">';
    myHtml += '            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:0px 0px 5px 0px;;color:#2c2e2f;font-weight:200;">Delivery Address:</h3>';
    myHtml += '            <p class="recipientInfo" style="width: 225px;margin:0px 0px 15px 0px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">';
    myHtml += '               ' + data['po'][0].warehouse + '<br>' + data['po'][0].wrh_add + '<br>' + data['po'][0].wrh_city + ', ' + data['po'][0].wrh_town + ' ' + data['po'][0].wrh_zip + ', ' + (data['po'][0].wrh_country == "CA" ? "Canada" : data['po'][0].fk_cowrh_countryuntry == "US" ? "United States" : data['po'][0].wrh_country) + '<br>Phone: ' + data['po'][0].wrh_phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3");
    myHtml += '            </p>';
    myHtml += '        </td>';
    if (so_no > 0) {
        myHtml += '        <td style="vertical-align: text-top;padding:0;width: 33.1" align="left">';
        myHtml += '            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:0px 0px 5px 0px;;color:#2c2e2f;font-weight:200;">Ship To:</h3>';
        myHtml += '            <p class="recipientInfo" style="width: 100%;margin:0px 0px 15px 0px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">';
        myHtml += '               ' + data['Table3'][0].s_first_name + ' ' + data['Table3'][0].s_last_name + '<br>' + data['Table3'][0].s_address_1 + '<br>' + (data['Table3'][0].s_address_2.length > 0 ? data['Table3'][0].s_address_2 + '<br>' : '') + data['Table3'][0].s_city + ', ' + data['Table3'][0].s_state + ' ' + data['Table3'][0].s_postcode + ', ' + (data['Table3'][0].s_country == "CA" ? "Canada" : data['Table3'][0].s_country == "US" ? "United States" : data['Table3'][0].s_country) + '<br>Phone: ' + data['Table3'][0].b_phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '<br>' + data['Table3'][0].b_email;
        myHtml += '            </p>';
        myHtml += '        </td>';
    }
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
            if (so_no > 0) myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">' + tr.description + '</td>';
            else myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">' + tr.description + '<br>Batch/Tag/Lot. :- ' + tr.product_serialno + '</td>';

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
    if (so_no > 0) { myHtml += ''; }
    else {
        myHtml += '                    <tr>';
        myHtml += '                        <td style="color:#4f4f4f;line-height:1.4;text-align:left;font-family:sans-serif;font-size:15px;padding:5px 12px;background:#f9f9f9;font-weight:600; border-bottom:1px solid #ddd;">Comments or Special Instructions</td>';
        myHtml += '                    </tr>';
        myHtml += '                    <tr>';
        myHtml += '                        <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:12px; color:#4f4f4f;line-height:1.4;">1.Payment term:' + data['po'][0].PaymentTerm + ', ' + data['po'][0].Balance + '</td>';
        myHtml += '                    </tr>';
        myHtml += '                    <tr>';
        myHtml += '                        <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:12px; color:#4f4f4f;line-height:1.4;">2.' + data['po'][0].location_incoterms + '</td>';
        myHtml += '                    </tr>';
    }
    myHtml += '                    <tr>';
    myHtml += '                        <td style="border-top: 1px solid #ddd;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">';
    myHtml += '                            <h4 class="headline" style="text-align:left;font-family:sans-serif;color: #555;font-size: 16px;line-height: 18px;margin-bottom: 5px;margin-top: 0px;vertical-align: middle;text-align: left;width: 100%;font-weight: 600;">Notes</h4>';
    myHtml += '                            <p class="notes" style="text-align:left;font-family:sans-serif;color: #4f4f4f;font-size: 12px;line-height: 18px;margin-bottom: 0px;margin-top: 0px;vertical-align: middle;text-align: left;width: 100%;font-weight: 400;">' + data['po'][0].note_public + '</p>';
    myHtml += '                        </td>';
    myHtml += '                    </tr>';

    myHtml += '                    <tr>';
    myHtml += '                        <td style="border-top: 1px solid #ddd;padding:0px;">';
    if (so_no > 0) { myHtml += ''; }
    else {
        myHtml += '                        <table style="border-collapse: collapse;width: 100%; table-layout: fixed;font-family:sans-serif;font-size:12px;">';
        myHtml += '                            <thead style="border: 1px solid #ddd;background-color: #f9f9f9;">';
        myHtml += '                                <tr>';
        myHtml += '                                    <th style="text-align:left;width:20%;padding:2px 5px;">Payment</th>';
        myHtml += '                                    <th style="text-align:right;width:25%;padding:2px 5px;">Amount</th>';
        myHtml += '                                    <th style="text-align:left;width:30%;padding:2px 5px;">Type</th>';
        myHtml += '                                    <th style="text-align:left;width:25%;padding:2px 5px;">Num</th>';
        myHtml += '                                </tr>';
        myHtml += '                            </thead>';
        myHtml += '                            <tbody style="border:1px solid #ddd;">';
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
    }
    myHtml += '                        </td>';
    myHtml += '                    </tr>';

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
    if (data['po'][0].fk_status == 3 && is_mail) {
        let opt_app = { strValue1: data['po'][0].vendor_email, strValue2: data['po'][0].ref, strValue3: myHtml, strValue4: oth_email, strValue5: _com_add }
        if (opt_app.strValue1.length > 5 && is_mail) {
            $.ajax({
                type: "POST", url: '/PurchaseOrder/SendMailInvoice', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt_app),
                success: function (result) { console.log(result); },
                error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
                complete: function () { }, async: false
            });
        }
    }
    else if (data['po'][0].fk_status == 8 && is_mail) {
        let opt_rej = { strValue1: data['po'][0].po_authmail, strValue2: data['po'][0].ref, strValue3: '', strValue4: data['po'][0].user_email, strValue5: _com_add }
        $.ajax({
            type: "POST", url: '/PurchaseOrder/SendMailPOReject', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt_rej),
            success: function (result) { console.log(result); },
            error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
            complete: function () { }, async: false
        });
    }
}

function getInvoicePrint(id) {
    if (id > 0) {
        printmodal(true);
        var option = { strValue1: id };
        $.ajax({
            url: "/PurchaseOrder/GetPurchaseOrderPrint", type: "Get", beforeSend: function () { }, data: option,
            success: function (result) {
                try {
                    printinvoice(id, result, false, true);
                }
                catch (error) { swal('Alert!', "something went wrong.", "error"); }
            },
            complete: function () { },
            error: function (xhr, status, err) { swal('Alert!', "something went wrong.", "error"); }, async: false
        });
    }
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

function printinvoice_old(id, result, is_mail, is_inv) {
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
    myHtml += '<style>div: after,div: before{display:block;clear:both;content:" "}body{color:#4f4f4f}.payerGuestCentered{margin:auto;width:995px}.invoiceDetails.invoiceInfo{width:auto;position:relative}.invoiceDetails.folded - corner{display:none;width:0;height:0;position:absolute;top:-2px;right:-2px;background:#e6e6e6}[class^=col-xs]{position:relative;float:left}.col - xs - 12{width:100 %}.col - xs - 5{width:41.66666667 %}.col - xs - 7{width:58.33333333 %}.col - xs - 6{width:50 %}.invoiceDetails.pageCurl{direction:rtl;color:#9da3a6}.invoiceDetails.invsummary.paySummary{border:1px solid #ddd;padding:15px}.invoice h1,.invoice h2,.invoice h3,.invoice h4,.invoice h5,.invoice h6{color:#2c2e2f}.invoiceDetails #itemDetails{margin:0}.invoiceDetails.itemdetailsheader{margin:0;border:1px solid #ddd}.invoiceDetails.itemdetailsheader.itemquantity{width:10 %}.invoiceDetails.itemdetailsheader.itemprice{width:15 %}.invoiceDetails.itemdetailsheader.itemamount{width:15 %}.invoiceDetails.itemdetailsbody{margin:0}.invoiceDetails.itemdetailsbody.itemquantity{width:10 %}.invoiceDetails.itemdetailsbody.itemprice{width:15 %}.invoiceDetails.itemdetailsbody.itemamount{width:15 %}.invoiceDetails #invoiceTotals{margin:0}.invoiceDetails #invoiceTotals{margin:0}.invoiceDetails.headline{color:#555;width:100 %}.invoice p{margin:12px 0}.items{width:12 %}.table - out td{padding:0}.table - in1 tr: first - child td{background:#f9f9f9}.table - in1 td{padding:5px 15px}</style>';
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
        if (tr.fk_product > 0) total_qty += tr.qty;
        total_gm += tr.total_ht, total_tax += tr.total_localtax1, total_shamt += tr.total_localtax2, total_discamt += tr.discount, total_net += tr.total_ttc;
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
    let opt = { strValue1: data['po'][0].vendor_email, strValue2: data['po'][0].ref, strValue3: myHtml }
    if (opt.strValue1.length > 5 && is_mail) {
        $.ajax({
            type: "POST", url: '/PurchaseOrder/SendMailInvoice', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
            success: function (result) { console.log(result); },
            error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
            complete: function () { }, async: false
        });
    }
}