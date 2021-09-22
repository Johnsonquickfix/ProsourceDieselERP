//HRAList();
ListHra();
function AddHRA() {
    basic_1 = $("#txtbasic1").val();
    basic_2 = $("#txtbasic2").val();
    hraoffice = $("#txthraoffice").val();
    hrafield = $("#txthrafield").val();
    fromdate = $("#txtfromdate").val();

    var formattedDate = new Date(fromdate);
    var d = formattedDate.getDate();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    var y = formattedDate.getFullYear();
    var date_created = y + "-" + m + "-" + d;

    if (basic_1 == "") {
        swal('Alert', 'Please Enter Basic 1', 'error').then(function () { swal.close(); $('#txtbasic1').focus(); });
    }
    else if (basic_2 == "") {
        swal('Alert', 'Please Enter Basic 2', 'error').then(function () { swal.close(); $('#txtbasic2').focus(); });
    }
    //else if (parseInt(basic_1) > parseInt(basic_2)) {
    //    swal('Alert', 'Basic 1 Is Not Greater Than Basic 2', 'error').then(function () { swal.close(); $('#txtbasic1').focus(); });
    //}
    else if (hraoffice == "") {
        swal('Alert', 'Please Enter HRA Office', 'error').then(function () { swal.close(); $('#txthraoffice').focus(); });
    }
    else if (hrafield == "") {
        swal('Alert', 'Please Enter HRA Field', 'error').then(function () { swal.close(); $('#txthrafield').focus(); });
    }
    else if (fromdate == "") {
        swal('Alert', 'Please Enter Date', 'error').then(function () { swal.close(); $('#txtfromdate').focus(); });
    }
    else {
        var obj = {
            basic1: basic_1,
            basic2: basic_2,
            hra_office: hraoffice,
            hra_field: hrafield,
            from_date: date_created,
        }
        $.ajax({
            url: '/Hrms/AddHRADetails', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success');//.then((result) => { location.href = '../productrule'; });
                    ListHra();
                    reset();
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

function reset() {
    $("#txtbasic1").val("");
    $("#txtbasic2").val("");
    $("#txthraoffice").val("");
    $("#txthrafield").val("");
    $("#txtfromdate").val("");
}

function HRAList() {
    var urid = $("#ddlSearchStatus").val();
    ID = $("#hfid").val();
    var table_EL = $('#EmployeeListdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': true, 'targets': [0] }], order: [[0, "desc"]],
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
            $('#EmployeeListdata_filter input').unbind();
            $('#EmployeeListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Hrms/GetHRAList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "id" : oSettings.aaSorting[0][0] == 1 ? "basic1" : oSettings.aaSorting[0][0] == 2 ? "basic2" : oSettings.aaSorting[0][0] == 3 ? "hra_office" : oSettings.aaSorting[0][0] == 4 ? "hra_field" : oSettings.aaSorting[0][0] == 5 ? "from_date" : "id";
                aoData.push({ name: "sSortColName", value: col });
            }
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
            { data: 'basic1', title: 'Basic 1', sWidth: "10%" },
            { data: 'basic2', title: 'Basic 2', sWidth: "20%", },
            { data: 'hra_office', title: 'HRA Office', sWidth: "20%" },
            { data: 'hra_field', title: 'HRA Field', sWidth: "20%", },
            { data: 'from_date', title: 'Date', sWidth: "20%", },
            {
                'data': 'id', sWidth: "10%", title: 'Action',
                'render': function (id, type, full, meta) {
                    return '<a href="../Hrms/EditHRA/' + id + '"><i class="glyphicon glyphicon-pencil"></i></a>';
                }
            }

        ]
    });
}
/*
function EditSelect(id) {
    var strValue1 = id;
    $.ajax({
        url: '/Hrms/SelectHRAList/' + strValue1,
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            console.log(jobj[0].id);
            $("#hfid").val(jobj[0].id);
            $("#txtbasic1").val(jobj[0].basic1);
            $("#txtbasic2").val(jobj[0].basic2);
            $("#txthraoffice").val(jobj[0].hra_office);
            $("#txthrafield").val(jobj[0].hra_field);
            $("#txtfromdate").val(jobj[0].from_date);
            
            //$("#btnDamageStock").hide();
            //$("#btnDamageStockUpdate").show();
            //$("#btnDamageStockCancel").show();

        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
} */
/*
function UpdateHRA() {
    id = $("#hfid").val();
    basic_1 = $("#txtbasic1").val();
    basic_2 = $("#txtbasic2").val();
    hraoffice = $("#txthraoffice").val();
    hrafield = $("#txthrafield").val();
    fromdate = $("#txtfromdate").val();

    var formattedDate = new Date(fromdate);
    var d = formattedDate.getDate();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    var y = formattedDate.getFullYear();
    var date_created = y + "-" + m + "-" + d;

    if (basic_1 == "") {
        swal('Alert', 'Please Enter Basic 1', 'error').then(function () { swal.close(); $('#txtbasic1').focus(); });
    }
    else if (basic_2 == "") {
        swal('Alert', 'Please Enter Basic 2', 'error').then(function () { swal.close(); $('#txtbasic2').focus(); });
    }
    else if (hraoffice == "") {
        swal('Alert', 'Please Enter HRA Office', 'error').then(function () { swal.close(); $('#txthraoffice').focus(); });
    }
    else if (hrafield == "") {
        swal('Alert', 'Please Enter HRA Field', 'error').then(function () { swal.close(); $('#txthrafield').focus(); });
    }
    else if (fromdate == "") {
        swal('Alert', 'Please Enter Date', 'error').then(function () { swal.close(); $('#txtfromdate').focus(); });
    }
    else {
        var obj = {
            rowid:id,
            basic1: basic_1,
            basic2: basic_2,
            hra_office: hraoffice,
            hra_field: hrafield,
            from_date: date_created,
        }
        $.ajax({
            url: '/Hrms/UpdateHRA', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success');//then((result) => { location.href = '../HRA'; });
                    //ListHra();
                    reset();
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
*/
ListHra();
function ListHra() {
    $.ajax({
        url: '/Hrms/GetHRAList',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,

        success: function (data) {
            $('#dtdata').dataTable({
                destroy: true,
                scrollX: false,
                data: JSON.parse(data),
                "columns": [
                    { data: 'id', title: 'Id', sWidth: "5%" },
                    { data: 'basic1', title: 'Basic 1', sWidth: "10%" },
                    { data: 'basic2', title: 'Basic 2', sWidth: "20%", },
                    { data: 'hra_office', title: 'HRA Office', sWidth: "20%" },
                    { data: 'hra_field', title: 'HRA Field', sWidth: "20%", },
                    { data: 'from_date', title: 'Date', sWidth: "20%", },
                    {
                        'data': 'id', sWidth: "10%", title: 'Action',
                        'render': function (id, type, full, meta) {
                            return '<a href="../Hrms/EditHRA/' + id + '"><i class="glyphicon glyphicon-pencil"></i></a>';
                        }
                    },
                ],
                "order": [[0, 'desc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });

}