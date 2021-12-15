
//function Datagrid() {

//    $('#dtdata').dataTable();
//        $.ajax({
//            type: "GET",
//            url: "/FeeNTax/GetFeeNTaxList",
//            contentType: "application/json; charset=utf-8",
//            data: "{}",
//            dataType: "json",
//            success: function (data) {
//                console.log(data);
//                $.each(data, function (key, i) {
//                    $("#dtdata").append("<tr><td>" + i.id + "</td><td>" + i.staterecyclefee + "</td><td>" + i.state + "</td><td>" + i.item_name + "</td><td>" + i.city + "</td><td>" + i.zip + "</td><td>" + i.country + "</td><td><a href='#'>Edit</a></td></tr>");
//                });

//            },
//            error: function (result) {
//                alert("Error");
//            }
//        })
//    };

function Datagrid() {

    var s = $("#ddlSearchStatus").val();
    $('#dtdata').DataTable({
        destroy: true,
        scrollX: true,
        bAutoWidth: false,
        "ajax": {
            "url": "/FeeNTax/GetFeeNTaxList",
            "type": 'GET',
            "dataType": 'json',
            data: { status: s },
            contentType: "application/json; charset=utf-8",
        },
        lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
        "columns": [

            { 'data': 'id', 'sWidth': "8%" },
            { 'data': 'recyclefee', 'sWidth': "15%" },
            { 'data': 'item_name', 'sWidth': "20%" },
            { 'data': 'state', 'sWidth': "15%" },
            { 'data': 'country', 'sWidth': "10%" },
            { 'data': 'taxableshow', 'sWidth': "10%" },
            { 'data': 'activeshow', 'sWidth': "10%" },

            {
                'data': 'id', sWidth: "12%",
                'render': function (id, type, full, meta) {
                    if ($("#hfEdit").val() == "1") {
                        return '<a href="../FeeNTax/CreateNew/' + id + '" onclick="ActivityLog(\'Edit state recycle tax\',\'/FeeNTax/Index/' + id +'\');"><i class="glyphicon glyphicon-pencil"></i></a>'
                    }
                    else { return "No Permission"; }
                }
            }
        ],
        "order": [[0, 'desc']],
    });
}
//    $.ajax({
//        type: "GET",
//        url: "/FeeNTax/GetFeeNTaxList",
//        contentType: "application/json; charset=utf-8",
//        data: "{}",
//        dataType: "json",
//        success: function (data) {            
//            console.log(data);
//            $.each(data, function (key, i) {
//                $("#dtdata").append("<tr><td>" + i.id + "</td><td>" + i.staterecyclefee + "</td><td>" + i.state + "</td><td>" + i.item_name + "</td><td>" + i.city + "</td><td>" + i.zip + "</td><td>" + i.country + "</td><td><a href='/FeeNTax/StateRecycleTax/" + i.id + "'>Edit</a></td></tr>");
//            });

//        },
//        error: function (result) {
//            alert("Error");
//        }
//    });
//}

function AddFeeNTax() {
    id = $("#hfid").val();
    Staterecyclefee = $("#StateRecycleFee").val();
    //Item_name = $("#Item_Name").text().trim();
    var data = $("#Item_Name option:selected").text();
    Item_name=data;
    //alert(data);
    City = $("#shipcity").val();
    State = $("#shipstate").val();
    Zip = $("#Ship_Zip_PostCode").val();
    Country = $("#shipcountry").val();
    item_parent_id = $("#Item_Name").val();
    istaxable = $("#chktaxable").prop("checked") ? 1 : 0;
    isactive = $("#chkactive").prop("checked") ? 1 : 0;

    if (Staterecyclefee == "") {
        swal('alert', 'Please enter state recycle fee', 'error').then(function () { swal.close(); $('#StateRecycleFee').focus(); })
    }
    else if (Item_name == "") {
        swal('alert', 'Please enter product name', 'error').then(function () { swal.close(); $('#Item_Name').focus(); })
    }
    else if (City == "") {
        swal('alert', 'Please enter ship city', 'error').then(function () { swal.close(); $('#shipcity').focus(); })
    }
    else if (State == "") {
        swal('alert', 'Please enter ship state', 'error').then(function () { swal.close(); $('#shipstate').focus(); })
    }
    else if (Zip == "") {
        swal('alert', 'Please enter ship zip code', 'error').then(function () { swal.close(); $('#Ship_Zip_PostCode').focus(); })
    }

    else {
        $("#Ship_Zip_PostCode").change();
        if ($("#hfzipstatus").val() == "true") {
            var obj = {
                id: id, staterecyclefee: Staterecyclefee, item_name: Item_name, city: City, state: State, zip: Zip,
                country: Country, item_parent_id: item_parent_id, is_taxable: istaxable, is_active: isactive,
            }
            $.ajax({
                url: '/FeeNTax/StateRecycleTax/', dataType: 'json', type: 'Post',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(obj),
                dataType: "json",
                beforeSend: function () {
                    $("#loader").show();
                },
                success: function (data) {
                    if (data.status == true) {
                        $('#parent > input:text').val('');
                        swal('Success!', data.message, 'success').then((result) => { location.href = '../Index'; });
                    }
                    else {
                        swal('Alert!', data.message, 'error')
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

            //function EditUser(id) {
            //    window.location.href = 'StateRecyleTax?id=' + i.id;
            //}
        }
    }
}

function GetFeeNTaxByID(id) {

    var ID = id;
    var obj = {};
    $.ajax({

        url: '/FeeNTax/GetFeeNTaxByID/' + ID,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var i = JSON.parse(data);
            console.log(i);
            $("#shipcountry").val(i[0].country).trigger('change');
            $("#StateRecycleFee").val(i[0].staterecyclefee);
            $("#shipcity").empty().append('<option value="' + i[0].city + '" selected>' + i[0].city + '</option>');
            $("#shipstate").empty().append('<option value="' + i[0].state + '" selected>' + i[0].state + '</option>');
            $("#Item_Name").empty().append('<option value="' + i[0].item_parent_id + '" selected>' + i[0].item_name + '</option>');
            $("#Ship_Zip_PostCode").val(i[0].zip);
            i[0].is_taxable == true ? $("#chktaxable").prop("checked", true) : $("#chktaxable").prop("checked", false);
            i[0].is_active == true ? $("#chkactive").prop("checked", true) : $("#chkactive").prop("checked", false);
            $('#Item_Name').val(i[0].item_parent_id).trigger('change');
        },
        error: function (msg) { alert(msg); }
    });
}

function UpdateFeeNTaxStatus() {

    var obj = { strVal: ID }
    debugger
    $.ajax({
        url: '/FeeNTax/UpdateFeeNTax/', dataType: 'json', type: 'Post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            console.log(data);
            if (data.status == true) {
                swal('Success!', data.message, 'success');
            }
            else {
                swal('Alert!', data.message, 'error')
            }
        },
        error: function (error) {
            swal('Error!', 'something went wrong', 'error');
        },
    })


    $("#StateRecycleFee").val('');
    //$("#").val();
    $("#Item_Name").val('');
    $("#shipcity").val('');
    $("#shipstate").val('');
    $("#Ship_Zip_PostCode").val('');
    $("#shipcountry").val('');
}

