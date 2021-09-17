$(document).ready(function () {
    getEmployeeCode();
    getEmployeeType();
    $(".select2").select2();
    getAccountingType();
    getWorkType();
})

function getEmployeeType() {
    $.ajax({
        url: "/Hrms/GetEmployeeTypeForConfig",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Select Employee Type</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlemptype').html(opt);
        }

    });
}


function getEmployeeName() {
    $.ajax({
        url: "/Hrms/GetEmployeeNameForConfig",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Select Employee Name</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlempname').html(opt);
        }

    });
}


function getEmployeeCode() {
    $.ajax({
        url:"/Hrms/GetEmployeeCodeForConfig",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please Select Employee Code</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text+'</option>'
            }
            $("#ddlempcode").html(opt);
        }
    })
}

$('#ddlempcode').change(function () { 
    var empcode = $('#ddlempcode').val();
    var obj = {
        id: empcode,
    }
    jQuery.ajax({
        url: "/Hrms/GetEmployeeNameForConfig/", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var opt;
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';

            }
            $('#ddlempname').html(opt);
        },
        //error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });
});

function getAccountingType() {
    $.ajax({
        url: "/Hrms/GetAccountingTypeForConfig",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Select Accounting Type</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlaccountingtype').html(opt);
        }

    });
}

function getWorkType() {
    $.ajax({
        url: "/Hrms/GetWorkTypeForConfig",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Select Accounting Type</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlworktype').html(opt);
        }

    });
}

function getWarehouse() {
    var empcode = $('#ddlempcode').val();
    var obj = {
        id: empcode,
    }
    $.ajax({
        url: "/Hrms/GetEmployeeNameForConfig",
        dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var opt = '<option value="0">Please Select Employee</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';

            }
            $('#ddlempname').html(opt);
        }

    });
}

function AddConfiguration() {
    emptype = $("#ddlemptype").val();
    empcode = $("#ddlempcode").val();
    empname = $("#ddlempname").val();
    empbasic = $("#txtbasic").val();
    empda = $("#txtda").val();

    emphra = $("#txthra").val();
    otherallowance = $("#txtotherallowance").val();
    emppf = $("#txtpf").val();
    loanamount = $("#txtloanamount").val();
    loanemi = $("#txtloanemi").val();

    loanmonth = $("#txtloanmonths").val();
    advancemount = $("#txtadvanceamount").val();
    advanceEmi = $("#txtadvanceEmi").val();
    advanceEmiMonth = $("#txtadvanceEmiMonths").val();
    tds = $("#txttds").val();
    otherdeductions = $("#txtotherdeductions").val();
    reimbursement = $("#txtreibursement").val();
    worktype = $("#ddlworktype").val();
    workhours = $("#txtworkhours").val();
    preparesalary = $("#ddlpreparesalary").val();
    accountingtype = $("#ddlaccountingtype").val();

    if (emptype == 0) {
        swal('Alert', 'Please select employee type', 'error').then(function () { swal.close(); $('#ddlemptype').focus(); });
    }
    else if (empcode == 0) {
        swal('Alert', 'Please select employee code', 'error').then(function () { swal.close(); $('#ddlempcode').focus(); });
    }
    else if (empname == 0) {
        swal('Alert', 'Please select employee name', 'error').then(function () { swal.close(); $('#ddlempname').focus(); });
    }
    else if (empbasic == "") {
        swal('Alert', 'Please enter basic', 'error').then(function () { swal.close(); $('#txtbasic').focus(); });
    }
    else if (empda == "") {
        swal('Alert', 'Please enter DA', 'error').then(function () { swal.close(); $('#txtda').focus(); });
    }
    else if (emphra == "") {
        swal('Alert', 'Please enter HRA ', 'error').then(function () { swal.close(); $('#txthra').focus(); });
    }
    else if (otherallowance == "") {
        swal('Alert', 'Please enter other allowance', 'error').then(function () { swal.close(); $('#txtotherallowance').focus(); });
    }
    else if (emppf == "") {
        swal('Alert', 'Please enter PF', 'error').then(function () { swal.close(); $('#txtpf').focus(); });
    }
    else if (loanamount == "") {
        swal('Alert', 'Please enter loan amount', 'error').then(function () { swal.close(); $('#txtloanamount').focus(); });
    }
    else if (loanemi == "") {
        swal('Alert', 'Please enter loan EMI', 'error').then(function () { swal.close(); $('#txtloanemi').focus(); });
    }
    else if (loanmonth == "") {
        swal('Alert', 'Please enter loan months', 'error').then(function () { swal.close(); $('#txtloanmonths').focus(); });
    }
    else if (advancemount == "") {
        swal('Alert', 'Please enter advance amount', 'error').then(function () { swal.close(); $('#txtadvanceamount').focus(); });
    }
    else if (advanceEmi == "") {
        swal('Alert', 'Please enter advance EMI', 'error').then(function () { swal.close(); $('#txtadvanceEmi').focus(); });
    }
    else if (advanceEmiMonth == "") {
        swal('Alert', 'Please enter advance EMI months', 'error').then(function () { swal.close(); $('#txtadvanceEmiMonths').focus(); });
    }
    else if (tds == "") {
        swal('Alert', 'Please enter TDS', 'error').then(function () { swal.close(); $('#txttds').focus(); });
    }
    else if (otherdeductions == "") {
        swal('Alert', 'Please enter other deductions', 'error').then(function () { swal.close(); $('#txtotherdeductions').focus(); });
    }
    else if (reimbursement == "") {
        swal('Alert', 'Please enter reimbursement', 'error').then(function () { swal.close(); $('#txtreibursement').focus(); });
    }
    else if (worktype == "0") {
        swal('Alert', 'Please select work type', 'error').then(function () { swal.close(); $('#ddlworktype').focus(); });
    }
    else if (workhours == "") {
        swal('Alert', 'Enter working hours', 'error').then(function () { swal.close(); $('#txtworkhours').focus(); });
    }
    else if (preparesalary == "0") {
        swal('Alert', 'Please select prepare salary', 'error').then(function () { swal.close(); $('#ddlpreparesalary').focus(); });
    }
    else if (accountingtype == "0") {
        swal('Alert', 'Please select accounting type', 'error').then(function () { swal.close(); $('#ddlaccountingtype').focus(); });
    }
    else {
        var obj = {
            emp_type: emptype,
            fk_emp: empname,
            basic: empbasic,
            emp_code: empcode,
            da: empda,
            hra: emphra,
            other_allowance:otherallowance,
            pf: emppf,
            loan_amount: loanamount,
            loan_emi: loanemi,
            loan_months: loanmonth,
            adv_amount: advancemount,
            adv_emi: advanceEmi,
            adv_emi_months: advanceEmiMonth,
            tds: tds,
            other_deductions: otherdeductions,
            reimbursement: reimbursement,
            work_type: worktype,
            default_work_hours: workhours,
            prepare_salary: preparesalary,
            accounting_type: accountingtype,
        }
        $.ajax({
            url: '/Hrms/AddConfiguration', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success');//.then((result) => { location.href = '../productrule'; });
                    reset();
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

function reset() {
    $("#ddlemptype").val("0").trigger('change');
    $("#ddlempcode").val("0").trigger('change');
    $("#ddlempname").val("0").trigger('change');
    $("#txtbasic").val("");
    $("#txtda").val("");

    $("#txthra").val("");
    $("#txtotherallowance").val("");
    $("#txtpf").val("");
    $("#txtloanamount").val("");
    $("#txtloanemi").val("");

    $("#txtloanmonths").val("");
    $("#txtadvanceamount").val("");
    $("#txtadvanceEmi").val("");
    $("#txtadvanceEmiMonths").val("");
    $("#txttds").val("");
    $("#txtotherdeductions").val("");
    $("#txtreibursement").val("");
    
    $("#txtworkhours").val("");
    $("#ddlpreparesalary").val("0").trigger('change');
    $("#ddlaccountingtype").val("0").trigger('change');
}