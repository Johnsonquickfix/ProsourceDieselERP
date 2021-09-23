
function LeaveList() {
    var usertype = $("#hfusertype").val();
    if (usertype.toUpperCase() != "ADMINISTRATOR") {
        var obj = { fkuser: $("#hfuserid").val() }
    }
    $.ajax({
        url: '/Hrms/LeaveList',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        data: JSON.stringify(obj),
        success: function (data) {
            $('#EmployeeListdata').dataTable({
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
                    { data: 'status', title: 'Status', sWidth: "10%" },
                    {
                        'data': 'rowid',
                        'sortable': false,
                        'searchable': false,
                        sWidth: "10%",
                        'render': function (rowid, type, full, meta) {
                            return '<a href="#" onclick="EditSelect(' + rowid + ');"><i class="glyphicon glyphicon-pencil"></i></a>';
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

}


function EditSelect(rowid) {
    var obj = { searchid: rowid }
    $.ajax({
        url: '/Hrms/GetLeaveListSelect/',
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            
            $("#hfid").val(jobj[0].rowid);
            $("#ddlemployee").val(jobj[0].fk_emp).trigger('change');
            $('#ddlLeaveType').val(jobj[0].leave_code).trigger('change');
            $('#txtfrom').val(jobj[0].from_date);
            $("#txtto").val(jobj[0].to_date);
            $("#txtdays").val(jobj[0].days);
            $("#txtdescription").val(jobj[0].description);
            $("#txtpublic").val(jobj[0].note_public);
            $("#txtprivate").val(jobj[0].note_private);

            $("#btnAdd").hide();
            $("#btnUpdate").show();
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}