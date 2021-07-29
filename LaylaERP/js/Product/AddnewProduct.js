

$(document).ready(function () {
    $("#loader").hide();

    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    $('li:contains(Variations)').hide();



    if (id != "" && id != "Index") {
        $("#hfid").val(id);
        setTimeout(function () { GetDataByID(id); }, 10);
        //// $("#hfprodcid").val("629,632");
        setTimeout(function () { GetProdctByID($("#hfprodcid").val()); }, 3000);
        setTimeout(function () { GetExProdctByID($("#hfcategid").val()); }, 3500);

    }
    //  BindControls();

    $("#txtregularprice").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    });
    $("#txtsaleprice").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    });

    $("#txtLowstockthreshold").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    });
    $("#txtStockquantity").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    });
    $("#txtweigh").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    });
    $("#txtLength").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    });
    $("#txtWidth").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    });
    $("#txtHeight").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    });



    $('#dvsock').hide();
    $('#enableStock').change(function () {
        if ($(this).prop("checked")) {
            $('#dvsock').show();
        } else {
            $('#dvsock').hide();
        }
    });

    $('#ddlProductType').change(function () {

        if ($("#ddlProductType").val() == "4") {
            $('#divregular').hide();
            $('#divsale').hide();
            $('li:contains(Variations)').show();

        } else {
            $('#divregular').show();
            $('#divsale').show();
            $('li:contains(Variations)').hide();
        }
    });

    $('#ddlUpsells').select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Search Product",
        ajax: {
            url: '/Product/GetProductList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.Name, name: item.Name, id: parseInt(item.pr_id) > 0 ? item.pr_id : item.id } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
    $('#ddlCrosssells').select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Search Product",
        ajax: {
            url: '/Product/GetProductList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.Name, name: item.Name, id: parseInt(item.pr_id) > 0 ? item.pr_id : item.id } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
    var values = new Array();
    var valuesdescription = new Array();
    var inputchkvisible = new Array();
    var inputchkvariation = new Array();
    var itxtCnt = 0;
    var i = 1;
    $("#add").click(function (e) {
        i++;
        itxtCnt = itxtCnt + 1;
        e.preventDefault();
        $("#tbhold").append('<tr id="row' + i + '"><td><div class="col-md-12"> <label>Name:</label><br /><input type="text" class="input" id=tb' + itxtCnt + ' value="" /><br /><input type="checkbox" class="inputchk" id=tb' + itxtCnt + ' value=""/><label>Visible on the product page</label><br /> <input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + ' value=""/><label>Used for variations</label></div></td><td><br /><br /><div class="col-md-12"><label>Value(s):</label><input type="text" placeholder="Enter some text, or some attributes by "|" separating values." style="width: 100%; height: 110px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;" class="inputdes" id=tb' + itxtCnt + ' value="" /></div></td><td><button type="button" class="btn btn-danger btn_remove" id="' + i + '" name="remove">X</button></td></tr>');

    });


    $("#addvariation").click(function (e) {
        var ID = "796103";// $("#hfUpdatedID").val();
        alert(ID);
        if (ID != "") {
            i++;
            itxtCnt = itxtCnt + 1;
            e.preventDefault();
            ///$("#tbholdvariation").append('<tr id="row' + ID + '"><td><div class="col-md-12"> <label>Name:</label><br /><select class="inputddl" id=tb' + itxtCnt + ' /></div></td><td><br /><br /><div class="col-md-12"></div></td><td><button type="button" class="btn btn-danger btn_remove" id="' + i + '" name="remove">X</button></td></tr>');
            
            let varHTML = '<div class="form-group d-flex"> <div class="col-sm-12"> <div class="box-header with-border user-top-section top-with-select"><div class="tablenav top tablenav-top2"><div class="alignleft actions bulkactions "><select class="inputddl" id="tb1"></select></div><div class="a-float-right" id="angle-box"> <span><i class="fa fa-angle-down" aria-hidden="true"></i></span>  </div> </div> </div> </div>   </div>  <div class="varient-box">< div class="form-group d-flex" ><div class="col-md-6"><img class="varient-pic" src="~/Images/varient_pic.png" alt="varient" /></div><div class="col-md-6"><label class="control-label">SKU</label><input type="text" class="form-control" /></div></div ><div class="form-group d-flex virtual-checks"><div class="col-md-12"><div class="form-check"><input type="checkbox" name="chkproducttype" id="enabled_check" value="64"><label for="enabled_check">Enabled:</label></div><div class="form-check"><input type="checkbox" name="chkproducttype" id="downloadable_check" value="64"><label for="downloadable_check">Downloadable:</label></div><div class="form-check"><input type="checkbox" name="chkproducttype" id="virtual_check" value="64"><label for="virtual_check">Virtual:</label></div><div class="form-check"><input type="checkbox" name="chkproducttype" id="stock_check" value="64"><label for="stock_check">Manage Stock?</label></div></div> </div><div class="form-group d-flex mt-25"><div class="col-md-6"><label class="control-label">Regular Price($)</label><input type="text" class="form-control" placeholder="Variation price *" /></div><div class="col-md-6"><label class="control-label">Sale Price($)</label><input type="text" class="form-control" /></div></div><div class="form-group d-flex"><div class="col-md-12"><label class="control-label">Stock Status</label><select class="form-control"><option value="">In Stock</option><option value="">Out of Stock</option></select></div></div><div class="form-group d-flex"><div class="col-md-6"><label class="control-label">Weight (lbs)</label><input type="text" class="form-control" placeholder="50" /></div><div class="col-md-6"><label class="control-label">Dimensions (L x W x H) (in)</label><div class="weight-box"><div class="col-md-4"><input type="text" class="form-control" placeholder="60" /></div><div class="col-md-4"><input type="text" class="form-control" placeholder="60" /></div><div class="col-md-4"> <input type="text" class="form-control" placeholder="60" /></div></div></div></div><div class="form-group d-flex"><div class="col-md-12"><label class="control-label">Shipping Class</label><input type="text" class="form-control" placeholder="Same as Parent" /></div> </div><div class="form-group d-flex"><div class="col-md-12"><label class="control-label">Tax Class</label><input type="text" class="form-control" placeholder="Same as Parent" /></div></div><div class="form-group d-flex"><div class="col-md-12"><label class="control-label note-label"><i>Note: Setting a product as note taxable or having the "Zero rate".</i></label></div></div><div class="form-group d-flex"><div class="col-md-12"><label class="control-label">Description</label><textarea class="form-control"></textarea></div></div><div class="box-footer text-right"></div></div></td></tr>';

            $("#product_variations").append(varHTML);

            var obj = { strVal: ID }
            $.ajax({

                url: '/Product/Getproductattributes/' + ID,
                type: 'post',
                contentType: "application/json; charset=utf-8",
                dataType: 'JSON',
                data: JSON.stringify(obj),
                success: function (data) {
                    console.log(data);
                    var i = JSON.parse(data);
                    console.log(i);
                    //$("#hfproductattributesID").val(i[0].productattributes);
                    //alert($("#hfproductattributesID").val());
                    //var _listattribute = i[0].productattributes
                    //let _listattribute = JSON.parse(productattributes);
                    // console.log(_listattribute);
                    varHTML = '';
                    console.log(JSON.parse(i));
                    $.each(JSON.parse(i), function (key, value) {
                        //  console.log(key);
                        console.log(value);
                        let _values = value.value.split('|');
                        //varHTML += '<td><select class="inputddl" id="tb1">';
                       // varHTML += '<option value="' + value.key + '">Any ' + value.key + '</option>';
                        for (i = 0; i < _values.length; i++) {
                           // $('.inputddl').append('<option value="' + _values[i] + '">Any ' + _values[i] + '</option>');
                            $('.inputddl').append($('<option></option>').val(_values[i]).html(_values[i]));
                         
                        }
                       // varHTML += '</select ></td > ';


                        // $('#tbholdvariation > tr').each(function (index, tr) {
                        //  $('<option></option>').val(key).html(value)
                        // $(tr).find('.inputddl').append($('<option>').text(key).attr('value', value));
                        //}
                        // );
                    });
                   
                   // $("#tr_" + i).append(varHTML);
                   // setTimeout(function () {
                   // varHTML += '<tr id="tr_' + i + '"><td><div class="col-md-12"> <label>Name:</label><br /><input type="text" class="input" id=tb' + itxtCnt + ' value="" /><br /><input type="checkbox" class="inputchk" id=tb' + itxtCnt + ' value=""/><label>Visible on the product page</label><br /> <input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + ' value=""/><label>Used for variations</label></div></td><td><br /><br /><div class="col-md-12"><label>Value(s):</label><input type="text" placeholder="Enter some text, or some attributes by "|" separating values." style="width: 100%; height: 110px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;" class="inputdes" id=tb' + itxtCnt + ' value="" /> </div></td></tr>';
                   // $("#tbhproductattributes").append('<tr id="row' + i + '"><td><div class="col-md-12"> <label>Name:</label><br /><input type="text" class="input" id=tb' + itxtCnt + ' value="" /><br /><input type="checkbox" class="inputchk" id=tb' + itxtCnt + ' value=""/><label>Visible on the product page</label><br /> <input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + ' value=""/><label>Used for variations</label></div></td><td><br /><br /><div class="col-md-12"><label>Value(s):</label><input type="text" placeholder="Enter some text, or some attributes by "|" separating values." style="width: 100%; height: 110px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;" class="inputdes" id=tb' + itxtCnt + ' value="" /></div></td><td><button type="button" class="btn btn-danger btn_remove" id="' + i + '" name="remove">X</button></td></tr>');

                  //  }, 2000);
                    //$('<option></option>').val(_listattribute).html(_listattribute)
                    //$('#tbhproductattributes').each(_listattribute, function (index, value) {
                    //    //_listattribute.push({ key: $(tr).find('.input').val(), value: $(tr).find('.inputdes').val() });
                    //   // $('<option>').val(_listattribute.key).text(_listattribute.value).appendTo("#tbhproductattributes");
                    //    console.log(index);
                    //    console.log(value);
                    //    ('.input').append($('<option>').text(value).attr('value', index));

                    //});

                    // var temp = new Array();
                    // var temp = category.split(",");
                    //$('#tblprodctype').find('input[type="checkbox"]').each(function (i, item) {
                    //    if (temp.includes($(item).val()))
                    //        $(item).prop('checked', true);
                    //});
                },
                error: function (msg) { alert(msg); }
            });

        }
        else
            swal('Alert!', " Before you can add a variation you need to add some variation attributes on the Attributes tab.", 'error');

    });

    //Remove input field  
    $(document).on('click', '.btn_remove', function () {
        var button_id = $(this).attr("id");
        $("#row" + button_id + '').remove();
    });

    $(document).on('click', "#btnSave", function () {
        AddProduct();
    })


    $("#btnSavevariations").click(function (e) {
        let _list = new Array();
        let _list1 = [];
        $('#product_variations > tr').each(function (index, tr) {
            _list1.push({ key: $(tr).find('.inputddl').val(), value: $(tr).find('.inputddl').val() });
            

        });
        $('.inputddl').each(function () {
            if (this.value != '')
                _list.push(this.value);
        });

        console.log(_list);
        console.log(_list1);

        $('.inputchk').each(function () {
            inputchkvisible.push(this.checked);
        });

        $('.inputchkvar').each(function () {
            //if (this.value != '')
            inputchkvariation.push(this.checked);
        });


        if (_list != '') {
            //  NOW CALL THE WEB METHOD WITH THE PARAMETERS USING AJAX.
            $.ajax({
                type: 'POST',
                url: '/Product/Savevariations',
                data: "{'fields':'" + _list + "', 'post_title': '" + $("#txtProductName").val() + "', 'parentid': '" + $("#hfUpdatedID").val() + "', 'attributeheaderval': '" + $("#hfattributeheaderval").val() + "'}",
                dataType: 'json',
                headers: { "Content-Type": "application/json" },
                success: function (data) {
                    if (data.status == true) {
                       // $("#hfUpdatedID").val(data.ID);
                        alert(data.ID);
                        swal('Alert!', data.message, 'success');
                    }
                    // EMPTY THE ARRAY.
                    // alert(response.d);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // alert(errorThrown);
                }
            });
        }
        else { alert("Fields cannot be empty.") }

    });

    $("#btnsaveAttributes").click(function (e) {
        let _list = [];
        $('#tbhold > tr').each(function (index, tr) {
            _list.push({ key: $(tr).find('.input').val(), value: $(tr).find('.inputdes').val() });

        });

        console.log(_list);

        $('.input').each(function () {
            if (this.value != '')
                values.push(this.value);
        });

        $("#hfattributeheaderval").val(values.join(', '));
        //$('.inputdes').each(function () {
        //    if (this.value != '')
        //        valuesdescription.push(this.value);
        //});

        $('.inputchk').each(function () {
            inputchkvisible.push(this.checked);
        });

        $('.inputchkvar').each(function () {
            //if (this.value != '')
            inputchkvariation.push(this.checked);
        });


        if (_list != '') {
            //  NOW CALL THE WEB METHOD WITH THE PARAMETERS USING AJAX.
            $.ajax({
                type: 'POST',
                url: '/Product/saveAttributes',
                data: "{'fields':'" + JSON.stringify(_list) + "', 'table': '" + _list + "', 'visible': '" + inputchkvisible + "', 'variation': '" + inputchkvariation + "'}",
                dataType: 'json',
                headers: { "Content-Type": "application/json" },
                success: function (data) {
                    if (data.status == true) {
                        $("#hfUpdatedID").val(data.ID);
                        alert(data.ID);
                        swal('Alert!', data.message, 'success');
                    }
                    // EMPTY THE ARRAY.
                    // alert(response.d);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // alert(errorThrown);
                }
            });
        }
        else { alert("Fields cannot be empty.") }

    });

});


//function BindControls() {

//    var itxtCnt = 0;    // COUNTER TO SET ELEMENT IDs.

//    // CREATE A DIV DYNAMICALLY TO SERVE A CONTAINER TO THE ELEMENTS.
//    var container = $(document.createElement('div')).css({
//        width: '100%',
//        clear: 'both',
//        'margin-top': '10px',
//        'margin-bottom': '10px'
//    });

//    // CREATE THE ELEMENTS.
//    $('#btAdd').click(function () {
//        itxtCnt = itxtCnt + 1;

//        $(container).append('<input type="text"' +
//            'placeholder="Field Name" class="input" id=tb' + itxtCnt + ' value="" />');

//        if (itxtCnt == 1) {
//            var divSubmit = $(document.createElement('div'));
//            $(divSubmit).append('<input type="button" id="btSubmit" value="Submit" class="bt"' +
//                'onclick="getTextValue()" />');
//        }

//        // ADD EVERY ELEMENT TO THE MAIN CONTAINER.
//        $('#main').after(container, divSubmit);
//    });
//}

// THE FUNCTION TO EXTRACT VALUES FROM TEXTBOXES AND POST THE VALUES (TO A WEB METHOD) USING AJAX.
//var values = new Array();
//function getTextValue() {
//    $('.input').each(function () {
//        if (this.value != '')
//            values.push(this.value);
//    });

//    if (values != '') {
//        // NOW CALL THE WEB METHOD WITH THE PARAMETERS USING AJAX.
//        $.ajax({
//            type: 'POST',
//            url: '/Product/saveAttributes',
//            data: "{'fields':'" + values + "', 'table': '" + $('#tbTableName').val() + "'}",
//            dataType: 'json',
//            headers: { "Content-Type": "application/json" },
//            success: function (response) {
//                values = [];    // EMPTY THE ARRAY.
//                alert(response.d);
//            },
//            error: function (XMLHttpRequest, textStatus, errorThrown) {
//                alert(errorThrown);
//            }
//        });
//    }
//    else { alert("Fields cannot be empty.") }
//}



function AddProduct() {
    debugger
    ID = $("#hfid").val();
    UpdatedIDval = $("#hfUpdatedID").val();
    var upsells = $('#ddlUpsells option:selected')
        .toArray().map(item => item.value).join();
    var Crosssells = $('#ddlCrosssells option:selected')
        .toArray().map(item => item.value).join();

    var v = '';
    $('input:checkbox:checked').each(function () {
        v = v + $(this).attr('value') + ",";
    });
    let dfa = v.replace('undefined,undefined,', '');
    let dfad = dfa.replace('undefined,', '');
    var n = dfad.lastIndexOf(",");
    var categorydata = dfad.substring(0, n)

    if ($("#enableStock").prop('checked') == true)
        enableStock = "yes";
    else
        enableStock = "no";

    if ($("#solidIndividually").prop('checked') == true)
        solidIndividually = "yes";
    else
        solidIndividually = "no";

    ProductTypeval = $("#ddlProductType").val();
    productname = $("#txtProductName").val();
    formetcustom = $("#formatcustom").val();
    regularprice = $("#txtregularprice").val();
    saleprice = $("#txtsaleprice").val();
    taxstatus = $("#ddltaxstatus").val();
    classtax = $("#ddlclasstax").val();
    sku = $("#txtsku").val();
    enableStockval = enableStock;
    Stockquantity = $("#txtStockquantity").val();

    allowbackorders = $("#txtallowbackorders").val();
    Lowstockthreshold = $("#txtLowstockthreshold").val();
    stockstatus = $("#ddlstockstatus").val();
    solidIndividuallyval = solidIndividually;

    weigh = $("#txtweigh").val();
    Length = $("#txtLength").val();
    Width = $("#txtWidth").val();
    Height = $("#txtHeight").val();

    Shipping = $("#ddlShipping").val();
    upsellsval = upsells;
    Crosssellsval = Crosssells;
    categorydataval = categorydata;

    if (productname == "") {
        swal('Alert', 'Please Enter Product', 'error').then(function () { swal.close(); $('#txtProductName').focus(); });
    }
    else if (regularprice == "") {
        swal('Alert', 'Please Enter Regular price', 'error').then(function () { swal.close(); $('#txtregularprice').focus(); });
    }
    else {
        var obj = {
            ID: ID,
            UpdatedIDval: UpdatedID,
            post_title: productname,
            post_name: productname,
            ProductTypeID: ProductTypeval,
            post_content: formetcustom,
            regular_price: regularprice,
            sale_price: saleprice,
            tax_status: taxstatus,
            tax_class: classtax,
            sku: sku,
            manage_stock: enableStockval,
            backorders: allowbackorders,
            stock: Stockquantity,
            stock_status: stockstatus,
            low_stock_amount: Lowstockthreshold,
            sold_individually: solidIndividuallyval,
            ShippingclassID: Shipping,
            weight: weigh,
            length: Length,
            width: Width,
            height: Height,
            upsell_ids: upsellsval,
            crosssell_ids: Crosssellsval,
            price: saleprice,
            CategoryID: categorydataval
        }
        $.ajax({
            url: '/Product/CreateProduct/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (data) {
                if (data.status == true) {
                    if (data.url == "Manage") {
                        swal('Alert!', data.message, 'success').then((result) => { location.href = '../ListProduct'; });
                    }
                    else {
                        $('#fetch_results > input:text').val('');
                        swal('Alert!', data.message, 'success').then((result) => { location.href = 'ListProduct'; });
                    }
                    //$('#ddlProduct').val(null).trigger('change');
                    //clear_fetch();

                }
                else {
                    swal('Alert!', data.message, 'error')
                }
            },
            complete: function () {
                $("#loader").hide();
                //location.href = '/Users/Users/';
                //window.location.href = '/Users/Users/';

            },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
        })
    }



}


function addZeroes(num) {
    // Cast as number
    var num = Number(num);
    // If not a number, return 0
    if (isNaN(num)) {
        return 0;
    }
    // If there is no decimal, or the decimal is less than 2 digits, toFixed
    if (String(num).split(".").length < 2 || String(num).split(".")[1].length <= 2) {
        num = num.toFixed(2);
    }
    // Return the number
    return num;
}
function clear_fetch() {

    $('#fetch_results').find('input:text, input:password,input:number, input:checkbox select')
        .each(function () {
            $(this).val('');
        });
    $('input[type=checkbox]').each(function () {
        this.checked = false;
    });
}

function GetDataByID(order_id) {
    var ID = order_id;
    if (ID == "Add New Product") { $('#lbltitle').text("Add New Product"); } else { $('#lbltitle').text("Update / View  Product"); }
    var obj = { strVal: order_id }
    $.ajax({

        url: '/Product/GetDataByID/' + ID,
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var i = JSON.parse(data);
            console.log(i);
            $("#txtProductName").val(i[0].post_title);
            $("#formatcustom").val(i[0].post_content);
            $('#ddlProductType').val(i[0].ProductsID).trigger('change');
            $("#txtregularprice").val(i[0].regularamount);
            $("#txtsaleprice").val(i[0].saleprice);
            $('#ddltaxstatus').val(i[0].axstatus.trim()).trigger('change');
            $('#ddlclasstax').val(i[0].taxclass.trim()).trigger('change');
            $("#txtsku").val(i[0].sku);
            if (i[0].managestock == "yes") {
                $("#enableStock").prop("checked", true);
                $('#dvsock').show();
            }
            else {
                $('#dvsock').hide();
            }
            $("#txtStockquantity").val(i[0].stock);
            $('#txtallowbackorders').val(i[0].backorders.trim()).trigger('change');
            $("#txtLowstockthreshold").val(i[0].lowstockamount);
            $('#ddlstockstatus').val(i[0].stockstatus.trim()).trigger('change');
            if (i[0].soldindividually == "yes")
                $("#solidIndividually").prop("checked", true);
            $("#txtweigh").val(i[0].weight);
            $("#txtLength").val(i[0].length);
            $("#txtWidth").val(i[0].width);
            $("#txtHeight").val(i[0].height);
            $('#ddlShipping').val(i[0].shippingclass).trigger('change');
            $("#hfprodcid").val(i[0].upsellids);
            $("#hfcategid").val(i[0].crosssellids);
            $("#hfprodectcategoryid").val(i[0].CategoryID);
            var category = i[0].CategoryID
            var temp = new Array();
            var temp = category.split(",");
            $('#tblprodctype').find('input[type="checkbox"]').each(function (i, item) {
                if (temp.includes($(item).val()))
                    $(item).prop('checked', true);
            });
        },
        error: function (msg) { alert(msg); }
    });

}

function GetProdctByID(ProdctID) {

    var ID = ProdctID;
    var obj = { strVal: ProdctID }
    $.ajax({

        url: '/Product/GetProdctByID/' + ID,
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var datalog = JSON.parse(data);
            for (var i = 0; i < datalog.length; i++) {
                $("#ddlUpsells").append('<option value="' + datalog[i].id + '" selected>' + datalog[i].Name + '</option>');
            }

        },
        error: function (msg) { alert(msg); }
    });

}

function GetExProdctByID(ProdctID) {

    var ID = ProdctID;
    var obj = { strVal: ProdctID }
    $.ajax({

        url: '/Product/GetProdctByID/' + ID,
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var datalog = JSON.parse(data);
            for (var i = 0; i < datalog.length; i++) {
                $("#ddlCrosssells").append('<option value="' + datalog[i].id + '" selected>' + datalog[i].Name + '</option>');
            }

        },
        error: function (msg) { alert(msg); }
    });

}



