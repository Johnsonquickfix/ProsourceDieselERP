$(document).ready(function () {
    $("#loader").hide();
    $("#ddlUser").select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Search Customer",
        ajax: {
            url: '/customer-service/customer-list', type: "GET", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { return { strValue1: 'USER', strValue2: params.term }; },
            processResults: function (data) {
                var jobj = JSON.parse(data);
                return {
                    results: $.map(jobj, function (item) {
                        return {
                            text: item.user_email, id: item.id,
                            html: '<div style="display:flex;"><div style="padding:5px" ><div style="font-size: 1.2em">#' + item.id + ' ' + item.user_login + '</div><div><b>' + item.user_email + '</b></div></div></div >'
                        }
                    })
                };
            },
            error: function (xhr, status, err) { }, cache: true
        },
        templateResult: function (data) { return data.html; }, escapeMarkup: function (m) { return m; }
    });
    $(document).on("change", "#ddlUser", function (t) {
        t.preventDefault();
        let cus_id = parseInt($(this).val()) || 0;
        $.when(dataGridLoad()).done(function () { CustomerInfo(cus_id, 0, '') });
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
        $.when(dataGridLoad()).done(function () { CustomerInfo(0, 0, $('#ddlEmail').val()) });
    });
    $(document).on("click", "#btnSearch", function (t) {
        t.preventDefault();
        let cus_id = parseInt($('#ddlUser').val()) || 0, ord_id = parseInt($('#txtOrderNo').val()) || 0;
        $.when(dataGridLoad()).done(function () { CustomerInfo(cus_id, ord_id, $('#ddlEmail').val()) });
    });
    $(document).on("keypress", "#txtOrderNo", function (t) {
        if (t.keyCode == 13) {
            //t.preventDefault();
            let cus_id = parseInt($('#ddlUser').val()) || 0, ord_id = parseInt($('#txtOrderNo').val()) || 0;
            $.when(dataGridLoad()).done(function () { CustomerInfo(cus_id, ord_id, $('#ddlEmail').val()) });
        }
    });
    $.when(dataGridLoad()).done(function () { OrderInfo(0) });//903954
});
function isNullUndefAndSpace(variable) { return (variable !== null && variable !== undefined && variable !== 'undefined' && variable !== 'null' && variable.length !== 0); }
function formatCurrency(total) {
    var neg = false;
    if (total < 0) { neg = true; total = Math.abs(total); }
    return (neg ? "-$" : '$') + parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
}

function CustomerInfo(cus_id, ord_id, cus_email) {
    $(".profile-username,.profile-useremail,.billing-address,.shipping-address").text('-');
    if (cus_id == 0 && ord_id == 0 && cus_email == null) return false;
    $.get('/customer-service/customer-info', { strValue1: cus_id, strValue2: ord_id, strValue3: cus_email }).then(response => {
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
            aoData.push({ name: "strValue1", value: cus_id }, { name: "strValue2", value: order_id }, { name: "strValue3", value: $('#ddlEmail').val() });
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
            { data: 'num_items_sold', title: 'No. of Items', sWidth: "10%" },
            {
                data: 'total_sales', title: 'Order Total', sWidth: "10%", render: function (id, type, row, meta) {
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
                'data': 'id', title: 'Action', sWidth: "8%", 'render': function (id, type, row, meta) {
                    return '<a href="javascript:void(0);" onclick="OrderInfo(' + id + ');" data-toggle="tooltip" title="View/Edit Order"><i class="glyphicon glyphicon-eye-open"></i></a>'
                }
            }
        ]
    });
}

function backOrderList() { $("#list-page").removeClass('hidden'); $("#detail-page").addClass('hidden'); }
function OrderInfo(ord_id) {
    //$("#detail-page").empty();
    if (ord_id == 0) return false;
    $("#list-page").addClass('hidden'); $("#detail-page").removeClass('hidden');
    $.post('/customer-service/order', { strValue1: ord_id }).then(response => {
        response = JSON.parse(response); //console.log(response);
        let _html = '', _coupon = '';
        $.each(response['order'], function (i, row) {
            //Add header
            $(".order-id").text('Order #' + row.order_id); $(".order-date").text(row.date_created); $(".order-status").text(row.status_desc);
            $(".order-right-id").empty().append('Order #' + row.order_id + '<a href="javascript:void(0);" class="btn btn-primary btn-sm float-right" onclick="backOrderList();">Back To List</a>');
            //Add Address
            let _json = JSON.parse(row.order_details); //console.log(_json);
            _html = '<strong>' + _json._billing_first_name + ' ' + _json._billing_last_name + '</strong><br>';
            if (isNullUndefAndSpace(_json._billing_address_1)) _html += _json._billing_address_1 + '<br>';
            if (isNullUndefAndSpace(_json._billing_address_2)) _html += _json._billing_address_2 + '<br>';
            _html += _json._billing_city + ', ' + _json._billing_state + ' ' + _json._billing_postcode + ' ' + _json._billing_country + '<br>';
            _html += 'Phone: ' + _json._billing_phone + '<br>';
            _html += 'Email: ' + _json._billing_email;
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
            if (row.order_item_type == 'line_item') {
                _html += '<tr class="fw-bolder text-gray-700 fs-5" data-id="' + row.order_item_id + '" data-qty="' + row.qty + '" data-returndays="' + row.returndays + '" data-warrantydays="' + row.warrantydays + '">';
                if (_sub_total > 0) _html += '<td><input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="ClaimWarranty(this)" value="0"><label></label></td>';
                else _html += '<td></td>';
                _html += '<td class="d-flex align-items-center pt-6">';
                _html += '<div class="symbol symbol-50px overflow-hidden me-3"><span class="symbol-label" style="background-image:url(' + row.p_img + ');"></span></div>';
                _html += '<div class="d-flex flex-column">' + row.order_item_name + '<span class="text-muted fw-bold d-block fs-7">';
                if (isNullUndefAndSpace(row.remarks)) {
                    let _warranty = JSON.parse(row.remarks);
                    $.each(_warranty, function (key, val) { _html += val + '<br/>'; });
                }
                if (row.warrantydays > 0 && row.warrantydays < 9999) {
                    let _date = moment($(".order-date").text(), "MM/DD/YYYY");
                    let _todate = moment(_date, 'MM/DD/YYYY').add(row.warrantydays, 'days');
                    let _days = _todate.diff(moment(), 'days');
                    if (_days > 0)
                        _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Warranty ' + row.warrantydays + ' days<span class="fs-7 text-success d-flex align-items-center"><span class="bullet bullet-dot bg-success mx-2"></span>Remaining ' + _days + ' days</span></div>';
                    else
                        _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Warranty ' + row.warrantydays + ' days<span class="fs-7 text-danger d-flex align-items-center"><span class="bullet bullet-dot bg-danger mx-2"></span>Warranty Expired</span></div>';
                }
                else if (row.warrantydays >= 9999) {
                    let _date = moment($(".order-date").text(), "MM/DD/YYYY");
                    let _todate = moment(_date, 'MM/DD/YYYY').add(10, 'years');
                    let _days = _todate.diff(moment(), 'days');
                    if (_days > 0)
                        _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Warranty 10 Years<span class="fs-7 text-success d-flex align-items-center"><span class="bullet bullet-dot bg-success mx-2"></span>Remaining ' + _todate.diff(moment(), 'days') + ' days</span></div>';
                    else
                        _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Warranty 10 Years<span class="fs-7 text-danger d-flex align-items-center"><span class="bullet bullet-dot bg-danger mx-2"></span>Warranty Expired</span></div>';
                }
                if (row.returndays > 0 && row.returndays < 9999) {
                    let _date = moment($(".order-date").text(), "MM/DD/YYYY");
                    let _todate = moment(_date, 'MM/DD/YYYY').add(row.returndays, 'days');
                    let _days = _todate.diff(moment(), 'days');
                    if (_days > 0)
                        _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Returns/Refunds ' + row.returndays + ' days<span class="fs-7 text-success d-flex align-items-center"><span class="bullet bullet-dot bg-success mx-2"></span>Remaining ' + _days + ' days</span></div>';
                    else
                        _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Returns/Refunds ' + row.returndays + ' days<span class="fs-7 text-danger d-flex align-items-center"><span class="bullet bullet-dot bg-danger mx-2"></span>Warranty Expired</span></div>';
                }
                else if (row.returndays >= 9999) {
                    let _date = moment($(".order-date").text(), "MM/DD/YYYY");
                    let _todate = moment(_date, 'MM/DD/YYYY').add(10, 'years');
                    let _days = _todate.diff(moment(), 'days');
                    if (_days > 0)
                        _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Returns/Refunds 10 Years<span class="fs-7 text-success d-flex align-items-center"><span class="bullet bullet-dot bg-success mx-2"></span>Remaining ' + _todate.diff(moment(), 'days') + ' days</span></div>';
                    else
                        _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Returns/Refunds 10 Years<span class="fs-7 text-danger d-flex align-items-center"><span class="bullet bullet-dot bg-danger mx-2"></span>Warranty Expired</span></div>';
                }
                _html += '</span><span class="text-muted fw-bold d-block fs-7 order-claim-warranty"><span class="text-muted fw-bold d-block fs-7"></div></td>';
                _html += '<td class="text-end pt-6">' + formatCurrency(_price) + '</td>';
                _html += '<td class="text-end pt-6">' + _qty.toFixed(0) + '</td>';
                _html += '<td class="text-end pt-6">' + formatCurrency(_dis) + '</td>';
                _html += '<td class="text-end pt-6">' + formatCurrency(row.line_total) + '</td>';
                _html += '<td class="text-end pt-6">' + formatCurrency(row.tax) + '</td>';
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
        });
        $("#order_items").empty().append(_html); $(".order-coupon").empty().append(_coupon);

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
        //_html += '<div class="form-group refund-total"><label class="col-sm-10 control-label">Refunded</label><div class="col-sm-2 controls text-right text-red text-weight-bold"><strong>$<span id="refundedTotal">0.00</span></strong></div></div>';
        //_html += '<div class="form-group refund-total"><label class="col-sm-10 control-label">Refunded By Gift Card</label><div class="col-sm-2 controls text-right text-red text-weight-bold"><strong>$<span id="refundedByGiftCard" data-orderitemid="0">0.00</span></strong></div></div>';
        //_html += '<div class="form-group refund-total"><label class="col-sm-10 control-label">Net Payment</label><div class="col-sm-2 controls text-right text-weight-bold"><strong>$<span id="netPaymentTotal">0.00</span></strong></div></div>';
        $('#order-footer').empty().append(_html);
    }).catch(err => { }).always(function () { });
}
function ClaimWarranty(chk) {
    var isChecked = $(chk).prop("checked");
    $("[name='CheckSingle']").prop("checked", false);
    $("[name='CheckSingle']").parent().parent().find('.order-claim-warranty').empty();
    $(chk).prop("checked", isChecked);
    if (isChecked == false) $(chk).parent().parent().find('.order-claim-warranty').empty();
    else $(chk).parent().parent().find('.order-claim-warranty').empty().append('<button type="button" id="btnclaimwarranty" class="btn btn-primary btn-sm " onclick="ClaimWarrantyModal(this);">Claim Warranty</button>');
}
function ClaimWarrantyModal() {
    let modalHtml = '<div class="modal-dialog">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    modalHtml += '<h4 class="modal-title" id="myModalLabel">Please select a reason for your warranty claim.</h4>';
    modalHtml += '</div>';
    modalHtml += '<div class="modal-body"></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#myModal").empty().html(modalHtml);

    modalHtml = '<div class="row row-cols-1 row-cols-md-3 row-cols-lg-1 row-cols-xl-3 g-9">';
    modalHtml += '<div class="col">';
    modalHtml += '<label class="btn btn-outline btn-outline-dashed btn-outline-default d-flex text-start p-3" data-kt-button="true">';
    modalHtml += '<span class="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1"><input class="form-check-input" type="radio" name="discount_option" value = "1" checked = "checked"></span>';
    modalHtml += '<span class="ms-3"><span class="fs-7 fw-bolder text-gray-800 d-block">Sagging</span></span>';
    modalHtml += '</label>';
    modalHtml += '</div>';

    modalHtml += '<div class="col">';
    modalHtml += '<label class="btn btn-outline btn-outline-dashed btn-outline-default d-flex text-start p-3" data-kt-button="true">';
    modalHtml += '<span class="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1"><input class="form-check-input" type="radio" name="discount_option" value = "0"></span>';
    modalHtml += '<span class="ms-3"><span class="fs-7 fw-bolder text-gray-800 d-block">Tear / Hole</span></span>';
    modalHtml += '</label>';
    modalHtml += '</div>';

    modalHtml += '<div class="col">';
    modalHtml += '<label class="btn btn-outline btn-outline-dashed btn-outline-default d-flex text-start p-3" data-kt-button="true">';
    modalHtml += '<span class="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1"><input class="form-check-input" type="radio" name="discount_option" value = "0"></span>';
    modalHtml += '<span class="ms-3"><span class="fs-7 fw-bolder text-gray-800 d-block">Stain on cover</span></span>';
    modalHtml += '</label>';
    modalHtml += '</div>';

    modalHtml += '<div class="col">';
    modalHtml += '<label class="btn btn-outline btn-outline-dashed btn-outline-default d-flex text-start p-3" data-kt-button="true">';
    modalHtml += '<span class="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1"><input class="form-check-input" type="radio" name="discount_option" value = "0"></span>';
    modalHtml += '<span class="ms-3"><span class="fs-7 fw-bolder text-gray-800 d-block">Expansion</span></span>';
    modalHtml += '</label>';
    modalHtml += '</div>';

    modalHtml += '<div class="col">';
    modalHtml += '<label class="btn btn-outline btn-outline-dashed btn-outline-default d-flex text-start p-3" data-kt-button="true">';
    modalHtml += '<span class="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1"><input class="form-check-input" type="radio" name="discount_option" value = "0"></span>';
    modalHtml += '<span class="ms-3"><span class="fs-7 fw-bolder text-gray-800 d-block">Broken Zipper</span></span>';
    modalHtml += '</label>';
    modalHtml += '</div>';

    modalHtml += '<div class="col">';
    modalHtml += '<label class="btn btn-outline btn-outline-dashed btn-outline-default d-flex text-start p-3" data-kt-button="true">';
    modalHtml += '<span class="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1"><input class="form-check-input" type="radio" name="discount_option" value = "0"></span>';
    modalHtml += '<span class="ms-3"><span class="fs-7 fw-bolder text-gray-800 d-block">Dimensions</span></span>';
    modalHtml += '</label>';
    modalHtml += '</div>';

    modalHtml += '<div class="col">';
    modalHtml += '<label class="btn btn-outline btn-outline-dashed btn-outline-default d-flex text-start p-3" data-kt-button="true">';
    modalHtml += '<span class="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1"><input class="form-check-input" type="radio" name="discount_option" value = "0"></span>';
    modalHtml += '<span class="ms-3"><span class="fs-7 fw-bolder text-gray-800 d-block">Defective / Cracked Foam</span></span>';
    modalHtml += '</label>';
    modalHtml += '</div>';

    modalHtml += '<div class="col">';
    modalHtml += '<label class="btn btn-outline btn-outline-dashed btn-outline-default d-flex text-start p-3" data-kt-button="true">';
    modalHtml += '<span class="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1"><input class="form-check-input" type="radio" name="discount_option" value = "0"></span>';
    modalHtml += '<span class="ms-3"><span class="fs-7 fw-bolder text-gray-800 d-block">Pilling / Fraying on Cover</span></span>';
    modalHtml += '</label>';
    modalHtml += '</div>';

    modalHtml += '<div class="col">';
    modalHtml += '<label class="btn btn-outline btn-outline-dashed btn-outline-default d-flex text-start p-6" data-kt-button="true">';
    modalHtml += '<span class="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1"><input class="form-check-input" type="radio" name="discount_option" value = "0"></span>';
    modalHtml += '<span class="ms-3"><span class="fs-7 fw-bolder text-gray-800 d-block">Custom Reason</span></span>';
    modalHtml += '</label>';
    modalHtml += '</div>';

    modalHtml += '</div>';
   

    $('#myModal .modal-body').append(modalHtml);
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
}