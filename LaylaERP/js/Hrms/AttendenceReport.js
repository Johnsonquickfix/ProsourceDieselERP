$(document).ready(function () {
    $("#loader").hide();
    $('#DateRange').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        startDate: moment().add(-1, 'month'), autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto"
    });
    var fromdate = $('#DateRange').data('daterangepicker').startDate.format('YYYY-MM-DD');
    var todate = $('#DateRange').data('daterangepicker').endDate.format('MM-DD-YYYY');
    EmployeeList(fromdate, todate);
    $("#DateRange").change(function () {
        console.log(fromdate, todate);
        EmployeeList(fromdate, todate);

    })
})






function EmployeeList(fromdate, todate) {
    //var fromdate = $('#DateRange').data('daterangepicker').startDate.format('MM-DD-YYYY');
    //var todate = $('#DateRange').data('daterangepicker').endDate.format('MM-DD-YYYY');
    var urid = $("#ddlSearchStatus").val();
    ID = $("#hfid").val();
    var table_EL = $('#AttendanceReport').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }, { "orderable": false, "targets": [1, 4, 5] }], order: [[0, "desc"]],
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
                    var dtOption = { aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [

            { data: 'name', title: 'Name', class: 'text-left' },

            { data: '2021-09-30', title: '2021-09-30',class: 'text-left' },
            { data: '2021-09-29', title: '2021-09-29' },
            { data: '2021-09-28', title: '2021-09-28' },
            { data: '2021-09-27', title: '2021-09-27'},
            { data: '2021-09-26', title: '2021-09-26'},
            { data: '2021-09-25', title: '2021-09-25' },
            { data: '2021-09-24', title: '2021-09-24' },
        ]
    });
}





