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
    todate = $("#DateRange").val();
    var urid = $("#ddlSearchStatus").val();
    ID = $("#hfid").val();
    var table_EL = $('#AttendanceReport').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }, { "orderable": false, "targets": [1, 4, 5] }, { 'visible': false, 'targets': [0] }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no record found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#AttendanceReport_filter input').unbind();
            $('#AttendanceReport_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Hrms/GetAttendanceReport",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: fromdate });
            aoData.push({ name: "strValue2", value: todate });
            //var col = 'id';
            //if (oSettings.aaSorting.length >= 0) {
            //    var col = oSettings.aaSorting[0][0] == 0 ? "ID" : oSettings.aaSorting[0][0] == 1 ? "name" : oSettings.aaSorting[0][0] == 2 ? "email" : oSettings.aaSorting[0][0] == 3 ? "phone" : "id";
            //    aoData.push({ name: "sSortColName", value: col });
            //}
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = {  aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
           
            { data: 'name', title: 'ID', class: 'text-left' },
           
            { data: '2021-09-01', title: 'Name', sWidth: "20%", class: 'text-left' },
            { data: '2021-09-02', title: 'Designation', sWidth: "10%" },
        
            { data: '2021-09-03', title: 'Working Hours', sWidth: "10%" },
        ]
    });
}





