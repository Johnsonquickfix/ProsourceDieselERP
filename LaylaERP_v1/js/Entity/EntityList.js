 
function Datagrid() {
    $('#dtdata').DataTable({
            //  oSearch: { "sSearch": role_type.trim() },
            destroy: true,
            bAutoWidth: false,
            "ajax": {
                "url": '/Entity/GetData',
                "type": 'GET',
                "dataType": 'json',
                data: { rolepass: '' },
                contentType: "application/json; charset=utf-8",
            },
            lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
            "columns": [
                {
                    'data': 'ID', sWidth: "5%",
                    'render': function (data, type, full, meta) {
                        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '"><label></label>';
                    }
                },
                { 'data': 'ID', 'sWidth': "8%", "bSearchable": true },
                { 'data': 'companyname', 'sWidth': "12%", "bSearchable": true },
                { 'data': 'email', 'sWidth': "25%", "bSearchable": true },
                //{ 'data': 'phone', 'sWidth': "15%", "bSearchable": true },
                {
                    data: 'phone',
                    sWidth: "25%",
                    bSearchable: true,
                    render: function (data, type, row, meta) {
                        if (type === 'display') {
                            return formatPhoneNumber(data);
                        }
                        return data;
                    }
                },
                { 'data': 'status', 'sWidth': "10%" },
                { 'data': 'address', 'sWidth': "30%", "bSearchable": true },

                {
                    'data': 'ID', sWidth: "8%", "bSearchable": false,
                    'render': function (ID, type, full, meta) {
                        //if ($("#hfEdit").val() == "1") {
                        return '<a href="../Entity/CreateNew/' + ID + '" data-toggle="tooltip" title="View/Edit" onclick="ActivityLog(\'Edit entity\',\'/Entity/Index/' + ID + '\');"><i class="glyphicon glyphicon-pencil"></i></a>'

                       //}
                       // else { return "No Permission"; }
                    }

                }
            ],
           
            "order": [[1, 'desc']], 
        }); 
}  

function formatPhoneNumber(phoneNumber) {
    // Format the phone number as (999) 999-9999
    return "(" + phoneNumber.substr(0, 3) + ") " + phoneNumber.substr(3, 3) + "-" + phoneNumber.substr(6);
}
function ActiveUsers() {
    var id = "";
    var status = $("#ddlStatus").val();
    $("input:checkbox[name=CheckSingle]:checked").each(function () { id += $(this).val() + ","; });

    if (id == "") { swal('Alert', 'Please select entity from list', 'error'); }
    else if (status == "1") { swal('Alert', 'Please select bulk action', 'error'); }
    else {
            id = id.replace(/,(?=\s*$)/, '');
            swal({
                title: '', text: "Do you want change entity status?", type: 'warning', showCancelButton: true,
                confirmButtonColor: '#3085d6', cancelButtonColor: '#3085d6', confirmButtonText: 'Yes'
            }).then((result) => {
                if (result.value) { 
                    ActivityLog('Applied bulk action "active" for entity id (' + id + ')', '/Entity/Index');
                    if (status == "2") { status = "1" } if (status == "3") { status = "0" }
                    var obj = { address: id, status: status}
                            $.ajax({
                                url: '/Entity/ActiveEntity/', dataType: 'json', type: 'Post',
                                contentType: "application/json; charset=utf-8",
                                data: JSON.stringify(obj),
                                dataType: "json",
                                success: function (data) {
                                    if (data.status == true) {
                                        swal('Success!', data.message, 'success').then((result) => { 
                                            Datagrid();
                                        });
                                    }
                                    else {
                                        swal('Alert!', data.message, 'error')
                                    }
                                },
                                error: function (error) {
                                    swal('Error!', 'something went wrong', 'error');
                                },
                            })
                }
            })
        
        }
   


}

 