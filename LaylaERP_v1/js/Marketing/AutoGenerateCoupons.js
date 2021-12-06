$(document).ready(function () {
    setTimeout(function () { dataGridLoad(''); }, 100);
});


function dataGridLoad(order_type) {

    types = "0";
    $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        //sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true,
        bAutoWidth: false, scrollX: false, scrollY: ($(window).height() - 215),
        responsive: true,
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        sAjaxSource: "/Coupons/AutoGenerateGetList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            //aoData.push({ name: "strValue1", value: monthYear });
            aoData.push({ name: "strValue1", value: types });
            aoData.push({ name: "strValue2", value: order_type });
            aoData.push({ name: "strValue3", value: null });
            var col = 'order_id';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 2 ? "ID" : oSettings.aaSorting[0][0] == 3 ? "post_title" : oSettings.aaSorting[0][0] == 4 ? "discount_type" : "ID";
                aoData.push({ name: "sSortColName", value: col });
            }
            //console.log(aoData);
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        columns: [
            //{
            //    'data': 'ID', sWidth: "5%   ",
            //    'render': function (data, type, full, meta) {
            //        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck(this);" value="' + $('<div/>').text(data).html() + '"><label></label>';
            //    }
            //},       
            { data: 'post_title', title: 'Code', sWidth: "16%" },
            { data: 'discount_type', title: 'Coupon Type', sWidth: "10%" },
            { data: 'coupon_amount', title: 'Coupon amount', sWidth: "10%" },
            { data: 'post_excerpt', title: 'Description', sWidth: "12%" },
            {
                data: 'product_ids', title: 'Product IDs', sWidth: "20%",
                'render': function (data, type, full, meta) {
                    return '<span class="linking_product_ids">' + data + '</span>'
                }
            },
            { data: 'UsageLimit', title: 'Usage/Limit', sWidth: "10%" },
            { data: 'date_expires', title: 'Expiry date', sWidth: "12%" },
            {
                'data': 'ID', title: 'Action', sWidth: "9%",
                'render': function (id, type, full, meta) {
                    if ($("#hfEdit").val() == "1") {
                        return '<a href="NewAutoGenerate/' + id + '"><i class="glyphicon glyphicon-eye-open"></i></a>'
                    }
                    else { return "No Permission"; }
                }
            }
        ]
    });
}






