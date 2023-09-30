$(document).ready(function () {
    $("#loader").hide();
    $(".select1").select2();
    //getpage();
    //getcompany();
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    var searchParams = new URLSearchParams(window.location.search);
    var entiid = searchParams.get('entiid');
  
        if (id != "") {
            if (id == 'Compose') { 
                $("#hfid").val(0); 
            }
            else { 
                GetDataByID(id);
                $("#hfid").val(id); 
            }
        }
        else {
            $("#hfid").val(0);
        }
   
    // $("#btnbacklist").prop("href", "List")

    $(document).on('click', "#btnSave", function () {
        Add();
    })   
})

function Add() {
    title = $("#txttitle").val();
    entity = $("#ddlcompany").val();
    content = $("#txtcontent").val();
    seo = $("#txtseo").val();
    let post_contentval = GetContent();
    ID = $("#hfid").val();

    parent_id = $("#ddlparent").val();
    template = $("#page_template").val();
    order = $("#menu_order").val();

    srtdis = $("#txtshortdiscription").val();

    gmtkeyword = $("#txtgmtakeyword").val();
    comment = $("#txtcomment").val();

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
        swal('Alert', 'Please enter page title!', 'error').then(function () { swal.close(); $('#txttitle').focus(); });
    }
    else if (entity == 0) {
        swal('Alert', 'Please select store!', 'error').then(function () { swal.close(); $('#ddlcompany').focus(); });
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
        obj.append("parent_id", parent_id);
        obj.append("template", template);
        obj.append("order", order);
        obj.append("gmtkeyword", gmtkeyword);
        obj.append("comment", comment);
        obj.append("shortdic", srtdis);
        // console.log(srtdis);
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
                        swal('Success!', data.message, 'success').then((result) => { location.href = '../List'; });
                    }
                }
                else { swal('Alert!', data.message, 'error') }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', error.message, 'error'); },
        })
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

        url: '/EmailProfile/GetMailByID/' + ID,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var i = JSON.parse(data); 
            $("#recipient").val(i[0].email_address);
            SetContent(i[0].html_content); 
            $('#subject').val(i[0].subject);

            // Assuming 'data' contains the folder name
            var folderName = i[0].unique_id;
           var encodedFolderName = encodeURIComponent(folderName);
            // The URL where the files are located
            //var folderUrl = '../../Content/Media/' + folderName; // Replace with your actual folder URL
            var folderUrl = '';
            if (i[0].direction == 'I') {
                folderUrl = '/mail/inbox/' + encodedFolderName; // Replace with your actual folder URL
            }
            else if (i[0].direction == 'S') {
                folderUrl = '/mail/sent/' + encodedFolderName; // Replace with your actual folder URL
            }
            else {
                folderUrl = '/mail/draft/' + encodedFolderName; // Replace with your actual folder URL
            }

            // Get the fileList element
            var fileListElement = document.getElementById('fileList');
            console.log(folderUrl);
            // Create an AJAX request to fetch the list of files in the folder
            $.ajax({
                url: folderUrl,
                type: 'GET',
                dataType: 'html',
                //success: function (htmlContent) {
                //    fileListElement.innerHTML = htmlContent;
                //    // Remove parent directory links
                //    fileListElement.querySelectorAll('a').forEach(function (anchorElement) {
                //        if (anchorElement.textContent.trim() === '[To Parent Directory]' || anchorElement.getAttribute('href') === '../') {
                //            anchorElement.remove();
                //        }
                //    });

                //    // Convert remaining links to download links
                //    fileListElement.querySelectorAll('a').forEach(function (anchorElement) {
                //        var fileName = anchorElement.textContent.trim();
                //        var downloadLink = document.createElement('a');
                //        downloadLink.href = folderUrl + '/' + fileName;
                //        downloadLink.download = fileName;
                //        downloadLink.textContent = fileName;
                //        fileListElement.appendChild(downloadLink);
                //        fileListElement.appendChild(document.createElement('br'));
                //    });
                //}
                success: function (htmlContent) {
                    // Create a temporary div element to parse the HTML content
                    var tempDiv = document.createElement('div');
                    tempDiv.innerHTML = htmlContent;

                    // Find all 'A' (anchor) elements within the parsed HTML content
                    var anchorElements = tempDiv.querySelectorAll('a');

                    // Iterate through the anchor elements to extract links and file names
                    anchorElements.forEach(function (anchorElement) {
                        var href = anchorElement.getAttribute('href');
                        var fileName = anchorElement.textContent.trim();

                        // Check if the href is not a parent directory link
                        if (href !== '../' && fileName !== '[To Parent Directory]') {
                            var downloadLink = document.createElement('a');
                            downloadLink.href = folderUrl + '/' + fileName; // Construct the full URL
                            downloadLink.download = fileName;
                            downloadLink.textContent = fileName;

                            // Append the download link to the fileList element
                            fileListElement.appendChild(downloadLink);
                            fileListElement.appendChild(document.createElement('br')); // Add line breaks for readability
                        }
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.getResponseHeader('Content-Type').indexOf('json') === -1) {
                        console.error('Non-JSON response received.');
                        console.error(jqXHR.responseText); // Log the response for debugging purposes.
                        // Handle non-JSON response here, e.g., display an error message.
                    } else {
                        console.error('Error fetching file list:');
                        console.log(jqXHR);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                }
            });
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