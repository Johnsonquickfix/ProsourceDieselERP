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
        misclistList();
    });
    $('#txtDate').val('');
    $('#txtDate').on('cancel.daterangepicker', function (ev, picker) { $(this).val(''); misclistList(); });
    misclistList();

});
function misclistList() {
    let status_id = 0, is_active = 0;
    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };
    let table = $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
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
        sAjaxSource: "/miscellaneousbill/autobill-list",
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
            {
                data: 'rowid', sWidth: "10%", title: 'Bill No',
                render: function (id, type, full, meta) {
                    return '<a title="Click here to view bill" data-toggle="tooltip" href="AutoBillConfig/' + full.rowid + '">#' + id + '</a>';
                    //return '<a title="Click here to bill view" data-toggle="tooltip" href="PayMiscBills/' + full.rowid + '">' + id + '</a> <a title="Click here to view misc bill" data-toggle="tooltip" href="#" onclick="getBillPrintDetails(' + full.rowid + ', false);"><i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'vendor_name', title: 'Vendor', sWidth: "15%" },
            { data: 'date_creation', title: 'Bill Date', sWidth: "10%", render: function (id, type, full, meta) { return full.date_creation; } },

            //{ data: 'fk_projet', title: 'SO No.', sWidth: "10%", render: function (data, type, dtrow) { if (data > 0) return '#' + data; else return ''; } },
            { data: 'transaction_type', title: 'Transaction Type', sWidth: "10%" },
            { data: 'paymenttype', title: 'Bill Type', sWidth: "15%" },
            { data: 'payaccount', title: 'Pay Account', sWidth: "15%" },
            { data: 'due_day', title: 'Due Day of Month', sWidth: "10%" },
            {
                data: 'net_amount', title: 'Total Amount', sWidth: "10%", class: 'text-right', render: function (data, type, full, meta) {
                    let num = $.fn.dataTable.render.number(',', '.', 2, '$').display(data);
                    return num;
                }
            },
            {
                data: 'is_active', title: 'Status', sWidth: "10%", class: 'text-center', render: function (id, type, full, meta) {
                    if (full.is_active) return '<a href="javascript:void(0)" class="label label-success" onclick="ChageStatus(' + full.rowid + ', false);">Active</a>';
                    else return '<a href="javascript:void(0)" class="label label-danger" onclick="ChageStatus(' + full.rowid + ', true);">De-Active</a>';
                }
            },
            {
                data: 'rowid', title: 'Action', sWidth: "8%", 'render': function (id, type, row, meta) {
                    return '<a title="Click here to view bill" data-toggle="tooltip" href="AutoBillConfig/' + id + '"><i class="glyphicon glyphicon-eye-open"></i></a>';
                }
            }
        ]
    });
    $('[data-toggle="tooltip"]').tooltip();
}
function ChageStatus(id, _status) {
    let msg = _status ? 'Do you want to Active this bill?' : 'Do you want to De-Active this bill?';
    swal.queue([{
        title: '', confirmButtonText: 'Yes, save it!', text: msg, showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                $.post('/miscellaneousbill/billstatus-update', { strValue1: id, strValue2: _status}).done(function (result) {
                    if (result.status) {
                        swal.insertQueueStep({ title: 'Success', text: result.message, type: 'success' }); $('#dtdata').DataTable().ajax.reload();
                    }
                    else { swal.insertQueueStep({ title: 'Error', text: result.message, type: 'error' }); }
                    resolve();
                }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
            });
        }
    }]);
}