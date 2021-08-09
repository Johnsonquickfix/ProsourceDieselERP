VendorWarehouseGrid();
getWarehouse();
function VendorWarehouseGrid() {
    var obj = { strValue1: $("#ddlWarehouse").val() }
    $.ajax({
        url: '/Warehouse/Getvendorwarehouse',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        data: JSON.stringify(obj),
        success: function (data) {
            $('#vendor').dataTable({
                destroy: true,
                //scrollX: true,
                data: JSON.parse(data),
                "columns": [
                    { data: 'vname', title: 'Vendor Name', sWidth: "25%"},
                    { data: 'wname', title: 'Warehouse Name', sWidth: "25%" },
                    { data: 'Vaddress', title: 'Vendor Address', sWidth: "25%" },
                    { data: 'phone', title: 'Vendor Phone', sWidth: "25%" }
                ],


                "order": [[0, 'desc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });

}




var searchText = getUrlVars();

function getUrlVars() {
    var sPageURL = decodeURIComponent(window.location.search.substring(1));
    sPageURL = sPageURL.split('name=');
    var sURLVariables = sPageURL.toString().replace(',', '');
    return sURLVariables
}



function WarehouseGrid1() {
    var urid = parseInt($("#ddlSearchStatus").val());
    var sid = "";
    var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 50, sEcho: 1, SortCol: 'id', SortDir: 'desc' };
    $('#dtdata').DataTable({
        oSearch: { "sSearch": searchText },
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true,
        bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        sAjaxSource: "/Warehouse/GetWarehouseByVendor",
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
            { data: 'vname', title: 'Vendor Name' },
            { data: 'wname', title: 'Warehouse Name' },
            { data: 'Vaddress', title: 'Vendor Address' },
            { data: 'phone', title: 'Vendor Phone' }
        ]
    });
}



function getWarehouse() {

    $.ajax({
        url: "/Warehouse/GetWarehousename",
        type: "Get",
        success: function (data) {
            var opt = '<option value="">Please Select Warehouse</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlWarehouse').html(opt);
        }

    });
}

$('#btnSearchVendor').click(function () {
    VendorWarehouseGrid();
})