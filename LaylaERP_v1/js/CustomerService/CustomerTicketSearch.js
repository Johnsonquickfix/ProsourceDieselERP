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
            { data: 'first_name', title: 'Name', sWidth: "15%", render: function (id, type, row) { return row.first_name + ' ' + row.last_name; } },
            {
                data: 'total_sales', title: 'Order Total', sWidth: "10%", render: function (id, type, row, meta) {
                    let sale_amt = parseFloat(row.total_sales) || 0.00, refund_amt = parseFloat(row.refund_total) || 0.00, refund_gc_amt = parseFloat(row.refund_giftcard_total) || 0.00;
                    let amt = refund_amt != 0 ? '<span style="text-decoration: line-through;"> $' + sale_amt.toFixed(2) + '<br></span><span style="text-decoration: underline;"> $' + (parseFloat(sale_amt) + refund_amt).toFixed(2) + '</span>' : '$' + sale_amt.toFixed(2);
                    amt += refund_gc_amt != 0 ? '<br>Refunded by gift card : $' + refund_gc_amt.toFixed(2) : '';
                    return amt;
                }
            },
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
    modalHtml += '<div class="modal-footer py-3"><button type="button" class="btn btn-sm btn-primary" data-id="' + id + '">Return</button><button type="button" class="btn btn-sm btn-primary" data-id="' + id + '">Replacement</button><button type="button" class="btn btn-sm btn-primary" data-id="' + id + '">Create new order</button></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#myModal").empty().html(modalHtml);

    modalHtml = '';
    $.get('/customer-service/ticket-info', { strValue1: id }).then(response => {
        response = JSON.parse(response);
        let _chat_history = isNullUndefAndSpace(response[0].chat_history) ? JSON.parse(response[0].chat_history) : [];

        $.each(_chat_history, function (i, row) {
            console.log(i, row, modalHtml);
            modalHtml += '<div class="row">';
            modalHtml += '<div class="col-lg-12">';
            modalHtml += '<h3 class="mb-2">' + row.from+'</h3>';
            modalHtml += '<p class="fs-6 text-gray-600 fw-bold mb-4 mb-lg-8">' + row.content +'</p>';
            modalHtml += '</div>';
            modalHtml += '</div>';
        });
    }).catch(err => { }).always(function () { $('#myModal .modal-body').append(modalHtml);});

    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    //$("#kt_warranty_claim").accordion({
    //    collapsible: true
    //});
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