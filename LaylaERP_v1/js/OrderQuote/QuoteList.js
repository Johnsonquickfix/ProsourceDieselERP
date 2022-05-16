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
    $('#btnOtherFilter').click(function () { let order_type = $('#hfOrderType').val(); dataGridLoad(order_type); });
    $("#ddlUser").on("select2:clearing", function (e) { let order_type = $('#hfOrderType').val(); dataGridLoad(order_type);});
});
///Get Order Counts
function GetOrderDetails() {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY'), ed = $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtOrderDate').val() == '') { sd = ''; ed = '' };
    let _html = '', _total = 0;
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
            { data: 'quote_no', title: 'Quote Code', sWidth: "8%", render: function (id, type, row, meta) { return '<a href="javascript:void(0);" onclick="PrintQuote(' + id + ',\'' + row.quote_date + '\',\'' + row.quote_status + '\');" data-toggle="tooltip" title="Show/Print Quote">' + id + '</a>'; } },
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
                    else if (id == 'podium' && row.payment_status == 'PAID') return 'Podium';
                    else if (id == 'podium' && row.payment_status != 'PAID') return ' <a href="javascript:void(0);" data-toggle="tooltip" title="Check Podium Payment Status." onclick="podiumPaymentStatus(' + row.quote_no + ',\'' + row.transaction_id + '\',\'' + row.billing_email + '\');">Podium</a>';
                    else if (id == 'ppec_paypal') return 'PayPal';
                    else return '-';
                }
            },
            { data: 'order_id', title: 'Order ID', sWidth: "10%", render: function (id, type, row, meta) { if (id > 0) return $.fn.dataTable.render.number('', '', 0, '#').display(id); else return '-'; } },
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
                    let _paystatus = [{ meta_key: '_podium_payment_uid', meta_value: payment_uid }, { meta_key: '_podium_location_uid', meta_value: location_uid },
                    { meta_key: '_podium_invoice_number', meta_value: invoiceNumber }, { meta_key: '_podium_status', meta_value: 'PAID' }];
                    swal.queue([{
                        title: status, confirmButtonText: 'Yes, Update it!', text: "Your payment received. Do you want to update your status?", showLoaderOnConfirm: true, showCloseButton: true, showCancelButton: true,
                        preConfirm: function () {
                            return new Promise(function (resolve) {
                                let option = {
                                    id: oid, quote_header: JSON.stringify({ quote_no: oid, payment_method: 'podium', transaction_id: podium_id, payment_status: 'PAID', quote_status: 'wc-podium', payment_meta: JSON.stringify(_paystatus) })
                                };
                                $.post('/quote/payment-update', option).done(function (data) {
                                    data = JSON.parse(data); console.log(data, option);
                                    if (data[0].response == "Success") {
                                        swal.insertQueueStep({ title: 'Success', text: 'Status updated successfully.', type: 'success' }); $('#dtdata').DataTable().ajax.reload();//order_Split(oid, email); 
                                    }
                                    else { swal.insertQueueStep({ title: 'Error', text: data.message, type: 'error' }); }
                                    resolve();
                                });
                            });
                        }
                    }]);
                }
                else { swal.hideLoading(); swal(status, 'Request sent for payment.', 'info'); }
            }).catch(err => { swal.hideLoading(); console.log(err); swal('Error!', 'Something went wrong, please try again.', 'error'); }).always(function () { swal.hideLoading(); });
        }
    }]);
}

//Print Quote
function PrintQuote(id, quote_date, quote_status) {
    let modalHtml = '';
    modalHtml += '<div class="modal-dialog modal-lg">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<div class="modal-body no-padding" ></div>';
    modalHtml += '<div class="modal-footer">';
    modalHtml += '<button type="button" class="btn btn-primary" data-dismiss="modal" aria-label="Close">OK</button>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#myModal").empty().html(modalHtml);

    let _header = [], _detail = [];
    $.ajaxSetup({ async: false })
    $.get('/OrderQuote/GetQuoteDetails', { id: id }).done(function (result) {
        let data = JSON.parse(result); _header = data['Table']; _detail = data['Table1'];
    }).catch(err => { swal('Alert!', errorThrown, "error"); }).always(function () { });

    let myHtml = '';
    myHtml += '<div style="margin:0;padding:0;color: #4f4f4f;font-family: Arial, sans-serif;">';
    myHtml += '<table id="tbprint" role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">';
    myHtml += '<tr>';
    myHtml += '<td align="center" style="padding:0;">';
    myHtml += '<table role="presentation" style="width:602px;border-collapse:collapse;border-spacing:0;text-align:left;">';
    myHtml += '<tr>';
    myHtml += '<td align="center" style="padding: 10px 15px; background-color: #f8f8f8;">';
    myHtml += '<table role="presentation" style="width:100%;">';
    myHtml += '<tr>';
    myHtml += '<td><img alt="Layla Logo" src="#" id="imgLogoprint"></td>';
    myHtml += '<td align="right">';
    myHtml += '<h1 style="font-size: 42px; margin:0px; font-style: italic; color: #4f4f4f">Thank you.</h1>';
    myHtml += '<h2 style="font-size: 20px; margin:0px; color: #4f4f4f">Your quote has been received</h2>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '</table>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '<tr class="thankyou-for-your-order">';
    myHtml += '<td class="order-detail-box" style="padding: 15px 10px 10px; border-bottom: 1px solid #c8c8c8;">';
    myHtml += '<table class="order_details order-detail-ul" role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">';
    $.each(_header, function (i, row) {
        myHtml += '<tr>';
        myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top; border-right: 1px solid #c8c8c8; padding-right:30px;"> quote code:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">' + id + '</strong></td>';
        myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top; border-right: 1px solid #c8c8c8; padding-right:30px; padding-left:30px;"> Date:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">' + quote_date + '</strong></td>';
        myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top; border-right: 1px solid #c8c8c8; padding-right:30px; padding-left:30px;"> Total:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">$' + row.net_total.toFixed(2) + '</strong></td>';
        //myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top;  padding-left:30px;"> Status:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">' + quote_status + '</strong></td>';
        if (quote_status == 'wc-draft') myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top;  padding-left:30px;"> Status:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">Quote</strong></td>';
        else if (quote_status == 'wc-approved') myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top;  padding-left:30px;"> Status:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">Approved</strong></td>';
        else if (quote_status == 'wc-rejected') myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top;  padding-left:30px;"> Status:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">Rejected</strong></td>';
        else if (quote_status == 'wc-on-hold') myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top;  padding-left:30px;"> Status:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">On hold</strong></td>';
        else if (quote_status == 'wc-cancelled') myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top;  padding-left:30px;"> Status:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">Cancelled</strong></td>';
        else if (quote_status == 'wc-pendingpodiuminv') myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top;  padding-left:30px;"> Status:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">Pending Podium Invoice</strong></td>';
        else if (quote_status == 'wc-podium') myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top;  padding-left:30px;"> Status:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">Order via Podium</strong></td>';
        else if (quote_status == 'wc-podiumrefund') myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top;  padding-left:30px;"> Status:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">Podium Refunded</strong></td>';
        else if (quote_status == 'wc-cancelnopay') myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top;  padding-left:30px;"> Status:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">Cancelled - No Payment</strong></td>';
        else myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top;  padding-left:30px;"> Status:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">-</strong></td>';
        myHtml += '</tr>';
    });
    myHtml += '</table>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '<tr><td ><h2 style="font-size:20px; margin:25px 0px 10px 0px;">Quote details</h2></td></tr>';
    myHtml += '<tr>';
    myHtml += '<td >';
    let _fee = 0.00, _sr_fee = 0.00;
    $.each(_header, function (i, row) {
        myHtml += '<table id="tblorder_details" class="shop_table order_details" style="border: 1px solid rgba(0, 0, 0, 0.1);margin: 0 -1px 24px 0;text-align: left;width: 100%; border-collapse: separate; border-radius: 5px;">';
        myHtml += '<thead><tr><th class=" product-name" style="font-weight: 700;padding: 9px 12px;">Product</th><th class="product-total" style="font-weight: 700;padding: 9px 12px;">Total</th></tr></thead>';
        myHtml += '<tbody>'
        $.each(_detail, function (j, c_row) {
            if (c_row.item_type == 'line_item') {
                myHtml += '<tr><td style="border-top: 1px solid rgba(0, 0, 0, 0.1);  padding: 9px 12px; vertical-align: middle;"><span>' + c_row.item_name + '</span><strong class="product-quantity"> × ' + c_row.product_qty.toFixed(0) + '</strong></td><td style="border-top: 1px solid rgba(0, 0, 0, 0.1);  padding: 9px 12px; vertical-align: middle;"><span>$' + c_row.gross_total.toFixed(2) + '</span></td></tr>';
            }
            else if (c_row.item_type == 'fee' && c_row.item_name == 'State Recycling Fee') { _sr_fee += c_row.net_total; }
            else if (c_row.item_type == 'fee' && c_row.item_name != 'State Recycling Fee') { _fee += c_row.net_total; }
        });
        myHtml += '</tbody>';
        myHtml += '<tfoot>';
        myHtml += '<tr><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Subtotal:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;"><span>$' + row.gross_total.toFixed(2) + '</span></td></tr>';
        myHtml += '<tr><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Discount:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">-<span>$' + row.discount.toFixed(2) + '</span></td></tr>';
        myHtml += '<tr><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Shipping:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">$' + row.shipping_total.toFixed(2) + '</td></tr>';
        myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Tax:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">$' + row.tax_total.toFixed(2) + '</td></tr>';
        myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">State Recycling Fee:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">$' + _sr_fee.toFixed(2) + '</td></tr>';
        myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Fee:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">' + ((_fee < 0) ? '-' : '') + '$' + ((_fee < 0) ? _fee * -1 : _fee).toFixed(2) + '</td></tr>';
        if (parseFloat(row.giftcard_total) > 0)
            myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Gift Card:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">$' + row.giftcard_total.toFixed(2) + '</td></tr>';
        myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Total:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;"><span>$' + row.net_total.toFixed(2) + '</span></td></tr>';
        myHtml += '</tfoot>';
        myHtml += '</table>';
    });

    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += ' <tr>';
    myHtml += '<td class="checkout-call" style="background: #41414b; padding: 30px 15px; font-size: 20px; color: #fff; font-weight: 600; text-align: center;">';
    myHtml += 'Give us a call <a style="color:#fff;text-decoration: none;" href="tel:855-358-1676">855-358-1676</a>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '</table>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '</table>';
    myHtml += '</div>';

    $('#myModal .modal-body').append(myHtml);

    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    toDataURL('https://quickfix16.com/wp-content/themes/layla-white/images/logo.png', function (dataUrl) { $('#imgLogoprint').attr("src", dataUrl); });
}

