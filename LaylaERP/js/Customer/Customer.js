
function AddCustomer() {
    debugger

    ID = $("#hfid").val();
    Email = $("#txtUserEmail").val();
    NickName = $("#txtUserNickName").val();
    FirstName = $("#txtFirstName").val();
    LastName = $("#txtLastName").val();
    BillingAddress1 = $("#txtBillingAddress1").val();
    BillingAddress2 = $("#txtBillingAddress2").val();
    BillingPostcode = $("#txtBillingPostCode").val();
    BillingCountry = $("#txtBillingCountry").val();
    BillingState = $("#txtBillingState").val();
    BillingCity = $("#txtBillingCity").val();
    BillingPhone = $("#txtBillingPhone").val();

    if (Email == "") { swal('alert', 'Please Enter Email', 'error') }
    else if (NickName == "") { swal('alert', 'Please Enter Nick Name', 'error') }
    else if (FirstName == "") { swal('alert', 'Please Enter First Name', 'error') }
    else if (LastName == "") { swal('alert', 'Please Enter Last Name', 'error') }
    else if (BillingAddress1 == "") { swal('alert', 'Please Enter Address 1', 'error') }
   /* else if (BillingAddress2 == "") { swal('alert', 'Please Enter Address 2', 'error') }*/
    else if (BillingPostcode == "") { swal('alert', 'Please Enter Post/Zip Code', 'error') }
    else if (BillingCountry == "") { swal('alert', 'Please Enter Country/Region', 'error') }
    else if (BillingState == "") { swal('alert', 'Please Enter State/Country', 'error') }
    else if (BillingCity == "") { swal('alert', 'Please Enter City', 'error') }
    else if (BillingPhone == "") { swal('alert', 'Please Enter Contact No.', 'error') }
    else {
        var obj = {
            ID: ID,
            user_email: Email, user_nicename: NickName, first_name: FirstName, last_name: LastName, billing_address_1: BillingAddress1,
            billing_address_2: BillingAddress2, billing_postcode: BillingPostcode, billing_country: BillingCountry,
            billing_state: BillingState, billing_city: BillingCity, billing_phone: BillingPhone
        }
        $.ajax({
            url: '/Customer/NewUser/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (data) {
                if (data.status == true) {
                    
                    swal('Alert!', data.message, 'success');
                    $("#parent").find(":input").each(function () {
                        switch (this.type) {
                            case "text":
                            case "email":
                            case "tel":
                                $(this).val('');
                                break;
                        }
                    });
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

function getdatabyzip() {
    var BillingPostcode = $("#txtBillingPostCode").val();
    $.ajax({
        url: "https://ziptasticapi.com/" + BillingPostcode,
        type: "GET",
        dataType: 'JSON',
        data: [],
        success: function (data) {
            $("#txtBillingCountry").val(data.country);
            $("#txtBillingState").val(data.state);
            $("#txtBillingCity").val(data.city);
        },
        error: function (msg) { alert(msg); }
    });

}

function UpdateCustomerStatus() {
    var obj = { strVal: ID }
    $.ajax({
        url: '/Customer/UpdateCustomer/', dataType: 'json', type: 'Post',
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

function DeleteCustomer(id) {
    var obj = { strVal: id }
    $.ajax({
        url: '/Customer/DeleteCustomer/', dataType: 'json', type: 'Post',
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

function ChangeStatus(id) {
    debugger
    var status = $("#ddlUserStatus").val();
    var obj = { strVal: id, user_status: status }
    $.ajax({
        url: '/Customer/ChangeCustomerStatus/', dataType: 'json', type: 'Post',
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

//-------------------------------------------------------------------
//    Fill Grid
//-------------------------------------------------------------------

function dataGridLoad() {
    var urid = parseInt($("#ddlSearchStatus").val()) || "";
    var sid = ""//$('#txtSearch').val() ;
    var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 10, sEcho: 1, SortCol: 'id', SortDir: 'desc' };
    $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true,
        bAutoWidth: false, scrollX: false, scrollY: ($(window).height() - 215),
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        sAjaxSource: "/Customer/GetCustomerList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            obj.Search = aoData[45].value;
            var col = 'id';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 2 ? "user_nicename" : oSettings.aaSorting[0][0] == 3 ? "user_email" : oSettings.aaSorting[0][0] == 4 ? "status" : oSettings.aaSorting[0][0] == 5 ? "meta_value" : oSettings.aaSorting[0][0] == 6 ? "user_registered" : "id";
                obj.SortCol = col; obj.SortDir = oSettings.aaSorting.length > 0 ? oSettings.aaSorting[0][1] : "desc";
            }
            obj.sEcho = aoData[0].value; obj.PageSize = oSettings._iDisplayLength; obj.PageNo = oSettings._iDisplayStart;
            $.ajax({
                type: "POST", url: sSource, async: true, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
                success: function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, iTotalRecords: data.iTotalRecords, iTotalDisplayRecords: data.iTotalDisplayRecords, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
                async: false
            });
        },
        aoColumns: [
            {
                'data': 'id', sWidth: "2%   ",
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '"><label></label>';
                }
            },
            { data: 'id', title: 'Cust ID', sWidth: "8%" },
            { data: 'user_nicename', title: 'Customer Name', sWidth: "14%" },
            { data: 'user_email', title: 'E-mail', sWidth: "23%" },
            { data: 'status', title: 'Status', sWidth: "8%" },
            { data: 'meta_value', title: 'Phone', sWidth: "10%" },
            { data: 'user_registered', title: 'Registration Date', sWidth: "17%" },
            {
                'data': 'id', sWidth: "8%",
                'render': function (id, type, full, meta) {
                    return '<a href="../Customer/NewUser/' + id + '"><i class="glyphicon glyphicon-pencil"></i></a>'
                }
            }
        ]
    });
}

function GetCustomerByID(id) {
    var ID = id;
    var obj = {};
    $.ajax({
        url: "/Customer/GetCustomerByID/" + ID,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var d = JSON.parse(data);
            console.log(d[0].user_email)
            $("#txtUserEmail").val(d[0].user_email);
            $("#txtUserNickName").val(d[0].user_nicename);
            $("#txtFirstName").val(d[0].first_name);
            $("#txtLastName").val(d[0].last_name);
            $("#txtBillingAddress1").val(d[0].billing_address_1);
            $("#txtBillingAddress2").val(d[0].billing_address_2);
            $("#txtBillingPostCode").val(d[0].billing_postcode);
            $("#txtBillingCountry").val(d[0].billing_country);
            $("#txtBillingState").val(d[0].billing_state);
            $("#txtBillingCity").val(d[0].billing_city);
            $("#txtBillingPhone").val(d[0].billing_phone);
           
        },
        error: function (msg) { alert(msg); }
    });

}