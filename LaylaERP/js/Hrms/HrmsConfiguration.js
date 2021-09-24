$(document).ready(function () {
    DAcalculation();
    ChangeCode();
    getEmployeeType();
    $(".select2").select2();
    //getAccountingType();
    //getWorkType();
    EMI();
    AdvanceEMI();
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
    var empcode = $('#hfemptype').val();
    var obj = {
        rowid: empcode,
    }
    $.ajax({
        url:"/Hrms/GetEmployeeCodeForConfig",
        dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            //if ($("#ddlempcode").val() == null) {
                var opt = '<option value="0">Please Select Employee Code</option>';
                for (var i = 0; i < data.length; i++) {
                    opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>'
                }
                $("#ddlempcode").html(opt);
            //}
        }
    })
}

function changename() {
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
                var jobj = JSON.parse(data);
                if (jobj.length > 0) {
                    $("#hfemployeeid").val(jobj[0].rowid);
                    $("#txtempname").val(jobj[0].name);
                }
            },
            error: function (msg) {

            }
        });
    });
}

function ChangeCode() {
    //$('#ddlemptype').select(function () {
    $('#ddlemptype').on('select2:select', function (e) {
        // Do something
        var empcode = $('#ddlemptype').val();
        var obj = {
            rowid: empcode,
        }
        jQuery.ajax({
            url: "/Hrms/GetEmployeeCodeForConfig/", dataType: 'json', type: "Post",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            success: function (data) {
                var opt = '<option value="0">Please Select Employee Code</option>';
                for (var i = 0; i < data.length; i++) {
                    opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>'
                }
                $("#ddlempcode").html(opt);
            },
            error: function (msg) {

            }
        });
    });
}

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
            var opt = '<option value="0">Select Work Type</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlworktype').html(opt);
        }

    });
}

function changeHRA() {
    $('#ddlhra').on('select2:select', function (e) {
        var basic = parseInt($('#txtbasic').val());
        var hratype = $('#ddlhra').val();
        var obj = {
            basic: basic,
        }
        jQuery.ajax({
            url: "/Hrms/HRAValue/", dataType: 'json', type: "Post",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            success: function (data) {
                var jobj = JSON.parse(data);
                if (jobj.length > 0) {
                    if (hratype == 1) {
                        var office = parseFloat(jobj[0].hra_office).toFixed(2);
                        $("#txthra").val(office);
                    }
                    else if (hratype == 2) {
                        var field = parseFloat(jobj[0].hra_field).toFixed(2);
                        $("#txthra").val(field);
                    }
                    else { }
                    //$("#txthra").val(jobj[0].hra_field);
                }
                },
                error: function (msg) {

                }
        });
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
    empname = $("#hfemployeeid").val();
    textempname = $("#txtempname").val();
    empbasic = $("#txtbasic").val();
    empda = $("#txtda").val();
    hratype = $("#ddlhra").val();
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
    else if (textempname == "") {
        swal('Alert', 'Employee name not found', 'error').then(function () { swal.close(); $('#txtempname').focus(); });
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
            hra_type: hratype,
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

function UpdateConfiguration() {
    id = $("#hfid").val();
    emptype = $("#ddlemptype").val();
    empcode = $("#ddlempcode").val();
    empname = $("#hfemployeeid").val();
    textempname = $("#txtempname").val();
    empbasic = $("#txtbasic").val();
    empda = $("#txtda").val();
    hratype = $("#ddlhra").val();
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
    else if (textempname == "") {
        swal('Alert', 'Employee name not found', 'error').then(function () { swal.close(); $('#ddlempcode').focus(); });
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
            rowid:id,
            emp_type: emptype,
            fk_emp: empname,
            basic: empbasic,
            emp_code: empcode,
            da: empda,
            hra: emphra,
            other_allowance: otherallowance,
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
            hra_type: hratype,
        }
        $.ajax({
            url: '/Hrms/UpdateConfiguration', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success').then((result) => { location.href = '../configurationlist'; });
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

function DAcalculation() {
    $.ajax({
        url: "/Hrms/SelectDAList/",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(),
        success: function (data) {
            console.log(data);
            var jobj = JSON.parse(data);
            if (jobj.length > 0) {
                $("#hfDA1").val(jobj[0].da_rate1);
                $("#hfDA2").val(jobj[0].da_rate2);
                $("#hfDAothers").val(jobj[0].da_rate_others);
                DA();
            }
        },
        error: function (msg) {

        }
    });
}
//DA Calculation and PF calculation
function DA() {
    var da = parseFloat($("#hfDA1").val()).toFixed(2);
    $("#txtbasic").change(function () {
            var basic = parseFloat($("#txtbasic").val()).toFixed(2);
        DAcal = parseFloat(basic * da) || 0.00;
        PF = parseFloat(basic * 0.12) || 0.00;
        PF_Calculate = parseFloat(PF).toFixed(2) || 0.00;
        DA_calculate = parseFloat(DAcal).toFixed(2) || 0.00;
        $("#txtda").val(DA_calculate);
        $("#txtpf").val(PF_Calculate);  
        
    });
}

//EMI calculation
function EMI() {
    $("#txtloanmonths").change(function () {
        var loanamount = $("#txtloanamount").val();
        var loanmonths = $("#txtloanmonths").val();
        var intrest = parseFloat(loanamount * 0.10);
        if (parseInt(loanmonths) > 0) {
            var EMI = (parseFloat(loanamount) + parseFloat(intrest)) / parseInt(loanmonths);
            var j=parseFloat(EMI).toFixed(2);
            $("#txtloanemi").val(j);
        }
        else {
            parseFloat($("#txtloanemi").val(0.00));
            alert('not passed');
        }
        
    });
}

//Advance EMI calculation
function AdvanceEMI() {
    $("#txtadvanceEmiMonths").change(function () {
        var advloanamount = $("#txtadvanceamount").val();
        var advloanmonths = $("#txtadvanceEmiMonths").val();
        if (parseFloat(advloanmonths) > 0) {
            var advEMI = (parseFloat(advloanamount) / parseInt(advloanmonths));
            adv = parseFloat(advEMI).toFixed(2);
            $("#txtadvanceEmi").val(adv);
        }
        else {
            $("#txtadvanceEmi").val(0.00);
        }
        
    });
}