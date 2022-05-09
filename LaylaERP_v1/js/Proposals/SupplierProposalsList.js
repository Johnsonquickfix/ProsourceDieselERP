$(document).ready(function () {
    $("#loader").hide(); $("#ddlVendor").select2();
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
        startDate: moment(), autoUpdateInput: false, alwaysShowCalendars: true,
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'left', orientation: "left auto"
    }, function (start, end, label) {
        $('#txtDate').val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
        PurchaseOrderGrid();
    });
    $('#txtDate').val('');
    $('#txtDate').on('cancel.daterangepicker', function (ev, picker) { $(this).val(''); LoadGrid(); });
    $.when(getVendor()).done(function () { LoadGrid(); });
    $(document).on("change", "#ddlVendor", function (t) { t.preventDefault(); LoadGrid(); LoadGridIPO(); });
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        let target = $(e.target).attr("href") // activated tab
        if (target == '#tabPO_01') LoadGrid();
        else if (target == '#tabPO_02') LoadGridIPO();
    });
});
function getVendor() {
    //$("#ddlVendor").select2();
    $.ajax({
        url: "/PurchaseOrder/GetVendor",
        type: "Get",
        success: function (data) {
            $('#ddlVendor').empty().append('<option value="-1">Please Select Vendor</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddlVendor').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}
function LoadGrid() {
    let vid = parseInt($('#ddlVendor').val()) || 0;
    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };
    let table = $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, scrollX: true, //scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[50, 100, 200, 300], [50, 100, 200, 300]],
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('.dataTables_filter input').unbind();
            $('.dataTables_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/proposals/proposals-list",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed }, { name: "strValue3", value: vid }, { name: "strValue4", value: '0' });

            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            // console.log(aoData);
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
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '"><label></label>';
                }
            },
            {
                'data': 'ref', sWidth: "15%", title: 'PO No',
                'render': function (id, type, full, meta) {
                    return '<a href="proposals-view?id=' + full.id + '" title="Click here to view order preview" data-toggle="tooltip">PO-' + full.fk_projet + '</a> <a href="javascript:void(0);" title="Click here to print" data-toggle="tooltip" onclick="PrintProposals(' + full.id + ');"><i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'date_creation', title: 'Order Date', sWidth: "10%" },
            {
                data: 'refordervendor', title: 'Invoice No', sWidth: "10%", 'render': function (id, type, full, meta) {
                    let str_inv = (id.substr(7) > 0 ? ' <a href="#" title="Click here to view invoice  preview" data-toggle="tooltip" onclick="getInvoicePrintDetails(' + full.id + '); "><i class="fas fa - search - plus"></i>' + id + '</a>' : '');
                    return str_inv;
                }
            },
            {
                data: 'fk_projet', title: 'SO No.', sWidth: "10%", render: function (data, type, dtrow) {
                    if (dtrow.parent_so > 0) return '#' + dtrow.parent_so; else return '#' + dtrow.fk_projet;
                }
            },
            { data: 'vendor_name', title: 'Vendor Name', sWidth: "15%" },
            {
                data: 'address', title: 'Address', sWidth: "25%", render: function (data, type, dtrow) {
                    let val = dtrow.address + ', ' + dtrow.town + ', ' + dtrow.fk_state + ' ' + dtrow.zip + ' ' + dtrow.fk_country;
                    return val;
                }
            },
            { data: 'total_ttc', title: 'Amount', sWidth: "8%", class: 'text-right', render: $.fn.dataTable.render.number('', '.', 2, '$') },
            //{ data: 'date_livraison', title: 'Planned date of delivery', sWidth: "10%" },
            {
                data: 'fedex_charges', sWidth: "10%", title: 'Shipping Fedex', class: 'text-right',
                render: function (id, type, full, meta) {
                    return '<a href="javascript:void(0);" title="Click here to get fedex charge." data-toggle="tooltip" onClick="FedexRate(' + full.id + ',\'dtdata\');">$' + (parseFloat(full.fedex_charges) || 0.00).toFixed(2) + '</a>';
                }
            },
            { data: 'Status', title: 'Status', sWidth: "8%" }
        ]
    });
}
function LoadGridIPO() {
    let vid = parseInt($('#ddlVendor').val()) || 0;
    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    let ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };
    let table = $('#dtdataIPO').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, scrollX: true,//scrollY: ($(window).height() - 215),
        responsive: true, lengthMenu: [[50, 100, 200, 300], [50, 100, 200, 300]],
        language: {
            lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        drawCallback: function () { // this gets rid of duplicate headers
            $('.dataTables_scrollBody thead tr').css({ visibility: 'collapse' });
        },
        initComplete: function () { $('.dataTables_scrollBody thead tr').css({ visibility: 'collapse' }); },
        sAjaxSource: "/proposals/proposals-list",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed }, { name: "strValue3", value: vid }, { name: "strValue4", value: '1' });

            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
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
            //{
            //    'data': 'id', sWidth: "5%   ",
            //    'render': function (data, type, full, meta) {
            //        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '"><label></label>';
            //    }
            //},
            {
                'data': 'ref', sWidth: "15%", title: 'PO No',
                'render': function (id, type, full, meta) {
                    return '<a href="proposals-view?id=' + full.id + '" title="Click here to view order preview" data-toggle="tooltip">PO-' + full.fk_projet + '</a> <a href="javascript:void(0);" title="Click here to print" data-toggle="tooltip" onclick="PrintProposals(' + full.id + ');"><i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'date_creation', title: 'Order Date', sWidth: "10%" },
            {
                data: 'refordervendor', title: 'Invoice No', sWidth: "10%", 'render': function (id, type, full, meta) {
                    //let str_inv = (id.substr(7) > 0 ? ' <a href="#" title="Click here to view invoice  preview" data-toggle="tooltip" onclick="getInvoicePrint(' + full.id + '); "><i class="fas fa - search - plus"></i>' + id + '</a>' : '');
                    //return str_inv;
                    return ' <a href="javascript:void(0);" title="Click here to view invoice  preview" data-toggle="tooltip" onclick="getInvoicePrintDetails(' + full.id + '); "><i class="fas fa - search - plus"></i>' + id + '</a>';
                }
            },
            {
                data: 'fk_projet', title: 'SO No.', sWidth: "10%", render: function (data, type, dtrow) {
                    if (data > 0) return '#' + data; else return '';
                }
            },
            { data: 'vendor_name', title: 'Vendor Name', sWidth: "15%" },
            {
                data: 'address', title: 'Address', sWidth: "25%", render: function (data, type, dtrow) {
                    let val = dtrow.address + ', ' + dtrow.town + ', ' + dtrow.fk_state + ' ' + dtrow.zip + ' ' + dtrow.fk_country;
                    return val;
                }
            },
            { data: 'total_ttc', title: 'Amount', sWidth: "8%", class: 'text-right', render: $.fn.dataTable.render.number('', '.', 2, '$') },
            //{ data: 'date_livraison', title: 'Planned date of delivery', sWidth: "10%" },
            {
                data: 'fedex_charges', sWidth: "10%", title: 'Shipping Fedex', class: 'text-right',
                render: function (id, type, full, meta) {
                    return '<a href="javascript:void(0);" title="Click here to get fedex charge." data-toggle="tooltip" onClick="FedexRate(' + full.id + ',\'dtdataIPO\');">$' + (parseFloat(full.fedex_charges) || 0.00).toFixed(2) + '</a>';
                }
            },
            { data: 'Status', title: 'Status', sWidth: "8%" }
        ]
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

$("#btngenerateinvoice").click(function () {
    var ID = "";
    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        ID += $(this).val() + ",";
    });
    ID = ID.replace(/,(?=\s*$)/, '');
    // var vacDays = ID.split(",");
    var commaCount = ID.split(",").length;
    if (ID == "") { swal('Alert', 'Please select PO from list', 'error'); }
    else {
        //if (new_role != "") {

        swal({
            title: '', text: "Are you sure you want to generate an invoice for (" + commaCount + ") orders?", type: 'warning', showCancelButton: true,
            confirmButtonColor: '#3085d6', cancelButtonColor: '#3085d6', confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                //ActivityLog('Revoke role "' + new_role + ' for" user id (' + ID + ')', '/Users/Users');
                generateinvoice(ID);
            }
        })
        //}
    }
})
function generateinvoice(ID) {
    var obj = {
        strValue1: ID
    }
    $.ajax({
        url: '/proposals/generatesalespoinvoice/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == true) {
                if (data.type == 'All') {
                    swal('Success', data.message, 'success');
                    $('.nav-tabs a[href="#tabPO_02"]').tab('show');
                }
                else {
                    swal('Alert!', data.message, 'info');
                    if (data.type == 'Miss')
                        $('.nav-tabs a[href="#tabPO_02"]').tab('show');
                }

                $.when(LoadGrid()).done(function () {
                    LoadGridIPO()
                });
            }
            else {
                swal('Alert!', data.message, 'error');
            }
        },
        error: function (error) {
            swal('Error!', 'something went wrong', 'error');
        },
    })
}

function FedexRate(id, tb_ctr) {
    swal.queue([{
        title: status, confirmButtonText: 'Yes', text: "Do you want to get Fedex charges?", showLoaderOnConfirm: true, showCloseButton: true, showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                $.get('/proposals/getship-rate', { strValue1: parseInt(id) || 0 }).then(response => {
                    console.log(response);
                    if (response.status) {
                        swal.insertQueueStep({ title: 'Success', text: 'Status updated successfully.', type: 'success' }); $('#' + tb_ctr).DataTable().ajax.reload();//order_Split(oid, email); 
                    }
                    else { swal.insertQueueStep({ title: 'Error', text: response.message, type: 'error' }); }
                    resolve();
                }).catch(err => { swal.hideLoading(); swal('Error!', err, 'error'); });
            });
        }
    }]);
    //swal.queue([{
    //    title: 'Fedex Rate.', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, showCloseButton: false, showCancelButton: false,
    //    onOpen: () => {
    //        swal.showLoading();
    //        $.get('/proposals/getship-rate', { strValue1: parseInt(id) || 0 }).then(response => {
    //            console.log(response);
    //            //swal('Success!', 'Order cancelled successfully.', "success");
    //            //$.when(GetOrderDetails()).done(function () { table_oh.ajax.reload(null, false); });
    //        }).catch(err => { swal.hideLoading(); swal('Error!', err, 'error'); });
    //    }
    //}]);
}