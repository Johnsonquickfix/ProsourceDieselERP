

$(document).ready(function () {
    $("#loader").hide();

    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    
    if (id != "" && id != "Index") {
        $("#hfid").val(id);       
        setTimeout(function () { GetDataByID(id); }, 10);
        //// $("#hfprodcid").val("629,632");
        setTimeout(function () { GetProdctByID($("#hfprodcid").val()); }, 3000);
        setTimeout(function () { GetExProdctByID($("#hfcategid").val()); }, 3500);

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
    $(document).on('click', "#btnSave", function () {
        AddProduct();
    })
});

function AddProduct() {
    debugger
    ID = $("#hfid").val();

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
                    $(item).prop('checked',true);                        
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



