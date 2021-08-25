$(document).ready(function () {
    setTimeout(function () { dataGridLoad(''); }, 100);
  $("#loader").hide();
    $('#dvdetails').hide();
    $(document).on('click', "#btnAddDetails", function () {
        $('#dvdetails').show();
    })

    $(document).on('click', "#btncl", function () {
        $('#dvdetails').hide();
    })

    $("#ddlCountry").change(function () {
        var obj = $("#ddlCountry").val();        
        BindStateCounty(obj);       
    });

    //$("#txttaxprice").keyup(function () {
    //    var $this = $(this);
    //    $this.val($this.val().replace(/[^\d.]/g, ''));
    //    $this.val($this.val().substring(0, 10));
    //});
    $("#txtPrice").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    });

});

$(document).on('click', "#btnsavedetails", function () {
    Adddetails();
});
function Adddetails() {
    debugger
    ID = $("#hfshipingid").val();
    shippingname = $('#txtShippingClass').val();
    Countryval = $('#ddlCountry').val();
    if (Countryval == "1")
        Countryval = "US";
    else
        Countryval = "CA";
    stateval = $("#ddlState").val();
    Methodval = $("#ddlMethod").val();
    ship_price = $("#txtPrice").val();
    typeval = $("#ddlType").val();
    taxval = $("#ddlTaxable").val();
    //taxprise = $("#txttaxprice").val();

    if (shippingname == "") {
        swal('Alert', 'Please Enter Shipping Class', 'error').then(function () { swal.close(); $('#txtShippingClass').focus(); });
    }
    else if (Countryval == "") {
        swal('Alert', 'Please Select Country', 'error').then(function () { swal.close(); $('#ddlCountry').focus(); });
    }
    else if (stateval == "") {
        swal('Alert', 'Please Select State', 'error').then(function () { swal.close(); $('#ddlState').focus(); });
    }
    else {
        var obj = {
            ID: ID,
            Shippingclass_Name: shippingname,
            countrycode: Countryval,
            statecode: stateval,
            Shipping_Method: Methodval,
            Ship_price: ship_price,
            Shipping_type: typeval,
            taxable: taxval
            //Shipping_taxrate: taxprise
        }
        console.log(obj);
        $.ajax({
            url: '/Product/CreateShipname/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            //beforeSend: function () {
            //    $("#loader").show();
            //},
            success: function (data) {
                if (data.status == true) {
                    if (data.url == "Manage") {
                        dataGridLoad('');
                       swal('Alert!', data.message, 'success');
                    }
                    else {
                        dataGridLoad('');
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
                //location.href = '/Users/Users/';
                //window.location.href = '/Users/Users/';

            },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
            async: false
        })
    }



}
///Bind States of Country
function BindStateCounty(obj) {
    
    //$.get('/Product/Getsate/' + parseInt($("#ddlCountry").val()), { async: false }, function (data) {
    //    var items = "";
    //    $('#ddlState').empty();
    //    items += "<option value=''>Please select</option>";
    //    $.each(data, function (index, value) {
    //        items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlState");
    //    })
    //});

    $("#ddlState").select2({
        allowClear: true, minimumInputLength: 2, placeholder: "Search State",
        ajax: {
            url: '/Product/GetStateData', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term, strValue2: $("#ddlCountry").val() }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.StateFullName, name: item.StateFullName, val: item.State, id: item.State } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });


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
        sAjaxSource: "/Product/GetShippinfclassList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            //aoData.push({ name: "strValue1", value: monthYear });
            aoData.push({ name: "strValue1", value: '' });
            aoData.push({ name: "strValue2", value: '' });
            aoData.push({ name: "strValue3", value: '' });
            aoData.push({ name: "strValue4", value: '' });
            var col = 'rowid';
            if (oSettings.aaSorting.length > 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "rowid" : oSettings.aaSorting[0][0] == 1 ? "ShipName" : oSettings.aaSorting[0][0] == 2 ? "CountryFullName" : "rowid";
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
            
            { data: 'ShipName', title: 'Shipping Class', sWidth: "12%" },
            { data: 'Country', title: 'Country', sWidth: "12%" },
            { data: 'State', title: 'State', sWidth: "12%" },
            { data: 'Method', title: 'Method', sWidth: "12%" },
            /*{ data: 'Shipping_price', title: 'Price', sWidth: "12%" },*/
            {
                data: 'Shipping_price', title: 'Price', sWidth: "12%", render: function (data, type, row) {
                    var tprice = 'toFormat';
                    tprice = '$' + row.Shipping_price;
                    return tprice
                }
            },
            { data: 'Type', title: 'Type', sWidth: "12%" },
            { data: 'taxable', title: 'Taxable', sWidth: "12%" },
           // { data: 'Shipping_taxrate', title: 'TaxCost', sWidth: "12%" },
            {
                data: 'Shipping_taxrate', title: 'TaxCost', sWidth: "12%", render: function (data, type, row) {
                    var tprice = 'toFormat';
                    tprice = '$' + row.Shipping_taxrate;
                    return tprice
                }
            },

            {
                'data': 'rowid', title: 'Action', sWidth: "5%",
                'render': function (id, type, full, meta) {
                    return '<a title="Click here to Edit" onClick="EditData(' + id + ');" data-toggle="tooltip"><i class="glyphicon glyphicon-eye-open"></i></a>'
                }
            }
        ]
    });
}

function EditData(id) {
    $('#dvdetails').show();
    $("#hfshipingid").val(id);
    var ID = id;
    var obj = { strVal: id }
    $.ajax({

        url: '/Product/GetShipEditDataID/' + ID,
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var i = JSON.parse(data);
            //  console.log(i);
            $("#txtShippingClass").val(i[0].ShipName);
        //    $("#txttaxprice").val(i[0].Shipping_taxrate);
            $("#txtPrice").val(i[0].Shipping_price);
            $('#ddlCountry').val(i[0].countrycode).trigger('change');            
           // $('#ddlState').val(i[0].statecode).trigger('change');
            $('#ddlCountry').trigger('change');
            $('#ddlMethod').val(i[0].Method).trigger('change');
            $('#ddlType').val(i[0].Type).trigger('change');
            $('#ddlTaxable').val(i[0].taxable).trigger('change');
            $('#ddlMethod').val(i[0].Method).trigger('change');
           // $('#ddlState').val(i[0].statecode).trigger('change');
            $("#txtShippingClass").prop("readonly", true);
            //$('#ddlState').val(id).trigger('change');
            setTimeout(function () { statedata(i[0].statecode); }, 2000);
        },
        error: function (msg) { alert(msg); }
      
    });
}
function statedata(id) {
    console.log(id);
    $('#ddlState').val(id).trigger('change');
}



 