$(document).ready(function () {
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    $("#loader").hide();
    $(".select1").select2();   
    $(document).on('click', "#btnAdd", function () {
        addOpeningStock();
    });
    getProduct();
    if (id > 0) {
        $("#hfid").val(id);
        console.log(id);
        EditSelect(id);
    }
    else {
        $("#hfid").val("0");
    } 
})

function getProduct() {
    $.ajax({
        url: "/Setup/GetProduct",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please Select Product</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlProduct').html(opt);
        }

    });
} 

function addOpeningStock() {
    product = $("#ddlProduct").val();
    op_rate = $("#txtrate").val();
    po_qty = $("#txtqty").val();
    op_tag = $("#txttag").val();

    if (product == 0) {
        swal('Alert', 'Please select product', 'error').then(function () { swal.close(); $('#ddlProduct').focus(); });
    }
    else if (op_rate <= 0) {
        swal('Alert', 'Please enter rate', 'error').then(function () { swal.close(); $('#txtrate').focus(); });
    }
    else if (po_qty <= 0) {
        swal('Alert', 'Please enter qty', 'error').then(function () { swal.close(); $('#txtqty').focus(); });
    }
     
    else {

        var obj = {
            product_id: product,
            op_qty: po_qty,
            op_rate: op_rate,
            tag: op_tag,
        
        }
        var checkstr = confirm('are you sure want to add?');
        if (checkstr == true) {
        $.ajax({
            url: '/Product/AddOpeningStock/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    //$('#parent > input:text').val('');
                    //swal('Success', data.message, 'success');
                    //swal('Success', data.message, 'success').then((result) => { location.href = '../Customer'; });
                    if (data.url == "Manage") {
                        swal('Alert!', data.message, 'success').then((result) => { location.href = 'ProductOpeningStock'; });
                    }
                    else {
                        swal('Success', data.message, 'success').then((result) => { location.href = '../ProductOpeningStock'; });
                       
                    }
                    
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })
        } else {
            return false;
        }
    }

}

$('#ddlProduct').change(function () {
    pid =  parseInt($("#hfid").val()) || 0
    product = $("#ddlProduct").val();
    var obj = {
        product_id: product,
    }
    console.log(pid);
    if (pid == 0) {
        $.ajax({
            url: '/Product/GetProductCount/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            success: function (data) {
                if (data.status == false) {

                }
                else {
                    //$("#ddlProduct").val("0").trigger('change');
                    //swal('Alert', 'Product already exists in table', 'error').then(function () { swal.close(); $('#ddlProduct').focus(); });
                    swal({ title: 'Product already exists?', text: "Can not add again", type: 'warning', showCancelButton: false, cancelButtonColor: '#3085d6' }).
                        then((result) => {
                            if (result.value) {
                                $("#ddlProduct").val("0").trigger('change');
                            }

                        })
                }
            },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
        })
    }
});

function EditSelect(id) {
    var obj = { strValue1: id }
    $.ajax({
        url: '/Product/GetOpeningById/',
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
           // $("#hfid").val(jobj[0].rowid);
            $('#txtrate').val(jobj[0].op_rate);
            $('#txtqty').val(jobj[0].op_qty);
            $('#txttag').val(jobj[0].tag);

            setTimeout(function () { getProductid(jobj[0].product_id); }, 1000);
            //$("#ddlProduct").val(jobj[0].product_id).trigger('change');
            $('#ddlProduct').attr("disabled", "disabled");
        },
        complete: function () {   },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        async: false
    });
}
function getProductid(shipping) {
    $('#ddlProduct').val(shipping).trigger('change');
};