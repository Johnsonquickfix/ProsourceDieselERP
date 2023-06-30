//var htmlAcc = '<option value="0">Please Select Company</option>';

$(document).ready(function () {
    $("#loader").hide();
    $(".select2").select2();
    $("#ddlcompany").select2({
        allowClear: true, minimumInputLength: 0, placeholder: "Search website",
        ajax: {
            url: '/Setting/GetcompanyData', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term, strValue2: '' }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.label, name: item.label, val: item.ID, id: item.ID } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
    $("#ddlwebcompany").select2({
        allowClear: true, minimumInputLength: 0, placeholder: "Search website",
        ajax: {
            url: '/Setting/GetcompanyData', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term, strValue2: '' }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.label, name: item.label, val: item.ID, id: item.ID } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
    OrderGrid();
    // $("#ddlcompany").select2("val", ['1','2']);
})


function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}
function isNullUndefAndSpace(variable) { return (variable !== null && variable !== undefined && variable !== 'undefined' && variable !== 'null' && variable.length !== 0); }
function OrderGrid() {
    // var optType = $('input[name="accounting_Order_mode"]:checked').val();
    obj = { strValue1: '' } 
    let searchText = localStorage.getItem('_search');
    var monthYear = '', cus_id = (parseInt($('#ddlUser').val()) || 0);
    //if ($('#filter-by-date').val() != "0") monthYear = $('#filter-by-date').val();
    //let sd = $('#txtOrderDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    //let ed = $('#txtOrderDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    //if ($('#txtOrderDate').val() == '') { sd = ''; ed = '' };
    //let dfa = "'" + sd + "' and '" + ed + "'";
    //let _id = parseInt($('#hfOrderType').data('userid')) || 0, _editable = parseInt($('#hfOrderType').data('iseditable')) || 0;
    table_oh = $('#dtdata').DataTable({
        oSearch: { "sSearch": searchText }, columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]], lengthMenu: [[10, 20, 50], [10, 20, 50]],
        destroy: true, bProcessing: true, responsive: true, bServerSide: true, bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('.dataTables_filter input').unbind();
            $('.dataTables_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_oh.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/setting/order-list",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: '' }, { name: "strValue2", value: '' });
            aoData.push({ name: "strValue3", value: (cus_id > 0 ? cus_id : '') }, { name: "strValue4", value: '' });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                success: function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    localStorage.setItem('_search', '');
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [
            {
                'data': 'id', sWidth: "5%   ", 'render': function (id, type, full, meta) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck(this);" value="' + $('<div/>').text(id).html() + '"><label></label>';
                }
            },
            {
                data: 'id', title: 'OrderID', sWidth: "10%",
                render: function (id, type, full, meta) {
                    if (full.post_mime_type == 'shop_order_erp' || full.post_mime_type == 'shopordererp') return '#' + id + ' <i class="glyphicon glyphicon-user" title="Order created from ERP Admin." aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>';
                    else if (full.post_mime_type == 'shop_order_replace_erp' || full.post_mime_type == 'shoporderreplaceerp') return 'REP#' + id + ' <i class="glyphicon glyphicon-user" title="Order created from ERP Admin." aria-hidden="true" data-placement="top" data-toggle="tooltip"></i>';
                    else return '#' + id;
                }

            },
            {
                data: 'first_name', title: 'Name', sWidth: "14%", render: function (id, type, row) {
                    if (row.post_mime_type == 'shop_order_replace_erp' || row.post_mime_type == 'shoporderreplaceerp') return row.first_name + ' ' + row.last_name + ' (#' + row.post_parent + ')';
                    else return row.first_name + ' ' + row.last_name;
                }
            },
            
       
            {
                data: 'total_sales', title: 'Order Total', sWidth: "10%", render: function (id, type, row, meta) {
                    let sale_amt = parseFloat(row.total_sales) || 0.00, refund_amt = parseFloat(row.refund_total) || 0.00, refund_gc_amt = parseFloat(row.refund_giftcard_total) || 0.00;
                    let amt = refund_amt != 0 ? '<span style="text-decoration: line-through;"> $' + sale_amt.toFixed(2) + '<br></span><span style="text-decoration: underline;"> $' + (parseFloat(sale_amt) + refund_amt).toFixed(2) + '</span>' : '$' + sale_amt.toFixed(2);
                    amt += refund_gc_amt != 0 ? '<br>Refunded by gift card : $' + refund_gc_amt.toFixed(2) : '';
                    return amt;
                }
            },
            {
                data: 'status', title: 'Status', sWidth: "10%", render: function (data, type, row) {
                    if (data == 'wc-pending') return 'Pending payment';
                    else if (data == 'wc-processing') return 'Processing';
                    else if (data == 'wc-on-hold') return 'On hold';
                    else if (data == 'wc-completed') return 'Completed';
                    else if (data == 'wc-cancelled') return 'Cancelled';
                    else if (data == 'wc-refunded') return 'Refunded';
                    else if (data == 'wc-failed') return 'Failed';
                    else if (data == 'wc-erp-desk-amazon') return 'ERP Desktop Amazon Testing';
                    else if (data == 'wc-cancelnopay') return 'Cancelled - No Payment';
                    else if (data == 'wc-pendingpodiuminv') return 'Pending Podium Invoice';
                    else if (data == 'wc-podium') return 'Order via Podium';
                    else if (data == 'wc-podiumrefund') return 'Podium Refunded';
                    else if (data == 'wc-pendingfraud') return 'Pending Fraud';
                    else if (data == 'wc-wc-fraud') return 'Fraud';
                    else if (data == 'wc-retention-refund') return 'Retention Refund';
                    else if (data == 'wc-retained') return 'Retained';
                    else if (data == 'wc-retention') return 'Retention';
                    else if (data == 'draft') return 'draft';
                    else return '-';
                }
            },
            {
                data: 'post_date', title: 'Creation Date', sWidth: "12%", render: function (data, type, row) { return row.date_created; }
            },
            {
                data: 'payment_method_title', title: 'Payment Method', sWidth: "11%", render: function (id, type, row) {
                    let pm_title = isNullUndefAndSpace(row.payment_method_title) ? row.payment_method_title : "";
                    //if (row.status != 'wc-cancelled' && row.status != 'wc-failed' && row.status != 'wc-cancelnopay') {
                    if (row.status == 'wc-pending' || row.status == 'wc-pendingpodiuminv') {
                        if (row.payment_method == 'ppec_paypal' && row.paypal_status != 'COMPLETED') return ' <a href="javascript:void(0);" data-toggle="tooltip" title="Check PayPal Payment Status." onclick="PaymentStatus(' + row.id + ',\'' + row.paypal_id + '\',\'' + row.billing_email + '\');">' + pm_title + '</a>';
                        else if (row.payment_method == 'podium' && row.podium_status != 'PAID') return ' <a href="javascript:void(0);" data-toggle="tooltip" title="Check PayPal Payment Status." onclick="podiumPaymentStatus(' + row.id + ',\'' + row.podium_uid + '\',\'' + row.billing_email + '\');">' + pm_title + '</a>';
                        //else if (row.payment_method == 'podium' ) return ' <a href="javascript:void(0);" data-toggle="tooltip" title="Check PayPal Payment Status." onclick="podiumPaymentStatus(' + row.id + ',\'' + row.podium_uid + '\',\'' + row.billing_email + '\');">' + pm_title + '</a>';
                        //if (row.payment_method == 'ppec_paypal') return ' <a href="javascript:void(0);" data-toggle="tooltip" title="Check PayPal Payment Status." onclick="PaymentStatus(' + row.id + ',\'' + row.paypal_id + '\');">' + row.payment_method_title + '</a>';
                        else return pm_title;
                    }
                    else return pm_title;
                }
            },
            {
                data: 'company', title: 'Website', sWidth: "12%", render: function (data, type, row) { return data; }
            },
            
            {
                'data': 'id', sWidth: "7%",
                'render': function (id, type, full, meta) {
                    return ' <span title="Click here to add website" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="model(' + id + ');" ><i class="glyphicon glyphicon-eye-open"></i></a></span>';
                }
            },
        ]
    });

}


$('#btnUpdate').click(function () {
    updatecompnay();
});

function model(id) {
    $("#hfOrderid").val(id);
    //$(".select2").select2(); 
    SelectedOrdercompany();
    // setTimeout(function () {
    console.log('AS');
    var strValue1 = id;
    var obj =
        $.ajax({
            url: "/Setting/SelectOrdercompanybiyid/" + strValue1,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            success: function (data) {

                var jobj = JSON.parse(data);
                //console.log(jobj[0].company_id);
                //if (jobj.company_id != null) {
                if (jobj.length > 0) {
                    var companyIDs = jobj[0].company_id.split(',');
                    console.log(companyIDs);
                    //$("#ddlcompany").val(companyIDs).trigger('change.select2');
                    $("#ddlcompany").select2("val", [jobj[0].company_id.split(',')]);
                }
                //}
                else {
                    $("#ddlcompany").empty();
                }
            },
            error: function (msg) {

            }
        });
    //},
    // 2000);
    // console.log(id);

    setTimeout(function () { $('#OrdercompanyModal').modal('show'); }, 800);
     
}

function updatecompnay() {
    rowid = $("#hfOrderid").val();
    var companyarray = $('#ddlcompany option:selected')
        .toArray().map(item => item.value).join();
    company = companyarray;

    var companytextarray = $('#ddlcompany option:selected')
        .toArray().map(item => item.text).join();
    companytext = companytextarray;

    console.log(rowid, company, companytext)

    if (rowid == 0) {
        swal('Alert', 'Please select ', 'error');
    }
    else {
 
        var obj = { companyid: company, company: companytext, ids: rowid, flag: 'I', term_ids: '' }
        $.ajax({
            url: '/Setting/UpdateOrdertocompany/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    
                    $('#OrdercompanyModal').modal('hide');
                    swal('Success', data.message, 'success').then((result) => { OrderGrid(); });

                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })
    }

}

function SelectedOrdercompany() {
    $("#ddlcompany").empty();
    var obj = { strValue1: '' }
    $.ajax({
        url: '/Setting/GetcompanyData',
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var datalog = JSON.parse(data);
            for (var i = 0; i < datalog.length; i++) {
                $("#ddlcompany").append('<option value="' + datalog[i].ID + '" selected>' + datalog[i].label + '</option>');
            }
        },
        error: function (msg) { alert(msg); },
        async: false
    });


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

function AllotWebsite() {
    var id = "";
    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        id += $(this).val() + ",";
    });
    id = id.replace(/,(?=\s*$)/, '');
    $("#checkAll").prop('checked', false);
    //var status = $('#ddlbulkaction').val();
    //var statusval = $("#ddlbulkaction :selected").text();
    var companyarray = $('#ddlwebcompany option:selected')
        .toArray().map(item => item.value).join();
    company = companyarray;

    var companytextarray = $('#ddlwebcompany option:selected')
        .toArray().map(item => item.text).join();
    companytext = companytextarray;
    if (id == "") { swal('Alert', 'Please select Order from list', 'error'); }
    else if (company == "") { swal('Alert', 'Please select website', 'error'); }
 
    else {
        console.log(id);
        //var obj = { companyid: company, company: companytext, ids: id }
        var obj = { companyid: company, company: companytext, ids: 0, flag: 'U', term_ids: id }

        // const updatestatus = status == 'publish' ? 'Active' : 'Inactive';
        // ActivityLog('Change Order status as ' + updatestatus + '', '/Order/ListOrder');
        //var checkstr = confirm('are you sure want to update this?');
        //if (checkstr == true) {
        swal({ title: "", text: 'Would you like to assign' + companytext + ' this Order?', type: "question", showCancelButton: true })
            .then((result) => {
                if (result.value) {
                    $.ajax({
                        url: '/Setting/UpdateOrdertocompany', dataType: 'JSON', type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(obj),
                        beforeSend: function () { $("#loader").show(); },
                        success: function (data) {
                            if (data.status == true) {
                                swal('Alert', data.message, 'success').then((result) => { OrderGrid(); $("#ddlwebcompany").empty(); });
                             

                            }
                            else {
                                swal('Alert', 'something went wrong!', 'success');
                            }
                        },
                        complete: function () { $("#loader").hide(); },
                        error: function (error) {
                            swal('Error!', 'something went wrong', 'error');
                        },

                    })

                }
            });
    }
}