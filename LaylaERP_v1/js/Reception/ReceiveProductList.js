$(document).ready(function () { 
    $("#loader").hide(); //$('.select2').select2();
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
        startDate: moment().subtract(1, 'month'), autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'left', orientation: "left auto"
    }, function (start, end, label) {
        $('#txtDate').val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
        // ProductGrid();
        ProductGrid(); 
    });
    $('#txtDate').val('');
    $('#txtDate').on('cancel.daterangepicker', function (ev, picker) { $(this).val(''); ProductGrid(); });
   
    ProductGrid(); 
});
 
function ProductGrid() {
    let urid = $("#txtorderpono").val();
    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };
    let table = $('#dtdata').DataTable({
        /*   columnDefs: [{ "orderable": false, "targets": 0 }], order: [[0, "asc"]],*/
        columnDefs: [], order: [[0, "asc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false,  scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[20, 40, 60, 100], [20, 40, 60, 100]],
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
                if (code == 13) { table.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Reception/GetProductReceiveList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed });
            aoData.push({ name: "strValue3", value: urid });
            var col = 'order_id';
            if (oSettings.aaSorting.length > 0) {
                //var col = oSettings.aaSorting[0][0] == 2 ? "refordervendor" : oSettings.aaSorting[0][0] == 3 ? "vendor_name" : oSettings.aaSorting[0][0] == 4 ? "vendor_name" : oSettings.aaSorting[0][0] == 5 ? "city" : oSettings.aaSorting[0][0] == 6 ? "zip" : oSettings.aaSorting[0][0] == 6 ? "date_livraison" : oSettings.aaSorting[0][0] == 7 ? "Status" : "ref";
                aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data });

            }
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
                data: 'ref', title: 'PO No', sWidth: "10%", render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    return  row.ref + '<a title="Click here to view order preview" data-toggle="tooltip" href="#" onclick="getPurchaseOrderPrint(' + row.id + ', false);"><i class="fas fa-search-plus"></i></a>';

                }
            },
            { data: 'date_creation', title: 'Order Date', sWidth: "10%" },
            { data: 'tagno', title: 'Tag/Lot/Batch No', sWidth: "10%" },
       
            { data: 'display', title: 'Product Name', sWidth: "15%" },

        
            //{
            //    data: 'refordervendor', title: 'Invoice No', sWidth: "10%", 'render': function (id, type, full, meta) {
            //        let str_inv = '<a title="Click here to view invoice preview" data-toggle="tooltip"  href="#" onclick="getInvoicePrint(' + full.id + '); "><i class="fas fa - search - plus"></i>' + id + '</a>';
            //        return str_inv;
            //    }
            //},
         
            { data: 'Quenty', title: 'Quantity', sWidth: "10%" },
            //{ data: 'vendor_name', title: 'Vendor Name', sWidth: "10%" },
            {
                'data': 'ReceiveID', sWidth: "10%", "bSearchable": false,
                'render': function (ID, type, full, meta) {

                    return '<a href="javascript:void(0);" class="badge bg-default" onClick="allotserial(' + ID + '); " data-toggle="tooltip" title="Create Serial">Create Serial <a>';
                }
            },
        ],

    });
} 
 
function allotserial(id) {
    var obj = { strVal: id }
    swal.queue([{
        title: '', confirmButtonText: 'Yes, update it!', text: "Do you want to allot serial?",
        showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                $.ajax({
                    url: '/Reception/allotserial/', dataType: 'json', type: 'Post',
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(obj),
                    dataType: "json",
                    success: function (data) {
                        if (data.status == true) {
                            swal('Success!', data.message, 'success').then((result) => { ProductGrid(); });
                        }
                        else {
                            swal('Alert!', data.message, 'error')
                        }
                    },
                    error: function (error) {
                        swal('Error!', 'something went wrong', 'error');
                    },
                })
            });
        }
    }]);
}
 
//function CheckAll() {
//    var isChecked = $('#checkall').prop("checked");
//    $('#dtdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
//}
//function Singlecheck(chk) {
//    var isChecked = $(chk).prop("checked");
//    var isHeaderChecked = $("#checkall").prop("checked");
//    if (isChecked == false && isHeaderChecked)
//        $("#checkall").prop('checked', isChecked);
//    else {
//        $('#dtdata tr:has(td)').find('input[type="checkbox"]').each(function () {
//            if ($(this).prop("checked") == false)
//                isChecked = false;
//        });
//        $("#checkall").prop('checked', isChecked);
//    }
//}
