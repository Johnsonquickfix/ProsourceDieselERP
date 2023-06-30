$(document).ready(function () {
    $("#loader").hide();
    //$("#btnUpdate").hide();
    $("#btnSave").click(function () {
        AddFee();
    });
    List();
    $("#btnReset").click(function () {
        reset();
    });

    $("#btnUpdate").click(function () {
        Edit();
    })
})

function AddFee() {
    let code = $("#txtcode").val();
    let disc = $("#txtdiscription").val();
    const encoddisc = encodeURIComponent(disc);
    ID = parseInt($("#hfid").val()) || 0;
    if (code == "") {
        swal('Alert', 'Please enter code', 'error').then(function () { swal.close(); $('#txtcode').focus(); });
    }
    
    else if (disc == "") {
        swal('Alert', 'Please enter discription', 'error').then(function () { swal.close(); $('#txtdiscription').focus(); });
    } 
    else {
        var obj = {
            id: ID,
            code: code,
            disc: encoddisc
        }
        $.ajax({
            url: '/CMS/Addshortcode/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            searching: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success');//.then((result) => { location.href = '../../Events/EventsList'; });
                    reset();
                    List();
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

function List() {
    var urid = $("#ddlSearchStatus").val();
    ID = $("#hfid").val();
    var table_EL = $('#Listdata').DataTable({
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
            $('#Listdata_filter input').unbind();
            $('#Listdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/CMS/Getshortcode",
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
            { data: 'code', title: 'Code', sWidth: "10%" },
            { data: 'description', title: 'Description', sWidth: "10%" },
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
    $("#txtcode").val(""); 
    $("#txtdiscription").val("");
    $("#hfid").val(0);
}


 

function select(id) {
    let obj = { strValue1: id };
    $.ajax({
        url: '/CMS/Selectshortcode',
        dataType: 'Json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            let jobj = JSON.parse(data);
            $("#txtcode").val(jobj[0].code);
            $("#txtdiscription").val(jobj[0].description);
            $("#hfid").val(jobj[0].id);
        },
        complete: function () { },
        error: function () { }
    })
}