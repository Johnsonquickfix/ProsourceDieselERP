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
    $.when(getProducts(), getWerehouse(), getVendor()).done(function () { NewInventoryReport() }); //product dropdown
     // warehouse dropdown
     // vendor dropdown

    $("#btnSearch").click(function () {
        if ($("#ddlProduct").val() == '0') {
            swal('Alert', 'Please select product', 'error').then(function () { swal.close(); $('#ddlProduct').focus(); });
        }
        else {
            NewInventoryReport();
        }
    })
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

function getVendor() {
    $.ajax({
        url: "/PurchaseOrder/GetVendor",
        type: "Get",
        success: function (data) {
            $('#ddlVendor').append('<option value="-1">Please Select Vendor</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddlVendor').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}

function getWerehouse() {
    $.ajax({
        url: "/Inventory/GetNewWareHouseList",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please select warehouse</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlWarehouse').html(opt);
        }

    });
}

function NewInventoryReport() {
    let sd = $('#txtDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    //let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';
    let pid = parseInt($("#ddlProduct").val()) || 0;
    let wid = parseInt($("#ddlWarehouse").val()) || 0;
    let vid = parseInt($("#ddlVendor").val()) || 0;
    var obj = { strValue2: (wid > 0 ? wid : ''), strValue3: (pid > 0 ? pid : '-1'), strValue4: sd, strValue5: ed, strValue1: (vid > 0 ? vid : '') }
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
                dom: 'lBfrtip',
                footerCallback: function (row, data, start, end, display) {
                    var api = this.api(), data;
                    console.log(row, data, start, end, display);
                    //console.log(data[0].op_stock, data[data.length-1].op_stock);
                    var intVal = function (i) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '') * 1 :
                            typeof i === 'number' ?
                                i : 0;
                    };

                    let opstock = data.length > 0 ? data[0].op_stock : 0;
                    
                    var StockReceive = api.column(7).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                    var StockIssue = api.column(8).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                    var UnitInPO = api.column(9).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                    var SaleUnit = api.column(10).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                    var DamageUnit = api.column(11).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                    
                        //$(api.column(1).footer()).html('Total');
                        //$(api.column(5).footer()).html(parseFloat(opstock).toFixed(0));
                        $(api.column(6).footer()).html('Total');
                        $(api.column(7).footer()).html(parseFloat(StockReceive).toFixed(0));
                        $(api.column(8).footer()).html(parseFloat(StockIssue).toFixed(0));
                        $(api.column(9).footer()).html(parseFloat(UnitInPO).toFixed(0));
                        $(api.column(10).footer()).html(parseFloat(SaleUnit).toFixed(0));
                        $(api.column(11).footer()).html(parseFloat(DamageUnit).toFixed(0));
                        //$(api.column(11).footer()).html(parseFloat(opstock + StockReceive - StockIssue - SaleUnit - DamageUnit).toFixed(0));
                    //console.log(DebitTotal);
                },
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
                    { data: 'name', title: 'Vendor', sWidth: "10%" },
                    { data: 'warehouse_name', title: 'Warehouse', sWidth: "10%" },
                    { data: 'op_stock', title: 'In stock', sWidth: "5%", className: "text-right", },
                    { data: 'stock_r', title: 'Stock receive', sWidth: "5%", className: "text-right", },
                    { data: 'stock_i', title: 'Stock issue', sWidth: "5%", className: "text-right", },
                    { data: 'UnitsinPO', title: 'Unit in POs', sWidth: "5%", className: "text-right", },
                    { data: 'SaleUnits', title: 'Sale unit', sWidth: "5%", className: "text-right", },
                    { data: 'Damage', title: 'Damage unit', sWidth: "5%", className: "text-right", },
                    {
                        data: 'available', title: 'Available Units', sWidth: "8%", className: "text-right", render: function (data, type, row) {
                        return (row.op_stock + row.stock_r - row.stock_i + row.UnitsinPO - row.SaleUnits - row.Damage).toFixed(0);
                        }
                    },
                ],
                "order": [[0, 'asc']],
                "buttons": [
                    {
                        extend: 'csvHtml5',
                        className: 'button',
                        text: '<i class="fas fa-file-csv"></i> CSV',
                        filename: 'Inventory',
                        footer: true,
                        exportOptions: { modifier: { page: 'all' } }
                    },

                    {
                        extend: 'excelHtml5',
                        className: 'button',
                        text: '<i class="fas fa-file-csv"></i> Excel',
                        filename: 'Inventory',
                        footer: true,
                        exportOptions: { modifier: { page: 'all' } }
                    },
                ]
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });

}