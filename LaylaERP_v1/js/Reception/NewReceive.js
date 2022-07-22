$(document).ready(function () {
    $("#loader").hide(); $('.billinfo').prop("disabled", true);
    $('#txtPODate,#txtPlanneddateofdelivery').datepicker({ format: 'mm/dd/yyyy', autoclose: true, todayHighlight: true });
    $(".select2").select2();
    getVendor(); getMasters();
    getPurchaseOrderInfo()
    //getwarehaouseid();
    getPurchasehistory();
    getinvoicehistory();
    bindfileuploade();


    if ($("#hfstatus").val() == "5") {
        $(".btnpoclosed").show();

    }
    else {
        $(".btnpoclosed").hide();

    }
    //console.log($("#hftext").val());
    //if ($("#hfstatus").val() == "5") {
    //    console.log(hftext);
    //    $('.page-heading').empty().text($("#hftext").val()).append('<a class="btn btn-danger" href="/Reception/ReceiveOrder/1000021">Back to List</a>');
    //}
    //else if ($("#hfstatus").val() == "6") {
    //    console.log(6);
    //    $('.page-heading').empty().text($("#hftext").val()).append('<a class="btn btn-danger" href="/Reception/ReceiveOrder/1000022">Back to List</a>');
    //}
    //else {
    //    $('.page-heading').empty().text($("#hftext").val()).append('<a class="btn btn-danger" href="/Reception/ReceiveOrder">Back to List</a>');
    //}



    //$("#ddlVendor").change(function () {
    //    let today = new Date();
    //    $('#txtPODate').val(today.toLocaleDateString("en-US"));
    //    // $('.entry-mode-action').empty().append('<button type="button" id="btnOtherProduct" class="btn btn-danger billinfo"><i class="fas fa-cube"></i> Add Other Product</button> ');
    //    // $('.entry-mode-action').append('<button type="button" id="btnService" class="btn btn-danger billinfo"><i class="fas fa-concierge-bell"></i> Add Service</button>');
    //    $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder">Back to List</a><button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" data-placement="bottom" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button><input type="submit" value="Create Order" id="btnSave" class="btn btn-danger billinfo" />');
    //    $('.billinfo').prop("disabled", false);
    //    let VendorID = parseInt($('#ddlVendor').val()) || 0;
    //    getVendorProducts(VendorID);
    //    setTimeout(function () {
    //        let _details = getVendorDetails();
    //        if (_details.length > 0) {
    //            $('#txtRefvendor').val(_details[0].code_vendor);
    //            $('#ddlPaymentTerms').val((parseInt(_details[0].PaymentTermsID) || 0)).trigger('change');
    //            $('#ddlBalancedays').val((parseInt(_details[0].BalanceID) || 0)).trigger('change');
    //            $('#ddlIncoTerms').val((parseInt(_details[0].fk_incoterms) || 0)).trigger('change');
    //            $('#ddlPaymentType').val((parseInt(_details[0].Paymentmethod) || 0)).trigger('change');
    //            $('#txtIncoTerms').val(_details[0].location_incoterms);
    //            //$('#ddlwarehouse').val((parseInt(_details[0].fk_warehouse) || 0)).trigger('change');
    //        }
    //    }, 50);
    //});


    //$('#ddlProduct').select2({
    //    allowClear: true, minimumInputLength: 3, placeholder: "Search Product",
    //    ajax: {
    //        url: '/PurchaseOrder/SearchProducts', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
    //        data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
    //        processResults: function (data) { var jobj = JSON.parse(data); return { results: jobj }; },
    //        error: function (xhr, status, err) { }, cache: true
    //    }
    //});
    //$("#ddlProduct").change(function () {
    //    let product_id = parseInt($('#ddlProduct').val()) || 0, vender_id = parseInt($('#ddlVendor').val()) || 0;
    //    getItemList(product_id, vender_id); //$('#ddlProduct').val('').trigger('change');
    //});
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

   
    $(document).on("click", ".btnEdit", function (t) {
        t.preventDefault(); $("#loader").show();
        $('#ddlVendor').prop("disabled", true); $('.billinfo').prop("disabled", true); //$('#txtbillfirstname').focus();
        $('.entry-mode-action').empty().append('<button type="button" id="btnOtherProduct" class="btn btn-danger billinfo"><i class="fas fa-cube"></i> Add Other Product</button> ');
        $('.entry-mode-action').append('<button type="button" id="btnService" class="btn btn-danger billinfo"><i class="fas fa-concierge-bell"></i> Add Service</button>');

        if ($("#hfstatus").val() == "5")  
            $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder/1000011">Back to List</a><button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" data-placement="bottom" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button><button type="button" class="btn btn-danger btnUndoRecord"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" class="btn btn-danger" id="btnSave"><i class="far fa-save"></i> Update</button>');
         else
            $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder">Back to List</a><button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" data-placement="bottom" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button><button type="button" class="btn btn-danger btnUndoRecord"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" class="btn btn-danger" id="btnSave"><i class="far fa-save"></i> Update</button>');

        $(".top-action").empty().append('<button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button><button type="button" class="btn btn-danger btnUndoRecord" data-toggle="tooltip" title="Cancel"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" class="btn btn-danger" id="btnSave" data-toggle="tooltip" title="Update"><i class="far fa-save"></i> Update</button>');
        $('.billinfofo').prop("disabled", false);


        if ($("#hfstatus").val() == "5") {
            $(".btnpoclosed").show();

        }
        else {
            $(".btnpoclosed").hide();

        }
        $('.btnpoopen').hide();
        $("#loader").hide();
        isEdit(true);

        $("#txtshippingfee").change(function () { calculateFinal() });
        $("#txtotherfee").change(function () { calculateFinal() });

    });
    $(document).on("click", ".btnUndoRecord", function (t) { t.preventDefault(); $("#loader").show(); getPurchaseOrderInfo(); $('.btnpoopen').hide(); });
    $(document).on("click", "#btnOtherProduct", function (t) { t.preventDefault(); AddProductModal(0, 0); });
    $(document).on("click", "#btnService", function (t) { t.preventDefault(); AddProductModal(1, 0); });
    $("#POModal").on("click", "#btnAddProc", function (t) {
        t.preventDefault();
        let rang = parseInt($(this).data('rang')) || 0, proc_type = parseInt($(this).data('proc_type')) || 0;
        bindOtherItems(proc_type, rang);
    });
    $("#POModal").on("change", ".addCalulate", function (t) {
        t.preventDefault();
        let rQty = 0.00, rPrice = 0.00, rDescPer = 0.00, rTotal = 0.00;
        rQty = parseFloat($("#txt_proc_Recqty").val()) || 0.00;
        rQty = parseFloat($("#txt_proc_qty").val()) || 0.00;
        rPrice = parseFloat($("#txt_proc_price").val()) || 0.00;
        rDescPer = parseFloat($("#txt_proc_disc").val()) || 0.00;
        rTotal = ((rPrice * rQty) - (rPrice * rQty) * (rDescPer / 100));
        $("#txt_proc_total").val(rTotal.toFixed(2));
    });
    $(document).on("click", "#btnSave", function (t) {
        t.preventDefault();
        saveVendorPO();
         
    });
    $(document).on("click", "#btnPrintPdf", function (t) {
        t.preventDefault();
        let id = parseInt($('#lblPoNo').data('id')) || 0;
        getPurchaseOrderPrint(id, false);
    });

    $(".btnpoopen").hide();

    

    let fk_projetval = 0;
    fk_projetval = parseInt($("#hfsaleno").val()) || 0
    //console.log(fk_projetval);
    if (fk_projetval == "0" && $("#hfstatus").val() == "3") {
        $(".btnEdit").show();
    }
    else {
        
        if ($("#hfstatus").val() == "6") {
            $('.btnEdit').hide();
            $('.btnpoopen').show();
        }
        else if ($("#hfstatus").val() == "5") {
            $('.btnEdit').show();
            $('.btnpoopen').hide();
        }
        else {
            $('.btnEdit').hide();
        }

    }

});
//function getMasters() {
//    $.ajax({
//        url: "/PurchaseOrder/GetAllMaster",
//        type: "Get", beforeSend: function () { $("#loader").show(); },
//        success: function (data) {
//            let dt = JSON.parse(data);
//            //Payment Terms
//            $("#ddlPaymentTerms").html('<option value="0">Select Payment Term</option>');
//            for (i = 0; i < dt['Table'].length; i++) { $("#ddlPaymentTerms").append('<option value="' + dt['Table'][i].id + '">' + dt['Table'][i].text + '</option>'); }

//            //Payment Type
//            $("#ddlPaymentType").html('<option value="0">Select Payment Type</option>');
//            for (i = 0; i < dt['Table1'].length; i++) { $("#ddlPaymentType").append('<option value="' + dt['Table1'][i].id + '">' + dt['Table1'][i].text + '</option>'); }

//            //Balance
//            $("#ddlBalancedays").html('<option value="0">Select Balance days</option>');
//            for (i = 0; i < dt['Table2'].length; i++) { $("#ddlBalancedays").append('<option value="' + dt['Table2'][i].id + '">' + dt['Table2'][i].text + '</option>'); }

//            //Balance
//            $("#ddlIncoTerms").html('<option value="0">Select Incoterms</option>');
//            for (i = 0; i < dt['Table3'].length; i++) { $("#ddlIncoTerms").append('<option value="' + dt['Table3'][i].id + '">' + dt['Table3'][i].text + '</option>'); }

//            //Warehouse
//            $("#ddlwarehousepo").html('<option value="0">Select Warehouse</option>');
//            for (i = 0; i < dt['Table4'].length; i++) { $("#ddlwarehousepo").append('<option value="' + dt['Table4'][i].id + '">' + dt['Table4'][i].text + '</option>'); }

//            $("#ddlwarehouse").html('<option value="0">Select Warehoused</option>');
//            for (i = 0; i < dt['Table4'].length; i++) { $("#ddlwarehouse").append('<option value="' + dt['Table4'][i].id + '">' + dt['Table4'][i].text + '</option>'); }
//        },
//        complete: function () { $("#loader").hide(); },
//        error: function (xhr, status, err) { $("#loader").hide(); }, async: false
//    });
//}

function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}
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
            $("#ddlwarehouse").html('<option value="0">Select Warehouse</option>');
            for (i = 0; i < dt['Table4'].length; i++) { $("#ddlwarehouse").append('<option value="' + dt['Table4'][i].id + '">' + dt['Table4'][i].text + '</option>'); }


            //$("#ddlwarehousepo").html('<option value="0">Select Warehouse</option>');
            //for (i = 0; i < dt['Table4'].length; i++) { $("#ddlwarehousepo").append('<option value="' + dt['Table4'][i].id + '">' + dt['Table4'][i].text + '</option>'); }

            //$("#ddlwarehouse").html('<option value="0">Select Warehoused</option>');
            //for (i = 0; i < dt['Table4'].length; i++) { $("#ddlwarehouse").append('<option value="' + dt['Table4'][i].id + '">' + dt['Table4'][i].text + '</option>'); }

            //Warehouse
            //$("#ddlWarehouse").html('<option value="0">Select Warehouse</option>');
            //for (i = 0; i < dt['Table4'].length; i++) { $("#ddlWarehouse").append('<option value="' + dt['Table4'][i].id + '" data-ad="' + dt['Table4'][i].address + '">' + dt['Table4'][i].text + '</option>'); }
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
function getwarehaouseid() {
   let VendorID = parseInt($('#ddlVendor').val()) || 0;
    //$.ajax({
    //    url: "/Reception/Getwarehouse", dataType: 'json', type: "get", contentType: "application/json; charset=utf-8",
    //    type: "Get",
    //    data: { strValue1: VendorID },
    //    success: function (data) {
    //        $('#ddlwarehouse').append('<option value="-1">Please Select Warehouse</option>');
    //        for (var i = 0; i < data.length; i++) {
    //            $('#ddlwarehouse').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
    //        }
    //    }, async: false
    //});
    let option = { strValue1: 'GEVWH', strValue2: VendorID };
    $.ajax({
        url: "/PurchaseOrder/GetAllMaster", data: option, type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data); //console.log(dt);
            $("#ddlwarehouse").html('<option value="0">Select Warehouse</option>');
            for (i = 0; i < dt['Table'].length; i++) { $("#ddlwarehouse").append('<option value="' + dt['Table'][i].id + '" data-ad="' + dt['Table'][i].address + '">' + dt['Table'][i].text + '</option>'); }
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }, async: false
    });
  //  $('#ddlwarehouse').val($('#ddlwarehousepo').val()).trigger('change');
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
function getVendorProducts(VendorID) {
    //$('#line_items').empty(); calculateFinal();
    //$.ajax({
    //    url: '/PurchaseOrder/GetVenderProducts', dataType: 'json', type: "get", contentType: "application/json; charset=utf-8",
    //    data: { strValue1: VendorID },
    //    success: function (data) {
    //        let dt = JSON.parse(data);
    //        //Payment Terms
    //        $("#ddlProduct").html('<option value="0">Select Product</option>');
    //        for (i = 0; i < dt.length; i++) { $("#ddlProduct").append('<option value="' + dt[i].id + '">' + dt[i].text + '</option>'); }

    //    },
    //    error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }, async: false
    //});
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Item Tab Section ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getItemList(product_id, vender_id) {
    let option = { strValue1: product_id, strValue2: vender_id };
    $.ajax({
        type: "get", url: '/PurchaseOrder/SearchProductDetails', contentType: "application/json; charset=utf-8", dataType: "json", data: option,
        beforeSend: function () { $("#loader").show(); },
        success: function (data) { bindItems(data); },
        complete: function () { $("#loader").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
        async: false
    });
}
function bindItems(data) {
    let itemHtml = '';
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].fk_product > 0) {
                if ($('#tritemid_' + data[i].fk_product).length <= 0) {
                    itemHtml += '<tr id="tritemid_' + data[i].fk_product + '" class="paid_item" data-pid="' + data[i].fk_product + '" data-pname="' + data[i].description + '" data-psku="' + data[i].product_sku + '" data-rowid="' + data[i].rowid + '">';
                    itemHtml += '<td class="text-center"><button class="btn p-0 text-red btnDeleteItem billinfo" onclick="removeItems(\'' + data[i].fk_product + '\');"> <i class="glyphicon glyphicon-trash"></i> </button></td>';
                    itemHtml += '<td>' + data[i].description + '</td><td>' + data[i].product_sku + '</td>';
                    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + data[i].fk_product + '" value="' + data[i].subprice + '" name="txt_itemprice" placeholder="Price"></td>';
                    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemqty_' + data[i].fk_product + '" value="' + data[i].qty + '" name="txt_itemqty" placeholder="Qty."></td>';
                    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemdisc_' + data[i].fk_product + '" value="' + data[i].discount_percent + '" name="txt_itemdisc" placeholder="Discount"></td>';
                    itemHtml += '<td class="text-right tax-amount" data-tax1="' + data[i].localtax1_tx + '" data-tax2="' + data[i].localtax2_tx + '">' + data[i].total_localtax1 + '</td>';
                    itemHtml += '<td class="text-right ship-amount">' + data[i].total_localtax2 + '</td>';
                    itemHtml += '<td class="text-right row-total">' + data[i].total_ttc.toFixed(2) + '</td>';
                    itemHtml += '</tr>';
                }
                else { $('#txt_itemqty_' + data[i].rowid).val((parseFloat($('#txt_itemqty_' + data[i].rowid).val()) + data[i].qty).toFixed(2)); }
            }
        }
        $('#line_items').append(itemHtml); $("#divAddItemFinal").find(".rowCalulate").change(function () { calculateFinal(); });
    }
    calculateFinal();
}
function removeItems(id) {
    //------------- Remove data in Temp AddItemList-----
    swal({ title: "Are you sure?", text: 'Would you like to remove this item?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) {
                $('#tritemid_' + id).remove();
                calculateFinal();
            }
        });
}
function calculateFinal() {
    let tGrossAmt = 0.00, tDisAmt = 0.00, tTax_Amt1 = 0.00, tTax_Amt2 = 0.00, tNetAmt = 0.00, status = 0, tquty = 0, tpquty = 0, tproduct = 0, torder = 0, trecve = 0, tremaning = 0, tremanigval = 0, rshipAmt = 0.00, rothrAmt = 0.00, avg = 0.00, ravg = 0.00;
    var chkqty = '';
    //main item

    $("#line_items > tr.paid_item").each(function (index, row) {
        let rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rGrossAmt = 0.00, rDisAmt = 0.00, rTax1 = 0.00, rTax_Amt1 = 0.00, rTax2 = 0.00, rTax_Amt2 = 0.00, rNetAmt = 0.00, rpQty = 0.00, prvQty = 0.00, totalqty = 0.00, chkqtyval = 0.00;
        rPrice = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        rpQty = parseFloat($(row).find("[name=txt_itemqty]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_itemRecqty]").val()) || 0.00;
        rQtyremaning = parseFloat($(row).find("[name=txt_itemremaningqty]").val()) || 0.00;
        prvQty = parseFloat($(row).find("[name=txt_itembalqty]").val()) || 0.00;
        rDisPer = parseFloat($(row).find("[name=txt_itemdisc]").val()) || 0.00;
        rTax1 = parseFloat($(row).find(".tax-amount").data('tax1')) || 0.00; rTax2 = parseFloat($(row).find(".tax-amount").data('tax2')) || 0.00;

        totalqty = rQty + prvQty;

        tproduct += 1;
        torder += rpQty;
        trecve += prvQty;
        tremaning += rQty;
        tremanigval += rQtyremaning;

        if (rpQty <= totalqty)
            chkqty += '1,';
        else
            chkqty += '0,';
        //if (rQty == 0) {
        //    swal('Alert!', "Receive quantity should not be zero", "error");
        //    parseFloat($(row).find("[name=txt_itemRecqty]").val(1.00));
        //}
        // else if (totalqty > rpQty) {
        /// if (totalqty > rpQty) {
        // swal('Alert!', "you can't receive greater quantity form  actual quantity", "error");
        //  parseFloat($(row).find("[name=txt_itemRecqty]").val(0.00));
        // tpquty += prvQty;
        //}
        //else {
        rGrossAmt = rPrice * rQty; rDisAmt = rGrossAmt * (rDisPer / 100);
        rTax_Amt1 = rTax1 * rQty; rTax_Amt2 = rTax2 * rQty;
        rNetAmt = (rGrossAmt - rDisAmt) + rTax_Amt1 + rTax_Amt2;
        $(row).find(".tax-amount").text(rTax_Amt1.toFixed(2)); $(row).find(".ship-amount").text(rTax_Amt2.toFixed(2));
       // $(row).find(".row-total").text(rNetAmt.toFixed(2));
        $(row).find(".row-total").text(formatCurrency(rNetAmt));
        tGrossAmt += rGrossAmt, tDisAmt += rDisAmt, tTax_Amt1 += rTax_Amt1, tTax_Amt2 += rTax_Amt2, tNetAmt += rNetAmt;

       
        rshipAmt = parseFloat($("#txtshippingfee").val()) || 0.00;
        //console.log(tNetAmt, rshipAmt, rothrAmt);
        rothrAmt = parseFloat($("#txtotherfee").val()) || 0.00;
        if (rQty > 0) {
            avg = (rGrossAmt + rshipAmt + rothrAmt) / rQty;
        }
        else {
            avg = 0;
        }
      //  ravg += avg;
        $(row).find(".row-avg").text(formatCurrency(avg));
        ravg += avg;
        tpquty += totalqty;

        //}
        tquty += rpQty;

       // console.log('A', ravg);
        // console.log('R', tpquty);
    });
    //other item
    $("#product_line_items > tr.other_item").each(function (index, row) {
        let rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rDisAmt = 0.00, rTax_Amt1 = 0.00, rGrossAmt = 0.00, rNetAmt = 0.00;
        rPrice = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_itemRecqty]").val()) || 0.00;
        rDisPer = parseFloat($(row).find("[name=txt_itemdisc]").val()) || 0.00;
        rGrossAmt = rPrice * rQty; rDisAmt = rGrossAmt * (rDisPer / 100);
        rNetAmt = (rGrossAmt - rDisAmt) + rTax_Amt1;
        $(row).find(".tax-amount").text(rTax_Amt1.toFixed(2)); $(row).find(".row-total").text(rNetAmt.toFixed(2));
        tGrossAmt += rGrossAmt, tDisAmt += rDisAmt, tTax_Amt1 += rTax_Amt1, tNetAmt += rNetAmt;
    });
    tNetAmt = tNetAmt + rshipAmt + rothrAmt;
    //$("#SubTotal").text(tGrossAmt.toFixed(2));
    $("#SubTotal").text(formatCurrency(tGrossAmt)); $("#SubTotal").data('total', tGrossAmt.toFixed(2));
    $("#avgcost").text(formatCurrency(ravg)); $("#avgcost").data('total', ravg.toFixed(2));
    //$("#discountTotal").text(tDisAmt.toFixed(2));
    $("#discountTotal").text(formatCurrency(tDisAmt)); $("#discountTotal").data('total', tDisAmt.toFixed(2));
    $("#salesTaxTotal").text(rothrAmt.toFixed(2));
    $("#shippingTotal").text(rshipAmt.toFixed(2));
   // $("#orderTotal").html(tNetAmt.toFixed(2));
    $("#orderTotal").html(formatCurrency(tNetAmt)); $("#orderTotal").data('total', tNetAmt.toFixed(2));
    $("#Totalqty").html(tproduct);
    $("#Totalorder").html(torder);
    $("#Totalrecived").html(trecve);
    $("#Totalbalc").html(tremaning);
    $("#Totalremanig").html(tremanigval);

    /*  $("#QtyTotal").html(tquty.toFixed(2));*/
    $("#QtyTotal").html(chkqty);
    $("#QtyRecTotal").html(tpquty.toFixed(2));
}

function formatCurrency(total) {
    var neg = false;
    if (total < 0) {
        neg = true;
        total = Math.abs(total);
    }
    return (neg ? "-$" : '$') + parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Add Other Product and Services ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function AddProductModal(proc_type, row_num) {
    let row = $('#tritemid_' + row_num);
    let rDesc = row.find('.item-desc').text(), rSku = row.find('.item-sku').text(), rSDate = '', rEDate = '', rQty = 0.00, rPrice = 0.00, rDescPer = 0.00, rTotal = 0.00;
    rQty = parseInt(row.find("[name=txt_itemqty]").val()) || 1;
    rPrice = parseFloat(row.find("[name=txt_itemprice]").val()) || 0;
    rDescPer = parseFloat(row.find("[name=txt_itemdisc]").val()) || 0;
    rTotal = parseFloat(row.find(".row-total").text()) || 0;

    var prodHtml = '<div class="modal-dialog">';
    prodHtml += '<div class="modal-content">';
    prodHtml += '<div class="modal-header">';
    prodHtml += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    prodHtml += '<h4 class="modal-title" id="myModalLabel">Add ' + (proc_type == 0 ? 'Other Product' : 'Service') + '</h4>';
    prodHtml += '</div>';
    prodHtml += '<div class="modal-body">';

    prodHtml += '<div class="row">';
    prodHtml += '<div class="col-md-12">Description<span class="text-red">*</span>';
    prodHtml += '<input class="form-control" type="input" id="txt_proc_desc" placeholder="Description" maxlength="250" autocomplete="off" value="' + rDesc + '">';
    prodHtml += '</div>';
    if (proc_type == 0) {
        prodHtml += '<div class="col-md-12">Vender SKU';
        prodHtml += '<input class="form-control" type="input" id="txt_proc_sku" placeholder="Vender SKU" maxlength="150" autocomplete="off" value="' + rSku + '">';
        prodHtml += '</div>';
    }
    else {
        prodHtml += '<div class="col-md-6">From Date';
        prodHtml += '<input class="form-control date-picker" type="input" id="txt_proc_fromdate" placeholder="MM/DD/YYYY" maxlength="150" autocomplete="off" value="">';
        prodHtml += '</div>';
        prodHtml += '<div class="col-md-6">To Date';
        prodHtml += '<input class="form-control date-picker" type="input" id="txt_proc_todate" placeholder="MM/DD/YYYY" maxlength="150" autocomplete="off" value="">';
        prodHtml += '</div>';
    }
    prodHtml += '<div class="col-md-6">Price<span class="text-red">*</span>';
    prodHtml += '<input class="form-control addCalulate" type="number" id="txt_proc_price" placeholder="Price" maxlength="20" autocomplete="off" value="' + rPrice.toFixed(2) + '">';
    prodHtml += '</div>';
    prodHtml += '<div class="col-md-6">Quantity<span class="text-red">*</span>';
    prodHtml += '<input class="form-control addCalulate" type="number" id="txt_proc_qty" placeholder="Quantity" maxlength="20" autocomplete="off" value="' + rQty + '">';
    prodHtml += '</div>';
    prodHtml += '<div class="col-md-6">ReceiveQty<span class="text-red">*</span>';
    prodHtml += '<input class="form-control addCalulate" type="number" id="txt_proc_Recqty" placeholder="Receive Quantity" maxlength="20" autocomplete="off" value="' + rQty + '">';
    prodHtml += '</div>';
    prodHtml += '<div class="col-md-6">Discount(%)';
    prodHtml += '<input class="form-control addCalulate" min="0" max="100" type="number" id="txt_proc_disc" placeholder="Discount" maxlength="20" autocomplete="off" value="' + rDescPer.toFixed(2) + '">';
    prodHtml += '</div>';
    prodHtml += '<div class="col-md-6">Total';
    prodHtml += '<input class="form-control" type="number" id="txt_proc_total" placeholder="Total" maxlength="20" autocomplete="off" value="' + rTotal.toFixed(2) + '" disabled>';
    prodHtml += '</div>';
    prodHtml += '</div>';

    prodHtml += '</div>';
    prodHtml += '<div class="modal-footer">';
    prodHtml += '<button type="button" class="btn btn-danger" id="btnAddProc" data-proc_type="' + proc_type + '" data-rang="' + row_num + '">Add</button>';
    prodHtml += '</div>';
    prodHtml += '</div>';
    prodHtml += '</div>';
    $("#POModal").empty().html(prodHtml);
    $("#POModal").modal({ backdrop: 'static', keyboard: false }); $("#txt_proc_desc").focus();
    $('.date-picker').datepicker({ format: 'mm/dd/yyyy', autoclose: true, todayHighlight: true });
}
//function bindOtherItems(proc_type, row_num) {
//    let rDesc = '', rSku = '', rSDate = '', rEDate = '', rQty = 0.00, rPrice = 0.00, rDescPer = 0.00, rTotal = 0.00;
//    if (row_num == 0) row_num = (parseInt($('#product_line_items tr:last').data("rang")) || 0) + 1;
//    rDesc = $("#txt_proc_desc").val();
//    if (rDesc == "") { swal('alert', 'Please Enter Description.', 'error').then(function () { swal.close(); $('#txt_proc_desc').focus(); }); return false; }
//    if ($('#txt_proc_qty').val() == "") { swal('alert', 'Please Enter Quantity.', 'error').then(function () { swal.close(); $('#txt_proc_qty').focus(); }); return false; }
//    if ($('#txt_proc_Recqty').val() == "") { swal('alert', 'Please Enter Quantity.', 'error').then(function () { swal.close(); $('#txt_proc_Recqty').focus(); }); return false; }
//    if ($('#txt_proc_price').val() == "") { swal('alert', 'Please Enter Price.', 'error').then(function () { swal.close(); $('#txt_proc_price').focus(); }); return false; }
//    if (proc_type == 0) {
//        rSku = $("#txt_proc_sku").val();
//    }
//    else {
//        rSDate = $("#txt_proc_fromdate").val();
//        rEDate = $("#txt_proc_todate").val();
//    }
//    rQty = parseFloat($("#txt_proc_qty").val()) || 0.00;
//    rQty = parseFloat($("#txt_proc_Recqty").val()) || 0.00;
//    rPrice = parseFloat($("#txt_proc_price").val()) || 0.00;
//    rDescPer = parseFloat($("#txt_proc_disc").val()) || 0.00;
//    rTotal = parseFloat($("#txt_proc_total").val()) || 0.00;
//    let itemHtml = '';
//    if ($('#tritemid_' + row_num).length <= 0) {
//        itemHtml += '<tr id="tritemid_' + row_num + '" class="other_item" data-rowid="0" data-rang="' + row_num + '" data-proc_type="' + proc_type + '">';
//        itemHtml += '<td class="text-center">';
//        itemHtml += '<button class="btn p-0 billinfo" onclick="AddProductModal(\'' + proc_type + '\',\'' + row_num + '\');"><i class="glyphicon glyphicon-edit"></i></button>';
//        itemHtml += '<button class="btn p-0 text-red billinfo" onclick="removeItems(\'' + row_num + '\');"><i class="glyphicon glyphicon-trash"></i></button>';
//        itemHtml += '</td > ';
//        itemHtml += '<td class="item-desc">' + rDesc + '</td><td class="item-sku">' + rSku + '</td>';
//        itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + row_num + '" value="' + rPrice.toFixed(2) + '" name="txt_itemprice" placeholder="Price"></td>';
//        itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemqty_' + row_num + '" value="' + rQty.toFixed(0) + '" name="txt_itemqty" placeholder="Qty."></td>';
//        itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemRecqty_' + row_num + '" value="' + rQty.toFixed(0) + '" name="txt_itemRecqty" placeholder="RecQty."></td>';
//        itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemdisc_' + row_num + '" value="' + rDescPer.toFixed(2) + '" name="txt_itemdisc" placeholder="Discount"></td>';
//        itemHtml += '<td class="text-right tax-amount">0.00</td><td class="text-right ship-amount">0.00</td>';
//        itemHtml += '<td class="text-right row-total">' + rTotal.toFixed(2) + '</td>';
//        itemHtml += '</tr>';
//        $('#product_line_items').append(itemHtml);
//    }
//    else {
//        $('#tritemid_' + row_num).find('.item-desc').text(rDesc); $('#tritemid_' + row_num).find('.item-sku').text(rSku);
//        $('#tritemid_' + row_num).find("[name=txt_itemprice]").val(rPrice);
//        $('#tritemid_' + row_num).find("[name=txt_itemqty]").val(rQty);
//        $('#tritemid_' + row_num).find("[name=txt_itemdisc]").val(rDescPer);
//        $('#tritemid_' + row_num).find(".tax-amount").text(0.00); $('#tritemid_' + row_num).find('.row-total').text(rTotal);
//    }
//    $("#POModal").modal('hide');
//    $("#product_line_items").find(".rowCalulate").change(function () { calculateFinal(); });
//    calculateFinal();
//}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Edit Purchase Order ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getPurchaseOrderInfo() {
    $('#divAlert').empty();
    let oid = parseInt($('#lblPoNo').data('id')) || 0;
    let totalexc = 0.00;
    let totalincl = 0.00;
    let totaldisc = 0.00;
    let ship = 0.00;
    let tax = 0.00;
    let avgcost = 0.00;
    if (oid > 0) {
        $('#ddlVendor,.billinfo').prop("disabled", true);
        $('.page-heading').text('Receive Order ').append('<a class="btn btn-danger" href="/Reception/ReceiveOrder">Back to List</a>');
        $('#line_items,#product_line_items').empty();
        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder">Back to List</a><button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button>');
        var option = { strValue1: oid };
        $.ajax({
            url: "/Reception/GetPurchaseOrderByID", type: "Get", beforeSend: function () { $("#loader").show(); }, data: option,
            success: function (result) {
                try {
                    let data = JSON.parse(result); let VendorID = 0, fk_projet = 0 ,fk_user_approve = 0;
                   
                    for (let i = 0; i < data['po'].length; i++) {
                        fk_user_approve = parseInt(data['po'][i].fk_user_approve) || 0;
                        if (fk_user_approve > 0) {
                            if (data['po'][i].fk_status == "6")
                                $('.page-heading').text('Closed Order (Approved by ' + data['po'][i].user_approve + ')').append('<a class="btn btn-danger" href="/Reception/ReceiveOrder/1000022">Back to List</a>');
                            else if (data['po'][i].fk_status == "5")
                                $('.page-heading').text('Received Order (Approved by ' + data['po'][i].user_approve + ')').append('<a class="btn btn-danger" href="/Reception/ReceiveOrder/1000011">Back to List</a>');
                            else
                                $('.page-heading').text('New Order Receive (Approved by ' + data['po'][i].user_approve + ')').append('<a class="btn btn-danger" href="/Reception/ReceiveOrder">Back to List</a>');
                        }
                        else {
                            if (data['po'][i].fk_status == "6")
                                $('.page-heading').text('Closed Order ').append('<a class="btn btn-danger" href="/Reception/ReceiveOrder/1000022">Back to List</a>');
                            else if (data['po'][i].fk_status == "5")
                                $('.page-heading').text('Received Order ').append('<a class="btn btn-danger" href="/Reception/ReceiveOrder/1000011">Back to List</a>');
                            else
                                $('.page-heading').text('New Order Receive ').append('<a class="btn btn-danger" href="/Reception/ReceiveOrder">Back to List</a>');
                        }
                        VendorID = parseInt(data['po'][i].fk_supplier) || 0; fk_projet = parseInt(data['po'][i].fk_projet) || 0;
                        $('#lblPoNo').text(data['po'][i].ref); $('#txtRefvendor').val(data['po'][i].ref_supplier); $('#txtPODate').val(data['po'][i].date_creation);
                        $('#ddlVendor').val(data['po'][i].fk_supplier).trigger('change');
                        $('#ddlPaymentTerms').val(data['po'][i].fk_payment_term).trigger('change');
                        $('#ddlBalancedays').val(data['po'][i].fk_balance_days).trigger('change');
                        $('#ddlIncoTerms').val(data['po'][i].fk_incoterms).trigger('change');
                        $('#ddlPaymentType').val(data['po'][i].fk_payment_type).trigger('change');
                        $('#txtNotePublic').val(data['po'][i].note_public); $('#txtNotePrivate').val(data['po'][i].note_private);
                        $('#txtIncoTerms').val(data['po'][i].location_incoterms);
                        //$('#ddlwarehousepo').val(data['po'][i].fk_warehouse).trigger('change');
                        $('#ddlwarehouse').val(data['po'][i].fk_warehouse).trigger('change');
                        $("#hfid").val(data['po'][i].rowid);
                        $("#hfstatus").val(data['po'][i].fk_status);
                        $("#hfsaleno").val(fk_projet);
                        $("#hftext").val(data['po'][i].fk_warehouse);
                        //console.log(data['po'][i].fk_status hfsaleno); hftext
                        if (data['po'][i].fk_status == "5")
                            $(".btnpoclosed").show();
                        else
                            $(".btnpoclosed").hide();


                        if (!data['po'][i].date_livraison.includes('00/00/0000')) $('#txtPlanneddateofdelivery').val(data['po'][i].date_livraison);

                        if (fk_projet > 0) {
                            $(".top-action").empty();
                            $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder" data-toggle="tooltip" title="Back to List">Back to List</a>');
                            $('#divAlert').empty().append('<div class="alert alert-info alert-dismissible"><h4><i class="icon fa fa-info"></i> Alert!</h4>Purchase Order (Sales) is not editable.</div>');
                        }

                    }
                    // console.log($("#hfid").val());
                    getVendorProducts(VendorID);
                    for (let i = 0; i < data['pod'].length; i++) {
                        let itemHtml = '';
                        if (data['pod'][i].fk_product >= 0) {
                            let Remainingval = data['pod'][i].recbal.toFixed(0);
                            if (Remainingval < 0)
                                Remainingval = 0;
                            itemHtml = '<tr id="tritemid_' + data['pod'][i].fk_product + '" class="paid_item" data-pid="' + data['pod'][i].fk_product + '" data-pname="' + data['pod'][i].description + '" data-psku="' + data['pod'][i].product_sku + '" data-rowid="' + data['pod'][i].rowid + '">';
                            itemHtml += '<td class="text-center"><button class="btn p-0 text-red btnDeleteItem billinfo" onclick="removeItems(\'' + data['pod'][i].fk_product + '\');"> <i class="glyphicon glyphicon-trash"></i> </button></td>';
                            itemHtml += '<td>' + data['pod'][i].description + '<br>Tag/Lot/Serial No. :- ' + data['pod'][i].product_serialno + '</td><td>' + data['pod'][i].product_sku + '</td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].subprice.toFixed(2) + '" name="txt_itemprice" placeholder="Price"></td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemqty_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].qty.toFixed(0) + '" name="txt_itemqty" placeholder="Qty."></td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itembalqty_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].treceved.toFixed(0) + '" name="txt_itembalqty" placeholder="BalQty."></td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemremaningqty_' + data['pod'][i].fk_product + '" value="' + Remainingval + '" name="txt_itemremaningqty" placeholder="RemQty."></td>';
                            itemHtml += '<td><input min="1" autocomplete="off" class="form-control billinfofo number rowCalulate" type="number" id="txt_itemRecqty_' + data['pod'][i].fk_product + '" value="' + '' + '" name="txt_itemRecqty" placeholder=""></td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemdisc_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].discount_percent.toFixed(2) + '" name="txt_itemdisc" placeholder="Discount"></td>';
                            //itemHtml += '<td class="text-right tax-amount" data-tax1="' + data['pod'][i].localtax1_tx + '" data-tax2="' + data['pod'][i].localtax2_tx + '">' + data['pod'][i].total_localtax1.toFixed(2) + '</td>';
                            //itemHtml += '<td class="text-right ship-amount">' + data['pod'][i].total_localtax2.toFixed(2) + '</td>';
                            itemHtml += '<td style="display:none" class="text-right tax-amount" data-tax1="' + "0" + '" data-tax2="' + "0" + '">' + "0" + '</td>';
                            itemHtml += '<td style="display:none" class="text-right ship-amount">' + "0" + '</td>';
                            itemHtml += '<td class="text-right row-total">' + data['pod'][i].total_ttc.toFixed(2) + '</td>';
                            itemHtml += '<td style="display:none" class="text-right row-avg">' + data['pod'][i].total_ttc.toFixed(2) + '</td>';
                            itemHtml += '</tr>';
                            $('#line_items').append(itemHtml);
                        }
                        else {
                            itemHtml = '<tr id="tritemid_' + data['pod'][i].rowid + '" class="other_item" data-rowid="' + data['pod'][i].rowid + '" data-rang="' + data['pod'][i].rowid + '" data-proc_type="' + data['pod'][i].product_type + '">';
                            itemHtml += '<td class="text-center">';
                            itemHtml += '<button class="btn p-0 billinfo" onclick="AddProductModal(\'' + data['pod'][i].product_type + '\',\'' + data['pod'][i].rowid + '\');"><i class="glyphicon glyphicon-edit"></i></button>';
                            itemHtml += '<button class="btn p-0 text-red billinfo" onclick="removeItems(\'' + data['pod'][i].rowid + '\');"><i class="glyphicon glyphicon-trash"></i></button>';
                            itemHtml += '</td > ';
                            itemHtml += '<td class="item-desc">' + data['pod'][i].description + '</td><td class="item-sku">' + data['pod'][i].product_sku + '</td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + data['pod'][i].rowid + '" value="' + data['pod'][i].subprice.toFixed(2) + '" name="txt_itemprice" placeholder="Price"></td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemqty_' + data['pod'][i].rowid + '" value="' + data['pod'][i].qty.toFixed(0) + '" name="txt_itemqty" placeholder="Qty."></td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itembalqty_' + data['pod'][i].rowid + '" value="' + data['pod'][i].recbal.toFixed(0) + '" name="txt_itembalqty" placeholder="BalQty."></td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemremaningqty_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].Remainingval.toFixed(0) + '" name="txt_itemremaningqty_" placeholder="RemQty."></td>';
                            itemHtml += '<td><input min="1" autocomplete="off" class="form-control billinfofo number rowCalulate" type="number" id="txt_itemRecqty_' + data['pod'][i].rowid + '" value="' + data['pod'][i].recbal.toFixed(0) + '" name="txt_itemRecqty" placeholder="RecQty."></td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemdisc_' + data['pod'][i].rowid + '" value="' + data['pod'][i].discount_percent.toFixed(2) + '" name="txt_itemdisc" placeholder="Discount"></td>';
                            //itemHtml += '<td class="text-right tax-amount">' + data['pod'][i].total_localtax1.toFixed(2) + '</td>';
                            //itemHtml += '<td class="text-right ship-amount">' + data['pod'][i].total_localtax2.toFixed(2) + '</td>';
                            itemHtml += '<td style="display:none" class="text-right tax-amount">' + "0" + '</td>';
                            itemHtml += '<td  style="display:none" class="text-right ship-amount">' + "0" + '</td>';
                            itemHtml += '<td class="text-right row-total">' + data['pod'][i].total_ttc.toFixed(2) + '</td>';
                            itemHtml += '<td style="display:none" class="text-right row-avg">' + data['pod'][i].total_ttc.toFixed(2) + '</td>';
                            itemHtml += '</tr>';
                            $('#product_line_items').append(itemHtml);
                        }
                    }

                    if (data['pods'].length > 0) {
                        for (let i = 0; i < data['pods'].length; i++) {
                            $("#SubTotal").text(data['pods'][i].texcl.toFixed(2));
                            $("#discountTotal").text(data['pods'][i].icl.toFixed(2));
                            $("#salesTaxTotal").text(data['pods'][i].tax.toFixed(2));
                            $("#shippingTotal").text(data['pods'][i].ship.toFixed(2));
                            $("#orderTotal").html(data['pods'][i].dis.toFixed(2));
                            $("#avgcost").html(data['pods'][i].avgcost.toFixed(2));
                        }
                    }
                    if (data['poshtx'].length > 0) {
                        for (let i = 0; i < data['poshtx'].length; i++) {
                            if (data['poshtx'][i].shipping > 0) {
                                $("#txtshippingfee").val(data['poshtx'][i].shipping.toFixed(2));
                                $("#shippingTotal").text(data['poshtx'][i].shipping.toFixed(2));
                               
                            }
                            if (data['poshtx'][i].tax > 0) {
                                $("#salesTaxTotal").text(data['poshtx'][i].tax.toFixed(2));
                                $("#txtotherfee").val(data['poshtx'][i].tax.toFixed(2));
                            }
                            
                         
                        }
                    }

                }
                catch (error) {
                    $("#loader").hide(); swal('Alert!', "something went wrong.", "error");
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (xhr, status, err) { $("#loader").hide(); swal('Alert!', "something went wrong.", "error"); }, async: false
        });
        totalexc = $("#SubTotal").text();
        totaldisc  = $("#discountTotal").text();
        totalincl = $("#orderTotal").html();
        tax = $("#salesTaxTotal").html();
        ship = $("#shippingTotal").html();
        avgcost = $("#avgcost").html();
       // console.log($("#SubTotal").text());
       // console.log($("#discountTotal").text());
        $("#divAddItemFinal").find(".rowCalulate").change(function () { calculateFinal(); })
        $('#ddlVendor,.billinfo').prop("disabled", true); calculateFinal(); $('.entry-mode-action').empty();
       if( $("#hfstatus").val() == "6")
           $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder/1000022">Back to List</a><button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button><button type="button" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
       else if ($("#hfstatus").val() == "5")
            $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder/1000011">Back to List</a><button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button><button type="button" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
       else           
               $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder">Back to List</a><button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button><button type="button" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
        $(".top-action").empty().append('<button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" data-placement="bottom" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" data-placement="bottom" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button><button type="button" class="btn btn-danger btnEdit" data-toggle="tooltip" data-placement="bottom" title="Edit"><i class="far fa-edit"></i> Edit</button>');

        $("#btnPrintPdf").removeClass('hidden');
        $('.billinfofo').prop("disabled", true);


        if ($("#hfstatus").val() == "5")
            $(".btnpoclosed").show();
        else
            $(".btnpoclosed").hide();



       
         // $("#SubTotal").text(totalexc);
       //  $("#discountTotal").text(totalincl);
       //   $("#orderTotal").html(totaldisc);
        $("#SubTotal").text(formatCurrency(totalexc)); $("#SubTotal").data('total', totalexc);
        $("#discountTotal").text(formatCurrency(totalincl)); $("#discountTotal").data('total', totalincl);
        $("#orderTotal").text(formatCurrency(totaldisc)); $("#orderTotal").data('total', totaldisc);
        $("#shippingTotal").text(formatCurrency(ship)); $("#shippingTotal").data('total', ship);
        $("#salesTaxTotal").text(formatCurrency(tax)); $("#salesTaxTotal").data('total', tax);
        $("#avgcost").text(formatCurrency(avgcost)); $("#avgcost").data('total', avgcost);

       
    }
    else {
        $('.billinfo').prop("disabled", true); $('#lblPoNo').text('Draft');
        $("#loader").hide(); $('.page-heading').text('Add New Order');
        $("#btnPrintPdf").addClass('hidden');
        $('.billinfofo').prop("disabled", true);
        $(".top-action").empty();
    }
}

function createItemsList() {
    let _list = []; let _rang = 0; let rshipAmt = 0.00, rothrAmt = 0.00;
    $('#line_items > tr').each(function (index, row) {
        let rPrice = 0.00, rQty = 0.00, remqtyval = 0.00, balqtyval = 0.00, rcvQty = 0.00, ritemrema = 0.00, rDisPer = 0.00, rGrossAmt = 0.00, rDisAmt = 0.00, rTax1 = 0.00, rTax_Amt1 = 0.00, rTax2 = 0.00, rTax_Amt2 = 0.00, rNetAmt = 0.00,ravg = 0.00;
        rPrice = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_itemqty]").val()) || 0.00;
        remqtyval = parseFloat($(row).find("[name=txt_itembalqty]").val()) || 0.00;
        rcvQty = parseFloat($(row).find("[name=txt_itemRecqty]").val()) || 0.00;
        ritemrema = parseFloat($(row).find("[name=txt_itemremaningqty]").val()) || 0.00;
        rDisPer = parseFloat($(row).find("[name=txt_itemdisc]").val()) || 0.00;
        rTax1 = parseFloat($(row).find(".tax-amount").data('tax1')) || 0.00; rTax2 = parseFloat($(row).find(".tax-amount").data('tax2')) || 0.00;
        rGrossAmt = rPrice * rcvQty; rDisAmt = rGrossAmt * (rDisPer / 100);
        rTax_Amt1 = rTax1 * rcvQty; rTax_Amt2 = rTax2 * rcvQty;
        rNetAmt = (rGrossAmt - rDisAmt) + rTax_Amt1 + rTax_Amt2;
        balqtyval = rcvQty + remqtyval;

        rshipAmt = parseFloat($("#txtshippingfee").val()) || 0.00;
        //console.log(tNetAmt, rshipAmt, rothrAmt);
        rothrAmt = parseFloat($("#txtotherfee").val()) || 0.00;
        if (rcvQty > 0) {
            ravg = (rGrossAmt + rshipAmt + rothrAmt) / rcvQty;
        }
        else {
            ravg = 0;
        }
       
        _rang += 1;
        if (rcvQty == 0) {
        }
        else {
            _list.push({
                rowid: $(row).data('rowid'), rang: _rang, product_type: 0, fk_product: $(row).data('pid'), description: $(row).data('pname'), product_sku: $(row).data('psku'),
                qty: rQty, Recqty: rcvQty, Remqty: balqtyval, ItemRemqty: ritemrema, subprice: rPrice, discount_percent: rDisPer, discount: rDisAmt, tva_tx: 0, localtax1_tx: rTax1, localtax1_type: 'F', localtax2_tx: rTax2, localtax2_type: 'F',
                total_ht: rGrossAmt, total_tva: 0, total_localtax1: rTax_Amt1, total_localtax2: rTax_Amt2, total_ttc: rNetAmt, date_start: '1900-01-01', date_end: '1900-01-01', total_avgcost: ravg
            });
        }
    });
    //other item
    $("#product_line_items > tr.other_item").each(function (index, row) {
        let rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rGrossAmt = 0.00, rDisAmt = 0.00, rTax1 = 0.00, rTax_Amt1 = 0.00, rTax2 = 0.00, rTax_Amt2 = 0.00, rNetAmt = 0.00;
        rPrice = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_itemqty]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_itemRecqty]").val()) || 0.00;
        rDisPer = parseFloat($(row).find("[name=txt_itemdisc]").val()) || 0.00;
        rGrossAmt = rPrice * rQty; rDisAmt = rGrossAmt * (rDisPer / 100);
        rNetAmt = (rGrossAmt - rDisAmt) + rTax1;
        _rang += 1;
        _list.push({
            rowid: $(row).data('rowid'), rang: _rang, product_type: $(row).data('proc_type'), fk_product: 0, description: $(row).find('.item-desc').text(), product_sku: $(row).find('.item-sku').text(),
            qty: rQty, subprice: rPrice, discount_percent: rDisPer, discount: rDisAmt, tva_tx: 0, localtax1_tx: rTax1, localtax1_type: 'F', localtax2_tx: rTax2, localtax2_type: 'F',
            total_ht: rGrossAmt, total_tva: 0, total_localtax1: rTax_Amt1, total_localtax2: rTax_Amt2, total_ttc: rNetAmt, date_start: '1900-01-01', date_end: '1900-01-01', total_avgcost: ravg
        });
    });
    return _list;
}
function saveVendorOld_PO() {
    let id = parseInt($('#lblPoNo').data('id')) || 0;
    let vendorid = parseInt($("#ddlVendor").val()) || 0;
    let ref_vendor = $("#txtRefvendor").val();
    let payment_term = parseInt($("#ddlPaymentTerms").val()) || 0;
    let balance_days = parseInt($("#ddlBalancedays").val()) || 0;
    let payment_type = parseInt($("#ddlPaymentType").val()) || 0;
    let warehouse_ID = parseInt($("#ddlwarehouse").val()) || 0;
    let warehousepo_ID = parseInt($("#ddlwarehouse").val()) || 0;
    /*let warehousepo_ID = parseInt($("#ddlwarehousepo").val()) || 0;*/
    let date_livraison = $("#txtPlanneddateofdelivery").val().split('/');
    let IDRecVal = parseInt($("#hfid").val()) || 0;
    let incoterms = parseInt($("#ddlIncoTerms").val()) || 0;
    let location_incoterms = $("#txtIncoTerms").val();
    let note_public = $("#txtNotePublic").val();
    let note_private = $("#txtNotePrivate").val();
    // let statusqty = parseInt($("#QtyTotal").text()) || 0;
    //let statustotalqty = parseInt($("#QtyRecTotal").text()) || 0;
    let status = 0;

    let rshipAmt = parseFloat($("#txtshippingfee").val()) || 0.00; 
    let rothrAmt = parseFloat($("#txtotherfee").val()) || 0.00;
    //console.log(statusqty);
    //console.log(statustotalqty);    

    //if (statusqty == statustotalqty || statusqty < statustotalqty)
    //    status = 6;
    //else
    //    status = 5;

    let qty = $("#QtyTotal").text();
    //console.log(qty);
    const areThereAnyCommas = qty.includes('0');
    // console.log(areThereAnyCommas);
    if (areThereAnyCommas == false)
        status = 6;
    else
        status = 5;

    let _list = createItemsList();
    //console.log(_list);
    if (vendorid <= 0) { swal('Alert', 'Please select vendor', 'error').then(function () { swal.close(); $('#ddlVendor').focus(); }) }
    else if (payment_type <= 0) { swal('Alert', 'Please select payment type', 'error').then(function () { swal.close(); $('#ddlPaymentType').focus(); }) }
    else if (warehouse_ID <= 0) { swal('Alert', 'Please select warehouse', 'error').then(function () { swal.close(); $('#ddlwarehouse').focus(); }) }
    else if (date_livraison == "") { swal('Alert', 'Please select planned date of delivery', 'error').then(function () { swal.close(); $('#txtPlanneddateofdelivery').focus(); }) }
    else if (_list.length <= 0) { swal('Alert', 'To receive quantity should not be Zero', 'error').then(function () { swal.close(); }) }
    else {
        if (date_livraison.length > 0) date_livraison = date_livraison[2] + '/' + date_livraison[0] + '/' + date_livraison[1];
        //let option = {
        //    RowID: id, VendorID: vendorid, PONo: '', VendorBillNo: ref_vendor, PaymentTerms: payment_term, Balancedays: balance_days, PaymentType: payment_type, WarehouseID: warehouse_ID, WarehousepoID: warehousepo_ID,
        //    Planneddateofdelivery: date_livraison, IncotermType: incoterms, Incoterms: location_incoterms, NotePublic: note_public, NotePrivate: note_private, IDRec: IDRecVal,
        //    total_tva: 0, localtax1: parseFloat($("#salesTaxTotal").text()), localtax2: parseFloat($("#shippingTotal").text()), total_ht: parseFloat($("#SubTotal").text()),
        //    discount: parseFloat($("#discountTotal").text()), total_ttc: parseFloat($("#orderTotal").text()), fk_status: status, PurchaseOrderProducts: _list
        let option = {
            RowID: id, VendorID: vendorid, PONo: '', VendorBillNo: ref_vendor, PaymentTerms: payment_term, Balancedays: balance_days, PaymentType: payment_type, WarehouseID: warehouse_ID, WarehousepoID: warehousepo_ID,
            Planneddateofdelivery: date_livraison, IncotermType: incoterms, Incoterms: location_incoterms, NotePublic: note_public, NotePrivate: note_private, IDRec: IDRecVal,
            total_tva: 0, localtax1: parseFloat($("#shippingTotal").text()), localtax2: parseFloat($("#salesTaxTotal").text()), total_ht: parseFloat($("#SubTotal").data('total')),
            discount: parseFloat($("#discountTotal").data('total')), total_ttc: parseFloat($("#orderTotal").data('total')), fk_status: status, total_avgcost: parseFloat($("#avgcost").data('total')),
            PurchaseOrderProducts: _list
        }
        //console.log(option); 
        $.ajax({
            url: '/Reception/ReceptionPurchase', dataType: 'json', type: 'post', contentType: "application/json; charset=utf-8",
            data: JSON.stringify(option),
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    //$('#lblPoNo').data('id', data.id);
                    SendPO_POApproval(data.id);
                    //getMasters();
                    getPurchaseOrderInfo(); 
                    getPurchasehistory();
                    getinvoicehistory();
                    //$('#ddlwarehouse').val($('#hftext').val()).trigger('change');
                    $("#txtshippingfee").val('0');
                    $("#txtotherfee").val('0');
                    if ($("#hfstatus").val() == "6") {
                        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder/1000022">Back to List</a><button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button><button type="button" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
                        $('.btnEdit').hide();
                  
                        $('.btnpoclosed').hide();
                       // $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder/1000022">Back to List</a><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button><button type="button" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
                       // $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="../ReceiveOrder/1000022" data-toggle="tooltip" title="Back to List">Back to List</a>');
                        //swal('Success', data.message, 'success').then((result) => { location.href = '../ReceiveOrder/1000022'; });
                        $('.page-heading').text('Closed Order ').append('<a class="btn btn-danger" href="../ReceiveOrder/1000022">Back to List</a>');
                    }
                    
                    else {
                        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder/1000011">Back to List</a><button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button><button type="button" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
                       // $('.btnEdit').show();
                        $('.btnpoopen').hide();
                   
                       // $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder/1000011">Back to List</a><button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" class="btn btn-danger btnUndoRecord"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" class="btn btn-danger" id="btnSave"><i class="far fa-save"></i> Update</button>');
                       // $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="../ReceiveOrder/1000011" data-toggle="tooltip" title="Back to List">Back to List</a>');
                        $('.page-heading').text('Receive Order ').append('<a class="btn btn-danger" href="../ReceiveOrder/1000011">Back to List</a>');
                    }
                    swal('Success', data.message, 'success');
                    // getPurchaseOrderInfo();
                    // swal('Alert!', data.message, 'success').then(function () { swal.close(); });
                    //swal('Success!', data.message, 'success').then((result) => { location.href = '../ReceiveOrder'; });
                    /*    swal('Alert!', data.message, 'success').then(function () { swal.close(); getPurchaseOrderPrint(id, true); });*/
                }
                else {
                    swal('Error!', data.message, 'error')
                }
            },
            complete: function () { $("#loader").hide(); isEdit(false); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        });
    }
}
function saveVendorPO() {
    let id = parseInt($('#lblPoNo').data('id')) || 0;
    let vendorid = parseInt($("#ddlVendor").val()) || 0;
    let ref_vendor = $("#txtRefvendor").val();
    let payment_term = parseInt($("#ddlPaymentTerms").val()) || 0;
    let balance_days = parseInt($("#ddlBalancedays").val()) || 0;
    let payment_type = parseInt($("#ddlPaymentType").val()) || 0;
    let warehouse_ID = parseInt($("#ddlwarehouse").val()) || 0;
    let warehousepo_ID = parseInt($("#ddlwarehouse").val()) || 0;
    /*let warehousepo_ID = parseInt($("#ddlwarehousepo").val()) || 0;*/
    let date_livraison = $("#txtPlanneddateofdelivery").val().split('/');
    let IDRecVal = parseInt($("#hfid").val()) || 0;
    let incoterms = parseInt($("#ddlIncoTerms").val()) || 0;
    let location_incoterms = $("#txtIncoTerms").val();
    let note_public = $("#txtNotePublic").val();
    let note_private = $("#txtNotePrivate").val();
    // let statusqty = parseInt($("#QtyTotal").text()) || 0;
    //let statustotalqty = parseInt($("#QtyRecTotal").text()) || 0;
    let status = 0;

    let rshipAmt = parseFloat($("#txtshippingfee").val()) || 0.00;
    let rothrAmt = parseFloat($("#txtotherfee").val()) || 0.00;
    //console.log(statusqty);
    //console.log(statustotalqty);    

    //if (statusqty == statustotalqty || statusqty < statustotalqty)
    //    status = 6;
    //else
    //    status = 5;

    let qty = $("#QtyTotal").text();
    //console.log(qty);
    const areThereAnyCommas = qty.includes('0');
    // console.log(areThereAnyCommas);
    if (areThereAnyCommas == false)
        status = 6;
    else
        status = 5;

    let _list = createItemsList();
    //console.log(_list);
    if (vendorid <= 0) { swal('Alert', 'Please select vendor', 'error').then(function () { swal.close(); $('#ddlVendor').focus(); }) }
    else if (payment_type <= 0) { swal('Alert', 'Please select payment type', 'error').then(function () { swal.close(); $('#ddlPaymentType').focus(); }) }
    else if (warehouse_ID <= 0) { swal('Alert', 'Please select warehouse', 'error').then(function () { swal.close(); $('#ddlwarehouse').focus(); }) }
    else if (date_livraison == "") { swal('Alert', 'Please select planned date of delivery', 'error').then(function () { swal.close(); $('#txtPlanneddateofdelivery').focus(); }) }
    else if (_list.length <= 0) { swal('Alert', 'To receive quantity should not be Zero', 'error').then(function () { swal.close(); }) }
    else {
        if (date_livraison.length > 0) date_livraison = date_livraison[2] + '/' + date_livraison[0] + '/' + date_livraison[1];
        //let option = {
        //    RowID: id, VendorID: vendorid, PONo: '', VendorBillNo: ref_vendor, PaymentTerms: payment_term, Balancedays: balance_days, PaymentType: payment_type, WarehouseID: warehouse_ID, WarehousepoID: warehousepo_ID,
        //    Planneddateofdelivery: date_livraison, IncotermType: incoterms, Incoterms: location_incoterms, NotePublic: note_public, NotePrivate: note_private, IDRec: IDRecVal,
        //    total_tva: 0, localtax1: parseFloat($("#salesTaxTotal").text()), localtax2: parseFloat($("#shippingTotal").text()), total_ht: parseFloat($("#SubTotal").text()),
        //    discount: parseFloat($("#discountTotal").text()), total_ttc: parseFloat($("#orderTotal").text()), fk_status: status, PurchaseOrderProducts: _list
        let _order = {
            RowID: id, VendorID: vendorid, PONo: '', VendorBillNo: ref_vendor, PaymentTerms: payment_term, Balancedays: balance_days, PaymentType: payment_type, WarehouseID: warehouse_ID, WarehousepoID: warehousepo_ID,
            Planneddateofdelivery: date_livraison, IncotermType: incoterms, Incoterms: location_incoterms, NotePublic: note_public, NotePrivate: note_private, IDRec: IDRecVal,
            total_tva: 0, localtax1: parseFloat($("#shippingTotal").text()), localtax2: parseFloat($("#salesTaxTotal").text()), total_ht: parseFloat($("#SubTotal").data('total')),
            discount: parseFloat($("#discountTotal").data('total')), total_ttc: parseFloat($("#orderTotal").data('total')), fk_status: status, total_avgcost: parseFloat($("#avgcost").data('total'))
        }

        let option = { strValue1: id, strValue2: JSON.stringify(_order), strValue3: JSON.stringify(_list) }
        //console.log(option); 
        $.ajax({
            url: '/Reception/AddNewReception', dataType: 'json', type: 'post', contentType: "application/json; charset=utf-8",
            data: JSON.stringify(option),
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                data = JSON.parse(data);
                if (data[0].Response == "Success") {
                    //$('#lblPoNo').data('id', data.id);
                    SendPO_POApproval(data[0].id);
                    //getMasters();
                    getPurchaseOrderInfo();
                    getPurchasehistory();
                    getinvoicehistory();
                    //$('#ddlwarehouse').val($('#hftext').val()).trigger('change');
                    $("#txtshippingfee").val('0');
                    $("#txtotherfee").val('0');
                    if ($("#hfstatus").val() == "6") {
                        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder/1000022">Back to List</a><button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button><button type="button" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
                        $('.btnEdit').hide();

                        $('.btnpoclosed').hide();
                        // $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder/1000022">Back to List</a><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button><button type="button" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
                        // $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="../ReceiveOrder/1000022" data-toggle="tooltip" title="Back to List">Back to List</a>');
                        //swal('Success', data.message, 'success').then((result) => { location.href = '../ReceiveOrder/1000022'; });
                        $('.page-heading').text('Closed Order ').append('<a class="btn btn-danger" href="../ReceiveOrder/1000022">Back to List</a>');
                    }

                    else {
                        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder/1000011">Back to List</a><button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button><button type="button" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
                        // $('.btnEdit').show();
                        $('.btnpoopen').hide();

                        // $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder/1000011">Back to List</a><button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" class="btn btn-danger btnUndoRecord"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" class="btn btn-danger" id="btnSave"><i class="far fa-save"></i> Update</button>');
                        // $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="../ReceiveOrder/1000011" data-toggle="tooltip" title="Back to List">Back to List</a>');
                        $('.page-heading').text('Receive Order ').append('<a class="btn btn-danger" href="../ReceiveOrder/1000011">Back to List</a>');
                    }
                    swal('Success', 'Purchase record  updated successfully', 'success');
                    // getPurchaseOrderInfo();
                    // swal('Alert!', data.message, 'success').then(function () { swal.close(); });
                    //swal('Success!', data.message, 'success').then((result) => { location.href = '../ReceiveOrder'; });
                    /*    swal('Alert!', data.message, 'success').then(function () { swal.close(); getPurchaseOrderPrint(id, true); });*/
                }
                else {
                    swal('Error!', data.message, 'error')
                }
            },
            complete: function () { $("#loader").hide(); isEdit(false); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        });
    }
}


$(document).on("click", ".btnpoclosed", function (t) {
    t.preventDefault(); updatepocloser();
});
function updatepocloser() {
    let IDRecVal = parseInt($("#hfid").val()) || 0;
    status = 6;
    let option = { IDRec: IDRecVal, fk_status: status }
    $.ajax({
        url: '/Reception/UpdateStatusReceptionPurchase', dataType: 'json', type: 'post', contentType: "application/json; charset=utf-8",
        data: JSON.stringify(option),
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            if (data.status == true) {
                swal('Success!', data.message, 'success').then((result) => { location.href = '../ReceiveOrder/1000022'; });
            }
            else {
                swal('Error!', data.message, 'error')
            }
        },
        complete: function () { $("#loader").hide();},
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    });
}


$(document).on("click", ".btnpoopen", function (t) {
    t.preventDefault(); updatepoopen();
});

function updatepoopen() {
    let IDRecVal = parseInt($("#hfid").val()) || 0;
    status = 5;
    let option = { IDRec: IDRecVal, fk_status: status }
    $.ajax({
        url: '/Reception/UpdateStatusReceptionPurchase', dataType: 'json', type: 'post', contentType: "application/json; charset=utf-8",
        data: JSON.stringify(option),
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            if (data.status == true) {
                swal('Success!', data.message, 'success').then((result) => { location.href = '../ReceiveOrder/1000011'; });
                 
            }
            else {
                swal('Error!', data.message, 'error')
            }
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    });
}


function getPurchasehistory() {
    let oid = parseInt($('#lblPoNo').data('id')) || 0;
    if (oid > 0) {
        var option = { strValue1: oid };
        $.ajax({
            url: "/Reception/GetPurchaseHistory", type: "Get", beforeSend: function () { $("#loader").show(); }, data: option,
            success: function (result) {
                try {
                    let data = JSON.parse(result);
                    // console.log(result);
                    let itemHtml = '';
                    if (data['pod'].length > 0) {
                        for (let i = 0; i < data['pod'].length; i++) {
                            itemHtml += '<tr id="tritemId_' + data['pod'][i].rowid + '" data-key="' + data['pod'][i].rowid + '">';
                            itemHtml += '<td style="width: 20%">' + data['pod'][i].description + '</td>';
                            itemHtml += '<td style="width: 12%">' + data['pod'][i].date_creation + '</td>';
                            itemHtml += '<td style="width: 10%">' + data['pod'][i].recqty + '</td>';
                           /* itemHtml += '<td>' + data['pod'][i].discount.toFixed(2) + '</td>';*/
                            itemHtml += '<td style="width: 13%">' + formatCurrency(data['pod'][i].amount) + '</td>';
                            itemHtml += '<td style="width: 15%">' + formatCurrency(data['pod'][i].shipping) + '</td>';
                            itemHtml += '<td style="width: 10%">' + formatCurrency(data['pod'][i].tax) + '</td>';
                            itemHtml += '<td style="width: 10%">' + formatCurrency(data['pod'][i].avgcast.toFixed(2)) + '</td>';
                            itemHtml += '</tr>';

                        }
                        $('#product_history').empty().append(itemHtml);
                    }
                }
                catch (error) {
                    $("#loader").hide(); swal('Alert!', "something went wrong.", "error");
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (xhr, status, err) { $("#loader").hide(); swal('Alert!', "something went wrong.", "error"); }, async: false
        });

    }

}

function getinvoicehistory() {
    let oid = parseInt($('#lblPoNo').data('id')) || 0;
    
    if (oid > 0) {
        var option = { strValue1: oid };
        $.ajax({
            url: "/Reception/GetInvoiceHistory", type: "Get", beforeSend: function () { $("#loader").show(); }, data: option,
            success: function (result) {
                try {
                    let data = JSON.parse(result);
                    // console.log(result);
                    let itemHtml = '';
                    if (data['pod'].length > 0) {
                        for (let i = 0; i < data['pod'].length; i++) {
                            itemHtml += '<tr id="tritemId_' + data['pod'][i].RicD + '" data-key="' + data['pod'][i].RicD + '">';
                            itemHtml += '<td style="text-align:left;"> <a href="#" title="Click here to view bill preview" data-toggle="tooltip"  onclick="getInvoicePrintnew(' + data['pod'][i].RicD + '); "><i class="fas fa - search - plus"></i>' + data['pod'][i].refordervendor + '</a></td>';
                            itemHtml += '<td style="width: 15%">' + data['pod'][i].dtcration + '</td>';
                            itemHtml += '<td style="width: 35%">' + data['pod'][i].des + '</td>';
                            itemHtml += '<td style="width: 15%">' + data['pod'][i].Quenty + '</td>';
                            itemHtml += '<td style="width: 20%">' + formatCurrency(data['pod'][i].total_ttc) + '</td>';
                            itemHtml += '</tr>';

                        }
                        $('#product_invoichistory').empty().append(itemHtml);
                    }
                }
                catch (error) {
                    $("#loader").hide(); swal('Alert!', "something went wrong.", "error");
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (xhr, status, err) { $("#loader").hide(); swal('Alert!', "something went wrong.", "error"); }, async: false
        }); 
    } 
}

$(document).on('click', "#btnuploade", function () {
    Adduploade();
})

function Adduploade() {
    debugger

    var formData = new FormData();
    var file = document.getElementById("ImageFile").files[0];
    formData.append("ImageFile", file);

    var Name = $("#hfid").val();
    formData.append("Name", Name);

    if (file == "") {
        swal('Alert', 'Please upload files', 'error').then(function () { swal.close(); });
    }
    else {

        $.ajax({
            type: "POST",
            url: '/Reception/FileUploade/',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (data) {
                if (data.status == true) {
                    if (data.url == "Manage") {
                        swal('Success!', data.message, 'success');
                        bindfileuploade();
                    }
                    else {
                        swal('Success!', data.message, 'success');
                    }
                }
                else {
                    swal('Alert!', data.message, 'error')
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

function bindfileuploade() {
    let PostID = $("#hfid").val();
    var obj = { strValue1: PostID };
    $.ajax({
        type: "POST", url: '/Reception/GetfileuploadData', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            var itemsDetailsxml = [];
            for (var i = 0; i < data.length; i++) {
                // let row_key = data[i].ID ;                      
                itemsDetailsxml.push({
                    PKey: data[i].ID, product_id: data[i].ID, product_name: data[i].product_name, Length: data[i].product_label, CreateDate: data[i].sellingpric
                });

            }
            bindbindfileuploadeDetails(itemsDetailsxml);
        },
        complete: function () { $("#loader").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
        async: false
    });
}
function bindbindfileuploadeDetails(data) {
    // console.log('g', data);
    var layoutHtml = '';
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].PKey > 0) {
                layoutHtml += '<tr id="tritemId_' + data[i].PKey + '" data-key="' + data[i].PKey + '">';
                layoutHtml += '<td><a target="popup" href="../../Content/PurchaseFiles/' + data[i].product_name + '">' + data[i].product_name + '</i></a ></td>';
                layoutHtml += '<td>' + data[i].Length + 'KB' + '</td>';
                layoutHtml += '<td>' + data[i].CreateDate + '</td>';
                /*  layoutHtml += '<td><a href="javascript:void(0);" class="editbutton" onClick="viewfileupload(' + data[i].PKey + ')"><i class="glyphicon glyphicon-eye-open"></i></a></td>';*/
                layoutHtml += '<td class="text-right"><a href="javascript:void(0);" data-toggle="tooltip" title="Click here to delete." class="editbutton" onClick="Deletefileupload(' + data[i].PKey + ')"><i class="glyphicon glyphicon-trash"></i></a></td>';
                layoutHtml += '</tr>';
            }
        }
        // console.log(layoutHtml);
        $('#divfileupload_services').empty().append(layoutHtml);

    }
    else {
        layoutHtml += '<table id="dtfileupload" class="table-blue table table-bordered table-striped dataTable">';
        layoutHtml += '<thead>';
        layoutHtml += '<tr>';
        layoutHtml += '<th>Documents</th>';
        layoutHtml += '<th>Size</th>';
        layoutHtml += '<th>Date</th>';
        /*    layoutHtml += '<th>View</th>';*/
        layoutHtml += '<th class="text-right">Delete</th>';
        layoutHtml += '</tr>';
        layoutHtml += '</thead><tbody id="divfileupload_services"></tbody>';
        layoutHtml += '</table>';
        $('#divfileupload').empty().html(layoutHtml);
    }

}

function Deletefileupload(id) {
    var ids = id;
    var obj = { ID: ids }

    $.ajax({
        url: '/Reception/Deletefileuploade/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () {
            $("#loader").show();
        },
        success: function (data) {
            if (data.status == true) {
                if (data.url == "Manage") {
                    bindfileuploade();
                    swal('Success!', data.message, 'success');
                }
                else {
                    swal('Success!', data.message, 'success');
                }

            }
            else {
                swal('Alert!', data.message, 'error')
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

function viewfileupload(id) {


}

function SendPO_POApproval(id) {
    if (id > 0) {
        var option = { strValue1: id };
       // $.get("/Reception/GetReceveOrderPrint", option).then(response => { send_mail(id, response); }).catch(err => { });
        $.get("/Reception/GetPurchaseOrderPrint", option).then(response => { send_mail(id, response); }).catch(err => { });
    }
}
function send_mail(id, result) {
    let data = JSON.parse(result.data);
    //console.log('jsondata', result);
    let pono = "";
    try {
        pono = data['podvadd'][0].pono;
    }
    catch (e) {
        pono = '';
    }
    
    let inv_title = 'Bill' ; // is_inv ? 'Bill' : 'Receive Order';
    let inv_titleNew = 'Commercial Invoice', po_authmail = data['po'][0].po_authmail;
    let total_qty = 0, total_gm = 0.00, total_tax = 0.00, total_shamt = 0.00, total_discamt = 0.00, total_other = 0.00, paid_amt = 0.00; total_net = 0.00;
  //  console.log('Printss', pono);
    let _com_add = result.name + ', <br>' + result.add + ', <br>' + result.city + ', ' + result.state + ' ' + result.zip + ', <br>' + (result.country == "CA" ? "Canada" : result.country == "US" ? "United States" : result.country) + '.<br>';
    _com_add += 'Phone: ' + result.phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + ' <br> ' + result.email + ' <br> ' + result.website;

    //let startingNumber = parseFloat(data['po'][0].PaymentTerm.match(/^-?\d+\.\d+|^-?\d+\b|^\d+(?=\w)/g)) || 0.00;
    //console.log('Print',pono);
    let myHtml = '<table id="invoice" cellpadding="0" cellspacing="0" border="0" style="width:100%;">';
    myHtml += '<tr>';
    myHtml += '    <td align="center" style="padding:0;">';
    myHtml += '        <table class="container_table" cellpadding="0" cellspacing="0" border="0" style="border:2px solid #e6e6e6; width:995px">';
    myHtml += '            <tr>';
    myHtml += '                <td style="padding:15px;">';
    myHtml += '                    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-bottom: 1px solid #ddd;">';
    myHtml += '                        <tr>';
    myHtml += '                            <td style="padding:; vertical-align: top;">';

    myHtml += '            <p class="recipientInfo" style="width: 225px;margin:0px 0px 15px 0px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">';
    myHtml += '               ' + data['po'][0].vendor_name + '<br>' + data['po'][0].address + '<br>' + data['po'][0].town + ', ' + data['po'][0].fk_state + ' ' + data['po'][0].zip + ', ' + (data['po'][0].fk_country == "CA" ? "Canada" : data['po'][0].fk_country == "CN" ? "China" : data['po'][0].fk_country == "US" ? "United States" : data['po'][0].fk_country) + '<br>' + data['po'][0].vendor_email;
    myHtml += '            </p>';


    myHtml += '                            </td>';
    myHtml += '                            <td style="padding:0px 0px 15px 0px; vertical-align: top;" align="right">';
    myHtml += '                                <table cellpadding="0" cellspacing="0" border="0">';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td colspan="2" style="padding:0px 2.5px">';
    myHtml += '                                            <h2 class="pageCurl" style="color:#9da3a6;font-family: sans-serif;font-weight: 700;margin:0px 0px 8px 0px;font-size: 30px;">' + inv_titleNew + '</h2>';
    myHtml += '                                        </td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">' + inv_title + ' No #:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].ref + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">' + inv_title + ' date:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].date_creation + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Client PO#:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + pono + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Reference:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].ref_supplier + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Expected Delivery Date:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].date_livraison + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Country of Origin:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + (data['po'][0].fk_country == "CA" ? "Canada" : data['po'][0].fk_country == "CN" ? "China" : data['po'][0].fk_country == "US" ? "United States" : data['po'][0].fk_country) + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                </table>';
    myHtml += '                            </td>';
    myHtml += '                        </tr >';
    myHtml += '                    </table >';
    myHtml += '                </td >';
    myHtml += '            </tr >';
    myHtml += '<tr>';
    myHtml += '<td style="padding:0px 15px 0px 15px;">';
    myHtml += '    <table cellpadding="0" width="100%" cellspacing="0" border="0">';
    myHtml += '    <tr width="100%">';
    myHtml += '        <td  width="69.9%" style="padding:0;">';
    myHtml += '            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:0px 0px 15px 0px;;color:#2c2e2f;font-weight:200;">Sold to:</h3>';
    myHtml += '                                <img src="https://laylaerp.com/Images/layla1-logo.png" alt="" width="95" height="41" class="logo-size"/>';
    // myHtml += '            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:5px 0px 5px 0px;;color:#2c2e2f;font-weight:200;">' '</h3>';
    myHtml += '                                <p style="margin:15px 0px;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">';
    myHtml += '                                    ' + result.name + ', <br>' + result.add + ', <br>' + result.city + ', ' + result.state + ' ' + result.zip + ', <br>' + (result.country == "CA" ? "Canada" : result.country == "CN" ? "China" : result.country == "US" ? "United States" : result.country) + '.<br>';
    myHtml += '                                    Phone: ' + result.phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '<br />' + result.email + '<br />' + result.website;
    myHtml += '                                </p>';
    myHtml += '        </td>';

    myHtml += '        <td width="30.1%" style="padding:0px 0px ; vertical-align: top;" align="left">';
    myHtml += '                                <table cellpadding="0" cellspacing="0" border="0">';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td colspan="2" style="padding:0px 2.5px">';
    myHtml += '            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:0px 0px 15px 0px;;color:#2c2e2f;font-weight:200;">Delivery Address:</h3>';
    //myHtml += '            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:0px 0px 5px 0px;;color:#2c2e2f;font-weight:200;">' + data['podvadd'][0].ref + '</h3> ';
    myHtml += '                                        </td>';
    myHtml += '                                    </tr>';
    if (pono == '') {

    }
    else {
        myHtml += '                                    <tr>';
        myHtml += '                               <td <p style="margin:15px 0px;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">';
        myHtml += '                                    ' + data['podvadd'][0].ref + ',<br>' + data['podvadd'][0].address + ',<br>' + data['podvadd'][0].address1 + data['podvadd'][0].City + ' ' + data['podvadd'][0].state + ', ' + data['podvadd'][0].zip + '<br>' + (data['podvadd'][0].Country == "CA" ? "Canada" : data['podvadd'][0].fk_country == "CN" ? "China" : data['podvadd'][0].Country == "US" ? "United States" : data['podvadd'][0].Country) + '.<br>';
        myHtml += '                                    Phone: ' + data['podvadd'][0].phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '<br />' + data['podvadd'][0].email + '<br />';
        myHtml += '                                </p> </td>';
        myHtml += '                                    </tr>';
    }
    myHtml += '                                </table>';
    myHtml += '        </td>';
    myHtml += '     </tr>';
    myHtml += '     </table>';
    myHtml += '</td >';
    myHtml += '</tr >';
    myHtml += '<tr>';
    myHtml += '<td style="padding:0px 15px 0px 15px;">';
    myHtml += '    <table class="product-tables" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">';
    myHtml += '        <thead class="itemdetailsheader" style="border: 1px solid #ddd;background-color: #f9f9f9;">';
    myHtml += '            <tr>';
    myHtml += '                <th style="width:12%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">Item#</th>';
    myHtml += '                <th style="width:48%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">Description</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">Quantity</th>';
    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">Price</th>';
    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Amount</th>';
    myHtml += '            </tr>';
    myHtml += '        </thead>';
    myHtml += '        <tbody class="itemdetailsbody">';
    $(data['pod']).each(function (index, tr) {
        if (tr.product_type == 0) {
            myHtml += '<tr style="border-bottom: 1px solid #ddd;">';
            myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">' + tr.product_sku + '</td>';
            myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">' + tr.description + '</td>';
            myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">' + number_format(tr.qty, 0, '.', ',') + '</td>';
            myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">$' + number_format(tr.subprice, 2, '.', ',') + '</td>';
            myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">$' + number_format(tr.total_ht, 2, '.', ',') + '</td>';
            myHtml += '</tr>';
            total_qty += tr.qty, total_gm += tr.total_ht, total_tax += tr.total_localtax1, total_shamt += tr.total_localtax2, total_discamt += tr.discount, total_net += tr.total_ttc;
        }
        else if (tr.product_type == 1) { total_shamt += tr.total_ttc, total_net += tr.total_ttc; }
        else if (tr.product_type == 2) { total_tax += tr.total_ttc, total_net += tr.total_ttc; }
        else if (tr.product_type == 3) { total_other += tr.total_ttc, total_net += tr.total_ttc; }
    });
    myHtml += '        </tbody>';
    myHtml += '    </table>';
    myHtml += '</td>';
    myHtml += '</tr >';
    myHtml += '<tr>';
    myHtml += '<td style="padding:0px 15px 15px 15px;">';
    myHtml += '    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">';
    myHtml += '        <tr>';
    myHtml += '            <td style="vertical-align: top; width:50%;padding:0px;">';
    myHtml += '                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">';
    myHtml += '                    <tr>';
    myHtml += '                        <td style="color:#4f4f4f;line-height:1.4;text-align:left;font-family:sans-serif;font-size:15px;padding:5px 12px;background:#f9f9f9;font-weight:600; border-bottom:1px solid #ddd;">Comments or Special Instructions</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:12px; color:#4f4f4f;line-height:1.4;">1.Payment term:' + data['po'][0].PaymentTerm + ', ' + data['po'][0].Balance + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:12px; color:#4f4f4f;line-height:1.4;">2.' + data['po'][0].location_incoterms + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td style="border-top: 1px solid #ddd;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">';
    myHtml += '                            <h4 class="headline" style="text-align:left;font-family:sans-serif;color: #555;font-size: 16px;line-height: 18px;margin-bottom: 5px;margin-top: 0px;vertical-align: middle;text-align: left;width: 100%;font-weight: 600;">Notes</h4>';
    myHtml += '                            <p class="notes" style="text-align:left;font-family:sans-serif;color: #4f4f4f;font-size: 12px;line-height: 18px;margin-bottom: 0px;margin-top: 0px;vertical-align: middle;text-align: left;width: 100%;font-weight: 400;">' + data['po'][0].note_public + '</p>';
    myHtml += '                        </td>';
    myHtml += '                    </tr>';

    //myHtml += '                    <tr>';
    //myHtml += '                        <td style="border-top: 1px solid #ddd;padding:0px;">';
    //myHtml += '                        <table style="border-collapse: collapse;width: 100%; table-layout: fixed;font-family:sans-serif;font-size:12px;">';
    //myHtml += '                            <thead style="border: 1px solid #ddd;background-color: #f9f9f9;">';
    //myHtml += '                                <tr>';
    //myHtml += '                                    <th style="text-align:left;width:20%;padding:2px 5px;">Payment</th>';
    //myHtml += '                                    <th style="text-align:right;width:25%;padding:2px 5px;">Amount</th>';
    //myHtml += '                                    <th style="text-align:left;width:30%;padding:2px 5px;">Type</th>';
    //myHtml += '                                    <th style="text-align:left;width:25%;padding:2px 5px;">Num</th>';
    //myHtml += '                                </tr>';
    //myHtml += '                            </thead>';
    //myHtml += '                            <tbody style="border:1px solid #ddd;">';
    //$(data['popd']).each(function (index, trpd) {
    //    myHtml += '<tr style="border-bottom: 1px solid #ddd;">';
    //    myHtml += '    <td style="width:20%;padding:2px 5px;">' + trpd.datec + '</td>';
    //    myHtml += '    <td style="text-align:right;width:20%;padding:2px 5px;">$' + number_format(trpd.amount, 2, '.', ',') + '</td>';
    //    myHtml += '    <td style="width:20%;padding:2px 5px;">' + trpd.paymenttype + '</td>';
    //    myHtml += '    <td style="width:20%;padding:2px 5px;">' + trpd.num_payment + '</td>';
    //    myHtml += '</tr>';
    //    paid_amt += trpd.amount
    //});
    //myHtml += '                            </tbody>';
    //myHtml += '                        </table>';
    //myHtml += '                        </td>';
    //myHtml += '                    </tr>';

    myHtml += '                </table>';
    myHtml += '            </td>';
    myHtml += '            <td style="vertical-align: top; width:50%; padding:0px;">';
    myHtml += '                <table cellpadding="0" cellspacing="0" style="border:1px solid #ddd;border-top:0px;border-collapse: collapse;width: 100%; table-layout: fixed;">';
    myHtml += '                    <tr>';
    myHtml += '                        <td class="text-right" style="width: 38%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">' + number_format(total_qty, 0, '.', ',') + '</td>';
    myHtml += '                        <td class="text-right" style="border-right: 1px solid #ddd; width: 30%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Subtotal</td>';
    myHtml += '                        <td class="text-right" style="width: 30%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_gm, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Item discounts</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">-$' + number_format(total_discamt, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Amount tax</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_tax, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Shipping</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_shamt, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Other Fee</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_other, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Total</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_net, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';
    //myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
    //myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Payment Terms (' + startingNumber + '%)</td>';
    //myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format((total_net * (startingNumber / 100)), 2, '.', ',') + '</td>';
    //myHtml += '                    </tr>';
    //myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
    //myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Paid</td>';
    //myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(paid_amt, 2, '.', ',') + '</td>';
    //myHtml += '                    </tr>';
    //myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
    //myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Remaining Unpaid</td>';
    //myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format((total_net - paid_amt), 2, '.', ',') + '</td>';
    //myHtml += '                    </tr>';
    myHtml += '                </table>';
    myHtml += '            </td>';
    myHtml += '        </tr>';
    myHtml += '    </table>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '</table > ';
    myHtml += '</td > ';
    myHtml += '</tr > ';
    myHtml += '</table >';


    //console.log(myHtml);

    let opt = { strValue1: po_authmail, strValue2: pono, strValue3: myHtml, strValue5: _com_add }
    //console.log(opt);
    //let opt = { strValue1: 'johnson.quickfix@gmail.com', strValue2: data['po'][0].ref, strValue3: myHtml, strValue5: _com_add }
    if (opt.strValue1.length > 5) {
        $.ajax({
            type: "POST", url: '/Reception/SendMailReceve', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
            success: function (result) { console.log(result); },
            error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
            complete: function () { }, async: false
        });
    }
}