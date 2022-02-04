function FiscalYearList() {
    var ID = $("#hfid").val();
    var obj = { id: ID };
    //var numberRenderer = $.fn.dataTable.render.number(',', '.', 2,).display;
    var table_EL = $('#AccountCategoryListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': false, 'targets': [0] }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: false, bAutoWidth: false, searching: true,
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
            $('#AccountCategoryListdata_filter input').unbind();
            $('#AccountCategoryListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        /*sAjaxSource: "/Accounting/GetAccountFiscalYearList",
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
            url: '/Accounting/GetAccountFiscalYearList', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { console.log(JSON.parse(data)); return JSON.parse(data); }
        },
        aoColumns: [
            { data: 'id', title: 'Id', sWidth: "5%", render: function (inv_num, type, full, meta) { return full.sortid; } },
            { data: 'label', title: 'Label', sWidth: "10%", class: "text-left" },
            { data: 'date_start', title: 'Start date', sWidth: "10%", class: "text-left" },
            { data: 'date_end', title: 'Date end', sWidth: "10%", class: "text-left" },
            { data: 'status', title: 'Status', sWidth: "10%", class: "text-left" },
            {
                'data': 'id', sWidth: "8%",
                'render': function (id, type, full, meta) {
                    //if ($("#hfEdit").val() == "1") {
                    return '<span title="Click here to edit fiscal year." data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="EditSelect(' + id + ');"><i class="glyphicon glyphicon-pencil"></i></a></span>';
                    //}
                    //else { return "No permission" }
                }
            },
        ],
        //"dom": 'lBftipr',
    });
}

function AddFiscalYear() {
    let label = $("#txtlabel").val();
    let datestart = $("#txtstartdate").val();
    let dateend = $("#txtenddate").val();
    let status = $("#chkstatus").prop("checked") ? 1 : 0;

    if (label == "") {
        swal('Alert', 'Please enter label', 'error').then(function () { swal.close(); $('#txtlabel').focus(); });
    }
    else if (datestart == "") {
        swal('Alert', 'Please enter start date', 'error').then(function () { swal.close(); $('#txtstartdate').focus(); });
    }
    else if (dateend == "") {
        swal('Alert', 'Please enter end date', 'error').then(function () { swal.close(); $('#txtenddate').focus(); });
    }
    else {
        var obj = {
            label: label,
            status: status,
            date_start: datestart,
            date_end: dateend,
        }
        $.ajax({
            url: '/Accounting/AddAccountFiscalYear/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success');
                    ResetBox();
                    FiscalYearList();
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
        url: '/Accounting/GetAccountFiscalYearById/',
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            console.log(jobj[0].label);
            $("#hfid").val(jobj[0].id);
            $('#txtlabel').val(jobj[0].label);
            $('#txtstartdate').val(jobj[0].date_start);
            $('#txtenddate').val(jobj[0].date_end);
            jobj[0].status == true ? $("#chkstatus").prop("checked", true) : $("#chkstatus").prop("checked", false);

            $("#btnAdd").hide();
            $("#btnUpdate").show();

            isEdit(true);
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}

function UpdateFiscalYear() {
    let id = $("#hfid").val();
    let label = $("#txtlabel").val();
    let datestart = $("#txtstartdate").val();
    let dateend = $("#txtenddate").val();
    let status = $("#chkstatus").prop("checked") ? 1 : 0;
    if (label == "") {
        swal('Alert', 'Please enter label', 'error').then(function () { swal.close(); $('#txtlabel').focus(); });
    }
    else if (datestart == "") {
        swal('Alert', 'Please enter start date', 'error').then(function () { swal.close(); $('#txtstartdate').focus(); });
    }
    else if (dateend == "") {
        swal('Alert', 'Please enter end date', 'error').then(function () { swal.close(); $('#txtenddate').focus(); });
    }
    else {
        var obj = {
            rowid: id,
            label: label,
            status: status,
            date_start: datestart,
            date_end: dateend,
        }
        $.ajax({
            url: '/Accounting/UpdateAccountFiscalYear/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success');
                    ResetBox();
                    FiscalYearList();

                    $("#btnUpdate").hide();
                    $("#btnAdd").show();
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () {
                $("#loader").hide();
                isEdit(false);
            },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })

    }

}

function ResetBox() {
    $("#hfid").val("");
    $("#txtlabel").val("");
    $("#txtstartdate").val("");
    $("#txtenddate").val("");
    $("#chkstatus").prop("checked", false);
}