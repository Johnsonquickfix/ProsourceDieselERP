using LaylaERP.BAL;
using LaylaERP.UTILITIES;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class PaymentSettlementController : Controller
    {
        // GET: PaymentSettlement
        public ActionResult Index()
        {
            return View();
        }
        [Route("paymentsettlement/order-authorize-net")]
        public ActionResult OrderAuthorizeNet()
        {
            try
            {
                string orders_json = string.Empty, order_refund_json = string.Empty;
                DataSet ds = OrderRepository.GetUnsettledOrder("authorize_net_cim_credit_card");
                string ApiLoginID = string.Empty, ApiTransactionKey = string.Empty;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    ApiLoginID = (dr["AuthorizeAPILogin"] != Convert.DBNull) ? dr["AuthorizeAPILogin"].ToString() : "";
                    ApiTransactionKey = (dr["AuthorizeTransKey"] != Convert.DBNull) ? dr["AuthorizeTransKey"].ToString() : "";
                }

                string str_meta = string.Empty, transaction_id = string.Empty;
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    transaction_id = (dr["transaction_id"] != Convert.DBNull) ? dr["transaction_id"].ToString() : "";
                    dynamic obj = clsAuthorizeNet.GetTransactionDetails(ApiLoginID, ApiTransactionKey, transaction_id);
                    if (obj != null && obj.messages.resultCode == AuthorizeNet.Api.Contracts.V1.messageTypeEnum.Ok)
                    {
                        str_meta += (str_meta.Length > 0 ? ", " : "") + "{ \"order_id\" : \"" + ((dr["id"] != Convert.DBNull) ? dr["id"].ToString() : "") + "\", \"payment_mode\" : \"authorize_net_cim_credit_card\", \"transaction_id\" : \"" + transaction_id + "\", \"payment_amount\" : \"" + obj.transaction.settleAmount + "\", \"payment_fee\" : \"" + obj.transaction.authAmount + "\", \"settlement_date\" : \"" + obj.transaction.batch.settlementTimeUTC + "\", \"payment_stauts\" : \"" + obj.transaction.batch.settlementState + "\"}";
                        //Console.WriteLine("Transaction Id: {0}", response.transaction.transId);
                        //Console.WriteLine("Transaction type: {0}", response.transaction.transactionType);
                        //Console.WriteLine("Transaction status: {0}", response.transaction.transactionStatus);
                        //Console.WriteLine("Transaction auth amount: {0}", response.transaction.authAmount);
                        //Console.WriteLine("Transaction settle amount: {0}", response.transaction.settleAmount);
                    }

                }
                if (!string.IsNullOrEmpty(str_meta))
                {
                    OrderRepository.UpdateUnsettledOrder("[" + str_meta + "]");
                }
            }
            catch { }//(Exception ex) { Console.WriteLine("Error: " + ex.Message); }
            return View();
        }
    }
}