$(document).ready(function () {
    $("#loader").hide();
    $("#btnUpdate").hide();
    $(document).on('click', "#btnAdd", function () {
        AddProductReturn();
    })
    $(document).on('click', "#btnReset", function () {
        ResetBox();
        $("#btnAdd").show();
        $("#btnUpdate").hide();
    })
    $(document).on('click', "#btnUpdate", function () {
        UpdateProductReturn();
    });
    getProduct(); $(".select2").select2();
    ProductReturnList();
});
//page leave message start
function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}
// page leave message end

function getProduct() {
    $.ajax({
        url: "/Setup/GetProduct",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please Select Product</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $("#ddlproduct").html(opt);
        }

    });
}

function ProductReturnList() {
    var urid = parseInt($("#ddlSearchStatus").val());
    ID = $("#hfid").val();
    let table_JD = $('#ProductReturnData').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }, { targets: [0], visible: false }], order: [[1, "desc"]],
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
            $('#ProductReturnData_filter input').unbind();
            $('#ProductReturnData_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_JD.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Setup/GetTransactionTypeList/",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: ID });
            aoData.push({ name: "strValue2", value: urid });
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
            { data: 'post_title', title: 'Product', sWidth: '10%', className: 'text-left' },
            { data: 'returndays', title: 'Return days', sWidth: '10%' },
            { data: 'warrantydays', title: 'Warranty days', sWidth: '10%' },
            { data: 'remarks', title: 'Remarks', sWidth: '10%' },
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

function AddProductReturn() {
    let product_id = $("#ddlproduct").val();
    let return_days = $("#txtreturndays").val();
    let warranty_days = $("#txtwarrantydays").val();
    let remarks = $("#txtremarks").val();

    if (product_id == "-1") {
        swal('Alert', 'Please select product', 'error').then(function () { swal.close(); $('#ddlproduct').focus(); });
    }
    else if (return_days == "") {
        swal('Alert', 'Please enter return days', 'error').then(function () { swal.close(); $('#txtreturndays').focus(); });
    }
    else if (warranty_days == "") {
        swal('Alert', 'Please enter warranty days', 'error').then(function () { swal.close(); $('#txtwarrantydays').focus(); });
    }
    else if (remarks == "") {
        swal('Alert', 'Please enter remarks', 'error').then(function () { swal.close(); $('#txtremarks').focus(); });
    }
    else {
        var obj = {
            productid: product_id,
            returndays: return_days,
            warrantydays: warranty_days,
            remarks: remarks,
        };
        $.ajax({
            url: '/Setup/AddProductReturn/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success');
                    ResetBox();
                    ProductReturnList();
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
        url: '/Setup/GetProductReturnById/',
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            $("#hfid").val(jobj[0].rowid);
            $('#ddlproduct').val(jobj[0].productid).trigger('change');
            $('#txtreturndays').val(jobj[0].returndays);
            $('#txtwarrantydays').val(jobj[0].warrantydays);
            $('#txtremarks').val(jobj[0].remarks);

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
    $("#ddlproduct").val('-1').trigger('change');
    $("#ddlaccount").val('-1').trigger('change');
    $('#txtreturndays').val('');
    $('#txtwarrantydays').val('');
    $('#txtremarks').val('');
}

function accountingAccount() {
    $.ajax({
        url: '/Accounting/GetAccountingAccount/',
        type: 'GET',
        success: function (data) {
            var opt = '<option value="-1">Please select account type</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlaccount').html(opt);
        }
    })
}

function UpdateProductReturn() {
    let id = $("#hfid").val();
    let product_id = $("#ddlproduct").val();
    let return_days = $("#txtreturndays").val();
    let warranty_days = $("#txtwarrantydays").val();
    let remarks = $("#txtremarks").val();

    if (product_id == "-1") {
        swal('Alert', 'Please select product', 'error').then(function () { swal.close(); $('#ddlproduct').focus(); });
    }
    else if (return_days == "") {
        swal('Alert', 'Please enter return days', 'error').then(function () { swal.close(); $('#txtreturndays').focus(); });
    }
    else if (warranty_days == "") {
        swal('Alert', 'Please enter warranty days', 'error').then(function () { swal.close(); $('#txtwarrantydays').focus(); });
    }
    else if (remarks == "") {
        swal('Alert', 'Please enter remarks', 'error').then(function () { swal.close(); $('#txtremarks').focus(); });
    }
    else {
        var obj = {
            rowid: id,
            productid: product_id,
            returndays: return_days,
            warrantydays: warranty_days,
            remarks: remarks,
        };
        $.ajax({
            url: '/Setup/UpdateProductReturn/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success');
                    ResetBox();
                    ProductReturnList();
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