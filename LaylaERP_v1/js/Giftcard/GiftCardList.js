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
        startDate: moment().add(-24, 'month'), autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto"
    }, function (start, end, label) {
        let order_type = $('#hfOrderType').val(); dataGCGridLoad();
    });
    dataGCGridLoad();
    $("#ddlUser").select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Redeemed by Customer...",
        ajax: {
            url: '/GiftCard/GetRedeemedCustomerList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) {  return { text: item.displayname, name: item.displayname, id:item.id } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });

})

function isNullUndefAndSpace(variable) { return (variable !== null && variable !== undefined && variable !== 'undefined' && variable !== 'null' && variable.length !== 0); }
$('#txtOrderDate').val('');
$('#txtOrderDate').on('cancel.daterangepicker', function (ev, picker) { $(this).val(''); });


$("#btnOtherFilter").click(function () {
    dataGCGridLoad();
    $('#ddlUser').empty();
})

function dataGCGridLoad() {
    var order_type = '';
    var urlParams = new URLSearchParams(window.location.search);
    let searchText = urlParams.get('name') ? urlParams.get('name') : '';
    var monthYear = '', cus_id = $('#ddlUser').text().trim();
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
            aoData.push({ name: "strValue3", value: cus_id });
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
            { data: 'code', title: 'Code', sWidth: "18%" },
            {
                data: 'remaining', title: 'Balance', sWidth: "5%",
                'render': function (data, type, full) {
                    return '$' + parseFloat(data).toFixed(2);
                }
            },
            { data: 'status', title: 'Status', sWidth: "7%" },
            { data: 'delivery', title: 'Delivery', sWidth: "7%" },
            { data: 'sender', title: 'From', sWidth: "10%" },
            { data: 'recipient', title: 'To', sWidth: "10%" },
            { data: 'RedeemedBy', title: 'Redeemed By', sWidth: "12%" },
            
            { data: 'expires', title: 'Expires', sWidth: "5%" },
            {
                data: 'payment_method_title', title: 'Payment Method', sWidth: "5%", render: function (id, type, row) {
                    let pm_title = isNullUndefAndSpace(row.payment_method_title) ? row.payment_method_title : "";
                    if (row.status != 'wc-cancelled' && row.status != 'wc-failed' && row.status != 'wc-cancelnopay') {
                        if (row.payment_method == 'ppec_paypal' && row.paypal_status != 'COMPLETED') return ' <a href="javascript:void(0);" data-toggle="tooltip" title="Check PayPal Payment Status." onclick="PaymentStatus(' + row.order_id.replace('#', '') + ',\'' + row.paypal_id + '\',\'' + row.sender_email + '\');">' + pm_title + '</a>';
                       // else if (row.payment_method == 'podium' && row.podium_status != 'PAID') return ' <a href="javascript:void(0);" data-toggle="tooltip" title="Check PayPal Payment Status." onclick="podiumPaymentStatus(' + row.id + ',\'' + row.podium_uid + '\',\'' + row.billing_email + '\');">' + pm_title + '</a>';
                        else return pm_title;
                    }
                    else return pm_title;
                }
            },
            { data: 'create_date', title: 'Creation Date', sWidth: "5%" },
            {
                'data': 'id', title: 'Action', sWidth: "6%",
                'render': function (id, type, row, meta) {
                  
                    return '<a href="ordermeta/' + id + '" data-toggle="tooltip" title="View/Edit Order"><i class="glyphicon glyphicon-eye-open"></i></a> '
                }
            }
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
function giftcardStatus() {
    let id = "";
    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        id += $(this).val() + ",";
    });
    id = id.replace(/,(?=\s*$)/, '');
    $("#checkall").prop('checked', false);
    let status = $('#ddlOrderStatus').val();

    if (id == '') { swal('alert', 'Please select a gift card', 'error'); return; }
    console.log(id);
    if (status == '') { swal('alert', 'Please select status', 'error'); }

    swal.queue([{
        title: 'Alert!', confirmButtonText: 'Yes, Update it!', text: "Do you want to change your Gift Card status?",
        showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                let obj = { strValue1: id, strValue2: status }
                $.post('/GiftCard/ChangeGiftCardStatus', obj)
                    .done(function (data) {
                        if (data.status) {
                            swal.insertQueueStep(data.message);
                            //GetOrderDetails(); let order_type = $('#hfOrderType').val(); dataGridLoad(order_type, true);
                        dataGCGridLoad();
                        }
                        else { swal.insertQueueStep('something went wrong!'); }
                        resolve();
                    })
            })
        }
    }]);
}
function CheckAll() {
    var isChecked = $('#checkall').prop("checked");
    $('#dtGCdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
}
function Singlecheck(chk) {
    var isChecked = $(chk).prop("checked");
    var isHeaderChecked = $("#checkall").prop("checked");
    if (isChecked == false && isHeaderChecked)
        $("#checkall").prop('checked', isChecked);
    else {
        $('#dtGCdata tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkall").prop('checked', isChecked);
    }
}

//Check PayPal Payment Status.
function PaymentStatus(oid, pp_id, email) {
    console.log(oid, pp_id, email);
    paypal_baseurl = 'https://api-m.sandbox.paypal.com';
    let option = { strValue1: 'getToken' };
    $.ajax({ method: 'get', url: '/Setting/GetPayPalToken', data: option }).done(function (result, textStatus, jqXHR) {
        let access_token = result.message;
        let create_url = paypal_baseurl + '/v1/invoicing/invoices/' + pp_id;
        $.ajax({
            type: 'get', url: create_url, contentType: "application/json; charset=utf-8", dataType: "json", data: {},
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("Authorization", "Bearer " + access_token);
            },
            success: function (data) {
                let status = data.status;
                if (status == 'PAID') {
                    swal.queue([{
                        title: status, confirmButtonText: 'Yes, Update it!', text: "Your Payment has been received. Do you want to update your status?", showLoaderOnConfirm: true, showCloseButton: true, showCancelButton: true,
                        preConfirm: function () {
                            return new Promise(function (resolve) {
                                let _paystatus = [{ post_id: oid, meta_key: '_paypal_status', meta_value: 'COMPLETED' }];
                                let opt = { order_id: oid, b_first_name: '', order_itemmetaXML: JSON.stringify(_paystatus) };
                                $.post('/GiftCard/UpdatePaypalPaymentAccept', opt).done(function (data) {
                                    console.log(data);
                                    data = JSON.parse(data);
                                    if (data[0].Response == "Success") {
                                        swal.insertQueueStep({ title: 'Success', text: 'Status updated successfully.', type: 'success' }); $('#dtGCdata').DataTable().ajax.reload();//order_Split(oid, email);
                                    }
                                    else { swal.insertQueueStep({ title: 'Error', text: data.message, type: 'error' }); }
                                    resolve();
                                });
                            });
                        }
                    }]);
                }
                else {
                    swal(status, 'Request has been sent for payment.', 'info');
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); console.log(XMLHttpRequest); swal('Alert!', XMLHttpRequest.responseJSON.message, "error"); },
            complete: function () { $("#loader").hide(); }, async: false
        });
    }).fail(function (jqXHR, textStatus, errorThrown) {
        swal('Alert!', 'Something went wrong, please try again.', "error");
    });
}