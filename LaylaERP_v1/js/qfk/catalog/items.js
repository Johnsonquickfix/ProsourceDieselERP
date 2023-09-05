!(function () {
    $(document).ready(function () {
        $("#loader").hide();
        loaddata(), loadcategories();
        $(document).on('click', 'a[data-action="delete"]', function (evt) {
            evt.preventDefault(), evt.stopPropagation(); deleteSources(parseInt($(this).data('id')) || 0)
        });
    });

    var $tb = $('#datatable'), bm = 'modalEdit',
        loaddata = function () {
            $tb.DataTable({
                lengthMenu: [[25, 50, 100], [25, 50, 100]], order: [[4, "desc"]],
                destroy: true, bProcessing: true, responsive: false, bServerSide: true, bAutoWidth: true, scrollX: false,
                language: {
                    lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> of _TOTAL_",
                    infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
                },
                sAjaxSource: "/api/catalog/items",
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
                        data: 'title', title: 'Item', sWidth: "40%", render: function (data, type, row, meta) {
                            return `<div class="d-flex"><img src="${row.image_link}" alt="" height="40" class="rounded" decoding="async" loading="lazy" ><div class="ms-3 align-self-center overflow-hidden me-auto"><a href="/catalog/item/${row.product_id}">${data}</a></div>`;
                        }
                    },
                    { data: 'status', title: 'Status', sWidth: "15%" },
                    { data: 'id', title: 'Item ID', sWidth: "15%" },
                    { data: 'created', title: 'Added On', sWidth: "15%", render: function (data, type, row, meta) { return moment(data).format('MMMM Do YYYY, h:mm A'); } },
                    { data: 'updated', title: 'Last Update', sWidth: "15%", render: function (data, type, row, meta) { return moment(data).format('MMMM Do YYYY, h:mm A'); } },
                ]
            });
        },
        loadcategories = function () {
            $('#datatable-categories').DataTable({
                lengthMenu: [[25, 50, 100], [25, 50, 100]], order: [[0, "asc"]],
                destroy: true, searching: false, lengthChange: false, bProcessing: true, responsive: false, bServerSide: true, bAutoWidth: true, scrollX: false,
                language: {
                    lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> of _TOTAL_",
                    infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
                },
                sAjaxSource: "/api/catalog/categories",
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
                        data: 'category', title: 'Category', sWidth: "40%", render: function (data, type, row, meta) {
                            return `<div class="d-flex"><div class="ms-3 align-self-center overflow-hidden me-auto"><a href="#">${data}</a></div>`;
                        }
                    }
                ]
            });
        };
})();