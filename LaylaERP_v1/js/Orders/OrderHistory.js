$(document).ready(function () {
    $("#loader").hide();
    $(".subsubsub li a").click(function (e) {
        $('.subsubsub li a').removeClass('current');
        $(this).addClass('current');
    });
    //datePickers(
    //    moment().subtract(24, 'month').startOf('month'),moment().subtract(0, 'month').endOf('month'),
    //    $('#txtOrderDate'), 'YYYY-MM', true,
    //    {
    //        'This Month': [moment().startOf('month'), moment().endOf('month')],
    //        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    //        'Last Three Months': [moment().subtract(3, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    //        'Last Year': [moment().subtract(12, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    //    },
    //    true, true
    //);
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
        let order_type = $('#hfOrderType').val(); dataGridLoad(order_type, true);
    });
    //GetMonths();
    $("#ddlUser").select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Search Customer",
        ajax: {
            url: '/Orders/GetCustomerList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.displayname, name: item.displayname, id: item.id } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
    GetOrderDetails();
    var urlParams = new URLSearchParams(window.location.search);
    let order_type = urlParams.get('type') ? urlParams.get('type') : '';
    setTimeout(function () {
        if (order_type.length > 0) {
            $('.subsubsub li a').removeClass('current'); $('#wc-completed').addClass('current'); $('#hfOrderType').val(order_type);;
        }
        dataGridLoad(order_type, false)
    }, 50);
    //$("#loader").hide();
    $('#all').click(function () { var order_type = ""; $('#hfOrderType').val(order_type); dataGridLoad(order_type, true); });
    $('#mine').click(function () { var order_type = "mine"; $('#hfOrderType').val(order_type); dataGridLoad(order_type, true); });
    $('#draft').click(function () { var order_type = "draft"; $('#hfOrderType').val(order_type); dataGridLoad(order_type, true); });
    $('#wc-pending').click(function () { var order_type = "wc-pending"; $('#hfOrderType').val(order_type); dataGridLoad(order_type, true); });
    $('#wc-processing').click(function () { var order_type = "wc-processing"; $('#hfOrderType').val(order_type); dataGridLoad(order_type, true); });
    $('#wc-on-hold').click(function () { var order_type = "wc-on-hold"; $('#hfOrderType').val(order_type); dataGridLoad(order_type, true); });
    $('#wc-completed').click(function () { var order_type = "wc-completed"; $('#hfOrderType').val(order_type); dataGridLoad(order_type, true); });
    $('#wc-cancelled').click(function () { var order_type = "wc-cancelled"; $('#hfOrderType').val(order_type); dataGridLoad(order_type, true); });
    $('#wc-refunded').click(function () { var order_type = "wc-refunded"; $('#hfOrderType').val(order_type); dataGridLoad(order_type, true); });
    $('#wc-failed').click(function () { var order_type = "wc-failed"; $('#hfOrderType').val(order_type); dataGridLoad(order_type, true); });
    $('#btnOtherFilter').click(function () { var order_type = $('#hfOrderType').val(); dataGridLoad(order_type, true); });
});
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

///Get Order Counts
function GetOrderDetails() {
    var opt = { strValue1: '' };
    $.ajax({
        type: "POST", url: '/Orders/GetOrdersCount', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
        success: function (result) {
            var data = JSON.parse(result);
            if (data.length > 0) {
                $('#all').find(".count").text(number_format(data[0].AllOrder));
                $('#mine').find(".count").text(number_format(data[0].Mine));
                $('#draft').find(".count").text(number_format(data[0].Drafts));
                $('#wc-pending').find(".count").text(number_format(data[0].Pending));
                $('#wc-processing').find(".count").text(number_format(data[0].Processing));
                $('#wc-on-hold').find(".count").text(number_format(data[0].OnHold));
                $('#wc-completed').find(".count").text(number_format(data[0].Completed));
                $('#wc-cancelled').find(".count").text(number_format(data[0].Cancelled));
                $('#wc-refunded').find(".count").text(number_format(data[0].Refunded));
                $('#wc-failed').find(".count").text(number_format(data[0].Failed));
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });
}
function isNullUndefAndSpace(variable) { return (variable !== null && variable !== undefined && variable !== 'undefined' && variable !== 'null' && variable.length !== 0); }
function dataGridLoad(order_type, is_date) {
    var urlParams = new URLSearchParams(window.location.search);
    let searchText = urlParams.get('name') ? urlParams.get('name') : '';
    var monthYear = '', cus_id = (parseInt($('#ddlUser').val()) || 0);
    if ($('#filter-by-date').val() != "0") monthYear = $('#filter-by-date').val();
    //let dfa = "'" + $('#txtOrderDate').val().replace(' - ', '\' AND \'') + "'";

    //var dfa = $('#txtOrderDate').val().split('-');
    //let sd = dfa[0].split('/'); sd = "'" + sd[2].toString().trim() + '-' + sd[0].toString().trim() + '-' + sd[1].toString().trim() + "'";
    //let ed = dfa[1].split('/'); ed = "'" + ed[2].toString().trim() + '-' + ed[0].toString().trim() + '-' + ed[1].toString().trim() + "'";
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';


    let table = $('#dtdata').DataTable({
        oSearch: { "sSearch": searchText },
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
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
        sAjaxSource: "/Orders/GetOrderList",
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
                'data': 'id', sWidth: "7%   ",
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck(this);" value="' + $('<div/>').text(data).html() + '"><label></label>';
                }
            },
            { data: 'id', title: 'OrderID', sWidth: "8%", render: $.fn.dataTable.render.number('', '.', 0, '#') },
            {
                data: 'first_name', title: 'Name', sWidth: "14%", render: function (id, type, row) {
                    return row.first_name + ' ' + row.last_name;
                }
            },
            {
                data: 'billing_phone', title: 'Phone No.', sWidth: "10%", render: function (id, type, row) {
                    if (isNullUndefAndSpace(row.billing_phone)) return row.billing_phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3"); else "";
                }
            },
            { data: 'num_items_sold', title: 'No. of Items', sWidth: "10%" },
            {
                data: 'total_sales', title: 'Order Total', sWidth: "10%", render: function (id, type, row, meta) {
                    let sale_amt = parseFloat(row.total_sales) || 0.00, refund_amt = parseFloat(row.refund_total) || 0.00;
                    let amt = refund_amt != 0 ? '<span style="text-decoration: line-through;"> $' + sale_amt.toFixed(2) + '<br></span><span style="text-decoration: underline;"> $' + (parseFloat(sale_amt) + refund_amt).toFixed(2) + '</span>' : '$' + sale_amt.toFixed(2);
                    return amt;
                }
            },
            {
                data: 'status', title: 'Status', sWidth: "10%", render: function (data, type, row) {
                    if (data == 'wc-pending') return 'Pending payment';
                    else if (data == 'wc-processing') return 'Processing';
                    else if (data == 'wc-on-hold') return 'On hold';
                    else if (data == 'wc-completed') return 'Completed';
                    else if (data == 'wc-cancelled') return 'Cancelled';
                    else if (data == 'wc-refunded') return 'Refunded';
                    else if (data == 'wc-failed') return 'Failed';
                    else if (data == 'wc-cancelnopay') return 'Cancelled - No Payment';
                    else if (data == 'wc-pendingpodiuminv') return 'Pending Podium Invoice';
                    else if (data == 'wc-podium') return 'Order via Podium';
                    else if (data == 'draft') return 'draft';
                    else return '-';
                }
            },
            { data: 'date_created', title: 'Creation Date', sWidth: "12%" },
            {
                data: 'payment_method_title', title: 'Payment Method', sWidth: "11%", render: function (id, type, row) {
                    let pm_title = isNullUndefAndSpace(row.payment_method_title) ? row.payment_method_title : "";
                    if (row.status != 'wc-cancelled' && row.status != 'wc-failed' && row.status != 'wc-cancelnopay') {
                        if (row.payment_method == 'ppec_paypal' && row.paypal_status != 'COMPLETED') return ' <a href="javascript:void(0);" data-toggle="tooltip" title="Check PayPal Payment Status." onclick="PaymentStatus(' + row.id + ',\'' + row.paypal_id + '\',\'' + row.billing_email + '\');">' + pm_title + '</a>';
                        else if (row.payment_method == 'podium' && row.podium_status != 'PAID') return ' <a href="javascript:void(0);" data-toggle="tooltip" title="Check PayPal Payment Status." onclick="podiumPaymentStatus(' + row.id + ',\'' + row.podium_uid + '\',\'' + row.billing_email + '\');">' + pm_title + '</a>';
                        //if (row.payment_method == 'ppec_paypal') return ' <a href="javascript:void(0);" data-toggle="tooltip" title="Check PayPal Payment Status." onclick="PaymentStatus(' + row.id + ',\'' + row.paypal_id + '\');">' + row.payment_method_title + '</a>';
                        else return pm_title;
                    }
                    else return pm_title;
                }
            },
            {
                'data': 'id', title: 'Action', sWidth: "8%",
                'render': function (id, type, row, meta) {
                    return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="OrderRefund/' + id + '" data-toggle="tooltip" title="Refund Order"><i class="fa fa-undo"></i></a>'
                }
            }
        ]
    });
}

function CheckAll() {
    var isChecked = $('#checkall').prop("checked");
    $('#dtdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
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

function orderStatus() {
    let id = "";
    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        id += $(this).val() + ",";
    });
    id = id.replace(/,(?=\s*$)/, '');
    $("#checkAll").prop('checked', false);
    let status = $('#ddlOrderStatus').val();

    if (id == "") { swal('alert', 'Please select a order', 'error'); }
    if (status == "") { swal('alert', 'Please select status', 'error'); }

    swal.queue([{
        title: 'Alert!', confirmButtonText: 'Yes, Update it!', text: "Do you want to change your order status?",
        showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                let obj = { strVal: id, status: status }
                $.post('/Orders/ChangeOrderStatus', obj)
                    .done(function (data) {
                        if (data.status) {
                            swal.insertQueueStep(data.message);
                            GetOrderDetails(); let order_type = $('#hfOrderType').val(); dataGridLoad(order_type, true);
                        }
                        else { swal.insertQueueStep('something went wrong!'); }
                        resolve();
                    })
            })
        }
    }]);
}

//Check PayPal Payment Status.
function PaymentStatus(oid, pp_id, email) {
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
                        title: status, confirmButtonText: 'Yes, Update it!', text: "You Payment has been received. Do you want to update your status?", showLoaderOnConfirm: true, showCloseButton: true, showCancelButton: true,
                        preConfirm: function () {
                            return new Promise(function (resolve) {
                                let opt = { post_id: oid, meta_key: '_paypal_status', meta_value: 'COMPLETED' };
                                $.get('/Orders/UpdatePaypalPaymentAccept', opt)
                                    .done(function (data) {
                                        if (data.status) {
                                            swal.insertQueueStep('Status updated successfully.');
                                            order_Split(oid, email);
                                            $('#dtdata').DataTable().ajax.reload();
                                        }
                                        else { swal.insertQueueStep('Status updated successfully.'); }
                                        resolve();
                                    })
                            })
                        }
                    }]);
                }
                else {
                    swal(status, 'Request has sent for payment.', 'info');
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); console.log(XMLHttpRequest); swal('Alert!', XMLHttpRequest.responseJSON.message, "error"); },
            complete: function () { $("#loader").hide(); }, async: false
        });
    }).fail(function (jqXHR, textStatus, errorThrown) {
        swal('Alert!', 'Something went wrong, please try again.', "error");
    });
}

//Check podium Payment Status.
function podiumPaymentStatus(oid, podium_id, email) {
    let option = { strValue1: 'getToken' }; let create_url = podium_baseurl + '/v4/invoices/' + podium_id;
    swal.queue([{
        title: 'Payment Status', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
        onOpen: () => {
            swal.showLoading();
            $.get('/Setting/GetPodiumToken', option).then(response => {
                let access_token = response.message;
                $.ajax({
                    type: 'get', url: create_url, contentType: "application/json; charset=utf-8", dataType: "json", data: { locationUid: "6c2ee0d4-0429-5eac-b27c-c3ef0c8f0bc7" },
                    beforeSend: function (xhr) { xhr.setRequestHeader("Accept", "application/json"); xhr.setRequestHeader("Authorization", "Bearer " + access_token); }
                }).then(response => {
                    let status = response.data.status.toUpperCase();
                    if (status == 'PAID') {
                        let payment_uid = response.data.payments[0].uid, location_uid = response.data.location.uid, invoiceNumber = response.data.invoiceNumber;
                        let order_note = 'Payment completed through Podium by ' + response.data.customerName + ' on ';
                        swal.queue([{
                            title: status, confirmButtonText: 'Yes, Update it!', text: "You Payment has been received. Do you want to update your status?", showLoaderOnConfirm: true, showCloseButton: true, showCancelButton: true,
                            preConfirm: function () {
                                return new Promise(function (resolve) {
                                    let opt = { post_id: oid, payment_uid: payment_uid, location_uid: location_uid, invoice_number: invoiceNumber, order_note: order_note };
                                    $.post('/Orders/UpdatePodiumPaymentAccept', opt)
                                        .done(function (data) {
                                            if (data.status) {
                                                swal.insertQueueStep('Status updated successfully.'); order_Split(oid, email); $('#dtdata').DataTable().ajax.reload();
                                            }
                                            else { swal.insertQueueStep(data.message); }
                                            resolve();
                                        });
                                });
                            }
                        }]);
                    }
                    else { swal.hideLoading(); swal(status, 'Request has sent for payment.', 'info'); }
                }).catch(err => { swal.hideLoading(); console.log(err); swal('Error!', 'No invoice for the invoice UID.', 'error'); });
            }).catch(err => { swal.hideLoading(); swal('Error!', 'Something went wrong, please try again.', 'error'); }).always(function () { swal.hideLoading(); });
        }
    }]);
}
function order_Split(order_id, email) {
    var obj = { order_id: parseInt(order_id) || 0 };
    $.ajax({
        type: "POST", contentType: "application/json; charset=utf-8",
        url: "/Orders/SplitOrderByStatus", // Controller/View
        data: JSON.stringify(obj), dataType: "json", beforeSend: function () { },
        success: function (result) {
            if (result.status) { console.log(result); sendInvoice(order_id, email) }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });
}

function sendInvoice(id, email) {
    var opt_mail = { order_number: id, option_name: 'wc_email_customer_processing_order', recipients: email, site_title: 'Lyala', site_address: 'us', site_url: '' }
    $.post('/EmailNotifications/SendMailNotification', opt_mail).done(function (response) { console.log(response); });
}