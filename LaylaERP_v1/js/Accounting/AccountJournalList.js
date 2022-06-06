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
    }, function (start, end, label) {
        $("#txtdebit").text(''); $("#txtcredit").text(''); $("#txtbalance").text('');
        AccountJournalList(true);
        getGrandTotal(true);
    });
    getGrandTotal(true);
    getVendor();
    getChartofaccount();
    $(".select2").select2();
    AccountJournalList(true);

    $('#ddlVendor').change(function () {
        $("#txtdebit").text(''); $("#txtcredit").text(''); $("#txtbalance").text('')
        AccountJournalList(true);
        getGrandTotal(true);
    });

    $('#ddlAccount').change(function () {
        $("#txtdebit").text(''); $("#txtcredit").text(''); $("#txtbalance").text('')
        AccountJournalList(true);
        getGrandTotal(true);
    });

    $("#btnSearch").click(function () {
        $("#ddlVendor").val("").trigger('change');
        $("#ddlAccount").val("").trigger('change');
        AccountJournalList(true);
        getGrandTotal(true);
    })

    //$("#btnExport").click(function () {
    //    window.location = '/Export/ExportInventory';
    //}) 

});


function AccountJournalList_Old(is_date) {
    var vrid = $("#ddlVendor").val();
    console.log('sss');
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    //let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';
    var numberRenderer = $.fn.dataTable.render.number(',', '.', 2).display;
    var ID = $("#hfid").val();
    var account_num = $("#ddlAccount").val();
    var obj = { strValue1: sd, strValue2: ed, strValue3: account_num, strValue4: vrid }
    var table_EL = $('#JournalListdata').DataTable({
        //columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': false, 'targets': [9] }], order: [[9, "desc"]],
        columnDefs: [{ "searchable": false, "targets": 4 }],
        order: [[0, "desc"], [2, "desc"], [1, "asc"]], ordering: true, destroy: true, bProcessing: true, bServerSide: false, bAutoWidth: false, searching: true, responsive: true, lengthMenu: [[20, 50, 100], [20, 50, 100]],
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#JournalListdata_filter input').unbind();
            $('#JournalListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        footerCallback: function (row, data, start, end, display) {
            var api = this.api(), data;
            var intVal = function (i) { return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0; };

            let DebitTotal = api.column(6, { page: 'current' }).data().reduce(function (a, b) { return intVal(a) + intVal(b); }, 0);
            let CreditTotal = api.column(7, { page: 'current' }).data().reduce(function (a, b) { return intVal(a) + intVal(b); }, 0);

            $(api.column(0).footer()).html('Page Total');
            $(api.column(6).footer()).html('$' + numberRenderer(DebitTotal));
            $(api.column(7).footer()).html('$' + numberRenderer(CreditTotal));
            //console.log(DebitTotal, CreditTotal);
        },
        ajax: {
            url: '/Accounting/AccountJournalList', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { console.log(JSON.parse(data)); return JSON.parse(data); }
        },
        /*
        sAjaxSource: "/Accounting/AccountJournalList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            aoData.push({ name: "strValue2", value: dfa });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            //var col = 'id';
            //if (oSettings.aaSorting.length >= 0) {
            //    var col = oSettings.aaSorting[0][0] == 0 ? "inv_num" : oSettings.aaSorting[0][0] == 1 ? "code_journal" : oSettings.aaSorting[0][0] == 2 ? "datecreation" : oSettings.aaSorting[0][0] == 3 ? "PO_SO_ref" : oSettings.aaSorting[0][0] == 4 ? "inv_complete" : oSettings.aaSorting[0][0] == 5 ? "name" : oSettings.aaSorting[0][0] == 6 ? "label_operation" : oSettings.aaSorting[0][0] == 7 ? "debit" : oSettings.aaSorting[0][0] == 8 ? "credit" : oSettings.aaSorting[0][0] == 9 ? "datesort" : "id";
            //    aoData.push({ name: "sSortColName", value: col });
            //}
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },*/
        aoColumns: [
            //{ data: 'inv_num', title: 'Num Transcation', sWidth: "5%" },
            { data: 'datesort', title: 'Date', sWidth: "10%", class: 'text-left', render: function (data, type, full) { if (type === "sort" || type === 'type') { return data; } else return full.datecreation; } },
            {
                data: 'code_journal', title: 'Journal', sWidth: "5%",
                render: function (data, type, full) {
                    if (type === "sort" || type === 'type') { return full.sort_no; }
                    else if (full.doc_type == 'SO') return 'Sale Order';
                    else if (full.doc_type == 'SR') return 'Refund Order';
                    else if (full.doc_type == 'PO') return 'Purchase Order';
                    else if (full.doc_type == 'PR') return 'Purchase Order Refund';
                    else if (full.doc_type == 'FT') return 'Fund Transfer';
                    else if (full.doc_type == 'IP') return 'Payment Bill';
                    else if (full.doc_type == 'MB') return 'Miscellaneous Bill';
                    else return full.doc_type;
                }
            },
            {
                data: 'PO_SO_ref', title: 'Accounting Doc', sWidth: "15%",
                'render': function (inv_num, type, full, meta) {
                    //if (full.code_journal == "AC") return '' + inv_num + '<span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getPurchaseOrderPrint(' + full.inv_num + ', false);"><i class="fas fa-search-plus"></i></a></span>';
                    //else return '' + inv_num + '<a href="#" onclick="PurchaseSalesPrint(' + full.inv_num + ',\'' + full.datecreation + '\');"><i class="fas fa-search-plus"></i></a>';
                    ////return '<a href="NewReceiveOrder/' + full.id + '">' + id + '</a> <a href="#" onclick="getPurchaseOrderPrint(' + full.id + ', false);"><i class="fas fa-search-plus"></i></a>';

                    if (full.code_journal == "AC" || full.code_journal == "BQ") {

                        if (full.code_journal == "AC")
                            return '' + inv_num + '<span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getPurchaseOrderPrint(' + full.inv_num + ', false);"><i class="fas fa-search-plus"></i></a></span>';
                        else if (full.PO_SO_ref.substring(0, 2) != "PO" && full.doc_type == 'FT')
                            return inv_num;
                        else if (full.PO_SO_ref.substring(0, 2) == "PO")
                            return '' + inv_num + '<span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getPurchaseOrderPrint(' + full.inv_num + ', false);"><i class="fas fa-search-plus"></i></a></span>';
                        //wrHTML += '<td style="width:10%; text-align:left;"><span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getPurchaseOrderPrint(' + full.inv_num + ', false);"><i class="fas fa - search - plus"></i>' + full.PO_SO_ref + '</a></span></td>';
                        else
                            return '' + inv_num + '<span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getaccountsoPrintDetails(\'' + full.PO_SO_ref.toString() + '\', false);"><i class="fas fa-search-plus"></i></a></span>';
                        //wrHTML += '<td style="width:10%; text-align:left;"><span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getaccountsoPrintDetails(\'' + full.PO_SO_ref.toString() + '\', false);"><i class="fas fa - search - plus"></i>' + full.PO_SO_ref + '</a></span></td>';
                    }
                    else if (full.code_journal == "OD") {
                        return '' + inv_num + '<span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getBillPrintDetails(' + full.inv_num + ', false);"><i class="fas fa-search-plus"></i></a></span>';
                        // wrHTML += '<td style="width:10%; text-align:left;"><span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getBillPrintDetails(' + full.inv_num + ', false);"><i class="fas fa - search - plus"></i>' + full.PO_SO_ref + '</a></span></td>';
                    }
                    else {
                        return '' + inv_num + '<a href="#" onclick="PurchaseSalesPrint(' + full.inv_num + ',\'' + full.datecreation + '\');"><i class="fas fa-search-plus"></i></a>';
                    }
                }
            },
            //{ data: 'inv_complete', title: 'Account Number', sWidth: "5%" },
            { data: 'subledger_label', title: 'Label', sWidth: "15%" },
            { data: 'label_operation', title: 'Operation Label', sWidth: "20%" },
            { data: 'label', title: 'Account', sWidth: "15%" },
            { data: 'debit', title: 'Debit($)', sWidth: "5%", class: 'text-right text-bold', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'credit', title: 'Credit($)', sWidth: "5%", class: 'text-right text-bold', render: $.fn.dataTable.render.number(',', '.', 2, '') },
        ],
        dom: 'lBftipr',
        buttons: [
            {
                extend: 'csv', className: 'button', text: '<i class="fas fa-file-csv"></i> CSV',
                filename: function () {
                    let d = new Date(); let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Journals' + e;
                },
            },
            {
                extend: 'print',
                //title: '<h3 style="text-align:center">Layla Sleep Inc.</h3><br /><h3 style="text-align:left">Chart of accounts</h3>',
                title: '', className: 'button', text: '<i class="fas fa-file-csv"></i> Print', footer: false,
                exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7], },
                filename: function () {
                    let d = new Date(); let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Account Journal' + e;
                },
                messageTop: function () { return '<h3 style = "text-align:center"> Layla Sleep Inc.</h3 ><br /><h3 style="text-align:left">Account journals</h3>'; },
            }
        ],
    });
}


function AccountJournalList(is_date) {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    var vrid = $("#ddlVendor").val();
    var account_num = $("#ddlAccount").val();
    var numberRenderer = $.fn.dataTable.render.number(',', '.', 2).display;
    var table_EL = $('#JournalListdata').DataTable({
        destroy: true, bProcessing: true, bServerSide: true,
        bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[20, 50, 100, 200, 999, 4500], [20, 50, 100, 200, 999, 4500]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#JournalListdata_filter input').unbind();
            $('#JournalListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        footerCallback: function (row, data, start, end, display) {
            var api = this.api(), data;
            var intVal = function (i) { return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0; };

            let DebitTotal = api.column(8, { page: 'current' }).data().reduce(function (a, b) { return intVal(a) + intVal(b); }, 0);
            let CreditTotal = api.column(9, { page: 'current' }).data().reduce(function (a, b) { return intVal(a) + intVal(b); }, 0);

            $(api.column(2).footer()).html('Page Total');
            $(api.column(6).footer()).html('$' + numberRenderer(DebitTotal));
            $(api.column(7).footer()).html('$' + numberRenderer(CreditTotal));
            //console.log(DebitTotal, CreditTotal);
        },
        sAjaxSource: "/Accounting/JournalAccountList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: 'SERJN' }, { name: "strValue2", value: sd }, { name: "strValue3", value: ed }, { name: "strValue4", value: account_num }, { name: "strValue5", value: vrid });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [
            { data: 'sort_no', title: 'Sort_no', sWidth: "2%" },
            { data: 'id', title: 'ID', sWidth: "2%" },            
            { data: 'datesort', title: 'Date', sWidth: "10%", class: 'text-left', render: function (data, type, full) { if (type === "sort" || type === 'type') { return data; } else return full.datecreation; } },
            {
                data: 'code_journal', title: 'Journal', sWidth: "5%",
                render: function (data, type, full) {
                    if (type === "sort" || type === 'type') { return full.sort_no; }
                    else if (full.doc_type == 'SO') return 'Sale Order';
                    else if (full.doc_type == 'SR') return 'Refund Order';
                    else if (full.doc_type == 'PO') return 'Purchase Order';
                    else if (full.doc_type == 'PR') return 'Purchase Order Refund';
                    else if (full.doc_type == 'FT') return 'Fund Transfer';
                    else if (full.doc_type == 'IP') return 'Payment Bill';
                    else if (full.doc_type == 'MB') return 'Miscellaneous Bill';
                    else return full.doc_type;
                }
            },
            {
                data: 'PO_SO_ref', title: 'Accounting Doc', sWidth: "15%",
                'render': function (inv_num, type, full, meta) {
                    //if (full.code_journal == "AC") return '' + inv_num + '<span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getPurchaseOrderPrint(' + full.inv_num + ', false);"><i class="fas fa-search-plus"></i></a></span>';
                    //else return '' + inv_num + '<a href="#" onclick="PurchaseSalesPrint(' + full.inv_num + ',\'' + full.datecreation + '\');"><i class="fas fa-search-plus"></i></a>';
                    ////return '<a href="NewReceiveOrder/' + full.id + '">' + id + '</a> <a href="#" onclick="getPurchaseOrderPrint(' + full.id + ', false);"><i class="fas fa-search-plus"></i></a>';

                    if (full.code_journal == "AC" || full.code_journal == "BQ") {

                        if (full.code_journal == "AC")
                            return '' + inv_num + '<span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getPurchaseOrderPrint(' + full.inv_num + ', false);"><i class="fas fa-search-plus"></i></a></span>';
                        else if (full.PO_SO_ref.substring(0, 2) != "PO" && full.doc_type == 'FT')
                            return inv_num;
                        else if (full.PO_SO_ref.substring(0, 2) == "PO")
                            return '' + inv_num + '<span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getPurchaseOrderPrint(' + full.inv_num + ', false);"><i class="fas fa-search-plus"></i></a></span>';
                        //wrHTML += '<td style="width:10%; text-align:left;"><span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getPurchaseOrderPrint(' + full.inv_num + ', false);"><i class="fas fa - search - plus"></i>' + full.PO_SO_ref + '</a></span></td>';
                        else
                            return '' + inv_num + '<span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getaccountsoPrintDetails(\'' + full.PO_SO_ref.toString() + '\', false);"><i class="fas fa-search-plus"></i></a></span>';
                        //wrHTML += '<td style="width:10%; text-align:left;"><span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getaccountsoPrintDetails(\'' + full.PO_SO_ref.toString() + '\', false);"><i class="fas fa - search - plus"></i>' + full.PO_SO_ref + '</a></span></td>';
                    }
                    else if (full.code_journal == "OD") {
                        return '' + inv_num + '<span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getBillPrintDetails(' + full.inv_num + ', false);"><i class="fas fa-search-plus"></i></a></span>';
                        // wrHTML += '<td style="width:10%; text-align:left;"><span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getBillPrintDetails(' + full.inv_num + ', false);"><i class="fas fa - search - plus"></i>' + full.PO_SO_ref + '</a></span></td>';
                    }
                    else {
                        return '' + inv_num + '<a href="#" onclick="PurchaseSalesPrint(' + full.inv_num + ',\'' + full.datecreation + '\');"><i class="fas fa-search-plus"></i></a>';
                    }
                }
            },
            //{ data: 'inv_complete', title: 'Account Number', sWidth: "5%" },
            { data: 'subledger_label', title: 'Label', sWidth: "15%" },
            { data: 'label_operation', title: 'Operation Label', sWidth: "20%" },
            { data: 'label', title: 'Account', sWidth: "15%" },
            { data: 'debit', title: 'Debit($)', sWidth: "5%", class: 'text-right text-bold', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'credit', title: 'Credit($)', sWidth: "5%", class: 'text-right text-bold', render: $.fn.dataTable.render.number(',', '.', 2, '') },

            /* { data: 'Status', title: 'Status', sWidth: "10%" }*/
        ],
        dom: 'lBftipr',
        buttons: [
            {
                extend: 'csv', className: 'button', text: '<i class="fas fa-file-csv"></i> CSV',
                exportOptions: { columns: [2, 3, 4, 5, 6, 7,8,9], },
                filename: function () {
                    let d = new Date(); let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Journals' + e;
                },
            },
            {
                extend: 'print',
                //title: '<h3 style="text-align:center">Layla Sleep Inc.</h3><br /><h3 style="text-align:left">Chart of accounts</h3>',
                title: '', className: 'button', text: '<i class="fas fa-file-csv"></i> Print', footer: false,
                exportOptions: { columns: [2, 3, 4, 5, 6, 7, 8, 9], },
                filename: function () {
                    let d = new Date(); let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Account Journal' + e;
                },
                messageTop: function () { return '<h3 style = "text-align:center"> Layla Sleep Inc.</h3 ><br /><h3 style="text-align:left">Account journals</h3>'; },
            }
        ],
        /* columnDefs: [{ targets: [0], searchable: false, orderable: false }], order: [[0, "desc"], [2, "desc"]]*/
        columnDefs: [{ targets: [0,1], visible: false }], order: [[2, "desc"], [4, "asc"],  [0, "asc"],  [1, "asc"]]
    });
}


function getGrandTotalFull() {
    $.ajax({
        url: "/Accounting/GrandTotal",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        success: function (data) {

            var d = JSON.parse(data);
            if (d.length > 0) {
                $("#txtdebit").text('$' + d[0].debit);
                $("#txtcredit").text('$' + d[0].credit);
                $("#txtbalance").text('$' + d[0].balance)
            }
        },
        error: function (msg) {

        }
    });
}

function getVendor() {
    $.ajax({
        url: "/Accounting/GetVendor",
        type: "Get",
        success: function (data) {
            $('#ddlVendor').append('<option value="">Please Select Vendor</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddlVendor').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}


function getGrandTotal(is_date) {
    let urid = $("#ddlVendor").val();
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';
    let account_num = $("#ddlAccount").val();
    let obj = { strValue1: dfa, strValue2: urid, strValue3: account_num };
    $.ajax({
        url: "/Accounting/JournalDatewithVendoreTotal",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: obj,
        success: function (data) {
            var d = JSON.parse(data);
            if (d.length > 0) {
                if (parseInt(d[0].debit).toFixed(2) > 0 || parseInt(d[0].debit).toFixed(2) == 0) {
                    $("#txtdebit").text('$' + (d[0].debit)); $("#txtcredit").text('$' + (d[0].credit)); $("#txtbalance").text('$' + (d[0].balance))
                }
            }
        },
        error: function (msg) {

        }
    });
}

function getChartofaccount() {
    $.ajax({
        url: "/Accounting/ChartofAccountsdropdown",
        type: "Get",
        success: function (data) {
            $('#ddlAccount').append('<option value="">Please select account</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddlAccount').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}