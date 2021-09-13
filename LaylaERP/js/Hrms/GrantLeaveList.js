EmployeeList();
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
        columnDefs: [{ "orderable": true, "targets": 1 }, { "orderable": false, "targets": [0] }, { 'visible': true, 'targets': [0] }], order: [[0, "desc"]],
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
            { data: 'rowid', title: 'ID', sWidth: "10%" },
            { data: 'name', title: 'Name', sWidth: "10%" },
            { data: 'leavetype', title: 'Leave Type', sWidth: "20%" },
            { data: 'date_from', title: 'From', sWidth: "15%" },
            { data: 'date_to', title: 'To', sWidth: "15%" },
            { data: 'days', title: 'Days', sWidth: "10%" },
            { data: 'status', title: 'Status', sWidth: "10%" },
            

        ]
    });
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