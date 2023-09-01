let myvalue = 1;
//var searchText = getUrlVars();
///Get User Counts

function getUrlVars() {
    //var sPageURL = decodeURIComponent(window.location.search.substring(1));
    //sPageURL = sPageURL.split('name=');
    //var sURLVariables = localStorage.getItem('_search');
    let sURLVariables = localStorage.getItem('_search');
    localStorage.setItem('_search', '')
    return sURLVariables
}
function GetUsersCount() {
    $("#role-ul").empty();
    $.ajax({
        type: "POST", url: '/Users/GetRolesTypeTopBar', contentType: "application/json; charset=utf-8", dataType: "json", data: [],
        beforeSend: function () { $("#loader").show(); },
        success: function (result) {
            var data = JSON.parse(result);
            let alltotal = 0;
            let items = $('<li class="all" data-uservalue="" data-usertext=""><a class="caction" href="javascript:void(0);" id="all" aria-current="page">All (<span class="count">0</span>)</a> |</li>').appendTo("#role-ul");
            $.each(data, function (index, value) {
                items += $('<li data-uservalue="' + value.User_Value + '" data-usertext="' + value.User_Type + '" class="' + value.User_Value.toLowerCase().replace(/ +/g, "").trim() + '"><a class="caction" href="javascript:void(0);" id="' + value.User_Value + '">' + value.User_Type + ' (' + value.cnt + ')</a > |</li >').appendTo("#role-ul"); //(<span class="count">0</span>)
                //items += $('<li data-uservalue="' + value.User_Value + '" data-usertext="' + value.User_Type + '" class="' + value.User_Value.toLowerCase().replace(/ +/g, "").trim() + '"><a class="caction" href="javascript:void(0);" id="' + value.User_Value + '">' + value.User_Type + ' (' + value.cnt + ')</a > </li >').appendTo("#role-ul"); //(<span class="count">0</span>)
                alltotal = alltotal + parseInt(value.cnt);
            })
            /* items += $('<li class="none" data-uservalue="" data-usertext=""><a class="caction" href="javascript:void(0);" id="norole">No role (<span class="count">0</span>)</a></li>').appendTo("#role-ul");*/
            items += $('<li class="none" data-uservalue="" data-usertext=""><a class="caction" href="javascript:void(0);" id="norole"></a></li>').appendTo("#role-ul");
            $('#all').find(".count").text(number_format(alltotal - 1));
            let id = $("#hfStatusType").val();
            if (id != '')
                $('#' + id).addClass('current');
            else
                $('#all').addClass('current');
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
        complete: function () { $("#loader").hide(); },
        async: false
    });
}

//function GetUserCountTopBar() {
//    var opt = { strValue1: '' };
//    $.ajax({
//        type: "POST", url: '/Users/GetUsersCount', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
//        success: function (result) {
//            var data = JSON.parse(result);
//            //console.log(data);
//            if (data.length > 0) {
//                $('#all').find(".count").text(number_format(data[0].AllUser));
//                $('#accounting').find(".count").text(number_format(data[0].Accounting));
//                $('#administrator').find(".count").text(number_format(data[0].Administrator));
//                //$('#Author').find(".count").text(number_format(data[0].Author));
//                //$('#Contributor').find(".count").text(number_format(data[0].Contributor));
//                //$('#Editor').find(".count").text(number_format(data[0].Editor));
//                //$('#Modsquad').find(".count").text(number_format(data[0].ModSquad));
//                //$('#shopmanager').find(".count").text(number_format(data[0].ShopManager));
//                //$('#Subscriber').find(".count").text(number_format(data[0].Subscriber));
//                //$('#supplychainmanager').find(".count").text(number_format(data[0].SupplyChainManager));
//                //$('#seoeditor').find(".count").text(number_format(data[0].SEOEditor));
//                //$('#seomanager').find(".count").text(number_format(data[0].SEOManager));
//                $('#norole').find(".count").text(number_format(data[0].Norole));
//            }
//        },
//        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
//        async: false
//    });
//}

function Datagrid(role_type, type) {
    //alert(type);
    var columnDefs = [];


    if ($('#hfEdit').val() == 1) {
        if (type.toUpperCase() == "ADMINISTRATOR") {
            columnDefs = [


                {

                    "targets": [5],
                    "visible": false
                },
                {
                    "targets": [6],
                    "visible": false
                },
                {

                    "targets": [7],
                    "visible": true
                },

            ]
        }
        else {
            columnDefs = [

                {

                    "targets": [7],
                    "visible": true
                },

            ]
        }

    } else if (type.toUpperCase() == "ADMINISTRATOR") {

        columnDefs = [

            {

                "targets": [7],
                "visible": true
            },
            {

                "targets": [5],
                "visible": false
            },
            {
                "targets": [6],
                "visible": false
            },
        ]

    } else {

        columnDefs = [

            {

                "targets": [7],
                "visible": false
            }
        ]
    }
    searchText = localStorage.getItem('_search');
    localStorage.setItem('_search', '')
    //console.log(role_type, type);
    var id;
    if (searchText == '') {
        $('#dtdata').DataTable({
            //  oSearch: { "sSearch": role_type.trim() },
            destroy: true,
            bAutoWidth: false,
            "ajax": {
                "url": '/Users/GetData',
                "type": 'GET',
                "dataType": 'json',
                data: { rolepass: role_type.trim() },
                contentType: "application/json; charset=utf-8",
            },
            lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
            "columns": [
                {
                    'data': 'ID', sWidth: "5%",
                    'render': function (data, type, full, meta) {
                        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '"><label></label>';
                    }
                },
                { 'data': 'ID', 'sWidth': "8%", "bSearchable": true },
                { 'data': 'user_login', 'sWidth': "12%", "bSearchable": true },
                { 'data': 'user_email', 'sWidth': "25%", "bSearchable": true },
                { 'data': 'user_status', 'sWidth': "10%", "bSearchable": true },
                { 'data': 'phone', 'sWidth': "15%", "bSearchable": true },
                { 'data': 'address', 'sWidth': "30%", "bSearchable": true },
                {
                    data: 'my', title: 'Role', sWidth: "22%", "bSearchable": true, render: function (data, type, row) {
                        let str = getAllUserType(data); console.log(data);
                        return str;
                    }
                },
                {
                    'data': 'ID', sWidth: "8%", "bSearchable": false,
                    'render': function (ID, type, full, meta) {
                        if ($("#hfEdit").val() == "1") {
                            return '<a href="javascript:void(0);" class="editbutton" onClick="EditUser(' + ID + '); " data-toggle="tooltip" title="View/Edit user"><i class="glyphicon glyphicon-pencil"></i></a>';
                        }
                        else { return "No Permission"; }
                    }

                }
            ],
            columnDefs: columnDefs,
            "order": [[1, 'desc']],
            initComplete: function () {
                var column = this.api().column(4);
                if (myvalue != 1) {
                    var select = $('<select class="filter"><option value="All">Select</option></select>')
                        .appendTo('#selectStatus')
                        .on('change', function () {
                            var val = $(this).val();
                            column.search(val ? '^' + $(this).val() + '$' : val, true, false).draw();
                            //column.search(val).draw()
                        });

                    var offices = [];
                    column.data().toArray().forEach(function (s) {
                        s = s.split(',');
                        s.forEach(function (d) {
                            if (!~offices.indexOf(d)) {
                                offices.push(d)
                                select.append('<option value="' + d + '">' + d + '</option>');
                            }
                        })
                    });
                }
            }
            /*
      column.data().unique().sort().each(function(d, j) {
        select.append('<option value="' + d + '">' + d + '</option>');
      });
     */


        });
    }
    else {
        $('#dtdata').DataTable({
            oSearch: { "sSearch": searchText },
            destroy: true,
            bAutoWidth: false,
            "ajax": {
                "url": '/Users/GetData',
                "type": 'GET',
                "dataType": 'json',
                // data: { rolepass: role_type.trim() },
                contentType: "application/json; charset=utf-8",
            },
            lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
            "columns": [
                {
                    'data': 'ID', sWidth: "5%",
                    'render': function (data, type, full, meta) {
                        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '"><label></label>';
                    }
                },
                { 'data': 'ID', 'sWidth': "8%" },
                { 'data': 'user_login', 'sWidth': "12%" },
                { 'data': 'user_email', 'sWidth': "25%" },
                { 'data': 'user_status', 'sWidth': "10%" },
                { 'data': 'phone', 'sWidth': "15%" },
                { 'data': 'address', 'sWidth': "30%" },
                {
                    data: 'my', title: 'Role', sWidth: "22%", render: function (data, type, row) {
                        let str = getAllUserType(data);
                        return str;
                    }
                },
                {
                    'data': 'ID', sWidth: "8%",
                    'render': function (ID, type, full, meta) {
                        if ($("#hfEdit").val() == "1") {
                            return '<a href="javascript:void(0);" class="editbutton" onClick="EditUser(' + ID + ')" data-toggle="tooltip" title="View/Edit user"><i class="glyphicon glyphicon-pencil"></i></a>';
                        }
                        else { return "No Permission"; }
                    }
                    //'render': function (ID, type, full, meta) {
                    //    if (sessionStorage.hfEdit == "1") {
                    //        return '<a href="javascript:void(0);" class="editbutton" onClick="EditUser(' + ID + ')"><i class="glyphicon glyphicon-pencil"></i></a>';
                    //        sessionStorage.removeItem(hfEdit);
                    //    }
                    //    else { return "No Permission"; }
                    //}
                }
            ],
            columnDefs: columnDefs,
            "order": [[1, 'desc']],
            initComplete: function () {
                var column = this.api().column(4);
                if (myvalue != 1) {
                    var select = $('<select class="filter"><option value="All">Select</option></select>')
                        .appendTo('#selectStatus')
                        .on('change', function () {
                            var val = $(this).val();
                            column.search(val ? '^' + $(this).val() + '$' : val, true, false).draw();
                            //column.search(val).draw()
                        });

                    var offices = [];
                    column.data().toArray().forEach(function (s) {
                        s = s.split(',');
                        s.forEach(function (d) {
                            if (!~offices.indexOf(d)) {
                                offices.push(d)
                                select.append('<option value="' + d + '">' + d + '</option>');
                            }
                        })
                    });
                }
            }
            /*
      column.data().unique().sort().each(function(d, j) {
        select.append('<option value="' + d + '">' + d + '</option>');
      });
     */


        });
    }
}

function getAllUserType(sValue) {
    if (sValue != null) {
        var user_type = '';
        $('.subsubsub li').each(function (index) {
            let val = $(this).data('uservalue'), txt = $(this).data('usertext');            
            let i = sValue.toLowerCase().trim().indexOf(val.toLowerCase().trim());
            //let i = sValue.trim().indexOf(val);
            if (i > -1) user_type = (user_type.length > 0 ? user_type + ', ' : '') + txt;
        });
        return user_type.substring(0, user_type.length - 2);
    }
    else
        return '';
}

function DatagridLoade() {
    //
    var myvalue = k;
    //var obj = { rolepass: j };
    //alert(JSON.stringify(obj));
    var id;
    $('#dtdata').DataTable({
        destroy: true,
        bAutoWidth: false,
        "ajax": {
            "url": '/Users/GetData',
            "type": 'GET',
            "dataType": 'json',
            data: { rolepass: j },
            contentType: "application/json; charset=utf-8",

        },
        lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],

        "columns": [
            {
                'data': 'ID', sWidth: "5%",
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '"><label></label>';
                }
            },
            { 'data': 'ID', 'sWidth': "5%" },
            { 'data': 'user_login', 'sWidth': "20%" },
            { 'data': 'user_email', 'sWidth': "20%" },
            { 'data': 'user_status', 'sWidth': "20%" },
            { 'data': 'my', 'sWidth': "20%" },
            {
                'data': 'ID', sWidth: "8%",
                'render': function (ID, type, full, meta) {
                    return '<a href="../Users/UserDetails?id=' + ID + '" data-toggle="tooltip" title="View/Edit user"><i class="glyphicon glyphicon-pencil"></i></a>'
                }
            }
        ],

        columnDefs: [{
            orderable: false,
            targets: [0]
        }],
        //columnDefs: [{
        //    orderable: false,
        //    className: 'select-checkbox',
        //    targets: 0,
        //    'checkboxes': {
        //        'selectRow': true
        //    },
        //    data: ID,
        //    defaultContent: '',
        //}],
        //"select": {
        //    "style": 'multi',
        //    "selector": 'td:first-child'
        //},
        "order": [[1, 'desc']],



    });
};

function EditUser(id) {
    ActivityLog('edit user id ' + id + ' in user management.', '/Users/Users/' + id + '');
    window.location.href = 'UserDetails?id=' + id;
}

function getdatabyzip() {
    var BillingPostcode = $("#txtPostCode").val();
    $.ajax({
        url: "https://ziptasticapi.com/" + BillingPostcode,
        type: "GET",
        dataType: 'JSON',
        data: [],
        success: function (data) {
            $("#txtCountry").val(data.country);
            $("#txtState").val(data.state);
            $("#txtCity").val(data.city);
        },
        error: function (msg) { alert(msg); }
    });

}

function DeleteUsers(id) {
    // debugger
    var obj = { strVal: id }
    $.ajax({
        url: '/Users/DeleteUsers/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == true) {
                swal('Success!', data.message, 'success').then((result) => { GetUsersCount(); var role_type = $('#hfStatusType').val(); Datagrid(role_type, $("#hfroletype").val()); });
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

function ActiveUsers(id) {
    var obj = { strVal: id }
    $.ajax({
        url: '/Users/ActiveUsers/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == true) {
                swal('Success!', data.message, 'success').then((result) => { GetUsersCount(); var role_type = $('#hfStatusType').val(); Datagrid(role_type, $("#hfroletype").val()); });
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

function UpdateCustomerStatus() {
    var obj = { strVal: ID }
    $.ajax({
        url: '/Users/UpdateCustomer/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == true) {
                swal('Success!', data.message, 'success').then((result) => { GetUsersCount(); var role_type = $('#hfStatusType').val(); Datagrid(role_type, $("#hfroletype").val()); });
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

function changeRole(ID) {
    user_status = $("#new_role").val();
    //alert(user_status);
    var obj = { strVal: ID, user_status: user_status };
    $.ajax({
        url: '/Users/changeRole/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == true) {
                //swal('Alert!', data.message, 'success').then((result) => { GetUsersCount(); var role_type = $('#hfStatusType').val(); Datagrid(role_type, $("#hfroletype").val()); }); //GetUsersCount();
                swal('Success!', data.message, 'success').then((result) => {
                    //setTimeout(function () {
                    //    GetUsersCount(); var role_type = $('#hfStatusType').val();
                    //    Datagrid(role_type, $("#hfroletype").val());
                    //}, 50);
                    location.reload();
                }); //GetUsersCount();

                //swal('Alert!', data.message, 'success').then((result) => { location.href = 'Users'; });
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

function Grantrole(ID) {
    user_status = $("#grant_role").val();
    var obj = {
        strVal: ID,
        user_status: user_status
    }
    $.ajax({
        url: '/Users/Grantrole/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == true) {
                //swal('Alert!', data.message, 'success').then((result) => { GetUsersCount(); var role_type = $('#hfStatusType').val(); Datagrid(role_type, $("#hfroletype").val()); });
                //swal('Success!', data.message, 'success').then((result) => { setTimeout(function () { GetUsersCount(); var role_type = $('#hfStatusType').val(); Datagrid(role_type, $("#hfroletype").val()); }, 50);  });
                location.reload();
            }
            else {
                swal('Alert!', data.message, 'error');
            }
        },
        error: function (error) {
            swal('Error!', 'something went wrong', 'error');
        },
    })
}
function Revokerole(ID) {
    user_status = $("#revoke_role").val();
    var obj = {
        strVal: ID,
        user_status: user_status
    }
    $.ajax({
        url: '/Users/Revokerole/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == true) {
                //swal('Alert!', data.message, 'success').then((result) => { GetUsersCount(); var role_type = $('#hfStatusType').val(); Datagrid(role_type, $("#hfroletype").val()); });
                // swal('Success!', data.message, 'success').then((result) => { setTimeout(function () { GetUsersCount(); var role_type = $('#hfStatusType').val(); Datagrid(role_type, $("#hfroletype").val()); }, 50); });
                location.reload();
            }
            else {
                swal('Alert!', data.message, 'error');
            }
        },
        error: function (error) {
            swal('Error!', 'something went wrong', 'error');
        },
    })
}