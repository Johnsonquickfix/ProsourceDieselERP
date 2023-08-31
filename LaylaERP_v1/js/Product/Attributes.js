
$(document).ready(function () {
    $("#loader").hide();
    var urlpath = window.location.pathname;
    //CheckPermissions("#btnAddAttributes, #btnReset,#btnApply", "#hfEdit", "", urlpath);
    $(".select2").select2();
    AttributesList();

    //isEdit(true);
})

$('#btnAddAttributes').click(function () {
    $("#ProdCatAdd *").children().prop('disabled', false);
    //$('[data-toggle="tooltip"]').tooltip();
    $("#btnAddNewAttributes").css('cursor', 'pointer').attr('title', 'Create a new Attributes');
    //$("#btnAddNewAttributes").css('cursor', 'pointer').attr('data-toggle', 'tooltip');
    //title = "" data-toggle="tooltip"
    isEdit(true);
});

function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}

$('#txtAttributesName').keyup(function (event) {
    var textBox = event.target;
    var start = textBox.selectionStart;
    var end = textBox.selectionEnd;
    textBox.value = textBox.value.charAt(0).toUpperCase() + textBox.value.slice(1);
    textBox.setSelectionRange(start, end);

    var cat = $('#txtAttributesName').val().toLowerCase().trim();
    cat = cat.replace(/\s/g, '-');
    $('#txtAttributesSlug').val(cat);
    isEdit(true);
});


$('#txtAttributeseditName').keyup(function (event) {
    var textBox = event.target;
    var start = textBox.selectionStart;
    var end = textBox.selectionEnd;
    textBox.value = textBox.value.charAt(0).toUpperCase() + textBox.value.slice(1);
    textBox.setSelectionRange(start, end);

    var cat = $('#txtAttributeseditName').val().toLowerCase().trim();
    cat = cat.replace(/\s/g, '-');
    $('#txtAttributeseditSlug').val(cat);
    isEdit(true);
});

function space(noOfSpaces) {
    var space = "# ", returnValue = "";
    for (var index = 0; index < noOfSpaces; index++) {
        returnValue += space;
    }
    return returnValue;
}
 
$('#btnAddNewAttributes').click(function () {
    ID = parseInt($("#hfid").val()) || 0;
    console.log($("#hfid").val());
    Meta_id = $("#hfMetaid").val();
    AttributesName = $("#txtAttributesName").val().trim();
    AttributesSlug = $("#txtAttributesSlug").val(); 
    _type = $("#ddltype").val();
    _orderby = $("#ddlsortorder").val();
    var isChecked = $('#chkenable').is(':checked');
    if (isChecked) {
        _publish = "1";
    } else {
        _publish = "0";
    }    
    if (AttributesName == "") { swal('Alert', 'Please enter Attributes name', 'error').then(function () { swal.close(); $('#txtAttributesName').focus(); }) }
    else if (AttributesSlug == "") { swal('Alert', 'Please enter Attributes slug', 'error').then(function () { swal.close(); $('#txtAttributesSlug').focus(); }) }
    else {
        var obj = new FormData();
        // obj.append("ImageFile", file);
        obj.append("term_id", ID);
        obj.append("name", AttributesName);
        obj.append("slug", AttributesSlug);
        obj.append("_type", _type);
        obj.append("_orderby", _orderby);
        //obj.append("description", Description);
        obj.append("_publish", _publish);
        obj.append("old_slug", Meta_id);
        $.ajax({
            url: '/Product/AddProductAttributes/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: obj,
            processData: false,
            contentType: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    $("#hfid").val('');
                    $("#hfMetaid").val('');
                    AttributesList(); 
                    $("#btnAddNewAttributes").text('Add new Attributes');
                    $("#lblNewAttributes").text('Add new Attributes');
                    $("#Prodatt").find(":input").each(function () {
                        switch (this.type) {
                            case "text": case "checkbox": case "textarea": case "tel": $(this).val(''); case "file": $(this).val(''); break;
                        }
                    });
                    //$("#ProdCat option[value='-1']").attr('selected', true)
                    $("#ddltype").val("select");
                    $("#ddlsortorder").val("menu_order");
                    $("#chkenable").prop("checked", false);
                    swal('Alert!', data.message, 'success');

                }
                else { swal('Alert!', data.message, 'error') }
            },
            complete: function () { $("#loader").hide(); isEdit(false); },
            error: function (error) { swal('Error!', error.message, 'error'); },
        })

    }
});

$('#txtSearchAttributes').keypress(function (e) {
    var key = e.which;
    if (key == 13)  // the enter key code
    {
        AttributesList();
        return false;
    }
});

$('#btnSearchAttributes').click(function () {
    AttributesList();
})


function AttributesList() {
    var urid = "";
    ID = $("#hfid").val();
    //var sid = $("#txtSearchAttributes").val().trim();
    var sid = "";
    var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 50, sEcho: 1, SortCol: 'id', SortDir: 'desc', rowid: ID };
    $('#ProductAttributes').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: false,
        sPaginationType: "full_numbers", searching: true, ordering: false, lengthChange: true, "paging": true,
        bAutoWidth: false, scrollX: false,
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        sAjaxSource: "/Product/AttributesList",
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
            //{
            //    'data': 'attribute_id', sWidth: "10%",
            //    'render': function (data, type, full, meta) {
            //        if (data == 80) {
            //            return '<input type="checkbox" data-placement="left" title="Uncategories Attributes can not edit and delete. it is a default Attributes" data-toggle="tooltip" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '" disabled><label></label>';
            //        }
            //        else {
            //            return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '" ><label></label>';
            //        }
            //    }
            //},
             
            {
                'data': 'attribute_id', sWidth: "10%",
                'render': function (id, type, full, meta) {
                    return '<a href="#" onclick="DeleteAttributes(' + id + ');ActivityLog(\'Delete Attributes\',\'/Product/Attributes/' + id + '\');"  data-placement="left" title="Delete Attributes" data-toggle="tooltip"><i class="glyphicon glyphicon-trash"></i></a>';
                }
            },
            { data: 'attribute_label', title: 'Name', sWidth: "15%" },
            { data: 'attribute_name', title: 'Slug', sWidth: "15%" },
            { data: 'attribute_type', title: 'Type', sWidth: "10%" },
            /*{ data: 'terms', title: 'Terms', sWidth: "50%" },*/
            {
                'data': 'terms', sWidth: "50%",
                //'render': function (id, type, full, meta) {

                //    return id + ' <span title="Click here to Configure terms" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="model(' + full.attribute_id + ');" ><i class="glyphicon glyphicon-eye-open"></i></a>Configure terms</span>';

                //}
                'render': function (terms, type, full, meta) {
                    if (terms) {
                        return terms + ' <span title="Click here to Configure terms" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="model(\'' + full.attribute_name + '\');" ><i></i> Configure terms</a></span>';
                    } else {
                        return ' <span title="Click here to Configure terms" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="model(\'' + full.attribute_name + '\');" ><i></i> Configure terms</a></span>';
                    }
                }
            },
            //Configure terms
            {
                'data': 'attribute_id', sWidth: "10%",
                'render': function (id, type, full, meta) {
                     
                    return '<a href="#" onclick="GetAttributesByID(' + id + ');ActivityLog(\'Edit Attributes\',\'/Product/Attributes/' + id + '\');"  data-placement="left" title="Edit Attributes" data-toggle="tooltip"><i class="glyphicon glyphicon-pencil"></i></a>';
                      
                }
            }
        ]
    });
}
 
function Singlecheck() {
    var isChecked = $('#CheckSingle').prop("checked");
    var isHeaderChecked = $("#checkAll").prop("checked");
    if (isChecked == false && isHeaderChecked)
        $("#checkAll").prop('checked', isChecked);
    else {
        $('#ProductAttributes tr:has(td)').find('input[type="checkbox"]').each(function () {
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
            DeleteAttributes(id);
        }
    }
})
function DeleteAttributes(id) {
    var obj = { strVal: id }
    $.confirm({
        title: 'Confirm!',
        content: 'Do you want to delete Attributes with related product?',
        buttons: {
            confirm: {
                text: 'Yes',
                btnClass: 'btn-default',
                keys: ['enter', 'shift'],
                action: function () {
                    ActivityLog('Attributes (' + id + ') deleted with related product', '/Product/ProductCategories/' + id + '');
                    $.ajax({
                        url: '/Product/DeleteAttributes/', dataType: 'json', type: 'Post',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(obj),
                        dataType: "json",
                        beforeSend: function () { $("#loader").show(); },
                        success: function (data) {
                            if (data.status == true) {
                                AttributesList(); 
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
            //somethingElse: {
            //    text: 'No',
            //    btnClass: 'btn-blue',
            //    action: function () {
            //        ActivityLog('Attributes (' + id + ') deleted', '/CMS/PostCategories/' + id + '');
            //        $.ajax({
            //            url: '/CMS/DeleteProductAttributes/', dataType: 'json', type: 'Post',
            //            contentType: "application/json; charset=utf-8",
            //            data: JSON.stringify(obj),
            //            dataType: "json",
            //            beforeSend: function () { $("#loader").show(); },
            //            success: function (data) {
            //                if (data.status == true) {
            //                    AttributesList();
            //                    getParentAttributes();
            //                    swal('Alert!', data.message, 'success');
            //                }
            //                else {
            //                    swal('Alert!', data.message, 'error')
            //                }
            //            },
            //            complete: function () { $("#loader").hide(); },
            //            error: function (error) {
            //                swal('Error!', 'something went wrong', 'error');
            //            },
            //        })
            //    }
            //},
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
function GetAttributesByID(id) {
    // getParentAttributes(id);
    //var checkbox = document.getElementById("enable_archive");
    var obj =
        $.ajax({
            url: "/Product/GetAttributesByID/" + id,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                var d = JSON.parse(data);
                if (d.length > 0) { 
                    var orderby = d[0].attribute_orderby;
                    console.log(orderby);
                    $("#ddlsortorder").val(orderby).trigger("change");
                    $("#ddltype").val(d[0].attribute_type).trigger("change");
                    $("#btnAddNewAttributes").text('Update Attributes');
                    $("#btnAddNewAttributes").css('cursor', 'pointer').attr('title', '');
                    $("#btnAddNewAttributes").css('cursor', 'pointer').attr('title', 'Update Attributes');
                    //$("#btnAddNewAttributes").css('cursor', 'pointer').attr('data-toggle', 'tooltip');
                    $("#lblNewAttributes").text('Update Attributes');
                    $("#txtAttributesName").val(d[0].attribute_label);
                    $("#txtAttributesSlug").val(d[0].attribute_name);
                    $("#hfid").val(id);
                    $("#hfMetaid").val(d[0].attribute_label);
                    //setTimeout(function () {  }, 1000); 
                    if (d[0].attribute_public == 1) {
                        console.log(1);
                        // Check the checkbox
                        $("#chkenable").prop("checked", true);
                    }
                    else {
                        console.log(2);
                        $("#chkenable").prop("checked", false);
                    }
                }
               // $("#ProdCatAdd *").children().prop('disabled', false);
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
    $("#txtAttributesName").val('');
    $("#txtAttributesSlug").val('');
    $("#btnAddNewAttributes").text('Add new Attributes');
    $("#lblNewAttributes").text('Add new Attributes');
   
    //$("#ProdCat option[value='-1']").attr('selected', true)
    $("#ddltype").val("select");
    $("#ddlsortorder").val("menu_order");
    $("#chkenable").prop("checked", false);
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

function model(Attribute_id) {
    $("#hfeditMetaid").val(Attribute_id);
    $("#txtAttributeseditName").val('');
    $("#txtAttributeseditSlug").val('');
    $("#txtdescription").val('');
    $("#hfeditid").val('');
    //$("#hfeditMetaid").val('');
    //$("#hfaccountid").val(account_num);
    $('#AttributesModal').modal('show');
    AttributesEditList(Attribute_id);    
    //setTimeout(function () { AccountBalanceList(account_num, true) }, 1000);
     
}

function AttributesEditList(id) {
    var urid = "";    
    var sid = "";  
    var obj = { user_status: urid, Search: id, PageNo: 0, PageSize: 50, sEcho: 1, SortCol: 'id', SortDir: 'desc', rowid: ID };
    $('#ProducteditAttributes').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: false,
        sPaginationType: "full_numbers", searching: true, ordering: false, lengthChange: true, "paging": true,
        bAutoWidth: false, scrollX: false,
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        sAjaxSource: "/Product/EditAttributesList",
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
                'data': 'term_id', sWidth: "10%",
                'render': function (id, type, full, meta) {
                    return '<a href="#" onclick="DeleteeditAttributes(\'' + full.taxonomy + '\', ' + id + ');ActivityLog(\'Delete editAttributes\',\'/Product/editAttributes/' + id + '\');"  data-placement="left" title="Delete editAttributes" data-toggle="tooltip"><i class="glyphicon glyphicon-trash"></i></a>';
                }
            },
            { data: 'name', title: 'Name', sWidth: "15%" },
            { data: 'slug', title: 'Slug', sWidth: "15%" },
            { data: 'description', title: 'Description', sWidth: "10%" },
            { data: 'count', title: 'Count', sWidth: "10%" },
            {
                'data': 'term_id', sWidth: "10%",
                'render': function (id, type, full, meta) { 
                    return '<a href="#" onclick="GeteditAttributesByID(\'' + full.taxonomy + '\', ' + id + ');ActivityLog(\'Edit Attributes\', \'/Product/editAttributes/' + id + '\');" data-placement="left" title="Edit Attributes" data-toggle="tooltip"><i class="glyphicon glyphicon-pencil"></i></a>';
                 }
            }
        ]
    });
}

function GeteditAttributesByID(taxonomy,id) {
    // getParentAttributes(id);
    //var checkbox = document.getElementById("enable_archive"); 

    console.log(taxonomy, id);
    var obj = { strValue1: id, strValue2: taxonomy}
        $.ajax({
            url: "/Product/GeteditAttributesByID/",
            type: "Post",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj), 
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                var d = JSON.parse(data);
                if (d.length > 0) {                    
                    $("#btnAddNeweditAttributes").text('Update');
                    $("#btnAddNeweditAttributes").css('cursor', 'pointer').attr('title', '');
                    $("#btnAddNeweditAttributes").css('cursor', 'pointer').attr('title', 'Update');
                    //$("#lblNeweditAttributes").text('Update');
                    $("#txtAttributeseditName").val(d[0].name);
                    $("#txtAttributeseditSlug").val(d[0].slug);
                    $("#txtdescription").val(d[0].description);
                    $("#hfeditid").val(id);               
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (msg) {
            }
        });
    isEdit(true);
}


$('#btneditReset').click(function () {
    $("#txtAttributeseditName").val('');
    $("#txtAttributeseditSlug").val('');
    $("#txtdescription").val('');
    $("#hfeditid").val('');
    //$("#hfeditMetaid").val('');
    $("#btnAddNeweditAttributes").text('Save');
    //$("#lblNeweditAttributes").text('Save'); 
})


$('#btnAddNeweditAttributes').click(function () {
    ID = parseInt($("#hfeditid").val()) || 0;
    console.log($("#hfeditid").val());
    Meta_id = $("#hfeditMetaid").val();
    console.log(Meta_id);
    Name = $("#txtAttributeseditName").val().trim();
    Slug = $("#txtAttributeseditSlug").val();
    desc = $("#txtdescription").val();
    if (Name == "") { swal('Alert', 'Please enter Attributes name', 'error').then(function () { swal.close(); $('#txtAttributeseditName').focus(); }) }
    else if (Slug == "") { swal('Alert', 'Please enter Attributes slug', 'error').then(function () { swal.close(); $('#txtAttributeseditSlug').focus(); }) }
    else {
        var obj = new FormData();
        obj.append("id", ID);
        obj.append("_name", Name);
        obj.append("_slug", Slug);
        obj.append("_desc", desc);
        obj.append("_taxonomy", Meta_id);
        $.ajax({
            url: '/Product/AddProducteditAttributes/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: obj,
            processData: false,
            contentType: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    $("#hfeditid").val('');
                    //$("#hfeditMetaid").val('');
                    AttributesEditList(Meta_id);
                    $("#btnAddNeweditAttributes").text('Save');
                    $("#txtAttributeseditName").val('');
                    $("#txtAttributeseditSlug").val('');
                    $("#txtdescription").val('');       
                    swal('Alert!', data.message, 'success');
                }
                else { swal('Alert!', data.message, 'error') }
            },
            complete: function () { $("#loader").hide(); isEdit(false); },
            error: function (error) { swal('Error!', error.message, 'error'); },
        })

    }
});

function DeleteeditAttributes(taxonomy,id) {
    var obj = { strVal1: id, strVal2: taxonomy}
    $.confirm({
        title: 'Confirm!',
        content: 'Do you want to delete Attributes with related product?',
        buttons: {
            confirm: {
                text: 'Yes',
                btnClass: 'btn-default',
                keys: ['enter', 'shift'],
                action: function () {
                    ActivityLog('Attributes (' + id + ') deleted with related product', '/Product/ProductCategories/' + id + '');
                    $.ajax({
                        url: '/Product/DeleteeditAttributes/', dataType: 'json', type: 'Post',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(obj),
                        dataType: "json",
                        beforeSend: function () { $("#loader").show(); },
                        success: function (data) {
                            if (data.status == true) {
                                AttributesEditList(Meta_id);
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