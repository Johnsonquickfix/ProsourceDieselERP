getNatureofJournal();
getAccountingAccount();
BankEntries();
BankEntriesList();

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
                    swal('Success!', data.message, 'success').then((result) => { location.href = '../BankAccountList'; });
                }
                else {
                    swal('Error!', data.message, 'error');
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
                    swal('Success!', data.message, 'success').then((result) => { location.href = '../BankAccountList'; });
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



$("#btnupload").click(function () {
    BankID = $("#hfid").val();
    var file = document.getElementById("ImageFile").files[0];
    var formData = new FormData();
    formData.append("ImageFile", file);
    formData.append("BankID", BankID);

    if (BankID == 0) {
        swal('Alert', 'Bank not found', 'error').then(function () { swal.close(); });
    }
    else {
        $.ajax({
            type: "POST",
            url: '/Bank/FileUpload/',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    BankLinkedFiles();
                    swal('Success!', data.message, 'success');
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



function BankLinkedFiles() {
    var urid = "";
    ID = $("#hfid").val();
    var sid = "";
    var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 50, sEcho: 1, SortCol: 'id', SortDir: 'desc', rowid: ID };
    $('#LinkedFiles').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        sPaginationType: "full_numbers", searching: false, ordering: true, lengthChange: true, "paging": true,
        bAutoWidth: false, scrollX: false,
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        sAjaxSource: "/Bank/GetBankLinkedFiles",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            //obj.Search = aoData[9].value;
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "FileName" : oSettings.aaSorting[0][0] == 1 ? "FileSize" : oSettings.aaSorting[0][0] == 2 ? "Date" : "id";
                obj.SortCol = col; obj.SortDir = oSettings.aaSorting.length >= 0 ? oSettings.aaSorting[0][1] : "desc";
            }
            obj.sEcho = aoData[0].value; obj.PageSize = oSettings._iDisplayLength; obj.PageNo = oSettings._iDisplayStart;
            $.ajax({
                type: "POST", url: sSource, async: true, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
                success: function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, iTotalRecords: data.iTotalRecords, iTotalDisplayRecords: data.iTotalDisplayRecords, aaData: JSON.parse(data.aaData) };
                    $('#lblAttachedFiles').text(data.iTotalRecords);
                    return fnCallback(dtOption);

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
                async: false
            });
        },
        aoColumns: [
            {
                'data': 'FileName', sWidth: "25%",
                'render': function (FileName, type, full, meta) {
                    return '<a target="popup" href="../../Content/BankLinkedFiles/' + FileName + '">' + FileName + ' <i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'FileSize', title: 'FileSize', sWidth: "25%" },
            { data: 'Date', title: 'Date', sWidth: "25%" },
            {
                'data': 'ID',
                'render': function (id, type, full, meta) {
                    return '<a href="#" onclick="DeleteBankLinkedFiles(' + id + ');"><i class="fas fa-trash-alt"></i></a>';
                }
            }
        ]
    });
}


function DeleteBankLinkedFiles(id) {
    RowID = $("#hfid").val();
    var result = confirm("Are you sure to delete this Linked File?");
    if (result) {
        var obj = { rowid: RowID, BankLinkedID: id, }
        $.ajax({
            url: '/Bank/DeleteBankLinkedFiles/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8", data: JSON.stringify(obj), dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success!', data.message, 'success');
                    BankLinkedFiles();
                }
                else { swal('Error!', data.message, 'error') }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })
    }
}


//---------------Entries------------------
function BankEntries() {
    var ID = $("#hfid").val();
    var obj = { id: ID }
    $.ajax({
        url: '/Bank/GetEntries',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        data: JSON.stringify(obj),
        success: function (data) {
            $('#entries').dataTable({
                lengthMenu: [[10, 20, 50], [10, 20, 50]],
                destroy: true,
                scrollX: false,
                language: {
                    lengthMenu: "_MENU_ per page",
                    zeroRecords: "Sorry no records found",
                    info: "Showing _START_ to _END_ of _TOTAL_ entries",
                    infoFiltered: "",
                    infoEmpty: "No records found",
                    processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
                },
                data: JSON.parse(data),
                "columns": [
                    { data: 'due_date', title: 'Due Date', sWidth: "10%" },
                    { data: 'description', title: 'Description', sWidth: "10%" },
                    { data: 'third_party', title: 'Third Party', sWidth: "20%" },
                    { data: 'credit', title: 'Credit', sWidth: "15%" },
                    { data: 'debit', title: 'Debit', sWidth: "15%" },
                    { data: 'balance', title: 'Balance', sWidth: "10%" },
                    
                ],


                "order": [[0, 'desc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });

}


function BankEntriesList() {
    var urid = $("#ddlSearchStatus").val();
    var ID = $("#hfid").val();
    var table_EL = $('#EmployeeListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': true, 'targets': [0] }], order: [[0, "asc"]],
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
            $('#EmployeeListdata_filter input').unbind();
            $('#EmployeeListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        footerCallback: function (row, data, start, end, display) {
            var api = this.api(), data;
            console.log(data);
            var intVal = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            var DebitTotal = api.column(7).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);

            var CreditTotal = api.column(8).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);

            $(api.column(0).footer()).html('Page Total');
            $(api.column(7).footer()).html('$' + parseFloat(DebitTotal).toFixed(2));
            $(api.column(8).footer()).html('$' + parseFloat(CreditTotal).toFixed(2));
            console.log(DebitTotal);
            console.log(CreditTotal);
        },

        sAjaxSource: "/Bank/BankEntriesList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            aoData.push({ name: "strValue2", value: ID });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "id" : oSettings.aaSorting[0][0] == 1 ? "operation_date" : oSettings.aaSorting[0][0] == 2 ? "value_date" : oSettings.aaSorting[0][0] == 3 ? "paymenttype" : oSettings.aaSorting[0][0] == 4 ? "num_payment" : oSettings.aaSorting[0][0] == 5 ? "vendor" : oSettings.aaSorting[0][0] == 6 ? "bankaccount" : oSettings.aaSorting[0][0] == 7 ? "debit" : oSettings.aaSorting[0][0] == 8 ? "credit" : "id";
                aoData.push({ name: "sSortColName", value: col });
            }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            { data: 'id', title: 'Ref', sWidth: "10%" },
            { data: 'operation_date', title: 'Operation Date', sWidth: "10%" },
            { data: 'value_date', title: 'Value Date', sWidth: "10%" },
            { data: 'paymenttype', title: 'Payment Type', sWidth: "10%" },
            { data: 'num_payment', title: 'Number', sWidth: "10%" },
            { data: 'vendor', title: 'Vendor Name', sWidth: "10%" },
            { data: 'bankaccount', title: 'Bank Account', sWidth: "10%" },
            { data: 'debit', title: 'Debit', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '') },
            { data: 'credit', title: 'Credit', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '') },
        ]
    });
}

//Bank All Entries
function AllBankEntriesList() {
    var urid = $("#ddlSearchStatus").val();
    var table_EL = $('#BankEntryListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': true, 'targets': [0] }], order: [[0, "asc"]],
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
            $('#BankEntryListdata_filter input').unbind();
            $('#BankEntryListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        footerCallback: function (row, data, start, end, display) {
            var api = this.api(), data;
            console.log(data);
            var intVal = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            var DebitTotal = api.column(7).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);

            var CreditTotal = api.column(8).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);

            $(api.column(0).footer()).html('Page Total');
            $(api.column(7).footer()).html('$' + parseFloat(DebitTotal).toFixed(2));
            $(api.column(8).footer()).html('$' + parseFloat(CreditTotal).toFixed(2));
            console.log(DebitTotal);
            console.log(CreditTotal);
        },


        sAjaxSource: "/Bank/AllBankEntriesList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "id" : oSettings.aaSorting[0][0] == 1 ? "operation_date" : oSettings.aaSorting[0][0] == 2 ? "value_date" : oSettings.aaSorting[0][0] == 3 ? "paymenttype" : oSettings.aaSorting[0][0] == 4 ? "num_payment" : oSettings.aaSorting[0][0] == 5 ? "vendor" : oSettings.aaSorting[0][0] == 6 ? "bankaccount" : oSettings.aaSorting[0][0] == 7 ? "debit" : oSettings.aaSorting[0][0] == 8 ? "credit" : "id";
                aoData.push({ name: "sSortColName", value: col });
            }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            { data: 'id', title: 'Ref', sWidth: "10%" },
            { data: 'operation_date', title: 'Operation Date', sWidth: "10%" },
            { data: 'value_date', title: 'Value Date', sWidth: "10%" },
            { data: 'paymenttype', title: 'Payment Type', sWidth: "10%" },
            { data: 'num_payment', title: 'Number', sWidth: "10%" },
            { data: 'vendor', title: 'Vendor Name', sWidth: "10%" },
            { data: 'bankaccount', title: 'Bank Account', sWidth: "10%" },
            { data: 'debit', title: 'Debit', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '') },
            { data: 'credit', title: 'Credit', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '') },
        ]
    });
}

function EntriesBalance() {
    $.ajax({
        url: "/Bank/GetBankEntriesBalance",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        success: function (data) {

            var d = JSON.parse(data);
            if (d.length > 0) {
                $("#txtdebit").text('$' + parseFloat(d[0].debit).toFixed(2));
                $("#txtcredit").text('$' + parseFloat(d[0].credit).toFixed(2));
                $("#txtbalance").text('$' + parseFloat(d[0].balance).toFixed(2))
            }
        },
        error: function (msg) {

        }
    });
}