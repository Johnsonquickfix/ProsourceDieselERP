$(document).ready(function () {
    $("#loader").hide();
    $('#txtOrderDate').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        startDate: moment().subtract(1, 'month'), autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto"
    },

    );

    Search();
     

});



function Search() {


    var from_date = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    var to_date = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    var user_id = $("#hfuserid").val();
    var statusval = $("#ddlstatus").val();
    //var obj = { mydate: mydate };
    $('#exportorderdata').DataTable({
        "lengthMenu": [[10, 20, 50, 100], [10, 20, 50, 100]],

        destroy: true,
        searching: false,
        bAutoWidth: false,
        "ajax": {
            "url": '/Reports/GetOrderData',
            "type": 'POST',
            "dataType": 'json',
            "data": { from_date: from_date, to_date: to_date, user: user_id, status: statusval }
            //"data": JSON.stringify(obj)

        },

        "columns": [

            
            { 'data': 'order_id', title: 'Order Id', sWidth: "10%" },
            { 'data': 'first_name', title: 'Name', sWidth: "15%" },
 
            { 'data': 'total', class: 'text-right', title: 'Total', sWidth: "10%" },
 
            { 'data': 'tax', class: 'text-right', title:  'Tax', sWidth: "10%" },
 
            { 'data': 'subtotal', class: 'text-right', title: 'Order Total', sWidth: "10%" },
            { 'data': 'user_status', title: 'Status', sWidth: "10%" },
            {
                'data': 'order_created', title: 'Order Date', sWidth: "10%",
                'render': function (jsonDate) {
                    var date = new Date(parseInt(jsonDate.substr(6)));
                    var datevalue = ("0" + (date.getDate())).slice(-2);
                    return ("0" + (date.getMonth() + 1)).slice(-2) + '-' + datevalue + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                }

            },

            { 'data': 'variant_id', title: 'Aging Days', sWidth: "10%" },

        ],
        columnDefs: [{
            orderable: false,
            className: 'select-checkbox',
            targets: 0,
            'checkboxes': {
                "selectRow": false,
            },
            data: null,
            defaultContent: '',
        }],
        "select": {
            "style": 'multi',
            "selector": 'td:first-child',
        },
        "order": [6, 'desc'],

        "dom": 'lBfrtip',
        //"buttons": [

        //    {
        //        extend: 'csv',
        //        className: 'button',
        //        text: '<i class="fas fa-file-csv"></i> CSV',
        //        filename: 'Order'
        //    },
             
        //],

        "buttons": [
            {
                extend: 'csv',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> CSV',
                filename: function () {
                    // var d = new Date();
                    return 'Agingorders_' + $("#txtOrderDate").val().replaceAll('/', '.');
                },

            },
            {
                extend: 'print',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> Print',
                title: function () {
                    return "Layla Sleep Inc - Aging orders";
                },
                footer: true,
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7],
                },
                filename: function () {
                    //var from = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
                    return 'Agingorders_' + $("#txtOrderDate").val().replaceAll('/', '.');
                },
            },

            //{
            //    extend: 'pdfHtml5',
            //    className: 'button',
            //    text: '<i class="fas fa-file-csv"></i> PDF',
            //    footer: true,
            //    exportOptions: {
            //        columns: [0, 1, 2, 3, 4, 5, 6, 7],

            //    },
            //    customize: function (doc) {
            //        //doc.defaultStyle.alignment = 'right';
            //        doc.styles.tableHeader.alignment = 'left';
            //        // doc.styles.tableHeader[2].alignment = 'right';
            //        // doc.content[1].alignment = ['left', 'right', 'right'];

            //        doc.content[0].text = "Layla Sleep Inc - Non-Invoiced Sales PO";
            //        doc.content[0].text.alignment = 'left';

            //        var rowCountd = table.rows().count() + 1;
            //        for (i = 0; i < rowCountd; i++) {
            //            doc.content[1].table.body[i][6].alignment = 'right';
            //        };

            //        var rowCount = doc.content[1].table.body.length;
            //        for (i = 1; i < rowCount; i++) {
            //            doc.content[1].table.body[i][6].alignment = 'right';
            //            //doc.content[1].table.body[i][1].alignment = 'right';

            //        }


            //        // doc.styles.tableHeader.alignment = ['left', 'right', 'right'];
            //        //doc.content[1].table.widths =
            //        //    Array(doc.content[1].table.body[0].length + 1).join('*').split('');

            //        // doc.content[1].table.widths = ['50%', '25%', '25%'];


            //    },

            //    filename: function () {
            //        // var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
            //        return 'Non-InvoicedPO_' + $("#txtOrderDate").val().replaceAll('/', '.');
            //    },
            //},


        ],

    }); 
}


