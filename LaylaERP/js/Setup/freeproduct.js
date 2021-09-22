function getProduct(control) {
    $.ajax({
        url: "/Setup/GetProduct",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please Select Product</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $(control).html(opt);
        }

    });
}





function AddFreeProduct() {
    productid = $("#ddlproduct").val();
    freeproductid = $("#ddlfreeproduct").val();
    quantity = $("#txtquantity").val();

    if (productid == 0) {
        swal('Alert', 'Please Select Product', 'error').then(function () { swal.close(); $('#ddlproduct').focus(); });
    }
    else if (freeproductid == 0) {
        swal('Alert', 'Please Select Free Product', 'error').then(function () { swal.close(); $('#ddlfreeproduct').focus(); });
    }
    else if (productid == freeproductid) {
        swal('Alert', 'Please Select Other Free Product', 'error').then(function () { swal.close(); $('#ddlfreeproduct').focus(); });
    }


    else {
        alert('hello');

        //var obj = {
        //    prefix_code: prefixcode,
        //    product_id: product,
        //}
        //$.ajax({
        //    url: '/Setup/AddProductWarehouseRule/', dataType: 'json', type: 'Post',
        //    contentType: "application/json; charset=utf-8",
        //    data: JSON.stringify(obj),
        //    dataType: "json",
        //    beforeSend: function () { $("#loader").show(); },
        //    success: function (data) {
        //        if (data.status == true) {
        //            swal('Alert!', data.message, 'success');
                   
        //        }
        //        else {
        //            swal('Alert!', data.message, 'error');
        //        }
        //    },
        //    complete: function () { $("#loader").hide(); },
        //    error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        //})

    }

}


$('#ddlproduct').change(function () {
    product = $("#ddlproduct").val();
    var obj = {
        product_id: product,
    }
    $.ajax({
        url: '/Setup/GetFreeProductCount/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == false) {

            }
            else {
                $("#ddlproduct").val("0").trigger('change');
                swal('Alert', 'Product already exists in table', 'error').then(function () { swal.close(); $('#ddlProduct').focus(); });
            }
        },

        error: function (error) {
            swal('Error!', 'something went wrong', 'error');
        },
    })
});
