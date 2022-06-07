
$(document).ready(function () { 
    GetAccount();
    $('#ddlAccount').change(function () {
        gettotal();
    });
    getfinaceyear();
    Banktransferlist(true);
    $(document).on("click", "#btntransfer", function (t) { t.preventDefault(); NewBankEntry(); });
    $(document).on("click", "#btnSearch", function (t) { t.preventDefault(); Banktransferlist(true); getGrandTotal(true); });
    getGrandTotal(true);
})

function getfinaceyear() {
    let fincyear = "";
    //  fincyear = getCurrentFinancialYear();
    $.ajax({
        url: "/Accounting/Getfinancialyear",
        type: "Get",
        success: function (data) {
            $('#ddlfinaceyear').empty();
            $('#ddlfinaceyear').append('<option value="">Please Select Financial Year</option>');
            for (var i = 0; i < data.length; i++) {
                if (data[i].Selected == true) {
                    $('#ddlfinaceyear').append('<option value="' + data[i].Value + '" selected>' + data[i].Text + '</option>');
                }
                else {
                    $('#ddlfinaceyear').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
                }

                // $("#ddlUser").empty().append('<option value="' + cus_id + '" selected>' + cus_text + '</option>');
            }
        }, async: false
    });
    //if ($('#ddlfinaceyear') == 1)

}
function GetAccount() {
    $.get('GetAccount', function (data) {
        var items = "";
        $('#ddlAccount').empty();
        items += $("<option value=''>Please select</option>").appendTo("#ddlAccount");
        $.each(data, function (index, value) {
            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlAccount");
        })
        $('#ddlAccount').bind(items);

        $('#ddlAccountsearch').empty();
        items += $("<option value=''>Please select</option>").appendTo("#ddlAccountsearch");
        $.each(data, function (index, value) {
            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlAccountsearch");
        })
        $('#ddlAccountsearch').bind(items);
    })
};

function gettotal() { 
    var ID = $('#ddlAccount').val();
    var obj = { strVal: ID }
    $.ajax({
        url: '/Accounting/GetTotalAmountByID/' + ID,
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var i = JSON.parse(data);
            //console.log(i[0].total);
            if (i[0].total == null)
                $("#txttotalamt").val('0.00');
            else
            $("#txttotalamt").val(i[0].total);
        },
        error: function (msg) { alert(msg); }
    });
}
function NewBankEntry() {
    let acountid = $("#hfid").val() || 0;
    let flag = 'I';
    let totalamt = $("#txttotalamt").val() || 0;
    let bankfee = $("#txtbankfee").val() || 0;
    let Account = parseInt($("#ddlAccount").val()) || 0;
    let merchantfee = $("#txtmerchantfee").val() || 0;
    let transferAccount = parseInt($("#ddltransferAccount").val()) || 0;
    if (acountid > 0) {
        flag = 'U';
        totalamt = '999999999999';
    }
    if (totalamt = 0) { swal('alert', 'Please enter total amount', 'error').then(function () { swal.close(); $('#txttotalamt').focus(); }) }
    else if (bankfee <= 0) { swal('alert', 'Please enter bank transfer fee', 'error').then(function () { swal.close(); $('#txtbankfee').focus(); }) }
    else if (Account <= 0) { swal('alert', 'Please select account.', 'error').then(function () { swal.close(); $('#ddlAccount').focus(); }) }
   // else if (merchantfee > 0) { swal('alert', 'Please enter merchant fee', 'error').then(function () { swal.close(); $('#txtmerchantfee').focus(); }) }
    else if (parseFloat(totalamt) < parseFloat(bankfee) + parseFloat(merchantfee)) { swal('alert', 'Please enter less amount from total amount', 'error').then(function () { swal.close(); $('#txtmerchantfee').focus(); }) }
    else {
        let option = { strValue1: Account, strValue2: transferAccount, strValue3: '0', strValue4: '0', strValue5: bankfee, strValue6: merchantfee, SortCol: acountid, SortDir: flag}
        //console.log(option, _order, _list); return;
        swal.queue([{
            title: '', confirmButtonText: 'Yes, update it!', text: "Do you want to funds deposited from merchant to bank?",
            showLoaderOnConfirm: true, showCancelButton: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    $.post('/Accounting/NewBankEntry', option).done(function (result) {
                        result = JSON.parse(result);
                        if (result[0].Response == "Success") {                       
                            swal('Success', 'Funds deposited from merchant to bank successfully.', "success").then(function () { $("#txttotalamt").val(''); $("#txtbankfee").val(''); $("#txtmerchantfee").val(''); $("#ddlAccount").val(''); Banktransferlist(true); getGrandTotal(true); } );
                        }
                        else if (result[0].Response == "update") {
                            swal('Success', 'Funds deposited from merchant to bank successfully update.', "success").then(function () { $("#txttotalamt").val(''); $("#txtbankfee").val(''); $("#txtmerchantfee").val(''); $("#ddlAccount").val(''); Banktransferlist(true); getGrandTotal(true); });
                        }
                        else { swal('Error', 'Something went wrong, please try again.', "error"); }
                    }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
                });
            }
        }]);
    }
}
function Banktransferlist(isdate) {  
    let sd = $("#ddlfinaceyear").val();
    var account_num = $("#ddlAccountsearch").val();
    var obj = { strValue1: sd, strValue2: account_num }
    var table_EL = $('#banktansfer').DataTable({
        columnDefs: [  { 'visible': false, 'targets': [1] }] ,
        order: [[0, "desc"],[2, "asc"]], ordering: true, destroy: true, bProcessing: true, bServerSide: false, bAutoWidth: false, searching: true, responsive: true, lengthMenu: [[20, 30, 50], [20, 30, 50]],
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#banktansfer_filter input').unbind();
            $('#banktansfer_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        //footerCallback: function (row, data, start, end, display) {
        //    var api = this.api(), data;
        //    var intVal = function (i) { return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0; };

        //    let DebitTotal = api.column(6, { page: 'current' }).data().reduce(function (a, b) { return intVal(a) + intVal(b); }, 0);
        //    let CreditTotal = api.column(7, { page: 'current' }).data().reduce(function (a, b) { return intVal(a) + intVal(b); }, 0);

        //    $(api.column(0).footer()).html('Page Total');
        //    $(api.column(6).footer()).html('$' + numberRenderer(DebitTotal));
        //    $(api.column(7).footer()).html('$' + numberRenderer(CreditTotal));
        //    //console.log(DebitTotal, CreditTotal);
        //},
        ajax: {
            url: '/Accounting/Banktransferlist', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { console.log(JSON.parse(data)); return JSON.parse(data); }
        },
        
        aoColumns: [
           
            { data: 'doc_date', title: 'Date', sWidth: "10%", class: 'text-left', render: function (data, type, full) { if (type === "sort" || type === 'type') { return data; } else return full.datecreation; } },
            { data: 'sort_no', title: '##', sWidth: "5%" },
            { data: 'inv_num', title: 'Transaction No.', sWidth: "15%" },
            { data: 'PO_SO_ref', title: 'Transaction Id', sWidth: "15%" },
            //{ data: 'label_operation', title: 'Operation Label', sWidth: "20%", render: function (data, type, full) { if (type === "sort" || type === 'type') { return full.sort_no; } else return data; } },
            { data: 'label_operation', title: 'Operation Label', sWidth: "15%" },
               { data: 'debit', title: 'Debit($)', sWidth: "5%", class: 'text-right text-bold', render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            //{ data: 'debit', title: 'Debit($)', sWidth: "5%", class: 'text-right text-bold' },
            { data: 'credit', title: 'Credit($)', sWidth: "5%", class: 'text-right text-bold', render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            {
                'data': 'inv_num', title: 'Action', sWidth: "2%", class: 'text-left',
                'render': function (id, type, full, meta) {
                    if (full.import_key == '11') {
                        return '<a href="#" title="Click here to edit transfer transaction ." onClick="EditData(' + id + ');" data-toggle="tooltip"><i class="glyphicon glyphicon-eye-open"></i></a>'
                    }
                    else {
                        return ' <b></b>';
                    }
                }
            }
        ],
      
    });
}
function EditData(id) { 
    $("#hfid").val(id);
    var ID = id;
    console.log($("#hfid").val());
    var obj = { strVal: id }
    $.ajax({
        url: '/Accounting/GetEditDataID/' + ID,
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            var i = JSON.parse(data);
            $('#ddlAccount').val(i[0].accountid).trigger('change');
            $('#txtbankfee').val(i[0].Transferamount);
            $('#txtmerchantfee').val(i[0].mercntfee);
            $('#ddlAccount').attr("disabled", true);
        },
        complete: function () { $("#loader").hide(); },
        error: function (msg) { alert(msg); }
    });
}
function getGrandTotal(is_date) {
    let sd = $("#ddlfinaceyear").val();
    var account_num = $("#ddlAccountsearch").val();
    var obj = { strValue1: sd, strValue2: account_num }    
    $.ajax({
        url: "/Accounting/Banktransfergrandtotal",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: obj,
        success: function (data) {
            var d = JSON.parse(data);
            if (d.length > 0) {
                if (parseInt(d[0].debit).toFixed(2) > 0 || parseInt(d[0].debit).toFixed(2) == 0) {
                    $("#txtdebit").text('$' + (d[0].debit)); $("#txtcredit").text('$' + (d[0].credit)); $("#txtbalance").text('$' + (d[0].balance))
                }
            }
        },
        error: function (msg) {

        }
    });
}