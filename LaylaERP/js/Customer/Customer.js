
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
    else if (BillingAddress2 == "") { swal('alert', 'Please Enter Address 2', 'error') }
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
            success: function (data) {
                if (data.status == true) {
                    $('#parent > input:text').val('');
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
    debugger
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

