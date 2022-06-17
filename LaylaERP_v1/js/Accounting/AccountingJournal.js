$("#loader").hide();
getNatureofJournal();
NatureofJournalList();
function getNatureofJournal() {
    $.ajax({
        url: "/Accounting/GetNatureofJournal",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please select nature of journal</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlNatureofJournal').html(opt);
        }

    });
}

function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}

$('#btnSaveJournal').click(function (e) {
    ID = $("#hfid").val();
    Code = $("#txtCode").val();
    Label = $("#txtLabel").val();
    NatureofJournal = $("#ddlNatureofJournal").val();
    if (Code == "") { swal('Alert', 'Please enter code', 'error').then(function () { swal.close(); $('#txtCode').focus(); }) }
    else if (Label == "") { swal('Alert', 'Please enter label', 'error').then(function () { swal.close(); $('#txtLabel').focus(); }) }
    else if (NatureofJournal == "-1") { swal('Alert', 'Please select nature of journal', 'error').then(function () { swal.close(); $('#ddlNatureofJournal').focus(); }) }

    else {
        var obj = { rowid: ID, code: Code, label: Label, nature: NatureofJournal, }
        $.ajax({
            url: '/Accounting/AddJournal/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (data) {
                if (data.status == true) {
                    $("#btnSaveJournal").attr('value', 'Add');
                    NatureofJournalList();
                    swal('Success', data.message, 'success');
                    $("#tblAddJournal").find(":input").each(function () {
                        switch (this.type) {
                            case "text": case "email": case "textarea": case "tel": $(this).val(''); break;
                        }
                    });
                    $("#tblAddJournal option[value='-1']").attr('selected', true)
                    e.preventDefault();
                }
                else {
                    swal('Alert!', data.message, 'error')
                }
            },
            complete: function () {
                $("#loader").hide();
            },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
        })
    }
});

function NatureofJournalList() {
    var urid = parseInt($("#ddlSearchStatus").val());
    ID = $("#hfid").val();
    let table_JD = $('#Journaldata').DataTable({
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
            $('#Journaldata_filter input').unbind();
            $('#Journaldata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_JD.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Accounting/GetJournalData",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: ID });
            aoData.push({ name: "strValue2", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "ID" : oSettings.aaSorting[0][0] == 1 ? "code" : oSettings.aaSorting[0][0] == 2 ? "label" : oSettings.aaSorting[0][0] == 3 ? "Nature" : "id";
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
            { data: 'ID', title: 'ID', class: 'text-left'  },
            { data: 'code', title: 'Code', class: 'text-left' },
            { data: 'label', title: 'Label' },
            { data: 'Nature', title: 'Nature of Journal' },
            {
                'data': 'active', 'sClass': 'ws_nowrap text-center',
                'render': function (id, type, full, meta) {
                    if (id == 1) {
                        toggleclass = "fas fa-toggle-on";
                        toggleStyle = "color: #25a580!important;font-size: 24px;";
                        toggleStatus = 0;
                    }
                    else {
                        toggleclass = "fas fa-toggle-off";
                        toggleStyle = "color: #25a580!important;font-size: 24px;";
                        toggleStatus = 1;
                    }
                    if ($("#hfEdit").val() == "1") {
                        return '<span title="Click here to change the status of account" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="ChangeStatus(' + full.ID + ',' + toggleStatus + ');"><i class="' + toggleclass + '" style="' + toggleStyle + '"></i></a></span>';
                    } else { return "No Permission"; }
                }
            },
            {
                'data': 'ID',
                'render': function (id, type, full, meta) {
                    if ($("#hfEdit").val() == "1") {
                    return '<span title="Click here to edit the account" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="GetJournalByID(' + id + ');"><i class="fas fa-pencil-alt"></i></a></span>';
                    }else { return "No Permission"; }
                }
            },
            //{
            //    'data': 'ID',
            //    'render': function (id, type, full, meta) {return '<a href="#" ><i class="fas fa-trash pictodelete"></i></a>';}
            //}
        ]
    });
}

function ChangeStatus(id, status) {
    let jStatus = status == 0 ? "Inactive" : "Active";
    ActivityLog('Change account status as ' + jStatus + ' in Accounting Journal.', '/Accounting/AccountingJournal/');
    var obj = { rowid: id, active: status, }
    $.ajax({
        url: '/Accounting/UpdateJournalStatus/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () {$("#loader").show();},
        success: function (data) {
            if (data.status == true) {
                NatureofJournalList();
                swal('Alert!', data.message, 'success');
            }
            else {swal('Alert!', data.message, 'error')}
        },
        complete: function () {$("#loader").hide();},
        error: function (error) {swal('Error!', 'something went wrong', 'error');},
    })
}

function GetJournalByID(id) {
    ActivityLog('Edit journal id ' + id +' in Accounting Journal.', '/Product/AddNewProduct/');
    var obj =
        $.ajax({
            url: "/Accounting/GetJournalByID/" + id,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                var d = JSON.parse(data);
                if (d.length > 0) {
                    $("#txtCode").val(d[0].code);
                    $("#txtLabel").val(d[0].label);
                    $("#ddlNatureofJournal").val(d[0].nature);
                    $("#hfid").val(d[0].rowid);
                    $("#btnSaveJournal").attr('value', 'Update');
                }
                isEdit(true);
            },
            complete: function () { $("#loader").hide(); },
            error: function (msg) {

            }
        });

}

$('#btnReset').click(function () {
    $("#hfid").val('');
    $("#btnSaveJournal").attr('value', 'Add');
    isEdit(true);
    $("#tblAddJournal").find(":input").each(function () {
        switch (this.type) {
            case "text": case "email": case "textarea": case "tel": $(this).val(''); break;
        }
    });
    $("#tblAddJournal option[value='-1']").attr('selected', true)
})