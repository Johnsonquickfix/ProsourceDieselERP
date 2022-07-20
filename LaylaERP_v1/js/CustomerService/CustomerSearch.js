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
    $.when(SearchDefault(), dataGridLoad()).done(function () { OrderInfo(0) });//903954
    $(document).on("click", "#btnGenerateTicket", function (t) {
        t.preventDefault(); GenerateTicketNo();
    });
    $("#myModal").on("change", "#ddlshipcountry", function (t) { t.preventDefault(); let obj = { id: $("#ddlshipcountry").val() }; BindStateCounty("ddlshipstate", obj); $("#ddlshipcountry,#ddlshipstate").select2({ dropdownParent: $("#myModal") }); });
    $("#myModal").on("change", "#ddlshipstate", function (t) { t.preventDefault(); GetTaxRate() });
    $("#myModal").on("blur", "#txtshipzipcode", function (t) {
        t.preventDefault();
        if ($("#ddlshipcountry").val() == 'US') { GetCityByZip($(this).val(), $("#txtshipcity"), $("#ddlshipstate"), $("#ddlshipcountry"), $("#txtshipzipcode")); }
    });
    $("#myModal").on("change", "#ddlorderitem", function (t) {
        t.preventDefault(); let vr = $(this).val().split('$');
        let pid = parseInt(vr[0]) || 0, vid = parseInt(vr[1]) || 0;
        getItemList(pid, vid);
    });
    $("#myModal").on("change", "#ddlPaymentMethod", function (t) {
        t.preventDefault();
        if ($("#ddlPaymentMethod").val() == "podium") { $('.podiumchannel').removeClass('hidden'); }
        else { $('.podiumchannel').addClass('hidden'); }
    });
    lightbox.option({ resizeDuration: 200, wrapAround: true, showImageNumberLabel: false, alwaysShowNavOnTouchDevices: true });
    //$("#myModal").on("click", "[name='box_is_opened']", function (t) { $("[name='box_is_opened']").not(this).prop("checked", false) });
});
function isNullUndefAndSpace(variable) { return (variable !== null && variable !== undefined && variable !== 'undefined' && variable !== 'null' && variable.length !== 0); }
function formatCurrency(total) {
    var neg = false;
    if (total < 0) { neg = true; total = Math.abs(total); }
    return (neg ? "-$" : '$') + parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
}
function ValidateMaxValue(value, min, max) {
    if (parseInt(value) < min || isNaN(value)) return 0;
    else if (parseInt(value) > max) return max;
    else return value;
}
///Search Control
function SearchDefault() {
    let searchText = localStorage.getItem('_search');
    if (searchText != '') { SearchByControl(3); }
    $('#txtOrderNo').val(searchText); localStorage.setItem('_search', '');
}
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
    $.ajaxSetup({ async: true });
    $.get('/customer-service/customer-info', { strValue1: cus_id, strValue2: ord_id, strValue3: isNullUndefAndSpace(cus_email) ? cus_email : '', strValue4: isNullUndefAndSpace(phone_no) ? phone_no : '' }).then(response => {
        response = JSON.parse(response); //console.log(response);
        if (response.length == 0) { $(".profile-username").text('Guest'); $(".profile-useremail,.billing-address,.shipping-address").text('-'); }
        $.each(response, function (i, row) {
            $(".profile-username").text(row.user_login); $(".profile-useremail").text(row.user_email);
            let _detail = JSON.parse(row.user_details);
            let billing_Details = '<strong>' + (isNullUndefAndSpace(_detail.billing_first_name) ? _detail.billing_first_name : '') + ' ' + (isNullUndefAndSpace(_detail.billing_last_name) ? _detail.billing_last_name : '') + '</strong><br>';
            billing_Details += (isNullUndefAndSpace(_detail.billing_company) ? _detail.billing_company + '<br>' : '') + (isNullUndefAndSpace(_detail.billing_address_1) ? _detail.billing_address_1 + '<br>' : '')
                + (isNullUndefAndSpace(_detail.billing_address_2) ? _detail.billing_address_2 + '<br>' : '') + (isNullUndefAndSpace(_detail.billing_city) ? _detail.billing_city + ', ' : '') + (isNullUndefAndSpace(_detail.billing_state) ? _detail.billing_state + ' ' : '')
                + (isNullUndefAndSpace(_detail.billing_postcode) ? _detail.billing_postcode + ' ' : '') + (isNullUndefAndSpace(_detail.shipping_country) ? _detail.shipping_country : '');
            billing_Details += '<br><strong>Email address:</strong> ' + (isNullUndefAndSpace(_detail.billing_email) ? _detail.billing_email : '') + '<br><strong>Phone:</strong> ' + (isNullUndefAndSpace(_detail.billing_phone) ? _detail.billing_phone : '');
            $('.billing-address').empty().append(billing_Details);

            let shipping_Details = '<strong>' + (isNullUndefAndSpace(_detail.shipping_first_name) ? _detail.shipping_first_name : '') + ' ' + (isNullUndefAndSpace(_detail.shipping_last_name) ? _detail.shipping_last_name : '') + '</strong><br>';
            shipping_Details += (isNullUndefAndSpace(_detail.shipping_company) ? _detail.shipping_company + '<br>' : '') + (isNullUndefAndSpace(_detail.shipping_address_1) ? _detail.shipping_address_1.trim() + '<br>' : '')
                + (isNullUndefAndSpace(_detail.shipping_address_2) ? _detail.shipping_address_2 + '<br>' : '') + (isNullUndefAndSpace(_detail.shipping_city) ? _detail.shipping_city + ', ' : '') + (isNullUndefAndSpace(_detail.shipping_state) ? _detail.shipping_state + ' ' : '')
                + (isNullUndefAndSpace(_detail.shipping_postcode) ? _detail.shipping_postcode + ' ' : '') + (isNullUndefAndSpace(_detail.shipping_country) ? _detail.shipping_country : '');
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
                    if (full.post_mime_type == 'shop_order_erp' || full.post_mime_type == 'shopordererp') return '<div class="text-gray-800 fw-boldest">#' + id + '</div><i class="glyphicon glyphicon-user" title="Order created from ERP Admin." aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>';
                    else return '<div class="text-gray-800 fw-boldest">#' + id + '</div>';
                }
            },
            { data: 'first_name', title: 'Name', sWidth: "14%", render: function (id, type, row) { return '<div class="text-gray-800 fw-boldest">' + row.first_name + ' ' + row.last_name + '</div>'; } },
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
                data: 'tickets', title: 'Open Tickets', sWidth: "8%", class: '', 'render': function (id, type, row, meta) {
                    if (id != null) return '<div class="text-gray-800 fw-boldest">' + id + '</div>';
                    else return '<div class="text-gray-800 fw-boldest">-</div>';
                }
            },
            {
                data: 'id', title: 'Action', sWidth: "8%", class: 'text-center', 'render': function (id, type, row, meta) {
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
    $("#order_items,.order-coupon,#order_items_refund,.order-right-tool").empty();
    //$("#detail-page").empty();
    if (ord_id == 0) return false;
    let _order_date = moment(); $("#loader").show();
    $("#list-page").addClass('hidden'); $("#detail-page").removeClass('hidden');
    $.post('/customer-service/order', { strValue1: ord_id }).then(response => {
        response = JSON.parse(response); //console.log(response);
        let _html = '', _coupon = '', _refundHtml = '';
        $.each(response['order'], function (i, row) {
            //Add header
            $(".order-right-id").empty().append('Order #' + row.order_id + ' <a href="javascript:void(0);" onclick="OrderInfo(' + row.order_id + ');" data-toggle="tooltip" title = "Refersh Order" class="fw-boldest text-gray-600 text-hover-primary"> <i class="glyphicon glyphicon-refresh"></i></a>');
            $(".order-id").text('Order #' + row.order_id); $(".order-id").data('order_id', row.order_id); $(".order-id-comment").text('Order #' + row.order_id + ' Comments');
            _order_date = moment(row.date_created, 'MM/DD/YYYY'); $(".order-date").text(row.date_created); $(".order-status").text(row.status_desc);
            $(".order-right-tool").empty().append('<a href="javascript:void(0);" class="btn btn-primary btn-sm" onclick="StolenPackageModal(' + row.order_id + ');">Stolen Package</a> <a href="javascript:void(0);" class="btn btn-primary btn-sm" onclick="backOrderList();">Back To List</a>');
            //Add Address
            let _json = JSON.parse(row.order_details);
            _html = '<strong>' + _json._billing_first_name + ' ' + _json._billing_last_name + '</strong><br>';
            if (isNullUndefAndSpace(_json._billing_address_1)) _html += _json._billing_address_1 + '<br>';
            if (isNullUndefAndSpace(_json._billing_address_2)) _html += _json._billing_address_2 + '<br>';
            _html += _json._billing_city + ', ' + _json._billing_state + ' ' + _json._billing_postcode + ' ' + _json._billing_country + '<br>';
            _html += 'Phone: ' + _json._billing_phone + '<br>';
            _html += 'Email: ' + _json._billing_email;
            $(".order-id").data('email', _json._billing_email); $(".order-id").data('name', _json._billing_first_name + ' ' + _json._billing_last_name);
            $(".order-billing").empty().append(_html);
            _html = '<strong>' + _json._shipping_first_name + ' ' + _json._shipping_last_name + '</strong><br>';
            if (isNullUndefAndSpace(_json._shipping_address_1)) _html += _json._shipping_address_1 + '<br>';
            if (isNullUndefAndSpace(_json._shipping_address_2)) _html += _json._shipping_address_2 + '<br>';
            _html += _json._shipping_city + ', ' + _json._shipping_state + ' ' + _json._shipping_postcode + ' ' + _json._shipping_country;
            $(".order-shipping").empty().append(_html);

            ///Payment
            $(".order-payment").text(_json._payment_method_title); $(".order-payment").data('pt', _json._payment_method); $(".order-payment").data('pt_desc', _json._payment_method_title);
            $(".order-amount").text(formatCurrency(_json._order_total)); $(".order-tax").text(formatCurrency(_json._order_tax));
        });

        _html = '';
        let _tax = [];
        let zQty = 0.00, zGAmt = 0.00, zTDiscount = 0.00, zTotalTax = 0.00, zFeeAmt = 0.00, zSRFAmt = 0.00, zShippingAmt = 0.00, zGiftCardAmt = 0.00, zGiftCardrefundAmt = 0.00, zStateRecyclingAmt = 0.00, zRefundAmt = 0.00;
        $.each(response['order_detail'], function (i, row) {
            let _sub_total = parseFloat(row.line_subtotal) || 0.00, _qty = parseFloat(row.qty) || 0.00, _total = parseFloat(row.line_total) || 0.00;
            let _price = _qty > 0 ? (_sub_total / _qty) : 0;
            let _dis = _sub_total - _total;
            let _ticket_no = parseInt(row.ticket_no) || 0, orderitemid = parseInt(row.order_item_id) || 0;
            if (row.order_item_type == 'line_item') {
                _html = '<tr id="tr_' + orderitemid + '" class="fw-bolder text-gray-700" data-id="' + row.order_item_id + '" data-qty="' + row.qty + '" data-returndays="' + row.returndays + '" data-warrantydays="' + row.warrantydays + '">';
                if (_sub_total > 0 && _ticket_no == 0) _html += '<td class=""><input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="ClaimWarranty(this)" value="0" data-id="' + row.order_item_id + '" data-name="' + row.order_item_name + '" data-qty="' + row.qty + '" class="form-check-input m-3"><label></label></td>';
                else _html += '<td class=""></td>';
                _html += '<td class="d-flex align-items-center">';
                _html += '  <div class="symbol symbol-40px overflow-hidden me-3"><span class="symbol-label" style="background-image:url(' + row.p_img + ');"></span></div>';
                _html += '  <div class="d-flex flex-column min-h-40px">' + row.order_item_name + '</div></td>';
                _html += '<td class="text-end ">' + formatCurrency(_price) + '</td>';
                _html += '<td class="text-end "><div class="mb-2 fw-bolder">' + _qty.toFixed(0) + '</div><div class="refund-qty badge badge-danger fs-base"></div></td>';
                _html += '<td class="text-end ">' + formatCurrency(_dis) + '</td>';
                _html += '<td class="text-end ">' + formatCurrency(row.line_total) + '</td>';
                _html += '<td class="text-end ">' + formatCurrency(row.tax) + '</td>';
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
                    let _todate = moment(_order_date).add(row.warrantydays, 'days');
                    let _days = _todate.diff(moment(), 'days');
                    if (_days > 0) _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Warranty ' + row.warrantydays + ' days<span class="fs-7 text-success d-flex align-items-center"><span class="bullet bullet-dot bg-success mx-2"></span>Remaining ' + _days + ' days</span></div>';
                    else _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Warranty ' + row.warrantydays + ' days<span class="fs-7 text-danger d-flex align-items-center"><span class="bullet bullet-dot bg-danger mx-2"></span>Warranty Expired</span></div>';
                }
                else if (row.warrantydays >= 9999) {
                    let _todate = moment(_order_date).add(10, 'years');
                    let _days = _todate.diff(moment(), 'days');
                    if (_days > 0) _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Warranty 10 Years<span class="fs-7 text-success d-flex align-items-center"><span class="bullet bullet-dot bg-success mx-2"></span>Remaining ' + _todate.diff(moment(), 'days') + ' days</span></div>';
                    else _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Warranty 10 Years<span class="fs-7 text-danger d-flex align-items-center"><span class="bullet bullet-dot bg-danger mx-2"></span>Warranty Expired</span></div>';
                }
                if (row.returndays > 0 && row.returndays < 9999) {
                    let _todate = moment(_order_date).add(row.returndays, 'days');
                    let _days = _todate.diff(moment(), 'days');
                    if (_days > 0) _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Returns/Refunds ' + row.returndays + ' days<span class="fs-7 text-success d-flex align-items-center"><span class="bullet bullet-dot bg-success mx-2"></span>Remaining ' + _days + ' days</span></div>';
                    else _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Returns/Refunds ' + row.returndays + ' days<span class="fs-7 text-danger d-flex align-items-center"><span class="bullet bullet-dot bg-danger mx-2"></span>Warranty Expired</span></div>';
                }
                else if (row.returndays >= 9999) {
                    let _todate = moment(_order_date).add(10, 'years');
                    let _days = _todate.diff(moment(), 'days');
                    if (_days > 0) _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Returns/Refunds 10 Years<span class="fs-7 text-success d-flex align-items-center"><span class="bullet bullet-dot bg-success mx-2"></span>Remaining ' + _todate.diff(moment(), 'days') + ' days</span></div>';
                    else _html += '<div class="fw-bolder fs-6 text-gray-800 d-flex align-items-center">Returns/Refunds 10 Years<span class="fs-7 text-danger d-flex align-items-center"><span class="bullet bullet-dot bg-danger mx-2"></span>Warranty Expired</span></div>';
                }
                _html += '</div>';
                _html += '<div class="order-claim-warranty-' + row.order_item_id + '">';
                if (row.ticket_no) {
                    _html += '<a class="fw-bolder fs-5 text-primary" href="javascript:void(0);" onclick="WarrantyInfoModal(' + row.ticket_no + ',\'' + row.ticket_action + '\');">Ticket No.: #' + row.ticket_no + '</a>';
                    _html += '<div class="fs-7 text-muted">Ticket Date: ' + moment(row.ticket_date).format("MM/DD/YYYY") + '</div>';
                    _html += '<div class="fs-7 text-muted">' + row.reason + '</div>';
                    if (row.ticket_action == 'wp_return') _html += '<span class="badge badge-success fs-base">Return</span>';
                    else if (row.ticket_action == 'wp_return_to_vender') _html += '<span class="badge badge-success fs-base">Return to vendor</span>';
                    else if (row.ticket_action == 'wp_replacement') _html += '<span class="badge badge-success fs-base">Replacement</span>';
                    else if (row.ticket_action == 'wp_createorder') _html += '<span class="badge badge-success fs-base">Create new order</span>';
                    else if (row.ticket_action == 'wp_declined') _html += '<span class="badge badge-danger fs-base">Declined</span>';
                    else _html += '<span class="badge badge-warning fs-base">Processing</span>';
                }
                _html += '</div>';

                _html += '</div>';
                _html += '</td>';
                _html += '</tr>';
                $("#order_items").append(_html);
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
                _coupon += '<div class="d-flex align-items-center flex-row-fluid flex-wrap">';
                _coupon += '    <div class="symbol symbol-40px me-3"><span class="symbol-label bg-light-success"><i class="fa fa-gift"></i></span></div>';
                _coupon += '    <div class="flex-grow-1 me-2">';
                _coupon += '        <a href="#" class="text-gray-800 text-hover-primary fs-6 fw-bolder">' + row.order_item_name + '</a>';
                _coupon += '        <span class="fw-bold fs-6 d-block text-start text-success fw-bolder ps-0">$' + row.discount_amount + '</span>';
                _coupon += '    </div>';
                _coupon += '</div>';
                _coupon += '<div class="separator separator-dashed my-4"></div>';
            }
            else if (row.order_item_type == 'refund') {
                _refundHtml += '<tr class="fw-bolder text-gray-700" data-id="' + row.order_item_id + '" data-qty="0" data-returndays="0" data-warrantydays="0">';
                _refundHtml += '<td colspan="7">';
                _refundHtml += '    <div class="d-flex flex-stack">';
                _refundHtml += '        <div class="d-flex align-items-center me-5">';
                _refundHtml += '            <div class="symbol symbol-40px overflow-hidden me-3"><span class="symbol-label bg-light-success"><i class="fas fa-retweet text-success"></i></span></div>';
                _refundHtml += '            <div class="me-5">' + row.order_item_name + '</div>';
                _refundHtml += '        </div>';
                _refundHtml += '        <div class="d-flex align-items-center">' + formatCurrency(_total) + '</div>';
                _refundHtml += '    </div>';
                _refundHtml += '</td>';
                _refundHtml += '</tr>';
                zRefundAmt = zRefundAmt + (_total);
            }
            else if (row.order_item_type == 'replacement') {
                _refundHtml += '<tr class="fw-bolder text-gray-700" data-id="' + row.order_item_id + '" data-qty="0" data-returndays="0" data-warrantydays="0">';
                _refundHtml += '<td colspan="7">';
                _refundHtml += '    <div class="d-flex flex-stack">';
                _refundHtml += '        <div class="d-flex align-items-center me-5">';
                _refundHtml += '            <div class="symbol symbol-40px overflow-hidden me-3"><span class="symbol-label bg-light-success"><i class="fas fa-retweet text-success"></i></span></div>';
                _refundHtml += '            <div class="me-5">' + row.order_item_name + '</div>';
                _refundHtml += '        </div>';
                _refundHtml += '        <div class="d-flex align-items-center">' + formatCurrency(_total) + '</div>';
                _refundHtml += '    </div>';
                _refundHtml += '</td>';
                _refundHtml += '</tr>';
            }
            else if (row.order_item_type == 'refund_items') {
                if (row.order_item_name == "line_item") {
                    $("#tr_" + orderitemid).data("returnqty", row.qty);
                    $("#tr_" + orderitemid).find('.refund-qty').append(row.qty);
                    let max_return = parseInt($("#tr_" + orderitemid).data("qty")) + row.qty;
                    if (max_return <= 0) $("#tr_" + orderitemid).find('#CheckSingle').remove();
                }
            }
        });
        $(".order-coupon").empty().append(_coupon); $('#order_items_refund').append(_refundHtml);

        let netpay = (zGAmt - zTDiscount - zGiftCardAmt + zShippingAmt + zTotalTax + zStateRecyclingAmt + zFeeAmt) + zRefundAmt;

        _html = '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-10 text-gray-600 fs-6">Subtotal:</div><div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(zGAmt) + '</div></div>';
        if (zTDiscount > 0) _html += '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-10 text-gray-600 fs-6">Discount:</div><div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(zTDiscount) + '</div></div>';
        _html += '<div class="separator separator-dashed my-2"></div>';
        if (zFeeAmt > 0) _html += _html += '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-10 text-gray-600 fs-6">Fee</div><div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(zFeeAmt) + '</div></div>';
        if (zSRFAmt > 0) _html += '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-10 text-gray-600 fs-6">State Recycling Fee</div><div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(zSRFAmt) + '</div></div>';
        if (zShippingAmt > 0) _html += '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-10 text-gray-600 fs-6">Shipping</div><div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(zShippingAmt) + '</div></div>';
        //_html += '<div class="form-group"><label class="col-sm-10 control-label">Shipping Tax</label<div class="col-sm-2 controls text-right">$<span id="shippingTaxTotal">0.00</span></div></div>';
        // Add Tax
        $.each(_tax, function (index, value) {
            _html += '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-10 text-gray-600 fs-6">' + value.label + ' - ' + (value.rate * 100).toFixed(4) + '%</div><div class="text-end fw-bolder fs-6 text-gray-800"><span class="tax-total" data-order_item_id="' + value.order_item_id + '" data-name="' + value.name + '" data-label="' + value.label + '" data-percent="' + value.rate + '" data-amount="' + value.amount.toFixed(4) + '">$' + value.amount.toFixed(4) + '</span></div></div>';
        });
        if (zGiftCardAmt > 0) _html += '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-10 text-gray-600 fs-6">Gift Card</div><div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(zGiftCardAmt) + '</div></div>';
        _html += '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-10 text-gray-600 fs-6">Order Total</div><div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(zGAmt - zTDiscount - zGiftCardAmt + zShippingAmt + zTotalTax + zStateRecyclingAmt + zFeeAmt) + '</div></div>';
        //// Refund 
        if (zRefundAmt != 0) _html += '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-10 text-gray-600 fs-6">Refunded</div><div class="text-end fw-bolder fs-6 text-red">' + formatCurrency(zRefundAmt) + '</div></div>';
        //_html += '<div class="form-group refund-total"><label class="col-sm-10 control-label">Refunded By Gift Card</label><div class="col-sm-2 controls text-right text-red text-weight-bold"><strong>$<span id="refundedByGiftCard" data-orderitemid="0">0.00</span></strong></div></div>';
        _html += '<div class="separator separator-dashed my-2"></div>';
        _html += '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-10 text-gray-600 fs-6">Net Payment</div><div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(netpay) + '</div></div>';
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

        _noteHtml = '';
        $.each(response['order_tickets'], function (i, row) {
            //let is_customer_note = parseInt(row.is_customer_note) || 0;
            _noteHtml += '<div class="timeline-item align-items-center mb-4">';
            _noteHtml += '<div class="timeline-line w-20px mt-9 mb-n14"></div>';
            _noteHtml += '<div class="timeline-icon px-1"><span class="svg-icon svg-icon-2 svg-icon-success"><i class="fa fa-paper-plane"></i></span></div>';
            _noteHtml += '<div class="timeline-content m-0">';
            _noteHtml += '   <a href="javascript:void(0)" class="fs-6 fw-bolder d-block text-primary" onclick="WarrantyInfoModal(' + row.id + ',\'' + row.ticket_action + '\');">#' + row.id + '</a>';
            if (row.ticket_action == 'wp_return') _noteHtml += '<span class="fs-8 fw-boldest d-block text-success text-uppercase">Return ' + (row.new_order_id > 0 ? ' Order #' + row.new_order_id : '') + '</span>';
            else if (row.ticket_action == 'wp_return_to_vender') _noteHtml += '<span class="fs-8 fw-boldest d-block text-success text-uppercase">Return to vendor ' + (row.new_order_id > 0 ? ' Order #' + row.new_order_id : '') + '</span>';
            else if (row.ticket_action == 'wp_replacement') _noteHtml += '<span class="fs-8 fw-boldest d-block text-success text-uppercase">Replacement ' + (row.new_order_id > 0 ? ' Order #' + row.new_order_id : '') + '</span>';
            else if (row.ticket_action == 'wp_createorder') _noteHtml += '<span class="fs-8 fw-boldest d-block text-success text-uppercase">Create new order ' + (row.new_order_id > 0 ? ' Order #' + row.new_order_id : '') + '</span>';
            else if (row.ticket_action == 'wp_declined') _noteHtml += '<span class="fs-8 fw-boldest d-block text-danger text-uppercase">Declined</span>';
            else _noteHtml += '<span class="fs-8 fw-boldest d-block text-warning text-uppercase">Processing</span>';
            _noteHtml += '   <span class="d-block fw-bold text-gray-400">' + row.reason + '</span>';
            _noteHtml += '   <span class="d-block fw-bold text-gray-400">' + moment(row.created_at).format('MMMM Do, YYYY h:mm:ss a') + '</span>';
            if (row.is_confirmed_by_vendor) _noteHtml += '   <span class="d-block fw-bold text-gray-400"> Confirmed by vendor on ' + moment(row.confirmed_by_vendor_date).format('MMMM Do, YYYY h:mm:ss a') + '</span>';
            _noteHtml += '</div>';
            _noteHtml += '</div>';
        });
        $(".order-tickets").empty().append(_noteHtml);

    }).catch(err => { $("#loader").hide(); }).always(function () { $("#loader").hide(); });
}

//Customer Warranty claim details
function StolenPackageModal(order_id) {
    let _html = '<div class="modal-dialog modal-fullscreen p-12">';
    _html += '  <div class="modal-content modal-rounded">';
    _html += '      <div class="modal-header py-3 justify-content-start"><h4 class="modal-title flex-grow-1">Order #' + order_id + ' has not been received by the customer..</h4><button type="button" class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button></div>';
    _html += '      <div class="modal-body py-1"></div>';
    _html += '      <div class="modal-footer py-2 d-flex"><button type="button" class="btn btn-sm btn-primary" data-id="' + order_id + '" onclick="GenerateStolenPackageTicket(' + order_id + ')">Generate Ticket No</button></div>';
    _html += '  </div>';
    _html += '</div>';
    $("#myModal").empty().html(_html);

    _html = '<div id="kt_warranty_claim" class="claimwarranty-step1 card-body">';
    $.each(StolenPackageQuestions, function (i, row) {
        _html += '<label class="form-check-custom form-check-solid d-flex" for="chk-' + i + '">';
        _html += '  <input type="checkbox" class="form-check-input me-3 warranty-checkbox" id="chk-' + i + '" name="chk-' + i + '" data-id="' + row.id + '" data-code="' + row.code + '" data-title="' + row.title + '"/>';
        _html += '  <span class="form-check-label d-flex flex-fill align-items-start fs-5 my-1">' + row.title + '</span>';
        _html += '</label>';
        _html += '<div class="separator separator-dashed my-2"></div>';
    });
    _html += '</div>';

    _html += '<div class="claimwarranty-step2 bg-light-warning rounded border-warning border border-dashed p-6 ">';
    _html += '  <div class="row">';
    _html += '      <div class="col-md-12">';
    _html += '          <label class="form-label text-gray-800 fw-bolder">Comment</label>';
    _html += '          <textarea id="kt_warranty_claim_note" class="form-control mb-2" placeholder="Type your comment." rows="3" maxlength="500"></textarea>';
    _html += '      </div>';
    _html += '  </div>';
    _html += '</div>';

    $('#myModal .modal-body').append(_html);
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
}
function GenerateStolenPackageTicket(order_id) {
    let _user = $(".order-id").data('name'), _reason = 'Packages not received by customer.', _reason_code = '9000';
    let _questions = '';
    $('#kt_warranty_claim').find('.warranty-checkbox').each(function (i, row) {
        if ($(row).prop('checked') == true) _questions += '    🗸   ' + $(row).data('title') + ' <br/>';
        else _questions += '    X   ' + $(row).data('title') + ' <br/>';
    });

    let _chat = [{ from: _user, content: 'Name: Packages not received by customer.' },
    { from: 'Help Desk', content: 'Answered by the customer.' },
    { from: _user, content: _reason }, { from: _user, content: _questions }];
    let option = {
        id: 0, email: $(".order-id").data('email'), verification_code: '', order_item_name: 'All Product', order_item_size: '', order_item_color: '', order_item_qty: 0, order_item_sku: '',
        chat_public: '', chat_internal: '', chat_history: JSON.stringify(_chat), reason_code: _reason_code, reason: _reason, order_id: order_id, order_item_id: 0,
        box_is_opened: 0, comment: $("#kt_warranty_claim_note").val(), gdrive_link: JSON.stringify([])
    };
    let _body = StolenPackageTicketMailBody(_user, _chat);
    //console.log(option, _questions); return false;
    swal.queue([{
        title: '', confirmButtonText: 'Yes, do it!', text: "Generate stolen package ticket number.",
        showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                let _obj = { json_data: JSON.stringify(option), receipient_email: option.email, subject: 'Layla Sleep || Reported Stolen (Not Delivered But Shown as Delivered) ', body: _body };
                $.ajax(
                    { url: "/customer-service/generate-ticket", method: "POST", timeout: 0, headers: { "Content-Type": "application/json" }, data: JSON.stringify(_obj) }
                ).done(function (result) {
                    result = JSON.parse(result);
                    if (result[0].response == 'success') {
                        OrderInfo(option.order_id); $("#myModal").modal('hide');
                        swal('Success', 'Thank you for submitting your warranty claim. For reference, your ticket number is #' + result[0].id + '. Your warranty claim will be processed within the next 3 business days.', "success");
                    }
                    else { swal('Error', 'Something went wrong, please try again.', "error"); }
                }).catch(err => { swal.hideLoading(); swal('Error!', 'Something went wrong, please try again.', 'error'); });
            });
        }
    }]);
    return false;
}
function StolenPackageTicketMailBody(name, chat_history) {
    let _body = 'Hi there ' + name + ', we\'re sorry that you are having an issue with your Layla product, and thank you for bringing it to our attention with your reported loss of the package.<br/><br/>';
    _body += 'We will work diligently to resolve this for you as soon as possible, and a Layla specialist will get back to you regarding your stolen report within 3-5 business days.<br/><br/>';
    _body += '<b>Here is what happens next:</b><br/><br/>';
    _body += 'Review: We will review your claim details and any other evidence submitted pertaining to your claim.<br/><br/>';
    _body += 'Request for Additional Information (possible): If deemed necessary, we may reach out to you for further evidence and/or an explanation of your stolen package issue.<br/><br/>';
    _body += 'Decision Rendered: We will inform you of the decision made on your stolen package claim and advise you of the next steps.<br/><br/>';
    _body += 'Corrective Action: Contingent upon the approval of your claim, we will set a course of corrective action which may include creating a new order of the product.<br/><br/>';
    _body += 'Again, we\'re sorry you\'re having a product issue and we are committed to resolving this as quickly and thoroughly as possible.<br/><br/><br/>';
    _body += '<b>Chat History</b><br/><br/>';
    $.each(chat_history, function (i, row) { _body += '<b>' + row.from + ':</b> ' + row.content + '<br/>'; });
    _body += '<br/><b>Help Desk <br/>';
    return _body;
}

//Show Customer Warranty claim details and add comments
function WarrantyInfoModal(id, _action) {
    let modalHtml = '<div class="modal-dialog modal-fullscreen p-9 modal-dialog-scrollable">';
    modalHtml += '<div class="modal-content modal-rounded">';
    modalHtml += '<div class="modal-header py-3 justify-content-start"><h4 class="modal-title flex-grow-1">Ticket No.: #' + id + ', Refunds/Returns/Warranty claim details.</h4><button type="button" class="btn btn-sm" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button></div>';
    modalHtml += '<div class="modal-body"></div>';
    modalHtml += '<div class="modal-footer py-3 d-flex"></div>';
    //modalHtml += '<div class="modal-footer py-3"><button type="button" class="btn btn-sm btn-primary" data-id="' + id + '">Send to Retention</button><button type="button" class="btn btn-sm btn-primary" data-id="' + id + '">Return</button><button type="button" class="btn btn-sm btn-primary" data-id="' + id + '">Replacement</button><button type="button" class="btn btn-sm btn-primary" data-id="' + id + '">Create new order</button></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#myModal").empty().html(modalHtml);
    WarrantyInfoModalData(id, _action);
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
}
function WarrantyInfoModalData(id, _action) {
    let _html = ''; $("#loader").show(); _is_open = false;
    $.get('/customer-service/ticket-info', { strValue1: id }).then(response => {
        response = JSON.parse(response);
        _is_open = response[0].ticket_is_open;
        _html += '<div class="row">';
        let _chat_history = isNullUndefAndSpace(response[0].chat_history) ? JSON.parse(response[0].chat_history) : [];
        _html += '<div class="col-lg-12">';
        $.each(_chat_history, function (i, row) {
            _html += '<div class="row">';
            _html += '<div class="col-lg-12">';
            _html += '<h3 class="mb-2">' + row.from + '</h3>';
            _html += '<p class="fs-6 text-gray-600 fw-bold mb-4 mb-lg-8">' + row.content + '</p>';
            _html += '</div>';
            _html += '</div>';
        });
        _html += '</div>';
        _html += '</div>';

        _html += '<div class="bg-light-primary rounded border-primary border border-dashed p-6 mb-2">';
        _html += '  <div class="d-flex align-items-center me-5">';
        _html += '      <div class="symbol symbol-50px me-6"><span class="symbol-label bg-light-success"><i class="fa fa-box-open text-primary"></i></span></div>';
        _html += '      <span class="me-5">';
        _html += '          <span class="fw-bolder fs-5 mb-0">Is the box or package open or not?</span>';
        if (response[0].box_is_opened) _html += '          <span class="badge badge-success fs-base">Yes</span>';
        else _html += '          <span class="badge badge-danger fs-base text-uppercase">No</span>';
        _html += '      </span>';
        _html += '  </div>';
        _html += '</div>';

        //Show Image
        try {
            let _gdrive_link = isNullUndefAndSpace(response[0].gdrive_link) ? JSON.parse(response[0].gdrive_link) : [];
            if (_gdrive_link.length > 0) {
                _html += '<div class="d-flex flex-wrap align-items-center border border-dashed border-gray-300 rounded min-w-700px p-7">';
                $.each(_gdrive_link, function (i, row) {
                    _html += '  <div class="overlay me-10">';
                    _html += '      <div class="overlay-wrapper"><a class="example-image-link" href="../' + row.files + '" data-lightbox="example-set" data-title=""><img class="example-image rounded w-150px" src="../' + row.files + '" alt="-"></a></div >';
                    _html += '  </div>';
                });
                _html += '</div>';

            }
        }
        catch { };

        //Add comments
        let _agent_comments = isNullUndefAndSpace(response[0].ticket_comments) ? JSON.parse(response[0].ticket_comments) : [];
        _html += '<div class="separator separator-dashed my-3"></div>';
        _html += '<div class="row order-comments mb-6"><div class="col-lg-12">';
        $.each(_agent_comments, function (i, row) {
            if (row.comment_from == 'agent') {
                _html += '<div class="d-flex flex-column align-items-start">';
                _html += '  <div class="d-flex align-items-center mb-2">';
                _html += '    <div class="symbol symbol-35px symbol-circle"><span class="symbol-label bg-light-danger text-danger fs-6 fw-bolder">A</span></div>';
                _html += '    <div class="ms-3 fs-5 fw-bolder text-gray-900 text-hover-primary me-1"><div class="symbol symbol-35px symbol-circle"></div>' + row.ur[0].comment_from_name + '</div>';
                _html += '  </div>';
                _html += '  <div class="p-5 rounded bg-light-info text-dark fw-bold mw-lg-400px text-start">' + row.ticket_comment + '</div>';
                _html += '</div>';
            }
            else {
                _html += '<div class="d-flex flex-column align-items-end">';
                _html += '  <div class="d-flex align-items-center mb-2">';
                _html += '    <div class="me-3 fs-5 fw-bolder text-gray-900 text-hover-primary me-1">' + row.ur[0].comment_from_name + '</div>';
                _html += '    <div class="symbol symbol-35px symbol-circle"><span class="symbol-label bg-light-warning text-warning fs-6 fw-bolder">RS</span></div>';
                _html += '  </div>';
                _html += '<div class="p-5 rounded bg-light-primary text-dark fw-bold mw-lg-400px text-end">' + row.ticket_comment + '</div>';
                _html += '</div>';
            }
        });
        _html += '<div class="separator separator-dashed my-3"></div>';
        _html += '<div class="notice d-flex bg-light-primary rounded border-primary border border-dashed min-w-lg-600px flex-shrink-0 p-6">';
        _html += '  <div class="col-lg-12">';
        _html += '      <label class="form-label text-gray-800 fw-bolder">Comment</label>';
        _html += '      <textarea id="agent_comment" class="form-control mb-2" placeholder="Type your comment." rows="3" maxlength="500"></textarea>';
        _html += '      <a href="javascript:void(0);" data-id="' + id + '" data-type="agent" data-action="' + _action + '" class="btn btn-primary btn-sm pull-right" onclick="TicketCommentPost(this);"><i class="fa fa-paper-plane"></i>Submit</a>';
        _html += '  </div>';
        _html += '</div>';

        _html += '</div></div>';
    }).catch(err => { }).always(function () {
        $("#loader").hide(); $('#myModal .modal-body').empty().append(_html);
        //add action button
        if (_is_open) {
            if (_action == 'wp_return') { $('#myModal .modal-footer').empty().append('<button type="button" class="btn btn-sm btn-primary" data-id="' + id + '" onclick="CreateReturnModal(' + id + ');">Create Return</button>'); }
            else if (_action == 'wp_return_to_vender') { $('#myModal .modal-footer').empty().append('<button type="button" class="btn btn-sm btn-primary" data-id="' + id + '" onclick="CreateReturnModal(' + id + ');">Create Return to vendor</button>'); }
            else if (_action == 'wp_replacement') { $('#myModal .modal-footer').empty().append('<button type="button" class="btn btn-sm btn-primary" data-id="' + id + '" onclick="CreateReplacementModal(' + id + ');">Replacement</button>'); }
            else if (_action == 'wp_createorder') { $('#myModal .modal-footer').empty().append('<button type="button" class="btn btn-sm btn-primary" data-id="' + id + '" onclick="CreateNewOrderModal(' + id + ');">Create new order</button>'); }
            else if (_action == 'wp_declined') { $('#myModal .modal-footer').empty().append('Order declined by retention specialist.'); }
            else { $('#myModal .modal-footer').empty().append('<div class="text-danger">Wait for the action of the retention specialist.</div>'); }
        }
        else { $('#myModal .modal-footer').empty().append('<div class="text-danger">Ticket has been closed.</div>'); }
    });
}
function TicketCommentPost(element) {
    $("#loader").show();
    let option = { id: parseInt($(element).data('id')) || 0, ticket_action: '', comment: $("#agent_comment").val(), comment_by: $(element).data('type') };
    //console.log(option); return false;
    //$.ajaxSetup({ headers: { 'Content-Type': 'application/json'} });
    $.post('/customer-service/ticket-action', { strValue1: JSON.stringify(option) }).then(result => {
        result = JSON.parse(result);
        if (result[0].response == 'success') { WarrantyInfoModalData(option.id, $(element).data('action')); }
        else swal('Error', 'Comment not saved, please try again.', "error");
    }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); }).always(function () { $("#loader").hide(); });
    return false;
}

//Customer Warranty claim details
function ClaimWarrantyModal(ele) {
    let _qty = (parseInt($(ele).data('qty')) || 0) + (parseInt($(ele).data('returnqty')) || 0);
    let modalHtml = '<div class="modal-dialog modal-fullscreen p-12">';
    modalHtml += '<div class="modal-content modal-rounded">';
    modalHtml += '<div class="modal-header py-3 justify-content-start"><h4 class="modal-title flex-grow-1">Please select a reason for your refunds/returns/warranty claim.</h4><button type="button" class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button></div>';
    modalHtml += '<div class="modal-body py-1"></div>';
    modalHtml += '<div class="modal-footer py-2 d-flex"><button type="button" class="btn btn-sm btn-primary claimwarranty_previous hide" onclick="ClaimWarranty_previous();">Back</button><button type="button" class="btn btn-sm btn-primary claimwarranty_next" onclick="ClaimWarranty_next();">Next</button><button type="button" id="btnGenerateTicket" class="btn btn-sm btn-primary hide" data-id="' + $(ele).data('id') + '" data-name="' + $(ele).data('name') + '" data-qty="' + _qty + '">Generate Ticket No</button></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#myModal").empty().html(modalHtml);

    modalHtml = '<div id="kt_warranty_claim" class="claimwarranty-step1 card-body pt-0">';

    modalHtml += '<ul>';
    $.each(WarrantyQuestions, function (i, row) {
        modalHtml += '<li>';
        modalHtml += '<input type="radio" id="chk-' + i + '" class="form-check-input m-0 me-3 warranty-checkbox" name="chk-reason" data-id="' + row.id + '" data-code="' + row.code + '" data-title="' + row.title + '"/>';
        modalHtml += '<label for="chk-' + i + '">' + row.title + '</label>';
        modalHtml += '  <ul>';
        $.each(row.questions, function (q_i, q_row) {
            modalHtml += '<li>';
            if (q_row.sub_questions != null) modalHtml += '<input type="radio" class="form-check-input m-0 me-3 warranty-checkbox" id="chk-' + i + '-' + q_i + '" name="chk-' + i + '" data-id="' + q_row.id + '" data-code="' + q_row.code + '" data-title="' + q_row.title + '"/>';
            else modalHtml += '<input type="checkbox" class="form-check-input m-0 me-3 warranty-checkbox" id="chk-' + i + '-' + q_i + '" name="chk-' + i + '-' + q_i + '" data-id="' + q_row.id + '" data-code="' + q_row.code + '" data-title="' + q_row.title + '"/>';
            modalHtml += '<label for="chk-' + i + '-' + q_i + '">' + q_row.title + '</label>';
            modalHtml += '  <ul>';
            $.each(q_row.sub_questions, function (sq_i, sq_row) {
                modalHtml += '<li>';
                modalHtml += '<input type="checkbox" class="form-check-input m-0 me-3 warranty-checkbox" id="chk-' + i + '-' + q_i + '-' + sq_i + '" name="chk-' + i + '-' + q_i + '-' + sq_i + '" data-id="' + sq_row.id + '" data-code="' + sq_row.code + '" data-title="' + sq_row.title + '"/>';
                modalHtml += '<label for="chk-' + i + '-' + q_i + '-' + sq_i + '">' + sq_row.title + '</label>';
                modalHtml += '</li>';
            });
            modalHtml += '  </ul>';
            modalHtml += '</li>';
        });
        modalHtml += '  </ul>';
        modalHtml += '</li>';
    });
    modalHtml += '</ul>';
    modalHtml += '</div>';
    //modalHtml += '<div class="separator separator-dashed my-5"></div>';

    modalHtml += '<div class="claimwarranty-step2 bg-light-primary rounded border-primary border border-dashed p-6 mb-2 hide">';
    modalHtml += '  <div class="d-flex align-items-center me-5">';
    modalHtml += '      <div class="symbol symbol-50px me-6"><span class="symbol-label bg-light-success"><i class="fa fa-box-open text-primary"></i></span></div>';
    modalHtml += '      <span class="me-5">';
    modalHtml += '          <span class="fw-bolder fs-5 mb-0">Is the box or package open or not?</span>';
    modalHtml += '          <div class="form-check-solid fv-row fv-plugins-icon-container fv-plugins-bootstrap5-row-valid">';
    modalHtml += '              <input name="box_is_opened" class="form-check-input" type="radio" value="1" checked id="box_is_opened"><label class="form-check-label fw-bold ps-2 fs-6 mt-2" for="box_is_opened">Yes</label>';
    modalHtml += '              <input name="box_is_opened" class="form-check-input ms-4" type="radio" value="0" id="box_is_opened_no"><label class="form-check-label fw-bold ps-2 fs-6 mt-2" for="box_is_opened_no">No</label>';
    modalHtml += '          </div>';
    modalHtml += '      </span>';
    modalHtml += '  </div>';
    modalHtml += '</div>';

    modalHtml += '<div class="claimwarranty-step2 bg-light-warning rounded border-warning border border-dashed p-6 hide">';
    modalHtml += '  <div class="row">';
    modalHtml += '      <div class="col-md-6">';
    modalHtml += '          <label class="required form-label text-gray-800 fw-bolder">Quantity</label>';
    modalHtml += '          <input type="number" id="kt_warranty_claim_qty" class="form-control mb-2" placeholder="Quantity" value="' + _qty + '" min="0" max="' + _qty + '" onkeyup="this.value = ValidateMaxValue(this.value, 0, ' + _qty + ')">';
    modalHtml += '      </div>';
    modalHtml += '  </div>';
    modalHtml += '  <div class="row">';
    modalHtml += '      <div class="col-md-12">';
    modalHtml += '          <label class="form-label text-gray-800 fw-bolder">Comment</label>';
    modalHtml += '          <textarea id="kt_warranty_claim_note" class="form-control mb-2" placeholder="Type your comment." rows="3" maxlength="500"></textarea>';
    modalHtml += '      </div>';
    modalHtml += '  </div>';
    modalHtml += '</div>';

    //modalHtml += '<div class="claimwarranty-step3 hide">';
    //modalHtml += '  <div class="dropzone dropzone-queue my-4 p-0 no-border min-h-auto" id="kt_dropzonejs_example_3">';
    //modalHtml += '      <div class="dropzone-panel mb-lg-0 mb-2">';
    //modalHtml += '          <a class="dropzone-select btn btn-sm btn-primary me-2">Attach files</a>';
    //modalHtml += '          <a class="dropzone-remove-all btn btn-sm btn-primary">Remove All</a>';
    //modalHtml += '      </div>';
    //modalHtml += '      <div class="dropzone-items wm-200px"></div>';
    //modalHtml += '  </div><span class="form-text fs-6 text-muted">Max file size is 2MB per file.</span>';
    //modalHtml += '</div>';

    $('#myModal .modal-body').append(modalHtml);
    $("#myModal").modal({ backdrop: 'static', keyboard: false });

    $('#kt_warranty_claim .collapsed').on('click', function () {
        $('#kt_warranty_claim .collapse').removeClass('show');
        $('#kt_warranty_claim_body_' + $(this).data('id')).addClass('show');
    });
    $('#myModal .warranty-checkbox').change(function (e) {
        var checked = $(this).prop("checked"), container = $(this).parent(), siblings = container.siblings();
        if ($(this).attr('type') == 'radio') $('.warranty-checkbox').prop("checked", false);
        $('.warranty-checkbox').not($(this).parent('li').parent('ul').find('.warranty-checkbox:checked')).prop("checked", false);
        container.find('.warranty-checkbox').prop({ indeterminate: false, checked: checked });
        function checkSiblings(el) {
            var parent = el.parent().parent(), all = true;
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
function ClaimWarranty(chk) {
    var isChecked = $(chk).prop("checked");
    $("[name='CheckSingle']").prop("checked", false);
    $('#btnclaimwarranty').remove();
    $(chk).prop("checked", isChecked);
    if (isChecked == false) $(chk).parent().parent().find('.order-claim-warranty').empty();
    else $('.order-claim-warranty-' + $(chk).data('id')).empty().append('<button type="button" id="btnclaimwarranty" class="btn btn-primary btn-sm " onclick="ClaimWarrantyModal(this);" data-id="' + $(chk).data('id') + '" data-name="' + $(chk).data('name') + '" data-qty="' + $(chk).data('qty') + '">Begin Retention/Refunds/Claim Warranty</button>');
}
function ClaimWarranty_next() {
    let _chk = $("input[name='chk-reason']:checked").data('code');
    if (!isNullUndefAndSpace(_chk)) { swal('Error!', 'Please select a reason for your warranty claim.', "error").then((result) => { return false; }); return false; }
    $('#myModal .claimwarranty-step1').addClass('hide');
    $('#myModal .claimwarranty-step2').removeClass('hide'); $('#myModal #btnGenerateTicket').removeClass('hide');
    $('#myModal .claimwarranty_previous').removeClass('hide'); $('#myModal .claimwarranty_next').addClass('hide');
    $('#myModal .claimwarranty-step3').removeClass('hide');
}
function ClaimWarranty_previous() {
    $('#myModal .claimwarranty-step1').removeClass('hide');
    $('#myModal .claimwarranty-step2').addClass('hide'); $('#myModal #btnGenerateTicket').addClass('hide');
    $('#myModal .claimwarranty_previous').addClass('hide'); $('#myModal .claimwarranty_next').removeClass('hide');
    $('#myModal .claimwarranty-step3').addClass('hide');
}
function ClaimWarranty_uplaodfiles(ticket_id) {
    $("#myModal").modal('hide');
    $("#myFileModal").modal({ backdrop: 'static', keyboard: false });
    $("#myFileModal .modal-title").empty().append('Please uplaod files for your refunds/returns/warranty claim #' + ticket_id + '.');
    $("#myFileModal .modal-body-msg").empty().append('<h4><i class="icon fa fa-check"></i> Success!</h4> Thank you for submitting your warranty claim. For reference, your ticket number is #' + ticket_id + '. Your warranty claim will be processed within the next 3 business days.');
   
    var myDropzone = new Dropzone(document.body, { // Make the whole body a dropzone
        url: "/CustomerService/SaveDropzoneJsUploadedFiles?id=" + ticket_id, // Set the url
        thumbnailWidth: 80, thumbnailHeight: 80, parallelUploads: 20, previewTemplate: previewTemplate, acceptedFiles: 'image/*',
        autoQueue: false, // Make sure the files aren't queued until manually added
        previewsContainer: "#previews", // Define the container to display the previews
        clickable: ".fileinput-button" // Define the element that should be used as click trigger to select files.
    });

    myDropzone.on("addedfile", function (file) {
        // Hookup the start button
        file.previewElement.querySelector(".start").onclick = function () { myDropzone.enqueueFile(file); document.querySelector("#total-progress .progress-bar").style.width = 0 + "%"; }
    });

    // Update the total progress bar
    myDropzone.on("totaluploadprogress", function (progress) { document.querySelector("#total-progress .progress-bar").style.width = progress + "%" });

    myDropzone.on("sending", function (file) {
        // Show the total progress bar when upload starts
        document.querySelector("#total-progress").style.opacity = "1"
        // And disable the start button
        file.previewElement.querySelector(".start").setAttribute("disabled", "disabled")
    })

    // Hide the total progress bar when nothing's uploading anymore
    myDropzone.on("queuecomplete", function (progress) {
        document.querySelector("#total-progress").style.opacity = "1"; myDropzone.removeAllFiles(true);
        swal('Success', 'Thank you for submitting your warranty claim. For reference, your ticket number is #' + ticket_id + '. Your warranty claim will be processed within the next 3 business days.', "success");
    });

    // Setup the buttons for all transfers
    // The "add files" button doesn't need to be setup because the config
    // `clickable` has already been specified.
    document.querySelector("#actions .start").onclick = function () { myDropzone.enqueueFiles(myDropzone.getFilesWithStatus(Dropzone.ADDED)) }
    document.querySelector("#actions .cancel").onclick = function () { myDropzone.removeAllFiles(true); document.querySelector("#total-progress .progress-bar").style.width = 0 + "%"; }
}

//generete Ticket for order warranty claim
function GenerateTicketNo() {
    let _file = [], _gdrive_link = [];
    //var file = Dropzone.forElement("#kt_dropzonejs_example_3").getAcceptedFiles();
    //$.each(file, function (i, r) {
    //    //_file.push({ dataURL: r.dataURL.split(',')[1], name: r.name, type: r.type });
    //    _file.push({ dataURL: r.dataURL, name: r.name, type: r.type });
    //    _gdrive_link.push({ files: 'Content/tickets/{tid}/' + r.name });
    //});
    //console.log(_file, _gdrive_link); return false;
    let _chk = $("input[name='chk-reason']:checked"), _questions = '';
    let _user = $(".order-id").data('name'), _reason = _chk.data('title'), _reason_code = _chk.data('code');
    _chk.parents('li').find('ul').find('.warranty-checkbox:checked').each(function (i, row) {
        _questions += (i == 0 ? '' : '    🗸   ') + $(row).data('title') + ' <br/>'
    });

    let _chat = [{ from: _user, content: 'Name: ' + $("#btnGenerateTicket").data('name') + ' X ' + (parseInt($("#kt_warranty_claim_qty").val()) || 0) },
    //{ from: 'Help Desk', content: 'Please select a reason for your warranty claim.' },
    { from: _user, content: _reason }, { from: _user, content: _questions }];
    let option = {
        id: 0, email: $(".order-id").data('email'), verification_code: '', order_item_name: $("#btnGenerateTicket").data('name'), order_item_size: '', order_item_color: '', order_item_qty: parseInt($("#kt_warranty_claim_qty").val()) || 0, order_item_sku: '',
        chat_public: '', chat_internal: '', chat_history: JSON.stringify(_chat), reason_code: _reason_code, reason: _reason, order_id: parseInt($(".order-id").data('order_id')) || 0, order_item_id: parseInt($("#btnGenerateTicket").data('id')) || 0,
        box_is_opened: $("input[name='box_is_opened']:checked").val(), comment: $("#kt_warranty_claim_note").val(), gdrive_link: JSON.stringify(_gdrive_link)
    };
    let _body = TicketMailDetails(_user, _chat);
    //console.log(option, _questions, _file, file); return false;
    swal.queue([{
        title: '', confirmButtonText: 'Yes, do it!', text: "Generate ticket number.", showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                let _obj = { json_data: JSON.stringify(option), receipient_email: option.email, subject: 'Layla Sleep Warranty Information', body: _body, files: _file };
                $.ajax({ url: "/customer-service/generate-ticket", method: "POST", timeout: 0, headers: { "Content-Type": "application/json" }, data: JSON.stringify(_obj) }).done(function (result) {
                    result = JSON.parse(result);
                    if (result[0].response == 'success') {
                        swal.hideLoading(); swal.close(); ClaimWarranty_uplaodfiles(result[0].id);
                        //OrderInfo(option.order_id); $("#myModal").modal('hide');
                        //swal('Success', 'Thank you for submitting your warranty claim. For reference, your ticket number is #' + result[0].id + '. Your warranty claim will be processed within the next 3 business days.', "success");
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
    $.each(chat_history, function (i, row) { _body += '<b>' + row.from + ':</b> ' + row.content + '<br/>'; });
    _body += '<br/><b>Help Desk <br/>';
    return _body;
}

//create return order
function CreateReturnModal(id) {
    let _html = '', _tax_html = ''; $("#loader").show();
    let _customer_id = 0, zQty = 0, zSubtotal = 0.00, zTax = 0.00;
    $.post('/customer-service/order', { strValue1: id, strValue2: 'TICKET' }).then(response => {
        response = JSON.parse(response); //console.log(response);
        $.each(response['order'], function (i, row) {
            _html += '<div class="fw-bolder fs-3 text-gray-800 mb-5 refund-order-title" data-order_id="' + row.order_id + '">Order #' + row.order_id + '</div>';
            let _json = JSON.parse(row.order_details);
            _customer_id = parseInt(_json._customer_user) || 0;
            _html += '<div class="row g-5 mb-7">';
            _html += '    <div class="col-sm-6">';
            _html += '        <div class="fw-bold fs-7 text-gray-600 mb-1"> Date:</div>';
            _html += '        <div class="fw-bolder fs-6 text-gray-800">' + moment().format('DD MMM YYYY') + '</div>';
            _html += '    </div>';
            _html += '    <div class="col-sm-6">';
            _html += '        <div class="fw-bold fs-7 text-gray-600 mb-1">Payment Mathod:</div>';
            _html += '        <span class="fw-bolder fs-6 text-gray-800">' + _json._payment_method_title + '</span>';
            _html += '    </div>';
            _html += '</div>';

            _html += '<div class="row g-5 mb-7">';
            _html += '    <div class="col-sm-6">';
            _html += '        <div class="fw-bold fs-7 text-gray-600 mb-1">Billing Address:</div>';
            _html += '        <div class="fw-bolder fs-6 text-gray-800">' + _json._billing_first_name + ' ' + _json._billing_last_name + '</div>';
            _html += '        <div class="fw-bold fs-7 text-gray-600">8692 Wild Rose Drive<br>' + _json._billing_city + ', ' + _json._billing_state + ' ' + _json._billing_postcode + ' ' + _json._billing_country + '</div>';
            _html += '        <div class="fw-bolder fs-6 text-gray-800">' + _json._billing_email + '</div>';
            _html += '    </div>';
            _html += '    <div class="col-sm-6">';
            _html += '        <div class="fw-bold fs-7 text-gray-600 mb-1">Shipping Address:</div>';
            _html += '        <div class="fw-bolder fs-6 text-gray-800">' + _json._shipping_first_name + ' ' + _json._shipping_last_name + '</div>';
            _html += '        <div class="fw-bold fs-7 text-gray-600">8692 Wild Rose Drive<br>' + _json._shipping_city + ', ' + _json._shipping_state + ' ' + _json._shipping_postcode + ' ' + _json._shipping_country + '</div>';
            _html += '    </div>';
            _html += '</div>';
        });

        _html += '<div class="flex-grow-1">';
        _html += '    <div class="table-responsive border-bottom mb-9">';
        _html += '        <table class="table mb-3">';
        _html += '                <thead><tr class="border-bottom fs-6 fw-bolder text-muted">';
        _html += '                    <th class="min-w-175px pb-2">Item</th>';
        _html += '                    <th class="min-w-75px pb-2 text-end">Quantity</th>';
        _html += '                    <th class="min-w-75px pb-2 text-end">Price</th>';
        _html += '                    <th class="min-w-75px pb-2 text-end">Total</th>';
        _html += '                    <th class="min-w-75px pb-2 text-end">Tax</th>';
        _html += '                </tr></thead>';
        _html += '                <tbody class="refund_order_line_items">';

        $.each(response['order_detail'], function (i, row) {
            if (row.order_item_type == 'line_item') {
                let _line_total = parseFloat(row.line_total) || 0.00, _order_qty = parseFloat(row.qty) || 0.00, _order_tax = parseFloat(row.tax) || 0.00;
                let _qty = parseFloat(row.order_item_qty) || 0.00, _free_qty = parseFloat(row.qty) || 0.00;
                if (_line_total == 0) _qty = _qty * _free_qty;
                let _price = _line_total / _order_qty, _tax = _order_tax / _order_qty;
                _html += '<tr class="fw-bolder text-gray-700 fs-5 ' + (_line_total > 0 ? 'paid-item' : 'free-item') + '" data-orderitemid="' + row.order_item_id + '" data-pid="' + row.p_id + '" data-vid="' + row.v_id + '" data-pname="' + row.order_item_name + '" data-price="' + _price + '" data-qty="' + _qty + '" data-tax="' + _tax + '">';
                _html += '    <th class="pt-6">' + row.order_item_name + '</th>';
                _html += '    <th class="pt-6 text-end">' + _qty + '</th>';
                _html += '    <th class="pt-6 text-end">' + formatCurrency(_price) + '</th>';
                _html += '    <th class="pt-6 text-end">' + formatCurrency(_price * _qty) + '</th>';
                _html += '    <th class="pt-6 text-end">' + formatCurrency(_tax * _qty) + '</th>';
                _html += '</tr>';
                zQty += _qty; zSubtotal += (_price * _qty); zTax += (_tax * _qty);
            }
            else if (row.order_item_type == 'tax') {
                _tax_html += '        <div class="d-flex flex-stack mb-3">';
                _tax_html += '            <div class="fw-bold pe-10 text-gray-600 fs-7">' + row.label + ' - ' + (row.tax * 100).toFixed(4) + '%:</div>';
                _tax_html += '            <div class="text-end fw-bolder fs-6 text-gray-800 tax-total" data-order_item_id="' + row.order_item_id + '" data-name="' + row.order_item_name + '" data-label="' + row.label + '" data-percent="' + row.tax + '" data-amount="' + zSubtotal * row.tax + '">' + formatCurrency(zSubtotal * row.tax) + '</div>';
                _tax_html += '        </div>';
            }
        });
        _html += '                </tbody>';
        _html += '        </table>';
        _html += '    </div>';
        _html += '</div>';

        _html += '<div class="d-flex justify-content-end">';
        _html += '    <div class="mw-300px refund_order_final_total">';
        _html += '        <div class="d-flex flex-stack mb-3">';
        _html += '            <div class="fw-bold pe-10 text-gray-600 fs-7">Subtotal:</div>';
        _html += '            <div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(zSubtotal) + '</div>';
        _html += '        </div>';
        //add taxes
        _html += _tax_html;
        //_html += '        <div class="d-flex flex-stack mb-3">';
        //_html += '            <div class="fw-bold pe-10 text-gray-600 fs-7">Tax:</div>';
        //_html += '            <div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(zTax) + '</div>';
        //_html += '        </div>';
        _html += '        <div class="d-flex flex-stack mb-3">';
        _html += '            <div class="fw-bold pe-10 text-gray-600 fs-7">Total:</div>';
        _html += '            <div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(zSubtotal + zTax) + '</div>';
        _html += '        </div>';
        _html += '    </div>';
        _html += '</div>';
    }).catch(err => { }).always(function () {
        $("#loader").hide(); $('#myModal .modal-body').empty().append('<div class="m-0">' + _html + '</div>');
        $('#myModal .modal-title').empty().append('Ticket No.: #' + id + ', Create return/refund order.');
        $(".refund-order-title").data('id', id); $(".refund-order-title").data('customer', _customer_id);
    });

    //add action button
    $('#myModal .modal-footer').empty().append('<button type="button" class="btn btn-sm btn-primary" onclick="ReturnGenereate();">Submit</button>');
}
function ReturnGenereate() {
    let _id = parseInt($(".refund-order-title").data('id')) || 0, _oid = parseInt($(".refund-order-title").data('order_id')) || 0, _total_qty = 0, _total_amount = 0.00, _total_tax = 0.00;
    let _cid = parseInt($(".refund-order-title").data('customer')) || 0;
    let _items = [], _postMeta = [], _taxes = [], _taxdata = { total: {}, subtotal: {} };
    //get all tax type
    $('#myModal .refund_order_final_total .tax-total').each(function (index, li) { _taxes.push({ label: $(li).data('name'), percent: parseFloat($(li).data('percent')) || 0 }); });

    $('.refund_order_line_items > tr').each(function (index, tr) {
        let _price = parseFloat($(tr).data('price')) || 0.00, _tax = parseFloat($(tr).data('tax')) || 0.00, _qty = parseFloat($(tr).data('qty')) || 0.00;
        _total_qty += _qty; _total_tax += (_tax * _qty); _total_amount += (_price * _qty);
        _taxdata = { total: {}, subtotal: {} };
        $.each(_taxes, function (i, r) {
            _taxdata.total[r.label] = ((_price * _qty) * r.percent).toFixed(4); _taxdata.subtotal[r.label] = ((_price * _qty) * r.percent).toFixed(4);
        });
        _items.push({
            order_item_id: parseInt($(tr).data('orderitemid')) || 0, product_type: 'line_item', PKey: index, order_id: _oid, customer_id: _cid, product_id: $(tr).data('pid'), variation_id: $(tr).data('vid'), product_name: $(tr).data('pname'),
            quantity: parseInt(_qty), sale_rate: _price, total: (_price * _qty), discount: 0, tax_amount: (_tax * _qty), shipping_amount: 0, shipping_tax_amount: 0,
            meta_data: serialize(_taxdata)
        });
    });
    _postMeta.push(
        { post_id: 0, meta_key: '_order_currency', meta_value: 'USD' }, { post_id: 0, meta_key: '_refund_reason', meta_value: '' },
        { post_id: 0, meta_key: '_cart_discount', meta_value: 0 }, { post_id: 0, meta_key: '_cart_discount_tax', meta_value: 0 },
        { post_id: 0, meta_key: '_order_shipping', meta_value: 0 }, { post_id: 0, meta_key: '_order_shipping_tax', meta_value: 0 },
        { post_id: 0, meta_key: '_order_tax', meta_value: (_total_tax * -1.0) }, { post_id: 0, meta_key: '_order_total', meta_value: ((_total_amount + _total_tax) * -1.0) },
        { post_id: 0, meta_key: '_order_version', meta_value: '4.8.0' }, { post_id: 0, meta_key: '_prices_include_tax', meta_value: 'no' },
        { post_id: 0, meta_key: '_refund_amount', meta_value: _total_amount + _total_tax }, { post_id: 0, meta_key: '_refunded_payment', meta_value: '' },
        { post_id: 0, meta_key: '_refund_giftcard_amount', meta_value: 0 }
    );
    let _postStatus = {
        order_id: _oid, parent_id: 0, returning_customer: 0, customer_id: _cid,
        num_items_sold: (_total_qty * -1), total_sales: ((_total_amount + _total_tax) * -1.0), tax_total: (_total_tax * -1.0), shipping_total: 0,
        net_total: (_total_amount * -1.0), status: 'wc-processing', pay_by: ''
    };
    let obj = { order_id: _oid, ticket_id: _id, OrderPostMeta: _postMeta, OrderProducts: _items, OrderPostStatus: _postStatus };

    //console.log(obj); return false;
    $.ajax({
        type: "POST", contentType: "application/json; charset=utf-8",
        url: "/customer-service/create-order-return",
        data: JSON.stringify(obj), dataType: "json", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            //data = JSON.parse(data); //console.log(data);
            if (data.status == true) {
                $("#myModal").modal('hide'); OrderInfo(_oid);
                swal('Success!', 'Refunded order placed successfully.', "success");//.then(function () { window.location.href = window.location.origin + "/OrdersMySQL/OrdersHistory"; }, 50);
            }
            else { swal('Error', data.message, "error").then((result) => { return false; }); }
        },
        error: function (xhr, status, err) { $("#loader").hide(); alert(err); },
        complete: function () { $("#loader").hide(); isEdit(false); },
    });
}

//create replacement order
function CreateReplacementModal(id) {
    let _html = '', _tax_html = ''; $("#loader").show();
    let _customer_id = 0, zQty = 0, zSubtotal = 0.00, zTax = 0.00;
    $.post('/customer-service/order', { strValue1: id, strValue2: 'TICKET' }).then(response => {
        response = JSON.parse(response); //console.log(response);
        $.each(response['order'], function (i, row) {
            _html += '<div class="fw-bolder fs-3 text-gray-800 mb-5 refund-order-title" data-order_id="' + row.order_id + '">Order #' + row.order_id + '</div>';
            let _json = JSON.parse(row.order_details);
            _customer_id = parseInt(_json._customer_user) || 0;
            _html += '<div class="row g-5 mb-7">';
            _html += '    <div class="col-sm-6">';
            _html += '        <div class="fw-bold fs-7 text-gray-600 mb-1"> Date:</div>';
            _html += '        <div class="fw-bolder fs-6 text-gray-800">' + moment().format('DD MMM YYYY') + '</div>';
            _html += '    </div>';
            _html += '    <div class="col-sm-6">';
            _html += '        <div class="fw-bold fs-7 text-gray-600 mb-1">Payment Mathod:</div>';
            _html += '        <span class="fw-bolder fs-6 text-gray-800">' + _json._payment_method_title + '</span>';
            _html += '    </div>';
            _html += '</div>';

            _html += '<div class="row g-5 mb-7">';
            _html += '    <div class="col-sm-6">';
            _html += '        <div class="fw-bold fs-7 text-gray-600 mb-1">Billing Address:</div>';
            _html += '        <div class="fw-bolder fs-6 text-gray-800">' + _json._billing_first_name + ' ' + _json._billing_last_name + '</div>';
            _html += '        <div class="fw-bold fs-7 text-gray-600">8692 Wild Rose Drive<br>' + _json._billing_city + ', ' + _json._billing_state + ' ' + _json._billing_postcode + ' ' + _json._billing_country + '</div>';
            _html += '        <div class="fw-bolder fs-6 text-gray-800">' + _json._billing_email + '</div>';
            _html += '    </div>';
            _html += '    <div class="col-sm-6">';
            _html += '        <div class="fw-bold fs-7 text-gray-600 mb-1">Shipping Address:</div>';
            _html += '        <div class="fw-bolder fs-6 text-gray-800">' + _json._shipping_first_name + ' ' + _json._shipping_last_name + '</div>';
            _html += '        <div class="fw-bold fs-7 text-gray-600">8692 Wild Rose Drive<br>' + _json._shipping_city + ', ' + _json._shipping_state + ' ' + _json._shipping_postcode + ' ' + _json._shipping_country + '</div>';
            _html += '    </div>';
            _html += '</div>';
        });

        _html += '<div class="flex-grow-1">';
        _html += '    <div class="table-responsive border-bottom mb-9">';
        _html += '        <table class="table mb-3">';
        _html += '                <thead><tr class="border-bottom fs-6 fw-bolder text-muted">';
        _html += '                    <th class="min-w-175px pb-2">Item</th>';
        _html += '                    <th class="min-w-75px pb-2 text-end">Quantity</th>';
        _html += '                    <th class="min-w-75px pb-2 text-end">Price</th>';
        _html += '                    <th class="min-w-75px pb-2 text-end">Total</th>';
        _html += '                    <th class="min-w-75px pb-2 text-end">Tax</th>';
        _html += '                </tr></thead>';
        _html += '                <tbody class="refund_order_line_items">';

        $.each(response['order_detail'], function (i, row) {
            if (row.order_item_type == 'line_item') {
                let _line_total = parseFloat(row.line_total) || 0.00, _order_qty = parseFloat(row.qty) || 0.00, _order_tax = parseFloat(row.tax) || 0.00;
                let _qty = parseFloat(row.order_item_qty) || 0.00, _free_qty = parseFloat(row.qty) || 0.00;
                if (_line_total == 0) _qty = _qty * _free_qty;
                let _price = 0.00, _tax = 0.00;
                _html += '<tr class="fw-bolder text-gray-700 fs-5 ' + (_line_total > 0 ? 'paid-item' : 'free-item') + '" data-orderitemid="' + row.order_item_id + '" data-pid="' + row.p_id + '" data-vid="' + row.v_id + '" data-pname="' + row.order_item_name + '" data-price="' + _price + '" data-qty="' + _qty + '" data-tax="' + _tax + '">';
                _html += '    <th class="pt-6">' + row.order_item_name + '</th>';
                _html += '    <th class="pt-6 text-end">' + _qty + '</th>';
                _html += '    <th class="pt-6 text-end">' + formatCurrency(_price) + '</th>';
                _html += '    <th class="pt-6 text-end">' + formatCurrency(_price * _qty) + '</th>';
                _html += '    <th class="pt-6 text-end">' + formatCurrency(_tax * _qty) + '</th>';
                _html += '</tr>';
                zQty += _qty; zSubtotal += (_price * _qty); zTax += (_tax * _qty);
            }
            else if (row.order_item_type == 'tax') {
                _tax_html += '        <div class="d-flex flex-stack mb-3">';
                _tax_html += '            <div class="fw-bold pe-10 text-gray-600 fs-7">' + row.label + ' - ' + (row.tax * 100).toFixed(4) + '%:</div>';
                _tax_html += '            <div class="text-end fw-bolder fs-6 text-gray-800 tax-total" data-order_item_id="' + row.order_item_id + '" data-name="' + row.order_item_name + '" data-label="' + row.label + '" data-percent="' + row.tax + '" data-amount="' + zSubtotal * row.tax + '">' + formatCurrency(zSubtotal * row.tax) + '</div>';
                _tax_html += '        </div>';
            }
        });
        _html += '                </tbody>';
        _html += '        </table>';
        _html += '    </div>';
        _html += '</div>';

        _html += '<div class="d-flex justify-content-end">';
        _html += '    <div class="mw-300px refund_order_final_total">';
        _html += '        <div class="d-flex flex-stack mb-3">';
        _html += '            <div class="fw-bold pe-10 text-gray-600 fs-7">Subtotal:</div>';
        _html += '            <div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(zSubtotal) + '</div>';
        _html += '        </div>';
        //add taxes
        _html += _tax_html;
        //_html += '        <div class="d-flex flex-stack mb-3">';
        //_html += '            <div class="fw-bold pe-10 text-gray-600 fs-7">Tax:</div>';
        //_html += '            <div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(zTax) + '</div>';
        //_html += '        </div>';
        _html += '        <div class="d-flex flex-stack mb-3">';
        _html += '            <div class="fw-bold pe-10 text-gray-600 fs-7">Total:</div>';
        _html += '            <div class="text-end fw-bolder fs-6 text-gray-800">' + formatCurrency(zSubtotal + zTax) + '</div>';
        _html += '        </div>';
        _html += '    </div>';
        _html += '</div>';
    }).catch(err => { }).always(function () {
        $("#loader").hide(); $('#myModal .modal-body').empty().append('<div class="m-0">' + _html + '</div>');
        $('#myModal .modal-title').empty().append('Ticket No.: #' + id + ', Create Replacement.');
        $(".refund-order-title").data('id', id); $(".refund-order-title").data('customer', _customer_id);
    });

    //add action button
    $('#myModal .modal-footer').empty().append('<button type="button" class="btn btn-sm btn-primary" onclick="ReplacementGenereate();">Submit</button>');
}
function ReplacementGenereate() {
    let _id = parseInt($(".refund-order-title").data('id')) || 0, _oid = parseInt($(".refund-order-title").data('order_id')) || 0, _total_qty = 0, _total_amount = 0.00, _total_tax = 0.00;
    let _cid = parseInt($(".refund-order-title").data('customer')) || 0;
    let _items = [], _postMeta = [], _taxes = [], _taxdata = { total: {}, subtotal: {} };
    //get all tax type
    $('#myModal .refund_order_final_total .tax-total').each(function (index, li) { _taxes.push({ label: $(li).data('name'), percent: parseFloat($(li).data('percent')) || 0 }); });

    $('.refund_order_line_items > tr').each(function (index, tr) {
        let _price = parseFloat($(tr).data('price')) || 0.00, _tax = parseFloat($(tr).data('tax')) || 0.00, _qty = parseFloat($(tr).data('qty')) || 0.00;
        _total_qty += _qty; _total_tax += (_tax * _qty); _total_amount += (_price * _qty);
        _taxdata = { total: {}, subtotal: {} };
        $.each(_taxes, function (i, r) {
            _taxdata.total[r.label] = ((_price * _qty) * r.percent).toFixed(4); _taxdata.subtotal[r.label] = ((_price * _qty) * r.percent).toFixed(4);
        });
        _items.push({
            order_item_id: parseInt($(tr).data('orderitemid')) || 0, product_type: 'line_item', PKey: index, order_id: _oid, customer_id: _cid, product_id: $(tr).data('pid'), variation_id: $(tr).data('vid'), product_name: $(tr).data('pname'),
            quantity: parseInt(_qty) || 0, sale_rate: _price, total: (_price * _qty), discount: 0, tax_amount: (_tax * _qty), shipping_amount: 0, shipping_tax_amount: 0,
            meta_data: serialize(_taxdata)
        });
    });
    _postMeta.push(
        { post_id: 0, meta_key: '_order_currency', meta_value: 'USD' }, { post_id: 0, meta_key: '_refund_reason', meta_value: '' },
        { post_id: 0, meta_key: '_cart_discount', meta_value: 0 }, { post_id: 0, meta_key: '_cart_discount_tax', meta_value: 0 },
        { post_id: 0, meta_key: '_order_shipping', meta_value: 0 }, { post_id: 0, meta_key: '_order_shipping_tax', meta_value: 0 },
        { post_id: 0, meta_key: '_order_tax', meta_value: _total_tax }, { post_id: 0, meta_key: '_order_total', meta_value: _total_amount + _total_tax },
        { post_id: 0, meta_key: '_order_version', meta_value: '4.8.0' }, { post_id: 0, meta_key: '_prices_include_tax', meta_value: 'no' },
        { post_id: 0, meta_key: '_refund_amount', meta_value: _total_amount + _total_tax }, { post_id: 0, meta_key: '_refunded_payment', meta_value: '' },
        { post_id: 0, meta_key: '_refund_giftcard_amount', meta_value: 0 }
    );
    let _postStatus = {
        order_id: _oid, parent_id: 0, returning_customer: 0, customer_id: _cid, num_items_sold: _total_qty, total_sales: 0, tax_total: 0, shipping_total: 0, net_total: 0, status: 'wc-processing', pay_by: ''
    };
    let obj = { order_id: _oid, ticket_id: _id, OrderPostMeta: _postMeta, OrderProducts: _items, OrderPostStatus: _postStatus };

    //console.log(obj); return false;
    $.ajax({
        type: "POST", contentType: "application/json; charset=utf-8",
        url: "/customer-service/create-order-replacement",
        data: JSON.stringify(obj), dataType: "json", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            //data = JSON.parse(data); //console.log(data);
            if (data.status == true) {
                $("#myModal").modal('hide'); OrderInfo(_oid);
                swal('Success!', 'Replacement order placed successfully.', "success");
            }
            else { swal('Error', data.message, "error").then((result) => { return false; }); }
        },
        error: function (xhr, status, err) { $("#loader").hide(); alert(err); },
        complete: function () { $("#loader").hide(); isEdit(false); },
    });
}

//create new order
function CreateNewOrderModal(id) {
    let _html = '', _ct = '', _st = ''; $("#loader").show();
    let _customer_id = 0;
    $.ajaxSetup({ async: false });
    $.post('/customer-service/order', { strValue1: id, strValue2: 'TICKET' }).done(response => {
        response = JSON.parse(response);
        $.each(response['order'], function (i, row) {
            let _json = JSON.parse(row.order_details);
            _customer_id = parseInt(_json._customer_user) || 0, _ct = _json._shipping_country, _st = _json._shipping_state;
            _html += '<div class="row">';
            _html += '  <div class="col-sm-6">';
            _html += '      <div class="fw-bolder fs-5 text-gray-800 mb-1 new-order-no">Order No #000000</div>';
            _html += '      <div class="fw-bold fs-7 text-gray-600 mb-1">Billing Address:</div>';
            _html += '      <div class="fw-bolder fs-6 text-gray-800">' + _json._billing_first_name + ' ' + _json._billing_last_name + '</div>';
            _html += '      <div class="fw-bold fs-7 text-gray-600">' + _json._billing_address_1 + '<br>' + _json._billing_city + ', ' + _json._billing_state + ' ' + _json._billing_postcode + ' ' + _json._billing_country + '</div>';
            _html += '      <div class="fw-bolder fs-6 text-gray-800">' + _json._billing_email + '</div>';
            _html += '      <div class="fw-bolder fs-6 text-gray-800">' + _json._billing_phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '</div>';
            _html += '  </div>';
            _html += '  <div class="col-sm-6">';
            _html += '      <div class="fw-bold fs-7 text-gray-600 mb-1">Shipping Address:</div>';
            _html += '      <div class="row row-small">';
            _html += '          <div class="form-group col-md-6 mb-1"><input type="text" class="form-control" id="txtshipfirstname" placeholder="First Name" value="' + _json._shipping_first_name + '" data-oid="' + row.order_id + '" data-name="' + _json._billing_first_name + ' ' + _json._billing_last_name + '" data-email="' + _json._billing_email + '" data-phone="' + _json._billing_phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "$1$2$3") + '"></div>';
            _html += '          <div class="form-group col-md-6 mb-1"><input type="text" class="form-control" id="txtshiplastname" placeholder="Last Name" value="' + _json._shipping_last_name + '"></div>';
            //_html += '          <div class="form-group col-md-12 mb-1"><input type="text" class="form-control" id="txtshipcompany" placeholder="Company" value="' + _json._shipping_company + '"></div>';
            _html += '          <div class="form-group col-md-12 mb-1"><input type="text" class="form-control" id="txtshipaddress1" placeholder="Enter Address Line 1" value="' + _json._shipping_address_1 + '"></div>';
            _html += '          <div class="form-group col-md-12 mb-1"><input type="text" class="form-control" id="txtshipaddress2" placeholder="Enter Address Line 2" value="' + _json._shipping_address_2 + '"></div>';
            _html += '          <div class="form-group col-md-6 mb-1"><input type="text" class="form-control" id="txtshipcity" placeholder="City" value="' + _json._shipping_city + '"></div>';
            _html += '          <div class="form-group col-md-6 mb-1"><select class="form-control select2" id="ddlshipstate" placeholder="State / County" style="width: 100%;"></select></div>';
            _html += '          <div class="form-group col-md-6 mb-1"><input type="text" class="form-control" id="txtshipzipcode" placeholder="Zip Code" data-st="' + _json._shipping_state + '" data-ct="' + _json._shipping_country + '" value="' + _json._shipping_postcode + '"></div>';
            _html += '          <div class="form-group col-md-6 mb-1"><select class="form-control select2" id="ddlshipcountry" placeholder="Country / Region" style="width: 100%;"><option value="">Select a country / region…</option><option value="CA">Canada</option><option value="US" selected>United States (US)</option></select></div>';
            _html += '      </div>';
            _html += '  </div>';
            _html += '</div>';
        });

        _html += '<div class="row"><div class="col-sm-12">';
        _html += '    <div class="table-responsive border-bottom mb-2">';
        _html += '        <table class="table table-row-bordered gy-2 gs-2">';
        _html += '                <thead class="border-bottom border-gray-200 text-gray-900 fw-bolder bg-light bg-opacity-75"><tr class="">';
        _html += '                    <th style="width: 5%;"></th>';
        _html += '                    <th style="width: 35%;" class="min-w-175px">Item</th>';
        _html += '                    <th style="width: 15%;" class="min-w-75px text-end">Quantity</th>';
        _html += '                    <th style="width: 15%;" class="min-w-75px text-end">Price</th>';
        _html += '                    <th style="width: 15%;" class="min-w-75px text-end">Total</th>';
        _html += '                    <th style="width: 15%;" class="min-w-75px text-end">Tax</th>';
        _html += '                </tr></thead>';
        _html += '                <tbody class="fw-bolder text-gray-900 refund_order_line_items"></tbody>';
        _html += '                <tfoot class="border-bottom border-gray-200 text-gray-900 fw-bolder bg-light bg-opacity-75"><tr>';
        _html += '                    <th style="width: 5%;"></th><th style="width: 35%;" class="min-w-175px"><select class="form-control select2" id="ddlorderitem" placeholder="Select product" style="width: 100%;"></select></th>';
        _html += '                    <th class="text-end" colspan="4"></th>';
        _html += '                </tr></tfoot>';
        _html += '        </table>';
        _html += '    </div>';
        _html += '</div></div>';

        _html += '<div class="d-flex justify-content-end">';
        _html += '    <div class="mw-300px refund_order_final_total">';
        _html += '        <div class="d-flex flex-stack mb-3"><div class="fw-bold pe-15">Items Subtotal:</div><div class="text-end fw-bolder fs-6 text-gray-800 items-subtotal">$0.00</div></div>';
        _html += '        <div class="refund_order_tax_total"></div>';
        _html += '        <div class="d-flex flex-stack mb-3"><div class="fw-bold pe-15">Order Total:</div><div class="text-end fw-bolder fs-6 text-gray-800 order-total">$0.00</div></div>';
        _html += '    </div>';
        _html += '</div>';
    }).catch(err => { }).always(function () {
        $("#loader").hide(); $('#myModal .modal-body').empty().append(_html);
        $('#myModal .modal-title').empty().append('Create new order for Ticket No.: #' + id);
        $("#txtshipfirstname").data('id', id); $("#txtshipfirstname").data('customer', _customer_id);
        $("#ddlshipcountry").val(_ct).trigger('change'); $("#ddlshipstate").val(_st).trigger('change');
    });
    GetProductComponent('ddlorderitem', id);
    //add action button
    $('#myModal .modal-footer').empty().append('<button type="button" class="btn btn-sm btn-primary" onclick="SaveNewOrder();">Submit</button>');
}
function GetProductComponent(ctr, id) {
    $.ajaxSetup({ async: true });
    $.post('/customer-service/product-components', { ticket_id: id }).done(response => {
        response = JSON.parse(response); $("#" + ctr).html('<option value="0">Select Product</option>');
        $.each(response, function (i, r) { $("#" + ctr).append('<option value="' + r.r_id + '">' + r.post_title + '</option>'); });
    }).catch(err => { }).always(function () { $("#" + ctr).select2({ dropdownParent: $("#myModal") }); });
}
function GetTaxRate() {
    $('#myModal .refund_order_tax_total').empty(); $('#myModal #txtshipzipcode').data('tax_rate', 0);
    ///Tax Calculate for state
    let tax_states = ["NY", "CA", "CO", "CT", "IL", "IN", "MI", "MS", "NC", "NE", "NJ", "NM", "PA", "TN", "TX", "WA", "AR", "FL", "GA", "IA", "MO", "OH", "SC", "WI"];
    let s_state = $("#myModal #ddlshipstate").val(), _html = '';
    if (tax_states.includes(s_state)) {
        let opt = { to_zip: $("#myModal #txtshipzipcode").val(), to_street: $("#myModal #txtshipaddress1").val(), to_city: $("#myModal #txtshipcity").val(), to_state: s_state, to_country: $("#myModal #ddlshipcountry").val(), amount: 0.00, shipping: 0.00 };
        if (opt.to_zip.length > 0 || opt.to_city.length > 0 || opt.to_country.length > 0) {
            //$.ajaxSetup({ async: false });
            $.post('/Orders/GetTaxAmounts', opt).done(res => {
                let tax_meta = (res.tax_meta != '' && res.tax_meta != null) ? JSON.parse(res.tax_meta) : [];
                $('#myModal #txtshipzipcode').data('tax_rate', res.rate);
                $.each(tax_meta, function (i, r) {
                    _html += '<div class="d-flex flex-stack mb-3"><div class="fw-bold pe-15">' + r.type + ' - ' + (r.rate * 100).toFixed(4) + '%:</div><div class="text-end fw-bolder fs-6 text-gray-800"><span class="tax-total" data-order_item_id="0" data-name="' + r.name.replaceAll(' ', '-') + '-' + (r.rate * 100).toFixed(2) + '" data-label="' + r.type + '" data-percent="' + r.rate + '" data-amount="0">$0.00</span></div></div>';
                });
            }).catch(err => { swal('Alert!', err, "error"); }).always(function () { $('#myModal .refund_order_tax_total').empty().append(_html) });
        }
    }
}
function getItemList(pid, vid) {
    if ($('#myModal #trpid_' + pid + '_' + vid).length > 0) { swal('Alert!', 'Product already added to list.', "error"); return false; }
    $("#loader").show();
    let option = { strValue1: pid, strValue2: vid, strValue3: $('#myModal #ddlshipcountry').val(), strValue4: $('#myModal #ddlshipstate').val() };
    let _html = '';
    $.ajaxSetup({ async: true });
    $.post('/Orders/GetProductInfo', option).done(response => {
        $.each(response, function (key, pr) {
            let _PKey = pr.product_id + '_' + pr.variation_id;
            _html += '<tr id="trpid_' + _PKey + '" data-id="' + _PKey + '" class="' + (pr.is_free ? 'free_item' : 'paid_item') + '" data-pid="' + pr.product_id + '" data-vid="' + pr.variation_id + '" data-pname="' + pr.product_name + '" data-freeitem="' + pr.is_free + '" data-freeitems=\'' + pr.free_itmes + '\' data-orderitemid="0" data-img="' + pr.product_img + '" data-srfee="' + pr.sr_fee + '" data-sristaxable="' + pr.sr_fee_istaxable + '" data-meta_data=\'' + pr.meta_data + '\'>';
            _html += '  <td style="width: 5%;" class="text-center"><button class="btn menu-icon-gr p-0 text-red" onclick="removeItemsInTable(\'' + _PKey + '\');" data-toggle="tooltip" title="Delete product"><i class="glyphicon glyphicon-trash"></i></button></td>';
            _html += '  <td style="width: 35%;" class="min-w-175px">' + pr.product_name + '</td>';
            _html += '  <td style="width: 15%;" class="min-w-75px"><input min="1" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_ItemQty_' + _PKey + '" value="' + pr.quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
            _html += '  <td style="width: 15%;" class="min-w-75px text-end">' + formatCurrency(pr.sale_price) + '</td>';
            _html += '  <td style="width: 15%;" class="min-w-75px text-end item-total" data-salerate="' + pr.sale_price + '">' + formatCurrency(pr.sale_price) + '</td>';
            _html += '  <td style="width: 15%;" class="min-w-75px text-end item-tax">$0.00</td>';
            _html += '</tr>';
        });
    }).catch(err => { swal('Alert!', err, "error"); }).always(function () {
        $("#loader").hide(); $('#myModal .refund_order_line_items').append(_html); calcFinalTotals();
        $("#myModal .refund_order_line_items").find(".rowCalulate").change(function () { calcFinalTotals(); });
    });
}
function removeItemsInTable(_id) { $("#trpid_" + _id).remove(); calcFinalTotals() }
function calcFinalTotals() {
    let tax_rate = parseFloat($('#myModal #txtshipzipcode').data('tax_rate')) || 0.00;
    let zQty = 0, zGrossAmount = 0.00, zTotalTax = 0.00;

    $("#myModal .refund_order_line_items > tr.paid_item").each(function (index, row) {
        let rQty = 0.00, rSalePrice = 0.00, rGrossAmount = 0.00, rTotalTax = 0.00;
        rQty = parseFloat($(row).find("[name=txt_ItemQty]").val()) || 0.00; zQty += parseInt(rQty);
        rSalePrice = parseFloat($(row).find(".item-total").data("salerate")) || 0.00;
        rGrossAmount = rSalePrice * rQty; zGrossAmount += rGrossAmount;
        $(row).find(".item-total").text(formatCurrency(rGrossAmount));
        rTotalTax = rGrossAmount * tax_rate;
        $(row).find(".item-tax").text(formatCurrency(rTotalTax));
    });
    $("#myModal .items-subtotal").text(formatCurrency(zGrossAmount));
    $("#myModal .refund_order_tax_total .tax-total").each(function (index, row) {
        let rRate = parseFloat($(row).data('percent')) || 0.00, rTotalTax = 0.00;
        rTotalTax = zGrossAmount * rRate; zTotalTax += rTotalTax;
        $(row).text(formatCurrency(rTotalTax)); $(row).data('amount', rTotalTax)
    });
    $("#myModal .order-total").text(formatCurrency(zGrossAmount + zTotalTax));
    $("#myModal .order-total").data('total', (zGrossAmount + zTotalTax)); $("#myModal .order-total").data('tax', zTotalTax); $("#myModal .order-total").data('qty', zQty);
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Post and Post Meta (Save/Update) ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function createPostMeta() {
    let oid = 0, _total = parseFloat($("#myModal .order-total").data('total')) || 0.00, _tax = parseFloat($("#myModal .order-total").data('tax')) || 0.00;
    let _list = [
        { post_id: oid, meta_key: '_shipping_first_name', meta_value: $('#txtshipfirstname').val() }, { post_id: oid, meta_key: '_shipping_last_name', meta_value: $('#txtshiplastname').val() },
        { post_id: oid, meta_key: '_shipping_address_1', meta_value: $('#txtshipaddress1').val() }, { post_id: oid, meta_key: '_shipping_address_2', meta_value: $('#txtshipaddress2').val() },
        { post_id: oid, meta_key: '_shipping_city', meta_value: $('#txtshipcity').val() }, { post_id: oid, meta_key: '_shipping_state', meta_value: $('#ddlshipstate').val() },
        { post_id: oid, meta_key: '_shipping_postcode', meta_value: $('#txtshipzipcode').val() }, { post_id: oid, meta_key: '_shipping_country', meta_value: $('#ddlshipcountry').val() },
        { post_id: oid, meta_key: '_shipping_email', meta_value: '' }, { post_id: oid, meta_key: '_shipping_phone', meta_value: '' },
        { post_id: oid, meta_key: '_order_total', meta_value: _total }, { post_id: oid, meta_key: '_cart_discount', meta_value: 0 },
        { post_id: oid, meta_key: '_cart_discount_tax', meta_value: '0' }, { post_id: oid, meta_key: '_order_shipping', meta_value: 0 },
        { post_id: oid, meta_key: '_order_shipping_tax', meta_value: '0' }, { post_id: oid, meta_key: '_order_tax', meta_value: _tax },
        { post_id: oid, meta_key: '_gift_amount', meta_value: 0 }, { post_id: oid, meta_key: 'total_gcamt', meta_value: 0 }
    ];
    return _list;
}
function createPostStatus() {
    let oid = 0, _total = parseFloat($("#myModal .order-total").data('total')) || 0.00, _tax = parseFloat($("#myModal .order-total").data('tax')) || 0.00;
    let _list = {
        order_id: oid, parent_id: 0, returning_customer: 0, customer_id: parseInt($("#txtshipfirstname").data('customer')) || 0,
        num_items_sold: parseInt($("#myModal .order-total").data('qty')) || 0, total_sales: _total, tax_total: _tax, shipping_total: 0.00, net_total: _total, status: 'wc-pending', customer_notes: ''
    };
    return _list;
}
function createItemsList() {
    let tax_rate = parseFloat($('#myModal #txtshipzipcode').data('tax_rate')) || 0.00;
    let _list = [], oid = 0, cid = parseInt($("#txtshipfirstname").data('customer')) || 0;
    let _taxes = []; _taxdata = { total: {}, subtotal: {} };
    $('#myModal .refund_order_tax_total .tax-total').each(function (index, li) { _taxes.push({ label: $(li).data('name'), percent: parseFloat($(li).data('percent')) || 0.00 }); });
    //Add Product
    $('#myModal .refund_order_line_items > tr').each(function (index, tr) {
        let qty = parseFloat($(tr).find("[name=txt_ItemQty]").val()) || 0.00, rate = parseFloat($(tr).find(".item-total").data("salerate")) || 0.00;
        let grossAmount = qty * rate, discountAmount = 0.00, shippinAmount = 0.00;
        let taxAmount = grossAmount * tax_rate;
        _taxdata = { total: {}, subtotal: {} };
        $.each(_taxes, function (i, r) {
            _taxdata.total[r.label] = ((grossAmount - discountAmount) * r.percent).toFixed(4); _taxdata.subtotal[r.label] = ((grossAmount - discountAmount) * r.percent).toFixed(4);
        });
        _list.push({
            order_item_id: 0, PKey: index, order_id: oid, customer_id: cid, product_type: 'line_item', product_id: $(tr).data('pid'), variation_id: $(tr).data('vid'), product_name: $(tr).data('pname'), quantity: qty, sale_rate: rate, total: grossAmount, discount: discountAmount, tax_amount: taxAmount, shipping_amount: shippinAmount * qty, shipping_tax_amount: 0,
            order_itemmeta: [], meta_data: serialize(_taxdata)
        });
    });

    //Add Fee
    //$('#order_fee_line_items > tr').each(function (index, tr) {
    //    _list.push({ order_item_id: parseInt($(tr).data('orderitemid')), order_id: oid, product_name: $(tr).data('pname'), product_type: 'fee', total: parseFloat($(tr).find(".TotalAmount").text()) || 0.00, tax_amount: 0 });
    //});
    //Add Tax
    $('#myModal .refund_order_tax_total .tax-total').each(function (index, li) {
        _list.push({ order_item_id: 0, order_id: oid, product_name: $(li).data('name'), meta_data: $(li).data('label'), product_type: 'tax', tax_rate_state: 0, tax_amount: parseFloat($(li).data('percent')) || 0, total: parseFloat($(li).data('amount')) || 0, shipping_tax_amount: 0 });
    });
    return _list;
}
function ValidateData() {
    if ($('#txtshipfirstname').val() == '') { swal('Error!', 'Please Enter Shipping First Name.', "error").then((result) => { $('#txtshipfirstname').focus(); return false; }); return false; }
    else if ($('#txtshiplastname').val() == '') { swal('Error!', 'Please Enter Shipping Last Name.', "error").then((result) => { $('#txtshiplastname').focus(); return false; }); return false; }
    else if ($('#txtshipaddress1').val() == '') { swal('Error!', 'Please Enter Shipping Address.', "error").then((result) => { $('#txtshipaddress1').focus(); return false; }); return false; }
    else if ($('#txtshipzipcode').val() == '') { swal('Error!', 'Please Enter Shipping Post Code.', "error").then((result) => { $('#txtshipzipcode').focus(); return false; }); return false; }
    else if ($('#txtshipcity').val() == '') { swal('Error!', 'Please Enter Shipping City.', "error").then((result) => { $('#txtshipcity').focus(); return false; }); return false; }
    else if ($('#ddlshipcountry').val() == '') { swal('Error!', 'Please Select Shipping Country.', "error").then((result) => { $('#ddlshipcountry').select2('open'); return false; }); return false; }
    else if ($('#ddlshipstate').val() == '' || $('#ddlshipstate').val() == '0') { swal('Error!', 'Please Select Shipping State.', "error").then((result) => { $('#ddlshipstate').select2('open'); return false; }); return false; }
    return true;
}
function SaveNewOrder() {
    let oid = parseInt($('#txtshipfirstname').data('oid')) || 0, cid = parseInt($("#txtshipfirstname").data('customer')) || 0;
    if (!ValidateData()) { $("#loader").hide(); return false };

    let postMeta = createPostMeta(), postStatus = createPostStatus(), itemsDetails = createItemsList();

    if (postStatus.num_items_sold <= 0) { swal('Error!', 'Please add product.', "error").then((result) => { $('#ddlorderitem').select2('open'); return false; }); return false; }
    let obj = { ticket_id: parseInt($('#txtshipfirstname').data('id')) || 0, order_id: oid, OrderPostStatus: postStatus, OrderPostMeta: postMeta, OrderProducts: itemsDetails };
    //console.log(obj); return;
    $.ajax({
        url: "/customer-service/create-component-order", type: "POST", contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj), dataType: "json", beforeSend: function () { $("#loader").show(); },
        success: function (result) {
            if (result.status) {
                //PaymentOptions(927975);
                PaymentOptions(result.id);
            }
            else { swal('Error', 'Something went wrong, please try again.', "error").then((result) => { return false; }); }
        },
        error: function (xhr, status, err) { $("#loader").hide(); alert(err); },
        complete: function () { $("#loader").hide(); },
    });
    $('#btnCheckout').text("Checkout");
    return false;
}
function PaymentOptions(order_id) {
    $("#myModal .modal-body :input").prop("disabled", true); $("#myModal .new-order-no").text('Order No #' + order_id);
    let _total = parseFloat($("#myModal .order-total").data('total')) || 0.00, _phone = $('#txtshipfirstname').data('phone');
    let _html = '<div class="col-md-3 flex-fill">';
    _html += '    <select class="form-control form-select form-select-sm" id="ddlPaymentMethod" style="width: auto;">';
    _html += '        <option value="podium">Podium Payments</option><option value="ppec_paypal">PayPal</option>';
    _html += '    </select>';
    _html += '</div>';
    _html += '<div class="col-md-6 podiumchannel flex-fill">';
    _html += '    <label class="form-check-label"><input type="radio" name="podiumchannel" checked="" value="' + $('#txtshipfirstname').data('email') + '"> Email Channel</label>';
    _html += '    <label class="form-check-label"><input type="radio" name="podiumchannel" value="' + _phone + '"> SMS Channel</label>';
    _html += '</div>';
    _html += '<button type="button" class="btn btn-primary" onclick="AcceptPayment(' + order_id + ');">Generate Payment Invoice $' + _total + '</button>';
    $('#myModal .modal-footer').empty().append(_html);
}
function AcceptPayment(order_id) {
    if ($("#ddlPaymentMethod").val() == "ppec_paypal") { PaypalPayment(order_id); ActivityLog('Order  id (' + $('#hfOrderNo').val() + ') proceed for paypal payment from order payment invoice.', '/customer-service/search-customer/' + $('#hfOrderNo').val() + ''); }
    else if ($("#ddlPaymentMethod").val() == "podium") { PodiumPayment(order_id); ActivityLog('Order  id (' + order_id + ') proceed for podium payment from order payment invoice.', '/customer-service/search-customer/' + order_id + ''); }
    else { swal('Alert!', 'Please Select Payment Method.', "error"); }
}
function PodiumPayment(order_id) {
    let bill_to = $('input[name="podiumchannel"]:checked').val(), bill_name = $('#myModal #txtshipfirstname').data('name');
    let tax_total = parseFloat($("#myModal .order-total").data('tax')) || 0.00;
    let parent_order = parseInt($(".order-id").data('order_id')) || 0;
    let _lineItems = [];
    $('#myModal .refund_order_line_items > tr').each(function (index, tr) {
        let qty = parseFloat($(tr).find("[name=txt_ItemQty]").val()) || 0.00, rate = parseFloat($(tr).find(".item-total").data("salerate")) || 0.00;
        let grossAmount = qty * rate;
        if (grossAmount > 0) _lineItems.push({ description: $(this).data('pname').replace(/[^a-zA-Z0-9 ]/g, "").substring(0, 40) + ' X ' + qty.toFixed(0), amount: grossAmount * 100 });
    });
    if (tax_total > 0) _lineItems.push({ description: "Tax", amount: tax_total * 100 });

    let opt_inv = { strValue1: bill_to, strValue2: bill_name, strValue3: 'INV-' + order_id, strValue4: JSON.stringify(_lineItems), strValue5: '' };
    console.log('Creating Podium Payment Invoice...', opt_inv);
    swal.queue([{
        title: 'Podium Payment Processing.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
        onOpen: () => {
            swal.showLoading();
            $.get('/Setting/GetPodiumInvoice', opt_inv).then(response => {
                console.log(response);
                let _data = JSON.parse(response.message);
                let opt = { OrderPostMeta: [{ post_id: order_id, meta_key: '_payment_method', meta_value: 'podium' }, { post_id: order_id, meta_key: '_payment_method_title', meta_value: 'Podium Payments' }, { post_id: order_id, meta_key: '_podium_uid', meta_value: _data.data.uid }, { post_id: order_id, meta_key: 'taskuidforsms', meta_value: _data.data.uid }, { post_id: order_id, meta_key: '_podium_status', meta_value: 'SENT' }] };

                $.post('/OrdersMySQL/UpdatePaymentInvoiceID', opt).then(response => {
                    swal('Success!', response.message, 'success');
                    if (response.status == true) { $("#myModal").modal('hide'); OrderInfo(parent_order); }
                }).catch(err => { console.log(err); swal.hideLoading(); swal('Error!', err, 'error'); });
            }).catch(err => { swal.hideLoading(); swal('Error!', err, 'error'); });//.always(function () { swal.hideLoading(); });
        }
    }]);
}
function PaypalPayment(order_id) {
    let parent_order = parseInt($(".order-id").data('order_id')) || 0, oid = order_id, pp_no = 'WC-' + new Date().getTime();
    let option_pp = createPaypalXML(oid, pp_no);
    console.log('Start PayPal Payment Processing...');
    swal.queue([{
        title: 'PayPal Payment Processing.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
        onOpen: () => {
            swal.showLoading();
            $.post('/Setting/CreatePayPalInvoice', { strValue1: '', strValue2: JSON.stringify(option_pp) }).then(response => {
                let _data = JSON.parse(response.message); let id = _data.href.split('/');
                let _postMeta = [
                    { post_id: oid, meta_key: '_payment_method', meta_value: 'ppec_paypal' }, { post_id: oid, meta_key: '_payment_method_title', meta_value: 'PayPal' },
                    { post_id: oid, meta_key: '_paypal_invoice_id', meta_value: pp_no }, { post_id: oid, meta_key: '_paypal_id', meta_value: id[id.length - 1].replace(/\#/g, '') },
                    { post_id: oid, meta_key: '_transaction_id', meta_value: id[id.length - 1].replace(/\#/g, '') }, { post_id: oid, meta_key: '_paypal_status', meta_value: 'SENT' }
                ];
                let mail_body = 'Hi ' + $('#myModal #txtshipfirstname').data('name') + ', {BR}Please use this secure link to make your payment. Thank you! ' + _data.href;
                let opt = { b_email: $('#myModal #txtshipfirstname').data('email'), payment_method: 'PayPal Payment request from Layla Sleep Inc.', payment_method_title: mail_body, OrderPostMeta: _postMeta };
                $.post('/OrdersMySQL/UpdatePaymentInvoiceID', opt).then(result => {
                    swal('Success!', result.message, 'success');
                    if (response.status == true) { $("#myModal").modal('hide'); OrderInfo(parent_order); }
                }).catch(err => { console.log(err); swal.hideLoading(); });
                swal.hideLoading();
            }).catch(err => { swal.hideLoading(); swal('Error!', err, 'error'); });//.always(function () { swal.hideLoading(); });
        }
    }]);
}
function createPaypalXML(oid, pp_no) {
    let taxPer = parseFloat($('#myModal #txtshipzipcode').data('tax_rate')) || 0.00, df = moment().format('YYYY-MM-DD');
    let _items = [], paypal_seller_email = $('.page-heading').data('paypal_seller'), pp_email = $('#txtshipfirstname').data('email');
    //get items
    $('#myModal .refund_order_line_items > tr').each(function (index, tr) {
        let qty = parseFloat($(tr).find("[name=txt_ItemQty]").val()) || 0.00, rate = parseFloat($(tr).find(".item-total").data("salerate")) || 0.00;
        let discountAmount = 0.00, taxAmount = 0.00;
        _items.push({ name: $(tr).data('pname'), quantity: qty, unit_amount: { currency_code: "USD", value: rate }, tax: { name: "Sales Tax", value: taxAmount, percent: taxPer * 100 }, discount: { amount: { currency_code: "USD", value: discountAmount } }, unit_of_measure: "QUANTITY" });
    });
    let paupal_xml = {
        id: '', status: "DRAFT",
        detail: { invoice_number: pp_no, reference: oid, invoice_date: df, currency_code: "USD", note: 'Layla Invoice.', payment_term: { term_type: "NET_10" } },
        invoicer: {
            name: { given_name: "", surname: "" },
            address: { address_line_1: "157 Church Street Suite 1956", address_line_2: "", admin_area_2: "New Haven", admin_area_1: "CT", postal_code: "06510", country_code: "US" },
            email_address: paypal_seller_email,
            phones: [{ country_code: "001", national_number: "8553581676", phone_type: "MOBILE" }],
            website: "www.laylasleep.com",
            logo_url: "https://laylasleep-quickfix1.netdna-ssl.com/wp-content/themes/layla-white/images/logo.png",
            additional_notes: ""
        },
        primary_recipients: [
            {
                billing_info: {
                    name: { given_name: $('#myModal #txtshipfirstname').data('name'), surname: '' },
                    address: { address_line_1: $('#txtshipaddress1').val() + ' ' + $('#txtshipaddress2').val(), admin_area_2: $('#txtshipcity').val(), admin_area_1: $('#ddlshipstate').val(), postal_code: $('#txtshipzipcode').val(), country_code: $('#ddlshipcountry').val() },
                    //name: { given_name: $('#txtbillfirstname').val(), surname: $('#txtbilllastname').val() },
                    //address: { address_line_1: $('#txtbilladdress1').val() + ' ' + $('#txtbilladdress2').val(), admin_area_2: $('#txtbillcity').val(), admin_area_1: $('#ddlbillstate').val(), postal_code: $('#txtbillzipcode').val(), country_code: $('#ddlbillcountry').val() },
                    email_address: pp_email,
                },
                shipping_info: {
                    name: { given_name: $('#txtshipfirstname').val(), surname: $('#txtshiplastname').val() },
                    address: { address_line_1: $('#txtshipaddress1').val() + ' ' + $('#txtshipaddress2').val(), admin_area_2: $('#txtshipcity').val(), admin_area_1: $('#ddlshipstate').val(), postal_code: $('#txtshipzipcode').val(), country_code: $('#ddlshipcountry').val() }
                }
            }
        ],
        items: _items,
        configuration: { partial_payment: { allow_partial_payment: false }, allow_tip: false, tax_calculated_after_discount: true, tax_inclusive: false },
        //amount: { breakdown: { discount: { invoice_discount: { percent: 0 } }, shipping: { amount: { currency_code: "USD", value: shipping_total } }, custom: { label: 'Other Fee', amount: { currency_code: "USD", value: 0 } } } },
        payment_method: { payee_preferred: "UNRESTRICTED" }
    }
    return paupal_xml;
}