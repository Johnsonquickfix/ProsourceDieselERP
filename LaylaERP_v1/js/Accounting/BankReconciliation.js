$(document).ready(function () {
    $("#loader").hide(); 
    $('#txtEndingDate').datepicker({ format: 'mm/dd/yyyy', autoclose: true, todayHighlight: true });
    let today = new Date();
    $('#txtEndingDate').val();
    getbankaccount() 
    $(".select2").select2();
    $('#ddlaccount').change(function (t) {
        getdata();
    });
    $(document).on('click', "#btnreconciling", function () {
        reconciling();
    })

    $("#txtEndingbalance").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\d.]/g, ''));
        $this.val($this.val().substring(0, 10));
    });
   
});
function getbankaccount() {
    $.ajax({
        url: "/PaymentInvoice/getbankaccount",
        type: "Get",
        success: function (data) {
            $('#ddlaccount').append('<option value="0">Select Account</option>');
            for (var i = 0; i < data.length; i++) {
                $('#ddlaccount').append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
            }
        }, async: false
    });
}

function getdata() {
    var ID = $("#ddlaccount").val();   
    var obj = { strVal: ID }
    $.ajax({ 
        url: '/Accounting/GetDataByID/' + ID,
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify(obj),
        success: function (data) {
            var i = JSON.parse(data);
            console.log(i.length);
            if (i.length > 0) {
                $('#lblbeginningbalance').data('id', i[0].bank_ending_balance);
                $('#lblbeginningbalance').text(i[0].bank_ending_balance);
                $('#lblbillNo').data('id', i[0].rowid);
               
                $('#lblendingdata').data('id', i[0].ending_date);
                $('#lblendingdata').text(i[0].ending_date);
            }
            else {

                $('#lblbeginningbalance').text("0");
                    $('#lblendingdata').text("01/31/2022");
            }            
        },
        error: function (msg) { alert(msg); },
        async: false
    });

}

function reconciling() {     
   // ID = $("#hfid").val();     
    //console.log('ll');
    acountID = $("#ddlaccount").val();
    beginningbalanceval = $('#lblbeginningbalance').text();
    endingdata = $('#lblendingdata').text();
    endingdatetex = $("#txtEndingDate").val();
    endingbal = $("#txtEndingbalance").val();
    accountname = $("#ddlaccount option:selected").text();
     
    let id = parseInt($('#lblbillNo').data('id')) || 0;
    //console.log(id);
    let sd = $("#txtEndingDate").val();
    if (acountID == 0) {
        swal('Alert', 'Please select account.', 'error').then(function () { swal.close(); $('#ddlaccount').focus(); });
    }
    else if (endingbal == '' || endingbal == 0) {
        swal('Alert', 'Please enter ending balance.', 'error').then(function () { swal.close(); $('#txtEndingbalance').focus(); });
    }
    else if (endingdatetex == '') {
        swal('Alert', 'Please enter ending date.', 'error').then(function () { swal.close(); $('#txtEndingDate').focus(); });
    }
    else if (endingdata >= endingdatetex) {
        swal('Alert', 'Already reconciliation done for this date.Please enter another date.', 'error').then(function () { swal.close(); $('#txtEndingDate').focus(); });
    }     
    else {
        var obj = {
            //ID: ID,
            //updatedID: UpdatedIDval,
            //post_title: productname,
            //post_name: productname,
            //ProductTypeID: ProductTypeval,
            //post_content: formetcustom,
            //regular_price: regularprice,
            //sale_price: saleprice,
            //tax_status: taxstatus,
            //tax_class: classtax,
            //sku: sku,
            //manage_stock: enableStockval,
            //backorders: allowbackorders,
            //stock: Stockquantity,
            //stock_status: stockstatus,
            //low_stock_amount: Lowstockthreshold,
            //sold_individually: solidIndividuallyval,
            //ShippingclassID: Shipping,
            //weight: weigh,
            //length: Length,
            //width: Width,
            //height: Height,
            //upsell_ids: upsellsval,
            //crosssell_ids: Crosssellsval,
            //price: saleprice,
            //CategoryID: categorydataval,
            //PublishDate: date_publish,
            //_gift_card: giftcard,
            //_gift_card_expiration_days: dayexpire,
            //_gift_card_template_default_use_image: Recipientemail,
            //post_status: pdstatus
        }
        var checkstr = confirm('Want to reconciling?');
        if (checkstr == true) {

            var url = "/Accounting/BankReconciliationprocess?edate=" + sd + "&id=" + id + "&endbailance=" + endingbal + "&stdate=" + endingdata + "&accountname=" + accountname;
            window.location.href = url;
            //$.ajax({
            //    url: '/Product/CreateProduct/', dataType: 'json', type: 'Post',
            //    contentType: "application/json; charset=utf-8",
            //    data: JSON.stringify(obj),
            //    dataType: "json",
            //    beforeSend: function () {
            //        $("#loader").show();
            //    },
            //    success: function (data) {
            //        if (data.status == true) {
            //            if (data.url == "Manage") {
            //                swal('Success!', data.message, 'success').then((result) => { location.href = '../ListProduct'; });
            //            }
            //            else {
            //                $('#fetch_results > input:text').val('');
            //                swal('Success!', data.message, 'success').then((result) => { location.href = 'ListProduct'; });
            //            }
            //            //$('#ddlProduct').val(null).trigger('change');
            //            //clear_fetch();

            //        }
            //        else {
            //            swal('Alert!', data.message, 'error')
            //        }
            //    },
            //    complete: function () {
            //        $("#loader").hide();
            //        //location.href = '/Users/Users/';
            //        //window.location.href = '/Users/Users/';
            //        isEdit(false);
            //    },
            //    error: function (error) {
            //        swal('Error!', 'something went wrong', 'error');
            //    },
            //})
        } else {
            return false;
        }
    } 
}