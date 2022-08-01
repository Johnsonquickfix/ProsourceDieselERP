$(document).ready(function () {
    $("#loader").hide(); $(".select2").select2();
    $('#txtEndingDate').daterangepicker({ singleDatePicker: true, autoUpdateInput: true, minDate: '01/01/2022', locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' } });
    //$('#txtEndingDate').datepicker({ format: 'mm/dd/yyyy', autoclose: true, todayHighlight: true });
    //let today = new Date();
    //$('#txtEndingDate').val();
    $.when(getbankaccount()).done(function () { });

    $(document).on('change', "#ddlaccount", function (t) { t.preventDefault(); getdata(); })
    $(document).on('click', "#btnreconciling", function (t) { t.preventDefault(); reconciling(); })

    $("#txtEndingbalance").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.-]/g, ''));
        $this.val($this.val().substring(0, 10));
    });

});
function getbankaccount() {
    $('#ddlaccount').empty().append('<option value="0">Select Account</option>');
    $.ajax({
        url: "/PaymentInvoice/getbankaccount", type: "Get",
        success: function (data) {
            $.each(data, function (key, row) {
                $('#ddlaccount').append('<option value="' + row.Value + '">' + row.Text + '</option>');
            });
        }, async: false
    });
}

function getdata() {
    $("#hfvalconform,#lblbeginningbalance").val("0");
    $('#lblendingdata').text("01/31/2022");
    $('#lblbeginningbalance').data('id', 0); $('#lblbillNo').data('id', 0); $('#lblendingdata').data('id', '');
    $('#txtEndingDate').data('daterangepicker').setStartDate(moment());
    $('#txtEndingDate').data('daterangepicker').setEndDate(moment());
    $('#txtEndingDate').data('daterangepicker').minDate = moment('01/01/2022', 'MM/DD/YYYY');
    //$('#txtEndingDate').daterangepicker({ startDate: moment(), endDate: moment(), minDate: '01/01/2022' });
    let ID = $("#ddlaccount").val();
    let obj = { strVal: ID }
    $.ajax({
        url: '/Accounting/GetDataByID/' + ID, type: 'post', contentType: "application/json; charset=utf-8", dataType: 'JSON',
        beforeSend: function (xhr) { $("#loader").show(); },
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            $.each(data, function (key, row) {
                $('#lblbeginningbalance').data('id', row.bank_ending_balance);
                $('#lblbeginningbalance').text(row.bank_ending_balance);
                $('#lblbillNo').data('id', row.rowid);
                $("#hfvalconform").val(row.bank_reconciliation);

                $('#lblendingdata').data('id', row.ending_date);
                $('#lblendingdata').text(row.ending_date);
                //$('#txtEndingDate').daterangepicker({ startDate: moment(), endDate: moment(), minDate: row.ending_date });
                $('#txtEndingDate').data('daterangepicker').setStartDate(moment());
                $('#txtEndingDate').data('daterangepicker').setEndDate(moment());
                $('#txtEndingDate').data('daterangepicker').minDate = moment(row.ending_date, 'MM/DD/YYYY');
            });
        },
        error: function (msg) { $("#loader").hide(); alert(msg); }, complete: function () { $("#loader").hide(); },
        async: false
    });

}

function reconciling() {
    // ID = $("#hfid").val();     
    //console.log('ll');
    acountID = $("#ddlaccount").val();
    beginningbalanceval = $('#lblbeginningbalance').text();
    endingdata = $('#lblendingdata').text();
    endingdatetex = $("#txtEndingDate").val();
    endingbal = $("#txtEndingbalance").val();
    accountname = $("#ddlaccount option:selected").text();
    bankreon = $("#hfvalconform").val();
    let id = parseInt($('#lblbillNo').data('id')) || 0;
    //console.log(id);
    let sd = $("#txtEndingDate").val();
    if (acountID == 0) {
        swal('Alert', 'Please select account.', 'error').then(function () { swal.close(); $('#ddlaccount').focus(); });
    }
    else if (endingbal == '') {
        swal('Alert', 'Please enter ending balance.', 'error').then(function () { swal.close(); $('#txtEndingbalance').focus(); });
    }
    else if (endingdatetex == '') {
        swal('Alert', 'Please enter ending date.', 'error').then(function () { swal.close(); $('#txtEndingDate').focus(); });
    }
    else if (endingdata >= endingdatetex) {
        swal('Alert', 'Already reconciliation done for this date.Please enter another date.', 'error').then(function () { swal.close(); $('#txtEndingDate').focus(); });
    }
    //else if (bankreon == 1) {
    //    swal('Alert', 'Already reconciliation done.', 'error').then(function () { swal.close(); $('#txtEndingDate').focus(); });
    //}
    else {
        swal({
            title: "", text: "Do you want to reconcile?", type: "warning", showCancelButton: true, confirmButtonColor: '#DD6B55', confirmButtonText: 'Yes, I do!', cancelButtonText: "No"
        }).then(function (isConfirm) {
            if (isConfirm.value) {
                var url = "/Accounting/BankReconciliationprocess?edate=" + sd + "&id=" + id + "&endbailance=" + endingbal + "&stdate=" + endingdata + "&accountname=" + accountname + "&accountid=" + acountID;
                window.location.href = url;
            }
        });
        return false;
    }
}