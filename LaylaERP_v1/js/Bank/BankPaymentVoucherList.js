var table_oh;
$(document).ready(function () {
    $("#loader").hide();
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
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto"
    }, function (start, end, label) {
        $('#txtDate').val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
        dataGridLoad();
    });
    $('#txtDate').val('');
    $.when(getBanks()).done(function () { dataGridLoad(); }); $(".select2").select2();
    $('#txtDate').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val(''); let order_type = $('#hfOrderType').val();
        $.when(getBanks()).done(function () { dataGridLoad(); });
    });
    $('#btnOtherFilter').click(function () { dataGridLoad(); });
});
function getBanks() {
    $('#ddlpaymentaccount').empty().append('<option value="0">Select Payment Account</option>')
    $.ajax({
        url: "/bank/getaccountslist", dataType: 'json', type: "get", contentType: "application/json; charset=utf-8",
        data: { strValue1: 'GETBANK' },
        success: function (data) {
            data = JSON.parse(data);
            $.each(data, function (i, row) {
                $('#ddlpaymentaccount').append('<option value="' + row.id + '">' + row.text + '</option>');
            });
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }, async: false
    });
}
function isNullUndefAndSpace(variable) { return (variable !== null && variable !== undefined && variable !== 'undefined' && variable !== 'null' && variable.length !== 0); }
function dataGridLoad() {
    let searchText = localStorage.getItem('_search');
    let bank_id = (parseInt($('#ddlpaymentaccount').val()) || 0);
    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };
    table_oh = $('#dtdata').DataTable({
        oSearch: { "sSearch": searchText }, columnDefs: [{ "orderable": false, "targets": 0 }], order: [[0, "desc"]], lengthMenu: [[10, 20, 50], [10, 20, 50]],
        destroy: true, bProcessing: true, responsive: true, bServerSide: true, bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('.dataTables_filter input').unbind();
            $('.dataTables_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_oh.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/bank/expense-list",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed });
            aoData.push({ name: "strValue3", value: bank_id }, { name: "strValue4", value: 'BP' });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                success: function (data) {
                    console.log(data);
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [
            { data: 'voucher_no', title: 'Voucher No', sWidth: "8%"},
            { data: 'voucher_date', title: 'Date', sWidth: "12%", render: function (data, type, full) { if (type === "sort" || type === 'type') { return full.quote_date_sort; } else return data; } },
            { data: 'bank_name', title: 'Name', sWidth: "14%" },
            { data: 'ref_no', title: 'Ref No.', sWidth: "14%" },
            { data: 'description', title: 'Description', sWidth: "10%" },
            { data: 'amount', title: 'Amount', sWidth: "10%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            {
                data: 'voucher_no', title: 'Action', sWidth: "8%", 'render': function (id, type, row, meta) {
                    return '<a href="expense/' + id + '" data-toggle="tooltip" title="View / Edit Bank Payment" ><i class="glyphicon glyphicon-eye-open"></i></a>';
                }
            }
        ]
    });
}
