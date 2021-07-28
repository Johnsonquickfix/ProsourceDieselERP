$("#loader").hide();
getIncoterm();
getVendor();
getPaymentTerm();
getPaymentType();

$('#ddlVendor').change(function () {
    var VendorID = $('#ddlVendor').val();
    var obj = { VendorID: VendorID };
    jQuery.ajax({
        url: "/PurchaseOrder/GetVendorByID", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            $('#txtRefvendor').val(data[0].vendor);
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });
})
$('#ddlIncoTerms').change(function () {
    var IncotermsTypeID = $('#ddlIncoTerms').val();
    var obj = { IncotermsTypeID: IncotermsTypeID };
    jQuery.ajax({
        url: "/PurchaseOrder/GetIncotermByID", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            $('#txtIncoTerms').val(data[0].short_description);
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });
})
function getIncoterm() {
    $.ajax({
        url: "/PurchaseOrder/GetIncoterm",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please Select IncoTerms</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlIncoTerms').html(opt);
        }

    });
}
function getVendor() {
    $.ajax({
        url: "/PurchaseOrder/GetVendor",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please Select Vendor</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlVendor').html(opt);
        }

    });
}
function getPaymentTerm() {

    $.ajax({
        url: "/PurchaseOrder/GetPaymentTerm",
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
function getPaymentType() {

    $.ajax({
        url: "/PurchaseOrder/GetPaymentType",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please Select Payment Type</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlPaymentType').html(opt);
        }

    });
}