$(document).ready(function () {
    $("#loader").hide();
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    $('#divvendo').hide();
    $('#divcus').hide();
    //$('#divaddress').hide();
    $('#divaddresstype').hide();
   // gettransactiontype();
   // getpaymenttype();
   // getVendor(); 
    // getInvoicePrintDetails(22);
    $.when(getVendor(), gettransactiontype()).done(function () { getpaymenttype(); });

    $('#txtcreateDate').datepicker({ format: 'mm/dd/yyyy', autoclose: true, todayHighlight: true });
    let today = new Date();  
    $('#txtcreateDate').val(today.toLocaleDateString("en-US"));

    $('#txtdueDate').datepicker({ format: 'mm/dd/yyyy', autoclose: true, todayHighlight: true });
    var date = new Date();
    date.setDate(date.getDate() + 15);
    $('#txtdueDate').val(date.toLocaleDateString("en-US"));

    $(".select2").select2();
    var itxtCnt = 0;
    var i = 1;
    $(document).on("click", ".ddladdproduct", function (t) {
        bindItems();
    });

    $("#ddlcoustomer").select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Search Customer",
        ajax: {
            url: '/Orders/GetCustomerList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.displayname, name: item.displayname, id: item.id } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }

    });
    $('#ddlCoustomertype').change(function (t) {
        let Coustomertype = $("#ddlCoustomertype").val();
        if (Coustomertype == "C") {
           // console.log(Coustomertype);
            $('#divcus').show();
            $('#divaddress').show();
            $('#divvendo').hide();
            $('#divinstaion').hide();            
            $('#divaddresstype').hide();
        }
        if (Coustomertype == 'V') {
            $('#divvendo').show();
            $('#divcus').hide();
            $('#divinstaion').hide();
            $('#divaddress').show();
            $('#divaddresstype').hide();

        }
        if (Coustomertype == 'I') {
            $('#divinstaion').show();
            $('#divvendo').hide();
            $('#divcus').hide();
            $('#divaddress').hide();
            $('#divaddresstype').show();
            //$('#txtcustmeraddress').hide();
        }

       

    });
    getbillInfodetails(id);
    $(document).on("click", "#btnSave", function (t) { t.preventDefault(); savemiscbill(); });
    $("#ddlcoustomer").change(function () { setTimeout(function () { CustomerAddress($("#ddlcoustomer").val()); }, 50); return false; });
    $("#ddlvendordata").change(function () { setTimeout(function () { vendorAddress($("#ddlvendordata").val()); }, 50); return false; });
    $("#txtshippingfee").change(function () { calculateFinal() });
    $("#txtotherfee").change(function () { calculateFinal() });
});
var itxtCnt = 0;
var i = 1;
function bindItems() {
 
    i++;
    itxtCnt = itxtCnt + 1;
  //  console.log('sd');
    let itemHtml = ''; 
    itemHtml += '<tr id="tritemid_' + i + '" class="paid_item" data-rowid="' + 0 + '">';
   /* itemHtml += '<td><button type="button" class="btn no-btn btn_remove" id="' + i + '" name="remove">X</button></td>';*/
    itemHtml += '<td class="text-center"><button class="btn p-0 text-red btnDeleteItem billinfo" onclick="removeItems(\'' + i + '\');" data-toggle="tooltip" title="Delete product"> <i class="glyphicon glyphicon-trash"></i> </button></td>';
                   // itemHtml += '<td>' + data[i].description + '</td><td>' + data[i].product_sku + '</td>';
    itemHtml += '<td><input autocomplete="off" class="form-control billinfo" type="text" id="txt_Service_' + itxtCnt + '"  name="txt_Service" placeholder="Product/Service"></td>';
    //itemHtml += '<td><input autocomplete="off" class="form-control billinfo" type="text" id="txt_Description_' + itxtCnt + '"  name="txt_Description" placeholder="Description."></td>';
    itemHtml += '<td><input autocomplete="off" class="form-control billinfo" type="text" id="txt_sku_' + itxtCnt + '"  name="txt_sku" placeholder="SKU"></td>';
    itemHtml += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Quantity_' + itxtCnt + '"  name="txt_Quantitye" placeholder="Quantity"></td>';
    itemHtml += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Price_' + itxtCnt + '"  name="txt_Price" placeholder="Price."></td>';
    itemHtml += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Tax_' + itxtCnt + '"  name="txt_Tax" placeholder="Tax"></td>';
    //itemHtml += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Total_' + itxtCnt + '"  name="txt_Total" placeholder="Total"></td>';
    itemHtml += '<td class="text-right row-total">' + formatCurrency(0) + '</td>';
    itemHtml += '</tr>';
    $('#line_items').append(itemHtml);
    $("#divAddItemFinal").find(".rowCalulate").change(function () { calculateFinal(); });
   
    calculateFinal();


    //i++;
    //itxtCnt = itxtCnt + 1;
    //e.preventDefault();
    ///*$("#tbhold").append('<tr id="row' + i + '"><td><div class="col-md-12"> <label>Name:</label><br /><input type="text" class="input" id=tb' + itxtCnt + ' value="" /><br /><input type="checkbox" class="inputchk" id=tb' + itxtCnt + ' value=""/><label>Visible on the product page</label><br /> <input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + ' value=""/><label>Used for variations</label></div></td><td><br /><br /><div class="col-md-12"><label>Value(s):</label><input type="text" placeholder="Enter some text, or some attributes by "|" separating values." style="width: 100%; height: 110px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;" class="inputdes" id=tb' + itxtCnt + ' value="" /></div></td><td><button type="button" class="btn btn-danger btn_remove" id="' + i + '" name="remove">X</button></td></tr>');*/
    //// $("#tbhold").append('<tr id="row' + i + '"><td><div class="col-md-12"> <label>Name:</label><br /><input type="text" class="input" id=tb' + itxtCnt + ' value="" /><br /><input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + ' value=""/><label>Used for variations</label></div></td><td><br /><br /><div class="col-md-12"><label>Value(s):</label><input type="text" placeholder="Enter some text, or some attributes by "|" separating values." style="width: 100%; height: 110px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;" class="inputdes" id=tb' + itxtCnt + ' value="" /></div></td><td><button type="button" class="btn btn-danger btn_remove" id="' + i + '" name="remove">X</button></td></tr>');
    //$("#line_items").append('<tr id="row' + i + '"><td><div class="form-group"><label class="control-label">Name:</label><input type="text" class="input form-control" id=tb' + itxtCnt + ' value="" /><span><input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + ' value=""/><label for=tb' + itxtCnt + '>Used for variations</label></div></td><td><div class="form-group"><label class="control-balel">Value(s):</label><textarea placeholder="Enter some text, or some attributes by | separating values." class="inputdes form-control" id=tb' + itxtCnt + '></textarea></div></td><td><button type="button" class="btn no-btn btn_remove" id="' + i + '" name="remove">X</button></td></tr>');

}

function getbillInfodetails(oid) {
    //$('#divAlert').empty();
    var itxtCnt = 0;
    var ic = 1;
    itxtCnt = itxtCnt + 1;
    let totalexc = 0.00;
    let totalincl = 0.00;
    let totaldisc = 0.00;
    //console.log('d1',oid);
    if (oid > 0) {
        $('.billinfoval').prop("disabled", true);
        //$('.page-heading').text('Receive Order ').append('<a class="btn btn-danger" href="/Reception/ReceiveOrder">Back to List</a>');
        //$('#line_items,#product_line_items').empty();
        //$('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder">Back to List</a><button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button>');
        var option = { strValue1: oid };
        $.ajax({
            url: "/PaymentInvoice/GetBillDetailByID", type: "Get", beforeSend: function () { $("#loader").show(); }, data: option,
            success: function (result) {
                try {
                    let data = JSON.parse(result); var custype = "", paytype = ""; 
                    for (let i = 0; i < data['po'].length; i++) {  
                        $('#ddlvendordata').val(data['po'][i].fk_vendor).trigger('change');
                        custype = data['po'][i].customertype.toString();
                        paytype = data['po'][i].payaccount.toString();
                        $('#ddlCoustomertype').val(custype.trim()).trigger('change');
                        $('#ddltransactiontype').val(data['po'][i].fk_transactiontype).trigger('change'); 
                        $('#ddlpayaccounttype').val(paytype.trim()).trigger('change'); 
                        $('#txtinstaintion').val(data['po'][i].instation);
                        $('#ddlPaymentType').val(data['po'][i].fk_paymenttype).trigger('change'); 
                        $('#txtinstaintionaddress').val(data['po'][i].fk_address);
                        $('#txtcustmeraddress').text(data['po'][i].fk_address);
                        if (!data['po'][i].date_creation.includes('00/00/0000')) $('#txtcreateDate').val(data['po'][i].date_creation);
                        if (!data['po'][i].due_date.includes('00/00/0000')) $('#txtdueDate').val(data['po'][i].due_date);
                        $("#ddlcoustomer").select2('').empty().select2({ data: [{ name: data['po'][i].displayname, id: data['po'][i].fk_customer, text: data['po'][i].displayname }] })
                         $("#ddlcoustomer").select2({
                            allowClear: true, minimumInputLength: 3, placeholder: "Search Customer",
                            ajax: {
                                url: '/Orders/GetCustomerList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
                                data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
                                processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.displayname, name: item.displayname, id: item.id } }) }; },
                                error: function (xhr, status, err) { }, cache: true
                            } 
                         });
                        $('#txtshippingfee').val(data['po'][i].shippingfee);
                        $('#txtotherfee').val(data['po'][i].otherfee);
                       // $('#lblbillNo').text(data['po'][i].rowid);
                        $('#lblbillNo').data('id', data['po'][i].rowid);
                    }
                
                    for (let i = 0; i < data['pod'].length; i++) {
                        ic++;
                        let itemHtml = '';
                        //if (data['pod'][i].fk_product >= 0) {
                            //let Remainingval = data['pod'][i].recbal.toFixed(0);
                            //if (Remainingval < 0)
                            //    Remainingval = 0;
                        itemHtml = '<tr id="tritemid_' + ic + '" class="paid_item" data-pid="' + data['pod'][i].miscellaneous_id + '" data-pname="' + data['pod'][i].discription + '" data-psku="' + data['pod'][i].sku + '" data-rowid="' + data['pod'][i].rowid + '">';
                        itemHtml += '<td class="text-center"><button class="btn p-0 text-red btnDeleteItem billinfo" onclick="removeItems(\'' + ic + '\');" data-toggle="tooltip" title="Delete product"> <i class="glyphicon glyphicon-trash"></i> </button></td>';
                           // itemHtml += '<td>' + data['pod'][i].description + '<br>Tag/Lot/Serial No. :- ' + data['pod'][i].product_serialno + '</td><td>' + data['pod'][i].product_sku + '</td>';

                        itemHtml += '<td><input autocomplete="off" class="form-control billinfo" type="text" id="txt_Service_' + data['pod'][i].miscellaneous_id + '" value="' + data['pod'][i].product + '"  name="txt_Service" placeholder="Product/Service"></td>';
                       // itemHtml += '<td><input autocomplete="off" class="form-control billinfo" type="text" id="txt_Description_' + data['pod'][i].miscellaneous_id + '" value="' + data['pod'][i].discription + '" name="txt_Description" placeholder="Description."></td>';
                        itemHtml += '<td><input autocomplete="off" class="form-control billinfo" type="text" id="txt_sku_' + data['pod'][i].miscellaneous_id + '"  name="txt_sku" value="' + data['pod'][i].sku + '" placeholder="Vendor SKU"></td>';
                        itemHtml += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Quantity_' + data['pod'][i].miscellaneous_id + '"  value="' + data['pod'][i].qty.toFixed(0) + '"  name="txt_Quantitye" placeholder="Quantity"></td>';
                        itemHtml += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Price_' + data['pod'][i].miscellaneous_id + '" value="' + data['pod'][i].rate.toFixed(2) + '" name="txt_Price" placeholder="Price."></td>';
                        itemHtml += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Tax_' + data['pod'][i].miscellaneous_id + '" value="' + data['pod'][i].tax.toFixed(2) + '" name="txt_Tax" placeholder="Tax"></td>';




                        //itemHtml += '<td><input autocomplete="off" class="form-control billinfo" type="text" id="txt_Service_' + data['pod'][i].miscellaneous_id + '" value="' + data['pod'][i].product + '"  name="txt_Service" placeholder="Product/Service"></td>';
                        //itemHtml += '<td><input autocomplete="off" class="form-control billinfo" type="text" id="txt_Service_' + data['pod'][i].miscellaneous_id + '" value="' + data['pod'][i].product + '"  name="txt_Service" placeholder="Product/Service"></td>';
                        //itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].subprice.toFixed(2) + '" name="txt_itemprice" placeholder="Price"></td>';
                        //    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemqty_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].qty.toFixed(0) + '" name="txt_itemqty" placeholder="Qty."></td>';
                        //    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itembalqty_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].treceved.toFixed(0) + '" name="txt_itembalqty" placeholder="BalQty."></td>';
                        //    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemremaningqty_' + data['pod'][i].fk_product + '" value="' + Remainingval + '" name="txt_itemremaningqty" placeholder="RemQty."></td>';
                        //    itemHtml += '<td><input min="1" autocomplete="off" class="form-control billinfofo number rowCalulate" type="number" id="txt_itemRecqty_' + data['pod'][i].fk_product + '" value="' + '' + '" name="txt_itemRecqty" placeholder=""></td>';
                        //    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemdisc_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].discount_percent.toFixed(2) + '" name="txt_itemdisc" placeholder="Discount"></td>';
                            //itemHtml += '<td class="text-right tax-amount" data-tax1="' + data['pod'][i].localtax1_tx + '" data-tax2="' + data['pod'][i].localtax2_tx + '">' + data['pod'][i].total_localtax1.toFixed(2) + '</td>';
                            //itemHtml += '<td class="text-right ship-amount">' + data['pod'][i].total_localtax2.toFixed(2) + '</td>';
                            //itemHtml += '<td style="display:none" class="text-right tax-amount" data-tax1="' + "0" + '" data-tax2="' + "0" + '">' + "0" + '</td>';
                            //itemHtml += '<td style="display:none" class="text-right ship-amount">' + "0" + '</td>';
                        // itemHtml += '<td class="text-right row-total">' + data['pod'][i].total_ttc.toFixed(2) + '</td>';
                         itemHtml += '<td class="text-right row-total">' + formatCurrency(0) + '</td>';
                            itemHtml += '</tr>';
                        $('#line_items').append(itemHtml);  
                        $("#divAddItemFinal").find(".rowCalulate").change(function () { calculateFinal(); });
                        calculateFinal();


                        //}
                        //else {
                        //    itemHtml = '<tr id="tritemid_' + data['pod'][i].rowid + '" class="other_item" data-rowid="' + data['pod'][i].rowid + '" data-rang="' + data['pod'][i].rowid + '" data-proc_type="' + data['pod'][i].product_type + '">';
                        //    itemHtml += '<td class="text-center">';
                        //    itemHtml += '<button class="btn p-0 billinfo" onclick="AddProductModal(\'' + data['pod'][i].product_type + '\',\'' + data['pod'][i].rowid + '\');"><i class="glyphicon glyphicon-edit"></i></button>';
                        //    itemHtml += '<button class="btn p-0 text-red billinfo" onclick="removeItems(\'' + data['pod'][i].rowid + '\');"><i class="glyphicon glyphicon-trash"></i></button>';
                        //    itemHtml += '</td > ';
                        //    itemHtml += '<td class="item-desc">' + data['pod'][i].description + '</td><td class="item-sku">' + data['pod'][i].product_sku + '</td>';
                        //    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + data['pod'][i].rowid + '" value="' + data['pod'][i].subprice.toFixed(2) + '" name="txt_itemprice" placeholder="Price"></td>';
                        //    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemqty_' + data['pod'][i].rowid + '" value="' + data['pod'][i].qty.toFixed(0) + '" name="txt_itemqty" placeholder="Qty."></td>';
                        //    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itembalqty_' + data['pod'][i].rowid + '" value="' + data['pod'][i].recbal.toFixed(0) + '" name="txt_itembalqty" placeholder="BalQty."></td>';
                        //    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemremaningqty_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].Remainingval.toFixed(0) + '" name="txt_itemremaningqty_" placeholder="RemQty."></td>';
                        //    itemHtml += '<td><input min="1" autocomplete="off" class="form-control billinfofo number rowCalulate" type="number" id="txt_itemRecqty_' + data['pod'][i].rowid + '" value="' + data['pod'][i].recbal.toFixed(0) + '" name="txt_itemRecqty" placeholder="RecQty."></td>';
                        //    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemdisc_' + data['pod'][i].rowid + '" value="' + data['pod'][i].discount_percent.toFixed(2) + '" name="txt_itemdisc" placeholder="Discount"></td>';
                        //    //itemHtml += '<td class="text-right tax-amount">' + data['pod'][i].total_localtax1.toFixed(2) + '</td>';
                        //    //itemHtml += '<td class="text-right ship-amount">' + data['pod'][i].total_localtax2.toFixed(2) + '</td>';
                        //    itemHtml += '<td style="display:none" class="text-right tax-amount">' + "0" + '</td>';
                        //    itemHtml += '<td  style="display:none" class="text-right ship-amount">' + "0" + '</td>';
                        //    itemHtml += '<td class="text-right row-total">' + data['pod'][i].total_ttc.toFixed(2) + '</td>';
                        //    itemHtml += '</tr>';
                        //    $('#product_line_items').append(itemHtml);
                        //}
                    }

                }
                catch (error) {
                    $("#loader").hide(); swal('Alert!', "something went wrong.", "error");
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (xhr, status, err) { $("#loader").hide(); swal('Alert!', "something went wrong.", "error"); }, async: false
        });
        //totalexc = $("#SubTotal").text();
        //totaldisc = $("#discountTotal").text();
        //totalincl = $("#orderTotal").html();
        //// console.log($("#SubTotal").text());
        //// console.log($("#discountTotal").text());
        //$("#divAddItemFinal").find(".rowCalulate").change(function () { calculateFinal(); })
        //$('#ddlVendor,.billinfo').prop("disabled", true); calculateFinal(); $('.entry-mode-action').empty();
        //if ($("#hfstatus").val() == "6")
        //    $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder/1000022">Back to List</a><button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button><button type="button" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
        //else if ($("#hfstatus").val() == "5")
        //    $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder/1000011">Back to List</a><button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button><button type="button" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
        //else
        //    $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder">Back to List</a><button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button><button type="button" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
        //$(".top-action").empty().append('<button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" data-placement="bottom" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" data-placement="bottom" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button><button type="button" class="btn btn-danger btnEdit" data-toggle="tooltip" data-placement="bottom" title="Edit"><i class="far fa-edit"></i> Edit</button>');

        //$("#btnPrintPdf").removeClass('hidden');
        //$('.billinfofo').prop("disabled", true);


        //if ($("#hfstatus").val() == "5")
        //    $(".btnpoclosed").show();
        //else
        //    $(".btnpoclosed").hide();




        //// $("#SubTotal").text(totalexc);
        ////  $("#discountTotal").text(totalincl);
        ////   $("#orderTotal").html(totaldisc);

        //$("#SubTotal").text(formatCurrency(totalexc)); $("#SubTotal").data('total', totalexc);
        //$("#discountTotal").text(formatCurrency(totalincl)); $("#discountTotal").data('total', totalincl);
        //$("#orderTotal").text(formatCurrency(totaldisc)); $("#orderTotal").data('total', totaldisc);


    }
    //else {
    //    $('.billinfo').prop("disabled", true); $('#lblPoNo').text('Draft');
    //    $("#loader").hide(); $('.page-heading').text('Add New Order');
    //    $("#btnPrintPdf").addClass('hidden');
    //    $('.billinfofo').prop("disabled", true);
    //    $(".top-action").empty();
    //}
}

//$(document).on('click', '.btn_remove', function () {
//    var button_id = $(this).attr("id");
//    $("#tritemid_" + button_id + '').remove();
//});
function removeItems(id) {
    //------------- Remove data in Temp AddItemList-----
    swal({ title: "Are you sure?", text: 'Would you like to Remove this Item?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) {
                $('#tritemid_' + id).remove(); 
            }
            calculateFinal();
        });
}
function gettransactiontype() {
    $.ajax({
        url: "/PaymentInvoice/gettransactiontype",
        type: "Get",
        success: function (data) {
            $('#ddltransactiontype').append('<option value="0">Select Transaction Type</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddltransactiontype').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}
function getpaymenttype() {
    $.ajax({
        url: "/PaymentInvoice/getpaymenttypefill",
        type: "Get",
        success: function (data) {
            $('#ddlPaymentType').append('<option value="0">Select Bill Type</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddlPaymentType').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}
function getVendor() {
    $.ajax({
        url: "/PurchaseOrder/GetVendor",
        type: "Get",
        success: function (data) {
          //  console.log(data);
            $('#ddlvendordata').append('<option value="-1">Please Select Vendor</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddlvendordata').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}

var ajaxFunc = function (url, data, beforeSendFun, successFun, completeFun, errorFun) {
    $.ajax({
        type: "POST", url: url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(data),
        beforeSend: beforeSendFun, success: successFun, complete: completeFun, error: errorFun, async: false
    });
}
function CustomerAddress(id) {
    //$("#ddlUser").val()
    let option = { strValue1: parseInt(id) || 0 };
    if (option.strValue1 > 0) {
        ajaxFunc('/Orders/GetCustomerAddress', option, function () { }, function (result) {
            var data = JSON.parse(result);
            let add = "";
            for (var i = 0; i < data.length; i++) {
                ///billing_Details 
                if (data[i].meta_key == 'billing_address_1') { add = data[i].meta_value + ' '; }
                else if (data[i].meta_key == 'billing_address_2') { add = data[i].meta_value + ' '; }
                else if (data[i].meta_key == 'billing_postcode') { add += data[i].meta_value + ' ';  }
                else if (data[i].meta_key == 'billing_city') { add += data[i].meta_value + ' '; }
                else if (data[i].meta_key == 'billing_country') { add += data[i].meta_value + ' ';}
                else if (data[i].meta_key == 'billing_state') { add += data[i].meta_value + ' ';}
                 
                $('#txtcustmeraddress').text(add);
            }
        })
    }
     
}
function vendorAddress(id) {
    //$("#ddlUser").val()
    let option = { strValue1: parseInt(id) || 0 };
    if (option.strValue1 > 0) {
        ajaxFunc('/PaymentInvoice/GetvendorAddress', option, function () { }, function (result) {
            var data = JSON.parse(result);
            
            $('#txtcustmeraddress').text(data[0].addressvn);
         
        })
    }

}

function calculateFinal() {
    let tGrossAmt = 0.00, tQty = 0.00, tDisAmt = 0.00, tTax_Amt1 = 0.00, tTax_Amt2 = 0.00, tOther_Amt = 0.00, tNetAmt = 0.00, rshipAmt = 0.00, rothrAmt = 0.00;
    //main item
    $("#line_items > tr.paid_item").each(function (index, row) {
        let rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rGrossAmt = 0.00, rDisAmt = 0.00, rTax1 = 0.00, rTax_Amt1 = 0.00, rTax2 = 0.00, rTax_Amt2 = 0.00, rNetAmt = 0.00;
        rPrice = parseFloat($(row).find("[name=txt_Price]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_Quantitye]").val()) || 0.00;
       
        rDisPer =  0.00;
        rTax1 = parseFloat($(row).find("[name=txt_Tax]").val()) || 0.00;
        rTax2 =   0.00;
        tQty += rQty; rGrossAmt = rPrice * rQty; //rDisAmt = rGrossAmt * (rDisPer / 100);
        rTax_Amt1 = rTax1; //rTax_Amt2 = rTax2 * rQty;
        rNetAmt = rGrossAmt  + rTax_Amt1 ;
       // $(row).find(".tax-amount").text(rTax_Amt1.toFixed(2)); $(row).find(".ship-amount").text(rTax_Amt2.toFixed(2));
       tGrossAmt += rGrossAmt, tDisAmt += rDisAmt, tTax_Amt1 += rTax_Amt1, tTax_Amt2 += rTax_Amt2, tNetAmt += rNetAmt;
        $(row).find(".row-total").text(formatCurrency(rNetAmt));
    });
    rshipAmt = parseFloat($("#txtshippingfee").val()) || 0.00;
    //console.log(tNetAmt, rshipAmt, rothrAmt);
    rothrAmt = parseFloat($("#txtotherfee").val()) || 0.00;
    tNetAmt = tNetAmt + rshipAmt + rothrAmt;
  //  $(".thQuantity").text(tQty.toFixed(0));

    $("#thQuantity").text(tQty.toFixed(0)); $("#thQuantity").data('total', tQty.toFixed(0));

    $("#SubTotal").text(formatCurrency(tGrossAmt)); $("#SubTotal").data('total', tGrossAmt.toFixed(2));
    //$("#discountTotal").text(formatCurrency(tDisAmt)); $("#discountTotal").data('total', tDisAmt.toFixed(2));
    $("#salesTaxTotal").text(formatCurrency(tTax_Amt1)); $("#salesTaxTotal").data('total', tTax_Amt1.toFixed(2));
    $("#shippingTotal").text(formatCurrency(rshipAmt)); $("#shippingTotal").data('total', rshipAmt.toFixed(2));
    $("#otherTotal").text(formatCurrency(rothrAmt)); $("#otherTotal").data('total', rothrAmt.toFixed(2));
    $("#orderTotal").html(formatCurrency(tNetAmt)); $("#orderTotal").data('total', tNetAmt.toFixed(2));
    //let paid_amt = parseFloat($('#paidTotal').data('paid')) || 0.00;
    //$('#unpaidTotal').text(formatCurrency(tNetAmt - paid_amt))
    //$('[data-toggle="tooltip"]').tooltip();
}
function formatCurrency(total) {
    var neg = false;
    if (total < 0) {
        neg = true;
        total = Math.abs(total);
    }
    return (neg ? "-$" : '$') + parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
}
function createItemsList() {
    let _list = []; let _rang = 0;
    $('#line_items > tr').each(function (index, row) {
        let rproduct = '', rdiscription = '',rsku = '';
        let rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rGrossAmt = 0.00, rDisAmt = 0.00, rTax1 = 0.00, rTax_Amt1 = 0.00, rTax2 = 0.00, rTax_Amt2 = 0.00, rNetAmt = 0.00, rshipAmt = 0.00, rothrAmt = 0.00;
        rproduct = $(row).find("[name=txt_Service]").val();
        /*rdiscription = $(row).find("[name=txt_Description]").val();*/
        rdiscription = '';
        rsku = $(row).find("[name=txt_sku]").val();
        rPrice = parseFloat($(row).find("[name=txt_Price]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_Quantitye]").val()) || 0.00;        
        rTax1 = parseFloat($(row).find("[name=txt_Tax]").val()) || 0.00;
        rshipAmt = parseFloat($("#txtshippingfee").val()) || 0.00; 
        rothrAmt = parseFloat($("#txtotherfee").val()) || 0.00;
        /* rGrossAmt = (rPrice * rQty) + rTax1;*/
        rGrossAmt = rPrice * rQty;
       // rTax_Amt1 = rTax1 * rQty; rTax_Amt2 = rTax2 * rQty;
       // rNetAmt = (rGrossAmt - rDisAmt) + rTax_Amt1 + rTax_Amt2;
        _rang += 1;
        _list.push({
             product: rproduct, discription: rdiscription, sku: rsku, shippingfee: rshipAmt, otherfee: rothrAmt,
            qty: rQty, rate: rPrice, total_ttc: rGrossAmt, tax: rTax1
             
        });
    });
 
    //console.log(_list)
    return _list;
}
function savemiscbill() {
    let id = parseInt($('#lblbillNo').data('id')) || 0;
   
    
    let transactiontype = parseInt($("#ddltransactiontype").val()) || 0;
    let payaccounttype = $("#ddlpayaccounttype").val();
    let Coustomertype = $("#ddlCoustomertype").val();
     
    let coustomerid = parseInt($("#ddlcoustomer").val()) || 0;
    let vendorid = parseInt($("#ddlvendordata").val()) || 0;
    let addressval = $('#txtcustmeraddress').text();
    let instaintionvaladdress = $("#txtinstaintionaddress").val();
    let instaintionval = $("#txtinstaintion").val();
    let date = $("#txtcreateDate").val();
    let duedate = $("#txtdueDate").val(); 
    let caddress = '';
    let paymenttype = parseInt($("#ddlPaymentType").val()) || 0;
    let rshipAmt = parseFloat($("#txtshippingfee").val()) || 0.00;
    let rothrAmt = parseFloat($("#txtotherfee").val()) || 0.00;

    if (Coustomertype == 'C') {
        vendorid = 0;
        instaintionval = '';
        caddress = addressval;
    }
    else if (Coustomertype == 'V') {
        coustomerid = 0;
        instaintionval = '';
        caddress = addressval;
    }
    else {
        coustomerid = 0;
        vendorid = 0;
        caddress = instaintionvaladdress;
    }
    let _list = createItemsList();

    if (date == "") { swal('alert', 'Please enter create bill date ', 'error').then(function () { swal.close(); $('#txtcreateDate').focus(); }) } 
    else if (transactiontype == 0) { swal('alert', 'Please select transaction  type', 'error').then(function () { swal.close(); $('#ddltransactiontype').focus(); }) }
    else if (Coustomertype == 0) { swal('alert', 'Please select coustomer type', 'error').then(function () { swal.close(); $('#ddlCoustomertype').focus(); }) }
    else if (paymenttype == 0) { swal('alert', 'Please select bill type.', 'error').then(function () { swal.close(); $('#ddlPaymentType').focus(); }) }
    else if (payaccounttype == 0) { swal('alert', 'Please select pay account.', 'error').then(function () { swal.close(); $('#ddlpayaccounttype').focus(); }) }
    else if (duedate == "") { swal('alert', 'Please enter due date ', 'error').then(function () { swal.close(); $('#txtdueDate').focus(); }) }
    else if (date >= duedate) { swal('alert', 'Please enter a due date greater than create date', 'error').then(function () { swal.close(); $('#txtdueDate').focus(); }) }
    else if (_list.length == 0) { swal('Alert!', 'Please add product.', "error") }
    else {
        //if (date_livraison.length > 0) date_livraison = date_livraison[2] + '/' + date_livraison[0] + '/' + date_livraison[1];
        let _order = {
            rowid: id, fk_transactiontype: transactiontype, customertype: Coustomertype, fk_customer: coustomerid, fk_vendor: vendorid, instation: instaintionval, date_creation: date, due_date: duedate, fk_paymenttype: paymenttype,
            payaccount: payaccounttype, fk_address: caddress, shippingfee: rshipAmt, otherfee: rothrAmt,
            totqty: parseInt($("#thQuantity").data('total')), total_rate: parseFloat($("#SubTotal").data('total')),
            total_tax: parseFloat($("#salesTaxTotal").data('total')), total_ttc: parseFloat($("#orderTotal").data('total'))
        }
        let option = { strValue1: id, strValue2: JSON.stringify(_order), strValue3: JSON.stringify(_list) }
        //console.log(option, _order, _list); return;
        swal.queue([{
            title: '', confirmButtonText: 'Yes, update it!', text: "Do you want to pay your bill?",
            showLoaderOnConfirm: true, showCancelButton: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    $.post('/PaymentInvoice/NewMiscBill', option).done(function (result) {
                        result = JSON.parse(result);
                        if (result[0].Response == "success") {
                             
                            //swal('Success', 'Misc Bills saved successfully.', "success").then(function () { getInvoicePrintDetails(result[0].id); $('#line_items').empty(); calculateFinal(); $("#thQuantity").text('0'); $("#SubTotal").text('0.00'); $("#salesTaxTotal").text('0.00'); $("#shippingTotal").text('0.00'); $("#otherTotal").text('0.00'); $("#orderTotal").text('0.00'); $("#txtshippingfee").val('0'); $("#txtotherfee").val('0'); } );
                            swal('Success', 'Misc Bills saved successfully.', "success").then(function () { getInvoicePrintDetails(result[0].id);});

                            //then(function () { window.location.href = window.location.origin + "/PurchaseOrder/NewPurchaseOrder/" + result[0].id; ActivityLog('create new purchase order for vendor id (' + vendorid + ')', '/PurchaseOrder/NewPurchaseOrder'); });
                        }
                        else { swal('Error', 'Something went wrong, please try again.', "error"); }
                    }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
                });
            }
        }]);
    }
}