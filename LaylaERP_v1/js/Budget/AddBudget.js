$(document).ready(function () {
    $("#loader").hide(); $(".select2").select2();
    $.when(getfinaceyear()).done(function () { BindData() });
    $(document).on("change", "#ddlInterval,#ddlPrefillData", function (t) {
        t.preventDefault(); BindData();
    });
    $(document).on("change", "#dtBudget .rowCalulate", function (t) {
        t.preventDefault();
        RowCalculate(this);
    });
});
function getfinaceyear() {
    $('#ddlfinaceyear').empty().append('<option value="0">Please Select Financial Year</option>');
    $('#ddlPrefillData').empty().append('<option value="0">No</option>');
    $.ajax({
        url: "/budget/get-fiscalyear", type: "Get",
        success: function (data) {
            data = JSON.parse(data);

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
    let _interval = $('#ddlInterval').val();
    $('#dtBudget').empty();
    let _header = '<thead>';
    _header += '    <tr role="row">';
    _header += '        <th class="whitespace" style="width: 220px;">ACCOUNTS</th>';
    _header += '    </tr>';
    _header += '</thead>';
    _header += '<tbody>';
    _header += '</tbody>';
    $('#dtBudget').append(_header);
    if (_interval == 'M') {
        _header = '        <th style="width: 7%;">JAN</th>';
        _header += '        <th style="width: 7%;">FEB</th>';
        _header += '        <th style="width: 7%;">MAR</th>';
        _header += '        <th style="width: 7%;">APR</th>';
        _header += '        <th style="width: 7%;">MAY</th>';
        _header += '        <th style="width: 7%;">JUN</th>';
        _header += '        <th style="width: 7%;">JUL</th>';
        _header += '        <th style="width: 7%;">AUG</th>';
        _header += '        <th style="width: 7%;">SEP</th>';
        _header += '        <th style="width: 7%;">OCT</th>';
        _header += '        <th style="width: 7%;">NOV</th>';
        _header += '        <th style="width: 7%;">DEC</th>';
        _header += '        <th class="text-right" style="width: 7%;">TOTAL</th>';
        $('#dtBudget thead tr').append(_header);
    }
    else if (_interval == 'Q') {
        _header = '        <th class="whitespace" style="width: 15%;">JAN-MAR</th>';
        _header += '        <th class="whitespace" style="width: 15%;">APR-JUN</th>';
        _header += '        <th class="whitespace" style="width: 15%;">JUL-SEP</th>';
        _header += '        <th class="whitespace" style="width: 15%;">OCT-DEC</th>';
        _header += '        <th class="whitespace text-right" style="width: 15%;">TOTAL</th>';
        $('#dtBudget thead tr').append(_header);
    }
    else if (_interval == 'Y') {
        _header = '        <th class="whitespace text-right" style="width: 75%;">JAN-DEC</th>';
        $('#dtBudget thead tr').append(_header);
    }
    let _row = '', _sum = 0;
    let option = { fiscalyear_id: 0, interval: _interval, data_year: parseInt($('#ddlPrefillData').val()) || 0 };
    $.ajax({
        dataType: 'json', type: "POST", url: '/budget/get-accountbudget', data: option,
        success: function (data) {
            data = JSON.parse(data);
            //let _list = listToTree(data);
            //console.log(_list);
            $.each(data, function (i, row) {
                _row = '<tr>';
                if (row.level == 0) {
                    _row += '    <td class="" style="width: 220px;background:#D5DBDB;"><b>' + row.account_name + '</b></td>';
                    if (_interval == 'M') _row += '<td style="background:#D5DBDB;"></td>'.repeat(13);
                    else if (_interval == 'Q') _row += '<td style="background:#D5DBDB;"></td>'.repeat(5);
                    else if (_interval == 'Y') _row += '<td style="background:#D5DBDB;"></td>';
                }
                else if (row.level > 0) {
                    _row += '    <td class="" style="width: 220px;padding-left: ' + (row.level * 20) + 'px !important;">' + row.account_name + '</td>';

                    if (_interval == 'M') {
                        _sum = parseFloat(row.JAN) + parseFloat(row.FEB) + parseFloat(row.MAR) + parseFloat(row.APR) + parseFloat(row.MAY) + parseFloat(row.JUN) + parseFloat(row.JUL) + parseFloat(row.AUG) + parseFloat(row.SEP) + parseFloat(row.OCT) + parseFloat(row.NOV) + parseFloat(row.DEC);
                        _row += '    <td><input autocomplete="off" class="form-control number rowCalulate" type="number" id="txt_amt" value="' + row.JAN + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number rowCalulate" type="number" id="txt_amt" value="' + row.FEB + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number rowCalulate" type="number" id="txt_amt" value="' + row.MAR + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number rowCalulate" type="number" id="txt_amt" value="' + row.APR + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number rowCalulate" type="number" id="txt_amt" value="' + row.MAY + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number rowCalulate" type="number" id="txt_amt" value="' + row.JUN + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number rowCalulate" type="number" id="txt_amt" value="' + row.JUL + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number rowCalulate" type="number" id="txt_amt" value="' + row.AUG + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number rowCalulate" type="number" id="txt_amt" value="' + row.SEP + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number rowCalulate" type="number" id="txt_amt" value="' + row.OCT + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number rowCalulate" type="number" id="txt_amt" value="' + row.NOV + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number rowCalulate" type="number" id="txt_amt" value="' + row.DEC + '" name="txt_amt"></td>';
                        _row += '    <td class="text-right rowTotal">' + _sum.toFixed(2) + '</td>';
                    }
                    else if (_interval == 'Q') {
                        _sum = parseFloat(row.quarter1) + parseFloat(row.quarter2) + parseFloat(row.quarter3) + parseFloat(row.quarter4);
                        _row += '    <td><input autocomplete="off" class="form-control number rowCalulate" type="number" id="txt_amt" value="' + row.quarter1 + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number rowCalulate" type="number" id="txt_amt" value="' + row.quarter2 + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number rowCalulate" type="number" id="txt_amt" value="' + row.quarter3 + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number rowCalulate" type="number" id="txt_amt" value="' + row.quarter4 + '" name="txt_amt"></td>';
                        _row += '    <td class="text-right rowTotal">' + _sum.toFixed(2) + '</td>';
                    }
                    else if (_interval == 'Y') {
                        _row += '    <td class="d-flex justify-content-end"><input autocomplete="off" class="form-control number rowCalulateYear" type="number" id="txt_amt" value="' + row.amount + '" name="txt_amt"></td>';
                    }
                }
                _row += '</tr>';
                $('#dtBudget tbody').append(_row);
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); },
        complete: function () { $("#loader").hide(); }
    });
    return;
}

function RowCalculate(ele) {
    console.log($(ele));
    let $row = $(ele).closest('tr');
    let sum = 0;
    $row.find(".rowCalulate").each(function () {
        sum += parseFloat(this.value) || 0;
    });
    $row.find(".rowTotal").text(sum.toFixed(2));
}


function listToTree(arr) {
    let map = {}, node, res = [], i;
    for (i = 0; i < arr.length; i += 1) {
        map[arr[i].rowid] = i;
        arr[i].children = [];
    };
    for (i = 0; i < arr.length; i += 1) {
        node = arr[i];
        if (node.account_parent !== 0) {
            arr[map[node.account_parent]].children.push(node);
        }
        else { res.push(node); };
    };
    return res;
};


function BindData_old() {
    if ($.fn.DataTable.isDataTable('#dtBudget')) {
        $('.box-body-table').empty().append('<table id="dtBudget" class="table dataTable table-blue table-row-dashed no-footer text-propercase" width="100%"></table>');
    }

    let _columns = [], _interval = $('#ddlInterval').val();
    _columns.push(
        {
            data: 'account_name', title: 'ACCOUNTS', sWidth: '150', className: 'whitespace',
            render: function (data, type, row) {
                if (row.level == 0) { return '<b>' + data + '</b>'; }
                else if (row.level > 0) { return ' '.repeat(row.level * 5) + data; }
                else return data;
            }
        }
    );
    if (_interval == 'M') {
        _columns.push(
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
    }
    else if (_interval == 'Q') {
        _columns.push(
            { data: 'JAN-MAR', title: 'JAN-MAR', sWidth: '10%', className: '' },
            { data: 'APR-JUN', title: 'APR-JUN', sWidth: '10%', className: '' },
            { data: 'JUL-SEP', title: 'JUL-SEP', sWidth: '10%', className: '' },
            { data: 'OCT-DEC', title: 'OCT-DEC', sWidth: '10%', className: '' },
            { data: 'account_number', title: 'TOTAL', sWidth: '10%', className: 'text-right', render: function (data, type, row) { return ''; } }
        );
    }
    else if (_interval == 'Y') {
        _columns.push(
            { data: 'JAN-DEC', title: 'JAN-DEC', sWidth: '50%', className: 'text-right' }
        );
    }
    let option = { fiscalyear_id: 0, interval: _interval, data_year: parseInt($('#ddlPrefillData').val()) || 0 };
    //console.log(option, _columns); //return;
    $('#dtBudget').DataTable({
        searching: false, lengthChange: false, paging: false, info: false, sort: false,
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
                    data = JSON.parse(data);
                    let dtOption = { sEcho: option.sEcho, recordsTotal: 0, recordsFiltered: 0, aaData: data };
                    return fnCallback(dtOption);
                }
            });
        },
        columns: _columns
    });
}