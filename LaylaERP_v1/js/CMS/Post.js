$(document).ready(function () {
    $("#loader").hide();
    $(".select1").select2();
    getcompany();
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);

    if (id != "") {
        if (id == 'Post') {
            $("#lblpermalink").hide();

            $("#hfid").val(0);
        }
        else {
            $("#lblpermalink").show();
            GetDataByID(id);
            $("#hfid").val(id);

           
        }
        //GetFeeNTaxByID(id);
        //setTimeout(function () { GetFeeNTaxByID(id); }, 5000);
    }
    else {
        $("#hfid").val(0);
    }

    // $("#btnbacklist").prop("href", "List")

    $(document).on('click', "#btnSave", function () {
        Add();
    })

    $('#lblpermalink').click(function (event) {
        // Prevent the default behavior of the link
        event.preventDefault();
        // Get the parameter value
        var parameterValue = 'exampleParameter';

        // Make an AJAX request to the controller action
        /*  window.location.href = '/Test/Index/' + id+'';*/

        var url = '/CMS/Posts/' + id;

        // Open the URL in a new tab
        window.open(url, '_blank');

    });

    $("#txtsrc").keyup(function (event) {
        if (event.keyCode === 13) {
            $("input[id*=btnsrc]").click();
        }
    });

    $("input[id*=btnsrc]").click(function () {
        var searchvalue = $("input[id*=txtsrc]").val();
        if (searchvalue != "") {
            $('.tblprodctype .categorychecklist').each(function () {
                $(this).find('li').each(function () {
                    var current = $(this);
                    var s = current.text().trim().toLowerCase();
                    //console.log(s);
                    //console.log(searchvalue);
                    if (s.match(searchvalue.toLowerCase())) {
                        $(this).show();
                    }
                    else {
                        $(this).hide();
                        $(this.nextSibling).wrap('<span style="display:none"></style>');
                    }

                })
            })
        }
        else {
            $("#cboAll,.w3-check").show();
        }

    })
})

function Add() {
    title = $("#txttitle").val();
    entity = $("#ddlcompany").val();
    content = $("#txtcontent").val();
    seo = $("#txtseo").val();
    let post_contentval = GetContent();
    ID = $("#hfid").val();

    var v = '';
    $('input:checkbox:checked').each(function () {
        v = v + $(this).attr('value') + ",";
    });
    let dfa = v.replace('undefined,undefined,', '');
    let dfad = dfa.replace('undefined,', '');
    var n = dfad.lastIndexOf(",");
    var categorydata = dfad.substring(0, n)     

    if (title == "") {
        swal('Alert', 'Please enter title', 'error').then(function () { swal.close(); $('#txttitle').focus(); });
    }
    else if (entity == 0) {
        swal('Alert', 'Please enter company name', 'error').then(function () { swal.close(); $('#ddlcompany').focus(); });
    }

    else if (categorydata == "") {
        swal('Alert', 'Please Select Category', 'error').then(function () { swal.close(); $('#chkproducttype').focus(); });
    }

    //else if (Emailuser == "") {
    //    swal('Alert', 'Please enter email', 'error').then(function () { swal.close(); $('#txtUserEmail').focus(); });
    //}
    //else if (Phone == "") {
    //    swal('Alert', 'Please enter contact number', 'error').then(function () { swal.close(); $('#txtPhone').focus(); });
    //}
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
        obj.append("category", categorydata);
        //obj.append("Content", content);
        console.log(post_contentval);
        $.ajax({
            url: '/CMS/CreatePost/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: obj,
            processData: false,
            contentType: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {

                    if (data.url == "Pages") {
                        swal('Success!', data.message, 'success').then((result) => { location.href = '../PostList'; });
                    }
                    else {
                        swal('Success!', data.message, 'success').then((result) => { location.href = 'PostList'; });
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
    if (input.files && input.files[0]) {
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
function getcompany() {
    $.ajax({
        url: "/Setting/GetCompany",
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please Select Company</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlcompany').html(opt);
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

        url: '/CMS/GetPostDataByID/' + ID,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var i = JSON.parse(data);
            // console.log(i);
            $("#txttitle").val(i[0].post_title);
            SetContent(i[0].post_content);
            setTimeout(function () { $("#ddlcompany").val(i[0].entity_id).trigger('change'); }, 500);
            $("#txtcontent").val(i[0].page_content);
            $("#txtseo").val(i[0].page_seo);
            //$("#txtcompanyname").val(i[0].CompanyName);  

            var category = i[0].CategoryID;
            if (category != null) {
                var temp = new Array();
                var temp = category.split(",");
                $('#tblprodctype').find('input[type="checkbox"]').each(function (i, item) {
                    if (temp.includes($(item).val()))
                        $(item).prop('checked', true);
                });
            }

            var path = i[0].meta_value;
            url = "../../Content/Post/SingalImage/" + path + "";
            $('<img>').on('load', function () {
                // Image exists
                $('#show_picture').attr('src', url);
            }).on('error', function () {
                // Image does not exist
                $('#show_picture').attr('src', "../../Content/Product/default.png"); // Set a default image or do something else
            }).attr('src', url);

            // $('#show_picture').attr('src', url); 
            var urlpath = i[0].featured_image_url;
            furl = "../../Content/Post/Featured/" + urlpath + "";
            $('<img>').on('load', function () {
                // Image exists
                $('#featuredshow_picture').attr('src', furl);
            }).on('error', function () {
                // Image does not exist
                $('#featuredshow_picture').attr('src', "../../Content/Product/default.png"); // Set a default image or do something else
            }).attr('src', furl);
            // $('#featuredshow_picture').attr('src', furl); 
            $('#lblpermalink').text("Permalink:https://erp.prosourcediesel.com/" + i[0].post_title + "");
        },
        error: function (msg) { alert(msg); }
    });
}