$(document).ready(function () {
    $("#loader").hide();
    $(".select2").select2();
    getDepartment();

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
