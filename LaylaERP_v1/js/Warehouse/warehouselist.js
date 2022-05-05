WarehouseGrid();
/*function WarehouseGrid() {
    var obj = { strValue1: $("#ddlSearchStatus").val() }
        $.ajax({
            url: '/Warehouse/GetWarehouse',
            method: 'post',
            datatype: 'json',
            contentType: "application/json; charset=utf-8",
            processing: true,
            data: JSON.stringify(obj),
            success: function (data) {
                $('#dtdatawarehouse').dataTable({
                    destroy: true,
                    scrollX: true,
                    data: JSON.parse(data),
                    "columns": [
                        { data: 'rowid', title: 'ID', sWidth: "5%" },
                        { data: 'ref', title: 'Ref', sWidth: "10%" },
                        //{ data: 'description', title: 'Description', sWidth: "15%" },
                        { data: 'lieu', title: 'Short Name Location', sWidth: "20%" },
                        { data: 'address', title: 'Address', sWidth: "15%" },
                        {
                            data: 'phone', title: 'Phone', sWidth: "15%", render: function (toFormat) {
                                var tPhone = '';
                                if (toFormat != null) {
                                    tPhone = toFormat.toString();
                                    tPhone = '(' + tPhone.substring(0, 3) + ') ' + tPhone.substring(3, 6) + ' ' + tPhone.substring(6, 10);
                                }
                                return tPhone
                            }
                        },
                        { data: 'status', title: 'Status', sWidth: "10%" },
                        { data:'warehouse_type', title:'Type', sWidth:"10%"},
                        {
                            'data': 'rowid', sWidth: "10%",
                            'render': function (rowid, type, full, meta) {
                                if ($("#hfEdit").val() == "1") {
                                    return '<a href="javascript:void(0);" onClick="EditUser(' + rowid + ')"><span title="Click Here To Edit Warehouse Details" data-placement="bottom" data-toggle="tooltip"><i class="glyphicon glyphicon-pencil"></i></span></a>'
                                }
                                else { return "No Permission"; } 
                            }
                        }
                    ],

                   
                    "order": [[0, 'desc']],
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.responseText);
            }
        });

    } */


function EditUser(rowid) {
    ActivityLog('Edit warehouse id ' + rowid + ' in manage warehouses.', '/Warehouse/Warehouse');
        window.location.href = 'UpdateWarehouse?rowid=' + rowid;
    }

$('#btnSearch').click(function () {
    WarehouseGrid();
})


function WarehouseGrid() {
    var urid = $("#ddlSearchStatus").val();
    ID = $("#hfid").val();
    var table_EL = $('#EmployeeListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }, { "orderable": false, "targets": [0] }, { 'visible': false, 'targets': [0] }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[20, 50], [20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#EmployeeListdata_filter input').unbind();
            $('#EmployeeListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Warehouse/GetWarehouseDetailNew",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "id" : oSettings.aaSorting[0][0] == 1 ? "ref" : oSettings.aaSorting[0][0] == 2 ? "lieu" : oSettings.aaSorting[0][0] == 3 ? "address" : oSettings.aaSorting[0][0] == 4 ? "phone" : "id";
                aoData.push({ name: "sSortColName", value: col });
            }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            { data: 'id', title: 'ID', sWidth: "5%" },
            { data: 'ref', title: 'Ref', sWidth: "10%", class:'text-left' },
            //{ data: 'description', title: 'Description', sWidth: "15%" },
            { data: 'lieu', title: 'Short Name Location', sWidth: "20%" },
            { data: 'address', title: 'Address', sWidth: "15%" },
            {
                data: 'phone', title: 'Phone', sWidth: "15%", render: function (toFormat) {
                    var tPhone = '';
                    if (toFormat != null) {
                        tPhone = toFormat.toString();
                        tPhone = '(' + tPhone.substring(0, 3) + ') ' + tPhone.substring(3, 6) + ' ' + tPhone.substring(6, 10);
                    }
                    return tPhone
                }
            },
            { data: 'status', title: 'Status', sWidth: "10%" },
            //{ data: 'warehouse_type', title: 'Type', sWidth: "10%" },
            {
                'data': 'id', sWidth: "10%",
                'render': function (id, type, full, meta) {
                    if ($("#hfEdit").val() == "1") {
                        return '<a href="javascript:void(0);" onClick="EditUser(' + id + ')"><span title="Click here to edit warehouse details" data-placement="bottom" data-toggle="tooltip"><i class="glyphicon glyphicon-pencil"></i></span></a>'
                    }
                    else { return "No Permission"; }
                }
            }

        ]
    });
}
