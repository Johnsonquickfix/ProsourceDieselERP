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
    });
    getGrandTotal(true); 
    AccountList(true);

   // $.when(globallastyear('year'), globalnextyear('nextyear'), months()).done(function () { Search(); });

    $("#btnSearch").click(function () {
        AccountList(true);
    })

});

function AccountList(is_date) {
    var urid = "";
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    $('#Listdata').DataTable({
        destroy: true,
        "scrollX": true,
        searching: false,
        "ajax": {
            "url": '/Accounting/AccountProfitLossList',
            "type": 'POST',
            "dataType": 'json',
            "data": { Month: sd, Year: ed }
            //"data": JSON.stringify(obj)

        },
        "columns": [

            { 'data': 'shipping_address_1', 'sWidth': "15%" },
            { 'data': 'shipping_city', 'sWidth': "15%" },
            { 'data': 'shipping_state', 'sWidth': "15%" },

            {
                'data': 'order_created', sWidth: "15%",
                'render': function (jsonDate) {
                    var date = new Date(parseInt(jsonDate.substr(6)));
                    var datevalue = ("0" + (date.getDate())).slice(-2);
                    return ("0" + (date.getMonth() + 1)).slice(-2) + '-' + datevalue + '-' + date.getFullYear()  ;
                }
            },
            //{
            //    data: 'UID', sWidth: "10%", render: function (id, type, full, meta) {
            //        return   full.order_created 
            //    }
            //},
            { 'data': 'total', 'sWidth': "10%", 'class': 'text-right' },
           { 'data': 'Discount', 'sWidth': "10%", 'class': 'text-right' },
         
           

        ],

        columnDefs: [{
            orderable: false,
            data: null,
            defaultContent: '',
        }],

        "order": [3, 'asc'],

        "dom": 'Bfrtip',
        "buttons": [

            {
                extend: 'csv',
                className: 'button',
                text: '<i class="fas fa-file-csv"></i> Export',
                filename: function () {
                    var d = new Date();
                    return '_' + $("#txtOrderDate").val();
                },

            },

        ],


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
                    $("#txtdebit").text('$' + parseFloat(d[0].IncomVal).toFixed(2)); $("#txtcredit").text('$' + parseFloat(d[0].ExpenseVal).toFixed(2)); $("#txtbalance").text('$' + parseFloat(d[0].prls).toFixed(2))
                }
            }
        },
        error: function (msg) {

        }
    });
}