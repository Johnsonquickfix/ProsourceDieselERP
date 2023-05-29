$(document).ready(function () {
    $("#loader").hide();
    $(".select1").select2();
    getcompany();
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);

    if (id != "") {
        if (id == 'Pages') {
            $("#hfid").val(0);
        }
        else {
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
})

function Add() { 
    title = $("#txttitle").val();
    entity = $("#ddlcompany").val();
    let post_contentval = GetContent();
    ID = $("#hfid").val(); 
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
        var obj = new FormData();
        obj.append("ImageFile", file);
        obj.append("ID", ID);
        obj.append("post_title", title);
        obj.append("post_content", encodeURIComponent(post_contentval));
        obj.append("entity_id", entity);
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
            // console.log(i);
            $("#txttitle").val(i[0].post_title);
            SetContent(i[0].post_content);
            setTimeout(function () { $("#ddlcompany").val(i[0].entity_id).trigger('change'); }, 500);
            
            //$("#txtState").empty().append('<option value="' + i[0].fk_state + '" selected>' + i[0].fk_state + '</option>');
            //$("#txtUserEmail").val(i[0].post_title);
            //$("#txtcompanyname").val(i[0].CompanyName);
            //$("#txtFirstName").val(i[0].firstname);
            //$("#txtLastName").val(i[0].lastname);
            //$("#txtAddress").val(i[0].address);
            //$("#txtCountrycode").val(i[0].country_code_phone);
            ////$("#txtPhone").mask("(999) 999-9999");
            //// $("#txtPhone").val(i[0].user_mobile);
            //$("#txtPhone").val(i[0].user_mobile).trigger('input');
            ////$("#txtPhone").val(i[0].user_mobile).mask("(999) 999-9999");
            //$("#txtAddress2").val(i[0].address1);
            //$("#txtwebsite").val(i[0].website);
            //$("#txtAdditionalNotes").val(i[0].additional_notes);
            //$("#txtpoemail").val(i[0].po_email);
            //$("#txtbaseurl").val(i[0].base_url);
            var path = i[0].meta_value;
            url = "../../Content/Pages/PageBannerLink/" + path + "";
            ////$('#show_picture').attr('src', url);

            ////$('#ImageFile').val(url); // Bind the URL to the input field
             $('#show_picture').attr('src', url);



        },
        error: function (msg) { alert(msg); }
    });
}