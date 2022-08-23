$(document).ready(function () {
 
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
        //function (start, end, label) {
        //    $.when(MiscBillGrid()).done(function () { MiscBillFullyGrid(); });

        //}
    );

  //  $.when(MiscBillGrid()).done(function () { MiscBillFullyGrid(); });
    MiscBillGrid();
  
    // Add event listener for opening and closing details
    $('#dtdata tbody').on('click', '.pdetailspo-control', function () {
        // console.log('svvvd');
        var tr = $(this).closest('tr');
        var row = $('#dtdata').DataTable().row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            tr.find('.pdetailspo-control').empty().append('<i class="glyphicon glyphicon-plus-sign"></i>');
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            tr.find('.pdetailspo-control').empty().append('<i class="glyphicon glyphicon-minus-sign"></i>');
            row.child(formatPO(row.data())).show();
            tr.addClass('shown');
        }
    });

    // Add event listener for opening and closing details
    $('#dtfullypaid tbody').on('click', '.pdetailbill-control', function () {
        // console.log('svvvd');
        var tr = $(this).closest('tr');
        var row = $('#dtfullypaid').DataTable().row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            tr.find('.pdetailbill-control').empty().append('<i class="glyphicon glyphicon-plus-sign"></i>');
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            tr.find('.pdetailbill-control').empty().append('<i class="glyphicon glyphicon-minus-sign"></i>');
            //row.child(formatPartially(row.data())).show();
            row.child(formatPO(row.data())).show();
            tr.addClass('shown');
        }
    });

    $('#btnsearchdetails').click(function () { 
        MiscBillGrid();
    });

  
});

function MiscBillGrid() { 
    let paymentmethod = $("#ddlstatus").val();
    if (paymentmethod == 'PN')
        paymentmethod = 'SERPB';
    else
        paymentmethod = 'SFRPB';
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    var obj = { strValue1: sd, strValue2: ed, strValue3: paymentmethod, }
    if ($('#txtOrderDate').val() == '') { sd = ''; ed = '' };
    let table = $('#dtdata').DataTable({
        //columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': false, 'targets': [9] }], order: [[9, "desc"]],
        order: [[0, "desc"]], destroy: true, bProcessing: true, bServerSide: false, bAutoWidth: false, searching: true, responsive: true, lengthMenu: [[20, 50, 100, 200], [20, 50, 100, 200]],
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
            url: '/Reports/GetBillDetailslist', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        aoColumns: [
          /*  { data: 'date_creation', title: 'Bill Date', sWidth: "10%" },*/
            {
                data: 'ref', title: 'Bill No.', class: 'text-left', sWidth: "10%", render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    return '<a href="javascript:void(0);"  data-toggle="tooltip" title="Click here to view order preview."></a> ' + row.ref + ' <a href="#" title="Click here to print" data-toggle="tooltip" onclick="getBillPrintDetails(' + row.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                    // return '<a  title="Click here to view order preview" data-toggle="tooltip"> #' + row.ref + '</a> <a href="javascript:void(0);" title="Click here to print" data-toggle="tooltip" onclick="PrintProposals(' + row.id + ');"><i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'payref', title: 'Invoice No.', sWidth: "10%" },
            { data: 'payment_date', title: 'Payment Date', sWidth: "15%" },
            { data: 'customertype', title: 'Bill Type', sWidth: "10%" },
            { data: 'displayname', title: 'Name', sWidth: "10%" },
           /* { data: 'ext_payment_site', title: 'Transaction Id', sWidth: "15%" },*/
            { data: 'PaymentType', title: 'Payment Type', sWidth: "10%" },
            { data: 'total_ttc', title: 'Total Amt.', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'discount', title: 'Discount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'sub_total', title: 'Paid Amt.', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
          
           // { data: 'amount', title: 'Total Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },

            
           // { data: 'recieved', title: 'Total Paid Amt.', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
           // { data: 'remaining', title: 'Balance Amt.', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },


            //{
            //    data: 'remaining', title: 'Balance Amt.', class: 'text-right', sWidth: "10%", render: function (data, type, row) {

            //        return (row.total_ttc - row.sub_total).toFixed(2);
            //    }
            //},



            //{
            //    data: 'due_date_s', title: 'Due date', sWidth: "10%", render: function (id, type, full, meta) {
            //        if (full.past_due == "Past Due") return full.due_date + ' <i class="fas fa-exclamation pastdue" title="Past Due" aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>';
            //        else return '<span style="display: none;">' + full.due_date_s + '</span>' + full.due_date;
            //    }
            //},
        ],
        "dom": 'lBftip',
        "buttons": [
            {
                extend: 'csv',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> Export',
                filename: function () {
                    // var d = new Date();
                    return 'Misc_Bill_Report_' + $("#txtOrderDate").val().replaceAll('/', '.');
                },

            },
            {
                extend: 'print',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> Print',
                title: function () {
                    return "Layla Sleep Inc - Misc Bill Report";
                },
                footer: true,
                exportOptions: {
                    columns: [0, 1, 2, 3, 4,5, 7, 8],
                },
                filename: function () {
                    //var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
                    return 'Misc_Bill_Report_' + $("#txtOrderDate").val().replaceAll('/', '.');
                },
            },

            {
                extend: 'pdfHtml5',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> PDF',
                footer: true,
                exportOptions: {
                    columns: [0, 1, 2, 3,4,5,  7, 8],

                },
                //customize: function (doc) {
                //    //doc.defaultStyle.alignment = 'right';
                //    doc.styles.tableHeader.alignment = 'left';
                //    // doc.styles.tableHeader[2].alignment = 'right';
                //    // doc.content[1].alignment = ['left', 'right', 'right'];

                //    doc.content[0].text = "Layla Sleep Inc - Misc Bill Report";
                //    doc.content[0].text.alignment = 'left';

                //    var rowCountd = table.rows().count() + 1;
                //    for (i = 0; i < rowCountd; i++) {
                //        doc.content[1].table.body[i][6].alignment = 'right';
                //    };

                //    var rowCount = doc.content[1].table.body.length;
                //    for (i = 1; i < rowCount; i++) {
                //        doc.content[1].table.body[i][6].alignment = 'right';
                //        //doc.content[1].table.body[i][1].alignment = 'right';

                //    }


                //    // doc.styles.tableHeader.alignment = ['left', 'right', 'right'];
                //    //doc.content[1].table.widths =
                //    //    Array(doc.content[1].table.body[0].length + 1).join('*').split('');

                //    // doc.content[1].table.widths = ['50%', '25%', '25%'];


                //},

                filename: function () {
                    // var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
                    return 'Misc_Bill_Report_' + $("#txtOrderDate").val().replaceAll('/', '.');
                },
            },


        ],

        //dom: 'lBftip', buttons: [{ extend: 'excelHtml5', title: 'Misc Bill Report', action: function (e, dt, button, config) { exportTableToCSV('Misc Bill Report.xls'); } },
        //{
        //    extend: 'csvHtml5', title: 'Misc Bill Report', titleAttr: 'CSV',
        //    exportOptions: { columns: ':visible' },
        //    action: function (e, dt, button, config) { exportTableToCSV('Misc Bill Report.csv'); }
        //    }],

    });

}
function formatPO(d) {
    let option = { strValue1: d.id }, wrHTML = '<table class="inventory-table1 table-blue table check-table table-bordered table-striped dataTable no-footer"><thead><tr><th style="width:20%; text-align:left; visibility:inherit; opacity:1;">Pay ID.</th><th style="width:20%; text-align:left; visibility:inherit; opacity:1;">Paid Date</th><th style="width:20%; text-align:left; visibility:inherit; opacity:1;">Transaction Id</th><th style="width:20%; text-align:left; visibility:inherit; opacity:1;">Payment Type</th><th style="width:10%; text-align:right; visibility:inherit; opacity:1;">Paid Amount</th><th style="width:10%; text-align:right; visibility:inherit; opacity:1;">Discount</th><th style="width:10%; text-align:right; visibility:inherit; opacity:1;">Total Amount</th></tr></thead>';
    $.ajax({
        url: '/PaymentInvoice/GetPaymentBilldetails', type: 'post', dataType: 'json', contentType: "application/json; charset=utf-8", data: JSON.stringify(option),
        success: function (result) {
            result = JSON.parse(result);
            if (result.length == 0) { wrHTML += '<tbody><tr><td valign="top" colspan="3" class="no-data-available">Sorry no matching records found.</td></tr></tbody>'; }
            $(result).each(function (index, row) {
                wrHTML += '<tr><td style="width:20%; text-align:left;"> ' + row.ref + ' </td><td style="width:20%; text-align:left;">' + row.date_creation + '</td>';
                wrHTML += '<td style="width:20%; text-align:left;">' + row.ext_payment_site + '</td><td style="width:20%; text-align:left;">' + row.PaymentType + '</td><td style="width:10%; text-align:right;">' + '$' + row.sub_total + '</td><td style="width:10%; text-align:right;">' + '$' + row.discount + '</td><td style="width:10%; text-align:right;">' + '$' + row.amount + '</td></tr > ';
            });
        },
        error: function (xhr, status, err) { alert(err); },
        complete: function () { }, async: false
    });
    wrHTML += '</table>';
    return wrHTML;
}

function exportTableToCSV(filename) {
    let tmpColDelim = String.fromCharCode(11); // vertical tab character
    let tmpRowDelim = String.fromCharCode(0); // null character
    // Solo Dios Sabe por que puse esta linea
    let colDelim = (filename.indexOf("xls") != -1) ? '\t' : ',';
    let rowDelim = '\r\n';

    let csv = 'id' + colDelim + 'Category' + colDelim + 'SKU' + colDelim + 'Product Name' + colDelim + 'Units in Stock' + colDelim + 'Units in POs' + colDelim + 'Sale Units' + colDelim + 'Damage Units' + colDelim + 'Available Units' + rowDelim;

    let dfa = $('#txtDate').val().split('-');
    let sd = dfa[0].split('/'); sd = sd[2].trim() + '/' + sd[0].trim() + '/' + sd[1].trim();
    let ed = dfa[1].split('/'); ed = ed[2].trim() + '/' + ed[0].trim() + '/' + ed[1].trim();
    let pid = parseInt($("#ddlProduct").val()) || 0, ctid = parseInt($("#ddlCategory").val()) || 0, vnid = parseInt($("#ddlVendor").val()) || 0;;
    let obj = { strValue1: $("#txtsku").val().trim(), strValue2: (ctid > 0 ? ctid : ''), strValue3: (pid > 0 ? pid : ''), strValue4: (vnid > 0 ? vnid : ''), strValue5: sd, strValue6: ed };
    $.ajax({
        url: "/Inventory/ExportProductStock", data: obj,
        type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (result) {
            result = JSON.parse(result);
            $(result['item']).each(function (index, data) {
                //Parent Row
                if (data.post_parent > 0)
                    csv += '-  #' + data.id + colDelim + (isNullAndUndef(data.category) ? data.category : '') + colDelim + (isNullAndUndef(data.sku) ? data.sku : '') + colDelim + data.post_title.replace(/\,/g, '') + colDelim + (data.op_stock + data.stock).toFixed(0) + colDelim + data.UnitsinPO.toFixed(0) + colDelim + data.SaleUnits.toFixed(0) + colDelim + data.Damage.toFixed(0) + colDelim + (data.op_stock + data.stock - data.SaleUnits - data.Damage).toFixed(0) + rowDelim;
                else
                    csv += '#' + data.id + colDelim + (isNullAndUndef(data.category) ? data.category : '') + colDelim + (isNullAndUndef(data.sku) ? data.sku : '') + colDelim + data.post_title.replace(/\,/g, '') + colDelim + (data.op_stock + data.stock) + colDelim + data.UnitsinPO.toFixed(0) + colDelim + data.SaleUnits.toFixed(0) + colDelim + data.Damage.toFixed(0) + colDelim + (data.op_stock + data.stock - data.SaleUnits - data.Damage).toFixed(0) + rowDelim;
                //Child Row                
                let res = result['details'].filter(element => element.product_id == data.id);
                if (res.length > 0) csv += '' + colDelim + '' + colDelim + '' + colDelim + 'Warehouse' + colDelim + 'Units in Stock' + colDelim + 'Units in POs' + colDelim + 'Sale Units' + colDelim + 'Damage Units' + colDelim + 'Available Units' + rowDelim;
                $(res).each(function (index, wrhRow) {
                    csv += '' + colDelim + '' + colDelim + '' + colDelim + wrhRow.ref + colDelim + (wrhRow.op_stock + wrhRow.stock).toFixed(0) + colDelim + wrhRow.UnitsinPO.toFixed(0) + colDelim + wrhRow.SaleUnits.toFixed(0) + colDelim + wrhRow.Damage.toFixed(0) + colDelim + (wrhRow.op_stock + wrhRow.stock - wrhRow.SaleUnits - wrhRow.Damage).toFixed(0) + colDelim + rowDelim;
                });
            });
            download_csv(csv, filename);
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }
    });
}
function download_csv(csv, filename) {
    var csvFile;
    var downloadLink;
    // CSV FILE
    csvFile = new Blob([csv], { type: "text/csv" });
    // Download link
    downloadLink = document.createElement("a");
    // File name
    downloadLink.download = filename;
    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);
    // Make sure that the link is not displayed
    downloadLink.style.display = "none";
    // Add the link to your DOM
    document.body.appendChild(downloadLink);
    // Lanzamos
    downloadLink.click();
}

//function MiscBillFullyGrid() {
//    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
//    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');

//    $('#dtfullypaid').DataTable({
//        destroy: true, bProcessing: true, bServerSide: true,
//        bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
//        responsive: true, lengthMenu: [[50, 100, 200, 300], [50, 100, 200, 300]],
//        language: {
//            lengthMenu: "_MENU_ per page",
//            zeroRecords: "Sorry no records found",
//            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
//            infoFiltered: "",
//            infoEmpty: "No records found",
//            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
//        },
//        sAjaxSource: "/PaymentInvoice/GetPaymentMiscList",
//        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
//            aoData.push({ name: "strValue1", value: 'SFRPB' }, { name: "strValue2", value: sd }, { name: "strValue3", value: ed });
//            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
//            oSettings.jqXHR = $.ajax({
//                dataType: 'json', type: "GET", url: sSource, data: aoData,
//                "success": function (data) {
//                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
//                    return fnCallback(dtOption);
//                }
//            });
//        },
//        columns: [

//            {
//                data: 'ref', title: 'Bill No', sWidth: "12%", render: function (data, type, row) {
//                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
//                    //return '<a href="javascript:void(0);" class="pdetails-control" data-toggle="tooltip" title="Click here to view payment ."><i class="glyphicon glyphicon-plus-sign"></i></a> #' + row.refordervendor + ' <a href="#" title="Click here to print" data-toggle="tooltip" onclick="PrintProposals(' + row.id + ', false);"><i class="fas fa-search-plus"></i></a>';
//                    return '<a href="javascript:void(0);" class="pdetailbill-control" data-toggle="tooltip" title="Click here to view order preview."><i class="glyphicon glyphicon-plus-sign"></i></a> #' + row.ref + ' <a href="#" title="Click here to print" data-toggle="tooltip" onclick="getBillPrintDetails(' + row.id + ', false);"><i class="fas fa-search-plus"></i></a>';
//                    // return '<a  title="Click here to view order preview" data-toggle="tooltip"> #' + row.ref + '</a> <a href="javascript:void(0);" title="Click here to print" data-toggle="tooltip" onclick="PrintProposals(' + row.id + ');"><i class="fas fa-search-plus"></i></a>';
//                }
//            },
//            { data: 'date_creation', title: 'Bill Date', sWidth: "10%" },
//            //{ data: 'date_livraison', title: 'Due Date', sWidth: "10%" },
//            //{ data: 'refordervendor', title: 'Invoice No', sWidth: "10%" },
//            //{
//            //    data: 'refordervendor', title: 'Invoice No', sWidth: "10%", 'render': function (id, type, full, meta) {
//            //        return ' <a href="javascript:void(0);" title="Click here to view invoice  preview" data-toggle="tooltip" onclick="getInvoicePrint(' + full.id + '); "><i class="fas fa - search - plus"></i>' + id + '</a>';
//            //    }
//            //},
//            { data: 'customertype', title: 'Bill Type', sWidth: "10%" },
//            { data: 'displayname', title: 'Name', sWidth: "10%" },
//            { data: 'total_ttc', title: 'Total Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
//            { data: 'recieved', title: 'Paid Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
//            { data: 'remaining', title: 'Balance Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
//            {
//                data: 'due_date_s', title: 'Due date', sWidth: "10%", render: function (id, type, full, meta) {
//                    if (full.past_due == "Past Due") return '<span style="display: none;">' + full.due_date_s + '</span>' + full.due_date + ' <i class="fas fa-exclamation pastdue" title="Past Due" aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>';
//                    else return '<span style="display: none;">' + full.due_date_s + '</span>' + full.due_date;
//                }
//            },

//            /*{ data: 'Status', title: 'Status', sWidth: "10%" }*/
//        ],
//        order: [[0, "desc"]]
//    });
//}

 
