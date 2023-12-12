
$(document).ready(function () {
    $("#loader").hide();

     var urlpath = window.location.pathname;
    CheckPermissions("#btnAddCategory, #btnReset,#btnApply", "#hfEdit", "", urlpath);
     var pathid = urlpath.substring(urlpath.lastIndexOf('/') + 1);
   // alert(pathid);
    $("#btnbackproduct").hide();
    if (pathid != "" && pathid != "ProductCategories") {
        $("#btnbackproduct").show();
        if (pathid == 1000000001)
            $("#btnbackproduct").prop("href", "/Product/AddNewProduct");
        else
            $("#btnbackproduct").prop("href", "/Product/AddNewProduct/" + pathid);
    }
    
    $(".select2").select2();
    getParentCategory();
    CategoryList();
    
    //isEdit(true);
}) 

$('#btnAddCategory').click(function () {
    $("#ProdCatAdd *").children().prop('disabled', false);
    //$('[data-toggle="tooltip"]').tooltip();
    $("#btnAddNewCategory").css('cursor', 'pointer').attr('title', 'Create a new category');
    //$("#btnAddNewCategory").css('cursor', 'pointer').attr('data-toggle', 'tooltip');
    //title = "" data-toggle="tooltip"
    isEdit(true);
});

function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}

$('#txtCategoryName').keyup(function (event) {
    var textBox = event.target;
    var start = textBox.selectionStart;
    var end = textBox.selectionEnd;
    textBox.value = textBox.value.charAt(0).toUpperCase() + textBox.value.slice(1);
    textBox.setSelectionRange(start, end);

    var cat = $('#txtCategoryName').val().toLowerCase().trim();
    cat = cat.replace(/\s/g, '-');
    $('#txtCategorySlug').val(cat);
    isEdit(true);
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
    //$.ajax({
    //    url: "/Product/GetParentCategorylist/" + id,
    //    type: "Get",
    //    contentType: "application/json; charset=utf-8",
    //    dataType: 'JSON',
    //    data: JSON.stringify(obj),
    //    success: function (data) {
    //        data = JSON.parse(data);
    //        var opt = '<option value="0">Please select parent category</option>';
    //        for (var i = 0; i < data.length; i++) {
    //            opt += '<option value="' + data[i].ID + '">' + space(data[i].level)+ data[i].name + '</option>';
    //        }
    //        $('#ddlParentCategory').html(opt);
    //       // isEdit(true);
    //        $("#ProdCatAdd *").children().prop('disabled', true);
    //    }
    //});

    $("#ddlParentCategory").select2({
        allowClear: true, minimumInputLength: 2, placeholder: "Search Category",
        ajax: {
            url: '/CMS/GetcategoryData', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term, strValue2: '' }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.label, name: item.label, val: item.ID, id: item.ID } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });

}
$('#btnAddNewCategory').click(function () {
    debugger;
    ID = $("#hfid").val();
    Meta_id = $("#hfMetaid").val();
    CategoryName = $("#txtCategoryName").val().trim();
    CategorySlug = $("#txtCategorySlug").val();
    ParentCategory = $("#ddlParentCategory").val();
    Thumb = $("#getImageFileThumbnail").attr("value");
    Banner = $("#getImageFileBanner").attr("value");
    var data = $('#ddlParentCategory').select2('data');
    var ParentText;
    if (data !== null && data.length > 0) {
        ParentText = data[0].text;
    } else {
        ParentText = '';
    }
    //ParentText = data[0].text;
    Description = $("#txtDescription").val();
    DisplayType = $("#ddlDisplayType").val();
    //var file = document.getElementById("ImageFile").files[0];
  
    if (CategoryName == "") { swal('Alert', 'Please enter category name', 'error').then(function () { swal.close(); $('#txtCategoryName').focus(); }) }
    else if (CategorySlug == "") { swal('Alert', 'Please enter category slug', 'error').then(function () { swal.close(); $('#txtCategorySlug').focus(); }) }
    else {
        var obj = { term_id: ID, name: CategoryName, slug: CategorySlug, parent: ParentCategory, ParentText: '', description: Description, display_type: DisplayType, thumbnail_id: Thumb, banner_id: Banner }
        obj.meta = [{ meta_key: 'banner_id', meta_value: Banner }, { meta_key: 'thumbnail_id', meta_value: Thumb }]
        //var obj = new FormData();
        //obj.append("ImageFile", file);
        //obj.append("term_id", ID);
        //obj.append("name", CategoryName);
        //obj.append("slug", CategorySlug);
        //obj.append("parent", ParentCategory);
        //obj.append("ParentText", ParentText);
        //obj.append("description", Description);
        //obj.append("display_type", DisplayType);
        //obj.append("Meta_id", Meta_id);
         
        $.ajax({
           // url: '/Product/AddProductCategory/', dataType: 'json', type: 'Post',
            url: '/Product/AddProductCategoryWithImage/',
            dataType: 'json',
            type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    $("#hfid").val('');
                    getParentCategory();
                    CategoryList();

                    $("#btnAddNewCategory").text('Add new category');
                    $("#lblNewCategory").text('Add new category');
                    $("#ProdCat").find(":input").each(function () {
                        switch (this.type) {
                            case "text": case "email": case "textarea": case "tel": $(this).val(''); case "file": $(this).val(''); break;
                        }
                    });
                    $("#ProdCat option[value='-1']").attr('selected', true)
                    $("#ddlDisplayType").val("products");
                    swal('Alert!', data.message, 'success');
                  
                }
                else { swal('Alert!', data.message, 'error') }
            },
            complete: function () { $("#loader").hide(); isEdit(false);},
            error: function (error) { swal('Error!', error.message, 'error'); },
        })
        
    }
});

$('#txtSearchCategory').keypress(function (e) {
    var key = e.which;
    if (key == 13)  // the enter key code
    {
        CategoryList();
        return false;
    }
});

$('#btnSearchCategory').click(function () {
    CategoryList();
})


function CategoryList() {
    var urid = "";
    ID = $("#hfid").val();
    var sid = $("#txtSearchCategory").val().trim();
    var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 50, sEcho: 1, SortCol: 'id', SortDir: 'desc', rowid: ID };
    console.log('hh');
    //$('#ProductCategory').DataTable({
    //    columnDefs: [{ "orderable": false, "targets": 0 }],
    //    order: [[1, "desc"]],
    //    destroy: true,
    //    bProcessing: true,
    //    bServerSide: false,
    //    searching: true,
    //    ordering: false,
    //    lengthChange: true,
    //    bAutoWidth: false,
    //    scrollX: false,
    //    lengthMenu: [[-1], ["All"]],
    //    sAjaxSource: "/Product/ProductCategoryList",
    //    fnServerData: function (sSource, aoData, fnCallback, oSettings) {
    //        var col = 'id';
    //        //if (oSettings.aaSorting.length >= 0) {
    //        //    var col = oSettings.aaSorting[0][0] == 1 ? "Name" : oSettings.aaSorting[0][0] == 2 ? "Description" : oSettings.aaSorting[0][0] == 3 ? "Slug" : oSettings.aaSorting[0][0] == 4 ? "Count" : "id";
    //        //    obj.SortCol = col; obj.SortDir = oSettings.aaSorting.length >= 0 ? oSettings.aaSorting[0][1] : "desc";
    //        //}
    //       /* obj.sEcho = aoData[0].value; obj.PageSize = oSettings._iDisplayLength; obj.PageNo = oSettings._iDisplayStart;*/
    //        $.ajax({
    //            type: "POST", url: sSource, async: true, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
    //            success: function (data) {
    //                var dtOption = { aaData: JSON.parse(data.aaData) };

    //                return fnCallback(dtOption);

    //            },
    //            error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
    //            async: false
    //        });
    //    },
    //    aoColumns: [
    //        {
    //            'data': 'ID', sWidth: "10%",
    //            'render': function (data, type, full, meta) {
    //                if (data == 80) {
    //                    return '<input type="checkbox" data-placement="left" title="Uncategories category can not edit and delete. it is a default category" data-toggle="tooltip" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '" disabled><label></label>';
    //                }
    //                else {
    //                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '" ><label></label>';
    //                }
    //            }
    //        },
    //        {
    //            "data": "ImagePath", sWidth: "10%",
    //            "render": function (data) {
    //                url = "../../Content/ProductCategory/" + data + "";
    //                //var result = checkFileExist(url);
    //                //if (result == true) { return '<img src=' + url + ' width="50" height="50"/>'; }
    //                //else if (data == null || data == "") { return '<img src="../../Content/ProductCategory/default.png" width="50" height="50"/>'; }
    //                //else { return '<img src="../../Content/ProductCategory/default.png" width="50" height="50"/>'; }
    //                if (data != null) { return '<img src=' + url + ' width="65" height="50"/>'; }
    //                else if (data == null || data == "") { return '<img src="../../Content/ProductCategory/default.png" width="50" height="50"/>'; }
    //                else { return '<img src="../../Content/ProductCategory/default.png" width="50" height="50"/>'; }
    //            }
    //        },
    //        {
    //            data: 'name', title: 'Name', sWidth: "15%",
    //            'render': function (id, type, full, meta) {
    //                /*  return  id;*/
    //                if (full.parent == 0)
    //                    return '<b>' + id + '</b>';
    //                else
    //                    return ' ' + space(full.level) + id + '';
    //            }
    //        },
    //        { data: 'description', title: 'Description', sWidth: "15%" },
    //        { data: 'slug', title: 'Slug', sWidth: "15%" },
    //        { data: 'count', title: 'Count', sWidth: "10%" },
    //        {
    //            'data': 'ID', sWidth: "10%",
    //            'render': function (id, type, full, meta) {
    //                if ($("#hfEdit").val() == "1") {
    //                    if (id == 80) {
    //                        return '<i class="glyphicon glyphicon-pencil" data-placement="left" title="Edit category" data-toggle="tooltip"></i>';
    //                    }
    //                    else {
    //                        return '<a href="#" onclick="GetCategoryByID(' + id + ');ActivityLog(\'Edit category\',\'/Product/ProductCategories/' + id +'\');"  data-placement="left" title="Edit category" data-toggle="tooltip"><i class="glyphicon glyphicon-pencil"></i></a>';
    //                    }
    //                }
    //                else { return "No Permission"; }
    //            }
    //        }
    //    ]
    //});


    $('#ProductCategory').DataTable({

        destroy: true, bProcessing: true, bServerSide: true,
        //sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true,
        order: [[1, "desc"]],
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
        sAjaxSource: "/Product/GetCategoryList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            //aoData.push({ name: "strValue1", value: monthYear });
            aoData.push({ name: "strValue1", value: '' });
            aoData.push({ name: "strValue2", value: '' });
            aoData.push({ name: "strValue3", value: '' });
            aoData.push({ name: "strValue4", value: '' });
            var col = 'id';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 1 ? "Name" : oSettings.aaSorting[0][0] == 2 ? "Description" : oSettings.aaSorting[0][0] == 3 ? "Slug" : "id";
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
        aoColumns: [
            {
                'data': 'ID', sWidth: "5%",
                'render': function (data, type, full, meta) {
                    if (data == 80) {
                        return '<input type="checkbox" data-placement="left" title="Uncategories category can not edit and delete. it is a default category" data-toggle="tooltip" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '" disabled><label></label>';
                    }
                    else {
                        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '" ><label></label>';
                    }
                }
            },
            {
                "data": "ImagePath", sWidth: "10%",
                "render": function (data) {
                    url = "../../Content/ProductCategory/" + data + "";
                    //var result = checkFileExist(url);
                    //if (result == true) { return '<img src=' + url + ' width="50" height="50"/>'; }
                    //else if (data == null || data == "") { return '<img src="../../Content/ProductCategory/default.png" width="50" height="50"/>'; }
                    //else { return '<img src="../../Content/ProductCategory/default.png" width="50" height="50"/>'; }
                    if (data != null) { return '<img src=' + url + ' width="65" height="50"/>'; }
                    else if (data == null || data == "") { return '<img src="../../Content/ProductCategory/default.png" width="50" height="50"/>'; }
                    else { return '<img src="../../Content/ProductCategory/default.png" width="50" height="50"/>'; }
                }
            },
            {
                data: 'name', title: 'Name', sWidth: "10%",
                'render': function (id, type, full, meta) {
                    /*  return  id;*/
                    if (full.parent == 0)
                        return '<b>' + id + '</b>';
                    else
                        return ' ' + space(full.level) + id + '';
                }
            },
            { data: 'description', title: 'Description', sWidth: "45%" },
            { data: 'slug', title: 'Slug', sWidth: "10%" },
            { data: 'count', title: 'Count', sWidth: "5%" },
            {
                'data': 'ID', sWidth: "5%",
                'render': function (id, type, full, meta) {
                    if ($("#hfEdit").val() == "1") {
                        if (id == 80) {
                            return '<i class="glyphicon glyphicon-pencil" data-placement="left" title="Edit category" data-toggle="tooltip"></i>';
                        }
                        else {
                            return '<a href="#" onclick="GetCategoryByID(' + id + ');ActivityLog(\'Edit category\',\'/Product/ProductCategories/' + id + '\');"  data-placement="left" title="Edit category" data-toggle="tooltip"><i class="glyphicon glyphicon-pencil"></i></a>';
                        }
                    }
                    else { return "No Permission"; }
                }
            }
        ],
        columnDefs: [{ "orderable": false, "targets": 0 }],
    });
}
//$('#checkAll').click(function () {
//    var isChecked = $(this).prop("checked");
//    $('#ProductCategory tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
//});
function Singlecheck() {
    var isChecked = $('#CheckSingle').prop("checked");
    var isHeaderChecked = $("#checkAll").prop("checked");
    if (isChecked == false && isHeaderChecked)
        $("#checkAll").prop('checked', isChecked);
    else {
        $('#ProductCategory tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkAll").prop('checked', isChecked);
    }
    isEdit(true);
}
$('#btnApply').click(function () {
    var id = "";
    var status = $('#ddlStatus').val();
    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        id += $(this).val() + ",";
    });
    id = id.replace(/,(?=\s*$)/, '');
   
    if (status == "2") {
        if (id == "") {
            swal('Error!', 'Please check product!!', 'error');
        }
        else {
            DeleteCategory(id);
        }
    }
})
function DeleteCategory(id) {
    var obj = { strVal: id }
    $.confirm({
        title: 'Confirm!',
        content: 'Do you want to delete category with related product?',
        buttons: {
            confirm: {
                text: 'Yes',
                btnClass: 'btn-default',
                keys: ['enter', 'shift'],
                action: function () {
                    ActivityLog('Category (' + id + ') deleted with related product', '/Product/ProductCategories/' + id + '');
                    $.ajax({
                        url: '/Product/DeleteCategorywithProduct/', dataType: 'json', type: 'Post',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(obj),
                        dataType: "json",
                        beforeSend: function () { $("#loader").show(); },
                        success: function (data) {
                            if (data.status == true) {
                                CategoryList();
                                getParentCategory();
                                swal('Alert!', data.message, 'success');
                            }
                            else {
                                swal('Alert!', data.message, 'error')
                            }
                        },
                        complete: function () { $("#loader").hide(); },
                        error: function (error) {
                            swal('Error!', 'something went wrong', 'error');
                        },
                    })
                }
            },
            somethingElse: {
                text: 'No',
                btnClass: 'btn-blue',
                action: function () {
                    ActivityLog('Category (' + id + ') deleted', '/Product/ProductCategories/' + id + '');
                    $.ajax({
                        url: '/Product/DeleteProductCategory/', dataType: 'json', type: 'Post',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(obj),
                        dataType: "json",
                        beforeSend: function () { $("#loader").show(); },
                        success: function (data) {
                            if (data.status == true) {
                                CategoryList();
                                getParentCategory();
                                swal('Alert!', data.message, 'success');
                            }
                            else {
                                swal('Alert!', data.message, 'error')
                            }
                        },
                        complete: function () { $("#loader").hide(); },
                        error: function (error) {
                            swal('Error!', 'something went wrong', 'error');
                        },
                    })
                }
            },
            cancel: {
                text: 'Cancel',
                btnClass: 'btn-danger',
                action: function () {
                    //do something here
                },
            }
        }
    });
}
function GetCategoryByID(id) {
    // getParentCategory(id);
    var obj =
        $.ajax({
            url: "/Product/GetCategoryByID/" + id,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                var d = JSON.parse(data);
                if (d.length > 0) {
                     //getParentCategory();
                    $('#ddlParentCategory').select2();
                    console.log(d[0].parent);
                    if (d[0].parent > 0) {
                        $("#ddlParentCategory").empty().append('<option value="' + d[0].parent + '" selected>' + d[0].parentname + '</option>');
                    }
                  else
                    {
                        $("#ddlParentCategory").empty();
                    }
                    let url = 'https:\\\\editor.prosourcediesel.com\\wp-content\\uploads/';
                    $("#btnAddNewCategory").text('Update category');
                    $("#btnAddNewCategory").css('cursor', 'pointer').attr('title', '');
                    $("#btnAddNewCategory").css('cursor', 'pointer').attr('title', 'Update category');
                    //$("#btnAddNewCategory").css('cursor', 'pointer').attr('data-toggle', 'tooltip');
                    $("#lblNewCategory").text('Update category');
                    $("#txtCategoryName").val(d[0].name);
                    $("#txtCategorySlug").val(d[0].slug);
                  
                    $("#hfid").val(d[0].ID);
                    $("#hfMetaid").val(d[0].ThumbnailID);


                    $("#ddlDisplayType").val(d[0].DisplayType);
                    $("#txtDescription").val(d[0].description);
                    if (d[0].ThumbnailID != null) {
                        $("#getImageFileThumbnail").attr("src", url + d[0].thumurl);
                        $("#getImageFileThumbnail").attr("value", d[0].ThumbnailID);
                    } else {
                        $("#getImageFileThumbnail").attr("src", "/Images/varient_pic.png");
                   // $("#getImageFileThumbnail").attr("value", d[0].ThumbnailID);
                    }
                    if (d[0].banner_id != null) {
                        $("#getImageFileBanner").attr("src", url + d[0].bannerurl);
                        $("#getImageFileBanner").attr("value", d[0].banner_id);
                    } else {
                        $("#getImageFileBanner").attr("src", "/Images/varient_pic.png");
                        //$("#getImageFileBanner").attr("value", d[0].banner_id);
                    }
                 
                }
                $("#ProdCatAdd *").children().prop('disabled', false);
            },
            complete: function () { $("#loader").hide(); getParentCategory();},
            error: function (msg) {

            }
        });
    isEdit(true);
}
$('#btnReset').click(function () {
    $("#hfid").val('');
    $("#hfMetaid").val('');
    $("#btnAddNewCategory").text('Add new category');
    $("#lblNewCategory").text('Add new category');
    $("#getImageFileThumbnail").attr("src", "/Images/varient_pic.png");
    $("#getImageFileBanner").attr("src", "/Images/varient_pic.png");
    $("#ProdCat").find(":input").each(function () {
        switch (this.type) {
            case "text": case "email": case "textarea": case "tel": $(this).val(''); case "file": $(this).val(''); break;
        }
    });
    $("#ProdCat option[value='0']").attr('selected', true)
    $("#ddlDisplayType").val("products");
    $("#ddlParentCategory").empty();
})

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

function UploadFile()
{
    $(".MLibrary").hide();
    $(".Upload").show();
    $("#useImgThumb").attr('onclick', 'UseImagemyFitureThumbnailFile()');
    $("#useImgThumb").text('Upload Image');
    $("#useImgBanner").attr('onclick', 'UseImagemyBannerFile()');
    $("#useImgBanner").text('Upload Image');
}
function MediaLibrary(load)
{
    //debugger;
    let obj = {};
    $(".Upload").hide();
    $("#useImgThumb").attr('onclick', 'UseImagemyFitureThumbnail()');
    $("#useImgThumb").text('Use Image');
    $("#useImgBanner").attr('onclick', 'UseImagemyBanner()');
    $("#useImgBanner").text('Use Image');
    if (load == '0') {
       
        var company = null;
        let prodctype = '0';
        let stockstatus = '0';
        let order_type = '';
        let iDisplayStart = 0;
        let iSortCol_0 = 80;
         obj = { strValue1: company, strValue2: order_type, strValue3: prodctype, strValue4: stockstatus, iSortCol_0: iSortCol_0, iDisplayStart: iDisplayStart };

    }
    else {
       
        var company = null;
        let prodctype = '0';
        let stockstatus = '0';
        let order_type = '';
        let iDisplayStart = $("#fromcolom").val();
        let iSortCol_0 = Number(iDisplayStart) +80;
         obj = { strValue1: company, strValue2: order_type, strValue3: prodctype, strValue4: stockstatus, iSortCol_0: iSortCol_0, iDisplayStart: iDisplayStart };

    }

    //let obj = { strValue1: company, strValue2: order_type, strValue3: prodctype, strValue4: stockstatus, iSortCol_0: iSortCol_0, iDisplayStart: iDisplayStart };
    $.ajax({
        url: '/Product/GetMediaLibrary/',
        dataType: 'json',
        type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
          //  debugger;
            // var data = [];
            $("#tocolom").val(data.ToColom);
            $("#fromcolom").val(data.FromColom);
            var fromColom = data.FromColom;
            var TotalData = data.recordsFiltered;
            $(".totalData").text("Showing " + fromColom + " of " + TotalData + " media items");
           // var url = window.location.origin + "/Content/Media/";
            var url = "https:\\\\editor.prosourcediesel.com\\wp-content\\uploads/";
            var v = JSON.parse(data.aaData);
           // var p = v[0].ID;
            for (i = 0; i < v.length; i++) {
                //console.log(v[i].file_name);
                if (i != 0) {
                    var p = i % 4;
                    if (p == 0) {
                        for (j = i; j < i + 1; j++) {
                         //   var url = "https:\\\\editor.prosourcediesel.com\\wp-content\\uploads/";
                            var image = url + v[i].file_name;
                            var html = "<li tabindex='0' aria-label='trim' role='checkbox' aria-checked='true' data-id='" + v[i].ID + "'> <div style=' margin:5px;'><input type='checkbox' name='check' class='categories' onclick='SingleClick(this); value=" + v[i].ID + "," + image +"/><img src=" + image + "  height='150' width='150' value='1' /></div></li>";
                            $(".MLibraryThumb").append(html);
                        }
                    }
                }
               // var url = "https:\\\\editor.prosourcediesel.com\\wp-content\\uploads/";
          
                var image = url + v[i].file_name;
                var html = "<li tabindex='0' aria-label='trim' role='checkbox' aria-checked='true' data-id='" + v[i].ID + "'><div style=' float:left; margin:5px;'><input type='checkbox' name='check' class='categories' onclick='SingleClick(this);' value=" + v[i].ID + "," + image +" /><img src=" + image + "  height='150' width='150' value='1' /></div></li>";
              
                $(".MLibraryThumb").append(html);
            }
        }
    });
    $(".MLibrary").show();
    $("#loader").hide();

}

function SingleClick(checkbox) {
    var checkboxes = document.getElementsByName('check')
    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false
    })
}

function UseImagemyBanner() {
   // debugger;
    var imgData = [];
    var value = $("input[name='check']:checked").val();
    imgData = value.split(',');
    var imgId = imgData[0];
    var imgName = imgData[1];
    $("#getImageFileBanner").attr("src", imgName);
    $("#getImageFileBanner").attr("value", imgId);
    
}

function UseImagemyFitureThumbnail() {
   // debugger;
    var value = $("input[name='check']:checked").val();
    imgData = value.split(',');
    var imgId = imgData[0];
    var imgName = imgData[1];
    $("#getImageFileThumbnail").attr("src", imgName);
    $("#getImageFileThumbnail").attr("value", imgId);
}

function UseImagemyFitureThumbnailFile() {
    //debugger;
    var input = document.getElementById("FileUploadThumbnail");
    Add(input);
}

function UseImagemyBannerFile() {
   // debugger;
    var input = document.getElementById("FileUploadBanner");
    Add(input);
}

function Add(input) {
    //debugger;
    entity = 1;
    ID = 0;
    if (entity == 0) {
        swal('Alert', 'Please select store!', 'error').then(function () { swal.close(); $('#ddlcompany').focus(); });
    }
    else {
        //debugger;
        var obj = new FormData();

        // Get the first selected file
        var file = input.files[0];

        if (input.files && input.files.length > 1) {
            // If multiple files are selected, append all selected files
            for (var i = 0; i < input.files.length; i++) {
                obj.append("ImageFiles", input.files[i]);
            }
        } else if (file) {
            // If only one file is selected, append the single file
            obj.append("ImageFiles", file);
        }

        obj.append("ID", parseInt(ID) || 0);
        obj.append("entity_id", entity);

        $.ajax({
            url: '/Product/CreateProductCategoriesImg/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: obj,
            processData: false,
            contentType: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
            
                if (data.status == true) {
                    var data = JSON.parse(data.Result);
                    var img = data[0].img;
                    var id = data[0].id;
                    //var filethumb = document.getElementById("FileUploadThumbnail");
                    var thumb = $("#FileUploadThumbnail").val();
                    //var fileBanner = document.getElementById("FileUploadBanner");
                    //var Banner = fileBanner.files[0];
                    var url = "https:\\\\editor.prosourcediesel.com\\wp-content\\uploads/";
                   // var url = "../Content/Media/";
                    if (thumb == '')
                    {
                       // if (img != null) {
                            $("#getImageFileBanner").attr("src", url + img);
                            $("#getImageFileBanner").attr("value", id);
                            $("#FileUploadBanner").val('');
                        //}
                        //else
                        //{
                        //    $("#getImageFileBanner").attr("src", "/Images/varient_pic.png");
                        //    $("#FileUploadBanner").val('');
                        //}
                     
                    }
                    else
                    {
                       // if (img != null) {
                            $("#getImageFileThumbnail").attr("src", url + img);
                            $("#getImageFileThumbnail").attr("value", id);
                            $("#FileUploadThumbnail").val('');
                        //}
                        //else {
                        //    $("#getImageFileThumbnail").attr("src", "/Images/varient_pic.png");

                        //    $("#FileUploadThumbnail").val('');
                        //}
                      
                    }

                    if (data.url == "Pages") {
                       // swal('Success!', data.message, 'success').then((result) => { location.href = '../Mediagallery'; });
                        swal('Success!', data.message, 'success');
                    }
                    else {
                        //swal('Success!', data.message, 'success').then((result) => { location.href = '../Mediagallery'; });
                        swal('Success!', data.message, 'success');
                    }
                }
                else { swal('Alert!', data.message, 'error') }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', error.message, 'error'); },
        })
    }
}