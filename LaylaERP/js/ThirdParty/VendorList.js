﻿VendorGrid();
function VendorGrid() {
    var urid = parseInt($("#ddlSearchStatus").val());
    var sid = "";
    var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 50, sEcho: 1, SortCol: 'id', SortDir: 'desc' };
    $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true, "paging": true,
        bAutoWidth: false, scrollX: false, scrollY: false,
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        sAjaxSource: "/ThirdParty/GetVendorList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {

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
                    return '<a href="../ThirdParty/NewVendor/' + id + '">' + id + '</a>';
                }
            },
            { data: 'VendorName', title: 'Vendor Name', sWidth: "20%" },
            { data: 'AliasName', title: 'Alias Name', sWidth: "10%" },
            { data: 'zip', title: 'Zip Code', sWidth: "10%" },
            { data: 'address', title: 'Address', sWidth: "20%" },
            { data: 'phone', title: 'Phone', sWidth: "10%" },


            {
                'data': 'ID', sWidth: "8%",
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