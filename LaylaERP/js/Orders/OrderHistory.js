
function dataGridLoad() {
    debugger
    $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true,
        bAutoWidth: true, scrollX: true, scrollY: ($(window).height() - 215),
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        sAjaxSource: "/Orders/GetOrderList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            //obj.Search = aoData[45].value;
            //var col = 'id';
            //if (oSettings.aaSorting.length > 0) {
            //    var col = oSettings.aaSorting[0][0] == 2 ? "user_nicename" : oSettings.aaSorting[0][0] == 3 ? "user_email" : oSettings.aaSorting[0][0] == 4 ? "status" : oSettings.aaSorting[0][0] == 5 ? "meta_value" : oSettings.aaSorting[0][0] == 6 ? "user_registered" : "id";
            //    obj.SortCol = col; obj.SortDir = oSettings.aaSorting.length > 0 ? oSettings.aaSorting[0][1] : "desc";
            //}
            //obj.sEcho = aoData[0].value; obj.PageSize = oSettings._iDisplayLength; obj.PageNo = oSettings._iDisplayStart;
            debugger
            $.ajax({
                type: "POST", url: sSource, async: true, contentType: "application/json; charset=utf-8", dataType: "json", data:[],
                success: function (data) {
                    //var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, iTotalRecords: data.iTotalRecords, iTotalDisplayRecords: data.iTotalDisplayRecords, aaData: JSON.parse(data.aaData) };
                    //return fnCallback(dtOption);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
                async: false
            });
        },
        aoColumns: [
            {
                'data': 'order_id', sWidth: "10%",
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '">';
                }
            },
            { data: 'order_id', title: 'Order ID', sWidth: "10%" },
            { data: 'customer_id', title: 'Customer ID', sWidth: "15%" },
            { data: 'meta_value', title: 'First Name', sWidth: "15%" },
            { data: 'meta_value', title: 'Last Name', sWidth: "10%" },
            { data: 'num_items_sold', title: 'No. of Items', sWidth: "10%" },
            { data: 'total_sales', title: 'Order Total', sWidth: "10%" },
            { data: 'status', title: 'Status', sWidth: "10%" },
            { data: 'date_created', title: 'Creation Date', sWidth: "10%" },

            {
                'data': 'order_id', sWidth: "5%",
                'render': function (id, type, full, meta) {
                    return '<a href="../Customer/NewUser/' + id + '"><i class="glyphicon glyphicon-pencil"></i></a>'
                }
            }
        ]
    });
}