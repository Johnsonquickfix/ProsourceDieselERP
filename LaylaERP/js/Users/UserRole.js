function GetRoles() {
    $.get('GetRoles', function (data) {
        var items = "";
        items += "<option value='' disabled selected>Please select</option>";
        $('#userrole').empty();
        $.each(data, function (index, value) {
            items +=  $('<option>').val(value).text(value).appendTo("#userrole");
        })
        $('#userrole').bind(items);
    })
    //main_submenu_tick();
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

 function main_submenu_tick() {

        $("#create_user").on('change', function () {
            if ($(this).is(":checked")) {
                $("#User_Mnu").prop('checked', true);
                $("#User_Classification").prop('checked', true);
            }
            else {
                $("#User_Mnu").prop('checked', false);
                $("#User_Classification").prop('checked', false);
            }

        });

        $("#orders_mnu").on('change', function () {
            if ($(this).is(":checked")) {
                $("#add_new_orders").prop('checked', true);
                $("#show_update_orders").prop('checked', true);
            }
            else {
                $("#add_new_orders").prop('checked', false);
                $("#show_update_orders").prop('checked', false);
            }
        });

        $("#User_Classification").on('change', function () {
            if ($(this).is(":checked")) {
                $("#create_user").prop('checked', true);
            }
            else if ($('#User_Mnu').is(":checked")) {
                $("#create_user").prop('checked', true);
            }
            else {
                $("#create_user").prop('checked', false);
            }
        });

        $("#User_Mnu").on('change', function () {
            if ($(this).is(":checked")) {
                $("#create_user").prop('checked', true);
            }
            else if ($('#User_Classification').is(":checked")) {
                $("#create_user").prop('checked', true);
            }
            else {
                $("#create_user").prop('checked', false);
            }
        });

        $("#add_new_orders").on('change', function () {
            if ($(this).is(":checked")) {
                $("#orders_mnu").prop('checked', true);
            }
            else if ($('#show_update_orders').is(":checked")) {
                $("#orders_mnu").prop('checked', true);
            }
            else {
                $("#orders_mnu").prop('checked', false);
            }
        });

        $("#show_update_orders").on('change', function () {
            if ($(this).is(":checked")) {
                $("#orders_mnu").prop('checked', true);
            }
            else if ($('#add_new_orders').is(":checked")) {
                $("#orders_mnu").prop('checked', true);
            }
            else {
                $("#orders_mnu").prop('checked', false);
            }
        });
    }

