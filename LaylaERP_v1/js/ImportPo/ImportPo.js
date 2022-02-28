function ImportPoList() {
    var urid = $("#ddlSearchStatus").val();
    ID = $("#hfid").val();
    var table_EL = $('#EmailListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': true, 'targets': [0] }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#EmailListdata_filter input').unbind();
            $('#EmailListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/ImportPo/GetImportPolList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            //if (oSettings.aaSorting.length >= 0) {
            //    var col = oSettings.aaSorting[0][0] == 0 ? "user_id" : oSettings.aaSorting[0][0] == 1 ? "user_email" : oSettings.aaSorting[0][0] == 2 ? "status" : "id";
            //    aoData.push({ name: "sSortColName", value: col });
            //}
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [

            { data: 'podatesort', title: 'Date', sWidth: "5%", render: function (inv_num, type, full, meta) { return full.po_date; } },
            { data: 'po_invoice_number', title: 'Invoice', sWidth: "10%" },
            { data: 'customer_requisition', title: 'Requisition', sWidth: "10%" },
            { data: 'poduedatesort', title: 'Due date', sWidth: "10%", render: function (inv_num, type, full, meta) { return full.po_due_date; } },
            { data: 'po_currency', title: 'Currency', sWidth: "10%" },
            { data: 'original_invoice_amt', title: 'Original Amount', sWidth: "10%", render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'remain_invoice_amt', title: 'Remain Amount', sWidth: "10%", render: $.fn.dataTable.render.number(',', '.', 2, '') },
        ]
    });
}