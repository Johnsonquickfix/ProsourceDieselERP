$(document).ready(function () {
    $("#loader").hide(); $(".select2").select2();
    $.when(getBudgets()).done(function () { BindData() });
    $(document).on("click", "#btnShowReport", function (t) {
        t.preventDefault(); BindData();
    });
});
function getBudgets() {
    $('#ddlBudget').empty().append('<option value="0">Please Select Budget</option>');
    $.ajax({
        url: "/budget/get-accountbudget", type: "Post",
        success: function (data) {
            data = JSON.parse(data);
            $.each(data, function (i, row) {
                $('#ddlBudget').append('<option value="' + row.id + '">' + row.text + '</option>');
            });

        }, async: false
    });
}
function formatCurrency(total) {
    var neg = false;
    if (total < 0) { neg = true; total = Math.abs(total); }
    return (neg ? "-$" : '$') + parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
}
function BindData() {
    $('#dtBudget').empty();
    let _header = '<thead>';
    _header += '    <tr role="row">';
    _header += '        <th class="whitespace" style="width: 220px;">ACCOUNTS</th>';
    _header += '    </tr>';
    _header += '</thead>';
    _header += '<tbody>';
    _header += '</tbody>';
    $('#dtBudget').empty().append(_header);
    let _row = '', _sum = 0;
    let option = { budget_id: parseInt($('#ddlBudget').val()) || 0, fiscalyear_id: 0, interval: 'M', data_year: 0, flag: 'EDIT' };

    //console.log(option);
    $.ajax({
        dataType: 'json', type: "POST", url: '/budget/get-accountbudget', data: option,
        success: function (data) {
            data = JSON.parse(data);
            if (parseInt(data[0].budget_id) > 0) {
                if ($('#txtBudgetName').data('qt') == 'c') { $('#txtBudgetName').val(data[0].budget_name + ' (Copy)'); }
                else $('#txtBudgetName').val(data[0].budget_name);

                _header = '<th class="whitespace" style="width: 220px;">ACCOUNTS</th>';
                if (data[0].interval == 'M') {
                    _header += '<th class="text-right" style="width: 7%;">JAN</th>';
                    _header += '<th class="text-right" style="width: 7%;">FEB</th>';
                    _header += '<th class="text-right" style="width: 7%;">MAR</th>';
                    _header += '<th class="text-right" style="width: 7%;">APR</th>';
                    _header += '<th class="text-right" style="width: 7%;">MAY</th>';
                    _header += '<th class="text-right" style="width: 7%;">JUN</th>';
                    _header += '<th class="text-right" style="width: 7%;">JUL</th>';
                    _header += '<th class="text-right" style="width: 7%;">AUG</th>';
                    _header += '<th class="text-right" style="width: 7%;">SEP</th>';
                    _header += '<th class="text-right" style="width: 7%;">OCT</th>';
                    _header += '<th class="text-right" style="width: 7%;">NOV</th>';
                    _header += '<th class="text-right" style="width: 7%;">DEC</th>';
                    _header += '<th class="text-right" style="width: 7%;">TOTAL</th>';
                }
                else if (data[0].interval == 'Q') {
                    _header += '<th class="text-right" style="width: 15%;">JAN-MAR</th>';
                    _header += '<th class="text-right" style="width: 15%;">APR-JUN</th>';
                    _header += '<th class="text-right" style="width: 15%;">JUL-SEP</th>';
                    _header += '<th class="text-right" style="width: 15%;">OCT-DEC</th>';
                    _header += '<th class="text-right" style="width: 15%;">TOTAL</th>';
                }
                else if (data[0].interval == 'Y') {
                    _header += '<th class="whitespace text-right" style="width: 75%;">JAN-DEC</th>';
                }
                $('#dtBudget thead tr').empty().append(_header);
            }
            console.log(_header);
            $.each(data, function (i, row) {
                _row = '<tr data-id="' + row.account_number + '" data-bdid="' + row.budget_details_id + '">';
                if (row.level == 0) {
                    _row += '    <td class="" style="width: 220px;background:#D5DBDB;"><b>' + row.account_name + '</b></td>';
                    if (row.interval == 'M') _row += '<td style="background:#D5DBDB;"></td>'.repeat(13);
                    else if (row.interval == 'Q') _row += '<td style="background:#D5DBDB;"></td>'.repeat(5);
                    else if (row.interval == 'Y') _row += '<td style="background:#D5DBDB;"></td>';
                }
                else if (row.level > 0) {
                    _row += '    <td class="" style="width: 220px;padding-left: ' + (row.level * 20) + 'px !important;">' + row.account_name + '</td>';

                    if (row.interval == 'M') {
                        _sum = parseFloat(row.jan_amt) + parseFloat(row.feb_amt) + parseFloat(row.mar_amt) + parseFloat(row.apr_amt) + parseFloat(row.may_amt) + parseFloat(row.jun_amt) + parseFloat(row.jul_amt) + parseFloat(row.aug_amt) + parseFloat(row.sep_amt) + parseFloat(row.oct_amt) + parseFloat(row.nov_amt) + parseFloat(row.dec_amt);
                        _row += '    <td class="text-right">' + formatCurrency(row.jan_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(row.feb_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(row.mar_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(row.apr_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(row.may_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(row.jun_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(row.jul_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(row.aug_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(row.sep_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(row.oct_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(row.nov_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(row.dec_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(_sum) + '</td>';
                    }
                    else if (row.interval == 'Q') {
                        _sum = parseFloat(row.jan_amt) + parseFloat(row.apr_amt) + parseFloat(row.jul_amt) + parseFloat(row.oct_amt);
                        _row += '    <td class="text-right">' + formatCurrency(row.jan_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(row.apr_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(row.jul_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(row.oct_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(_sum) + '</td>';
                    }
                    else if (row.interval == 'Y') {
                        _sum = parseFloat(row.jan_amt) || 0;
                        _row += '    <td class="text-right">' + formatCurrency(_sum) + '</td>';
                    }
                }
                _row += '</tr>';
                $('#dtBudget tbody').append(_row);
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); },
        complete: function () { $("#loader").hide(); }, async: true
    });
    return;
}