﻿
WarehouseGrid();
function WarehouseGrid() {
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
                        //{ data:'warehouse_type', title:'Type', sWidth:"10%"},
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

    }


    function EditUser(rowid) {
        window.location.href = 'UpdateWarehouse?rowid=' + rowid;
    }

$('#btnSearch').click(function () {
    WarehouseGrid();
})


