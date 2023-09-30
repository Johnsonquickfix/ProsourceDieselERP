$(document).ready(function () {
    $("#loader").hide();
    dataGridLoad('I');
    GetDetails();
    $(document).on('click', "#btnsend", function () {
        dataGridLoad('S');
        GetDetails();
    })
    $(document).on('click', "#btninbox", function () {
        dataGridLoad('I');
        GetDetails();
    })
    $(document).on('click', "#btndraft", function () {
        dataGridLoad('D');
        GetDetails();
    }) 
    $(document).on('click', "#btnrefresh", function () { 
        dataGridLoad('I');
        GetDetails();
    })
});
document.addEventListener("DOMContentLoaded", function () {
    var listItems = document.querySelectorAll(".mail_ul li");
    listItems.forEach(function (item) {
        item.addEventListener("click", function () {
            // Remove the "active" class from all list items
            listItems.forEach(function (li) {
                li.classList.remove("active");
            });

            // Add the "active" class to the clicked list item
            this.classList.add("active");
        });
    });
});
function dataGridLoad(order_type) {
     var company = $('#ddlcompany').val();
     //let prodctype = $('#ddlproducttype').val();
    //let stockstatus = $('#ddstockstatus').val();
    //let _items = [];
    //let obj = { strValue1: company, strValue2: order_type, strValue3: prodctype, strValue4: stockstatus }; //console.log(obj);
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
        sAjaxSource: "/EmailProfile/GetList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            //aoData.push({ name: "strValue1", value: monthYear });
            aoData.push({ name: "strValue1", value: company });
            aoData.push({ name: "strValue2", value: order_type });
            aoData.push({ name: "strValue3", value: "MLST" });
            var col = 'order_id';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "email_id" : oSettings.aaSorting[0][0] == 2 ? "email_address" : oSettings.aaSorting[0][0] == 3 ? "subject" : "email_id";
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
            { data: 'email_id', title: 'ID', sWidth: "3%" },
            {
                'data': 'email_id', sWidth: "10%   ",
                'render': function (data, type, row) {
                    return '<input type = "checkbox" style = "opacity: 1; position: relative; visibility: visible; display: block" onClick="Singlecheck(this);" name="CheckSingle" value="' + $('<div/>').text(data).html() + '">';
                }
            },
            { data: 'email_address', title: '', sWidth: "10%" },
            { data: 'subject', title: '', sWidth: "30%" }, 
           /* { data: 'html_content',  title: '', sWidth: "40%" },*/
            { data: 'created_on', title: 'Post Date', sWidth: "10%" },
            {
                'data': 'email_id', title: 'Action', sWidth: "10%",
                'render': function (id, type, row) { 
                    return '<a title="Click here to view pages details" data-toggle="tooltip" href="Compose/' + id + '?entiid=' + 1 + '" onclick="ActivityLog(\'Edit mail id (' + id + ') in mail list\',\'Mail/' + id + '\');"><i class="glyphicon glyphicon-eye-open"></i></a>'
                    
                }
            }
        ],
        columnDefs: [
            { targets: [0], visible: false, searchable: false },
            { targets: [0, 1], orderable: false } 
            //{
            //    render: function (data, type, full, meta) {
            //        return "<div class='text-wrap width-50'>" + data + "</div>";
            //    },
            //    targets: 4
            //}
        ]
    });
}
function GetDetails() {
    var opt = { strValue1: '' };
    $.ajax({
        type: "POST", url: '/EmailProfile/GetmailCount', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
        success: function (result) {
            var data = JSON.parse(result);
            // console.log(data);
            if (data.length > 0) {
                $('#spninbox').text(data[0].inbox_total);
                $('#spndent').text(data[0].sent_total);
                $('#spndraft').text(data[0].droft_total);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { swal('Alert!', errorThrown, "error"); },
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
