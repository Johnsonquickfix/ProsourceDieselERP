﻿function UpdateConfig() {
    id = $("#hfid").val();
    basicemp = $("#chkbasic").prop("checked") ? 1 : 0;
    specialpay = $("#chkspecialpay").prop("checked") ? 1 : 0;
    washingallowance = $("#chkwashingallowance").prop("checked") ? 1 : 0;
    otherallowance = $("#chkotherallowance").prop("checked") ? 1 : 0;
    incentiveemp = $("#chkincentive").prop("checked") ? 1 : 0;
    ccaemp = $("#chkcca").prop("checked") ? 1 : 0;
    epfemp = $("#chkepf").prop("checked") ? 1 : 0;
    vpfemp = $("#chkvpf").prop("checked") ? 1 : 0;
    advancestaff = $("#chkadvancestaff").prop("checked") ? 1 : 0;
    advanceepf = $("#chkadvanceepf").prop("checked") ? 1 : 0;
    incometaxemp = $("#chkincometax").prop("checked") ? 1 : 0;
    insuranceemp = $("#chkinsurance").prop("checked") ? 1 : 0;
    loanemi = $("#chkloanemi").prop("checked") ? 1 : 0;
    empwalfare = $("#chkempwalfare").prop("checked") ? 1 : 0;
    imprestemp = $("#chkimprest").prop("checked") ? 1 : 0;
    miscrefund = $("#chkmiscrefund").prop("checked") ? 1 : 0;
    festivaladvance = $("#chkfestivaladvance").prop("checked") ? 1 : 0;
    hrapercent = $("#chkhrapercent").prop("checked") ? 1 : 0;
    hraslab = $("#chkhraslab").prop("checked") ? 1 : 0;
    hrapercentvalue = $("#txthrapercentvalue").val();

    if (id == "") {
        swal('Alert', 'Please Enter id', 'error').then(function () { swal.close(); $('#ddlproduct').focus(); });
    }

    else {
        var obj = {
            rowid:id,
            basic: basicemp,
            special_pay: specialpay,
            washing_allowance: washingallowance,
            other_allowance: otherallowance,
            incentive: incentiveemp,

            cca: ccaemp,
            epf: epfemp,
            vpf: vpfemp,
            adv_staff: advancestaff,
            adv_epf: advanceepf,

            incometax: incometaxemp,
            insurance: insuranceemp,
            loan_emi: loanemi,
            emp_walfare: empwalfare,
            imprest: imprestemp,

            misc_refund: miscrefund,
            festival_adv: festivaladvance,
            hra_percent: hrapercent,
            hra_slab: hraslab,
            hra_percent_value: hrapercentvalue,
        }
        $.ajax({
            url: '/Hrms/UpdateConfigSetting/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
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

function AddDA() {
    darate1 = $("#txtdarate1").val();
    darate2 = $("#txtdarate2").val();
    darateothers = $("#txtdarateothers").val();
    fromdate = $("#txtfromdate").val();

    var formattedDate = new Date(fromdate);
    var d = formattedDate.getDate();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    var y = formattedDate.getFullYear();
    var date_created = y + "-" + m + "-" + d;

    if (darate1 == "") {
        swal('Alert', 'Please Enter DA office', 'error').then(function () { swal.close(); $('#txtdarate1').focus(); });
    }
    else if (darate2 == "") {
        swal('Alert', 'Please Enter DA Field', 'error').then(function () { swal.close(); $('#txtdarate2').focus(); });
    }
    else if (darateothers == "") {
        swal('Alert', 'Please Enter DA others', 'error').then(function () { swal.close(); $('#txtdarateothers').focus(); });
    }
    else if (fromdate == "") {
        swal('Alert', 'Please Enter Date', 'error').then(function () { swal.close(); $('#txtfromdate').focus(); });
    }
    else {
        var obj = {
            da_rate1: darate1,
            da_rate2: darate2,
            da_rate_others: darateothers,
            from_date: date_created,
        }
        $.ajax({
            url: '/Hrms/AddDaDetails', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
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