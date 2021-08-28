getNatureofJournal();
getAccountingAccount();

function getAccountingAccount() {
    $.ajax({
        url: "/Bank/GetAccountingAccount",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please Select Accounting</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlaccounting').html(opt);
        }

    });
}

function getNatureofJournal() {
    $.ajax({
        url: "/Bank/Getjournal",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please Select Journal</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddljournal').html(opt);
        }

    });
}

function AddBankAccount() {
    debugger
    label = $("#txtbankcashlabel").val();
    accounttype = $("#txtaccounttype").val();
    status = $("#txtbankstatus").val();
    country = $("#txtaccountcountry").val();
    state = $("#txtstate").val();
    web = $("#txtweb").val();
    comment = $("#txtcomment").val();
    inital = $("#txtinitial").val();
    date = $("#txtdate").val();
    minallowbalance = $("#txtminallowbalance").val();
    desiredbalance = $("#txtdesiredbalance").val();
    bankname = $("#txtbankname").val();
    bankcode = $("#txtbankcode").val();
    accountnumber = $("#txtaccountnumber").val();
    iban = $("#txtIBAN").val();
    bic = $("#txtBIC").val();
    bankaddress = $("#txtbankaddress").val();
    ownername = $("#txtaccountowner").val();
    owneraddress = $("#txtowneraddress").val();
    accounting = $("#ddlaccounting").val();
    journal = $("#ddljournal").val();
    currency = $("#txtcurrency").val();

    var formattedDate = new Date(date);
    var d = formattedDate.getDate();
    //var m = formattedDate.getMonth();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    //m += 1;  // JavaScript months are 0-11
    var y = formattedDate.getFullYear();
    var date_created = y + "-" + m + "-" + d;


    if (label == "") {
        swal('Alert', 'Please Enter Bank or cash label', 'error').then(function () { swal.close(); $('#txtbankcashlabel').focus(); });
    }
    else if (state == "") {
        swal('Alert', 'Please Enter State', 'error').then(function () { swal.close(); $('#txtstate').focus(); });
    }

    else if (web == "") {
        swal('Alert', 'Please Enter Web Url', 'error').then(function () { swal.close(); $('#txtweb').focus(); });
    }
    else if (comment == "") {
        swal('Alert', 'Please Enter Comment', 'error').then(function () { swal.close(); $('#txtcomment').focus(); });
    }
    else if (inital == "") {
        swal('Alert', 'Please Enter Initial Amount', 'error').then(function () { swal.close(); $('#txtinitial').focus(); });
    }
    else if (date == "") {
        swal('Alert', 'Please Enter Date', 'error').then(function () { swal.close(); $('#txtdate').focus(); });
    }
    else if (minallowbalance == "") {
        swal('Alert', 'Please Enter Minimum Allow Balance', 'error').then(function () { swal.close(); $('#txtminallowbalance').focus(); });
    }
    else if (desiredbalance == "") {
        swal('Alert', 'Please Enter Minimum Desierd Balance', 'error').then(function () { swal.close(); $('#txtdesiredbalance').focus(); });
    }
    else if (bankname == "") {
        swal('Alert', 'Please Enter Bank Name', 'error').then(function () { swal.close(); $('#txtbankname').focus(); });
    }
    else if (bankcode == "") {
        swal('Alert', 'Please Enter Bank Code', 'error').then(function () { swal.close(); $('#txtbankcode').focus(); });
    }
    else if (accountnumber == "") {
        swal('Alert', 'Please Enter Account Number', 'error').then(function () { swal.close(); $('#txtaccountnumber').focus(); });
    }
    else if (iban == "") {
        swal('Alert', 'Please Enter IBAN number', 'error').then(function () { swal.close(); $('#txtIBAN').focus(); });
    }
    else if (bic == "") {
        swal('Alert', 'Please Enter BIC/SWAT code', 'error').then(function () { swal.close(); $('#txtBIC').focus(); });
    }
    else if (currency == "") {
        swal('Alert', 'Please Enter Currency Code', 'error').then(function () { swal.close(); $('#txtcurrency').focus(); });
    }
    else if (bankaddress == "") {
        swal('Alert', 'Please Enter Bank address', 'error').then(function () { swal.close(); $('#txtbankaddress').focus(); });
    }
    else if (ownername == "") {
        swal('Alert', 'Please Enter Owner Name', 'error').then(function () { swal.close(); $('#txtaccountowner').focus(); });
    }
    else if (owneraddress == "") {
        swal('Alert', 'Please Enter Owner Address', 'error').then(function () { swal.close(); $('#txtowneraddress').focus(); });
    }
    else if (accounting == "-1") {
        swal('Alert', 'Please Select accounting account', 'error').then(function () { swal.close(); $('#ddlaccounting').focus(); });
    }
    else if (journal == "-1") {
        swal('Alert', 'Please Select accounting code journal', 'error').then(function () { swal.close(); $('#ddljournal').focus(); });
    }
    
    else {

        var obj = {

            date_created: date_created,
            label: label,
            account_type: accounttype,
            working_status: status,
            country_iban: country,
            state: state,
            comment: comment,
            initial_balance: inital,
            min_allowed: minallowbalance,
            min_desired: desiredbalance,
            bank: bankname,
            code_bank: bankcode,
            account_number: accountnumber,
            owner_address: owneraddress,
            iban_prefix: iban,
            bic: bic,
            bank_address: bankaddress,
            owner_name: ownername,
            owner_address: owneraddress,
            accounting_number: accounting,
            fk_accountancy_journal: journal,
            url: web,
            currency_code: currency,
        }
        $.ajax({
            url: '/Bank/AddBankAccount/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    //$('#parent > input:text').val('');
                    swal('Alert!', data.message, 'success').then((result) => { location.href = '../BankAccountList'; });
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

function UpdateBankAccount() {
    debugger
    rowid=$("#hfid").val();
    label = $("#txtbankcashlabel").val();
    accounttype = $("#txtaccounttype").val();
    status = $("#txtbankstatus").val();
    country = $("#txtaccountcountry").val();
    state = $("#txtstate").val();
    web = $("#txtweb").val();
    comment = $("#txtcomment").val();
    inital = $("#txtinitial").val();
    date = $("#txtdate").val();
    minallowbalance = $("#txtminallowbalance").val();
    desiredbalance = $("#txtdesiredbalance").val();
    bankname = $("#txtbankname").val();
    bankcode = $("#txtbankcode").val();
    accountnumber = $("#txtaccountnumber").val();
    iban = $("#txtIBAN").val();
    bic = $("#txtBIC").val();
    bankaddress = $("#txtbankaddress").val();
    ownername = $("#txtaccountowner").val();
    owneraddress = $("#txtowneraddress").val();
    accounting = $("#ddlaccounting").val();
    journal = $("#ddljournal").val();
    currency = $("#txtcurrency").val();

    var formattedDate = new Date(date);
    var d = formattedDate.getDate();
    //var m = formattedDate.getMonth();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    //m += 1;  // JavaScript months are 0-11
    var y = formattedDate.getFullYear();
    var date_created = y + "-" + m + "-" + d;


    if (label == "") {
        swal('Alert', 'Please Enter Bank or cash label', 'error').then(function () { swal.close(); $('#txtbankcashlabel').focus(); });
    }
    else if (state == "") {
        swal('Alert', 'Please Enter State', 'error').then(function () { swal.close(); $('#txtstate').focus(); });
    }
    else if (web == "") {
        swal('Alert', 'Please Enter Web Url', 'error').then(function () { swal.close(); $('#txtweb').focus(); });
    }
    else if (comment == "") {
        swal('Alert', 'Please Enter Comment', 'error').then(function () { swal.close(); $('#txtcomment').focus(); });
    }
    else if (inital == "") {
        swal('Alert', 'Please Enter Initial Amount', 'error').then(function () { swal.close(); $('#txtinitial').focus(); });
    }
    else if (date == "") {
        swal('Alert', 'Please Enter Date', 'error').then(function () { swal.close(); $('#txtdate').focus(); });
    }
    else if (minallowbalance == "") {
        swal('Alert', 'Please Enter Minimum Allow Balance', 'error').then(function () { swal.close(); $('#txtminallowbalance').focus(); });
    }
    else if (desiredbalance == "") {
        swal('Alert', 'Please Enter Minimum Desierd Balance', 'error').then(function () { swal.close(); $('#txtdesiredbalance').focus(); });
    }
    else if (bankname == "") {
        swal('Alert', 'Please Enter Bank Name', 'error').then(function () { swal.close(); $('#txtbankname').focus(); });
    }
    else if (bankcode == "") {
        swal('Alert', 'Please Enter Bank Code', 'error').then(function () { swal.close(); $('#txtbankcode').focus(); });
    }
    else if (accountnumber == "") {
        swal('Alert', 'Please Enter Account Number', 'error').then(function () { swal.close(); $('#txtaccountnumber').focus(); });
    }
    else if (iban == "") {
        swal('Alert', 'Please Enter IBAN number', 'error').then(function () { swal.close(); $('#txtIBAN').focus(); });
    }
    else if (bic == "") {
        swal('Alert', 'Please Enter BIC/SWAT code', 'error').then(function () { swal.close(); $('#txtBIC').focus(); });
    }
    else if (currency == "") {
        swal('Alert', 'Please Enter Currency Code', 'error').then(function () { swal.close(); $('#txtcurrency').focus(); });
    }
    else if (bankaddress == "") {
        swal('Alert', 'Please Enter Bank address', 'error').then(function () { swal.close(); $('#txtbankaddress').focus(); });
    }
    else if (ownername == "") {
        swal('Alert', 'Please Enter Owner Name', 'error').then(function () { swal.close(); $('#txtaccountowner').focus(); });
    }
    else if (owneraddress == "") {
        swal('Alert', 'Please Enter Owner Address', 'error').then(function () { swal.close(); $('#txtowneraddress').focus(); });
    }
    else if (accounting == "-1") {
        swal('Alert', 'Please Select accounting account', 'error').then(function () { swal.close(); $('#ddlaccounting').focus(); });
    }
    else if (journal == "-1") {
        swal('Alert', 'Please Select accounting code journal', 'error').then(function () { swal.close(); $('#ddljournal').focus(); });
    }


    else {

        var obj = {
            rowid: rowid,
            date_created: date_created,
            label: label,
            account_type: accounttype,
            working_status: status,
            country_iban: country,
            state: state,
            comment: comment,
            initial_balance: inital,
            min_allowed: minallowbalance,
            min_desired: desiredbalance,
            bank: bankname,
            code_bank: bankcode,
            account_number: accountnumber,
            owner_address: owneraddress,
            iban_prefix: iban,
            bic: bic,
            bank_address: bankaddress,
            owner_name: ownername,
            owner_address: owneraddress,
            accounting_number: accounting,
            fk_accountancy_journal: journal,
            url: web,
            currency_code: currency,
        }
        $.ajax({
            url: '/Bank/UpdateBankAccount/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    //$('#parent > input:text').val('');
                    swal('Alert!', data.message, 'success').then((result) => { location.href = '../BankAccountList'; });
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