$(document).ready(function () {
    $("#loader").hide(); $('.select2').select2();
    PurchaseOrderGrid();
    //PartiallyGrid();
    //PoClosureGrid();
    PoPartiallyColleps();
    PoClosureGridColleps();
    
    $('#btnSearch').click(function () {
        PurchaseOrderGrid();
    });


    // Add event listener for opening and closing details
    $('#dtdataPoClosure tbody').on('click', '.details-control', function () {
        var tr = $(this).closest('tr');
        var row = $('#dtdataPoClosure').DataTable().row(tr);
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

    // Add event listener for opening and closing details
    $('#dtdataPartially tbody').on('click', '.pdetails-control', function () {
        var tr = $(this).closest('tr');
        var row = $('#dtdataPartially').DataTable().row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            tr.find('.pdetails-control').empty().append('<i class="glyphicon glyphicon-plus-sign"></i>');
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            tr.find('.pdetails-control').empty().append('<i class="glyphicon glyphicon-minus-sign"></i>');
            row.child(formatPartially(row.data())).show();
            tr.addClass('shown');
        }
    });
   
});
function PurchaseOrderGrid() {
    let urid = parseInt($("#ddlSearchStatus").val());
    let table = $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('.dataTables_filter input').unbind();
            $('.dataTables_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Reception/GetPurchaseOrderList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'order_id';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 2 ? "refordervendor" : oSettings.aaSorting[0][0] == 3 ? "request_author" : oSettings.aaSorting[0][0] == 4 ? "vendor_name" : oSettings.aaSorting[0][0] == 5 ? "city" : oSettings.aaSorting[0][0] == 6 ? "zip" : oSettings.aaSorting[0][0] == 6 ? "date_livraison" : oSettings.aaSorting[0][0] == 7 ? "Status" : "ref";
                aoData.push({ name: "sSortColName", value: col });
            }
            //console.log(aoData);
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            //{
            //    'data': 'id', sWidth: "5%   ",
            //    'render': function (data, type, full, meta) {
            //        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '"><label></label>';
            //    }
            //},
            {
                'data': 'ref', sWidth: "10%", title: 'PO No',
                'render': function (id, type, full, meta) {
                    return '<a href="NewReceiveOrder/' + full.id + '">' + id + '</a> <a href="#" onclick="getPurchaseOrderPrint(' + full.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'date_creation', title: 'Order Date', sWidth: "10%" },
            {
                'data': 'refordervendor', sWidth: "10%", title: 'Invoice No', sWidth: "10%"                
            },
            {
                data: 'fk_projet', title: 'SO No.', sWidth: "10%", render: function (data, type, dtrow) {
                    if (data > 0) return '#' + data; else return '';
                }
            },
            { data: 'vendor_name', title: 'Vendor Name', sWidth: "15%" },
            {
                data: 'city', title: 'Address', sWidth: "20%", render: function (data, type, dtrow) {
                    let val = dtrow.address + ', ' + dtrow.town + ', ' + dtrow.fk_state + ' ' + dtrow.zip;
                    return val;
                }
            },
            { data: 'total_ttc', title: 'Amount', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'date_livraison', title: 'Planned date of delivery', sWidth: "10%" },
            { data: 'Status', title: 'Status', sWidth: "10%" }
        ],
        
    });
}
function PartiallyGrid() {
    let urid = parseInt($("#ddlSearchStatus").val());
    let table = $('#dtdataPartially').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('.dataTables_filter input').unbind();
            $('.dataTables_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Reception/GetPartiallyOrderList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'order_id';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 2 ? "refordervendor" : oSettings.aaSorting[0][0] == 3 ? "request_author" : oSettings.aaSorting[0][0] == 4 ? "vendor_name" : oSettings.aaSorting[0][0] == 5 ? "city" : oSettings.aaSorting[0][0] == 6 ? "zip" : oSettings.aaSorting[0][0] == 6 ? "date_livraison" : oSettings.aaSorting[0][0] == 7 ? "Status" : "ref";
                aoData.push({ name: "sSortColName", value: col });
            }
            //console.log(aoData);
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            //{
            //    'data': 'id', sWidth: "5%   ",
            //    'render': function (data, type, full, meta) {
            //        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '"><label></label>';
            //    }
            //},
            {
                'data': 'ref', sWidth: "10%", title: 'PO No',
                'render': function (id, type, full, meta) {
                    return '<a href="NewReceiveOrder/' + full.id + '">' + id + '</a> <a href="#" onclick="getPurchaseOrderPrint(' + full.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'date_creation', title: 'Receive Date', sWidth: "10%" },
            {
                data: 'refordervendor', title: 'Bill No', sWidth: "10%", 'render': function (id, type, full, meta) {
                    let str_inv = (id.substr(7) > 0 ? ' <a href="#" onclick="getInvoicePrint(' + full.RicD + '); "><i class="fas fa - search - plus"></i>' + id + '</a>' : '');
                    return str_inv;
                }
            },
            {
                data: 'fk_projet', title: 'SO No.', sWidth: "10%", render: function (data, type, dtrow) {
                    if (data > 0) return '#' + data; else return '';
                }
            },
            { data: 'vendor_name', title: 'Vendor Name', sWidth: "15%" },
            {
                data: 'city', title: 'Address', sWidth: "20%", render: function (data, type, dtrow) {
                    /*let val = dtrow.address + ', ' + dtrow.town + ' ,' + dtrow.fk_state + ' ' + dtrow.zip;*/
                    let val = dtrow.address + ', ' + dtrow.town + ', ' + dtrow.fk_state + ' ' + dtrow.zip;
                    return val;
                }
            },
            { data: 'total_ttc', title: 'Amount', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'date_livraison', title: 'Planned date of delivery', sWidth: "10%" },
            { data: 'Status', title: 'Status', sWidth: "10%" }
        ]
      
    });
}
function PoClosureGrid() {
    let urid = parseInt($("#ddlSearchStatus").val());
    let table = $('#dtdataPoClosure').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('.dataTables_filter input').unbind();
            $('.dataTables_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Reception/GetPoClosureOrderList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'order_id';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 2 ? "refordervendor" : oSettings.aaSorting[0][0] == 3 ? "request_author" : oSettings.aaSorting[0][0] == 4 ? "vendor_name" : oSettings.aaSorting[0][0] == 5 ? "city" : oSettings.aaSorting[0][0] == 6 ? "zip" : oSettings.aaSorting[0][0] == 6 ? "date_livraison" : oSettings.aaSorting[0][0] == 7 ? "Status" : "ref";
                aoData.push({ name: "sSortColName", value: col });
            }
            //console.log(aoData);
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            //{
            //    'data': 'id', sWidth: "5%   ",
            //    'render': function (data, type, full, meta) {
            //        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '"><label></label>';
            //    }
            //},
            {
                'data': 'ref', sWidth: "10%", title: 'PO No',
                'render': function (id, type, full, meta) {
                    return id + '<a href="#" onclick="getPurchaseOrderPrint(' + full.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'date_creation', title: 'Receive Date', sWidth: "10%" },
            {
                data: 'refordervendor', title: 'Bill No', sWidth: "10%", 'render': function (id, type, full, meta) {
                    let str_inv = (id.substr(7) > 0 ? ' <a href="#" onclick="getInvoicePrint(' + full.RicD + '); "><i class="fas fa - search - plus"></i>' + id + '</a>' : '');
                    return str_inv;
                }
            },
            {
                data: 'fk_projet', title: 'SO No.', sWidth: "10%", render: function (data, type, dtrow) {
                    if (data > 0) return '#' + data; else return '';
                }
            },
            { data: 'vendor_name', title: 'Vendor Name', sWidth: "15%" },
            {
                data: 'city', title: 'Address', sWidth: "20%", render: function (data, type, dtrow) {
                /*    let val = dtrow.address + ', ' + dtrow.town + ' ,' + dtrow.fk_state + ' ' + dtrow.zip;*/
                    let val = dtrow.address + ', ' + dtrow.town + ', ' + dtrow.fk_state + ' ' + dtrow.zip;
                    return val;
                }
            },
            { data: 'total_ttc', title: 'Amount', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'date_livraison', title: 'Planned date of delivery', sWidth: "10%" },
            { data: 'Status', title: 'Status', sWidth: "10%" }
        ]
      
    });
}


function PoClosureGridColleps() {   
    let obj = { strValue1: $("#ddlSearchStatus").val() };// console.log(obj);
    console.log(obj);
    $('#dtdataPoClosure').DataTable({
        oSearch: { "sSearch": '' }, bAutoWidth: false, scrollX: false,   
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        destroy: true, ajax: {
            url: '/Reception/GetPoClosureOrderDetailsList', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
        columns: [
            { data: 'ref', title: 'Parent ID', sWidth: "8%" },
            {
                data: 'ref', title: 'PO No', sWidth: "10%", render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    return '<a href="javascript:void(0);" class="details-control" data-toggle="tooltip" title="Click here to show details."><i class="glyphicon glyphicon-plus-sign"></i></a> -  #' + row.ref + '<a href="#" onclick="getPurchaseOrderPrint(' + row.id + ', false);"><i class="fas fa-search-plus"></i></a>' ;
                
                  
                }        
            },

            
           
            {
                data: 'fk_projet', title: 'SO No.', sWidth: "10%", render: function (data, type, dtrow) {
                    if (data > 0) return '#' + data; else return '';
                }
            },
            { data: 'vendor_name', title: 'Vendor Name', sWidth: "15%" },
            {
                data: 'city', title: 'Address', sWidth: "20%", render: function (data, type, dtrow) {
                    /*    let val = dtrow.address + ', ' + dtrow.town + ' ,' + dtrow.fk_state + ' ' + dtrow.zip;*/
                    let val = dtrow.address + ', ' + dtrow.town + ', ' + dtrow.fk_state + ' ' + dtrow.zip;
                    return val;
                }
            },
 
            { data: 'date_livraison', title: 'Planned date of delivery', sWidth: "10%" },
            { data: 'Status', title: 'Status', sWidth: "10%" },
            {
                'data': 'ref', title: 'Action', sWidth: "7%",
                'render': function (id, type, row) {
                    return '<a title="Click here to view details" data-toggle="tooltip" href="NewReceiveOrder/' + row.id + '"><i class="glyphicon glyphicon-pencil"></i></a>'

                }
            }

        ],
        columnDefs: [{ targets: [0], visible: false, searchable: false }], order: [[1, "desc"]]
    });
}

/* Formatting function for row details - modify as you need */
function format(d) {
    //console.log(d.ref);
    //let option = { strValue1: d.id }, wrHTML = '<table class="inventory-table table-blue table check-table table-bordered table-striped dataTable no-footer"><thead><tr><th style="width:14.2%; text-align:left;">Bill No</th><th style="width:20%; text-align:left;">Receive Date</th><th style="width:20%; text-align:right;">Amount</th></tr></thead>';
    //$.ajax({
    //    url: '/Reception/GetPoClosureOrderDataList', type: 'post', dataType: 'json', contentType: "application/json; charset=utf-8", data: JSON.stringify(option),
    //    success: function (result) {
    //        result = JSON.parse(result);
    //        if (result.length == 0) { wrHTML += '<tbody><tr><td valign="top" colspan="6" class="no-data-available">Sorry no matching records found.</td></tr></tbody>'; }
    //        $(result).each(function (index, row) {
           
    //            wrHTML += '<tr><td style="width:14.2%; text-align:left;"> <a href="#" onclick="getInvoicePrint(' + row.RicD + '); "><i class="fas fa - search - plus"></i>' + row.refordervendor + '</a></td><td style="width:20%; text-align:left;">' + row.date_creation + '</td>';
    //            wrHTML += '<td style="width:20%; text-align:right;">' + '$' + row.total_ttc + '</td></tr > ';
    //        });
    //    },
    //    error: function (xhr, status, err) { alert(err); },
    //    complete: function () { }, async: false
    //});
    //wrHTML += '</table>';
    //return wrHTML;

    let option = { strValue1: d.id }, wrHTML = '<table class="inventory-table table-blue table check-table table-bordered table-striped dataTable no-footer"><thead><tr><th style="width:10%; text-align:left;">Bill No</th><th style="width:12%; text-align:left;">Receive Date</th><th style="width:60%; text-align:left;">Description</th><th style="width:10%; text-align:left;">Quantity</th><th style="width:10%; text-align:right;">Amount</th></tr></thead>';
    $.ajax({
        url: '/Reception/GetPoClosureOrderDataList', type: 'post', dataType: 'json', contentType: "application/json; charset=utf-8", data: JSON.stringify(option),
        success: function (result) {
            result = JSON.parse(result);
            if (result.length == 0) { wrHTML += '<tbody><tr><td valign="top" colspan="6" class="no-data-available">Sorry no matching records found.</td></tr></tbody>'; }
            $(result).each(function (index, row) {

                wrHTML += '<tr><td style="width:10%; text-align:left;"> <a href="#" onclick="getInvoicePrintnew(' + row.RicD + '); "><i class="fas fa - search - plus"></i>' + row.refordervendor + '</a></td><td style="width:12%; text-align:left;">' + row.dtcration + '</td>';
                wrHTML += '<td style="width:60%; text-align:left;">' + row.des + '</td>'
                wrHTML += '<td style="width:10%; text-align:left;">' + row.Quenty + '</td>'
                wrHTML += '<td style="width:10%; text-align:right;">' + '$' + row.total_ttc + '</td></tr > ';
            });
        },
        error: function (xhr, status, err) { alert(err); },
        complete: function () { }, async: false
    });
    wrHTML += '</table>';
    return wrHTML;
}



function PoPartiallyColleps() {
    let obj = { strValue1: $("#ddlSearchStatus").val() };// console.log(obj);
    console.log(obj);
    $('#dtdataPartially').DataTable({
        oSearch: { "sSearch": '' }, bAutoWidth: false, scrollX: false,
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        destroy: true, ajax: {
            url: '/Reception/GetPartiallyDetailsList', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
        columns: [
            { data: 'rowid', title: 'Parent ID', sWidth: "8%" },
            {
                data: 'ref', title: 'PO No', sWidth: "10%", render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    return '<a href="javascript:void(0);" class="pdetails-control" data-toggle="tooltip" title="Click here to show details."><i class="glyphicon glyphicon-plus-sign"></i></a> -  #' + row.ref + '<a href="#" onclick="getPurchaseOrderPrint(' + row.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                   
                }
            },

            {
                data: 'fk_projet', title: 'SO No.', sWidth: "10%", render: function (data, type, dtrow) {
                    if (data > 0) return '#' + data; else return '';
                }
            },
            { data: 'vendor_name', title: 'Vendor Name', sWidth: "15%" },
            {
                data: 'city', title: 'Address', sWidth: "20%", render: function (data, type, dtrow) {
                    /*    let val = dtrow.address + ', ' + dtrow.town + ' ,' + dtrow.fk_state + ' ' + dtrow.zip;*/
                    let val = dtrow.address + ', ' + dtrow.town + ', ' + dtrow.fk_state + ' ' + dtrow.zip;
                    return val;
                }
            },

            { data: 'date_livraison', title: 'Planned date of delivery', sWidth: "10%" },
            { data: 'Status', title: 'Status', sWidth: "10%" },

            {
                'data': 'ref', title: 'Action', sWidth: "7%",
                'render': function (id, type, row) {
                    return '<a title="Click here to view details" data-toggle="tooltip" href="NewReceiveOrder/' + row.id + '"><i class="glyphicon glyphicon-pencil"></i></a>'
                    
                }
            }
        ],
        columnDefs: [{ targets: [0], visible: false, searchable: false }],order: [[0, "desc"]]
    });
}

/* Formatting function for row details - modify as you need */
function formatPartially(d) {
    //console.log(d.ref);
    let option = { strValue1: d.id }, wrHTML = '<table class="inventory-table table-blue table check-table table-bordered table-striped dataTable no-footer"><thead><tr><th style="width:10%; text-align:left;">Bill No</th><th style="width:12%; text-align:left;">Receive Date</th><th style="width:60%; text-align:left;">Description</th><th style="width:10%; text-align:left;">Quantity</th><th style="width:10%; text-align:right;">Amount</th></tr></thead>';
    $.ajax({
        url: '/Reception/GetPartiallyOrderDataList', type: 'post', dataType: 'json', contentType: "application/json; charset=utf-8", data: JSON.stringify(option),
        success: function (result) {
            result = JSON.parse(result);
            if (result.length == 0) { wrHTML += '<tbody><tr><td valign="top" colspan="6" class="no-data-available">Sorry no matching records found.</td></tr></tbody>'; }
            $(result).each(function (index, row) {

                wrHTML += '<tr><td style="width:10%; text-align:left;"> <a href="#" onclick="getInvoicePrintnew(' + row.RicD + '); "><i class="fas fa - search - plus"></i>' + row.refordervendor + '</a></td><td style="width:12%; text-align:left;">' + row.dtcration + '</td>';
                wrHTML += '<td style="width:60%; text-align:left;">'  + row.des + '</td>'
                wrHTML += '<td style="width:10%; text-align:left;">'  + row.Quenty + '</td>'
                wrHTML += '<td style="width:10%; text-align:right;">' + '$' + row.total_ttc + '</td></tr > ';
            });
        },
        error: function (xhr, status, err) { alert(err); },
        complete: function () { }, async: false
    });
    wrHTML += '</table>';
    return wrHTML;
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
