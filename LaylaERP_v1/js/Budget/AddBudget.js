$(document).ready(function () {
    $("#loader").hide(); $(".select2").select2();
    $.when(getfinaceyear()).done(function () { BindData() });
});
function getfinaceyear() {
    $('#ddlfinaceyear').empty().append('<option value="0">Please Select Financial Year</option>');
    $('#ddlPrefillData').empty().append('<option value="0">No</option>');
    $.ajax({
        url: "/budget/get-fiscalyear", type: "Get",
        success: function (data) {
            data = JSON.parse(data); console.log(data)

            $.each(data['Table'], function (i, row) {
                $('#ddlfinaceyear').append('<option value="' + row.id + '" ' + (row.selected ? 'selected' : '') + '>' + row.text + '</option>');
            });

            $.each(data['Table1'], function (i, row) {
                $('#ddlPrefillData').append('<option value="' + row.id + '">' + row.text + '</option>');
            });
        }, async: false
    });
}
function BindData() {
    let _columns = [];
    _columns.push(
        //{ data: 'account_number', title: 'A/c No.', sWidth: '10%', className: '' },
        {
            data: 'account_name', title: 'ACCOUNTS', sWidth: '150', className: 'whitespace',
            render: function (data, type, row) {
                if (row.level == 0) { return '<b>' + data + '</b>'; }
                else if (row.level > 0) { return ' '.repeat(row.level * 5) + data; }
                else return data;
            }
        },
        { data: 'JAN', title: 'JAN', sWidth: '7%', className: '' },
        { data: 'FEB', title: 'FEB', sWidth: '7%', className: '' },
        { data: 'MAR', title: 'MAR', sWidth: '7%', className: '' },
        { data: 'APR', title: 'APR', sWidth: '7%', className: '' },
        { data: 'MAY', title: 'MAY', sWidth: '7%', className: '' },
        { data: 'JUN', title: 'JUN', sWidth: '7%', className: '' },
        { data: 'JUL', title: 'JUL', sWidth: '7%', className: '' },
        { data: 'AUG', title: 'AUG', sWidth: '7%', className: '' },
        { data: 'SEP', title: 'SEP', sWidth: '7%', className: '' },
        { data: 'OCT', title: 'OCT', sWidth: '7%', className: '' },
        { data: 'NOV', title: 'NOV', sWidth: '7%', className: '' },
        { data: 'DEC', title: 'DEC', sWidth: '7%', className: '' },
        { data: 'account_number', title: 'TOTAL', sWidth: '7%', className: 'text-right', render: function (data, type, row) { return ''; } }
    );

    //let _order_status = $("#ddlStatus").val().map(d => `'${d}'`).join(','), _order_payment = $("#ddlPaymentType").val().map(d => `'${d}'`).join(',');
    //let _display_field = [], _where_field = [];
    //$("#ddlDisplayField :selected").each(function (e, r) {
    //    _display_field.push({ strType: $(r).data('tb_type'), strKey: $(r).text(), strValue: $(r).val() });
    //    let _className = $(r).data('datatype') == "float" ? 'text-right' : 'text-left';
    //    _columns.push({
    //        data: $(r).text(), title: $(r).text(), sWidth: "10%", className: _className, render: function (data, type, row) {
    //            if ($(r).data('datatype') == "datetime") { return moment(data).format('MM/DD/YYYY hh:mmA'); }
    //            else if ($(r).data('datatype') == "float") { return $.fn.dataTable.render.number(',', '.', 2, '$').display(data); }
    //            else return data;
    //        }
    //    });
    //});
    //if (_order_payment != '') { _where_field.push({ strType: 'wp_postmeta', strKey: '_payment_method', strOperator: 'in', strValue: _order_payment }); }
    ////if ($("#txtSearchValue").val() != '') { _where_field.push({ strType: $('#ddlSearchField :selected').data('tb_type'), strKey: $('#ddlSearchField').val(), strOperator: $('#ddlSearchBy').val(), strValue: $("#txtSearchValue").val() }); }
    //$("#dynamic-filter .row").each(function (e, r) {
    //    if ($(r).find("#txtSearchValue").val() != '') {
    //        _where_field.push({ strType: $(r).find('.SearchField :selected').data('tb_type'), strKey: $(r).find('.SearchField').val(), strOperator: $(r).find('.SearchBy').val(), strValue: $(r).find("#txtSearchValue").val() });
    //    }
    //});
    //let sd = null, ed = null;
    //if ($('#txtDate').val() != '') {
    //    sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY'), ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    //}
    let option = { fiscalyear_id: 0, interval: 'M' };
    //console.log(option); return;
    let table_oh = $('#dtBudget').DataTable({
        searching: false, lengthChange: false, paging: false, info: false, targets: 'no-sort', sort: false, order: [],
        destroy: true, bProcessing: true, responsive: true, bServerSide: true, bAutoWidth: false, scrollX: true, //scrollY: ($(window).height() - 215),
        //language: {
        //    lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
        //    infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        //},
        //initComplete: function () {
        //    $('.dataTables_filter input').unbind();
        //    $('.dataTables_filter input').bind('keyup', function (e) {
        //        var code = e.keyCode || e.which;
        //        if (code == 13) { table_oh.search(this.value).draw(); }
        //    });
        //},
        sAjaxSource: "/budget/get-accountbudget",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            //option.iDisplayStart = oSettings._iDisplayStart; option.iDisplayLength = oSettings._iDisplayLength;
            //option.sEcho = oSettings.oAjaxData.sEcho; option.sSortDir_0 = oSettings.oAjaxData.sSortDir_0;
            //option.sSortColName = "[" + oSettings.aoColumns[oSettings.aaSorting[0][0]].data + "]";
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