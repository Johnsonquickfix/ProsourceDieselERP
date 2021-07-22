$("#loader").hide();
getProspect();
getVendor();
getStatus();
getSalesTaxUsed();
getThirdPartyType();
getWorkforce();
getIncoterms();
getAssignedtoSalesRepresentative();

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
function getVendor() {
    var data = [
        { "ID": "1", "Text": "Yes" },
        { "ID": "0", "Text": "No" },

    ];
    var items = "";
    $.each(data, function (index, value) {
        items += "<option value=" + this['ID'] + ">" + this['Text'] + "</option>";
    })
    $("#ddlVendor").html(items);
}
function getStatus(){
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
        { "ID": "6", "Text": "> 500"},

    ];
    var items = "";
    items += "<option value='-1'>-- Please select Workforce --</option>";
    $.each(data, function (index, value) {
        items += "<option value=" + this['ID'] + ">" + this['Text'] + "</option>";
    })
    $("#ddlWorkforce").html(items);
}
function getIncoterms() {
    var data = [
        { "ID": "5", "Text": "CFR" },
        { "ID": "6", "Text": "CIF" },
        { "ID": "8", "Text": "CIP" },
        { "ID": "7", "Text": "CPT" },
        { "ID": "10", "Text": "DAP" },
        { "ID": "9", "Text": "DAT" },
        { "ID": "11", "Text": "DDP" },
        { "ID": "12", "Text": "DPU" },
        { "ID": "1", "Text": "EXW" },
        { "ID": "3", "Text": "FAS" },
        { "ID": "2", "Text": "FCA" },
        { "ID": "4", "Text": "FOB" },
    ];
    var items = "";
    items += "<option value='-1'>-- Please select Incoterms --</option>";
    $.each(data, function (index, value) {
        items += "<option value=" + this['ID'] + ">" + this['Text'] + "</option>";
    })
    $("#ddlIncoterms").html(items);
}
function getAssignedtoSalesRepresentative() {
    var data = [
        { "ID": "1", "Text": "SuperAdmin" },
    ];
    var items = "";
    items += "<option value='-1'>-- Please Select Sales Representative --</option>";
    $.each(data, function (index, value) {
        items += "<option value=" + this['ID'] + ">" + this['Text'] + "</option>";
    })
    $("#ddlSalesRepresentative").html(items);
}

$("#btnSave").click(function () {
    saveVendor();
});

function saveVendor() {
    ID = $("#hfid").val();
    VendorName = $("#txVendorName").val();
    AliasName = $("#txtAliasName").val();
    VendorCode = $("#txtVendorCode").val();
    Status = $("#ddlStatus").val();
    Address = $("#txtAddress").val();
    City = $("#txtCity").val();
    State = $("#txtState").val();
    ZipCode = $("#txtZipCode").val();
    Country = $("#txtCountry").val();
    Phone = $("#txtPhone").val();
    Fax = $("#txtFax").val();
    EMail = $("#txtEMail").val();
    Web = $("#txtWeb").val();
    ProfId = $("#txtProfId").val();
    Salestaxused = $("#ddlSalestaxused").val();
    ThirdPartyType = $("#ddlThirdPartyType").val();
    Workforce = $("#ddlWorkforce").val();
    BusinessEntityType = $("#txtBusinessEntityType").val();
    Capital = $("#txtCapital").val();
    ddlIncoterms = $("#ddlIncoterms").val();
    Incoterms = $("#txtIncoterms").val();
    SalesRepresentative = $("#ddlSalesRepresentative").val();

    if (VendorName == "") {swal('alert', 'Please Enter Vendor Name', 'error').then(function () { swal.close(); $('#txVendorName').focus(); })}
    else if (AliasName == "") {swal('alert', 'Please Enter Alias Name', 'error').then(function () { swal.close(); $('#txtAliasName').focus(); })}
    else if (Status == "") {swal('alert', 'Please Enter Status', 'error').then(function () { swal.close(); $('#ddlStatus').focus(); })}
    else if (Address == "") {swal('alert', 'Please Enter Address', 'error').then(function () { swal.close(); $('#txtAddress').focus(); })}
    else if (City == "") {swal('alert', 'Please Enter City', 'error').then(function () { swal.close(); $('#txtCity').focus(); })}
    else if (State == "") { swal('alert', 'Please Enter State', 'error').then(function () { swal.close(); $('#txtState').focus(); })}
    else if (ZipCode == "") { swal('alert', 'Please Enter ZipCode', 'error').then(function () { swal.close(); $('#txtZipCode').focus(); })}
    else if (Country == "") { swal('alert', 'Please Enter Country', 'error').then(function () { swal.close(); $('#txtCountry').focus(); })}
    else if (Phone == "") { swal('alert', 'Please Enter Phone', 'error').then(function () { swal.close(); $('#txtPhone').focus(); })}
    else if (Fax == "") { swal('alert', 'Please Enter Fax', 'error').then(function () { swal.close(); $('#txtFax').focus(); })}
    else if (EMail == "") { swal('alert', 'Please Enter EMail', 'error').then(function () { swal.close(); $('#txtEMail').focus(); }) }
    else if (Web == "") { swal('alert', 'Please Enter Web', 'error').then(function () { swal.close(); $('#txtWeb').focus(); }) }
    else if (ProfId == "") { swal('alert', 'Please Enter Prof Id', 'error').then(function () { swal.close(); $('#txtProfId').focus(); }) }
    else if (Salestaxused == "") { swal('alert', 'Please Select Sales tax used', 'error').then(function () { swal.close(); $('#ddlSalestaxused').focus(); }) }
    else if (ThirdPartyType == "-1") { swal('alert', 'Please Select Third Party Type', 'error').then(function () { swal.close(); $('#ddlThirdPartyType').focus(); }) }
    else if (Workforce == "-1") { swal('alert', 'Please Select Workforce', 'error').then(function () { swal.close(); $('#ddlWorkforce').focus(); }) }
    else if (BusinessEntityType == "") { swal('alert', 'Please Enter Business Entity Type', 'error').then(function () { swal.close(); $('#txtBusinessEntityType').focus(); }) }
    else if (Capital == "") { swal('alert', 'Please Enter Capital', 'error').then(function () { swal.close(); $('#txtCapital').focus(); }) }
    else if (ddlIncoterms != "-1") { swal('alert', 'Please Enter Incoterms', 'error').then(function () { swal.close(); $('#txtIncoterms').focus(); }) }
    else if (SalesRepresentative == "-1") { swal('alert', 'Please Select Sales Representative', 'error').then(function () { swal.close(); $('#ddlSalesRepresentative').focus(); }) }

    else {
        var obj = {
            rowid: ID,
            Name: VendorName, AliasName: AliasName, VendorCode: VendorCode, Status: Status, Address: Address,
            City: City, State: State, ZipCode: ZipCode, Country: Country, Phone: Phone, Fax: Fax, EMail: EMail, Web: Web,
            ProfId: ProfId, SalesTaxUsed: Salestaxused, ThirdPartyType: ThirdPartyType, Workforce: Workforce, BusinessEntityType: BusinessEntityType,
            Capital: Capital, IncotermsType: ddlIncoterms, Incoterms: Incoterms, AssignedToSalesRepresentative: SalesRepresentative,
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
                        switch (this.type) {case "text":case "email":case "tel":$(this).val('');break;}
                    });
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

