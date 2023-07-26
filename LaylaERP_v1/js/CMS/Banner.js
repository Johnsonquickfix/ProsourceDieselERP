$(document).ready(function () {
    $("#loader").hide();
    $(".select2").select2();
    getcompany();
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);  
    //$("#dvpage").show();
    if (id != "") {
        if (id == 'Banner') {
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
    $('#featuredshow_picture').click(function () {
        console.log('ss');
        $('#Featuredfile').click(); // Trigger click event on file input element
    });

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

    $('#lblpermalink').click(function (event) {
        // Prevent the default behavior of the link
        event.preventDefault(); 
        var url = '/CMS/Banners/' + id; 
        // Open the URL in a new tab
        window.open(url, '_blank');

    });
})


function selectepage() {
    $("#ddlpage").empty();
    var obj = { strValue1: '' }
    $.ajax({
        url: '/CMS/GetpageData',
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var datalog = JSON.parse(data);
            for (var i = 0; i < datalog.length; i++) {
                $("#ddlpage").append('<option value="' + datalog[i].ID + '" selected>' + datalog[i].label + '</option>');
            }
        },
        error: function (msg) { alert(msg); },
        async: false
    });
}
function selectecategory() {
    $("#ddlCategory").empty();
    var obj = { strValue1: '' }
    $.ajax({
        url: '/CMS/GetcategoryData',
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var datalog = JSON.parse(data);
            for (var i = 0; i < datalog.length; i++) {
                $("#ddlCategory").append('<option value="' + datalog[i].ID + '" selected>' + datalog[i].label + '</option>');
            }
        },
        error: function (msg) { alert(msg); },
        async: false
    });
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
function Add() {
    title = $("#txttitle").val();
    entity = $("#ddlcompany").val();
    bannerurl = $("#txturl").val();

    var pagesarray = $('#ddlpage option:selected')
        .toArray().map(item => item.value).join();
    pages = pagesarray;

    var categoryarray = $('#ddlCategory option:selected')
        .toArray().map(item => item.value).join();
    category = categoryarray;

    if ($("input[name='banner']:checked").val() == "1") {
        Typeval = pages;
        Typeof = 'InnerPageBannerPage';
    }
    else if ($("input[name='banner']:checked").val() == "2") {
        Typeval = category;
        Typeof = 'InnerPageBannerProductCategory';
    }
    else {
        Typeval = '';
        Typeof = '';
    }

    //console.log(rowid, page, pagetext)

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
        var featuredfile = document.getElementById("Featuredfile").files[0];
        var obj = new FormData();
        obj.append("ImageFile", file);
        obj.append("FeaturedFile", featuredfile);
        obj.append("ID", ID);
        obj.append("post_title", title);
        obj.append("bannerurl", encodeURIComponent(bannerurl));
        obj.append("entity_id", entity);
        //obj.append("pages", pages);
        //obj.append("futcher", category); 
        obj.append("type", Typeval);
        obj.append("btypeof", Typeof);
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
                        swal('Success!', data.message, 'success').then((result) => { location.href = '../BannerList'; });
                    }
                    else {
                        swal('Success!', data.message, 'success').then((result) => { location.href = 'BannerList'; });
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
    var obj = {};
    $.ajax({ 
        url: '/CMS/GetBannerDataByID/' + ID,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var i = JSON.parse(data);
            console.log(i);
            //var innerPageBannerSelection = i[0].InnerPageBannerSelection;
            //var value = innerPageBannerSelection.match(/"(\d+)"/)[1]; 
            var type = i[0].InnerPageBannerType;
            if (type == 'InnerPageBannerProductCategory') { 
                $('#Speed').prop('checked', true); 
                selectecategory();
                $('input[type=radio][name=banner]').change();
                //$("#dvcategory").show();
                $('#ddlCategory').select2();
                var input = i[0].InnerPageBannerSelection;
                var pattern = /"(\d+)"/g; 
                // Match all the numbers using the pattern
                var matches = input.match(pattern); 
                // Check if matches is not null
                if (matches && matches.length > 0) {
                    // Join the matched numbers into a comma-separated string
                    var numbersString = matches.map(match => match.replace(/"/g, '')).join(',');
                    console.log(numbersString);
                    $("#ddlCategory").select2("val", [numbersString.split(',')]);
                }
            }
            else {
                $('#Design').prop('checked', true);
                selectepage();
                $('#ddlpage').select2(); 
                var input = i[0].InnerPageBannerSelection;
                console.log('dd',input);
                if (input == null || input == "") {
                   // console.log('ddcc');
                    $('#ddlpage').empty();
                    $('input[name="banner"]').prop('checked', false);
                    $('#dvpage').hide();
                }
                else {
                    var pattern = /"(\d+)"/g;
                    // Match all the numbers using the pattern
                    var matches = input.match(pattern);
                    // Check if matches is not null
                    if (matches && matches.length > 0) {
                        // Join the matched numbers into a comma-separated string
                        var numbersString = matches.map(match => match.replace(/"/g, '')).join(',');
                        $("#ddlpage").select2("val", [numbersString.split(',')]);
                    }
                }
            }
            setTimeout(function () { $("#ddlcompany").val(i[0].entity_id).trigger('change'); }, 500);
 
            $("#txttitle").val(i[0].post_title); 
            $("#txturl").val(i[0].InnerPageBannerLink);

            var path = i[0].for_mobile;
            url = "../../Content/Banner/MobileBanner/" + path + "";
            $('<img>').on('load', function () {
                // Image exists
                $('#show_picture').attr('src', url);
            }).on('error', function () {
                // Image does not exist
                $('#show_picture').attr('src', "../../Content/Product/default.png"); // Set a default image or do something else
            }).attr('src', url);

            // $('#show_picture').attr('src', url); 
            var urlpath = i[0].InnerPageBannerImage;
            furl = "../../Content/Banner/Featured/" + urlpath + "";
            $('<img>').on('load', function () {
                // Image exists
                $('#featuredshow_picture').attr('src', furl);
            }).on('error', function () {
                // Image does not exist
                $('#featuredshow_picture').attr('src', "../../Content/Product/default.png"); // Set a default image or do something else
            }).attr('src', furl);

            $('#lblpermalink').text("Permalink:https://erp.prosourcediesel.com/" + i[0].post_title + "");
        
        },
        error: function (msg) { alert(msg); }
    });
}