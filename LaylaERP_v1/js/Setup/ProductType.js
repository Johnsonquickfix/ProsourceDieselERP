$(document).ready(function () {
    $("#loader").hide();
    $("#btnUpdate").hide();
    $(document).on('click', "#btnAdd", function () {
        AddProducttype();
    })
    $(document).on('click', "#btnReset", function () {
        ResetBox();
        $("#btnAdd").show();
        $("#btnUpdate").hide();
    })
    $(document).on('click', "#btnUpdate", function () {
        UpdateProducttype();
    }); 
    ProductTypeList();
});
//page leave message start
function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}
// page leave message end
 

function ProductTypeList() {
    var urid = parseInt($("#ddlSearchStatus").val());
    ID = $("#hfid").val();
    let table_JD = $('#ProducttypeData').DataTable({
        columnDefs: [], order: [[0, "asc"]],
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
            $('#ProducttypeData_filter input').unbind();
            $('#ProducttypeData_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_JD.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Setup/GetProductTypeList/",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: ID });
           // aoData.push({ name: "strValue2", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }

            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            { data: 'rowid', title: 'ID', sWidth: '5%' },
            { data: 'product_type_name', title: 'Product Type', sWidth: '10%', className: 'text-left' },
            { data: 'product_type_code', title: 'Code', sWidth: '10%' },
            {
                'data': 'rowid', sWidth: "8%",
                'render': function (id, type, full, meta) {
                    //if ($("#hfEdit").val() == "1") {
                    return '<span title="Click here to edit." data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="EditSelect(' + id + ');"><i class="glyphicon glyphicon-pencil"></i></a></span>';
                    //}
                    //else { return "No permission" }
                }
            },
        ]
    });
}

function AddProducttype() {
    let product_type_name = $("#txtproducttype").val();
    let product_type_code = $("#txtproducttypecode").val();

    if (product_type_name == "") {
        swal('Alert', 'Please enter product type', 'error').then(function () { swal.close(); $('#txtproducttype').focus(); });
    }
    else if (product_type_code == "") {
        swal('Alert', 'Please enter product type code', 'error').then(function () { swal.close(); $('#txtproducttypecode').focus(); });
    }
    else {
        var obj = {
            rowid: 0,
            product_type_name: product_type_name,
            product_type_code: product_type_code,
            flag: 'I'
        };
        $.ajax({
            url: '/Setup/UpdateProducttype/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success');
                    ResetBox();
                    ProductTypeList();
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () { $("#loader").hide(); isEdit(false); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })

    }

}

function EditSelect(id) {
    var obj = { strValue1: id }
    $.ajax({
        url: '/Setup/GetProductTypeById/',
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            $("#hfid").val(jobj[0].rowid);
            $('#txtproducttype').val(jobj[0].product_type_name);
            $('#txtproducttypecode').val(jobj[0].product_type_code);
            $("#btnAdd").hide();
            $("#btnUpdate").show();

            isEdit(true);
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}

function ResetBox() {
    $("#hfid").val(""); 
    $('#txtproducttype').val('');
    $('#txtproducttypecode').val('');
} 
function UpdateProducttype() {
    let id = $("#hfid").val(); 
    let product_type_name = $("#txtproducttype").val();
    let product_type_code = $("#txtproducttypecode").val();

    if (product_type_name == "") {
         swal('Alert', 'Please enter product type', 'error').then(function () { swal.close(); $('#txtproducttype').focus(); });
    }
     else if (product_type_code == "") {
         swal('Alert', 'Please enter product type code', 'error').then(function () { swal.close(); $('#txtproducttypecode').focus(); });
    } 
    else {
        var obj = {
            rowid: id,
            product_type_name: product_type_name,
            product_type_code: product_type_code,
            flag: 'U'
        };
        $.ajax({
            url: '/Setup/UpdateProducttype/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success');
                    ResetBox();
                    ProductTypeList();
                    $("#btnUpdate").hide();
                    $("#btnAdd").show();
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () { $("#loader").hide(); isEdit(false); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })

    }

}