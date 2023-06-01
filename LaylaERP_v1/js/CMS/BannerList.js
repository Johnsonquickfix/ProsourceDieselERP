$(document).ready(function () {

    $(".subsubsub li a").click(function (e) {
        $('.subsubsub li a').removeClass('current');
        $(this).addClass('current');
    });
    $("#loader").hide();
    // getParentCategory();
    $(".select1").select2();
    getcompany();
    GetDetails();
    dataGridLoad('');
    /* setTimeout(function () { dataGridLoad(''); }, 1000);*/

    $('#all').click(function () { var order_type = ""; $('#hfType').val(order_type); dataGridLoad(order_type); });
    $('#published').click(function () { var order_type = "publish"; $('#hfType').val(order_type); dataGridLoad(order_type); });
    $('#private').click(function () { var order_type = "private"; $('#hfType').val(order_type); dataGridLoad(order_type); });
    $('#trash').click(function () { var order_type = "trash"; $('#hfType').val(order_type); dataGridLoad(order_type); });
    $('#draft').click(function () { var order_type = "draft"; $('#hfType').val(order_type); dataGridLoad(order_type); });
    $('#btnOtherFilter').click(function () { var order_type = $('#hfType').val(); dataGridLoad(order_type); });
    $("#loader").hide();
    $(document).on('click', "#btnsearch", function () {
        dataGridLoad('');
    })
});

function getcompany() {
    $.ajax({
        url: "/Setting/GetCompany",
        type: "Get",
        success: function (data) {
            var opt = '<option value="">Please Select Company</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlcompany').html(opt);
        }

    });
}
//function space(noOfSpaces) {
//    var space = "# ", returnValue = "";
//    for (var index = 0; index < noOfSpaces; index++) {
//        returnValue += space;
//    }
//    return returnValue;
//}
//function getParentCategory(id) {
//    var obj = { strValue1: id };
//    $.ajax({
//        url: "/Product/GetParentCategory/" + id,
//        type: "Get",
//        contentType: "application/json; charset=utf-8",
//        dataType: 'JSON',
//        data: JSON.stringify(obj),
//        success: function (data) {
//            data = JSON.parse(data);
//            var opt = '<option value="0">Please select category</option>';
//            for (var i = 0; i < data.length; i++) {
//                opt += '<option value="' + data[i].ID + '">' + space(data[i].level) + data[i].name + ' (' + data[i].count + ')' + '</option>';
//            }
//            $('#ddltype').html(opt);
//        },
//        async: false
//    });
//}

function GetDetails() {
    var opt = { strValue1: '' };
    $.ajax({
        type: "POST", url: '/CMS/GetBannerCount', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
        success: function (result) {
            var data = JSON.parse(result);
            // console.log(data);
            if (data.length > 0) {
                $('#all').find(".count").text(number_format(data[0].AllOrder));
                $('#published').find(".count").text(number_format(data[0].Publish));
                $('#private').find(".count").text(number_format(data[0].Private));
                $('#trash').find(".count").text(number_format(data[0].Trash));
                $('#draft').find(".count").text(number_format(data[0].Draft));

            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });
}

function dataGridLoad(order_type) {
    var company = $('#ddlcompany').val();
    let prodctype = $('#ddlproducttype').val();
    let stockstatus = $('#ddstockstatus').val();
    let _items = [];
    let obj = { strValue1: company, strValue2: order_type, strValue3: prodctype, strValue4: stockstatus }; //console.log(obj);
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
        sAjaxSource: "/CMS/GetBannerList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            //aoData.push({ name: "strValue1", value: monthYear });
            aoData.push({ name: "strValue1", value: company });
            aoData.push({ name: "strValue2", value: order_type });
            aoData.push({ name: "strValue3", value: null });
            var col = 'order_id';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "ID" : oSettings.aaSorting[0][0] == 2 ? "post_title" : oSettings.aaSorting[0][0] == 3 ? "user_login" : "ID";
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
            { data: 'ID', title: 'ID', sWidth: "3%" },
            {
                'data': 'ID', sWidth: "3%   ",
                'render': function (data, type, row) {
                    return '<input type = "checkbox" style = "opacity: 1; position: relative; visibility: visible; display: block" onClick="Singlecheck(this);" name="CheckSingle" value="' + $('<div/>').text(data).html() + '">';
                }
            },

            { data: 'post_title', title: 'Title', sWidth: "12%" },

            {
                "data": "mobileimage", sWidth: "7%   ",
                //'render': function (data, type, full, meta) {
                //    return '<i class="glyphicon glyphicon-picture"></i>';
                //}
                "render": function (data) {

                    url = "../../Content/Pages/MobileBanner/" + data + "";
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
            { data: 'type_banner', title: 'Selected Page', sWidth: "5%" },
            { data: 'post_date', title: 'Post Date', sWidth: "8%" }, 
            {
                'data': 'ID', title: 'Action', sWidth: "5%",
                'render': function (id, type, row) {
                    //if (row.post_parent > 0)
                    //    return ' <b></b>';
                    //else {
                    //if ($("#hfEdit").val() == "1") {
                    return '<a title="Click here to view pages details" data-toggle="tooltip" href="Banner/' + id + '" onclick="ActivityLog(\'Edit banner id (' + id + ') in banner list\',\'Banner/' + id + '\');"><i class="glyphicon glyphicon-eye-open"></i></a>'
                    //    }
                    //    else { return "No Permission"; }
                    //}
                    // }
                }
            }
        ],
        columnDefs: [
            { targets: [0], visible: false, searchable: false },
            { targets: [0, 1], orderable: false }
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
        ActivityLog('Change product status as ' + updatestatus + '', '/Product/ListProduct');
        swal({ title: "", text: 'Would you like to ' + statusval + ' this product?', type: "question", showCancelButton: true })
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