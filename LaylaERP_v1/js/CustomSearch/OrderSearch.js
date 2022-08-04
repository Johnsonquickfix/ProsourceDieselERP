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
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto"
    }, function (start, end, label) {
        $('#txtDate').val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
        //let order_type = $('#hfOrderType').val();
        //$.when(GetOrderDetails()).done(function () { dataGridLoad(order_type); });
    });
    //$('#txtOrderDate').on('cancel.daterangepicker', function (ev, picker) {
    //    $(this).val(''); let order_type = $('#hfOrderType').val();
    //    $.when(GetOrderDetails()).done(function () { dataGridLoad(order_type); });
    //});
    $.when(getMasters()).done(function () { dataGridLoad() });
    $(document).on("click", "#btnSearch", function (t) {
        t.preventDefault(); dataGridLoad();
    });
    $(document).on("click", "#btnAddFilterRow", function (t) {
        t.preventDefault();
        let _html = '<div class="row">';
        _html += '    <div class="col-md-3">';
        _html += '        <div class="form-group">';
        _html += '            <select class="select2" id="ddlSearchField" placeholder="Search Field" style="width: 100%;">' + $("#ddlSearchField").clone() + '</select>';
        _html += '        </div>';
        _html += '    </div>';
        _html += '    <div class="col-md-3">';
        _html += '        <div class="form-group">';
        _html += '            <select class="form-control select2" id="ddlSearchBy" placeholder="Search By" style="width: 100%;">';
        _html += '                <option value="equal to">equal to</option>';
        _html += '                <option value="start with">start with</option>';
        _html += '                <option value="end with">end with</option>';
        _html += '                <option value="any where" selected="selected">any where</option>';
        _html += '            </select>';
        _html += '        </div>';
        _html += '    </div>';
        _html += '    <div class="col-md-3">';
        _html += '        <div class="form-group">';
        _html += '            <input id="txtSearchValue" class="form-control">';
        _html += '        </div>';
        _html += '    </div>';
        _html += '    <div class="col-md-3 filter-action">';
        _html += '        <button type="button" id="btnAddFilterRow" class="btn btn-danger"><i class="fa fa-plus"></i> Add Filter Row</button>';
        _html += '        <button type="button" id="btnSearch" class="btn btn-danger pull-right">Search</button>';
        _html += '    </div>';
        _html += '</div>';
        //$('#dynamic-filter').append(_html);
        //$("#ddlSearchField").select2();
        //let $myClone = $(".row-filter").html();
        ////$myClone.find("span").remove();
        ////$myClone.find(".select2").select2();
        ////$('#btnAddFilterRow,#btnSearch').remove();
        //$('#dynamic-filter').append('<div class="row row-filter">' + $myClone + '</div>');
        //$('span.select2').remove();
        //$('select.select2').removeAttr('data-select2-id'); $('select2').select2();
        ////$('select.select2').select2();
        ////$(".select2-dyn").select2();

        //var row = $(".row-filter");

        //row.find(".select2").each(function (index) { $(this).select2('destroy'); });

        //var newrow = row.clone();
        //$('#dynamic-filter').append(newrow);
        ////$("#table1").append(newrow);

        //$("select.select2").select2();


        let $myClone = $(".row-filter").clone();
        $myClone.removeClass("row-filter");
        $myClone.find(".select2").each(function (index, r) { console.log(index, r); $myClone.find("span").remove(); $(r).removeClass("select2-hidden-accessible"); });
        //$myClone.removeClass("row-filter");
        //$myClone.find("span").remove();
        //$myClone.find(".select2").select2();
        $('#dynamic-filter').append($myClone);
        $(".select2").select2();
    });
});
function getMasters() {
    $("#ddlStatus,#ddlPaymentType,#ddlSearchField,#ddlDisplayField").empty();
    $.ajax({
        url: "/customsearch/filtermasters", type: "Get", data: { strValue1: 'ORDER' },
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            data = JSON.parse(data);
            //Status
            $.each(data['Table'], function (i, row) { $("#ddlStatus").append('<option value="' + row.id + '">' + row.text + '</option>'); });

            //Payment Type
            $.each(data['Table1'], function (i, row) { $("#ddlPaymentType").append('<option value="' + row.id + '">' + row.text + '</option>'); });

            //Where Field
            $.each(data['Table2'], function (i, row) { $("#ddlSearchField").append('<option value="' + row.id + '" data-tb_type="' + row.tb_type + '" ' + (row.is_default ? 'selected' : '') + '>' + row.text + '</option>'); });

            //Where Field
            $.each(data['Table3'], function (i, row) { $("#ddlDisplayField").append('<option value="' + row.id + '" data-tb_type="' + row.tb_type + '" ' + (row.is_default ? 'selected' : '') + '>' + row.text + '</option>'); });
        },
        complete: function () { $("#loader").hide(); $(".multi-select2").fSelect(); },
        error: function (xhr, status, err) { $("#loader").hide(); }, async: false
    });
}
function dataGridLoad() {
    if ($.fn.DataTable.isDataTable('#dtordersearch')) {
        $('.box-body-table').empty().append('<table id="dtordersearch" class="table dataTable table-blue table-row-dashed no-footer text-propercase" width="100%"></table>');
    }


    let _columns = [];
    let _order_status = $("#ddlStatus").val().map(d => `'${d}'`).join(','), _order_payment = $("#ddlPaymentType").val().map(d => `'${d}'`).join(',');
    let _display_field = [], _where_field = [];
    $("#ddlDisplayField :selected").each(function (e, r) {
        _display_field.push({ strType: $(r).data('tb_type'), strKey: $(r).text(), strValue: $(r).val() });
        _columns.push({ data: $(r).text(), title: $(r).text(), sWidth: "10%" });
    });
    if (_order_payment != '') { _where_field.push({ strType: 'wp_postmeta', strKey: '_payment_method', strOperator: 'in', strValue: _order_payment }); }
    //if ($("#txtSearchValue").val() != '') { _where_field.push({ strType: $('#ddlSearchField :selected').data('tb_type'), strKey: $('#ddlSearchField').val(), strOperator: $('#ddlSearchBy').val(), strValue: $("#txtSearchValue").val() }); }
    $("#dynamic-filter .row").each(function (e, r) {
        if ($(r).find("#txtSearchValue").val() != '') {
            _where_field.push({ strType: $(r).find('#ddlSearchField :selected').data('tb_type'), strKey: $(r).find('#ddlSearchField').val(), strOperator: $(r).find('#ddlSearchBy').val(), strValue: $(r).find("#txtSearchValue").val() });
        }
    });
    let sd = null, ed = null;
    if ($('#txtDate').val() != '') {
        sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY'), ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    }
    let option = { flag: 'ORDER', start_date: sd, end_date: ed, order_status: _order_status, display_field: _display_field, where_field: _where_field };
    //console.log(option); return;
    //let cus_id = (parseInt($('#ddlUser').val()) || 0), order_id = (parseInt($('#txtOrderNo').val()) || 0);
    let table_oh = $('#dtordersearch').DataTable({
        searching: false, lengthChange: false, order: [[0, "desc"]], lengthMenu: [[10, 20, 50], [10, 20, 50]],
        destroy: true, bProcessing: true, responsive: true, bServerSide: true, bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
        //language: {
        //    lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
        //    infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        //},
        initComplete: function () {
            $('.dataTables_filter input').unbind();
            $('.dataTables_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_oh.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/customsearch/order-list",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            option.iDisplayStart = oSettings._iDisplayStart; option.iDisplayLength = oSettings._iDisplayLength;
            option.sEcho = oSettings.oAjaxData.sEcho; option.sSortDir_0 = oSettings.oAjaxData.sSortDir_0;
            //option.sSortColName = oSettings.oAjaxData.mDataProp_0;
            option.sSortColName = "[" + _columns[0].data + "]";
            console.log(option);
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "POST", url: sSource, data: option,
                success: function (data) {
                    data = JSON.parse(data); let _recordsTotal = data.length > 0 ? data[0].total_count : 0;
                    let dtOption = { sEcho: option.sEcho, recordsTotal: _recordsTotal, recordsFiltered: _recordsTotal, aaData: data };
                    return fnCallback(dtOption);
                }
            });
        },
        columns: _columns
    });
}