$(document).ready(function () {
    $("#loader").hide(); $(".select2").select2();
    $.when(getfinaceyear()).done(function () { BindData() });
    $(document).on("click", "#btnBackList", function (t) {
        t.preventDefault(); window.location.href = window.location.origin + "/Budget/BudgetList";
    });
    $(document).on("click", "#btnSearch", function (t) {
        t.preventDefault(); BindData();
    });
    $(document).on("click", "#btnSave", function (t) {
        t.preventDefault(); SaveBudget();
    });
    $(document).on("change", "#ddlInterval", function (t) {
        t.preventDefault(); BindData();
    });
    $(document).on("change", "#ddlPrefillData", function (t) {
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
    console.log('abc');
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
        _header = '        <th class="text-right" style="width: 7%;">JAN</th>';
        _header += '        <th class="text-right" style="width: 7%;">FEB</th>';
        _header += '        <th class="text-right" style="width: 7%;">MAR</th>';
        _header += '        <th class="text-right" style="width: 7%;">APR</th>';
        _header += '        <th class="text-right" style="width: 7%;">MAY</th>';
        _header += '        <th class="text-right" style="width: 7%;">JUN</th>';
        _header += '        <th class="text-right" style="width: 7%;">JUL</th>';
        _header += '        <th class="text-right" style="width: 7%;">AUG</th>';
        _header += '        <th class="text-right" style="width: 7%;">SEP</th>';
        _header += '        <th class="text-right" style="width: 7%;">OCT</th>';
        _header += '        <th class="text-right" style="width: 7%;">NOV</th>';
        _header += '        <th class="text-right" style="width: 7%;">DEC</th>';
        _header += '        <th class="text-right" style="width: 7%;">TOTAL</th>';
        $('#dtBudget thead tr').append(_header);
    }
    else if (_interval == 'Q') {
        _header = '        <th class="text-right" style="width: 15%;">JAN-MAR</th>';
        _header += '        <th class="text-right" style="width: 15%;">APR-JUN</th>';
        _header += '        <th class="text-right" style="width: 15%;">JUL-SEP</th>';
        _header += '        <th class="text-right" style="width: 15%;">OCT-DEC</th>';
        _header += '        <th class="text-right" style="width: 15%;">TOTAL</th>';
        $('#dtBudget thead tr').append(_header);
    }
    else if (_interval == 'Y') {
        _header = '        <th class="whitespace text-right" style="width: 75%;">JAN-DEC</th>';
        $('#dtBudget thead tr').append(_header);
    }
    let _row = '', _sum = 0;
    let option = { budget_id: parseInt($('#txtBudgetName').data('id')) || 0, fiscalyear_id: parseInt($('#ddlfinaceyear').val()) || 0, interval: _interval, data_year: parseInt($('#ddlPrefillData').val()) || 0 };
    option.flag = option.budget_id > 0 ? 'EDIT' : 'NEW';
    if (option.budget_id > 0) {
        $('.budget-info,.budget-info-fy').addClass('hide');
        $('.budget-action,.budget-table-action').empty().append('<button type="button" title="" data-placement="top" data-toggle="tooltip" id="btnSave" class="btn btn-primary" data-original-title="Click here to save budget"><i class="fa fa-save"></i> Save</button>');
        if ($('#txtBudgetName').data('qt') == 'c') { createClone(); }
    }
    //else if ((option.budget_id == 0 || option.budget_id > 0) && $('#txtBudgetName').data('qt') == 'c') { $('.budget-info-fy').removeClass('hide'); }
    else {
        $('.budget-info,.budget-info-fy').removeClass('hide');
        $('.budget-action').empty().append('<button type="button" title="" data-placement="top" data-toggle="tooltip" id="btnSearch" class="btn btn-primary" data-original-title="Click here to print">Search</button><button type="button" title="" data-placement="top" data-toggle="tooltip" id="btnSave" class="btn btn-primary" data-original-title="Click here to save budget"><i class="fa fa-save"></i> Save</button>');
        $('.budget-table-action').empty().append('<button type="button" title="" data-placement="top" data-toggle="tooltip" id="btnSave" class="btn btn-primary" data-original-title="Click here to save budget"><i class="fa fa-save"></i> Save</button>');
    }
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
                $('#ddlfinaceyear').val(data[0].fiscalyear_id).trigger('change');
                //$('#ddlInterval').val(data[0].interval).trigger('change');
                $('#ddlInterval').val(data[0].interval).select2();
            }
            $.each(data, function (i, row) {
                _row = '<tr data-id="' + row.account_number + '" data-bdid="' + (($('#txtBudgetName').data('qt') == 'c') ? 0 : row.budget_details_id) + '">';
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
                        _row += '    <td><input autocomplete="off" class="form-control number text-right rowCalulate" id="txt_jan_amt" value="' + row.jan_amt.toFixed(2) + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number text-right rowCalulate" id="txt_feb_amt" value="' + row.feb_amt.toFixed(2) + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number text-right rowCalulate" id="txt_mar_amt" value="' + row.mar_amt.toFixed(2) + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number text-right rowCalulate" id="txt_apr_amt" value="' + row.apr_amt.toFixed(2) + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number text-right rowCalulate" id="txt_may_amt" value="' + row.may_amt.toFixed(2) + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number text-right rowCalulate" id="txt_jun_amt" value="' + row.jun_amt.toFixed(2) + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number text-right rowCalulate" id="txt_jul_amt" value="' + row.jul_amt.toFixed(2) + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number text-right rowCalulate" id="txt_aug_amt" value="' + row.aug_amt.toFixed(2) + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number text-right rowCalulate" id="txt_sep_amt" value="' + row.sep_amt.toFixed(2) + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number text-right rowCalulate" id="txt_oct_amt" value="' + row.oct_amt.toFixed(2) + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number text-right rowCalulate" id="txt_nov_amt" value="' + row.nov_amt.toFixed(2) + '" name="txt_amt"></td>';
                        _row += '    <td><input autocomplete="off" class="form-control number text-right rowCalulate" id="txt_dec_amt" value="' + row.dec_amt.toFixed(2) + '" name="txt_amt"></td>';
                        _row += '    <td class="text-right rowTotal">' + _sum.toFixed(2) + '</td>';
                    }
                    else if (row.interval == 'Q') {
                        _sum = parseFloat(row.jan_amt) + parseFloat(row.apr_amt) + parseFloat(row.jul_amt) + parseFloat(row.oct_amt);
                        _row += '    <td class="justify-content-end"><input autocomplete="off" class="form-control number text-right rowCalulate" id="txt_jan_amt" value="' + row.jan_amt.toFixed(2) + '" name="txt_amt"></td>';
                        _row += '    <td class="justify-content-end"><input autocomplete="off" class="form-control number text-right rowCalulate" id="txt_apr_amt" value="' + row.apr_amt.toFixed(2) + '" name="txt_amt"></td>';
                        _row += '    <td class="justify-content-end"><input autocomplete="off" class="form-control number text-right rowCalulate" id="txt_jul_amt" value="' + row.jul_amt.toFixed(2) + '" name="txt_amt"></td>';
                        _row += '    <td class="justify-content-end"><input autocomplete="off" class="form-control number text-right rowCalulate" id="txt_oct_amt" value="' + row.oct_amt.toFixed(2) + '" name="txt_amt"></td>';
                        _row += '    <td class="text-right rowTotal">' + _sum.toFixed(2) + '</td>';
                    }
                    else if (row.interval == 'Y') {
                        _sum = parseFloat(row.jan_amt) || 0;
                        _row += '    <td class="d-flex justify-content-end"><input autocomplete="off" class="form-control number text-right rowCalulateYear" id="txt_jan_amt" value="' + _sum.toFixed(2) + '" name="txt_amt"></td>';
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
function createClone() {
    $('.budget-info-fy').removeClass('hide');
    let _val = $('#txtBudgetName').val(); $('#txtBudgetName').val(_val + ' (Copy)'); $('#txtBudgetName').data('id', 0);
}

function RowCalculate(ele) {
    let $row = $(ele).closest('tr');
    let sum = 0;
    $row.find(".rowCalulate").each(function () {
        sum += parseFloat(this.value) || 0;
    });
    $row.find(".rowTotal").text(sum.toFixed(2));
}

function SaveBudget() {
    let obj = {
        budget_id: parseInt($('#txtBudgetName').data('id')) || 0, budget_name: $('#txtBudgetName').val(), fiscalyear_id: parseInt($('#ddlfinaceyear').val()) || 0, interval: $('#ddlInterval').val(), filled_year: $('#ddlPrefillData').val(),
        budget_details: []
    };
    let _jan = 0.00, _feb = 0.00, _mar = 0.00, _apr = 0.00, _may = 0.00, _jun = 0.00, _jul = 0.00, _aug = 0.00, _sep = 0.00, _oct = 0.00, _nov = 0.00, _dec = 0.00;
    $('#dtBudget tbody tr').each(function (index, tr) {
        _jan = parseFloat($(tr).find("#txt_jan_amt").val()) || 0.00;
        _feb = parseFloat($(tr).find("#txt_feb_amt").val()) || 0.00;
        _mar = parseFloat($(tr).find("#txt_mar_amt").val()) || 0.00;
        _apr = parseFloat($(tr).find("#txt_apr_amt").val()) || 0.00;
        _may = parseFloat($(tr).find("#txt_may_amt").val()) || 0.00;
        _jun = parseFloat($(tr).find("#txt_jun_amt").val()) || 0.00;
        _jul = parseFloat($(tr).find("#txt_jul_amt").val()) || 0.00;
        _aug = parseFloat($(tr).find("#txt_aug_amt").val()) || 0.00;
        _sep = parseFloat($(tr).find("#txt_sep_amt").val()) || 0.00;
        _oct = parseFloat($(tr).find("#txt_oct_amt").val()) || 0.00;
        _nov = parseFloat($(tr).find("#txt_nov_amt").val()) || 0.00;
        _dec = parseFloat($(tr).find("#txt_dec_amt").val()) || 0.00;
        obj.budget_details.push({
            budget_details_id: parseInt($(tr).data("bdid")) || 0, account_number: parseInt($(tr).data("id")) || 0, jan_amt: _jan, feb_amt: _feb, mar_amt: _mar, apr_amt: _apr, may_amt: _may, jun_amt: _jun, jul_amt: _jul, aug_amt: _aug, sep_amt: _sep, oct_amt: _oct, nov_amt: _nov, dec_amt: _dec
        });
    });

    //console.log(obj); return false;

    if ($('#txtBudgetName').val() == '') { swal('Error!', 'Please enter budget name.', "error").then((result) => { $('#txtBudgetName').focus(); return false; }); return false; }
    else if (obj.fiscalyear_id == 0 && obj.budget_id == 0) { swal('Error!', 'Please select Financial Year.', "error").then((result) => { $('#ddlfinaceyear').select2('open'); return false; }); return false; }
    else {
        let option = { budget_id: 0, budget_name: JSON.stringify(obj) };
        swal.queue([{
            title: '', confirmButtonText: 'Yes, Update it!', text: "Do you want to save this budget?", showLoaderOnConfirm: true, showCancelButton: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    $.post('/budget/save-budget', option).done(function (result) {
                        result = JSON.parse(result);
                        if (result[0].response == "success") {
                            swal('Success', 'Your budget saved successfully.', "success").then((result) => {
                                window.location.href = window.location.origin + "/Budget/BudgetList";
                            });
                        }
                        else { swal('Error', result[0].response, "error"); }
                    }).catch(err => { swal.hideLoading(); swal('Error!', 'Something went wrong, please try again.', 'error'); });
                });
            }
        }]);
    }
    return false;
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
