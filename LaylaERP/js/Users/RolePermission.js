function CheckPermissions(add, hfEdit, del, loc) {
    var obj = { userId: GetUserID, menu_url: loc };
    jQuery.ajax({
        url: '/AccountAPI/getUserPermissions', dataType: 'json', type: "Post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            $(hfEdit).val(data[0].edit_);
            if (data[0].add_ == 1) { $(add).show(); } else { $(add).remove(); }
            if (data[0].delete_ == 1) { $(del).show(); } else { $(del).remove(); }
        },

        error: function (jqXHR, textStatus, errorThrown) { swal('Error!', errorThrown, "error"); }
    });
}
