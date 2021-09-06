getDepartment();
getDesignation();

function getDesignation() {
    $.ajax({
        url: "/Hrms/GetDesignation",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please Select Designation</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddldesignation').html(opt);
        }

    });
}

function getDepartment() {
    $.ajax({
        url: "/Hrms/GetDepartment",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please Select Department</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddldepartment').html(opt);
        }

    });
}


function AddEmployee() {


    
    debugger
    firstname = $("#txtFirstName").val();
    lastname = $("#txtLastName").val();
    gender = $("#ddlGender").val();
    email = $("#txtEmail").val();
    phone = $("#txtPhone").val();
    dob = $("#txtdob").val();
    emptype = $("#txtType").val();
    status = $("#chkemployeestatus").prop("checked") ? 1 : 0;

    //2nd table
    birthplace = $("#txtPlaceOfBirth").val();
    maritalstatus = $("#ddlMaritalStatus").val();
    address1 = $("#txtAddress1").val();
    address2 = $("#txtAddress2").val();
    city = $("#txtCity").val();
    state = $("#txtState").val();
    zipcode = $("#txtZipCode").val();
    country = $("#txtCountry").val();
    employeenumber = $("#txtEmployeeIDNumber").val();
    designation = $("#ddldesignation").val();
    department = $("#ddldepartment").val();
    undertaking_emp = $("#ddlSupervisorId").val();
    joiningdate = $("#txtJoiningDate").val();
    leavingdate = $("#txtLeavingDate").val();
    basicsalary = $("#txtBasicSalary").val();
    unpaidleave = $("#txtUnpaidLeavePerDay").val();
    accounttitle = $("#txtAccountTitle").val();
    bankname = $("#txtBankName").val();
    accountnumber = $("#txtAccountNumber").val();
    swiftcode = $("#txtSwiftCode").val();
   
    var formattedDate = new Date(dob);
    var d = formattedDate.getDate();
    //var m = formattedDate.getMonth();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    //m += 1;  // JavaScript months are 0-11
    var y = formattedDate.getFullYear();
    var dateofbirth = y + "-" + m + "-" + d;


    if (firstname == "") {
        swal('Alert', 'Please Enter First Name', 'error').then(function () { swal.close(); $('#txtFirstName').focus(); });
    }
    else if (lastname == "") {
        swal('Alert', 'Please Enter Last Name', 'error').then(function () { swal.close(); $('#txtLastName').focus(); });
    }

    else if (gender == 0) {
        swal('Alert', 'Please select gender', 'error').then(function () { swal.close(); $('#ddlGender').focus(); });
    }
    else if (email == "") {
        swal('Alert', 'Please email id', 'error').then(function () { swal.close(); $('#txtEmail').focus(); });
    }
    else if (phone == "") {
        swal('Alert', 'Please Enter Phone Number', 'error').then(function () { swal.close(); $('#txtPhone').focus(); });
    }
    else if (dob == "") {
        swal('Alert', 'Please Enter Date Of Birth', 'error').then(function () { swal.close(); $('#txtdob').focus(); });
    }
    else if (emptype == 0) {
        swal('Alert', 'Please Select Employee Type', 'error').then(function () { swal.close(); $('#txtType').focus(); });
    }
    else {

        var obj = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            emp_type: emptype,
            dob: dateofbirth,
            phone: phone,
            gender: gender,
            is_active: status,


            birthplace: birthplace,
            maritalstatus: maritalstatus,
            address1: address1,
            address2: address2,
            city: city,
            state: state,
            zipcode: zipcode,
            country: country,
            emp_number: employeenumber,
            designation: designation,
            department: department,
            undertaking_emp: undertaking_emp,
            joining_date: joiningdate,
            leaving_date: leavingdate,
            basic_sal: basicsalary,
            unpaid_leave_perday: unpaidleave,
            bank_account_title: accounttitle,
            bank_name: bankname,
            account_number: accountnumber,
            bank_swift_code: swiftcode,

        }
        $.ajax({
            url: '/Hrms/AddEmployee/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    //$('#parent > input:text').val('');
                    swal('Alert!', data.message, 'success');
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })

    }

}