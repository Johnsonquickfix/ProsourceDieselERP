$(document).ready(function () {
    $("#loader").hide();
    $.when(globallastyear('year'), globalnextyear('nextyear'), months()).done(function () { Search(); });
    $(document).on('click', "#btnsearch", function () {

        var montharray = $('#ddlmonth option:selected').toArray().map(item => item.value);
        console.log(montharray.length);

        if ($("#year").val() == "") {
            swal('Alert', 'Please select year', 'error').then(function () { swal.close(); $('#year').focus(); });
        }
        else if ($("#ddlmonth").val() == "") {
            swal('Alert', 'Please select month', 'error').then(function () { swal.close(); $('#ddlmonth').focus(); });
        }
        else if (montharray.length != 3) {
            swal('Alert', 'Please select  three months', 'error').then(function () { swal.close(); $('#ddlmonth').focus(); });
        }
        else {

            Search();
            return false;
        }
        //ProductDataList();
    });
    $('.select2').select2();
    months();
});

//Years start
function globalnextyear(yearcount) {
    var currentYear = new Date().getFullYear() + 1;
    var yearSelect = document.getElementById(yearcount);
    for (var i = 0; i < 2; i++) {
        var isSelected = currentYear === currentYear
        yearSelect.options[yearSelect.options.length] = new Option(currentYear - i, currentYear - i, isSelected, isSelected);
    }
}
//Years end
function globallastyear(yearcount) {
    var currentYear = new Date().getFullYear() - 1;
    var yearSelect = document.getElementById(yearcount);
    for (var i = 0; i < 4; i++) {
        var isSelected = currentYear === currentYear - i
        yearSelect.options[yearSelect.options.length] = new Option(currentYear - i, currentYear - i, isSelected, isSelected);
    }
}


function months() {
    var vals = ["10", "11", "12"];
    $("#ddlmonth").val(vals).trigger("change");
}
function Search() {
    let sd = 'sd'; //$('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = 'ed';//$('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let Year = $("#year").val();
    var NextYear = $("#nextyear").val();
    var account = '1';
    // var type = $('#ddltype').val();
    var montharray = $('#ddlmonth option:selected').toArray().map(item => item.value);
    let month1 = parseInt(montharray[0]);
    let month2 = parseInt(montharray[1]);
    let month3 = parseInt(montharray[2]);
    var numberRenderer = $.fn.dataTable.render.number(',', '.', 2,).display;
    if (account == "0") { swal('alert', 'Please select Payment Type', 'error'); }

    //else if (type == "0") { swal('alert', 'Please select Type', 'error'); }
    else {
        $('#dtdata').DataTable({
            destroy: true,
            "scrollX": true,
            searching: false,
            lengthMenu: [[12, 20, 50], [12, 20, 50]],
            "ajax": {
                "url": '/Reports/Getorderforecastmonthvise',
                "type": 'POST',
                "dataType": 'json',
                "data": { Month: Year, Year: ed, Type: account, Month1: month1, Month2: month2, Month3: month3}
                //"data": JSON.stringify(obj)

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

                $(api.column(1).footer()).html('Grand total');
                $(api.column(2).footer()).html('$' + numberRenderer(sales));
                $(api.column(3).footer()).html('$' + numberRenderer(forecastales));
            },
            "columns": [

                { data: 'tax', title: '#', 'sWidth': "5%" },

                {
                    data: 'tax', title: 'Month Name', sWidth: "10%", render: function (data, type, row) {
                        if (data == '1') return 'January';
                        else if (data == '2') return 'February';
                        else if (data == '3') return 'March';
                        else if (data == '4') return 'April';
                        else if (data == '5') return 'May';
                        else if (data == '6') return 'June';
                        else if (data == '7') return 'July';
                        else if (data == '8') return 'August';
                        else if (data == '9') return 'September';
                        else if (data == '10') return 'October';
                        else if (data == '11') return 'November';
                        else if (data == '12') return 'December';
                        else return '-';
                    }
                },
              
                { data: 'Discount', title: 'Sales Total (' + Year + ')', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'fee', title: 'Forecast Sales (' + NextYear +')', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },


            ],
            columnDefs: [{
                orderable: false,
                data: null,
                defaultContent: '',
            }],

            "order": [0, 'asc'],

            "dom": 'Bfrtip',
            "buttons": [

                {
                    extend: 'csv',
                    className: 'button',
                    text: '<i class="fas fa-file-csv"></i> CSV',
                    filename: function () {
                        var from = 'Calculation Forecasts - ' + $("#year").val();
                        //var to = $("#year").val().replaceAll('/', '.');
                        return from;
                    },
                },

            ],

        });
    }
}

