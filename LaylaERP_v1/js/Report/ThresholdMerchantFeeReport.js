$(document).ready(function () {

    $("#loader").hide(); //$('.select2').select2();
    $('#txtDate').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'This Year': [moment().startOf('year'), moment().endOf('year')]
        },
        startDate: moment().subtract(1, 'month'), autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'left', orientation: "left auto"
    }, function (start, end, label) {
        $('#txtDate').val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
        // dataGridLoad();
        dataGridLoad();
    });
    // $('#txtDate').val('');
    //$('#txtDate').on('cancel.daterangepicker', function (ev, picker) { $(this).val(''); dataGridLoad(); });
    //PartiallyGrid();
    //PoClosureGrid();

   // dataGridLoad();


    $('#btnsearch').click(function () {
        //dataGridLoad();
        SendPO_Approval();
    });
    $('#btnsearchdetails').click(function () {
        //dataGridLoad();
        dataGridLoad();
    });
});


function dataGridLoad() {
    let paymentmethod =  $("#ddlstatus").val();
    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    var obj = { strValue1: sd, strValue2: ed, strValue3: paymentmethod,}
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };
    let table = $('#dtdata').DataTable({
        //columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': false, 'targets': [9] }], order: [[9, "desc"]],
        order: [[0, "desc"]], destroy: true, bProcessing: true, bServerSide: false, bAutoWidth: false, searching: true, responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('.dataTables_filter input').unbind();
            $('.dataTables_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table.search(this.value).draw(); }
            });
        },
        ajax: {
            url: '/Reports/GetThresholdlist', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
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
            { data: 'settlement_date', title: 'Settle Date', sWidth: "10%" },
            { data: 'order_amount', title: 'Order Amt.', className: 'text-right', sWidth: "8%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            { data: 'payment_amount', title: 'Settle Amt.', className: 'text-right', sWidth: "8%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            { data: 'payment_fee', title: 'Merchant Fees', className: 'text-right', sWidth: "8%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            { data: 'refund_amount', title: 'Refund Amt.', className: 'text-right', sWidth: "8%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            { data: 'threshold', title: 'Threshold', className: 'text-right', sWidth: "8%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            { data: 'avgval', title: 'Exide Amount.', className: 'text-right', sWidth: "8%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            //{ data: 'payment_fee', title: 'Fee', sWidth: "10%", render: $.fn.dataTable.render.number(',', '.', 3, '$') },
            //{
            //    data: 'payment_stauts', title: 'Settlement State', sWidth: "10%", render: function (data, type, row) {
            //        if (data == 'paid') return '<span class="badge bg-success">Settled</span>';
            //        else if (data == 'failed') return '<span class="badge bg-danger">Settlement Error</span>';
            //        else return '<span class="badge bg-warning">' + (data == null ? '' : data) + '</span>';
            //    }
            //},
            //{ data: 'delivery_status', title: 'Delivery Status', sWidth: "10%", render: function (data, type, row) { if (row.delivery_status) return '<span class="badge bg-success">Delivered</span>'; else return '<span class="badge bg-warning">Non Delivered</span>'; } },
        ],
        "dom": 'Bfrtip',
        "buttons": [
            {
                extend: 'csv',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> Export',
                filename: function () {
                    // var d = new Date();
                    return 'Threshold_Merchant_Fee_Report_' + $("#txtDate").val().replaceAll('/', '.');
                },

            },
            {
                extend: 'print',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> Print',
                title: function () {
                    return "Layla Sleep Inc - Threshold Merchant Fee Report";
                },
                footer: true,
                exportOptions: {
                    columns: [0, 1, 2, 5, 6, 7, 8, 9,10],
                },
                filename: function () {
                    //var from = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
                    return 'Threshold_Merchant_Fee_Report_' + $("#txtDate").val().replaceAll('/', '.');
                },
            },

            {
                extend: 'pdfHtml5',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> PDF',
                footer: true,
                exportOptions: {
                    columns: [0, 1, 2, 5, 6, 7, 8, 9,10],

                },
                customize: function (doc) {
                    //doc.defaultStyle.alignment = 'right';
                    doc.styles.tableHeader.alignment = 'left';
                    // doc.styles.tableHeader[2].alignment = 'right';
                    // doc.content[1].alignment = ['left', 'right', 'right'];

                    doc.content[0].text = "Layla Sleep Inc - Threshold Merchant Fee Report";
                    doc.content[0].text.alignment = 'left';

                    var rowCountd = table.rows().count() + 1;
                    for (i = 0; i < rowCountd; i++) {
                        doc.content[1].table.body[i][6].alignment = 'right';
                    };

                    var rowCount = doc.content[1].table.body.length;
                    for (i = 1; i < rowCount; i++) {
                        doc.content[1].table.body[i][6].alignment = 'right';
                        //doc.content[1].table.body[i][1].alignment = 'right';

                    }


                    // doc.styles.tableHeader.alignment = ['left', 'right', 'right'];
                    //doc.content[1].table.widths =
                    //    Array(doc.content[1].table.body[0].length + 1).join('*').split('');

                    // doc.content[1].table.widths = ['50%', '25%', '25%'];


                },

                filename: function () {
                    // var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
                    return 'Threshold_Merchant_Fee_Report__' + $("#txtDate").val().replaceAll('/', '.');
                },
            },


        ],

    });
}


function dataGridLoadold() {
    let urid = parseInt($("#ddlSearchStatus").val());
    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };
    let table = $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: false, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('.dataTables_filter input').unbind();
            $('.dataTables_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Reports/GetNonInvoicedSalesPO",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed });
            aoData.push({ name: "strValue3", value: urid });
            var col = 'order_id';
            if (oSettings.aaSorting.length > 0) {
                //var col = oSettings.aaSorting[0][0] == 2 ? "refordervendor" : oSettings.aaSorting[0][0] == 3 ? "vendor_name" : oSettings.aaSorting[0][0] == 4 ? "vendor_name" : oSettings.aaSorting[0][0] == 5 ? "city" : oSettings.aaSorting[0][0] == 6 ? "zip" : oSettings.aaSorting[0][0] == 6 ? "date_livraison" : oSettings.aaSorting[0][0] == 7 ? "Status" : "ref";
                aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data });

            }
            //console.log(aoData);
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            { data: 'ref', title: 'PO No', sWidth: "10%" },
            { data: 'date_creation', title: 'Order Date', sWidth: "10%" },
            { data: 'fk_projet', title: 'SO No.', sWidth: "10%" },
            { data: 'vendor_name', title: 'Vendor Name', sWidth: "10%" },
            { data: 'warehouse_name', title: 'Destination', sWidth: "10%" },
            { data: 'destination', title: 'Destination Address', sWidth: "20%" },
            { data: 'total_ttc', title: 'Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number(',', '.', 2, '$').display },
            { data: 'date_livraison_s', title: 'Planned date of delivery', sWidth: "10%", render: function (id, type, full, meta) { return full.date_livraison; } },
            { data: 'Status', title: 'Status', sWidth: "10%" },
            //{ data: 'date_modified_s', title: 'Modified Date', sWidth: "8%", render: function (id, type, full, meta) { return full.date_modified; } },
        ],
        "dom": 'Bfrtip',
        "buttons": [
            {
                extend: 'csv',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> Csv',
                filename: function () {
                    // var d = new Date();
                    return 'Non-InvoicedSalesPO_' + $("#txtDate").val().replaceAll('/', '.');
                },

            },
            {
                extend: 'print',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> Print',
                title: function () {
                    return "Layla Sleep Inc - Non-Invoiced Sales PO";
                },
                footer: true,
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7],
                },
                filename: function () {
                    //var from = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
                    return 'Non-InvoicedPO_' + $("#txtDate").val().replaceAll('/', '.');
                },
            },

            {
                extend: 'pdfHtml5',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> PDF',
                footer: true,
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7],

                },
                customize: function (doc) {
                    //doc.defaultStyle.alignment = 'right';
                    doc.styles.tableHeader.alignment = 'left';
                    // doc.styles.tableHeader[2].alignment = 'right';
                    // doc.content[1].alignment = ['left', 'right', 'right'];

                    doc.content[0].text = "Layla Sleep Inc - Non-Invoiced Sales PO";
                    doc.content[0].text.alignment = 'left';

                    var rowCountd = table.rows().count() + 1;
                    for (i = 0; i < rowCountd; i++) {
                        doc.content[1].table.body[i][6].alignment = 'right';
                    };

                    var rowCount = doc.content[1].table.body.length;
                    for (i = 1; i < rowCount; i++) {
                        doc.content[1].table.body[i][6].alignment = 'right';
                        //doc.content[1].table.body[i][1].alignment = 'right';

                    }


                    // doc.styles.tableHeader.alignment = ['left', 'right', 'right'];
                    //doc.content[1].table.widths =
                    //    Array(doc.content[1].table.body[0].length + 1).join('*').split('');

                    // doc.content[1].table.widths = ['50%', '25%', '25%'];


                },

                filename: function () {
                    // var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
                    return 'Non-InvoicedPO_' + $("#txtDate").val().replaceAll('/', '.');
                },
            },


        ],


    });
}


function SendPO_Approval() {
    let paymentmethod = $("#ddlstatus").val();
    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };
    
    var option = { strValue1: sd, strValue2: ed, strValue3: paymentmethod, }
    // $.get("/Reception/GetReceveOrderPrint", option).then(response => { send_mail(id, response); }).catch(err => { });
    $.get("/Reports/GetSendMailThreshold", option).then(response => {
        //  $("#loader").show();

        let data = JSON.parse(response.data);
        //  console.log(data['pod'].length);
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
    let inv_titleNew = 'Threshold Merchant Fee', po_authmail = data['po'][0].po_authmail;
    //let total_qty = 0, total_gm = 0.00, total_tax = 0.00, total_shamt = 0.00, total_discamt = 0.00, total_other = 0.00, paid_amt = 0.00; total_net = 0.00;
    //  console.log('Printss', pono);
    // let _com_add = result.name + ', <br>' + result.add + ', <br>' + result.city + ', ' + result.state + ' ' + result.zip + ', <br>' + (result.country == "CA" ? "Canada" : result.country == "US" ? "United States" : result.country) + '.<br>';
    // _com_add += 'Phone: ' + result.phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + ' <br> ' + result.email + ' <br> ' + result.website;

    //let startingNumber = parseFloat(data['po'][0].PaymentTerm.match(/^-?\d+\.\d+|^-?\d+\b|^\d+(?=\w)/g)) || 0.00;
    //console.log('Print',pono);
    let status = "";
    let myHtml = '<table id="threshold-fee" cellpadding="0" cellspacing="0" border="0" style="width:100%;">';
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
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">Order#</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">Order Date</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">Status</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">Trans. ID</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Settle Date</th>';
    myHtml += '                <th style="width:30%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Order Amt.</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Settle Amt.</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Merchant Fees</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Refund Amt</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Threshold</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Exide Amount</th>';

    //myHtml += '                <th style="width:10%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Modified Date</th>';
    myHtml += '            </tr>';
    myHtml += '        </thead>';
    myHtml += '        <tbody class="itemdetailsbody">';
    $(data['pod']).each(function (index, tr) {
        //if (tr.product_type == 0) {
        myHtml += '<tr style="border-bottom: 1px solid #ddd;">';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">' + tr.id + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdate_creation">' + tr.post_date + '</td>';
        if (tr.post_status == 'wc-pending') status = 'Pending payment';
        else if (tr.post_status == 'wc-processing') status = 'Processing';
        else if (tr.post_status == 'wc-on-hold') status = 'On hold';
        else if (tr.post_status == 'wc-completed') status = 'Completed';
        else if (tr.post_status == 'wc-cancelled') status = 'Cancelled';
        else if (tr.post_status == 'wc-refunded') status = 'Refunded';
        else if (tr.post_status == 'wc-failed') status = 'Failed';
        else if (tr.post_status == 'wc-cancelnopay') status = 'Cancelled - No Payment';
        else if (tr.post_status == 'wc-pendingpodiuminv') status = 'Pending Podium Invoice';
        else if (tr.post_status == 'wc-podium') status = 'Order via Podium';
        else if (tr.post_status == 'wc-podiumrefund') status = 'Podium Refunded';
        else if (tr.post_status == 'draft') status = 'draft';
        else status = '-';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdate_fk_projet">' + status + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemvendor_name">' + tr.transaction_id + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemwarehouse_name">' + tr.settlement_date + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdestination">' + tr.order_amount + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">$' + numberRenderer(tr.payment_amount) + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">' + tr.payment_fee + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">' + tr.refund_amount + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">' + tr.threshold + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">' + numberRenderer(tr.avgval)  + '</td>';

        //myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">' + tr.date_modified_s + '</td>';

        myHtml += '</tr>';
        //}

    });
    myHtml += '        </tbody>';
    myHtml += '    </table>';
    myHtml += '</td>';
    myHtml += '</tr >';

    myHtml += '</table >';


    //console.log(myHtml);

    let opt = { strValue1: po_authmail, strValue2: $("#txtDate").val().replaceAll('/', '.'), strValue3: myHtml }
    //  console.log(opt);
    //let opt = { strValue1: 'johnson.quickfix@gmail.com', strValue2: data['po'][0].ref, strValue3: myHtml, strValue5: _com_add }
    if (opt.strValue1.length > 1) {
        $.ajax({
            type: "POST", url: '/Reports/SendThresholdMail', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (result) { console.log(result); },
            error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
            complete: function () { swal('Success!', 'E-mail sent.', 'success'); $("#loader").hide(); }//, async: false
        });
    }
}
