$(document).ready(function () {
    $("#loader").hide();
    $(".select2").select2();
    $(".select1").select2();
    //getcompany();
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    var searchParams = new URLSearchParams(window.location.search);
    var entiid = searchParams.get('entiid'); 
    getcompany(entiid); 
    if (id != "") {
        if (id == 'Post') {
            $("#lblpermalink").hide();
            $("#hfid").val(0);
            $("#btnSave").text("Add");
        }
        else {
            $("#lblpermalink").show();
            GetDataByID(id);
            $("#hfid").val(id);
            $("#btnSave").text("Update"); 
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
        /*$("#tbhold").append('<tr id="row' + i + '"><td><div class="col-md-12"> <label>Name:</label><br /><input type="text" class="input" id=tb' + itxtCnt + ' value="" /><br /><input type="checkbox" class="inputchk" id=tb' + itxtCnt + ' value=""/><label>Visible on the product page</label><br /> <input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + ' value=""/><label>Used for variations</label></div></td><td><br /><br /><div class="col-md-12"><label>Value(s):</label><input type="text" placeholder="Enter some text, or some attributes by "|" separating values." style="width: 100%; height: 110px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;" class="inputdes" id=tb' + itxtCnt + ' value="" /></div></td><td><button type="button" class="btn btn-danger btn_remove" id="' + i + '" name="remove">X</button></td></tr>');*/
        // $("#tbhold").append('<tr id="row' + i + '"><td><div class="col-md-12"> <label>Name:</label><br /><input type="text" class="input" id=tb' + itxtCnt + ' value="" /><br /><input type="checkbox" class="inputchkvar" id=tb' + itxtCnt + ' value=""/><label>Used for variations</label></div></td><td><br /><br /><div class="col-md-12"><label>Value(s):</label><input type="text" placeholder="Enter some text, or some attributes by "|" separating values." style="width: 100%; height: 110px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;" class="inputdes" id=tb' + itxtCnt + ' value="" /></div></td><td><button type="button" class="btn btn-danger btn_remove" id="' + i + '" name="remove">X</button></td></tr>');
        $("#tbhold").append('<tr id="row' + i + '"><td><div class="form-group"><label class="control-label">Keyphrase:</label><input type="text" class="input form-control" id=tbk' + itxtCnt + ' value="" /><span></div></td><td><div class="form-group"><label class="control-balel">Synonyms:</label><textarea  class="inputdes form-control" id=tb' + itxtCnt + '></textarea></div></td><td><button type="button" class="btn no-btn btn_remove" id="' + i + '" name="remove">X</button></td></tr>');

    });

    $(document).on('click', '.btn_remove', function () {
        var button_id = $(this).attr("id");
        $("#row" + button_id + '').remove();
    });
    $('#ddlseotitle').change(function () { 

        //var selectedText = $(this).find('option:selected').text();
        //var inputBox = $('#txtseotitle');

        //// Append the selected text to the existing text in the input box
        //var existingText = inputBox.val();
        //var newText = existingText + ' ' + selectedText.trim();
        //inputBox.val(newText.trim());

        var selectedText = $(this).find('option:selected').text();
        var inputBox = $('#txtseotitle');

        // Get the current input value and caret position
        var currentValue = inputBox.val();
        var caretPos = inputBox[0].selectionStart;

        // Append the selected text to the input value
        var newValue = currentValue.slice(0, caretPos) + selectedText + currentValue.slice(caretPos);
        inputBox.val(newValue.trim());

        // Set the caret position and apply red color to the appended text
        inputBox.focus();
        inputBox[0].setSelectionRange(caretPos, caretPos + selectedText.length);

        // Apply red color to the appended text
        var startIndex = caretPos;
        var endIndex = caretPos + selectedText.length;
        var coloredText = newValue.substring(startIndex, endIndex);
        var coloredHtml = '<span style="color: red;">' + coloredText + '</span>';
        inputBox.html(inputBox.html().substring(0, startIndex) + coloredHtml + inputBox.html().substring(endIndex));

        // Reset the caret position after modifying the input HTML
        inputBox[0].setSelectionRange(endIndex, endIndex);

    });
    $('#ddlmetadescription').change(function () {

        //var selectedText = $(this).find('option:selected').text();
        //var inputBox = $('#txtseotitle');

        //// Append the selected text to the existing text in the input box
        //var existingText = inputBox.val();
        //var newText = existingText + ' ' + selectedText.trim();
        //inputBox.val(newText.trim());

        var selectedText = $(this).find('option:selected').text();
        var inputBox = $('#txtmetadescription'); 
        // Get the current input value and caret position
        var currentValue = inputBox.val();
        var caretPos = inputBox[0].selectionStart;

        // Append the selected text to the input value
        var newValue = currentValue.slice(0, caretPos) + selectedText + currentValue.slice(caretPos);
        inputBox.val(newValue.trim()); 
        // Set the caret position and apply red color to the appended text
        inputBox.focus();
        inputBox[0].setSelectionRange(caretPos, caretPos + selectedText.length); 
        // Apply red color to the appended text
        var startIndex = caretPos;
        var endIndex = caretPos + selectedText.length;
        var coloredText = newValue.substring(startIndex, endIndex);
        var coloredHtml = '<span style="color: red;">' + coloredText + '</span>';
        inputBox.html(inputBox.html().substring(0, startIndex) + coloredHtml + inputBox.html().substring(endIndex)); 
        // Reset the caret position after modifying the input HTML
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

    //var seotitlearray = $('#ddlseotitle option:selected')
    //    .toArray().map(item => item.value).join();
    //seotitle = seotitlearray;

    //var seometadesarray = $('#ddlmetadescription option:selected')
    //    .toArray().map(item => item.value).join();
    //metades = seometadesarray;
    seotitle = $("#txtseotitle").val();
    metades = $("#txtmetadescription").val();

    fcsskey = $("#txtfocuskeyphras").val();
    slug = $("#txtslug").val();

    let _keylist = [];
    let _synlist = [];
    var firstElement = $("#txtsynonyms").val(); 
    _synlist.push(firstElement);
    $('#tbhold > tr').each(function (index, tr) {
        _keylist.push({ keyword: $(tr).find('.input').val() , score: 'bad' });
    });
    $('#tbhold > tr').each(function (index, tr) {
        //_synlist.push($("#txtsynonyms").val(), $(tr).find('.inputdes').val());
        //if (index % 2 === 1) {
            var value = $(tr).find('.inputdes').val();
            _synlist.push(value);
        //}
    });
    //console.log(_keylist, _synlist);
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
        swal('Alert', 'Please enter Store name', 'error').then(function () { swal.close(); $('#ddlcompany').focus(); });
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

        obj.append("fcsskey", fcsskey);
        obj.append("seotitle", seotitle);
        obj.append("metades", metades);
        obj.append("slug", slug);
        obj.append("keylist", JSON.stringify(_keylist));
        obj.append("synlist", JSON.stringify(_synlist));
        //obj.append("Content", content);
        //console.log(post_contentval);
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
                        swal('Success!', data.message, 'success').then((result) => { location.href = '../PostList'; });
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

        url: '/CMS/GetPostDataByID/' + ID,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var i = JSON.parse(data);
              //console.log(i);
            $("#txttitle").val(i[0].post_title);
            SetContent(i[0].post_content);
      
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
           // var seotitle = i[0].cmsseotitle;
           // var seometa = i[0].seometa;
           // console.log(input);
           // var pattern = /"(\d+)"/g;
            //var matches = input.match(pattern);
            //// Check if matches is not null
           // console.log(matches);
            //if (matches && matches.length > 0) {
                // Join the matched numbers into a comma-separated string
                //var numbersString = matches.map(match => match.replace(/"/g, '')).join(',');
               // console.log(numbersString);
            //if (seotitle != null) {
            //    $("#ddlseotitle").select2("val", [seotitle.split(',')]);
            //}
            //if (seometa != null) {
            //    $("#ddlmetadescription").select2("val", [seometa.split(',')]);
            //}
            $("#txtseotitle").val(i[0].cmsseotitle);
            $("#txtmetadescription").val(i[0].seometa);

            $("#txtfocuskeyphras").val(i[0].seofocus);
            let cmpid = i[0].entity_ids;
            
            $("#ddlcompany").val(cmpid).trigger('change');
           /* setTimeout(function () { $("#ddlcompany").val(i[0].entity_ids).trigger('change'); }, 500);*/
            //}
            //if (matches && matches.length > 0) {
            //    // Clear existing selections
            //    $("#ddlseotitle option").prop('selected', false);

            //    // Iterate through the values and select the corresponding options
            //    matches.forEach(match => {
            //        var value = match.replace(/"/g, '');
            //        console.log(value);
            //        $("#ddlseotitle option[value='" + value + "']").prop('selected', true);
            //    });
            //}

             
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
                $("#tbhold").append('<tr id="row' + i + '"><td><div class="form-group"><label class="control-label">Name:</label><input type="text" class="input form-control" id=tb' + itxtCnt + ' value="' + datalog[index1].keyword + '" /><span></div></td><td><div class="form-group"><label class="control-balel">Synonyms:</label><textarea placeholder="" class="inputdes form-control" id=tb' + itxtCnt + ' >' + s[index1+1] + '</textarea></div></td><td><button type="button" class="btn no-btn btn_remove" id="' + i + '" name="remove">X</button></td></tr>');
            });
        },
        error: function (msg) { alert(msg); }
    });
}