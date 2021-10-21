function AccountJournalList() {
    var urid = $("#ddlSearchStatus").val();
    var ID = $("#hfid").val();
    var table_EL = $('#JournalListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': true, 'targets': [0] }], order: [[0,"desc"],[2, "desc"]],
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
            $('#JournalListdata_filter input').unbind();
            $('#JournalListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },

        footerCallback: function (row, data, start, end, display) {
            var api = this.api(), data;
            console.log(data);
            var intVal = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            var DebitTotal = api.column(7).data().reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            var CreditTotal = api.column(8).data().reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            $(api.column(0).footer()).html('Page Total');
            $(api.column(7).footer()).html('$' + parseFloat(DebitTotal).toFixed(2));
            $(api.column(8).footer()).html('$' + parseFloat(CreditTotal).toFixed(2));
            console.log(DebitTotal);
            console.log(CreditTotal);
        },

        sAjaxSource: "/Accounting/AccountJournalList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "inv_num" : oSettings.aaSorting[0][0] == 1 ? "code_journal" : oSettings.aaSorting[0][0] == 2 ? "datecreation" : oSettings.aaSorting[0][0] == 3 ? "PO_SO_ref" : oSettings.aaSorting[0][0] == 4 ? "inv_complete" : oSettings.aaSorting[0][0] == 5 ? "name" : oSettings.aaSorting[0][0] == 6 ? "label_operation" : oSettings.aaSorting[0][0] == 7 ? "debit" : oSettings.aaSorting[0][0] == 8 ? "credit" : "id";
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
            { data: 'inv_num', title: 'Num Transcation', sWidth: "5%" },
            { data: 'code_journal', title: 'Journal', sWidth: "5%" },
            { data: 'datecreation', title: 'Date', sWidth: "10%" },
            { data: 'PO_SO_ref', title: 'Accounting Doc', sWidth: "5%"},
            { data: 'inv_complete', title: 'Account Number', sWidth: "5%" },
            { data: 'name', title: 'Vendor Name', sWidth: "15%" },
            { data: 'label_operation', title: 'Operation Label', sWidth: "25%" },
            { data: 'debit', title: 'Debit', sWidth: "5%", render: $.fn.dataTable.render.number('', '.', 2, '$')},
            { data: 'credit', title: 'Credit', sWidth: "5%", render: $.fn.dataTable.render.number('', '.', 2, '$')},
        ],
    });
}


function getGrandTotal() {
        $.ajax({
            url: "/Accounting/GrandTotal",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            success: function (data) {
               
                var d = JSON.parse(data);
                if (d.length > 0) {
                    $("#txtdebit").text('$'+ d[0].debit);
                    $("#txtcredit").text('$'+ d[0].credit);
                }
            },
            error: function (msg) {

            }
        });
}
