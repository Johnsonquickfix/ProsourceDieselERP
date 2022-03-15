﻿$(document).ready(function () {
    var loc = window.location.pathname;
    
    CheckPermissions("#btnAddUser", "#hfEdit", "", loc);
    //CheckPermissions("#customer-section-top", "#hfEdit", "", loc);
    CheckPermissions("#role-ul", "#hfEdit", "", loc);
    $("#btnSearch").click(function () { dataGridLoad(); return false; });
    $('#checkAll').click(function () {
        var isChecked = $(this).prop("checked");
        $('#dtdata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
    });
    $('#btnApply').click(function () {
        var id = "", status = $("#ddlStatus").val();
        $("input:checkbox[name=CheckSingle]:checked").each(function () {
            id += $(this).val() + ",";
        });
        if (id == "") { swal('Alert', 'Please select customers from list', 'error'); }
        else if (status == "1") { swal('Alert', 'Please select bulk action', 'error'); }
        else {
            swal({ title: '', text: "Do you want to do bulk action ?", type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#3085d6', confirmButtonText: 'Yes' }).
                then((result) => {
                    if (result.value) {
                        id = id.replace(/,(?=\s*$)/, '');
                        DeleteCustomer(id);
                        dataGridLoad();
                    }
                })
        }
    })

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
function AddCustomer() {
    ID = $("#hfid").val();
    Email = $("#txtUserEmail").val();
    NickName = $("#txtUserEmail").val();
    FirstName = $("#txtFirstName").val();
    LastName = $("#txtLastName").val();
    BillingAddress1 = $("#txtBillingAddress1").val();
    BillingAddress2 = $("#txtBillingAddress2").val();
    BillingPostcode = $("#txtBillingPostCode").val();
    BillingCountry = $("#txtBillingCountry").val();
    BillingState = $("#txtBillingState").val();
    BillingCity = $("#txtBillingCity").val();
    BillingPhone = $("#txtBillingPhone").val();
    //if (NickName == "") {
    //    swal('Alert', 'Please Enter User Name', 'error').then(function () { swal.close(); $('#txtUserNickName').focus(); })
    //}
    if (Email == "") {
        swal('Alert', 'Please enter email', 'error').then(function () { swal.close(); $('#txtUserEmail').focus(); })
    }

    else if (FirstName == "") {
        swal('Alert', 'Please enter first name', 'error').then(function () { swal.close(); $('#txtFirstName').focus(); })
    }

    else if (LastName == "") {
        swal('Alert', 'Please enter last name', 'error').then(function () { swal.close(); $('#txtLastName').focus(); })
    }
    else if (BillingPhone == "") {
        swal('Alert', 'Please enter contact number', 'error').then(function () { swal.close(); $('#txtBillingPhone').focus(); })
    }
    else if (BillingAddress1 == "") {
        swal('Alert', 'Please enter address', 'error').then(function () { swal.close(); $('#txtBillingAddress1').focus(); })
    }
    /* else if (BillingAddress2 == "") { swal('Alert', 'Please Enter Address 2', 'error') }*/
    else if (BillingCity == "") {
        swal('Alert', 'Please enter city', 'error').then(function () { swal.close(); $('#txtBillingCity').focus(); })
    }
    else if (BillingState == null) {
        swal('Alert', 'Please enter state', 'error').then(function () { swal.close(); $('#txtBillingState').focus(); })
    }
    else if (BillingPostcode == "") {
        swal('Alert', 'Please enter zip code', 'error').then(function () { swal.close(); $('#txtBillingPostCode').focus(); })
    }

    else if (BillingCountry == "") {
        swal('Alert', 'Please enter country', 'error').then(function () { swal.close(); $('#txtBillingCountry').focus(); })
    }

    else {
        $("#txtBillingPostCode").change();
        if ($("#hfzipstatus").val() == "true") {
            var obj = {
                ID: ID,
                user_email: Email, user_nicename: NickName, first_name: FirstName, last_name: LastName, billing_address_1: BillingAddress1,
                billing_address_2: BillingAddress2, billing_postcode: BillingPostcode, billing_country: BillingCountry,
                billing_state: BillingState, billing_city: BillingCity, billing_phone: BillingPhone
            }
            $.ajax({
                url: '/Customer/NewUser/', dataType: 'json', type: 'Post',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(obj),
                dataType: "json",
                beforeSend: function () {
                    $("#loader").show();
                },
                success: function (data) {
                    if (data.status == true) {
                        if (data.url == "Manage") {
                            swal('Success', data.message, 'success').then((result) => { location.href = '../Customer'; });
                        }
                        else {
                            $('#fetch_results > input:text').val('');
                            swal('Alert!', data.message, 'success').then((result) => { location.href = 'Customer'; });
                        }
                        // swal('Alert!', data.message, 'success');
                        $("#parent").find(":input").each(function () {
                            switch (this.type) {
                                case "text":
                                case "email":
                                case "tel":
                                    $(this).val('');
                                    break;
                            }
                        });
                    }
                    else {
                        //swal('Alert!', data.message, 'error')
                    }
                },
                complete: function () {
                    $("#loader").hide();
                    isEdit(false);
                },
                error: function (error) {
                    swal('Error!', 'something went wrong', 'error');
                },
            })
        }
    }

}

function getdatabyzip() {
    var BillingPostcode = $("#txtBillingPostCode").val();
    $.ajax({
        url: "https://ziptasticapi.com/" + BillingPostcode,
        type: "GET",
        dataType: 'JSON',
        data: [],
        success: function (data) {
            $("#txtBillingCountry").val(data.country);
            $("#txtBillingState").val(data.state);
            $("#txtBillingCity").val(data.city);
        },
        error: function (msg) {
            swal('Alert!', msg, 'error')
        }
    });

}

function UpdateCustomerStatus() {
    var obj = { strVal: ID }
    $.ajax({
        url: '/Customer/UpdateCustomer/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == true) {
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

function DeleteCustomer(id) {
    var obj = { strVal: id }
    $.ajax({
        url: '/Customer/DeleteCustomer/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            if (data.status == true) {
                ActivityLog('Applied bulk action delete for customer id (' + id + ')', '/Customer/Customer/' + id + '');
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
    let _searchText = localStorage.getItem('_search');
    localStorage.setItem('_search', '')
    var urid = parseInt($("#ddlSearchStatus").val()) || "";
    var sid = ""//$('#txtSearch').val() ;
    var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 10, sEcho: 1, SortCol: 'id', SortDir: 'desc' };
    table_oh =  $('#dtdata').DataTable({
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
                var col = oSettings.aaSorting[0][0] == 2 ? "user_nicename" : oSettings.aaSorting[0][0] == 3 ? "user_email" : oSettings.aaSorting[0][0] == 4 ? "status" : oSettings.aaSorting[0][0] == 5 ? "meta_value" : oSettings.aaSorting[0][0] == 6 ? "user_registered" : "id";
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
            {
                'data': 'id', sWidth: "8%",
                'render': function (id, type, full, meta) {
                    if ($("#hfEdit").val() == "1") {
                        return '<a href="../Customer/NewUser/' + id + '" data-toggle="tooltip" data-placement="left" title="View/Edit customer" onclick="ActivityLog(\' edit customer id ' + id + ' in manage customer\',\'/Customer/NewUser/' + id + '\');"><i class="glyphicon glyphicon-pencil"></i></a>';
                    }
                    else { return "No Permission"; }
                }
            }
        ]
    });
}

function GetCustomerByID(id) {
  
    var ID = id;
    if (ID == "NewUser") { $('#lbltitle').text("Add New Customer"); } else { $('#lbltitle').text("Update Customer"); }
    var obj =
        $.ajax({
            url: "/Customer/GetCustomerByID/" + ID,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            success: function (data) {

                var d = JSON.parse(data);
                console.log(d);
                //debugger
                if (d.length > 0) {
                    $("#txtUserEmail").val(d[0].user_email);
                    $("#txtUserNickName").val(d[0].user_nicename);
                    $("#txtFirstName").val(d[0].first_name);
                    $("#txtLastName").val(d[0].last_name);
                    $("#txtBillingAddress1").val(d[0].billing_address_1);
                    $("#txtBillingAddress2").val(d[0].billing_address_2);
                    $("#txtBillingPostCode").val(d[0].billing_postcode);
                    $("#txtBillingCountry").val(d[0].billing_country);
                    $("#txtBillingState").select2('').empty().select2({ data: [{ name: d[0].StateFullName, id: d[0].billing_state, text: d[0].StateFullName }] })
                    //$("#txtBillingState").select2('destroy').empty().select2({ data: [{ value: d[0].billing_state, text: d[0].billing_state }] });
                    $("#txtBillingCity").val(d[0].billing_city);
                    $("#txtBillingPhone").val(d[0].billing_phone);
                    $("#txtBillingState").select2({
                        allowClear: true, minimumInputLength: 2, placeholder: "Search State",
                        ajax: {
                            url: '/Users/GetCustState', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
                            data: function (params) { var obj = { strValue1: params.term, strValue2: $("#txtBillingCountry").val() }; return JSON.stringify(obj); },
                            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.StateFullName, name: item.StateFullName, id: item.State } }) }; },
                            error: function (xhr, status, err) { }, cache: true
                        }
                    });
                    $('#txtUserEmail').attr('readonly', true);
                    bindCustomerOrders(ID);
                }
            },
            error: function (msg) { alert(msg); },
            async: false
        });
    $("#txtBillingPostCode").change();
}

 

function bindCustomerOrders(id) {
    //let opt = { strValue1: parseInt(id) || 0 };
    //$.post('/Customer/GetCustomersAddresssList', opt).then(response => {
    //    console.log(response);
    //    $('#tblCusOrders').dataTable({           
    //        destroy: true, data: JSON.parse(response), 
    //        columns: [
                
    //            {
    //                data: 'meta_data', title: 'BILLING ADDRESS', sWidth: "35%", render: function (data, type, dtrow) {
    //                    let row = JSON.parse(dtrow.meta_data);
    //                    //let val = '<address class="no-margin">' + row._billing_first_name + ' ' + row._billing_last_name + (!isNullAndUndef(dtrow.IsDefault) ? ' <span class="label label-success">' +  dtrow.IsDefault + '</span>' : '') + (isNullUndefAndSpace(row._billing_company) ? '<br>' + row._billing_company : '') + (isNullUndefAndSpace(row._billing_address_1) ? '<br>' + row._billing_address_1 : '') + (isNullUndefAndSpace(row._billing_address_2) ? '<br>' + row._billing_address_2 : '') + '<br>' + row._billing_city + ', ' + row._billing_state + ' ' + row._billing_postcode + ' ' + row._billing_country + '<br>Phone: ' + row._billing_phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '<br>Email: ' + row._billing_email + '</address>';
    //                    let val = '<address class="no-margin">' + row._billing_first_name + ' ' + row._billing_last_name + (dtrow.IsDefault == 1 ? ' <span class="label label-success">Default</span>' : '') + (isNullUndefAndSpace(row._billing_company) ? '<br>' + row._billing_company : '') + (isNullUndefAndSpace(row._billing_address_1) ? '<br>' + row._billing_address_1 : '') + (isNullUndefAndSpace(row._billing_address_2) ? '<br>' + row._billing_address_2 : '') + '<br>' + row._billing_city + ', ' + row._billing_state + ' ' + row._billing_postcode + ' ' + row._billing_country + '<br>Phone: ' + row._billing_phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '<br>Email: ' + row._billing_email + '</address>';
    //                    return val;
    //                }
    //            },
    //            {
    //                data: 'shipping_first_name', title: 'SHIPPING ADDRESS', sWidth: "35%", render: function (data, type, dtrow) {
    //                    let row = JSON.parse(dtrow.meta_data);
    //                    let val = '<address class="no-margin">' + row._shipping_first_name + ' ' + row._shipping_last_name + (isNullUndefAndSpace(row._shipping_company) ? '<br>' + row._shipping_company : '') + (isNullUndefAndSpace(row._shipping_address_1) ? '<br>' + row._shipping_address_1 : '') + (isNullUndefAndSpace(row._shipping_address_2) ? '<br>' + row._shipping_address_2 : '') + '<br>' + row._shipping_city + ', ' + row._shipping_state + ' ' + row._shipping_postcode + ' ' + row._shipping_country + '</address>';
    //                    return val;
    //                }
    //            }
    //        ]
    //    });
    //}).catch(err => { swal('Error!', err, 'error'); });

    if (id > 0) {
        var option = { strValue1: $('#txtUserEmail').val() };
        $.ajax({
            url: "/Customer/GetCustomersAddresssList", type: "Get", beforeSend: function () { $("#loader").show(); }, data: option,
            success: function (result) {
                try {
                    let data = JSON.parse(result);
                    console.log(result);
                    let itemHtml = '';
                    if (data['pod'].length > 0) {
                        for (let i = 0; i < data['pod'].length; i++) {
                            itemHtml += '<tr id="tritemId_' + data['pod'][i].customer_id + '" data-key="' + data['pod'][i].customer_id + '">';
                          //  itemHtml += '<td>' + data['pod'][i]._billing_first_name + ' ' + data['pod'][i]._billing_last_name + (isNullUndefAndSpace(data['pod'][i]._billing_company) ? '<br>' + data['pod'][i]._billing_company : '') + (isNullUndefAndSpace(data['pod'][i]._billing_address_1) ? '<br>' + data['pod'][i]._billing_address_1 : '') + (isNullUndefAndSpace(data['pod'][i]._billing_address_2) ? '<br>' + data['pod'][i]._billing_address_2 : '') + '<br>' + data['pod'][i]._billing_city + ', ' + data['pod'][i]._billing_state + ' ' + data['pod'][i]._billing_postcode + ' ' + data['pod'][i]._billing_country + '<br>Phone: ' + data['pod'][i]._billing_phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '<br>Email: ' + data['pod'][i]._billing_email  + '</td>';
                            itemHtml += '<td>' + data['pod'][i].b_first_name + ' ' + data['pod'][i].b_last_name + ' ' + (data['pod'][i].b_company) + '<br>' + data['pod'][i].b_address_1 + ' ' + data['pod'][i].b_address_2+ '<br>'+ data['pod'][i].b_city + ' '+ data['pod'][i].b_state + ' ' + data['pod'][i].b_postcode + ' ' + data['pod'][i].b_country + '<br>Phone: ' + data['pod'][i].b_phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3") + '<br>Email: ' + data['pod'][i].b_email + '</td>';
                            itemHtml += '<td>' + data['pod'][i].s_first_name + ' ' + data['pod'][i].s_last_name + ' ' + (data['pod'][i].s_company) + '<br>' + data['pod'][i].s_address_1 + ' ' + data['pod'][i].s_address_2 + '<br>' + data['pod'][i].s_city + ' ' + data['pod'][i].s_state + ' ' + data['pod'][i].s_postcode + ' ' + data['pod'][i].s_country +  '</td>';
                            itemHtml += '</tr>';

                        }
                        $('#cus_address').empty().append(itemHtml);
                    }
                }
                catch (error) {
                    $("#loader").hide(); swal('Alert!', error, "error");
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (xhr, status, err) { $("#loader").hide(); swal('Alert!', "something went wrong.", "error"); }, async: false
        });
    }


}