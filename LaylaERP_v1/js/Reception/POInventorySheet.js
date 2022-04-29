$(document).ready(function () {
    var loc = window.location.pathname; 
    FillGrid();  
});

function FillGrid(is_date) { 
    var obj = { strValue1: 'SERCH', strValue2: '', strValue3: '', strValue4: '' }
    var table_EL = $('#dtdata').DataTable({
        //columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': false, 'targets': [9] }], order: [[9, "desc"]],
        order: [[0, "asc"], [1, "asc"]], ordering: true, destroy: true, bProcessing: true, bServerSide: false, bAutoWidth: false, searching: true, responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#JournalListdata_filter input').unbind();
            $('#JournalListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
      
        ajax: {
            url: '/Reception/Getinventorysheet', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { console.log(JSON.parse(data)); return JSON.parse(data); }
        },
        
        aoColumns: [
            { data: 'fk_product', title: 'ID', sWidth: "8%" },
            { data: 'product', title: 'Product', sWidth: "40%" },
            { data: 'Sku', title: 'SKU', sWidth: "10%" },
            { data: 'POqty', title: 'Po. Qty', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'recqty', title: 'Received Qty', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'balqty', title: 'Balance Qty', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') }
            
             
        ],
        dom: 'lBftipr',
        buttons: [
            {
                extend: 'csv', className: 'button', text: '<i class="fas fa-file-csv"></i> CSV',
                exportOptions: {
                    columns: [0,1, 2, 3, 4, 5],

                },
                filename: function () {
                    let d = new Date(); let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'PO_Inventory_Sheet' + e;
                },
            },

            {
                extend: 'print',
                //title: '<h3 style="text-align:center">Layla Sleep Inc.</h3><br /><h3 style="text-align:left">Chart of accounts</h3>',
                title: '', className: 'button', text: '<i class="fas fa-file-csv"></i> Print', footer: false,
                exportOptions: { columns: [0,1, 2, 3, 4, 5], },
                filename: function () {
                    let d = new Date(); let e = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
                    return 'PO_Inventory_Sheet' + e;
                },
                messageTop: function () { return '<h3 style = "text-align:center"> Layla Sleep Inc.</h3 ><br /><h3 style="text-align:left">Check Register</h3>'; },
            }
        ],
    });
}

 
 






