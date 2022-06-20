function AccountCategoryList() {
    var ID = $("#hfid").val();
    var obj = { id: ID };
    //var numberRenderer = $.fn.dataTable.render.number(',', '.', 2,).display;
    var table_EL = $('#AccountCategoryListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': true, 'targets': [0] }], order: [[0, "asc"]],
        destroy: true, bProcessing: true, bServerSide: false, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[20, 50], [20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#AccountCategoryListdata_filter input').unbind();
            $('#AccountCategoryListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        /*sAjaxSource: "/Accounting/GetBalanceList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "id" : oSettings.aaSorting[0][0] == 1 ? "account" : oSettings.aaSorting[0][0] == 2 ? "debit" : oSettings.aaSorting[0][0] == 3 ? "credit" : oSettings.aaSorting[0][0] == 4 ? "balance" : "id";
                aoData.push({ name: "sSortColName", value: col });
            }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },*/
        ajax: {
            url: '/Accounting/GetAccountCategoryList', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { console.log(JSON.parse(data)); return JSON.parse(data); }
        },
        aoColumns: [
            { data: 'id', title: 'Id', sWidth: "5%" },
            { data: 'account_category', title: 'Account category', sWidth: "10%", class: "text-left" },
            {
                'data': 'id', sWidth: "8%",
                'render': function (id, type, full, meta) {
                    if ($("#hfEdit").val() == "1") {
                        return '<span title="Click here to edit account category." data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="EditSelect(' + id + ');"><i class="glyphicon glyphicon-pencil"></i></a></span>';
                    }
                    else { return "No permission" }
                }
            },
        ],
        //"dom": 'lBftipr',
    });
}

function AddAccountCategory() {
    accountcategory = $("#txtaccountcategory").val();
    if (accountcategory == "") {
        swal('Alert', 'Please enter account category', 'error').then(function () { swal.close(); $('#txtaccountcategory').focus(); });
    }
    else {
        var obj = {
            account_category: accountcategory,
        }
        $.ajax({
            url: '/Accounting/AddAccountCategory/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success');
                    ResetBox();
                    AccountCategoryList();
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () { $("#loader").hide(); isEdit(false); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })

    }

}

function EditSelect(id) {
    var obj = { strValue1: id }
    $.ajax({
        url: '/Accounting/GetAccountCategoryById/',
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            console.log(jobj[0].label);
            $("#hfid").val(jobj[0].rowid);
            $('#txtaccountcategory').val(jobj[0].account_category);

            $("#btnAdd").hide();
            $("#btnUpdate").show();

            isEdit(true);
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}

function UpdateAccountCategory() {
    accountcategory = $("#txtaccountcategory").val();
    id = $("#hfid").val();
    if (accountcategory == "") {
        swal('Alert', 'Please enter account category', 'error').then(function () { swal.close(); $('#txtaccountcategory').focus(); });
    }
    else {
        var obj = {
            rowid: id,
            account_category: accountcategory,
        }
        $.ajax({
            url: '/Accounting/UpdateAccountCategory/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success');
                    ResetBox();
                    AccountCategoryList();

                    $("#btnUpdate").hide();
                    $("#btnAdd").show();
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () {
                $("#loader").hide();
                isEdit(false);
            },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })

    }

}

function ResetBox() {
    $("#txtaccountcategory").val("");
    $("#hfid").val("");
}