$(document).ready(function () {
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    $("#loader").hide();
    $(".select1").select2();
    $(document).on('click', "#btnAdd", function () {
        updateattribitues();
    });

    if (id > 0) {
        $("#hfid").val(id);
        console.log(id);
      EditSelect(id);
    }
    else {
        $("#hfid").val("0");
    }
})
 

function updateattribitues() {
    pid = parseInt($("#hfid").val()) || 0;
    attributs = $("#txtattribute").val();
    o_attributs = $("#txtoldattribute").val();
    product = parseInt($("#ddlProductType").val()) || 0;
   

    if (attributs == '') {
        swal('Alert', 'Please enter attributes', 'error').then(function () { swal.close(); $('#txtattribute').focus(); });
    }

    else if (o_attributs == '') {
        swal('Alert', 'Please enter old attributes', 'error').then(function () { swal.close(); $('#txtoldattribute').focus(); });
    }
    else if (product <= 0) {
        swal('Alert', 'Please select product type', 'error').then(function () { swal.close(); $('#ddlProductType').focus(); });
    }     

    else {
  
        var obj = {
            strValue1: attributs,
            strValue2: o_attributs,
            strValue3: product,
            strValue4: pid

        }
        var checkstr = confirm('are you sure want to update?');
        if (checkstr == true) {
            $.ajax({
                url: '/Setting/Updateattribitues/', dataType: 'json', type: 'Post',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(obj),
                dataType: "json",
                beforeSend: function () { $("#loader").show(); },
                success: function (data) {
                    if (data.status == true) {
                        //$('#parent > input:text').val('');
                        //swal('Success', data.message, 'success');
                        //swal('Success', data.message, 'success').then((result) => { location.href = '../Customer'; });
                        //if (data.url == "Manage") {
                        //    swal('Alert!', data.message, 'success').then((result) => { location.href = 'ProductOpeningStock'; });
                        //}
                        //else {
                        swal('Success', data.message, 'success').then((result) => { location.href = '../ProductAttributesVariation'; });

                       // }

                    }
                    else {
                        swal('Alert!', data.message, 'error');
                    }
                },
                complete: function () { $("#loader").hide(); },
                error: function (error) { swal('Error!', 'something went wrong', 'error'); },
            })
        } else {
            return false;
        }
    }

}

 

function EditSelect(id) {
    var obj = { strValue1: id }
    $.ajax({
        url: '/Setting/GetattributesById/',
        datatype: 'json',
        type: 'Post',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(obj),
        success: function (data) {
            var jobj = JSON.parse(data);
            // $("#hfid").val(jobj[0].rowid);
            $('#txtattribute').val(jobj[0].meta_value);
            $('#txtoldattribute').val(jobj[0].meta_value_old);
            setTimeout(function () { getProductid(jobj[0].pid); }, 1000);
            //$("#ddlProduct").val(jobj[0].product_id).trigger('change');
           // $('#txtoldattribute').attr("disabled", "disabled");
        },
        complete: function () { },
        error: function (error) { swal('Error!', 'something went wrong', 'error'); },
        async: false
    });
}
function getProductid(shipping) {
    $('#ddlProductType').val(shipping).trigger('change');
};