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
