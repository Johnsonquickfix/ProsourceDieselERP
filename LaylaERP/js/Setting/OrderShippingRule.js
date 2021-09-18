$(document).ready(function () {

    $.get('/Product/GetVender/' + 1, function (data) {
        var items = "";
        // $('#ddlvender').empty();
        // items += "<option value=''>Please select</option>";
        $.each(data, function (index, value) {
            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlvender");
        })
        //$('#ddlvender').bind(items);
    });

    fillrole();
    getProducts();
    $(".select2").select2();
    $("#ddlState").select2({
        allowClear: true, minimumInputLength: 2, placeholder: "Search State",
        ajax: {
            url: '/Product/GetStateData', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term, strValue2: 'US' }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.StateFullName, name: item.StateFullName, val: item.State, id: item.State } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
    SelectedStateCounty();
    dataGridLoad();
})

$('#btnSave').click(function () {
    var RuleName = $('#txtRuleName').val();
    var Description = $('#txtDescription').val();
    if (txtRuleName == "") {
        swal("alert", "Please enter Rule Name", "error").then(function () { swal.close(); $('#txtRuleName').focus(); })
    }
    else {
        var obj = { rule_name: RuleName, description: Description }
        $.ajax({
            url: '/Setting/NewRule/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (data) {
                if (data.status == true) {
                    swal("alert", data.message, "success");
                    $("#roleModal").modal('hide');
                    fillrole();
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () {
                $("#loader").hide();
            },
            error: function () {
                swal("alert", "something went wrong", "error");
                $("#roleModal").modal('hide');
            }
        })
    }
});

$('#btndelete').click(function () {
    var fk_rule = $('#ddlRuledel').val();
    //var country = $('#ddlCountrydel').val();
    if (fk_rule == "") {
        swal("alert", "Please select Shipping Class", "error").then(function () { swal.close(); $('#ddlRuledel').focus(); })
    }
    //else if (country == "") {
    //    swal("alert", "Please select Country", "error").then(function () { swal.close(); $('#ddlCountrydel').focus(); })
    //}
    else {
       // var obj = { fk_ShippingID: Shipping, countrycode: country }
        var obj = { fk_rule: fk_rule }
        $.ajax({
            url: '/Setting/deleteShippingrule/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            success: function (data) {
                if (data.status == true) {
                    swal("alert", data.message, "success");
                    $("#deletepriceModal").modal('hide');
                    dataGridLoad();
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            error: function () {
                swal("alert", "something went wrong", "error");
                $("#deletepriceModal").modal('hide');
            }
        })
    }
});

function getProducts() {
    $.ajax({
        url: "/Inventory/GetProductList",
        type: "Get", beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            let dt = JSON.parse(data);
            //Product
            $("#ddlProduct").html('<option value="0">Select Product</option>');
            for (i = 0; i < dt['Table'].length; i++) { $("#ddlProduct").append('<option value="' + dt['Table'][i].id + '">' + dt['Table'][i].text + '</option>'); }
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); }
    });
}

function fillrole() {
    $.get('/Setting/GetRule', function (data) {
        var items = "";
        $('#ddlRule').empty();
        $('#ddlRuledel').empty();
        optionText = 'Please select Roule';
        optionValue = "";
        $('#ddlRule').append(new Option(optionText, optionValue));
        $('#ddlRuledel').append(new Option(optionText, optionValue));
        // items += "<option value=''>Please select</option>";
        $.each(data, function (index, value) {
            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlRule");
            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlRuledel");
        })

        //$('#txtShippingClass').bind(items);
    });
    //$.get('/Setting/GetRule', function (data) {
    //    var items = "";
    //    $('#ddlRuledel').empty();
    //    optionText = 'Please select Roule';
    //    optionValue = "";
    //    $('#ddlRuledel').append(new Option(optionText, optionValue));
    //    // items += "<option value=''>Please select</option>";
    //    $.each(data, function (index, value) {
    //        items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlRuledel");
    //    })

    //    //$('#txtShippingClass').bind(items);
    //});
}
function SelectedStateCounty() {
    $("#ddlState").empty();
    //var strValue2: $("#ddlCountry").val();
    var obj = { strValue1: 'US' }
    $.ajax({

        url: '/Product/SelectedStateData/' + 1,

        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var datalog = JSON.parse(data);
            for (var i = 0; i < datalog.length; i++) {
                $("#ddlState").append('<option value="' + datalog[i].State + '" selected>' + datalog[i].StateFullName + '</option>');
            }

        },
        error: function (msg) { alert(msg); },
        async: false
    });


}
$(document).on('click', "#btncl", function () {
    //$('#dvdetails').hide();
    location.reload();
})
$(document).on('click', "#btnsavedetails", function () {
    Adddetails();
});
function Adddetails() {
    debugger
    ID = $("#hfshipingid").val();
    var statearray = $('#ddlState option:selected')
        .toArray().map(item => item.value).join();
   // console.log(statearray);
    locationval = statearray; 
    fk_rule = $("#ddlRule").val();
    services = $("#ddlService").val();
    fk_product = $("#ddlProduct").val();
    fk_vendor = $("#ddlvender").val();
  
    //taxprise = $("#txttaxprice").val();

    if (fk_rule == "") {
        swal('Alert', 'Please Select Rule', 'error').then(function () { swal.close(); $('#ddlRule').focus(); });
    }
    else if (fk_product == "") {
        swal('Alert', 'Please Select Product', 'error').then(function () { swal.close(); $('#ddlProduct').focus(); });
    }
    else if (location == "") {
        swal('Alert', 'Please Select State', 'error').then(function () { swal.close(); $('#ddlState').focus(); });
    }
    else if (fk_vendor == "") {
        swal('Alert', 'Please Select Vendor', 'error').then(function () { swal.close(); $('#ddlvender').focus(); });
    }
    else {
        var obj = {
            ID: ID,
            fk_rule: fk_rule,
            location: locationval,
            services: services,
            fk_product: fk_product,
            fk_vendor: fk_vendor 
            //Shipping_taxrate: taxprise
        }
    
        $.ajax({
            url: '/Setting/CreateShiprule/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            headers: { "Content-Type": "application/json" },
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (data) {
                if (data.status == true) {
                    if (data.url == "Manage") {
                        dataGridLoad('');
                        $('#ddlState').val(null).trigger('change');
                       // ClearControl();
                        swal('Alert!', data.message, 'success');
                    }
                    else {
                        dataGridLoad('');
                        $('#ddlState').val(null).trigger('change');
                        //ClearControl();
                        // $('#fetch_results > input:text').val('');
                        swal('Alert!', data.message, 'success');
                    }
                    //$('#ddlProduct').val(null).trigger('change');
                    //clear_fetch();

                }
                else {
                    swal('Alert!', data.message, 'error')
                }
            },
            complete: function () {
                $("#loader").hide();
            },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
            async: false
        })
    }
}

function dataGridLoad(order_type) {

    //var types = $('#ddltype').val();
    //let prodctype = $('#ddlproducttype').val();
    //let stockstatus = $('#ddstockstatus').val();

    $('#dtdata').DataTable({
        columnDefs: [{ "orderable": false, "targets": 0 }], order: [[1, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        //sPaginationType: "full_numbers", searching: true, ordering: true, lengthChange: true,
        bAutoWidth: false, scrollX: true, scrollY: ($(window).height() - 215),
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
        sAjaxSource: "/Setting/GetShippingrulelist",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            //aoData.push({ name: "strValue1", value: monthYear });
            aoData.push({ name: "strValue1", value: '' });
            aoData.push({ name: "strValue2", value: '' });
            aoData.push({ name: "strValue3", value: '' });
            aoData.push({ name: "strValue4", value: '' });
            var col = 'rowid';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "rulrname" : oSettings.aaSorting[0][0] == 1 ? "State" : oSettings.aaSorting[0][0] == 2 ? "vendrname" : oSettings.aaSorting[0][0] == 3 ? "title" : oSettings.aaSorting[0][0] == 4 ? "services" : "rowid";
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
            //    'data': 'rowid', sWidth: "5%   ",
            //    'render': function (data, type, full, meta) {
            //        return '<input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck(this);" value="' + $('<div/>').text(data).html() + '"><label></label>';
            //    }
            //},

            { data: 'rulrname', title: 'Rule Name', sWidth: "12%" }, 
            { data: 'State', title: 'State', sWidth: "12%" },
            { data: 'vendrname', title: 'Vendor', sWidth: "12%" },
            { data: 'title', title: 'Product', sWidth: "12%" },
       
            { data: 'services', title: 'Services', sWidth: "12%" },
 
            // { data: 'Shipping_taxrate', title: 'TaxCost', sWidth: "12%" },

            {
                'data': 'rowid', title: 'Action', sWidth: "5%",
                'render': function (id, type, full, meta) {
                    return '<a href="#" title="Click here to Edit" onClick="EditData(' + id + ');" data-toggle="tooltip"><i class="glyphicon glyphicon-eye-open"></i></a>'


                }
            }
        ]
    });
}

function EditData(id) {
    //  loadecitystate();
    $('#ddlRule').focus();
    $('#dvdetails').show();
    $("#hfshipingid").val(id);
    var ID = id;
    var obj = { strVal: id }
    $.ajax({

        url: '/Setting/GetEditDataID/' + ID,
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            var i = JSON.parse(data);
            $('#ddlRule').focus();
            $('#ddlRule').val(i[0].fk_rule).trigger('change');
            $('#ddlProduct').val(i[0].fk_product).trigger('change');
            $('#ddlvender').val(i[0].fk_vendor).trigger('change');
            $('#ddlService').val(i[0].services).trigger('change');
            setTimeout(function () { statedata(i[0].location, i[0].Statefullname); }, 2000);
        },
        complete: function () { $("#loader").hide(); },
        error: function (msg) { alert(msg); }

    });
}
function statedata(id, name) {
    $("#ddlState").empty().append('<option value="' + id + '" selected>' + name + '</option>');
}