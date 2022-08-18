$(document).ready(function () {
    $("#loader").hide(); $(".select2").select2();
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
        LoadGrid();
    });
    //$('#txtDate').val('');
    $('#txtDate').on('cancel.daterangepicker', function (ev, picker) { $(this).val(''); LoadGrid(); });
    $.when(LoadGrid()).done(function () { });
    $(document).on("click", "#btnSplitOrder", function (t) { t.preventDefault(); CreateSplitOrder(); });
});
function LoadGrid() {
    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY'), ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };
    let table = $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": [0] }], order: [[1, "desc"]], destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, scrollX: true, scrollY: 320, //($(window).height() - 215),
        responsive: true, lengthMenu: [[10, 20, 50, 100, 150], [10, 20, 50, 100, 150]],
        language: {
            lengthMenu: "_MENU_ per page <a id=\"btnSplitOrder\" class=\"btn btn-primary button\">Split Order</button>", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('.dataTables_filter input').unbind();
            $('.dataTables_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/ship/splitorders-list",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                success: function (data) {
                    data = JSON.parse(data); let _records = data.length > 0 ? data[0].total_records : 0;
                    let dtOption = { sEcho: data.sEcho, recordsTotal: _records, recordsFiltered: _records, aaData: data };
                    console.log(dtOption);
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            {
                data: 'id', sWidth: "5%", title: '<input type="checkbox" name="checkall" id="checkall" onClick="CheckAll();"><label></label>', className: 'text-left', render: function (id, type, full, meta) {
                    if (full.split_id > 0) return '';
                    else if (full.split_id <= 0 && full.post_status == 'wc-processing') return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck(this);" value="' + id + '"><label></label>';
                    else return '';
                }
            },
            { data: 'id', sWidth: "10%", title: 'Order No', render: function (id, type, full, meta) { return '#' + id; } },
            { data: 'post_date', title: 'Order Date', sWidth: "10%", render: function (id, type, full, meta) { return moment(id).format('MM/DD/YYYY hh:mm A') } },
            { data: 'master_desc', title: 'Status', sWidth: "10%" },
            {
                data: 'order_name', title: 'Order', sWidth: "20%", render: function (id, type, full, meta) {
                    if (full.order_name == null) return ''; else return id.split(/,[ ]{0,}/).join('</br>');
                }
            },
            {
                data: 'item_name', title: 'Order Items', sWidth: "45%", render: function (id, type, full, meta) {
                    if (full.item_name == null) return ''; else return id.split(/;[ ]{0,}/).join('</br>');
                }
            }
        ]
    });
}

function CheckAll() {
    var isChecked = $('#checkall').prop("checked");
    $('#dtdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
}
function Singlecheck(chk) {
    var isChecked = $(chk).prop("checked"), isHeaderChecked = $("#checkall").prop("checked");
    if (isChecked == false && isHeaderChecked) $("#checkall").prop('checked', isChecked);
    else {
        $('#dtdata tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false) isChecked = false;
        });
        $("#checkall").prop('checked', isChecked);
    }
}

function CreateSplitOrder() {
    let _json = [];
    $("input:checkbox[name=CheckSingle]:checked").each(function () { _json.push({ order_id: parseInt($(this).val()) || 0 }); });
    //id = id.replace(/,(?=\s*$)/, '');
    $("#checkAll").prop('checked', false);
    if (_json.length <= 0) { swal('alert', 'Please select a order', 'error'); }
    else {
        swal.queue([{
            title: 'Alert!', confirmButtonText: 'Yes, Update it!', text: "Do you want to create split order?",
            showLoaderOnConfirm: true, showCancelButton: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    let obj = { strValue1: JSON.stringify(_json) }
                    $.post('/ship/splitorders-create', obj)
                        .done(function (data) {
                            data = JSON.parse(data);
                            if (data[0].response == 'success') {
                                swal.insertQueueStep('Split order successfully created.');
                                $('#dtdata').DataTable().ajax.reload(null, false);
                                //GetOrderDetails(); let order_type = $('#hfOrderType').val(); dataGridLoad(order_type, true);
                            }
                            else { swal.insertQueueStep('something went wrong!'); }
                            resolve();
                        })
                })
            }
        }]);
    }
}