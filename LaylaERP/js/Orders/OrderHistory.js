
function dataGridLoad() {
    var urid = parseInt($("#ddlSearchStatus").val()) || 0;
    var sid = ""//$('#txtSearch').val() ;
    var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 10, sEcho: 1, SortCol: 'id', SortDir: 'desc' };
    $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true,
        bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        sAjaxSource: "/Orders/GetOrderList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            obj.Search = aoData[45].value;
            var col = 'order_id';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 2 ? "customer_id" : oSettings.aaSorting[0][0] == 3 ? "FirstName" : oSettings.aaSorting[0][0] == 4 ? "LastName" : oSettings.aaSorting[0][0] == 5 ? "num_items_sold" : oSettings.aaSorting[0][0] == 6 ? "total_sales" : oSettings.aaSorting[0][0] == 6 ? "status" : oSettings.aaSorting[0][0] == 6 ? "date_created" : "order_id";
                obj.SortCol = col; obj.SortDir = oSettings.aaSorting.length > 0 ? oSettings.aaSorting[0][1] : "desc";
            }
            obj.sEcho = aoData[0].value; obj.PageSize = oSettings._iDisplayLength; obj.PageNo = oSettings._iDisplayStart;
            $.ajax({
                type: "POST", url: sSource, async: true, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
                success: function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, iTotalRecords: data.iTotalRecords, iTotalDisplayRecords: data.iTotalDisplayRecords, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
                async: false
            });
        },
        aoColumns: [
            {
                'data': 'order_id', sWidth: "5%   ",
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck(this);" value="' + $('<div/>').text(data).html() + '"><label></label>';
                }
            },
            { data: 'order_id', title: 'OrderID', sWidth: "8%" },
            { data: 'customer_id', title: 'Customer ID', sWidth: "8%" },
            { data: 'FirstName', title: 'First Name', sWidth: "10%" },
            { data: 'LastName', title: 'Last Name', sWidth: "10%" },
            { data: 'num_items_sold', title: 'No. of Items', sWidth: "10%" },
            { data: 'total_sales', title: 'Order Total', sWidth: "10%" },
            { data: 'status', title: 'Status', sWidth: "10%" },
            { data: 'date_created', title: 'Creation Date', sWidth: "10%" },
            {
                'data': 'order_id', sWidth: "8%",
                'render': function (id, type, full, meta) {
                    return '<a href="../Orders/NewOrders/' + id + '"><i class="glyphicon glyphicon-eye-open"></i></a>'
                }
            }
        ]
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



function orderStatus() {
    debugger
    var id = "";
    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        id += $(this).val() + ",";
    });
    id = id.replace(/,(?=\s*$)/, '');
    $("#checkAll").prop('checked', false);
    var status = $('#ddlOrderStatus').val();

    if (id == "") { swal('alert', 'Please select a order', 'error') }
    else if (status == "") { swal('alert', 'Please select status', 'error') }
    else {
        var obj = { strVal: id, status: status }
    $.ajax({
        url: '/Orders/ChangeOrderStatus', dataType: 'JSON', type: 'POST',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        beforeSend: function () {
            $("#loader").show();
        },
        success: function (data) {
            if (data.status == true) {
                dataGridLoad();
                swal('alert', data.message, 'success');
            }
            else {
                swal('alert', 'something went wrong!', 'success');
            }
        },
        complete: function () {
            $("#loader").hide();
        },
        error: function (error) {
            swal('Error!', 'something went wrong', 'error');
        },

    })
    }
}
