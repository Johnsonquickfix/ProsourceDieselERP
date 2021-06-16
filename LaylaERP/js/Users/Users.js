function Datagrid(k) {
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
            { 'data': 'ID', 'sWidth': "8%" },
            { 'data': 'user_login', 'sWidth': "18%" },
            { 'data': 'user_email', 'sWidth': "35%" },
            { 'data': 'user_status', 'sWidth': "10%" },
            {
                'data': 'my', 'sWidth': "25%", 

            },
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
            }


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
        /*
  column.data().unique().sort().each(function(d, j) {
    select.append('<option value="' + d + '">' + d + '</option>');
  });
 */


    });
}

function DatagridLoade() {
    //
    //var myvalue = k;
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
                swal('Alert!', data.message, 'success');
                DatagridLoade();
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

    debugger
    var obj = { strVal: id }

    $.ajax({
        url: '/Users/ActiveUsers/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == true) {
                swal('Alert!', data.message, 'success');
                DatagridLoade();
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



function changeRole(ID) {

    ID = ID;
    user_status = $("#new_role").val();
    var obj = {
        strVal: ID,
        user_status: user_status
    }
    $.ajax({
        url: '/Users/changeRole/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == true) {
                swal('Alert!', data.message, 'success');
                DatagridLoade();
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

    ID = ID;
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
                swal('Alert!', data.message, 'success');
                DatagridLoade();
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
function Revokerole(ID) {

    ID = ID;
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
                swal('Alert!', data.message, 'success');
                DatagridLoade();
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