$(document).ready(function () {
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    getDepartment();
    getDesignation();
    getEmployeeCode();
    $("#loader").hide();
    $("#txtPhone").mask("(999) 999-9999");
    $("#txtAlternateContactNumber").mask("(999) 999-9999");

    $("#txtdob").datepicker({ format: 'mm-dd-yyyy', });
    $("#txtJoiningDate").datepicker({ format: 'mm-dd-yyyy', });
    $("#txtLeavingDate").datepicker({ format: 'mm-dd-yyyy', });
    $(".select2").select2();
    if (id != "NewVendor") {
        GetVendorByID(id);
    }
    EmployeeLinkedFiles();
    $('input:checkbox').prop('checked', true);
})


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#show_picture').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);

    }
}


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
function getEmployeeCode() {
    var obj =
        $.ajax({
            url: "/Hrms/GetEmployeeCode/",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            success: function (data) {
                var d = JSON.parse(data);
                if (d.length > 0) {
                    $("#txtEmployeeIDNumber").val(d[0].Code);
                }
            },
            error: function (msg) {

            }
        });

}

$(document).on('click', "#btnNext1", function () {
   
    ID = $("#hfid").val();
    firstname = $("#txtFirstName").val().trim();
    lastname = $("#txtLastName").val().trim();
    gender = $("#ddlGender").val();
    email = $("#txtEmail").val();
    phone = $("#txtPhone").val();
    dob = $("#txtdob").val();
    emptype = $("#ddlEmployeeType").val();
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

    var formattedDate = new Date(dob);
    var d = formattedDate.getDate();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    var y = formattedDate.getFullYear();
    var dateofbirth = y + "-" + m + "-" + d;
    var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (firstname == "") { swal('Alert', 'Please Enter First Name', 'error').then(function () { swal.close(); $('#txtFirstName').focus(); }); }
    else if (lastname == "") { swal('Alert', 'Please Enter Last Name', 'error').then(function () { swal.close(); $('#txtLastName').focus(); }); }
    else if (gender == 0) { swal('Alert', 'Please select gender', 'error').then(function () { swal.close(); $('#ddlGender').focus(); }); }
    else if (email == "") { swal('Alert', 'Please email id', 'error').then(function () { swal.close(); $('#txtEmail').focus(); }); }
    else if (!pattern.test(email)) { swal('alert', 'not a valid e-mail address', 'error').then(function () { swal.close(); $('#txtAccountEmail').focus(); }) }
    else if (phone == "") { swal('Alert', 'Please Enter Phone Number', 'error').then(function () { swal.close(); $('#txtPhone').focus(); }); }
    else if (dob == "") { swal('Alert', 'Please Enter Date Of Birth', 'error').then(function () { swal.close(); $('#txtdob').focus(); }); }
    else if (emptype == 0) { swal('Alert', 'Please Select Employee Type', 'error').then(function () { swal.close(); $('#ddlEmployeeType').focus(); }); }
    else {
        phone = $("#txtPhone").unmask().val();
        var obj = {
            rowid: ID,
            firstname: firstname, lastname: lastname, email: email, emp_type: emptype, dob: dateofbirth, phone: phone, gender: gender,
            is_active: status,

            birthplace: birthplace, maritalstatus: maritalstatus, address1: address1, address2: address2, city: city,
            state: state, zipcode: zipcode, country: country,
        }
        $.ajax({
            url: '/Hrms/AddEmployeeBasicInfo/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                $("#hfid").val(data.id);
                if (data.status == true) {
                    $("#txtPhone").mask("(999) 999-9999");
                    var link = $('#mytabs .active').next().children('a').attr('href');
                    $('#mytabs a[href="' + link + '"]').tab('show');
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })

    }

});

$(document).on('click', "#btnBack2", function () {
    var link = $('#mytabs .active').prev().children('a').attr('href');
    $('#mytabs a[href="' + link + '"]').tab('show');
});
$(document).on('click', "#btnNext2", function () {
    ID = $("#hfid").val();
    employeenumber = $("#txtEmployeeIDNumber").val();
    designation = $("#ddldesignation").val();
    department = $("#ddldepartment").val();
    undertaking_emp = $("#ddlSupervisorId").val();
    joiningdate = $("#txtJoiningDate").val();
    leavingdate = $("#txtLeavingDate").val();
    bloodgroup = $("#ddlBloodGroup").val();
    education = $("#txtEducation").val();
    professionalqualification = $("#txtProfessionalQualification").val();
    otherdetails = $("#txtOtherDetails").val();
    alternateaddress1 = $("#txtAlternateAddress1").val();
    alternateaddress2 = $("#txtAlternateAddress2").val();
    alternatecity = $("#txtAlternateCity").val();
    alternatestate = $("#txtAlternateState").val();
    alternatezipcode = $("#txtAlternateZipCode").val();
    alternatecountry = $("#txtAlternateCountry").val();
    alternatecontactNumber = $("#txtAlternateContactNumber").val();
    var formattedDate = new Date(joiningdate);
    var d = formattedDate.getDate();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    var y = formattedDate.getFullYear();
    var dateofjoining = y + "-" + m + "-" + d;

    var formattedDate = new Date(leavingdate);
    var d = formattedDate.getDate();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    var y = formattedDate.getFullYear();
    var dateofleaving = y + "-" + m + "-" + d;
    alternatecontactNumber = $("#txtAlternateContactNumber").unmask().val();
    var obj = {
        
        rowid: ID,
       emp_number: employeenumber, designation: designation,
        department: department, undertaking_emp: undertaking_emp, joining_date: dateofjoining, leaving_date: dateofleaving,
        bloodgroup: bloodgroup, education: education, professionalqualification: professionalqualification, otherdetails: otherdetails,
        alternateaddress1: alternateaddress1, alternateaddress2: alternateaddress2, alternatecity: alternatecity,
        alternatestate: alternatestate, alternatezipcode: alternatezipcode, alternatecountry: alternatecountry,
        alternatecontactNumber: alternatecontactNumber
     }
    $.ajax({
        url: '/Hrms/AddEmployeeAdditionalInfo/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            if (data.status == true) {
                $("#txtAlternateContactNumber").mask("(999) 999-9999");
                var link = $('#mytabs .active').next().children('a').attr('href');
                $('#mytabs a[href="' + link + '"]').tab('show');
            }
            else {
                swal('Alert!', data.message, 'error');
            }
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })


});
$(document).on('click', "#btnBack3", function () {
    var link = $('#mytabs .active').prev().children('a').attr('href');
    $('#mytabs a[href="' + link + '"]').tab('show');
});
$(document).on('click', "#btnNext3", function () {
    ID = $("#hfid").val();
    basicsalary = $("#txtBasicSalary").val();
    unpaidleave = $("#txtUnpaidLeavePerDay").val();
        var obj = {
            rowid: ID,
            basic_sal: basicsalary, unpaid_leave_perday: unpaidleave, 
        }
        $.ajax({
            url: '/Hrms/AddSalaryInfo/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    var link = $('#mytabs .active').next().children('a').attr('href');
                    $('#mytabs a[href="' + link + '"]').tab('show');
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })
});
$(document).on('click', "#btnBack4", function () {
    var link = $('#mytabs .active').prev().children('a').attr('href');
    $('#mytabs a[href="' + link + '"]').tab('show');
});
$(document).on('click', "#btnNext4", function () {
    ID = $("#hfid").val();
    accounttitle = $("#txtAccountTitle").val();
    bankname = $("#txtBankName").val();
    accountnumber = $("#txtAccountNumber").val();
    swiftcode = $("#txtSwiftCode").val();
        var obj = {
            rowid: ID,
           bank_account_title: accounttitle,
            bank_name: bankname, account_number: accountnumber, bank_swift_code: swiftcode,
        }
        $.ajax({
            url: '/Hrms/AddBankInfo/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    var link = $('#mytabs .active').next().children('a').attr('href');
                    $('#mytabs a[href="' + link + '"]').tab('show');
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })
});
$(document).on('click', "#btnBack5", function () {
    var link = $('#mytabs .active').prev().children('a').attr('href');
    $('#mytabs a[href="' + link + '"]').tab('show');
});
$("#btnuploadFiles").click(function () {
    fk_emp = $("#hfid").val();
    var file = document.getElementById("ImageFile").files[0];
    var formData = new FormData();
    formData.append("ImageFile", file);
    formData.append("fk_emp", fk_emp);

    if (fk_emp == 0) {
        swal('Alert', 'Employee not found', 'error').then(function () { swal.close(); });
    }
    else {
        $.ajax({
            type: "POST",
            url: '/Hrms/EmployeeFileUpload/',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    EmployeeLinkedFiles();
                    swal('Alert!', data.message, 'success');
                }
                else { swal('Alert!', data.message, 'error'); }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
        })
    }
})
$("#btnUploadProfile").click(function () {
    fk_emp = $("#hfid").val();
    var file = document.getElementById("EmpImageFile").files[0];
    var formData = new FormData();
    formData.append("EmpImageFile", file);
    formData.append("fk_emp", fk_emp);

    if (fk_emp == 0) {
        swal('Alert', 'Employee not found', 'error').then(function () { swal.close(); });
    }
    else {
        $.ajax({
            type: "POST",
            url: '/Hrms/EmployeeProfileUpload/',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success');
                }
                else { swal('Alert!', data.message, 'error'); }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
        })
    }
})
function EmployeeLinkedFiles() {
    var urid = "";
    ID = $("#hfid").val();
    var sid = "";
    let table_EL = $('#EmployeeLinkedFiles').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#EmployeeLinkedFiles_filter input').unbind();
            $('#EmployeeLinkedFiles_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Hrms/GetEmployeeLinkedFiles",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: ID });
            aoData.push({ name: "strValue2", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "filename" : oSettings.aaSorting[0][0] == 1 ? "filesize" : oSettings.aaSorting[0][0] == 2 ? "Date" : "id";
                aoData.push({ name: "sSortColName", value: col });
            }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    $("#lblAttachedFiles").text(data.recordsTotal);
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            {
                'data': 'filename', sWidth: "25%", class: 'text-left',
                'render': function (FileName, type, full, meta) {
                    return '<a target="popup" href="../../Content/EmployeeLinkedFiles/' + FileName + '">' + FileName + ' <i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'filesize', title: 'FileSize', sWidth: "25%" },
            { data: 'Date', title: 'Date', sWidth: "25%" },
            {
                'data': 'ID',
                'render': function (id, type, full, meta) {
                    return '<a href="#" onclick="DeleteEmployeeLinkedFiles(' + id + ');"><i class="fas fa-trash-alt"></i></a>';
                }
            }
        ]
    });
}
function DeleteEmployeeLinkedFiles(id) {
    RowID = $("#hfid").val();
    var result = confirm("Are you sure to delete this Linked File?");
    if (result) {
        var obj = { rowid: RowID, EmployeeLinkedFilesID: id, }
        $.ajax({
            url: '/Hrms/DeleteEmployeeLinkedFiles/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8", data: JSON.stringify(obj), dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success');
                    EmployeeLinkedFiles();
                }
                else { swal('Alert!', data.message, 'error') }
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
                    $("#ddlEmployeeType").val(d[0].emp_type).trigger("change");
                    $("#ddlMaritalStatus").val(d[0].maritalstatus).trigger("change");
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

                    $('#show_picture').attr('src', '../../Content/EmployeeProfileImage/' + d[0].ProfileImageName);
                    $("#txtEmployeeIDNumber").val(d[0].emp_number);
                    $("#ddldesignation").val(d[0].designation == null ? "0" : d[0].designation).trigger("change");
                    $("#ddldepartment").val(d[0].department == null ? "0" : d[0].department).trigger("change");
                    $("#ddlSupervisorId").val(d[0].undertaking_emp == null ? "0" : d[0].undertaking_emp).trigger("change");
                    var date = new Date(d[0].joining_date);
                    var Jdate = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear();
                    $("#txtJoiningDate").val(Jdate);
                    var date = new Date(d[0].leaving_date);
                    var Ldate = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear();
                    $("#txtLeavingDate").val(Ldate);
                    $("#ddlBloodGroup").val(d[0].bloodgroup == null ? "0" : d[0].bloodgroup).trigger("change");
                    $("#txtEducation").val(d[0].education);
                    $("#txtProfessionalQualification").val(d[0].professionalqualification);
                    $("#txtOtherDetails").val(d[0].otherdetails);
                    $("#txtAlternateAddress1").val(d[0].alternateaddress1);
                    $("#txtAlternateAddress2").val(d[0].alternateaddress2);
                    $("#txtAlternateCity").val(d[0].alternatecity);
                    $("#txtAlternateState").val(d[0].alternatestate);
                    $("#txtAlternateZipCode").val(d[0].alternatezipcode);
                    $("#txtAlternateCountry").val(d[0].alternatecountry);
                    
                  
                    //tab 3
                    $("#txtBasicSalary").val(d[0].basic_sal);
                    $("#txtUnpaidLeavePerDay").val(d[0].unpaid_leave_perday);
                    //tab 4
                    $("#txtAccountTitle").val(d[0].bank_account_title);
                    $("#txtBankName").val(d[0].bank_name);
                    $("#txtAccountNumber").val(d[0].account_number);
                    $("#txtSwiftCode").val(d[0].bank_swift_code);

                    var alternate = d[0].alternatecontactNumber = null ? "" : d[0].alternatecontactNumber.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3");
                    $("#txtAlternateContactNumber").val(alternate);
                    console.log(alternate);
                }
            },
            error: function (msg) {

            }
        });
}

