﻿function getProducts() {
    debugger
    $.get('GetProductList', function (data) {
        $('#ddlProduct').empty();
        var items = "";
        items += "<option value=''>--Please select Product--</option>";
        $.each(data, function (index, value) {
            items += "<option value=" + this['Value'] + ">" + this['Text'] + "</option>";
        })
        $("#ddlProduct").html(items);
    })
}
$("#btnSearch").click(function () {
    $("#btnSave").css("display", "block");
    ProductGrid();
})

function ProductGrid() {
    var urid = parseInt($("#ddlSearchStatus").val()) || "";
    var sid = "";
    var parent = $("#ddlProduct").val();
    var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 10, sEcho: 1, SortCol: 'id', SortDir: 'desc', strValue1: parent};
    $('#dtdata').DataTable({
        
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        sPaginationType: "full_numbers", searching: false, ordering: false, lengthChange: false, "paging": false, "bInfo": false,
        bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        sAjaxSource: "/Inventory/GetVarientList",
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
           
          
            { data: 'post', title: 'Product', sWidth: "14%" },
            {
                'data': 'Count', sWidth: "8%",
                'render': function (id, type, full, meta) {
                    //console.log(type);
                    return '<input type="text" name="txtCount" class="form-control" value="' + full.Count + '" id="' + full.meta_id + '" />';
                }
            }
           
           
        ]
    });
}

$("#btnSave").click(function () {

    var id = "";
    var value = "";
    $('#dtdata').find('input[type=text]').each(function () {
       
        if (value != '') value += ','; value += $(this).val();

        if (id != '') id += ','; id += $(this).attr('id');
       

       
    });
    console.log(id, value);
    SaveChanges(id, value);
    
})

function SaveChanges(id, value) {
    var obj = { meta_id: id, meta_value: value }
    $.ajax({
        url: '/Inventory/UpdateInventoryStock', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == true) {
                swal('Alert!', data.message, 'success');
            }
            else {
                swal('Alert!', data.message, 'error')
            }
        },
        error: function (error) {
            swal('Error!', 'something went wrong', 'error');
        },
    })
}