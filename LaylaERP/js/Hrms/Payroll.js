$(document).ready(function () {
    $("#loader").hide();
    $(".select2").select2();

    getDepartment();
    getYear();
    EmployeePayrollList();
})

function getDepartment() {
    $.ajax({
        url: "/Hrms/GetDepartment",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please Select Department</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlDepartment').html(opt);
        }

    });
}
function getYear() {
    var ddlYears = $("#ddlYear");
    var currentYear = (new Date()).getFullYear();
    var PreviousYear = currentYear - 20;
    for (var i = currentYear; i >= PreviousYear; i--) {
        var option = $("<option />");
        option.html(i);
        option.val(i);
        ddlYears.append(option);
    }
};

function EmployeePayrollList() {
    let department = $("#ddlDepartment").val();
    let month = $("#ddlMonth").val();
    let year = $("#ddlYear").val();
    ID = $("#hfid").val();
    var table_EL = $('#EmployeePayrolldata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }, { "orderable": false, "targets": [1] }, { 'visible': false, 'targets': [0] }], order: [[0, "desc"]],
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
            $('#EmployeePayrolldata_filter input').unbind();
            $('#EmployeePayrolldata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Hrms/GetEmployeePayrollList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: department });
            aoData.push({ name: "strValue2", value: month });
            aoData.push({ name: "strValue3", value: year });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "ID" : oSettings.aaSorting[0][0] == 1 ? "name" : oSettings.aaSorting[0][0] == 2 ? "email" : "id";
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
                'data': 'ID', sWidth: "30%   ",
                'render': function (data, type, full, meta) {
                        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck(this);" value="' + $('<div/>').text(data).html() + '"><label></label>';
                }
            },
            { data: 'name', title: 'Name', sWidth: "40%", class: 'text-left' },
            { data: 'designation', title: 'Designation', sWidth: "30%" },
        
        ]
    });
}