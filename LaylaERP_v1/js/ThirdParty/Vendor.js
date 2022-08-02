$(document).ready(function () {
    $("#loader").hide();
    $(".select2").select2();
    $("#txtContactPhone").mask("(999) 999-9999");
    $("#txtPhone").mask("(999) 999-9999");
    getNatureofJournal();
    getVendorType();
    getStatus();
    getSalesTaxUsed();
    getThirdPartyType();
    getWorkforce();
    getAssignedtoSalesRepresentative();
    getVendorCode();
    getPaymentTerm();
    getBalanceDays();
    //ProductList();
    getIncoterm();
    getWarehouse();
    getShippingMethod();
    getDiscountType();
    getPaymentMethod();
    VendorContactList();
    VendorWarehouseList();
    VendorRelatedProduct();
    VendorLinkedFiles();
   
    $(document).on('click', '#btnChange', function () { orderStatus(); });
    isEdit(true);

    $('#txtDate, #txtInvoiceDate').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'This Year': [moment().startOf('year'), moment().endOf('year')]
        },
        startDate: moment().subtract(1, 'month'), autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto"
    }, function (start, end, label) {
        $('#txtDate').val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
        PurchaseOrderGrid();
    });

    $('#txtvendorePaymentDate').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'This Year': [moment().startOf('year'), moment().endOf('year')]
        },
        startDate: moment().subtract(1, 'month'), autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto"
    }, function (start, end, label) {
        $('#txtvendorePaymentDate').val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
         
    });

    PurchaseOrderGrid();
    SalesOrderGrid();
    InvoiceGrid();
    $("#txtDefaultDiscount").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 6));
    });

    $("#txtDiscountMinimumOrderAmount").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    });
    $("#txtDiscount").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 6));
    });

})
function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}


$('#ddlDiscountType1').change(function () {
    let discount = $('#ddlDiscountType1').val();
    if (discount == "Percentage") {
        $('#lblDefaultDiscount').text('Default Discount (%)')
    }
    else {
        $('#lblDefaultDiscount').text('Default Discount')
    }
})
function getNatureofJournal() {
    $.ajax({
        url: "/Accounting/GetNatureofJournal",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please select nature of journal</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlNatureofJournal').html(opt);
        }

    });
}
$('input:checkbox').prop('checked', true);
$("#ddlPaymentMethod").change(function () {
    ShippingMethod = $("#ddlPaymentMethod").val();
    PaymentMethodBlock(ShippingMethod);
})
$("#ddlShippingMethod").change(function () {
    ShippingMethod = $("#ddlShippingMethod").val();
    ShippingMethodBlock(ShippingMethod);
})
function PaymentMethodBlock(PaymentMethod) {
    if (PaymentMethod == "1") {
        $("#bnk_details").css("display", "block");
        $("#cheq_payment").css("display", "none");
        $("#pay_strd").css("display", "none");
        $("#pay_invoice").css("display", "none");
    }
    if (PaymentMethod == "2") {
        $("#cheq_payment").css("display", "none");
        $("#bnk_details").css("display", "none");
        $("#pay_invoice").css("display", "none");
        $("#pay_strd").css("display", "none");
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
}
function ShippingMethodBlock(ShippingMethod) {
    if (ShippingMethod == "3") {
        $("#UPS").css("display", "block");
        $("#USPS").css("display", "none");
        $("#Fadex").css("display", "none");
    }
    else if (ShippingMethod == "2") {
        //if (!$('input:checkbox').is('checked')) {
        //    $('input:checkbox').prop('checked', true);
        //} else {
        //    $('input:checkbox').prop('checked', false);
        //}
        $("#USPS").css("display", "block");
        $("#UPS").css("display", "none");
        $("#Fadex").css("display", "none");
    }
    else if (ShippingMethod == "1") {
        $("#Fadex").css("display", "block");
        $("#USPS").css("display", "none");
        $("#UPS").css("display", "none");
    }
}
$('#btnReset').click(function () {
    $('#USPS input:checkbox').prop('checked', true);
    $('#USPS input:text').val('');
})
$('#btnNextTab1').click(function (e) {
    debugger
    var url = window.location.pathname;
    var URL = url.substring(url.lastIndexOf('/') + 1);
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
    StateName = $("#ddlState").find('option:selected').text();
    ZipCode = $("#txtZipCode").val();
    Country = $("#ddlCountry").val();
    Phone = $("#txtPhone").unmask().val();

    Fax = $("#txtFax").val();
    EMail = $("#txtEMail").val();
    Web = $("#txtWeb").val();
    WorkingHours = $("#txtWorkinghours").val();
    VendorStatus = $("#chkVendorStatus").prop("checked") ? 1 : 0;
    NatureofJournal = $("#ddlNatureofJournal").val();
    Password = $('#txtPassword').val();
    ConfirmPassword = $('#txtConfirmPassword').val();
    vendoruser_id = $("#vendoruserid").val();

    var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (VendorType == "-1") { swal('Alert', 'Please select vendor type', 'error').then(function () { swal.close(); $('#ddlvendortype').focus(); }) }
    else if (VendorName == "") { swal('Alert', 'Please enter vendor name', 'error').then(function () { swal.close(); $('#txVendorName').focus(); }) }
    else if (AliasName == "") { swal('Alert', 'Please enter alias name', 'error').then(function () { swal.close(); $('#txtAliasName').focus(); }) }
    else if (Address1 == "") { swal('Alert', 'Please enter address1', 'error').then(function () { swal.close(); $('#txtAddress1').focus(); }) }
    else if (City == "") { swal('Alert', 'Please enter city', 'error').then(function () { swal.close(); $('#txtCity').focus(); }) }
    else if (Status == "") { swal('Alert', 'Please enter status', 'error').then(function () { swal.close(); $('#ddlStatus').focus(); }) }
    else if (State == "") { swal('Alert', 'Please enter state', 'error').then(function () { swal.close(); $('#ddlState').focus(); }) }
    else if (ZipCode == "") { swal('Alert', 'Please enter zipcode', 'error').then(function () { swal.close(); $('#txtZipCode').focus(); }) }
    else if (Country == "-1") { swal('Alert', 'Please select country', 'error').then(function () { swal.close(); $('#ddlCountry').focus(); }) }
    else if (Phone == "") { swal('Alert', 'Please enter phone', 'error').then(function () { swal.close(); $('#txtPhone').focus(); }) }
    else if (EMail == "") { swal('Alert', 'Please enter email', 'error').then(function () { swal.close(); $('#txtEMail').focus(); }) }
    //else if (URL == "NewVendor")
    //{
    //    if (Password == "") { swal('Alert', 'Please enter password', 'error').then(function () { swal.close(); $('#txtPassword').focus(); }) }
    //    else if (ConfirmPassword == "") {swal('Alert', 'Please enter confirm password', 'error').then(function () { swal.close(); $('#txtConfirmPassword').focus(); });}
    //    else if (Password !== ConfirmPassword) {swal('Alert', 'Confirm password is not matching.', 'error').then(function () { swal.close(); $('#txtConfirmPassword').focus(); });}
    //}
    else {
        var obj = {
            rowid: ID, vendor_type: VendorType, VendorCode: VendorCode,
            Name: VendorName, AliasName: AliasName, Status: Status, Address: Address1, Address1: Address2,
            City: City, State: State, StateName: StateName, ZipCode: ZipCode, Country: Country, Phone: Phone, Fax: Fax, EMail: EMail, Web: Web,
            Workinghours: WorkingHours, VendorStatus: VendorStatus, NatureofJournal: NatureofJournal, pwd: ConfirmPassword, fk_user: vendoruser_id
        }
        if (URL == "NewVendor") {
            if (Password == "") { swal('Alert', 'Please enter password', 'error').then(function () { swal.close(); return false }) }
            else if (ConfirmPassword == "") { swal('Alert', 'Please enter confirm password', 'error').then(function () { swal.close(); return false }); }
            else if (Password !== ConfirmPassword) { swal('Alert', 'Confirm password is not matching.', 'error').then(function () { swal.close(); return false }); }
            else {
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
                            $("#txtContactPhone").mask("(999) 999-9999");
                            $("#txtPhone").mask("(999) 999-9999");
                            //swal('Alert!', data.message, 'success');
                            var link = $('#mytabs .active').next().children('a').attr('href');
                            $('#mytabs a[href="' + link + '"]').tab('show');
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
        else {
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
                        $("#txtContactPhone").mask("(999) 999-9999");
                        $("#txtPhone").mask("(999) 999-9999");
                        //swal('Alert!', data.message, 'success');
                        var link = $('#mytabs .active').next().children('a').attr('href');
                        $('#mytabs a[href="' + link + '"]').tab('show');
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
});
$('#btnNextTab2').click(function (e) {
    
    var link = $('#mytabs .active').next().children('a').attr('href');
    $('#mytabs a[href="' + link + '"]').tab('show');
});
$('#btnNextTab3').click(function (e) {
    ID = $("#hfid").val();
    Capital = $("#txtCapital").val(); PaymentTerms = $("#ddlPaymentTerms").val(); Balancedays = $("#ddlBalancedays").val();
    IncoTermType = $("#ddlIncoTerm").val(); IncoTerm = $("#txtIncoTerm").val(); //PaymentType = $("#ddlPaymentType").val();
    Currency = $("#ddlCurrency").val(); CreditLimit = $("#txtCreditLimit").val(); OutStandingLimit = $("#txtOutStandingLimit").val();
    MinOrderQty = $("#txtMinOrderQty").val(); OrderMinAmt = $("#txtOrderMinAmt").val(); 
     // payment method - bank details, paypal and cash
    PaymentMethod = $("#ddlPaymentMethod").val(); BankAccountName = $("#txtBankAccountName").val(); BankAccountNumber = $("#txtBankAccountNumber").val();
    BankName = $("#txtBankName").val(); BankRoutingNumber = $("#txtBankRoutingNumber").val(); BankIBAN = $("#txtBankIBAN").val();
    BankSwift = $("#txtBankSwift").val();
    // check details
    ChequeTitle = $("#txtChequeTitle").val(); ChequeDescription = $("#txtChequeDescription").val(); ChequeInstructions = $("#txtChequeInstructions").val();
    // Paypal Invoice
    PPInvoiceAPIUsername = $("#txtPPInvoiceAPIUsername").val(); PPInvoiceAPIPassword = $("#txtPPInvoiceAPIPassword").val(); PPInvoiceAPISignature = $("#txtPPInvoiceAPISignature").val();
    // Paypal Standard
    PaypalTitle = $("#txtPaypalTitle").val(); PaypalDescription = $("#txtPaypalDescription").val(); PaypalEmail = $("#txtPaypalEmail").val();
    PaypalProduction = $("#chkPaypalProduction").prop("checked") ? 1 : 0; PaypalIPNEmailNotification = $("#txtPaypalIPNEmailNotification").val();
    PaypalReceiverEmail = $("#txtPaypalReceiverEmail").val(); PaypalIdentitytoken = $("#txtPaypalIdentitytoken").val(); PaypalPaymentAction = $("#ddlPaypalPaymentAction").val(); 
    PaypalAPIUserName = $("#txtPaypalAPIUserName").val(); PaypalAPIPassword = $("#txtPaypalAPIPassword").val(); PaypalAPISignature = $("#txtPaypalAPISignature").val();

    if (PaymentTerms == "-1") { swal('alert', 'Please select payment terms', 'error').then(function () { swal.close(); $('#ddlPaymentTerms').focus(); }) }
    else if (Balancedays == "-1") { swal('alert', 'Please select balance net', 'error').then(function () { swal.close(); $('#ddlBalancedays').focus(); }) }
   
    else {
        var obj = {
            rowid: ID, Capital: Capital, PaymentTermsID: PaymentTerms, BalanceID: Balancedays, IncotermsType: IncoTermType, Incoterms: IncoTerm,
            Currency: Currency, CreditLimit: CreditLimit, outstanding_limit: OutStandingLimit, MinimumOrderQuanity: MinOrderQty, order_min_amount: OrderMinAmt,
            // payment method - bank details, paypal and cash
            Paymentmethod: PaymentMethod, BankAccountName: BankAccountName, BankAccountNumber: BankAccountNumber,
            BankName: BankName, BankRoutingNumber: BankRoutingNumber, BankIBAN: BankIBAN, BankSwift: BankSwift,
            // check details
            ChequeTitle: ChequeTitle, ChequeDescription: ChequeDescription, ChequeInstructions: ChequeInstructions,
            //Paypal Invoice
            PaypalInvoiceAPIUsername: PPInvoiceAPIUsername, PaypalInvoiceAPIPassword: PPInvoiceAPIPassword, PaypalInvoiceAPISignature: PPInvoiceAPISignature,
            //Paypal standard
            PaypalTitle: PaypalTitle, PaypalDescription: PaypalDescription, PaypalEmail: PaypalEmail, PaypalProduction: PaypalProduction, PaypalIPNEmailNotification: PaypalIPNEmailNotification,
            PaypalReceiverEmail: PaypalReceiverEmail, PaypalIdentitytoken: PaypalIdentitytoken, PaypalPaymentAction: PaypalPaymentAction, PaypalAPIUserName: PaypalAPIUserName,
            PaypalAPIPassword: PaypalAPIPassword, PaypalAPISignature: PaypalAPISignature,
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
                    //swal('Alert!', data.message, 'success');
                    //$("#tab_3").find(":input").each(function () {
                    //    switch (this.type) {
                    //        case "text": case "email": case "textarea": case "tel": $(this).val(''); break;
                    //    }
                    //});
                    //$("#tab_3 option[value='-1']").attr('selected', true)
                    //e.preventDefault();
                    var link = $('#mytabs .active').next().children('a').attr('href');
                    $('#mytabs a[href="' + link + '"]').tab('show');
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
});
$('#btnNextTab4').click(function (e) {
    ID = $("#hfid").val();
    ShippingMethod = $("#ddlShippingMethod").val();
    ShippingRate = $("#txtShippingRate").val();
    ShippingLocation = $("#txtShippingLocation").val();
    FedexAccountNumber = $("#txtFedexAccountNumber").val();
    FedexMeterNumber = $("#txtFedexMeterNumber").val();
    FedexWebServicesKey = $("#txtFedexWebServicesKey").val();
    FedexWebServicesPassword = $("#txtFedexWebServicesPassword").val();
    FedexMethodType = $("#ddlFedexMethodType").val();
    FedexMethodEnable = $("#chkFadexMethodEnable").prop("checked") ? 1 : 0;
    FedexCustomServices = $("#chkFadexCustomServices").prop("checked") ? 1 : 0;
    FedexDebugMode = $("#chkFadexDebugMode").prop("checked") ? 1 : 0;
    UPSUserID = $("#txtUPSUserID").val();
    UPSPassword = $("#txtUPSPassword").val();
    UPSAccessKey = $("#txtUPSAccessKey").val();
    UPSAccountNumber = $("#txtUPSAccountNumber").val();
    UPSOriginPostcode = $("#txtUPSOriginPostcode").val();
    UPSOriginCountry = $("#txtUPSOriginCountry").val();
    UPSAPILicenceKey = $("#txtUPSAPILicenceKey").val();
    UPSLicenceEmail = $("#txtUPSLicenceEmail").val();
    UPSEnable = $("#chkUPSEnable").prop("checked") ? 1 : 0;
    UPSMeasurementUnits = $("#ddlUPSMeasurementUnits").val();
    UPSEnableDebugMode = $("#chkUPSEnableDebugMode").prop("checked") ? 1 : 0;
    USPSEnable = $("#chkUSPSEnableDisable").prop("checked") ? 1 : 0;
    USPSPostcode = $("#txtUSPSPostcode").val();
    USPSUserID = $("#txtUSPSUserID").val();
    USPSCommercialrates = $("#chkUSPSCommercialrates").prop("checked") ? 1 : 0;
    USPSPacking = $("#chkUSPSPacking").prop("checked") ? 1 : 0;
    USPSPriorityMailExpressTitle = $("#txtUSPSPriorityMailExpressTitle").val();
    USPSPriorityMailExpress = $("#chkPriorityMailExpress").prop("checked") ? 1 : 0;
    USPSPriorityMailExpressHoldforPickup = $("#chkPriorityMailExpressHoldforPickup").prop("checked") ? 1 : 0;
    USPSPriorityMailExpressSundayHoliday = $("#chkPriorityMailExpressSundayHoliday").prop("checked") ? 1 : 0;
    USPSPriorityMailTitle = $("#txtUSPSPriorityMailTitle").val();
    USPSPriorityMail = $("#chkPriorityMail").prop("checked") ? 1 : 0;
    USPSPriorityMailHoldForPickup = $("#chkPriorityMailHoldforPickup").prop("checked") ? 1 : 0;
    USPSPriorityMailKeysandIDs = $("#chkPriorityMailKeysandIDs").prop("checked") ? 1 : 0;
    USPSPriorityMailRegionalRateBoxA = $("#chkPriorityMailRegionalRateBoxA").prop("checked") ? 1 : 0;
    USPSPriorityMailRegionalRateBoxAHoldForPickup = $("#chkPriorityMailRegionalRateBoxAHoldForPickup").prop("checked") ? 1 : 0;
    USPSPriorityMailRegionalRateBoxB = $("#chkPriorityMailRegionalRateBoxB").prop("checked") ? 1 : 0;
    USPSPriorityMailRegionalRateBoxBHoldForPickup = $("#chkPriorityMailRegionalRateBoxBHoldForPickup").prop("checked") ? 1 : 0;
    FirstClassMailTitle = $("#txtUSPSFirstClassMailTitle").val();
    FirstClassMailPostcards = $("#chkUSPSFirstClassMailPostcards").prop("checked") ? 1 : 0;
    FirstClassMailLetter = $("#chkUSPSFirstClassMailLetter").prop("checked") ? 1 : 0;
    FirstClassMailLargeEnvelope = $("#chkUSPSFirstClassMailLargeEnvelope").prop("checked") ? 1 : 0;
    FirstClassMailParcel = $("#chkUSPSFirstClassMailParcel").prop("checked") ? 1 : 0;
    FirstClassMailLargePostcards = $("#chkUSPSFirstClassMailLargePostcards").prop("checked") ? 1 : 0;
    FirstClassMailKeysandIDs = $("#chkUSPSFirstClassMailKeysandIDs").prop("checked") ? 1 : 0;
    FirstClassMailPackageService = $("#chkUSPSFirstClassMailPackageService").prop("checked") ? 1 : 0;
    FirstClassMailPackageServiceHoldForPickup = $("#chkUSPSFirstClassMailPackageServiceHoldForPickup").prop("checked") ? 1 : 0;
    FirstClassMailMeteredLetter = $("#chkUSPSFirstClassMailMeteredLetter").prop("checked") ? 1 : 0;


    var obj = {
        rowid: ID, ShippingMethodID: ShippingMethod, ShippingRate: ShippingRate, ShippingLocation: ShippingLocation, FedexAccountNumber: FedexAccountNumber, FedexMeterNumber: FedexMeterNumber, FedexWebServicesKey: FedexWebServicesKey,
        FedexWebServicesPassword: FedexWebServicesPassword, FedexMethodType: FedexMethodType, FedexMethodEnable: FedexMethodEnable,
        FedexCustomServices: FedexCustomServices, FedexDebugMode: FedexDebugMode, UPSUserID: UPSUserID, UPSPassword: UPSPassword, UPSAccessKey: UPSAccessKey, UPSAccountNumber: UPSAccountNumber,
        UPSOriginPostcode: UPSOriginPostcode, UPSOriginCountry: UPSOriginCountry, UPSAPILicenceKey: UPSAPILicenceKey, UPSEnableDebugMode: UPSEnableDebugMode, UPSEnable: UPSEnable, UPSMeasurementUnits: UPSMeasurementUnits,
        UPSOriginPostcode: UPSOriginPostcode, USPSEnable: USPSEnable, USPSPostcode: USPSPostcode, USPSUserID: USPSUserID, USPSCommercialrates: USPSCommercialrates, USPSPacking: USPSPacking,
        USPSPriorityMailExpressTitle: USPSPriorityMailExpressTitle, USPSPriorityMailExpress: USPSPriorityMailExpress, USPSPriorityMailExpressHoldforPickup: USPSPriorityMailExpressHoldforPickup,
        USPSPriorityMailExpressSundayHoliday: USPSPriorityMailExpressSundayHoliday, USPSPriorityMailTitle: USPSPriorityMailTitle, USPSPriorityMail: USPSPriorityMail,
        USPSPriorityMailHoldForPickup: USPSPriorityMailHoldForPickup, USPSPriorityMailKeysandIDs: USPSPriorityMailKeysandIDs, USPSPriorityMailRegionalRateBoxA: USPSPriorityMailRegionalRateBoxA,
        USPSPriorityMailRegionalRateBoxAHoldForPickup: USPSPriorityMailRegionalRateBoxAHoldForPickup, USPSPriorityMailRegionalRateBoxB: USPSPriorityMailRegionalRateBoxB, USPSPriorityMailRegionalRateBoxBHoldForPickup: USPSPriorityMailRegionalRateBoxBHoldForPickup,
        FirstClassMailTitle: FirstClassMailTitle, FirstClassMailPostcards: FirstClassMailPostcards,
        FirstClassMailLetter: FirstClassMailLetter, FirstClassMailLargeEnvelope: FirstClassMailLargeEnvelope, FirstClassMailParcel: FirstClassMailParcel,
        FirstClassMailLargePostcards: FirstClassMailLargePostcards, FirstClassMailKeysandIDs: FirstClassMailKeysandIDs, FirstClassMailPackageService: FirstClassMailPackageService,
        FirstClassMailPackageServiceHoldForPickup: FirstClassMailPackageServiceHoldForPickup, FirstClassMailMeteredLetter: FirstClassMailMeteredLetter,
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
                //swal('Alert!', data.message, 'success');
                //$("#tab_4").find(":input").each(function () {
                //    switch (this.type) {
                //        case "text": case "email": case "textarea": case "tel": $(this).val(''); break;
                //    }
                //});
                //$("#tab_4 option[value='-1']").attr('selected', true)
                //e.preventDefault();
                var link = $('#mytabs .active').next().children('a').attr('href');
                $('#mytabs a[href="' + link + '"]').tab('show');
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

});
$('#btnNextTab5').click(function (e) {
    ID = $("#hfid").val();
    TaxMethod = $("#ddlTaxMethod").val();
    DefaultTax = $("#txtDefaultTax").val();
    ShippingTax = $("#txtShippingTax").val();
    Calculatedtax = $("#txtCalculatedtax").val();
    ShippingTaxIncludedinprice = $("#chkShippingTaxIncludedinprice").prop("checked") ? 1 : 0;
    TaxIncludedinPrice = $("#chkTaxIncludedinPrice").prop("checked") ? 1 : 0;

    //if (TaxMethod == "-1") { swal('alert', 'Please Select Tax Method', 'error').then(function () { swal.close(); $('#ddlTaxMethod').focus(); }) }
    //else if (DefaultTax == "") { swal('alert', 'Please Enter Default Tax (%)', 'error').then(function () { swal.close(); $('#txtDefaultTax').focus(); }) }
    //else if (ShippingTax == "") { swal('alert', 'Please Enter Shipping Tax (%)', 'error').then(function () { swal.close(); $('#txtShippingTax').focus(); }) }
    //else if (Calculatedtax == "") { swal('alert', 'Please Enter Calculated tax', 'error').then(function () { swal.close(); $('#txtCalculatedtax ').focus(); }) }
    //else { }
    var obj = {
        rowid: ID, TaxMethod: TaxMethod, DefaultTax: DefaultTax, ShippingTax: ShippingTax, Calculatedtax: Calculatedtax,
        ShippingTaxIncludedinprice: ShippingTaxIncludedinprice, TaxIncludedinPrice: TaxIncludedinPrice,
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
                //swal('Alert!', data.message, 'success');
                //$("#tab_5").find(":input").each(function () {
                //    switch (this.type) {
                //        case "text": case "email": case "textarea": case "tel": $(this).val(''); break;
                //    }
                //});
                //$("#tab_5 option[value='-1']").attr('selected', true)
                //e.preventDefault();
                var link = $('#mytabs .active').next().children('a').attr('href');
                $('#mytabs a[href="' + link + '"]').tab('show');
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
});
$('#btnNextTab6').click(function (e) {
    ID = $("#hfid").val();
    DiscountType1 = $("#ddlDiscountType1").val();
    DefaultDiscount = $("#txtDefaultDiscount").val();
    MinimumOrderAmount = $("#txtDiscountMinimumOrderAmount").val();
    AccountName = $("#txtAccountName").val();
    AccountEmail = $("#txtAccountEmail").val();
    DiscountType2 = $("#ddlDiscountType2").val();
    Discount = $("#txtDiscount").val();
    let defdiscount = parseInt(DefaultDiscount) || 0;
    let discount2 = parseInt(Discount) || 0;
    //var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if ((DiscountType1 == "Fixed" || DiscountType1 == "Percentage") && DiscountType2 > 0 ) { swal('alert', 'Please select one discount type ', 'error').then(function () { swal.close(); $('#ddlDiscountType1').focus(); }) }
    else if (parseInt(Discount) > 0 && parseInt(DefaultDiscount) > 0) { swal('alert', 'Please enter one discount (%)', 'error').then(function () { swal.close(); $('#txtDefaultDiscount').focus(); }) }
    else if ((DiscountType1 == "Fixed" || DiscountType1 == "Percentage") && defdiscount == 0) { swal('alert', 'Please enter default discount', 'error').then(function () { swal.close(); $('#txtMinimumOrderAmount').focus(); }) }
    else if (DiscountType2 > 0 && discount2 == 0) { swal('alert', 'Please enter discount 2', 'error').then(function () { swal.close(); $('#txtMinimumOrderAmount').focus(); }) }
    //else if (AccountName == "") { swal('alert', 'Please enter account name', 'error').then(function () { swal.close(); $('#txtAccountName ').focus(); }) }
    //else if (AccountEmail == "") { swal('alert', 'Please enter email', 'error').then(function () { swal.close(); $('#txtAccountEmail ').focus(); }) }
    //else if (!pattern.test(AccountEmail)) { swal('alert', 'not a valid e-mail address', 'error').then(function () { swal.close(); $('#txtAccountEmail').focus(); }) }
    //else if (DiscountType2 == "-1") { swal('alert', 'Please select discount type2 (Balance Net)', 'error').then(function () { swal.close(); $('#ddlDiscountType2').focus(); }) }
    //else if (Discount == "") { swal('alert', 'Please enter discount (%)', 'error').then(function () { swal.close(); $('#txtDiscount ').focus(); }) }
    else {
        var obj = {
            rowid: ID, DiscountType1: DiscountType1, DefaultDiscount: DefaultDiscount, DiscountMinimumOrderAmount: MinimumOrderAmount, AccountName: AccountName,
            AccountEmail: AccountEmail, DiscountType2: DiscountType2, Discount: Discount,
        }
        $.ajax({
            url: '/ThirdParty/AddVendorDiscount/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (data) {
                if (data.status == true) {
                    //swal('Alert!', data.message, 'success');
                    //$("#tab_6").find(":input").each(function () {
                    //    switch (this.type) {
                    //        case "text": case "email": case "textarea": case "tel": $(this).val(''); break;
                    //    }
                    //});
                    //$("#tab_6 option[value='-1']").attr('selected', true)
                    //e.preventDefault();
                    var link = $('#mytabs .active').next().children('a').attr('href');
                    $('#mytabs a[href="' + link + '"]').tab('show');
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
});
//$('#btnNextTab7').click(function (e) {
//    ID = $("#hfid").val();
//    PaymentMethod = $("#ddlPaymentMethod").val();
//    BankAccountName = $("#txtBankAccountName").val();
//    BankAccountNumber = $("#txtBankAccountNumber").val();
//    BankName = $("#txtBankName").val();
//    BankRoutingNumber = $("#txtBankRoutingNumber").val();
//    BankIBAN = $("#txtBankIBAN").val();
//    BankSwift = $("#txtBankSwift").val();

//    ChequeTitle = $("#txtChequeTitle").val();
//    ChequeDescription = $("#txtChequeDescription").val();
//    ChequeInstructions = $("#txtChequeInstructions").val();

//    PPInvoiceAPIUsername = $("#txtPPInvoiceAPIUsername").val();
//    PPInvoiceAPIPassword = $("#txtPPInvoiceAPIPassword").val();
//    PPInvoiceAPISignature = $("#txtPPInvoiceAPISignature").val();

//    PaypalTitle = $("#txtPaypalTitle").val();
//    PaypalDescription = $("#txtPaypalDescription").val();
//    PaypalEmail = $("#txtPaypalEmail").val();
//    PaypalProduction = $("#chkPaypalProduction").prop("checked") ? 1 : 0;
//    PaypalIPNEmailNotification = $("#txtPaypalIPNEmailNotification").val();
//    PaypalReceiverEmail = $("#txtPaypalReceiverEmail").val();
//    PaypalIdentitytoken = $("#txtPaypalIdentitytoken").val();
//    PaypalPaymentAction = $("#ddlPaypalPaymentAction").val();
//    PaypalAPIUserName = $("#txtPaypalAPIUserName").val();
//    PaypalAPIPassword = $("#txtPaypalAPIPassword").val();
//    PaypalAPISignature = $("#txtPaypalAPISignature").val();


//    //var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
//    //if (PaymentMethod == "-1") { swal('alert', 'Please Select Payment method', 'error').then(function () { swal.close(); $('#ddlPaymentMethod').focus(); }) }
//    //else if (PaymentMethod == "1" && BankAccountName == "") { swal('alert', 'Please enter account name', 'error').then(function () { swal.close(); $('#txtBankAccountName').focus(); }) }
//    //else if (PaymentMethod == "1" && BankAccountNumber == "") { swal('alert', 'Please enter account number', 'error').then(function () { swal.close(); $('#txtBankAccountNumber').focus(); }) }
//    //else if (PaymentMethod == "1" && BankName == "") { swal('alert', 'Please enter bank name', 'error').then(function () { swal.close(); $('#txtBankName').focus(); }) }
//    //else if (PaymentMethod == "1" && BankRoutingNumber == "") { swal('alert', 'Please enter account name', 'error').then(function () { swal.close(); $('#txtBankRoutingNumber').focus(); }) }
//    //else if (PaymentMethod == "1" && BankIBAN == "") { swal('alert', 'Please enter IBAN', 'error').then(function () { swal.close(); $('#txtBankIBAN').focus(); }) }
//    //else if (PaymentMethod == "1" && BankSwift == "") { swal('alert', 'Please enter BIC/Swift', 'error').then(function () { swal.close(); $('#txtBankSwift').focus(); }) }

//    //else if (PaymentMethod == "3" && ChequeTitle == "") { swal('alert', 'Please enter Title', 'error').then(function () { swal.close(); $('#txtChequeTitle').focus(); }) }
//    //else if (PaymentMethod == "3" && ChequeDescription == "") { swal('alert', 'Please Enter Description', 'error').then(function () { swal.close(); $('#txtChequeDescription').focus(); }) }
//    //else if (PaymentMethod == "3" && ChequeInstructions == "") { swal('alert', 'Please Enter Instructions', 'error').then(function () { swal.close(); $('#txtChequeInstructions').focus(); }) }

//    //else if (PaymentMethod == "6" && PPInvoiceAPIUsername == "") { swal('alert', 'Please Enter Paypal Invoice User Name', 'error').then(function () { swal.close(); $('#txtPPInvoiceAPIUsername').focus(); }) }
//    //else if (PaymentMethod == "6" && PPInvoiceAPIPassword == "") { swal('alert', 'Please Enter Paypal Invoice Password', 'error').then(function () { swal.close(); $('#txtPPInvoiceAPIPassword').focus(); }) }
//    //else if (PaymentMethod == "6" && PPInvoiceAPISignature == "") { swal('alert', 'Please Enter Paypal Invoice Signature', 'error').then(function () { swal.close(); $('#txtPPInvoiceAPISignature').focus(); }) }

//    //else if (PaymentMethod == "7" && PaypalTitle == "") { swal('alert', 'Please Enter Paypal Title', 'error').then(function () { swal.close(); $('#txtPaypalTitle').focus(); }) }
//    //else if (PaymentMethod == "7" && PaypalDescription == "") { swal('alert', 'Please Enter Description', 'error').then(function () { swal.close(); $('#txtPaypalDescription').focus(); }) }
//    //else if (PaymentMethod == "7" && PaypalEmail == "") { swal('alert', 'Please Enter Paypal email', 'error').then(function () { swal.close(); $('#txtPaypalEmail').focus(); }) }
//    //else if (PaymentMethod == "7" && !pattern.test(PaypalEmail)) { swal('alert', 'not a valid e-mail address', 'error').then(function () { swal.close(); $('#txtPaypalEmail').focus(); }) }
//    //else if (PaymentMethod == "7" && PaypalIPNEmailNotification == "") { swal('alert', 'Please Enter IPN email notification', 'error').then(function () { swal.close(); $('#txtPaypalIPNEmailNotification').focus(); }) }
//    //else if (PaymentMethod == "7" && !pattern.test(PaypalIPNEmailNotification)) { swal('alert', 'not a valid e-mail address', 'error').then(function () { swal.close(); $('#txtPaypalIPNEmailNotification').focus(); }) }
//    //else if (PaymentMethod == "7" && PaypalReceiverEmail == "") { swal('alert', 'Please Enter Receiver email', 'error').then(function () { swal.close(); $('#txtPaypalReceiverEmail').focus(); }) }
//    //else if (PaymentMethod == "7" && !pattern.test(PaypalReceiverEmail)) { swal('alert', 'not a valid e-mail address', 'error').then(function () { swal.close(); $('#txtPaypalReceiverEmail').focus(); }) }
//    //else if (PaymentMethod == "7" && PaypalIdentitytoken == "") { swal('alert', 'Please Enter Paypal Identity token', 'error').then(function () { swal.close(); $('#txtPaypalIdentitytoken').focus(); }) }
//    //else if (PaymentMethod == "7" && PaypalPaymentAction == "-1") { swal('alert', 'Please Select Payment Action', 'error').then(function () { swal.close(); $('#ddlPaypalPaymentAction').focus(); }) }
//    //else if (PaymentMethod == "7" && PaypalAPIUserName == "") { swal('alert', 'Please Enter Paypal User Name', 'error').then(function () { swal.close(); $('#txtPaypalAPIUserName').focus(); }) }
//    //else if (PaymentMethod == "7" && PaypalAPIPassword == "") { swal('alert', 'Please Enter Paypal Password', 'error').then(function () { swal.close(); $('#txtPaypalAPIPassword').focus(); }) }
//    //else if (PaymentMethod == "7" && PaypalAPISignature == "") { swal('alert', 'Please Enter Paypal Signature', 'error').then(function () { swal.close(); $('#txtPaypalAPISignature').focus(); }) }

//    //else { }

//    var obj = {
//        rowid: ID, Paymentmethod: PaymentMethod, BankAccountName: BankAccountName, BankAccountNumber: BankAccountNumber,
//        BankName: BankName, BankRoutingNumber: BankRoutingNumber, BankIBAN: BankIBAN, BankSwift: BankSwift,
//        ChequeTitle: ChequeTitle, ChequeDescription: ChequeDescription, ChequeInstructions: ChequeInstructions,
//        PaypalInvoiceAPIUsername: PPInvoiceAPIUsername, PaypalInvoiceAPIPassword: PPInvoiceAPIPassword, PaypalInvoiceAPISignature: PPInvoiceAPISignature,
//        PaypalTitle: PaypalTitle, PaypalDescription: PaypalDescription, PaypalEmail: PaypalEmail, PaypalProduction: PaypalProduction, PaypalIPNEmailNotification: PaypalIPNEmailNotification,
//        PaypalReceiverEmail: PaypalReceiverEmail, PaypalIdentitytoken: PaypalIdentitytoken, PaypalPaymentAction: PaypalPaymentAction, PaypalAPIUserName: PaypalAPIUserName,
//        PaypalAPIPassword: PaypalAPIPassword, PaypalAPISignature: PaypalAPISignature,
//    }
//    $.ajax({
//        url: '/ThirdParty/AddPaymentMethods/', dataType: 'json', type: 'Post',
//        contentType: "application/json; charset=utf-8",
//        data: JSON.stringify(obj),
//        dataType: "json",
//        beforeSend: function () {
//            $("#loader").show();
//        },
//        success: function (data) {
//            if (data.status == true) {
//                //swal('Alert!', data.message, 'success');
//                var link = $('#mytabs .active').next().children('a').attr('href');
//                $('#mytabs a[href="' + link + '"]').tab('show');
//            }
//            else {
//                swal('Alert!', data.message, 'error')
//            }
//        },
//        complete: function () {
//            $("#loader").hide();
//        },
//        error: function (error) {
//            swal('Error!', 'something went wrong', 'error');
//        },
//    })
//});
$('#btnNextTab10').click(function (e) {
    var link = $('#mytabs .active').next().children('a').attr('href');
    $('#mytabs a[href="' + link + '"]').tab('show');
});
$('#btnNextTab11').click(function (e) {
    var link = $('#mytabs .active').next().children('a').attr('href');
    $('#mytabs a[href="' + link + '"]').tab('show');
});
$('#btnNextTab7').click(function (e) {
    var link = $('#mytabs .active').next().children('a').attr('href');
    $('#mytabs a[href="' + link + '"]').tab('show');
});
$('#btnNextTab8').click(function (e) {
    var link = $('#mytabs .active').next().children('a').attr('href');
    $('#mytabs a[href="' + link + '"]').tab('show');
});
$('#btnNextTab9').click(function (e) {
    var link = $('#mytabs .active').next().children('a').attr('href');
    $('#mytabs a[href="' + link + '"]').tab('show');
});
$('#btnSaveContact').click(function (e) {
    ID = $("#hfid").val();
    ContactID = $("#hfContactid").val();
    ContactName = $("#txtContactName").val();
    ContactTitle = $("#txtContactTitle").val();
    ContactEmail = $("#txtContactEMail").val();
    ContactAddress = $("#txtContactAddress").val();
    ContactCity = $("#txtContactCity").val();
    ContactState = $("#ddlContactState").val();
    ContactZipCode = $("#txtContactZipCode").val();
    ContactStateName = $("#ddlContactState").find('option:selected').text();
    ContactCountry = $("#ddlContactCountry").val();
    ContactOffice = $("#txtContactOffice").val();
    //ContactExt = $("#txtContactExt").val();
    ContactPhone = $("#txtContactPhone").unmask().val();
    ContactFax = $("#txtContactFax").val();
    ContactNotes = $("#txtContactNotes").val();

    if (ContactName == "") { swal('alert', 'Please enter name', 'error').then(function () { swal.close(); $('#txtContactName').focus(); }) }
    else if (ContactTitle == "") { swal('alert', 'Please enter title', 'error').then(function () { swal.close(); $('#txtContactTitle').focus(); }) }
    else if (ContactAddress == "") { swal('alert', 'Please enter address', 'error').then(function () { swal.close(); $('#txtContactAddress').focus(); }) }
    else if (ContactCity == "") { swal('alert', 'Please enter city', 'error').then(function () { swal.close(); $('#txtContactCity').focus(); }) }
    else if (ContactState == "-1") { swal('alert', 'Please select  state', 'error').then(function () { swal.close(); $('#ddlContactState').focus(); }) }
    else if (ContactZipCode == "") { swal('alert', 'Please enter zip code', 'error').then(function () { swal.close(); $('#txtContactZipCode').focus(); }) }
    else if (ContactCountry == "-1") { swal('alert', 'Please select country', 'error').then(function () { swal.close(); $('#ddlContactCountry').focus(); }) }
    //else if (ContactOffice == "") { swal('alert', 'Please enter office', 'error').then(function () { swal.close(); $('#txtContactOffice').focus(); }) }
    //else if (ContactPhone == "") { swal('alert', 'Please enter phone', 'error').then(function () { swal.close(); $('#txtContactPhone').focus(); }) }
    //else if (ContactEmail == "") { swal('alert', 'Please enter email', 'error').then(function () { swal.close(); $('#txtContactEMail').focus(); }) }
    else {
        var obj = {
            rowid: ID, ContactID: ContactID, ContactName: ContactName, ContactTitle: ContactTitle, ContactEmail: ContactEmail, ContactOffice: ContactOffice,
            ContactMobile: ContactPhone, ContactNotes: ContactNotes, ContactFax: ContactFax, ContactCountry: ContactCountry, ContactStateName: ContactStateName,
            ContactAddress: ContactAddress, ContactCity: ContactCity, ContactState: ContactState, ContactZipCode: ContactZipCode
        }
        $.ajax({
            url: '/ThirdParty/AddContacts/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success');
                    $("#txtContactPhone").mask("(999) 999-9999");
                    $("#VendorModal").modal('hide');
                    VendorContactList();
                    $("#VendorModal").find(":input").each(function () {
                        switch (this.type) {
                            case "text": case "email": case "textarea": case "tel": $(this).val(''); break;
                        }
                    });
                    $("#VendorModal option[value='-1']").attr('selected', true)
                    e.preventDefault();
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
});
$('#btnLinkWarehouse').click(function (e) {
    ID = $("#hfid").val();
    WarehouseList = $("#ddlWarehouseList").val();
    if (WarehouseList == "-1") { swal('alert', 'Please select warehouse list', 'error').then(function () { swal.close(); $('#ddlWarehouseList').focus(); }) }
    else {
        var obj = { rowid: ID, WarehouseID: WarehouseList, }
        $.ajax({
            url: '/ThirdParty/LinkWarehouse/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8", data: JSON.stringify(obj), dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success');
                    VendorWarehouseList();
                    $("#tab_10 option[value='-1']").attr('selected', true);
                    e.preventDefault();
                }
                else { swal('Alert!', data.message, 'error') }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
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
            var opt = '<option value="-1">Please select vendor type</option>';
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
            var opt = '<option value="-1">Please select incoterm</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlIncoTerm').html(opt);
        }

    });
}
function getWarehouse() {
    $.ajax({
        url: "/ThirdParty/GetWarehouse",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please select warehouse</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlWarehouseList').html(opt);
        }

    });
}
function getPaymentTerm() {

    $.ajax({
        url: "/ThirdParty/GetPaymentTerm",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please select payment term</option>';
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
            var opt = '<option value="-1">Please select balance days</option>';
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
            var opt = '<option value="-1">Please select discount type 2</option>';
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
            var opt = '<option value="-1">Please select payment method</option>';
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
    items += "<option value='-1'>-- Please select thirdparty type --</option>";
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
    items += "<option value='-1'>-- Please select workforce --</option>";
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
    items += "<option value='-1'>-- Please select sales representative --</option>";
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
            var opt = '<option value="-1">Please select shipping method</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlShippingMethod').html(opt);
        }

    });
}


    function GetVendorByID(id) {
        var rowid = id;
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
                        if (rowid == "NewVendor") { $('#lbltitle').text("Add New Vendor"); } else { $('#lbltitle').text("Update Vendor " + "(" + d[0].VendorName + ")"); }
                        $("#vendoruserid").val(d[0].fk_user);
                        $("#txVendorName").val(d[0].VendorName);
                        $("#txtAliasName").val(d[0].AliasName);
                        $("#ddlvendortype").val(d[0].vendor_type).trigger("change");
                        $("#txtVendorCode").val(d[0].VendorCode);
                        $("#ddlStatus").val(d[0].status).trigger("change");
                        $("#ddlCountry").val(d[0].Country);
                        $("#txtAddress1").val(d[0].address);
                        $("#txtAddress2").val(d[0].address1);
                        $("#txtCity").val(d[0].town);
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
                        $("#txtZipCode").val(d[0].zip);
                      
                        var t = d[0].phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3");
                        $("#txtPhone").val(t);
                        $("#txtFax").val(d[0].fax);
                        $("#txtEMail").val(d[0].email);
                        $("#txtWeb").val(d[0].url);
                        $("#txtWorkinghours").val(d[0].Workinghours);
                        d[0].VendorStatus == true ? $("#chkVendorStatus").prop("checked", true) : $("#chkVendorStatus").prop("checked", false);
                        $("#txtCorAddress1").val(d[0].CorAddress1);
                        $("#txtCorAddress2").val(d[0].CorAddress2);
                        $("#txtCorCity").val(d[0].CorCity);
                        $("#txtCorState").val(d[0].CorState);
                        $("#txtCorZipCode").val(d[0].CorZipCode);
                        $("#txtCorCountry").val(d[0].CorCountry);
                        $("#txtCorPhone").val(d[0].CorPhone);
                        $("#ddlWorkforce").val(d[0].Workforce).trigger("change");
                        $("#txtBusinessEntityType").val(d[0].BusinessEntityType);
                        $("#txtNotesPublic").val(d[0].note_public);
                        $("#txtNotesPrivate").val(d[0].note_private);
                        setTimeout(function () { $("#ddlNatureofJournal").val(d[0].NatureofJournal == null ? "-1" : d[0].NatureofJournal).trigger("change"); }, 1000);

                        $("#txtCapital").val(parseFloat(d[0].capital).toFixed(2));
                        $("#ddlPaymentTerms").val(d[0].PaymentTermsID == null ? "-1" : d[0].PaymentTermsID).trigger("change");
                        $("#ddlBalancedays").val(d[0].BalanceID == null ? "-1" : d[0].BalanceID).trigger("change");
                        setTimeout(function () { $("#ddlIncoTerm").val(d[0].IncotermsType == null ? "-1" : d[0].IncotermsType).trigger("change"); }, 1000);
                        console.log(d[0].IncotermsType);
                        $("#txtIncoTerm").val(d[0].Incoterms);
                        $("#ddlCurrency").val(d[0].Currency == null ? "-1" : d[0].Currency).trigger("change");
                        $("#txtCreditLimit").val(parseFloat(d[0].CreditLimit).toFixed(2));
                        $("#txtOutStandingLimit").val(parseFloat(d[0].outstanding_limit).toFixed(2));
                        $("#txtMinOrderQty").val(d[0].MinimumOrderQuanity);
                        $("#txtOrderMinAmt").val(parseFloat(d[0].order_min_amount).toFixed(2));

                        $("#ddlShippingMethod").val(d[0].ShippingMethodID == null ? "-1" : d[0].ShippingMethodID).trigger("change");
                        $("#txtShippingRate").val(d[0].ShippingRate);
                        $("#txtShippingLocation").val(d[0].ShippingLocation);

                        $("#txtUPSUserID").val(d[0].UPSUserID);
                        $("#txtUPSPassword").val(d[0].UPSPassword);
                        $("#txtUPSAccessKey").val(d[0].UPSAccessKey);
                        $("#txtUPSAccountNumber").val(d[0].UPSAccountNumber);
                        $("#txtUPSOriginPostcode").val(d[0].UPSOriginPostcode);
                        $("#txtUPSOriginCountry").val(d[0].UPSOriginCountry);
                        $("#txtUPSAPILicenceKey").val(d[0].UPSAPILicenceKey);
                        $("#txtUPSLicenceEmail").val(d[0].UPSLicenceEmail);
                        d[0].UPSEnable == true ? $("#chkUPSEnable").prop("checked", true) : $("#chkUPSEnable").prop("checked", false);
                        $("#ddlUPSMeasurementUnits").val(d[0].UPSMeasurementUnits == null ? "LBS/IN" : d[0].UPSMeasurementUnits);
                        d[0].UPSEnableDebugMode == true ? $("#chkUPSEnableDebugMode").prop("checked", true) : $("#chkUPSEnableDebugMode").prop("checked", false);
                        d[0].USPSEnable == true ? $("#chkUSPSEnableDisable").prop("checked", true) : $("#chkUSPSEnableDisable").prop("checked", false);
                        $("#txtUSPSPostcode").val(d[0].USPSPostcode);
                        $("#txtUSPSUserID").val(d[0].USPSUserID);
                        d[0].USPSCommercialrates == true ? $("#chkUSPSCommercialrates").prop("checked", true) : $("#chkUSPSCommercialrates").prop("checked", false);
                        d[0].USPSPacking == true ? $("#chkUSPSPacking").prop("checked", true) : $("#chkUSPSPacking").prop("checked", false);
                        $("#txtUSPSPriorityMailExpressTitle").val(d[0].USPSPriorityMailExpressTitle);
                        d[0].USPSPriorityMailExpress == true ? $("#chkPriorityMailExpress").prop("checked", true) : $("#chkPriorityMailExpress").prop("checked", false);
                        d[0].USPSPriorityMailExpressHoldforPickup == true ? $("#chkPriorityMailExpressHoldforPickup").prop("checked", true) : $("#chkPriorityMailExpressHoldforPickup").prop("checked", false);
                        d[0].USPSPriorityMailExpressSundayHoliday == true ? $("#chkPriorityMailExpressSundayHoliday").prop("checked", true) : $("#chkPriorityMailExpressSundayHoliday").prop("checked", false);
                        $("#txtUSPSPriorityMailTitle").val(d[0].USPSPriorityMailTitle);
                        d[0].USPSPriorityMail == true ? $("#chkPriorityMail").prop("checked", true) : $('#chkPriorityMail').prop("checked", false);
                        d[0].USPSPriorityMailHoldForPickup == true ? $("#chkPriorityMailHoldforPickup").prop("checked", true) : $('#chkPriorityMailHoldforPickup').prop("checked", false);
                        d[0].USPSPriorityMailKeysandIDs == true ? $("#chkPriorityMailKeysandIDs").prop("checked", true) : $('#chkPriorityMailKeysandIDs').prop("checked", false);
                        d[0].USPSPriorityMailRegionalRateBoxA == true ? $("#chkPriorityMailRegionalRateBoxA").prop("checked", true) : $('#chkPriorityMailRegionalRateBoxA').prop("checked", false);
                        d[0].USPSPriorityMailRegionalRateBoxAHoldForPickup == true ? $("#chkPriorityMailRegionalRateBoxAHoldForPickup").prop("checked", true) : $('#chkPriorityMailRegionalRateBoxAHoldForPickup').prop("checked", false);
                        d[0].USPSPriorityMailRegionalRateBoxB == true ? $("#chkPriorityMailRegionalRateBoxB").prop("checked", true) : $('#chkPriorityMailRegionalRateBoxB').prop("checked", false);
                        d[0].USPSPriorityMailRegionalRateBoxBHoldForPickup == true ? $("#chkPriorityMailRegionalRateBoxBHoldForPickup").prop("checked", true) : $('#chkPriorityMailRegionalRateBoxBHoldForPickup').prop("checked", false);
                        $("#txtUSPSFirstClassMailTitle").val(d[0].FirstClassMailTitle);
                        d[0].FirstClassMailPostcards == true ? $("#chkUSPSFirstClassMailPostcards").prop("checked", true) : $('#chkUSPSFirstClassMailPostcards').prop("checked", false);
                        d[0].FirstClassMailLetter == true ? $("#chkUSPSFirstClassMailLetter").prop("checked", true) : $('#chkUSPSFirstClassMailLetter').prop("checked", false);
                        d[0].FirstClassMailLargeEnvelope == true ? $("#chkUSPSFirstClassMailLargeEnvelope").prop("checked", true) : $('#chkUSPSFirstClassMailLargeEnvelope').prop("checked", false);
                        d[0].FirstClassMailParcel == true ? $("#chkUSPSFirstClassMailParcel").prop("checked", true) : $('#chkUSPSFirstClassMailParcel').prop("checked", false);
                        d[0].FirstClassMailLargePostcards == true ? $("#chkUSPSFirstClassMailLargePostcards").prop("checked", true) : $('#chkUSPSFirstClassMailLargePostcards').prop("checked", false);
                        d[0].FirstClassMailKeysandIDs == true ? $("#chkUSPSFirstClassMailKeysandIDs").prop("checked", true) : $('#chkUSPSFirstClassMailKeysandIDs').prop("checked", false);
                        d[0].FirstClassMailPackageService == true ? $("#chkUSPSFirstClassMailPackageService").prop("checked", true) : $('#chkUSPSFirstClassMailPackageService').prop("checked", false);
                        d[0].FirstClassMailPackageServiceHoldForPickup == true ? $("#chkUSPSFirstClassMailPackageServiceHoldForPickup").prop("checked", true) : $('#chkUSPSFirstClassMailPackageServiceHoldForPickup').prop("checked", false);
                        d[0].FirstClassMailMeteredLetter == true ? $("#chkUSPSFirstClassMailMeteredLetter").prop("checked", true) : $('#chkUSPSFirstClassMailMeteredLetter').prop("checked", false);
                        $("#txtFedexAccountNumber").val(d[0].FedexAccountNumber);
                        $("#txtFedexMeterNumber").val(d[0].FedexMeterNumber);
                        $("#txtFedexWebServicesKey").val(d[0].FedexWebServicesKey);
                        $("#txtFedexWebServicesPassword").val(d[0].FedexWebServicesPassword);
                        $("#ddlFedexMethodType").val(d[0].FedexMethodType == null ? "Global" : d[0].FedexMethodType).trigger("change");
                        d[0].FedexMethodEnable == true ? $("#chkFadexMethodEnable").prop("checked", true) : $('#chkFadexMethodEnable').prop("checked", false);
                        d[0].FedexCustomServices == true ? $("#chkFadexCustomServices").prop("checked", true) : $('#chkFadexCustomServices').prop("checked", false);
                        d[0].FedexDebugMode == true ? $("#chkFadexDebugMode").prop("checked", true) : $('#chkFadexDebugMode').prop("checked", false);

                        $("#ddlTaxMethod").val(d[0].TaxMethod == null ? "Standard Tax Rate" : d[0].TaxMethod).trigger("change");
                        $("#txtDefaultTax").val(d[0].DefaultTax);
                        $("#txtShippingTax").val(d[0].ShippingTax);
                        d[0].ShippingTaxIncludedinprice == true ? $("#chkShippingTaxIncludedinprice").prop("checked", true) : $('#chkShippingTaxIncludedinprice').prop("checked", false);
                        $("#txtCalculatedtax").val(d[0].CalculatedTax);
                        d[0].TaxIncludedinPrice == true ? $("#chkTaxIncludedinPrice").prop("checked", true) : $('#chkTaxIncludedinPrice').prop("checked", false);

                        $("#ddlDiscountType1").val(d[0].DiscountType1 == null ? "-1" : d[0].DiscountType1).trigger("change");
                        $("#txtDefaultDiscount").val(d[0].DefaultDiscount);
                        $("#txtDiscountMinimumOrderAmount").val(d[0].DiscountMinimumOrderAmount);
                        $("#txtAccountName").val(d[0].AccountName);
                        $("#txtAccountEmail").val(d[0].AccountEmail);
                        $("#ddlDiscountType2").val(d[0].DiscountType2 == null ? "-1" : d[0].DiscountType2).trigger("change");
                        $("#txtDiscount").val(d[0].Discount);

                        $("#ddlPaymentMethod").val(d[0].Paymentmethod == null ? "-1" : d[0].Paymentmethod).trigger("change");
                        $("#txtBankAccountName").val(d[0].BankAccountName);
                        $("#txtBankAccountNumber").val(d[0].BankAccountNumber);
                        $("#txtBankName").val(d[0].BankName);
                        $("#txtBankRoutingNumber").val(d[0].BankRoutingNumber);
                        $("#txtBankIBAN").val(d[0].BankIBAN);
                        $("#txtBankSwift").val(d[0].BankSwift);

                        $("#txtChequeTitle").val(d[0].ChequeTitle);
                        $("#txtChequeDescription").val(d[0].ChequeDescription);
                        $("#txtChequeInstructions").val(d[0].ChequeInstructions);

                        $("#txtPPInvoiceAPIUsername").val(d[0].PaypalInvoiceAPIUsername);
                        $("#txtPPInvoiceAPIPassword").val(d[0].PaypalInvoiceAPIPassword);
                        $("#txtPPInvoiceAPISignature").val(d[0].PaypalInvoiceAPISignature);

                        $("#txtPaypalTitle").val(d[0].PaypalTitle);
                        $("#txtPaypalDescription").val(d[0].PaypalDescription);
                        $("#txtPaypalEmail").val(d[0].PaypalEmail);
                        d[0].PaypalProduction == true ? $("#chkPaypalProduction").prop("checked", true) : $('#chkPaypalProduction').prop("checked", false);
                        $("#txtPaypalIPNEmailNotification").val(d[0].PaypalIPNEmailNotification);
                        $("#txtPaypalReceiverEmail").val(d[0].PaypalReceiverEmail);
                        $("#txtPaypalIdentitytoken").val(d[0].PaypalIdentitytoken);
                        $("#ddlPaypalPaymentAction").val(d[0].PaypalPaymentAction == null ? "-1" : d[0].PaypalPaymentAction).trigger("change");
                        $("#txtPaypalAPIUserName").val(d[0].PaypalAPIUserName);
                        $("#txtPaypalAPIPassword").val(d[0].PaypalAPIPassword);
                        $("#txtPaypalAPISignature").val(d[0].PaypalAPISignature);
                        PaymentMethodBlock(d[0].Paymentmethod);
                        ShippingMethodBlock(d[0].ShippingMethodID)

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
function VendorContactList() {
    var urid = "";
    ID = $("#hfid").val();
    var sid = "";
    //var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 50, sEcho: 1, SortCol: 'id', SortDir: 'desc', rowid: ID };
    var table_cn = $('#dtdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#dtdata_filter input').unbind();
            $('#dtdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_cn.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/ThirdParty/GetVendorContactList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: ID });
            aoData.push({ name: "strValue2", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "name" : oSettings.aaSorting[0][0] == 1 ? "Name" : oSettings.aaSorting[0][0] == 2 ? "Title" : oSettings.aaSorting[0][0] == 3 ? "Office" : oSettings.aaSorting[0][0] == 4 ? "Mobile" : oSettings.aaSorting[0][0] == 5 ? "Email" : oSettings.aaSorting[0][0] == 6 ? "Address" : "id";
                aoData.push({ name: "sSortColName", value: col });
            }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            { data: 'Name', title: 'Name', sWidth: "10%" },
            { data: 'Title', title: 'Title', sWidth: "10%" },
            { data: 'Office', title: 'Office Contact', sWidth: "10%" },
            {
                data: 'Mobile', title: 'Phone', sWidth: "10%", render: function (toFormat) {
                    var tPhone = '';
                    if (toFormat != null) {
                        tPhone = toFormat.toString();
                        tPhone = '(' + tPhone.substring(0, 3) + ') ' + tPhone.substring(3, 6) + ' ' + tPhone.substring(6, 10);
                    }
                    return tPhone
                }
            },
            { data: 'Email', title: 'Email', sWidth: "10%" },
            { data: 'Address', title: 'Address', sWidth: "20%" },
            {
                'data': 'ID', sWidth: "8%",
                'render': function (id, type, full, meta) {
                    /*  if ($("#hfEdit").val() == "1") {*/
                    return '<a href="#" onclick="showModal(' + id + ');"><i class="glyphicon glyphicon-pencil"></i></a>';
                    //return '<button type="button" id="btnEditContact" data-toggle="modal" data-target="#VendorModal"><i class="glyphicon glyphicon-pencil"></button >';
                    //}
                    //else { return "No Permission"; }
                }
            }


        ]
    });
}

function VendorRelatedProduct() {
    var urid = "";
    ID = $("#hfid").val();
    var sid = "";
    var table_RIM = $('#RelatedItemdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#RelatedItemdata_filter input').unbind();
            $('#RelatedItemdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_RIM.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/ThirdParty/GetVendorRelatedProductList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: ID });
            aoData.push({ name: "strValue2", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "ProductName" : oSettings.aaSorting[0][0] == 1 ? "VendorName" : oSettings.aaSorting[0][0] == 2 ? "purchase_price" : oSettings.aaSorting[0][0] == 3 ? "cost_price" : "id";
                aoData.push({ name: "sSortColName", value: col });
            }
          /*  obj.sEcho = aoData[0].value; obj.PageSize = oSettings._iDisplayLength; obj.PageNo = oSettings._iDisplayStart;*/
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            { data: 'ProductName', title: 'Product Name', sWidth: "25%", class: 'text-left' },
            /*{ data: 'VendorName', title: 'Vendor Name', sWidth: "25%" },*/
            { data: 'purchase_price', title: 'Purchase Price', sWidth: "15%" },
            { data: 'shipping_price', title: 'Shipping Price', sWidth: "15%" },
            { data: 'cost_price', title: 'Cost Price', sWidth: "15%" },
            { data: 'taxrate', title: 'Tax', sWidth: "15%" },
            { data: 'discount', title: 'Discount', sWidth: "15%" },
        ]
    });

}
function VendorWarehouseList() {
    var urid = "";
    ID = $("#hfid").val();
    var sid = "";
    //var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 50, sEcho: 1, SortCol: 'id', SortDir: 'desc', rowid: ID };
    var table_WD =  $('#Warehousedata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#Warehousedata_filter input').unbind();
            $('#Warehousedata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_WD.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/ThirdParty/GetVendorWarehouseList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: ID });
            aoData.push({ name: "strValue2", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "VendorName" : oSettings.aaSorting[0][0] == 1 ? "Warehouse" : "id";
                aoData.push({ name: "sSortColName", value: col });
            }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            /* { data: 'VendorName', title: 'Vendor Name', sWidth: "40%" },*/
            { data: 'Warehouse', title: 'Ware house', sWidth: "40%", class: 'text-left' },
            { data: 'address', title: 'Address', sWidth: "40%" },
            {
                'data': 'ID', sWidth: "20%",
                'render': function (id, type, full, meta) {
                    return '<a href="#" onclick="Deletewarehouse(' + id + ');"><i class="fas fa-trash-alt"></i></a>';
                }
            }
        ]
    });
}

$('#btnAddContact').click(function () {
    var inputs = document.getElementById("txtContactAddress");
    setupAutocomplete(inputs);
    $("#VendorModal").find(":input").each(function () {
        switch (this.type) {
            case "text": case "email": case "textarea": case "tel": $(this).val(''); break;
        }
    });
    $("#VendorModal option[value='-1']").attr('selected', true)
    $("#ddlContactState").empty().append('<option value="" selected></option>');
    $('#VendorModal').modal('show');
})
$('#btnAddRelatedProduct').click(function () {
    $("#RelatedProductModal").find(":input").each(function () {
        switch (this.type) {
            case "text": case "email": case "textarea": case "tel": $(this).val(''); break;
        }
    });
    $("#RelatedProductModal option[value='-1']").attr('selected', true)
    $("#ddlContactState").empty().append('<option value="" selected></option>');
    $('#RelatedProductModal').modal('show');

})

function showModal(id) {
    var VendorID = id;

    $("#hfContactid").val(VendorID);
    var obj =
        $.ajax({
            url: "/ThirdParty/GetVendorContactByID/" + VendorID,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            success: function (data) {
                var d = JSON.parse(data);
                if (d.length > 0) {
                    console.log(d);
                    $('#VendorModal').modal('show');
                    $("#txtContactName").val(d[0].Name);
                    $("#txtContactTitle").val(d[0].Title);
                    $("#txtContactAddress").val(d[0].Address);
                    $("#txtContactCity").val(d[0].City);
                    $("#ddlContactState").val(d[0].State);
                    $("#txtContactZipCode").val(d[0].ZipCode);
                    $("#ddlContactCountry").val(d[0].Country);
                    $("#txtContactOffice").val(d[0].Office);
                    Cphone = d[0].Mobile.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3");
                    $("#txtContactPhone").val(Cphone);
                    $("#txtContactFax").val(d[0].Fax);
                    $("#txtContactEMail").val(d[0].Email);
                    $("#txtContactNotes").val(d[0].Notes);
                    $("#ddlContactState").empty().append('<option value="' + d[0].State + '" selected>' + d[0].StateName + '</option>');

                    $("#ddlContactState").select2({
                        allowClear: true, minimumInputLength: 2, placeholder: "Search State",
                        ajax: {
                            url: '/ThirdParty/GetState', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
                            data: function (params) { var obj = { strValue1: params.term, strValue2: $("#ddlContactCountry").val() }; return JSON.stringify(obj); },
                            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.StateFullName, name: item.StateFullName, val: item.State, id: item.State } }) }; },
                            error: function (xhr, status, err) { }, cache: true
                        }
                    });

                }
            },
            error: function (msg) {
            }
        });

}
function Deletewarehouse(id) {
    RowID = $("#hfid").val();
    var result = confirm("Are you sure to delete this warehouse?");
    if (result) {
        var obj = { rowid: RowID, VendorWarehouseID: id, }
        $.ajax({
            url: '/ThirdParty/DeleteWarehouse/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8", data: JSON.stringify(obj), dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success');
                    VendorWarehouseList();
                }
                else { swal('Alert!', data.message, 'error') }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })
    }
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Search Google Place API ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var autocompleteOptions = { componentRestrictions: { country: ["us", "ca", "cn"] }, fields: ["address_components", "geometry"], types: ["address"] };
function setupAutocomplete(inputs) {
    //console.log('setupAutocomplete...', $(inputs));
    autocomplete = new google.maps.places.Autocomplete(inputs, autocompleteOptions);
    autocomplete.addListener("place_changed", fillInAddress);
    function fillInAddress() {
        let place = autocomplete.getPlace();
        let address = '';
        let cAdd1 = '', cZipCode = '', cCity = '', cCountry = '', cState = '';

        if ($(inputs).data('addresstype') == 'VendorAddress')
            cAdd1 = 'txtAddress1', cZipCode = 'txtZipCode', cCity = 'txtCity', cCountry = 'ddlCountry', cState = 'ddlState';
        else
            cAdd1 = 'txtContactAddress', cZipCode = 'txtContactZipCode', cCity = 'txtContactCity', cCountry = 'ddlContactCountry', cState = 'ddlContactState';
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
            $("#" + cCountry).val(obj[0].short_name);
        else
            $("#" + cCountry).val('US');
        obj = place.address_components.filter(element => element.types[0] == 'administrative_area_level_1');
        if (obj.length > 0)
            $("#" + cState).empty().append('<option value="' + obj[0].short_name + '" selected>' + obj[0].long_name + '</option>');
        //$("#" + cState).val(obj[0].short_name).trigger('change');//.append('<option value="' + obj[0].short_name + '" selected>' + obj[0].long_name + '</option>');
        else
            $("#" + cState).val('').trigger('change');;
    }
}
function initMap() {
    var inputs = document.getElementById("txtAddress1");
    setupAutocomplete(inputs);
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Linked Files ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

$("#btnupload").click(function () {
    VendorID = $("#hfid").val();
    var file = document.getElementById("ImageFile").files[0];
    var formData = new FormData();
    formData.append("ImageFile", file);
    formData.append("VendorID", VendorID);

    if (VendorID == 0) {
        swal('Alert', 'Vendor not found', 'error').then(function () { swal.close(); });
    }
    else {
        $.ajax({
            type: "POST",
            url: '/ThirdParty/FileUpload/',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    VendorLinkedFiles();
                    swal('Alert!', data.message, 'success');
                }
                else { swal('Alert!', data.message, 'error'); }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
        })
    }
})
function VendorLinkedFiles() {
    var urid = "";
    ID = $("#hfid").val();
    var sid = "";
    var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 50, sEcho: 1, SortCol: 'id', SortDir: 'desc', rowid: ID };
    let table_VL = $('#VendorLinkedFiles').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#VendorLinkedFiles_filter input').unbind();
            $('#VendorLinkedFiles_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_VL.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/ThirdParty/GetVendorLinkedFiles",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: ID });
            aoData.push({ name: "strValue2", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "FileName" : oSettings.aaSorting[0][0] == 1 ? "FileSize" : oSettings.aaSorting[0][0] == 2 ? "Date" : "id";
                aoData.push({ name: "sSortColName", value: col });
            }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    $("#lblAttachedFiles").text(data.recordsTotal);
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            {
                'data': 'FileName', sWidth: "25%", class: 'text-left',
                'render': function (FileName, type, full, meta) {
                    return '<a target="popup" href="../../Content/VendorLinkedFiles/' + FileName + '">' + FileName + ' <i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'FileSize', title: 'FileSize', sWidth: "25%" },
            { data: 'Date', title: 'Date', sWidth: "25%" },
            {
                'data': 'ID',
                'render': function (id, type, full, meta) {
                    return '<a href="#" onclick="DeleteVendorLinkedFiles(' + id + ');"><i class="fas fa-trash-alt"></i></a>';
                }
            }
        ]
    });
}
function DeleteVendorLinkedFiles(id) {
    RowID = $("#hfid").val();
    var result = confirm("Are you sure to delete this Linked File?");
    if (result) {
        var obj = { rowid: RowID, VendorLinkedFilesID: id, }
        $.ajax({
            url: '/ThirdParty/DeleteVendorLinkedFiles/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8", data: JSON.stringify(obj), dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success');
                    VendorLinkedFiles();
                }
                else { swal('Alert!', data.message, 'error') }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })
    }
}

///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Invoices ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function InvoiceGrid() {
    let VendorID = $("#hfid").val();
    let sd = $('#txtvendorePaymentDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtvendorePaymentDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtvendorePaymentDate').val() == '') { sd = ''; ed = '' };
    let urid = parseInt($("#ddlInvoiceServices").val());
    let table = $('#PurchaseInvoicedata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }],
        order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#PurchaseInvoicedata_filter input').unbind();
            $('#PurchaseInvoicedata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/ThirdParty/GetPurchaseOrderList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            aoData.push({ name: "strValue2", value: VendorID });
            aoData.push({ name: "strValue3", value: sd });
            aoData.push({ name: "strValue4", value: ed });
            var col = 'order_id';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 1 ? "refordervendor" : oSettings.aaSorting[0][0] == 2 ? "Status" : "ref";
                aoData.push({ name: "sSortColName", value: col });
            }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            //{
            //    'data': 'id', sWidth: "5%   ",
            //    'render': function (data, type, full, meta) {
            //        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '"><label></label>';
            //    }
            //},
            {
                'data': 'StatusID', sWidth: "10%", title: 'PO/Invoice No.', class: 'text-left',
                'render': function (id, type, full, meta) {
                    if (id == 1)
                        return '' + full.ref + ' <a href="#" onclick="getPurchaseOrderPrint(' + full.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                    else  
                    return '' + full.refordervendor + ' <a href="#" onclick="getPurchaseOrderPrint(' + full.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'date_livraison', title: 'Planned date of delivery', sWidth: "14%" },
            { data: 'Status', title: 'Status', sWidth: "10%" }
        ]
    });
}
$("#ddlInvoiceServices").change(function () {
    InvoiceGrid();
})
function orderStatus() {
    var id = "";
    $("input:checkbox[name=CheckSingle]:checked").each(function () { id += $(this).val() + ","; });
    id = id.replace(/,(?=\s*$)/, '');
    $("#checkAll").prop('checked', false);
    var status = $('#ddlOrderStatus').val();

    if (id == "") { swal('alert', 'Please select a purchase order.', 'error'); }
    else if (status == "") { swal('alert', 'Please select status.', 'error'); }
    else {
        var obj = { Search: id, Status: status }
        $.ajax({
            url: '/PurchaseOrder/UpdatePurchaseOrderStatus', dataType: 'JSON', type: 'get',
            contentType: "application/json; charset=utf-8",
            data: obj,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) { swal('alert', data.message, 'success').then((result) => { InvoiceGrid(); }); }
                else { swal('alert', 'something went wrong!', 'success'); }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); }
        });
    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Purchase Information~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//setTimeout(function () { VendorBookkipping(); }, 10000);
function VendorBookkipping() {
    var vendor_code = $("#txtVendorCode").val();
    console.log(vendor_code);
    var obj = { vendorcode: vendor_code }
    $.ajax({
        url: '/ThirdParty/BalanceList',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        processing: true,
        success: function (data) {
            $('#GetBalance').dataTable({
                destroy: true,
                scrollX: false,
                data: JSON.parse(data),
                "columns": [
                    { data: 'credit', title: 'Credit', sWidth: "5%" },
                    { data: 'debit', title: 'Debit', sWidth: "10%" },
                ],
                "order": [[0, 'desc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });

}

setTimeout(function () { CalculateAmount(); }, 2000);
setTimeout(function () { CalculateAmountDateWise(); }, 2500);
function CalculateAmount() {
    var vendor_code = $("#hfvendorcode").val();
    console.log(vendor_code);
    var obj = { vendorcode1: vendor_code }
    $.ajax({
        url: '/ThirdParty/AmountsView',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        processing: true,
        success: function (data) {
            console.log(data);
            var d = JSON.parse(data);

            $("#txtpurchaseorder").text('$' + parseFloat(d[0].PurchaseOrder).toFixed(2));
            $("#txtpaidamount").text('$' + parseFloat(d[0].PaidAmount).toFixed(2));
            $("#txtoutstandingamount").text('$' + parseFloat(d[0].OutstandingAmount).toFixed(2));
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });

}
function CalculateAmountDateWise() {
    var vendor_code = $("#hfvendorcode").val();
    console.log(vendor_code);
    let sd = $('#txtvendorePaymentDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let end = $('#txtvendorePaymentDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    $("#txtoutstanding").text('Outstanding bill payment from ' + sd + ' to ' + end );
    //if ($('#txtvendorePaymentDate').val() == '') { sd = ''; end = '' };
    //var obj = { strValue1: sd, strValue2: end, strValue3: vendor_code  }
    var obj = { vendorcode1: sd, vendorcode2: end, vendorcode3: vendor_code }
    $.ajax({
        url: '/ThirdParty/DateWiseAmountsView',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        processing: true,
        success: function (data) {
            console.log(data);
            var d = JSON.parse(data);

            $("#txtmthpurchaseorder").text('$' + parseFloat(d[0].PurchaseOrder).toFixed(2));
            $("#txtmthpaidamount").text('$' + parseFloat(d[0].PaidAmount).toFixed(2));
            $("#txtmthoutstandingamount").text('$' + parseFloat(d[0].OutstandingAmount).toFixed(2));
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });

}


function ActivityLog(ModuleName, ModuleURL) {
    console.log(ModuleName, ModuleURL);
    var obj = {
        ModuleName: ModuleName, ModuleURL: ModuleURL
    }
    $.ajax({
        url: '/ThirdParty/ActivityDbLog/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) { },
        //error: function (error) {
        //    swal('Error!', 'something went wrong', 'error');
        //},
    })

}

$(document).on('click', "#PasswordShow", function () {
    if ($('#txtPassword').val() == "")
        swal('Alert', 'Password is not generated!', 'error');
    else
        swal('Alert', 'Password is ' + $('#txtPassword').val() + '', 'success');

})

function passwordcheck() {
    $('#txtPassword, #txtConfirmPassword').on('keyup', function () {
        if ($('#txtPassword').val() == $('#txtConfirmPassword').val()) {
            $('#message').html('Matching').css({ "color": "green", "opacity": "1" });
        } else
            $('#message').html('Not Matching').css({ "color": "red", "opacity": "1" });
    });
}

$("#txtPassword").change(function () {
    $('#result').html(passwordStrength($('#txtPassword').val(), ""))
    result = $('#result').html();
    if (result == "Password strength is weak") {
        $('#result').attr({ 'style': 'color:Red;' });

    }
    if (result == "Password Strength is low") {
        $('#result').attr({ 'style': 'color:Olive;' });
    }
    if (result == "Password strength is medium") {
        $('#result').attr({ 'style': 'color:Lime;' });
    }
    if (result == "Password strength is strong") {
        $('#result').attr({ 'style': 'color:Green;' });
    }
    Password = $("#txtPassword").val();
    strength = 1;
    var arr = [/.{5,}/, /[a-z]+/, /[0-9]+/, /[A-Z]+/];
    jQuery.map(arr, function (regexp) {
        if (Password.match(regexp))
            strength++;
    });

})
$("#txtPassword").on("input", function () {
    $('#result').html(passwordStrength($('#txtPassword').val(), ""))
    result = $('#result').html();
    if (result == "Password strength is weak") {
        $('#result').attr({ 'style': 'color:Red;' });

    }
    if (result == "Password Strength is low") {
        $('#result').attr({ 'style': 'color:Olive;' });
    }
    if (result == "Password strength is medium") {
        $('#result').attr({ 'style': 'color:Lime;' });
    }
    if (result == "Password strength is strong") {
        $('#result').attr({ 'style': 'color:Green;' });
    }
    Password = $("#txtPassword").val();
    strength = 1;
    var arr = [/.{5,}/, /[a-z]+/, /[0-9]+/, /[A-Z]+/];
    jQuery.map(arr, function (regexp) {
        if (Password.match(regexp))
            strength++;
    });

})

function PurchaseOrderGrid() {
    let status_id = parseInt($("#ddlPoOrderStatus").val()) || 0, vendor_id = parseInt($("#hfid").val()) || 0;
    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };
    let table = $('#dtdatapurchaseorder').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, //scrollX: false, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('.dataTables_filter input').unbind();
            $('.dataTables_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/ThirdParty/GetVendorPurchaseOrderList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed });
            aoData.push({ name: "strValue3", value: status_id }, { name: "strValue4", value: vendor_id }, { name: "strValue5", value: "PO" });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            //console.log(aoData);
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            /*{ data: 'id', sWidth: "5%", render: function (data, type, full, meta) { return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '"><label></label>'; } },*/
            {
                data: 'ref', sWidth: "10%", title: 'PO No',
                render: function (id, type, full, meta) {
                    //if ($("#hfEdit").val() == "1") {
                    //    //return '<a title="Click here to purchase order" data-toggle="tooltip" href="NewPurchaseOrder/' + full.id + '">' + id + '</a> <a title="Click here to view order preview" data-toggle="tooltip" href="#" onclick="getPurchaseOrderPrint(' + full.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                    //    return '<a title="Click here to purchase order" data-toggle="tooltip" href="#">' + id + '</a> <a title="Click here to view order preview" data-toggle="tooltip" href="#" onclick="getPurchaseOrderPrint(' + full.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                    //}
                    //else {
                    return '<a href="#">' + id + '</a> <a href="#" onclick="getPurchaseOrderPrint(' + full.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                    //}
                }
            },
            { data: 'date_creation_s', title: 'Order Date', sWidth: "10%", render: function (id, type, full, meta) { return full.date_creation; } },
            {
                data: 'refordervendor', title: 'Invoice No', sWidth: "10%", 'render': function (id, type, full, meta) {
                    let str_inv = (id.substr(7) > 0 ? '<a href="#">'+ id+ '</a> <a title="Click here to view invoice preview" data-toggle="tooltip"  href="#" onclick="getInvoicePrint(' + full.id + '); "><i class="fas fa-search-plus"></i></a>' : '');
                    return str_inv;
                }
            },
            //{ data: 'fk_projet', title: 'SO No.', sWidth: "10%", render: function (data, type, dtrow) { if (data > 0) return '#' + data; else return ''; } },
            //{ data: 'vendor_name', title: 'Vendor Name', sWidth: "15%" },
            { data: 'warehouse_name', title: 'Destination', sWidth: "10%" },
            { data: 'destination', title: 'Destination Address', sWidth: "15%" },
            {
                data: 'total_ttc', title: 'Amount', sWidth: "8%", class: 'text-right', render: function (data, type, full, meta) {
                    let num = $.fn.dataTable.render.number(',', '.', 2, '$').display(data);
                    if (full.fk_user_amendment > 0) return num + ' <i class="fas fa-exclamation-triangle" title="' + full.user_amendment + '" aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>'; else return num;
                }
            },
            { data: 'date_livraison_s', title: 'Planned date of delivery', sWidth: "10%", render: function (id, type, full, meta) { if (full.past_due == "Past Due") return full.date_livraison + ' <i class="fas fa-exclamation pastdue" title="Past Due" aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>'; else return full.date_livraison; } },
            {
                data: 'Status', title: 'Status', sWidth: "8%",
            },
            { data: 'date_modified_s', title: 'Modified Date', sWidth: "8%", render: function (id, type, full, meta) { return full.date_modified; } },
        ]
    });
    $('[data-toggle="tooltip"]').tooltip();
}

function SalesOrderGrid() {
    let vid = parseInt($('#hfid').val()) || 0;
    let sd = $('#txtInvoiceDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtInvoiceDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    let _Invoice = $("#ddlInvoice_NonInvoice").val();
    if ($('#txtInvoiceDate').val() == '') { sd = ''; ed = '' };
    let table = $('#dtpoinvoice').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, scrollX: false, //scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('.dataTables_filter input').unbind();
            $('.dataTables_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/ThirdParty/GetProposalsList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed }, { name: "strValue3", value: vid }, { name: "strValue4", value: _Invoice });

            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            //console.log(aoData);
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            //{
            //    'data': 'id', sWidth: "5%   ",
            //    'render': function (data, type, full, meta) {
            //        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '"><label></label>';
            //    }
            //},
            {
                'data': 'ref', sWidth: "15%", title: 'PO No',
                'render': function (id, type, full, meta) {
                    return '<a href="#" title="Click here to view order preview" data-toggle="tooltip">PO-' + full.fk_projet + '</a> <a href="javascript:void(0);" title="Click here to print" data-toggle="tooltip" onclick="PrintProposals(' + full.id + ');"><i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'date_creation', title: 'Order Date', sWidth: "10%" },
            {
                data: 'refordervendor', title: 'Invoice No', sWidth: "10%", 'render': function (id, type, full, meta) {
                    let str_inv = (id.substr(7) > 0 ? ' <a href="#" title="Click here to view invoice  preview" data-toggle="tooltip" onclick="getInvoicePrint(' + full.id + '); "><i class="fas fa - search - plus"></i>' + id + '</a>' : '');
                    return str_inv;
                }
            },
            {
                data: 'fk_projet', title: 'SO No.', sWidth: "10%", render: function (data, type, dtrow) {
                    if (data > 0) return '#' + data; else return '';
                }
            },
            //{ data: 'vendor_name', title: 'Vendor Name', sWidth: "15%" },
            {
                data: 'address', title: 'Address', sWidth: "25%", render: function (data, type, dtrow) {
                    let val = dtrow.address + ', ' + dtrow.town + ', ' + dtrow.fk_state + ' ' + dtrow.zip + ' ' + dtrow.fk_country;
                    return val;
                }
            },
            { data: 'total_ttc', title: 'Amount', sWidth: "8%", class: 'text-right', render: $.fn.dataTable.render.number('', '.', 2, '$') },
            //{ data: 'date_livraison', title: 'Planned date of delivery', sWidth: "10%" },
            { data: 'Status', title: 'Status', sWidth: "8%" }
        ]
    });
}

$("#btnPosearch").click(function () {
    PurchaseOrderGrid();
});

$("#btnSalesPosearch").click(function () {
    SalesOrderGrid();
});

$("#btnvendorePaymentPosearch").click(function () {
    InvoiceGrid();
    CalculateAmountDateWise();
});