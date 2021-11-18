$(document).ready(function () {
    $("#loader").hide();
    $('#txtOrderDate').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        startDate: moment().subtract(1, 'month'), autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto"
    },
 
    );
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

function Search() {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');

    var account = $('#ddlbankaccount').val();
   // var statusval = $("#ddlbankaccount :selected").text();
    //console.log(date_publish, status, statusval);
    if (account == "0") { swal('alert', 'Please select Account', 'error'); }
    //else if (date_publish == "" || date_publish == "undefined//undefined") {
    //    swal('Alert', 'Please Enter Reception Date', 'error').then(function () { swal.close(); $('#txtPublishDate').focus(); });
    //}
    else {
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
            sAjaxSource: "/CheckDeposit/GetCheckDepositList",
            fnServerData: function (sSource, aoData, fnCallback, oSettings) {
                aoData.push({ name: "strValue1", value: account }, { name: "strValue2", value: sd }, { name: "strValue3", value: ed });
                if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
                oSettings.jqXHR = $.ajax({
                    dataType: 'json', type: "GET", url: sSource, data: aoData,
                    "success": function (data) {
                        let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                        return fnCallback(dtOption);
                    }
                });
            },
            columns: [
                /*{ data: 'ref', title: 'Parent ID', sWidth: "8%" },*/
                {
                    'data': 'id', sWidth: "5%   ", 'render': function (data, type, row) {
                        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '"><label></label>';
                    }
                },
                //{
                //    data: 'ref', title: '#', sWidth: "12%", render: function (data, type, row) {
                //        //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                //        return '<a href="javascript:void(0);" class="pdetailspo-control" data-toggle="tooltip" title="Click here to show details."><i class="glyphicon glyphicon-plus-sign"></i></a> #' + row.ref + ' <a href="#" onclick="getPurchaseOrderPrint(' + row.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                //    }
                //},
                { data: 'date_creation', title: 'Check Reception  Date', sWidth: "10%" },
                { data: 'num_payment', sWidth: "10%", title: 'Check No', sWidth: "10%" },
                { data: 'Transmitter', title: 'Transmitter', sWidth: "10%" },
                { data: 'Bank', title: 'Check Details', sWidth: "10%" },
                { data: 'amount', title: 'Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') }
             /*   { data: 'Status', title: 'Transaction', sWidth: "10%" }*/
            ],
            columnDefs: [{ targets: [0], searchable: false }], order: [[1, "desc"]]
        });
    }
}

