

$(document).ready(function () {

    getProducts();
    getVendor();

    $("#ddlProduct").change(function () {
        //debugger;
        var product = $("#ddlProduct").val();
        var obj = { id: product };
        $.ajax({
            url: "/ProductCostPrice/GetProductById/",
            type: 'Post',
            datatype: 'json',
            contentType: "application/json; charset=utf-8",
            processing: true,
            data: JSON.stringify(obj),
            success: function (result) {
               // debugger;
                var data = JSON.parse(result);
                data = data[0];
                //console.log(data);
                $("#txttaglotno").val(data.taglotserialno);
                $("#txtminpurchasequantity").val(data.minpurchasequantity);
                $("#txtcurrencyconversionrate").val(data.purchase_price);
                $("#txtSaletax").val(data.salestax);
                $("#txtshippingprice").val(data.shipping_price);
                $("#txtMisccosts").val(data.Misc_Costs);
                $("#txtcostprice").val(data.cost_price);
                $("#txtDiscountqty").val(data.discount);
                $("#txtRemarks").val(data.remark);

            }
        });

    });
});

    $("#btnsave").click(function () {
        //debugger;
        var product = $("#ddlProduct").val();

        var taglotserialno      =  $("#txttaglotno").val();
        var minpurchasequantity =  $("#txtminpurchasequantity").val();
        var purchase_price      =  $("#txtcurrencyconversionrate").val();
        var salestax            =  $("#txtSaletax").val();
        var shipping_price      =  $("#txtshippingprice").val();
        var Misc_Costs          =  $("#txtMisccosts").val();
        var cost_price          =  $("#txtcostprice").val();
        var discount            =  $("#txtDiscountqty").val();
        var remark              =  $("#txtRemarks").val();
        var taxrate             =  $("#ddltaxrate").val();

        var obj = { fk_product: product,taglotserialno: taglotserialno, minpurchasequantity: minpurchasequantity, purchase_price: purchase_price, salestax: salestax, shipping_price: shipping_price, Misc_Costs: Misc_Costs, cost_price: cost_price, discount: discount, remark: remark, taxrate: taxrate }
        if (product == null) {
            swal('Alert', 'Please select product', 'error').then(function () { swal.close(); $('#ddlProduct').focus(); });
        }
        else {
            $.ajax({
                url: "/ProductCostPrice/UpdateProduct/",
                type: 'Post',
                datatype: 'json',
                contentType: "application/json; charset=utf-8",
                processing: true,
                data: JSON.stringify(obj),
                success: function (result) {
                   // debugger;
                    //console.log(result);
                  
                    if (result == '1')
                    {
                        swal('Success', 'Product Update Successfully', 'success').then(function () { swal.close();});
                    }
                }

            });
        }
   
 });





function getProducts() {
    $("#loader1").show();
    //debugger;
    $.ajax({
        url: "/Inventory/GetNewProductList",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please select product</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
                
            }
            $('#ddlProduct').html(opt);
            $("#loader1").hide();
        }

    });
}

function getVendor() {
    $.ajax({
        url: "/PurchaseOrder/GetVendor",
        type: "Get",
        success: function (data) {
            $('#ddlVendor').append('<option value="-1">Please Select Vendor</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddlVendor').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}

