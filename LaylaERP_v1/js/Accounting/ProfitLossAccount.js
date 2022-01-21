$(document).ready(function () {

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
    }, function (start, end, label) {
        $("#txtdebit").text(''); $("#txtcredit").text(''); $("#txtbalance").text('');
        AccountList(true);
        getGrandTotal(true);
    });
    getGrandTotal(true); 
    AccountList(true);

   // $.when(globallastyear('year'), globalnextyear('nextyear'), months()).done(function () { Search(); });

    $("#btnSearch").click(function () {
        AccountList(true);
        getGrandTotal(true);
    })

 

});

function AccountList(is_date) {
    var urid = "";
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    var numberRenderer = $.fn.dataTable.render.number(',', '.', 2,).display;
    let bailance = 0.00;
    $('#Listdata').DataTable({
        destroy: true,
        "scrollX": true,
        searching: false,
        "ajax": {
            "url": '/Accounting/AccountProfitLossList',
            "type": 'POST',
            "dataType": 'json',
            "data": { Month: sd, Year: ed }

        },
        footerCallback: function (row, data, start, end, display) {
            var api = this.api(), data;
          
            console.log(data);
            var intVal = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            var sales = api.column(2).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);

            var forecastales = api.column(3).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);
            bailance = forecastales - sales;
            $(api.column(1).footer()).html('Grand total');
            $(api.column(2).footer()).html(numberRenderer(sales));
            $(api.column(3).footer()).html(numberRenderer(forecastales));
          //  $(api.column(3).footer()).html('Balance $' + numberRenderer(bailance));
        
           
            
        },
     
        "columns": [
            { 'data': 'UID', 'sWidth': "0.1%" },
            //{
            //    data: 'UID', sWidth: "10%", render: function (id, type, full, meta) {
            //        console.log(full);
            //        return '<span style="display: none;">' + full.UID + '</span>' + full.country;
            //    }
            //},
           /* { 'data': 'shipping_address_1', 'sWidth': "15%" },*/
            { 'data': 'shipping_city', 'sWidth': "15%", 'class': 'text-left' },
            //{ 'data': 'shipping_state', 'sWidth': "15%" },
           // { 'data': 'total', 'sWidth': "10%", 'class': 'text-right' },
            { data: 'total', sWidth: "10%", className: 'text-right', render: $.fn.dataTable.render.number(',', '.', 2,).display },
          // { 'data': 'Discount', 'sWidth': "10%", 'class': 'text-right' },
            { data: 'Discount', sWidth: "10%", className: 'text-right', render: $.fn.dataTable.render.number(',', '.', 2,).display },
           

        ],

        

        columnDefs: [{
            targets: [0], visible: false,
            orderable: false,
            data: null,
            defaultContent: '',
        }],

        "order": [1, 'asc'],

        //"dom": 'Bfrtip',
        //"buttons": [

        //    {
        //        extend: 'csv',
        //        className: 'button',
        //        text: '<i class="fas fa-file-csv"></i> Export',
        //        filename: function () {
        //            var d = new Date();
        //            return '_' + $("#txtOrderDate").val();
        //        },

        //    },

        //],
        dom: 'Bfrtip',
        "buttons": [
            {
                extend: 'csv',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> CSV',
                exportOptions: {
                    columns: [1, 2, 3],
                },
                filename: function () {
                    var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
                    return 'ProfitLoss for' + from;
                },
            },
            {
                extend: 'excel',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> Excel',
                exportOptions: {
                    columns: [1, 2, 3],
                },
                footer: true,
                filename: function () {
                    var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
                    return 'ProfitLoss for' + from;
                },
            },
            {
                extend: 'print',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> Print',
                footer: true,
                exportOptions: {
                    columns: [1, 2, 3],
                },
                filename: function () {
                    var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
                    return 'ProfitLoss for' + from;
                },
            },
            {
                extend: 'pdfHtml5',
                footer: true,
                exportOptions: {
                    columns: [1, 2, 3],
                },
                customize: function (doc) {
                 //   doc.defaultStyle.alignment = 'left';
                  doc.styles.tableHeader.alignment = 'right';
                  // doc.styles.tableHeader[2].alignment = 'right';
                   // doc.content[1].alignment = ['left', 'right', 'right'];

                    doc.content[0].text = "Layla Sleep Inc - Profit and Loss A/C";
                    doc.content[0].text.alignment = 'left';

                    
                    var rowCount = doc.content[1].table.body.length;
                    for (i = 1; i < rowCount; i++) {
                        doc.content[1].table.body[i][2].alignment = 'right';
                        doc.content[1].table.body[i][1].alignment = 'right';
                        
                    }

                    doc.content[1].table.widths =
                        Array(doc.content[1].table.body[0].length + 1).join('*').split('');

                   
                },
              
                filename: function () {
                    var from = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY') + '-' + $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
                    return 'ProfitLoss for' + from;
                },
            }
        ],

        //buttons: [{
        //    extend: 'pdf',
        //    title: 'Customized PDF Title',
        //    filename: 'customized_pdf_file_name'
        //}, {
        //    extend: 'excel',
        //    title: 'Customized EXCEL Title',
        //    filename: 'customized_excel_file_name'
        //    },
        //    {
        //    extend: 'csv',
        //    filename: 'customized_csv_file_name'
        //    },
        //    { extend: 'pdfHtml5', footer: true }
        //]


    });







} 
function getGrandTotal(is_date) {
    //let urid = $("#ddlVendor").val();
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';
    let obj = { strValue1: sd, strValue2: ed };
    $.ajax({
        url: "/Accounting/AccountProfitLossTotal",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: obj,
        success: function (data) {
            var d = JSON.parse(data);
            if (d.length > 0) {
                if (parseInt(d[0].IncomVal).toFixed(2) > 0 || parseInt(d[0].IncomVal).toFixed(2) == 0) {
                    $("#txtdebit").text('$' + parseFloat(d[0].IncomVal).toFixed(2)); $("#txtcredit").text('$' + parseFloat(d[0].ExpenseVal).toFixed(2));
                    if (parseInt(d[0].prls).toFixed(2) > 0)
                        $("#txtbalance").text('$' + parseFloat(d[0].prls).toFixed(2))
                    else
                        $("#txtbalance").text('$' + parseFloat(d[0].prls).toFixed(2))
                }
            }
        },
        error: function (msg) {

        }
    });
}