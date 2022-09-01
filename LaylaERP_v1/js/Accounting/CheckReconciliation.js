$(document).ready(function () {
    $('#demo-1').Monthpicker();
    $('#btnerify').hide();
    $('#btreconciliation').hide();
    //$('#txtOrderDate').daterangepicker({
    //    ranges: {
    //        'Today': [moment(), moment()],
    //        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    //        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    //        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    //        'This Month': [moment().startOf('month'), moment().endOf('month')],
    //        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    //    },
    //    startDate: moment().subtract(1, 'month'), autoUpdateInput: true, alwaysShowCalendars: true,
    //    locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto"
    //},
    //    function (start, end, label) {
    //        //$.when(getbill()).done(function () { MiscBillGrid(); });
    //        //Checklist();
    //    }

    //);

    $('#btnerify').click(function () {
        Verify();
        
    })
    $('#btreconciliation').click(function () {
        Reconcile();

    })
    filldropdown();
    $(".select2").select2();


});

function filldropdown() {
    $.ajax({
        url: "/PaymentInvoice/GetPaymentType",
        type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            $("#ddlbankaccount").html('<option value="0">Select Account</option>');
            for (i = 0; i < dt['Table1'].length; i++) { $("#ddlbankaccount").append('<option value="' + dt['Table1'][i].id + '">' + dt['Table1'][i].text + '</option>'); }
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }
    });
}
function Checklist() {


    let sde = $('#demo-1').val();
    var firstdate = sde.replace('/', '/01/');
    var s = firstdate.substring(0, firstdate.indexOf('/'));
    var sss = sde.substr(sde.length - 4); 
    var month = s; // January  
    var date = new Date(sss, month - 1, 01);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // console.log(lastDay);
    var enddate = moment(lastDay).format('MM/DD/YYYY');
     

    let sd = firstdate; //$('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = enddate;//$('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');



    var account = $('#ddlbankaccount').val();
    $('#dtdata').DataTable({
        destroy: true, bProcessing: true, bServerSide: true,
        bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        sAjaxSource: "/CheckDeposit/CheckReconciliationList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: account }, { name: "strValue2", value: sd }, { name: "strValue3", value: ed }, { name: "strValue4", value: "0" });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", async: false, url: sSource, data: aoData,
                "success": function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [
            //{ data: 'id', title: '#', sWidth: "8%" },
            //{
            //    'data': 'check_status', sWidth: "2%   ", 'render': function (data, type, row) {
            //        if (data == 'C') return ' <b></b>'
            //        else if (data == 'R') return ' <b></b>'
            //        else return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + row.id + '"><label></label>';
            //    }
            //},
            {
                'data': 'check_status', sWidth: "2%   ", 'render': function (data, type, row) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + row.id + '"><label></label>';
                }
            },
            { data: 'date_creation', title: 'Check Date', sWidth: "10%" },
            { data: 'num_payment', sWidth: "10%", title: 'Check No', sWidth: "10%" },
            { data: 'payee', title: 'Payee', sWidth: "10%" },
            //{
            //    data: 'num_payment', title: 'Transaction Type', sWidth: "10%", render: function (data, type, row) {
            //        return 'Payment';
            //    }
            //},
            //{ data: 'Transmitter', title: 'Transmitter', sWidth: "10%" },
            { data: 'Bank', title: 'Check Details', sWidth: "10%" },
            { data: 'amount', title: 'Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            /*   { data: 'Status', title: 'Transaction', sWidth: "10%" }*/
            {
                data: 'check_status', title: 'Status', sWidth: "10%", render: function (data, type, row) {
                    if (data == 'C') return '<span class="badge bg-success">Clear</span>';
                    else if (data == 'U') return '<span class="badge bg-warning">Unclear</span>';
                    else if (data == 'R') return '<span class="badge bg-danger">Reject</span>';
                    else return '<span class="badge bg-info">None</span>';
                }
            }
            // {
            //     'data': 'num_payment', title: 'Action', sWidth: "5%",
            //    'render': function (id, type, row) {
            //        if (row.check_status != 'U')
            //            return ' <b></b>';
            //        else { 
            //                return '<a title="Click here to reject check" data-toggle="tooltip" href="Checkreconcilation/' + id + '" onclick="ActivityLog(\'reject check (' + id + ') in check list\',\'Checkreconcilation/' + id + '\');"><i class="glyphicon glyphicon-eye-open"></i></a>'
            //         }
            //    }
            //}

        ],
        columnDefs: [{ targets: [0], searchable: false , orderable:false }], order: [[1, "desc"]]
    });
}

function Verify() {
    //console.log('FDD');
    var table = $('#dtdata').DataTable();
    if (!table.data().any()) {
        swal('Alert', 'Should have check for verify on list', 'error');
    }
    else {
        //console.log('F');
        //let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
        //let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
        let sde = $('#demo-1').val();
        var firstdate = sde.replace('/', '/01/');
        var s = firstdate.substring(0, firstdate.indexOf('/'));
        var sss = sde.substr(sde.length - 4);
        var month = s; // January  
        var date = new Date(sss, month - 1, 01);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        // console.log(lastDay);
        var enddate = moment(lastDay).format('MM/DD/YYYY');


        let sd = firstdate; //$('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
        let ed = enddate;//$('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');

        var account = $('#ddlbankaccount').val();
        var obj = { strValue1: account, strValue2: sd, strValue3: ed }
        swal({ title: "", text: 'Would you like to verify of check list?', type: "question", showCancelButton: true })
            .then((result) => {
                if (result.value) {
                    $.ajax({
                        url: '/ImportOrderinvoice/Verifycheck/', dataType: 'json', type: 'Post',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(obj),
                        dataType: "json",
                        beforeSend: function () { $("#loader").show(); },
                        success: function (data) {
                            if (data.status == true) {
                                swal('Success!', data.message, 'success');
                                Checklist();
                                Verifystatus();
                            }
                            else { swal('Alert!', data.message, 'error') }
                        },
                        complete: function () { $("#loader").hide(); },
                        error: function (error) { swal('Error!', error.message, 'error'); },
                    })
                }
            });
       
    }
}
function endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

 
function Search() {

     
    let sd = $('#demo-1').val();
     console.log(sd,'0');
    var firstdate = sd.replace('/', '/01/');
    var s = firstdate.substring(0, firstdate.indexOf('/'));
    var sss = sd.substr(sd.length - 4);

    var month = s; // January 
    //console.log(firstdate, s, sss);
    var date = new Date(sss, month-1, 01); 
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
   // console.log(lastDay);
    var enddate = moment(lastDay).format('MM/DD/YYYY');
    //console.log(enddate); 
    var account = $('#ddlbankaccount').val();
    if (sd == '') { swal('Alert', 'Please enter month', 'error'); }
    else if (account == "0") { swal('Alert', 'Please select account', 'error'); }
    else {
       
        Checklist();
        Verifystatus();
        setTimeout(function () { Reconcilestatus(); }, 100);
      
       
    }
}

//function getbill() {
//    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
//    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
//    let option = { strValue1: sd, strValue2: ed };
//    $.ajax({
//        url: "/Reports/getbill", data: option, type: "Get", beforeSend: function () { $("#loader").show(); },
//        type: "Get",
//        success: function (data) {
//            var opt = '<option value="0">Please Select Bill</option>';
//            for (var i = 0; i < data.length; i++) {
//                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
//            }
//            $('#ddlbill').html(opt);
//        }

//    });
//}

function Verifystatus() {
    //let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    //let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let sde = $('#demo-1').val();
    var firstdate = sde.replace('/', '/01/');
    var s = firstdate.substring(0, firstdate.indexOf('/'));
    var sss = sde.substr(sde.length - 4);
    var month = s; // January  
    var date = new Date(sss, month - 1, 01);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // console.log(lastDay);
    var enddate = moment(lastDay).format('MM/DD/YYYY');


    let sd = firstdate; //$('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = enddate;//$('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    var account = $('#ddlbankaccount').val();
    let count = 0;
    var obj = { strValue1: account, strValue2: sd, strValue3: ed }
    $.ajax({
        url: '/CheckDeposit/Verifystatus/',
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            // $('#txtMerchantname').val(jobj[0].merchant_name);  
            count = jobj[0].countstatus;
            console.log(count);
            if (count > 0) {
                $('#btnerify').show();
                //$("#lblreconciliation").text('');
                $('#btreconciliation').hide();
            }
            else {
                $('#btnerify').hide();
                //$("#lblreconciliation").text('All check are reconciled between this date');
                $('#btreconciliation').show();
            }
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}

//CheckBoxes
$('#checkAll').click(function () {
    var isChecked = $(this).prop("checked");
    $('#dtdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
});

function Singlecheck() {
    var isChecked = $('#CheckSingle').prop("checked");
    var isHeaderChecked = $("#checkAll").prop("checked");
    if (isChecked == false && isHeaderChecked)
        $("#checkAll").prop('checked', isChecked);

    else {
        $('#dtdata tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkAll").prop('checked', isChecked);
    }
}

$("#Reject").click(function () {
    var ID = "";
    //var new_role = $("#grant_role").val();
    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        ID += $(this).val() + ",";

    });
    ID = ID.replace(/,(?=\s*$)/, '');

    if (ID == "") { swal('Alert', 'Please select check from list', 'error'); }
   // else if (new_role == "") { swal('Alert', 'Please select grant role', 'error'); }
    else {

        //if (new_role != "") {
            swal({
                title: '', text: "Do you want to change status of checks ?", type: 'warning', showCancelButton: true,
                confirmButtonColor: '#3085d6', cancelButtonColor: '#3085d6', confirmButtonText: 'Yes'
            }).then((result) => {
                if (result.value) {
                   // ActivityLog('check reject "' + reject + ' for" check id (' + ID + ')', '/Account/CheckReconciliation');
                   Rejectcheck(ID);
                    // console.log(ID);
                }
            })
       // }
    }
})

function Rejectcheck(ID) {
    user_status = $("#ddlstatus").val();
    var obj = {
        strVal: ID,
        user_status: user_status
    }
    $.ajax({
        url: '/CheckDeposit/Rejectcheck/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == true) {
                //swal('Alert!', data.message, 'success').then((result) => { GetUsersCount(); var role_type = $('#hfStatusType').val(); Datagrid(role_type, $("#hfroletype").val()); });
                swal('Success!', data.message, 'success').then((result) => { setTimeout(function () { Checklist(); Verifystatus(); }, 50);  });
               // location.reload();
            }
            else {
                swal('Alert!', data.message, 'error');
            }
        },
        error: function (error) {
            swal('Error!', 'something went wrong', 'error');
        },
    })
}

function Reconcile() {
    var table = $('#dtdata').DataTable();
    if (!table.data().any()) {
        swal('Alert', 'Should have check for verify on list', 'error');
    }
    else {
        swal({
            title: '', text: "Do you want to reconcile checks ?", type: 'warning', showCancelButton: true,
            confirmButtonColor: '#3085d6', cancelButtonColor: '#3085d6', confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {

        bank_id = $("#ddlbankaccount").val();

        let sde = $('#demo-1').val();
        var firstdate = sde.replace('/', '/01/');
        var month = firstdate.substring(0, firstdate.indexOf('/'));
        var year = sde.substr(sde.length - 4); 
        var obj = {
            strVal: sde,
            user_status: bank_id,
            SortCol: year,
            SortDir: month

        }
        $.ajax({
            url: '/CheckDeposit/Reconcile/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            success: function (data) {
                if (data.status == true) {
                    //swal('Alert!', data.message, 'success').then((result) => { GetUsersCount(); var role_type = $('#hfStatusType').val(); Datagrid(role_type, $("#hfroletype").val()); });
                    swal('Success!', data.message, 'success').then((result) => { setTimeout(function () { Checklist(); Verifystatus(); }, 50); });
                    // location.reload();
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
        })
            }
        })
    }
}


function Reconcilestatus() {
    let month = $('#demo-1').val(); 
    var account = $('#ddlbankaccount').val(); 
    var obj = { strValue1: account, strValue2: month}
    $.ajax({
        url: '/CheckDeposit/Reconcilestatus/',
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            count = jobj[0].countstatus; 
            if (count > 0) {
                $('#btnerify').hide();
                $('#btreconciliation').hide();
                $("#lblreconciliation").text('All check are reconciled between this date');
                $('#Reject').hide();
            }
            else {
                $('#Reject').show();
                $("#lblreconciliation").text('');
            }
             
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}

