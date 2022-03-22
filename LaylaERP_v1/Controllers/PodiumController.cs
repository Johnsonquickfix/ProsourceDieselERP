using LaylaERP.BAL;
using LaylaERP.UTILITIES;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using LaylaERP.Models;
using System.Text;

namespace LaylaERP.Controllers
{
    public class PodiumController : Controller
    {
        // GET: Podium
        public ActionResult paymentrec()
        {
            try
            {
                string _DBType = "MYSQL";
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

                                if (_DBType == "MSSQL")
                                {
                                    string str = "[{ post_id: " + id.ToString() + ", meta_key: '_podium_payment_uid', meta_value: '" + obj.data.payments[0].uid + "' }, { post_id: " + id.ToString() + ", meta_key: '_podium_location_uid', meta_value: '" + obj.data.location.uid + "' },"
                                            + "{ post_id: " + id.ToString() + ", meta_key: '_podium_invoice_number', meta_value: '" + obj.data.invoiceNumber + "' }, { post_id: " + id.ToString() + ", meta_key: '_podium_status', meta_value: 'PAID' }]";

                                    System.Xml.XmlDocument postsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                                    System.Xml.XmlDocument order_statsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                                    System.Xml.XmlDocument postmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                                    System.Xml.XmlDocument order_itemsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                                    System.Xml.XmlDocument order_itemmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + str + "}", "Items");

                                    OrderRepository.AddOrdersPost(id, "UPP", 0, str_note, postsXML, order_statsXML, postmetaXML, order_itemsXML, order_itemmetaXML);
                                }
                                else if (_DBType == "MYSQL")
                                {
                                    DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                                    string strSql_insert = string.Empty;
                                    StringBuilder strSql = new StringBuilder(string.Format("update wp_posts set post_modified='{0}',post_modified_gmt='{1}' where id = {2};", cDate.ToString("yyyy/MM/dd HH:mm:ss"), cUTFDate.ToString("yyyy/MM/dd HH:mm:ss"), id));
                                    strSql.Append(string.Format("update wp_woocommerce_gc_cards set is_active='on', delivered=1,create_date = UNIX_TIMESTAMP() where order_id={0};",id));
                                    strSql_insert += string.Format(" select '{0}' post_id,'{1}' meta_key,'{2}' meta_value", id, "_podium_payment_uid", obj.data.payments[0].uid);
                                    strSql_insert += string.Format(" union all select '{0}' post_id,'{1}' meta_key,'{2}' meta_value", id, "_podium_location_uid", obj.data.location.uid);
                                    strSql_insert += string.Format(" union all select '{0}' post_id,'{1}' meta_key,'{2}' meta_value", id, "_podium_invoice_number", obj.data.invoiceNumber);
                                    strSql_insert += string.Format(" union all select '{0}' post_id,'{1}' meta_key,'{2}' meta_value", id, "_podium_status", "PAID");

                                    strSql.Append(string.Format("update wp_postmeta set meta_value = '{0}' where post_id = '{1}' and meta_key = '{2}'; ", obj.data.payments[0].uid, id, "_podium_payment_uid"));
                                    strSql.Append(string.Format("update wp_postmeta set meta_value = '{0}' where post_id = '{1}' and meta_key = '{2}'; ", obj.data.location.uid, id, "_podium_location_uid"));
                                    strSql.Append(string.Format("update wp_postmeta set meta_value = '{0}' where post_id = '{1}' and meta_key = '{2}'; ", obj.data.invoiceNumber, id, "_podium_invoice_number"));
                                    strSql.Append(string.Format("update wp_postmeta set meta_value = '{0}' where post_id = '{1}' and meta_key = '{2}'; ", "PAID", id, "_podium_status"));

                                    strSql_insert = "insert into wp_postmeta (post_id,meta_key,meta_value) select * from (" + strSql_insert + ") as tmp where tmp.meta_key not in (select meta_key from wp_postmeta where post_id = " + id + ");";
                                    strSql.Append(strSql_insert);

                                    strSql.Append(string.Format("update wp_posts set post_status = '{0}',post_modified = '{1}', post_modified_gmt = '{2}' where id = {3};", "wc-processing", cDate.ToString("yyyy/MM/dd HH:mm:ss"), cUTFDate.ToString("yyyy/MM/dd HH:mm:ss"), id));
                                    strSql.Append("insert into wp_comments(comment_post_ID, comment_author, comment_author_email, comment_author_url, comment_author_IP, comment_date, comment_date_gmt, comment_content, comment_karma, comment_approved, comment_agent, comment_type, comment_parent, user_id) ");
                                    strSql.Append(string.Format("values ({0}, 'WooCommerce', 'woocommerce@laylasleep.com', '', '', '{1}', '{2}', '{3}', '0', '1', 'WooCommerce', 'order_note', '0', '0');", id, cDate.ToString("yyyy/MM/dd HH:mm:ss"), cUTFDate.ToString("yyyy/MM/dd HH:mm:ss"), "Payment completed through Podium by " + obj.data.customerName + " on " + cDate.ToString("MM-dd-yyyy HH:mm:ss")));

                                    DAL.MYSQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
                                }
                                if (id > 0)
                                {
                                    OrderRepository.OrderInvoiceMail(id);                                
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

                                DataSet giftdetails = GiftCardRepository.AddGiftCardMailOrders(id, "UPP", 0, str_note,"", postsXML, order_statsXML, postmetaXML, order_itemsXML, order_itemmetaXML);
                                GiftCardRepository.OrderInvoiceMail(id);
                                if (giftdetails.Tables[1].Rows[0]["delivered"].ToString() == "1")
                                {
                                    SendGiftCardEMails(giftdetails);
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
        public ActionResult todaysgift()
        {
            try
            {
                DataSet ds = GiftCardRepository.TodayGiftCardsList();
                if (ds.Tables[1].Rows[0]["delivered"].ToString() == "1")
                {
                    SendGiftCardEMails(ds);
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
                        delivered = dr["delivered"].ToString(),
                    };
                    status = true;
                    String renderedHTML = EmailNotificationsController.RenderViewToString("EmailNotifications", "SendGiftcard", model);
                    result = SendEmail.SendEmails(dr["recipient"].ToString(), "You have received a $" + model.balance + " Gift Card from from " + model.sender + "", renderedHTML);
                    Response.Write(result);
                  
                }
            }
            catch { status = false; result = ""; }

            return Json(new { status = status, message = result }, 0);
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
                    result = SendEmail.SendEmails(SenderEmailID,SenderEmailPwd,SMTPServerName,SMTPServerPortNo,SSL,dr["recipient"].ToString(), "You have received a $" + model.balance + " Gift Card from from " + model.sender + "", renderedHTML,string.Empty);
                    Response.Write(result);

                }
            }
            catch { status = false; result = ""; }

            return Json(new { status = status, message = result }, 0);
        }
    }
}