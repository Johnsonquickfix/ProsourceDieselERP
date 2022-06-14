$(document).ready(function () {
    $("#loader").hide(); $('.select2').select2();
    $('#txtDate').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'This Year': [moment().startOf('year'), moment().endOf('year')]
        },
        startDate: moment(), autoUpdateInput: false, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'left', orientation: "left auto"
    }, function (start, end, label) {
        $('#txtDate').val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
        journalvoucher();
    });
    $('#txtDate').val('');
    $('#txtDate').on('cancel.daterangepicker', function (ev, picker) { $(this).val(''); journalvoucher(); });
    journalvoucher();
});
function journalvoucher() {
    let status_id = 0, is_active = 0;
    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };
    let table = $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[20, 30, 50], [20, 30, 50]],
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('.dataTables_filter input').unbind();
            $('.dataTables_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Accounting/AccountjournalvoucherList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed });
            aoData.push({ name: "strValue3", value: status_id }, { name: "strValue4", value: (is_active > 0 ? is_active : '') }, { name: "strValue5", value: "PO" });
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
            
            //{ data: 'voucher_no', title: 'Voucher No', sWidth: "10%" },
            {
                data: 'voucher_no', sWidth: "10%", title: 'Entry No',
                render: function (id, type, full, meta) {
                    //if ($("#hfEdit").val() == "1") {
                    return '<a title="Click here to entry no view" data-toggle="tooltip" href="../Accounting/journalvoucher/' + id + '">' + id + '</a>';
                }
            },
            { data: 'voucher_date', title: 'Entry Date', sWidth: "10%", render: function (id, type, full, meta) { return full.voucher_date; } },
            { data: 'account_number', title: 'Account_Number', sWidth: "10%" },
            { data: 'description', title: 'Description', sWidth: "10%" },
            { data: 'debit', title: 'Debit ($)', sWidth: "10%", render: $.fn.dataTable.render.number(',', '.', 2, ''), class: "text-right" },
            { data: 'credit', title: 'Credit ($)', sWidth: "10%", render: $.fn.dataTable.render.number(',', '.', 2, ''), class: "text-right" },
        ]
    });
    $('[data-toggle="tooltip"]').tooltip();
}
