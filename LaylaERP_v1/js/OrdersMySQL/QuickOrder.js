$(document).ready(function () {
    
   
    $("#txtbillphone").mask("(999) 999-9999");
    $('#txtLogDate').daterangepicker({ singleDatePicker: true, autoUpdateInput: true, locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' } });
    $(".select2").select2(); BindStateCounty("ddlbillstate", { id: 'US' }); BindStateCounty("ddlshipstate", { id: 'US' });
    $("#ddlUser").select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Search Customer",
        ajax: {
            url: '/Orders/GetCustomerList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.displayname + ' [' + item.billing_phone + ']', name: item.displayname + ' [' + item.billing_phone + ']', id: item.id } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
    let productData = {};
    $("#ddlProduct").select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Search Product",
        ajax: {
            url: '/Quickorder/GetProductList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term, strValue2: $("#ddlproducttype").val() }; return JSON.stringify(obj); },
            processResults: function (data) {
                var jobj = JSON.parse(data);
                jobj.forEach(function (item) {
                    productData[item.id] = {
                        text: item.displayname,
                        parent_id: item.post_parent
                    };
                }); return { results: $.map(jobj, function (item) { return { text: item.displayname, id: item.id } }) };
            },
            error: function (xhr, status, err) { }, cache: true
        }
    });
    $("#ddlUser").change(function () {
        
        $.when(NewOrderNo()).done(function () { CustomerAddress($("#ddlUser").val());  }).fail(function (error) { console.log(error); });
         
        return false;
    });

    $("#ddlShipping").change(function (t) {

        // Get the selected option
        var selectedOption = $(this).find(":selected");
        // Retrieve the data attributes
        var methodId = selectedOption.data("method_id");
        var methodTitle = selectedOption.data("method_title");
        var amount = selectedOption.data("amount");

        // Use these values as needed
        var selectedShippingMethod = {
            method_id: methodId, // Replace with the desired method_id
            method_title: methodTitle, // Replace with the desired method_title
            amount: amount // Replace with the desired amount
        };
        getshippingtotaldetails(methodId, methodTitle, amount);

    });
    $("#ddlbillcountry").change(function () { var obj = { id: $("#ddlbillcountry").val() }; BindStateCounty("ddlbillstate", obj); });
    $("#ddlshipcountry").change(function () { var obj = { id: $("#ddlshipcountry").val() }; BindStateCounty("ddlshipstate", obj); });
    $("#ddlshipstate").change(function (t) { t.preventDefault(); $.when(GetTaxRate()).done(function () { getItemShippingCharge(true); }); });
    $("#ddlStatus").change(function (t) {
        t.preventDefault();
        if ($(this).val() == 'wc-on-hold') {
            $('.releasedate').empty().append('<label data-toggle="tooltip" title="Order release date">What day would you like your order to ship?*</label><div class= "input-group"><span class="input-group-addon"><i class="fa fa-calendar"></i></span><input id="txtReleaseDate" class="form-control"></div>');
            $('#txtReleaseDate').daterangepicker({ singleDatePicker: true, minDate: moment($('#txtLogDate').val(), "MM/DD/YYYY").add(7, 'd'), autoUpdateInput: true, locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' } });
        }
        else { $('.releasedate').empty(); }
    });
    $(document).on("click", "#btnApplyCoupon", function (t) { t.preventDefault(); if ($("#order_line_items > tr.gift_item").length > 0) return false; else CouponModal(); });
    //$("#billModal").on("keypress", function (e) { if (e.which == 13 && e.target.type != "textarea") { $("#btnCouponAdd").click(); } }); 

    $(document).on("click", "#btnpriceorder", function (t) {
        //$("#btnpriceorder").hide();
        gettotaldetails();
        //$("#divAddItemFinal :input").prop("disabled", true);
        $("#btnCheckout").show();
        

    });
    $("#billModal").on("click", "#btnCouponAdd", function (t) { t.preventDefault(); ApplyCoupon(); });
    $(document).on("keypress", "#txt_Coupon", function (t) {
        let keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') { $('#btnCouponAdd').click(); }
    });
    $(document).on("blur", "#txtbillzipcode", function (t) {
        t.preventDefault();
        if ($("#ddlbillcountry").val() == 'US') { GetCityByZip($(this).val(), $("#txtbillcity"), $("#ddlbillstate"), $("#ddlbillcountry"), $("#txtbillzipcode")); }
    });
    $(document).on("blur", "#txtshipzipcode", function (t) {
        t.preventDefault();
        if ($("#ddlshipcountry").val() == 'US') { $("#loader").show(); GetCityByZip($(this).val(), $("#txtshipcity"), $("#ddlshipstate"), $("#ddlshipcountry"), $("#txtshipzipcode")); }
    });
    $(document).on("click", "#btnCheckout", function (t) { t.preventDefault(); saveCO(); ActivityLog('Order  id (' + $('#hfOrderNo').val() + ') proceed for order payment invoice.', '/Orders/minesofmoria/' + $('#hfOrderNo').val() + ''); });
    $(document).on("click", "#btnpay", function (t) { t.preventDefault(); PaymentModal(); });
    $("#billModal").on("click", "#btnPlaceOrder", function (t) { t.preventDefault(); AcceptPayment(); });
    $("#billModal").on("click", "#btnNewOrder", function (t) { t.preventDefault(); window.location.href = window.location.origin + "/OrdersMySQL/OrdersHistory"; ActivityLog('Order  id (' + $('#hfOrderNo').val() + ') order processed, waiting for payment.', '/Orders/minesofmoria/' + $('#hfOrderNo').val() + ''); });
    /*Start New order Popup function*/
    $(document).on("click", "#btnSearch", function (t) {
        t.preventDefault(); $("#loader").show(); $('.page-heading').text('Add New Order'); searchOrderModal();
        let cus_id = parseInt($("#ddlUser").val()) || 0, cus_text = $("#ddlUser option:selected").text();
        if (cus_id > 0) {
            $("#ddlCustomerSearch").empty().append('<option value="' + cus_id + '" selected>' + cus_text + '</option>');
            bindCustomerOrders(cus_id);
        }
        $("#loader").hide();
    });
    $(document).on("click", ".btnEditOrder", function (t) {
        t.preventDefault(); $("#loader").show(); //$('#ddlStatus').prop("disabled", true); 
        $('#ddlStatus,.billinfo').prop("disabled", false); $('#txtbillfirstname').focus(); $('.agentaddtocart').removeClass('hidden');
        $('.box-tools-header').empty().append('<button type="button" class="btn btn-danger btnOrderUndo" data-toggle="tooltip" title="Reset Order"><i class="fa fa-undo"></i> Cancel</button> <button type="button" id="btnOrderUpdate" class="btn btn-danger" data-toggle="tooltip" title="Update Order"><i class="far fa-save"></i> Update</button>');
        //$('.footer-finalbutton').empty().append('<button type="button" class="btn btn-danger pull-left btnOrderUndo"><i class="fa fa-undo"></i> Cancel</button>  <button type="button"  id="btnpriceorder" class="btn btn-danger pull-right " data-toggle="tooltip" title="" data-original-title="Price">Order Process</button> <button style="display:none" type="button" id="btnCheckout" class="btn btn-danger billinfo" data-toggle="tooltip" title="Save and Checkout Order"> Checkout</button>');
        $('.footer-finalbutton').empty().append('<button type="button" class="btn btn-danger pull-left btnOrderUndo"><i class="fa fa-undo"></i> Cancel</button> <button style="display:none" type="button" id="btnCheckout" class="btn btn-danger billinfo" data-toggle="tooltip" title="Save and Checkout Order"> Checkout</button>');
       $('.view-addmeta').empty().append('<button class="btn btn-danger btn-xs billinfo add_order_item_meta" data-placement="right" data-toggle="tooltip" title="Add item meta">Add&nbsp;meta</button>');
        $('[data-toggle="tooltip"]').tooltip(); $("#loader").hide(); isEdit(true);
        ActivityLog('Edit order id (' + $('#hfOrderNo').val() + ') in order history', '/OrdersMySQL/OrdersHistory');
        // all item add to cart 
        //$('.add_order_item_meta').hide();
        $("#btnpriceorder").show();
        
        gettotaldetailsedit();

    });
    $(document).on("click", ".btnOrderUndo", function (t) {
        t.preventDefault(); $("#loader").show();
        var oid = parseInt($('#hfOrderNo').val()) || 0;
        window.location.href = "../../Orders/quickorder/" + oid +"";
        //getOrderInfo(); i
        sEdit(false);
    });
    $(document).on("click", "#btnOrderUpdate", function (t) { t.preventDefault(); updateODS(); ActivityLog('Edit order id (' + $('#hfOrderNo').val() + ') in order history', '/OrdersMySQL/OrdersHistory'); });
    $('#billModal').on('shown.bs.modal', function () {
        $('#ddlCustomerSearch').select2({
            dropdownParent: $("#billModal"), allowClear: true, minimumInputLength: 3, placeholder: "Search Customer",
            language: { noResults: function () { return $("<a id='btnaddcustomer' href='javascript:;'>Add Customer</a>"); } },
            ajax: {
                url: '/Orders/GetCustomerList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
                data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
                processResults: function (data, page) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.displayname + ' [' + item.billing_phone + ']', id: item.id } }) }; },
                error: function (xhr, status, err) { }, cache: true
            }
        });
    });
    //$.when(CategoryWiseProducts()).done(function () { getOrderInfo(); });
    $.when(getOrderInfo()).done(function () {
        //getProducts(24);
    });
    //$('.billinfo').prop("disabled", true);

    $("#ddlProduct").change(function () {
        let product_id = parseInt($('#ddlProduct').val()) || 0, vender_id = parseInt($('#ddlVendor').val()) || 0, parent_id = productData[product_id].parent_id
        // Now you can use 'parent_id' as needed
        //console.log('Other ID: ' + productData[product_id].parent_id);
        //getItemList(product_id, parent_id); //$('#ddlProduct').val('').trigger('change');
        gettotaldetailsfromif(product_id, parent_id, 1); //$("#divtotal").hide();

        //setTimeout(function () { ; $("#divtotal").hide(); }, 3000);



    });
    $(document).on("change", ".addnvar,.addnvar-qty", function (t) {
        t.preventDefault(); let $row = $(this).parent(); let vr = $row.find('.addnvar').val().split('-');
        let regular_price = parseFloat(vr[1]) || 0.00, price = parseFloat(vr[2]) || 0.00, qty = parseFloat($row.find('.addnvar-qty').val()) || 0.00;
        if (price < regular_price && regular_price > 0) $row.find('.hub-pro-price').html('<span>$' + (price * qty).toFixed(2) + '<span>$' + (regular_price * qty).toFixed(2) + '</span></span>')
        else if (price >= regular_price && regular_price > 0) $row.find('.hub-pro-price').html('<span>$' + (price * qty).toFixed(2) + '<span></span>')
    });
    $(document).on("click", ".agentaddtocart", function (t) {
        t.preventDefault(); let $row = $(this).parent();
        if ($(this).data('producttype') == 'product') {
            let vr = $row.find('.addnvar').val().split('-');
            let pid = parseInt($row.data('proid')) || 0, vid = parseInt(vr[0]) || 0, cid = parseInt($('#ddlUser').val()) || 0, qty = parseFloat($row.find('.addnvar-qty').val()) || 0.00;
            if (cid <= 0) { swal('Alert!', 'Please Select Customer.', "error").then((result) => { $('#ddlUser').select2('open'); return false; }); return false; }
            getItemList(pid, vid, qty);
        }
        else if ($(this).data('producttype') == 'gift_card') {
            let pid = parseInt($row.data('proid')) || 0, p_name = $row.data('name');
            AddGiftCardProductModal(p_name, pid)
        }
    });
    $("#billModal").on("change", "#ddlCustomerSearch", function (t) {
        t.preventDefault();
        let cus_id = parseInt($("#ddlCustomerSearch").val()) || 0;
        if (cus_id > 0)
            bindCustomerOrders(cus_id);
        else
            $('#tblCusOrders').dataTable().fnClearTable();
    });
    //$("#billModal").on("change", ".select2-search__field:eq(1)", function () { alert("Hello World!"); })
    $("#billModal").on("click", "#btnaddcustomer", function (t) {
        t.preventDefault();
        let cus_text = $("#ddlCustomerSearch").data("select2").dropdown.$search.val();
        $("#billModal").modal('hide'); addCustomerModal(cus_text);
    });
    $("#billModal").on("change", "#txtBillingCountry", function (t) { t.preventDefault(); var obj = { id: $(this).val() }; BindStateCounty("txtBillingState", obj); });
    $("#billModal").on("click", "#btnBackSearchCusrtomer", function (t) {
        t.preventDefault(); $("#billModal").modal('hide'); searchOrderModal();
    });
    $("#billModal").on("change", "#ddlCusBillingCountry", function (t) { t.preventDefault(); $("#txtCusBillingPostCode").val(''); BindStateCounty("ddlCusBillingState", { id: $("#ddlCusBillingCountry").val() }); });
    $("#billModal").on("change", "#ddlCusBillingState", function (t) { t.preventDefault(); $("#txtCusBillingPostCode").val(''); });
    $("#billModal").on("change", "#txtCusBillingPostCode", function (t) {
        t.preventDefault(); let _zip = $(this).val();
        if ($("#ddlCusBillingCountry").val() == 'CA') return false;
        $.when($("#loader").show()).then(function () {
            GetCityByZip(_zip, $("#txtCusBillingCity"), $("#ddlCusBillingState"), $("#ddlCusBillingCountry"), $("#txtCusBillingPostCode")); $("#txtCusBillingPostCode").val(_zip);
        }).always(function () { $("#loader").hide(); });
    });
    $("#billModal").on("click", "#btnSaveCustomer", function (t) {
        t.preventDefault(); saveCustomer();
    });
    $("#billModal").on("change", "#ddlPaymentMethod", function (t) {
        t.preventDefault();
        if ($("#ddlPaymentMethod").val() == "podium") { $('.podiumchannel').removeClass('hidden'); }
        else { $('.podiumchannel').addClass('hidden'); }
    });
    /*end New order Popup function*/
    /*Start Return Items*/
    $(document).on("click", "#btnAddFee", function (t) { t.preventDefault(); let i = Math.random().toString(36).substr(2, 9); AddFeeModal(i, 0, '', '', '0'); });
    $(document).on("click", "#btnApplyFee", function (t) {
        t.preventDefault(); let rowid = $(this).data('rowid'), orderitemid = parseInt($(this).data('orderitemid')) || 0, feeamt = parseFloat($('#txt_FeeAmt').val()) || 0.00;
        if ($('#txt_FeeTitle').val() == '') { swal('Error!', 'Please enter fee title.', "error").then((result) => { $('#txt_FeeTitle').focus(); return false; }); return false; }
        else if ($('#ddlFeeType').val() == '0') { swal('Error!', 'Please select fee type.', "error").then((result) => { $('#ddlFeeType').focus(); return false; }); return false; }
        else if (feeamt == 0) { swal('Error!', 'Please enter fee amount.', "error").then((result) => { $('#txt_FeeAmt').focus(); return false; }); return false; }
        else { ApplyFee(rowid, orderitemid, $('#txt_FeeTitle').val(), $('#ddlFeeType').val(), feeamt); }
    });
    $(document).on("keypress", "#txt_FeeTitle,#txt_FeeAmt", function (t) {
        let keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') { $('#btnApplyFee').click(); }
    });
    /*End Return Items*/
    /*Start Gift Card*/
    $(document).on("click", "#btnApplyGiftCard", function (t) { t.preventDefault(); if ($("#order_line_items > tr.gift_item").length > 0) return false; else GiftCardModal(); });
    $("#billModal").on("click", "#btnGiftCardAdd", function (t) { t.preventDefault(); ApplyGiftCard(); });
    $(document).on("keypress", "#txt_GiftCard", function (t) {
        let keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') { $('#btnGiftCardAdd').click(); }
    });
    /*End Gift Card*/
    $(document).on("click", "#btnAddnote", function (t) {
        t.preventDefault(); let $btn = $(this), oid = parseInt($('#hfOrderNo').val()) || 0;
        if ($('#order_note_type').val() == '0') { swal('Error!', 'Please select order type.', "error").then((result) => { $('#order_note_type').select2('open'); return false; }); return false; }
        else if ($('#add_order_note').val() == '') { swal('Error!', 'Please enter order note.', "error").then((result) => { $('#add_order_note').focus(); return false; }); return false; }
        let option = { post_ID: oid, comment_content: $('#add_order_note').val(), is_customer_note: $('#order_note_type').val() };
        $($btn).attr('disabled', 'disabled'); $("#loader").show();
        $.post('/OrdersMySQL/OrderNoteAdd', option).then(response => {
            if (response.status) { $('#order_note_type').val('0').trigger('change'); $('#add_order_note').val(''); $('#btnAddnote').prop("disabled", true); $('.div_order_note').hide(); getOrderNotesList(oid); }
            else swal('Alert!', result.message, "error");
        }).catch(err => { $($btn).removeAttr('disabled'); swal('Error!', err, 'error'); }).always(function () { $("#loader").hide(); $($btn).removeAttr('disabled'); });
    });
    $(document).on("change", "#order_note_type", function (t) {
        t.preventDefault();
        if ($(this).val() == "0" || $(this).val() == "") { $('#btnAddnote').prop("disabled", true); $('.div_order_note').hide(); }
        else { $('#btnAddnote').prop("disabled", false); $('.div_order_note').show(); }
    });
    $(document).on("click", "#btnPrintPdf", function (t) {
        t.preventDefault();
        let pay_mode = $('#lblOrderNo').data('pay_by'), pay_id = $('#lblOrderNo').data('pay_id');
        pay_mode = pay_mode.includes("ppec_paypal") ? "PayPal" : pay_mode.includes("podium") ? "Podium Payments" : pay_mode;
        successModal(pay_mode, pay_id, false, false);
    });
    $(document).on("click", "#btnDownloadinPdf", function (t) {
        t.preventDefault();
        let order_id = parseInt($('#hfOrderNo').val()) || 0;
        var options = {};
        var pdf = new jsPDF('p', 'pt', 'a4');
        pdf.addHTML($("#tbprint"), 15, 15, options, function () { pdf.save(order_id + '.pdf'); });

        //var elementHTML = document.getElementById('tbprint');

        //html2canvas(elementHTML, {
        //    useCORS: true,
        //    onrendered: function (canvas) {
        //        var pdf = new jsPDF('p', 'pt', 'a4');

        //        var pageHeight = 980;
        //        var pageWidth = 900;
        //        for (var i = 0; i <= elementHTML.clientHeight / pageHeight; i++) {
        //            var srcImg = canvas;
        //            var sX = 0;
        //            var sY = pageHeight * i; // start 1 pageHeight down for every new page
        //            var sWidth = pageWidth;
        //            var sHeight = pageHeight;
        //            var dX = 0;
        //            var dY = 0;
        //            var dWidth = pageWidth;
        //            var dHeight = pageHeight;

        //            window.onePageCanvas = document.createElement("canvas");
        //            onePageCanvas.setAttribute('width', pageWidth);
        //            onePageCanvas.setAttribute('height', pageHeight);
        //            var ctx = onePageCanvas.getContext('2d');
        //            ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);

        //            var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);
        //            var width = onePageCanvas.width;
        //            var height = onePageCanvas.clientHeight;

        //            if (i > 0) // if we're on anything other than the first page, add another page
        //                pdf.addPage(612, 864); // 8.5" x 12" in pts (inches*72)

        //            pdf.setPage(i + 1); // now we declare that we're working on that page
        //            pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .62), (height * .62)); // add content to the page
        //        }

        //        // Save the PDF
        //        pdf.save('document.pdf');
        //    }
        //});
    });
    $(document).on("click", "#btnSendMail", function (t) {
        t.preventDefault(); let option = { order_id: parseInt($('#hfOrderNo').val()) || 0 };
        swal.queue([{
            title: 'Do you want send invoice in mail?', confirmButtonText: 'Yes, Sent it!', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: true, showCloseButton: false, showCancelButton: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    swal.showLoading();
                    $.get('/order/order-sendinvoice', option).then(response => {
                        if (response.status) { swal('Success', 'E-mail sent.', 'success'); }
                        else swal('Error!', 'Something went wrong, please try again.', 'error');
                    }).catch(err => { swal.hideLoading(); swal('Error!', 'Something went wrong, please try again.', 'error'); }).always(function () { swal.hideLoading(); });;
                });
            }
        }]);
    });
    /*start add order item meta*/
    $(document).on("click", ".add_order_item_meta", function (t) {
        t.preventDefault(); let $btn = $(this), $item = $(this).closest('tr');
        let _item_id = parseInt($item.data('orderitemid')); $($btn).html("Please Wait"); $($btn).attr('disabled', 'disabled');
        $.post('/OrdersMySQL/GetOrderItemMeta', { strValue1: _item_id }).then(response => {
            console.log(response);
            let meta_list = JSON.parse(response);
            if (meta_list.length == 0) meta_list.push({ id: 0, item_id: $item.data('orderitemid'), key: '', 'value': '' });
            AddItemMetaModal($item.data('id'), _item_id, meta_list);
        }).catch(err => { $($btn).html("Add meta"); $($btn).removeAttr('disabled'); swal('Error!', 'Something went wrong, please try again.', 'error'); }).always(function () { $($btn).html("Add meta"); $($btn).removeAttr('disabled'); });
    });
    $("#billModal").on("click", ".btnmeta_delete", function (t) { t.preventDefault(); $(this).closest('tr').addClass('hidden'); });
    $("#billModal").on("click", ".btnmeta_add", function (t) {
        t.preventDefault();
        let trHtml = '<tr><td style="width:45%"><input class="form-control" id="txt_key" value="" name="txt_key" placeholder="Name"></td>';
        trHtml += '<td style = "width:45%"><input class="form-control" id="txt_value" value="" name="txt_value" placeholder="Value"></td>';
        trHtml += '<td style="width:10%"><button class="btn menu-icon-gr text-red btnmeta_delete"> <i class="glyphicon glyphicon-trash"></i></button></td></tr > ';
        $('#order_items_meta').append(trHtml);
    });
    $("#billModal").on("click", "#btnmeta_ok", function (t) {
        t.preventDefault();
        let $btn = $(this), row_id = $(this).data('id'), _item_id = parseInt($(this).data('itemid')) || 0, _status = false, meta_list = [], dis_list = [];
        $('#order_items_meta > tr').each(function (index, tr) {
            let _id = parseInt($(tr).data('id')) || 0, _key = $(tr).find("[name=txt_key]").val().replace(/\s+/g, "_"), _value = $(tr).find("[name=txt_value]").val();
            if (!$(tr).is(":hidden")) {
                if (_key == '') { swal('Alert!', 'Please enter meta name.', "info").then((result) => { $(tr).find("[name=txt_key]").focus(); return false; }); _status = false; return false; }
                else if (_value == '') { swal('Alert!', 'Please enter meta value.', "info").then((result) => { $(tr).find("[name=txt_value]").focus(); return false; }); _status = false; return false; }
                meta_list.push({ id: _id, item_id: _item_id, key: '_system_' + _key, value: _value });
                dis_list.push({ id: _id, item_id: _item_id, key: _key, value: _value });
            }
            else { meta_list.push({ id: _id, item_id: _item_id, key: '', value: '' }); }
            _status = true;
        });
        if (_status) {
            let _data = { OrderItemMeta: meta_list }; $($btn).html("Please Wait"); $($btn).attr('disabled', 'disabled');
            $.ajax({ method: 'post', url: '/OrdersMySQL/SaveOrderProductMeta', data: _data }).done(function (result, textStatus, jqXHR) {
                if (result) { $('#tritemId_' + row_id).data('meta_data', dis_list); $("#billModal").modal('hide'); }
            }).fail(function (jqXHR, textStatus, errorThrown) { swal('Alert!', 'Something went wrong, please try again.', "error"); }).always(function () { $($btn).html("Add"); $($btn).removeAttr('disabled'); });
        }
    });
    /*start add order item meta*/
    /*start gift card */
    $(document).on("click", ".hub-accord h5", function (t) {
        $(this).find('i').toggleClass('fa-plus fa-minus').parent().next('.hub-box-open').slideToggle(250).parent('.hub-accord').siblings().find('.fa').removeClass('fa-minus').addClass('fa-plus').parent().next('.hub-box-open').slideUp(250);
    });
    $(document).on("click", ".full-dropy", function (t) { $(this).find('.fa').toggleClass('fa-minus fa-plus'); });
    $(document).on("click", "#btnAddGiftCardProduct", function (t) {
        t.preventDefault(); let pid = $(this).data('pid'), vid = $(this).data('vid'), p_name = $(this).data('name'); bindGiftCardProduct(p_name, pid, vid);
        //let rowid = $(this).data('rowid'), orderitemid = parseInt($(this).data('orderitemid')) || 0, feeamt = parseFloat($('#txt_FeeAmt').val()) || 0.00;
        //if ($('#txt_FeeTitle').val() == '') { swal('Error!', 'Please enter fee title.', "error").then((result) => { $('#txt_FeeTitle').focus(); return false; }); return false; }
        //else if ($('#ddlFeeType').val() == '0') { swal('Error!', 'Please select fee type.', "error").then((result) => { $('#ddlFeeType').focus(); return false; }); return false; }
        //else if (feeamt == 0) { swal('Error!', 'Please enter fee amount.', "error").then((result) => { $('#txt_FeeAmt').focus(); return false; }); return false; }
        //else { ApplyFee(rowid, orderitemid, $('#txt_FeeTitle').val(), $('#ddlFeeType').val(), feeamt); }
    });
    /*end gift card*/
    $("#loader").hide();
});
function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}

function getProducts(VendorID) {
    $('#line_items').empty(); calculateFinal();
    $.ajax({
        url: '/PurchaseOrder/GetVenderProducts', dataType: 'json', type: "get", contentType: "application/json; charset=utf-8",
        data: { strValue1: VendorID },
        success: function (data) {
            let dt = JSON.parse(data);
            //Payment Terms
            $("#ddlProduct").html('<option value="0">Select Product</option>');
            for (i = 0; i < dt.length; i++) { $("#ddlProduct").append('<option value="' + dt[i].id + '">' + dt[i].text + '</option>'); }

        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }, async: false
    });
}


///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Get New Order No ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function NewOrderNo() {
    let cus_id = parseInt($("#ddlUser").val()) || 0, oid = 0, postMetaxml = [];
    postMetaxml.push(
        { post_id: oid, meta_key: '_order_key', meta_value: 'wc_order_' }, { post_id: oid, meta_key: '_customer_user', meta_value: cus_id },
        { post_id: oid, meta_key: '_payment_method', meta_value: '' }, { post_id: oid, meta_key: '_payment_method_title', meta_value: '' },
        { post_id: oid, meta_key: '_customer_ip_address', meta_value: '::1' }, { post_id: oid, meta_key: '_customer_user_agent', meta_value: '0' },
        { post_id: oid, meta_key: '_created_via', meta_value: 'checkout' }, { post_id: oid, meta_key: '_cart_hash', meta_value: '0' },
        { post_id: oid, meta_key: '_billing_company', meta_value: '' }, { post_id: oid, meta_key: '_shipping_company', meta_value: '' },
        { post_id: oid, meta_key: '_billing_first_name', meta_value: '' }, { post_id: oid, meta_key: '_billing_last_name', meta_value: '' },
        { post_id: oid, meta_key: '_billing_address_1', meta_value: '' }, { post_id: oid, meta_key: '_billing_address_2', meta_value: '' },
        { post_id: oid, meta_key: '_billing_city', meta_value: '' }, { post_id: oid, meta_key: '_billing_state', meta_value: '' },
        { post_id: oid, meta_key: '_billing_postcode', meta_value: '' }, { post_id: oid, meta_key: '_billing_country', meta_value: '' },
        { post_id: oid, meta_key: '_billing_email', meta_value: '' }, { post_id: oid, meta_key: '_billing_phone', meta_value: '' },
        { post_id: oid, meta_key: '_order_version', meta_value: '4.8.0' }, { post_id: oid, meta_key: '_prices_include_tax', meta_value: 'no' },
        { post_id: oid, meta_key: '_shipping_address_index', meta_value: '' }, { post_id: oid, meta_key: 'is_vat_exempt', meta_value: 'no' },
        { post_id: oid, meta_key: '_download_permissions_granted', meta_value: 'yes' }, { post_id: oid, meta_key: '_recorded_sales', meta_value: 'yes' },
        { post_id: oid, meta_key: '_recorded_coupon_usage_counts', meta_value: 'yes' }, { post_id: oid, meta_key: '_order_stock_reduced', meta_value: 'yes' },
        { post_id: oid, meta_key: '_edit_lock', meta_value: '1' }, { post_id: oid, meta_key: '_shipping_first_name', meta_value: '' },
        { post_id: oid, meta_key: '_shipping_last_name', meta_value: '' }, { post_id: oid, meta_key: '_shipping_address_1', meta_value: '' },
        { post_id: oid, meta_key: '_shipping_address_2', meta_value: '' }, { post_id: oid, meta_key: '_shipping_city', meta_value: '' },
        { post_id: oid, meta_key: '_shipping_state', meta_value: '' }, { post_id: oid, meta_key: '_shipping_postcode', meta_value: '' },
        { post_id: oid, meta_key: '_shipping_country', meta_value: '' }, { post_id: oid, meta_key: '_shipping_email', meta_value: '' },
        { post_id: oid, meta_key: '_shipping_phone', meta_value: '' }, { post_id: oid, meta_key: '_order_currency', meta_value: 'USD' },
        { post_id: oid, meta_key: '_order_total', meta_value: 0.00 }, { post_id: oid, meta_key: '_cart_discount', meta_value: 0.00 },
        { post_id: oid, meta_key: '_cart_discount_tax', meta_value: '0' }, { post_id: oid, meta_key: '_order_shipping', meta_value: 0.00 },
        { post_id: oid, meta_key: '_order_shipping_tax', meta_value: 0.00 }, { post_id: oid, meta_key: '_order_tax', meta_value: 0.00 },
        { post_id: oid, meta_key: 'employee_id', meta_value: '0' }, { post_id: oid, meta_key: 'employee_name', meta_value: '' }
    );
    let option = { OrderPostMeta: postMetaxml };
    if (cus_id > 0) {
        $('.agentaddtocart').removeClass('hidden');
        ajaxFunction('/OrdersMySQL/GenerateNewOrderNo', option, beforeSendFun, function (result) {
            let id = parseInt(result.id) || 0;
            if (id > 0) {
                let id = parseInt(result.id) || 0;
                $('#hfOrderNo').val(result.id); $('#lblOrderNo').text('Order #' + result.id + ' detail '); $('.billnote').prop("disabled", false); isEdit(true);
            }
            else { swal('Error', result.message, "error"); $('.billnote').prop("disabled", true); }
        }, completeFun, errorFun, false);
    }
}
///Find Address of Customer
function CustomerAddress(id) {
    //$("#ddlUser").val()
    let option = { strValue1: parseInt(id) || 0 };
    if (option.strValue1 > 0) {
        ajaxFunction('/Orders/GetCustomerAddress', option, function () { }, function (result) {
            var data = JSON.parse(result);
            for (var i = 0; i < data.length; i++) {
                ///billing_Details
                if (data[i].meta_key == 'billing_first_name') { $('#txtbillfirstname').val(data[i].meta_value); }
                else if (data[i].meta_key == 'billing_last_name') { $('#txtbilllastname').val(data[i].meta_value); }
                else if (data[i].meta_key == 'billing_company') { $('#txtbillcompany').val(data[i].meta_value); }
                else if (data[i].meta_key == 'billing_address_1') { $('#txtbilladdress1').val(data[i].meta_value); }
                else if (data[i].meta_key == 'billing_address_2') { $('#txtbilladdress2').val(data[i].meta_value); }
                else if (data[i].meta_key == 'billing_postcode') { $('#txtbillzipcode').val(data[i].meta_value); }
                else if (data[i].meta_key == 'billing_city') { $('#txtbillcity').val(data[i].meta_value); }
                else if (data[i].meta_key == 'billing_country') { $('#ddlbillcountry').val(data[i].meta_value.trim()).trigger('change'); }
                else if (data[i].meta_key == 'billing_state') { $('#ddlbillstate').val(data[i].meta_value).trigger('change'); }
                else if (data[i].meta_key == 'billing_email') { $('#txtbillemail').val(data[i].meta_value); }
                else if (data[i].meta_key == 'billing_phone') { $('#txtbillphone').val(data[i].meta_value.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3")); }
                ///shipping_Details
                else if (data[i].meta_key == 'shipping_first_name') { $('#txtshipfirstname').val(data[i].meta_value); }
                else if (data[i].meta_key == 'shipping_last_name') { $('#txtshiplastname').val(data[i].meta_value); }
                else if (data[i].meta_key == 'shipping_company') { $('#txtshipcompany').val(data[i].meta_value); }
                else if (data[i].meta_key == 'shipping_address_1') { $('#txtshipaddress1').val(data[i].meta_value); }
                else if (data[i].meta_key == 'shipping_address_2') { $('#txtshipaddress2').val(data[i].meta_value); }
                else if (data[i].meta_key == 'shipping_postcode') { $('#txtshipzipcode').val(data[i].meta_value); }
                else if (data[i].meta_key == 'shipping_city') { $('#txtshipcity').val(data[i].meta_value); }
                else if (data[i].meta_key == 'shipping_country') { $('#ddlshipcountry').val(data[i].meta_value.trim()).trigger('change'); }
                else if (data[i].meta_key == 'shipping_state') { $('#ddlshipstate').val(data[i].meta_value.trim()).trigger('change'); }
            }
        }, function () { $('.billinfo').prop("disabled", false); }, function (XMLHttpRequest, textStatus, errorThrown) { $('.billinfo').prop("disabled", true); alert(errorThrown); }, false);
        setTimeout(function () { GetTaxRate(); }, 100);
    }
    else {
        $('.billinfo').prop("disabled", true);
        $('#txtbillfirstname,#txtbilllastname,#txtbillcompany,#txtbilladdress1,#txtbilladdress2,#txtbillzipcode,#txtbillcity,#txtbillemail,#txtbillphone').val('');
        $('#ddlbillcountry').val('US').trigger('change');
        $('#txtshipfirstname,#txtshiplastname,#txtshipcompany,#txtshipaddress1,#txtshipaddress2,#txtshipzipcode,#txtshipcity').val('');
        $('#ddlshipcountry').val('US').trigger('change'); $('#hfTaxRate').val('0');
    }
}
function GetTaxRate() {
    ///Tax Calculate for state
    //let tax_states = ["NY", "CA", "CO", "CT", "IL", "IN", "MI", "MS", "NC", "NE", "NJ", "NM", "PA", "TN", "TX", "WA", "AR", "FL", "GA", "IA", "MO", "OH", "SC", "WI"];
    //let s_state = $("#ddlshipstate").val(), sub_total = parseFloat($("#ddlshipstate").val()) || 100, ship_total = parseFloat($("#shippingTotal").val()) || 0.00;
    //if (tax_states.includes(s_state)) {
    //    var opt = {
    //        to_zip: $("#txtshipzipcode").val(), to_street: $("#txtshipaddress1").val(), to_city: $("#txtshipcity").val(), to_state: s_state, to_country: $("#ddlshipcountry").val(), amount: sub_total, shipping: ship_total
    //    };
    //    if (opt.to_zip.length <= 0 || opt.to_city.length <= 0 || opt.to_country.length <= 0) { $('#hfTaxRate').data('meta_data', []); $('#hfTaxRate').val(0); $('#hfFreighttaxable').val(false); }
    //    else {
    //        ajaxFunction('/Orders/GetTaxAmounts', opt, function () { }, function (res) {
    //            let tax_meta = (res.tax_meta != '' && res.tax_meta != null) ? JSON.parse(res.tax_meta) : [];
    //            $('#hfTaxRate').data('meta_data', tax_meta); $('#hfTaxRate').val(res.rate); $('#hfFreighttaxable').val(res.freight_taxable);
    //        }, function () { }, function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); }, false);
    //    }
    //}
    //else { $('#hfTaxRate').data('meta_data', []); $('#hfTaxRate').val(0.00); $('#hfFreighttaxable').val(false); }
    //calculateDiscountAcount();
}
function GetSRTaxRate() {
    let tax_states = ["CT", "RI"], s_state = $("#ddlshipstate").val();
    if (tax_states.includes(s_state)) {
        var opt = {
            strValue1: $("#txtshipzipcode").val(), strValue2: $("#txtshipaddress1").val(), strValue3: $("#txtshipcity").val(), strValue4: s_state, strValue5: $("#ddlshipcountry").val()
        };
        $.post('/Orders/GetTaxRate', opt).then(response => { $('#hfTaxRate').data('srfee', response.rate); });
    }
    else { $('#hfTaxRate').data('srfee', 0.00); }
    //calculateDiscountAcount();
}
function CategoryWiseProducts() {
    let strHTML = ''; $("#category_items").empty();
    $.get('/Orders/GetCategoryWiseProducts', { strValue1: 'category' }).done(function (result) {
        try {
            result = JSON.parse(result);
            result = groupArrayOfObjects(result, 'term_order');
            $.each(result, function (key, pr) {
                strHTML = '<div class="hub-accord col-sm-12 wow animate__slideInLeft" data-wow-duration="1s" data-wow-delay=".5s">';
                strHTML += '<h5><span>' + pr[0].name.toUpperCase() + '</span><i aria-hidden="true" class="fa fa-plus"></i></h5>';
                strHTML += '<div class="hub-box-open">';
                $.each(pr, function (index, data) {
                    try {
                        let variation_details = JSON.parse(data.variation_details);
                        let regular_price = 0.00, price = 0.00;
                        strHTML += '<div class="hub-pro-box"><h2>' + data.post_title.toUpperCase() + '</h2>';
                        if (data.gift_card == 'yes') {
                            strHTML += '<div data-proid="' + data.pr_id + '" data-name="' + data.post_title + '" class="hub-pro-shop"><a href="javascript:;" data-producttype="gift_card" class="agentaddtocart btn btn-danger hidden" data-toggle="tooltip" data-original-title="Add to Cart" style="max-width:90px;">Add to Cart</a></div>';
                        }
                        else {
                            strHTML += '<div data-proid="' + data.pr_id + '" class="hub-pro-shop">';
                            strHTML += '<select class="form-control addnvar" style="min-width: 335px; max-width:335px;">';
                            $(variation_details).each(function (pvIndex, pvRow) {
                                if (pvIndex == 0) regular_price = parseFloat(pvRow._regular_price) || 0.00, price = parseFloat(pvRow._price) || 0.00;
                                if (isNullAndUndef(pvRow.vr_id)) {
                                    //if (pr[0].name.toUpperCase() == 'MATTRESS' && pvRow.vr_title.includes('Queen'))
                                    if (pvRow.vr_title.includes('Queen')) {
                                        strHTML += '<option value="' + pvRow.vr_id + '-' + pvRow._regular_price + '-' + pvRow._price + '" selected>' + pvRow.vr_title + '</option>';
                                        regular_price = parseFloat(pvRow._regular_price) || 0.00, price = parseFloat(pvRow._price) || 0.00;
                                    }
                                    else strHTML += '<option value="' + pvRow.vr_id + '-' + pvRow._regular_price + '-' + pvRow._price + '">' + pvRow.vr_title + '</option>';
                                }
                                else strHTML += '<option value="0-0-0">No Variations</option>';
                            });
                            strHTML += '</select>';
                            strHTML += '<input min="1" class="form-control addnvar-qty billinfo" type="number" value="1" name="txt_ItemQty" placeholder="Qty" style="max-width: 80px;">';
                            if (price < regular_price && regular_price > 0) strHTML += '<div class="hub-pro-price" style="min-width: 130px;"><span>$' + price.toFixed(2) + '<span>$' + regular_price.toFixed(2) + '</span></span></div>';
                            else strHTML += '<div class="hub-pro-price" style="min-width: 130px;"><span>$' + price.toFixed(2) + '</span></div>';
                            strHTML += '<a href="javascript:;" data-producttype="product" class="agentaddtocart btn btn-danger hidden" data-toggle="tooltip" data-original-title="Add to Cart" style="max-width:90px;">Add to Cart</a>';
                            strHTML += '</div>';
                        }
                        strHTML += '</div>';
                    }
                    catch (error) { }
                });
                strHTML += '</div>';
                strHTML += '</div>';
                $("#category_items").append(strHTML);
            });
        }
        catch (error) { $("#loader").hide(); }
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) { console.log(XMLHttpRequest, textStatus, errorThrown); $("#loader").hide(); swal('Alert!', errorThrown, "error"); });
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Search Customer Popup ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function searchOrderModal() {
    let modalHtml = '<div class="modal-dialog">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    modalHtml += '<h4 class="modal-title" id="myModalLabel">Search Customer</h4>';
    modalHtml += '</div>';
    modalHtml += '<div class="modal-body"></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#billModal").empty().html(modalHtml);

    modalHtml = '<div class="row nowrap-row">';
    modalHtml += '<div class="col-md-8">';
    modalHtml += '<div class="form-group"><select class="form-control select2" id="ddlCustomerSearch" placeholder="Select Customer Email" style="width: 100%;"></select></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    modalHtml += '<div class="row mt-1">';
    modalHtml += '<div class="col-md-12">';
    modalHtml += '<div class="table-responsive">';
    modalHtml += '<table id="tblCusOrders" class="table table-blue check-table table-bordered table-striped dataTable tablelist">';
    modalHtml += '<thead><tr><th style="width: 30%">Select Address</th><th style="width: 35%">Billing Address</th><th style="width: 35%">Shipping Address</th></tr></thead>';
    modalHtml += '<tbody></tbody>';
    modalHtml += '</table>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    modalHtml += '</div>';

    $('#billModal .modal-body').append(modalHtml);
    $("#billModal").modal({ backdrop: 'static', keyboard: false });
    let searchText = localStorage.getItem('_search');
    $('#ddlCustomerSearch').select2('open'); $('#billModal').find('[type=search]').val(searchText);
    localStorage.setItem('_search', '');
}
function bindCustomerOrders(id) {
    let opt = { strValue1: parseInt(id) || 0 };
    $.post('/Orders/GetCustomersAddresssList', opt).then(response => {
        $('#tblCusOrders').dataTable({
            destroy: true, data: JSON.parse(response), order: [[0, "desc"]],
            columns: [
                {
                    data: 'customer_id', title: 'Select Address', sWidth: "30%",
                    render: function (data, type, dtrow, meta) {
                        //return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="ShowUseAddress(this);" value="' + $('<div/>').text(data).html() + '"><label></label>';
                        let row = JSON.parse(dtrow.meta_data);
                        let defval = '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="ShowUseAddress(this);" value="' + $('<div/>').text(data).html() + '"><label></label>';
                        let val = ' data-bfn="' + row._billing_first_name + '" data-bln="' + row._billing_last_name + '" data-bcom="' + (isNullAndUndef(row._billing_company) ? row._billing_company : '') + '" data-ba1="' + (isNullAndUndef(row._billing_address_1) ? row._billing_address_1 : '') + '" data-ba2="' + (isNullAndUndef(row._billing_address_2) ? row._billing_address_2 : '') + '" data-bc="' + row._billing_city + '" data-bs="' + row._billing_state + '" data-bct="' + row._billing_country + '" data-bpc="' + row._billing_postcode + '" data-bp="' + row._billing_phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '" data-bem="' + row._billing_email + '"';
                        val += ' data-sfn="' + row._shipping_first_name + '" data-sln="' + row._shipping_last_name + '" data-scom="' + (isNullAndUndef(row._shipping_company) ? row._shipping_company : '') + '" data-sa1="' + (isNullAndUndef(row._shipping_address_1) ? row._shipping_address_1 : '') + '" data-sa2="' + (isNullAndUndef(row._shipping_address_2) ? row._shipping_address_2 : '') + '" data-sc="' + row._shipping_city + '" data-ss="' + row._shipping_state + '" data-sct="' + row._shipping_country + '" data-spc="' + row._shipping_postcode + '"';
                        return defval + ' <button type="button" id="btnUseAddress" class="btn btn-danger hidden" onclick="selectOrderAddress(this);" ' + val + '>Use this address for order</button>'
                    }
                },
                {
                    data: 'meta_data', title: 'BILLING ADDRESS', sWidth: "35%", render: function (data, type, dtrow) {
                        let row = JSON.parse(dtrow.meta_data);
                        //let val = '<address class="no-margin">' + row._billing_first_name + ' ' + row._billing_last_name + (!isNullAndUndef(dtrow.IsDefault) ? ' <span class="label label-success">' +  dtrow.IsDefault + '</span>' : '') + (isNullUndefAndSpace(row._billing_company) ? '<br>' + row._billing_company : '') + (isNullUndefAndSpace(row._billing_address_1) ? '<br>' + row._billing_address_1 : '') + (isNullUndefAndSpace(row._billing_address_2) ? '<br>' + row._billing_address_2 : '') + '<br>' + row._billing_city + ', ' + row._billing_state + ' ' + row._billing_postcode + ' ' + row._billing_country + '<br>Phone: ' + row._billing_phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '<br>Email: ' + row._billing_email + '</address>';
                        let val = '<address class="no-margin">' + row._billing_first_name + ' ' + row._billing_last_name + (dtrow.IsDefault == 1 ? ' <span class="label label-success">Default</span>' : '') + (isNullUndefAndSpace(row._billing_company) ? '<br>' + row._billing_company : '') + (isNullUndefAndSpace(row._billing_address_1) ? '<br>' + row._billing_address_1 : '') + (isNullUndefAndSpace(row._billing_address_2) ? '<br>' + row._billing_address_2 : '') + '<br>' + row._billing_city + ', ' + row._billing_state + ' ' + row._billing_postcode + ' ' + row._billing_country + '<br>Phone: ' + row._billing_phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '<br>Email: ' + row._billing_email + '</address>';
                        return val;
                    }
                },
                {
                    data: 'shipping_first_name', title: 'SHIPPING ADDRESS', sWidth: "35%", render: function (data, type, dtrow) {
                        let row = JSON.parse(dtrow.meta_data);
                        let val = '<address class="no-margin">' + row._shipping_first_name + ' ' + row._shipping_last_name + (isNullUndefAndSpace(row._shipping_company) ? '<br>' + row._shipping_company : '') + (isNullUndefAndSpace(row._shipping_address_1) ? '<br>' + row._shipping_address_1 : '') + (isNullUndefAndSpace(row._shipping_address_2) ? '<br>' + row._shipping_address_2 : '') + '<br>' + row._shipping_city + ', ' + row._shipping_state + ' ' + row._shipping_postcode + ' ' + row._shipping_country + '</address>';
                        return val;
                    }
                }
            ]
        });
    }).catch(err => { swal('Error!', err, 'error'); });
}
function ShowUseAddress(chk) {
    var isChecked = $(chk).prop("checked");
    $("[name='CheckSingle']").prop("checked", false);
    $("[name='CheckSingle']").parent().parent().find('#btnUseAddress').addClass('hidden');
    $(chk).prop("checked", isChecked);
    if (isChecked == false) $(chk).parent().parent().find('#btnUseAddress').addClass('hidden');
    else $(chk).parent().parent().find('#btnUseAddress').removeClass('hidden');
}
function selectOrderAddress(ele) {
    let cus_id = parseInt($("#ddlCustomerSearch").val()) || 0, cus_text = $("#ddlCustomerSearch option:selected").text();
    var oid = parseInt($('#hfOrderNo').val()) || 0;
    if (cus_id > 0) {
        $("#ddlUser").empty().append('<option value="' + cus_id + '" selected>' + cus_text + '</option>');
        if (oid == 0) {
            //$.when(NewOrderNo()).done(function () {
            //    oid = parseInt($('#hfOrderNo').val()) || 0;
            //    if (oid > 0) { $("#billModal").modal('hide'); $('.billinfo').prop("disabled", false); }
            //}).fail(function (error) { console.log(error); });
            $("#billModal").modal('hide'); $('.billinfo').prop("disabled", false);
        }
        else { $("#billModal").modal('hide'); $('.billinfo').prop("disabled", false); }

        ///billing_Details
        if ($(ele).data('bfn') != undefined) $('#txtbillfirstname').val($(ele).data('bfn'));
        if ($(ele).data('bln') != undefined) $('#txtbilllastname').val($(ele).data('bln'));
        if ($(ele).data('bcom') != undefined) $('#txtbillcompany').val($(ele).data('bcom'));
        if ($(ele).data('ba1') != undefined) $('#txtbilladdress1').val($(ele).data('ba1'));
        if ($(ele).data('ba2') != undefined) $('#txtbilladdress2').val($(ele).data('ba2'));
        if ($(ele).data('bpc') != undefined) $('#txtbillzipcode').val($(ele).data('bpc'));
        if ($(ele).data('bc') != undefined) $('#txtbillcity').val($(ele).data('bc'));
        if ($(ele).data('bct') != undefined) $('#ddlbillcountry').val($(ele).data('bct')).trigger('change');
        if ($(ele).data('bs') != undefined) $('#ddlbillstate').val($(ele).data('bs')).trigger('change');
        if ($(ele).data('bem') != undefined) $('#txtbillemail').val($(ele).data('bem'));
        if ($(ele).data('bp') != undefined) $('#txtbillphone').val($(ele).data('bp')); //$('#txtbillphone').val($('#txtbillphone').val().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3"));
        ///shipping_Details
        if ($(ele).data('sfn') != undefined) $('#txtshipfirstname').val($(ele).data('sfn'));
        if ($(ele).data('sln') != undefined) $('#txtshiplastname').val($(ele).data('sln'));
        if ($(ele).data('scom') != undefined) $('#txtshipcompany').val($(ele).data('scom'));
        if ($(ele).data('sa1') != undefined) $('#txtshipaddress1').val($(ele).data('sa1'));
        if ($(ele).data('sa2') != undefined) $('#txtshipaddress2').val($(ele).data('sa2'));
        if ($(ele).data('spc') != undefined) $('#txtshipzipcode').val($(ele).data('spc'));
        if ($(ele).data('sc') != undefined) $('#txtshipcity').val($(ele).data('sc'));
        if ($(ele).data('sct') != undefined) $('#ddlshipcountry').val($(ele).data('sct').trim()).trigger('change');
        if ($(ele).data('ss') != undefined) $('#ddlshipstate').val($(ele).data('ss').trim()).trigger('change');
        $("#btnCheckout").hide();
    }
}
function addCustomerModal(cus_name) {
    let modalHtml = '';
    modalHtml += '<div class="modal-dialog modal-lg">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<div class="modal-header">';
    modalHtml += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    modalHtml += '<h4 class="modal-title" id="myModalLabel">Add Customer</h4>';
    modalHtml += '</div>';
    modalHtml += '<div class="modal-body" ></div>';
    modalHtml += '<div class="modal-footer">';
    modalHtml += '<button type="button" class="btn btn-primary" id="btnBackSearchCusrtomer"><i class="glyphicon glyphicon-arrow-left"></i> Back Search Customer</button>';
    modalHtml += '<button type="button" class="btn btn-danger" id="btnSaveCustomer"><i class="glyphicon glyphicon-floppy-saved"></i> Save Customer</button>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#billModal").empty().html(modalHtml);

    let myHtml = '';
    myHtml += '<div class="row">';
    myHtml += '<div class="col-md-6">';
    myHtml += '<div class="form-group">First Name<span class="text-red">*</span><input type="text" id="txtCusFirstName" class="form-control" placeholder="First Name"/></div>';
    myHtml += '</div >';

    myHtml += '<div class="col-md-6">';
    myHtml += '<div class="form-group">Last Name<span class="text-red">*</span><input type="text" id="txtCusLastName" class="form-control" placeholder="Last Name"/></div>';
    myHtml += '</div >';
    myHtml += '</div >';

    myHtml += '<div class="row">';
    myHtml += '<div class="col-md-6">';
    myHtml += '<div class="form-group">User Name/Email<span class="text-red">*</span><input type="text" id="txtCusNickName" class="form-control" placeholder="User Name" value="' + cus_name + '"/></div>';
    myHtml += '</div >';

    myHtml += '<div class="col-md-6">';
    myHtml += '<div class="form-group">Contact No.<span class="text-red">*</span><input type="tel" id="txtCusBillingMobile" class="form-control" placeholder="Contact No." maxlength="11"/></div>';
    myHtml += '</div >';
    myHtml += '</div >';

    myHtml += '<div class="row">';
    myHtml += '<div class="col-md-4">';
    myHtml += '<div class="form-group">Country<span class="text-red">*</span><select class="form-control select2" id="ddlCusBillingCountry"><option value="US">US - United States</option><option value="CA">CA - Canada</option></select></div>';
    myHtml += '</div >';

    myHtml += '<div class="col-md-4">';
    myHtml += '<div class="form-group"><i class="glyphicon glyphicon-map-marker" aria-hidden="true"></i> Address<span class="text-red">*</span><input type="text" id="txtCusBillingAddress1" class="form-control searchAddress" data-addresstype="cus-bill" placeholder="Address"/></div>';
    myHtml += '</div >';

    myHtml += '<div class="col-md-4">';
    myHtml += '<div class="form-group">Address Line 2<input type="text" id="txtCusBillingAddress2" class="form-control" placeholder="Address Line 2"/></div>';
    myHtml += '</div >';
    myHtml += '</div >';

    myHtml += '<div class="row">';
    myHtml += '<div class="col-md-4">';
    myHtml += '<div class="form-group">Zip Code<span class="text-red">*</span><input type="text" id="txtCusBillingPostCode" class="form-control" placeholder="Zip Code"/></div>';
    myHtml += '</div >';

    myHtml += '<div class="col-md-4">';
    myHtml += '<div class="form-group">City<span class="text-red">*</span><input type="tel" id="txtCusBillingCity" class="form-control" placeholder="City"/></div>';
    myHtml += '</div >';

    myHtml += '<div class="col-md-4">';
    myHtml += '<div class="form-group">State<span class="text-red">*</span><select class="form-control select2" id="ddlCusBillingState"></select></div>';
    myHtml += '</div>';
    myHtml += '</div>';

    $('#billModal .modal-body').append(myHtml); BindStateCounty("ddlCusBillingState", { id: 'US' });
    $("#ddlCusBillingCountry,#ddlCusBillingState").select2({ dropdownParent: "#billModal" });
    $("#billModal").modal({ backdrop: 'static', keyboard: false }); $("#txtCusFirstName").focus(); $("#txtCusBillingMobile").mask("(999) 999-9999"); //$("#ddlCusBillingState,#ddlCusBillingCountry").select2();
    //let newEl = document.getElementById('txtCusBillingAddress1');
    //setupAutocomplete(newEl);
}
function saveCustomer() {
    var oid = parseInt($('#hfOrderNo').val()) || 0;
    let Email = $("#txtCusNickName").val()//$("#txtCusEmail").val();
    let NickName = $("#txtCusNickName").val();
    let FirstName = $("#txtCusFirstName").val();
    let LastName = $("#txtCusLastName").val();
    let BillingAddress1 = $("#txtCusBillingAddress1").val();
    let BillingAddress2 = $("#txtCusBillingAddress2").val();
    let BillingPostcode = $("#txtCusBillingPostCode").val();
    let BillingCountry = $("#ddlCusBillingCountry").val();
    let BillingState = $("#ddlCusBillingState").val();
    let BillingCity = $("#txtCusBillingCity").val();
    let BillingPhone = $("#txtCusBillingMobile").val();

    let rex_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

    if (FirstName == "") { swal('alert', 'Please Enter First Name', 'error').then(function () { swal.close(); $('#txtCusFirstName').focus(); }) }
    else if (LastName == "") { swal('alert', 'Please Enter Last Name', 'error').then(function () { swal.close(); $('#txtCusLastName').focus(); }) }
    else if (Email == "") { swal('alert', 'Please Enter Email', 'error').then(function () { swal.close(); $('#txtCusNickName').focus(); }) }
    else if (Email != "" && !rex_email.test(Email)) { swal('alert', 'Please enter valid email.', 'error').then(function () { swal.close(); $('#txtCusNickName').focus(); }) }
    //else if (NickName == "") { swal('alert', 'Please Enter User Name', 'error').then(function () { swal.close(); $('#txtUserNickName').focus(); }) }
    else if (BillingPhone == "") { swal('alert', 'Please Enter Contact No.', 'error').then(function () { swal.close(); $('#txtCusBillingMobile').focus(); }) }
    else if (BillingCountry == "") { swal('alert', 'Please Enter Country', 'error').then(function () { swal.close(); $('#ddlCusBillingCountry').focus(); }) }
    else if (BillingAddress1 == "") { swal('alert', 'Please Enter Address 1', 'error').then(function () { swal.close(); $('#txtCusBillingAddress1').focus(); }) }
    else if (BillingPostcode == "") { swal('alert', 'Please Enter Zip Code', 'error').then(function () { swal.close(); $('#txtCusBillingPostCode').focus(); }) }
    else if (BillingCity == "") { swal('alert', 'Please Enter City', 'error').then(function () { swal.close(); $('#txtCusBillingCity').focus(); }) }
    else if (BillingState == "") { swal('alert', 'Please Enter State', 'error').then(function () { swal.close(); $('#ddlCusBillingState').select(); }) }
    else if (BillingState == "0") { swal('alert', 'Please Enter State', 'error').then(function () { swal.close(); $('#ddlCusBillingState').focus(); }) }
    else {
        var obj = {
            ID: 0, user_email: Email, user_nicename: NickName, first_name: FirstName, last_name: LastName, billing_address_1: BillingAddress1,
            billing_address_2: BillingAddress2, billing_postcode: BillingPostcode, billing_country: BillingCountry,
            billing_state: BillingState, billing_city: BillingCity, billing_phone: BillingPhone
        }
        ajaxFunction('/Customer/NewUser/', obj, beforeSendFun, function (data) {
            if (data.status == true) {
                swal('Success', data.message, 'success');
                $("#ddlUser").empty().append('<option value="' + data.id + '" selected>' + Email + '</option>');
                if (oid == 0) { setTimeout(function () { NewOrderNo(); }, 50); }
                $("#billModal").modal('hide'); $('.billinfo').prop("disabled", false);
                ///billing_Details
                $('#txtbillfirstname,#txtshipfirstname').val(FirstName);
                $('#txtbilllastname,#txtshiplastname').val(LastName);
                $('#txtbillcompany,#txtshipcompany').val('');
                $('#txtbilladdress1,#txtshipaddress1').val(BillingAddress1);
                $('#txtbilladdress2,#txtshipaddress2').val(BillingAddress2);
                $('#txtbillzipcode,#txtshipzipcode').val(BillingPostcode);
                $('#txtbillcity,#txtshipcity').val(BillingCity);
                $('#ddlbillcountry,#ddlshipcountry').val(BillingCountry).trigger('change');
                $('#ddlbillstate,#ddlshipstate').val(BillingState).trigger('change');
                $('#txtbillemail').val(Email);
                $('#txtbillphone').val(BillingPhone);
            }
            else {
                swal('Error', data.message, 'error')
            }
        }, completeFun, errorFun, false);
    }
}
function copyBillingAddress() {
    $("#loader").show();
    $('#txtshipfirstname').val($("#txtbillfirstname").val());
    $('#txtshiplastname').val($("#txtbilllastname").val());
    $('#txtshipcompany').val($("#txtbillcompany").val());
    $('#txtshipaddress1').val($("#txtbilladdress1").val());
    $('#txtshipaddress2').val($("#txtbilladdress2").val());
    $('#txtshipzipcode').val($("#txtbillzipcode").val());
    $('#txtshipcity').val($("#txtbillcity").val());
    $('#ddlshipcountry').val($("#ddlbillcountry").val()).trigger('change');
    $('#ddlshipstate').val($("#ddlbillstate").val()).trigger('change');
    $("#loader").hide();
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Search Google Place API ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var autocompleteOptions = { componentRestrictions: { country: ["us", "ca"] }, fields: ["address_components", "geometry"], types: ["address"] };
function setupAutocomplete(inputs) {
    //console.log('setupAutocomplete...', $(inputs));
    autocomplete = new google.maps.places.Autocomplete(inputs, autocompleteOptions);
    autocomplete.addListener("place_changed", fillInAddress);
    function fillInAddress() {
        let place = autocomplete.getPlace();
        let address = '';
        let cAdd1 = 'txtCusBillingAddress1', cZipCode = 'txtCusBillingPostCode', cCity = 'txtCusBillingCity', cCountry = 'ddlCusBillingCountry', cState = 'ddlCusBillingState';
        if ($(inputs).data('addresstype') == 'bill')
            cAdd1 = 'txtbilladdress1', cZipCode = 'txtbillzipcode', cCity = 'txtbillcity', cCountry = 'ddlbillcountry', cState = 'ddlbillstate';
        else if ($(inputs).data('addresstype') == 'ship')
            cAdd1 = 'txtshipaddress1', cZipCode = 'txtshipzipcode', cCity = 'txtshipcity', cCountry = 'ddlshipcountry', cState = 'ddlshipstate';
        let obj = place.address_components.filter(element => element.types[0] == 'street_number');
        if (obj.length > 0)
            address = obj[0].long_name;
        obj = place.address_components.filter(element => element.types[0] == 'route');
        if (obj.length > 0)
            address = address + ' ' + obj[0].long_name;
        $("#" + cAdd1).val(address);
        obj = place.address_components.filter(element => element.types[0] == 'postal_code');
        if (obj.length > 0)
            $("#" + cZipCode).val(obj[0].long_name);
        else
            $("#" + cZipCode).val('');
        obj = place.address_components.filter(element => element.types[0] == 'locality');
        if (obj.length > 0)
            $("#" + cCity).val(obj[0].long_name);
        else
            $("#" + cCity).val('');
        obj = place.address_components.filter(element => element.types[0] == 'country');
        if (obj.length > 0)
            $("#" + cCountry).val(obj[0].short_name).trigger('change');
        else
            $("#" + cCountry).val('US').trigger('change');
        obj = place.address_components.filter(element => element.types[0] == 'administrative_area_level_1');
        if (obj.length > 0)
            $("#" + cState).val(obj[0].short_name).trigger('change');//.append('<option value="' + obj[0].short_name + '" selected>' + obj[0].long_name + '</option>');
        else
            $("#" + cState).val('').trigger('change');;
    }
}
function initMap() {
    var inputs = document.getElementById("txtshipaddress1"); setupAutocomplete(inputs);
    //inputs = document.getElementById("txtshipaddress1"); setupAutocomplete(inputs);
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Edit Order ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getOrderInfo() {
    $('.view-addmeta').empty(); $('.billinfo,#order_note_type').prop("disabled", true);
    let oid = parseInt($('#hfOrderNo').val()) || 0;
    if (oid > 0) {
        $('#order_note_type').prop("disabled", false); $('.agentaddtocart').addClass('hidden');
        $('#ddlStatus,#btnSearch').prop("disabled", true);
        $('.page-heading').text('Edit Order ').append('<a class="btn btn-danger" href="/OrdersMySQL/OrdersHistory" data-toggle="tooltip" data-placement="right" title="Go to Order List">Back to List</a>');
        $('#lblOrderNo').text('Order #' + oid + ' detail '); $('#hfOrderNo').val(oid);
        $('#order_line_items,#order_state_recycling_fee_line_items,#order_fee_line_items,#order_shipping_line_items,#order_refunds,#billCoupon,#billGiftCard,.refund-action').empty();
        $('#btnCheckout').remove();
        var opt = { strValue1: oid };
        ajaxFunction('/Orders/GetOrderInfo', opt, beforeSendFun, function (result) {
            try {
                var data = JSON.parse(result); //console.log(data);
                if (data.length > 0) {
                    $('#lblOrderNo').data('pay_by', data[0].payment_method);
                    if (data[0].payment_method == 'ppec_paypal') $('#lblOrderNo').data('pay_id', data[0].paypal_id);
                    else if (data[0].payment_method == 'podium') $('#lblOrderNo').data('pay_id', data[0].podium_id);
                    else $('#lblOrderNo').data('pay_id', '');

                    if (data[0].payment_method.trim().length > 0)
                        $('.payment-history').text('Payment via ' + data[0].payment_method_title + ' ' + data[0].created_via + '. Customer IP: ' + data[0].ip_address);
                    else
                        $('.payment-history').text('Customer IP: ' + data[0].ip_address);
                    $('#txtLogDate').val(data[0].date_created);
                    $('#ddlStatus').val(data[0].status.trim()).trigger('change'); $('#ddlUser').prop("disabled", true);
                    if (isNullUndefAndSpace(data[0].customer_name)) $("#ddlUser").empty().append('<option value="' + data[0].customer_id + '" selected>' + data[0].customer_name + '</option>');
                    else $("#ddlUser").empty().append('<option value="1" selected>' + data[0].b_first_name + ' ' + data[0].b_last_name + '</option>');
                    ///billing_Details
                    var tPhone = data[0].b_phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3");
                    $('#txtbillfirstname').val(data[0].b_first_name); $('#txtbilllastname').val(data[0].b_last_name); $('#txtbilladdress1').val(data[0].b_address_1); $('#txtbilladdress2').val(data[0].b_address_2);
                    $('#txtbillzipcode').val(data[0].b_postcode); $('#txtbillcity').val(data[0].b_city); $('#txtbillemail').val(data[0].b_email); $('#txtbillphone').val(tPhone);
                    $('#txtbillcompany').val(data[0].b_company); $('#ddlbillcountry').val(data[0].b_country.trim()).trigger('change'); $('#ddlbillstate').val(data[0].b_state.trim()).trigger('change');

                    ///shipping_Details
                    $('#txtshipfirstname').val(data[0].s_first_name); $('#txtshiplastname').val(data[0].s_last_name); $('#txtshipaddress1').val(data[0].s_address_1); $('#txtshipaddress2').val(data[0].s_address_2);
                    $('#txtshipcompany').val(data[0].s_company); $('#txtshipzipcode').val(data[0].s_postcode); $('#txtshipcity').val(data[0].s_city);
                    $('#ddlshipcountry').val(data[0].s_country.trim()).trigger('change'); $('#ddlshipstate').val(data[0].s_state.trim()).trigger('change');
                    $('#txtCustomerNotes').val(data[0].post_excerpt);

                    if (data[0].is_edit == '1') {
                        if (data[0].is_shiped > 0) {
                            $('.box-tools-header').empty().append('<button type="button" class="btn btn-danger" id="btnPrintPdf" data-toggle="tooltip" title="Print Order invoice"><i class="fas fa-print"></i> Print</button>');
                            $('.box-tools-header').append(' <button type="button" class="btn btn-danger" id="btnSendMail" data-toggle="tooltip" title="Send Order invoice in Mail"><i class="fas fa-envelope"></i> Send Mail</button>');
                            $('.box-tools-header').append(' <button type="button" class="btn btn-danger btnOrderUndo" data-toggle="tooltip" title="Refresh Order"><i class="fa fa-undo"></i> Refresh</button>');
                            $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/OrdersMySQL/OrdersHistory" data-toggle="tooltip" data-placement="right" title="Go to Order List">Back to List</a>');
                        }
                        else {
                            $('.box-tools-header').empty().append('<button type="button" class="btn btn-danger" id="btnPrintPdf" data-toggle="tooltip" title="Print Order invoice"><i class="fas fa-print"></i> Print</button> <button type="button" class="btn btn-danger btnOrderUndo" data-toggle="tooltip" title="Refresh Order"><i class="fa fa-undo"></i> Refresh</button> <button type="button" class="btn btn-danger btnEditOrder" data-toggle="tooltip" title="Edit Order"><i class="far fa-edit"></i> Edit</button>');
                            $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/OrdersMySQL/OrdersHistory" data-toggle="tooltip" data-placement="right" title="Go to Order List">Back to List</a> <button type="button" class="btn btn-danger btnEditOrder" data-toggle="tooltip" title="Edit Order"><i class="far fa-edit"></i> Edit</button>');
                        }
                    }
                    else {
                        $('.box-tools-header').empty().append('<button type="button" class="btn btn-danger" id="btnPrintPdf" data-toggle="tooltip" title="Print Order invoice"><i class="fas fa-print"></i> Print</button>');
                        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/OrdersMySQL/OrdersHistory" data-toggle="tooltip" data-placement="right" title="Go to Order List">Back to List</a>');
                    }
                    //bind Product
                    getOrderItemList(oid);
                    getOrderNotesList(oid);
                    // $('.btnEditOrder').hide();
                    //$('.btnOrderUndo').hide();                    
                    //$('.btnOrderUndo').hide();
                }
            }
            catch (error) {
                $("#loader").hide(); swal('Alert!', "something went wrong.", "error");
            }
        }, function () { $("#loader").hide(); $('.billinfo').prop("disabled", true); }, function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); }, false);
        getItemShippingCharge(false);
    }
    else {
        $('#order_note_type').prop("disabled", false); $('.agentaddtocart').removeClass('hidden');
        $("#loader").hide(); $('#lblOrderNo').data('pay_by', ''); $('#lblOrderNo').data('pay_id', '');
        $('.refund-action').append('<button type="button" id="btnAddFee" class="btn btn-danger billinfo" disabled data-toggle="tooltip" title="Add Other Fee">Fees</button> ');
        $('.page-heading').text('Quick Order'); $('#btnSearch').prop("disabled", false); searchOrderModal();
        CheckPermissions("#btnCheckout", "", "", window.location.pathname);
    }
}
function getOrderItemList(oid) {
    let option = { strValue1: oid }, _tax = [];
    //let coupon_list = [];
    ajaxFunction('/Orders/GetQueckOrderProductList', option, beforeSendFun, function (data) {
        let itemHtml = '', recyclingfeeHtml = '', feeHtml = '', shippingHtml = '', refundHtml = '', couponHtml = '', giftcardHtml = '';
        let zQty = 0.00, zGAmt = 0.00, zTDiscount = 0.00, zTotalTax = 0.00, zShippingAmt = 0.00, zStateRecyclingAmt = 0.00, zFeeAmt = 0.00, zRefundAmt = 0.00, zGiftCardAmt = 0.00, zGiftCardRefundAmt = 0.00;
        $.each(data, function (i, row) {
            let orderitemid = parseInt(row.order_item_id) || 0;
            //console.log(data, row);
            if (row.product_type == 'line_item') {
                let PKey = row.product_id + '_' + row.variation_id; _meta = JSON.parse(row.meta_data);
                let giftcard_amount = parseFloat(_meta.wc_gc_giftcard_amount) || 0.00;
                if (giftcard_amount > 0) itemHtml += '<tr id="tritemId_' + PKey + '" data-id="' + PKey + '" class="gift_item" data-pid="' + row.product_id + '" data-vid="' + row.variation_id + '" data-pname="' + row.product_name + '" data-gid="' + row.group_id + '" data-freeitem="' + row.is_free + '" data-freeitems=\'' + row.free_itmes + '\' data-orderitemid="' + orderitemid + '" data-img="' + row.product_img + '" data-srfee="0" data-sristaxable="' + false + '" data-meta_data=\'' + row.meta_data + '\'>';
                else itemHtml += '<tr id="tritemId_' + PKey + '" data-id="' + PKey + '" class="' + (row.is_free ? 'free_item' : 'paid_item') + '" data-pid="' + row.product_id + '" data-vid="' + row.variation_id + '" data-pname="' + row.product_name + '" data-gid="' + row.group_id + '" data-freeitem="' + row.is_free + '" data-freeitems=\'' + row.free_itmes + '\' data-orderitemid="' + orderitemid + '" data-img="' + row.product_img + '" data-srfee="0" data-sristaxable="' + false + '" data-meta_data=\'' + row.meta_data + '\'>';

                if (row.is_free) {
                    //console.log('AA');
                    //itemHtml += '<td class="text-center item-action"></td><td>' + row.product_name + '</td><td class="text-right">' + row.reg_price.toFixed(2) + '</td>';
                    //itemHtml += '<td><input min="1" autocomplete="off" disabled class="form-control number rowCalulate" type="number" id="txt_ItemQty_' + PKey + '" value="' + row.quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
                    itemHtml += '<td class="text-center item-action"><button class="btn menu-icon-gr p-0 text-red btnDeleteItem billinfo" tabitem_itemid="' + PKey + '" onclick="removeItemsInTable(\'' + PKey + '\');" data-toggle="tooltip" title="Delete product"> <i class="glyphicon glyphicon-trash"></i></button></td>';
                    itemHtml += '<td>' + row.product_name + '<div class="view-addmeta" style="word-wrap: break-word;">';
                    $.each(_meta, function (name, value) { itemHtml += '<b>' + name.replace('_system_', '') + '</b> : ' + value + '<br>'; });
                    itemHtml += '</div></td>';                   
                    itemHtml += '<td class="text-left">' + row.product_sku + '</td>';
                    //itemHtml += '<td class="text-right">' + row.reg_price.toFixed(2) + '</td><td><input min="1" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_ItemQty_' + PKey + '" value="' + row.quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
                    itemHtml += '<td class="text-right product-price" data-price="' + row.sale_price + '">' + row.sale_price + '</td>';
                    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemqty_' + row.product_id + '" value="' + row.quantity + '" name="txt_itemqty" placeholder="Qty."></td>';

                }
                else if (giftcard_amount > 0) {                     
                    itemHtml += '<td class="text-center item-action"><button class="btn menu-icon-gr p-0 text-red btnDeleteItem billinfo" tabitem_itemid="' + PKey + '" onclick="removeItemsInTable(\'' + PKey + '\');" data-toggle="tooltip" title="Delete product"> <i class="glyphicon glyphicon-trash"></i></button></td>';
                    itemHtml += '<td>' + row.product_name + '<div class="view-giftmeta" style="word-wrap: break-word;"> <b>To:</b> ' + _meta.wc_gc_giftcard_to_multiple + '<br><b>From:</b> ' + _meta.wc_gc_giftcard_from + '<br><b>Amount:</b> $' + giftcard_amount + '</div></td>';
                    itemHtml += '<td class="text-right">' + row.reg_price.toFixed(2) + '</td><td><input min="1" autocomplete="off" disabled class="form-control number rowCalulate" type="number" id="txt_ItemQty_' + PKey + '" value="' + row.quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
                }
                else {
                    itemHtml += '<td class="text-center item-action"><button class="btn menu-icon-gr p-0 text-red btnDeleteItem billinfo" tabitem_itemid="' + PKey + '" onclick="removeItemsInTable(\'' + PKey + '\');" data-toggle="tooltip" title="Delete product"> <i class="glyphicon glyphicon-trash"></i></button></td>';
                    itemHtml += '<td>' + row.product_name + '<div class="view-addmeta" style="word-wrap: break-word;">';
                    $.each(_meta, function (name, value) { itemHtml += '<b>' + name.replace('_system_', '') + '</b> : ' + value + '<br>'; });
                    itemHtml += '</div></td>';                    
                    itemHtml += '<td class="text-left">' + row.product_sku + '</td>';
                    //itemHtml += '<td class="text-right">' + row.reg_price.toFixed(2) + '</td><td><input min="1" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_ItemQty_' + PKey + '" value="' + row.quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
                    itemHtml += '<td class="text-right product-price" data-price="' + row.sale_price + '">' + row.sale_price + '</td>';

                    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemqty_' + row.product_id + '" value="' + row.quantity + '" name="txt_itemqty" placeholder="Qty."></td>';
                    

                }
                itemHtml += '<td style="display:none" class="text-right parent-id" data-parentid="' + row.post_parent + '" data-productid="' + row.product_id + '"></td>';

                //itemHtml += '<td class="TotalAmount text-right" data-regprice="' + row.reg_price + '"data-salerate="' + row.sale_price + '" data-discount="' + row.discount.toFixed(2) + '" data-amount="' + row.total + '" data-taxamount="' + row.tax_amount + '" data-shippingamt="' + row.shipping_amount + '">' + row.total.toFixed(2) + '</td>';
                //itemHtml += '<td class="text-right RowDiscount" data-disctype="' + row.discount_type + '" data-couponamt="0">' + row.discount.toFixed(2) + '</td>';
                //itemHtml += '<td class="text-right linetotal">' + (row.total - row.discount).toFixed(2) + '</td>';
                itemHtml += '<td class="text-right row-total" data-total="' + row.price.toFixed(2) + '">' + formatCurrency(row.price) + '</td>';

                /*        itemHtml += '<td class="text-right RowTax">' + row.tax_amount.toFixed(4) + '</td>';*/
                itemHtml += '</tr>';
                zQty = zQty + (parseFloat(row.quantity) || 0.00);
                zGAmt = zGAmt + (parseFloat(row.price) || 0.00);
               
                
            }
            else if (row.product_type == 'coupon') {
                let cou_amt = parseFloat(row.discount) || 0.00;
                //console.log(cou_amt);
                let coupon_list = auto_coupon.filter(element => element.post_title == row.product_name);
                for (var j = 0; j < coupon_list.length; j++) {
                    couponHtml += '<li id="li_' + coupon_list[j].post_title.toString().toLowerCase().replaceAll(' ', '_') + '" class="' + (coupon_list[j].discount_type == 'fixed_cart' ? 'cart' : 'items') + '" data-coupon= "' + coupon_list[j].post_title.toString().toLowerCase() + '" data-couponamt= "' + coupon_list[j].coupon_amount + '" data-disctype= "' + coupon_list[j].discount_type + '" data-rqprdids= "' + coupon_list[j].product_ids + '" data-excludeids= "' + coupon_list[j].exclude_product_ids + '" data-type= "' + coupon_list[j].type + '" data-orderitemid="' + orderitemid + '">';
                    couponHtml += '<a href="javascript:void(0);">';
                    couponHtml += '<i class="fa fa-gift"></i>';
                    couponHtml += '<span>' + coupon_list[j].title + '</span>';
                    couponHtml += '<div class="pull-right">';

                    if (coupon_list[j].type == 'add_coupon') {
                        couponHtml += '$<span id="cou_discamt">' + cou_amt.toFixed(2) + '</span>';
                        couponHtml += '<button type="button" class="btn btn-box-tool pull-right billinfo" onclick="deleteAllCoupons(\'' + coupon_list[j].post_title.toString().toLowerCase() + '\');" data-toggle="tooltip" title="Delete coupon"> <i class="fa fa-times"></i>';
                        couponHtml += '</button>';
                    }
                    else {
                        couponHtml += '$<span id="cou_discamt" style ="margin-right: 20px;">' + cou_amt.toFixed(2) + '</span>';
                    }
                    couponHtml += '</div>';
                    couponHtml += '</a>';
                    couponHtml += '</li>';

                    zTDiscount = zTDiscount + cou_amt;
                    
                }
                if (coupon_list.length == 0) {
                    let cpn_info = JSON.parse(row.meta_data);
                    let cpn_name = row.product_name;
                    couponHtml += '<li id="li_' + row.product_name.toString().toLowerCase().replaceAll(' ', '_') + '" class="' + (cpn_info.discount_type == 'fixed_cart' ? 'cart' : 'items') + '" data-coupon= "' + row.product_name + '" data-couponamt= "' + (cpn_info.coupon_amount != '' && cpn_info.coupon_amount != undefined ? cpn_info.coupon_amount : cou_amt) + '" data-disctype= "' + (cpn_info.discount_type != '' && cpn_info.discount_type != undefined ? cpn_info.discount_type : '') + '" data-rqprdids="' + (cpn_info.product_ids != '' && cpn_info.product_ids != undefined ? cpn_info.product_ids : '') + '" data-excludeids="' + (cpn_info.exclude_product_ids != '' && cpn_info.exclude_product_ids != undefined ? cpn_info.exclude_product_ids : '') + '" data-type= "add_coupon" data-orderitemid="' + orderitemid + '">';
                    couponHtml += '<a href="javascript:void(0);">';
                    couponHtml += '<i class="fa fa-gift"></i><span>' + cpn_name.toString().toLowerCase() + '</span>';
                    couponHtml += '<div class="pull-right">$<span id="cou_discamt">' + cou_amt.toFixed(2) + '</span><button type="button" class="btn btn-box-tool pull-right billinfo" onclick="deleteAllCoupons(\'' + row.product_name.toString().toLowerCase() + '\');" data-toggle="tooltip" title="Delete coupon"><i class="fa fa-times"></i></button></div>';
                    couponHtml += '</a>';
                    couponHtml += '</li>';
                    zTDiscount = zTDiscount + cou_amt;
                }
              
            }
            else if (row.product_type == 'fee' && row.product_name == 'State Recycling Fee') {
                recyclingfeeHtml += '<tr id="trfeeid_' + orderitemid + '" data-orderitemid="' + orderitemid + '" data-pname="' + row.product_name + '">';
                recyclingfeeHtml += '<td class="text-center item-action"><i class="fa fa-plus-circle"></i></td>';
                recyclingfeeHtml += '<td>' + row.product_name + '</td><td></td><td></td><td></td><td></td><td class="TotalAmount text-right">' + row.total.toFixed(2) + '</td><td></td>';
                recyclingfeeHtml += '</tr>';
                zStateRecyclingAmt = zStateRecyclingAmt + (parseFloat(row.total) || 0.00);
                $("#stateRecyclingFeeTotal").data("orderitemid", orderitemid);
            }
            else if (row.product_type == 'fee' && row.product_name != 'State Recycling Fee') {
                let startingNumber = (row.product_name.match(/^-?\d+\.\d+|^-?\d+\b|^\d+(?=\w)/g) || []);
                let feetype = row.product_name.match(/%/g) != null ? '%' : '';
                let sd = feetype == '%' ? (parseFloat(startingNumber) || 0.00) : parseFloat(row.total);
                feeHtml += '<tr id="trfeeid_' + orderitemid + '" data-orderitemid="' + orderitemid + '" data-pname="' + row.product_name + '" data-feeamt="' + sd + '" data-feetype="' + feetype + '"> ';
                feeHtml += '<td class="text-center item-action"><button class="btn menu-icon-gr p-0 text-success  billinfo" onclick="AddFeeModal(' + orderitemid + ',\'' + orderitemid + '\',\'' + row.product_name + '\');" data-toggle="tooltip" title="Edit fee"> <i class="glyphicon glyphicon-edit"></i></button>';
                feeHtml += '<button class="btn menu-icon-gr p-0 text-red billinfo" onclick="RemoveFee(\'' + orderitemid + '\');" data-toggle="tooltip" title="Delete fee"> <i class="glyphicon glyphicon-trash"></i></button></td>';
                feeHtml += '<td>' + row.product_name + '</td><td></td><td></td><td></td><td></td><td class="TotalAmount text-right">' + row.total.toFixed(2) + '</td><td></td>';
                feeHtml += '</tr>';
                zFeeAmt = zFeeAmt + (parseFloat(row.total) || 0.00);
            }
            else if (row.product_type == 'shipping') {
                shippingHtml += '<tr id="tritemId_' + orderitemid + '" data-orderitemid="' + orderitemid + '" data-pname="' + row.product_name + '">';
                shippingHtml += '<td class="text-center item-action"><i class="fa fa-shipping-fast"></i></td>';
                shippingHtml += '<td>Shipping</td><td></td><td></td><td></td><td></td><td class="TotalAmount text-right">' + row.total.toFixed(2) + '</td><td></td>';
                shippingHtml += '</tr>';
                zShippingAmt = zShippingAmt + (parseFloat(row.total) || 0.00);
                $("#shippingTotal").data("orderitemid", orderitemid);
            }
            else if (row.product_type == 'gift_card') {
                _meta = JSON.parse(row.meta_data);
                giftcardHtml += '<li id="li_' + row.product_name.toString().toLowerCase().replaceAll(' ', '_') + '" data-pn="' + row.product_name.toString() + '" data-id="' + (_meta != null ? parseInt(_meta.giftcard_id) : '0') + '" data-orderitemid="' + orderitemid + '" data-amount="' + row.total.toFixed(2) + '">';
                giftcardHtml += '<a href="javascript:void(0);">';
                giftcardHtml += '<i class="glyphicon glyphicon-gift"></i><span>' + row.product_name + '</span>';
                giftcardHtml += '<div class="pull-right">$<span id="gift_amt">' + row.total.toFixed(2) + '</span><button type="button" class="btn btn-box-tool pull-right billinfo" onclick="deleteAllGiftCard(\'' + row.product_name.toString().toLowerCase() + '\');" data-toggle="tooltip" title="Delete gift card"><i class="fa fa-times"></i></button></div>';
                giftcardHtml += '</a>';
                giftcardHtml += '</li>';
                zGiftCardAmt = zGiftCardAmt + (parseFloat(row.total) || 0.00);
            }
            else if (row.product_type == 'refund') {
                refundHtml += '<tr id="tritemId_' + orderitemid + '" data-orderitemid="' + orderitemid + '" data-pname="' + row.product_name + '">';
                //refundHtml += '<td class="text-center item-action"><button class="btn menu-icon-gr text-red btnDeleteItem billinfo" tabitem_itemid="' + orderitemid + '" onclick="removeItemsInTable(\'' + orderitemid + '\');"> <i class="glyphicon glyphicon-trash"></i></button></td>';
                refundHtml += '<td></td>';
                refundHtml += '<td colspan="2">' + row.product_name.split(/,[ ]{0,}/).join('</br>') + '</td><td></td><td></td><td class="TotalAmount text-right">' + row.total.toFixed(2) + '</td><td></td>';
                refundHtml += '</tr>';
                zRefundAmt = zRefundAmt + (parseFloat(row.total) || 0.00);
                console.log(refundHtml);
            }
            else if (row.product_type == 'tax') {
                 //$("#salesTaxTotal").data("orderitemid", orderitemid);
                _tax.push({ order_item_id: row.order_item_id, name: row.product_name, label: row.meta_data, rate: row.tax_amount, amount: row.total });
                //$("#salesTaxTotal").text(row.total);
                zTotalTax =   (parseFloat(row.total) || 0.00);
            }
            else if (row.product_name == "gift_card") { zGiftCardRefundAmt += row.total; }
        });
        //console.log(zQty, zTDiscount, zShippingAmt, zTotalTax, zStateRecyclingAmt, zFeeAmt, zGiftCardAmt, zGiftCardRefundAmt);
        $('#line_items').append(itemHtml); $('#order_state_recycling_fee_line_items').append(recyclingfeeHtml); $('#order_fee_line_items').append(feeHtml); $('#order_shipping_line_items').append(shippingHtml); $('#billGiftCard').append(giftcardHtml); $('#order_refunds').append(refundHtml);
        $('.refund-action').append('<button type="button" id="btnAddFee" class="btn btn-danger billinfo" data-toggle="tooltip" title="Add Other Fee">Fees</button> ');
        $('#billCoupon').append(couponHtml);
        //$('#divtotal').show();
        //Calculate Final
        //FinalTotalControl(_tax);
        $("#totalQty").text(zQty.toFixed(0)); $("#totalQty").data('qty', zQty.toFixed(0));
        $("#SubTotal").text(zGAmt.toFixed(2));
        $("#discountTotal").text(zTDiscount.toFixed(2));
        $("#shippingTotal").text(zShippingAmt.toFixed(2));
       $("#salesTaxTotal").text(zTotalTax.toFixed(2));
        $("#stateRecyclingFeeTotal").text(zStateRecyclingAmt.toFixed(2));
        $("#feeTotal").text(zFeeAmt.toFixed(2)); $("#giftCardTotal").text(zGiftCardAmt.toFixed(2));
        $("#orderTotal").html((zGAmt - zTDiscount + zShippingAmt + zTotalTax + zStateRecyclingAmt + zFeeAmt - zGiftCardAmt).toFixed(2)); $("#orderTotal").data('tax', zTotalTax.toFixed(2))
        $("#refundedTotal").text(zRefundAmt.toFixed(2)); $("#refundedByGiftCard").text(zGiftCardRefundAmt.toFixed(2));
        $("#netPaymentTotal").text(((zGAmt - zTDiscount + zShippingAmt + zTotalTax + zStateRecyclingAmt + zFeeAmt - zGiftCardAmt) + zRefundAmt).toFixed(2));
        if (zRefundAmt != 0 || zGiftCardRefundAmt != 0) $(".refund-total").removeClass('hidden'); else $(".refund-total").addClass('hidden');
        $("#divAddItemFinal").find(".rowCalulate").change(function () {
            //calculateDiscountAcount();calculateFinal

        });
        //calculateFinal();
    }, completeFun, errorFun, false);
}
function getOrderNotesList(oid) {
    var option = { strValue1: oid };
    ajaxFunction('/Orders/GetOrderNotesList', option, beforeSendFun, function (result) {
        let data = JSON.parse(result);
        let noteHtml = '';
        for (var i = 0; i < data.length; i++) {
            let is_customer_note = parseInt(data[i].is_customer_note) || 0;
            noteHtml += '<li id="linoteid_' + data[i].comment_ID + '" class="note system-note ' + (is_customer_note == 0 ? '' : 'customer-note') + '">';
            noteHtml += '<div class="note_content"><p>' + data[i].comment_content + '</p></div>';
            noteHtml += '<p class="meta"><abbr class="exact-date" title="' + data[i].comment_date + '">' + data[i].comment_date + '</abbr> ';
            noteHtml += '<a href="javascript:void(0)" onclick="DeleteNotes(' + data[i].comment_ID + ');" class="delete_note billinfo" role="button" data-placement="right" data-toggle="tooltip" data-original-title="Delete note">Delete note</a>';
            noteHtml += '</p>';
            noteHtml += '</li>';
        }
        $(".order_notes").empty().html(noteHtml);
    }, completeFun, errorFun, false);
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Add/Edit Order Item Tab Section ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//function getItemList(pid, vid, Qty) {
//    if ($('#tritemId_' + pid + '_' + vid).length > 0) { swal('Alert!', 'Product already added to list.', "error"); return false; }
//    $("#loader").show();
//    let option = { strValue1: pid, strValue2: vid, strValue3: $('#ddlshipcountry').val(), strValue4: $('#ddlshipstate').val() };
//    let tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00;
//    let monthlySaleCoupon = ["sales20off"];
//    ajaxFunction('/Orders/GetProductInfo', option, beforeSendFun, function (result) {
//        let itemsDetailsxml = [], auto_code = [];
//        $.each(result, function (key, pr) {
//            pr.quantity = pr.quantity * Qty;
//            let coupon_amt = 0.00, coupon_type = 'fixed_product', row_key = pr.product_id + '_' + pr.variation_id;
//            if (!pr.is_free) {
//                if (pr.reg_price > pr.sale_price) {
//                    coupon_amt = (pr.reg_price - pr.sale_price) * pr.quantity;
//                    //let pro_ids = [pr.variation_id, -1];
//                    let coupon_list = auto_coupon.filter(element => element.post_title_id == pr.product_id);
//                    if (coupon_list.length > 0) {
//                        coupon_list[0].coupon_amount = coupon_amt; //coupon_list[0].product_ids = pro_ids;
//                        if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
//                    }
//                }
//            }
//            itemsDetailsxml.push({
//                PKey: row_key, product_id: pr.product_id, variation_id: pr.variation_id, product_name: pr.product_name, product_img: '', quantity: pr.quantity, reg_price: pr.reg_price, sale_rate: pr.sale_price, total: (pr.reg_price * pr.quantity), discount_type: coupon_type, discount: coupon_amt, tax_amount: ((pr.reg_price * pr.quantity) * tax_rate).toFixed(2),
//                shipping_amount: pr.shipping_amount, is_free: pr.is_free, free_itmes: pr.free_itmes, order_item_id: 0, sr_fee: pr.staterecycle_fee, sr_fee_istaxable: pr.staterecycle_istaxable, order_id: parseInt($('#hfOrderNo').val()) || 0, meta_data: pr.meta_data
//            });
//        });
//        //console.log(auto_code,itemsDetailsxml);
//        //Bind diff Coupon
//        if (auto_code.length > 0) bindCouponList(auto_code);
//        if (itemsDetailsxml.length > 0) bindItemListDataTable(itemsDetailsxml);
//    }, function () { $("#loader").hide(); }, function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); }, true);
//}
// address_1,city,state,postcode,country,amount
function getItemList(product_id, vender_id) {
    //let option = { strValue1: product_id, strValue2: 24 };

    //let cartItems = [
    //    {
    //        name: "Item 1",
    //        price: 10.99,
    //        quantity: 2
    //    },
    //    {
    //        name: "Item 2",
    //        price: 5.99,
    //        quantity: 3
    //    }
    //];
    let cartResponse = {};
    //let cartResponse = {
    //    message: "Your message",
    //    status: 200, // Example status code
    //    code: "ABC123",
    //    data: {
    //        // Fill in the properties of the CartDataResponse object here
    //        // Example: shipping_address 
    //        shipping_address: {
    //            address_1: $("#txtshipaddress1").val(),
    //            city: $("#txtshipcity").val(),
    //            state: $("#ddlshipstate").val(),
    //            postcode: $("#txtshipzipcode").val(),
    //            country: $("#ddlshipcountry").val()
    //        },
    //        shipping_rate: {
    //            amount: "0"                 
    //        },
    //        cart_totals: {
    //            subtotal: "",
    //            subtotal_tax: "",
    //            discount_total: "",
    //            discount_tax: "",
    //            cart_contents_total: "",
    //            cart_contents_tax: "",
    //            fee_total: "",
    //            fee_tax: "",
    //            shipping_total: "",
    //            shipping_tax: "",
    //            total: "",
    //            total_tax: ""                 
    //        },
    //        items: cartItems // Add the array of items to the data object
    //    }
    //};
    //console.log(cartResponse);
    let option = {
        objs: cartResponse,
        product_id: product_id,
        vendor_id: 24
    };
    $.ajax({
        type: "Post", url: '/Quickorder/ProductDetails', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option),
        beforeSend: function () { $("#loader").show(); },
        success: function (data) { bindItems(data, vender_id); },
        complete: function () {
            //$("#loader").hide();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
        async: true
    });
}
function bindItems(data, vender_id) {
    let itemHtml = '';
    if (data.length > 0) {
        $.each(data, function (key, row) {
            if (row.fk_product > 0) {
                if ($('#tritemid_' + row.fk_product).length <= 0) {
                    itemHtml += '<tr id="tritemid_' + row.fk_product + '" class="' + (row.is_free ? 'free_item' : 'paid_item') + '" data-pid="' + row.fk_product + '" data-pname="' + row.description + '" data-psku="' + row.product_sku + '" data-rowid="' + row.rowid + '" data-freeitems=\'' + row.free_itmes + '\'>';
                    if (row.is_free) itemHtml += '<td class="text-center"></td>';
                    else itemHtml += '<td class="text-center"><button class="btn p-0 text-red btnDeleteItem billinfo" onclick="removeItems(\'' + row.fk_product + '\', \'' + vender_id + '\', \'' + row.qty + '\');" data-toggle="tooltip" title="Delete product"> <i class="glyphicon glyphicon-trash"></i> </button></td>';
                    itemHtml += '<td class="product-name" data-name="' + row.description + '">' + row.description + '</td><td>' + row.product_sku + '</td>';
                    itemHtml += '<td class="text-right product-price" data-price="' + row.subprice + '">' + row.subprice + '</td>';
                    //itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + row.fk_product + '" value="' + row.subprice.toFixed(2) + '" name="txt_itemprice" placeholder="Price"></td>';
                    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemqty_' + row.fk_product + '" value="' + row.qty + '" name="txt_itemqty" placeholder="Qty."></td>';
                    //itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemdisc_' + row.fk_product + '" value="' + row.discount_percent.toFixed(2) + '" name="txt_itemdisc" placeholder="Discount"></td>';
                    //itemHtml += '<td class="text-right product-desc">' + row.discount_percent.toFixed(2) + '</td>';
                    //itemHtml += '<td class="text-right tax-amount" data-tax1="' + row.localtax1_tx + '" data-tax2="' + row.localtax2_tx + '">' + row.total_localtax1 + '</td>';
                    itemHtml += '<td style="display:none" class="text-right parent-id" data-parentid="' + vender_id + '" data-productid="' + row.fk_product + '"></td>';
                    itemHtml += '<td class="text-right row-total" data-total="' + row.total_ttc.toFixed(2) + '">' + formatCurrency(row.total_ttc) + '</td>';
                    itemHtml += '</tr>';
                }
                else { $('#txt_itemqty_' + row.rowid).val((parseFloat($('#txt_itemqty_' + row.rowid).val()) + row.qty).toFixed(2)); }
            }
        });

        $('#line_items').append(itemHtml); $("#divAddItemFinal").find(".rowCalulate").change(function (e) {
            //let _freeitems = $(this).closest('tr').data('freeitems'), _qty = parseInt($(this).closest('tr').find("[name=txt_itemqty]").val()) || 0;
            //$.each(_freeitems, function (key, value) { $('#tritemid_' + key).find("[name=txt_itemqty]").val((parseInt(value) || 0) * _qty); });



            //calculateFinal();
        });
    }
    calculateFinal();
}

var lastItemQtyValues = {};
$("#line_items").on("change", ".rowCalulate[name='txt_itemqty']", function (e) {
    var $input = $(this);
    var rowId = $input.attr("id").replace("txt_itemqty_", "");
    //console.log(rowId);
    var $row = $input.closest("tr");
    // Get the last value
    //var lastValue = lastItemQtyValues[rowId] || 0;
    /*var lastValue = lastItemQtyValues[rowId] !== undefined ? lastItemQtyValues[rowId] : 1;*/

    // var lastValue = lastItemQtyValues[rowId] || 1;
    var lastValue = lastItemQtyValues[rowId] || 1; // Initialize to 0 if not found

    var parentId = $row.find('.parent-id').data('parentid');
    // Get the new value
    var newValue = parseFloat($input.val());
    lastItemQtyValues[rowId] = newValue;
    // Calculate the change in quantity
    var quantityChange = newValue - lastValue;

    //console.log(newValue, lastValue, quantityChange);

    gettotaldetailsfromif(rowId, parentId, quantityChange); //$("#divtotal").hide();

    //let cartItems = []; // Initialize an empty array to store cart items 
    //cartItems.push({
    //    id: rowId,
    //    quantity: quantityChange,
    //    variation_id: parentId
    //});
    //console.log(cartItems);
    //let cartResponse = {
    //    message: "Your message",
    //    status: 200, // Example status code
    //    code: "ABC123",
    //    data: {
    //        //// Fill in the properties of the CartDataResponse object here
    //        //// Example: shipping_address 
    //        shipping_address: {
    //            first_name: $("#txtshipfirstname").val(),
    //            last_name: $("#txtshiplastname").val(),
    //            email: $("#txtbillemail").val(),
    //            company: $("#txtshipcompany").val(),
    //            phone: $("#txtbillphone").val(),
    //            address_1: $("#txtshipaddress1").val(),
    //            address_2: $("#txtshipaddress2").val(),
    //            city: $("#txtshipcity").val(),
    //            state: $("#ddlshipstate").val(),
    //            postcode: $("#txtshipzipcode").val(),
    //            country: $("#ddlshipcountry").val()
    //        },

    //        items: cartItems
    //    }
    //};

    //let option = {
    //    objs: cartResponse,
    //    product_id: 0,
    //    vendor_id: 24,
    //    session_id: $("#hfsession_id").val()
    //};
    //$.ajax({
    //    type: "Post", url: '/Quickorder/addproduct', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option),
    //    beforeSend: function () { $("#loader").show(); },
    //    success: function (data) {
    //        console.log(data);
    //        var row = data[0];
    //        // $("#hfsession_id").val('0');
    //        if (Array.isArray(data) && data.length === 1) {
    //            const item = data[0];
    //            $("#hfsession_id").val(item.product_sku);
    //            $("#divtotal").hide();
    //        }
    //    },
    //    complete: function () { $("#loader").hide(); $("#divtotal").hide(); },
    //    error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
    //    async: true
    //});
    //console.log(rowId, lastValue, newValue, quantityChange);
    //// Calculate the final total
    //calculateFinal();
});


function removeItems(id, parentid, qty) {

    var initialQty = document.getElementById('txt_itemqty_' + id + '').value;
    console.log(id, initialQty, qty);
    //------------- Remove data in Temp AddItemList-----
    swal({ title: "Are you sure?", text: 'Would you like to Remove this Item?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) {

                gettotaldetailsfromif(id, parentid, -initialQty); //$("#divtotal").hide();

              //  $('#tritemid_' + id).remove(); calculateFinal();
                //ActivityLog('delete other product id (' + id + ') in new purchase order', '/PurchaseOrder/NewPurchaseOrder');
                ////gettotaldetails();
                //let cartItems = []; // Initialize an empty array to store cart items 
                //cartItems.push({
                //    id: id,
                //    quantity: -initialQty,
                //    variation_id: parentid
                //});
                //console.log(cartItems);
                //let cartResponse = {
                //    message: "Your message",
                //    status: 200, // Example status code
                //    code: "ABC123",
                //    data: {
                //        //// Fill in the properties of the CartDataResponse object here
                //        //// Example: shipping_address 
                //        shipping_address: {
                //            first_name: $("#txtshipfirstname").val(),
                //            last_name: $("#txtshiplastname").val(),
                //            email: $("#txtbillemail").val(),
                //            company: $("#txtshipcompany").val(),
                //            phone: $("#txtbillphone").val(),
                //            address_1: $("#txtshipaddress1").val(),
                //            address_2: $("#txtshipaddress2").val(),
                //            city: $("#txtshipcity").val(),
                //            state: $("#ddlshipstate").val(),
                //            postcode: $("#txtshipzipcode").val(),
                //            country: $("#ddlshipcountry").val()
                //        },

                //        items: cartItems
                //    }
                //};

                //let option = {
                //    objs: cartResponse,
                //    product_id: 0,
                //    vendor_id: 24,
                //    session_id: $("#hfsession_id").val()
                //};
                //$.ajax({
                //    type: "Post", url: '/Quickorder/addproduct', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option),
                //    beforeSend: function () { $("#loader").show(); },
                //    success: function (data) {
                //        console.log(data);
                //        var row = data[0];
                //        // $("#hfsession_id").val('0');
                //        if (Array.isArray(data) && data.length === 1) {
                //            const item = data[0];
                //            $("#hfsession_id").val(item.product_sku);
                //            $("#divtotal").hide();
                //        }
                //    },
                //    complete: function () { $("#loader").hide(); },
                //    error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
                //    async: true
                //});
                ////console.log(rowId, lastValue, newValue, quantityChange);
                //// Calculate the final total
                //calculateFinal();
                //$("#divtotal").hide();
            }
        });
}

function calculateFinal() {
    freeQtyUpdate();
    let tGrossAmt = 0.00, tQty = 0.00, tDisAmt = 0.00, tTax_Amt1 = 0.00, tTax_Amt2 = 0.00, tOther_Amt = 0.00, tNetAmt = 0.00;
    //main item
    $("#line_items > tr").each(function (index, row) {
        let rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rGrossAmt = 0.00, rDisAmt = 0.00, rTax1 = 0.00, rTax_Amt1 = 0.00, rTax2 = 0.00, rTax_Amt2 = 0.00, rNetAmt = 0.00;
        //rPrice = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        rPrice = parseFloat($(row).find(".product-price").data('price')) || 0.00;
        console.log(rPrice);
        rQty = parseFloat($(row).find("[name=txt_itemqty]").val()) || 0.00;
        rDisPer = parseFloat($(row).find("[name=txt_itemdisc]").val()) || 0.00;
        rTax1 = parseFloat($(row).find(".tax-amount").data('tax1')) || 0.00; rTax2 = parseFloat($(row).find(".tax-amount").data('tax2')) || 0.00;
        tQty += rQty; rGrossAmt = rPrice * rQty; rDisAmt = rGrossAmt * (rDisPer / 100);
        /*rTax_Amt1 = rTax1 * rQty;*/
        rTax_Amt1 = ((rGrossAmt - rDisAmt) * rTax1) / 100;
        rTax_Amt2 = rTax2 * rQty;
        //rNetAmt = (rGrossAmt - rDisAmt) + rTax_Amt1 + rTax_Amt2;
        rNetAmt = rGrossAmt + (((rGrossAmt - rDisAmt) * rTax1) / 100);
        //rNetAmt = parseFloat(rNetAmt.toFixed(2));
        rNetAmt = (Math.round(rNetAmt * 100 + 0.001) / 100).toFixed(2);
        console.log(rNetAmt);
        //rNetAmt = Math.floor(rNetAmt * 100) / 100;
        // parseFloat(rNetAmt.toFixed(2));
        //$(row).find(".tax-amount").text(rTax_Amt1.toFixed(2)); $(row).find(".ship-amount").text(rTax_Amt2.toFixed(2));
        tGrossAmt += rGrossAmt, tDisAmt += rDisAmt, tTax_Amt1 += rTax_Amt1, tTax_Amt2 += rTax_Amt2, tNetAmt += parseFloat(rNetAmt);
        $(row).find(".row-total").text(formatCurrency(rNetAmt));
    });
    //other item
    $("#product_line_items > tr.other_item").each(function (index, row) {
        let proc_type = 0, rPrice = 0.00, rQty = 0.00, rDisPer = 0.00, rDisAmt = 0.00, rTax_Amt1 = 0.00, rGrossAmt = 0.00, rNetAmt = 0.00;
        proc_type = parseInt($(row).data("proc_type")) || 0;
        rPrice = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        rQty = parseFloat($(row).find("[name=txt_itemqty]").val()) || 0.00;
        rDisPer = parseFloat($(row).find("[name=txt_itemdisc]").val()) || 0.00;
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

    $(".thQuantity").text(tQty.toFixed(0));
    $("#SubTotal").text(formatCurrency(tGrossAmt)); $("#SubTotal").data('total', tGrossAmt.toFixed(2));
    //$("#totalQty").text(formatCurrency(tGrossAmt));
    //$("#discountTotal").text(formatCurrency(tDisAmt)); $("#discountTotal").data('total', tDisAmt.toFixed(2));
    $("#salesTaxTotal").text(formatCurrency(tTax_Amt1)); $("#salesTaxTotal").data('total', tTax_Amt1.toFixed(2));
    //$("#shippingTotal").text(formatCurrency(tTax_Amt2)); $("#shippingTotal").data('total', tTax_Amt2.toFixed(2));
    //$("#otherTotal").text(formatCurrency(tOther_Amt)); $("#otherTotal").data('total', tOther_Amt.toFixed(2));
    $("#orderTotal").html(formatCurrency(tNetAmt)); $("#orderTotal").data('total', tNetAmt);
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
function bindItemListDataTable(data) {
    var layoutHtml = '';
    if (data.length > 0) {
        $.each(data, function (i, pr) {
            if (pr.product_id > 0) {
                if ($('#tritemId_' + pr.PKey).length <= 0) {
                    layoutHtml += '<tr id="tritemId_' + pr.PKey + '" data-id="' + pr.PKey + '" class="' + (pr.is_free ? 'free_item' : 'paid_item') + '" data-pid="' + pr.product_id + '" data-vid="' + pr.variation_id + '" data-pname="' + pr.product_name + '" data-freeitem="' + pr.is_free + '" data-freeitems=\'' + pr.free_itmes + '\' data-orderitemid="' + pr.order_item_id + '" data-img="' + pr.product_img + '" data-srfee="' + pr.sr_fee + '" data-sristaxable="' + pr.sr_fee_istaxable + '" data-meta_data=\'' + pr.meta_data + '\'>';
                    if (pr.is_free) layoutHtml += '<td class="text-center"></td>';
                    else layoutHtml += '<td class="text-center"><button class="btn menu-icon-gr p-0 text-red btnDeleteItem billinfo" tabitem_itemid="' + pr.PKey + '" onclick="removeItemsInTable(\'' + pr.PKey + '\');" data-toggle="tooltip" data-original-title="Delete product"> <i class="glyphicon glyphicon-trash" data-toggle="tooltip" title="Delete product"></i> </button></td>';
                    layoutHtml += '<td>' + pr.product_name + '</td>';
                    layoutHtml += '<td class="text-right">' + pr.reg_price.toFixed(2) + '</td>';
                    if (pr.is_free) layoutHtml += '<td><input min="1" autocomplete="off" disabled class="form-control billinfo number rowCalulate" type="number" id="txt_ItemQty_' + pr.PKey + '" value="' + pr.quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
                    else layoutHtml += '<td><input min="1" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_ItemQty_' + pr.PKey + '" value="' + pr.quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
                    layoutHtml += '<td class="TotalAmount text-right" data-regprice="' + pr.reg_price + '"data-salerate="' + pr.sale_rate + '" data-discount="' + pr.discount + '" data-amount="' + pr.total + '" data-taxamount="' + pr.tax_amount + '" data-shippingamt="' + pr.shipping_amount + '">' + pr.total.toFixed(2) + '</td>';
                    layoutHtml += '<td class="text-right RowDiscount" data-disctype="' + pr.discount_type + '" data-couponamt="0">' + pr.discount.toFixed(2) + '</td>';
                    layoutHtml += '<td class="text-right linetotal">' + (pr.total - pr.discount).toFixed(2) + '</td>';
                    layoutHtml += '<td class="text-right RowTax">' + pr.tax_amount + '</td>';
                    layoutHtml += '</tr>';
                }
                else {
                    var zQty = parseFloat($('#txt_ItemQty_' + pr.rd_id).val()) || 0.00;
                    $('#txt_ItemQty_' + pr.rd_id).val((parseFloat($('#txt_ItemQty_' + pr.PKey).val()) + pr.quantity).toFixed(2));
                }
            }
        });
        $('#order_line_items').append(layoutHtml);
        $("#divAddItemFinal").find(".rowCalulate").change(function () { calculateDiscountAcount(); });
    }
    else {
        layoutHtml += '<table id="tblAddItemFinal" class="table-blue table table-bordered table-striped dataTable">';
        layoutHtml += '<thead>';
        layoutHtml += '<tr>';
        layoutHtml += '<th class="text-center" style="width: 8%">Actions</th>';
        layoutHtml += '<th style="width: 32%">Item</th>';
        layoutHtml += '<th class="text-right" style="width: 10%">Sale Price</th>';
        layoutHtml += '<th class="text-right" style="width: 10%">Quantity</th>';
        layoutHtml += '<th class="text-right" style="width: 10%">Sub-Total</th>';
        layoutHtml += '<th class="text-right" style="width: 10%">Discount</th>';
        layoutHtml += '<th class="text-right" style="width: 10%">Total</th>';
        layoutHtml += '<th class="text-right" style="width: 10%">Tax</th>';
        layoutHtml += '</tr>';
        layoutHtml += '</thead>';
        layoutHtml += '<tbody id="order_line_items"></tbody><tbody id="order_state_recycling_fee_line_items"></tbody><tbody id="order_fee_line_items"></tbody><tbody id="order_refunds"></tbody>';
        layoutHtml += '</table>';
        $('#divAddItemFinal').empty().html(layoutHtml);
    }
    calculateDiscountAcount();
    //auto Coupon add
    ApplyAutoCoupon();
    //calcFinalTotals();
}
function removeItemsInTable(id) {
    //------------- Remove data in Temp AddItemList-----
    swal({ text: 'Would you like to remove this item?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) {
                $('#tritemId_' + id).remove();
                // no cart item
                if ($("#order_line_items > tr.paid_item").length == 0) { $('#billCoupon,#billGiftCard').empty(); }
                else if ($("#order_line_items > tr.gift_item").length == 0) { $('#btnApplyCoupon,#btnApplyGiftCard').prop("disabled", false); }
                else {
                    //remove sales coupons
                    deleteSaleCoupon();
                    //auto Coupon add
                    ApplyAutoCoupon();
                }
                calculateDiscountAcount();
            }
        });
}
function calcFinalTotals() {
    //calculateStateRecyclingFee();
    FinalTotalControl([]);
    let tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00, is_freighttax = $('#hfFreighttaxable').val();
    let zQty = 0.00, zDiscQty = 0.00, zGAmt = 0.00, zGiftCardAmt = 0.00, zTDiscount = 0.00, zTotalTax = 0.00, zShippingAmt = 0.00, zStateRecyclingAmt = 0.00, zFeeAmt = 0.00, zGiftAmt = 0.00, zTotal = 0.00;
    $("#order_line_items > tr").each(function (index, tr) {
        let rQty = (parseFloat($(tr).find("[name=txt_ItemQty]").val()) || 0.00), rGAmt = (parseFloat($(tr).find(".TotalAmount").data("amount")) || 0.00), rTDiscount = (parseFloat($(tr).find(".RowDiscount").text()) || 0.00);
        zQty += rQty; zGAmt = zGAmt + rGAmt; zTDiscount = zTDiscount + rTDiscount;
        if ($(this).data('pid') != "888864") zTotalTax = zTotalTax + ((rGAmt - rTDiscount) * tax_rate);
        if (parseFloat($(tr).find(".TotalAmount").data("amount")) > 0) zDiscQty = zDiscQty + (parseFloat($(tr).find("[name=txt_ItemQty]").val()) || 0.00);
        zShippingAmt = zShippingAmt + (parseFloat($(tr).find(".TotalAmount").data("shippingamt")) * rQty);

        /// Calculate State Recycling Fee
        let sr_fee = parseFloat($(tr).data("srfee")) || 0.00, sristaxable = $(tr).data("sristaxable");
        if (sristaxable) zStateRecyclingAmt += (rQty * sr_fee) + (rQty * sr_fee * tax_sr_rate)
        else zStateRecyclingAmt += (rQty * sr_fee);
    });
    if (is_freighttax) zTotalTax = zTotalTax + (zShippingAmt * tax_rate);
    //zStateRecyclingAmt = parseFloat($("#stateRecyclingFeeTotal").text()) || 0.00;
    $("#stateRecyclingFeeTotal").text(zStateRecyclingAmt.toFixed(2));
    $("#totalQty").text(zQty.toFixed(0)); $("#totalQty").data('qty', zDiscQty.toFixed(0));
    $("#SubTotal").text(zGAmt.toFixed(2)); $("#discountTotal").text(zTDiscount.toFixed(2));
    //$("#salesTaxTotal").text(zTotalTax.toFixed(2));
    //Tax Calculate
    $('#order_final_total .tax-total').each(function (index, li) {
        let _taxpercent = parseFloat($(li).data('percent')) || 0;
        let _Tax = ((zGAmt - zTDiscount) * _taxpercent);
        if (is_freighttax) _Tax = _Tax + (zShippingAmt * _taxpercent);
        $(li).text(_Tax.toFixed(4)); $(li).data('amount', _Tax.toFixed(4));
    });
    $("#shippingTotal").text(zShippingAmt.toFixed(2)); $('#order_shipping_line_items').find(".TotalAmount").text(zShippingAmt.toFixed(2));
    CalculateFee();
    zFeeAmt = parseFloat($("#feeTotal").text()) || 0.00; zTotal = (zGAmt - zTDiscount + zShippingAmt + zTotalTax + zStateRecyclingAmt + zFeeAmt);
    //$("#billGiftCard > li").each(function (_i, _li) { zGiftAmt += (parseFloat($(_li).find("[id=gift_amt]").text()) || 0.00); });
    let _orderTotal = zTotal;
    //Calculate gift card discount
    $('#billGiftCard li').each(function (index, li) {
        let gc_amt = parseFloat($(li).data('amount')) || 0.00;
        if (_orderTotal >= gc_amt) { $(li).find('#gift_amt').text(gc_amt.toFixed(2)); zGiftAmt += gc_amt; _orderTotal = _orderTotal - gc_amt; }
        else if (gc_amt >= _orderTotal) { $(li).find('#gift_amt').text(_orderTotal.toFixed(2)); zGiftAmt += _orderTotal; _orderTotal = _orderTotal - _orderTotal; }
        else { $(li).find('#gift_amt').text(_orderTotal); zGiftAmt += 0; }
    });

    $("#giftCardTotal").html(zGiftAmt.toFixed(2)); $("#orderTotal").html((zTotal - zGiftAmt).toFixed(2)); $("#orderTotal").data('tax', zTotalTax.toFixed(2));
    let zRefundAmt = parseFloat($("#refundedTotal").text()) || 0.00; $("#netPaymentTotal").html((zTotal - zGiftAmt + zRefundAmt).toFixed(2));
    $('[data-toggle="tooltip"]').tooltip();
}
function FinalTotalControl(tax_list) {
    let _html = '<div class="form-group"><label class="col-sm-10 control-label">Sub-Total(<span id="totalQty">0</span>)</label><div class="col-sm-2 controls text-right">$<span id="SubTotal">0.00</span></div></div>';
    _html += '<div class="form-group"><label class="col-sm-10 control-label">Total Savings</label><div class="col-sm-2 controls text-right">$<span id="discountTotal">0.00</span></div></div>';
    _html += '<div class="form-group"><label class="col-sm-10 control-label">Fee</label><div class="col-sm-2 controls text-right">$<span id="feeTotal">0.00</span></div></div>';
    _html += '<div class="form-group"><label class="col-sm-10 control-label">State Recycling Fee</label><div class="col-sm-2 controls text-right">$<span id="stateRecyclingFeeTotal" data-orderitemid="0">0.00</span></div></div>';
    _html += '<div class="form-group"><label class="col-sm-10 control-label">Shipping</label><div class="col-sm-2 controls text-right">$<span id="shippingTotal" data-orderitemid="0">0.00</span></div></div>';
    //_html += '<div class="form-group"><label class="col-sm-10 control-label">Shipping Tax</label<div class="col-sm-2 controls text-right">$<span id="shippingTaxTotal">0.00</span></div></div>';
    // Add Tax
    if (tax_list.length > 0) {
        $.each(tax_list, function (index, value) {
            _html += '<div class="form-group"><label class="col-sm-10 control-label">' + value.label + ' - ' + (value.rate * 100).toFixed(4) + '%</label><div class="col-sm-2 controls text-right">$<span class="tax-total" data-order_item_id="' + value.order_item_id + '" data-name="' + value.name + '" data-label="' + value.label + '" data-percent="' + value.rate + '" data-amount="' + value.amount.toFixed(4) + '">' + value.amount.toFixed(4) + '</span></div></div>';
        });
    }
    else {
        $.each($('#hfTaxRate').data('meta_data'), function (name, value) {
            _html += '<div class="form-group"><label class="col-sm-10 control-label">' + value.type + ' - ' + (value.rate * 100).toFixed(4) + '%</label><div class="col-sm-2 controls text-right">$<span class="tax-total" data-order_item_id="' + value.order_item_id + '" data-name="' + value.name.replaceAll(' ', '-') + '-' + (value.rate * 100).toFixed(2) + '" data-label="' + value.type + '" data-percent="' + value.rate + '" data-amount="0">0.00</span></div></div>';
        });
    }
    _html += '<div class="form-group"><label class="col-sm-10 control-label">Gift Card</label><div class="col-sm-2 controls text-right">$<span id="giftCardTotal">0.00</span></div></div>';
    _html += '<div class="form-group"><label class="col-sm-10 control-label">Order Total</label><div class="col-sm-2 controls text-right"><strong>$<span id="orderTotal">0.00</span></strong></div></div>';
    // Refund 
    _html += '<div class="form-group refund-total hidden"><label class="col-sm-10 control-label">Refunded</label><div class="col-sm-2 controls text-right text-red text-weight-bold"><strong>$<span id="refundedTotal">0.00</span></strong></div></div>';
    // _html += '<div class="form-group refund-total hidden"><label class="col-sm-10 control-label">Refunded By Gift Card</label><div class="col-sm-2 controls text-right text-red text-weight-bold"><strong>$<span id="refundedByGiftCard" data-orderitemid="0">0.00</span></strong></div></div>';
    _html += '<div class="form-group refund-total hidden"><label class="col-sm-10 control-label">Net Payment</label><div class="col-sm-2 controls text-right text-weight-bold"><strong>$<span id="netPaymentTotal">0.00</span></strong></div></div>';
    $('#order_final_total').empty().append(_html);
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Add Item Meta ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function AddItemMetaModal(id, itemid, meta_list) {
    let metaHtml = '<div class="modal-dialog">';
    metaHtml += '<div class="modal-content">';
    metaHtml += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button><h4 class="modal-title">Add Meta</h4></div>';
    metaHtml += '<div class="modal-body p-0"><table class="table"><tbody id="order_items_meta">';
    $.each(meta_list, function (index, row) {
        metaHtml += '<tr data-id="' + row.id + '"><td style="width:45%"><input class="form-control" id="txt_key' + index + '" value="' + row.key.replace('_system_', '') + '" name="txt_key" placeholder="Name"></td>';
        metaHtml += '<td style = "width:45%"><input class="form-control" id="txt_value' + index + '" value="' + row.value + '" name="txt_value" placeholder="Value"></td>';
        metaHtml += '<td style="width:10%"><button class="btn menu-icon-gr text-red btnmeta_delete" data-placement="left" data-toggle="tooltip" data-original-title="Remove meta"> <i class="glyphicon glyphicon-trash"></i></button></td></tr > ';
    });
    metaHtml += '</tbody>';
    metaHtml += '<tbody><tr><td style="width:45%"></td><td style="width:45%"></td><td style="width:10%"><button class="btn menu-icon-gr text-red btnmeta_add" data-placement="left" data-toggle="tooltip" data-original-title="Add meta"> <i class="glyphicon glyphicon-plus"></i></button></td></tr></tbody>';
    metaHtml += '</table></div>';
    metaHtml += '<div class="modal-footer"><button type="button" class="btn btn-danger" id="btnmeta_ok" data-id="' + id + '" data-itemid="' + itemid + '" data-placement="right" data-toggle="tooltip" data-original-title="Add item meta">Add</button></div>';
    metaHtml += '</div>';
    metaHtml += '</div>';
    $("#billModal").empty().html(metaHtml); $('[data-toggle="tooltip"]').tooltip();
    $("#billModal").modal({ backdrop: 'static', keyboard: false });
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Add Gift Card Product ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function AddGiftCardProductModal(p_name, pid) {
    //ActivityLog('Edit fee (' + feevalue + ') in order id (' + $('#hfOrderNo').val() + ')', '/Product/AddNewProduct/');
    var feeHtml = '<div class="modal-dialog">';
    feeHtml += '<div class="modal-content">';
    feeHtml += '<div class="modal-header">';
    feeHtml += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    feeHtml += '<h4 class="modal-title" id="myModalLabel">Add Gift Card Product</h4>';
    feeHtml += '</div>';
    feeHtml += '<div class="modal-body">';

    feeHtml += '<div class="row">';
    feeHtml += '<div class="col-md-6">Amount<span class="text-red">*</span><input class="form-control" type="number" id="txtGiftAmt" placeholder="Amount" maxlength="15" autocomplete="true" value=""></div>';
    feeHtml += '<div class="col-md-6">Delivery Date<span class="text-red">*</span><input type="text" id="txtGiftDate" placeholder="Now" class="form-control" readonly=""></div>';
    feeHtml += '</div>';
    feeHtml += '<div class="row"><div class="col-md-12">To<span class="text-red">*</span><input type="text" id="txtGiftTo" class="form-control" placeholder="Enter an e-mail for each recipient, separating e-mails by comma (,)" value=""></div></div>';
    feeHtml += '<div class="row"><div class="col-md-12">From (Your Name)<span class="text-red">*</span><input class="form-control" type="input" id="txtGiftFrom" placeholder="Enter your name" maxlength="150" autocomplete="true" value=""></div></div>';
    feeHtml += '<div class="row"><div class="col-md-12">Message<textarea class="form-control" id="txtGiftMessage" rows="3" maxlength="500" placeholder="Add your message (optional)"></textarea></div></div>';

    feeHtml += '</div>';
    feeHtml += '<div class="modal-footer">';
    feeHtml += '<button type="button" class="btn btn-danger pull-right" id="btnAddGiftCardProduct" data-pid="' + pid + '" data-vid="0" data-name="' + p_name + '">Add</button>';
    feeHtml += '</div>';
    feeHtml += '</div>';
    feeHtml += '</div>';
    $("#billModal").empty().html(feeHtml); $("#billModal").modal({ backdrop: 'static', keyboard: false });
    $('#txtGiftDate').daterangepicker({ parentEl: "#billModal", minDate: moment(), singleDatePicker: true, autoUpdateInput: true, locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' } });
    $("#txtGiftAmt").focus();
}
function bindGiftCardProduct(p_name, pid, vid) {
    let _rate = parseFloat($('#txtGiftAmt').val()) || 0.00;
    let email = $('#txtGiftTo').val(); let emailsCollection = email.split(",");
    let _qty = emailsCollection.length;
    let _meta = { wc_gc_giftcard_amount: _rate, wc_gc_giftcard_from: $('#txtGiftFrom').val(), wc_gc_giftcard_message: $('#txtGiftMessage').val(), wc_gc_giftcard_to_multiple: email, wc_gc_giftcards: '' }
    let option = {
        PKey: pid + '_' + vid, product_id: pid, variation_id: vid, product_name: p_name, product_img: '', quantity: _qty, reg_price: _rate, sale_rate: _rate, total: _rate * _qty, discount_type: '', discount: 0, tax_amount: 0,
        shipping_amount: 0, is_free: false, free_itmes: '{}', order_item_id: 0, sr_fee: 0, sr_fee_istaxable: 0, order_id: parseInt($('#hfOrderNo').val()) || 0,
        meta_data: JSON.stringify(_meta)
    };
    let layoutHtml = '';
    if (option.product_id > 0) {
        if ($('#tritemId_' + option.PKey).length <= 0) {
            layoutHtml += '<tr id="tritemId_' + option.PKey + '" data-id="' + option.PKey + '" class="gift_item" data-pid="' + option.product_id + '" data-vid="' + option.variation_id + '" data-pname="' + option.product_name + '" data-freeitem="false" data-freeitems=\'{}\' data-orderitemid="' + option.order_item_id + '" data-img="' + option.product_img + '" data-srfee="' + option.sr_fee + '" data-sristaxable="' + option.sr_fee_istaxable + '" data-meta_data=\'' + option.meta_data + '\'>';
            layoutHtml += '<td class="text-center"><button class="btn menu-icon-gr p-0 text-red btnDeleteItem billinfo" tabitem_itemid="' + option.PKey + '" onclick="removeItemsInTable(\'' + option.PKey + '\');" data-toggle="tooltip" data-original-title="Delete product"> <i class="glyphicon glyphicon-trash" data-toggle="tooltip" title="Delete product"></i> </button></td>';
            layoutHtml += '<td>' + option.product_name + '<div class="view-giftmeta" style="word-wrap: break-word;"> <b>To:</b> ' + _meta.wc_gc_giftcard_to_multiple + '<br><b>From:</b> ' + _meta.wc_gc_giftcard_from + '<br><b>Amount:</b> $' + option.total + '</div></td>';
            layoutHtml += '<td class="text-right">' + option.reg_price.toFixed(2) + '</td>';
            layoutHtml += '<td><input min="1" autocomplete="off" disabled class="form-control number rowCalulate" type="number" id="txt_ItemQty_' + option.PKey + '" value="' + option.quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
            layoutHtml += '<td class="TotalAmount text-right" data-regprice="' + option.reg_price + '"data-salerate="' + option.sale_rate + '" data-discount="' + option.discount + '" data-amount="' + option.total + '" data-taxamount="' + option.tax_amount + '" data-shippingamt="' + option.shipping_amount + '">' + option.total.toFixed(2) + '</td>';
            layoutHtml += '<td class="text-right RowDiscount" data-disctype="' + option.discount_type + '" data-couponamt="0">' + option.discount.toFixed(2) + '</td>';
            layoutHtml += '<td class="text-right linetotal">' + (option.total - option.discount).toFixed(2) + '</td>';
            layoutHtml += '<td class="text-right RowTax">' + option.tax_amount + '</td>';
            layoutHtml += '</tr>';
            $('#order_line_items').append(layoutHtml);
        }
        else {
            layoutHtml += '<td class="text-center"><button class="btn menu-icon-gr p-0 text-red btnDeleteItem billinfo" tabitem_itemid="' + option.PKey + '" onclick="removeItemsInTable(\'' + option.PKey + '\');" data-toggle="tooltip" data-original-title="Delete product"> <i class="glyphicon glyphicon-trash" data-toggle="tooltip" title="Delete product"></i> </button></td>';
            layoutHtml += '<td>' + option.product_name + '<div class="view-giftmeta"> <b>To:</b> ' + _meta.wc_gc_giftcard_to_multiple + '<br><b>From:</b> ' + _meta.wc_gc_giftcard_from + '<br><b>Amount:</b> $' + option.total + '</div></td>';
            layoutHtml += '<td class="text-right">' + option.reg_price.toFixed(2) + '</td>';
            layoutHtml += '<td><input min="1" autocomplete="off" disabled class="form-control number rowCalulate" type="number" id="txt_ItemQty_' + option.PKey + '" value="' + option.quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
            layoutHtml += '<td class="TotalAmount text-right" data-regprice="' + option.reg_price + '"data-salerate="' + option.sale_rate + '" data-discount="' + option.discount + '" data-amount="' + option.total + '" data-taxamount="' + option.tax_amount + '" data-shippingamt="' + option.shipping_amount + '">' + option.total.toFixed(2) + '</td>';
            layoutHtml += '<td class="text-right RowDiscount" data-disctype="' + option.discount_type + '" data-couponamt="0">' + option.discount.toFixed(2) + '</td>';
            layoutHtml += '<td class="text-right linetotal">' + (option.total - option.discount).toFixed(2) + '</td>';
            layoutHtml += '<td class="text-right RowTax">' + option.tax_amount + '</td>';
            $('#tritemId_' + option.PKey).empty().append(layoutHtml); $('#tritemId_' + option.PKey).data('meta_data', option.meta_data)
        }
    }
    $("#billModal").modal('hide');
    $.when(RemoveCouponAndGiftCard()).done(function () { calculateDiscountAcount(); });
}
function RemoveCouponAndGiftCard() {
    if ($("#order_line_items > tr.gift_item").length > 0) {
        $("#billGiftCard,#billCoupon").empty(); $('#btnApplyCoupon,#btnApplyGiftCard').prop("disabled", true);
        let auto_code = [], tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00;
        $("#order_line_items > tr.paid_item").each(function (index, tr) {
            let pid = $(tr).data('pid'), coupon_amt = 0.00, disc_amt = 0.00, zGrossAmount = 0.00;
            let zQty = parseFloat($(tr).find("[name=txt_ItemQty]").val()) || 0.00;
            let reg_price = parseFloat($(tr).find(".TotalAmount").data("regprice")) || 0.00, sale_price = parseFloat($(tr).find(".TotalAmount").data("salerate")) || 0.00;
            //get diff Coupon
            if (reg_price > sale_price) {
                coupon_amt = (reg_price - sale_price);
                let coupon_list = auto_coupon.filter(element => element.post_title_id == pid);
                if (coupon_list.length > 0) {
                    coupon_list[0].coupon_amount = coupon_amt;
                    if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
                }
            }
            //14023 - Layla Kapok Pillow
            if (pid == 14023) {
                let coupon_list = auto_coupon.filter(element => element.post_title == "kapok-pillow");
                if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
            }
            zGrossAmount = reg_price * zQty, disc_amt = coupon_amt * zQty;
            $(tr).find(".TotalAmount").data("amount", zGrossAmount.toFixed(2)); $(tr).find(".TotalAmount").text(zGrossAmount.toFixed(2));

            $(tr).find(".RowDiscount").data("disctype", 'fixed'); $(tr).find(".RowDiscount").data("couponamt", coupon_amt.toFixed(2));
            $(tr).find(".RowDiscount").text(disc_amt.toFixed(2)); $(tr).find(".TotalAmount").data("discount", disc_amt.toFixed(2));
            zTotalTax = (((zGrossAmount - disc_amt) * tax_rate) / 100);
            $(tr).find(".RowTax").text(zTotalTax.toFixed(2)); $(tr).find(".TotalAmount").data("taxamount", zTotalTax.toFixed(2));
        });
        bindCouponList(auto_code);
    }
    else { $('#btnApplyCoupon,#btnApplyGiftCard').prop("disabled", false); }
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Order Notes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function DeleteNotes(id) {
    let oid = parseInt($('#hfOrderNo').val()) || 0; let option = { comment_ID: id, post_ID: oid };
    swal({ title: '', text: 'Would you like to remove this note?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) {
                ajaxFunction('/OrdersMySQL/OrderNoteDelete', option, beforeSendFun, function (result) {
                    if (result.status) getOrderNotesList(oid);
                    else swal('Alert!', result.message, "error");
                }, completeFun, errorFun, false);
            }
        });
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Add Fee ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function AddFeeModal(rowid, orderitemid, feetitle, feeamt, feetype) {
    //ActivityLog('Edit fee (' + feevalue + ') in order id (' + $('#hfOrderNo').val() + ')', '/Product/AddNewProduct/');
    var feeHtml = '<div class="modal-dialog">';
    feeHtml += '<div class="modal-content">';
    feeHtml += '<div class="modal-header">';
    feeHtml += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    feeHtml += '<h4 class="modal-title" id="myModalLabel">Add Fees</h4>';
    feeHtml += '</div>';
    feeHtml += '<div class="modal-body">';

    feeHtml += '<div class="row"><div class="col-md-12">Fee Title (Name)<span class="text-red">*</span><input class="form-control" type="input" id="txt_FeeTitle" placeholder="Fee Title" maxlength="100" autocomplete="true" value="' + feetitle.replace(/^-?\d+\.\d+|^-?\d+\b|^\d+(?=\w)|^\d+(?=\%)/g, '').replace(/^[`~!@#$%^&]/gi, '').trim() + '"></div></div>';
    feeHtml += '<div class="row">';
    feeHtml += '<div class="col-md-6">Fee Type<span class="text-red">*</span><select class="form-control select2" id="ddlFeeType" placeholder="Select Fee Type" style="width: 100%;"><option value="0" selected="selected">Select</option><option value="$">Dollar ($)</option><option value="%">Percent (%)</option></select></div>';
    feeHtml += '<div class="col-md-6">Amount/Percent<span class="text-red">*</span><input class="form-control" type="number" id="txt_FeeAmt" name="txt_FeeAmt" placeholder="Amount" maxlength="15" autocomplete="true" value="' + feeamt + '"></div>';
    feeHtml += '</div>';

    feeHtml += '</div>';
    feeHtml += '<div class="modal-footer">';
    feeHtml += '<button type="button" class="btn btn-danger pull-right" id="btnApplyFee" data-rowid="' + rowid + '" data-orderitemid="' + orderitemid + '">Add</button>';
    feeHtml += '</div>';
    feeHtml += '</div>';
    feeHtml += '</div>';
    $("#billModal").empty().html(feeHtml);
    $("#billModal").modal({ backdrop: 'static', keyboard: false }); $("#ddlFeeType").val(feetype); $("#txt_FeeTitle").focus();
}
function ApplyFee(rowid, orderitemid, feetitle, feetype, feeamt) {
    //let feetype = feetitle.match(/%/g) != null ? '%' : '';
    //let startingNumber = parseFloat(feetitle.match(/^-?\d+\.\d+|^-?\d+\b|^\d+(?=\w)/g)) || 0.00;
    //let product_name = feetype == '%' ? feetitle.replace(/fee$/, "fee") : startingNumber + ' fee';
    let startingNumber = feeamt, product_name = feeamt + feetype + ' ' + feetitle;
    let oid = parseInt($('#hfOrderNo').val()) || 0, line_total = 0, zGAmt = parseFloat($("#SubTotal").text()) || 0.00;
    line_total = (feetype == '%' && startingNumber != 0) ? (zGAmt * startingNumber / 100) : startingNumber;

    let feeHtml = '';
    if ($('#trfeeid_' + rowid).length <= 0) {
        feeHtml += '<tr id="trfeeid_' + rowid + '" data-orderitemid="' + orderitemid + '" data-pname="' + product_name + '" data-feeamt="' + startingNumber + '" data-feetype="' + feetype + '">';
        feeHtml += '<td class="text-center item-action"><button class="btn menu-icon-gr text-success  billinfo" onclick="AddFeeModal(\'' + rowid + '\',' + orderitemid + ',\'' + product_name + '\',' + startingNumber + ',\'' + feetype + '\');" data-toggle="tooltip" title="Edit fee"> <i class="glyphicon glyphicon-edit"></i></button>';
        feeHtml += '<button class="btn menu-icon-gr text-red billinfo" onclick="RemoveFee(\'' + rowid + '\');" data-toggle="tooltip" title="Delete fee"> <i class="glyphicon glyphicon-trash"></i></button></td>';
        feeHtml += '<td>' + product_name + '</td><td></td><td></td><td></td><td></td><td class="TotalAmount text-right">' + line_total + '</td><td></td>';
        feeHtml += '</tr>';
        $('#order_fee_line_items').append(feeHtml);
    }
    else {
        $('#trfeeid_' + rowid).data('pname', product_name); $('#trfeeid_' + rowid).data('feeamt', startingNumber); $('#trfeeid_' + rowid).data('feetype', feetype);
        feeHtml += '<td class="text-center item-action"><button class="btn menu-icon-gr text-success  billinfo" onclick="AddFeeModal(\'' + rowid + '\',' + orderitemid + ',\'' + product_name + '\',' + startingNumber + ',\'' + feetype + '\');" data-toggle="tooltip" title="Edit fee"> <i class="glyphicon glyphicon-edit"></i></button>';
        feeHtml += '<button class="btn menu-icon-gr text-red billinfo" onclick="RemoveFee(\'' + rowid + '\');" data-toggle="tooltip" title="Delete fee"> <i class="glyphicon glyphicon-trash"></i></button></td>';
        feeHtml += '<td>' + product_name + '</td><td></td><td></td><td></td><td></td><td class="TotalAmount text-right">' + line_total + '</td><td></td>';
        $('#trfeeid_' + rowid).empty().append(feeHtml);
    }
    $("#billModal").modal('hide'); calcFinalTotals();
}
function RemoveFee(rowid) {
    swal({ title: '', text: 'Would you like to Remove this fee?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) { $('#trfeeid_' + rowid).remove(); calcFinalTotals(); }
        });
    return false;
}
function CalculateFee() {
    let zFeeAmt = 0.00, zGmtAmt = parseFloat($("#SubTotal").text());
    $("#order_fee_line_items > tr").each(function (index, tr) {
        let zAmt = 0.00;
        if ($(tr).data('feetype') == '%') zAmt = (zGmtAmt * (parseFloat($(tr).data('feeamt')) / 100));
        else zAmt = parseFloat($(tr).data('feeamt'));
        $(tr).find(".TotalAmount").text(zAmt.toFixed(2));
        zFeeAmt += zAmt;
    });
    $("#feeTotal").text(zFeeAmt.toFixed(2));
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Gift Card Modal ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function GiftCardModal() {
    var myHtml = '';
    //header
    myHtml += '<div class="modal-dialog">';
    myHtml += '<div class="modal-content">';
    myHtml += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    myHtml += '<h4 class="modal-title" id="myModalLabel">Apply Gift Card</h4>';
    myHtml += '</div>';
    myHtml += '<div class="modal-body">Enter a Gift Card code to apply.';
    myHtml += '<input class="form-control" type="text" id="txt_GiftCard" name="txt_GiftCard" placeholder="Gift Card Code" maxlength="25">';
    myHtml += '<div class="font-weight-bold text-danger alert-coupon"></div>';
    myHtml += '</div>';
    myHtml += '<div class="modal-footer"><button type="button" class="btn btn-danger" id="btnGiftCardAdd">Add</button></div>';
    myHtml += '</div>';
    myHtml += '</div>';
    $("#billModal").empty().html(myHtml);
    $("#billModal").modal({ backdrop: 'static', keyboard: false }); $("#txt_GiftCard").focus();
}
function ApplyGiftCard() {
    let giftcard_code = $("#txt_GiftCard").val().toLowerCase().trim();
    if ($('#li_' + giftcard_code).length > 0) { swal('Alert!', 'Gift Card Code already applied!', "error").then((result) => { $('#txt_GiftCard').focus(); return false; }); return false; };
    if (giftcard_code == '') { swal('Alert!', 'Please Enter a Gift Card Code.', "error").then((result) => { $('#txt_GiftCard').focus(); return false; }); return false; }
    let _total = parseFloat($("#orderTotal").text()) || 0.00;
    let obj = { strValue1: giftcard_code };
    $.ajax({
        type: "POST", url: '/Orders/GetGiftCardAmount', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        success: function (result) {
            let data = JSON.parse(result);
            if (data.length == 0) { swal('Alert!', 'Invalid code entered. Please try again.', "error").then((result) => { $('#txt_GiftCard').focus(); return false; }); return false; }
            if (data[0].giftcard_amount > 0) {
                if (_total <= 0) { swal('Error!', 'Please add product in your cart', "error").then((result) => { $('#txt_GiftCard').focus(); return false; }); return false; }
                else if (_total > 0 && _total >= data[0].giftcard_amount) {
                    let giftcardHtml = '<li id="li_' + data[0].code.toString().toLowerCase().replaceAll(' ', '_') + '" data-pn="' + data[0].code.toString().toUpperCase() + '" data-id="' + data[0].id + '" data-orderitemid="0" data-amount="' + data[0].giftcard_amount.toFixed(2) + '">';
                    giftcardHtml += '<a href="javascript:void(0);">';
                    giftcardHtml += '<i class="glyphicon glyphicon-gift"></i><span>' + data[0].code + '</span>';
                    giftcardHtml += '<div class="pull-right">$<span id="gift_amt">' + data[0].giftcard_amount.toFixed(2) + '</span><button type="button" class="btn btn-box-tool pull-right billinfo" onclick="deleteAllGiftCard(\'' + data[0].code.toString().toLowerCase() + '\');"><i class="fa fa-times"></i></button></div>';
                    giftcardHtml += '</a>';
                    giftcardHtml += '</li>';
                    $('#billGiftCard').append(giftcardHtml);
                }
                else if (_total > 0 && data[0].giftcard_amount >= _total) {
                    data[0].giftcard_amount = _total;
                    let giftcardHtml = '<li id="li_' + data[0].code.toString().toLowerCase().replaceAll(' ', '_') + '" data-pn="' + data[0].code.toString().toUpperCase() + '" data-id="' + data[0].id + '" data-orderitemid="0" data-amount="' + data[0].giftcard_amount.toFixed(2) + '">';
                    giftcardHtml += '<a href="javascript:void(0);">';
                    giftcardHtml += '<i class="glyphicon glyphicon-gift"></i><span>' + data[0].code + '</span>';
                    giftcardHtml += '<div class="pull-right">$<span id="gift_amt">' + _total.toFixed(2) + '</span><button type="button" class="btn btn-box-tool pull-right billinfo" onclick="deleteAllGiftCard(\'' + data[0].code.toString().toLowerCase() + '\');"><i class="fa fa-times"></i></button></div>';
                    giftcardHtml += '</a>';
                    giftcardHtml += '</li>';
                    $('#billGiftCard').append(giftcardHtml);
                }
                $("#billModal").modal('hide');
            }
            else { swal('Invalid!', 'This gift card code is not valid.', "error").then((result) => { $('#txt_GiftCard').focus(); return false; }); return false; }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });
    calcFinalTotals();
}
function deleteAllGiftCard(GiftCode) {
    let gc_orderitemID = parseInt($('#li_' + GiftCode.replaceAll(' ', '_')).data("orderitemid")) || 0;
    swal({ title: '', text: 'Would you like to remove this Gift Card?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) {
                let obj = { order_id: gc_orderitemID, payment_method_title: GiftCode };
                if (gc_orderitemID > 0)
                    $.post('/Orders/DeleteGiftCard', obj).done(function (data) { $('#li_' + GiftCode.replaceAll(' ', '_')).remove(); calcFinalTotals(); });
                else { $('#li_' + GiftCode.replaceAll(' ', '_')).remove(); calcFinalTotals(); }
            }
        });
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Coupon and Product Modal ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function CouponModal() {
    var myHtml = '';
    //header
    myHtml += '<div class="modal-dialog">';
    myHtml += '<div class="modal-content">';
    myHtml += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    myHtml += '<h4 class="modal-title" id="myModalLabel">Apply Coupon</h4>';
    myHtml += '</div>';
    myHtml += '<div class="modal-body">Enter a coupon code to apply. Discounts are applied to line totals, before taxes.';
    myHtml += '<input class="form-control" type="text" id="txt_Coupon" name="txt_Coupon" placeholder="Coupon Code" maxlength="25">';
    myHtml += '<div class="font-weight-bold text-danger alert-coupon"></div>';
    myHtml += '</div>';
    myHtml += '<div class="modal-footer"><button type="button" class="btn btn-danger" id="btnCouponAdd">Add</button></div>';
    myHtml += '</div>';
    myHtml += '</div>';
    $("#billModal").empty().html(myHtml);
    $("#billModal").modal({ backdrop: 'static', keyboard: false }); $("#txt_Coupon").focus();
}
function Coupon_get_discount_amount(id, parent_id, coupon_code, coupon_amt, item_qty, reg_price, sale_price) {
    coupon_code = coupon_code.toString().toLowerCase();
    let coupon_isedu = ["mhsu15", "pu15", "utep74", "msu15", "cabarrus15", "crusader15", "ucsd15", "vt15", "kent15", "fcs15", "sisd15", "isu15", "uh15", "teacher15", "csusm15", "abbey15"];
    let coupon_isgrin = ["erin10off", "venezia10off", "jasmine10off", "liz10off", "jamie10off", "nicole10off", "faye10off", "vinny10off", "ava10off", "kelsey10off", "aimy10off", "grace10off", "ramya10off", "georgia10off", "slayer10off", "victoria10off", "nickayla10off", "saraida10off", "garnerfamily5", "gina10off", "brooke10off", "lolo10off", "melissa10off", "claudia10off"];
    let isedu = 0;
    if (coupon_isedu.includes(coupon_isedu)) { isedu = 1; }
    let isgrin = 0;
    if (coupon_isgrin.includes(coupon_isedu)) { isgrin = 1; }

    if (coupon_code.includes("friend") && coupon_code.substr(6) > 8500) {
        if (id != 632713 && id != 78676) {
            if (parent_id == 118) {
                if (coupon_amt == 130) coupon_amt = 130;
                else if (coupon_amt == 150) coupon_amt = 150;
            }
            else if (parent_id == 611172) {
                if (coupon_amt == 130) coupon_amt = 130;
                else if (coupon_amt == 150) coupon_amt = 200;
            }
            else {
                coupon_amt = 10; reg_price = sale_price;
            }
        }
        else
            return 0.00;
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code.includes("vip")) {
        return { price: sale_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (isedu == 1) {
        let matt_arr = [118, 611172, 611252, 612995, 611286, 31729, 20861];
        if (id != 632713 && id != 78676) {
            if (matt_arr.includes(parent_id)) coupon_amt = (reg_price * item_qty * 0.10);
            else coupon_amt = (reg_price * item_qty * 0.15);
        }
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (isgrin == 1) {
        if (id != 632713 && id != 78676) { coupon_amt = 10; }
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code == "pmac" || coupon_code == "pennymac") {
        if (id != 632713 && id != 78676) {
            if (parent_id == 118) coupon_amt = 150;
            else coupon_amt = 10;
        }
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code == "sleepopolis") {
        if (id != 632713 && id != 78676) { coupon_amt = 10; }
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code == "sleepfoundation") {
        if (id != 632713 && id != 78676) {
            if (parent_id == 118) coupon_amt = 10;
            else if (parent_id == 611172) coupon_amt = 20;
        }
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code == "sleepy10") {
        if (parent_id != 611172) { coupon_amt = 10; }
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code == "sleepy20") {
        if (parent_id == 611172) { coupon_amt = 20; }
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code == "redd" || coupon_code == "sleepstandards") {
        if (id != 632713 && id != 78676) {
            if (parent_id == 118) coupon_amt = 10;
            else if (parent_id == 611172) coupon_amt = 10;
        }
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code == 'yuliya100') {
        let var_arr = [1399, 611239, 128250];
        if (var_arr.includes(parent_id)) coupon_amt = sale_price;
        return { price: sale_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code == 'ascend100') {
        let var_arr = [31735, 723, 733504, 613011];
        if (var_arr.includes(parent_id)) coupon_amt = sale_price;
        return { price: sale_price, disc_amt: coupon_amt, qty: item_qty };;
    }
    else if (coupon_code == "idmecoupon" || coupon_code == "mil20off072021") {
        coupon_amt = (reg_price * item_qty * 0.20);
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code == "5wprkapok40") {
        if (parent_id == 14023) coupon_amt = (reg_price * item_qty * 0.40);
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code == "freeprotector" && parent_id == 611268) {
        let matt_qnty = 0, prot_qnty = 0;
        $("#order_line_items > tr.paid_item").each(function (tr_index, tr_row) {
            if ($(tr_row).data("pid") == 118 || $(tr_row).data("pid") == 611172) {
                matt_qnty += parseFloat($(tr_row).find("[name=txt_ItemQty]").val());
            }
        });
        if (item_qty > matt_qnty) { prot_qnty = matt_qnty; }
        else if (item_qty == matt_qnty) { prot_qnty = item_qty; }
        else if (item_qty < matt_qnty) { prot_qnty = item_qty; }
        else { prot_qnty = 0.00; }
        return { price: sale_price, disc_amt: 1.00, qty: prot_qnty };
    }
    else if (coupon_code == "kapok second pillow") {
        let kap_qnty = 0;
        $("#order_line_items > tr.paid_item").each(function (tr_index, tr_row) {
            if ($(tr_row).data("pid") == 14023) { kap_qnty += parseFloat($(tr_row).find("[name=txt_ItemQty]").val()); }
        });
        coupon_amt = (kap_qnty == 1) ? coupon_amt : 0;
        return { price: reg_price, disc_amt: coupon_amt, qty: 1 };
    }
    else if (coupon_code == "tsjpillow") {
        let kap_qnty = 0;
        $("#order_line_items > tr.paid_item").each(function (tr_index, tr_row) {
            if ($(tr_row).data("pid") == 14023) { kap_qnty += parseFloat($(tr_row).find("[name=txt_ItemQty]").val()); }
        });
        if (kap_qnty % 2 == 0) { $('#li_' + coupon_code).remove(); coupon_amt = 0; }
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
    else if (coupon_code.includes("sales10off")) {
        return { price: reg_price, disc_amt: coupon_amt, qty: 1 };
    }
    else {
        return { price: reg_price, disc_amt: coupon_amt, qty: item_qty };
    }
}
function check_applied_coupon(coupon_code, product_ids, exclude_product_ids) {
    let check = false, rq_prd_ids = [], exclude_ids = [], cart_matt_ids = [], cart_prnt_ids = [];
    $('#order_line_items > tr').each(function (index, row) {
        if ($(row).data('pid') == "118" || $(row).data('pid') == "611172") cart_matt_ids.push($(row).data('pid'));
        else cart_prnt_ids.push($(row).data('pid'));
        cart_prnt_ids.push($(row).data('vid'));
    });
    //console.log(cart_matt_ids, cart_prnt_ids);
    if (coupon_code.includes("sales10off")) { if (!cart_prnt_ids.includes(118) && !cart_prnt_ids.includes(611172)) return true; }
    else if (coupon_code.includes("sales25off")) { if (cart_matt_ids.includes(118)) return true; }
    else if (coupon_code.includes("sales50off")) { if (cart_matt_ids.includes(611172)) return true; }
    else if (coupon_code.includes("sales75off")) {
        if (cart_matt_ids.includes(611172) && (cart_prnt_ids.includes(20861) || cart_prnt_ids.includes(611252) || cart_prnt_ids.includes(733500))) return true;
    }
    else if (coupon_code.includes("sales100off")) {
        if (cart_prnt_ids.includes(611286) && (cart_matt_ids.includes(611172) || cart_matt_ids.includes(118))) return true;
    }
    else if (coupon_code.includes("sales125off")) { if (cart_matt_ids.includes(118) && cart_prnt_ids.includes(612995)) return true; }
    else if (coupon_code.includes("sales150off")) { if (cart_matt_ids.includes(611172) && cart_prnt_ids.includes(612995)) return true; }
    else if (coupon_code.includes("sales175off")) {
        if (cart_matt_ids.includes(118) && cart_prnt_ids.includes(612995) && (
            cart_prnt_ids.includes(56774) || cart_prnt_ids.includes(611268) ||
            cart_prnt_ids.includes(612947) || cart_prnt_ids.includes(612955) ||
            cart_prnt_ids.includes(611220)
        ))
            return true;
    }
    else if (coupon_code.includes("sales200off")) {
        if (cart_matt_ids.includes(611172) && cart_prnt_ids.includes(612995) && (
            cart_prnt_ids.includes(56774) || cart_prnt_ids.includes(611268) ||
            cart_prnt_ids.includes(612947) || cart_prnt_ids.includes(612955) ||
            cart_prnt_ids.includes(611220)
        ))
            return true;
    }
    else {
        if (product_ids != "" && product_ids != null) {
            rq_prd_ids = product_ids.split(",").map((el) => parseInt(el));
        }
        if (exclude_product_ids != "" && exclude_product_ids != null) {
            exclude_ids = exclude_product_ids.split(",").map((el) => parseInt(el));
        }
        $("#order_line_items > tr.paid_item").each(function (index, row) {
            let pid = $(row).data('pid'), vid = $(row).data('vid');
            if (!exclude_ids.includes(pid) && !exclude_ids.includes(vid) && ((rq_prd_ids.includes(pid) || rq_prd_ids.includes(vid)) || rq_prd_ids == 0)) {
                check = true;
            }
        });
        return check;
    }
    return check;
}
function getAllCoupons() {
    var coupons = [];
    $('#billCoupon li').each(function (index) { coupons.push($(this).data('coupon')); });
    return coupons;
}
function deleteSaleCoupon() {
    let cart_other_mrt_ids = [], cart_prnt_ids = [];
    $('#order_line_items > tr.paid_item').each(function (index, row) {
        if ($(row).data('pid') != "118" && $(row).data('pid') != "611172") { cart_other_mrt_ids.push($(row).data('pid')); cart_other_mrt_ids.push($(row).data('vid')); }
        cart_prnt_ids.push($(row).data('pid')); cart_prnt_ids.push($(row).data('vid'));
    });
    if (cart_prnt_ids.includes(118) && cart_prnt_ids.includes(611172) && cart_other_mrt_ids.length == 0) { $('[id*="li_sales10off"]').remove() };
    if (cart_prnt_ids.includes(118)) { } else { $('[id*="li_sales25off"]').remove(); }
    if (cart_prnt_ids.includes(611172)) { } else { $('[id*="li_sales50off"]').remove(); }
    if (cart_prnt_ids.includes(611172) && (cart_prnt_ids.includes(20861) || cart_prnt_ids.includes(611252) || cart_prnt_ids.includes(733500))) { } else $('[id*="li_sales75off"]').remove();
    if (cart_prnt_ids.includes(611286) && (cart_prnt_ids.includes(611172) || cart_prnt_ids.includes(118))) { } else $('[id*="li_sales100off"]').remove();
    if (cart_prnt_ids.includes(118) && cart_prnt_ids.includes(612995)) { } else { $('[id*="li_sales125off"]').remove(); }
    if (cart_prnt_ids.includes(611172) && cart_prnt_ids.includes(612995)) { } else { $('[id*="li_sales125off"]').remove(); }
    if (cart_prnt_ids.includes(118) && cart_prnt_ids.includes(612995) && (cart_prnt_ids.includes(56774) || cart_prnt_ids.includes(611268) || cart_prnt_ids.includes(612947) || cart_prnt_ids.includes(612955) || cart_prnt_ids.includes(611220))) { }
    else { $('[id*="li_sales175off"]').remove(); }
    if (cart_prnt_ids.includes(611172) && cart_prnt_ids.includes(612995) && (cart_prnt_ids.includes(56774) || cart_prnt_ids.includes(611268) || cart_prnt_ids.includes(612947) || cart_prnt_ids.includes(612955) || cart_prnt_ids.includes(611220))) { }
    else { $('[id*="li_sales200off"]').remove(); }
}
function ApplyAutoCoupon() {
    // If Gift Card purchase not apply any auto coupon
    if ($("#order_line_items > tr.gift_item").length > 0) return false;
    var cart_prnt_ids = [];
    $("#order_line_items  > tr").each(function () { var pid = $(this).data('pid'); cart_prnt_ids.push(pid); });
    if (!cart_prnt_ids.includes(118) || !cart_prnt_ids.includes(20861)) { $('#li_matt-found').remove(); }
    if (!cart_prnt_ids.includes(118) || !cart_prnt_ids.includes(56774)) { $('#li_matt-topper').remove(); }
    if (!cart_prnt_ids.includes(118) || !cart_prnt_ids.includes(31729)) { $('#li_matt-bedframe').remove(); }
    if (!cart_prnt_ids.includes(118) || !cart_prnt_ids.includes(124524)) { $('#li_matt-sheet').remove(); }
    if (!cart_prnt_ids.includes(118) || !cart_prnt_ids.includes(128244)) { $('#li_matt-blanket').remove(); }
    if (!cart_prnt_ids.includes(118) || !cart_prnt_ids.includes(14023)) { $('#li_matt-pillow').remove(); }
    if (!cart_prnt_ids.includes(31729) || !cart_prnt_ids.includes(20861)) { $('#li_found-frame').remove(); }
    let auto_code = [];
    if (cart_prnt_ids.includes(118)) {
        if (cart_prnt_ids.includes(20861)) {
            let coupon_list = auto_coupon.filter(element => element.post_title == "matt-found");
            if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
        }
        if (cart_prnt_ids.includes(56774)) {
            let coupon_list = auto_coupon.filter(element => element.post_title == "matt-topper");
            if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
        }
        if (cart_prnt_ids.includes(31729)) {
            let coupon_list = auto_coupon.filter(element => element.post_title == "matt-bedframe");
            if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
        }
        if (cart_prnt_ids.includes(124524)) {
            let coupon_list = auto_coupon.filter(element => element.post_title == "matt-sheet");
            if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
        }
        if (cart_prnt_ids.includes(128244)) {
            let coupon_list = auto_coupon.filter(element => element.post_title == "matt-blanket");
            if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
        }
        if (cart_prnt_ids.includes(14023)) {
            let coupon_list = auto_coupon.filter(element => element.post_title == "matt-pillow");
            if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
        }
    }
    if (cart_prnt_ids.includes(31729) && cart_prnt_ids.includes(20861)) {
        let coupon_list = auto_coupon.filter(element => element.post_title == "found-frame");
        if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
    }
    var cart_coupons = getAllCoupons();
    //14023 - Layla Kapok Pillow
    if (cart_prnt_ids.includes(14023) && !cart_coupons.includes('melanieff35') && !cart_coupons.includes('idmecoupon') && !cart_coupons.includes('ffdbmatt01ck0621') && !cart_coupons.includes('ffrphybr01q0621')) {
        let coupon_list = auto_coupon.filter(element => element.post_title == "kapok-pillow");
        if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
    }
    if (auto_code.length > 0) { bindCouponList(auto_code); }
}
function ApplyCoupon() {
    var newItemText = $("#txt_Coupon").val();
    console.log(newItemText);
    //if (newItemText.trim() !== "") {
    //    var newItem = $("<li>");
    //    newItem.attr("data-text", newItemText); // Store the text with extra spaces in a data attribute
    //    newItem.append(newItemText); // Display the text with extra spaces

    //    var deleteButton = $("<button>").text("Delete Coupon");
    //    deleteButton.click(function () {
    //        var deletedItemText = $(this).closest("li").text().trim();
    //        console.log("Deleted item text: " + deletedItemText);
    //        $(this).parent("li").remove();           
    //    });
    //    newItem.append(deleteButton);
    //    $("#billCoupon").append(newItem);
    //    $("#txt_Coupon").val(""); // Clear the input field
    //}
    if ($("#hfsession_id").val() != '0') {
        let option = {
            code: newItemText.toString().toLowerCase(),
            session_id: $("#hfsession_id").val()
        };
        $.ajax({
            type: "Post", url: '/Quickorder/applycoupon', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option),
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                console.log(data);
                var row = data[0];
                if (Array.isArray(data) && data.length === 1) {
                    const item = data[0];
                    const subprice = item.subprice;
                    const totalTtc = item.total_ttc;
                    console.log(`Subprice: ${subprice}`);
                    console.log(`Total TTC: ${totalTtc}`);
                    if (item.product_type == '200') {
                        $("#otherTotal").text(""); $("#otherTotal").html("");
                        $("#SubTotal").text(formatCurrency(item.subprice)); $("#SubTotal").data('total', item.subprice);
                        $("#otherTotal").text(formatCurrency(totalTtc)); $("#otherTotal").data('total', totalTtc);
                        //$("#totalQty").text(formatCurrency(tGrossAmt));
                        $("#discountTotal").text(formatCurrency(item.discount)); $("#discountTotal").data('total', item.discount);
                        $("#salesTaxTotal").text(formatCurrency(item.total_localtax1)); $("#salesTaxTotal").data('total', item.total_localtax1);
                        $("#shippingTotal").text(formatCurrency(item.total_localtax2)); $("#shippingTotal").data('total', item.total_localtax2);
                        $("#netPaymentTotal").text(formatCurrency(totalTtc)); $("#netPaymentTotal").data('total', totalTtc);
                        var coupons = item.couponsdetails;
                        $('#billCoupon').empty();
                        if (coupons && coupons.length > 0) {
                        for (var i = 0; i < coupons.length; i++) {
                            layoutHtml = '<li id="li_' + coupons[i].coupon_title + '"  data-coupon= "' + coupons[i].coupon_title + '" >';
                            layoutHtml += '<a href="javascript:void(0);">';
                            layoutHtml += '<i class="fa fa-gift"></i><span>' + coupons[i].coupon_title + '</span>';
                            layoutHtml += '<div class="pull-right">';


                            layoutHtml += '$<span id="cou_discamt">' + coupons[i].discount_amount + '</span>';
                            layoutHtml += '<button type="button" class="btn btn-box-tool pull-right" onclick="deleteAllCoupons(\'' + coupons[i].coupon_title + '\');"><i class="fa fa-times"></i></button>';
                            //}
                            //else {
                            //    layoutHtml += '$<span id="cou_discamt" style ="margin-right: 20px;">' + cou_amt.toFixed(2) + '</span>';
                            //}
                            layoutHtml += '</div>';
                            layoutHtml += '</a>';
                            layoutHtml += '</li>';
                            //console.log(data[i].post_title, data[i].coupon_amount);
                            $('#billCoupon').append(layoutHtml);
                            }
                        } else {
                            console.error("No coupons available for the current item.");
                        }

                        $("#txt_Coupon").val('');
                        $("#billModal").modal("hide");
                    }
                    else {
                        swal('Alert!', item.product_label, "info");
                    }
                }

            },
            complete: function () { $("#loader").hide(); },
            error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
            async: true
        });
    }
    else {
        swal('Alert!', 'Please create cart.', "info");

    }

    //let coupon_code = $("#txt_Coupon").val().toLowerCase().trim();
    //if ($('#li_' + coupon_code).length > 0) { swal('Alert!', 'Coupon code already applied!', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; };

    //let autocode = ["cbdistillery", "thesleepadvisor", "tuck", "rv10", "rizslumber", "bestsleep10", "get140", "calm", "relax", "cupid110", "sleepopolis", "tv140", "pennymac", "pnmac", "sleepfoundation", "matt-topper", "matt-sheet", "matt-blanket", "matt-pillow", "matt-bedframe", "matt-found", "found-frame", "sleepy10", "sleepy20"];
    //let monthlySaleCoupon = ["sales10off", "sales25off", "sales50off", "sales75off", "sales100off", "sales125off", "sales150off", "sales175off", "sales200off", "cxstaff20off", "mgr20off", "mgr50off"];
    //let is_monthly_sale_cpn = monthlySaleCoupon.some(el => coupon_code.includes(el));

    //if (coupon_code == '') { swal('Alert!', 'Please Enter a Coupon Code.', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
    //else if (autocode.includes(coupon_code)) { swal('Alert!', 'Cannot Add this Auto-Coupon.', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
    ////else if (is_monthly_sale_cpn) { swal('Alert!', 'Can not add ' + coupon_code, "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
    //else {
    //    if (coupon_code == 'forbes') { swal('Alert!', 'Can not add ' + coupon_code, "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
    //    else if (coupon_code == 'slumber') { swal('Alert!', 'Can not add ' + coupon_code, "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
    //}
    //let billing_email = $("#txtbillemail").val().toLowerCase();
    //let add_coupon_count = 0;
    //$('#billCoupon li').each(function (index, li) {
    //    if ($(li).data('type') == 'add_coupon') { add_coupon_count += 1; }
    //});
    //if (add_coupon_count > 0) { swal('Alert!', 'Cannot add any other Coupon.', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; };
    //if (coupon_code.includes("tsjpillow")) {
    //    let cou_details = Coupon_get_discount_amount(0, 0, coupon_code, 25, 0, 0, 0); //console.log(cou_details);
    //    if (cou_details.disc_amt == 0) { swal('Alert!', 'Cannot add ' + coupon_code, "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; };
    //}

    //let obj = { strValue1: coupon_code };
    //$.ajax({
    //    type: "POST", url: '/Orders/GetCouponAmount', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
    //    success: function (result) {
    //        var data = JSON.parse(result);
    //        if (data.length == 0) { swal('Alert!', 'Invalid code entered. Please try again.', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
    //        if (data[0].use_it == false) { swal('Alert!', 'Invalid code entered. Please try again.', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
    //        //Check valid for email
    //        if (data[0].cus_email.length && data[0].cus_email != '') {
    //            var get_email_arr = res[0].cus_email;
    //            if (billing_email != '') {
    //                if (get_email_arr.includes(billing_email)) {
    //                } else {
    //                    swal('Alert!', 'Coupon cannot be added for this email.', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false;
    //                }
    //            } else {
    //                swal('Alert!', 'Please enter a billing email.', "info").then((result) => { $('#txtbillemail').focus(); return false; }); return false;
    //            }
    //        }
    //        //check expires date
    //        if (data[0].date_expires != "" && data[0].date_expires != null) {
    //            let exp_date = new Date(data[0].date_expires * 1000);
    //            let today = new Date();
    //            if (exp_date < today) {
    //                swal('Alert!', 'Coupon code has been expired.', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false;
    //            }
    //        }
    //        data[0].coupon_amount = parseFloat(data[0].coupon_amount) || 0.00;
    //        data[0].limit_x_items = parseInt(data[0].limit_x_items) || 0;

    //        if (!check_applied_coupon(coupon_code, data[0].product_ids, data[0].exclude_product_ids)) {
    //            swal('Alert!', 'Can not add ' + coupon_code, "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false;
    //        }
    //        //console.log(data[0]);
    //        let cpns_with_other_cpns = ["freeprotector", "founder50", "kapok second pillow", "tsjpillow"];//not remove other coupon
    //        if (coupon_code.includes("friend") && coupon_code.substr(6) > 8500) { deleteAllCoupons('friend_diff'); }
    //        else if (coupon_code.includes("friend") && coupon_code.substr(6) <= 8500) { deleteAllCoupons('friend_auto'); }
    //        else if (coupon_code.includes("sales10off") || cpns_with_other_cpns.includes(coupon_code) || (coupon_code.includes("vip") && data[0].individual_use == "no")) { }
    //        else {
    //            if (data[0].individual_use == "yes") { deleteAllCoupons('all'); }
    //            if (data[0].discount_type != "fixed_cart") { deleteAllCoupons('diff'); }
    //        }
    //        bindCouponList(data);
    //    },
    //    error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
    //    complete: function () {
    //        ActivityLog('Coupon applied (' + $("#txt_Coupon").val().toLowerCase().trim() + ') in order id (' + $('#hfOrderNo').val() + ') ', '/Orders/minesofmoria/' + $('#hfOrderNo').val() + '');
    //    },
    //    async: false
    //});
    //$("#billModal").modal({ backdrop: 'static' }); $("#txt_Coupon").focus();
}
function bindCouponList(data) {
    var layoutHtml = '';
    if (data.length > 0) {

        //var zPCnt = 0, rq_prd_ids = [], zExcPCnt = 0, exclude_ids = [];
        //if (data[0].exclude_product_ids != "" && data[0].exclude_product_ids != null) {
        //    exclude_ids = data[0].exclude_product_ids.split(",").map((el) => parseInt(el));
        //}
        //if (data[0].product_ids != "" && data[0].product_ids != null) {
        //    rq_prd_ids = data[0].product_ids.split(",").map((el) => parseInt(el));
        //}
        //get pdorduct
        //$("#order_line_items > tr").each(function () {
        //    if (jQuery.inArray($(this).data("vid").toString(), zProductIDs) != -1) { zPCnt++; }
        //    if (jQuery.inArray($(this).data("vid").toString(), zExcludeProductIDs) == -1) { zExcPCnt++; }
        //});

        //if (zPCnt == 0 && zExcPCnt == 0) { swal('Alert!', 'Invalid code entered. Please try again.!', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false; }
        for (var i = 0; i < data.length; i++) {
            if ($('#li_' + data[i].post_title.toString().toLowerCase().replaceAll(' ', '_')).length <= 0) {
                let cou_amt = parseFloat(data[i].coupon_amount) || 0.00;
                layoutHtml = '<li id="li_' + data[i].post_title.toString().toLowerCase().replaceAll(' ', '_') + '" class="' + (data[i].discount_type == 'fixed_cart' ? 'cart' : 'items') + '" data-coupon= "' + data[i].post_title + '" data-couponamt= "' + data[i].coupon_amount + '" data-disctype= "' + data[i].discount_type + '" data-rqprdids= "' + data[i].product_ids + '" data-excludeids= "' + data[i].exclude_product_ids + '" data-type= "' + data[i].type + '" data-orderitemid="0">';
                layoutHtml += '<a href="javascript:void(0);">';
                layoutHtml += '<i class="fa fa-gift"></i><span>' + data[i].title.toString().toLowerCase() + '</span>';
                layoutHtml += '<div class="pull-right">';

                if (data[0].type == 'add_coupon') {
                    layoutHtml += '$<span id="cou_discamt">' + cou_amt.toFixed(2) + '</span>';
                    layoutHtml += '<button type="button" class="btn btn-box-tool pull-right" onclick="deleteAllCoupons(\'' + data[i].post_title.toString().toLowerCase() + '\');"><i class="fa fa-times"></i></button>';
                }
                else {
                    layoutHtml += '$<span id="cou_discamt" style ="margin-right: 20px;">' + cou_amt.toFixed(2) + '</span>';
                }
                layoutHtml += '</div>';
                layoutHtml += '</a>';
                layoutHtml += '</li>';
                //console.log(data[i].post_title, data[i].coupon_amount);
                $('#billCoupon').append(layoutHtml);
            }
            else {
                if (data[0].type == 'add_coupon') {
                    swal('Alert!', 'Coupon code already applied!', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false;
                }
                else if (data[i].type == 'diff') {
                    let rq_prd_ids = [];
                    if ($('#li_' + data[i].post_title).data('rqprdids') != "" && $('#li_' + data[i].post_title).data('rqprdids') != null) {
                        rq_prd_ids = $('#li_' + data[i].post_title).data('rqprdids').split(",").map((el) => parseInt(el));
                    }
                    rq_prd_ids.push(data[i].product_ids);
                    $('#li_' + data[i].post_title).data('rqprdids', rq_prd_ids.join(','));
                    //swal('Alert!', 'Coupon code already applied!', "info").then((result) => { $('#txt_Coupon').focus(); return false; }); return false;
                }
            }
        }
        calculateDiscountAcount();
        $("#billModal").modal('hide');
    }
    //else {
    //    var msg = 'Coupon "' + code + '" does not exist!';
    //    swal('Alert!', msg, "info");
    //}
}
function deleteAllCoupons(coupon_type) {
    var newItemText = coupon_type;
    console.log(newItemText);
    if ($("#hfsession_id").val() != '0') {
        let option = {
            code: newItemText.toString().toLowerCase(),
            session_id: $("#hfsession_id").val()
        };
        $.ajax({
            type: "Post", url: '/Quickorder/deletecoupon', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option),
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                console.log(data);
                var row = data[0];
                if (Array.isArray(data) && data.length === 1) {
                    const item = data[0];
                    const subprice = item.subprice;
                    const totalTtc = item.total_ttc;
                    console.log(`Subprice: ${subprice}`);
                    console.log(`Total TTC: ${totalTtc}`);
                    if (item.product_type == '200') {
                        $("#otherTotal").text(""); $("#otherTotal").html("");
                        $("#SubTotal").text(formatCurrency(item.subprice)); $("#SubTotal").data('total', item.subprice);
                        $("#otherTotal").text(formatCurrency(totalTtc)); $("#otherTotal").data('total', totalTtc);
                        //$("#totalQty").text(formatCurrency(tGrossAmt));
                        $("#discountTotal").text(formatCurrency(item.discount)); $("#discountTotal").data('total', item.discount);
                        $("#salesTaxTotal").text(formatCurrency(item.total_localtax1)); $("#salesTaxTotal").data('total', item.total_localtax1);
                        $("#shippingTotal").text(formatCurrency(item.total_localtax2)); $("#shippingTotal").data('total', item.total_localtax2);
                        $("#netPaymentTotal").text(formatCurrency(totalTtc)); $("#netPaymentTotal").data('total', totalTtc);
                        var liId = "li_" + coupon_type.toLowerCase().replaceAll(' ', '_');
                        $("#" + liId).remove();

                    }
                    else {
                        swal('Alert!', item.product_label, "info");
                    }
                }

            },
            complete: function () { $("#loader").hide(); },
            error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
            async: true
        });
    }
    else {
        swal('Alert!', 'Please create cart.', "info");

    }

    //if (coupon_type == 'all') {
    //    $('#billCoupon').empty();
    //    calculateDiscountAcount();
    //}
    //else if (coupon_type == 'diff') {
    //    let tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00;
    //    $('#billCoupon li').each(function (index) {
    //        if ($(this).data('type') == 'diff') {
    //            let id = $(this).data('coupon');
    //            let rq_prd_ids = [];
    //            if ($(this).data('rqprdids') != "" && $(this).data('rqprdids') != null) {
    //                rq_prd_ids = $(this).data('rqprdids').split(",").map((el) => parseInt(el));
    //            }
    //            $('#li_' + id).remove();
    //            for (var i = 0; i < rq_prd_ids.length; i++) {
    //                let row_id = '#tritemId_' + id + '_' + rq_prd_ids[i];
    //                //Remove Discount to Items
    //                let zQty = parseFloat($(row_id).find("[name=txt_ItemQty]").val()) || 0.00;
    //                let zGrossAmount = parseFloat($(row_id).find(".TotalAmount").data("regprice")) || 0.00;
    //                zGrossAmount = zGrossAmount * zQty;
    //                $(row_id).find(".TotalAmount").data("amount", zGrossAmount.toFixed(2)); $(row_id).find(".TotalAmount").text(zGrossAmount.toFixed(2));

    //                $(row_id).find(".RowDiscount").data("disctype", 'fixed');
    //                $(row_id).find(".RowDiscount").data("couponamt", 0.00);
    //                $(row_id).find(".RowDiscount").text(0.00); $(row_id).find(".TotalAmount").data("discount", 0.00);

    //                //Taxation                     
    //                zTotalTax = ((zGrossAmount * tax_rate) / 100);
    //                $(row_id).find(".RowTax").text(zTotalTax.toFixed(2)); $(row_id).find(".TotalAmount").data("taxamount", zTotalTax.toFixed(2));
    //            }
    //        }
    //    });
    //}
    //else if (coupon_type == 'friend_diff') {
    //    let tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00;
    //    //$('#li_118').remove(); $('#li_611172').remove();
    //    $('#li_memory_foam_mattress,#li_hybrid_mattress').remove();
    //    //$('#billCoupon li').each(function (index, li) {
    //    //    if ($(li).data('type') == 'diff' && ($(li).data('coupon') == '118' || $(li).data('coupon') == '611172')) {
    //    //        let id = $(li).data('coupon'), rq_prd_ids = [];
    //    //        if ($(li).data('rqprdids') != "" && $(li).data('rqprdids') != null) {
    //    //            rq_prd_ids = $(li).data('rqprdids').split(",").map((el) => parseInt(el));
    //    //        }
    //    //        $('#li_' + id).remove();
    //    //        for (let i = 0; i < rq_prd_ids.length; i++) {
    //    //            let row_id = '#tritemId_' + id + '_' + rq_prd_ids[i];
    //    //            //Remove Discount to Items
    //    //            let zQty = parseFloat($(row_id).find("[name=txt_ItemQty]").val()) || 0.00;
    //    //            let zGrossAmount = parseFloat($(row_id).find(".TotalAmount").data("regprice")) || 0.00;
    //    //            zGrossAmount = zGrossAmount * zQty;
    //    //            $(row_id).find(".TotalAmount").data("amount", zGrossAmount.toFixed(2)); $(row_id).find(".TotalAmount").text(zGrossAmount.toFixed(2));

    //    //            $(row_id).find(".RowDiscount").data("disctype", 'fixed');
    //    //            $(row_id).find(".RowDiscount").data("couponamt", 0.00);
    //    //            $(row_id).find(".RowDiscount").text(0.00); $(row_id).find(".TotalAmount").data("discount", 0.00);

    //    //            //Taxation                     
    //    //            zTotalTax = ((zGrossAmount * tax_rate) / 100);
    //    //            $(row_id).find(".RowTax").text(zTotalTax.toFixed(2)); $(row_id).find(".TotalAmount").data("taxamount", zTotalTax.toFixed(2));
    //    //        }
    //    //    }
    //    //});
    //}
    //else if (coupon_type == 'friend_auto') {
    //    //$('#li_118').remove(); $('#li_611172').remove(); $("#billCoupon").find("[data-type='auto_coupon']").remove();
    //    $('#li_memory_foam_mattress,#li_hybrid_mattress').remove(); $("#billCoupon").find("[data-type='auto_coupon']").remove();
    //}
    //else if (coupon_type != '') {
    //    swal({ title: '', text: 'Would you like to remove this coupon?', type: "question", showCancelButton: true })
    //        .then((result) => {
    //            if (result.value) {
    //                //Remove Coupon
    //                $('#li_' + coupon_type.replaceAll(' ', '_')).remove(); $('#billCoupon').empty();
    //                let auto_code = [];
    //                let tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00;
    //                $("#order_line_items > tr.paid_item").each(function (index, tr) {
    //                    //Discout Not Apply in free items
    //                    if (!$(tr).data('freeitem')) {
    //                        let row_key = $(tr).data('id'), pid = $(tr).data('pid'), vid = $(tr).data('vid');
    //                        let zQty = parseFloat($(tr).find("[name=txt_ItemQty]").val()) || 0.00;
    //                        let reg_price = parseFloat($(tr).find(".TotalAmount").data("regprice")) || 0.00;
    //                        let sale_price = parseFloat($(tr).find(".TotalAmount").data("salerate")) || 0.00;
    //                        var coupon_amt = 0.00, disc_amt = 0.00;
    //                        //get diff Coupon
    //                        if (reg_price > sale_price) {
    //                            coupon_amt = (reg_price - sale_price);
    //                            let coupon_list = auto_coupon.filter(element => element.post_title_id == pid);
    //                            if (coupon_list.length > 0) {
    //                                coupon_list[0].coupon_amount = coupon_amt;
    //                                if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
    //                            }
    //                        }
    //                        //14023 - Layla Kapok Pillow
    //                        if (pid == 14023 && $('#li_melanieff35').length <= 0 && $('#li_idmecoupon').length <= 0 && $('#li_ffdbmatt01ck0621').length <= 0 && $('#li_ffrphybr01q0621').length <= 0) {
    //                            let coupon_list = auto_coupon.filter(element => element.post_title == "kapok-pillow");
    //                            if (coupon_list.length > 0) auto_code.push(coupon_list[0]);
    //                        }

    //                        let zGrossAmount = reg_price * zQty;
    //                        disc_amt = coupon_amt * zQty;
    //                        $(tr).find(".TotalAmount").data("amount", zGrossAmount.toFixed(2)); $(tr).find(".TotalAmount").text(zGrossAmount.toFixed(2));

    //                        $(tr).find(".RowDiscount").data("disctype", 'fixed'); $(tr).find(".RowDiscount").data("couponamt", coupon_amt.toFixed(2));
    //                        $(tr).find(".RowDiscount").text(disc_amt.toFixed(2)); $(tr).find(".TotalAmount").data("discount", disc_amt.toFixed(2));
    //                        zTotalTax = (((zGrossAmount - disc_amt) * tax_rate) / 100);
    //                        $(tr).find(".RowTax").text(zTotalTax.toFixed(2)); $(tr).find(".TotalAmount").data("taxamount", zTotalTax.toFixed(2));
    //                    }
    //                });
    //                $.when(bindCouponList(auto_code)).done(function () { ApplyAutoCoupon(); });
    //            }
    //        });
    //}
}

function freeQtyUpdate() {
    $("#order_line_items > tr.free_item").each(function (index, row) {
        let zQty = 0.00, pid = parseInt($(this).data("pid")) || 0, vid = parseInt($(this).data("vid")) || 0;
        $("#order_line_items  > tr.paid_item").each(function (i, prow) {
            if ($(prow).data('freeitems')[pid] != undefined) { zQty += parseFloat($(prow).find("[name=txt_ItemQty]").val()) * parseFloat($(prow).data('freeitems')[pid]); }
            else if ($(prow).data('freeitems')[vid] != undefined) { zQty += parseFloat($(prow).find("[name=txt_ItemQty]").val()) * parseFloat($(prow).data('freeitems')[vid]); }
        });
        if (zQty <= 0) $('#tritemId_' + $(row).data('id')).remove();
        else $(row).find("[name=txt_ItemQty]").val(zQty.toFixed(0));
    });
}
function calculateDiscountAcount() {
    freeQtyUpdate();
    let tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00, tax_sr_rate = parseFloat($('#hfTaxRate').data('srfee')) || 0.00;
    let zCartDisAmt = 0.00, perqty_discamt = 0.00, paid_qty = 0.00, zStateRecyclingAmt = 0.00;
    $('#billCoupon li.cart').each(function (index, li) {
        let zCouponAmt = parseFloat($(li).data('couponamt')) || 0.00;
        if ($(li).data('coupon').toString().toLowerCase().includes("tsjpillow")) {
            let cou_details = Coupon_get_discount_amount(0, 0, $(li).data('coupon').toString().toLowerCase(), zCouponAmt, 0, 0, 0);
            zCouponAmt = cou_details.disc_amt;
        }
        zCartDisAmt = zCartDisAmt + zCouponAmt;
        $(li).find("#cou_discamt").text(zCouponAmt.toFixed(2));
    });
    $("#order_line_items > tr.paid_item").each(function (index, row) { paid_qty += parseFloat($(row).find("[name=txt_ItemQty]").val()) || 0.00; });
    perqty_discamt = (zCartDisAmt / paid_qty).toFixed(2); perqty_discamt = perqty_discamt > 0 ? perqty_discamt : 0;
    //Without Coupon calculate
    $("#order_line_items > tr.paid_item").each(function (index, row) {
        let zQty = 0.00, zRegPrice = 0.00, zDisAmt = 0.00, zGrossAmount = 0.00;
        zQty = parseFloat($(row).find("[name=txt_ItemQty]").val()) || 0.00;
        zRegPrice = parseFloat($(row).find(".TotalAmount").data("regprice")) || 0.00;
        zGrossAmount = zRegPrice * zQty;
        if (zGrossAmount > 0) { zDisAmt = perqty_discamt * zQty; }
        else { zDisAmt = 0 }
        $(row).find(".TotalAmount").data("amount", zGrossAmount.toFixed(2)); $(row).find(".TotalAmount").text(zGrossAmount.toFixed(2));
        $(row).find(".RowDiscount").data("disctype", 'fixed'); $(row).find(".RowDiscount").data("couponamt", perqty_discamt);
        $(row).find(".RowDiscount").text(zDisAmt); $(row).find(".TotalAmount").data("discount", zDisAmt); $(row).find(".RowDiscount").data("lastdiscount", 0.00);
        zTotalTax = (zGrossAmount - zDisAmt) * tax_rate;
        $(row).find(".linetotal").text((zGrossAmount - zDisAmt).toFixed(2));
        $(row).find(".RowTax").text(zTotalTax.toFixed(2)); $(row).find(".TotalAmount").data("taxamount", zTotalTax.toFixed(2));
        let sr_fee = parseFloat($(row).data("srfee")) || 0.00, sristaxable = $(row).data("sristaxable");
        if (sristaxable) zStateRecyclingAmt += (zQty * sr_fee) + (zQty * sr_fee * tax_sr_rate)
        else zStateRecyclingAmt += (zQty * sr_fee);
    });
    $("#stateRecyclingFeeTotal").text(zStateRecyclingAmt.toFixed(2));
    $('#order_state_recycling_fee_line_items').find(".TotalAmount").text(zStateRecyclingAmt.toFixed(2));
    let is_sales = $("#billCoupon").find("[data-coupon='sales20off']").length;
    //Calculate discount
    $('#billCoupon li.items').each(function (index, li) {
        let cou_amt = 0.00, cou = $(li).data('coupon').toString().toLowerCase();
        let zCouponAmt = parseFloat($(li).data('couponamt')) || 0.00, zDiscType = $(li).data('disctype'), zType = $(li).data('type'), zQty = 0.00, zRegPrice = 0.00, zSalePrice = 0.00, zGrossAmount = 0.00, zDisAmt = 0.00;

        let rq_prd_ids = [], exclude_ids = [];
        if ($(li).data('excludeids') != "" && $(li).data('excludeids') != null) {
            exclude_ids = $(li).data('excludeids').toString().split(",").map((el) => parseInt(el));
        }
        if ($(li).data('rqprdids') != "" && $(li).data('rqprdids') != null) {
            rq_prd_ids = $(li).data('rqprdids').toString().split(",").map((el) => parseInt(el));
        }
        $("#order_line_items > tr.paid_item").each(function (index, row) {
            let pid = $(row).data('pid'), vid = $(row).data('vid'), row_perqty_discamt = 0.00, row_disc = 0.00;
            if (!exclude_ids.includes(pid) && !exclude_ids.includes(vid) && ((rq_prd_ids.includes(pid) || rq_prd_ids.includes(vid)) || rq_prd_ids == 0)) {
                row_perqty_discamt = parseFloat($(row).find(".RowDiscount").data("couponamt")) || 0.00;
                row_disc = parseFloat($(row).find(".RowDiscount").data("lastdiscount")) || 0.00;
                zQty = parseFloat($(row).find("[name=txt_ItemQty]").val()) || 0.00;
                zRegPrice = parseFloat($(row).find(".TotalAmount").data("regprice")) || 0.00;
                zSalePrice = parseFloat($(row).find(".TotalAmount").data("salerate")) || 0.00;
                zGrossAmount = zRegPrice * zQty;
                $(row).find(".TotalAmount").data("amount", zGrossAmount.toFixed(2)); $(row).find(".TotalAmount").text(zGrossAmount.toFixed(2));
                ////Coupun Type 'diff' and DiscType not equal '2x_percent' (CouponAmt = RegPrice - SalePrice)
                if (zType == 'diff' && is_sales == 0) {
                    if (zDiscType != '2x_percent') zCouponAmt = (zRegPrice - zSalePrice) > 0 ? (zRegPrice - zSalePrice) : 0.00;
                }
                else if (zType == 'diff' && is_sales > 0) zCouponAmt = 0.00;

                //else { zCouponAmt = 0.00; }
                let cou_details = Coupon_get_discount_amount((vid > 0 ? vid : pid), pid, cou, zCouponAmt, zQty, zRegPrice, zSalePrice);

                if (zDiscType == 'fixed_product') { zDisAmt = cou_details.disc_amt * cou_details.qty; }
                else if (zDiscType == 'fixed_cart') { zDisAmt = cou_details.disc_amt * cou_details.qty; }
                else if (zDiscType == 'percent') {
                    if (pid == 14023) zDisAmt = ((cou_details.price * cou_details.qty) - row_disc) * (cou_details.disc_amt / 100);
                    else zDisAmt = (cou_details.price * cou_details.qty) * (cou_details.disc_amt / 100);
                }
                else if (zDiscType == '2x_percent') { zDisAmt = ((zRegPrice * zCouponAmt) / 100) * Math.floor(zQty / 2); }
                //console.log(cou, cou_details, zDisAmt);
                //if (zDiscType == 'fixed_product') { zDisAmt = zCouponAmt * zQty; }
                //else if (zDiscType == 'fixed_cart') { zDisAmt = zCouponAmt * zQty; }
                //else if (zDiscType == 'percent') { zDisAmt = (zGrossAmount * zCouponAmt) / 100; }
                //else if (zDiscType == '2x_percent') { zDisAmt = ((zRegPrice * zCouponAmt) / 100) * Math.floor(zQty / 2); }

                //Coupon Amount Total                        
                cou_amt += zDisAmt;
                $(row).find(".RowDiscount").data("lastdiscount", (row_disc + zDisAmt));
                $(row).find(".TotalAmount").data("discount", zDisAmt.toFixed(2)); $(row).find(".RowDiscount").data("disctype", 'fixed');
                zDisAmt = row_disc + zDisAmt + (row_perqty_discamt * zQty);
                //$(row).find(".RowDiscount").data("couponamt", zDisAmt);
                $(row).find(".RowDiscount").text(zDisAmt.toFixed(2)); $(row).find(".linetotal").text((zGrossAmount - zDisAmt).toFixed(2));
                //Taxation                     
                zTotalTax = (zGrossAmount - zDisAmt) * tax_rate;
                $(row).find(".RowTax").text(zTotalTax.toFixed(2)); $(row).find(".TotalAmount").data("taxamount", zTotalTax.toFixed(2));
            }
        });
        //update Coupon Amount
        $(li).find("#cou_discamt").text(cou_amt.toFixed(2))
        if ($(li).data('type') == 'diff' && cou_amt > 0) $(li).removeClass('hidden');
        else if ($(li).data('type') == 'diff') $(li).addClass('hidden');
        //if (zDiscType == '2x_percent' && cou_amt > 0) $(li).removeClass('hidden');
        //else if (zDiscType == '2x_percent') $(li).addClass('hidden');
        //else if ($(li).data('type') == 'diff' && zDiscType != '2x_percent' && cou_amt <= 0) $(li).remove();
        //if (cou_amt == 0) $('#li_' + cou).remove();
        //if (cou_amt == 0) deleteAllCoupons(cou);
    });
    calcFinalTotals();
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Shipping Charges ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getItemShippingCharge(isFinalcal) {
    let p_ids = [], v_ids = [];
    $("#order_line_items  > tr.paid_item").each(function () { p_ids.push($(this).data('pid')); v_ids.push($(this).data('vid')); });
    if (p_ids.join(',').length > 0 || v_ids.join(',').length > 0) {
        $("#loader").show();
        let options = { strValue1: p_ids.join(','), strValue2: v_ids.join(','), strValue3: $("#ddlshipcountry").val(), strValue4: $("#ddlshipstate").val() };
        $(".TotalAmount").data("shippingamt", 0.00);

        $.when(GetSRTaxRate()).done(function () {
            if (options.strValue4 == '') return false;
            $.post('/Orders/GetProductShipping', options).then(response => {
                if (response != '') {
                    response = JSON.parse(response);
                    $("#order_line_items > tr.paid_item").each(function (index, tr) {
                        let proudct_item = response['Table'].find(el => el.vid === $(tr).data('vid'));
                        if (proudct_item != null) { $(tr).find(".TotalAmount").data("shippingamt", proudct_item.fee); }
                        else { $(tr).find(".TotalAmount").data("shippingamt", 0.00); }
                        let proudct_sr = response['Table1'].find(el => el.pid === $(tr).data('pid'));
                        if (proudct_sr != null) { $(tr).data("srfee", proudct_sr.fee); $(tr).data("sristaxable", !!parseInt(proudct_sr.is_taxable)); }
                        else { $(tr).data("srfee", 0.00); $(tr).data("sristaxable", false); }
                    });
                }
            }).then(response => { if (isFinalcal) calculateDiscountAcount(); }).catch(err => { $("#loader").hide(); swal('Error!', err, 'error'); }).always(function () { $("#loader").hide(); });
        });
    }
}
function calculateStateRecyclingFee() {
    let ship_state = $("#ddlshipstate").val(), tax_rate = parseFloat($('#hfTaxRate').val()) || 0.00;
    let zStateRecyclingAmt = 0.00, matCount = 0;
    $("#order_line_items > tr").each(function () {
        if (recycling_item.includes($(this).data('pid'))) { matCount = matCount + (parseInt($(this).find("[name=txt_ItemQty]").val()) || 0.00); }
    });

    if (ship_state == "CA") { zStateRecyclingAmt = matCount * 10.5; }
    else if (ship_state == "CT") { zStateRecyclingAmt = (matCount * 11.75) + (matCount * 11.75 * tax_rate); }
    else if (ship_state == "RI") { zStateRecyclingAmt = (matCount * 16) + (matCount * 16 * tax_rate); }
    $("#stateRecyclingFeeTotal").text(zStateRecyclingAmt.toFixed(2));
    $('#order_state_recycling_fee_line_items').find(".TotalAmount").text(zStateRecyclingAmt.toFixed(2));
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Post and Post Meta (Save/Update) ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function createPostMeta() {
    let oid = $('#hfOrderNo').val(), _total = $('#netPaymentTotal').text().replace('$', ''), _gift = parseFloat($('#giftCardTotal').text()) || 0.00;
    let postMetaxml = [];
    postMetaxml.push(
        { post_id: oid, meta_key: '_customer_user', meta_value: parseInt($('#ddlUser').val()) || 0 },
        { post_id: oid, meta_key: '_billing_company', meta_value: $('#txtbillcompany').val() }, { post_id: oid, meta_key: '_shipping_company', meta_value: $('#txtshipcompany').val() },
        { post_id: oid, meta_key: '_billing_first_name', meta_value: $('#txtbillfirstname').val() }, { post_id: oid, meta_key: '_billing_last_name', meta_value: $('#txtbilllastname').val() },
        { post_id: oid, meta_key: '_billing_address_1', meta_value: $('#txtbilladdress1').val() }, { post_id: oid, meta_key: '_billing_address_2', meta_value: $('#txtbilladdress2').val() },
        { post_id: oid, meta_key: '_billing_city', meta_value: $('#txtbillcity').val() }, { post_id: oid, meta_key: '_billing_state', meta_value: $('#ddlbillstate').val() },
        { post_id: oid, meta_key: '_billing_postcode', meta_value: $('#txtbillzipcode').val() }, { post_id: oid, meta_key: '_billing_country', meta_value: $('#ddlbillcountry').val() },
        { post_id: oid, meta_key: '_billing_email', meta_value: $('#txtbillemail').val() }, { post_id: oid, meta_key: '_billing_phone', meta_value: $('#txtbillphone').val().replace(/[^\d]/g, '') },
        { post_id: oid, meta_key: '_shipping_first_name', meta_value: $('#txtshipfirstname').val() }, { post_id: oid, meta_key: '_shipping_last_name', meta_value: $('#txtshiplastname').val() },
        { post_id: oid, meta_key: '_shipping_address_1', meta_value: $('#txtshipaddress1').val() }, { post_id: oid, meta_key: '_shipping_address_2', meta_value: $('#txtshipaddress2').val() },
        { post_id: oid, meta_key: '_shipping_city', meta_value: $('#txtshipcity').val() }, { post_id: oid, meta_key: '_shipping_state', meta_value: $('#ddlshipstate').val() },
        { post_id: oid, meta_key: '_shipping_postcode', meta_value: $('#txtshipzipcode').val() }, { post_id: oid, meta_key: '_shipping_country', meta_value: $('#ddlshipcountry').val() },
        { post_id: oid, meta_key: '_shipping_email', meta_value: '' }, { post_id: oid, meta_key: '_shipping_phone', meta_value: '' },
        { post_id: oid, meta_key: '_order_total', meta_value: _total }, { post_id: oid, meta_key: '_cart_discount', meta_value: $('#discountTotal').text().replace('$', '') },
        { post_id: oid, meta_key: '_cart_discount_tax', meta_value: '0' }, { post_id: oid, meta_key: '_order_shipping', meta_value: $('#shippingTotal').text().replace('$', '')  },
        { post_id: oid, meta_key: '_order_shipping_tax', meta_value: '0' }, { post_id: oid, meta_key: '_order_tax', meta_value: $('#salesTaxTotal').text().replace('$', '') },
        { post_id: oid, meta_key: '_gift_amount', meta_value: _gift, post_id: oid, meta_key: 'total_gcamt', meta_value: _gift }
    );
    if (_total == 0 && _gift > 0) { postMetaxml.push({ post_id: oid, meta_key: '_payment_method', meta_value: 'giftcard' }, { post_id: oid, meta_key: '_payment_method_title', meta_value: 'Gift Card' }); };
    if ($('#ddlStatus').val() == 'wc-on-hold') { postMetaxml.push({ post_id: oid, meta_key: '_release_date', meta_value: $('#txtReleaseDate').val() }); }
    else { postMetaxml.push({ post_id: oid, meta_key: '_release_date', meta_value: '' }); }
    return postMetaxml;
}
function createPostStatus() {
    console.log(parseInt($('#SubTotal').text()));
    // $('#SubTotal').text()
    let postStatus = {
        order_id: parseInt($('#hfOrderNo').val()) || 0, parent_id: 0, returning_customer: 0,
        customer_id: parseInt($('#ddlUser').val()) || 0,
        num_items_sold: $('#SubTotal').text().replace('$', ''),
        total_sales: $('#netPaymentTotal').text().replace('$', ''),
        tax_total: $('#salesTaxTotal').text(),
        shipping_total: $('#shippingTotal').text().replace('$', ''),
        net_total: $('#netPaymentTotal').text().replace('$', ''),
        status: $('#ddlStatus').val(), customer_notes: $('#txtCustomerNotes').val()
    };
    if (postStatus.net_total == 0) postStatus.status = 'wc-processing';
    return postStatus;
}
function createItemsList() {
    let _list = [], _itemmeta = [], oid = parseInt($('#hfOrderNo').val()) || 0, cid = parseInt($('#ddlUser').val()) || 0;
    let _taxes = []; _taxdata = { total: {}, subtotal: {} };
    //$('#order_final_total .tax-total').each(function (index, li) { _taxes.push({ label: $(li).data('name'), percent: parseFloat($(li).data('percent')) || 0 }); });
    //Add Product
    //$('#order_line_items > tr').each(function (index, tr) {
    //    let qty = parseFloat($(tr).find("[name=txt_ItemQty]").val()) || 0.00, rate = parseFloat($(tr).find(".TotalAmount").data('regprice')) || 0.00;
    //    let grossAmount = parseFloat($(tr).find(".TotalAmount").data('amount')) || 0.00, discountAmount = parseFloat($(tr).find(".RowDiscount").text()) || 0.00;
    //    let taxAmount = parseFloat($(tr).find(".TotalAmount").data('taxamount')) || 0.00, shippinAmount = parseFloat($(tr).find(".TotalAmount").data('shippingamt')) || 0.00;
    //    _itemmeta = [];
    //    if ($(tr).hasClass("gift_item")) { $.each($(tr).data('meta_data'), function (name, value) { _itemmeta.push({ key: name, value: value }); }); }
    //    _taxdata = { total: {}, subtotal: {} };
    //    $.each(_taxes, function (i, r) {
    //        _taxdata.total[r.label] = ((grossAmount - discountAmount) * r.percent).toFixed(4); _taxdata.subtotal[r.label] = ((grossAmount - discountAmount) * r.percent).toFixed(4);
    //    });
    //    //_list.push({
    //    //    order_item_id: $(tr).data('orderitemid'), PKey: index, order_id: oid, customer_id: cid, product_type: 'line_item', product_id: $(tr).data('pid'), variation_id: $(tr).data('vid'), product_name: $(tr).data('pname'), quantity: qty, sale_rate: rate, total: grossAmount, discount: discountAmount, tax_amount: taxAmount, shipping_amount: shippinAmount * qty, shipping_tax_amount: 0,
    //    //    order_itemmeta: _itemmeta, meta_data: serialize(_taxdata)
    //    //});
    //    _list.push({
    //        order_item_id: $(tr).data('orderitemid'), PKey: index, order_id: oid, customer_id: cid, product_type: 'line_item', product_id: $(tr).data('pid'), variation_id: $(tr).data('vid'), product_name: $(tr).data('pname'), quantity: qty, sale_rate: rate, total: grossAmount, discount: 0, tax_amount: 0, shipping_amount: 0, shipping_tax_amount: 0,
    //        order_itemmeta: _itemmeta, meta_data: serialize(_taxdata)
    //    });
    //});
    $('#line_items tr').each(function (index, tr) {
        let $row = $(this);
        let productid = $row.find('.parent-id').data('productid');
        let parentId = $row.find('.parent-id').data('parentid');
        let qty = parseFloat($row.find('input[name="txt_itemqty"]').val()), rate = parseFloat($(this).find(".product-price").data('price')) || 0.00;
        let grossAmount = parseFloat($(this).find(".row-total").data('total')) || 0.00, discountAmount =  0.00;
        //let taxAmount = parseFloat($(tr).find(".TotalAmount").data('taxamount')) || 0.00, shippinAmount = parseFloat($(tr).find(".TotalAmount").data('shippingamt')) || 0.00;
        _itemmeta = [];
        //if ($(tr).hasClass("gift_item")) { $.each($(tr).data('meta_data'), function (name, value) { _itemmeta.push({ key: name, value: value }); }); }
        //_taxdata = { total: {}, subtotal: {} };
        //$.each(_taxes, function (i, r) {
        //    _taxdata.total[r.label] = ((grossAmount - discountAmount) * r.percent).toFixed(4); _taxdata.subtotal[r.label] = ((grossAmount - discountAmount) * r.percent).toFixed(4);
        //}); 
        _list.push({
            order_item_id: $(tr).data('orderitemid'), PKey: index, order_id: oid, customer_id: cid, product_type: 'line_item', product_id: productid, variation_id: parentId, product_name: $(tr).data('pname'), quantity: qty, sale_rate: rate, total: grossAmount, discount: 0, tax_amount: 0, shipping_amount: 0, shipping_tax_amount: 0,
            order_itemmeta: _itemmeta, meta_data: serialize(_taxdata)
        });
    });

    //Add Coupon
    $('#billCoupon li').each(function (index, li) {
        let cou_amt = parseFloat($(this).find("#cou_discamt").text()) || 0.00;
        if (cou_amt > 0) _list.push({ order_item_id: parseInt($(li).data('orderitemid')), order_id: oid, product_name: $(li).data('coupon'), product_type: 'coupon', total: cou_amt });
    });
    //Add Gift Card
    //$('#billGiftCard li').each(function (index, li) {
    //    let gift_amt = parseFloat($(this).find("#gift_amt").text()) || 0.00;
    //    if (gift_amt > 0) _list.push({ order_item_id: parseInt($(li).data('orderitemid')), order_id: oid, product_id: $(li).data('id'), product_name: $(li).data('pn'), product_type: 'gift_card', total: gift_amt });
    //});
    //Add Fee
    //$('#order_fee_line_items > tr').each(function (index, tr) {
    //    _list.push({ order_item_id: parseInt($(tr).data('orderitemid')), order_id: oid, product_name: $(tr).data('pname'), product_type: 'fee', total: parseFloat($(tr).find(".TotalAmount").text()) || 0.00, tax_amount: 0 });
    //});
    //Add State Recycling Fee
    //_list.push({ order_item_id: parseInt($('#stateRecyclingFeeTotal').data('orderitemid')), order_id: oid, product_name: 'State Recycling Fee', product_type: 'fee', total: parseFloat($('#stateRecyclingFeeTotal').text()) || 0.00, tax_amount: parseFloat($('#hfTaxRate').data('srfee')) });
    //Add Shipping
    _list.push({ order_item_id: parseInt($('#shippingTotal').data('orderitemid')), order_id: oid, product_name: '', product_type: 'shipping', total: parseFloat($('#shippingTotal').text()) || 0.00 });
    //Add Tax
    //let is_freighttax = $('#hfFreighttaxable').val();
    //$('#order_final_total .tax-total').each(function (index, li) {
    //    let shipping_tax_amount = (is_freighttax === 'true') ? parseFloat($(li).data('percent')) || 0 : 0.0;
    //    _list.push({
    //        order_item_id: parseInt($(li).data('orderitemid')) || 0.00, order_id: oid, product_name: $(li).data('name'), meta_data: $(li).data('label'), product_type: 'tax', tax_rate_state: $('#ddlshipstate').val(), tax_amount: parseFloat($(li).data('percent')) || 0, total: parseFloat($(li).data('amount')) || 0, shipping_tax_amount: shipping_tax_amount
    //    });
    //});
    //let _taxRate = parseFloat($('#hfTaxRate').val()) || 0.00, sCountry = $('#ddlshipcountry').val(), sState = $('#ddlshipstate').val();
    //let is_freighttax = $('#hfFreighttaxable').val(); let shipping_tax_amount = (is_freighttax === 'true') ? _taxRate : 0.0;
    //_list.push({ order_item_id: parseInt($('#salesTaxTotal').data('orderitemid')) || 0.00, order_id: oid, product_name: sCountry + '-' + sState + '-' + sState + ' TAX-1', meta_data: sState + ' Tax', product_type: 'tax', tax_rate_state: sState, tax_amount: _taxRate, total: parseFloat($('#salesTaxTotal').text()) || 0.00, shipping_tax_amount: shipping_tax_amount });
    return _list;
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Save Details ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function ValidateData() {
    if ($('#txtbillfirstname').val() == '') { swal('Error!', 'Please Enter Billing First Name.', "error").then((result) => { $('#txtbillfirstname').focus(); return false; }); return false; }
    else if ($('#txtbilllastname').val() == '') { swal('Error!', 'Please Enter Billing Last Name.', "error").then((result) => { $('#txtbilllastname').focus(); return false; }); return false; }
    else if ($('#txtbilladdress1').val() == '') { swal('Error!', 'Please Enter Billing Address.', "error").then((result) => { $('#txtbilladdress1').focus(); return false; }); return false; }
    else if ($('#txtbillzipcode').val() == '') { swal('Error!', 'Please Enter Billing Post Code.', "error").then((result) => { $('#txtbillzipcode').focus(); return false; }); return false; }
    else if ($('#txtbillcity').val() == '') { swal('Error!', 'Please Enter Billing City.', "error").then((result) => { $('#txtbillcity').focus(); return false; }); return false; }
    else if ($('#ddlbillcountry').val() == '') { swal('Error!', 'Please Select Billing Country.', "error").then((result) => { $('#ddlbillcountry').select2('open'); return false; }); return false; }
    else if ($('#ddlbillstate').val() == '' || $('#ddlbillstate').val() == '0') { swal('Error!', 'Please Select Billing State.', "error").then((result) => { $('#ddlbillstate').select2('open'); return false; }); return false; }
    else if ($('#txtbillemail').val() == '') { swal('Error!', 'Please Select Billing EMail Address.', "error").then((result) => { $('#txtbillemail').focus(); return false; }); return false; }
    else if ($('#txtshipfirstname').val() == '') { swal('Error!', 'Please Enter Shipping First Name.', "error").then((result) => { $('#txtshipfirstname').focus(); return false; }); return false; }
    else if ($('#txtshiplastname').val() == '') { swal('Error!', 'Please Enter Shipping Last Name.', "error").then((result) => { $('#txtshiplastname').focus(); return false; }); return false; }
    else if ($('#txtshipaddress1').val() == '') { swal('Error!', 'Please Enter Shipping Address.', "error").then((result) => { $('#txtshipaddress1').focus(); return false; }); return false; }
    else if ($('#txtshipzipcode').val() == '') { swal('Error!', 'Please Enter Shipping Post Code.', "error").then((result) => { $('#txtshipzipcode').focus(); return false; }); return false; }
    else if ($('#txtshipcity').val() == '') { swal('Error!', 'Please Enter Shipping City.', "error").then((result) => { $('#txtshipcity').focus(); return false; }); return false; }
    else if ($('#ddlshipcountry').val() == '') { swal('Error!', 'Please Select Shipping Country.', "error").then((result) => { $('#ddlshipcountry').select2('open'); return false; }); return false; }
    else if ($('#ddlshipstate').val() == '' || $('#ddlshipstate').val() == '0') { swal('Error!', 'Please Select Shipping State.', "error").then((result) => { $('#ddlshipstate').select2('open'); return false; }); return false; }
    return true;
}


function gettotaldetails() {
    let cartItems = []; // Initialize an empty array to store cart items 

    $('#line_items tr').each(function () {
        const $row = $(this);
        const parentId = $row.find('.parent-id').data('parentid');
        const productid = $row.find('.parent-id').data('productid');
        const itemQuantity = parseFloat($row.find('input[name="txt_itemqty"]').val()); // Get value by name

        if (parentId > 0) {
            //variation
            cartItems.push({
                id: parentId,
                quantity: itemQuantity,
                add_core_price: false,
                variation_id: productid
            });
        }
        else {
            // simple
            cartItems.push({
                id: productid,
                quantity: itemQuantity,
                add_core_price: false,
                variation_id: 0
            });
        }

        // Create a cart item object and add it to the cartItems array 
        //cartItems.push({
        //    id: productid,
        //    quantity: itemQuantity,
        //    variation_id: parentId
        //});
    });

    console.log(cartItems);


    let cartResponse = {
        message: "Your message",
        status: 200, // Example status code
        code: "ABC123",
        data: {
            //// Fill in the properties of the CartDataResponse object here
            //// Example: shipping_address 
            shipping_address: {
                first_name: $("#txtshipfirstname").val(),
                last_name: $("#txtshiplastname").val(),
                email: $("#txtbillemail").val(),
                company: $("#txtshipcompany").val(),
                phone: $("#txtbillphone").val(),
                address_1: $("#txtshipaddress1").val(),
                address_2: $("#txtshipaddress2").val(),
                city: $("#txtshipcity").val(),
                state: $("#ddlshipstate").val(),
                postcode: $("#txtshipzipcode").val(),
                country: $("#ddlshipcountry").val()
            },
            //shipping_rate: {
            //    amount: "0"
            //},
            //cart_totals: {

            //    subtotal: $("#SubTotal").text().replace('$', ''),
            //    subtotal_tax: "0",
            //    discount_total: "0",
            //    discount_tax: "0",
            //    cart_contents_total: "0",
            //    cart_contents_tax: "0",
            //    fee_total: "0",
            //    fee_tax: "0",
            //    shipping_total: "0",
            //    shipping_tax: "0",
            //    total: $("#orderTotal").text().replace('$', ''),
            //    total_tax: $("#salesTaxTotal").text().replace('$', '')
            //},
            items: cartItems // Add the array of items to the data object
        }
    };

    let option = {
        objs: cartResponse,
        product_id: 0,
        vendor_id: 24,
        session_id: $("#hfsession_id").val()
    };
    $.ajax({
        //type: "Post", url: '/Quickorder/getshipping', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option),
        type: "Post", url: '/Quickorder/getshippingdetails', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option),
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            console.log(data);
            var row = data[0];
            // $("#hfsession_id").val('0');
            if (Array.isArray(data) && data.length === 1) {
                const item = data[0];
                const subprice = item.subprice;
                const totalTtc = item.total_ttc;
                let refund = parseFloat($("#refundedTotal").text()) || 0.00;
                console.log(`Subprice: ${subprice}`);
                console.log(`Total TTC: ${totalTtc}`);
                $("#otherTotal").text(""); $("#otherTotal").html("");
                $("#SubTotal").text(formatCurrency(item.subprice)); $("#SubTotal").data('total', item.subprice);
                $("#otherTotal").text(formatCurrency(totalTtc)); $("#otherTotal").data('total', totalTtc);
                //$("#totalQty").text(formatCurrency(tGrossAmt));
                //$("#discountTotal").text(formatCurrency('0')); $("#discountTotal").data('total', '0');
                $("#discountTotal").text(formatCurrency(item.discount)); $("#discountTotal").data('total', item.discount);
                $("#salesTaxTotal").text(formatCurrency(item.total_localtax1)); $("#salesTaxTotal").data('total', item.total_localtax1);
                $("#shippingTotal").text(formatCurrency(item.total_localtax2)); $("#shippingTotal").data('total', item.total_localtax2);
                $("#netPaymentTotal").text(formatCurrency(totalTtc + refund)); $("#netPaymentTotal").data('total', totalTtc + refund);
                $("#hfsession_id").val(item.product_sku);

                var dropdown = $("#ddlShipping");

                // Get the first item from jsonData (assuming there's only one item)
                var product = data[0];

                // Get the ShippingMethods array from the product
                var shippingMethods = product.ShippingMethods;
                //console.log(shippingMethods[0].method_id);
                if (shippingMethods && Array.isArray(shippingMethods)) {
                    dropdown.empty();
                    // Loop through the shipping methods and create options for the dropdown
                    shippingMethods.forEach(function (method) {
                        // Create an option element
                        var option = $("<option>");

                        // Set the option's value to the method_id (you can use method_id as the value)
                        option.val(method.method_id);

                        // Set the option's text to include method_title and amount
                        option.text(method.method_title + " - $" + method.amount);

                        // Add data attributes for method_id, method_title, and amount
                        option.attr("data-method_id", method.method_id);
                        option.attr("data-method_title", method.method_title);
                        option.attr("data-amount", method.amount);

                        // Append the option to the dropdown
                        dropdown.append(option);
                    });

                    // Optionally, you can select the first option by default
                    if (shippingMethods.length > 0 && shippingMethods[0].hasOwnProperty('method_id')) {
                       
                        dropdown.val(shippingMethods[0].method_id);
                    } else {
                        dropdown.empty(); // Clear the dropdown
                        dropdown.append('<option value="default">No shipping methods available.</option>');
                    }
                  
                }
                else {
                    // Handle the case where shippingMethods is undefined or not an array
                    console.error('Shipping methods are not available.');
                    // You can provide a default behavior, for example:
                    dropdown.empty(); // Clear the dropdown
                    dropdown.append('<option value="default">No shipping methods available</option>');
                }

            }

            //if (row.shipping_total > 0) { 
            //$("#hfshippingfreight").val(row.subprice);
            //}


        },
        complete: function () { $("#loader").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
        async: true
    });
}


function gettotaldetailsfromif(product_id, parent_id, quantity) {
    let cartItems = []; // Initialize an empty array to store cart items 
    //$('#line_items').empty();
    let cartResponse = {
        data: {
            //// Fill in the properties of the CartDataResponse object here
            //// Example: shipping_address 
            shipping_address: {
                first_name: $("#txtshipfirstname").val(),
                last_name: $("#txtshiplastname").val(),
                email: $("#txtbillemail").val(),
                company: $("#txtshipcompany").val(),
                phone: $("#txtbillphone").val(),
                address_1: $("#txtshipaddress1").val(),
                address_2: $("#txtshipaddress2").val(),
                city: $("#txtshipcity").val(),
                state: $("#ddlshipstate").val(),
                postcode: $("#txtshipzipcode").val(),
                country: $("#ddlshipcountry").val()
            },
            items: [{
                id: (parent_id > 0 ? parent_id : product_id),
                variation_id: (parent_id > 0 ? product_id : 0) ,
                quantity: quantity,
                add_core_price: false                
            }]
        }
    };

    let option = {
        objs: cartResponse,
        product_id: 0,
        vendor_id: 24,
        session_id: $("#hfsession_id").val()
    };
    $.ajax({
        type: "Post", url: '/Quickorder/addproductitem', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option),
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            console.log(data.data.items);
            let itemHtml = '';
            $('#line_items').empty(); 
            $.each(data.data.items, function (key, row) {
                //console.log(i, row)
                 //itemHtml = '<tr id="tritemid_' + i + '">';
                 itemHtml = '<tr id="tritemid_' + i + '"  data-pid="' + row.id + '" data-pname="' + row.name + '" data-psku="' + row.sku + '">'; 
                //if (row.is_free) itemHtml += '<td class="text-center"></td>';
                itemHtml += '<td class="text-center"><button class="btn p-0 text-red btnDeleteItem billinfo" onclick="removeItems(\'' + row.id + '\', \'' + row.variation_id + '\', \'' + row.quantity + '\');" data-toggle="tooltip" title="Delete product"> <i class="glyphicon glyphicon-trash"></i> </button></td>';
                itemHtml += '<td class="product-name" data-name="' + row.name + '">' + row.name + '</td><td>' + row.sku + '</td>';
                itemHtml += '<td class="text-right product-price" data-price="' + row.price + '">' + row.price + '</td>';
                //itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + row.fk_product + '" value="' + row.subprice.toFixed(2) + '" name="txt_itemprice" placeholder="Price"></td>';
                itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemqty_' + row.id + '" value="' + row.quantity + '" name="txt_itemqty" placeholder="Qty."></td>';
                //itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemdisc_' + row.fk_product + '" value="' + row.discount_percent.toFixed(2) + '" name="txt_itemdisc" placeholder="Discount"></td>';
                //itemHtml += '<td class="text-right product-desc">' + row.discount_percent.toFixed(2) + '</td>';
                //itemHtml += '<td class="text-right tax-amount" data-tax1="' + row.localtax1_tx + '" data-tax2="' + row.localtax2_tx + '">' + row.total_localtax1 + '</td>';
                itemHtml += '<td style="display:none" class="text-right parent-id" data-parentid="' + row.variation_id + '" data-productid="' + row.id + '"></td>';
                itemHtml += '<td class="text-right row-total" data-total="' + row.line_subtotal.toFixed(2) + '">' + formatCurrency(row.line_subtotal) + '</td>';
                itemHtml += '</tr>';
                $('#line_items').append(itemHtml);
            });
            
          
            $("#hfsession_id").val(data.data.session_id);
            console.log(data.data.session_id);
            //var row = data[0];
            //// $("#hfsession_id").val('0');
            //if (Array.isArray(data) && data.length === 1) {
            //    const item = data[0];
                

            //    let itemHtml = '';
            //    if (data.length > 0) {
            //        $.each(data, function (key, row) {
            //            if (row.fk_product > 0) {
            //                if ($('#tritemid_' + row.fk_product).length <= 0) {
            //                    itemHtml += '<tr id="tritemid_' + row.fk_product + '" class="' + (row.is_free ? 'free_item' : 'paid_item') + '" data-pid="' + row.fk_product + '" data-pname="' + row.description + '" data-psku="' + row.product_sku + '" data-rowid="' + row.rowid + '" data-freeitems=\'' + row.free_itmes + '\'>';
            //                    if (row.is_free) itemHtml += '<td class="text-center"></td>';
            //                    else itemHtml += '<td class="text-center"><button class="btn p-0 text-red btnDeleteItem billinfo" onclick="removeItems(\'' + row.fk_product + '\', \'' + vender_id + '\', \'' + row.qty + '\');" data-toggle="tooltip" title="Delete product"> <i class="glyphicon glyphicon-trash"></i> </button></td>';
            //                    itemHtml += '<td class="product-name" data-name="' + row.description + '">' + row.description + '</td><td>' + row.product_sku + '</td>';
            //                    itemHtml += '<td class="text-right product-price" data-price="' + row.subprice + '">' + row.subprice + '</td>';
            //                    //itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + row.fk_product + '" value="' + row.subprice.toFixed(2) + '" name="txt_itemprice" placeholder="Price"></td>';
            //                    itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemqty_' + row.fk_product + '" value="' + row.qty + '" name="txt_itemqty" placeholder="Qty."></td>';
            //                    //itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemdisc_' + row.fk_product + '" value="' + row.discount_percent.toFixed(2) + '" name="txt_itemdisc" placeholder="Discount"></td>';
            //                    //itemHtml += '<td class="text-right product-desc">' + row.discount_percent.toFixed(2) + '</td>';
            //                    //itemHtml += '<td class="text-right tax-amount" data-tax1="' + row.localtax1_tx + '" data-tax2="' + row.localtax2_tx + '">' + row.total_localtax1 + '</td>';
            //                    itemHtml += '<td style="display:none" class="text-right parent-id" data-parentid="' + vender_id + '" data-productid="' + row.fk_product + '"></td>';
            //                    itemHtml += '<td class="text-right row-total" data-total="' + row.total_ttc.toFixed(2) + '">' + formatCurrency(row.total_ttc) + '</td>';
            //                    itemHtml += '</tr>';
            //                }
            //                else { $('#txt_itemqty_' + row.rowid).val((parseFloat($('#txt_itemqty_' + row.rowid).val()) + row.qty).toFixed(2)); }
            //            }
            //        });

            //        $('#line_items').append(itemHtml); $("#divAddItemFinal").find(".rowCalulate").change(function (e) {
            //            //let _freeitems = $(this).closest('tr').data('freeitems'), _qty = parseInt($(this).closest('tr').find("[name=txt_itemqty]").val()) || 0;
            //            //$.each(_freeitems, function (key, value) { $('#tritemid_' + key).find("[name=txt_itemqty]").val((parseInt(value) || 0) * _qty); });



            //            //calculateFinal();
            //        });
            //    }
            //    calculateFinal();


            //}

            ////if (row.shipping_total > 0) { 
            ////$("#hfshippingfreight").val(row.subprice);
            ////}


        },
        complete: function () { $("#loader").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
        async: true
    });
    $("#btnpriceorder").show();
    $("#btnCheckout").hide();

}



function gettotaldetailsedit() {
    let cartItems = []; // Initialize an empty array to store cart items  
    $('#line_items tr').each(function () {
        const $row = $(this);
        const parentId = $row.find('.parent-id').data('parentid');
        const productid = $row.find('.parent-id').data('productid');
        const itemQuantity = parseFloat($row.find('input[name="txt_itemqty"]').val()); // Get value by name 
        console.log(parentId, productid, itemQuantity);
        // Create a cart item object and add it to the cartItems array  
        if (parentId > 0) {
            //variation
            cartItems.push({
                id: parentId,
                quantity: itemQuantity,
                add_core_price: false,
                variation_id: productid
            });
        }
        else {
            // simple
            cartItems.push({
                id: productid,
                quantity: itemQuantity,
                add_core_price: false,
                variation_id: 0
            });
        }
        //cartItems.push({
        //    id: productid,
        //    quantity: itemQuantity,
        //    variation_id: parentId
        //}); 
    });
    console.log(cartItems);
    let cartResponse = {
        message: "Your message",
        status: 200, // Example status code
        code: "ABC123",
        data: {
            //// Fill in the properties of the CartDataResponse object here
            //// Example: shipping_address 
            shipping_address: {
                first_name: $("#txtshipfirstname").val(),
                last_name: $("#txtshiplastname").val(),
                email: $("#txtbillemail").val(),
                company: $("#txtshipcompany").val(),
                phone: $("#txtbillphone").val(),
                address_1: $("#txtshipaddress1").val(),
                address_2: $("#txtshipaddress2").val(),
                city: $("#txtshipcity").val(),
                state: $("#ddlshipstate").val(),
                postcode: $("#txtshipzipcode").val(),
                country: $("#ddlshipcountry").val()
            },
            items: cartItems
        }
    };
    let option = {
        objs: cartResponse,
        product_id: 0,
        vendor_id: 24,
        session_id: $("#hfsession_id").val()
    };
    $.ajax({
        type: "Post", url: '/Quickorder/addproduct', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option),
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            console.log(data);
            var row = data[0];
            // $("#hfsession_id").val('0');
            if (Array.isArray(data) && data.length === 1) {
                const item = data[0];
                $("#hfsession_id").val(item.product_sku);
                console.log($("#hfsession_id").val(), item.product_sku);
                //$("#divtotal").hide();
                let dataCouponValue = '';
                $("ul#billCoupon li").each(function () {
                    dataCouponValue = $(this).data("coupon");
                    console.log(dataCouponValue);
                    let option = {
                        code: dataCouponValue,
                        session_id: $("#hfsession_id").val()
                    };
                    $.ajax({
                        type: "Post", url: '/Quickorder/applycoupon', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option),
                        beforeSend: function () { $("#loader").show(); },
                        success: function (data) {
                            console.log(data);
                            var row = data[0];

                        },
                        complete: function () { $("#loader").hide(); },
                        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
                        async: true
                    });
                });

                //let option = {
                //    code: dataCouponValue,
                //    session_id: $("#hfsession_id").val()
                //};
                //$.ajax({
                //    type: "Post", url: '/Quickorder/applycoupon', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option),
                //    beforeSend: function () { $("#loader").show(); },
                //    success: function (data) {
                //        console.log(data);
                //        var row = data[0];

                //    },
                //    complete: function () { $("#loader").hide(); },
                //    error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
                //    async: true
                //});

            }
        },
        complete: function () { $("#loader").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
        async: true
    });
}


function getshippingtotaldetails(methodId, methodTitle, amount) {
    console.log(methodId, methodTitle, amount);
    let option = {
        methodId: methodId,
        methodTitle: methodTitle,
        amount: amount,
        session_id: $("#hfsession_id").val()
    };
    $.ajax({
        type: "Post", url: '/Quickorder/getshippingmethod', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option),
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            console.log(data);
            var row = data[0];
            if (Array.isArray(data) && data.length === 1) {
                const item = data[0];
                const subprice = item.subprice;
                const totalTtc = item.total_ttc;
                console.log(`Subprice: ${subprice}`);
                console.log(`Total TTC: ${totalTtc}`);
                $("#otherTotal").text(""); $("#otherTotal").html("");
                $("#SubTotal").text(formatCurrency(item.subprice)); $("#SubTotal").data('total', item.subprice);
                $("#otherTotal").text(formatCurrency(totalTtc)); $("#otherTotal").data('total', totalTtc);
                //$("#totalQty").text(formatCurrency(tGrossAmt));
                //$("#discountTotal").text(formatCurrency('0')); $("#discountTotal").data('total', '0');
                $("#discountTotal").text(formatCurrency(item.discount)); $("#discountTotal").data('total', item.discount);
                $("#salesTaxTotal").text(formatCurrency(item.total_localtax1)); $("#salesTaxTotal").data('total', item.total_localtax1);
                $("#shippingTotal").text(formatCurrency(item.total_localtax2)); $("#shippingTotal").data('total', item.total_localtax2);
                $("#netPaymentTotal").text(formatCurrency(totalTtc)); $("#netPaymentTotal").data('total', totalTtc);
            }

        },
        complete: function () { $("#loader").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
        async: true
    });
}


function saveCO() {

    let oid = parseInt($('#hfOrderNo').val()) || 0;
    if (oid > 0) {
        updateCO();
    }
    else {
        let cartResponse = {
            message: "Your message",
            status: 200, // Example status code
            code: "ABC123",
            data: {
                //// Fill in the properties of the CartDataResponse object here
                //// Example: shipping_address 
                email: $("#txtbillemail").val(),
                billing: {
                    first_name: $("#txtbillfirstname").val(),
                    last_name: $("#txtbilllastname").val(),
                    email: $("#txtbillemail").val(),
                    company: $("#txtbillcompany").val(),
                    phone: $("#txtbillphone").val(),
                    address_1: $("#txtbilladdress1").val(),
                    address_2: $("#txtbilladdress2").val(),
                    city: $("#txtbillcity").val(),
                    state: $("#ddlbillstate").val(),
                    postcode: $("#txtbillzipcode").val(),
                    country: $("#ddlbillcountry").val()
                },
                shipping: {
                    first_name: $("#txtshipfirstname").val(),
                    last_name: $("#txtshiplastname").val(),
                    email: $("#txtbillemail").val(),
                    company: $("#txtshipcompany").val(),
                    phone: $("#txtbillphone").val(),
                    address_1: $("#txtshipaddress1").val(),
                    address_2: $("#txtshipaddress2").val(),
                    city: $("#txtshipcity").val(),
                    state: $("#ddlshipstate").val(),
                    postcode: $("#txtshipzipcode").val(),
                    country: $("#ddlshipcountry").val()
                },
                order_notes: $("#add_order_note").val(),
                session_id: $("#hfsession_id").val(),
                //user_id: '',
                //payment_method: 'authorize_net_cim_credit_card',
                //  payment_method_title: 'Credit Card',
                //card_data: {
                //    card_number: '4111111111111111',
                //    expiry: {
                //        month: '12',
                //        year: '2023',
                //    },
                //    csc: '123',
                //}
            }
        };
        //let oid = parseInt($('#hfOrderNo').val()) || 0;
        let option = {
            objs: cartResponse,
            product_id: 0,
            vendor_id: oid,
        };
        console.log(option);
        $.ajax({
            type: "Post", url: '/Quickorder/paymentorder', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option),
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                const status = data[0];
                console.log(data, status);
                //swal('Success!', status.description, 'success');
                if (status.fk_product == 0) {
                    $("#btnPlaceOrder").hide();
                    swal('Error', status.description, "error");
                }
                else {
                    $("#btnPlaceOrder").show();
                    $('#hfOrderNo').val(status.fk_product);
                    //swal('Error', status.description, "error");
                    swal('Success!', status.description, 'success');
                }

                //$("#billModal").modal('hide'); $('.billinfo').prop("disabled", true);
                $("#loader").hide();
            },
            error: function (xhr, status, err) { alert(err); },
            complete: function () { $("#loader").hide(); },
        })
        $('#btnCheckout').prop("disabled", true); $('.billinfo').prop("disabled", true); $('#btnCheckout').text("Waiting...");
        //$.ajax({
        //    type: "POST", contentType: "application/json; charset=utf-8",
        //    url: "/OrdersMySQL/SaveCustomerOrder",
        //    data: JSON.stringify(obj), dataType: "json", beforeSend: function () { $("#loader").show(); },
        //    success: function (result) {
        //        if (result.status) {
        //            if (postStatus.net_total > 0) PaymentModal(); else successModal('Gift Card', '', true, true);
        //            //$('#order_line_items,#order_state_recycling_fee_line_items,#order_fee_line_items,#order_shipping_line_items,#order_refunds,#billCoupon,#billGiftCard,.refund-action').empty();
        //            //$.when(getOrderItemList(oid), getItemShippingCharge(false)).done(function () { if (postStatus.net_total > 0) PaymentModal(); else successModal('Gift Card', '', true, true); });
        //        }
        //        else { swal('Error', 'Something went wrong, please try again.', "error").then((result) => { return false; }); }
        //    },
        //    error: function (xhr, status, err) { $("#loader").hide(); $('#btnCheckout').prop("disabled", false); $('.billinfo').prop("disabled", false); alert(err); },
        //    complete: function () { $("#loader").hide(); $('#btnCheckout').prop("disabled", false); $('.billinfo').prop("disabled", false); $('#btnCheckout').text("Checkout"); isEdit(false); },
        //});
        PaymentModal();
    }
    $('#btnCheckout').text("Checkout");
    return false;
}
function updateCO() {

    let oid = parseInt($('#hfOrderNo').val()) || 0;
    if (!ValidateData()) { $("#loader").hide(); return false };
    let postMeta = createPostMeta(), postStatus = createPostStatus(), itemsDetails = createItemsList();

    //if (postStatus.num_items_sold <= 0) { swal('Error!', 'Please add product.', "error").then((result) => { $('#ddlProduct').select2('open'); return false; }); return false; }
    let obj = { order_id: oid, OrderPostMeta: postMeta, s_address_2: $("#hfsession_id").val(), OrderPostStatus: postStatus};
     console.log(obj);
    swal.queue([{
        title: '', confirmButtonText: 'Yes, Update it!', text: "Do you want to update your order?",
        showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                $.post('/OrdersMySQL/SaveCustomerOrder', obj).done(function (result) {
                    if (result.status) {
                        //$('#order_line_items,#order_state_recycling_fee_line_items,#order_fee_line_items,#order_shipping_line_items,#order_refunds,#billCoupon,.refund-action').empty();
                        //swal('Success', 'Order updated successfully.', "success");
                        $.when(UpdateOrders()).done(function () {
                            //getOrderInfo(); $('[data-toggle="tooltip"]').tooltip();
                            swal('Success', 'Order updated successfully.').then((result) => {
                                let status = $('#ddlStatus').val();
                                console.log(status);
                                if (status == 'wc-pending') {
                                    PaymentModal();
                                }
                                else {
                                    location.href = '../../OrdersMySQL/OrdersHistory';
                                }
                                
                                //location.href = '../../OrdersMySQL/OrdersHistory';  ddlStatus wc-pending
                            });
                        });
                    }
                    else { swal('Error', 'Something went wrong, please try again.', "error"); }
                }).catch(err => { swal.hideLoading(); swal('Error!', 'Something went wrong, please try again.', 'error'); });
            });
        }
    }]);
    return false;
}


function updateODS() {

    let oid = parseInt($('#hfOrderNo').val()) || 0;
    if (!ValidateData()) { $("#loader").hide(); return false };
    let postMeta = createPostMeta(), postStatus = createPostStatus(), itemsDetails = createItemsList();

    //if (postStatus.num_items_sold <= 0) { swal('Error!', 'Please add product.', "error").then((result) => { $('#ddlProduct').select2('open'); return false; }); return false; }
    let obj = { order_id: oid, OrderPostMeta: postMeta, s_address_2: $("#hfsession_id").val(), OrderPostStatus: postStatus };
    console.log(obj);
    swal.queue([{
        title: '', confirmButtonText: 'Yes, Update it!', text: "Do you want to update your order?",
        showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                $.post('/OrdersMySQL/UpdateCustomerOrder', obj).done(function (result) {
                    if (result.status) {
                        //$('#order_line_items,#order_state_recycling_fee_line_items,#order_fee_line_items,#order_shipping_line_items,#order_refunds,#billCoupon,.refund-action').empty();
                        //swal('Success', 'Order updated successfully.', "success");
                        $.when(UpdateOrders()).done(function () {
                            //getOrderInfo(); $('[data-toggle="tooltip"]').tooltip();
                            swal('Success', 'Order updated successfully.').then((result) => {
                                let status = $('#ddlStatus').val();
                                console.log(status);
                                if (status == 'wc-pending') {
                                    PaymentModal();
                                }
                                else {
                                    location.href = '../../OrdersMySQL/OrdersHistory';
                                }

                                //location.href = '../../OrdersMySQL/OrdersHistory';  ddlStatus wc-pending
                            });
                        });
                    }
                    else { swal('Error', 'Something went wrong, please try again.', "error"); }
                }).catch(err => { swal.hideLoading(); swal('Error!', 'Something went wrong, please try again.', 'error'); });
            });
        }
    }]);
    return false;
}


function UpdateOrders() {
    $.get('/OrdersMySQL/order-import', {}).then(response => { console.log('Done'); }).catch(err => { }).always(function () { });
    //$.get('/OrdersMySQL/giftcard-import', {}).then(response => { }).catch(err => { }).always(function () { });
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Payment Modal ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function PaymentModal() {
    let pay_by = $('#lblOrderNo').data('pay_by').trim();//$('#lblOrderNo').data('pay_by').trim() > 0 ? $('#lblOrderNo').data('pay_by').trim() : 'podium';
    let billing_company = $('#txtbillcompany').val();
    let billing_first_name = $('#txtbillfirstname').val(), billing_last_name = $('#txtbilllastname').val();
    let billing_address_1 = $('#txtbilladdress1').val(), billing_address_2 = $('#txtbilladdress2').val();
    let billing_city = $('#txtbillcity').val(), billing_state = $('#ddlbillstate').val(), billing_postcode = $('#txtbillzipcode').val(), billing_country = $('#ddlbillcountry').val();
    let billing_phone = $('#txtbillphone').val(), billing_email = $('#txtbillemail').val();

    let shipping_first_name = $('#txtshipfirstname').val(), shipping_last_name = $('#txtshiplastname').val();
    let shipping_company = $('#txtshipcompany').val();
    let shipping_address_1 = $('#txtshipaddress1').val(), shipping_address_2 = $('#txtshipaddress2').val();
    let shipping_city = $('#txtshipcity').val(), shipping_state = $('#ddlshipstate').val(), shipping_postcode = $('#txtshipzipcode').val(), shipping_country = $('#ddlshipcountry').val();
    let pay_mathod = $('#lblOrderNo').data('pay_option');
    var myHtml = '';
    //header
    myHtml += '<div class="modal-dialog modal-lg">';
    myHtml += '<div class="modal-content">';
    myHtml += '<div class="modal-header">';
    myHtml += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>';
    myHtml += '<h4 class="modal-title" id="myModalLabel">Order #' + $('#hfOrderNo').val() + '</h4>';
    myHtml += '</div>';
    myHtml += '<div class="modal-body no-padding" >';
    myHtml += '<section class="invoice no-margin">';
    /// row invoice-info
    myHtml += '<div class="row invoice-info">';
    myHtml += '<div class="col-sm-6 invoice-col">';
    myHtml += 'Billing Address: <address class="no-margin"><strong>' + billing_first_name + ' ' + billing_last_name + '</strong > <br>' + billing_company + (billing_company.length > 0 ? '<br>' : '') + billing_address_1 + (billing_address_2.length > 0 ? '<br>' : '') + billing_address_2 + '<br>' + billing_city + ', ' + billing_state + ' ' + billing_postcode + ' ' + billing_country + '<br>Phone: ' + billing_phone + '<br>Email: ' + billing_email + '</address>';
    myHtml += '</div>';
    myHtml += '<div class="col-sm-6 invoice-col">';
    myHtml += 'Shipping Address: <address class="no-margin"><strong>' + shipping_first_name + ' ' + shipping_last_name + '</strong > <br>' + shipping_company + (shipping_company.length > 0 ? '<br>' : '') + shipping_address_1 + (shipping_address_2.length > 0 ? '<br>' : '') + shipping_address_2 + '<br>' + shipping_city + ', ' + shipping_state + ' ' + shipping_postcode + ' ' + shipping_country + '</address>';
    myHtml += '</div>';
    myHtml += '</div>';
    /// row invoice-items
    myHtml += '<div class="row">';
    myHtml += '<div class="col-xs-12 table-responsive">';
    myHtml += '<table class="table table-striped" id="tblmodalitems">';
    myHtml += '<thead>';
    myHtml += '<tr>';
    myHtml += '<th style="width: 40%">Product</th>';
    myHtml += '<th style="width: 15%" class="text-right">Qty.</th>';
    myHtml += '<th style="width: 15%" class="text-right">Sub-Total</th>';
    //myHtml += '<th style="width: 15%" class="text-right">Discount</th>';
    //myHtml += '<th style="width: 15%" class="text-right">Tax</th>';
    myHtml += '</tr>';
    myHtml += '</thead>';
    myHtml += '<tbody></tbody>';
    myHtml += '</table>';
    myHtml += '</div>';
    myHtml += '<div class="col-xs-12 text-right" id="tblmodalTotal"></div>';
    myHtml += '</div>';

    myHtml += '</section>';
    myHtml += '</div>';

    myHtml += '<div class="modal-footer">';
    myHtml += '<div class="col-md-3">';
    myHtml += '<div class="input-group">';
    myHtml += '<span class="input-group-btn"  >';
    myHtml += '<select class="form-control select2" id="ddlPaymentMethod" style="width: auto;">';
    for (let i = 0; i < pay_mathod.length; i++) {
        myHtml += '<option value="' + pay_mathod[i].id + '">' + pay_mathod[i].text + '</option>';
    }
    myHtml += '</select>';
    myHtml += '</span>';
    myHtml += '</div>';
    myHtml += '</div>';

    myHtml += '<div class="col-md-6 podiumchannel">';
    myHtml += '<div class="form-check-inline"><input type="radio" name="podiumchannel" checked="" value="' + billing_email + '"><label class="form-check-label">Email Channel</label></div>';
    myHtml += '<div class="form-check-inline"><input type="radio" name="podiumchannel" value="' + billing_phone.replace(/[^0-9]/g, "") + '"><label class="form-check-label">SMS Channel</label></div>';
    myHtml += '</div>';
    //myHtml += '<input class="form-control" type="text" id="txtPPEmail" name="txtPPEmail" placeholder="PayPal Email" maxlength="60" disabled>';

    myHtml += '<button type="button" class="btn btn-primary" id="btnPlaceOrder">Place Order ' + $('#netPaymentTotal').text() + '</button>';
    myHtml += '<button type="button" class="btn btn-primary hidden" id="btnResendInv">Resend Invoice ' + $('#netPaymentTotal').text() + '</button>';
    myHtml += '</div>';

    myHtml += '</div>';
    myHtml += '</div>';
    $("#billModal").empty().html(myHtml);
    myHtml = '';
    //get items
    //$('#order_line_items > tr').each(function (index, tr) {
    //    var qty = parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00;
    //    var grossAmount = parseFloat($(this).find(".TotalAmount").data('amount')) || 0.00;
    //    var discountAmount = parseFloat($(this).find(".TotalAmount").data('discount')) || 0.00;
    //    var taxAmount = parseFloat($(this).find(".TotalAmount").data('taxamount')) || 0.00;
    //    myHtml += '<tr>';
    //    myHtml += '<td>' + $(this).data('pname') + '</td>';
    //    myHtml += '<td class="text-right">' + qty + '</td>';
    //    myHtml += '<td class="text-right">' + grossAmount.toFixed(2) + '</td>';
    //    myHtml += '<td class="text-right">' + discountAmount.toFixed(2) + '</td>';
    //    myHtml += '<td class="text-right">' + taxAmount.toFixed(2) + '</td>';
    //    myHtml += '</tr>';
    //});

    $('#line_items tr').each(function () {
        var qty = parseFloat($(this).find("[name=txt_itemqty]").val()) || 0.00;
        var grossAmount = parseFloat($(this).find(".product-price").data('price')) || 0.00;
        //var discountAmount = parseFloat($(this).find(".TotalAmount").data('discount')) || 0.00;
        //var taxAmount = parseFloat($(this).find(".row-total").data('total')) || 0.00;
        myHtml += '<tr>';
        myHtml += '<td>' + $(this).data('pname') + '</td>';
        myHtml += '<td class="text-right">' + qty + '</td>';
        myHtml += '<td class="text-right">' + grossAmount.toFixed(2) + '</td>';
        //myHtml += '<td class="text-right">' + discountAmount.toFixed(2) + '</td>';
        //myHtml += '<td class="text-right">' + taxAmount.toFixed(2) + '</td>';
        myHtml += '</tr>';
    });
    $('#tblmodalitems tbody').append(myHtml);
    $('#tblmodalTotal').append($('#order_final_total').html());
    $("#billModal").modal({ backdrop: 'static', keyboard: false }); $("#txt_Coupon").focus();
    pay_by = pay_by.length > 0 ? pay_by : 'podium';
    //pay_by = pay_by.length > 0 ? pay_by : 'ppec_paypal';
    $('#ddlPaymentMethod').val(pay_by).trigger('change'); //console.log(pay_by);
}
function AcceptPayment() {
    if ($("#ddlPaymentMethod").val() == "ppec_paypal") { PaypalPayment($("#txtbillemail").val()); ActivityLog('Order  id (' + $('#hfOrderNo').val() + ') proceed for paypal payment from order payment invoice.', '/Orders/quickorder/' + $('#hfOrderNo').val() + ''); }
    else if ($("#ddlPaymentMethod").val() == "authorize_net_cim_credit_card") { AuthorizePayment(); ActivityLog('Order  id (' + $('#hfOrderNo').val() + ') proceed for authorize net from order payment invoice.', '/Orders/quickorder/' + $('#hfOrderNo').val() + ''); }
    else { swal('Alert!', 'Please Select Payment Method.', "error"); }
}

///Accept Podium Payment
function AuthorizePayment() {
    console.log('ss');
    let cartResponse = {
        message: "Your message",
        status: 200, // Example status code
        code: "ABC123",
        data: {
            //// Fill in the properties of the CartDataResponse object here
            //// Example: shipping_address 
            email: $("#txtbillemail").val(),
            billing: {
                first_name: $("#txtbillfirstname").val(),
                last_name: $("#txtbilllastname").val(),
                email: $("#txtbillemail").val(),
                company: $("#txtbillcompany").val(),
                phone: $("#txtbillphone").val(),
                address_1: $("#txtbilladdress1").val(),
                address_2: $("#txtbilladdress2").val(),
                city: $("#txtbillcity").val(),
                state: $("#ddlbillstate").val(),
                postcode: $("#txtbillzipcode").val(),
                country: $("#ddlbillcountry").val()
            },
            shipping: {
                first_name: $("#txtshipfirstname").val(),
                last_name: $("#txtshiplastname").val(),
                email: $("#txtbillemail").val(),
                company: $("#txtshipcompany").val(),
                phone: $("#txtbillphone").val(),
                address_1: $("#txtshipaddress1").val(),
                address_2: $("#txtshipaddress2").val(),
                city: $("#txtshipcity").val(),
                state: $("#ddlshipstate").val(),
                postcode: $("#txtshipzipcode").val(),
                country: $("#ddlshipcountry").val()
            },
            order_notes: $("#txtbillemail").val(),
            session_id: $("#hfsession_id").val(),
            //user_id: '',
            payment_method: 'authorize_net_cim_credit_card',
            payment_method_title: 'Credit Card',
            card_data: {
                card_number: '4111111111111111',
                expiry: {
                    month: '12',
                    year: '2023',
                },
                csc: '123',
            }
        }
    };

    let option = {
        objs: cartResponse,
        product_id: 0,
        vendor_id: 24

    };
    console.log(option);
    $.ajax({
        type: "Post", url: '/Quickorder/paymentorder', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option),
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            const status = data[0];
            swal('Success!', status.description, 'success');
            $("#billModal").modal('hide'); $('.billinfo').prop("disabled", true);
        }
    })
    //let oid = parseInt($('#hfOrderNo').val()) || 0;
    //let bill_email = $("#txtbillemail").val();
    //let bill_to = $('input[name="podiumchannel"]:checked').val();
    //let bill_name = $('#txtbillfirstname').val() + ' ' + $('#txtbilllastname').val();
    //let Shipping_total = parseFloat($('#shippingTotal').text()) || 0.00, st_total = parseFloat($("#orderTotal").data('tax')) || 0.00, srf_total = parseFloat($('#stateRecyclingFeeTotal').text()) || 0.00, fee_total = parseFloat($('#feeTotal').text()) || 0.00;
    //let gc_total = (parseFloat($('#giftCardTotal').text()) || 0.00) - (fee_total < 0 ? fee_total : 0);
    //if (fee_total > 0) { let rgc_amt = fee_total <= gc_total ? fee_total : gc_total; fee_total = fee_total - rgc_amt; gc_total = gc_total - rgc_amt; }
    //if (srf_total > 0) { let rgc_amt = srf_total <= gc_total ? srf_total : gc_total; srf_total = srf_total - rgc_amt; gc_total = gc_total - rgc_amt; }
    //if (Shipping_total > 0) { let rgc_amt = Shipping_total <= gc_total ? Shipping_total : gc_total; Shipping_total = Shipping_total - rgc_amt; gc_total = gc_total - rgc_amt; }
    //if (st_total > 0) { let rgc_amt = st_total <= gc_total ? st_total : gc_total; st_total = st_total - rgc_amt; gc_total = gc_total - rgc_amt; }
    //let _lineItems = [];
    //$('#order_line_items > tr').each(function (index, tr) {
    //    let qty = parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00;
    //    let grossAmount = parseFloat($(this).find(".TotalAmount").data('amount')) || 0.00;
    //    let discount = parseFloat($(this).find(".RowDiscount").text()) || 0.00;
    //    let rgc_amt = (grossAmount - discount) <= gc_total ? (grossAmount - discount) : gc_total; gc_total = gc_total - rgc_amt;
    //    if ((grossAmount - discount - rgc_amt) > 0)
    //        _lineItems.push({ description: $(this).data('pname').replace(/[^a-zA-Z0-9 ]/g, "").substring(0, 40) + ' X ' + qty.toFixed(0), amount: (grossAmount - discount - rgc_amt) * 100 });
    //    //_lineItems.push({ description: 'Item - ' + index+ ' X ' + qty.toFixed(0), amount: (grossAmount - discount) * 100 });
    //});
    //if (Shipping_total > 0) _lineItems.push({ description: "Shipping", amount: Shipping_total * 100 });
    //if (st_total > 0) _lineItems.push({ description: "Tax", amount: st_total * 100 });
    //if (srf_total > 0) _lineItems.push({ description: "State Recycling Fee", amount: srf_total * 100 });
    //if (fee_total > 0) _lineItems.push({ description: "Fee", amount: fee_total * 100 });

    //let pay_by = $('#lblOrderNo').data('pay_by').trim(), inv_id = $('#lblOrderNo').data('pay_id').trim();
    ////let opt_inv = { lineItems: _lineItems, channelIdentifier: bill_to, customerName: bill_name, invoiceNumber: 'INV-' + oid, locationUid: _locationUid };
    //let opt_inv = { strValue1: bill_to, strValue2: bill_name, strValue3: 'INV-' + oid, strValue4: JSON.stringify(_lineItems), strValue5: pay_by.includes('podium') ? inv_id : '' };
    //console.log(opt_inv);
    //console.log('Start Podium Payment Processing...');
    //let option = { strValue1: 'getToken' };
    //swal.queue([{
    //    title: 'Podium Payment Processing.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
    //    onOpen: () => {
    //        swal.showLoading();
    //        $.get('/Setting/GetPodiumInvoice', opt_inv).then(response => {
    //            let _data = JSON.parse(response.message); let uid = _data.data.uid;
    //            let _postMeta = [
    //                { post_id: oid, meta_key: '_payment_method', meta_value: 'podium' }, { post_id: oid, meta_key: '_payment_method_title', meta_value: 'Podium Payments' },
    //                { post_id: oid, meta_key: '_podium_uid', meta_value: uid }, { post_id: oid, meta_key: 'taskuidforsms', meta_value: uid }, { post_id: oid, meta_key: '_podium_status', meta_value: 'SENT' }
    //            ];
    //            let opt = { OrderPostMeta: _postMeta }; console.log(opt);
    //            $.post('/OrdersMySQL/UpdatePaymentInvoiceID', opt).then(response => {
    //                swal('Success!', response.message, 'success');
    //                if (response.status == true) { $("#billModal").modal('hide'); $('.billinfo').prop("disabled", true); successModal('podium', uid, false, true); }
    //            }).catch(err => { console.log(err); swal.hideLoading(); swal('Error!', err, 'error'); });
    //        }).catch(err => { swal.hideLoading(); swal('Error!', err, 'error'); });//.always(function () { swal.hideLoading(); });
    //        //$.get('/Setting/GetPodiumToken', option).then(response => {
    //        //    let access_token = response.message;
    //        //    let pay_by = $('#lblOrderNo').data('pay_by').trim(), inv_id = $('#lblOrderNo').data('pay_id').trim();
    //        //    if (inv_id.length > 0 && pay_by.includes('podium')) {
    //        //        let create_url = podium_baseurl + '/v4/invoices/' + inv_id + '/cancel';
    //        //        let opt_cnl = { locationUid: _locationUid, note: 'Invoice has been canceled.' };
    //        //        $.ajax({
    //        //            type: 'post', url: create_url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt_cnl),
    //        //            beforeSend: function (xhr) { xhr.setRequestHeader("Accept", "application/json"); xhr.setRequestHeader("Authorization", "Bearer " + access_token); }
    //        //        }).then(response => { console.log('Invoice has been canceled.'); }).catch(err => { console.log(err); });
    //        //    }
    //        //    $.ajax({
    //        //        type: 'post', url: podium_baseurl + '/v4/invoices', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt_inv),
    //        //        beforeSend: function (xhr) { xhr.setRequestHeader("Content-Type", "application/json"); xhr.setRequestHeader("Accept", "application/json"); xhr.setRequestHeader("Authorization", "Bearer " + access_token); }
    //        //    }).then(response => {
    //        //        updatePayment(oid, response.data.uid);
    //        //    }).catch(err => { console.log(err); swal.hideLoading(); swal('Error!', 'Something went wrong.', 'error'); });
    //        //}).catch(err => { swal.hideLoading(); swal('Error!', err, 'error'); });//.always(function () { swal.hideLoading(); });
    //    }
    //}]);
}
function updatePayment(oid, taskUid) {
    let _postMeta = [
        { post_id: oid, meta_key: '_payment_method', meta_value: 'podium' }, { post_id: oid, meta_key: '_payment_method_title', meta_value: 'Podium Payments' },
        { post_id: oid, meta_key: '_podium_uid', meta_value: taskUid }, { post_id: oid, meta_key: 'taskuidforsms', meta_value: taskUid }, { post_id: oid, meta_key: '_podium_status', meta_value: 'SENT' }
    ];
    let opt = { OrderPostMeta: _postMeta };
    $.post('/OrdersMySQL/UpdatePaymentInvoiceID', opt).then(response => {
        swal('Success!', response.message, 'success');
        if (response.status == true) { $("#billModal").modal('hide'); $('.billinfo').prop("disabled", true); successModal('podium', taskUid, false, true); }
    }).catch(err => { console.log(err); swal.hideLoading(); swal('Error!', err, 'error'); });
}

///Accept paypal Payment
function createPaypalXML(oid, pp_no, pp_email) {
    let taxPer = parseFloat($('#hfTaxRate').val()) || 0.00, dfa = $('#txtLogDate').val().split(/\//); df = [dfa[2], dfa[0], dfa[1]].join('-');
    let shippingText = $('#shippingTotal').text();
    shippingText = shippingText.replace('$', '');

    let salesTaxText = $('#salesTaxTotal').text();
    salesTaxText = salesTaxText.replace('$', '');

    let discountText = $('#discountTotal').text();
    discountText = discountText.replace('$', '');

    let shipping_total = parseFloat(shippingText) || 0.00, srf_total = parseFloat($('#stateRecyclingFeeTotal').text()) || 0.00, fee_total = parseFloat($('#feeTotal').text()) || 0.00;
    console.log(shippingText, shipping_total);
    let gc_total = parseFloat($('#giftCardTotal').text()) || 0.00, note = $('#txtCustomerNotes').val(); note = (note != '' ? note : 'Prosource Invoice.');
    let custom_label = 'Other Charges', _items = []; fee_total = fee_total + srf_total - gc_total;
    if (srf_total != 0 && fee_total != 0 && gc_total != 0) custom_label = 'State Recycling Fee, Other Fee & Gift Card';
    else if (srf_total != 0 && fee_total != 0 && gc_total == 0) custom_label = 'State Recycling Fee & Other Fee';
    else if (srf_total != 0 && fee_total == 0 && gc_total == 0) custom_label = 'State Recycling Fee';
    else if (srf_total == 0 && fee_total != 0 && gc_total != 0) custom_label = 'Other Fee & Gift Card';
    else if (srf_total == 0 && fee_total == 0 && gc_total != 0) custom_label = 'Gift Card';
    else if (srf_total != 0 && fee_total == 0 && gc_total != 0) custom_label = 'State Recycling Fee & Gift Card';
    else custom_label = 'Other Fee';
    let paypal_seller_email = $('#lblOrderNo').data('paypal_seller');
    //console.log(srf_total, fee_total, gc_total);
    //get items
    //$('#order_line_items > tr').each(function (index, tr) {
    //    let qty = parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00;
    //    let rate = parseFloat($(this).find(".TotalAmount").data('regprice')) || 0.00;
    //    let taxAmount = parseFloat($(this).find(".TotalAmount").data('taxamount')) || 0.00;
    //    let discountAmount = parseFloat($(tr).find(".RowDiscount").text()) || 0.00;//parseFloat($(this).find(".TotalAmount").data('discount')) || 0.00;
    //    if ($("#order_line_items > tr.gift_item").length > 0) {
    //        custom_label = 'Other Charges'; fee_total = fee_total + taxAmount;
    //        if ($(this).data('pid') == "888864") _items.push({ name: $(this).data('pname'), quantity: qty, unit_amount: { currency_code: "USD", value: rate }, discount: { amount: { currency_code: "USD", value: discountAmount } }, unit_of_measure: "QUANTITY" });
    //        else _items.push({ name: $(this).data('pname'), quantity: qty, unit_amount: { currency_code: "USD", value: rate }, discount: { amount: { currency_code: "USD", value: discountAmount } }, unit_of_measure: "QUANTITY" });
    //    }
    //    else {
    //        _items.push({ name: $(this).data('pname'), quantity: qty, unit_amount: { currency_code: "USD", value: rate }, tax: { name: "Sales Tax", value: taxAmount, percent: taxPer * 100 }, discount: { amount: { currency_code: "USD", value: discountAmount } }, unit_of_measure: "QUANTITY" });
    //    }
    //});

    $('#line_items tr').each(function (index) {
        var qty = parseFloat($(this).find("[name=txt_itemqty]").val()) || 0.00;
        var rate = parseFloat($(this).find(".product-price").data('price')) || 0.00;
        let taxAmount = parseFloat(salesTaxText) || 0.00; //parseFloat($(this).find(".TotalAmount").data('taxamount')) || 0.00;
        let discountAmount = parseFloat(discountText) || 0.00; //parseFloat($(tr).find(".RowDiscount").text()) || 0.00;
        //_items.push({ name: $(this).data('pname'), quantity: qty, unit_amount: { currency_code: "USD", value: rate }, tax: { name: "Sales Tax", value: taxAmount, percent: taxPer * 100 }, discount: { amount: { currency_code: "USD", value: discountAmount } }, unit_of_measure: "QUANTITY" });
        var item = {
            name: $(this).data('pname'),
            quantity: qty,
            unit_amount: {
                currency_code: "USD",
                value: rate
            },
            unit_of_measure: "QUANTITY"
        };

        // Add tax and discount only for the first item
        if (index === 0) {
            item.tax = {
                name: "Sales Tax",
                value: taxAmount,
                percent: taxPer * 100
            };
            item.discount = {
                amount: {
                    currency_code: "USD",
                    value: discountAmount
                }
            };
        }

        // Push the item to the '_items' array
        _items.push(item);
    });

    let paupal_xml = {
        id: $('#lblOrderNo').data('pay_id').trim(), status: "DRAFT",
        detail: { invoice_number: pp_no, reference: oid, invoice_date: df, currency_code: "USD", note: note, payment_term: { term_type: "NET_10" } },
        invoicer: {
            name: { given_name: "", surname: "" },
            address: { address_line_1: "157 Church Street Suite 1956", address_line_2: "", admin_area_2: "New Haven", admin_area_1: "CT", postal_code: "06510", country_code: "US" },
            email_address: paypal_seller_email,
            //email_address: "sb-ywzys7367265@business.example.com",
            //email_address: "david.quick.fix1-facilitator@gmail.com",
            phones: [{ country_code: "001", national_number: "18004896820", phone_type: "MOBILE" }],
            website: "https://prosourcediesel.com/",
            logo_url: "https://erp.prosourcediesel.com/Images/prosourcediesel-logo.png",
            additional_notes: ""
        },
        primary_recipients: [
            {
                billing_info: {
                    name: { given_name: $('#txtbillfirstname').val(), surname: $('#txtbilllastname').val() },
                    address: { address_line_1: $('#txtbilladdress1').val() + ' ' + $('#txtbilladdress2').val(), admin_area_2: $('#txtbillcity').val(), admin_area_1: $('#ddlbillstate').val(), postal_code: $('#txtbillzipcode').val(), country_code: $('#ddlbillcountry').val() },
                    email_address: pp_email,
                    //phones: [{ country_code: "001", national_number: $('#txtbillphone').val(), phone_type: "HOME" }]
                },
                shipping_info: {
                    name: { given_name: $('#txtshipfirstname').val(), surname: $('#txtshiplastname').val() },
                    address: { address_line_1: $('#txtshipaddress1').val() + ' ' + $('#txtshipaddress2').val(), admin_area_2: $('#txtshipcity').val(), admin_area_1: $('#ddlshipstate').val(), postal_code: $('#txtshipzipcode').val(), country_code: $('#ddlshipcountry').val() }
                }
            }
        ],
        items: _items,
        configuration: { partial_payment: { allow_partial_payment: true }, allow_tip: false, tax_calculated_after_discount: true, tax_inclusive: false },
        amount: {
            breakdown: { discount: { invoice_discount: { percent: 0 } }, shipping: { amount: { currency_code: "USD", value: shipping_total } }, custom: { label: custom_label, amount: { currency_code: "USD", value: fee_total } } }
        },
        payment_method: { payee_preferred: "UNRESTRICTED" }
    }
    return paupal_xml;
}
function PaypalPayment(ppemail) {
    let oid = parseInt($('#hfOrderNo').val()) || 0, pp_no = 'WC-' + new Date().getTime();
    let option_pp = createPaypalXML(oid, pp_no, ppemail);
    console.log(option_pp);
    console.log('Start PayPal Payment Processing...');
    swal.queue([{
        title: 'PayPal Payment Processing.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
        onOpen: () => {
            swal.showLoading();
            $.get('/Setting/GetPayPalToken', { strValue1: 'getToken' }).then(response => {
                let access_token = response.message, pay_by = $('#lblOrderNo').data('pay_by').trim(), inv_id = $('#lblOrderNo').data('pay_id').trim();
                let create_url = paypal_baseurl + '/v2/invoicing/invoices' + (inv_id.length > 0 && pay_by.includes('paypal') ? '/' + inv_id : ''), action_method = (inv_id.length > 0 && pay_by.includes('paypal') ? 'PUT' : 'POST');
                if (pay_by != '' && pay_by != 'ppec_paypal') {
                    create_url = paypal_baseurl + '/v2/invoicing/invoices', action_method = 'POST'; option_pp.id = '';
                }
                console.log(action_method, create_url);
                //CreatePaypalInvoice(oid, pp_no, ppemail, response.message);
                $.ajax({
                    type: action_method, url: create_url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option_pp),
                    beforeSend: function (xhr) { xhr.setRequestHeader("Accept", "application/json"); xhr.setRequestHeader("Authorization", "Bearer " + access_token); }
                }).then(data => {
                    console.log('Invoice has been Created.'); let sendURL = data.href + '/send'; //console.log(sendURL, data, action_method);
                    $("txtbillemail").data('surl', sendURL);
                    if (action_method == 'POST') { SendPaypalInvoice(oid, pp_no, access_token, sendURL); }
                    else {
                        let mail_body = 'Hi ' + $("#txtbillfirstname").val() + ' ' + $("#txtbilllastname").val() + ',{BR}Please use this secure link to make your payment. Thank you! ' + paypal_baseurl_pay + '/invoice/p/#' + inv_id.toString().substring(4).replace(/\-/g, '');
                        let option_pu = { b_email: $("#txtbillemail").val(), payment_method: 'PayPal Payment request from Prosource Diesel.', payment_method_title: mail_body, OrderPostMeta: [{ post_id: oid, meta_key: '_payment_method', meta_value: 'ppec_paypal' }] };
                        $.post('/OrdersMySQL/UpdatePaymentInvoiceID', option_pu).then(result => {
                            swal('Success!', result.message, 'success'); $("#billModal").modal('hide'); $('.billinfo').prop("disabled", true);
                            successModal('PayPal', inv_id, true, true);
                        }).catch(err => { console.log(err); swal('Error!', err, 'error'); swal.hideLoading(); });
                    }
                }).catch(err => { console.log(err); swal.hideLoading(); swal('Error!', 'Something went wrong.', 'error'); });
            }).catch(err => { swal.hideLoading(); swal('Error!', err, 'error'); });//.always(function () { swal.hideLoading(); });
        }
    }]);
}
function SendPaypalInvoice(oid, pp_no, access_token, sendURL) {
    let id = sendURL.split('/');
    let _postMeta = [
        { post_id: oid, meta_key: '_payment_method', meta_value: 'ppec_paypal' }, { post_id: oid, meta_key: '_payment_method_title', meta_value: 'PayPal' },
        { post_id: oid, meta_key: '_paypal_invoice_id', meta_value: pp_no }, { post_id: oid, meta_key: '_paypal_id', meta_value: id[id.length - 2] },
        { post_id: oid, meta_key: '_paypal_status', meta_value: 'SENT' }
    ];
    $.ajax({
        type: "POST", url: sendURL, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify({ send_to_recipient: true, send_to_invoicer: true }),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Authorization", "Bearer " + access_token);
        },
        success: function (senddata, textStatus, jqXHR) {
            console.log(senddata);
            let mail_body = 'Hi ' + $("#txtbillfirstname").val() + ' ' + $("#txtbilllastname").val() + ', {BR}Please use this secure link to make your payment. Thank you! ' + paypal_baseurl_pay + '/invoice/p/#' + id[id.length - 2].toString().substring(4).replace(/\-/g, '');
            let opt = { b_email: $("#txtbillemail").val(), payment_method: 'PayPal Payment request from Prosource Diesel.', payment_method_title: mail_body, OrderPostMeta: _postMeta };
            $.post('/OrdersMySQL/UpdatePaymentInvoiceID', opt).then(result => {
                swal('Success!', result.message, 'success'); $('#lblOrderNo').data('pay_id', id);
                $("#billModal").modal('hide'); $('.billinfo').prop("disabled", true);
                successModal('PayPal', id[id.length - 2], true, true);
            }).catch(err => { console.log(err); swal.hideLoading(); });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#ddlPaymentMethod').prop("disabled", true); $('#btnPlaceOrder').addClass('hidden'); $('#btnResendInv').removeClass('hidden');
            console.log(XMLHttpRequest); swal('Error!', 'Something went wrong.', 'error');
        },
        complete: function () { $('#btnPlaceOrder').prop("disabled", false); },
        async: false
    });
}
function CancelPaypalInvoice(access_token, pp_email, invoice_no) {
    var option = { subject: "Invoice Cancelled", note: "Cancelling the invoice", send_to_invoicer: true, send_to_recipient: true, additional_recipients: [pp_email] }
    let create_url = 'https://api-m.sandbox.paypal.com/v2/invoicing/invoices/' + invoice_no + '/cancel';
    console.log(create_url, option);
    $.ajax({
        type: "POST", url: create_url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Authorization", "Bearer " + access_token);
        },
        success: function (data) { console.log(data); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); console.log(XMLHttpRequest); swal('Alert!', errorThrown, "error"); },
        complete: function () { $("#loader").hide(); }, async: false
    });
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Success modal ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function successModal(paymode, id, is_mail, is_back) {
    //console.log(id, id.toString().substring(4).replace(/\-/g, ''));
    id = id.toString().substring(4).replace(/\-/g, '');
    var modalHtml = '';
    modalHtml += '<div class="modal-dialog modal-lg">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<div class="modal-body no-padding" ></div>';
    modalHtml += '<div class="modal-footer">';
    if (is_back) modalHtml += '<button type="button" class="btn btn-primary" id="btnNewOrder">OK</button>';
    else modalHtml += '<button type="button" class="btn btn-primary" data-dismiss="modal" aria-label="Close">OK</button>';
    modalHtml += ' <button type="button" class="btn btn-primary" id="btnDownloadinPdf" data-toggle="tooltip" title="Donload in PDF Invoice."><i class="fa fa-file-pdf"></i> Print in PDF</button>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#billModal").empty().html(modalHtml);

    var myHtml = '';
    myHtml += '<div style="margin:0;padding:0;color: #4f4f4f;font-family: Arial, sans-serif;">';
    myHtml += '<table id="tbprint" role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">';
    myHtml += '<tr>';
    myHtml += '<td align="center" style="padding:0;">';
    myHtml += '<table role="presentation" style="width:602px;border-collapse:collapse;border-spacing:0;text-align:left;">';
    myHtml += '<tr>';
    myHtml += '<td align="center" style="padding: 10px 15px; background-color: #f8f8f8;">';
    myHtml += '<table role="presentation" style="width:100%;">';
    myHtml += '<tr>';
    //myHtml += '<td><img alt="Layla Logo" src="https://quickfix16.com/wp-content/themes/layla-white/images/logo.png"></td>';    
    myHtml += '<td><img alt="Prosource Logo" src="#" id="imgLogoprint"></td>';
    myHtml += '<td align="right">';
    myHtml += '<h1 style="font-size: 42px; margin:0px; font-style: italic; color: #4f4f4f">Thank you.</h1>';
    myHtml += '<h2 style="font-size: 20px; margin:0px; color: #4f4f4f">Your order has been received</h2>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '</table>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '<tr class="thankyou-for-your-order">';
    myHtml += '<td class="order-detail-box" style="padding: 15px 10px 10px; border-bottom: 1px solid #c8c8c8;">';
    myHtml += '<table class="order_details order-detail-ul" role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">';
    myHtml += '<tr>';
    myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top; border-right: 1px solid #c8c8c8; padding-right:30px;"> Order number:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">' + $('#hfOrderNo').val() + '</strong></td>';
    myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top; border-right: 1px solid #c8c8c8; padding-right:30px; padding-left:30px;"> Date:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">' + $('#txtLogDate').val() + '</strong></td>';
    myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top; border-right: 1px solid #c8c8c8; padding-right:30px; padding-left:30px;"> Total:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">' + $('#netPaymentTotal').text() + '</strong></td>';
    if (paymode == 'PayPal' && $("#ddlStatus").val() == 'wc-pending')
        myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top;  padding-left:30px;"> Payment Method: PayPal<br><a id="payInvoice" class="btn8 btn8-medium payInvoice" href="' + paypal_baseurl_pay + '/invoice/p/#' + id + '" target="_blank" style="margin:12px;min-width:110px;background-color:#0070BA;color:#fff;font-size:12px;box-sizing:border-box!important;padding: 8px;border-radius:5px;font-weight:600;">Pay ' + $('#netPaymentTotal').text() + '</a></td>';
    else if (paymode == 'authorize_net_cim_credit_card')
        myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top;  padding-left:30px;"> Payment Method:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">Credit Card</strong></td>';
    else
        myHtml += '<td style="font-size:10.725px; text-transform:uppercase; vertical-align:top;  padding-left:30px;"> Payment Method:<br><strong style="font-size:16px;margin-top:3px;text-transform: none;">' + paymode + '</strong></td>';
    myHtml += '</tr>';
    myHtml += '</table>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '<tr><td ><h2 style="font-size:20px; margin:25px 0px 10px 0px;">Order details</h2></td></tr>';
    myHtml += '<tr>';
    myHtml += '<td >';

    myHtml += '<table id="tblorder_details" class="shop_table order_details" style="border: 1px solid rgba(0, 0, 0, 0.1);margin: 0 -1px 24px 0;text-align: left;width: 100%; border-collapse: separate; border-radius: 5px;">';
    myHtml += '<thead><tr><th class=" product-name" style="font-weight: 700;padding: 9px 12px;">Product</th><th class="product-total" style="font-weight: 700;padding: 9px 12px;">Total</th></tr></thead>';
    myHtml += '<tbody></tbody>';
    myHtml += '<tfoot>';
    myHtml += '<tr><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Subtotal:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;"><span>' + $('#SubTotal').text() + '</span></td></tr>';
    myHtml += '<tr><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Discount:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">-<span>' + $('#discountTotal').text() + '</span></td></tr>';
    myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Fee:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">' + $('#feeTotal').text() + '</td></tr>';
    //myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">State Recycling Fee:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">' + $('#stateRecyclingFeeTotal').text() + '</td></tr>';
    myHtml += '<tr><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Shipping:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">' + $('#shippingTotal').text() + '</td></tr>';
    //myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Tax:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">$' + $('#salesTaxTotal').text() + '</td></tr>';
    $('#order_final_total .tax-total').each(function (index, li) {
        myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">' + $(li).data('label') + ' - ' + ((parseFloat($(li).data('percent'))) * 100).toFixed(4) + '%:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">$' + $(li).data('amount') + '</td></tr>';
    });
    if (parseFloat($('#giftCardTotal').text()) > 0)
        myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Gift Card:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">' + $('#giftCardTotal').text() + '</td></tr>';
    myHtml += '<tr ><th style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;">Total:</th><td style="font-weight: 700; border-top: 1px solid rgba(0, 0, 0, 0.1);padding: 9px 12px; vertical-align: middle;"><span>' + $('#netPaymentTotal').text() + '</span></td></tr>';
    myHtml += '</tfoot>';
    myHtml += '</table>';

    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += ' <tr>';
    myHtml += '<td class="checkout-call" style="background: #41414b; padding: 30px 15px; font-size: 20px; color: #fff; font-weight: 600; text-align: center;">';
    myHtml += 'Give us a call <a style="color:#fff;text-decoration: none;" href="tel:1-800-489-6820">1-800-489-6820</a>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '</table>';
    myHtml += '</td>';
    myHtml += '</tr>';
    myHtml += '</table>';
    myHtml += '</div>';

    $('#billModal .modal-body').append(myHtml);

    myHtml = '';
    $('#line_items tr').each(function () {
        const $row = $(this);
        var qty = parseFloat($row.find('input[name="txt_itemqty"]').val()) || 0.00;
        var grossAmount = parseFloat($(this).find(".product-price").data('price')) || 0.00;
        myHtml += '<tr><td style="border-top: 1px solid rgba(0, 0, 0, 0.1);  padding: 9px 12px; vertical-align: middle;"><span>' + $(this).data('pname') + '</span><strong class="product-quantity">× ' + qty + '</strong></td><td style="border-top: 1px solid rgba(0, 0, 0, 0.1);  padding: 9px 12px; vertical-align: middle;"><span>$' + grossAmount.toFixed(2) + '</span></td></tr>';
    });
    $('#tblorder_details tbody').append(myHtml);

    $("#billModal").modal({ backdrop: 'static', keyboard: false });
    toDataURL('https://erp.prosourcediesel.com/Images/prosourcediesel-logo.png', function (dataUrl) {
        //console.log('RESULT:', dataUrl);
        $('#imgLogoprint').attr("src", dataUrl);
    });
    //var opt = { strValue1: $('#txtbillemail').val(), strValue2: 'Your order #' + $('#hfOrderNo').val() + ' has been received', strValue3: $('#billModal .modal-body').html() }
    //if ($('#txtbillemail').val().length > 5 && is_mail == true) {
    //    sendInvoice(paymode, id)
    //}
}

function sendInvoice(paymode, id) {
    let order_id = parseInt($('#hfOrderNo').val()) || 0;
    let order_date = $('#txtLogDate').val();
    let payment_method = paymode;
    let b_first_name = $('#txtbillfirstname').val(), b_last_name = $('#txtbilllastname').val();
    let b_company = $('#txtbillcompany').val();
    let b_address_1 = $('#txtbilladdress1').val(), b_address_2 = $('#txtbilladdress2').val();
    let b_postcode = $('#txtbillzipcode').val(), b_city = $('#txtbillcity').val();
    let b_country = $('#ddlbillcountry').val(), b_state = $('#ddlbillstate').val();
    let b_email = $('#txtbillemail').val(), b_phone = $('#txtbillphone').val();
    let s_first_name = $('#txtshipfirstname').val(), s_last_name = $('#txtshiplastname').val();
    let s_company = $('#txtshipcompany').val();
    let s_address_1 = $('#txtshipaddress1').val(), s_address_2 = $('#txtshipaddress2').val();
    let s_postcode = $('#txtbillzipcode').val();
    let s_city = $('#txtshipcity').val(), s_country = $('#ddlshipcountry').val(), s_state = $('#ddlshipstate').val();
    let GrassAmount = parseFloat($('#SubTotal').text()) || 0;
    let TotalDiscount = parseFloat($('#discountTotal').text()) || 0;
    let TotalTax = parseFloat($('#salesTaxTotal').text()) || 0;
    let TotalShipping = parseFloat($('#shippingTotal').text()) || 0;
    let TotalStateRecycling = parseFloat($('#stateRecyclingFeeTotal').text()) || 0;
    let TotalFee = parseFloat($('#feeTotal').text()) || 0, TotalGift = parseFloat($('#giftCardTotal').text()) || 0;
    let NetTotal = parseFloat($('#netPaymentTotal').text()) || 0;
    let _item = [];
    $('#order_line_items > tr').each(function (index, tr) {
        var qty = parseFloat($(this).find("[name=txt_ItemQty]").val()) || 0.00;
        var rate = parseFloat($(this).find(".TotalAmount").data('regprice')) || 0.00;
        var grossAmount = parseFloat($(this).find(".TotalAmount").data('amount')) || 0.00;
        _item.push({
            order_item_id: 0, PKey: 0, order_id: order_id, product_type: 'line_item', product_id: $(tr).data('pid'), variation_id: $(tr).data('vid'), product_name: $(tr).data('pname'), quantity: qty, sale_rate: rate, total: grossAmount, product_img: $(tr).data('img')
        });
    });

    var opt_mail = {
        order_id: order_id, order_date: order_date, payment_method: payment_method, b_first_name: b_first_name, b_last_name: b_last_name, b_company: b_company,
        b_address_1: b_address_1, b_address_2: b_address_2, b_postcode: b_postcode, b_city: b_city, b_country: b_country, b_state: b_state, b_email: b_email, b_phone: b_phone,
        s_first_name: s_first_name, s_last_name: s_last_name, s_company: s_company, s_address_1: s_address_1, s_address_2: s_address_2, s_postcode: s_postcode, s_city: s_city, s_country: s_country, s_state: s_state,
        paypal_id: id, GrassAmount: GrassAmount, TotalDiscount: TotalDiscount, TotalTax: TotalTax, TotalShipping: TotalShipping, TotalStateRecycling: TotalStateRecycling,
        TotalFee: TotalFee, TotalGift: TotalGift, NetTotal: NetTotal, OrderProducts: _item
    }
    $.ajax({
        type: "POST", url: '/Orders/SendMailInvoice', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt_mail),
        success: function (result) { console.log(result); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
        complete: function () { }, async: false
    });
}