$(document).ready(function () { 
    $("#loader").hide(); //$('.select2').select2();
    $('#txtDate').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'This Year': [moment().startOf('year'), moment().endOf('year')]
        },
        startDate: moment().subtract(1, 'month'), autoUpdateInput: true, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'left', orientation: "left auto"
    }, function (start, end, label) {
        $('#txtDate').val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
        // ProductGrid();
        $.when(ProductGrid()).done(function () { GenratedProductGrid(); Search(); Searchproduct();});
    });
    $('#txtDate').val('');
    $('#txtDate').on('cancel.daterangepicker', function (ev, picker) { $(this).val(''); $.when(ProductGrid()).done(function () { GenratedProductGrid(); Search(); Searchproduct();}); });
    $.when(ProductGrid()).done(function () { GenratedProductGrid(); });
    //ProductGrid(); GenratedProductGrid();
    filldropdown();
    $("#ddlpofill").change(function () { setTimeout(function () { fillbatchno($("#ddlpofill").val()); }, 50); return false; });
    $("#ddlpofillorder").change(function () { setTimeout(function () { fillbatchnoorder($("#ddlpofillorder").val()); }, 50); return false; });
    $(".select2").select2();

    //$('.nav-tabs a[href="#tab_23"]').on('shown.bs.tab', function (e) {
    //    filldropdown();
    //    $("#ddlbatchno").empty();
    //    $("#ddlbatchno").html('<option value="0">Select Batch No.</option>');
    //}); 
});
 
function ProductGrid() {
    let urid = $("#txtorderpono").val();
    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };
    let table = $('#dtdata').DataTable({
        /*   columnDefs: [{ "orderable": false, "targets": 0 }], order: [[0, "asc"]],*/
        columnDefs: [], order: [[0, "asc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false,  scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[20, 40, 60, 100], [20, 40, 60, 100]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        //initComplete: function () {
        //    $('.dataTables_filter input').unbind();
        //    $('.dataTables_filter input').bind('keyup', function (e) {
        //        var code = e.keyCode || e.which;
        //        if (code == 13) { table.search(this.value).draw(); }
        //    });
        //},
        initComplete: function () {
            $('#dtdata_filter input').unbind();
            $('#dtdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Reception/GetProductReceiveList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed });
            aoData.push({ name: "strValue3", value: urid }, { name: "strValue4", value: 'SERCH' });
            var col = 'order_id';
            if (oSettings.aaSorting.length > 0) {
                //var col = oSettings.aaSorting[0][0] == 2 ? "refordervendor" : oSettings.aaSorting[0][0] == 3 ? "vendor_name" : oSettings.aaSorting[0][0] == 4 ? "vendor_name" : oSettings.aaSorting[0][0] == 5 ? "city" : oSettings.aaSorting[0][0] == 6 ? "zip" : oSettings.aaSorting[0][0] == 6 ? "date_livraison" : oSettings.aaSorting[0][0] == 7 ? "Status" : "ref";
                aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data });

            }
            //console.log(aoData);
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            {
                data: 'ref', title: 'PO No', sWidth: "10%", render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    return  row.ref + '<a title="Click here to view order preview" data-toggle="tooltip" href="#" onclick="getPurchaseOrderPrint(' + row.id + ', false);"><i class="fas fa-search-plus"></i></a>';

                }
            },
            { data: 'date_creation', title: 'Order Date', sWidth: "10%" },
            { data: 'tagno', title: 'Tag/Lot/Batch No', sWidth: "10%" },
       
            { data: 'display', title: 'Product Name', sWidth: "15%" },

        
            //{
            //    data: 'refordervendor', title: 'Invoice No', sWidth: "10%", 'render': function (id, type, full, meta) {
            //        let str_inv = '<a title="Click here to view invoice preview" data-toggle="tooltip"  href="#" onclick="getInvoicePrint(' + full.id + '); "><i class="fas fa - search - plus"></i>' + id + '</a>';
            //        return str_inv;
            //    }
            //},
         
            { data: 'Quenty', title: 'Quantity', sWidth: "10%" },
            //{ data: 'vendor_name', title: 'Vendor Name', sWidth: "10%" },
            {
                'data': 'ReceiveID', sWidth: "10%", "bSearchable": false,
                'render': function (ID, type, full, meta) {

                    return '<a href="javascript:void(0);" class="badge bg-orange" onClick="allotserial(' + ID + '); " data-toggle="tooltip" title="Generate serial">Generate <a>';
                }
            },
        ],

    });
}
function fillbatchno(id) {
    let option = { strValue1: id, strValue2: 0 };
    $.ajax({
        url: "/Reception/Getbatchnobypurchaseid", data: option, type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            //Payment Terms
            $("#ddlbatchno").html('<option value="0">Select Batch No.</option>');
            for (i = 0; i < dt['Table'].length; i++) { $("#ddlbatchno").append('<option value="' + dt['Table'][i].id + '">' + dt['Table'][i].text + '</option>'); }

        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }, async: false
    });
     
   
}

function fillbatchnoorder(id) {
    console.log(id);
    let option = { strValue1: id, strValue2: 0 };
    $.ajax({
        url: "/Reception/Getbatchnobypurchaseid", data: option, type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            //Payment Terms
            $("#ddlbatchnoorder").html('<option value="0">Select Batch No.</option>');
            for (i = 0; i < dt['Table'].length; i++) { $("#ddlbatchnoorder").append('<option value="' + dt['Table'][i].id + '">' + dt['Table'][i].text + '</option>'); }

        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }, async: false
    });


}

 
function filldropdown() {
    $.ajax({
        url: "/Reception/Getserealpo",
        type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            //Product
            $("#ddlpofill").html('<option value="0">Select Purchases Order</option>');
            for (i = 0; i < dt['Table'].length; i++) { $("#ddlpofill").append('<option value="' + dt['Table'][i].id + '">' + dt['Table'][i].text + '</option>'); }

            $("#ddlproduct").html('<option value="0">Select Product</option>');
            for (i = 0; i < dt['Table1'].length; i++) { $("#ddlproduct").append('<option value="' + dt['Table1'][i].id + '">' + dt['Table1'][i].text + '</option>'); }

            $("#ddlpofillorder").html('<option value="0">Select Purchases Order</option>');
            for (i = 0; i < dt['Table'].length; i++) { $("#ddlpofillorder").append('<option value="' + dt['Table'][i].id + '">' + dt['Table'][i].text + '</option>'); }

            $("#ddlproductorder").html('<option value="0">Select Product</option>');
            for (i = 0; i < dt['Table1'].length; i++) { $("#ddlproductorder").append('<option value="' + dt['Table1'][i].id + '">' + dt['Table1'][i].text + '</option>'); }

        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }
    });
}
function GenratedProductGrid() {
    let urid = $("#txtorderpono").val();
    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };
    let gentable = $('#dtdatagenrated').DataTable({
        /*   columnDefs: [{ "orderable": false, "targets": 0 }], order: [[0, "asc"]],*/
        columnDefs: [], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[20, 40, 60, 100], [20, 40, 60, 100]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        //initComplete: function () {
        //    $('.dtdatagenrated_filter input').unbind();
        //    $('.dtdatagenrated_filter input').bind('keyup', function (e) {
        //        var code = e.keyCode || e.which;
        //        if (code == 13) { gentable.search(this.value).draw(); }
        //    });
        //},
        initComplete: function () {
            $('#dtdatagenrated_filter input').unbind();
            $('#dtdatagenrated_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { gentable.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Reception/GetProductReceiveList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed });
            aoData.push({ name: "strValue3", value: urid }, { name: "strValue4", value: 'GENCH' });
            var col = 'order_id';
            if (oSettings.aaSorting.length > 0) {
                //var col = oSettings.aaSorting[0][0] == 2 ? "refordervendor" : oSettings.aaSorting[0][0] == 3 ? "vendor_name" : oSettings.aaSorting[0][0] == 4 ? "vendor_name" : oSettings.aaSorting[0][0] == 5 ? "city" : oSettings.aaSorting[0][0] == 6 ? "zip" : oSettings.aaSorting[0][0] == 6 ? "date_livraison" : oSettings.aaSorting[0][0] == 7 ? "Status" : "ref";
                aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data });

            }
            //console.log(aoData);
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            {
                data: 'ref', title: 'PO No', class: 'text-left', sWidth: "10%", render: function (data, type, row) {
                    return row.ref + '<a title="Click here to view order preview" data-toggle="tooltip" href="#" onclick="getPurchaseOrderPrint(' + row.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'date_creation', title: 'Order Date', sWidth: "10%" },
            { data: 'tagno', title: 'Tag/Lot/Batch No', sWidth: "10%" },
            { data: 'display', title: 'Product Name', sWidth: "15%" },
            { data: 'Quenty', title: 'Quantity', sWidth: "10%" },
            { data: 'cost_price_cogs', title: 'Cost Price(Batch)', sWidth: "10%" },

        ],

    });
}

function Reload() {
    filldropdown();
    $("#ddlbatchno").empty();
    $("#ddlbatchno").html('<option value="0">Select Batch No.</option>');
    $('#dtdatalisting').DataTable().clear().destroy();
   // Search();
    
}

function Search() {

    let batchnoid = $("#ddlbatchno").val();
    let pofillid = $("#ddlpofill").val();
  

    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };

    if (batchnoid != '0' && pofillid != '0') {
       let gentable = $('#dtdatalisting').DataTable({
        /*   columnDefs: [{ "orderable": false, "targets": 0 }], order: [[0, "asc"]],*/
        columnDefs: [], order: [[3, "asc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[20, 40, 60, 100], [20, 40, 60, 100]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        //initComplete: function () {
        //    $('.dtdatagenrated_filter input').unbind();
        //    $('.dtdatagenrated_filter input').bind('keyup', function (e) {
        //        var code = e.keyCode || e.which;
        //        if (code == 13) { gentable.search(this.value).draw(); }
        //    });
        //},
        initComplete: function () {
            $('#dtdatalisting_filter input').unbind();
            $('#dtdatalisting_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { gentable.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/Reception/GetProductReceiveList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed });
            aoData.push({ name: "strValue3", value: '' }, { name: "strValue4", value: 'GENLT' }, { name: "strValue5", value: batchnoid });
            var col = 'order_id';
            if (oSettings.aaSorting.length > 0) {
                //var col = oSettings.aaSorting[0][0] == 2 ? "refordervendor" : oSettings.aaSorting[0][0] == 3 ? "vendor_name" : oSettings.aaSorting[0][0] == 4 ? "vendor_name" : oSettings.aaSorting[0][0] == 5 ? "city" : oSettings.aaSorting[0][0] == 6 ? "zip" : oSettings.aaSorting[0][0] == 6 ? "date_livraison" : oSettings.aaSorting[0][0] == 7 ? "Status" : "ref";
                aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data });

            }
            //console.log(aoData);
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            
           /* { data: 'order_date', class: 'text-left', title: 'Date', sWidth: "10%" },*/
            { data: 'productname', class: 'text-left',title: 'Product Name', sWidth: "10%" },
            { data: 'sku', title: 'SKU', sWidth: "15%" },
            { data: 'warehouse_name', title: 'Warehouse Name', sWidth: "10%" },
            { data: 'serial_no', title: 'Serial No', sWidth: "10%" },
            //{ data: 'receive_qty', title: 'Receive Qty', sWidth: "10%" },
            //{ data: 'order_qty', title: 'Order Qty', sWidth: "10%" },
            { data: 'status', title: 'Status', sWidth: "10%" },
            { data: 'issue_order_no', title: 'Issue No.', sWidth: "10%" },

        ],

    });
    }
    else {
 
        $('#dtdatalisting').DataTable().clear().destroy();
    }
    
}

function Searchproduct() {

    let productid = $("#ddlproduct").val();
 


    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };

    if (productid != '0') {
        let gentable = $('#dtdatalisting').DataTable({
            /*   columnDefs: [{ "orderable": false, "targets": 0 }], order: [[0, "asc"]],*/
            columnDefs: [], order: [[3, "asc"]],
            destroy: true, bProcessing: true, bServerSide: true,
            bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
            responsive: true, lengthMenu: [[20, 40, 60, 100], [20, 40, 60, 100]],
            language: {
                lengthMenu: "_MENU_ per page",
                zeroRecords: "Sorry no records found",
                info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
                infoFiltered: "",
                infoEmpty: "No records found",
                processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
            },
            //initComplete: function () {
            //    $('.dtdatagenrated_filter input').unbind();
            //    $('.dtdatagenrated_filter input').bind('keyup', function (e) {
            //        var code = e.keyCode || e.which;
            //        if (code == 13) { gentable.search(this.value).draw(); }
            //    });
            //},
            initComplete: function () {
                $('#dtdatalisting_filter input').unbind();
                $('#dtdatalisting_filter input').bind('keyup', function (e) {
                    var code = e.keyCode || e.which;
                    if (code == 13) { gentable.search(this.value).draw(); }
                });
            },
            sAjaxSource: "/Reception/GetProductReceiveList",
            fnServerData: function (sSource, aoData, fnCallback, oSettings) {
                aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed });
                aoData.push({ name: "strValue3", value: '' }, { name: "strValue4", value: 'PUDLT' }, { name: "strValue5", value: productid });
                var col = 'order_id';
                if (oSettings.aaSorting.length > 0) {
                    //var col = oSettings.aaSorting[0][0] == 2 ? "refordervendor" : oSettings.aaSorting[0][0] == 3 ? "vendor_name" : oSettings.aaSorting[0][0] == 4 ? "vendor_name" : oSettings.aaSorting[0][0] == 5 ? "city" : oSettings.aaSorting[0][0] == 6 ? "zip" : oSettings.aaSorting[0][0] == 6 ? "date_livraison" : oSettings.aaSorting[0][0] == 7 ? "Status" : "ref";
                    aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data });

                }
                //console.log(aoData);
                oSettings.jqXHR = $.ajax({
                    dataType: 'json', type: "GET", url: sSource, data: aoData,
                    "success": function (data) {
                        let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                        return fnCallback(dtOption);
                    }
                });
            },
            aoColumns: [

                /* { data: 'order_date', class: 'text-left', title: 'Date', sWidth: "10%" },*/
                { data: 'productname', class: 'text-left', title: 'Product Name', sWidth: "10%" },
                { data: 'sku', title: 'SKU', sWidth: "15%" },
                { data: 'warehouse_name', title: 'Warehouse Name', sWidth: "10%" },
                { data: 'serial_no', title: 'Serial No', sWidth: "10%" },
                //{ data: 'receive_qty', title: 'Receive Qty', sWidth: "10%" },
                //{ data: 'order_qty', title: 'Order Qty', sWidth: "10%" },
                { data: 'status', title: 'Status', sWidth: "10%" },
                { data: 'issue_order_no', title: 'Issue No.', sWidth: "10%" },

            ],

        });
    }
    else {

        $('#dtdatalisting').DataTable().clear().destroy();
    }

}
 
function allotserial(id) {
    var obj = { strVal: id }
    swal.queue([{
        title: '', confirmButtonText: 'Yes, update it!', text: "Do you want to generate?",
        showLoaderOnConfirm: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                $.ajax({
                    url: '/Reception/allotserial/', dataType: 'json', type: 'Post',
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(obj),
                    dataType: "json",
                    success: function (data) {
                        if (data.status == true) {
                            swal('Success!', data.message, 'success').then((result) => { ProductGrid(); GenratedProductGrid(); $('.nav-tabs a[href="#tab_22"]').tab('show');});
                        }
                        else {
                            swal('Alert!', data.message, 'error')
                        }
                    },
                    error: function (error) {
                        swal('Error!', 'something went wrong', 'error');
                    },
                })
            });
        }
    }]);
}

function Reloadorder() {
    filldropdown();
    $("#ddlpofillorder").empty();
    $("#ddlbatchnoorder").html('<option value="0">Select Batch No.</option>');
    $('#dtdataorderlisting').DataTable().clear().destroy();
    // Search();

}

function Searchorder() {

    let batchnoid = $("#ddlbatchnoorder").val();
    let pofillid = $("#ddlpofillorder").val();


    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };

    if (batchnoid != '0' && pofillid != '0') {
        let gentable = $('#dtdataorderlisting').DataTable({
            /*   columnDefs: [{ "orderable": false, "targets": 0 }], order: [[0, "asc"]],*/
            columnDefs: [], order: [[3, "asc"]],
            destroy: true, bProcessing: true, bServerSide: true,
            bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
            responsive: true, lengthMenu: [[20, 40, 60, 100], [20, 40, 60, 100]],
            language: {
                lengthMenu: "_MENU_ per page",
                zeroRecords: "Sorry no records found",
                info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
                infoFiltered: "",
                infoEmpty: "No records found",
                processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
            },
            //initComplete: function () {
            //    $('.dtdatagenrated_filter input').unbind();
            //    $('.dtdatagenrated_filter input').bind('keyup', function (e) {
            //        var code = e.keyCode || e.which;
            //        if (code == 13) { gentable.search(this.value).draw(); }
            //    });
            //},
            initComplete: function () {
                $('#dtdataorderlisting_filter input').unbind();
                $('#dtdataorderlisting_filter input').bind('keyup', function (e) {
                    var code = e.keyCode || e.which;
                    if (code == 13) { gentable.search(this.value).draw(); }
                });
            },
            sAjaxSource: "/Reception/GetProductReceiveList",
            fnServerData: function (sSource, aoData, fnCallback, oSettings) {
                aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed });
                aoData.push({ name: "strValue3", value: '' }, { name: "strValue4", value: 'GENOLT' }, { name: "strValue5", value: batchnoid });
                var col = 'order_id';
                if (oSettings.aaSorting.length > 0) {
                    //var col = oSettings.aaSorting[0][0] == 2 ? "refordervendor" : oSettings.aaSorting[0][0] == 3 ? "vendor_name" : oSettings.aaSorting[0][0] == 4 ? "vendor_name" : oSettings.aaSorting[0][0] == 5 ? "city" : oSettings.aaSorting[0][0] == 6 ? "zip" : oSettings.aaSorting[0][0] == 6 ? "date_livraison" : oSettings.aaSorting[0][0] == 7 ? "Status" : "ref";
                    aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data });

                }
                //console.log(aoData);
                oSettings.jqXHR = $.ajax({
                    dataType: 'json', type: "GET", url: sSource, data: aoData,
                    "success": function (data) {
                        let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                        return fnCallback(dtOption);
                    }
                });
            },
            aoColumns: [

                /* { data: 'order_date', class: 'text-left', title: 'Date', sWidth: "10%" },*/
                { data: 'productname', class: 'text-left', title: 'Product Name', sWidth: "10%" },
                { data: 'sku', title: 'SKU', sWidth: "15%" },
                { data: 'warehouse_name', title: 'Warehouse Name', sWidth: "10%" },
                { data: 'serial_no', title: 'Serial No', sWidth: "10%" },
                //{ data: 'receive_qty', title: 'Receive Qty', sWidth: "10%" },
                //{ data: 'order_qty', title: 'Order Qty', sWidth: "10%" },
                { data: 'status', title: 'Status', sWidth: "10%" },
                /*{ data: 'issue_order_no', title: 'Order No.', sWidth: "10%" },*/
                {
                    data: 'issue_order_no', title: 'Order No.', sWidth: "10%", render: function (data, type, dtrow) {
                        return '#' + data;
                    }
                },

            ],

        });
    }
    else {

        $('#dtdataorderlisting').DataTable().clear().destroy();
    }

}

function Searchproductorder() {

    let productid = $("#ddlproductorder").val();



    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };

    if (productid != '0') {
        let gentable = $('#dtdataorderlisting').DataTable({
            /*   columnDefs: [{ "orderable": false, "targets": 0 }], order: [[0, "asc"]],*/
            columnDefs: [], order: [[3, "asc"]],
            destroy: true, bProcessing: true, bServerSide: true,
            bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
            responsive: true, lengthMenu: [[20, 40, 60, 100], [20, 40, 60, 100]],
            language: {
                lengthMenu: "_MENU_ per page",
                zeroRecords: "Sorry no records found",
                info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
                infoFiltered: "",
                infoEmpty: "No records found",
                processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
            },
            //initComplete: function () {
            //    $('.dtdatagenrated_filter input').unbind();
            //    $('.dtdatagenrated_filter input').bind('keyup', function (e) {
            //        var code = e.keyCode || e.which;
            //        if (code == 13) { gentable.search(this.value).draw(); }
            //    });
            //},
            initComplete: function () {
                $('#dtdataorderlisting_filter input').unbind();
                $('#dtdataorderlisting_filter input').bind('keyup', function (e) {
                    var code = e.keyCode || e.which;
                    if (code == 13) { gentable.search(this.value).draw(); }
                });
            },
            sAjaxSource: "/Reception/GetProductReceiveList",
            fnServerData: function (sSource, aoData, fnCallback, oSettings) {
                aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed });
                aoData.push({ name: "strValue3", value: '' }, { name: "strValue4", value: 'POUDLT' }, { name: "strValue5", value: productid });
                var col = 'order_id';
                if (oSettings.aaSorting.length > 0) {
                    //var col = oSettings.aaSorting[0][0] == 2 ? "refordervendor" : oSettings.aaSorting[0][0] == 3 ? "vendor_name" : oSettings.aaSorting[0][0] == 4 ? "vendor_name" : oSettings.aaSorting[0][0] == 5 ? "city" : oSettings.aaSorting[0][0] == 6 ? "zip" : oSettings.aaSorting[0][0] == 6 ? "date_livraison" : oSettings.aaSorting[0][0] == 7 ? "Status" : "ref";
                    aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data });

                }
                //console.log(aoData);
                oSettings.jqXHR = $.ajax({
                    dataType: 'json', type: "GET", url: sSource, data: aoData,
                    "success": function (data) {
                        let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                        return fnCallback(dtOption);
                    }
                });
            },
            aoColumns: [

                /* { data: 'order_date', class: 'text-left', title: 'Date', sWidth: "10%" },*/
                { data: 'productname', class: 'text-left', title: 'Product Name', sWidth: "10%" },
                { data: 'sku', title: 'SKU', sWidth: "15%" },
                { data: 'warehouse_name', title: 'Warehouse Name', sWidth: "10%" },
                { data: 'serial_no', title: 'Serial No', sWidth: "10%" },
                //{ data: 'receive_qty', title: 'Receive Qty', sWidth: "10%" },
                //{ data: 'order_qty', title: 'Order Qty', sWidth: "10%" },
                { data: 'status', title: 'Status', sWidth: "10%" },
                {
                    data: 'issue_order_no', title: 'Order No.', sWidth: "10%", render: function (data, type, dtrow) {
                        return '#' + data;
                    }
                },


            ],

        });
    }
    else {

        $('#dtdataorderlisting').DataTable().clear().destroy();
    }

}
 
//function CheckAll() {
//    var isChecked = $('#checkall').prop("checked");
//    $('#dtdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
//}
//function Singlecheck(chk) {
//    var isChecked = $(chk).prop("checked");
//    var isHeaderChecked = $("#checkall").prop("checked");
//    if (isChecked == false && isHeaderChecked)
//        $("#checkall").prop('checked', isChecked);
//    else {
//        $('#dtdata tr:has(td)').find('input[type="checkbox"]').each(function () {
//            if ($(this).prop("checked") == false)
//                isChecked = false;
//        });
//        $("#checkall").prop('checked', isChecked);
//    }
//}
