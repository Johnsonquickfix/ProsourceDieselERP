$(document).ready(function () {
    $("#loader").hide(); $(".select2").select2();
    $(document).on("change", "#ddlSearchBy", function (t) {
        t.preventDefault(); let id = parseInt($("#ddlSearchBy").val()) || 0; SearchByControl(id)
    });
    $(document).on("change", "#ddlUser", function (t) {
        t.preventDefault();
        dataGridLoad();
    });
    $(document).on("change", "#ddlEmail", function (t) {
        t.preventDefault(); dataGridLoad();
    });
    $(document).on("click", "#btnSearch", function (t) { t.preventDefault(); dataGridLoad(); });
    $(document).on("keypress", "#txtOrderNo,#txtOrderPhone,#txtTicketNo", function (t) { if (t.keyCode == 13) { dataGridLoad(); } });

    $.when(dataGridLoad()).done(function () { });
});
function isNullUndefAndSpace(variable) { return (variable !== null && variable !== undefined && variable !== 'undefined' && variable !== 'null' && variable.length !== 0); }
function formatCurrency(total) {
    var neg = false;
    if (total < 0) { neg = true; total = Math.abs(total); }
    return (neg ? "-$" : '$') + parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
}
///Search Control
function SearchByControl(id) {
    if (id == 0) {
        $(".search-control").empty().append('<input id="txtTicketNo" class="form-control" placeholder="Ticket No." style="width: 100%;" maxlength="10">');
    }
    else if (id == 1) {
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

function dataGridLoad() {
    let cus_id = (parseInt($('#ddlUser').val()) || 0), order_id = (parseInt($('#txtOrderNo').val()) || 0), ticket_id = (parseInt($('#txtTicketNo').val()) || 0);
    let table_oh = $('#dtTickets').DataTable({
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
        sAjaxSource: "ticket-list",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: ticket_id }, { name: "strValue2", value: cus_id }, { name: "strValue3", value: order_id }, { name: "strValue4", value: $('#ddlEmail').val() }, { name: "strValue5", value: $('#txtOrderPhone').val() });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                success: function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [
            { data: 'id', title: 'Ticket No.', sWidth: "10%", render: function (id, type, full, meta) { return '#' + id; } },
            { data: 'subject', title: 'Subject', sWidth: "15%" },
            { data: 'ticket_date', title: 'Ticket Date', sWidth: "10%" },
            {
                data: 'order_id', title: 'OrderID', sWidth: "10%",
                render: function (id, type, full, meta) {
                    if (full.post_mime_type == 'shop_order_erp' || full.post_mime_type == 'shopordererp') return '#' + id + ' <i class="glyphicon glyphicon-user" title="Order created from ERP Admin." aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>';
                    else return '#' + id;
                }
            },
            { data: 'order_date', title: 'Order Date', sWidth: "10%" },
            { data: 'email', title: 'Email', sWidth: "10%" },
            { data: 'first_name', title: 'Requester', sWidth: "15%", render: function (id, type, row) { return row.first_name + ' ' + row.last_name; } },
            
            {
                data: 'total_sales', title: 'Order Total', sWidth: "10%", render: function (id, type, row, meta) {
                    let sale_amt = parseFloat(row.total_sales) || 0.00, refund_amt = parseFloat(row.refund_total) || 0.00, refund_gc_amt = parseFloat(row.refund_giftcard_total) || 0.00;
                    let amt = refund_amt != 0 ? '<span style="text-decoration: line-through;"> $' + sale_amt.toFixed(2) + '<br></span><span style="text-decoration: underline;"> $' + (parseFloat(sale_amt) + refund_amt).toFixed(2) + '</span>' : '$' + sale_amt.toFixed(2);
                    amt += refund_gc_amt != 0 ? '<br>Refunded by gift card : $' + refund_gc_amt.toFixed(2) : '';
                    return amt;
                }
            },
            { data: 'agent_name', title: 'Agent Name', sWidth: "10%" },
            //{
            //    data: 'status', title: 'Status', sWidth: "10%", render: function (data, type, row) {
            //        if (data == 'wc-pending') return 'Pending payment';
            //        else if (data == 'wc-processing') return 'Processing';
            //        else if (data == 'wc-on-hold') return 'On hold';
            //        else if (data == 'wc-completed') return 'Completed';
            //        else if (data == 'wc-cancelled') return 'Cancelled';
            //        else if (data == 'wc-refunded') return 'Refunded';
            //        else if (data == 'wc-failed') return 'Failed';
            //        else if (data == 'wc-cancelnopay') return 'Cancelled - No Payment';
            //        else if (data == 'wc-pendingpodiuminv') return 'Pending Podium Invoice';
            //        else if (data == 'wc-podium') return 'Order via Podium';
            //        else if (data == 'wc-podiumrefund') return 'Podium Refunded';
            //        else if (data == 'draft') return 'draft';
            //        else return '-';
            //    }
            //}
            {
                'data': 'id', title: 'Action', sWidth: "8%", 'render': function (id, type, row, meta) {
                    return '<a href="javascript:void(0);" onclick="ClaimWarrantyModal(' + id + ');" data-toggle="tooltip" title="View/Edit Order"><i class="glyphicon glyphicon-eye-open"></i></a>'
                }
            }
        ]
    });
}

function ClaimWarrantyModal(id) {
    let modalHtml = '<div class="modal-dialog modal-fullscreen p-12">';
    modalHtml += '<div class="modal-content modal-rounded">';
    modalHtml += '<div class="modal-header py-3"><h4>Warranty claim detail.</h4><button type="button" class="btn btn-sm" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button></div>';
    modalHtml += '<div class="modal-body"></div>';
    modalHtml += '<div class="modal-footer py-3"><button type="button" class="btn btn-sm btn-primary" data-id="' + id + '">Send to Retention</button><button type="button" class="btn btn-sm btn-primary" data-id="' + id + '">Return</button><button type="button" class="btn btn-sm btn-primary" data-id="' + id + '">Replacement</button><button type="button" class="btn btn-sm btn-primary" data-id="' + id + '">Create new order</button></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#myModal").empty().html(modalHtml);

    modalHtml = '';
    $.get('/customer-service/ticket-info', { strValue1: id }).then(response => {
        response = JSON.parse(response);
        modalHtml += '<div class="row">';
        modalHtml += '<div class="col-lg-4 d-print-none border border-dashed border-gray-300 card-rounded h-lg-100 min-w-md-350px p-5 bg-lighten order-info">';
        $.each(response, function (i, row) {
            let _json = JSON.parse(row.order_details); //console.log(_json);
            
            modalHtml += '      <div class="mb-2 float-right">';
            modalHtml += '          <span class="badge badge-light-success me-2 order-status">' + row.status_desc + '</span>';
            modalHtml += '      </div>';
            modalHtml += '      <h6 class="mb-5 fw-boldest text-gray-600 text-hover-primary order-id">Order #' + row.order_id + '</h6>';
            modalHtml += '      <div class="mb-6">';
            modalHtml += '          <div class="fw-bold text-gray-600 fs-7">Order Date:</div>';
            modalHtml += '          <div class="fw-bolder text-gray-800 fs-6 order-date">' + row.order_date + '</div>';
            modalHtml += '      </div>';
            modalHtml += '      <div class="mb-6">';
            modalHtml += '          <div class="fw-bold text-gray-600 fs-7">Billing:</div>';
            modalHtml += '          <div class="fw-bolder text-gray-800 fs-6 order-billing">';
            modalHtml += '<strong>' + _json._billing_first_name + ' ' + _json._billing_last_name + '</strong><br>';
            if (isNullUndefAndSpace(_json._billing_address_1)) modalHtml += _json._billing_address_1 + '<br>';
            if (isNullUndefAndSpace(_json._billing_address_2)) modalHtml += _json._billing_address_2 + '<br>';
            modalHtml += _json._billing_city + ', ' + _json._billing_state + ' ' + _json._billing_postcode + ' ' + _json._billing_country + '<br>';
            modalHtml += 'Phone: ' + _json._billing_phone + '<br> Email: ' + _json._billing_email;
            modalHtml += '          </div>';
            modalHtml += '      </div>';
            modalHtml += '      <div class="mb-6">';
            modalHtml += '          <div class="fw-bold text-gray-600 fs-7">Shipping:</div>';
            modalHtml += '          <div class="fw-bolder text-gray-800 fs-6 order-billing">';
            modalHtml += '<strong>' + _json._shipping_first_name + ' ' + _json._shipping_last_name + '</strong><br>';
            if (isNullUndefAndSpace(_json._shipping_address_1)) modalHtml += _json._shipping_address_1 + '<br>';
            if (isNullUndefAndSpace(_json._shipping_address_2)) modalHtml += _json._shipping_address_2 + '<br>';
            modalHtml += _json._shipping_city + ', ' + _json._shipping_state + ' ' + _json._shipping_postcode + ' ' + _json._shipping_country;
            modalHtml += '          </div>';
            modalHtml += '      </div>';
            modalHtml += '      <div class="mb-6">';
            modalHtml += '          <div class="fw-bold text-gray-600 fs-7">Order Amount:</div>';
            modalHtml += '          <div class="fw-bolder text-success fs-6 order-amount">' + formatCurrency(_json._order_total) + '</div>';
            modalHtml += '      </div>';
            modalHtml += '      <div class="mb-6">';
            modalHtml += '          <div class="fw-bold text-gray-600 fs-7">Order tax:</div>';
            modalHtml += '          <div class="fw-bolder text-gray-800 fs-6 order-tax">' + formatCurrency(_json._order_tax) + '</div>';
            modalHtml += '      </div>';
            modalHtml += '      <div class="mb-6">';
            modalHtml += '          <div class="fw-bold text-gray-600 fs-7">Payment Mathod:</div>';
            modalHtml += '          <div class="fw-bolder text-gray-800 fs-6 order-payment">' + _json._payment_method_title + '</div>';
            modalHtml += '      </div>';
        });
        modalHtml += '</div>';

        let _chat_history = isNullUndefAndSpace(response[0].chat_history) ? JSON.parse(response[0].chat_history) : [];
        modalHtml += '<div class="col-lg-7 order-info">';
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

    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    //$("#kt_warranty_claim").accordion({
    //    collapsible: true
    //});
}

function OrderInfo(ord_id) {
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
    }).catch(err => { }).always(function () { });
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