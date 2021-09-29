$(document).ready(function () {
    $("#loader").hide();
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    $("#hfid").val(id);
    GetDetails(id); 
 /*   setTimeout(function () { GetDetails(id); }, 200);*/
});
$(document).on('click', "#btnsave", function () {
    addemailnotification();
});
function addemailnotification() {
    option_nameval = $("#hfid").val();
    if ($("#theemailenable").prop('checked') == true)
        is_activeval = "1";
    else
        is_activeval = "0";

    email_typeval = $("#templatetype").val();
    additional_contentval = $("#emailcontent").val();
    email_headingval = $("#emailheading").val();
    subjectval = $("#emailsubject").val();
    recipientsval = $("#recipients").val();
    
    if (option_nameval == "") {
        swal('Alert', 'Please Enter Option Name', 'error').then(function () { swal.close(); });
    }
    else {
        var obj = {
            option_name: option_nameval,
            email_type: email_typeval,
            is_active: is_activeval,
            additional_content: additional_contentval,
            email_heading: email_headingval,
            subject: subjectval,
            recipients: recipientsval          

        }
        $.ajax({
            url: '/EmailSetting/UpdateEmailNotification/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (data) {
                if (data.status == true) {
                    if (data.url == "Manage") {
                        swal('Alert!', data.message, 'success').then((result) => { location.href = '../EmailNotifications'; });
                    }
                    else {

                        swal('Alert!', data.message, 'success');
                    }
                }
                else {
                    swal('Alert!', data.message, 'error')
                }
            },
            complete: function () {
                $("#loader").hide();
            },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
        })
    }



}

function GetDetails(type) {   
    var ID = type;
    var obj = { strValue1: type }


    var option = { strValue1: type };
    $.ajax({
        type: "POST", url: '/EmailSetting/GetDetails', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(option),
        beforeSend: function () { $("#loader").show(); },
        success: function (result) {

            if (result.is_active == "1")
                $("#theemailenable").prop("checked", true);
            else
                $("#theemailenable").prop("checked", false);

            $("#recipients").val(result.recipients);
            $("#emailsubject").val(result.subject);
            $("#emailheading").val(result.email_heading);
            $("#emailcontent").val(result.additional_content);
            $('#templatetype').val(result.email_type).trigger('change');
 
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
        complete: function () { $("#loader").hide(); },
        async: false
    });

}