var wc_states = [{ "name": "United States", "abbreviation": "US", "states": [{ "name": "Alabama", "abbreviation": "AL" }, { "name": "Alaska", "abbreviation": "AK" }, { "name": "American Samoa", "abbreviation": "AS" }, { "name": "Arizona", "abbreviation": "AZ" }, { "name": "Arkansas", "abbreviation": "AR" }, { "name": "California", "abbreviation": "CA" }, { "name": "Colorado", "abbreviation": "CO" }, { "name": "Connecticut", "abbreviation": "CT" }, { "name": "Delaware", "abbreviation": "DE" }, { "name": "District Of Columbia", "abbreviation": "DC" }, { "name": "Federated States Of Micronesia", "abbreviation": "FM" }, { "name": "Florida", "abbreviation": "FL" }, { "name": "Georgia", "abbreviation": "GA" }, { "name": "Guam", "abbreviation": "GU" }, { "name": "Hawaii", "abbreviation": "HI" }, { "name": "Idaho", "abbreviation": "ID" }, { "name": "Illinois", "abbreviation": "IL" }, { "name": "Indiana", "abbreviation": "IN" }, { "name": "Iowa", "abbreviation": "IA" }, { "name": "Kansas", "abbreviation": "KS" }, { "name": "Kentucky", "abbreviation": "KY" }, { "name": "Louisiana", "abbreviation": "LA" }, { "name": "Maine", "abbreviation": "ME" }, { "name": "Marshall Islands", "abbreviation": "MH" }, { "name": "Maryland", "abbreviation": "MD" }, { "name": "Massachusetts", "abbreviation": "MA" }, { "name": "Michigan", "abbreviation": "MI" }, { "name": "Minnesota", "abbreviation": "MN" }, { "name": "Mississippi", "abbreviation": "MS" }, { "name": "Missouri", "abbreviation": "MO" }, { "name": "Montana", "abbreviation": "MT" }, { "name": "Nebraska", "abbreviation": "NE" }, { "name": "Nevada", "abbreviation": "NV" }, { "name": "New Hampshire", "abbreviation": "NH" }, { "name": "New Jersey", "abbreviation": "NJ" }, { "name": "New Mexico", "abbreviation": "NM" }, { "name": "New York", "abbreviation": "NY" }, { "name": "North Carolina", "abbreviation": "NC" }, { "name": "North Dakota", "abbreviation": "ND" }, { "name": "Northern Mariana Islands", "abbreviation": "MP" }, { "name": "Ohio", "abbreviation": "OH" }, { "name": "Oklahoma", "abbreviation": "OK" }, { "name": "Oregon", "abbreviation": "OR" }, { "name": "Palau", "abbreviation": "PW" }, { "name": "Pennsylvania", "abbreviation": "PA" }, { "name": "Puerto Rico", "abbreviation": "PR" }, { "name": "Rhode Island", "abbreviation": "RI" }, { "name": "South Carolina", "abbreviation": "SC" }, { "name": "South Dakota", "abbreviation": "SD" }, { "name": "Tennessee", "abbreviation": "TN" }, { "name": "Texas", "abbreviation": "TX" }, { "name": "Utah", "abbreviation": "UT" }, { "name": "Vermont", "abbreviation": "VT" }, { "name": "Virgin Islands", "abbreviation": "VI" }, { "name": "Virginia", "abbreviation": "VA" }, { "name": "Washington", "abbreviation": "WA" }, { "name": "West Virginia", "abbreviation": "WV" }, { "name": "Wisconsin", "abbreviation": "WI" }, { "name": "Wyoming", "abbreviation": "WY" }] }, { "name": "Canada", "abbreviation": "CA", "states": [{ "name": "Alberta", "abbreviation": "AB" }, { "name": "British Columbia", "abbreviation": "BC" }, { "name": "Manitoba", "abbreviation": "MB" }, { "name": "New Brunswick", "abbreviation": "NB" }, { "name": "Newfoundland and Labrador", "abbreviation": "NL" }, { "name": "Northwest Territories", "abbreviation": "NT" }, { "name": "Nova Scotia", "abbreviation": "NS" }, { "name": "Nunavut", "abbreviation": "NU" }, { "name": "Ontario", "abbreviation": "ON" }, { "name": "Prince Edward Island", "abbreviation": "PE" }, { "name": "Quebec", "abbreviation": "QC" }, { "name": "Saskatchewan", "abbreviation": "SK" }, { "name": "Yukon Territory", "abbreviation": "YT" }] }]

var auto_coupon = [{ post_title: "matt-found", title: "Mattress-Foundation", type: 'auto_coupon', discount_type: 'fixed_cart', coupon_amount: 10, individual_use: 'no', product_ids: [20861, 118], exclude_product_ids: [] },
{ post_title: "matt-topper", title: "Mattress-Topper", type: 'auto_coupon', discount_type: 'fixed_cart', coupon_amount: 10, individual_use: 'no', product_ids: [56774, 118], exclude_product_ids: [] },
{ post_title: "matt-bedframe", title: "Mattress-Bedframe", type: 'auto_coupon', discount_type: 'fixed_cart', coupon_amount: 10, individual_use: 'no', product_ids: [56774, 118], exclude_product_ids: [] },
{ post_title: "matt-sheet", title: "Mattress-Sheet", type: 'auto_coupon', discount_type: 'fixed_cart', coupon_amount: 10, individual_use: 'no', product_ids: [124524, 118], exclude_product_ids: [] },
{ post_title: "matt-blanket", title: "Mattress-Blanket", type: 'auto_coupon', discount_type: 'fixed_cart', coupon_amount: 10, individual_use: 'no', product_ids: [128244, 118], exclude_product_ids: [] },
{ post_title: "matt-pillow", title: "Mattress-Pillow", type: 'auto_coupon', discount_type: 'fixed_cart', coupon_amount: 10, individual_use: 'no', product_ids: [14023, 118], exclude_product_ids: [] },
{ post_title: "found-frame", title: "Bundle Discount", type: 'auto_coupon', discount_type: 'fixed_cart', coupon_amount: 25, individual_use: 'no', product_ids: [31729, 20861], exclude_product_ids: [] },
{ post_title: "kapok-pillow", title: "Kapok Pillow", type: 'diff', discount_type: '2x_percent', coupon_amount: 50, individual_use: 'no', product_ids: [14023, -1], exclude_product_ids: [] },
{ post_title: 'Memory Foam Mattress', post_title_id: '118', title: 'Memory Foam Mattress', type: 'diff', discount_type: 'fixed_product', coupon_amount: 0, individual_use: 'no', product_ids: [118, -1], exclude_product_ids: [] },
{ post_title: 'Hybrid Mattress', post_title_id: '611172', title: 'Hybrid Mattress', type: 'diff', discount_type: 'fixed_product', coupon_amount: 0, individual_use: 'no', product_ids: [611172, -1], exclude_product_ids: [] },
    { post_title: 'Essential Mattress', post_title_id: '813990', title: 'Essential Mattress', type: 'diff', discount_type: 'fixed_product', coupon_amount: 0, individual_use: 'no', product_ids: [813990, -1], exclude_product_ids: [] },

{ post_title: 'Kapok Pillow', post_title_id: '14023', title: 'Kapok Pillow', type: 'diff', discount_type: 'fixed_product', coupon_amount: 0, individual_use: 'no', product_ids: [14023, -1], exclude_product_ids: [] },
{ post_title: 'Memory Foam Pillow', post_title_id: '611238', title: 'Memory Foam Pillow', type: 'diff', discount_type: 'fixed_product', coupon_amount: 0, individual_use: 'no', product_ids: [611238, -1], exclude_product_ids: [] },
{ post_title: 'Mattress Foundation', post_title_id: '20861', title: 'Mattress Foundation', type: 'diff', discount_type: 'fixed_product', coupon_amount: 0, individual_use: 'no', product_ids: [20861, -1], exclude_product_ids: [] },
{ post_title: 'Bed Frame', post_title_id: '31729', title: 'Bed Frame', type: 'diff', discount_type: 'fixed_product', coupon_amount: 0, individual_use: 'no', product_ids: [31729, -1], exclude_product_ids: [] },
{ post_title: 'Platform Bed', post_title_id: '611252', title: 'Platform Bed', type: 'diff', discount_type: 'fixed_product', coupon_amount: 0, individual_use: 'no', product_ids: [611252, -1], exclude_product_ids: [] },
{ post_title: 'Adjustable Base', post_title_id: '611286', title: 'Adjustable Base', type: 'diff', discount_type: 'fixed_product', coupon_amount: 0, individual_use: 'no', product_ids: [611286, -1], exclude_product_ids: [] },
{ post_title: 'Bamboo Sheets', post_title_id: '124524', title: 'Bamboo Sheets', type: 'diff', discount_type: 'fixed_product', coupon_amount: 0, individual_use: 'no', product_ids: [124524, -1], exclude_product_ids: [] },
{ post_title: 'Weighted Blanket', post_title_id: '128244', title: 'Weighted Blanket', type: 'diff', discount_type: 'fixed_product', coupon_amount: 0, individual_use: 'no', product_ids: [128244, -1], exclude_product_ids: [] },
{ post_title: 'Memory Foam Topper', post_title_id: '56774', title: 'Memory Foam Topper', type: 'diff', discount_type: 'fixed_product', coupon_amount: 0, individual_use: 'no', product_ids: [56774, -1], exclude_product_ids: [] },
{ post_title: 'Essential Mattress Protector', post_title_id: '611268', title: 'Essential Mattress Protector', type: 'diff', discount_type: 'fixed_product', coupon_amount: 0, individual_use: 'no', product_ids: [611268, -1], exclude_product_ids: [] },
{ post_title: 'Full Encasement Mattress Protector', post_title_id: '612955', title: 'Full Encasement Mattress Protector', type: 'diff', discount_type: 'fixed_product', coupon_amount: 0, individual_use: 'no', product_ids: [612955, -1], exclude_product_ids: [] },
{ post_title: 'Cooling Mattress Protector', post_title_id: '612947', title: 'Cooling Mattress Protector', type: 'diff', discount_type: 'fixed_product', coupon_amount: 0, individual_use: 'no', product_ids: [612947, -1], exclude_product_ids: [] },
{ post_title: 'Pet Bed', post_title_id: '611220', title: 'Pet Bed', type: 'diff', discount_type: 'fixed_product', coupon_amount: 0, individual_use: 'no', product_ids: [611220, -1], exclude_product_ids: [] },
{ post_title: 'Adjustable Base Plus', post_title_id: '612995', title: 'Adjustable Base Plus', type: 'diff', discount_type: 'fixed_product', coupon_amount: 0, individual_use: 'no', product_ids: [612995, -1], exclude_product_ids: [] },
{ post_title: 'Metal Platform Base', post_title_id: '733500', title: 'Metal Platform Base', type: 'diff', discount_type: 'fixed_product', coupon_amount: 0, individual_use: 'no', product_ids: [733500, -1], exclude_product_ids: [] }
];
var recycling_item = [118, 20861, 611172];
var podium_baseurl = 'https://api.podium.com', paypal_baseurl = 'https://api-m.sandbox.paypal.com', paypal_baseurl_pay = 'https://www.sandbox.paypal.com';
var _locationUid = '6c2ee0d4-0429-5eac-b27c-c3ef0c8f0bc7';
///Bind States of Country
function BindStateCounty(ctr, obj) {
    var res = wc_states.filter(element => element.abbreviation == obj.id);
    $("#" + ctr + "").html('<option value="0">Select</option>');
    if (res.length > 0) {
        for (i = 0; i < res[0].states.length; i++) { $("#" + ctr + "").append('<option value="' + res[0].states[i].abbreviation + '">' + res[0].states[i].name + '</option>'); }
    }
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Get City By Pin code ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function GetCityByZip(zipcode, ctrcity, ctrstate, ctrcountry, ctrzip) {
    if (zipcode == '') { ctrcity.val(''); ctrcountry.val('US').trigger('change'); ctrstate.val("0").trigger('change'); return false; }
    var option = { strValue1: zipcode };
    $.ajax({
        type: "POST", url: '/Orders/GetCity', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option),
        beforeSend: function () { $("#loader").show(); },
        success: function (result) {
            Object.keys(wc_states).forEach(function (k) {
                let coun = wc_states[k].states.filter(element => element.abbreviation == 'NY');
                if (coun.length > 0) { result.country = wc_states[k].abbreviation; return; }
            });
            ctrcity.val(result.city); ctrcountry.val(result.country).trigger('change');
            //console.log(result, ctrzip);
            if (result.state == null) {
                ctrstate.val("0").trigger('change');
                swal('Alert!', 'Zip code is not valid for the state.', "error").then(function () { swal.close(); ctrzip.focus(); })
            }
            else ctrstate.val(result.state).trigger('change');
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
        complete: function () { $("#loader").hide(); }, async: false
    });
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Common ajax function ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var ajaxFunction = function (url, data, beforeSendFun, successFun, completeFun, errorFun, is_async) {
    $.ajax({
        type: "POST", url: url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(data),
        beforeSend: beforeSendFun, success: successFun, complete: completeFun, error: errorFun, async: is_async
    });
}
function beforeSendFun() { $("#loader").show(); }
function completeFun() { $("#loader").hide(); }
function errorFun(XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); }
function groupArrayOfObjects(list, key) {
    return list.reduce(function (rv, x) { (rv[x[key]] = rv[x[key]] || []).push(x); return rv; }, {});
};
function isNullAndUndef(variable) { return (variable !== null && variable !== undefined && variable !== 'undefined' && variable !== 'null'); }
function isNullUndefAndSpace(variable) { return (variable !== null && variable !== undefined && variable !== 'undefined' && variable !== 'null' && variable.length !== 0); }

function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () { callback(reader.result); }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}
