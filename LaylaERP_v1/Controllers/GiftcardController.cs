using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class GiftcardController : Controller
    {
        // GET: Giftcard
        public ActionResult Giftcard()
        {
            return View();
        }
        public ActionResult GiftCardList()
        {
            return View();
        }
        public ActionResult GiftCardActivity()
        {
            return View();
        }
        [HttpPost]
        public ActionResult GiftCard(FormCollection collection)
        {
            string giftamount = collection["hfAmount"];
            if (giftamount == "Other") { giftamount = collection["amount"]; }
            string GiftToMultiple = collection["GiftToMultiple"].TrimEnd(',');
            string[] Emaillist = GiftToMultiple.Split(',');
            string senderemail = collection["GiftFrom"].Trim();
            string FirstName = "", LastName = "", Company = "", Country = "", State = "", City = "", Zipcode = "", Address = "", Address2 = "", PhoneNumber = "", OrderNotes = "";
            string message = collection["GiftMessage"];
            string delivery_date = collection["DeliveryDate"];
            int oid = 0;

            List<OrderPostMetaModel> postmeta = new List<OrderPostMetaModel>();
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_order_key", meta_value = "wc_order_" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_customer_user", meta_value = "0" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_payment_method", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_payment_method_title", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_customer_ip_address", meta_value = "::1" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_customer_user_agent", meta_value = "0" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_created_via", meta_value = "checkout" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_cart_hash", meta_value = "0" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_billing_company", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_shipping_company", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_billing_first_name", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_billing_last_name", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_billing_address_1", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_billing_address_2", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_billing_city", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_billing_state", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_billing_postcode", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_billing_country", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_billing_email", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_billing_phone", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_order_version", meta_value = "4.8.0" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_prices_include_tax", meta_value = "no" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_shipping_address_index", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "is_vat_exempt", meta_value = "no" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_download_permissions_granted", meta_value = "yes" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_recorded_sales", meta_value = "yes" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_recorded_coupon_usage_counts", meta_value = "yes" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_order_stock_reduced", meta_value = "yes" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_edit_lock", meta_value = "1" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_shipping_first_name", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_shipping_last_name", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_shipping_address_1", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_shipping_address_2", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_shipping_city", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_shipping_state", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_shipping_postcode", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_shipping_country", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_shipping_email", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_shipping_phone", meta_value = "" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_order_currency", meta_value = "0.00" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_order_total", meta_value = "0.00" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_cart_discount", meta_value = "0.00" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_cart_discount_tax", meta_value = "0" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_order_shipping", meta_value = "0.00" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_order_shipping_tax", meta_value = "0.00" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "_order_tax", meta_value = "0.00" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "employee_id", meta_value = "0" });
            postmeta.Add(new OrderPostMetaModel { post_id = oid, meta_key = "employee_name", meta_value = "0.00" });

            string[] order_stats_XML = new string[] { };
            string[] order_items_XML = new string[] { };

            OrderModel omodel = new OrderModel();
            omodel.order_statsXML = JsonConvert.SerializeObject(order_stats_XML);
            omodel.postmetaXML = JsonConvert.SerializeObject(postmeta);
            omodel.order_itemsXML = JsonConvert.SerializeObject(order_items_XML);

            OperatorModel om = CommanUtilities.Provider.GetCurrent();
            System.Xml.XmlDocument postsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
            System.Xml.XmlDocument order_statsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + omodel.order_statsXML + "}", "Items");
            System.Xml.XmlDocument postmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + omodel.postmetaXML + "}", "Items");
            System.Xml.XmlDocument order_itemsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + omodel.order_itemsXML + "}", "Items");
            System.Xml.XmlDocument order_itemmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":[{ post_id: " + omodel.order_id + ", meta_key: '_customer_ip_address', meta_value: '" + Net.Ip + "' }, { post_id: " + omodel.order_id + ", meta_key: '_customer_user_agent', meta_value: '" + Net.BrowserInfo + "' }]}", "Items");

            DataTable data = GiftCardRepository.AddGiftCardOrders(omodel.order_id, "I", om.UserID, om.UserName, senderemail, postsXML, order_statsXML, postmetaXML, order_itemsXML, order_itemmetaXML);

            if (data.Rows.Count > 0)
            {
                oid = Convert.ToInt32(data.Rows[0]["id"].ToString());
                FirstName = data.Rows[0]["FirstName"].ToString();
                LastName = data.Rows[0]["LastName"].ToString();
                Company = data.Rows[0]["Company"].ToString();
                Country = data.Rows[0]["Country"].ToString();
                State = data.Rows[0]["State"].ToString();
                City = data.Rows[0]["City"].ToString();
                Zipcode = data.Rows[0]["ZipCode"].ToString();
                Address = data.Rows[0]["Address1"].ToString();
                Address2 = data.Rows[0]["Address2"].ToString();
                PhoneNumber = data.Rows[0]["Phone"].ToString();
                OrderNotes = data.Rows[0]["Company"].ToString();

            }
            GiftCardModel model = new GiftCardModel
            {
                order_id = oid,
                amount = Convert.ToDecimal(giftamount),
                recipient = GiftToMultiple,
                sender_email = senderemail,
                message = collection["GiftMessage"],
                delivery_date = collection["DeliveryDate"],
                FirstName = FirstName,
                LastName = LastName,
                Company = Company,
                Country = Country,
                State = State,
                City = City,
                Zipcode = Zipcode,
                Address = Address,
                Address2 = Address2,
                PhoneNumber = PhoneNumber,
                OrderNotes = OrderNotes,
                recipientList = Emaillist.ToList(),
                qty = Emaillist.Length,
            };
            return View("ordermeta", model);
        }

        //public ActionResult GiftCard(FormCollection collection)
        //{
        //    string giftamount = collection["hfAmount"];
        //    if (giftamount == "Other")
        //    {
        //        giftamount = collection["amount"];
        //    }
        //    string GiftToMultiple = collection["GiftToMultiple"].TrimEnd(',');
        //    string[] Emaillist = GiftToMultiple.Split(',');

        //    string senderemail = collection["GiftFrom"];
        //    string FirstName = "", LastName = "", Company = "", Country = "", State = "", City = "", Zipcode = "", Address = "", Address2 = "", PhoneNumber = "", OrderNotes = "";

        //    DataTable data = new GiftCardRepository().GetCustomerAddressByEmail(senderemail);
        //    if (data.Rows.Count > 0)
        //    {
        //        FirstName = data.Rows[0]["FirstName"].ToString();
        //        LastName = data.Rows[0]["LastName"].ToString();
        //        Company = data.Rows[0]["Company"].ToString();
        //        Country = data.Rows[0]["Country"].ToString();
        //        State = data.Rows[0]["State"].ToString();
        //        City = data.Rows[0]["City"].ToString();
        //        Zipcode = data.Rows[0]["ZipCode"].ToString();
        //        Address = data.Rows[0]["Address1"].ToString();
        //        Address2 = data.Rows[0]["Address2"].ToString();
        //        PhoneNumber = data.Rows[0]["Phone"].ToString();
        //        OrderNotes = data.Rows[0]["Company"].ToString();

        //    }
        //    GiftCardModel model = new GiftCardModel
        //    {
        //        amount = Convert.ToDecimal(giftamount),
        //        recipient = GiftToMultiple,
        //        sender_email = senderemail,
        //        message = collection["GiftMessage"],
        //        delivery_date = collection["DeliveryDate"],
        //        FirstName = FirstName,
        //        LastName = LastName,
        //        Company = Company,
        //        Country = Country,
        //        State = State,
        //        City = City,
        //        Zipcode = Zipcode,
        //        Address = Address,
        //        Address2 = Address2,
        //        PhoneNumber = PhoneNumber,
        //        OrderNotes = OrderNotes,
        //        recipientList = Emaillist.ToList(),
        //        qty = Emaillist.Length,
        //    };
        //    return View("ordermeta", model);
        //}
        public ActionResult ordermeta(GiftCardModel model, long id = 0)
        {
            if (id > 0)
            {
                DataTable data = new GiftCardRepository().GetOrderInfoByGCID(id);
                string GiftToMultiple = data.Rows[0]["Recipient"].ToString().TrimEnd(',');
                string[] Emaillist = GiftToMultiple.Split(',');
                model.order_id = Convert.ToInt32(data.Rows[0]["post_id"]);
                model.sender_email = data.Rows[0]["sender_email"].ToString();
                model.FirstName = data.Rows[0]["FirstName"].ToString();
                model.LastName = data.Rows[0]["LastName"].ToString();
                model.Company = data.Rows[0]["Company"].ToString();
                model.Country = data.Rows[0]["Country"].ToString();
                model.State = data.Rows[0]["State"].ToString();
                model.City = data.Rows[0]["City"].ToString();
                model.Zipcode = data.Rows[0]["ZipCode"].ToString();
                model.Address = data.Rows[0]["Address"].ToString();
                model.Address2 = data.Rows[0]["Address2"].ToString();
                model.PhoneNumber = data.Rows[0]["PhoneNumber"].ToString();
                model.OrderNotes = data.Rows[0]["Company"].ToString();
                model.recipient = GiftToMultiple;
                model.recipientList = Emaillist.ToList();

                model.message = data.Rows[0]["Message"].ToString();
                model.qty = Convert.ToInt32(data.Rows[0]["Qty"].ToString());
                model.amount = Convert.ToDecimal(data.Rows[0]["amount"].ToString()) / model.qty;
                return View(model);
            }
            else
            {
                return View(model);
            }
        }
        [HttpPost]
        public JsonResult SaveGiftCardOrder(OrderModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                System.Xml.XmlDocument postsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_statsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.order_statsXML + "}", "Items");
                System.Xml.XmlDocument postmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.postmetaXML + "}", "Items");
                System.Xml.XmlDocument order_itemsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.order_itemsXML + "}", "Items");
                System.Xml.XmlDocument order_itemmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":[{ post_id: " + model.order_id + ", meta_key: '_customer_ip_address', meta_value: '" + Net.Ip + "' }, { post_id: " + model.order_id + ", meta_key: '_customer_user_agent', meta_value: '" + Net.BrowserInfo + "' }]}", "Items");

                JSONresult = JsonConvert.SerializeObject(GiftCardRepository.AddGiftCardOrders(model.order_id, "U", om.UserID, om.UserName, "", postsXML, order_statsXML, postmetaXML, order_itemsXML, order_itemmetaXML));
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SendMailInvoice(OrderModel model)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                status = true;
                String renderedHTML = EmailNotificationsController.RenderViewToString("EmailNotifications", "GiftCardOrder", model);

                result = SendEmail.SendEmails(model.b_email, "Your order #" + model.order_id + " has been received", renderedHTML);
            }
            catch { status = false; result = ""; }
            return Json(new { status = status, message = result }, 0);
        }
        [HttpGet]
        public JsonResult GetGiftCardOrderList(JqDataTableModel model)
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

                DataTable dt = GiftCardRepository.GiftCardOrderList(fromdate, todate, model.strValue3, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }
        [HttpPost]
        public JsonResult ChangeGiftCardStatus(SearchModel model)
        {
            string strID = model.strValue1;
            if (strID != "")
            {
                new GiftCardRepository().ChangeGiftCardStatus(model, strID);
                return Json(new { status = true, message = "Status changed successfully!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }
        }
        [HttpPost]
        public JsonResult ChangeGiftCardOrderStatus(SearchModel model)
        {
            string strID = model.strValue1;
            if (strID != "")
            {
                DataTable dt = new GiftCardRepository().ChangeGiftCardOrderStatus(strID);
                return Json(new { status = dt.Rows[0]["status"].ToString(), message = dt.Rows[0]["Message"], url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }
        }
        [HttpPost]
        public JsonResult GetRedeemedCustomerList(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = GiftCardRepository.GetRedeemedCustomers(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult ResendMailInvoice(GiftCardModel model)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                DataTable dt = GiftCardRepository.GetGiftCardDetails(model.order_id);
                if (dt.Rows.Count > 0)
                {
                    foreach (DataRow dr in dt.Rows)
                    {
                        model.order_id = Convert.ToInt64(dr["order_id"]);
                        model.code = dr["code"].ToString();
                        model.recipient = dr["recipient"].ToString();
                        model.sender = dr["sender"].ToString();
                        model.sender_email = dr["sender_email"].ToString();
                        model.message = dr["message"].ToString();
                        model.balance = Convert.ToDouble(dr["remaining"]);
                        model.delivered = dr["delivered"].ToString();
                        model.is_active = dr["is_active"].ToString();
                        if (model.delivered == "1" && model.is_active.Trim() == "on")
                        {
                            status = true;
                            String renderedHTML = EmailNotificationsController.RenderViewToString("EmailNotifications", "SendGiftcard", model);
                            result = SendEmail.SendEmails(model.recipient, "You have received a $" + model.balance + " Gift Card from " + model.sender + "", renderedHTML);
                        }
                        else
                        {
                            result = "Gift card is InActive";
                        }
                        // Response.Write(result);
                    }
                }

            }
            catch { status = false; result = ""; }

            return Json(new { status = status, message = result }, 0);
        }
        [HttpPost]
        public JsonResult UpdatePaymentInvoiceID(OrderModel model)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                int res = GiftCardRepository.UpdatePaymentInvoice(model.OrderPostMeta);
                if (res > 0)
                {
                    result = "Order placed successfully.";
                    status = true;
                }
            }
            catch { status = false; result = ""; }
            return Json(new { status = status, message = result }, 0);
        }
        public JsonResult UpdatePaypalPaymentAccept(OrderModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                System.Xml.XmlDocument postsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_statsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument postmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_itemsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_itemmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.order_itemmetaXML + "}", "Items");

                DataSet giftdetails = GiftCardRepository.AddGiftCardMailOrders(model.order_id, "UPP", 0, model.b_first_name, "", postsXML, order_statsXML, postmetaXML, order_itemsXML, order_itemmetaXML);
                JSONresult = JsonConvert.SerializeObject(giftdetails);
                if (giftdetails.Tables[1].Rows[0]["delivered"].ToString() == "1")
                {
                    SendGiftCardEMails(giftdetails);
                }

            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult SendGiftCardEMails(DataSet ds)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                string SenderEmailID = string.Empty, SenderEmailPwd = string.Empty, SMTPServerName = string.Empty;
                int SMTPServerPortNo = 587; bool SSL = false;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    SenderEmailID = (dr["SenderEmailID"] != Convert.DBNull) ? dr["SenderEmailID"].ToString() : "";
                    SenderEmailPwd = (dr["SenderEmailPwd"] != Convert.DBNull) ? dr["SenderEmailPwd"].ToString() : "";
                    SMTPServerName = (dr["SMTPServerName"] != Convert.DBNull) ? dr["SMTPServerName"].ToString() : "";
                    //SMTPServerPortNo = (dr["SMTPServerPortNo"] != Convert.DBNull) ? Convert.ToInt32(dr["SMTPServerPortNo"].ToString()) : 25;
                    //SSL = (dr["SSL"] != Convert.DBNull) ? Convert.ToBoolean(dr["SSL"]) : false;
                }
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    GiftCardModel model = new GiftCardModel
                    {
                        order_id = Convert.ToInt64(dr["order_id"]),
                        code = dr["code"].ToString(),
                        recipient = dr["recipient"].ToString(),
                        sender = dr["sender"].ToString(),
                        sender_email = dr["sender_email"].ToString(),
                        message = dr["message"].ToString(),
                        balance = Convert.ToDouble(dr["balance"]),
                        delivered = dr["delivered"].ToString(),
                    };
                    status = true;
                    String renderedHTML = EmailNotificationsController.RenderViewToString("EmailNotifications", "SendGiftcard", model);
                    result = SendEmail.SendEmails(SenderEmailID, SenderEmailPwd, SMTPServerName, SMTPServerPortNo, SSL, dr["recipient"].ToString(), "You have received a $" + model.balance + " Gift Card from from " + model.sender + "", renderedHTML, string.Empty);


                }
            }
            catch { status = false; result = ""; }

            return Json(new { status = status, message = result }, 0);
        }
        public JsonResult SendGiftCardMailInvoice(DataTable dt)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                foreach (DataRow dr in dt.Rows)
                {
                    GiftCardModel model = new GiftCardModel
                    {
                        order_id = Convert.ToInt64(dr["order_id"]),
                        code = dr["code"].ToString(),
                        recipient = dr["recipient"].ToString(),
                        sender = dr["sender"].ToString(),
                        sender_email = dr["sender_email"].ToString(),
                        message = dr["message"].ToString(),
                        balance = Convert.ToDouble(dr["balance"]),
                        delivered = dr["delivered"].ToString(),
                    };
                    status = true;
                    String renderedHTML = EmailNotificationsController.RenderViewToString("EmailNotifications", "SendGiftcard", model);
                    result = SendEmail.SendEmails(model.recipient, "You have received a $" + model.balance + " Gift Card from " + model.sender + "", renderedHTML);
                }
            }
            catch { status = false; result = ""; }

            return Json(new { status = status, message = result }, 0);
        }

        [HttpPost]
        public JsonResult GetGCActivity(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = GiftCardRepository.GiftCardActivity(model.strValue1);
                result = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(result, 0);
        }
        public JsonResult GetGCActivityList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {

                DataTable dt = GiftCardRepository.GiftCardActivityList(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }
    }
}