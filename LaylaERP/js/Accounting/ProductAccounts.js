﻿var htmlAcc = '<option value="0">Please Select Account to Assign</option>';

$(document).ready(function () {
    GetNewAccounttoAssign();
    ProductStockGrid();
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
                    return '<select class="form-control ddlNewAccounttoAssign" id="ddlNewAccounttoAssign">' + htmlAcc + '</select>';
                }
            },
            {
                'data': 'id', sWidth: "5%   ",
                'render': function (data, type, full, meta) {
                    return '<div style="opacity: 1; position: relative; visibility: visible; display: block"><input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '" ><label></label></div>';
                }
            },
            
        ],
        columnDefs: [{ targets: [0], visible: false, searchable: false }]
    });
}
$('#checkAll').click(function () {
    var isChecked = $(this).prop("checked");
    $('#dtProductsAccount tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
    $("#btnSaveProductAccount").prop("disabled", isChecked == true ? false : true);
});
function Singlecheck() {
    var isChecked = $('#CheckSingle').prop("checked");
    var isHeaderChecked = $("#checkAll").prop("checked");
    if (isChecked == false && isHeaderChecked) {
        $("#checkAll").prop('checked', isChecked);
        
    }
    else {
       
        $('#dtProductsAccount tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
            $("#btnSaveProductAccount").prop("disabled", isChecked == true ? false : true);
        });
        $("#checkAll").prop('checked', isChecked);
    }
}

$('#btnSaveProductAccount').click(function () {

    var id = "";
    var account = "";
    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        id += $(this).val() + ",";
        account += $("#ddlStatus option:selected").val() + ",";
    });
    id = id.replace(/,(?=\s*$)/, '');
    account = account.replace(/,(?=\s*$)/, '');
    console.log(id, account);

});

function saveProductAccount(ProductID, ProductFor,ProductAccountNumberID) {
    var obj = {
        ID: ID, fk_product_id: ProductID, Productfor: ProductFor, fk_account_number: ProductAccountNumberID,
    }
    $.ajax({
        url: '/Accounting/AddProductAccount/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () {$("#loader").show();},
        success: function (data) {
            if (data.status == true) {
                swal('Alert!', data.message, 'success');
            }
            else {
                swal('Alert!', data.message, 'error')
            }
        },
        complete: function () {$("#loader").hide();},
        error: function (error) {
            swal('Error!', 'something went wrong', 'error');
        },
    })
}