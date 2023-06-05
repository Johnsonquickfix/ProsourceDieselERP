//var htmlAcc = '<option value="0">Please Select Company</option>';

$(document).ready(function () {
    $("#loader").hide();
    $(".select2").select2();
    $("#ddlcompany").select2({
        allowClear: true, minimumInputLength: 2, placeholder: "Search company",
        ajax: {
            url: '/Setting/GetcompanyData', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term, strValue2: '' }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.label, name: item.label, val: item.ID, id: item.ID } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
    ProductGrid();
    // $("#ddlcompany").select2("val", ['1','2']);
})


function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}
function ProductGrid() {
    // var optType = $('input[name="accounting_product_mode"]:checked').val();
    obj = { strValue1: '' }
     
    $('#ProductGriddata').DataTable({
        oSearch: { "sSearch": '' }, order: [[0, "asc"]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing <b>_START_ to _END_</b> (of _TOTAL_)",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>',
        },
        destroy: true, bAutoWidth: false, ajax: {
            url: '/Setting/GetProductCompany', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8",
            data: obj,
            beforeSend: function () { $("#loader").show(); },
            dataSrc: function (data) { return JSON.parse(data); },
           complete: function () {
                $("#loader").hide();
            }
        },
        lengthMenu: [[20, 50, 100], [20, 50, 100]],
        columns: [
            //{ data: 'ID', title: 'Parent ID', sWidth: "10%" },
            { data: 'ID', title: 'ID', sWidth: "10%" },
            { data: 'post_title', title: 'Product', sWidth: "20%", },
            { data: 'sku', title: 'SKU', sWidth: "20%", }, 
            { data: 'company', title: 'Company', sWidth: "10%" },
            //{
            //    'data': '#', sWidth: "20%",
            //    'render': function (id, type, full, meta) {
            //        return '<select multiple class="form-control select2" name="ddlNewAccounttoAssign" id="chk_' + full.id + '" >' + htmlAcc.replace(new RegExp("\\b" + 'data-' + id + "\\b"), "selected") + '</select>';
            //    }
            //},
            //{
            //    'data': 'id', sWidth: "10%   ",
            //    'render': function (data, type, full, meta) {
            //        return '<div style="opacity: 1; position: relative; visibility: visible; display: block"><input type="checkbox" name="CheckSingle" id="CheckSingle" onClick="Singlecheck();" value="' + data + '" ><label></label></div>';
            //    }
            //},
            {
                'data': 'ID', sWidth: "7%",
                'render': function (id, type, full, meta) {
                    return ' <span title="Click here to add company" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="model(' + id + ');" ><i class="glyphicon glyphicon-eye-open"></i></a></span>';
                }
            },

        ],
        // columnDefs: [{ targets: [0], visible: false, searchable: false, }, { "orderable": false, "targets": -1 }]
         
    });
    
}


$('#btnUpdate').click(function () {
    updatecompnay();
});

function model(id) {
    $("#hfProductid").val(id);
    //$(".select2").select2(); 
    SelectedProductcompany();
    // setTimeout(function () {
    var strValue1 = id;
    var obj =
        $.ajax({
            url: "/Setting/Selectproductcompanybiyid/" + strValue1,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(obj),
            success: function (data) {
              
                var jobj = JSON.parse(data);
                //console.log(jobj[0].company_id);
                //if (jobj.company_id != null) {
                    if (jobj.length > 0) {
                        var companyIDs = jobj[0].company_id.split(',');
                        console.log(companyIDs);
                        //$("#ddlcompany").val(companyIDs).trigger('change.select2');
                        $("#ddlcompany").select2("val", [jobj[0].company_id.split(',')]);
                    }
                //}
                else {
                    $("#ddlcompany").empty();
                }
            },
            error: function (msg) {

            }
        });
    //},
    // 2000);
    // console.log(id);

    setTimeout(function () { $('#ProductcompanyModal').modal('show'); }, 800);


    // $(".select1").select2();
    //$("#ddlcompany").select2({
    //    allowClear: true, minimumInputLength: 2, placeholder: "Search company",
    //    ajax: {
    //        url: '/Setting/GetcompanyData', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
    //        data: function (params) { var obj = { strValue1: params.term, strValue2: '' }; return JSON.stringify(obj); },
    //        processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.label, name: item.label, val: item.ID, id: item.ID } }) }; },
    //        error: function (xhr, status, err) { }, cache: true
    //    }
    //}); 
}

function updatecompnay() {
    rowid = $("#hfProductid").val();
    var companyarray = $('#ddlcompany option:selected')
        .toArray().map(item => item.value).join();
    company = companyarray;

    var companytextarray = $('#ddlcompany option:selected')
        .toArray().map(item => item.text).join();
    companytext = companytextarray;

    console.log(rowid, company, companytext)

    if (rowid == 0) {
        swal('Alert', 'Please select ', 'error');
    }
    //else if (prefixcode == "") {
    //    swal('Alert', 'Please enter prefix code', 'error').then(function () { swal.close(); $('#txtprefixcode').focus(); });
    //}
    //else if (vendor == 0) {
    //    swal('Alert', 'Please select vendor', 'error').then(function () { swal.close(); $('#ddlvendor').focus(); });
    //}
    //else if (country == 0) {
    //    swal('Alert', 'Please select country', 'error').then(function () { swal.close(); $('#txtcountry').focus(); });
    //}
    //else if (state == 0 || state == null) {
    //    swal('Alert', 'Please enter state', 'error').then(function () { swal.close(); $('#txtstate').focus(); });
    //}
    //else if (warehouse == 0) {
    //    swal('Alert', 'Please select warehouse', 'error').then(function () { swal.close(); $('#ddlwarehouse').focus(); });
    //} 
    else {
        var obj = {
            searchid: rowid,
            state: company,
            country: companytext
        }
        $.ajax({
            url: '/Setting/UpdateProducttocompany/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    //swal('Success', data.message, 'success').then((result) => { location.href = 'ProductCompanyAllot'; });
                    swal('Success', data.message, 'success');
                    $('#ProductcompanyModal').modal('hide');
                    ProductGrid();
                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () {  },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })
    }

}

function SelectedProductcompany() {
    $("#ddlcompany").empty();
    var obj = { strValue1: '' }
    $.ajax({
        url: '/Setting/GetcompanyData',
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var datalog = JSON.parse(data);
            for (var i = 0; i < datalog.length; i++) {
                $("#ddlcompany").append('<option value="' + datalog[i].ID + '" selected>' + datalog[i].label + '</option>');
            }
        },
        error: function (msg) { alert(msg); },
        async: false
    });


}