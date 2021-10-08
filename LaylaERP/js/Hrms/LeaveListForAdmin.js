LeaveListAdmin();
function LeaveListAdmin() {
    $.ajax({
        url: '/Hrms/GetLeaveDetailsForAdmin',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        data: JSON.stringify(),
        success: function (data) {
            $('#LeaveCalculationList').dataTable({
                destroy: true,
                scrollX: false, 
                data: JSON.parse(data),
                "columns": [
                    { data: 'name', title: 'Name', sWidth: "10%" },
                    { data: 'designation', title: 'Designation', sWidth: "10%" },
                    { data: 'CL', title: 'Casual leave', sWidth: "10%" },
                    { data: 'ML', title: 'Medical leave', sWidth: "10%" },
                    { data: 'SL', title: 'Sick leave', sWidth: "10%" },
                    { data: 'LWP', title: 'Leave without pay', sWidth: "10%" },
                    { data: 'HF', title: 'Half day', sWidth: "10%" },
                ],

                "order": [[0, 'desc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });

}