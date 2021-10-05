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
        startDate: moment().startOf('month'), autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto"
    });
    $("#DateRange").change(function () {
        $("#AttendanceReport").empty();
        employee();
    })
    employee();
})

//function EmployeeList(fromdate, todate) {
//    ID = $("#hfid").val();
//    var table_EL = $('#AttendanceReport').DataTable({
//        columnDefs: [{ "orderable": true, "targets": 0 }], order: [[0, "desc"]],
//        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
//        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
//        language: {
//            lengthMenu: "_MENU_ per page",
//            zeroRecords: "Sorry no record found",
//            info: "Showing _START_ to _END_ of _TOTAL_ entries",
//            infoFiltered: "",
//            infoEmpty: "No records found",
//            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
//        },
//        initComplete: function () {
//            $('#AttendanceReport_filter input').unbind();
//            $('#AttendanceReport_filter input').bind('keyup', function (e) {
//                var code = e.keyCode || e.which;
//                if (code == 13) { table_EL.search(this.value).draw(); }
//            });
//        },
//        sAjaxSource: "/Hrms/GetAttendanceReport",
//        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
//            aoData.push({ name: "strValue1", value: fromdate });
//            aoData.push({ name: "strValue2", value: todate });
//            //var col = 'id';
//            //if (oSettings.aaSorting.length >= 0) {
//            //    var col = oSettings.aaSorting[0][0] == 0 ? "ID" : oSettings.aaSorting[0][0] == 1 ? "name" : oSettings.aaSorting[0][0] == 2 ? "email" : oSettings.aaSorting[0][0] == 3 ? "phone" : "id";
//            //    aoData.push({ name: "sSortColName", value: col });
//            //}
//            oSettings.jqXHR = $.ajax({
//                dataType: 'json', type: "GET", url: sSource, data: aoData,
//                "success": function (data) {
//                    var dtOption = { aaData: JSON.parse(data.aaData) };
//                    return fnCallback(dtOption);
//                }
//            });
//        },
//        aoColumns: [
           
//            { data: 'name', title: 'Name', class: 'text-left' },
//            {
//              /*  'data': 'name',*/
//                'render': function (data, type, full, meta) {
//                    console.log(data);
//                    return full;
//                }
//            },

//            //{ data: '2021-09-30', title: '2021-09-30',class: 'text-left' },
//            //{ data: '2021-09-29', title: '2021-09-29' },
//            //{ data: '2021-09-28', title: '2021-09-28' },
//            //{ data: '2021-09-27', title: '2021-09-27'},
//            //{ data: '2021-09-26', title: '2021-09-26'},
//            //{ data: '2021-09-25', title: '2021-09-25' },
//            //{ data: '2021-09-24', title: '2021-09-24' },
//        ]
//    });
//}



function makeColumnHeaderHtml(columnHeaderNames) {
    var table_head = '';
     table_head = '<thead>< tr >';
    $.each(columnHeaderNames, function (data, value) {
        table_head += '<th>';
        table_head += value;
        table_head += '</th>';

    });
    table_head += '</thead ></tr>';
    return table_head;
    
}
function makeColumnBodyHtml(columnBodyNames) {
    var table_body = '<tbody>< tr >';
    $.each(columnBodyNames, function (data, value) {
        table_body += '<td>';
        table_body += value;
        table_body += '</td>';

    });
    table_body += '</tr></tbody>';
    return table_body;
}
function getDataTableDef(columnDef) {
    var dataTableFormat = {
        columns: columnDef,
        paging: false,
        destroy: true,
        info: false,
        searching: false,
        responsive: true,
        ordering: false,
        "sScrollX": "100%"
    }
    return dataTableFormat;
}
function getTableData() {
    var fromdate = $('#DateRange').data('daterangepicker').startDate.format('YYYY-MM-DD');
    var todate = $('#DateRange').data('daterangepicker').endDate.format('MM-DD-YYYY');
    var obj = { strValue1: fromdate, strValue2: todate}
    return $.ajax({
        url: "/Hrms/GetAttendanceReport",
        dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
       
        data: JSON.stringify(obj),
        success: function (data) {
        }
    })
}

function employee() {
    getTableData().done(function (records) {
        
         records = JSON.parse(records.aaData);
        
      
        var headerName = Object.keys(records[0]);
        var headerHtml = makeColumnHeaderHtml(headerName);

         var bodyHtml = "";
         for (var i = 0; i < records.length; i++) {
             var bodyName = records[i];
             bodyHtml += makeColumnBodyHtml(bodyName);
         }

      

        $('#AttendanceReport').append(headerHtml, bodyHtml);


        //$('#AttendanceReport').append(bodyHtml);

     /*   $('#AttendanceReport').append(headerHtml);*/

        //for(var i = 0; i < headerName.length; i++) {
        //    columns.push({ "data": headerName[i] });
        //}

        //var datatableInstance = $('#AttendanceReport').DataTable(getDataTableDef(columns));
        //datatableInstance.rows.add(records).draw();
    });
};