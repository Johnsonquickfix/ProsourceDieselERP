﻿function CheckPermissions(add, edit, del, loc) {
    var obj = { userId: GetUserID, menu_url: loc };
    jQuery.ajax({
        url: '/AccountAPI/getUserPermissions', dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            if (data[0].add_ == 1) { $(add).show(); } else { $(add).remove(); }
            if (data[0].edit_ == 1) { $(edit).show(); } else { $(edit).remove(); }
            if (data[0].delete_ == 1) { $(del).show(); } else { $(del).remove(); }
        },
        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });
}
