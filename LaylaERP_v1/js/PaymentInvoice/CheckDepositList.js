$(document).ready(function () {
    $("#loader").hide();

    var urlpath = window.location.pathname;
    var pathid = urlpath.substring(urlpath.lastIndexOf('/') + 1);
    console.log(pathid);
    if (pathid == "1000011") {
        $('.nav-tabs a[href="#tab_22"]').tab('show');
        console.log(pathid);
    };

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
    filldropdown();
    $(".select2").select2();


    //$('#dtdatacleared tbody').on('click', '.pdetails-control', function () {
    //     console.log('svvvd');
    //    var tr = $(this).closest('tr');
    //    var row = $('#dtdatacleared').DataTable().row(tr);
    //    if (row.child.isShown()) {
    //        // This row is already open - close it
    //        tr.find('.pdetails-control').empty().append('<i class="glyphicon glyphicon-plus-sign"></i>');
    //        row.child.hide();
    //        tr.removeClass('shown');
    //    } else {
    //        // Open this row
    //        tr.find('.pdetails-control').empty().append('<i class="glyphicon glyphicon-minus-sign"></i>');
    //        //row.child(formatPartially(row.data())).show();
    //        row.child(formatPO(row.data())).show();
    //        tr.addClass('shown');
    //    }
    //});

    $(document).on('click', "#btnChange", function () {
         takepayment();         
    });

});

function filldropdown() {
    $.ajax({
        url: "/PaymentInvoice/GetPaymentType",
        type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            $("#ddlbankaccount").html('<option value="0">Select Account</option>');
            for (i = 0; i < dt['Table1'].length; i++) { $("#ddlbankaccount").append('<option value="' + dt['Table1'][i].id + '">' + dt['Table1'][i].text + '</option>'); }
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }
    });
}

function Search() {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    var account = $('#ddlbankaccount').val();
    if (account == "0") { swal('Alert', 'Please select account', 'error'); }
    else {
        //$.when(Uncleared()).done(function () {
        //    Rejected();
        //});
        Uncleared();
        validatedata();
        Rejected();
         Cleared();
    }

    $('#dtdatavalidate tbody').on('click', '.pdetails-control', function () {
        console.log('svvvd');
        var tr = $(this).closest('tr');
        var row = $('#dtdatavalidate').DataTable().row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            tr.find('.pdetails-control').empty().append('<i class="glyphicon glyphicon-plus-sign"></i>');
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            tr.find('.pdetails-control').empty().append('<i class="glyphicon glyphicon-minus-sign"></i>');
            //row.child(formatPartially(row.data())).show();
            row.child(formatPO(row.data())).show();
            tr.addClass('shown');
        }
    });
}


function Uncleared() {

    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    var account = $('#ddlbankaccount').val();
    $('#dtdata').DataTable({
        destroy: true, bProcessing: true, bServerSide: true,
        bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        sAjaxSource: "/CheckDeposit/GetCheckDepositList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: account }, { name: "strValue2", value: sd }, { name: "strValue3", value: ed }, { name: "strValue4", value: "0" });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", async: false, url: sSource, data: aoData,
                "success": function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [
            //{ data: 'id', title: '#', sWidth: "8%" },
            {
                'data': 'id', sWidth: "2%   ", 'render': function (data, type, row) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '"><label></label>';
                }
            },
            { data: 'date_creation', title: 'Check Reception  Date', sWidth: "10%" },
            { data: 'num_payment', sWidth: "10%", title: 'Check No', sWidth: "10%" },
            { data: 'Transmitter', title: 'Transmitter', sWidth: "10%" },
            { data: 'Bank', title: 'Check Details', sWidth: "10%" },
            { data: 'amount', title: 'Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') }
            /*   { data: 'Status', title: 'Transaction', sWidth: "10%" }*/
        ],
        columnDefs: [{ targets: [0], searchable: false }], order: [[1, "desc"]]
    });
}

function Rejected() {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    var account = $('#ddlbankaccount').val();
    $('#dtdatarejected').DataTable({
        destroy: true, bProcessing: true, bServerSide: true,
        bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        sAjaxSource: "/CheckDeposit/GetCheckDepositList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: account }, { name: "strValue2", value: sd }, { name: "strValue3", value: ed }, { name: "strValue4", value: "7" });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", async: false, url: sSource, data: aoData,
                "success": function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [
            //{ data: 'id', title: '#', sWidth: "8%" },
            {
                'data': 'id', title: '', sWidth: "8%",
                'render': function (id, type, row, meta) {
                    return '<a href="javascript:void(0);" data-toggle="tooltip" title="Cleared this" onClick="Validate(' + id + ')"><i class="glyphicon glyphicon-eye-open"></i></a>'
                   
                }
            },
            { data: 'date_creation', title: 'Check Reception  Date', sWidth: "10%" },
            { data: 'num_payment', sWidth: "10%", title: 'Check No', sWidth: "10%" },
            { data: 'Transmitter', title: 'Transmitter', sWidth: "10%" },
            { data: 'Bank', title: 'Check Details', sWidth: "10%" },
            { data: 'amount', title: 'Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') }
            /*   { data: 'Status', title: 'Transaction', sWidth: "10%" }*/
        ],
        columnDefs: [{ targets: [0], searchable: false }], order: [[1, "desc"]]
    });
}

function validatedata() {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    var account = $('#ddlbankaccount').val();
    $('#dtdatavalidate').DataTable({
        destroy: true, bProcessing: true, bServerSide: true,
        bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        sAjaxSource: "/CheckDeposit/GetCheckClearedDepositList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: account }, { name: "strValue2", value: sd }, { name: "strValue3", value: ed }, { name: "strValue4", value: "1" });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", async: false, url: sSource, data: aoData,
                "success": function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [
            { data: 'id', title: '', sWidth: "8%" },
            //{            
            //    'data': 'id', title: '', sWidth: "8%",
            //    'render': function (id, type, row, meta) {
            //        return '<a href="javascript:void(0);" data-toggle="tooltip" title="Reject this" onClick="Rejectthis(' + id + ')"><i class="glyphicon glyphicon-trash"></i></a>'
            //}

            //},
            {
                data: 'ref', title: 'VOU. No', sWidth: "12%", render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    //return '<a href="javascript:void(0);" class="pdetails-control" data-toggle="tooltip" title="Click here to show details."><i class="glyphicon glyphicon-plus-sign"></i></a> #' + row.ref + ' <a href="#" onclick="getPurchaseOrderPrint(' + row.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                    return '<a href="javascript:void(0);" class="pdetails-control" data-toggle="tooltip" title="Click here to show details."><i class="glyphicon glyphicon-plus-sign"></i></a> #' + row.ref + ' <a href="#" onclick="GetCheckDepositPrint(' + row.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'date_creation', title: 'Check Reception  Date', sWidth: "10%" },
            // { data: 'num_payment', sWidth: "10%", title: 'Check No', sWidth: "10%" },
            { data: 'Transmitter', title: 'Transmitter', sWidth: "10%" },
            //{ data: 'Bank', title: 'Check Details', sWidth: "10%" },
            { data: 'amount', title: 'Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') }
            /*   { data: 'Status', title: 'Transaction', sWidth: "10%" }*/
        ],
        columnDefs: [{ targets: [0], searchable: false, visible: false }], order: [[1, "desc"]]
    });
}


function Cleared() {

    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    var account = $('#ddlbankaccount').val();
    $('#dtdatacleared').DataTable({
        destroy: true, bProcessing: true, bServerSide: true,
        bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        sAjaxSource: "/CheckDeposit/GetCheckDepositList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: account }, { name: "strValue2", value: sd }, { name: "strValue3", value: ed }, { name: "strValue4", value: "2" });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", async: false, url: sSource, data: aoData,
                "success": function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [
            //{ data: 'id', title: '#', sWidth: "8%" },
            {
                'data': 'id', title: '', sWidth: "8%",
                'render': function (id, type, row, meta) {
                    return '<a href="javascript:void(0);" data-toggle="tooltip" title="Reject this" onClick="Rejectthis(' + id + ')"><i class="glyphicon glyphicon-eye-open"></i></a>'

                }
            },
            { data: 'date_creation', title: 'Check Reception  Date', sWidth: "10%" },
            { data: 'num_payment', sWidth: "10%", title: 'Check No', sWidth: "10%" },
            { data: 'Transmitter', title: 'Transmitter', sWidth: "10%" },
            { data: 'Bank', title: 'Check Details', sWidth: "10%" },
            { data: 'amount', title: 'Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') }
            /*   { data: 'Status', title: 'Transaction', sWidth: "10%" }*/
        ],
        columnDefs: [{ targets: [0], searchable: false }], order: [[1, "desc"]]
    });
}

function formatPO(d) {
    let option = { strValue1: d.id }, wrHTML = '<table class="inventory-table1 table-blue table check-table table-bordered table-striped dataTable no-footer"><thead><tr><th style="width:20%; text-align:left; visibility:inherit; opacity:1;">#</th><th style="width:30%; text-align:left; visibility:inherit; opacity:1;">Check No</th><th style="width:45%; text-align:left; visibility:inherit; opacity:1;">Check Details</th><th style="width:10%; text-align:right; visibility:inherit; opacity:1;">Amount</th></tr></thead>';
    $.ajax({
        url: '/CheckDeposit/GetClearedDataList', type: 'post', dataType: 'json', contentType: "application/json; charset=utf-8", data: JSON.stringify(option),
        success: function (result) {
            result = JSON.parse(result);
            if (result.length == 0) { wrHTML += '<tbody><tr><td valign="top" colspan="3" class="no-data-available">Sorry no matching records found.</td></tr></tbody>'; }
            $(result).each(function (index, row) {
             
                wrHTML += '<tr><td style="width:20%; text-align:left;"><a href="javascript:void(0);" title="Reject this" data-toggle="tooltip" class="editbutton" onClick="Rejectthis(' + row.id + ')"><i class="glyphicon glyphicon-trash"></i></a>  <a href="javascript:void(0);" title="Clear this" data-toggle="tooltip" class="editbutton" onClick="Clearedthis(' + row.id + ')"><i class="glyphicon glyphicon-eye-open"></i></a>  </td><td style="width:30%; text-align:left;">' + row.num_payment + '</td>';
                wrHTML += '<td style="width:45%; text-align:left;">' + '$' + row.comments + '</td>';
                wrHTML += '<td style="width:10%; text-align:right;">' + '$' + row.amount + '</td></tr > ';
            });
        },
        error: function (xhr, status, err) { alert(err); },
        complete: function () { }, async: false 
    });
    wrHTML += '</table>';
    return wrHTML;
}
function CheckAll() {
    var isChecked = $('#checkall').prop("checked");
    $('#dtdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
}
function Singlecheck(chk) {
    var isChecked = $(chk).prop("checked");
    var isHeaderChecked = $("#checkall").prop("checked");
    if (isChecked == false && isHeaderChecked)
        $("#checkall").prop('checked', isChecked);
    else {
        $('#dtdata tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkall").prop('checked', isChecked);
    }
}

function takepayment() {
    let id = "";
    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        id += $(this).val() + ",";
    });
    id = id.replace(/,(?=\s*$)/, '');
    $("#checkAll").prop('checked', false);
    let status = 'PO'// $('#ddlStatus').val();
    console.log(id);

    if (id == "") {
        swal('Alert', 'Please select a check deposit list', 'error');
    }
    else {
        //var name = $("#txtName").val();
        var account = $("#ddlbankaccount").val();
        /*var url = "Page2.htm?status=" + encodeURIComponent(name) + "&technology=" + encodeURIComponent(tech);*/
        ActivityLog('Check deposit list', '/CheckDeposit/CheckDepositList/?status=' + account + '&id=' + id+'');
        var url = "/CheckDeposit/CheckDepositPayment?status=" + account + "&id=" + id;
        window.location.href = url;
    }

    
}

function Rejectthis(id) {

    //let accountid = $("#hfstatus").val();

    //let _list = createItemsList();
    //let _order = {
    //    amount: parseFloat($("#Total").text()), fk_bank: accountid,
    //}
    let option = { strValue1: id}
    //console.log(option);
    swal.queue([{
        title: 'Are you sure?', confirmButtonText: 'Yes', text: 'Would you like to reject this amount?',
        showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                $.post('/CheckDeposit/RejectAmount', option).done(function (result) {
                    result = JSON.parse(result);
                    if (result[0].Response == "Success") {
                        swal('Success', 'Amount has been reject successfully!!', 'success').then((result) => {
                            Cleared(), Rejected();
                            $('.nav-tabs a[href="#tab_23"]').tab('show');
                        });

                    }
                    else { swal('Error', 'Something went wrong, please try again.', "error"); }
                }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
            });
        }
    }]);

}

function Clearedthis(id) {

    //let accountid = $("#hfstatus").val();

    //let _list = createItemsList();
    //let _order = {
    //    amount: parseFloat($("#Total").text()), fk_bank: accountid,
    //}
    let option = { strValue1: id }
    //console.log(option);
    swal.queue([{
        title: 'Are you sure?', confirmButtonText: 'Yes', text: 'Would you like to cleare this amount?',
        showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                $.post('/CheckDeposit/CheckCleare', option).done(function (result) {
                    result = JSON.parse(result);
                    if (result[0].Response == "Success") {
                        swal('Success', 'amount has been cleared successfully!!', 'success').then((result) => {
                            Cleared(), Rejected();
                            $('.nav-tabs a[href="#tab_22"]').tab('show');
                        });

                    }
                    else { swal('Error', 'Something went wrong, please try again.', "error"); }
                }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
            });
        }
    }]);

}

function Validate(id) {

    let option = { strValue1: id }
    //console.log(option);
    swal.queue([{
        title: 'Are you sure?', confirmButtonText: 'Yes', text: 'Would you like to cleared this amount?',
        showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                $.post('/CheckDeposit/ClearedAmount', option).done(function (result) {
                    result = JSON.parse(result);
                    if (result[0].Response == "Success") {
                        swal('Success', 'Amount has been cleared successfully!!', 'success').then((result) => {
                            Rejected(), Cleared();
                            $('.nav-tabs a[href="#tab_22"]').tab('show');
                             
                        });

                    }
                    else { swal('Error', 'Something went wrong, please try again.', "error"); }
                }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
            });
        }
    }]);

}


