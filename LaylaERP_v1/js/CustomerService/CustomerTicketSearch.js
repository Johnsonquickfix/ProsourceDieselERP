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
    $(document).on("click", "#btnSearch", function (t) { t.preventDefault(); $('#lblemail').text('');dataGridLoad(); });
    $(document).on("keypress", "#txtOrderNo,#txtOrderPhone,#txtTicketNo", function (t) { if (t.keyCode == 13) { $('#lblemail').text(''); dataGridLoad(); } });

    $.when(dataGridLoad()).done(function () { });
    $(document).on("click", "[name='ticke_action']", function (t) {
        $("[name='ticke_action']").not(this).prop("checked", false)
    });
    lightbox.option({ resizeDuration: 200, wrapAround: true, showImageNumberLabel: false,  alwaysShowNavOnTouchDevices: true });
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
    
    var search = $('#lblemail').text();
    console.log(search);
    let cus_id = (parseInt($('#ddlUser').val()) || 0), order_id = (parseInt($('#txtOrderNo').val()) || 0), ticket_id = (parseInt($('#txtTicketNo').val()) || 0);
    let table_oh = $('#dtTickets').DataTable({
         
        oSearch: { "sSearch": search }, columnDefs: [{ "orderable": false, "targets": 0 }], order: [[0, "desc"]], lengthMenu: [[10, 20, 50], [10, 20, 50]],
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
        sAjaxSource: "/customer-service/ticket-list/",
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
            { data: 'id', title: 'Ticket No.', sWidth: "10%", render: function (id, type, full, meta) { return '<div class="text-gray-800 fw-boldest">#' + id + '</div>'; } },
            { data: 'subject', title: 'Subject', sWidth: "15%" },
            { data: 'ticket_date', title: 'Ticket Date', sWidth: "10%" },
            {
                data: 'order_id', title: 'OrderID', sWidth: "10%",
                render: function (id, type, full, meta) {
                    if (full.post_mime_type == 'shop_order_erp' || full.post_mime_type == 'shopordererp') return '<div class="text-gray-800 fw-boldest">#' + id + '</div> <i class="glyphicon glyphicon-user" title="Order created from ERP Admin." aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>';
                    else return '<div class="text-gray-800 fw-boldest">#' + id + '</div>';
                }
            },
            { data: 'order_date', title: 'Order Date', sWidth: "10%" },
            {
                data: 'email', title: 'Email', sWidth: "10%",
                render: function (id, type, row) { return '<div class="text-gray-800 text-hover-primary fw-boldest">' + row.first_name + ' ' + row.last_name + '</div><div class="text-gray-400 fw-bold">' + row.email + '</div>'; }
            },
            {
                data: 'total_sales', title: 'Order Total', sWidth: "10%", render: function (id, type, row, meta) {
                    let sale_amt = parseFloat(row.total_sales) || 0.00, refund_amt = parseFloat(row.refund_total) || 0.00, refund_gc_amt = parseFloat(row.refund_giftcard_total) || 0.00;
                    let amt = refund_amt != 0 ? '<span style="text-decoration: line-through;"> $' + sale_amt.toFixed(2) + '<br></span><span style="text-decoration: underline;"> $' + (parseFloat(sale_amt) + refund_amt).toFixed(2) + '</span>' : '$' + sale_amt.toFixed(2);
                    amt += refund_gc_amt != 0 ? '<br>Refunded by gift card : $' + refund_gc_amt.toFixed(2) : '';
                    return amt;
                }
            },
            { data: 'agent_name', title: 'Agent Name', sWidth: "10%" },
            {
                data: 'ticket_action', title: 'Ticket Action', sWidth: "10%", render: function (data, type, row) {
                    if (data == 'wp_return') return '<div class="badge badge-light-primary">Return</div>';
                    else if (data == 'wp_return_to_vender') return '<div class="badge badge-light-primary">Return to vendor</div>';
                    else if (data == 'wp_replacement') return '<div class="badge badge-light-primary">Replacement</div>';
                    else if (data == 'wp_createorder') return '<div class="badge badge-light-primary">Create new order</div>';
                    else if (data == 'wp_declined') return '<div class="badge badge-light-danger">Declined</div>';
                    else return '<div class="badge badge-light-warning">Processing</div>';
                }
            },
            {
                'data': 'id', title: 'Action', sWidth: "8%", render: function (id, type, row, meta) {
                    return '<a href="javascript:void(0);" onclick="ClaimWarrantyModal(' + id + ',\'' + row.ticket_action + '\');" data-toggle="tooltip" title="View Warranty claim detail."><i class="glyphicon glyphicon-eye-open"></i></a>'
                }
            }
        ]
    });
}

function ClaimWarrantyModal(id, _action) {
    let modalHtml = '<div class="modal-dialog modal-fullscreen p-12">';
    modalHtml += '<div class="modal-content modal-rounded">';
    modalHtml += '<div class="modal-header py-3 justify-content-start"><h4 class="modal-title flex-grow-1">Refunds/Returns/Warranty claim details.</h4><button type="button" class="btn btn-sm" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button></div>';
    modalHtml += '<div class="modal-body"></div>';
    modalHtml += '<div class="modal-footer py-3"></div>';
    modalHtml += '<div class="modal-footer py-3"><button type="button" class="btn btn-sm btn-primary" data-id="' + id + '" onclick="UpdateTicketAction(this);"><i class="fa fa-paper-plane"></i> Submit</button></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#myModal").empty().html(modalHtml);

    modalHtml = '';
    $.get('/customer-service/ticket-info', { strValue1: id }).then(response => {
        response = JSON.parse(response);
        modalHtml += '<div class="row">';
        modalHtml += '<div class="col-lg-4 m-0 me-xl-10 me-lg-5 d-print-none border border-dashed border-gray-300 card-rounded h-lg-100 min-w-md-350px p-5 bg-lighten order-info">';
        $.each(response, function (i, row) {
           
            let _json = JSON.parse(row.order_details); //console.log(_json);
            $(".order-id").data('email', _json._billing_email); $(".order-id").data('name', _json._billing_first_name + ' ' + _json._billing_last_name);
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

        modalHtml += '<div class="row notice bg-light-primary rounded border-primary border border-dashed p-6 mb-2">';
        modalHtml += '  <div class="d-flex align-items-center me-5">';
        modalHtml += '      <div class="symbol symbol-50px me-6"><span class="symbol-label bg-light-success"><i class="fa fa-box-open text-primary"></i></span></div>';
        modalHtml += '      <span class="me-5">';
       // modalHtml += '          <span class="fw-bolder fs-5 mb-0">Is the box or package open or not?</span>';
        modalHtml += '          <span class="fw-bolder fs-5 mb-0">Have you received the product within the last 30 days?*</span> </br>';
        modalHtml += '          <span>The date the product was delivered is determined by the carrier tracking number.</span>';
        if (response[0].box_is_opened) modalHtml += '          <span class="badge badge-success fs-base">Yes</span>';
        else modalHtml += '          <span class="badge badge-danger fs-base text-uppercase">No</span>';
        modalHtml += '      </span>';
        modalHtml += '  </div>';
        modalHtml += '</div>';

        modalHtml += '<div class="row notice bg-light-primary rounded border-primary border border-dashed p-6 mb-2">';
        modalHtml += '  <div class="d-flex align-items-center me-5">';
        modalHtml += '      <div class="symbol symbol-50px me-6"><span class="symbol-label bg-light-success"><i class="fa fa-box-open text-primary"></i></span></div>';
        modalHtml += '      <span class="me-5">';
        // modalHtml += '          <span class="fw-bolder fs-5 mb-0">Is the box or package open or not?</span>';
        modalHtml += '          <span class="fw-bolder fs-5 mb-0">Was this product installed and/or attempted to be installed?*</span> </br>';
        modalHtml += '          <span>In order to expedite the processing of your request please upload an image.</span>';
        if (response[0].box_is_installed) modalHtml += '          <span class="badge badge-success fs-base">Yes</span>';
        else modalHtml += '          <span class="badge badge-danger fs-base text-uppercase">No</span>';
        modalHtml += '      </span>';
        modalHtml += '  </div>';
        modalHtml += '</div>';

        //Show Image
        try {
            let _gdrive_link = isNullUndefAndSpace(response[0].gdrive_link) ? JSON.parse(response[0].gdrive_link) : [];
            if (_gdrive_link.length > 0) {
                modalHtml += '<div class="d-flex flex-wrap align-items-center border border-dashed border-gray-300 rounded min-w-700px p-7">';
                $.each(_gdrive_link, function (i, row) {
                    console.log(row.files);
                    if (row.files.includes('https://drive.google.com')) {
                        modalHtml += '  <div class="overlay me-10">';
                        modalHtml += '      <div class="overlay-wrapper"><a class="example-image-link" href="' + row.files + '" data-lightbox="example-set" data-title=""><img class="example-image rounded w-150px" src="' + row.files + '" alt="-"></a></div>';
                        modalHtml += '  </div>';
                    }
                    else {
                        modalHtml += '  <div class="overlay me-10">';
                        modalHtml += '      <div class="overlay-wrapper"><a class="example-image-link" href="../' + row.files + '" data-lightbox="example-set" data-title=""><img class="example-image rounded w-150px" src="../' + row.files + '" alt="-"></a></div>';
                        modalHtml += '  </div>';
                    }
                });
                modalHtml += '</div>';
            }
        }
        catch { };

        //Add comments
        let _agent_comments = isNullUndefAndSpace(response[0].ticket_comments) ? JSON.parse(response[0].ticket_comments) : [];
        modalHtml += '<div class="separator separator-dashed my-3"></div>';
        modalHtml += '<div class="row order-comments mb-6"><div class="col-lg-12">';
        $.each(_agent_comments, function (i, row) {
            if (row.comment_from == 'agent') {
                modalHtml += '<div class="d-flex flex-column align-items-start">';
                modalHtml += '  <div class="d-flex align-items-center mb-2">';
                modalHtml += '    <div class="ms-3 fs-5 fw-bolder text-gray-900 text-hover-primary me-1">' + row.comment_from + '</div>';
                modalHtml += '  </div>';
                modalHtml += '  <div class="p-5 rounded bg-light-info text-dark fw-bold mw-lg-400px text-start">' + row.ticket_comment + '</div>';
                modalHtml += '</div>';
            }
            else {
                modalHtml += '<div class="d-flex flex-column align-items-end">';
                modalHtml += '  <div class="d-flex align-items-center mb-2">';
                modalHtml += '    <div class="ms-3 fs-5 fw-bolder text-gray-900 text-hover-primary me-1">' + row.comment_from + '</div>';
                modalHtml += '  </div>';
                modalHtml += '<div class="p-5 rounded bg-light-primary text-dark fw-bold mw-lg-400px text-end">' + row.ticket_comment + '</div>';
                modalHtml += '</div>';
            }
        });
        modalHtml += '</div></div>';

        //Add action
        modalHtml += '<div class="row notice bg-light-warning rounded border-warning border border-dashed p-6">';
        modalHtml += '<div class="col-lg-12">';

        modalHtml += '<label class="d-flex align-items-center">';
        modalHtml += '<input class="form-check-input m-3" type="checkbox" name="ticke_action" value="wp_return" ' + (_action == 'wp_return' ? 'checked' : '') + '>';
        modalHtml += '<span class="form-check-label d-flex flex-column align-items-start">';
        modalHtml += '<span class="text-gray-900 fw-bolder">Return</span><span class="fs-6 text-gray-700 pe-7">Damage claim for the entire product.</span>';
        modalHtml += '</span>';
        modalHtml += '</label><div class="separator separator-dashed my-3"></div>';

        if (response[0].box_is_opened) {
            modalHtml += '<label class="d-flex align-items-center">';
            modalHtml += '<input class="form-check-input m-3" type="checkbox" name="ticke_action" value="wp_return_to_vender" ' + (_action == 'wp_return_to_vender' ? 'checked' : '') + '>';
            modalHtml += '<span class="form-check-label d-flex flex-column align-items-start">';
            modalHtml += '<span class="text-gray-900 fw-bolder">Return to vendor</span><span class="fs-6 text-gray-700 pe-7">Damage claim for the entire product.</span>';
            modalHtml += '</span>';
            modalHtml += '</label><div class="separator separator-dashed my-3"></div>';
        }

        modalHtml += '<label class="d-flex align-items-center">';
        modalHtml += '<input class="form-check-input m-3" type="checkbox" name="ticke_action" value="wp_replacement" ' + (_action == 'wp_replacement' ? 'checked' : '') + '>';
        modalHtml += '<span class="form-check-label d-flex flex-column align-items-start">';
        modalHtml += '<span class="text-gray-900 fw-bolder">Replacement</span><span class="fs-6 text-gray-700 pe-7">Damage/wrong item claim for just a part or entire product.</span>';
        modalHtml += '</span>';
        modalHtml += '</label><div class="separator separator-dashed my-3"></div>';

        modalHtml += '<label class="d-flex align-items-center">';
        modalHtml += '<input class="form-check-input m-3" type="checkbox" name="ticke_action" value="wp_createorder" ' + (_action == 'wp_createorder' ? 'checked' : '') + '>';
        modalHtml += '<span class="form-check-label d-flex flex-column align-items-start">';
        modalHtml += '<span class="text-gray-900 fw-bolder">Create new order</span><span class="fs-6 text-gray-700 pe-7">Missing/required/additional item claim for in warranty or out of warranty.</span>';
        modalHtml += '</span>';
        modalHtml += '</label><div class="separator separator-dashed my-3"></div>';

        modalHtml += '<label class="d-flex align-items-center">';
        modalHtml += '<input class="form-check-input m-3" type="checkbox" name="ticke_action" value="wp_declined" ' + (_action == 'wp_declined' ? 'checked' : '') + '>';
        modalHtml += '<span class="form-check-label d-flex flex-column align-items-start">';
        modalHtml += '<span class="text-gray-900 fw-bolder">Declined</span><span class="fs-6 text-gray-700 pe-7">There\'s no need for either customer to open support ticket.</span>';
        modalHtml += '</span>';
        modalHtml += '</label>';

        modalHtml += '</div>';
        modalHtml += '</div>';

        modalHtml += '<div class="row notice bg-light-warning rounded border-warning border border-dashed p-6 mt-4">';
        modalHtml += '<div class="col-lg-12">';
        modalHtml += '<label class="form-label text-gray-800 fw-bolder">Retention Specialist Comment</label>';
        modalHtml += '<textarea id="kt_warranty_claim_note" class="form-control mb-2" placeholder="Type your comment." rows="3" maxlength="500"></textarea>';
        modalHtml += '</div>';
        modalHtml += '</div>';

        modalHtml += '</div>';
        modalHtml += '</div>';
    }).catch(err => { }).always(function () { $('#myModal .modal-body').append(modalHtml); });

    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $("input[name='ticke_action'][value=" + _action + "]").prop("checked", true);
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

function UpdateTicketAction(element) {
    let _user = $(".order-id").data('name');
    let email = $(".order-id").data('email');
    let _chk = $("input[name='ticke_action']:checked").val();
    if (_chk == 'wp_declined' && $("#kt_warranty_claim_note").val() == '') { swal('Info!', 'Please enter comment.', "info").then((result) => { $('#kt_warranty_claim_note').focus(); return false; }); return false; }
    let option = { id: parseInt($(element).data('id')) || 0, ticket_action: _chk, comment: $("#kt_warranty_claim_note").val(), comment_by: 'retention_specialist' };
    //console.log(option); return false;
    let _body = TicketMailDetails(_user, option.ticket_action, option.comment);
    //console.log(_body);
    swal.queue([{
        title: '', confirmButtonText: 'Yes, do it!', text: "Update ticket feedback.",
        showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                $.ajax(
                    {
                        method: "POST", timeout: 0, headers: { "Content-Type": "application/json" },
                        url: "/customer-service/ticket-action", data: JSON.stringify({ strValue1: JSON.stringify(option), strValue2: email, strValue3: 'Prosource Diesel Warranty Information', strValue4: _body })
                    }
                ).done(function (result) {
                    result = JSON.parse(result);
                    if (result[0].response == 'success') {
                        $("#myModal").modal('hide'); $('#dtTickets').DataTable().ajax.reload();
                        swal('Success', 'Thank you for giving feedback.', "success");
                    }
                    else { swal('Error', 'Something went wrong, please try again.', "error"); }
                }).catch(err => { swal.hideLoading(); swal('Error!', 'Something went wrong, please try again.', 'error'); });
            });
        }
    }]);
    return false;
}

function TicketMailDetails(name, ticket_action, comment) {
    let Decision = '';
    if (ticket_action == 'wp_return') { Decision = 'Return' }
    else if (ticket_action == 'wp_return_to_vender') { Decision = 'Return to vendor' }
    else if (ticket_action == 'wp_replacement') { Decision = 'Replacement' }
    else if (ticket_action == 'wp_createorder') { Decision = 'Create new order' }
    else if (ticket_action == 'wp_declined') { Decision = 'Declined' }
    let _body = 'Hi ' + name + ',<br/><br/>';
   
    _body += '<br/><b>Retention Specialist Decision:</b>' + Decision + '<br/>';
    _body += '<br/><b>Comment:</b>' + comment + '<br/>';
    _body += '<br/><b>Help Desk <br/>';
    return _body;
}