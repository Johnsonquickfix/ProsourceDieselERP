$(document).ready(function () {
    $("#loader").hide();
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
}); 

function Search() {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    var account = $('#ddlstatus').val();
   // var type = $('#ddltype').val();
    if (account == "0") { swal('alert', 'Please select Payment Type', 'error'); }
    //else if (type == "0") { swal('alert', 'Please select Type', 'error'); }
    else { 
        let table = $('#dtdata').DataTable({
            columnDefs: [{ "orderable": true, "targets": 0 }], order: [[0, "desc"]],
            destroy: true, bProcessing: true, bServerSide: true,
            bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
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
                    if (code == 13) {
                        table.search(this.value).draw();
                        getGrandTotal(this.value);
                    }
                });
            },
            sAjaxSource: "/CheckDeposit/GetPaymentStatusList",
            fnServerData: function (sSource, aoData, fnCallback, oSettings) {
                aoData.push({ name: "strValue1", value: account }, { name: "strValue2", value: sd }, { name: "strValue3", value: ed }, { name: "strValue4", value: '0' });
                if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
                oSettings.jqXHR = $.ajax({
                    dataType: 'json', type: "GET",url: sSource, data: aoData,
                    "success": function (data) {
                        var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                        return fnCallback(dtOption);
                    } 
                });
            },
            columns: [
                { data: 'ID', title: 'ID', sWidth: "8%" },
                //{
                //    'data': 'id', sWidth: "2%   ", 'render': function (data, type, row) {
                //        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '"><label></label>';
                //    }
                //},
                { data: 'post_date', title: 'Create Date', sWidth: "10%" },
                //{ data: 'post_status', sWidth: "10%", title: 'Status', sWidth: "10%" },
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
                { data: 'subtotal', title: 'Sub-Total', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },                
                { data: 'Discount', title: 'Total Savings', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'shipping', title: 'Shipping', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'Tax', title: 'Sale Tax', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'State_Recycling_Fee', title: 'State Recycling Fee', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'Fee', title: 'Fee', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'gift_card', title: 'Gift Card', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'Total', title: 'Order Total', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
         
                  
            ],
            //columnDefs: [{ targets: [0], searchable: false }], order: [[1, "desc"]]
            "dom": 'lBftipr',
            "buttons": [

                {
                    extend: 'csv',
                    className: 'button',
                    text: '<i class="fas fa-file-csv"></i> Export',
                    filename: function () {
                        var from = $("#txtOrderDate").val().replaceAll('/', '.');
                        //var to = $("#end_date").val().replaceAll('/', '.');
                        return from ;
                    },
                },

            ],

        });
    }

    setTimeout(function () {
        getGrandTotal();
    }, 50);
    
}

function getGrandTotal(val) {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    var account = $('#ddlstatus').val();
   // var type = $('#ddltype').val();
    let src = val;
    console.log(src);
    let obj = { strValue1: account, strValue2: sd, strValue3: ed, strValue4: src, strValue5: '0' };
    $.ajax({
        url: "/CheckDeposit/GetGrandTotal",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: obj,
        success: function (data) {
            var d = JSON.parse(data);
            if (d.length > 0) {
               // if (parseFloat(d[0].debit).toFixed(2) > 0) {
                $("#totalsub").text('$' + parseFloat(d[0].Gsubtotal).toFixed(2)); $("#totalsaving").text('$' + parseFloat(d[0].GDiscount).toFixed(2)); $("#totalshiiping").text('$' + parseFloat(d[0].Gshipping).toFixed(2));
                $("#totalsaltax").text('$' + parseFloat(d[0].GTax).toFixed(2)); $("#totalstatefee").text('$' + parseFloat(d[0].GState_Recycling_Fee).toFixed(2)); $("#totalfee").text('$' + parseFloat(d[0].GFee).toFixed(2));
                $("#totalgigtcard").text('$' + parseFloat(d[0].Ggift_card).toFixed(2)); $("#totalothertotal").text('$' + parseFloat(d[0].GTotal).toFixed(2));
               // }
            }
        },
        error: function (msg) {

        }
    });
}

 