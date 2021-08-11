$(document).ready(function () {
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    $('li:contains(Variations)').hide();

    if (id != "" && id != "AddNewPurchase") {

    }
    $('#dvbuysing').hide();
    $(document).on('click', "#btnbuying", function () {
        $('#dvbuysing').show();
    })

    $(document).on('click', "#btnbuyingcl", function () {
        $('#dvbuysing').hide();
    })

    $.get('/Product/GetProductVariant/' + id, function (data) {
        var items = "";
        $.each(data, function (index, value) {
            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlproductchild");
        })
    });

    $.get('/Product/GetProductCategory/' + id, function (data) {
        var items = "";
        $('#ddlCategoryfilter').empty();
        items += "<option value=''>Please select</option>";
        $.each(data, function (index, value) {
            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlCategoryfilter");
        })
        $('#ddlCategoryfilter').bind(items);
    });

    $("#filtersrchexp").click(function (e) {
        dataGridLoad($("#ddlproductchild").val());
    });
    setTimeout(function () { GetDataByID($("#ddlproductchild").val()); }, 2000);
    setTimeout(function () { bindChildproductsservices(); }, 3000);
    setTimeout(function () { bindparentproductsservices(); }, 4000);
     
});

$("#btnaddupdatechild").click(function (e) {
    let _ItemProduct = [];
    $("#order_line_items > tr").each(function (index, tr) {
        console.log(tr);
        if (parseInt($(tr).find("input[name = txt_ItemQty]").val()) > 0) {
            _ItemProduct.push(
                { fk_product: $("#ddlproductchild").val(), fk_product_fils: $(this).data('key'), qty: $(tr).find("input[name = txt_ItemQty]").val() }
            );
        }
    });
    console.log(_ItemProduct);
    var obj = {
        ProductChildMeta: _ItemProduct
    }

    if (_ItemProduct != '') {
        //  NOW CALL THE WEB METHOD WITH THE PARAMETERS USING AJAX.
        $.ajax({
            type: 'POST',
            url: '/Product/SaveChildvariations',
            data: JSON.stringify(obj),
            dataType: 'json',
            headers: { "Content-Type": "application/json" },
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (data) {
                if (data.status == true) {
                    var layoutHtml = '';
                    $('#order_line_items').empty().append(layoutHtml);
                    bindChildproductsservices();
                    swal('Alert!', data.message, 'success');
                }
            },
            complete: function () {
                $("#loader").hide();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // alert(errorThrown);
            }
        });
    }
    else { alert("Fields cannot be empty.") }
});

$("#btnservicessave").click(function (e) {
    let _ItemProductServices = [];
    $("#Product_services > tr").each(function (index, tr) {
        console.log(tr);
        //if (parseInt($(tr).find("input[name = txt_service]").val()) > 0) {
            
            _ItemProductServices.push(
                { fk_product: $("#ddlproductchild").val(), fk_product_fils: $(this).data('key'), qty: $(tr).find("input[name = txt_service]").val() }
            );
        //}
    });
    console.log(_ItemProductServices);
    var obj = {
        ProductChildMeta: _ItemProductServices
    }
    //var layoutHtml = '';
    //$('#Product_services').empty().append(layoutHtml);
    if (_ItemProductServices != '') {
          //NOW CALL THE WEB METHOD WITH THE PARAMETERS USING AJAX.
        $.ajax({
            type: 'POST',
            url: '/Product/UpdateChildvariations',
            data: JSON.stringify(obj),
            dataType: 'json',
            headers: { "Content-Type": "application/json" },
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (data) {
                if (data.status == true) {

                    //var layoutHtml = '';
                    //$('#Product_services').empty();
                   bindChildproductsservices();
                    swal('Alert!', data.message, 'success');
                }
            },
            complete: function () {
                $("#loader").hide();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // alert(errorThrown);
            }
        });
    }
    else { alert("Fields cannot be empty.") }
});


function GetDataByID(order_id) {
    order_id = $("#ddlproductchild").val();
    var ID = order_id;

    var obj = { strVal: order_id }
    $.ajax({

        url: '/Product/GetPurchaseDataByID/' + ID,
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var i = JSON.parse(data);
            console.log(i);
            $("#txtprosutname").text(i[0].post_title);
            $("#txtstockquantity").text(i[0].stock);

            $('#txtAllowbackorders').text(i[0].backorders);
            //  $('#txtShippingClass').text(i[0].shippingclass);
            if (i[0].taxclass == "" || i[0].taxclass == null)
                $('#txtTaxClass').text("standard");
            else
                $('#txtTaxClass').text(i[0].taxclass);


            $("#txtDimensions").text(i[0].length + '*' + i[0].width + '*' + i[0].height);

            //$('#txtVirtual').val(i[0].shippingclass); virchualValue
            if (i[0].managestock == "False")
                $('#txtManage').text("No");
            else
                $('#txtManage').text("Yes");

            if (i[0].virchualValue == "False")
                $('#txtVirtual').text("No");
            else
                $('#txtVirtual').text("Yes");

            $("#txtSku").text(i[0].sku);
            $("#txtRegularprice").text(i[0].regularamount);
            $("#txtsaleprice").text(i[0].saleprice);

            $("#txtRegularpricekit").text(i[0].regularamount);
            $("#txtsalepricekit").text(i[0].saleprice);

            if (i[0].axstatus == "" || i[0].taxclass == null)
                $('#ddltaxstatus').text("taxable").trigger('change');
            else
                $('#ddltaxstatus').text(i[0].axstatus).trigger('change');

        },
        error: function (msg) { alert(msg); }
    });

}

$("#ddlproductchild").change(function () {
    GetDataByID($("#ddlproductchild").val());
    bindChildproductsservices();
    bindparentproductsservices();
});



function dataGridLoad(order_type) {

    var keywordfilter = $('#txtkeewordfilter').val();
    let categoryfiler = $('#ddlCategoryfilter').val();

    var obj = { strValue1: keywordfilter, strValue2: categoryfiler };
    $.ajax({
        type: "POST", url: '/Product/GetProductInfo', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            // datav = JSON.stringify(data);

            //console.log(JSON.parse(data));
            var itemsDetailsxml = [];
            for (var i = 0; i < data.length; i++) {
                // let row_key = data[i].ID ;                        
                itemsDetailsxml.push({
                    PKey: data[i].ID, product_id: data[i].ID, product_name: data[i].product_name, product_label: data[i].product_label, quantity: data[i].Qty
                });

            }
            //Bind Product

            bindItemListDataTable(itemsDetailsxml);

        },
        complete: function () { $("#loader").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
        async: false

    });
}
function bindItemListDataTable(data) {
    console.log('g', data);
    var layoutHtml = '';
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].PKey > 0) {
                layoutHtml += '<tr id="tritemId_' + data[i].PKey + '" data-key="' + data[i].PKey + '">';
                layoutHtml += '<td class="text-left">' + data[i].product_label + '</td>';
                layoutHtml += '<td>' + data[i].product_name + '</td>';
                layoutHtml += '<td><input min="1"  autocomplete="off" type="number" id="txt_ItemQty_' + data[i].PKey + '" value="' + data[i].quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
                layoutHtml += '<td><input type="checkbox" style="opacity: 1; position: relative; visibility: visible; display: block" name="chkservices" id="chk_' + data[i].PKey + '"></td>';
                layoutHtml += '</tr>';
            }
        }
        $('#order_line_items').empty().append(layoutHtml);
    }
    else {
        layoutHtml += '<table id="dtdatachildkits" class="table-blue table table-bordered table-striped dataTable">';
        layoutHtml += '<thead>';
        layoutHtml += '<tr>';
        layoutHtml += '<th class="text-left">Child products</th>';
        layoutHtml += '<th>Label</th>';
        layoutHtml += '<th>Qty</th>';
        layoutHtml += '<th>Increase/Decrease stock on parent change</th>';

        layoutHtml += '</tr>';
        layoutHtml += '</thead><tbody id="order_line_items"></tbody>';

        layoutHtml += '</table>';
        $('#divAddItemFinal').empty().html(layoutHtml);
    }

}
function bindChildproductsservices() {
    let PostID = $('#ddlproductchild').val();

    var obj = { strValue1: PostID };
    $.ajax({
        type: "POST", url: '/Product/GetProductservices', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            // datav = JSON.stringify(data);

            //console.log(JSON.parse(data));
            var itemsDetailsxml = [];
            for (var i = 0; i < data.length; i++) {
                // let row_key = data[i].ID ;                        
                itemsDetailsxml.push({
                    PKey: data[i].ID, product_id: data[i].ID, product_name: data[i].product_name, product_label: data[i].product_label, quantity: data[i].qty, Stock: data[i].Stock, buyingprice: data[i].buyingprice, sellingpric: data[i].sellingpric
                });

            }
            binddata(itemsDetailsxml);

        },
        complete: function () { $("#loader").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
        async: false

    });
}

function binddata(data) {
    
    var layoutHtml = '';
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].PKey > 0) {
                layoutHtml += '<tr id="tritemId_' + data[i].PKey + '" data-key="' + data[i].PKey + '">';
                layoutHtml += '<td class="text-left">' + data[i].product_label + '</td>';
                layoutHtml += '<td>' + data[i].product_name + '</td>';
                layoutHtml += '<td>' + data[i].buyingprice + '</td>';
                layoutHtml += '<td>' + data[i].sellingpric + '</td>';
                layoutHtml += '<td>' + data[i].Stock + '</td>';
                layoutHtml += '<td><input min="1"  autocomplete="off" type="number" id="txt_service' + data[i].PKey + '" value="' + data[i].quantity + '" name="txt_service" placeholder="Qty"></td>';
                layoutHtml += '<td><input type="checkbox" style="opacity: 1; position: relative; visibility: visible; display: block" name="chkproductservices" id="chkservices_' + data[i].PKey + '" value="' + data[i].PKey + '"></td>';
                layoutHtml += '</tr>';
            }
        }
  
        $('#Product_services').empty().append(layoutHtml);

    }
    else {
        layoutHtml += '<table id="dtAddservices" class="table-blue table table-bordered table-striped dataTable">';
        layoutHtml += '<thead>';
        layoutHtml += '<tr>';
        layoutHtml += '<th class="text-left">Child products</th>';
        layoutHtml += '<th>Label</th>';
        layoutHtml += '<th>Minimum buying price</th>';
        layoutHtml += '<th>Minimum selling price</th>';
        layoutHtml += '<th>Stock</th>';
        layoutHtml += '<th style="width: 5%">Qty</th>';
        layoutHtml += '<th>Increase/Decrease stock on parent change</th>';

        layoutHtml += '</tr>';
        layoutHtml += '</thead><tbody id="Product_services"></tbody>';

        layoutHtml += '</table>';
        $('#divAddservices').empty().html(layoutHtml);
    }

}

function bindparentproductsservices() {
    let PostID = $('#ddlproductchild').val();

    var obj = { strValue1: PostID };
    $.ajax({
        type: "POST", url: '/Product/GetProductParent', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            var itemsDetailsxml = [];
            for (var i = 0; i < data.length; i++) {
                // let row_key = data[i].ID ;                      
                itemsDetailsxml.push({
                    PKey: data[i].ID, product_id: data[i].ID, product_name: data[i].product_name, product_label: data[i].product_label, quantity: data[i].qty
                });

            }
            bindParentdata(itemsDetailsxml);
        },
        complete: function () { $("#loader").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
        async: false

    });
}

function bindParentdata(data) {
    console.log('g', data);
    var layoutHtml = '';
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].PKey > 0) {
                layoutHtml += '<tr id="tritemId_' + data[i].PKey + '" data-key="' + data[i].PKey + '">';
                layoutHtml += '<td class="text-left">' + data[i].product_label + '</td>';
                layoutHtml += '<td>' + data[i].product_name + '</td>';
                layoutHtml += '<td>' + data[i].quantity + '</td>';
                layoutHtml += '</tr>';
            }
        }
        console.log(layoutHtml);
        $('#Product_Parent').empty().append(layoutHtml);

    }
    else {
        layoutHtml += '<table id="dtdatakits" class="table-blue table table-bordered table-striped dataTable">';
        layoutHtml += '<thead>';
        layoutHtml += '<tr>';
        layoutHtml += '<th class="text-left">Parent products</th>';
        layoutHtml += '<th>Label</th>';
        layoutHtml += '<th>Qty</th>';
        layoutHtml += '</tr>';
        layoutHtml += '</thead><tbody id="Product_Parent"></tbody>';
        layoutHtml += '</table>';
        $('#divParent').empty().html(layoutHtml);
    }

}

