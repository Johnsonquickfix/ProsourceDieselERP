
$(document).ready(function () {
    $(".select2").select2();
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
               // var cost_price = purchase_price + salestax + shipping_price + Misc_Costs;
                //console.log(data);
                $("#ddlVendor").val(data.fk_vendor).trigger('change');
                $("#txttaglotno").val(data.taglotserialno);
                $("#txtminpurchasequantity").val(data.minpurchasequantity);
                $("#txtcurrencyconversionrate").val(data.purchase_price);
                $("#txtSaletax").val(data.salestax);
                $("#txtshippingprice").val(data.shipping_price);
                $("#txtMisccosts").val(data.Misc_Costs);
                $("#txtcostprice").val(data.cost_price);
                $("#txtDiscountqty").val(data.discount);
                $("#txtRemarks").val(data.remark);

                CostPriceList();

            }
        });

    });

});

    $("#btnsave").click(function () {
        //debugger;
        var product = $("#ddlProduct").val();
        var fk_vendor = $("#ddlVendor").val();
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

        var obj = { fk_product: product, taglotserialno: taglotserialno, minpurchasequantity: minpurchasequantity, purchase_price: purchase_price, salestax: salestax, shipping_price: shipping_price, Misc_Costs: Misc_Costs, cost_price: cost_price, discount: discount, remark: remark, taxrate: taxrate, fk_vendor: fk_vendor }
        if (product == null || product == '0') {
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
                        swal('Success', 'Product Update Successfully', 'success').then(function () { swal.close(); CostPriceList(); });
                    }
                }

            });
        }
   
 });

function removeInput() {
    //debugger;
   // $("#ddlProduct").val('0').trigger('change');
   // $("#ddlVendor").val('-1').trigger('change');
     $("#txttaglotno").val('');
     $("#txtminpurchasequantity").val('');
     $("#txtcurrencyconversionrate").val('');
     $("#txtSaletax").val('');
     $("#txtshippingprice").val('');
     $("#txtMisccosts").val('');
     $("#txtcostprice").val('');
     $("#txtDiscountqty").val('');
     $("#txtRemarks").val('');
    $("#ddltaxrate").val('0').trigger('change');
    $("#txttaglotno").focus();
}

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

 
$("#txtcurrencyconversionrate").change(function () {

    var cost_price =parseFloat($("#txtcurrencyconversionrate").val()) + parseFloat($("#txtSaletax").val()) + parseFloat($("#txtshippingprice").val()) + parseFloat($("#txtMisccosts").val());
    $("#txtcostprice").val(cost_price.toFixed(2));
});
$("#txtSaletax").change(function () {
    //debugger;
    var cost_price =  parseFloat($("#txtcurrencyconversionrate").val()) + parseFloat($("#txtSaletax").val()) + parseFloat($("#txtshippingprice").val()) + parseFloat($("#txtMisccosts").val());
    $("#txtcostprice").val(cost_price.toFixed(2));
});
$("#txtshippingprice").change(function () {
    //debugger;
    var cost_price = parseFloat($("#txtcurrencyconversionrate").val()) + parseFloat($("#txtSaletax").val()) + parseFloat($("#txtshippingprice").val()) + parseFloat($("#txtMisccosts").val());
    $("#txtcostprice").val(cost_price.toFixed(2));
});
$("#txtMisccosts").change(function () {

    var cost_price = parseFloat($("#txtcurrencyconversionrate").val()) + parseFloat($("#txtSaletax").val()) + parseFloat($("#txtshippingprice").val()) + parseFloat($("#txtMisccosts").val());
    $("#txtcostprice").val(cost_price.toFixed(2));
});


function CostPriceList() {
    var product = $("#ddlProduct").val();
 
    var obj = { id: product }
    $.ajax({
        url: '/ProductCostPrice/GetProductList/',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        data: JSON.stringify(obj),
        beforeSend: function () { $("#loader1").show(); },
        success: function (data) {
            //debugger;
            var q = JSON.parse(data);
            //debugger;
           //$('#dtdataVendor').dataTable();
            $('#dtdataVendor').dataTable({
                destroy: true,
                scrollX: false,
                data: JSON.parse(data),
                "columns": [
                    { data: 'product', title: 'Product', sWidth: "15%" },
                    { data: 'vendor', title: 'Vendor', sWidth: "10%" },
                    { data: 'taglotserialno', title: 'Tag/Lot/Serial No.', sWidth: "10%" },
                    { data: 'minpurchasequantity', title: 'Purchase quantity', sWidth: "10%" },
                    { data: 'purchase_price', title: 'Price', sWidth: "10%",  },
                    { data: 'salestax', title: 'Sales Tax', sWidth: "10%",},
                    { data: 'shipping_price', title: 'Shipping Price', sWidth: "10%" },
                    { data: 'Misc_Costs', title: 'Misc. Price', sWidth: "10%", },
                    { data: 'cost_price', title: 'Cost Price', sWidth: "10%", },
                    { data: 'discount', title: 'Discount %', sWidth: "10%", },
                   // { data: 'remark', title: 'remark', sWidth: "10%",  },
                    //{ data: 'month_velocity', title: 'Date To', sWidth: "10%",  },
                    //{ data: 'month_velocity', title: 'Status', sWidth: "10%",  },
                    //{ data: 'month_velocity', title: 'Action', sWidth: "10%", },
                    //{ data: 'month_velocity', title: 'Active/InActive', sWidth: "10%",  },
                    //{ data: 'month_velocity', title: 'View All Price', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '') },
                ],
                "order": [[0, 'asc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        },
        complete: function () { $("#loader1").hide(); }
    });

}