function ImportPoList() {
    var urid = $("#ddlSearchStatus").val();
    ID = $("#hfid").val();

    var table_EL = $('#EmailListdata').DataTable({

        columnDefs: [{ "orderable": true, "targets": 1 }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true, scrollX:true ,
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#EmailListdata_filter input').unbind();
            $('#EmailListdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/ImportOrderinvoice/GetImportPolList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: urid });
            var col = 'id';
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            //if (oSettings.aaSorting.length >= 0) {
            //    var col = oSettings.aaSorting[0][0] == 0 ? "user_id" : oSettings.aaSorting[0][0] == 1 ? "user_email" : oSettings.aaSorting[0][0] == 2 ? "status" : "id";
            //    aoData.push({ name: "sSortColName", value: col });
            //}
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            { data: 'document_id', title: 'Document', sWidth: "5%" },
            { data: 'podatesort', title: 'DocDate', sWidth: "5%", render: function (inv_num, type, full, meta) { return full.po_date; } },
            { data: 'payer_id', title: 'Payer', sWidth: "5%" },
            { data: 'payer_name', title: 'Payer Name', sWidth: "5%" },
            { data: 'ref_doc', title: 'Ref doc', sWidth: "5%" },
            { data: 'sales_doc', title: 'Sales Doc', sWidth: "5%" },
            { data: 'item', title: 'Item', sWidth: "5%" },
            //{ data: 'material_number', title: 'Material', sWidth: "5%" },
            { data: 'material_description', title: 'Material Description', sWidth: "5%" },
            { data: 'pint', title: 'Plnt', sWidth: "5%" },
            { data: 'po_number', title: 'Purchase order number', sWidth: "5%" },
            { data: 'bol', title: 'BoL', sWidth: "2%" },
            { data: 'net_amount', title: 'Net amount', sWidth: "2%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            { data: 'freight_charge', title: 'Freight Ch', sWidth: "2%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            { data: 'sales_tax', title: 'Sales Tax', sWidth: "2%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            { data: 'total_amount', title: 'Total Amout', sWidth: "2%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            //{ data: 'cmir', title: 'CMIR', sWidth: "2%" },
            //{ data: 'tracking_number', title: 'Tracking N', sWidth: "2%" },
            { data: 'name', title: 'Name', sWidth: "2%" },
            { data: 'street', title: 'Street', sWidth: "2%" },
            { data: 'city', title: 'City', sWidth: "2%" },
            { data: 'state', title: 'State', sWidth: "2%" },
            { data: 'zipcode', title: 'Zipcode', sWidth: "2%" },
            //{ data: 'destination_country', title: 'Dest Coun', sWidth: "2%" },
            //{ data: 'cr_dr_memo_text', title: 'Credit Debit Memo Text', sWidth: "2%" },
            { data: 'vendorname', title: 'Vendor..', sWidth: "2%" }
        ]
    });
}

function getVendor() {
    $.ajax({
        url: "/PurchaseOrder/GetVendor",
        type: "Get",
        success: function (data) {
            $('#ddlVendor').append('<option value="-1">Please Select Vendor</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddlVendor').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}