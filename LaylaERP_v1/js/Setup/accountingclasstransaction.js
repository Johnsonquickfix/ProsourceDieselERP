$(document).ready(function () {
    $("#loader").hide();
    $("#btnUpdate").hide();
    $(document).on('click', "#btnAdd", function () {
        Addtclassransacion();
    })
    $(document).on('click', "#btnReset", function () {
        ResetBox();
        $("#btnAdd").show();
        $("#btnUpdate").hide();
    })
    $(document).on('click', "#btnUpdate", function () {
        Addtclassransacion();
    });
    datalist();
});
//page leave message start
function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}
// page leave message end


function datalist() {
    var urid = parseInt($("#ddlSearchStatus").val());
    ID = $("#hfid").val();
    let table_JD = $('#Datalist').DataTable({
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
            $('#Datalist_filter input').unbind();
            $('#Datalist_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_JD.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Setup/Getaccountingclasstransactionlist/",
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
            { data: 'account_class', title: 'Account Class', sWidth: '10%', className: 'text-left' },
            { data: 'account_tag', title: 'Account Tag', sWidth: '10%' },
            { data: 'department', title: 'Department', sWidth: '10%' },
            { data: 'location', title: 'location', sWidth: '10%' },
            { data: 'event', title: 'Event', sWidth: '10%' },
            { data: 'others', title: 'Others', sWidth: '10%' },
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

function Addtclassransacion_old() {
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
            url: '/Setup/updateclassransacion/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success');
                    ResetBox();
                    datalist();
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
        url: '/Setup/GetclasstransactionById/',
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            $("#hfid").val(jobj[0].rowid);
            $('#txtaccountclass').val(jobj[0].account_class);
            $('#txtdepartment').val(jobj[0].department);
            $('#txtevent').val(jobj[0].event);
            $('#txtaccounttag').val(jobj[0].account_tag);
            $('#txtothers').val(jobj[0].others);
            $('#txtlocation').val(jobj[0].location);
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
    $('#txtaccountclass').val('');
    $('#txtdepartment').val('');
    $('#txtevent').val('');
    $('#txtaccounttag').val('');
    $('#txtothers').val('');
    $('#txtlocation').val('');
}
function Addtclassransacion() {
    let qflag = '';
    let id = parseInt($("#hfid").val()) || 0 ;
    let accountclass = $("#txtaccountclass").val();
    let department = $("#txtdepartment").val();
    let event = $("#txtevent").val();
    let accounttag = $("#txtaccounttag").val();
    let others = $("#txtothers").val();
    let location = $("#txtlocation").val();
    if (id > 0) { qflag = 'U'; }
    else { qflag = 'I'; }

    if (accountclass == "") {
        swal('Alert', 'Please enter account class', 'error').then(function () { swal.close(); $('#txtaccountclass').focus(); });
    }
    else if (accounttag == "") {
        swal('Alert', 'Please enter account tag', 'error').then(function () { swal.close(); $('#txtaccounttag').focus(); });
    }
    else {
        var obj = {
            rowid: id,
            account_class: accountclass,
            account_tag: accounttag,
            department: department,
            location: location,
            events: event,
            others: others,
            flag: qflag
        };
        $.ajax({
            url: '/Setup/Addtclassransacion/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    if (data.url == "update") {
                        $("#btnUpdate").hide();
                        $("#btnAdd").show();
                    }
                    swal('Success', data.message, 'success');
                    ResetBox();
                    datalist();

                   
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