$(document).ready(function () {
    $("#loader").hide();
    dataGridLoad();
});

function dataGridLoad() {
    table_oh = $('#dtBudgetList').DataTable({
        oSearch: { "sSearch": '' }, order: [[0, "desc"]], lengthMenu: [[10, 20, 50], [10, 20, 50]],
        destroy: true, bProcessing: true, responsive: true, bServerSide: true, bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
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
                    console.log(data);
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [
            { data: 'budget_name', title: 'Budgets', sWidth: "20%" },
            { data: 'fiscalyear', title: 'Period', sWidth: "20%" },
            {
                data: 'created_date', title: 'Created On', sWidth: "20%", render: function (id, type, row) {
                    return moment(id).format('MM/DD/YYYY');
                }
            },
            {
                data: 'modified_date', title: 'Last Updated', sWidth: "20%", render: function (id, type, row) {
                    if (id != null) return moment(id).format('MM/DD/YYYY');
                    else return '';
                }
            },
            {
                data: 'budget_id', title: 'Action', sWidth: "8%", orderable: false, render: function (id, type, row, meta) {
                    return '<a href="AddBudget/' + id + '" data-toggle="tooltip" title="Edit Budget"><i class="fas fa-edit"></i></a>';
                }
            }
        ]
    });
}