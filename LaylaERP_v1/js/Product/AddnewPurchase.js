 $(document).ready(function () {
    $("#loader1").hide();
    var url = window.location.pathname;
     var id = url.substring(url.lastIndexOf('/') + 1);
     console.log(id);
    $('li:contains(Variations)').hide();


    $("#txtminpurchasequantity").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    });
    $("#txtSaletax").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    }); $("#txtcurrencyconversionrate").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    });
    $("#txtcostprice").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    });
        $("#txtshippingprice").keyup(function () {
            var $this = $(this);
            $this.val($this.val().replace(/[^\d.]/g, ''));
            $this.val($this.val().substring(0, 10));
        });

     $("#txtMisccosts").keyup(function () {
         var $this = $(this);
         $this.val($this.val().replace(/[^\d.]/g, ''));
         $this.val($this.val().substring(0, 10));
     });

        $("#txtDiscountqty").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    });

     if (id != "" && id != "AddNewPurchase" && id != "AddNewProduct") {

        // setTimeout(function () { GetDataPurchaseByID($("#ddlproductchild").val()); }, 13000);
        // setTimeout(function () { bindbuyingprice(); },14000);
        // //setTimeout(function () { bindChildproductsservices(); }, 12000);
        // //setTimeout(function () { bindparentproductsservices(); }, 13000);
        // //setTimeout(function () { bindChildproductsservices(); ComponentbindChildproductsservices(); }, 17000);
        // //setTimeout(function () { bindparentproductsservices(); bindcompnentparentproductsservices(); }, 18000);
        //setTimeout(function () { bindwarehouse(); }, 15000);

        // setTimeout(function () { bindfileuploade(); }, 16000);
        //setTimeout(function () { getNotesList($("#ddlproductchild").val()); }, 17000);
         //GetDataPurchaseByID($("#ddlproductchild").val()); 
         //bindbuyingprice(); 
         //bindChildproductsservices();
         //bindparentproductsservices();
         //bindwarehouse(); 
         //getNotesList($("#ddlproductchild").val()); 
         //bindfileuploade(); 


         $.get('/Product/GetProductVariantID/' + id, function (data) {
             var items = "";
             $.each(data, function (index, value) {
                 items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlproductchild");
             })
         });

         $('#dvbuysing').hide();
         $(document).on('click', "#btnbuying", function () {
             $('#dvbuysing').show();
             $("#hfbuyingid").val('');
             ClearControl();
         })

         $(document).on('click', "#btnbuyingcl", function () {
             $('#dvbuysing').hide();
             $("#hfbuyingid").val('');
             ClearControl();
         })

       
        // getParentCategory();
         //$.get('/Product/GetProductCategory/' + id, function (data) {
         //    var items = "";
         //    $('#ddlCategoryfilter').empty();
         //    items += "<option value=''>Please select</option>";
         //    $.each(data, function (index, value) {
         //        items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlCategoryfilter");
         //    })
         //    $('#ddlCategoryfilter').bind(items);
         //});


         $.get('/Product/GetVender/' + id, function (data) {
             var items = "";
             // $('#ddlvender').empty();
             // items += "<option value=''>Please select</option>";
             $.each(data, function (index, value) {
                 items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlvender");
             })
             //$('#ddlvender').bind(items);
         });


         $.get('/Product/GetVender/' + id, function (data) {
             var items = "";
             // $('#ddlvender').empty();
             // items += "<option value=''>Please select</option>";
             $.each(data, function (index, value) {
                 items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlvendercopy");
             })
             //$('#ddlvender').bind(items);
         });

         $.get('/Product/Getwarehouse/', function (data) {
             var items = "";
             //  $('#ddlwarehouse').empty();
             // items = "<option value=''>Please select</option>";
             $.each(data, function (index, value) {
                 items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlwarehouse");
             })
             // $('#ddlwarehouse').bind(items);
         });

         $("#filtersrchexp").click(function (e) {
             dataGridLoad($("#ddlproductchild").val());
         });
         $("#componentfiltersrchexp").click(function (e) {
             componentdataGridLoad($("#ddlproductchild").val());
         });

     }

     $("#txtcurrencyconversionrate").change(function () {
         addshippingprice();
     });
     $("#txtshippingprice").change(function () {
         addshippingprice();
     });

     $("#txtMisccosts").change(function () {
         addshippingprice();
     });
     $("#txtSaletax").change(function () {
         addshippingprice();
     });
     $('#lblcopyto').hide();
     $('#ddlvendercopy').hide();
     $('#btncopybuying').hide();
});
function space(noOfSpaces) {
    var space = "# ", returnValue = "";
    for (var index = 0; index < noOfSpaces; index++) {
        returnValue += space;
    }
    return returnValue;
}
function getParentCategory(id) {
    var obj = { strValue1: id };
    $.ajax({
        url: "/Product/GetParentCategory/" + id,
        type: "Get",
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            var opt = '<option value="0">Please select category</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].ID + '">' + space(data[i].level) + data[i].name + '</option>';
            }
            $('#ddlCategoryfilter').html(opt);
            $('#ddlcomponentCategoryfilter').html(opt);
        }
    });
}


$(document).on("click", "#btnRefresh", function (t) {    
    $('#ddlproductchild').trigger('change'); 
});
$(document).on("click", "#btnAddnote", function (t) {
    t.preventDefault(); AddNotes();
});
$("#btnaddupdatechild").click(function (e) {
    let _ItemProduct = [];
    $("#order_line_items > tr").each(function (index, tr) {
       // console.log(tr);
        if (parseInt($(tr).find("input[name = txt_ItemQty]").val()) > 0) {
            _ItemProduct.push(
                { fk_product: $("#ddlproductchild").val(), fk_product_fils: $(this).data('key'), qty: $(tr).find("input[name = txt_ItemQty]").val() }
            );
        }
    });
    var url = window.location.pathname;
    var urlid = url.substring(url.lastIndexOf('/') + 1);
   // console.log(_ItemProduct);
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
                $("#loader1").show();
            },
            success: function (data) {
                if (data.status == true) {
                    var layoutHtml = '';
                    $('#order_line_items').empty().append(layoutHtml);
                    bindChildproductsservices();
                    swal('Success!', data.message, 'success');
                    ActivityLog('Add/Update product to add product/services of this kits for product id (' + urlid + ')', '/Product/AddNewProduct/' + urlid + '');
                }
            },
            complete: function () {
                $("#loader1").hide();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // alert(errorThrown);
            }
        });
    }
    else { alert("Fields cannot be empty.") }
});

$("#btncomponentaddupdatechild").click(function (e) {
    let _ItemProduct = [];
    //$("#ordercomponent_line_items > tr").each(function (index, tr) {
        var ID = "";
        $("input:checkbox[name=chkcmtservices]:checked").each(function () {
            ID += $(this).val() ;

            console.log(ID);
       
        //console.log($(tr).find("input[name = chkcmtservices]").val());
       // if (parseInt($(tr).find("input[name = chkcmtservices]").val()) > 0) {
            _ItemProduct.push(
                { fk_product: $("#ddlproductchild").val(), fk_product_fils: ID, qty: 1 }
            );
            ID = "";
            //}
        });
   // });
    var url = window.location.pathname;
    var urlid = url.substring(url.lastIndexOf('/') + 1);
    // console.log(_ItemProduct);
    var obj = {
        ProductChildMeta: _ItemProduct
    }
    console.log(_ItemProduct);
    if (_ItemProduct != '') {

        //  NOW CALL THE WEB METHOD WITH THE PARAMETERS USING AJAX.
        $.ajax({
            type: 'POST',
            url: '/Product/SaveComponentChildvariations',
            data: JSON.stringify(obj),
            dataType: 'json',
            headers: { "Content-Type": "application/json" },
            beforeSend: function () {
                $("#loader1").show();
            },
            success: function (data) {
                if (data.status == true) {
                    var layoutHtml = '';
                    $('#ordercomponent_line_items').empty().append(layoutHtml);
                    ComponentbindChildproductsservices();
                    swal('Success!', data.message, 'success');
                    ActivityLog('Add/Update product to add product/services of this component for product id (' + urlid + ')', '/Product/AddNewProduct/' + urlid + '');
                }
            },
            complete: function () {
                $("#loader1").hide();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // alert(errorThrown);
            }
        });
    }
    else { alert("Child products should be selected.") }
});

$("#btnservicessave").click(function (e) {
    var url = window.location.pathname;
    var urlid = url.substring(url.lastIndexOf('/') + 1);
    let _ItemProductServices = [];
    $("#Product_services > tr").each(function (index, tr) {
      //  console.log(tr);
        //if (parseInt($(tr).find("input[name = ddlproducttype]").val()) > 0) {
            
            _ItemProductServices.push(
                { fk_product: $("#ddlproductchild").val(), fk_product_fils: $(this).data('key'), qty: $(tr).find("input[name = txt_service]").val() }
            );
        //}
    });
   // console.log(_ItemProductServices);
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
                $("#loader1").show();
            },
            success: function (data) {
                if (data.status == true) {

                    //var layoutHtml = '';
                    //$('#Product_services').empty();
                   bindChildproductsservices();
                    swal('Success!', data.message, 'success');
                    ActivityLog('Update list of products/services that are component(s) of this kit for product id (' + urlid + ')', '/Product/AddNewProduct/' + urlid + '');
                }
            },
            complete: function () {
                $("#loader1").hide();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // alert(errorThrown);
            }
        });
    }
    else { alert("Fields cannot be empty.") }
});

$("#btncomponentservicessave").click(function (e) {
    var url = window.location.pathname;
    var urlid = url.substring(url.lastIndexOf('/') + 1);
    let _ItemProductServices = [];
    $("#Productcomponent_services > tr").each(function (index, tr) {
        //  console.log(tr);
        //if (parseInt($(tr).find("input[name = txt_service]").val()) > 0) {

        _ItemProductServices.push(
            { fk_product: $("#ddlproductchild").val(), fk_product_fils: $(this).data('key'), qty: $(tr).find("input[name = txt_compservice]").val() }
        );
        //}
    });
    // console.log(_ItemProductServices);
    var obj = {
        ProductChildMeta: _ItemProductServices
    }
    //var layoutHtml = '';
    //$('#Product_services').empty().append(layoutHtml);
    if (_ItemProductServices != '') {

        //NOW CALL THE WEB METHOD WITH THE PARAMETERS USING AJAX.
        $.ajax({
            type: 'POST',
            url: '/Product/UpdateComponentChildvariations',
            data: JSON.stringify(obj),
            dataType: 'json',
            headers: { "Content-Type": "application/json" },
            beforeSend: function () {
                $("#loader1").show();
            },
            success: function (data) {
                if (data.status == true) { 
                    //var layoutHtml = '';
                    //$('#Product_services').empty(); 
                    ComponentbindChildproductsservices();
                    swal('Success!', data.message, 'success');
                    ActivityLog('Update list of products/services that are component(s) of this kit for product id (' + urlid + ')', '/Product/UpdateComponentChildvariations/' + urlid + '');
                }
            },
            complete: function () {
                $("#loader1").hide();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // alert(errorThrown);
            }
        });
    }
    else { alert("Fields cannot be empty.") }
});


function GetDataPurchaseByID(order_id) {
  
    //order_id = $("#ddlproductchild").val();
    var ID = order_id;

    var obj = { strVal: order_id }
    $.ajax({

        url: '/Product/GetPurchaseDetailsDataByID/' + ID,
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var i = JSON.parse(data);
            console.log(i);
           /* $("#txtprosutname").text(i[0].post_title);*/
           // $("#txtstockquantity").text(i[0].stock);

           // $('#txtAllowbackorders').text(i[0].backorders);
            //  $('#txtShippingClass').text(i[0].shippingclass);
            //if (i[0].taxclass == "" || i[0].taxclass == null)
            //    $('#txtTaxClass').text("standard");
            //else
            //    $('#txtTaxClass').text(i[0].taxclass);


            //$("#txtDimensions").text(i[0].length + '*' + i[0].width + '*' + i[0].height);

            //$('#txtVirtual').val(i[0].shippingclass); virchualValue
            //if (i[0].managestock == "False")
            //    $('#txtManage').text("No");
            //else
            //    $('#txtManage').text("Yes");

            //if (i[0].virchualValue == "False")
            //    $('#txtVirtual').text("No");
            //else
            //    $('#txtVirtual').text("Yes");

            //$("#txtSku").text(i[0].sku);
            $("#txtvendersku").val(i[0].sku);            
            //$("#txtRegularprice").text(i[0].regularamount);
            //$("#txtsaleprice").text(i[0].saleprice); null

            if (i[0].regularamount == null)
                $("#txtRegularpricekit").text('$0.00');
            else
                $("#txtRegularpricekit").text('$' + i[0].regularamount);

            if (i[0].saleprice == null)
                $("#txtsalepricekit").text('$0.00');
            else
                $("#txtsalepricekit").text('$' + i[0].saleprice);

            if ($("#txtsalepricekit").text() == "$0.00") {
                $("#lblRegularPrice").hide();
                $('lblRegularPrice').css('display', 'none');
                $("#txtRegularpricekit").hide();
                $("#txtsalepricekit").text('$' + i[0].regularamount);
            }


            if (i[0].cost_price == null)
                $("#txtCostprice").text('$0.00');
            else
                $("#txtCostprice").text('$' + i[0].cost_price);

           

            if (i[0].purchase_price == null)
                $("#txtbestbying").text('$0.00');
            else
                $("#txtbestbying").text('$' + i[0].purchase_price);
            $("#txtnumattached").text(i[0].filecount);            
            $("#txtVendor").text(i[0].vname);
            $("#txtPrivate").val(i[0].Private_Notes);
            $("#txtPublic").val(i[0].Public_Notes);
         

        },
        error: function (msg) { alert(msg); },
        async: false
    });

}

$("#ddlproductchild").change(function (t) {
    t.preventDefault();
    $("#loader1").show();
    GetDataPurchaseByID($("#ddlproductchild").val());
    bindbuyingprice();
    bindChildproductsservices();
    bindparentproductsservices();
    bindwarehouse();
    getNotesList($("#ddlproductchild").val());
    bindfileuploade();
    bindcompnentparentproductsservices();
    ComponentbindChildproductsservices();
    ClearControl();
    $('#dvbuysing').hide();
    $("#hfbuyingid").val('');
    $("#loader1").hide();
});



function dataGridLoad(order_type) {

    var keywordfilter = $('#txtkeewordfilter').val();
    let categoryfiler = $('#ddlCategoryfilter').val();

    var obj = { strValue1: keywordfilter, strValue2: categoryfiler };
    $.ajax({
        type: "POST", url: '/Product/GetProductInfo', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        beforeSend: function () { $("#loader1").show(); },
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
        complete: function () { $("#loader1").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader1").hide(); swal('Alert!', errorThrown, "error"); },
        async: false

    });
}

function componentdataGridLoad(order_type) {

    var keywordfilter = $('#txtcomponentkeewordfilter').val();
    let categoryfiler = $('#ddlcomponentCategoryfilter').val();

    var obj = { strValue1: keywordfilter, strValue2: categoryfiler };
    $.ajax({
        type: "POST", url: '/Product/GetProductInfo', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        beforeSend: function () { $("#loader1").show(); },
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

            componentbindItemListDataTable(itemsDetailsxml);

        },
        complete: function () { $("#loader1").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader1").hide(); swal('Alert!', errorThrown, "error"); },
        async: false

    });
}

function bindItemListDataTable(data) {
   // console.log('g', data);
    var layoutHtml = '';
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].PKey > 0) {
                layoutHtml += '<tr id="tritemId_' + data[i].PKey + '" data-key="' + data[i].PKey + '">';
                layoutHtml += '<td class="text-left">' + data[i].product_label + '</td>';
                layoutHtml += '<td>' + data[i].product_name + '</td>';
                layoutHtml += '<td><input min="1"  autocomplete="off" type="number" id="txt_ItemQty_' + data[i].PKey + '" value="' + data[i].quantity + '" name="txt_ItemQty" placeholder="Qty"></td>';
                /*layoutHtml += '<td><input type="checkbox" style="opacity: 1; position: relative; visibility: visible; display: block" name="chkservices" id="chk_' + data[i].PKey + '"></td>';*/
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
       /* layoutHtml += '<th>Increase/Decrease stock on parent change</th>';*/

        layoutHtml += '</tr>';
        layoutHtml += '</thead><tbody id="order_line_items"></tbody>';

        layoutHtml += '</table>';
        $('#divAddItemFinal').empty().html(layoutHtml);
    }

}

function componentbindItemListDataTable(data) {
    // console.log('g', data);
    var layoutHtml = '';
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].PKey > 0) {
                layoutHtml += '<tr id="tritemId_' + data[i].PKey + '" data-key="' + data[i].PKey + '">';
                layoutHtml += '<td class="text-left">' + data[i].product_label + '</td>';
                layoutHtml += '<td>' + data[i].product_name + '</td>';
                //layoutHtml += '<td><input min="1" readonly autocomplete="off" type="number" id="txt_CmtItemQty_' + data[i].PKey + '" value="' + 1 + '" name="txt_CmtItemQty" placeholder="Qty"></td>';
                layoutHtml += '<td><input type="checkbox" style="opacity: 1; position: relative; visibility: visible;" value="' + data[i].PKey + '" name="chkcmtservices" id="chk_' + data[i].PKey + '"></td>';
                //layoutHtml += '<td><input style="opacity:1" name="chkcmtservices"  type="checkbox" style="opacity: 1; position: relative; visibility: visible;"  value="' + data[i].PKey + '" id="chkcmtservices_' + data[i].PKey + '"></td>';

                layoutHtml += '</tr>';
            }
        }
        $('#ordercomponent_line_items').empty().append(layoutHtml);
    }
    else {
        layoutHtml += '<table id="dtcomponentdatachildkits" class="table-blue table table-bordered table-striped dataTable">';
        layoutHtml += '<thead>';
        layoutHtml += '<tr>';
        layoutHtml += '<th class="text-left">Child products</th>';
        layoutHtml += '<th>Label</th>';
       // layoutHtml += '<th>Qty</th>';
        layoutHtml += '<th>Add</th>';

        layoutHtml += '</tr>';
        layoutHtml += '</thead><tbody id="ordercomponent_line_items"></tbody>';

        layoutHtml += '</table>';
        $('#divcomponentAddItemFinal').empty().html(layoutHtml);
    }

}
function bindChildproductsservices() {
    let PostID = $('#ddlproductchild').val();

    var obj = { strValue1: PostID };
    $.ajax({
        type: "POST", url: '/Product/GetProductservices', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        beforeSend: function () { $("#loader1").show(); },
        success: function (data) {
            // datav = JSON.stringify(data);

            //console.log(JSON.parse(data));
            var itemsDetailsxml = [];
            for (var i = 0; i < data.length; i++) {
                // let row_key = data[i].ID ;                        
                itemsDetailsxml.push({
                    PKey: data[i].ID, product_id: data[i].ID, product_name: data[i].product_name, product_label: data[i].product_label, quantity: data[i].qty, Stock: data[i].Stock, buyingprice: data[i].buyingprice, sellingpric: data[i].sellingpric, product_type_name: data[i].product_type_name, status: data[i].status
                });

            }
            binddata(itemsDetailsxml);

        },
        complete: function () { $("#loader1").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader1").hide(); swal('Alert!', errorThrown, "error"); },
        async: false

    });
}


function ComponentbindChildproductsservices() {
    let PostID = $('#ddlproductchild').val();

    var obj = { strValue1: PostID };
    $.ajax({
        type: "POST", url: '/Product/GetComponentProductservices', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        beforeSend: function () { $("#loader1").show(); },
        success: function (data) {
            // datav = JSON.stringify(data);

            //console.log(JSON.parse(data));
            var itemsDetailsxml = [];
            for (var i = 0; i < data.length; i++) {
                // let row_key = data[i].ID ;                        
                itemsDetailsxml.push({
                    PKey: data[i].ID, product_id: data[i].ID, product_name: data[i].product_name, product_label: data[i].product_label, quantity: data[i].qty, Stock: data[i].Stock, buyingprice: data[i].buyingprice, sellingpric: data[i].sellingpric, status: data[i].status
                });

            }
            Componentbinddata(itemsDetailsxml);

        },
        complete: function () { $("#loader1").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader1").hide(); swal('Alert!', errorThrown, "error"); },
        async: false

    });
}

function Componentbinddata(data) {

    var layoutHtml = '';
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].PKey > 0) {
                layoutHtml += '<tr id="tritemId_' + data[i].PKey + '" data-key="' + data[i].PKey + '">';
                layoutHtml += '<td class="text-left">' + data[i].product_label + '</td>';
                layoutHtml += '<td>' + data[i].product_name + '</td>';
                layoutHtml += '<td>' + '$' + data[i].buyingprice + '</td>';
                layoutHtml += '<td>' + '$' + data[i].sellingpric + '</td>';
                layoutHtml += '<td>' + data[i].Stock + '</td>';
                layoutHtml += '<td><input min="0"  autocomplete="off" type="number" id="txt_compservice' + data[i].PKey + '" value="' + data[i].quantity + '" name="txt_compservice" placeholder="Qty"></td>';
                if (data[i].status == 0) {
                    toggleclass = "fas fa-toggle-on";
                    toggleStyle = "color: #ff0000!important;font-size: 24px;";
                    toggleStatus = 1;
                }

                else {
                    toggleclass = "fas fa-toggle-off";
                    toggleStyle = "color: #49be25!important;font-size: 24px;";
                    toggleStatus = 0;
                }
                console.log(toggleStatus);
                layoutHtml += '<td> <span title="Click here to change the status." data-placement="bottom" data-toggle="tooltip"> <a href="#" onclick="ChangeStatus(' + data[i].PKey + ',' + toggleStatus + ');"><i class="' + toggleclass + '" style="' + toggleStyle + '"></i></a></span> </td>';
                //  layoutHtml += '<td><input type="checkbox" style="opacity: 1; position: relative; visibility: visible; display: block" name="chkproductservices" id="chkservices_' + data[i].PKey + '" value="' + data[i].PKey + '"></td>';
                layoutHtml += '</tr>';
            }
        }

        $('#Productcomponent_services').empty().append(layoutHtml);

    }
    else {
        layoutHtml += '<table id="dtAddcomponentservices" class="table-blue table table-bordered table-striped dataTable">';
        layoutHtml += '<thead>';
        layoutHtml += '<tr>';
        layoutHtml += '<th class="text-left">Child products</th>';
        layoutHtml += '<th>Label</th>';
        layoutHtml += '<th>Buying price</th>';
        layoutHtml += '<th>Selling price</th>';
        layoutHtml += '<th>Stock</th>';
     layoutHtml += '<th>Qty</th>';
        layoutHtml += '<th>Status</th>';

        layoutHtml += '</tr>';
        layoutHtml += '</thead><tbody id="Productcomponent_services"></tbody>';

        layoutHtml += '</table>';
        $('#divAddcomponentservices').empty().html(layoutHtml);
    }

}

function binddata(data) {
   // let _producttype = Getproducttype();
    var layoutHtml = '';
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].PKey > 0) {
                layoutHtml += '<tr id="tritemId_' + data[i].PKey + '" data-key="' + data[i].PKey + '">';
                layoutHtml += '<td class="text-left">' + data[i].product_label + '</td>';
                layoutHtml += '<td>' + data[i].product_name + '</td>';
                layoutHtml += '<td>' + '$' + data[i].buyingprice + '</td>';
                layoutHtml += '<td>' + '$'+ data[i].sellingpric + '</td>';
                layoutHtml += '<td>' + data[i].Stock + '</td>';

                layoutHtml += '<td>' + data[i].product_type_name + '</td>';

                //layoutHtml += '<td><select id="ddlproducttype_' + data[i].PKey + '"   name="ddlproducttype" class="ddlproducttype form-control  select2"><option value="0">Select Product Type</option>';
                //for (var j = 0; j < _producttype.length; j++) {
                //    if (data[i].product_type_id == _producttype[j].rowid)
                //        layoutHtml += '<option value="' + _producttype[j].rowid + '" selected> ' + _producttype[j].name + '</option>';
                //    else
                //        layoutHtml += '<option value="' + _producttype[j].rowid + '"> ' + _producttype[j].name + '</option>';
                //};
                layoutHtml += '</select ></td>';
                layoutHtml += '<td><input min="0"  autocomplete="off" type="number" id="txt_service' + data[i].PKey + '" value="' + data[i].quantity + '" name="txt_service" placeholder="Qty"></td>';
               // layoutHtml += '<td><input type="checkbox" style="opacity: 1; position: relative; visibility: visible; display: block" name="chkproductservices" id="chkservices_' + data[i].PKey + '" value="' + data[i].PKey + '"></td>';
                if (data[i].status == 0) {
                    toggleclass = "fas fa-toggle-on";
                    toggleStyle = "color: #ff0000!important;font-size: 24px;";
                    toggleStatus = 1;
                }

                else {
                    toggleclass = "fas fa-toggle-off";
                    toggleStyle = "color: #49be25!important;font-size: 24px;";
                    toggleStatus = 0;
                }
                console.log(toggleStatus);
                layoutHtml += '<td> <span title="Click here to change the status." data-placement="bottom" data-toggle="tooltip"> <a href="#" onclick="ChangeStatus(' + data[i].PKey + ',' + toggleStatus + ');"><i class="' + toggleclass + '" style="' + toggleStyle + '"></i></a></span> </td>';
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
        layoutHtml += '<th>Buying price</th>';
        layoutHtml += '<th>Selling price</th>';
        layoutHtml += '<th>Stock</th>';
        layoutHtml += '<th>Product Type</th>';
        layoutHtml += '<th>Qty</th>';
        layoutHtml += '<th>Status</th>';

        layoutHtml += '</tr>';
        layoutHtml += '</thead><tbody id="Product_services"></tbody>';

        layoutHtml += '</table>';
        $('#divAddservices').empty().html(layoutHtml);
    }

}

function Getproducttype() {
    let _producttype = [];
    $.ajax({
        type: "get", url: '/Product/Getproducttype', contentType: "application/json; charset=utf-8", dataType: "json", data: {},
        success: function (data) {
            data = JSON.parse(data); _producttype = data;
            //console.log(data, _shipping_class);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { }, async: false
    });
    return _producttype;
}

function bindparentproductsservices() {
    let PostID = $('#ddlproductchild').val();

    var obj = { strValue1: PostID };
    $.ajax({
        type: "POST", url: '/Product/GetProductParent', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        beforeSend: function () { $("#loader1").show(); },
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
        complete: function () { $("#loader1").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader1").hide(); swal('Alert!', errorThrown, "error"); },
        async: false

    });
}

function bindParentdata(data) {
   // console.log('g', data);
    var layoutHtml = '';
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].PKey > 0) {
                layoutHtml += '<tr id="tritemId_' + data[i].PKey + '" data-key="' + data[i].PKey + '">';
                layoutHtml += '<td class="text-left"><a href="../../Product/AddNewProduct/' + data[i].PKey + '">' + data[i].product_label + '</i></a ></td>';
                layoutHtml += '<td>' + data[i].product_name + '</td>';
                layoutHtml += '<td>' + data[i].quantity + '</td>';
                layoutHtml += '</tr>';
            }
        }
       // console.log(layoutHtml);
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

function bindcompnentparentproductsservices() {
    let PostID = $('#ddlproductchild').val();

    var obj = { strValue1: PostID };
    $.ajax({
        type: "POST", url: '/Product/GetComponentProductParent', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        beforeSend: function () { $("#loader1").show(); },
        success: function (data) {
            var itemsDetailsxml = [];
            for (var i = 0; i < data.length; i++) {
                // let row_key = data[i].ID ;                      
                itemsDetailsxml.push({
                    PKey: data[i].ID, product_id: data[i].ID, product_name: data[i].product_name, product_label: data[i].product_label, quantity: data[i].qty
                });

            }
            bindComponentParentdata(itemsDetailsxml);
        },
        complete: function () { $("#loader1").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader1").hide(); swal('Alert!', errorThrown, "error"); },
        async: false

    });
}

function bindComponentParentdata(data) {
    // console.log('g', data);
    var layoutHtml = '';
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].PKey > 0) {
                layoutHtml += '<tr id="tritemId_' + data[i].PKey + '" data-key="' + data[i].PKey + '">';
                /*layoutHtml += '<td class="text-left"><a href="../../Product/AddNewProduct/' + data[i].PKey + '">' + data[i].product_label + '</i></a ></td>';*/
                layoutHtml += '<td>' + data[i].product_label + '</td>';
                layoutHtml += '<td>' + data[i].product_name + '</td>';
                layoutHtml += '<td>' + data[i].quantity + '</td>';
                layoutHtml += '</tr>';
            }
        }
        // console.log(layoutHtml);
        $('#Productcomponent_Parent').empty().append(layoutHtml);

    }
    else {
        layoutHtml += '<table id="dtcomponentdatakits" class="table-blue table table-bordered table-striped dataTable">';
        layoutHtml += '<thead>';
        layoutHtml += '<tr>';
        layoutHtml += '<th class="text-left">Parent products</th>';
        layoutHtml += '<th>Label</th>';
        layoutHtml += '<th>Qty</th>';
        layoutHtml += '</tr>';
        layoutHtml += '</thead><tbody id="Productcomponent_Parent"></tbody>';
        layoutHtml += '</table>';
        $('#divcomponentParent').empty().html(layoutHtml);
    }

}

$(document).on('click', "#btnbuyingsave", function () {
    AddBuyingt();
})
$(document).on('click', "#btncopybuying", function () {
    btncopybuying();
})
function AddBuyingt() {
   
    ID = $("#hfbuyingid").val();
    fk_productval = $('#ddlproductchild').val();
    vender = $("#ddlvender").val();
    minpurchasequantity = $("#txtminpurchasequantity").val();
    tagno = $("#txttaglotno").val();
    costprice = $("#txtcostprice").val();
    shippingprice = $("#txtshippingprice").val();
    Misccosts = $("#txtMisccosts").val();
    Saletax = $("#txtSaletax").val();
    currency = $("#txtcurrencyconversionrate").val();
    taxrate = $("#ddltaxrate").val();
    Discountqty = $("#txtDiscountqty").val();
    Remark = $("#txtRemarks").val();   

    if (vender == "") {
        swal('Alert', 'Please enter vendor', 'error').then(function () { swal.close(); $('#ddlvender').focus(); });
    }
    else if (currency == "") {
        swal('Alert', 'Please enter price', 'error').then(function () { swal.close(); $('#txtcurrencyconversionrate').focus(); });
    }
    else if (parseFloat(currency) <= 0.00) {
        swal('Alert', 'Price can not be zero', 'error').then(function () { swal.close(); $('#txtcurrencyconversionrate').focus(); });
    }
    else if (parseInt(minpurchasequantity) <= 0) {
        swal('Alert', 'Min. purchase quantity can not be zero', 'error').then(function () { swal.close(); $('#txtminpurchasequantity').focus(); });
    }
    else {
        var obj = {
            ID: ID,
            fk_product: fk_productval,
            fk_vendor: vender,
            minpurchasequantity: minpurchasequantity,
            taglotserialno: tagno,
            cost_price: costprice,
            shipping_price: shippingprice,
            Misc_Costs: Misccosts,
            salestax: Saletax,
            purchase_price: currency,
            taxrate: taxrate,
            discount: Discountqty,
            remark: Remark,
            
        }
        $.ajax({
            url: '/Product/BuyingPrice/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () {
                $("#loader1").show();
            },
            success: function (data) {
                if (data.status == true) {
                    if (data.url == "Manage") {
                        bindbuyingprice();
                        bindwarehouse();
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


function ChangeStatus(id, status) {
    console.log(id, status);
    let PostID = $('#ddlproductchild').val();
  //  let cofStatus = status == "0" ? "Inactive" : "Active";
    ActivityLog('change status as ' + status + '', '/Product/UpdatecomponentStatus/' + id + '');
    var obj = { rowid: id, active: status, code: PostID  }
    $.ajax({
        url: '/Product/UpdatecomponentStatus/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            if (data.status == true) {

             //   ComponentbindChildproductsservices();
                bindChildproductsservices();
                swal('Success', data.message, 'success');
            }
            else { swal('Alert!', data.message, 'error') }
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}

function btncopybuying() {
    debugger
    oldvender = $("#ddlvender").val();
    ID = "0";
    fk_productval = $('#ddlproductchild').val();
    vender = $("#ddlvendercopy").val();
    minpurchasequantity = $("#txtminpurchasequantity").val();
    tagno = $("#txttaglotno").val();
    costprice = $("#txtcostprice").val();
    shippingprice = $("#txtshippingprice").val();
    Misccosts = $("#txtMisccosts").val();
    Saletax = $("#txtSaletax").val();
    currency = $("#txtcurrencyconversionrate").val();
    taxrate = $("#ddltaxrate").val();
    Discountqty = $("#txtDiscountqty").val();
    Remark = $("#txtRemarks").val();

    if (vender == "") {
        swal('Alert', 'Please enter vendor', 'error').then(function () { swal.close(); $('#ddlvender').focus(); });
    }
    else if (currency == "") {
        swal('Alert', 'Please enter price', 'error').then(function () { swal.close(); $('#txtcurrencyconversionrate').focus(); });
    }
    else if (oldvender == vender) {
        swal('Alert', 'Can not coppy with same vendor', 'error').then(function () { swal.close(); $('#ddlvendercopy').focus(); });
    }
    else {
        var obj = {
            ID: ID,
            fk_product: fk_productval,
            fk_vendor: vender,
            minpurchasequantity: minpurchasequantity,
            taglotserialno: tagno,
            cost_price: costprice,
            shipping_price: shippingprice,
            Misc_Costs: Misccosts,
            salestax: Saletax,
            purchase_price: currency,
            taxrate: taxrate,
            discount: Discountqty,
            remark: Remark,

        }
        $.ajax({
            url: '/Product/BuyingPrice/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () {
                $("#loader1").show();
            },
            success: function (data) {
                if (data.status == true) {
                    if (data.url == "Manage") {
                        bindbuyingprice();
                        swal('Success!', 'vendor details copied', 'success');
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


function bindbuyingprice() {
    let PostID = $('#ddlproductchild').val();

    var obj = { strValue1: PostID };
    $.ajax({
        type: "POST", url: '/Product/GetBuyingdata', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        beforeSend: function () { $("#loader1").show(); },
        success: function (data) {
            //console.log('g', data);
            var itemsDetailsxml = [];
            for (var i = 0; i < data.length; i++) {
                // let row_key = data[i].ID ;                      
                itemsDetailsxml.push({
                    PKey: data[i].ID, product_id: data[i].ID, product_name: data[i].name, salestax: data[i].salestax, purchase_price: data[i].purchase_price, cost_price: data[i].cost_price, date_inc: data[i].date_inc, discount: data[i].discount, minpurchasequantity: data[i].minpurchasequantity, taglotserialno: data[i].taglotserialno, shipping_price: data[i].shipping_price, Misc_Costs: data[i].Misc_Costs, StatusActive: data[i].Status, is_setprise: data[i].is_setprise, date_to: data[i].date_to, fk_vendor: data[i].fk_vendor, fk_product: data[i].fk_product
                });

            }
            bindbuying(itemsDetailsxml);
        },
        complete: function () { $("#loader1").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader1").hide(); swal('Alert!', errorThrown, "error"); },
        async: false

    });
}

function bindbuying(data) {
   // console.log(data);
    var layoutHtml = '';
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].PKey > 0) {
                layoutHtml += '<tr id="tritemId_' + data[i].PKey + '" data-key="' + data[i].PKey + '">';
                if (data[i].is_setprise == "1")
                layoutHtml += '<td><input style="opacity:1" name="CheckSingle"  type="checkbox" checked="true" class="chkprise" value="' + data[i].PKey + '" id="chkprise_' + data[i].PKey + '"></td>';
                else
                    layoutHtml += '<td><input style="opacity:1" name="CheckSingle"  type="checkbox"   class="chkprise" value="' + data[i].PKey + '" id="chkprise_' + data[i].PKey + '"></td>';
                layoutHtml += '<td class="text-left">' + data[i].product_name + '</td>';
                layoutHtml += '<td>' + data[i].taglotserialno + '</td>';
                layoutHtml += '<td>' + data[i].minpurchasequantity + '</td>';
                layoutHtml += '<td>' + '$' + data[i].purchase_price + '</td>';
                layoutHtml += '<td>' + '$'+ data[i].salestax + '</td>';             
                layoutHtml += '<td>' + '$' + data[i].shipping_price + '</td>';
                layoutHtml += '<td>' + '$' + data[i].Misc_Costs + '</td>';
                layoutHtml += '<td>' + '$' + data[i].cost_price + '</td>';
                layoutHtml += '<td>' + data[i].discount + '%' + '</td>';
                layoutHtml += '<td>' + data[i].date_inc + '</td>';
                layoutHtml += '<td>' + data[i].date_to + '</td>';
                layoutHtml += '<td>' + data[i].StatusActive + '</td>';
                layoutHtml += '<td><a href="javascript:void(0);" title="Click here to edit" data-toggle="tooltip" class="editbutton" onClick="EditUser(' + data[i].PKey + '); ActivityLog(\'Edit Vendor prices\',\'/Product/AddNewProduct Vendor ' + data[i].PKey +'\');"><i class="glyphicon glyphicon-pencil"></i></a></td>';
                if (data[i].StatusActive == "InActive")
                    layoutHtml += '<td><a href="javascript:void(0);" title="Click here to Active" data-toggle="tooltip" class="editbutton" onClick="ActiveUser(' + data[i].PKey + '); ActivityLog(\'active Vendor prices\',\'/Product/AddNewProduct Vendor ' + data[i].PKey +'\');"><i class="glyphicon glyphicon-eye-open"></i></a></td>';
                else
                    layoutHtml += '<td><a href="javascript:void(0);" title="Click here In-Active" data-toggle="tooltip" class="editbutton" onClick="DeleteUser(' + data[i].PKey + '); ActivityLog(\'delete Vendor prices\',\'/Product/AddNewProduct Vendor ' + data[i].PKey +'\');"><i class="glyphicon glyphicon-trash"></i></a></td>';

                layoutHtml += '<td><a href="javascript:void(0);" title="Click here view details" data-toggle="tooltip" class="editbutton" href="#" onclick="getpricedetails(' + data[i].fk_product + ',' + data[i].fk_vendor +'); "><i class="fas fa-search-plus"></i></a></td>';

                layoutHtml += '</tr>';
            }
        }
        //console.log(layoutHtml);
        $('#Vendor_services').empty().append(layoutHtml);

    }
    else {
        layoutHtml += '<table id="dtdataVendor" class="table-blue table table-bordered table-striped dataTable">';
        layoutHtml += '<thead>';
        layoutHtml += '<tr>';
        layoutHtml += '<th>#</th>';
        layoutHtml += '<th>Vendors</th>';
        layoutHtml += '<th>Tag/Lot/Serial No.</th>';
        layoutHtml += '<th>Purchase quantity</th>';
        layoutHtml += '<th>Price</th>';
        layoutHtml += '<th>Sales Tax</th>';  
        layoutHtml += '<th>Shipping Price</th>';
        layoutHtml += '<th>Misc. Price</th>';
        layoutHtml += '<th>Discount</th>';
        layoutHtml += '<th>Cost Price</th>'; 
        layoutHtml += '<th>Date From</th>';
        layoutHtml += '<th>Date To</th>';
        layoutHtml += '<th>Status</th>';
        layoutHtml += '<th>Action</th>';
        layoutHtml += '<th>Delete</th>';
        layoutHtml += '<th>View All Price</th>';
        layoutHtml += '</tr>';
        layoutHtml += '</thead><tbody id="Vendor_services"></tbody>';
        layoutHtml += '</table>';
        $('#divVendor').empty().html(layoutHtml);
    }

}

$("#setprice").click(function () {
    var ID = "";
   // var new_role = $("#revoke_role").val();

    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        ID += $(this).val() + ",";

    });
    ID = ID.replace(/,(?=\s*$)/, '');
    const areThereAnyCommas = ID.includes(',');
   // console.log(areThereAnyCommas);
    if (ID == "") { swal('Alert', 'Please select Vendor from list', 'error'); }
    else if (areThereAnyCommas == true) { swal('Alert', 'Please select only one Vendor from list to set default', 'error'); }
    else {
         
            swal({
                title: '', text: "Do you want to set default ?", type: 'warning', showCancelButton: true,
                confirmButtonColor: '#3085d6', cancelButtonColor: '#3085d6', confirmButtonText: 'Yes'
            }).then((result) => {
                if (result.value) {
                    setprice(ID);
                }
            })
      
    }
})


function setprice(ID) {
    var url = window.location.pathname;
    var urlid = url.substring(url.lastIndexOf('/') + 1);
    var ids = ID;
    fk_productval = $('#ddlproductchild').val();
    var obj = { ID: ids, fk_product: fk_productval }

    $.ajax({
        url: '/Product/SetBuyingPrice/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () {
            $("#loader1").show();
        },
        success: function (data) {
            if (data.status == true) {
                if (data.url == "Manage") {
                    bindbuyingprice();
                   GetProductvariationID($("#hfid").val());
                    swal('Success!', data.message, 'success');
                }
                else {
                    swal('success!', data.message, 'success');
                }
                ActivityLog('Set default vendor price id (' + ID + ') for product id(' + urlid + ')', '/Product/AddNewProduct/' + urlid + '');
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
function EditUser(id) {
    $('#dvbuysing').show();
    $("#hfbuyingid").val(id);
    var ID = id;
    var obj = { strVal: id }
    $.ajax({

        url: '/Product/GetDataBuyingByID/' + ID,
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var i = JSON.parse(data);
           // console.log(i[0].fk_vendor);
            $('#ddlvender').val(i[0].fk_vendor).trigger('change');
            $("#txtminpurchasequantity").val(i[0].minpurchasequantity);
            $("#txttaglotno").val(i[0].taglotserialno);
            $("#txtSaletax").val(formatCurrency(i[0].salestax));
            $('#txtcurrencyconversionrate').val(i[0].purchase_price).trigger('change');
            $("#txtcostprice").val(formatCurrency(i[0].cost_price));
            $("#txtshippingprice").val(formatCurrency(i[0].shipping_price));
            $("#txtMisccosts").val(i[0].Misc_Costs);
            $("#txtDiscountqty").val(i[0].discount);
            $("#txtRemarks").val(i[0].remark);
            
            $('#ddltaxrate').val(i[0].taxrate).trigger('change');
            $('#lblcopyto').show();
            $('#ddlvendercopy').show();
            $('#btncopybuying').show();
      
        },
        error: function (msg) { alert(msg); }
    });
}

function formatCurrency(total) {
    var neg = false;
    if (total < 0) {
        neg = true;
        total = Math.abs(total);
    }
    return   parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "1,").toString();
}
function DeleteUser(id) {
    var ids = id;
    var obj = { ID: ids }

    $.ajax({
        url: '/Product/DeleteBuyingPrice/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () {
            $("#loader1").show();
        },
        success: function (data) {
            if (data.status == true) {
                if (data.url == "Manage") {
                    bindbuyingprice();
                    swal('Success!', data.message, 'success');
                }
                else {
                    swal('success!', data.message, 'success');
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

 

function ActiveUser(id) {
    var ids = id;
    var obj = { ID: ids }

    $.ajax({
        url: '/Product/ActiveuyingPrice/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () {
            $("#loader1").show();
        },
        success: function (data) {
            if (data.status == true) {
                if (data.url == "Manage") {
                    bindbuyingprice();
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


$(document).on('click', "#btnWarehouse", function () {
    AddWarehouse();
})

function AddWarehouse() {
    debugger
    ID = $("#hfwarehouseid").val();
    fk_productval = $('#ddlproductchild').val();
    warehouse = $("#ddlwarehouse").val();

    if (fk_productval == "") {
        swal('Alert', 'Please Enter Product', 'error').then(function () { swal.close(); $('#ddlproductchild').focus(); });
    }
    else if (warehouse == "") {
        swal('Alert', 'Please select warehouse', 'error').then(function () { swal.close(); $('#ddlwarehouse').focus(); });
    }
    else {
        var obj = {
            ID: ID,
            fk_product: fk_productval,
            fk_vendor: warehouse

        }
        $.ajax({
            url: '/Product/Createwarehouse/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () {
                $("#loader1").show();
            },
            success: function (data) {
                if (data.status == true) {
                    if (data.url == "Manage") {
                        bindwarehouse();
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


function bindwarehouse() {
    let PostID = $('#ddlproductchild').val();

    var obj = { strValue1: PostID };
    $.ajax({
        type: "POST", url: '/Product/GetwarehouseData', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        beforeSend: function () { $("#loader1").show(); },
        success: function (data) {
            var itemsDetailsxml = [];
            for (var i = 0; i < data.length; i++) {
                // let row_key = data[i].ID ;                      
                itemsDetailsxml.push({
                    PKey: data[i].ID, product_id: data[i].ID, product_name: data[i].product_name, product_label: data[i].product_label, StatusActive: data[i].Stock
                });

            }
            bindwarehouseDetails(itemsDetailsxml);
        },
        complete: function () { $("#loader1").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader1").hide(); swal('Alert!', errorThrown, "error"); },
        async: false

    });
}

function bindwarehouseDetails(data) {
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
                    layoutHtml += '<td><a href="javascript:void(0);" title="Click here to Active" data-toggle="tooltip" class="editbutton" onClick="Activewarehouser(' + data[i].PKey + '); ActivityLog(\'Edit product warehouse\',\'/Product/AddNewProduct/' + data[i].PKey +'\');"><i class="glyphicon glyphicon-eye-open"></i></a></td>';
                else
                    layoutHtml += '<td><a href="javascript:void(0);" title="Click here In-Active" data-toggle="tooltip" class="editbutton" onClick="Deletewarehouser(' + data[i].PKey + '); ActivityLog(\'delete product warehouse\',\'/Product/AddNewProduct/' + data[i].PKey +'\');"><i class="glyphicon glyphicon-trash"></i></a></td>';
                layoutHtml += '</tr>';
            }
        }
        // console.log(layoutHtml);
        $('#warehouse_services').empty().append(layoutHtml);

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
        layoutHtml += '</thead><tbody id="warehouse_services"></tbody>';
        layoutHtml += '</table>';
        $('#divwarehouse').empty().html(layoutHtml);
    }

}

//function Editwarehouse(id) {
//    $("#hfwarehouseid").val(id);
//    var ID = id;
//    var obj = { strVal: id }
//    $.ajax({

//        url: '/Product/GetDataProductwarehouseByID/' + ID,
//        type: 'post',
//        contentType: "application/json; charset=utf-8",
//        dataType: 'JSON',
//        data: JSON.stringify(obj),
//        success: function (data) {
//            var i = JSON.parse(data);
//            //  console.log(i);
//            $('#ddlwarehouse').val(i[0].fk_warehouse).trigger('change');

//        },
//        error: function (msg) { alert(msg); }
//    });
//}

function Deletewarehouser(id) {
    var ids = id;
    var obj = { ID: ids }

    $.ajax({
        url: '/Product/DeleteProductwarehouse/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () {
            $("#loader1").show();
        },
        success: function (data) {
            if (data.status == true) {
                if (data.url == "Manage") {           
                    bindwarehouse();
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

function Activewarehouser(id) {
    var ids = id;
    var obj = { ID: ids }

    $.ajax({
        url: '/Product/ActiveProductwarehouse/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () {
            $("#loader1").show();
        },
        success: function (data) {
            if (data.status == true) {
                if (data.url == "Manage") {
                    bindwarehouse();
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

$(document).on('click', "#btnNotes", function () {
    AddNotes();
})
function AddNotes() {
  
    Private = $("#txtPrivate").val();
    fk_productval = $('#ddlproductchild').val();
    Public = $("#txtPublic").val();

    if (fk_productval == "") {
        swal('Alert', 'Please enter product', 'error').then(function () { swal.close(); $('#ddlproductchild').focus(); });
    }
    else if (Private == "") {
        swal('Alert', 'Please select private', 'error').then(function () { swal.close(); $('#txtPrivate').focus(); });
    }
    else if (Public == "") {
        swal('Alert', 'Please enter notes', 'error').then(function () { swal.close(); $('#txtPublic').focus(); });
    }
    else {
        var obj = {
            ID: fk_productval,
            Private_Notes: Private,
            Public_Notes: Public

        }
        $.ajax({
            url: '/Product/CreateNotes/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () {
                $("#loader1").show();
            },
            success: function (data) {
                if (data.status == true) {
                    if (data.url == "Manage") {                       
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



//$(document).on('click', "#btnuploade", function () {
//    Adduploade();
//})

//function Adduploade() {

//    var formData = new FormData();
//    var file = document.getElementById("ImageFile").files[0];
//    formData.append("ImageFile", file); 

//    var Name = $('#ddlproductchild').val().trim()
//    formData.append("Name", Name);

//    if (Name == "") {
//        swal('Alert', 'Please Enter Product', 'error').then(function () { swal.close(); $('#ddlproductchild').focus(); });
//    }
//    else if (file == "") {
//        swal('Alert', 'Please upload files', 'error').then(function () { swal.close(); $('#txtPrivate').focus(); });
//    }
//    else {

//        $.ajax({
//            type: "POST",
//            url: '/Product/FileUploade/',
//            data: formData,
//            processData: false,
//            contentType: false,
//            beforeSend: function () {
//                $("#loader1").show();
//            },
//            success: function (data) {
//                if (data.status == true) {
//                    if (data.url == "Manage") {
//                        swal('Alert!', data.message, 'success');
//                        bindfileuploade();
//                    }
//                    else {
//                        // $('#fetch_results > input:text').val('');
//                        swal('Alert!', data.message, 'success');
//                    }
//                    //$('#ddlProduct').val(null).trigger('change');
//                    //clear_fetch();

//                }
//                else {
//                    swal('Alert!', data.message, 'error')
//                }
//            },
//            complete: function () {
//                $("#loader1").hide();
//                //location.href = '/Users/Users/';
//                //window.location.href = '/Users/Users/';

//            },
//            error: function (error) {
//                swal('Error!', 'something went wrong', 'error');
//            },
//        })
//    }
//}


$(document).on('click', "#btnuploade", function () {
    Adduploade();
})

function Adduploade() {
    debugger

    var formData = new FormData();
    var file = document.getElementById("ImageFileproductlink").files[0];
    formData.append("ImageFileproductlink", file);

    var Name = $('#ddlproductchild').val();
    formData.append("Name", Name);

    if (file == "") {
        swal('Alert', 'Please upload files', 'error').then(function () { swal.close(); });
    }
    else {
        ActivityLog('Attach file in Product list Kits & Buying Prices ', '/Product/AddNewProduct/');
        $.ajax({
            type: "POST",
            url: '/Product/FileUploade/',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (data) {
                if (data.status == true) {
                    if (data.url == "Manage") {
                        swal('Success!', data.message, 'success');
                        bindfileuploade();
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
                $("#loader").hide();
            },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
        })
    }
}


function bindfileuploade() {
    let PostID = $('#ddlproductchild').val();

    var obj = { strValue1: PostID };
    $.ajax({
        type: "POST", url: '/Product/GetfileuploadData', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
        beforeSend: function () { $("#loader1").show(); },
        success: function (data) {
            var itemsDetailsxml = [];
            for (var i = 0; i < data.length; i++) {
                // let row_key = data[i].ID ;                      
                itemsDetailsxml.push({
                    PKey: data[i].ID, product_id: data[i].ID, product_name: data[i].product_name, Length: data[i].product_label, CreateDate: data[i].sellingpric
                });

            }
            bindbindfileuploadeDetails(itemsDetailsxml);
        },
        complete: function () { $("#loader1").hide(); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader1").hide(); swal('Alert!', errorThrown, "error"); },
        async: false

    });
}

function bindbindfileuploadeDetails(data) {
    // console.log('g', data);
    var layoutHtml = '';
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].PKey > 0) {
                layoutHtml += '<tr id="tritemId_' + data[i].PKey + '" data-key="' + data[i].PKey + '">';
                layoutHtml += '<td class="text-left"><a target="popup" href="../../Files/' + data[i].product_name + '">' + data[i].product_name + '</i></a ></td>';                
                layoutHtml += '<td>' + data[i].Length + 'KB' + '</td>';
                layoutHtml += '<td>' + data[i].CreateDate + '</td>';
                layoutHtml += '<td><a href="javascript:void(0);" class="editbutton" onClick="viewfileupload(' + data[i].PKey + '); ActivityLog(\'View product data linked files\',\'Product/AddNewProduct/' + data[i].PKey +'\');"><i class="glyphicon glyphicon-eye-open"></i></a></td>';
                layoutHtml += '<td class="text-right"><a href="javascript:void(0);" class="editbutton" onClick="Deletefileupload(' + data[i].PKey + '); ActivityLog(\'Delete linked product data files\',\'Product/AddNewProduct/' + data[i].PKey +'\');"><i class="glyphicon glyphicon-trash"></i></a></td>';
                layoutHtml += '</tr>';
            }
        }
        // console.log(layoutHtml);
        $('#divfileupload_services').empty().append(layoutHtml);

    }
    else {
        layoutHtml += '<table id="dtfileupload" class="table-blue table table-bordered table-striped dataTable">';
        layoutHtml += '<thead>';
        layoutHtml += '<tr>';
        layoutHtml += '<th class="text-left">Documents</th>';
        layoutHtml += '<th>Size</th>';
        layoutHtml += '<th>Date</th>';
        layoutHtml += '<th>View</th>';
        layoutHtml += '<th class="text-right">Delete</th>';
        layoutHtml += '</tr>';
        layoutHtml += '</thead><tbody id="divfileupload_services"></tbody>';
        layoutHtml += '</table>';
        $('#divfileupload').empty().html(layoutHtml);
    }

}

function Deletefileupload(id) {
    var ids = id;
    var obj = { ID: ids }

    $.ajax({
        url: '/Product/Deletefileuploade/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () {
            $("#loader1").show();
        },
        success: function (data) {
            if (data.status == true) {
                if (data.url == "Manage") {
                    bindfileuploade();
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

function viewfileupload(id) {
     

}
function addshippingprice() {
    let con = parseFloat($("#txtcurrencyconversionrate").val()) || 0.00;
    let ship = parseFloat($("#txtshippingprice").val()) || 0.00;
    let mis = parseFloat($("#txtMisccosts").val()) || 0.00;
    let sal = parseFloat($("#txtSaletax").val()) || 0.00;
   // console.log(con);
    let castprice = con + ship + mis + sal;
    $("#txtcostprice").val(castprice.toFixed(2));
}
function ClearControl() {
    $("#txtminpurchasequantity").val('1');
    $("#txttaglotno").val('');
    $("#txtSaletax").val('0');
    $('#txtcurrencyconversionrate').val('0');
    $("#txtcostprice").val('0');
    $("#txtshippingprice").val('0');
    $("#txtMisccosts").val('0');
    $("#txtDiscountqty").val('');
    $("#txtRemarks").val('');
    $('#ddlvender').val('').trigger('change');
    $('#ddltaxrate').val('0').trigger('change');
    $('#lblcopyto').hide();
    $('#ddlvendercopy').hide();
    $('#btncopybuying').hide();
}
///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Product Notes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var ajaxFunc = function (url, data, beforeSendFun, successFun, completeFun, errorFun) {
    $.ajax({
        type: "POST", url: url, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(data),
        beforeSend: beforeSendFun, success: successFun, complete: completeFun, error: errorFun, async: false
    });
}
function beforeSendFun() { $("#loader").show(); }
function completeFun() { $("#loader").hide(); }
function errorFun(XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); }

function getNotesList(oid) {
    var url = window.location.pathname;
    var urlid = url.substring(url.lastIndexOf('/') + 1);
    oid = parseInt($('#ddlproductchild').val()) || 0;
    var option = { strValue1: oid };
    ajaxFunc('/Product/GetNotesList', option, beforeSendFun, function (result) {
        let data = JSON.parse(result);
        let noteHtml = '';
        for (var i = 0; i < data.length; i++) {
            let is_customer_note = parseInt(data[i].is_customer_note) || 0;
            noteHtml += '<li id="linoteid_' + data[i].comment_ID + '" class="note system-note ' + (is_customer_note == 0 ? '' : 'customer-note') + '">';
            noteHtml += '<div class="note_content"><p>' + data[i].comment_content + '</p></div>';
            noteHtml += '<p class="meta"><abbr class="exact-date" title="' + data[i].comment_date + '">' + data[i].comment_date + '</abbr> ';
            noteHtml += '<a href="javascript:void(0)" onclick="DeleteNotes(' + data[i].comment_ID + '); ActivityLog(\'Delete product notes for product id (' + urlid + ')\',\'/AddNewProduct/' + urlid +'\');" class="delete_note billinfo" role="button">Delete note</a>';
            noteHtml += '</p>';
            noteHtml += '</li>';
        }
        $(".order_notes").empty().html(noteHtml);
    }, completeFun, errorFun);
}
function AddNotes() {
    var url = window.location.pathname;
    var urlid = url.substring(url.lastIndexOf('/') + 1);
    let oid = parseInt($('#ddlproductchild').val()) || 0;
    let option = { post_ID: oid, comment_content: $('#add_order_note').val(), is_customer_note: $('#order_note_type').val() };

    if (oid == 0) {
        swal('Alert', 'Please enter product', 'error').then(function () { swal.close(); $('#ddlproductchild').focus(); });
    }
    else if ($('#add_order_note').val() == "") {
        swal('Alert', 'Please enter notes', 'error').then(function () { swal.close(); $('#txtPrivate').focus(); });
    }
    else if ($('#order_note_type').val() == "") {
        swal('Alert', 'Please select note type', 'error').then(function () { swal.close(); $('#txtPublic').focus(); });
    }
    else {

        ajaxFunc('/Product/NoteAdd', option, beforeSendFun, function (result) {
            if (result.status) {
                getNotesList(oid); $('#add_order_note').val('');
                ActivityLog('Add notes for product id(' + urlid + ')', '/Product/AddNewProduct/' + urlid + '');
            }
            else swal('Alert!', result.message, "error");
        }, completeFun, errorFun);
    }
}
function DeleteNotes(id) {
    let option = { comment_ID: id }; let oid = parseInt($('#ddlproductchild').val()) || 0;
    swal({ title: "Are you sure?", text: 'Would you like to remove this note?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) {
                ajaxFunc('/Product/NoteDelete', option, beforeSendFun, function (result) {
                    if (result.status) getNotesList(oid);
                    else swal('Alert!', result.message, "error");
                }, completeFun, errorFun);
            }
        });
}