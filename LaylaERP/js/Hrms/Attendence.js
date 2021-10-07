$(document).ready(function () {
    $("#loader").hide();
    $("#DateRange").datepicker({ format: 'mm-dd-yyyy', }).datepicker("setDate", 'now');

    var now = new Date(Date.now());
    var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    $("#txtTime").val(formatted);

    EmployeeList();
    $("#ddlInOut").change(function () {
        var now = new Date(Date.now()); var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        $("#txtTime").val(formatted); EmployeeList(); $('#checkAll').val('');
    })
    $("#btnReset").click(function () {
        var now = new Date(Date.now());
        var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        $("#txtTime").val(formatted); EmployeeList();
    })
})

$("#DateRange").change(function () {
    var now = new Date(Date.now()); var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    var todayDate = new Date(); var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '-' + dd + '-' + yyyy;
    var date = new Date($("#DateRange").val());
    if (date > todayDate) {
        swal('Alert!', 'Date can not be greater than today', 'error').then(function () {
            $("#DateRange").val(today);
            $("#txtTime").val(formatted);
            EmployeeList();
        });
    } else {
        $("#txtTime").val(formatted);
       EmployeeList();
    }
})

$("#btnGo").click(function () {
    var dateTime = ""; var date = $("#DateRange").val(); var inout = $("#ddlInOut").val();
    var time = $("#txtTime").val(); dateTime = date + ' ' + time;
    $('#EmployeeListdata tr:has(td)').find('.' + inout + '_null').val(dateTime);
    $("#checkAll").prop('checked', true);
    $('#EmployeeListdata tr:has(td)').find('input[type="checkbox"]').prop('checked', true);
    $("#btnSave").prop("disabled", false);
})

function EmployeeList() {
    fromdate = $("#DateRange").val();
    var urid = $("#ddlSearchStatus").val();
    ID = $("#hfid").val();
    var table_EL = $('#EmployeeListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }, { "orderable": false, "targets": [1, 4, 5, 6] }, { 'visible': false, 'targets': [0] }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "You are on leave!!",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#EmployeeListdata_filter input').unbind();
            $('#EmployeeListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Hrms/GetEmployeeAttendenceList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            aoData.push({ name: "strValue2", value: fromdate });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "ID" : oSettings.aaSorting[0][0] == 1 ? "name" : oSettings.aaSorting[0][0] == 2 ? "email" : oSettings.aaSorting[0][0] == 3 ? "phone" : "id";
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
            { data: 'ID', title: 'ID', class: 'text-left hidden' },
            {
                'data': 'ID', sWidth: "15%   ",
                'render': function (data, type, full, meta) {
                    if (full.in_time == null) {
                        $('#checkAll').prop('checked', false);
                        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" data-type="blank" onClick="Singlecheck(this);" value="' + $('<div/>').text(data).html() + '"><label></label>';
                    }
                    else if (full.in_time != null && full.Is_Employee == 1) {
                        $('#checkAll').prop('checked', true);
                        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" data-type="fill" onClick="Singlecheck(this);" value="' + $('<div/>').text(data).html() + '" checked><label></label>';
                    }
                    else {
                        $('#checkAll').prop('checked', true);
                        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" data-type="fill" onClick="Singlecheck(this);" value="' + $('<div/>').text(data).html() + '" checked><label></label>';
                    }
                }
            },
            { data: 'name', title: 'Name', sWidth: "20%", class: 'text-left' },
            { data: 'designation', title: 'Designation', sWidth: "10%" },
            {
                'data': 'in_time', sWidth: "20%",
                'render': function (id, type, full, meta) {
                    var dateTime = "";
                    if (id == null) {

                        dateTime = "";
                        return '<span><input type="text" class="form-control txtintime_null" name="txtintime" id="txtintime_' + full.ID + '" value="' + dateTime + '" /></span>';
                    }
                    else if (id != null && full.Is_Employee == 1) {
                        $('#ddlInOut').val('txtouttime').prop("disabled", true);
                        dateTime = id.replace('T', ' ');
                        return '<span><input type="text" class="form-control" name="txtintime" id="txtintime_' + full.ID + '" value="' + dateTime + '" disabled /></span>';
                    }
                    else {
                        dateTime = id.replace('T', ' ');

                        return '<span><input type="text" class="form-control" name="txtintime" id="txtintime_' + full.ID + '" value="' + dateTime + '" /></span>';

                    }
                }
            },
            {
                'data': 'out_time', sWidth: "20%",
                'render': function (id, type, full, meta) {
                    var dateTime = "";
                    if (id == null) {
                        dateTime = "";
                        return '<span><input type="text" class="form-control txtouttime_null" name="txtouttime" id="txtouttime_' + full.ID + '" value="' + dateTime + '" /></span>';
                    } else if (id != null && full.Is_Employee == 1) {
                        $('#ddlInOut').val('txtouttime').prop("disabled", true);
                        dateTime = id.replace('T', ' ');
                        return '<span><input type="text" class="form-control" name="txtouttime" id="txtouttime_' + full.ID + '" value="' + dateTime + '" disabled/></span>';
                    }
                    else {
                        dateTime = id.replace('T', ' ');
                        return '<span><input type="text" class="form-control" name="txtouttime" id="txtouttime_' + full.ID + '" value="' + dateTime + '" /></span>';
                    }

                }
            },
            { data: 'WorkingHours', title: 'Working Hours', sWidth: "10%" },
        ]
    });
}

$('#checkAll').click(function () {

    var isChecked = $(this).prop("checked");
    //var dateTime = "";
    ////var today = new Date();
    //var date = $("#DateRange").val();
    //var inout = $("#ddlInOut").val();
    //var time = $("#txtTime").val();
    //dateTime = isChecked == true ? date + ' ' + time : "";

    $('#EmployeeListdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);

   /* $('#EmployeeListdata tr:has(td)').find('.' + inout + '_null').val(dateTime);*/

    $("#btnSave").prop("disabled", isChecked == true ? false : true);

});

function Singlecheck(obj) {
    var dateTime = ""; var date = $("#DateRange").val(); var inout = $("#ddlInOut").val();
    var time = $("#txtTime").val(); dateTime = date + ' ' + time;

    if ($(obj).prop("checked") == true && $(obj).data('type') == 'blank') {
        $("#" + inout + "_" + $(obj).val()).val(dateTime);
    }
    else if ($(obj).prop("checked") == true && $(obj).data('type') == 'fill') {
        $("#txtintime_" + $(obj).val()).val(dateTime);
        $("#txtouttime_" + $(obj).val()).val(dateTime);
    }
    else if ($(obj).prop("checked") == false && $(obj).data('type') == 'fill') {
        $("#txtintime_" + $(obj).val()).val('');
        $("#txtouttime_" + $(obj).val()).val('');
    }
    else {
        $("#" + inout + "_" + $(obj).val()).val('');
        //$("#txtintime_" + $(obj).val()).val('');
        //$("#txtouttime_" + $(obj).val()).val('');
    }

    var isChecked = $('#CheckSingle').prop("checked");
    var isHeaderChecked = $("#checkAll").prop("checked");
    var EnableButton = true;
    $('#EmployeeListdata tr:has(td)').find('input[type="checkbox"]').each(function () {
        if ($(this).prop("checked") == true) {
            EnableButton = false;
        }
    });
    $("#btnSave").prop("disabled", EnableButton);
    if (isChecked == false && isHeaderChecked)
        $("#checkAll").prop('checked', isChecked);
    else {
        $('#EmployeeListdata tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false) {
                isChecked = false;
            }
        });
        $("#checkAll").prop('checked', isChecked);
    }
}

$('#btnSave').click(function () {
    
    var Empid = "";
    var intime = "";
    var outtime = "";
    let status = false;
    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        Empid += $(this).val() + ",";
        intime += $("#txtintime_" + $(this).val()).val() + ","; outtime += $("#txtouttime_" + $(this).val()).val() + ",";
      
        if ($("#ddlInOut").val() == "txtintime" && $("#txtintime_" + $(this).val()).val() == "") {
            status = false;
            swal('Alert!', 'Checked time value can not be null', 'error');
            breakOut = true;

            return false;
        }
        else if ($("#ddlInOut").val() == "txtouttime" && $("#txtintime_" + $(this).val()).val() == "") {
            status = false;
            swal('Alert!', 'Checked time value can not be null', 'error');
            breakOut = true;
            return false;
        }
        else if ($("#ddlInOut").val() == "txtouttime" && $("#txtouttime_" + $(this).val()).val() == "") {
            status = false;
            swal('Alert!', 'Checked value can not be null', 'error');
            breakOut = true;
            return false;
        }
        else if (Date.parse($("#txtintime_" + $(this).val()).val()) > Date.parse($("#txtouttime_" + $(this).val()).val())) {
            status = false;
            swal('Alert!', 'out time can not be less than in time', 'error');
            breakOut = true;
            return false;
        }
        else {
            status = true;
        }
    });
    Empid = Empid.replace(/,(?=\s*$)/, ''); intime = intime.replace(/,(?=\s*$)/, ''); outtime = outtime.replace(/,(?=\s*$)/, '');
    console.log(status)
    if (status != false) {
        saveAttendence(Empid, intime, outtime);
    }
});

//$('#btnSave').click(function () {
//    var date = new Date($('#DateRange').val());
//    var month = date.getMonth() + 1;
//    var year = date.getFullYear();
//    let _list = [];
    
//    $("input:checkbox[name=CheckSingle]:checked").each(function () {
//        _list.push({ strValue4: month, strValue5: year, strValue1: parseInt($(this).val()) || 0, strValue2: $("#txtintime_" + $(this).val()).val(), strValue3: $("#txtouttime_" + $(this).val()).val() });

//    });
//    //console.log(_list);
//    saveAttendence(_list);

//});

function saveAttendence(Empid, intime, outtime) {
    var date = new Date($('#DateRange').val());
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    var ID = $("#hfid").val();
    var obj = {
        rowid: ID, strValue1: Empid, strValue2: intime, strValue3: outtime,
        strValue4: month, strValue5: year,
    }
    $.ajax({
        url: '/Hrms/AddAttendence/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            if (data.status == true) {
                $("#checkAll").prop('checked', false);
                $("#ddlAccounttoAssign").select2("val", "0");
                $("#btnSaveProductAccount").prop("disabled", true);
                EmployeeList();
                swal('Alert!', data.message, 'success');
            }
            else {
                swal('Alert!', data.message, 'error')
            }
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) {
            swal('Error!', 'something went wrong', 'error');
        },
    })
}