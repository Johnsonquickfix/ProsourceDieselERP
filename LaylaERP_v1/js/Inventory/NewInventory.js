$(document).ready(function () {
    $('#txtDate').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        startDate: moment().subtract(1, 'month'), autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto"
    }, function (start, end, label) {

    });
    $(".select2").select2();
    $.when(getProducts()).done(function () { ForeCastreport() });
    //getProducts();
    //ForeCastreport();
    $("#btnSearch").click(function () { ForeCastreport(); })
});

function getProducts() {
    $.ajax({
        url: "/Inventory/GetNewProductList",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please select product</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlProduct').html(opt);
        }

    });
}

function ForeCastreport(is_date) {
    let sd = $('#txtDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';
    let pid = parseInt($("#ddlProduct").val());
    var obj = { strValue3: (pid > 0 ? pid : '-1'), strValue4: sd, strValue5: ed }
    $.ajax({
        url: '/Inventory/GetNewInventory',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        data: JSON.stringify(obj),
        success: function (data) {
            $('#dtdata').dataTable({
                destroy: true,
                scrollX: false,
                data: JSON.parse(data),
                columnDefs: [{ targets: [0], visible: false, searchable: false }],
                "columns": [
                    { data: 'sr', title: 'Sl', sWidth: "5%", },
                    { data: 'tran_date', title: 'Date', sWidth: "10%" },
                    {
                        data: 'tran_type', title: 'Transcation type', sWidth: "5%", render: function (data, type, row) {
                            if (data == 'SO') return 'Sale order';
                            else if (data == 'SR') return 'Sale return';
                            else if (data == 'PO') return 'Purchase order';
                            else if (data == 'PR') return 'Purchase received';
                            else if (data == 'DM') return 'Damage';
                            else return '-';
                        }},
                    { data: 'tran_id', title: 'Transcation id', sWidth: "10%" },
                    { data: 'warehouse_name', title: 'Warehouse', sWidth: "10%" },
                    { data: 'op_stock', title: 'Open stock', sWidth: "10%", className: "text-right", },
                    { data: 'stock_r', title: 'Stock receive', sWidth: "10%", className: "text-right", },
                    { data: 'stock_i', title: 'Stock issue', sWidth: "10%", className: "text-right", },
                    { data: 'UnitsinPO', title: 'Unit in POs', sWidth: "10%", className: "text-right", },
                    { data: 'SaleUnits', title: 'Sale unit', sWidth: "10%", className: "text-right", },
                    { data: 'Damage', title: 'Damage unit', sWidth: "10%", className: "text-right", },
                    {
                        data: 'available', title: 'Available Units', sWidth: "8%", className: "text-right", render: function (data, type, row) {
                        return (row.op_stock + row.stock_r - row.stock_i + row.UnitsinPO - row.SaleUnits - row.Damage).toFixed(0);
                        }
                    },
                ],
                "order": [[0, 'asc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });

}