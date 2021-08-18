$(document).ready(function () {
    getProducts();
    ProductStockGrid();
    $(".select2").select2();
    $("#ddlProduct,#ddlCategory").change(function () {
        $("#btnSave").css("display", "block");
        ProductStockGrid();
    });
    $("#txtsku").change(function () {
        ProductStockGrid();
    });
})

function getProducts() {
    $.ajax({
        url: "/Inventory/GetProductList",
        type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            //Product
            $("#ddlProduct").html('<option value="0">Select Product</option>');
            for (i = 0; i < dt['Table'].length; i++) { $("#ddlProduct").append('<option value="' + dt['Table'][i].id + '">' + dt['Table'][i].text + '</option>'); }

            //Category
            $("#ddlCategory").html('<option value="0">Select Category</option>');
            for (i = 0; i < dt['Table1'].length; i++) { $("#ddlCategory").append('<option value="' + dt['Table1'][i].id + '">' + dt['Table1'][i].text + '</option>'); }
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }
    });
}


function ProductStockGrid() {
    let pid = parseInt($("#ddlProduct").val()) || 0, ctid = parseInt($("#ddlCategory").val()) || 0;
    let obj = { strValue1: $("#txtsku").val().trim(), strValue2: (ctid > 0 ? ctid : ''), strValue3: (pid > 0 ? pid : '') }; console.log(obj);
    $('#dtdata').DataTable({
        oSearch: { "sSearch": '' }, order: [[0, "asc"]],
        dom: 'lBftip', buttons: [{ extend: 'excelHtml5', title: 'Product Stock Report' }, { extend: 'csvHtml5', title: 'Product Stock Report' }],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        destroy: true, bAutoWidth: false, ajax: {
            url: '/Inventory/GetProductStock', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
        columns: [
            { data: 'p_id', title: 'Parent ID', sWidth: "10%" },
            {
                data: 'id', title: 'ID', sWidth: "10%", render: function (data, type, row) {
                    if (row.post_parent > 0) return '↳  #' + row.id; else return '<b>#' + row.id + '</b>';
                }
            },
            {
                data: 'post_type', title: 'Product Type', sWidth: "10%", render: function (data, type, row) {
                    if (data == 'product') return 'Product';
                    else if (data == 'product_variation') return 'Variable Product';
                    else return '-';
                }
            },
            { data: 'sku', title: 'SKU', sWidth: "10%" },
            { data: 'post_title', title: 'Product Name', sWidth: "40%" },
            { data: 'regular_price', title: 'Regular Price', sWidth: "10%", className: "text-right", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'sale_price', title: 'Sale Price', sWidth: "10%", className: "text-right", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'stock', title: 'Stock', sWidth: "10%", className: "text-right", render: $.fn.dataTable.render.number('', '.', 0, '') }
        ],
        columnDefs: [{ targets: [0], visible: false, searchable: false }]
    });
}

function ProductGrid() {
    var urid = parseInt($("#ddlSearchStatus").val()) || "";
    var sid = "";
    var parent = $("#ddlProduct").val();
    var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 50, sEcho: 1, SortCol: 'id', SortDir: 'desc', strValue1: parent };
    $('#dtdata').DataTable({

        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        sPaginationType: "full_numbers", searching: false, ordering: false, lengthChange: false, "paging": false, "bInfo": false,
        bAutoWidth: false, scrollX: false, scrollY: false,
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        sAjaxSource: "/Inventory/GetConsignmentInventory",
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


            { data: 'post', title: 'Type (Variant)', sWidth: "14%" },
            {
                'data': 'Count', sWidth: "8%",
                'render': function (id, type, full, meta) {
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
    //SaveChanges(id, value);

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