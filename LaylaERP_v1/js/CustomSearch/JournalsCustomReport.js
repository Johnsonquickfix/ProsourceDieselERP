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
    });
    $.when(getMasters()).done(function () { dataGridLoad() });
    $(document).on("click", "#btnSearch", function (t) {
        t.preventDefault(); dataGridLoad();
    });
    $(document).on("click", "#btnAddFilterRow", function (t) {
        t.preventDefault();
        let _html = '<div class="row">';
        _html += '    <div class="col-md-3">';
        _html += '        <div class="form-group">';
        _html += '            <select class="form-control SearchField" id="ddlSearchField_1" placeholder="Search Field" style="width: 100%;">' + $("#ddlSearchField").html() + '</select>';
        _html += '        </div>';
        _html += '    </div>';
        _html += '    <div class="col-md-3">';
        _html += '        <div class="form-group">';
        _html += '            <select class="form-control SearchBy" id="ddlSearchBy_1" placeholder="Search By" style="width: 100%;">' + $("#ddlSearchBy").html() + '</select>';
        _html += '        </div>';
        _html += '    </div>';
        _html += '    <div class="col-md-3">';
        _html += '        <div class="form-group">';
        _html += '            <input id="txtSearchValue" class="form-control">';
        _html += '        </div>';
        _html += '    </div>';
        _html += '    <div class="col-md-3 filter-action">';
        _html += '        <button type="button" id="btnAddFilterRow" class="btn btn-danger"  title="Add filter row." data-placement="top" data-toggle="tooltip"><i class="fa fa-plus"></i></button>';
        _html += '        <button type="button" id="btnRemoveFilterRow" class="btn btn-danger" title="Delete filter row." data-placement="top" data-toggle="tooltip"><i class="fa fa-trash"></i></button>';
        _html += '    </div>';
        _html += '</div>';
        $('#dynamic-filter').append(_html);
    });
    $(document).on("click", "#btnRemoveFilterRow", function (t) {
        t.preventDefault(); $(this).closest(".row").remove();
    });
    $(document).on("click", "#btnExportList", function (t) { t.preventDefault(); ExportList(); });
});
function getMasters() {
    $("#ddlStatus,#ddlSearchField,#ddlDisplayField").empty();
    $('#ddlAccount').append('<option value="">Please select account</option>');
    $.ajax({
        url: "/customsearch/filtermasters", type: "Get", data: { strValue1: 'JOURNAL' },
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            data = JSON.parse(data);
            //Status
            $.each(data['Table'], function (i, row) { $("#ddlStatus").append('<option value="' + row.id + '">' + row.text + '</option>'); });

            //Payment Type
            $.each(data['Table1'], function (i, row) { $("#ddlAccount").append('<option value="' + row.id + '">' + row.text + '</option>'); });

            //Where Field
            $.each(data['Table2'], function (i, row) { $("#ddlSearchField").append('<option value="' + row.id + '" data-tb_type="' + row.tb_type + '" ' + (row.is_default ? 'selected' : '') + '>' + row.text + '</option>'); });

            //Where Field
            $.each(data['Table3'], function (i, row) { $("#ddlDisplayField").append('<option value="' + row.id + '" data-tb_type="' + row.tb_type + '" data-datatype="' + row.datatype + '" ' + (row.is_default ? 'selected' : '') + '>' + row.text + '</option>'); });
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
    let _order_status = $("#ddlStatus").val().map(d => `'${d}'`).join(','), _order_payment = $("#ddlAccount").val();
    let _display_field = [], _where_field = [];
    $("#ddlDisplayField :selected").each(function (e, r) {
        _display_field.push({ strType: $(r).data('tb_type'), strKey: $(r).text(), strValue: $(r).val() });
        let _className = $(r).data('datatype') == "float" ? 'text-right' : 'text-left';
        _columns.push({
            data: $(r).text(), title: $(r).text(), sWidth: "10%", className: _className, render: function (data, type, row) {
                if ($(r).data('datatype') == "datetime") { return moment(data).format('MM/DD/YYYY hh:mmA'); }
                else if ($(r).data('datatype') == "float") { return $.fn.dataTable.render.number(',', '.', 2, '$').display(data); }
                else return data;
            }
        });
    });
    if (_order_payment != '') { _where_field.push({ strType: 'erp_accounting_bookkeeping', strKey: 'inv_complete', strOperator: 'in', strValue: _order_payment }); }
    //if ($("#txtSearchValue").val() != '') { _where_field.push({ strType: $('#ddlSearchField :selected').data('tb_type'), strKey: $('#ddlSearchField').val(), strOperator: $('#ddlSearchBy').val(), strValue: $("#txtSearchValue").val() }); }
    $("#dynamic-filter .row").each(function (e, r) {
        if ($(r).find("#txtSearchValue").val() != '') {
            _where_field.push({ strType: $(r).find('.SearchField :selected').data('tb_type'), strKey: $(r).find('.SearchField').val(), strOperator: $(r).find('.SearchBy').val(), strValue: $(r).find("#txtSearchValue").val() });
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
        sAjaxSource: "/customsearch/journals-list",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            option.iDisplayStart = oSettings._iDisplayStart; option.iDisplayLength = oSettings._iDisplayLength;
            option.sEcho = oSettings.oAjaxData.sEcho; option.sSortDir_0 = oSettings.oAjaxData.sSortDir_0;
            //option.sSortColName = oSettings.oAjaxData.mDataProp_0;
            option.sSortColName = "[" + _columns[0].data + "]";
            //console.log(option);
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
function ExportList() {
    let _columns = [];
    let _order_status = $("#ddlStatus").val().map(d => `'${d}'`).join(','), _order_payment = $("#ddlAccount").val();
    let _display_field = [], _where_field = [];
    $("#ddlDisplayField :selected").each(function (e, r) {
        _display_field.push({ strType: $(r).data('tb_type'), strKey: $(r).text(), strValue: $(r).val() });
        //_columns.push({ data: $(r).text(), title: $(r).text(), sWidth: "10%", render: function (id, type, full, meta) { return (moment(id)._isValid) ? moment(id).format('MM/DD/YYYY') : id; } });
        _columns.push({ data: $(r).text(), title: $(r).text(), sWidth: "10%" });
    });
    if (_order_payment != '') { _where_field.push({ strType: 'erp_accounting_bookkeeping', strKey: 'inv_complete', strOperator: 'in', strValue: _order_payment }); }
    //if ($("#txtSearchValue").val() != '') { _where_field.push({ strType: $('#ddlSearchField :selected').data('tb_type'), strKey: $('#ddlSearchField').val(), strOperator: $('#ddlSearchBy').val(), strValue: $("#txtSearchValue").val() }); }
    $("#dynamic-filter .row").each(function (e, r) {
        if ($(r).find("#txtSearchValue").val() != '') {
            _where_field.push({ strType: $(r).find('.SearchField :selected').data('tb_type'), strKey: $(r).find('.SearchField').val(), strOperator: $(r).find('.SearchBy').val(), strValue: $(r).find("#txtSearchValue").val() });
        }
    });
    let sd = null, ed = null;
    if ($('#txtDate').val() != '') {
        sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY'), ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    }
    let table = $('#dtordersearch').DataTable().order();
    let option = { flag: 'ORDER', start_date: sd, end_date: ed, order_status: _order_status, display_field: _display_field, where_field: _where_field };
    option.iDisplayStart = 0; option.iDisplayLength = 1000000; option.sSortDir_0 = table[0][1]; option.sSortColName = "[" + _columns[table[0][0]].data + "]";
    //console.log(option); return;
    $("#loader").show();
    setTimeout(function () { $("#loader").hide(); }, 2000);
    postForm(option, '/customsearch/journals-list-export');
}

/**
     * Original code found here: https://github.com/mgalante/jquery.redirect/blob/master/jquery.redirect.js
     * I just simplified it for my own taste.
     */
function postForm(parameters, url) {

    // generally we post the form with a blank action attribute
    if ('undefined' === typeof url) { url = ''; }


    //----------------------------------------
    // SOME HELPER FUNCTIONS
    //----------------------------------------
    var getForm = function (url, values) {
        values = removeNulls(values);
        var form = $('<form>').attr("method", 'POST').attr("action", url);
        iterateValues(values, [], form, null);
        return form;
    };

    var removeNulls = function (values) {
        var propNames = Object.getOwnPropertyNames(values);
        for (var i = 0; i < propNames.length; i++) {
            var propName = propNames[i];
            if (values[propName] === null || values[propName] === undefined) {
                delete values[propName];
            } else if (typeof values[propName] === 'object') {
                values[propName] = removeNulls(values[propName]);
            } else if (values[propName].length < 1) {
                delete values[propName];
            }
        }
        return values;
    };

    var iterateValues = function (values, parent, form, isArray) {
        var i, iterateParent = [];
        Object.keys(values).forEach(function (i) {
            if (typeof values[i] === "object") {
                iterateParent = parent.slice();
                iterateParent.push(i);
                iterateValues(values[i], iterateParent, form, Array.isArray(values[i]));
            } else {
                form.append(getInput(i, values[i], parent, isArray));
            }
        });
    };

    var getInput = function (name, value, parent, array) {
        var parentString;
        if (parent.length > 0) {
            parentString = parent[0];
            var i;
            for (i = 1; i < parent.length; i += 1) {
                parentString += "[" + parent[i] + "]";
            }

            if (array) {
                name = parentString + "[" + name + "]";
            } else {
                name = parentString + "[" + name + "]";
            }
        }

        return $("<input>").attr("type", "hidden").attr("name", name).attr("value", value);
    };


    //----------------------------------------
    // NOW THE SYNOPSIS
    //----------------------------------------
    var generatedForm = getForm(url, parameters);

    $('body').append(generatedForm);
    generatedForm.submit();
    generatedForm.remove();
}