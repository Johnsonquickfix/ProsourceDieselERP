getIncoterm();
getPaymentTerm();
getBalanceDays();
getPaymentType();
getSource();
getVendor();
getCommercialProposalCode();
function getVendor() {
    $.ajax({
        url: "/CommercialProposal/GetVendor",
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
function getIncoterm() {
    $.ajax({
        url: "/CommercialProposal/GetIncoterm",
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

$('#ddlVendor').change(function () {
    var VendorTypeID = $('#ddlVendor').val();
    var obj = { VendorTypeID: VendorTypeID };
    jQuery.ajax({
        url: "/CommercialProposal/GetVendorByID", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            $('#txtrefvendor').val(data[0].rowid);
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });
});

$('#ddlIncoTerm').change(function () {
    var IncotermsTypeID = $('#ddlIncoTerm').val();
    var obj = { IncotermsTypeID: IncotermsTypeID };
    jQuery.ajax({
        url: "/CommercialProposal/GetIncotermByID", dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            $('#txtIncoTerm').val(data[0].short_description);
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });
});

function getPaymentTerm() {

    $.ajax({
        url: "/CommercialProposal/GetPaymentTerm",
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
        url: "/CommercialProposal/GetBalanceDays",
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

function getPaymentType() {

    $.ajax({
        url: "/CommercialProposal/GetPaymentType",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please Select Payment Type</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlGetPaymentType').html(opt);
        }

    });
}

function getSource() {

    $.ajax({
        url: "/CommercialProposal/SourceOrderChannel",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please Select Source Type</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlGsetSourceType').html(opt);
        }

    });
}


function getCommercialProposalCode() {
    var obj =
        $.ajax({
            url: "/CommercialProposal/GetCommerceCode/",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            success: function (data) {
                var d = JSON.parse(data);
                if (d.length > 0) {
                    $("#txtref").val(d[0].Code);
                }
            },
            error: function (msg) {

            }
        });

}