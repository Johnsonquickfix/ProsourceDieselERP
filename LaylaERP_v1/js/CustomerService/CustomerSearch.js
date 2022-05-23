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
                            html: '<div style="display:flex;"><div style="padding:5px" ><div style="font-size: 1.2em">#' + item.id + ' ' +item.user_login + '</div><div><b>' + item.user_email + '</b></div></div></div >'
                        }
                    })
                };
            },
            error: function (xhr, status, err) { }, cache: true
        },
        templateResult: function (data) { return data.html; }, escapeMarkup: function (m) { return m; }
    });
    $(document).on("change", "#ddlUser", function (t) { t.preventDefault(); dataGridLoad(); });
    $("#ddlEmail").select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Search Customer",
        ajax: {
            url: '/customer-service/customer-list', type: "GET", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { return { strValue1: 'EMAIL', strValue2: params.term }; },
            processResults: function (data) { let jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.user_email, id: item.id, } }) }; },
            error: function (xhr, status, err) { console.log(xhr, status, err); }, cache: true
        }
    });
    $(document).on("change", "#ddlEmail", function (t) { t.preventDefault(); dataGridLoad(); });
    $(document).on("click", "#btnSearch", function (t) { t.preventDefault(); dataGridLoad(); });
    $.when(dataGridLoad()).done(function () { });
});
function isNullUndefAndSpace(variable) { return (variable !== null && variable !== undefined && variable !== 'undefined' && variable !== 'null' && variable.length !== 0); }

function UpdateOrders() {
    $.get('/OrdersMySQL/order-import', {}).then(response => { console.log('Done'); }).catch(err => { }).always(function () { });
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
            {
                data: 'first_name', title: 'Name', sWidth: "14%", render: function (id, type, row) {
                    return row.first_name + ' ' + row.last_name;
                }
            },
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
                    //if (row.status != 'wc-cancelled' && row.status != 'wc-failed' && row.status != 'wc-cancelnopay') {
                    if (row.status == 'wc-pending' || row.status == 'wc-pendingpodiuminv') {
                        if (row.payment_method == 'ppec_paypal' && row.paypal_status != 'COMPLETED') return ' <a href="javascript:void(0);" data-toggle="tooltip" title="Check PayPal Payment Status." onclick="PaymentStatus(' + row.id + ',\'' + row.paypal_id + '\',\'' + row.billing_email + '\');">' + pm_title + '</a>';
                        else if (row.payment_method == 'podium' && row.podium_status != 'PAID') return ' <a href="javascript:void(0);" data-toggle="tooltip" title="Check PayPal Payment Status." onclick="podiumPaymentStatus(' + row.id + ',\'' + row.podium_uid + '\',\'' + row.billing_email + '\');">' + pm_title + '</a>';
                        //else if (row.payment_method == 'podium' ) return ' <a href="javascript:void(0);" data-toggle="tooltip" title="Check PayPal Payment Status." onclick="podiumPaymentStatus(' + row.id + ',\'' + row.podium_uid + '\',\'' + row.billing_email + '\');">' + pm_title + '</a>';
                        //if (row.payment_method == 'ppec_paypal') return ' <a href="javascript:void(0);" data-toggle="tooltip" title="Check PayPal Payment Status." onclick="PaymentStatus(' + row.id + ',\'' + row.paypal_id + '\');">' + row.payment_method_title + '</a>';
                        else return pm_title;
                    }
                    else return pm_title;
                }
            },
            {
                'data': 'id', title: 'Action', sWidth: "8%", 'render': function (id, type, row, meta) {
                    let refund_amt = parseFloat(row.refund_total) || 0.00, refund_gc_amt = parseFloat(row.refund_giftcard_total) || 0.00;;
                    refund_amt = refund_amt + refund_gc_amt;
                    if ($("#hfEdit").val() == "1") {
                        if (_editable == 1) {
                            if ((row.status == 'wc-pending' || row.status == 'wc-pendingpodiuminv') && refund_amt == 0) return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/OrdersMySQL/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="javascript:void(0);" onclick="cancelorder(' + id + ');" data-toggle="tooltip" title="Cancel Order"><i class="fa fa-times-circle text-danger"></i></a>';
                            else if ((row.status == 'wc-pending' || row.status == 'wc-pendingpodiuminv') && refund_amt != 0) return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/OrdersMySQL/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a>';
                            else if ((row.status == 'wc-processing' || row.status == 'wc-on-hold') && refund_amt == 0) return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/OrdersMySQL/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="OrderRefund/' + id + '" data-toggle="tooltip" title="Refund Order"><i class="fa fa-undo" onclick="ActivityLog(\'Refund order id (' + id + ') in order history.\',\'/OrdersMySQL/OrdersHistory/' + id + '\'); return true;"></i></a> <a href="javascript:void(0);" onclick="cancelorder(' + id + ');" data-toggle="tooltip" title="Cancel Order"><i class="fa fa-times-circle text-danger"></i></a>';
                            else if ((row.status == 'wc-processing' || row.status == 'wc-on-hold') && refund_amt != 0) return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/OrdersMySQL/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="OrderRefund/' + id + '" data-toggle="tooltip" title="Refund Order"><i class="fa fa-undo" onclick="ActivityLog(\'Refund order id (' + id + ') in order history.\',\'/OrdersMySQL/OrdersHistory/' + id + '\'); return true;"></i></a>';
                            else if (row.status == 'wc-completed') return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/Orders/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="OrderRefund/' + id + '" data-toggle="tooltip" title="Refund Order"><i class="fa fa-undo"></i></a>';
                            else return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/Orders/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a>';
                        }
                        else if (_editable == 0 && _id == row.customer_id) {
                            if ((row.status == 'wc-pending' || row.status == 'wc-pendingpodiuminv') && refund_amt == 0) return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/Orders/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="javascript:void(0);" onclick="cancelorder(' + id + ');" data-toggle="tooltip" title="Cancel Order"><i class="fa fa-times-circle text-danger"></i></a>';
                            else if ((row.status == 'wc-pending' || row.status == 'wc-pendingpodiuminv') && refund_amt != 0) return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/Orders/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a>';
                            else if ((row.status == 'wc-processing' || row.status == 'wc-on-hold') && refund_amt == 0) return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/Orders/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="OrderRefund/' + id + '" data-toggle="tooltip" title="Refund Order" onclick="ActivityLog(\'Refund order id (' + id + ') in order history.\',\'/OrdersMySQL/OrdersHistory/' + id + '\'); return true;"><i class="fa fa-undo"></i></a> <a href="javascript:void(0);" onclick="cancelorder(' + id + ');" data-toggle="tooltip" title="Cancel Order"><i class="fa fa-times-circle text-danger"></i></a>';
                            else if ((row.status == 'wc-processing' || row.status == 'wc-on-hold') && refund_amt != 0) return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/Orders/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="OrderRefund/' + id + '" data-toggle="tooltip" title="Refund Order" onclick="ActivityLog(\'Refund order id (' + id + ') in order history.\',\'/OrdersMySQL/OrdersHistory/' + id + '\'); return true;"><i class="fa fa-undo"></i></a>';
                            else if (row.status == 'wc-completed') return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/Orders/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="OrderRefund/' + id + '" data-toggle="tooltip" title="Refund Order"><i class="fa fa-undo"></i></a>';
                            else return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order"  onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/Orders/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a>';
                        }
                        else {
                            return '<a href="minesofmoria/' + id + '" onclick="ActivityLog(\'Edit order id (' + id + ') in order history.\',\'/Orders/OrdersHistory/' + id + '\'); return true;" data-toggle="tooltip" title="View/Edit Order"><i class="glyphicon glyphicon-eye-open"></i></a>';
                        }
                    }
                    else { return "No Permission"; }
                }
            }
        ]
    });
}