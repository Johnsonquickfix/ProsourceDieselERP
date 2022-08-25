function ImportCheckList() {
    var urid = $("#ddlSearchStatus").val();
    ID = $("#hfid").val();

    var table_EL = $('#CheckListData').DataTable({

        columnDefs: [{ "orderable": true, "targets": 1 }], order: [[1, "desc"]],
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
            $('#CheckListData_filter input').unbind();
            $('#CheckListData_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/ImportOrderinvoice/GetBankcheckList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); } 
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            { data: 'check_no',class:'text-left', title: 'Check No.', sWidth: "13%" },
            { data: 'chkdatesort', title: 'Clear Date', sWidth: "13%", render: function (inv_num, type, full, meta) { return full.chkdate; } },
            { data: 'check_amount', title: 'Amout', sWidth: "13%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },

        ]
    });
}

 