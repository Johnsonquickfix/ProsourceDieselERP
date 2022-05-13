$(document).ready(function () {

    var loc = window.location.pathname;
    CheckPermissions("#btnChange", "#hfEdit", "", loc);
   // CheckPermissions("#btnAddUser", "#hfEdit", "", loc);

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
            $.when(MiscBillGrid()).done(function () { MiscBillFullyGrid(); });

        }
    );

    $.when(MiscBillGrid()).done(function () { MiscBillFullyGrid(); });
    $(document).on('click', "#btnChange", function () {
        takepayment();
    });

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
    $('#dtfullypaid tbody').on('click', '.pdetails-control', function () {
        // console.log('svvvd');
        var tr = $(this).closest('tr');
        var row = $('#dtfullypaid').DataTable().row(tr);
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

function MiscBillGrid() {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');

    $('#dtdata').DataTable({
        destroy: true, bProcessing: true, bServerSide: true,
        bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[50, 100, 200, 300], [50, 100, 200, 300]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        sAjaxSource: "/PaymentInvoice/GetPaymentMiscList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: 'SERPB' }, { name: "strValue2", value: sd }, { name: "strValue3", value: ed });
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
            //{
            //    //'data': 'id', sWidth: "5%   ", 'render': function (data, type, row) {
            //    //    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '"><label></label>';
            //    //}
            //    'data': 'id', sWidth: "5%",
            //    'render': function (data, type, full, meta) {
            //        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '"><label></label>';
            //    } 
            //},
            {
                'data': 'id', sWidth: "15%", "bSearchable": false,
                'render': function (ID, type, full, meta) {

                    return '<a href="javascript:void(0);" class="badge bg-default" onClick="takepayment(' + ID + '); " data-toggle="tooltip" title="Pay Bill">Pay Bill <a>';


                }

            },
            {
                data: 'ref', title: 'Bill No', sWidth: "25%", render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    return '<a href="javascript:void(0);" class="pdetailspo-control" data-toggle="tooltip" title="Click here to view order preview."><i class="glyphicon glyphicon-plus-sign"></i></a> #' + row.ref + ' <a href="#" title="Click here to print" data-toggle="tooltip" onclick="getBillPrintDetails(' + row.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                    // return '<a  title="Click here to view order preview" data-toggle="tooltip"> #' + row.ref + '</a> <a href="javascript:void(0);" title="Click here to print" data-toggle="tooltip" onclick="PrintProposals(' + row.id + ');"><i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'date_creation', title: 'Bill Date', sWidth: "15%" },
            //{ data: 'date_livraison', title: 'Due Date', sWidth: "10%" },
            //{ data: 'refordervendor', sWidth: "10%", title: 'Invoice No', sWidth: "10%" },
            //{
            //    data: 'refordervendor', title: 'Invoice No', sWidth: "10%", 'render': function (id, type, full, meta) {
            //        return ' <a href="javascript:void(0);" title="Click here to view invoice  preview" data-toggle="tooltip" onclick="getInvoicePrint(' + full.id + '); "><i class="fas fa - search - plus"></i>' + id + '</a>';
            //    }
            //},
            { data: 'customertype', title: 'Bill Type', sWidth: "10%" },
            { data: 'displayname', title: 'Name', sWidth: "10%" },
            { data: 'total_ttc', title: 'Total Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'recieved', title: 'Paid Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'remaining', title: 'Balance Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            {
                data: 'due_date_s', title: 'Due date', sWidth: "10%", render: function (id, type, full, meta) {
                    if (full.past_due == "Past Due") return '<span style="display: none;">' + full.due_date_s + '</span>' + full.due_date + ' <i class="fas fa-exclamation pastdue" title="Past Due" aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>';
                    else return '<span style="display: none;">' + full.due_date_s + '</span>' + full.due_date;
                }
            },
            
         
            /* { data: 'Status', title: 'Status', sWidth: "10%" }*/
        ],
        columnDefs: [{ targets: [0], searchable: false, orderable: false }], order: [[1, "desc"]]
    });
}
function formatPO(d) {
    let option = { strValue1: d.id }, wrHTML = '<table class="inventory-table1 table-blue table check-table table-bordered table-striped dataTable no-footer"><thead><tr><th style="width:20%; text-align:left; visibility:inherit; opacity:1;">Bill No</th><th style="width:35%; text-align:left; visibility:inherit; opacity:1;">Receive Date</th><th style="width:30%; text-align:left; visibility:inherit; opacity:1;">Paid Amount</th></tr></thead>';
    $.ajax({
        url: '/PaymentInvoice/GetPaymentBilldetails', type: 'post', dataType: 'json', contentType: "application/json; charset=utf-8", data: JSON.stringify(option),
        success: function (result) {
            result = JSON.parse(result);
            if (result.length == 0) { wrHTML += '<tbody><tr><td valign="top" colspan="3" class="no-data-available">Sorry no matching records found.</td></tr></tbody>'; }
            $(result).each(function (index, row) {
                wrHTML += '<tr><td style="width:20%; text-align:left;"> ' + row.ref + ' </td><td style="width:35%; text-align:left;">' + row.date_creation + '</td>';
                wrHTML += '<td style="width:30%; text-align:left;">' + '$' + row.amount + '</td></tr > ';
            });
        },
        error: function (xhr, status, err) { alert(err); },
        complete: function () { }, async: false
    });
    wrHTML += '</table>';
    return wrHTML;
}

function MiscBillFullyGrid() {
    let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('YYYY-MM-DD');

    $('#dtfullypaid').DataTable({
        destroy: true, bProcessing: true, bServerSide: true,
        bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[50, 100, 200, 300], [50, 100, 200, 300]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        sAjaxSource: "/PaymentInvoice/GetPaymentMiscList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: 'SFRPB' }, { name: "strValue2", value: sd }, { name: "strValue3", value: ed });
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

            {
                data: 'ref', title: 'Bill No', sWidth: "12%", render: function (data, type, row) {
                    //if (row.post_parent > 0) return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> ↳  #' + row.id; else return '<a href="javascript:void(0);" class="details-control"><i class="glyphicon glyphicon-plus-sign"></i></a> <b>#' + row.id + '</b>';
                    //return '<a href="javascript:void(0);" class="pdetails-control" data-toggle="tooltip" title="Click here to view payment ."><i class="glyphicon glyphicon-plus-sign"></i></a> #' + row.refordervendor + ' <a href="#" title="Click here to print" data-toggle="tooltip" onclick="PrintProposals(' + row.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                    return '<a href="javascript:void(0);" class="pdetailspo-control" data-toggle="tooltip" title="Click here to view order preview."><i class="glyphicon glyphicon-plus-sign"></i></a> #' + row.ref + ' <a href="#" title="Click here to print" data-toggle="tooltip" onclick="getBillPrintDetails(' + row.id + ', false);"><i class="fas fa-search-plus"></i></a>';
                    // return '<a  title="Click here to view order preview" data-toggle="tooltip"> #' + row.ref + '</a> <a href="javascript:void(0);" title="Click here to print" data-toggle="tooltip" onclick="PrintProposals(' + row.id + ');"><i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'date_creation', title: 'Bill Date', sWidth: "10%" },
            //{ data: 'date_livraison', title: 'Due Date', sWidth: "10%" },
            //{ data: 'refordervendor', title: 'Invoice No', sWidth: "10%" },
            //{
            //    data: 'refordervendor', title: 'Invoice No', sWidth: "10%", 'render': function (id, type, full, meta) {
            //        return ' <a href="javascript:void(0);" title="Click here to view invoice  preview" data-toggle="tooltip" onclick="getInvoicePrint(' + full.id + '); "><i class="fas fa - search - plus"></i>' + id + '</a>';
            //    }
            //},
            { data: 'customertype', title: 'Bill Type', sWidth: "10%" },
            { data: 'displayname', title: 'Name', sWidth: "10%" },
            { data: 'total_ttc', title: 'Total Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'recieved', title: 'Paid Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            { data: 'remaining', title: 'Balance Amount', class: 'text-right', sWidth: "10%", render: $.fn.dataTable.render.number('', '.', 2, '$') },
            {
                data: 'due_date_s', title: 'Due date', sWidth: "10%", render: function (id, type, full, meta) {
                    if (full.past_due == "Past Due") return '<span style="display: none;">' + full.due_date_s + '</span>' + full.due_date + ' <i class="fas fa-exclamation pastdue" title="Past Due" aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>';
                    else return '<span style="display: none;">' + full.due_date_s + '</span>' + full.due_date;
                }
            },
            
            /*{ data: 'Status', title: 'Status', sWidth: "10%" }*/
        ],
        order: [[0, "desc"]]
    });
}

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

function takepayment(id) {
    //let id = "";
    //$("input:checkbox[name=CheckSingle]:checked").each(function () {
    //    id += $(this).val() + ",";
    //});
    //id = id.replace(/,(?=\s*$)/, '');
    //$("#checkAll").prop('checked', false);
    let status = 'IP'// $('#ddlStatus').val();
    console.log(id);
    if (id == "") {
        swal('Alert', 'Please select a PO', 'error');
    }
    else {
        ActivityLog('Go for payment process', '/PaymentInvoice/PaymentInvoiceMiscBill?status=' + status + '&id=' + id + '');
        var name = $("#txtName").val();
        var tech = $("#ddlTechnolgy").val();
        /*var url = "Page2.htm?status=" + encodeURIComponent(name) + "&technology=" + encodeURIComponent(tech);*/
        var url = "/PaymentInvoice/PaymentInvoiceMiscBill?status=" + status + "&id=" + id;
        window.location.href = url;
    }
}
