$(document).ready(function () {
    $("#loader").hide();
    dataGCGridLoad();
})

function dataGCGridLoad(order_type) {
    var urlParams = new URLSearchParams(window.location.search);
    let searchText = urlParams.get('name') ? urlParams.get('name') : '';
    //var monthYear = '', cus_id = (parseInt($('#ddlUser').val()) || 0);
    //if ($('#filter-by-date').val() != "0") monthYear = $('#filter-by-date').val();
    //let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    //let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    //if ($('#txtOrderDate').val() == '') { sd = ''; ed = '' };
    //let dfa = "'" + sd + "' and '" + ed + "'";
    let table = $('#dtGCdata').DataTable({
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
                    else if (data == 'wc-podiumrefund') return 'Podium Refunded';
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