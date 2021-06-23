
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
        }

        $("#StateRecycleFee").val('');
        //$("#").val();
        $("#Item_Name").val('');
        $("#shipcity").val('');
        $("#shipstate").val('');
        $("#Ship_Zip_PostCode").val('');
        $("#shipcountry").val('');
    }

}