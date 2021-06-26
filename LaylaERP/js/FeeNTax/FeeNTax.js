
function Datagrid() {

    $('#dtdata').dataTable();



        $.ajax({
            type: "GET",
            url: "/FeeNTax/GetFeeNTaxList",
            contentType: "application/json; charset=utf-8",
            data: "{}",
            dataType: "json",
            success: function (data) {
                console.log(data);
                $.each(data, function (key, i) {
                    $("#dtdata").append("<tr><td>" + i.id + "</td><td>" + i.staterecyclefee + "</td><td>" + i.state + "</td><td>" + i.item_name + "</td><td>" + i.city + "</td><td>" + i.zip + "</td><td>" + i.country + "</td><td><a href='#'>Edit</a></td></tr>");
                });

            },
            error: function (result) {
                alert("Error");
            }
        })
    };



    //destroy: true,
    //    bAutoWidth: false,
    //        "ajax": {
    //        "url": "/FeeNTax/GetFeeNTaxList",
    //        "type": 'GET',
    //            "dataType": 'json',
    //                data: {},
    //    contentType: "application/json; charset=utf-8",
    //    },
    //lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
    //    "columns": [
           
    //        { 'data': 'id', 'sWidth': "8%" },
    //        { 'data': 'staterecyclefee', 'sWidth': "12%" },
    //        { 'data': 'state', 'sWidth': "25%" },
    //        { 'data': 'item_name', 'sWidth': "10%" },
    //        { 'data': 'zip', 'sWidth': "15%" },
    //        { 'data': 'country', 'sWidth': "30%" },
    //        {
    //            'data': 'my', 'sWidth': "22%",

    //        },
    //        {
    //            'data': 'ID', sWidth: "8%",
    //            'render': function (ID, type, full, meta) {
    //                return '<a href="javascript:void(0);" onClick="EditUser(' + ID + ')"><i class="glyphicon glyphicon-pencil"></i></a>'
    //            }
    //        }
    //    ],
    //    "order": [[1, 'desc']],
    //});
 


//function EditUser(id) {
//    window.location.href = 'Index?id=' + id;
//}






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
    debugger

    Id = $("#hfid").val();
    Staterecyclefee = $("#StateRecycleFee").val();
    //item_parent_id = $("#").val();
    Item_name = $("#Item_Name").val();
    City = $("#shipcity").val();
    State = $("#shipstate").val();
    Zip = $("#Ship_Zip_PostCode").val();
    Country = $("#shipcountry").val();


    if (Staterecyclefee == "") {
        swal('alert', 'Please Enter StateRecyclefee', 'error').then(function () { swal.close(); $('#StateRecycleFee').focus(); })
    }
    else if (Item_name == "") {
        swal('alert', 'Please Enter item_name', 'error').then(function () { swal.close(); $('#Item_Name').focus(); })
    }
    else if (Zip == "") {
        swal('alert', 'Please Enter zip', 'error').then(function () { swal.close(); $('#Ship_Zip_PostCode').focus(); })
    }

    else {
        var obj = {
            staterecyclefee: Staterecyclefee, item_name: Item_name, city: City, state: State, zip: Zip,
            country: Country
        }
        $.ajax({
            url: '/FeeNTax/StateRecycleTax/', dataType: 'json', type: 'Post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            dataType: "json",
            success: function (data) {
                if (data.status == true) {

                    swal('Alert!', data.message, 'success');

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
        })

        //function EditUser(id) {
        //    window.location.href = 'StateRecyleTax?id=' + i.id;
        //}
    }
}

function GetFeeNTaxByID(id) {
            debugger
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
                    $("#StateRecycleFee").val(i[0].staterecyclefee);
                    $("#shipstate").val(i[0].state);
                    $("#Item_Name").val(i[0].item_name);
                    $("#shipcity").val(i[0].city);
                    $("#Ship_Zip_PostCode").val(i[0].zip);
                    $("#shipcountry").val(i[0].country);


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
                        swal('Alert!', data.message, 'success');
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

