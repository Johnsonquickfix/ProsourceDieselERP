$(document).ready(function () {
    $("#loader").hide();
    bindProduct();
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);

    GetUser();
    $(".select2").select2();
    if (id != "" && id != "Index") {
        $("#hfid").val(id);        
        GetDataByID(id);
        GetCategoryProdctByID($("#hfcategid").val());
        GetExCategoryProdctByID($("#exhfcategid").val());
    }

    $("#txtCouponAmount").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    });
    $("#txtMinimumSpend").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    });
    $("#txtMaximumSpend").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    });

    $('#btnGenerateCoupon').click(function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (var i = 0; i < 8; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        $('#txtGenrateCouponCode').val(text);

    });


    $('#ddlProductCategories').select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Search Categories",
        ajax: {
            url: '/Coupons/GetProductcategoriesList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.name, name: item.name, id: item.term_id } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
    $('#ddlExcludeCategories').select2({
        allowClear: true, minimumInputLength: 3, placeholder: "Search Categories",
        ajax: {
            url: '/Coupons/GetProductcategoriesList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.name, name: item.name, id: item.term_id } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
    $('#txtCouponAmount').change(function () {
        var DiscountType = $("#ddlDiscountType").val();
        var CouponAmount = $("#txtCouponAmount").val();
        if (DiscountType == "percent") {
            if (parseInt(CouponAmount) > 100) {
                $("#txtCouponAmount").val("0");
                swal('Alert', 'Please Enter Coupon Amount Within 100 %', 'error').then(function () { swal.close(); $('#txtCouponAmount').focus(); });
            }
        }
    });

   

    $(document).on('click', "#btnSave", function () {
        AddCoupons();
    })
});
function bindProduct() {
    $.ajax({ method: 'post', url: '/Coupons/GetProductList', data: JSON.stringify({ strValue1: '' }), async: false }).done(function (result, textStatus, jqXHR) {
        result = JSON.parse(result);

        $("#ddlProduct,#ddlProductExlude").select2({
            data: result, multiple: true, allowClear: true, minimumInputLength: 3, placeholder: { id: '-1', text: 'Select Product' }
        });
    }).fail(function (jqXHR, textStatus, errorThrown) { console.log(jqXHR); });
}


function GetUser() {
    $.ajax({
        url: "/Coupons/GetUser",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please Select Agent</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlagent').html(opt);
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); },
        async: false

    });
}


function AddCoupons() {
    debugger
    ID = $("#hfid").val();
    var freeship = "";
    var Individualval = "";
    var Exsaleitems = "";
    var AutoCouponval = "";

    var Productval = $('#ddlProduct option:selected')
        .toArray().map(item => item.value).join();
    var Productvalexlude = $('#ddlProductExlude option:selected')
        .toArray().map(item => item.value).join();
    var ProductCategoriesval = $('#ddlProductCategories option:selected')
        .toArray().map(item => item.value).join();
    var ExcludeCategoriesval = $('#ddlExcludeCategories option:selected')
        .toArray().map(item => item.value).join();

    if ($("#free_ship").prop('checked') == true)
        freeship = "yes";
    else
        freeship = "no";

    if ($("#individual_only").prop('checked') == true)
        Individualval = "yes";
    else
        Individualval = "no";

    if ($("#exclude_items").prop('checked') == true)
        Exsaleitems = "yes";
    else
        Exsaleitems = "no";

    if ($("#auto_coupon").prop('checked') == true)
        AutoCouponval = "yes";
    else
        AutoCouponval = "no";

    couponcode = $("#txtGenrateCouponCode").val();
    DiscountType = $("#ddlDiscountType").val();
    CouponAmount = $("#txtCouponAmount").val();
    free_ship = freeship;
    CouponExpiryDate = $("#txtCouponExpiryDate").val();
    MinimumSpend = $("#txtMinimumSpend").val();
    MaximumSpend = $("#txtMaximumSpend").val();
    individual = Individualval;
    excludeitems = Exsaleitems;
    autocoupon = AutoCouponval;
    Productid = Productval;
    Productexludeid = Productvalexlude;
    categories = ProductCategoriesval;
    Excludecategories = ExcludeCategoriesval;
    email = $("#txtAllowedEmails").val();
    UsageLimitPerCoupon = $("#txtUsageLimitPerCoupon").val();
    LimitUsagetoXItems = $("#txtLimitUsagetoXItems").val();
    UsageLimitPerUser = $("#txtUsageLimitPerUser").val();
    discription = $("#txtdiscription").val();
    employee_id = $("#ddlagent").val();


    if (CouponAmount == "")
        CouponAmount = "0.00";
    else
        CouponAmount = addZeroes(CouponAmount);


    if (MinimumSpend == "")
        MinimumSpend = "0";
    if (MaximumSpend == "")
        MaximumSpend = "0";
    if (discription == "")
        discription = "-";


    if (couponcode == "") {
        swal('Alert', 'Please Enter Coupon Code', 'error').then(function () { swal.close(); $('#txtGenrateCouponCode').focus(); });
    }
    else if (CouponExpiryDate == "") {
        swal('Alert', 'Please Enter Coupon Expiry Date', 'error').then(function () { swal.close(); $('#txtCouponExpiryDate').focus(); });
    }


    else {



        var obj = {
            ID: ID,
            post_title: couponcode,
            post_name: couponcode,
            post_excerpt: discription,
            discount_type: DiscountType,
            coupon_amount: CouponAmount,
            free_shipping: free_ship,
            date_expires: CouponExpiryDate,
            min_subtotal: MinimumSpend,
            max_subtotal: MaximumSpend,
            individual_use: individual,
            exclude_sale_items: excludeitems,
            wjecf_is_auto_coupon: autocoupon,
            product_ids: Productid,
            exclude_product_ids: Productexludeid,
            categories_ids: categories,
            exclude_categories_ids: Excludecategories,
            cus_email: email,
            usage_limit: UsageLimitPerCoupon,
            limit_usage_to_x_items: LimitUsagetoXItems,
            usage_limit_per_user: UsageLimitPerUser,
            _employee_id: employee_id
        }
        $.ajax({
            url: '/Coupons/CreateAutoCoupons/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (data) {
                if (data.status == true) {
                    if (data.url == "Manage") {
                        swal('Success!', data.message, 'success').then((result) => { location.href = '../AutoGenerate'; });
                    }
                    else {
                        $('#fetch_results > input:text').val('');
                        swal('Success!', data.message, 'success').then((result) => { location.href = 'AutoGenerate'; });
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
    if (isNaN(num)) { return 0; }
    // If there is no decimal, or the decimal is less than 2 digits, toFixed
    if (String(num).split(".").length < 2 || String(num).split(".")[1].length <= 2) { num = num.toFixed(2); }
    // Return the number
    return num;
}
function clear_fetch() {
    $('#fetch_results').find('input:text, input:password,input:number, input:checkbox select').each(function () { $(this).val(''); });
    $('input[type=checkbox]').each(function () { this.checked = false; });
}

function GetDataByID(order_id) {
    var ID = order_id;
    if (ID == "Add New Coupons") { $('#lbltitle').text("Add New Customer"); } else { $('#lbltitle').text("Update / View  Coupons"); }
    var obj = { strVal: order_id }
    $.ajax({

        url: '/Coupons/GetAutoDataByID/' + ID,
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var i = JSON.parse(data);
            console.log(i);
            $("#txtGenrateCouponCode").val(i[0].post_title);
            $('#txtGenrateCouponCode').prop('readonly', true);
            $("#txtdiscription").val(i[0].post_excerpt);
            $('#ddlDiscountType').val(i[0].discount_type.trim()).trigger('change');
            $("#txtCouponAmount").val(i[0].coupon_amount);
            if (i[0].free_shipping == "yes")
                $("#free_ship").prop("checked", true);
            $("#txtCouponExpiryDate").val(i[0].date_expires);
            $("#txtMinimumSpend").val(i[0].minimum_amount);
            $("#txtMaximumSpend").val(i[0].maximum_amount);
            if (i[0].individual_use == "yes")
                $("#individual_only").prop("checked", true);
            if (i[0].exclude_sale_items == "yes")
                $("#exclude_items").prop("checked", true);
            if (i[0]._wjecf_is_auto_coupon == "yes")
                $("#auto_coupon").prop("checked", true);


            // $("#ddlProduct").empty().append('<option value="' + i[0].product_ids + '" selected>' + i[0].product_ids + '</option>');
            // $("#ddlProductExlude").empty().append('<option value="' + i[0].exclude_product_ids + '" selected>' + i[0].exclude_product_ids + '</option>');
            //  $("#ddlProductCategories").empty().append('<option value="' + i[0].product_categories + '" selected>' + i[0].product_categories + '</option>');
            //  $("#ddlExcludeCategories").empty().append('<option value="' + i[0].exclude_product_categories + '" selected>' + i[0].exclude_product_categories + '</option>');
            $("#txtAllowedEmails").val(i[0].customer_email);
            $("#txtUsageLimitPerCoupon").val(i[0].usage_limit);
            $("#txtLimitUsagetoXItems").val(i[0].limit_usage_to_x_items);
            $("#txtUsageLimitPerUser").val(i[0].usage_limit_per_user);
            $("#hfprodcid").val(i[0].product_ids);
            $("#hfexprodcid").val(i[0].exclude_product_ids);
            $("#hfcategid").val(i[0].product_categories);
            $("#exhfcategid").val(i[0].exclude_product_categories);
            if (i[0].product_ids !== null && i[0].product_ids !== undefined)
                $("#ddlProduct").select2("val", [i[0].product_ids.split(',')]);
            if (i[0].exclude_product_ids !== null && i[0].exclude_product_ids !== undefined)
                $("#ddlProductExlude").select2("val", [i[0].exclude_product_ids.split(',')]);

                console.log(i[0].EmployeeID);

            //$('#ddlagent').val(i[0].EmployeeID).trigger('change');
            $("#ddlagent").select2("val", [i[0].EmployeeID]);

            // $("#shipcountry").val(i[0].country);
            //  $('#Item_Name').val(i[0].item_name.trim()).trigger('change');

        },
        error: function (msg) { alert(msg); },
        async: false
    });

}

function GetProdctByID(ProdctID) {
    if (ProdctID == '') {
    }
    else {
        var ID = ProdctID;
        var obj = { strVal: ProdctID }
        $.ajax({

            url: '/Coupons/GetSelectProdctByID/' + ID,
            type: 'post',
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            success: function (data) {
                var datalog = JSON.parse(data);
                for (var i = 0; i < datalog.length; i++) {
                    $("#ddlProduct").append('<option value="' + datalog[i].pr_id + '" selected>' + datalog[i].post_title + '</option>');
                }

            },
            error: function (msg) { alert(msg); },
            async: false
        });
    }

}

function GetExProdctByID(ProdctID) {
    //console.log(ProdctID);
    if (ProdctID == '') {
    }
    else {
        var ID = ProdctID;
        var obj = { strVal: ProdctID }
        $.ajax({

            url: '/Coupons/GetSelectProdctByID/' + ID,
            type: 'post',
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            success: function (data) {
                var datalog = JSON.parse(data);
                for (var i = 0; i < datalog.length; i++) {
                    $("#ddlProductExlude").append('<option value="' + datalog[i].pr_id + '" selected>' + datalog[i].post_title + '</option>');
                }

            },
            error: function (msg) { alert(msg); },
            async: false
        });
    }

}

function GetCategoryProdctByID(ProdctID) {
    //console.log(ProdctID);
    if (ProdctID == '') {
    }
    else {
        var ID = ProdctID;
        var obj = { strVal: ProdctID }
        $.ajax({

            url: '/Coupons/GetCategoryProdctByID/' + ID,
            type: 'post',
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            success: function (data) {
                var datalog = JSON.parse(data);
                for (var i = 0; i < datalog.length; i++) {
                    $("#ddlProductCategories").append('<option value="' + datalog[i].term_id + '" selected>' + datalog[i].name + '</option>');
                }

            },
            error: function (msg) { alert(msg); },
            async: false
        });
    }
}

function GetExCategoryProdctByID(ProdctID) {
    //console.log(ProdctID);
    if (ProdctID == '') {
    }
    else {
        var ID = ProdctID;
        var obj = { strVal: ProdctID }
        $.ajax({

            url: '/Coupons/GetCategoryProdctByID/' + ID,
            type: 'post',
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            success: function (data) {
                var datalog = JSON.parse(data);
                for (var i = 0; i < datalog.length; i++) {
                    $("#ddlExcludeCategories").append('<option value="' + datalog[i].term_id + '" selected>' + datalog[i].name + '</option>');
                }

            },
            error: function (msg) { alert(msg); },
            async: false
        });
    }

}