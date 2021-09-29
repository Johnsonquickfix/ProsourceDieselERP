$(document).ready(function () {
    $("#loader").hide();
    $("#DateRange").datepicker({ format: 'mm-dd-yyyy', }).datepicker("setDate", 'now');

    var now = new Date(Date.now());
    var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    $("#txtTime").val(formatted);
    

    EmployeeList();
    $("#ddlInOut").change(function () { EmployeeList(); $('#checkAll').val(''); })
    $("#btnReset").click(function () { EmployeeList(); })
})
$("#DateRange").change(function () {
    EmployeeList();
    $('#checkAll').val('');
})


function EmployeeList() {
    fromdate = $("#DateRange").val();
    var urid = $("#ddlSearchStatus").val();
    ID = $("#hfid").val();
    var table_EL = $('#EmployeeListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }, { "orderable": false, "targets": [1, 4, 5,6] }, { 'visible': false, 'targets': [0] }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "May on leave",
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
            { data: 'ID', title: 'ID', class: 'text-left' },
            {
                'data': 'ID', sWidth: "15%   ",
                'render': function (data, type, full, meta) {
                  
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '"><label></label>';
                }
            },
            { data: 'name', title: 'Name', sWidth: "20%", class: 'text-left' },
            { data: 'designation', title: 'Designation', sWidth: "10%" },
            {
                'data': 'in_time', sWidth: "20%",
                'render': function (id, type, full, meta) {
                    var dateTime = "";
                    if (id == null) {
                        //var today = new Date();
                        //var date = ((today.getMonth()) + 1) + '-' + today.getDate() + '-' + today.getFullYear();
                        //var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                        //dateTime = date + ' ' + time;
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
                        dateTime = id.replace('T',' ');
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
    var dateTime = "";
    //var today = new Date();
    var date = $("#DateRange").val();
    var inout = $("#ddlInOut").val();
    var time = $("#txtTime").val();
    //var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    dateTime = isChecked == true ? date + ' ' + time : "";

    $('#EmployeeListdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
  
    $('#EmployeeListdata tr:has(td)').find('.' + inout + '_null').val(dateTime);
  
    $("#btnSave").prop("disabled", isChecked == true ? false : true);

});

function Singlecheck() {
    var dateTime = ""; /*var today = new Date();*/ var date = $("#DateRange").val();
    var time = $("#txtTime").val();
    //var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    dateTime = date + ' ' + time;
    var inout = $("#ddlInOut").val();

    var isChecked = $('#CheckSingle').prop("checked");
    var isHeaderChecked = $("#checkAll").prop("checked");
    var EnableButton = true;

    $('#EmployeeListdata tr:has(td)').find('input[type="checkbox"]').each(function () {
        if ($(this).prop("checked") == true) {
            EnableButton = false;
            console.log($("#" + inout + "_" + $(this).val()).val());
            if ($("#" + inout + "_" + $(this).val()).val() == "") {
                $("#" + inout + "_" + $(this).val()).val(dateTime);
            }
            //$("#txtouttime_" + $(this).val()).val(dateTime);
        }
        else {
            $("#" + inout + "_" + $(this).val()).val('');
           /* $("#txtintime_" + $(this).val()).val(''); $("#txtouttime_" + $(this).val()).val('');*/
        }
    });
    $("#btnSave").prop("disabled", EnableButton);
    if (isChecked == false && isHeaderChecked)
        $("#checkAll").prop('checked', isChecked);
    else {
        $('#EmployeeListdata tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false) {
                isChecked = false;
                //$("#txtintime_" + $(this).val()).val('');
                //$("#txtouttime_" + $(this).val()).val('');
            }
        });
        $("#checkAll").prop('checked', isChecked);
    }
}

$('#btnSave').click(function () {
    var Empid = "";
    var intime = "";
    var outtime = "";

    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        Empid += $(this).val() + ",";
        intime += $("#txtintime_" + $(this).val()).val() + ",";
        outtime += $("#txtouttime_" + $(this).val()).val() + ",";
    });
    Empid = Empid.replace(/,(?=\s*$)/, '');
    intime = intime.replace(/,(?=\s*$)/, '');
    outtime = outtime.replace(/,(?=\s*$)/, '');
   
    saveAttendence(Empid, intime, outtime);

});

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