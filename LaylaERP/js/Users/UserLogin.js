function userAuthenticateLogin() {
    var uID = $('#txtUserId').val();
    var uPass = $('#txturPassword').val();
    if (uID == "") { swal('Alert!', 'Please enter user name!', "error"); }
    else if (uPass == "") { swal('Alert!', "Enter enter Password.", "error"); }
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
                    swal('Alert!', data.message, "error");
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