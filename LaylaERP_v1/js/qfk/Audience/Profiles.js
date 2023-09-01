!(function () {
    $(document).ready(function () {        
        $("#loader").hide();
        loaddata();
    });

    var tb = $('#datatable'),
        loaddata = function () {
            tb.DataTable({
                //dom: '<"d-flex justify-content-start"f><"d-flex justify-content-end"l>tip',
                lengthMenu: [[25, 50, 100], [25, 50, 100]], order: [[3, "desc"]],
                destroy: true, bProcessing: true, responsive: false, bServerSide: true, bAutoWidth: true, scrollX: false,
                language: {
                    lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> of _TOTAL_",
                    infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
                },
                sAjaxSource: "/api/profiles/list",
                fnServerData: function (sSource, aoData, fnCallback, oSettings) {
                    //aoData.push({ name: "user_id", value: _id }, { name: "application_id", value: _a_id });
                    if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
                    oSettings.jqXHR = $.ajax({
                        url: sSource, data: aoData,// dataType: 'json', type: "get", 
                        success: function (data) {
                            let _recordsTotal = data.length > 0 ? data[0].totalcount : 0; $('.profile-counts').html(_recordsTotal);
                            return fnCallback({ sEcho: aoData.find(el => el.name === "sEcho").value, recordsTotal: _recordsTotal, recordsFiltered: _recordsTotal, aaData: data });
                        }
                    });
                },
                columns: [
                    { data: 'profile', title: 'Profile', sWidth: "20%", orderable: false, render: function (data, type, full, meta) { return `<a href="/audience/profile/${full.id}"><span class="DataTable-Cell-text"><div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${data}</div></span></a>`; }},
                    { data: 'email', title: 'Email', sWidth: "20%", orderable: false },
                    { data: 'phone_number', title: 'Phone', sWidth: "20%", orderable: false },
                    { data: 'created', title: 'Profile created', sWidth: "20%", render: function (data, type, full, meta) { return moment(data).format('MMMM Do YYYY, h:mm A'); } },
                    { data: 'updated', title: 'Profile updated', sWidth: "20%", render: function (data, type, full, meta) { return moment(data).format('MMMM Do YYYY, h:mm A'); } },
                    { data: 'location', title: 'Location', sWidth: "20%", orderable: false },
                    //{ data: 'application_id', title: 'Application', sWidth: "20%", render: function (id, type, full, meta) { return '<h5 class="text-truncate font-size-14 mb-1"><a href="javascript: void(0);" class="text-dark">' + (full.application_name != '' ? full.application_name : '(unnamed application)') + '</a></h5><p class="text-muted mb-0">' + full.application_id + '</p>'; } },
                    //{ data: 'company', title: 'Company', sWidth: "20%", render: function (id, type, full, meta) { return '<h5 class="text-truncate font-size-14 mb-1"><a href="javascript: void(0);" class="text-dark">' + full.company + '</a></h5><p class="text-muted mb-0">' + full.user_name + '</p>'; } },
                    //{ data: 'index_name', title: 'Index', sWidth: "20%", },
                    //{ data: 'records', title: 'Records', sWidth: "10%", },
                    //{ data: 'modified_on', title: 'Last Update', sWidth: "15%", render: function (id, type, full, meta) { return (id == null) ? '' : moment(id).format('MM/DD/YYYY') } },
                    //{
                    //    data: 'application_index_id', title: 'Action', sWidth: "10%", render: function (id, type, full, meta) {
                    //        return '<a href="javascript: void(0);" onclick="setvalues(' + id + ',' + full.user_id + ',\'' + full.application_id + '\',\'' + full.index_name + '\');" title="Rename" class="btn btn-sm btn-soft-primary me-2"><i class="bx bx-edit"></i></a><a href="javascript: void(0);" onclick="removedata(\'' + full.application_id + '\',' + id + ');" title="Delete" class="btn btn-sm btn-soft-danger"><i class="bx bx-trash"></i></a>';
                    //    }
                    //}
                ]
            });
        }
})();