$(document).ready(function () {
    $("#loader").hide();
    $('.select2').select2();
    //$("#btnReset").click(function () { resetdamagestock(); })
    
    //$("#txtdamageeatbydate").datepicker({
       // format: 'mm-dd-yyyy',
   // }).datepicker('setDate', 'now');
    //$("#btnAdd").click(function () { AddDamagestock(); });
    //$("#btnUpdate").click(function () { UpdateDamagestock(); })
    //$("#btnupload").click(function () { fileupload(); })
    StockOpeningGrid();

})


function StockOpeningGrid() {
    var urid = parseInt($("#ddlSearchStatus").val());
    ID = $("#hfid").val();
    let table_JD = $('#OpeningProductStock').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }, { targets: [0], visible: false }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[20, 50], [20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#DamageProductData_filter input').unbind();
            $('#DamageProductData_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_JD.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Product/GetProductOpeningStock/",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: ID });
            aoData.push({ name: "strValue2", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }

            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            { data: 'product_id', title: 'ProductID', sWidth: "10%" },            
            { data: 'op_date', title: 'Opening Date', sWidth: "20%" },
            { data: 'op_qty', title: 'Opening Quantity', sWidth: "20%", },
            { data: 'op_rate', title: 'Opening Rate', sWidth: "20%" },
            { data: 'tag', title: 'Remark', sWidth: "20%" },
            {
                'data': 'product_id', sWidth: "10%",
                'render': function (id, type, full, meta) {
                    return '<span title="Click here to edit details" data-placement="bottom" data-toggle="tooltip"><a href="../Product/UpdateProductStock/' + id + '" onclick="ActivityLog(\'Edit\',\'Product/' + id + '\');"><i class="glyphicon glyphicon-pencil"></i></a></span>';
                }
            },
        ]
    });
}