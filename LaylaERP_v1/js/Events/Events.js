$(document).ready(function () {
    getUsers();
    getVendor();
    $("#txtcontact").mask("(999) 999-9999");
    $(".select2").select2();
    $("#btnSave").click(function () {
        AddEvents();
    });

    $("#btnEdit").click(function () {
        EditEvents();
    })
})
function getUsers() {
    $.ajax({
        url: "/Events/GetUsersList",
        type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            for (i = 0; i < dt['Table'].length; i++) { $("#ddluser").append('<option value="' + dt['Table'][i].ID + '">' + dt['Table'][i].user_login + '</option>'); }
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }
    });
}

function getVendor() {
    $.ajax({
        url: "/PurchaseOrder/GetVendor",
        type: "Get",
        success: function (data) {
            $('#ddlvendor').append('<option value="0">Please Select Vendor</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddlvendor').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}

function AddEvents() {
    var label = $("#txtlabel").val();
    var startdate = $("#txtstartdate").val();
    var enddate = $("#txtenddate").val();
    //var assignedto = $("#ddluser").val();
    var statearray = $('#ddluser option:selected')
        .toArray().map(item => item.value).join();
    assignedto = statearray;

    var userarray1 = $('#ddluser option:selected')
        .toArray().map(item => item.text).join();
    assigneduser = userarray1;
    var relatedvendor = $("#ddlvendor").val();
    var relatedcontact = $("#txtcontact").unmask().val();
    var task = $("#txttask").val();
    var description = $("#txtdescription").val();
    var status = $("#chkstatus").prop("checked") ? 1 : 0;

    if (label == "") {
        swal('Alert', 'Please enter the label', 'error').then(function () { swal.close(); $('#txtlabel').focus(); });
    }
    else if (startdate == "") {
        swal('Alert', 'Please enter start date', 'error').then(function () { swal.close(); $('#txtstartdate').focus(); });
    }
    else if (enddate == "") {
        swal('Alert', 'Please enter end date', 'error').then(function () { swal.close(); $('#txtenddate').focus(); });
    }
    else if (assignedto == "") {
        swal('Alert', 'Please enter assigned to', 'error').then(function () { swal.close(); $('#ddluser').focus(); });
    }
    else if (relatedvendor == "") {
        swal('Alert', 'Please select releated company', 'error').then(function () { swal.close(); $('#ddlvendor').focus(); });
    }
    else if (relatedcontact == "") {
        swal('Alert', 'Please enter releated contact', 'error').then(function () { swal.close(); $('#txtcontact').focus(); });
    }
    else if (task == "") {
        swal('Alert', 'Please enter task', 'error').then(function () { swal.close(); $('#txttask').focus(); });
    }
    else {
        var obj = {
            event_label: label,
            start_date: startdate,
            end_date: enddate,
            assigned_to: assignedto,
            related_contacts: relatedcontact,
            related_company: relatedvendor,
            status: status,
            task: task,
            description: description,
            assigned_user: assigneduser,
        }
        $.ajax({
            url: '/Events/AddEvents/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            searching: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success').then((result) => { location.href = '../../Events/EventsList'; });
                    $("#txtcontact").mask("(999) 999-9999");
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
    $("#txtlabel").val('');
    $('#txtstartdate').val('');
    $('#txtenddate').val('');
    $("#ddlvendor").val('');
    $("#txtcontact").val('');
    $("#txttask").val('');
    $("#txtdescription").val('');
    $("#chkstatus").prop("checked", false);
}

function EditEvents() {
    var id = $("#hfid").val();
    var label = $("#txtlabel").val().trim();
    var startdate = $("#txtstartdate").val();
    var enddate = $("#txtenddate").val();
    //var assignedto = $("#ddluser").val();
    var statearray = $('#ddluser option:selected')
        .toArray().map(item => item.value).join();
    assignedto = statearray;

    var userarray1 = $('#ddluser option:selected')
        .toArray().map(item => item.text).join();
    assigneduser = userarray1;
    var relatedvendor = $("#ddlvendor").val();
    var relatedcontact = $("#txtcontact").unmask().val();
    var task = $("#txttask").val();
    var description = $("#txtdescription").val();
    var status = $("#chkstatus").prop("checked") ? 1 : 0;

    if (label == "") {
        swal('Alert', 'Please enter the label', 'error').then(function () { swal.close(); $('#txtlabel').focus(); });
    }
    else if (startdate == "") {
        swal('Alert', 'Please enter start date', 'error').then(function () { swal.close(); $('#txtstartdate').focus(); });
    }
    else if (enddate == "") {
        swal('Alert', 'Please enter end date', 'error').then(function () { swal.close(); $('#txtenddate').focus(); });
    }
    else if (assignedto == "") {
        swal('Alert', 'Please enter assigned to', 'error').then(function () { swal.close(); $('#ddluser').focus(); });
    }
    else if (relatedvendor == "") {
        swal('Alert', 'Please select releated company', 'error').then(function () { swal.close(); $('#ddlvendor').focus(); });
    }
    else if (relatedcontact == "") {
        swal('Alert', 'Please enter releated contact', 'error').then(function () { swal.close(); $('#txtcontact').focus(); });
    }
    else if (task == "") {
        swal('Alert', 'Please enter task', 'error').then(function () { swal.close(); $('#txttask').focus(); });
    }
    else {
        var obj = {
            rowid: id,
            event_label: label,
            start_date: startdate,
            end_date: enddate,
            assigned_to: assignedto,
            related_contacts: relatedcontact,
            related_company: relatedvendor,
            status: status,
            task: task,
            description: description,
            assigned_user: assigneduser,
        }
        $.ajax({
            url: '/Events/UpdateEvents/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            searching: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success').then((result) => { location.href = '../../Events/EventsList'; });
                    $("#txtcontact").mask("(999) 999-9999");

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
