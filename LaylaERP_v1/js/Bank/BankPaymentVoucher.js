$(document).ready(function () {
    $('#txtpaymentdate').daterangepicker({ singleDatePicker: true, autoUpdateInput: true, locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' } });
    $("#loader").hide();

    $.when(getBanks()).done(function () { getExpensesDetails(); });
    $(".select2").select2();
    $(document).on("change", "#ddlCoustomertype", function (t) {
        t.preventDefault(); PayeeType($(this).val());
    });
    $(document).on("change", "#ddlpayee", function (t) {
        t.preventDefault(); GetAddress();
    });

    $(document).on("click", ".ddladdproduct", function (t) {
        t.preventDefault();
        let i = MaxRowid();
        AddExpenseModal(i, 0, '', 0);
    });

    $(document).on("click", ".btnupdateline", function (t) {
        t.preventDefault();
        let _list = [{ row_id: parseInt($(this).data('index')) || 0, account_number: parseInt($('#ddlaccount').val()) || 0, account_name: $('#ddlaccount option:selected').text(), description: $('#txtrow_desc').val(), amount: parseFloat($('#txtrow_amt').val()) || 0.00, senstag: 'D' }];
        bindItems(_list);
    });
    $(document).on("click", ".btnSave", function (t) { t.preventDefault(); SaveData(); });

    $(document).on("click", ".btnEdit", function (t) {
        t.preventDefault();
        $('.billinfo').prop("disabled", false);
        let _btn = '<a class="btn btn-danger btnCancel" href="javascript:void(0);" data-toggle="tooltip" title="reset voucher" data-placement="bottom"><i class="fa fa-undo"></i> Cancel</a> <a class="btn btn-danger btnSave" href="javascript:void(0);" data-toggle="tooltip" title="Save expense voucher" data-placement="bottom"><i class="fa fa-save"></i> Save</a> ';

        $(".top-action").empty().append(_btn);
        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/bank/BankPaymentVoucherList" data-toggle="tooltip" title="Back to List" data-placement="right">Back to List</a>' + _btn);
    });

    $(document).on("click", ".btnCancel", function (t) {
        t.preventDefault(); let _text = 'Are you sure you want to undo changes?';
        swal({ title: '', text: _text, type: "question", showCancelButton: true }).then((result) => { if (result.value) { $("#loader").show(); getExpensesDetails(); } });
    });

    $(document).on('click', "#btnuploade", function (t) {
        t.preventDefault(); Adduploade();
    })
});

function getBanks() {
    $('#ddlpaymentaccount').empty().append('<option value="0">Select Payment Account</option>')
    $.ajax({
        url: "/bank/getaccountslist", dataType: 'json', type: "get", contentType: "application/json; charset=utf-8",
        data: { strValue1: 'GETBANK' },
        success: function (data) {
            data = JSON.parse(data);
            $.each(data, function (i, row) {
                $('#ddlpaymentaccount').append('<option value="' + row.id + '">' + row.text + '</option>');
            });
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }, async: false
    });
}

function getAllExpenseHead(id) {
    $('#ddlaccount').empty().append('<option value="0">Select Expense Head</option>')
    $.ajax({
        url: "/bank/getaccountslist", dataType: 'json', type: "get", contentType: "application/json; charset=utf-8",
        data: { strValue1: 'GETACCO' },
        success: function (data) {
            data = JSON.parse(data);
            $.each(data, function (i, row) {
                if (row.id == parseInt(id)) $('#ddlaccount').append('<option value="' + row.id + '" selected>' + row.text + '</option>');
                else $('#ddlaccount').append('<option value="' + row.id + '">' + row.text + '</option>');
            });
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }, async: false
    });
    $(".select2").select2();
}

function PayeeType(type) {
    if (type == 'V') {
        $(".div-payee").empty().append('<select class="form-control select2 billinfo" id="ddlpayee" placeholder="Select Vendor"><option value="0" selected="">Select Vendor</option></select>');
        $.ajax({
            url: "/PurchaseOrder/GetVendor", dataType: 'json', type: "get", contentType: "application/json; charset=utf-8",
            success: function (data) {
                $.each(data, function (i, row) {
                    $('#ddlpayee').append('<option value="' + row.Value + '">' + row.Text + '</option>');
                });
            }, async: false
        });
        $(".select2").select2();
    }
    else if (type == 'C') {
        $(".div-payee").empty().append('<select class="form-control select2 billinfo" id="ddlpayee" placeholder="Select Customer"><option value="0" selected="">Select Customer</option></select>');
        $("#ddlpayee").select2({
            allowClear: true, minimumInputLength: 3, placeholder: "Search Customer",
            ajax: {
                url: '/Orders/GetCustomerList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
                data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
                processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.displayname, name: item.displayname, id: item.id } }) }; },
                error: function (xhr, status, err) { }, cache: true
            }
        });
    }
    else if (type == 'I') {
        $(".div-payee").empty().append('<input type="text" id="txtinstaintion" class="form-control billinfo" placeholder="institution" />');
    }
    $("#txtcustmeraddress").text('-');
}

function GetAddress() {
    $('#txtcustmeraddress').text('-');
    if ($('#ddlCoustomertype').val() == 'V') {
        let option = { strValue1: parseInt($('#ddlpayee').val()) || 0 };
        if (option.strValue1 > 0) {
            $.ajax({
                url: "/PaymentInvoice/GetvendorAddress", dataType: 'json', type: "post", contentType: "application/json; charset=utf-8",
                data: JSON.stringify(option),
                success: function (data) {
                    data = JSON.parse(data); console.log(data)
                    $.each(data, function (i, row) {
                        $('#txtcustmeraddress').text(row.addressvn);
                    });
                }, async: false
            });
        }
    }
    else if ($('#ddlCoustomertype').val() == 'C') {
        let option = { strValue1: parseInt($('#ddlpayee').val()) || 0 };
        if (option.strValue1 > 0) {
            $.ajax({
                url: "/Orders/GetCustomerAddress", dataType: 'json', type: "post", contentType: "application/json; charset=utf-8",
                data: JSON.stringify(option),
                success: function (data) {
                    data = JSON.parse(data);
                    let add = "{0} {1} {2}, {3} {4}, {5}";
                    $.each(data, function (i, row) {
                        ///billing_Details 
                        if (row.meta_key == 'billing_address_1' && row.meta_value != null) { add = add.replace('{0}', row.meta_value); }
                        else if (row.meta_key == 'billing_address_2' && row.meta_value != null) { add = add.replace('{1}', row.meta_value); }
                        else if (row.meta_key == 'billing_city' && row.meta_value != null) { add = add.replace('{2}', row.meta_value); }
                        else if (row.meta_key == 'billing_state' && row.meta_value != null) { add = add.replace('{3}', row.meta_value); }
                        else if (row.meta_key == 'billing_postcode' && row.meta_value != null) { add = add.replace('{4}', row.meta_value); }
                        else if (row.meta_key == 'billing_country' && row.meta_value != null) { add = add.replace('{5}', row.meta_value); }
                    });
                    add = add.replace('{0}', '').replace('{1}', '').replace('{2}', '').replace('{3}', '').replace('{4}', '').replace('{5}', '');
                    $('#txtcustmeraddress').text(add);
                }, async: false
            });
        }
    }
}

function AddExpenseModal(index, id, desc, amt) {
    $("#myModal").modal('show', { backdrop: 'static', keyboard: false });
    //ActivityLog('Edit fee (' + feevalue + ') in order id (' + $('#hfOrderNo').val() + ')', '/Product/AddNewProduct/');
    var _html = '<div class="modal-dialog">';
    _html += '<div class="modal-content">';
    _html += '<div class="modal-header">';
    _html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    _html += '<h4 class="modal-title" id="myModalLabel">Add Expense Head</h4>';
    _html += '</div>';
    _html += '<div class="modal-body">';

    _html += '<div class="row"><div class="col-md-12"><div class="form-group"><label class="control-label">Expense Head<span class="text-red">*</span></label><select class="form-control select2" id="ddlaccount"><option value="0" selected>Select Expense Head</option></select></div></div></div>';
    _html += '<div class="row"><div class="col-md-12"><div class="form-group"><label class="control-label">Description</label><textarea class="form-control" id="txtrow_desc" rows="3" maxlength="500" placeholder="Add description (optional)">' + desc + '</textarea></div></div></div>';
    _html += '<div class="row">';
    _html += '<div class="col-md-6"><div class="form-group"><label class="control-label">Amount<span class="text-red">*</span></label><input class="form-control" type="number" id="txtrow_amt" placeholder="Amount" maxlength="15" autocomplete="true" value="' + amt + '"></div></div>';
    _html += '<div class="col-md-6"></div>';
    _html += '</div>';

    _html += '</div>';
    _html += '<div class="modal-footer"><button type="button" class="btn btn-danger pull-right btnupdateline" data-index="' + index + '"><i class="fa fa-plus-circle"></i> Add</button></div>';
    _html += '</div>';
    _html += '</div>';
    $("#myModal").empty().html(_html);
    getAllExpenseHead(id);
    //$("#ddlaccount").select2('open');
}

function MaxRowid() {
    let max = 0;
    $('#line_items > tr').each(function (index, tr) {
        let id = parseInt($(tr).data('rowid'), 0);
        if (isNaN(id)) { return; }
        if ((max === null) || (id > max)) { max = id; }
    });
    return [max + 1];
}

function bindItems(_list) {
    let _html = '';
    $.each(_list, function (i, row) {
        if ($('#tr_' + row.row_id).length <= 0) {
            _html += '<tr id="tr_' + row.row_id + '" class="paid_item" data-rowid="' + row.row_id + '" data-acc_id="' + row.account_number + '" data-acc_name="' + row.account_name + '" data-senstag="D">';
            _html += '<td class="text-center">' + row.row_id + '</td>';
            _html += '<td class="">' + row.account_name + '</td>';
            _html += '<td><input autocomplete="off" class="form-control billinfo" type="text" id="txtheaddescription_' + row.row_id + '"  name="txtheaddescription" placeholder="Description" value="' + row.description + '"></td>';
            _html += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txtheadamt_' + row.row_id + '"  name="txtheadamt" placeholder="Amount"  value="' + row.amount.toFixed(2) + '"></td>';
            _html += '<td class="text-center"><button class="btn menu-icon-gr p-1 text-red billinfo" onclick="AddExpenseModal(' + row.row_id + ',' + row.account_number + ',\'' + row.description + '\',' + row.amount.toFixed(2) + ');" data-toggle="tooltip" title="Edit Expense Head"> <i class="fa fa-edit"></i></button>';
            _html += '<button class="btn menu-icon-gr p-1 text-red billinfo" onclick="removeItems(' + row.row_id + ');" data-toggle="tooltip" title="Remove Expense Head"> <i class="fa fa-trash"></i></button></td>';
            _html += '</tr>';
        }
        else {
            $('#tr_' + row.row_id).data('acc_id', row.account_number); $('tr_' + row.row_id).data('acc_name', row.account_name);
            $('#tr_' + row.row_id).find('td:eq(1)').html(row.account_name);
            $('#tr_' + row.row_id).find('[name="txtheaddescription"]').val(row.description);
            $('#tr_' + row.row_id).find('[name="txtheadamt"]').val(row.amount.toFixed(2));
            $('#tr_' + row.row_id).find('td:eq(4)').empty().append('<button class="btn menu-icon-gr p-1 text-red billinfo" onclick="AddExpenseModal(' + row.row_id + ',' + row.account_number + ',\'' + row.description + '\',' + row.amount.toFixed(2) + ');" data-toggle="tooltip" title="Edit Expense Head"> <i class="fa fa-edit"></i></button>');
            $('#tr_' + row.row_id).find('td:eq(4)').append('<button class="btn menu-icon-gr p-1 text-red billinfo" onclick="removeItems(' + row.row_id + ');" data-toggle="tooltip" title="Remove Expense Head"> <i class="fa fa-trash"></i></button>');
        }
    });
    $('#line_items').append(_html);
    $(".select2").select2();
    $("#line_items").find(".rowCalulate").change(function () { calculateFinal(); });
    $("#myModal").modal('hide');
    calculateFinal();
}
function removeItems(id) {
    //------------- Remove data in Temp AddItemList-----
    swal({ title: "Are you sure?", text: 'Would you like to Remove this Expense Head?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) { $('#tr_' + id).remove(); }
            calculateFinal();
        });
}
function calculateFinal() {
    let tAmt = 0.00;
    //main item
    $("#line_items > tr.paid_item").each(function (index, row) {
        tAmt += parseFloat($(row).find("[name=txtheadamt]").val()) || 0.00;
    });
    $(".net_total").html(CurrencyFormat(tAmt)); $(".net_total").data('total', tAmt.toFixed(2));
}

function getExpensesDetails() {
    let _id = parseInt($('#lblvoucherno').data('id')) || 0;
    $('#line_items').empty();
    if (_id > 0) {
        $('.billinfo').prop("disabled", true); //$(".order-files").removeClass('hidden');
        $('.page-heading').text('Bank Payment/Expenses ').append('<a class="btn btn-danger" href="/bank/BankPaymentVoucherList" data-toggle="tooltip" title="Back to List" data-placement="right">Back to List</a>');
        var option = { id: _id, vtype: 'BP' };
        $.ajax({
            url: "/bank/voucher-details", type: "Get", beforeSend: function () { $("#loader").show(); }, data: option,
            success: function (result) {
                try {
                    result = JSON.parse(result);
                    $.each(result['Table'], function (i, row) {
                        $('#lblvoucherno').text(row.voucher_no); $('#lblvoucherno').data('id', row.voucher_no);
                        $('#txtpaymentdate').val(row.voucher_date);
                        $('#ddlpaymentaccount').val(row.bank_account_number).trigger('change');
                        $('#ddlCoustomertype').val(row.customertype).trigger('change');
                        PayeeType(row.customertype);
                        if (row.customertype == 'V') {
                            $('#ddlpayee').val(row.fk_vendor).trigger('change');
                        }
                        else if (row.customertype == 'C') {
                            $('#ddlpayee').select2('').empty().select2({ data: [{ id: row.fk_customer, text: '--' }] })
                        }
                        else if (row.customertype == 'I') {
                            $('#txtinstaintion').val(row.Institution);
                        }
                        GetAddress();
                        $('#txtrefno').val(row.ref_no);
                        $('#txtdescription').val(row.description);
                    });
                    bindItems(result['Table1']);

                    $(".top-action").empty().append('<a class="btn btn-danger" href="javascript:RemoveData();" data-toggle="tooltip" title="Edit expense voucher" data-placement="bottom"><i class="fa fa-trash"></i> Delete</a> <a class="btn btn-danger btnEdit" href="javascript:void(0);" data-toggle="tooltip" title="Edit expense voucher" data-placement="bottom"><i class="fa fa-edit"></i> Edit</a>');
                    $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/bank/BankPaymentVoucherList" data-toggle="tooltip" title="Back to List" data-placement="right">Back to List</a> <a class="btn btn-danger" href="javascript:RemoveData();" data-toggle="tooltip" title="Edit expense voucher" data-placement="bottom"><i class="fa fa-trash"></i> Delete</a> <a class="btn btn-danger btnEdit" href="javascript:void(0);" data-toggle="tooltip" title="Edit expense voucher" data-placement="top"><i class="fa fa-edit"></i> Edit</a>');
                }
                catch (error) {
                    $("#loader").hide(); swal('Alert!', "something went wrong.", "error");
                }
            },
            complete: function () { $("#loader").hide(); $('.billinfo').prop("disabled", true); },
            error: function (xhr, status, err) { $("#loader").hide(); swal('Alert!', "something went wrong.", "error"); }, async: false
        });
        //bindfileuploade();
    }
    else {
        $("#loader").hide(); $(".order-files").addClass('hidden'); $('.billinfo').prop("disabled", false);
        $('.page-heading').text('Bank Payment/Expenses ').append('<a class="btn btn-danger" href="/bank/BankPaymentVoucherList" data-toggle="tooltip" title="Back to List" data-placement="right">Back to List</a>');

        $(".top-action").empty().append('<a class="btn btn-danger pull-right btnSave" href="javascript:void(0);" data-toggle="tooltip" title="Save expense voucher" data-placement="bottom"><i class="fa fa-save"></i> Save</a>');
        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/bank/BankPaymentVoucherList" data-toggle="tooltip" title="Back to List" data-placement="right">Back to List</a><a class="btn btn-danger pull-right btnSave" href="javascript:void(0);" data-toggle="tooltip" title="Save expense voucher" data-placement="top"><i class="fa fa-save"></i> Save</a>');
        $('#lblvoucherno').text('Draft');
    }
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Save Details ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function ValidateData() {
    if ($('#txtpaymentdate').val() == '') { swal('Error!', 'Please select payment date.', "error").then((result) => { $('#txtpaymentdate').focus(); return false; }); return false; }
    else if ($('#ddlpaymentaccount').val() == '0') { swal('Error!', 'Please select payment account.', "error").then((result) => { $('#ddlpaymentaccount').select2('open'); return false; }); return false; }
    else if ($("#line_items > tr.paid_item").length == 0) { swal('Error!', 'Please add expense details.', "error").then((result) => { $('.ddladdproduct').focus(); return false; }); return false; }
    return true;
}
function VoucherHeader(id) {
    let _ct = $('#ddlCoustomertype').val(), _c_id = parseInt($('#ddlpayee').val()) || 0;
    let obj = {
        voucher_no: id, voucher_type: 'BP', voucher_date: $('#txtpaymentdate').val(), bank_account_number: parseInt($('#ddlpaymentaccount').val()) || 0,
        customertype: _ct, fk_customer: (_ct == 'C' ? _c_id : 0), fk_vendor: (_ct == 'V' ? _c_id : 0), Institution: (_ct == 'I' ? $('#txtinstaintion').val() : ''),
        ref_no: $('#txtrefno').val(), description: $('#txtdescription').val()
    };
    return obj;
}
function VoucherProducts(id) {
    let _list = [];
    //Add Product /Gift Card Product
    $('#line_items > tr').each(function (index, tr) {
        _list.push({
            voucher_no: id, voucher_type: 'BP', row_id: parseInt($(tr).data('rowid')) || 0, item_type: 'line_item', account_number: $(tr).data('acc_id'), description: $(tr).find("[name=txtheaddescription]").val(), amount: parseFloat($(tr).find("[name=txtheadamt]").val()) || 0.00, senstag: $(tr).data('senstag')
        });
    });
    return _list;
}
function SaveData() {
    let id = parseInt($('#lblvoucherno').data('id')) || 0;
    if (!ValidateData()) { $("#loader").hide(); return false };
    let _header = VoucherHeader(id), _list = VoucherProducts(id);
    let obj = { id: id, vtype: 'BP', voucher_header: JSON.stringify(_header), voucher_details: JSON.stringify(_list) };
    //console.log(obj, _list); return false;
    swal.queue([{
        title: '', confirmButtonText: 'Yes, Update it!', text: "Do you want to save expense details?", showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                $.post('/bank/create-voucher', obj).done(function (result) {
                    result = JSON.parse(result);
                    if (result[0].response == "Success") {
                        $('#lblvoucherno').data('id', result[0].id); $('#lblvoucherno').text(result[0].id);
                        $.when(getExpensesDetails()).done(function () {
                            swal('Success', 'Your expense saved successfully.', 'success'); $('[data-toggle="tooltip"]').tooltip();
                        });
                    }
                    else { swal('Error', result[0].response, "error"); }
                }).catch(err => { swal.hideLoading(); swal('Error!', 'Something went wrong, please try again.', 'error'); });
            });
        }
    }]);
    return false;
}

function RemoveData() {
    let id = parseInt($('#lblvoucherno').data('id')) || 0;
    if (!ValidateData()) { $("#loader").hide(); return false };
    let obj = { id: id, vtype: 'BP', voucher_header: '', voucher_details: '' };
    //console.log(obj, _list); return false;
    swal.queue([{
        title: '', confirmButtonText: 'Yes, Do it!', text: "Do you want to delete expense details?", showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                $.post('/bank/delete-voucher', obj).done(function (result) {
                    result = JSON.parse(result);
                    if (result[0].response == "Success") { window.location.href = location.origin + '/bank/BankPaymentVoucherList'; }
                    else { swal('Error', result[0].response, "error"); }
                }).catch(err => { swal.hideLoading(); swal('Error!', 'Something went wrong, please try again.', 'error'); });
            });
        }
    }]);
    return false;
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Misc Bill File Upload ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function Adduploade() {
    var formData = new FormData();
    var file = document.getElementById("ImageFile").files[0];
    formData.append("ImageFile", file);

    var Name = parseInt($('#lblbillNo').data('id')) || 0;
    formData.append("Name", Name);
    if (file == "") { swal('Alert', 'Please upload files', 'error').then(function () { swal.close(); }); }
    else {

        $.ajax({
            type: 'post', url: '/PaymentInvoice/FileUploade', processData: false, contentType: false, data: formData,
            beforeSend: function (xhr) { $("#loader").show(); }
        }).then(response => {
            if (response.status == true) {
                if (response.url == "Manage") {
                    swal('Success', response.message, 'success');
                    bindfileuploade();
                }
                else swal('Success', response.message, 'success');
            }
            else swal('Alert!', response.message, 'error')
        }).catch(err => { swal.hideLoading(); swal('Error!', 'something went wrong', 'error'); }).always(function () { $("#loader").hide(); });
    }
}
function bindfileuploade() {
    let id = parseInt($('#lblbillNo').data('id')) || 0;
    var obj = { strValue1: id };
    $.ajax({
        type: "POST", url: '/PaymentInvoice/GetfileuploadData', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let itemHtml = '';
            $.each(data, function (key, row) {
                itemHtml += '<tr id="tritemId_' + row.ID + '" data-id="' + row.ID + '">';
                itemHtml += '<td><a target="popup" href="../../Content/MiscBillsFiles/' + row.product_name + '">' + row.product_name + '</i></a ></td>';
                itemHtml += '<td>' + row.product_label + 'KB' + '</td>';
                itemHtml += '<td>' + row.sellingpric + '</td>';
                itemHtml += '<td class="text-right"><button class="btn menu-icon-gr text-red btnDeleteItem editbutton orderfiles" onClick="Deletefileupload(' + row.ID + ')" data-toggle="tooltip" title="Delete Document" data-placement="right"><i class="glyphicon glyphicon-trash"></i></button></td>';
                itemHtml += '</tr>';
            });
            $('#divfileupload_services').empty().append(itemHtml);
        },
        complete: function () { $("#loader").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
        async: false
    });
}
function Deletefileupload(id) {
    var ids = id;
    var obj = { ID: ids }
    $("#loader").show();
    $.post('/PaymentInvoice/Deletefileuploade', obj).then(response => {
        if (response.status == true) {
            if (response.url == "Manage") {
                swal('Success', response.message, 'success'); bindfileuploade();
            }
            else swal('Success', response.message, 'success');
        }
        else swal('Alert!', response.message, 'error')
    }).catch(err => { swal.hideLoading(); swal('Error!', 'something went wrong', 'error'); }).always(function () { $("#loader").hide(); });
}
