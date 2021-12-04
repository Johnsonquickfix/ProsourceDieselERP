$(document).ready(function () {
    $("#loader").hide();
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    GetActivity(id);
    GetActivityList(id);
})

function GetActivity(id) {
    var obj = { strValue1: id };
    $.ajax({
        url: "/GiftCard/GetGCActivity",
        type: "Post", contentType: "application/json; charset=utf-8", dataType: 'json',
        data: JSON.stringify(obj),
        success: function (data) {
            data = JSON.parse(data);
            $("#lblCode").text(data[0].code);
            $("#btnStatus").text(data[0].status);
            $("#lblDeliveryStatus").text(data[0].delivery);
            $("#lblAvailableBalance").text('$' + parseFloat(data[0].remaining).toFixed(2));
            $("#lblCreationDate").text(data[0].create_date);
            $("#lblOrder").text(data[0].order_id);
            $("#lblIssuedValue").text('$' + data[0].balance);
            $("#lblRedeemDate").text(data[0].RedeemedDate);
            $("#lblRedeemBy").text(data[0].RedeemedBy);
            $("#txtFrom").val(data[0].sender);
            $("#txtto").val(data[0].recipient);
            $("#txtMessage").val(data[0].message);
            $("#txtDeliveryDate").val(data[0].DeliveryDate);
            $("#txtExpirationDate").val(data[0].expires);
        }
    });
}

function GetActivityList(id) {

    var urlParams = new URLSearchParams(window.location.search);
    let searchText = urlParams.get('name') ? urlParams.get('name') : '';


    let table = $('#GiftCardActivityList').DataTable({
        oSearch: { "sSearch": searchText },
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        scrollX: true, scrollY: ($(window).height() - 215),
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
        sAjaxSource: "/GiftCard/GetGCActivityList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: id });
            var col = 'id';
            if (oSettings.aaSorting.length > 0) { aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data }); }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [
            { data: 'gc_code', title: 'Gift Card', sWidth: "20%" },
            { data: 'user_email', title: 'Customer', sWidth: "20%" },
            { data: 'type', title: 'Event', sWidth: "20%" },
            { data: 'amount', title: 'Amount', sWidth: "20%" },
            { data: 'date', title: 'Date', sWidth: "20%" },
        ]
    });
}
