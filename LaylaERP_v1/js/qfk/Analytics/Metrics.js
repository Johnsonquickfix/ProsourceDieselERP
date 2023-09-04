!(function () {
    $(document).ready(function () {
        $("#loader").hide();
        loaddata();
    });

    var loaddata = function () {
        $('#datatable').DataTable({
            //dom: '<"d-flex justify-content-start"f><"d-flex justify-content-end"l>tip',
            lengthMenu: [[25, 50, 100], [25, 50, 100]],
            destroy: true, bProcessing: true, responsive: false, bServerSide: true, bAutoWidth: true, scrollX: false,
            language: {
                lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> of _TOTAL_",
                infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
            },
            sAjaxSource: "/api/analytics/metrics-list",
            fnServerData: function (sSource, aoData, fnCallback, oSettings) {
                //aoData.push({ name: "user_id", value: _id }, { name: "application_id", value: _a_id });
                if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
                oSettings.jqXHR = $.ajax({
                    url: sSource, data: aoData,// dataType: 'json', type: "get", 
                    success: function (data) {
                        console.log(data);
                        let _recordsTotal = data.length > 0 ? data[0].totalcount : 0;
                        return fnCallback({ sEcho: aoData.find(el => el.name === "sEcho").value, recordsTotal: _recordsTotal, recordsFiltered: _recordsTotal, aaData: data });
                    }
                });
            },
            columns: [
                //{ data: 'profile', title: 'Profile', sWidth: "20%", orderable: false, render: function (data, type, full, meta) { return `<a href="/audience/profile/${full.id}"><span class="DataTable-Cell-text"><div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${data}</div></span></a>`; }},
                { data: 'metric_name', title: 'Metric Name', class: "d-flex", sWidth: "60%", render: function (data, type, full, meta) { return `<i class="fa fa-envelope me-2 mt-1"></i><a href="/analytics/metric/${full.metric_id}"><span class="DataTable-Cell-text"><div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${data}</div></span></a>`; } },
                { data: 'created', title: 'Metric created', sWidth: "20%", render: function (data, type, full, meta) { return moment(data).format('MMMM Do YYYY, h:mm A'); } },
                { data: 'updated', title: 'Metric updated', sWidth: "20%", render: function (data, type, full, meta) { return moment(data).format('MMMM Do YYYY, h:mm A'); } },
                //{ data: 'location', title: 'Location', sWidth: "20%", orderable: false },
            ]
        });
    };
})();