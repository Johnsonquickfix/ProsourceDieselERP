$(document).ready(function () {
    $("#loader").hide();
    $.when(globallastyear('year'), globalnextyear('nextyear')).done(function () { Search(); });

});


function globalnextyear(yearcount) {
    var currentYear = new Date().getFullYear() + 1;
    var yearSelect = document.getElementById(yearcount);
    for (var i = 0; i < 2; i++) {
        var isSelected = currentYear === currentYear
        yearSelect.options[yearSelect.options.length] = new Option(currentYear - i, currentYear - i, isSelected, isSelected);
    }
}
function globallastyear(yearcount) {
    var currentYear = new Date().getFullYear() - 1;
    var yearSelect = document.getElementById(yearcount);
    for (var i = -0; i < 5; i++) {
        var isSelected = currentYear === currentYear - i
        yearSelect.options[yearSelect.options.length] = new Option(currentYear - i, currentYear - i, isSelected, isSelected);
    }
}
function Search() {
    let sd = 'sd'; //$('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = 'ed';//$('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let Year = $("#year").val();
    var NextYear = $("#nextyear").val();
    var account = '1';
    // var type = $('#ddltype').val();
    if (account == "0") { swal('alert', 'Please select Payment Type', 'error'); }
    //else if (type == "0") { swal('alert', 'Please select Type', 'error'); }
    else {
        $('#dtdata').DataTable({
            destroy: true,
            "scrollX": true,
            searching: false,
            lengthMenu: [[12, 20, 50], [12, 20, 50]],
            "ajax": {
                "url": '/Reports/Getorderforecast',
                "type": 'POST',
                "dataType": 'json',
                "data": { Month: Year, Year: ed, Type: account }
                //"data": JSON.stringify(obj)

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
              
                { data: 'Discount', title: 'Order Total (' + Year + ')', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
                { data: 'fee', title: 'Forecast Order (' + NextYear +')', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },


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

