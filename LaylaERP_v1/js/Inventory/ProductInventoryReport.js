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
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'left', orientation: "left auto"
    }, function (start, end, label) {
        InventoryReport(true);
    });
    InventoryReport(true);
})

function InventoryReport(is_date) {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD'); 
    $('#dtdata').DataTable({

        destroy: true, bProcessing: true, bServerSide: true,
        //sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true,
        order: [[0, "desc"]],
        bAutoWidth: false, scrollX: false, scrollY: ($(window).height() - 215),
        responsive: true,
        dom: 'lBftip', buttons: [{ extend: 'excelHtml5', title: 'Product In-Hand Inventory Report', action: function (e, dt, button, config) { ExportList(); } }
         ],
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        sAjaxSource: "/Inventory/GetOnhandInventoryList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            //aoData.push({ name: "strValue1", value: monthYear });
            aoData.push({ name: "strValue1", value: '' });
            aoData.push({ name: "strValue2", value: '' });
            aoData.push({ name: "strValue3", value: '' });
            aoData.push({ name: "strValue4", value: '' });
            aoData.push({ name: "strValue5", value: sd });
            aoData.push({ name: "strValue6", value: ed });
            var col = 'id';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "id" : oSettings.aaSorting[0][0] == 1 ? "category" : oSettings.aaSorting[0][0] == 2 ? "post_title" : "id";
                aoData.push({ name: "sSortColName", value: col });
            }
            //console.log(aoData);
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            { data: 'id', title: 'Id', sWidth: "5%", },
            { data: 'post_title', title: 'Product', sWidth: "20%", class: "text-left" },
            { data: 'sku', title: 'SKU', sWidth: "10%", class: "text-left" },
            {
                data: 'stock', title: 'Qty On Hand', sWidth: "10%", className: "text-right", render: function (data, type, row) { return (row.op_stock + row.stock - row.SaleUnits).toFixed(0) }
            },
            { data: 'UnitsinPO', title: 'Qty PO', sWidth: "10%", class: "text-right" },
            { data: 'Damage', title: 'Qty Damage', sWidth: "10%", class: "text-right" },
        ]
        //columnDefs: [{ targets: [0], visible: false, searchable: false }]
    });
}


function ExportList() {  
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD'); 
    var table = $('#dtdata').DataTable();
    var currentSearchValue = table.search(); 
    let option = { strValue1: '', strValue2: '', strValue3: '', strValue4: '', strValue5: sd, strValue6: ed, sSearch: currentSearchValue };     
    $("#loader").show();
    setTimeout(function () { $("#loader").hide(); }, 2000);
    postForm(option, '/inventory/on-hand-inventory-export');
}
function postForm(parameters, url) {
    // generally we post the form with a blank action attribute
    if ('undefined' === typeof url) { url = ''; }
    var getForm = function (url, values) {
        values = removeNulls(values);
        var form = $('<form>').attr("method", 'POST').attr("action", url);
        iterateValues(values, [], form, null);
        return form;
    };
    var removeNulls = function (values) {
        var propNames = Object.getOwnPropertyNames(values);
        for (var i = 0; i < propNames.length; i++) {
            var propName = propNames[i];
            if (values[propName] === null || values[propName] === undefined) {
                delete values[propName];
            } else if (typeof values[propName] === 'object') {
                values[propName] = removeNulls(values[propName]);
            } else if (values[propName].length < 1) {
                delete values[propName];
            }
        }
        return values;
    };

    var iterateValues = function (values, parent, form, isArray) {
        var i, iterateParent = [];
        Object.keys(values).forEach(function (i) {
            if (typeof values[i] === "object") {
                iterateParent = parent.slice();
                iterateParent.push(i);
                iterateValues(values[i], iterateParent, form, Array.isArray(values[i]));
            } else {
                form.append(getInput(i, values[i], parent, isArray));
            }
        });
    };

    var getInput = function (name, value, parent, array) {
        var parentString;
        if (parent.length > 0) {
            parentString = parent[0];
            var i;
            for (i = 1; i < parent.length; i += 1) {
                parentString += "[" + parent[i] + "]";
            }

            if (array) {
                name = parentString + "[" + name + "]";
            } else {
                name = parentString + "[" + name + "]";
            }
        }

        return $("<input>").attr("type", "hidden").attr("name", name).attr("value", value);
    };


    //----------------------------------------
    // NOW THE SYNOPSIS
    //----------------------------------------
    var generatedForm = getForm(url, parameters);

    $('body').append(generatedForm);
    generatedForm.submit();
    generatedForm.remove();
}