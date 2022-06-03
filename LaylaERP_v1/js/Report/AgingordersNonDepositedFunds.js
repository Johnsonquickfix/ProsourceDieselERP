$(document).ready(function () {
    $("#loader").hide();
    //$('#txtOrderDate').daterangepicker({
    //    ranges: {
    //        'Today': [moment(), moment()],
    //        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    //        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    //        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    //        'This Month': [moment().startOf('month'), moment().endOf('month')],
    //        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    //        'This Year': [moment().startOf('year'), moment().endOf('year')]
    //    },
    //    startDate: moment(), autoUpdateInput: false, alwaysShowCalendars: true,
    //    locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto",
    //}, function (start, end, label) {
    //    $('#txtOrderDate').val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
    //    dataGridLoad();
    //});
    $('#txtOrderDate').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        startDate: moment().subtract(1, 'month'), autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto"
    },
    );

    dataGridLoad();

    $('#btnsendmail').click(function () {
        //PurchaseOrderGrid();
        Sendnondepositfund_mail();
    });
     
});

function dataGridLoad() {
    //let searchText = localStorage.getItem('_search');
    //if ($('#filter-by-date').val() != "0") monthYear = $('#filter-by-date').val();
    //let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    //let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    //let payment = $('#ddltransaction').val();
    //if ($('#txtOrderDate').val() == '') { sd = ''; ed = '' };
    //table_oh = $('#dtdata').DataTable({
    //    oSearch: { "sSearch": searchText }, order: [[0, "desc"]], //columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
    //    lengthMenu: [[10, 20, 50], [10, 20, 50]],
    //    destroy: true, bProcessing: true, responsive: true, bServerSide: true, bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
    //    language: {
    //        lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
    //        infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
    //    },
    //    //initComplete: function () {
    //    //    $('.dataTables_filter input').unbind();
    //    //    $('.dataTables_filter input').bind('keyup', function (e) {
    //    //        var code = e.keyCode || e.which;
    //    //        if (code == 13) { table_oh.search(this.value).draw(); }
    //    //    });
    //    //},
    //    sAjaxSource: "/reports/payment-transactions",
    //    fnServerData: function (sSource, aoData, fnCallback, oSettings) {
    //        aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed }, { name: "strValue3", value: payment });
    //        if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
    //        oSettings.jqXHR = $.ajax({
    //            dataType: 'json', type: "GET", url: sSource, data: aoData,
    //            success: function (data) {
    //                let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
    //                return fnCallback(dtOption);
    //            }
    //        });
    //    },
    //    columns: [
    //        {
    //            data: 'id', title: 'Order ID', sWidth: "10%", class: 'text-left',
    //            render: function (id, type, full, meta) {
    //                if (full.post_mime_type == 'shop_order_erp') return '#' + id + ' <i class="glyphicon glyphicon-user" title="Order created from ERP Admin." aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>';
    //                else return '#' + id;
    //            }

    //        },
    //        { data: 'post_date', title: 'Order Date', sWidth: "10%" },
    //        {
    //            data: 'post_status', title: 'Status', sWidth: "10%", render: function (data, type, row) {
    //                if (data == 'wc-pending') return 'Pending payment';
    //                else if (data == 'wc-processing') return 'Processing';
    //                else if (data == 'wc-on-hold') return 'On hold';
    //                else if (data == 'wc-completed') return 'Completed';
    //                else if (data == 'wc-cancelled') return 'Cancelled';
    //                else if (data == 'wc-refunded') return 'Refunded';
    //                else if (data == 'wc-failed') return 'Failed';
    //                else if (data == 'wc-cancelnopay') return 'Cancelled - No Payment';
    //                else if (data == 'wc-pendingpodiuminv') return 'Pending Podium Invoice';
    //                else if (data == 'wc-podium') return 'Order via Podium';
    //                else if (data == 'wc-podiumrefund') return 'Podium Refunded';
    //                else if (data == 'draft') return 'draft';
    //                else return '-';
    //            }
    //        },
    //        { data: 'transaction_id', title: 'Trans. ID', sWidth: "10%" },
 
    //        { data: 'order_amount', title: 'Order Amt.', className: 'text-right', sWidth: "8%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            
    //    ],
    //    "dom": 'lBfrtip',
    //    "buttons": [
    //        {
    //            extend: 'csv',
    //            className: 'button',
    //            text: '<i class="fas fa-file-csv"></i> Export',
    //            filename: function () {
    //                // var d = new Date();
    //                return 'Agingorders_' + $("#txtOrderDate").val().replaceAll('/', '.');
    //            },
    //        },
    //        {
    //            extend: 'print',
    //            className: 'button',
    //            text: '<i class="fas fa-file-csv"></i> Print',
    //            title: function () {
    //                return "Layla Sleep Inc - Aging orders";
    //            },
    //            footer: true,
    //            exportOptions: {
    //                columns: [0, 1, 2, 3, 4],
    //            },
    //            filename: function () {
    //                //var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    //                return 'Agingorders_' + $("#txtOrderDate").val().replaceAll('/', '.');
    //            },
    //        }, 
    //    ],

        let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
        let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
        let payment = $('#ddltransaction').val();
        if($('#txtOrderDate').val() == '') { sd = ''; ed = '' };
    var obj = { strValue1: sd, strValue2: ed, strValue3: payment }
    var table_EL = $('#dtdata').DataTable({
        //columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': false, 'targets': [9] }], order: [[9, "desc"]],
        order: [[0, "desc"], [1, "desc"]], ordering: true, destroy: true, bProcessing: true, bServerSide: false, bAutoWidth: false, searching: true, responsive: true, lengthMenu: [[20, 50, 100], [20, 50, 100]],
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        //initComplete: function () {
        //    $('#JournalListdata_filter input').unbind();
        //    $('#JournalListdata_filter input').bind('keyup', function (e) {
        //        var code = e.keyCode || e.which;
        //        if (code == 13) { table_EL.search(this.value).draw(); }
        //    });
        //},

        ajax: {
            url: '/Reports/GetTransactionList', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { console.log(JSON.parse(data)); return JSON.parse(data); }
        },

        aoColumns: [
            {
                data: 'id', title: 'Order ID', sWidth: "10%", class: 'text-left',
                render: function (id, type, full, meta) {
                    if (full.post_mime_type == 'shop_order_erp') return '#' + id + ' <i class="glyphicon glyphicon-user" title="Order created from ERP Admin." aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>';
                    else return '#' + id;
                }

            },
            { data: 'post_date', title: 'Order Date', sWidth: "10%" },
            {
                data: 'post_status', title: 'Status', sWidth: "10%", render: function (data, type, row) {
                    if (data == 'wc-pending') return 'Pending payment';
                    else if (data == 'wc-processing') return 'Processing';
                    else if (data == 'wc-on-hold') return 'On hold';
                    else if (data == 'wc-completed') return 'Completed';
                    else if (data == 'wc-cancelled') return 'Cancelled';
                    else if (data == 'wc-refunded') return 'Refunded';
                    else if (data == 'wc-failed') return 'Failed';
                    else if (data == 'wc-cancelnopay') return 'Cancelled - No Payment';
                    else if (data == 'wc-pendingpodiuminv') return 'Pending Podium Invoice';
                    else if (data == 'wc-podium') return 'Order via Podium';
                    else if (data == 'wc-podiumrefund') return 'Podium Refunded';
                    else if (data == 'draft') return 'draft';
                    else return '-';
                }
            },
            { data: 'transaction_id', title: 'Trans. ID', sWidth: "10%" },

            { data: 'order_amount', title: 'Order Amt.', className: 'text-right', sWidth: "8%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            { 'data': 'daysdiff', className: 'text-right', title: 'Aging Days', sWidth: "10%" },

     
        ],
        dom: 'lBftipr',
        buttons: [
            {
                extend: 'csv', className: 'button', text: '<i class="fas fa-file-csv"></i> CSV',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4,5],

                },
                filename: function () {
                    if (sd == '') {
                        let d = new Date(); let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                        return 'Agingorders_NonDepositedFunds ' + e;

                    }
                    else {
                        let e = sd + '-' + ed;
                        return 'Agingorders_NonDepositedFunds ' + e;
                    }
                },
            },

            {
                extend: 'print',
                //title: '<h3 style="text-align:center">Layla Sleep Inc.</h3><br /><h3 style="text-align:left">Chart of accounts</h3>',
                title: '', className: 'button', text: '<i class="fas fa-file-csv"></i> Print', footer: false,
                exportOptions: { columns: [0, 1, 2, 3, 4,5], },
                filename: function () {
                    if (sd == '') {
                        let d = new Date(); let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                        return 'Agingorders_NonDepositedFunds ' + e;

                    }
                    else {
                        let e = sd + '-' + ed;
                        return 'Agingorders_NonDepositedFunds ' + e;
                    }
                },
                messageTop: function () { return '<h3 style = "text-align:center"> Layla Sleep Inc.</h3 ><br /><h3 style="text-align:left">Aging orders Non Deposited Funds</h3>'; },
            }
        ],

    });
}

function Sendnondepositfund_mail() {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };

    var option = { strValue1: sd, strValue2: ed };
    // $.get("/Reception/GetReceveOrderPrint", option).then(response => { send_mail(id, response); }).catch(err => { });
    $.get("/Reports/GetNonDepositedFundlist", option).then(response => {
        //  $("#loader").show();

        let data = JSON.parse(response.data);
         console.log(data['pod'].length);
        if (data['pod'].length > 0) {
            send_mail(1, response);
        }
        else {
            swal('Alert!', "No record found.", 'error');
        }
        // $("#loader").hide();
    }).catch(err => { });

}
function send_mail(id, result) {
    let data = JSON.parse(result.data);
    //console.log('jsondata', result);
    var numberRenderer = $.fn.dataTable.render.number(',', '.', 2,).display;
    //let inv_title = 'Bill'; // is_inv ? 'Bill' : 'Receive Order';
    let inv_titleNew = 'The list of aging orders in non-deposited funds (' + $("#txtOrderDate").val() +' )', po_authmail = data['po'][0].po_authmail;
    //let total_qty = 0, total_gm = 0.00, total_tax = 0.00, total_shamt = 0.00, total_discamt = 0.00, total_other = 0.00, paid_amt = 0.00; total_net = 0.00;
    //  console.log('Printss', pono);
    // let _com_add = result.name + ', <br>' + result.add + ', <br>' + result.city + ', ' + result.state + ' ' + result.zip + ', <br>' + (result.country == "CA" ? "Canada" : result.country == "US" ? "United States" : result.country) + '.<br>';
    // _com_add += 'Phone: ' + result.phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + ' <br> ' + result.email + ' <br> ' + result.website;

    //let startingNumber = parseFloat(data['po'][0].PaymentTerm.match(/^-?\d+\.\d+|^-?\d+\b|^\d+(?=\w)/g)) || 0.00;
    //console.log('Print',pono);
    let myHtml = '<table id="Non-Deposited-Funds" cellpadding="0" cellspacing="0" border="0" style="width:100%;">';
    myHtml += '<tr>';
    myHtml += '                                        <td  style="padding:0px 2.5px">';
    myHtml += '                                        <img src="https://laylaerp.com/Images/layla1-logo.png" alt="" width="95" height="41" class="logo-size"/>';
    myHtml += '                                            <h2 class="pageCurl" style="color:#9da3a6;font-family: sans-serif;font-weight: 700;margin:0px 0px 8px 0px;font-size: 30px;">' + inv_titleNew + '</h2>';
    myHtml += '                                        </td>';
    myHtml += ' </tr>';
    myHtml += '<tr>';
    myHtml += '<td style="padding:0px 15px 0px 15px;">';
    myHtml += '    <table class="product-tables" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">';
    myHtml += '        <thead class="itemdetailsheader" style="border: 1px solid #ddd;background-color: #f9f9f9;">';
    myHtml += '            <tr>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">Order ID#</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">Order Date</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">Status</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">Payment Method</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Transaction ID</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Amount</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Aging Days</th>';
    //myHtml += '                <th style="width:10%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Modified Date</th>';
    myHtml += '            </tr>';
    myHtml += '        </thead>';
    myHtml += '        <tbody class="itemdetailsbody">';
    $(data['pod']).each(function (index, tr) {
        //if (tr.product_type == 0) {
        myHtml += '<tr style="border-bottom: 1px solid #ddd;">';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">' + tr.id + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdate_creation">' + tr.post_date + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdate_fk_projet">' + tr.post_status + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemvendor_name">' + tr.payment_method + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemwarehouse_name">' + tr.transaction_id + '</td>'; 
        myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">$' + numberRenderer(tr.order_amount) + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">' + tr.daysdiff + '</td>';
        myHtml += '</tr>';
        //}
    });
    myHtml += '        </tbody>';
    myHtml += '    </table>';
    myHtml += '</td>';
    myHtml += '</tr >';
    myHtml += '</table >';
    //console.log(myHtml);

    let opt = { strValue1: po_authmail, strValue2: $("#txtOrderDate").val(), strValue3: myHtml }
     console.log(opt);
    //let opt = { strValue1: 'johnson.quickfix@gmail.com', strValue2: data['po'][0].ref, strValue3: myHtml, strValue5: _com_add }
    if (opt.strValue1.length > 1) {
        $.ajax({
            type: "POST", url: '/Reports/SendNonDepositedFundMail', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (result) { console.log(result); },
            error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
            complete: function () { swal('Success!', 'E-mail sent.', 'success'); $("#loader").hide(); }//, async: false
        });
    }
}



