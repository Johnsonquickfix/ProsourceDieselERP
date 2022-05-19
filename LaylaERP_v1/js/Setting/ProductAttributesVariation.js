$(document).ready(function () {

    $(".subsubsub li a").click(function (e) {
        $('.subsubsub li a').removeClass('current');
        $(this).addClass('current');
    });   
    $("#loader").hide();
  //  GetDetails();
    dataGridLoad('');   
    $("#loader").hide();
});

function dataGridLoad(order_type) {

    var types = '';// $('#ddltype').val();
    let prodctype = '';// $('#ddlproducttype').val();
    let stockstatus = '';// $('#ddstockstatus').val();
    let _items = [];
    //let pid = parseInt($("#ddlProduct").val()) || 0, ctid = parseInt($("#ddlCategory").val()) || 0;
    let obj = { strValue1: types, strValue2: order_type, strValue3: prodctype, strValue4: stockstatus }; //console.log(obj); 
    $('#dtdata').DataTable({
        oSearch: { "sSearch": '' }, order: [[0, "asc"]], bProcessing: true, responsive: true, scrollX: true,
        //sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true,
        //bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        destroy: true, bAutoWidth: false, ajax: {
            url: '/Setting/ProductList', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        lengthMenu: [[20, 50, 100], [20, 50, 100]],
        columns: [
            { data: 'p_id', title: 'Parent ID', sWidth: "3%" }, 
             
            {
                data: 'id', title: 'ID', sWidth: "5%", render: function (data, type, row) {
                    if (row.post_parent > 0)
                        return ' ↳' + row.id + '';
                    else
                        return ' <b style="font-size:14px;"> #' + row.id + '</b>';
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> -  #' + row.id; else return ' <b>#' + row.id + '</b>';
                }
            },

             
            { data: 'post_title', title: 'Name', sWidth: "10%" },
            { data: 'attributes', title: 'Attributes', sWidth: "15%" },             
            { data: 'oldattributes', title: 'Old_Attributes', sWidth: "50%" },             
     
            {
                'data': 'id', title: 'Action', sWidth: "3%",
                'render': function (id, type, row) {
                    if (row.post_parent > 0)
                        return ' <b></b>';
                    else {
                   
                        return '<a title="Click here to view product details" data-toggle="tooltip" href="UpdateAttribute/' + id + '" onclick="ActivityLog(\'Edit product id (' + id + ') in product list\',\'UpdateAttribute/' + id + '\');"><i class="glyphicon glyphicon-eye-open"></i></a>'
                        
                    }
                }
            }
        ],
        columnDefs: [
            { targets: [0], visible: false, searchable: false },
            { targets: [1, 2], orderable: false }
        ]
    });
}



 
 