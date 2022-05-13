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
        startDate: moment(), autoUpdateInput: true, alwaysShowCalendars: true, singleDatePicker: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' },
        opens: 'left', orientation: "left auto",
    });
    $.when(getProducts()).done(function () { InventoryReport() });
    $(".select2").select2();
    $(document).on("click", "#btnSearch", function (t) { t.preventDefault(); InventoryReport(); });
    $("#ddlProduct,#ddlCategory").change(function () {
        //ProductStockGrid();
    });
    $("#txtsku").change(function () {
        //if ($("#txtsku").val().length < 3) return false;
        InventoryReport();
    });
});

function isNullAndUndef(variable) { return (variable !== null && variable !== undefined); }
function getProducts() {
    $.ajax({
        url: "/Inventory/GetProductList", type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            //Product
            $("#ddlProduct").html('<option value="0">Select Product</option>');
            $.each(dt['Table'], function (i, row) { $("#ddlProduct").append('<option value="' + row.id + '">' + row.text + '</option>'); });

            //Category
            $("#ddlCategory").html('<option value="0">Select Category</option>');
            $.each(dt['Table1'], function (i, row) { $("#ddlCategory").append('<option value="' + row.id + '">' + row.text + '</option>'); });
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }
    });
}

function InventoryReport() {
    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY'), ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    let pid = parseInt($("#ddlProduct").val()) || 0, ctid = parseInt($("#ddlCategory").val()) || 0;
    let obj = { strValue1: $("#txtsku").val().trim(), strValue2: (ctid > 0 ? ctid : ''), strValue3: (pid > 0 ? pid : ''), strValue4: sd, strValue5: ed };// console.log(obj);
    var table_EL = $('#dtdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': false, 'targets': [0] }], order: [[0, "asc"]],
        dom: 'lBftip', oSearch: { "sSearch": '' }, bProcessing: true, bAutoWidth: false, destroy: true, lengthMenu: [[50, 100, 150, 200], [50, 100, 150, 200]],
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#dtdata_filter input').unbind();
            $('#dtdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        ajax: {
            url: '/Inventory/inventoryvaluation-report', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        aoColumns: [
            { data: 'p_id', title: 'Parent ID', sWidth: "8%" },
            {
                data: 'id', title: 'Id', sWidth: "5%", render: function (data, type, row) {
                    if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control" data-toggle="tooltip" title="Click here to show product inventory valuation details." onclick="ShowDetails(' + row.id + ',\'' + row.sku + '\',\'' + row.post_title + '\');"><i class="glyphicon glyphicon-search"></i></a> -  #' + row.id; else return ' <b>#' + row.id + '</b>';
                }
            },
            { data: 'category', title: 'Category', sWidth: "8%" },
            { data: 'sku', title: 'SKU', sWidth: "10%", class: "text-left" },
            { data: 'post_title', title: 'Product', sWidth: "20%", class: "text-left" },
            {
                data: 'qty', title: 'Qty', sWidth: "8%", className: "text-right", render: function (data, type, row) {
                    if (row.post_parent > 0) return $.fn.dataTable.render.number(',', '.', 0, '').display(data); else return '';
                }
            },
            {
                data: 'asset_value', title: 'Asset Value', sWidth: "10%", class: "text-right", render: function (data, type, row) {
                    if (row.post_parent > 0) return $.fn.dataTable.render.number(',', '.', 2, '$').display(data); else return '';
                }
            },
            {
                data: 'calc_avg', title: 'Calc. Avg', sWidth: "10%", class: "text-right", render: function (data, type, row) {
                    if (row.post_parent > 0) return $.fn.dataTable.render.number(',', '.', 2, '$').display(data); else return '';
                }
            },
        ],
        "dom": 'lBftipr',
        "buttons": [
            {
                extend: 'csv', className: 'button', text: '<i class="fas fa-file-csv"></i> CSV',
                filename: function () {
                    let d = new Date();
                    let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Inventory Valuation' + e;
                },
                exportOptions: { columns: [1, 2, 3, 4, 5, 6, 7], },
            },
            {
                extend: 'print', title: '', className: 'button', text: '<i class="fas fa-file-csv"></i> Print', footer: false,
                filename: function () {
                    let d = new Date();
                    let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Inventory valuation' + e;
                },
                exportOptions: { columns: [1, 2, 3, 4, 5, 6, 7], },
                messageTop: function () { return '<h3 style = "text-align:center"> Layla Sleep Inc.</h3 ><br /><h3 style="text-align:left">Inventory Valuation</h3>'; },
            }
        ],

    });
}

function ShowDetails(id, sku, title) {
    let modalHtml = '<div class="modal-dialog modal-lg modal-1040">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<div class="modal-header">';
    modalHtml += ' <button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    modalHtml += '<h4 class="modal-title" id="myModalLabel">' + title + '</h4>';
    modalHtml += '</div>';
    modalHtml += '<div class="modal-body"></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#myModal").empty().html(modalHtml);
    modalHtml = '<div class="row"><div class="col-md-6"><div class="input-group"><span class="input-group-addon"><i class="fa fa-calendar"></i></span><input id="txtDatePopup" data-auto-update-input="false" readonly="readonly" class="form-control"></div></div></div>';

    modalHtml += '<div class="row mt-1">';
    modalHtml += '<div class="col-md-12">';
    modalHtml += '<div class="table-responsive">';
    modalHtml += '<table id="tblList" class="table table-blue table-bordered table-striped dataTable tablelist" data-id="' + id + '">';
    //modalHtml += '<thead><tr><th style="width: 10%" class="text-left" >Date</th><th style="width: 15%">Transaction Type </th><th style="width: 25%">Num</th><th style="width: 25%">Name</th><th class="text-right" style="width: 10%">Quantity</th><th class="text-right" style="width: 10%">Rate</th><th class="text-right" style="width: 10%">FIFO Cost</th><th class="text-right" style="width: 10%">Qty. on Hand</th><th class="text-right" style="width: 10%">Asset Value</th></tr></thead>';
    //modalHtml += '<tfoot><tr><th style="width: 25%" colspan="4">Total for ' + title + '</th><th class="text-right" style="width: 10%">0</th><th class="text-right" style="width: 10%"></th><th class="text-right" style="width: 10%">0</th><th class="text-right" style="width: 10%">0</th><th class="text-right" style="width: 10%">0</th></tr></tfoot>';
    modalHtml += '<tbody></tbody>';
    modalHtml += '</table>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    modalHtml += '</div>';

    $('#myModal .modal-body').append(modalHtml);
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $('#txtDatePopup').daterangepicker({
        parentEl: '#myModal', ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        startDate: moment().startOf('month'), autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "right auto",
    }, function (start, end, label) {
        let id = parseInt($('#tblList').data('id')) || 0; DetailsReport(id);
    });
    DetailsReport(id);
}

function DetailsReport(id) {
    let sd = $('#txtDatePopup').data('daterangepicker').startDate.format('MM-DD-YYYY'), ed = $('#txtDatePopup').data('daterangepicker').endDate.format('MM-DD-YYYY');
    let pid = parseInt(id) || 0;
    let obj = { strValue1: '', strValue2: '', strValue3: pid, strValue4: '', strValue5: ed };// console.log(obj);
    var table_DL = $('#tblList').DataTable({
        scrollY: '50vh', scrollCollapse: true, ordering: false, dom: 'lBftipr',
        oSearch: { "sSearch": '' }, bProcessing: true, bAutoWidth: false, destroy: true, lengthMenu: [[50, 100, 150, 200], [50, 100, 150, 200]],
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        ajax: {
            url: '/Inventory/inventoryvaluation-detail-report', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        aoColumns: [
            { data: 'date', title: 'Date', sWidth: "8%", className: "text-left", render: function (data, type, row) { return row.str_date; } },
            { data: 'transaction_type', title: 'Transaction Type', sWidth: "8%", render: function (data, type, row) { return row.status > 0 ? data : ''; } },
            { data: 'so_po_num', title: 'Num', sWidth: "8%", render: function (data, type, row) { return row.status > 0 ? data : ''; } },
            { data: 'so_po_name', title: 'Name', sWidth: "8%", render: function (data, type, row) { return row.status > 0 ? data : ''; } },
            { data: 'qty', title: 'Qty', sWidth: "8%", className: "text-right", render: function (data, type, row) { return row.status > 0 ? $.fn.dataTable.render.number(',', '.', 0, '').display(data) : ''; } },
            { data: 'rate', title: 'Rate', sWidth: "8%", className: "text-right", render: function (data, type, row) { return row.status > 0 ? $.fn.dataTable.render.number(',', '.', 2, '$').display(data) : ''; } },
            { data: 'asset_value', title: 'FIFO Cost', sWidth: "8%", className: "text-right", render: function (data, type, row) { return row.status > 0 ? $.fn.dataTable.render.number(',', '.', 2, '$').display(data) : ''; } },
            { data: 'running_qty', title: 'Qty on Hand', sWidth: "8%", className: "text-right", render: function (data, type, row) { return $.fn.dataTable.render.number(',', '.', 0, '').display(data); } },
            { data: 'running_value', title: 'Asset Value', sWidth: "8%", className: "text-right", render: function (data, type, row) { return $.fn.dataTable.render.number(',', '.', 2, '$').display(data); } },
        ],
        "buttons": [
            {
                extend: 'csv', className: 'button', text: '<i class="fas fa-file-csv"></i> CSV',
                filename: function () {
                    let d = new Date();
                    let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Inventory Valuation Detail' + e;
                },
                exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8], },
            },
            {
                extend: 'print', title: '', className: 'button', text: '<i class="fas fa-file-csv"></i> Print', footer: false,
                filename: function () {
                    let d = new Date();
                    let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'Inventory Valuation Detail' + e;
                },
                exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8], },
                messageTop: function () { return '<h3 style = "text-align:center"> Layla Sleep Inc.</h3 ><br /><h3 style="text-align:left">Inventory Valuation Details</h3>'; },
            }
        ]
    });
}