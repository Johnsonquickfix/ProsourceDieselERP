
ChartOfAccountGrid();
function ChartOfAccountGrid() {
    $.ajax({
        url: '/Accounting/GetChartOfAccounts',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        
        success: function (data) {
            $('#dtdata').dataTable({
                destroy: true,
                scrollX: true,
                data: JSON.parse(data),
                "columns": [
                    { data: 'ID', title: 'Account Code', sWidth: "10%" },
                    { data: 'account_number', title: 'Account Number', sWidth: "10%", sType: 'numeric' },
                    //{ data: 'labelshort', title: 'Short label', sWidth: "10%" },
                    { data: 'label', title: 'Label', sWidth: "10%" },
                    { data: 'account_parent', title: 'Parent Account Code', sWidth: "10%" },
                    { data: 'pcg_type', title: 'Group of account', sWidth: "10%" },
                    {
                        'data': 'active', sWidth: "10%", 'sClass': 'ws_nowrap text-center',
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
                        'data': 'ID', sWidth: "8%",
                        'render': function (id, type, full, meta) {

                            return '<a href="../Accounting/EditAccount/' + id + '"><i class="glyphicon glyphicon-pencil"></i></a>';

                        }
                    },
                ],


                "order": [[1, 'asc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
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



