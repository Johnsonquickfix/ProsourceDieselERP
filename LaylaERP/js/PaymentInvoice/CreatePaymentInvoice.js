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
            getPurchaseOrderInfo(queryString["status"], queryString["id"]);      
        }
    });
})

function getPurchaseOrderInfo(status, id) {
    console.log(status, id);
    //let oid = parseInt($('#lblPoNo').data('id')) || 0;
  /*  if (id > 0) {*/
        $('.page-heading').text('Receive Order ').append('<a class="btn btn-danger" href="/PaymentInvoice/PaymentInvoiceList">Back to List</a>');
        $('#line_items').empty();
        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/PaymentInvoice/PaymentInvoiceList">Back to List</a>');
        var option = { strValue1: status, strValue2: id };
        $.ajax({
            url: "/PaymentInvoice/GetPurchaseOrderByID", type: "Get", beforeSend: function () { $("#loader").show(); }, data: option,
            success: function (result) {
                try {
                    let data = JSON.parse(result); let VendorID = 0;
                    //console.log(data);
                    for (let i = 0; i < data['po'].length; i++) {
                        VendorID = parseInt(data['po'][i].fk_supplier) || 0;
                        $('#lblPoNo').text(data['po'][i].ref);
                        $('#txtRefvendor').val(data['po'][i].ref_supplier);
                        $('#txtPODate').val(data['po'][i].date_creation);  
                        $("#hfid").val(data['po'][i].rowid);

                    }
                    for (let i = 0; i < data['pod'].length; i++) {
                        let itemHtml = '';
                        if (data['pod'][i].fk_product > 0) {
                            itemHtml = '<tr id="tritemid_' + data['pod'][i].fk_product + '" class="paid_item" data-pid="' + data['pod'][i].fk_product + '" data-pname="' + data['pod'][i].description + '" data-psku="' + data['pod'][i].product_sku + '" data-rowid="' + data['pod'][i].rowid + '">';
                            itemHtml += '<td class="text-center"><button class="btn p-0 text-red btnDeleteItem billinfo" onclick="removeItems(\'' + data['pod'][i].fk_product + '\');"> <i class="glyphicon glyphicon-trash"></i> </button></td>';
                            itemHtml += '<td>' + data['pod'][i].description + '</td><td>' + data['pod'][i].product_sku + '</td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemprice_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].subprice.toFixed(2) + '" name="txt_itemprice" placeholder="Price"></td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemqty_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].qty.toFixed(0) + '" name="txt_itemqty" placeholder="Qty."></td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itembalqty_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].recbal.toFixed(0) + '" name="txt_itembalqty" placeholder="BalQty."></td>';
                            itemHtml += '<td><input min="1" autocomplete="off" class="form-control billinfofo number rowCalulate" type="number" id="txt_itemRecqty_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].recbal.toFixed(0) + '" name="txt_itemRecqty" placeholder="RecQty."></td>';
                            itemHtml += '<td><input min="0" autocomplete="off" class="form-control billinfo number rowCalulate" type="number" id="txt_itemdisc_' + data['pod'][i].fk_product + '" value="' + data['pod'][i].discount_percent.toFixed(2) + '" name="txt_itemdisc" placeholder="Discount"></td>';
                            itemHtml += '<td class="text-right tax-amount" data-tax1="' + data['pod'][i].localtax1_tx + '" data-tax2="' + data['pod'][i].localtax2_tx + '">' + data['pod'][i].total_localtax1.toFixed(2) + '</td>';
                            itemHtml += '<td class="text-right ship-amount">' + data['pod'][i].total_localtax2.toFixed(2) + '</td>';
                            itemHtml += '<td class="text-right row-total">' + data['pod'][i].total_ttc.toFixed(2) + '</td>';
                            itemHtml += '</tr>';
                            $('#line_items').append(itemHtml);
                        }
                       
                    }
                }
                catch (error) {
                    $("#loader").hide(); swal('Alert!', "something went wrong.", "error");
                }
            },
            complete: function () { $("#loader").hide(); },
            error: function (xhr, status, err) { $("#loader").hide(); swal('Alert!', "something went wrong.", "error"); }, async: false
        });       
        $('.footer-finalbutton').empty().append('<a class="btn btn-danger pull-left" href="/PaymentInvoice/PaymentInvoiceList">Back to List</a><button type="button" class="btn btn-danger btnEdit"><i class="far fa-edit"></i> Edit</button>');
       // $(".top-action").empty().append('<button type="button" class="btn btn-danger btnEdit" data-toggle="tooltip" title="Edit"><i class="far fa-edit"></i> Edit</button>');

    //}
    //else {   
    //    $("#loader").hide();
    //    //$('.page-heading').text('Add New Order');
    //    $(".top-action").empty();
    //}
}