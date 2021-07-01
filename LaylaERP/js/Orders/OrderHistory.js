
$(document).ready(function () {
    $(".subsubsub li a").click(function (e) {
        $('.subsubsub li a').removeClass('current');
        $(this).addClass('current');
    });
    datePickers(
        moment().subtract(24, 'month').startOf('month'),
        moment().subtract(0, 'month').endOf('month'),
        $('#txtOrderDate'), 'YYYY-MM', true,
        {
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Last Three Months': [moment().subtract(3, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Last Year': [moment().subtract(12, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        true, true
    );
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
    GetOrderDetails();
    setTimeout(function () { dataGridLoad(''); }, 100);
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
    $('#btnOtherFilter').click(function () { var order_type = $('#hfOrderType').val(); dataGridLoad(order_type); });
});
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

///Get Order Counts
function GetOrderDetails() {
    var opt = { strValue1: '' };
    $.ajax({
        type: "POST", url: '/Orders/GetOrdersCount', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
        success: function (result) {
            var data = JSON.parse(result);
            if (data.length > 0) {
                $('#all').find(".count").text(number_format(data[0].AllOrder));
                $('#mine').find(".count").text(number_format(data[0].Mine));
                $('#draft').find(".count").text(number_format(data[0].Drafts));
                $('#wc-pending').find(".count").text(number_format(data[0].Pending));
                $('#wc-processing').find(".count").text(number_format(data[0].Processing));
                $('#wc-on-hold').find(".count").text(number_format(data[0].OnHold));
                $('#wc-completed').find(".count").text(number_format(data[0].Completed));
                $('#wc-cancelled').find(".count").text(number_format(data[0].Cancelled));
                $('#wc-refunded').find(".count").text(number_format(data[0].Refunded));
                $('#wc-failed').find(".count").text(number_format(data[0].Failed));
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });
}

function dataGridLoad(order_type) {
    var monthYear = '', cus_id = (parseInt($('#ddlUser').val()) || 0);
    if ($('#filter-by-date').val() != "0") monthYear = $('#filter-by-date').val();
    let dfa = "'" + $('#txtOrderDate').val().replace(' - ', '\' AND \'') + "'" ;
    dfa = dfa.replaceAll('-', '');
    $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        //sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true,
        bAutoWidth: false, scrollX: false, scrollY: ($(window).height() - 215),
        responsive: true,
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        sAjaxSource: "/Orders/GetOrderList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            //aoData.push({ name: "strValue1", value: monthYear });
            aoData.push({ name: "strValue1", value: dfa });
            aoData.push({ name: "strValue2", value: (cus_id > 0 ? cus_id : '') });
            aoData.push({ name: "strValue3", value: order_type });
            var col = 'order_id';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 2 ? "customer_id" : oSettings.aaSorting[0][0] == 3 ? "FirstName" : oSettings.aaSorting[0][0] == 4 ? "LastName" : oSettings.aaSorting[0][0] == 5 ? "num_items_sold" : oSettings.aaSorting[0][0] == 6 ? "total_sales" : oSettings.aaSorting[0][0] == 6 ? "status" : oSettings.aaSorting[0][0] == 6 ? "date_created" : "order_id";
                aoData.push({ name: "sSortColName", value: col });
            }
            console.log(aoData);
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
                'data': 'order_id', sWidth: "5%   ",
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck(this);" value="' + $('<div/>').text(data).html() + '"><label></label>';
                }
            },
            { data: 'order_id', title: 'OrderID', sWidth: "8%" },
            { data: 'customer_id', title: 'Customer ID', sWidth: "8%" },
            { data: 'FirstName', title: 'First Name', sWidth: "10%" },
            { data: 'LastName', title: 'Last Name', sWidth: "10%" },
            {
                data: 'billing_phone', title: 'Phone No.', sWidth: "10%", render: function (toFormat) {
                    var tPhone = '';
                    if (toFormat != null) {
                        tPhone = toFormat.toString();
                        tPhone = '(' + tPhone.substring(0, 3) + ') ' + tPhone.substring(3, 6) + ' ' + tPhone.substring(6, 10);
                    }
                    return tPhone
                }
            },
            { data: 'num_items_sold', title: 'No. of Items', sWidth: "8%", className: "text-right" },
            { data: 'total_sales', title: 'Order Total', sWidth: "10%", className: "text-right", render: $.fn.dataTable.render.number(',', '.', 2, '') },
            {
                data: 'status', title: 'Status', sWidth: "10%", render: function (data, type, row) {
                    if (data == 'wc-pending') return 'Pending payment';
                    else if (data == 'wc-processing') return 'Processing';
                    else if (data == 'wc-on-hold') return 'On hold';
                    else if (data == 'wc-completed') return 'Completed';
                    else if (data == 'wc-cancelled') return 'Cancelled';
                    else if (data == 'wc-refunded') return 'Refunded';
                    else if (data == 'wc-failed') return 'Failed';
                    else if (data == 'draft') return 'draft';
                    else return '-';
                }
            },
            { data: 'date_created', title: 'Creation Date', sWidth: "8%" },
            {
                'data': 'order_id', sWidth: "5%",
                'render': function (id, type, full, meta) {
                    return '<a href="NewOrders/' + id + '"><i class="glyphicon glyphicon-eye-open"></i></a>'
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
    var isChecked = $(chk).prop("checked");
    var isHeaderChecked = $("#checkall").prop("checked");
    if (isChecked == false && isHeaderChecked)
        $("#checkall").prop('checked', isChecked);
    else {
        $('#dtdata tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkall").prop('checked', isChecked);
    }
}

function orderStatus() {
    var id = "";
    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        id += $(this).val() + ",";
    });
    id = id.replace(/,(?=\s*$)/, '');
    $("#checkAll").prop('checked', false);
    var status = $('#ddlOrderStatus').val();

    if (id == "") { swal('alert', 'Please select a order', 'error'); }
    else if (status == "") { swal('alert', 'Please select status', 'error'); }
    else {
        var obj = { strVal: id, status: status }
        $.ajax({
            url: '/Orders/ChangeOrderStatus', dataType: 'JSON', type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('alert', data.message, 'success').then((result) => { GetOrderDetails(); var order_type = $('#hfOrderType').val(); dataGridLoad(order_type); });
                }
                else {
                    swal('alert', 'something went wrong!', 'success');
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },

        })
    }
}