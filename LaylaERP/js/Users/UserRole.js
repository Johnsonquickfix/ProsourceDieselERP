function GetRoles() {
    $.get('GetRoles', function (data) {
        var items = "";
        items += "<option value='' disabled selected>Please select</option>";
        $('#userrole').empty();
        $.each(data, function (index, value) {
            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#userrole");
        })
        $('#userrole').bind(items);
    })
    ischecked();
};
//bind grid
function RoleGrid() {
    debugger
    $.ajax({
        url: '/Users/GetMenuNames',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $('#dtdata').dataTable({
                data: JSON.parse(data),
                "columns": [
                    {
                        'data': 'menu_id', sWidth: "2%   ",
                        'render': function (data, type, full, meta) {
                            return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '"><label></label>';
                        }
                    },
                    { data: 'menu_id', title: 'Menu ID', sWidth: "8%" },
                    { data: 'menu_name', title: 'Menu Name', sWidth: "14%" },
                    { data: 'menu_url', title: 'Menu URL', sWidth: "14%" },
                    //{
                    //    'data': 'id', sWidth: "8%",
                    //    'render': function (id, type, full, meta) {
                    //        return '<a href="../Customer/NewUser/' + id + '"><i class="glyphicon glyphicon-pencil"></i></a>'
                    //    }
                    //}
                ]
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });

}

//checkbox start
$('#checkAll').click(function () {
    debugger
    var isChecked = $(this).prop("checked");
    $('#dtdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
});
function Singlecheck() {
    var isChecked = $('#CheckSingle').prop("checked");
    var isHeaderChecked = $("#checkAll").prop("checked");
    if (isChecked == false && isHeaderChecked)
        $("#checkAll").prop('checked', isChecked);
    else {
        $('#dtdata tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkAll").prop('checked', isChecked);
    }
}
//checkbox end

//Give Permission
$('#btnApprove').click(function () {
    debugger
    var id = "";
    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        id += $(this).val() + ",";
    });
    id = id.replace(/,(?=\s*$)/, '');
    ChangePermission(id);
})

function ChangePermission(id) {
    debugger
    var role_id = $("#userrole").val();
    var obj = { strVal: id, role_id: role_id }
    $.ajax({
        url: '/Users/ChangePermission/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == true) {
                swal('Alert!', data.message, 'success');
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

$("#userrole").change(function () {
    ischecked();
});

function ischecked() {
    debugger
    var User_Type = { User_Type: $("#userrole :selected").text() };
    $("#user_type").val($("#userrole :selected").text());
    $.ajax({
        url: '/Users/GetAssignRole',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(User_Type),
        success: function (data) {
            var obj = JSON.parse(data);
            console.log(data);
            $('#dtdata tr:has(td)').find('input[type="checkbox"]').prop('checked', false);
            for (i = 0; i < obj.length; i++) {
                $('#dtdata tr:has(td)').find('input[type="checkbox"][value="' + obj[i].erpmenu_id + '"]').prop('checked', true);
            }
        },
        error: function (responce) {
            console.log(responce)
        }
    });
}

