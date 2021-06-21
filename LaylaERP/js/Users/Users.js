///Get User Counts
function GetUsersCount() {
    var opt = { strValue1: '' };
    $.ajax({
        type: "POST", url: '/Users/GetUsersCount', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
        success: function (result) {
            var data = JSON.parse(result); 
            if (data.length > 0) {
                $('#all').find(".count").text(number_format(data[0].AllUser));
                $('#accounting').find(".count").text(number_format(data[0].Accounting));
                $('#administrator').find(".count").text(number_format(data[0].Administrator));
                $('#author').find(".count").text(number_format(data[0].Author));
                $('#contributor').find(".count").text(number_format(data[0].Contributor));
                $('#editor').find(".count").text(number_format(data[0].Editor));
                $('#modsquad').find(".count").text(number_format(data[0].ModSquad));
                $('#shopmanager').find(".count").text(number_format(data[0].ShopManager));
                $('#subscriber').find(".count").text(number_format(data[0].Subscriber));
                $('#supplychainmanager').find(".count").text(number_format(data[0].SupplyChainManager));
                $('#seo').find(".count").text(number_format(data[0].SEOEditor));
                $('#seomanager').find(".count").text(number_format(data[0].SEOManager));
                $('#norole').find(".count").text(number_format(data[0].Norole));
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });
}
function Datagrid(role_type) {
    var id;
    $('#dtdata').DataTable({
        destroy: true,
        bAutoWidth: false,
        "ajax": {
            "url": '/Users/GetData',
            "type": 'GET',
            "dataType": 'json',
            data: { rolepass: role_type },
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
            { 'data': 'user_login', 'sWidth': "15%" },
            { 'data': 'user_email', 'sWidth': "28%" },
            { 'data': 'user_status', 'sWidth': "10%" },
            { 'data': 'phone', 'sWidth': "15%" },
            { 'data': 'address', 'sWidth': "30%" },
            {
                'data': 'my', 'sWidth': "25%", 

            },
            {
                'data': 'ID', sWidth: "8%",
                'render': function (ID, type, full, meta) {
                    return '<a href="javascript:void(0);" onClick="EditUser(' + ID+')"><i class="glyphicon glyphicon-pencil"></i></a>'
                }
            }
        ],
        columnDefs: [{ orderable: false, targets: [0] }],
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
                    return '<a href="../Users/UserDetails?id=' + ID + '"><i class="glyphicon glyphicon-pencil"></i></a>'
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
    debugger
    var obj = { strVal: id }
    $.ajax({
        url: '/Users/DeleteUsers/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == true) {
                swal('Alert!', data.message, 'success').then((result) => { GetUsersCount(); var role_type = $('#hfStatusType').val(); Datagrid(role_type); });
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
                swal('Alert!', data.message, 'success').then((result) => { GetUsersCount(); var role_type = $('#hfStatusType').val(); Datagrid(role_type); });
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
                swal('Alert!', data.message, 'success').then((result) => { GetUsersCount(); var role_type = $('#hfStatusType').val(); Datagrid(role_type); });
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
    var obj = { strVal: ID, user_status: user_status };
    $.ajax({
        url: '/Users/changeRole/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == true) {
                swal('Alert!', data.message, 'success').then((result) => { GetUsersCount(); var role_type = $('#hfStatusType').val(); Datagrid(role_type); });
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
                swal('Alert!', data.message, 'success').then((result) => { GetUsersCount(); var role_type = $('#hfStatusType').val(); Datagrid(role_type); });
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
                swal('Alert!', data.message, 'success').then((result) => { GetUsersCount(); var role_type = $('#hfStatusType').val(); Datagrid(role_type);});
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