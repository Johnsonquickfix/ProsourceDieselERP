
function AddLeaveType() {
    leavecode = $("#txtleavecode").val();
    leavetype = $("#txtleavetype").val();
    leavedays = $("#txtleavedays").val();
    status = $("#chkstatus").prop("checked") ? 1 : 0;
    if (leavecode == "") {
        swal('Alert', 'Please Enter Leave Code', 'error').then(function () { swal.close(); $('#txtleavecode').focus(); });
    }
    if (leavetype == "") {
        swal('Alert', 'Please Enter Leave Type', 'error').then(function () { swal.close(); $('#txtleavetype').focus(); });
    }
    if (leavedays == "") {
        swal('Alert', 'Please Enter Leave Days', 'error').then(function () { swal.close(); $('#txtleavedays').focus(); });
    }
    else {
        var obj = {
            leave_code: leavecode,
            leave_type: leavetype,
            leave_days: leavedays,
            is_active: status,
        }
        $.ajax({
            url: '/Hrms//', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success');//.then((result) => { location.href = '../productrule'; });
                    LeaveTypeList();
                    controlreset();
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })

    }
}

function LeaveTypeList() {
    $.ajax({
        url: '/Hrms/GetLeaveMasterList/',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        data: JSON.stringify(),
        success: function (data) {
            $('#DesignationList').dataTable({
                destroy: true,
                scrollX: false,
                data: JSON.parse(data),
                "columns": [
                    { data: 'id', title: 'Id', sWidth: "10%" },
                    { data: 'leave_code', title: 'Leave code', sWidth: "10%" },
                    { data: 'leave_type', title: 'Leave type', sWidth: "10%" },
                    { data: 'leave_days', title: 'Leave days', sWidth: "10%" },
                    { data: 'status', title: 'Status', sWidth: "10%" },
                    {
                        'data': 'id', sWidth: "10%", title: 'Action',
                        'render': function (id, type, full, meta) {
                            return '<a href="#" onclick="EditSelect(' + id + ');"><i class="glyphicon glyphicon-pencil"></i></a>';
                        }
                    }
                ],

                "order": [[0, 'desc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });

}

function EditSelect(id) {
    var obj = { strValue1: id }
    $.ajax({
        url: '/Hrms/GetLeaveTypeById/',
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            $("#hfid").val(jobj[0].id);
            $('#txtleavecode').val(jobj[0].leave_code);
            $('#txtleavetype').val(jobj[0].leave_type);
            $('#txtleavedays').val(jobj[0].leave_days);
            jobj[0].is_active == true ? $("#chkstatus").prop("checked", true) : $("#chkstatus").prop("checked", false);

            $("#btnUpdate").show();
            $("#btnAdd").hide();
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}

function UpdateLeaveType() {
    id = $("#hfid").val();
    leavecode = $("#txtleavecode").val();
    leavetype = $("#txtleavetype").val();
    leavedays = $("#txtleavedays").val();
    status = $("#chkstatus").prop("checked") ? 1 : 0;
    if (leavecode == "") {
        swal('Alert', 'Please Enter Leave Code', 'error').then(function () { swal.close(); $('#txtleavecode').focus(); });
    }
    if (leavetype == "") {
        swal('Alert', 'Please Enter Leave Type', 'error').then(function () { swal.close(); $('#txtleavetype').focus(); });
    }
    if (leavedays == "") {
        swal('Alert', 'Please Enter Leave Days', 'error').then(function () { swal.close(); $('#txtleavedays').focus(); });
    }
    else {
        var obj = {
            rowid: id,
            leave_code: leavecode,
            leave_type: leavetype,
            leave_days: leavedays,
            is_active: status,
        }
        $.ajax({
            url: '/Hrms/UpdateLeaveType/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success');//.then((result) => { location.href = '../productrule'; });
                    LeaveTypeList();
                    controlreset();
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })

    }
}

function controlreset() {
    $("#txtleavecode").val("");
    $("#txtleavetype").val("");
    $("#txtleavedays").val("");
}