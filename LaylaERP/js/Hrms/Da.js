function AddDA() {
    darate1 = $("#txtdarate1").val();
    darate2 = $("#txtdarate2").val();
    darateothers = $("#txtdarateothers").val();
    fromdate = $("#txtfromdate").val();

    var formattedDate = new Date(fromdate);
    var d = formattedDate.getDate();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    var y = formattedDate.getFullYear();
    var date_created = y + "-" + m + "-" + d;

    if (darate1 == "") {
        swal('Alert', 'Please Enter DA rate 1', 'error').then(function () { swal.close(); $('#txtdarate1').focus(); });
    }
    else if (darate2 == "") {
        swal('Alert', 'Please Enter DA rate 2', 'error').then(function () { swal.close(); $('#txtdarate2').focus(); });
    }
    else if (darateothers == "") {
        swal('Alert', 'Please Enter DA rate others', 'error').then(function () { swal.close(); $('#txtdarateothers').focus(); });
    }
    else if (fromdate == "") {
        swal('Alert', 'Please Enter Date', 'error').then(function () { swal.close(); $('#txtfromdate').focus(); });
    }
    else {
        var obj = {
            da_rate1: darate1,
            da_rate2: darate2,
            da_rate_others: darateothers,
            from_date: date_created,
        }
        $.ajax({
            url: '/Hrms/AddDaDetails', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success');//.then((result) => { location.href = '../productrule'; });
                    reset();
                    DAList();
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
    $("#txtdarate1").val("");
    $("#txtdarate2").val("");
    $("#txtdarateothers").val("");
    $("#txtfromdate").val("");
}



function DAList() {
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
        sAjaxSource: "/Hrms/GetDaList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "id" : oSettings.aaSorting[0][0] == 1 ? "da_rate1" : oSettings.aaSorting[0][0] == 2 ? "da_rate2" : oSettings.aaSorting[0][0] == 3 ? "da_rate_others" : oSettings.aaSorting[0][0] == 4 ? "from_date" : "id";
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
            { data: 'da_rate1', title: 'DA rate 1', sWidth: "10%" },
            { data: 'da_rate2', title: 'DA rate 2', sWidth: "20%", },
            { data: 'da_rate_others', title: 'DA rate office', sWidth: "20%" },
            { data: 'from_date', title: 'Date', sWidth: "20%", },
            {
                'data': 'id', sWidth: "10%", title: 'Action',
                'render': function (id, type, full, meta) {
                    return '<a href="../Hrms/DaEdit/' + id + '"><i class="glyphicon glyphicon-pencil"></i></a>';
                }
            }

        ]
    });
}

function UpdateDA() {
    id = $("#hfid").val();
    darate1 = $("#txtdarate1").val();
    darate2 = $("#txtdarate2").val();
    darateothers = $("#txtdarateothers").val();
    fromdate = $("#txtfromdate").val();

    var formattedDate = new Date(fromdate);
    var d = formattedDate.getDate();
    var m = ("0" + (formattedDate.getMonth() + 1)).slice(-2)
    var y = formattedDate.getFullYear();
    var date_created = y + "-" + m + "-" + d;

    if (darate1 == "") {
        swal('Alert', 'Please Enter DA rate 1', 'error').then(function () { swal.close(); $('#txtdarate1').focus(); });
    }
    else if (darate2 == "") {
        swal('Alert', 'Please Enter DA rate 2', 'error').then(function () { swal.close(); $('#txtdarate2').focus(); });
    }
    else if (darateothers == "") {
        swal('Alert', 'Please Enter DA rate others', 'error').then(function () { swal.close(); $('#txtdarateothers').focus(); });
    }
    else if (fromdate == "") {
        swal('Alert', 'Please Enter Date', 'error').then(function () { swal.close(); $('#txtfromdate').focus(); });
    }
    else {
        var obj = {
            rowid: id,
            da_rate1: darate1,
            da_rate2: darate2,
            da_rate_others: darateothers,
            from_date: date_created,
        }
        $.ajax({
            url: '/Hrms/UpdateDA', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success').then((result) => { location.href = '../Da'; });
                    reset();
                    DAList();
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