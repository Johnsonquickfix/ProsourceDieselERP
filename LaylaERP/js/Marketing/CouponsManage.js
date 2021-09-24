$(document).ready(function () {
    $(".subsubsub li a").click(function (e) {
        $('.subsubsub li a').removeClass('current');
        $(this).addClass('current');
    });
    GetDetails();
    setTimeout(function () { dataGridLoad(''); }, 100);
    //$("#loader").hide();
    $('#all').click(function () { var order_type = ""; $('#hfType').val(order_type); dataGridLoad(order_type); });
    $('#mine').click(function () { var order_type = "mine"; $('#hfType').val(order_type); dataGridLoad(order_type); });
    $('#published').click(function () { var order_type = "publish"; $('#hfType').val(order_type); dataGridLoad(order_type); });
    $('#draft').click(function () { var order_type = "draft"; $('#hfType').val(order_type); dataGridLoad(order_type); });
    $('#pending').click(function () { var order_type = "pending"; $('#hfType').val(order_type); dataGridLoad(order_type); });    
    $('#private').click(function () { var order_type = "private"; $('#hfType').val(order_type); dataGridLoad(order_type); });
    $('#trash').click(function () { var order_type = "trash"; $('#hfType').val(order_type); dataGridLoad(order_type); });
    $('#btnOtherFilter').click(function () { var order_type = $('#hfType').val(); dataGridLoad(order_type); });
    
});
function GetDetails() {
    var opt = { strValue1: '' };
    $.ajax({
        type: "POST", url: '/Coupons/GetCount', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
        success: function (result) {
            var data = JSON.parse(result);
            if (data.length > 0) {
                $('#all').find(".count").text(number_format(data[0].AllOrder));
                $('#mine').find(".count").text(number_format(data[0].Mine));
                $('#published').find(".count").text(number_format(data[0].Publish));
                $('#draft').find(".count").text(number_format(data[0].Drafts));
                $('#pending').find(".count").text(number_format(data[0].Pending));               
                $('#private').find(".count").text(number_format(data[0].Private));
                $('#trash').find(".count").text(number_format(data[0].Trash));
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });
}

function dataGridLoad(order_type) {
   
    types = $('#ddltype').val();  
    $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        //sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true,
        bAutoWidth: false, scrollX: false, scrollY: ($(window).height() - 215),
        responsive: true,
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        sAjaxSource: "/Coupons/GetList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            //aoData.push({ name: "strValue1", value: monthYear });
            aoData.push({ name: "strValue1", value: types });
            aoData.push({ name: "strValue2", value: order_type });
            aoData.push({ name: "strValue3", value: null });
            var col = 'order_id';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 2 ? "ID" : oSettings.aaSorting[0][0] == 3 ? "post_title" : oSettings.aaSorting[0][0] == 4 ? "discount_type" : "ID";
                aoData.push({ name: "sSortColName", value: col });
            }
            //console.log(aoData);
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [
            {
                'data': 'ID', sWidth: "5%   ",
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck(this);" value="' + $('<div/>').text(data).html() + '"><label></label>';
                }
            },       
            { data: 'post_title', title: 'Code', sWidth: "12%" },
            { data: 'discount_type', title: 'Coupon Type', sWidth: "12%" },
            { data: 'coupon_amount', title: 'Coupon amount', sWidth: "10%" },
            { data: 'post_excerpt', title: 'Description', sWidth: "12%" },
            {
                data: 'product_ids', title: 'Product IDs', sWidth: "20%",
                'render': function (data, type, full, meta) {
                    return '<span class="linking_product_ids">' + data +'</span>'
                }
            },
            { data: 'UsageLimit', title: 'Usage/Limit', sWidth: "10%" },
            { data: 'date_expires', title: 'Expiry date', sWidth: "14%" },
            {
                'data': 'ID', title: 'Action', sWidth: "9%",
                'render': function (id, type, full, meta) {
                    return '<a href="Index/' + id + '"><i class="glyphicon glyphicon-eye-open"></i></a>'
                }
            }
        ]
    });
}

function CheckAll() {
    var isChecked = $('#checkall').prop("checked");
    $('#dtdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
}
function Singlecheck(chk) {
    var isChecked = $(chk).prop("checked");
    var isHeaderChecked = $("#checkall").prop("checked");
    if (isChecked == false && isHeaderChecked)
        $("#checkall").prop('checked', isChecked);
    else {
        $('#dtdata tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkall").prop('checked', isChecked);
    }
}

function Status() {
    var id = "";
    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        id += $(this).val() + ",";
    });
    id = id.replace(/,(?=\s*$)/, '');
    $("#checkAll").prop('checked', false);
    var status = $('#ddlbulkaction').val();
    if (id == "") { swal('alert', 'Please select a Coupon', 'error'); }
    else if (status == "0") { swal('alert', 'Please select Action', 'error'); }
    else {
        var obj = { strVal: id, status: status }
        $.ajax({
            url: '/Coupons/ChangeTrash', dataType: 'JSON', type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('alert', data.message, 'success').then((result) => { GetDetails(); var order_type = $('#hfType').val(); dataGridLoad(order_type); });
                }
                else {
                    swal('alert', 'something went wrong!', 'success');
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },

        })
    }
}
