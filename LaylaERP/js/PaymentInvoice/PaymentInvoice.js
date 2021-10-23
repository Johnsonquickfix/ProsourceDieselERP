$(document).ready(function () {
    //PaymentStatus();
    $(".subsubsub li a").click(function (e) {
        $('.subsubsub li a').removeClass('current');
        $(this).addClass('current');
    });
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
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "left auto"
    }, function (start, end, label) {
        let type = $('#ddlStatus').val();
        if (type == 'PO')
            PurchaseOrderGrid(true);
        else
            PoPartiallyColleps(true);
    });
    //PartiallyGrid(true);
    PoPartiallyColleps(true);
    PurchaseOrderGrid(true);
    $('#divprdata').hide();
    $('#divpodata').show();

    $(document).on('click', "#btnChange", function () {
        let type = $('#ddlStatus').val();
        if (type == 'PO') {
            takepayment();          
        }
        else {
            takepaymentpr();
       
        }

    });

    // Add event listener for opening and closing details
    $('#dtdataPartially tbody').on('click', '.pdetails-control', function () {
       // console.log('svvvd');
        var tr = $(this).closest('tr');
        var row = $('#dtdataPartially').DataTable().row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            tr.find('.pdetails-control').empty().append('<i class="glyphicon glyphicon-plus-sign"></i>');
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            tr.find('.pdetails-control').empty().append('<i class="glyphicon glyphicon-minus-sign"></i>');
            row.child(formatPartially(row.data())).show();
            tr.addClass('shown');
        }
    });
   
});

$('#ddlStatus').change(function () {
    let type = $('#ddlStatus').val();
    if (type == 'PO') {
        $('#divprdata').hide();
        $('#divpodata').show();
        PurchaseOrderGrid(true);
      //  console.log('dvvs');
    }
    else {
        $('#divprdata').show();
        $('#divpodata').hide();
        PoPartiallyColleps(true);
        //console.log('ds');
    }

});



function PurchaseOrderGrid(is_date) {
   // let urid = parseInt($("#ddlStatus").val());
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';
    let table = $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('.dataTables_filter input').unbind();
            $('.dataTables_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/PaymentInvoice/GetPurchaseOrderList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: dfa });        
            var col = 'order_id';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 2 ? "refordervendor" : oSettings.aaSorting[0][0] == 3 ? "request_author" : oSettings.aaSorting[0][0] == 4 ? "vendor_name" : oSettings.aaSorting[0][0] == 5 ? "city" : oSettings.aaSorting[0][0] == 6 ? "zip" : oSettings.aaSorting[0][0] == 6 ? "date_livraison" : oSettings.aaSorting[0][0] == 7 ? "Status" : "ref";
                aoData.push({ name: "sSortColName", value: col });
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
                'data': 'id', sWidth: "5%   ",
                'render': function (data, type, row) {
                    if ( parseInt(row.remaining) == 0)
                        return '';
                    else
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '"><label></label>';
                }
            },
            {
                'data': 'ref', sWidth: "10%", title: 'PO No'
          
            },
         
            { data: 'date_creation', title: 'Order Date', sWidth: "10%" },
            {
                'data': 'refordervendor', sWidth: "10%", title: 'Invoice No', sWidth: "10%"
            },
            { data: 'vendor_name', title: 'Vendor Name', sWidth: "10%" },            
            { data: 'total_ttc', title: 'Total Amount', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'recieved', title: 'Paid Amount', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'remaining', title: 'Balance Amount', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'Status', title: 'Status', sWidth: "10%" }
        ],

    });
}
function PartiallyGrid(is_date) {
   // let urid = parseInt($("#ddlSearchStatus").val());
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';

    let table = $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('.dataTables_filter input').unbind();
            $('.dataTables_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/PaymentInvoice/GetPartiallyOrderList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: dfa });
            var col = 'order_id';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 2 ? "refordervendor" : oSettings.aaSorting[0][0] == 3 ? "request_author" : oSettings.aaSorting[0][0] == 4 ? "vendor_name" : oSettings.aaSorting[0][0] == 5 ? "city" : oSettings.aaSorting[0][0] == 6 ? "zip" : oSettings.aaSorting[0][0] == 6 ? "date_livraison" : oSettings.aaSorting[0][0] == 7 ? "Status" : "ref";
                aoData.push({ name: "sSortColName", value: col });
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
                'data': 'ids', sWidth: "5%   ",
                'render': function (data, type, row) {
                    if (parseInt(row.remaining) == 0)
                        return '';
                    else
                        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '"><label></label>';
                }
            },
            {
                'data': 'ref', sWidth: "10%", title: 'PO No'
                
            },
            { data: 'date_creation', title: 'Receive Date', sWidth: "10%" },
            {
                data: 'refordervendor', title: 'Bill No', sWidth: "10%"
            },
            { data: 'vendor_name', title: 'Vendor Name', sWidth: "10%" },
            { data: 'total_ttc', title: 'Amount', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'recieved', title: 'Received', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'remaining', title: 'Balance', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'Status', title: 'Status', sWidth: "10%" }
        ]

    });
}




function PoPartiallyColleps(is_date) {
    // console.log(obj);
   // console.log(obj);

    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    let dfa = is_date ? "'" + sd + "' and '" + ed + "'" : '';

    let obj = { strValue1: dfa };

    $('#dtdataPartially').DataTable({
        oSearch: { "sSearch": '' }, bAutoWidth: false, scrollX: false,
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        destroy: true, ajax: {
            url: '/PaymentInvoice/GetPartiallyDetailsList', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
        columns: [
            /*{ data: 'ref', title: 'Parent ID', sWidth: "8%" },*/
            {
                'data': 'id',sWidth: "5%   ",
                'render': function (data, type, row) {                    
                        return '<input type="checkbox" name="CheckSinglepr" id="CheckSinglepr" onClick="Singlecheckpr();" value="' + data + '"><label></label>';
                }
            },
            {
                data: 'ref', title: 'PO No', sWidth: "10%", render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    return '<a href="javascript:void(0);" class="pdetails-control" data-toggle="tooltip" title="Click here to show details."><i class="glyphicon glyphicon-plus-sign"></i></a> -  #' + row.ref + '';

                }
            },

            {
                data: 'fk_projet', title: 'SO No.', sWidth: "10%", render: function (data, type, dtrow) {
                    if (data > 0) return '#' + data; else return '';
                }
            },
            { data: 'vendor_name', title: 'Vendor Name', sWidth: "15%" },
            {
                data: 'city', title: 'Address', sWidth: "20%", render: function (data, type, dtrow) {
                    /*    let val = dtrow.address + ', ' + dtrow.town + ' ,' + dtrow.fk_state + ' ' + dtrow.zip;*/
                    let val = dtrow.address + ', ' + dtrow.town + ', ' + dtrow.fk_state + ' ' + dtrow.zip;
                    return val;
                }
            },

            { data: 'date_livraison', title: 'Planned Date of Delivery', sWidth: "10%" },
            { data: 'Status', title: 'Status', sWidth: "10%" }
            
        ],
        columnDefs: [{ targets: [0],  searchable: false }], order: [[1, "desc"]]
    });
}

/* Formatting function for row details - modify as you need */
function formatPartially(d) {
    //console.log(d.ref);
    let option = { strValue1: d.id }, wrHTML = '<table class="inventory-table table-blue table check-table table-bordered table-striped dataTable no-footer"><thead><tr><th style="width:10%; text-align:left;">Bill No</th><th style="width:12%; text-align:left;">Receive Date</th><th style="width:60%; text-align:left;">Description</th><th style="width:10%; text-align:right;">Total Amount</th><th style="width:10%; text-align:right;">Paid Amount</th><th style="width:10%; text-align:right;">Balance Amount</th></tr></thead>';
    $.ajax({
        url: '/PaymentInvoice/GetPartiallyOrderDataList', type: 'post', dataType: 'json', contentType: "application/json; charset=utf-8", data: JSON.stringify(option),
        success: function (result) {
            result = JSON.parse(result);
            if (result.length == 0) { wrHTML += '<tbody><tr><td valign="top" colspan="6" class="no-data-available">Sorry no matching records found.</td></tr></tbody>'; }
            $(result).each(function (index, row) {

                wrHTML += '<tr><td style="width:10%; text-align:left;"> <a href="#"><i class="fas fa - search - plus"></i>' + row.refordervendor + '</a></td><td style="width:12%; text-align:left;">' + row.dtcration + '</td>';
                wrHTML += '<td style="width:40%; text-align:left;">' + row.des + '</td>'
                wrHTML += '<td style="width:10%; text-align:right;">' + '$' + row.total_ttc + '</td>';
                wrHTML += '<td style="width:10%; text-align:right;">' + '$' + row.recieved + '</td>';
                wrHTML += '<td style="width:10%; text-align:right;">' + '$' + row.remaining + '</td></tr > ';
            });
        },
        error: function (xhr, status, err) { alert(err); },
        complete: function () { }, async: false
    });
    wrHTML += '</table>';
    return wrHTML;
}



function CheckAll() {
    var isChecked = $('#checkall').prop("checked");
    $('#dtdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
}
function Singlecheck(chk) {
    var isChecked = $(chk).prop("checked");
    var isHeaderChecked = $("#checkall").prop("checked");
    if (isChecked == false && isHeaderChecked)
        $("#checkall").prop('checked', isChecked);
    else {
        $('#dtdata tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkall").prop('checked', isChecked);
    }
}


function CheckAllpr() {
    var isChecked = $('#checkallpr').prop("checked");
    $('#dtdataPartially tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
}
function Singlecheckpr(chk) {
    var isChecked = $(chk).prop("checked");
    var isHeaderChecked = $("#checkallpr").prop("checked");
    if (isChecked == false && isHeaderChecked)
        $("#checkallpr").prop('checked', isChecked);
    else {
        $('#dtdataPartially tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkallpr").prop('checked', isChecked);
    }
}




function takepayment() {
    let id = "";
    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        id += $(this).val() + ",";
    });
    id = id.replace(/,(?=\s*$)/, '');
    $("#checkAll").prop('checked', false);
    let status = $('#ddlStatus').val();
    console.log(id);

    if (id == "") {
        swal('alert', 'Please select a PO', 'error');
    }
    else {
        var name = $("#txtName").val();
        var tech = $("#ddlTechnolgy").val();
        /*var url = "Page2.htm?status=" + encodeURIComponent(name) + "&technology=" + encodeURIComponent(tech);*/
        var url = "/PaymentInvoice/PaymentInvoice?status=" + status + "&id=" + id;
        window.location.href = url;
    }
    //if (id == "") { swal('alert', 'Please select a order', 'error'); }
    //if (status == "") { swal('alert', 'Please select status', 'error'); }

    //swal.queue([{
    //    title: 'Alert!', confirmButtonText: 'Yes, Update it!', text: "Do you want to change your order status?",
    //    showLoaderOnConfirm: true, showCancelButton: true,
    //    preConfirm: function () {
    //        return new Promise(function (resolve) {
    //            let obj = { strVal: id, status: status }
    //            $.post('/Orders/ChangeOrderStatus', obj)
    //                .done(function (data) {
    //                    if (data.status) {
    //                        swal.insertQueueStep(data.message);
    //                        GetOrderDetails(); let order_type = $('#hfOrderType').val(); dataGridLoad(order_type, true);
    //                    }
    //                    else { swal.insertQueueStep('something went wrong!'); }
    //                    resolve();
    //                })
    //        })
    //    }
    //}]);
}


function takepaymentpr() {
    let id = "";
    $("input:checkbox[name=CheckSinglepr]:checked").each(function () {
        id += $(this).val() + ",";
    });
    id = id.replace(/,(?=\s*$)/, '');
    $("#checkallpr").prop('checked', false);
    let status = $('#ddlStatus').val();
    console.log(id);

    if (id == "") {
        swal('alert', 'Please select a PO', 'error');
    }
    else {
        var name = $("#txtName").val();
        var tech = $("#ddlTechnolgy").val();
        /*var url = "Page2.htm?status=" + encodeURIComponent(name) + "&technology=" + encodeURIComponent(tech);*/
        var url = "/PaymentInvoice/PaymentInvoice?status=" + status + "&id=" + id;
        window.location.href = url;
    }
    
}