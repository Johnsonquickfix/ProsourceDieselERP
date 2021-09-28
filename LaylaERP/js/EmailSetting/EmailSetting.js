$(document).ready(function () {
    dataGridLoad();
});
function dataGridLoad() {

    //var types = $('#ddltype').val();
    //let prodctype = $('#ddlproducttype').val();
    //let stockstatus = $('#ddstockstatus').val();

    $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        //sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true,
        bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true,
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        sAjaxSource: "/Product/GetShippinfclassList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            //aoData.push({ name: "strValue1", value: monthYear });
            aoData.push({ name: "strValue1", value: '' });
            aoData.push({ name: "strValue2", value: '' });
            aoData.push({ name: "strValue3", value: '' });
            aoData.push({ name: "strValue4", value: '' });
            var col = 'rowid';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "ShipName" : oSettings.aaSorting[0][0] == 1 ? "Country" : oSettings.aaSorting[0][0] == 2 ? "State" : oSettings.aaSorting[0][0] == 3 ? "Method" : oSettings.aaSorting[0][0] == 4 ? "Shipping_price" : oSettings.aaSorting[0][0] == 5 ? "Type" : "rowid";
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
        columns: [
            //{
            //    'data': 'rowid', sWidth: "5%   ",
            //    'render': function (data, type, full, meta) {
            //        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck(this);" value="' + $('<div/>').text(data).html() + '"><label></label>';
            //    }
            //},

            { data: 'ShipName', title: 'Shipping Class', sWidth: "12%" },
            { data: 'Country', title: 'Country', sWidth: "12%" },
            { data: 'State', title: 'State', sWidth: "12%" },
            { data: 'Method', title: 'Method', sWidth: "12%" },
            /*{ data: 'Shipping_price', title: 'Price', sWidth: "12%" },*/
            {
                data: 'Shipping_price', title: 'Price', sWidth: "12%", render: function (data, type, row) {
                    var tprice = 'toFormat';
                    tprice = '$' + row.Shipping_price;
                    return tprice
                }
            },
            { data: 'Type', title: 'Cost Type', sWidth: "12%" },
            { data: 'taxable', title: 'Taxable', sWidth: "12%" },
            // { data: 'Shipping_taxrate', title: 'TaxCost', sWidth: "12%" },


            {
                'data': 'rowid', title: 'Action', sWidth: "5%",
                'render': function (id, type, full, meta) {
                    return '<a href="#" title="Click here to Edit" onClick="EditData(' + id + ');" data-toggle="tooltip"><i class="glyphicon glyphicon-eye-open"></i></a>'


                }
            }
        ]
    });
}