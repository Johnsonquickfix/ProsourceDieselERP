$(document).ready(function () {
    $("#loader1").hide();
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
 
     
  
    $('li:contains(Variations)').hide();
    if (id != "" && id != "AddNewPurchase" && id != "AddNewProduct") {
        $.get('/Product/GetProductVariantID/' + id, function (data) {
            var items = "";
            $.each(data, function (index, value) {
                items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlproductchild");
            })
        });
       
        setTimeout(function () { $('#btndisplaydetails').attr('disabled', false); }, 1000);
        $(document).on('click', "#btndisplaydetails", function () {
            bindsaleproduct();
            getVendorProducts(24);
        })
        $.get('/Product/Getwarehouse/', function (data) {
            var items = "";
            $.each(data, function (index, value) {
                items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlwarehouse");
            })
        });
        
        
    }
     
    
});

function getVendorProducts(VendorID) {
    
    $.ajax({
        url: '/PurchaseOrder/GetVenderProducts', dataType: 'json', type: "get", contentType: "application/json; charset=utf-8",
        data: { strValue1: VendorID },
        success: function (data) {
            let dt = JSON.parse(data);
            //Payment Terms
            $("#ddlProduct").html('<option value="0">Select Product</option>');
            for (i = 0; i < dt.length; i++) { $("#ddlProduct").append('<option value="' + dt[i].id + '">' + dt[i].text + '</option>'); }

        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }, async: false
    });
}


$(document).on("click", "#btnRefresh", function (t) {
    $('#ddlproductchild').trigger('change');
});

$(document).on('click', "#btnsaleproduct", function () {
    Add();
})

function Add() {
    debugger
    ID = $("#hfsalepurchaeproduct").val();
    fk_productval = $('#ddlproductchild').val();
    saleproduct = $("#ddlProduct").val();

    if (fk_productval == "") {
        swal('Alert', 'Please Enter Product', 'error').then(function () { swal.close(); $('#ddlproductchild').focus(); });
    }
    else if (saleproduct == "") {
        swal('Alert', 'Please select sale product', 'error').then(function () { swal.close(); $('#ddlProduct').focus(); });
    }
    else {
        var obj = {
            ID: ID,
            fk_product: fk_productval,
            fk_vendor: saleproduct

        }
        $.ajax({
            url: '/PurchaseProduct/Createsalepurchaseproduct/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () {
                $("#loader1").show();
            },
            success: function (data) {
                if (data.status == true) {
                    if (data.url == "Manage") {
                        bindsaleproduct();
                        swal('Success!', data.message, 'success');
                    }
                    else {
                        // $('#fetch_results > input:text').val('');
                        swal('Success!', data.message, 'success');
                    }
                    //$('#ddlProduct').val(null).trigger('change');
                    //clear_fetch();

                }
                else {
                    swal('Alert!', data.message, 'error')
                }
            },
            complete: function () {
                $("#loader1").hide();
                //location.href = '/Users/Users/';
                //window.location.href = '/Users/Users/';

            },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
        })
    }



}
function bindsaleproduct() {
    let PostID = $('#ddlproductchild').val();

    var obj = { strValue1: PostID };
    $.ajax({
        type: "POST", url: '/PurchaseProduct/GetsaleprodectdataData', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        beforeSend: function () { $("#loader1").show(); },
        success: function (data) {
            var itemsDetailsxml = [];
            for (var i = 0; i < data.length; i++) {
                // let row_key = data[i].ID ;                      
                itemsDetailsxml.push({
                    PKey: data[i].ID, product_id: data[i].ID, product_name: data[i].product_name, product_label: data[i].product_label, StatusActive: data[i].Stock
                });

            }
            bindsaleproductDetails(itemsDetailsxml);
        },
        complete: function () { $("#loader1").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader1").hide(); swal('Alert!', errorThrown, "error"); },
        async: false

    });
}

function bindsaleproductDetails(data) {
    // console.log('g', data);
    var layoutHtml = '';
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].PKey > 0) {
                layoutHtml += '<tr id="tritemId_' + data[i].PKey + '" data-key="' + data[i].PKey + '">';
                layoutHtml += '<td class="text-left">' + data[i].product_label + '</td>';
                layoutHtml += '<td class="text-left">' + data[i].product_name + '</td>';
                layoutHtml += '<td>' + data[i].StatusActive + '</td>';
                if (data[i].StatusActive == "InActive")
                    layoutHtml += '<td><a href="javascript:void(0);" title="Click here to Active" data-toggle="tooltip" class="editbutton" onClick="Activesaleproduct(' + data[i].PKey + '); ActivityLog(\'Edit product warehouse\',\'/Product/AddNewProduct/' + data[i].PKey + '\');"><i class="glyphicon glyphicon-eye-open"></i></a></td>';
                else
                    layoutHtml += '<td><a href="javascript:void(0);" title="Click here In-Active" data-toggle="tooltip" class="editbutton" onClick="Deletesaleproduct(' + data[i].PKey + '); ActivityLog(\'delete product warehouse\',\'/Product/AddNewProduct/' + data[i].PKey + '\');"><i class="glyphicon glyphicon-trash"></i></a></td>';
                layoutHtml += '</tr>';
            }
        }
        // console.log(layoutHtml);
        $('#saleproduct_services').empty().append(layoutHtml);

    }
    else {
        layoutHtml += '<table id="dtdatakits" class="table-blue table table-bordered table-striped dataTable">';
        layoutHtml += '<thead>';
        layoutHtml += '<tr>';
        layoutHtml += '<th class="text-left">Warehouse</th>';
        layoutHtml += '<th class="text-left">Product</th>';
        layoutHtml += '<th>Status</th>';
        layoutHtml += '<th class="text-right">Delete</th>';
        layoutHtml += '</tr>';
        layoutHtml += '</thead><tbody id="saleproduct_services"></tbody>';
        layoutHtml += '</table>';
        $('#ddlProduct').empty().html(layoutHtml);
    }

}

function Deletesaleproduct(id) {
    var ids = id;
    var obj = { ID: ids }
    swal({ title: "Are you sure?", text: 'Would you like to delete this?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) {
                $.ajax({
                    url: '/PurchaseProduct/Deletsaleprodect/', dataType: 'json', type: 'Post',
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(obj),
                    dataType: "json",
                    beforeSend: function () {
                        $("#loader1").show();
                    },
                    success: function (data) {
                        if (data.status == true) {
                            if (data.url == "Manage") {
                                bindsaleproduct();
                                swal('Success!', data.message, 'success');
                            }
                            else {
                                swal('Success!', data.message, 'success');
                            }

                        }
                        else {
                            swal('Alert!', data.message, 'error')
                        }
                    },
                    complete: function () {
                        $("#loader1").hide();
                    },
                    error: function (error) {
                        swal('Error!', 'something went wrong', 'error');
                    },
                })
            }
        });
}

function Activesaleproduct(id) {
    var ids = id;
    var obj = { ID: ids }
    swal({ title: "Are you sure?", text: 'Would you like to active this?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) {
                $.ajax({
                    url: '/PurchaseProduct/Activesaleprodect/', dataType: 'json', type: 'Post',
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(obj),
                    dataType: "json",
                    beforeSend: function () {
                        $("#loader1").show();
                    },
                    success: function (data) {
                        if (data.status == true) {
                            if (data.url == "Manage") {
                                bindsaleproduct();
                                swal('Success!', data.message, 'success');
                            }
                            else {
                                swal('Success!', data.message, 'success');
                            }

                        }
                        else {
                            swal('Alert!', data.message, 'error')
                        }
                    },
                    complete: function () {
                        $("#loader1").hide();
                    },
                    error: function (error) {
                        swal('Error!', 'something went wrong', 'error');
                    },
                })
            }
        });
}

