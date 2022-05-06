$(document).ready(function () {
    var loc = window.location.pathname;
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
        FillGrid();
    });
    $('#txtDate').val('');
    $('#txtDate').on('cancel.daterangepicker', function (ev, picker) { $(this).val(''); FillGrid(); });
    FillGrid();
     
});

function FillGrid(is_date) {
    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };
    var obj = { strValue1: sd, strValue2: ed, strValue3: 'SERCH', strValue4: '' }
    var table_EL = $('#dtdata').DataTable({
        //columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': false, 'targets': [9] }], order: [[9, "desc"]],
        order: [[0, "asc"], [1, "asc"]], ordering: true, destroy: true, bProcessing: true, bServerSide: false, bAutoWidth: false, searching: true, responsive: true, lengthMenu: [[20, 50, 100], [20, 50, 100]],
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#JournalListdata_filter input').unbind();
            $('#JournalListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },

        ajax: {
            url: '/Reports/Getpastduemiscbill', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { console.log(JSON.parse(data)); return JSON.parse(data); }
        },

        aoColumns: [
            {
                data: 'ref', sWidth: "10%", title: 'Bill No',
                render: function (id, type, full, meta) {
                    //if ($("#hfEdit").val() == "1") {
                    return '<a title="Click here to bill view" data-toggle="tooltip" href="PayMiscBills/' + full.rowid + '">' + id + '</a> <a title="Click here to view misc bill" data-toggle="tooltip" href="#" onclick="getBillPrintDetails(' + full.rowid + ', false);"><i class="fas fa-search-plus"></i></a>';
                    //return '<a title="Click here to bill view" data-toggle="tooltip" href="#">' + id + '</a> <a title="Click here to view misc bill" data-toggle="tooltip" href="#" onclick="getBillPrintDetails(' + full.rowid + ', false);"><i class="fas fa-search-plus"></i></a>';
                    //}
                    //else { return '<a href="#">' + id + '</a> <a href="#" onclick="getPurchaseOrderPrint(' + full.id + ', false);"><i class="fas fa-search-plus"></i></a>'; }
                }
            },
            { data: 'date_creation', title: 'Bill Date', sWidth: "10%", render: function (id, type, full, meta) { return full.date_creation; } },

            //{ data: 'fk_projet', title: 'SO No.', sWidth: "10%", render: function (data, type, dtrow) { if (data > 0) return '#' + data; else return ''; } },
            { data: 'transaction_t', title: 'Transaction Type', sWidth: "10%" },
            { data: 'customertype', title: 'Customer Type', sWidth: "15%" },

            { data: 'paymenttype', title: 'Bill Type', sWidth: "15%" },
            { data: 'payaccount', title: 'Pay Account', sWidth: "15%" },
            {
                data: 'totqty', title: 'Quantity', sWidth: "8%", class: 'text-right', render: function (data, type, full, meta) {
                    //let num = $.fn.dataTable.render.number(',', '.', 2, '$').display(data);
                    return data;
                }
            },
            //{
            //    data: 'total_rate', title: 'Amount', sWidth: "8%", class: 'text-right', render: function (data, type, full, meta) {
            //        let num = $.fn.dataTable.render.number(',', '.', 2, '$').display(data);
            //        return num;
            //    }
            //},

            {
                data: 'total_ttc', title: 'Total Amount', sWidth: "8%", class: 'text-right', render: function (data, type, full, meta) {
                    let num = $.fn.dataTable.render.number(',', '.', 2, '$').display(data);
                    return num;
                }
            },
            {
                data: 'due_date_s', title: 'Due date', sWidth: "10%", render: function (id, type, full, meta) {
                    if (full.past_due == "Past Due") return '<span style="display: none;">' + full.due_date_s + '</span>' + full.due_date + ' <i class="fas fa-exclamation pastdue" title="Past Due" aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>';
                    else return '<span style="display: none;">' + full.due_date_s + '</span>' + full.due_date;
                }
            },
        ],
        dom: 'lBftipr',
        buttons: [
            {
                extend: 'csv', className: 'button', text: '<i class="fas fa-file-csv"></i> CSV',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7],

                },
                filename: function () {
                    if (sd == '') {
                        let d = new Date(); let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                        return 'Past_Due_Misc_Bills ' + e;
                       
                    }
                    else {
                        let e = sd + '-' + ed;
                        return 'Past_Due_Misc_Bills ' + e;
                    }
                },
            },

            {
                extend: 'print',
                //title: '<h3 style="text-align:center">Layla Sleep Inc.</h3><br /><h3 style="text-align:left">Chart of accounts</h3>',
                title: '', className: 'button', text: '<i class="fas fa-file-csv"></i> Print', footer: false,
                exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7], },
                filename: function () {
                    if (sd == '') {
                        let d = new Date(); let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                        return 'Past_Due_Misc_Bills ' + e;

                    }
                    else {
                        let e = sd + '-' + ed;
                        return 'Past_Due_Misc_Bills ' + e;
                    }
                },
                messageTop: function () { return '<h3 style = "text-align:center"> Layla Sleep Inc.</h3 ><br /><h3 style="text-align:left">Past Due Misc. Bills</h3>'; },
            }
        ],
    });
}









