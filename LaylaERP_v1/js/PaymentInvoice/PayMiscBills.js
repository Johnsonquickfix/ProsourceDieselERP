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

    //$('#txtcreateDate').datepicker({ format: 'mm/dd/yyyy', autoclose: true, todayHighlight: true });
    //let today = new Date();  
    //$('#txtcreateDate').val(today.toLocaleDateString("en-US"));


    $('#txtcreateDate').daterangepicker({ singleDatePicker: true, autoUpdateInput: true, locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' } });

    //$('#txtdueDate').daterangepicker({ format: 'MM/DD/YYYY', autoclose: true, todayHighlight: true });
    //var date = new Date();
    //date.setDate(date.getDate() + 15);
    //$('#txtdueDate').val(date.toLocaleDateString("en-US"));

  //  $('#txtdueDate').daterangepicker({ singleDatePicker: true, autoUpdateInput: true, locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' } });
    $('#txtdueDate').daterangepicker({ singleDatePicker: true, startDate: moment().add(15, 'days'), autoUpdateInput: true, locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' } });

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
        $('#ddlPaymentTerms').val(0).trigger('change');
        $('#txtcustmeraddress').text('');
        $('#ddlvendordata').val(-1).trigger('change');
        $('#ddlcoustomer').val(0).trigger('change');

       

    });
    getMasters();
    getbillInfodetails(id);
    $(document).on("click", "#btnSave", function (t) { t.preventDefault(); savemiscbill(); });
    $("#ddlcoustomer").change(function () { setTimeout(function () { CustomerAddress($("#ddlcoustomer").val()); }, 50); return false; });
    $("#ddlvendordata").change(function () { setTimeout(function () { vendorAddress($("#ddlvendordata").val()); PaymentTerms(); }, 50); return false; });
    $("#txtshippingfee").change(function () { calculateFinal() });
    $("#txtotherfee").change(function () { calculateFinal() });
    getipaidhistory(id);

    $(document).on("click", ".btnEdit", function (t) {
        t.preventDefault(); $("#loader").show(); //isEdit(true);
        $('.billinfovalff').prop("disabled", false);       
        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/PaymentInvoice/PayMiscBillList">Back to List</a><button type="button" class="btn btn-danger btnUndoRecord" data-toggle="tooltip" title="Cancel"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" class="btn btn-danger" id="btnSave" data-toggle="tooltip" title="Update"><i class="far fa-save"></i> Update</button>');
        $(".top-action").empty().append('<button type="button" class="btn btn-danger btnUndoRecord" data-toggle="tooltip" title="Cancel" data-placement="left"><i class="fa fa-undo"></i> Cancel</button> <button type="button" class="btn btn-danger" id="btnSave" data-toggle="tooltip" title="Update" data-placement="bottom"><i class="far fa-save"></i> Update</button>');
         $("#loader").hide();
    });

    $(document).on("click", ".btnUndoRecord", function (t) {
        t.preventDefault(); let _text = 'Are you sure you want to undo changes this bill ?';
        swal({ title: '', text: _text, type: "question", showCancelButton: true }).then((result) => { if (result.value) { $("#loader").show(); getbillInfodetails(id); } });
    });

    $(document).on("click", ".btnApproved", function (t) {
        t.preventDefault(); let id = parseInt($('#lblbillNo').data('id')) || 0; billApprove(id, 'approve', 3);
    });
    $(document).on("click", ".btnReject", function (t) {
        t.preventDefault(); let id = parseInt($('#lblbillNo').data('id')) || 0; billApprove(id, 'disapprove', 8);
    });

    $(document).on('click', "#btnuploade", function (t) {
        t.preventDefault(); Adduploade();
    })
});

function PaymentTerms() {
    let _details = getVendorDetails(); //console.log(_details);
    
    if (_details.length > 0) {       
        $('#ddlPaymentTerms').val((parseInt(_details[0].term) || 0)).trigger('change');
        let days = 0;
        days = parseInt(_details[0].balanceday) || 0
        var date = new Date();
        if (days > 0)
            $('#txtdueDate').daterangepicker({ singleDatePicker: true, startDate: moment().add(days, 'days'), autoUpdateInput: true, locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' } });
            //date.setDate(date.getDate() + days);           
        else
           $('#txtdueDate').daterangepicker({ singleDatePicker: true, startDate: moment().add(15, 'days'), autoUpdateInput: true, locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' } });
            //date.setDate(date.getDate() + 15);
        //$('#txtdueDate').val(date.toLocaleDateString("en-US"));

       
    }
}

function getVendorDetails() {
    let VendorID = parseInt($('#ddlvendordata').val()) || 0;
    let _details = [];
    $.ajax({
        url: "/PaymentInvoice/GetVendorByID", dataType: 'json', type: "get", contentType: "application/json; charset=utf-8",
        data: { strValue1: VendorID },
        success: function (data) { _details = JSON.parse(data); },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }, async: false
    });
    return _details;
}

var itxtCnt = 0;
var i = 1;
function bindItems() {
    let _billtype = Getpaymenttypebill();
    i++;
    itxtCnt = itxtCnt + 1;
  //  console.log('sd');
    let itemHtml = ''; 
    itemHtml += '<tr id="tritemid_' + i + '" class="paid_item" data-rowid="' + 0 + '">';
   /* itemHtml += '<td><button type="button" class="btn no-btn btn_remove" id="' + i + '" name="remove">X</button></td>';*/
    itemHtml += '<td class="text-center"><button class="btn p-0 text-red btnDeleteItem billinfo" onclick="removeItems(\'' + i + '\');" data-toggle="tooltip" title="Delete product"> <i class="glyphicon glyphicon-trash"></i> </button></td>';
                   // itemHtml += '<td>' + data[i].description + '</td><td>' + data[i].product_sku + '</td>';
    //itemHtml += '<td><select class="form-control billinfo"   id="ddlPaymentType_' + itxtCnt + '"  name="ddlPaymentType"></td>';

    itemHtml += '<td><select id="ddlPaymentTypebill_' + itxtCnt + '"  name="ddlPaymentTypebill" class="ddlPaymentTypebill form-control billinfo select2"><option value="-1">Select Bill Type</option>';
    for (var j = 0; j < _billtype.length; j++) {
        itemHtml += '<option value="' + _billtype[j].rowid + '"> ' + _billtype[j].name + '</option>';
    };
    itemHtml += '</select ></td>';


    itemHtml += '<td><input autocomplete="off" class="form-control billinfo" type="text" id="txt_Service_' + itxtCnt + '"  name="txt_Service" placeholder="Product/Service"></td>';
    //itemHtml += '<td><input autocomplete="off" class="form-control billinfo" type="text" id="txt_Description_' + itxtCnt + '"  name="txt_Description" placeholder="Description."></td>';
    itemHtml += '<td><input autocomplete="off" class="form-control billinfo" type="text" id="txt_sku_' + itxtCnt + '"  name="txt_sku" placeholder="Service No."></td>';
    itemHtml += '<td><input min="1" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Quantity_' + itxtCnt + '" value="' + 1 + '" name="txt_Quantitye" placeholder="Quantity"></td>';
    itemHtml += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Price_' + itxtCnt + '"  name="txt_Price" placeholder="Price."></td>';
    itemHtml += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Tax_' + itxtCnt + '"  name="txt_Tax" placeholder="Tax"></td>';
    //itemHtml += '<td><input min="0" autocomplete="off" class="text-right form-control billinfo number rowCalulate" type="number" id="txt_Total_' + itxtCnt + '"  name="txt_Total" placeholder="Total"></td>';
    itemHtml += '<td class="text-right row-total">' + formatCurrency(0) + '</td>';
    itemHtml += '</tr>';
    $('#line_items').append(itemHtml);
    $(".select2").select2();
    $("#divAddItemFinal").find(".rowCalulate").change(function () { calculateFinal(); });
   
    calculateFinal();


    //i++;
    //itxtCnt = itxtCnt + 1;
    //e.preventDefault();
    ///*$("#tbhold").append('<tr id="row' + i + '"><td><div class="col-md-12"> <label>Name:</label><br /><input type="text" class="input" id=tb' + itxtCnt + ' value="" /><br /><input type="checkbox" class="inputchk" id=tb' + itxtCnt + ' value=""/><label>Visible on the product page</label><br /> <input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + ' value=""/><label>Used for variations</label></div></td><td><br /><br /><div class="col-md-12"><label>Value(s):</label><input type="text" placeholder="Enter some text, or some attributes by "|" separating values." style="width: 100%; height: 110px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;" class="inputdes" id=tb' + itxtCnt + ' value="" /></div></td><td><button type="button" class="btn btn-danger btn_remove" id="' + i + '" name="remove">X</button></td></tr>');*/
    //// $("#tbhold").append('<tr id="row' + i + '"><td><div class="col-md-12"> <label>Name:</label><br /><input type="text" class="input" id=tb' + itxtCnt + ' value="" /><br /><input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + ' value=""/><label>Used for variations</label></div></td><td><br /><br /><div class="col-md-12"><label>Value(s):</label><input type="text" placeholder="Enter some text, or some attributes by "|" separating values." style="width: 100%; height: 110px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;" class="inputdes" id=tb' + itxtCnt + ' value="" /></div></td><td><button type="button" class="btn btn-danger btn_remove" id="' + i + '" name="remove">X</button></td></tr>');
    //$("#line_items").append('<tr id="row' + i + '"><td><div class="form-group"><label class="control-label">Name:</label><input type="text" class="input form-control" id=tb' + itxtCnt + ' value="" /><span><input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + ' value=""/><label for=tb' + itxtCnt + '>Used for variations</label></div></td><td><div class="form-group"><label class="control-balel">Value(s):</label><textarea placeholder="Enter some text, or some attributes by | separating values." class="inputdes form-control" id=tb' + itxtCnt + '></textarea></div></td><td><button type="button" class="btn no-btn btn_remove" id="' + i + '" name="remove">X</button></td></tr>');

}

function getMasters() {


    $.ajax({
        url: "/PaymentInvoice/getpaymentterm",
        type: "Get",
        success: function (data) {
            $('#ddlPaymentTerms').append('<option value="0">Select Payment Term</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddlPaymentTerms').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });

    //let option = { strValue1: 'GETMD', strValue2: 0 };
    //$.ajax({
    //    url: "/PurchaseOrder/GetAllMaster", data: option, type: "Get", beforeSend: function () { $("#loader").show(); },
    //    success: function (data) {
    //        let dt = JSON.parse(data);
    //        //Payment Terms
    //        $("#ddlPaymentTerms").html('<option value="0">Select Payment Term</option>');
    //        for (i = 0; i < dt['Table'].length; i++) { $("#ddlPaymentTerms").append('<option value="' + dt['Table'][i].id + '">' + dt['Table'][i].text + '</option>'); }
            
    //    },
    //    complete: function () { $("#loader").hide(); },
    //    error: function (xhr, status, err) { $("#loader").hide(); }, async: false
    //});
}
function getbillInfodetails(oid) {
    let _billtype = Getpaymenttypebill();
    //$('#divAlert').empty();
    var itxtCnt = 0;
    var ic = 1;
    itxtCnt = itxtCnt + 1;
    let totalexc = 0.00;
    let totalincl = 0.00;
    let totaldisc = 0.00;
    //console.log('d1',oid);
    if (oid > 0) {
        $('.billinfoval').prop("disabled", true); $(".order-files").removeClass('hidden'); 
        $('.billinfovalff').prop("disabled", true);
        $('.page-heading').text('Edit Misc Bills ').append('<a class="btn btn-danger" href="/PaymentInvoice/PayMiscBillList" data-toggle="tooltip" title="Back to List" data-placement="right">Back to List</a>');
        //$('.page-heading').text('Receive Order ').append('<a class="btn btn-danger" href="/Reception/ReceiveOrder">Back to List</a>');
        //$('#line_items,#product_line_items').empty();  
        //$('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/Reception/ReceiveOrder">Back to List</a><button type="button" id="btnpoclosed" class="btn btn-danger btnpoclosed" style="float:unset" data-toggle="tooltip" title="Close This PO"><i class="far fa-btnpoclosed"></i> Close This PO</button><button type="button" id="btnpoopen" class="btn btn-danger btnpoopen" style="float:unset" data-toggle="tooltip" title="Open PO"><i class="far fa-btnpoopen"></i> Open PO</button>');
        var option = { strValue1: oid };
        $.ajax({
            url: "/PaymentInvoice/GetBillDetailByID", type: "Get", beforeSend: function () { $("#loader").show(); }, data: option,
            success: function (result) {
                try {
                    let data = JSON.parse(result); var custype = "", paytype = "", status_id = 0;
                    for (let i = 0; i < data['po'].length; i++) {  
                        status_id = parseInt(data['po'][i].fk_status) || 0;
                        custype = data['po'][i].customertype.toString();
                        paytype = data['po'][i].payaccount.toString();
                        $('#ddlCoustomertype').val(custype.trim()).trigger('change');
                        $('#ddltransactiontype').val(data['po'][i].fk_transactiontype).trigger('change'); 
                        $('#ddlpayaccounttype').val(paytype.trim()).trigger('change'); 
                        $('#txtinstaintion').val(data['po'][i].instation);
                       
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
                        $('#ddlvendordata').val(data['po'][i].fk_vendor).trigger('change');
                        $('#ddlPaymentTerms').val(data['po'][i].fk_paymentterm).trigger('change');
                        if (status_id == 1) {
                            $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/PaymentInvoice/PayMiscBillList" data-toggle="tooltip" title="Back to List" data-placement="right">Back to List</a><button type="button" class="btn btn-danger btnEdit" data-toggle="tooltip" title="Edit" data-placement="top"><i class="far fa-edit"></i> Edit</button> <button type="button" class="btn btn-danger btnApproved" data-toggle="tooltip" title="Approve and create invoice." data-placement="top"><i class="fas fa-check-double"></i> Approve</button>');
                            $('.footer-finalbutton').append(' <button type="button" class="btn btn-danger btnReject" data-toggle="tooltip" title="Disapprove/Reject" data-placement="top"><i class="fas fa-ban"></i> Disapprove</button>');
                        }
                        else {
                            $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/PaymentInvoice/PayMiscBillList" data-toggle="tooltip" title="Back to List" data-placement="right">Back to List</a><button type="button" class="btn btn-danger btnEdit" data-toggle="tooltip" title="Edit"><i class="far fa-edit"></i> Edit</button>');
                        }
                        if (status_id == 5 || status_id == 6) {
                           // $('.page-heading').empty().append('Edit Purchase Order <span class="text-aqua">(' + row.po_status + ')</span> ').append('<a class="btn btn-danger" href="/PurchaseOrder/PurchaseOrderList" data-toggle="tooltip" title="Back to List" data-placement="right">Back to List</a>');
                            //$(".top-action").empty().append('<button type="button" class="btn btn-danger" id="btnPrintPdf" data-toggle="tooltip" title="Print Purchase Order" data-placement="left"><i class="fas fa-print"></i> Print</button>');
                            $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/PaymentInvoice/PayMiscBillList" data-toggle="tooltip" title="Back to List" data-placement="right">Back to List</a>');
                            $('#divAlert').empty().append('<div class="alert alert-info alert-dismissible"><h4><i class="icon fa fa-info"></i> Alert!</h4>This bill is not editable. Paid already.</div>');
                        }
                        else {
                            $(".top-action").empty().append('<button type="button" class="btn btn-danger btnEdit" data-toggle="tooltip" title="Edit" data-placement="left"><i class="far fa-edit"></i> Edit</button>');
                        }
                    }
                    $('#line_items').empty();
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

                        //varHTML += '    <td class="form-group d-flex">';
                        ///*   varHTML += '        <div class="col-md-12"><label class="control-label">Shipping Class</label><select class="txtshipvariation form-control" id="ddlsv_' + data[i].id + '"><option value="-1">shipping class</option><option class="level-0" value="200">Adjustabe Base (Split King)</option> <option class="level-0" value="246">Adjustable Base (Full)</option> <option class="level-0" value="201">Adjustable Base (King)</option><option class="level-0" value="199">Adjustable Base (Queen)</option>  <option class="level-0" value="198">Adjustable Base (Twin XL)</option><option class="level-0" value="71">Bed Frame</option><option class="level-0" value="114">Blanket</option><option class="level-0" value="30">Foundation</option> <option class="level-0" value="50">Free Shipping</option> <option class="level-0" value="263">Hybrid Cal King</option> <option class="level-0" value="260">Hybrid Full</option> <option class="level-0" value="262">Hybrid King</option> <option class="level-0" value="261">Hybrid Queen</option> <option class="level-0" value="258">Hybrid Twin</option> <option class="level-0" value="259">Hybrid Twin XL</option> <option class="level-0" value="257">Mattress Cal King</option>  <option class="level-0" value="254">Mattress Full</option><option class="level-0" value="256">Mattress King</option> <option class="level-0" value="196">Mattress Protector</option> <option class="level-0" value="255">Mattress Queen</option> <option class="level-0" value="252">Mattress Twin</option>    <option class="level-0" value="253">Mattress Twin XL</option>  <option class="level-0" value="195">Memory Foam Pillow</option><option class="level-0" value="52">Pillow</option>  <option class="level-0" value="202">Platform Bed</option> <option class="level-0" value="107">Sheets</option> <option class="level-0" value="87">Topper</option> </select></div>';*/
                        //varHTML += '        <div class="col-md-12"><label class="control-label">Shipping Class</label>';
                        //varHTML += '<select class="txtshipvariation form-control select2" id="ddlsv_' + data[i].id + '"><option value="-1">Select shipping class</option>';
                        //for (var j = 0; j < _shipping_class.length; j++) {
                        //    if (data[i].shippingclass == _shipping_class[j].rowid)
                        //        varHTML += '<option value="' + _shipping_class[j].rowid + '" selected> ' + _shipping_class[j].name + '</option>';
                        //    else
                        //        varHTML += '<option value="' + _shipping_class[j].rowid + '"> ' + _shipping_class[j].name + '</option>';
                        //};
                        //varHTML += '</select></td> ';


                        itemHtml += '<td><select id="ddlPaymentTypebill_' + data['pod'][i].miscellaneous_id + '"  name="ddlPaymentTypebill" class="ddlPaymentTypebill form-control billinfovalff select2"><option value="-1">Select Bill Type</option>';
                        for (var j = 0; j < _billtype.length; j++) {
                            if (data['pod'][i].fk_paymenttype == _billtype[j].rowid)
                                itemHtml += '<option value="' + _billtype[j].rowid + '" selected> ' + _billtype[j].name + '</option>';
                            else
                                itemHtml += '<option value="' + _billtype[j].rowid + '"> ' + _billtype[j].name + '</option>';
                        };
                        itemHtml += '</select ></td>';

                        itemHtml += '<td><input autocomplete="off" class="form-control billinfovalff" type="text" id="txt_Service_' + data['pod'][i].miscellaneous_id + '" value="' + data['pod'][i].product + '"  name="txt_Service" placeholder="Product/Service"></td>';
                       // itemHtml += '<td><input autocomplete="off" class="form-control billinfo" type="text" id="txt_Description_' + data['pod'][i].miscellaneous_id + '" value="' + data['pod'][i].discription + '" name="txt_Description" placeholder="Description."></td>';
                        itemHtml += '<td><input autocomplete="off" class="form-control billinfovalff" type="text" id="txt_sku_' + data['pod'][i].miscellaneous_id + '"  name="txt_sku" value="' + data['pod'][i].sku + '" placeholder="Service No."></td>';
                        itemHtml += '<td><input min="1" autocomplete="off" class="text-right form-control billinfovalff number rowCalulate" type="number" id="txt_Quantity_' + data['pod'][i].miscellaneous_id + '"  value="' + data['pod'][i].qty.toFixed(0) + '"  name="txt_Quantitye" placeholder="Quantity"></td>';
                        itemHtml += '<td><input min="0" autocomplete="off" class="text-right form-control billinfovalff number rowCalulate" type="number" id="txt_Price_' + data['pod'][i].miscellaneous_id + '" value="' + data['pod'][i].rate.toFixed(2) + '" name="txt_Price" placeholder="Price."></td>';
                        itemHtml += '<td><input min="0" autocomplete="off" class="text-right form-control billinfovalff number rowCalulate" type="number" id="txt_Tax_' + data['pod'][i].miscellaneous_id + '" value="' + data['pod'][i].tax.toFixed(2) + '" name="txt_Tax" placeholder="Tax"></td>';




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
                    $('.billinfovalff').prop("disabled", true);
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

        bindfileuploade();
    }
    else {
        $("#loader").hide(); $(".order-files").addClass('hidden');
        $('.page-heading').text('Create Misc Bills ').append('<a class="btn btn-danger" href="/PaymentInvoice/PayMiscBillList" data-toggle="tooltip" title="Back to List" data-placement="right">Back to List</a>');

       // $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/PaymentInvoice/PayMiscBillList" data-toggle="tooltip" title="Back to List" data-placement="right">Back to List</a><button type="button" class="btn btn-danger btnEdit" data-toggle="tooltip" title="Edit"><i class="far fa-edit"></i> Edit</button>');
        $(".top-action").empty().append('<input type="submit" value="Create Bill" id="btnSave" class="btn btn-danger" />');
        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/PaymentInvoice/PayMiscBillList">Back to List</a><input type="submit" value="Create Bill" id="btnSave" class="btn btn-danger" />');
        $('.billinfo').prop("disabled", true); // $('#lblPoNo').text('Draft');
        //$("#loader").hide(); $('.page-heading').text('Add New Order');
        //$("#btnPrintPdf").addClass('hidden');
        //$('.billinfofo').prop("disabled", true);
        //$(".top-action").empty();
    }
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

function Getpaymenttypebill() {
    let _billtype = [];
    $.ajax({
        type: "get", url: '/PaymentInvoice/getpaymenttypebill', contentType: "application/json; charset=utf-8", dataType: "json", data: {},
        success: function (data) {
            data = JSON.parse(data); _billtype = data;
            //console.log(data, _shipping_class);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { }, async: false
    });
    return _billtype;
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
        let rproduct = '', rdiscription = '',rsku = '',raccid;
        let rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rGrossAmt = 0.00, rDisAmt = 0.00, rTax1 = 0.00, rTax_Amt1 = 0.00, rTax2 = 0.00, rTax_Amt2 = 0.00, rNetAmt = 0.00, rshipAmt = 0.00, rothrAmt = 0.00;
        rproduct = $(row).find("[name=txt_Service]").val();
        /*rdiscription = $(row).find("[name=txt_Description]").val();*/
        rdiscription = '';
        rsku = $(row).find("[name=txt_sku]").val();
        raccid = $(row).find("[name=ddlPaymentTypebill]").val();
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
        console.log(raccid, rQty, rPrice);
        if (raccid > 0 && rQty > 0  ) {
            _list.push({
                product: rproduct, discription: rdiscription, sku: rsku, shippingfee: rshipAmt, otherfee: rothrAmt,
                qty: rQty, rate: rPrice, total_ttc: rGrossAmt, tax: rTax1, fk_paymenttype: raccid

            });
        }
    });
 
    //console.log(_list)
    return _list;
}
function savemiscbill() {
    let id = parseInt($('#lblbillNo').data('id')) || 0;
    let conformation = '';
    if (id > 0) {
        conformation = "Do you want to update your bill?";
    }
    else {
        conformation = "Do you want to create your bill?";
    }
    
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
    let paymenttype = parseInt($("#ddlPaymentTerms").val()) || 0;
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
   // console.log(_list);

    if (date == "") { swal('alert', 'Please enter create bill date ', 'error').then(function () { swal.close(); $('#txtcreateDate').focus(); }) } 
    else if (transactiontype == 0) { swal('alert', 'Please select transaction  type', 'error').then(function () { swal.close(); $('#ddltransactiontype').focus(); }) }
    else if (Coustomertype == 0) { swal('alert', 'Please select coustomer type', 'error').then(function () { swal.close(); $('#ddlCoustomertype').focus(); }) }
    //else if (paymenttype == 0) { swal('alert', 'Please select payment terms.', 'error').then(function () { swal.close(); $('#ddlPaymentTerms').focus(); }) }
    else if (payaccounttype == 0) { swal('alert', 'Please select pay account.', 'error').then(function () { swal.close(); $('#ddlpayaccounttype').focus(); }) }
    else if (duedate == "") { swal('alert', 'Please enter due date ', 'error').then(function () { swal.close(); $('#txtdueDate').focus(); }) }
    else if (date > duedate) { swal('alert', 'Please enter a due date greater than create date', 'error').then(function () { swal.close(); $('#txtdueDate').focus(); }) }
    else if (_list.length == 0) { swal('Alert!', 'Please add bill type/service/product.', "error") }
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
            title: '', confirmButtonText: 'Yes, update it!', text: conformation,
            showLoaderOnConfirm: true, showCancelButton: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    $.post('/PaymentInvoice/NewMiscBill', option).done(function (result) {
                        result = JSON.parse(result);
                        if (result[0].Response == "success") {

                            SendPO_POApproval(result[0].id);
                            //swal('Success', 'Misc Bills saved successfully.', "success").then(function () { getInvoicePrintDetails(result[0].id); $('#line_items').empty(); calculateFinal(); $("#thQuantity").text('0'); $("#SubTotal").text('0.00'); $("#salesTaxTotal").text('0.00'); $("#shippingTotal").text('0.00'); $("#otherTotal").text('0.00'); $("#orderTotal").text('0.00'); $("#txtshippingfee").val('0'); $("#txtotherfee").val('0'); } );
                            swal('Success', 'Misc bills saved successfully.', "success").then(function () { getInvoicePrintDetails(result[0].id); });

                            //then(function () { window.location.href = window.location.origin + "/PurchaseOrder/NewPurchaseOrder/" + result[0].id; ActivityLog('create new purchase order for vendor id (' + vendorid + ')', '/PurchaseOrder/NewPurchaseOrder'); });
                        }
                        else { swal('Error', 'Something went wrong, please try again.', "error"); }
                    }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
                });
            }
        }]);
    }
}

function getipaidhistory(oid) {

    if (oid > 0) {
        var option = { strValue1: oid };
        $.ajax({
            url: "/PaymentInvoice/getpaidmishistory", type: "Get", beforeSend: function () { $("#loader").show(); }, data: option,
            success: function (result) {
                try {
                    let data = JSON.parse(result);
                    // console.log(result);
                    let itemHtml = '';
                    if (data['pod'].length > 0) {
                        for (let i = 0; i < data['pod'].length; i++) {
                            itemHtml += '<tr id="tritemId_' + data['pod'][i].rowid + '" data-key="' + data['pod'][i].rowid + '">';
                            itemHtml += '<td>' + data['pod'][i].fk_invoceso + '</td>';
                            itemHtml += '<td>' + data['pod'][i].datec + '</td>';
                            itemHtml += '<td>' + data['pod'][i].paymenttype + '</td>';
                            itemHtml += '<td>' + data['pod'][i].num_payment + '</td>';                   
                            itemHtml += '<td>' + formatCurrency(data['pod'][i].amount) + '</td>';
                            itemHtml += '</tr>';
                        }
                        $('#paid_history').empty().append(itemHtml);
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
function billApprove(oid, status_title, status) {
    let option = { Search: oid, Status: status };
    let _text = 'Do you want to ' + status_title + ' this misc bill ?';
    swal.queue([{
        title: '', confirmButtonText: 'Yes, update it!', text: _text, showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                $.ajaxSetup({ async: false });
                $.get('/PaymentInvoice/UpdateBillStatus', option).done(function (result) {
                    result = JSON.parse(result);
                    if (result[0].Response == "drafted") {
                        $('#lblbillNo').data('id', oid); 
                        swal('Success', 'Misc bill drafted', "success");
                       // $.when(getbillInfodetails(oid)).done(function () {
                        getbillInfodetails(oid, true);
                       // });
                    }
                    else if (result[0].Response == "already") {
                        $('#lblbillNo').data('id', oid);
                        swal('Success', 'Misc bill already approved. You can not approved it again.', "success");
                        //$.when(getbillInfodetails(oid)).done(function () {
                        getbillInfodetails(oid, true);
                        //});
                    }
                    else if (result[0].Response == "success") {
                        $('#lblbillNo').data('id', oid);
                        swal('Success', 'Misc bill approved successfully.', "success");
                       //$.when(getbillInfodetails(oid)).done(function () {
                       // getInvoicePrintDetails(oid, true);
                       //});
                        getbillInfodetails(oid, true);
                    }
                    else if (result[0].Response == "disapproved") {
                        $('#lblbillNo').data('id', oid);
                        swal('Success', 'Misc bill disapproved.', "success");
                        //$.when(getbillInfodetails(oid)).done(function () {
                        getbillInfodetails(oid, true);
                        //});
                    }
                    else { swal('Error', 'Something went wrong, please try again.', "error"); }
                    //resolve();
                }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
            });
        }
    }]);
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


///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Misc Bill Send Mail for Approval ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function SendPO_POApproval(id) {
    if (id > 0) {
        var option = { strValue1: id };
        $.get("/PaymentInvoice/miscbill-print", option).then(response => { send_mail(id, response, false); }).catch(err => { });
    }
}
function send_mail(id, result, is_inv) {
    let data = JSON.parse(result.data); //console.log(result);
    let inv_title = is_inv ? 'Bill' : 'Bill';
    let inv_titleNew = 'BILL' , po_authmail = data['po'][0].po_authmail;
    let so_no = parseInt(data['po'][0].fk_projet) || 0;
    let total_qty = 0, total_gm = 0.00, total_tax = 0.00, total_shamt = 0.00, total_discamt = 0.00, total_other = 0.00, paid_amt = 0.00; total_net = 0.00; disc_amt = 0.00

    let startingNumber = parseFloat(data['po'][0].fk_paymentterm) || 0.00;
    //let _com_add = result.com_name + ', <br>' + result.add + ', <br>' + result.city + ', ' + result.state + ' ' + result.zip + ', <br>' + (result.country == "CA" ? "Canada" : result.country == "US" ? "United States" : result.country) + '.<br>';
    //_com_add += 'Phone: ' + result.phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + ' <br> ' + result.email + ' <br> ' + result.website;
    let _com_add = data['com'][0].com_name + ', <br>' + data['com'][0].add + ', <br>' + data['com'][0].city + ', ' + data['com'][0].state + ' ' + data['com'][0].zip + ', <br>' + (data['com'][0].country == "CA" ? "Canada" : data['com'][0].country == "US" ? "United States" : data['com'][0].country) + '.<br>';
    _com_add += 'Phone: ' + data['com'][0].phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + ' <br> ' + data['com'][0].email + ' <br> ' + data['com'][0].website;

    total_shamt = parseFloat(data['po'][0].shippingfee) || 0.00;
    total_other = parseFloat(data['po'][0].otherfee) || 0.00;

    let myHtml = '<table id="Misc_Bills" cellpadding="0" cellspacing="0" border="0" style="width:100%;">';
    myHtml += '<tr>';
    myHtml += '    <td align="center" style="padding:0;">';
    myHtml += '        <table class="container_table" cellpadding="0" cellspacing="0" border="0" style="border:2px solid #e6e6e6; width:995px">';
    myHtml += '            <tr>';
    myHtml += '                <td style="padding:15px;">';
    myHtml += '                    <table cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed;width:100%;border-bottom: 1px solid #ddd;">';
    myHtml += '                        <tr>';

    myHtml += '                            <td style="padding:0; vertical-align: top;width:50.9%">';
    /* myHtml += '            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:0px 0px 15px 0px;;color:#2c2e2f;font-weight:200;">Sold to:</h3>';*/
    myHtml += '                                <img src="https://laylaerp.com/Images/layla1-logo.png" alt="" width="95" height="41" class="logo-size"/>';
    myHtml += '                                <p style="margin:15px 0px;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">' + _com_add + '</p>';
    myHtml += '                            </td>';
    myHtml += '                            <td style="padding:0; vertical-align: top; width:50.1%" align="right">';
    myHtml += '                                <table cellpadding="0" cellspacing="0" border="0">';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td colspan="2" style="padding:0px 2.5px 0px 0px">';
    myHtml += '                                            <h2 class="pageCurl" style="color:#9da3a6;font-family: sans-serif;font-weight: 700;margin:0px 0px 8px 0px;font-size: 30px;">' + inv_titleNew.toUpperCase() + '</h2>';
    myHtml += '                                        </td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">' + inv_title + ' No #:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].ref + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;"> Date:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].date_creation + '</td>';
    myHtml += '                                    </tr>';


    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Transaction Type:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].transaction_t + '</td>';
    myHtml += '                                    </tr>';
    //myHtml += '                                    <tr>';
    //myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Customer Type:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].customertype + '</td>';
    //myHtml += '                                    </tr>';
    //myHtml += '                                    <tr>';
    //myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Address:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].fk_address + '</td>';
    //myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Bill Type:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].paymenttype + '</td>';
    myHtml += '                                    </tr>';
    myHtml += '                                    <tr>';
    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Pay Account:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].payaccount + '</td>';
    myHtml += '                                    </tr>';

    myHtml += '                                    <tr>';
    myHtml += '                                        <td style = "font-family:sans-serif;font-size:15px;color:#4f4f4f;line-height:1.4;padding:15px 2.5px;text-align: right;" colspan = "2">';
    myHtml += '                                            <a href="' + data['po'][0].base_url + '/paymentinvoice/bill-accept?key=' + data['po'][0].row_key + '&id=' + result.en_id + '{_para}" target="_blank" style="margin:12px;min-width:110px;background-color:#0070BA;color:#fff;font-size:12px;box-sizing:border-box!important;padding: 8px;border-radius:5px;font-weight:600;">Approve</a> ';
    myHtml += '                                            <a href="' + data['po'][0].base_url + '/paymentinvoice/bill-reject?key=' + data['po'][0].row_key + '&id=' + result.en_id + '{_para}" target="_blank" style="margin:12px;min-width:110px;background-color:#ff4100;color:#fff;font-size:12px;box-sizing:border-box!important;padding: 8px;border-radius:5px;font-weight:600;">Disapprove</a>';
    myHtml += '                                        </td>';
    myHtml += '                                    </tr>';
    myHtml += '                                </table>';
    myHtml += '                            </td>';
    myHtml += '                        </tr >';
    myHtml += '                    </table >';
    myHtml += '                </td >';
    myHtml += '            </tr >';
    myHtml += '<tr>';
    myHtml += '<td style="padding:0px 15px 0px 15px;">';
    myHtml += '    <table cellpadding="0" cellspacing="0" border="0">';
    myHtml += '    <tr>';
    myHtml += '        <td style="padding:0;">';
    myHtml += '            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:0px 0px 5px 0px;;color:#2c2e2f;font-weight:200;">' + data['po'][0].customertype + ' :</h3>';
    myHtml += '            <p class="recipientInfo" style="width: 225px;margin:0px 0px 15px 0px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">';
    myHtml += '               ' + data['po'][0].displayname + '<br>' + data['po'][0].fk_address;
    myHtml += '            </p>';
    myHtml += '        </td>';
    myHtml += '     </tr>';
    myHtml += '     </table>';
    myHtml += '</td >';
    myHtml += '</tr >';
    myHtml += '<tr>';
    myHtml += '<td style="padding:0px 15px 0px 15px;">';
    myHtml += '    <table class="product-tables" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">';
    myHtml += '        <thead class="itemdetailsheaderl" style="border: 1px solid #ddd;background-color: #f9f9f9;">';
    myHtml += '            <tr>';
    myHtml += '                <th style="width:3%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">#</th>';
    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemsaccount">Account</th>';
    myHtml += '                <th style="width:25%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemsproduct">Description</th>';
    //myHtml += '                <th style="width:15%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">Description</th>';
    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemsku">SKU</th>';
    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">Quantity</th>';
    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">Price</th>';
    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">Tax</th>';
    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Amount</th>';
    myHtml += '            </tr>';
    myHtml += '        </thead>';
    myHtml += '        <tbody class="itemdetailsbody">';
    $(data['pod']).each(function (index, tr) {

        myHtml += '<tr style="border-bottom: 1px solid #ddd;">';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">' + tr.sr + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemaccount">' + tr.label + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemsproduct">' + tr.product + '</td>';
        // myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">' + tr.discription + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemsku">' + tr.sku + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">' + number_format(tr.qty, 0, '.', ',') + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">$' + number_format(tr.rate, 2, '.', ',') + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">$' + number_format(tr.tax, 2, '.', ',') + '</td>';
        myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">$' + number_format(tr.total_ttc + tr.tax, 2, '.', ',') + '</td>';
        myHtml += '</tr>';
        total_qty += tr.qty, total_gm += tr.total_ttc, total_tax += tr.tax, total_net += tr.total_ttc + tr.tax;


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
    myHtml += '                        <td style="border-top: 1px solid #ddd;padding:0px;">';
    //if (so_no < 0) { myHtml += ''; }
    //else {
    myHtml += '                        <table style="border-collapse: collapse;width: 100%; table-layout: fixed;font-family:sans-serif;font-size:12px;">';
    myHtml += '                            <thead style="border: 1px solid #ddd;background-color: #f9f9f9;">';
    myHtml += '                                <tr>';
    myHtml += '                                    <th style="text-align:left;width:20%;padding:2px 5px;">Payment</th>';
    myHtml += '                                    <th style="text-align:right;width:25%;padding:2px 5px;">Amount</th>';
    myHtml += '                                    <th style="text-align:right;width:25%;padding:2px 5px;">Discount</th>';
    myHtml += '                                    <th style="text-align:left;width:30%;padding:2px 5px;">Type</th>';
    myHtml += '                                    <th style="text-align:left;width:25%;padding:2px 5px;">Num</th>';
    myHtml += '                                </tr>';
    myHtml += '                            </thead>';
    myHtml += '                            <tbody style="border:1px solid #ddd;">';
    $(data['popd']).each(function (index, trpd) {
        myHtml += '<tr style="border-bottom: 1px solid #ddd;">';
        myHtml += '    <td style="width:20%;padding:2px 5px;">' + trpd.datec + '</td>';
        myHtml += '    <td style="text-align:right;width:20%;padding:2px 5px;">$' + number_format(trpd.amount, 2, '.', ',') + '</td>';
        myHtml += '    <td style="text-align:right;width:20%;padding:2px 5px;">$' + number_format(trpd.discount, 2, '.', ',') + '</td>';
        myHtml += '    <td style="width:20%;padding:2px 5px;">' + trpd.paymenttype + '</td>';
        myHtml += '    <td style="width:20%;padding:2px 5px;">' + trpd.num_payment + '</td>';
        myHtml += '</tr>';
        paid_amt += trpd.amount
        disc_amt += trpd.discount
    });
    myHtml += '                            </tbody>';
    myHtml += '                        </table>';
    //} 
    console.log(disc_amt);
    myHtml += '                        </td>';
    myHtml += '                    </tr>';

    myHtml += '                </table>';
    myHtml += '            </td>';
    myHtml += '            <td style="vertical-align: top; width:50%; padding:0px;">';
    myHtml += '                <table cellpadding="0" cellspacing="0" style="border:1px solid #ddd;border-top:0px;border-collapse: collapse;width: 100%; table-layout: fixed;">';
    myHtml += '                    <tr>';
    myHtml += '                        <td class="text-right" style="width: 25%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">' + number_format(total_qty, 0, '.', ',') + '</td>';
    myHtml += '                        <td class="text-right" style="border-right: 1px solid #ddd; width: 30%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Subtotal</td>';
    myHtml += '                        <td class="text-right" style="width: 30%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_gm, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';

    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Amount tax</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_tax, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';

    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Shipping Fee</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_shamt, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';

    myHtml += '                    <tr>';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Other Charges</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_other, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';

    myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Total</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_net + total_other + total_shamt, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';


    myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Payment Terms (' + startingNumber + '%)</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(((total_net + total_other + total_shamt) * (startingNumber / 100)), 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';

    myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Paid</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(paid_amt + disc_amt, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';

    myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Remaining Unpaid</td>';
    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_net + total_other + total_shamt - paid_amt - disc_amt, 2, '.', ',') + '</td>';
    myHtml += '                    </tr>';


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

    let opt = { strValue1: po_authmail, strValue2: data['po'][0].ref, strValue3: myHtml, strValue5: _com_add }
     console.log(opt);
    //let opt = { strValue1: 'johnson.quickfix@gmail.com', strValue2: data['po'][0].ref, strValue3: myHtml, strValue5: _com_add }
    if (opt.strValue1.length > 5) {
        $.ajax({
            type: "POST", url: '/PaymentInvoice/SendMailBillApproval', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
            success: function (result) { console.log(result); },
            error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
            complete: function () { }, async: false
        });
    }
}