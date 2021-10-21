function custom_processing(order_id) {

    var oid = parseInt(order_id) || 0;
    var obj = { order_id: oid };
    $.ajax({
        type: "POST", contentType: "application/json; charset=utf-8",
        url: "/Orders/SplitOrderByStatus", // Controller/View
        data: JSON.stringify(obj), dataType: "json", beforeSend: function () { },
        success: function (result) {
            if (result.status) {
                console.log(result);
            }            
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
        async: false
    });
}