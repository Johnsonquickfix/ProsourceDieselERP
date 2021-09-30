$(document).ready(function () {
    dataGridLoad();
    $("#loader").hide();
});
$(document).on('click', "#btnchanges", function () {
    addchanges();
});
function addchanges() {  
    debugger
    fromnameval = $("#txtfromname").val();
    fromaddressval = $("#txtfromaddress").val();
    headerimagval = $("#txtheaderimage").val();
    footertextval = $("#txtfootertext").val(); 

    if (fromnameval == "") {
        swal('Alert', 'Please Enter From Name', 'error').then(function () { swal.close(); $('#txtfromname').focus(); });
    }
    else if (fromaddressval == "") {
        swal('Alert', 'Please Enter From Address', 'error').then(function () { swal.close(); $('#txtfromaddress').focus(); });
    }
    else if (headerimagval == "") {
        swal('Alert', 'Please Enter Header Image', 'error').then(function () { swal.close(); $('#txtheaderimage').focus(); });
    }
    else if (footertextval == "") {
        swal('Alert', 'Please Enter Footer Text', 'error').then(function () { swal.close(); $('#txtfootertext').focus(); });
    }
    else {
        var obj = {
            option_name: fromnameval,
            email_type: fromaddressval,
            additional_content: headerimagval,
            email_heading: footertextval,
        }
        $.ajax({
            url: '/EmailSetting/Updatewoocommerce/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (data) {
                if (data.status == true) {
                    if (data.url == "Manage") {
                        swal('Alert!', data.message, 'success');
                    }
                    else {
                        swal('Alert!', data.message, 'success');
                    }
                }
                else {
                    swal('Alert!', data.message, 'error')
                }
            },
            complete: function () {
                $("#loader").hide();
            },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
        })
    }



}
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
                    if (parseInt(row.is_active) == 1)
                        return '<span><i class="fa fa-check-circle" aria-hidden="true"></i></span>';                
                    else
                        return '<span><i class="fa fa-times-circle" aria-hidden="true"></i></span>';
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
                    return '<a class="btn btn-danger" title="Click here to view details" data-toggle="tooltip" onClick="ManageEmailNotifications(' + id + ')" href="ManageEmailNotifications/' + id + '">Manage</a>'
                  
                    

                }
            }
        ]
    });
}
