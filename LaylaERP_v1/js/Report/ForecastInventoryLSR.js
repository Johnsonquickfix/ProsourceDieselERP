﻿$(document).ready(function () {
    $("#loader").hide();
    $.when(globallastyear('year'), globalnextyear('nextyear'), months()).done(function () { ProductDataList(); });
    $("#filtersrchexp").click(function () {
        if ($("#year").val() == "") {
            swal('Alert', 'Please select year', 'error').then(function () { swal.close(); $('#year').focus(); });
        }
        else if ($("#ddlmonth").val() == "") {
            swal('Alert', 'Please select Month', 'error').then(function () { swal.close(); $('#month').focus(); });
        }
        else {

            ProductDataList();
            return false;
        }
    });
    $('.select2').select2();
    months();

    // Add event listener for opening and closing details 
    $('#dtdataList tbody').on('click', '.pdetails-control', function () {
        // console.log('svvvd');
        var tr = $(this).closest('tr');
        var row = $('#dtdataList').DataTable().row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            tr.find('.pdetails-control').empty().append('<i class="glyphicon glyphicon-plus-sign"></i>');
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            tr.find('.pdetails-control').empty().append('<i class="glyphicon glyphicon-minus-sign"></i>');
            row.child(formatPartially(row.data())).show();
            tr.addClass('shown');

        }
    });

});

//Years start
function globalnextyear(yearcount) {
    var currentYear = new Date().getFullYear() + 1;
    var yearSelect = document.getElementById(yearcount);
    for (var i = 0; i < 2; i++) {
        var isSelected = currentYear === currentYear
        yearSelect.options[yearSelect.options.length] = new Option(currentYear - i, currentYear - i, isSelected, isSelected);
    }
}
    //Years end
 
 
function months() {
    var vals = ["10", "11", "12"];
    $("#ddlmonth").val(vals).trigger("change");
}
function ProductDataList() {
    // console.log(obj);
    let urid = "";
    let sd = "";
    let ed = "";
    let dfa = "";

    let obj = { strValue1: dfa, strValue2: urid };
    // console.log(obj);
    $('#dtdataList').DataTable({
        //oSearch: { "sSearch": '' }, bAutoWidth: false, scrollX: false,
        oSearch: { "sSearch": '' }, bAutoWidth: false, searching: false, scrollX: false,
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        destroy: true, ajax: {
            url: '/Reports/GetProductInventoryList', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
        columns: [
            { data: 'row_num', title: '#', sWidth: "0.1%" },
            {
                data: 'id', title: 'Product', sWidth: "99.9%", render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    return '<a href="javascript:void(0);" class="pdetails-control" data-toggle="tooltip" title="Click here to show details."><i class="glyphicon glyphicon-plus-sign"></i></a> -  #<b>' + row.post_title + '</b>';

                }
            }

        ],
        columnDefs: [{ targets: [0], searchable: false }]
    });
}
/* Formatting function for row details - modify as you need */
function formatPartially(d) {
    // console.log(d);
    let is_date = true;
    let year = $("#year").val();
    let account = "";
    let Totalsale = 0;
    let Totalforcostsale = 0;
    let Year = $("#year").val();
    var NextYear = $("#nextyear").val();

    var numberRenderer = $.fn.dataTable.render.number(',', '.', 2,).display;
    var montharray = $('#ddlmonth option:selected').toArray().map(item => item.value);
    let month1 = parseInt(montharray[0]);
    let month2 = parseInt(montharray[1]);
    let month3 = parseInt(montharray[2]);
   // console.log(numberRenderer, montharray, month1, month2, month3);

    let option = { PID: d.id, Year: year, Type: account }, wrHTML = '<table id="table1_' + d.rowid + '" class="inventory-table table-blue table check-table table-bordered table-striped dataTable no-footer"><thead><tr><th style="width:10%; text-align:left;">Month Name</th><th style="width:5%; text-align:left;">Sales Quantity (' + Year + ') </th><th style="width:10%; text-align:left;">Forecast Sales Quantity (' + NextYear + ')</th> </tr></thead>';
    $.ajax({
        url: '/Reports/GetForecastInventoryLSR', type: 'post', dataType: 'json', contentType: "application/json; charset=utf-8", data: JSON.stringify(option),
        beforeSend: function () {
            $("#loader").show();
        },
        success: function (result) {
            result = JSON.parse(result);
            // console.log(result);
            let _avg = 0.00, _v1 = 0.00, _v2 = 0.00, _v3 = 0.00, _diff = 0.00, _summary = 0.00, _value1 = 0.00, _value2 = 0.00, _ratio = 0, _n = 0, _forcast = 0.00;

            if (result.length == 0) { wrHTML += '<tbody class="line_items_' + d.rowid + '"><tr><td valign="top" colspan="6" class="no-data-available">Sorry no matching records found.</td></tr></tbody>'; }
            $(result).each(function (index, row) {
                if (row.sr == month1) { _avg += parseFloat(row.total) || 0.00; _v1 = (parseFloat(row.total) || 0.00) * 1; }
                else if (row.sr == month2) { _avg += parseFloat(row.total) || 0.00; _v2 = (parseFloat(row.total) || 0.00) * 2; }
                else if (row.sr == month3) { _avg += parseFloat(row.total) || 0.00; _v3 = (parseFloat(row.total) || 0.00) * 3; };
            });
            _avg = _avg / 3;
            _summary = _v1 + _v2 + _v3;
            _diff = (_summary) - _avg * 6;
            _ratio = 2;
            _n = 3;
            //_value1 = _diff > 0 ? _diff / _ratio : 0;
            _value1 = _diff / _ratio;
            _value2 = _avg - (_value1 * _ratio);
            let _list = $.map(result, function (v) { 
                return { 'month': v.sr, 'month_name': v.Month_name, 'sales': v.total, 'forecast': ((v.sr + 3) * _value1) + _value2 } });
            //console.log(_list);
            //console.log(_avg, _v1, _v2, _v3, _summary, _diff, _ratio, _n, _value1, _value2);

            $(_list).each(function (index, row) {
                Totalsale += Math.round(row.sales);
                Totalforcostsale += Math.round(row.forecast);
                wrHTML += '<tr class="paid_item"><td style="width:10%; text-align:left;">' + row.month_name + '</td>';
                wrHTML += '<td style="width:5%; text-align:left;">' + Math.round(row.sales) + '</td>';
                wrHTML += '<td style="width:10%; text-align:left;">' + Math.round(row.forecast) + '</td></tr > ';
            });
            wrHTML += '<tfoot><tr><td style="width:10%; text-align:left;"><strong><span id="total"> Total </span></strong></td>';
            wrHTML += '<td style="width:5%; text-align:left;"><strong><span id="totalsale">' + Totalsale + '</span></strong></td>';
            wrHTML += '<td style="width:5%; text-align:left;"><strong><span id="totalfircast">' + Totalforcostsale + '</span></strong></td></tr></tfoot>';

        },
        error: function (xhr, status, err) { alert(err); },
        complete: function () { $("#loader").hide(); }, async: false
    });
    wrHTML += '</table>';
    return wrHTML;
}