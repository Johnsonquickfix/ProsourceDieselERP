$(document).ready(function () {
    var loc = window.location.pathname;

    CheckPermissions("#btnAddUser", "#hfEdit", "", loc);
    //CheckPermissions("#customer-section-top", "#hfEdit", "", loc);
    CheckPermissions("#role-ul", "#hfEdit", "", loc);

    $('#checkAll').click(function () {
        var isChecked = $(this).prop("checked");
        $('#dtdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
    });


    $('#btnChange').click(function () {
        var id = "";
        $("input:checkbox[name=CheckSingle]:checked").each(function () {
            id += $(this).val() + ",";
        });
        id = id.replace(/,(?=\s*$)/, '');
        if (id == "") { swal('Alert', 'Please select customers from list', 'error'); }
        else {
            swal({
                title: '', text: "Do you want to change the status ?", type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#3085d6', confirmButtonText: 'Yes',
            }).then((result) => {
                if (result.value) {
                    ChangeStatus(id);
                    dataGridLoad();
                }
            })
        }
        $("#checkAll").prop('checked', false);
    })
    dataGridLoad();


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

function getUrlVars() {
    // debugger
    //var sPageURL = decodeURIComponent(window.location.search.substring(1));
    //sPageURL = sPageURL.split('name=');
    //var sURLVariables = sPageURL.toString().replace(',', '');
    let sURLVariables = localStorage.getItem('_search');
    localStorage.setItem('_search', '')
    return sURLVariables
}

function ChangeStatus(id) {
    // debugger
    var status = $("#ddlUserStatus").val();
    let custStatus = status == "0" ? "active" : "inactive"
    var obj = { strVal: id, user_status: status }

    $.ajax({
        url: '/Customer/ChangeCustomerStatus/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == true) {
                ActivityLog('Change customer status ' + custStatus + '', '/Customer/Customer/' + id + '');
                swal('Success!', data.message, 'success');
            }
            else {
                swal('Error!', data.message, 'error')
            }
        },
        error: function (error) {
            swal('Error!', 'something went wrong', 'error');
        },
    })
}

//-------------------------------------------------------------------
//    Fill Grid
//-------------------------------------------------------------------

function dataGridLoad() {
    //let urid = $("#txtorderpono").val();
    //let sd = $('#txtDate').data('daterangepicker').startDate.format('MM-DD-YYYY');
    //let ed = $('#txtDate').data('daterangepicker').endDate.format('MM-DD-YYYY');
    if ($('#txtDate').val() == '') { sd = ''; ed = '' };
    let gentable = $('#dtdata').DataTable({
        /*   columnDefs: [{ "orderable": false, "targets": 0 }], order: [[0, "asc"]],*/
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
        /*   responsive: true, lengthMenu: [[10, 20, 30, 40], [10, 20, 30, 40]],*/
        responsive: true, lengthMenu: [[10], [10]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        //initComplete: function () {
        //    $('.dtdatagenrated_filter input').unbind();
        //    $('.dtdatagenrated_filter input').bind('keyup', function (e) {
        //        var code = e.keyCode || e.which;
        //        if (code == 13) { gentable.search(this.value).draw(); }
        //    });
        //},
        initComplete: function () {
            $('#dtdata_filter input').unbind();
            $('#dtdata_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { gentable.search(this.value).draw(); }
            });
        },
        sAjaxSource: "/DonationHaul/GetCustmerDonationHaulList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue1", value: '' }, { name: "strValue2", value: '' });
            aoData.push({ name: "strValue3", value: '' }, { name: "strValue4", value: 'SERCH' });
            var col = 'order_id';
            if (oSettings.aaSorting.length > 0) {
                //var col = oSettings.aaSorting[0][0] == 2 ? "refordervendor" : oSettings.aaSorting[0][0] == 3 ? "vendor_name" : oSettings.aaSorting[0][0] == 4 ? "vendor_name" : oSettings.aaSorting[0][0] == 5 ? "city" : oSettings.aaSorting[0][0] == 6 ? "zip" : oSettings.aaSorting[0][0] == 6 ? "date_livraison" : oSettings.aaSorting[0][0] == 7 ? "Status" : "ref";
                aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data });

            }
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
            {
                'data': 'id', sWidth: "5%   ",
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '"><label></label>';
                }
            },
            { data: 'id', title: 'Cust ID', sWidth: "8%" },
            { data: 'name', title: 'Customer Name', sWidth: "14%" },
            { data: 'user_email', title: 'E-mail', sWidth: "23%" }, 
            { data: 'billing_phone', title: 'Phone', sWidth: "10%" },
            {
                'data': 'id', sWidth: "15%", "bSearchable": false,
                'render': function (ID, type, full, meta) {

                    return '<a href="javascript:void(0);" class="badge bg-default" onClick="send_mail(\'' + ID + '\',\'' + full.user_email + '\'); " data-toggle="tooltip" title="Send Mail">Send Mail <a>';


                }

            },
        ],

    });
}
function dataGridLoadold() {
    let _searchText = localStorage.getItem('_search');
    localStorage.setItem('_search', '')
    var urid = parseInt($("#ddlSearchStatus").val()) || "";
    var sid = ""//$('#txtSearch').val() ;
    var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 10, sEcho: 1, SortCol: 'id', SortDir: 'desc' };
    table_oh = $('#dtdata').DataTable({
        oSearch: { "sSearch": _searchText }, columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true,
        bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
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
        sAjaxSource: "/Customer/GetCustomerList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            obj.Search = aoData[45].value;
            var col = 'id';
            if (oSettings.aaSorting.length > 0) {
                //var col = oSettings.aaSorting[0][0] == 2 ? "user_nicename" : oSettings.aaSorting[0][0] == 3 ? "user_email" : oSettings.aaSorting[0][0] == 4 ? "status" : oSettings.aaSorting[0][0] == 5 ? "meta_value" : oSettings.aaSorting[0][0] == 6 ? "user_registered" : "id";
               // obj.SortCol = col; obj.SortDir = oSettings.aaSorting.length > 0 ? oSettings.aaSorting[0][1] : "desc";
                aoData.push({ name: "sSortColName", value: oSettings.aoColumns[oSettings.aaSorting[0][0]].data });
            }
            obj.sEcho = aoData[0].value; obj.PageSize = oSettings._iDisplayLength; obj.PageNo = oSettings._iDisplayStart;
            $.ajax({
                type: "POST", url: sSource, async: true, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
                success: function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, iTotalRecords: data.iTotalRecords, iTotalDisplayRecords: data.iTotalDisplayRecords, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
                //  async: false
            });
        },
        aoColumns: [
            {
                'data': 'id', sWidth: "5%   ",
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + $('<div/>').text(data).html() + '"><label></label>';
                }
            },
            { data: 'id', title: 'Cust ID', sWidth: "8%" },
            { data: 'name', title: 'Customer Name', sWidth: "14%" },
            { data: 'user_email', title: 'E-mail', sWidth: "23%" },
            { data: 'status', title: 'Status', sWidth: "8%" },
            { data: 'billing_phone', title: 'Phone', sWidth: "10%" },
            { data: 'user_registered', title: 'Registration Date', sWidth: "17%" },
           { data: 'billing_phone', title: 'Phone', sWidth: "10%" },
             
        ]
    });
}

function send_mail(id, user_email) {
  //  console.log(id);
   // console.log(user_email);

    if (id > 0) {
        var option = { strValue1: id };
       // $.get("/DonationHaul/donationcus-print", option).then(response => { send_mail(id, response, false); }).catch(err => { });

        

        $.post("/DonationHaul/donationcusmail",
            {
                id: id, quote_header: user_email
            }).then(response => {
                swal('Success', 'Your email sent to the customer email.', "success");
            }).catch(err => { swal('Error!', err, "error"); });
    }
}
//function send_mail(id, result, is_inv) {
//    let data = JSON.parse(result.data); //console.log(result);
//    let inv_title = is_inv ? 'Bill' : 'Bill';
//    let inv_titleNew = 'BILL', po_authmail = data['po'][0].po_authmail;
//    let so_no = parseInt(data['po'][0].fk_projet) || 0;
//    let total_qty = 0, total_gm = 0.00, total_tax = 0.00, total_shamt = 0.00, total_discamt = 0.00, total_other = 0.00, paid_amt = 0.00; total_net = 0.00; disc_amt = 0.00

//    let startingNumber = parseFloat(data['po'][0].fk_paymentterm) || 0.00;
//    //let _com_add = result.com_name + ', <br>' + result.add + ', <br>' + result.city + ', ' + result.state + ' ' + result.zip + ', <br>' + (result.country == "CA" ? "Canada" : result.country == "US" ? "United States" : result.country) + '.<br>';
//    //_com_add += 'Phone: ' + result.phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + ' <br> ' + result.email + ' <br> ' + result.website;
//    let _com_add = data['com'][0].com_name + ', <br>' + data['com'][0].add + ', <br>' + data['com'][0].city + ', ' + data['com'][0].state + ' ' + data['com'][0].zip + ', <br>' + (data['com'][0].country == "CA" ? "Canada" : data['com'][0].country == "US" ? "United States" : data['com'][0].country) + '.<br>';
//    _com_add += 'Phone: ' + data['com'][0].phone.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + ' <br> ' + data['com'][0].email + ' <br> ' + data['com'][0].website;

//    total_shamt = parseFloat(data['po'][0].shippingfee) || 0.00;
//    total_other = parseFloat(data['po'][0].otherfee) || 0.00;

//    let myHtml = '<table id="Misc_Bills" cellpadding="0" cellspacing="0" border="0" style="width:100%;">';
//    myHtml += '<tr>';
//    myHtml += '    <td align="center" style="padding:0;">';
//    myHtml += '        <table class="container_table" cellpadding="0" cellspacing="0" border="0" style="border:2px solid #e6e6e6; width:995px">';
//    myHtml += '            <tr>';
//    myHtml += '                <td style="padding:15px;">';
//    myHtml += '                    <table cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed;width:100%;border-bottom: 1px solid #ddd;">';
//    myHtml += '                        <tr>';

//    myHtml += '                            <td style="padding:0; vertical-align: top;width:50.9%">';
//    /* myHtml += '            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:0px 0px 15px 0px;;color:#2c2e2f;font-weight:200;">Sold to:</h3>';*/
//    myHtml += '                                <img src="https://laylaerp.com/Images/layla1-logo.png" alt="" width="95" height="41" class="logo-size"/>';
//    myHtml += '                                <p style="margin:15px 0px;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">' + _com_add + '</p>';
//    myHtml += '                            </td>';
//    myHtml += '                            <td style="padding:0; vertical-align: top; width:50.1%" align="right">';
//    myHtml += '                                <table cellpadding="0" cellspacing="0" border="0">';
//    myHtml += '                                    <tr>';
//    myHtml += '                                        <td colspan="2" style="padding:0px 2.5px 0px 0px">';
//    myHtml += '                                            <h2 class="pageCurl" style="color:#9da3a6;font-family: sans-serif;font-weight: 700;margin:0px 0px 8px 0px;font-size: 30px;">' + inv_titleNew.toUpperCase() + '</h2>';
//    myHtml += '                                        </td>';
//    myHtml += '                                    </tr>';
//    myHtml += '                                    <tr>';
//    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">' + inv_title + ' No #:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].ref + '</td>';
//    myHtml += '                                    </tr>';
//    myHtml += '                                    <tr>';
//    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;"> Date:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].date_creation + '</td>';
//    myHtml += '                                    </tr>';


//    myHtml += '                                    <tr>';
//    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Transaction Type:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].transaction_t + '</td>';
//    myHtml += '                                    </tr>';
//    //myHtml += '                                    <tr>';
//    //myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Customer Type:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].customertype + '</td>';
//    //myHtml += '                                    </tr>';
//    //myHtml += '                                    <tr>';
//    //myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Address:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].fk_address + '</td>';
//    //myHtml += '                                    </tr>';
//    myHtml += '                                    <tr>';
//    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Bill Type:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].paymenttype + '</td>';
//    myHtml += '                                    </tr>';
//    myHtml += '                                    <tr>';
//    myHtml += '                                        <td style="font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4; padding:0px 2.5px;">Pay Account:</td><td style=" padding:0px 2.5px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">' + data['po'][0].payaccount + '</td>';
//    myHtml += '                                    </tr>';

//    myHtml += '                                    <tr>';
//    myHtml += '                                        <td style = "font-family:sans-serif;font-size:15px;color:#4f4f4f;line-height:1.4;padding:15px 2.5px;text-align: right;" colspan = "2">';
//    myHtml += '                                            <a href="' + data['po'][0].base_url + '/paymentinvoice/bill-accept?key=' + data['po'][0].row_key + '&id=' + result.en_id + '{_para}" target="_blank" style="margin:12px;min-width:110px;background-color:#0070BA;color:#fff;font-size:12px;box-sizing:border-box!important;padding: 8px;border-radius:5px;font-weight:600;">Approve</a> ';
//    myHtml += '                                            <a href="' + data['po'][0].base_url + '/paymentinvoice/bill-reject?key=' + data['po'][0].row_key + '&id=' + result.en_id + '{_para}" target="_blank" style="margin:12px;min-width:110px;background-color:#ff4100;color:#fff;font-size:12px;box-sizing:border-box!important;padding: 8px;border-radius:5px;font-weight:600;">Disapprove</a>';
//    myHtml += '                                        </td>';
//    myHtml += '                                    </tr>';
//    myHtml += '                                </table>';
//    myHtml += '                            </td>';
//    myHtml += '                        </tr >';
//    myHtml += '                    </table >';
//    myHtml += '                </td >';
//    myHtml += '            </tr >';
//    myHtml += '<tr>';
//    myHtml += '<td style="padding:0px 15px 0px 15px;">';
//    myHtml += '    <table cellpadding="0" cellspacing="0" border="0">';
//    myHtml += '    <tr>';
//    myHtml += '        <td style="padding:0;">';
//    myHtml += '            <h3 class="billto" style="font-family: sans-serif;font-size:20px;margin:0px 0px 5px 0px;;color:#2c2e2f;font-weight:200;">' + data['po'][0].customertype + ' :</h3>';
//    myHtml += '            <p class="recipientInfo" style="width: 225px;margin:0px 0px 15px 0px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;">';
//    myHtml += '               ' + data['po'][0].displayname + '<br>' + data['po'][0].fk_address;
//    myHtml += '            </p>';
//    myHtml += '        </td>';
//    myHtml += '     </tr>';
//    myHtml += '     </table>';
//    myHtml += '</td >';
//    myHtml += '</tr >';
//    myHtml += '<tr>';
//    myHtml += '<td style="padding:0px 15px 0px 15px;">';
//    myHtml += '    <table class="product-tables" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">';
//    myHtml += '        <thead class="itemdetailsheaderl" style="border: 1px solid #ddd;background-color: #f9f9f9;">';
//    myHtml += '            <tr>';
//    myHtml += '                <th style="width:3%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">#</th>';
//    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemsaccount">Account</th>';
//    myHtml += '                <th style="width:25%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemsproduct">Description</th>';
//    //myHtml += '                <th style="width:15%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">Description</th>';
//    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemsku">SKU</th>';
//    myHtml += '                <th style="width:10%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">Quantity</th>';
//    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">Price</th>';
//    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">Tax</th>';
//    myHtml += '                <th style="width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">Amount</th>';
//    myHtml += '            </tr>';
//    myHtml += '        </thead>';
//    myHtml += '        <tbody class="itemdetailsbody">';
//    $(data['pod']).each(function (index, tr) {

//        myHtml += '<tr style="border-bottom: 1px solid #ddd;">';
//        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="items">' + tr.sr + '</td>';
//        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemaccount">' + tr.label + '</td>';
//        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemsproduct">' + tr.product + '</td>';
//        // myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemdescription">' + tr.discription + '</td>';
//        myHtml += '    <td style="padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemsku">' + tr.sku + '</td>';
//        myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemquantity">' + number_format(tr.qty, 0, '.', ',') + '</td>';
//        myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">$' + number_format(tr.rate, 2, '.', ',') + '</td>';
//        myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemprice">$' + number_format(tr.tax, 2, '.', ',') + '</td>';
//        myHtml += '    <td style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;" class="itemamount">$' + number_format(tr.total_ttc + tr.tax, 2, '.', ',') + '</td>';
//        myHtml += '</tr>';
//        total_qty += tr.qty, total_gm += tr.total_ttc, total_tax += tr.tax, total_net += tr.total_ttc + tr.tax;


//    });
//    myHtml += '        </tbody>';
//    myHtml += '    </table>';
//    myHtml += '</td>';
//    myHtml += '</tr >';
//    myHtml += '<tr>';
//    myHtml += '<td style="padding:0px 15px 15px 15px;">';
//    myHtml += '    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">';
//    myHtml += '        <tr>';
//    myHtml += '            <td style="vertical-align: top; width:50%;padding:0px;">';
//    myHtml += '                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;width: 100%; table-layout: fixed;">';

//    myHtml += '                    <tr>';
//    myHtml += '                        <td style="border-top: 1px solid #ddd;padding:0px;">';
//    //if (so_no < 0) { myHtml += ''; }
//    //else {
//    myHtml += '                        <table style="border-collapse: collapse;width: 100%; table-layout: fixed;font-family:sans-serif;font-size:12px;">';
//    myHtml += '                            <thead style="border: 1px solid #ddd;background-color: #f9f9f9;">';
//    myHtml += '                                <tr>';
//    myHtml += '                                    <th style="text-align:left;width:20%;padding:2px 5px;">Payment</th>';
//    myHtml += '                                    <th style="text-align:right;width:25%;padding:2px 5px;">Amount</th>';
//    myHtml += '                                    <th style="text-align:right;width:25%;padding:2px 5px;">Discount</th>';
//    myHtml += '                                    <th style="text-align:left;width:30%;padding:2px 5px;">Type</th>';
//    myHtml += '                                    <th style="text-align:left;width:25%;padding:2px 5px;">Num</th>';
//    myHtml += '                                </tr>';
//    myHtml += '                            </thead>';
//    myHtml += '                            <tbody style="border:1px solid #ddd;">';
//    $(data['popd']).each(function (index, trpd) {
//        myHtml += '<tr style="border-bottom: 1px solid #ddd;">';
//        myHtml += '    <td style="width:20%;padding:2px 5px;">' + trpd.datec + '</td>';
//        myHtml += '    <td style="text-align:right;width:20%;padding:2px 5px;">$' + number_format(trpd.amount, 2, '.', ',') + '</td>';
//        myHtml += '    <td style="text-align:right;width:20%;padding:2px 5px;">$' + number_format(trpd.discount, 2, '.', ',') + '</td>';
//        myHtml += '    <td style="width:20%;padding:2px 5px;">' + trpd.paymenttype + '</td>';
//        myHtml += '    <td style="width:20%;padding:2px 5px;">' + trpd.num_payment + '</td>';
//        myHtml += '</tr>';
//        paid_amt += trpd.amount
//        disc_amt += trpd.discount
//    });
//    myHtml += '                            </tbody>';
//    myHtml += '                        </table>';
//    //} 
//    console.log(disc_amt);
//    myHtml += '                        </td>';
//    myHtml += '                    </tr>';

//    myHtml += '                </table>';
//    myHtml += '            </td>';
//    myHtml += '            <td style="vertical-align: top; width:50%; padding:0px;">';
//    myHtml += '                <table cellpadding="0" cellspacing="0" style="border:1px solid #ddd;border-top:0px;border-collapse: collapse;width: 100%; table-layout: fixed;">';
//    myHtml += '                    <tr>';
//    myHtml += '                        <td class="text-right" style="width: 25%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">' + number_format(total_qty, 0, '.', ',') + '</td>';
//    myHtml += '                        <td class="text-right" style="border-right: 1px solid #ddd; width: 30%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Subtotal</td>';
//    myHtml += '                        <td class="text-right" style="width: 30%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_gm, 2, '.', ',') + '</td>';
//    myHtml += '                    </tr>';

//    myHtml += '                    <tr>';
//    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Amount tax</td>';
//    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_tax, 2, '.', ',') + '</td>';
//    myHtml += '                    </tr>';

//    myHtml += '                    <tr>';
//    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Shipping Fee</td>';
//    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_shamt, 2, '.', ',') + '</td>';
//    myHtml += '                    </tr>';

//    myHtml += '                    <tr>';
//    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Other Charges</td>';
//    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_other, 2, '.', ',') + '</td>';
//    myHtml += '                    </tr>';

//    myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
//    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Total</td>';
//    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_net + total_other + total_shamt, 2, '.', ',') + '</td>';
//    myHtml += '                    </tr>';


//    myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
//    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Payment Terms (' + startingNumber + '%)</td>';
//    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(((total_net + total_other + total_shamt) * (startingNumber / 100)), 2, '.', ',') + '</td>';
//    myHtml += '                    </tr>';

//    myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
//    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Paid</td>';
//    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(paid_amt + disc_amt, 2, '.', ',') + '</td>';
//    myHtml += '                    </tr>';

//    myHtml += '                    <tr class="invoiceTotal" style="background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;">';
//    myHtml += '                        <td colspan="2" class="text-right" style="border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">Remaining Unpaid</td>';
//    myHtml += '                        <td class="text-right" style="padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;">$' + number_format(total_net + total_other + total_shamt - paid_amt - disc_amt, 2, '.', ',') + '</td>';
//    myHtml += '                    </tr>';


//    myHtml += '                </table>';
//    myHtml += '            </td>';
//    myHtml += '        </tr>';
//    myHtml += '    </table>';
//    myHtml += '</td>';
//    myHtml += '</tr>';
//    myHtml += '</table > ';
//    myHtml += '</td > ';
//    myHtml += '</tr > ';
//    myHtml += '</table >';

//    let opt = { strValue1: po_authmail, strValue2: data['po'][0].ref, strValue3: myHtml, strValue5: _com_add }
//    console.log(opt);
//    //let opt = { strValue1: 'johnson.quickfix@gmail.com', strValue2: data['po'][0].ref, strValue3: myHtml, strValue5: _com_add }
//    if (opt.strValue1.length > 5) {
//        $.ajax({
//            type: "POST", url: '/PaymentInvoice/SendMailBillApproval', contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(opt),
//            success: function (result) { console.log(result); },
//            error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
//            complete: function () { }, async: false
//        });
//    }
//}

 

 

 