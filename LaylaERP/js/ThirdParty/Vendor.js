﻿$("#loader").hide();
getVendorType();
getStatus();
getSalesTaxUsed();
getThirdPartyType();
getWorkforce();
getAssignedtoSalesRepresentative();
getVendorCode();
getPaymentTerm();
getBalanceDays();
ProductList();
getIncoterm();
getShippingMethod();
getDiscountType();
getPaymentMethod();

$("#ddlPaymentMethod").change(function () {
    PaymentMethod = $("#ddlPaymentMethod").val();
    if (PaymentMethod == "1") {
        $("#bnk_details").css("display", "block");
        $("#cheq_payment").css("display", "none");
        $("#pay_strd").css("display", "none");
        $("#pay_invoice").css("display", "none");
        
    }
    if (PaymentMethod == "3") {
        $("#cheq_payment").css("display", "block");
        $("#bnk_details").css("display", "none");
        $("#pay_invoice").css("display", "none");
        $("#pay_strd").css("display", "none");

    }
    if (PaymentMethod == "6") {
        $("#pay_invoice").css("display", "block");
        $("#cheq_payment").css("display", "none");
        $("#bnk_details").css("display", "none");
        $("#pay_strd").css("display", "none");

    }
    if (PaymentMethod == "7") {
        $("#pay_strd").css("display", "block");
        $("#cheq_payment").css("display", "none");
        $("#pay_invoice").css("display", "none");
        $("#bnk_details").css("display", "none");
    }
})
$('#btnNextTab1').click(function (e) {
    ID = $("#hfid").val();
    VendorType = $("#ddlvendortype").val();
    VendorCode = $("#txtVendorCode").val();
    VendorName = $("#txVendorName").val();
    AliasName = $("#txtAliasName").val();
    Status = $("#ddlStatus").val();
    Address1 = $("#txtAddress1").val();
    Address2 = $("#txtAddress2").val();
    City = $("#txtCity").val();
    State = $("#ddlState").val();
    ZipCode = $("#txtZipCode").val();
    Country = $("#ddlCountry").val();
    Phone = $("#txtPhone").val();
    Fax = $("#txtFax").val();
    EMail = $("#txtEMail").val();
    Web = $("#txtWeb").val();
    WorkingHours = $("#txtWorkinghours").val();
    VendorStatus = $("#chkVendorStatus").prop("checked") ? 1 : 0;

    var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (VendorType == "-1") { swal('alert', 'Please Select Vendor Type', 'error').then(function () { swal.close(); $('#ddlvendortype').focus(); }) }
    else if (VendorName == "") { swal('alert', 'Please Enter Vendor Name', 'error').then(function () { swal.close(); $('#txVendorName').focus(); }) }
    else if (AliasName == "") { swal('alert', 'Please Enter Alias Name', 'error').then(function () { swal.close(); $('#txtAliasName').focus(); }) }
    else if (Address1 == "") { swal('alert', 'Please Enter Address1', 'error').then(function () { swal.close(); $('#txtAddress1').focus(); }) }
    else if (City == "") { swal('alert', 'Please Enter City', 'error').then(function () { swal.close(); $('#txtCity').focus(); }) }
    else if (Status == "") { swal('alert', 'Please Enter Status', 'error').then(function () { swal.close(); $('#ddlStatus').focus(); }) }
    else if (State == "") { swal('alert', 'Please Enter State', 'error').then(function () { swal.close(); $('#ddlState').focus(); }) }
    else if (ZipCode == "") { swal('alert', 'Please Enter ZipCode', 'error').then(function () { swal.close(); $('#txtZipCode').focus(); }) }
    else if (Country == "-1") { swal('alert', 'Please Select Country', 'error').then(function () { swal.close(); $('#ddlCountry').focus(); }) }
    else if (Phone == "") { swal('alert', 'Please Enter Phone', 'error').then(function () { swal.close(); $('#txtPhone').focus(); }) }
    else if (EMail == "") { swal('alert', 'Please Enter EMail', 'error').then(function () { swal.close(); $('#txtEMail').focus(); }) }
    else if (!pattern.test(EMail)) { swal('alert', 'not a valid e-mail address', 'error').then(function () { swal.close(); $('#txtEMail').focus(); }) }
    else if (Web == "") { swal('alert', 'Please Enter Web', 'error').then(function () { swal.close(); $('#txtWeb').focus(); }) }
    else if (WorkingHours == "") { swal('alert', 'Please Enter working hours', 'error').then(function () { swal.close(); $('#txtWorkinghours').focus(); }) }

    else {
        var obj = {
            rowid: ID, vendor_type: VendorType, VendorCode: VendorCode,
            Name: VendorName,  AliasName: AliasName, Status: Status, Address: Address1,
            City: City, State: State, ZipCode: ZipCode, Country: Country, Phone: Phone, Fax: Fax, EMail: EMail, Web: Web,
            Workinghours: WorkingHours,VendorStatus: VendorStatus
        }
        $.ajax({
            url: '/ThirdParty/AddVendorBasicInfo/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (data) {
                if (data.status == true) {
                    $("#hfid").val(data.id);
                    swal('Alert!', data.message, 'success');
                    $("#parent").find(":input").each(function () {
                        switch (this.type) { case "text": case "email": case "tel": $(this).val(''); break; }
                    });
                    e.preventDefault();
                    var link = $('#mytabs .active').next().children('a').attr('href');
                    $('#mytabs a[href="' + link + '"]').tab('show');
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
});
$('#btnNextTab2').click(function (e) {
    ID = $("#hfid").val();
    corAddress1 = $("#txtCorAddress1").val();
    corAddress2 = $("#txtCorAddress2").val();
    corCity = $("#txtCorCity").val();
    corState = $("#txtCorState").val();
    corZipCode = $("#txtCorZipCode").val();
    corCountry = $("#txtCorCountry").val();
    corMobile = $("#txtCorPhone").val();
    workforce = $("#ddlWorkforce").val();
    businessEntityType = $("#txtBusinessEntityType").val();
    notesPublic = $("#txtNotesPublic").val();
    notesPrivate = $("#txtNotesPrivate").val();
  
    if (corAddress1 == "") { swal('alert', 'Please Enter Cor Address 1', 'error').then(function () { swal.close(); $('#txtCorAddress1').focus(); }) }
    else if (corCity == "") { swal('alert', 'Please Enter Cor City', 'error').then(function () { swal.close(); $('#txtCorCity').focus(); }) }
    else if (corState == "") { swal('alert', 'Please Enter Cor State', 'error').then(function () { swal.close(); $('#txtCorState').focus(); }) }
    else if (corZipCode == "") { swal('alert', 'Please Enter Cor Zip Code', 'error').then(function () { swal.close(); $('#txtCorZipCode').focus(); }) }
    else if (corCountry == "") { swal('alert', 'Please Enter cor Country', 'error').then(function () { swal.close(); $('#txtCorCountry').focus(); }) }
    else if (corMobile == "") { swal('alert', 'Please Enter Cor Phone/Mobile', 'error').then(function () { swal.close(); $('#txtCorPhone').focus(); }) }
    else if (workforce == "-1") { swal('alert', 'Please Select Work force', 'error').then(function () { swal.close(); $('#ddlWorkforce').focus(); }) }
    else if (businessEntityType == "") { swal('alert', 'Please Enter Business Entity Type', 'error').then(function () { swal.close(); $('#txtBusinessEntityType').focus(); }) }
    else if (notesPublic == "") { swal('alert', 'Please Enter Notes (Public)', 'error').then(function () { swal.close(); $('#txtNotesPublic').focus(); }) }
    else if (notesPrivate == "") { swal('alert', 'Please Enter Notes (Private)', 'error').then(function () { swal.close(); $('#txtNotesPrivate').focus(); }) }
    else {
        var obj = {
            rowid: ID, CorAddress1: corAddress1, CorAddress2: corAddress2, CorCity: corCity, CorState: corState, CorZipCode: corZipCode,
            CorCountry: corCountry, CorPhone: corMobile, Workforce: workforce, BusinessEntityType: businessEntityType,
            NotePublic: notesPublic,NotePrivate: notesPrivate
        }
        $.ajax({
            url: '/ThirdParty/AddVendorAdditionalInfo/', dataType: 'json', type: 'Post',
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
                    e.preventDefault();
                    var link = $('#mytabs .active').next().children('a').attr('href');
                    $('#mytabs a[href="' + link + '"]').tab('show');
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
});
$('#btnNextTab3').click(function (e) {
    Capital = $("#txtCapital").val();
    PaymentTerms = $("#ddlPaymentTerms").val();
    Balancedays = $("#ddlBalancedays").val();
    IncoTermType = $("#ddlIncoTerm").val();
    IncoTerm = $("#txtIncoTerm").val();
    //PaymentType = $("#ddlPaymentType").val();
    Currency = $("#ddlCurrency").val();
    CreditLimit = $("#txtCreditLimit").val();
    OutStandingLimit = $("#txtOutStandingLimit").val();
    MinOrderQty = $("#txtMinOrderQty").val();
    OrderMinAmt = $("#txtOrderMinAmt").val();

    if (Capital == "") { swal('alert', 'Please Enter Capital', 'error').then(function () { swal.close(); $('#txtCapital').focus(); }) }
    else if (PaymentTerms == "-1") { swal('alert', 'Please Select Payment Terms', 'error').then(function () { swal.close(); $('#ddlPaymentTerms').focus(); }) }
    else if (Balancedays == "-1") { swal('alert', 'Please Select Balance Net', 'error').then(function () { swal.close(); $('#ddlBalancedays').focus(); }) }
    else if (IncoTermType == "-1") { swal('alert', 'Please Select IncoTerm', 'error').then(function () { swal.close(); $('#ddlIncoTerm').focus(); }) }
    else if (IncoTerm == "") { swal('alert', 'Please Enter IncoTerm', 'error').then(function () { swal.close(); $('#txtIncoTerm').focus(); }) }
    //else if (PaymentType == "-1") { swal('alert', 'Please Select Payment Type', 'error').then(function () { swal.close(); $('#ddlPaymentType').focus(); }) }
    else if (Currency == "-1") { swal('alert', 'Please Select Currency', 'error').then(function () { swal.close(); $('#ddlCurrency').focus(); }) }
    else if (CreditLimit == "") { swal('alert', 'Please Enter Credit Limit', 'error').then(function () { swal.close(); $('#txtCreditLimit').focus(); }) }
    else if (OutStandingLimit == "") { swal('alert', 'Please Enter OutStanding Limit', 'error').then(function () { swal.close(); $('#txtOutStandingLimit').focus(); }) }
    else if (MinOrderQty == "") { swal('alert', 'Please Enter Minimum Order Quantity', 'error').then(function () { swal.close(); $('#txtMinOrderQty').focus(); }) }
    else if (OrderMinAmt == "") { swal('alert', 'Please Enter Order Min Amount', 'error').then(function () { swal.close(); $('#txtOrderMinAmt').focus(); }) }

    else {
        var obj = {
            rowid: ID, Capital: Capital, PaymentTermsID: PaymentTerms, BalanceID: Balancedays,
            IncotermsType: IncoTermType, Incoterms: IncoTerm, Currency: Currency, CreditLimit: CreditLimit,
            outstanding_limit: OutStandingLimit, MinimumOrderQuanity: MinOrderQty,order_min_amount: OrderMinAmt,
        }
        $.ajax({
            url: '/ThirdParty/AddVendorPaymentTerms/', dataType: 'json', type: 'Post',
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
                    e.preventDefault();
                    var link = $('#mytabs .active').next().children('a').attr('href');
                    $('#mytabs a[href="' + link + '"]').tab('show');
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
});
$('#btnNextTab4').click(function (e) {
    ShippingMethod = $("#ddlShippingMethod").val();
    ShippingRate = $("#txtShippingRate").val();
    ShippingLocation = $("#txtShippingLocation").val();
    ShippingAPIKeyTest = $("#txtShippingAPIKeyTest").val();
    ShippingAPISecretTest = $("#txtShippingAPISecretTest").val();
    ShippingAPIKeyProduction = $("#txtShippingAPIKeyProduction").val();
    ShippingAPISecretProduction = $("#txtShippingAPISecretProduction").val();
    ShippingLogin = $("#txtShippingLogin").val();
    ShippingPassword = $("#txtShippingPassword").val();

    if (ShippingMethod == "-1") { swal('alert', 'Please Select Shipping Method', 'error').then(function () { swal.close(); $('#ddlShippingMethod').focus(); }) }
    else if (ShippingRate == "") { swal('alert', 'Please Enter Rate', 'error').then(function () { swal.close(); $('#txtShippingRate').focus(); }) }
    else if (ShippingLocation == "") { swal('alert', 'Please Enter Location', 'error').then(function () { swal.close(); $('#txtShippingLocation').focus(); }) }
    else if (ShippingAPIKeyTest == "") { swal('alert', 'Please Enter API Key (Test)', 'error').then(function () { swal.close(); $('#txtShippingAPIKeyTest').focus(); }) }
    else if (ShippingAPISecretTest == "") { swal('alert', 'Please Enter API Secret (Test)', 'error').then(function () { swal.close(); $('#txtShippingAPISecretTest').focus(); }) }
    else if (ShippingAPIKeyProduction == "") { swal('alert', 'Please Enter API Key (Production)', 'error').then(function () { swal.close(); $('#txtShippingAPIKeyProduction').focus(); }) }
    else if (ShippingAPISecretProduction == "") { swal('alert', 'Please Enter API Secret (Production)', 'error').then(function () { swal.close(); $('#txtShippingAPISecretProduction').focus(); }) }
    else if (ShippingLogin == "") { swal('alert', 'Please Enter Login', 'error').then(function () { swal.close(); $('#txtShippingLogin').focus(); }) }
    else if (ShippingPassword == "") { swal('alert', 'Please Enter Password', 'error').then(function () { swal.close(); $('#txtShippingPassword').focus(); }) }
    else {
        var obj = {
            rowid: ID, fk_shipping_method: ShippingMethod, ShippingRate: ShippingRate, ShippingLocation: ShippingLocation,
            ShippingAPIKeyTest: ShippingAPIKeyTest, ShippingAPISecretTest: ShippingAPISecretTest, ShippingAPIKeyProduction: ShippingAPIKeyProduction,
            ShippingAPISecretProduction: ShippingAPISecretProduction,
            ShippingLogin: ShippingLogin, ShippingPassword: ShippingPassword,
        }
        $.ajax({
            url: '/ThirdParty/AddVendorShipping/', dataType: 'json', type: 'Post',
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
                    e.preventDefault();
                    var link = $('#mytabs .active').next().children('a').attr('href');
                    $('#mytabs a[href="' + link + '"]').tab('show');
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
});
$('#btnNextTab5').click(function (e) {
    TaxMethod = $("#ddlTaxMethod").val();
    DefaultTax = $("#txtDefaultTax").val();
    ShippingTax = $("#txtShippingTax").val();
    Calculatedtax = $("#txtCalculatedtax").val();
    ShippingTaxIncludedinprice = $("#chkShippingTaxIncludedinprice").prop("checked") ? 1 : 0;
    TaxIncludedinPrice = $("#chkTaxIncludedinPrice").prop("checked") ? 1 : 0;

    if (TaxMethod == "-1") { swal('alert', 'Please Select Tax Method', 'error').then(function () { swal.close(); $('#ddlTaxMethod').focus(); }) }
    else if (DefaultTax == "") { swal('alert', 'Please Enter Default Tax (%)', 'error').then(function () { swal.close(); $('#txtDefaultTax').focus(); }) }
    else if (ShippingTax == "") { swal('alert', 'Please Enter Shipping Tax (%)', 'error').then(function () { swal.close(); $('#txtShippingTax').focus(); }) }
    else if (Calculatedtax == "") { swal('alert', 'Please Enter Calculated tax', 'error').then(function () { swal.close(); $('#txtCalculatedtax ').focus(); }) }
    else {
        var obj = {
            rowid: ID, TaxMethod: TaxMethod, DefaultTax: DefaultTax, ShippingTax: ShippingTax, Calculatedtax: Calculatedtax,
            ShippingTaxIncludedinprice: ShippingTaxIncludedinprice,TaxIncludedinPrice: TaxIncludedinPrice,
        }
        $.ajax({
            url: '/ThirdParty/AddVendorTaxes/', dataType: 'json', type: 'Post',
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
                    e.preventDefault();
                    var link = $('#mytabs .active').next().children('a').attr('href');
                    $('#mytabs a[href="' + link + '"]').tab('show');
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
});
$('#btnNextTab6').click(function (e) {
    DiscountType1 = $("#ddlDiscountType1").val();
    DefaultDiscount = $("#txtDefaultDiscount").val();
    MinimumOrderAmount = $("#txtMinimumOrderAmount").val();
    AccountName = $("#txtAccountName").val();
    AccountEmail = $("#txtAccountEmail").val();
    DiscountType2 = $("#ddlDiscountType2").val();
    Discount = $("#txtDiscount").val();

    if (DiscountType1 == "-1") { swal('alert', 'Please Select Discount Type 1', 'error').then(function () { swal.close(); $('#ddlDiscountType1').focus(); }) }
    else if (DefaultDiscount == "") { swal('alert', 'Please Enter Default Discount (%)', 'error').then(function () { swal.close(); $('#txtDefaultDiscount').focus(); }) }
    else if (MinimumOrderAmount == "") { swal('alert', 'Please Enter Minimum order amount', 'error').then(function () { swal.close(); $('#txtMinimumOrderAmount').focus(); }) }
    else if (AccountName == "") { swal('alert', 'Please Enter Account Name', 'error').then(function () { swal.close(); $('#txtAccountName ').focus(); }) }
    else if (AccountEmail == "") { swal('alert', 'Please Enter Email', 'error').then(function () { swal.close(); $('#txtAccountEmail ').focus(); }) }
    else if (DiscountType2 == "-1") { swal('alert', 'Please Select Discount Type2 (Balance Net)', 'error').then(function () { swal.close(); $('#ddlDiscountType2').focus(); }) }
    else if (Discount == "") { swal('alert', 'Please Enter Discount (%)', 'error').then(function () { swal.close(); $('#txtDiscount ').focus(); }) }
    else {
        var obj = {
            rowid: ID, DiscountType1: DiscountType1, DefaultDiscount: DefaultDiscount, order_min_amount: MinimumOrderAmount, AccountName: AccountName,
            AccountEmail: AccountEmail, DiscountType2: DiscountType2, Discount: Discount,
        }
        $.ajax({
            url: '/ThirdParty/AddVendorTaxes/', dataType: 'json', type: 'Post',
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
                    e.preventDefault();
                    var link = $('#mytabs .active').next().children('a').attr('href');
                    $('#mytabs a[href="' + link + '"]').tab('show');
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
});
$('#btnNextTab7').click(function (e) {
    PaymentMethod = $("#ddlPaymentMethod").val();
    BankAccountName = $("#txtBankAccountName").val();
    BankAccountNumber = $("#txtBankAccountNumber").val();
    BankName = $("#txtBankName").val();
    BankRoutingNumber = $("#txtBankRoutingNumber").val();
    BankIBAN = $("#txtBankIBAN").val();
    BankSwift = $("#txtBankSwift").val();

    ChequeTitle = $("#txtChequeTitle").val();
    ChequeDescription = $("#txtChequeDescription").val();
    ChequeInstructions = $("#txtChequeInstructions").val();

    PPInvoiceAPIUsername = $("#txtPPInvoiceAPIUsername").val();
    PPInvoiceAPIPassword = $("#txtPPInvoiceAPIPassword").val();
    PPInvoiceAPISignature = $("#txtPPInvoiceAPISignature").val();

    PaypalTitle = $("#txtPaypalTitle").val();
    PaypalDescription = $("#txtPaypalDescription").val();
    PaypalEmail = $("#txtPaypalEmail").val();
    PaypalIPNEmailNotification = $("#txtPaypalIPNEmailNotification").val();
    PaypalReceiverEmail = $("#txtPaypalReceiverEmail").val();
    PaypalIdentitytoken = $("#txtPaypalIdentitytoken").val();
    PaypalPaymentAction = $("#ddlPaypalPaymentAction").val();
    PaypalAPIUserName = $("#txtPaypalAPIUserName").val();
    PaypalAPIPassword = $("#txtPaypalAPIPassword").val();
    PaypalAPISignature = $("#txtPaypalAPISignature").val();



    if (PaymentMethod == "-1") { swal('alert', 'Please Select Payment method', 'error').then(function () { swal.close(); $('#ddlPaymentMethod').focus(); }) }
    else if (PaymentMethod == "1" && BankAccountName == "") { swal('alert', 'Please Enter Account Name', 'error').then(function () { swal.close(); $('#txtBankAccountName').focus(); }) }
    else if (PaymentMethod == "1" && BankAccountNumber == "") { swal('alert', 'Please Enter Account Number', 'error').then(function () { swal.close(); $('#txtBankAccountNumber').focus(); }) }
    else if (PaymentMethod == "1" && BankName == "") { swal('alert', 'Please Enter Bank name', 'error').then(function () { swal.close(); $('#txtBankName').focus(); }) }
    else if (PaymentMethod == "1" && BankRoutingNumber == "") { swal('alert', 'Please Enter Account Name', 'error').then(function () { swal.close(); $('#txtBankRoutingNumber').focus(); }) }
    else if (PaymentMethod == "1" && BankIBAN == "") { swal('alert', 'Please Enter IBAN', 'error').then(function () { swal.close(); $('#txtBankIBAN').focus(); }) }
    else if (PaymentMethod == "1" && BankSwift == "") { swal('alert', 'Please Enter BIC/Swift', 'error').then(function () { swal.close(); $('#txtBankSwift').focus(); }) }

    else if (PaymentMethod == "3" && ChequeTitle == "") { swal('alert', 'Please Enter Title', 'error').then(function () { swal.close(); $('#txtChequeTitle').focus(); }) }
    else if (PaymentMethod == "3" && ChequeDescription == "") { swal('alert', 'Please Enter Description', 'error').then(function () { swal.close(); $('#txtChequeDescription').focus(); }) }
    else if (PaymentMethod == "3" && ChequeInstructions == "") { swal('alert', 'Please Enter Instructions', 'error').then(function () { swal.close(); $('#txtChequeInstructions').focus(); }) }

    else if (PaymentMethod == "6" && PPInvoiceAPIUsername == "") { swal('alert', 'Please Enter Paypal Invoice User Name', 'error').then(function () { swal.close(); $('#txtPPInvoiceAPIUsername').focus(); }) }
    else if (PaymentMethod == "6" && PPInvoiceAPIPassword == "") { swal('alert', 'Please Enter Paypal Invoice Password', 'error').then(function () { swal.close(); $('#txtPPInvoiceAPIPassword').focus(); }) }
    else if (PaymentMethod == "6" && PPInvoiceAPISignature == "") { swal('alert', 'Please Enter Paypal Invoice Signature', 'error').then(function () { swal.close(); $('#txtPPInvoiceAPISignature').focus(); }) }

    else if (PaymentMethod == "7" && PaypalTitle == "") { swal('alert', 'Please Enter Paypal Title', 'error').then(function () { swal.close(); $('#txtPaypalTitle').focus(); }) }
    else if (PaymentMethod == "7" && PaypalDescription == "") { swal('alert', 'Please Enter Description', 'error').then(function () { swal.close(); $('#txtPaypalDescription').focus(); }) }
    else if (PaymentMethod == "7" && PaypalEmail == "") { swal('alert', 'Please Enter Paypal email', 'error').then(function () { swal.close(); $('#txtPaypalEmail').focus(); }) }
    else if (PaymentMethod == "7" && PaypalIPNEmailNotification == "") { swal('alert', 'Please Enter IPN email notification', 'error').then(function () { swal.close(); $('#txtPaypalIPNEmailNotification').focus(); }) }
    else if (PaymentMethod == "7" && PaypalReceiverEmail == "") { swal('alert', 'Please Enter Receiver email', 'error').then(function () { swal.close(); $('#txtPaypalReceiverEmail').focus(); }) }
    else if (PaymentMethod == "7" && PaypalIdentitytoken == "") { swal('alert', 'Please Enter Paypal Identity token', 'error').then(function () { swal.close(); $('#txtPaypalIdentitytoken').focus(); }) }
    else if (PaymentMethod == "7" && PaypalPaymentAction == "-1") { swal('alert', 'Please Select Payment Action', 'error').then(function () { swal.close(); $('#ddlPaypalPaymentAction').focus(); }) }
    else if (PaymentMethod == "7" && PaypalAPIUserName == "") { swal('alert', 'Please Enter Paypal User Name', 'error').then(function () { swal.close(); $('#txtPaypalAPIUserName').focus(); }) }
    else if (PaymentMethod == "7" && PaypalAPIPassword == "") { swal('alert', 'Please Enter Paypal Password', 'error').then(function () { swal.close(); $('#txtPaypalAPIPassword').focus(); }) }
    else if (PaymentMethod == "7" && PaypalAPISignature == "") { swal('alert', 'Please Enter Paypal Signature', 'error').then(function () { swal.close(); $('#txtPaypalAPISignature').focus(); }) }

    else {
        var obj = {
            rowid: ID, PaymentMethod: PaymentMethod, BankAccountName: BankAccountName, BankAccountNumber: BankAccountNumber,
            BankName: BankName, BankRoutingNumber: BankRoutingNumber, BankIBAN: BankIBAN, BankSwift: BankSwift,
            ChequeTitle: ChequeTitle, ChequeDescription: ChequeDescription, ChequeInstructions: ChequeInstructions,
            PPInvoiceAPIUsername: PPInvoiceAPIUsername, PPInvoiceAPIPassword: PPInvoiceAPIPassword, PPInvoiceAPISignature: PPInvoiceAPISignature,
            PaypalTitle: PaypalTitle, PaypalDescription: PaypalDescription, PaypalEmail: PaypalEmail, PaypalIPNEmailNotification: PaypalIPNEmailNotification,
            PaypalReceiverEmail: PaypalReceiverEmail, PaypalIdentitytoken: PaypalIdentitytoken, PaypalPaymentAction: PaypalPaymentAction, PaypalAPIUserName: PaypalAPIUserName,
            PaypalAPIPassword: PaypalAPIPassword, PaypalAPISignature: PaypalAPISignature,

        }
        $.ajax({
            url: '/ThirdParty/AddPaymentMethods/', dataType: 'json', type: 'Post',
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
                    e.preventDefault();
                    var link = $('#mytabs .active').next().children('a').attr('href');
                    $('#mytabs a[href="' + link + '"]').tab('show');
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
});

$('#ddlIncoTerm').change(function () {
    var IncotermsTypeID = $('#ddlIncoTerm').val();
    var obj = { IncotermsTypeID: IncotermsTypeID };
    jQuery.ajax({
        url: "/ThirdParty/GetIncotermByID", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            $('#txtIncoTerm').val(data[0].short_description);
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });
})

function getVendorType() {
    $.ajax({
        url: "/ThirdParty/GetVendorType",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please Select Vendor Type</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlvendortype').html(opt);
        }

    });
}

function getIncoterm() {
    $.ajax({
        url: "/ThirdParty/GetIncoterm",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please Select IncoTerm</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlIncoTerm').html(opt);
        }

    });
}
function getPaymentTerm() {

    $.ajax({
        url: "/ThirdParty/GetPaymentTerm",
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
function getBalanceDays() {

    $.ajax({
        url: "/ThirdParty/GetBalanceDays",
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
function getDiscountType() {

    $.ajax({
        url: "/ThirdParty/GetDiscountType",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please Select Discount Type 2</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlDiscountType2').html(opt);
        }

    });
}
function getPaymentMethod() {

    $.ajax({
        url: "/ThirdParty/GetPaymentMethod",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please Select Payment Method</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlPaymentMethod').html(opt);
        }

    });
}
function getStatus() {
    var data = [
        { "ID": "1", "Text": "Open" },
        { "ID": "0", "Text": "Closed" },

    ];
    var items = "";
    $.each(data, function (index, value) {
        items += "<option value=" + this['ID'] + ">" + this['Text'] + "</option>";
    })
    $("#ddlStatus").html(items);
}
function getSalesTaxUsed() {
    var data = [
        { "ID": "1", "Text": "Yes" },
        { "ID": "0", "Text": "No" },

    ];
    var items = "";
    $.each(data, function (index, value) {
        items += "<option value=" + this['ID'] + ">" + this['Text'] + "</option>";
    })
    $("#ddlSalestaxused").html(items);
}
function getThirdPartyType() {
    var data = [
        { "ID": "5", "Text": "Governmental" },
        { "ID": "2", "Text": "Large company" },
        { "ID": "3", "Text": "Medium company" },
        { "ID": "100", "Text": "Other" },
        { "ID": "8", "Text": "Private individual" },
        { "ID": "4", "Text": "Small company" },

    ];
    var items = "";
    items += "<option value='-1'>-- Please select Third Party Type --</option>";
    $.each(data, function (index, value) {
        items += "<option value=" + this['ID'] + ">" + this['Text'] + "</option>";
    })
    $("#ddlThirdPartyType").html(items);
}
function getWorkforce() {
    var data = [
        { "ID": "1", "Text": "1 - 5" },
        { "ID": "2", "Text": "6 - 10" },
        { "ID": "3", "Text": "11 - 50" },
        { "ID": "4", "Text": "51 - 100" },
        { "ID": "5", "Text": "100 - 500" },
        { "ID": "6", "Text": "> 500" },

    ];
    var items = "";
    items += "<option value='-1'>-- Please select Workforce --</option>";
    $.each(data, function (index, value) {
        items += "<option value=" + this['ID'] + ">" + this['Text'] + "</option>";
    })
    $("#ddlWorkforce").html(items);
}

function getAssignedtoSalesRepresentative() {
    var data = [
        { "ID": "1", "Text": "SuperAdmin" },
    ];
    var items = "";
    items += "<option value='-1'>-- Please Select Sales Representative --</option>";
    $.each(data, function (index, value) {
        items += "<option value=" + this['Text'] + ">" + this['Text'] + "</option>";
    })
    $("#ddlSalesRepresentative").html(items);
}
function getShippingMethod() {
    $.ajax({
        url: "/ThirdParty/GetShippingMethod",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please Select Shipping Method</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlShippingMethod').html(opt);
        }

    });
}

document.getElementById('txtPhone').addEventListener('keyup', function (evt) {
    var phoneNumber = document.getElementById('txtPhone');
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    phoneNumber.value = phoneFormat(phoneNumber.value);
});
function phoneFormat(input) {
    input = input.replace(/\D/g, '');
    input = input.substring(0, 10);
    var size = input.length;
    if (size == 0) {
        input = input;
    } else if (size < 4) {
        input = '(' + input;
    } else if (size < 7) {
        input = '(' + input.substring(0, 3) + ') ' + input.substring(3, 6);
    } else {
        input = '(' + input.substring(0, 3) + ') ' + input.substring(3, 6) + ' - ' + input.substring(6, 10);
    }
    return input;
}
$("#btnSave").click(function () {
    var id = "";
    var LeadTime = "";
    var DaysofStock = "";
    $('#dtdata').find("input[type='text'][name='txtLeadTime']").each(function () {
        if (LeadTime != '') LeadTime += ','; LeadTime += $(this).val();
        if (id != '') id += ','; id += $(this).attr('id');
    });
    $('#dtdata').find("input[type='text'][name='txtDaysofStock']").each(function () {
        if (DaysofStock != '') DaysofStock += ','; DaysofStock += $(this).val();
    });
    saveVendor(id, LeadTime, DaysofStock);
    
});
function saveVendor(Settingid, LeadTime, DaysofStock) {
    ID = $("#hfid").val();
    VendorName = $("#txVendorName").val();
    AliasName = $("#txtAliasName").val();
    VendorType = $("#ddlvendortype").val();
    VendorCode = $("#txtVendorCode").val();
    Status = $("#ddlStatus").val();
    Address = $("#txtAddress").val();
    Address1 = $("#txtAddress1").val();
    City = $("#txtCity").val();
    State = $("#ddlState").val();
    StateName = $("#ddlState").find('option:selected').text();
    ZipCode = $("#txtZipCode").val();
    Country = $("#ddlCountry").val();
    Phone = $("#txtPhone").val();
    Fax = $("#txtFax").val();
    EMail = $("#txtEMail").val();
    Web = $("#txtWeb").val();
    Salestaxused = $("#ddlSalestaxused").val();
    ThirdPartyType = $("#ddlThirdPartyType").val();
    Workforce = $("#ddlWorkforce").val();
    BusinessEntityType = $("#txtBusinessEntityType").val();
    Capital = $("#txtCapital").val();
    SalesRepresentative = $("#ddlSalesRepresentative").val();
    PaymentTerms = $("#ddlPaymentTerms").val();
    Balancedays = $("#ddlBalancedays").val();
    PaymentDate = $("#txtPaymentDate").val();
    Currency = $("#ddlCurrency").val();
    EnableVendorUOM = $('#chkEnableVendorUOMrounding').prop("checked") ? 1 : 0;
    Unitsofmeasurment = $("input[type='radio'][name='Unitsofmeasurment']:checked").val();
    Minimumorderquanity = $("#txtminorderqty").val();
    DefaultTax = $("#txtDefaultTax").val();
    TaxIncludedinprice = $("#chkTaxIncludedinprice").prop("checked") ? 1 : 0;
    DefaultDiscount = $("#txtDefaultDiscount").val();
    CreditLimit = $("#txtCreditLimit").val();
    IncoTermType = $("#ddlIncoTerm").val();
    IncoTerm = $("#txtIncoTerm").val();
    VendorStatus = $("#chkVendorStatus").prop("checked") ? 1 : 0;
    OrderMinAmount = $("#txtorderminamt").val();
    ShippingMethod = $("#ddlshippingmethod").val();
    OutStandingLimit = $("#txtoutstandinglimit").val();
    console.log(VendorType);

    var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (VendorType == "-1") { swal('alert', 'Please Select Vendor Type', 'error').then(function () { swal.close(); $('#ddlvendortype').focus(); }) }
    else if (VendorName == "") { swal('alert', 'Please Enter Vendor Name', 'error').then(function () { swal.close(); $('#txVendorName').focus(); }) }
    else if (AliasName == "") { swal('alert', 'Please Enter Alias Name', 'error').then(function () { swal.close(); $('#txtAliasName').focus(); }) }
    else if (Status == "") { swal('alert', 'Please Enter Status', 'error').then(function () { swal.close(); $('#ddlStatus').focus(); }) }
    else if (Address == "") { swal('alert', 'Please Enter Address', 'error').then(function () { swal.close(); $('#txtAddress').focus(); }) }
    else if (City == "") { swal('alert', 'Please Enter City', 'error').then(function () { swal.close(); $('#txtCity').focus(); }) }
    else if (State == "") { swal('alert', 'Please Enter State', 'error').then(function () { swal.close(); $('#ddlState').focus(); }) }
    else if (ZipCode == "") { swal('alert', 'Please Enter ZipCode', 'error').then(function () { swal.close(); $('#txtZipCode').focus(); }) }
    else if (Country == "") { swal('alert', 'Please Enter Country', 'error').then(function () { swal.close(); $('#ddlCountry').focus(); }) }
    else if (Phone == "") { swal('alert', 'Please Enter Phone', 'error').then(function () { swal.close(); $('#txtPhone').focus(); }) }
    else if (EMail == "") { swal('alert', 'Please Enter EMail', 'error').then(function () { swal.close(); $('#txtEMail').focus(); }) }
    else if (!pattern.test(EMail)) { swal('alert', 'not a valid e-mail address', 'error').then(function () { swal.close(); $('#txtEMail').focus(); }) }
    else if (Web == "") { swal('alert', 'Please Enter Web', 'error').then(function () { swal.close(); $('#txtWeb').focus(); }) }
    else if (Salestaxused == "") { swal('alert', 'Please Select Sales tax used', 'error').then(function () { swal.close(); $('#ddlSalestaxused').focus(); }) }
    else if (ThirdPartyType == "-1") { swal('alert', 'Please Select Third Party Type', 'error').then(function () { swal.close(); $('#ddlThirdPartyType').focus(); }) }
    else if (Workforce == "-1") { swal('alert', 'Please Select Workforce', 'error').then(function () { swal.close(); $('#ddlWorkforce').focus(); }) }
    else if (BusinessEntityType == "") { swal('alert', 'Please Enter Business Entity Type', 'error').then(function () { swal.close(); $('#txtBusinessEntityType').focus(); }) }
    else if (Capital == "") { swal('alert', 'Please Enter Capital', 'error').then(function () { swal.close(); $('#txtCapital').focus(); }) }
    else if (IncoTermType == "-1") { swal('alert', 'Please Select IncoTerm', 'error').then(function () { swal.close(); $('#ddlIncoTerm').focus(); }) }
    else if (IncoTerm == "") { swal('alert', 'Please Enter IncoTerm', 'error').then(function () { swal.close(); $('#txtIncoTerm').focus(); }) }
    else if (Minimumorderquanity == "") { swal('alert', 'Please Enter Minimum Order Quantity', 'error').then(function () { swal.close(); $('#txtminorderqty').focus(); }) }
    else if (OrderMinAmount == "") { swal('alert', 'Please Enter Order Min Amount', 'error').then(function () { swal.close(); $('#txtorderminamt').focus(); }) }
    else if (ShippingMethod == "-1") { swal('alert', 'Please Select Shipping Method', 'error').then(function () { swal.close(); $('#ddlshippingmethod').focus(); }) }
    else if (OutStandingLimit == "") { swal('alert', 'Please Enter OutStanding Limit', 'error').then(function () { swal.close(); $('#txtoutstandinglimit').focus(); }) }


    else {
        var obj = {
            rowid: ID,
            Name: VendorName, vendor_type: VendorType, AliasName: AliasName, VendorCode: VendorCode, Status: Status, Address: Address,
            City: City, State: State, StateName: StateName, ZipCode: ZipCode, Country: Country, Phone: Phone, Fax: Fax, EMail: EMail, Web: Web,
            SalesTaxUsed: Salestaxused, ThirdPartyType: ThirdPartyType, Workforce: Workforce, BusinessEntityType: BusinessEntityType,
            Capital: Capital, SalesRepresentative: SalesRepresentative, Address1: Address1, PaymentTermsID: PaymentTerms, BalanceID: Balancedays ,
            PaymentDate: PaymentDate, Currency: Currency, EnableVendorUOM: EnableVendorUOM, UnitsofMeasurment:Unitsofmeasurment,
            MinimumOrderQuanity: Minimumorderquanity, DefaultTax: DefaultTax, TaxIncludedinPrice:TaxIncludedinprice,
            DefaultDiscount: DefaultDiscount, CreditLimit: CreditLimit, IncotermsType: IncoTermType, Incoterms: IncoTerm,
            WarehouseID: Settingid, LeadTime: LeadTime, DaysofStock: DaysofStock, VendorID: ID, VendorStatus: VendorStatus,
            order_min_amount: OrderMinAmount, fk_shipping_method: ShippingMethod, outstanding_limit: OutStandingLimit,

        }
        $.ajax({
            url: '/ThirdParty/AddVendor/', dataType: 'json', type: 'Post',
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
                    window.location = "../../ThirdParty/VendorList";
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
function GetVendorByID(id) {
    var rowid = id;
    if (rowid == "NewVendor") { $('#lbltitle').text("Add New Vendor"); } else { $('#lbltitle').text("Update Vendor"); }
    var obj =
        $.ajax({
            url: "/ThirdParty/GetVendorByID/" + rowid,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            success: function (data) {
                var d = JSON.parse(data);
                if (d.length > 0) {
                    $("#txVendorName").val(d[0].VendorName);
                    $("#txtAliasName").val(d[0].AliasName);
                    $("#ddlvendortype").val(d[0].vendor_type);
                    $("#txtVendorCode").val(d[0].VendorCode);
                    $("#ddlStatus").val(d[0].status);
                    $("#txtAddress").val(d[0].address);
                    $("#txtAddress1").val(d[0].address1);
                    $("#txtCity").val(d[0].town);
                    $("#ddlState").val(d[0].State);
                    $("#txtZipCode").val(d[0].zip);
                    $("#ddlCountry").val(d[0].Country);
                    $("#txtPhone").val(d[0].phone);
                    $("#txtFax").val(d[0].fax);
                    $("#txtEMail").val(d[0].email);
                    $("#txtWeb").val(d[0].url);
                    $("#ddlSalestaxused").val(d[0].Salestaxused);
                    $("#ddlThirdPartyType").val(d[0].ThirdPartyType);
                    $("#ddlWorkforce").val(d[0].Workforce);
                    $("#txtBusinessEntityType").val(d[0].BusinessEntityType);
                    $("#txtCapital").val(d[0].capital);
                    $("#ddlSalesRepresentative").val(d[0].SalesRepresentative);
                    $("#ddlState").empty().append('<option value="' + d[0].State + '" selected>' + d[0].StateName + '</option>');
                    $("#ddlState").select2({
                        allowClear: true, minimumInputLength: 3, placeholder: "Search State",
                        ajax: {
                            url: '/ThirdParty/GetState', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
                            data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
                            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.StateFullName, name: item.StateFullName, val: item.State, id: item.State } }) }; },
                            error: function (xhr, status, err) { }, cache: true
                        }
                    });
                    $("#ddlPaymentTerms").val(d[0].PaymentTermsID);
                    $("#ddlBalancedays").val(d[0].BalanceID);
                    $("#txtPaymentDate").val(d[0].PaymentDate);
                    $("#ddlCurrency").val(d[0].Currency);
                    d[0].EnableVendorUOM == true ? $('#chkEnableVendorUOMrounding').attr("checked", "checked") : "";
                    $('input:radio[value="' + d[0].UnitsofMeasurment + '"]').prop('checked', true);
                    $("#txtminorderqty").val(d[0].MinimumOrderQuanity);
                    $("#txtDefaultTax").val(d[0].DefaultTax);
                    d[0].TaxIncludedinPrice == true ? $('#chkTaxIncludedinprice').attr("checked", "checked") : "";
                    $("#txtDefaultDiscount").val(d[0].DefaultDiscount);
                    $("#txtCreditLimit").val(d[0].CreditLimit);
                    $("#ddlIncoTerm").val(d[0].IncotermsType);
                    $("#txtIncoTerm").val(d[0].Incoterms);
                    d[0].VendorStatus == true ? $('#chkVendorStatus').attr("checked", "checked") : "";
                    $("#txtoutstandinglimit").val(d[0].outstanding_limit);
                    $("#ddlshippingmethod").val(d[0].fk_shipping_method);
                    $("#txtorderminamt").val(d[0].order_min_amount);

                    
                }
            },
            error: function (msg) {

            }
        });

}
function getVendorCode() {
    var obj =
        $.ajax({
            url: "/ThirdParty/GetVendorCode/",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            success: function (data) {
                var d = JSON.parse(data);
                if (d.length > 0) {
                    $("#txtVendorCode").val(d[0].Code);
                }
            },
            error: function (msg) {

            }
        });

}
function ProductList() {
    var rowid = $("#hfid").val();
    var obj = { rowid: rowid };
    $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "asc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        sPaginationType: "full_numbers", searching: false, ordering: false, lengthChange: false, "paging": false, "bInfo": false,
        bAutoWidth: false, scrollX: false, scrollY: false,
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        sAjaxSource: "/ThirdParty/GetProductList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            $.ajax({
                type: "POST", url: sSource, async: true, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
                success: function (data) {
                    var dtOption = { aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
                async: false
            });
        },
        aoColumns: [
            { data: 'warehouse', title: 'Warehouse', sWidth: "40%" },
            {
                'data': 'LeadTime', sWidth: "30%",
                'render': function (id, type, full, meta) {
                    return '<input type="text" name="txtLeadTime" class="form-control" value="' + full.LeadTime + '" id="' + full.id + '"  />';
                }
            },
            {
                'data': 'DaysofStock', sWidth: "30%",
                'render': function (id, type, full, meta) {
                    return '<input type="text" name="txtDaysofStock" class="form-control" value="' + full.DaysofStock + '" />';
                }
            },
        ]
    });
}


//$("#btnSaveWarehouse").click(function () {
//    var id = "";
//    var LeadTime = "";
//    var DaysofStock = "";
//    $('#dtdata').find("input[type='text'][name='txtLeadTime']").each(function () {
//        if (LeadTime != '') LeadTime += ','; LeadTime += $(this).val();
//        if (id != '') id += ','; id += $(this).attr('id');
//    });
//    $('#dtdata').find("input[type='text'][name='txtDaysofStock']").each(function () {
//        if (DaysofStock != '') DaysofStock += ','; DaysofStock += $(this).val();
//    });
//    SaveWarehouse(id, LeadTime, DaysofStock);
//})

//function SaveWarehouse(id, LeadTime, DaysofStock) {
//    var VendorID = $('#hfid').val();
//    if (VendorID == 0) { swal('alert', 'Vendor not found', 'error') }
//    else {
//        var obj = { WarehouseID: id, LeadTime: LeadTime, DaysofStock: DaysofStock, VendorID: VendorID }
//        $.ajax({
//            url: '/ThirdParty/AddVendorSetting', dataType: 'json', type: 'Post',
//            contentType: "application/json; charset=utf-8",
//            data: JSON.stringify(obj),
//            dataType: "json",
//            beforeSend: function () {
//                $("#loader").show();
//            },
//            success: function (data) {
//                if (data.status == true) {
//                    swal('Alert!', data.message, 'success');
//                    window.location = "../../ThirdParty/VendorList";
//                }
//                else {
//                    swal('Alert!', data.message, 'error')
//                }
//            },
//            complete: function () {
//                $("#loader").hide();
//            },
//            error: function (error) {
//                swal('Error!', 'something went wrong', 'error');
//            },
//        })
//    }
//}