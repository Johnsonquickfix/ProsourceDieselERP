$(document).ready(function () {
    $(document).on("click", ".btnprintinvoice", function (t) {
        t.preventDefault();
        let divContents = $('.invoice').html();
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
function getPurchaseOrderPrint(id, is_mail) {
    if (id > 0) {
        var option = { strValue1: id };
        $.ajax({
            url: "/PurchaseOrder/GetPurchaseOrderPrint", type: "Get", beforeSend: function () { }, data: option,
            success: function (result) {
                try {
                    printinvoice(id, result, is_mail, false);
                }
                catch (error) { swal('Alert!', "something went wrong.", "error"); }
            },
            complete: function () { },
            error: function (xhr, status, err) { swal('Alert!', "something went wrong.", "error"); }, async: false
        });
    }
}
function printinvoice(id, result, is_mail, is_inv) {
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
    myHtml += `
<table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
            <tr>
                <td align="center" style="padding:0;">
                    <table class="container_table" cellpadding="0" cellspacing="0" border="0" style="border:2px solid #e6e6e6; width:995px">
                        <tr>
                            <td style="padding:15px;">
                                <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-bottom: 1px solid #ddd;">
                                    <tr>
                                        <td style="padding:0; vertical-align: top;">
                                            <img src="http://40.114.51.80/Images/layla1-logo.png" alt="" width="95" height="41" class="logo-size"/>
                                            <p style="margin:15px 0px;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">
                                                157 Church Street Suite 1956, <br>
                                                New Haven, CT 06510, <br>
                                                United States.<br>
                                                Phone: 001 8553581676<br />
                                                sb-ywzys7367265@business.example.com<br />
                                                www.laylasleep.com</p>
                                        </td>
                                        <td style="padding:0; vertical-align: top;" align="right">
                                            <table cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td colspan="2" style="padding:0px 2.5px">
                                                        <h2 class="pageCurl" style="color:#9da3a6;font-family: sans-serif;font-weight: 700;margin:0px 0px 8px 0px;font-size: 30px;">INVOICE</h2>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Invoice #:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">WC-1629963072594</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Invoice date:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">Aug 26, 2021</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Reference:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">851389</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Due date:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">Sep 5, 2021</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:0px 15px 0px 15px;">
                                <table cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td style="padding:0;">
                                            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:0px 0px 5px 0px;;color:#2c2e2f;font-weight:200;">Bill To:</h3>
                                            <p class="recipientInfo" style="width: 225px;margin:0px 0px 15px 0px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">
                                                Gabriel Aubry
                                                925 S Chugach St #APT 10 Palmer,
                                                AK 99645 United States.<br>
                                                testing.quickfix@gmail.com
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:0px 15px 0px 15px;">
                                <table class="product-tables" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">
                                    <thead class="itemdetailsheader" style="border: 1px solid #ddd;background-color: #f9f9f9;">
                                        <tr>
                                            <th style="width:12%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">Item#</th>
                                            <th style="width:48%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">Description</th>
                                            <th style="width:10%;padding:5px 12px;text-align:center;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">Quantity</th>
                                            <th style="width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">Price</th>
                                            <th style="width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody class="itemdetailsbody">
                                        <tr style="border-bottom: 1px solid #ddd;">
                                            <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">MATT01F</td>
                                            <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">Layla Memory Foam Mattress - Full</td>
                                            <td style="padding:5px 12px;text-align:center;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">1</td>
                                            <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">$999.00</td>
                                            <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">$999.00</td>
                                        </tr>
                                        <tr style="border-bottom: 1px solid #ddd;">
                                            <td style="padding:5px 12px;text-align:left;font-family:sans-serif;font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">SMF01Q-FR</td>
                                            <td style="padding:5px 12px;text-align:left;font-family:sans-serif;font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">Layla Memory Foam Pillow - Queen</td>
                                            <td style="padding:5px 12px;text-align:center;font-family:sans-serif;font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">2</td>
                                            <td style="padding:5px 12px;text-align:right;font-family:sans-serif;font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">$0.00</td>
                                            <td style="padding:5px 12px;text-align:right;font-family:sans-serif;font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">$0.00</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:0px 15px 15px 15px;">
                                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">
                                    <tr>
                                        <td style="vertical-align: top; width:50%;padding:0px;">
                                            <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">
                                                <tr>
                                                    <td style="color:#4f4f4f;line-height:1.4;text-align:left;font-family:sans-serif;font-size:15px;padding:5px 12px;background:#f9f9f9;font-weight:600; border-bottom:1px solid #ddd;">Comments or Special Instructions</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">1.Payment term:30% deposit,balance net 60days</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">2.CIF Chicago</td>
                                                </tr>
                                                <tr>
                                                    <td style="border-top: 1px solid #ddd;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">
                                                        <h4 class="headline" style="text-align:left;font-family:sans-serif;color: #555;font-size: 16px;line-height: 18px;margin-bottom: 5px;margin-top: 0px;vertical-align: middle;text-align: left;width: 100%;font-weight: 600;">Notes</h4>
                                                        <p class="notes" style="text-align:left;font-family:sans-serif;color: #4f4f4f;font-size: 16px;line-height: 18px;margin-bottom: 0px;margin-top: 0px;vertical-align: middle;text-align: left;width: 100%;font-weight: 400;">Layla Invoice.</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td style="vertical-align: top; width:50%; padding:0px;">
                                            <table cellpadding="0" cellspacing="0" style="border:1px solid #ddd;border-top:0px;border-collapse: collapse;width: 100%; table-layout: fixed;">
                                                <tr>
                                                    <td class="text-right" style="border-right: 1px solid #ddd; width: 70%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Subtotal</td>
                                                    <td class="text-right" style="width: 30%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$999.00</td>
                                                </tr>
                                                <tr>
                                                    <td class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Item discounts</td>
                                                    <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">-$150.00</td>
                                                </tr>
                                                <tr>
                                                    <td class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Shipping</td>
                                                    <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$250.00</td>
                                                </tr>
                                                <tr>
                                                    <td class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Other Fee</td>
                                                    <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$0.00</td>
                                                </tr>
                                                <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">
                                                    <td class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Total</td>
                                                    <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$1,099.00</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
`;

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

function getInvoicePrint(id) {
    if (id > 0) {
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

function printinvoice_old(is_mail) {
    let _details = getVendorDetails(); console.log(_details);
    let _items = createItemsList();
    let payment_term = (parseInt($("#ddlPaymentTerms").val()) || 0) > 0 ? $("#ddlPaymentTerms option:selected").text() : '';
    let balance_days = (parseInt($("#ddlBalancedays").val()) || 0) > 0 ? $("#ddlBalancedays option:selected").text() : '';
    let location_incoterms = $("#txtIncoTerms").val();
    let total_qty = 0, total_gm = 0.00, total_tax = 0.00, total_shamt = 0.00, total_discamt = 0.00, total_net = 0.00;
    let com_add = $('#parent').data('ad1') + ', ' + $('#parent').data('ad2') + ', ' + $('#parent').data('city') + ', ' + $('#parent').data('state') + ', ' + $('#parent').data('country') + ' ' + $('#parent').data('zip');
    let email = _details[0].email;
    var modalHtml = '';
    modalHtml += '<div class="modal-dialog modal-lg">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<div class="modal-body no-padding clearfix" ></div>';
    modalHtml += '<div class="modal-footer">';
    modalHtml += '<button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#POModal").empty().html(modalHtml);

    var myHtml = '';
    myHtml += '<table cellpadding="0" cellspacing="0" border="0" style="border:0px; width:100%;">';
    myHtml += '<tr>';
    myHtml += '<td align="center" style="padding:0;">';
    myHtml += '<table cellpadding="0" cellspacing="0" border="0" style="border:0px; size: 8.27in 11.69in;margin: .5in .5in .5in .5in;">';
    myHtml += '<tr>';
    myHtml += '<td style="padding:0;">';
    myHtml += '<h2 class="invoice-name" style="color:#4f4f4f;line-height:1.4;font-family: sans-serif;margin:0px;font-size:24px; text-transform: uppercase; text-align: center; font-weight:600;">' + $('#parent').data('com') + '</h2>';
    myHtml += '<h3 class="invoice-address" style="color:#4f4f4f;line-height:1.4;font-family: sans-serif;text-align:center;margin:0px 0px 20px 0px; font-size:14px; text-transform: capitalize; font-weight:400;">' + com_add + '</h3>';
    myHtml += '<h1 class="invoice-title" style="color:#4f4f4f;line-height:1.4;font-family: sans-serif;font-size:30px; text-transform: uppercase; text-align: center; font-weight:700;">Proforma Invoice</h1>';
    myHtml += '<table class="invoice-wrapper" cellpadding="0" cellspacing="0" border="0" style="border:0px; width:100%;">';
    myHtml += '<tr>';
    myHtml += '<td style="padding:0!important;">';
    myHtml += '<table cellpadding="0" cellspacing="0" border="0" style="border:0px; width:250px;">';
    myHtml += '    <tbody>';
    myHtml += '        <tr class="date_box">';
    myHtml += '            <th style="color:#4f4f4f;line-height:1.4;font-size:12px;font-family: sans-serif;text-transform:uppercase; text-align: left; padding:0px;">Date</th>';
    myHtml += '            <td style="color:#4f4f4f;font-size:12px;line-height:1.4;font-family: sans-serif;padding:0px;">' + $('#txtPODate').val() + '</td>';
    myHtml += '        </tr>';
    myHtml += '        <tr class="date_box">';
    myHtml += '            <th style="color:#4f4f4f;line-height:1.4;font-size:12px;font-family: sans-serif;text-transform:uppercase; text-align: left; padding:0px;">Po#</th>';
    myHtml += '            <td style="color:#4f4f4f;font-size:12px;line-height:1.4;font-family: sans-serif;padding:0px;">' + $('#lblPoNo').text() + '</td>';
    myHtml += '        </tr>';
    myHtml += '        <tr class="date_box">';
    myHtml += '            <th style="color:#4f4f4f;line-height:1.4;font-size:12px;font-family: sans-serif;text-transform:uppercase; text-align: left;padding:0px;">Pi#</th>';
    myHtml += '            <td style="color:#4f4f4f;font-size:12px;line-height:1.4;font-family: sans-serif;padding:0px;">' + $('#txtRefvendor').val() + '</td>';
    myHtml += '        </tr>';
    myHtml += '    </tbody>';
    myHtml += '</table>';
    myHtml += '<table cellpadding="0" cellspacing="0" border="0" style="border:0px;width:100%; background: #F3F3F3; margin:25px 0px 30px 0px;">';
    myHtml += '<tr>';
    myHtml += '<td style="width:50%; vertical-align: top;padding:15px;">';
    myHtml += '<h2 style="font-family: sans-serif;margin:0px 0px 10px 0px;text-transform: uppercase;font-size:15px; background: #F3F3F3;color: #ff4100; border-bottom: 1px solid #e2e2e2; padding:0px 0px 10px 0px;">To</h2>';
    if (_details.length > 0) {
        myHtml += '<h3 style="font-family: sans-serif;margin:0px 0px 10px 0px;font-size:15px; color:#4f4f4f; margin:0px;">' + _details[0].name + '</h3>';
        myHtml += '<h4 style="font-weight:400;font-family: sans-serif; font-size:12px; margin:0px;color:#4f4f4f;line-height:1.4;">' + _details[0].address + '</h4>';
        myHtml += '<h4 style="font-weight:400;font-family: sans-serif; font-size:12px; margin:0px;color:#4f4f4f;line-height:1.4;">' + _details[0].town + ',' + _details[0].fk_state + ', ' + _details[0].fk_country + ' ' + _details[0].zip + '</h4>';
        myHtml += '<h4 style="font-weight:400;font-family: sans-serif; font-size:12px; margin:0px;color:#4f4f4f;line-height:1.4;">Phone : ' + _details[0].phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '</h4>';
    }
    myHtml += '</td>';
    myHtml += '<td style="width:50%; vertical-align: top;padding: 15px;">';
    //myHtml += '<h2 style="font-family: sans-serif;margin:0px 0px 10px 0px;text-transform: uppercase;font-size:15px; background: #F3F3F3;color: #ff4100; border-bottom: 1px solid #e2e2e2; padding:0px 0px 10px 0px;">Ship To</h2>';
    //myHtml += '<h4 style="font-weight:400;font-family: sans-serif; font-size:12px; margin:0px;color:#4f4f4f;line-height:1.4;">Chicago</h4>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '<table cellpadding="0" cellspacing="0" border="0" class="tables" style="width:100%; border-collapse: collapse; border:1px solid #e2e2e2; text-align: left; margin:0px 0px 30px 0px;">';
    myHtml += '<thead>';
    myHtml += '    <tr>';
    myHtml += '        <th style="font-family: sans-serif; font-size:12px; line-height:1.4;background:#ff4100; color:#fff; text-transform: uppercase; padding:12px;">Item #</th>';
    myHtml += '        <th style="font-family: sans-serif; font-size:12px; line-height:1.4;background:#ff4100; color:#fff; text-transform: uppercase; padding:12px;">Description</th>';
    myHtml += '        <th style="font-family: sans-serif; font-size:12px; line-height:1.4;background:#ff4100; color:#fff; text-transform: uppercase; padding:12px;text-align: right;">Qty</th>';
    myHtml += '        <th style="font-family: sans-serif; font-size:12px; line-height:1.4;background:#ff4100; color:#fff; text-transform: uppercase; padding:12px;text-align: right;">Unit Price</th>';
    myHtml += '        <th style="font-family: sans-serif; font-size:12px; line-height:1.4;background:#ff4100; color:#fff; text-transform: uppercase; padding:12px;text-align: right;">Total</th>';
    myHtml += '        <th style="font-family: sans-serif; font-size:12px; line-height:1.4;background:#ff4100; color:#fff; text-transform: uppercase; padding:12px;">Etd</th>';
    myHtml += '    </tr>';
    myHtml += '</thead>';
    myHtml += '<tbody>';
    $(_items).each(function (index, tr) {
        myHtml += '<tr style="background-color: #f2f2f2;">';
        myHtml += '    <td style="padding:12px;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">' + tr.product_sku + '</td>';
        myHtml += '    <td style="padding:12px;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">' + tr.description + '</td>';
        myHtml += '    <td style="padding:12px;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;">' + tr.qty.toFixed(0) + '</td>';
        myHtml += '    <td style="padding:12px;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;">' + tr.subprice.toFixed(2) + '</td>';
        myHtml += '    <td style="padding:12px;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;">' + tr.total_ht.toFixed(2) + '</td>';
        myHtml += '    <td style="padding:12px;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">' + $('#txtPlanneddateofdelivery').val() + '</td>';
        myHtml += '</tr>';
        total_qty += tr.qty, total_gm += tr.total_ht, total_tax += tr.total_localtax1, total_shamt += tr.total_localtax2, total_discamt += tr.discount, total_net += tr.total_ttc;
    });
    myHtml += '</tbody>';
    myHtml += '<tfoot>';
    myHtml += '    <tr>';
    myHtml += '        <td colspan="2" style="padding:12px;color:#4f4f4f; background: #d0d0d0;font-weight: 600;font-family: sans-serif; font-size:12px; line-height:1.4;">Comments or Special Instructions</td>';
    myHtml += '        <td style="padding:12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;">' + total_qty.toFixed(0) + '</td>';
    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">SubTotal</td>';
    myHtml += '        <td style="padding:12px;background:#F2F2F2;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;">$' + total_gm.toFixed(2) + '</td>';
    myHtml += '        <td style="padding:12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"></td>';
    myHtml += '    </tr>';
    myHtml += '    <tr>';
    myHtml += '        <td colspan="3" style="padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"><b>1</b>,Payment term:' + payment_term + ', ' + balance_days + '</td>';
    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">Discount</td>';
    myHtml += '        <td style="background:#F2F2F2;text-align: right;">$' + total_discamt.toFixed(2) + '</td>';
    myHtml += '        <td></td>';
    myHtml += '    </tr>';
    myHtml += '    <tr>';
    myHtml += '        <td colspan="3" style="padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"><b>2</b>,' + location_incoterms + '</td>';
    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">Tax</td>';
    myHtml += '        <td style="background:#F2F2F2;text-align: right;">$' + total_tax.toFixed(2) + '</td>';
    myHtml += '        <td></td>';
    myHtml += '    </tr>';
    myHtml += '    <tr>';
    myHtml += '        <td colspan="3" style="padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"></td>';
    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">Shipping</td>';
    myHtml += '        <td style="background:#F2F2F2;text-align: right;">$' + total_shamt.toFixed(2) + '</td>';
    myHtml += '        <td></td>';
    myHtml += '    </tr>';
    myHtml += '    <tr>';
    myHtml += '        <td colspan="3" style="padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"></td>';
    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">Other</td>';
    myHtml += '        <td style="background:#F2F2F2;text-align: right;">-</td>';
    myHtml += '        <td></td>';
    myHtml += '    </tr>';
    myHtml += '    <tr>';
    myHtml += '        <td colspan="3" style="padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"></td>';
    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;"><b>Total</b></td>';
    myHtml += '        <td style="background:#F2F2F2;padding:4px 12px 4px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;"><b>$' + total_net.toFixed(2) + '</b></td>';
    myHtml += '        <td></td>';
    myHtml += '    </tr>';
    myHtml += '    <tr>';
    myHtml += '        <td colspan="3"></td>';
    myHtml += '        <td class="text-uper" style="background:#F2F2F2;padding:4px 12px 12px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;">Deposit</td>';
    myHtml += '        <td style="background:#F2F2F2;padding:4px 12px 12px 12px;;color:#4f4f4f;font-family: sans-serif; font-size:12px; line-height:1.4;text-align: right;">$0.00</td>';
    myHtml += '        <td></td>';
    myHtml += '    </tr>';
    myHtml += '</tfoot>';
    myHtml += '</table>';

    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '</table>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '</table>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '</table >';

    $('#POModal .modal-body').append(myHtml);

    $("#POModal").modal({ backdrop: 'static', keyboard: false });
    var opt = { strValue1: email, strValue2: $('#lblPoNo').text(), strValue3: $('#POModal .modal-body').html() }
    if (opt.strValue1.length > 5 && is_mail) {
        $.ajax({
            type: "POST", url: '/PurchaseOrder/SendMailInvoice', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
            success: function (result) { console.log(result); },
            error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
            complete: function () { }, async: false
        });
    }
}