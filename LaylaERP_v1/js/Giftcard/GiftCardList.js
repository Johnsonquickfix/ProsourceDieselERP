﻿$(document).ready(function () {
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
        startDate: moment().add(-24, 'month'), autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto"
    }, function (start, end, label) {
        let order_type = $('#hfOrderType').val(); dataGCGridLoad(order_type);
    });
    dataGCGridLoad();

})
function isNullUndefAndSpace(variable) { return (variable !== null && variable !== undefined && variable !== 'undefined' && variable !== 'null' && variable.length !== 0); }
$('#txtOrderDate').val('');
$('#txtOrderDate').on('cancel.daterangepicker', function (ev, picker) { $(this).val(''); });
function dataGCGridLoad() {
    var order_type = '';
    var urlParams = new URLSearchParams(window.location.search);
    let searchText = urlParams.get('name') ? urlParams.get('name') : '';
    var monthYear = '', cus_id =  0;
    if ($('#filter-by-date').val() != "0") monthYear = $('#filter-by-date').val();
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    //if ($('#txtOrderDate').val() == '') { sd = ''; ed = '' };
    //let dfa = "'" + sd + "' and '" + ed + "'";
    let table = $('#dtGCdata').DataTable({
        oSearch: { "sSearch": searchText },
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[0, "desc"]],
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
        initComplete: function () {
            $('.dataTables_filter input').unbind();
            $('.dataTables_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/GiftCard/GetGiftCardOrderList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: sd });
            aoData.push({ name: "strValue2", value: ed });
            aoData.push({ name: "strValue3", value: (cus_id > 0 ? cus_id : '') });
            aoData.push({ name: "strValue4", value: order_type });
            var col = 'id';
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [
            {
                'data': 'id', sWidth: "5%   ",
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck(this);" value="' + $('<div/>').text(data).html() + '"><label></label>';
                }
            },
            { data: 'order_id', title: 'Order id', sWidth: "10%" },
            { data: 'code', title: 'Code', sWidth: "16%" },
            { data: 'remaining', title: 'Balance', sWidth: "10%" },
            { data: 'status', title: 'Status', sWidth: "10%" },
            { data: 'delivery', title: 'Delivery', sWidth: "10%" },
            { data: 'sender', title: 'From', sWidth: "10%" },
            { data: 'recipient', title: 'To', sWidth: "12%" },
            { data: 'expires', title: 'Expires', sWidth: "5%" },
            { data: 'create_date', title: 'Creation Date', sWidth: "12%" },
        ]
    });
}

function GetMonths() {
    var d1 = new Date('01-01-2020');
    var d2 = new Date();
    var ydiff = d2.getYear() - d1.getYear();
    var mdiff = d2.getMonth() - d1.getMonth();
    var diff = (ydiff * 12 + mdiff);

    $("#filter-by-date").html('<option value="0">All dates</option>');
    for (i = 0; i <= diff; i++) {
        //console.log(d2);
        if (i == 0)
            d2.setMonth(d2.getMonth());
        else
            d2.setMonth(d2.getMonth() - 1);
        $("#filter-by-date").append('<option value="' + moment(d2).format("YYYYMM") + '">' + moment(d2).format("MMM YY") + '</option>');
    }
    $("#filter-by-date").select2();
}
function orderStatus() {
    let id = "";
    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        id += $(this).val() + ",";
    });
    id = id.replace(/,(?=\s*$)/, '');
    $("#checkAll").prop('checked', false);
    let status = $('#ddlOrderStatus').val();

    if (id == "") { swal('alert', 'Please select a gift card', 'error'); }
    if (status == "") { swal('alert', 'Please select status', 'error'); }

    swal.queue([{
        title: 'Alert!', confirmButtonText: 'Yes, Update it!', text: "Do you want to change your order status?",
        showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                let obj = { strVal: id, status: status }
                $.post('/GiftCard/ChangeGiftCardStatus', obj)
                    .done(function (data) {
                        if (data.status) {
                            swal.insertQueueStep(data.message);
                            //GetOrderDetails(); let order_type = $('#hfOrderType').val(); dataGridLoad(order_type, true);
                        }
                        else { swal.insertQueueStep('something went wrong!'); }
                        resolve();
                    })
            })
        }
    }]);
}
function CheckAll() {
    debugger
    var isChecked = $('#checkall').prop("checked");
    $('#dtGCdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
}
function Singlecheck(chk) {
    var isChecked = $(chk).prop("checked");
    var isHeaderChecked = $("#checkall").prop("checked");
    if (isChecked == false && isHeaderChecked)
        $("#checkall").prop('checked', isChecked);
    else {
        $('#dtdata tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkall").prop('checked', isChecked);
    }
}