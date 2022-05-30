$(document).ready(function () {
    $("#loader").hide();
    //$('#txtOrderDate').daterangepicker({
    //    ranges: {
    //        'Today': [moment(), moment()],
    //        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    //        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    //        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    //        'This Month': [moment().startOf('month'), moment().endOf('month')],
    //        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    //        'This Year': [moment().startOf('year'), moment().endOf('year')]
    //    },
    //    startDate: moment(), autoUpdateInput: false, alwaysShowCalendars: true,
    //    locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto",
    //}, function (start, end, label) {
    //    $('#txtOrderDate').val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
    //    dataGridLoad();
    //});
    $('#txtOrderDate').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        startDate: moment().subtract(1, 'month'), autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto"
    },
    );

    dataGridLoad();
     
});

function dataGridLoad() {
    //let searchText = localStorage.getItem('_search');
    //if ($('#filter-by-date').val() != "0") monthYear = $('#filter-by-date').val();
    //let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    //let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    //let payment = $('#ddltransaction').val();
    //if ($('#txtOrderDate').val() == '') { sd = ''; ed = '' };
    //table_oh = $('#dtdata').DataTable({
    //    oSearch: { "sSearch": searchText }, order: [[0, "desc"]], //columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
    //    lengthMenu: [[10, 20, 50], [10, 20, 50]],
    //    destroy: true, bProcessing: true, responsive: true, bServerSide: true, bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
    //    language: {
    //        lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
    //        infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
    //    },
    //    //initComplete: function () {
    //    //    $('.dataTables_filter input').unbind();
    //    //    $('.dataTables_filter input').bind('keyup', function (e) {
    //    //        var code = e.keyCode || e.which;
    //    //        if (code == 13) { table_oh.search(this.value).draw(); }
    //    //    });
    //    //},
    //    sAjaxSource: "/reports/payment-transactions",
    //    fnServerData: function (sSource, aoData, fnCallback, oSettings) {
    //        aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed }, { name: "strValue3", value: payment });
    //        if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
    //        oSettings.jqXHR = $.ajax({
    //            dataType: 'json', type: "GET", url: sSource, data: aoData,
    //            success: function (data) {
    //                let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
    //                return fnCallback(dtOption);
    //            }
    //        });
    //    },
    //    columns: [
    //        {
    //            data: 'id', title: 'Order ID', sWidth: "10%", class: 'text-left',
    //            render: function (id, type, full, meta) {
    //                if (full.post_mime_type == 'shop_order_erp') return '#' + id + ' <i class="glyphicon glyphicon-user" title="Order created from ERP Admin." aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>';
    //                else return '#' + id;
    //            }

    //        },
    //        { data: 'post_date', title: 'Order Date', sWidth: "10%" },
    //        {
    //            data: 'post_status', title: 'Status', sWidth: "10%", render: function (data, type, row) {
    //                if (data == 'wc-pending') return 'Pending payment';
    //                else if (data == 'wc-processing') return 'Processing';
    //                else if (data == 'wc-on-hold') return 'On hold';
    //                else if (data == 'wc-completed') return 'Completed';
    //                else if (data == 'wc-cancelled') return 'Cancelled';
    //                else if (data == 'wc-refunded') return 'Refunded';
    //                else if (data == 'wc-failed') return 'Failed';
    //                else if (data == 'wc-cancelnopay') return 'Cancelled - No Payment';
    //                else if (data == 'wc-pendingpodiuminv') return 'Pending Podium Invoice';
    //                else if (data == 'wc-podium') return 'Order via Podium';
    //                else if (data == 'wc-podiumrefund') return 'Podium Refunded';
    //                else if (data == 'draft') return 'draft';
    //                else return '-';
    //            }
    //        },
    //        { data: 'transaction_id', title: 'Trans. ID', sWidth: "10%" },
 
    //        { data: 'order_amount', title: 'Order Amt.', className: 'text-right', sWidth: "8%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            
    //    ],
    //    "dom": 'lBfrtip',
    //    "buttons": [
    //        {
    //            extend: 'csv',
    //            className: 'button',
    //            text: '<i class="fas fa-file-csv"></i> Export',
    //            filename: function () {
    //                // var d = new Date();
    //                return 'Agingorders_' + $("#txtOrderDate").val().replaceAll('/', '.');
    //            },
    //        },
    //        {
    //            extend: 'print',
    //            className: 'button',
    //            text: '<i class="fas fa-file-csv"></i> Print',
    //            title: function () {
    //                return "Layla Sleep Inc - Aging orders";
    //            },
    //            footer: true,
    //            exportOptions: {
    //                columns: [0, 1, 2, 3, 4],
    //            },
    //            filename: function () {
    //                //var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    //                return 'Agingorders_' + $("#txtOrderDate").val().replaceAll('/', '.');
    //            },
    //        }, 
    //    ],

        let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
        let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
        let payment = $('#ddltransaction').val();
        if($('#txtOrderDate').val() == '') { sd = ''; ed = '' };
    var obj = { strValue1: sd, strValue2: ed, strValue3: payment }
    var table_EL = $('#dtdata').DataTable({
        //columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': false, 'targets': [9] }], order: [[9, "desc"]],
        order: [[0, "asc"], [1, "asc"]], ordering: true, destroy: true, bProcessing: true, bServerSide: false, bAutoWidth: false, searching: true, responsive: true, lengthMenu: [[20, 50, 100], [20, 50, 100]],
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        //initComplete: function () {
        //    $('#JournalListdata_filter input').unbind();
        //    $('#JournalListdata_filter input').bind('keyup', function (e) {
        //        var code = e.keyCode || e.which;
        //        if (code == 13) { table_EL.search(this.value).draw(); }
        //    });
        //},

        ajax: {
            url: '/Reports/GetTransactionList', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { console.log(JSON.parse(data)); return JSON.parse(data); }
        },

        aoColumns: [
            {
                data: 'id', title: 'Order ID', sWidth: "10%", class: 'text-left',
                render: function (id, type, full, meta) {
                    if (full.post_mime_type == 'shop_order_erp') return '#' + id + ' <i class="glyphicon glyphicon-user" title="Order created from ERP Admin." aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>';
                    else return '#' + id;
                }

            },
            { data: 'post_date', title: 'Order Date', sWidth: "10%" },
            {
                data: 'post_status', title: 'Status', sWidth: "10%", render: function (data, type, row) {
                    if (data == 'wc-pending') return 'Pending payment';
                    else if (data == 'wc-processing') return 'Processing';
                    else if (data == 'wc-on-hold') return 'On hold';
                    else if (data == 'wc-completed') return 'Completed';
                    else if (data == 'wc-cancelled') return 'Cancelled';
                    else if (data == 'wc-refunded') return 'Refunded';
                    else if (data == 'wc-failed') return 'Failed';
                    else if (data == 'wc-cancelnopay') return 'Cancelled - No Payment';
                    else if (data == 'wc-pendingpodiuminv') return 'Pending Podium Invoice';
                    else if (data == 'wc-podium') return 'Order via Podium';
                    else if (data == 'wc-podiumrefund') return 'Podium Refunded';
                    else if (data == 'draft') return 'draft';
                    else return '-';
                }
            },
            { data: 'transaction_id', title: 'Trans. ID', sWidth: "10%" },

            { data: 'order_amount', title: 'Order Amt.', className: 'text-right', sWidth: "8%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            { 'data': 'daysdiff', className: 'text-right', title: 'Aging Days', sWidth: "10%" },

     
        ],
        dom: 'lBftipr',
        buttons: [
            {
                extend: 'csv', className: 'button', text: '<i class="fas fa-file-csv"></i> CSV',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4,5],

                },
                filename: function () {
                    if (sd == '') {
                        let d = new Date(); let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                        return 'Agingorders_NonDepositedFunds ' + e;

                    }
                    else {
                        let e = sd + '-' + ed;
                        return 'Agingorders_NonDepositedFunds ' + e;
                    }
                },
            },

            {
                extend: 'print',
                //title: '<h3 style="text-align:center">Layla Sleep Inc.</h3><br /><h3 style="text-align:left">Chart of accounts</h3>',
                title: '', className: 'button', text: '<i class="fas fa-file-csv"></i> Print', footer: false,
                exportOptions: { columns: [0, 1, 2, 3, 4,5], },
                filename: function () {
                    if (sd == '') {
                        let d = new Date(); let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                        return 'Agingorders_NonDepositedFunds ' + e;

                    }
                    else {
                        let e = sd + '-' + ed;
                        return 'Agingorders_NonDepositedFunds ' + e;
                    }
                },
                messageTop: function () { return '<h3 style = "text-align:center"> Layla Sleep Inc.</h3 ><br /><h3 style="text-align:left">Aging orders Non Deposited Funds</h3>'; },
            }
        ],

    });
}


