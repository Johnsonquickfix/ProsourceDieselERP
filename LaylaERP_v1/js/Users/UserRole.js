$("#loader").hide();
function GetRoles() {
    $.get('GetSystemAdminRoles', function (data) {
        var items = "";
        $('#userrole').empty();
        items += $("<option value=''>Please select</option>").appendTo("#userrole");
        $.each(data, function (index, value) {
            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#userrole");
        })
        $('#userrole').bind(items);
   
        
    })
};

function CopyRoles() {
    $.get('GetSystemAdminRoles', function (data) {
        var items = "";
        $('#ddlCopyRole').empty();
        items += $("<option value=''>Please select</option>").appendTo("#ddlCopyRole");

        $.each(data, function (index, value) {
            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlCopyRole");
        })
        $('#ddlCopyRole').bind(items);
    })
};
function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}
//function Singlecheck() {
//    var isChecked = $('#CheckSingle').prop("checked");
//    var isHeaderChecked = $("#checkAll").prop("checked");
//    if (isChecked == false && isHeaderChecked)
//        $("#checkAll").prop('checked', isChecked);
//    else {
//        $('#dtdata tr:has(td)').find('input[type="checkbox"]').each(function () {
//            if ($(this).prop("checked") == false)
//                isChecked = false;
//        });
//        $("#checkAll").prop('checked', isChecked);
//    }
//}
//checkbox end
//Give Permission

$('#btnApprove').click(function () {
    var status = $("#userrole").val();
    var copystatus = $("#ddlCopyRole").val();
    if (status == "") { swal('Alert', 'Please select user role', 'error'); }
    //else if (copystatus == "") { swal('alert', 'Please select copyroles', 'error'); }
    else {

        var n1 = $('#tt').tree('getChecked');  // get checked nodes
        var n2 = $('#tt').tree('getChecked', 'indeterminate');	// get indeterminate nodes
        var nodes = n1.concat(n2);

        //var nodes = $('#tt').tree('getChecked', ['checked', 'indeterminate']);
        //debugger
        var addnodes = ''; var id = ''; var flag = ''; var addid = ''; var editid = ''; var deleteid = '';

        for (var i = 0; i < nodes.length; i++) {
            addnodes = $('#chk_add_' + nodes[i].id).prop('checked');
            editnodes = $('#chk_edit_' + nodes[i].id).prop('checked');
            deletenodes = $('#chk_del_' + nodes[i].id).prop('checked');
            if (id != '') id += ','; id += nodes[i].id;

            if (addnodes == true) { if (addid != '') addid += ','; addid += nodes[i].id; }
            if (editnodes == true) { if (editid != '') editid += ','; editid += nodes[i].id; }
            if (deletenodes == true) { if (deleteid != '') deleteid += ','; deleteid += nodes[i].id; }
        }
        for (var i = 0; i < n1.length; i++) {
            if (flag != '') flag += ','; flag += 'C';
        }
        for (var i = 0; i < n2.length; i++) {
            if (flag != '') flag += ','; flag += 'I';
        }

        ChangePermission(id, addid, editid, deleteid, flag);
        isEdit(false);
    }
})

function ChangePermission(id, addid, editid, deleteid,flag) {
    var role_id = $("#userrole").val();
    var rolename = $("#userrole :selected").text(); 
    var obj = { strVal: id, strAdd: addid, strEdit: editid, strDel: deleteid, role_id: role_id, flag: flag }
    ActivityLog('Approved Permission for role ' + rolename + '', '/Users/AssignRole/' + role_id + '');
    //console.log(id);
    var split_str = id.split(",");
    if (split_str.indexOf("4") !== -1) {
        swal('Alert!', "You have not permission to approve role permission please unselect it", 'error');
    }
    else { 
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


                    swal('Success!', data.message, 'success');
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
}

$("#userrole").change(function () {
    fillCheckMenu();
});

//add new role
$('#btnSaveRole').click(function () {
    var role = $('#txtRoleName').val();
    if (role == "") {
        swal("Alert", "Please enter role name", "error").then(function () { swal.close(); $('#txtRoleName').focus(); })
    }
    else {
        var obj = { User_Type: role }
        $.ajax({
            url: '/Users/NewRole/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            success: function (data) {
                if (data.status == true) {
                    swal("Success!", data.message, "success");
                    $("#roleModal").modal('hide');
                    GetRoles();
                    CopyRoles();
                    console.log(data.status);
                }
                else {
                    swal("Alert!", data.message, "error");
                }
                //parent.location.reload();
            },
            error: function () {
                swal("Alert", "something went wrong", "error");
                $("#roleModal").modal('hide');
            }
        })
    }
});

//add new role
$('#btnCopyRole').click(function () {
    var rolefrom = $('#userrole').val();
    let rolefromname = $("#userrole :selected").text();
    var roleto = $('#ddlCopyRole').val();
    let roletoname = $("#ddlCopyRole :selected").text();
    if (rolefrom == "") { swal("Alert", "Please select user role first.", "error").then(function () { swal.close(); $('#userrole').focus(); }) }
    else if (roleto == "") { swal("Alert", "Please select copy to user role.", "error").then(function () { swal.close(); $('#ddlCopyRole').focus(); }) }
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
                swal("Success!", data.message, "success");
                fillCheckMenu();
                ActivityLog('Copy role permission from (' + rolefromname + ') to (' + roletoname + ')', '/Users/AssignRole');
            },
            complete: function () {
                $("#loader").hide();
            },
            error: function () {
                swal("Alert", "something went wrong", "error");
            }
        })
    }
});

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
            $('#tt').tree({
                data: data,
                idField: 'id',
                treeField: 'text',
                height: '100%',
                onCheck: function (node, checked) {


                    var data = $(this).tree('getData', node.target);

                    //var myNode = $('#tt').tree('find', data("id"));
                 //alert(data.checked);
                    if (data.checked == true) {
                        //if (data.children) {

                            for (var i = 0; i < data.children.length; i++) {
                                
                                $('#chk_add_' + data.children[i].id).prop('checked', true);
                                $('#chk_edit_' + data.children[i].id).prop('checked', true);
                                $('#chk_del_' + data.children[i].id).prop('checked', true);
                            }
                       // }
                    }
                    else {
                      //  alert('fgfg');
                        //if (data.children) {
                        //$('#chk_add_' + node.id).prop('checked', false);
                        //$('#chk_edit_' + node.id).prop('checked', false);
                        //$('#chk_del_' + node.id).prop('checked', false);
                            for (var i = 0; i < data.children.length; i++) {
                                //alert('dd');
                                $('#chk_add_' + data.children[i].id).prop('checked', false);
                                $('#chk_edit_' + data.children[i].id).prop('checked', false);
                                $('#chk_del_' + data.children[i].id).prop('checked', false);
                        }

                        //}
                    }

                    //var roots = $('#tt').tree('getParent', node.target);
                    //alert(roots);
                    //for (var i = 0; i < roots.length; i++) {
                    //    if (isChecked)
                    //        $("#tt").tree('check', roots[i].target);
                    //    else
                    //        $("#tt").tree('uncheck', roots[i].target);
                    //}

                    //var parentNode = $("#tt").tree('getParent', node.target);
                    //alert(parentNode);
                    //if (parentNode != null) {
                     
                    //    $("#tt").tree('uncheck', parentNode.target);

                    //}

                    //else {
                    //    var childNode = $("#tt").tree('getChildren', node.target);
                    //    alert(childNod+'c');
                    //    if (childNode.length > 0) {
                    //        for (var i = 0; i < childNode.length; i) {
                    //            $("#tt").tree('uncheck', childNode.target);
                    //        }
                    //    }
                    //}
                  
                   
                    $('#chk_add_' + node.id).prop('checked', checked);
                    $('#chk_edit_' + node.id).prop('checked', checked);
                    $('#chk_del_' + node.id).prop('checked', checked);
                    //if (node.level == 0) {

                    //}
                },
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
    //alert('hhh');
    //var nodes = $('#tt').tree('getChecked', ['checked', 'unchecked']);
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

//$('#checkAll').click(function () {
   
//    var isChecked = $(this).prop("checked");
//    var roots = $('#tt').tree('getRoots');  // because it can be more roots
//    for (var i = 0; i < roots.length; i++) {
//        if (isChecked)
//            $("#tt").tree('check', roots[i].target);
//        else
//            $("#tt").tree('uncheck', roots[i].target);
//    };
//});

function checkchange(elem) {
 
    var myNode = $('#tt').tree('find', $(elem).data("id"));

    var add = $('#chk_add_' + myNode.id).prop('checked');
    var edit = $('#chk_edit_' + myNode.id).prop('checked');
    var del = $('#chk_del_' + myNode.id).prop('checked');

   
    $("#hfvadd").val(add);
    $("#hfedit").val(edit);
    $("#hfview").val(del);
   
    var isChecked = $(myNode).prop("checked");

    if (add == false && edit == false && del == false) {
      
        $("#tt").tree('uncheck', myNode.target);
    }
    if (add && edit && del) {
        
        $("#tt").tree('check', myNode.target);
        
    }
    if (add || edit || del) {

        
       
        $("#tt").tree('check', myNode.target);
        
       
           
         if ($("#hfvadd").val() == "false") {
             
             
             $('#chk_add_' + myNode.id).prop('checked', false);
         }
           
        if ($("#hfedit").val() == "false") {
            
            $('#chk_edit_' + myNode.id).prop('checked', false);
        }
        if ($("#hfview").val() == "false") {
            
            $('#chk_del_' + myNode.id).prop('checked', false);
        }
    }

}




function rootChange(elem) {
     
    var roots = $('#tt').tree('getRoots');  
    for (var i = 0; i < roots.length; i++) {
        if (isChecked)
            $("#tt").tree('check', roots[i].target);
        else
            $("#tt").tree('uncheck', roots[i].target);
    };
}

