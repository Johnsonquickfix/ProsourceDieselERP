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
                        'data': 'urlfile', sWidth: "7%",
                        'render': function (id, type, full, meta) {
                            return ' <span title="Click here to view" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="model(\'' + id + '\');" ><i class="glyphicon glyphicon-eye-open"></i></a></span>';
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
 

function model(urlfile) {
    $('#AccountModal').modal('show');
    console.log(urlfile);
    var aa = $("#aa").clone();
    aa.find('embed').attr('src', urlfile)
    $("#aa").replaceWith(aa);
    //alert($("#aa").find('embed').attr('src'));
}

 