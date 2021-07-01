$("#loader").hide();
function GetRoles() {
    $.get('GetRoles', function (data) {
        var items = "";
        //$('#userrole').empty();
        items += "<option value=''>Please select</option>";
        $.each(data, function (index, value) {
            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#userrole");
        })
        $('#userrole').bind(items);
    })
};

function CopyRoles() {
    $.get('GetRoles', function (data) {
        var items = "";
        items += "<option value=''>Please select</option>";
        $.each(data, function (index, value) {
            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlCopyRole");
        })
        $('#ddlCopyRole').bind(items);
    })
};

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
    var nodes = $('#tt').tree('getChecked');
    var addnodes = ''; var id = ''; var addid = ''; var editid = ''; var deleteid = '';

    for (var i = 0; i < nodes.length; i++) {
        addnodes = $('#chk_add_' + nodes[i].id).prop('checked');
        editnodes = $('#chk_edit_' + nodes[i].id).prop('checked');
        deletenodes = $('#chk_del_' + nodes[i].id).prop('checked');

        if (id != '') id += ',';
        id += nodes[i].id;

        if (addnodes == true) { if (addid != '') addid += ','; addid += nodes[i].id; }
        if (editnodes == true) { if (editid != '') editid += ','; editid += nodes[i].id; }
        if (deletenodes == true) { if (deleteid != '') deleteid += ','; deleteid += nodes[i].id; }
    }
    ChangePermission(id, addid, editid, deleteid);


})

function ChangePermission(id, addid, editid, deleteid) {
    var role_id = $("#userrole").val();
    var obj = { strVal: id, strAdd: addid, strEdit: editid, strDel: deleteid, role_id: role_id }
    $.ajax({
        url: '/Users/ChangePermission/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () {
            $("#loader").show();
        },
        success: function (data) {
            if (data.status == true) {
                swal('Alert!', data.message, 'success');
            }
            else {
                swal('Alert!', data.message, 'error')
            }
        },
        complete: function () {
            $("#loader").hide();
        },
        error: function (error) {
            swal('Error!', 'something went wrong', 'error');
        },
    })
}

$("#userrole").change(function () {
    fillCheckMenu();
});

//add new role
$('#btnSaveRole').click(function () {
    var role = $('#txtRoleName').val();
    if (role == "") {
        swal("alert", "Please enter role name", "error").then(function () { swal.close(); $('#txtRoleName').focus(); })
    }
    else {
        var obj = { User_Type: role }
        $.ajax({
            url: '/Users/NewRole/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            success: function (data) {
                $("#roleModal .close").click();
                swal("alert", data.message, "success");
                GetRoles();

            },
            error: function () {
                swal("alert", "something went wrong", "error");
            }
        })
    }
});

//add new role
$('#btnCopyRole').click(function () {
    var rolefrom = $('#userrole').val();
    var roleto = $('#ddlCopyRole').val();
    if (rolefrom == "") { swal("alert", "Please select role from", "error").then(function () { swal.close(); $('#userrole').focus(); }) }
    else if (roleto == "") { swal("alert", "Please select role to", "error").then(function () { swal.close(); $('#ddlCopyRole').focus(); }) }
    else {
        var obj = { role_id: rolefrom, roleto: roleto }
        $.ajax({
            url: '/Users/CopyPermission/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (data) {
                swal("alert", data.message, "success");
                fillCheckMenu();
            },
            complete: function () {
                $("#loader").hide();
            },
            error: function () {
                swal("alert", "something went wrong", "error");
            }
        })
    }
});

//Fill Menu

function fillCheckMenu() {
    var roleid = $('#userrole').val();
    var obj = { roleid: roleid };
    jQuery.ajax({
        url: '/Users/getUserAuthMenu', dataType: 'json', type: "Post",
        beforeSend: function () {
            //$("#loading-div-background").show();
        },
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            console.log(data);
            $('#tt').tree({
                data: data,
                idField: 'id',
                treeField: 'text',
                height: '100%',
            });
            collapseAll();
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });
}

function collapseAll() {
    $('#tt').tree('collapseAll');
}

$('#checkAdd').click(function () {

    var nodes = $('#tt').tree('getChecked', ['checked', 'unchecked']);
    var isChecked = $('#checkAdd').prop("checked");
    for (var i = 0; i < nodes.length; i++) {
        if (isChecked == true) {
            $('#chk_add_' + nodes[i].id).prop('checked', true);
        }
        else {
            $('#chk_add_' + nodes[i].id).prop('checked', false);
        }
    }
 
});
$('#checkEdit').click(function () {
    var nodes = $('#tt').tree('getChecked', ['checked', 'unchecked']);
    var isChecked = $('#checkEdit').prop("checked");
    for (var i = 0; i < nodes.length; i++) {
        if (isChecked == true) {
            $('#chk_edit_' + nodes[i].id).prop('checked', true);
        }
        else {
            $('#chk_edit_' + nodes[i].id).prop('checked', false);
        }
    }
});
$('#checkDelete').click(function () {
    var nodes = $('#tt').tree('getChecked', ['checked', 'unchecked']);
    var isChecked = $('#checkDelete').prop("checked");
    for (var i = 0; i < nodes.length; i++) {
        if (isChecked == true) {
            $('#chk_del_' + nodes[i].id).prop('checked', true);
        }
        else {
            $('#chk_del_' + nodes[i].id).prop('checked', false);
        }
    }
});
$('#checkAll').click(function () {
    var isChecked = $(this).prop("checked");
    var roots = $('#tt').tree('getRoots');  // because it can be more roots
    console.log(roots);
    for (var i = 0; i < roots.length; i++) {
        if (isChecked)
            $("#tt").tree('check', roots[i].target);
        else
            $("#tt").tree('uncheck', roots[i].target);
    };
   

});

function checkchange(elem) {
    var myNode = $('#tt').tree('find', $(elem).data("id"));
        $("#tt").tree('check', myNode.target);
    console.log(isChecked);
}

function rootChange(elem) {
    console.log(elem);
}

