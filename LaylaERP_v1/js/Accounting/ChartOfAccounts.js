﻿$(document).ready(function () {
    $("#loader").hide();
    var loc = window.location.pathname;
    $.when(CheckPermissions("#AddChartOfAccount", "#hfEdit", "", loc)).then(ChartOfAccountGrid());
    $(document).on("click", "#btnExportDetails", function (t) { t.preventDefault(); ExportChartOfAccount(''); });
})

function ChartOfAccountGrid() {
    $.ajax({
        url: '/Accounting/GetChartOfAccounts',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        
        success: function (data) {
            $('#dtdata').dataTable({
                destroy: true,
                scrollX: true,
                data: JSON.parse(data),
                columnDefs: [{ 'visible': false, 'targets': [0] }],
                responsive: true, lengthMenu: [[20, 50, 100], [20, 50, 100]],
                "columns": [
                    { data: 'ID', title: 'Account Code', sWidth: "10%" },
                    { data: 'account_number', title: 'Account Number', sWidth: "10%", sType: 'numeric' },
                    { data: 'label', title: 'Name', sWidth: "16%" },
                    { data: 'pcg_type', title: 'Type', sWidth: "10%" },
                    { data: 'labelshort', title: 'Detail Type', sWidth: "15%" },
                    { data: 'ac_type', title: 'Account tag', sWidth: "15%" },
                    { data: 'Sub_Account', title: 'Parent Account', sWidth: "15%" },
                    { data: 'transaction_class', title: 'Class', sWidth: "15%" },
                    { data: 'account_category', title: 'Account category', sWidth: "8%" },
                    {
                        'data': 'active', sWidth: "4%", 'sClass': 'ws_nowrap text-center',
                        'render': function (id, type, full, meta) {
                            if (id == 1) {
                                toggleclass = "fas fa-toggle-on";
                                toggleStyle = "color: #25a580!important;font-size: 24px;";
                                toggleStatus = 0;
                            }

                            else {
                                toggleclass = "fas fa-toggle-off";
                                toggleStyle = "color: #25a580!important;font-size: 24px;";
                                toggleStatus = 1;
                            }
                            return ' <span title="Click here to change the status of chart of accounts" data-placement="bottom" data-toggle="tooltip"> <a href="#" onclick="ChangeStatus(' + full.ID + ',' + toggleStatus + ');"><i class="' + toggleclass + '" style="' + toggleStyle + '"></i></a></span>';
                        }
                    },

                    {
                        'data': 'account_number', sWidth: "7%",
                        'render': function (id, type, full, meta) {
                            return ' <span title="Click here to account balance list" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="model(' + id +');" ><i class="glyphicon glyphicon-eye-open"></i></a></span>';
                        }
                    },

                    {
                        'data': 'ID', sWidth: "7%",
                        'render': function (id, type, full, meta) {
                            if ($("#hfEdit").val() == "1") {
                                return ' <span title="Click here to edit chart of accounts" data-placement="bottom" data-toggle="tooltip"><a href="../Accounting/EditAccount/' + id + '" onclick="ActivityLog(\'Edit account id ' + id + ' in Chart of Accounts.\',\'/Accounting/chartofaccounts/' + id +'\');" ><i class="glyphicon glyphicon-pencil"></i></a></span>';
                            }
                            else {
                                return "No Permission";
                            }

                        }
                    },
                ],


                "order": [[1, 'asc']],
                
                "dom": 'lBftipr',
                "buttons": [
                    {
                        extend: 'csv',
                        className: 'button',
                        text: '<i class="fas fa-file-csv"></i> CSV',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8],
                            //modifier: {page: 'current'}
                        },
                        filename: function () {
                            var d = new Date();
                            var e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                            return 'Chart_of_accounts' + e;
                        },
                    },
                    {
                        extend: 'print',
                        title:'',
                        className: 'button',
                        text: '<i class="fas fa-file-csv"></i> Print',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5 , 6, 7, 8],
                            //modifier: { page: 'current' }
                        },
                        filename: function () {
                            var d = new Date();
                            var e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                            return 'Chart_of_accounts' + e;
                        },
                        messageTop: function () {
                            return '<h3 style = "text-align:center"> Layla Sleep Inc.</h3 ><br /><h3 style="text-align:left">Chart of accounts</h3>';
                        },
                    }
                ],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });

}

/*{ data: 'extraparams', title: 'Chart Tag', sWidth: "10%" },
                    { data: 'bs_type', title: 'BS Tag', sWidth: "4%" },*/

$('#btnSearch').click(function () {
    ChartOfAccountGrid();
})

function ChangeStatus(id, status) {
    console.log(status);
    let cofStatus = status == "0" ? "Inactive" : "Active";
    ActivityLog('change status as ' + cofStatus + '', '/Accounting/chartofaccounts/' + id + '');
    var obj = { rowid: id, active: status, }
    $.ajax({
        url: '/Accounting/UpdateChartOfAccountStatus/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            if (data.status == true) {

                ChartOfAccountGrid();

                swal('Success', data.message, 'success');
            }
            else { swal('Alert!', data.message, 'error') }
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}

function model(account_num) {
    $("#hfaccountid").val(account_num);
    $('#AccountModal').modal('show');
    $('#txtOrderDate').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        startDate: moment().subtract(6, 'days'), autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto"
    }, function (start, end, label) {
        AccountBalanceList(account_num, true)
        total(account_num, true, '');
        gttotal(account_num);
    });

    name(account_num);
    setTimeout(function () { AccountBalanceList(account_num, true) }, 1000);
    total(account_num, true, '');
    gttotal(account_num);
}

function AccountBalanceList_Old(account_num, is_date) {
    let j = $("#exampleModalLongTitle").text();
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';
    //var vendor = $("#ddlVendor").val();
    //let account_num = $("#ddlAccount").val();
    var obj = {strValue2: dfa, strValue3: account_num };
    var numberRenderer = $.fn.dataTable.render.number(',', '.', 2,).display;
    var table_EL = $('#EmployeeListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': false, 'targets': [0] }, { "searchable": false, "targets": 3 }], order: [[0, "desc"]],
      
        destroy: true, bProcessing: true, bServerSide: false, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[20, 50], [20, 50]], scrollX: true, scrollY: ($(window).height() - 215),
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#EmployeeListdata_filter input').unbind();
            $('#EmployeeListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); console.log(this.value); total(account_num, true, this.value); }
                
            });
        },
        /*sAjaxSource: "/Accounting/GetBalanceList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "id" : oSettings.aaSorting[0][0] == 1 ? "account" : oSettings.aaSorting[0][0] == 2 ? "debit" : oSettings.aaSorting[0][0] == 3 ? "credit" : oSettings.aaSorting[0][0] == 4 ? "balance" : "id";
                aoData.push({ name: "sSortColName", value: col });
            }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },*/
        ajax: {
            url: '/Accounting/ChartOfAccountBalanceList', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { console.log(JSON.parse(data)); return JSON.parse(data); }
        },
        aoColumns: [
            { data: 'id', title: 'ID', sWidth: "5%" },
            { data: 'datesort', title: 'Date', sWidth: "5%", class: "text-left", render: function (inv_num, type, full, meta) { return full.docdate; } },
            {
                data: 'PO_SO_ref', title: 'Accounting Doc', sWidth: "15%",
                'render': function (inv_num, type, full, meta) {
                    if (full.code_journal == "AC" || full.code_journal == "BQ") {

                        if (full.code_journal == "AC")
                            return '' + inv_num + '<span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getPurchaseOrderPrint(' + full.inv_num + ', false);"><i class="fas fa-search-plus"></i></a></span>';

                        else if (full.PO_SO_ref.substring(0, 2) == "PO")
                            return '' + inv_num + '<span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getPurchaseOrderPrint(' + full.inv_num + ', false);"><i class="fas fa-search-plus"></i></a></span>';
                        else
                            return '' + inv_num + '<span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getaccountsoPrintDetails(\'' + full.PO_SO_ref.toString() + '\', false);"><i class="fas fa-search-plus"></i></a></span>';
                    }
                    else if (full.code_journal == "OD") {
                        return '' + inv_num + '<span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getBillPrintDetails(' + full.inv_num + ', false);"><i class="fas fa-search-plus"></i></a></span>';
                    }
                    else {
                        return '' + inv_num + '<a href="#" onclick="PurchaseSalesPrint(' + full.inv_num + ',\'' + full.datecreation + '\');"><i class="fas fa-search-plus"></i></a>';
                    }
                }
            },
            { data: 'label_operation', title: 'Label', sWidth: "15%", class: "text-left" },
            //{ data: 'account', title: 'Accounting Account', sWidth: "5%", class: "text-left" },
            { data: 'debit', title: 'Debit ($)', sWidth: "10%", render: $.fn.dataTable.render.number(',', '.', 2, ''), class: "text-right" },
            { data: 'credit', title: 'Credit ($)', sWidth: "10%", render: $.fn.dataTable.render.number(',', '.', 2, ''), class: "text-right" },
        ],

        "dom": 'lBftipr',
        "buttons": [
            {
                extend: 'csv',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> CSV',
                filename: function () {
                    var d = new Date();
                    var e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Account' + e;
                },
            },
            {
                extend: 'print',
                className: 'button',
                title: '',
                text: '<i class="fas fa-file-csv"></i> Print',
                filename: function () {
                    var d = new Date();
                    var e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Account' + e;
                },
                messageTop: function () {
                    return '<h3 style = "text-align:center"> Layla Sleep Inc.</h3 ><br /><h3 style="text-align:left">' + j + '</h3>';
                },
            },
            ],
    });
}

function AccountBalanceList(account_num, is_date) {
    let j = $("#exampleModalLongTitle").text();
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';
  //  var obj = { strValue2: dfa, strValue3: account_num };
  //  var numberRenderer = $.fn.dataTable.render.number(',', '.', 2,).display;
    var table_EL = $('#EmployeeListdata').DataTable({
        //columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': false, 'targets': [0] }, { "searchable": false, "targets": 3 }], order: [[0, "desc"]],
        //destroy: true, bProcessing: true, bServerSide: false, bAutoWidth: false, searching: true,
        //responsive: true, lengthMenu: [[20, 50], [20, 50]], scrollX: true, scrollY: ($(window).height() - 215),
        //language: {
        //    lengthMenu: "_MENU_ per page",
        //    zeroRecords: "Sorry no records found",
        //    info: "Showing _START_ to _END_ of _TOTAL_ entries",
        //    infoFiltered: "",
        //    infoEmpty: "No records found",
        //    processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        //},
        //initComplete: function () {
        //    $('#EmployeeListdata_filter input').unbind();
        //    $('#EmployeeListdata_filter input').bind('keyup', function (e) {
        //        var code = e.keyCode || e.which;
        //        if (code == 13) { table_EL.search(this.value).draw(); console.log(this.value); total(account_num, true, this.value); }

        //    });
        //},
        //ajax: {
        //    url: '/Accounting/ChartOfAccountBalanceList', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
        //    dataSrc: function (data) { console.log(JSON.parse(data)); return JSON.parse(data); }
        //}, 
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[20, 50, 100, 200, 999, 4500], [20, 50, 100, 200, 999, 4500]], order: [[0, "desc"]],
        //columnDefs: [{ targets: [0, 1], visible: false }], order: [[2, "desc"]],// order: [[2, "desc"], [4, "asc"], [0, "asc"], [1, "asc"]],
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)", infoFiltered: "",
            infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#EmployeeListdata_filter input').unbind();
            $('#EmployeeListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                // if (code == 13) { table_EL.search(this.value).draw(); ExportJournal(this.value);}
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        
        sAjaxSource: "/Accounting/JournalAccountList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: 'CRTAC' }, { name: "strValue2", value: sd }, { name: "strValue3", value: ed }, { name: "strValue4", value: account_num }, { name: "strValue5", value: '' });
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
            { data: 'id', title: 'ID', sWidth: "5%" },
            { data: 'datesort', title: 'Date', sWidth: "5%", class: "text-left", render: function (inv_num, type, full, meta) { return full.docdate; } },
            {
                data: 'PO_SO_ref', title: 'Accounting Doc', sWidth: "15%",
                'render': function (inv_num, type, full, meta) {
                    //if (full.code_journal == "AC") return '' + inv_num + '<span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getPurchaseOrderPrint(' + full.inv_num + ', false);"><i class="fas fa-search-plus"></i></a></span>';
                    //else return '' + inv_num + '<a href="#" onclick="PurchaseSalesPrint(' + full.inv_num + ',\'' + full.datecreation + '\');"><i class="fas fa-search-plus"></i></a>';
                    ////return '<a href="NewReceiveOrder/' + full.id + '">' + id + '</a> <a href="#" onclick="getPurchaseOrderPrint(' + full.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                    console.log(full.code_journal);
                    if (full.code_journal == "AC" || full.code_journal == "BQ") {

                        if (full.code_journal == "AC" && full.PO_SO_ref.substring(0, 2) != "PR")
                            return '' + inv_num + '<span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getPurchaseOrderPrint(' + full.inv_num + ', false);"><i class="fas fa-search-plus"></i></a></span>';
                        else if (full.PO_SO_ref.substring(0, 2) != "PO" && full.doc_type == 'FT')
                            return inv_num;
                        else if (full.PO_SO_ref.substring(0, 2) == "PR")
                            return '' + inv_num + '<span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getInvoicePrintnew(' + full.inv_num + ', false);"><i class="fas fa-search-plus"></i></a></span>';
                        //wrHTML += '<td style="width:10%; text-align:left;"><span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getPurchaseOrderPrint(' + full.inv_num + ', false);"><i class="fas fa - search - plus"></i>' + full.PO_SO_ref + '</a></span></td>';
                        else if (full.PO_SO_ref.substring(0, 2) == "PO")
                            return '' + inv_num + '<span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getPurchaseOrderPrint(' + full.inv_num + ', false);"><i class="fas fa-search-plus"></i></a></span>';
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
            { data: 'label_operation', title: 'Label', sWidth: "15%", class: "text-left" },
            //{ data: 'account', title: 'Accounting Account', sWidth: "5%", class: "text-left" },
            { data: 'debit', title: 'Debit ($)', sWidth: "10%", render: $.fn.dataTable.render.number(',', '.', 2, ''), class: "text-right" },
            { data: 'credit', title: 'Credit ($)', sWidth: "10%", render: $.fn.dataTable.render.number(',', '.', 2, ''), class: "text-right" },
        ],

        "dom": 'lBftipr',
        "buttons": [
            {
                extend: 'csv',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> CSV',
                filename: function () {
                    var d = new Date();
                    var e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Account' + e;
                },
            },
            {
                extend: 'print',
                className: 'button',
                title: '',
                text: '<i class="fas fa-file-csv"></i> Print',
                filename: function () {
                    var d = new Date();
                    var e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Account' + e;
                },
                messageTop: function () {
                    return '<h3 style = "text-align:center"> Layla Sleep Inc.</h3 ><br /><h3 style="text-align:left">' + j + '</h3>';
                },
            },
        ],
    });
}

function total(account_num, is_date,search) {
    let j = $("#exampleModalLongTitle").text();
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';
    //var vendor = $("#ddlVendor").val();
    //let account_num = $("#ddlAccount").val();
    //var obj = { strValue2: dfa, strValue3: account_num };

    var obj = { strValue1: account_num, strValue2: dfa, strValue3: search}
    $.ajax({
        url: '/Accounting/AccountBalanceTotalBydate',
        type: 'GET',
        dataType: 'json',
        contentType: 'application / json; charset=utf - 8',
        data: obj,
        success: function (data) {
            let jobj = JSON.parse(data);
            $("#lblcredit").text("$"+jobj[0].credit);
            $("#lbldebit").text("$" +jobj[0].debit);
            $("#lblbalance").text("$" +jobj[0].balance);
            $("#lblcredit1").text("$" +jobj[0].credit);
            $("#lbldebit1").text("$" +jobj[0].debit);
            $("#lblbalance1").text("$" +jobj[0].balance);
        },
        complete: function () { },
        error: function (error) { },
    })
}

function gttotal(account_num) {
    var obj = { strValue1: account_num}
    $.ajax({
        url: '/Accounting/AccountBalanceTotal',
        type: 'GET',
        dataType: 'json',
        contentType: 'application / json; charset=utf - 8',
        data: obj,
        success: function (data) {
            let jobj = JSON.parse(data);
            $("#lblgtcredit").text("$" + jobj[0].credit);
            $("#lblgtdebit").text("$" + jobj[0].debit);
            $("#lblgtbalance").text("$" + jobj[0].balance);
           
        },
        complete: function () { },
        error: function (error) { },
    })
}

function name(account_num) {
    var obj = { strValue1: account_num }
    $.ajax({
        url: '/Accounting/AccountName',
        type: 'GET',
        dataType: 'json',
        contentType: 'application / json; charset=utf - 8',
        data: obj,
        success: function (data) {
            let jobj = JSON.parse(data);
            $("#exampleModalLongTitle").text("Account: " + jobj[0].label);
        },
        complete: function () { },
        error: function (error) { },
    })
}

function ExportChartOfAccount(search) {
    let _income = 0, _expense = 0;
   let vendorid = '';
    let accountid = parseInt($("#hfaccountid").val()) || 0;
     let option = {};

    _date_from = $('#txtOrderDate').data('daterangepicker').startDate, _date_to = $('#txtOrderDate').data('daterangepicker').endDate;
    search = $('#EmployeeListdata_filter input').val();
    option = { vendor: vendorid, account: accountid, from_date: _date_from.format('MM-DD-YYYY'), to_date: _date_to.format('MM-DD-YYYY'), report_type: 'JOURNAL', filter: search };
   // console.log(option);
    $.when($("#loader").show()).done(function () {
    let url = "/accounting/ChartOffAcount-export?vendor=" + option.vendor + "&account=" + option.account + "&from_date=" + option.from_date + "&to_date=" + option.to_date + "&report_type=" + option.report_type + "&filter=" + option.filter;
    $("#fileForm").attr('action', url);
        $("#fileForm").submit();
    }).done(function () { $("#loader").hide(); });
    
}