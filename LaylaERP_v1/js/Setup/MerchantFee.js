$(document).ready(function () {

    $("#txtMerchantfee").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    });
    $("#loader").hide();
    $("#btnUpdate").hide();
    $(document).on('click', "#btnAdd", function () {
        AddMerchantfee();
    })
    $(document).on('click', "#btnReset", function () {
        ResetBox();
        $("#btnAdd").show();
        $("#btnUpdate").hide();
    })
    $(document).on('click', "#btnUpdate", function () {
        UpdateMerchantFee();
    });
    MerchantFeeList();
});
//page leave message start
function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}
// page leave message end


function MerchantFeeList() {
  //  var urid = parseInt($("#ddlSearchStatus").val());
    ID = $("#hfid").val();
    let table_JD = $('#MerchantFeeData').DataTable({
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
            $('#MerchantFeeData_filter input').unbind();
            $('#MerchantFeeData_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_JD.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Setup/GetMerchantFeeList/",
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
            { data: 'merchant_name', title: 'Merchant Name', sWidth: '10%', className: 'text-left' },
            { data: 'threshold', title: 'Threshold', sWidth: '10%' },
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

function AddMerchantfee() {
    let merchant_name = $("#txtMerchantname").val();
    let threshold = parseFloat($("#txtMerchantfee").val()) || 0.00 ;


    if (merchant_name == "") {
        swal('Alert', 'Please enter merchant name', 'error').then(function () { swal.close(); $('#txtMerchantname').focus(); });
    }
    //else if (threshold == "") {
    //    swal('Alert', 'Please enter fee', 'error').then(function () { swal.close(); $('#txtMerchantfee').focus(); });
    //}
    else {
        var obj = {
            rowid: 0,
            merchant_name: merchant_name,
            threshold: threshold,
            flag: 'I'
        };
        $.ajax({
            url: '/Setup/AddMerchantFee/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success');
                    ResetBox();
                    MerchantFeeList();
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
        url: '/Setup/GetMerchantFeeById/',
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            $("#hfid").val(jobj[0].rowid);
            $('#txtMerchantname').val(jobj[0].merchant_name);
            $('#txtMerchantfee').val(jobj[0].threshold);
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
    $('#txtMerchantname').val('');
    $('#txtMerchantfee').val('');
}
function UpdateMerchantFee() {
    let id = $("#hfid").val();
    let merchant_name = $("#txtMerchantname").val();
    let threshold = parseFloat($("#txtMerchantfee").val()) || 0.00;

    if (merchant_name == "") {
        swal('Alert', 'Please enter merchant name', 'error').then(function () { swal.close(); $('#txtMerchantname').focus(); });
    }
    //else if (threshold == "") {
    //    swal('Alert', 'Please enter product type code', 'error').then(function () { swal.close(); $('#txtMerchantfee').focus(); });
    //}
    else {
        var obj = {
            rowid: id,
            merchant_name: merchant_name,
            threshold: threshold,
            flag: 'U'
        };
        $.ajax({
            url: '/Setup/AddMerchantFee/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success');
                    ResetBox();
                    MerchantFeeList();
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