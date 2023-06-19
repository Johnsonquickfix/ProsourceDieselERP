//var htmlAcc = '<option value="0">Please Select Company</option>';

$(document).ready(function () {
    $("#loader").hide();
    $(".select2").select2();
    $("#ddlcompany").select2({
        allowClear: true, minimumInputLength: 0, placeholder: "Search website",
        ajax: {
            url: '/Setting/GetcompanyData', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term, strValue2: '' }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.label, name: item.label, val: item.ID, id: item.ID } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
    $("#ddlwebcompany").select2({
        allowClear: true, minimumInputLength: 0, placeholder: "Search website",
        ajax: {
            url: '/Setting/GetcompanyData', type: "POST", contentType: "application/json; charset=utf-8", dataType: 'json', delay: 250,
            data: function (params) { var obj = { strValue1: params.term, strValue2: '' }; return JSON.stringify(obj); },
            processResults: function (data) { var jobj = JSON.parse(data); return { results: $.map(jobj, function (item) { return { text: item.label, name: item.label, val: item.ID, id: item.ID } }) }; },
            error: function (xhr, status, err) { }, cache: true
        }
    });
    CategoryGrid();
    // $("#ddlcompany").select2("val", ['1','2']);
})


function isEdit(val) {
    localStorage.setItem('isEdit', val ? 'yes' : 'no');
}
function CategoryGrid() {
    // var optType = $('input[name="accounting_Category_mode"]:checked').val();
    obj = { strValue1: '' }

    $('#CategoryGriddata').DataTable({
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
            url: '/Setting/GetCategoryCompany', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8",
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
            {
                'data': 'ID', sWidth: "3%   ",
                'render': function (data, type, row) {
                    return '<input type = "checkbox" style = "opacity: 1; position: relative; visibility: visible; display: block" onClick="Singlecheck(this);" name="CheckSingle" value="' + $('<div/>').text(data).html() + '">';
                }
            },
            { data: 'ID', title: 'ID', sWidth: "10%" },


            { data: 'name', title: 'Category', sWidth: "20%", },
            { data: 'slug', title: 'Slug', sWidth: "20%", },
            { data: 'company', title: 'Website', sWidth: "10%" },
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
                    return ' <span title="Click here to add website" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="model(' + id + ');" ><i class="glyphicon glyphicon-eye-open"></i></a></span>';
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
    $("#hfCategoryid").val(id);
    //$(".select2").select2(); 
    SelectedCategorycompany();
    // setTimeout(function () {
    var strValue1 = id;
    var obj =
        $.ajax({
            url: "/Setting/SelectCategorycompanybiyid/" + strValue1,
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

    setTimeout(function () { $('#CategorycompanyModal').modal('show'); }, 800);


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
    rowid = $("#hfCategoryid").val();
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
    else {
        //var obj = {
        //    searchid: rowid,
        //    state: company,
        //    country: companytext
        //}
        var obj = { companyid: company, company: companytext, ids: rowid, flag: 'I', term_ids: ''}
        $.ajax({
            url: '/Setting/UpdateCategorytocompany/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    //swal('Success', data.message, 'success').then((result) => { location.href = 'CategoryCompanyAllot'; });
                    //swal('Success', data.message, 'success');
                    //$('#CategorycompanyModal').modal('hide');
                    //CategoryGrid();

                    //swal('Alert', data.message, 'success').then((result) => {
                    //    $('#CategorycompanyModal').modal('hide');
                    //    CategoryGrid();
                    //});
                    $('#CategorycompanyModal').modal('hide');
                    swal('Success', data.message, 'success').then((result) => {  CategoryGrid();});

                }
                else {
                    swal('Alert!', data.message, 'error');
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })
    }

}

function SelectedCategorycompany() {
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

function CheckAll() {
    var isChecked = $('#checkall').prop("checked");
    $('#CategoryGriddata tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
}
function Singlecheck(chk) {
    var isChecked = $(chk).prop("checked");
    var isHeaderChecked = $("#checkall").prop("checked");
    if (isChecked == false && isHeaderChecked)
        $("#checkall").prop('checked', isChecked);
    else {
        $('#CategoryGriddata tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#checkall").prop('checked', isChecked);
    }
}

function AllotWebsite() {
    var id = "";
    $("input:checkbox[name=CheckSingle]:checked").each(function () {
        id += $(this).val() + ",";
    });
    id = id.replace(/,(?=\s*$)/, '');
    $("#checkAll").prop('checked', false);
    //var status = $('#ddlbulkaction').val();
    //var statusval = $("#ddlbulkaction :selected").text();
    var companyarray = $('#ddlwebcompany option:selected')
        .toArray().map(item => item.value).join();
    company = companyarray;

    var companytextarray = $('#ddlwebcompany option:selected')
        .toArray().map(item => item.text).join();
    companytext = companytextarray;
    if (id == "") { swal('Alert', 'Please select Category from list', 'error'); }
    else if (company == "") { swal('Alert', 'Please select website', 'error'); }
    else {
        console.log(id);
        //var obj = { companyid: company, company: companytext, ids: id }
        var obj = { companyid: company, company: companytext, ids: 0, flag: 'U', term_ids: id }
        // const updatestatus = status == 'publish' ? 'Active' : 'Inactive';
        // ActivityLog('Change Category status as ' + updatestatus + '', '/Category/ListCategory');
        //var checkstr = confirm('are you sure want to update this?');
        //if (checkstr == true) {
        swal({ title: "", text: 'Would you like to assign' + companytext + ' this Category?', type: "question", showCancelButton: true })
            .then((result) => {
                if (result.value) {
                    $.ajax({
                        url: '/Setting/UpdateCategorytocompany', dataType: 'JSON', type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(obj),
                        beforeSend: function () { $("#loader").show(); },
                        success: function (data) {
                            if (data.status == true) {
                                swal('Alert', data.message, 'success').then((result) => { CategoryGrid(); $("#ddlwebcompany").empty(); });

                            }
                            else {
                                swal('Alert', 'something went wrong!', 'success');
                            }
                        },
                        complete: function () { $("#loader").hide(); },
                        error: function (error) {
                            swal('Error!', 'something went wrong', 'error');
                        },

                    })

                }
            });
    }
}