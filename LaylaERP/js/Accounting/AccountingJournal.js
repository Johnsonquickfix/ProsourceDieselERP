$("#loader").hide();
getNatureofJournal();
NatureofJournalList();
function getNatureofJournal() {
    $.ajax({
        url: "/Accounting/GetNatureofJournal",
        type: "Get",
        success: function (data) {
            var opt = '<option value="-1">Please Select Nature of Journal</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlNatureofJournal').html(opt);
        }

    });
}

$('#btnSaveJournal').click(function (e) {
    ID = $("#hfid").val();
    Code = $("#txtCode").val();
    Label = $("#txtLabel").val();
    NatureofJournal = $("#ddlNatureofJournal").val();


    if (Code == "") { swal('alert', 'Please Enter Code', 'error').then(function () { swal.close(); $('#txtCode').focus(); }) }
    else if (Label == "") { swal('alert', 'Please Enter Label', 'error').then(function () { swal.close(); $('#txtLabel').focus(); }) }
    else if (NatureofJournal == "-1") { swal('alert', 'Please Select Nature of Journal', 'error').then(function () { swal.close(); $('#ddlNatureofJournal').focus(); }) }

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
                    swal('Alert!', data.message, 'success');
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
    var sid = "";
    var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 50, sEcho: 1, SortCol: 'id', SortDir: 'desc' };
    $('#Journaldata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        sPaginationType: "full_numbers", searching: false, ordering: true, lengthChange: true, "paging": true,
        bAutoWidth: false, scrollX: false, scrollY: false,
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        sAjaxSource: "/Accounting/GetJournalData",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
              //obj.Search = aoData[45].value;
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "code" : oSettings.aaSorting[0][0] == 1 ? "label" : oSettings.aaSorting[0][0] == 2 ? "Nature" : "id";
                obj.SortCol = col; obj.SortDir = oSettings.aaSorting.length >= 0 ? oSettings.aaSorting[0][1] : "desc";
            }
            obj.sEcho = aoData[0].value; obj.PageSize = oSettings._iDisplayLength; obj.PageNo = oSettings._iDisplayStart;
            $.ajax({
                type: "POST", url: sSource, async: true, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
                success: function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, iTotalRecords: data.iTotalRecords, iTotalDisplayRecords: data.iTotalDisplayRecords, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
                async: false
            });
        },
        aoColumns: [
            { data: 'code', title: 'Code' },
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
                    return ' <a href="#" onclick="ChangeStatus(' + full.ID + ',' + toggleStatus + ');"><i class="' + toggleclass + '" style="' + toggleStyle + '"></i></a>';
                }
            },
            {
                'data': 'ID',
                'render': function (id, type, full, meta) {
                    /*  if ($("#hfEdit").val() == "1") {*/
                    return '<a href="#" onclick="GetVendorByID(' + id + ');"><i class="fas fa-pencil-alt"></i></a>';
                    //}//else { return "No Permission"; }
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

function GetVendorByID(id) {
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
            },
            complete: function () { $("#loader").hide(); },
            error: function (msg) {

            }
        });

}