$(document).ready(function () {
    $("#loader").hide();
    //console.log(location);
    //location.href = 'ListProduct';
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    $('li:contains(Variations)').hide();

    $("#btnbacklist").prop("href", "ListProduct")

    $('#divPurchase').hide();
    $('#txtPublishDate').datepicker({ format: 'mm/dd/yyyy', autoclose: true, todayHighlight: true });
    //let today = new Date();
    //$('#txtPublishDate').val(today.toLocaleDateString("en-US"));

    $.get('/Product/GetShipping/' + 1, function (data) {
        var items = "";
        // $('#ddlShipping').empty();
        // items += "<option value=''>Please select</option>";
        $.each(data, function (index, value) {
            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlShipping");
        })
    });


    if (id != "" && id != "AddNewProduct") {
        $('#lbltitle').text("Update Product");
        //  $("#btnPurchase").show();
        $('#divPurchase').show();
        $("#hfid").val(id);
        // $("#btnPurchase").prop("href", "../AddNewPurchase/" + id)
        $("#btnbacklist").prop("href", "../ListProduct")

        GetDataByID(id);
        //  console.log($("#hfprodcid").val());

        GetProdctByID($("#hfprodcid").val());
        GetExProdctByID($("#hfcategid").val());
        if ($("#hfvproductattributes").val() != null || $("#hfvproductattributes").val() != '') {
            GetAttributesID($("#hfvproductattributes").val());
        }
        GetProductvariationID(id);

        //setTimeout(function () { GetDataByID(id); }, 3000);
        //console.log($("#hfprodcid").val());

        //setTimeout(function () { GetProdctByID($("#hfprodcid").val()); }, 5000);
        //setTimeout(function () { GetExProdctByID($("#hfcategid").val()); }, 5000);

        //setTimeout(function () { GetAttributesID($("#hfvproductattributes").val()); }, 7500);
        //setTimeout(function () { GetProductvariationID(id); }, 9000);
    }
    else {
        $("#btnAdd").hide();
        $('#lbltitle').text("Add New Product");
        //  BindControls();
    }
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
        /*$("#tbhold").append('<tr id="row' + i + '"><td><div class="col-md-12"> <label>Name:</label><br /><input type="text" class="input" id=tb' + itxtCnt + ' value="" /><br /><input type="checkbox" class="inputchk" id=tb' + itxtCnt + ' value=""/><label>Visible on the product page</label><br /> <input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + ' value=""/><label>Used for variations</label></div></td><td><br /><br /><div class="col-md-12"><label>Value(s):</label><input type="text" placeholder="Enter some text, or some attributes by "|" separating values." style="width: 100%; height: 110px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;" class="inputdes" id=tb' + itxtCnt + ' value="" /></div></td><td><button type="button" class="btn btn-danger btn_remove" id="' + i + '" name="remove">X</button></td></tr>');*/
        // $("#tbhold").append('<tr id="row' + i + '"><td><div class="col-md-12"> <label>Name:</label><br /><input type="text" class="input" id=tb' + itxtCnt + ' value="" /><br /><input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + ' value=""/><label>Used for variations</label></div></td><td><br /><br /><div class="col-md-12"><label>Value(s):</label><input type="text" placeholder="Enter some text, or some attributes by "|" separating values." style="width: 100%; height: 110px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;" class="inputdes" id=tb' + itxtCnt + ' value="" /></div></td><td><button type="button" class="btn btn-danger btn_remove" id="' + i + '" name="remove">X</button></td></tr>');
        $("#tbhold").append('<tr id="row' + i + '"><td><div class="form-group"><label class="control-label">Name:</label><input type="text" class="input form-control" id=tb' + itxtCnt + ' value="" /><span><input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + ' value=""/><label for=tb' + itxtCnt + '>Used for variations</label></div></td><td><div class="form-group"><label class="control-balel">Value(s):</label><textarea placeholder="Enter some text, or some attributes by | separating values." class="inputdes form-control" id=tb' + itxtCnt + '></textarea></div></td><td><button type="button" class="btn no-btn btn_remove" id="' + i + '" name="remove">X</button></td></tr>');

    });
    $(document).on('click', '.a-float-right', function () {
        $(this).toggleClass('angle-change');
        $(this).parents('.box-header').next('.varient-box').slideToggle(100).parents('.form-group.d-flex').siblings().find('.varient-box').slideUp(100).siblings('.box-header').find('#angle-box').removeClass('angle-change');
    });

    $("#addvariation").click(function (e) {
        let _Attlist = [];
        $('#tbhold > tr').each(function (index, tr) {
            _Attlist.push({ key: $(tr).find('.input').val(), value: $(tr).find('.inputdes').val() });
        });

        $('.input').each(function () {
            if (this.value != '')
                values.push(this.value);
        });

        $("#hfattributeheaderval").val(values.join(','));

        // console.log('Addvart'+_Attlist);
        var Edit = $("#hfid").val();
        let IDPost = "";
        i++;
        itxtCnt = itxtCnt + 1;
        if (Edit == "") {
            var ID = $("#hfUpdatedID").val();
        }
        else {
            ID = Edit;
        }
        let parentID = parseInt($("#hfUpdatedID").val()) || parseInt($("#hfid").val());
        //var ID = "796103";// $("#hfUpdatedID").val();
        let _shipping_class = GetShippingClass();
        // alert(ID);
        if (ID != "") {
            $.ajax({
                type: 'POST',
                url: '/Product/savevariantproduct',
                data: "{'fields':'" + $("#hfattributeheaderval").val() + "',  'parentid': '" + parentID + "'}",
                dataType: 'json',
                headers: { "Content-Type": "application/json" },
                beforeSend: function () {
                    $("#loader").show();
                },
                success: function (data) {
                    if (data.status == true) {
                        IDPost = data.ID;

                        let varHTML = '<div class="form-group d-flex" id="tr_' + data.ID + '" data-vid="' + data.ID + '">';
                        varHTML += '<div class="col-sm-12">';
                        //header
                        varHTML += '<div class="box-header with-border user-top-section top-with-select">';
                        varHTML += '<div class="tablenav top tablenav-top2">';
                        varHTML += '<input type="text" class="nmvariationid" id="hfvariationid" readonly value="' + data.ID + '">';

                        varHTML += '<div class="alignleft actions bulkactions">';
                        varHTML += '<table class="data-contacts1-js table table-striped"><tbody class="variation_att">';
                        $.each(_Attlist, function (key, value) {
                            let _values = value.value.split('|');
                            varHTML += '<tr><select class="inputddl" id="ddl_attribute_' + value.key.trim() + '" data-key="' + value.key.trim() + '"><option value="' + value.key.trim() + '">Any ' + value.key.trim() + '</option>';
                            for (let j = 0; j < _values.length; j++) { varHTML += '<option value="' + _values[j].trim() + '"> ' + _values[j].trim() + '</option>'; }
                            varHTML += '</select></tr>';
                        });
                        varHTML += '&nbsp;&nbsp;<label class="control-label">SKU</label><input id="varsku" type="text" class="skucval" value="">'
                        varHTML += '</tbody></table>';
                        varHTML += '</div>';
                        varHTML += '<div class="a-float-right" id="angle-box"> <span><i class="fa fa-angle-down" aria-hidden="true"></i></span></div>';
                        varHTML += '</div>';
                        varHTML += '</div >';
                        //end-header
                        //body
                        varHTML += '<div class="varient-box">';
                        varHTML += '<div class="form-group d-flex">';
                        varHTML += '<div class="col-md-6"></div><div class="col-md-6"></div>';
                        varHTML += '</div>';
                        //varHTML += '<div class="form-group d-flex virtual-checks">';
                        //varHTML += '    <div class="col-md-12">';
                        //varHTML += '<div class="form-check-input"><input type="checkbox" class="chkproducttypevir" id="virtualcheck"><label>Virtual:</label></div>';
                        //varHTML += '    <div class="form-check-input"><input type="checkbox" class="chkproducttypestc" id="stockcheck"><label>Manage Stock?</label></div>';
                        //varHTML += '    </div>';
                        //varHTML += '</div>';
                        varHTML += '<div class="form-group d-flex mt-25">';
                        varHTML += '    <div class="col-md-6"><label class="control-label">Retail Price($)</label><input type="text" name="txtregularvar" value="0"  class="form-control" placeholder="Variation price *"></div>';
                        varHTML += '<div class="col-md-6"><label class="control-label">Sale Price($)</label><input type="text" value="0"  name="txtSalepricevariation" class="form-control"></div>';
                        varHTML += '</div>';
                        varHTML += '<div id="divstock">';
                        varHTML += '<div class="form-group d-flex mt-25"><div class="col-md-6"><label class="control-label">Stock quantity</label><input type="text" name="txtStockquantityvariation" value="0"  class="form-control"></div><div class="col-md-6"><label class="control-label">Allow backorders?</label> <select class="txtallowbackordersvariation form-control"> <option value="no" selected="selected">Do not allow</option> <option value="notify">Allow, but notify customer</option><option value="yes">Allow</option></select> </div>';
                        varHTML += '</div> <div id="divaria">';
                        varHTML += '<div class="form-group d-flex"><div class="col-md-6"><label class="control-label">Weight (lbs)</label><input type="text" value="0"  name="txtweightvariation" class="form-control" placeholder="50" ></div><div class="col-md-6"><label class="control-label">Dimensions (L x W x H) (in)</label><div class="weight-box"><div class="col-md-4"><input type="text" value="0"  name="txtLvariation" class="form-control" placeholder="60"></div><div class="col-md-4"><input type="text" value="0"  name="txtWvariation" class="form-control" placeholder="60"></div><div class="col-md-4"> <input type="text" value="0"  name="txtHvariation" class="form-control" placeholder="60"></div></div></div></div>';
                        varHTML += '</div>';
                        varHTML += '    <div class="form-group d-flex mt-25">';
                        /*varHTML += '<div class="col-md-12"><label class="control-label">Shipping Class</label><select class="txtshipvariation form-control"><option value="-1">shipping class</option><option class="level-0" value="200">Adjustabe Base (Split King)</option> <option class="level-0" value="246">Adjustable Base (Full)</option> <option class="level-0" value="201">Adjustable Base (King)</option><option class="level-0" value="199">Adjustable Base (Queen)</option>  <option class="level-0" value="198">Adjustable Base (Twin XL)</option><option class="level-0" value="71">Bed Frame</option><option class="level-0" value="114">Blanket</option><option class="level-0" value="30">Foundation</option> <option class="level-0" value="50">Free Shipping</option> <option class="level-0" value="263">Hybrid Cal King</option> <option class="level-0" value="260">Hybrid Full</option> <option class="level-0" value="262">Hybrid King</option> <option class="level-0" value="261">Hybrid Queen</option> <option class="level-0" value="258">Hybrid Twin</option> <option class="level-0" value="259">Hybrid Twin XL</option> <option class="level-0" value="257">Mattress Cal King</option>  <option class="level-0" value="254">Mattress Full</option><option class="level-0" value="256">Mattress King</option> <option class="level-0" value="196">Mattress Protector</option> <option class="level-0" value="255">Mattress Queen</option> <option class="level-0" value="252">Mattress Twin</option>    <option class="level-0" value="253">Mattress Twin XL</option>  <option class="level-0" value="195">Memory Foam Pillow</option><option class="level-0" value="52">Pillow</option>  <option class="level-0" value="202">Platform Bed</option> <option class="level-0" value="107">Sheets</option> <option class="level-0" value="87">Topper</option> </select></div>';*/
                        varHTML += '<div class="col-md-12"><label class="control-label">Shipping Class</label></div>';
                        varHTML += '<select class="txtshipvariation form-control select2"><option value="-1">Select shipping class</option>';
                        for (var j = 0; j < _shipping_class.length; j++) {                           
                                varHTML += '<option value="' + _shipping_class[j].rowid + '"> ' + _shipping_class[j].name + '</option>';
                        };
                        varHTML += '</select ></div > ';
                        varHTML += '    </div>';
                        varHTML += '    <div class="form-group d-flex">';
                        varHTML += '        <div class="col-md-12"><label class="control-label">Tax Class</label><select class="txttaxcassvariation form-control"><option value="standard" selected="selected">Standard</option> <option value="reduced-rate">Reduced rate</option> <option value="zero-rate">Zero rate</option> </select></div>';
                        varHTML += '    </div>';
                        varHTML += '    <div class="form-group d-flex">';
                        varHTML += '        <div class="col-md-12">';
                        varHTML += '            <label class="control-label note-label"><i>Note: Setting a product as note taxable or having the "Zero rate".</i></label>';
                        varHTML += '        </div>';
                        varHTML += '    </div>';
                        varHTML += '    <div class="form-group d-flex">';
                        varHTML += '        <div class="col-md-12"><label class="control-label">Description</label><textarea class="txtdescriptionvariation form-control"></textarea></div>';
                        varHTML += '    </div>';
                        varHTML += '<div class="form-group d-flex allow-website">';
                        varHTML += '    <div class="col-md-12">';
                        varHTML += '<div class="form-check-input"><input type="checkbox" class="chkallowwebsite" id="allowwebsite"><label> Allow on website.</label></div>';
                        varHTML += '    </div>';
                        varHTML += '</div>';
                        varHTML += '    <div class="box-footer text-right"></div>';
                        varHTML += '</div>';
                        //end-body
                        varHTML += '</div>';
                        varHTML += '</div>';
                        $("#product_variations").append(varHTML);
                        $(".select2").select2();
                        //let varHTML = '<div class="form-group d-flex" id="tr_' + i + '"> <div class="col-sm-12"> <div class="box-header with-border user-top-section top-with-select"><div class="tablenav top tablenav-top2"><input type="text" class="nmvariationid" id="hfvariationid" value="' + IDPost + '" /><div class="alignleft actions bulkactions "><table class="data-contacts1-js table table-striped" > <tbody> </tbody>  </table></div><div class="a-float-right" id="angle-box"> <span><i class="fa fa-angle-down" aria-hidden="true"></i></span>  </div> </div> </div>    <div class="varient-box"> <div class="form-group d-flex"><div class="col-md-6"></div> <div class="col-md-6"><label class="control-label">SKU</label><input id="varsku" type="text" class="skucval" /></div> </div><div class="form-group d-flex virtual-checks"><div class="col-md-12"><div class="form-check-input"><input type="checkbox" class="chkproducttypevir" id="virtualcheck" value=""><label>Virtual:</label></div><div class="form-check-input"><input type="checkbox" class="chkproducttypestc" id="stockcheck"><label>Manage Stock?</label></div></div> </div><div class="form-group d-flex mt-25"><div class="col-md-6"><label class="control-label">Regular Price($)</label><input type="text"  name="txtregularvar" class="form-control" placeholder="Variation price *" /></div><div class="col-md-6"><label class="control-label">Sale Price($)</label><input type="text" name="txtSalepricevariation" class="form-control" /></div></div><div id="divstock"><div class="form-group d-flex mt-25"><div class="col-md-6"><label class="control-label">Stock quantity</label><input type="text" name="txtStockquantityvariation" class="form-control"></div><div class="form-group d-flex mt-25"> <label class="col-sm-6 control-label">Allow backorders?</label> <select class="txtallowbackordersvariation"> <option value="no" selected="selected">Do not allow</option> <option value="notify">Allow, but notify customer</option><option value="yes">Allow</option></select> </div> </div> </div> <div id="divaria"> <div class="form-group d-flex"><div class="col-md-6"><label class="control-label">Weight (lbs)</label><input type="text" name="txtweightvariation" class="form-control" placeholder="50" /></div><div class="col-md-6"><label class="control-label">Dimensions (L x W x H) (in)</label><div class="weight-box"><div class="col-md-4"><input type="text" name="txtLvariation" class="form-control" placeholder="60" /></div><div class="col-md-4"><input type="text" name="txtWvariation" class="form-control" placeholder="60" /></div><div class="col-md-4"> <input type="text" name="txtHvariation" class="form-control" placeholder="60" /></div></div></div></div></div><div class="form-group d-flex"><div class="col-md-12"><label class="control-label">Shipping Class</label><select class="txtshipvariation"> <option value="-1">shipping class</option><option class="level-0" value="200">Adjustabe Base (Split King)</option> <option class="level-0" value="246">Adjustable Base (Full)</option> <option class="level-0" value="201">Adjustable Base (King)</option><option class="level-0" value="199">Adjustable Base (Queen)</option>  <option class="level-0" value="198">Adjustable Base (Twin XL)</option><option class="level-0" value="71">Bed Frame</option><option class="level-0" value="114">Blanket</option><option class="level-0" value="30">Foundation</option> <option class="level-0" value="50">Free Shipping</option> <option class="level-0" value="263">Hybrid Cal King</option> <option class="level-0" value="260">Hybrid Full</option> <option class="level-0" value="262">Hybrid King</option> <option class="level-0" value="261">Hybrid Queen</option> <option class="level-0" value="258">Hybrid Twin</option> <option class="level-0" value="259">Hybrid Twin XL</option> <option class="level-0" value="257">Mattress Cal King</option>  <option class="level-0" value="254">Mattress Full</option><option class="level-0" value="256">Mattress King</option> <option class="level-0" value="196">Mattress Protector</option> <option class="level-0" value="255">Mattress Queen</option> <option class="level-0" value="252">Mattress Twin</option>    <option class="level-0" value="253">Mattress Twin XL</option>  <option class="level-0" value="195">Memory Foam Pillow</option><option class="level-0" value="52">Pillow</option>  <option class="level-0" value="202">Platform Bed</option> <option class="level-0" value="107">Sheets</option> <option class="level-0" value="87">Topper</option> </select></div> </div><div class="form-group d-flex"><div class="col-md-12"><label class="control-label">Tax Class</label><select class="txttaxcassvariation" ><option value="standard" selected="selected">Standard</option> <option value="reduced-rate">Reduced rate</option> <option value="zero-rate">Zero rate</option> </select></div></div><div class="form-group d-flex"><div class="col-md-12"><label class="control-label note-label"><i>Note: Setting a product as note taxable or having the "Zero rate".</i></label></div></div><div class="form-group d-flex"><div class="col-md-12"><label class="control-label">Description</label><textarea class="txtdescriptionvariation"></textarea></div></div><div class="box-footer text-right"></div></div> </div></div>';
                        //$("#product_variations").append(varHTML);
                    }
                },
                complete: function () { $("#loader").hide(); },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // alert(errorThrown);
                }
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
        debugger
        let _attxml = [];
        let parentID = parseInt($("#hfUpdatedID").val()) || parseInt($("#hfid").val());
        // console.log(parentID);


        //console.log($("#hfid").val());
        // console.log($("#hfUpdatedID").val());
        $("#product_variations > div.d-flex").each(function (index, div) {
            /*console.log('att', index);*/
            $(div).find(".inputddl").each(function () {
                _attxml.push(
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: 'attribute_' + $(this).data('key'), meta_value: $(this).val() }
                );
            });

            $(div).find(".skucval").each(function () {
                _attxml.push(
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_sku', meta_value: this.value }
                );
            });

            $(div).find(".chkallowwebsite").each(function () {
                _attxml.push(
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_allowwebsite', meta_value: this.checked }
                );
            });

            //$(div).find(".chkproducttypestc").each(function () {
            //    _attxml.push(
            //        { post_id: $(div).find('.nmvariationid').val(), meta_key: '_manage_stock', meta_value: this.checked }
            //    );
            //});

            $(div).find("input[name = txtregularvar]").each(function () {
                _attxml.push(
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_regular_price', meta_value: this.value }
                );
            });

            $(div).find("input[name = txtSalepricevariation]").each(function () {
                _attxml.push(
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_sale_price', meta_value: this.value },
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_price', meta_value: this.value },
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: 'total_sales', meta_value: 0 },
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_download_expiry', meta_value: "-1" },
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_download_limit', meta_value: "no" },
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_downloadable', meta_value: "no" },
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_manage_stock', meta_value: true },

                );
            });

            $(div).find("input[name = txtweightvariation]").each(function () {
                _attxml.push(
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_weight', meta_value: this.value },
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_sold_individually', meta_value: "no" },
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_tax_status', meta_value: "taxable" }
                );
            });

            $(div).find("input[name = txtLvariation]").each(function () {
                _attxml.push(
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_length', meta_value: this.value },
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_wc_review_count', meta_value: "0" }
                );
            });

            $(div).find("input[name = txtWvariation]").each(function () {
                _attxml.push(
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_width', meta_value: this.value },
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_wc_average_rating', meta_value: "no" },
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_stock_status', meta_value: "instock" }
                );
            });

            $(div).find("input[name = txtHvariation]").each(function () {
                _attxml.push(
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_height', meta_value: this.value }
                );
            });

            $(div).find(".txttaxcassvariation").each(function () {
                _attxml.push(
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_tax_class', meta_value: this.value }
                );
            });

            $(div).find(".txtallowbackordersvariation").each(function () {
                _attxml.push(
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_backorders', meta_value: this.value }
                );
            });
            $(div).find("input[name = txtStockquantityvariation]").each(function () {
                _attxml.push(
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_stock', meta_value: this.value }
                );
            });

            $(div).find(".txtdescriptionvariation").each(function () {
                _attxml.push(
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_variation_description', meta_value: this.value }
                );
            });
        });
        let _ItemProduct = []
        $("#product_variations > div.d-flex").each(function (index, div) {
            $(div).find(".txtshipvariation").each(function () {
                _ItemProduct.push(
                    { object_id: $(div).find('.nmvariationid').val(), term_taxonomy_id: this.value, term_order: "0" }
                );
            });
        });


        let _PostTitleProduct = []
        $("#product_variations > div.d-flex").each(function (index, div) {
            let post_titel = '';
            let post_excerptdata = '';
            $(div).find(".inputddl").each(function () {
                post_titel += ' ' + $(this).val();
                post_excerptdata += ' ' + $(this).data('key') + ':' + $(this).val();
                _PostTitleProduct.push(
                    { ID: $(div).find('.nmvariationid').val(), post_title: $("#txtProductName").val() + '-' + post_titel, post_excerpt: post_excerptdata }
                );

            });

        });

        let _PriceProduct = []
        $("#product_variations > div.d-flex").each(function (index, div) {
            $(div).find("input[name = txtSalepricevariation]").each(function () {
                _PriceProduct.push(
                    { post_id: parentID, meta_key: '_price', meta_value: this.value },
                );
            });
        });

        //$('#tbhold > tr').each(function (index, tr) {
        //    _list.push({ key: $(tr).find('.input').val(), value: $(tr).find('.inputdes').val() });

        //});

        //let _skvxml = []

        //    /*console.log('att', index);*/
        //$('.skucval').each(function (index) {
        //    _attxml.push(
        //        { post_id: index, meta_key: '_sku', meta_value: this.value }
        //        );
        //    }); _ItemProduct

        //console.log(_attxml);
       // console.log(_ItemProduct);
       // console.log(_PostTitleProduct);
      //  console.log(_PriceProduct);
         
        var obj = {
            ProductPostMeta: _attxml, ProductPostItemMeta: _ItemProduct, ProductPostPostMeta: _PostTitleProduct, ProductPostPriceMeta: _PriceProduct
        }
       // console.log(obj);
        if (_attxml != '') {
            //  NOW CALL THE WEB METHOD WITH THE PARAMETERS USING AJAX.
            $.ajax({
                type: 'POST',
                url: '/Product/Savevariations',
                data: JSON.stringify(obj), //"{'fields':'" + _list + "', 'UpdateList': '" + _listkey  + "', 'UpdateID': '" + variationIDUpdate + "', 'PID': '" + $("#hfid").val() + "', 'post_title': '" + $("#txtProductName").val() + "', 'regularprice': '" + regularvar + "', 'Salepricevariationval': '" + Salepricevariation + "', 'Stockquantityvariationval': '" + Stockquantityvariation + "', 'allowbackordersvariationval': '" + allowbackordersvariation + "', 'weightvariationval': '" + weightvariation + "', 'Lvariationval': '" + Lvariation + "', 'Wvariationval': '" + Wvariation + "','Hvariationval': '" + Hvariation + "','shipvariationval': '" + shipvariation + "', 'cassvariationval': '" + cassvariation + "', 'descriptionvariationval': '" + descriptionvariation + "', 'stockchec': '" + stockcheckval + "', 'chkvirtual': '" + virtualval + "','sku': '" + skucval + "', 'parentid': '" + $("#hfUpdatedID").val() + "', 'attributeheaderval': '" + $("#hfattributeheaderval").val() + "'}",
                dataType: 'json',
                headers: { "Content-Type": "application/json" },
                beforeSend: function () {
                    $("#loader").show();
                },
                success: function (data) {
                    if (data.status == true) {
                        swal('Alert!', data.message, 'success');
                        //GetProductvariationID(id);
                    }
                    // EMPTY THE ARRAY.
                    // alert(response.d);
                },
                complete: function () {
                    $("#loader").hide();
                    //location.href = '/Users/Users/';
                    //window.location.href = '/Users/Users/';

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

        // console.log(_list);

        $('.input').each(function () {
            if (this.value != '')
                values.push(this.value);
        });
        let parentID = parseInt($("#hfid").val());
        //  console.log(values.join(','));
        $("#hfattributeheaderval").val(values.join(','));
        //$('.inputdes').each(function () {
        //    if (this.value != '')
        //        valuesdescription.push(this.value);
        //});

        //$('.inputchk').each(function () {
        //    inputchkvisible.push(this.checked);
        //});

        inputchkvisible.push(true);

        $('.inputchkvar').each(function () {
            //if (this.value != '')
            inputchkvariation.push(this.checked);
        });


        if (_list != '') {
            //  NOW CALL THE WEB METHOD WITH THE PARAMETERS USING AJAX.
            $.ajax({
                type: 'POST',
                url: '/Product/saveAttributes',
                data: "{'fields':'" + JSON.stringify(_list) + "','IDs': '" + parentID.toString() + "','post_title': '" + $("#txtProductName").val() + "', 'table': '" + _list + "', 'visible': '" + inputchkvisible + "', 'variation': '" + inputchkvariation + "', 'producttypeID': '" + $("#ddlProductType").val() + "'}",
                dataType: 'json',
                headers: { "Content-Type": "application/json" },
                beforeSend: function () {
                    $("#loader").show();
                },
                success: function (data) {
                    if (data.status == true) {
                        if (data.url == "Manage") {
                            //alert('d');
                            GetProductvariationID(id);
                            swal('Alert!', data.message, 'success');
                        }
                        else {
                            $("#hfUpdatedID").val(data.ID);
                            swal('Alert!', data.message, 'success');
                        }
                    }
                    // EMPTY THE ARRAY.
                    // alert(response.d);
                },
                complete: function () {
                    $("#loader").hide();
                    //location.href = '/Users/Users/';
                    //window.location.href = '/Users/Users/';

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // alert(errorThrown);
                }
            });
        }
        else { alert("Fields cannot be empty.") }

    });


    //$(document).on('click', "#virtualcheck", function () {

    //    if ($(this).prop("checked")) {
    //        $('#divaria').hide();
    //    } else {
    //        $('#divaria').show();
    //    }
    //});
    //$(document).on('click', "#stockcheck", function () {
    //    if ($(this).prop("checked")) {
    //        $('#divstock').show();
    //    } else {
    //        $('#divstock').hide();
    //    }
    //});

});
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
    let date_publish = $("#txtPublishDate").val().split('/');
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

    if (date_publish.length > 0)
        date_publish = date_publish[2] + '/' + date_publish[0] + '/' + date_publish[1];
    //console.log(date_publish);

    if (productname == "") {
        swal('Alert', 'Please Enter Product', 'error').then(function () { swal.close(); $('#txtProductName').focus(); });
    }
    else if (regularprice == "" && ProductTypeval != "4") {
        swal('Alert', 'Please Enter Regular price', 'error').then(function () { swal.close(); $('#txtregularprice').focus(); });
    }
    else if (categorydataval == "" ) {
        swal('Alert', 'Please Select Category', 'error').then(function () { swal.close(); $('#chkproducttype').focus(); });
    }
    else {
        
        var obj = {
            ID: ID,
            updatedID: UpdatedIDval,
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
            CategoryID: categorydataval,
            PublishDate: date_publish
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
            // console.log(i); 
            $("#txtProductName").val(i[0].post_title);
            $("#hftitle").val(i[0].post_title);
            $("#formatcustom").val(i[0].post_content);
            $('#ddlProductType').val(i[0].ProductsID).trigger('change');
            $("#txtregularprice").val(i[0].regularamount);
            $("#txtsaleprice").val(i[0].saleprice);
            if (i[0].axstatus == "" || i[0].taxclass == null)
                $('#ddltaxstatus').val("taxable").trigger('change');
            else
                $('#ddltaxstatus').val(i[0].axstatus).trigger('change');

            if (i[0].taxclass == "" || i[0].taxclass == null)
                $('#ddlclasstax').val("standard").trigger('change');
            else
                $('#ddlclasstax').val(i[0].taxclass).trigger('change');
            $("#txtsku").val(i[0].sku);
          //  console.log(i[0].Publish_Date);
            if (i[0].Publish_Date != null)
                $('#txtPublishDate').val(i[0].Publish_Date);
        
            if (i[0].managestock == "yes") {
                $("#enableStock").prop("checked", true);
                $('#dvsock').show();
            }
            else {
                $('#dvsock').hide();
            }
            $("#txtStockquantity").val(i[0].stock);
            $('#txtallowbackorders').val(i[0].backorders).trigger('change');
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

            $("#hfvproductattributes").val(i[0].productattributes);

            $("#hfproductvariationID").val(i[0].VariantID);

            $("#hfcategid").val(i[0].crosssellids);

            $("#hfprodectcategoryid").val(i[0].CategoryID);
            var category = i[0].CategoryID;
            if (category != null) {
                var temp = new Array();
                var temp = category.split(",");
                $('#tblprodctype').find('input[type="checkbox"]').each(function (i, item) {
                    if (temp.includes($(item).val()))
                        $(item).prop('checked', true);
                });
            }

            if ($("#ddlProductType").val() == "4") {
                $('#divregular').hide();
                $('#divsale').hide();
                $('li:contains(Variations)').show();

            } else {
                $('#divregular').show();
                $('#divsale').show();
                $('li:contains(Variations)').hide();
            }
        },
        error: function (msg) { alert(msg); },
        async: false
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
        error: function (msg) { alert(msg); },
        async: false
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
        error: function (msg) { alert(msg); },
        async: false
    });

}

function GetAttributesID(Attributes) {
   // console.log(Attributes);
    if (Attributes != '') {
        var itxtCnt = 0;
        var ID = Attributes;
        //i++;
        var i = 1;
        itxtCnt = itxtCnt + 1;
        //  var trainindIdArray = Attributes.split(',{'); 
        $.each(JSON.parse(Attributes), function (index1, value) {
            var datalog = JSON.parse(Attributes);
            // $("#tbhold").append('<tr id="row' + i + '"><td><div class="col-md-12"> <label>Name:</label><br /><input type="text"  class="input" id=tb' + itxtCnt + ' value="' + datalog[index1].key + '" /><br /><input type="checkbox" class="inputchk" id=tb' + itxtCnt + ' value=""/><label>Visible on the product page</label><br /> <input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + '  value=""/><label>Used for variations</label></div></td><td><br /><br /><div class="col-md-12"><label>Value(s):</label><input type="text" placeholder="Enter some text, or some attributes by "|" separating values." style="width: 100%; height: 110px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;" class="inputdes" id=tb' + itxtCnt + ' value="' + datalog[index1].value + '" /></div></td><td><button type="button" class="btn btn-danger btn_remove" id="' + i + '" name="remove">X</button></td></tr>');
            //$("#tbhold").append('<tr id="row' + i + '"><td><div class="col-md-12"> <label>Name:</label><br /><input type="text"  class="input" id=tb' + itxtCnt + ' value="' + datalog[index1].key + '" /><br /><input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + '  value=""/><label>Used for variations</label></div></td><td><br /><br /><div class="col-md-12"><label>Value(s):</label><input type="text" placeholder="Enter some text, or some attributes by "|" separating values." style="width: 100%; height: 110px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;" class="inputdes" id=tb' + itxtCnt + ' value="' + datalog[index1].value + '" /></div></td><td><button type="button" class="btn btn-danger btn_remove" id="' + i + '" name="remove">X</button></td></tr>');
            $("#tbhold").append('<tr id="row' + i + '"><td><div class="form-group"><label class="control-label">Name:</label><input type="text" class="input form-control" id=tb' + itxtCnt + ' value="' + datalog[index1].key + '" /><span><input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + ' value=""/><label for=tb' + itxtCnt + '>Used for variations</label></div></td><td><div class="form-group"><label class="control-balel">Value(s):</label><textarea placeholder="Enter some text, or some attributes by | separating values." class="inputdes form-control" id=tb' + itxtCnt + ' >' + datalog[index1].value + '</textarea></div></td><td><button type="button" class="btn no-btn btn_remove" id="' + i + '" name="remove">X</button></td></tr>');
        });
        // $('.inputchk').prop("checked", true);
        $('.inputchkvar').prop("checked", true);
    }
}

function GetShippingClass() {
    let _shipping_class = [];
    $.ajax({
        type: "get", url: '/Product/GetShippingddl', contentType: "application/json; charset=utf-8", dataType: "json", data: {},
        success: function (data) {
            data = JSON.parse(data); _shipping_class = data;
            //console.log(data, _shipping_class);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { }, async: false
    });
    return _shipping_class;
}
function GetProductvariationID(ProductID) {
    let _shipping_class = GetShippingClass();
    $("#product_variations").empty();
    var obj = { strVal: ProductID }
    $.ajax({
        url: '/Product/GetDataVariationByID', type: 'post', contentType: "application/json; charset=utf-8", dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            //console.log(data);
            let varHTML = '', attHTML = '';
            for (let i = 0; i < data.length; i++) {
                let v_data = JSON.parse(data[i].meta_data);

                // let stock = v_data['_stock'].replace('undefined', ''); _sale_price 
                //    console.log(v_data['_regular_price']);
                //    let regular_price = '';
                //    if (v_data['_regular_price'] != "") {

                //    if (v_data['_regular_price'] != undefined)
                //            regular_price = v_data['_regular_price'];
                //    else {
                //        regular_price = 0;
                //    }
                //}
                //    else
                //   regular_price = v_data['_regular_price'];
              
                let allowwebsite = '';
                if (v_data['_allowwebsite'] != "" && v_data['_allowwebsite'] != undefined)
                     allowwebsite = v_data['_allowwebsite'];              

                let sku = '';
                //sku = v_data['_sku'];
                //if (sku != '' || sku != null) {

                //    sku = sku;
                //}
                //else {
                if (v_data['_sku'] != undefined)
                    sku = v_data['_sku'];
                else
                    sku = 0;
                //}
                let stock = '';
                if (v_data['_stock'] != undefined)
                    stock = v_data['_stock'];
                else
                    stock = 0;

                let weight = '';
                if (v_data['_weight'] != undefined)
                    weight = v_data['_weight'];
                else
                    weight = 0;
                let sale_price = '';
                if (v_data['_sale_price'] != undefined)
                    sale_price = v_data['_sale_price'];
                else
                    sale_price = 0;

                let length = '';
                if (v_data['_length'] != undefined)
                    length = v_data['_length'];
                else
                    length = 0;
                let width = '';
                if (v_data['_width'] != undefined)
                    width = v_data['_width'];
                else
                    width = 0;

                let height = '';
                if (v_data['_height'] != undefined)
                    height = v_data['_height'];
                else
                    height = 0;

                varHTML = '<div class="form-group d-flex" id="tr_' + i + '" data-vid="' + data[i].id + '">';
                varHTML += '<div class="col-sm-12">';
                //header
                varHTML += '<div class="box-header with-border user-top-section top-with-select">';
                varHTML += '<div class="tablenav top tablenav-top2">';
                varHTML += '<input type="text" readonly class="nmvariationid" id="hfvariationid" value="' + data[i].id + '">';

                varHTML += '<div class="alignleft actions bulkactions">';
                varHTML += '<table class="data-contacts1-js table table-striped"><tbody class="variation_att">';
                //console.log(v_data);
                $.each(JSON.parse($("#hfvproductattributes").val()), function (key, value) {
                    let _values = value.value.split('|'); let sel_val = v_data['attribute_' + value.key.trim().toLowerCase()];
                    varHTML += '<tr><select class="inputddl" id="ddl_attribute_' + value.key.trim() + '" data-key="' + value.key.trim() + '"><option value="' + value.key.trim() + '">Any ' + value.key.trim() + '</option>';
                    for (let j = 0; j < _values.length; j++) {
                        varHTML += '<option value="' + _values[j].trim() + '" ' + (sel_val == _values[j].trim() ? 'selected' : '') + '> ' + _values[j].trim() + '</option>';
                    }
                    varHTML += '</select></tr>';
                });
                varHTML += '&nbsp;&nbsp;<label class="control-label">SKU</label><input id="varsku" type="text" class="skucval" value="' + sku + '">'
                varHTML += '</tbody></table>';
                varHTML += '</div>';
                varHTML += '<div class="a-float-right" id="angle-box"> <span><i class="fa fa-angle-down" aria-hidden="true"></i></span></div>';
                varHTML += '</div>';
                varHTML += '</div >';
                //end-header
                //body
                varHTML += '<div class="varient-box">';
                varHTML += '<div class="form-group d-flex">';
                varHTML += '<div class="col-md-6"></div><div class="col-md-6"></div>';
                varHTML += '</div>';
                //varHTML += '<div class="form-group d-flex virtual-checks">';
                //varHTML += '    <div class="col-md-12">';
                //varHTML += '<div class="form-check-input"><input type="checkbox" checked="true" class="chkproducttypevir" id="virtualcheck"><label>Virtual:</label></div>';
                //varHTML += '    <div class="form-check-input"><input type="checkbox" value="' + v_data['_manage_stock'] + '" class="chkproducttypestc" id="stockcheck"><label>Manage Stock?</label></div>';
                //varHTML += '    </div>';
                //varHTML += '</div>';
                varHTML += '<div class="form-group d-flex mt-25">';
                varHTML += '    <div class="col-md-6"><label class="control-label">Retail Price($)</label><input type="text" name="txtregularvar" class="form-control" placeholder="Variation price *" value="' + v_data['_regular_price'] + '"></div>';
                varHTML += '<div class="col-md-6"><label class="control-label">Sale Price($)</label><input type="text" name="txtSalepricevariation" class="form-control" value="' + sale_price + '"></div>';
                varHTML += '</div>';
                varHTML += '<div id="divstock">';
                varHTML += '<div class="form-group d-flex mt-25"><div class="col-md-6"><label class="control-label">Stock quantity</label><input type="text" name="txtStockquantityvariation" class="form-control" value="' + stock + '"></div><div div class="col-md-6"> <label class="control-label">Allow backorders?</label> <select class="txtallowbackordersvariation form-control" id="ddlallow_' + data[i].id + '"> <option value="no">Do not allow</option> <option value="notify">Allow, but notify customer</option><option value="yes">Allow</option></select> </div>';
                varHTML += '</div> <div id="divaria">';
                varHTML += '<div class="form-group d-flex"><div class="col-md-6"><label class="control-label">Weight (lbs)</label><input type="text" name="txtweightvariation" class="form-control" placeholder="50" value="' + weight + '"></div><div class="col-md-6"><label class="control-label">Dimensions (L x W x H) (in)</label><div class="weight-box"><div class="col-md-4"><input type="text" name="txtLvariation" class="form-control" placeholder="60" value="' + length + '"></div><div class="col-md-4"><input type="text" name="txtWvariation" class="form-control" placeholder="60" value="' + width + '"></div><div class="col-md-4"> <input type="text" name="txtHvariation" class="form-control" placeholder="60" value="' + height + '"></div></div></div></div>';
                varHTML += '</div>';
                varHTML += '    <div class="form-group d-flex">';
                /*   varHTML += '        <div class="col-md-12"><label class="control-label">Shipping Class</label><select class="txtshipvariation form-control" id="ddlsv_' + data[i].id + '"><option value="-1">shipping class</option><option class="level-0" value="200">Adjustabe Base (Split King)</option> <option class="level-0" value="246">Adjustable Base (Full)</option> <option class="level-0" value="201">Adjustable Base (King)</option><option class="level-0" value="199">Adjustable Base (Queen)</option>  <option class="level-0" value="198">Adjustable Base (Twin XL)</option><option class="level-0" value="71">Bed Frame</option><option class="level-0" value="114">Blanket</option><option class="level-0" value="30">Foundation</option> <option class="level-0" value="50">Free Shipping</option> <option class="level-0" value="263">Hybrid Cal King</option> <option class="level-0" value="260">Hybrid Full</option> <option class="level-0" value="262">Hybrid King</option> <option class="level-0" value="261">Hybrid Queen</option> <option class="level-0" value="258">Hybrid Twin</option> <option class="level-0" value="259">Hybrid Twin XL</option> <option class="level-0" value="257">Mattress Cal King</option>  <option class="level-0" value="254">Mattress Full</option><option class="level-0" value="256">Mattress King</option> <option class="level-0" value="196">Mattress Protector</option> <option class="level-0" value="255">Mattress Queen</option> <option class="level-0" value="252">Mattress Twin</option>    <option class="level-0" value="253">Mattress Twin XL</option>  <option class="level-0" value="195">Memory Foam Pillow</option><option class="level-0" value="52">Pillow</option>  <option class="level-0" value="202">Platform Bed</option> <option class="level-0" value="107">Sheets</option> <option class="level-0" value="87">Topper</option> </select></div>';*/
                varHTML += '        <div class="col-md-12"><label class="control-label">Shipping Class</label>';
                varHTML += '<select class="txtshipvariation form-control select2" id="ddlsv_' + data[i].id + '"><option value="-1">Select shipping class</option>';
                for (var j = 0; j < _shipping_class.length; j++) {
                    if (data[i].shippingclass == _shipping_class[j].rowid)
                        varHTML += '<option value="' + _shipping_class[j].rowid + '" selected> ' + _shipping_class[j].name + '</option>';
                    else
                        varHTML += '<option value="' + _shipping_class[j].rowid + '"> ' + _shipping_class[j].name + '</option>';
                };
                varHTML += '</select></div> ';
                varHTML += '    </div>';
                varHTML += '    <div class="form-group d-flex">';
                varHTML += '        <div class="col-md-12"><label class="control-label">Tax Class</label><select class="txttaxcassvariation form-control" id="ddlcsv_' + data[i].id + '"><option value="standard">Standard</option> <option value="reduced-rate">Reduced rate</option> <option value="zero-rate">Zero rate</option> </select></div>';
                varHTML += '    </div>';
                varHTML += '    <div class="form-group d-flex">';
                varHTML += '        <div class="col-md-12">';
                varHTML += '            <label class="control-label note-label"><i>Note: Setting a product as note taxable or having the "Zero rate".</i></label>';
                varHTML += '        </div>';
                varHTML += '    </div>';
                varHTML += '    <div class="form-group d-flex">';
                varHTML += '        <div class="col-md-12"><label class="control-label">Description</label><textarea  class="txtdescriptionvariation form-control">' + v_data['_variation_description'] + '</textarea></div>';
                varHTML += '    </div>';
                varHTML += '<div class="form-group d-flex allow-website">';
                varHTML += '    <div class="col-md-12">';
                varHTML += '<div class="form-check-input"><input type="checkbox" class="chkallowwebsite form-check-input" id="allowwebsite_' + data[i].id + '"><label> Allow on website.</label></div>';
                varHTML += '    </div>';
                varHTML += '</div>';
                varHTML += '    <div class="box-footer text-right"></div>';
                varHTML += '</div>';
                //end-body
                varHTML += '</div>';
                varHTML += '</div>';
                $("#product_variations").append(varHTML);
                $(".select2").select2();
                $("#ddlcsv_" + data[i].id).val(v_data['_tax_class']).trigger('change');
                $("#ddlallow_" + data[i].id).val(v_data['_backorders']).trigger('change');
               // console.log(allowwebsite);
                if (allowwebsite == 'True')
                    $("#allowwebsite_" + data[i].id).prop("checked", true);
                else
                    $("#allowwebsite_" + data[i].id).prop("checked", false);
                
            }

        },
        error: function (msg) { alert(msg); },
        async: false
    });

    //varHTML += '            <tr><select class="inputddl" id="ddl_{}" data-key="Size"></select></tr>';
    //varHTML += '            <tr><select class="inputddl" id="ddl_{}" data-key="Color"></select></tr>';
    //varHTML += '            <tr><select class="inputddl" id="ddl_{}" data-key="Color1"></select></tr>';

    //var itxtCnt = 0;
    //var ID = VariationID;
    //var i = 1;
    //itxtCnt = itxtCnt + 1;
    //var trainindIdArray = VariationID.split(',');
    //$.each(trainindIdArray, function (index1, value) {
    //    // alert(value);


    //});
}




