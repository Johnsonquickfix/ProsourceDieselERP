
CommercialGrid();
function CommercialGrid() {
   
    $.ajax({
        url: '/CommercialProposal/GetCommercialProposal',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        success: function (data) {
            $('#dtdata').dataTable({
                destroy: true,
                scrollX: true,
                data: JSON.parse(data),
                "columns": [
                    { data: 'id', title: 'ID', sWidth: "5%" },
                    { data: 'ref', title: 'Ref', sWidth: "10%" },
                    { data: 'vendorname', title: 'Vendor Name', sWidth: "15%" },
                    { data: 'namealias', title: 'Alias Name', sWidth: "15%" },
                    { data: 'city', title: 'City', sWidth: "15%" },
                    { data: 'zip', title: 'Zip', sWidth: "10%" },
                    { data: 'proposaldate', title: 'Proposal Date', sWidth: "10%" },
                    { data: 'enddate', title: 'End Date', sWidth: "10%" },
                    { data: 'status', title: 'Status', sWidth: "10%" },
                   
                ],

                "order": [[0, 'desc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });

}


