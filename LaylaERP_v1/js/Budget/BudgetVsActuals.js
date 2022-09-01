$(document).ready(function () {
    $("#loader").hide(); $(".select2").select2();
    $.when(getBudgets()).done(function () { BindData() });
    $(document).on("click", "#btnShowReport", function (t) {
        t.preventDefault(); BindData();
    });
    $(document).on("click", "#btnPrint", function (t) {
        t.preventDefault(); printDiv();
    });
    $(document).on("click", "#btnExcel", function (t) {
        t.preventDefault(); exportExcel();
    });
    $(document).on("click", "#btnPdf", function (t) {
        t.preventDefault(); exportPdf();
    });
});
function getBudgets() {
    $('#ddlBudget').empty().append('<option value="0">Please Select Budget</option>');
    $.ajax({
        url: "/budget/get-accountbudget", type: "Post",
        success: function (data) {
            data = JSON.parse(data);
            $.each(data, function (i, row) {
                $('#ddlBudget').append('<option value="' + row.id + '" data-interval="' + row.interval + '" data-sdate="' + row.date_start + '" data-edate="' + row.date_end + '">' + row.text + '</option>');
            });

        }, async: false
    });
}
function formatNumber(total) {
    return parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
}
function formatCurrency(total) {
    var neg = false;
    if (total < 0) { neg = true; total = Math.abs(total); }
    return (neg ? "-$" : '$') + parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
}
function BindData() {
    $('#dtBudget').empty();
    let _header = '<thead></thead><tbody></tbody>', _header1 = '';
    $('#dtBudget').empty().append(_header);
    let _row = '', _sum_act = 0, _sum = 0, _interval = 'M', _sDate = moment();
    let option = { budget_id: parseInt($('#ddlBudget').val()) || 0, fiscalyear_id: 0, interval: 'M', data_year: 0, flag: 'BVA' };
    if (option.budget_id > 0) {
        $('.rpt_title').text('Budget vs. Actuals : ' + $("#ddlBudget option:selected").text());
        _interval = $("#ddlBudget option:selected").data('interval'); _sDate = $("#ddlBudget option:selected").data('sdate');
        $('.reportPeriod').text(moment(_sDate).format('MMMM') + ' - ' + moment($("#ddlBudget option:selected").data('edate')).format('MMMM YYYY'));
    }
    else $('.rpt_title').text('Budget vs. Actuals');

    _header = '<tr>', _header1 = '<tr>';
    _header += '<th rowspan="2" style="min-width: 180px;">ACCOUNTS</th>';
    if (_interval == 'M') {
        _header += '<th class="text-center" style="width: 7%;" colspan="4">JAN ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-center" style="width: 7%;" colspan="4">FEB ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-center" style="width: 7%;" colspan="4">MAR ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-center" style="width: 7%;" colspan="4">APR ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-center" style="width: 7%;" colspan="4">MAY ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-center" style="width: 7%;" colspan="4">JUN ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-center" style="width: 7%;" colspan="4">JUL ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-center" style="width: 7%;" colspan="4">AUG ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-center" style="width: 7%;" colspan="4">SEP ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-center" style="width: 7%;" colspan="4">OCT ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-center" style="width: 7%;" colspan="4">NOV ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-center" style="width: 7%;" colspan="4">DEC ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-center" style="width: 7%;" colspan="4">TOTAL</th>';
        _header1 += '<th class="text-right" style="min-width: 75px;">Actual</th><th class="text-right" style="min-width: 75px;">Budget</th><th class="text-right" style="min-width: 75px;">over Budget</th><th class="text-right" style="min-width: 75px;">% of Budget</th>'.repeat(13);
    }
    else if (_interval == 'Q') {
        _header += '<th class="text-center" style="width: 15%;" colspan="4">JAN-MAR ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-center" style="width: 15%;" colspan="4">APR-JUN ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-center" style="width: 15%;" colspan="4">JUL-SEP ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-center" style="width: 15%;" colspan="4">OCT-DEC ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-center" style="width: 15%;" colspan="4">TOTAL</th>';
        _header1 += '<th class="text-right" style="min-width: 75px;">Actual</th><th class="text-right" style="min-width: 75px;">Budget</th><th class="text-right" style="min-width: 75px;">over Budget</th><th class="text-right" style="min-width: 75px;">% of Budget</th>'.repeat(5);
    }
    else if (_interval == 'Y') {
        _header += '<th class="text-center" style="width: 75%;" colspan="4">JAN-DEC ' + moment(_sDate).format('YYYY') + '</th>';
        _header1 += '<th class="text-right" style="min-width: 75px;">Actual</th><th class="text-right" style="min-width: 75px;">Budget</th><th class="text-right" style="min-width: 75px;">over Budget</th><th class="text-right" style="min-width: 75px;">% of Budget</th>';
    }
    _header += '</tr>', _header1 += '</tr>';
    $('#dtBudget thead').empty().append(_header).append(_header1);
    let _zjan_act = 0.00, _zfeb_act = 0.00, _zmar_act = 0.00, _zapr_act = 0.00, _zmay_act = 0.00, _zjun_act = 0.00, _zjul_act = 0.00, _zaug_act = 0.00, _zsep_act = 0.00, _zoct_act = 0.00, _znov_act = 0.00, _zdec_act = 0.00;
    let _zjan = 0.00, _zfeb = 0.00, _zmar = 0.00, _zapr = 0.00, _zmay = 0.00, _zjun = 0.00, _zjul = 0.00, _zaug = 0.00, _zsep = 0.00, _zoct = 0.00, _znov = 0.00, _zdec = 0.00;

    //console.log(option);
    $.ajax({
        dataType: 'json', type: "POST", url: '/budget/get-accountbudget', data: option,
        success: function (data) {
            data = JSON.parse(data);
            Enumerable.from(data).where(function (e) { return (e.level === 0); }).select(function (e) {
                _row = '<tr data-id="' + e.account_number + '" data-bdid="' + e.budget_details_id + '">';
                _row += '    <td class="" style="width: 220px;background:#D5DBDB;"><b>' + e.account_name + '</b></td>';
                if (e.interval == 'M') _row += '<td style="background:#D5DBDB;"></td>'.repeat(52);
                else if (e.interval == 'Q') _row += '<td style="background:#D5DBDB;"></td>'.repeat(20);
                else if (e.interval == 'Y') _row += '<td style="background:#D5DBDB;"></td>'.repeat(4);
                _row += '</tr>';
                $('#dtBudget tbody').append(_row);
                let _jan = 0.00, _feb = 0.00, _mar = 0.00, _apr = 0.00, _may = 0.00, _jun = 0.00, _jul = 0.00, _aug = 0.00, _sep = 0.00, _oct = 0.00, _nov = 0.00, _dec = 0.00;
                let _jan_act = 0.00, _feb_act = 0.00, _mar_act = 0.00, _apr_act = 0.00, _may_act = 0.00, _jun_act = 0.00, _jul_act = 0.00, _aug_act = 0.00, _sep_act = 0.00, _oct_act = 0.00, _nov_act = 0.00, _dec_act = 0.00;
                // level - 1
                Enumerable.from(data).where(function (e1) { return (e1.account_parent === e.rowid); }).select(function (e1) {
                    _row = '<tr data-id="' + e1.account_number + '" data-bdid="' + e1.budget_details_id + '">';
                    _row += '    <td class="" style="padding-left: ' + (e1.level * 20) + 'px !important;">' + e1.account_name + '</td>';

                    _jan_act += (parseFloat(e1.jan_act_amt) || 0.00), _feb_act += (parseFloat(e1.feb_act_amt) || 0.00), _mar_act += (parseFloat(e1.mar_act_amt) || 0.00), _apr_act += (parseFloat(e1.apr_act_amt) || 0.00), _may_act += (parseFloat(e1.may_act_amt) || 0.00), _jun_act += (parseFloat(e1.jun_act_amt) || 0.00), _jul_act += (parseFloat(e1.jul_act_amt) || 0.00), _aug_act += (parseFloat(e1.aug_act_amt) || 0.00), _sep_act += (parseFloat(e1.sep_act_amt) || 0.00), _oct_act += (parseFloat(e1.oct_act_amt) || 0.00), _nov_act += (parseFloat(e1.nov_act_amt) || 0.00), _dec_act += (parseFloat(e1.dec_act_amt) || 0.00);
                    _jan += (parseFloat(e1.jan_amt) || 0.00), _feb += (parseFloat(e1.feb_amt) || 0.00), _mar += (parseFloat(e1.mar_amt) || 0.00), _apr += (parseFloat(e1.apr_amt) || 0.00), _may += (parseFloat(e1.may_amt) || 0.00), _jun += (parseFloat(e1.jun_amt) || 0.00), _jul += (parseFloat(e1.jul_amt) || 0.00), _aug += (parseFloat(e1.aug_amt) || 0.00), _sep += (parseFloat(e1.sep_amt) || 0.00), _oct += (parseFloat(e1.oct_amt) || 0.00), _nov += (parseFloat(e1.nov_amt) || 0.00), _dec += (parseFloat(e1.dec_amt) || 0.00);

                    _sum_act = parseFloat(e1.jan_act_amt) + parseFloat(e1.feb_act_amt) + parseFloat(e1.mar_act_amt) + parseFloat(e1.apr_act_amt) + parseFloat(e1.may_act_amt) + parseFloat(e1.jun_act_amt) + parseFloat(e1.jul_act_amt) + parseFloat(e1.aug_act_amt) + parseFloat(e1.sep_act_amt) + parseFloat(e1.oct_act_amt) + parseFloat(e1.nov_act_amt) + parseFloat(e1.dec_act_amt);
                    _sum = parseFloat(e1.jan_amt) + parseFloat(e1.feb_amt) + parseFloat(e1.mar_amt) + parseFloat(e1.apr_amt) + parseFloat(e1.may_amt) + parseFloat(e1.jun_amt) + parseFloat(e1.jul_amt) + parseFloat(e1.aug_amt) + parseFloat(e1.sep_amt) + parseFloat(e1.oct_amt) + parseFloat(e1.nov_amt) + parseFloat(e1.dec_amt);

                    if (e1.interval == 'M') {
                        _row += '    <td class="text-right">' + formatNumber(e1.jan_act_amt) + '</td><td class="text-right">' + formatNumber(e1.jan_amt) + '</td><td class="text-right">' + formatNumber(e1.jan_act_amt - e1.jan_amt) + '</td><td class="text-right">' + (e1.jan_amt > 0 ? formatNumber((e1.jan_act_amt / e1.jan_amt) * 100) : '') + '</td>';
                        _row += '    <td class="text-right">' + formatNumber(e1.feb_act_amt) + '</td><td class="text-right">' + formatNumber(e1.feb_amt) + '</td><td class="text-right">' + formatNumber(e1.feb_act_amt - e1.feb_amt) + '</td><td class="text-right">' + (e1.feb_amt > 0 ? formatNumber((e1.feb_act_amt / e1.feb_amt) * 100) : '') + '</td>';
                        _row += '    <td class="text-right">' + formatNumber(e1.mar_act_amt) + '</td><td class="text-right">' + formatNumber(e1.mar_amt) + '</td><td class="text-right">' + formatNumber(e1.mar_act_amt - e1.mar_amt) + '</td><td class="text-right">' + (e1.mar_amt > 0 ? formatNumber((e1.mar_act_amt / e1.mar_amt) * 100) : '') + '</td>';
                        _row += '    <td class="text-right">' + formatNumber(e1.apr_act_amt) + '</td><td class="text-right">' + formatNumber(e1.apr_amt) + '</td><td class="text-right">' + formatNumber(e1.apr_act_amt - e1.apr_amt) + '</td><td class="text-right">' + (e1.apr_amt > 0 ? formatNumber((e1.apr_act_amt / e1.apr_amt) * 100) : '') + '</td>';
                        _row += '    <td class="text-right">' + formatNumber(e1.may_act_amt) + '</td><td class="text-right">' + formatNumber(e1.may_amt) + '</td><td class="text-right">' + formatNumber(e1.may_act_amt - e1.may_amt) + '</td><td class="text-right">' + (e1.may_amt > 0 ? formatNumber((e1.may_act_amt / e1.may_amt) * 100) : '') + '</td>';
                        _row += '    <td class="text-right">' + formatNumber(e1.jun_act_amt) + '</td><td class="text-right">' + formatNumber(e1.jun_amt) + '</td><td class="text-right">' + formatNumber(e1.jun_act_amt - e1.jun_amt) + '</td><td class="text-right">' + (e1.jun_amt > 0 ? formatNumber((e1.jun_act_amt / e1.jun_amt) * 100) : '') + '</td>';
                        _row += '    <td class="text-right">' + formatNumber(e1.jul_act_amt) + '</td><td class="text-right">' + formatNumber(e1.jul_amt) + '</td><td class="text-right">' + formatNumber(e1.jul_act_amt - e1.jul_amt) + '</td><td class="text-right">' + (e1.jul_amt > 0 ? formatNumber((e1.jul_act_amt / e1.jul_amt) * 100) : '') + '</td>';
                        _row += '    <td class="text-right">' + formatNumber(e1.aug_act_amt) + '</td><td class="text-right">' + formatNumber(e1.aug_amt) + '</td><td class="text-right">' + formatNumber(e1.aug_act_amt - e1.aug_amt) + '</td><td class="text-right">' + (e1.aug_amt > 0 ? formatNumber((e1.aug_act_amt / e1.aug_amt) * 100) : '') + '</td>';
                        _row += '    <td class="text-right">' + formatNumber(e1.sep_act_amt) + '</td><td class="text-right">' + formatNumber(e1.sep_amt) + '</td><td class="text-right">' + formatNumber(e1.sep_act_amt - e1.sep_amt) + '</td><td class="text-right">' + (e1.sep_amt > 0 ? formatNumber((e1.sep_act_amt / e1.sep_amt) * 100) : '') + '</td>';
                        _row += '    <td class="text-right">' + formatNumber(e1.oct_act_amt) + '</td><td class="text-right">' + formatNumber(e1.oct_amt) + '</td><td class="text-right">' + formatNumber(e1.oct_act_amt - e1.oct_amt) + '</td><td class="text-right">' + (e1.oct_amt > 0 ? formatNumber((e1.oct_act_amt / e1.oct_amt) * 100) : '') + '</td>';
                        _row += '    <td class="text-right">' + formatNumber(e1.nov_act_amt) + '</td><td class="text-right">' + formatNumber(e1.nov_amt) + '</td><td class="text-right">' + formatNumber(e1.nov_act_amt - e1.nov_amt) + '</td><td class="text-right">' + (e1.nov_amt > 0 ? formatNumber((e1.nov_act_amt / e1.nov_amt) * 100) : '') + '</td>';
                        _row += '    <td class="text-right">' + formatNumber(e1.dec_act_amt) + '</td><td class="text-right">' + formatNumber(e1.dec_amt) + '</td><td class="text-right">' + formatNumber(e1.dec_act_amt - e1.dec_amt) + '</td><td class="text-right">' + (e1.dec_amt > 0 ? formatNumber((e1.dec_act_amt / e1.dec_amt) * 100) : '') + '</td>';
                    }
                    else if (e1.interval == 'Q') {
                        let _act_amt = e1.jan_act_amt + e1.feb_act_amt + e1.mar_act_amt, _amt = e1.jan_amt + e1.feb_amt + e1.mar_amt;
                        _row += '    <td class="text-right">' + formatNumber(_act_amt) + '</td><td class="text-right">' + formatNumber(_amt) + '</td><td class="text-right">' + formatNumber(_act_amt - _amt) + '</td><td class="text-right">' + (_amt > 0 ? formatNumber((_act_amt / _amt) * 100) : '') + '</td>';
                        _act_amt = e1.apr_act_amt + e1.may_act_amt + e1.jun_act_amt, _amt = e1.apr_amt + e1.may_amt + e1.jun_amt;
                        _row += '    <td class="text-right">' + formatNumber(_act_amt) + '</td><td class="text-right">' + formatNumber(_amt) + '</td><td class="text-right">' + formatNumber(_act_amt - _amt) + '</td><td class="text-right">' + (_amt > 0 ? formatNumber((_act_amt / _amt) * 100) : '') + '</td>';
                        _act_amt = e1.jul_act_amt + e1.aug_act_amt + e1.sep_act_amt, _amt = e1.jul_amt + e1.aug_amt + e1.sep_amt;
                        _row += '    <td class="text-right">' + formatNumber(_act_amt) + '</td><td class="text-right">' + formatNumber(_amt) + '</td><td class="text-right">' + formatNumber(_act_amt - _amt) + '</td><td class="text-right">' + (_amt > 0 ? formatNumber((_act_amt / _amt) * 100) : '') + '</td>';
                        _act_amt = e1.oct_act_amt + e1.nov_act_amt + e1.dec_act_amt, _amt = e1.oct_amt + e1.nov_amt + e1.dec_amt;
                        _row += '    <td class="text-right">' + formatNumber(_act_amt) + '</td><td class="text-right">' + formatNumber(_amt) + '</td><td class="text-right">' + formatNumber(_act_amt - _amt) + '</td><td class="text-right">' + (_amt > 0 ? formatNumber((_act_amt / _amt) * 100) : '') + '</td>';
                    }
                    _row += '    <td class="text-right">' + formatNumber(_sum_act) + '</td><td class="text-right">' + formatNumber(_sum) + '</td><td class="text-right">' + formatNumber(_sum_act - _sum) + '</td><td class="text-right">' + (_sum > 0 ? formatNumber((_sum_act / _sum) * 100) : '') + '</td>';
                    _row += '</tr>';
                    $('#dtBudget tbody').append(_row);
                }).toArray();

                // total of level - 1
                _sum_act = _jan_act + _feb_act + _mar_act + _apr_act + _may_act + _jun_act + _jul_act + _aug_act + _sep_act + _oct_act + _nov_act + _dec_act;
                _sum = _jan + _feb + _mar + _apr + _may + _jun + _jul + _aug + _sep + _oct + _nov + _dec;

                _row = '<tr style="background:#D5DBDB;" data-id="' + e.account_number + '" data-bdid="' + e.budget_details_id + '">';
                _row += '    <td class=""><b>Total ' + e.account_name + '</b></td>';
                if (e.interval == 'M') {
                    _row += '    <td class="text-right">' + formatCurrency(_jan_act) + '</td><td class="text-right">' + formatCurrency(_feb) + '</td><td class="text-right">' + formatCurrency(_jan_act - _jan) + '</td><td class="text-right">' + (_feb > 0 ? formatNumber((_jan_act / _jan) * 100) : '') + '</td>';
                    _row += '    <td class="text-right">' + formatCurrency(_feb_act) + '</td><td class="text-right">' + formatCurrency(_feb) + '</td><td class="text-right">' + formatCurrency(_feb_act - _feb) + '</td><td class="text-right">' + (_feb > 0 ? formatNumber((_feb_act / _feb) * 100) : '') + '</td>';
                    _row += '    <td class="text-right">' + formatCurrency(_mar_act) + '</td><td class="text-right">' + formatCurrency(_mar) + '</td><td class="text-right">' + formatCurrency(_mar_act - _mar) + '</td><td class="text-right">' + (_mar > 0 ? formatNumber((_mar_act / _mar) * 100) : '') + '</td>';
                    _row += '    <td class="text-right">' + formatCurrency(_apr_act) + '</td><td class="text-right">' + formatCurrency(_apr) + '</td><td class="text-right">' + formatCurrency(_apr_act - _apr) + '</td><td class="text-right">' + (_apr > 0 ? formatNumber((_apr_act / _apr) * 100) : '') + '</td>';
                    _row += '    <td class="text-right">' + formatCurrency(_may_act) + '</td><td class="text-right">' + formatCurrency(_may) + '</td><td class="text-right">' + formatCurrency(_may_act - _may) + '</td><td class="text-right">' + (_may > 0 ? formatNumber((_may_act / _may) * 100) : '') + '</td>';
                    _row += '    <td class="text-right">' + formatCurrency(_jun_act) + '</td><td class="text-right">' + formatCurrency(_jun) + '</td><td class="text-right">' + formatCurrency(_jun_act - _jun) + '</td><td class="text-right">' + (_jun > 0 ? formatNumber((_jun_act / _jun) * 100) : '') + '</td>';
                    _row += '    <td class="text-right">' + formatCurrency(_jul_act) + '</td><td class="text-right">' + formatCurrency(_jul) + '</td><td class="text-right">' + formatCurrency(_jul_act - _jul) + '</td><td class="text-right">' + (_jul > 0 ? formatNumber((_jul_act / _jul) * 100) : '') + '</td>';
                    _row += '    <td class="text-right">' + formatCurrency(_aug_act) + '</td><td class="text-right">' + formatCurrency(_aug) + '</td><td class="text-right">' + formatCurrency(_aug_act - _aug) + '</td><td class="text-right">' + (_aug > 0 ? formatNumber((_aug_act / _aug) * 100) : '') + '</td>';
                    _row += '    <td class="text-right">' + formatCurrency(_sep_act) + '</td><td class="text-right">' + formatCurrency(_sep) + '</td><td class="text-right">' + formatCurrency(_sep_act - _sep) + '</td><td class="text-right">' + (_sep > 0 ? formatNumber((_sep_act / _sep) * 100) : '') + '</td>';
                    _row += '    <td class="text-right">' + formatCurrency(_oct_act) + '</td><td class="text-right">' + formatCurrency(_oct) + '</td><td class="text-right">' + formatCurrency(_oct_act - _oct) + '</td><td class="text-right">' + (_oct > 0 ? formatNumber((_oct_act / _oct) * 100) : '') + '</td>';
                    _row += '    <td class="text-right">' + formatCurrency(_nov_act) + '</td><td class="text-right">' + formatCurrency(_nov) + '</td><td class="text-right">' + formatCurrency(_nov_act - _nov) + '</td><td class="text-right">' + (_nov > 0 ? formatNumber((_nov_act / _nov) * 100) : '') + '</td>';
                    _row += '    <td class="text-right">' + formatCurrency(_dec_act) + '</td><td class="text-right">' + formatCurrency(_dec) + '</td><td class="text-right">' + formatCurrency(_dec_act - _dec) + '</td><td class="text-right">' + (_dec > 0 ? formatNumber((_dec_act / _dec) * 100) : '') + '</td>';
                }
                else if (e.interval == 'Q') {
                    let _act_amt = _jan_act + _feb_act + _mar_act, _amt = _jan + _feb + _mar;
                    _row += '    <td class="text-right">' + formatCurrency(_act_amt) + '</td><td class="text-right">' + formatCurrency(_amt) + '</td><td class="text-right">' + formatCurrency(_act_amt - _amt) + '</td><td class="text-right">' + (_amt > 0 ? formatNumber((_act_amt / _amt) * 100) : '') + '</td>';
                    _act_amt = _apr_act + _may_act + _jun_act, _amt = _apr + _may + _jun;
                    _row += '    <td class="text-right">' + formatCurrency(_act_amt) + '</td><td class="text-right">' + formatCurrency(_amt) + '</td><td class="text-right">' + formatCurrency(_act_amt - _amt) + '</td><td class="text-right">' + (_amt > 0 ? formatNumber((_act_amt / _amt) * 100) : '') + '</td>';
                    _act_amt = _jul_act + _aug_act + _sep_act, _amt = _jul + _aug + _sep;
                    _row += '    <td class="text-right">' + formatCurrency(_act_amt) + '</td><td class="text-right">' + formatCurrency(_amt) + '</td><td class="text-right">' + formatCurrency(_act_amt - _amt) + '</td><td class="text-right">' + (_amt > 0 ? formatNumber((_act_amt / _amt) * 100) : '') + '</td>';
                    _act_amt = _oct_act + _nov_act + _dec_act, _amt = _oct + _nov + _dec;
                    _row += '    <td class="text-right">' + formatCurrency(_act_amt) + '</td><td class="text-right">' + formatCurrency(_amt) + '</td><td class="text-right">' + formatCurrency(_act_amt - _amt) + '</td><td class="text-right">' + (_amt > 0 ? formatNumber((_act_amt / _amt) * 100) : '') + '</td>';
                }
                _row += '    <td class="text-right">' + formatCurrency(_sum_act) + '</td><td class="text-right">' + formatCurrency(_sum) + '</td><td class="text-right">' + formatCurrency(_sum_act - _sum) + '</td><td class="text-right">' + (_sum > 0 ? formatNumber((_sum_act / _sum) * 100) : '') + '</td>';
                _row += '</tr>';
                $('#dtBudget tbody').append(_row);

                if (e.extraparams == 'I') {
                    _zjan_act += _jan_act, _zfeb_act += _feb_act, _zmar_act += _mar_act, _zapr_act += _zapr_act, _zmay_act += _may_act, _zjun_act += _jun_act, _zjul_act += _jul_act, _zaug_act += _aug_act, _zsep_act += _sep_act, _zoct_act += _oct_act, _znov_act += _nov_act, _zdec_act += _zdec_act;
                    _zjan += _jan, _zfeb += _feb, _zmar += _mar, _zapr += _zapr, _zmay += _may, _zjun += _jun, _zjul += _jul, _zaug += _aug, _zsep += _sep, _zoct += _oct, _znov += _nov, _zdec += _zdec;
                }
                else if (e.extraparams == 'E') {
                    _zjan_act = _zjan_act - _jan_act, _zfeb_act = _zfeb_act - _feb_act, _zmar_act = _zmar_act - _mar_act, _zapr_act = _zapr_act - _zapr_act, _zmay_act = _zmay_act - _may_act, _zjun_act = _zjun_act - _jun_act, _zjul_act = _zjul_act - _jul_act, _zaug_act = _zaug_act - _aug_act, _zsep_act = _zsep_act - _sep_act, _zoct_act = _zoct_act - _oct_act, _znov_act = _znov_act - _nov_act, _zdec_act = _zdec_act - _zdec_act;
                    _zjan = _zjan - _jan, _zfeb = _zfeb - _feb, _zmar = _zmar - _mar, _zapr = _zapr - _apr, _zmay = _zmay - _may, _zjun = _zjun - _jun, _zjul = _zjul - _jul, _zaug = _zaug - _aug, _zsep = _zsep - _sep, _zoct = _zoct - _oct, _znov = _znov - _nov, _zdec = _zdec - _zdec;
                    //_zjan -= _jan, _zfeb -= _feb, _zmar -= _mar, _zapr -= _zapr, _zmay -= _may, _zjun -= _jun, _zjul -= _jul, _zaug -= _aug, _zsep -= _sep, _zoct -= _oct, _znov -= _nov, _zdec -= _zdec;
                }
            }).toArray();

            // Net Total
            _sum_act = _zjan_act + _zfeb_act + _zmar_act + _zapr_act + _zmay_act + _zjun_act + _zjul_act + _zaug_act + _zsep_act + _zoct_act + _znov_act + _zdec_act;
            _sum = _zjan + _zfeb + _zmar + _zapr + _zmay + _zjun + _zjul + _zaug + _zsep + _zoct + _znov + _zdec;

            _row = '<tr style="background:#D5DBDB;">';
            _row += '    <td style="width: 220px;"><b>Net Income</b></td>';
            if (_interval == 'M') {
                //_sum = _zjan + _zfeb + _zmar + _zapr + _zmay + _zjun + _zjul + _zaug + _zsep + _zoct + _znov + _zdec;
                _row += '    <td class="text-right">' + formatCurrency(_zjan_act) + '</td><td class="text-right">' + formatCurrency(_zjan) + '</td><td class="text-right">' + formatNumber(_zjan_act - _zjan) + '</td><td class="text-right">' + (_zjan > 0 ? formatNumber((_zjan_act / _zjan) * 100) : '') + '</td>';
                _row += '    <td class="text-right">' + formatCurrency(_zfeb_act) + '</td><td class="text-right">' + formatCurrency(_zfeb) + '</td><td class="text-right">' + formatNumber(_zfeb_act - _zfeb) + '</td><td class="text-right">' + (_zfeb > 0 ? formatNumber((_zfeb_act / _zfeb) * 100) : '') + '</td>';
                _row += '    <td class="text-right">' + formatCurrency(_zmar_act) + '</td><td class="text-right">' + formatCurrency(_zmar) + '</td><td class="text-right">' + formatNumber(_zmar_act - _zmar) + '</td><td class="text-right">' + (_zmar > 0 ? formatNumber((_zmar_act / _zmar) * 100) : '') + '</td>';
                _row += '    <td class="text-right">' + formatCurrency(_zapr_act) + '</td><td class="text-right">' + formatCurrency(_zapr) + '</td><td class="text-right">' + formatNumber(_zapr_act - _zapr) + '</td><td class="text-right">' + (_zapr > 0 ? formatNumber((_zapr_act / _zapr) * 100) : '') + '</td>';
                _row += '    <td class="text-right">' + formatCurrency(_zmay_act) + '</td><td class="text-right">' + formatCurrency(_zmay) + '</td><td class="text-right">' + formatNumber(_zmay_act - _zmay) + '</td><td class="text-right">' + (_zmay > 0 ? formatNumber((_zmay_act / _zmay) * 100) : '') + '</td>';
                _row += '    <td class="text-right">' + formatCurrency(_zjun_act) + '</td><td class="text-right">' + formatCurrency(_zjun) + '</td><td class="text-right">' + formatNumber(_zjun_act - _zjun) + '</td><td class="text-right">' + (_zjun > 0 ? formatNumber((_zjun_act / _zjun) * 100) : '') + '</td>';
                _row += '    <td class="text-right">' + formatCurrency(_zjul_act) + '</td><td class="text-right">' + formatCurrency(_zjul) + '</td><td class="text-right">' + formatNumber(_zjul_act - _zjul) + '</td><td class="text-right">' + (_zjul > 0 ? formatNumber((_zjul_act / _zjul) * 100) : '') + '</td>';
                _row += '    <td class="text-right">' + formatCurrency(_zaug_act) + '</td><td class="text-right">' + formatCurrency(_zaug) + '</td><td class="text-right">' + formatNumber(_zaug_act - _zaug) + '</td><td class="text-right">' + (_zaug > 0 ? formatNumber((_zaug_act / _zaug) * 100) : '') + '</td>';
                _row += '    <td class="text-right">' + formatCurrency(_zsep_act) + '</td><td class="text-right">' + formatCurrency(_zsep) + '</td><td class="text-right">' + formatNumber(_zsep_act - _zsep) + '</td><td class="text-right">' + (_zsep > 0 ? formatNumber((_zsep_act / _zsep) * 100) : '') + '</td>';
                _row += '    <td class="text-right">' + formatCurrency(_zoct_act) + '</td><td class="text-right">' + formatCurrency(_zoct) + '</td><td class="text-right">' + formatNumber(_zoct_act - _zoct) + '</td><td class="text-right">' + (_zoct > 0 ? formatNumber((_zoct_act / _zoct) * 100) : '') + '</td>';
                _row += '    <td class="text-right">' + formatCurrency(_znov_act) + '</td><td class="text-right">' + formatCurrency(_znov) + '</td><td class="text-right">' + formatNumber(_znov_act - _znov) + '</td><td class="text-right">' + (_znov > 0 ? formatNumber((_znov_act / _znov) * 100) : '') + '</td>';
                _row += '    <td class="text-right">' + formatCurrency(_zdec_act) + '</td><td class="text-right">' + formatCurrency(_zdec) + '</td><td class="text-right">' + formatNumber(_zdec_act - _zdec) + '</td><td class="text-right">' + (_zdec > 0 ? formatNumber((_zdec_act / _zdec) * 100) : '') + '</td>';
                //_row += '    <td class="text-right">' + formatCurrency(_sum) + '</td>';
            }
            else if (_interval == 'Q') {
                let _act_amt = _zjan_act + _zfeb_act + _zmar_act, _amt = _zjan + _zfeb + _zmar;
                _row += '    <td class="text-right">' + formatCurrency(_act_amt) + '</td><td class="text-right">' + formatCurrency(_amt) + '</td><td class="text-right">' + formatNumber(_act_amt - _amt) + '</td><td class="text-right">' + (_amt > 0 ? formatNumber((_act_amt / _amt) * 100) : '') + '</td>';
                _act_amt = _zapr_act + _zmay_act + _zjun_act, _amt = _zapr + _zmay + _zjun;
                _row += '    <td class="text-right">' + formatCurrency(_act_amt) + '</td><td class="text-right">' + formatCurrency(_amt) + '</td><td class="text-right">' + formatNumber(_act_amt - _amt) + '</td><td class="text-right">' + (_amt > 0 ? formatNumber((_act_amt / _amt) * 100) : '') + '</td>';
                _act_amt = _zjul_act + _zaug_act + _zsep_act, _amt = _zjul + _zaug + _zsep;
                _row += '    <td class="text-right">' + formatCurrency(_act_amt) + '</td><td class="text-right">' + formatCurrency(_amt) + '</td><td class="text-right">' + formatNumber(_act_amt - _amt) + '</td><td class="text-right">' + (_amt > 0 ? formatNumber((_act_amt / _amt) * 100) : '') + '</td>';
                _act_amt = _zoct_act + _znov_act + _zdec_act, _amt = _zoct + _znov + _zdec;
                _row += '    <td class="text-right">' + formatCurrency(_act_amt) + '</td><td class="text-right">' + formatCurrency(_amt) + '</td><td class="text-right">' + formatNumber(_act_amt - _amt) + '</td><td class="text-right">' + (_amt > 0 ? formatNumber((_act_amt / _amt) * 100) : '') + '</td>';

            }
            _row += '    <td class="text-right">' + formatCurrency(_sum_act) + '</td><td class="text-right">' + formatCurrency(_sum) + '</td><td class="text-right">' + formatCurrency(_sum_act - _sum) + '</td><td class="text-right">' + (_sum > 0 ? formatNumber((_sum_act / _sum) * 100) : '') + '</td>';
            _row += '</tr>';
            $('#dtBudget tbody').append(_row);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); },
        complete: function () { $("#loader").hide(); }, async: true
    });
    return;
}

function printDiv() {
    var contents = $("#print-report").html();
    var frame1 = $('<iframe />');
    frame1[0].name = "frame1";
    frame1.css({ "position": "absolute", "top": "-1000000px" });
    $("body").append(frame1);
    var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
    frameDoc.document.open();
    //Create a new HTML document.
    frameDoc.document.write('<html><head><title>DIV Contents</title>');
    frameDoc.document.write('</head><body>');
    //Append the external CSS file.
    //frameDoc.document.write('<link href="style.css" rel="stylesheet" type="text/css" />');
    //Append the DIV contents.
    frameDoc.document.write(contents);
    frameDoc.document.write('</body></html>');
    frameDoc.document.close();
    setTimeout(function () {
        window.frames["frame1"].focus();
        window.frames["frame1"].print();
        frame1.remove();
    }, 500);
}
function exportExcel() {
    let _date = moment();
    let htmltable = document.getElementById('dtBudget'), _columns = $('#dtBudget').find("tr:first th").length;
    let html = htmltable.outerHTML;
    //window.open('data:application/vnd.ms-excel,' + encodeURIComponent(html));
    let uri = 'data:application/vnd.ms-excel;base64,';
    //let template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></meta><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{company_name}{table}</table></body></html>';
    let template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
    template += '<head><meta charset="utf-8"></meta><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>';
    template += '<body><table style="font-family: Arial;">';
    template += '<tr><td style="font-size: 18px;font-weight: 600;text-align: center;" colspan="{column_count}">{company_name}</td></tr>';
    template += '<tr><td style="font-size: 16px;font-weight: 600;text-align: center;" colspan="{column_count}">{rpt_title}</td></tr>';
    template += '<tr><td style="font-size: 16px;font-weight: 600;text-align: center;" colspan="{column_count}">{rpt_sub_title}</td></tr>';
    template += '<tr><td style="font-size: 10px;text-align: right;" colspan="{column_count}">Time : ' + _date.format('LLLL') + '</td></tr>';
    template += '{table}</table></body></html>';
    var base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) };

    var format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

    var ctx = { worksheet: 'Budget Overview', column_count: _columns, company_name: $('.company_name').text(), rpt_title: $('.rpt_title').text(), rpt_sub_title: $('.reportPeriod').text(), table: html };

    let link = document.createElement("a");
    link.download = "Budget_Overview_" + _date.format('DDMMMMYYYYh:mm:ssA') + ".xls";
    link.href = uri + base64(format(template, ctx));
    link.click();
}
function exportPdf() {
    let htmltable = document.getElementById('print-report');
    let html = htmltable.outerHTML;
    //window.open('data:application/pdf,' + encodeURIComponent(html));
    let uri = 'data:application/pdf;base64,';
    let template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></meta><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
    var base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) };

    var format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

    var ctx = { worksheet: 'Worksheet', table: html };

    let link = document.createElement("a");
    link.download = "Budget Overview.pdf";
    link.href = uri + base64(format(template, ctx));
    link.click();
}
