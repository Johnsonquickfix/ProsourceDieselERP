$(document).ready(function () {
    $("#loader").hide(); $(".select2").select2();
    $(document).on("change", "#ddlSearchBy", function (t) {
        t.preventDefault(); let id = parseInt($("#ddlSearchBy").val()) || 0; SearchByControl(id)
    });
    $(document).on("change", "#ddlUser", function (t) {
        t.preventDefault();
        let cus_id = parseInt($(this).val()) || 0;
        $.when(dataGridLoad()).done(function () { CustomerInfo(cus_id, 0, '', '') });
    });
    $("#ddlEmail").select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Search Billing Email",
        ajax: {
            url: '/customer-service/customer-list', type: "GET", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { return { strValue1: 'EMAIL', strValue2: params.term }; },
            processResults: function (data) { let jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.user_email, id: item.id, } }) }; },
            error: function (xhr, status, err) { console.log(xhr, status, err); }, cache: true
        }
    });
    $(document).on("change", "#ddlEmail", function (t) {
        t.preventDefault();
        $.when(dataGridLoad()).done(function () { CustomerInfo(0, 0, $('#ddlEmail').val(), '') });
    });
    $(document).on("click", "#btnSearch", function (t) {
        t.preventDefault();
        let cus_id = parseInt($('#ddlUser').val()) || 0, ord_id = parseInt($('#txtOrderNo').val()) || 0;
        $.when(dataGridLoad()).done(function () { CustomerInfo(cus_id, ord_id, $('#ddlEmail').val(), $('#txtOrderPhone').val()) });
    });
    $(document).on("keypress", "#txtOrderNo", function (t) {
        if (t.keyCode == 13) {
            let cus_id = 0, ord_id = 0;
            $.when(dataGridLoad()).done(function () { CustomerInfo(cus_id, ord_id, $('#ddlEmail').val(), '') });
        }
    });
    $(document).on("keypress", "#txtOrderPhone", function (t) {
        if (t.keyCode == 13) {
            let cus_id = 0, ord_id = 0;
            $.when(dataGridLoad()).done(function () { CustomerInfo(cus_id, ord_id, '', $('#txtOrderPhone').val()) });
        }
    });
    $.when(dataGridLoad()).done(function () { OrderInfo(0) });//903954
    $(document).on("click", "#btnGenerateTicket", function (t) {
        t.preventDefault(); GenerateTicketNo();
    });
});
function isNullUndefAndSpace(variable) { return (variable !== null && variable !== undefined && variable !== 'undefined' && variable !== 'null' && variable.length !== 0); }
function formatCurrency(total) {
    var neg = false;
    if (total < 0) { neg = true; total = Math.abs(total); }
    return (neg ? "-$" : '$') + parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
}
///Search Control
function SearchByControl(id) {
    if (id == 1) {
        $(".search-control").empty().append('<select class="form-control select2" id="ddlEmail" placeholder="Filter by Billing Email" style="width: 100%;"></select>');
        $("#ddlEmail").select2({
            allowClear: true, minimumInputLength: 3, placeholder: "Search Billing Email",
            ajax: {
                url: '/customer-service/customer-list', type: "GET", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
                data: function (params) { return { strValue1: 'EMAIL', strValue2: params.term }; },
                processResults: function (data) { let jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.user_email, id: item.id, } }) }; },
                error: function (xhr, status, err) { console.log(xhr, status, err); }, cache: true
            }
        });
    }
    else if (id == 2) {
        $(".search-control").empty().append('<select class="form-control select2" id="ddlUser" placeholder="Filter by registered customer" style="width: 100%;"></select>');
        $("#ddlUser").select2({
            allowClear: true, minimumInputLength: 3, placeholder: "Search Customer",
            ajax: {
                url: '/customer-service/customer-list', type: "GET", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
                data: function (params) { return { strValue1: 'USER', strValue2: params.term }; },
                processResults: function (data) {
                    let jobj = JSON.parse(data);
                    return {
                        results: $.map(jobj, function (item) {
                            return { text: item.user_email, id: item.id, html: '<div style="display:flex;"><div style="padding:5px" ><div style="font-size: 1.2em">#' + item.id + ' ' + item.user_login + '</div><div><b>' + item.user_email + '</b></div></div></div >' }
                        })
                    };
                },
                error: function (xhr, status, err) { }, cache: true
            },
            templateResult: function (data) { return data.html; }, escapeMarkup: function (m) { return m; }
        });
    }
    else if (id == 3) { $(".search-control").empty().append('<input id="txtOrderNo" class="form-control" placeholder="Order No." style="width: 100%;" maxlength="10">'); }
    else if (id == 4) { $(".search-control").empty().append('<input id="txtOrderPhone" class="form-control" placeholder="Phone No." style="width: 100%;" maxlength="11">'); }

    $(".profile-username,.profile-useremail,.billing-address,.shipping-address").text('-');
}

function CustomerInfo(cus_id, ord_id, cus_email, phone_no) {
    $(".profile-username,.profile-useremail,.billing-address,.shipping-address").text('-');
    if (cus_id == 0 && ord_id == 0 && cus_email == null && phone_no == null) return false;
    $.get('/customer-service/customer-info', { strValue1: cus_id, strValue2: ord_id, strValue3: isNullUndefAndSpace(cus_email) ? cus_email : '', strValue4: isNullUndefAndSpace(phone_no) ? phone_no : '' }).then(response => {
        response = JSON.parse(response);
        if (response.length == 0) { $(".profile-username").text('Guest'); $(".profile-useremail,.billing-address,.shipping-address").text('-'); }
        $.each(response, function (i, row) {
            $(".profile-username").text(row.user_login); $(".profile-useremail").text(row.user_email);
            let _detail = JSON.parse(row.user_details);

            let billing_Details = '<strong>' + _detail.billing_first_name + ' ' + _detail.billing_last_name + '</strong><br>';
            billing_Details += (_detail.billing_company.length > 0 ? _detail.billing_company + '<br>' : '') + (_detail.billing_address_1.length > 0 ? _detail.billing_address_1 + '<br>' : '')
                + (_detail.billing_address_2.length > 0 ? _detail.billing_address_2 + '<br>' : '') + (_detail.billing_city.length > 0 ? _detail.billing_city + ', ' : '') + (_detail.billing_state.length > 0 ? _detail.billing_state + ' ' : '')
                + (_detail.billing_postcode.length > 0 ? _detail.billing_postcode + ' ' : '') + (_detail.shipping_country.length > 0 ? _detail.shipping_country : '');
            billing_Details += '<br><strong>Email address:</strong> ' + _detail.billing_email + '<br><strong>Phone:</strong> ' + _detail.billing_phone;
            $('.billing-address').empty().append(billing_Details);

            let shipping_Details = '<strong>' + _detail.shipping_first_name + ' ' + _detail.shipping_last_name + '</strong><br>';
            shipping_Details += (_detail.shipping_company.length > 0 ? _detail.shipping_company + '<br>' : '') + (_detail.shipping_address_1.length > 0 ? _detail.shipping_address_1.trim() + '<br>' : '')
                + (_detail.shipping_address_2.length > 0 ? _detail.shipping_address_2 + '<br>' : '') + (_detail.shipping_city.length > 0 ? _detail.shipping_city + ', ' : '') + (_detail.shipping_state.length > 0 ? _detail.shipping_state + ' ' : '')
                + (_detail.shipping_postcode.length > 0 ? _detail.shipping_postcode + ' ' : '') + (_detail.shipping_country.length > 0 ? _detail.shipping_country : '');
            $('.shipping-address').empty().append(shipping_Details);
        });
    }).catch(err => { }).always(function () { });
}

function dataGridLoad() {
    let cus_id = (parseInt($('#ddlUser').val()) || 0), order_id = (parseInt($('#txtOrderNo').val()) || 0);
    let table_oh = $('#dtdata').DataTable({
        oSearch: { "sSearch": '' }, columnDefs: [{ "orderable": false, "targets": 0 }], order: [[0, "desc"]], lengthMenu: [[10, 20, 50], [10, 20, 50]],
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
        sAjaxSource: "order-list",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: cus_id }, { name: "strValue2", value: order_id }, { name: "strValue3", value: $('#ddlEmail').val() }, { name: "strValue4", value: $('#txtOrderPhone').val() });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                success: function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    $('.total-orders').text(data.recordsTotal);
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [
            {
                data: 'id', title: 'OrderID', sWidth: "8%",
                render: function (id, type, full, meta) {
                    if (full.post_mime_type == 'shop_order_erp' || full.post_mime_type == 'shopordererp') return '#' + id + ' <i class="glyphicon glyphicon-user" title="Order created from ERP Admin." aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>';
                    else return '#' + id;
                }
            },
            { data: 'first_name', title: 'Name', sWidth: "14%", render: function (id, type, row) { return row.first_name + ' ' + row.last_name; } },
            {
                data: 'billing_phone', title: 'Phone No.', sWidth: "10%", render: function (id, type, row) {
                    let phone = isNullUndefAndSpace(id) ? id.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") : id;
                    return phone;
                }
            },
            { data: 'num_items_sold', title: 'No. of Items', sWidth: "10%", class: 'text-end' },
            {
                data: 'total_sales', title: 'Order Total', sWidth: "10%", class: 'text-end', render: function (id, type, row, meta) {
                    let sale_amt = parseFloat(row.total_sales) || 0.00, refund_amt = parseFloat(row.refund_total) || 0.00, refund_gc_amt = parseFloat(row.refund_giftcard_total) || 0.00;
                    let amt = refund_amt != 0 ? '<span style="text-decoration: line-through;"> $' + sale_amt.toFixed(2) + '<br></span><span style="text-decoration: underline;"> $' + (parseFloat(sale_amt) + refund_amt).toFixed(2) + '</span>' : '$' + sale_amt.toFixed(2);
                    amt += refund_gc_amt != 0 ? '<br>Refunded by gift card : $' + refund_gc_amt.toFixed(2) : '';
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
                    else if (data == 'wc-podiumrefund') return 'Podium Refunded';
                    else if (data == 'draft') return 'draft';
                    else return '-';
                }
            },
            {
                data: 'post_date', title: 'Creation Date', sWidth: "12%", render: function (data, type, row) { return row.date_created; }
            },
            {
                data: 'payment_method_title', title: 'Payment Method', sWidth: "11%", render: function (id, type, row) {
                    let pm_title = isNullUndefAndSpace(row.payment_method_title) ? row.payment_method_title : "";
                    if (row.status == 'wc-pending' || row.status == 'wc-pendingpodiuminv') {
                        if (row.payment_method == 'ppec_paypal' && row.paypal_status != 'COMPLETED') return ' <a href="javascript:void(0);" data-toggle="tooltip" title="Check PayPal Payment Status." onclick="PaymentStatus(' + row.id + ',\'' + row.paypal_id + '\',\'' + row.billing_email + '\');">' + pm_title + '</a>';
                        else if (row.payment_method == 'podium' && row.podium_status != 'PAID') return ' <a href="javascript:void(0);" data-toggle="tooltip" title="Check PayPal Payment Status." onclick="podiumPaymentStatus(' + row.id + ',\'' + row.podium_uid + '\',\'' + row.billing_email + '\');">' + pm_title + '</a>';
                        else return pm_title;
                    }
                    else return pm_title;
                }
            },
            {
                'data': 'id', title: 'Action', sWidth: "8%", class: 'text-center', 'render': function (id, type, row, meta) {
                    return '<a href="javascript:void(0);" onclick="OrderInfo(' + id + ');" data-toggle="tooltip" title="View/Edit Order"><i class="glyphicon glyphicon-eye-open"></i></a>'
                }
            }
        ]
    });
}

function backOrderList() {
    $("#list-page").removeClass('hidden'); $("#detail-page").addClass('hidden');
    $(".order-id").data('order_id', 0); $(".order-id").data('email', ''); $(".order-id").data('name', '');
}
function OrderInfo(ord_id) {
    $("#order_items,.order-coupon,#order_items_refund").empty();
    //$("#detail-page").empty();
    if (ord_id == 0) return false;
    $("#list-page").addClass('hidden'); $("#detail-page").removeClass('hidden');
    $.post('/customer-service/order', { strValue1: ord_id }).then(response => {
        response = JSON.parse(response); //console.log(response);
        let _html = '', _coupon = '', _refundHtml = '';
        $.each(response['order'], function (i, row) {
            //Add header
            $(".order-id").text('Order #' + row.order_id); $(".order-date").text(row.date_created); $(".order-status").text(row.status_desc);
            $(".order-id").data('order_id', row.order_id); $(".order-id-comment").text('Order #' + row.order_id + ' Comments');
            $(".order-right-id").empty().append('Order #' + row.order_id + '<a href="javascript:void(0);" class="btn btn-primary btn-sm float-right" onclick="backOrderList();">Back To List</a>');
            //Add Address
            let _json = JSON.parse(row.order_details); //console.log(_json);
            _html = '<strong>' + _json._billing_first_name + ' ' + _json._billing_last_name + '</strong><br>';
            if (isNullUndefAndSpace(_json._billing_address_1)) _html += _json._billing_address_1 + '<br>';
            if (isNullUndefAndSpace(_json._billing_address_2)) _html += _json._billing_address_2 + '<br>';
            _html += _json._billing_city + ', ' + _json._billing_state + ' ' + _json._billing_postcode + ' ' + _json._billing_country + '<br>';
            _html += 'Phone: ' + _json._billing_phone + '<br>';
            _html += 'Email: ' + _json._billing_email;
            $(".order-id").data('email', _json._billing_email); $(".order-id").data('name', _json._billing_first_name);
            $(".order-billing").empty().append(_html);
            _html = '<strong>' + _json._shipping_first_name + ' ' + _json._shipping_last_name + '</strong><br>';
            if (isNullUndefAndSpace(_json._shipping_address_1)) _html += _json._shipping_address_1 + '<br>';
            if (isNullUndefAndSpace(_json._shipping_address_2)) _html += _json._shipping_address_2 + '<br>';
            _html += _json._shipping_city + ', ' + _json._shipping_state + ' ' + _json._shipping_postcode + ' ' + _json._shipping_country;
            $(".order-shipping").empty().append(_html);

            ///Payment
            $(".order-payment").text(_json._payment_method_title); $(".order-payment").data('pt', _json._payment_method);
            $(".order-amount").text(formatCurrency(_json._order_total)); $(".order-tax").text(formatCurrency(_json._order_tax));
        });

        _html = '';
        let _tax = [];
        let zQty = 0.00, zGAmt = 0.00, zTDiscount = 0.00, zTotalTax = 0.00, zFeeAmt = 0.00, zSRFAmt = 0.00, zShippingAmt = 0.00, zGiftCardAmt = 0.00, zGiftCardrefundAmt = 0.00, zStateRecyclingAmt = 0.00, zRefundAmt = 0.00;
        $.each(response['order_detail'], function (i, row) {
            let _sub_total = parseFloat(row.line_subtotal) || 0.00, _qty = parseFloat(row.qty) || 0.00, _total = parseFloat(row.line_total) || 0.00;
            let _price = _qty > 0 ? (_sub_total / _qty) : 0;
            let _dis = _sub_total - _total;
            let _ticket_no = parseInt(row.ticket_no) || 0;
            if (row.order_item_type == 'line_item') {
                _html += '<tr class="fw-bolder text-gray-700 fs-5" data-id="' + row.order_item_id + '" data-qty="' + row.qty + '" data-returndays="' + row.returndays + '" data-warrantydays="' + row.warrantydays + '">';
                if (_sub_total > 0 && _ticket_no == 0) _html += '<td class="pt-6"><input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="ClaimWarranty(this)" value="0" data-id="' + row.order_item_id + '" data-name="' + row.order_item_name + '" data-qty="' + row.qty + '"><label></label></td>';
                else _html += '<td class="pt-6"></td>';
                _html += '<td class="d-flex align-items-center">';
                _html += '<div class="symbol symbol-50px overflow-hidden me-3"><span class="symbol-label" style="background-image:url(' + row.p_img + ');"></span></div>';
                _html += '<div class="d-flex flex-column">' + row.order_item_name + '<span class="text-muted fw-bold d-block fs-7"></div></td>';
                _html += '<td class="text-end pt-6">' + formatCurrency(_price) + '</td>';
                _html += '<td class="text-end pt-6">' + _qty.toFixed(0) + '</td>';
                _html += '<td class="text-end pt-6">' + formatCurrency(_dis) + '</td>';
                _html += '<td class="text-end pt-6">' + formatCurrency(row.line_total) + '</td>';
                _html += '<td class="text-end pt-6">' + formatCurrency(row.tax) + '</td>';
                _html += '</tr>';

                /// show other details
                _html += '<tr>';
                _html += '<td colspan="7" class="pt-0">';
                _html += '<div class="notice bg-light-primary rounded border-primary border border-dashed text-muted fw-bold d-block d-flex flex-stack fs-7 p-6">';
                _html += '<div>';
                if (isNullUndefAndSpace(row.remarks)) {
                    let _warranty = JSON.parse(row.remarks);
                    $.each(_warranty, function (key, val) { _html += val + '<br/>'; });
                }
                if (row.warrantydays > 0 && row.warrantydays < 9999) {
                    let _date = moment($(".order-date").text(), "MM/DD/YYYY");
                    let _todate = moment(_date, 'MM/DD/YYYY').add(row.warrantydays, 'days');
                    let _days = _todate.diff(moment(), 'days');
                    if (_days > 0) _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Warranty ' + row.warrantydays + ' days<span class="fs-7 text-success d-flex align-items-center"><span class="bullet bullet-dot bg-success mx-2"></span>Remaining ' + _days + ' days</span></div>';
                    else _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Warranty ' + row.warrantydays + ' days<span class="fs-7 text-danger d-flex align-items-center"><span class="bullet bullet-dot bg-danger mx-2"></span>Warranty Expired</span></div>';
                }
                else if (row.warrantydays >= 9999) {
                    let _date = moment($(".order-date").text(), "MM/DD/YYYY");
                    let _todate = moment(_date, 'MM/DD/YYYY').add(10, 'years');
                    let _days = _todate.diff(moment(), 'days');
                    if (_days > 0) _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Warranty 10 Years<span class="fs-7 text-success d-flex align-items-center"><span class="bullet bullet-dot bg-success mx-2"></span>Remaining ' + _todate.diff(moment(), 'days') + ' days</span></div>';
                    else _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Warranty 10 Years<span class="fs-7 text-danger d-flex align-items-center"><span class="bullet bullet-dot bg-danger mx-2"></span>Warranty Expired</span></div>';
                }
                if (row.returndays > 0 && row.returndays < 9999) {
                    let _date = moment($(".order-date").text(), "MM/DD/YYYY");
                    let _todate = moment(_date, 'MM/DD/YYYY').add(row.returndays, 'days');
                    let _days = _todate.diff(moment(), 'days');
                    if (_days > 0) _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Returns/Refunds ' + row.returndays + ' days<span class="fs-7 text-success d-flex align-items-center"><span class="bullet bullet-dot bg-success mx-2"></span>Remaining ' + _days + ' days</span></div>';
                    else _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Returns/Refunds ' + row.returndays + ' days<span class="fs-7 text-danger d-flex align-items-center"><span class="bullet bullet-dot bg-danger mx-2"></span>Warranty Expired</span></div>';
                }
                else if (row.returndays >= 9999) {
                    let _date = moment($(".order-date").text(), "MM/DD/YYYY");
                    let _todate = moment(_date, 'MM/DD/YYYY').add(10, 'years');
                    let _days = _todate.diff(moment(), 'days');
                    if (_days > 0) _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Returns/Refunds 10 Years<span class="fs-7 text-success d-flex align-items-center"><span class="bullet bullet-dot bg-success mx-2"></span>Remaining ' + _todate.diff(moment(), 'days') + ' days</span></div>';
                    else _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Returns/Refunds 10 Years<span class="fs-7 text-danger d-flex align-items-center"><span class="bullet bullet-dot bg-danger mx-2"></span>Warranty Expired</span></div>';
                }
                _html += '</div>';
                _html += '<div class="order-claim-warranty-' + row.order_item_id + '">';
                if (row.ticket_no) {
                    _html += '<a class="fw-bolder text-dark fs-5 text-hover-primary" onclick="WarrantyInfoModal(' + row.ticket_no + ',\'' + row.ticket_action + '\');">Ticket No.: #' + row.ticket_no + '</a>';
                    _html += '<div class="fs-7 text-muted">Ticket Date: ' + moment(row.ticket_date).format("MM/DD/YYYY") + '</div>';
                    _html += '<div class="fs-7 text-muted">' + row.reason + '</div>';
                    if (row.ticket_action == 'SR') _html += '<span class="fs-5 text-success">Send to Retention</span>';
                    else if (row.ticket_action == 'RT') _html += '<span class=fs-5 text-success">Create Return</span>';
                    else if (row.ticket_action == 'RP') _html += '<span class=fs-5 text-success">Create Replacement</span>';
                    else if (row.ticket_action == 'CO') _html += '<span class=fs-5 text-success">Create new order</span>';
                    else _html += '<span class="fs-5 text-warning">Processing</span>';
                }
                _html += '</div>';

                _html += '</div>';
                _html += '</td>';
                _html += '</tr>';

                zQty += _qty; zGAmt += _sub_total;
                zTotalTax += (parseFloat(row.tax) || 0.00);
                zTDiscount += _dis;
            }
            else if (row.order_item_type == 'fee' && row.order_item_name == 'State Recycling Fee') { zSRFAmt += _total; }
            else if (row.order_item_type == 'fee' && row.order_item_name != 'State Recycling Fee') { zFeeAmt += _total; }
            else if (row.order_item_type == 'shipping') { zShippingAmt += _total; }
            else if (row.order_item_type == 'gift_card') { zGiftCardAmt += _total; }
            else if (row.order_item_type == 'tax') { _tax.push({ order_item_id: row.order_item_id, name: row.order_item_name, label: row.label, rate: row.tax, amount: _total }); }
            else if (row.order_item_type == 'coupon') {
                _coupon += '<li class="nav-item mb-3 me-3 me-lg-6">';
                _coupon += '<a class="nav-link btn btn-outline btn-flex btn-color-muted btn-active-color-primary flex-column overflow-hidden h-85px pt-5 pb-2 active" data-bs-toggle="pill" href="javascript;void(0);">';
                _coupon += '<div class="nav-icon mb-3"><i class="fa fa-gift"></i>$' + row.discount_amount + '</div>';
                _coupon += '<span class="nav-text text-gray-800 fw-bolder fs-6 lh-1">' + row.order_item_name + '</span>';
                _coupon += '<span class="bullet-custom position-absolute bottom-0 w-100 h-4px bg-primary"></span > ';
                _coupon += '</a>';
                _coupon += '</li>';
            }
            else if (row.order_item_type == 'refund') {
                _refundHtml += '<tr class="fw-bolder text-gray-700 fs-5" data-id="' + row.order_item_id + '" data-qty="0" data-returndays="0" data-warrantydays="0">';
                _refundHtml += '<td></td>';
                _refundHtml += '<td class="d-flex align-items-center pt-6">';
                _refundHtml += '<div class="symbol symbol-50px overflow-hidden me-3"><span class="symbol-label"></span></div>';
                _refundHtml += '<div class="d-flex flex-column">' + row.order_item_name + '<span class="text-muted fw-bold d-block fs-7">';
                _refundHtml += '</span><span class="text-muted fw-bold d-block fs-7 order-claim-warranty"><span class="text-muted fw-bold d-block fs-7"></div></td>';
                _refundHtml += '<td class="text-end pt-6"></td>';
                _refundHtml += '<td class="text-end pt-6"></td>';
                _refundHtml += '<td class="text-end pt-6"></td>';
                _refundHtml += '<td class="text-end pt-6">' + formatCurrency(_total) + '</td>';
                _refundHtml += '<td class="text-end pt-6"></td>';
                _refundHtml += '</tr>';
                zRefundAmt = zRefundAmt + (_total);
            }
        });
        $("#order_items").empty().append(_html); $(".order-coupon").empty().append(_coupon); $('#order_items_refund').append(_refundHtml);

        let netpay = (zGAmt - zTDiscount - zGiftCardAmt + zShippingAmt + zTotalTax + zStateRecyclingAmt + zFeeAmt) + zRefundAmt;

        _html = '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-10 text-gray-600 fs-7">Subtotal:</div><div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(zGAmt) + '</div></div>';
        if (zTDiscount > 0) _html += '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-10 text-gray-600 fs-7">Discount:</div><div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(zTDiscount) + '</div></div>';
        if (zFeeAmt > 0) _html += _html += '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-10 text-gray-600 fs-7">Fee</div><div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(zFeeAmt) + '</div></div>';
        if (zSRFAmt > 0) _html += '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-10 text-gray-600 fs-7">State Recycling Fee</div><div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(zSRFAmt) + '</div></div>';
        if (zShippingAmt > 0) _html += '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-10 text-gray-600 fs-7">Shipping</div><div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(zShippingAmt) + '</div></div>';
        //_html += '<div class="form-group"><label class="col-sm-10 control-label">Shipping Tax</label<div class="col-sm-2 controls text-right">$<span id="shippingTaxTotal">0.00</span></div></div>';
        // Add Tax
        $.each(_tax, function (index, value) {
            _html += '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-10 text-gray-600 fs-7">' + value.label + ' - ' + (value.rate * 100).toFixed(4) + '%</div><div class="text-end fw-bolder fs-6 text-gray-800"><span class="tax-total" data-order_item_id="' + value.order_item_id + '" data-name="' + value.name + '" data-label="' + value.label + '" data-percent="' + value.rate + '" data-amount="' + value.amount.toFixed(4) + '">' + value.amount.toFixed(4) + '</span></div></div>';
        });
        if (zGiftCardAmt > 0) _html += '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-10 text-gray-600 fs-7">Gift Card</div><div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(zGiftCardAmt) + '</div></div>';
        _html += '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-10 text-gray-600 fs-7">Order Total</div><div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(zGAmt - zTDiscount - zGiftCardAmt + zShippingAmt + zTotalTax + zStateRecyclingAmt + zFeeAmt) + '</div></div>';
        //// Refund 
        if (zRefundAmt != 0) _html += '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-10 text-gray-600 fs-7">Refunded</div><div class="text-end fw-bolder fs-6 text-red">' + formatCurrency(zRefundAmt) + '</div></div>';
        //_html += '<div class="form-group refund-total"><label class="col-sm-10 control-label">Refunded By Gift Card</label><div class="col-sm-2 controls text-right text-red text-weight-bold"><strong>$<span id="refundedByGiftCard" data-orderitemid="0">0.00</span></strong></div></div>';
        _html += '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-10 text-gray-600 fs-7">Net Payment</div><div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(netpay) + '</div></div>';
        $('#order-footer').empty().append(_html);

        let _noteHtml = '';
        $.each(response['order_notes'], function (i, row) {
            //let is_customer_note = parseInt(row.is_customer_note) || 0;
            _noteHtml += '<div class="timeline-item align-items-center mb-4">';
            _noteHtml += '<div class="timeline-line w-20px mt-9 mb-n14"></div>';
            _noteHtml += '<div class="timeline-icon px-1"><span class="svg-icon svg-icon-2 svg-icon-success"><i class="fa fa-comment fa-flip-horizontal"></i></span></div>';
            _noteHtml += '<div class="timeline-content m-0">';
            _noteHtml += '   <a href="javascript:void(0)" class="fs-6 text-gray-800 fw-bolder d-block text-hover-primary">' + row.comment_content + '</a>';
            _noteHtml += '   <span class="fw-bold text-gray-400">' + row.comment_date + '</span>';
            _noteHtml += '</div>';
            _noteHtml += '</div>';
        });
        $(".order-notes").empty().append(_noteHtml);

    }).catch(err => { }).always(function () { });
}

function WarrantyInfoModal(id, _action) {
    let modalHtml = '<div class="modal-dialog p-12">';
    modalHtml += '<div class="modal-content modal-rounded">';
    modalHtml += '<div class="modal-header py-3"><h4 class="modal-title">Warranty claim detail.</h4><button type="button" class="btn btn-sm" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button></div>';
    modalHtml += '<div class="modal-body"></div>';
    modalHtml += '<div class="modal-footer py-3"></div>';
    //modalHtml += '<div class="modal-footer py-3"><button type="button" class="btn btn-sm btn-primary" data-id="' + id + '">Send to Retention</button><button type="button" class="btn btn-sm btn-primary" data-id="' + id + '">Return</button><button type="button" class="btn btn-sm btn-primary" data-id="' + id + '">Replacement</button><button type="button" class="btn btn-sm btn-primary" data-id="' + id + '">Create new order</button></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#myModal").empty().html(modalHtml);

    modalHtml = '';
    $.get('/customer-service/ticket-info', { strValue1: id }).then(response => {
        response = JSON.parse(response);
        modalHtml += '<div class="row">';
        let _chat_history = isNullUndefAndSpace(response[0].chat_history) ? JSON.parse(response[0].chat_history) : [];
        modalHtml += '<div class="col-lg-12">';
        $.each(_chat_history, function (i, row) {
            modalHtml += '<div class="row">';
            modalHtml += '<div class="col-lg-12">';
            modalHtml += '<h3 class="mb-2">' + row.from + '</h3>';
            modalHtml += '<p class="fs-6 text-gray-600 fw-bold mb-4 mb-lg-8">' + row.content + '</p>';
            modalHtml += '</div>';
            modalHtml += '</div>';
        });
        modalHtml += '</div>';
        modalHtml += '</div>';
    }).catch(err => { }).always(function () { $('#myModal .modal-body').append(modalHtml); });
    console.log(_action);
    //add action button
    if (_action == 'SR') { $('#myModal .modal-footer').empty().append('<button type="button" class="btn btn-sm btn-primary" data-id="' + id + '">Send to Retention</button>'); }
    else if (_action == 'RT') { $('#myModal .modal-footer').empty().append('<button type="button" class="btn btn-sm btn-primary" data-id="' + id + '">Return</button>'); }
    else if (_action == 'RP') { $('#myModal .modal-footer').empty().append('<button type="button" class="btn btn-sm btn-primary" data-id="' + id + '">Replacement</button>'); }
    else if (_action == 'CO') { $('#myModal .modal-footer').empty().append('<button type="button" class="btn btn-sm btn-primary" data-id="' + id + '">Create new order</button>'); }
    else { $('#myModal .modal-footer').empty().append('<div class="text-danger">Waiting for action of retention specialist.</div>'); }


    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    //$("#kt_warranty_claim").accordion({
    //    collapsible: true
    //});
}

function ClaimWarranty(chk) {
    var isChecked = $(chk).prop("checked");
    $("[name='CheckSingle']").prop("checked", false);
    $('.order-claim-warranty-' + $(chk).data('id')).empty();
    $(chk).prop("checked", isChecked);
    if (isChecked == false) $(chk).parent().parent().find('.order-claim-warranty').empty();
    else $('.order-claim-warranty-' + $(chk).data('id')).empty().append('<button type="button" id="btnclaimwarranty" class="btn btn-primary btn-sm " onclick="ClaimWarrantyModal(this);" data-id="' + $(chk).data('id') + '" data-name="' + $(chk).data('name') + '" data-qty="' + $(chk).data('qty') + '">Claim Warranty</button>');
}
function ClaimWarrantyModal(ele) {
    let modalHtml = '<div class="modal-dialog modal-fullscreen p-12">';
    modalHtml += '<div class="modal-content modal-rounded">';
    modalHtml += '<div class="modal-header py-3"><h4>Please select a reason for your warranty claim.</h4><button type="button" class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button></div>';
    modalHtml += '<div class="modal-body"></div>';
    modalHtml += '<div class="modal-footer py-3"><button type="button" id="btnGenerateTicket" class="btn btn-sm btn-primary" data-id="' + $(ele).data('id') + '" data-name="' + $(ele).data('name') + '" data-qty="' + $(ele).data('qty') + '">Generate Ticket No</button></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#myModal").empty().html(modalHtml);

    modalHtml = '<div id="kt_warranty_claim" class="card-body pt-0">';

    modalHtml += '<ul>';
    $.each(WarrantyQuestions, function (i, row) {
        modalHtml += '<li>';
        //modalHtml += '<label>';
        modalHtml += '<input type="radio" id="chk-' + i + '" class="form-check-input m-0 me-3 warranty-checkbox" name="chk-reason" data-id="' + row.id + '" data-code="' + row.code + '" data-title="' + row.title + '"/>';
        modalHtml += '<label for="chk-' + i + '">' + row.title + '</label>';
        //modalHtml += '</label>';
        modalHtml += '  <ul>';
        $.each(row.questions, function (q_i, q_row) {
            modalHtml += '<li>';
            //modalHtml += '<label>';
            if (q_row.sub_questions != null) modalHtml += '<input type="radio" class="form-check-input m-0 me-3 warranty-checkbox" id="chk-' + i + '-' + q_i + '" name="chk-' + i + '" data-id="' + q_row.id + '" data-code="' + q_row.code + '" data-title="' + q_row.title + '"/>';
            else modalHtml += '<input type="checkbox" class="form-check-input m-0 me-3 warranty-checkbox" id="chk-' + i + '-' + q_i + '" name="chk-' + i + '-' + q_i + '" data-id="' + q_row.id + '" data-code="' + q_row.code + '" data-title="' + q_row.title + '"/>';
            modalHtml += '<label for="chk-' + i + '-' + q_i + '">' + q_row.title + '</label>';
            //modalHtml += '</label>';
            modalHtml += '  <ul>';
            $.each(q_row.sub_questions, function (sq_i, sq_row) {
                modalHtml += '<li>';
                //modalHtml += '<label>';
                modalHtml += '<input type="checkbox" class="form-check-input m-0 me-3 warranty-checkbox" id="chk-' + i + '-' + q_i + '-' + sq_i + '" name="chk-' + i + '-' + q_i + '-' + sq_i + '" data-id="' + sq_row.id + '" data-code="' + sq_row.code + '" data-title="' + sq_row.title + '"/>';
                modalHtml += '<label for="chk-' + i + '-' + q_i + '-' + sq_i + '">' + sq_row.title + '</label>';
                //modalHtml += '</label>';
                modalHtml += '</li>';
            });
            modalHtml += '  </ul>';
            modalHtml += '</li>';
        });
        modalHtml += '  </ul>';
        modalHtml += '</li>';
    });
    modalHtml += '</ul>';


    //$.each(WarrantyQuestions, function (i, row) {
    //    modalHtml += '<div class="py-0" data-kt-customer-payment-method="row">';

    //    modalHtml += '<div class="py-3 d-flex flex-stack flex-wrap">';
    //    modalHtml += '  <div class="d-flex align-items-center collapsible rotate collapsed" data-id="' + i + '">';
    //    modalHtml += '      <div class="me-3 rotate-90"></div>';
    //    modalHtml += '      <div class="me-3">';
    //    modalHtml += '        <div class="d-flex align-items-center">';
    //    modalHtml += '            <div class="text-gray-800 fw-bolder"><input type="checkbox" id="rd-' + i + '" name="claimtype" class="form-check-input m-0 me-3" data-id="' + row.id + '" data-code="' + row.code + '" data-title="' + row.title + '"/><label class="form-check-label fw-bolder text-gray-800" for="rd-' + i + '"> ' + (i + 1) + '. ' + row.title + '</label></div>';
    //    //modalHtml += '            <div class="badge badge-light-primary ms-5">Primary</div>';
    //    modalHtml += '        </div>';
    //    //modalHtml += '        <div class="text-muted">Expires Dec 2024</div>';
    //    modalHtml += '      </div>';
    //    modalHtml += '  </div>';
    //    modalHtml += '</div>';

    //    modalHtml += '<div id="kt_warranty_claim_body_' + i + '" class="fs-6 ps-10 collapse">';
    //    $.each(row.questions, function (q_i, q_row) {

    //        if (q_row.sub_questions != null)
    //            modalHtml += '<div class="text-gray-800 fw-bolder"><input type="checkbox" id="rd-' + i + '-' + q_i + '" name="rd-' + i + '" class="form-check-input m-0 me-3" data-id="' + row.id + '" data-code="' + row.code + '" data-title="' + row.title + '"/><label class="custom-control-label m-2" for="rd-' + i + '-' + q_i + '"> ' + (q_i + 1) + '. ' + q_row.title + '</label>';
    //        else
    //            modalHtml += '<div class="text-gray-800 fw-bolder"><input type="checkbox" id="chk-' + i + '-' + q_i + '" class="form-check-input" data-id="' + row.id + '" data-code="' + row.code + '" data-title="' + row.title + '"/><label class="custom-control-label m-2" for="chk-' + i + '-' + q_i + '"> ' + (q_i + 1) + '. ' + q_row.title + '</label>';

    //        $.each(q_row.sub_questions, function (sq_i, sq_row) {
    //            modalHtml += '<div class="text-gray-800 px-8"><input type="checkbox" id="chk-' + i + '-' + q_i + '-' + sq_i + '" class="form-check-input" data-id="' + row.id + '" data-code="' + row.code + '"/><label class="custom-control-label m-2" for="chk-' + i + '-' + q_i + '-' + sq_i + '"> ' + (sq_i + 1) + '. ' + sq_row.title + '</label></div>';
    //        });
    //        modalHtml += '</div>';
    //    });
    //    modalHtml += '</div>';

    //    modalHtml += '</div><div class="separator separator-dashed"></div>';
    //});
    modalHtml += '</div>';

    $('#myModal .modal-body').append(modalHtml);
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    //$("#kt_warranty_claim").accordion({
    //    collapsible: true
    //});

    $('#kt_warranty_claim .collapsed').on('click', function () {
        $('#kt_warranty_claim .collapse').removeClass('show');
        $('#kt_warranty_claim_body_' + $(this).data('id')).addClass('show');
    });
    $('.warranty-checkbox').change(function (e) {
        var checked = $(this).prop("checked"), container = $(this).parent(), siblings = container.siblings();
        if ($(this).attr('type') == 'radio') $('.warranty-checkbox').prop("checked", false);
        $('.warranty-checkbox').not($(this).parent('li').parent('ul').find('.warranty-checkbox:checked')).prop("checked", false);
        container.find('.warranty-checkbox').prop({ indeterminate: false, checked: checked });
        function checkSiblings(el) {
            var parent = el.parent().parent(), all = true;
            console.log(parent);
            el.siblings().each(function () {
                let returnValue = all = ($(this).children('.warranty-checkbox').prop("checked") === checked);
                return returnValue;
            });
            if (all && checked) {
                //parent.children('.warranty-checkbox').prop({ indeterminate: false, checked: checked });
                parent.children('.warranty-checkbox').prop("checked", checked);
                checkSiblings(parent);

            } else if (all && !checked) {
                parent.children('.warranty-checkbox').prop("checked", checked);
                parent.children('.warranty-checkbox').prop("indeterminate", (parent.find('.warranty-checkbox:checked').length > 0));
                checkSiblings(parent);
            } else {
                el.parents("li").children('.warranty-checkbox').prop({ indeterminate: true, checked: true });
            }
        }
        checkSiblings(container);
    });
}

function GenerateTicketNo() {
    let _chk = $("input[name='chk-reason']:checked");
    let _user = $(".order-id").data('name'), _reason = _chk.data('title'), _reason_code = _chk.data('code');
    let _questions = '';
    _chk.parents('li').find('ul').find('.warranty-checkbox:checked').each(function (i, row) {
        //console.log(i, row);
        //_questions.push({ pkey: $(row).attr("id"), id: $(row).data('id'), title: $(row).data('title') });
        if (i == 0) _questions += $(row).data('title') + ' <br/>';
        else _questions += '    🗸   ' + $(row).data('title') + ' <br/>';
    });

    let _chat = [{ from: _user, content: 'Name: ' + $("#btnGenerateTicket").data('name') },
    { from: 'Help Desk', content: 'Please select a reason for your warranty claim.' },
    { from: _user, content: _reason }, { from: _user, content: _questions }];
    let option = {
        id: 0, email: $(".order-id").data('email'), verification_code: '', order_item_name: $("#btnGenerateTicket").data('name'), order_item_size: '', order_item_color: '', order_item_qty: parseInt($("#btnGenerateTicket").data('qty')) || 0, order_item_sku: '',
        chat_public: '', chat_internal: '', chat_history: JSON.stringify(_chat), reason_code: _reason_code, reason: _reason, order_id: parseInt($(".order-id").data('order_id')) || 0, order_item_id: parseInt($("#btnGenerateTicket").data('id')) || 0,
    };
    let _body = TicketMailDetails(_user, _chat);
    //console.log(option, _questions); return false;
    swal.queue([{
        title: '', confirmButtonText: 'Yes, do it!', text: "Generate ticket number.",
        showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                let _obj = { strValue1: JSON.stringify(option), strValue2: option.email, strValue3: _body };
                $.ajax(
                    {
                        method: "POST", timeout: 0, headers: { "Content-Type": "application/json" },
                        url: "/customer-service/generate-ticket", data: JSON.stringify(_obj)
                    }
                ).done(function (result) {
                    result = JSON.parse(result);
                    if (result[0].response == 'success') {
                        $("#myModal").modal('hide');
                        swal('Success', 'Thank you for submitting your warranty claim. For reference, your ticket number is #' + result[0].id + '. Your warranty claim will be processed within the next 3 business days.', "success");
                    }
                    else { swal('Error', 'Something went wrong, please try again.', "error"); }
                }).catch(err => { swal.hideLoading(); swal('Error!', 'Something went wrong, please try again.', 'error'); });
            });
        }
    }]);
    return false;
}

function TicketMailDetails(name, chat_history) {
    let _body = 'Hi there ' + name + ', we\'re sorry that you are having an issue with your Layla product, and thank you for bringing it to our attention with your warranty request.<br/><br/>';
    _body += 'We will work diligently to get this resolved for you as soon as possible, and a Layla warranty specialist will get back to you regarding your claim within 3 business days.<br/><br/>';
    _body += '<b>Here is what happens next:</b><br/><br/>';
    _body += 'Warranty Claim Review: We will review your claim details, photos, and any other evidence submitted pertaining to your claim<br/><br/>';
    _body += 'Request for Additional Information (possible): If deemed necessary, we may reach out to you for further evidence and/or explanation of your warranty issue<br/><br/>';
    _body += 'Decision Rendered: We will inform you of the decision made on your warranty claim and advise you of next steps<br/><br/>';
    _body += 'Corrective Action: Contingent upon the approval of your claim, we will set a course of corrective action which may include replacing the product entirely, repairing the product, or replacing a component, or components, of the product<br/><br/>';
    _body += 'Again, we\'re sorry you\'re having a product issue and we are committed to resolving this as quickly and thoroughly as possible.<br/><br/><br/>';
    _body += '<b>Chat History</b><br/><br/>';
    $.each(chat_history, function (i, row) {
        _body += '<b>' + row.from + ':</b> ' + row.content + '<br/>';
    });
    _body += '<br/><b>Help Desk <br/>';
    return _body;
}