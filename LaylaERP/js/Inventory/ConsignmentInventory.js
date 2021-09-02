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
        autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }
    });
    getProducts();
    ProductStockGrid();
    $(".select2").select2();
    $(document).on("click", "#btnSearch", function (t) {
        t.preventDefault(); ProductStockGrid();
    });
    $("#ddlProduct,#ddlCategory").change(function () {
        //ProductStockGrid();
    });
    $("#txtsku").change(function () {
        ProductStockGrid();
    });

    // Add event listener for opening and closing details
    $('#dtdata tbody').on('click', '.details-control', function () {
        var tr = $(this).closest('tr');
        var row = $('#dtdata').DataTable().row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            tr.find('.details-control').empty().append('<i class="glyphicon glyphicon-plus-sign"></i>');
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            tr.find('.details-control').empty().append('<i class="glyphicon glyphicon-minus-sign"></i>');
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });
})

function getProducts() {
    $.ajax({
        url: "/Inventory/GetProductList",
        type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            //Product
            $("#ddlProduct").html('<option value="0">Select Product</option>');
            for (i = 0; i < dt['Table'].length; i++) { $("#ddlProduct").append('<option value="' + dt['Table'][i].id + '">' + dt['Table'][i].text + '</option>'); }

            //Category
            $("#ddlCategory").html('<option value="0">Select Category</option>');
            for (i = 0; i < dt['Table1'].length; i++) { $("#ddlCategory").append('<option value="' + dt['Table1'][i].id + '">' + dt['Table1'][i].text + '</option>'); }
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }
    });
}

function ProductStockGrid() {
    var dfa = $('#txtDate').val().split('-');
    let sd = dfa[0].split('/'); sd = sd[1] + '/' + sd[0] + '/' + sd[2];
    let ed = dfa[1].split('/'); ed = ed[1] + '/' + ed[0] + '/' + ed[2];
    let pid = parseInt($("#ddlProduct").val()) || 0, ctid = parseInt($("#ddlCategory").val()) || 0;
    let obj = { strValue1: $("#txtsku").val().trim(), strValue2: (ctid > 0 ? ctid : ''), strValue3: (pid > 0 ? pid : ''), strValue4: sd, strValue5: ed };// console.log(obj);
    $('#dtdata').DataTable({
        oSearch: { "sSearch": '' },
        dom: 'lBftip', buttons: [{ extend: 'excelHtml5', title: 'Product In-Hand Inventory Report', action: function (e, dt, button, config) { exportTableToCSV('Product In-Hand Inventory Report.xls'); } },
        {
            extend: 'csvHtml5', title: 'Product In-Hand Inventory Report', titleAttr: 'CSV',
            exportOptions: { columns: ':visible' },
            action: function (e, dt, button, config) { exportTableToCSV('Product In-Hand Inventory Report.csv'); }
        }
        ],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        destroy: true, bAutoWidth: false, ajax: {
            url: '/Inventory/GetProductStock', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
        columns: [
            { data: 'p_id', title: 'Parent ID', sWidth: "10%" },
            {
                data: 'id', title: 'ID', sWidth: "10%", render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> -  #' + row.id; else return ' <b>#' + row.id + '</b>';
                }
            },
            {
                data: 'post_type', title: 'Product Type', sWidth: "10%", render: function (data, type, row) {
                    if (data == 'product') return 'Product';
                    else if (data == 'product_variation') return 'Variable Product';
                    else return '-';
                }
            },
            { data: 'sku', title: 'SKU', sWidth: "10%" },
            { data: 'post_title', title: 'Product Name', sWidth: "20%" },
            {
                data: 'stock', title: 'Units In Stock', sWidth: "10%", className: "text-right", render: function (data, type, row) {
                    if (row.post_parent > 0) return row.stock.toFixed(0); else return '';
                }
            },
            {
                data: 'UnitsinPO', title: 'Units in POs', sWidth: "10%", className: "text-right", render: function (data, type, row) {
                    if (row.post_parent > 0) return row.UnitsinPO.toFixed(0); else return '';
                }
            },
            {
                data: 'SaleUnits', title: 'Sale Units', sWidth: "10%", className: "text-right", render: function (data, type, row) {
                    if (row.post_parent > 0) return row.SaleUnits.toFixed(0); else return '';
                }
            },
            {
                data: 'Damage', title: 'Damage Units', sWidth: "10%", className: "text-right", render: function (data, type, row) {
                    if (row.post_parent > 0) return row.Damage.toFixed(0); else return '';
                }
            },
            {
                data: 'available', title: 'Available Units', sWidth: "10%", className: "text-right", render: function (data, type, row) {
                    if (row.post_parent > 0) return (row.stock + row.UnitsinPO).toFixed(0); else return '';
                }
            },
        ],
        columnDefs: [{ targets: [0], visible: false, searchable: false }]
    });
}
/* Formatting function for row details - modify as you need */
function format(d) {
    console.log(d);
    let option = { strValue1: d.id }, wrHTML = '<table class="inventory-table table-blue table check-table table-bordered table-striped dataTable no-footer"><tr><th>Warehouse</th><th>Stock</th></tr>';
    $.ajax({
        url: '/Inventory/GetStockByWarehouse', type: 'post', dataType: 'json', contentType: "application/json; charset=utf-8", data: JSON.stringify(option),
        success: function (result) {
            result = JSON.parse(result); console.log(result);
            for (var i = 0; i < result.length; i++) {
                wrHTML += '<tr><td>' + result[i].ref + '</td><td>' + result[i].stock + '</td></tr>';
            }
        },
        error: function (xhr, status, err) { alert(err); },
        complete: function () { }, async: false
    });
    wrHTML += '</table>';
    return wrHTML;
}

function exportTableToCSV(filename) {
    let tmpColDelim = String.fromCharCode(11); // vertical tab character
    let tmpRowDelim = String.fromCharCode(0); // null character
    // Solo Dios Sabe por que puse esta linea
    let colDelim = (filename.indexOf("xls") != -1) ? '\t' : ',';
    let rowDelim = '\r\n';

    let csv = 'id' + colDelim + 'Product Type' + colDelim + 'SKU' + colDelim + 'Product Name' + colDelim + 'Units In Stock' + colDelim + 'Units in POs' + colDelim + 'Sale Units' + colDelim + 'Damage Units' + colDelim + 'Available Units' + rowDelim;

    let dfa = $('#txtDate').val().split('-');
    let sd = dfa[0].split('/'); sd = sd[1] + '/' + sd[0] + '/' + sd[2];
    let ed = dfa[1].split('/'); ed = ed[1] + '/' + ed[0] + '/' + ed[2];
    let pid = parseInt($("#ddlProduct").val()) || 0, ctid = parseInt($("#ddlCategory").val()) || 0;
    let obj = { strValue1: $("#txtsku").val().trim(), strValue2: (ctid > 0 ? ctid : ''), strValue3: (pid > 0 ? pid : ''), strValue4: sd, strValue5: ed };
    
    $.ajax({
        url: "/Inventory/ExportProductStock",
        type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (result) {
            result = JSON.parse(result);
            $(result['item']).each(function (index, data) {
                //Parent Row
                if (data.post_parent > 0)
                    csv += '-  #' + data.id + colDelim + data.post_type + colDelim + data.sku + colDelim + data.post_title.replace(/\,/g, '') + colDelim + data.stock.toFixed(0) + colDelim + data.UnitsinPO.toFixed(0) + colDelim + data.SaleUnits.toFixed(0) + colDelim + data.Damage.toFixed(0) + colDelim + (data.stock + data.UnitsinPO).toFixed(0) + rowDelim;
                else
                    csv += '#' + data.id + colDelim + data.post_type + colDelim + data.sku + colDelim + data.post_title.replace(/\,/g, '') + colDelim + data.stock.toFixed(0) + colDelim + data.UnitsinPO.toFixed(0) + colDelim + data.SaleUnits.toFixed(0) + colDelim + data.Damage.toFixed(0) + colDelim + (data.stock + data.UnitsinPO).toFixed(0) + rowDelim;
                //Child Row                
                let res = result['details'].filter(element => element.product_id == data.id);
                if (res.length > 0) csv += '' + colDelim + '' + colDelim + '' + colDelim + 'Warehouse' + colDelim + 'Stock' + colDelim + rowDelim;
                $(res).each(function (index, wrhRow) {
                    csv += '' + colDelim + '' + colDelim + '' + colDelim + wrhRow.ref + colDelim + wrhRow.stock.toFixed(0) + colDelim + rowDelim;
                });
            });
            download_csv(csv, filename);
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }
    });
}
function download_csv(csv, filename) {
    var csvFile;
    var downloadLink;
    // CSV FILE
    csvFile = new Blob([csv], { type: "text/csv" });
    // Download link
    downloadLink = document.createElement("a");
    // File name
    downloadLink.download = filename;
    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);
    // Make sure that the link is not displayed
    downloadLink.style.display = "none";
    // Add the link to your DOM
    document.body.appendChild(downloadLink);
    // Lanzamos
    downloadLink.click();
}