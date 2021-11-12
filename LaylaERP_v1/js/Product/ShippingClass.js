 $(document).ready(function () {
    setTimeout(function () { dataGridLoad(''); }, 100);
  $("#loader").hide();
   // $('#dvdetails').hide();
    $(document).on('click', "#btnAddDetails", function () {
        $('#dvdetails').show();
    })

    $(document).on('click', "#btncl", function () {
        //$('#dvdetails').hide();
        location.reload();
    })
   // loadecitystate();
     fillshiping();

     $("#ddlCountry").change(function () {
         var obj = $("#ddlCountry").val();             
         BindStateCounty(obj);
         ID = $("#hfshipingid").val();
        // if (parseInt(ID) = 0)
         SelectedStateCounty();
     });

    $("#ddlMethod").change(function () {
        if ($("#ddlMethod").val() != 'fltrate') {
            $("#txtPrice").val('0');
            $("#ddlType").val('');
            $("#ddlTaxable").val('');
            $("#txtPrice").prop("readonly", true);
            $('#ddlType').attr("disabled", true);
            $('#ddlTaxable').attr("disabled", true);           
        }
        else {
            $("#txtPrice").val('0');
            $("#ddlType").val('');
            $("#ddlTaxable").val('');
            $("#txtPrice").prop("readonly", false);           
            $('#ddlType').attr("disabled", false);
            $('#ddlTaxable').attr("disabled", false);
        }
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

$('#btnSave').click(function () {
    var Shipping = $('#txtShippingName').val();
    if (Shipping == "") {
        swal("alert", "Please enter Shipping Name", "error").then(function () { swal.close(); $('#txtShippingName').focus(); })
    }
    else {
        var obj = { Shippingclass_Name: Shipping }
        $.ajax({
            url: '/Product/NewShipping/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            success: function (data) {
                if (data.status == true) {
                    swal("Success", data.message, "success");
                    $("#roleModal").modal('hide');
                    fillshiping();
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            error: function () {
                swal("alert", "something went wrong", "error");
                $("#roleModal").modal('hide');
            }
        })
    }
});




$('#btndelete').click(function () {
    var Shipping = $('#ddlShippingClassdel').val();
    var country = $('#ddlCountrydel').val();
    if (Shipping == "") {
        swal("alert", "Please select Shipping Class", "error").then(function () { swal.close(); $('#ddlShippingClassdel').focus(); })
    }
    else if (country == "") {
        swal("alert", "Please select Country", "error").then(function () { swal.close(); $('#ddlCountrydel').focus(); })
    }
    else {
        var obj = { fk_ShippingID: Shipping, countrycode: country }
        $.ajax({
            url: '/Product/deleteShippingprice/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            success: function (data) {
                if (data.status == true) {
                    swal("Success", data.message, "success");
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

$(document).on('click', "#btnsavedetails", function () {
    Adddetails();
});
function Adddetails() {
    debugger
    ID = $("#hfshipingid").val();

    var statearray = $('#ddlState option:selected')
        .toArray().map(item => item.value).join();
    stateval = statearray;
   // shippingname = $('#txtShippingClass').val();
    Countryval = $('#ddlCountry').val();
    fk_ShippingID = $("#txtShippingClass").val();
    Methodval = $("#ddlMethod").val();
    ship_price = $("#txtPrice").val();
    typeval = $("#ddlType").val();
    taxval = $("#ddlTaxable").val();
    //taxprise = $("#txttaxprice").val();

    if (fk_ShippingID == "") {
        swal('Alert', 'Please Select Shipping Class', 'error').then(function () { swal.close(); $('#txtShippingClass').focus(); });
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
            fk_ShippingID: fk_ShippingID,
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
            headers: { "Content-Type": "application/json" },
            beforeSend: function () {
                $("#loader").show();
            },
            success: function (data) {
                if (data.status == true) {
                    if (data.url == "Manage") {
                        dataGridLoad('');
                        $('#ddlState').val(null).trigger('change');
                        ClearControl();
                        swal('Success!', data.message, 'success');
                    }
                    else {
                        dataGridLoad('');
                        $('#ddlState').val(null).trigger('change');
                        ClearControl();
                        // $('#fetch_results > input:text').val('');
                        swal('Success!', data.message, 'success');
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
function GetCountryState() {
    let CountryState = [];
    $.ajax({
        type: "get", url: '/Product/GetCityStateData', contentType: "application/json; charset=utf-8", dataType: "json", data: {},
        success: function (data) {
            //data = JSON.parse(data); _shipping_class = data;
            console.log(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { }, async: false
    });
    return CountryState;
}

function loadecitystate() {

    let CountryState = GetCountryState();
   // console.log(_shipping_class);
    //$('#ddlState').select2({
    //    multiple: true,
    //    placeholder: "Select State...",
    //    data: _shipping_class,
    //    query: function (options) {
    //        var selectedIds = options.element.select2('val');
    //        var selectableGroups = $.map(this.data, function (group) {
    //            var areChildrenAllSelected = true;
    //            $.each(group.children, function (i, child) {
    //                if (selectedIds.indexOf(child.id) < 0) {
    //                    areChildrenAllSelected = false;
    //                    return false; // Short-circuit $.each()
    //                }
    //            });
    //            return !areChildrenAllSelected ? group : null;
    //        });
    //        options.callback({ results: selectableGroups });
    //    }
    //}).on('select2-selecting', function (e) {
    //    var $select = $(this);
    //    if (e.val == '') {
    //        e.preventDefault();
    //        $select.select2('data', $select.select2('data').concat(e.choice.children));
    //        $select.select2('close');
    //    }
    //});
}
    



    //var strValue1 = "1";
    //$.ajax({
    //    type: "POST",
    //    async: true,
    //    url: '/Product/GetCityStateData',
    //    data: {
    //        'strValue1': strValue1
    //    },
    //    dataType: "json",        
    //    success: function (data) {
    //        $("#ddlState").empty();
    //        var $prevGroup, prevGroupName;
    //        $.each(JSON.parse(data), function () {
    //            if (prevGroupName != this.Country) {
    //                $prevGroup = $('<optgroup />').prop('label', this.Country).appendTo('#ddlState');
    //            }
    //            $("<option />").val(this.State).text(this.StateFullName).appendTo($prevGroup);
    //            prevGroupName = this.Country;
    //        }); $(".select2").select2();
    //    } 
    //}) 
//}
function fillshiping() {
    $.get('/Product/GetShipping/' + 1, function (data) {
        var items = "";
        $('#txtShippingClass').empty();
        optionText = 'Please select';
        optionValue = "";
        $('#txtShippingClass').append(new Option(optionText, optionValue));
       // items += "<option value=''>Please select</option>";
        $.each(data, function (index, value) {
            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#txtShippingClass");
        })
       
        //$('#txtShippingClass').bind(items);
    });

    $.get('/Product/GetShipping/' + 1, function (data) {
        var items = "";
        $('#ddlShippingClassdel').empty();
        optionText = 'Please select';
        optionValue = "";
        $('#ddlShippingClassdel').append(new Option(optionText, optionValue));
        $.each(data, function (index, value) {
            items += $('<option>').val(this['Value']).text(this['Text']).appendTo("#ddlShippingClassdel");
        })
        //$('#ddlShippingClassdel').bind(items);
    });
}

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
function SelectedStateCounty() {
    $("#ddlState").empty();
    //var strValue2: $("#ddlCountry").val();
    var obj = { strValue1: $("#ddlCountry").val() }
    $.ajax({

        url: '/Product/SelectedStateData/' + ID,

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
                var col = oSettings.aaSorting[0][0] == 0 ? "ShipName" : oSettings.aaSorting[0][0] == 1 ? "Country" : oSettings.aaSorting[0][0] == 2 ? "State" : oSettings.aaSorting[0][0] == 3 ? "Method" : oSettings.aaSorting[0][0] == 4 ? "Shipping_price" : oSettings.aaSorting[0][0] == 5 ? "Type" : "rowid";
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
            { data: 'Type', title: 'Cost Type', sWidth: "12%" },
            { data: 'taxable', title: 'Taxable', sWidth: "12%" },
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
    $('#txtShippingClass').focus();
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
        beforeSend: function () { $("#loader").show(); },
        success: function (data) {
            var i = JSON.parse(data);
            
            $('#txtShippingClass').focus();
            $("#txtShippingClass").val(i[0].ShipName);
        //    $("#txttaxprice").val(i[0].Shipping_taxrate);
        
          $('#ddlCountry').val(i[0].countrycode).trigger('change');            
            $('#txtShippingClass').val(i[0].fk_ShippingID).trigger('change');
           // $('#ddlCountry').trigger('change');
            $('#ddlMethod').val(i[0].Method).trigger('change');
    
            $('#ddlType').val(i[0].Type).trigger('change');
            $('#ddlTaxable').val(i[0].taxable).trigger('change');
            $("#txtPrice").val(i[0].Shipping_price);
           // $('#ddlState').val(i[0].statecode).trigger('change');
           // $("#txtShippingClass").prop("readonly", true);
            //$('#ddlState').val(id).trigger('change');
            setTimeout(function () { statedata(i[0].statecode, i[0].Statefullname); }, 2000);
        },
        complete: function () { $("#loader").hide(); },
        error: function (msg) { alert(msg); }
      
    });
}
function statedata(id,name) { 
    $("#ddlState").empty().append('<option value="' + id + '" selected>' + name + '</option>'); 
}

function ClearControl() {
    $('#ddlCountry').val('').trigger('change');
    $("#txtPrice").val('0');
}


 