

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