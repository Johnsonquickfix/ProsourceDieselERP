$(document).ready(function () {

    $('#dtdata tbody').on('click', '.details-control', function () {
        var tr = $(this).closest('tr');
        var row = $('#dtdata').DataTable().row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            tr.find('.details-control').empty().append('<i class="glyphicon glyphicon-plus-sign"></i>');
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            tr.find('.details-control').empty().append('<i class="glyphicon glyphicon-minus-sign"></i>');
            // row.child(format(row.data())).show();
            row.child.show();
            tr.addClass('shown');
        }
    });
    $("#loader").hide();
    dataGridLoad(''); 
});
 
function dataGridLoad(order_type) {
    let _items = [];
    //let pid = parseInt($("#ddlProduct").val()) || 0, ctid = parseInt($("#ddlCategory").val()) || 0;
    let obj = { strValue1: '0', strValue2: '1', strValue3: '2', strValue4: '3' }; //console.log(obj);
    $('#dtdata').DataTable({
        oSearch: { "sSearch": '' }, order: [[0, "asc"]], bProcessing: true, responsive: true, scrollX: true,
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        destroy: true, bAutoWidth: false, ajax: {
            url: '/Product/Getcalculatemargins', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
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
           
            { data: 'post_title', title: 'Name', sWidth: "12%" },
            { data: 'sku', title: 'SKU', sWidth: "8%" },
          
            {
                data: 'sale_price', title: 'Sale Price', sWidth: "8%", render: function (data, type, row) {
                    var tprice = 'toFormat';
                    if (data.toString() == "")
                        tprice = "";
                    else
                        tprice = '$' + parseFloat(data).toFixed(2);
                    return tprice
                }
            },
            {
                data: 'cost_price', title: 'Cost Price (Purchase)', sWidth: "8%", render: function (data, type, row) {
                    var tprice = 'toFormat';
                    if (data.toString() == "")
                        tprice = "";
                    else
                        tprice = '$' + parseFloat(data).toFixed(2);
                    return tprice
                }
            },
            { data: 'vname', title: 'Vendor', sWidth: "10%" },
            {
                data: 'Margins', title: 'Margins', sWidth: "8%", render: function (data, type, row) {
                    var tprice = 'toFormat';
                    if (data.toString() == "")
                        tprice = "";
                    else
                        tprice = '$' + parseFloat(data).toFixed(2);
                    return tprice
                }
            },
 
                        
        ],
        columnDefs: [
            { targets: [0], visible: false, searchable: false },
            { targets: [1, 2], orderable: false }
        ]
    });
}






