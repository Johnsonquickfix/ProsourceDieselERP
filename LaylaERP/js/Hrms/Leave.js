$(document).ready(function () {
    getLeaveType();
    getEmployee();
    changedays();
})

function getLeaveType() {
    $.ajax({
        url: "/Hrms/GetLeaveType",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please Select Leave Type</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlLeaveType').html(opt);
        }

    });
}

function getEmployee() {
    $.ajax({
        url: "/Hrms/GetEmployee",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please Select Employee</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlemployee').html(opt);
        }

    });
}


function addLeave() {
    fromdate = $("#txtfrom").val();
    var formattedDate = new Date(fromdate);
    var d = formattedDate.getDate();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    var y = formattedDate.getFullYear();
    var getfromdate = y + "-" + m + "-" + d;
    //var getfromdate = y + "-" + m + "-" + d;

    todate = $("#txtto").val();
    var formattedDate1 = new Date(todate);
    var d1 = formattedDate1.getDate();
    var m1 = ("0" + (formattedDate1.getMonth() + 1)).slice(-2)
    var y1 = formattedDate1.getFullYear();
    var gettodate = y1 + "-" + m1 + "-" + d1;

    employee = $("#ddlemployee").val();
    leavecode = $("#ddlLeaveType").val();
    var leave = $("#ddlLeaveType option:selected");
    var leavetype = leave.text();
    desc_ription = $("#txtdescription").val();
    notepublic = $("#txtpublic").val();
    noteprivate = $("#txtprivate").val();
    getdays = $("#txtdays").val();

    if (employee == 0) {
        swal('Alert', 'Please select employee', 'error').then(function () { swal.close(); $('#ddlemployee').focus(); });
    }
    else if (leavecode == 0) {
        swal('Alert', 'Please select leave type', 'error').then(function () { swal.close(); $('#ddlLeaveType').focus(); });
    } 
    else if (fromdate == "") {
        swal('Alert', 'Please enter from date', 'error').then(function () { swal.close(); $('#txtfrom').focus(); });
    }
    else if (todate == "") {
        swal('Alert', 'Please enter to date', 'error').then(function () { swal.close(); $('#txtto').focus(); });
    }
    else if (desc_ription == "") {
        swal('Alert', 'Please enter description', 'error').then(function () { swal.close(); $('#txtdescription').focus(); });
    }
    else {
        
        var obj = {
            fk_emp: employee,
            leave_code: leavecode,
            description: desc_ription,
            leave_type: leavetype,
            from_date: getfromdate,
            to_date: gettodate,
            note_public: notepublic,
            note_private: noteprivate,
            days: getdays,
        }
        $.ajax({
            url: '/Hrms/AddLeave/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success');
                    reset();
                    LeaveList();
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

function changedays() {
    $("#ddlLeaveType").change(function () {
        if ($("#ddlLeaveType").val() == "HF") {
            datecode();
            var halfday = 0.50;
            document.getElementById("txtdays").value = parseFloat(halfday, 10).toFixed(2);
            $("#txtto").prop("disabled", true);
            $('#txtfrom').change(function () {
                var rt = $("#txtfrom").val();
                document.getElementById("txtto").value = rt;
            })

        }
        else {
            $("#txtto").val("");
            $("#txtfrom").val("");
            $("#txtto").prop("disabled", false);
            $("#txtdays").val("");
            datefrom();
            $('#txtto').change(function () {

                fromdate = $("#txtfrom").val();
                var formdate1 = new Date(fromdate);

                todate = $("#txtto").val();
                var todate1 = new Date(todate);

                var timediff = todate1.getTime() - formdate1.getTime();
                var indays = timediff / (1000 * 3600 * 24);
                document.getElementById("txtdays").value = parseFloat(indays+1, 10).toFixed(2);

            });
        }

    })
}
   

$('#txtto').change(function () {

    fromdate = $("#txtfrom").val();
    var formdate1 = new Date(fromdate);
    
    todate = $("#txtto").val();
    var todate1 = new Date(todate);

    var timediff = todate1.getTime() - formdate1.getTime();
    var indays = timediff / (1000 * 3600 * 24);
    document.getElementById("txtdays").value = indays;
    
});


function reset() {
    $("#txtto").prop("disabled", false);
    $("#txtdescription").val('');
    $("#ddlemployee").val("0").trigger('change');
    $("#txtpublic").val('');
    $("#txtprivate").val('');
    $("#ddlLeaveType").val("0").trigger('change');
    $("#txtdays").val('');
    $("#txtto").val('');
    $("#txtfrom").val('');
   
}

function datecode() {
    var dt2 = new Date();
    var dt3 = ("0" + (dt2.getMonth() + 1)).slice(-2) + '-' + ("0" + (dt2.getDate())).slice(-2) + '-' + dt2.getFullYear();

    document.getElementById("txtto").value = dt3;
    document.getElementById("txtfrom").value = dt3;
}

function datefrom() {
    var dt2 = new Date();
    var dt3 = ("0" + (dt2.getMonth() + 1)).slice(-2) + '-' + ("0" + (dt2.getDate())).slice(-2) + '-' + dt2.getFullYear();

    document.getElementById("txtfrom").value = dt3;
}



function updateLeave() {
    fromdate = $("#txtfrom").val();
    var formattedDate = new Date(fromdate);
    var d = formattedDate.getDate();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    var y = formattedDate.getFullYear();
    var getfromdate = y + "-" + m + "-" + d;
    //var getfromdate = y + "-" + m + "-" + d;

    todate = $("#txtto").val();
    var formattedDate1 = new Date(todate);
    var d1 = formattedDate1.getDate();
    var m1 = ("0" + (formattedDate1.getMonth() + 1)).slice(-2)
    var y1 = formattedDate1.getFullYear();
    var gettodate = y1 + "-" + m1 + "-" + d1;

    id = $("#hfid").val();
    employee = $("#ddlemployee").val();
    leavecode = $("#ddlLeaveType").val();
    var leave = $("#ddlLeaveType option:selected");
    var leavetype = leave.text();
    desc_ription = $("#txtdescription").val();
    notepublic = $("#txtpublic").val();
    noteprivate = $("#txtprivate").val();
    getdays = $("#txtdays").val();

    if (employee == 0) {
        swal('Alert', 'Please select employee', 'error').then(function () { swal.close(); $('#ddlemployee').focus(); });
    }
    else if (leavecode == 0) {
        swal('Alert', 'Please select leave type', 'error').then(function () { swal.close(); $('#ddlLeaveType').focus(); });
    }
    else if (fromdate == "") {
        swal('Alert', 'Please enter from date', 'error').then(function () { swal.close(); $('#txtfrom').focus(); });
    }
    else if (todate == "") {
        swal('Alert', 'Please enter to date', 'error').then(function () { swal.close(); $('#txtto').focus(); });
    }
    else if (desc_ription == "") {
        swal('Alert', 'Please enter description', 'error').then(function () { swal.close(); $('#txtdescription').focus(); });
    }
    else {

        var obj = {
            rowid:id,
            fk_emp: employee,
            leave_code: leavecode,
            description: desc_ription,
            leave_type: leavetype,
            from_date: getfromdate,
            to_date: gettodate,
            note_public: notepublic,
            note_private: noteprivate,
            days: getdays,
        }
        $.ajax({
            url: '/Hrms/UpdateLeave/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success');
                    reset();
                    $("#btnUpdate").hide();
                    $("#btnAdd").show();
                    LeaveList();

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