$(document).ready(function () {
    //getLeaveType();
    //getEmployee();
    EmployeeList();
    PendingEmployeeList();
    RejectedEmployeeList();
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



/*
function GrantLeaveList() {

    $.ajax({
        url: '/Hrms/GetLeaveList',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        success: function (data) {
            $('#GrantLeaveList').dataTable({
                destroy: true,
                scrollX: false,
                data: JSON.parse(data),
                "columns": [
                    { data: 'rowid', title: 'ID', sWidth: "10%" },
                    { data: 'name', title: 'Name', sWidth: "10%" },
                    { data: 'leavetype', title: 'Leave Type', sWidth: "20%" },
                    { data: 'date_from', title: 'From', sWidth: "15%" },
                    { data: 'date_to', title: 'To', sWidth: "15%" },
                    { data: 'days', title: 'Days', sWidth: "10%" },
                    { data: 'status', title: 'Days', sWidth: "10%" },
                    {
                        'data': 'rowid', sWidth: "15%   ", 'className': 'dt-body-center',
                        'render': function (data, type, full, meta) {

                            return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '"><label></label>';
                        }
                    },
                ],

                "order": [[0, 'desc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });

} */

function EmployeeList() {
    var urid = $("#ddlSearchStatus").val();
    ID = $("#hfid").val();
    var table_EL = $('#EmployeeListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { "orderable": false, "targets": [0,8] }, { 'visible': true, 'targets': [0] }], order: [[0, "desc"]],
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
            $('#EmployeeListdata_filter input').unbind();
            $('#EmployeeListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Hrms/GetGrantLeaveList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 1 ? "rowid" : oSettings.aaSorting[0][0] == 2 ? "name" : oSettings.aaSorting[0][0] == 3 ? "days" : oSettings.aaSorting[0][0] == 4 ? "leavetype" : oSettings.aaSorting[0][0] == 5 ? "date_from" : "rowid";
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
            {
                'data': 'rowid', sWidth: "10%",
                'render': function (data, type, full, meta) {

                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '"><label></label>';
                }
            },
            { data: 'rowid', title: 'Id', sWidth: "5%" },
            { data: 'name', title: 'Name', sWidth: "10%" },
            { data: 'leavetype', title: 'Leave Type', sWidth: "10%" },
            { data: 'date_from', title: 'From', sWidth: "15%" },
            { data: 'date_to', title: 'To', sWidth: "15%" },
            { data: 'days', title: 'Days', sWidth: "10%" },
            { data: 'status', title: 'Status', sWidth: "10%" },
            {
                'data': 'rowid',
                'sortable': true,
                'searchable': false,
                sWidth: "10%",
                'render': function (id, type, full, meta) {
                    return '<a href="../Hrms/EditGrantLeave/' + id + '"><i class="glyphicon glyphicon-pencil"></i></a>';
                }
            },

        ]
    });
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
    justification = $("#txtJustification").val();
    status = $("#ddlStatus").val();

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
    else if (desc_ription == "") {
        swal('Alert', 'Please enter description', 'error').then(function () { swal.close(); $('#txtdescription').focus(); });
    }
    else {

        var obj = {
            rowid: id,
            fk_emp: employee,
            leave_code: leavecode,
            description: desc_ription,
            leave_type: leavetype,
            from_date: getfromdate,
            to_date: gettodate,
            note_public: notepublic,
            note_private: noteprivate,
            days: getdays,
            justification: justification,
            is_approved: status,
        }
        $.ajax({
            url: '/Hrms/UpdateGrantLeave/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                $("#loader").hide();
                if (data.status == true) {
                    swal('Alert!', data.message, 'success').then((result) => { location.href = '../ListGrantLeave'; });;
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





$('#checkAll').click(function () {
    var isChecked = $(this).prop("checked");
    $('#EmployeeListdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
});

function Singlecheck() {
    var isChecked = $('#CheckSingle').prop("checked");
    var isHeaderChecked = $("#checkAll").prop("checked");
    if (isChecked == false && isHeaderChecked)
        $("#checkAll").prop('checked', isChecked);
    else {
        $('#EmployeeListdata tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkAll").prop('checked', isChecked);
    }
}

$('#btnChange').click(function () {
    var id = "";
    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        id += $(this).val() + ",";
    });
    id = id.replace(/,(?=\s*$)/, '');
    ChangeStatus(id);
    $("#checkAll").prop('checked', false);
})

function ChangeStatus(id) {
    var status = $("#ddlStatus").val();
    var obj = { strVal: id, is_approved: status }
    $.ajax({
        url: '/Hrms/ChangeLeaveStatus/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == true) {
                swal('Alert!', data.message, 'success');
                EmployeeList();
                RejectedEmployeeList();
                PendingEmployeeList();
            }
            else {
                swal('Alert!', data.message, 'error')
            }
        },
        error: function (error) {
            swal('Error!', 'something went wrong', 'error');
        },
    })
}


function PendingEmployeeList() {
    var urid = $("#ddlSearchStatus").val();
    ID = $("#hfid").val();
    var table_EL = $('#PendingEmployeeListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { "orderable": false, "targets": [0, 8] }, { 'visible': true, 'targets': [0] }], order: [[0, "desc"]],
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
            $('#PendingEmployeeListdata_filter input').unbind();
            $('#PendingEmployeeListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Hrms/GetPendingLeaveList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 1 ? "rowid" : oSettings.aaSorting[0][0] == 2 ? "name" : oSettings.aaSorting[0][0] == 3 ? "days" : oSettings.aaSorting[0][0] == 4 ? "leavetype" : oSettings.aaSorting[0][0] == 5 ? "date_from" : "rowid";
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
            {
                'data': 'rowid', sWidth: "10%",
                'render': function (data, type, full, meta) {

                    return '<input type="checkbox" name="CheckSingle2" id="CheckSingle2" onClick="Singlecheck2();" value="' + $('<div/>').text(data).html() + '"><label></label>';
                }
            },
            { data: 'rowid', title: 'Id', sWidth: "5%" },
            { data: 'name', title: 'Name', sWidth: "10%" },
            { data: 'leavetype', title: 'Leave Type', sWidth: "10%" },
            { data: 'date_from', title: 'From', sWidth: "15%" },
            { data: 'date_to', title: 'To', sWidth: "15%" },
            { data: 'days', title: 'Days', sWidth: "10%" },
            { data: 'status', title: 'Status', sWidth: "10%" },
            {
                'data': 'rowid',
                'sortable': true,
                'searchable': false,
                sWidth: "10%",
                'render': function (id, type, full, meta) {
                    return '<a href="../Hrms/EditGrantLeave/' + id + '"><i class="glyphicon glyphicon-pencil"></i></a>';
                }
            },

        ]
    });
}


function RejectedEmployeeList() {
    var urid = $("#ddlSearchStatus").val();
    ID = $("#hfid").val();
    var table_EL = $('#RejectEmployeeListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { "orderable": false, "targets": [0, 8] }, { 'visible': true, 'targets': [0] }], order: [[0, "desc"]],
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
            $('#RejectEmployeeListdata_filter input').unbind();
            $('#RejectEmployeeListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Hrms/GetRejectedLeaveList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 1 ? "rowid" : oSettings.aaSorting[0][0] == 2 ? "name" : oSettings.aaSorting[0][0] == 3 ? "days" : oSettings.aaSorting[0][0] == 4 ? "leavetype" : oSettings.aaSorting[0][0] == 5 ? "date_from" : "rowid";
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
            {
                'data': 'rowid', sWidth: "10%",
                'render': function (data, type, full, meta) {

                    return '<input type="checkbox" name="CheckSingle1" id="CheckSingle1" onClick="Singlecheck1();" value="' + $('<div/>').text(data).html() + '"><label></label>';
                }
            },
            { data: 'rowid', title: 'Id', sWidth: "5%" },
            { data: 'name', title: 'Name', sWidth: "10%" },
            { data: 'leavetype', title: 'Leave Type', sWidth: "10%" },
            { data: 'date_from', title: 'From', sWidth: "15%" },
            { data: 'date_to', title: 'To', sWidth: "15%" },
            { data: 'days', title: 'Days', sWidth: "10%" },
            { data: 'status', title: 'Status', sWidth: "10%" },
            {
                'data': 'rowid',
                'sortable': true,
                'searchable': false,
                sWidth: "10%",
                'render': function (id, type, full, meta) {
                    return '<a href="../Hrms/EditGrantLeave/' + id + '"><i class="glyphicon glyphicon-pencil"></i></a>';
                }
            },

        ]
    });
}

//For CheckBox Operation For Rejected List
$('#checkAll1').click(function () {
    var isChecked = $(this).prop("checked");
    $('#RejectEmployeeListdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
});

function Singlecheck1() {
    var isChecked = $('#CheckSingle1').prop("checked");
    var isHeaderChecked = $("#checkAll1").prop("checked");
    if (isChecked == false && isHeaderChecked)
        $("#checkAll1").prop('checked', isChecked);
    else {
        $('#RejectEmployeeListdata tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkAll1").prop('checked', isChecked);
    }
}

$('#btnChangeReject').click(function () {
    var id = "";
    $("input:checkbox[name=CheckSingle1]:checked").each(function () {
        id += $(this).val() + ",";
    });
    id = id.replace(/,(?=\s*$)/, '');
    ChangeStatus1(id);
    $("#checkAll1").prop('checked', false);
})

function ChangeStatus1(id) {
    var status = $("#ddlStatusReject").val();
    var obj = { strVal: id, is_approved: status }
    $.ajax({
        url: '/Hrms/ChangeLeaveStatus/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == true) {
                swal('Alert!', data.message, 'success');
                RejectedEmployeeList();
                PendingEmployeeList();
                EmployeeList();
            }
            else {
                swal('Alert!', data.message, 'error')
            }
        },
        error: function (error) {
            swal('Error!', 'something went wrong', 'error');
        },
    })
}



//Checkbox operation for pending leave

$('#checkAll2').click(function () {
    var isChecked = $(this).prop("checked");
    $('#PendingEmployeeListdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
});

function Singlecheck2() {
    var isChecked = $('#CheckSingle2').prop("checked");
    var isHeaderChecked = $("#checkAll2").prop("checked");
    if (isChecked == false && isHeaderChecked)
        $("#checkAll2").prop('checked', isChecked);
    else {
        $('#PendingEmployeeListdata tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkAll2").prop('checked', isChecked);
    }
}

$('#btnChangePending').click(function () {
    var id = "";
    $("input:checkbox[name=CheckSingle2]:checked").each(function () {
        id += $(this).val() + ",";
    });
    id = id.replace(/,(?=\s*$)/, '');
    ChangeStatus2(id);
    $("#checkAll2").prop('checked', false);
})

function ChangeStatus2(id) {
    var status = $("#ddlStatusPending").val();
    var obj = { strVal: id, is_approved: status }
    $.ajax({
        url: '/Hrms/ChangeLeaveStatus/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == true) {
                swal('Alert!', data.message, 'success');
                PendingEmployeeList();
                EmployeeList();
                RejectedEmployeeList();
            }
            else {
                swal('Alert!', data.message, 'error')
            }
        },
        error: function (error) {
            swal('Error!', 'something went wrong', 'error');
        },
    })
}
