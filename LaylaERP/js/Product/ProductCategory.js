
$(document).ready(function () {
    $("#loader").hide();
    $(".select2").select2();
    getParentCategory();
    CategoryList();
})

function getParentCategory(id) {
    var obj = { strValue1: id };
    $.ajax({
        url: "/Product/GetParentCategory/" + id,
        type: "Get",
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var opt = '<option value="-1">Please Select Parent category</option>';
            for (var i = 0; i < data.length; i++) { opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>'; }
                $('#ddlParentCategory').html(opt);
        }
    });
}
$('#btnAddNewCategory').click(function () {
    ID = $("#hfid").val();
    Meta_id = $("#hfMetaid").val();
    CategoryName = $("#txtCategoryName").val();
    CategorySlug = $("#txtCategorySlug").val();
    ParentCategory = $("#ddlParentCategory").val();
    Description = $("#txtDescription").val();
    DisplayType = $("#ddlDisplayType").val();
    var file = document.getElementById("ImageFile").files[0];
    if (CategoryName == "") { swal('alert', 'Please Enter Category Name', 'error').then(function () { swal.close(); $('#txtCategoryName').focus(); }) }
    else if (CategorySlug == "") { swal('alert', 'Please Enter Category Slug', 'error').then(function () { swal.close(); $('#txtCategorySlug').focus(); }) }
    else {
        var obj = new FormData();
        obj.append("ImageFile", file);
        obj.append("term_id", ID);
        obj.append("name", CategoryName);
        obj.append("slug", CategorySlug);
        obj.append("parent", ParentCategory);
        obj.append("description", Description);
        obj.append("display_type", DisplayType);
        obj.append("Meta_id", Meta_id);
        $.ajax({
            url: '/Product/AddProductCategory/', dataType: 'json', type: 'Post',
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
                    $("#ddlDisplayType").val("");
                    swal('Alert!', data.message, 'success');
                }
                else { swal('Alert!', data.message, 'error') }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', error.message, 'error'); },
        })
    }
});
$('#btnSearchCategory').click(function () {
    CategoryList();
})
function CategoryList() {
    var urid = "";
    ID = $("#hfid").val();
    var sid = $("#txtSearchCategory").val();
    var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 50, sEcho: 1, SortCol: 'id', SortDir: 'desc', rowid: ID };
    $('#ProductCategory').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        sPaginationType: "full_numbers", searching: false, ordering: false, lengthChange: true, "paging": true,
        bAutoWidth: false, scrollX: false,
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        sAjaxSource: "/Product/ProductCategoryList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 1 ? "Name" : oSettings.aaSorting[0][0] == 2 ? "Description" : oSettings.aaSorting[0][0] == 3 ? "Slug" : oSettings.aaSorting[0][0] == 4 ? "Count" : "id";
                obj.SortCol = col; obj.SortDir = oSettings.aaSorting.length >= 0 ? oSettings.aaSorting[0][1] : "desc";
            }
            obj.sEcho = aoData[0].value; obj.PageSize = oSettings._iDisplayLength; obj.PageNo = oSettings._iDisplayStart;
            $.ajax({
                type: "POST", url: sSource, async: true, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
                success: function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, iTotalRecords: data.iTotalRecords, iTotalDisplayRecords: data.iTotalDisplayRecords, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
                async: false
            });
        },
        aoColumns: [

            {
                'data': 'ID', sWidth: "5%   ",
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '"><label></label>';
                }
            },
            {
                "data": "ImagePath",
                "render": function (data) {
                  url = "../../Content/ProductCategory/" + data + "";
                    var result = checkFileExist(url);
                    if (result == true) {return '<img src=' + url + ' width="50" height="50"/>';}
                    else if (data == null || data == "") {return '<img src="../../Content/ProductCategory/default.png" width="50" height="50"/>';}
                    else { return '<img src="../../Content/ProductCategory/default.png" width="50" height="50"/>'; }
                }
            },
            {
                data: 'name', title: 'Name', sWidth: "25%",
                'render': function (id, type, full, meta) {
                  /*  return  id;*/
                    if (full.parent == 0)
                        return '<b>' + id + '</b>';
                    else
                        return ' ' + id + '';
                }
            },
            { data: 'description', title: 'Description', sWidth: "25%" },
            { data: 'slug', title: 'Slug', sWidth: "25%" },
            { data: 'count', title: 'Count', sWidth: "25%" },
            {
                'data': 'ID',
                'render': function (id, type, full, meta) {
                    return '<a href="#" onclick="GetCategoryByID(' + id + ');"><i class="glyphicon glyphicon-pencil"></i></a>';
                }
            }
        ]
    });
}
$('#checkAll').click(function () {
    var isChecked = $(this).prop("checked");
    $('#ProductCategory tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
});
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
}
$('#btnApply').click(function () {
    var id = "";
    var status = $('#ddlStatus').val();
    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        id += $(this).val() + ",";
    });
    id = id.replace(/,(?=\s*$)/, '');
    if (status == "2") {
        DeleteCategory(id);
    }
})
function DeleteCategory(id) {

    var obj = { strVal: id }
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
function GetCategoryByID(id) {
    getParentCategory(id);
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

                    $("#btnAddNewCategory").text('Update category');
                    $("#lblNewCategory").text('Update category');
                    $("#txtCategoryName").val(d[0].name);
                    $("#txtCategorySlug").val(d[0].slug);
                    $("#ddlParentCategory").val(d[0].parent == "" ? "-1" : d[0].parent);
                    $("#hfid").val(d[0].ID);
                    $("#hfMetaid").val(d[0].ThumbnailID);


                    $("#ddlDisplayType").val(d[0].DisplayType);
                    $("#txtDescription").val(d[0].description);
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (msg) {

            }
        });

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
    $("#ProdCat option[value='-1']").attr('selected', true)
    $("#ddlDisplayType").val("");
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