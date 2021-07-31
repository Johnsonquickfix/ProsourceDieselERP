$("#loader").hide();
getIncoterm();
getVendor();
getPaymentTerm();
getPaymentType();
getBalanceDays();

$('#ddlVendor').change(function () {
    var VendorID = $('#ddlVendor').val();
    var obj = { VendorID: VendorID };
    jQuery.ajax({
        url: "/PurchaseOrder/GetVendorByID", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            $('#txtRefvendor').val(data[0].vendor);
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });
})
$('#ddlIncoTerms').change(function () {
    var IncotermsTypeID = $('#ddlIncoTerms').val();
    var obj = { IncotermsTypeID: IncotermsTypeID };
    jQuery.ajax({
        url: "/PurchaseOrder/GetIncotermByID", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            $('#txtIncoTerms').val(data[0].short_description);
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });
})
function getBalanceDays() {

    $.ajax({
        url: "/PurchaseOrder/GetBalanceDays",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please Select Balance Days</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlBalancedays').html(opt);
        }

    });
}
function getIncoterm() {
    $.ajax({
        url: "/PurchaseOrder/GetIncoterm",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please Select IncoTerms</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlIncoTerms').html(opt);
        }

    });
}
function getVendor() {
    $.ajax({
        url: "/PurchaseOrder/GetVendor",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please Select Vendor</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlVendor').html(opt);
        }

    });
}
function getPaymentTerm() {

    $.ajax({
        url: "/PurchaseOrder/GetPaymentTerm",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please Select Payment Term</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlPaymentTerms').html(opt);
        }

    });
}
function getPaymentType() {

    $.ajax({
        url: "/PurchaseOrder/GetPaymentType",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please Select Payment Type</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlPaymentType').html(opt);
        }

    });
}

$("#btnSave").click(function () {
    saveVendor();
});
function saveVendor() {
    ID = $("#hfid").val();
    VendorID = $("#ddlVendor").val();
    Vendor = $("#ddlVendor").find('option:selected').text();;

    VendorCode = $("#txtRefvendor").val();
    PaymentTerms = $("#ddlPaymentTerms").val();
    Balancedays = $("#ddlBalancedays").val();
    PaymentType = $("#ddlPaymentType").val();
    Planneddateofdelivery = $("#txtPlanneddateofdelivery").val();
    IncoTermType = $("#ddlIncoTerms").val();
    IncoTerm = $("#txtIncoTerms").val();
    NotePublic = $("#txtNotePublic").val();
    NotePrivate = $("#txtNotePrivate").val();



    if (VendorID == "-1") { swal('alert', 'Please Select Vendor', 'error').then(function () { swal.close(); $('#ddlVendor').focus(); }) }
    else if (VendorCode == "") { swal('alert', 'Please Enter Refvendor', 'error').then(function () { swal.close(); $('#txtRefvendor').focus(); }) }
    else if (PaymentTerms == "-1") { swal('alert', 'Please Select Payment Terms', 'error').then(function () { swal.close(); $('#ddlPaymentTerms').focus(); }) }
    else if (Balancedays == "-1") { swal('alert', 'Please Select Balance days', 'error').then(function () { swal.close(); $('#ddlBalancedays').focus(); }) }
    else if (PaymentType == "-1") { swal('alert', 'Please Select Payment Type', 'error').then(function () { swal.close(); $('#ddlPaymentType').focus(); }) }
    else if (Planneddateofdelivery == "") { swal('alert', 'Please Select Planned date of delivery', 'error').then(function () { swal.close(); $('#txtPlanneddateofdelivery').focus(); }) }
    else if (IncoTermType == "-1") { swal('alert', 'Please Select IncoTerm', 'error').then(function () { swal.close(); $('#ddlIncoTerms').focus(); }) }
    else if (IncoTerm == "") { swal('alert', 'Please Enter IncoTerm', 'error').then(function () { swal.close(); $('#txtIncoTerms').focus(); }) }
    else if (NotePublic == "") { swal('alert', 'Please Enter Note Public', 'error').then(function () { swal.close(); $('#txtNotePublic').focus(); }) }
    else if (NotePrivate == "") { swal('alert', 'Please Enter Note Private', 'error').then(function () { swal.close(); $('#txtNotePrivate').focus(); }) }
    else {
        var obj = {
            rowid: ID, VendorID: VendorID, Vendor: Vendor, VendorCode: VendorCode, PaymentTerms:PaymentTerms, Balancedays: Balancedays,
            PaymentType: PaymentType, Planneddateofdelivery: Planneddateofdelivery,
            IncotermType: IncoTermType, Incoterms: IncoTerm, note_public: NotePublic, note_private: NotePrivate,
        }
        $.ajax({
            url: '/PurchaseOrder/NewPurchase/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success');
                    $("#parent").find(":input").each(function () {
                        switch (this.type) { case "text": case "email": case "tel": $(this).val(''); break; }
                    });
                    //window.location = "../../PurchaseOrder/PurchaseList";
                }
                else {
                    //swal('Alert!', data.message, 'error')
                }
            },
            complete: function () {
                $("#loader").hide();
            },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
        })
    }

}
function GetPurchaseOrderByID(id) {
    var rowid = id;
   /* if (rowid == "NewVendor") { $('#lbltitle').text("Add New Vendor"); } else { $('#lbltitle').text("Update Vendor"); }*/
    var obj =
        $.ajax({
            url: "/PurchaseOrder/GetPurchaseOrderByID/" + rowid,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            success: function (data) {
                var d = JSON.parse(data);
                if (d.length > 0) {
                    $('#lblRequestAuthor').text(d[0].RequestAuthor);
                    $('#lblVendor').text(d[0].VendorName);
                    $('#lblRefvendor').text(d[0].RefOrderVendor);
                    $('#lblPaymentTerms').text(d[0].PaymentTerm);
                    $('#lblBalance').text(d[0].Balance);
                    $('#lblPaymentType').text(d[0].PaymentType);
                    $('#lblPlanneddateofdelivery').text(d[0].PlannedDateofDelivery);
                    $('#lblIncoterms').text(d[0].incoterms);
                    $('#lblNotePublic').text(d[0].note_public);
                    $('#lblNotePrivate').text(d[0].note_private);
                   
                }
            },
            error: function (msg) {

            }
        });

}

//-----bind Item Table ---------------------------
function bindItemListDataTable(data) {
    var layoutHtml = '';
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].product_id > 0) {
                if ($('#tritemId_' + data[i].PKey).length <= 0) {
                    layoutHtml += '<tr id="tritemId_' + data[i].PKey + '" data-id="' + data[i].PKey + '" data-pid="' + data[i].product_id + '" data-vid="' + data[i].variation_id + '" data-pname="' + data[i].product_name + '" data-gid="' + data[i].group_id + '" data-freeitem="' + data[i].is_free + '" data-orderitemid="' + data[i].order_item_id + '">';
                    if (data[i].is_free)
                        layoutHtml += '<td class="text-center"></td>';
                    else
                        layoutHtml += '<td class="text-center"><button class="btn menu-icon-gr text-red btnDeleteItem billinfo" tabitem_itemid="' + data[i].PKey + '" onclick="removeItemsInTable(\'' + data[i].PKey + '\');"> <i class="glyphicon glyphicon-trash"></i> </button></td>';
                    layoutHtml += '<td>' + data[i].product_name + '</td>';
                    layoutHtml += '<td class="text-right">' + data[i].reg_price.toFixed(2) + '</td>';
                    if (data[i].is_free)
                        layoutHtml += '<td><input min="1" autocomplete="off" disabled class="form-control billinfo number rowCalulate" type="number" id="txt_ItemQty_' + data[i].PKey + '" value="' + data[i].quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
                    else
                        layoutHtml += '<td><input min="1" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_ItemQty_' + data[i].PKey + '" value="' + data[i].quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
                    layoutHtml += '<td class="TotalAmount text-right" data-regprice="' + data[i].reg_price + '"data-salerate="' + data[i].sale_rate + '" data-discount="' + data[i].discount + '" data-amount="' + data[i].total + '" data-taxamount="' + data[i].tax_amount + '" data-shippingamt="' + data[i].shipping_amount + '">' + data[i].total.toFixed(2) + '</td>';
                    layoutHtml += '<td class="text-right RowDiscount" data-disctype="' + data[i].discount_type + '" data-couponamt="0">' + data[i].discount.toFixed(2) + '</td>';
                    layoutHtml += '<td class="text-right RowTax">' + data[i].tax_amount + '</td>';
                    layoutHtml += '</tr>';
                }
                else {
                    var zQty = parseFloat($('#txt_ItemQty_' + data[i].rd_id).val()) || 0.00;
                    $('#txt_ItemQty_' + data[i].rd_id).val((parseFloat($('#txt_ItemQty_' + data[i].PKey).val()) + data[i].quantity).toFixed(2));
                }
            }
        }
        $('#order_line_items').append(layoutHtml);
        $("#divAddItemFinal").find(".rowCalulate").change(function () { calculateDiscountAcount(); });
    }
    else {
        layoutHtml += '<table id="tblAddItemFinal" class="table-blue table table-bordered table-striped dataTable">';
        layoutHtml += '<thead>';
        layoutHtml += '<tr>';
        layoutHtml += '<th class="text-center" style="width: 5%">Actions</th>';
        layoutHtml += '< th style = "width: 55%" > Item</th >';
        layoutHtml += '<th class="text-right" style="width: 8%">Sale Price</th>';
        layoutHtml += '<th class="text-right" style="width: 8%">Quantity</th>';
        layoutHtml += '<th class="text-right" style="width: 8%">Sub-Total</th>';
        layoutHtml += '<th class="text-right" style="width: 8%">Discount</th>';
        layoutHtml += '<th class="text-right" style="width: 8%">Tax</th>';
        layoutHtml += '</tr>';
        layoutHtml += '</thead>';
        layoutHtml += '<tbody id="order_line_items"></tbody><tbody id="order_state_recycling_fee_line_items"></tbody><tbody id="order_fee_line_items"></tbody><tbody id="order_refunds"></tbody>';
        layoutHtml += '</table>';
        $('#divAddItemFinal').empty().html(layoutHtml);
    }
    calculateDiscountAcount();
    ApplyAutoCoupon();
    //calcFinalTotals();
}

$("#ddlProduct").change(function () { if ($('#ddlProduct').val() == null) return false; getItemList(); $('#ddlProduct').val('').trigger('change'); });

function getItemList() {
    var res = $('#ddlProduct').val().split('$');
    var pid = parseInt(res[0]) || 0, vid = parseInt(res[1]) || 0;
    var obj = { strValue1: pid, strValue2: vid };
    var tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00;
    $.ajax({
        type: "POST", url: '/PurchaseOrder/GetProductInfo', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            var itemsDetailsxml = [], auto_code = [];
            for (var i = 0; i < data.length; i++) {
                let coupon_amt = 0.00, coupon_type = 'fixed_product', row_key = data[i].product_id + '_' + data[i].variation_id;
                
                itemsDetailsxml.push({
                    PKey: row_key, product_id: data[i].product_id, variation_id: data[i].variation_id, product_name: data[i].product_name, quantity: data[i].quantity, reg_price: data[i].reg_price, sale_rate: data[i].sale_price, total: (data[i].reg_price * data[i].quantity), discount_type: coupon_type, discount: coupon_amt, tax_amount: (((data[i].reg_price * data[i].quantity) * tax_rate) / 100).toFixed(2), shipping_amount: 0, is_free: data[i].is_free, group_id: data[i].group_id, order_item_id: 0
                });
            }
        },
        complete: function () { $("#loader").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
        async: false
    });
}