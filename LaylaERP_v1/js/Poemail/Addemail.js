function getUserid() {
    $.ajax({
        url: "/Poemail/GetUseridList",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please select user id</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlUserid').html(opt);
        }

    });
}

$("#ddlUserid").change(function () {
    getUseremail();
});

function getUseremail() {
    let empcode = $('#ddlUserid').val();
    let obj = {
        userid: empcode,
    }
    $.ajax({
        url: "/Poemail/GetUseremailList",
        dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            if (jobj.length > 0) {
                $("#txtemail").val(jobj[0].user_email);
            }
        }
    })
}

function EmailList() {
    var urid = $("#ddlSearchStatus").val();
    ID = $("#hfid").val();
    var table_EL = $('#EmailListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': true, 'targets': [0] }], order: [[0, "desc"]],
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
            $('#EmailListdata_filter input').unbind();
            $('#EmailListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Poemail/GetPoemailList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "user_id" : oSettings.aaSorting[0][0] == 1 ? "user_email" : oSettings.aaSorting[0][0] == 2 ? "status" : "id";
                aoData.push({ name: "sSortColName", value: col });
            }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [

            { data: 'user_id', title: 'Id', sWidth: "5%" },
            { data: 'user_email', title: 'Email', sWidth: "10%" },
            { data: 'status', title: 'Status', sWidth: "10%" },
            {
                'data': 'id', sWidth: "10%", title: 'Action',
                'render': function (id, type, full, meta) {
                    return '<a href="#" onclick="EditSelectAddress(' + id + ');"><i class="glyphicon glyphicon-pencil"></i></a>';
                }
            }
        ]
    });
}

function AddEmail() {
    userid = $("#ddlUserid").val();
    useremail = $("#txtemail").val();
    status = $("#chkstatus").prop("checked") ? 1 : 0;
    if (userid == "-1") {
        swal('Alert', 'Please select user id', 'error').then(function () { swal.close(); $('#ddlUserid').focus(); });
    }
    else if (useremail == "") {
        swal('Alert', 'Please user email', 'error').then(function () { swal.close(); $('#txtemail').focus(); });
    }
    else {
        var obj = {
            user_id: userid,
            user_email: useremail,
            status: status,
        }
        $.ajax({
            url: '/Poemail/AddPoemail', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success!', data.message, 'success');
                    EmailList();
                    reset();
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

function EditSelectAddress(id) {
    var obj = { strValue1: id }
    $.ajax({
        url: '/Poemail/GetpoemailByID/',
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            console.log(jobj[0].rowid);
            $("#hfid").val(jobj[0].rowid);
            $("#ddlUserid").val(jobj[0].user_id).trigger('change');
            $("#txtemail").val(jobj[0].user_email);
            jobj[0].status == true ? $("#chkstatus").prop("checked", true) : $("#chkstatus").prop("checked", false);

            $("#btnUpdate").show();
            $("#btnSave").hide();
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}

function UpdateEmail() {
    ids = $("#hfid").val();
    userid = $("#ddlUserid").val();
    useremail = $("#txtemail").val();
    status = $("#chkstatus").prop("checked") ? 1 : 0;
    if (userid == "-1") {
        swal('Alert', 'Please select user id', 'error').then(function () { swal.close(); $('#ddlUserid').focus(); });
    }
    else if (useremail == "") {
        swal('Alert', 'Please user email', 'error').then(function () { swal.close(); $('#txtemail').focus(); });
    }
    else {
        var obj = {
            rowid:ids,
            user_id: userid,
            user_email: useremail,
            status: status,
        }
        $.ajax({
            url: '/Poemail/UpdateEmail', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success!', data.message, 'success');
                    EmailList();
                    reset();
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

function reset() {
    $("#txtemail").val("");
    $("#ddlUserid").val('-1').trigger('change');
    $("#hfid").val("");
    $("#chkstatus").prop("checked", false);
    $("#btnSave").show();
    $("#btnUpdate").hide();
}

