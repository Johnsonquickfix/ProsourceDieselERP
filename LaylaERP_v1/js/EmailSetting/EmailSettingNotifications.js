$(document).ready(function () {
    $("#loader").hide();
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    $("#hfid").val(id);
    $("#btnhide").hide();
    $('#divhtml').hide();
    GetDetails(id);
    //loadFile();
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
    templatename = $("#templatename").val();

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
            recipients: recipientsval,
            filename: templatename

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
                        swal('Success!', data.message, 'success').then((result) => { location.href = '../EmailNotifications'; });
                    }
                    else {

                        swal('Success!', data.message, 'success');
                    }
                }
                else {
                    swal('Alert!', data.message, 'error')
                }
            },
            complete: function () {
                $("#loader").hide(); isEdit(false);
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
            let str = result.filename.replace(".cshtml", "");
            //str.replace(".cshtml", "");
            $("#templatename").val(str);
 
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { $("#loader").hide(); swal('Alert!', errorThrown, "error"); },
        complete: function () { $("#loader").hide(); },
        async: false
    });

}


function loadFile() {


    //function reqListener() {
    //    document.forms[0].text.value = this.responseText;
    //}

    //var txtinput = document.getElementById("textbox01").value;
    //var filePath = "D:\LaylaERP\LaylaERP\Views\EmailNotifications\NewOrder.cshtml" + txtinput + ".txt";

    //var oReq = new XMLHttpRequest();
    //oReq.onload = reqListener;
    //oReq.open("get", filePath, true);
    //oReq.send();


    //////$.ajax({
    //////    /*    url: "../EmailNotifications/NewOrder.cshtml",*/
    //////    url: "../../EmailNotifications/NewOrderTest",
    //////    dataType: "text",
    //////    success: function (data) {
    //////        console.log(data);
    //////        $("#text").val(data);
           
    //////    }
    //////});


    //var xhr = new XMLHttpRequest();
    //xhr.open('GET', 'file.txt', true);
    //xhr.onload = function () {
    //    if (this.status == 200) {
    //        document.getElementById('content').innerHTML += (this.responseText);
    //    } else {
    //        document.write('Something went Wrong ' + this.status);
    //    }
    //}
    //xhr.send();
}

    //var xmlhttp = new XMLHttpRequest();
    //var url = "../EmailNotifications/NewOrder";

    //xmlhttp.onreadystatechange = function () {
       
    //    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //        console.log(xmlhttp.readyState);
    //        var myArr = JSON.parse(xmlhttp.responseText);
    //        myFunction(myArr);

    //        console.log("xmlhttp Request Asepted");
    //    }


    //}

    //xmlhttp.open("GET", url, true);
    //xmlhttp.send();
    ////console.log("xmlhttp Request Asepted");

    //function myFunction(arr) {
    //    var out = "";
    //    var i;
    //    var row = 0;

    //    for (i = 0; i < arr.length; i++) {
    //        // console.log( arr[1].data); change data to what every you have in  your file
    //        // out +=  arr[i].data + '<br>' + arr[i].data2 ;
    //        document.getElementById("textbox01").innerHTML = out;

    //    }

    //}

$(document).on('click', "#btnshow", function () {
    console.log('vg');
    $("#btnshow").hide();
    $("#btnhide").show();
    $('#divhtml').show();
});

$(document).on('click', "#btnhide", function () {
    console.log('hide');
    $("#btnshow").show();
    $("#btnhide").hide();
    $('#divhtml').hide();
});
 