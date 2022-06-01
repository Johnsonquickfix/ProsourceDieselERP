$(document).ready(function () {
    //getType();
    getName();
    //getDetailType();
    $(".select2").select2();
    $("#btnSave").click(function () {
        AddChartOfAccountEntry();
    });
    $("#btnUpdate").click(function () {
        UpdateChartOfAccountEntry();
    })
})
function getType() {
    $.ajax({
        url: "/Accounting/GetParentAccount",
        type: "Get",
        success: function (data) {
            $('#ddltype').append('<option value="0">Please select type</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddltype').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}

function getName() {
    $.ajax({
        url: "/Accounting/GetName",
        type: "Get",
        success: function (data) {
            $('#ddlname').append('<option value="0">Please select name</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddlname').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}

$('#ddlname').change(function () {
    var name = $('#ddlname').val();
    var obj = {
        strValue2: name,
    }
    $.ajax({
        url: "/Accounting/GetType",
        dataType: 'json',
        type: "post",
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var opt = '<option value="0">Please select type</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option selected value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddltype').html(opt);
        }
    });

    $.ajax({
        url: "/Accounting/GetDetailType",
        dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var opt = '<option value="0">Please select detail type</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option selected value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddldetailtype').html(opt);
        }
    });

});

function getDetailType() {
    $.ajax({
        url: "/Accounting/GetDetailType",
        type: "Get",
        success: function (data) {
            $('#ddldetailtype').append('<option value="0">Please select detail type</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddldetailtype').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}

function AddChartOfAccountEntry() {
    var name = $("#ddlname").val();
    var type = $("#ddltype").val();
    var detailtype = $("#ddldetailtype").val();
    var debit = $("#txtbalance").val();
    var credit = $("#txtbankbalance").val();
    var entrydate = $("#txtentrydate").val();

    if (name == "0") {
        swal('Alert', 'Please select name', 'error').then(function () { swal.close(); $('#ddlname').focus(); });
    }
    else if (type == "0") {
        swal('Alert', 'Please select type', 'error').then(function () { swal.close(); $('#ddltype').focus(); });
    }
    else if (detailtype == "0") {
        swal('Alert', 'Please select detail type', 'error').then(function () { swal.close(); $('#ddldetailtype').focus(); });
    }
    else if (debit == "") {
        swal('Alert', 'Please enter debit amount', 'error').then(function () { swal.close(); $('#txtbalance').focus(); });
    }
    else if (credit == "") {
        swal('Alert', 'Please enter credit amount', 'error').then(function () { swal.close(); $('#txtbankbalance').focus(); });
    }
    else if (entrydate == "") {
        swal('Alert', 'Please enter date', 'error').then(function () { swal.close(); $('#txtentrydate').focus(); });
    }
   
    else {
        var obj = {
            name: name,
            type: type,
            detail_type: detailtype,
            debit: debit,
            credit: credit,
            entry_date: entrydate,
        }
        $.ajax({
            url: '/Accounting/AddChartOfAccountEntry/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            searching: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success').then((result) => { location.href = '../../Accounting/ChartAccountEntryList'; });
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

function UpdateChartOfAccountEntry() {
    var id = $("#hfid").val();
    var name = $("#ddlname").val();
    var type = $("#ddltype").val();
    var detailtype = $("#ddldetailtype").val();
    var debit = $("#txtbalance").val();
    var credit = $("#txtbankbalance").val();
    var entrydate = $("#txtentrydate").val();

    if (name == "0") {
        swal('Alert', 'Please select name', 'error').then(function () { swal.close(); $('#ddlname').focus(); });
    }
    else if (type == "0") {
        swal('Alert', 'Please select type', 'error').then(function () { swal.close(); $('#ddltype').focus(); });
    }
    else if (detailtype == "0") {
        swal('Alert', 'Please select detail type', 'error').then(function () { swal.close(); $('#ddldetailtype').focus(); });
    }
    else if (debit == "") {
        swal('Alert', 'Please enter debit amount', 'error').then(function () { swal.close(); $('#txtbalance').focus(); });
    }
    else if (credit == "") {
        swal('Alert', 'Please enter credit amount', 'error').then(function () { swal.close(); $('#txtbankbalance').focus(); });
    }
    else if (entrydate == "") {
        swal('Alert', 'Please enter date', 'error').then(function () { swal.close(); $('#txtentrydate').focus(); });
    }

    else {
        var obj = {
            rowid: id,
            name: name,
            type: type,
            detail_type: detailtype,
            debit: debit,
            credit: credit,
            entry_date: entrydate,
        }
        $.ajax({
            url: '/Accounting/UpdateChartOfAccountEntry/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            searching: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success').then((result) => { location.href = '../../Accounting/ChartAccountEntryList'; });
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
    $("#ddlname").val("0");
    $("#ddltype").val("0");
    $("#ddldetailtype").val("0");
    $("#txtbalance").val("");
    $("#txtbankbalance").val("");
    $("#txtentrydate").val("");
}