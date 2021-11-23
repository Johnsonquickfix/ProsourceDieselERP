using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
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
        [HttpPost]
        public ActionResult GiftCard(FormCollection collection)
        {
            string giftamount = collection["hfAmount"];
            if (giftamount == "Other")
            {
                giftamount = collection["amount"];
            }
            string GiftToMultiple = collection["GiftToMultiple"].TrimEnd(',');
            string[] Emaillist = GiftToMultiple.Split(',');

            string senderemail = collection["GiftFrom"];
            string FirstName = "", LastName = "", Company = "", Country = "", State = "", City = "", Zipcode = "", Address = "", Address2 = "", PhoneNumber = "", OrderNotes = "";
           
            DataTable data = new GiftCardRepository().GetCustomerAddressByEmail(senderemail);
            if (data.Rows.Count > 0)
            {
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
        public ActionResult ordermeta(GiftCardModel model,long id = 0)
        {
            ViewBag.id = id;
            if (id > 0)
            {
                List<string> Emaillist = new List<string>();
                Emaillist.Add("steven.quickfix@gmail.com");
                model.recipientList = Emaillist.ToList();
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

                JSONresult = JsonConvert.SerializeObject(GiftCardRepository.AddGiftCardOrdersPost(model.order_id, "I", om.UserID, om.UserName, postsXML, order_statsXML, postmetaXML, order_itemsXML, order_itemmetaXML));
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
                return Json(new { status = true, message = "Gift Card Status has been Changed successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }
    }
}