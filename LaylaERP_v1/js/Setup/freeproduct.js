freeproductlist();
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
    else if (quantity == "") {
        swal('Alert', 'Please Enter Quantity', 'error').then(function () { swal.close(); $('#txtquantity').focus(); });
    }

    else {
        var obj = {
            on_product_id: productid,
            free_product_id: freeproductid,
            free_quantity: quantity,
            product_id: productid,
        }
        $.ajax({
            url: '/Setup/AddFreeProduct/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success');
                    freeproductlist();
                    reset();
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })

    }

}

//function productcheck() {
//    $('#ddlproduct').change(function () {
//        product = $("#ddlproduct").val();
//        var obj = {
//            product_id: product,
//        }
//        $.ajax({
//            url: '/Setup/GetFreeProductCount/', dataType: 'json', type: 'Post',
//            contentType: "application/json; charset=utf-8",
//            data: JSON.stringify(obj),
//            dataType: "json",
//            success: function (data) {
//                if (data.status == false) {

//                }
//                else {
//                    $("#ddlproduct").val("0").trigger('change');
//                    swal('Alert', 'Product already exists in table', 'error').then(function () { swal.close(); $('#ddlProduct').focus(); });
//                }
//            },

//            error: function (error) {
//                swal('Error!', 'something went wrong', 'error');
//            },
//        })
//    });
//}

function freeproductlist() {
    $.ajax({
        url: '/Setup/GetFreeProduct',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        success: function (data) {
            $('#dtdata').dataTable({
                destroy: true,
                scrollX: false,
                data: JSON.parse(data),
                "columns": [
                    { data: 'id', title: 'ID', sWidth: "10%" },
                    { data: 'product', title: 'Product', sWidth: "10%", },
                    { data: 'freeproduct', title: 'Free Product', sWidth: "10%", },
                    { data: 'quantity', title: 'Quantity', sWidth: "10%", },
                    {
                        'data': 'id', sWidth: "8%",
                        'render': function (id, type, full, meta) {

                            return '<a href="../Setup/editfreeproduct/' + id + '" data-toggle="tooltip" title="View/Edit product"><i class="glyphicon glyphicon-pencil"></i></a>';

                        }
                    },
                ],
                "order": [[0, 'desc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });

}

function reset() {
    $("#ddlproduct").val("0").trigger('change');
    $("#ddlfreeproduct").val("0").trigger('change');
    $("#txtquantity").val("");
}