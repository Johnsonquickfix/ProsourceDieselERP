$("#loader").hide();
getProspect();
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

$('#changetabbutton').click(function (e) {
    ID = $("#hfid").val();
    VendorName = $("#txVendorName").val();
    AliasName = $("#txtAliasName").val();
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
    Minimumorderquanity = $("input[type='radio'][name='Minimumorderquanity']:checked").val();
    DefaultTax = $("#txtDefaultTax").val();
    TaxIncludedinprice = $("#chkTaxIncludedinprice").prop("checked") ? 1 : 0;
    DefaultDiscount = $("#txtDefaultDiscount").val();
    CreditLimit = $("#txtCreditLimit").val();
    IncoTermType = $("#ddlIncoTerm").val();
    IncoTerm = $("#txtIncoTerm").val();

    var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (VendorName == "") { swal('alert', 'Please Enter Vendor Name', 'error').then(function () { swal.close(); $('#txVendorName').focus(); }) }
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

    else {

        e.preventDefault();
        var link = $('#mytabs .active').next().children('a').attr('href');
        $('#mytabs a[href="' + link + '"]').tab('show');
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

function getProspect() {
    var data = [
        { "ID": "2", "Text": "Prospect" },
        { "ID": "3", "Text": "Prospect / Customer" },
        { "ID": "1", "Text": "Customer" },
        { "ID": "0", "Text": "Not prospect, nor customer" },

    ];
    var items = "";
    items += "<option value=''>-- Please select Prospect --</option>";
    $.each(data, function (index, value) {
        items += "<option value=" + this['ID'] + ">" + this['Text'] + "</option>";
    })
    $("#ddlProspect").html(items);
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
    Minimumorderquanity = $("input[type='radio'][name='Minimumorderquanity']:checked").val();
    DefaultTax = $("#txtDefaultTax").val();
    TaxIncludedinprice = $("#chkTaxIncludedinprice").prop("checked") ? 1 : 0;
    DefaultDiscount = $("#txtDefaultDiscount").val();
    CreditLimit = $("#txtCreditLimit").val();
    IncoTermType = $("#ddlIncoTerm").val();
    IncoTerm = $("#txtIncoTerm").val();

    var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (VendorName == "") { swal('alert', 'Please Enter Vendor Name', 'error').then(function () { swal.close(); $('#txVendorName').focus(); }) }
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

    else {
        var obj = {
            rowid: ID,
            Name: VendorName, AliasName: AliasName, VendorCode: VendorCode, Status: Status, Address: Address,
            City: City, State: State, StateName: StateName, ZipCode: ZipCode, Country: Country, Phone: Phone, Fax: Fax, EMail: EMail, Web: Web,
            SalesTaxUsed: Salestaxused, ThirdPartyType: ThirdPartyType, Workforce: Workforce, BusinessEntityType: BusinessEntityType,
            Capital: Capital, SalesRepresentative: SalesRepresentative, Address1: Address1, PaymentTermsID: PaymentTerms, BalanceID: Balancedays ,
            PaymentDate: PaymentDate, Currency: Currency, EnableVendorUOM: EnableVendorUOM, UnitsofMeasurment:Unitsofmeasurment,
            MinimumOrderQuanity: Minimumorderquanity, DefaultTax: DefaultTax, TaxIncludedinPrice:TaxIncludedinprice,
            DefaultDiscount: DefaultDiscount, CreditLimit: CreditLimit, IncotermsType: IncoTermType, Incoterms: IncoTerm,
            WarehouseID: Settingid, LeadTime: LeadTime, DaysofStock: DaysofStock, VendorID: ID,

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
                    /*$('#hfid').val(data.id);*/

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
                    $('input:radio[value="' + d[0].MinimumOrderQuanity + '"]').prop('checked', true);
                    $("#txtDefaultTax").val(d[0].DefaultTax);
                    d[0].TaxIncludedinPrice == true ? $('#chkTaxIncludedinprice').attr("checked", "checked") : "";
                    $("#txtDefaultDiscount").val(d[0].DefaultDiscount);
                    $("#txtCreditLimit").val(d[0].CreditLimit);
                    $("#ddlIncoTerm").val(d[0].IncotermsType);
                    $("#txtIncoTerm").val(d[0].Incoterms);
                    
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