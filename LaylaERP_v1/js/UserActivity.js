
function ActivityLog(ModuleName, ModuleURL) {
    var obj = {
        ModuleName: ModuleName, ModuleURL: ModuleURL
    }
    $.ajax({
        url: '/Setting/ActivityDbLog/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) { },
        error: function (error) {
            console.log(error);
        },
    })

}
