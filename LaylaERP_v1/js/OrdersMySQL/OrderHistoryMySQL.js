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
    //GetMonths();
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
    $.when(GetOrderDetails(), CheckPermissions("", "#hfEdit", "", window.location.pathname), UpdateOrders()).done(function () {
        if (order_type.length > 0) {
            $('.subsubsub li a').removeClass('current'); $('#wc-completed').addClass('current'); $('#hfOrderType').val(order_type);
        }
        dataGridLoad(order_type);
    });
    //$("#loader").hide();
    $('#all').click(function () { var order_type = ""; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    $('#mine').click(function () { var order_type = "mine"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    $('#draft').click(function () { var order_type = "draft"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    $('#wc-pending').click(function () { var order_type = "wc-pending"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    $('#wc-processing').click(function () { var order_type = "wc-processing"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    $('#wc-on-hold').click(function () { var order_type = "wc-on-hold"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    $('#wc-completed').click(function () { var order_type = "wc-completed"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    $('#wc-cancelled').click(function () { var order_type = "wc-cancelled"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    $('#wc-refunded').click(function () { var order_type = "wc-refunded"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    $('#wc-failed').click(function () { var order_type = "wc-failed"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    $('#wc-cancelnopay').click(function () { var order_type = "wc-cancelnopay"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    $('#wc-pendingpodiuminv').click(function () { var order_type = "wc-pendingpodiuminv"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    $('#wc-podium').click(function () { var order_type = "wc-podium"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    $('#wc-podiumrefund').click(function () { var order_type = "wc-podiumrefund"; $('#hfOrderType').val(order_type); dataGridLoad(order_type); });
    $('#btnOtherFilter').click(function () { var order_type = $('#hfOrderType').val(); dataGridLoad(order_type); });
    $(document).on("click", "#btnUpdateOrder", function (t) {
        t.preventDefault(); let option = {};
        swal.queue([{
            title: 'Do you want update orders?', confirmButtonText: 'Yes, do it!', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: true, showCloseButton: false, showCancelButton: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    swal.showLoading();
                    $.get('/OrdersMySQL/order-import', {}).then(response => {
                        if (response.status) { swal('Success', 'Orders updated successfully.', 'success'); $('#dtdata').DataTable().ajax.reload(); }
                        else swal('Error!', 'Something went wrong, please try again.', 'error');
                    }).catch(err => { swal.hideLoading(); swal('Error!', 'Something went wrong, please try again.', 'error'); }).always(function () { swal.hideLoading(); });
                    $.get('/OrdersMySQL/giftcard-import', {}).then(response => { }).catch(err => { }).always(function () { });
                });
            }
        }]);
    });

    let cmail_id = localStorage.getItem('_id'); let searchText = localStorage.getItem('_search');
    console.log(cmail_id);
    if (cmail_id == '') {
        $('#atnemail').hide();
        if (searchText == '') { $('#atncustlist').hide() } else { $('#atncustlist').show() }
    } else {
        $('#atnemail').show(); $("#atnemail").attr("href", "../EmailProfile/Compose/" + cmail_id + "?entiid=1");

    }
});
function UpdateOrders() {
    $.get('/OrdersMySQL/order-import', {}).then(response => { console.log('Done'); }).catch(err => { }).always(function () { });
    $.get('/OrdersMySQL/giftcard-import', {}).then(response => { }).catch(err => { }).always(function () { });
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

function OrderRefund(_id) {
    //ActivityLog('Refund order id (' + _id + ') in order history.\',\'/OrdersMySQL/OrdersHistory/' + _id);
    swal({
        title: "Order Refund", text: "Do you want to go with the Retention process?", type: "warning", showCancelButton: true, confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, I am sure!', cancelButtonText: "No, go to refund!"
    }).then(function (isConfirm) {
        console.log(isConfirm);
        if (isConfirm.value) {
            window.parent.setTab(157, 'Customer Service (Help Desk)', '/customer-service/search-customer', _id);
        } else {
            window.location.href = window.location.origin + '/OrdersMySQL/OrderRefund/' + _id;
            //swal("Cancelled", "Your imaginary file is safe :)", "error");
        }
    });
    return false;
}

///Get Order Counts
function GetOrderDetails() {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtOrderDate').val() == '') { sd = ''; ed = '' };
    let opt = { strValue1: sd, strValue2: ed };
    $.ajax({
        type: "POST", url: '/order/order-counts', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
        success: function (result) {
            var data = JSON.parse(result);
            if (data.length > 0) {
                $('#all').find(".count").text(number_format(data[0].allorder));
                $('#mine').find(".count").text(number_format(data[0].mine));
                $('#draft').find(".count").text(number_format(data[0].drafts));
                $('#wc-pending').find(".count").text(number_format(data[0].pending));
                $('#wc-processing').find(".count").text(number_format(data[0].processing));
                $('#wc-on-hold').find(".count").text(number_format(data[0].onhold));
                $('#wc-completed').find(".count").text(number_format(data[0].completed));
                $('#wc-cancelled').find(".count").text(number_format(data[0].cancelled));
                $('#wc-refunded').find(".count").text(number_format(data[0].refunded));
                $('#wc-failed').find(".count").text(number_format(data[0].failed));
                $('#wc-cancelnopay').find(".count").text(number_format(data[0].cancelnopay));
                $('#wc-pendingpodiuminv').find(".count").text(number_format(data[0].pendingpodiuminv));
                $('#wc-podium').find(".count").text(number_format(data[0].podium));
                $('#wc-podiumrefund').find(".count").text(number_format(data[0].podiumrefund));
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });
}
function isNullUndefAndSpace(variable) { return (variable !== null && variable !== undefined && variable !== 'undefined' && variable !== 'null' && variable.length !== 0); }
function dataGridLoad(order_type) {
    //var urlParams = new URLSearchParams(window.location.search);
    //let searchText = urlParams.get('name') ? urlParams.get('name') : ''; 
    let searchText = localStorage.getItem('_search');
    var monthYear = '', cus_id = (parseInt($('#ddlUser').val()) || 0);
    if ($('#filter-by-date').val() != "0") monthYear = $('#filter-by-date').val();
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtOrderDate').val() == '') { sd = ''; ed = '' };
    let dfa = "'" + sd + "' and '" + ed + "'";
    let _id = parseInt($('#hfOrderType').data('userid')) || 0, _editable = parseInt($('#hfOrderType').data('iseditable')) || 0;
    table_oh = $('#dtdata').DataTable({
        oSearch: { "sSearch": searchText }, columnDefs: [{ "orderable": false, "targets": 0 }], order: [[2, "desc"]], lengthMenu: [[10, 20, 50], [10, 20, 50]],
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
        sAjaxSource: "/order/queckorder-list",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed });
            aoData.push({ name: "strValue3", value: (cus_id > 0 ? cus_id : '') }, { name: "strValue4", value: order_type });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                success: function (data) {
                    console.log(data);
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    localStorage.setItem('_search', '');
                    localStorage.setItem('_id', '');
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [
            {
                'data': 'id', sWidth: "5%   ", 'render': function (id, type, full, meta) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck(this);" value="' + $('<div/>').text(id).html() + '"><label></label>';
                }
            },
            {
                data: 'post_date', title: 'Date', sWidth: "12%", render: function (data, type, row) { return row.date_created; }
            },
            {
                data: 'id', title: 'OrderID', sWidth: "10%",
                render: function (id, type, full, meta) {
                    if (full.post_mime_type == 'shop_order_erp' || full.post_mime_type == 'shopordererp') return '#' + id + ' <i class="glyphicon glyphicon-user" title="Order created from ERP Admin." aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>';
                    else if (full.post_mime_type == 'shop_order_replace_erp' || full.post_mime_type == 'shoporderreplaceerp') return 'REP#' + id + ' <i class="glyphicon glyphicon-user" title="Order created from ERP Admin." aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>';
                    else return '#' + id;
                }

            },
            {
                data: 'imagefile', // Assuming 'imagefile' contains the JSON data
                title: 'Images',
                render: function (data, type, row) {
                    // Parse the JSON data
                    //var images = JSON.parse(data);
                    console.log(data);
                    // Initialize an empty HTML string
                    /*var html = '#' + row.id;*/
                    var html = '';
                    var matches = data.match(/"_file_name":"(.*?)"/g);

                    if (matches) {
                        for (var i = 0; i < matches.length; i++) {
                            // Extract the image URL from the matched string
                            var match = matches[i];
                            var imageUrl = match.replace(/"_file_name":"|"/g, '');

                            // Define the desired height and width (adjust these values as needed)
                            var imageHeight = '60'; // Set your desired height
                            var imageWidth = '70'; // Set your desired width

                            // Add image tags with specified height and width
                            // html += '<img src="' + imageUrl + '" alt="Image" height="' + imageHeight + '" width="' + imageWidth + '"><br>';
                            html += '<img class="image-style" src="' + imageUrl + '" alt="Image" height="' + imageHeight + '" width="' + imageWidth + '">';

                        }
                    }

                    return html;
                }
            },
            //{
            //    data: 'first_name', title: 'Name', sWidth: "14%", render: function (id, type, row) {
            //        if (row.post_mime_type == 'shop_order_replace_erp' || row.post_mime_type == 'shoporderreplaceerp') return row.first_name + ' ' + row.last_name + ' (#' + row.post_parent + ')';
            //        else return row.first_name + ' ' + row.last_name;
            //    }
            //},
            {
                data: 'first_name', title: 'Order Placed From', sWidth: "14%", render: function (id, type, row) {
                    //if (row.post_mime_type == 'shop_order_replace_erp' || row.post_mime_type == 'shoporderreplaceerp') return row.first_name + ' ' + row.last_name + ' (#' + row.post_parent + ')';
                   // else return row.first_name + ' ' + row.last_name;
                    return 'Order created via : ' + row.created_via +' </br> Order Placed by:'+ row.first_name + ' ' + row.last_name;
                }
            },
           
            /* { data: 'num_items_sold', title: 'No. of Items', sWidth: "10%" },*/
            { data: 'itmename', title: 'Purchase Details', sWidth: "15%" },
            {
                data: 'billing_address_1', title: 'Billing', sWidth: "14%", render: function (id, type, row) {
                    return row.billing_address_1 + ' ' + row.billing_postcode + ' ' + row.billing_city + ' ' + row.billing_country + ' ' + row.billing_state;
                }
            },
            {
                data: 'shipping_address_1', title: 'Shipping', sWidth: "14%", render: function (id, type, row) {
                    return row.shipping_address_1 + ' ' + row.shipping_postcode + ' ' + row.shipping_city + ' ' + row.shipping_country + ' ' + row.shipping_state;
                }
            },

            {
                data: 'total_sales', title: 'Total', sWidth: "10%", render: function (id, type, row, meta) {
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
                    else if (data == 'wc-erp-desk-amazon') return 'ERP Desktop Amazon Testing';
                    else if (data == 'wc-cancelnopay') return 'Cancelled - No Payment';
                    else if (data == 'wc-pendingpodiuminv') return 'Pending Podium Invoice';
                    else if (data == 'wc-podium') return 'Order via Podium';
                    else if (data == 'wc-podiumrefund') return 'Podium Refunded';
                    else if (data == 'wc-pendingfraud') return 'Pending Fraud';
                    else if (data == 'wc-wc-fraud') return 'Fraud';
                    else if (data == 'wc-retention-refund') return 'Retention Refund';
                    else if (data == 'wc-retained') return 'Retained';
                    else if (data == 'wc-retention') return 'Retention';
                    else if (data == 'draft') return 'draft';
                    else return '-';
                }
            },
            
            //{
            //    data: 'payment_method_title', title: 'Payment Method', sWidth: "11%", render: function (id, type, row) {
            //        let pm_title = isNullUndefAndSpace(row.payment_method_title) ? row.payment_method_title : "";
            //        //if (row.status != 'wc-cancelled' && row.status != 'wc-failed' && row.status != 'wc-cancelnopay') {
            //        if (row.status == 'wc-pending' || row.status == 'wc-pendingpodiuminv') {
            //            if (row.payment_method == 'ppec_paypal' && row.paypal_status != 'COMPLETED') return ' <a href="javascript:void(0);" data-toggle="tooltip" title="Check PayPal Payment Status." onclick="PaymentStatus(' + row.id + ',\'' + row.paypal_id + '\',\'' + row.billing_email + '\');">' + pm_title + '</a>';
            //            else if (row.payment_method == 'podium' && row.podium_status != 'PAID') return ' <a href="javascript:void(0);" data-toggle="tooltip" title="Check PayPal Payment Status." onclick="podiumPaymentStatus(' + row.id + ',\'' + row.podium_uid + '\',\'' + row.billing_email + '\');">' + pm_title + '</a>';
            //            //else if (row.payment_method == 'podium' ) return ' <a href="javascript:void(0);" data-toggle="tooltip" title="Check PayPal Payment Status." onclick="podiumPaymentStatus(' + row.id + ',\'' + row.podium_uid + '\',\'' + row.billing_email + '\');">' + pm_title + '</a>';
            //            //if (row.payment_method == 'ppec_paypal') return ' <a href="javascript:void(0);" data-toggle="tooltip" title="Check PayPal Payment Status." onclick="PaymentStatus(' + row.id + ',\'' + row.paypal_id + '\');">' + row.payment_method_title + '</a>';
            //            else return pm_title;
            //        }
            //        else return pm_title;
            //    }
            //},
            { data: 'Suborder', title: 'Suborder', sWidth: "10%" },
            { data: 'Exported', title: 'Exported', sWidth: "10%" },
            {
                'data': 'id', title: 'Action', sWidth: "8%", 'render': function (id, type, row, meta) {
                    let refund_amt = parseFloat(row.refund_total) || 0.00, refund_gc_amt = parseFloat(row.refund_giftcard_total) || 0.00;;
                    refund_amt = refund_amt + refund_gc_amt;
                    if ($("#hfEdit").val() == "1") {
                        if (_editable == 1) {
                            if ((row.status == 'wc-pending' || row.status == 'wc-pendingpodiuminv') && refund_amt == 0) return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/OrdersMySQL/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="javascript:void(0);" onclick="cancelorder(' + id + ');" data-toggle="tooltip" title="Cancel Order"><i class="fa fa-times-circle text-danger"></i></a>';
                            else if ((row.status == 'wc-pending' || row.status == 'wc-pendingpodiuminv') && refund_amt != 0) return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/OrdersMySQL/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a>';
                            else if ((row.status == 'wc-processing' || row.status == 'wc-on-hold') && refund_amt == 0) return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/OrdersMySQL/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="javascript:void(0);" data-toggle="tooltip" title="Refund Order" onclick="OrderRefund(' + id + ');"><i class="fa fa-undo"></i></a> <a href="javascript:void(0);" onclick="cancelorder(' + id + ');" data-toggle="tooltip" title="Cancel Order"><i class="fa fa-times-circle text-danger"></i></a>';
                            else if ((row.status == 'wc-processing' || row.status == 'wc-on-hold') && refund_amt != 0) return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/OrdersMySQL/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="javascript:void(0);" data-toggle="tooltip" title="Refund Order" onclick="OrderRefund(' + id + ');"><i class="fa fa-undo"></i></a>';
                            else if (row.status == 'wc-completed') return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/Orders/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="javascript:void(0);" data-toggle="tooltip" title="Refund Order" onclick="OrderRefund(' + id + ');"><i class="fa fa-undo"></i></a>';
                            else return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/Orders/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a>';
                        }
                        else if (_editable == 0 && _id == row.customer_id) {
                            if ((row.status == 'wc-pending' || row.status == 'wc-pendingpodiuminv') && refund_amt == 0) return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/Orders/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="javascript:void(0);" onclick="cancelorder(' + id + ');" data-toggle="tooltip" title="Cancel Order"><i class="fa fa-times-circle text-danger"></i></a>';
                            else if ((row.status == 'wc-pending' || row.status == 'wc-pendingpodiuminv') && refund_amt != 0) return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/Orders/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a>';
                            else if ((row.status == 'wc-processing' || row.status == 'wc-on-hold') && refund_amt == 0) return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/Orders/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="javascript:void(0);" data-toggle="tooltip" title="Refund Order" onclick="OrderRefund(' + id + ');"><i class="fa fa-undo"></i></a> <a href="javascript:void(0);" onclick="cancelorder(' + id + ');" data-toggle="tooltip" title="Cancel Order"><i class="fa fa-times-circle text-danger"></i></a>';
                            else if ((row.status == 'wc-processing' || row.status == 'wc-on-hold') && refund_amt != 0) return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/Orders/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="javascript:void(0);" data-toggle="tooltip" title="Refund Order" onclick="OrderRefund(' + id + ');"><i class="fa fa-undo"></i></a>';
                            else if (row.status == 'wc-completed') return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order" onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/Orders/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="javascript:void(0);" data-toggle="tooltip" title="Refund Order" onclick="OrderRefund(' + id + ');"><i class="fa fa-undo"></i></a>';
                            else return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order"  onclick="ActivityLog(\'View/Edit order id (' + id + ') in order history.\',\'/Orders/OrdersHistory/' + id + '\'); return true;"><i class="glyphicon glyphicon-eye-open"></i></a>';
                        }
                        else {
                            return '<a href="minesofmoria/' + id + '" onclick="ActivityLog(\'Edit order id (' + id + ') in order history.\',\'/Orders/OrdersHistory/' + id + '\'); return true;" data-toggle="tooltip" title="View/Edit Order"><i class="glyphicon glyphicon-eye-open"></i></a>';
                        }
                    }
                    else { return "No Permission"; }
                    //if (row.shipped_items == 0)
                    //    return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="OrderRefund/' + id + '" data-toggle="tooltip" title="Refund Order"><i class="fa fa-undo"></i></a> <a href="javascript:void(0);" onclick="cancelorder(' + id + ');" data-toggle="tooltip" title="Cancel Order"><i class="fa fa-times-circle text-danger"></i></a>'
                    //else
                    //    return '<a href="minesofmoria/' + id + '" data-toggle="tooltip" title="View/Edit Order"><i class="glyphicon glyphicon-eye-open"></i></a> <a href="OrderRefund/' + id + '" data-toggle="tooltip" title="Refund Order"><i class="fa fa-undo"></i></a>'
                }
            }
        ]
    });
}

function CheckAll() {
    var isChecked = $('#checkall').prop("checked");
    $('#dtdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked); 
}
function Singlecheck(chk) {
    var isChecked = $(chk).prop("checked"), isHeaderChecked = $("#checkall").prop("checked");
    if (isChecked == false && isHeaderChecked) $("#checkall").prop('checked', isChecked);
    else {
        $('#dtdata tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false) isChecked = false;
        });
        $("#checkall").prop('checked', isChecked);
    }
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
                    $.get('/Setting/cancel-podium-invoice', { strValue1: data.podium_uid }).then(response => {
                        console.log(response); swal('Success!', 'Order cancelled successfully.', "success");
                        $.when(GetOrderDetails()).done(function () { table_oh.ajax.reload(null, false); });
                    }).catch(err => { swal.hideLoading(); swal('Error!', err, 'error'); });
                    //$.get('/Setting/GetPodiumToken', { strValue1: 'getToken' }).then(response => {
                    //    let access_token = response.message, _url = podium_baseurl + '/v4/invoices/' + data.podium_uid + '/cancel';
                    //    let opt_cnl = { locationUid: _locationUid, note: 'Invoice has been canceled.' };
                    //    $.ajax({
                    //        type: 'post', url: _url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt_cnl),
                    //        beforeSend: function (xhr) { xhr.setRequestHeader("Accept", "application/json"); xhr.setRequestHeader("Authorization", "Bearer " + access_token); }
                    //    }).then(response => {
                    //        swal('Success!', 'Order cancelled successfully.', "success");
                    //        $.when(GetOrderDetails()).done(function () { table_oh.ajax.reload(null, false); });
                    //    }).fail(function (XMLHttpRequest, textStatus, errorThrown) { swal.hideLoading(); console.log(XMLHttpRequest); swal('Error!', errorThrown, "error"); });
                    //}).catch(err => { swal.hideLoading(); swal('Error!', err, 'error'); });//.always(function () { swal.hideLoading(); });
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