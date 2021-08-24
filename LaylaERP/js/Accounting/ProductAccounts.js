var htmlAcc = '<option value="0">Please Select Account to Assign</option>';
$(document).ready(function () {
    GetNewAccounttoAssign();
    ProductStockGrid();
    var table = $('#dtProductsAccount').DataTable();
    console.log(table.rows().count());
})
function GetNewAccounttoAssign() {
    $.ajax({
        url: "/Accounting/GetNewAccounttoAssign",
        type: "Get",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                htmlAcc += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
        },
        async: false
    });
};

function ProductStockGrid() {
    let _items = [];
    let pid = parseInt($("#ddlProduct").val()) || 0, ctid = parseInt($("#ddlCategory").val()) || 0;
    let obj = { strValue1: '', strValue2: (ctid > 0 ? ctid : ''), strValue3: (pid > 0 ? pid : '') };
    $('#dtProductsAccount').DataTable({
        oSearch: { "sSearch": '' }, order: [[0, "asc"]],
        dom: 'lBftip', buttons: [{ extend: 'excelHtml5', title: 'Product Stock Report' }, { extend: 'csvHtml5', title: 'Product Stock Report' }],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>',
           
        },
        destroy: true, bAutoWidth: false, ajax: {
            url: '/Accounting/GetProductStock', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8",
            data: obj,
            dataSrc: function (data) {  return JSON.parse(data); }
        },
        lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
        columns: [
            { data: 'p_id', title: 'Parent ID', sWidth: "10%" },
            { data: 'post_title', title: 'Product Name', sWidth: "40%", },
            {
                'data': 'ID', sWidth: "25%",
                'render': function (id, type, full, meta) {
                    return '<select class="form-control ddlNewAccounttoAssign" id="ddlNewAccounttoAssign">' + htmlAcc+'</select>';
                }
            },
            {
                'data': 'id', sWidth: "5%   ",
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" style="opacity: 1; position: relative; visibility: visible; display: block"  name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '"><label></label>';
                    /*return '<input type="checkbox" style="opacity: 1; position: relative; visibility: visible; display: block" name="chkservices" id="chk_' + data + '">'*/
                }
            },
            
        ],
        columnDefs: [{ targets: [0], visible: false, searchable: false }]
    });
}
$('#checkAll').click(function () {
    var isChecked = $(this).prop("checked");
    $('#dtProductsAccount tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
});
function Singlecheck() {
    var isChecked = $('#CheckSingle').prop("checked");
    var isHeaderChecked = $("#checkAll").prop("checked");
    if (isChecked == false && isHeaderChecked)
        $("#checkAll").prop('checked', isChecked);
    else {
        $('#ProductCategory tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkAll").prop('checked', isChecked);
    }
}