$(document).ready(function () {
    $("#loader").hide();
    $(".select1").select2();  
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    var searchParams = new URLSearchParams(window.location.search);
    var entiid = searchParams.get('entiid');
  
        if (id != "") {
            if (id == 'Compose' || id == '0') {
                $("#hfid").val(0);
                $("#divactionbutton").hide();                 
                $("#btnsend").text('Send');
                $("#divedit").hide();
                
            }
            else {
                $("#divedit").show();
                GetDataByID(id);
                $("#hfid").val(id);
                $("#divactionbutton").show();                
                $("#btnsend").text('Reply/Send');

            }
        }
        else {
            $("#hfid").val(0);
        } 

    $(document).on('click', "#btnsend", function () {
        Add();
    })
    $(document).on('click', "#btnorder", function () {
        localStorage.setItem('_search', $("#recipient").val());
        localStorage.setItem('_id', id);
        window.location.href = '../../OrdersMySQL/OrdersHistory';
    })
    $(document).on('click', "#btnevent", function () {
        localStorage.setItem('_search', $("#recipient").val());
        localStorage.setItem('_id', id);
        window.location.href = '../../customer-service/search-ticket';
    })
    $(document).on('click', "#btnprofile", function () {
        localStorage.setItem('_search', $("#recipient").val());
        localStorage.setItem('_id', id);
        window.location.href = '../../audience/profiles';
    })
    var iframe = document.getElementById('updatedcontent_ifr');

    // Check if the iframe exists
    if (iframe) {
        // Set the contentEditable property to false to make the content read-only
        iframe.contentDocument.designMode = 'off';
    }
})

function Add() {
    recipient = $("#recipient").val();
    subject = $("#subject").val(); 
    let editorcontent = GetContent();
    let sentdata = GetupdatedContent();
    ID = $("#hfid").val(); 
 
    if (recipient == "") {
        swal('Alert', 'Please enter recipient mail!', 'error').then(function () { swal.close(); $('#recipient').focus(); });
    }
    else if (subject == "") {
        swal('Alert', 'Please enter subject!', 'error').then(function () { swal.close(); $('#subject').focus(); });
    } 
    else {
         var input = document.getElementById("file");
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
        obj.append("recipient", encodeURIComponent(recipient));
        obj.append("subject", encodeURIComponent(subject));
        obj.append("editorcontent", encodeURIComponent(sentdata) + encodeURIComponent(editorcontent) );
        console.log(encodeURIComponent(editorcontent));
        $.ajax({
            url: '/EmailProfile/composemail/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: obj,
            processData: false,
            contentType: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {

                    if (data.url == "Pages") {
                        swal('Success!', data.message, 'success').then((result) => { location.href = '../Inboxprofile'; });
                    }
                    else {
                        swal('Alert!', data.message, 'error').then((result) => { location.href = '../Inboxprofile'; });
                    }
                }
                else { swal('Alert!', data.message, 'error') }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', error.message, 'error'); },
        })
    }
} 
function readURL_now(input) {
    if (input.files && input.files.length > 0) {
        var imagePreviewContainer = document.getElementById("imagePreviewContainer");
        var excelContainer = document.getElementById("excelContainer");

        // Clear any existing content in both containers
        imagePreviewContainer.innerHTML = "";
        excelContainer.innerHTML = "";

        for (var i = 0; i < input.files.length; i++) {
            var file = input.files[i];

            // Create a closure to capture the current file and tag values
            (function (file) {
                var tag = document.createElement("div");
                tag.classList.add('rendered_imgs');

                var reader = new FileReader();
                reader.onload = function (e) {
                    var fileURL = e.target.result;
                    var fileExtension = file.name.split('.').pop().toLowerCase();
                    console.log(fileExtension);

                    if (fileExtension === "jpg" || fileExtension === "jpeg" || fileExtension === "png") {
                        // If it's an image with a supported extension, create an image element
                        tag.innerHTML = '<img src="' + fileURL + '" />';
                        imagePreviewContainer.appendChild(tag);
                    } else if (fileExtension === "pdf") {
                        // If it's a PDF, create a PDF embed element
                        tag.innerHTML = '<embed src="' + fileURL + '" type="application/pdf" />';
                        imagePreviewContainer.appendChild(tag);
                    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
                        // If it's an Excel file with a supported extension, provide a download link
                        tag.innerHTML = '<a href="' + fileURL + '" download>Download Excel File</a>';
                        excelContainer.appendChild(tag);
                    } else {
                        // For unsupported file types, display a message
                        tag.textContent = 'Unsupported file type: ' + fileExtension;
                        imagePreviewContainer.appendChild(tag);
                    }
                };
                reader.readAsDataURL(file);
            })(file);
        }
    }
}

function readURL(input) {
    if (input.files && input.files.length > 0) {
        var imagePreviewContainer = document.getElementById("imagePreviewContainer");
        var excelContainer = document.getElementById("excelContainer");
        var textContainer = document.getElementById("textContainer");

        // Clear any existing content in all containers
        imagePreviewContainer.innerHTML = "";
        excelContainer.innerHTML = "";
        textContainer.innerHTML = "";

        for (var i = 0; i < input.files.length; i++) {
            var file = input.files[i];

            // Create a closure to capture the current file and tag values
            (function (file) {
                var tag = document.createElement("div");
                tag.classList.add('rendered_imgs');

                var reader = new FileReader();
                reader.onload = function (e) {
                    var fileURL = e.target.result;
                    var fileExtension = file.name.split('.').pop().toLowerCase();
                    console.log(fileExtension);
                    if (fileExtension === "jpg" || fileExtension === "jpeg" || fileExtension === "png") {
                        // If it's an image with a supported extension, create an image element
                        tag.innerHTML = '<img src="' + fileURL + '" />';
                        imagePreviewContainer.appendChild(tag);
                    } else if (fileExtension === "pdf") {
                        // If it's a PDF, create a PDF embed element
                        tag.innerHTML = '<embed src="' + fileURL + '" type="application/pdf" />';
                        imagePreviewContainer.appendChild(tag);
                    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
                        // If it's an Excel file with a supported extension, provide a download link
                        tag.innerHTML = '<a href="' + fileURL + '" download>Download Excel File</a>';
                        excelContainer.appendChild(tag);
                    } else if (fileExtension === "csv" || fileExtension === "txt") {
                        // If it's a CSV or TXT file, display its content
                        var textContent = e.target.result;
                        tag.textContent = textContent;
                        textContainer.appendChild(tag);
                    } else {
                        // For unsupported file types, display a message
                        tag.textContent = 'Unsupported file type: ' + fileExtension;
                        imagePreviewContainer.appendChild(tag);
                    }
                };
                reader.readAsDataURL(file); // You may want to use readAsText for CSV and TXT files
            })(file);
        }
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
function GetupdatedContent() {
    return tinyMCE.get('updatedcontent').getContent();
}
function SetContent(htmlContent) {
    //alert('ok');
    /*tinyMCE.get('editorcontent').setContent(htmlContent);*/
    tinyMCE.get('updatedcontent').setContent(htmlContent);
}

function GetDataByID(ID) {
    //var ID = ID;
    if (ID > 0) {
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
                var folderUrl = '';
                if (i[0].direction == 'I') {
                    folderUrl = '/mail/inbox/' + encodedFolderName; // Replace with your actual folder URL
                }
                else if (i[0].direction == 'S') {
                    folderUrl = '/mail/sent/' + encodedFolderName;
                }
                else {
                    folderUrl = '/mail/draft/' + encodedFolderName;
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
                                downloadLink.className = 'attachment-link';
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