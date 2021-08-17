VendorGrid();
function VendorGrid() {
    var urid = parseInt($("#ddlSearchStatus").val());
    var sid = "";
    var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 50, sEcho: 1, SortCol: 'ID', SortDir: 'desc' };
    $('#dtdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true, "paging": true,
        bAutoWidth: false, scrollX: false, scrollY: false,
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        sAjaxSource: "/ThirdParty/GetVendorList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            obj.Search = aoData[45].value;
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
                    return '<a href="../ThirdParty/NewVendor/' + full.ID + '">' + id + '</a>';
                    //return '<a href="../ThirdParty/NewVendor/' + id + '">' + id + '</a>';
                }
            },
            { data: 'VendorName', title: 'Vendor Name'}, 
            { data: 'vendor_type', title: 'Vendor Type' },
            { data: 'AliasName', title: 'Alias Name'},
            { data: 'zip', title: 'Zip Code' },
            { data: 'address', title: 'Address'},
            { data: 'phone', title: 'Phone'},


            {
                'data': 'ID',
                'render': function (id, type, full, meta) {
                    /*  if ($("#hfEdit").val() == "1") {*/
                    return '<a href="../ThirdParty/NewVendor/' + id + '"><i class="glyphicon glyphicon-pencil"></i></a>';
                    //}
                    //else { return "No Permission"; }
                }
            }


        ]
    });
}

$('#btnSearch').click(function () {
    VendorGrid();
})