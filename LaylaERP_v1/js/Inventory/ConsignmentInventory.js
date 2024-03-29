﻿$(document).ready(function () {
    $('#txtDate').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        startDate: moment(),
        autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' },
        opens: 'left',
        orientation: "left auto",
    }, function (start, end, label) { ProductStockGrid(); });
    $.when(getProducts(), getVendor()).done(function () { ProductStockGrid() });
    $(".select2").select2();
    $(document).on("click", "#btnSearch", function (t) { t.preventDefault(); ProductStockGrid(); });
    $("#ddlProduct,#ddlCategory").change(function () {
        //ProductStockGrid();
    });
    $("#txtsku").change(function () {
        //if ($("#txtsku").val().length < 3) return false;
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
    $(document).on("click", "#btnExportList", function (t) { t.preventDefault(); ExportList(); });
})
function isNullAndUndef(variable) { return (variable !== null && variable !== undefined); }
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

function ProductStockGrid() {
    let sd = $('#txtDate').data('daterangepicker').startDate.format('YYYY-MM-DD'), ed = $('#txtDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let pid = parseInt($("#ddlProduct").val()) || 0, ctid = parseInt($("#ddlCategory").val()) || 0, vnid = parseInt($("#ddlVendor").val()) || 0;
    let obj = { strValue1: $("#txtsku").val().trim(), strValue2: (ctid > 0 ? ctid : ''), strValue3: (pid > 0 ? pid : ''), strValue4: (vnid > 0 ? vnid : ''), strValue5: sd, strValue6: ed };// console.log(obj);
     
    $('#dtdata').DataTable({

        destroy: true, bProcessing: true, bServerSide: true,
        //sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true,
        order: [[0, "desc"]],
        bAutoWidth: false, scrollX: false, scrollY: ($(window).height() - 215),
        responsive: true,
        dom: 'lBftip', buttons: [{ extend: 'excelHtml5', title: 'Product In-Hand Inventory Report', action: function (e, dt, button, config) { ExportList(); } }
        //    ,{
        //    extend: 'csvHtml5', title: 'Product In-Hand Inventory Report', titleAttr: 'CSV',
        //    exportOptions: { columns: ':visible' },
        //    action: function (e, dt, button, config) { exportTableToCSV('Product In-Hand Inventory Report.csv'); }
        //}
        ],
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        sAjaxSource: "/Inventory/GetOnhandInventoryList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            //aoData.push({ name: "strValue1", value: monthYear });
            aoData.push({ name: "strValue1", value: $("#txtsku").val().trim() });
            aoData.push({ name: "strValue2", value: (ctid > 0 ? ctid : '') });
            aoData.push({ name: "strValue3", value: (pid > 0 ? pid : '') });
            aoData.push({ name: "strValue4", value: (vnid > 0 ? vnid : '') });
            aoData.push({ name: "strValue5", value: sd });
            aoData.push({ name: "strValue6", value: ed });
            var col = 'id';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "id" : oSettings.aaSorting[0][0] == 1 ? "category" : oSettings.aaSorting[0][0] == 2 ? "post_title" : "id";
                aoData.push({ name: "sSortColName", value: col });
            }
            //console.log(aoData);
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            { data: 'p_id', title: 'Parent ID', sWidth: "8%" },
            {
                data: 'id', title: 'ID', sWidth: "10%", render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control" data-toggle="tooltip" title="Click here to show warehouse On-Hand Inventory."><i class="glyphicon glyphicon-plus-sign"></i></a> -  #' + row.id; else return ' <b>#' + row.id + '</b>';
                    if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control" data-toggle="tooltip" title="Click here to show warehouse On-Hand Inventory."><i class="glyphicon glyphicon-plus-sign"></i></a> -  #' + row.id; else return ' <b>#' + row.id + '</b>';

                }
            },
            { data: 'category', title: 'Category', sWidth: "15%"},
            { data: 'sku', title: 'SKU', sWidth: "8%" },
            { data: 'post_title', title: 'Product Name', sWidth: "18%" },
            {
                data: 'stock', title: 'Units in Stock', sWidth: "8%", className: "text-center", render: function (data, type, row) {
                    ///if (row.post_parent > 0) return (row.op_stock + row.stock).toFixed(0); else return '';
                    //if (row.total_variation > 0) return ''; else return (row.op_stock + row.stock).toFixed(0);
                    return (row.op_stock + row.stock).toFixed(0);

                }
            },
            {
                data: 'UnitsinPO', title: 'Units in POs', sWidth: "8%", className: "text-center", render: function (data, type, row) {
                    //if (row.total_variation > 0) return ''; else return row.UnitsinPO.toFixed(0);
                    return row.UnitsinPO.toFixed(0);

                }
            },
            {
                data: 'SaleUnits', title: 'Sale Units', sWidth: "8%", className: "text-center", render: function (data, type, row) {
                    //if (row.total_variation > 0) return ''; else return row.SaleUnits.toFixed(0);
                    return row.SaleUnits.toFixed(0);
                }
            },
            {
                data: 'Damage', title: 'Damage Units', sWidth: "8%", className: "text-center", render: function (data, type, row) {
                    //if (row.total_variation > 0) return ''; else return row.Damage.toFixed(0);
                    return row.Damage.toFixed(0);
                }
            },
            {
                data: 'available', title: 'Available Units', sWidth: "8%", className: "text-center", render: function (data, type, row) {
                    //if (row.post_parent > 0) return (row.op_stock + row.stock + row.UnitsinPO - row.SaleUnits - row.Damage).toFixed(0); else return '';
                    //if (row.total_variation > 0) return ''; else return (row.op_stock + row.stock - row.SaleUnits - row.Damage).toFixed(0);
                    return (row.op_stock + row.stock + row.UnitsinPO - row.SaleUnits - row.Damage).toFixed(0);
                }
            },
        ],
        columnDefs: [{ targets: [0], visible: false, searchable: false }]
    });
}
/* Formatting function for row details - modify as you need */
function format(d) {
    let dfa = $('#txtDate').val().split('-');
    let sd = dfa[0].split('/'); sd = sd[2].trim() + '/' + sd[0].trim() + '/' + sd[1].trim();
    let ed = dfa[1].split('/'); ed = ed[2].trim() + '/' + ed[0].trim() + '/' + ed[1].trim();
    let vnid = parseInt($("#ddlVendor").val()) || 0;
    let option = { strValue1: d.id, strValue2: (vnid > 0 ? vnid : ''), strValue3: sd, strValue4: ed }, wrHTML = '<table class="inventory-table table-blue table check-table table-bordered table-striped dataTable no-footer children_table"><thead><tr><th style="width: 43% !important;text-align:left;">Warehouse</th><th style="width:8% !important; text-align:right;">Units in Stock</th><th style="width:8%; text-align:right;">Units in POs</th><th style="width:10%; text-align:right;">Sale Units</th><th style="width:10%; text-align:right;">Damage Units</th><th style="width:10%; text-align:right;">Available Units</th></tr></thead>';
    console.log(d, option);
    $.ajax({
        url: '/Inventory/GetStockByWarehouse', type: 'post', dataType: 'json', contentType: "application/json; charset=utf-8", data: JSON.stringify(option),
        success: function (result) {
            result = JSON.parse(result);
            if (result.length == 0) { wrHTML += '<tbody><tr><td valign="top" colspan="6" class="no-data-available">Sorry no matching records found.</td></tr></tbody>'; }
            $(result).each(function (index, row) {
                let post_title = d.post_title + ' [' + row.ref + ']';
                wrHTML += '<tr><td>' + row.ref + '</td><td>' + (row.op_stock + row.stock).toFixed(0) + '</td>';
                if (row.UnitsinPO > 0)
                    wrHTML += '<td><a style="text-decoration: underline;font-weight: 700;" href="#" onclick="getPurchaseOrder(' + d.id + ',' + row.warehouse_id + ',\'' + post_title + '\'); "><i class="fas fa - search - plus"></i>' + row.UnitsinPO.toFixed(0) + '</a></td>';
                else
                    wrHTML += '<td>' + row.UnitsinPO.toFixed(0) + '</td>';
                wrHTML += '<td>' + row.SaleUnits.toFixed(0) + '</td><td>' + row.Damage.toFixed(0) + '</td>';
                //wrHTML += '<td>' + (row.op_stock + row.stock + row.UnitsinPO - row.SaleUnits - row.Damage).toFixed(0) + '</td>';
                wrHTML += '<td>' + (row.op_stock + row.stock - (row.SaleUnits - row.Damage)).toFixed(0) + '</td>';
                wrHTML += '</tr > ';
            });
        },
        error: function (xhr, status, err) { alert(err); },
        complete: function () { }, async: false
    });
    wrHTML += '</table>';
    return wrHTML;
}

function getPurchaseOrder(pid, wid, title) {
    let dfa = $('#txtDate').val().split('-');
    let sd = dfa[0].split('/'); sd = sd[2].trim() + '/' + sd[0].trim() + '/' + sd[1].trim();
    let ed = dfa[1].split('/'); ed = ed[2].trim() + '/' + ed[0].trim() + '/' + ed[1].trim();
    let obj = { strValue1: pid, strValue2: wid, strValue3: sd, strValue4: ed };
    searchOrderModal(title);
    $('#tblOrderList').dataTable({
        destroy: true, bServerSide: false, order: [[0, "desc"]],
        footerCallback: function (row, data, start, end, display) {
            var api = this.api(), data;
            var intVal = function (i) { return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0; };

            let qty = api.column(4).data().reduce(function (a, b) { return intVal(a) + intVal(b); }, 0);
            var r_qty = api.column(5).data().reduce(function (a, b) { return intVal(a) + intVal(b); }, 0);
            var bal = qty - r_qty;
            $(api.column(4).footer()).html(parseFloat(qty).toFixed(0));
            $(api.column(5).footer()).html(parseFloat(r_qty).toFixed(0));
            $(api.column(6).footer()).html(parseFloat(bal).toFixed(0));
        },
        columns: [
            { data: 'ref', title: 'PO No', sWidth: "15%" },
            { data: 'po_date', title: 'Created Date', sWidth: "15%" },
            { data: 'vendor_name', title: 'Vendor Name', sWidth: "25%" },
            { data: 'date_livraison', title: 'Planned date of delivery', sWidth: "25%" },
            { data: 'quantity', title: 'Quantity', sWidth: "10%", class: 'text-right' },
            { data: 'recqty', title: 'Received Quantity', sWidth: "10%", class: 'text-right' },
            { data: 'balance', title: 'Balance', sWidth: "10%", class: 'text-right', render: function (data, type, row) { return (row.quantity - row.recqty).toFixed(0); } }
        ],
        sAjaxSource: "/Inventory/GetPOByWarehouse",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: obj,
                "success": function (data) {
                    data = JSON.parse(data);
                    let dtOption = { sEcho: aoData.sEcho, recordsTotal: aoData.recordsTotal, recordsFiltered: aoData.recordsFiltered, aaData: data };
                    return fnCallback(dtOption);
                }
            });
        },
    });

}
function searchOrderModal(title) {
    let modalHtml = '<div class="modal-dialog modal-lg modal-1040">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    modalHtml += '<h4 class="modal-title" id="myModalLabel">Purchase Order List - ' + title + '</h4>';
    modalHtml += '</div>';
    modalHtml += '<div class="modal-body"></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#billModal").empty().html(modalHtml);

    modalHtml = '<div class="row mt-1">';
    modalHtml += '<div class="col-md-12">';
    modalHtml += '<div class="table-responsive">';
    modalHtml += '<table id="tblOrderList" class="table table-blue check-table table-bordered table-striped dataTable tablelist">';
    modalHtml += '<thead><tr><th style="width: 15%">PO No</th><th style="width: 15%">Date</th><th style="width: 25%">Vendor Name</th><th style="width: 25%">Planned date of delivery</th><th class="text-right" style="width: 10%">Quantity</th><th class="text-right" style="width: 10%">Received Quantity</th><th class="text-right" style="width: 10%">Balance</th></tr></thead>';
    modalHtml += '<tfoot><tr><th style="width: 15%"></th><th style="width: 15%"></th><th style="width: 25%"></th><th style="width: 25%">Total</th><th class="text-right" style="width: 10%">0</th><th class="text-right" style="width: 10%">0</th><th class="text-right" style="width: 10%">0</th></tr></tfoot>';
    modalHtml += '<tbody></tbody>';
    modalHtml += '</table>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    modalHtml += '</div>';

    $('#billModal .modal-body').append(modalHtml);
    $("#billModal").modal({ backdrop: 'static', keyboard: false });
}

function exportTableToCSV(filename) {
    let tmpColDelim = String.fromCharCode(11); // vertical tab character
    let tmpRowDelim = String.fromCharCode(0); // null character
    // Solo Dios Sabe por que puse esta linea
    let colDelim = (filename.indexOf("xls") != -1) ? '\t' : ',';
    let rowDelim = '\r\n';

    let csv = 'id' + colDelim + 'Category' + colDelim + 'SKU' + colDelim + 'Product Name' + colDelim + 'Units in Stock' + colDelim + 'Units in POs' + colDelim + 'Sale Units' + colDelim + 'Damage Units' + colDelim + 'Available Units' + rowDelim;

    let dfa = $('#txtDate').val().split('-');
    let sd = dfa[0].split('/'); sd = sd[2].trim() + '/' + sd[0].trim() + '/' + sd[1].trim();
    let ed = dfa[1].split('/'); ed = ed[2].trim() + '/' + ed[0].trim() + '/' + ed[1].trim();
    let pid = parseInt($("#ddlProduct").val()) || 0, ctid = parseInt($("#ddlCategory").val()) || 0, vnid = parseInt($("#ddlVendor").val()) || 0;;
    let obj = { strValue1: $("#txtsku").val().trim(), strValue2: (ctid > 0 ? ctid : ''), strValue3: (pid > 0 ? pid : ''), strValue4: (vnid > 0 ? vnid : ''), strValue5: sd, strValue6: ed };
    $.ajax({
        url: "/Inventory/ExportProductStock", data: obj,
        type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (result) {
            result = JSON.parse(result);
            $(result['item']).each(function (index, data) {
                //Parent Row
                if (data.post_parent > 0)
                    csv += '-  #' + data.id + colDelim + (isNullAndUndef(data.category) ? data.category : '') + colDelim + (isNullAndUndef(data.sku) ? data.sku : '') + colDelim + data.post_title.replace(/\,/g, '') + colDelim + (data.op_stock + data.stock).toFixed(0) + colDelim + data.UnitsinPO.toFixed(0) + colDelim + data.SaleUnits.toFixed(0) + colDelim + data.Damage.toFixed(0) + colDelim + (data.op_stock + data.stock - data.SaleUnits - data.Damage).toFixed(0) + rowDelim;
                else
                    csv += '#' + data.id + colDelim + (isNullAndUndef(data.category) ? data.category : '') + colDelim + (isNullAndUndef(data.sku) ? data.sku : '') + colDelim + data.post_title.replace(/\,/g, '') + colDelim + (data.op_stock + data.stock) + colDelim + data.UnitsinPO.toFixed(0) + colDelim + data.SaleUnits.toFixed(0) + colDelim + data.Damage.toFixed(0) + colDelim + (data.op_stock + data.stock - data.SaleUnits - data.Damage).toFixed(0) + rowDelim;
                //Child Row                
                let res = result['details'].filter(element => element.product_id == data.id);
                if (res.length > 0) csv += '' + colDelim + '' + colDelim + '' + colDelim + 'Warehouse' + colDelim + 'Units in Stock' + colDelim + 'Units in POs' + colDelim + 'Sale Units' + colDelim + 'Damage Units' + colDelim + 'Available Units' + rowDelim;
                $(res).each(function (index, wrhRow) {
                    csv += '' + colDelim + '' + colDelim + '' + colDelim + wrhRow.ref + colDelim + (wrhRow.op_stock + wrhRow.stock).toFixed(0) + colDelim + wrhRow.UnitsinPO.toFixed(0) + colDelim + wrhRow.SaleUnits.toFixed(0) + colDelim + wrhRow.Damage.toFixed(0) + colDelim + (wrhRow.op_stock + wrhRow.stock - wrhRow.SaleUnits - wrhRow.Damage).toFixed(0) + colDelim + rowDelim;
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


function ExportList() {
    //let _columns = [];
    //let _order_status = $("#ddlStatus").val().map(d => `'${d}'`).join(','), _order_payment = $("#ddlAccount").val();
    //let _display_field = [], _where_field = [];
    //$("#ddlDisplayField :selected").each(function (e, r) {
    //    _display_field.push({ strType: $(r).data('tb_type'), strKey: $(r).text(), strValue: $(r).val() });
    //    //_columns.push({ data: $(r).text(), title: $(r).text(), sWidth: "10%", render: function (id, type, full, meta) { return (moment(id)._isValid) ? moment(id).format('MM/DD/YYYY') : id; } });
    //    _columns.push({ data: $(r).text(), title: $(r).text(), sWidth: "10%" });
    //});
    //if (_order_payment != '') { _where_field.push({ strType: 'erp_accounting_bookkeeping', strKey: 'inv_complete', strOperator: 'in', strValue: _order_payment }); }
    ////if ($("#txtSearchValue").val() != '') { _where_field.push({ strType: $('#ddlSearchField :selected').data('tb_type'), strKey: $('#ddlSearchField').val(), strOperator: $('#ddlSearchBy').val(), strValue: $("#txtSearchValue").val() }); }
    //$("#dynamic-filter .row").each(function (e, r) {
    //    if ($(r).find("#txtSearchValue").val() != '') {
    //        _where_field.push({ strType: $(r).find('.SearchField :selected').data('tb_type'), strKey: $(r).find('.SearchField').val(), strOperator: $(r).find('.SearchBy').val(), strValue: $(r).find("#txtSearchValue").val() });
    //    }
    //});
    //let sd = null, ed = null;
    //if ($('#txtDate').val() != '') {
    //    sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY'), ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    //}
    //let table = $('#dtordersearch').DataTable().order();


    let sd = $('#txtDate').data('daterangepicker').startDate.format('YYYY-MM-DD'), ed = $('#txtDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let pid = parseInt($("#ddlProduct").val()) || 0, ctid = parseInt($("#ddlCategory").val()) || 0, vnid = parseInt($("#ddlVendor").val()) || 0;
    //let obj = { strValue1: $("#txtsku").val().trim(), strValue2: (ctid > 0 ? ctid : ''), strValue3: (pid > 0 ? pid : ''), strValue4: (vnid > 0 ? vnid : ''), strValue5: sd, strValue6: ed };

    var table = $('#dtdata').DataTable();
    var currentSearchValue = table.search();

    //console.log(currentSearchValue);

    let option = { strValue1: $("#txtsku").val().trim(), strValue2: (ctid > 0 ? ctid : ''), strValue3: (pid > 0 ? pid : ''), strValue4: (vnid > 0 ? vnid : ''), strValue5: sd, strValue6: ed, sSearch: currentSearchValue};
    //option.iDisplayStart = 0; option.iDisplayLength = 1000000; option.sSortDir_0 = table[0][1]; option.sSortColName = "[" + _columns[table[0][0]].data + "]";
    //console.log(option); return;
    $("#loader").show();
    setTimeout(function () { $("#loader").hide(); }, 2000);

    postForm(option, '/inventory/on-hand-inventory-export');
}

function postForm(parameters, url) { 
    // generally we post the form with a blank action attribute
    if ('undefined' === typeof url) { url = ''; } 
    var getForm = function (url, values) {
        values = removeNulls(values);
        var form = $('<form>').attr("method", 'POST').attr("action", url);
        iterateValues(values, [], form, null);
        return form;
    }; 
    var removeNulls = function (values) {
        var propNames = Object.getOwnPropertyNames(values);
        for (var i = 0; i < propNames.length; i++) {
            var propName = propNames[i];
            if (values[propName] === null || values[propName] === undefined) {
                delete values[propName];
            } else if (typeof values[propName] === 'object') {
                values[propName] = removeNulls(values[propName]);
            } else if (values[propName].length < 1) {
                delete values[propName];
            }
        }
        return values;
    };

    var iterateValues = function (values, parent, form, isArray) {
        var i, iterateParent = [];
        Object.keys(values).forEach(function (i) {
            if (typeof values[i] === "object") {
                iterateParent = parent.slice();
                iterateParent.push(i);
                iterateValues(values[i], iterateParent, form, Array.isArray(values[i]));
            } else {
                form.append(getInput(i, values[i], parent, isArray));
            }
        });
    };

    var getInput = function (name, value, parent, array) {
        var parentString;
        if (parent.length > 0) {
            parentString = parent[0];
            var i;
            for (i = 1; i < parent.length; i += 1) {
                parentString += "[" + parent[i] + "]";
            }

            if (array) {
                name = parentString + "[" + name + "]";
            } else {
                name = parentString + "[" + name + "]";
            }
        }

        return $("<input>").attr("type", "hidden").attr("name", name).attr("value", value);
    };


    //----------------------------------------
    // NOW THE SYNOPSIS
    //----------------------------------------
    var generatedForm = getForm(url, parameters);

    $('body').append(generatedForm);
    generatedForm.submit();
    generatedForm.remove();
}