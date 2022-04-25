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
   
    let inv_title = is_inv ? 'Invoice' : 'Vendor Sales PO';
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
function printbillmodal(is_inv) {
    let backurl = '/PaymentInvoice/PayMiscBills/';
    let inv_title = is_inv ? 'Invoice' : 'Bill';
    let modalHtml = '<div class="modal-dialog modal-lg">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<div class="modal-header"><h5 class="modal-title">' + inv_title + ' Preview</h5></div>';
    modalHtml += '<div class="modal-body no-padding modal-body-fixHeight"><div class="text-center"><h3>Loading...</h3></div></div>';
    modalHtml += '<div class="modal-footer"><button type="button" class="btn btn-success pull-left btnprintinvoice"><i class="fa fa-print"></i> Print</button ><a class="btn btn-primary" href="/PaymentInvoice/PayMiscBillList">OK</a></div>';
    //modalHtml += '<div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $('<div class="modal in printable autoprint" id="PrintModal" role="dialog" aria-hidden="true"></div>').html(modalHtml).modal({ backdrop: 'static', keyboard: false });
    //console.log('show');  
}

function printbillmodalprint(is_inv) {
    let backurl = '/PaymentInvoice/PayMiscBills/';
    let inv_title = is_inv ? 'Invoice' : 'Bill';
    let modalHtml = '<div class="modal-dialog modal-lg">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<div class="modal-header"><h5 class="modal-title">' + inv_title + ' Preview</h5></div>';
    modalHtml += '<div class="modal-body no-padding modal-body-fixHeight"><div class="text-center"><h3>Loading...</h3></div></div>';
    modalHtml += '<div class="modal-footer"><button type="button" class="btn btn-success pull-left btnprintinvoice"><i class="fa fa-print"></i> Print</button ><button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button></div>';
    //modalHtml += '<div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $('<div class="modal in printable autoprint" id="PrintModal" role="dialog" aria-hidden="true"></div>').html(modalHtml).modal({ backdrop: 'static', keyboard: false });
    //console.log('show');  
}
function getBillPrintDetails(id) {
    if (id > 0) {
        printbillmodalprint(false);
        $.ajaxSetup({ async: false });
        $.get('/PaymentInvoice/miscbill-print', { strValue1: id }).done(function (result) {
            print_miscbilldetails(id, result, false);
        }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
    }
}

function getInvoicePrintDetails(id) {
    if (id > 0) {
        printbillmodal(false);
        $.ajaxSetup({ async: false });
        $.get('/PaymentInvoice/miscbill-print', { strValue1: id }).done(function (result) {
            print_Uniqueinvoicedetails(id, result, false);
        }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
    }
}
function print_Uniqueinvoicedetails(id, result, is_inv) {
    let data = JSON.parse(result.data); console.log(data);
    let inv_title = is_inv ? 'Bill' : 'Bill';
    let inv_titleNew = 'BILL';
    let so_no = parseInt(data['po'][0].fk_projet) || 0;
    let va_cp = so_no > 0 ? 33.3 : 66.3;
    //let oth_email = data['po'][0].user_email, po_authmail = data['po'][0].po_authmail;
    //if (po_authmail != '') {
    //    po_authmail = JSON.parse(po_authmail);
    //    $(po_authmail).each(function (index, tr) { oth_email += ',' + tr.user_email });
    //}
    let total_qty = 0, total_gm = 0.00, total_tax = 0.00, total_shamt = 0.00, total_discamt = 0.00, total_other = 0.00, paid_amt = 0.00; total_net = 0.00;

   // let startingNumber = parseFloat(data['po'][0].PaymentTerm.match(/^-?\d+\.\d+|^-?\d+\b|^\d+(?=\w)/g)) || 0.00;
    //let _com_add = result.com_name + ', <br>' + result.add + ', <br>' + result.city + ', ' + result.state + ' ' + result.zip + ', <br>' + (result.country == "CA" ? "Canada" : result.country == "US" ? "United States" : result.country) + '.<br>';
    //_com_add += 'Phone: ' + result.phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + ' <br> ' + result.email + ' <br> ' + result.website;
    let _com_add = data['com'][0].com_name + ', <br>' + data['com'][0].add + ', <br>' + data['com'][0].city + ', ' + data['com'][0].state + ' ' + data['com'][0].zip + ', <br>' + (data['com'][0].country == "CA" ? "Canada" : data['com'][0].country == "US" ? "United States" : data['com'][0].country) + '.<br>';
    _com_add += 'Phone: ' + data['com'][0].phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + ' <br> ' + data['com'][0].email + ' <br> ' + data['com'][0].website;

    total_shamt = parseFloat(data['po'][0].shippingfee) || 0.00;
    total_other = parseFloat(data['po'][0].otherfee) || 0.00;
    let myHtml = '<table id="invoice" cellpadding="0" cellspacing="0" border="0" style="width:100%;">';
    myHtml += '<tr>';
    myHtml += '    <td align="center" style="padding:0;">';
    myHtml += '        <table class="container_table" cellpadding="0" cellspacing="0" border="0" style="border:2px solid #e6e6e6; width:995px">';
    myHtml += '            <tr>';
    myHtml += '                <td style="padding:15px;">';
    myHtml += '                    <table cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed;width:100%;border-bottom: 1px solid #ddd;">';
    myHtml += '                        <tr>';

    myHtml += '                            <td style="padding:0; vertical-align: top;width:50.9%">';
   /* myHtml += '            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:0px 0px 15px 0px;;color:#2c2e2f;font-weight:200;">Sold to:</h3>';*/
    myHtml += '                                <img src="https://laylaerp.com/Images/layla1-logo.png" alt="" width="95" height="41" class="logo-size"/>';
    myHtml += '                                <p style="margin:15px 0px;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">' + _com_add + '</p>';
    myHtml += '                            </td>';



  

    myHtml += '                            <td style="padding:0; vertical-align: top; width:50.1%" align="right">';
    myHtml += '                                <table cellpadding="0" cellspacing="0" border="0">';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td colspan="2" style="padding:0px 2.5px 0px 0px">';
    myHtml += '                                            <h2 class="pageCurl" style="color:#9da3a6;font-family: sans-serif;font-weight: 700;margin:0px 0px 8px 0px;font-size: 30px;">' + inv_titleNew.toUpperCase() + '</h2>';
    myHtml += '                                        </td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">' + inv_title + ' No #:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].ref + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;"> Date:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].date_creation + '</td>';
    myHtml += '                                    </tr>';

  
        myHtml += '                                    <tr>';
        myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Transaction Type:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].transaction_t + '</td>';
        myHtml += '                                    </tr>';
    //myHtml += '                                    <tr>';
    //myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Customer Type:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].customertype + '</td>';
    //myHtml += '                                    </tr>';
    //myHtml += '                                    <tr>';
    //myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Address:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].fk_address + '</td>';
    //myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Bill Type:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].paymenttype + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Pay Account:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].payaccount + '</td>';
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
    myHtml += '            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:0px 0px 5px 0px;;color:#2c2e2f;font-weight:200;">' + data['po'][0].customertype +' :</h3>';
    myHtml += '            <p class="recipientInfo" style="width: 225px;margin:0px 0px 15px 0px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">';
    myHtml += '               ' + data['po'][0].displayname +  '<br>' + data['po'][0].fk_address ;
    myHtml += '            </p>';
    myHtml += '        </td>';
    myHtml += '     </tr>';
    myHtml += '     </table>';
    myHtml += '</td >';
    myHtml += '</tr >';
    myHtml += '<tr>';
    myHtml += '<td style="padding:0px 15px 0px 15px;">';
    myHtml += '    <table class="product-tables" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">';
    myHtml += '        <thead class="itemdetailsheaderl" style="border: 1px solid #ddd;background-color: #f9f9f9;">';
    myHtml += '            <tr>';
    myHtml += '                <th style="width:5%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">#</th>';
    myHtml += '                <th style="width:30%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemsproduct">Product/Service/Description</th>';
    //myHtml += '                <th style="width:15%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">Description</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemsku">SKU</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">Quantity</th>';
    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">Price</th>';
    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">Tax</th>';
    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Amount</th>';
    myHtml += '            </tr>';
    myHtml += '        </thead>';
    myHtml += '        <tbody class="itemdetailsbody">';
    $(data['pod']).each(function (index, tr) {
    
        myHtml += '<tr style="border-bottom: 1px solid #ddd;">';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">' + tr.sr + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemsproduct">' + tr.product + '</td>';
            // myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">' + tr.discription + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemsku">' + tr.sku + '</td>';
            myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">' + number_format(tr.qty, 0, '.', ',') + '</td>';
            myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">$' + number_format(tr.rate, 2, '.', ',') + '</td>';
            myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">$' + number_format(tr.tax, 2, '.', ',') + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">$' + number_format(tr.total_ttc + tr.tax, 2, '.', ',') + '</td>';
            myHtml += '</tr>';
        total_qty += tr.qty, total_gm += tr.total_ttc, total_tax += tr.tax, total_net += tr.total_ttc + tr.tax;
       
        
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
    myHtml += '                        <td style="border-top: 1px solid #ddd;padding:0px;">';
    //if (so_no < 0) { myHtml += ''; }
    //else {
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
    //}
    myHtml += '                        </td>';
    myHtml += '                    </tr>';

    myHtml += '                </table>';
    myHtml += '            </td>';
    myHtml += '            <td style="vertical-align: top; width:50%; padding:0px;">';
    myHtml += '                <table cellpadding="0" cellspacing="0" style="border:1px solid #ddd;border-top:0px;border-collapse: collapse;width: 100%; table-layout: fixed;">';
    myHtml += '                    <tr>';
    myHtml += '                        <td class="text-right" style="width: 25%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">' + number_format(total_qty, 0, '.', ',') + '</td>';
    myHtml += '                        <td class="text-right" style="border-right: 1px solid #ddd; width: 30%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Subtotal</td>';
    myHtml += '                        <td class="text-right" style="width: 30%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_gm, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
 
    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Amount tax</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_tax, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';

    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Shipping Fee</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_shamt, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';

    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Other Charges</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_other, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Paid</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(paid_amt, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
 
    myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Remaining Unpaid</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_net + total_other + total_shamt - paid_amt, 2, '.', ',') + '</td>';
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

}


function print_miscbilldetails(id, result, is_inv) {
    let data = JSON.parse(result.data); console.log(data);
    let inv_title = is_inv ? 'Bill' : 'Bill';
    let inv_titleNew = 'BILL';
    let so_no = parseInt(data['po'][0].fk_projet) || 0;
    let va_cp = so_no > 0 ? 33.3 : 66.3;
    //let oth_email = data['po'][0].user_email, po_authmail = data['po'][0].po_authmail;
    //if (po_authmail != '') {
    //    po_authmail = JSON.parse(po_authmail);
    //    $(po_authmail).each(function (index, tr) { oth_email += ',' + tr.user_email });
    //}
    let total_qty = 0, total_gm = 0.00, total_tax = 0.00, total_shamt = 0.00, total_discamt = 0.00, total_other = 0.00, paid_amt = 0.00; total_net = 0.00;

    // let startingNumber = parseFloat(data['po'][0].PaymentTerm.match(/^-?\d+\.\d+|^-?\d+\b|^\d+(?=\w)/g)) || 0.00;
    //let _com_add = result.com_name + ', <br>' + result.add + ', <br>' + result.city + ', ' + result.state + ' ' + result.zip + ', <br>' + (result.country == "CA" ? "Canada" : result.country == "US" ? "United States" : result.country) + '.<br>';
    //_com_add += 'Phone: ' + result.phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + ' <br> ' + result.email + ' <br> ' + result.website;
    let _com_add = data['com'][0].com_name + ', <br>' + data['com'][0].add + ', <br>' + data['com'][0].city + ', ' + data['com'][0].state + ' ' + data['com'][0].zip + ', <br>' + (data['com'][0].country == "CA" ? "Canada" : data['com'][0].country == "US" ? "United States" : data['com'][0].country) + '.<br>';
    _com_add += 'Phone: ' + data['com'][0].phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + ' <br> ' + data['com'][0].email + ' <br> ' + data['com'][0].website;

    total_shamt = parseFloat(data['po'][0].shippingfee) || 0.00;
    total_other = parseFloat(data['po'][0].otherfee) || 0.00;
    let myHtml = '<table id="invoice" cellpadding="0" cellspacing="0" border="0" style="width:100%;">';
    myHtml += '<tr>';
    myHtml += '    <td align="center" style="padding:0;">';
    myHtml += '        <table class="container_table" cellpadding="0" cellspacing="0" border="0" style="border:2px solid #e6e6e6; width:995px">';
    myHtml += '            <tr>';
    myHtml += '                <td style="padding:15px;">';
    myHtml += '                    <table cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed;width:100%;border-bottom: 1px solid #ddd;">';
    myHtml += '                        <tr>';

    myHtml += '                            <td style="padding:0; vertical-align: top;width:50.9%">';
    /* myHtml += '            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:0px 0px 15px 0px;;color:#2c2e2f;font-weight:200;">Sold to:</h3>';*/
    myHtml += '                                <img src="https://laylaerp.com/Images/layla1-logo.png" alt="" width="95" height="41" class="logo-size"/>';
    myHtml += '                                <p style="margin:15px 0px;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">' + _com_add + '</p>';
    myHtml += '                            </td>';





    myHtml += '                            <td style="padding:0; vertical-align: top; width:50.1%" align="right">';
    myHtml += '                                <table cellpadding="0" cellspacing="0" border="0">';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td colspan="2" style="padding:0px 2.5px 0px 0px">';
    myHtml += '                                            <h2 class="pageCurl" style="color:#9da3a6;font-family: sans-serif;font-weight: 700;margin:0px 0px 8px 0px;font-size: 30px;">' + inv_titleNew.toUpperCase() + '</h2>';
    myHtml += '                                        </td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">' + inv_title + ' No #:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].ref + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;"> Date:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].date_creation + '</td>';
    myHtml += '                                    </tr>';


    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Transaction Type:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].transaction_t + '</td>';
    myHtml += '                                    </tr>';
    //myHtml += '                                    <tr>';
    //myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Customer Type:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].customertype + '</td>';
    //myHtml += '                                    </tr>';
    //myHtml += '                                    <tr>';
    //myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Address:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].fk_address + '</td>';
    //myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Bill Type:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].paymenttype + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Pay Account:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].payaccount + '</td>';
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
    myHtml += '            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:0px 0px 5px 0px;;color:#2c2e2f;font-weight:200;">' + data['po'][0].customertype + ' :</h3>';
    myHtml += '            <p class="recipientInfo" style="width: 225px;margin:0px 0px 15px 0px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">';
    myHtml += '               ' + data['po'][0].displayname + '<br>' + data['po'][0].fk_address;
    myHtml += '            </p>';
    myHtml += '        </td>';
    myHtml += '     </tr>';
    myHtml += '     </table>';
    myHtml += '</td >';
    myHtml += '</tr >';
    myHtml += '<tr>';
    myHtml += '<td style="padding:0px 15px 0px 15px;">';
    myHtml += '    <table class="product-tables" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">';
    myHtml += '        <thead class="itemdetailsheaderl" style="border: 1px solid #ddd;background-color: #f9f9f9;">';
    myHtml += '            <tr>';
    myHtml += '                <th style="width:5%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">#</th>';
    myHtml += '                <th style="width:30%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemsproduct">Product/Service/Description</th>';
    //myHtml += '                <th style="width:15%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">Description</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemsku">SKU</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">Quantity</th>';
    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">Price</th>';
    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">Tax</th>';
    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Amount</th>';
    myHtml += '            </tr>';
    myHtml += '        </thead>';
    myHtml += '        <tbody class="itemdetailsbody">';
    $(data['pod']).each(function (index, tr) {

        myHtml += '<tr style="border-bottom: 1px solid #ddd;">';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">' + tr.sr + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemsproduct">' + tr.product + '</td>';
        // myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">' + tr.discription + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemsku">' + tr.sku + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">' + number_format(tr.qty, 0, '.', ',') + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">$' + number_format(tr.rate, 2, '.', ',') + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">$' + number_format(tr.tax, 2, '.', ',') + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">$' + number_format(tr.total_ttc + tr.tax, 2, '.', ',') + '</td>';
        myHtml += '</tr>';
        total_qty += tr.qty, total_gm += tr.total_ttc, total_tax += tr.tax, total_net += tr.total_ttc + tr.tax;


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
    myHtml += '                        <td style="border-top: 1px solid #ddd;padding:0px;">';
    //if (so_no < 0) { myHtml += ''; }
    //else {
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
    //}
    myHtml += '                        </td>';
    myHtml += '                    </tr>';

    myHtml += '                </table>';
    myHtml += '            </td>';
    myHtml += '            <td style="vertical-align: top; width:50%; padding:0px;">';
    myHtml += '                <table cellpadding="0" cellspacing="0" style="border:1px solid #ddd;border-top:0px;border-collapse: collapse;width: 100%; table-layout: fixed;">';
    myHtml += '                    <tr>';
    myHtml += '                        <td class="text-right" style="width: 25%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">' + number_format(total_qty, 0, '.', ',') + '</td>';
    myHtml += '                        <td class="text-right" style="border-right: 1px solid #ddd; width: 30%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Subtotal</td>';
    myHtml += '                        <td class="text-right" style="width: 30%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_gm, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';

    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Amount tax</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_tax, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';

    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Shipping Fee</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_shamt, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';

    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Other Charges</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_other, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Paid</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(paid_amt, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';

    myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Remaining Unpaid</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_net + total_other + total_shamt - paid_amt, 2, '.', ',') + '</td>';
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