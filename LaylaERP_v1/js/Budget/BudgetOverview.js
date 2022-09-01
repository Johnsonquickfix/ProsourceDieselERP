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
    let _row = '', _sum = 0, _interval = 'M', _sDate = moment();
    let option = { budget_id: parseInt($('#ddlBudget').val()) || 0, fiscalyear_id: 0, interval: 'M', data_year: 0, flag: 'OVERVIEW' };
    if (option.budget_id > 0) {
        $('.rpt_title').text('Budget Overview : ' + $("#ddlBudget option:selected").text());
        _interval = $("#ddlBudget option:selected").data('interval'); _sDate = $("#ddlBudget option:selected").data('sdate');
        $('.reportPeriod').text(moment(_sDate).format('MMMM') + ' - ' + moment($("#ddlBudget option:selected").data('edate')).format('MMMM YYYY'));
    }
    else $('.rpt_title').text('Budget Overview');

    _header = '<th class="whitespace" style="width: 220px;">ACCOUNTS</th>';
    if (_interval == 'M') {
        _header += '<th class="text-right" style="width: 7%;">JAN ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-right" style="width: 7%;">FEB ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-right" style="width: 7%;">MAR ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-right" style="width: 7%;">APR ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-right" style="width: 7%;">MAY ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-right" style="width: 7%;">JUN ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-right" style="width: 7%;">JUL ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-right" style="width: 7%;">AUG ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-right" style="width: 7%;">SEP ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-right" style="width: 7%;">OCT ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-right" style="width: 7%;">NOV ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-right" style="width: 7%;">DEC ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-right" style="width: 7%;">TOTAL</th>';
    }
    else if (_interval == 'Q') {
        _header += '<th class="text-right" style="width: 15%;">JAN-MAR ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-right" style="width: 15%;">APR-JUN ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-right" style="width: 15%;">JUL-SEP ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-right" style="width: 15%;">OCT-DEC ' + moment(_sDate).format('YYYY') + '</th>';
        _header += '<th class="text-right" style="width: 15%;">TOTAL</th>';
    }
    else if (_interval == 'Y') {
        _header += '<th class="whitespace text-right" style="width: 75%;">JAN-DEC ' + moment(_sDate).format('YYYY') + '</th>';
    }
    $('#dtBudget thead tr').empty().append(_header);
    let _zjan = 0.00, _zfeb = 0.00, _zmar = 0.00, _zapr = 0.00, _zmay = 0.00, _zjun = 0.00, _zjul = 0.00, _zaug = 0.00, _zsep = 0.00, _zoct = 0.00, _znov = 0.00, _zdec = 0.00;
    //console.log(option);
    $.ajax({
        dataType: 'json', type: "POST", url: '/budget/get-accountbudget', data: option,
        success: function (data) {
            data = JSON.parse(data);
            Enumerable.from(data).where(function (e) { return (e.level === 0); }).select(function (e) {
                _row = '<tr data-id="' + e.account_number + '" data-bdid="' + e.budget_details_id + '">';
                _row += '    <td class="" style="width: 220px;background:#D5DBDB;"><b>' + e.account_name + '</b></td>';
                if (e.interval == 'M') _row += '<td style="background:#D5DBDB;"></td>'.repeat(13);
                else if (e.interval == 'Q') _row += '<td style="background:#D5DBDB;"></td>'.repeat(5);
                else if (e.interval == 'Y') _row += '<td style="background:#D5DBDB;"></td>';
                _row += '</tr>';
                $('#dtBudget tbody').append(_row);
                let _jan = 0.00, _feb = 0.00, _mar = 0.00, _apr = 0.00, _may = 0.00, _jun = 0.00, _jul = 0.00, _aug = 0.00, _sep = 0.00, _oct = 0.00, _nov = 0.00, _dec = 0.00;
                // level - 1
                Enumerable.from(data).where(function (e1) { return (e1.account_parent === e.rowid); }).select(function (e1) {
                    _row = '<tr data-id="' + e1.account_number + '" data-bdid="' + e1.budget_details_id + '">';
                    _row += '    <td class="" style="width: 220px;padding-left: ' + (e1.level * 20) + 'px !important;">' + e1.account_name + '</td>';
                    _row += '    <td class="text-right">' + formatCurrency(e1.jan_amt) + '</td>';
                    _jan += (parseFloat(e1.jan_amt) || 0.00), _feb += (parseFloat(e1.feb_amt) || 0.00), _mar += (parseFloat(e1.mar_amt) || 0.00), _apr += (parseFloat(e1.apr_amt) || 0.00), _may += (parseFloat(e1.may_amt) || 0.00), _jun += (parseFloat(e1.jun_amt) || 0.00);
                    _jul += (parseFloat(e1.jul_amt) || 0.00), _aug += (parseFloat(e1.aug_amt) || 0.00), _sep += (parseFloat(e1.sep_amt) || 0.00), _oct += (parseFloat(e1.oct_amt) || 0.00), _nov += (parseFloat(e1.nov_amt) || 0.00), _dec += (parseFloat(e1.dec_amt) || 0.00);
                    if (e1.interval == 'M') {
                        _sum = parseFloat(e1.jan_amt) + parseFloat(e1.feb_amt) + parseFloat(e1.mar_amt) + parseFloat(e1.apr_amt) + parseFloat(e1.may_amt) + parseFloat(e1.jun_amt) + parseFloat(e1.jul_amt) + parseFloat(e1.aug_amt) + parseFloat(e1.sep_amt) + parseFloat(e1.oct_amt) + parseFloat(e1.nov_amt) + parseFloat(e1.dec_amt);
                        _row += '    <td class="text-right">' + formatCurrency(e1.feb_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(e1.mar_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(e1.apr_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(e1.may_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(e1.jun_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(e1.jul_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(e1.aug_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(e1.sep_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(e1.oct_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(e1.nov_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(e1.dec_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(_sum) + '</td>';
                    }
                    else if (e1.interval == 'Q') {
                        _sum = parseFloat(e1.jan_amt) + parseFloat(e1.apr_amt) + parseFloat(e1.jul_amt) + parseFloat(e1.oct_amt);
                        _row += '    <td class="text-right">' + formatCurrency(e1.apr_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(e1.jul_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(e1.oct_amt) + '</td>';
                        _row += '    <td class="text-right">' + formatCurrency(_sum) + '</td>';
                    }
                    _row += '</tr>';
                    $('#dtBudget tbody').append(_row);
                }).toArray();
                // total of level - 1
                _row = '<tr data-id="' + e.account_number + '" data-bdid="' + e.budget_details_id + '">';
                _row += '    <td class="" style="width: 220px;background:#D5DBDB;"><b>Total ' + e.account_name + '</b></td>';
                _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_jan) + '</td>';
                if (e.interval == 'M') {
                    _sum = _jan + _feb + _mar + _apr + _may + _jun + _jul + _aug + _sep + _oct + _nov + _dec;
                    _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_feb) + '</td>';
                    _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_mar) + '</td>';
                    _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_apr) + '</td>';
                    _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_may) + '</td>';
                    _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_jun) + '</td>';
                    _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_jul) + '</td>';
                    _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_aug) + '</td>';
                    _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_sep) + '</td>';
                    _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_oct) + '</td>';
                    _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_nov) + '</td>';
                    _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_dec) + '</td>';
                    _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_sum) + '</td>';
                }
                else if (e.interval == 'Q') {
                    _sum = _jan + _apr + _jul + _oct;
                    _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_apr) + '</td>';
                    _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_jul) + '</td>';
                    _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_oct) + '</td>';
                    _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_sum) + '</td>';
                }
                _row += '</tr>';
                $('#dtBudget tbody').append(_row);

                if (e.extraparams == 'I') { _zjan += _jan, _zfeb += _feb, _zmar += _mar, _zapr += _zapr, _zmay += _may, _zjun += _jun, _zjul += _jul, _zaug += _aug, _zsep += _sep, _zoct += _oct, _znov += _nov, _zdec += _zdec; }
                else if (e.extraparams == 'E') { _zjan -= _jan, _zfeb -= _feb, _zmar -= _mar, _zapr -= _zapr, _zmay -= _may, _zjun -= _jun, _zjul -= _jul, _zaug -= _aug, _zsep -= _sep, _zoct -= _oct, _znov -= _nov, _zdec -= _zdec; }
            }).toArray();

            // Net Total
            _row = '<tr data-id="0" data-bdid="0">';
            _row += '    <td class="" style="width: 220px;background:#D5DBDB;"><b>Net Income</b></td>';
            _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_zjan) + '</td>';
            if (_interval == 'M') {
                _sum = _zjan + _zfeb + _zmar + _zapr + _zmay + _zjun + _zjul + _zaug + _zsep + _zoct + _znov + _zdec;
                _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_zfeb) + '</td>';
                _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_zmar) + '</td>';
                _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_zapr) + '</td>';
                _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_zmay) + '</td>';
                _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_zjun) + '</td>';
                _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_zjul) + '</td>';
                _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_zaug) + '</td>';
                _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_zsep) + '</td>';
                _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_zoct) + '</td>';
                _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_znov) + '</td>';
                _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_zdec) + '</td>';
                _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_sum) + '</td>';
            }
            else if (_interval == 'Q') {
                _sum = _zjan + _zapr + _zjul + _zoct;
                _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_zapr) + '</td>';
                _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_zjul) + '</td>';
                _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_zoct) + '</td>';
                _row += '    <td style="background:#D5DBDB;" class="text-right">' + formatCurrency(_sum) + '</td>';
            }
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
