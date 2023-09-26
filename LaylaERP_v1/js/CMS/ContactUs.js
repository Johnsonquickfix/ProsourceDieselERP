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
            { data: 'answer', title: 'Answer', sWidth: "8%" },
            { data: 'date_creation', title: 'Date', sWidth: "8%" },
            {
                'data': 'rowid', title: 'Action', sWidth: "8%", render: function (id, type, row, meta) {
                    return '<a href="javascript:void(0);" onclick="viewModal(' + id + ',\'' + row.suggestions + '\');" data-toggle="tooltip" title="Reply."><i class="glyphicon glyphicon-share"></i></a>'
                }
            },
        ],
        //columnDefs: [
            //{ targets: [0], visible: false, searchable: false },
            //{ targets: [0, 1], orderable: false }
        //]
    });
}

function viewModal(id, question) {
    let modalHtml = '<div class="row flex-row_box">';
    modalHtml += '<div class="modal-header py-3 justify-content-start"><h4 class="modal-title flex-grow-1">Contact Us.</h4><button type="button" class="btn btn-sm" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button></div>';
    modalHtml += '<div class="modal-body">';
    modalHtml += '<div class="row">';
    modalHtml += '<div class="col-md-12">'; // First row for question
    modalHtml += '<h5>Question:</h5>';
    modalHtml += '<p>' + question +'</p>';
    modalHtml += '</div>';
    modalHtml += '</div>'; // End of first row
    modalHtml += '<div class="row">';
    modalHtml += '<div class="col-md-12">'; // Second row for answer
    modalHtml += '<h5>Answer:</h5>';
    modalHtml += '<textarea id="txtanswer" class="form-control" rows="4"></textarea>';
    modalHtml += '</div>';
    modalHtml += '</div>'; // End of second row
    modalHtml += '<div class="row">';
    modalHtml += '<div class="col-md-12 text-center">'; // Third row for submit button
    modalHtml += '<button id="btnreplyquestion" onclick="Status(' + id +');" type="submit" class="btn btn-primary">Submit</button>';
    modalHtml += '</div>';
    modalHtml += '</div>'; // End of modal-body
    modalHtml += '</div>'; // End of flex-row_box
    $("#myModal").empty().html(modalHtml);
    modalHtml = '';
    $('#myModal .modal-body').append(modalHtml);
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
}

function Status(id) {
    ans = $("#txtanswer").val();
    console.log(id, ans); 
    if (id == "") { swal('Alert', 'Please select question from list', 'error'); }
    else if (ans == "") { swal('Alert', 'Please write answer', 'error'); }
    else {
        var obj = { strVal: id, status: ans }
        //const updatestatus = status == 'publish' ? 'Active' : 'Inactive';
        ActivityLog('answer this ' + id + '', '/CMS/contactus');
        swal({ title: "", text: 'Would you like to reply this question?', type: "question", showCancelButton: true })
            .then((result) => {
                if (result.value) {
                    $.ajax({
                        url: '/CMS/replyanswer', dataType: 'JSON', type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(obj),
                        beforeSend: function () { $("#loader").show(); },
                        success: function (data) {
                            if (data.status == true) {
                                swal('Alert', data.message, 'success').then((result) => { dataGridLoad(''); $("#txtanswer").val('');   $('#myModal').modal('hide');});
                            }
                            else {
                                swal('Alert', 'something went wrong!', 'success');
                            }
                        },
                        complete: function () { $("#loader").hide(); },
                        error: function (error) {
                            swal('Error!', 'something went wrong', 'error');
                        },

                    })
                }
            });
    }
   
}