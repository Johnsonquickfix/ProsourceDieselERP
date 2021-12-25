let yearcount='';
function globalyear(yearcount) {
    var currentYear = new Date().getFullYear();
    var yearSelect = document.getElementById(yearcount);
    for (var i = -2; i < 5; i++) {
        var isSelected = currentYear === currentYear - i
        yearSelect.options[yearSelect.options.length] = new Option(currentYear - i, currentYear - i, isSelected, isSelected);
    }
}