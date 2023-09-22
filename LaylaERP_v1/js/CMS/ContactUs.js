$(document).ready(function () { 
    $("#loader").hide(); 
    $(".select1").select2();
    getcompany(); 
    dataGridLoad(''); 
    $("#loader").hide();
    $(document).on('click', "#btnsearch", function () {
        dataGridLoad('');
    }) 
});

function getcompany() {
    $.ajax({
        url: "/Setting/GetCompany",
        type: "Get",
        success: function (data) {
            var opt = '<option value="">Please Select Store</option>';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
            }
            $('#ddlcompany').html(opt);
        }

    });
} 
function dataGridLoad(order_type) {
    var company = $('#ddlcompany').val();      
    $('#dtdata').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        //sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true,
        bAutoWidth: false, scrollX: false, scrollY: ($(window).height() - 215),
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
        sAjaxSource: "/CMS/GetcontactList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            //aoData.push({ name: "strValue1", value: monthYear });
            aoData.push({ name: "strValue1", value: company });
            aoData.push({ name: "strValue2", value: null });
            aoData.push({ name: "strValue3", value: null });
            var col = 'order_id';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "rowid" : oSettings.aaSorting[0][0] == 1 ? "name" : oSettings.aaSorting[0][0] == 3 ? "subject" : "rowid";
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
            { data: 'rowid', title: 'ID', sWidth: "3%" },
            { data: 'name', title: 'Name', sWidth: "12%" },
            { data: 'email', title: 'Email', sWidth: "12%" },
            { data: 'subject', title: 'Subject', sWidth: "5%" },
            { data: 'suggestions', title: 'Suggestions', sWidth: "8%" },
            { data: 'date_creation', title: 'Date', sWidth: "8%" },
        ],
        //columnDefs: [
            //{ targets: [0], visible: false, searchable: false },
            //{ targets: [0, 1], orderable: false }
        //]
    });
} 