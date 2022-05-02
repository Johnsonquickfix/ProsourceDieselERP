$(document).ready(function () {
    InventoryReport();
})

function InventoryReport() {
    var ID = $("#hfid").val();
    var obj = { id: ID };
    //var numberRenderer = $.fn.dataTable.render.number(',', '.', 2,).display;
    var table_EL = $('#dtdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': false, 'targets': [0] }], order: [[0, "asc"]],
        destroy: true, bProcessing: true, bServerSide: false, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[20, 50], [20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#dtdata_filter input').unbind();
            $('#dtdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        /*sAjaxSource: "/Accounting/GetAccountFiscalYearList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "id" : oSettings.aaSorting[0][0] == 1 ? "account" : oSettings.aaSorting[0][0] == 2 ? "debit" : oSettings.aaSorting[0][0] == 3 ? "credit" : oSettings.aaSorting[0][0] == 4 ? "balance" : "id";
                aoData.push({ name: "sSortColName", value: col });
            }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },*/
        ajax: {
            url: '/Reception/InventoryValuationReport', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { console.log(JSON.parse(data)); return JSON.parse(data); }
        },
        aoColumns: [
            { data: 'p_id', title: 'Parent ID', sWidth: "8%" },
            {
                data: 'id', title: 'Id', sWidth: "5%", render: function (data, type, row) {
                    if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control" data-toggle="tooltip" title="Click here to show warehouse On-Hand Inventory."></a>' + row.id; else return ' <b>#' + row.id + '</b>';
                }
            },
            //{ data: 'category', title: 'Category', sWidth: "8%" },
            { data: 'sku', title: 'SKU', sWidth: "10%", class: "text-left" },
            { data: 'post_title', title: 'Product', sWidth: "20%", class: "text-left" },
            {
                data: 'recqty', title: 'Rec.Qty', sWidth: "8%", className: "text-right", render: function (data, type, row) {
                    if (row.post_parent > 0) return row.recqty; else return '';
                }
            },
            {
                data: 'amount', title: 'Asset Value', sWidth: "10%", class: "text-left", render: function (data, type, row) {
                    if (row.post_parent > 0) return (row.amount).toFixed(2); else return '';
                }
            },
            {
                data: 'shipping', title: 'Shipping', sWidth: "10%", class: "text-left", render: function (data, type, row) {
                    if (row.post_parent > 0) return (row.shipping).toFixed(2); else return '';
                }
            },
            {
                data: 'tax', title: 'Tax', sWidth: "10%", class: "text-left", render: function (data, type, row) {
                    if (row.post_parent > 0) return (row.tax).toFixed(2); else return '';
                }
            },
            {
                data: 'avgcast', title: 'Calc. Avg', sWidth: "10%", class: "text-left", render: function (data, type, row) {
                    if (row.post_parent > 0) return (row.avgcast).toFixed(2); else return '';
                }
            },
        ],
    });
}