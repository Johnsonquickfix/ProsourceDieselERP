$(document).ready(function () {
    $("#loader").hide(); $('.billinfo').prop("disabled", true);
    $('#txtPODate,#txtPlanneddateofdelivery').datepicker({ format: 'mm/dd/yyyy', autoclose: true, todayHighlight: true });
    $(".select2").select2();
    $.when(getVendor(), getMasters()).done(function () { getPurchaseOrderInfo(); });
    $("#ddlVendor").change(function () {
        let today = new Date();
        $('#txtPODate').val(today.toLocaleDateString("en-US"));
        $('.entry-mode-action').empty().append('<button type="button" id="btnOtherProduct" class="btn btn-danger billinfo"><i class="fas fa-cube"></i> Add Other Product</button> ');
        $('.entry-mode-action').append('<button type="button" id="btnService" class="btn btn-danger billinfo"><i class="fas fa-concierge-bell"></i> Add Service</button>');
        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/PurchaseOrder/PurchaseOrderList">Back to List</a><input type="submit" value="Create Order" id="btnSave" class="btn btn-danger billinfo" />');
        $('.billinfo').prop("disabled", false);
        let VendorID = parseInt($('#ddlVendor').val()) || 0;
        $.when(getVendorWarehouse(VendorID)).done(function () {
            isEdit(true);
            let _details = getVendorDetails(); //console.log(_details);
            if (_details.length > 0) {
                $('#txtRefvendor').val(_details[0].code_vendor);
                $('#ddlPaymentTerms').val((parseInt(_details[0].PaymentTermsID) || 0)).trigger('change');
                $('#ddlBalancedays').val((parseInt(_details[0].BalanceID) || 0)).trigger('change');
                $('#ddlIncoTerms').val((parseInt(_details[0].fk_incoterms) || 0)).trigger('change');
                $('#ddlPaymentType').val((parseInt(_details[0].Paymentmethod) || 0)).trigger('change');
                $('#txtIncoTerms').val(_details[0].location_incoterms);
                $('#ddlWarehouse').val((parseInt(_details[0].fk_warehouse) || 0)).trigger('change');
            }
        });
    });
    $('#ddlIncoTerms').change(function () {
        let IncotermsTypeID = parseInt($('#ddlIncoTerms').val()) || 0;
        let obj = { IncotermsTypeID: IncotermsTypeID };
        if (IncotermsTypeID > 0) {
            $.ajax({
                url: "/PurchaseOrder/GetIncotermByID", dataType: 'json', type: "Post", contentType: "application/json; charset=utf-8",
                data: JSON.stringify(obj),
                success: function (data) {
                    data = JSON.parse(data); $('#txtIncoTerms').val(data[0].short_description);
                },
                error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
            });
        }
        else { $('#txtIncoTerms').val(''); }
    });
    $('#txtPlanneddateofdelivery').change(function () {
        let date1 = new Date($('#txtPODate').val()), date2 = new Date($('#txtPlanneddateofdelivery').val());
        var Difference_In_Time = date2.getTime() - date1.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        $('#lblPlannedDays').text("(Planned Days : " + parseInt(Difference_In_Days) + ")");
    });
    $('#ddlWarehouse').change(function (t) {
        t.preventDefault(); $('#txtWarehouseAddress').val($(this).find(':selected').data('ad'))
    });
    $(document).on("click", "#btnPrintPdf", function (t) {
        t.preventDefault();
        let id = parseInt($('#lblPoNo').data('id')) || 0; PrintProposals(id);
    });
    $(document).on('click', "#btnuploade", function (t) {
        t.preventDefault(); Adduploade();
    })
});
function isNullAndUndef(variable) { return (variable !== null && variable !== undefined && variable !== 'undefined' && variable !== 'null' && variable.length !== 0); }
function isEdit(val) { localStorage.setItem('isEdit', val ? 'yes' : 'no'); }
function getMasters() {
    let option = { strValue1: 'GETMD', strValue2: 0 };
    $.ajax({
        url: "/PurchaseOrder/GetAllMaster", data: option, type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            //Payment Terms
            $("#ddlPaymentTerms").html('<option value="0">Select Payment Term</option>');
            for (i = 0; i < dt['Table'].length; i++) { $("#ddlPaymentTerms").append('<option value="' + dt['Table'][i].id + '">' + dt['Table'][i].text + '</option>'); }

            //Payment Type
            $("#ddlPaymentType").html('<option value="0">Select Payment Type</option>');
            for (i = 0; i < dt['Table1'].length; i++) { $("#ddlPaymentType").append('<option value="' + dt['Table1'][i].id + '">' + dt['Table1'][i].text + '</option>'); }

            //Balance
            $("#ddlBalancedays").html('<option value="0">Select Balance days</option>');
            for (i = 0; i < dt['Table2'].length; i++) { $("#ddlBalancedays").append('<option value="' + dt['Table2'][i].id + '">' + dt['Table2'][i].text + '</option>'); }

            //Incoterms
            $("#ddlIncoTerms").html('<option value="0">Select Incoterms</option>');
            for (i = 0; i < dt['Table3'].length; i++) { $("#ddlIncoTerms").append('<option value="' + dt['Table3'][i].id + '">' + dt['Table3'][i].text + '</option>'); }

            //Warehouse
            $("#ddlWarehouse").html('<option value="0">Select Warehouse</option>');
            //for (i = 0; i < dt['Table4'].length; i++) { $("#ddlWarehouse").append('<option value="' + dt['Table4'][i].id + '" data-ad="' + dt['Table4'][i].address + '">' + dt['Table4'][i].text + '</option>'); }
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }, async: false
    });
}
function getVendorWarehouse(VendorID) {
    let option = { strValue1: 'GEVWH', strValue2: VendorID };
    $.ajax({
        url: "/PurchaseOrder/GetAllMaster", data: option, type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            $("#ddlWarehouse").html('<option value="0">Select Warehouse</option>');
            for (i = 0; i < dt['Table'].length; i++) { $("#ddlWarehouse").append('<option value="' + dt['Table'][i].id + '" data-ad="' + dt['Table'][i].address + '">' + dt['Table'][i].text + '</option>'); }
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }, async: false
    });
}
function getVendor() {
    $.ajax({
        url: "/PurchaseOrder/GetVendor",
        type: "Get",
        success: function (data) {
            $('#ddlVendor').append('<option value="-1">Please Select Vendor</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddlVendor').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}
function getVendorDetails() {
    let VendorID = parseInt($('#ddlVendor').val()) || 0;
    let _details = [];
    $.ajax({
        url: "/PurchaseOrder/GetVendorByID", dataType: 'json', type: "get", contentType: "application/json; charset=utf-8",
        data: { strValue1: VendorID },
        success: function (data) { _details = JSON.parse(data); },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }, async: false
    });
    return _details;
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Item Tab Section ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function calculateFinal() {
    let tGrossAmt = 0.00, tQty = 0.00, tDisAmt = 0.00, tTax_Amt1 = 0.00, tTax_Amt2 = 0.00, tOther_Amt = 0.00, tNetAmt = 0.00;
    //main item
    $("#line_items > tr.paid_item").each(function (index, row) {
        let rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rGrossAmt = 0.00, rDisAmt = 0.00, rTax1 = 0.00, rTax_Amt1 = 0.00, rTax2 = 0.00, rTax_Amt2 = 0.00, rNetAmt = 0.00;
        rPrice = parseFloat($(row).data('price')) || 0.00;
        rQty = parseFloat($(row).data('qty')) || 0.00;
        rDisPer = parseFloat($(row).data('disper')) || 0.00;
        rTax1 = parseFloat($(row).find(".tax-amount").data('tax1')) || 0.00; rTax2 = parseFloat($(row).find(".tax-amount").data('tax2')) || 0.00;
        tQty += rQty; rGrossAmt = rPrice * rQty; rDisAmt = rGrossAmt * (rDisPer / 100);
        rTax_Amt1 = rTax1 * rQty; rTax_Amt2 = rTax2 * rQty;
        rNetAmt = (rGrossAmt - rDisAmt) + rTax_Amt1 + rTax_Amt2;
        $(row).find(".tax-amount").text(rTax_Amt1.toFixed(2)); $(row).find(".ship-amount").text(rTax_Amt2.toFixed(2));
        tGrossAmt += rGrossAmt, tDisAmt += rDisAmt, tTax_Amt1 += rTax_Amt1, tTax_Amt2 += rTax_Amt2, tNetAmt += rNetAmt;
        $(row).find(".row-total").text(formatCurrency(rNetAmt));
    });
    //other item
    $("#product_line_items > tr.other_item").each(function (index, row) {
        let proc_type = 0, rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rDisAmt = 0.00, rTax_Amt1 = 0.00, rGrossAmt = 0.00, rNetAmt = 0.00;
        proc_type = parseInt($(row).data("proc_type")) || 0;
        rPrice = parseFloat($(row).data('price')) || 0.00;
        rQty = parseFloat($(row).data('qty')) || 0.00;
        rDisPer = parseFloat($(row).data('disper')) || 0.00;
        rGrossAmt = rPrice * rQty; rDisAmt = rGrossAmt * (rDisPer / 100);
        rNetAmt = (rGrossAmt - rDisAmt) + rTax_Amt1;
        $(row).find(".tax-amount").text(rTax_Amt1.toFixed(2)); $(row).find(".row-total").text(formatCurrency(rNetAmt));
        tGrossAmt += 0;
        tDisAmt += rDisAmt, tTax_Amt1 += rTax_Amt1, tNetAmt += rNetAmt;
        if (proc_type == 1) tTax_Amt2 += rNetAmt;
        else if (proc_type == 2) tTax_Amt1 += rNetAmt;
        else if (proc_type == 3) tOther_Amt += rNetAmt;
        else { tQty += rQty, tGrossAmt += rGrossAmt; }
    });

    $(".thQuantity,.rtQuantity").text(tQty.toFixed(0));
    $("#SubTotal").text(formatCurrency(tGrossAmt)); $("#SubTotal").text(formatCurrency(tGrossAmt)); $(".rtGrossAmt").text(formatCurrency(tGrossAmt));
    $("#discountTotal").text(formatCurrency(tDisAmt)); $("#discountTotal").data('total', tDisAmt.toFixed(2));
    $("#salesTaxTotal").text(formatCurrency(tTax_Amt1)); $("#salesTaxTotal").data('total', tTax_Amt1.toFixed(2)); $(".rtTax").text(formatCurrency(tTax_Amt1));
    $("#shippingTotal").text(formatCurrency(tTax_Amt2)); $("#shippingTotal").data('total', tTax_Amt2.toFixed(2)); $(".rtShipping").text(formatCurrency(tTax_Amt2));
    //$("#otherTotal").text(formatCurrency(tOther_Amt)); $("#otherTotal").data('total', tOther_Amt.toFixed(2));
    $("#orderTotal").html(formatCurrency(tNetAmt)); $("#orderTotal").data('total', tNetAmt.toFixed(2)); $(".rtTotal").text(formatCurrency(tNetAmt));
    let paid_amt = parseFloat($('#paidTotal').data('paid')) || 0.00;
    $('#unpaidTotal').text(formatCurrency(tNetAmt - paid_amt))
    $('[data-toggle="tooltip"]').tooltip();
}
function formatCurrency(total) {
    var neg = false;
    if (total < 0) {
        neg = true;
        total = Math.abs(total);
    }
    return (neg ? "-$" : '$') + parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Edit Purchase Order ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getPurchaseOrderInfo() {
    $('#divAlert').empty();
    let oid = parseInt($('#lblPoNo').data('id')) || 0;
    if (oid > 0) {
        $('#ddlVendor,.billinfo,.orderfiles').prop("disabled", true); $(".order-files").removeClass('hidden');
        $('.page-heading').text('Vendor Sales PO ').append('<a class="btn btn-danger" href="/proposals/supplierproposals" data-toggle="tooltip" title="Back to List" data-placement="right">Back to List</a>');
        $('#line_items,#product_line_items').empty();
        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/proposals/supplierproposals" data-toggle="tooltip" title="Back to List" data-placement="right">Back to List</a>');
        //$(".top-action").empty().append('<button type="button" class="btn btn-danger" id="btnClonePO" data-toggle="tooltip" title="Create duplicate purchase order" data-placement="left"><i class="fas fa-copy"></i> Clone</button> ');
        var option = { strValue1: oid };
        $.ajax({
            url: "/proposals/getproposals-details", type: "Get", beforeSend: function () { $("#loader").show(); }, data: option,
            success: function (result) {
                //try {
                let data = JSON.parse(result); let VendorID = 0, status_id = 0, fk_projet = 0, fk_user_approve = 0;
                $.each(data['po'], function (key, row) {
                    VendorID = parseInt(row.fk_supplier) || 0; status_id = parseInt(row.fk_status) || 0; fk_projet = parseInt(row.fk_projet) || 0;
                    $('#lblPoNo').text('PO-' + row.fk_projet);
                    $('#txtRefvendor').val(row.ref_supplier); $('#txtPODate').val(row.date_creation);
                    $('#ddlVendor').val(row.fk_supplier).trigger('change');
                    $('#ddlPaymentTerms').val(row.fk_payment_term).trigger('change');
                    $('#ddlBalancedays').val(row.fk_balance_days).trigger('change');
                    $('#ddlIncoTerms').val(row.fk_incoterms).trigger('change');
                    $('#ddlPaymentType').val(row.fk_payment_type).trigger('change');
                    $('#txtNotePublic').val(row.note_public); $('#txtNotePrivate').val(row.note_private);
                    $('#txtIncoTerms').val(row.location_incoterms); getVendorWarehouse(VendorID);
                    $('#ddlWarehouse').val(row.fk_warehouse).trigger('change');
                    $('#txtWarehouseAddress').val($('#ddlWarehouse').find(':selected').data('ad'))
                    if (!row.date_livraison.includes('00/00/0000')) $('#txtPlanneddateofdelivery').val(row.date_livraison);
                    let date1 = new Date(row.date_creation), date2 = new Date(row.date_livraison);
                    var Difference_In_Time = date2.getTime() - date1.getTime();
                    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
                    $('#lblPlannedDays').text("(Planned Days : " + parseInt(Difference_In_Days) + ")");

                    $(".top-action").append('<button type="button" class="btn btn-danger" id="btnPrintPdf" data-toggle="tooltip" title="Print Purchase Order" data-placement="left"><i class="fas fa-print"></i> Print</button>');
                });
                $.each(data['pod'], function (key, row) {
                    let itemHtml = ''; let _total = formatCurrency(row.total_ttc);
                    if (row.fk_product > 0) {
                        itemHtml = '<tr id="tritemid_' + row.fk_product + '" class="paid_item" data-pid="' + row.fk_product + '" data-pname="' + row.description + '" data-psku="' + row.product_sku + '" data-rowid="' + row.rowid + '" data-price="' + row.subprice.toFixed(2) + '"data-qty="' + row.qty.toFixed(0) + '" data-disper="' + row.discount_percent.toFixed(2) + '">';
                        itemHtml += '<td>' + row.description + '</td><td>' + row.product_sku + '</td>';
                        itemHtml += '<td class="text-right">' + row.subprice.toFixed(2) + '</td>';
                        itemHtml += '<td class="text-right">' + row.qty.toFixed(0) + '</td><td class="text-right">' + (parseFloat(row.qty) * parseFloat(row.subprice)).toFixed(2) + '</td>';
                        itemHtml += '<td class="text-right">' + row.discount_percent.toFixed(2) + '</td>';
                        itemHtml += '<td class="text-right tax-amount" data-tax1="' + row.localtax1_tx + '" data-tax2="' + row.localtax2_tx + '">' + row.total_localtax1.toFixed(2) + '</td>';
                        itemHtml += '<td class="text-right ship-amount">' + row.total_localtax2.toFixed(2) + '</td>';
                        itemHtml += '<td class="text-right row-total" data-total="' + row.total_ttc.toFixed(2) + '">' + _total + '</td>';
                        itemHtml += '</tr>';
                        $('#line_items').append(itemHtml);
                    }
                    else {
                        let rSDate = !row.date_start.includes('00/00/0000') ? row.date_start : '', rEDate = !row.date_end.includes('00/00/0000') ? row.date_end : '';
                        itemHtml = '<tr id="tritemid_' + row.rowid + '" class="other_item" data-rowid="' + row.rowid + '" data-rang="' + row.rowid + '" data-proc_type="' + row.product_type + '"  data-proc_fromdate="' + rSDate + '" data-proc_todate="' + rEDate + '"  data-price="' + row.subprice.toFixed(2) + '"data-qty="' + row.qty.toFixed(0) + '" data-disper="' + row.discount_percent.toFixed(2) + '">';
                        itemHtml += '<td class="text-center">';
                        itemHtml += '<button class="btn p-0 text-red billinfo" onclick="removeItems(\'' + row.rowid + '\');" data-toggle="tooltip" title="Delete other product and services"><i class="glyphicon glyphicon-trash"></i></button>';
                        itemHtml += '</td > ';
                        itemHtml += '<td class="item-desc">' + row.description + '</td><td class="item-sku">' + row.product_sku + '</td>';
                        itemHtml += '<td>' + row.subprice.toFixed(2) + '</td>';
                        itemHtml += '<td class="text-right">' + row.qty.toFixed(0) + '</td><td class="text-right">' + (parseFloat(row.qty) * parseFloat(row.subprice)).toFixed(2) + '</td>';
                        itemHtml += '<td>' + row.discount_percent.toFixed(2) + '</td>';
                        itemHtml += '<td class="text-right tax-amount">' + row.total_localtax1.toFixed(2) + '</td>';
                        itemHtml += '<td class="text-right ship-amount">' + row.total_localtax2.toFixed(2) + '</td>';
                        itemHtml += '<td class="text-right row-total" data-total="' + row.total_ttc.toFixed(2) + '">' + _total + '</td>';
                        itemHtml += '</tr>';
                        $('#product_line_items').append(itemHtml);
                    }
                });
                getPurchaseOrderPayments(oid);
                //}
                //catch (error) {
                //    $("#loader").hide(); swal('Alert!', "something went wrong.", "error");
                //}
            },
            complete: function () { $("#loader").hide(); isEdit(false); },
            error: function (xhr, status, err) { $("#loader").hide(); swal('Alert!', "something went wrong.", "error"); }, async: false
        });
        $('#ddlVendor,.billinfo').prop("disabled", true); calculateFinal(); $('.entry-mode-action').empty();
    }
    else {
        $('.billinfo,.orderfiles').prop("disabled", true); $('#lblPoNo').text('Draft');
        $("#loader").hide(); $('.page-heading').text('New Purchase Order');
        $(".top-action").empty(); $(".order-files").addClass('hidden');
    }
}
function getPurchaseOrderPayments(oid) {
    $('.paymentlist').empty();
    if (oid > 0) {
        let option = { strValue1: oid };
        $.ajax({
            url: "/PurchaseOrder/GetPurchaseOrderPayments", type: "Get", beforeSend: function () { $("#loader").show(); }, data: option,
            success: function (result) {
                try {
                    let data = JSON.parse(result); let paid_amt = 0.00; let itemHtml = '';
                    $.each(data, function (key, row) {
                        paid_amt = paid_amt + parseFloat(row.amount);
                        itemHtml += '<tr>';
                        itemHtml += '<td>' + row.datec + '</td>';
                        itemHtml += '<td class="text-right" data-amount="' + row.amount.toFixed(2) + '">$' + row.amount.toFixed(2) + '</td>';
                        itemHtml += '<td>' + row.paymenttype + '</td>';
                        itemHtml += '<td>' + row.num_payment + '</td>';
                        itemHtml += '</tr>';
                    });
                    $('.paymentlist').append(itemHtml);
                    $('#paidTotal').text(formatCurrency(paid_amt)); $('#paidTotal').data('paid', paid_amt.toFixed(2));
                }
                catch (error) { $("#loader").hide(); swal('Alert!', "something went wrong.", "error"); }
            },
            complete: function () { $("#loader").hide(); isEdit(false); },
            error: function (xhr, status, err) { $("#loader").hide(); swal('Alert!', "something went wrong.", "error"); }, async: false
        });
        bindfileuploade();
    }
    else {
        $('.billinfo').prop("disabled", true); $('#lblPoNo').text('Draft');
        $("#loader").hide(); $('.page-heading').text('New Purchase Order');
        $(".top-action").empty();
    }
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Purchase Order File Upload ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function Adduploade() {
    var formData = new FormData();
    var file = document.getElementById("ImageFile").files[0];
    formData.append("ImageFile", file);

    var Name = parseInt($('#lblPoNo').data('id')) || 0;
    formData.append("Name", Name);
    if (file == "") { swal('Alert', 'Please upload files', 'error').then(function () { swal.close(); }); }
    else {

        $.ajax({
            type: 'post', url: '/Reception/FileUploade', processData: false, contentType: false, data: formData,
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
    let id = parseInt($('#lblPoNo').data('id')) || 0;
    var obj = { strValue1: id };
    $.ajax({
        type: "POST", url: '/Reception/GetfileuploadData', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let itemHtml = '';
            $.each(data, function (key, row) {
                itemHtml += '<tr id="tritemId_' + row.ID + '" data-id="' + row.ID + '">';
                itemHtml += '<td><a target="popup" href="../../Content/PurchaseFiles/' + row.product_name + '">' + row.product_name + '</i></a ></td>';
                itemHtml += '<td>' + row.product_label + 'KB' + '</td>';
                itemHtml += '<td>' + row.sellingpric + '</td>';
                itemHtml += '<td class="text-right"><button class="btn menu-icon-gr text-red btnDeleteItem editbutton orderfiles" disabled onClick="Deletefileupload(' + row.ID + ')" data-toggle="tooltip" title="Delete Document" data-placement="right"><i class="glyphicon glyphicon-trash"></i></button></td>';
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
    $.post('/Reception/Deletefileuploade', obj).then(response => {
        if (response.status == true) {
            if (response.url == "Manage") {
                swal('Success', response.message, 'success'); bindfileuploade();
            }
            else swal('Success', response.message, 'success');
        }
        else swal('Alert!', response.message, 'error')
    }).catch(err => { swal.hideLoading(); swal('Error!', 'something went wrong', 'error'); }).always(function () { $("#loader").hide(); });
}