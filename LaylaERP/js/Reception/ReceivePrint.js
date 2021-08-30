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
    myHtml += '<div class="invoice">';
    myHtml += '<div class="section invoiceDetails">';
    myHtml += '        <div class="row invoiceInfo" style="font-size: 14px;">';
    myHtml += '            <div class="col-xs-12">';
    myHtml += '                <div class="row" style="padding:0px 15px;margin-bottom:10px;display: flex;">';
    myHtml += '                    <div id="printPreview" style="width: 41.66666667%;">';
    myHtml += '                        <div class="businessLogo"><img src="/Images/layla1-logo.png" alt="" id="logoUrl" style="width: 90px;" /></div>';
    myHtml += '                        <div class="businfobox">' + result.add + '<br>' + result.city + ', ' + result.state + ' ' + result.zip + ', <br>' + (result.country == "CA" ? "Canada" : result.country == "US" ? "United States" : result.country) + '</div>';
    myHtml += '                        <div class="businfobox">Phone: 001 ' + result.phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '<br/>' + result.email + '<br />' + result.website + '<br /></div>';
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