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
    //modalHtml += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button><h5 class="modal-title">' + inv_title + ' Preview</h5></div>';
    modalHtml += '<div class="modal-body no-padding modal-body-fixHeight"><div class="text-center"><h3>Loading...</h3></div></div>';
    modalHtml += '<div class="modal-footer"><button type="button" class="btn btn-success pull-left btnprintinvoice"><i class="fa fa-print"></i> Print</button ><button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button></div>';
    //modalHtml += '<div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $('<div class="modal in printable autoprint" id="PrintModal" role="dialog" aria-hidden="true"></div>').html(modalHtml).modal({ backdrop: 'static', keyboard: false });
    //console.log('show');
}
function GetCheckDepositPrint(id, is_mail) {
    if (id > 0) {
        printmodal(false);
        var option = { strValue1: id };
        $.ajax({
            url: "/CheckDeposit/GetCheckDepositPrint", type: "Get", beforeSend: function () { }, data: option,
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
    let data = JSON.parse(result.data); //console.log(result);
    let myHtml = '<table id="invoice" cellpadding="0" cellspacing="0" border="0" style="width:100%;">';
    myHtml += '<tr>';
    myHtml += '    <td align="center" style="padding:0;">';
    myHtml += '        <table class="container_table" cellpadding="0" cellspacing="0" border="0" style="border:2px solid #e6e6e6; width:995px">';
    myHtml += '            <tr>';
    myHtml += '                <td style="padding:15px;">';
    myHtml += '                    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border: 0px;">';
    myHtml += '                        <tr>';
    myHtml += '                            <td style="padding:0; vertical-align: top;">';
    myHtml += '                                <h2 class="pageCurl" style="color:#9da3a6;text-transform: uppercase;font-family: sans-serif;font-weight: 700;margin:0px 0px 8px 0px;font-size: 30px;">Check deposit</h2>';
    myHtml += '                            </td>';
    myHtml += '                        </tr>';
    myHtml += '                      </table>';
    myHtml += '                 </td>';
    myHtml += '            </tr>';
    myHtml += '            <tr>';
    myHtml += '               <td style="padding:0px 15px 0px 15px;">';
    myHtml += '                       <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;table-layout:fixed; width:100%; margin-bottom:20px;>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="padding:0; width:50%;border: 1px solid #ddd;">';
    myHtml += '                                          <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">';
    myHtml += '                                    <tbody>';
    myHtml += '                                           <tr>';
    myHtml += '                                                   <th style="width:30%;border-right: 1px solid #ddd;border-bottom: 1px solid #ddd; padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Ref.</th>'
    myHtml += '                                                   <td style="width:70%;border-bottom: 1px solid #ddd; padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">' + data['po'][0].ref +'</td>'
    myHtml += '                                           </tr>';
    myHtml += '                                           <tr>';
    myHtml += '                                                   <th style="width:30%;border-right: 1px solid #ddd;border-bottom: 1px solid #ddd; padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Date.</th>'
    myHtml += '                                                   <td style="width:70%;border-bottom: 1px solid #ddd; padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">' + data['po'][0].creation_date + '</td>'
    myHtml += '                                           </tr>';
    myHtml += '                                           <tr>';
    myHtml += '                                                   <th style="width:30%;border-right: 1px solid #ddd;border-bottom: 1px solid #ddd; padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Owner.</th>'
    myHtml += '                                                   <td style="width:70%;border-bottom: 1px solid #ddd; padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">' + data['po'][0].CompanyName + '</td>'
    myHtml += '                                           </tr>';
    myHtml += '                                           <tr>';
    myHtml += '                                                   <th style="width:30%;border-right: 1px solid #ddd;border-bottom: 1px solid #ddd; padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Account.</th>'
    myHtml += '                                                   <td style=" padding:5px 0px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">'

    myHtml += '                                          <table cellpadding="0" cellspacing="0" border="0" style="table-layout: fixed;border-collapse:collapse;width:100%;">';
    myHtml += '                                    <thead>';
    myHtml += '                                           <tr>';
    myHtml += '                                                   <th style="border-bottom: 1px solid #ddd; padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Bank Code</th>'
    myHtml += '                                                   <th style="border-bottom: 1px solid #ddd; padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Account Number</th>'
    myHtml += '                                           </tr>';
    myHtml += '                                    </thead>';
    myHtml += '                                    <tbody>';
    myHtml += '                                           <tr>';
    myHtml += '                                                  <td style="border-bottom: 1px solid #ddd; padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">' + data['po'][0].code_bank+'</td>'
    myHtml += '                                                   <td style="border-bottom: 1px solid #ddd; padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">' + data['po'][0].account_number+'</td>'
    myHtml += '                                           </tr>';
    myHtml += '                                           <tr>';

    myHtml += '                                           <td colspan="2" style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Account owner name: ' + data['po'][0].CompanyName+'</td>';
    myHtml += '                                           </tr>';

    myHtml += '                                     </tbody>';
    myHtml += '                                 </table>';
    myHtml += '                              </td>';
    myHtml += '                            </tr>';
    myHtml += '                           </tbody>';
    myHtml += '                        </table>';
    myHtml += '                        </td>';
    myHtml += '                        <td style="vertical-align: top;border: 1px solid #ddd;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4; width:50%;">';
    myHtml += '                        <div class="signature">';
    myHtml += '                           Signature ';
    myHtml += '                         </div>';
    myHtml += '                        </td>';
    myHtml += '                        </tr>';
    myHtml += '                     </table>';
    myHtml += '                        </td>';
    myHtml += '                      </tr>';
    myHtml += '                <tr>';
    myHtml += '                <td style="padding:0px 15px 15px 15px;">';
    myHtml += ' <table class="product-tables" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">'
    myHtml += '  <thead class="itemdetailsheader" style="border: 1px solid #ddd;background-color: #f9f9f9;">'
    myHtml += '  <tr>'
    myHtml += '   <th style="border-right: 1px solid #ddd;width:15%;padding:5px 12px;text-align:center;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">No. of check</th>'
    myHtml += ' <th style="border-right: 1px solid #ddd;width:55%;padding:5px 12px;text-align:center;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">' + data['po'][0].chkcount +'</th>'
    myHtml += ' <th style="border-right: 1px solid #ddd;width:15%;padding:5px 12px;text-align:center;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">Total</th>'
    myHtml += ' <th style="width:15%;padding:5px 12px;text-align:center;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">$' + data['po'][0].amount.toFixed(2) +'</th>'
    myHtml += '  </tr>'
    myHtml += '  </thead>'
    myHtml += ' </table>'
    myHtml += '      </td>'
    myHtml += '    </tr> '
    myHtml += '   <tr>'
    myHtml += '<td style="padding:0px 15px 0px 15px;">';
    myHtml += '    <table class="product-tables" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">';
    myHtml += '         <thead class="itemdetailsheader" style="border: 1px solid #ddd;background-color: #f9f9f9;">';
    myHtml += '            <tr>';
    myHtml += '                 <th style="border-right: 1px solid #ddd;width:15%;padding:5px 12px;text-align:center;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">#</th>';
    myHtml += '                <th style="border-right: 1px solid #ddd;width:20%;padding:5px 12px;text-align:center;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">Check No</th>';
    myHtml += '                <th style="border-right: 1px solid #ddd;width:25%;padding:5px 12px;text-align:center;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">Check Details</th>';
    myHtml += '                <th style="border-right: 1px solid #ddd;width:20%;padding:5px 12px;text-align:center;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">Transmitter</th>';
    myHtml += '                <th style="width:20%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Amount</th>';
    myHtml += '            </tr>';
    myHtml += '        </thead>';
    myHtml += '         <tbody class="itemdetailsbody">';

    $(data['pod']).each(function (index, tr) {
       // if (tr.product_type == 0) {
            myHtml += '<tr style="border-bottom: 1px solid #ddd;">';
        myHtml += '    <td style="padding:5px 12px;text-align:center;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">' + tr.row_num + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:center;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">' + tr.num_payment + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:center;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">' + tr.comments + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:center;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">' + tr.Transmitter + '</td>';
            myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">$' + number_format(tr.amount, 2, '.', ',') + '</td>';
            myHtml += '</tr>';  
        //}
    });
    myHtml += '   </tr>'
    myHtml += '</table > ';
    myHtml += '</td > ';
    myHtml += '</tr > ';
    myHtml += '</table >';
    $('#PrintModal .modal-body').empty().append(myHtml);    
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

