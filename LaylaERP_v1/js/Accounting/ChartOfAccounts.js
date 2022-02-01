$(document).ready(function () {
    var loc = window.location.pathname;
    $.when(CheckPermissions("#AddChartOfAccount", "#hfEdit", "", loc)).then(ChartOfAccountGrid());
})

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
                columnDefs: [{ 'visible': false, 'targets': [0] }],
                "columns": [
                    { data: 'ID', title: 'Account Code', sWidth: "10%" },
                    { data: 'account_number', title: 'Account Number', sWidth: "10%", sType: 'numeric' },
                    { data: 'label', title: 'Name', sWidth: "16%" },
                    { data: 'pcg_type', title: 'Type', sWidth: "10%" },
                    { data: 'labelshort', title: 'Detail Type', sWidth: "10%" },
                    { data: 'ac_type', title: 'Account tag', sWidth: "10%" },
                    { data: 'extraparams', title: 'Chart Tag', sWidth: "10%" },
                    { data: 'bs_type', title: 'BS Tag', sWidth: "6%" },
                    { data: 'account_category', title: 'Account category', sWidth: "6%" },
                    {
                        'data': 'active', sWidth: "4%", 'sClass': 'ws_nowrap text-center',
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
                            return ' <span title="Click here to change the status of chart of accounts" data-placement="bottom" data-toggle="tooltip"> <a href="#" onclick="ChangeStatus(' + full.ID + ',' + toggleStatus + ');"><i class="' + toggleclass + '" style="' + toggleStyle + '"></i></a></span>';
                        }
                    },

                    {
                        'data': 'ID', sWidth: "8%",
                        'render': function (id, type, full, meta) {
                            if ($("#hfEdit").val() == "1") {
                                return ' <span title="Click here to edit chart of accounts" data-placement="bottom" data-toggle="tooltip"><a href="../Accounting/EditAccount/' + id + '" onclick="ActivityLog(\'Edit account id ' + id + ' in Chart of Accounts.\',\'/Accounting/chartofaccounts/' + id +'\');" ><i class="glyphicon glyphicon-pencil"></i></a></span>';
                            }
                            else {
                                return "No Permission";
                            }

                        }
                    },
                ],


                "order": [[1, 'asc']],
                
                "dom": 'lBftipr',
                "buttons": [
                    {
                        extend: 'csv',
                        className: 'button',
                        text: '<i class="fas fa-file-csv"></i> CSV',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6],
                            //modifier: {page: 'current'}
                        },
                        filename: function () {
                            var d = new Date();
                            var e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                            return 'Chart_of_accounts' + e;
                        },
                    },
                    {
                        extend: 'print',
                        title:'',
                        className: 'button',
                        text: '<i class="fas fa-file-csv"></i> Print',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5 , 6],
                            //modifier: { page: 'current' }
                        },
                        filename: function () {
                            var d = new Date();
                            var e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                            return 'Chart_of_accounts' + e;
                        },
                        messageTop: function () {
                            return '<h3 style = "text-align:center"> Layla Sleep Inc.</h3 ><br /><h3 style="text-align:left">Chart of accounts</h3>';
                        },
                    }
                ],
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
    console.log(status);
    let cofStatus = status == "0" ? "Inactive" : "Active";
    ActivityLog('change status as ' + cofStatus + '', '/Accounting/chartofaccounts/' + id + '');
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

                swal('Success', data.message, 'success');
            }
            else { swal('Alert!', data.message, 'error') }
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}



