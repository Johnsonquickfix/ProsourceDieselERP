$(document).ready(function () {
    EmployeeList();
})

$('#btnSearch').click(function () {
    EmployeeList();
})

function EmployeeList() {
    var urid = $("#ddlSearchStatus").val();
    ID = $("#hfid").val();
    var table_EL = $('#EmployeeListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }], order: [[1, "desc"]],
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
        sAjaxSource: "/Hrms/GetEmployeeList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "name" : oSettings.aaSorting[0][0] == 1 ? "email" : oSettings.aaSorting[0][0] == 1 ? "phone" : "id";
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
            { data: 'name', title: 'Name', sWidth: "20%", class: 'text-left' },
            { data: 'email', title: 'Email', sWidth: "20%" },
            {

                data: 'phone', title: 'Phone', sWidth: "20%",
                render: function (toFormat) {
                    var tPhone = '';
                    if (toFormat != null) {
                        tPhone = toFormat.toString();
                        tPhone = '(' + tPhone.substring(0, 3) + ') ' + tPhone.substring(3, 6) + ' ' + tPhone.substring(6, 10);
                    }
                    return tPhone
                }
            },
          
            {
                'data': 'is_active', 'sClass': 'ws_nowrap text-center', sWidth: "10%",
                'render': function (id, type, full, meta) {
                    if (id == 1) {
                        toggleclass = "fas fa-toggle-on";
                        toggleStyle = "color: #25a580!important;font-size: 24px;";
                        toggleStatus = 0;
                    }
                    else {
                        toggleclass = "fas fa-toggle-off";
                        toggleStyle = "color: #25a580!important;font-size: 24px;";
                        toggleStatus = 1;
                    }
                    return ' <a href="#" onclick="ChangeStatus(' + full.ID + ',' + toggleStatus + ');"><i class="' + toggleclass + '" style="' + toggleStyle + '"></i></a>';
                }
            },
            {
                'data': 'ID', sWidth: "10%",
                'render': function (id, type, full, meta) {
                    return '<a href="../Hrms/Employee/' + id + '"><i class="glyphicon glyphicon-pencil"></i></a>';
                }
            }
        ]
    });
}

function ChangeStatus(id, status) {
    var obj = { rowid: id, is_active: status, }
    $.ajax({
        url: '/Hrms/UpdateEmployeeStatus/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            if (data.status == true) {
                EmployeeList();
                swal('Alert!', data.message, 'success');
            }
            else { swal('Alert!', data.message, 'error') }
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}

