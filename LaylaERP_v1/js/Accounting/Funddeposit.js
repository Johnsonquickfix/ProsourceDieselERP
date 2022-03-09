
$(document).ready(function () { 
    GetAccount();
    $('#ddlAccount').change(function () {
        gettotal();
    });
    getfinaceyear();
    Banktransferlist(true);
    $(document).on("click", "#btntransfer", function (t) { t.preventDefault(); NewBankEntry(); });
    $(document).on("click", "#btnSearch", function (t) { t.preventDefault(); Banktransferlist(true); });
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
            console.log(i[0].total);
            if (i[0].total == null)
                $("#txttotalamt").val('0.00');
            else
            $("#txttotalamt").val(i[0].total);
        },
        error: function (msg) { alert(msg); }
    });
}
function NewBankEntry() {
    let totalamt = $("#txttotalamt").val() || 0;
    let bankfee = $("#txtbankfee").val() || 0;
    let Account = parseInt($("#ddlAccount").val()) || 0;
    let merchantfee = $("#txtmerchantfee").val() || 0;
    let transferAccount = parseInt($("#ddltransferAccount").val()) || 0;     
    if (totalamt <= 0) { swal('alert', 'Please enter total amount', 'error').then(function () { swal.close(); $('#txttotalamt').focus(); }) }
    else if (bankfee <= 0) { swal('alert', 'Please enter bank transfer fee', 'error').then(function () { swal.close(); $('#txtbankfee').focus(); }) }
    else if (Account <= 0) { swal('alert', 'Please select account.', 'error').then(function () { swal.close(); $('#ddlAccount').focus(); }) }
    else if (merchantfee <= 0) { swal('alert', 'Please enter merchant fee', 'error').then(function () { swal.close(); $('#txtmerchantfee').focus(); }) }
    else if (parseFloat(totalamt) < parseFloat(bankfee) + parseFloat(merchantfee)) { swal('alert', 'Please enter less amount from total amount', 'error').then(function () { swal.close(); $('#txtmerchantfee').focus(); }) }
    else {
        let option = { strValue1: Account, strValue2: transferAccount, strValue3: '0', strValue4: totalamt, strValue5: bankfee, strValue6: merchantfee}
        //console.log(option, _order, _list); return;
        swal.queue([{
            title: '', confirmButtonText: 'Yes, update it!', text: "Do you want to funds deposited from merchant to bank?",
            showLoaderOnConfirm: true, showCancelButton: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    $.post('/Accounting/NewBankEntry', option).done(function (result) {
                        result = JSON.parse(result);
                        if (result[0].Response == "Success") {                       
                            swal('Success', 'Funds deposited from merchant to bank successfully.', "success").then(function () { $("#txttotalamt").val(''); $("#txtbankfee").val(''); $("#txtmerchantfee").val(''); $("#ddlAccount").val(''); Banktransferlist(true); } );
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
   // let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    //let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';
  //  var numberRenderer = $.fn.dataTable.render.number(',', '.', 2,).display;
    var account_num = $("#ddlAccountsearch").val();
    var obj = { strValue1: sd, strValue2: account_num }
    var table_EL = $('#banktansfer').DataTable({
        columnDefs: [  { 'visible': false, 'targets': [1] }] ,
        order: [[0, "desc"],[1, "asc"]], ordering: true, destroy: true, bProcessing: true, bServerSide: false, bAutoWidth: false, searching: true, responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
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
        /*
        sAjaxSource: "/Accounting/AccountJournalList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            aoData.push({ name: "strValue2", value: dfa });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            //var col = 'id';
            //if (oSettings.aaSorting.length >= 0) {
            //    var col = oSettings.aaSorting[0][0] == 0 ? "inv_num" : oSettings.aaSorting[0][0] == 1 ? "code_journal" : oSettings.aaSorting[0][0] == 2 ? "datecreation" : oSettings.aaSorting[0][0] == 3 ? "PO_SO_ref" : oSettings.aaSorting[0][0] == 4 ? "inv_complete" : oSettings.aaSorting[0][0] == 5 ? "name" : oSettings.aaSorting[0][0] == 6 ? "label_operation" : oSettings.aaSorting[0][0] == 7 ? "debit" : oSettings.aaSorting[0][0] == 8 ? "credit" : oSettings.aaSorting[0][0] == 9 ? "datesort" : "id";
            //    aoData.push({ name: "sSortColName", value: col });
            //}
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },*/
        aoColumns: [
            //{ data: 'inv_num', title: 'Num Transcation', sWidth: "5%" },
            //{ data: 'datesort', title: 'Date', sWidth: "10%", class: 'text-left', render: function (data, type, full) { if (type === "sort" || type === 'type') { return data; } else return full.datecreation; } },
            //{ data: 'code_journal', title: 'Journal', sWidth: "5%", render: function (data, type, full) { if (type === "sort" || type === 'type') { return full.sort_no; } else return data; } },
            //{
            //    data: 'PO_SO_ref', title: 'Accounting Doc', sWidth: "15%",
            //    'render': function (inv_num, type, full, meta) {
            //        if (full.code_journal == "AC") return '' + inv_num + '<span title="Click here to view order preview" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="getPurchaseOrderPrint(' + full.inv_num + ', false);"><i class="fas fa-search-plus"></i></a></span>';
            //        else return '' + inv_num + '<a href="#" onclick="PurchaseSalesPrint(' + full.inv_num + ',\'' + full.datecreation + '\');"><i class="fas fa-search-plus"></i></a>';
            //        //return '<a href="NewReceiveOrder/' + full.id + '">' + id + '</a> <a href="#" onclick="getPurchaseOrderPrint(' + full.id + ', false);"><i class="fas fa-search-plus"></i></a>';
            //    }
            //},
            //{ data: 'rowid', title: '#', sWidth: "5%" },
         
            { data: 'doc_date', title: 'Date', sWidth: "10%", class: 'text-left', render: function (data, type, full) { if (type === "sort" || type === 'type') { return data; } else return full.datecreation; } },
            { data: 'sort_no', title: '##', sWidth: "5%" },
            { data: 'inv_num', title: 'Accounting Doc', sWidth: "15%" },
            //{ data: 'label_operation', title: 'Operation Label', sWidth: "20%", render: function (data, type, full) { if (type === "sort" || type === 'type') { return full.sort_no; } else return data; } },
            { data: 'label_operation', title: 'Operation Label', sWidth: "15%" },
               { data: 'debit', title: 'Debit($)', sWidth: "5%", class: 'text-right text-bold', render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            //{ data: 'debit', title: 'Debit($)', sWidth: "5%", class: 'text-right text-bold' },
            { data: 'credit', title: 'Credit($)', sWidth: "5%", class: 'text-right text-bold', render: $.fn.dataTable.render.number(',', '.', 2, '$') },
        ],
       // dom: 'lBftipr',
        //buttons: [
        //    {
        //        extend: 'csv', className: 'button', text: '<i class="fas fa-file-csv"></i> CSV',
        //        filename: function () {
        //            let d = new Date(); let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
        //            return 'Journals' + e;
        //        },
        //    },
        //    {
        //        extend: 'print',
        //        //title: '<h3 style="text-align:center">Layla Sleep Inc.</h3><br /><h3 style="text-align:left">Chart of accounts</h3>',
        //        title: '', className: 'button', text: '<i class="fas fa-file-csv"></i> Print', footer: false,
        //        exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7], },
        //        filename: function () {
        //            let d = new Date(); let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
        //            return 'Account Journal' + e;
        //        },
        //        messageTop: function () { return '<h3 style = "text-align:center"> Layla Sleep Inc.</h3 ><br /><h3 style="text-align:left">Account journals</h3>'; },
        //    }
        //],
    });
}