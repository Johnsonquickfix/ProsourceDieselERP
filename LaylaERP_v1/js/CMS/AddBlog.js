$(document).ready(function () {
    $("#loader").hide();
    $(".select1").select2(); 
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    var searchParams = new URLSearchParams(window.location.search);
    var entiid = searchParams.get('entiid');
    $.when(getpage(entiid)).then(function () {
        getcompany(entiid);
        if (id != "") {
            if (id == 'AddBlog') { 
                $("#hfid").val(0);
                $("#btnSave").text("Add");
                $('#txttitle').prop('readonly', false); 
            }
            else {
                GetDataByID(id);
                $("#hfid").val(id);
                $("#btnSave").text("Update");
                $('#txttitle').prop('readonly', true); 
            }
        }
        else {
            $("#hfid").val(0);
        }
    }); 
    $(document).on('click', "#btnSave", function () {
        Add();
    })  
    
})

function Add() {
    title = $("#txttitle").val();
    entity = $("#ddlcompany").val(); 
    let post_contentval = GetContent();
    ID = $("#hfid").val();  
    srtdis = $("#txtshortdiscription").val();  
    if (title == "") {
        swal('Alert', 'Please enter page title!', 'error').then(function () { swal.close(); $('#txttitle').focus(); });
    }
    else if (entity == 0) {
        swal('Alert', 'Please select store!', 'error').then(function () { swal.close(); $('#ddlcompany').focus(); });
    }     
    else {
        var file = document.getElementById("file").files[0];
        var featuredfile = document.getElementById("Featuredfile").files[0];
        var obj = new FormData();
        obj.append("ImageFile", file);
        obj.append("FeaturedFile", featuredfile);
        obj.append("ID", ID);
        obj.append("post_title", title);
        obj.append("post_content", encodeURIComponent(post_contentval));
        obj.append("entity_id", entity); 
        obj.append("shortdic", srtdis);
        // console.log(srtdis);
        $.ajax({
            url: '/CMS/CreateBlog/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: obj,
            processData: false,
            contentType: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    if (data.url == "Pages") {
                        swal('Success!', data.message, 'success').then((result) => { location.href = '../Blog'; });
                    }
                    else {
                        swal('Success!', data.message, 'success').then((result) => { location.href = '../Blog'; });
                    }
                }
                else { swal('Alert!', data.message, 'error') }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', error.message, 'error'); },
        })
    }
}
function readURL(input) {
    //console.log(input);
    if (input.files && input.files[0]) {
        // console.log(input.files, input.files[0]);
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#show_picture').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}
function readFeatURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#featuredshow_picture').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}
function getcompany(id) {
    $.ajax({
        url: "/Setting/GetCompany",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please Select Store</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlcompany').html(opt);
            $('#ddlcompany').val(id);
        }


    });
}
function GetContent() {
    return tinyMCE.get('editorcontent').getContent();
}
function SetContent(htmlContent) {
    //alert('ok');
    tinyMCE.get('editorcontent').setContent(htmlContent);
}

function GetDataByID(ID) {
    //var ID = ID;
    var obj = {};
    $.ajax({

        url: '/CMS/GetDataBlogByID/' + ID,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var i = JSON.parse(data);
            var parent = i[0].post_parent;
            $('#ddlparent').val(parent).trigger('change');
            $("#txttitle").val(i[0].post_title);
            SetContent(i[0].post_content); 
            var path = i[0].meta_value;
            url = "../../Content/Blog/Banner/" + path + "";
            $('<img>').on('load', function () {
                // Image exists
                $('#show_picture').attr('src', url);
            }).on('error', function () {
                // Image does not exist
                $('#show_picture').attr('src', "../../Content/Product/default.png"); // Set a default image or do something else
            }).attr('src', url);

            // $('#show_picture').attr('src', url); 
            var urlpath = i[0].featured_image_url;
            furl = "../../Content/Blog/Other/" + urlpath + "";
            $('<img>').on('load', function () {
                // Image exists
                $('#featuredshow_picture').attr('src', furl);
            }).on('error', function () {
                // Image does not exist
                $('#featuredshow_picture').attr('src', "../../Content/Product/default.png"); // Set a default image or do something else
            }).attr('src', furl);
            // $('#featuredshow_picture').attr('src', furl);   
            $('#txtshortdiscription').val(i[0].short_description);
             
        },
        error: function (msg) { alert(msg); }
    });
}


function getpage(id) {
    $.ajax({
        url: "/CMS/GetPageAttributesByID/" + id,
        type: "Get",
        success: function (data) {
            // console.log(data);
            $.each(data, function (index, item) {
                if (item.Text.startsWith("--")) {
                    item.Text = "&nbsp;&nbsp;&nbsp;" + item.Text.slice(2);
                }
            });
            var opt = '<option value="0">No Parent</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlparent').html(opt);
        }
    });
}