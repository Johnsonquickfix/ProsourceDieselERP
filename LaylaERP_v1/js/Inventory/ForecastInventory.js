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
    $('.select2').select2();
    $.when(getVendorList()).done(function () { ForeCastreport() });
    $("#btnSearch").click(function () { ForeCastreport(); })
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

/*$('#ddlVendorList').change(function () {
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
} */

function ForeCastreport() {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    //let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';
    v = parseInt($("#ddlVendorList").val()) || 0;
    var obj = { vendorid: (v > 0 ? v : '0'), stockfromdate: sd, stocktodate: ed }
    $.ajax({
        url: '/Inventory/GetForecastReport',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        data: JSON.stringify(obj),
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            $('#dtForecastReportList').dataTable({
                destroy: true,
                scrollX: false,
                data: JSON.parse(data),
                "columns": [
                    { data: 'id', title: 'Id', sWidth: "5%" },
                    { data: 'post_title', title: 'Product', sWidth: "25%" },
                    { data: 'op_stock', title: 'In stock', sWidth: "10%" },
                    { data: 'prev_sale', title: 'Previous month sale', sWidth: "10%" },
                    { data: 'daily_velocity', title: 'Projected daily velocity', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '')},
                    { data: 'remain_days', title: 'Remaining days', sWidth: "10%", render: $.fn.dataTable.render.number('', '', 0, '') },
                    { data: 'run_out_date', title: 'Run out date', sWidth: "10%" },
                    { data: 'week_velocity', title: 'Projected weekly velocity', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '')},
                    { data: 'month_velocity', title: 'Projected monthly velocity', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '') },
                ],
                "order": [[0, 'asc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        },
        complete: function () { $("#loader").hide(); }
    });

}

//Forecast report for all products
function ForecastReportAll() {
    
    let sd = $('#txtForecastDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtForecastDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    //let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';

    var obj = { stockfromdate: sd, stocktodate: ed }
    $.ajax({
        url: '/Inventory/GetForecastAllReport',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        data: JSON.stringify(obj),
        beforeSend: function () {$("#loader").show();},
        success: function (data) {
            $('#dtForecastReportAllList').dataTable({
                destroy: true,
                scrollX: false,
                data: JSON.parse(data),
                "columns": [
                    { data: 'id', title: 'Id', sWidth: "5%" },
                    { data: 'post_title', title: 'Product', sWidth: "25%" },
                    { data: 'op_stock', title: 'In stock', sWidth: "10%" },
                    { data: 'prev_sale', title: 'Previous month sale', sWidth: "10%" },
                    { data: 'daily_velocity', title: 'Projected daily velocity', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '') },
                    { data: 'remain_days', title: 'Remaining days', sWidth: "10%", render: $.fn.dataTable.render.number('', '', 0, '') },
                    { data: 'run_out_date', title: 'Run out date', sWidth: "10%" },
                    { data: 'week_velocity', title: 'Projected weekly velocity', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '') },
                    { data: 'month_velocity', title: 'Projected monthly velocity', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '') },
                ],
                "order": [[0, 'asc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        },
        complete: function () { $("#loader").hide();}
    });

}