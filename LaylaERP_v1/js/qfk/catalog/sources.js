!(function () {
    $(document).ready(function () {
        $("#loader").hide();
        loaddata();
        $(document).on('click', 'a[data-action="delete"]', function (evt) {
            evt.preventDefault(), evt.stopPropagation(); deleteSources(parseInt($(this).data('id')) || 0)
        });
    });

    var $tb = $('#datatable'), bm = 'modalEdit',
        loaddata = function () {
            $tb.DataTable({
                lengthMenu: [[25, 50, 100], [25, 50, 100]], order: [[2, "desc"]],
                destroy: true, bProcessing: true, responsive: false, bServerSide: true, bAutoWidth: true, scrollX: false,
                language: {
                    lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> of _TOTAL_",
                    infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
                },
                sAjaxSource: "/api/catalog/source-list",
                fnServerData: function (sSource, aoData, fnCallback, oSettings) {
                    if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
                    oSettings.jqXHR = $.ajax({
                        url: sSource, data: aoData,// dataType: 'json', type: "get", 
                        success: function (data) {
                            let _recordsTotal = data.length > 0 ? data[0].totalcount : 0;
                            return fnCallback({ sEcho: aoData.find(el => el.name === "sEcho").value, recordsTotal: _recordsTotal, recordsFiltered: _recordsTotal, aaData: data });
                        }
                    });
                },
                columns: [
                    {
                        data: 'source_name', title: 'Source', sWidth: "30%", orderable: false, render: function (data, type, row, meta) {
                            return `<div class="mb-2"><a href="/catalog/sources/${row.sources_id}">${data}</a>`;
                        }
                    },
                    { data: 'status', title: 'Status', sWidth: "20%", orderable: false, render: function (data, type, row, meta) { return `<span class="badge bg-${row.status_id === 1 ? 'warning' : (row.status_id === 4 ? 'success' : 'danger')} p-1 font-size-12">${row.status}</span>`; } },
                    { data: 'created', title: 'Added On', sWidth: "20%", render: function (data, type, row, meta) { return moment(data).format('MMMM Do YYYY, h:mm A'); } },
                    { data: 'updated', title: 'Last Update', sWidth: "20%", render: function (data, type, row, meta) { return moment(data).format('MMMM Do YYYY, h:mm A'); } },
                    {
                        data: 'created', title: 'Action', class: 'text-center', sWidth: "10%", orderable: false, render: function (data, type, row, meta) { return `<a class="btn btn-outline-danger btn-sm delete" title="Delete" data-action="delete" data-id="${row.sources_id}"><i class="fas fa-trash"></i></a>`; }
                    }
                ]
            });
        },
        deleteSources = function (id) {
            swal({
                title: `Delete Source`, text: `You are about to delete this source. Are you sure you want to proceed?`,
                type: 'question', allowOutsideClick: false, showCancelButton: true, showConfirmButton: true, confirmButtonText: 'Delete'
            }).then((result) => {
                if (result.value) {
                    $.ajax({
                        dataType: 'json', type: 'delete', url: `/api/catalog/source/${id}`, data: {},
                        success: function (result) {
                            if (parseInt(result.sources_id) > 0) {
                                $tb.DataTable().ajax.reload(null, false)
                            }
                            else { swal('Error!', result.message, 'error'); }
                        },
                        error: function (xhr, textStatus, error) { swal('Error!', xhr.responseJSON.message, 'error'); },
                        always: function () { }
                    });
                }
            });
        };
})();