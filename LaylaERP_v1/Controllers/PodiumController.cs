﻿using LaylaERP.BAL;
using LaylaERP.UTILITIES;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using LaylaERP.Models;

namespace LaylaERP.Controllers
{
    public class PodiumController : Controller
    {
        // GET: Podium
        public ActionResult paymentrec()
        {
            try
            {
                DataTable dt = OrderRepository.GetPodiumOrdersList();
                string access_token = clsPodium.GetToken();
                foreach (DataRow dr in dt.Rows)
                {
                    if (dr["podium_uid"] != DBNull.Value)
                    {
                        var result = clsPodium.GetPodiumInvoiceDetails(access_token, dr["podium_uid"].ToString());
                        dynamic obj = JsonConvert.DeserializeObject<dynamic>(result);
                        try
                        {
                            string status = obj.data.status;
                            if (status.ToUpper() == "PAID")
                            {
                                long id = Convert.ToInt64(dr["id"].ToString());
                                string str_note = obj.data.customerName;
                                //OrderPodiumDetailsModel model = new OrderPodiumDetailsModel();
                                //model.post_id = Convert.ToInt64(dr["id"].ToString());
                                //model.payment_uid = obj.data.payments[0].uid; model.location_uid = obj.data.location.uid; model.invoice_number = obj.data.invoiceNumber;
                                //model.order_note = "Payment completed through Podium by " + obj.data.customerName + " on ";
                                //OrderRepository.UpdatePodiumStatus(model);
                                string str = "[{ post_id: " + id.ToString() + ", meta_key: '_podium_payment_uid', meta_value: '" + obj.data.payments[0].uid + "' }, { post_id: " + id.ToString() + ", meta_key: '_podium_location_uid', meta_value: '" + obj.data.location.uid + "' },"
                                            + "{ post_id: " + id.ToString() + ", meta_key: '_podium_invoice_number', meta_value: '" + obj.data.invoiceNumber + "' }, { post_id: " + id.ToString() + ", meta_key: '_podium_status', meta_value: 'PAID' }]";

                                System.Xml.XmlDocument postsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                                System.Xml.XmlDocument order_statsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                                System.Xml.XmlDocument postmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                                System.Xml.XmlDocument order_itemsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                                System.Xml.XmlDocument order_itemmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + str + "}", "Items");

                                OrderRepository.AddOrdersPost(id, "UPP", 0, str_note, postsXML, order_statsXML, postmetaXML, order_itemsXML, order_itemmetaXML);
                            }
                        }
                        catch { }
                    }
                }
            }
            catch { }
            return View();
        }
        public ActionResult paymentgcrec()
        {
            try
            {
                DataTable dt = GiftCardRepository.GetPodiumGiftOrdersList();
                string access_token = clsPodium.GetToken();
                foreach (DataRow dr in dt.Rows)
                {
                    if (dr["podium_uid"] != DBNull.Value)
                    {
                        var result = clsPodium.GetPodiumInvoiceDetails(access_token, dr["podium_uid"].ToString());
                        dynamic obj = JsonConvert.DeserializeObject<dynamic>(result);
                        try
                        {
                            string status = obj.data.status;
                            if (status.ToUpper() == "PAID")
                            {
                                long id = Convert.ToInt64(dr["id"].ToString());
                                string str_note = obj.data.customerName;
                                
                                string str = "[{ post_id: " + id.ToString() + ", meta_key: '_podium_payment_uid', meta_value: '" + obj.data.payments[0].uid + "' }, { post_id: " + id.ToString() + ", meta_key: '_podium_location_uid', meta_value: '" + obj.data.location.uid + "' },"
                                            + "{ post_id: " + id.ToString() + ", meta_key: '_podium_invoice_number', meta_value: '" + obj.data.invoiceNumber + "' }, { post_id: " + id.ToString() + ", meta_key: '_podium_status', meta_value: 'PAID' }]";

                                System.Xml.XmlDocument postsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                                System.Xml.XmlDocument order_statsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                                System.Xml.XmlDocument postmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                                System.Xml.XmlDocument order_itemsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                                System.Xml.XmlDocument order_itemmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + str + "}", "Items");

                                DataTable giftdetails = GiftCardRepository.AddGiftCardOrdersPost(id, "UPP", 0, str_note, postsXML, order_statsXML, postmetaXML, order_itemsXML, order_itemmetaXML);
                                SendGiftCardMailInvoice(giftdetails);
                            }
                        }
                        catch { }
                    }
                }
            }
            catch { }
            return View();
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
                    };
                    status = true;
                    String renderedHTML = EmailNotificationsController.RenderViewToString("EmailNotifications", "SendGiftcard", model);
                    result = SendEmail.SendEmails(model.recipient, "You have received a $" + model.balance + " Gift Card from from " + model.sender + "", renderedHTML);
                }
            }
            catch { status = false; result = ""; }
            
            return Json(new { status = status, message = result }, 0);
        }
    }
}