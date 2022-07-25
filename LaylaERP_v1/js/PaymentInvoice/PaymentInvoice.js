$(document).ready(function () {
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
    },
        function (start, end, label) {
            $.when(PurchaseOrderGrid()).done(function () { PoPartiallyColleps(); });
        }
    );
    $.when(PurchaseOrderGrid()).done(function () { PoPartiallyColleps(); });

        $(document).on('click', "#btnChange", function () {
            let type = $("#hfhref").val();
            if (type == '') type = '#tab_21';
            if (type == '#tab_21') takepayment();
            else takepaymentpr();
        });

    $(document).on('click', "#btnOtherFilter", function () { });

    // Add event listener for opening and closing details
    $('#dtdata tbody').on('click', '.pdetailspo-control', function () {
        // console.log('svvvd');
        var tr = $(this).closest('tr');
        var row = $('#dtdata').DataTable().row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            tr.find('.pdetailspo-control').empty().append('<i class="glyphicon glyphicon-plus-sign"></i>');
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            tr.find('.pdetailspo-control').empty().append('<i class="glyphicon glyphicon-minus-sign"></i>');
            row.child(formatPO(row.data())).show();
            tr.addClass('shown');
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
            //row.child(formatPartially(row.data())).show();
            row.child(formatPO(row.data())).show();
            tr.addClass('shown');
        }
    });

    $('.nav-tabs li a').click(function () {
        var data = $(this).attr("href");
        $("#hfhref").val(data);
    });
});

function PurchaseOrderGrid() {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');

    $('#dtdata').DataTable({
        destroy: true, bProcessing: true, bServerSide: true,
        bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        sAjaxSource: "/PaymentInvoice/GetPurchaseOrderList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: 'SERPO' }, { name: "strValue2", value: sd }, { name: "strValue3", value: ed });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [
            /*{ data: 'ref', title: 'Parent ID', sWidth: "8%" },*/
            {
                //'data': 'id', sWidth: "5%   ", 'render': function (data, type, row) {
                //    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '"><label></label>';
                //}
                 'data': 'id', sWidth: "5%",
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '"><label></label>';
                }
            },
            {
                data: 'ref', title: 'PO No', sWidth: "12%", render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    return '<a href="javascript:void(0);" class="pdetailspo-control" data-toggle="tooltip" title="Click here to show details."><i class="glyphicon glyphicon-plus-sign"></i></a> #' + row.ref + ' <a href="#" title="Click here to view order preview" data-toggle="tooltip" onclick="getPurchaseOrderPrint(' + row.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'date_creation', title: 'Order Date', sWidth: "10%" },
            { data: 'refordervendor', sWidth: "10%", title: 'Invoice No', sWidth: "10%" },
            { data: 'vendor_name', title: 'Vendor Name', sWidth: "10%" },
            { data: 'total_ttc', title: 'Total Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'recieved', title: 'Paid Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'remaining', title: 'Balance Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'Status', title: 'Status', sWidth: "10%" }
        ],
        columnDefs: [{ targets: [0], searchable: false, orderable: false }], order: [[1, "desc"]]
    });
}
function formatPO(d) {
    let option = { strValue1: d.id }, wrHTML = '<table class="inventory-table1 table-blue table check-table table-bordered table-striped dataTable no-footer"><thead><tr><th style="width:20%; text-align:left; visibility:inherit; opacity:1;">Payment/Bill No</th><th style="width:10%; text-align:left; visibility:inherit; opacity:1;">Type</th><th style="width:35%; text-align:left; visibility:inherit; opacity:1;">Receive Date</th><th style="width:15%; text-align:left; visibility:inherit; opacity:1;">Debit</th><th style="width:30%; text-align:left; visibility:inherit; opacity:1;">Credit</th></tr></thead>';
    $.ajax({
        url: '/PaymentInvoice/GetPOOrderDataList', type: 'post', dataType: 'json', contentType: "application/json; charset=utf-8", data: JSON.stringify(option),
        success: function (result) {
            result = JSON.parse(result);
            let total_dbtamount = 0, total_crdamount = 0.00;
            if (result.length == 0) { wrHTML += '<tbody><tr><td valign="top" colspan="3" class="no-data-available">Sorry no matching records found.</td></tr></tbody>'; }
            $(result).each(function (index, row) {
                wrHTML += '<tr><td style="width:20%; text-align:left;"> ' + row.ref + ' </td><td style="width:10%; text-align:left;"> ' + row.Paid + ' </td><td style="width:35%; text-align:left;">' + row.date_creation + '</td>';
                wrHTML += '<td style="width:15%; text-align:left;">' + '$' + row.damount.toFixed(2) + '</td><td style="width:15%; text-align:left;">' + '$' + row.camount.toFixed(2) + '</td></tr > ';
                total_dbtamount +=  row.damount, total_crdamount += row.camount;

            }); wrHTML += '<tr><td style="width:20%; text-align:left;"><strong>Total</strong></td><td></td><td></td><td style="width:15%; text-align:left;"><strong>' + '$' + total_dbtamount.toFixed(2) + '</strong></td><td style="width:15%; text-align:left;"><strong>' + '$' + total_crdamount.toFixed(2) +'</strong></td> </tr > ';
        },
        error: function (xhr, status, err) { alert(err); },
        complete: function () { }, async: false
    });
    wrHTML += '</table>';
    return wrHTML;
}

function PoPartiallyColleps() {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');
    $('#dtdataPartially').DataTable({
        destroy: true, bProcessing: true, bServerSide: true,
        bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        sAjaxSource: "/PaymentInvoice/GetPurchaseOrderList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: 'SERPR' }, { name: "strValue2", value: sd }, { name: "strValue3", value: ed });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData, success: function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [
            {
                //'data': 'id', sWidth: "5%   ", 'render': function (data, type, row) {
                //    return '<input type="checkbox" name="CheckSinglepr" id="CheckSinglepr" onClick="Singlecheckpr();" value="' + data + '"><label></label>';
                //}

                 'data': 'id', sWidth: "5%",
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" name="CheckSinglepr" id="CheckSinglepr" onClick="Singlecheckpr();" value="' + $('<div/>').text(data).html() + '"><label></label>';
                }
            },
            {
                data: 'ref', title: 'PO No', sWidth: "12%", render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    return '<a href="javascript:void(0);" class="pdetails-control" data-toggle="tooltip" title="Click here to show details."><i class="glyphicon glyphicon-plus-sign"></i></a> #' + row.ref + ' <a href="#" title="Click here to view order preview" data-toggle="tooltip" onclick="getPurchaseOrderPrint(' + row.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'date_creation', title: 'Order Date', sWidth: "10%" },
            { 'data': 'refordervendor', sWidth: "10%", title: 'Invoice No', sWidth: "10%" },
            { data: 'vendor_name', title: 'Vendor Name', sWidth: "10%" },
            { data: 'total_ttc', title: 'PO Amount', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'totalrecieved', title: 'Reception PO Amount', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'recieved', title: 'Paid Amount', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'remaining', title: 'Balance Amount', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'Status', title: 'Status', sWidth: "10%" }
        ],
        columnDefs: [{ targets: [0], searchable: false, orderable:false }], order: [[1, "desc"]]
    });
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

//CheckBoxes
$('#checkAll').click(function () {
    var isChecked = $(this).prop("checked");
    $('#dtdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
});

function Singlecheck() {
    var isChecked = $('#CheckSingle').prop("checked");
    var isHeaderChecked = $("#checkAll").prop("checked");
    if (isChecked == false && isHeaderChecked)
        $("#checkAll").prop('checked', isChecked);

    else {
        $('#dtdata tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkAll").prop('checked', isChecked);
    }
}

//function CheckAllpr() {
//    var isChecked = $('#checkallpr').prop("checked");
//    $('#dtdataPartially tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
//}

$('#checkallpr').click(function () {
    var isChecked = $(this).prop("checked");
    $('#dtdataPartially tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
});
//function Singlecheckpr(chk) {
//    var isChecked = $(chk).prop("checked");
//    var isHeaderChecked = $("#checkallpr").prop("checked");
//    if (isChecked == false && isHeaderChecked)
//        $("#checkallpr").prop('checked', isChecked);
//    else {
//        $('#dtdataPartially tr:has(td)').find('input[type="checkbox"]').each(function () {
//            if ($(this).prop("checked") == false)
//                isChecked = false;
//        });
//        $("#checkallpr").prop('checked', isChecked);
//    }
//}

function Singlecheckpr() {
    var isChecked = $('#CheckSinglepr').prop("checked");
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
    let status = 'PO'// $('#ddlStatus').val();
    console.log(id);

    if (id == "") {
        swal('Alert', 'Please select a PO', 'error');
    }
    else {
        ActivityLog('Go for payment process', '/PaymentInvoice/PaymentInvoice?status=' + status + '&id=' + id+'');
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
    let status = 'PO'; //$('#ddlStatus').val();
    console.log(id);

    if (id == "") {
        swal('Alert', 'Please select a PO', 'error');
    }
    else {
        var name = $("#txtName").val();
        var tech = $("#ddlTechnolgy").val();
        /*var url = "Page2.htm?status=" + encodeURIComponent(name) + "&technology=" + encodeURIComponent(tech);*/
        var url = "/PaymentInvoice/PaymentInvoice?status=" + status + "&id=" + id;
        window.location.href = url;
    }

}