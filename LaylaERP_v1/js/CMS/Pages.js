$(document).ready(function () {
    $("#loader").hide();
    $(".select1").select2();
    getcompany();
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);

    if (id != "") {
        if (id == 'Pages') {
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

        var url = '/CMS/Page/' + id;

        // Open the URL in a new tab
        window.open(url, '_blank');
     
    });


 

    $('#txttitle').keyup(function (event) {
        var textBox = event.target;
        var start = textBox.selectionStart;
        var end = textBox.selectionEnd;
        textBox.value = textBox.value.charAt(0).toUpperCase() + textBox.value.slice(1);
        textBox.setSelectionRange(start, end);
        var cat = $('#txttitle').val().toLowerCase().trim();
        cat = cat.replace(/\s/g, '-');
        $('#txtslug').val(cat);

    });
    var itxtCnt = 0;
    var i = 1;
    $("#add").click(function (e) {
        i++;
        itxtCnt = itxtCnt + 1;
        e.preventDefault();
        $("#tbhold").append('<tr id="row' + i + '"><td><div class="form-group"><label class="control-label">Keyphrase:</label><input type="text" class="input form-control" id=tbk' + itxtCnt + ' value="" /><span></div></td><td><div class="form-group"><label class="control-balel">Synonyms:</label><textarea  class="inputdes form-control" id=tb' + itxtCnt + '></textarea></div></td><td><button type="button" class="btn no-btn btn_remove" id="' + i + '" name="remove">X</button></td></tr>');

    });

    $(document).on('click', '.btn_remove', function () {
        var button_id = $(this).attr("id");
        $("#row" + button_id + '').remove();
    });
    $('#ddlseotitle').change(function () {
        var selectedText = $(this).find('option:selected').text();
        var inputBox = $('#txtseotitle');
        var currentValue = inputBox.val();
        var caretPos = inputBox[0].selectionStart;
        var newValue = currentValue.slice(0, caretPos) + selectedText + currentValue.slice(caretPos);
        inputBox.val(newValue.trim());
        inputBox.focus();
        inputBox[0].setSelectionRange(caretPos, caretPos + selectedText.length);
        var startIndex = caretPos;
        var endIndex = caretPos + selectedText.length;
        var coloredText = newValue.substring(startIndex, endIndex);
        var coloredHtml = '<span style="color: red;">' + coloredText + '</span>';
        inputBox.html(inputBox.html().substring(0, startIndex) + coloredHtml + inputBox.html().substring(endIndex));
        inputBox[0].setSelectionRange(endIndex, endIndex);

    });
    $('#ddlmetadescription').change(function () {
        var selectedText = $(this).find('option:selected').text();
        var inputBox = $('#txtmetadescription');
        var currentValue = inputBox.val();
        var caretPos = inputBox[0].selectionStart;
        var newValue = currentValue.slice(0, caretPos) + selectedText + currentValue.slice(caretPos);
        inputBox.val(newValue.trim());
        inputBox.focus();
        inputBox[0].setSelectionRange(caretPos, caretPos + selectedText.length);
        var startIndex = caretPos;
        var endIndex = caretPos + selectedText.length;
        var coloredText = newValue.substring(startIndex, endIndex);
        var coloredHtml = '<span style="color: red;">' + coloredText + '</span>';
        inputBox.html(inputBox.html().substring(0, startIndex) + coloredHtml + inputBox.html().substring(endIndex));
        inputBox[0].setSelectionRange(endIndex, endIndex);
    });
})

function Add() { 
    title = $("#txttitle").val();
    entity = $("#ddlcompany").val();
    content = $("#txtcontent").val();
    seo = $("#txtseo").val();
    let post_contentval = GetContent();
    ID = $("#hfid").val();

    seotitle = $("#txtseotitle").val();
    metades = $("#txtmetadescription").val();

    fcsskey = $("#txtfocuskeyphras").val();
    slug = $("#txtslug").val();

    let _keylist = [];
    let _synlist = [];
    var firstElement = $("#txtsynonyms").val();
    _synlist.push(firstElement);
    $('#tbhold > tr').each(function (index, tr) {
        _keylist.push({ keyword: $(tr).find('.input').val(), score: 'bad' });
    });
    $('#tbhold > tr').each(function (index, tr) {
        //_synlist.push($("#txtsynonyms").val(), $(tr).find('.inputdes').val());
        //if (index % 2 === 1) {
        var value = $(tr).find('.inputdes').val();
        _synlist.push(value);
        //}
    });


    if (title == "") {
        swal('Alert', 'Please enter title', 'error').then(function () { swal.close(); $('#txttitle').focus(); });
    }
    else if (entity == 0) {
        swal('Alert', 'Please enter company name', 'error').then(function () { swal.close(); $('#ddlcompany').focus(); });
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
        obj.append("SEO", seo);
        obj.append("Content", content);

        obj.append("fcsskey", fcsskey);
        obj.append("seotitle", seotitle);
        obj.append("metades", metades);
        obj.append("slug", slug);
        obj.append("keylist", JSON.stringify(_keylist));
        obj.append("synlist", JSON.stringify(_synlist));

        console.log(post_contentval);
        $.ajax({
            url: '/CMS/CreatePages/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: obj,
            processData: false,
            contentType: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {

                    if (data.url == "Pages") {
                        swal('Success!', data.message, 'success').then((result) => { location.href = '../List'; });
                    }
                    else {
                        swal('Success!', data.message, 'success').then((result) => { location.href = 'List'; });
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

        url: '/CMS/GetDataByID/' + ID,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var i = JSON.parse(data);
          console.log(i);
            $("#txttitle").val(i[0].post_title);
            SetContent(i[0].post_content);
            //setTimeout(function () { $("#ddlcompany").val(i[0].entity_id).trigger('change'); }, 500);
            let cmpid = i[0].entity_ids; 
            $("#ddlcompany").val(cmpid).trigger('change');
            var path = i[0].meta_value;
            url = "../../Content/Pages/PageBannerLink/" + path + ""; 
            $('<img>').on('load', function () {
                // Image exists
                $('#show_picture').attr('src', url);
            }).on('error', function () {
                // Image does not exist
                $('#show_picture').attr('src', "../../Content/Product/default.png"); // Set a default image or do something else
            }).attr('src', url); 

           // $('#show_picture').attr('src', url); 
            var urlpath = i[0].featured_image_url;
            furl = "../../Content/Pages/Featured/" + urlpath + ""; 
            $('<img>').on('load', function () {
                // Image exists
                $('#featuredshow_picture').attr('src', furl);
            }).on('error', function () {
                // Image does not exist
                $('#featuredshow_picture').attr('src', "../../Content/Product/default.png"); // Set a default image or do something else
            }).attr('src', furl); 
           // $('#featuredshow_picture').attr('src', furl); 
            $('#lblpermalink').text("Permalink:https://erp.prosourcediesel.com/" + i[0].post_title + "");

            $("#txtseotitle").val(i[0].cmsseotitle);
            $("#txtmetadescription").val(i[0].seometa);

            $("#txtfocuskeyphras").val(i[0].seofocus);
            var cat = $('#txttitle').val().toLowerCase().trim();
            cat = cat.replace(/\s/g, '-');
            $('#txtslug').val(cat);

            //  var syn = ["synonyms", "", "", "test"];
            var syn = i[0].cpmsyns;
            //console.log(syn);
            if (syn === null) {
            }
            else {
                var s = JSON.parse(syn);
                $('#txtsynonyms').val(s[0]);
                var itxtCnt = 0;
            }
            //var Attributes = '[{"keyword":"ok1","synonyms":"bad"},{"keyword":"2","synonyms":"bad"}]';
            var Attributes = i[0].cpmfoucskey;
            //i++;
            var i = 1;
            itxtCnt = itxtCnt + 1;
            $.each(JSON.parse(Attributes), function (index1, value) {
                var datalog = JSON.parse(Attributes);
                //console.log(index1);
                $("#tbhold").append('<tr id="row' + i + '"><td><div class="form-group"><label class="control-label">Name:</label><input type="text" class="input form-control" id=tb' + itxtCnt + ' value="' + datalog[index1].keyword + '" /><span></div></td><td><div class="form-group"><label class="control-balel">Synonyms:</label><textarea placeholder="" class="inputdes form-control" id=tb' + itxtCnt + ' >' + s[index1 + 1] + '</textarea></div></td><td><button type="button" class="btn no-btn btn_remove" id="' + i + '" name="remove">X</button></td></tr>');
            });
          
        },
        error: function (msg) { alert(msg); }
    });
}