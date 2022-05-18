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
    var table_JD = $('#OpeningProductStock').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        //sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true,
        bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true,
        lengthMenu: [[ 20, 50], [ 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#OpeningProductStock_filter input').unbind();
            $('#OpeningProductStock_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_JD.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Product/GetProductOpeningStock",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            //aoData.push({ name: "strValue1", value: monthYear });
            aoData.push({ name: "strValue1", value: '' });
            aoData.push({ name: "strValue2", value: '' });             
            var col = 'product_id';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 1 ? "Name" : oSettings.aaSorting[0][0] == 2 ? "op_date" : oSettings.aaSorting[0][0] == 3 ? "op_qty" : oSettings.aaSorting[0][0] == 4 ? "op_rate" : "product_id";
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
            { data: 'product_id', title: 'ProductID', sWidth: "10%" },
            { data: 'Name', title: 'Product', sWidth: "40%" },
            { data: 'op_date', title: 'Opening Date', sWidth: "10%" },
            { data: 'op_qty', title: 'Opening Quantity', sWidth: "10%", },
            { data: 'op_rate', title: 'Opening Rate', sWidth: "20%" },
            { data: 'tag', title: 'Remark', sWidth: "10%" },
            {
                'data': 'product_id', sWidth: "10%",
                'render': function (id, type, full, meta) {
                    return '<span title="Click here to edit details" data-placement="bottom" data-toggle="tooltip"><a href="../Product/AddProductOpeningStock/' + id + '" onclick="ActivityLog(\'Edit\',\'Product/' + id + '\');"><i class="glyphicon glyphicon-pencil"></i></a></span>';
                }
            },
        ]
    });
}