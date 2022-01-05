let yearcount='';
function globalyear(yearcount) {
    var currentYear = new Date().getFullYear();
    var yearSelect = document.getElementById(yearcount);
    for (var i = -1; i < 5; i++) {
        var isSelected = currentYear === currentYear - i
        yearSelect.options[yearSelect.options.length] = new Option(currentYear - i, currentYear - i, isSelected, isSelected);
    }
}

function globallastyear(yearcount) {
    var currentYear = new Date().getFullYear()-1;
    var yearSelect = document.getElementById(yearcount);
    for (var i = -1; i < 5; i++) {
        var isSelected = currentYear === currentYear - i
        yearSelect.options[yearSelect.options.length] = new Option(currentYear - i, currentYear - i, isSelected, isSelected);
    }
}

function globalcurrentyear(yearcount) {
    var currentYear = new Date().getFullYear();
    var yearSelect = document.getElementById(yearcount);
    for (var i = -0; i < 5; i++) {
        var isSelected = currentYear === currentYear - i
        yearSelect.options[yearSelect.options.length] = new Option(currentYear - i, currentYear - i, isSelected, isSelected);
    }
} 