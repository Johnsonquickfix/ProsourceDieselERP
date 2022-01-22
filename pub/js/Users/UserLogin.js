function userAuthenticateLogin() {
    var uID = $('#txtUserId').val();
    var uPass = $('#txturPassword').val();
    if (uID == "") { swal('Alert!', 'Please enter user name!', "error"); }
    else if (uPass == "") { swal('Alert!', "Please enter password!", "error"); }
    else {
        $('#a-autoid-0-announce').text("Waiting...");
        var obj = { UserName: uID, PassWord: uPass }
        $.ajax({
            url: '/AccountAPI/Login', dataType: 'json', type: "Post",
            beforeSend: function () {
                //$("#loading-div-background").show();
            },
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            success: function (data) {
                //$("#loading-div-background").hide();
                if (data.status == true) {
                    window.open(top.window.location.origin + '/' + data.url, "_self");
                }
                else {
                    swal('Error!', data.message, "error");
                    $('#a-autoid-0-announce').text("Login");
                  
                }
            },
            error: function (errormessage) {
                //$("#loading-div-background").hide();
                swal('Error!', "Something went wrong .", "error");
                $('#a-autoid-0-announce').text("Login");
            
            }
        });
    }

}

$('#sendquery').click(function () {

    var name = $('#name').val();
    var email = $('#email').val();
    var subject = $('#subject').val();
    var content = $('#content').val();
    var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (name == "") { swal('Alert', 'Please enter name', 'error').then(function () { swal.close(); $('#name').focus(); }); }
    else if (email == "") { swal('Alert', 'Please enter email', 'error').then(function () { swal.close(); $('#email').focus(); }); }
    else if (!pattern.test(email)) { swal('Alert', 'Please enter valid email', 'error').then(function () { swal.close(); $('#email').focus(); }); }
    else if (subject == 0) { swal('Alert', 'Please enter subject', 'error').then(function () { swal.close(); $('#subject').focus(); }); }


    else {

        var obj = { name: name, email: email, subject: subject, content: content }
        $.ajax({
            url: '/AccountAPI/ContactUs', dataType: 'json', type: "Post",

            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            success: function (data) {
                //$("#loading-div-background").hide();

                swal('success!', "Message send Successfully", "success");
                $('#name').val('');
                $('#email').val('');
                $('#subject').val('');
                $('#content').val(0);

            },
            error: function (errormessage) {
                //$("#loading-div-background").hide();
                swal('Error!', "Something went wrong .", "error");
            }
        });
    }
});