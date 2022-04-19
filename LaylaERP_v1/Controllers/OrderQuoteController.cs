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
        public ActionResult Index(long id = 0)
        {
            ViewBag.id = id;
            string pay_method = CommanUtilities.Provider.GetCurrent().Podium ? "{\"id\":\"podium\" ,\"text\":\"Podium\"}" : "";
            ViewBag.pay_option = "[" + pay_method + "]";
            return View();
        }
        // GET: OrderQuote
        public ActionResult History()
        {
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
            catch { }
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

                result = SendEmail.SendEmails_outer(model.quote_header, "Your order #" + model.id + " has been received", renderedHTML, string.Empty);
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
                }
            }
            catch { }
            return Json(JSONresult, 0);
        }
    }
}