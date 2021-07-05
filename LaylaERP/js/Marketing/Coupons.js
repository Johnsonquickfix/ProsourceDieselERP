$('#btnGenerateCoupon').click(function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    $('#txtGenrateCouponCode').val(text);
});

$('#ddlProduct').select2({
    allowClear: true, minimumInputLength: 3, placeholder: "Search Product",
    ajax: {
        url: '/Coupons/GetProductList', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
        data: function (params) { var obj = { strValue1: params.term }; return JSON.stringify(obj); },
        processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.post_title, name: item.post_title, id: item.r_id } }) }; },
        error: function (xhr, status, err) { }, cache: true
    }
});
$("#ddlProduct").change(function () { if ($('#ddlProduct').val() == null) return false; getItemList(); $('#ddlProduct').val('').trigger('change'); });