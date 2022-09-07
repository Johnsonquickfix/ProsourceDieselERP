$(document).ready(function () {
    Uploaddatalist();
})

function Uploaddatalist() {
    $.ajax({
        url: '/DonationHaul/Uploaddatalist',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,

        success: function (data) {
            $('#dtdata').dataTable({
                destroy: true,
                scrollX: true,
                data: JSON.parse(data),
                columnDefs: [],
                responsive: true, lengthMenu: [[20, 50, 100], [20, 50, 100]],
                "columns": [
                    { data: 'id', title: 'Customer ID', sWidth: "8%" },
                    { data: 'name', title: 'Customer Name', sWidth: "14%" },
                    { data: 'user_email', title: 'E-mail', sWidth: "23%" },
                    { data: 'billing_phone', title: 'Phone', sWidth: "10%" },
                    { data: 'discription', title: 'Discription', sWidth: "10%" },
                    {
                        'data': 'rowid', sWidth: "7%",
                        'render': function (id, type, full, meta) {
                            return ' <span title="Click here to view" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="DonationModal(' + id + ');" ><i class="glyphicon glyphicon-eye-open"></i></a></span>';
                            //return '<a href="javascript:void(0);" onclick="DonationModal(' + id + ');" data-toggle="tooltip" title="Click here to view."><i class="glyphicon glyphicon-eye-open"></i></a>'
                        }
                    }, 
                ],


                "order": [[0, 'asc']],

                "dom": 'lBftipr',
                "buttons": [
                    {
                        extend: 'csv',
                        className: 'button',
                        text: '<i class="fas fa-file-csv"></i> CSV',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4],
                            //modifier: {page: 'current'}
                        },
                        filename: function () {
                            var d = new Date();
                            var e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                            return 'Uploaded_List' + e;
                        },
                    },
                    {
                        extend: 'print',
                        title: '',
                        className: 'button',
                        text: '<i class="fas fa-file-csv"></i> Print',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4],
                            //modifier: { page: 'current' }
                        },
                        filename: function () {
                            var d = new Date();
                            var e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                            return 'Uploaded_List' + e;
                        },
                        messageTop: function () {
                            return '<h3 style = "text-align:center"> Layla Sleep Inc.</h3 ><br /><h3 style="text-align:left">Uploade Donated List</h3>';
                        },
                    }
                ],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });

}
 
function DonationModal(id) {
    console.log(id);
    let modalHtml = '<div class="modal-dialog modal-fullscreen p-12">';
    modalHtml += '<div class="modal-content modal-rounded">';
    modalHtml += '<div class="modal-header py-3 justify-content-start"><h4 class="modal-title flex-grow-1">Uploaded Receipts.</h4><button type="button" class="btn btn-sm" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button></div>';
    modalHtml += '<div class="modal-body"></div>';
    modalHtml += '<div class="modal-footer py-3"></div>';
    //modalHtml += '<div class="modal-footer py-3"><button type="button" class="btn btn-sm btn-primary" data-id="' + id + '" onclick="UpdateTicketAction(this);"><i class="fa fa-paper-plane"></i> Submit</button></div>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    $("#myModal").empty().html(modalHtml);

    modalHtml = '';
    $.get('/donation-haul/multipal-receipt', { strValue1: id }).then(response => {
        response = JSON.parse(response);
        console.log(response);
       // modalHtml += '<div class="row">'; 
        //Show Image
        try {
            let _gdrive_link = isNullUndefAndSpace(response[0].FilePath) ? JSON.parse(response[0].FilePath) : [];
            if (_gdrive_link.length > 0) {
                modalHtml += '<div class="d-flex flex-wrap align-items-center border border-dashed border-gray-300 rounded min-w-700px p-7">';
                $.each(_gdrive_link, function (i, row) {
                    modalHtml += '  <div class="overlay me-10">';
                    modalHtml += '      <div class="overlay-wrapper"><a class="example-image-link" href="../' + row.files + '" data-lightbox="example-set" data-title=""><img class="example-image rounded w-150px" src="../' + row.files + '" alt="-"></a></div>';
                    modalHtml += '  </div>';
                });
                modalHtml += '</div>';
            }
         }
        catch { }; 
        modalHtml += '</div>';
        modalHtml += '</div>';
        console.log(modalHtml);
    }).catch(err => { }).always(function () { $('#myModal .modal-body').append(modalHtml); });

    $("#myModal").modal({ backdrop: 'static', keyboard: false });
     
}
function isNullUndefAndSpace(variable) { return (variable !== null && variable !== undefined && variable !== 'undefined' && variable !== 'null' && variable.length !== 0); }
function model(urlfile) {
    $('#AccountModal').modal('show');
    console.log(urlfile);
    var aa = $("#aa").clone();
    aa.find('embed').attr('src', urlfile)
    $("#aa").replaceWith(aa);
    //alert($("#aa").find('embed').attr('src'));
}

 