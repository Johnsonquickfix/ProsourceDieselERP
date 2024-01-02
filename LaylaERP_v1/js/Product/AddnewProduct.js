$(document).ready(function () {
    $("#loader").hide();
    //console.log(location);
    //location.href = 'ListProduct';
    let url = window.location.pathname;
    let id = url.substring(url.lastIndexOf('/') + 1);

    let urlperm = "/Product/ListProduct";
    CheckPermissions("#btnSave", "#hfEdit", "", urlperm);
    CheckPermissions("#btnedit", "#hfEdit", "", urlperm);
    CheckPermissions("#btnSaveupdate", "#hfEdit", "", urlperm);

    $('li:contains(Variations)').hide();

    $("#btnbacklist").prop("href", "ListProduct")
    $('#divimage').hide();
    $('#divPurchase').hide();
    $('#txtPublishDate').datepicker({ format: 'mm/dd/yyyy', autoclose: true, todayHighlight: true });
    let today = new Date();
    $('#txtPublishDate').val(today.toLocaleDateString("en-US"));

    $.get('/Product/GetShipping/' + 1, { async: false }, function (data) {
        var items = "";
        // $('#ddlShipping').empty();
        // items += "<option value=''>Please select</option>";  
        $.each(data, function (index, value) {
            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlShipping");
        })
    });

    $('#chkgiftcard').change();
    Getsimpalproducttype(),
        bindCategory(id);
         //setTimeout(function () { bindCategory(); }, 18000);
   
    $("#ddlproducttypesimpal").val(1);
    if (id != "" && id != "AddNewProduct") {
        $("#target :input").prop("disabled", true);
        $('#lbltitle').text("Update Product");
        $("#btnedit").show();
        $('#divPurchase').show();
        $('#divimage').show();
        $("#hfid").val(id);
        // $("#btnPurchase").prop("href", "../AddNewPurchase/" + id)
        $("#btnbacklist").prop("href", "../ListProduct")
        $("#ddlProductType").prop("disabled", true);
       // setTimeout(function () { GetProductvariationID(id); }, 5000);
        GetDataByID(id), GetProdctByID($("#hfprodcid").val());
        GetProductvariationID(id);
        //  console.log($("#hfprodcid").val());

        ////GetExProdctByID($("#hfcategid").val());
        ////
        ////GetProductvariationID(id);

        //setTimeout(function () { GetDataByID(id); }, 3000);
        //console.log($("#hfprodcid").val());

        //setTimeout(function () { GetProdctByID($("#hfprodcid").val()); }, 5000);
        //setTimeout(function () { GetExProdctByID($("#hfcategid").val()); }, 5000);

        //setTimeout(function () { GetAttributesID($("#hfvproductattributes").val()); }, 7500);
      
        //$("#tbhold *").attr("disabled", true);
        //$("#simple-table").attr("disabled", "disabled");
        $("#tbhold").find("input,button,textarea,select").attr("disabled", true);
        $("#product_variations").find("input,button,textarea,select").attr("disabled", true);
        $("#btnedit").show();
        $("#btncancel").hide();
        $("#btnedit").prop("disabled", false);
        // $("#btncancel").prop("disabled", false); btnSaveupdate
        $("#btnSaveupdate").hide();
        $('#btnSaveupdate').text("Update");
        $("#btnSave").hide();
        $('#btnSave').text("Update");
        $('#txtPublishDate').attr('readonly', true);
        // $('#txtsku').attr('readonly', true);
        //$("#txtPublishDate").datepicker("disable"); txtsku
        $("#txtPublishDate").datepicker("destroy");

        $("#btnbackcategory").off("click").attr('href', "javascript: void(0);");

        //var urlpath = window.location.pathname;
        //var pathid = urlpath.substring(urlpath.lastIndexOf('/') + 1);
        //$("#btnbackcategory").prop("href", "/Product/ProductCategories/" + pathid)
        $('#btnbackcategory').attr("disabled", "disabled");


    }
    else {
        $("#target :input").prop("disabled", false);
        $("#btnAdd").hide();
        $('#lbltitle').text("Add New Product");
        //  BindControls();
        $("#ddlProductType").prop("disabled", false);
        $("#tbhold").find("input,button,textarea,select").attr("disabled", false);
        $("#product_variations").find("input,button,textarea,select").attr("disabled", false);
        $("#btnedit").hide();
        $("#btncancel").hide();
        $("#btnSave").show();
        $("#btnSaveupdate").show();
        $("#btnbackcategory").prop("href", "/Product/ProductCategories/" + 1000000001)
        // $("#btnbackcategory").prop("disabled", false);
        //  $('#btnbackcategory').attr("disabled", "disabled");
        //  $("#btnbackcategory").off('click');

        isEdit(true);
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

    $("#txtdaysexpire").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    });

    $('#enableStock').change(function () {
        if ($(this).prop("checked")) {
            $('#dvsock').show();
        } else {
            $('#dvsock').hide();
        }
    });
    // $('#divdayexpire').hide();
    //$('#divRecipientemail').hide();


    $('#ddlProductType').change(function () {

        if ($("#ddlProductType").val() == "variable") {
            $('#divregular').hide();
            $('#divsale').hide();
            $('li:contains(Variations)').show();
            $('#divproducttypesimpal').hide();

        } else {
            $('#divregular').show();
            $('#divsale').show();
            $('li:contains(Variations)').hide();
            $('#divproducttypesimpal').show();
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
        let _producttype = Getproducttype();
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
                        varHTML += '    <div class="col-md-6"><label class="control-label">Retail Price($)</label><input type="text" name="txtregularvar" value="0"  class="form-control rowCalulate" placeholder="Variation price *"></div>';
                        varHTML += '<div class="col-md-6"><label class="control-label">Sale Price($)</label><input type="text" value="0"  name="txtSalepricevariation" class="form-control rowCalulate"></div>';
                        varHTML += '</div>';
                        varHTML += '<div id="divstock">';
                        varHTML += '<div class="form-group d-flex mt-25"><div style="display:none" class="col-md-6"><label class="control-label">Stock quantity</label><input type="text" name="txtStockquantityvariation" value="0"  class="form-control"></div><div class="col-md-6"><label class="control-label">Allow backorders?</label> <select class="txtallowbackordersvariation form-control"> <option value="no" selected="selected">Do not allow</option> <option value="notify">Allow, but notify customer</option><option value="yes">Allow</option></select> </div>';
                        varHTML += '</div> <div id="divaria">';
                        varHTML += '<div class="form-group d-flex"><div class="col-md-6"><label class="control-label">Weight (lbs)</label><input type="text" value="0"  name="txtweightvariation" class="form-control" placeholder="Weight (lbs)" ></div><div class="col-md-6"><label class="control-label">Dimensions (L x W x H) (in)</label><div class="weight-box"><div class="col-md-4"><input type="text" value="0"  name="txtLvariation" class="form-control" placeholder="L"></div><div class="col-md-4"><input type="text" value="0"  name="txtWvariation" class="form-control" placeholder="W"></div><div class="col-md-4"> <input type="text" value="0"  name="txtHvariation" class="form-control" placeholder="H"></div></div></div></div>';
                        varHTML += '</div>';
                        varHTML += '    <div class="form-group d-flex mt-25">';
                        /*varHTML += '<div class="col-md-12"><label class="control-label">Shipping Class</label><select class="txtshipvariation form-control"><option value="-1">shipping class</option><option class="level-0" value="200">Adjustabe Base (Split King)</option> <option class="level-0" value="246">Adjustable Base (Full)</option> <option class="level-0" value="201">Adjustable Base (King)</option><option class="level-0" value="199">Adjustable Base (Queen)</option>  <option class="level-0" value="198">Adjustable Base (Twin XL)</option><option class="level-0" value="71">Bed Frame</option><option class="level-0" value="114">Blanket</option><option class="level-0" value="30">Foundation</option> <option class="level-0" value="50">Free Shipping</option> <option class="level-0" value="263">Hybrid Cal King</option> <option class="level-0" value="260">Hybrid Full</option> <option class="level-0" value="262">Hybrid King</option> <option class="level-0" value="261">Hybrid Queen</option> <option class="level-0" value="258">Hybrid Twin</option> <option class="level-0" value="259">Hybrid Twin XL</option> <option class="level-0" value="257">Mattress Cal King</option>  <option class="level-0" value="254">Mattress Full</option><option class="level-0" value="256">Mattress King</option> <option class="level-0" value="196">Mattress Protector</option> <option class="level-0" value="255">Mattress Queen</option> <option class="level-0" value="252">Mattress Twin</option>    <option class="level-0" value="253">Mattress Twin XL</option>  <option class="level-0" value="195">Memory Foam Pillow</option><option class="level-0" value="52">Pillow</option>  <option class="level-0" value="202">Platform Bed</option> <option class="level-0" value="107">Sheets</option> <option class="level-0" value="87">Topper</option> </select></div>';*/
                        varHTML += '<div class="col-md-6"><label class="control-label">Shipping Class</label></div>';
                        varHTML += '<select class="txtshipvariation form-control select2"><option value="-1">Select shipping class</option>';
                        for (var j = 0; j < _shipping_class.length; j++) {
                            varHTML += '<option value="' + _shipping_class[j].rowid + '"> ' + _shipping_class[j].name + '</option>';
                        };
                        varHTML += '</select ></div > ';
                        varHTML += '<div class="col-md-6"><label class="control-label">Product Type</label></div>';
                        varHTML += '<select class="ddlproducttypeser form-control select2"><option value="0">Select Product Type</option>';
                        for (var j = 0; j < _producttype.length; j++) {
                            varHTML += '<option value="' + _producttype[j].rowid + '"> ' + _producttype[j].name + '</option>';
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
                        varHTML += '<div class="form-check-input"><input type="checkbox" class="chkallowwebsite" id="allowwebsite"><label> &nbsp; Allow on website.</label></div>';
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
       // console.log($(this).attr("id"));
        $("#row_" + button_id + '').remove();
    });

    $(document).on('click', "#btnedit", function () {
        $("#target :input").prop("disabled", false);
        $("#tbhold").find("input,button,textarea,select").attr("disabled", false);
        $("#product_variations").find("input,button,textarea,select").attr("disabled", false);
        $("#btncancel").show();
        $("#btnedit").hide();
        $("#btnSave").show();
        $('#btnSave').text("Update");
        $("#btnSaveupdate").show();
        $('#btnSaveupdate').text("Update");
        $("#ddlProductType").prop("disabled", true);
        var urlpath = window.location.pathname;
        var pathid = urlpath.substring(urlpath.lastIndexOf('/') + 1);
        $("#btnbackcategory").prop("href", "/Product/ProductCategories/" + pathid)
        $('#btnbackcategory').attr("disabled", false);
        isEdit(true);

    });

    $(document).on('click', "#btncancel", function () {
        $("#target :input").prop("disabled", true);
        $("#tbhold").find("input,button,textarea,select").attr("disabled", true);
        $("#product_variations").find("input,button,textarea,select").attr("disabled", true);
        $("#btncancel").hide();
        $("#btnedit").show();
        $("#btnSave").hide();
        $("#btnSaveupdate").hide();
        $("#btnedit").prop("disabled", false);
        $("#ddlProductType").prop("disabled", true);
        $("#btnbackcategory").off("click").attr('href', "javascript: void(0);");
        $('#btnbackcategory').attr("disabled", "disabled");
        isEdit(false);
    });

    $(document).on('click', "#btnproductuploade", function () {
        AddProductImages();
    })

    $(document).on('click', "#btnproductuploadepopup", function () {
        AddProductpopupImages();
    })

    $(document).on('click', "#btnSave", function () {
        AddProduct();
    })
    $(document).on('click', "#btnSaveupdate", function () {
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

            $(div).find(".ddlproducttypeser").each(function () {
                _attxml.push(
                    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_product_type_id', meta_value: this.value }
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
        //console.log(_attxml.length);
        //console.log(_ItemProduct);
        //console.log(_PostTitleProduct);
        //console.log(_PriceProduct);

        //if (_attxml.length > 180) {

        //    var indexToSplit = chunkArray(_attxml, 2);
        //    console.log(indexToSplit);
        //    var first = indexToSplit[0];
        //    var second = indexToSplit[1];
        //    console.log(first);
        //    console.log(second);           
        //    var obj = {
        //        ProductPostMeta: first, ProductPostMetaExtanded: second, ProductPostItemMeta: _ItemProduct, ProductPostPostMeta: _PostTitleProduct, ProductPostPriceMeta: _PriceProduct
        //    }
        //}
        //else {
        var obj = {
            ProductPostMeta: _attxml, ProductPostItemMeta: _ItemProduct, ProductPostPostMeta: _PostTitleProduct, ProductPostPriceMeta: _PriceProduct
        }
        //}
        // console.log(obj);
        if (_attxml != '') {
            //  NOW CALL THE WEB METHOD WITH THE PARAMETERS USING AJAX.
            let less = calculateFinal();
            //console.log(less);
            if (less == 1)
                swal('Alert!', "Retail price should not be less then sale price", "error");
            else {
                var checkstr = confirm('are you sure want to save/update variations?');
                if (checkstr == true) {
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
                                swal('Success!', data.message, 'success');
                                ActivityLog('save variation for product id(' + id + ')', '/Product/AddNewProduct/' + id + '');
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

                } else {
                    return false;
                }
            }
        }
        else { alert("Fields cannot be empty.") }

    });

    $("#btnsaveAttributes").click(function (e) {
        let _list = [];       
        var _taxonomyValues = [];
        var concatenatedString = '';
        // Iterate over all elements with IDs starting with "row_"
        $('[id^="row_"]').each(function () {
            // Extract and push the data-taxonomy attribute value
            var elementId = $(this).attr('id');
            var dataTaxonomy = $(this).data('taxonomy');
            var visibilityChecked = $('#attribute_visibility\\[' + elementId.substring(4) + '\\]').prop('checked');
            var variationChecked = $('#attribute_variation\\[' + elementId.substring(4) + '\\]').prop('checked');
            var istaxonomy = $(this).data('istaxonomy');
            var position = $(this).data('position');
            var value = '';            
            if (istaxonomy == false) {
                var textareaName = 'attribute_values\\[' + elementId.substring(4) + '\\]';
                var textareaValue = $('textarea[name="' + textareaName + '"]').val();
                //console.log('Textarea Name:', textareaName);
                //console.log('Textarea Value:', textareaValue);
                value = textareaValue;
               // istaxonomy = 0;
            }
            else {
                //istaxonomy = 1;
            }
            //var selectedValues = $('select[name="attribute_values\\[' + elementId.substring(4) + '\\]"]').val();
            //concatenatedString = selectedValues.join(",");
            //var taxonomyValues = {               
            //     selectedValues
            //};
            _list.push({ name: dataTaxonomy, is_visible: visibilityChecked, is_variation: variationChecked, is_taxonomy: istaxonomy, value: value, position: position });
            // Push the object into the list
            //_list.push(elementValues);
            //_taxonomyValues.push(selectedValues);
           // taxonomyValues.push($(this).data('taxonomy'));
        });
       
        //console.log(taxonomyValues);
        //console.log(_list);         
        var serializedPhpArray = convertArrayToSerializedPHP(_list);       
        //console.log(serializedPhpArray);
        //$('.input').each(function () {
        //    if (this.value != '')
        //        values.push(this.value);
        //});

        //$('.input').each(function () {
        //    if (this.value != '')
        //        values.push(this.value);
        //});

        //$('select').on('change', function () {
        //    // Initialize an empty array to store selected values
        //    var selectedValues = [];

        //    // Iterate over all selected options within the current select element
        //    $(this).find('option:selected').each(function () {
        //        // Push the value of each selected option to the array
        //        selectedValues.push($(this).val());
        //    });

        //    // Join the array of selected values with a comma separator
        //    var result = selectedValues.join(', ');

        //    // Display the result (you can modify this part based on your needs)
        //    console.log(result);
        //});

        var selectedValues = [];

        // Iterate over all select elements within the specific div
        $('#product_attributes select').each(function () {
            // Iterate over all selected options within the current select element
            $(this).find('option:selected').each(function () {
                // Push the value of each selected option to the array
                selectedValues.push($(this).val());
            });
        });

        // Join the array of selected values with a comma separator
        var result = selectedValues.join(', ');

        // Display the result (you can modify this part based on your needs)
        


        var taxonomyValues = [];

        // Iterate over each div with class "box" inside the "product_attributes" container
        $("#product_attributes .box").each(function () {
            // Get the value of the "data-taxonomy" attribute
            var taxonomyValue = $(this).data("taxonomy");

            // Push the value to the array
            taxonomyValues.push(taxonomyValue);
        });

        // Convert the array to a comma-separated string
        var commaSeparatedValues = taxonomyValues.join(', ');


        let parentID = parseInt($("#hfid").val());
        //  console.log(values.join(','));
        //$("#hfattributeheaderval").val(values.join(','));     
        //inputchkvisible.push(true);

        //$('.inputchkvar').each(function () {
        //    //if (this.value != '')
        //    inputchkvariation.push(this.checked);
        //});

      // console.log(values);
       // if (values != '') {
            var checkstr = confirm('are you sure want to save/update Attributes?');
            if (checkstr == true) {
                //  NOW CALL THE WEB METHOD WITH THE PARAMETERS USING AJAX.
                $.ajax({
                    type: 'POST',
                    url: '/Product/saveproductAttributes',
                    data: "{'fields':'" + serializedPhpArray + "','IDs': '" + parentID.toString() + "','post_title': '" + $("#txtProductName").val() + "', 'term_taxonomy': '" + commaSeparatedValues + "','term_taxonomy_id': '" + result + "', 'producttypeID': '" + $("#ddlProductType").val() + "'}",
                    dataType: 'json',
                    headers: { "Content-Type": "application/json" },
                    beforeSend: function () {
                        $("#loader").show();
                    },
                    success: function (data) {
                        if (data.status == true) {
                            if (data.url == "Manage") {
                                //alert('d');
                                //GetProductvariationID(id);
                                swal('Success!', data.message, 'success');
                                ActivityLog('save attribute for product id(' + id + ')', '/Product/AddNewProduct/' + id + '');
                            }
                            else {
                                $("#hfUpdatedID").val(data.ID);
                                swal('Success!', data.message, 'success');
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
            } else {
                return false;
            }
        //}
        //else { alert("Fields cannot be empty.") }

    });
 
    //function convertArrayToSerializedPHP(jsonArray) {
    //    var phpArray = {};
    //    for (var i = 0; i < jsonArray.length; i++) {
    //        var obj = jsonArray[i];
    //        var nameLength = obj.name.length;
    //        var innerArray = {};

    //        for (var prop in obj) {
    //            if (obj.hasOwnProperty(prop) && typeof obj[prop] !== "object") {
    //                // For non-object properties, add them to the innerArray
    //                innerArray[prop] = "s:" + prop.length + ":\"" + prop + "\";s:" + obj[prop].toString().length + ":\"" + obj[prop] + "\";";
    //            }
    //        }
    //        phpArray["s:" + nameLength + ":\"" + obj.name + "\";"] = "s:" + nameLength + ":\"" + obj.name + "\";" + "a:" + (Object.keys(innerArray).length + 1) + ":{" + Object.values(innerArray).join("") + "}";
    //    }
    //    return "a:" + Object.keys(phpArray).length + ":{" + Object.values(phpArray).join("") + "}";
    //}


    function convertArrayToSerializedPHP(jsonArray) {
        var phpArray = {};
        for (var i = 0; i < jsonArray.length; i++) {
            var obj = jsonArray[i];
            var nameLength = obj.name.length;
            var innerArray = {};

            for (var prop in obj) {
                if (obj.hasOwnProperty(prop) && typeof obj[prop] !== "object") {
                    // For non-object properties, convert certain properties to integer
                    if (prop === "is_visible" || prop === "is_taxonomy" || prop === "is_variation") {
                         innerArray[prop] = "s:" + prop.length + ":\"" + prop + "\";i:" + ((obj[prop] === true || obj[prop] === 1) ? 1 : 0) + ";";
                     }
                    else if (prop === "position") {                       
                         innerArray[prop] = "s:" + prop.length + ":\"" + prop + "\";i:" + obj[prop]  + ";";
                     }
                    else {
                        innerArray[prop] = "s:" + prop.length + ":\"" + prop + "\";s:" + obj[prop].toString().length + ":\"" + obj[prop] + "\";";
                    }
                }
            }

            phpArray["s:" + nameLength + ":\"" + obj.name + "\";"] = "s:" + nameLength + ":\"" + obj.name + "\";" + "a:" + (Object.keys(innerArray).length + 1) + ":{" + Object.values(innerArray).join("") + "}";
        }

        return "a:" + Object.keys(phpArray).length + ":{" + Object.values(phpArray).join("") + "}";
    }


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

    //$("input[name = txtregularvar]").change(function () {
    //    //alert("The text has been changed.");
    //    calculateFinal();
    //});

    //$("#product_variations > div.d-flex").each(function (index, div) {
    //    $(div).find("input[name = txtregularvar]").each(function () {

    //        let reg = this.value;
    //        //console.log(reg);
    //        //_attxml.push(
    //        //    { post_id: $(div).find('.nmvariationid').val(), meta_key: '_regular_price', meta_value: this.value }
    //        //);
    //    });
    //});

    $("#product_variations").find(".rowCalulate").change(function () { calculateFinal(); });

    $('select[name^="attribute_values"]').select2({
        allowClear: true, minimumInputLength: 0, multiple: true,
        ajax: {
            url: '/Product/GetTaxonomyTerms', type: "get", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) {
                var obj = { taxonomy: $(this).data('taxonomy') || '-', query: params.term || '' }; return obj;
            },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.name, name: item.name, id: item.term_taxonomy_id } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
});

function Getproducttype() {
    let _producttype = [];
    $.ajaxSetup({ async: false, beforeSend: function (xhr) { } });
    $.get('/Product/Getproducttype', {}, function (data) {
        data = data ? JSON.parse(data) : {}; _producttype = data;
    }).fail(function (jqXHR, textStatus, errorThrown) { }).always(function () { });
    return _producttype;
}
function Getsimpalproducttype() {
    $.ajaxSetup({ async: false, beforeSend: function (xhr) { } });
    $.get('/Product/Getproducttype', {}, function (data) {
        data = data ? JSON.parse(data) : {};
        $('#ddlproducttypesimpal').append('<option value="0">Please Select Product Type</option>');
        for (var i = 0; i < data.length; i++) {
            $('#ddlproducttypesimpal').append('<option value="' + data[i].rowid + '">' + data[i].name + '</option>');
        }
    }).fail(function (jqXHR, textStatus, errorThrown) { }).always(function () { });
}

//$("#product_variations").find(".rowCalulate").change(function () { calculateFinal(); });

function calculateFinal() {
    let less = 0;
    $("#product_variations > div.d-flex").each(function (index, row) {
        let rPrice = 0.00, salpri = 0.00;
        rPrice = parseFloat($(row).find("[name=txtregularvar]").val()) || 0.00;
        salpri = parseFloat($(row).find("[name=txtSalepricevariation]").val()) || 0.00;
        //console.log(rPrice);
        //console.log(salpri);
        if (salpri > rPrice) {
            if (salpri == rPrice) {
            }
            else {
                swal('Alert!', "Retail price should not be less then sale price", "error");
                less = 1;
                $(row).find("[name=txtregularvar]").focus();
                $(row).find("[name=txtSalepricevariation]").focus();
                //parseFloat($(row).find("[name=txtregularvar]").val(0.00));
                // parseFloat($(row).find("[name=txtSalepricevariation]").val(0.00));
            }
        }
    });
    return less;

}


$('#chkgiftcard').change(function () {
    if ($(this).prop("checked")) {
        // console.log('s');
        $('#divdayexpire').show();
        $('#divRecipientemail').show();
    } else {
        // console.log('N');
        $('#divdayexpire').hide();
        $('#divRecipientemail').hide();
    }
});

function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#show_picture').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);

    }
}
function readURLpopup(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#show_picturepopup').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);

    }
}
function readURLvarition(input, Id) {
    //console.log(input.files);
    // console.log(Id);
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            // console.log(e.target.result);
            $('#show_pictureVar_' + Id + '').attr('src', e.target.result);
            // $("#show_pictureVar" + data[i].id).val(v_data['_backorders']).trigger('change');
        };
        reader.readAsDataURL(input.files[0]);

    }
}

function readURLvaritionpopum(input, Id) {
    //console.log(input.files);
    // console.log(Id);
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            // console.log(e.target.result);
            $('#show_pictureVarpopup_' + Id + '').attr('src', e.target.result);
            // $("#show_pictureVar" + data[i].id).val(v_data['_backorders']).trigger('change');
        };
        reader.readAsDataURL(input.files[0]);

    }
}

function UpdateImagevarition(input, Id) {
    ID = Id;
    var file = document.getElementById("ImageFileVariation_" + Id + "").files[0];
    var obj = new FormData();
    obj.append("ImageFile", file);
    obj.append("ID", ID);

    $.ajax({
        url: '/Product/ProductImages/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: obj,
        processData: false,
        contentType: false,
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            if (data.status == true) {
                swal('Success!', data.message, 'success');
            }
            else { swal('Alert!', data.message, 'error') }
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', error.message, 'error'); },
    })
}

function UpdateImagevaritionpopup(input, Id) {
    ID = Id;
    var file = document.getElementById("ImageFileVariationpopup_" + Id + "").files[0];
    var obj = new FormData();
    obj.append("ImageFile", file);
    obj.append("ID", ID);

    $.ajax({
        url: '/Product/ProductPopupImages/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: obj,
        processData: false,
        contentType: false,
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            if (data.status == true) {
                swal('Success!', data.message, 'success');
            }
            else { swal('Alert!', data.message, 'error') }
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', error.message, 'error'); },
    })
}

function AddProductImages() {
    ID = $("#hfid").val();
    var file = document.getElementById("ImageFile").files[0];
    var obj = new FormData();
    obj.append("ImageFile", file);
    obj.append("ID", ID);

    $.ajax({
        url: '/Product/ProductImages/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: obj,
        processData: false,
        contentType: false,
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            if (data.status == true) {
                swal('Success!', data.message, 'success');
            }
            else { swal('Alert!', data.message, 'error') }
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', error.message, 'error'); },
    })
}

function AddProductpopupImages() {
    ID = $("#hfid").val();
    var file = document.getElementById("ImageFilepopup").files[0];
    var obj = new FormData();
    obj.append("ImageFile", file);
    obj.append("ID", ID);

    $.ajax({
        url: '/Product/ProductPopupImages/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: obj,
        processData: false,
        contentType: false,
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            if (data.status == true) {
                swal('Success!', data.message, 'success');
            }
            else { swal('Alert!', data.message, 'error') }
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', error.message, 'error'); },
    })
}

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
    //console.log(categorydata);
    let date_publish = $("#txtPublishDate").val().split('/');
    //if ($("#enableStock").prop('checked') == true)
    enableStock = "yes";
    //else
    //enableStock = "no";

    if ($("#chkgiftcard").prop('checked') == true)
        giftcard = "yes";
    else
        giftcard = "no";
    Recipientemail = $("#ddlRecipientemail").val();
    dayexpire = $("#txtdaysexpire").val();

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
    pdstatus = $("#ddlstatus").val();
    ddlsimpalprodcttype = $("#ddlproducttypesimpal").val();
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
    else if (regularprice == "" && ProductTypeval != "variable") {
        swal('Alert', 'Please Enter Regular price', 'error').then(function () { swal.close(); $('#txtregularprice').focus(); });
    }
    else if (categorydataval == "") {
        swal('Alert', 'Please Select Category', 'error').then(function () { swal.close(); $('#chkproducttype').focus(); });
    }
    else if (sku == "") {
        swal('Alert', 'Please Enter SKU', 'error').then(function () { swal.close(); $('#txtsku').focus(); });
    }
    else if (date_publish == "" || date_publish == "undefined//undefined") {
        swal('Alert', 'Please Enter Publish date', 'error').then(function () { swal.close(); $('#txtPublishDate').focus(); });
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
            PublishDate: date_publish,
            _gift_card: giftcard,
            _gift_card_expiration_days: dayexpire,
            _gift_card_template_default_use_image: Recipientemail,
            post_status: pdstatus,
            _product_type_id: ddlsimpalprodcttype
        }
        var checkstr = confirm('Want to save/update product?');
        if (checkstr == true) {
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
                            swal('Success!', data.message, 'success').then((result) => { location.href = '../ListProduct'; });
                        }
                        else {
                            $('#fetch_results > input:text').val('');
                            swal('Success!', data.message, 'success').then((result) => { location.href = 'ListProduct'; });
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
                    isEdit(false);
                },
                error: function (error) {
                    swal('Error!', 'something went wrong', 'error');
                },
            })
        } else {
            return false;
        }
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
            data = JSON.parse(data); //console.log(data)
            $("#txtProductName").val(data.post_title);
            $("#hftitle").val(data.post_title);
            $("#formatcustom").val(data.post_content);
            if (data.product_type == null) $('#ddlProductType').val('simple').trigger('change');
            else $('#ddlProductType').val(data.product_type).trigger('change');
            if ($("#ddlProductType").val() == "variable") {
                $('#divregular,#divsale,#divproducttypesimpal').hide();
                $('dvstock_status').hide();
                $('li:contains(Variations)').show();
            }
            else {
                $('#divregular,#divsale,#divproducttypesimpal').show();
                $('dvstock_status').show();
                $('li:contains(Variations)').hide();
            }
            //General
            $("#txtregularprice").val(data.regular_price);
            $("#txtsaleprice").val(data.sale_price);
            if (data.axstatus == "" || data.taxclass == null) $('#ddltaxstatus').val("taxable").trigger('change');
            else $('#ddltaxstatus').val(data.tax_status).trigger('change');

            if (data.taxclass == "" || data.taxclass == null) $('#ddlclasstax').val("standard").trigger('change');
            else $('#ddlclasstax').val(data.tax_class).trigger('change');
            if (data.Publish_Date != null) $('#txtPublishDate').val(data.Publish_Date);
            $('#ddlstatus').val(data.post_status).trigger('change');
            if ((parseInt(data.product_type_id) || 0) == 0) $('#ddlproducttypesimpal').val("1").trigger('change');
            else $('#ddlproducttypesimpal').val(data.product_type_id).trigger('change');
            //Inventory or SKU
            $("#txtsku").val(data.sku);
            if (data.manage_stock == "yes") { $("#enableStock").prop("checked", true); $('#dvsock').show(); }
            else { $('#dvsock').hide(); }
            $("#txtStockquantity").val(data.stock);
            $('#txtallowbackorders').val(data.backorders).trigger('change');
            $("#txtLowstockthreshold").val(data.low_stock_amount);
            $('#ddlstockstatus').val(data.stock_status.trim()).trigger('change');
            if (data.sold_individually == "yes") $("#solidIndividually").prop("checked", true);
            //Shipping
            $("#weight_unit").html(`Weight (${data.weight_unit})`), $("#dimension_unit").val(`Dimensions (${data.dimension_unit})`);
            $("#txtweigh").val(data.weight);
            $("#txtLength").val(data.length);
            $("#txtWidth").val(data.width);
            $("#txtHeight").val(data.height);

            if (data.giftcard == "yes") {
                $("#chkgiftcard").prop("checked", true);
                $('#divdayexpire').show();
                // $('#divRecipientemail').show();
                $("#txtdaysexpire").val(i[0].expirationdayes);
                $('#ddlRecipientemail').val(i[0].gifttemplate.trim()).trigger('change');
            }
            else {
                $('#divdayexpire').hide();
                $('#divRecipientemail').hide();
            }
            $('#chkgiftcard').change();

            $("#hfvproductattributes").val(data.attributes);
            $("#hfproductvariationID").val(data.variations);
            $("#hfprodectcategoryid").val(data.categories);
            $("#hfcategid").val(data.crosssellids);
            $("#hfprodcid").val(data.upsellids);
            GetAttributesID(data.attributes);
            //var category = i[0].CategoryID;
            //if (category != null) {
            //    var temp = new Array();
            //    var temp = category.split(",");
            //    $('#tblprodctype').find('input[type="checkbox"]').each(function (i, item) {
            //        if (temp.includes($(item).val()))
            //            $(item).prop('checked', true);
            //    });
            //}
            var path = data.image;
            url = "../../Content/Product/" + path + "";
            if (path != null) { $('#show_picture').attr('src', url); }
            else if (path == null || path == "") { $('#show_picture').attr('src', "../../Content/ProductCategory/default.png"); }
            else { $('#show_picture').attr('src', "../../Content/ProductCategory/default.png"); }
            //console.log(i[0].guid);
            //console.log(path);      

            //// var result = checkFileExist(url);
            ////// console.log(result);

            //// if (path.indexOf('laylasleep.com') != -1) {
            ////   //  console.log('sddd');
            ////     $('#show_picture').attr('src', "../../Content/ProductCategory/default.png");
            //// }
            //// else {
            ////if (path.indexOf('product') == -1)
            ////    var result = checkFileExist(url);
            ////if (path.indexOf('product') != -1) {
            ////    $('#show_picture').attr('src', "../../Content/ProductCategory/default.png");
            ////}
            ////else {

            // var result = checkFileExist(url);



            // var pathimg = i[0].image;
            // urlimg = "../../Content/Product/" + pathimg + "";

            //// var resultimg = checkFileExist(urlimg);
            // if (pathimg != null) {

            //     $('#show_picturepopup').attr('src', urlimg);

            // }
            // else if (pathimg == null || pathimg == "") {
            //     $('#show_picturepopup').attr('src', "../../Content/ProductCategory/default.png");

            // }
            // else {
            //     $('#show_picturepopup').attr('src', "../../Content/ProductCategory/default.png");
            // }

            //}
            setTimeout(function () { getfillshiping(data.shippingclassID); }, 11000);
            //$('#ddlShipping').val(47).trigger('change');

            // $('#ddlShipping').val(i[0].shippingclassID).trigger('change');
        },
        error: function (msg) { alert(msg); },
        async: false
    });

}
function getfillshiping(shipping) {
    $('#ddlShipping').val(shipping).trigger('change');
};

function checkFileExist(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();

    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
}

function GetProdctByID(ProdctID) {
    $.ajaxSetup({ async: false, beforeSend: function (xhr) { } });
    $.post('/Product/GetProdctByID', { strVal: ProdctID }, function (data) {
        data = data ? JSON.parse(data) : {};
        for (var i = 0; i < data.length; i++) {
            $("#ddlUpsells").append('<option value="' + data[i].id + '" selected>' + data[i].Name + '</option>');
        }
    }).fail(function (jqXHR, textStatus, errorThrown) { console.log(jqXHR, textStatus, errorThrown); }).always(function () { });
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
    //console.log(Attributes);
    $.each(Attributes, function (i, v) {
        let _tr = `<div id="row_${i}" class="box box-primary" data-position="${v.position}" data-istaxonomy="${v.is_taxonomy}" data-taxonomy="${v.taxonomy_name}">`;
        _tr += `    <div class="box-header with-border"><h3 class="panel-title" id="heading_${i}" ><a data-toggle="collapse" data-parent="#accordion" href="#collapse_${i}" aria-expanded="false" class="collapsed">${v.display_name}</a></h2><div class="box-tools pull-right"><button type="button" class="btn btn-default btn-sm btn_remove" id="${i}"><i class="fa fa-trash text-red"></i></button></div></div>`;
        _tr += `    <div id="collapse_${i}" class="panel-collapse collapse in" aria-labelledby="heading_${i}" data-bs-parent="#tbhold">`;
        _tr += '        <div class="box-body">';
        _tr += '            <div class="row">';
        if (v.is_taxonomy) {
            //console.log(v.is_variation);
            _tr += `            <div class="col-md-6"><div class="form-group"><label class="control-label">Name:</label><strong class="attribute_name">${v.display_name}</strong><div class="form-check"><input type="checkbox" class="form-check-input" id="attribute_visibility[${i}]" checked="${v.is_visible}"><label for="attribute_visibility[${i}]">Visible on the product page</label></div><div class="form-check"><input type="checkbox" class="checkbox" id="attribute_variation[${i}]" ${v.is_variation === 1 ? 'checked' : ''}><label for="attribute_variation[${i}]">Used for variations</label></div></div></div>`;
            _tr += `            <div class="col-md-6"><div class="form-group"><label class="control-balel">Value(s):</label><select name="attribute_values[${i}]" class="form-control" data-taxonomy="${v.taxonomy_name}" style="width:100%;" multiple>`;
            $.each(v.option, function (j, option) { _tr += `<option value="${option.term_taxonomy_id}" selected="selected">${option.name}</option>`; });
            _tr += `            </select></div></div>`;
        }
        else {

            _tr += `            <div class="col-md-6"><div class="form-group"><label class="control-label">Name:</label><input type="text" class="input form-control" name="attribute_names[0]" value="${v.display_name}"><div class="form-check"><input type="checkbox" class="form-check-input" id="attribute_visibility[${i}]" checked="${v.is_visible}"><label for="attribute_visibility[${i}]">Visible on the product page</label></div><div class="form-check"><input type="checkbox" class="checkbox" id="attribute_variation[${i}]" ${v.is_variation === 1 ? 'checked' : ''}><label for="attribute_variation[${i}]">Used for variations</label></div></div></div>`;
            _tr += `            <div class="col-md-6"><div class="form-group"><label class="control-balel">Value(s):</label><textarea placeholder="Enter some text, or some attributes by | separating values." class="inputdes form-control" name="attribute_values[${i}]" >${v.option}</textarea></div></div>`;
        }
        _tr += '            </div>';
        _tr += '        </div>';
        _tr += '    </div>';
        _tr += '</div>';

        //let _tr = `<tr id="row_${i}" class="row" data-taxonomy="${v.taxonomy_name}">`;
        //if (v.is_taxonomy = 1) {
        //    _tr += `<td class="col-md-6"><div class="form-group"><label class="control-label">Name:</label><strong class="attribute_name">${v.display_name}</strong><div class="form-check"><input type="checkbox" class="form-check-input" id="attribute_visibility[${i}]" checked="${v.is_visible}"><label for="attribute_visibility[${i}]">Visible on the product page</label></div><div class="form-check"><input type="checkbox" class="checkbox" id="attribute_variation[${i}]" value="${v.is_variation}"><label for="attribute_variation[${i}]">Used for variations</label></div></div></td>`;
        //    _tr += `<td class="col-md-6"><div class="form-group"><label class="control-balel">Value(s):</label><select name="attribute_values[${i}]" class="form-control" data-taxonomy="${v.taxonomy_name}" style="width:100%;" multiple>`;
        //    $.each(v.option, function (j, option) { _tr += `<option value="${option.term_taxonomy_id}" selected="selected">${option.name}</option>`; });
        //    _tr += `</select></div></td>`;
        //}
        //else {
        //    _tr += `<td class="col-md-6"><div class="form-group"><label class="control-label">Name:</label><input type="text" class="input form-control" name="attribute_names[0]" value="${v.display_name}"><div class="form-check"><input type="checkbox" class="form-check-input" id="attribute_visibility[${i}]" checked="${v.is_visible}"><label for="attribute_visibility[${i}]">Visible on the product page</label></div><div class="form-check"><input type="checkbox" class="checkbox" id="attribute_variation[${i}]" value="${v.is_variation}"><label for="attribute_variation[${i}]">Used for variations</label></div></div></td>`;
        //    _tr += `<td class="col-md-6"><div class="form-group"><label class="control-balel">Value(s):</label><textarea placeholder="Enter some text, or some attributes by | separating values." class="inputdes form-control" name="attribute_values[${i}]" >${v.value}</textarea></div></td>`;
        //}
        //_tr += '</tr>';

        $("#product_attributes").append(_tr);
        //var datalog = JSON.parse(Attributes);
        //$("#tbhold").append('<tr id="row' + i + '"><td><div class="col-md-12"> <label>Name:</label><br /><input type="text"  class="input" id=tb' + itxtCnt + ' value="' + datalog[index1].key + '" /><br /><input type="checkbox" class="inputchk" id=tb' + itxtCnt + ' value=""/><label>Visible on the product page</label><br /> <input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + '  value=""/><label>Used for variations</label></div></td><td><br /><br /><div class="col-md-12"><label>Value(s):</label><input type="text" placeholder="Enter some text, or some attributes by "|" separating values." style="width: 100%; height: 110px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;" class="inputdes" id=tb' + itxtCnt + ' value="' + datalog[index1].value + '" /></div></td><td><button type="button" class="btn btn-danger btn_remove" id="' + i + '" name="remove">X</button></td></tr>');
        //$("#tbhold").append('<tr id="row' + i + '"><td><div class="col-md-12"> <label>Name:</label><br /><input type="text"  class="input" id=tb' + itxtCnt + ' value="' + datalog[index1].key + '" /><br /><input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + '  value=""/><label>Used for variations</label></div></td><td><br /><br /><div class="col-md-12"><label>Value(s):</label><input type="text" placeholder="Enter some text, or some attributes by "|" separating values." style="width: 100%; height: 110px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;" class="inputdes" id=tb' + itxtCnt + ' value="' + datalog[index1].value + '" /></div></td><td><button type="button" class="btn btn-danger btn_remove" id="' + i + '" name="remove">X</button></td></tr>');
        //$("#tbhold").append(`<tr id="row_${i}"><td><div class="form-group"><label class="control-label">Name:</label><input type="text" class="input form-control" id="tb_${i}" value="${v.name}" /><span><input type="checkbox" class="inputchkvar" id="tb_${i}" value=""/><label for="tb_${i}">Used for variations</label></div></td><td><div class="form-group"><label class="control-balel">Value(s):</label><textarea placeholder="Enter some text, or some attributes by | separating values." class="inputdes form-control" id=tb >${v.value}</textarea></div></td><td><button type="button" class="btn no-btn btn_remove" id="${i}" name="remove">X</button></td></tr>`);
    });

    //if (Attributes != null) {
    //    var itxtCnt = 0;
    //    var ID = Attributes;
    //    //i++;
    //    var i = 1;
    //    itxtCnt = itxtCnt + 1;
    //    //  var trainindIdArray = Attributes.split(',{'); 
    //    $.each(JSON.parse(Attributes), function (index1, value) {
    //        var datalog = JSON.parse(Attributes);
    //        // $("#tbhold").append('<tr id="row' + i + '"><td><div class="col-md-12"> <label>Name:</label><br /><input type="text"  class="input" id=tb' + itxtCnt + ' value="' + datalog[index1].key + '" /><br /><input type="checkbox" class="inputchk" id=tb' + itxtCnt + ' value=""/><label>Visible on the product page</label><br /> <input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + '  value=""/><label>Used for variations</label></div></td><td><br /><br /><div class="col-md-12"><label>Value(s):</label><input type="text" placeholder="Enter some text, or some attributes by "|" separating values." style="width: 100%; height: 110px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;" class="inputdes" id=tb' + itxtCnt + ' value="' + datalog[index1].value + '" /></div></td><td><button type="button" class="btn btn-danger btn_remove" id="' + i + '" name="remove">X</button></td></tr>');
    //        //$("#tbhold").append('<tr id="row' + i + '"><td><div class="col-md-12"> <label>Name:</label><br /><input type="text"  class="input" id=tb' + itxtCnt + ' value="' + datalog[index1].key + '" /><br /><input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + '  value=""/><label>Used for variations</label></div></td><td><br /><br /><div class="col-md-12"><label>Value(s):</label><input type="text" placeholder="Enter some text, or some attributes by "|" separating values." style="width: 100%; height: 110px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;" class="inputdes" id=tb' + itxtCnt + ' value="' + datalog[index1].value + '" /></div></td><td><button type="button" class="btn btn-danger btn_remove" id="' + i + '" name="remove">X</button></td></tr>');
    //        $("#tbhold").append('<tr id="row' + i + '"><td><div class="form-group"><label class="control-label">Name:</label><input type="text" class="input form-control" id=tb' + itxtCnt + ' value="' + datalog[index1].key + '" /><span><input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + ' value=""/><label for=tb' + itxtCnt + '>Used for variations</label></div></td><td><div class="form-group"><label class="control-balel">Value(s):</label><textarea placeholder="Enter some text, or some attributes by | separating values." class="inputdes form-control" id=tb' + itxtCnt + ' >' + datalog[index1].value + '</textarea></div></td><td><button type="button" class="btn no-btn btn_remove" id="' + i + '" name="remove">X</button></td></tr>');
    //    });
    //    // $('.inputchk').prop("checked", true);
    //    $('.inputchkvar').prop("checked", true);
    //}
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
    $("#product_variations").empty();
    let _shipping_class = GetShippingClass();
    let _producttype = Getproducttype();
    var obj = { strVal: ProductID }
    $.ajax({
        url: '/Product/Getvariationdetailsbyid', type: 'post', contentType: "application/json; charset=utf-8", dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            //console.log(data);

            if (data.length > 0) {
                //var variationAttributes = data[0].attributes.filter(function (attribute) {
                //    return attribute.is_variation === 1;
                //});

                //// Loop through each variation attribute
                //variationAttributes.forEach(function (attribute) {
                //    console.log(attribute);

                //    var selectHTML = '<select  class="inputddl">';
                //    selectHTML += '<option value="">' + 'No default ' +attribute.display_name + '</option>';
                //    // Loop through options for the current attribute
                //    attribute.option.forEach(function (option) {
                //        // Create an option element for each option                
                //        selectHTML += '<option value="' + option.term_id + '">' + option.name + '</option>';
                //    });

                //    // Close the select element
                //    selectHTML += '</select>';

                //    // Append the select element to the product_variations div
                //    $("#product_variations").append(selectHTML);
                //});
                var variationAttributes = data[0].attributes.filter(function (attribute) {
                    return attribute.is_variation === 1;
                });

                // Loop through each variation attribute
                variationAttributes.forEach(function (attribute) {
                    // console.log(attribute);

                    var selectHTML = '<select class="inputddl">';
                    selectHTML += '<option value="">' + 'No default ' + attribute.display_name + '</option>';

                    // Check if the options are provided as a string or an array
                    if (typeof attribute.option === 'string') {
                        // Split the string into an array using the pipe (|) as the delimiter
                        var optionsArray = attribute.option.split('|');

                        // Trim each option to remove leading and trailing whitespaces
                        optionsArray = optionsArray.map(function (option) {
                            return option.trim();
                        });

                        // Loop through the options and create option elements
                        optionsArray.forEach(function (option) {
                            selectHTML += '<option value="' + option + '">' + option + '</option>';
                        });
                    } else if (Array.isArray(attribute.option)) {
                        // Loop through options for the current attribute
                        attribute.option.forEach(function (option) {
                            // Create an option element for each option
                            selectHTML += '<option value="' + option.term_id + '">' + option.name + '</option>';
                        });
                    }

                    // Close the select element
                    selectHTML += '</select>';

                    // Append the select element to the product_variations div
                    $("#product_variations").append(selectHTML);
                });
                let varHTML = '', attHTML = '';
                for (let i = 0; i < data.length; i++) {
                    let v_data = JSON.parse(data[i].meta_data);
                    //console.log('6666',v_data);
                    let allowwebsite = '';
                    if (v_data['_allowwebsite'] != "" && v_data['_allowwebsite'] != undefined)
                        allowwebsite = v_data['_allowwebsite'];
                    let sku = '';
                    if (v_data['_sku'] != undefined)
                        sku = v_data['_sku'];
                    else
                        sku = 0;
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
                    varHTML += '<input type="text" style="background-color: #EBEBE4" readonly class="nmvariationid" id="hfvariationid" value="' + data[i].id + '">';

                    varHTML += '<div class="alignleft actions bulkactions">';
                    varHTML += '<table class="data-contacts1-js table table-striped"><tbody class="variation_att">';
                    //console.log(v_data);
                    var vAttributes = data[i].attributes.filter(function (attribute) {
                        return attribute.is_variation === 1;
                    });
                    //let sel_val = v_data['attribute_' + value.key.trim().toLowerCase()];

                    variationAttributes.forEach(function (attribute) {
                        //varHTML += '<tr><select style="pointer-events: none;background-color: #EBEBE4" class="inputddl" id="ddl_attribute_' + data[i].id + '" data-key="' + attribute.display_name + '">';
                        //varHTML += '<option value="">' + 'Any ' + attribute.display_name + '</option>';
                        //// Loop through options for the current attribute
                        //attribute.option.forEach(function (option) {
                        //    // Create an option element for each option                
                        //    varHTML += '<option value="' + option.term_id + '">' + option.name + '</option>';
                        //});

                        // Close the select element


                        varHTML += '<tr><select style="pointer-events: none;background-color: #EBEBE4" class="inputddl" id="ddl_attribute_' + data[i].id + '" data-key="' + attribute.display_name + '">';
                        varHTML += '<option value="">' + 'Any ' + attribute.display_name + '</option>';
                        let formattedString = attribute.display_name.trim().replace(/ /g, '-').toLowerCase();
                        let sel_val = v_data['attribute_' + formattedString];
                       // console.log('displaynm', attribute.display_name);
                        // console.log(sel_val);
                        // Check if the options are provided as a string or an array
                        if (typeof attribute.option === 'string') {
                            // Split the string into an array using the pipe (|) as the delimiter
                            var optionsArray = attribute.option.split('|');

                            // Trim each option to remove leading and trailing whitespaces
                            optionsArray = optionsArray.map(function (option) {
                                return option.trim();
                            });

                            // Loop through the options and create option elements
                            optionsArray.forEach(function (option) {
                                //console.log('9898', option);
                                //varHTML += '<option value="' + option + '">' + option + '</option>';
                                varHTML += '<option value="' + option + '" ' + (sel_val === option ? 'selected' : '') + '>' + option + '</option>';

                            });
                        } else if (Array.isArray(attribute.option)) {
                            // Loop through options for the current attribute
                            attribute.option.forEach(function (option) {
                                // Create an option element for each option
                                // varHTML += '<option value="' + option.term_id + '">' + option.name + '</option>';
                                varHTML += '<option value="' + option.term_id + '" ' + (sel_val === option.term_id ? 'selected' : '') + '>' + option.name + '</option>';

                            });
                        }

                        // Close the select element
                        varHTML += '</select></tr>';

                    });

                    //$.each(JSON.parse($("#hfvproductattributes").val()), function (key, value) {
                    //    let _values = value.value.split('|'); let sel_val = v_data['attribute_' + value.key.trim().toLowerCase()];
                    //    varHTML += '<tr><select style="pointer-events: none;background-color: #EBEBE4" class="inputddl" id="ddl_attribute_' + value.key.trim() + '" data-key="' + value.key.trim() + '"><option value="' + value.key.trim() + '">Any ' + value.key.trim() + '</option>';
                    //    for (let j = 0; j < _values.length; j++) {
                    //        varHTML += '<option value="' + _values[j].trim() + '" ' + (sel_val == _values[j].trim() ? 'selected' : '') + '> ' + _values[j].trim() + '</option>';
                    //    }
                    //    varHTML += '</select></tr>';
                    //});
                    varHTML += '&nbsp;&nbsp;<label class="control-label">SKU</label><input id="varsku" style="background-color: #EBEBE4" readonly type="text" class="skucval" value="' + sku + '">'
                    varHTML += '</tbody></table>';
                    varHTML += '</div>';
                    varHTML += '<div class="a-float-right" id="angle-box"> <span><i class="fa fa-angle-down" aria-hidden="true"></i></span></div>';
                    varHTML += '</div>';
                    varHTML += '</div >';
                    varHTML += '<div class="varient-box">';
                    varHTML += '<div class="form-group d-flex">';
                    varHTML += '<div class="col-md-6"></div><div class="col-md-6"></div>';
                    varHTML += '</div>';
                    varHTML += '<div>';
                    varHTML += '<div class="form-group d-flex">';
                    varHTML += '<div class="col-sm-3">';
                    varHTML += '<label class="control-label">Product Image</label>';
                    varHTML += '</div>';
                    varHTML += '<div class="col-sm-3">';
                    varHTML += '</div>';
                    varHTML += '</div>';
                    varHTML += '<div class="form-group d-flex profile-flex col-12">';
                    varHTML += '<div class="col">';
                    varHTML += '<div class="add-profile">';
                    varHTML += '<span class="edit-pic-profile">';
                    varHTML += '<input type="file" onchange="readURLvarition(this,' + data[i].id + ');" name="ImageFileVariation" id="ImageFileVariation_' + data[i].id + '" class="inputfile" />';
                    varHTML += '<label for="ImageFileVariation_' + data[i].id + '"><i class="fa fa-edit"></i>Edit</label>';
                    varHTML += '</span>';
                    varHTML += '<img runat="server" id="show_pictureVar_' + data[i].id + '" class="profile-user-img img-responsive img-circle" src="../../Content/Product/default.png" alt="Product Thumbnails">';
                    varHTML += '</div>';
                    varHTML += '</div>';
                    varHTML += '<div class="col">';
                    // varHTML += '<button type="button" id="btnproductVariation_' + data[i].id + '" onchange="UpdateImagevarition(this,' + data[i].id +');" title="Click here to Upload" data-toggle="tooltip" style="float: left;" class="control-label">Upload</button>';
                    varHTML += '<a href="javascript:void(0);" title="Click here to upload" data-toggle="tooltip" class="editbutton btn btn-danger" onClick="UpdateImagevarition(this,' + data[i].id + ')"><i>Upload</i></a>';
                    varHTML += '</div>';
                    varHTML += '</div>';


                    varHTML += '<div class="form-group d-flex mt-25">';
                    varHTML += '    <div class="col-md-6"><label class="control-label">Retail Price($)</label><input type="text" name="txtregularvar" class="form-control rowCalulate" placeholder="Variation price *" value="' + v_data['_regular_price'] + '"></div>';
                    varHTML += '<div class="col-md-6"><label class="control-label">Sale Price($)</label><input type="text" name="txtSalepricevariation" class="form-control rowCalulate" value="' + sale_price + '"></div>';
                    varHTML += '</div>';
                    varHTML += '<div id="divmargin">';
                    varHTML += '<div class="form-group d-flex mt-25"><div class="col-md-4"><label class="control-label">Retail Margin (Default)</label><input readonly type="text" name="txtmargine" class="form-control " value="' + data[i].regularMargin.toFixed(2) + '"></div><div class="col-md-2"><label class="control-label">Margin (%)</label><input readonly type="text" name="txtmarginepersantage" class="form-control " value="' + data[i].regularmarginpersantage.toFixed(2) + '"></div><div class="col-md-4"><label class="control-label">Sale Margin (Default)</label><input readonly type="text" name="txtmargine" class="form-control " value="' + data[i].Margin.toFixed(2) + '"></div><div class="col-md-2"><label class="control-label">Margin (%)</label><input readonly type="text" name="txtmarginepersantage" class="form-control " value="' + data[i].marginpersantage.toFixed(2) + '"></div>';
                    varHTML += '</div>';
                    varHTML += '<div id="divstock">';
                    varHTML += '<div class="form-group d-flex mt-25"><div style="display:none" class="col-md-6"><label class="control-label">Stock quantity</label><input type="text" name="txtStockquantityvariation" class="form-control" value="' + stock + '"></div><div class="col-md-6"> <label class="control-label">Allow backorders?</label> <select class="txtallowbackordersvariation form-control" id="ddlallow_' + data[i].id + '"> <option value="no">Do not allow</option> <option value="notify">Allow, but notify customer</option><option value="yes">Allow</option></select> </div>';
                    varHTML += '</div>    <div id="divaria">';
                    varHTML += '<div class="form-group d-flex"><div class="col-md-6"><label class="control-label">Weight (lbs)</label><input type="text" name="txtweightvariation" class="form-control" placeholder="Weight (lbs)" value="' + weight + '"></div><div class="col-md-6"><label class="control-label">Dimensions (L x W x H) (in)</label><div class="weight-box"><div class="col-md-4"><input type="text" name="txtLvariation" class="form-control" placeholder="L" value="' + length + '"></div><div class="col-md-4"><input type="text" name="txtWvariation" class="form-control" placeholder="W" value="' + width + '"></div><div class="col-md-4"> <input type="text" name="txtHvariation" class="form-control" placeholder="H" value="' + height + '"></div></div></div></div>';
                    varHTML += '</div>';
                    varHTML += '    <div class="form-group d-flex">';
                    varHTML += '        <div class="col-md-6"><label class="control-label">Shipping Class</label>';
                    varHTML += '<select class="txtshipvariation form-control select2" id="ddlsv_' + data[i].id + '"><option value="-1">Select shipping class</option>';
                    for (var j = 0; j < _shipping_class.length; j++) {
                        if (data[i].shippingclass == _shipping_class[j].rowid)
                            varHTML += '<option value="' + _shipping_class[j].rowid + '" selected> ' + _shipping_class[j].name + '</option>';
                        else
                            varHTML += '<option value="' + _shipping_class[j].rowid + '"> ' + _shipping_class[j].name + '</option>';
                    };
                    varHTML += '</select></div> ';
                    //varHTML += '        <div class="col-md-6"><label class="control-label">Product Type</label>';
                    //varHTML += '<select class="ddlproducttypeser form-control select2" id="ddlpdtype_' + data[i].id + '"><option value="0">Select Product Type</option>';
                    //for (var j = 0; j < _producttype.length; j++) {
                    //    if (v_data['_product_type_id'] == _producttype[j].rowid)
                    //        varHTML += '<option value="' + _producttype[j].rowid + '" selected> ' + _producttype[j].name + '</option>';
                    //    else
                    //        varHTML += '<option value="' + _producttype[j].rowid + '"> ' + _producttype[j].name + '</option>';
                    //};
                    //varHTML += '</select></div> ';
                    varHTML += '        <div class="col-md-8"><label class="control-label">Stock status</label>';
                    varHTML += '<select class="ddlproducttypeser form-control select2" id="ddlpdtype_' + data[i].id + '"><option value="0">Select Stock status</option>';
                    //for (var j = 0; j < _producttype.length; j++) {
                    //    if (v_data['_product_type_id'] == _producttype[j].rowid)
                    varHTML += '<option value="instock" selected="selected">In stock</option>';
                    varHTML += '<option value="outofstock">Out of stock</option>';
                    varHTML += '<option value="onbackorder">On backorder</option>';
                    // else
                    //varHTML += '<option value="' + _producttype[j].rowid + '"> ' + _producttype[j].name + '</option>';
                    //};
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
                    varHTML += '<div class="form-check-input"><input type="checkbox" class="chkallowwebsite form-check-input" id="allowwebsite_' + data[i].id + '"><label> &nbsp; Allow on website.</label></div>';
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
                    var path = data[i].image;
                    url = "../../Content/Product/" + path + "";
                    if (path != null) {
                        $('#show_pictureVar_' + data[i].id + '').attr('src', url);
                    }
                    else if (path == null || path == "") {
                        $('#show_pictureVar_' + data[i].id + '').attr('src', "../../Content/ProductCategory/default.png");
                    }
                    else {
                        $('#show_pictureVar_' + data[i].id + '').attr('src', "../../Content/ProductCategory/default.png");
                    }
                }

            }

        },
        error: function (msg) { alert(msg); },
        async: false
    }); 
}

function chunkArray(arr, n) {
    var chunkLength = Math.max(arr.length / n, 1);
    var chunks = [];
    for (var i = 0; i < n; i++) {
        if (chunkLength * (i + 1) <= arr.length) chunks.push(arr.slice(chunkLength * i, chunkLength * (i + 1)));
    }
    return chunks;
}

function bindCategory(product_id) {
    $.ajaxSetup({ async: true, beforeSend: function (xhr) { } });
    $.get('/Product/Categories', { id: parseInt(product_id) || 0 }, function (data) {
         $('#ul_category').tree({ data: data, idField: 'id', treeField: 'text', height: '100%', cascadeCheck: false });
        setTimeout(function () {
            //console.log('ddd');
            var checkedItemContainer = $('.tree-checkbox1').closest('.tree-node');
            if (checkedItemContainer.length > 0) {
                checkedItemContainer[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 500);
    }).fail(function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }).always(function () { });
}