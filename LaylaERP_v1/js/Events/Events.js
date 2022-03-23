$(document).ready(function () {
    $(".select2").select2();
    $('#txtstartdate,#txtenddate').datepicker({ format: 'mm/dd/yyyy', autoclose: true, todayHighlight: true });
    $.when(getUsers()).done(function () { GetEventById(); });
    $("#btnSave").click(function () { AddEvents(); });
    $("#btnEdit").click(function () { AddEvents(); });
    // Color chooser button
    $(document).on("click", "#color-chooser > li > a", function (e) {
        e.preventDefault(); var currColor = '#ff851b'; //Red by default
        // Save color
        currColor = rgb2hex($(this).css('color')); 
        $('#color-chooser').find('i').removeClass('fa-check-square'); $('#color-chooser').find('i').addClass('fa-square');
        $(this).find('i').removeClass('fa-square'); $(this).find('i').addClass('fa-check-square');
        // Add color effect to button
        $('#btnSave').css({ 'background-color': currColor, 'border-color': currColor });
        $('#btnSave').data('bgcolor', currColor);
    })
})
const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

function getUsers() {
    $.ajax({
        url: "/Events/GetUsersList", type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            $.each(dt['Table'], function (i, row) { $("#ddluser").append('<option value="' + row.ID + '">' + row.user_login + '</option>'); });
        },
        complete: function () { $("#loader").hide(); }, error: function (xhr, status, err) { $("#loader").hide(); }, async: false
    });
}

function GetEventById() {
    let id = parseInt($("#btnSave").data("id")) | 0;
    $.ajax({
        url: "/Events/GetEventsById/" + id, type: "GET", contentType: "application/json; charset=utf-8", dataType: 'JSON',
        data: JSON.stringify({}), beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            var d = JSON.parse(data); 
            if (d.length > 0) {
                $("#btnSave").text('Update'); $(".lbl-title").text('Update Events');
                $("#hfid").val(d[0].rowid);
                $("#txtstartdate").val(d[0].start_date);
                $("#txtenddate").val(d[0].end_date);
                $('#ddluser').val(d[0].assigned_to).trigger('change');
                $("#txttask").val(d[0].task);
                $("#txtdescription").val(d[0].description);
                d[0].status == true ? $("#chkstatus").prop("checked", true) : $("#chkstatus").prop("checked", false);
                $("#btnSave").data("bgcolor", d[0].backgroundcolor);
                if (d[0].assigned_to !== null && d[0].assigned_to !== undefined) {
                    $("#ddluser").select2("val", [d[0].assigned_to.split(',')]);
                }
                $('#color-chooser').find('i').removeClass('fa-check-square'); $('#color-chooser').find('i').addClass('fa-square');

                if (d[0].backgroundcolor !== null && d[0].backgroundcolor !== undefined) {
                    $("[data-bgcolor$='" + d[0].backgroundcolor + "']").find('i').removeClass('fa-square'); $("[data-bgcolor$='" + d[0].backgroundcolor + "']").find('i').addClass('fa-check-square');
                }
            }
        },
        error: function (msg) { $("#loader").hide(); }, complete: function () { $("#loader").hide(); },
    });
}

function AddEvents() {
    let startdate = $("#txtstartdate").val(), enddate = $("#txtenddate").val();
    let assignedto = $('#ddluser option:selected').toArray().map(item => item.value).join();
    let assigneduser = $('#ddluser option:selected').toArray().map(item => item.text).join();
    let task = $("#txttask").val(), description = $("#txtdescription").val(); backgroundcolor = '';
    var status = $("#chkstatus").prop("checked") ? 1 : 0;

    if (startdate == "") { swal('Alert', 'Please enter start date', 'error').then(function () { swal.close(); $('#txtstartdate').focus(); }); }
    else if (enddate == "") { swal('Alert', 'Please enter end date', 'error').then(function () { swal.close(); $('#txtenddate').focus(); }); }
    else if (task == "") { swal('Alert', 'Please enter task', 'error').then(function () { swal.close(); $('#txttask').focus(); }); }
    else {
        var obj = { rowid: parseInt(parseInt($("#btnSave").data("id"))) || 0, event_label: 'Event', start_date: startdate, end_date: enddate, assigned_to: assignedto, assigned_user: assigneduser, status: status, task: task, description: description, backgroundcolor: $('#btnSave').data('bgcolor') }
        let _event = obj.rowid > 0 ? 'UpdateEvents' : 'AddEvents';
        $.ajax({
            url: '/Events/' + _event, dataType: 'json', type: 'Post', contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj), beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success').then((result) => {
                        $("#eventModal").modal('hide');
                        ActivityLog('Add/Edit new event \'' + data.id + ' - ' + obj.task + '\'', '/Events/EventCalendar');
                        location.href = '../../Events/EventsList';
                    });
                }
                else { swal('Alert!', data.message, 'error'); }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        });
    }
}

function reset() {
    $('#txtstartdate,#txtenddate').val('');
    $("#txttask,#txtdescription").val('');
    $("#ddluser").val('');
    $("#chkstatus").prop("checked", true);
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
