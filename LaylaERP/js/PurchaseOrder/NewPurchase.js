$("#loader").hide();
getIncoterm();
getVendor();
getPaymentTerm();
getPaymentType();
getBalanceDays();

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
function getBalanceDays() {

    $.ajax({
        url: "/PurchaseOrder/GetBalanceDays",
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

$("#btnSave").click(function () {
    saveVendor();
});
function saveVendor() {
    ID = $("#hfid").val();
    VendorID = $("#ddlVendor").val();
    Vendor = $("#ddlVendor").find('option:selected').text();;

    VendorCode = $("#txtRefvendor").val();
    PaymentTerms = $("#ddlPaymentTerms").val();
    Balancedays = $("#ddlBalancedays").val();
    PaymentType = $("#ddlPaymentType").val();
    Planneddateofdelivery = $("#txtPlanneddateofdelivery").val();
    IncoTermType = $("#ddlIncoTerms").val();
    IncoTerm = $("#txtIncoTerms").val();
    NotePublic = $("#txtNotePublic").val();
    NotePrivate = $("#txtNotePrivate").val();



    if (VendorID == "-1") { swal('alert', 'Please Select Vendor', 'error').then(function () { swal.close(); $('#ddlVendor').focus(); }) }
    else if (VendorCode == "") { swal('alert', 'Please Enter Refvendor', 'error').then(function () { swal.close(); $('#txtRefvendor').focus(); }) }
    else if (PaymentTerms == "-1") { swal('alert', 'Please Select Payment Terms', 'error').then(function () { swal.close(); $('#ddlPaymentTerms').focus(); }) }
    else if (Balancedays == "-1") { swal('alert', 'Please Select Balance days', 'error').then(function () { swal.close(); $('#ddlBalancedays').focus(); }) }
    else if (PaymentType == "-1") { swal('alert', 'Please Select Payment Type', 'error').then(function () { swal.close(); $('#ddlPaymentType').focus(); }) }
    else if (Planneddateofdelivery == "") { swal('alert', 'Please Select Planned date of delivery', 'error').then(function () { swal.close(); $('#txtPlanneddateofdelivery').focus(); }) }
    else if (IncoTermType == "-1") { swal('alert', 'Please Select IncoTerm', 'error').then(function () { swal.close(); $('#ddlIncoTerms').focus(); }) }
    else if (IncoTerm == "") { swal('alert', 'Please Enter IncoTerm', 'error').then(function () { swal.close(); $('#txtIncoTerms').focus(); }) }
    else if (NotePublic == "") { swal('alert', 'Please Enter Note Public', 'error').then(function () { swal.close(); $('#txtNotePublic').focus(); }) }
    else if (NotePrivate == "") { swal('alert', 'Please Enter Note Private', 'error').then(function () { swal.close(); $('#txtNotePrivate').focus(); }) }
    else {
        var obj = {
            rowid: ID, VendorID: VendorID, Vendor: Vendor, VendorCode: VendorCode, PaymentTerms:PaymentTerms, Balancedays: Balancedays,
            PaymentType: PaymentType, Planneddateofdelivery: Planneddateofdelivery,
            IncotermType: IncoTermType, Incoterms: IncoTerm, note_public: NotePublic, note_private: NotePrivate,
        }
        $.ajax({
            url: '/PurchaseOrder/NewPurchase/', dataType: 'json', type: 'Post',
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
                    //window.location = "../../PurchaseOrder/PurchaseList";
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
function GetPurchaseOrderByID(id) {
    var rowid = id;
    if (rowid == "NewVendor") { $('#lbltitle').text("Add New Vendor"); } else { $('#lbltitle').text("Update Vendor"); }
    var obj =
        $.ajax({
            url: "/PurchaseOrder/GetPurchaseOrderByID/" + rowid,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            success: function (data) {
                var d = JSON.parse(data);
                if (d.length > 0) {
                    $('#lblVendor').text(d[0].ref);
                   
                }
            },
            error: function (msg) {

            }
        });

}