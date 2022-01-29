$(document).ready(function () {
    $("#loader").hide();
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
    }, function (start, end, label) {         
        AccountDataList(true);    
    });
    AccountDataList(true);
    // Add event listener for opening and closing details 
    $('#dtdataList tbody').on('click', '.pdetails-control', function () {
        // console.log('svvvd');
        var tr = $(this).closest('tr');
        var row = $('#dtdataList').DataTable().row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            tr.find('.pdetails-control').empty().append('<i class="glyphicon glyphicon-plus-sign"></i>');
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            tr.find('.pdetails-control').empty().append('<i class="glyphicon glyphicon-minus-sign"></i>');
            row.child(formatPartially(row.data())).show();
            tr.addClass('shown');

        }
    });
    
});

function AccountDataList(is_date) {
    // console.log(obj);
   // let urid = $("#ddlVendor").val();
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';
    var numberRenderer = $.fn.dataTable.render.number(',', '.', 2,).display;
    let obj = { strValue1: sd, strValue2: ed };
    // console.log(obj);
    var table = $('#dtdataList').DataTable({
        oSearch: { "sSearch": '' }, bAutoWidth: false, scrollX: false, searching: false,
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        destroy: true, ajax: {
            url: '/Accounting/GetAccountbalancesheet', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
        footerCallback: function (row, data, start, end, display) {
            var api = this.api(), data;

            // console.log(data);
            var intVal = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            var sales = api.column(2).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);

            //var forecastales = api.column(3).data().reduce(function (a, b) {
            //    return intVal(a) + intVal(b);
            //}, 0);
            //  bailance = forecastales - sales;
            $(api.column(1).footer()).html('Grand total');
            $(api.column(2).footer()).html(numberRenderer(sales));
           // $(api.column(3).footer()).html(numberRenderer(forecastales));
            //  $(api.column(3).footer()).html('Balance $' + numberRenderer(bailance));
        },
        columns: [
            { data: 'row_num', title: '#', sWidth: "0.1%" },
            {
                data: 'pcg_type', title: 'Type', sWidth: "89.9%", className: 'text-left', render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    return '<a href="javascript:void(0);" class="pdetails-control" data-toggle="tooltip" title="Click here to show details."><i class="glyphicon glyphicon-plus-sign"></i></a> -  #<b>' + row.pcg_type + '</b>';

                }
            },
            {
                data: 'invtotal', sWidth: "5%", class: 'text-right', render: function (data, type, row) {
                    var tprice = 'toFormat';
                    if (data.toString() == "0.00")
                        tprice = "";
                    else
                        tprice = numberRenderer(data);
                    return tprice
                }
            },
           
        ],
        columnDefs: [{ targets: [0], searchable: false }],
        dom: 'Bfrtip',
        "buttons": [
            //{
            //    extend: 'csv',
            //    className: 'button',
            //    text: '<i class="fas fa-file-csv"></i> CSV',
            //    exportOptions: {
            //        columns: [1, 2],
            //    },
            //    filename: function () {
            //        var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
            //        return 'Ledger for' + from;
            //    },
            //},

            { extend: 'excelHtml5', title: 'Balance Sheet', action: function (e, dt, button, config) { exportTableToCSV('Balance Sheet.xls'); } },
            {
                extend: 'csvHtml5', title: 'Balance Sheet', titleAttr: 'CSV',
                exportOptions: { columns: ':visible' },
                action: function (e, dt, button, config) { exportTableToCSV('Balance Sheet.csv'); }
            },


            {
                extend: 'print',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> Print',
                footer: true,
                exportOptions: {
                    columns: [0, 1, 2],
                },
                filename: function () {
                    var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
                    return 'Ledger for' + from;
                },
            },
            {
                extend: 'pdfHtml5',
                footer: true,
                exportOptions: {
                    columns: [1, 2],

                },
                customize: function (doc) {
                    //doc.defaultStyle.alignment = 'right';
                    doc.styles.tableHeader.alignment = 'right';
                    // doc.styles.tableHeader[2].alignment = 'right';
                    // doc.content[1].alignment = ['left', 'right', 'right'];

                    doc.content[0].text = "Layla Sleep Inc - Balance Sheet";
                    doc.content[0].text.alignment = 'left';

                    var rowCountd = table.rows().count() + 1;
                    for (i = 0; i < rowCountd; i++) {
                        doc.content[1].table.body[i][0].alignment = 'left';
                    };

                    var rowCount = doc.content[1].table.body.length;
                    for (i = 1; i < rowCount; i++) {
                       // doc.content[1].table.body[i][2].alignment = 'right';
                        doc.content[1].table.body[i][1].alignment = 'right';

                    }


                    // doc.styles.tableHeader.alignment = ['left', 'right', 'right'];
                    doc.content[1].table.widths =
                        Array(doc.content[1].table.body[0].length + 1).join('*').split('');

                    doc.content[1].table.widths = ['50%', '50%'];


                },

                filename: function () {
                    var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
                    return 'Ledger for' + from;
                },
            },

            // {
            //     extend: 'pdfHtml5', title: 'Balance Sheet', titleAttr: 'PDFALL',
            //    exportOptions: { columns: ':visible' },
            //    action: function (e, dt, button, config) { exportTableToPDF('Balance Sheet.pdf'); }
            //},

        ],
    });
}
/* Formatting function for row details - modify as you need */
function formatPartially(d) {
    // console.log(d);
    let is_date = true;
    let urid = $("#ddlVendor").val();
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';
    var numberRenderer = $.fn.dataTable.render.number(',', '.', 2,).display;
    let option = { strValue1: d.pcg_type, strValue2: sd, strValue3: ed }, wrHTML = '<table id="table1_' + d.rowid + '" class="inventory-table table-blue table check-table table-bordered table-striped dataTable no-footer"><thead><tr><th style="width:30%; text-align:left;">Account Number</th><th style="width:60%; text-align:left;">label</th><th style="width:10%; text-align:right;">Total</th></tr></thead>';
    $.ajax({
        url: '/Accounting/GetAccountbalancesheetDetails', type: 'post', dataType: 'json', contentType: "application/json; charset=utf-8", data: JSON.stringify(option),
        success: function (result) {
            result = JSON.parse(result);
            let Totaldebit = 0;
            let Totalcredit = '';
            let Totalbaolance = '';
            let account = 0;
            let datect = '';
            if (result.length == 0) { wrHTML += '<tbody class="line_items_' + d.rowid + '"><tr><td valign="top" colspan="3" class="no-data-available">Sorry no matching records found.</td></tr></tbody>'; }
            $(result).each(function (index, row) {
                Totaldebit += row.invtotal;
                wrHTML += '<tr class="paid_item"><td style="width:30%; text-align:left;">' + row.account_number + '</td>';
                wrHTML += '<td style="width:60%; text-align:left;">' + row.label + '</td>'; 
                wrHTML += '<td id="artist_' + row.inv_num + '" style="width:10%; text-align:right;" class="text-right debit-amount">' + numberRenderer(row.invtotal) + '</td></tr >';
                 
            });
            wrHTML += '<tfoot><tr><td  style="width:30%; text-align:left;"><b> Total </<b></td>';
            wrHTML += '<td style="width:60%; text-align:right;"></td>';
            wrHTML += '<td style="width:10%; text-align:right;"><strong><span id="Totalbailance">' + numberRenderer(Totaldebit) + '</span></strong></td>';
            wrHTML += '</tr></tfoot>';
        },
        error: function (xhr, status, err) { alert(err); },
        complete: function () { }, async: false
    });
    wrHTML += '</table>';
    return wrHTML;
}

function exportTableToPDF(filename) {
    let tmpColDelim = String.fromCharCode(11); // vertical tab character
    let tmpRowDelim = String.fromCharCode(0); // null character
    // Solo Dios Sabe por que puse esta linea
    let colDelim = (filename.indexOf("pdf") != -1) ? '\t' : ',';
    let rowDelim = '\r\n';
    let csv = 'Type' + colDelim + '' + colDelim + '' + colDelim + 'Total' + colDelim + rowDelim;
    let urid = $("#ddlVendor").val();
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let obj = { strValue1: sd, strValue2: ed, strValue3: urid };// console.log(obj);  
    let grandtotal = 0.00;
    $.ajax({
        url: "/Accounting/exportbalancesheet", data: obj, type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (result) {
            result = JSON.parse(result);
            $(result['item']).each(function (index, data) {
                grandtotal += parseFloat(data.invtotal, 2);
                //Parent Row
                //if (data.post_parent > 0)
                csv += '-  #' + data.pcg_type + colDelim + '' + colDelim + '' + colDelim + data.invtotal + colDelim + rowDelim;
                // else
                //  csv += '#' + data.id + colDelim + (isNullAndUndef(data.category) ? data.category : '') + colDelim + (isNullAndUndef(data.sku) ? data.sku : '') + colDelim + data.post_title.replace(/\,/g, '') + colDelim + (data.op_stock + data.stock) + colDelim + data.UnitsinPO.toFixed(0) + colDelim + data.SaleUnits.toFixed(0) + colDelim + data.Damage.toFixed(0) + colDelim + (data.op_stock + data.stock + data.UnitsinPO - data.SaleUnits - data.Damage).toFixed(0) + rowDelim;
                //Child Row                
                let res = result['details'].filter(element => element.pcg_type == data.pcg_type);
                if (res.length > 0) csv += '' + colDelim + 'Account Number' + colDelim + 'label' + colDelim + '' + rowDelim;
                $(res).each(function (index, wrhRow) {
                    csv += '' + colDelim + wrhRow.account_number + colDelim + wrhRow.label + colDelim + wrhRow.invtotal + rowDelim;
                });


            }); csv += '-' + colDelim + '' + colDelim + '' + colDelim + 'Grand Total' + colDelim + rowDelim;
            csv += '' + colDelim + '' + colDelim + '' + colDelim + grandtotal + rowDelim;
            download_pdf(csv, filename);
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }
    });
}

function exportTableToCSV(filename) {
    let tmpColDelim = String.fromCharCode(11); // vertical tab character
    let tmpRowDelim = String.fromCharCode(0); // null character
    // Solo Dios Sabe por que puse esta linea
    let colDelim = (filename.indexOf("xls") != -1) ? '\t' : ',';
    let rowDelim = '\r\n';
    let csv = 'Type' + colDelim + '' + colDelim + '' + colDelim + 'Total' + colDelim  + rowDelim;
    let urid = $("#ddlVendor").val();
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');    
    let obj = { strValue1: sd, strValue2: ed, strValue3: urid };// console.log(obj);  
    let grandtotal = 0.00;
    $.ajax({
        url: "/Accounting/exportbalancesheet", data: obj, type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (result) {
            result = JSON.parse(result);
            $(result['item']).each(function (index, data) {
                grandtotal += parseFloat(data.invtotal,2);
                //Parent Row
                //if (data.post_parent > 0)
                csv += '-  #' + data.pcg_type + colDelim + '' + colDelim + '' + colDelim + data.invtotal + colDelim + rowDelim;
                // else
                //  csv += '#' + data.id + colDelim + (isNullAndUndef(data.category) ? data.category : '') + colDelim + (isNullAndUndef(data.sku) ? data.sku : '') + colDelim + data.post_title.replace(/\,/g, '') + colDelim + (data.op_stock + data.stock) + colDelim + data.UnitsinPO.toFixed(0) + colDelim + data.SaleUnits.toFixed(0) + colDelim + data.Damage.toFixed(0) + colDelim + (data.op_stock + data.stock + data.UnitsinPO - data.SaleUnits - data.Damage).toFixed(0) + rowDelim;
                //Child Row                
                let res = result['details'].filter(element => element.pcg_type == data.pcg_type);
                if (res.length > 0) csv += '' + colDelim + 'Account Number' + colDelim + 'label' + colDelim  + ''  + rowDelim;
                $(res).each(function (index, wrhRow) {
                    csv += '' + colDelim + wrhRow.account_number + colDelim + wrhRow.label + colDelim  + wrhRow.invtotal  + rowDelim;
                });
               
               
            }); csv += '-' + colDelim + '' + colDelim + '' + colDelim + 'Grand Total' + colDelim + rowDelim;
            csv += '' + colDelim + '' + colDelim + '' + colDelim + grandtotal + rowDelim;
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

function download_pdf(csv, filename) {
    var doc = new jsPDF('p', 'pt');
    doc.autoTable(csv, csv)
    doc.save("table.pdf");
}
