$(document).ready(function () {
    dataGridLoad();
    $("#loader").hide();
});
function dataGridLoad() {
    $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        //sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true,
        bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true,
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        sAjaxSource: "/EmailSetting/GetEmailList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            //aoData.push({ name: "strValue1", value: monthYear });
            aoData.push({ name: "strValue1", value: '' });
            aoData.push({ name: "strValue2", value: '' });
            aoData.push({ name: "strValue3", value: '' });
            aoData.push({ name: "strValue4", value: '' });
            var col = 'rowid';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "email_text" : oSettings.aaSorting[0][0] == 1 ? "email_content_type" : oSettings.aaSorting[0][0] == 2 ? "recipients" : oSettings.aaSorting[0][0] == 3 ? "is_active" : "rowid";
                aoData.push({ name: "sSortColName", value: col });
            }
            //console.log(aoData);
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [

            {

            'data': 'id', sWidth: "5%   ",
                'render': function (data, type, row) {
                    if (parseInt(row.is_active) == 0)
                        return '<span><i class="fa fa-times-circle" aria-hidden="true"></i></span>';
                    else
                        return '<span><i class="fa fa-check-circle" aria-hidden="true"></i></span>';
                }
            },

            {
                'data': 'email_text', sWidth: "10%", title: 'Email',
                'render': function (id, type, full, meta) {
                    return '<a href="ManageEmailNotifications/' + full.email_notify_key + '">' + id + '</a>';
                }
            },
            { data: 'email_content_type', title: 'Content type', sWidth: "12%" },
            { data: 'recipients', title: 'Recipient(s)', sWidth: "12%" },

            {
                'data': 'email_notify_key', title: 'Action', sWidth: "5%",
                'render': function (id, type, full, meta) {
                    return '<a class="btn btn-danger" title="Click here to view details" data-toggle="tooltip" href="ManageEmailNotifications/' + id + '">Manage</a>'
                    

                }
            }
        ]
    });
}