$(document).ready(function () {
   
    var loc = window.location.pathname;
    CheckPermissions("#btnAddVendor", "#hfEdit", "", loc);
    VendorGrid();
    //isEdit(true);
})
function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}
function VendorGrid() {
    var urid = parseInt($("#ddlSearchStatus").val());
    var sid = "";
    var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 50, sEcho: 1, SortCol: 'ID', SortDir: 'desc' };
    $('#dtdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true, "paging": true,
        bAutoWidth: false, scrollX: false, scrollY: false,
        lengthMenu: [[20, 50], [20, 50]],
        sAjaxSource: "/ThirdParty/GetVendorList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            obj.Search = aoData[50].value;
            var col = 'ID';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "ID" : oSettings.aaSorting[0][0] == 1 ? "name" : oSettings.aaSorting[0][0] == 2 ? "vendor_type" : oSettings.aaSorting[0][0] == 3 ? "name_alias" : oSettings.aaSorting[0][0] == 4 ? "zip" : oSettings.aaSorting[0][0] == 5 ? "address" : oSettings.aaSorting[0][0] == 6 ? "phone" : "id";
                obj.SortCol = col; obj.SortDir = oSettings.aaSorting.length > 0 ? oSettings.aaSorting[0][1] : "desc";
            }
            obj.sEcho = aoData[0].value; obj.PageSize = oSettings._iDisplayLength; obj.PageNo = oSettings._iDisplayStart;
            $.ajax({
                type: "POST", url: sSource, async: true, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
                success: function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, iTotalRecords: data.iTotalRecords, iTotalDisplayRecords: data.iTotalDisplayRecords, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
                async: false
            });
        },
        aoColumns: [
            {
                'data': 'VendorCode', sWidth: "10%",
                'render': function (id, type, full, meta) {
                    if ($("#hfEdit").val() == "1") {
                        return '<a href="../ThirdParty/NewVendor/' + full.ID + '">' + id + '</a>';
                    }
                    else { return id; }
                    //return '<a href="../ThirdParty/NewVendor/' + id + '">' + id + '</a>';
                }
            },
            { data: 'VendorName', title: 'Vendor Name' },
            { data: 'vendor_type', title: 'Vendor Type' },
            { data: 'AliasName', title: 'Alias Name' },
            { data: 'zip', title: 'Zip Code' },
            { data: 'address', title: 'Address' },
            {

                data: 'phone', title: 'Phone',
                render: function (toFormat) {
                    var tPhone = '';
                    if (toFormat != null) {
                        tPhone = toFormat.toString();
                        tPhone = '(' + tPhone.substring(0, 3) + ') ' + tPhone.substring(3, 6) + ' ' + tPhone.substring(6, 10);
                    }
                    return tPhone
                }
            },
            { data: 'userid', title: 'User Id' },
            {
                'data': 'ID',
                'render': function (id, type, full, meta) {
                    if ($("#hfEdit").val() == "1") {
                        
                        return '<a href="../ThirdParty/NewVendor/' + id + '" onclick="ActivityLog(\'Edit vendor id ' + id + ' in manage vendors.\',\'ThirdParty/VendorList\');" data-toggle="tooltip" title="View/Edit Vendor"><i class="glyphicon glyphicon-pencil"></i></a>';
                    }
                    else { return "No Permission"; }
                }
            }
        ]
    });
}

$('#btnSearch').click(function () {
    VendorGrid();
})

function ActivityLog(ModuleName, ModuleURL) {
    console.log(ModuleName, ModuleURL);
    var obj = {
        ModuleName: ModuleName, ModuleURL: ModuleURL
    }
    $.ajax({
        url: '/ThirdParty/ActivityDbLog/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) { },
        //error: function (error) {
        //    swal('Error!', 'something went wrong', 'error');
        //},
    })

}
