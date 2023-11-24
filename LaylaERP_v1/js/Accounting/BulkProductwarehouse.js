var htmlAcc = '<option value="0">Please Select warehouse to Assign</option>';
$(document).ready(function () {
    $("#loader").hide();
    $(".select2").select2();
    GetNewwarehousetoAssign();
    ProductwarehouseGrid();
    setTimeout(function () { $(".select2").select2(); }, 1500);
})
//$('#btnRefresh').click(function () {
//    ProductwarehouseGrid();

//    GetNewAccounttoAssign();
//});

function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}


//$("input[name = accounting_product_mode]:radio").change(function () {
//    ProductwarehouseGrid();
//    getAccounttoAssign();
//    GetNewAccounttoAssign();
//});


function GetNewwarehousetoAssign() {
    //var optType = $('input[name="accounting_product_mode"]:checked').val();
    //obj = { strValue1: optType }
    $.ajax({
        url: "/Warehouse/GetWarehousename", 
        type: "Get",
        success: function (data) {
            htmlAcc = "";
            htmlAcc = '<option value="0">Please Select Warehouse to Assign</option>';
            for (var i = 0; i < data.length; i++) {
                htmlAcc += '<option value="' + data[i].Value + '" data-' + data[i].Value + '>' + data[i].Text + '</option>';
            }
        },
        async: false
    });
};
//function getAccounttoAssign() {
//    var optType = $('input[name="accounting_product_mode"]:checked').val();
//    obj = { strValue1: optType }
//    $.ajax({
//        url: "/Accounting/GetNewAccounttoAssign",
//        data: obj,
//        type: "Get",
//        success: function (data) {
//            var opt = '<option value="0">Please Select Account to Assign</option>';
//            for (var i = 0; i < data.length; i++) {
//                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
//            }
//            $('#ddlAccounttoAssign').html(opt);
//        },
//        async: false
//    });
//}
function ProductwarehouseGrid() {
    var optType = "";
    obj = { strValue1: optType }
    $('#dtProductswarehouse').DataTable({
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
            url: '/Setting/GetProductwarehouse', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8",
            data: obj,
            dataSrc: function (data) { return JSON.parse(data); },
            beforeSend: function () {
                $("#loader").show();
            },
            complete: function () {
                $("#loader").hide();
            }
        },
        lengthMenu: [[20, 50, 100], [20, 50, 100]],
        columns: [
            { data: 'id', title: 'Parent ID', sWidth: "10%" },
            {
                data: 'id', title: 'ID', sWidth: "10%", render: function (data, type, row) {
                    if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"></a>↳ ' + row.id; else return '<a href="javascript:void(0);" class="details-control"></a> <b>#' + row.id + '</b>';
                }
            },
            { data: 'post_title', title: 'Product Name', sWidth: "40%", },
            {
                'data': 'fk_warehouse', sWidth: "25%",
                'render': function (id, type, full, meta) {
                    return '<select class="form-control select2" name="ddlNewWarehousetoAssign" id="chk_' + full.id + '" >' + htmlAcc.replace(new RegExp("\\b" + 'data-' + id + "\\b"), "selected") + '</select>';

                }
                //'render': function (id, type, full, meta) {
                //    var inputText = '<input type="text" class="form-control" name="txtNewwarehouseAssign" data-product-id="' + full.id + '" value="' + full.warehouse + '">';
                //    return inputText;
                //}
            },
            {
                'data': 'id', sWidth: "5%   ",
                'render': function (data, type, full, meta) {
                    return '<div style="opacity: 1; position: relative; visibility: visible; display: block"><input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '" ><label></label></div>';
                }
            },
        ],
        columnDefs: [{ targets: [0], visible: false, searchable: false, }, { "orderable": false, "targets": -1 }]

    });
}


$('#checkAll').click(function () {
    var isChecked = $(this).prop("checked");
    $('#dtProductswarehouse tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
    $("#btnSaveProductwarehouse").prop("disabled", isChecked == true ? false : true);
    isEdit(true);
});
function Singlecheck() {
    var isChecked = $('#CheckSingle').prop("checked");
    var isHeaderChecked = $("#checkAll").prop("checked");

    var EnableButton = true;
    $('#dtProductswarehouse tr:has(td)').find('input[type="checkbox"]').each(function () {
        if ($(this).prop("checked") == true)
            EnableButton = false;

    });
    $("#btnSaveProductwarehouse").prop("disabled", EnableButton);
    if (isChecked == false && isHeaderChecked) {
        $("#checkAll").prop('checked', isChecked);
    }
    else {
        $('#dtProductswarehouse tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkAll").prop('checked', isChecked);

    }
    isEdit(true);
}

var inputValues = {};
$('#dtProductswarehouse').on('change', 'select[name="ddlNewWarehousetoAssign"]', function () {
    var productId = $(this).closest('tr').find('input[name="CheckSingle"]').val();
    var inputValue = $(this).val();

    // Store the value in the inputValues object
    inputValues[productId] = inputValue;
});
$('#btnSaveProductwarehouse').click(function () {
    var Productid = "";
    var optType = "";
    var warehouse = "";

    // Loop through all rows in the DataTable
    $('#dtProductswarehouse').DataTable().rows().every(function () {
        var data = this.data();
        var productId = data.id;
        var warehouselast = data.fk_warehouse;
        // Check if the checkbox is checked
        var checkbox = $("input[name=CheckSingle][value='" + productId + "']", this.node());
        if (checkbox.is(":checked")) {
            // Retrieve the stored value for the input field
            //var productwarehouseNumber = inputValues[productId];
            var productwarehouseNumber = inputValues[productId] || warehouselast;
            // Add values to the strings
            Productid += productId + ",";
            warehouse += productwarehouseNumber + ",";
        }
    });

    // Remove trailing commas
    Productid = Productid.replace(/,(?=\s*$)/, '');
    warehouse = warehouse.replace(/,(?=\s*$)/, '');

    saveProductwarehouse(Productid, optType, warehouse);
});

function saveProductwarehouse(ProductID, optType, warehouse) {
    var ID = $("#hfid").val();
    //ActivityLog('Save products account', '/Accounting/productsaccount/' + ProductID + '');
    console.log(ProductID);
    console.log(warehouse);
    var obj = {
        ID: ID, strValue1: ProductID, option_mode: optType, strValue2: warehouse,
    }
    $.ajax({
        url: '/Setting/AddProductwarehouse/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            if (data.status == true) {
                $("#checkAll").prop('checked', false);
                //$("#ddlAccounttoAssign").select2("val", "0");
                $("#btnSaveProductwarehouse").prop("disabled", true);
                ProductwarehouseGrid();
                swal('Alert!', data.message, 'success');
            }
            else {
                swal('Alert!', data.message, 'error')
            }
        },
        complete: function () { },
        error: function (error) {
            swal('Error!', 'something went wrong', 'error');
        },
    })
}