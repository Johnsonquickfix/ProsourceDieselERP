$(document).ready(function () {
    $("#loader").hide();
    dataGridLoad();
    $(document).on("click", ".btnDelete", function (t) {
        t.preventDefault(); DeleteBudget();
    });
});

function dataGridLoad() {
    table_oh = $('#dtBudgetList').DataTable({
        oSearch: { "sSearch": '' }, order: [[1, "desc"]], lengthMenu: [[10, 20, 50], [10, 20, 50]],
        destroy: true, bProcessing: true, responsive: true, bServerSide: true, bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
        language: {
            lengthMenu: '<a href="javascript:;" class="btn btn-sm btn-danger btnDelete hide"><i class="fas fa-trash"></i> Delete</a>',//lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        //initComplete: function () {
        //    $('.dataTables_filter input').unbind();
        //    $('.dataTables_filter input').bind('keyup', function (e) {
        //        var code = e.keyCode || e.which;
        //        if (code == 13) { table_oh.search(this.value).draw(); }
        //    });
        //},
        sAjaxSource: "/budget/get-budgets",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                success: function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [
            {
                data: 'budget_id', sWidth: "5%", orderable: false, title: '<input type="checkbox" name="checkall" id="checkall" onClick="CheckAll();"><label></label>',
                render: function (id, type, full, meta) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck(this);" value="' + id + '"><label></label>';
                }
            },
            { data: 'budget_name', title: 'Budgets', sWidth: "30%" },
            { data: 'fiscalyear', title: 'Period', sWidth: "25%" },
            {
                data: 'created_date', title: 'Created On', sWidth: "15%", render: function (id, type, row) {
                    return moment(id).format('MM/DD/YYYY');
                }
            },
            {
                data: 'modified_date', title: 'Last Updated', sWidth: "15%", render: function (id, type, row) {
                    if (id != null) return moment(id).format('MM/DD/YYYY');
                    else return '';
                }
            },
            {
                data: 'budget_id', title: 'Action', sWidth: "10%", orderable: false, render: function (id, type, row, meta) {
                    return '<a href="AddBudget/' + id + '" data-toggle="tooltip" title="Edit Budget"><i class="fas fa-edit"></i></a> <a href="AddBudget?qt=c&id=' + id + '" data-toggle="tooltip" title="Create clone of this quote"><i class="fas fa-copy"></i></a>';
                }
            }
        ]
    });
}

function CheckAll() {
    let isChecked = $('#checkall').prop("checked");
    $('#dtBudgetList tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
    if (isChecked) $('.btnDelete').removeClass('hide'); else $('.btnDelete').addClass('hide');
}
function Singlecheck(chk) {
    let _checkedCount = 0; isChecked = $(chk).prop("checked"), isHeaderChecked = $("#checkall").prop("checked");
    if (isChecked == false && isHeaderChecked) $("#checkall").prop('checked', isChecked);
    else {
        $('#dtBudgetList tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false) isChecked = false;
            else _checkedCount += 1;
        });
        $("#checkall").prop('checked', isChecked);
        if (_checkedCount > 0) $('.btnDelete').removeClass('hide'); else $('.btnDelete').addClass('hide');
    }
}

function DeleteBudget() {
    let _list = [];
    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        _list.push({ budget_id: parseInt($(this).val()) || 0 });
    });
    //console.log(obj); return false;

    if (_list.length == 0) { swal('Error!', 'Please select budget.', "error"); return false; }
    else {
        let option = { budget_id: 0, budget_name: JSON.stringify(_list) };
        swal.queue([{
            title: '', confirmButtonText: 'Yes, Do it!', text: "Are you sure you want to delete this budget?", showLoaderOnConfirm: true, showCancelButton: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    $.post('/budget/delete-budget', option).done(function (result) {
                        result = JSON.parse(result);
                        if (result[0].response == "success") {
                            swal('Success', result[0].id + ' Budget deleted successfully.', "success").then((result) => {
                                $('#dtBudgetList').DataTable().ajax.reload(null, false);
                            });
                        }
                        else { swal('Error', result[0].response, "error"); }
                    }).catch(err => { swal.hideLoading(); swal('Error!', 'Something went wrong, please try again.', 'error'); });
                });
            }
        }]);
    }
    return false;
}