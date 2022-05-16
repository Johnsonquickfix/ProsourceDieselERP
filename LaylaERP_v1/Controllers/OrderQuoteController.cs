namespace LaylaERP.Controllers
{
    using UTILITIES;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using Newtonsoft.Json;
    using LaylaERP.BAL;
    using LaylaERP.Models;
    using System.Data;

    public class OrderQuoteController : Controller
    {
        // GET: OrderQuote
        public ActionResult Index(long id = 0, string qt = "m")
        {
            ViewBag.id = id; ViewBag.qt = qt;
            string pay_method = CommanUtilities.Provider.GetCurrent().Podium ? "{\"id\":\"podium\" ,\"text\":\"Podium\"}" : "";
            ViewBag.pay_option = "[" + pay_method + "]";
            return View();
        }
        // GET: OrderQuote
        public ActionResult History()
        {
            //OrderQuoteRepository.UpdateOrder(20220400031);
            return View();
        }

        [HttpPost]
        [Route("quote/quote-counts")]
        public JsonResult GetQuoteOrdersCount(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1)) fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2)) todate = Convert.ToDateTime(model.strValue2);
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                DataTable dt = OrderQuoteRepository.QuoteCounts(fromdate, todate, om.UserID);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpGet]
        [Route("quote/quote-list")]
        public JsonResult GetQuoteOrderList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1))
                    fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    todate = Convert.ToDateTime(model.strValue2);
                long customerid = 0;
                if (!string.IsNullOrEmpty(model.strValue3))
                    customerid = Convert.ToInt64(model.strValue3);

                //DataTable dt = OrderRepository.OrderList(model.strValue1, model.strValue2, model.strValue3, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                DataTable dt = OrderQuoteRepository.QuoteList(fromdate, todate, customerid, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }
        [HttpPost]
        public JsonResult CreateQuote(OrderQuoteModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                if (string.IsNullOrEmpty(model.quote_header))
                {
                    return Json("[{\"response\":\"Please select customer info.\",\"id\":0}]", JsonRequestBehavior.AllowGet);
                }
                if (string.IsNullOrEmpty(model.quote_product))
                {
                    return Json("[{\"response\":\"Your cart is empty. Please add products in cart.\",\"id\":0}]", JsonRequestBehavior.AllowGet);
                }
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                JSONresult = JsonConvert.SerializeObject(OrderQuoteRepository.AddOrdersQuote(model.id, om.UserID, model.quote_header, model.quote_product));
            }
            catch (Exception ex) { return Json("[{\"response\":\"" + ex.Message + ".\",\"id\":0}]", JsonRequestBehavior.AllowGet); }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetQuoteDetails(OrderQuoteModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                JSONresult = JsonConvert.SerializeObject(OrderQuoteRepository.GetOrdersQuote(model.id));
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }

        [Route("quote/accept")]
        public ActionResult QuoteApproval(string id, string uid, string key)
        {
            if (!string.IsNullOrEmpty(id))
            {
                long user_id = 0, quote_id = 0;
                PurchaseOrderModel obj = new PurchaseOrderModel();
                if (!string.IsNullOrEmpty(uid))
                {
                    user_id = Convert.ToInt64(UTILITIES.CryptorEngine.Decrypt(uid.Replace(" ", "+")));
                }
                if (!string.IsNullOrEmpty(uid))
                    quote_id = Convert.ToInt64(UTILITIES.CryptorEngine.Decrypt(id.Replace(" ", "+")));
                else
                    quote_id = 0;
                if (user_id > 0 && quote_id > 0)
                {
                    DataTable dt = OrderQuoteRepository.QuoteApproval(quote_id, "wc-approved", key);
                    if (dt.Rows.Count > 0)
                    {
                        ViewBag.status = dt.Rows[0]["response"].ToString();
                        ViewBag.id = id;

                        if (Convert.ToBoolean(dt.Rows[0]["status"]))
                        {
                            string result = string.Empty;
                            try
                            {
                                result = clsPodium.CreatePodiumInvoice(dt.Rows[0]["billing_email"].ToString().Trim(), dt.Rows[0]["customer_name"].ToString().Trim(), "INV-" + quote_id, dt.Rows[0]["lineitems"].ToString().Trim(), dt.Rows[0]["transaction_id"].ToString().Trim());
                                dynamic _json = JsonConvert.DeserializeObject<dynamic>(result);
                                string str_json = "{\"quote_no\" : " + quote_id.ToString() + ",\"payment_method\" : \"podium\",\"transaction_id\" : \"" + _json.data.uid + "\",\"payment_status\" : \"SENT\",\"quote_status\" : \"wc-pendingpodiuminv\"}";
                                OrderQuoteRepository.UpdatePodiumDetails("UPTRNS", quote_id, 0, str_json);

                            }
                            catch (Exception ex) { }
                        }
                    }
                    else
                    {
                        ViewBag.status = "You don't have permission to access please contact administrator.";
                        ViewBag.id = "0";
                    }
                }
                else
                {
                    ViewBag.status = "You don't have permission to access please contact administrator.";
                    ViewBag.id = "0";
                }
            }
            return View();
        }
        [Route("quote/reject")]
        public ActionResult QuoteDisapprove(string id, string uid, string key)
        {
            if (!string.IsNullOrEmpty(id))
            {
                long user_id = 0, quote_id = 0;
                PurchaseOrderModel obj = new PurchaseOrderModel();
                if (!string.IsNullOrEmpty(uid))
                {
                    user_id = Convert.ToInt64(UTILITIES.CryptorEngine.Decrypt(uid.Replace(" ", "+")));
                }
                if (!string.IsNullOrEmpty(uid))
                    quote_id = Convert.ToInt64(UTILITIES.CryptorEngine.Decrypt(id.Replace(" ", "+")));
                else
                    quote_id = 0;
                if (user_id > 0 && quote_id > 0)
                {
                    DataTable dt = OrderQuoteRepository.QuoteApproval(quote_id, "wc-rejected", key);
                    if (dt.Rows.Count > 0)
                    {
                        ViewBag.status = dt.Rows[0]["response"].ToString();
                        ViewBag.id = obj.RowID;
                    }
                    else
                    {
                        ViewBag.status = "You don't have permission to access please contact administrator.";
                        ViewBag.id = "0";
                    }
                }
                else
                {
                    ViewBag.status = "You don't have permission to access please contact administrator.";
                    ViewBag.id = "0";
                }
            }
            return View();
        }
        [HttpPost]
        public JsonResult SendApprovalMail(OrderQuoteModel model)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                DataSet ds = OrderQuoteRepository.GetOrdersQuote(model.id);
                status = true;
                String renderedHTML = EmailNotificationsController.RenderViewToString("EmailNotifications", "QuoteOrderMail", ds);

                result = SendEmail.SendEmails_outer(model.quote_header, "Your Quote #" + model.id + " has been received", renderedHTML, string.Empty);
            }
            catch (Exception ex) { status = false; result = ex.Message; }
            return Json(new { status = status, message = result }, 0);
        }

        [Route("quote/payment-update")]
        [HttpPost]
        public JsonResult UpdatePodiumPaymentAccept(OrderQuoteModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                JSONresult = JsonConvert.SerializeObject(OrderQuoteRepository.UpdatePodiumDetails("UPTRNS", model.id, 0, model.quote_header));
                string host = Request.ServerVariables["HTTP_ORIGIN"];
                long id = OrderQuoteRepository.CreateOrder(model.id, host);
                if (id > 0)
                {
                    if (OrderQuoteRepository.UpdateOrder(model.id) > 0)
                    {
                        string strSql = string.Format("update erp_order_quote set order_status = 'wc-processing',modified_date = getdate(),modified_date_gmt = GETUTCDATE() where quote_no = {0};", model.id);

                        var result = DAL.SQLHelper.ExecuteNonQuery(strSql);
                    }
                    OrderRepository.OrderInvoiceMail(id);
                }
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [Route("quote/quote-order-mail")]
        public ActionResult QuoteOrderMail()
        {
            string ids = "0", gc_ids = "0";
            DataSet ds = DAL.SQLHelper.ExecuteDataSet("select quote_no,order_id,order_status,order_mail,order_gc_mail,modified_date_gmt from erp_order_quote where order_status = 'wc-processing' and order_mail = 0; Select oq.quote_no,gc.order_id,gc.code,gc.recipient,gc.sender,gc.sender_email,message,balance,delivered from wp_woocommerce_gc_cards gc inner join erp_order_quote oq on oq.order_id = gc.order_id and oq.order_gc_mail = 0 where delivered = 0;");
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                try
                {
                    OrderRepository.OrderInvoiceMail(Convert.ToInt64(dr["order_id"]));
                    ids += (string.IsNullOrEmpty(ids) ? "" : ",") + dr["quote_no"].ToString();
                }
                catch { }
            }
            foreach (DataRow dataRow in ds.Tables[1].Rows)
            {
                GiftCardModel _obj = new GiftCardModel
                {
                    order_id = Convert.ToInt64(dataRow["order_id"]),
                    code = dataRow["code"].ToString(),
                    recipient = dataRow["recipient"].ToString(),
                    sender = dataRow["sender"].ToString(),
                    sender_email = dataRow["sender_email"].ToString(),
                    message = dataRow["message"].ToString(),
                    balance = Convert.ToDouble(dataRow["balance"]),
                    delivered = dataRow["delivered"].ToString(),
                };
                try
                {
                    String renderedHTML = EmailNotificationsController.RenderViewToString("EmailNotifications", "SendGiftcard", _obj);
                    SendEmail.SendEmails_outer(dataRow["recipient"].ToString(), "You have received a $" + _obj.balance + " Gift Card from from " + _obj.sender + "", renderedHTML, string.Empty);
                }
                catch { }
                gc_ids += (string.IsNullOrEmpty(gc_ids) ? "" : ",") + dataRow["quote_no"].ToString();
            }
            if (!string.IsNullOrEmpty(ids))
            {
                string strSql = string.Format("update erp_order_quote set order_mail = 1 where quote_no in ({0});update erp_order_quote set order_gc_mail = 1 where quote_no in ({1});", ids, gc_ids);
                DAL.SQLHelper.ExecuteNonQuery(strSql);
            }
            return View();
        }
        [Route("quote/podium-payment-sync")]
        public ActionResult PodiumPaymentReceipt()
        {
            try
            {
                DataTable dt = DAL.SQLHelper.ExecuteDataTable("select quote_no,quote_status,transaction_id,payment_status from erp_order_quote where quote_status = 'wc-pendingpodiuminv' and payment_status = 'SENT';");
                string access_token = clsPodium.GetToken();
                foreach (DataRow dr in dt.Rows)
                {
                    if (dr["transaction_id"] != DBNull.Value)
                    {
                        var result = clsPodium.GetPodiumInvoiceDetails(access_token, dr["transaction_id"].ToString());
                        dynamic obj = JsonConvert.DeserializeObject<dynamic>(result);
                        try
                        {
                            string status = obj.data.status;
                            long quote_no = Convert.ToInt64(dr["quote_no"]);
                            if (status.ToUpper() == "PAID")
                            {
                                string str = "{\"quote_no\": " + quote_no + ", \"payment_method\": \"podium\", \"transaction_id\": \"" + dr["transaction_id"].ToString() + "\", \"payment_status\": \"PAID\", \"quote_status\": \"wc-podium\", \"payment_meta\" : \"[{ 'meta_key': '_podium_payment_uid','meta_value': '" + obj.data.payments[0].uid + "'},{'meta_key':'_podium_location_uid','meta_value':'" + obj.data.location.uid + "'},"
                                        + "{ 'meta_key': '_podium_invoice_number', 'meta_value': '" + obj.data.invoiceNumber + "'}, {'meta_key': '_podium_status', 'meta_value': 'PAID'}]\"}";

                                OrderQuoteRepository.UpdatePodiumDetails("UPTRNS", quote_no, 0, str);

                                string host = Request.ServerVariables["HTTP_ORIGIN"];
                                long id = OrderQuoteRepository.CreateOrder(quote_no, host);
                                if (id > 0)
                                {
                                    if (OrderQuoteRepository.UpdateOrder(quote_no) > 0)
                                    {
                                        string strSql = string.Format("update erp_order_quote set order_status = 'wc-processing',modified_date = getdate(),modified_date_gmt = GETUTCDATE() where quote_no = {0};", quote_no);
                                        DAL.SQLHelper.ExecuteNonQuery(strSql);
                                    }
                                }
                            }
                        }
                        catch { }
                    }
                }
            }
            catch { }
            return View();
        }
    }
}