var table_oh;
$(document).ready(function () {
    $("#loader").hide();
    $(".subsubsub li a").click(function (e) { $('.subsubsub li a').removeClass('current'); $(this).addClass('current'); });
    $('#txtOrderDate').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'This Year': [moment().startOf('year'), moment().endOf('year')]
        },
        startDate: moment(), autoUpdateInput: false, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto"
    }, function (start, end, label) {
        $('#txtOrderDate').val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
        let order_type = $('#hfOrderType').val();
        $.when(GetOrderDetails()).done(function () { dataGridLoad(order_type); });
    });
    $('#txtOrderDate').val('');
    $('#txtOrderDate').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val(''); let order_type = $('#hfOrderType').val();
        $.when(GetOrderDetails()).done(function () { dataGridLoad(order_type); });
    });
    $("#ddlUser").select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Search Customer",
        ajax: {
            url: '/Orders/GetCustomerList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.displayname, name: item.displayname, id: item.id } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
    var urlParams = new URLSearchParams(window.location.search);
    let order_type = urlParams.get('type') ? urlParams.get('type') : '';
    $.when(GetOrderDetails(), CheckPermissions("", "#hfEdit", "", window.location.pathname)).done(function () { $('#hfOrderType').val(""); dataGridLoad(""); });
    //$("#loader").hide();
    //$('#all').click(function () { var order_type = ""; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    //$('#mine').click(function () { var order_type = "mine"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    //$('#draft').click(function () { var order_type = "draft"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    //$('#wc-pending').click(function () { var order_type = "wc-pending"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    //$('#wc-processing').click(function () { var order_type = "wc-processing"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    //$('#wc-on-hold').click(function () { var order_type = "wc-on-hold"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    //$('#wc-completed').click(function () { var order_type = "wc-completed"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    //$('#wc-cancelled').click(function () { var order_type = "wc-cancelled"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    //$('#wc-refunded').click(function () { var order_type = "wc-refunded"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    //$('#wc-failed').click(function () { var order_type = "wc-failed"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    //$('#wc-cancelnopay').click(function () { var order_type = "wc-cancelnopay"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    //$('#wc-pendingpodiuminv').click(function () { var order_type = "wc-pendingpodiuminv"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    //$('#wc-podium').click(function () { var order_type = "wc-podium"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    //$('#wc-podiumrefund').click(function () { var order_type = "wc-podiumrefund"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    //$('#btnOtherFilter').click(function () { var order_type = $('#hfOrderType').val(); dataGridLoad(order_type); });
});
///Get Order Counts
function GetOrderDetails() {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY'), ed = $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtOrderDate').val() == '') { sd = ''; ed = '' };
    let _html = '',_total=0;
    let option = { strValue1: sd, strValue2: ed };
    $.ajax({
        type: "POST", url: '/quote/quote-counts', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option),
        success: function (result) {
            result = JSON.parse(result); 
            $.each(result, function (i, row) {
                _html += '<li class="' + row.quote_status + '" data-toggle="tooltip" title="Click search ' + row.quote_status_desc + ' Quote."><a id="all" href="javascript:void(0);">' + row.quote_status_desc + ' (<span class="count">' + row.total_quote + '</span></a>) |</li>'
                _total += row.total_quote;
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });
    $('#ulQuoteCount').empty().append('<li class="" data-toggle="tooltip" title="Click search all Quote."><a id="all" href="javascript:void(0);" class="current">All (<span class="count">' + _total + '</span></a>) |</li>').append(_html);
    $(".subsubsub li a").click(function (e) {
        $('.subsubsub li a').removeClass('current'); $(this).addClass('current');
        let order_type = $(this).parent().prop('className'); $('#hfOrderType').val(order_type); dataGridLoad(order_type);
    });
}
function isNullUndefAndSpace(variable) { return (variable !== null && variable !== undefined && variable !== 'undefined' && variable !== 'null' && variable.length !== 0); }
function dataGridLoad(order_type) {
    let searchText = localStorage.getItem('_search');
    let cus_id = (parseInt($('#ddlUser').val()) || 0);
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtOrderDate').val() == '') { sd = ''; ed = '' };
    let _id = parseInt($('#hfOrderType').data('userid')) || 0, _editable = parseInt($('#hfOrderType').data('iseditable')) || 0;
    table_oh = $('#dtdata').DataTable({
        oSearch: { "sSearch": searchText }, columnDefs: [{ "orderable": false, "targets": 0 }], order: [[0, "desc"]], lengthMenu: [[10, 20, 50], [10, 20, 50]],
        destroy: true, bProcessing: true, responsive: true, bServerSide: true, bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('.dataTables_filter input').unbind();
            $('.dataTables_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_oh.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/quote/quote-list",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed });
            aoData.push({ name: "strValue3", value: (cus_id > 0 ? cus_id : '') }, { name: "strValue4", value: order_type });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                success: function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    localStorage.setItem('_search', '');
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [
            { data: 'quote_no', title: 'Quote Code', sWidth: "8%" },
            { data: 'quote_date', title: 'Creation Date', sWidth: "12%", render: function (data, type, full) { if (type === "sort" || type === 'type') { return full.quote_date_sort; } else return data; } },
            { data: 'customer_name', title: 'Name', sWidth: "14%" },
            {
                data: 'billing_phone', title: 'Phone No.', sWidth: "10%", render: function (id, type, row) {
                    let phone = isNullUndefAndSpace(id) ? id.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") : id;
                    return phone;
                }
            },
            { data: 'num_items_sold', title: 'No. of Items', sWidth: "10%" },
            { data: 'net_total', title: 'Amount', sWidth: "10%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            {
                data: 'quote_status', title: 'Status', sWidth: "10%", render: function (data, type, row) {
                    if (data == 'wc-draft') return 'Quote';
                    else if (data == 'wc-approved') return 'Approved';
                    else if (data == 'wc-rejected') return 'Rejected';
                    else if (data == 'wc-on-hold') return 'On hold';
                    else if (data == 'wc-cancelled') return 'Cancelled';
                    else if (data == 'wc-pendingpodiuminv') return 'Pending Podium Invoice';
                    else if (data == 'wc-podium') return 'Order via Podium';
                    else if (data == 'wc-podiumrefund') return 'Podium Refunded';
                    else if (data == 'wc-cancelnopay') return 'Cancelled - No Payment';
                    else return '-';
                }
            },
            {
                data: 'payment_method', title: 'Payment Method', sWidth: "11%", render: function (id, type, row) {
                    if (id == 'amazon_payments_advanced') return 'Amazon Pay';
                    else if (id == 'authorize_net_cim_credit_card') return 'Authorize Net';
                    else if (id == 'podium') return 'Podium';
                    else if (id == 'ppec_paypal') return 'PayPal';
                    else return '-';
                }
            },
            {
                data: 'quote_no', title: 'Action', sWidth: "8%", 'render': function (id, type, row, meta) {
                    if ($("#hfEdit").val() == "1") {
                        if (_editable == 1) {
                            if ((row.status == 'wc-draft') && refund_amt == 0) return '<a href="index/' + id + '" data-toggle="tooltip" title="View/Edit quote" onclick="ActivityLog(\'View/Edit quote id (' + id + ') in quote list.\',\'/OrderQuote/History\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="javascript:void(0);" onclick="cancelorder(' + id + ');" data-toggle="tooltip" title="Cancel Order"><i class="fa fa-times-circle text-danger"></i></a>';
                            else return '<a href="index/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/OrderQuote/History\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a>';
                        }
                        else if (_editable == 0 && _id == row.customer_id) {
                            if ((row.status == 'wc-draft') && refund_amt == 0) return '<a href="index/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit quote id (' + id + ') in quote list.\',\'/OrderQuote/History\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="javascript:void(0);" onclick="cancelorder(' + id + ');" data-toggle="tooltip" title="Cancel Order"><i class="fa fa-times-circle text-danger"></i></a>';
                            else return '<a href="index/' + id + '" data-toggle="tooltip" title="View/Edit Order"  onclick="ActivityLog(\'View/Edit quote id (' + id + ') in order history.\',\'/OrderQuote/History\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a>';
                        }
                        else {
                            return '<a href="index/' + id + '" onclick="ActivityLog(\'Edit order id (' + id + ') in order history.\',\'/OrderQuote/History\'); return true;" data-toggle="tooltip" title="View/Edit Order"><i class="glyphicon glyphicon-eye-open"></i></a>';
                        }
                    }
                    else { return "No Permission"; }
                }
            }
        ]
    });
}

function orderStatus() {
    let id = "";
    $("input:checkbox[name=CheckSingle]:checked").each(function () { id += $(this).val() + ","; });
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
                        title: status, confirmButtonText: 'Yes, Update it!', text: "Your payment received. Do you want to update your status?", showLoaderOnConfirm: true, showCloseButton: true, showCancelButton: true,
                        preConfirm: function () {
                            return new Promise(function (resolve) {
                                let _paystatus = [{ post_id: oid, meta_key: '_paypal_status', meta_value: 'COMPLETED' }];
                                let opt = { order_id: oid, b_first_name: '', payment_method: 'ppec_paypal', OrderPostMeta: _paystatus };
                                $.post('/OrdersMySQL/UpdatePodiumPaymentAccept', opt).done(function (data) {
                                    console.log(data);
                                    data = JSON.parse(data);
                                    if (data[0].Response == "Success") {
                                        swal.insertQueueStep({ title: 'Success', text: 'Status updated successfully.', type: 'success' }); $('#dtdata').DataTable().ajax.reload();//order_Split(oid, email); 
                                        SendGiftCards(oid, email);
                                    }
                                    else { swal.insertQueueStep({ title: 'Error', text: data.message, type: 'error' }); }
                                    resolve();
                                });
                            });
                        }
                    }]);
                }
                else {
                    swal(status, 'Request sent for payment.', 'info');
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); console.log(XMLHttpRequest); swal('Alert!', XMLHttpRequest.responseJSON.message, "error"); },
            complete: function () { $("#loader").hide(); ActivityLog('Check payment status for order id (' + oid + ') in order history', '/Orders/OrdersHistory'); }, async: false
        });
    }).fail(function (jqXHR, textStatus, errorThrown) {
        swal('Alert!', 'Something went wrong, please try again.', "error");
    });
}
function PaypalPaymentCancel(ppemail) {
    console.log('Start PayPal Payment Cancel.');
    swal.queue([{
        title: 'PayPal Payment Processing.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
        onOpen: () => {
            swal.showLoading();
            $.get('/Setting/GetPayPalToken', { strValue1: 'getToken' }).then(response => {
                let access_token = response.message, pay_by = $('#lblOrderNo').data('pay_by').trim(), inv_id = $('#lblOrderNo').data('pay_id').trim();
                let create_url = paypal_baseurl + '/v2/invoicing/invoices' + (inv_id.length > 0 && pay_by.includes('paypal') ? '/' + inv_id : ''), action_method = (inv_id.length > 0 && pay_by.includes('paypal') ? 'PUT' : 'POST');
                //CreatePaypalInvoice(oid, pp_no, ppemail, response.message);
                $.ajax({
                    type: action_method, url: create_url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option_pp),
                    beforeSend: function (xhr) { xhr.setRequestHeader("Accept", "application/json"); xhr.setRequestHeader("Authorization", "Bearer " + access_token); }
                }).then(data => {
                    console.log('Invoice has been Created.'); let sendURL = data.href + '/send'; console.log(sendURL, data, action_method);
                    $("txtbillemail").data('surl', sendURL);
                    if (action_method == 'POST') { SendPaypalInvoice(oid, pp_no, access_token, sendURL); }
                    else {
                        let mail_body = 'Hi ' + $("#txtbillfirstname").val() + ' ' + $("#txtbilllastname").val() + ', please use this secure link to make your payment. Thank you! ' + paypal_baseurl_pay + '/invoice/p/#' + inv_id.toString().substring(4).replace(/\-/g, '');
                        let option_pu = { b_email: $("#txtbillemail").val(), payment_method: 'PayPal Payment request from Layla Sleep Inc.', payment_method_title: mail_body, OrderPostMeta: [{ post_id: oid, meta_key: '_payment_method', meta_value: 'ppec_paypal' }] };
                        $.post('/Orders/UpdatePaymentInvoiceID', option_pu).then(result => {
                            swal('Success!', result.message, 'success'); $("#billModal").modal('hide'); $('.billinfo').prop("disabled", true);
                            successModal('PayPal', inv_id, true, true);
                        }).catch(err => { console.log(err); swal('Error!', err, 'error'); swal.hideLoading(); });
                    }
                }).catch(err => { console.log(err); swal.hideLoading(); swal('Error!', 'Something went wrong.', 'error'); });
            }).catch(err => { swal.hideLoading(); swal('Error!', err, 'error'); });//.always(function () { swal.hideLoading(); });
        }
    }]);
}

//Check podium Payment Status.
function podiumPaymentStatus(oid, podium_id, email) {
    let option = { strValue1: podium_id };
    swal.queue([{
        title: 'Payment Status', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
        onOpen: () => {
            swal.showLoading();
            $.get('/Setting/GetPodiumInvoiceStatus', option).then(response => {
                response = JSON.parse(response);
                let status = response.data.status.toUpperCase();
                if (status == 'PAID') {
                    let payment_uid = response.data.payments[0].uid, location_uid = response.data.location.uid, invoiceNumber = response.data.invoiceNumber;
                    let order_note = response.data.customerName;
                    let _paystatus = [{ post_id: oid, meta_key: '_podium_payment_uid', meta_value: payment_uid }, { post_id: oid, meta_key: '_podium_location_uid', meta_value: location_uid },
                    { post_id: oid, meta_key: '_podium_invoice_number', meta_value: invoiceNumber }, { post_id: oid, meta_key: '_podium_status', meta_value: 'PAID' }];
                    swal.queue([{
                        title: status, confirmButtonText: 'Yes, Update it!', text: "Your payment received. Do you want to update your status?", showLoaderOnConfirm: true, showCloseButton: true, showCancelButton: true,
                        preConfirm: function () {
                            return new Promise(function (resolve) {
                                let opt = { order_id: oid, b_first_name: order_note, payment_method: 'podium', OrderPostMeta: _paystatus };
                                $.post('/OrdersMySQL/UpdatePodiumPaymentAccept', opt).done(function (data) {
                                    data = JSON.parse(data);
                                    if (data[0].Response == "Success") {
                                        swal.insertQueueStep({ title: 'Success', text: 'Status updated successfully.', type: 'success' }); $('#dtdata').DataTable().ajax.reload();//order_Split(oid, email); 
                                        SendGiftCards(oid, email);
                                    }
                                    else { swal.insertQueueStep({ title: 'Error', text: data.message, type: 'error' }); }
                                    resolve();
                                });
                            });
                        }
                    }]);
                }
                else { swal.hideLoading(); swal(status, 'Request sent for payment.', 'info'); }
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
///cancel order
function cancelorder(id) {
    swal({ title: '', text: 'Do you want to cancel this order?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) {
                let obj = { order_id: id }
                $.post('/OrdersMySQL/OrderCancel', obj).done(function (data) {
                    console.log(data);
                    data = JSON.parse(data);
                    if (data[0].response == "success") { cancelpayment(data[0]); ActivityLog('Cancel order id (' + id + ') in order history', '/OrdersMySQL/OrdersHistory'); }
                    else { swal('Error', data[0].payment_method_title, "error"); }
                });
            }
        });
    return false;
}
function cancelpayment(data) {
    console.log(data);
    let invoice_amt = parseFloat(data.total_sales) || 0.00;
    if (data.payment_method == "ppec_paypal") {
        if (data.post_status == "wc-pending" || data.post_status == "wc-pendingpodiuminv") {
            swal.queue([{
                title: 'PayPal Invoice cancel.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
                onOpen: () => {
                    swal.showLoading();
                    $.get('/Setting/GetPayPalToken', { strValue1: 'getToken' }).then(response => {
                        let access_token = response.message, _url = paypal_baseurl + '/v2/invoicing/invoices/' + data.paypal_id + '/cancel';
                        let opt_cnl = { subject: "Invoice Cancelled", note: "Cancelling the invoice", send_to_invoicer: true, send_to_recipient: true, additional_recipients: [data.billing_email] }
                        $.ajax({
                            type: 'post', url: _url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt_cnl),
                            beforeSend: function (xhr) { xhr.setRequestHeader("Accept", "application/json"); xhr.setRequestHeader("Authorization", "Bearer " + access_token); }
                        }).then(response => {
                            swal('Success!', 'Order cancelled successfully.', "success");
                            $.when(GetOrderDetails()).done(function () { table_oh.ajax.reload(null, false); });
                        }).fail(function (XMLHttpRequest, textStatus, errorThrown) { swal.hideLoading(); console.log(XMLHttpRequest); swal('Error!', errorThrown, "error"); });
                    }).catch(err => { swal.hideLoading(); swal('Error!', err, 'error'); });//.always(function () { swal.hideLoading(); });
                }
            }]);
        }
        else if (data.post_status == "wc-processing" || data.post_status == "wc-on-hold") {
            swal.queue([{
                title: 'PayPal payment refund processing.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
                onOpen: () => {
                    swal.showLoading();
                    $.get('/Setting/GetPayPalToken', { strValue1: 'getToken' }).then(response => {
                        let access_token = response.message, _url = paypal_baseurl + '/v2/invoicing/invoices/' + data.paypal_id + '/refunds';
                        let date = new Date();
                        let invoice_date = [date.getFullYear(), ('0' + (date.getMonth() + 1)).slice(-2), ('0' + date.getDate()).slice(-2)].join('-');
                        let opt_refund = { method: "BANK_TRANSFER", refund_date: invoice_date, amount: { currency_code: "USD", value: invoice_amt } }
                        $.ajax({
                            type: 'post', url: _url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt_refund),
                            beforeSend: function (xhr) { xhr.setRequestHeader("Accept", "application/json"); xhr.setRequestHeader("Authorization", "Bearer " + access_token); }
                        }).then(response => {
                            swal('Success!', 'Order cancelled successfully.', "success");
                            let option = { post_ID: data.post_id, comment_content: 'PayPal Refund Issued for $' + invoice_amt + '. transaction ID = ' + response.refund_id, is_customer_note: '' };
                            $.post('/Orders/OrderNoteAdd', option).then(response => {
                                swal('Success!', 'Order refunded successfully.', "success");
                                $.when(GetOrderDetails()).done(function () { table_oh.ajax.reload(null, false); });
                            }).fail(function (XMLHttpRequest, textStatus, errorThrown) { swal.hideLoading(); console.log(XMLHttpRequest); swal('Error!', errorThrown, "error"); });

                        }).fail(function (XMLHttpRequest, textStatus, errorThrown) { swal.hideLoading(); console.log(XMLHttpRequest); swal('Error!', errorThrown, "error"); });
                    }).catch(err => { swal.hideLoading(); swal('Error!', err, 'error'); });//.always(function () { swal.hideLoading(); });
                }
            }]);
        }
    }
    else if (data.payment_method == "podium") {
        if (data.post_status == "wc-pending" || data.post_status == "wc-pendingpodiuminv") {
            swal.queue([{
                title: 'Podium invoice cancel.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
                onOpen: () => {
                    swal.showLoading();
                    $.get('/Setting/GetPodiumToken', { strValue1: 'getToken' }).then(response => {
                        let access_token = response.message, _url = podium_baseurl + '/v4/invoices/' + data.podium_uid + '/cancel';
                        let opt_cnl = { locationUid: _locationUid, note: 'Invoice has been canceled.' };
                        $.ajax({
                            type: 'post', url: _url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt_cnl),
                            beforeSend: function (xhr) { xhr.setRequestHeader("Accept", "application/json"); xhr.setRequestHeader("Authorization", "Bearer " + access_token); }
                        }).then(response => {
                            swal('Success!', 'Order cancelled successfully.', "success");
                            $.when(GetOrderDetails()).done(function () { table_oh.ajax.reload(null, false); });
                        }).fail(function (XMLHttpRequest, textStatus, errorThrown) { swal.hideLoading(); console.log(XMLHttpRequest); swal('Error!', errorThrown, "error"); });
                    }).catch(err => { swal.hideLoading(); swal('Error!', err, 'error'); });//.always(function () { swal.hideLoading(); });
                }
            }]);
        }
        else if (data.post_status == "wc-processing" || data.post_status == "wc-on-hold") {
            swal.queue([{
                title: 'Podium payment refund processing.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
                onOpen: () => {
                    swal.showLoading();
                    $.get('/Setting/GetPodiumToken', { strValue1: 'getToken' }).then(response => {
                        let opt_refund = { reason: 'requested_by_customer', locationUid: _locationUid, amount: invoice_amt * 100, paymentUid: data.payment_uid, note: '' };
                        $.ajax({
                            type: 'post', url: podium_baseurl + '/v4/invoices/' + data.payid + '/refund', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt_refund),
                            beforeSend: function (xhr) { xhr.setRequestHeader("Accept", "application/json"); xhr.setRequestHeader("Authorization", "Bearer " + response.message); }
                        }).then(result => {
                            let option = { post_ID: data.post_id, comment_content: 'Refund Issued for $' + invoice_amt + '. The refund should appear on your statement in 5 to 10 days.', is_customer_note: '' };
                            $.post('/Orders/OrderNoteAdd', option).then(response => {
                                swal('Success!', 'Order refunded successfully.', "success");
                                $.when(GetOrderDetails()).done(function () { table_oh.ajax.reload(null, false); });
                            }).fail(function (XMLHttpRequest, textStatus, errorThrown) { swal.hideLoading(); console.log(XMLHttpRequest); swal('Error!', errorThrown, "error"); });
                        }).fail(function (XMLHttpRequest, textStatus, errorThrown) { swal.hideLoading(); console.log(XMLHttpRequest); swal('Error!', errorThrown, "error"); });
                    }).catch(err => { swal.hideLoading(); swal('Error!', err, 'error'); });//.always(function () { swal.hideLoading(); });
                }
            }]);
        }
    }
    else if (data.payment_method == "authorize_net_cim_credit_card") {
        if (data.post_status == "wc-processing" || data.post_status == "wc-on-hold") {
            swal.queue([{
                title: 'Authorize.Net payment processing.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
                onOpen: () => {
                    swal.showLoading();
                    let option = { order_id: data.post_id, NetTotal: invoice_amt };
                    $.post('/Orders/UpdateAuthorizeNetPaymentRefund', option).then(response => {
                        console.log('Authorize.Net ', response);
                        if (response.status) {
                            swal('Alert!', 'Order cancelled successfully.', "success");
                            $.when(GetOrderDetails()).done(function () { table_oh.ajax.reload(null, false); });
                        }
                    }).fail(function (XMLHttpRequest, textStatus, errorThrown) { swal.hideLoading(); console.log(XMLHttpRequest); swal('Error!', errorThrown, "error"); });
                }
            }]);
        }
    }
    else if (data.payment_method == "giftcard") {
        swal.queue([{
            title: 'Refund order processing.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
            onOpen: () => {
                swal.showLoading();
                swal('Alert!', 'Order cancelled successfully.', "success");
                $.when(GetOrderDetails()).done(function () { table_oh.ajax.reload(null, false); });
            }
        }]);
    }
}

///Send Gift Cards
function SendGiftCards(id, email) {
    $.post('/OrdersMySQL/send-giftcard', { order_id: id }).then(response => { console.log('Send Gift Card..'); }).catch(err => { }).always(function () { });
}