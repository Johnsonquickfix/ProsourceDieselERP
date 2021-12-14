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
        PurchaseOrderGrid();
    });
    $('#txtDate').val('');
    $('#txtDate').on('cancel.daterangepicker', function (ev, picker) { $(this).val(''); PurchaseOrderGrid(); });
    PurchaseOrderGrid();
    $('#btnSearch').click(function () { PurchaseOrderGrid(); });
    $(document).on('click', '#btnChange', function () { orderStatus(); });
});
function PurchaseOrderGrid() {
    let urid = parseInt($("#ddlSearchStatus").val());
    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };
    let table = $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
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
        sAjaxSource: "/PurchaseOrder/GetPurchaseOrderList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed });
            aoData.push({ name: "strValue3", value: urid }, { name: "strValue4", value: "PO" });
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
                'data': 'id', sWidth: "5%   ",
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '"><label></label>';
                }
            },
            {
                'data': 'ref', sWidth: "10%", title: 'PO No',
                'render': function (id, type, full, meta) {
                    if ($("#hfEdit").val() == "1") {
                        return '<a href="NewPurchaseOrder/' + full.id + '">' + id + '</a> <a href="#" onclick="getPurchaseOrderPrint(' + full.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                    }
                    else { return '<a href="#">' + id + '</a> <a href="#" onclick="getPurchaseOrderPrint(' + full.id + ', false);"><i class="fas fa-search-plus"></i></a>'; }
                }
            },
            { data: 'date_creation', title: 'Order Date', sWidth: "10%" },
            {
                data: 'refordervendor', title: 'Invoice No', sWidth: "10%", 'render': function (id, type, full, meta) {
                    let str_inv = (id.substr(7) > 0 ? ' <a href="#" onclick="getInvoicePrint(' + full.id + '); "><i class="fas fa - search - plus"></i>' + id + '</a>' : '');
                    return str_inv;
                }
            },
            {
                data: 'fk_projet', title: 'SO No.', sWidth: "10%", render: function (data, type, dtrow) {
                    if (data > 0) return '#' + data; else return '';
                }
            },
            { data: 'vendor_name', title: 'Vendor Name', sWidth: "15%" },
            {
                data: 'address', title: 'Address', sWidth: "20%", render: function (data, type, dtrow) {
                    let val = dtrow.address + ', ' + dtrow.town + ', ' + dtrow.fk_state + ' ' + dtrow.zip;
                    return val;
                }
            },
            { data: 'total_ttc', title: 'Amount', sWidth: "8%", class: 'text-right', render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'date_livraison', title: 'Planned date of delivery', sWidth: "10%" },
            { data: 'Status', title: 'Status', sWidth: "8%" }
        ]
    });
}
function CheckAll() {
    var isChecked = $('#checkall').prop("checked");
    $('#dtdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
}
function Singlecheck(chk) {
    var isChecked = $(chk).prop("checked");
    var isHeaderChecked = $("#checkall").prop("checked");
    if (isChecked == false && isHeaderChecked)
        $("#checkall").prop('checked', isChecked);
    else {
        $('#dtdata tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkall").prop('checked', isChecked);
    }
}
function orderStatus() {
    let id = "";
    $("input:checkbox[name=CheckSingle]:checked").each(function () { id += $(this).val() + ","; });
    id = id.replace(/,(?=\s*$)/, ''); $("#checkAll").prop('checked', false);
    let status = $('#ddlOrderStatus').val();

    if (id == "") { swal('alert', 'Please select a Purchase order.', 'error'); return false; }
    if (status == "") { swal('alert', 'Please select status.', 'error'); return false; }

    swal.queue([{
        title: 'Alert!', confirmButtonText: 'Yes, Update it!', text: "Do you want to update your status?",
        showLoaderOnConfirm: true, showCancelButton: true, icon: "question",
        preConfirm: function () {
            return new Promise(function (resolve) {
                let obj = { Search: id, Status: status };
                $.get('/PurchaseOrder/UpdatePurchaseOrderStatus', obj)
                    .done(function (data) {
                        data = JSON.parse(data);
                        if (data[0].Response == "Success") { swal.insertQueueStep(data.message); PurchaseOrderGrid(); }
                        else { swal.insertQueueStep('something went wrong!'); }
                        resolve();
                    });
            });
        }
    }]);
}