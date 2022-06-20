function AccountLedgerList() {
    var urid = $("#ddlSearchStatus").val();
    var ID = $("#hfid").val();
    var table_EL = $('#LedgerListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': true, 'targets': [0] }], order: [[0, "asc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
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
            $('#LedgerListdata_filter input').unbind();
            $('#LedgerListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Accounting/AccountLedgerList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "inv_complete" : oSettings.aaSorting[0][0] == 1 ? "code_journal" : oSettings.aaSorting[0][0] == 2 ? "datecreation" : oSettings.aaSorting[0][0] == 3 ? "name" : oSettings.aaSorting[0][0] == 4 ? "label_operation" : oSettings.aaSorting[0][0] == 5 ? "debit" : "id";
                aoData.push({ name: "sSortColName", value: col });
            }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            { data: 'inv_complete', title: 'Account number', sWidth: "5%" },
            { data: 'code_journal', title: 'Journal', sWidth: "5%" },
            { data: 'datecreation', title: 'Date', sWidth: "10%" },
            { data: 'name', title: 'Vendor name', sWidth: "10%" },
            { data: 'label_operation', title: 'Label', sWidth: "10%" },
            { data: 'debit', title: 'Debit', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'credit', title: 'Credit', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
        ],
    });
}
