$(document).ready(function () {
    $('#txtOrderDate,#txtForecastDate').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        startDate: moment(), autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto"
    }, function (start, end, label) {
       
    });
    getVendorList();
    $("#btnSearch").click(function () { ForeCastreport(true); })
    ForecastReportAll(true);
    $("#btnSearch1").click(function () { ForecastReportAll(true); })
});

function getVendorList() {
    $.ajax({
        url: "/Inventory/GetVendorList",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please Select Vendor</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlVendorList').html(opt);
        }

    });
}

$('#ddlVendorList').change(function () {
    getProductList();
})

function getProductList() {
    let vendorID = $('#ddlVendorList').val();
    console.log(vendorID);
    var obj = { strValue1: vendorID }
    $.ajax({
        url: "/Inventory/ProductListForeCast",
        method: 'post', contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var opt = '<option value="0">Please Select Product</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlProductList').html(opt);
        }

    });
}

function ForeCastreport(is_date) {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';

    var obj = { vendorid: $('#ddlVendorList').val(), stockfromdate: sd, stocktodate: ed }
    $.ajax({
        url: '/Inventory/GetForecastReport',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        data: JSON.stringify(obj),
        success: function (data) {
            $('#dtForecastReportList').dataTable({
                destroy: true,
                scrollX: false,
                data: JSON.parse(data),
                "columns": [
                    { data: 'id', title: 'ID', sWidth: "5%" },
                    { data: 'post_title', title: 'Product', sWidth: "25%" },
                    { data: 'op_stock', title: 'In Stock', sWidth: "10%" },
                    { data: 'prev_sale', title: 'Previous Month Sale', sWidth: "10%" },
                    { data: 'daily_velocity', title: 'Projected Daily Velocity', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '')},
                    { data: 'remain_days', title: 'Remaining Days', sWidth: "10%", render: $.fn.dataTable.render.number('', '', 0, '') },
                    { data: 'run_out_date', title: 'Run Out Date', sWidth: "10%" },
                    { data: 'week_velocity', title: 'Projected Weekly Velocity', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '')},
                    { data: 'month_velocity', title: 'Projected Monthly Velocity', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '') },
                ],
                "order": [[0, 'asc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });

}

//Forecast report for all products
function ForecastReportAll(is_date) {
    
    let sd = $('#txtForecastDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtForecastDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';

    var obj = { stockfromdate: sd, stocktodate: ed }
    $.ajax({
        url: '/Inventory/GetForecastAllReport',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        data: JSON.stringify(obj),
        success: function (data) {
            $('#dtForecastReportAllList').dataTable({
                destroy: true,
                scrollX: false,
                data: JSON.parse(data),
                "columns": [
                    { data: 'id', title: 'ID', sWidth: "5%" },
                    { data: 'post_title', title: 'Product', sWidth: "25%" },
                    { data: 'op_stock', title: 'In Stock', sWidth: "10%" },
                    { data: 'prev_sale', title: 'Previous Month Sale', sWidth: "10%" },
                    { data: 'daily_velocity', title: 'Projected Daily Velocity', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '') },
                    { data: 'remain_days', title: 'Remaining Days', sWidth: "10%", render: $.fn.dataTable.render.number('', '', 0, '') },
                    { data: 'run_out_date', title: 'Run Out Date', sWidth: "10%" },
                    { data: 'week_velocity', title: 'Projected Weekly Velocity', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '') },
                    { data: 'month_velocity', title: 'Projected Monthly Velocity', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '') },
                ],
                "order": [[0, 'asc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });

}