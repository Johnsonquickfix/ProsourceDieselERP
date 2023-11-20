$(document).ready(function () {
    ProductWarehouseGrid();
    BankLinkedFiles();
    WarehouseStocklist();
});
//------------Warehouse additional info-------------------------------
function AddWarehouseinfo() {
    //Additional info
    rowid = $("#hfid").val();
    corphone = $("#txtCorContact").val();
    coraddress = $("#txtCorAddress").val();
    coraddress1 = $("#txtCorAddress1").val();
    corcity = $("#txtCorCity").val();
    corstate = $("#txtCorState").val();
    corzip = $("#txtCorZipCode").val();
    corcountry = $("#txtCorCountry").val();
    publicnote = $("#txtpublic").val();

    if (coraddress == "") {
        swal('Alert', 'Please Enter Address', 'error').then(function () { swal.close(); $('#txtCorAddress').focus(); });
    }
    else if (corcity == "") {
        swal('Alert', 'Please Enter City', 'error').then(function () { swal.close(); $('#txtCorCity').focus(); });
    }
    else if (corstate == "") {
        swal('Alert', 'Please Enter State', 'error').then(function () { swal.close(); $('#txtCorState').focus(); });
    }
    else if (corzip == "") {
        swal('Alert', 'Please Enter Zip Code', 'error').then(function () { swal.close(); $('#txtCorZipCode').focus(); });
    }

    else {
        var obj = {
            warehouse_id: rowid,
            cor_phone: corphone,
            cor_address: coraddress,
            cor_address1: coraddress1,
            cor_city: corcity,
            cor_state: corstate,
            cor_zip: corzip,
            cor_country: corcountry,
            note_public: publicnote,

        }
        $.ajax({
            url: '/Warehouse/Addwarehousesinfo/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Alert!', data.message, 'success');
                    WarehouseAddressInfoList();
                    resetaddressinfo();
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
//--------------------------Add warehouse info end----------------------------------

//---------Edit warehouse start--------------------------------------
function AddWarehouse() {
    rowid = $("#hfid").val();
    ref = $("#txtref").val();
    lieu = $("#txtShortNameLocation").val();
    description = $("#txtDescription").val();
    address = $("#txtAddress").val();
    zip = $("#txtZipCode").val();
    town = $("#txtState").val();
    country = $("#txtCountry").val();
    phone = $("#txtPhone").val();
    fax = $("#txtFax").val();
    //statut = $("#status").val();
    address1 = $("#txtAddress1").val();
    city = $("#txtCity").val();
    warehousetype = $("#warehousetype").val();
    status = $("#chkwarehousestatus").prop("checked") ? 1 : 0;
    //Additional info
    //corphone = $("#txtCorContact").val();
    //coraddress = $("#txtCorAddress").val();
    //coraddress1 = $("#txtCorAddress1").val();
    //corcity = $("#txtCorCity").val();
    //corstate = $("#txtCorState").val();
    //corzip = $("#txtCorZipCode").val();
    //corcountry = $("#txtCorCountry").val();
    //publicnote = $("#txtpublic").val();
    //privatenote = $("#txtprivate").val();

    email = $("#txtEmail").val();

    if (ref == "") {
        swal('Alert', 'Please enter ref', 'error').then(function () { swal.close(); $('#txtref').focus(); });
    }
    else if (lieu == "") {
        swal('Alert', 'Please enter short name location', 'error').then(function () { swal.close(); $('#txtShortNameLocation').focus(); });
    }
    else if (phone == "") {
        swal('Alert', 'Please enter contact number', 'error').then(function () { swal.close(); $('#txtPhone').focus(); });
    }
    else if (address == "") {
        swal('Alert', 'Please enter address', 'error').then(function () { swal.close(); $('#txtAddress').focus(); });
    }
    else if (city == "") {
        swal('Alert', 'Please enter city', 'error').then(function () { swal.close(); $('#txtCity').focus(); });
    }
    else if (town == "" || town == null) {
        swal('Alert', 'Please enter state', 'error').then(function () { swal.close(); $('#txtState').focus(); });
    }
    else if (zip == "") {
        swal('Alert', 'Please enter zip Code', 'error').then(function () { swal.close(); $('#txtZipCode').focus(); });
    }

    else {
        $("#txtZipCode").change();
        if ($("#hfzipstatus").val() == "true") {
            var obj = {
                rowid: rowid,
                reff: ref,
                lieu: lieu,
                description: description,
                address: address,
                zip: zip,
                town: town,
                country: country,
                phone: phone,
                fax: fax,
                //statut: statut,
                address1: address1,
                city: city,
                status: status,
                warehouse_type: warehousetype,
                //cor_phone: corphone,
                //cor_address: coraddress,
                //cor_address1: coraddress1,
                //cor_city: corcity,
                //cor_state: corstate,
                //cor_zip: corzip,
                //cor_country: corcountry,
                //note_public: publicnote,
                //note_private: privatenote,
                email: email,
            }
            $.ajax({
                url: '/Warehouse/Updatewarehouses/', dataType: 'json', type: 'Post',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(obj),
                dataType: "json",
                beforeSend: function () { $("#loader").show(); },
                success: function (data) {
                    if (data.status == true) {
                        //$('#parent > input:text').val('');
                        swal('Success', data.message, 'success').then((result) => { location.href = 'Warehouse'; });
                    }
                    else {
                        swal('Alert!', data.message, 'error');
                    }
                },
                complete: function () {
                    $("#loader").hide();
                    isEdit(false);
                },
                error: function (error) { swal('Error!', 'something went wrong', 'error'); },
            })
        }
    }

}
//------------------Edit warehouse end--------------------------


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~warehouse product~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~End product~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function ProductWarehouseGrid() {
    var id = $("#hfid").val();
    var obj = { getwarehouseid:id}
    $.ajax({
        url: '/Warehouse/GetProductWarehouse',
        method: 'post',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        processing: true,
        data: JSON.stringify(obj),
        success: function (data) {
            $('#product').dataTable({
                destroy: true,
                columnDefs: [{ 'visible': false, 'targets': [0] }],
                data: JSON.parse(data),
                "columns": [
                    { data: 'id', title: 'Product Id', sWidth: "25%" },
                    { data: 'post_title', title: 'Product Name', sWidth: "25%", class: 'text-left' },
                    {
                        data: 'reg_price', title: 'Regular Price', sWidth: "25%",
                        render: $.fn.dataTable.render.number('', '.', 2, '$')
                    },
                    {
                        data: 'sale_price', title: 'Sale Price', sWidth: "25%",
                        render: $.fn.dataTable.render.number('', '.', 2, '$')
                    },
                    {
                        data: 'buy_price', title: 'Buying price', sWidth: "25%",
                        render: $.fn.dataTable.render.number('', '.', 2, '$')
                    },

                    {
                        data: 'stock', title: 'Units in Stock', sWidth: "25%",
                       
                    },
                    
                ],


                "order": [[0, 'asc']],
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
        }
    });
}




//----------------------------- Linked Files program start------------------

$("#btnupload").click(function () {
    WarehouseID = $("#hfid").val();
    var file = document.getElementById("ImageFile").files[0];
    var formData = new FormData();
    formData.append("ImageFile", file);
    formData.append("WarehouseID", WarehouseID);

    if (WarehouseID == 0) {
        swal('Alert', 'Warehouse not found', 'error').then(function () { swal.close(); });
    }
    else {
        $.ajax({
            type: "POST",
            url: '/Warehouse/FileUpload/',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    BankLinkedFiles();
                    swal('Success', data.message, 'success');
                }
                else { swal('Alert!', data.message, 'error'); }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) {
                swal('Error!', 'something went wrong', 'error');
            },
        })
    }
})



function BankLinkedFiles() {
    var urid = "";
    ID = $("#hfid").val();
    var sid = "";
    var obj = { user_status: urid, Search: sid, PageNo: 0, PageSize: 50, sEcho: 1, SortCol: 'id', SortDir: 'desc', rowid: ID };
    $('#VendorLinkedFiles').DataTable({
        columnDefs: [{ "orderable": true, "targets": 0 }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true,
        sPaginationType: "full_numbers", searching: false, ordering: true, lengthChange: true, "paging": true,
        bAutoWidth: false, scrollX: false,
        lengthMenu: [[10, 20, 50], [10, 20, 50]],
        sAjaxSource: "/Warehouse/GetBankLinkedFiles",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "FileName" : oSettings.aaSorting[0][0] == 1 ? "FileSize" : oSettings.aaSorting[0][0] == 2 ? "Date" : "id";
                obj.SortCol = col; obj.SortDir = oSettings.aaSorting.length >= 0 ? oSettings.aaSorting[0][1] : "desc";
            }
            obj.sEcho = aoData[0].value; obj.PageSize = oSettings._iDisplayLength; obj.PageNo = oSettings._iDisplayStart;
            $.ajax({
                type: "POST", url: sSource, async: true, contentType: "application/json; charset=utf-8", dataType: "json", data: JSON.stringify(obj),
                success: function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, iTotalRecords: data.iTotalRecords, iTotalDisplayRecords: data.iTotalDisplayRecords, aaData: JSON.parse(data.aaData) };
                    $('#lblAttachedFiles').text(data.iTotalRecords);
                    return fnCallback(dtOption);

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); },
                async: false
            });
        },
        aoColumns: [
            {
                'data': 'FileName', sWidth: "25%",
                'render': function (FileName, type, full, meta) {
                    return '<a target="popup" href="../../Content/WarehouseLinkedFiles/' + FileName + '">' + FileName + ' <i class="fas fa-search-plus"></i></a>';
                }
            },
            { data: 'FileSize', title: 'FileSize', sWidth: "25%" },
            { data: 'Date', title: 'Date', sWidth: "25%" },
            {
                'data': 'ID',
                'render': function (id, type, full, meta) {
                    return '<a href="#" onclick="DeleteBankLinkedFiles(' + id + ');"><i class="fas fa-trash-alt"></i></a>';
                }
            }
        ]
    });
}


function DeleteBankLinkedFiles(id) {
    RowID = $("#hfid").val();
    var result = confirm("Are you sure to delete this linked file?");
    if (result) {
        var obj = { rowid: RowID, WarehouseID: id, }
        $.ajax({
            url: '/Warehouse/DeleteBankLinkedFiles/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8", data: JSON.stringify(obj), dataType: "json",
            beforeSend: function () { $("#loader").show(); },
            success: function (data) {
                if (data.status == true) {
                    swal('Success', data.message, 'success');
                    BankLinkedFiles();
                }
                else { swal('Alert!', data.message, 'error') }
            },
            complete: function () { $("#loader").hide(); },
            error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        })
    }
}
//----------------------------- Linked Files program end-------------------------


//----------------Damage Stock Portion------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~End Damgage~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------------------Edit warehouse additional info start----------------
WarehouseAddressInfoList();
function WarehouseAddressInfoList() {
    var ID = $("#hfid").val();
    var table_EL = $('#additionalinfo').DataTable({
        columnDefs: [{ "orderable": true, "targets": 1 }, { 'visible': true, 'targets': [0] }], order: [[0, "desc"]],
        destroy: true, bProcessing: true, bServerSide: true, bAutoWidth: false, searching: true,
        responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
        language: {
            lengthMenu: "_MENU_ per page",
            zeroRecords: "Sorry no records found",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoFiltered: "",
            infoEmpty: "No records found",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        },
        initComplete: function () {
            $('#additionalinfo_filter input').unbind();
            $('#additionalinfo_filter input').bind('keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) { table_EL.search(this.value).draw(); }
            });
        },

        sAjaxSource: "/Warehouse/WarehouseAddressInfoList",
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            aoData.push({ name: "strValue2", value: ID });
            var col = 'id';
            if (oSettings.aaSorting.length >= 0) {
                var col = oSettings.aaSorting[0][0] == 0 ? "phone" : oSettings.aaSorting[0][0] == 1 ? "Address" : "id";
                aoData.push({ name: "sSortColName", value: col });
            }
            oSettings.jqXHR = $.ajax({
                dataType: 'json', type: "GET", url: sSource, data: aoData,
                "success": function (data) {
                    var dtOption = { sEcho: data.sEcho, recordsTotal: data.recordsTotal, recordsFiltered: data.recordsFiltered, aaData: JSON.parse(data.aaData) };
                    return fnCallback(dtOption);
                }
            });
        },
        aoColumns: [
            { data: 'address', title: 'Address', sWidth: "25%" },
            {
                data: 'phone', title: 'Phone', sWidth: "15%", render: function (toFormat) {
                    var tPhone = '';
                    if (toFormat != null) {
                        tPhone = toFormat.toString();
                        tPhone = '(' + tPhone.substring(0, 3) + ') ' + tPhone.substring(3, 6) + ' ' + tPhone.substring(6, 10);
                    }
                    return tPhone
                }
            },
            {
                'data': 'id',
                'sortable': false,
                'searchable': false,
                sWidth: "10%",
                'render': function (id, type, full, meta) {
                    return '<span title="Click here to edit address details" data-placement="bottom" data-toggle="tooltip"><a href="#" onclick="EditSelectAddress(' + id + ');"><i class="glyphicon glyphicon-pencil"></i></a></span>';
                }
            },
        ],
    });
}

function EditSelectAddress(id) {
    var obj = { strValue1: id }
    $.ajax({
        url: '/Warehouse/SelectAddressByID/',
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            console.log(jobj[0].rowid);
            $("#hfaddressid").val(jobj[0].rowid);
            $('#txtCorContact').val(jobj[0].phone);
            $('#txtCorAddress').val(jobj[0].address);
            $("#txtCorAddress1").val(jobj[0].address1);
            $("#txtCorCity").val(jobj[0].city);
            $("#txtCorState").append('<option value="' + jobj[0].state + '" selected>' + jobj[0].state + '</option>');
            //$("#txtCorState").select2('').empty().select2({ data: [{ name: d[0].StateFullName, id: d[0].state, text: d[0].StateFullName }] })
            $("#txtCorZipCode").val(jobj[0].zip);
            $("#txtCorCountry").val(jobj[0].country).trigger('change');
            $("#txtpublic").val(jobj[0].note);

            $("#btnSaveinfo").hide();
            $("#btnUpdateinfo").show();
            $("#btnResetinfo").show();
        },
        complete: function () { $("#loader").hide(); },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
    })
}

function resetaddressinfo() {
    $("#hfaddressid").val('');
    $('#txtCorContact').val('');
    $('#txtCorAddress').val('');
    $("#txtCorAddress1").val('');
    $("#txtCorCity").val('');
    $("#txtCorState").val('');
    $("#txtCorZipCode").val('');
    $("#txtpublic").val('');
    $("#btnSaveinfo").show();
    $("#btnUpdateinfo").hide();
    $("#btnResetinfo").show();
}

function EditWarehouseinfo() {
    //Additional info
    rowid = $("#hfaddressid").val();
    corphone = $("#txtCorContact").val();
    coraddress = $("#txtCorAddress").val();
    coraddress1 = $("#txtCorAddress1").val();
    corcity = $("#txtCorCity").val();
    corstate = $("#txtCorState").val();
    corzip = $("#txtCorZipCode").val();
    corcountry = $("#txtCorCountry").val();
    publicnote = $("#txtpublic").val();

    if (coraddress == "") {
        swal('Alert', 'Please enter address', 'error').then(function () { swal.close(); $('#txtCorAddress').focus(); });
    }
    else if (corcity == "") {
        swal('Alert', 'Please enter city', 'error').then(function () { swal.close(); $('#txtCorCity').focus(); });
    }
    else if (corstate == "") {
        swal('Alert', 'Please enter state', 'error').then(function () { swal.close(); $('#txtCorState').focus(); });
    }
    else if (corzip == "") {
        swal('Alert', 'Please enter zip Code', 'error').then(function () { swal.close(); $('#txtCorZipCode').focus(); });
    }

    else {
        $("#txtCorZipCode").change();
        if ($("#hfCorZipStatus").val() == "true") {
            var obj = {
                address_id: rowid,
                cor_phone: corphone,
                cor_address: coraddress,
                cor_address1: coraddress1,
                cor_city: corcity,
                cor_state: corstate,
                cor_zip: corzip,
                cor_country: corcountry,
                note_public: publicnote,
            }
            $.ajax({
                url: '/Warehouse/Editwarehousesinfo/', dataType: 'json', type: 'Post',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(obj),
                dataType: "json",
                beforeSend: function () { $("#loader").show(); },
                success: function (data) {
                    if (data.status == true) {
                        swal('Success', data.message, 'success');
                        resetaddressinfo();
                        WarehouseAddressInfoList();
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
}
//----------------------Edit warehouse additional info end---------------------

//---------------------Product stock-------------------------------------------
function WarehouseStocklist() {
    //let warehouseid = $("#hfid").val();
    //var obj = { ID: warehouseid }
    //var table_EL = $('#banktansfer').DataTable({
    //    columnDefs: [{ 'visible': false, 'targets': [0] }],
    //    order: [[0, "asc"]], ordering: true, destroy: true, bProcessing: true, bServerSide: false, bAutoWidth: false, searching: true, responsive: true, lengthMenu: [[10, 20, 50], [10, 20, 50]],
    //    language: {
    //        lengthMenu: "_MENU_ per page", zeroRecords: "Sorry no records found", info: "Showing _START_ to _END_ of _TOTAL_ entries",
    //        infoFiltered: "", infoEmpty: "No records found", processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
    //    },
    //    initComplete: function () {
    //        $('#banktansfer_filter input').unbind();
    //        $('#banktansfer_filter input').bind('keyup', function (e) {
    //            var code = e.keyCode || e.which;
    //            if (code == 13) { table_EL.search(this.value).draw(); }
    //        });
    //    },
    //    ajax: {
    //        url: '/Warehouse/GetProductStockList', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8", data: obj,
    //        error: function (xhr, error, thrown) {
    //            console.log("AJAX error:", xhr, error, thrown);
    //        },
    //        dataSrc: function (data) { console.log(JSON.parse(data)); return JSON.parse(data); }
    //    },
    //    aoColumns: [
    //        { data: 'id', title: 'ID', sWidth: "10%" },
    //        { data: 'post_title', title: 'Product Name', sWidth: "10%", class: 'text-left' },
    //        { data: 'stock', title: 'In stock', sWidth: "5%", className: "text-right", },
    //        { data: 'SaleUnits', title: 'Sales unit', sWidth: "5%", className: "text-right", },
    //        { data: 'Damage', title: 'Damage unit', sWidth: "5%", className: "text-right", },
    //    ],

    //});


    let warehouseid = $("#hfid").val();
     obj = { ID: warehouseid }
    $('#banktansfer').DataTable({
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
            url: '/Warehouse/GetProductStockList', type: 'GET', dataType: 'json', contentType: "application/json; charset=utf-8",
            data: obj,
            dataSrc: function (data) { return JSON.parse(data); }
        },
        lengthMenu: [[20, 50, 100], [20, 50, 100]],
        columns: [
            { data: 'id', title: 'ID', sWidth: "10%" },
            { data: 'post_title', title: 'Product Name', sWidth: "10%", class: 'text-left' },
            { data: 'stock', title: 'In stock', sWidth: "5%", className: "text-right", },
            { data: 'SaleUnits', title: 'Sales unit', sWidth: "5%", className: "text-right", },
            { data: 'Damage', title: 'Damage unit', sWidth: "5%", className: "text-right", },

        ],
        columnDefs: [{ targets: [0], visible: false, searchable: false, }, { "orderable": false, "targets": -1 }]

    });
}