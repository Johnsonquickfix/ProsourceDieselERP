$(document).ready(function () {
    $("#loader").hide();
    $(".select1").select2();
    getcompany();
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1); 
    getcompany(); 

    if (id != "") {
        if (id == 'Banner') {
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


    $('input[type=radio][name=banner]').change(function () {
        if ($("input[name='banner']:checked").val() == "1") {
            $("#dvpage").show();
           
            $("#ddlpage").select2({
                allowClear: true, minimumInputLength: 0, placeholder: "Search company",
                ajax: {
                    url: '/CMS/GetpageData', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
                    data: function (params) { var obj = { strValue1: params.term, strValue2: '' }; return JSON.stringify(obj); },
                    processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.label, name: item.label, val: item.ID, id: item.ID } }) }; },
                    error: function (xhr, status, err) { }, cache: true
                }
            });
            $('#dvcategory').hide();
        }
        else { 
            $("#dvcategory").show();
            $("#ddlCategory").select2({
                allowClear: true, minimumInputLength: 2, placeholder: "Search Category",
                ajax: {
                    url: '/CMS/GetcategoryData', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
                    data: function (params) { var obj = { strValue1: params.term, strValue2: '' }; return JSON.stringify(obj); },
                    processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.label, name: item.label, val: item.ID, id: item.ID } }) }; },
                    error: function (xhr, status, err) { }, cache: true
                }
            });
            $('#dvpage').hide();
        }
        $(document).on('click', "#btndivprv", function () {
            $(".step1Right").show();
            $(".step1Left").hide();

        })
    });

    // $("#btnbacklist").prop("href", "List")

    $(document).on('click', "#btnSave", function () {
        Add();

    })
})
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
function Add() {
    title = $("#txttitle").val();
    entity = $("#ddlcompany").val();
    content = $("#txtcontent").val();
    seo = $("#txtseo").val();
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
        obj.append("SEO", seo);
        obj.append("Content", content);
        console.log(post_contentval);
        $.ajax({
            url: '/CMS/CreateBanner/', dataType: 'json', type: 'Post',
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
 
function GetDataByID(ID) {

    //var ID = ID;
    var obj = {};
    $.ajax({

        url: '/CMS/GetBannerDataByID/' + ID,
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
            var path = i[0].meta_value;
            url = "../../Content/Pages/PageBannerLink/" + path + "";
            $('#show_picture').attr('src', url);



        },
        error: function (msg) { alert(msg); }
    });
}