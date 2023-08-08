$(document).ready(function () {
    $("#loader").hide();
    $(".select2").select2();
    $(".select1").select2();
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    var searchParams = new URLSearchParams(window.location.search);
    var entiid = searchParams.get('entiid');
    getcompany(entiid);
    //$("#dvpage").show();  
    if (id != "") {
        if (id == 'AddMedia') {
            //$("#lblpermalink").hide();
            $("#divdetails").hide();
            //$("#hfid").val(0);
            $("#btnSave").text("Add");
        }
        else {
            // $("#lblpermalink").show();
            $("#divdetails").show();
            GetDataByID(id);
            $("#hfid").val(id);
            $("#btnSave").text("Update");
        }
    }
    else {
        $("#hfid").val(0);
    }
    $('#featuredshow_picture').click(function () {
        console.log('ss');
        $('#Featuredfile').click(); // Trigger click event on file input element
    });
    $(document).on('click', "#btnSave", function () {
        Add();

    })
})

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
}

function handleDrop(event) {
    event.preventDefault();
    var input = document.getElementById("file");
    input.files = event.dataTransfer.files;

    // Trigger the readURL function to show image previews or handle files
    readURL(input);
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
function Add() {
    entity = $("#ddlcompany").val();
    ID = $("#hfid").val();
    if (entity == 0) {
        swal('Alert', 'Please select store!', 'error').then(function () { swal.close(); $('#ddlcompany').focus(); });
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

        obj.append("ID", parseInt(ID) || 0);
        obj.append("entity_id", entity);
        $.ajax({
            url: '/CMS/CreateMediagallery/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: obj,
            processData: false,
            contentType: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {

                    if (data.url == "Pages") {
                        swal('Success!', data.message, 'success').then((result) => { location.href = '../Mediagallery'; });
                    }
                    else {
                        swal('Success!', data.message, 'success').then((result) => { location.href = '../Mediagallery'; });
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
    //if (input.files && input.files[0]) {
    //    var reader = new FileReader();
    //    reader.onload = function (e) {
    //        $('#show_picture').attr('src', e.target.result);
    //    };
    //    reader.readAsDataURL(input.files[0]);
    //}

    if (input.files && input.files.length > 0) {
        var imagePreviewContainer = document.getElementById("imagePreviewContainer");

        // Clear any existing content
        imagePreviewContainer.innerHTML = "";

        for (var i = 0; i < input.files.length; i++) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var imageURL = e.target.result;
                // Create an image element and set its source
                var imageElement = document.createElement("img");
                imageElement.src = imageURL;
                imageElement.style.maxWidth = "100%";
                // Append the image element to the container
                imagePreviewContainer.appendChild(imageElement);
            };
            reader.readAsDataURL(input.files[i]);
        }
    }
}
function GetDataByID(ID) {
    var obj = {};
    $.ajax({
        url: '/CMS/GetMediagalleryByID/' + ID,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var i = JSON.parse(data);
            $("#uploadon").text(i[0].post_date);
            $("#filename").text("https://erp.prosourcediesel.com/Content/Media/" + i[0].file_name);
            $("#filetype").text(i[0].file_type);
            $("#filesize").text(Math.round(i[0].file_size) + ' KB');
            $("#dimendion").text(i[0].file_width + ' by ' + i[0].file_height + ' pixels');
            // $"{width} by {height} pixels";  Math.round(i[0].file_size);
            var path = i[0].file_name;
            url = "../../Content/Media/" + path + "";
            $('<img>').on('load', function () {
                // Image exists
                $('#show_picture').attr('src', url);
            }).on('error', function () {
                // Image does not exist
                $('#show_picture').attr('src', "../../Content/Product/default.png"); // Set a default image or do something else
            }).attr('src', url);
        },
        error: function (msg) { alert(msg); }
    });
}