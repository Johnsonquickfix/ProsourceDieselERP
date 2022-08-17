$(document).ready(function () {
    $("#loader").hide(); $(".select2").select2();
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
        locale: { format: 'MM/DD/YYYY', cancelLabel: 'Clear' }, opens: 'right', orientation: "right auto"
    }, function (start, end, label) {
        $('#txtDate').val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
        LoadGrid();
    });
    //$('#txtDate').val('');
    $('#txtDate').on('cancel.daterangepicker', function (ev, picker) { $(this).val(''); LoadGrid(); });
    $.when(getMaster()).done(function () { LoadGrid(); });
    $(document).on("click", "#btnSearch", function (t) { t.preventDefault(); LoadGrid(); });
    $(document).on("click", "#btnExportList", function (t) { t.preventDefault(); ExportList(); });
});
function getMaster() {
    $('#ddlVendor').empty().append('<option value="0">Please Select Vendor</option>');
    $("#ddlProduct").html('<option value="0">Please Select Product</option>');
    $.ajax({
        url: "/proposals/getmasters", type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            data = JSON.parse(data);
            $.each(data['Table'], function (i, r) {
                $('#ddlVendor').append('<option value="' + r.id + '">' + r.text + '</option>');
            });
            $.each(data['Table1'], function (i, r) {
                $('#ddlProduct').append('<option value="' + r.id + '">' + r.text + '</option>');
            });
        }, async: false
    });
}
function LoadGrid() {
    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY'), ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };
    let vid = parseInt($('#ddlVendor').val()) || 0, pid = parseInt($('#ddlProduct').val()) || 0;
    let _status = $('#ddlStatus').val();
    let table = $('#dtdata').DataTable({
        order: [[1, "desc"]],//columnDefs: [{ "orderable": false, "targets": 0 }],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, scrollX: true, scrollY: 320, //($(window).height() - 215),
        responsive: true, lengthMenu: [[25, 50, 100, 200, 300], [25, 50, 100, 200, 300]],
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
        sAjaxSource: "/proposals/orderproductreconciled-list",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: sd }, { name: "strValue2", value: ed }, { name: "strValue3", value: vid }, { name: "strValue4", value: pid }, { name: "strValue5", value: _status });
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                success: function (data) {
                    let dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            { 'data': 'so_no', sWidth: "10%", title: 'SO No', 'render': function (id, type, full, meta) { return '#' + full.id; } },
            { data: 'date', title: 'Order Date', sWidth: "10%", render: function (id, type, full, meta) { return moment(id).format('MM/DD/YYYY hh:mm A') } },
            { data: 'invoice_no', title: 'Invoice No', sWidth: "10%" },
            { data: 'vendor_name', title: 'Vendor Name', sWidth: "15%" },
            //{
            //    data: 'so_no', title: 'SO No.', sWidth: "10%", render: function (data, type, dtrow) {
            //        if (dtrow.parent_so > 0) return '#' + dtrow.parent_so; else return '#' + dtrow.fk_projet;
            //    }
            //},
            { data: 'customer_name', title: 'Customer Name', sWidth: "15%" },
            { data: 'sku', title: 'SKU', sWidth: "10%" },
            { data: 'product_name', title: 'Product Description', sWidth: "10%" },
            { data: 'total', title: 'Amount', sWidth: "8%", class: 'text-right', render: $.fn.dataTable.render.number('', '.', 2, '$') },
            {
                data: 'reconcile_status', title: 'Status', sWidth: "10%", render: function (data, type, dtrow) {
                    if (data == 'matched') return '<span class="badge bg-success">Matched</span>'; else return '<span class="badge bg-danger">Unmatched</span>';
                }
            },
            //{ data: 'Status', title: 'Status', sWidth: "8%" }
        ]
    });
}

function ExportList() {
    let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY'), ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };
    let option = { strValue1: sd, strValue2: ed, strValue3: parseInt($('#ddlVendor').val()) || 0, strValue4: parseInt($('#ddlProduct').val()) || 0, strValue5: $('#ddlStatus').val() };
    option.sSearch = ''; option.iDisplayStart = 0; option.iDisplayLength = 0;
    let table = $('#dtdata').DataTable().order();
    option.sSortDir_0 = table[0][1]; option.sSortColName = 'date_creation';//option.sSortColName = "[" + _columns[table[0][0]].data + "]";
    $("#loader").show();
    setTimeout(function () { $("#loader").hide(); }, 2000);
    postForm(option, '/proposals/orderproductreconciled-export');
}
function postForm(parameters, url) {

    // generally we post the form with a blank action attribute
    if ('undefined' === typeof url) { url = ''; }


    //----------------------------------------
    // SOME HELPER FUNCTIONS
    //----------------------------------------
    var getForm = function (url, values) {
        values = removeNulls(values);
        var form = $('<form>').attr("method", 'POST').attr("action", url);
        iterateValues(values, [], form, null);
        return form;
    };

    var removeNulls = function (values) {
        var propNames = Object.getOwnPropertyNames(values);
        for (var i = 0; i < propNames.length; i++) {
            var propName = propNames[i];
            if (values[propName] === null || values[propName] === undefined) {
                delete values[propName];
            } else if (typeof values[propName] === 'object') {
                values[propName] = removeNulls(values[propName]);
            } else if (values[propName].length < 1) {
                delete values[propName];
            }
        }
        return values;
    };

    var iterateValues = function (values, parent, form, isArray) {
        var i, iterateParent = [];
        Object.keys(values).forEach(function (i) {
            if (typeof values[i] === "object") {
                iterateParent = parent.slice();
                iterateParent.push(i);
                iterateValues(values[i], iterateParent, form, Array.isArray(values[i]));
            } else {
                form.append(getInput(i, values[i], parent, isArray));
            }
        });
    };

    var getInput = function (name, value, parent, array) {
        var parentString;
        if (parent.length > 0) {
            parentString = parent[0];
            var i;
            for (i = 1; i < parent.length; i += 1) {
                parentString += "[" + parent[i] + "]";
            }

            if (array) {
                name = parentString + "[" + name + "]";
            } else {
                name = parentString + "[" + name + "]";
            }
        }

        return $("<input>").attr("type", "hidden").attr("name", name).attr("value", value);
    };


    //----------------------------------------
    // NOW THE SYNOPSIS
    //----------------------------------------
    var generatedForm = getForm(url, parameters);

    $('body').append(generatedForm);
    generatedForm.submit();
    generatedForm.remove();
}