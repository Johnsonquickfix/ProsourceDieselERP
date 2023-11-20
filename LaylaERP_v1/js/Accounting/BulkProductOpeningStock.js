  
$(document).ready(function () {
    $("#loader").hide();
    //getAccounttoAssign();
    //GetNewAccounttoAssign();
    ProductquantityGrid(); 
})
//$('#btnRefresh').click(function () {
//    ProductquantityGrid();
//    getAccounttoAssign();
//    GetNewAccounttoAssign();
//});

function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}


//$("input[name = accounting_product_mode]:radio").change(function () {
//    ProductquantityGrid();
//    getAccounttoAssign();
//    GetNewAccounttoAssign();
//});


//function GetNewAccounttoAssign() {
//    var optType = $('input[name="accounting_product_mode"]:checked').val();
//    obj = { strValue1: optType }
//    $.ajax({
//        url: "/Accounting/GetNewAccounttoAssign",
//        data: obj,
//        type: "Get",
//        success: function (data) {
//            htmlAcc = "";
//            htmlAcc = '<option value="0">Please Select Account to Assign</option>';
//            for (var i = 0; i < data.length; i++) {
//                htmlAcc += '<option value="' + data[i].Value + '" data-' + data[i].Value + '>' + data[i].Text + '</option>';
//            }
//        },
//        async: false
//    });
//};
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
function ProductquantityGrid() {
    var optType = "";
    obj = { strValue1: optType }
    $('#dtProductsquantity').DataTable({
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
            url: '/Setting/GetProductopningstock', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8",
            data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
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
                'data': 'quantity', sWidth: "25%",
                //'render': function (id, type, full, meta) {
                //    return '<select class="form-control select2" name="ddlNewAccounttoAssign" id="chk_' + full.id + '" >' + htmlAcc.replace(new RegExp("\\b" + 'data-' + id + "\\b"), "selected") + '</select>';
                //}
                'render': function (id, type, full, meta) {
                    var inputText = '<input type="text" class="form-control" name="txtNewquantityAssign" data-product-id="' + full.id + '" value="' + full.quantity + '">';
                     return inputText;
                }
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
    $('#dtProductsquantity tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
    $("#btnSaveProductquantity").prop("disabled", isChecked == true ? false : true);
    isEdit(true);
});
function Singlecheck() {
    var isChecked = $('#CheckSingle').prop("checked");
    var isHeaderChecked = $("#checkAll").prop("checked");

    var EnableButton = true;
    $('#dtProductsquantity tr:has(td)').find('input[type="checkbox"]').each(function () {
        if ($(this).prop("checked") == true)
            EnableButton = false;

    });
    $("#btnSaveProductquantity").prop("disabled", EnableButton);
    if (isChecked == false && isHeaderChecked) {
        $("#checkAll").prop('checked', isChecked);
    }
    else {
        $('#dtProductsquantity tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkAll").prop('checked', isChecked);

    }
    isEdit(true);
}

var inputValues = {};
$('#dtProductsquantity').on('change', 'input[name="txtNewquantityAssign"]', function () {
    var productId = $(this).closest('tr').find('input[name="CheckSingle"]').val();
    var inputValue = $(this).val();

    // Store the value in the inputValues object
    inputValues[productId] = inputValue;
});
$('#btnSaveProductquantity').click(function () {
    var Productid = "";
    var optType = "";
    var quantity = "";

    // Loop through all rows in the DataTable
    $('#dtProductsquantity').DataTable().rows().every(function () {
        var data = this.data();
        var productId = data.id;
        var quentitylast = data.quantity;
        // Check if the checkbox is checked
        var checkbox = $("input[name=CheckSingle][value='" + productId + "']", this.node());
        if (checkbox.is(":checked")) {
            // Retrieve the stored value for the input field
            //var productquantityNumber = inputValues[productId];
            var productquantityNumber = inputValues[productId] || quentitylast;
            // Add values to the strings
            Productid += productId + ",";
            quantity += productquantityNumber + ",";
        }
    });

    // Remove trailing commas
    Productid = Productid.replace(/,(?=\s*$)/, '');
    quantity = quantity.replace(/,(?=\s*$)/, '');

    saveProductquantity(Productid, optType, quantity);
});

function saveProductquantity(ProductID, optType, quantity) {
    var ID = $("#hfid").val();
    //ActivityLog('Save products account', '/Accounting/productsaccount/' + ProductID + '');
    console.log(ProductID);
    console.log(quantity);
    var obj = {
        ID: ID, strValue1: ProductID, option_mode: optType, strValue2: quantity,
    }
    $.ajax({
        url: '/Setting/AddProductstock/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            if (data.status == true) {
                $("#checkAll").prop('checked', false);
                //$("#ddlAccounttoAssign").select2("val", "0");
                $("#btnSaveProductquantity").prop("disabled", true);
                ProductquantityGrid();
                swal('Alert!', data.message, 'success');
            }
            else {
                swal('Alert!', data.message, 'error')
            }
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) {
            swal('Error!', 'something went wrong', 'error');
        },
    })
}