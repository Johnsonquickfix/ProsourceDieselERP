$(document).ready(function () {
    $("#loader").hide();
    getDepartment();
    getDesignation();
    $("#txtPhone").mask("(999) 999-9999");
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    if (id != "NewVendor") {
        GetVendorByID(id);
    }
})


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
    ID = $("#hfid").val();
    firstname = $("#txtFirstName").val();
    lastname = $("#txtLastName").val();
    gender = $("#ddlGender").val();
    email = $("#txtEmail").val();
    phone = $("#txtPhone").unmask().val();
    dob = $("#txtdob").val();
    emptype = $("#txtEmployeeType").val();
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

    var formattedDate = new Date(joiningdate);
    var d = formattedDate.getDate();
    //var m = formattedDate.getMonth();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    //m += 1;  // JavaScript months are 0-11
    var y = formattedDate.getFullYear();
    var dateofjoining = y + "-" + m + "-" + d;

    var formattedDate = new Date(leavingdate);
    var d = formattedDate.getDate();
    //var m = formattedDate.getMonth();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    //m += 1;  // JavaScript months are 0-11
    var y = formattedDate.getFullYear();
    var dateofleaving = y + "-" + m + "-" + d;


    if (firstname == "") {swal('Alert', 'Please Enter First Name', 'error').then(function () { swal.close(); $('#txtFirstName').focus(); });}
    else if (lastname == "") {swal('Alert', 'Please Enter Last Name', 'error').then(function () { swal.close(); $('#txtLastName').focus(); });}
    else if (gender == 0) {swal('Alert', 'Please select gender', 'error').then(function () { swal.close(); $('#ddlGender').focus(); });}
    else if (email == "") {swal('Alert', 'Please email id', 'error').then(function () { swal.close(); $('#txtEmail').focus(); });}
    else if (phone == "") {swal('Alert', 'Please Enter Phone Number', 'error').then(function () { swal.close(); $('#txtPhone').focus(); });}
    else if (dob == "") {swal('Alert', 'Please Enter Date Of Birth', 'error').then(function () { swal.close(); $('#txtdob').focus(); });}
    else if (emptype == 0) { swal('Alert', 'Please Select Employee Type', 'error').then(function () { swal.close(); $('#txtEmployeeType').focus(); });}
    else {
        var obj = {
            rowid:ID,
            firstname: firstname,lastname: lastname,email: email,emp_type: emptype,dob: dateofbirth,phone: phone,gender: gender,
            is_active: status,

            birthplace: birthplace,maritalstatus: maritalstatus,address1: address1,address2: address2,city: city,
            state: state,zipcode: zipcode,country: country,emp_number: employeenumber,designation: designation,
            department: department,undertaking_emp: undertaking_emp,joining_date: dateofjoining,leaving_date: dateofleaving,
            basic_sal: basicsalary,unpaid_leave_perday: unpaidleave,bank_account_title: accounttitle,
            bank_name: bankname,account_number: accountnumber,bank_swift_code: swiftcode,
        }
        $.ajax({
            url: '/Hrms/AddEmployee/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    $("#btnSave").text("Save");
                    swal('Alert!', data.message, 'success');
                    window.location.href = "../../Hrms/EmployeeList";
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
function GetVendorByID(id) {
  var obj =
        $.ajax({
            url: "/Hrms/GetEmployeeByID/" + id,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            success: function (data) {
                var d = JSON.parse(data);
                if (d.length > 0) {
                    if (id == "Employee") { $('#lbltitle').text("Create Employee"); } else { $('#lbltitle').text("Update Employee " + "( " + d[0].firstname + ' ' + d[0].lastname + " )"); }
                    $("#btnSave").text("Update");
                    $("#txtFirstName").val(d[0].firstname);
                    $("#txtLastName").val(d[0].lastname);
                    $("#ddlGender").val(d[0].gender).trigger("change");
                    var date = new Date(d[0].dob);
                    var dobDate = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear();
                    $("#txtdob").val(dobDate);
                    $("#txtPlaceOfBirth").val(d[0].birthplace);
                    $("#txtEmployeeType").val(d[0].emp_type);
                    $("#ddlMaritalStatus").val(d[0].maritalstatus);
                    $("#txtEmail").val(d[0].email);
                    var t = d[0].phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3");
                    $("#txtPhone").val(t);
                    $("#txtAddress1").val(d[0].address1);
                    $("#txtAddress2").val(d[0].address2);
                    $("#txtCity").val(d[0].city);
                    $("#txtState").val(d[0].state);
                    $("#txtZipCode").val(d[0].zipcode);
                    $("#txtCountry").val(d[0].country);
                    d[0].is_active == true ? $("#chkemployeestatus").prop("checked", true) : $("#chkemployeestatus").prop("checked", false);

                    $("#txtEmployeeIDNumber").val(d[0].emp_number);
                    $("#ddldesignation").val(d[0].designation).trigger("change");
                    $("#ddldepartment").val(d[0].department).trigger("change");
                    $("#ddlSupervisorId").val(d[0].undertaking_emp).trigger("change");
                    var date = new Date(d[0].joining_date);
                   var Jdate = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear();
                    $("#txtJoiningDate").val(Jdate);
                    var date = new Date(d[0].leaving_date);
                    var Ldate = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear();
                    $("#txtLeavingDate").val(Ldate);
                    $("#txtBasicSalary").val(d[0].basic_sal);
                    $("#txtUnpaidLeavePerDay").val(d[0].unpaid_leave_perday);
                    $("#txtAccountTitle").val(d[0].bank_account_title);
                    $("#txtBankName").val(d[0].bank_name);
                    $("#txtAccountNumber").val(d[0].account_number);
                    $("#txtSwiftCode").val(d[0].bank_swift_code);
                }
            },
            error: function (msg) {

            }
        });
}