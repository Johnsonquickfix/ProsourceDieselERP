$(document).ready(function () {
    $("#loader").hide();
    $("#btnUpdate").hide();
    $("#btnSave").click(function () {
        AddFee();
    });
    FeeList();
    $("#btnReset").click(function () {
        reset();
    });

    $("#btnUpdate").click(function () {
        Edit();
    })
})

function AddFee() {
    let feename = $("#txtfeename").val();
    let feetype = $("#ddlfeetype").val();
    let feeamtper = $("#txtamtper").val();

    if (feename == "") {
        swal('Alert', 'Please enter fee name', 'error').then(function () { swal.close(); $('#txtfeename').focus(); });
    }
    else if (feetype == "-1") {
        swal('Alert', 'Please select fee type', 'error').then(function () { swal.close(); $('#ddlfeetype').focus(); });
    }
    else if (feeamtper == "") {
        swal('Alert', 'Please enter fee amount or percent', 'error').then(function () { swal.close(); $('#txtamtper').focus(); });
    }
    else if (feetype == "PR" && parseInt(feeamtper) > 100) {
            swal('Alert', 'Please percentage should not be greater than 100', 'error').then(function () { swal.close(); $('#txtamtper').focus(); });
    }
    else {
        var obj = {
            fee_type: feetype,
            fee_name: feename,
            fee_amt_percentage: feeamtper
        }
        $.ajax({
            url: '/FeeNTax/AddFee/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            searching: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success');//.then((result) => { location.href = '../../Events/EventsList'; });
                    reset();
                    FeeList();
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })

    }
}

function FeeList() {
    var urid = $("#ddlSearchStatus").val();
    ID = $("#hfid").val();
    var table_EL = $('#EmailListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': false, 'targets': [0] }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#EmailListdata_filter input').unbind();
            $('#EmailListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/FeeNTax/GetFeeList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
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

            { data: 'id', title: 'Id', sWidth: "5%" },
            { data: 'fee_name', title: 'Name', sWidth: "10%" },
            { data: 'fee_type', title: 'Type', sWidth: "10%" },
            { data: 'fee_amt_percentage', title: 'Amount / Percentage', sWidth: "10%" },
            {
                'data': 'id', sWidth: "10%", title: 'Action',
                'render': function (id, type, full, meta) {
                    return '<span title="Click here to edit" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="select(' + id + ');"><i class="glyphicon glyphicon-pencil"></i></a></span>';
                }
            }
        ]
    });
}

function reset() {
    $("#txtfeename").val("");
    $("#ddlfeetype").val('-1').trigger('change');
    $("#txtamtper").val("");
    $("#btnSave").show();
    $("#btnUpdate").hide();
}


function Edit() {
    let feename = $("#txtfeename").val();
    let feetype = $("#ddlfeetype").val();
    let feeamtper = $("#txtamtper").val();
    let id = $("#hfid").val();

    if (feename == "") {
        swal('Alert', 'Please enter fee name', 'error').then(function () { swal.close(); $('#txtfeename').focus(); });
    }
    else if (feetype == "-1") {
        swal('Alert', 'Please select fee type', 'error').then(function () { swal.close(); $('#ddlfeetype').focus(); });
    }
    else if (feeamtper == "") {
        swal('Alert', 'Please enter fee amount or percent', 'error').then(function () { swal.close(); $('#txtamtper').focus(); });
    }
    else if (feetype == "PR" && parseInt(feeamtper) > 100) {
        swal('Alert', 'Percentage should less than 100', 'error').then(function () { swal.close(); $('#txtamtper').focus(); });
    }
    else {
        var obj = {
            rowid:id,
            fee_type: feetype,
            fee_name: feename,
            fee_amt_percentage: feeamtper
        }
        $.ajax({
            url: '/FeeNTax/EditFee',
            type: 'post',
            contentType: 'application/json;charset=utf-8',
            dataType: 'Json',
            data: JSON.stringify(obj),
            beforeSend: function(){ $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success');//.then((result) => { location.href = '../../Events/EventsList'; });
                    reset();
                    FeeList();
                    $("#btnUpdate").hide();
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () {
                $("#loader").hide();
            },
            error: function () { swal('Error!', 'something went wrong', 'error');}
        })
    }
    
}

function select(id) {
    let obj = { strValue1: id };
    $.ajax({
        url: '/FeeNTax/SelectFee',
        dataType: 'Json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            let jobj = JSON.parse(data);
            $("#txtfeename").val(jobj[0].fee_name);
            $("#ddlfeetype").val(jobj[0].fee_type).trigger('change');
            $("#txtamtper").val(jobj[0].fee_amt_percentage);
            $("#hfid").val(jobj[0].rowid);
            $("#btnUpdate").show();
            $("#btnSave").hide();
        },
        complete: function () { },
        error: function () {}
    })
}