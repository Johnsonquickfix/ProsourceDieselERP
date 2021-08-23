$(document).ready(function () {
    PurchaseOrderGrid();
    $('#btnSearch').click(function () {
        PurchaseOrderGrid();
    });
    //$(document).on('focus', '.dataTables_filter input', function () {
    //    $(this).unbind().bind('keyup', function (e) {
    //        if (e.keyCode === 13) { oTable.search(this.value).draw(); }
    //    });
    //});
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
        sAjaxSource: "/PurchaseOrder/GetPurchaseOrderList",
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
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            {
                'data': 'id', sWidth: "5%   ",
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '"><label></label>';
                }
            },
            {
                'data': 'ref', sWidth: "10%", title: 'PO No.',
                'render': function (id, type, full, meta) {
                    return '<a href="NewPurchaseOrder/' + full.id + '">' + id + '</a>';
                }
            },
            { data: 'refordervendor', title: 'Ref Order Vendor', sWidth: "15%" },
            { data: 'request_author', title: 'Request Author', sWidth: "15%" },
            { data: 'vendor_name', title: 'Vendor Name', sWidth: "15%" },
            { data: 'city', title: 'City', sWidth: "8%" },
            { data: 'zip', title: 'Zip Code', sWidth: "8%" },
            { data: 'date_livraison', title: 'Planned date of delivery', sWidth: "14%" },
            { data: 'Status', title: 'Status', sWidth: "10%" }
        ]
    });
}

