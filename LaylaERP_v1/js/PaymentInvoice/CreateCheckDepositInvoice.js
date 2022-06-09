$(document).ready(function () {
    var queryString = new Array();
    $(function () {
        if (queryString.length == 0) {
            if (window.location.search.split('?').length > 1) {
                var params = window.location.search.split('?')[1].split('&');
                for (var i = 0; i < params.length; i++) {
                    var key = params[i].split('=')[0];
                    var value = decodeURIComponent(params[i].split('=')[1]);
                    queryString[key] = value;
                }
            }
        }
        if (queryString["status"] != null && queryString["id"] != null) {
            $("#hfstatus").val(queryString["status"]);
            $("#hfqueryids").val(queryString["id"]);
            getInfo();
        }
    }); 

    //filldropdown();
    $('.billinfo').prop("disabled", true);
})

function getInfo() {
    let status = $("#hfstatus").val(), id = $("#hfqueryids").val();
    $('.page-heading').text('Check Clearance Process').append('<a data-toggle="tooltip" title="Back to list" class="btn btn-danger back_to_list" href="/CheckDeposit/CheckDepositList">Back to List</a>');
    $('#line_items').empty();
    $('.footer-finalbutton').empty().append('<a data-toggle="tooltip" title="Back to list" class="btn btn-danger back_to_list" href="/CheckDeposit/CheckDepositList">Back to List</a>');
    var option = { strValue1: status, strValue2: id };
    $.ajax({
        url: "/CheckDeposit/GetDataByID", type: "Get", beforeSend: function () { $("#loader").show(); }, data: option,
        success: function (result) {
            try {
                let data = JSON.parse(result);
                for (let i = 0; i < data['po'].length; i++) {               
                    $('#lblnocheck').text(data['po'][i].chkno);
                    $('#lblaccount').text(data['po'][i].bankname);
                }
                for (let i = 0; i < data['pod'].length; i++) {
                    let itemHtml = '';
                    if (data['pod'][i].rowid > 0) {
                        itemHtml = '<tr id="tritemid_' + data['pod'][i].rowid + '" class="paid_item" data-pid="' + data['pod'][i].rowid + '" data-rowid="' + data['pod'][i].rowid + '">';
                        itemHtml += '<td>' + data['pod'][i].row_num + '</td>';
                        itemHtml += '<td class="text-left">' + data['pod'][i].date_creation + '</td>';
                        itemHtml += '<td class="text-left num-paymentval" data-numval="' + data['pod'][i].num_payment + '">' + data['pod'][i].num_payment + '</td>';
                        itemHtml += '<td class="text-left">' + data['pod'][i].Transmitter + '</td>';
                        itemHtml += '<td class="text-left">' + data['pod'][i].Bank + '</td>';
                        //itemHtml += '<td class="text-right ship-amount">$' + data['pod'][i].amount.toFixed(2) + '</td>';
                        //itemHtml += '<td class="text-right row-total">$' + data['pod'][i].recieved.toFixed(2) + '</td>';
                        itemHtml += '<td class="text-right price-remaining" data-tax1="' + data['pod'][i].amount + '">$' + data['pod'][i].amount.toFixed(2) + '</td>';
                        //itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + data['pod'][i].rowid + '" value="' + data['pod'][i].remaining.toFixed(2) + '" name="txt_itemprice" placeholder="Payment"></td>';
                        itemHtml += '</tr>';
          
                        $('#line_items').append(itemHtml);
                    }
                }
            }
            catch (error) { $("#loader").hide(); swal('Error', "something went wrong.", "error"); }
        },
        complete: function () { $("#loader").hide(); },
        error: function (xhr, status, err) { $("#loader").hide(); swal('Error', "something went wrong.", "error"); }, async: false
    });
    $("#divAddItemFinal").find(".rowCalulate").change(function () { calculateFinal(); }); calculateFinal();
    $('.footer-finalbutton').empty().append('<a data-toggle="tooltip" title="Back to list" class="btn btn-danger back_to_list" href="/CheckDeposit/CheckDepositList">Back to List</a><button data-toggle="tooltip" title="Click for validate" type="button" class="btn btn-danger btnvalidate"><i class="far fa-edit"></i> Validate</button>');
    // $(".top-action").empty().append('<button type="button" class="btn btn-danger btnvalidate" data-toggle="tooltip" title="Edit"><i class="far fa-edit"></i> Edit</button>');
    $(".top-action").empty().append('<button type="button" data-toggle="tooltip" title="Click for validate" class="btn btn-danger btnvalidate" ><i class="far fa-edit"></i> Validate</button>');
    $('.billinfo').prop("disabled", true);
}
//$(document).on("click", ".btnvalidate", function (t) {
//    t.preventDefault(); $("#loader").show();
//    $('.billinfo').prop("disabled", false); //$('#txtbillfirstname').focus();
//    $('.footer-finalbutton').empty().append('<a class="btn btn-danger back_to_list" href="/CheckDeposit/CheckDepositList">Back to List</a><button type="button" class="btn btn-danger btnUndoRecord"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" class="btn btn-danger" id="btnSave"><i class="far fa-save"></i> Pay</button>');
//    $(".top-action").empty().append('<button type="button" class="btn btn-danger btnUndoRecord" data-toggle="tooltip" title="Cancel"><i class="fa fa-undo"></i> Cancel</button>  <button type="button" class="btn btn-danger" id="btnSave" data-toggle="tooltip" title="Pay"><i class="far fa-save"></i> Pay</button>');
//    $("#loader").hide();
//});
$(document).on("click", ".btnUndoRecord", function (t) { t.preventDefault(); $("#loader").show(); getPurchaseOrderInfo(); });
function calculateFinal() {
    let tGrossAmt = 0.00;
    //main item

    $("#line_items > tr.paid_item").each(function (index, row) {
        let rPrice = 0.00, rQty = 0.00
     
       // remaing = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
        rPrice = parseFloat($(row).find(".price-remaining").data('tax1')) || 0.00;
        console.log('yfy');
        //if (remaing > payment) {
        //    swal('Alert!', "you can't receive greater payment form  remaining payment", "error");
        //    parseFloat($(row).find("[name=txt_itemprice]").val(0.00));
        //    $(row).find("[name=txt_itemprice]").focus();

        //}
     
        tGrossAmt += rPrice;
    });
    console.log(tGrossAmt);
    $("#Total").html(tGrossAmt.toFixed(2));
}

$(document).on("click", ".btnvalidate", function (t) {
    t.preventDefault();  saveVendorPO();
});
//$(document).on("click", "#btnSave", function (t) { t.preventDefault();  });

function saveVendorPO() {
    // let id = parseInt($('#lblPoNo').data('id')) || 0;
    let accountid = $("#hfstatus").val();
    
    let _list = createItemsList();
        let _order = {         
            amount: parseFloat($("#Total").text()), fk_bank: accountid,
        }
        let option = { strValue1: 0, strValue2: JSON.stringify(_order), strValue3: JSON.stringify(_list) }
        //console.log(option);
        swal.queue([{
            title: 'Are you sure?', confirmButtonText: 'Yes', text: 'Would you like to send to bank the $' + parseFloat($("#Total").text()) + ' amount?',
            showLoaderOnConfirm: true, showCancelButton: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    $.post('/CheckDeposit/Paymenttobank', option).done(function (result) {
                        result = JSON.parse(result);
                        if (result[0].Response == "Success") {
                            swal('Success', 'Payment has been taken successfully!!', 'success').then((result) => { location.href = 'CheckDepositList/1000011'; });

                        }
                        else { swal('Error', 'Something went wrong, please try again.', "error"); }
                    }).catch(err => { swal('Error!', 'Something went wrong, please try again.', 'error'); });
                });
            }
        }]);
    
}

function createItemsList() {
    let _list = [];
    $('#line_items > tr').each(function (index, row) {
        remaing = 0.00;
       // payment = parseFloat($(row).find("[name=txt_itemprice]").val()) || 0.00;
      let chkno = $(row).find(".num-paymentval").data('numval') ;
        console.log(chkno);
        remaing = parseFloat($(row).find(".price-remaining").data('tax1')) || 0.00;
        //if (payment != 0) {
        _list.push({ fk_payment: $(row).data('rowid'), amount: remaing, num_payment: chkno });
        //}
    });
    return _list;
}