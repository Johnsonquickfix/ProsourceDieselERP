var d = new Date();
var m = d.getMonth() + 1;
var y = d.getFullYear();

getVendorList();
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

function ForeCastreport() {
    var d = new Date();
    var m = d.getMonth();
    var y = d.getFullYear();

    var obj = {vendorid: $('#ddlVendorList').val(), Month: m, Year: y }
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
                    { data: 'post_title', title: 'Product', sWidth: "10%" },
                    { data: 'stock', title: 'In Stock', sWidth: "20%" },
                    { data: 'prev_sale', title: 'Previous Month Sale', sWidth: "15%" },
                    { data: 'daily_v', title: 'Daily Velocity', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '')},
                    { data: 'remain_days', title: 'Remaining Days', sWidth: "10%", render: $.fn.dataTable.render.number('', '', 0, '')},
                ],
                "order": [[0, 'asc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });

}
