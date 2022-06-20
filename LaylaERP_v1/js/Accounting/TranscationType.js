function TranscationTypeList() {
    var urid = parseInt($("#ddlSearchStatus").val());
    ID = $("#hfid").val();
    let table_JD = $('#TranscationTypeData').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }, { targets: [0], visible: false }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[20, 50], [20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#TranscationTypeData_filter input').unbind();
            $('#TranscationTypeData_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_JD.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Accounting/GetTranscationType/",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: ID });
            aoData.push({ name: "strValue2", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }

            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            { data: 'id', title: 'ID', sWidth: '5%' },
            { data: 'transaction_type', title: 'Transaction Type', sWidth: '10%', className: 'text-left' },
            { data: 'account_type', title: 'Account Type', sWidth: '10%'},
            {
                'data': 'id', sWidth: "8%",
                'render': function (id, type, full, meta) {
                    //if ($("#hfEdit").val() == "1") {
                    return '<span title="Click here to edit." data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="EditSelect(' + id + ');"><i class="glyphicon glyphicon-pencil"></i></a></span>';
                    //}
                    //else { return "No permission" }
                }
            },
        ]
    });
}

function AddTranscationType() {
    let transcationtype = $("#ddltranscation").val();
    let accounttype = $("#ddlaccount").val();

    if (transcationtype == "-1") {
        swal('Alert', 'Please select transaction type', 'error').then(function () { swal.close(); $('#ddltranscation').focus(); });
    }
    else if (accounttype == "-1") {
        swal('Alert', 'Please select account type', 'error').then(function () { swal.close(); $('#ddlaccount').focus(); });
    }
    else {
        var obj = {
            account_type: accounttype,
            transaction_type: transcationtype
        };
        $.ajax({
            url: '/Accounting/AddTranscationType/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success');
                    ResetBox();
                    TranscationTypeList();
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () { $("#loader").hide(); isEdit(false); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })

    }

}

function EditSelect(id) {
    var obj = { strValue1: id }
    $.ajax({
        url: '/Accounting/TranscationTypeById/',
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            $("#hfid").val(jobj[0].rowid);
            $('#ddltranscation').val(jobj[0].transaction_type).trigger('change');
            $('#ddlaccount').val(jobj[0].account_type).trigger('change');
            
            $("#btnAdd").hide();
            $("#btnUpdate").show();

            isEdit(true);
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}

function UpdateTranscationType() {
    let id = $("#hfid").val();
    let transcationtype = $("#ddltranscation").val();
    let accounttype = $("#ddlaccount").val();

    if (transcationtype == "-1") {
        swal('Alert', 'Please select transaction type', 'error').then(function () { swal.close(); $('#ddltranscation').focus(); });
    }
    else if (accounttype == "-1") {
        swal('Alert', 'Please select account type', 'error').then(function () { swal.close(); $('#ddlaccount').focus(); });
    }
    else {
        var obj = {rowid: id,account_type: accounttype, transaction_type: transcationtype};
        $.ajax({
            url: '/Accounting/UpdateTranscationType/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success');
                    ResetBox();
                    TranscationTypeList();

                    $("#btnUpdate").hide();
                    $("#btnAdd").show();
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () {$("#loader").hide();
                isEdit(false);
            },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })

    }

}

function ResetBox() {
    $("#hfid").val("");
    $("#ddltranscation").val('-1').trigger('change');
    $("#ddlaccount").val('-1').trigger('change');
}

function accountingAccount() {
    $.ajax({
        url: '/Accounting/GetAccountingAccount/',
        type: 'GET',
        success: function (data) {
            var opt = '<option value="-1">Please select account type</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlaccount').html(opt);
        }
    })
}

function EditSelect(id) {
    var obj = { strValue1: id }
    $.ajax({
        url: '/Accounting/TranscationTypeById/',
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            $("#hfid").val(jobj[0].rowid);
            $('#ddltranscation').val(jobj[0].transaction_type).trigger('change');
            $('#ddlaccount').val(jobj[0].account_type).trigger('change');

            $("#btnAdd").hide();
            $("#btnUpdate").show();

            isEdit(true);
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}

function TranscationTypeList() {
    var urid = parseInt($("#ddlSearchStatus").val());
    ID = $("#hfid").val();
    let table_JD = $('#TranscationTypeData').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }, { targets: [0], visible: false }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#TranscationTypeData_filter input').unbind();
            $('#TranscationTypeData_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_JD.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Accounting/GetTranscationType/",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: ID });
            aoData.push({ name: "strValue2", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }

            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            { data: 'id', title: 'ID', sWidth: '5%' },
            { data: 'transaction_type', title: 'Transaction Type', sWidth: '10%', className: 'text-left' },
            { data: 'account_type', title: 'Account Type', sWidth: '10%' },
            {
                'data': 'id', sWidth: "8%",
                'render': function (id, type, full, meta) {
                    //if ($("#hfEdit").val() == "1") {
                    return '<span title="Click here to edit." data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="EditSelect(' + id + ');"><i class="glyphicon glyphicon-pencil"></i></a></span>';
                    //}
                    //else { return "No permission" }
                }
            },
        ]
    });
}