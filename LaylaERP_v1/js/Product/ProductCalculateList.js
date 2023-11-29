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
    let table = $('#dtdata').DataTable({
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
                data: 'regula_price', title: 'Retail Price', class: 'text-right', sWidth: "8%", render: function (data, type, row) {
                    var tprice = 'toFormat';
                    if (data.toString() == "")
                        tprice = "";
                    else
                        tprice = '$' + parseFloat(data).toFixed(2);
                    return tprice
                }
            },
          
            {
                data: 'sale_price', title: 'Sale Price', class: 'text-right', sWidth: "8%", render: function (data, type, row) {
                    var tprice = 'toFormat';
                    if (data.toString() == "")
                        tprice = "";
                    else
                        tprice = '$' + parseFloat(data).toFixed(2);
                    return tprice
                }
            },
            {
                data: 'cast_prise', title: 'Cost Price (Purchase)', class: 'text-right', sWidth: "8%", render: function (data, type, row) {
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
                data: 'regulaMargin', title: 'Retail Margin (Default)', class: 'text-right', sWidth: "8%", render: function (data, type, row) {
                    var tprice = 'toFormat';
                    if (data.toString() == "")
                        tprice = "";
                    else
                        tprice = '$' + parseFloat(data).toFixed(2);
                    return tprice
                }
            },
            {
                data: 'regularmarginpersantage', title: 'Retail Margin (%)', class: 'text-right', sWidth: "8%", render: function (data, type, row) {
                    var tprice = 'toFormat';
                    if (data.toString() == "")
                        tprice = "";
                    else
                        tprice = parseFloat(data).toFixed(2) + '%';
                    return tprice
                }
            },
            {
                data: 'Margin', title: 'Sale Margin (Default)', class: 'text-right', sWidth: "8%", render: function (data, type, row) {
                    var tprice = 'toFormat';
                    if (data.toString() == "")
                        tprice = "";
                    else
                        tprice = '$' + parseFloat(data).toFixed(2);
                    return tprice
                }
            },
            
            {
                data: 'marginpersantage', title: 'Sale Margin (%)', class: 'text-right', sWidth: "8%", render: function (data, type, row) {
                    var tprice = 'toFormat';
                    if (data.toString() == "")
                        tprice = "";
                    else
                        tprice =   parseFloat(data).toFixed(2) + '%';
                    return tprice
                }
            },

                        
        ],
        columnDefs: [
            { targets: [0], visible: false, searchable: false },
            { targets: [1, 2], orderable: false }
        ],
        "dom": 'Bfrtip',
        "buttons": [

            {
                extend: 'csv',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> Export',
                filename: function () {
                    var d = new Date();
                    return 'Products_Margin_List' ;
                },

            },
            {
                extend: 'print',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> Print',
                title: function () {
                    return "ERP - Products Margin List";
                },
                footer: true,
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                filename: function () {
                    //var from = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
                    return 'Products_Margin_List';
                },
            },

            {
                extend: 'pdfHtml5',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> PDF',
                footer: true,
                exportOptions: {
                    columns: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],

                },
                customize: function (doc) {
                    //doc.defaultStyle.alignment = 'right';
                    doc.styles.tableHeader.alignment = 'left';
                    // doc.styles.tableHeader[2].alignment = 'right';
                    // doc.content[1].alignment = ['left', 'right', 'right'];

                    doc.content[0].text = "ERP - Products Margin List";
                    doc.content[0].text.alignment = 'left';

                    var rowCountd = table.rows().count() + 1;
                    for (i = 0; i < rowCountd; i++) {
                        doc.content[1].table.body[i][3].alignment = 'right';
                        doc.content[1].table.body[i][4].alignment = 'right';
                        doc.content[1].table.body[i][5].alignment = 'right';
                        doc.content[1].table.body[i][7].alignment = 'right';
                        doc.content[1].table.body[i][8].alignment = 'right';
                        doc.content[1].table.body[i][9].alignment = 'right';
                    };

                    var rowCount = doc.content[1].table.body.length;
                    for (i = 1; i < rowCount; i++) {
                        doc.content[1].table.body[i][3].alignment = 'right';
                        doc.content[1].table.body[i][4].alignment = 'right';
                        doc.content[1].table.body[i][5].alignment = 'right';
                        doc.content[1].table.body[i][7].alignment = 'right';
                        doc.content[1].table.body[i][8].alignment = 'right';
                        doc.content[1].table.body[i][9].alignment = 'right';
                        //doc.content[1].table.body[i][1].alignment = 'right';

                    }


                    // doc.styles.tableHeader.alignment = ['left', 'right', 'right'];
                    //doc.content[1].table.widths =
                    //    Array(doc.content[1].table.body[0].length + 1).join('*').split('');

                    // doc.content[1].table.widths = ['50%', '25%', '25%'];


                },

                filename: function () {
                    // var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
                    return 'Products_Margin_List';
                },
            }

        ],
    });
}






