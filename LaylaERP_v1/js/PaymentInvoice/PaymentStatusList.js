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
    if (account == "0") { swal('alert', 'Please select Type', 'error'); }
    else { 
        $('#dtdata').DataTable({
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
            sAjaxSource: "/CheckDeposit/GetPaymentStatusList",
            fnServerData: function (sSource, aoData, fnCallback, oSettings) {
                aoData.push({ name: "strValue1", value: account }, { name: "strValue2", value: sd }, { name: "strValue3", value: ed }, { name: "strValue4", value: "0" });
                if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
                oSettings.jqXHR = $.ajax({
                    dataType: 'json', type: "GET", async: false, url: sSource, data: aoData,
                    "success": function (data) {
                        let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
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
                { data: 'post_status', sWidth: "10%", title: 'Status', sWidth: "10%" },
                { data: 'subtotal', title: 'Sub-Total', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },                
                { data: 'Discount', title: 'Total Savings', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'shipping', title: 'Shipping', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'Tax', title: 'Sale Tax', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'State_Recycling_Fee', title: 'State Recycling Fee', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'Fee', title: 'Fee', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'gift_card', title: 'Gift Card', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'Total', title: 'Order Total', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
         
                  
            ],
            columnDefs: [{ targets: [0], searchable: false }], order: [[1, "desc"]]
        });
    }   
}

 