var htmlAcc = '<option value="0">Please Select Account to Assign</option>';

$(document).ready(function () {
    $("#loader").hide();
    $(".select2").select2();
    getAccounttoAssign();
    GetNewAccounttoAssign();
    ProductAccountingGrid();
    setTimeout(function () { $(".select2").select2();}, 1500);

    /*$("#lblTotalProducts").text(table.fnGetData().length);*/
})
$('#btnRefresh').click(function () {
   
    ProductAccountingGrid();
    getAccounttoAssign();
    GetNewAccounttoAssign();
   
});

function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}


$("input[name = accounting_product_mode]:radio").change(function () {
    ProductAccountingGrid();
    getAccounttoAssign();
    GetNewAccounttoAssign();
});


function GetNewAccounttoAssign() {
    var optType = $('input[name="accounting_product_mode"]:checked').val();
    obj = { strValue1: optType }
    $.ajax({
        url: "/Accounting/GetNewAccounttoAssign",
        data: obj,
        type: "Get",
        success: function (data) {
            htmlAcc = "";
            htmlAcc = '<option value="0">Please Select Account to Assign</option>';
            for (var i = 0; i < data.length; i++) {
                htmlAcc += '<option value="' + data[i].Value + '" data-' + data[i].Value+'>' + data[i].Text + '</option>';
            }
        },
        async: false
    });
};
function getAccounttoAssign() {
    var optType = $('input[name="accounting_product_mode"]:checked').val();
    obj = { strValue1: optType }
    $.ajax({
        url: "/Accounting/GetNewAccounttoAssign",
        data: obj,
        type: "Get",
        success: function (data) {
            var opt = '<option value="0">Please Select Account to Assign</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlAccounttoAssign').html(opt);
        },
        async:false
    });
}
function ProductAccountingGrid() {
    var optType = $('input[name="accounting_product_mode"]:checked').val();
    obj = { strValue1: optType }
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
            url: '/Accounting/GetProductaccountassign', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8",
             data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        lengthMenu: [[20, 50, 100], [20, 50, 100]],
        columns: [
            { data: 'p_id', title: 'Parent ID', sWidth: "10%" },
            {
                data: 'id', title: 'ID', sWidth: "10%", render: function (data, type, row) {
                    if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"></a>↳ ' + row.id; else return '<a href="javascript:void(0);" class="details-control"></a> <b>#' + row.id + '</b>';
                }
            },
            { data: 'post_title', title: 'Product Name', sWidth: "40%", },
            {
                'data': 'AccountingAccountNumber', sWidth: "25%",
                'render': function (id, type, full, meta) {
                    return '<select class="form-control select2" name="ddlNewAccounttoAssign" id="chk_' + full.id + '" >' + htmlAcc.replace(new RegExp("\\b" + 'data-' + id + "\\b"), "selected") + '</select>';
                }
            },
            {
                'data': 'id', sWidth: "5%   ",
                'render': function (data, type, full, meta) {
                    return '<div style="opacity: 1; position: relative; visibility: visible; display: block"><input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '" ><label></label></div>';
                }
            },
            
        ],
        columnDefs: [{ targets: [0], visible: false, searchable: false, },{ "orderable": false, "targets": -1 }]
        
    });
}


$('#checkAll').click(function () {
    var isChecked = $(this).prop("checked");
    $('#dtProductsAccount tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
    $("#btnSaveProductAccount").prop("disabled", isChecked == true ? false : true);
    isEdit(true);
});
function Singlecheck() {
    var isChecked = $('#CheckSingle').prop("checked");
    var isHeaderChecked = $("#checkAll").prop("checked");
    
    var EnableButton = true;
    $('#dtProductsAccount tr:has(td)').find('input[type="checkbox"]').each(function () {
        if ($(this).prop("checked") == true)
            EnableButton = false;

    });
    $("#btnSaveProductAccount").prop("disabled", EnableButton);
    if (isChecked == false && isHeaderChecked) {
        $("#checkAll").prop('checked', isChecked);
    }
    else {
        $('#dtProductsAccount tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkAll").prop('checked', isChecked);
       
    }
    isEdit(true);
}


$('#btnSaveProductAccount').click(function () {
    var Productid = "";
    var optType = $('input[name="accounting_product_mode"]:checked').val();
    var account = "";
    var acc = $('#ddlAccounttoAssign').val();
   
        $("input:checkbox[name=CheckSingle]:checked").each(function () {
            Productid += $(this).val() + ",";
            if (acc == 0) {
                account += $("#chk_" + $(this).val() + " option:selected").val() + ",";
            }
            else {
                account += acc + ",";
            }
        });
        Productid = Productid.replace(/,(?=\s*$)/, '');
        account = account.replace(/,(?=\s*$)/, '');
    saveProductAccount(Productid,optType, account);

});

function saveProductAccount(ProductID, optType, ProductAccountNumberID) {
    var ID = $("#hfid").val();
    //ActivityLog('Save products account', '/Accounting/productsaccount/' + ProductID + '');
    var obj = {
        ID: ID, strValue1: ProductID, option_mode: optType, strValue2: ProductAccountNumberID,
    }
    $.ajax({
        url: '/Accounting/AddProductAccount/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () {$("#loader").show();},
        success: function (data) {
            if (data.status == true) {
                $("#checkAll").prop('checked', false);
                $("#ddlAccounttoAssign").select2("val", "0");
                $("#btnSaveProductAccount").prop("disabled", true);
                ProductAccountingGrid();
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