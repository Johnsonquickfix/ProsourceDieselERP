ChartOfAccountGrid();
function ChartOfAccountGrid() {
    var urid = parseInt($("#ddlSearchStatus").val());
    var sid = "";
    var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 50, sEcho: 1, SortCol: 'ID', SortDir: 'DESC' };
    $('#dtdata').DataTable({
        //columnDefs: [{ "orderable": true, "targets": 0 }],
        //order: [[0, "desc"]],
        destroy: true,
        bProcessing: true,
        bServerSide: true,
        sPaginationType: "full_numbers",
        searching: true,
        ordering: true,
        lengthChange: true,
        "paging": true,
        bAutoWidth: false,
        scrollX: false,
        scrollY: false,
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        sAjaxSource: "/Accounting/GetChartOfAccounts",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            var col = 'ID';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 2 ? "ID" : oSettings.aaSorting[0][0] == 3 ? "account_number" : oSettings.aaSorting[0][0] == 4 ? "label" : "ID";
                aoData.push({ name: "sSortColName", value: col });
            }
            obj.sEcho = aoData[0].value; obj.PageSize = oSettings._iDisplayLength; obj.PageNo = oSettings._iDisplayStart;
            $.ajax({
                type: "POST", url: sSource, async: false, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
                success: function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, iTotalRecords: data.iTotalRecords, iTotalDisplayRecords: data.iTotalDisplayRecords, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
                async: false
            });
        },
        aoColumns: [
            {data: 'ID', title:'ID', sWidth:"10%"},
            { data: 'account_number', title: 'Account Number', sWidth: "10%" },
            { data: 'label', title: 'Label', sWidth: "10%" },
            { data: 'account_parent', title: 'Parent Account', sWidth: "10%" },
            { data: 'fk_pcg_version', title: 'Group of account', sWidth: "10%" },
            {
                'data': 'active', sWidth:"10%", 'sClass': 'ws_nowrap text-center',
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
        ]
    });
}

$('#btnSearch').click(function () {
    ChartOfAccountGrid();
})

function ChangeStatus(id, status) {
    var obj = { rowid: id, active: status, }
    $.ajax({
        url: '/Accounting/UpdateChartOfAccountStatus/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            if (data.status == true) {

                ChartOfAccountGrid();

                swal('Alert!', data.message, 'success');
            }
            else { swal('Alert!', data.message, 'error') }
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}


$.get('/Accounting/GetAccountSystem', function (data) {
    var items = "";
    $.each(data, function (index, value) {
        items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlaccountsetting");
    })
});
