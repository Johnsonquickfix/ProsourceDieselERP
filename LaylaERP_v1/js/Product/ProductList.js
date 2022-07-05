$(document).ready(function () {

   

    $(".subsubsub li a").click(function (e) {
        $('.subsubsub li a').removeClass('current');
        $(this).addClass('current');
    });
    //$.get('GetCategoryType', function (data) {
    //    var items = "";
    //    $.each(data, function (index, value) {
    //        items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#  ");
    //    })
    //})

    $('#dtdata tbody').on('click', '.details-control', function () {
        var tr = $(this).closest('tr');
        var row = $('#dtdata').DataTable().row(tr);

        if (row.child.isShown()) {        
            // This row is already open - close it
            tr.find('.details-control').empty().append('<i class="glyphicon glyphicon-plus-sign"></i>');
            row.child.hide();
            tr.removeClass('shown');
        }
        else { 
            // Open this row
            tr.find('.details-control').empty().append('<i class="glyphicon glyphicon-minus-sign"></i>');
           // row.child(format(row.data())).show();
            row.child.show();
            tr.addClass('shown');
        }
    });
    $("#loader").hide();
     getParentCategory();
    GetDetails();
    dataGridLoad(''); 
   /* setTimeout(function () { dataGridLoad(''); }, 1000);*/
   
    $('#all').click(function () { var order_type = ""; $('#hfType').val(order_type); dataGridLoad(order_type); });
    $('#published').click(function () { var order_type = "publish"; $('#hfType').val(order_type); dataGridLoad(order_type); });
    $('#private').click(function () { var order_type = "private"; $('#hfType').val(order_type); dataGridLoad(order_type); });
    $('#trash').click(function () { var order_type = "trash"; $('#hfType').val(order_type); dataGridLoad(order_type); });
    $('#btnOtherFilter').click(function () { var order_type = $('#hfType').val(); dataGridLoad(order_type); });
    $("#loader").hide();
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
                opt += '<option value="' + data[i].ID + '">' + space(data[i].level) + data[i].name + ' (' + data[i].count + ')' +'</option>';
            }
            $('#ddltype').html(opt);
        },
        async: false
    });
}

function GetDetails() {
    var opt = { strValue1: '' };
    $.ajax({
        type: "POST", url: '/Product/GetCount', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
        success: function (result) {
            var data = JSON.parse(result);
           // console.log(data);
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

    //$('#dtdata').DataTable({
    //    columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
    //    destroy: true, bProcessing: true, bServerSide: true,
    //    //sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true,
    //    bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
    //    responsive: true,
    //    lengthMenu: [[10, 20, 50], [10, 20, 50]],
    //    language: {
    //        lengthMenu: "_MENU_ per page",
    //        zeroRecords: "Sorry no records found",
    //        info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
    //        infoFiltered: "",
    //        infoEmpty: "No records found",
    //        processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
    //    },
    //    sAjaxSource: "/Product/GetList",
    //    fnServerData: function (sSource, aoData, fnCallback, oSettings) {
    //        //aoData.push({ name: "strValue1", value: monthYear });
    //        aoData.push({ name: "strValue1", value: types });
    //        aoData.push({ name: "strValue2", value: order_type });
    //        aoData.push({ name: "strValue3", value: prodctype });
    //        aoData.push({ name: "strValue4", value: stockstatus });
    //        var col = 'id';
    //        if (oSettings.aaSorting.length > 0) {
    //            var col = oSettings.aaSorting[0][0] == 2 ? "post_title" : oSettings.aaSorting[0][0] == 2 ? "sku" : oSettings.aaSorting[0][0] == 4 ? "itemname" : oSettings.aaSorting[0][0] == 4 ? "Date" : oSettings.aaSorting[0][0] == 5 ? "publishDate" : "id";
    //            aoData.push({ name: "sSortColName", value: col });
    //        }
    //        //console.log(aoData);
    //        oSettings.jqXHR = $.ajax({
    //            dataType: 'json', type: "GET", url: sSource, data: aoData,
    //            "success": function (data) {
    //                var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
    //                return fnCallback(dtOption);
    //            }
    //        });
    //    },
    //    columns: [
    //        //{
    //        //    'data': 'ID', sWidth: "5%   ",
    //        //    'render': function (data, type, full, meta) {
    //        //        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck(this);" value="' + $('<div/>').text(data).html() + '"><label></label>';
    //        //    }
    //        //},
    //        {
    //            'data': 'id', sWidth: "4%   ",
    //            'render': function (data, type, row) {
    //                if (row.post_parent > 0)
    //                    return '<input type = "checkbox" style = "opacity: 1; position: relative; visibility: visible; display: block" onClick="Singlecheck(this);" name="CheckSingle" value="' + $('<div/>').text(data).html() + '">';
    //                    return ' <b></b>';
    //            }
    //        },
    //        {
    //            data: 'id', title: 'ID', sWidth: "10%", render: function (data, type, row) {
    //                if (row.post_parent > 0)
    //                    return ' #' + row.id + '' ;
    //                else
    //                    return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a>  <b> #' + row.id + '</b>';
    //                //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> -  #' + row.id; else return ' <b>#' + row.id + '</b>';
    //            }
    //        },
             
    //        {
    //            'data': 'id', sWidth: "5%   ",
    //            'render': function (data, type, full, meta) {
    //                return '<i class="glyphicon glyphicon-picture"></i>';
    //            }
    //        },
    //        { data: 'post_title', title: 'Name', sWidth: "18%" },
    //        { data: 'sku', title: 'SKU', sWidth: "10%" },
    //        //{ data: 'stockstatus', title: 'Stock', sWidth: "12%" },

    //        //{
    //        //    data: 'price', title: 'Price', sWidth: "12%", render: function (data, type, row) {
    //        //        var tprice = 'toFormat';

    //        //        if (row.pricecodition == 'no') {
    //        //            tprice = '<span style ="text-decoration: line-through;"> ' + '$' + row.Regprice + '<br>' + ' </span>' + '<span style ="text-decoration: underline;"> ' + '$' + row.SalPrice + '<br>' + ' </span>';
    //        //           // tprice = '$' + row.Regprice + '<br>' + '$' + row.SalPrice;
    //        //            if (tprice == '$null$null' || tprice == '$0$null' || tprice == '$null$0' || tprice == '$0$')
    //        //                tprice = '$0.00';
    //        //            tprice = tprice.replaceAll('$null', '');
    //        //            if (row.Regprice == '0' && row.SalPrice == '0')
    //        //                tprice = '$0.00';
    //        //        }
    //        //        else {
    //        //            if (row.price == '$0.00-$0.00' || row.price == '$0-$0' || row.price == '$0-$' || row.price == null) {
    //        //                tprice = '$0.00';
    //        //            }
    //        //            else
    //        //                tprice = row.price;
    //        //        }

    //        //        return tprice
    //        //    }
    //        //},

    //        {
    //            data: 'regular_price', title: 'Retail Price', sWidth: "8%", render: function (data, type, row) {
    //                var tprice = 'toFormat';
    //                if (data.toString() == "")
    //                    tprice = "";
    //                else
    //                    tprice = '$' + parseFloat(data).toFixed(2);
    //                return tprice
    //            }
    //        },
    //        {
    //            data: 'sale_price', title: 'Sale Price', sWidth: "8%", render: function (data, type, row) {
    //                var tprice = 'toFormat';
    //                if (data.toString() == "")
    //                    tprice = "";
    //                else
    //                    tprice = '$' + parseFloat(data).toFixed(2);
    //                return tprice
    //            }
    //        },
    //        { data: 'itemname', title: 'Categories', sWidth: "12%" },
    //        //{
    //        //    'data': 'ID', sWidth: "5%   ",
    //        //    'render': function (data, type, full, meta) {
    //        //        return '<i class="glyphicon glyphicon-star"></i>';
    //        //    }
    //        //},

    //        { data: 'Date', title: 'Creation Date', sWidth: "11%" },
    //        { data: 'publishDate', title: 'Publish Date', sWidth: "15%" },
    //        { data: 'Activestatus', title: 'Status', sWidth: "8%" },
    //        {
    //            'data': 'id', title: 'Action', sWidth: "3%",
    //            'render': function (id, type, row) {
    //                if (row.post_parent > 0)
    //                    return ' <b></b>';
    //                else
    //                    return '<a title="Click here to view product details" data-toggle="tooltip" href="AddNewProduct/' + id + '"><i class="glyphicon glyphicon-eye-open"></i></a>'

    //            }
    //        }
    //    ]
    //});


    let _items = [];
    //let pid = parseInt($("#ddlProduct").val()) || 0, ctid = parseInt($("#ddlCategory").val()) || 0;
    let obj = { strValue1: types, strValue2: order_type, strValue3: prodctype, strValue4: stockstatus}; //console.log(obj);


    $('#dtdata').DataTable({
        oSearch: { "sSearch": '' }, order: [[0, "asc"]], bProcessing: true, responsive: true, scrollX: true,
       //sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true,
       //bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
        
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        destroy: true, bAutoWidth: false, ajax: {
            url: '/Product/GetList', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        lengthMenu: [[20, 50, 100], [20, 50, 100]],
        columns: [
            { data: 'p_id', title: 'Parent ID', sWidth: "3%" },
            //{
            //    'data': 'ID', sWidth: "5%   ",
            //    'render': function (data, type, full, meta) {
            //        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck(this);" value="' + $('<div/>').text(data).html() + '"><label></label>';
            //    }
            //},
            {
                'data': 'id', sWidth: "3%   ",
                'render': function (data, type, row) {
                    if (row.post_parent > 0 || row.term_id == 2)
                        return '<input type = "checkbox" style = "opacity: 1; position: relative; visibility: visible; display: block" onClick="Singlecheck(this);" name="CheckSingle" value="' + $('<div/>').text(data).html() + '">';
                        return ' <b></b>';
                }
            },
            {
                data: 'id', title: 'ID', sWidth: "5%", render: function (data, type, row) {
                    if (row.post_parent > 0)
                        return ' ↳' + row.id + '' ;
                    else
                        return ' <b style="font-size:14px;"> #' + row.id + '</b>';
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> -  #' + row.id; else return ' <b>#' + row.id + '</b>';
                }
            },

            {
                "data": "thumbnails", sWidth: "7%   ",
                //'render': function (data, type, full, meta) {
                //    return '<i class="glyphicon glyphicon-picture"></i>';
                //}
                "render": function (data) {

                    url = "../../Content/Product/" + data + "";
                    //if (data.indexOf('product') == -1)
                    // var result = checkFileExist(url);
                    //if (data.indexOf('product') != -1) {
                    //    return '<img src="../../Content/ProductCategory/default.png" width="65" height="50" />';
                    //}
                    //else {
                    if (data != null) { return '<img src=' + url + ' width="65" height="50"/>'; }
                        else if (data == null || data == "") { return '<img src="../../Content/ProductCategory/default.png" width="50"  height="50"/>'; }
                        else { return '<img src="../../Content/ProductCategory/default.png" width="65" height="50"/>'; }
                    //}
                }
            },
            { data: 'post_title', title: 'Name', sWidth: "12%" },
            { data: 'sku', title: 'SKU', sWidth: "8%" },
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

            {
                data: 'regular_price', title: 'Retail Price', sWidth: "8%", render: function (data, type, row) {
                    var tprice = 'toFormat';
                    if (data.toString() == "")
                        tprice = "";
                    else
                        tprice = '$' + parseFloat(data).toFixed(2);
                    return tprice
                }
            },
            {
                data: 'sale_price', title: 'Sale Price', sWidth: "8%", render: function (data, type, row) {
                    var tprice = 'toFormat';
                    if (data.toString() == "")
                        tprice = "";
                    else
                        tprice = '$' + parseFloat(data).toFixed(2);
                    return tprice
                }
            },
            { data: 'itemname', title: 'Categories', sWidth: "5%" },
            //{
            //    'data': 'ID', sWidth: "5%   ",
            //    'render': function (data, type, full, meta) {
            //        return '<i class="glyphicon glyphicon-star"></i>';
            //    }
            //},

            { data: 'Date', title: 'Creation Date', sWidth: "8%" },
            { data: 'publishDate', title: 'Publish Date', sWidth: "8%" },
            { data: 'Activestatus', title: 'Status', sWidth: "5%" },
           // { data: 'component_status', title: 'Component Status', sWidth: "7%" },
            {
                'data': 'component_status', sWidth: "5%",  
                'render': function (id, type, full, meta) {
                    if (full.post_parent > 0 || full.term_id == 2) {
                        if (id == '' || id == 0) {
                            toggleclass = "fas fa-toggle-on";
                            toggleStyle = "color: #ff0000!important;font-size: 24px;";
                            toggleStatus = 1;
                        }

                        else {
                            toggleclass = "fas fa-toggle-off";
                            toggleStyle = "color: #49be25!important;font-size: 24px;";
                            toggleStatus = 0;
                        }
                        //return ' <span title="Click here to change the status of chart of accounts" data-placement="bottom" data-toggle="tooltip"> <a href="#" onclick="ChangeStatus(' + full.id + ',' + toggleStatus + ');"><i class="' + toggleclass + '" style="' + toggleStyle + '"></i></a></span>';
                        return ' <span title="Click here to change the status of chart of accounts" data-placement="bottom" data-toggle="tooltip"> <a href="#" "><i class="' + toggleclass + '" style="' + toggleStyle + '"></i></a></span>';

                    }
                    else {
                         return ' <b></b>';
                    }
                }
            },
            {
                'data': 'id', title: 'Action', sWidth: "5%",
                'render': function (id, type, row) {
                    if (row.post_parent > 0)
                        return ' <b></b>';
                    else {
                        if ($("#hfEdit").val() == "1") {
                            return '<a title="Click here to view product details" data-toggle="tooltip" href="AddNewProduct/' + id + '" onclick="ActivityLog(\'Edit product id ('+id+') in product list\',\'AddNewProduct/' + id + '\');"><i class="glyphicon glyphicon-eye-open"></i></a>'
                        }
                        else { return "No Permission"; }
                    }
                }
            }
        ],
        columnDefs: [
            { targets: [0], visible: false, searchable: false },
            { targets: [1, 2], orderable: false }
        ]
    });
}

function ChangeStatus(id, status) {
    console.log(id, status);
    //  let cofStatus = status == "0" ? "Inactive" : "Active";
    ActivityLog('change status as ' + status + '', '/Product/UpdateproductcomponentStatus/' + id + '');
    var obj = { rowid: id, active: status, }
    $.ajax({
        url: '/Product/UpdateproductcomponentStatus/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            if (data.status == true) {

                dataGridLoad('');

                swal('Success', data.message, 'success');
            }
            else { swal('Alert!', data.message, 'error') }
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
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
    var statusval = $("#ddlbulkaction :selected").text();  
    console.log(statusval);
    if (id == "") { swal('Alert', 'Please select product from list', 'error'); }
    else if (status == "0") { swal('Alert', 'Please select bulk action', 'error'); }
    else {

        var obj = { strVal: id, status: status }
        const updatestatus = status == 'publish' ? 'Active' : 'Inactive';
        ActivityLog('Change product status as ' + updatestatus+'', '/Product/ListProduct');
        //var checkstr = confirm('are you sure want to update this?');
        //if (checkstr == true) {
        swal({ title: "", text: 'Would you like to ' + statusval +' this product?', type: "question", showCancelButton: true })
            .then((result) => {
                if (result.value) {                 
        $.ajax({
            url: '/Product/Changestatus', dataType: 'JSON', type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert', data.message, 'success').then((result) => { GetDetails(); var order_type = $('#hfType').val(); dataGridLoad(order_type); });
                }
                else {
                    swal('Alert', 'something went wrong!', 'success');
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },

        })


        //} else {
        //    return false;
        //}
                }
            });
    }
}

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