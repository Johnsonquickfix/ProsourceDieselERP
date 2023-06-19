
$(document).ready(function () {
    $("#loader").hide();

    var urlpath = window.location.pathname;
    CheckPermissions("#btnAddCategory, #btnReset,#btnApply", "#hfEdit", "", urlpath); 

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
    $.ajax({
        url: "/CMS/GetParentCategoryList/" + id,
        type: "Get",
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            var opt = '<option value="0">Please select parent category</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].ID + '">' + space(data[i].level) + data[i].name + '</option>';
            }
            $('#ddlParentCategory').html(opt);
            // isEdit(true);
            $("#ProdCatAdd *").children().prop('disabled', true);
        }
    });
}
$('#btnAddNewCategory').click(function () {
    ID = $("#hfid").val();
    Meta_id = $("#hfMetaid").val();
    CategoryName = $("#txtCategoryName").val().trim();
    CategorySlug = $("#txtCategorySlug").val();
    ParentCategory = $("#ddlParentCategory").val();
    var data = $('#ddlParentCategory').select2('data');
    ParentText = data[0].text;
    Description = $("#txtDescription").val();
    DisplayType = $("#ddlDisplayType").val();
    //var file = document.getElementById("ImageFile").files[0];

    if (CategoryName == "") { swal('Alert', 'Please enter category name', 'error').then(function () { swal.close(); $('#txtCategoryName').focus(); }) }
    else if (CategorySlug == "") { swal('Alert', 'Please enter category slug', 'error').then(function () { swal.close(); $('#txtCategorySlug').focus(); }) }
    else {
        var obj = new FormData();
       // obj.append("ImageFile", file);
        obj.append("term_id", ID);
        obj.append("name", CategoryName);
        obj.append("slug", CategorySlug);
        obj.append("parent", ParentCategory);
        obj.append("ParentText", ParentText);
        obj.append("description", Description);
        obj.append("display_type", DisplayType);
        obj.append("Meta_id", Meta_id);
        $.ajax({
            url: '/CMS/AddProductCategory/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: obj,
            processData: false,
            contentType: false,
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
                   // $("#ddlDisplayType").val("products");
                    swal('Alert!', data.message, 'success');

                }
                else { swal('Alert!', data.message, 'error') }
            },
            complete: function () { $("#loader").hide(); isEdit(false); },
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
    $('#ProductCategory').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: false,
        sPaginationType: "full_numbers", searching: true, ordering: false, lengthChange: true, "paging": true,
        bAutoWidth: false, scrollX: false,
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        sAjaxSource: "/CMS/CategoryList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            var col = 'id';
            //if (oSettings.aaSorting.length >= 0) {
            //    var col = oSettings.aaSorting[0][0] == 1 ? "Name" : oSettings.aaSorting[0][0] == 2 ? "Description" : oSettings.aaSorting[0][0] == 3 ? "Slug" : oSettings.aaSorting[0][0] == 4 ? "Count" : "id";
            //    obj.SortCol = col; obj.SortDir = oSettings.aaSorting.length >= 0 ? oSettings.aaSorting[0][1] : "desc";
            //}
            /* obj.sEcho = aoData[0].value; obj.PageSize = oSettings._iDisplayLength; obj.PageNo = oSettings._iDisplayStart;*/
            $.ajax({
                type: "POST", url: sSource, async: true, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
                success: function (data) {
                    var dtOption = { aaData: JSON.parse(data.aaData) };

                    return fnCallback(dtOption);

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
                async: false
            });
        },
        aoColumns: [
            {
                'data': 'ID', sWidth: "10%",
                'render': function (data, type, full, meta) {
                    if (data == 80) {
                        return '<input type="checkbox" data-placement="left" title="Uncategories category can not edit and delete. it is a default category" data-toggle="tooltip" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '" disabled><label></label>';
                    }
                    else {
                        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '" ><label></label>';
                    }
                }
            },
            //{
            //    "data": "ImagePath", sWidth: "10%",
            //    "render": function (data) {
            //        url = "../../Content/ProductCategory/" + data + "";
            //        //var result = checkFileExist(url);
            //        //if (result == true) { return '<img src=' + url + ' width="50" height="50"/>'; }
            //        //else if (data == null || data == "") { return '<img src="../../Content/ProductCategory/default.png" width="50" height="50"/>'; }
            //        //else { return '<img src="../../Content/ProductCategory/default.png" width="50" height="50"/>'; }
            //        if (data != null) { return '<img src=' + url + ' width="65" height="50"/>'; }
            //        else if (data == null || data == "") { return '<img src="../../Content/ProductCategory/default.png" width="50" height="50"/>'; }
            //        else { return '<img src="../../Content/ProductCategory/default.png" width="50" height="50"/>'; }
            //    }
            //},
            {
                data: 'name', title: 'Name', sWidth: "15%",
                'render': function (id, type, full, meta) {
                    /*  return  id;*/
                    if (full.parent == 0)
                        return '<b>' + id + '</b>';
                    else
                        return ' ' + space(full.level) + id + '';
                }
            },
            { data: 'description', title: 'Description', sWidth: "15%" },
            { data: 'slug', title: 'Slug', sWidth: "15%" },
            { data: 'count', title: 'Count', sWidth: "10%" },
            {
                'data': 'ID', sWidth: "10%",
                'render': function (id, type, full, meta) {
                    //if ($("#hfEdit").val() == "1") {
                    //    if (id == 80) {
                    //        return '<i class="glyphicon glyphicon-pencil" data-placement="left" title="Edit category" data-toggle="tooltip"></i>';
                    //    }
                    //    else {
                            return '<a href="#" onclick="GetCategoryByID(' + id + ');ActivityLog(\'Edit category\',\'/CMS/PageCategories/' + id + '\');"  data-placement="left" title="Edit category" data-toggle="tooltip"><i class="glyphicon glyphicon-pencil"></i></a>';
                    //    }
                    //}
                    //else { return "No Permission"; }
                }
            }
        ]
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
        content: 'Do you want to delete category with related post?',
        buttons: {
            confirm: {
                text: 'Yes',
                btnClass: 'btn-default',
                keys: ['enter', 'shift'],
                action: function () {
                    ActivityLog('Category (' + id + ') deleted with related product', '/CMS/ProductCategories/' + id + '');
                    $.ajax({
                        url: '/CMS/DeleteCategorywithProduct/', dataType: 'json', type: 'Post',
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
                    ActivityLog('Category (' + id + ') deleted', '/CMS/PostCategories/' + id + '');
                    $.ajax({
                        url: '/CMS/DeleteProductCategory/', dataType: 'json', type: 'Post',
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
            url: "/CMS/GetCategoryByID/" + id,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                var d = JSON.parse(data);
                if (d.length > 0) {
                    $("#ddlParentCategory").val(d[0].parent).trigger("change");
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

                }
                $("#ProdCatAdd *").children().prop('disabled', false);
            },
            complete: function () { $("#loader").hide(); },
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
    $("#ProdCat").find(":input").each(function () {
        switch (this.type) {
            case "text": case "email": case "textarea": case "tel": $(this).val(''); case "file": $(this).val(''); break;
        }
    });
    $("#ProdCat option[value='0']").attr('selected', true)
    $("#ddlDisplayType").val("products");
    $("#ddlParentCategory").val("0").trigger("change");
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