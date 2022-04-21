function ImportPoList() {
    var urid = $("#ddltype").val();
    ID = $("#hfid").val();

    var table_EL = $('#EmailListdata').DataTable({

        columnDefs: [{ "orderable": true, "targets": 1 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,  
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
        sAjaxSource: "/ImportOrderinvoice/GetCompareSalesPO",
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
    //        { data: 'vendorname', title: 'Vendor', sWidth: "2%" },
    //        { data: 'document_id', title: 'Document', sWidth: "5%" },
    //        { data: 'podatesort', title: 'DocDate', sWidth: "5%", render: function (inv_num, type, full, meta) { return full.po_date; } },
    //        { data: 'payer_id', title: 'Payer', sWidth: "5%" },
    //        { data: 'payer_name', title: 'Payer Name', sWidth: "5%" },
    //        { data: 'ref_doc', title: 'Ref doc', sWidth: "5%" },
    //        { data: 'sales_doc', title: 'Sales Doc', sWidth: "5%" },
    ///*        { data: 'item', title: 'Item', sWidth: "5%" },*/
    //        //{ data: 'material_number', title: 'Material', sWidth: "5%" },
    //        { data: 'material_description', title: 'Material Description', sWidth: "5%" },
    //        { data: 'pint', title: 'Plnt', sWidth: "5%" },
    //        { data: 'po_number', title: 'Purchase order number', sWidth: "5%" },
    //        { data: 'bol', title: 'BoL', sWidth: "2%" },
    //        { data: 'net_amount', title: 'Net amount', sWidth: "2%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
    //        { data: 'freight_charge', title: 'Freight Ch', sWidth: "2%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
    //        { data: 'sales_tax', title: 'Sales Tax', sWidth: "2%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
    //        { data: 'total_amount', title: 'Total Amout', sWidth: "2%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
    //        //{ data: 'cmir', title: 'CMIR', sWidth: "2%" },
    //        //{ data: 'tracking_number', title: 'Tracking N', sWidth: "2%" },
    //        { data: 'name', title: 'Name', sWidth: "2%" },
    //        { data: 'street', title: 'Street', sWidth: "2%" },
    //        { data: 'city', title: 'City', sWidth: "2%" },
    //        { data: 'state', title: 'State', sWidth: "2%" },
    //        { data: 'zipcode', title: 'Zipcode', sWidth: "2%" },
       
    //        //{ data: 'cr_dr_memo_text', title: 'Credit Debit Memo Text', sWidth: "2%" },
            { data: 'vendorname', title: 'Vendor', sWidth: "13%" },
            { data: 'document_id', title: 'Document', sWidth: "13%" },
            { data: 'podatesort', title: 'DocDate', sWidth: "13%", render: function (inv_num, type, full, meta) { return full.po_date; } },
            /* { data: 'payer_id', title: 'Payer', sWidth: "5%" },*/
            { data: 'payer_name', title: 'Payer Name', sWidth: "13%" },
            /*{ data: 'ref_doc', title: 'Ref doc', sWidth: "13%" },*/
            { data: 'sales_doc', title: 'Sales Doc', sWidth: "9%" },
            //{ data: 'item', title: 'Item', sWidth: "5%" },
            //{ data: 'material_number', title: 'Material', sWidth: "5%" },
            { data: 'material_description', title: 'Material Description', sWidth: "13%" },
            /*  { data: 'pint', title: 'Plnt', sWidth: "5%" },*/
            { data: 'po_number', title: 'Purchase order number', sWidth: "13%" },
            /*{ data: 'bol', title: 'BoL', sWidth: "13%" },*/
            { data: 'net_amount', title: 'Net amount', sWidth: "13%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            { data: 'freight_charge', title: 'Freight Ch', sWidth: "13%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            { data: 'sales_tax', title: 'Sales Tax', sWidth: "13%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            { data: 'total_amount', title: 'Total Amout', sWidth: "13%", render: $.fn.dataTable.render.number(',', '.', 2, '$') },

            { data: 'Applied', title: 'Applied', sWidth: "2%" }

        ]
    });
}


function updateinvoice() {    
    var obj = { strValue1: 0 }
    swal({ title: "", text: 'Would you like to generate an invoice?', type: "question", showCancelButton: true })
        .then((result) => {
            if (result.value) {
                $.ajax({
                    url: '/ImportOrderinvoice/updateinvoice/', dataType: 'json', type: 'Post',
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(obj),
                    dataType: "json",
                    beforeSend: function () { $("#loader").show(); },
                    success: function (data) {
                        if (data.status == true) {
                            swal('Success!', data.message, 'success');
                            ImportPoList();
                        }
                        else { swal('Alert!', data.message, 'error') }
                    },
                    complete: function () { $("#loader").hide(); },
                    error: function (error) { swal('Error!', error.message, 'error'); },
                })
            }
        });
}
    
