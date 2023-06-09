﻿ $(document).ready(function () {
    $(".subsubsub li a").click(function (e) {
        $('.subsubsub li a').removeClass('current');
        $(this).addClass('current');
    });
    $.get('GetCategoryType', function (data) {
        var items = "";
        $.each(data, function (index, value) {
            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddltype");
        })
    })

    GetDetails();
   setTimeout(function () { dataGridLoad(''); }, 100);
    $("#loader").hide();
    $('#all').click(function () { var order_type = ""; $('#hfType').val(order_type); dataGridLoad(order_type); });
    $('#published').click(function () { var order_type = "publish"; $('#hfType').val(order_type); dataGridLoad(order_type); });
    $('#private').click(function () { var order_type = "private"; $('#hfType').val(order_type); dataGridLoad(order_type); });
    $('#trash').click(function () { var order_type = "trash"; $('#hfType').val(order_type); dataGridLoad(order_type); });
    $('#btnOtherFilter').click(function () { var order_type = $('#hfType').val(); dataGridLoad(order_type); });
});
function GetDetails() {
    var opt = { strValue1: '' };
    $.ajax({
        type: "POST", url: '/Product/GetCount', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
        success: function (result) {
            var data = JSON.parse(result);
            if (data.length > 0) {
                $('#all').find(".count").text(number_format(data[0].AllOrder));              
                $('#published').find(".count").text(number_format(data[0].Publish));              
                $('#private').find(".count").text(number_format(data[0].Private));
                $('#trash').find(".count").text(number_format(data[0].Trash));
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });
}

function dataGridLoad(order_type) {

   var types = $('#ddltype').val();
    let prodctype = $('#ddlproducttype').val();
    let stockstatus = $('#ddstockstatus').val();
   
    $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        //sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true,
        bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
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
        sAjaxSource: "/Product/GetList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            //aoData.push({ name: "strValue1", value: monthYear });
            aoData.push({ name: "strValue1", value: types });
            aoData.push({ name: "strValue2", value: order_type });
            aoData.push({ name: "strValue3", value: prodctype });
            aoData.push({ name: "strValue4", value: stockstatus });
            var col = 'ID';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 2 ? "post_title" : oSettings.aaSorting[0][0] == 2 ? "sku" : oSettings.aaSorting[0][0] == 4 ? "itemname" : oSettings.aaSorting[0][0] == 4 ? "Date" : oSettings.aaSorting[0][0] == 5 ? "publishDate" : "ID";
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
            {
                'data': 'ID', sWidth: "5%   ",
                'render': function (data, type, full, meta) {
                    return '<i class="glyphicon glyphicon-picture"></i>';
                }
            },
            { data: 'post_title', title: 'Name', sWidth: "12%" },
            { data: 'sku', title: 'SKU', sWidth: "12%" },
            //{ data: 'stockstatus', title: 'Stock', sWidth: "12%" },
            
            //{
            //    data: 'price', title: 'Price', sWidth: "12%", render: function (data, type, row) {
            //        var tprice = 'toFormat';
                     
            //        if (row.pricecodition == 'no') {
            //            tprice = '<span style ="text-decoration: line-through;"> ' + '$' + row.Regprice + '<br>' + ' </span>' + '<span style ="text-decoration: underline;"> ' + '$' + row.SalPrice + '<br>' + ' </span>';
            //           // tprice = '$' + row.Regprice + '<br>' + '$' + row.SalPrice;
            //            if (tprice == '$null$null' || tprice == '$0$null' || tprice == '$null$0' || tprice == '$0$')
            //                tprice = '$0.00';
            //            tprice = tprice.replaceAll('$null', '');
            //            if (row.Regprice == '0' && row.SalPrice == '0')
            //                tprice = '$0.00';
            //        }
            //        else {
            //            if (row.price == '$0.00-$0.00' || row.price == '$0-$0' || row.price == '$0-$' || row.price == null) {
            //                tprice = '$0.00';
            //            }
            //            else
            //                tprice = row.price;
            //        }

            //        return tprice
            //    }
            //},
            { data: 'itemname', title: 'Categories', sWidth: "12%" },
            //{
            //    'data': 'ID', sWidth: "5%   ",
            //    'render': function (data, type, full, meta) {
            //        return '<i class="glyphicon glyphicon-star"></i>';
            //    }
            //},
 
            { data: 'Date', title: 'Creation Date', sWidth: "12%" },
            { data: 'publishDate', title: 'Publish Date', sWidth: "12%" },
            { data: 'Activestatus', title: 'Status', sWidth: "12%" },
            {
                'data': 'ID', title: 'Action', sWidth: "5%",
                'render': function (id, type, full, meta) {
                    return '<a title="Click here to view product details" data-toggle="tooltip" href="AddNewProduct/' + id + '"><i class="glyphicon glyphicon-eye-open"></i></a>'
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
    if (id == "") { swal('alert', 'Please select product from list', 'error'); }
    else if (status == "0") { swal('alert', 'Please select Bulk Action', 'error'); }
    else {
        var obj = { strVal: id, status: status }
        $.ajax({
            url: '/Product/Changestatus', dataType: 'JSON', type: 'POST',
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
