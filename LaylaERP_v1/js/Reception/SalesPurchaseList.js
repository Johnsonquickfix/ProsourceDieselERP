﻿$(document).ready(function () {
    $("#loader").hide(); 
    PurchaseOrderGrid();
});
function PurchaseOrderGrid() {
    let urid = 1;
    let table = $('#dtdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }], order: [[1, "desc"]],
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
        sAjaxSource: "/PurchaseOrder/GetPurchaseOrderList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid }, { name: "strValue2", value: "SPO" });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
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
                    return '<a>' + id + '</a> <a href="#" onclick="getPurchaseOrderPrint(' + full.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'date_creation', title: 'Order Date', sWidth: "10%" },
            {
                data: 'refordervendor', title: 'Invoice No', sWidth: "10%", 'render': function (id, type, full, meta) {
                    let str_inv = (id.substr(7) > 0 ? ' <a href="#" onclick="getInvoicePrint(' + full.id + '); "><i class="fas fa - search - plus"></i>' + id + '</a>' : '');
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
                data: 'address', title: 'Address', sWidth: "20%", render: function (data, type, dtrow) {
                    let val = dtrow.address + ', ' + dtrow.town + ', ' + dtrow.fk_state + ' ' + dtrow.zip;
                    return val;
                }
            },
            { data: 'total_ttc', title: 'Amount', sWidth: "8%", class: 'text-right', render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'date_livraison', title: 'Planned date of delivery', sWidth: "10%" },
            { data: 'Status', title: 'Status', sWidth: "8%" }
        ]
    });
}

