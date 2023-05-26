  
$(document).ready(function () {
    $("#loader").hide();
    //$("#txtPhone").mask("(999) 999-9999");
    $('.select1').select2(); 
    $("#txtState").select2({ 
        allowClear: true, minimumInputLength: 2, placeholder: "Search State",
        ajax: {
            url: '/Users/GetCustState', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) {
                var obj = { strValue1: params.term, strValue2: $("#txtCountry").val() };
                return JSON.stringify(obj);
            },
            processResults: function (data) {
                var jobj = JSON.parse(data);
                //console.log(jobj);
                return {
                    results: $.map(jobj, function (item) {
                        return { text: item.StateFullName, name: item.StateFullName, id: item.StateFullName }
                    })
                };
            },
            error: function (xhr, status, err) { }, cache: true
        }
    }); 
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);

    if (id != "") {
        if (id == 'CreateNew') {
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
    console.log($("#hfid").val());
    $('#txtPostCode').change(function () { 
        City = $("#txtCity").val();
        State = $("#txtState").val();
        PostalCode = $("#txtPostCode").val();
        countryval = $("#txtCountry").val();
        var obj = {
            billing_state: State,
            billing_city: City,
            billing_postcode: PostalCode,
            country: countryval
        }
        $.ajax({
            url: '/Users/CityStateZip/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            success: function (data) {
                if (data.status == true) {
                    // swal('Alert!', 'Post zip code is valid for City and State', 'success')
                    // $('#hfzipstatus').val(data.status);
                    $('#hfzipstatus').val(data.status);
                    // console.log("CIty", data.status);
                }
                else {
                    if ($('#txtCountry').val() == "US") {
                        $("#txtPostCode").val("");
                        $('#hfzipstatus').val(data.status);
                        swal('Alert', 'Zip code is not valid for the State', 'error').then(function () { swal.close(); $('#txtPostCode').focus(); });
                    }
                    if ($('#txtCountry').val() == "CA") {
                        $('#hfzipstatus').val("true");
                    }
                }
            },

            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
        })
    });

    $(document).on('click', "#btnSave", function () {
        AddEntity();
    })
    $("#txtPhone").mask("(999) 999-9999");
    isEdit(true);
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#show_picture').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]); 
    }
} 
function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
} 
$('#txtState').change(function () {
    if ($("#txtPostCode").val() != '') {
        City = $("#txtCity").val();
        State = $("#txtState").val();
        PostalCode = $("#txtPostCode").val();
        countryval = $("#txtCountry").val();
        var obj = {
            billing_state: State,
            billing_city: City,
            billing_postcode: PostalCode,
            country: countryval
        }
        $.ajax({
            url: '/Users/CityStateZip/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            success: function (data) {
                if (data.status == true) {
                    //swal('Alert!', 'Post zip code is valid for City and State', 'success')
                    // $('#hfzipstatus').val(data.status);
                    $('#hfzipstatus').val(data.status);
                    // console.log("stTE", data.status);

                }
                else {
                    if ($('#txtCountry').val() == "US") {
                        $("#txtPostCode").val("");
                        $('#hfzipstatus').val(data.status);
                        swal('Alert', 'Zip code is not valid for the State', 'error').then(function () { swal.close(); $('#txtPostCode').focus(); });
                    }
                    if ($('#txtCountry').val() == "CA") {
                        $('#hfzipstatus').val("true");
                    }
                }
            },

            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
        })
    }
});

function AddEntity() {
    //debugger
    Emailuser = $("#txtUserEmail").val();
    companyname = $("#txtcompanyname").val();
    FirstName = $("#txtFirstName").val();
    LastName = $("#txtLastName").val();
    address = $("#txtAddress").val();
    country = $("#txtCountry").val();
    Countrycode = $("#txtCountrycode").val();
    Phone = $("#txtPhone").unmask().val();
    Zipcode = $("#txtPostCode").val();
    City = $("#txtCity").val();
    State = $("#txtState").val();
    address2 = $("#txtAddress2").val();
    Website = $("#txtwebsite").val();
    LogoUrl = $("#txtlogourl").val();
    AdditionalNotes = $("#txtAdditionalNotes").val();
    po_emailval = $("#txtpoemail").val();
    base_url = $("#txtbaseurl").val(); 
    var imageUrl = $('#show_picture').attr('src');  
    ID = $("#hfid").val();

    if (companyname == "") {
        swal('Alert', 'Please enter company name', 'error').then(function () { swal.close(); $('#txtcompanyname').focus(); });
    }
    else if (Emailuser == "") {
        swal('Alert', 'Please enter email', 'error').then(function () { swal.close(); $('#txtUserEmail').focus(); });
    }
    else if (Phone == "") {
        swal('Alert', 'Please enter contact number', 'error').then(function () { swal.close(); $('#txtPhone').focus(); });
    }
    else {
        var file = document.getElementById("ImageFile").files[0];
        var obj = new FormData();
        obj.append("ImageFile", file);
        obj.append("ID", ID);
        obj.append("Emailuser", Emailuser);
        obj.append("companyname", companyname);
        obj.append("FirstName", FirstName);
        obj.append("LastName", LastName);
        obj.append("address", address);
        obj.append("country", country);
        obj.append("Countrycode", Countrycode);
        obj.append("Phone", Phone);
        obj.append("Zipcode", Zipcode);
        obj.append("City", City);
        obj.append("State", State);
        obj.append("Website", Website);
        obj.append("LogoUrl", LogoUrl);
        obj.append("AdditionalNotes", AdditionalNotes);
        obj.append("po_emailval", po_emailval);
        obj.append("base_url", base_url);
        obj.append("address2", address2);
        $.ajax({
            url: '/Entity/CreateEntity/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: obj,
            processData: false,
            contentType: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {

                    if (data.url == "Entity") {
                        swal('Success!', data.message, 'success').then((result) => { location.href = '../Index'; });
                    }
                    else { 
                        swal('Success!', data.message, 'success').then((result) => { location.href = 'Index'; });
                    } 
                }
                else { swal('Alert!', data.message, 'error') }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', error.message, 'error'); },
        })
    }
}
 

$('#txtCountry').on('select2:select', function (e) {
    $('#txtAddress').val(""); 
    $("#txtCity").val("");
    $("#txtPostCode").val("");
    $("#txtState").val(null).trigger('change');
});
 


function GetDataByID(ID) {

    //var ID = ID;
    var obj = {};
    $.ajax({

        url: '/Entity/GetDataByID/' + ID,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var i = JSON.parse(data);
            //console.log(i);
            $("#txtCountry").val(i[0].fk_country).trigger('change'); 
            $("#txtCity").val(i[0].town);
            $("#txtState").empty().append('<option value="' + i[0].fk_state + '" selected>' + i[0].fk_state + '</option>');
            $("#txtUserEmail").val(i[0].email);
            $("#txtcompanyname").val(i[0].CompanyName);
            $("#txtFirstName").val(i[0].firstname);
            $("#txtLastName").val(i[0].lastname);
            $("#txtAddress").val(i[0].address);
            $("#txtCountrycode").val(i[0].country_code_phone);
            //$("#txtPhone").mask("(999) 999-9999");
           // $("#txtPhone").val(i[0].user_mobile);
            $("#txtPhone").val(i[0].user_mobile).trigger('input');
            //$("#txtPhone").val(i[0].user_mobile).mask("(999) 999-9999");
            $("#txtAddress2").val(i[0].address1);
            $("#txtwebsite").val(i[0].website);
            $("#txtAdditionalNotes").val(i[0].additional_notes);
            $("#txtpoemail").val(i[0].po_email);
            $("#txtbaseurl").val(i[0].base_url);
            var path = i[0].logo_url;
            url = "../../Content/Entity/" + path + "";
            //$('#show_picture').attr('src', url);

            //$('#ImageFile').val(url); // Bind the URL to the input field
            $('#show_picture').attr('src', url);

           

        },
        error: function (msg) { alert(msg); }
    });
}